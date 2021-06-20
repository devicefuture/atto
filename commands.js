import * as common from "./common.js";
import * as basic from "./basic.js";
import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";

export var keywords = {
    "print": print,
    "input": input,
    "goto": goto,
    "gosub": gosub,
    "return": returnFromSub,
    "break": breakLoop,
    "continue": continueLoop,
    "stop": stopProgram,
    "deg": setTrigDegrees,
    "rad": setTrigRadians,
    "gon": setTrigGradians,
    "pos": setTextPosition,
    "cls": clearScreen,
    "delay": delay,
    "bg": setBackgroundColour,
    "fg": setForegroundColour,
    "move": graphicsMove,
    "draw": graphicsDraw,
    "stroke": graphicsStroke,
    "fill": graphicsFill,
    "text": graphicsDrawText,
    "copy": graphicsCopy,
    "restore": graphicsRestore,
    "frame": graphicsTakeFrame,
    "getpixel": graphicsGetPixel
};

function expectParameters(...parameters) {
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i] == undefined) {
            throw new basic.RuntimeError(parameters.length > 1 ? `Expected ${parameters.length} parameters`: `Expected 1 parameter`);
        }
    }
}

function getNumber(parameter) {
    return basic.getValueComparative(Number(parameter.value), parameter.lineNumber);
}

function getVariableName(identifier) {
    if (identifier.getPrimaryIdentifier() != null) {
        return identifier.getPrimaryIdentifier().code;
    }

    throw new basic.ParsingSyntaxError("Expected variable name", identifier.lineNumber);
}

export function print(value) {
    term.print((value == undefined ? "" : basic.getValueDisplay(value.value, value.lineNumber)) + (value == undefined || !value.postConcat ? "\n" : ""));

    basic.executeStatement();
}

export function input(value, identifier) {
    expectParameters(value, identifier);

    term.print(value == undefined ? "" : basic.getValueDisplay(value.value, value.lineNumber));

    hid.startInput().then(function(value) {
        basic.setVariable(getVariableName(identifier), value, identifier.lineNumber);

        basic.executeStatement();
    });
}

export function assign(identifier, value) {
    basic.setVariable(getVariableName(identifier), value.value, value.lineNumber);

    basic.executeStatement();
}

export function goto(lineNumber) {
    expectParameters(lineNumber);

    if (!basic.programLabels.hasOwnProperty(lineNumber.value)) {
        throw new basic.RuntimeError(`Cannot goto nonexistent line ${lineNumber.value}`, lineNumber.lineNumber);
    }

    basic.executeStatement(basic.programLabels[lineNumber.value]);
}

export function gosub(lineNumber) {
    expectParameters(lineNumber);

    if (!basic.programLabels.hasOwnProperty(lineNumber.value)) {
        throw new basic.RuntimeError(`Cannot gosub to nonexistent line ${lineNumber.value}`, lineNumber.lineNumber);
    }

    basic.pushStack(lineNumber.lineNumber);
    basic.executeStatement(basic.programLabels[lineNumber.value]);
}

export function returnFromSub() {
    basic.executeStatement(basic.popStack() + 1);
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
    basic.setVariable(getVariableName(identifier), start.value, start.lineNumber);

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
    var identifierName = getVariableName(parameters[0]);

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
        }, getNumber(milliseconds))
    );
}

export function setBackgroundColour(mode, p1, p2, p3, alpha) {
    var chosenMode = String(mode != undefined ? mode.value : "grey").toLocaleLowerCase();

    if (canvas.COLOUR_NAMES.hasOwnProperty(chosenMode)) {
        term.background(chosenMode);
    } else if (chosenMode == "rgb") {
        expectParameters(p1, p2, p3);

        term.setColours(new canvas.Colour(
            getNumber(p1),
            getNumber(p2),
            getNumber(p3),
            alpha != undefined ? getNumber(alpha) : 1
        ), term.foregroundColour);
    } else if (chosenMode == "hsl") {
        expectParameters(p1, p2, p3);

        term.setColours(common.colourFromHsl(
            getNumber(p1),
            getNumber(p2),
            getNumber(p3),
            alpha != undefined ? getNumber(alpha) : 1
        ), term.foregroundColour);
    } else {
        throw new basic.RuntimeError(`Colour \`${chosenMode}\` does not exist`);
    }

    basic.executeStatement();
}

export function setForegroundColour(mode, p1, p2, p3, alpha) {
    var chosenMode = String(mode != undefined ? mode.value : "black").toLocaleLowerCase();

    if (canvas.COLOUR_NAMES.hasOwnProperty(chosenMode)) {
        term.foreground(chosenMode);
    } else if (chosenMode == "rgb") {
        expectParameters(p1, p2, p3);

        term.setColours(term.backgroundColour, new canvas.Colour(
            getNumber(p1),
            getNumber(p2),
            getNumber(p3),
            alpha != undefined ? getNumber(alpha) : 1
        ));
    } else if (chosenMode == "hsl") {
        expectParameters(p1, p2, p3);

        term.setColours(term.backgroundColour, common.colourFromHsl(
            getNumber(p1),
            getNumber(p2),
            getNumber(p3),
            alpha != undefined ? getNumber(alpha) : 1
        ));
    } else {
        throw new basic.RuntimeError(`Colour \`${chosenMode}\` does not exist`);
    }

    basic.executeStatement();
}

export function graphicsMove(x, y) {
    expectParameters(x, y);

    basic.setGraphicsPosition(getNumber(x), getNumber(y));
    basic.clearGraphicsPolygonPoints();
    basic.addGraphicsPolygonPoint(getNumber(x), getNumber(y));

    basic.executeStatement();
}

export function graphicsDraw(x, y) {
    expectParameters(x, y);

    canvas.setColour(term.foregroundColour);
    canvas.setStrokeWidth(basic.graphicsStrokeWidth, "round");
    canvas.drawLine(basic.graphicsX, basic.graphicsY, x.value, y.value);
    canvas.resetStrokeWidth();

    basic.setGraphicsPosition(getNumber(x), getNumber(y));
    basic.addGraphicsPolygonPoint(getNumber(x), getNumber(y));

    basic.executeStatement();
}

export function graphicsStroke(width) {
    expectParameters(width);

    basic.setGraphicsStrokeWidth(getNumber(width));

    basic.executeStatement();
}

export function graphicsFill() {
    canvas.drawPolygon(basic.graphicsPolygonPoints);
    canvas.resetStrokeWidth();
    
    basic.clearGraphicsPolygonPoints();

    basic.executeStatement();
}

export function graphicsDrawText(text, x, y, scaleFactor) {
    expectParameters(text, x, y);

    canvas.setColour(term.foregroundColour);
    canvas.drawText(basic.getValueDisplay(text.value), getNumber(x), getNumber(y), scaleFactor != undefined ? getNumber(scaleFactor) : 1);

    basic.executeStatement();
}

export function graphicsCopy() {
    canvas.copyToBuffer();

    basic.executeStatement();
}

export function graphicsRestore() {
    canvas.restoreFromBuffer();

    basic.executeStatement();
}

export function graphicsTakeFrame() {
    basic.graphicsTakeFrame();
    
    basic.executeStatement();
}

export function graphicsGetPixel(x, y, red, green, blue) {
    expectParameters(x, y, red, green, blue);

    var colour = canvas.getPixel(getNumber(x), getNumber(y));

    basic.setVariable(getVariableName(red), colour.red, red.lineNumber);
    basic.setVariable(getVariableName(green), colour.green, green.lineNumber);
    basic.setVariable(getVariableName(blue), colour.blue, blue.lineNumber);

    basic.executeStatement();
}