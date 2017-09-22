var Monster = require('./Monster');
var util = require('util');

function Goblin(client, channel, locks, callback) {
    Monster.apply(this, arguments);
    this.locks = locks;
    this.client = client;
    this.channel = channel;
    this.name = "Goblin";
    this.hp = 5;
    this.xp = 10;
    this.callbackFunction = callback;
}

Goblin.prototype.spawn = function () {
    this.client.say(this.channel, "A WILD GOBLIN HAS APPEARED!! It has " + this.hp + " hp!");
    this.client.say(this.channel, "CurseLit CurseLit TYPE .. IN CHAT NOW TO ATTACK CurseLit CurseLit");
};

Goblin.prototype.punish = function () {
    this.client.say(this.channel, "You failed to kill the goblin! The circulating fan will now be locked off for 15 minutes!");
    this.locks['intake'] = new Date();
    return this.locks;
};

Goblin.prototype.finish = function () {
    this.callbackFunction('intake', false);
}

util.inherits(Goblin, Monster);

module.exports = Goblin;