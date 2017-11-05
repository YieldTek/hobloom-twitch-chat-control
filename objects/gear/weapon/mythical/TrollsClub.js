var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function TrollsClub() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 12;
    this.max_str = 15;
    this.min_dex = 5;
    this.max_dex = 6;
    this.min_bonus_hp = 100;
    this.max_bonus_hp = 300;
    this.min_level = 10;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Trolls Club';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(TrollsClub, Gear);
module.exports = TrollsClub;