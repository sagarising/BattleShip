var controller = require('../controller.js');
var assert = require('chai').assert;
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
	describe('/show',function(){
		it('should give details',function(done){
			request(controller)
				.get('/show')
				.expect(200,done);
		})
	});
});

describe('controller',function(){
	describe('/player',function(){
		it('should return name of player',function(done){
			request(controller)
				.post('/player')
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

