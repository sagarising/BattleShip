var events = require('events');
var eventEmitter = new events.EventEmitter();
var lib={};
exports.lib = lib;
exports.players = [];

lib.list_of_isAlive_of_each_ship = function(ships){
	return ships.map(function(element){
		return element.isAlive;
	});
};

lib.isHit = function(groupOfCoordinates,attackPoint) {
	return groupOfCoordinates.indexOf(attackPoint) !== -1;
};

lib.removingHitPointFromExistingCoordinates = function(existingCoordinates,hitPoint){    //test
	return existingCoordinates.filter(function(coordinate){
		return coordinate != hitPoint;
	});
};

lib.gameOver = function(){
	return 'Game over';
};

lib.gridCreater = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	};
	this.usedCoordinates = [];
};

lib.gridCreater.prototype = Object.create(eventEmitter);

lib.gridCreater.prototype.isUsedSpace = function(coordinates){
		var self = this;
		return coordinates.some(function(coordinate){
			return self.usedCoordinates.indexOf(coordinate) !== -1;
	});
};

lib.if_it_is_Hit = function(attackPoint,player){
	var isAliveList = lib.list_of_isAlive_of_each_ship(player.ships);
	var usedCoordinates = player.grid.usedCoordinates
	if(lib.isHit(usedCoordinates,attackPoint)){
		usedCoordinates = lib.removingHitPointFromExistingCoordinates(usedCoordinates,attackPoint);
		if(usedCoordinates.length == 0)
			return lib.gameOver();     // i will return empty array if game is over
		else
		player.grid.emit('hit',attackPoint);
	return [1].concat(isAliveList);    // i have to return all 5 ships
	};
	return [0].concat(isAliveList);     // i have to return all 5 ships
};

exports.Player = function(name){
	var self = this;
	this.name = name;
	this.grid = new lib.gridCreater();
	this.ships = [new lib.Ship(5,self),
				 new lib.Ship(4,self),
				 new lib.Ship(3,self),
				 new lib.Ship(3,self),
				 new lib.Ship(2,self)];
	this.isReady = false;
	this.turn = false;
};

function fillArrayWithNull(size,array){
 	var arr = array||[];
	arr.push(null);
	if(arr.length <size)
	fillArrayWithNull(size,arr)
	return arr;
};

lib.checkAndSwitchIsAlive = function(ship){           //test
	if(ship.coordinates.length == 0)
		ship.isAlive = 0;
};

lib.if_ship_is_Hit = function(attackPoint){
	if(lib.isHit(this.coordinates,attackPoint)){
		this.coordinates = lib.removingHitPointFromExistingCoordinates(this.coordinates,attackPoint);
		lib.checkAndSwitchIsAlive(this);
	};
};
exports.Player = function(name){    //test
	var self = this;
	this.name = name;
	this.grid = new lib.gridCreater();
	this.ships = [new lib.Ship(5,self),
				 new lib.Ship(4,self),
				 new lib.Ship(3,self),
				 new lib.Ship(3,self),
				 new lib.Ship(2,self)];
	this.isReady = false;
	this.turn = false;
};
lib.Ship = function(size,player){
	this.coordinates = fillArrayWithNull(size);
	player.grid.on('hit',lib.if_ship_is_Hit.bind(this));
	Object.defineProperty(this,'isAlive',{value:1,writable:true})
	
};





lib.isAllowed = function(ship,align,firstPoint){
	var rows=['A','B','C','D','E','F','G','H','I','J'];
	var shipsize = ship.coordinates.length;
	if(align == "vertical"){
		var allowedRows = 10 - (shipsize - 1);
		if(rows.indexOf(firstPoint[0]) < allowedRows)
			return true;
		return false;
	}
	if(align == "horizontal"){
		var allowedColumn = 10 - (shipsize - 1);
		if(firstPoint.slice(1) <= allowedColumn)
			return true;
		return false;
	}
};

exports.positionShip = function(ship,align,firstPoint,grid){
	if(lib.isAllowed(ship,align,firstPoint)){
		if(align=='vertical'){
			var initialCharCode = firstPoint.charCodeAt(0);
			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode);
		}   //don't put semi-colon here 
		else if(align == 'horizontal'){
			var initialColumnNumber = firstPoint.slice(1);
			// console.log(initialColumnNumber);	
			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode,initialColumnNumber);
			// console.log(tempCoordinates+"hello");
		};
		if(grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		};
		if(grid.usedCoordinates.concat(tempCoordinates).length > 17){
			throw new Error('Ships already placed');
		};

		ship.coordinates = tempCoordinates;
		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
		return;                                   // return to just early exit from the function
	};
	throw new Error('Cannot position ship here.');
};

lib.makesCoordinates = function(ship,firstPoint,initialCharCode,initialColumnNumber){
	var generatedCoordinates = [];
	for (var key in ship.coordinates){
		var coordinateToBePushed = initialCharCode != undefined ? (String.fromCharCode(initialCharCode++) + firstPoint.slice(1))
									: (firstPoint[0] + initialColumnNumber++);
		generatedCoordinates.push(coordinateToBePushed);
	};
	return generatedCoordinates;
};