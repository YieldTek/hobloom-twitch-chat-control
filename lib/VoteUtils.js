var ApplianceUtils = require('./ApplianceUtils');

function VoteUtils() {
    this.current_votes = this.clearVoteCounts();
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

VoteUtils.prototype.addUserVote = function (username, vote) {
  this.current_votes[vote]++;
};

VoteUtils.prototype.clearVoteCounts = function () {
    return {
        'turnofffan': 0,
        'turnonfan': 0,
        'turnonexhaust': 0,
        'turnoffexhaust': 0
    };
};

VoteUtils.prototype.handleWinner = function (command, settings) {
    switch (command) {
        case 'turnonfan':
            ApplianceUtils.changeAppliancePower(settings, 'intake', true);
            return 'The winning command is turn on fan! The circulating fan will now be turning on and the icon on the dashboard will turn blue.';
        case 'turnofffan':
            ApplianceUtils.changeAppliancePower(settings, 'intake', false);
            return 'The winning command is turn off fan! The circulating fan will now be turning off and the icon on the dashboard will turn red.';
        case 'turnonexhaust':
            ApplianceUtils.changeAppliancePower(settings, 'exhaust', true);
            return 'The winning command is turn on exhaust fan! The exhaust fan will now be turning on and the icon on the dashboard will turn blue.';
        case 'turnoffexhaust':
            ApplianceUtils.changeAppliancePower(settings, 'exhaust', false);
            return 'The winning command is turn off exhaust fan! The exhaust fan will now be turning off and the icon off the dashboard will turn red.';
        default:
            return '';
    }
};

VoteUtils.prototype.clear = function () {
    this.current_votes = this.clearVoteCounts();
};

module.exports = VoteUtils;