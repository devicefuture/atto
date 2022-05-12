window.inDocsPopout = true;

window.addEventListener("load", function() {
    Promise.all([import("./common.js"), import("./syntax.js")]).then(function([common, syntax]) {
        window.syntax = syntax;
    
        function loadDocumentation(updateUrl = true) {
            if (common.getParameter("page") != null) {
                visitDocumentation(common.getParameter("page"), updateUrl);
            } else {
                visitDocumentation("docs/index.md", updateUrl);
            }
        }

        window.addEventListener("popstate", function() {
            loadDocumentation(false);
        });

        loadDocumentation();
    });
});