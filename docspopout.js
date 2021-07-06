import * as syntax from "./syntax.js";
window.syntax = syntax;

import * as common from "./common.js";

window.inDocsPopout = true;

window.addEventListener("load", function() {
    if (common.getParameter("page") != null) {
        visitDocumentation(common.getParameter("page"));
    } else {
        visitDocumentation("docs/index.md");
    }
});