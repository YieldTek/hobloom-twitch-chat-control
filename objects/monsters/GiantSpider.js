var Monster = require('./Monster');
var util = require('util');

function GiantSpider(multiplier) {
    Monster.apply(this, arguments);
    this.name = "Giant Spider";
    this.max_hp = 400 * multiplier;
    this.hp = this.max_hp;
    this.xp = 1900;
    this.min_damage = 300;
    this.max_damage = 600;
    this.battle_begin_message = 'A Giant Spider crawls into your village from the Forgotten Forest to the north west.  It stands fifteen feet tall with a massive span to match.  The spider is all black with a small red dot on its back, a large array of eyes and giant fangs protruding from the front of its mouth.  It looks hungry.';
}

util.inherits(GiantSpider, Monster);

module.exports = GiantSpider;