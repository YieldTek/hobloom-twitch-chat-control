function CommandHelpUtils() {
    this.command_info = [
        { 'command': 'raisemaxh', 'description': 'Raise max humidity' },
        { 'command': 'raiseminh', 'description': 'Raise minimum humidity' },
        { 'command': 'lowermaxh', 'description': 'Lower max humidity' },
        { 'command': 'lowerminh', 'description': 'Lower minimum humidity' },
        { 'command': 'turnofflights', 'description': 'Turn off the lights' },
        { 'command': 'turnonlights', 'description': 'Turn on the lights' },
        { 'command': 'turnofffan', 'description': 'Turn off the fan' },
        { 'command': 'turnonfan', 'description': 'Turn on the fan' },
        { 'command': 'turnoffexhaust', 'description': 'Turn off the exhaust' },
        { 'command': 'turnonexhaust', 'description': 'Turn on the exhaust' },
        { 'command': 'lightinfo', 'description': 'Show info on lights' },
        { 'command': '..', 'description': 'Attack monsters' },
        { 'command': 'showstats', 'description': 'Show player information' }
    ];
}

CommandHelpUtils.prototype.printHelpInfo = function (channel, client) {
    var message = '';

    for (var i = 0; i < this.command_info.length; i++) {
        message += 'ItsBoshyTime ' + this.command_info[i].command + ' - ' + this.command_info[i].description + ' ';
        if (i == this.command_info.length - 1) {
            message += 'ItsBoshyTime';
        }
    }
    client.say(channel, message);
};

CommandHelpUtils.prototype.verifyCommand = function (command) {
    if (this.isHelpCommand(command) || this.isAttackCommand(command)) {
        return true;
    }
    for (var i = 0; i < this.command_info.length; i++) {
        if (this.command_info[i].command === command) {
            return true;
        }
    }
    return false;
};

CommandHelpUtils.prototype.extractCommandFromMessage = function (message) {
    return message.split(' ')[0];
};

CommandHelpUtils.prototype.isHelpCommand = function (command) {
    return (command === '..help' || command === '..command' || command === '..commands' || command == 'help');
};

CommandHelpUtils.prototype.isPlayerInfoCommand = function (command) {
    return command === 'showstats';
};

CommandHelpUtils.prototype.isLightInfoCommand = function (command) {
    return command === 'lightinfo';
};

CommandHelpUtils.prototype.isAttackCommand = function (command) {
    return (command === '!a' || command === '..');
};

module.exports = CommandHelpUtils;