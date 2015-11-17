
var grid={};
for (var i=65;i<75;i++){
	var ar=new Array(10);
	grid[String.fromCharCode(i)]=(function makeArray(){var arr=[];
		for(var j=0;j<10;j++){arr.push(j)}
			return arr})();
}
console.log(grid);
var carrier= {a:'',b:'',c:'',d:'',e:''};
var battleShip= {a:'',b:'',c:'',d:''};
var cruiser= {a:'',b:'',c:''};
var submarine= {a:'',b:'',c:''};
var destroyer= {a:'',b:''};
var positionShip = function(ship,align,fp,grid){
	console.log(fp)
	// for(var key in ship){
	// 	key=grid
	// }
}

//from fp we have to separate key and numeric value

lib.isAllowed = function(ship,align,fp,grid){
	var rows=['A','B','C','D','E','F','G','H','I','J'];
	var shipsize = Object.keys(ship).length;
	if(align == "vertical"){
		var allowedRows = Object.keys(grid).length - (shipsize - 1);
		if(rows.indexOf(fp.row) < allowedRows)
			return true;
		return false;
	}

	if(align == "horizontal"){
		var allowedColumn = Object.keys(grid).length - (shipsize - 1);
		if(fp.column <= allowedColumn)
			return true;
		return false;
	}


}
positionShip(ship1,v,grid.A[1],grid)