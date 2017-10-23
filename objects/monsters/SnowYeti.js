var Monster = require('./Monster');
var util = require('util');

function SnowYeti(client, channel, locks, callback) {
    Monster.apply(this, arguments);
    this.locks = locks;
    this.client = client;
    this.channel = channel;
    this.name = "Snow Yeti";
    this.hp = 60;
    this.xp = 80;
    this.min_damage = 15;
    this.max_damage = 30;
    this.callbackFunction = callback;
}

SnowYeti.prototype.spawn = function () {
    this.client.say(this.channel, "A wild SNOW YETI has appeared!! IT HAS " + this.hp + " HP!");
    this.client.say(this.channel, "CurseLit CurseLit TYPE .. IN CHAT NOW TO ATTACK CurseLit CurseLit");
};

SnowYeti.prototype.punish = function () {
    this.client.say(this.channel, "You failed to kill the SNOW YETI! The exhaust will now be locked off for 15 minutes!");
    this.locks['exhaust'] = new Date();
    return this.locks;
};

SnowYeti.prototype.finish = function (settings) {
    this.callbackFunction(settings, 'exhaust', false);
};

util.inherits(SnowYeti, Monster);

module.exports = SnowYeti;