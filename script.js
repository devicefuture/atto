import * as common from "./common.js";
import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";

import * as basic from "./basic.js";
window.basic = basic;

import * as syntax from "./syntax.js";
window.syntax = syntax;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(function() {
        console.log("Service worker successfully registered");
    });

    navigator.serviceWorker.ready.then(function() {
        console.log("Service worker is now ready");
    });
} else {
    console.log("Service workers not supported in this browser");
}

canvas.onReady(function() {
    term.print("Welcome to ");
    term.foreground("blue");
    term.print("atto\n");
    term.foreground();
    term.print("Type ");
    term.foreground("green");
    term.print("help");
    term.foreground();
    term.print(" to view the guide\n");

    if (localStorage.getItem("atto_lastSessionProgram") != null) {
        term.print("Type ");
        term.foreground("red");
        term.print("load");
        term.foreground();
        term.print(" to load last session\n");
    }

    if (common.getParameter("code") != null) {
        basic.textToProgram(common.getParameter("code"));
        basic.parseProgram(basic.editingProgram);

        term.print("\nLoaded shared program\n");

        setTimeout(function() {
            basic.startProgram();  
        });
    } else {
        term.print("\nReady\n");

        hid.startProgramInput();
    }
});