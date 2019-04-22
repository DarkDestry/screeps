Room.prototype.getSpawns = function getSpawns() {
    return this.find(FIND_MY_SPAWNS);
}

Room.prototype.getSpawnableSpawn = function getSpawnableSpawn() {
    var spawns = this.find(FIND_MY_SPAWNS);

    for (var i in spawns) {
        if (!spawns[i].spawning) return spawns[i];
    }
}

Room.prototype.getLowestStorageSpawn = function getLowestStorageSpawn() {
    var spawns = this.find(FIND_MY_SPAWNS);

    var max = 99999;
    var currSpawn = undefined;

    for (var i in spawns) {
        var spawn = spawns[i]
        if (spawn.energy < max) {
            currSpawn = spawn;
            max = spawn.energy;
        }
    }

    return currSpawn;
}

Room.prototype.getUpgraderCount = function getUpgraderCount() {
    if (!this.memory.upgrader) {
        this.memory.upgrader = {};
        return 0;
    }

    var count = 0;
    for(var name in this.memory.upgrader) {
        if (Game.creeps[name]) count++;
        else this.memory.upgrader[name] = undefined;
    }

    return count;
}

Room.prototype.getLowestStorageUpgrader = function getLowestStorageUpgrader() {
    var max = 99999;
    var currUpgrader = undefined;

    for (var name in this.memory.upgrader) {
        var upgrader = Game.creeps[name];
        if (!upgrader) {
            this.memory.upgrader[name] = undefined;
        }
        if (upgrader.totalCarry() < upgrader.carryCapacity/2) {
            max = upgrader.totalCarry();
            currUpgrader = upgrader;
        }
    }
    
    return currUpgrader;
}

Room.prototype.sourcesSaturated = function sourcesSaturated() {
    var sources = this.find(FIND_SOURCES);

    var ret = true;
    for (var i in sources) {
        var source = sources[i];
        if (!Game.creeps[source.memory.harvester]) ret = false;
    }

    return ret;
}

Room.prototype.getEffectiveLevel = function getEffectiveLevel() {
    var extensions = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})
    
    var extensionCapacity = 50;
    if (this.controller.level == 7) extensionCapacity = 100
    else if (this.controller.level == 8) extensionCapacity = 200

    var spawnPower = extensions.length * extensionCapacity
    if (spawnPower < 250) return 1;
    if (spawnPower < 500) return 2;
    if (spawnPower < 1000) return 3;
    if (spawnPower < 1500) return 4;
    if (spawnPower < 2000) return 5;
    
    var spawns = this.getSpawns();
    if (spawnPower < 5000 || spawns.length < 2) return 6;
    if (spawnPower < 12000 || spawns.length < 3) return 7;
    return 8;

}