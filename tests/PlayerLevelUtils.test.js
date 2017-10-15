const PlayerLevelUtils = require("../lib/PlayerLevelUtils");

var playerLevelUtils = new PlayerLevelUtils();

test("Get XP for player to level up", () => {
    expect(playerLevelUtils.getXpToLevel(2)).toBe(26);
    expect(playerLevelUtils.getXpToLevel(3)).toBe(65);
    expect(playerLevelUtils.getXpToLevel(5)).toBe(406);
    expect(playerLevelUtils.getXpToLevel(10)).toBe(29708);
    expect(playerLevelUtils.getXpToLevel(15)).toBe(1527910);
    expect(playerLevelUtils.getXpToLevel(17)).toBe(6738085);
    expect(playerLevelUtils.getXpToLevel(20)).toBe(53904686);
    expect(playerLevelUtils.getXpToLevel(22)).toBe(194595916);

});
