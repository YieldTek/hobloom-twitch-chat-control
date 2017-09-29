function CommandHelpUtils() {
    this.command_info = [
        { 'command': 'hunt', 'description': 'Go hunting for a monster!' },
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
        { 'command': 'showstats', 'description': 'Show player information' },
        { 'command': 'help shop',  'description': 'Print shop help' },
        { 'command': 'use \<item name\>', 'description': 'Use an item in your inventory' },
        { 'command': 'showitems', 'description': 'Show items you own' },
        { 'command': 'showgear', 'description': 'Show gear you own' },
        { 'command': 'equip \<gear number\>', 'description': 'Equip Gear From Your Inventory' },
        { 'command': 'se', 'description': 'Show equipped gear' },
        { 'command': 'drop \<gear number\>', 'description': 'Drop Gear From Your Inventory. It will be lost forever' }
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
    // TODO: I believe i can remove anything in above array(show items and gear)
    if (this.isDropCommand(command) || this.isHelpCommand(command) || this.isAttackCommand(command) || this.isShopCommand(command) || this.isShowItemsCommand(command) || this.isUseItemCommand(command) || this.isShowGearCommand(command) || this.isEquipCommand(command)) {
        return true;
    }
    for (var i = 0; i < this.command_info.length; i++) {
        if (this.command_info[i].command === command) {
            return true;
        }
    }
    return false;
};

CommandHelpUtils.prototype.isShopCommand = function (message) {
    return message =='shop';
};

CommandHelpUtils.prototype.extractCommandFromMessage = function (message) {
    return message.split(' ')[0];
};

CommandHelpUtils.prototype.extractSubCommandFromMessage = function (message) {
    return message.split(' ')[1];
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

CommandHelpUtils.prototype.isShopItemListCommand = function (command) {
    return (command.split(' ')[0] === 'shop' && command.split(' ')[1] === 'list');
};

CommandHelpUtils.prototype.isShopBuyItemCommand = function (command) {
    return (command.split(' ')[0] === 'shop' && command.split(' ')[1] === 'buy');
};

CommandHelpUtils.prototype.isShopCommand = function (command) {
    return command === 'shop';
};

CommandHelpUtils.prototype.isShowItemsCommand = function (command) {
    return command === 'showitems';
};

CommandHelpUtils.prototype.isShowGearCommand = function (command) {
    return command === 'showgear';
};

CommandHelpUtils.prototype.isUseItemCommand = function (command) {
    return command === 'use';
};

CommandHelpUtils.prototype.isHuntCommand = function (command) {
    return command === 'hunt';
};

CommandHelpUtils.prototype.isEquipCommand = function (command) {
    return command === 'equip';
};

CommandHelpUtils.prototype.isDropCommand = function (command) {
    return command === 'drop';
};

CommandHelpUtils.prototype.isShowEquippedCommand = function (command) {
    return command === 'se';
};

module.exports = CommandHelpUtils;