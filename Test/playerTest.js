var assert = require('chai').assert;
var Player = require('../lib/player');
var sinon = require('sinon');

describe('Player',function() {
	it('Should have no ship initially',function(){
	var ship = {coordinates : [ , , , ],isAlive:true};
	var player = new Player("Abhishek");
	assert.equal(JSON.stringify(player.ships),JSON.stringify([]));
	});

	it('has one ship as one pushes a ship',function() {
		var ship = {coordinates : [ , , , ],isAlive:true};
		var player = new Player("Abhishek");
		player.addShips(ship);
		assert.equal(JSON.stringify(player.ships),JSON.stringify([{coordinates:[null,null,null],isAlive:true}]));
	});
	describe('are_all_ships_sunk',function() {
		
	})
});
