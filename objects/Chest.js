var RNGUtils = require('../lib/RNGUtils');

function Chest(type, min_gold, max_gold) {
    this.rngUtils = new RNGUtils();
    this.type = type;
    this.gold = this.rngUtils.getRandom(min_gold, max_gold)
}

Chest.prototype.getGold = function () {
    return this.gold;
};

Chest.prototype.getType = function () {
    return this.type;
};

module.exports = Chest;