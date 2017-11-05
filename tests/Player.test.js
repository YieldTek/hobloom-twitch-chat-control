const Player = require("../objects/Player");
const PlayerUtils = require('../lib/PlayerUtils');
const Axe = require('../objects/gear/weapon/normal/Axe');

test("Get XP to player level up", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    expect(player.getXpToLevel()).toBe(100);

    player.level = 2;
    expect(player.getXpToLevel()).toBe(150);

    player.level = 5;
    expect(player.getXpToLevel()).toBe(505);

    player.level = 20;
    expect(player.getXpToLevel()).toBe(220753);
});

test("Get HP with HP below 0", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    expect(player.getHP()).toBe(100);
    player.hp = -100;
    expect(player.getHP()).toBe(0);
});

test("Get HP for level", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    expect(player.getHPUpdateForLevel()).toBe(100);

    player.level = 2;
    expect(player.getHPUpdateForLevel()).toBe(200);

    player.level = 5;
    expect(player.getHPUpdateForLevel()).toBe(500);

    player.level = 20;
    expect(player.getHPUpdateForLevel()).toBe(2000);

    player.level = 50;
    expect(player.getHPUpdateForLevel()).toBe(5000);
});

test("Equip weapon without previous weapon in slot", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    player.addGear(axe);
    player.equipGear(1);
    expect(player.equipped.WEAPON).toBe(axe);
});

test("Equip weapon without previous weapon in slot with no gear array on player(legacy player)", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    player.gear = null;
    player.addGear(axe);
    player.equipGear(1);
    expect(player.equipped.WEAPON).toBe(axe);

    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    delete player.gear;
    player.addGear(axe);
    player.equipGear(1);
    expect(player.equipped.WEAPON).toBe(axe);
});

test("Equip weapon with previous weapon in slot", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    var axe2 = new Axe();
    player.addGear(axe);
    player.addGear(axe2);
    player.equipGear(1);
    expect(player.equipped.WEAPON).toBe(axe);
    player.equipGear(1);
    expect(player.equipped.WEAPON).toBe(axe2);
    expect(player.gear.length).toBe(1);
    expect(player.gear[0]).toBe(axe);

    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    var axe2 = new Axe();
    var axe3 = new Axe();
    var axe4 = new Axe();
    player.addGear(axe);
    player.addGear(axe2);
    player.addGear(axe3);
    player.addGear(axe4);
    player.equipGear(3);
    expect(player.equipped.WEAPON).toBe(axe3);
    expect(player.gear.length).toBe(3);
    player.equipGear(1);
    expect(player.gear.length).toBe(3);
    expect(player.equipped.WEAPON).toBe(axe);
    expect(player.gear[0]).toBe(axe3);
    expect(player.gear[1]).toBe(axe2);
    expect(player.gear[2]).toBe(axe4);
});

test("Drop weapons", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    var axe2 = new Axe();
    var axe3 = new Axe();
    var axe4 = new Axe();
    player.gear = null;
    player.addGear(axe);
    player.addGear(axe2);
    player.addGear(axe3);
    player.addGear(axe4);
    expect(player.gear.length).toBe(4);
    player.dropGear(2);
    expect(player.gear.length).toBe(3);
    expect(player.gear[0]).toBe(axe);
    expect(player.gear[1]).toBe(axe3);
    expect(player.gear[2]).toBe(axe4);
    player.dropGear(1);
    expect(player.gear.length).toBe(2);
    expect(player.gear[0]).toBe(axe3);
    expect(player.gear[1]).toBe(axe4);
    player.dropGear(2);
    expect(player.gear.length).toBe(1);
    expect(player.gear[0]).toBe(axe3);
    player.dropGear(1);
    expect(player.gear.length).toBe(0);
});

test("Gear equip HP change", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    axe.hp_bonus = 10;
    player.handleGearEquipHPChange(axe);
    expect(player.hp).toBe(90);
});

test("Gear equip HP change", () => {
    var player = PlayerUtils.getNewPlayerObject('tester');
    var axe = new Axe();
    axe.hp_bonus = 0;
    player.handleGearEquipHPChange(axe);
    expect(player.hp).toBe(100);
});