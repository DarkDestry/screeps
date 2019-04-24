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
    var tl = room.getPositionAt(spawn.pos.x-6,spawn.pos.y-4)
    var tr = room.getPositionAt(spawn.pos.x+6,spawn.pos.y-4)
    var bl = room.getPositionAt(spawn.pos.x-6,spawn.pos.y+8)
    var br = room.getPositionAt(spawn.pos.x+6,spawn.pos.y+8)

    room.visual.line(tl.x-1, tl.y, bl.x-1, bl.y, {color:"black", stroke:"yellow"})
    room.visual.line(tl.x, tl.y-1, tr.x, tr.y-1, {color:"black", stroke:"yellow"})
    room.visual.line(tr.x+1, tr.y, br.x+1, br.y, {color:"black", stroke:"yellow"})
    room.visual.line(bl.x, bl.y+1, br.x, br.y+1, {color:"black", stroke:"yellow"})

    room.visual.line(tl.x,tl.y,tl.x-1,tl.y,{color:"black", stroke:"yellow"})
    room.visual.line(tl.x,tl.y,tl.x,tl.y-1,{color:"black", stroke:"yellow"})
    room.visual.line(tr.x,tr.y,tr.x+1,tr.y,{color:"black", stroke:"yellow"})
    room.visual.line(tr.x,tr.y,tr.x,tr.y-1,{color:"black", stroke:"yellow"})
    room.visual.line(bl.x,bl.y,bl.x-1,bl.y,{color:"black", stroke:"yellow"})
    room.visual.line(bl.x,bl.y,bl.x,bl.y+1,{color:"black", stroke:"yellow"})
    room.visual.line(br.x,br.y,br.x+1,br.y,{color:"black", stroke:"yellow"})
    room.visual.line(br.x,br.y,br.x,br.y+1,{color:"black", stroke:"yellow"})
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
}

function ActRoadPlan(spawn, room) {
    var eCarryRoad = room.getECarryPath();
    
    for (var i in eCarryRoad) {
        var pos = eCarryRoad[i];
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
    }

    if (room.controller.level == 4){
        var sCarryRoad = room.getSCarryPath();
        
        for (var i in sCarryRoad) {
            var pos = sCarryRoad[i];
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
        }
    }   
}

function ActExtensionPlan(spawn, room) {
    switch (room.controller.level) {
        case 2:
            room.createConstructionSite(spawn.pos.x+1,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-1,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x,spawn.pos.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+1,spawn.pos.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-1,spawn.pos.y-3,STRUCTURE_EXTENSION);
            break;
        case 3:
            room.createConstructionSite(spawn.pos.x+2,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-2,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+2,spawn.pos.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-2,spawn.pos.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-3,spawn.pos.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x, spawn.pos.y+1, STRUCTURE_TOWER);
            break;
        case 4:
            room.createConstructionSite(spawn.pos.x+3,spawn.pos.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+2,spawn.pos.y-4,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-2,spawn.pos.y-4,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-4,spawn.pos.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-4,spawn.pos.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+4,spawn.pos.y-3,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+4,spawn.pos.y-2,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x-3,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+3,spawn.pos.y-1,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x+4,spawn.pos.y,STRUCTURE_EXTENSION);
            room.createConstructionSite(spawn.pos.x, spawn.pos.y+2, STRUCTURE_STORAGE);
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

