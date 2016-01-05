var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');

describe('controller',function() {
	describe('/',function(){
		it('should give homePage',function(done){
		request(controller)
			.get('/')
			.expect(/<title>Battleship(.*)/)
			.expect('Content-Type',/text\/html/)
			.expect(200,done)
		});
	})
});