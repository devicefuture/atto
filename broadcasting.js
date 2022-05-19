export const DFWS_URL = "https://webservices.james-livesey.repl.co";
export const DFWS_PING_DELAY = 3_000;

export var broadcasts = [];

export function waitForDfws() {
    console.log("Pinging DFWS server...");

    return fetch(DFWS_URL).then(function(response) {
        if (response.status == 202) {
            console.log("DFWS server is waking; will retry soon");

            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                   waitForDfws().then(resolve).catch(reject); 
                }, DFWS_PING_DELAY);
            });
        }

        return response.json();
    }).then(function(data) {
        if (data?.status == "ok") {
            console.log("DFWS server is active");

            return Promise.resolve();
        }

        return Promise.reject(data);
    }).catch(function(error) {
        console.warn(error);

        // Might be CORS which is the issue; try pinging again until it works
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
               waitForDfws().then(resolve).catch(reject); 
            }, DFWS_PING_DELAY);
        });
    });
}

export function channelToId(channel) {
    return waitForDfws().then(function() {
        return fetch(`${DFWS_URL}/broadcasting/${encodeURI(channel)}`);
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data?.status == "ok") {
            return Promise.resolve(data?.id);
        }

        return Promise.reject(data);
    });
}

export function createChannel(channel, id) {
    return waitForDfws().then(function() {
        return fetch(`${DFWS_URL}/broadcasting/${encodeURI(channel)}?id=${encodeURIComponent(id)}`, {method: "POST"});
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data?.status == "ok") {
            return Promise.resolve();
        }

        return Promise.reject(data);
    });
}

export class Broadcast {
    constructor() {
        var thisScope = this;

        this.peer = null;
        this.isConnected = false;
        this.isHost = false;
        this.joinedConnections = [];
        this.hostConnection = null;
        this.dataCallbacks = [];
        this.dataBuffer = [];

        this.onData(function(data) {
            thisScope.dataBuffer.push(data);
        });

        broadcasts.push(this);
    }

    host(channelName = null) {
        var thisScope = this;

        this.isHost = true;
        thisScope.isConnected = true;

        if (channelName == null) {
            channelName = String(Math.round(Math.random() * 1e8)).padStart(8, "0");
        }

        return new Promise(function(resolve, reject) {
            thisScope.peer = new Peer(null, {debug: 2});

            thisScope.peer.on("open", function(id) {
                createChannel(channelName, id).then(function() {
                    resolve(channelName);
                }).catch(reject);
            });

            thisScope.peer.on("connection", function(connection) {
                console.log("New connection:", connection.peer);
    
                thisScope.joinedConnections.push(connection);
    
                connection.on("close", function() {
                    thisScope.joinedConnections = thisScope.joinedConnections.filter((connectionItem) => connectionItem == connection);
                });

                connection.on("data", function(data) {
                    thisScope.dataCallbacks.forEach((callback) => callback(data));
        
                    thisScope.joinedConnections.forEach(function(otherConnection) {
                        if (otherConnection == connection) {
                            return;
                        }
        
                        otherConnection.send({...data, fromHost: false});
                    });
                });
            });
  
            thisScope.peer.on("disconnected", function() {
                thisScope.isConnected = false;
                thisScope.isHost = false;
                thisScope.joinedConnections = [];
            });
        });
    }
    
    join(channel) {
        var thisScope = this;

        this.isHost = false;

        return channelToId(channel).then(function(id) {
            return new Promise(function(resolve, reject) {
                thisScope.peer = new Peer();
    
                thisScope.peer.on("open", function() {
                    thisScope.hostConnection = thisScope.peer.connect(id, {reliable: true});
    
                    thisScope.hostConnection.on("open", function() {
                        console.log("Opened connection:", thisScope.hostConnection.peer);
    
                        resolve();
                    });
    
                    thisScope.hostConnection.on("data", function(data) {
                        thisScope.dataCallbacks.forEach((callback) => callback(data));
                    });
    
                    thisScope.peer.on("error", function(error) {
                        reject(error);
                    });
    
                    thisScope.peer.on("disconnected", function() {
                        thisScope.isConnected = false;
                        thisScope.hostConnection = null;
                    });
    
                    thisScope.hostConnection.on("close", function() {
                        thisScope.isConnected = false;
                        thisScope.hostConnection = null;
                    });
                });
            });
        });
    }
    
    onData(callback) {
        this.dataCallbacks.push(callback);
    }
    
    sendData(data) {
        if (this.isHost) {
            this.joinedConnections.forEach((connection) => connection.send({
                data,
                isHost: true,
                timestamp: Date.now()
            }));
    
            return;
        }
    
        this.hostConnection?.send({
            data,
            isHost: false,
            timestamp: Date.now()
        });
    }

    readBuffer() {
        return this.dataBuffer.shift() || null;
    }
}