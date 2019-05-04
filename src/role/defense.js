module.exports.config = [[],
    [TOUGH, ATTACK, MOVE, MOVE],
    [TOUGH, ATTACK, MOVE, MOVE],
    [TOUGH, ATTACK, MOVE, MOVE],
    [TOUGH, TOUGH, ATTACK, MOVE, MOVE, MOVE],
    [TOUGH, TOUGH, RANGED_ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
    [TOUGH, TOUGH, RANGED_ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    if (!creep.memory.originroom) creep.memory.originroom = creep.room.name;
    if (!Game.rooms[creep.memory.originroom].memory.defender) Game.rooms[creep.memory.originroom].memory.defender = creep.name;

    var targets = Game.rooms[creep.memory.originroom].findHostileCreeps();

    if (targets.length > 0) {
        creep.moveTo(targets[0],{range: 1})
        if (creep.pos.getRangeTo(targets[0]) == 1) creep.attack(targets[0]);
        else creep.rangedAttack(targets[0])
    }
    else {
        var spawn = Game.rooms[creep.memory.originroom].getSpawns()[0]
        creep.moveTo(spawn);
        spawn.recycleCreep(creep);
    }

}