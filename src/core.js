global.core = [];

global.core.plan = function() {
    //Get RCL
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        switch (room.controller.level) {
            case 2:
                var spawns = room.find(FIND_MY_SPAWNS);
                for (var i = 0; i < spawns.length; i++) {
                    var spawn = spawns[i];
                    room.visual.circle(spawn.pos.x+2,spawn.pos.y,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                    room.visual.circle(spawn.pos.x+1,spawn.pos.y+1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                    room.visual.circle(spawn.pos.x+1,spawn.pos.y-1,{fill: 'transparent', radius: 0.55, stroke: 'red'});
                }
                break;
        }
    }
}

