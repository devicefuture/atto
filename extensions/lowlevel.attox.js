attoX.onReady(function() {
    attoX.registerCommand("evaljs", function(code) {
        try {
            attoX.setArgValue(1, eval(code));
        } catch (error) {
            return Promise.reject(String(error));
        }
    });

    attoX.ready();
});