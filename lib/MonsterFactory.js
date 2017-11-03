var RNGUtils = require('./RNGUtils');
var Goblin = require('./../objects/monsters/Goblin');
var GoblinThief = require('./../objects/monsters/GoblinThief');
var ShockGoblin = require('./../objects/monsters/ShockGoblin');
var ArcherGoblin = require('./../objects/monsters/ArcherGoblin');

class MonsterFactory {
    static getMonster (avg_fighter_level, num_fighters) {
        if (avg_fighter_level > 8) {
            // TODO: Golbin King and his two right hand goblins
        }
        if (avg_fighter_level > 6) {
            var rng = RNGUtils.getRandom(1, 2);
            switch(rng) {
                case 1:
                    return new ShockGoblin(num_fighters);
                case 2:
                    return new ArcherGoblin(num_fighters);
            }
        }
        if (avg_fighter_level > 2) {
            return new GoblinThief(num_fighters);
        }
        return new Goblin(num_fighters);
    }
}

module.exports = MonsterFactory;