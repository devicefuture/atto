window.inDocsPopout = true;

window.addEventListener("load", function() {
    Promise.all([import("./common.js"), import("./syntax.js")]).then(function([common, syntax]) {
        window.syntax = syntax;
    
        if (common.getParameter("page") != null) {
            visitDocumentation(common.getParameter("page"));
        } else {
            visitDocumentation("docs/index.md");
        }
    });
});