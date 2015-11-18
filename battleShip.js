var lib={};
exports.lib=lib;


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

var grid = new lib.gridCreater();

function fillArrayWithNull(size,array){
 	var arr = array||[];
	arr.push(null);
	if(arr.length <size)
	fillArrayWithNull(size,arr)
	return arr;
};



lib.Ship = function(size){
	this.coordinates = fillArrayWithNull(size);
	Object.defineProperty(this,'isAlive',{value:true,writable:true})
};

var carrier= new lib.Ship(5);
var battleShip= new lib.Ship(4); 
var cruiser= new lib.Ship(3);
var submarine= new lib.Ship(3);
var destroyer= new lib.Ship(2);


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

lib.positionShip = function(ship,align,firstPoint,grid){
	
	if(lib.isAllowed(ship,align,firstPoint,grid)){
		var tempCoordinates = [];
		var coordinateToBePushed;
		if(align=='vertical'){
			var initialCharCode = firstPoint.charCodeAt(0);
			for (var key in ship.coordinates){
				coordinateToBePushed = String.fromCharCode(initialCharCode++) + firstPoint.slice(1); 
				tempCoordinates.push(coordinateToBePushed);
			}
		}   //don't put semi-colon here 
		else if(align == 'horizontal'){
			var initialColumnNumber = firstPoint.slice(1);
			for (var key in ship.coordinates){
				coordinateToBePushed = firstPoint[0] + initialColumnNumber++;
				tempCoordinates.push(coordinateToBePushed);
			}
		};
		if(grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		}
		ship.coordinates = tempCoordinates;										// be careful using tempCoordinates because its reference is given to ship
		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
		return;                                   // return to just early exit from the function
	};
	throw new Error('Cannot position ship here.');
};

