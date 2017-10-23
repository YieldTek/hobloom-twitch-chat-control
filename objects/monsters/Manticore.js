var Monster = require('./Monster');
var util = require('util');

function Manitcore(client, channel, locks, callback) {
    Monster.apply(this, arguments);
    this.locks = locks;
    this.client = client;
    this.channel = channel;
    this.name = "Manticore";
    this.min_damage = 2;
    this.max_damage = 5;
    this.hp = 15;
    this.xp = 25;
    this.callbackFunction = callback;
}

Manitcore.prototype.spawn = function () {
    this.client.say(this.channel, "A WILD MANTICORE HAS APPEARED!! It has " + this.hp + " hp!");
    this.client.say(this.channel, "CurseLit CurseLit TYPE .. IN CHAT NOW TO ATTACK CurseLit CurseLit");
};

Manitcore.prototype.punish = function () {
    this.client.say(this.channel, "You failed to kill the Manticore! The lights will now be locked off for 15 minutes!");
    this.locks['lights'] = new Date();
    return this.locks;
};

Manitcore.prototype.finish = function (settings) {
    this.callbackFunction(settings, 'light', false);
}

util.inherits(Manitcore, Monster);

module.exports = Manitcore;