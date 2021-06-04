import * as canvas from "./canvas.js";

canvas.onReady(function() {
    canvas.drawText("Welcome to ", 0, 0);
    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.blue]);
    canvas.drawText("atto", canvas.CHAR_WIDTH * 11, 0);

    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.black]);
    canvas.drawText("Type ", 0, canvas.CHAR_HEIGHT);
    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.green]);
    canvas.drawText("help", canvas.CHAR_WIDTH * 5, canvas.CHAR_HEIGHT);
    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.black]);
    canvas.drawText(" to view the guide", canvas.CHAR_WIDTH * 9, canvas.CHAR_HEIGHT);

    canvas.drawText("Ready", 0, canvas.CHAR_HEIGHT * 3);

    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.magenta]);
    canvas.fillRoundedRect(2, canvas.CHAR_HEIGHT * 4, 6, (canvas.CHAR_HEIGHT * 5) - 4, 2);
    canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES.black]);
    canvas.drawText("10 print \"Hello, world!\"", 0, canvas.CHAR_HEIGHT * 4);

    for (var i = 0; i < 8; i++) {
        canvas.setColour(canvas.colourScheme[i]);
        canvas.fillRoundedRect(
            (2 * i * canvas.CHAR_WIDTH) + canvas.CHAR_WIDTH,
            canvas.CHAR_HEIGHT * 6,
            (2 * i * canvas.CHAR_WIDTH) + (3 * canvas.CHAR_WIDTH) - 2,
            (canvas.CHAR_HEIGHT * 7) - 2,
            4
        );
    }

    for (var i = 0; i < 8; i++) {
        canvas.setColour(canvas.colourScheme[i + 8]);
        canvas.fillRoundedRect(
            (2 * i * canvas.CHAR_WIDTH) + canvas.CHAR_WIDTH,
            canvas.CHAR_HEIGHT * 7,
            (2 * i * canvas.CHAR_WIDTH) + (3 * canvas.CHAR_WIDTH) - 2,
            (canvas.CHAR_HEIGHT * 8) - 2,
            4
        );
    }
});