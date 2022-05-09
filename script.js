import * as common from "./common.js";
import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as hid from "./hid.js";
import * as bot from "./bot.js";

import * as basic from "./basic.js";
window.basic = basic;

import * as syntax from "./syntax.js";
window.syntax = syntax;

window.inDocsPopout = false;
window.toggleDocumentation = canvas.toggleDocs;

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

if (common.getParameter("lsp") != null) {
    localStorage.setItem("atto_lastSessionProgram", common.getParameter("lsp"));

    window.location.replace("/");
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

    if (common.getParameter("code") != null && common.getParameter("runmode") != "list") {
        basic.textToProgram(common.getParameter("code"));

        term.print("\nLoaded shared program\n");

        try {
            basic.parseProgram(basic.editingProgram);
            basic.startProgram();

            if (common.getParameter("bot") != null) {
                bot.invoke(common.getParameter("bot"));
            }
        } catch (e) {
            basic.displayError(e);

            term.print("Ready\n");
            hid.startProgramInput();

            if (common.getParameter("bot") != null) {
                bot.invoke(common.getParameter("bot"));
            }
        }
    } else {
        if (common.getParameter("code") != null && common.getParameter("runmode") == "list") {
            term.print("\n");

            basic.textToProgram(common.getParameter("code"));

            basic.listLines();

            term.print("\nType ");
            term.foreground("magenta");
            term.print("run");
            term.foreground();
            term.print(" to run the program");
        }

        term.print("\nReady\n");

        hid.startProgramInput();
    }
});