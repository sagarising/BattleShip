var Grid = require('../lib/grid');
var assert = require('chai').assert;

describe('Grid',function(){
	describe('isUsedSpace',function(){
		var grid = new Grid();
		grid.usedCoordinates = ['A1','A2','A3','B6','C6','D6','E6'];
		it('should give true if given coordinates are already uesd',function(){
			var coordinates = ['A1','A2'];
			var result = grid.isUsedSpace(coordinates);
			assert.equal(result,true);
		});
		it('should give false if given coordinates are not used yet',function(){
			var coordinates = ['I1','I2','I3'];
			var result = grid.isUsedSpace(coordinates);
			assert.equal(result,false);
		});
	});
});