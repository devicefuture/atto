/*
    Used for communications with Twitter bot server code.
    See https://github.com/James-Livesey/atto-twitter for more details.
*/

import * as canvas from "./canvas.js";
import * as hid from "./hid.js";

export const EXECUTION_WAIT_TIME = 5 * 1000; // 5 seconds

export function invoke(id) {
    hid.clearLog();

    setTimeout(function() {
        finish(id);
    }, EXECUTION_WAIT_TIME);
}

export function finish(id) {
    var dataUrl = canvas.getElement().toDataURL();
    var imageBase64 = dataUrl.split(",")[1];

    var hidLogEntries = [];

    [...hid.hidLog.children].forEach(function(element) {
        hidLogEntries.push(element.textContent);
    });

    var request = new XMLHttpRequest();

    request.open("POST", `http://localhost:3000/fulfil/${id}`);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.addEventListener("load", function() {
        window.location.href = "about:blank";
    });

    request.send(JSON.stringify({
        content: imageBase64,
        altText: hidLogEntries.slice(Math.max(hidLogEntries.length - canvas.TERM_ROWS, 0)).join("\n")
    }));
}