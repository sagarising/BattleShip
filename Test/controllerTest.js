var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');



describe('controller',function(){
	describe('/',function(){
		it('should give homePage',function(done){
		request(controller)
			.get('/')
			.expect(/<title>Battleship(.*)/)
			.expect('Content-Type',/text\/html/)
			.expect(200,done)
		});
	})
	describe('/player',function(){
		it('should give next page called shipPlacingPage',function(done){
			request(controller)
				.post('/player')
				.expect(302)
				.expect('Location','/shipPlacingPage.html', done);
		})
	})
	describe('/makeReady',function(){
		it('should allow to start game',function(done){
			request(controller)
				.get('/makeReady')
				.expect('Content-Type',/text\/html/)
				.expect(200,done);
		})
	})
	describe('/placingOfShip',function(){
		it('should give used coordinates of user',function(done){
			request(controller)
			.post('/placingOfShip')
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
	describe('/usedSpace',function(){
		it('should give used coordinates of user',function(done){
			request(controller)
			.get('/usedSpace')
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
	describe('/attack',function(){
		it('should give attacking points are hit or miss',function(done){
			request(controller)
			.post('/attack')
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
	describe('/givingUpdate',function(){
		it('should give updates of own and enemy grid',function(done){
			request(controller)
			.get('/givingUpdate')
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
	describe('/gameOver',function(){
		it('should give game summary',function(done){
			request(controller)
			.get('/gameOver')
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
	describe('',function(){
		it('should return after checking',function(done){
			request(controller)
				.post('')
				.expect(404,done);
		})
	});

});
