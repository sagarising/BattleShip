var Ship = require('../lib/ship');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Ship',function(){
	describe('checkAndSwitchIsAlive',function(){
		it('should change the isAlive property of ship when it sunks',function(){
			var ship = new Ship([]);
			ship.checkAndSwitchIsAlive();
			assert.equal(ship.isAlive,0);
		});
		it('should not change the isAlive property of ship if it is not sunk',function(){
			var ship = new Ship(['A1']);
			ship.checkAndSwitchIsAlive();
			assert.equal(ship.isAlive,1);
		});
	});

	describe('if_ship_is_Hit',function(){
		var ship = new Ship(['A2','A3','A4','A5']);
		var ship1 = new Ship(['A1'])
		it('should remove the attackpoint from coordinates of ship when it is a hit',function(){
			ship1.if_ship_is_Hit('A1');
			var result = ship1.coordinates;
			assert.deepEqual(result,[]);
		});
		it('should not remove any coordinates when it is not a hit',function(){
			ship.if_ship_is_Hit('A1');
			var result = ship.coordinates;
			assert.deepEqual(result,['A2','A3','A4','A5']);
		});
		it('should change isAlive property to false when the ship sunk',function(){
			ship1.if_ship_is_Hit('H1');
			var result = ship1.isAlive;
			expect(result).to.equal(0);
		});
		it('should not change isAlive property when ship is not sunk',function(){
			ship.if_ship_is_Hit('A4');
			var result = ship.isAlive;
			expect(result).to.equal(1);
		});
	});
});