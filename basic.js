import * as term from "./term.js";
import * as hid from "./hid.js";

export var program = [];

export function processCommand(value, movementOnly) {
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0) {
        program[Number(value.split(" ")[0])] = value;
    }

    if (movementOnly) {
        return;
    }

    if (value == "list") {
        for (var i = 0; i < program.length; i++) {
            if (typeof(program[i]) != "string") {
                continue;
            }

            hid.startProgramInput(program[i], false);
        }
    }

    if (value.split(" ")[0] == "edit") {
        if (Number.isInteger(Number(value.split(" ")[1]))) {
            hid.startProgramInput(program[Number(value.split(" ")[1])]);

            return;
        } else {
            term.print("Please specify a line to edit\n");
        }
    }

    hid.startProgramInput();
}

export function discardCommand(value) {
    if (Number.isInteger(Number(value.split(" ")[0])) && value.trim().length > 0) {
        delete program[Number(value.split(" ")[0])];
    }
}