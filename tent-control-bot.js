var tmi = require("tmi.js");
var redis = require('redis');
var config = require('config');
var DateDiff = require('date-diff');
var World = require('./objects/World');
var Chest = require('./objects/Chest');
var RNGUtils = require('./lib/RNGUtils');
var ShopUtils = require('./lib/ShopUtils');
var VoteUtils = require('./lib/VoteUtils');
var ItemUtils = require('./lib/ItemUtils');
var StateUtils = require('./lib/StateUtils');
var PlayerUtils = require('./lib/PlayerUtils');
var Potion = require('./objects/items/Potion');
var ChestFactory = require('./lib/ChestFactory');
var MonsterFactory = require('./lib/MonsterFactory');
var LightInfoUtils = require('./lib/LightInfoUtils');
var CommandHelpUtils = require('./lib/CommandHelpUtils');
var Settings = require('./lib/Settings');
var ApplianceUtils = require('./lib/ApplianceUtils');
var PlayerDamageTracker = require('./lib/PlayerDamageTracker');
var NormalGearFactory = require('./lib/NormalGearFactory');

var redis_client = redis.createClient();

var world = new World();
var playerUtils = new PlayerUtils();
var monsterFactory = new MonsterFactory();
var commandHelpUtils = new CommandHelpUtils();
var lightInfoUtils = new LightInfoUtils();
var voteUtils = new VoteUtils();
var stateUtils = new StateUtils();
var itemUtils = new ItemUtils();
var rngUtils = new RNGUtils();
var shopUtils = new ShopUtils();
var chestFactory = new ChestFactory();
var settings = new Settings(null, null);
var applianceUtils = new ApplianceUtils(settings);
var playerDamageTracker = new PlayerDamageTracker();
var normalGearFactory = new NormalGearFactory();

lightInfoUtils.updateLightStatus(true);

var num_voters_last_round = 1;

// TODO: Move to settings object
var GOLD_FOR_VOTE = 5;
var ROUND_TIME_MINUTES = 1;

var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: config.get("username"),
        password: config.get("password")
    },
    channels: [ config.get("channel") ]
};

var client = new tmi.client(options);

client.on("chat", function (channel, userstate, message, self) {
    if (self) return;

    var command = commandHelpUtils.extractCommandFromMessage(message.toLowerCase());
    if (commandHelpUtils.verifyCommand(command)) {
        if (stateUtils.isFightingMonsterState() && commandHelpUtils.isAttackCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var damage = player.getDamage();
                if (player.checkForCriticalHit()) {
                    var a = parseFloat(rngUtils.getRandom(2, 4).toString() + '.' + rngUtils.getRandom(0, 9).toString() + rngUtils.getRandom(0, 9).toString());
                    damage *= a;
                    damage = Math.floor(damage);
                    client.say(config.get('channel'), '@' + userstate.username + ', has landed a critical hit for ' + damage + ' damage!');
                }

                playerDamageTracker.addPlayer(player);

                world.getMonster().setHP(world.getMonster().getHP() - damage);
                if (world.getMonster().getHP() <= 0) {
                    playerDamageTracker.addXPForUsers(redis_client, world.getMonster().getXP(), playerUtils);
                    playerDamageTracker.clearUsers();
                    client.say(config.get('channel'), "The " + world.getMonster().getName() + " has been slain!");


                    var rng = rngUtils.getRandom(1, 3);
                    if (rng == 2) {
                        var item = normalGearFactory.getItemForPlayer(player.getLevel());
                        if (item != null) {
                            client.say(config.get('channel'), "@" + userstate.username + ' FOUND WEAPON: ' + item.getName() + " (STR-" + item.getStrength() + ") (DEX-" + item.getDexterity() + ") (HP BONUS-" + item.getHPBonus() + ")");
                            player.addGear(item);
                            player.update(redis_client);
                        }
                    }
                    world.setMonster(null);
                    stateUtils.setStateOpenVoting();
                    return;
                }
                client.say(config.get('channel'), '@' + userstate.username + " has hit the " + world.getMonster().getName() + ' FOR ' + damage + ' DAMAGE! The Monster has ' + world.getMonster().getHP() + ' HP REMAINING!');

                var damage = rngUtils.getRandom(world.getMonster().getMinDamage(), world.getMonster().getMaxDamage());
                player.setHP(player.getHP() - damage);
                var hp = player.getHP();
                if (hp < 0) {
                    hp = 0;
                }
                client.say(config.get('channel'), '@' + userstate.username + " the " + world.getMonster().getName() + " swings back and hits you for " + damage + ' damage! YOU HAVE ' + hp + ' HP REMAINING!');
                if (player.getHP() <= 0) {
                    player.setXP(0);
                    player.setHP(player.getMaxHP());
                    var goldToRemove = Math.ceil(player.getGold() * 0.20);
                    player.setGold(player.getGold() - goldToRemove);
                    client.say(config.get('channel'), '@' + userstate.username + " the " + world.getMonster().getName() + " HAS KILLED YOU! You will now lose all your XP and " + goldToRemove + " gold!!");
                }
                player.update(redis_client);

            });
            return;
        }

        if (commandHelpUtils.isShowEquippedCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                client.say(config.get('channel'), player.getEquippedGearMessage());
            });
            return;
        }

        if (commandHelpUtils.isEquipCommand(command)) {
            var itemNumber = commandHelpUtils.extractSubCommandFromMessage(message);
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                if (!isPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                    return client.say(config.get('channel'), '@' + userstate.username + " you have entered an invalid item number!");
                }
                player.equipGear(itemNumber, client, config.get('channel'));
                player.update(redis_client);
            });
            return;
        }

        if (commandHelpUtils.isDropCommand(command)) {
            var itemNumber = commandHelpUtils.extractSubCommandFromMessage(message);
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                if (!isPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                    return client.say(config.get('channel'), '@' + userstate.username + " you have entered an invalid item number!");
                }
                player.dropGear(itemNumber, client, config.get('channel'));
                player.update(redis_client);
            });
            return;
        }

        function isPositiveInteger(str) {
            var n = Math.floor(Number(str));
            return String(n) === str && n > 0;
        }

        if (commandHelpUtils.isHelpCommand(command)) {
            var subCommand = commandHelpUtils.extractSubCommandFromMessage(message);
            if (commandHelpUtils.isShopCommand(subCommand)) {
                return shopUtils.printShopHelp(config.get('channel'), client);
            }
            return commandHelpUtils.printHelpInfo(config.get('channel'), client);
        }

        if (commandHelpUtils.isPlayerInfoCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                player.printInfo(config.get('channel'), client);
            });
            return;
        }

        if (commandHelpUtils.isShowItemsCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var message = player.getItemsMessage(itemUtils);
                if (!message) {
                    return client.say(config.get('channel'), '@' + userstate.username + ", your don't have any items!");
                }
                client.say(config.get('channel'), '@' + userstate.username + ", your current items are as follows " + message);
            });
            return;
        }

        if (commandHelpUtils.isShowGearCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var message = player.getGearMessage(itemUtils);
                if (!message) {
                    return client.say(config.get('channel'), '@' + userstate.username + ", your don't have any gear!");
                }
                client.say(config.get('channel'), '@' + userstate.username + ", your current gear is as follows " + message);
            });
            return;
        }

        if (commandHelpUtils.isUseItemCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                if (itemUtils.usePlayerItemByType(redis_client, player, message.split(' ')[1])) {
                    client.say(config.get('channel'), '@' + userstate.username + " used a " + message.split(' ')[1]);
                    return;
                }
                client.say(config.get('channel'), '@' + userstate.username + ", you entered an invalid item.  It is either spelled wrong or you don't have that item in your inventory.");
            });
            return;
        }

        if (commandHelpUtils.isLightInfoCommand(command)) {
            lightInfoUtils.printLightInfo(config.get('channel'), client);
            return;
        }

        if (!stateUtils.isFightingMonsterState() && commandHelpUtils.isAttackCommand(command)) {
            return;
        }

        if (commandHelpUtils.isShopItemListCommand(message.toLowerCase())) {
            return shopUtils.printItemList(config.get('channel'), client);
        }

        if (commandHelpUtils.isShopBuyItemCommand(message.toLowerCase())) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var gold = player.getGold();
                var item = null;
                var say_message = '@' + userstate.username + ', you have entered an invalid item name';
                switch (message.split(' ')[2]) {
                    case ('Potion'):
                    case ('potion'):
                        item = new Potion();
                        break;
                }
                if (item == null) {
                    return client.say(config.get('channel'), say_message);
                }
                if (gold < item.getCost()) {
                    return client.say(config.get('channel'), '@' + userstate.username + ', you can afford this item.  Try again when you earn ' + (item.getCost() - gold) + ' more gold.');
                }
                var num_items = itemUtils.getItemCounts(player.getItems())[item.getName()];
                var max_items = item.getMaxInInventor();
                if (num_items >= max_items) {
                    return client.say(config.get('channel'), '@' + userstate.username + ', you already have the max ' + item.getName() + ' in your inventory!');
                }
                player.addItem(redis_client, item);
                player.setGold(gold - item.getCost());
                player.update(redis_client);
                client.say(config.get('channel'), '@' + userstate.username + ', you have purchased a ' + item.getName());
            });
        }

        if (stateUtils.isVotingOpenState()) {
            // TODO: Clean this up
            if ((commandHelpUtils.isShopCommand(command) && !commandHelpUtils.isShopItemListCommand(message.toLowerCase())) || commandHelpUtils.isShopBuyItemCommand(message.toLowerCase()) && commandHelpUtils.isShowItemsCommand(message.toLowerCase())) {
                return;
            }
            if (voteUtils.hasUserVoted(userstate.username)) {
                client.say(config.get('channel'), '@' + userstate.username + ', you have already voted this round. Each user only gets one vote per round!');
                return;
            }
            // TODO: Move this to settings and put in config
            GOLD_FOR_VOTE = 5;
            if (!commandHelpUtils.isHuntCommand(command)) {
                voteUtils.addUserVote(userstate.username, command);
                client.say(config.get("channel"), '@' + userstate.username + ', I have received your vote of ' + message + ' and awarded you ' + GOLD_FOR_VOTE + ' gold for it. Any other votes sent this round will be ignored!');
            } else {
                voteUtils.addUserWithoutVote(userstate.username);
                client.say(config.get("channel"), '@' + userstate.username + ', is going hunting. Best of luck in pulling back a monster! You have received 10 gold for going out hunting!');
                GOLD_FOR_VOTE = 10;
            }
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var gold_for_player = GOLD_FOR_VOTE;
                var chest_found = chestFactory.spawnForVote();
                if (chest_found != null) {
                    gold_for_player += chest_found.getGold();
                    client.say(config.get("channel"), '@' + userstate.username + ', YOU FOUND A ' + chest_found.getType() + ' CHEST!! IT CONTAINS ' + chest_found.getGold() + ' GOLD!!');
                }
                playerUtils.updatePlayerGold(redis_client, player, gold_for_player);

                var monsterFactoryReturn = monsterFactory.rollForMonster(client, config.get("channel"), applianceUtils.appliance_locks, num_voters_last_round, applianceUtils.changeAppliancePower);
                if (monsterFactoryReturn != null) {
                    stateUtils.setStateUnderAttack();
                    world.setMonster(monsterFactoryReturn);
                    client.say(config.get("channel"), 'SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc');
                    world.getMonster().spawn();
                }
            });
            return;
        }
        return;
    }
});

client.connect();
settings.getSettings()
.then(function (settings_update) {
    settings = new Settings(settings_update.min_humidity, settings_update.max_humidity);
    setInterval(mainLoop, 2000);
})
.catch(function (err) {
    console.log(err);
});

function announcePoll() {
    client.say(config.get("channel"), 'Kappa Kappa CHECK US OUT ON PATREON TO SUPPORT MORE OPEN SOURCE AUTOMATION SOFTWARE! http://patreon.com/hightek Kappa Kappa');
}

function mainLoop() {
    if (stateUtils.isFightingMonsterState()) {
        var time_in_fight = new DateDiff(new Date(), world.getMonster().getFightStartTime());
        if (time_in_fight.seconds() >= 15) {
            world.getMonster().punish();
            world.getMonster().finish(settings);
            stateUtils.setStateOpenVoting();
        }
        return;
    }

    if (stateUtils.isVotingOpenState()) {
        var time_in_round = new DateDiff(new Date(), voteUtils.getRoundStartedTime());
        if (time_in_round.minutes() >= ROUND_TIME_MINUTES) {
            stateUtils.setCountingVotes();
        }
        return;
    }

    if (stateUtils.isCountingVotesState()) {
        client.say(config.get('channel'), 'The current round has ended and all votes have been locked in! I will now tally up the votes and announce a winner');
        var winners = voteUtils.tallyVotes();
        if (winners.length > 1) {
            client.say(config.get('channel'), 'It looks like we have a tie!  Rolling for a winner!!');
            winners = [ winners[ Math.floor(Math.random() * winners.length) ] ];
        }
        client.say(config.get('channel'), voteUtils.handleWinner(winners[0], settings, applianceUtils, lightInfoUtils));
        stateUtils.setStateOpenVoting();
        voteUtils.clear();
        announcePoll();
        client.say(config.get('channel'), 'Voting is now open and a new round has begun!');
        return;
    }
}
