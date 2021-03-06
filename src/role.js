module.exports.harvester = require("role_harvester");
module.exports.hCarry = require("role_hCarry");
module.exports.upgrade = require("role_upgrade");
module.exports.uCarry = require("role_uCarry");
module.exports.build = require("role_build");
module.exports.eCarry = require("role_eCarry");
module.exports.sCarry = require("role_sCarry");
module.exports.observe = require("role_observe");
module.exports.defense = require("role_defense");

module.exports.update = function update(creep){
    //creep.room.visual.text(creep.memory.role, creep.pos, {font:"0.5", stroke: "black", align: "center"})
    creep.say(creep.memory.role)

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
        case "sCarry":
            this.sCarry.update(creep);
            break;
        case "observe":
            this.observe.update(creep);
            break;
        case "defense":
            this.defense.update(creep);
            break;
        
    }
}