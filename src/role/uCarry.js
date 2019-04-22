module.exports.config = [[],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    RoadLaying();

    if (!creep.room.memory.uCarry) creep.room.memory.uCarry = creep.name;

    if (creep.totalCarry() == 0) state_pickup(creep);
    else state_dropoff(creep);
}

function state_dropoff(creep) {
    //Acquire lowest target else go close to upgrader
    var target = creep.room.controller;
    var lowestUpgrader = creep.room.getLowestStorageUpgrader();
    if (lowestUpgrader) target = lowestUpgrader;

    //Goto Target
    var range = 3;
    if (target.name != "controller") range = 1;    
    creep.moveTo(target.pos, {range: 1, ignoreCreeps: false});

    //Transact with target
    if (target.name != "controller") creep.transfer(target, RESOURCE_ENERGY);
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

    
    //goto Target
    creep.moveTo(target.pos, {range: 1, ignoreCreeps: false, ignoreRoads: true});

    
    //Transact with target
    if (target.structureType) creep.withdraw(target, RESOURCE_ENERGY);
    else creep.pickup(target);
}

function RoadLaying() {
    if (creep.room.getTerrain().get(creep.pos.x, creep.pos.y) == TERRAIN_MASK_SWAMP) 
        creep.pos.createConstructionSite(STRUCTURE_ROAD);
}