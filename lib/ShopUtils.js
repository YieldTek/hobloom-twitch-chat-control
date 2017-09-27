var Potion = require('./../objects/items/Potion');

function ShopUtils() {
    this.items_for_sale = [
      new Potion()
    ];
}

ShopUtils.prototype.printShopHelp = function (channel, client) {
    client.say(channel, 'ItsBoshyTime shop list = Show all items.  displays item name, price and a brief item description ItsBoshyTime shop buy \<item name\> = Buy item from shop using item name ItsBoshyTime');
};

ShopUtils.prototype.printItemList = function (channel, client) {
    var message = 'ItsBoshyTime ';
    for (var i = 0; i < this.items_for_sale.length; i++) {
        message += this.items_for_sale[i].getName() + ' | ' + this.items_for_sale[i].getCost() + ' gold | ' + this.items_for_sale[i].getDescription() + ' ItsBoshyTime ';
    }
    client.say(channel, message);
};

module.exports = ShopUtils;