module.exports.harvester = require("role_harvester");
module.exports.hCarry = require("role_hCarry");

module.exports.update = function update(creep){
    switch (creep.memory.role) {
        case "harvester": 
            this.harvester.update(creep);
            break;
        case "hCarry":
            this.hCarry.update(creep);
            break;
    }
}