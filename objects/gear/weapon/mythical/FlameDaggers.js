var util = require('util');
var Gear = require('../../Gear');
var RNGUtils = require('../../../../lib/RNGUtils');

function FlameDaggers() {
    Gear.apply(this, arguments);
    this.value = 20;
    this.min_str = 15;
    this.max_str = 18;
    this.min_dex = 20;
    this.max_dex = 30;
    this.min_bonus_hp = 450;
    this.max_bonus_hp = 800;
    this.min_level = 10;
    this.rarity = 'RARE';
    this.type = 'WEAPON';
    this.name = 'Flame Dagger\'s';

    this.str = RNGUtils.getRandom(this.min_str, this.max_str);
    this.dex = RNGUtils.getRandom(this.min_dex, this.max_dex);
    this.hp_bonus = RNGUtils.getRandom(this.min_bonus_hp, this.max_bonus_hp);
}

util.inherits(FlameDaggers, Gear);
module.exports = FlameDaggers;