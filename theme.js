import * as core from "./core.js";

function detectIsDarkMode() {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

const IS_DARK_MODE = core.getParameter("theme") != null ? (core.getParameter("theme") == "dark") : detectIsDarkMode();

export function isDarkMode() {
    return IS_DARK_MODE;
}

window.addEventListener("load", function() {
    if (core.getParameter("theme") == "light") {
        document.body.classList.add("lightTheme");
    }

    if (core.getParameter("theme") == "dark") {
        document.body.classList.add("darkTheme");
    }
});