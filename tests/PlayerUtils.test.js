const PlayerUtils = require("../lib/PlayerUtils");
const Player = require("../objects/Player");

var playerUtils = new PlayerUtils();

test("Get HP for player level up", () => {
    var data = {
        'username': 'test_user',
        'max_hp': 100,
        'hp': 100,
        'xp': 0,
        'gold': 0,
        'level': 3,
        'strength': 1,
        'dexterity': 1,
        'items': [],
        'equipped': {}
    };
    var player = new Player(data);
    expect(playerUtils.getHPUpdateForLevel(player)).toBe(60);

    data.level = 5;
    var player = new Player(data);
    expect(playerUtils.getHPUpdateForLevel(player)).toBe(100);

    data.level = 7;
    var player = new Player(data);
    expect(playerUtils.getHPUpdateForLevel(player)).toBe(140);

    data.level = 10;
    var player = new Player(data);
    expect(playerUtils.getHPUpdateForLevel(player)).toBe(200);

});
