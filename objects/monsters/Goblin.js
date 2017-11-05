var Monster = require('./Monster');
var util = require('util');

function Goblin(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Goblin";
    this.max_hp = 3 * multiplier;
    this.hp = this.max_hp;
    this.xp = 100;
    this.min_damage = 1;
    this.max_damage = 10;
    this.battle_begin_message = 'A Goblin runs into your village from the goblin infested caves north of your village!';
}

util.inherits(Goblin, Monster);

module.exports = Goblin;