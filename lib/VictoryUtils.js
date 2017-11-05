var Chest = require('../objects/Chest');

class VictoryUtils {
    static getChestForWinner(position, player_level) {
        switch(position) {
            case 1:
                return new Chest('Mythical', 50, 100, player_level, 2, 3);
            case 2:
                return new Chest('Rare', 15, 50, player_level, 1, 2);
            case 3:
                return new Chest('Normal', 5, 15, player_level, 0, 1);
            default:
                return null;
        }
    }
}

module.exports = VictoryUtils;