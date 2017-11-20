var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function BrokenBottle() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 4;
    this.max_str = 5;
    this.min_dex = 0;
    this.max_dex = 3;
    this.min_bonus_hp = 0;
    this.max_bonus_hp = 10;
    this.min_level = 1;
    this.rarity = 'NORMAL';
    this.type = 'WEAPON';
    this.name = 'Broken Bottle';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    if (RNGUtils.getRandom(1, 4) == 2) {
        this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
    }
}

util.inherits(BrokenBottle, Gear);
module.exports = BrokenBottle;