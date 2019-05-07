module.exports.config = [[],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    
    var target = Game.getObjectById(creep.memory.target.id);

    //Account for cross room no vision
    if (target == null) return;

    var result = creep.moveTo(target.pos, {range: 1, ignoreCreeps: false, swampCost: 3});
    if (creep.pos.getRangeTo(target.pos) == 1) {
        var links = target.pos.findInRange(FIND_MY_STRUCTURES, 2, {
            filter: { structureType: STRUCTURE_LINK }
        })
        if (links.length != 0) creep.moveTo(links[0].pos, {range: 1, ignoreCreeps: false, swampCost: 3})
    }


    var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: function(obj){
        return (obj.resourceType == RESOURCE_ENERGY)
    }})
    if (droppedEnergy.length != 0) {
        creep.pickup(droppedEnergy[0])
    }

    //console.log (creep.name + " ### " + result)

    if (target.memory.harvester == null) target.memory.harvester = creep.name;

    if (creep.pos.getRangeTo(target.pos) == 1) {
        creep.harvest(target);

        var containers = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })

        if (containers.length != 0) {
            creep.transfer(containers[0], RESOURCE_ENERGY);
            return;
        }
        var links = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
            filter: { structureType: STRUCTURE_LINK }
        })
        if (links.length != 0) {
            creep.transfer(links[0], RESOURCE_ENERGY);
            return;
        }
        else creep.drop(RESOURCE_ENERGY);
    }
}