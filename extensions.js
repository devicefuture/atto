import * as basic from "./basic.js";
import * as term from "./term.js";
import * as hid from "./hid.js";
import * as canvas from "./canvas.js";
import * as theme from "./theme.js";

export var loaded = {};

var injectionCode = null;

function wrapPromise(callback) {
    return function() {
        var result = callback(...arguments);

        if (result instanceof Promise) {
            return result;
        }

        return Promise.resolve(result);
    };
}

export var apiCommands = {
    _getApiCommandList: function() {
        return Promise.resolve(Object.keys(apiCommands));
    },
    ready: wrapPromise(function() {
        basic.executeStatement();
    }),
    background: wrapPromise(term.background),
    foreground: wrapPromise(term.foreground),
    scrollUp: wrapPromise(term.scrollUp),
    scrollDown: wrapPromise(term.scrollDown),
    up: wrapPromise(term.up),
    down: wrapPromise(term.down),
    left: wrapPromise(term.left),
    right: wrapPromise(term.right),
    goto: wrapPromise(term.goto),
    clear: wrapPromise(term.clear),
    print: wrapPromise(term.print),
    input: function(message = "") {
        term.print(message);

        return hid.startInput();
    },
    getKey: wrapPromise(() => basic.currentKey),
    stroke: wrapPromise(canvas.setStrokeWidth),
    resetStroke: wrapPromise(canvas.resetStrokeWidth),
    drawText: wrapPromise(canvas.drawText),
    drawRect: wrapPromise(canvas.drawRect),
    fillRect: wrapPromise(canvas.fillRect),
    drawRoundedRect: wrapPromise(canvas.drawRoundedRect),
    fillRoundedRect: wrapPromise(canvas.fillRoundedRect),
    drawLine: wrapPromise(canvas.drawLine),
    drawPolygon: wrapPromise(canvas.drawPolygon),
    copyToBuffer: wrapPromise(canvas.copyToBuffer),
    restoreFromBuffer: wrapPromise(canvas.restoreFromBuffer),
    getPixel: wrapPromise(canvas.getPixel),
    toggleDocs: wrapPromise(canvas.toggleDocs),
    isDarkMode: wrapPromise(theme.isDarkMode)
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
            if (event.data.type == "registerCommand") {
                thisScope.registerWorkerCommand(event.data.command);
            }

            if (event.data.type == "call") {
                ((apiCommands[event.data.command] || (() => Promise.reject("Unknown command")))(...event.data.args) || Promise.resolve()).then(function(data) {
                    thisScope.worker.postMessage({
                        type: "reply",
                        id: event.data.id,
                        status: "resolve",
                        data
                    });
                }).catch(function() {
                    thisScope.worker.postMessage({
                        type: "reply",
                        id: event.data.id,
                        status: "reject",
                        data
                    });
                });
            }
        });
    }

    unload() {
        this.worker.terminate();
    }

    registerWorkerCommand(command) {
        var thisScope = this;

        this.commands[command] = function() {
            thisScope.worker.postMessage({
                type: "commandExecution",
                command,
                args: [...arguments].map((argument) => argument.value || null)
            });
        };
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

export function hasLoaded(extensionName) {
    extensionName = extensionName.toLowerCase();

    return loaded[extensionName] instanceof Extension;
}

export function load(url, givenName = null) {
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        url = `extensions/${url}.attox.js`;
    }

    var extensionName = (givenName || url.match(/([a-z_][a-z0-9_]*)\.attox\.js$/)[1] || "ext").toLowerCase();

    if (hasLoaded(extensionName)) {
        return Promise.resolve(false);
    }

    return init().then(function() {
        return fetch(url);
    }).then(function(response) {
        if (response.status != 200) {
            return Promise.reject(response);
        }

        return response.text();
    }).then(function(data) {
        loaded[extensionName] = new Extension(data);

        return Promise.resolve(true);
    });
}

export function unload(extensionName) {
    extensionName = extensionName.toLowerCase();

    if (!hasLoaded(extensionName)) {
        return;
    }

    loaded[extensionName].unload();

    delete loaded[extensionName];
}

export function getCommand(commandName) {
    commandName = commandName.toLowerCase();

    return loaded[commandName.split(".")[0]]?.commands[commandName.split(".")[1]] || null;
}