var tmi = require("tmi.js");
var config = require('config');
var request = require('request');

var max_humidity = null;
var min_humidity = null;

var users_voted = [];
var votes = resetVotes();


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

    if (message[0] == '!') {
        message = message.split(" ")[0];
        if ((message in votes) && !(users_voted.includes(userstate.username))) {
            users_voted.push(userstate.username);
            votes[message]++;
        }
    }
});

client.connect();

getCommand();
getSettings();

function getCommand() {
    setTimeout(function () {
        winners = findWinningCommand();
        if (winners.length > 1) {
            client.say(config.get("channel"), 'We have a tie, rolling a d20 to decide a winner...');
            client.say(config.get("channel"), 'Beep Boop Beep Bop');
            client.say(config.get("channel"), 'Ohhhh this is a good one!');
            var winner = winners[ Math.floor(Math.random() * winners.length) ];
            winners = [ winner ];
        }
        var message = handleWinner(winners[0]);
        client.say(config.get("channel"), message);

        votes = resetVotes();
        getCommand();
    }, 30 * 1000);
}

function handleWinner(command) {
    switch (command) {
        case '!raisemaxh':
            raiseMaxHumidity();
            return 'The winning command is raise max humidity! The max humidity setting will go up by one degree.';
        case '!lowermaxh':
            lowerMaximumHumidity();
            return 'The winning command is lower max humidity! The max humidity setting will go down by one degree.';
        case '!raiseminh':
            raiseMinHumidity();
            return 'The winning command is raise minimum humidity! The minimum humidity setting will go up by one degree.';
        case '!lowerminh':
            lowerMinHumidity();
            return 'The winning command is lower minimum humidity! The minimum humidity setting will go down by one degree.';
        case '!turnofflights':
            changeApplianceStatus('light', false);
            return 'The winning command is turn off lights! The lights will now be turning off and the icon on the dashboard will turn red.';
        case '!turnonlights':
            changeApplianceStatus('light', true);
            return 'The winning command is turn on lights! The lights will now be turning on and the icon on the dashboard will turn blue.';
        case '!turnonfan':
            changeApplianceStatus('intake', true);
            return 'The winning command is turn on fan! The circulating fan will now be turning on and the icon on the dashboard will turn blue.';
        case '!turnofffan':
            changeApplianceStatus('intake', false);
            return 'The winning command is turn off fan! The circulating fan will now be turning off and the icon on the dashboard will turn red.';
        case '!turnonexhaust':
            changeApplianceStatus('exhaust', true);
            return 'The winning command is turn on exhaust fan! The exhaust fan will now be turning on and the icon on the dashboard will turn blue.';
        case '!turnoffexhaust':
            changeApplianceStatus('exhaust', false);
            return 'The winning command is turn off exhaust fan! The exhaust fan will now be turning on and the icon off the dashboard will turn red.';
    }
}

function findWinningCommand() {
    var winners = [];
    var winning_num_votes = 0;

    for (key in votes) {
        if (votes[key] > winning_num_votes) {
            winning_num_votes = votes[key];
            winners = [];
            winners.push(key);
        } else if (votes[key] != 0 && votes[key] == winning_num_votes) {
            winners.push(key);
        }
    }
    return winners;
}

function raiseMaxHumidity() {
    max_humidity++;
    updateSettings();
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
    min_humidity--;
    updateSettings();
}

function getSettings() {
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

function resetVotes() {
    users_voted = [];
    return {
        '!raisemaxh': 0,
        '!raiseminh': 0,
        '!lowerminh': 0,
        '!turnofflights': 0,
        '!turnonlights': 0,
        '!turnofffan': 0,
        '!turnonfan': 0,
        '!turnonexhaust': 0,
        '!turnoffexhaust': 0
    };
}