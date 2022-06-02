attoX.onReady(function() {
    attoX.registerCommand("isonline", function() {
        attoX.setArgValue(0, navigator.onLine);
    });

    attoX.registerCommand("get", function(url) {
        return fetch(url).then(function(response) {
            attoX.setArgValue(2, response.status);

            return response.text();
        }).then(function(data) {
            attoX.setArgValue(1, data);

            return Promise.resolve();
        }).catch(function(error) {
            console.error(error);

            return Promise.reject("Couldn't fetch data");
        });
    });

    attoX.ready();
});