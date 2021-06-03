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

export function onReady(callback) {
    readyListeners.push(callback);
}

export function drawText(text, x, y) {
    context.font = TEXT_FONT;
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (var i = 0; i < text.length; i++) {
        context.fillText(text[i], x + ((i + 0.5) * CHAR_WIDTH * DISP_SCALE_FACTOR), CHAR_HEIGHT * DISP_SCALE_FACTOR / 2);
    }
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

    readyListeners.forEach((i) => i());
});

window.addEventListener("resize", resize);