var Monster = require('./Monster');
var util = require('util');

function DireWolf(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Dire Wolf";
    this.max_hp = 220 * multiplier;
    this.hp = this.max_hp;
    this.xp = 600;
    this.min_damage = 100;
    this.max_damage = 200;
    this.battle_begin_message = 'A hundred plus pound white and gray, scruffy looking Dire Wolf strides down into your village from the Forgotten Forest to the north west.  The beast approaches your farm and quickly begins to growl and attack!';
}

util.inherits(DireWolf, Monster);

module.exports = DireWolf;