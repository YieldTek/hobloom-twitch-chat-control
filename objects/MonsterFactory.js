var Imp = require('./monsters/Imp');
var RNGUtils = require('../lib/RNGUtils');
var Goblin = require('./monsters/Goblin');
var Dragon = require('./monsters/Dragon');
var SnowYeti = require('./monsters/SnowYeti');
var Manticore = require('./monsters/Manticore');

function MonsterFactory() {
    this.rngUtils = new RNGUtils();
}

MonsterFactory.prototype.rollForMonster = function (client, channel, locks, num_previous_votes, callback) {
    var rng = this.rngUtils.getRandom(1, (50 * Math.ceil(num_previous_votes / 4)));
    if (rng == 25) {
        return new Dragon(client, channel, locks, callback);
    }

    rng = this.rngUtils.getRandom(1, (20 * Math.ceil(num_previous_votes / 4)));
    if (rng == 15) {
        return new SnowYeti(client, channel, locks, callback);
    }

    rng = this.rngUtils.getRandom(1, (12 * Math.ceil(num_previous_votes / 4)));
    if (rng == 7) {
        return new Imp(client, channel, locks, callback);
    }

    rng = this.rngUtils.getRandom(1, (8 * Math.ceil(num_previous_votes / 4)));
    if (rng == 5) {
        return new Manticore(client, channel, locks, callback);
    }

    rng = this.rngUtils.getRandom(1, (4 * Math.ceil(num_previous_votes / 4)));
    if (rng == 2) {
        return new Goblin(client, channel, locks, callback);
    }
    return null;
};

module.exports = MonsterFactory;