export var broadcasts = [];

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

    host() {
        var thisScope = this;

        this.isHost = true;
        thisScope.isConnected = true;

        return new Promise(function(resolve, reject) {
            thisScope.peer = new Peer(null, {debug: 2});

            thisScope.peer.on("open", function(id) {
                resolve(id);
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
    
    join(channelName) {
        var thisScope = this;

        this.isHost = false;
        
        return new Promise(function(resolve, reject) {
            thisScope.peer = new Peer();

            thisScope.peer.on("open", function() {
                thisScope.hostConnection = thisScope.peer.connect(`${channelName}`, {reliable: true});

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