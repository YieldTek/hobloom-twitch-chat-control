var config = require('config');

class ChatUtils {
    static sayInChat (client, message) {
        client.say(config.get('channel'), message);
    }
}

module.exports = ChatUtils;