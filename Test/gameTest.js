var assert = require('chai').assert;
var expect = require('chai').expect;
var Game = require('../lib/Game');
var sinon = require('sinon');
var Grid = require('../lib/Grid');

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

	describe('_currentPlayer',function(){
		it('Should return the current',function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isReady:true});
			assert.equal(JSON.stringify(game._currentPlayer("Abhi1")),JSON.stringify({name:"Abhi",isReady:true}));
		});
	});

	describe("_enemyPlayer",function(){
		it("Should return the enemy player",function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isReady:true});
			game.addPlayer({name:"Nabi",isReady:true});
			assert.equal(JSON.stringify(game._enemyPlayer("Abhi1")),JSON.stringify({name:"Nabi",isReady:true}));
		});
	});

	describe('is_any_player_died',function(){
		it("Should return false if no player died",function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isAlive:true});
			game.addPlayer({name:"Nabi",isAlive:true});
			assert.equal(game.is_any_player_died(),false)
		});
		it("Should return true if a player died",function(){
			var game = new Game(1);
			game.addPlayer({name:"Abhi",isAlive:true});
			game.addPlayer({name:"Nabi",isAlive:false});
			assert.equal(game.is_any_player_died(),true)
		});
	});

	describe('isAllowesToBePlaced',function(){
		var game = new Game(1);
		game.addPlayer({name:"Abhi",isReady:false,ships:[]});
		it('should check if the firstpoint is valid for placing ship aligned vertical',function(){
			assert.equal(true,game.isAllowedToBePlaced(4,"vertical","B9")); 
			assert.equal(false,game.isAllowedToBePlaced(5,"vertical","I9")); 
		});
		it('should check if the firstpoint is valid for placing ship aligned horizontal',function(){
			assert.equal(true,game.isAllowedToBePlaced(4,"horizontal","B5")); 
			assert.equal(false,game.isAllowedToBePlaced(3,"horizontal","I9")); 
		});
	});

	describe('positionShip',function(){
		var game = new Game(1);
		var grid1 = new Grid();
		var player = {name:"Abhi",isReady:false,ships:[],grid : grid1};
		game.addPlayer(player);
		it('should position the ship and return ship with some filled coordinates for vertical',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'A4'}
			var expected = {coordinates:['A4','B4','C4']}
			game.positionShip(shipInfo,player);
			assert.equal(JSON.stringify(expected),JSON.stringify(player.ships[0]));
		});
		it('should position the ship and return ship with some filled coordinates for horizontal',function(){
			var shipInfo = {shipSize:3,align:'horizontal',coordinate:'A1'}
			var expected = {coordinates:['A1','A2','A3']}
			game.positionShip(shipInfo,player);
			assert.equal(JSON.stringify(expected),JSON.stringify(player.ships[1]));
		});
		it('should return error if the ship cannot be placed',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'I4'};
			var boundFunction = game.positionShip.bind(null,shipInfo,player);
			assert.throw(boundFunction,Error,'Cannot position ship here.');
		});
		it('should return error if the ship cannot be placed over used space and expect ship to be unchanged',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'B4'};
			grid1.usedCoordinates = ['C4'];
			var boundFunction = game.positionShip.bind(null,shipInfo,player);
			assert.throw(boundFunction,Error,'Cannot place over other ship.');
			expect(player.ships[1]).to.have.all.keys({coordinates:[null,null,null]});
		});
	});

	describe('isHit',function(){
		var game = new Game(1);
		var grid1 = new Grid();
		var player1 = {name:"Abhi",isReady:false,ships:[],grid : grid1};
		grid1.usedCoordinates = ['A1','A2','A3'];
		var player2 = {name:"Nabhi"};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should return true if attackPoint is present in groupOfCoordinates',function(){
			var result = game.isHit('A1','Nabhi');
			assert.equal(true,result);
		});
		it('should return false if attackPoint is not present in groupOfCoordinates',function(){
			assert.equal(false,game.isHit('D2','Nabhi'));
		});
		it('should return false if groupOfCoordinates is empty',function(){
			game._players[0].grid.usedCoordinates = [];
			assert.equal(false,game.isHit('F1','Nabhi'));
		});
	});

	describe('removeHitPoint',function(){
		var game = new Game();
		var grid1 = new Grid();
		grid1.usedCoordinates = ['A1','A2','D1','F3'];
		var ships1 = [{coordinates:['A1','A2','D1','F3']}];
		var player1 = {name:"Abhi",isReady:false,ships:ships1,grid : grid1};
		var player2 = {name:"Nabhi"};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should remove the point from usedCoordinates',function(){
			game.removeHitPoint('F3','Nabhi');
			var result = game._enemyPlayer("Nabhi").grid.usedCoordinates;
			assert.deepEqual(['A1','A2','D1'],result);
		});
		it('should remove the hit point from usedCoordinates and add to destroyed',function(){
			game.removeHitPoint('D1','Nabhi');
			var result = game._enemyPlayer("Nabhi").grid.destroyed;
			assert.deepEqual(['F3','D1'],result);
		});
	});
});