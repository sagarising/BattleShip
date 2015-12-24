var Ship = require('./ship');
var Game = function(gameID){
	this.players=[];
	this.gameID = gameID;
}

Game.prototype.getPlayer = function(){return this.players};
Game.prototype.addPlayer =function(player){
	this.players.push(player);
};
Game.prototype.canStartPlaying = function(){
	var areAllPlayersReady = this.players.every(function(player){
		return player.isReady;
	});	
	return areAllPlayersReady && this.players.length == 2;
};
Game.prototype.currentPlayer = function(cookie){
	var player_who_requested;
	this.players.forEach(function(element){
		if(element.name == cookie.match(/[a-z]/gi).join(''))
			player_who_requested = element;
	});
	return player_who_requested;
};
Game.prototype.enemyPlayer = function(cookie){
	var index = +(!this.players.indexOf(this.currentPlayer(cookie)));
	return this.players[index];
};
Game.prototype.is_any_player_died = function(){
	return this.players.some(function(player){
		return player.isAlive == false ;
	});
};
Game.prototype.isAllowedToBePlaced = function(size,align,firstPoint){
	var rows=['A','B','C','D','E','F','G','H','I','J'];
	var shipsize = size;
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
Game.prototype.positionShip = function(shipInfo,player){
	if(Game.prototype.isAllowedToBePlaced(shipInfo.shipSize,shipInfo.align,shipInfo.coordinate)){
		if(shipInfo.align=='vertical'){
			var initialCharCode = shipInfo.coordinate.charCodeAt(0);
			var tempCoordinates = makesCoordinates(shipInfo.shipSize,shipInfo.coordinate,initialCharCode);
		}   //don't put semi-colon here 
		else if(shipInfo.align == 'horizontal'){
			var initialColumnNumber = shipInfo.coordinate.slice(1);
			var tempCoordinates = makesCoordinates(shipInfo.shipSize,shipInfo.coordinate,initialCharCode,initialColumnNumber);
		};
		if(player.grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		};
		if(player.grid.usedCoordinates.concat(tempCoordinates).length > 17){
			throw new Error('Ships already placed');
		};
		player.ships.push(new Ship(tempCoordinates));
		player.grid.usedCoordinates = player.grid.usedCoordinates.concat(tempCoordinates); 
		return;                                 
	};
	throw new Error('Cannot position ship here.');
};


var makesCoordinates = function(size,firstPoint,initialCharCode,initialColumnNumber){
	var generatedCoordinates = [];
	for (var i = 0; i<size; i++){
		var coordinateToBePushed = initialCharCode != undefined ? (String.fromCharCode(initialCharCode++) + firstPoint.slice(1))
									: (firstPoint[0] + initialColumnNumber++);
		generatedCoordinates.push(coordinateToBePushed);
	};
	return generatedCoordinates;
};

module.exports = Game;

// exports.Game.prototype.gameOver = function(){
// 	var player_who_lost = Game.prototype.this.players[0].isAlive? this.this.players[1]: this.players[0];
// 	var player_who_won = this.players[0].isAlive? this.players[0]: this.players[1];
// 	var winnerStatus = player_who_won.list_of_isAlive_of_each_ship();
// 	var result_of_game = {won:player_who_won,lost:player_who_lost,status:winnerStatus}
// 	this.players.length = 0;
// 	return JSON.stringify(result_of_game);
// };
