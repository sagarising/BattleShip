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

	describe('allocatePlayerToSpecificGame',function(){
		var observer = new Observer();
		var grid = new Grid();
		it('should allocate player to a given game id',function(){
			observer.allocatePlayerToSpecificGame('Abhi',grid,3);
			assert.equal(observer.privateGames[0]._players.length,1);
		});
		it('should throw an error when more than two players are allocated to same game',function(){
			observer.allocatePlayerToSpecificGame('Nabhi',grid,3);
			expect(function(){
				observer.allocatePlayerToSpecificGame('Pandeji',grid,3);
			}).to.throw("Game is booked.");
		});
		it('should create a new game if there is no game exisiting with the given id',function(){
			observer.allocatePlayerToSpecificGame('sagar',grid,20);
			assert.equal(observer.privateGames[1]._players.length,1);
			assert.equal(observer.privateGames[1].gameID,20);
		});
	});

	describe('allocatePlayer',function(){
		var observer = new Observer();
		var grid = new Grid();
		observer.addGame();
		it('should allocate player to the existing default game',function(){
			observer.allocatePlayer('Abhi',grid);
			assert.equal(observer.games[0]._players.length,1);
			assert.equal(observer.games[0]._players[0].name,'Abhi');
			assert.equal(observer.games[0].gameID,1);
		});
		it('should allocate player to a new default game if the current game is filled',function(){
			observer.allocatePlayer('Nabhi',grid);
			observer.allocatePlayer('Pandey',grid);
			assert.equal(observer.games[0]._players.length,2);
			assert.equal(observer.games[1]._players[0].name,'Pandey');
			assert.equal(observer.games[1].gameID,2);
		});
	});

	describe('gameOfCurrentPlayer',function(){
		var observer = new Observer();
		observer.addGame();
		it('should return the game of current player',function(){
			var result = observer.gameOfCurrentPlayer(1);
			var expected = { _players: [], gameID: 1, _result: null, seen: 0 };
			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});
	});

	describe('deleteGame',function(){

	});
});