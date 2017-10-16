class RNGUtils {
    static getRandom (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = RNGUtils;