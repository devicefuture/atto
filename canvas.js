export const DISP_WIDTH = 640;
export const DISP_HEIGHT = 480;
export const DISP_SCALE_FACTOR = 2;
export const TERM_COLS = 40;
export const TERM_ROWS = 20;
export const CHAR_WIDTH = DISP_WIDTH / TERM_COLS;
export const CHAR_HEIGHT = DISP_HEIGHT / TERM_ROWS;

var element;
var buffer;
var context;
var readyListeners = [];
var docsOpen = false;

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

    clone() {
        return new Colour(this.red, this.green, this.blue, this.alpha);
    }

    matches(otherColour) {
        return this.red == otherColour.red && this.green == otherColour.green && this.blue == otherColour.blue;
    }
}

export var colourScheme = [
    new Colour(0, 0, 0), // Black
    new Colour(94, 52, 235), // Purple
    new Colour(62, 181, 74), // Dark green
    new Colour(28, 90, 189), // Dark blue
    new Colour(237, 26, 58), // Red
    new Colour(219, 29, 118), // Magenta
    new Colour(199, 80, 20), // Brown
    new Colour(238, 238, 238), // Light grey
    new Colour(56, 56, 56), // Dark grey
    new Colour(130, 134, 245), // Light purple
    new Colour(96, 230, 110), // Light green
    new Colour(80, 177, 242), // Light blue
    new Colour(255, 97, 121), // Light red
    new Colour(255, 71, 191), // Pink
    new Colour(252, 218, 63), // Yellow
    new Colour(255, 255, 255) // White
];

// Colour names are lowercase since they are used in the language itself
export const COLOUR_NAMES = {
    "black": 0,
    "purple": 1,
    "darkgreen": 2,
    "green": 2,
    "darkblue": 3,
    "blue": 3,
    "red": 4,
    "magenta": 5,
    "brown": 6,
    "lightgrey": 7,
    "lightgray": 7,
    "grey": 7,
    "gray": 7,
    "darkgrey": 8,
    "darkgray": 8,
    "lightpurple": 9,
    "lightgreen": 10,
    "lightblue": 11,
    "cyan": 11,
    "lightred": 12,
    "pink": 13,
    "yellow": 14,
    "white": 15
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

export function getElement() {
    return element;
}

export function setColour(colour) {
    context.fillStyle = colour.toCss();
    context.strokeStyle = colour.toCss();
}

export function setStrokeWidth(width, type = "butt") {
    context.lineWidth = width * DISP_SCALE_FACTOR;
    context.lineCap = type;
}

export function resetStrokeWidth() {
    context.lineWidth = 1;
    context.lineCap = "butt";
}

export function drawText(text, x, y, scaleFactor = 1) {
    context.font = `${CHAR_HEIGHT * DISP_SCALE_FACTOR * scaleFactor}px "Brass Mono", monospace`;
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (var i = 0; i < text.length; i++) {
        context.fillText(text[i], (x + ((i + 0.5) * CHAR_WIDTH * scaleFactor)) * DISP_SCALE_FACTOR, ((y + ((CHAR_HEIGHT * scaleFactor) / 2)) + 2) * DISP_SCALE_FACTOR);
    }
}

export function drawRect(x1, y1, x2, y2) {
    context.rect(...twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR));
    context.stroke();
}

export function fillRect(x1, y1, x2, y2) {
    context.fillRect(...twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR));
}

function pathRoundedRect(x1, y1, x2, y2, radius) {
    var [x, y, width, height] = twoPointsToPointSize(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR, x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR);

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

export function drawRoundedRect(x1, y1, x2, y2, radius) {
    pathRoundedRect(x1, y1, x2, y2, radius);

    context.stroke();
}

export function fillRoundedRect(x1, y1, x2, y2, radius) {
    pathRoundedRect(x1, y1, x2, y2, radius);

    context.fill();
}

export function drawLine(x1, y1, x2, y2) {
    context.beginPath();

    context.lineCap = "round";

    context.moveTo(x1 * DISP_SCALE_FACTOR, y1 * DISP_SCALE_FACTOR);
    context.lineTo(x2 * DISP_SCALE_FACTOR, y2 * DISP_SCALE_FACTOR);
    context.stroke();
}

export function drawPolygon(points) {
    if (points.length == 0) {
        return;
    }

    context.beginPath();

    context.moveTo(points[0][0] * DISP_SCALE_FACTOR, points[0][1] * DISP_SCALE_FACTOR);

    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i][0] * DISP_SCALE_FACTOR, points[i][1] * DISP_SCALE_FACTOR);
    }

    context.stroke();
    context.fill();
}

export function clear() {
    fillRect(0, 0, DISP_WIDTH, DISP_HEIGHT);
}

export function copyToBuffer() {
    buffer.getContext("2d").drawImage(element, 0, 0, DISP_WIDTH * DISP_SCALE_FACTOR, DISP_HEIGHT * DISP_SCALE_FACTOR);
}

export function restoreFromBuffer(x = 0, y = 0) {
    context.drawImage(buffer, x * DISP_SCALE_FACTOR, y * DISP_SCALE_FACTOR, DISP_WIDTH * DISP_SCALE_FACTOR, DISP_HEIGHT * DISP_SCALE_FACTOR);
}

export function getPixel(x, y) {
    var data = context.getImageData(Math.floor(x * DISP_SCALE_FACTOR), Math.floor(y * DISP_SCALE_FACTOR), 1, 1).data;

    return new Colour(data[0], data[1], data[2], 1);
}

function resize() {
    var isFullscreen = window.innerWidth == screen.width && window.innerHeight == screen.height;
    var availableWidth = docsOpen ? window.innerWidth - 400 : window.innerWidth;
    var viewportWidth = isFullscreen ? availableWidth : availableWidth - 40;
    var viewportHeight = isFullscreen ? window.innerHeight : window.innerHeight - 40;
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
    element.style.left = `${(availableWidth - width) / 2}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    if (isFullscreen) {
        document.body.classList.add("fullscreen");
    } else {
        document.body.classList.remove("fullscreen");
    }
}

export function init() {
    element = document.querySelector("canvas");
    context = element.getContext("2d");

    buffer = document.createElement("canvas");

    element.width = DISP_WIDTH * DISP_SCALE_FACTOR;
    element.height = DISP_HEIGHT * DISP_SCALE_FACTOR;

    buffer.width = element.width;
    buffer.height = element.height;

    resize();

    setColour(new Colour(238, 238, 238));
    clear();

    setColour(new Colour(0, 0, 0));
    setStrokeWidth(1);

    resetStrokeWidth();
    copyToBuffer();

    element.hidden = false;

    readyListeners.forEach((i) => i());
};

export function toggleDocs() {
    if (docsOpen = !docsOpen) {
        document.querySelector("#docs").hidden = false;
    } else {
        document.querySelector("#docs").hidden = true;
    }

    resize();
}

window.addEventListener("resize", resize);