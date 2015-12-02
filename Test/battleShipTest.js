var assert = require('chai').assert;
var expect = require('chai').expect;
var lib = require('../battleShip.js');
var test = {};
exports.test = test; 



describe('Ship',function(){
	it('should initialize ship object',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		expect(ship).to.be.a('object');
	});
	it('returned ship must have only coordinates with null values',function(){
		var player = new lib.Player('ram');
		var ship1 = new lib.lib.Ship(3,player); 
		expect(ship1).to.have.all.keys({coordinates:[null,null,null]});
	});
});

describe('isAllowed',function(){
	it('should check if the firstpoint is valid for placing ship aligned vertical',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(5,player);
		assert.equal(true,lib.lib.isAllowed(ship,"vertical","B9",new lib.lib.gridCreater())); 
		assert.equal(false,lib.lib.isAllowed(ship,"vertical","I9",new lib.lib.gridCreater())); 
	});
	it('should check if the firstpoint is valid for placing ship aligned horizontal',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(5,player);
		assert.equal(true,lib.lib.isAllowed(ship,"vertical","B9",new lib.lib.gridCreater())); 
		assert.equal(false,lib.lib.isAllowed(ship,"vertical","I9",new lib.lib.gridCreater())); 
	});
});

describe('gridCreater',function(){
	it('should have initially no used coordinate',function(){
		var grid = new lib.lib.gridCreater();
		expect(grid).to.have.property('usedCoordinates').that.is.an('array').to.be.empty;
	})
})

describe('isUsedSpace',function(){
	it('should return true if coordinate exists in used coordinates',function(){
		var grid = new lib.lib.gridCreater();
		grid.usedCoordinates = ['A1'];
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		ship.coordinates = ['A1','A2','A3'];
		assert.equal(true,grid.isUsedSpace(ship.coordinates));
	});
	it('should return false if coordinate does not exists in used coordinates',function(){
		var grid = new lib.lib.gridCreater();
		grid.usedCoordinates = ['B2'];
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		assert.equal(false,grid.isUsedSpace(ship.coordinates));
	});
});

describe('positionShip',function(){
	it('should position the ship and return ship with some filled coordinates for vertical',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		var align='vertical';
		firstpoint = 'A4';
		var grid = new lib.lib.gridCreater();
		var expected = {coordinates:['A4','B4','C4']}
		lib.positionShip(ship,align,firstpoint,grid);
		assert.equal(JSON.stringify(expected),JSON.stringify(ship));
	});
	it('should position the ship and return ship with some filled coordinates for horizontal',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		var align='horizontal';
		firstpoint = 'A1';
		var grid = new lib.lib.gridCreater();
		var expected = {coordinates:['A1','A2','A3']}
		lib.positionShip(ship,align,firstpoint,grid);
		assert.equal(JSON.stringify(expected),JSON.stringify(ship));
	});
	it('should return error if the ship cannot be placed',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		var align='vertical';
		firstpoint = 'I4';
		var grid = new lib.lib.gridCreater();
		var boundFunction = lib.positionShip.bind(null,ship,align,firstpoint,grid);
		assert.throw(boundFunction,Error,'Cannot position ship here.');
	});
	it('should return error if the ship cannot be placed over used space and expect ship to be unchanged',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		var align='vertical';
		firstpoint = 'B4';
		var grid = new lib.lib.gridCreater();
		grid.usedCoordinates = ['C4'];
		var boundFunction = lib.positionShip.bind(null,ship,align,firstpoint,grid);
		assert.throw(boundFunction,Error,'Cannot place over other ship.');
		expect(ship).to.have.all.keys({coordinates:[null,null,null]});
	});
});
describe('makesCoordinate',function(){
	it('should check when initilCharCode is undefined and gives new generated coordinates',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		firstpoint = 'A4';
		var initilColumnNumber = firstpoint.slice(1);
		var expected = ['A4','A5','A6'];
		assert.equal(JSON.stringify(expected),JSON.stringify(lib.lib.makesCoordinates(ship,firstpoint,undefined,initilColumnNumber)));
	})
	it('should check when initilCharCode is defined and gives new generated coordinates',function(){
		var player = new lib.Player('ram');
		var ship = new lib.lib.Ship(3,player);
		firstpoint = 'A4';
		var initilCharCode = firstpoint.charCodeAt(0);
		var initilColumnNumber = firstpoint.slice(1);
		var expected = ['A4','B4','C4'];
		assert.equal(JSON.stringify(expected),JSON.stringify(lib.lib.makesCoordinates(ship,firstpoint,initilCharCode,initilColumnNumber)));
	})
})

describe('PlayerCreator',function(){
	it('should make object',function(){
		var player = new lib.Player('ram');
		expect(player).to.be.a('object')
	});
	it('should have some properties',function(){
		var player = new lib.Player('ramu');
		expect(player).to.have.all.keys('name','ships','grid','isReady')
	})
})