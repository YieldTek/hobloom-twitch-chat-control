var Monster = require('./Monster');
var util = require('util');

function Troll(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Troll";
    this.max_hp = 200 * multiplier;
    this.hp = this.max_hp;
    this.xp = 500;
    this.min_damage = 150;
    this.max_damage = 350;
    this.battle_begin_message = 'A massive seven foot plus troll comes running into your village from the Forgotten Forest to the north west.  He is wielding a large wooden club that looks as if it has hit many a player in its time.';
}

util.inherits(Troll, Monster);

module.exports = Troll;