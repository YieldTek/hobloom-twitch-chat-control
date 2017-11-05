var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function CthulhusBow() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 10;
    this.max_str = 18;
    this.min_dex = 12;
    this.max_dex = 15;
    this.min_bonus_hp = 350;
    this.max_bonus_hp = 500;
    this.min_level = 10;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Cthulhu\'s Bow';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(CthulhusBow, Gear);
module.exports = CthulhusBow;