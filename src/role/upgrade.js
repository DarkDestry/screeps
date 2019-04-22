module.exports.config = [[],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
]

module.exports.update = function update(creep) {
    
    var target = Game.getObjectById(creep.memory.target.id);

    creep.moveTo(target.pos, {range: 1, ignoreCreeps: false});

    if (!creep.room.memory.upgrader[creep.name]) creep.room.memory.upgrader[creep.name] = {};

    creep.upgradeController(target);
    
}