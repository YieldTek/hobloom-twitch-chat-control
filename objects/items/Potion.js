var util = require('util');
var Item = require('./../Item');

function Potion() {
    Item.apply(this, arguments);
    this.cost = 100;
    this.name = 'Potion';
    this.description = 'Heals player for 50 hp';
    this.max_in_inventory = 20;
}

Potion.prototype.use = function (redis, player) {
    player.heal(50);
    if (player.getHP() > player.getMaxHP()) {
        player.setHP(player.getMaxHP());
    }
    player.update(redis);
};

util.inherits(Potion, Item);

module.exports = Potion;