var Potion = require('../objects/items/Potion');

function ItemUtils() {

}

ItemUtils.prototype.usePlayerItemByType = function (redis, player, type) {
    item = this.getItemByType(this.getItemNameFromCommand(type));
    if (item != null) {
        item.use(redis, player);
        return this.removeItemFromPlayerByType(redis, this.getItemNameFromCommand(type), player);
    }
    return false;
};

ItemUtils.prototype.removeItemFromPlayerByType = function (redis, type, player) {
    var items = player.getItems();
    for (var i = 0; i < items.length; i++) {
        if (items[i].name === type) {
            items.splice(i, 1);
            player.setItems(items);
            player.update(redis);
            return true;
        }
    }
    return false;
};

ItemUtils.prototype.getItemByType = function (type) {
    switch (type) {
        case 'Potion':
            return new Potion();
    }
    return null;
};

ItemUtils.prototype.getItemCounts = function(items) {
  var item_counts = {};
  for (var i = 0; i < items.length; i++) {
      var item = this.getItemByType(items[i].name);
      if (!(item.getName() in item_counts)) {
          item_counts[item.getName()] = 1;
          continue;
      }
      item_counts[item.getName()]++;
  }
  return item_counts;
};

ItemUtils.prototype.getItemNameFromCommand = function (command) {
    // TODO: Just use lower case everywhere...
    switch (command) {
        case ('Potion'):
        case ('potion'):
            return 'Potion';
    }
    return null;
};

module.exports = ItemUtils;