var command_info = [
    { 'command': 'showstats', 'description': 'Show player information' },
    { 'command': 'help vote', 'description': 'Show information on voting system' },
    { 'command': 'help shop', 'description': 'Show information on shop system' },
    { 'command': 'drop \<gear number\>', 'description': 'Drop Gear From Your Inventory. It will be lost forever' },
    { 'command': 'drop all', 'description': 'Drop all gear!' },
    { 'command': 'equip \<gear number\>', 'description': 'Equip Gear From Your Inventory' },
    { 'command': 'se', 'description': 'Show equipped gear' }
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
        if (this.isDropCommand(command) || this.isHelpCommand(command) || this.isAttackCommand(command) || this.isShopCommand(command) || this.isShowItemsCommand(command) || this.isUseItemCommand(command) || this.isShowGearCommand(command) || this.isEquipCommand(command) || this.isVoteCommand(command)) {
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

    static isHelpCommand(command) {
        return (command === '..help' || command === '..command' || command === '..commands' || command == 'help');
    }

    static isPlayerInfoCommand(command) {
        return command === 'showstats';
    }

    static isAttackCommand(command) {
        return (command === '!a' || command === '..');
    }

    static isShopItemListCommand(command) {
        return (command.split(' ')[0] === 'shop' && command.split(' ')[1] === 'list');
    }

    static getVoteHelpMessage(vote_cost_gold) {
        return 'Voting costs ' + vote_cost_gold + ' gold. You can cast your vote to turn turn on or off the circulating and exhaust fans.  To vote type "vote" in chat followed by one of the following commands: ("turnonfan"/"turnonfan" - Turn the circulating fan on/off) ("turnonexhaust"/"turnoffehxhaust" - Turn the exhaust fan on or off).  The bot will count all votes every minute and make the appropriate change for whatever command wins! bleedPurple Example: "vote turnofffan" - This would cast one vote to turn off the circulating fan bleedPurple';
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

    static isEquipCommand(command) {
        return command === 'equip';
    }

    static isDropCommand(command) {
        return command === 'drop';
    }

    static isShowEquippedCommand(command) {
        return command === 'se';
    }

    static isVoteHelpSubCommand(command) {
        return command.toLowerCase().trim() === 'vote';
    }

    static isShopHelpSubCommand(command) {
        return command.toLowerCase().trim() === 'shop';
    }

    static isVoteCommand(command) {
        return command.toLowerCase().trim() === 'vote';
    }

    static isValidVoteSubCommand(command) {
        var command = command.toLowerCase();
        var valid_commands = [
            'turnonfan',
            'turnofffan',
            'turnonexhaust',
            'turnoffexhaust',
        ];
        return valid_commands.indexOf(command) != -1;
    }
}

module.exports = CommandHelpUtils;