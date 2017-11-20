var RNGUtils = require('../lib/RNGUtils');
var GearFactory = require('../lib/NormalGearFactory');

function Chest(type, min_gold, max_gold, player_level, min_gear, max_gear) {
    this.type = type;
    this.gold = RNGUtils.getRandom(min_gold, max_gold);
    this.gear = [];

    var num_gear_to_generate = RNGUtils.getRandom(min_gear, max_gear);
    for (var i = 0; i < num_gear_to_generate; i++) {
        this.gear.push(GearFactory.getItemForPlayer(player_level));
    }
}

Chest.prototype.getGold = function () {
    return this.gold;
};

Chest.prototype.getGear = function () {
    return this.gear;
};

Chest.prototype.getType = function () {
    return this.type;
};

Chest.prototype.getGearMessage = function () {
    if (!this.gear.length) {
        return false;
    }
    var message = 'bleedPurple The chest contains the following gear: ';
    for (var i = 0; i < this.gear.length; i++) {
        message += '#' + (i + 1) + " " + this.gear[i].name + "-" + this.gear[i].type + " (STR-" + this.gear[i].str + ") (DEX-" + this.gear[i].dex + ") (HP BONUS-" + this.gear[i].hp_bonus + ")" + ' ';
    }
    return message + ' bleedPurple';
};

module.exports = Chest;