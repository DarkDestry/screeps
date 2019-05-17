module.exports.config = [[],
    [CARRY, CARRY,                                          CARRY, CARRY,                                           MOVE, MOVE],
    [CARRY, CARRY, CARRY,                                   CARRY, CARRY, CARRY,                                    MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY,                            CARRY, CARRY, CARRY, CARRY,                             MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY,                     CARRY, CARRY, CARRY, CARRY, CARRY,                      MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,       CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    if (!creep.room.memory.eCarry) creep.room.memory.eCarry = creep.name;
    if (creep.memory.pathLoc == undefined || creep.memory.pathLoc == null)  creep.memory.pathLoc = 0;
    if (creep.memory.forward == undefined || creep.memory.forward == null) creep.memory.forward = true;

    //Go to pathLoc
    var path = creep.room.getECarryPath(); //eCarry Path
    var pathPos = path[creep.memory.pathLoc]; //The position to go to in eCarry Path element

    //advance to next pathLoc 
    if (creep.pos.x == pathPos.x && creep.pos.y == pathPos.y || creep.totalCarry() == 0) {
        if (creep.memory.forward) {
            creep.memory.pathLoc++;
            if (creep.memory.pathLoc == path.length - 1) creep.memory.forward = false;
        }
        else {
            creep.memory.pathLoc--;
            if (creep.memory.pathLoc == 0) creep.memory.forward = true;
        }
    } 

    var pathPos = path[creep.memory.pathLoc]; //The position to go to in eCarry Path element
    var nextPos = creep.room.getPositionAt(pathPos.x, pathPos.y) //screeps Pos
    creep.moveTo(nextPos, {range: 0, ignoreCreeps: true, ignoreRoads: false});

    var tombstones = creep.pos.findInRange(FIND_TOMBSTONES,1);
    tombstones.forEach(element => {
        if(element.store[RESOURCE_ENERGY] > 0) creep.withdraw(element, RESOURCE_ENERGY)
    });

    //Scan around for pickup targets
    var pickupTargets = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: function(obj){
        return (obj.resourceType == RESOURCE_ENERGY)
    }})
    if (pickupTargets[0] && creep.totalCarry() < creep.carryCapacity) {
        target = pickupTargets[0];
        creep.pickup(target);
        return;
    }

    //Scan around for transfer targets
    var transferTargets = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: function(obj){
        return (obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN);
    }})
    var target = undefined;
    for (var i in transferTargets) {
        target = transferTargets[i];
        if (target.structureType == STRUCTURE_EXTENSION && target.energy < target.energyCapacity) {
            creep.transfer(target, RESOURCE_ENERGY);
        } 
        if (target.structureType == STRUCTURE_SPAWN && target.energy > 0 && creep.totalCarry() < creep.carryCapacity) {
            creep.withdraw(target, RESOURCE_ENERGY);
            break;
        }
    }

 

}