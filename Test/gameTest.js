var assert = require('chai').assert;
var expect = require('chai').expect;
var Game = require('../lib/Game');
var sinon = require('sinon');
describe('Game',function(){
	describe('addPlayer',function(){
		var game = new Game(1);
		it('Should have one player as I push',function() {
			var player = {name:"Abhi"};
			game.addPlayer(player);
			assert.equal(JSON.stringify(game._players),JSON.stringify([{name:"Abhi"}]));
		});	
		it('Should have two player as I again push',function(){
			var player = {name:"Nabhi"};
			game.addPlayer(player);
			assert.equal(JSON.stringify(game._players),JSON.stringify([{name:"Abhi"},{name:"Nabhi"}]));
		});
	});
	
	describe("numberOfPlayers",function(){
		it('Should return the number of players added',function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi"});
			game.addPlayer({name:"Nbhi"});
			var result = game.numberOfPlayers();
			assert.equal(result,2);
		});
	});

	describe("currentPlayerTurn",function(){
		it('Should return turn of current player',function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",turn:true});
			game.addPlayer({name:"Nabi",turn:false});
			var result = game.currentPlayerTurn("Abhi");
			assert.equal(result,true);
		});
	});

	describe("canStartPlaying",function(){
		it('Should allow to play when both players are ready',function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isReady:true});
			game.addPlayer({name:"Nabi",isReady:true});
			assert.equal(game.canStartPlaying(),true);		
		});
		it('should return false when both players are not ready',function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isReady:false});
			game.addPlayer({name:"Nabi",isReady:false});
			var result = game.canStartPlaying();
			expect(result).to.equal(false);
		});
		it('should return false when anyone is not ready and number of players is 1',function(){
			var game = new Game(1);
			game.addPlayer({name:"Nabi",isReady:true});
			var result = game.canStartPlaying();
			expect(result).to.equal(false);
		});
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