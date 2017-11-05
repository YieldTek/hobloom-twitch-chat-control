class NumberUtils {
    static getOrdinalIndicator(number) {
        switch (number) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
}

module.exports = NumberUtils;