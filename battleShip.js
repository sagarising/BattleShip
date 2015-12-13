var lib={};
exports.lib = lib;

exports.Observer = function() {
	this.games = [];
	this.gameNum = 1;
}

exports.Observer.prototype.addGame = function() {
	var self = this;
	this.games.push(new exports.Game(self.gameNum));
	this.gameNum++;
}

exports.Observer.prototype.allocatePlayer = function(name) {
	var currentGame = this.games[this.games.length-1];
	if(currentGame && currentGame.players.length<2)
		currentGame.addPlayer(new exports.Player(name));
	else{
		this.addGame();
		this.games[this.games.length-1].addPlayer(new exports.Player(name));
	}
}

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

exports.Game = function(gameID){
	this.players=[];
	this.gameID = gameID;
}

exports.Game.prototype.addPlayer = function(player){
	this.players.push(player);
}

exports.Game.prototype.gameOver = function(){
	var player_who_lost = this.players[0].isAlive? this.players[1]: this.players[0];
	var player_who_won = this.players[0].isAlive? this.players[0]: this.players[1];
	var result_of_game = {won:player_who_won.name,lost:player_who_lost.name}
	this.players.length = 0;
	return JSON.stringify(result_of_game);
};

exports.Game.prototype.canStartPlaying = function(){
	var areAllPlayersReady = this.players.every(function(player){
		return player.isReady;
	});	

	return areAllPlayersReady && this.players.length == 2;
};

exports.Game.prototype.currentPlayer = function(cookie){
	var player_who_requested;
	this.players.forEach(function(element){
		if(element.name == cookie.match(/[a-z]/gi).join(''))
			player_who_requested = element;
	});
	return player_who_requested;
};

exports.Game.prototype.enemyPlayer = function(cookie){
	var index = +(!this.players.indexOf(this.currentPlayer(cookie)));
	return this.players[index];
};


exports.Game.prototype.if_a_player_dies = function(){
	return this.players.some(function(player){
		return player.isAlive == false ;
	});
};


exports.Player = function(name){
	this.name = name;
	this.grid = new lib.gridCreater();
	this.ships = [new lib.Ship(5),
				 new lib.Ship(4),
				 new lib.Ship(3),
				 new lib.Ship(3),
				 new lib.Ship(2)];
	this.misses = [];
	this.hits = [];
	this.isAlive = true;
	this.isReady = false;
	this.turn = false;
};

exports.Player.prototype.list_of_isAlive_of_each_ship = function(){
	return this.ships.map(function(element){
		return element.isAlive;
	});
};

exports.Player.prototype.if_all_ship_sunk = function(){
	var check_if_all_ship_sunk = (this.list_of_isAlive_of_each_ship()).every(function(status){
		return status == 0;
	});
	if(check_if_all_ship_sunk)
		this.isAlive = false;
};

exports.Player.prototype.if_it_is_Hit = function(attackPoint){
	if(lib.isHit(this.grid.usedCoordinates,attackPoint)){
		this.grid.usedCoordinates = lib.removingHitPointFromExistingCoordinates(this.grid.usedCoordinates,attackPoint);
		this.grid.destroyed.push(attackPoint);
		this.ships.forEach(function(ship){
			ship.if_ship_is_Hit(attackPoint);
		});
		this.if_all_ship_sunk();
		return 1;
	};
	return 0;    
};


function fillArrayWithNull(size,array){
 	var arr = array||[];
	arr.push(null);
	if(arr.length <size)
	fillArrayWithNull(size,arr)
	return arr;
};

lib.Ship = function(size,player){
	this.coordinates = fillArrayWithNull(size);
	Object.defineProperty(this,'isAlive',{value:1,writable:true})
};

lib.Ship.prototype.if_ship_is_Hit = function(attackPoint){
	if(lib.isHit(this.coordinates,attackPoint)){
		this.coordinates = lib.removingHitPointFromExistingCoordinates(this.coordinates,attackPoint);
		this.checkAndSwitchIsAlive();
	};
};

lib.Ship.prototype.checkAndSwitchIsAlive = function(){           
	if(this.coordinates.length == 0)
		this.isAlive = 0;
};

lib.isAllowedToBePlaced = function(ship,align,firstPoint){
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
	if(lib.isAllowedToBePlaced(ship,align,firstPoint)){
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
		if(grid.usedCoordinates.concat(tempCoordinates).length > 17){
			throw new Error('Ships already placed');
		};

		ship.coordinates = tempCoordinates;
		grid.usedCoordinates = grid.usedCoordinates.concat(tempCoordinates); 
		return;                                 
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
