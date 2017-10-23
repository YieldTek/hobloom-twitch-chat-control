var Potion = require('./../objects/items/Potion');

var items_for_sale = [
    new Potion()
];

class ShopUtils {
    static getHelpMessage () {
        return 'ItsBoshyTime shop list = Show all items.  displays item name, price and a brief item description ItsBoshyTime shop buy \<item name\> = Buy item from shop using item name ItsBoshyTime';
    }

    static getItemListMessage() {
        var message = 'ItsBoshyTime ';
        for (var i = 0; i < items_for_sale.length; i++) {
            message += items_for_sale[i].getName() + ' | ' + items_for_sale[i].getCost() + ' gold | ' + items_for_sale[i].getDescription() + ' ItsBoshyTime ';
        }
        return message;
    }
}

module.exports = ShopUtils;