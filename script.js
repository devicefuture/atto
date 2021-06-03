import * as canvas from "./canvas.js";

canvas.onReady(function() {
    canvas.drawText("Hello, world!", 0, 0);
    canvas.drawRect(16, 24, 32, 48);
});