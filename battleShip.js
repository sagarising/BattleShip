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
	
	isUsedSpace : function(ship){
		var self = this;
		return Object.keys(ship).some(function(coordinate){
			return JSON.stringify(self.usedCoordinates).indexOf(JSON.stringify(ship[coordinate]))!=-1;	//strinigfy is used to check a object present in array
		});
	}
};

var grid = new lib.gridCreater();

lib.Ship = function(size){
	for(var i=97;i<(97+size);i++){
		this[String.fromCharCode(i)]=null;
	};
};
var carrier= new lib.Ship(5);
var battleShip= new lib.Ship(4); 
var cruiser= new lib.Ship(3);
var submarine= new lib.Ship(3);
var destroyer= new lib.Ship(2);

lib.isAllowed = function(ship,align,firstPoint,grid){
	var rows=['A','B','C','D','E','F','G','H','I','J'];
	var shipsize = Object.keys(ship).length;
	if(align == "vertical"){
		var allowedRows = Object.keys(grid).length - (shipsize - 1);
		if(rows.indexOf(firstPoint.row) < allowedRows)
			return true;
		return false;
	}

	if(align == "horizontal"){
		var allowedColumn = Object.keys(grid).length - (shipsize - 1);
		if(firstPoint.column <= allowedColumn)
			return true;
		return false;
	}

}

lib.positionShip = function(ship,align,firstPoint,grid){
	
	if(lib.isAllowed(ship,align,firstPoint,grid)){
		if(align=='vertical'){
			var tempCoordinates1=[];
			var initialCharCode = firstPoint.row.charCodeAt();
			for (var key1 in ship){
				ship[key1] = {row:String.fromCharCode(initialCharCode++),column:firstPoint.column}; 
				tempCoordinates1.push(ship[key1]);
			}
			if(grid.isUsedSpace(ship)){
				throw new Error('Cannot place over other ship.')
			}
			grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates1);   // we should optimise this
			return (ship);
		}

		if(align == 'horizontal'){
			var tempCoordinates2=[];
			var initialColumnNumber = firstPoint.column;
			for (var key2 in ship){
				ship[key2] = {row:firstPoint.row,column:initialColumnNumber++};
				tempCoordinates2.push(ship[key2]);
			}
			if(grid.isUsedSpace(ship)){
				throw new Error('Cannot place over other ship.');
			}
			grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates2); //we should optimise this
			return (ship);
		}
	};
	throw new Error('Cannot position ship here.');
};

