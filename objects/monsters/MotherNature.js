var Monster = require('./Monster');
var util = require('util');

function MotherNature(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Mother Nature";
    this.max_hp = 500 * multiplier;
    this.hp = this.max_hp;
    this.xp = 3000;
    this.min_damage = 450;
    this.max_damage = 550;
    this.battle_begin_message = 'Mother Nature hovers in the sky over your village angry about you slaying all of her creatures! She starts casting all sorts of nasty weather at your village.  The heavy rain and gusts of wind upwards of one hundred miles per hour start destroying your crops quick!';
}

util.inherits(MotherNature, Monster);

module.exports = MotherNature;