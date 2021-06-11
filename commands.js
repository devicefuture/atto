import * as basic from "./basic.js";
import * as term from "./term.js";
import * as hid from "./hid.js";

export var keywords = {
    "print": print,
    "input": input
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
    basic.executeStatement(basic.programLabels[lineNumber.value]);
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