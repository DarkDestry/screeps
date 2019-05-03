module.exports.config = [[],
    [CARRY, CARRY, CARRY,                                           MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY,                             MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,                      MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    if (!creep.memory.originRoom) creep.memory.originRoom = creep.room.name;
    //RoadLaying(creep);
    if (creep.totalCarry() != creep.carryCapacity) state_pickup(creep);
    else state_dropoff(creep);
}

function state_dropoff(creep) {
    var target = undefined;

    var originRoom = Game.rooms[creep.memory.originRoom]

    if (originRoom.storage) target = originRoom.storage;
    else target = originRoom.getLowestStorageSpawn();

    //IF SPAWN IS FULL DROP OFF ABOVE SPAWN
    if (target.structureType == STRUCTURE_SPAWN && target.energy == target.energyCapacity) {
        creep.moveTo(originRoom.getPositionAt(target.pos.x, target.pos.y-1), {range: 0, ignoreCreeps: false});
        if (creep.pos.x == target.pos.x && creep.pos.y == target.pos.y - 1) {
            creep.drop(RESOURCE_ENERGY);
        }
        return;
    }
    //IF STORAGE IS FULL DROP OFF AT THE NEAREST JUNCTION
    else if ((target.structureType == STRUCTURE_STORAGE && (target.store[RESOURCE_ENERGY]>600000 || _.sum(target.store) > 950000))){
        var goals = [{pos: originRoom.getPositionAt(target.pos.x, target.pos.y-3), range:0}]
        if (originRoom.controller.level >= 6) {
            goals.push({pos: originRoom.getPositionAt(target.pos.x-3, target.pos.y), range:0});
            goals.push({pos: originRoom.getPositionAt(target.pos.x+3, target.pos.y), range:0});
        }
        if (originRoom.controller.level >= 8) goals.push({pos: originRoom.getPositionAt(target.pos.x, target.pos.y-3), range:0})
        
        var path = PathFinder.search(creep.pos, goals, {roomCallback: global.core.getCostMatrix}).path
        creep.moveByPath(path);
        goals.forEach(g => {
            if (creep.pos.x == g.pos.x && creep.pos.y == g.pos.y) creep.drop(RESOURCE_ENERGY);
        })
        return;
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

    //Account for cross room no vision
    if (target == null) {
        var path = PathFinder.search(creep.pos, creep.room.find(FIND_STRUCTURES).map(s => {return{pos:s.pos, range:5}}) , {flee:true} ).path
        creep.moveByPath(path)
        return;
    }

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