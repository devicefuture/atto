attoX.onReady(function() {
    var broadcastId = null;

    attoX.registerCommand("host", function(channel) {
        return attoX.hostBroadcast(channel || null).then(function(ids) {
            broadcastId = ids.broadcastId;

            attoX.setArgValue(0, ids.channel);

            return Promise.resolve();
        }).catch(function(error) {
            console.error(error);

            return Promise.reject({message: {
                "broadcastingInvalidChannelName": "Invalid channel name",
                "broadcastingChannelExists": "Channel already exists"
            }[error.code] || "Could not host broadcast"});
        });
    });

    attoX.registerCommand("join", function(channel) {
        return attoX.joinBroadcast(channel).then(function(ids) {
            console.log(ids);
            broadcastId = ids.broadcastId;

            return Promise.resolve();
        }).catch(function(error) {
            console.error(error);

            if (error.message?.startsWith("Could not connect to peer")) {
                return Promise.reject({message: "Channel is no longer broadcasting"});
            }

            return Promise.reject({message: {
                "broadcastingInvalidChannelName": "Invalid channel name",
                "broadcastingChannelNotFotFound": "Unknown channel"
            }[error.code] || "Could not resolve channel"});
        });
    });

    attoX.registerCommand("send", function(data) {
        if (broadcastId == null) {
            return Promise.reject({message: "Not currently broadcasting"});
        }

        return attoX.broadcastSend(broadcastId, data);
    });

    attoX.registerCommand("receive", function() {
        if (broadcastId == null) {
            return Promise.reject({message: "Not currently broadcasting"});
        }

        return attoX.broadcastRead(broadcastId).then(function(data) {
            attoX.setArgValue(0, data?.data || null);
            attoX.setArgValue(1, data?.timestamp || null);
            attoX.setArgValue(2, data?.isHost || null);

            return Promise.resolve();
        });
    });

    attoX.ready();
});