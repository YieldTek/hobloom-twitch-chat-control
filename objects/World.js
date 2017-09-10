function World() {
    this.monster = null;
}

World.prototype.setMonster = function (monster) {
    this.monster = monster;
};

World.prototype.getMonster = function () {
    return this.monster;
};

module.exports = World;