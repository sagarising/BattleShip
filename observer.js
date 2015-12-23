var Game = require('./Game');
var Player = require('./player');

var Observer = function() {
	this.games = [];
	this.gameNum = 1;
}

Observer.prototype.addGame = function() {
	var self = this;
	this.games.push(new Game(self.gameNum));
	this.gameNum++;
}

Observer.prototype.allocatePlayer = function(name,grid) {
	var currentGame = this.games[this.games.length-1];
	if(currentGame && currentGame.getPlayer().length<2)
		currentGame.addPlayer(new Player(name,grid));
	else{
		this.addGame();
		var player = new Player(name,grid);
		this.games[this.games.length-1].addPlayer(player);
	}
}

Observer.prototype.gameOfCurrentPlayer = function(name) {
	return this.games.filter(function(game){
		return game.gameID == +(name.match(/[1-9]/g));
	})
}


module.exports= Observer;