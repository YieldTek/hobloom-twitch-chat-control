var Monster = require('./Monster');
var util = require('util');

function Dragon(client, channel, locks, callback) {
    Monster.apply(this, arguments);
    this.locks = locks;
    this.client = client;
    this.channel = channel;
    this.name = "Dragon";
    this.hp = 100;
    this.xp = 150;
    this.min_damage = 30;
    this.max_damage = 50;
    this.callbackFunction = callback;
}

Dragon.prototype.spawn = function () {
    this.client.say(this.channel, "A WILD DRAGON HAS APPEARED!! It has " + this.hp + " hp!");
    this.client.say(this.channel, "CurseLit CurseLit TYPE .. IN CHAT NOW TO ATTACK CurseLit CurseLit");
};

Dragon.prototype.punish = function () {
    this.client.say(this.channel, "You failed to kill the dragon! The lights will now be locked off for 15 minutes!");
    this.locks['lights'] = new Date();
    return this.locks;
};

Dragon.prototype.finish = function (settings) {
    this.callbackFunction(settings, 'light', false);
};

util.inherits(Dragon, Monster);

module.exports = Dragon;