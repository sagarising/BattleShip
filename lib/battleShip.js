var lib={};
exports.lib = lib;
lib.player = require('./player');
lib.grid = require('./grid');

lib.isHit = function(groupOfCoordinates,attackPoint) {
	return groupOfCoordinates.indexOf(attackPoint) !== -1;
};

lib.removingHitPointFromExistingCoordinates = function(existingCoordinates,hitPoint){
	return existingCoordinates.filter(function(coordinate){
		return coordinate != hitPoint;
	});
};
