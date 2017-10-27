var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function Doomdagger() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 10;
    this.max_str = 25;
    this.min_dex = 4;
    this.max_dex = 12;
    this.min_bonus_hp = 100;
    this.max_bonus_hp = 300;
    this.min_level = 9;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Doomdagger';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(Doomdagger, Gear);
module.exports = Doomdagger;