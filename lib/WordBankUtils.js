var FileUtils = require('./FileUtils');
var RNGUtils = require('./RNGUtils');

class WordBankUtils {
    static getSentance (callback) {
        FileUtils.getFileContents('./assets/wordbank.txt', function (err, data) {
            if (err) {
                callback(err, null);
            }
            callback(null, WordBankUtils.getRandomSentance(data));
        });
    }

    static getBattleSentance (callback) {
        FileUtils.getFileContents('./assets/battle.txt', function (err, data) {
            if (err) {
                callback(err, null);
            }
            callback(null, WordBankUtils.getRandomSentance(data));
        });
    }

    static getRandomSentance (data) {
        var strings = data.split('\n');
        return strings[RNGUtils.getRandom(0, strings.length - 1)];
    }
}

module.exports = WordBankUtils;