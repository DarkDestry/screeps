module.exports.harvester = require("role_harvester");

module.exports.update = function(creep){
    switch (creep.memory.role) {
        case "harvester": 
            this.harvester.update(creep)
    }
}