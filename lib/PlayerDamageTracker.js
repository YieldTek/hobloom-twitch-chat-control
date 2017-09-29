function PlayerDamageTracker() {
    this.players_needing_xp = [];
}

PlayerDamageTracker.prototype.addPlayer = function (player) {
    for (var i = 0; i < this.players_needing_xp.length; i++) {
        if (this.players_needing_xp[i].getUsername() == player.getUsername()) {
            return;
        }
    }
    this.players_needing_xp.push(player);
};

PlayerDamageTracker.prototype.addXPForUsers = function (redis, xp, playerUtils) {
    for (var i = 0; i < this.players_needing_xp.length; i++) {
        playerUtils.updatePlayerXP(redis, this.players_needing_xp[i], xp);
    }
};

PlayerDamageTracker.prototype.clearUsers = function () {
    this.players_needing_xp = [];
};

module.exports = PlayerDamageTracker;