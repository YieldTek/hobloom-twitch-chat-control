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
var ChatUtils = require('./lib/ChatUtils');
var InputValidationUtils = require('./lib/InputValidationUtils');
var GameSettings = require('./objects/GameSettings');

var redis_client = redis.createClient();

var world = new World();
var lightInfoUtils = new LightInfoUtils();
var voteUtils = new VoteUtils();
var stateUtils = new StateUtils();
var itemUtils = new ItemUtils();
var settings = new Settings(null, null);
var applianceUtils = new ApplianceUtils(settings);
var playerDamageTracker = new PlayerDamageTracker();
var gameSettings = new GameSettings(config.get('game_settings'));

lightInfoUtils.updateLightStatus(true);

var num_voters_last_round = 1;
var client = new tmi.client(settings.getTwitchChatClientConfig());

client.on("chat", function (channel, userstate, message, self) {
    if (self) return;

    var command = CommandHelpUtils.extractCommandFromMessage(message.toLowerCase());
    var full_command = message.toLowerCase();
    if (CommandHelpUtils.verifyCommand(command)) {
        PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            if (stateUtils.isFightingMonsterState() && CommandHelpUtils.isAttackCommand(command)) {
                var damage_return = player.getDamage();
                var damage = damage_return.damage;
                if (damage_return.crit) {
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', has landed a critical hit for ' + damage + ' damage!');
                }

                playerDamageTracker.addPlayer(player);

                world.getMonster().setHP(world.getMonster().getHP() - damage);
                if (world.getMonster().getHP() <= 0) {
                    ChatUtils.sayInChat(client, "The " + world.getMonster().getName() + " has been slain!");

                    var rng = RNGUtils.getRandom(1, 3);
                    if (rng == 2) {
                        var item = NormalGearFactory.getItemForPlayer(player.getLevel());
                        if (item != null) {
                            ChatUtils.sayInChat(client, "@" + userstate.username + ' FOUND WEAPON: ' + item.getName() + " (STR-" + item.getStrength() + ") (DEX-" + item.getDexterity() + ") (HP BONUS-" + item.getHPBonus() + ")");
                            player.addGear(item);
                        }
                    }
                    player.update(redis_client);

                    playerDamageTracker.addXPForUsers(redis_client, world.getMonster().getXP());
                    playerDamageTracker.clearUsers();
                    stateUtils.setStateOpenVoting();
                    return world.setMonster(null);
                }
                ChatUtils.sayInChat(client, '@' + userstate.username + " has hit the " + world.getMonster().getName() + ' FOR ' + damage + ' DAMAGE! The Monster has ' + world.getMonster().getHP() + ' HP REMAINING!');

                var damage = RNGUtils.getRandom(world.getMonster().getMinDamage(), world.getMonster().getMaxDamage());
                player.setHP(player.getHP() - damage);
                var hp = player.getHP();
                ChatUtils.sayInChat(client, '@' + userstate.username + " the " + world.getMonster().getName() + " swings back and hits you for " + damage + ' damage! YOU HAVE ' + hp + ' HP REMAINING!');
                if (player.getHP() <= 0) {
                    player.setXP(0);
                    player.setHP(player.getMaxHP());
                    var goldToRemove = Math.ceil(player.getGold() * 0.20);
                    player.setGold(player.getGold() - goldToRemove);
                    ChatUtils.sayInChat(client, '@' + userstate.username + " the " + world.getMonster().getName() + " HAS KILLED YOU! You will now lose all your XP and " + goldToRemove + " gold!!");
                }
                player.update(redis_client);
                return;
            }
            if (CommandHelpUtils.isShowEquippedCommand(command)) {
                ChatUtils.sayInChat(client, player.getEquippedGearMessage());
                return;
            }
            if (CommandHelpUtils.isEquipCommand(command)) {
                var itemNumber = CommandHelpUtils.extractSubCommandFromMessage(full_command);
                if (!InputValidationUtils.isStringPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + " you have entered an invalid item number!");
                }
                ChatUtils.sayInChat(client, player.equipGear(itemNumber));
                player.update(redis_client);
                return;
            }
            if (CommandHelpUtils.isDropCommand(command)) {
                var itemNumber = CommandHelpUtils.extractSubCommandFromMessage(full_command);
                if (!InputValidationUtils.isStringPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + " you have entered an invalid item number!");
                }
                ChatUtils.sayInChat(client, player.dropGear(itemNumber));
                player.update(redis_client);
                return;
            }
            if (CommandHelpUtils.isHelpCommand(command)) {
                var subCommand = CommandHelpUtils.extractSubCommandFromMessage(full_command);
                if (CommandHelpUtils.isShopCommand(subCommand)) {
                    return ChatUtils.sayInChat(client, ShopUtils.getHelpMessage());
                }
                return ChatUtils.sayInChat(client, CommandHelpUtils.getHelpInfo());
            }
            if (CommandHelpUtils.isPlayerInfoCommand(command)) {
                return ChatUtils.sayInChat(client, player.getInfoMessage());
            }
            if (CommandHelpUtils.isShowItemsCommand(command)) {
                var message = player.getItemsMessage(itemUtils);
                if (!message) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + ", your don't have any items!");
                }
                return ChatUtils.sayInChat(client, '@' + userstate.username + ", your current items are as follows " + message);
            }
            if (CommandHelpUtils.isShowGearCommand(command)) {
                var message = player.getGearMessage(itemUtils);
                if (!message) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + ", your don't have any gear!");
                }
                return ChatUtils.sayInChat(client, '@' + userstate.username + ", your current gear is as follows " + message);
            }
            if (CommandHelpUtils.isUseItemCommand(command)) {
                if (itemUtils.usePlayerItemByType(redis_client, player, full_command.split(' ')[1])) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + " used a " + full_command.split(' ')[1]);
                }
                return ChatUtils.sayInChat(client, '@' + userstate.username + ", you entered an invalid item.  It is either spelled wrong or you don't have that item in your inventory.");
            }
            if (CommandHelpUtils.isLightInfoCommand(command)) {
                return lightInfoUtils.printLightInfo(config.get('channel'), client);
            }
            if (!stateUtils.isFightingMonsterState() && CommandHelpUtils.isAttackCommand(command)) {
                return;
            }
            if (CommandHelpUtils.isShopItemListCommand(full_command)) {
                return ChatUtils.sayInChat(client, ShopUtils.getItemListMessage());
            }
            if (CommandHelpUtils.isShopBuyItemCommand(full_command)) {
                var gold = player.getGold();
                var item = null;
                var say_message = '@' + userstate.username + ', you have entered an invalid item name';
                switch (full_command.split(' ')[2]) {
                    case ('Potion'):
                    case ('potion'):
                        item = new Potion();
                        break;
                }
                if (item == null) {
                    return ChatUtils.sayInChat(client, say_message);
                }
                if (gold < item.getCost()) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + ', you can afford this item.  Try again when you earn ' + (item.getCost() - gold) + ' more gold.');
                }
                var num_items = itemUtils.getItemCounts(player.getItems())[item.getName()];
                var max_items = item.getMaxInInventor();
                if (num_items >= max_items) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + ', you already have the max ' + item.getName() + ' in your inventory!');
                }
                player.addItem(item);
                player.setGold(gold - item.getCost());
                player.update(redis_client);
                return ChatUtils.sayInChat(client, '@' + userstate.username + ', you have purchased a ' + item.getName());
            }
            if (stateUtils.isVotingOpenState()) {
                if (CommandHelpUtils.isNonVoteCommand(full_command)) {
                    return;
                }
                if (voteUtils.hasUserVoted(userstate.username)) {
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', you have already voted this round. Each user only gets one vote per round!');
                    return;
                }

                var hunted = false;
                if (!CommandHelpUtils.isHuntCommand(command)) {
                    voteUtils.addUserVote(userstate.username, command);
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', I have received your vote of ' + message + ' and awarded you ' + gameSettings.getGoldForVote() + ' gold for it. Any other votes sent this round will be ignored!');
                } else {
                    hunted = true;
                    voteUtils.addUserWithoutVote(userstate.username);
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', is going hunting. Best of luck in pulling back a monster! You have received ' + (gameSettings.getGoldForVote() * 2) + ' gold for going out hunting!');
                }

                var gold_for_player = gameSettings.getGoldForVote();
                if (hunted) {
                    gold_for_player *= 2;
                }
                var chest_found = ChestFactory.spawnForVote();
                if (chest_found != null) {
                    gold_for_player += chest_found.getGold();
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', YOU FOUND A ' + chest_found.getType() + ' CHEST!! IT CONTAINS ' + chest_found.getGold() + ' GOLD!!');
                }
                player.setGold(player.getGold() + gold_for_player);

                var monsterFactoryReturn = MonsterFactory.rollForMonster(client, config.get("channel"), applianceUtils.appliance_locks, num_voters_last_round, applianceUtils.changeAppliancePower);
                if (monsterFactoryReturn != null) {
                    stateUtils.setStateUnderAttack();
                    world.setMonster(monsterFactoryReturn);
                    ChatUtils.sayInChat(client, 'SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc');
                    world.getMonster().spawn();
                }
                return player.update(redis_client);
            }
        });
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
    ChatUtils.sayInChat(client, 'Kappa Kappa CHECK US OUT ON PATREON TO SUPPORT MORE OPEN SOURCE AUTOMATION SOFTWARE! http://patreon.com/hightek Kappa Kappa');
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
        if (time_in_round.minutes() >= gameSettings.getRoundTimeInMinutes()) {
        //if (time_in_round.seconds() >= 15) {
            stateUtils.setCountingVotes();
        }
        return;
    }
    if (stateUtils.isCountingVotesState()) {
        ChatUtils.sayInChat(client, 'The current round has ended and all votes have been locked in! I will now tally up the votes and announce a winner');
        var winners = voteUtils.tallyVotes();
        if (winners.length > 1) {
            ChatUtils.sayInChat(client, 'It looks like we have a tie!  Rolling for a winner!!');
            winners = [ winners[ Math.floor(Math.random() * winners.length) ] ];
        }
        ChatUtils.sayInChat(client, voteUtils.handleWinner(winners[0], settings, applianceUtils, lightInfoUtils));
        stateUtils.setStateOpenVoting();
        voteUtils.clear();
        announcePoll();
        ChatUtils.sayInChat(client, 'Voting is now open and a new round has begun!');
        return;
    }
}
