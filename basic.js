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
export var running = false;
export var currentPosition = 0;
export var trigMode = trigModes.DEGREES;

export class ParsingSyntaxError extends Error {
    constructor(message, lineNumber) {
        super(message);

        this.lineNumber = lineNumber;

        this.name = this.constructor.name;
    }
}

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
            console.log("Expects", expectations.toString(), "got", tokens[i + j]);

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

export function parseProgram(program) {
    var tokens = syntax.tokenise(program);

    parsedProgram = [];

    for (var i = 0; i < tokens.length; i++) {
        var expect = expectFactory(tokens);
        var condition = conditionFactory(tokens);

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
            var firstValue = null;
            var secondValue = null;
            var comparison = null;

            expect(++i, (x) => x instanceof syntax.Expression);

            firstValue = tokens[i];

            expect(++i, (x) => x instanceof syntax.Comparator);

            comparison = tokens[i];

            expect(++i, (x) => x instanceof syntax.Expression);

            secondValue = tokens[i];

            expect(++i, (x) => x instanceof syntax.StatementEnd);

            parsedProgram.push(new OpeningCommand(commands.ifCondition, [firstValue, secondValue, comparison]));
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

            parsedProgram.push(new OpeningCommand(commands.forLoop, [identifier, start, end, stop]));
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "end")) {
            parsedProgram.push(new ClosingCommand(commands.genericEnd));

            expect(++i, (x) => x instanceof syntax.StatementEnd);
        } else if (condition(i, (x) => x instanceof syntax.Keyword && x.code.toLocaleLowerCase() == "next")) {
            parsedProgram.push(new ClosingCommand(commands.forEnd));

            if (condition(++i, (x) => x instanceof syntax.Expression)) {
                i++;
            }

            expect(++i, (x) => x instanceof syntax.StatementEnd);
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

export function startProgram() {
    running = true;
    currentPosition = 0;

    hid.unfocusInput();

    if (parsedProgram.length == 0) {
        term.print("Nothing to run\n");
        hid.startProgramInput();

        return;
    }

    parsedProgram[currentPosition].call();
}

export function executeStatement(position = currentPosition + 1) {
    currentPosition = position;

    requestAnimationFrame(function() {
        if (currentPosition >= parsedProgram.length) {
            running = false;
    
            term.print("Ready\n");
            hid.startProgramInput();
    
            return;
        }
    
        parsedProgram[currentPosition].call();
    });
}

export function seekOpeningMark() {
    var stackLevel = 0;

    while (!(parsedProgram[currentPosition] instanceof OpeningCommand) || stackLevel > 0) {
        if (parsedProgram[currentPosition] instanceof ClosingCommand) {
            stackLevel++;
        }

        if (parsedProgram[currentPosition] instanceof OpeningCommand) {
            stackLevel--;
        }

        currentPosition--;
    }
}

export function seekClosingMark() {
    var stackLevel = 0;

    while (!(parsedProgram[currentPosition] instanceof ClosingCommand) || stackLevel > 0) {
        if (parsedProgram[currentPosition] instanceof OpeningCommand) {
            stackLevel++;
        }

        if (parsedProgram[currentPosition] instanceof ClosingCommand) {
            stackLevel--;
        }

        currentPosition++;
    }
}

export function processCommand(value, movementOnly) {
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0) {
        if (value.split(" ").length == 1) {
            delete editingProgram[Number(value)];
        } else {
            editingProgram[Number(value.split(" ")[0])] = value;
        }
    }

    if (movementOnly) {
        return;
    }

    if (value == "list") {
        for (var i = 0; i < editingProgram.length; i++) {
            if (typeof(editingProgram[i]) != "string") {
                continue;
            }

            hid.startProgramInput(editingProgram[i], false);
        }
    }

    if (value == "run") {
        parseProgram(editingProgram);
        startProgram(0);

        return;
    }

    if (value.split(" ")[0] == "edit") {
        if (Number.isInteger(Number(value.split(" ")[1]))) {
            hid.startProgramInput(editingProgram[Number(value.split(" ")[1])]);

            return;
        } else {
            term.print("Please specify a line to edit\n");
        }
    }

    hid.startProgramInput();
}

export function discardCommand(value) {
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0) {
        delete editingProgram[Number(value.split(" ")[0])];
    }
}