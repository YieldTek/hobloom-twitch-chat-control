class InputValidationUtils {
    static isStringPositiveInteger (input) {
        var number = Math.floor(Number(input));
        return String(number) === input && number > 0;
    }
}

module.exports = InputValidationUtils;