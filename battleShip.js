var lib={};
exports.lib=lib;
var grid={};
for (var i=65;i<75;i++){
	var ar=new Array(10);
	grid[String.fromCharCode(i)]=(function makeArray(){var arr=[];
		for(var j=0;j<10;j++){arr.push(j+1)}
			return arr})();
}
console.log(grid);
lib.Ship = function(size){
	for(var i=65;i<(65+size);i++){
		this[String.fromCharCode(i)]='';
	}
}
var carrier= new lib.Ship(5);
var battleShip= new lib.Ship(4); 
var cruiser= new lib.Ship(3);
var submarine= new lib.Ship(3);
var destroyer= new lib.Ship(2);

lib.positionShip = function(ship,align,firstPoint,grid){
	console.log(firstPoint)
	// for(var key in ship){
	// 	key=grid
	// }
}

//from fp we have to separate key and numeric value

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
positionShip(ship1,v,grid.A[1],grid)