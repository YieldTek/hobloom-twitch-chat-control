var Goblin = require('./monsters/Goblin');
var Manticore = require('./monsters/Manticore');
var RNGUtils = require('../lib/RNGUtils');

function MonsterFactory() {
    this.rngUtils = new RNGUtils();
}

MonsterFactory.prototype.rollForMonster = function (client, channel, locks, num_previous_votes, callback) {
    //var rng = Math.floor(Math.random() * (10 * Math.ceil(num_previous_votes / 4))) + 1;
    var rng = this.rngUtils.getRandom(1, (8 * Math.ceil(num_previous_votes / 4)));
    if (rng == 7) {
        return new Manticore(client, channel, locks, callback);
    }

    //rng = Math.floor(Math.random() * (5 * Math.ceil(num_previous_votes / 4))) + 1;
    var rng = this.rngUtils.getRandom(1, (4 * Math.ceil(num_previous_votes / 4)));
    if (rng == 2) {
        return new Goblin(client, channel, locks, callback);
    }
    return null;
};

module.exports = MonsterFactory;