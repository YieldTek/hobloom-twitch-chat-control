var Monster = require('./Monster');
var util = require('util');

function Imp(client, channel, locks, callback) {
    Monster.apply(this, arguments);
    this.locks = locks;
    this.client = client;
    this.channel = channel;
    this.name = "Imp";
    this.hp = 25;
    this.xp = 50;
    this.min_damage = 10;
    this.max_damage = 20;
    this.callbackFunction = callback;
}

Imp.prototype.spawn = function () {
    this.client.say(this.channel, "A WILD IMP HAS APPEARED!! It has " + this.hp + " hp!");
    this.client.say(this.channel, "CurseLit CurseLit TYPE .. IN CHAT NOW TO ATTACK CurseLit CurseLit");
};

Imp.prototype.punish = function () {
    this.client.say(this.channel, "You failed to kill the Imp! The exhaust will now be locked off for 15 minutes!");
    this.locks['exhaust'] = new Date();
    return this.locks;
};

Imp.prototype.finish = function (settings) {
    this.callbackFunction(settings, 'exhaust', false);
};

util.inherits(Imp, Monster);

module.exports = Imp;