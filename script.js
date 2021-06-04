import * as canvas from "./canvas.js";
import * as term from "./term.js";

canvas.onReady(function() {
    term.print("Welcome to ");
    term.foreground("blue");
    term.print("atto\n");
    term.foreground();
    term.print("Type ");
    term.foreground("green");
    term.print("help");
    term.foreground();
    term.print(" to view the guide\n\n");
    term.print("Ready\n");
    term.print("10 print \"Hello, world!\"");


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