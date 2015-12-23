var assert = require('chai').assert;
var controller = require('../controller');
var request = require('supertest');



describe('controller',function(){
	describe('/',function(){


		it('should serve the index page',function(done){
			request(controller)
				.get('/')
				.expect(/<title>Battleship<\/title>/)
				.expect(200,done);
		})
	});
});

describe('controller',function(){
	describe('',function(){
		it('should return after checking',function(done){
			request(controller)
				.post('')
				.expect(405,done);
		})
	});
});


