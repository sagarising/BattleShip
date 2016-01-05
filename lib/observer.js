var Player = require('./player');
var _ = require('lodash')
var Game = require('./Game');
var Observer = function() {
	this.games = [];
	this.gameNum = 1;

	this.addPrivateGame = function(gameId){
		var self = this;
		this.games.push(new Game(gameId));
	};
	this.addGame = function() {
		var self = this;
		this.games.push(new Game(self.gameNum));
		this.gameNum++;
	};
	this.allocatePlayerToSpecificGame = function(name,grid,gameId) {
		var currentGame = this.gameOfCurrentPlayer(gameId);
		if(currentGame && currentGame.numberOfPlayers()<2){
			currentGame.addPlayer(new Player(name,grid));
		}
		else{
			this.addPrivateGame(gameId);
			var player = new Player(name,grid);
			this.games[this.games.length-1].addPlayer(player);
		}
	};
	this.allocatePlayer = function(name,grid) {
		var currentGame = this.games[this.games.length-1];
		if(currentGame && currentGame.numberOfPlayers()<2){
			currentGame.addPlayer(new Player(name,grid));
		}
		else{
			this.addGame();
			var player = new Player(name,grid);
			this.games[this.games.length-1].addPlayer(player);
		}
	};
	this.gameOfCurrentPlayer = function(gameId) {
		return _.find(this.games,function(game){
			return game.gameID == gameId;
		});
	};
};
module.exports= Observer;