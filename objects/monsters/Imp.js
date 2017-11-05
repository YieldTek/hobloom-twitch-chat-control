var Monster = require('./Monster');
var util = require('util');

function Imp(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Imp";
    this.max_hp = 180 * multiplier;
    this.hp = this.max_hp;
    this.xp = 500;
    this.min_damage = 150;
    this.max_damage = 200;
    this.battle_begin_message = 'An Imp runs into your village from the Forgotten Forest to the north west.  It stands roughly four feet with and extra six inches coming from its pointed ears.  It has dark grey skin and large pointed claws on its hands and feet.  The Imp stares at you through its beady red eyes with a lust for blood!';
}

util.inherits(Imp, Monster);

module.exports = Imp;