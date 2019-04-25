module.exports.update = function update(tower) {
    var target
    
    target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        tower.attack(target);
        return;
    }

    target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c){return c.hits < c.hitsMax}});
    if (target) {
        tower.heal(target);
        return;
    }

    target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function(s){return s.hits < s.hitsMax-799 && s.structureType != STRUCTURE_RAMPART}});
    if (target) {
        tower.repair(target);
        return;
    }
    
    target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s){ return s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax-799}});
    if (target) {
        tower.repair(target);
        return;
    }

    target = tower.room.find(FIND_MY_STRUCTURES, {filter: function(s){ return s.structureType == STRUCTURE_RAMPART && s.hits < 500000}});
    if(target){
        target = _.sortBy(target, t => {return t.hits});
        if (target[0]) {
            tower.repair(target[0]);
            return;
        }
    }

    target = tower.room.find(FIND_STRUCTURES, {filter: function(s){ return s.structureType == STRUCTURE_WALL && s.hits < 300000}});
    if(target){
        target = _.sortBy(target, t => {return t.hits});
        if (target[0]) {
            tower.repair(target[0]);
            return;
        }
    }

    target = tower.room.find(FIND_MY_STRUCTURES, {filter: function(s){ return s.structureType == STRUCTURE_RAMPART}});
    if(target){
        target = _.sortBy(target, t => {return t.hits});
        if (target[0]) {
            tower.repair(target[0]);
            return;
        }
    }

    target = tower.room.find(FIND_STRUCTURES, {filter: function(s){ return s.structureType == STRUCTURE_WALL}});
    if(target){
        target = _.sortBy(target, t => {return t.hits});
        if (target[0]) {
            tower.repair(target[0]);
            return;
        }
    }
}