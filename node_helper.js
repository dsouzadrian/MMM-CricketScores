const request = require('request');

var NodeHelper = require("node_helper");

String.prototype.hashCode = function() {
    var hash = 0
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
    },

    socketNotificationReceived: function(notifyID, payload) {
        if (notifyID == "INIT") {
            this.config = payload;
            console.log("[CKTSCORES] Initialized");
            this.callAPI(this.config, (notifyID, payload) => {
                //console.log("[CKTSCORES] Sending Socket Notification: ", notifyID);
                this.sendSocketNotification(notifyID, payload);
            })
            //console.log("[CKTSCORES] CallAPI Finished");
            
        } else if (notifyID == "UPDATE") {
            // Query immediately
            this.config = payload;
            console.log("[CKTSCORES] Updated");
            this.callAPI(this.config, (notifyID, payload) => {
                this.sendSocketNotification(notifyID, payload);
            })
        }
    },

    callAPI: function(cfg, callback) {
        //console.log("[CKTSCORES] DEBUG - CALLAPI - Begin()");
        
        const options = {
        method: 'GET',
        url: 'https://livescore6.p.rapidapi.com/matches/v2/list-live',
        qs: {Category: this.config.category},
        headers: {
            'x-rapidapi-host': 'livescore6.p.rapidapi.com',
            'x-rapidapi-key': this.config.apiKey,
            useQueryString: true
        }
        };

        request(options, function (error, response, body) {
            var data = null;
            if (error) {
                console.error("[CKTSCORES] API Error: ", error);
                return;
            }
            if(response.statusCode == 429)
            {
                console.error("[CKTSCORES] Exceeded monthly limit: " + response.statusMessage);
                callback('LIMIT_EXCEEDED', results);
            }
            else if (response.statusCode != 200) {
                console.error("[CKTSCORES] Request error: " + response.statusCode + " " + response.statusMessage);
                return;
            }
            data = JSON.parse(body);
            //console.log("Received data:" + JSON.stringify(data));
            var results = data.Stages;
            if (results.length == 0) {
                console.log("[CKTSCORES] Data Error: There is no available data");
                callback('NO_DATA', results);
            } else {
                console.log("[CKTSCORES] Sending result: " + results.length + " items");
                callback('UPDATE', results);
            }
        });

        
    },

    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ": ", (msg));
        }
    },
})
