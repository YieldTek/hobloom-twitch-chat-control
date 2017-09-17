var Player = require('../objects/Player');
var PlayerLevelUtils = require('../lib/PlayerLevelUtils');

function PlayerUtils() {
    this.playerLevelUtils = new PlayerLevelUtils();
}

PlayerUtils.prototype.getPlayer = function (con, username, callback) {
    this.getPlayerInfoFromDB(con, username, true, callback);
};

PlayerUtils.prototype.getPlayerInfoFromDB = function (con, username, addToCache, callback) {
    var player_username = username;
    con.get(username, function(err, reply) {
        if (reply == null) {
            var data = {
                'username': player_username,
                'xp': 0,
                'gold': 0,
                'level': 1,
                'strength': 1,
                'dexterity': 1
            };
            player = new Player(data);
            con.set(username, player.toString())
            callback(player);
            return;
        }
        player = new Player(JSON.parse(reply));
        callback(player);
    });
};

PlayerUtils.prototype.updatePlayerGold = function (redis, player, gold) {
    player.setGold(player.getGold() + gold);
    redis.set(player.getUsername(), player.toString());
};

PlayerUtils.prototype.updatePlayerXP = function (redis, player, xp) {
    player.setXP(player.getXP() + xp);
    var xpToLevel = this.playerLevelUtils.getXpToLevel(player.getLevel()) - player.getXP();
    while (xpToLevel <= 0) {
        player.setLevel(player.getLevel() + 1);
        player.setXP(xpToLevel * -1);

        player.setStrength(player.getStrength() + 1);
        if (player.getLevel() % 2 == 0) {
            player.setDexterity(player.getDexterity() + 1);
        }

        xpToLevel = this.playerLevelUtils.getXpToLevel(player.getLevel()) - player.getXP();
    }
    redis.set(player.getUsername(), player.toString());
};

module.exports = PlayerUtils;