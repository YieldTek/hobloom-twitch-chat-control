var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function ElvenBowOfFury() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 7;
    this.max_str = 8;
    this.min_dex = 5;
    this.max_dex = 7;
    this.min_bonus_hp = 100;
    this.max_bonus_hp = 200;
    this.min_level = 9;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Elven Bow Of Fury';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(ElvenBowOfFury, Gear);
module.exports = ElvenBowOfFury;