(function() {
    var messageQueue = {};
    var readyCallbacks = [];
    var commandCallbacks = {};

    self.attoX = {
        onReady: function(callback) {
            readyCallbacks.push(callback);
        }
    };

    function _call(command, ...args) {
        return new Promise(function(resolve, reject) {
            var id = Math.random();

            self.postMessage({
                type: "call",
                id,
                command,
                args: args.map(function(arg) {
                    try {
                        return JSON.parse(JSON.stringify(arg));
                    } catch (e) {
                        return undefined;
                    }
                })
            });
    
            var interval = setInterval(function() {
                if (messageQueue[id]?.type == "reply") {
                    (messageQueue[id].status == "reject" ? reject : resolve)(messageQueue[id].data);

                    delete messageQueue[id];

                    clearInterval(interval);
                }
            });
        });
    }

    function onReady(callback) {
        callback();
    }

    function registerCommand(command, callback) {
        commandCallbacks[command] = callback;

        self.postMessage({
            type: "registerCommand",
            command
        });
    }

    self.addEventListener("message", function(event) {
        if (event.data.type == "commandExecution") {
            (commandCallbacks[event.data.command](...event.data.args) || Promise.resolve()).then(function() {
                _call("_finishExecution", null);
            }).catch(function(error) {
                _call("_finishExecution", error);
            });
        }

        if (event.data.type == "reply") {
            messageQueue[event.data.id] = event.data;
        }
    });

    return _call("_getApiCommandList").then(function(commandList) {
        var commands = {};

        commandList.forEach(function(command) {
            commands[command] = function() {
                return _call(command, ...arguments);
            };
        });

        return Promise.resolve({attoX: {_call, onReady, registerCommand, ...commands}, readyCallbacks});
    });
})().then(function({attoX, readyCallbacks}) {
    self.attoX = Object.freeze(attoX);

    readyCallbacks.forEach((callback) => callback());
})

// Start of extension code
