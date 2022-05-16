attoX.onReady(function() {
    var broadcastId = null;

    attoX.registerCommand("host", function() {
        return attoX.hostBroadcast().then(function(ids) {
            broadcastId = ids.broadcastId;

            attoX.setArgValue(0, ids.channelId);

            return Promise.resolve();
        });
    });

    attoX.registerCommand("join", function(channel) {
        return attoX.joinBroadcast(channel).then(function(ids) {
            broadcastId = ids.broadcastId;

            return Promise.resolve();
        });
    });

    attoX.registerCommand("send", function(data) {
        return attoX.broadcastSend(broadcastId, data);
    });

    attoX.registerCommand("receive", function() {
        return attoX.broadcastRead(broadcastId).then(function(data) {
            attoX.setArgValue(0, data?.data || null);
            attoX.setArgValue(1, data?.timestamp || null);
            attoX.setArgValue(2, data?.isHost || null);

            return Promise.resolve();
        });
    });

    attoX.ready();
});