function StateUtils() {
    this.current_state = null;
    this.last_state_change = null;
}

StateUtils.prototype.getLastStateChange = function () {
    return this.last_state_change;
};

StateUtils.prototype.isGenerateNewSentenceState = function () {
    return this.current_state === 'GENERATE_SENTENCE';
};

StateUtils.prototype.setStateNewSentence = function () {
    this.current_state = 'GENERATE_SENTENCE';
    this.last_state_change = new Date();
};

StateUtils.prototype.isUsersTypingState = function () {
    return this.current_state === 'USERS_TYPING';
};

StateUtils.prototype.setStateUsersTyping = function () {
    this.current_state = 'USERS_TYPING';
    this.last_state_change = new Date();
};

StateUtils.prototype.isGiveWinnersLootState = function () {
    return this.current_state === 'GIVE_WINNERS_LOOT';
};

StateUtils.prototype.setStateGiveWinnersLoot = function () {
    this.current_state = 'GIVE_WINNERS_LOOT';
    this.last_state_change = new Date();
};

StateUtils.prototype.isAnnounceFirstLootState = function () {
    return this.current_state === 'ANNOUNCE_FIRST_LOOT';
};

StateUtils.prototype.setStateAnnounceFirstLoot = function () {
    this.current_state = 'ANNOUNCE_FIRST_LOOT';
    this.last_state_change = new Date();
};

StateUtils.prototype.isAnnounceSecondLootState = function () {
    return this.current_state === 'ANNOUNCE_SECOND_LOOT';
};

StateUtils.prototype.setStateAnnounceSecondLoot = function () {
    this.current_state = 'ANNOUNCE_SECOND_LOOT';
    this.last_state_change = new Date();
};

StateUtils.prototype.isAnnounceThirdLootState = function () {
    return this.current_state === 'ANNOUNCE_THIRD_LOOT';
};

StateUtils.prototype.setStateAnnounceThirdLoot = function () {
    this.current_state = 'ANNOUNCE_THIRD_LOOT';
    this.last_state_change = new Date();
};

StateUtils.prototype.isAnnounceNewRoundState = function () {
    return this.current_state === 'ANNOUNCE_NEW_ROUND';
};

StateUtils.prototype.setStateAnnounceNewRound = function () {
    this.current_state = 'ANNOUNCE_NEW_ROUND';
    this.last_state_change = new Date();
};

StateUtils.prototype.isAnnounceBattleState = function () {
    return this.current_state === 'ANNOUNCE_BATTLE';
};

StateUtils.prototype.setStateAnnounceBattle = function () {
    this.current_state = 'ANNOUNCE_BATTLE';
    this.last_state_change = new Date();
};

StateUtils.prototype.isGetBattleSentenceState = function () {
    return this.current_state === 'GET_BATTLE_SENTENCE';
};

StateUtils.prototype.setStateGetBattleSentence = function () {
    this.current_state = 'GET_BATTLE_SENTENCE';
    this.last_state_change = new Date();
};

StateUtils.prototype.isBattleState = function () {
    return this.current_state === 'BATTLE';
};

StateUtils.prototype.setStateBattle = function () {
    this.current_state = 'BATTLE';
    this.last_state_change = new Date();
};

StateUtils.prototype.isBattleLootAnnounceState = function () {
    return this.current_state === 'BATTLE_LOOT_ANNOUNCE';
};

StateUtils.prototype.setStateBattleLootAnnounce = function () {
    this.current_state = 'BATTLE_LOOT_ANNOUNCE';
    this.last_state_change = new Date();
};

StateUtils.prototype.isTallyVotesState = function () {
    return this.current_state === 'TALLY_VOTES';
};

StateUtils.prototype.setStateTallyVotes = function () {
    this.current_state = 'TALLY_VOTES';
    this.last_state_change = new Date();
};

module.exports = StateUtils;