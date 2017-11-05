var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function Greatsword() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 5;
    this.max_str = 8;
    this.min_dex = 4;
    this.max_dex = 6;
    this.min_bonus_hp = 10;
    this.max_bonus_hp = 80;
    this.min_level = 7;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Elven Greatsword';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(Greatsword, Gear);
module.exports = Greatsword;