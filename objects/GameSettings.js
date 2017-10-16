function GameSettings(settings) {
    this.gold_for_vote = settings.gold_for_vote;
    this.round_time_in_minutes = settings.round_time_in_minutes;
}

GameSettings.prototype.getGoldForVote = function () {
    return this.gold_for_vote;
};

GameSettings.prototype.getRoundTimeInMinutes = function () {
    return this.round_time_in_minutes;
};

module.exports = GameSettings;