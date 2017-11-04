var config = require('config');

class ChatUtils {
    static sayInChat(client, message) {
        client.say(config.get('channel'), message);
    }

    static clearChat(client) {
        client.clear(config.get('channel'));
    }
}

module.exports = ChatUtils;