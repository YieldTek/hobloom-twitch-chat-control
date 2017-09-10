function VoteUtils() {
    this.users_voted = [];
    this.current_votes = this.clearVoteCounts();
    this.round_started = new Date();
}

VoteUtils.prototype.tallyVotes = function () {
    var winners = [];
    var winning_num_votes = 0;

    for (key in this.current_votes) {
        if (this.current_votes[key] > winning_num_votes) {
            winning_num_votes = this.current_votes[key];
            winners = [];
            winners.push(key);
        } else if (this.current_votes[key] != 0 && this.current_votes[key] == winning_num_votes) {
            winners.push(key);
        }
    }
    return winners;
};

VoteUtils.prototype.getRoundStartedTime = function() {
    return this.round_started;
};

VoteUtils.prototype.clearUsersVoted = function () {
    this.users_voted = [];
};

VoteUtils.prototype.addUserVote = function (username, vote) {
  this.users_voted.push(username);
  this.current_votes[vote]++;
};

VoteUtils.prototype.hasUserVoted = function (username) {
  return this.users_voted.includes(username);
};

VoteUtils.prototype.clearVoteCounts = function () {
    return {
        'raisemaxh': 0,
        'raiseminh': 0,
        'lowerminh': 0,
        'lowermaxh': 0,
        'turnofflights': 0,
        'turnonlights': 0,
        'turnofffan': 0,
        'turnonfan': 0,
        'turnonexhaust': 0,
        'turnoffexhaust': 0
    };
};

VoteUtils.prototype.clear = function () {
    this.current_votes = this.clearVoteCounts();
    this.clearUsersVoted();
    this.round_started = new Date();
};

module.exports = VoteUtils;