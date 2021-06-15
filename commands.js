import * as basic from "./basic.js";
import * as term from "./term.js";
import * as hid from "./hid.js";

export var keywords = {
    "print": print,
    "input": input,
    "goto": goto,
    "break": breakLoop,
    "continue": continueLoop,
    "stop": stopProgram,
    "deg": setTrigDegrees,
    "rad": setTrigRadians,
    "gon": setTrigGradians,
    "pos": setTextPosition,
    "cls": clearScreen,
    "delay": delay
};

function expectParameters(...parameters) {
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i] == undefined) {
            throw new basic.RuntimeError(`Expected ${parameters.length} parameters`);
        }
    }
}

export function print(value) {
    term.print((value == undefined ? "" : basic.getValueDisplay(value.value, value.lineNumber)) + (value == undefined || !value.postConcat ? "\n" : ""));

    basic.executeStatement();
}

export function input(value, identifier) {
    expectParameters(value, identifier);

    term.print(value == undefined ? "" : basic.getValueDisplay(value.value, value.lineNumber));

    hid.startInput().then(function(value) {
        basic.setVariable(identifier.getPrimaryIdentifier().code, value, identifier.getPrimaryIdentifier().lineNumber);

        basic.executeStatement();
    });
}

export function assign(identifier, value) {
    basic.setVariable(identifier.getPrimaryIdentifier().code, value.value, value.lineNumber);

    basic.executeStatement();
}

export function goto(lineNumber) {
    expectParameters(lineNumber);

    if (!basic.programLabels.hasOwnProperty(lineNumber.value)) {
        throw new basic.RuntimeError(`Cannot goto nonexistent line ${lineNumber.value}`, lineNumber.lineNumber);
    }

    basic.executeStatement(basic.programLabels[lineNumber.value]);
}

export function breakLoop() {
    basic.seekLoopOpeningMark();
    basic.seekClosingMark();

    basic.executeStatement();
}

export function continueLoop() {
    basic.seekLoopOpeningMark();
    basic.seekClosingMark();

    basic.executeStatement(basic.currentPosition);
}

export function stopProgram() {
    basic.stopProgram();
}

export function ifCondition(conditionalExpression) {
    basic.declareLastConditionalState(conditionalExpression.value);

    if (!conditionalExpression.value) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function elseCondition() {
    if (basic.lastConditionalState) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function forLoop(identifier, start, end, step) {
    basic.setVariable(identifier.getPrimaryIdentifier().code, start.value, start.lineNumber);

    basic.executeStatement();
}

export function repeatLoop() {
    basic.executeStatement();
}

export function whileLoop(conditionalExpression) {
    basic.declareLastConditionalState(conditionalExpression.value);

    if (!conditionalExpression.value) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function untilLoop(conditionalExpression) {
    basic.declareLastConditionalState(!conditionalExpression.value);

    if (conditionalExpression.value) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function genericEnd() {
    basic.seekOpeningMark();

    if (basic.parsedProgram[basic.currentPosition].callable == ifCondition || basic.parsedProgram[basic.currentPosition].callable == elseCondition) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function forEnd() {
    basic.seekOpeningMark();

    var parameters = basic.parsedProgram[basic.currentPosition].parameters;
    var identifierName = parameters[0].getPrimaryIdentifier().code;

    if (basic.getVariable(identifierName) < parameters[2].value) {
        basic.setVariable(identifierName, basic.getVariable(identifierName) + parameters[3].value, parameters[3].lineNumber);
    } else {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function repeatWhileEnd(conditionalExpression) {
    basic.declareLastConditionalState(conditionalExpression.value);

    if (conditionalExpression.value) {
        basic.seekOpeningMark();
    }

    basic.executeStatement();
}

export function repeatUntilEnd(conditionalExpression) {
    basic.declareLastConditionalState(!conditionalExpression.value);

    if (!conditionalExpression.value) {
        basic.seekOpeningMark();
    }

    basic.executeStatement();
}

export function loopEnd() {
    basic.seekOpeningMark();

    basic.executeStatement(basic.currentPosition);
}

export function setTrigDegrees() {
    basic.setTrigMode(basic.trigModes.DEGREES);

    basic.executeStatement();
}

export function setTrigRadians() {
    basic.setTrigMode(basic.trigModes.RADIANS);

    basic.executeStatement();
}

export function setTrigGradians() {
    basic.setTrigMode(basic.trigModes.GRADIANS);

    basic.executeStatement();
}

export function setTextPosition(col, row) {
    expectParameters(col, row);

    term.goto(basic.getValueComparative(Math.floor(col.value) - 1), basic.getValueComparative(Math.floor(row.value)));
    term.right();

    basic.executeStatement();
}

export function clearScreen() {
    term.clear();
    term.goto(0, 0);

    basic.executeStatement();
}

export function delay(milliseconds) {
    expectParameters(milliseconds);

    basic.setDelayTimeout(
        setTimeout(function() {
            if (basic.running) {
                basic.executeStatement();
            }
        }, basic.getValueComparative(Number(milliseconds.value)))
    );
}