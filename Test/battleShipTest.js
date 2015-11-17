var assert = require('chai').assert;
var lib = require('battleshipLib.js').lib;
var test = {};
exports.test = test; 

test["find out whether firstPoint selected is allowed or not"]=function(){
	assert.equal(true,isAllowed(arguments)); 
}

