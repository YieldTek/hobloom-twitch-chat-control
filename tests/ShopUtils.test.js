const ShopUtils = require("../lib/ShopUtils");

test("Player can afford item", () => {
    expect(ShopUtils.playerCanAffordItem(50, 100)).toBe(true);
});

test("Player can't afford item", () => {
    expect(ShopUtils.playerCanAffordItem(50, 10)).toBe(false);
});