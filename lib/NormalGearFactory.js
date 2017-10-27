var RNGUtils = require('./RNGUtils');

// Normal Weapons
var Dagger = require('../objects/gear/weapon/normal/Dagger');
var Sword = require('../objects/gear/weapon/normal/Sword');
var Spear = require('../objects/gear/weapon/normal/Spear');
var Axe = require('../objects/gear/weapon/normal/Axe');
var Bow = require('../objects/gear/weapon/normal/Bow');
var RustyHammer = require('../objects/gear/weapon/normal/RustyHammer');
var BrokenBottle = require('../objects/gear/weapon/normal/BrokenBottle');

// Rare Weapons
var Greatsword = require('../objects/gear/weapon/rare/Greatsword');
var ElvenBowOfFury = require('../objects/gear/weapon/rare/ElvenBowOfFury');
var Doomdagger = require('../objects/gear/weapon/rare/Doomdagger');

// Mythical Weapons
var DiabloClaw = require('../objects/gear/weapon/mythical/DiabloClaw');

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
                var rng = RNGUtils.getRandom(1, 35);
                if (rng == 2) {
                    return this.getSecondTierItem();
                }
                return this.getFirstTierItem();
            case 5:
            case 6:
            case 7:
                var rng = RNGUtils.getRandom(1, 10);
                if (rng == 2) {
                    return this.getSecondTierItem();
                }
                return this.getFirstTierItem();
            case 8:
            case 9:
                var rng = RNGUtils.getRandom(1, 30);
                if (rng == 20) {
                    return this.getThirdTierItem();
                }
                rng = RNGUtils.getRandom(1, 8);
                if (rng == 5) {
                    return this.getSecondTierItem();
                }
                return this.getFirstTierItem();
                break;
            case 10:
            case 11:
                var rng = RNGUtils.getRandom(1, 20);
                if (rng == 10) {
                    return this.getThirdTierItem();
                }
                rng = RNGUtils.getRandom(1, 5);
                if (rng == 2) {
                    return this.getSecondTierItem();
                }
                return this.getFirstTierItem();
                break;
            case 12:
            case 13:
                var rng = RNGUtils.getRandom(1, 10);
                if (rng == 2) {
                    return this.getThirdTierItem();
                }
                return this.getSecondTierItem();
                break;
            case 14:
                var rng = RNGUtils.getRandom(1, 8);
                if (rng == 3) {
                    return this.getThirdTierItem();
                }
                return this.getSecondTierItem();
                break;
            default:
                var rng = RNGUtils.getRandom(1, 5);
                if (rng == 1) {
                    return this.getThirdTierItem();
                }
                return this.getSecondTierItem();
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
            case 5:
                return new Bow();
            case 6:
                return new RustyHammer();
            case 7:
                return new BrokenBottle();
        }
    }

    static getSecondTierItem() {
        var rng = RNGUtils.getRandom(1, 3);
        switch(rng) {
            case 1:
                return new Greatsword();
            case 2:
                return new ElvenBowOfFury();
            case 3:
                return new Doomdagger();
        }
    }

    static getThirdTierItem() {
        //var rng = RNGUtils.getRandom(1, 3);
        var rng = 1;
        switch(rng) {
            case 1:
                return new DiabloClaw();
        }
    }
}

module.exports = NormalGearFactory;