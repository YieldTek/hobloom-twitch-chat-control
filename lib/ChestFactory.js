var RNGUtils = require('./RNGUtils');
var Chest = require('../objects/Chest');

class ChestFactory {
    static spawnForVote () {
        if (RNGUtils.getRandom(1, 300) == 50) {
            return new Chest('Mythical', 2000, 5000);
        }
        if (RNGUtils.getRandom(1, 50) == 10) {
            return new Chest('Rare', 200, 1000);
        }
        if (RNGUtils.getRandom(1, 8) == 3) {
            return new Chest('Normal', 10, 100);
        }
        return null;
    }
}

module.exports = ChestFactory;