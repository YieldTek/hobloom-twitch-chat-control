var BASE_XP = 10;

function PlayerLevelUtils() {
}

PlayerLevelUtils.prototype.getXpToLevel = function (level) {
    var xp = BASE_XP;
    var last_xp = xp;
    var multipier = 1.6;
    for (var x = 2; x <= level; x++) {
        if (x % 3 == 0 && multipier >= 0.1) {
            multipier -= 0.1;
        }
        xp += last_xp * multipier;
        last_xp = xp;
    }
    return Math.floor(xp);
}

module.exports = PlayerLevelUtils;