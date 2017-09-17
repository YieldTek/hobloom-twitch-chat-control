function StateUtils() {
    this.possible_states = [ 'VOTING_OPEN', 'FIGHTING_MONSTER', 'COUNTING_VOTES' ];
    this.current_state = this.possible_states[0];
}

StateUtils.prototype.getCurrentState = function () {
    return this.current_state;
};

StateUtils.prototype.setCurrentState = function (state) {
    this.current_state = state;
};

StateUtils.prototype.isStateValid = function (state) {
    for (var i = 0; i < this.possible_states.length; i++) {
        if (this.possible_states[i] === state) {
            return true;
        }
    }
    return false;
};

StateUtils.prototype.isVotingOpenState = function () {
    return this.current_state === 'VOTING_OPEN';
};

StateUtils.prototype.setStateOpenVoting = function () {
    this.current_state = 'VOTING_OPEN';
};

StateUtils.prototype.isFightingMonsterState = function () {
    return this.current_state === 'FIGHTING_MONSTER';
};

StateUtils.prototype.setStateUnderAttack = function () {
    this.current_state = 'FIGHTING_MONSTER';
};

StateUtils.prototype.isCountingVotesState = function () {
    return this.current_state === 'COUNTING_VOTES';
};

StateUtils.prototype.setCountingVotes = function () {
    this.current_state = 'COUNTING_VOTES';
};



module.exports = StateUtils;