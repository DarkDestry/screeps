module.exports.config = [[],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
]

module.exports.update = function update(creep) {
    
    var target = Game.getObjectById(creep.memory.target.id);

    creep.moveTo(target.pos, {range: 1, ignoreCreeps: false});

    if (target.memory.harvester == null) target.memory.harvester = creep.name;

    if (creep.pos.getRangeTo(target.pos) == 1) {
        creep.harvest(target);

        var containers = creep.pos.findInRange(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })

        if (containers.length != 0) {
            creep.transfer(containers[0], RESOURCE_ENERGY);
        }
        else creep.drop(RESOURCE_ENERGY);
    }
}