var command_info = [
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

class CommandHelpUtils {
    static getHelpInfo () {
        var message = '';
        for (var i = 0; i < command_info.length; i++) {
            message += 'ItsBoshyTime ' + command_info[i].command + ' - ' + command_info[i].description + ' ';
            if (i == command_info.length - 1) {
                message += 'ItsBoshyTime';
            }
        }
        return message;
    }
    static verifyCommand(command) {
        // TODO: I believe i can remove anything in above array(show items and gear)
        if (this.isDropCommand(command) || this.isHelpCommand(command) || this.isAttackCommand(command) || this.isShopCommand(command) || this.isShowItemsCommand(command) || this.isUseItemCommand(command) || this.isShowGearCommand(command) || this.isEquipCommand(command)) {
            return true;
        }
        for (var i = 0; i < command_info.length; i++) {
            if (command_info[i].command === command) {
                return true;
            }
        }
        return false;
    }
    static isShopCommand(message) {
        return message == 'shop';
    }
    static extractCommandFromMessage(message) {
        return message.split(' ')[0];
    }
    static extractSubCommandFromMessage(message) {
        return message.split(' ')[1];
    }
    static isNonVoteCommand(command) {
        return (this.isShopCommand(command.split(' ')[0]) && !this.isShopItemListCommand(command)) || this.isShopBuyItemCommand(command) && this.isShowItemsCommand(command.split(' ')[0]);
    }

    static isHelpCommand(command) {
        return (command === '..help' || command === '..command' || command === '..commands' || command == 'help');
    }

    static isPlayerInfoCommand(command) {
        return command === 'showstats';
    }

    static isLightInfoCommand(command) {
        return command === 'lightinfo';
    }

    static isAttackCommand(command) {
        return (command === '!a' || command === '..');
    }

    static isShopItemListCommand(command) {
        return (command.split(' ')[0] === 'shop' && command.split(' ')[1] === 'list');
    }

    static isShopBuyItemCommand(command) {
        return (command.split(' ')[0] === 'shop' && command.split(' ')[1] === 'buy');
    }

    static isShopCommand(command) {
        return command === 'shop';
    }

    static isShowItemsCommand(command) {
        return command === 'showitems';
    }

    static isShowGearCommand(command) {
        return command === 'showgear';
    }

    static isUseItemCommand(command) {
        return command === 'use';
    }

    static isHuntCommand(command) {
        return command === 'hunt';
    }

    static isEquipCommand(command) {
        return command === 'equip';
    }

    static isDropCommand(command) {
        return command === 'drop';
    }

    static isShowEquippedCommand(command) {
        return command === 'se';
    }
}

module.exports = CommandHelpUtils;