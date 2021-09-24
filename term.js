import * as theme from "./theme.js";
import * as canvas from "./canvas.js";
import * as hid from "./hid.js";

const defaultBackgroundColourName = theme.isDarkMode() ? "black" : "lightgrey";
const defaultForegroundColourName = theme.isDarkMode() ? "white" : "black";

export var backgroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[defaultBackgroundColourName]];
export var foregroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[defaultForegroundColourName]];

export var col = 0;
export var row = 0;
export var scrollDelta = 0;

export function background(colourName = defaultBackgroundColourName) {
    backgroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[colourName]];
}

export function foreground(colourName = defaultForegroundColourName) {
    foregroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[colourName]];
}

export function setColours(background, foreground) {
    backgroundColour = background;
    foregroundColour = foreground;
}

export function scrollUp() {
    canvas.copyToBuffer();
    canvas.setColour(backgroundColour);
    canvas.clear();
    canvas.restoreFromBuffer(0, canvas.CHAR_HEIGHT);

    scrollDelta--;
}

export function scrollDown() {
    canvas.copyToBuffer();
    canvas.setColour(backgroundColour);
    canvas.clear();
    canvas.restoreFromBuffer(0, -canvas.CHAR_HEIGHT);

    scrollDelta++;
}

export function up() {
    row--;

    if (row < 0) {
        row = 0;

        scrollUp();
    }
}

export function down() {
    row++;

    if (row >= canvas.TERM_ROWS) {
        row = canvas.TERM_ROWS - 1;

        scrollDown();
    }
}

export function left(wrap = true) {
    col--;

    if (col < 0) {
        col = canvas.TERM_COLS - 1;

        if (wrap) {
            up();
        }
    }
}

export function right(wrap = true) {
    col++;

    if (col >= canvas.TERM_COLS) {
        col = 0;

        if (wrap) {
            down();
        }
    }
}

export function goto(newCol, newRow) {
    col = newCol;
    row = newRow;
}

export function clear() {
    canvas.setColour(backgroundColour);
    canvas.clear();
}

export function print(text, notifyHid = true, wrap = true) {
    text = Array.from(text);

    var textCharsToDraw = [];

    for (var i = 0; i < text.length; i++) {
        switch (text[i]) {
            case "\n":
                down();
                // Don't break; continue to reset column
                
            case "\r":
                col = 0;
                break;

            case "\t":
                for (var j = 0; j < 4; j++) {right();}
                break;

            case "\v":
            case "\f":
                down();
                break;

            case "\b":
                left(wrap);
                break;

            default:
                canvas.setColour(backgroundColour);
                canvas.fillRect(col * canvas.CHAR_WIDTH, row * canvas.CHAR_HEIGHT, (col + 1) * canvas.CHAR_WIDTH, (row + 1) * canvas.CHAR_HEIGHT);
                canvas.setColour(foregroundColour);
                canvas.drawText(text[i], col * canvas.CHAR_WIDTH, row * canvas.CHAR_HEIGHT);
                right(wrap);
                break;
        }
    }

    // textCharsToDraw.forEach((charArgs) => canvas.drawText(...charArgs));

    if (notifyHid) {
        hid.log(text);
    }
}