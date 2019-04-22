module.exports.config = [[],
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
]

module.exports.update = function update(creep) {
    if (!creep.room.memory.builder[creep.name]) creep.room.memory.builder[creep.name] = {};

    if (creep.totalCarry() == 0) state_pickup(creep);
    else state_build(creep);
}

function state_build(creep) {
    //Acquire nearest construction site
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    
    //goto Target
    creep.moveTo(target.pos, {range: 3, ignoreCreeps: false, ignoreRoads: true});

    //Build
    creep.build(target)
}

function state_pickup(creep) {
    //acquire pickup target
    var target;
    if (creep.room.storage) {
        target = creep.room.storage;
    }
    else {
        target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function(obj)
            {
                return obj.amount > creep.carryCapacity && obj.resourceType == RESOURCE_ENERGY
            }});
    }

    if (target == null) return;
    
    //goto Target
    creep.moveTo(target.pos, {range: 1, ignoreCreeps: false, ignoreRoads: true});

    
    //Transact with target
    if (target.structureType) creep.withdraw(target, RESOURCE_ENERGY);
    else creep.pickup(target);
}

