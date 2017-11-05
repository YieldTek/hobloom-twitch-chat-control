var Potion = require('../objects/items/Potion');
var MegaPotion = require('../objects/items/MegaPotion');

class ItemUtils {
    static usePlayerItemByType(redis, player, type) {
        var item = this.getItemByType(type);
        if (item != null) {
            item.use(redis, player);
            return this.removeItemFromPlayerByType(redis, type, player);
        }
        return false;
    }

    static removeItemFromPlayerByType(redis, type, player) {
        var items = player.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].name.toLowerCase() === type.toLowerCase()) {
                items.splice(i, 1);
                player.setItems(items);
                player.update(redis);
                return true;
            }
        }
        return false;
    }

    static getItemByType(type) {
        switch (type.toLowerCase()) {
            case 'potion':
                return new Potion();
            case 'mega potion':
                return new MegaPotion();
        }
        return null;
    }

    static getItemCounts(items) {
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
    }
}

module.exports = ItemUtils;