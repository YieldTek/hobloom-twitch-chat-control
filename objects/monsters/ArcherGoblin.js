var Monster = require('./Monster');
var util = require('util');

function ArcherGoblin(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Archer Goblin";
    this.max_hp = 36 * multiplier;
    this.hp = this.max_hp;
    this.xp = 150;
    this.min_damage = 90;
    this.max_damage = 160;
}

util.inherits(ArcherGoblin, Monster);

module.exports = ArcherGoblin;