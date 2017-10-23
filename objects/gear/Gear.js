function Gear(data) {
    this.str = 0;
    this.dex = 0;
    this.hp_bonus = 0;
    this.value = 0;
    this.min_str = 0;
    this.max_str = 0;
    this.min_dex = 0;
    this.max_dex = 0;
    this.min_bonus_hp = 0;
    this.max_bonus_hp = 0;
    this.min_level = 0;
    this.rarity = null;
    this.type = null;
    this.name = null;
}

Gear.prototype.getType = function () {
    return this.type;
};

Gear.prototype.getName = function () {
    return this.name;
};

Gear.prototype.getStrength = function () {
    return this.str;
};

Gear.prototype.getDexterity = function () {
    return this.dex;
};

Gear.prototype.getHPBonus = function () {
    return this.hp_bonus;
};

module.exports = Gear;