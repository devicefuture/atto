export var loaded = {};

var injectionCode = null;

export var apiCommands = {
    _getApiCommandList: function() {
        return Promise.resolve(Object.keys(apiCommands));
    },
    test: function() {
        return Promise.resolve("Works!");
    }
};

export class Extension {
    constructor(code) {
        var thisScope = this;

        if (injectionCode == null) {
            throw new Error("Extension system not initialised");
        }

        this.worker = new Worker(URL.createObjectURL(new Blob([injectionCode + "\n" + code], {type: "text/javascript"})));

        this.commands = {};

        this.worker.addEventListener("message", function(event) {
            if (event.data.mode == "call") {
                ((apiCommands[event.data.command] || (() => Promise.reject("Unknown command")))() || Promise.resolve()).then(function(data) {
                    thisScope.worker.postMessage({
                        mode: "reply",
                        id: event.data.id,
                        status: "resolve",
                        data
                    });
                }).catch(function() {
                    thisScope.worker.postMessage({
                        mode: "reply",
                        id: event.data.id,
                        status: "reject",
                        data
                    });
                });
            }
        });
    }
}

export function init() {
    if (injectionCode != null) {
        return Promise.resolve();
    }

    return fetch("extapi.js").then(function(response) {
        return response.text();
    }).then(function(data) {
        injectionCode = data;

        return Promise.resolve();
    });
}

export function load(url, givenName = null) {
    return init().then(function() {
        return fetch(url);
    }).then(function(response) {
        if (response.status != 200) {
            return Promise.reject(response);
        }

        return response.text();
    }).then(function(data) {
        loaded[givenName] = new Extension(data);
    });
}

export function hasLoaded(extensionName) {
    extensionName = extensionName.toLowerCase();

    return loaded[extensionName] instanceof Extension;
}

export function getCommand(commandName) {
    commandName = commandName.toLowerCase();

    return loaded[commandName.split(".")[0]]?.commands[commandName.split(".")[1]] || null;
}