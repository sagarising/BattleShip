var lib={};
exports.lib=lib;


lib.gridCreater = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	}
}

var grid = new lib.gridCreater();

lib.Ship = function(size){
	for(var i=97;i<(97+size);i++){
		this[String.fromCharCode(i)]=null;
	}
}
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

lib.isUsedCoordinate = function(coordinate){

}

lib.positionShip = function(ship,align,firstPoint,grid){
	var tempCoordinate=[];
	if(lib.isAllowed(ship,align,firstPoint,grid)){
		if(align=='vertical'){
			var initialCharCode = firstPoint.row.charCodeAt();
			for (var key in ship){
				ship[key] = {row:String.fromCharCode(initialCharCode++),column:firstPoint.column};
				// temp.push(ship[key]);
			}
				// usedCoordinates.push(ship[key]);
			return (ship);
		}

		if(align == 'horizontal'){
			var initialColumnNumber = firstPoint.column;
			for (var key in ship){
				ship[key] = {row:firstPoint.row,column:initialColumnNumber++};
				// usedCoordinates.push(ship[key]);
			}
			return (ship);
		}
	}
	else return "cannot position ship here."
}
console.log(grid);
console.log('Ship-1:',lib.positionShip(carrier,'vertical',{row:'A',column:1},grid));
console.log('Ship-2:',lib.positionShip(carrier,'horizontal',{row:'B',column:4},grid));
console.log('Ship-3:',lib.positionShip(cruiser,'horizontal',{row:'B',column:9},grid));
// console.log(usedCoordinates);