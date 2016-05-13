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

	describe('allocatePlayer',function() {
		var observer = new Observer();
		it('Initially games should have length 0',function(){
			expect(observer.games).to.have.length(0);
		});
		it('should allocate player into game1',function() {
			observer.allocatePlayer('abhishek');
			expect(observer.games[0]).to.have.keys("_players","gameID","_result","seen");
		});
		it('Game ID for first player should be 1',function() {
			expect(observer.games[0].gameID).to.equal(1);
		});
		it('should add second player in the same game',function() {
			observer.allocatePlayer('nabeel');
			expect(observer.games).to.have.length(1);
		});
		it('Game ID for second player should be 1',function() {
			expect(observer.games[0].gameID).to.equal(1);
		});
		it('should add third player in the next game',function() {
			observer.allocatePlayer('pandey');
			expect(observer.games).to.have.length(2);
		});
		it('Game ID for third player should be 2',function() {
			expect(observer.games[1].gameID).to.equal(2);
		});
		it('should add forth player in the same second game',function() {
			observer.allocatePlayer('lalit');
			expect(observer.games).to.have.length(2);
		});
		it('should add fifth player in the next game',function() {
			observer.allocatePlayer('mohan');
			expect(observer.games).to.have.length(3);
		});
		it('Game ID for fifth player should be 3',function() {
			expect(observer.games[2].gameID).to.equal(3);
		});
	})

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
		var observer = new Observer();
		observer.addPrivateGame(12);
		observer.addGame();
		observer.addGame();
		it('should delete the given default game',function(){
			var game = observer.games[0];
			assert.equal(observer.games.length,2);
			observer.deleteGame(game);
			assert.equal(observer.games.length,1);
		});
		it('should remove the given private game',function(){
			var game = observer.privateGames[0];
			assert.equal(observer.privateGames.length,1);
			observer.deleteGame(game);
			assert.equal(observer.privateGames.length,0);
		});
	});
});