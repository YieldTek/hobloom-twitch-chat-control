var RNGUtils = require('../lib/RNGUtils');

function Chest(min_gold, max_gold) {
    this.rngUtils = new RNGUtils();
    this.gold = this.rngUtils.getRandom(min_gold, max_gold)
}

Chest.prototype.getGold = function () {
    console.log('chest gold: ' + this.gold);
    return this.gold;
};

module.exports = Chest;