var assert = require('chai').assert;
var expect = require('chai').expect;
var Game = require('../lib/Game').Game;
var sinon = require('sinon');
var Grid = require('../lib/Grid');
var Ship = require('../lib/Ship');
var lib = require('../lib/Game').lib;
var Player = require('../lib/Player');

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

	describe('isAllowedToBePlaced',function(){
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

	describe('checkForAllShipsSunk',function(){
		var game = new Game();
		var grid = new Grid();
		var player1 = new Player('Abhi',grid);
		var player2 = new Player('Nabhi',grid);
		var ships = [];
		ships.push(new Ship(['A1']));
		player2.ships = ships;
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should not change the isAlive property of the enemy player if all ships are not sunk',function(){
			game.checkForAllShipsSunk('Abhi');
			var result = game._enemyPlayer("Abhi").isAlive;
			assert.equal(result,true);
		});
		it('should change the isAlive property of the enemy player to false if all ships sunk',function(){
			game.checkForAllShipsSunk('Nabhi');
			var result = game._enemyPlayer("Nabhi").isAlive;
			assert.equal(result,false);
		});
	});

	describe('placedShipsPosition',function(){
		var game = new Game(1);
		var grid1 = new Grid();
		var player = {name:"Abhi",isReady:false,ships:[],grid : grid1};
		game.addPlayer(player);
		it('should position the ship and return usedCoordinates for vertical',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'A4'}
			var expected = ['A4','B4','C4'];
			var result = game.placedShipsPosition(shipInfo,player);
			assert.deepEqual(expected,result);
		});
		it('should position the ship and return usedCoordinates for horizontal',function(){
			var shipInfo = {shipSize:3,align:'horizontal',coordinate:'A1'}
			var expected = ['A4','B4','C4','A1','A2','A3'];
			var result = game.placedShipsPosition(shipInfo,player);
			assert.deepEqual(expected,result);
		});
		it('should return error if the ship cannot be placed',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'I4'};
			expect(function(){
			    game.placedShipsPosition(shipInfo,player);
			}).to.throw("Cannot position ship here.");
		});
		it('should return error if the ship cannot be placed over used space and expect ship to be unchanged',function(){
			var shipInfo = {shipSize:3,align:'vertical',coordinate:'B4'};
			grid1.usedCoordinates = ['C4'];
			expect(function(){
			    game.placedShipsPosition(shipInfo,player)
			}).to.throw('Cannot place over other ship.');
		});
	});

	describe('arePlayersReady',function(){
		var game = new Game();
		var grid1 = new Grid();
		grid1.usedCoordinates.length = 17;
		var player1 = {name:"Abhi",isReady:true,grid : grid1,turn:true};
		var player2 = {name:"Nabhi",isReady:true};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should return true if both players are ready',function(){
			var result = game.canStartPlaying(player1);
			assert.equal(result,true);
		});
		it('should return false if players are not ready',function(){
			game._enemyPlayer('Abhi').isReady = false;
			var result = game.canStartPlaying(player1);
			assert.equal(result,false);
		});
	});

	describe('reinitiatingUsedCoordinates',function(){
		var game = new Game();
		var grid1 = new Grid();
		grid1.usedCoordinates.length = 17;
		var player1 = {name:"Abhi",isReady:true,grid : grid1,turn:true};
		game.addPlayer(player1);
		it('should reinitiate the usedCoordinates array of player',function(){
			game.reinitiatingUsedCoordinates(player1);
			var result = game._currentPlayer('Abhi').grid.usedCoordinates;
			assert.deepEqual(result,[]);
		});
	});

	describe('usedCoordinatesOfPlayer',function(){
		var game = new Game();
		var grid1 = new Grid();
		grid1.usedCoordinates = ['A4','B4','C4','A1','A2','A3'];
		var player1 = {name:"Abhi",isReady:true,grid : grid1,turn:true};
		game.addPlayer(player1);
		it('should return the usedCoordinates of the player',function(){
			var result = game.usedCoordinatesOfPlayer(player1);
			assert.deepEqual(result,['A4','B4','C4','A1','A2','A3']);
		});
	});

	describe('changeTurn',function(){
		var game = new Game();
		var player1 = {name:"Abhi",turn:true};
		var player2 = {name:"Nabhi",turn:true};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should change the turn of current player to false',function(){
			game.changeTurn('Abhi');
			var result = game._currentPlayer('Abhi').turn;
			assert.equal(result,false);
		});
		it('should change the turn of current player to false',function(){
			game.changeTurn('Abhi');
			var result = game._enemyPlayer('Abhi').turn;
			assert.equal(result,true);
		});
	});

	describe('insert_point_into_hitPoints',function(){
		var game = new Game();
		var player1 = {name:"Abhi",turn:true,hits:[]};
		game.addPlayer(player1);
		it('should push the hitPoint to hits array of player',function(){	
			game.insert_point_into_hitPoints('A1','Abhi');
			var hitPoints = game._currentPlayer('Abhi').hits;
			assert.deepEqual(hitPoints,['A1']);
		});
	});

	describe('insert_point_into_missPoints',function(){
		var game = new Game();
		var player1 = {name:"Abhi",turn:true,misses:[]};
		game.addPlayer(player1);
		it('should push the hitPoint to hits array of player',function(){	
			game.insert_point_into_missPoints('A7','Abhi');
			var missPoints = game._currentPlayer('Abhi').misses;
			assert.deepEqual(missPoints,['A7']);
		});
	});

	describe('playerStatus',function(){
		var game = new Game();
		var grid1 = new Grid();
		var ships1 = [];
		ships1.push(new Ship(['A1']));
		var player1 = {name:"Abhi",turn:true,misses:['A2'],hits:['I4'],grid : grid1,ships : ships1};
		var player2 = {name:"Nabhi",turn:true,ships:[]};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should return the status of players',function(){
			var result = game.playersStatus('Abhi');
			var expected = { currentPlayerShips: [ 1 ],
						     enemyPlayerShips: [],
						     destroyedPoints: [],
						     missPoints: ['A2'],
						     hitPoints: ['I4'],
						     turn: true };
			assert.deepEqual(result,expected);
		});
	});

	describe('shipsStatus',function(){
		var game = new Game();
		var ships1 = [];
		ships1.push(new Ship(['A1']));
		ships1.push(new Ship(['D7']));
		ships1.push(new Ship([]));
		it('should return the status of all ships',function(){
			var player1 = {name:"Abhi",ships : ships1};
			game.addPlayer(player1);
			var result = lib.shipsStatus(player1);
			assert.deepEqual(result,[1,1,1]);
		});
	});

	describe('removePointFromArray',function(){
		it('should remove the given number and return a new array',function(){
			var array = [1,2,3,4,5];
			var result = lib.removePointFromArray(array,3);
			assert.deepEqual(result,[1,2,4,5]);
		});
		it('should remove the given point and return a new array',function(){
			var array = ['A1','A2','A3','A4','A5'];
			var result = lib.removePointFromArray(array,'A1');
			assert.deepEqual(result,['A2','A3','A4','A5']);
		});
	});

	describe('makesCoordinates',function(){
		it('should return coordinates of given ship with alignment vertical',function(){
			var result = lib.makesCoordinates(4,'A1',65);
			assert.deepEqual(result,[ 'A1', 'B1', 'C1', 'D1' ]);
		});
		it('should return coordinates of given ship with alignment horizontal',function(){
			var result = lib.makesCoordinates(5,'F3',70,3);
			assert.deepEqual(result,[ 'F3', 'G3', 'H3', 'I3', 'J3' ]);
		});
	});

	describe('gameOver',function(){
		var game = new Game();
		var ships1 = [];
		ships1.push(new Ship(['A1']));
		ships1.push(new Ship(['D7']));
		ships1.push(new Ship([]));
		var player1 = {name:"Abhi",misses:['A2','D5','F2'],hits:['I4','I5','I6','I7'],isAlive:true,ships : ships1};
		var player2 = {name:"Nabhi",isAlive:false};
		game.addPlayer(player1);
		game.addPlayer(player2);
		it('should return the summary or result details of the game',function(){
			var result = game.gameOver();
			var expected = { won: '{"name":"Abhi","misses":["A2","D5","F2"],"hits":["I4","I5","I6","I7"],"isAlive":true,"ships":[{"coordinates":["A1"]},{"coordinates":["D7"]},{"coordinates":[]}]}',
						 	 lost: '{"name":"Nabhi","isAlive":false}',
							 status: [ 1, 1, 1 ] };
			assert.deepEqual(result,expected);
		});
	});
});