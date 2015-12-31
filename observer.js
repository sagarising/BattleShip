var Player = require('./player');
var _ = require('lodash')

var Observer = function() {
	this.games = [];
	this.gameNum = 1;

	this.addGame = function() {
		var self = this;
		this.games.push(new Game(self.gameNum));
		this.gameNum++;
	};
	this.allocatePlayer = function(name,grid) {
		var currentGame = this.games[this.games.length-1];
		if(currentGame && currentGame.getPlayer().length<2){
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