var Observer = require('../lib/observer');
var assert = require('chai').assert;
var expect = require('chai').expect;
var Grid = require('../lib/grid');

describe('Observer',function(){
	it('should initialize the observer with game,privateGames array and gameNum',function(){
		var observer = new Observer();
		var games = observer.games;
		var privateGames = observer.privateGames;
		var gameNum = observer.gameNum;
		assert.deepEqual(games,[]);
		assert.deepEqual(privateGames,[]);
		assert.equal(gameNum,1);
	});

	describe('addPrivateGame',function(){
		var observer = new Observer();
		it('should add private game with given game id',function(){
			observer.addPrivateGame(12);
			assert.equal(12,observer.privateGames[0].gameID);
		});
	});

	describe('addGame',function(){
		var observer = new Observer();
		it('should add a game with default game id',function(){
			observer.addGame();
			assert.equal(1,observer.games[0].gameID);
		});
		it('should increment the gameNum when we add a game with default game id',function(){
			observer.addGame();
			assert.equal(3,observer.gameNum);
		});
	});

	// describe('allocatePlayerToSpecificGame',function(){
	// 	var observer = new Observer();
	// 	it('should allocate player to a given game id',function(){

	// 	});
	// });

	// describe('allocatePlayer',function(){

	// });

	describe('gameOfCurrentPlayer',function(){
		var observer = new Observer();
		observer.addGame();
		it('should return the game of current player',function(){
			var result = observer.gameOfCurrentPlayer(1);
			var expected = { _players: [], gameID: 1, _result: null, seen: 0 };
			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});
	});

	// describe('deleteGame',function(){

	// });
});