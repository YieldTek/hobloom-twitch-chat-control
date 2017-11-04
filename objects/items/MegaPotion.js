var util = require('util');
var Item = require('./../Item');

function MegaPotion() {
    Item.apply(this, arguments);
    this.cost = 400;
    this.name = 'Mega Potion';
    this.description = 'Heals player for 250 hp';
    this.max_in_inventory = 20;
}

MegaPotion.prototype.use = function (redis, player) {
    player.heal(250);
    if (player.getHP() > player.getMaxHP()) {
        player.setHP(player.getMaxHP());
    }
    player.update(redis);
};

util.inherits(MegaPotion, Item);

module.exports = MegaPotion;