var Monster = require('./Monster');
var util = require('util');

function GoblinKing(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Goblin King";
    this.max_hp = 100 * multiplier;
    this.hp = this.max_hp;
    this.xp = 350;
    this.min_damage = 175;
    this.max_damage = 250;
    this.battle_begin_message = 'The Goblin King stomps his way down to your village from the goblin infested caves to the north shaking the earth with each step!';
}

util.inherits(GoblinKing, Monster);

module.exports = GoblinKing;