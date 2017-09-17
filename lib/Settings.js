function Settings() {
    this.battle_time_in_seconds = 20;
}

Settings.protot.getBattleTimeInSeconds = function () {
    return this.battle_time_in_seconds;
}

module.exports = Settings;