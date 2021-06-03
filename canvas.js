export const DISP_WIDTH = 640;
export const DISP_HEIGHT = 480;
export const DISP_SCALE_FACTOR = 2;
export const TERM_COLS = 40;
export const TERM_ROWS = 20;
export const CHAR_WIDTH = DISP_WIDTH / TERM_COLS;
export const CHAR_HEIGHT = DISP_HEIGHT / TERM_ROWS;

const TEXT_FONT = `${CHAR_HEIGHT * DISP_SCALE_FACTOR}px "Brass Mono", monospace`;

var element;
var context;
var readyListeners = [];

export class Colour {
    constructor(red, green, blue, alpha = 1) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toCss() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
}

function twoPointsToPointSize(x1, y1, x2, y2) {
    return [
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
    ];
}

export function onReady(callback) {
    readyListeners.push(callback);
}

export function setColour(colour) {
    context.fillStyle = colour.toCss();
    context.strokeStyle = colour.toCss();
}

export function setStrokeWidth(width) {
    context.lineWidth = width * DISP_SCALE_FACTOR;
}

export function drawText(text, x, y) {
    context.font = TEXT_FONT;
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (var i = 0; i < text.length; i++) {
        context.fillText(text[i], (x + ((i + 0.5) * CHAR_WIDTH)) * DISP_SCALE_FACTOR, (y + (CHAR_HEIGHT / 2)) * DISP_SCALE_FACTOR);
    }
}

export function drawRect(x1, y1, x2, y2) {
    context.rect(...twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR));
    context.stroke();
}

export function fillRect(x1, y1, x2, y2) {
    context.fillRect(...twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR));
}

function pathRoundedRect(x1, x2, y1, y2, radius) {
    var [x, y, width, height] = twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR);

    radius = radius * DISP_SCALE_FACTOR;

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

export function drawRoundedRect(x1, x2, y1, y2, radius) {
    pathRoundedRect(x1, x2, y1, y2, radius);

    context.stroke();
}

export function fillRoundedRect(x1, x2, y1, y2, radius) {
    pathRoundedRect(x1, x2, y1, y2, radius);

    context.fill();
}

function resize() {
    var viewportWidth = window.innerWidth - 40;
    var viewportHeight = window.innerHeight - 40;
    var scaledDisplayWidth = DISP_WIDTH * DISP_SCALE_FACTOR;
    var scaledDisplayHeight = DISP_HEIGHT * DISP_SCALE_FACTOR;

    var width;
    var height;

    if (scaledDisplayHeight * (viewportWidth / scaledDisplayWidth) < viewportHeight) {
        width = viewportWidth;
        height = scaledDisplayHeight * (viewportWidth / scaledDisplayWidth);
    } else {
        width = scaledDisplayWidth * (viewportHeight / scaledDisplayHeight);
        height = viewportHeight;
    }

    element.style.top = `${(window.innerHeight - height) / 2}px`;
    element.style.left = `${(window.innerWidth - width) / 2}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
}

window.addEventListener("load", function() {
    element = document.querySelector("canvas");
    context = element.getContext("2d");

    element.width = DISP_WIDTH * DISP_SCALE_FACTOR;
    element.height = DISP_HEIGHT * DISP_SCALE_FACTOR;

    resize();

    setColour(new Colour(0, 0, 0));
    setStrokeWidth(1);

    readyListeners.forEach((i) => i());
});

window.addEventListener("resize", resize);