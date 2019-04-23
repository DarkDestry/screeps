global.core = [];

global.core.plan = function plan() {
    //Get RCL
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        var spawns = room.find(FIND_MY_SPAWNS);
        var spawn = spawns[0];
        DrawPlan(spawn, room)
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
        }
    }
}



function DrawPlan(spawn, room) {
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
    }

}

