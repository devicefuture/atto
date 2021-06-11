import * as term from "./term.js";
import * as hid from "./hid.js";
import * as syntax from "./syntax.js";
import * as commands from "./commands.js";

export const trigModes = {
    DEGREES: 0,
    RADIANS: 1
};

export var editingProgram = [];
export var parsedProgram = [];
export var programLabels = {};
export var programVariables = {};
export var running = false;
export var currentPosition = 0;
export var trigMode = trigModes.DEGREES;

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
        this.callable(...this.parameters);
    }
}

export class OpeningCommand extends Command {}

export class ClosingCommand extends Command {}

export class Condition {
    constructor(a, b, comparison) {
        this.a = a;
        this.b = b;
        this.comparison = comparison;
    }

    get value() {
        switch (this.comparison.code) {
            case "=": return this.a.value == this.b.value;
            case "<": return this.a.value < this.b.value;
            case ">": return this.a.value > this.b.value;
            case "<=": return this.a.value <= this.b.value;
            case ">=": return this.a.value >= this.b.value;
            case "!=": return this.a.value != this.b.value;
        }
    }
}

export class LogicalOperatorCondition {
    constructor(conditions, logicalOperator = null, childLogicalOperatorClass = null) {
        this.conditions = conditions;
        this.logicalOperator = logicalOperator;
        this.childLogicalOperatorClass = childLogicalOperatorClass;

        this.children = [];
    }

    parse() {
        if (this.logicalOperator == null) {
            this.children = [];

            return; // This is a leaf logical operator condition
        }

        this.children = [new this.childLogicalOperatorClass([])];

        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i] instanceof syntax.LogicalOperator && this.conditions[i].code == this.logicalOperator.code) {
                this.children.push(new this.childLogicalOperatorClass([]));
            } else {
                this.children[this.children.length - 1].conditions.push(this.conditions[i]);
            }
        }

        this.children.forEach((i) => i.parse());
    }

    get value() {
        if (this.logicalOperator == null) {
            return this.conditions[0].value;
        }

        var value = this.children[0].value;

        for (var i = 1; i < this.children.length; i++) {
            value = this.reduce(value, this.children[i].value);
        }

        return value;
    }
}

export class LogicalNot extends LogicalOperatorCondition {
    constructor(conditions) {
        super(conditions, new syntax.LogicalOperator("not"), LogicalAnd);
    }

    reduce(a, b) {
        return !b;
    }
}

export class LogicalAnd extends LogicalOperatorCondition {
    constructor(conditions) {
        super(conditions, new syntax.LogicalOperator("and"), LogicalOr);
    }

    reduce(a, b) {
        return a && b;
    }
}

export class LogicalOr extends LogicalOperatorCondition {
    constructor(conditions) {
        super(conditions, new syntax.LogicalOperator("or"), LogicalXor);
    }

    reduce(a, b) {
        return a || b;
    }
}

export class LogicalXor extends LogicalOperatorCondition {
    constructor(conditions) {
        super(conditions, new syntax.LogicalOperator("xor"), LogicalLeaf);
    }

    reduce(a, b) {
        return a != b;
    }
}

export class LogicalLeaf extends LogicalOperatorCondition {
    constructor(conditions) {
        super(conditions);
    }

    get value() {
        if (this.childLogicalOperatorClass == null) {
            if (this.conditions.length == 0) {
                return false;
            }

            return this.conditions[0].value;
        }
    }
}
 
export function trigModeToRadians(value) {
    if (trigMode == trigModes.RADIANS) {
        return value;
    }

    if (trigMode == trigModes.DEGREES) {
        return value * (Math.PI / 180);
    }
}

export function radiansToTrigMode(value) {
    if (trigMode == trigModes.RADIANS) {
        return value;
    }

    if (trigMode == trigModes.DEGREES) {
        return value / (Math.PI / 180);
    }
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
            if (!conditions[j](tokens[i + j]) && tokens[i + j]) {
                return false;
            }

            return true;
        }
    }
}

function conditionalExpressionFactory(tokens, expect, condition) {
    return function(i) {
        var conditionalExpression = new LogicalNot([]);
        var nextCondition = new Condition(null, null, null);

        i--;

        while (true) {
            if (condition(++i, (x) => x instanceof syntax.Expression)) {
                expect(i, (x) => x instanceof syntax.Expression);

                nextCondition.a = tokens[i];

                expect(++i, (x) => x instanceof syntax.Comparator);

                nextCondition.comparison = tokens[i];

                expect(++i, (x) => x instanceof syntax.Expression);

                nextCondition.b = tokens[i];

                conditionalExpression.conditions.push(nextCondition);

                nextCondition = new Condition(null, null, null);
            } else {
                i--;
            }

            if (condition(++i, (x) => x instanceof syntax.LogicalOperator)) {
                conditionalExpression.conditions.push(tokens[i]);
            } else {
                break;
            }
        }

        conditionalExpression.parse();

        i--;

        return {i, conditionalExpression};
    }
}

export function parseProgram(program) {
    var tokens = syntax.tokenise(program);

    parsedProgram = [];
    programLabels = {};

    for (var i = 0; i < tokens.length; i++) {
        var expect = expectFactory(tokens);
        var condition = conditionFactory(tokens);
        var conditionalExpression = conditionalExpressionFactory(tokens, expect, condition);

        if (condition(i, (x) => x instanceof syntax.ExecutionLabel)) {
            programLabels[tokens[i].code] = parsedProgram.length;

            continue;
        }

        if (condition(i, (x) => x instanceof syntax.Keyword && Object.keys(commands.keywords).includes(x.code.toLocaleLowerCase()))) { // Command
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

            parsedProgram.push(new Command(commands.keywords[commandName], parameters));

            i++;
        } else if (condition(i, (x) => x instanceof syntax.Expression && x.getPrimaryIdentifier() != null)) { // Assignment
            expect(++i, (x) => x instanceof syntax.Comparator && x.code == "=", (x) => x instanceof syntax.Expression);

            parsedProgram.push(new Command(commands.assign, [tokens[i - 1], tokens[++i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "goto")) {
            expect(++i, (x) => x instanceof syntax.Expression);

            parsedProgram.push(new Command(commands.goto, [tokens[i]]));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "if")) {
            var conditionalExpressionResult = conditionalExpression(++i);

            i = conditionalExpressionResult.i;

            expect(++i, (x) => x instanceof syntax.StatementEnd);

            parsedProgram.push(new OpeningCommand(commands.ifCondition, [conditionalExpressionResult.conditionalExpression]));
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "for")) {
            var identifier = null;
            var start = null;
            var end = null;
            var step = new syntax.LeafExpression([new syntax.NumericLiteral("1", tokens[i].lineNumber)], tokens[i].lineNumber);

            expect(++i, (x) => x instanceof syntax.Expression && x.getPrimaryIdentifier() != null);

            identifier = tokens[i];

            expect(++i, (x) => x instanceof syntax.Comparator && x.code == "=");
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
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "end")) {
            parsedProgram.push(new ClosingCommand(commands.genericEnd));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "next")) {
            parsedProgram.push(new ClosingCommand(commands.forEnd));

            if (condition(++i, (x) => x instanceof syntax.Expression)) {
                i++;
            }

            expect(i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.StatementEnd)) {
            console.warn("Unexpected:", i, tokens[i]);

            throw new ParsingSyntaxError(`Unexpected end of line`, tokens[i].lineNumber);
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

    requestAnimationFrame(function() {
        if (currentPosition >= parsedProgram.length) {
            running = false;
    
            term.print("Ready\n");
            hid.startProgramInput();
    
            return;
        }
    
        try {
            parsedProgram[currentPosition].call();
        } catch (e) {
            displayError(e);

            running = false;

            term.print("Ready\n");
            hid.startProgramInput();

            return;
        }
    });
}

export function interruptProgram() {
    if (!running) {
        return;
    }

    running = false;

    hid.unfocusInput();

    term.print("Interrupt\n");
    hid.startProgramInput();
}

export function seekOpeningMark() {
    var stackLevel = 0;
    var oldPosition = currentPosition;

    while (!(parsedProgram[currentPosition] instanceof OpeningCommand) || stackLevel > 0) {
        if (currentPosition < 0) {
            throw new ParsingSyntaxError("Mismatched statement closing mark", programLabels[oldPosition]);
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
            throw new ParsingSyntaxError("Mismatched statement opening mark", programLabels[oldPosition]);
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

export function isValidDataType(value) {
    if (Number.isNaN(value) || Math.abs(value) == Infinity) {
        return false;
    }

    if (value == null || value == undefined) {
        return false;
    }

    return true;
}

export function getValueDisplay(value, lineNumber = null) {
    if (!isValidDataType(value)) {
        throw new RuntimeError("Type conversion error", lineNumber);
    }

    if (typeof(value) == "number") {
        return String(Math.round(value * 1e10) / 1e10);
    } else {
        return String(value);
    }
}

export function getVariable(identifierName) {
    var type = null;

    if (identifierName.endsWith("$")) {
        type = String;
    } else if (identifierName.endsWith("%")) {
        type = Number;
    }

    identifierName = identifierName.replace(/[$%]/g, "").toLocaleLowerCase();

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

export function processCommand(value, movementOnly) {
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0 && Number(value.split(" ")[0]) > 0) {
        if (value.split(" ").length == 1) {
            delete editingProgram[Number(value)];
        } else {
            editingProgram[Number(value.split(" ")[0])] = value;
        }

        if (!movementOnly) {
            hid.startProgramInput();
        }

        return;
    }

    if (movementOnly) {
        return;
    }

    if (value.trim() == "list") {
        for (var i = 0; i < editingProgram.length; i++) {
            if (typeof(editingProgram[i]) != "string") {
                continue;
            }

            hid.startProgramInput(editingProgram[i], false);
        }

        hid.startProgramInput();

        return;
    }

    if (value.trim() == "run") {
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

    if (value.split(" ")[0] == "edit") {
        if (Number.isInteger(Number(value.split(" ")[1]))) {
            hid.startProgramInput(editingProgram[Number(value.split(" ")[1])]);

            return;
        } else {
            term.print("Please specify a line to edit\n");
        }

        hid.startProgramInput();

        return;
    }

    if (value.trim() == "") {
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
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0) {
        delete editingProgram[Number(value.split(" ")[0])];
    }
}

window.addEventListener("keyup", function(event) {
    if (event.key == "Escape") {
        interruptProgram();
    }
});