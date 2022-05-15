(function() {
    var messageQueue = {};
    var readyCallbacks = [];

    self.attoX = {
        onReady: function(callback) {
            readyCallbacks.push(callback);
        }
    };

    function _call(command, args) {
        return new Promise(function(resolve, reject) {
            var id = Math.random();

            self.postMessage({
                mode: "call",
                id,
                command,
                args
            });
    
            var interval = setInterval(function() {
                if (messageQueue[id]?.mode == "reply") {
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

    self.addEventListener("message", function(event) {
        messageQueue[event.data.id] = event.data;
    });

    return _call("_getApiCommandList").then(function(commandList) {
        var commands = {};

        commandList.forEach(function(command) {
            commands[command] = function() {
                return _call(command, [...arguments]);
            };
        });

        return Promise.resolve({attoX: {_call, onReady, ...commands}, readyCallbacks});
    });
})().then(function({attoX, readyCallbacks}) {
    self.attoX = Object.freeze(attoX);

    readyCallbacks.forEach((callback) => callback());
})

// Start of extension code
