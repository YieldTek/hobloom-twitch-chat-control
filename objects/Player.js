var RNGUtils = require('../lib/RNGUtils');
var PlayerLevelUtils = require('../lib/PlayerLevelUtils');

function Player(data) {
    this.username = data.username;
    this.xp = data.xp;
    this.level = data.level;
    this.gold = data.gold;
    this.strength = data.strength;
    this.dexterity = data.dexterity;
    this.rngUtils = new RNGUtils();
    this.playerLevelUtils = new PlayerLevelUtils();
}

Player.prototype.checkForCriticalHit = function () {
    var max = 300;
    var min = this.getDexterity();
    if (this.getLevel() > 0 && this.getLevel() < 5) {
        max = 6;
    }
    if (this.getLevel() > 5 && this.getLevel() < 10) {
        max = 12;
    }
    if (this.getLevel() > 10 && this.getLevel() < 50) {
        max = 100;
    }
    if (this.getLevel() > 50 && this.getLevel() < 100) {
        max = 200;
    }
    if (this.getDexterity() >= 300) {
        min = 295;
    }
    return this.rngUtils.getRandom(min, max) == max;
};

Player.prototype.getUsername = function () {
    return this.username;
};

Player.prototype.getXP = function () {
    return this.xp;
};

Player.prototype.setXP = function (xp) {
    this.xp = xp;
};

Player.prototype.getLevel = function () {
    return this.level;
};

Player.prototype.setLevel = function (level) {
    this.level = level;
};

Player.prototype.getDamage = function () {
    return this.strength;
};

Player.prototype.getGold = function () {
    return this.gold;
};

Player.prototype.setGold = function (gold) {
    this.gold = gold;
};

Player.prototype.getStrength = function () {
    return this.strength;
};

Player.prototype.setStrength = function (strength) {
    this.strength = strength;
};

Player.prototype.getDexterity = function () {
    return this.dexterity;
};

Player.prototype.setDexterity = function (dexterity) {
    this.dexterity = dexterity;
};

Player.prototype.printInfo = function (channel, client) {
    var xpToNextLevel = this.playerLevelUtils.getXpToLevel(this.getLevel()) - this.getXP();
    client.say(channel, '@' + this.getUsername() + ', you are level ' + this.getLevel() + ', your current strength is ' + this.getStrength() + ' and your dexterity is ' + this.getDexterity() + '. You have ' + this.getXP() + ' experience points and ' + this.getGold() + ' gold. To reach the level ' + (this.getLevel() + 1) + ' you will need ' + xpToNextLevel + ' more xp!');
};

Player.prototype.toString = function () {
    return JSON.stringify({
        'username': this.username,
        'xp': this.xp,
        'level': this.level,
        'gold': this.gold,
        'strength': this.strength,
        'dexterity': this.dexterity
    });
}

module.exports = Player;