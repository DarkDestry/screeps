module.exports.config = [[],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    RoadLaying(creep);
    if (creep.totalCarry() != creep.carryCapacity) state_pickup(creep);
    else state_dropoff(creep);
}

function state_dropoff(creep) {
    var target = undefined;
    if (creep.room.storage) target = creep.room.storage;
    else target = creep.room.getLowestStorageSpawn();
    
    if ((target.structureType == STRUCTURE_SPAWN && target.energy == target.energyCapacity) ||
        (target.structureType == STRUCTURE_STORAGE && (target.store[RESOURCE_ENERGY]>600000 || _.sum(target.store) > 950000))){
        var path = PathFinder.search(creep.pos, creep.room.find(FIND_STRUCTURES).map(s => {return{pos:s.pos, range:5}}) , {flee:true} ).path
        creep.moveByPath(path)
    }
    else {
        creep.moveTo(target.pos, {range: 1, ignoreCreeps: false});
    }


    if (creep.pos.getRangeTo(target.pos) == 1) {
        creep.transfer(target, RESOURCE_ENERGY)
    }
    else {
        var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {filter: c => {return (c.memory.role == "eCarry" || c.memory.role == "sCarry") && c.totalCarry() < c.carryCapacity}})
        if (targets && targets[0]) {
            creep.transfer(targets[0], RESOURCE_ENERGY)
        }
    }
}

function state_pickup(creep) {
    
    var range = 2
    var target = Game.getObjectById(creep.memory.target.id);
    if (target.memory.carry == null) target.memory.carry = creep.name;

    //If theres a container nearby, go collect from the container instead
    var containers = target.pos.findInRange(FIND_MY_STRUCTURES,2, {
        filter: { structureType: STRUCTURE_CONTAINER }
    })

    if (containers.length != 0) {
        target = containers[0];
        range = 1
    }
    else {
        var drops = target.pos.findInRange(FIND_DROPPED_RESOURCES,1);
        if (drops.length > 0) {
            target = drops[0];
            range = 1
        }
    }

    creep.moveTo(target.pos, {range: range, ignoreCreeps: false, ignoreRoads: false, swampCost: 2});


    if (creep.pos.getRangeTo(target.pos) == 1) {
        if (target.structureType == STRUCTURE_CONTAINER) creep.withdraw(target, RESOURCE_ENERGY);
        else creep.pickup(target);
    }
}

function RoadLaying(creep) {
    if (creep.room.getTerrain().get(creep.pos.x, creep.pos.y) == TERRAIN_MASK_SWAMP) 
        creep.pos.createConstructionSite(STRUCTURE_ROAD);
}