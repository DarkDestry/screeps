/// <reference path="../ScreepsAutocomplete/_references.js" />

require("core");
require("require")
var role = require("role");
var tower = require("tower");

module.exports.loop = function () {
    global.core.plan()
    
    //Clear all cached cost matrices
    global.core.costMatrix = {}

    //Create source memory
    SourceMemory()

    //Deploy creeps
    deploy:
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if (!room.controller.my) continue; //Qualify Rooms for creep deployment

        var sources = room.find(FIND_SOURCES)
        var spawns = room.find(FIND_MY_SPAWNS);
        var effectiveLevel = room.getEffectiveLevel();
        var result = undefined;

        //append to sources all outpost sources
        if (!room.memory.outposts) room.memory.outposts = [];
        for (var i in room.memory.outposts) {
            try {
                if (Game.rooms[room.memory.outposts[i]])
                Game.rooms[room.memory.outposts[i]].find(FIND_SOURCES).forEach(element => {
                    sources.push(element);
                });
            } catch (err) {console.log(err)}
        }

        //eCarry is critical as when there is a storage, all hCarry will dump to storage instead of spawn;
        if (effectiveLevel > 3 && room.storage && (!room.memory.sCarry || !Game.creeps[room.memory.sCarry])) {
            var source = sources[i];
            var spawn = room.getSpawnableSpawn();
            room.memory.sCarry = null;
            if (spawn){
                do {
                    result = spawn.spawnCreep (
                        role.sCarry.config[effectiveLevel--],
                        makeid(5),
                        {memory: {role:"sCarry"}}
                    )
                } while (result != OK && effectiveLevel > 0)
            }
            continue deploy;
        }

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

            //Deploy extension Carrys
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
            
            if (effectiveLevel > 1) {
                var adjacentRooms = room.getAdjacentRooms();
                if (!room.memory.observers) room.memory.observers = {}
                for (var i in adjacentRooms) {
                    var spawnObserver = false;
                    if (room.memory.observers[adjacentRooms[i]]) {
                        var observer = Game.creeps[room.memory.observers[adjacentRooms[i]]]
                        if (!observer) {
                            spawnObserver = true; 
                            room.memory.observers[adjacentRooms[i]] = null
                        }
                        else if (observer.ticksToLive < 100) {
                            spawnObserver = true; 
                            room.memory.observers[adjacentRooms[i]] = null
                        }
                    }
                    else spawnObserver = true;

                    if (spawnObserver) {
                        if (spawn){
                            do {
                                result = spawn.spawnCreep (
                                    role.observe.config[effectiveLevel--],
                                    makeid(5),
                                    {memory: {role:"observe", target: adjacentRooms[i]}}
                                )
                            } while (result != OK && effectiveLevel > 0)
                        }
                        continue deploy;
                    }
                }
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
        } //if Sources Saturated END


        //Tower Logic
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})
        for (var i in towers) {
            try {
                tower.update(towers[i])
            } catch (err) {
                errCache = err;
            }
        }

    } // Room For loop END

    for (creep in Memory.creeps){
        if (!Game.creeps[creep]) Memory.creeps[creep] = undefined;
    }

    var errCache;

    //Creep logic
    for (var name in Game.creeps) {
        try{
            var creep = Game.creeps[name];
            role.update(creep);
        } catch(err) {
            errCache = err;
        }
    }
    if (errCache) throw errCache
    
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