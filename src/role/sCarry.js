module.exports.config = [[],
[CARRY, CARRY,                                          CARRY, CARRY,                                           MOVE, MOVE],
[CARRY, CARRY, CARRY,                                   CARRY, CARRY, CARRY,                                    MOVE, MOVE, MOVE],
[CARRY, CARRY, CARRY, CARRY,                            CARRY, CARRY, CARRY, CARRY,                             MOVE, MOVE, MOVE, MOVE],
[CARRY, CARRY, CARRY, CARRY, CARRY,                     CARRY, CARRY, CARRY, CARRY, CARRY,                      MOVE, MOVE, MOVE, MOVE, MOVE],
[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,       CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
]

module.exports.update = function update(creep) {
    if (!creep.room.memory.sCarry) creep.room.memory.sCarry = creep.name;
    if (creep.memory.pathLoc == undefined || creep.memory.pathLoc == null)  creep.memory.pathLoc = 0;
    if (creep.memory.forward == undefined || creep.memory.forward == null) creep.memory.forward = true;

    //Go to pathLoc
    var path = creep.room.getSCarryPath(); //eCarry Path
    var pathPos = path[creep.memory.pathLoc]; //The position to go to in eCarry Path element

    //advance to next pathLoc 
    if (creep.pos.x == pathPos.x && creep.pos.y == pathPos.y) {
        creep.memory.pathLoc++;
        if (creep.memory.pathLoc == path.length) creep.memory.pathLoc = 0;
    } 

    pathPos = path[creep.memory.pathLoc]; //The position to go to in eCarry Path element
    var nextPos = creep.room.getPositionAt(pathPos.x, pathPos.y) //screeps Pos
    creep.moveTo(nextPos, {range: 0, ignoreCreeps: true, ignoreRoads: false});

    //Check for recycled tombstones
    var tombstones = creep.pos.findInRange(FIND_TOMBSTONES,1);
    tombstones.forEach(element => {
        if(element.store[RESOURCE_ENERGY] > 0) creep.withdraw(element, RESOURCE_ENERGY)
    });


    //Scan around for transfer targets
    var transferTargets = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: function(obj){
        return (obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN || obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_TOWER || obj.structureType == STRUCTURE_LINK);
    }})
    var links = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: {structureType: STRUCTURE_LINK}})
    var linkInRange = links.length > 0
    var target = undefined;
    for (var i in transferTargets) {
        target = transferTargets[i];
        if ((target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN || target.structureType == STRUCTURE_TOWER)  && target.energy < target.energyCapacity) {
            creep.transfer(target, RESOURCE_ENERGY);
        } 
        
        if ((!linkInRange || links[0].energy == 0) && target.structureType == STRUCTURE_STORAGE && target.store[RESOURCE_ENERGY] > 0 && creep.totalCarry() < creep.carryCapacity) {
            creep.withdraw(target, RESOURCE_ENERGY);
            break;
        }

        if ((target.structureType == STRUCTURE_LINK && target.energy > 0)) {
            if (creep.totalCarry() == creep.carryCapacity)
                creep.transfer(creep.room.storage, RESOURCE_ENERGY)
            else{
                creep.withdraw(target, RESOURCE_ENERGY)
            }
            break;
        }
    }

 

}