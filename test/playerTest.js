var assert = require('chai').assert;
var expect = require('chai').expect;
var Player = require('../lib/player');
var sinon = require('sinon');
var Grid = require('../lib/grid');
var Ship = require('../lib/ship');

describe('Player',function() {
	it('Should have no ship initially',function(){
		var ship = {coordinates : [ , , , ],isAlive:true};
		var player = new Player("Abhishek");
		assert.equal(JSON.stringify(player.ships),JSON.stringify([]));
	});

	describe('addShips',function(){
		it('has one ship as one pushes a ship',function() {
			var ship = {coordinates : [ , , , ],isAlive:true};
			var player = new Player("Abhishek");
			player.addShips(ship);
			assert.equal(JSON.stringify(player.ships),JSON.stringify([{coordinates:[null,null,null],isAlive:true}]));
		});
	});

	describe('if_all_ship_sunk',function(){
		var grid = new Grid();
		var player = new Player('ram',grid);
		player.ships = [{coordinates:['A1'],isAlive:1},{coordinates:[],isAlive:0}];
		it('should not change isAlive of player even one ship is not sunk',function(){
			player.if_all_ship_sunk();
			var result = player.isAlive;
			expect(player.isAlive).to.equal(true);
		});
		it('should change isAlive of player to false when every ship sunks',function(){
			player.ships[0].isAlive = 0;
			player.if_all_ship_sunk();
			var result = player.isAlive;
			expect(player.isAlive).to.equal(false);
		});
	});
	
	describe('if_it_is_Hit',function(){
		var grid = new Grid();
		var player = new Player('ram',grid);
		player.ships.push(new Ship(['A1','A2','A3','A4','A5']));
		player.ships.push(new Ship(['D6','D7','D8','D9']));
		player.grid.usedCoordinates = ['A1','A2','A3','A4','A5','D6','D7','D8','D9'];
		it('should return 1 if it is hit',function(){
			var result = player.if_it_is_Hit('A2');
			expect(result).to.equal(1);
		});
		it('should return 0 if it is not hit',function(){
			var result = player.if_it_is_Hit('J1');
			expect(result).to.equal(0);
		});
		it('should remove attackPoint from uesdCoordinates when is is a hit',function(){
			player.if_it_is_Hit('A1');
			var expected = ['A3','A4','A5','D6','D7','D8','D9'];
			assert.deepEqual(player.grid.usedCoordinates,expected);	
		});
		it('should not remove any coordinate from usedCoordinates if it is not a hit',function(){
			player.if_it_is_Hit('B7');
			var expected = ['A3','A4','A5','D6','D7','D8','D9'];
			assert.deepEqual(player.grid.usedCoordinates,expected);	
		});
		it('should push the coordinate to destroyed field if it is a hit',function(){
			player.if_it_is_Hit('A4');
			var result = player.grid.destroyed;
			var expected = ['A2','A1','A4'];
			assert.deepEqual(result,expected);
		});
		it('should not push the coordinate to destroyed field if it is not a hit',function(){
			player.if_it_is_Hit('J10');
			var result = player.grid.destroyed;
			var expected = ['A2','A1','A4'];
			assert.deepEqual(result,expected);
		});
	});
});
