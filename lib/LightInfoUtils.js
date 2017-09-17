var DateDiff = require('date-diff');

function LightInfoUtils() {
    this.last_change_time = null;
    this.lights_on = null;
}

LightInfoUtils.prototype.getLightsOn = function () {
    return this.lights_on;
}

LightInfoUtils.prototype.hasStatusChanged = function (lights_on) {
    return lights_on != this.lights_on;
};

LightInfoUtils.prototype.updateLightStatus = function (lights_on) {
    this.lights_on = lights_on;
    this.last_change_time = new Date();
};

LightInfoUtils.prototype.printLightInfo = function(channel ,client) {
    var lightTimeInfo = this.getLightTimeDiffInfo(new DateDiff(new Date(), this.last_change_time));
    client.say(channel, 'The lights are currently ' + this.getLightsOnPretty() + ' and they have been ' + this.getLightsOnPretty() + ' for ' + lightTimeInfo.hours + ' hours ' + lightTimeInfo.minutes + ' minutes and ' + lightTimeInfo.seconds + ' seconds');

};

LightInfoUtils.prototype.getLightsOnPretty = function () {
    if (this.lights_on) {
        return 'on';
    }
    return 'off';
};

LightInfoUtils.prototype.getLightTimeDiffInfo = function (diff) {
    var hours = 0;
    if (diff.hours() >= 0) {
        hours = Math.floor(diff.hours());
    }
    var minutes = 0;
    if (diff.minutes() >= 0) {
        minutes = Math.floor(diff.minutes());
        if (hours > 0) {
            minutes -= (hours * 60);
        }
    }
    var seconds = 0;
    if (diff.seconds() >= 0) {
        seconds = Math.floor(diff.seconds());
        if (minutes > 0) {
            seconds -= (minutes * 60);
        }
    }

    return {
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
};

module.exports = LightInfoUtils;