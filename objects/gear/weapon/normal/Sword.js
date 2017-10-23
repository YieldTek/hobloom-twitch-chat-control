var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function Sword() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 2;
    this.max_str = 4;
    this.min_dex = 1;
    this.max_dex = 3;
    this.min_bonus_hp = 2;
    this.max_bonus_hp = 15;
    this.min_level = 1;
    this.rarity = 'NORMAL';
    this.type = 'WEAPON';
    this.name = 'Sword';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    if (RNGUtils.getRandom(1, 4) == 2) {
        this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
    }
}

util.inherits(Sword, Gear);
module.exports = Sword;