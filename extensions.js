import * as syntax from "./syntax.js";
import * as basic from "./basic.js";
import * as term from "./term.js";
import * as hid from "./hid.js";
import * as canvas from "./canvas.js";
import * as theme from "./theme.js";

export var loaded = {};

var injectionCode = null;
var lastCommandArgs = [];
var lastCommandError = null;
var lastCommandFinished = false;

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
    _finishExecution: function(error) {
        lastCommandError = error;
        lastCommandFinished = true;
    },
    ready: wrapPromise(function() {
        basic.executeStatement();
    }),
    setArgValue: function(argIndex, argValue) {
        if (!(lastCommandArgs[argIndex] instanceof syntax.Expression)) {
            return Promise.resolve();
        }

        if (argValue == null || argValue == undefined || argValue == NaN) {
            argValue = 0;
        } else if (typeof(argValue) == "boolean") {
            argValue = argValue ? 1 : 0;
        }

        basic.setStore(lastCommandArgs[argIndex], argValue);

        return Promise.resolve();
    },
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
            lastCommandArgs = [...arguments];
            lastCommandError = null;
            lastCommandFinished = false;

            thisScope.worker.postMessage({
                type: "commandExecution",
                command,
                args: [...arguments].map((argument) => argument.value || null)
            });

            return new Promise(function(resolve, reject) {
                var interval = setInterval(function() {
                    if (lastCommandFinished) {
                        clearInterval(interval);

                        if (lastCommandError == null) {
                            basic.executeStatement();

                            resolve();
                        } else {
                            reject(lastCommandError);
                        }
                    }
                });
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

export function load(url, givenName = null, printLoad = false) {
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        url = `extensions/${url}.attox.js`;
    }

    var extensionName = (givenName || url.match(/([a-z_][a-z0-9_]*)\.attox\.js$/)[1] || "ext").toLowerCase();

    if (hasLoaded(extensionName)) {
        return Promise.resolve(false);
    }


    if (printLoad) {
        term.print(`Loading extension \`${extensionName}\`...\n`);
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

export function unload(extensionName, printUnload = false) {
    extensionName = extensionName.toLowerCase();

    if (!hasLoaded(extensionName)) {
        if (printUnload) {
            term.print(`Extension \`${extensionName}\` was not loaded\n`);
        }

        return;
    }

    loaded[extensionName].unload();

    delete loaded[extensionName];

    if (printUnload) {
        term.print(`Unloaded extension \`${extensionName}\`\n`);
    }
}

export function getCommand(commandName) {
    commandName = commandName.toLowerCase();

    return loaded[commandName.split(".")[0]]?.commands[commandName.split(".")[1]] || null;
}