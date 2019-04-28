module.exports.config = [[],
    [MOVE]
]

module.exports.update = function update(creep){

    if (!creep.memory.originRoom) creep.memory.originRoom = creep.room.name;
    if (!Game.rooms[creep.memory.originRoom].memory.observers[creep.memory.target]) Game.rooms[creep.memory.originRoom].memory.observers[creep.memory.target] = creep.name;


    var path = PathFinder.search(creep.pos, {pos: new RoomPosition(25,25,creep.memory.target), range: 22}, {roomCallback: global.core.getCostMatrix}).path
    creep.moveByPath(path)

    if (creep.room.name == creep.memory.target) {

        if (creep.room.controller && creep.room.find(FIND_HOSTILE_STRUCTURES).length == 0)
            Game.rooms[creep.memory.originRoom].memory.outposts.push(creep.room.name)
    }
}