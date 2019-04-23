/// <reference path="../ScreepsAutocomplete/_references.js" />

require("core");
require("require")
var role = require("role");

module.exports.loop = function () {
    global.core.plan()

    //Create source memory
    SourceMemory()

    //Deploy creeps
    deploy:
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var sources = room.find(FIND_SOURCES)
        var spawns = room.find(FIND_MY_SPAWNS);
        var effectiveLevel = room.getEffectiveLevel();
        var result = undefined;

        //Deploy Energy Collectors
        for(var i in sources) { //Deploy Carrys if a harvester exist
            var source = sources[i];
            //If Carry is dead
            if (Game.creeps[source.memory.harvester] && (!source.memory.carry || !Game.creeps[source.memory.carry])) {
                source.memory.carry = null;
                var spawn = room.getSpawnableSpawn();
                if (spawn)
                    do {
                        result = spawn.spawnCreep (
                            role.hCarry.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role: "hCarry", target: source}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                continue deploy;
            }
        }

        for(var i in sources) { //Deploy Harvester
            var source = sources[i];
            //If harvester is dead
            if (!source.memory.harvester || !Game.creeps[source.memory.harvester]) {
                source.memory.harvester = null;
                var spawn = room.getSpawnableSpawn();
                if (spawn)
                    do {
                        result = spawn.spawnCreep (
                            role.harvester.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role: "harvester", target: source}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                continue deploy;
            }
        }

        if (room.sourcesSaturated()) {
            //Deploy upgrader carry (No point deploying the upgrader first)
            var spawn = room.getSpawnableSpawn();
            if (!room.memory.uCarry || !Game.creeps[room.memory.uCarry]) {
                room.memory.uCarry = undefined;
                if (spawn)
                    do {
                        result = spawn.spawnCreep (
                            role.uCarry.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role: "uCarry", target: room.controller}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                continue deploy;
            }

            //Deploy upgrader
            if (room.getUpgraderCount() < 2){
                if (spawn)
                    do {
                        result = spawn.spawnCreep (
                            role.upgrade.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role: "upgrade", target: room.controller}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                continue deploy;
            }

            //Deploy builders
            if (room.getConstructionTargets().length/2 > room.getBuilderCount()) {
                if (spawn)
                    do {
                        result = spawn.spawnCreep (
                            role.build.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role: "build"}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                continue deploy
            }

            if (effectiveLevel > 1 && (!room.memory.eCarry || !Game.creeps[room.memory.eCarry])) {
                room.memory.eCarry = null;
                if (spawn){
                    do {
                        result = spawn.spawnCreep (
                            role.eCarry.config[effectiveLevel--],
                            makeid(5),
                            {memory: {role:"eCarry"}}
                        )
                    } while (result != OK && effectiveLevel > 0)
                }
                continue deploy;
            }
        }
    }

    //Creep logic
    for (var name in Game.creeps) {
        try{
            var creep = Game.creeps[name];
            role.update(creep);
        } catch(err) {
            console.log(err.stack)
        }
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
                if (!room.memory.sources[source.id]) room.memory.sources[source.id] = {}
                source.memory = room.memory.sources[source.id]; //Set the shortcut
                if (source.memory == undefined) source.memory = {}
            }
        }
    }
}