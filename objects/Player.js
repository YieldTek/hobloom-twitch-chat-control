var RNGUtils = require('../lib/RNGUtils');

function Player(data) {
    this.username = data.username;
    this.hp = data.hp;
    this.max_hp = data.max_hp;
    this.xp = data.xp;
    this.level = data.level;
    this.max_level = 10;
    this.gold = data.gold;
    this.strength = data.strength;
    this.dexterity = data.dexterity;
    this.items = data.items;
    this.gear = data.gear;
    this.max_gear = 15;
    if (typeof data.equipped == 'undefined') {
        this.equipped = {
            'HEAD': null,
            'HANDS': null,
            'WEAPON': null,
            'FEET': null
        };
    } else {
        this.equipped = data.equipped;
    }
}

Player.prototype.getXpToLevel = function () {
    var old_xp = 100;
    for (var i = 1; i <= 50; i++) {
        if (i != 1) {
            old_xp += Math.floor(old_xp * 0.5);
        }
        if (i == this.level) {
            return old_xp;
        }
    }
};

Player.prototype.getHPUpdateForLevel = function () {
    return (this.getLevel() * 100);
};

Player.prototype.checkForCriticalHit = function () {
    // TODO(Sean): Rebalance Dexterity
    var max = 300;
    var min = this.getDexterity();
    if (min >= max) {
        return true;
    }
    if (this.getLevel() > 0 && this.getLevel() < 5) {
        max = 6;
    }
    if (this.getLevel() > 5 && this.getLevel() < 10) {
        max = 12;
    }
    if (this.getLevel() > 10 && this.getLevel() < 50) {
        max = 100;
    }
    if (this.getLevel() > 50 && this.getLevel() < 100) {
        max = 200;
    }
    if (this.getDexterity() >= 300) {
        min = 295;
    }
    return RNGUtils.getRandom(min, max) == max;
};

Player.prototype.addItem = function (item) {
    if (typeof this.items === 'undefined') {
        this.items = [];
    }
    this.items.push(item);
};

Player.prototype.getUsername = function () {
    return this.username;
};

Player.prototype.getXP = function () {
    return this.xp;
};

Player.prototype.setXP = function (xp) {
    this.xp = xp;
};

Player.prototype.getHP = function () {
    if (this.hp < 0) {
        this.hp = 0;
    }
    if (this.hp > this.getMaxHP()) {
        this.hp = this.getMaxHP();
    }
    return this.hp;
};

Player.prototype.setHP = function (hp) {
    this.hp = hp + this.getHPBoostFromGear();
};

Player.prototype.heal = function (hp) {
    this.hp += hp;
};

Player.prototype.takeDamage = function (damage) {
    this.hp -= damage;
};

Player.prototype.getBaseMaxHP = function () {
    return this.max_hp;
};

Player.prototype.getMaxHP = function () {
    return this.max_hp + this.getHPBoostFromGear();
};

Player.prototype.setMaxHP = function (hp) {
    this.max_hp = hp;
};

Player.prototype.getLevel = function () {
    return this.level;
};

Player.prototype.setLevel = function (level) {
    this.level = level;
};

Player.prototype.getBonusDamageFromGear = function () {
    var bonus = 0;
    if (this.equipped.WEAPON != null) {
        bonus += this.equipped.WEAPON.str;
    }
    return bonus;
};

Player.prototype.getDexBoostFromGear = function () {
    var bonus = 0;
    if (this.equipped.WEAPON != null) {
        bonus += this.equipped.WEAPON.dex;
    }
    return bonus;
};

Player.prototype.getHPBoostFromGear = function () {
    var bonus = 0;
    if (this.equipped.WEAPON != null) {
        bonus += this.equipped.WEAPON.hp_bonus;
    }
    return bonus;
};

Player.prototype.getDamage = function () {
    var did_crit = false;
    var damage = this.getStrength();
    if (this.checkForCriticalHit()) {
        did_crit = true;
        var bonus_multiplier = parseFloat(RNGUtils.getRandom(2, 4).toString() + '.' + RNGUtils.getRandom(0, 9).toString() + RNGUtils.getRandom(0, 9).toString());
        damage *= bonus_multiplier;
    }
    return {
        'damage': Math.floor(damage),
        'crit': did_crit
    };
};

Player.prototype.getGold = function () {
    return this.gold;
};

Player.prototype.setGold = function (gold) {
    this.gold = gold;
};

Player.prototype.getStrength = function () {
    return this.strength + this.getBonusDamageFromGear();
};

Player.prototype.getBaseStrength = function () {
    return this.strength;
};

Player.prototype.setStrength = function (strength) {
    this.strength = strength;
};

Player.prototype.getDexterity = function () {
    return this.dexterity + this.getDexBoostFromGear();
};

Player.prototype.getBaseDexterity = function () {
    return this.dexterity;
};

Player.prototype.setDexterity = function (dexterity) {
    this.dexterity = dexterity;
};

Player.prototype.getInfoMessage = function () {
    var xpToNextLevel = this.getXpToLevel(this.getLevel()) - this.getXP();
    return '@' + this.getUsername() + ', LEVEL-' + this.getLevel() + ' ItsBoshyTime HP-' + this.getHP() + '/' + this.getMaxHP() + ' ItsBoshyTime STR-' + this.getStrength() + ' ItsBoshyTime DEX-' + this.getDexterity() + ' ItsBoshyTime XP-' + this.getXP() + ' ItsBoshyTime GOLD-' + this.getGold() + ' ItsBoshyTime NEXT LVL XP-' + xpToNextLevel + ' ItsBoshyTime To see your items use the \'showitems\' command ItsBoshyTime';
};

Player.prototype.getItemsMessage = function (itemUtils) {
    var message = 'ItsBoshyTime ';
    var item_counts = itemUtils.getItemCounts(this.items);
    if (typeof this.items === 'undefined') {
        this.items = [];
    }
    if (!this.items.length) {
        return false;
    }
    for (var key in item_counts) {
        if (item_counts.hasOwnProperty(key)) {
            message += key + ' X ' + item_counts[key] + ' ItsBoshyTime ';
        }
    }
    return message;
};

Player.prototype.getGear = function () {
    return this.gear;
};

Player.prototype.getGearMessage = function () {
    var message = 'ItsBoshyTime ';
    if (typeof this.gear === 'undefined') {
        this.gear = [];
    }
    if (!this.gear.length) {
        return false;
    }
    for (var i = 0; i < this.gear.length; i++) {
        message += '#' + (i + 1) + " " + this.gear[i].name + "-" + this.gear[i].type + " (STR-" + this.gear[i].str + ") (DEX-" + this.gear[i].dex + ") (HP BONUS-" + this.gear[i].hp_bonus + ")" + ' ItsBoshyTime ';
    }
    return message;
};

Player.prototype.getItems = function () {
    return this.items;
};

Player.prototype.setItems = function (items) {
    this.items = items;
};

Player.prototype.addGear = function (gear) {
    if (typeof this.gear == 'undefined' || this.gear == null) {
        this.gear = [];
    }
    if (this.gear.length === this.max_gear) {
        return;
    }
    this.gear.push(gear);
};

Player.prototype.dropAllGear = function () {
    this.gear = [];
};

Player.prototype.getEquippedGearMessage = function () {
    var message = 'ItsBoshyTime ';
    message += 'WEAPON: ';
    if (typeof this.equipped['WEAPON'] != 'undefined' && this.equipped['WEAPON'] != null) {
        message += "[" + this.equipped['WEAPON'].name + " (STR-" + this.equipped['WEAPON'].str + ") (DEX-" + this.equipped['WEAPON'].dex + ") (HP BONUS-" + this.equipped['WEAPON'].hp_bonus + ")] ItsBoshyTime";
    } else {
        message += 'None ItsBoshyTime'
    }
    return message;
};

Player.prototype.equipGear = function (number) {
    var item = this.gear[number - 1];
    var oldItem = this.equipped[item.type];
    this.equipped[item.type] = item;
    this.hp += item.hp_bonus;
    if (oldItem == null) {
        this.gear.splice(number - 1, 1);
        return '@' + this.username + ', You have equipped ' + item.name;
    }
    this.handleGearEquipHPChange(oldItem);
    this.gear[number - 1] = oldItem;
    return '@' + this.username + ', You have replaced ' + oldItem.name + ' with ' + item.name;
};

Player.prototype.handleGearEquipHPChange = function (item) {
    if (item.hp_bonus == null) {
        return;
    }
    this.hp -= item.hp_bonus;
    if (this.hp <= 0) {
        this.hp = 1;
    }
};

Player.prototype.dropGear = function (number) {
    var item = this.gear[number - 1];
    this.gear.splice(number - 1, 1);
    return '@' + this.username + ', You have dropped ' + item.name;
};

Player.prototype.die = function () {
    this.hp = this.getMaxHP();
};

Player.prototype.updatePlayerXP = function (xp) {
    this.setXP(this.getXP() + xp);
    var xpToLevel = this.getXpToLevel() - this.getXP();
    while (xpToLevel <= 0) {
        this.setLevel(this.getLevel() + 1);
        this.setXP(xpToLevel * -1);
        this.setMaxHP(this.getHPUpdateForLevel());
        this.setHP(this.getMaxHP());

        this.setStrength(this.getBaseStrength() + 1);
        if (this.getLevel() % 2 == 0) {
            this.setDexterity(this.getBaseDexterity() + 1);
        }

        xpToLevel = this.getXpToLevel(this.getLevel()) - this.getXP();
    }
};

Player.prototype.toString = function () {
    return JSON.stringify(this);
};

Player.prototype.update = function (redis) {
    redis.set(this.getUsername(), this.toString());
};

module.exports = Player;