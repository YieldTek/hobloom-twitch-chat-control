var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function Bow() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 0;
    this.max_str = 3;
    this.min_dex = 3;
    this.max_dex = 5;
    this.min_bonus_hp = 20;
    this.max_bonus_hp = 50;
    this.min_level = 1;
    this.rarity = 'NORMAL';
    this.type = 'WEAPON';
    this.name = 'Bow';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(Bow, Gear);
module.exports = Bow;