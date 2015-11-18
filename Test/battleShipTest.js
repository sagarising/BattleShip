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
	it('returned ship must have only coordinates with null values',function(){
		var ship1 = new lib.Ship(3); 
		expect(ship1).to.have.all.keys({coordinates:[null,null,null]});
	});
});

describe('isAllowed',function(){
	it('should check if the firstpoint is valid for placing ship aligned vertical',function(){
		var ship = new lib.Ship(5);
		assert.equal(true,lib.isAllowed(ship,"vertical","B9",new lib.gridCreater())); 
		assert.equal(false,lib.isAllowed(ship,"vertical","I9",new lib.gridCreater())); 
	});
	it('should check if the firstpoint is valid for placing ship aligned horizontal',function(){
		var ship = new lib.Ship(5);
		assert.equal(true,lib.isAllowed(ship,"vertical","B9",new lib.gridCreater())); 
		assert.equal(false,lib.isAllowed(ship,"vertical","I9",new lib.gridCreater())); 
	});
});

describe('gridCreater',function(){
	it('should have initially no used coordinate',function(){
		var grid = new lib.gridCreater();
		expect(grid).to.have.property('usedCoordinates').that.is.an('array').to.be.empty;
	})
})

describe('isUsedSpace',function(){
	it('should return true if coordinate exists in used coordinates',function(){
		var grid = new lib.gridCreater();
		grid.usedCoordinates = ['A1'];
		var ship = new lib.Ship(3);
		ship.coordinates = ['A1','A2','A3'];
		assert.equal(true,grid.isUsedSpace(ship.coordinates));
	});
	it('should return false if coordinate does not exists in used coordinates',function(){
		var grid = new lib.gridCreater();
		grid.usedCoordinates = ['B2'];
		var ship = new lib.Ship(3);
		assert.equal(false,grid.isUsedSpace(ship.coordinates));
	});
});

describe('positionShip',function(){
	it('should position the ship and return ship with some filled coordinates for vertical',function(){
		var ship = new lib.Ship(3);
		var align='vertical';
		firstpoint = 'A4';
		var grid = new lib.gridCreater();
		var expected = {coordinates:['A4','B4','C4']}
		assert.equal(JSON.stringify(expected),JSON.stringify(lib.positionShip(ship,align,firstpoint,grid)));
	});
	it('should position the ship and return ship with some filled coordinates for horizontal',function(){
		var ship = new lib.Ship(3);
		var align='horizontal';
		firstpoint = 'A4';
		var grid = new lib.gridCreater();
		var expected = {coordinates:['A4','A5','A6']}
		assert.equal(JSON.stringify(expected),JSON.stringify(lib.positionShip(ship,align,firstpoint,grid)));
	});
	it('should return error if the ship cannot be placed',function(){
		var ship = new lib.Ship(3);
		var align='vertical';
		firstpoint = 'I4';
		var grid = new lib.gridCreater();
		var boundFunction = lib.positionShip.bind(null,ship,align,firstpoint,grid);
		assert.throw(boundFunction,Error,'Cannot position ship here.');
	});
	it('should return error if the ship cannot be placed over used space',function(){
		var ship = new lib.Ship(3);
		var align='vertical';
		firstpoint = 'B4';
		var grid = new lib.gridCreater();
		grid.usedCoordinates = ['C4'];
		var boundFunction = lib.positionShip.bind(null,ship,align,firstpoint,grid);
		assert.throw(boundFunction,Error,'Cannot place over other ship.');
	});
});
