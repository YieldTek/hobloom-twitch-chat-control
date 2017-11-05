function GameSettings(settings) {
    this.rounds_repeat_sentance = settings.rounds_repeat_sentance;
    this.max_length_seconds_main_round = settings.max_length_seconds_main_round;
    this.loot_announce_delay_seconds = settings.loot_announce_delay_seconds;
    this.new_round_announce_delay_seconds = settings.new_round_announce_delay_seconds;
    this.announce_battle_delay_seconds = settings.announce_battle_delay_seconds;
    this.time_between_monster_attacks_seconds = settings.time_between_monster_attacks_seconds;
    this.announce_battle_loot_delay_seconds = settings.announce_battle_loot_delay_seconds;
    this.post_vote_delay_seconds = settings.post_vote_delay_seconds;
    this.time_between_vote_counts_minutes = settings.time_between_vote_counts_minutes;
    this.vote_cost = settings.vote_cost;
}

module.exports = GameSettings;