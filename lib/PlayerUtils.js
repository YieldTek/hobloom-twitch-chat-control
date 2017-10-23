var Player = require('../objects/Player');

class PlayerUtils {
    static getPlayer (redis, username, callback) {
        this.getPlayerInfoFromDB(redis, username, callback);
    }

    static getPlayerInfoFromDB(redis, username, callback) {
        redis.get(username, function(err, reply) {
            if (reply == null) {
                return callback(PlayerUtils.getNewPlayerObject(username));
            }
            return callback(new Player(JSON.parse(reply)));
        });
    }

    static getNewPlayerObject(username) {
        return new Player({
            'username': username,
            'max_hp': 100,
            'hp': 100,
            'xp': 0,
            'gold': 0,
            'level': 1,
            'strength': 1,
            'dexterity': 1,
            'gear': [],
            'items': [],
            'equipped': {
                'HEAD': null,
                'HANDS': null,
                'WEAPON': null,
                'FEET': null
            }
        });
    }
}

module.exports = PlayerUtils;