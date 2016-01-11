var assert = require('chai').assert;
var Game = require('../lib/Game');
var sinon = require('sinon');
describe('Game',function(){
	it('Should have one player as I push',function() {
		var game = new Game(1);
		var player = {name:"Abhi"};
		game.addPlayer(player);
		assert.equal(JSON.stringify(game._players),JSON.stringify([{name:"Abhi"}]));
	});
	it('Should allow to play when both players are ready',function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isReady:true});
		game.addPlayer({name:"Nabi",isReady:true});
		assert.equal(game.canStartPlaying(),true);		
	});
	it('Should give tell who is the current player is',function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isReady:true});
		assert.equal(JSON.stringify(game._currentPlayer("Abhi1")),JSON.stringify({name:"Abhi",isReady:true}));
	});
	it("Should tell me enemy player also",function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isReady:true});
		game.addPlayer({name:"Nabi",isReady:true});
		assert.equal(JSON.stringify(game._enemyPlayer("Abhi1")),JSON.stringify({name:"Nabi",isReady:true}));
	});
	it("Should return false if no player died",function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isAlive:true});
		game.addPlayer({name:"Nabi",isAlive:true});
		assert.equal(game.is_any_player_died(),false)
	})
	it("Should return true if a player died",function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isAlive:true});
		game.addPlayer({name:"Nabi",isAlive:false});
		assert.equal(game.is_any_player_died(),true)
	})
});