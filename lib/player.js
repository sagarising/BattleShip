var Player = function(name){
	this.name = name;
	this.grid = new lib.gridCreater();
	this.ships = [new lib.Ship(5),
				 new lib.Ship(4),
				 new lib.Ship(3),
				 new lib.Ship(3),
				 new lib.Ship(2)];
	this.misses = [];
	this.hits = [];
	this.isAlive = true;
	this.isReady = false;
	this.turn = false;
};
var isShipSunk = function(shipStatus){
	return (!shipStatus);
};

Player.prototype={
	list_of_isAlive_of_each_ship : function(){
		return this.ships.map(function(element){
			return element.isAlive;
		});
	},

	if_all_ship_sunk : function(){
		var check_if_all_ship_sunk = (this.list_of_isAlive_of_each_ship()).every(isShipSunk);
		if(check_if_all_ship_sunk)
			this.isAlive = false;
	},

	if_it_is_Hit : function(attackPoint){
		if(lib.isHit(this.grid.usedCoordinates,attackPoint)){
			this.grid.usedCoordinates = lib.removingHitPointFromExistingCoordinates(this.grid.usedCoordinates,attackPoint);
			this.grid.destroyed.push(attackPoint);
			this.ships.forEach(function(ship){
				ship.if_ship_is_Hit(attackPoint);
			});
			this.if_all_ship_sunk();
			return 1;
		};
		return 0;    
	}
};

module.exports=Player;
