export const VIRTUAL_WIDTH = 640;
export const VIRTUAL_HEIGHT = 480;

export var element;

export function resize() {
    var viewportWidth = window.innerWidth - 40;
    var viewportHeight = window.innerHeight - 40;

    var width;
    var height;

    if (VIRTUAL_HEIGHT * (viewportWidth / VIRTUAL_WIDTH) < viewportHeight) {
        width = viewportWidth;
        height = VIRTUAL_HEIGHT * (viewportWidth / VIRTUAL_WIDTH);
    } else {
        width = VIRTUAL_WIDTH * (viewportHeight / VIRTUAL_HEIGHT);
        height = viewportHeight;
    }

    element.style.top = `${(window.innerHeight - height) / 2}px`;
    element.style.left = `${(window.innerWidth - width) / 2}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
}

window.addEventListener("load", function() {
    element = document.querySelector("canvas");

    resize();
});

window.addEventListener("resize", resize);