import * as common from "./common.js";
import * as basic from "./basic.js";
import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";
import * as audio from "./audio.js";
import * as theme from "./theme.js";
import * as extensions from "./extensions.js";

export var keywords = {
    "extload": extensionLoad,
    "extunload": extensionUnload,
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
    "turn": setTrigTurns,
    "pos": setTextPosition,
    "cls": clearScreen,
    "delay": delay,
    "bg": setBackgroundColour,
    "fg": setForegroundColour,
    "move": graphicsMove,
    "draw": graphicsDraw,
    "plot": graphicsPlot,
    "stroke": graphicsStroke,
    "fill": graphicsFill,
    "text": graphicsDrawText,
    "copy": graphicsCopy,
    "restore": graphicsRestore,
    "frame": graphicsTakeFrame,
    "getpixel": graphicsGetPixel,
    "dim": listCreate,
    "push": listPush,
    "pop": listPop,
    "insert": listInsert,
    "remove": listRemove,
    "show": turtleShow,
    "hide": turtleHide,
    "forward": turtleForward,
    "backward": turtleBackward,
    "left": turtleLeft,
    "right": turtleRight,
    "penup": turtlePenUp,
    "pendown": turtlePenDown,
    "angle": turtleAngle,
    "note": audioNote,
    "play": audioPlay,
    "rest": audioRest,
    "quiet": audioQuiet,
    "bpm": audioBpm,
    "volume": audioVolume,
    "envelope": audioEnvelope,
    "speak": audioSpeak,
    "voice": audioVoice
};

function expectParameters(...parameters) {
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i] == undefined) {
            throw new basic.RuntimeError(parameters.length > 1 ? `Expected ${parameters.length} parameters`: `Expected 1 parameter`, basic.findLineNumberByPosition(basic.currentPosition));
        }
    }
}

function getNumber(parameter) {
    return basic.getValueComparative(Number(parameter.value), parameter.lineNumber);
}

export function extensionLoad(url, givenName) {
    if (url == null) {
        throw new basic.RuntimeError("No extension location provided");
    }

    if (givenName != null) {
        givenName = basic.getValueDisplay(givenName.value, givenName.lineNumber);

        if (!givenName.match(/^[a-z_][a-z0-9_]*$/)) {
            throw new basic.RuntimeError("Invalid extension name");
        }
    }

    return extensions.load(url.value, givenName).then(function(loadPerformed) {
        if (!loadPerformed) {
            basic.executeStatement();

            return Promise.resolve();
        }
    }).catch(function(error) {
        console.error(error);

        return Promise.reject(new basic.RuntimeError("Couldn't load extension"));
    });
}

export function extensionUnload(extensionName) {
    if (extensionName == null) {
        throw new basic.RuntimeError("No extension name provided");
    }

    extensions.unload(basic.getValueDisplay(extensionName.value, extensionName.lineNumber));

    basic.executeStatement();
}

export function print(value) {
    term.print((value == undefined ? "" : basic.getValueDisplay(value.value, value.lineNumber)) + (value == undefined || !value.postConcat ? "\n" : ""));

    basic.executeStatement();
}

export function input(p1, p2) {
    expectParameters(p1);

    term.print(p2 == undefined ? "" : basic.getValueDisplay(p1.value, p1.lineNumber));

    hid.startInput().then(function(value) {
        basic.setStore(p2 == undefined ? p1 : p2, value);

        basic.executeStatement();
    });
}

export function assign(identifier, value) {
    basic.setStore(identifier, value.value);

    basic.executeStatement();
}

export function goto(lineNumber) {
    expectParameters(lineNumber);

    var labels = Object.keys(basic.programLabels);

    for (var i = 0; i < labels.length; i++) {
        if (!Number.isNaN(Number(labels[i]))) {
            if (Number(labels[i]) >= Number(lineNumber.value)) {
                basic.executeStatement(basic.programLabels[labels[i]]);

                return;
            }
        }

        if (labels[i] == lineNumber.value) { // Here if we end up adding textual labels
            basic.executeStatement(basic.programLabels[lineNumber.value]);

            return;
        }
    }

    if (!basic.programLabels.hasOwnProperty(lineNumber.value)) {
        throw new basic.RuntimeError(`Cannot goto nonexistent line ${lineNumber.value}`, lineNumber.lineNumber);
    }
}

export function gosub(lineNumber) {
    expectParameters(lineNumber);

    var labels = Object.keys(basic.programLabels);

    for (var i = 0; i < labels.length; i++) {
        if (!Number.isNaN(Number(labels[i]))) {
            if (Number(labels[i]) >= Number(lineNumber.value)) {
                basic.pushStack(lineNumber.lineNumber);
                basic.executeStatement(basic.programLabels[labels[i]]);

                return;
            }
        }

        if (labels[i] == lineNumber.value) { // Here if we end up adding textual labels
            basic.pushStack(lineNumber.lineNumber);
            basic.executeStatement(basic.programLabels[lineNumber.value]);

            return;
        }
    }

    if (!basic.programLabels.hasOwnProperty(lineNumber.value)) {
        throw new basic.RuntimeError(`Cannot gosub to nonexistent line ${lineNumber.value}`, lineNumber.lineNumber);
    }
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
    basic.setStore(identifier, start.value);

    if (step == null) {
        if (start.value <= end.value) {
            step = new syntax.LeafExpression([new syntax.NumericLiteral("1", identifier.lineNumber)], identifier.lineNumber);
        } else {
            step = new syntax.NegationHelperExpression([
                new syntax.LeafExpression([new syntax.NumericLiteral("1", identifier.lineNumber)], identifier.lineNumber)
            ], identifier.lineNumber);

            step.parse();
        }

        basic.parsedProgram[basic.currentPosition].parameters[3] = step;
    }

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

    if (
        (basic.getValueComparative(parameters[3].value) >= 0 && basic.getValueComparative(parameters[0].value) < basic.getValueComparative(parameters[2].value)) ||
        (basic.getValueComparative(parameters[3].value) < 0 && basic.getValueComparative(parameters[0].value) > basic.getValueComparative(parameters[2].value))
    ) {
        basic.setStore(parameters[0], parameters[0].value + parameters[3].value);
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

export function setTrigTurns() {
    basic.setTrigMode(basic.trigModes.TURNS);

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
    var chosenMode = String(mode != undefined ? mode.value : (theme.isDarkMode() ? "black" : "grey")).toLocaleLowerCase();

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
    var chosenMode = String(mode != undefined ? mode.value : (theme.isDarkMode() ? "white" : "black")).toLocaleLowerCase();

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

    basic.setTurtleMoved(false);
    basic.setGraphicsPosition(getNumber(x), getNumber(y));
    basic.clearGraphicsPolygonPoints();
    basic.addGraphicsPolygonPoint(getNumber(x), getNumber(y));

    basic.executeStatement();
}

export function graphicsDraw(x, y) {
    expectParameters(x, y);

    canvas.setColour(term.foregroundColour);
    canvas.setStrokeWidth(basic.graphicsStrokeWidth, "round");
    canvas.drawLine(basic.graphicsX, basic.graphicsY, getNumber(x), getNumber(y));
    canvas.resetStrokeWidth();

    basic.setTurtleMoved(false);
    basic.setGraphicsPosition(getNumber(x), getNumber(y));
    basic.addGraphicsPolygonPoint(getNumber(x), getNumber(y));

    basic.executeStatement();
}

export function graphicsPlot(x, y) {
    expectParameters(x, y);

    canvas.setColour(term.foregroundColour);
    canvas.setStrokeWidth(basic.graphicsStrokeWidth, "round");
    canvas.drawLine(getNumber(x), getNumber(y), getNumber(x), getNumber(y));
    canvas.resetStrokeWidth();

    basic.setTurtleMoved(false);
    basic.setGraphicsPosition(getNumber(x), getNumber(y));
    basic.clearGraphicsPolygonPoints();
    basic.addGraphicsPolygonPoint(getNumber(x), getNumber(y));

    basic.executeStatement();
}

export function graphicsStroke(width) {
    expectParameters(width);

    basic.setGraphicsStrokeWidth(getNumber(width));

    basic.executeStatement();
}

export function graphicsFill() {
    canvas.setColour(term.foregroundColour);
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

export function graphicsGetPixel(mode, x, y, p1, p2, p3) {
    var chosenMode = String(mode.value).toLocaleLowerCase();

    expectParameters(chosenMode, x, y, p1, p2, p3);

    var colour = canvas.getPixel(getNumber(x), getNumber(y));

    if (chosenMode == "rgb") {
        basic.setStore(p1, colour.red);
        basic.setStore(p2, colour.green);
        basic.setStore(p3, colour.blue);
    } else if (chosenMode == "hsl") {
        var hsl = common.hslFromColour(colour);

        basic.setStore(p1, hsl.hue);
        basic.setStore(p2, hsl.saturation);
        basic.setStore(p3, hsl.luminance);
    } else {
        throw new basic.RuntimeError(`Colour space \`${chosenMode}\` does not exist`, mode.lineNumber);
    }

    basic.executeStatement();
}

export function listCreate(identifier) {
    expectParameters(identifier);

    basic.setStore(identifier, []);

    basic.executeStatement();
}

export function listPush(value, identifier) {
    expectParameters(value, identifier);

    if (typeof(identifier.value) != "object") {
        throw new basic.RuntimeError("Cannot push to non-list variable", identifier.lineNumber);
    }

    basic.setStore(identifier, [...identifier.value, value.value]);

    basic.executeStatement();
}

export function listPop(identifier, reassignVariable) {
    expectParameters(identifier);

    if (typeof(identifier.value) != "object") {
        throw new basic.RuntimeError("Cannot pop from non-list variable", identifier.lineNumber);
    }

    var list = [...identifier.value];

    if (list.length == 0) {
        if (reassignVariable != undefined) {
            basic.setStore(reassignVariable, 0);
        }

        basic.executeStatement();

        return;
    }

    var popped = list.pop();

    basic.setStore(identifier, list);

    if (reassignVariable != undefined) {
        basic.setStore(reassignVariable, popped);
    }

    basic.executeStatement();
}

export function listInsert(value, identifier, index) {
    expectParameters(value, identifier, index);

    if (typeof(identifier.value) != "object") {
        throw new basic.RuntimeError("Cannot insert into non-list variable", identifier.lineNumber);
    }

    var list = [...identifier.value];

    list.splice(index.value, 0, value.value);
    basic.setStore(identifier, list);

    basic.executeStatement();
}

export function listRemove(identifier, index) {
    expectParameters(identifier, index);

    if (typeof(identifier.value) != "object") {
        throw new basic.RuntimeError("Cannot insert into non-list variable");
    }

    var list = [...identifier.value];

    list.splice(index.value, 1);
    basic.setStore(identifier, list);

    basic.executeStatement();
}

export function turtleShow() {
    basic.setTurtleMoved();
    basic.preTurtleRender();
    basic.setTurtleShown(true);
    basic.renderTurtle();

    basic.executeStatement();
}

export function turtleHide() {
    basic.setTurtleMoved();
    basic.preTurtleRender();
    basic.setTurtleShown(false);
    basic.renderTurtle();

    basic.executeStatement();
}

export function turtleForward(distance) {
    expectParameters(distance);

    basic.setTurtleMoved();
    basic.preTurtleRender();

    (basic.turtlePenDown ? graphicsDraw : graphicsMove)(
        {value: basic.graphicsX + (getNumber(distance) * Math.cos(basic.turtleHeading - (Math.PI / 2)))},
        {value: basic.graphicsY + (getNumber(distance) * Math.sin(basic.turtleHeading - (Math.PI / 2)))}
    );

    basic.renderTurtle();
}

export function turtleBackward(distance) {
    expectParameters(distance);

    basic.setTurtleMoved();
    basic.preTurtleRender();

    (basic.turtlePenDown ? graphicsDraw : graphicsMove)(
        {value: basic.graphicsX - (getNumber(distance) * Math.cos(basic.turtleHeading - (Math.PI / 2)))},
        {value: basic.graphicsY - (getNumber(distance) * Math.sin(basic.turtleHeading - (Math.PI / 2)))}
    );

    basic.renderTurtle();
}

export function turtleLeft(angle) {
    expectParameters(angle);

    basic.setTurtleMoved();
    basic.preTurtleRender();
    basic.setTurtleHeading(basic.turtleHeading - basic.trigModeToRadians(getNumber(angle)));
    basic.renderTurtle();

    basic.executeStatement();
}

export function turtleRight(angle) {
    expectParameters(angle);

    basic.setTurtleMoved();
    basic.preTurtleRender();
    basic.setTurtleHeading(basic.turtleHeading + basic.trigModeToRadians(getNumber(angle)));
    basic.renderTurtle();

    basic.executeStatement();
}

export function turtlePenUp() {
    basic.setTurtlePenDown(false);

    basic.executeStatement();
}

export function turtlePenDown() {
    basic.setTurtlePenDown(true);

    basic.executeStatement();
}

export function turtleAngle(angle) {
    expectParameters(angle);

    basic.preTurtleRender();
    basic.setTurtleHeading(basic.trigModeToRadians(getNumber(angle)));
    basic.renderTurtle();

    basic.executeStatement();
}

export function audioNote(note, beats) {
    expectParameters(note, beats);

    try {
        audio.play(note.value, getNumber(beats));
    } catch (e) {
        e.lineNumber = note.lineNumber;

        throw e;
    }

    basic.setDelayTimeout(
        setTimeout(function() {
            if (basic.running) {
                basic.executeStatement();
            }
        }, audio.beatsToMilliseconds() * getNumber(beats))
    );
}

export function audioPlay(note, beats) {
    expectParameters(note, beats);

    try {
        audio.play(note.value, getNumber(beats));
    } catch (e) {
        e.lineNumber = note.lineNumber;

        throw e;
    }

    basic.executeStatement();
}

export function audioRest(beats) {
    expectParameters(beats);

    basic.setDelayTimeout(
        setTimeout(function() {
            if (basic.running) {
                basic.executeStatement();
            }
        }, audio.beatsToMilliseconds() * getNumber(beats))
    );
}

export function audioQuiet() {
    audio.quiet();

    basic.executeStatement();
}

export function audioBpm(bpm) {
    if (bpm == undefined) {
        audio.setBpm(120);

        basic.executeStatement();

        return;
    }

    if (getNumber(bpm) <= 0) {
        throw new basic.RuntimeError("Number of beats per minute must be greater than 0", beats.lineNumber);
    }

    audio.setBpm(getNumber(bpm));

    basic.executeStatement();
}

export function audioVolume(volume) {
    if (volume == undefined) {
        audio.setVolume(1);

        basic.executeStatement();

        return;
    }

    audio.setVolume(getNumber(volume));

    basic.executeStatement();
}

export function audioEnvelope(attack, decay, sustain, release) {
    if (attack == undefined) {
        audio.setEnvelope(100, 200, 0.5, 800);

        basic.executeStatement();

        return;
    }

    expectParameters(attack, decay, sustain, release);

    audio.setEnvelope(getNumber(attack), getNumber(decay), getNumber(sustain), getNumber(release));

    basic.executeStatement();
}

export function audioSpeak(message) {
    expectParameters(message);

    audio.speak(message.value);

    basic.executeStatement();
}

export function audioVoice(pitch, rate) {
    if (pitch == undefined) {
        audio.setVoice(1, 1);

        basic.executeStatement();

        return;
    }

    expectParameters(pitch, rate);

    audio.setVoice(getNumber(pitch), getNumber(rate));

    basic.executeStatement();
}