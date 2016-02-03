var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');

controller.injectObserver({});

describe('controller',function(){
	describe('/',function(){
		it('should give homePage',function(done){
		request(controller)
			.get('/')
			.expect(/<title>Battleship/)
			.expect('Content-Type',/text\/html/)
			.expect(200,done)
		});
	});

	describe('/makeReady',function(){
		it('should allow to start game',function(done){
			var game = {
							players : ['nabeel', 'shibi'],
							arePlayersReady : function(){return true}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};
			controller.injectObserver(observer);

			request(controller)
				.get('/makeReady')
				.set('cookie',['gameId=somthing'])
				.expect(200,done);
		});
	});

	describe('/usedSpace',function(){
		it('should give used coordinates of user',function(done){
			var game = {
							players : ['nabeel', 'shibi'],
							usedCoordinatesOfPlayer : function(){return [];}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};
			controller.injectObserver(observer);

			request(controller)
			.get('/usedSpace')
			.expect('Content-Type',/application\/json/)
			.expect(200,done);
		});
	});

	describe('/attack',function(){
		it('should give attacking points if it is a hit',function(done){
			var game = {
						isHit : function(){return true;},
						removeHitPoint:function(){},
						checkForAllShipsSunk:function(){},
						insert_point_into_hitPoints:function(){},
						changeTurn : function(){},
						currentPlayerTurn : function(){return true}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};
			controller.injectObserver(observer);

			request(controller)
			.post('/attack')
			.send({point:"a1"})
			.set('cookie',['name=shibi'])
			.expect('Content-Type',/text\/html/)
			.expect('success')
			.expect(200,done);
		});

		it('should give attacking points if it is a miss',function(done){
			var game = {
						isHit : function(){return false;},
						insert_point_into_missPoints:function(){},
						changeTurn : function(){},
						currentPlayerTurn : function(){return true}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};
			controller.injectObserver(observer);

			request(controller)
			.post('/attack')
			.send({point:"a1"})
			.set('cookie',['name=shibi'])
			.expect('Content-Type',/text\/html/)
			.expect('success')
			.expect(200,done);
		});
	});

	describe('/givingUpdate',function(){
		it('should give updates of own and enemy grid',function(done){
			var status = {
				currentPlayerShips	: 1,
				enemyPlayerShips	: 1,
				destroyedPoints		: [],
				missPoints			: [],
				hitPoints 			: [],
				turn 				: true
			}
			var game = {
				playersStatus:function(){return status},
				is_any_player_died:function(){}
			};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
				}
			};
			controller.injectObserver(observer);

			request(controller)
			.get('/givingUpdate')
			.expect('Content-Type',/application\/json/)
			.expect(200,done);
		});
	});

	describe('/gameOver',function(){
		it('should give game summary',function(done){
			var game = {
						gameOver:function(){return true}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};

			controller.injectObserver(observer);

			request(controller)
			.get('/gameOver')
			.expect('Content-Type',/text\/json/)
			.expect(200,done);
		});
	});

	describe('',function(){
		it('should return after checking',function(done){
			request(controller)
				.post('')
				.expect(404,done);
		});
	});

});
