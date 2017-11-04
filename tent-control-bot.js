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
var MegaPotion = require('./objects/items/MegaPotion');
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
var fs = require('fs');

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
stateUtils.setStateNewSentence();

var num_voters_last_round = 1;
var client = new tmi.client(settings.getTwitchChatClientConfig());

// This is a hack but im overhauling the entire battle/command system next so I dont want to spend a ton of time on it - Sean
//var monsters_punish_with_lights = [ 'Dragon', 'Manticore'];

// TODO: Make all these one variable
var new_round_announced = false;
var loot_announced = false;
var battle_announced = false;
var battle_winner = null;
var last_vote_tally = new Date();
var vote_cost_gold = 400;
var max_winner_level = 0;

var current_round_sentance = null;
var rounds_since_sentence_repeated = 0;
var winners = [];
var winners_loot = {
    'first': null,
    'second': null,
    'third': null
};

client.on("chat", function (channel, userstate, message, self) {
    if (self) return;

    PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
        player.setGold(9999);
        return player.update(redis_client);
    });

    if (stateUtils.isBattleState() && winners.indexOf(userstate.username) > -1) {
        if (message == current_round_sentance) {
            return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var damage_return = player.getDamage();
                var damage = damage_return.damage;
                world.getMonster().setHP(world.getMonster().getHP() - damage);
                if (damage_return.crit) {
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', has landed a critical hit for ' + damage + ' damage! The Monster has ' + world.getMonster().getHP() + ' HP REMAINING!');
                } else {
                    ChatUtils.sayInChat(client, '@' + userstate.username + " has hit the " + world.getMonster().getName() + ' FOR ' + damage + ' DAMAGE! The Monster has ' + world.getMonster().getHP() + ' HP REMAINING!');
                }

                if (world.getMonster().getHP() <= 0) {
                    player.updatePlayerXP(world.getMonster().getXP());
                    ChatUtils.sayInChat(client, "@" + userstate.username + " has slain the " + world.getMonster().getName() + "!");
                    player.update(redis_client);
                    battle_winner = player.getUsername();
                    return stateUtils.setStateBattleLootAnnounce();
                }
                return stateUtils.setStateGetBattleSentence();
            });
        }
    }
    if (stateUtils.isUsersTypingState() && winners.indexOf(userstate.username) === -1) {
        if (winners.length == 3) {
            return;
        }
        if (message == current_round_sentance) {
            winners.push(userstate.username);

            var position = winners.length;
            return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var winners_chest = getChestForWinner(position, player.getLevel());

                if (player.getLevel() > max_winner_level) {
                    max_winner_level = player.getLevel();
                }

                setWinnersChest(position, winners_chest);

                ChatUtils.sayInChat(client, '@' + userstate.username + ', has come in ' + winners.length + getOrdinalIndicator(winners.length) + ' place!');

                if (position == 3) {
                    stateUtils.setStateGiveWinnersLoot();
                }
            });
        }
    }

    var command = CommandHelpUtils.extractCommandFromMessage(message.toLowerCase());
    if (!CommandHelpUtils.verifyCommand(command)) {
        return;
    }
    if (CommandHelpUtils.isPlayerInfoCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            return ChatUtils.sayInChat(client, player.getInfoMessage());
        });
    }
    if (CommandHelpUtils.isVoteCommand(command)) {
        var subCommand = CommandHelpUtils.extractSubCommandFromMessage(message.toLowerCase());
        if (!CommandHelpUtils.isValidVoteSubCommand(subCommand)) {
            return ChatUtils.sayInChat(client, '@' + userstate.username + ', you have entered an invalid vote command!');
        }


        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            if (player.getGold() < vote_cost_gold) {
                return ChatUtils.sayInChat(client, "@" + userstate.username + ", you cant afford a vote.  Try again after you earn " + (vote_cost_gold - player.getGold()) + ' more gold!');
            }
            player.setGold(player.getGold() - vote_cost_gold);
            voteUtils.addUserVote(userstate.username, subCommand);
            player.update(redis_client);
            return ChatUtils.sayInChat(client, '@' + userstate.username + ', your vote of ' + subCommand + ' has been accepted!');
        });
    }
    if (CommandHelpUtils.isHelpCommand(command)) {
        var subCommand = CommandHelpUtils.extractSubCommandFromMessage(message.toLowerCase());
        if (typeof subCommand === 'undefined' || subCommand == null) {
            return ChatUtils.sayInChat(client, CommandHelpUtils.getHelpInfo());
        }
        if (CommandHelpUtils.isVoteHelpSubCommand(subCommand)) {
            return ChatUtils.sayInChat(client, getVoteHelpMessage());
        }
        if (CommandHelpUtils.isShopHelpSubCommand(subCommand)) {
            return ChatUtils.sayInChat(client, ShopUtils.getHelpMessage());
        }
    }
    if (CommandHelpUtils.isShowGearCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            if (player.getGear().length >= player.max_gear) {
                ChatUtils.sayInChat(client, "@" + player.getUsername() + ' YOUR INVENTORY IS FULL! EMPTY IT OR YOU WILL NOT GET ANY NEW ITEM DROPS!!')
            }
            var message = player.getGearMessage(itemUtils);
            if (!message) {
                return ChatUtils.sayInChat(client, '@' + userstate.username + ", your don't have any gear!");
            }
            return ChatUtils.sayInChat(client, '@' + userstate.username + ", your current gear is as follows " + message);
        });
    }
    if (CommandHelpUtils.isDropCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            var subCommand = CommandHelpUtils.extractSubCommandFromMessage(message.toLowerCase()).toLowerCase();
            if (subCommand != null && subCommand == 'all') {
                player.dropAllGear();
                ChatUtils.sayInChat(client, "@" + player.getUsername() + ', you gave dropped all your gear!')
            } else {
                var itemNumber = CommandHelpUtils.extractSubCommandFromMessage(message.toLowerCase());
                if (!InputValidationUtils.isStringPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                    return ChatUtils.sayInChat(client, '@' + userstate.username + " you have entered an invalid item number!");
                }
                ChatUtils.sayInChat(client, player.dropGear(itemNumber));
            }
            return player.update(redis_client);
        });
    }
    if (CommandHelpUtils.isShowEquippedCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            return ChatUtils.sayInChat(client, player.getEquippedGearMessage());
        });
    }
    if (CommandHelpUtils.isEquipCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            var itemNumber = CommandHelpUtils.extractSubCommandFromMessage(message.toLowerCase());
            if (!InputValidationUtils.isStringPositiveInteger(itemNumber) || itemNumber > player.gear.length) {
                return ChatUtils.sayInChat(client, '@' + userstate.username + " you have entered an invalid item number!");
            }
            ChatUtils.sayInChat(client, player.equipGear(itemNumber));
            return player.update(redis_client);
        });
    }
    if (CommandHelpUtils.isShopItemListCommand(message)) {
        return ChatUtils.sayInChat(client, ShopUtils.getItemListMessage());
    }
    if (CommandHelpUtils.isShopBuyItemCommand(message)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            var gold = player.getGold();
            var item = null;
            var say_message = '@' + userstate.username + ', you have entered an invalid item name';
            var itemType = message.split(' ')[2];
            if (message.split(' ').length > 3) {
                itemType += message.split(' ')[3];
            }
            switch (itemType.toLowerCase()) {
                case ('potion'):
                    item = new Potion();
                    break;
                case ('megapotion'):
                    item = new MegaPotion();
                    break;
            }
            if (item == null) {
                return ChatUtils.sayInChat(client, say_message);
            }
            if (gold < item.getCost()) {
                return ChatUtils.sayInChat(client, '@' + userstate.username + ', you can\'t afford this item.  Try again when you earn ' + (item.getCost() - gold) + ' more gold.');
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
        });
    }
    if (CommandHelpUtils.isShowItemsCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            var message = player.getItemsMessage(itemUtils);
            if (!message) {
                return ChatUtils.sayInChat(client, '@' + userstate.username + ", your don't have any items!");
            }
            return ChatUtils.sayInChat(client, '@' + userstate.username + ", your current items are as follows " + message);
        });
    }
    if (CommandHelpUtils.isUseItemCommand(command)) {
        return PlayerUtils.getPlayer(redis_client, userstate.username, function (player) {
            var itemNameArray = message.split(' ');
            var itemName = itemNameArray[1];
            if (itemNameArray.length > 2) {
                itemName += ' ' + itemNameArray[2];
            }
            if (itemUtils.usePlayerItemByType(redis_client, player, itemName)) {
                return ChatUtils.sayInChat(client, '@' + userstate.username + " used a " + message.split(' ')[1]);
            }
            return ChatUtils.sayInChat(client, '@' + userstate.username + ", you entered an invalid item.  It is either spelled wrong or you don't have that item in your inventory.");
        });
    }
});

client.connect();
settings.getSettings()
.then(function (settings_update) {
    settings = new Settings(settings_update.min_humidity, settings_update.max_humidity);
    setInterval(mainLoop, 1000);
})
.catch(function (err) {
    console.log(err);
});

function mainLoop() {
    if (stateUtils.isGenerateNewSentenceState()) {
        return getRandomSentance(function (err, data) {
            if (err) {
                return console.log(err);
            }
            clearWinners();
            current_round_sentance = data.replace("\n", " ").replace("\r", " ");
            ChatUtils.clearChat(client);
            ChatUtils.sayInChat(client, "A new round has begun! Type the following sentence in chat to win gold and loot! \"" + current_round_sentance + "\"");
            stateUtils.setStateUsersTyping();
        });
    }
    if (stateUtils.isUsersTypingState()) {
        rounds_since_sentence_repeated++;
        if (rounds_since_sentence_repeated == 30) {
            ChatUtils.sayInChat(client, "Enter \"" + current_round_sentance + "\" in chat to win the round!");
            rounds_since_sentence_repeated = 0;
        }

        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 30) {
            if (winners.length > 0) {
                stateUtils.setStateGiveWinnersLoot();
            }
        }
        return;
    }
    if (stateUtils.isGiveWinnersLootState()) {
        ChatUtils.clearChat(client);
        ChatUtils.sayInChat(client, "Winners will now be given loot!");
        stateUtils.setStateAnnounceFirstLoot();
        return;
    }
    if (stateUtils.isAnnounceFirstLootState()) {
        if (loot_announced == false) {
            loot_announced = true;
            return PlayerUtils.getPlayer(redis_client, winners[0], function (player) {
                player.setGold(player.getGold() + winners_loot['first'].getGold());
                for (var i = 0; i < winners_loot['first'].getGear().length; i++) {
                    player.addGear(winners_loot['first'].getGear()[i]);
                }
                player.updatePlayerXP(200);
                ChatUtils.sayInChat(client, '@' + winners[0] + ' has won 200 XP and a Mythical chest! It contains ' + winners_loot['first'].getGold() + ' gold!');
                var gearMessage = winners_loot['first'].getGearMessage();
                if (gearMessage) {
                    ChatUtils.sayInChat(client, gearMessage);
                }
                return player.update(redis_client);
             });
        }

        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 5) {
            loot_announced = false;

            if (winners.length == 1) {
                return stateUtils.setStateAnnounceBattle();
            }
            return stateUtils.setStateAnnounceSecondLoot();
        }
    }
    if (stateUtils.isAnnounceSecondLootState()) {
        if (loot_announced == false) {
            loot_announced = true;
            return PlayerUtils.getPlayer(redis_client, winners[1], function (player) {
                player.setGold(player.getGold() + winners_loot['second'].getGold());
                for (var i = 0; i < winners_loot['second'].getGear().length; i++) {
                    player.addGear(winners_loot['second'].getGear()[i]);
                }
                player.updatePlayerXP(100);
                ChatUtils.sayInChat(client, '@' + winners[1] + ' has won 100 XP and a Rare chest! It contains ' + winners_loot['second'].getGold() + ' gold!');
                var gearMessage = winners_loot['second'].getGearMessage();
                if (gearMessage) {
                    ChatUtils.sayInChat(client, gearMessage);
                }
                return player.update(redis_client);
            });
        }

        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 5) {
            loot_announced = false;

            if (winners.length == 2) {
                return stateUtils.setStateAnnounceBattle();
            }
            return stateUtils.setStateAnnounceThirdLoot();
        }
    }
    if (stateUtils.isAnnounceThirdLootState()) {
        if (loot_announced == false) {
            loot_announced = true;
            return PlayerUtils.getPlayer(redis_client, winners[2], function (player) {
                player.setGold(player.getGold() + winners_loot['third'].getGold());
                for (var i = 0; i < winners_loot['third'].getGear().length; i++) {
                    player.addGear(winners_loot['third'].getGear()[i]);
                }
                player.updatePlayerXP(50);
                ChatUtils.sayInChat(client, '@' + winners[2] + ' has won 50 XP and a Normal chest! It contains ' + winners_loot['third'].getGold() + ' gold!');
                var gearMessage = winners_loot['third'].getGearMessage();
                if (gearMessage) {
                    ChatUtils.sayInChat(client, gearMessage);
                }
                return player.update(redis_client);
            });
        }

        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 5) {
            loot_announced = false;
            return stateUtils.setStateAnnounceBattle();
        }
    }
    if (stateUtils.isAnnounceNewRoundState()) {
        if (!new_round_announced) {
            new_round_announced = true;
            ChatUtils.sayInChat(client, "A new round is about to begin!");
        }
        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 5) {
            new_round_announced = false;
            return startNewRound();
        }
    }
    if (stateUtils.isAnnounceBattleState()) {
        if (!battle_announced) {
            battle_announced = true;

            var monster = MonsterFactory.getMonster(max_winner_level, winners.length);
            world.setMonster(monster);
            max_winner_level = 0;

            ChatUtils.clearChat(client);
            ChatUtils.sayInChat(client, 'Your village is being attacked from the north by a ' + monster.getName() + '- HP:' + monster.getHP() + '/' + monster.getMaxHP());
        }
        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 3) {
            battle_announced = false;
            return stateUtils.setStateGetBattleSentence();
        }
    }
    if (stateUtils.isGetBattleSentenceState()) {
        return getRandomBattleSentance(function (err, data) {
            if (err) {
                return console.log(err);
            }
            current_round_sentance = data.replace("\n", " ").replace("\r", " ");
            ChatUtils.sayInChat(client, "To kill the monster enter the sentence in between the emotes! TwitchRPG " + current_round_sentance + " TwitchRPG");
            return stateUtils.setStateBattle();
        });
    }
    if (stateUtils.isBattleState()) {
        if (!winners.length) {
            stateUtils.setStateAnnounceNewRound();
        }

        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 3) {
            var user = winners[RNGUtils.getRandom(0, winners.length - 1)];
            var damage = world.getMonster().getDamage();
            return PlayerUtils.getPlayer(redis_client, user, function (player) {
                ChatUtils.sayInChat(client, "The " + world.getMonster().getName() + ' attacks @' + user + ' for ' + damage + ' damage!');
                player.takeDamage(damage);
                if (player.getHP() <= 0) {
                    winners.splice(winners.indexOf(player.getUsername()), 1);
                    player.die();
                    ChatUtils.sayInChat(client, "@" + player.getUsername() + " has died!");
                }
                stateUtils.setStateBattle();
                return player.update(redis_client);
            });
        }
    }
    if (stateUtils.isBattleLootAnnounceState()) {
        if (!battle_announced) {
            battle_announced = true;
            return PlayerUtils.getPlayer(redis_client, battle_winner, function (player) {
                var prize = new Chest('Mythical', 50, 100, player.getLevel(), 2, 3);
                player.setGold(player.getGold() + prize.getGold());
                for (var i = 0; i < prize.getGear().length; i++) {
                    player.addGear(prize.getGear()[i]);
                }
                ChatUtils.sayInChat(client, '@' + battle_winner + ', you find a mythical chest containing ' + prize.getGold() + ' gold!');
                var gear_message = prize.getGearMessage();
                if (gear_message) {
                    ChatUtils.sayInChat(client, gear_message);
                }
                announcePoll();
                return player.update(redis_client);
            });
        }
        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 5) {
            battle_announced = false;
            return startNewRound();
        }
    }
    if (stateUtils.isTallyVotesState()) {
        if (!battle_announced) {
            battle_announced = true;

            ChatUtils.clearChat(client);
            ChatUtils.sayInChat(client, 'The current round has ended and all votes have been locked in! I will now tally up the votes and announce a winner');
            var voteWinners = voteUtils.tallyVotes();
            if (!voteWinners.length) {
                battle_announced = false;
                last_vote_tally = new Date();
                return startNewRound();
            }
            if (voteWinners.length > 1) {
                ChatUtils.sayInChat(client, 'It looks like we have a tie!  Rolling for a winner!!');
                voteWinners = [voteWinners[Math.floor(Math.random() * voteWinners.length)]];
            }
            ChatUtils.sayInChat(client, voteUtils.handleWinner(voteWinners[0], settings, applianceUtils, lightInfoUtils));
            voteUtils.clear();
            ChatUtils.sayInChat(client, 'Voting is now open and a new round is about to begin!');
            return announcePoll();
        }
        var time_in_round = new DateDiff(new Date(), stateUtils.getLastStateChange());
        if (time_in_round.seconds() >= 10) {
            battle_announced = false;
            last_vote_tally = new Date();
            return startNewRound();
        }
    }
}

function getRandomBattleSentance(callback) {
    fs.readFile('./assets/battle.txt', 'utf-8', function (err, data) {
        if (err) {
            callback(err, null);
        }
        var strings = data.split('\n');
        callback(null, strings[RNGUtils.getRandom(0, strings.length - 1)]);
    });
}

function getRandomSentance(callback) {
    fs.readFile('./assets/wordbank.txt', 'utf-8', function (err, data) {
        if (err) {
            callback(err, null);
        }
        var strings = data.split('\n');
        callback(null, strings[RNGUtils.getRandom(0, strings.length - 1)]);
    });
}

function clearWinners() {
    winners = [];
}

function clearWinnersLoot() {
    winners_loot = {
        'first': null,
        'second': null,
        'third': null
    };
}

function getOrdinalIndicator(number) {
    switch (number) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function getChestForWinner(position, player_level) {
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

function setWinnersChest(position, chest) {
    switch(position) {
        case 1:
            winners_loot['first'] = chest;
            break;
        case 2:
            winners_loot['second'] = chest;
            break;
        case 3:
            winners_loot['third'] = chest;
            break;
    }
}

function startNewRound() {
    var time_in_round = new DateDiff(new Date(), last_vote_tally);
    if (time_in_round.minutes() >= 1 && voteUtils.tallyVotes().length) {
        return stateUtils.setStateTallyVotes();
    }
    clearWinners();
    clearWinnersLoot();
    stateUtils.setStateNewSentence();
}

function getVoteHelpMessage() {
    return 'Voting costs ' + vote_cost_gold + ' gold. You can cast your vote to turn turn on or off the circulating and exhaust fans.  You can also vote to raise or lower the min or max humidity thresholds that determine when the humidifier turns on. To vote type "vote" in chat followed by one of the following commands: ("turnonfan"/"turnonfan" - Turn the circulating fan on/off) ("turnonexhaust"/"turnoffehxhaust" - Turn the exhaust fan on or off) ("lowermaxh"/"raisemaxh"/"lowerminh"/"raiseminh" - Lower or raise the min/max humidity thresholds).  The bot will count all votes every minute and make the appropriate change for whatever command wins! bleedPurple Example: "vote turnofffan" - This would cast one vote to turn off the circulating fan bleedPurple';
}

function announcePoll() {
    var rng = RNGUtils.getRandom(1, 6);
    switch (rng) {
        case 1:
            ChatUtils.sayInChat(client, 'TwitchRPG CHECK US OUT ON PATREON TO SUPPORT MORE OPEN SOURCE AUTOMATION SOFTWARE! http://patreon.com/hightek TwitchRPG');
            return;
        case 2:
            ChatUtils.sayInChat(client, 'TwitchRPG JOIN THE DANK GROW MOB DISCORD! https://discord.gg/xgmGyE6 TwitchRPG');
            return;
        case 3:
            ChatUtils.sayInChat(client, 'TwitchRPG CHECK OUT OUR UPDATED SITE AT http://hightekco.com TwitchRPG');
            return;
        case 4:
            ChatUtils.sayInChat(client, 'TwitchRPG CHECK OUT OUR BLOG AT http://ttcubicle.blogspot.com/ TwitchRPG');
            return;
        case 5:
            ChatUtils.sayInChat(client, 'TwitchRPG Subscribe to our subreddit at https://www.reddit.com/r/hightek/ TwitchRPG');
            return;
        case 6:
            ChatUtils.sayInChat(client, 'TwitchRPG Follow us out on twitter at https://twitter.com/HighTekGrow for live updates! TwitchRPG');
            return;
    }
}







/*if (stateUtils.isFightingMonsterState()) {
        var time_in_fight = new DateDiff(new Date(), world.getMonster().getFightStartTime());
        // TODO(Sean): Move this to config
        if (time_in_fight.seconds() >= 15) {
            if (monsters_punish_with_lights.indexOf(world.getMonster().getName()) > -1) {
                if (lightInfoUtils.getLightsOn()) {
                    lightInfoUtils.updateLightStatus(false);
                }
            }
            world.getMonster().punish();
            world.getMonster().finish(settings);
            stateUtils.setStateOpenVoting();
        }
        return;
    }
    if (stateUtils.isVotingOpenState()) {
        var time_in_round = new DateDiff(new Date(), voteUtils.getRoundStartedTime());
        //if (time_in_round.minutes() >= gameSettings.getRoundTimeInMinutes()) {
        if (time_in_round.seconds() >= 15) {
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

                    var rng = RNGUtils.getRandom(1, 2);
                    //if (rng == 2) {
                    if (2 == 2) {
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
                    ChatUtils.sayInChat(client, '@' + userstate.username + ', I have received your vote of ' + command + ' and awarded you ' + gameSettings.getGoldForVote() + ' gold for it. Any other votes sent this round will be ignored!');
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
    }*/