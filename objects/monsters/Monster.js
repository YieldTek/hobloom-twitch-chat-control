var RNGUtils = require('../../lib/RNGUtils');

function Monster(multiplier) {
    this.name = '';
    this.hp = null;
    this.max_hp = null;
    this.xp = null;
    this.min_damage = null;
    this.max_damage = null;
    this.battle_begin_message = '';
}

Monster.prototype.getName = function () {
    return this.name;
};

Monster.prototype.getMaxHP = function () {
    return this.max_hp;
};

Monster.prototype.getHP = function () {
    return this.hp;
};

Monster.prototype.setHP = function (hp) {
    this.hp = hp;
    if (this.hp < 0) {
        this.hp = 0;
    }
};

Monster.prototype.getXP = function () {
    return this.xp;
};

Monster.prototype.getMinDamage = function () {
    return this.min_damage;
};

Monster.prototype.getMaxDamage = function () {
    return this.max_damage;
};

Monster.prototype.getDamage = function () {
    return RNGUtils.getRandom(this.min_damage, this.max_damage);
};

Monster.prototype.getAttackStartMessage = function () {
    return this.battle_begin_message;
}

module.exports = Monster;