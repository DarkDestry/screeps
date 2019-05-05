global.core = [];

global.core.plan = function plan() {
    //Get RCL
    for (var name in Game.rooms) {
        var room = Game.rooms[name];

        if (!room.controller.my) continue;

        var spawns = room.find(FIND_MY_SPAWNS);
        var spawn = spawns[0];
        DrawExtensionPlan(spawn, room);
        ActExtensionPlan(spawn, room);
        DrawRoadPlan(spawn, room);
        ActRoadPlan(spawn, room);
        DrawBaseFrame(spawn, room);
        DrawLinkPlan(spawn, room);
        ActLinkPlan(spawn, room);
    }
}

global.core.getCostMatrix = function getCostMatrix(roomName) {
    let room = Game.rooms[roomName];
    if (!room) return;
    if (global.core.costMatrix[roomName]) return global.core.costMatrix[roomName];
    let costs = new PathFinder.CostMatrix;

    room.find(FIND_STRUCTURES).forEach(function(struct) {
        if (struct.structureType !== STRUCTURE_CONTAINER &&
            struct.structureType !== STRUCTURE_ROAD &&
            (struct.structureType !== STRUCTURE_RAMPART ||
            !struct.my)) {
        // Can't walk through non-walkable buildings
        costs.set(struct.pos.x, struct.pos.y, 0xff);
        }
    });

    // Avoid creeps in the room
    room.find(FIND_CREEPS).forEach(function(creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });

    room.find(FIND_CONSTRUCTION_SITES).forEach(function(cs) {
        if (cs.structureType !== STRUCTURE_CONTAINER &&
            cs.structureType !== STRUCTURE_ROAD &&
            (cs.structureType !== STRUCTURE_RAMPART ||
            !cs.my)) {
                costs.set(cs.pos.x, cs.pos.y, 0xff);
            }
    })

    global.core.costMatrix[roomName] = costs;
    return costs;
}

function DrawLinkPlan(spawn, room) {
    if (!room.storage) return;
    var sources = room.find(FIND_SOURCES) 
    var storage = room.storage;
    var furthestSource = undefined;
    var furthestDistance = 0;

    //Ensure That there is a link at spawn already
    if (storage.pos.findInRange(FIND_MY_STRUCTURES,2,{filter: {structureType: STRUCTURE_LINK}}).length == 0) return;
    
    for (var i in sources) {
        //Disqualify sources with a link nearby
        if (sources[i].pos.findInRange(FIND_MY_STRUCTURES,2,{filter: {structureType: STRUCTURE_LINK}}).length > 0) continue;
        if (sources[i].pos.findInRange(FIND_CONSTRUCTION_SITES,2,{filter: {structureType: STRUCTURE_LINK}}).length > 0) continue;


        var distance = storage.pos.findPathTo(sources[i]).length;
        if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestSource = sources[i];
        }
    }

    if (!furthestSource) return

    var path = furthestSource.pos.findPathTo(storage, {ignoreCreeps: true});

    var pos = path[1];
    var poly = [
        [pos.x + 0.2, pos.y],
        [pos.x, pos.y + 0.4],
        [pos.x - 0.2, pos.y],
        [pos.x, pos.y - 0.4],
        [pos.x + 0.2, pos.y],
    ]
    room.visual.poly(poly,{fill: 'yellow', radius: 0.55, stroke: 'white'});
}

function ActLinkPlan(spawn, room) {
    if (!room.storage) return;
    var sources = room.find(FIND_SOURCES) 
    var storage = room.storage;
    var furthestSource = undefined;
    var furthestDistance = 0;

    //Ensure That there is a link at spawn already
    if (storage.pos.findInRange(FIND_MY_STRUCTURES,2,{filter: {structureType: STRUCTURE_LINK}}).length == 0) return;
    
    for (var i in sources) {
        //Disqualify sources with a link nearby
        if (sources[i].pos.findInRange(FIND_MY_STRUCTURES,2,{filter: {structureType: STRUCTURE_LINK}}).length > 0) continue;
        if (sources[i].pos.findInRange(FIND_CONSTRUCTION_SITES,2,{filter: {structureType: STRUCTURE_LINK}}).length > 0) continue;


        var distance = storage.pos.findPathTo(sources[i]).length;
        if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestSource = sources[i];
        }
    }

    if (!furthestSource) return

    var path = furthestSource.pos.findPathTo(storage, {ignoreCreeps: true});

    var pos = path[1];
    room.createConstructionSite (pos.x, pos.y, STRUCTURE_LINK);
    if (room.getTerrain().get(pos.x+1, pos.y) != TERRAIN_MASK_WALL) room.createConstructionSite(pos.x+1, pos.y,STRUCTURE_ROAD)
    if (room.getTerrain().get(pos.x, pos.y+1) != TERRAIN_MASK_WALL) room.createConstructionSite(pos.x, pos.y+1,STRUCTURE_ROAD)
    if (room.getTerrain().get(pos.x-1, pos.y) != TERRAIN_MASK_WALL) room.createConstructionSite(pos.x-1, pos.y,STRUCTURE_ROAD)
    if (room.getTerrain().get(pos.x, pos.y-1) != TERRAIN_MASK_WALL) room.createConstructionSite(pos.x, pos.y-1,STRUCTURE_ROAD)
}

function DrawBaseFrame(spawn,room) {
    var wall = room.getBaseFrameWall();
    for (var i in wall){
        var structuresAtPoint = room.lookForAt(LOOK_STRUCTURES,wall[i].x,wall[i].y)
        structuresAtPoint = _.filter(structuresAtPoint, o => {return o.structureType == STRUCTURE_WALL})
        if (structuresAtPoint.length == 0) room.visual.circle(wall[i],{fill: 'black', radius: 0.35, stroke: 'white'})
    }
    var rampart = room.getBaseFrameRampart();
    for (var i in rampart){
        var structuresAtPoint = room.lookForAt(LOOK_STRUCTURES,rampart[i].x, rampart[i].y)
        structuresAtPoint = _.filter(structuresAtPoint, o => {return o.structureType == STRUCTURE_RAMPART})
        if (structuresAtPoint.length == 0) room.visual.circle(rampart[i],{fill: 'white', radius: 0.35, stroke: 'black'})
    }
}

function DrawRoadPlan(spawn, room) {
    var eCarryRoad = room.getECarryPath();
    
    for (var i = 0; i < eCarryRoad.length-1; i++) {
        room.visual.line(eCarryRoad[i].x, eCarryRoad[i].y, eCarryRoad[i+1].x, eCarryRoad[i+1].y, {color: 'white'})
    }
    
    var sCarryRoad = room.getSCarryPath();
    
    for (var i = 0; i < sCarryRoad.length-1; i++) {
        room.visual.line(sCarryRoad[i].x, sCarryRoad[i].y, sCarryRoad[i+1].x, sCarryRoad[i+1].y, {color: 'white'})
    }
    
    //source road
    var sources = room.find(FIND_SOURCES);
    for (var name in room.memory.outposts) {if (Game.rooms[name]) Game.rooms[name].find(FIND_SOURCES).forEach(s => {sources.push(s)})}
    for (var i in sources) {
        var source = sources[i];
        var path = PathFinder.search(source.pos, room.getBaseFrameRampart().map(p => {return room.getPositionAt(p.x,p.y)}),{heuristicWeight: 1.5, swampCost: 2}).path;
        room.drawPath(path);
    }
}

function ActRoadPlan(spawn, room) {
    var eCarryRoad = room.getECarryPath();
    
    for (var i in eCarryRoad) {
        var pos = eCarryRoad[i];
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
    }

    if (room.controller.level >= 4){
        var sCarryRoad = room.getSCarryPath();
        
        for (var i in sCarryRoad) {
            var pos = sCarryRoad[i];
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
        }
    }
    
    //source road
    if (room.controller.level >= 5 && room.storage.store[RESOURCE_ENERGY] > 100000) {
        var sources = room.find(FIND_SOURCES);
        for (var name in room.memory.outposts) {if (Game.rooms[name]) Game.rooms[name].find(FIND_SOURCES).forEach(s => {sources.push(s)})}
        for (var i in sources) {
            var source = sources[i];
            var path = PathFinder.search(source.pos, room.getBaseFrameRampart().map(p => {return room.getPositionAt(p.x,p.y)}),{heuristicWeight: 1.5, swampCost: 2}).path;
            for (var i in path) {
                Game.rooms[path[i].roomName].createConstructionSite(path[i], STRUCTURE_ROAD);
            }
        }
    }
}

function ActExtensionPlan(spawn, room) {
    var s = spawn.pos;
    switch (room.controller.level) {
        case 2:
            room.createConstructionSite(s.x+1,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-1,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x,s.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+1,s.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-1,s.y-3,STRUCTURE_EXTENSION);
            break;
        case 3:
            room.createConstructionSite(s.x+2,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-2,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+2,s.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-2,s.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-3,s.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x, s.y+1, STRUCTURE_TOWER);
            break;
        case 4:
            room.createConstructionSite(s.x+3,s.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+2,s.y-4,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-2,s.y-4,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-4,s.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-4,s.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+4,s.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+4,s.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x-3,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+3,s.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x+4,s.y,STRUCTURE_EXTENSION);
            room.createConstructionSite(s.x, s.y+2, STRUCTURE_STORAGE);
            break;
        case 5:
            room.createConstructionSite(s.x+3,s.y,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-3,s.y,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-4,s.y,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-5,s.y-1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+5,s.y-1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-5,s.y-2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+5,s.y-2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-6,s.y,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+6,s.y,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+5,s.y+1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+2,s.y,STRUCTURE_TOWER)
            room.createConstructionSite(s.x,s.y+4, STRUCTURE_LINK)
            //Place Roads
            room.createConstructionSite(s.x-4,s.y+1,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y-1,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y-2,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y-3,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-5,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-4,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-3,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-1,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+1,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+3,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+4,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+5,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y-4,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y-3,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y-2,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y-1,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+4,s.y+1,STRUCTURE_ROAD)

            //place frame
            if(room.storage.store[RESOURCE_ENERGY] > 200000) {
                var walls = room.getBaseFrameWall()
                for(var i in walls) {
                    room.createConstructionSite(walls[i].x, walls[i].y ,STRUCTURE_WALL)
                }
                var ramparts = room.getBaseFrameRampart()
                for(var i in ramparts) {
                    room.createConstructionSite(ramparts[i].x, ramparts[i].y ,STRUCTURE_RAMPART)
                }
            }
            break;
        case 6:
            room.createConstructionSite(s.x+3,s.y+1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-5,s.y+1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-3,s.y+1,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-5,s.y+2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+5,s.y+2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-4,s.y+2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+4,s.y+2,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x-5,s.y+3,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+5,s.y+3,STRUCTURE_EXTENSION)
            room.createConstructionSite(s.x+3,s.y+3,STRUCTURE_EXTENSION)

            room.createConstructionSite(s.x-6,s.y+1,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y+1,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y+2,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y+2,STRUCTURE_ROAD)
            room.createConstructionSite(s.x-6,s.y+3,STRUCTURE_ROAD)
            room.createConstructionSite(s.x+6,s.y+3,STRUCTURE_ROAD)
    }
}

function DrawExtensionPlan(spawn, room) {
    switch (room.controller.level) {
        case 1:
        case 2:
            if (room.getEffectiveLevel() < 2){
                room.visual.circle(spawn.pos.x+1,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-1,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x+1,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-1,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'red'});
            }
        case 3:
            if (room.getEffectiveLevel() < 3){
                room.visual.circle(spawn.pos.x+2,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'green'});
                room.visual.circle(spawn.pos.x-2,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'green'});
                room.visual.circle(spawn.pos.x+2,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'green'});
                room.visual.circle(spawn.pos.x-2,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'green'});
                room.visual.circle(spawn.pos.x-3,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'green'});
            }
        case 4:
            if (room.getEffectiveLevel() < 4){
                room.visual.circle(spawn.pos.x+3,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x+2,spawn.pos.y-4,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x-2,spawn.pos.y-4,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x-4,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x-4,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x+4,spawn.pos.y-3,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x+4,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x-3,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x+3,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
                room.visual.circle(spawn.pos.x+4,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
            }
        case 5:
            if (room.getEffectiveLevel() < 5){
                room.visual.circle(spawn.pos.x+3,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x-3,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x-4,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x-5,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x+5,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x-5,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x+5,spawn.pos.y-2,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x-6,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x+6,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
                room.visual.circle(spawn.pos.x+5,spawn.pos.y+1,{fill: 'transparent', radius: 0.55, stroke: 'blue'});
            }
        case 6:
            if (room.getEffectiveLevel() < 6){
                room.visual.circle(spawn.pos.x+3,spawn.pos.y+1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-5,spawn.pos.y+1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-3,spawn.pos.y+1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-5,spawn.pos.y+2,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x+5,spawn.pos.y+2,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-4,spawn.pos.y+2,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x+4,spawn.pos.y+2,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x-5,spawn.pos.y+3,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x+5,spawn.pos.y+3,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                room.visual.circle(spawn.pos.x+3,spawn.pos.y+3,{fill: 'transparent', radius: 0.55, stroke: 'red'});
            }
    }

}

