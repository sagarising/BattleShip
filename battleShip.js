var events = require('events');
var eventEmitter = new events.EventEmitter();
var lib={};
exports.lib = lib;
exports.players = [];
exports.gridCreater = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	};
	this.usedCoordinates = [];
	// this['isUsedSpace'] = function(coordinates){
	// 	var self = this;
	// 	return coordinates.some(function(coordinate){
	// 		return self.usedCoordinates.indexOf(coordinate)!=-1;
	// 	});
	// }
	// Object.defineProperties(this,{'usedCoordinates':{value:[],enumerable:true,writable:true},'isUsedSpace':{value:
	// 	function(coordinates){
	// 		return coordinates.some(function(coordinate){
	// 			return self.usedCoordinates.indexOf(coordinate)!=-1;
	// 		});	
	// 	}
	// }});
};
// var usedCoordinates = [];
// var isUsedSpace = function(coordinates){
// 	return coordinates.some(function(coordinate){
// 		return usedCoordinates.indexOf(coordinate)!=-1;
// 	});
// } 

exports.gridCreater.prototype = {
	isUsedSpace : function(coordinates){
		var self = this;
		return coordinates.some(function(coordinate){
			return self.usedCoordinates.indexOf(coordinate)!=-1;
		});
	}
};

exports.grid = new exports.gridCreater();
// console.log(exports.grid)


function fillArrayWithNull(size,array){
 	var arr = array||[];
	arr.push(null);
	if(arr.length <size)
	fillArrayWithNull(size,arr)
	return arr;
};

exports.Ship = function(size){
	this.coordinates = fillArrayWithNull(size);
	Object.defineProperty(this,'isAlive',{value:true,writable:true})
	
};

var carrier= new exports.Ship(5);
var battleShip= new exports.Ship(4); 
var cruiser= new exports.Ship(3);
var submarine= new exports.Ship(3);
var destroyer= new exports.Ship(2);

exports.Player = function(name){
	this.name = name;
	this.grid = new exports.gridCreater;
	this.ships = [carrier,battleShip,cruiser,submarine,destroyer];
}
lib.isAllowed = function(ship,align,firstPoint,grid){
	// console.log(grid)
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
			// console.log(initialColumnNumber);	
			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode,initialColumnNumber);
			// console.log(tempCoordinates+"hello");
		};
		if(grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		};
		ship.coordinates = tempCoordinates;	
		console.log(tempCoordinates,">>>>>>>>>>>>temp");
		console.log(grid.usedCoordinates,">>>>>>>>>>>>>>>>>used");
						// be careful using tempCoordinates because its reference is given to ship
		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
		console.log(grid.usedCoordinates,">>>>>>>>>>>>>>>>>>>after");
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

lib.hitOrMiss = function(attackPoint) {
	var result = grid.usedCoordinates.indexOf(attackPoint)!==-1 && 'hit' || 'miss';
	return result;
}
