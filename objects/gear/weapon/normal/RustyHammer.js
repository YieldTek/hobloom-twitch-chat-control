var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function RustyHammer() {
    Gear.apply(this, arguments);
    this.value = 10;
    this.min_str = 2;
    this.max_str = 5;
    this.min_dex = 0;
    this.max_dex = 5;
    this.min_bonus_hp = 10;
    this.max_bonus_hp = 50;
    this.min_level = 1;
    this.rarity = 'NORMAL';
    this.type = 'WEAPON';
    this.name = 'Rusty Hammer';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    if (RNGUtils.getRandom(1, 6) == 2) {
        this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
    }
}

util.inherits(RustyHammer, Gear);
module.exports = RustyHammer;