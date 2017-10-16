const RNGUtils = require("../lib/RNGUtils");

test("Random number is less than max, and greater than or equal to min", () => {
  var min = -1000;
  var max = 1000;

  for (var i = 0; i < 50; i++) {
      expect(RNGUtils.getRandom(min, max)).toBeGreaterThanOrEqual(min);
      expect(RNGUtils.getRandom(min, max)).toBeLessThan(max);
  }
});
