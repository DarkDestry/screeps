module.exports.harvester = require("role_harvester");
module.exports.hCarry = require("role_hCarry");
module.exports.upgrade = require("role_upgrade");
module.exports.uCarry = require("role_uCarry");

module.exports.update = function update(creep){
    switch (creep.memory.role) {
        case "harvester": 
            this.harvester.update(creep);
            break;
        case "hCarry":
            this.hCarry.update(creep);
            break;
        case "upgrade":
            this.upgrade.update(creep);
            break;
        case "uCarry":
            this.uCarry.update(creep);
            break;

    }
}