global.core = [];

global.core.plan = function plan() {
    //Get RCL
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        var spawns = room.find(FIND_MY_SPAWNS);
        var spawn = spawns[0];
        DrawExtensionPlan(spawn, room);
        ActExtensionPlan(spawn, room);
        DrawRoadPlan(spawn, room);
        ActRoadPlan(spawn, room);
        DrawBaseFrame(spawn, room);
    }
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
    for (var i in sources) {
        var source = sources[i];
        var path = PathFinder.search(source.pos, room.getBaseFrameRampart().map(p => {return room.getPositionAt(p.x,p.y)}),{heuristicWeight: 1.5}).path;
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
        for (var i in sources) {
            var source = sources[i];
            var path = PathFinder.search(source.pos, room.getBaseFrameRampart().map(p => {return room.getPositionAt(p.x,p.y)}),{heuristicWeight: 1.5}).path;
            for (var i in path) {
                room.createConstructionSite(path[i], STRUCTURE_ROAD);
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

            //Place harvester roads

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
    }

}

