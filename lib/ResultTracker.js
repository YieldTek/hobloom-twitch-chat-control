function ResultTracker() {
    this.winners = [];
    this.winner_levels = [];
}

ResultTracker.prototype.clearWinners = function () {
    this.winners = [];
    this.winner_levels = [];
};

ResultTracker.prototype.getWinners = function () {
    return this.winners;
};

ResultTracker.prototype.addWinner = function (player) {
    this.winners.push(player.username);
    this.winner_levels.push(player.level);
};

ResultTracker.prototype.isUserWinner = function (username) {
    return this.winners.indexOf(username) != -1;
};

ResultTracker.prototype.getAverageWinnerLevel = function () {
    return Math.floor((this.winner_levels.reduce(function(a, b) { return a + b; })) / this.winner_levels.length);
};

module.exports = ResultTracker;