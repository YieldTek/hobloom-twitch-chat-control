var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function Dagger() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 1;
    this.max_str = 3;
    this.min_dex = 0;
    this.max_dex = 2;
    this.min_bonus_hp = 5;
    this.max_bonus_hp = 20;
    this.min_level = 1;
    this.rarity = 'NORMAL';
    this.type = 'WEAPON';
    this.name = 'Dagger';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    if (RNGUtils.getRandom(1, 4) == 3) {
        this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
    }
}

util.inherits(Dagger, Gear);
module.exports = Dagger;