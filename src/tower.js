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

    target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s){return s.hits < s.hitsMax-799}});
    if (target) {
        tower.repair(target);
    }
}