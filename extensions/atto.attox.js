attoX.onReady(function() {
    attoX.registerCommand("evaljs", function(code) {
        try {
            attoX.setArgValue(1, eval(code));
        } catch (error) {
            return Promise.reject(String(error));
        }
    });

    attoX.registerCommand("openurl", function(url) {
        attoX.openExternalUrl(url);
    });

    attoX.registerCommand("visitdocs", function(path, popOut = false) {
        attoX.visitDocs(path, popOut);
    });

    attoX.registerCommand("closedocs", function() {
        attoX.closeDocs();
    });

    attoX.ready();
});