var lib = require('./battleShip.js').lib;

var Ship = function(coordinates){
	this.coordinates = coordinates;
	Object.defineProperty(this,'isAlive',{value:1,writable:true})
};

Ship.prototype.checkAndSwitchIsAlive = function(){           
	if(this.coordinates.length == 0)
		this.isAlive = 0;
};

Ship.prototype.if_ship_is_Hit = function(attackPoint){
		this.coordinates = lib.removingHitPointFromExistingCoordinates(this.coordinates,attackPoint);
		this.checkAndSwitchIsAlive();
};


module.exports = Ship;