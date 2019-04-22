/// <reference path="../ScreepsAutocomplete/_references.js" />

require("core");
require("require")
var role = require("role");

module.exports.loop = function () {
    global.core.plan()

    //Create source memory
    SourceMemory()

    //Deploy creeps
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var sources = room.find(FIND_SOURCES)
        var spawns = room.find(FIND_MY_SPAWNS);
        var effectiveLevel = room.getEffectiveLevel();

        //Deploy Energy Collectors
        for(var i in sources) {
            var source = sources[i];
            //If Carry is dead
            if (Game.creeps[source.memory.harvester] && (!source.memory.carry || !Game.creeps[source.memory.carry])) {
                source.memory.carry = null;
                var spawn = room.getSpawnableSpawn();
                if (spawn)
                    spawn.spawnCreep(
                        role.hCarry.config[effectiveLevel],
                        makeid(5),
                        {memory: {role: "hCarry", target: source}}
                    )
            }
            //If harvester is dead
            if (!source.memory.harvester || !Game.creeps[source.memory.harvester]) {
                source.memory.harvester = null;
                var spawn = room.getSpawnableSpawn();
                if (spawn)
                    spawn.spawnCreep(
                        role.harvester.config[effectiveLevel],
                        makeid(5),
                        {memory: {role: "harvester", target: source}}
                    )
            }
        }

        //Deploy upgrader
        if (room.sourcesSaturated()) {
            var spawn = room.getSpawnableSpawn();
            if (!room.memory.uCarry || !Game.creeps[room.memory.uCarry]) {
                if (spawn)
                spawn.spawnCreep(
                    role.uCarry.config[effectiveLevel],
                    makeid(5),
                    {memory: {role: "uCarry", target: room.controller}}
                )
            }

            if (room.getUpgraderCount() < 2 && spawn)
                spawn.spawnCreep(
                    role.upgrade.config[effectiveLevel],
                    makeid(5),
                    {memory: {role: "upgrade", target: room.controller}}
                )
        }
    }

    //Creep logic
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        role.update(creep);
    }

    for (creep in Memory.creeps){
        if (!Game.creeps[creep]) Memory.creeps[creep] = undefined;
    }

}

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function SourceMemory() {
    //Lets first add a shortcut prototype to the sources memory:
    Source.prototype.memory = undefined;

    for(var roomName in Game.rooms){//Loop through all rooms your creeps/structures are in
        var room = Game.rooms[roomName];
        if(room.memory.sources == null){//If this room has no sources memory yet
            room.memory.sources = {}; //Add it
            var sources = room.find(FIND_SOURCES);//Find all sources in the current room
            for(var i in sources){
                var source = sources[i];
                room.memory.sources[source.id] = {}; //Create a new empty memory object for this source
                source.memory = room.memory.sources[source.id];
                //Now you can do anything you want to do with this source
                //for example you could add a worker counter:
                source.memory.workers = 0;
            }
        }else{ //The memory already exists so lets add a shortcut to the sources its memory
            var sources = room.find(FIND_SOURCES);//Find all sources in the current room
            for(var i in sources){
                var source = sources[i];
                source.memory = room.memory.sources[source.id]; //Set the shortcut
                if (source.memory == undefined) source.memory = {}
            }
        }
    }
}