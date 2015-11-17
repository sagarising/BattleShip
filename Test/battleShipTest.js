var assert = require('chai').assert;
var expect = require('chai').expect;
var lib = require('../battleShip.js').lib;
var test = {};
exports.test = test; 



describe('Ship',function(){
	it('should initialize ship object',function(){
		var ship = new lib.Ship(3);
		expect(ship).to.be.a('object');
	});
	it('returned ship must have only desired fields',function(){
		var ship1 = new lib.Ship(3); 
		expect(ship1).to.have.all.keys(['a','b','c']);
	});
});

describe('isAllowed',function(){
	it('should check if the firstpoint is valid for placing ship aligned vertical',function(){
		var ship = new lib.Ship(5);
		assert.equal(true,lib.isAllowed(ship,"vertical",{row:"B",column:9},lib.grid)); 
		assert.equal(false,lib.isAllowed(ship,"vertical",{row:"I",column:9},lib.grid)); 
	});
	it('should check if the firstpoint is valid for placing ship aligned horizontal',function(){
		var ship = new lib.Ship(5);
		assert.equal(true,lib.isAllowed(ship,"vertical",{row:"B",column:9},lib.grid)); 
		assert.equal(false,lib.isAllowed(ship,"vertical",{row:"I",column:9},lib.grid)); 
	});
});

