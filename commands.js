import * as basic from "./basic.js";
import * as term from "./term.js";

export var keywords = {
    "print": print
};

function getValueDisplay(value) {
    if (typeof(value) == "number") {
        return String(Math.round(value * 1e10) / 1e10);
    } else {
        return String(value);
    }
}

export function print(value) {
    term.print((value == undefined ? "" : getValueDisplay(value.value)) + "\n");

    basic.executeStatement();
}

export function assign(identifier, value) {
    basic.setVariable(identifier.getPrimaryIdentifier().code, value.value);

    basic.executeStatement();
}

export function goto(lineNumber) {
    basic.executeStatement(basic.programLabels[lineNumber.value]);
}

export function ifCondition(firstValue, secondValue, comparison) {
    var outcome = false;

    switch (comparison.code) {
        case "=": outcome = firstValue.value == secondValue.value; break;
        case "<": outcome = firstValue.value < secondValue.value; break;
        case ">": outcome = firstValue.value > secondValue.value; break;
        case "<=": outcome = firstValue.value <= secondValue.value; break;
        case ">=": outcome = firstValue.value >= secondValue.value; break;
        case "!=": outcome = firstValue.value != secondValue.value; break;
    }

    if (outcome) {
        basic.executeStatement();
    } else {
        basic.seekClosingMark();
        basic.executeStatement();
    }
}

export function forLoop(identifier, start, end, step) {
    basic.setVariable(identifier.getPrimaryIdentifier().code, start.value);

    basic.executeStatement();
}

export function genericEnd() {
    basic.seekOpeningMark();

    if (basic.parsedProgram[basic.currentPosition].callable == ifCondition) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}

export function forEnd() {
    basic.seekOpeningMark();

    var parameters = basic.parsedProgram[basic.currentPosition].parameters;
    var identifierName = parameters[0].getPrimaryIdentifier().code;

    if (basic.getVariable(identifierName) < parameters[2].value) {
        basic.setVariable(identifierName, basic.getVariable(identifierName) + parameters[3].value);
    } else {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}