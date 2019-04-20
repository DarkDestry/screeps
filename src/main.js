/// <reference path="../ScreepsAutocomplete/_references.js" />

require("core");
var role = require("role");

module.exports.loop = function () {
    global.core.plan()

    //Create source memory
    SourceMemory()

    //Deploy creeps
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        var sources = room.find(FIND_SOURCES)
        var spawns = room.find(FIND_MY_SPAWNS);

        for(var i in sources) {
            var source = sources[i];
            //If harvester is dead
            if (!Game.creeps[source.memory.harvester]) {
                source.memory.harvester = null;
                for (var i in spawns) {
                    var spawn = spawns[i];
                    if (!spawn.spawning) {
                        spawn.spawnCreep(
                            role.harvester.config[room.controller.level],
                            makeid(5),
                            {memory: {role: "harvester", target: source}}
                        )
                        break;
                    }
                }
            }
        }
    }

    //Creep logic
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        role.update(creep);
    }

    //Wipe creep memory
    room.find(FIND_TOMBSTONES).forEach(tombstone => {
        if(tombstone.creep.my) {
            tombstone.creep.memory = null;
        }    
    });

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
                source.memory = room.memory.sources[source.id] = {}; //Create a new empty memory object for this source
                //Now you can do anything you want to do with this source
                //for example you could add a worker counter:
                source.memory.workers = 0;
            }
        }else{ //The memory already exists so lets add a shortcut to the sources its memory
            var sources = room.find(FIND_SOURCES);//Find all sources in the current room
            for(var i in sources){
                var source = sources[i];
                source.memory = room.memory.sources[source.id]; //Set the shortcut
            }
        }
    }
}