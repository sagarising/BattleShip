var assert = require('chai').assert;
var lib = require('../battleShip.js').lib;
var test = {};
exports.test = test; 

test["find out whether firstPoint selected is allowed or not"]=function(){
	var ship = new lib.Ship(5)
	assert.equal(true,isAllowed(ship,"vertical",{row:"B",column:9},lib.grid)); 
};

