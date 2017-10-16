var RNGUtils = require('./RNGUtils');
var Dagger = require('../objects/gear/weapon/normal/Dagger');
var Sword = require('../objects/gear/weapon/normal/Sword');
var Spear = require('../objects/gear/weapon/normal/Spear');
var Axe = require('../objects/gear/weapon/normal/Axe');

class NormalGearFactory {
    static getItemForPlayer (player_level) {
        var addToLevel = 0;
        if (RNGUtils.getRandom(50, 52) == 51) {
            addToLevel = RNGUtils.getRandom(0, 4);
        }
        player_level += addToLevel;
        if (player_level > 14) {
            player_level = 14;
        }
        switch (player_level) {
            case 1:
            case 2:
            case 3:
            case 4:
                return this.getFirstTierItem();
            case 5:
            case 6:
            case 7:
                var rng = RNGUtils.getRandom(1, 4);
                if (rng == 2) {
                    //return this.getSecondTierItem();
                }
                return this.getFirstTierItem();
            case 8:
            case 9:
                break;
            case 10:
            case 11:
                break;
            case 12:
            case 13:
                break;
            case 14:
                break;
        }
    }
    static getFirstTierItem() {
        var rng = RNGUtils.getRandom(1, 4);
        switch(rng) {
            case 1:
                return new Dagger();
            case 2:
                return new Sword();
            case 3:
                return new Spear();
            case 4:
                return new Axe();
        }
    }
}

module.exports = NormalGearFactory;