attoX.onReady(function() {
    function traverseObject(object, path) {
        if (path.length == 0 || typeof(object) != "object") {
            return object;
        }

        return traverseObject(object[path.shift()], path);
    }

    attoX.registerCommand("parse", function(data, path) {
        try {
            data = JSON.parse(data);

            attoX.setArgValue(2, traverseObject(data, typeof(path) == "object" ? path : String(path).split(".")));

            return Promise.resolve();
        } catch (e) {
            return Promise.reject("Couldn't parse JSON");
        }
    });

    attoX.ready();
});