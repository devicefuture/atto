import * as canvas from "./canvas.js";

canvas.onReady(function() {
    canvas.drawText("Hello, world!", 0, 0);
    canvas.fillRoundedRect(16, 24, 32, 48, 4);
});