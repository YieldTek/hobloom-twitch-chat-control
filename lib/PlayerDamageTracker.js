function PlayerDamageTracker() {
    this.players_needing_xp = [];
}

PlayerDamageTracker.prototype.addPlayer = function (player) {
    for (var i = 0; i < this.players_needing_xp.length; i++) {
        if (this.players_needing_xp[i].getUsername() == player.getUsername()) {
            this.players_needing_xp[i] = player;
            return;
        }
    }
    this.players_needing_xp.push(player);
};

PlayerDamageTracker.prototype.addXPForUsers = function (redis, xp) {
    for (var i = 0; i < this.players_needing_xp.length; i++) {
        this.players_needing_xp[i].setXP(this.players_needing_xp[i].getXP() + xp);
        var xpToLevel = this.players_needing_xp[i].getXpToLevel() - this.players_needing_xp[i].getXP();
        while (xpToLevel <= 0) {
            this.players_needing_xp[i].setLevel(this.players_needing_xp[i].getLevel() + 1);
            this.players_needing_xp[i].setXP(xpToLevel * -1);
            this.players_needing_xp[i].setMaxHP(this.players_needing_xp[i].getMaxHP() + this.players_needing_xp[i].getHPUpdateForLevel());
            this.players_needing_xp[i].setHP(this.players_needing_xp[i].getMaxHP());

            this.players_needing_xp[i].setStrength(this.players_needing_xp[i].getStrength() + 1);
            if (this.players_needing_xp[i].getLevel() % 2 == 0) {
                this.players_needing_xp[i].setDexterity(this.players_needing_xp[i].getDexterity() + 1);
            }

            xpToLevel = this.players_needing_xp[i].getXpToLevel(this.players_needing_xp[i].getLevel()) - this.players_needing_xp[i].getXP();
        }
        this.players_needing_xp[i].update(redis);
    }
};

PlayerDamageTracker.prototype.clearUsers = function () {
    this.players_needing_xp = [];
};

module.exports = PlayerDamageTracker;