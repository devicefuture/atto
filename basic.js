import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";
import * as audio from "./audio.js";
import * as syntax from "./syntax.js";
import * as commands from "./commands.js";
import * as extensions from "./extensions.js";

export const MAX_STACK_SIZE = 100;
export const MAX_RENDER_HOLD_TIME = 10;
export const MAX_RENDER_CALL_DEPTH = 100;

export const trigModes = {
    DEGREES: 0,
    RADIANS: 1,
    GRADIANS: 2,
    TURNS: 3
};

export var fileExporter;
export var fileImporter;

export var editingProgram = [];
export var parsedProgram = [];
export var programLabels = {};
export var programVariables = {};
export var programStack = [];
export var running = false;
export var currentPosition = 0;
export var renderHoldTime = 0;
export var renderCallDepth = 0;
export var trigMode = trigModes.DEGREES;
export var graphicsX = 0;
export var graphicsY = 0;
export var graphicsStrokeWidth = 1;
export var graphicsPolygonPoints = [];
export var turtleHeading = Math.PI / 2;
export var turtlePenDown = true;
export var turtleShown = true;
export var turtleNotMoved = true;
export var lastConditionalState = null;
export var delayTimeout = null;
export var currentKey = "";

export class BasicError extends Error {
    constructor(message, lineNumber) {
        super(message);

        this.lineNumber = lineNumber;

        this.name = this.constructor.name;
    }
}

export class ParsingSyntaxError extends BasicError {}

export class RuntimeError extends BasicError {}

export class Command {
    constructor(callable, parameters = []) {
        this.callable = callable;
        this.parameters = parameters;
    }

    call() {
        return this.callable(...this.parameters);
    }
}

export class OpeningCommand extends Command {}

export class ClosingCommand extends Command {}

export function trigModeToRadians(value, mode = trigMode) {
    if (mode == trigModes.RADIANS) {
        return value;
    }

    if (mode == trigModes.DEGREES) {
        return value * (Math.PI / 180);
    }

    if (mode == trigModes.GRADIANS) {
        return value * (Math.PI / 200);
    }

    if (mode == trigModes.TURNS) {
        return value * (2 * Math.PI);
    }
}

export function radiansToTrigMode(value, mode = trigMode) {
    if (mode == trigModes.RADIANS) {
        return value;
    }

    if (mode == trigModes.DEGREES) {
        return value / (Math.PI / 180);
    }

    if (mode == trigModes.GRADIANS) {
        return value / (Math.PI / 200);
    }

    if (mode == trigModes.TURNS) {
        return value / (2 * Math.PI);
    }
}

export function setTrigMode(value) {
    trigMode = value;
}

export function findLineNumberByPosition(position) {
    return Number(Object.keys(programLabels).find((i) => programLabels[i] == position && !Number.isNaN(Number(programLabels[i]))));
}

function expectFactory(tokens) {
    return function(i, ...expectations) {
        for (var j = 0; j < expectations.length; j++) {
            if (i + j >= tokens.length) {
                throw new ParsingSyntaxError(`Unexpected end of program`, tokens[tokens.length - 1].lineNumber);
            }

            if (!expectations[j](tokens[i + j]) && tokens[i + j] instanceof syntax.StatementEnd) {
                throw new ParsingSyntaxError(`Unexpected end of line`, tokens[i + j].lineNumber);
            }

            if (!expectations[j](tokens[i + j])) {
                console.warn("Unexpected:", i, tokens[i]);

                throw new ParsingSyntaxError(
                    tokens[i + j].code != null ? `Unexpected \`${tokens[i + j].code}\`` : `Unexpected token`,
                    tokens[i + j].lineNumber
                );
            }
        }
    }
}

function conditionFactory(tokens) {
    return function(i, ...conditions) {
        for (var j = 0; j < conditions.length; j++) {
            if (!conditions[j](tokens[i + j])) {
                return false;
            }
        }

        return true;
    }
}

export function parseProgram(program) {
    var tokens = syntax.tokenise(program);
    var additionalEnds = 0;
    var repeatMode = false;

    parsedProgram = [];
    programLabels = {};

    for (var i = 0; i < tokens.length; i++) {
        var expect = expectFactory(tokens);
        var condition = conditionFactory(tokens);

        if (condition(i, (x) => x instanceof syntax.ExecutionLabel)) {
            programLabels[tokens[i].code] = parsedProgram.length;

            continue;
        }

        if (
            condition(i, (x) => x instanceof syntax.Keyword && (
                Object.keys(commands.keywords).includes(x.code.toLocaleLowerCase()) ||
                x instanceof syntax.ExtensionKeyword
            ))
        ) { // Command
            var keyword = tokens[i];
            var commandName = tokens[i].code;
            var parameters = [];

            while (true) {
                i++;

                if (condition(i, (x) => x instanceof syntax.Expression)) {
                    parameters.push(tokens[i]);

                    expect(++i, (x) => x instanceof syntax.ParameterSeperator || x instanceof syntax.StatementEnd);
                }

                if (condition(i, (x) => x instanceof syntax.StatementEnd)) {
                    i--;

                    break;
                }
            }

            if (keyword instanceof syntax.ExtensionKeyword) {
                (function(commandName, i) {
                    var extensionName = commandName.split(".")[0];

                    parsedProgram.push(new Command(function() {
                        if (!extensions.hasLoaded(extensionName)) {
                            throw new RuntimeError(
                                `Extension \`${commandName.split(".")[0]}\` has not been loaded`,
                                tokens[i].lineNumber
                            );
                        }
        
                        if (!(extensions.getCommand(commandName) instanceof Function)) {
                            throw new RuntimeError(
                                `Extension \`${commandName.split(".")[0]}\` has no command \`${commandName.split(".")[1]}\``,
                                tokens[i].lineNumber
                            );
                        }

                        return extensions.getCommand(commandName)(...arguments);
                    }, parameters));
                })(commandName, i);
            } else {
                parsedProgram.push(new Command(commands.keywords[commandName.toLocaleLowerCase()], parameters));
            }

            i++;
        } else if (condition(i, (x) => x instanceof syntax.Expression && x.getPrimaryIdentifier() != null)) { // Assignment
            expect(++i, (x) => x instanceof syntax.Assignment, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new Command(commands.assign, [tokens[i - 1], tokens[++i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "if")) { // If
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new OpeningCommand(commands.ifCondition, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i,
            (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "else",
            (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "if"
        )) { // Else if
            parsedProgram.push(new ClosingCommand(commands.genericEnd));
            parsedProgram.push(new OpeningCommand(commands.elseCondition));

            additionalEnds++;
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "else")) { // Else
            parsedProgram.push(new ClosingCommand(commands.genericEnd));
            parsedProgram.push(new OpeningCommand(commands.elseCondition));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "for")) { // For loop
            var identifier = null;
            var start = null;
            var end = null;
            var step = null;

            expect(++i, (x) => x instanceof syntax.Expression && x.getPrimaryIdentifier() != null);

            identifier = tokens[i];

            expect(++i, (x) => x instanceof syntax.Assignment);
            expect(++i, (x) => x instanceof syntax.Expression);

            start = tokens[i];

            expect(++i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "to");
            expect(++i, (x) => x instanceof syntax.Expression);

            end = tokens[i];

            if (condition(++i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "step")) {
                expect(++i, (x) => x instanceof syntax.Expression);

                step = tokens[i++];
            }

            expect(i, (x) => x instanceof syntax.StatementEnd);

            parsedProgram.push(new OpeningCommand(commands.forLoop, [identifier, start, end, step]));
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "repeat")) { // Repeat loop
            parsedProgram.push(new OpeningCommand(commands.repeatLoop));

            expect(++i, (x) => x instanceof syntax.StatementEnd);

            repeatMode = true;
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "while") && !repeatMode) { // While loop
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new OpeningCommand(commands.whileLoop, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "until") && !repeatMode) { // Until loop
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new OpeningCommand(commands.untilLoop, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "end")) { // Generic end
            parsedProgram.push(new ClosingCommand(commands.genericEnd));

            for (var j = 0; j < additionalEnds; j++) {
                parsedProgram.push(new ClosingCommand(commands.genericEnd));
            }

            additionalEnds = 0;

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "next")) { // For end
            parsedProgram.push(new ClosingCommand(commands.forEnd));

            if (condition(++i, (x) => x instanceof syntax.Expression)) {
                i++;
            }

            expect(i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "while") && repeatMode) { // Repeat while end
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new ClosingCommand(commands.repeatWhileEnd, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);

            repeatMode = false;
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "until") && repeatMode) { // Repeat until end
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new ClosingCommand(commands.repeatUntilEnd, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);

            repeatMode = false;
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "loop")) { // Loop end
            parsedProgram.push(new ClosingCommand(commands.loopEnd));

            for (var j = 0; j < additionalEnds; j++) {
                parsedProgram.push(new ClosingCommand(commands.loopEnd));
            }

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.StatementEnd)) {
            // Pass; could be a comment
        } else {
            console.warn("Unexpected:", i, tokens[i]);

            throw new ParsingSyntaxError(
                tokens[i].code != null ? `Unexpected \`${tokens[i].code}\`` : `Unexpected token`,
                tokens[i].lineNumber
            );
        }
    }
}

export function displayError(error) {
    if (!(error instanceof BasicError)) {
        throw error;
    }

    var defaultForeground = term.foregroundColour;

    term.foreground("red");

    if (term.backgroundColour == term.foregroundColour) {
        term.foreground("black");
    }

    term.print(error.message);

    if (typeof(error.lineNumber) == "number" && error.lineNumber > 0) {
        term.print(` at line ${error.lineNumber}`);
    }

    term.print("\n");

    term.setColours(term.backgroundColour, defaultForeground);
}

export function startProgram(clearVariables = true) {
    running = true;
    currentPosition = 0;
    programStack = [];
    turtleNotMoved = true;

    canvas.copyToBuffer();

    setGraphicsPosition(0, 0);
    setGraphicsStrokeWidth(1);
    clearGraphicsPolygonPoints();
    setTurtleHeading(Math.PI / 2);
    setTurtlePenDown(true);
    setTurtleShown(true);

    if (clearVariables) {
        programVariables = {};
    }

    hid.unfocusInput();

    if (parsedProgram.length == 0) {
        term.print("Nothing to run\n");
        hid.startProgramInput();

        return;
    }

    executeStatement(0);
}

export function executeStatement(position = currentPosition + 1) {
    if (!running) {
        return;
    }

    currentPosition = position;

    function performExecution() {
        renderHoldTime = new Date().getTime();
        renderCallDepth++;

        if (currentPosition >= parsedProgram.length) {
            running = false;
    
            term.print("Ready\n");
            hid.startProgramInput();
    
            return;
        }

        function handleError(error) {
            displayError(error);

            running = false;

            term.print("Ready\n");
            hid.startProgramInput();
        }
    
        try {
            var result = parsedProgram[currentPosition].call();

            if (result instanceof Promise) {
                result.catch(function(error) {
                    handleError(new RuntimeError(error?.message || String(error) || "Error", findLineNumberByPosition(currentPosition)));
                });
            }
        } catch (e) {
            handleError(e);

            return;
        }
    }

    if (new Date().getTime() - renderHoldTime > MAX_RENDER_HOLD_TIME || renderCallDepth > MAX_RENDER_CALL_DEPTH) {
        renderCallDepth = 0;

        requestAnimationFrame(performExecution);
    } else {
        performExecution();
    }
}

export function graphicsTakeFrame() {
    renderHoldTime = 0;
}

export function stopProgram() {
    if (!running) {
        return;
    }

    running = false;
    programStack = [];

    term.print("Ready\n");
    hid.startProgramInput();
}

export function interruptProgram(byUser = true) {
    if (!running) {
        return;
    }

    running = false;
    programStack = [];

    if (delayTimeout != null) {
        clearTimeout(delayTimeout);

        delayTimeout = null;
    }

    audio.quiet();
    hid.unfocusInput();

    if (byUser) {
        term.print("Interrupt\n");
        hid.startProgramInput();
    }
}

export function seekOpeningMark() {
    var stackLevel = 0;
    var oldPosition = currentPosition;

    while (!(parsedProgram[currentPosition] instanceof OpeningCommand) || stackLevel > 0) {
        if (currentPosition < 0) {
            throw new ParsingSyntaxError("Mismatched statement closing mark", findLineNumberByPosition(oldPosition));
        }

        if (parsedProgram[currentPosition] instanceof ClosingCommand) {
            stackLevel++;
        }

        currentPosition--;

        if (parsedProgram[currentPosition] instanceof OpeningCommand) {
            stackLevel--;
        }
    }
}

export function seekClosingMark() {
    var stackLevel = 0;
    var oldPosition = currentPosition;

    while (!(parsedProgram[currentPosition] instanceof ClosingCommand) || stackLevel > 0) {
        if (currentPosition >= parsedProgram.length) {
            throw new ParsingSyntaxError("Mismatched statement opening mark", findLineNumberByPosition(oldPosition));
        }

        if (parsedProgram[currentPosition] instanceof OpeningCommand) {
            stackLevel++;
        }

        currentPosition++;

        if (parsedProgram[currentPosition] instanceof ClosingCommand) {
            stackLevel--;
        }
    }
}

export function seekLoopOpeningMark() {
    var oldPosition = currentPosition;

    while (!(parsedProgram[currentPosition] instanceof OpeningCommand && [
        commands.forLoop,
        commands.repeatLoop,
        commands.whileLoop,
        commands.untilLoop
    ].includes(parsedProgram[currentPosition].callable))) {
        currentPosition--;

        if (currentPosition < 0) {
            throw new ParsingSyntaxError("Loop control command was used outside of loop", findLineNumberByPosition(oldPosition));
        }
    }
}

export function isValidDataType(value) {
    if (Number.isNaN(value) || (Math.abs(value) == Infinity && typeof(value) != "string")) {
        return false;
    }

    if (value == null || value == undefined) {
        return false;
    }

    return true;
}

export function getValueComparative(value, lineNumber = running ? editingProgram[currentPosition] : null) {
    if (!isValidDataType(value)) {
        throw new RuntimeError("Type conversion error", lineNumber);
    }

    if (typeof(value) == "number") {
        return Math.round(value * 1e10) / 1e10;
    } else if (typeof(value) == "object") {
        var mappableValue = [];

        for (var i = 0; i < value.length; i++) {
            if (value[i] == undefined) {
                mappableValue.push(0);

                continue;
            }

            mappableValue.push(value[i]);
        }

        return mappableValue.map((i) => getValueDisplay(i)).join(", ");
    } else {
        return String(value).normalize();
    }
}

export function getValueDisplay(value, lineNumber = running ? editingProgram[currentPosition] : null) {
    return String(getValueComparative(value, lineNumber));
}

export function getVariable(identifierName) {
    var type = null;

    setConstants();

    if (identifierName.endsWith("$")) {
        type = String;
    } else if (identifierName.endsWith("%")) {
        type = Number;
    }

    identifierName = identifierName.replace(/[$%]/g, "").toLocaleLowerCase();

    if (typeof(programVariables[identifierName]) == "object") {
        return programVariables[identifierName];
    }

    if (programVariables.hasOwnProperty(identifierName)) {
        if (type == null) {
            return programVariables[identifierName];
        }

        return type(programVariables[identifierName]);
    }

    if (type == String) {
        return "";
    } else {
        return 0;
    }
}

export function setVariable(identifierName, value, lineNumber = null) {
    if (!isValidDataType(value)) {
        throw new RuntimeError("Type conversion error", lineNumber);
    }

    identifierName = identifierName.replace(/[$%]/g, "").toLocaleLowerCase();

    programVariables[identifierName] = value;
}

export function setConstants() {
    setVariable("true", 1);
    setVariable("false", 0);
    setVariable("pi", Math.PI);
    setVariable("e", Math.E);
    setVariable("phi", (1 + Math.sqrt(5)) / 2);
    setVariable("epoch", new Date().getTime());
    setVariable("random", Math.random());
    setVariable("col", term.col);
    setVariable("row", term.row);
    setVariable("key", currentKey);

    var headingDeg = radiansToTrigMode(turtleHeading, trigModes.DEGREES) % 360;

    if (headingDeg < 0) {
        headingDeg = 360 + headingDeg;
    }

    setVariable("heading", radiansToTrigMode(trigModeToRadians(headingDeg, trigModes.DEGREES)));
}

export function getListItem(identifierName, index, lineNumber = null) {
    identifierName = identifierName.replace(/[$%]/g, "").toLocaleLowerCase();

    if (typeof(programVariables[identifierName]) != "object") {
        throw new RuntimeError("Cannot access item in non-list value", lineNumber);
    }

    return programVariables[identifierName][index] || 0;
}

export function setListItem(identifierName, index, value, lineNumber = null) {
    identifierName = identifierName.replace(/[$%]/g, "").toLocaleLowerCase();

    if (typeof(programVariables[identifierName]) != "object") {
        throw new RuntimeError("Cannot set item in non-list variable", lineNumber);
    }

    programVariables[identifierName][index] = value;
}

export function setStore(store, value) {
    var identifier = store.getPrimaryIdentifier();

    if (identifier instanceof syntax.ListAccessIdentifier) {
       setListItem(identifier.listIdentifier.code, identifier.childExpression.value, value, identifier.lineNumber);

       return;
    }

    if (identifier instanceof syntax.Identifier) {
        setVariable(identifier.code, value, identifier.lineNumber);
 
        return;
    }

    throw new RuntimeError("Expected variable name", identifier?.lineNumber);
}

export function pushStack(lineNumber, position = currentPosition) {
    if (programStack.length >= MAX_STACK_SIZE) {
        throw new RuntimeError("Maximum recursion depth limit reached", lineNumber);
    }

    programStack.push(position);
}

export function popStack() {
    if (programStack.length == 0) {
        throw new RuntimeError("Nothing to return to", findLineNumberByPosition(currentPosition));
    }

    return programStack.pop();
}

export function setGraphicsPosition(x, y) {
    graphicsX = x;
    graphicsY = y;
}

export function setGraphicsStrokeWidth(width) {
    graphicsStrokeWidth = width;
}

export function clearGraphicsPolygonPoints() {
    graphicsPolygonPoints = [];
}

export function addGraphicsPolygonPoint(x, y) {
    graphicsPolygonPoints.push([x, y]);
}

export function setTurtleHeading(heading) {
    turtleHeading = heading;
}

export function setTurtlePenDown(penDown) {
    turtlePenDown = penDown;
}

export function setTurtleShown(shown) {
    turtleShown = shown;
}

export function setTurtleMoved(fromTurtleCommand = true) {
    if (turtleNotMoved) {
        if (fromTurtleCommand) {
            canvas.copyToBuffer();
        }

        setGraphicsPosition(canvas.DISP_WIDTH / 2, canvas.DISP_HEIGHT / 2);
    }

    turtleNotMoved = false;
}

export function preTurtleRender() {
    canvas.restoreFromBuffer();
    graphicsTakeFrame();
}

export function renderTurtle() {
    canvas.copyToBuffer();

    if (!turtleShown) {
        return;
    }

    var points = [
        [graphicsX, graphicsY],
        [graphicsX - (30 * Math.cos(turtleHeading - (Math.PI / 8) - (Math.PI / 2))), graphicsY - (30 * Math.sin(turtleHeading - (Math.PI / 8) - (Math.PI / 2)))],
        [graphicsX - (20 * Math.cos(turtleHeading - (Math.PI / 2))), graphicsY - (20 * Math.sin(turtleHeading - (Math.PI / 2)))],
        [graphicsX - (30 * Math.cos(turtleHeading + (Math.PI / 8) - (Math.PI / 2))), graphicsY - (30 * Math.sin(turtleHeading + (Math.PI / 8) - (Math.PI / 2)))],
        [graphicsX, graphicsY]
    ];

    canvas.setColour(new canvas.Colour(0, 0, 0));

    canvas.drawPolygon(points);

    canvas.setColour(new canvas.Colour(255, 255, 255));

    canvas.drawLine(points[0][0], points[0][1], points[1][0], points[1][1]);

    for (var i = 1; i < points.length - 1; i++) {
        canvas.drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }
}

export function declareLastConditionalState(state) {
    lastConditionalState = state;
}

export function setDelayTimeout(timeout) {
    clearTimeout(delayTimeout);

    delayTimeout = timeout;
}

export function listLines(startLimit = null, endLimit = null) {
    if (startLimit != null && !Number.isNaN(Number(startLimit))) {
        startLimit = Number(startLimit);
    } else {
        startLimit = 0;
    }

    if (endLimit != null && !Number.isNaN(Number(endLimit))) {
        endLimit = Math.min(Number(endLimit), editingProgram.length);
    } else {
        endLimit = editingProgram.length;
    }

    var listingLength = editingProgram.filter((element, i) => typeof(element) == "string" && i >= startLimit && i <= endLimit).length;
    var editingProgramAddedLines = 0;

    for (var i = 0; i < editingProgram.length; i++) {
        if (i < startLimit) {
            continue;
        }

        if (i > endLimit) {
            break;
        }

        if (typeof(editingProgram[i]) != "string") {
            continue;
        }

        editingProgramAddedLines++;

        hid.startProgramInput(editingProgram[i], false, term.scrollDelta + term.row, editingProgramAddedLines + canvas.TERM_ROWS > listingLength);
    }
}

export function renumberLines() {
    var newProgram = [];
    var newLineNumber = 10;
    var gotoLines = [];
    var renumberings = [];
    var tokens = syntax.tokenise(editingProgram);

    for (var i = 0; i < editingProgram.length; i++) {
        if (i in editingProgram) {
            renumberings[i] = newLineNumber;
            newLineNumber += 10;
        }
    }

    newLineNumber = 10;

    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] instanceof syntax.Keyword && ["goto", "gosub"].includes(tokens[i].code.toLocaleLowerCase()) && tokens[i + 1] instanceof syntax.Expression) {
            gotoLines[tokens[i].lineNumber] = gotoLines[tokens[i].lineNumber] || [];

            gotoLines[tokens[i].lineNumber].push(renumberings[tokens[i + 1].value] || tokens[i + 1].value);
        }
    }

    for (var i = 0; i < editingProgram.length; i++) {
        if (i in editingProgram) {
            var newLineCode = editingProgram[i].replace(/^\d+/, String(newLineNumber));

            if (typeof(gotoLines[i]) == "object") {
                for (var j = 0; j < gotoLines[i].length; j++) {
                    newLineCode = newLineCode.replace(/((?:goto|gosub)\s*)\d+/i, `$1\0${gotoLines[i][j]}`);
                }
            }

            newLineCode = newLineCode.replace(/((?:goto|gosub)\s*)\0/gi, "$1");

            newProgram[newLineNumber] = newLineCode;

            newLineNumber += 10;
        }
    }

    editingProgram = newProgram;
}

export function programToText() {
    return editingProgram.filter((i) => typeof(i) == "string").join("\n");
}

export function textToProgram(text) {
    editingProgram = [];

    text.split("\n").forEach(function(line) {
        if (/^\d+/.exec(line.trim()) && Number(/^(\d+)/.exec(line.trim())[1]) > 0) {
            editingProgram[/^(\d+)/.exec(line.trim())[1]] = line;
        }
    });
}

export function exportToFile(filename = "untitled.atto") {
    var file = new Blob([programToText()], {type: "text/plain"});

    fileExporter.href = URL.createObjectURL(file);
    fileExporter.download = filename;

    fileExporter.click();
}

export function importFromFile() {
    fileImporter.click();
}

export function autosave() {
    if (programToText().length > 0) {
        localStorage.setItem("atto_lastSessionProgram", programToText());
    } else {
        localStorage.removeItem("atto_lastSessionProgram");
    }
}

export function shareProgram() {
    var code = programToText();
    var url = `${window.location.href.split("?")[0]}?code=${encodeURIComponent(code)}`;

    hid.hidCopy.value = url;
    hid.hidCopy.hidden = false;

    hid.hidCopy.focus();
    hid.hidCopy.select();
    document.execCommand("copy");

    hid.hidCopy.hidden = true;

    hid.hidInput.focus();

    window.history.pushState("", "", url);
    
    term.print("Copied link to clipboard\n");
}

window.shareProgramLink = function() {
    interruptProgram(false);

    shareProgram();
    hid.startProgramInput();
};

export function processCommand(value, movementOnly) {
    var command = value.trim().toLocaleLowerCase();

    if (/^\d+/.exec(command) && Number(/^(\d+)/.exec(command)[1]) > 0) {
        var lineNumber = Number(/^(\d+)/.exec(value.trim())[1]);

        if (value.trim() == String(lineNumber)) {
            delete editingProgram[lineNumber];
        } else {
            editingProgram[lineNumber] = value;
        }

        autosave();

        if (!movementOnly) {
            hid.startProgramInput();
        }

        return;
    }

    if (movementOnly) {
        return;
    }

    if (command == "help") {
        canvas.toggleDocs();
        hid.startProgramInput();

        return;
    }

    if (command.substring(0, 4) == "list") {
        var startLimit = command.substring(4).split("-")[0].trim();
        var endLimit = (command.substring(4).split("-")[1] || "").trim();

        listLines(startLimit || null, endLimit || null);

        hid.startProgramInput();

        return;
    }

    if (command == "new") {
        editingProgram = [];

        hid.clearProgramInputs();

        term.print("Created new program\n");
        autosave();
        hid.startProgramInput();

        return;
    }

    if (command == "run") {
        hid.clearProgramInputs();

        try {
            parseProgram(editingProgram);
        } catch (e) {
            displayError(e);

            term.print("Ready\n");
            hid.startProgramInput();

            return;
        }

        startProgram();

        return;
    }

    if (command.substring(0, 4) == "edit") {
        if (command.substring(4) != "" && Number.isInteger(Number(command.substring(4).trim()))) {
            hid.startProgramInput(editingProgram[Number(command.substring(4).trim())]);

            return;
        } else {
            displayError(new ParsingSyntaxError("Please specify a line to edit"));
        }

        autosave();
        hid.startProgramInput();

        return;
    }

    if (command == "renum") {
        renumberLines();
        autosave();
        hid.startProgramInput();

        return;
    }

    if (command.split(" ")[0] == "export") {
        var parts = value.trim().split(" ");

        parts.shift();

        exportToFile(parts.length > 0 ? parts.join(" ") + ".atto" : undefined);
        
        term.print("Exported to file\n");
        hid.startProgramInput();

        return;
    }

    if (command == "import") {
        importFromFile();
        hid.startProgramInput();

        return;
    }

    if (command == "share") {
        shareProgram();
        hid.startProgramInput();

        return;
    }

    if (command == "load") {
        var programFromStorage = localStorage.getItem("atto_lastSessionProgram");

        if (programFromStorage == null) {
            displayError(new ParsingSyntaxError("No previous session to load"));
        } else {
            textToProgram(programFromStorage);
        }

        hid.startProgramInput();

        return;
    }

    if (command == "" || command.startsWith("rem ") || command.startsWith("#")) {
        hid.startProgramInput();

        return;
    }

    try {
        parseProgram([value]);
    } catch (e) {
        displayError(e);

        term.print("Ready\n");
        hid.startProgramInput();

        return;
    }

    startProgram(false);
}

export function discardCommand(value) {
    if (/^\d+/.exec(value.trim()) && Number(/^(\d+)/.exec(value.trim())[1]) > 0) {
        delete editingProgram[Number(/^(\d+)/.exec(value.trim())[1])];

        autosave();
    }
}

window.addEventListener("load", function() {
    if (window.inDocsPopout) {
        return;
    }

    fileExporter = document.querySelector("#fileExporter");
    fileImporter = document.querySelector("#fileImporter");

    fileImporter.addEventListener("change", function() {
        var reader = new FileReader();

        reader.addEventListener("load", function() {
            interruptProgram(false);
            textToProgram(reader.result);

            term.print("\rImported from file\n");
            hid.startProgramInput();
        });

        reader.readAsText(fileImporter.files[0]);
    });
});

window.addEventListener("keydown", function(event) {
    if (window.inDocsPopout) {
        return;
    }

    currentKey = event.key;

    if (!["Tab", "Enter"].includes(event.key)) {
        hid.hidInput.focus();
    }

    if (event.key == "F1") {
        canvas.toggleDocs();

        event.preventDefault();
    }

    if (event.key == "F5") {
        hid.unfocusInput();
        hid.clearProgramInputs();

        try {
            parseProgram(editingProgram);
        } catch (e) {
            displayError(e);

            term.print("Ready\n");
            hid.startProgramInput();
        }

        startProgram();

        event.preventDefault();
    }

    if (event.key == "s" && event.ctrlKey) {
        interruptProgram(false);

        exportToFile("untitled.atto");
        
        term.print("Exported to file\n");
        hid.startProgramInput();

        event.preventDefault();
    }

    if (event.key == "o" && event.ctrlKey) {
        interruptProgram();
        importFromFile();

        event.preventDefault();
    }
});

window.addEventListener("keyup", function(event) {
    if (event.key == "Escape") {
        interruptProgram();
    }

    currentKey = "";
});