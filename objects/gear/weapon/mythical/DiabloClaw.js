var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function DiabloClaw() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 15;
    this.max_str = 25;
    this.min_dex = 8;
    this.max_dex = 16;
    this.min_bonus_hp = 200;
    this.max_bonus_hp = 500;
    this.min_level = 10;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Diablo\'s Claws';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(DiabloClaw, Gear);
module.exports = DiabloClaw;