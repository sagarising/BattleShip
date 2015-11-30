var events = require('events');
var eventEmitter = new events.EventEmitter();
var lib={};
exports.lib = lib;
exports.players = [];
lib.gridCreater = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	};
	Object.defineProperty(this,'usedCoordinates',{value:[],writable:true});
};

lib.gridCreater.prototype = {
	
	isUsedSpace : function(coordinates){
		var self = this;
		return coordinates.some(function(coordinate){
			return self.usedCoordinates.indexOf(coordinate)!=-1;
		});
	}
};

exports.Player = function(name){
	this.name = name;
	this.ships = [new lib.Ship(5,'carrier'),
				 new lib.Ship(4,'battleship'),
				 new lib.Ship(3,'cruiser'),
				 new lib.Ship(3,'submarine'),
				 new lib.Ship(2,'destroyer')];
	this.grid = new lib.gridCreater();
	this.isReady = false;
}

function fillArrayWithNull(size,array){
 	var arr = array||[];
	arr.push(null);
	if(arr.length <size)
	fillArrayWithNull(size,arr)
	return arr;
};

lib.Ship = function(size,shipname){
	this.coordinates = fillArrayWithNull(size);
	this.shipName = shipname;
	Object.defineProperty(this,'isAlive',{value:true,writable:true})
	
};

lib.isAllowed = function(ship,align,firstPoint,grid){
	var rows=['A','B','C','D','E','F','G','H','I','J'];
	var shipsize = ship.coordinates.length;
	if(align == "vertical"){
		var allowedRows = Object.keys(grid).length - (shipsize - 1);
		if(rows.indexOf(firstPoint[0]) < allowedRows)
			return true;
		return false;
	}
	if(align == "horizontal"){
		var allowedColumn = Object.keys(grid).length - (shipsize - 1);
		if(firstPoint.slice(1) <= allowedColumn)
			return true;
		return false;
	}
};

exports.positionShip = function(ship,align,firstPoint,grid){
	if(lib.isAllowed(ship,align,firstPoint,grid)){
		if(align=='vertical'){
			var initialCharCode = firstPoint.charCodeAt(0);
			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode);
		}   //don't put semi-colon here 
		else if(align == 'horizontal'){
			var initialColumnNumber = firstPoint.slice(1);	
			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode,initialColumnNumber);
		};
		if(grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		};
		ship.coordinates = tempCoordinates;										// be careful using tempCoordinates because its reference is given to ship
		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
		return true;                                   // return to just early exit from the function
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

lib.hitOrMiss = function(attackPoint) {
	var result = grid.usedCoordinates.indexOf(attackPoint)!==-1 && 'hit' || 'miss';
	return result;
}
