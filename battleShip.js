var lib={};
exports.lib = lib;


lib.isHit = function(groupOfCoordinates,attackPoint) {
	return groupOfCoordinates.indexOf(attackPoint) !== -1;
};

lib.removingHitPointFromExistingCoordinates = function(existingCoordinates,hitPoint){    
	return existingCoordinates.filter(function(coordinate){
		return coordinate != hitPoint;
	});
};

lib.gridCreater = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	};
	this.usedCoordinates = [];
	this.destroyed = [];
};

lib.gridCreater.prototype.isUsedSpace = function(coordinates){
		var self = this;
		return coordinates.some(function(coordinate){
			return self.usedCoordinates.indexOf(coordinate) !== -1;
	});
};






// function fillArrayWithNull(size,array){
//  	var arr = array||[];
// 	arr.push(null);
// 	if(arr.length <size)
// 	fillArrayWithNull(size,arr)
// 	return arr;
// };



// lib.isAllowedToBePlaced = function(ship,align,firstPoint){
// 	var rows=['A','B','C','D','E','F','G','H','I','J'];
// 	var shipsize = ship.coordinates.length;
// 	if(align == "vertical"){
// 		var allowedRows = 10 - (shipsize - 1);
// 		if(rows.indexOf(firstPoint[0]) < allowedRows)
// 			return true;
// 		return false;
// 	}
// 	if(align == "horizontal"){
// 		var allowedColumn = 10 - (shipsize - 1);
// 		if(firstPoint.slice(1) <= allowedColumn)
// 			return true;
// 		return false;
// 	}
// };

// exports.positionShip = function(ship,align,firstPoint,grid){
// 	if(lib.isAllowedToBePlaced(ship,align,firstPoint)){
// 		if(align=='vertical'){
// 			var initialCharCode = firstPoint.charCodeAt(0);
// 			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode);
// 		}   //don't put semi-colon here 
// 		else if(align == 'horizontal'){
// 			var initialColumnNumber = firstPoint.slice(1);
// 			var tempCoordinates = lib.makesCoordinates(ship,firstPoint,initialCharCode,initialColumnNumber);
// 		};
// 		if(grid.isUsedSpace(tempCoordinates)){
// 				throw new Error('Cannot place over other ship.');
// 		};
// 		if(grid.usedCoordinates.concat(tempCoordinates).length > 17){
// 			throw new Error('Ships already placed');
// 		};

// 		ship.coordinates = tempCoordinates;
// 		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
// 		return;                                 
// 	};
// 	throw new Error('Cannot position ship here.');
// };


