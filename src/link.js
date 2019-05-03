module.exports.update = function update(link) {
    if (link.pos.getRangeTo(link.room.storage) < 4) return;

    var storageLink = link.room.storage.pos.findInRange(FIND_MY_STRUCTURES, 3, {filter: {structureType: STRUCTURE_LINK}})
    if (storageLink.length == 0) return; 
    storageLink = storageLink[0];
    
    link.transferEnergy(storageLink)
}