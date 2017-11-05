var Monster = require('./Monster');
var util = require('util');

function BlackBear(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Black Bear";
    this.max_hp = 300 * multiplier;
    this.hp = this.max_hp;
    this.xp = 1050;
    this.min_damage = 200;
    this.max_damage = 450;
    this.battle_begin_message = 'A massive six and a half foot Black Bear runs into your village from the Forgotten Forest to the north west.  It has long sharp claws at the end of each paw and instantly swipes at you as it steps into your farm!';
}

util.inherits(BlackBear, Monster);

module.exports = BlackBear;