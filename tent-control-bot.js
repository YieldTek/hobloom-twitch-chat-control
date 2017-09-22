var tmi = require("tmi.js");
var redis = require('redis');
var config = require('config');
var request = require('request');
var DateDiff = require('date-diff');
var World = require('./objects/World');
var Chest = require('./objects/Chest');
var RNGUtils = require('./lib/RNGUtils');
var VoteUtils = require('./lib/VoteUtils');
var StateUtils = require('./lib/StateUtils');
var PlayerUtils = require('./lib/PlayerUtils');
var LightInfoUtils = require('./lib/LightInfoUtils');
var CommandHelpUtils = require('./lib/CommandHelpUtils');
var MonsterFactory = require('./objects/MonsterFactory');

var redis_client = redis.createClient();

var world = new World();
var playerUtils = new PlayerUtils();
var monsterFactory = new MonsterFactory();
var commandHelpUtils = new CommandHelpUtils();
var lightInfoUtils = new LightInfoUtils();
var voteUtils = new VoteUtils();
var stateUtils = new StateUtils();
var rngUtils = new RNGUtils();

lightInfoUtils.updateLightStatus(true);

var max_humidity = null;
var min_humidity = null;

var appliance_locks =  {
    'intake': null,
    'lights': null,
    'exhaust': null
};

var num_voters_last_round = 1;

// TODO: Move to settings object
var DEV_MODE = config.get('dev_mode');
var GOLD_FOR_VOTE = 5;
var LOCK_TIMES = 15 * 60000;
var ROUND_TIME_MINUTES = 1;

var base_unit_ip = "http://" + config.get("hobloom_ip") + ":" + config.get("hobloom_port");

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

    var command = commandHelpUtils.extractCommandFromMessage(message);
    if (commandHelpUtils.verifyCommand(command.toLowerCase())) {
        if (stateUtils.isFightingMonsterState() && commandHelpUtils.isAttackCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                var damage = player.getDamage();
                if (player.checkForCriticalHit()) {
                    var a = parseFloat(rngUtils.getRandom(2, 4).toString() + '.' + rngUtils.getRandom(0, 9).toString() + rngUtils.getRandom(0, 9).toString());
                    damage *= a;
                    damage = Math.floor(damage);
                    client.say(config.get('channel'), '@' + userstate.username + ', has landed a critical hit for ' + damage + ' damage!');
                }

                world.getMonster().setHP(world.getMonster().getHP() - damage);
                if (world.getMonster().getHP() <= 0) {
                    var xp = world.getMonster().getXP();
                    if (userstate.mod === true) {
                        xp *= 2;
                    }
                    playerUtils.updatePlayerXP(redis_client, player, xp);

                    client.say(config.get('channel'), '@' + userstate.username + " has slain the " + world.getMonster().getName() + "!");
                    world.setMonster(null);
                    stateUtils.setStateOpenVoting();
                    return;
                }
                client.say(config.get('channel'), '@' + userstate.username + " has hit the " + world.getMonster().getName() + ' FOR ' + damage + ' DAMAGE! The Monster has ' + world.getMonster().getHP() + ' HP REMAINING!');
            });
            return;
        }

        if (commandHelpUtils.isHelpCommand(command)) {
            commandHelpUtils.printHelpInfo(config.get('channel'), client);
            return;
        }

        if (commandHelpUtils.isPlayerInfoCommand(command)) {
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                player.printInfo(config.get('channel'), client);
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

        if (stateUtils.isVotingOpenState()) {
            if (voteUtils.hasUserVoted(userstate.username)) {
                client.say(config.get('channel'), '@' + userstate.username + ', you have already voted this round. Each user only gets one vote per round!');
                return;
            }

            voteUtils.addUserVote(userstate.username, command);
            playerUtils.getPlayer(redis_client, userstate.username, function (player) {
                client.say(config.get("channel"), '@' + userstate.username + ', I have received your vote of ' + message + ' and awarded you ' + GOLD_FOR_VOTE + ' gold for it. Any other votes sent this round will be ignored!');

                var chest_gold = 0;
                if (rngUtils.getRandom(1, 15) == 10) {
                    var player_chest = new Chest(10, 200);
                    chest_gold += player_chest.getGold();
                    client.say(config.get("channel"), '@' + userstate.username + ', YOU FOUND A CHEST!! IT CONTAINS ' + player_chest.getGold() + ' GOLD!!');
                }

                if (rngUtils.getRandom(1, 50) == 10) {
                    var player_chest = new Chest(200, 1000);
                    chest_gold += player_chest.getGold();
                    client.say(config.get("channel"), '@' + userstate.username + ', YOU FOUND A RARE CHEST!! IT CONTAINS ' + player_chest.getGold() + ' GOLD!!');
                }

                if (rngUtils.getRandom(1, 200) == 50) {
                    var player_chest = new Chest(2000, 5000);
                    chest_gold += player_chest.getGold();
                    client.say(config.get("channel"), '@' + userstate.username + ', YOU FOUND A MYTHICAL CHEST!! IT CONTAINS ' + player_chest.getGold() + ' GOLD!!');
                }

                playerUtils.updatePlayerGold(redis_client, player, GOLD_FOR_VOTE + chest_gold);


                var monsterFactoryReturn = monsterFactory.rollForMonster(client, config.get("channel"), appliance_locks, num_voters_last_round, changeApplianceStatus);
                if (monsterFactoryReturn != null) {
                    stateUtils.setStateUnderAttack();
                    world.setMonster(monsterFactoryReturn);
                    client.say(config.get("channel"), 'SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SPAWNING A RANDOM MONSTER NOW! MAY ALL YOUR BASE STILL BELONG TO YOU AFTER THIS BATTLE! SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc SMOrc');
                    world.getMonster().spawn();
                }
            });
            return;
        }
        return;
    }
});

client.connect();

getSettings();

function announcePoll() {
    client.say(config.get("channel"), 'Kappa Kappa CHECK US OUT ON PATREON TO SUPPORT MORE OPEN SOURCE AUTOMATION SOFTWARE! g Kappa Kappa');
}

function handleWinner(command) {
    switch (command) {
        case 'raisemaxh':
            raiseMaxHumidity();
            return 'The winning command is raise max humidity! The max humidity setting will go up by one percent.';
        case 'lowermaxh':
            lowerMaximumHumidity();
            return 'The winning command is lower max humidity! The max humidity setting will go down by one percent.';
        case 'raiseminh':
            raiseMinHumidity();
            return 'The winning command is raise minimum humidity! The minimum humidity setting will go up by one percent.';
        case 'lowerminh':
            lowerMinHumidity();
            return 'The winning command is lower minimum humidity! The minimum humidity setting will go down by one percent.';
        case 'turnofflights':
            if (lightInfoUtils.getLightsOn()) {
                lightInfoUtils.updateLightStatus(false);
            }
            changeApplianceStatus('light', false);
            return 'The winning command is turn off lights! The lights will now be turning off and the icon on the dashboard will turn red.';
        case 'turnonlights':
            if (!lightInfoUtils.getLightsOn()) {
                lightInfoUtils.updateLightStatus(true);
            }
            var lock_message = checkApplianceLock('lights');
            if (lock_message != null) {
                return lock_message;
            }
            changeApplianceStatus('light', true);
            return 'The winning command is turn on lights! The lights will now be turning on and the icon on the dashboard will turn blue.';
        case 'turnonfan':
            var lock_message = checkApplianceLock('intake');
            if (lock_message != null) {
                return lock_message;
            }
            changeApplianceStatus('intake', true);
            return 'The winning command is turn on fan! The circulating fan will now be turning on and the icon on the dashboard will turn blue.';
        case 'turnofffan':
            changeApplianceStatus('intake', false);
            return 'The winning command is turn off fan! The circulating fan will now be turning off and the icon on the dashboard will turn red.';
        case 'turnonexhaust':
            var lock_message = checkApplianceLock('exhaust');
            if (lock_message != null) {
                return lock_message;
            }
            changeApplianceStatus('exhaust', true);
            return 'The winning command is turn on exhaust fan! The exhaust fan will now be turning on and the icon on the dashboard will turn blue.';
        case 'turnoffexhaust':
            changeApplianceStatus('exhaust', false);
            return 'The winning command is turn off exhaust fan! The exhaust fan will now be turning off and the icon off the dashboard will turn red.';
        default:
            return '';
    }
}

function checkApplianceLock(type) {
    if(appliance_locks[type] != null && new Date() - appliance_locks[type] < LOCK_TIMES) {
        return 'I can\'t complete your request as your party has failed to slay a monster and is still being punished!';
    }
    if(appliance_locks[type] != null && new Date() - appliance_locks[type] > LOCK_TIMES) {
        appliance_locks[type] = null;
    }
    return null;
}

function raiseMaxHumidity() {
    if (max_humidity < 90) {
        max_humidity++;
        updateSettings();
    }
}

function lowerMaximumHumidity() {
    max_humidity--;
    updateSettings();
}

function raiseMinHumidity() {
    min_humidity++;
    updateSettings();
}

function lowerMinHumidity() {
    if (min_humidity > 30) {
        min_humidity--;
        updateSettings();
    }
}

function getSettings() {
    if (DEV_MODE) {
        max_humidity = 70;
        min_humidity = 60;
        return;
    }
    request(base_unit_ip + '/settings', function (error, response, body) {
        var data = JSON.parse(body).data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].key == 'MAX_HUMIDITY') {
                max_humidity = parseInt(data[i].value);
            }
            if (data[i].key == 'MIN_HUMIDITY') {
                min_humidity = parseInt(data[i].value);
            }
        }
    });
}

function updateSettings() {
    if (DEV_MODE) {
        return;
    }
    var params = {
        settings: [
            { key: 'MIN_HUMIDITY', value: min_humidity },
            { key: 'MAX_HUMIDITY', value: max_humidity }
        ]
    };

    request({ url: base_unit_ip + '/settings', method: 'PUT', json: params }, function (error, response, body) {
    });
}

function changeApplianceStatus(type, on) {
    if (DEV_MODE) {
        return;
    }

    var params = {
        asset_type: type
    };
    params['turn_on'] = 'false';
    if (on) {
        params['turn_on'] = 'true';
    }
    request({ url: base_unit_ip + '/appliancepower', method: 'POST', json: params }, function (error, response, body) {
    });
}

function mainLoop() {
    if (stateUtils.isFightingMonsterState()) {
        var time_in_fight = new DateDiff(new Date(), world.getMonster().getFightStartTime());
        if (time_in_fight.seconds() >= 15) {
            world.getMonster().punish();
            world.getMonster().finish();
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
        client.say(config.get('channel'), handleWinner(winners[0]));
        stateUtils.setStateOpenVoting();
        voteUtils.clear();
        announcePoll();
        client.say(config.get('channel'), 'Voting is now open and a new round has begun!');
        return;
    }
}


setInterval(mainLoop, 2000);
