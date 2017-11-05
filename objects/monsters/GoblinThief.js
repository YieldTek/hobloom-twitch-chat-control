var Monster = require('./Monster');
var util = require('util');

function GoblinThief(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Goblin Thief";
    this.max_hp = 25 * multiplier;
    this.hp = this.max_hp;
    this.xp = 100;
    this.min_damage = 25;
    this.max_damage = 75;
    this.battle_begin_message = 'A Goblin Thief runs into your village from the goblin infested caves north of your village!';
}

util.inherits(GoblinThief, Monster);

module.exports = GoblinThief;