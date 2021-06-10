import * as basic from "./basic.js";
import * as term from "./term.js";

export var keywords = {
    "print": print
};

export function print(value) {
    term.print(value.value + "\n");

    basic.executeStatement();
}

export function assign(identifier, value) {}

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

export function forLoop(identifier, start, end, step) {}

export function genericEnd() {
    basic.seekOpeningMark();

    if (basic.parsedProgram[basic.currentPosition].callable == ifCondition) {
        basic.seekClosingMark();
    }

    basic.executeStatement();
}