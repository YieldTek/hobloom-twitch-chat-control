var config = require('config');
var request = require('request');
var Promise = require("bluebird");

function Settings(min_humidity, max_humidity) {
    this.min_humidity = min_humidity;
    this.max_humidity = max_humidity;
}

Settings.prototype.isDevMode = function () {
    return config.get('dev_mode');
};

Settings.prototype.getBaseUnitIP = function () {
    return 'http://' + config.get('hobloom_ip') + ':' + config.get('hobloom_port');
};

Settings.prototype.getSettings = function () {
    return new Promise(function(resolve, reject) {
        if (config.get('dev_mode')) {
            this.max_humidity = 70;
            this.min_humidity = 60;
            return resolve(this);
        }
        request("http://" + config.get("hobloom_ip") + ":" + config.get("hobloom_port") + '/settings', function (error, response, body) {
            if (error) {
                reject(error);
            }
            var data = JSON.parse(body).data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].key == 'MAX_HUMIDITY') {
                    this.max_humidity = parseInt(data[i].value);
                }
                if (data[i].key == 'MIN_HUMIDITY') {
                    this.min_humidity = parseInt(data[i].value);
                }
            }
            resolve(this);
        });
    });
};

Settings.prototype.updateSettings = function () {
    if (config.get('dev_mode')) {
        return;
    }
    var params = {
        settings: [
            { key: 'MIN_HUMIDITY', value: this.min_humidity },
            { key: 'MAX_HUMIDITY', value: this.max_humidity }
        ]
    };

    request({ url: "http://" + config.get("hobloom_ip") + ":" + config.get("hobloom_port") + '/settings', method: 'PUT', json: params }, function (error, response, body) {
        if (error) {
            console.log(err);
        }
    });
};

Settings.prototype.raiseMaxHumidity = function () {
    if (this.max_humidity < 80) {
        this.max_humidity++;
        this.updateSettings();
    }
};

Settings.prototype.lowerMaximumHumidity = function () {
    if (this.max_humidity > 50) {
        this.max_humidity--;
        this.updateSettings();
    }
};

Settings.prototype.raiseMinHumidity = function () {
    if (this.min_humidity < 60) {
        this.min_humidity++;
        this.updateSettings();
    }
};

Settings.prototype.lowerMinHumidity = function () {
    if (this.min_humidity > 30) {
        this.min_humidity--;
        this.updateSettings();
    }
};

Settings.prototype.getTwitchChatClientConfig = function () {
    return {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.get("username"),
            password: config.get("password")
        },
        channels: [ config.get("channel") ]
    };
};

module.exports = Settings;