var Grid = function (){
	for (var i=65;i<75;i++){
		this[String.fromCharCode(i)] = (function makeArray(){var arr=[];
			for(var j=1;j<11;j++){arr.push(j)}
				return arr})();
	};
	this.usedCoordinates = [];
	this.destroyed = [];

	this.isUsedSpace = function(coordinates){
		var self = this;
		return coordinates.some(function(coordinate){
			return self.usedCoordinates.indexOf(coordinate) !== -1;
		});
	};
};

var grid = new Grid();

module.exports = Grid;