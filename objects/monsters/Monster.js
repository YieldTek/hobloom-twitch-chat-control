function Monster() {
    this.name = '';
    this.hp = 1;
    this.xp = 0;
    this.fight_start_time = new Date();
}

Monster.prototype.getName = function () {
    return this.name;
};

Monster.prototype.getHP = function () {
    return this.hp;
};

Monster.prototype.setHP = function (hp) {
    this.hp = hp;
};

Monster.prototype.punish = function () {
};

Monster.prototype.getXP = function () {
    return this.xp;
};

Monster.prototype.getFightStartTime = function () {
    return this.fight_start_time;
}

module.exports = Monster;