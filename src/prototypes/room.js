Room.prototype.getSpawns = function() {
    return this.find(FIND_MY_SPAWNS);
}

Room.prototype.getSpawnableSpawn = function() {
    var spawns = this.find(FIND_MY_SPAWNS);

    for (var i in spawns) {
        if (!spawns[i].spawning) return spawns[i];
    }
}

Room.prototype.getLowestStorageSpawn = function() {
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