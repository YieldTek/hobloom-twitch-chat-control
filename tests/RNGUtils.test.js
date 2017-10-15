const RNGUtils = require("../lib/RNGUtils.js");

test("Random number is less than max, and greater than or equal to min", () => {
  var min = -1000;
  var max = 1000;

  // See expect methods here: https://facebook.github.io/jest/docs/en/expect.html#content
  expect(new RNGUtils().getRandom(min, max)).toBeGreaterThanOrEqual(min);
  expect(new RNGUtils().getRandom(min, max)).toBeLessThan(max);
});
