function Item() {
    this.name = '';
    this.description = '';
    this.cost = 0;
    this.max_in_inventory = 1;
}

Item.prototype.getCost = function () {
    return this.cost;
};

Item.prototype.getName = function () {
    return this.name;
};

Item.prototype.getDescription = function () {
    return this.description;
};

Item.prototype.getMaxInInventor = function () {
    return this.max_in_inventory;
};

module.exports = Item;