export var element;

export function resize() {
    var viewportWidth = window.innerWidth - 40;
    var viewportHeight = window.innerHeight - 40;

    var width;
    var height;

    if (600 * (viewportWidth / 800) < viewportHeight) {
        width = viewportWidth;
        height = 600 * (viewportWidth / 800);
    } else {
        width = 800 * (viewportHeight / 600);
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