import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";

import * as syntax from "./syntax.js";
window.syntax = syntax;

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

    hid.startProgramInput();
});