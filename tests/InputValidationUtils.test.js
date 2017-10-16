const InputValidationUtils = require("../lib/InputValidationUtils");

test("Validate input is positive integer", () => {
    var input = '1';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(true);
    input = '12';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(true);
    input = '9999999';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(true);
    input = '12a';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(false);
    input = 'abc';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(false);
    input = '-10';
    expect(InputValidationUtils.isStringPositiveInteger(input)).toBe(false);

});
