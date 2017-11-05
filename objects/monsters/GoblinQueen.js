var Monster = require('./Monster');
var util = require('util');

function GoblinQueen(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Goblin Queen";
    this.max_hp = 80 * multiplier;
    this.hp = this.max_hp;
    this.xp = 300;
    this.min_damage = 150;
    this.max_damage = 290;
    this.battle_begin_message = 'The Goblin Queen rides down on the back of a massive Wolf covered in gleaming metal armor with long fangs covered in blood from the goblin infested caves to the north!  She hold a six foot spear made from carved bone sharpened at the tip!';
}

util.inherits(GoblinQueen, Monster);

module.exports = GoblinQueen;