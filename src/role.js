module.exports.harvester = require("role_harvester");
module.exports.hCarry = require("role_hCarry");
module.exports.upgrade = require("role_upgrade");
module.exports.uCarry = require("role_uCarry");
module.exports.build = require("role_build");
module.exports.eCarry = require("role_eCarry");

module.exports.update = function update(creep){
    creep.room.visual.text(creep.memory.role, creep.pos, {font:"0.5", stroke: "black", align: "center"})

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
        case "build":
            this.build.update(creep);
            break;
        case "eCarry":
            this.eCarry.update(creep);
            break;
    }
}