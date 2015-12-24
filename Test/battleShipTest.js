// var assert = require('chai').assert;
// var expect = require('chai').expect;
// var lib = require('../battleShip.js');

// describe('Ship',function(){
// 	it('should give an array of coordinates',function(){
// 		var ship = new lib.lib.Ship(3);
// 		expect(JSON.stringify(ship.coordinates)).to.be.equal(JSON.stringify([null,null,null]));
// 	});
// 	it('should remove hit point from ship coordinates',function(){
// 		expect(player.ships[2]).to.have.all.keys({coordinates:[null,null,null]});
// 	});
// });

// describe('isAllowed',function(){
// 	var player = new lib.Player('ram');
// 	it('should check if the firstpoint is valid for placing ship aligned vertical',function(){
// 		assert.equal(true,lib.lib.isAllowedToBePlaced(player.ships[0],"vertical","B9")); 
// 		assert.equal(false,lib.lib.isAllowedToBePlaced(player.ships[0],"vertical","I9")); 
// 	});
// 	it('should check if the firstpoint is valid for placing ship aligned horizontal',function(){
// 		assert.equal(true,lib.lib.isAllowedToBePlaced(player.ships[0],"vertical","B9")); 
// 		assert.equal(false,lib.lib.isAllowedToBePlaced(player.ships[0],"vertical","I9")); 
// 	});
// });

// describe('gridCreater',function(){
// 	it('should have initially no used coordinate',function(){
// 		var grid = new lib.lib.gridCreater();
// 		expect(grid).to.have.property('usedCoordinates').that.is.an('array').to.be.empty;
// 	})
// })

// describe('isUsedSpace',function(){
// 	var grid = new lib.lib.gridCreater();
// 	var player = new lib.Player('ram');
// 	it('should return true if coordinate exists in used coordinates',function(){
// 		grid.usedCoordinates = ['A1'];
// 		player.ships[3].coordinates = ['A1','A2','A3'];
// 		assert.equal(true,grid.isUsedSpace(player.ships[3].coordinates));
// 	});
// 	it('should return false if coordinate does not exists in used coordinates',function(){
// 		grid.usedCoordinates = ['B2'];
// 		assert.equal(false,grid.isUsedSpace(player.ships[0].coordinates));
// 	});
// });

// describe('positionShip',function(){
// 	var player = new lib.Player('ram');
// 	var grid = new lib.lib.gridCreater();
// 	it('should position the ship and return ship with some filled coordinates for vertical',function(){
// 		var align='vertical';
// 		firstpoint = 'A4';
// 		var expected = {coordinates:['A4','B4','C4']}
// 		lib.positionShip(player.ships[2],align,firstpoint,grid);
// 		assert.equal(JSON.stringify(expected),JSON.stringify(player.ships[2]));
// 	});
// 	it('should position the ship and return ship with some filled coordinates for horizontal',function(){
// 		var align='horizontal';
// 		firstpoint = 'A1';
// 		var expected = {coordinates:['A1','A2','A3']}
// 		lib.positionShip(player.ships[3],align,firstpoint,grid);
// 		assert.equal(JSON.stringify(expected),JSON.stringify(player.ships[3]));
// 	});
// 	it('should return error if the ship cannot be placed',function(){
// 		var player = new lib.Player('ram');
// 		var align='vertical';
// 		firstpoint = 'I4';
// 		var boundFunction = lib.positionShip.bind(null,player.ships[3],align,firstpoint,grid);
// 		assert.throw(boundFunction,Error,'Cannot position ship here.');
// 	});
// 	it('should return error if the ship cannot be placed over used space and expect ship to be unchanged',function(){
// 		var align='vertical';
// 		firstpoint = 'B4';
// 		grid.usedCoordinates = ['C4'];
// 		var boundFunction = lib.positionShip.bind(null,player.ships[2],align,firstpoint,grid);
// 		assert.throw(boundFunction,Error,'Cannot place over other ship.');
// 		expect(player.ships[2]).to.have.all.keys({coordinates:[null,null,null]});
// 	});
// });
// describe('makesCoordinate',function(){
// 	var player = new lib.Player('ram');
// 	it('should check when initilCharCode is undefined and gives new generated coordinates',function(){
// 		firstpoint = 'A4';
// 		var initilColumnNumber = firstpoint.slice(1);
// 		var expected = ['A4','A5','A6'];
// 		assert.equal(JSON.stringify(expected),JSON.stringify(lib.lib.makesCoordinates(player.ships[3],firstpoint,undefined,initilColumnNumber)));
// 	});
// 	it('should check when initilCharCode is defined and gives new generated coordinates',function(){
// 		firstpoint = 'A4';
// 		var initilCharCode = firstpoint.charCodeAt(0);
// 		var initilColumnNumber = firstpoint.slice(1);
// 		var expected = ['A4','B4','C4'];
// 		assert.equal(JSON.stringify(expected),JSON.stringify(lib.lib.makesCoordinates(player.ships[2],firstpoint,initilCharCode,initilColumnNumber)));
// 	});
// });

// describe('PlayerCreator',function(){
// 	var player = new lib.Player('ram');
// 	it('should make player object',function(){
// 		expect(player).to.be.a('object')
// 	});
// 	it('player object should have some properties',function(){
// 		expect(player).to.have.all.keys('name','ships','grid','isReady','turn','hits','misses','isAlive');
// 	});
// 	it('player object initially should have "isReady" as false',function(){
// 		assert.equal(false,player.isReady);
// 	});
// 	it('player object initially should have "turn" as false',function(){
// 		assert.equal(false,player.turn);
// 	});
// 	it('player object should have array of ships with length 5',function(){
// 		expect(player.ships).to.be.a('array');
// 		assert.equal(5,player.ships.length);
// 	});
// });

// describe('CheckingIsHit',function(){
// 	it('should return true if attackPoint is present in groupOfCoordinates',function(){
// 		var result = lib.lib.isHit(['A1','A2','A3'],'A1');
// 		assert.equal(true,result);
// 	});
// 	it('should return false if attackPoint is not present in groupOfCoordinates',function(){
// 		assert.equal(false,lib.lib.isHit(['B1','C1','D1'],'A2'));
// 	});
// 	it('should return false if groupOfCoordinates is empty',function(){
// 		assert.equal(false,lib.lib.isHit([],'F1'));
// 	});
// });

// describe('removingHitPointFromExistingCoordinates',function(){
// 	it('should return a new array by removing hitPoint',function(){
// 		var result = lib.lib.removingHitPointFromExistingCoordinates(['A1','A2','D1','F3'],'F3');
// 		assert.deepEqual(['A1','A2','D1'],result);
// 	});
// 	it('should return the same array if the hitPoint is not present in existingCoordinates',function(){
// 		var result = lib.lib.removingHitPointFromExistingCoordinates(['D1','D2','D3','A1','A2'],'F1');
// 		assert.deepEqual(['D1','D2','D3','A1','A2'],result);
// 	});
// });

// describe('CheckAndSwitchIsAlive',function(){
// 	var player = new lib.Player('ram');
// 	it('should change isAlive property of ship to 0 when the ship sunks',function(){
// 		player.ships[0].coordinates.length = 0;
// 		player.ships[0].checkAndSwitchIsAlive();
// 		assert.equal(0,player.ships[0].isAlive);
// 	});
// 	it('should not change isAlive property of ship if the ship has coordinates',function(){
// 		player.ships[2].checkAndSwitchIsAlive();
// 		assert.equal(1,player.ships[2].isAlive);
// 	});
// });

// describe('List_of_isAlive_of_each_ship',function(){
// 	var player = new lib.Player('ramu');
// 	it('should return an array with every ships alive property',function(){
// 		var result = player.list_of_isAlive_of_each_ship();
// 		assert.deepEqual([1,1,1,1,1],result);
// 	});
// 	it('should return an array which contains 0 when any of the ships sunk',function(){
// 		player.ships[0].isAlive = 0;
// 		player.ships[3].isAlive = 0;
// 		var result = player.list_of_isAlive_of_each_ship();
// 		assert.deepEqual([0,1,1,0,1],result);
// 	});
// 	it('should return array of 0s when all ships sunk',function(){
// 		player.ships[0].isAlive = 0;
// 		player.ships[1].isAlive = 0;
// 		player.ships[2].isAlive = 0;
// 		player.ships[3].isAlive = 0;
// 		player.ships[4].isAlive = 0;
// 		var result = player.list_of_isAlive_of_each_ship();
// 		assert.deepEqual([0,0,0,0,0],result);
// 	});
// });

// // describe('gameOver',function(){
// // 	var game = new lib.Game();
// // 	var player1 = new lib.Player('ram');

// // 	var player2 = new lib.Player('manu');

// // 	it('should return an object with player1 won and player2 lost when player2 loses the game',function(){
// // 		player1.isAlive = true;
// // 		player2.isAlive = false;

// // 		game.addPlayer(player1);
// // 		game.addPlayer(player2);

// // 		var result = game.gameOver();
// // 		expect(result).to.equal('{"won":"ram","lost":"manu"}');
// // 	});
// // 	it('should return an object with player2 won and player1 lost when player1 loses the game',function(){
// // 		player1.isAlive = false;
// // 		player2.isAlive = true;

// // 		game.addPlayer(player1);
// // 		game.addPlayer(player2);

// // 		var result = game.gameOver();
// // 		expect(result).to.equal('{"won":"manu","lost":"ram"}')
// // 	});
// // 	it('should remove players from players array after gameOver',function(){
// // 		player1.isAlive = false;
// // 		player2.isAlive = true;

// // 		game.addPlayer(player1);
// // 		game.addPlayer(player2);

// // 		game.gameOver();
// // 		expect(game.players.length).to.equal(0);
// // 	});
// // });

// describe('if_it_is_Hit',function(){
// 	var player = new lib.Player('ram');
// 	player.ships[0].coordinates = ['A1','A2','A3','A4','A5'];
// 	player.ships[1].coordinates = ['D6','D7','D8','D9'];
// 	player.ships[2].coordinates = ['B5','C5','D5'];
// 	player.ships[3].coordinates = ['E3','E4','E5'];
// 	player.ships[4].coordinates = ['H1','H2'];
// 	player.grid.usedCoordinates = ['A1','A2','A3','A4','A5','D6','D7','D8','D9','B5','C5','D5','E3','E4','E5','H1','H2'];
// 	it('should return 1 if it is hit',function(){
// 		var result = player.if_it_is_Hit('A2');
// 		expect(result).to.equal(1);
// 	});
// 	it('should return 0 if it is not hit',function(){
// 		var result = player.if_it_is_Hit('J1');
// 		expect(result).to.equal(0);
// 	});
// 	it('should remove attackPoint from uesdCoordinates when is is a hit',function(){
// 		player.if_it_is_Hit('A1');
// 		var expected = ['A3','A4','A5','D6','D7','D8','D9','B5','C5','D5','E3','E4','E5','H1','H2'];
// 		assert.deepEqual(player.grid.usedCoordinates,expected);	
// 	});
// 	it('should not remove any coordinate from usedCoordinates if it is not a hit',function(){
// 		player.if_it_is_Hit('B7');
// 		var expected = ['A3','A4','A5','D6','D7','D8','D9','B5','C5','D5','E3','E4','E5','H1','H2'];
// 		assert.deepEqual(player.grid.usedCoordinates,expected);	
// 	});
// 	it('should push the coordinate to destroyed field if it is a hit',function(){
// 		player.if_it_is_Hit('A4');
// 		var result = player.grid.destroyed;
// 		var expected = ['A2','A1','A4'];
// 		assert.deepEqual(result,expected);
// 	});
// 	it('should not push the coordinate to destroyed field if it is not a hit',function(){
// 		player.if_it_is_Hit('J10');
// 		var result = player.grid.destroyed;
// 		var expected = ['A2','A1','A4'];
// 		assert.deepEqual(result,expected);
// 	});
// });

// describe('if_ship_is_Hit',function(){
// 	var player = new lib.Player('ram');
// 	player.ships[0].coordinates = ['A1','A2','A3','A4','A5'];
// 	player.ships[1].coordinates = ['D6','D7','D8','D9'];
// 	player.ships[2].coordinates = ['B5','C5','D5'];
// 	player.ships[3].coordinates = ['E3','E4','E5'];
// 	player.ships[4].coordinates = ['H1','H2'];
// 	it('should remove the attackpoint from coordinates of ship when it is a hit',function(){
// 		player.ships[0].if_ship_is_Hit('A1');
// 		var result = player.ships[0].coordinates;
// 		assert.deepEqual(result,['A2','A3','A4','A5']);
// 	});
// 	it('should not remove any coordinates when it is not a hit',function(){
// 		player.ships[3].if_ship_is_Hit('A1');
// 		var result = player.ships[3].coordinates;
// 		assert.deepEqual(result,['E3','E4','E5']);
// 	});
// 	it('should change isAlive property to false when the ship sunk',function(){
// 		player.ships[4].if_ship_is_Hit('H1');
// 		player.ships[4].if_ship_is_Hit('H2');
// 		var result = player.ships[4].isAlive;
// 		expect(result).to.equal(0);
// 	});
// 	it('should not change isAlive property when ship is not sunk',function(){
// 		player.ships[2].if_ship_is_Hit('D6');
// 		var result = player.ships[2].isAlive;
// 		expect(result).to.equal(1);
// 	});
// });

// describe('if_all_ship_sunk',function(){
// 	var player = new lib.Player('ram');
// 	it('should not change isAlive of player even one ship is not sunk',function(){
// 		player.if_all_ship_sunk();
// 		player.ships[0].isAlive = 0;
// 		var result = player.isAlive;
// 		expect(player.isAlive).to.equal(true);
// 	});
// 	it('should change isAlive of player to false when every ship sunks',function(){
// 		player.ships[0].isAlive = 0;
// 		player.ships[1].isAlive = 0;
// 		player.ships[2].isAlive = 0;
// 		player.ships[3].isAlive = 0;
// 		player.ships[4].isAlive = 0;
// 		player.if_all_ship_sunk();
// 		var result = player.isAlive;
// 		expect(player.isAlive).to.equal(false);
// 	});
// });

// describe('currentPlayer',function(){
// 	var game = new lib.Game();
// 	var player1 = new lib.Player('ram');
// 	var player2 = new lib.Player('manu');
// 	it('should return the player who has the turn to play',function(){
// 		game.addPlayer(player1);
// 		game.addPlayer(player2);
// 		var result = game.currentPlayer('ram');
// 		expect(result).to.equal(player1);
// 	});
// });

// describe('enemyPlayer',function(){
// 	var game = new lib.Game();
// 	var player1 = new lib.Player('ram');
// 	game.addPlayer(player1);

// 	var player2 = new lib.Player('manu');
// 	game.addPlayer(player2);

// 	it('should return the player who is waiting to the turn to play',function(){
// 		var result = game.enemyPlayer('manu');
// 		expect(JSON.stringify(result)).to.equal(JSON.stringify(player1));
// 	});
// });

// describe('can players start playing',function(){
// 	var game = new lib.Game();
// 	var player1 = new lib.Player('ram');
// 	var player2 = new lib.Player('manu');
// 	game.addPlayer(player1);
// 	game.addPlayer(player2);
// 	it('should return false when both players are not ready',function(){
// 		var result = game.canStartPlaying();
// 		expect(result).to.equal(false);
// 	});
// 	it('should return false when anyone is not ready',function(){
// 		player1.isReady = true;
// 		var result = game.canStartPlaying();
// 		expect(result).to.equal(false);
// 	});
// 	it('should return true when both players are ready',function(){
// 		player1.isReady = true;
// 		player2.isReady = true;
// 		var result = game.canStartPlaying();
// 		expect(result).to.equal(true);
// 	});
// });

// describe('if_a_player_dies',function(){
// 	var game = new lib.Game();
// 	var player1 = new lib.Player('ram');
// 	game.addPlayer(player1);

// 	var player2 = new lib.Player('manu');
// 	game.addPlayer(player2);

// 	it('should return false when both players are alive',function(){
// 		var result = game.if_a_player_dies();
// 		expect(result).to.equal(false);
//  	});
//  	it('should return true even one player dies',function(){
//  		player1.isAlive = false;
//  		var result = game.if_a_player_dies();
//  		expect(result).to.equal(true);
//  	});
//  	it('should return true when both player are died',function(){
//  		player1.isAlive = false;
//  		player2.isAlive = false;
//  		var result = game.if_a_player_dies();
//  		expect(result).to.equal(true);
//  	});
// });

// describe('addGame',function() {
// 	var observer = new lib.Observer();

// 	it('should make new game objects inside which players will be allocated',function() {
// 		observer.addGame();
// 		expect(observer.games[0]).to.have.keys('players','gameID')
// 	});
// 	it('should push more game object when required',function(){
// 		observer.addGame();
// 		var expected = JSON.stringify({players:[],gameID:2});
// 		expect(JSON.stringify(observer.games[1])).to.deep.equal(expected);
// 	});
// })

// describe('allocatePlayer',function() {
// 	var observer = new lib.Observer();
// 	it('Initially games should have length 0',function(){
// 		expect(observer.games).to.have.length(0);
// 	});
// 	it('should allocate player into game1',function() {
// 		observer.allocatePlayer('abhishek');
// 		expect(observer.games[0]).to.have.keys("players","gameID");
// 	});
// 	it('Game ID for first player should be 1',function() {
// 		expect(observer.games[0].gameID).to.equal(1);
// 	});
// 	it('should add second player in the same game',function() {
// 		observer.allocatePlayer('nabeel');
// 		expect(observer.games).to.have.length(1);
// 	});
// 	it('Game ID for second player should be 1',function() {
// 		expect(observer.games[0].gameID).to.equal(1);
// 	});
// 	it('should add third player in the next game',function() {
// 		observer.allocatePlayer('pandey');
// 		expect(observer.games).to.have.length(2);
// 	});
// 	it('Game ID for third player should be 2',function() {
// 		expect(observer.games[1].gameID).to.equal(2);
// 	});
// 	it('should add forth player in the same second game',function() {
// 		observer.allocatePlayer('lalit');
// 		expect(observer.games).to.have.length(2);
// 	});
// 	it('should add fifth player in the next game',function() {
// 		observer.allocatePlayer('mohan');
// 		expect(observer.games).to.have.length(3);
// 	});
// 	it('Game ID for fifth player should be 3',function() {
// 		expect(observer.games[2].gameID).to.equal(3);
// 	});
// })