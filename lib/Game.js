var _ = require('lodash');
var Ship = require('./ship');
var db = require('./db');
var lib = {};

var Game = function(gameId){
	this._players=[];
	this.gameID = gameId;
	this._result = null;
	this.seen = 0;
};

Game.prototype.addPlayer =function(player){
	this._players.push(player);
};

Game.prototype.numberOfPlayers = function(){
	return this._players.length;
};

Game.prototype.currentPlayerTurn = function(playerName){
	var player = this._currentPlayer(playerName);
	return player.turn;
};

Game.prototype.canStartPlaying = function(){
	var areAllPlayersReady = this._players.every(function(player){
		return player.isReady;
	});	
	return areAllPlayersReady && this._players.length == 2;
};

Game.prototype._currentPlayer = function(cookie){
	var player_who_requested;
	this._players.forEach(function(element){
		if(element.name == cookie.match(/[a-z]|\s/gi).join(''))
			player_who_requested = element;
	});
	return player_who_requested;
};

Game.prototype._enemyPlayer = function(cookie){
	var index = +(!this._players.indexOf(this._currentPlayer(cookie)));
	return this._players[index];
};

Game.prototype.is_any_player_died = function(){
	return this._players.some(function(player){
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
			var tempCoordinates = lib.makesCoordinates(shipInfo.shipSize,shipInfo.coordinate,initialCharCode);
		}
		else if(shipInfo.align == 'horizontal'){
			var initialColumnNumber = shipInfo.coordinate.slice(1);
			var tempCoordinates = lib.makesCoordinates(shipInfo.shipSize,shipInfo.coordinate,initialCharCode,initialColumnNumber);
		};
		if(player.grid.isUsedSpace(tempCoordinates)){
				throw new Error('Cannot place over other ship.');
		};
		player.ships.push(new Ship(tempCoordinates));
		player.grid.usedCoordinates = player.grid.usedCoordinates.concat(tempCoordinates); 
		if(player.grid.usedCoordinates.length > 17){
			throw new Error('Ships already placed');
		};
		return;                                 
	};
	throw new Error('Cannot position ship here.');
};

Game.prototype.isHit = function(point,name) {
	var enemyPlayer = this._enemyPlayer(name);
	return enemyPlayer.grid.usedCoordinates.indexOf(point) !== -1;
};

Game.prototype.removeHitPoint = function(point,name) {
	var enemyPlayer = this._enemyPlayer(name);
	var hitShip = _.find(enemyPlayer.ships,function(eachShip){
		return eachShip.coordinates.indexOf(point) !== -1;
	});
	enemyPlayer.grid.usedCoordinates = lib.removePointFromArray(enemyPlayer.grid.usedCoordinates,point);
	hitShip.coordinates = lib.removePointFromArray(hitShip.coordinates,point);
	enemyPlayer.grid.destroyed.push(point);
	if(!hitShip.coordinates.length)
		hitShip.isAlive = 0;
};

Game.prototype.checkForAllShipsSunk = function(name) {
	var enemyPlayer = this._enemyPlayer(name);
	enemyPlayer.if_all_ship_sunk();
};

Game.prototype.placedShipsPosition = function(shipInfo,playerInfo) {
	var player = this._currentPlayer(playerInfo.name);
	this.positionShip(shipInfo,player);
	return player.grid.usedCoordinates;
};

Game.prototype.arePlayersReady = function(playerInfo) {
	var player = this._currentPlayer(playerInfo.name);
	if(player.grid.usedCoordinates.length == 17){
		player.isReady = true;
		this._players[0].turn = true;
		return this.canStartPlaying();
	}
	else return 'select more ships'
};

Game.prototype.reinitiatingUsedCoordinates = function(playerInfo) {
	var player = this._currentPlayer(playerInfo.name);
	player.grid.usedCoordinates = [];
};

Game.prototype.usedCoordinatesOfPlayer = function(playerInfo){
	var _currentPlayer = this._currentPlayer(playerInfo.name);
	return _currentPlayer.grid.usedCoordinates.slice(0);
};

Game.prototype.changeTurn = function(name) {
	var _currentPlayer = this._currentPlayer(name);
	var enemyPlayer = this._enemyPlayer(name);
	_currentPlayer.turn = false;
	enemyPlayer.turn = true;
};

Game.prototype.insert_point_into_hitPoints = function(attackPoint,name) {
	var player = this._currentPlayer(name);
	player.hits.push(attackPoint);
};

Game.prototype.insert_point_into_missPoints = function(attackPoint,name) {
	var player = this._currentPlayer(name);
	player.misses.push(attackPoint);
};

Game.prototype.playersStatus = function(player) {
	var _currentPlayer = this._currentPlayer(player);
	var enemyPlayer = this._enemyPlayer(player);
	return {
		currentPlayerShips:lib.shipsStatus(_currentPlayer),
		enemyPlayerShips:lib.shipsStatus(enemyPlayer),
		destroyedPoints:_currentPlayer.grid.destroyed,
		missPoints:_currentPlayer.misses,
		hitPoints:_currentPlayer.hits,
		turn:_currentPlayer.turn
	};
};

lib.shipsStatus = function(player) {
	var status = [];
	player.ships.forEach(function(eachShip){
		status.push(eachShip.isAlive);
	});
	return status;
};

lib.removePointFromArray = function(array,point) {
	return array.filter(function(eachPoint){
		return eachPoint !== point
	});
};

lib.makesCoordinates = function(size,firstPoint,initialCharCode,initialColumnNumber){
	var generatedCoordinates = [];
	for (var i = 0; i<size; i++){
		var coordinateToBePushed = initialCharCode != undefined ? (String.fromCharCode(initialCharCode++) + firstPoint.slice(1))
									: (firstPoint[0] + initialColumnNumber++);
		generatedCoordinates.push(coordinateToBePushed);
	};
	return generatedCoordinates;
};

Game.prototype.gameOver = function(){
	var loser = this._players[0].isAlive? this._players[1]: this._players[0];
	var winner = this._players[0].isAlive? this._players[0]: this._players[1];
	var winnerStatus = lib.shipsStatus(winner);
	this.seen++;
	if(!this._result){
		var accuracy = Math.round((winner.hits.length/(winner.hits.length+winner.misses.length))*100);
		db.insertInfo(winner.name,accuracy);
		this._result = {won:JSON.stringify(winner),lost:JSON.stringify(loser),status:winnerStatus}
	}
	return this._result;
};

module.exports.Game = Game;
module.exports.lib = lib;
