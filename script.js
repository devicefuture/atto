import * as canvas from "./canvas.js";

canvas.onReady(function() {
    canvas.drawText("Welcome to ", 0, 0);
    canvas.setColour(new canvas.Colour(0, 0, 255));
    canvas.drawText("atto", canvas.CHAR_WIDTH * 11, 0);

    canvas.setColour(new canvas.Colour(0, 0, 0));
    canvas.drawText("Type ", 0, canvas.CHAR_HEIGHT);
    canvas.setColour(new canvas.Colour(255, 0, 0));
    canvas.drawText("help", canvas.CHAR_WIDTH * 5, canvas.CHAR_HEIGHT);
    canvas.setColour(new canvas.Colour(0, 0, 0));
    canvas.drawText(" to view the guide", canvas.CHAR_WIDTH * 9, canvas.CHAR_HEIGHT);

    canvas.drawText("Ready", 0, canvas.CHAR_HEIGHT * 3);

    canvas.setColour(new canvas.Colour(255, 0, 0, 0.8));
    canvas.fillRoundedRect(2, canvas.CHAR_HEIGHT * 4, 6, (canvas.CHAR_HEIGHT * 5) - 4, 2);
    canvas.setColour(new canvas.Colour(0, 0, 0));
    canvas.drawText("10 print \"Hello, world!\"", 0, canvas.CHAR_HEIGHT * 4);
});