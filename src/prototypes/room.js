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

Room.prototype.getBuilderCount = function getBuilderCount() {
    if (!this.memory.builder) {
        this.memory.builder = {};
        return 0;
    }

    var count = 0;
    for(var name in this.memory.builder) {
        if (Game.creeps[name]) count++;
        else this.memory.builder[name] = undefined;
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
            continue;
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

Room.prototype.getECarryPath = function getECarryPath() {
    var spawns = this.find(FIND_MY_SPAWNS);
    var spawn = spawns[0];
    var s = spawn.pos;
    var path = [];
    
    switch (this.controller.level) {
        case 2: 
            path = [
                {x: s.x-1, y: s.y-2 },
                {x: s.x, y: s.y-1 },
                {x: s.x+1, y: s.y-2 }
            ]
            break;
        case 3:
            path = [
                {x: s.x-2, y: s.y-3 },
                {x: s.x-1, y: s.y-2 },
                {x: s.x, y: s.y-1 },
                {x: s.x+1, y: s.y-2 },
                {x: s.x+2, y: s.y-3 }
            ]
            break;
        case 4:
            path = [
                {x: s.x-4, y: s.y-1 },
                {x: s.x-3, y: s.y-2 },
                {x: s.x-2, y: s.y-3 },
                {x: s.x-1, y: s.y-2 },
                {x: s.x, y: s.y-1 },
                {x: s.x+1, y: s.y-2 },
                {x: s.x+2, y: s.y-3 },
                {x: s.x+3, y: s.y-2 },
                {x: s.x+4, y: s.y-1 },
            ]
            break;
        case 5:
            path = [
                {x: s.x-5, y: s.y },
                {x: s.x-4, y: s.y-1 },
                {x: s.x-3, y: s.y-2 },
                {x: s.x-2, y: s.y-3 },
                {x: s.x-1, y: s.y-2 },
                {x: s.x, y: s.y-1 },
                {x: s.x+1, y: s.y-2 },
                {x: s.x+2, y: s.y-3 },
                {x: s.x+3, y: s.y-2 },
                {x: s.x+4, y: s.y-1 },
                {x: s.x+5, y: s.y },
            ]
            break;
        case 5:
            path = [
                {x: s.x-4, y: s.y+3 },
                {x: s.x-3, y: s.y+2 },
                {x: s.x-4, y: s.y+1 },
                {x: s.x-5, y: s.y },
                {x: s.x-4, y: s.y-1 },
                {x: s.x-3, y: s.y-2 },
                {x: s.x-2, y: s.y-3 },
                {x: s.x-1, y: s.y-2 },
                {x: s.x, y: s.y-1 },
                {x: s.x+1, y: s.y-2 },
                {x: s.x+2, y: s.y-3 },
                {x: s.x+3, y: s.y-2 },
                {x: s.x+4, y: s.y-1 },
                {x: s.x+5, y: s.y },
                {x: s.x+4, y: s.y+1 },
                {x: s.x+3, y: s.y+2 },
                {x: s.x+4, y: s.y+3 },
            ]
            break;
    }
    return path;
}

Room.prototype.getConstructionTargets = function getConstructionTargets() {
    var targets = [];
    var constructionSites = this.find(FIND_CONSTRUCTION_SITES);
    for (var i in constructionSites) targets.push(constructionSites[i]);
    var damagedStructures = this.find(FIND_MY_STRUCTURES, {filter: function(obj){
        return (obj.hits < obj.hitsMax/2 && obj.structureType != STRUCTURE_RAMPART) ||
        (obj.hits < 300000 && obj.structureType == STRUCTURE_RAMPART)
    }})
    for (var i in damagedStructures) targets.push(damagedStructures[i]);
    var damagedRoads = this.find(FIND_STRUCTURES, {filter: function(obj){return obj.structureType == STRUCTURE_ROAD && obj.hits < obj.hitsMax/2}})
    for (var i in damagedRoads) targets.push(damagedRoads[i]);
    return targets;
}

Room.prototype.getSCarryPath = function getSCarryPath() {
    var spawns = this.find(FIND_MY_SPAWNS);
    var spawn = spawns[0];
    var s = spawn.pos;
    var path = [
        {x: s.x, y: s.y-1},
        {x: s.x+1, y: s.y},
        {x: s.x+1, y: s.y+1},
        {x: s.x+2, y: s.y+1},
        {x: s.x+3, y: s.y+2},
        {x: s.x+2, y: s.y+3},
        {x: s.x+1, y: s.y+3},
        {x: s.x, y: s.y+3},
        {x: s.x-1, y: s.y+3},
        {x: s.x-2, y: s.y+3},
        {x: s.x-3, y: s.y+2},
        {x: s.x-2, y: s.y+1},
        {x: s.x-1, y: s.y+1},
        {x: s.x-1, y: s.y},
    ]
    return path;
}

Room.prototype.getBaseFrameRampart = function getBaseFrameRampart() {
    var spawns = this.find(FIND_MY_SPAWNS);
    var spawn = spawns[0];
    var s = spawn.pos;

    var frame = [
        {x: s.x-7, y:s.y-5},

        {x: s.x-2, y:s.y-5},
        {x: s.x+2, y:s.y-5},

        {x: s.x+7, y:s.y-5},

        {x: s.x+7, y:s.y  },
        {x: s.x+7, y:s.y+4},

        {x: s.x+7, y:s.y+9},

        {x: s.x+2, y:s.y+9},
        {x: s.x-2, y:s.y+9},

        {x: s.x-7, y:s.y+9},

        {x: s.x-7, y:s.y+4},
        {x: s.x-7, y:s.y},
    ]
    return frame;
}

Room.prototype.getBaseFrameWall = function getBaseFrameWall() {
    var spawns = this.find(FIND_MY_SPAWNS);
    var spawn = spawns[0];
    var s = spawn.pos;

    var frame = [
        //{x: s.x-6, y:s.y-4},

        {x: s.x-6, y:s.y-5},
        {x: s.x-5, y:s.y-5},
        {x: s.x-4, y:s.y-5},
        {x: s.x-3, y:s.y-5},
        //{x: s.x-2, y:s.y-5},
        {x: s.x-1, y:s.y-5},
        {x: s.x  , y:s.y-5},
        {x: s.x+1, y:s.y-5},
        //{x: s.x+2, y:s.y-5},
        {x: s.x+3, y:s.y-5},
        {x: s.x+4, y:s.y-5},
        {x: s.x+5, y:s.y-5},
        {x: s.x+6, y:s.y-5},

        //{x: s.x+6, y:s.y-4},

        {x: s.x+7, y:s.y-4},
        {x: s.x+7, y:s.y-3},
        {x: s.x+7, y:s.y-2},
        {x: s.x+7, y:s.y-1},
        //{x: s.x+7, y:s.y  },
        {x: s.x+7, y:s.y+1},
        {x: s.x+7, y:s.y+2},
        {x: s.x+7, y:s.y+3},
        //{x: s.x+7, y:s.y+4},
        {x: s.x+7, y:s.y+5},
        {x: s.x+7, y:s.y+6},
        {x: s.x+7, y:s.y+7},
        {x: s.x+7, y:s.y+8},

        //{x: s.x+6, y:s.y+8},

        {x: s.x+6, y:s.y+9},
        {x: s.x+5, y:s.y+9},
        {x: s.x+4, y:s.y+9},
        {x: s.x+3, y:s.y+9},
        //{x: s.x+2, y:s.y+9},
        {x: s.x+1, y:s.y+9},
        {x: s.x  , y:s.y+9},
        {x: s.x-1, y:s.y+9},
        //{x: s.x-2, y:s.y+9},
        {x: s.x-3, y:s.y+9},
        {x: s.x-4, y:s.y+9},
        {x: s.x-5, y:s.y+9},
        {x: s.x-6, y:s.y+9},

        //{x: s.x-6, y:s.y+8},

        {x: s.x-7, y:s.y+8},
        {x: s.x-7, y:s.y+7},
        {x: s.x-7, y:s.y+6},
        {x: s.x-7, y:s.y+5},
        //{x: s.x-7, y:s.y+4},
        {x: s.x-7, y:s.y+3},
        {x: s.x-7, y:s.y+2},
        {x: s.x-7, y:s.y+1},
        //{x: s.x-7, y:s.y},
        {x: s.x-7, y:s.y-1},
        {x: s.x-7, y:s.y-2},
        {x: s.x-7, y:s.y-3},
        {x: s.x-7, y:s.y-4},
    ]
    return frame;
}

Room.prototype.drawPath = function drawPath(path) {
    for (var i = 0; i < path.length-1; i++) {
        this.visual.line(path[i], path[i+1]);
    }
}