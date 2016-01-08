var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');


controller.injectObserver({});

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
	// describe('/player',function(){
	// 	it('should give next page called shipPlacingPage',function(done){
	// 		var observer = {
	// 			games: [{gameID:"game1"}],
	// 			allocatePlayerToSpecificGame:function(){}
	// 		};
	// 		var body = {name:"shibi",gameId:"somthing"};
	// 		controller.injectObserver(observer);
	// 		request(controller)
	// 			.post('/player')
	// 			// .type('json')
 //                .send(JSON.stringify(body))
	// 			.expect(302)
	// 			.expect('Location','/shipPlacingPage.html', done);
	// 	})
	// })
	describe('/makeReady',function(){
		it('should allow to start game if all players are made ready',function(done){
			var game = {
							currentPlayer :function(){return player},
							canStartPlaying : function(){ return true;}
						};
			var player = {
							makeReady:function(){return true;}
			
						};
			var games = [game];
			
			var observer = {
				gameOfCurrentPlayer : function() {
						return games;
					}
			};
			controller.injectObserver(observer);

			request(controller)
				.get('/makeReady')
				.set('cookie',['gameId=somthing'])
				.expect('true')
				.expect(200,done);
		});
		it('should say "select more ships" if the player is not ready',function(done){
			var game = {
							currentPlayer :function(){return player},
							canStartPlaying : function(){ return true;}
						};
			var player = {
							makeReady:function(){return false;}
			
						};
			var games = [game];
			
			var observer = {
				gameOfCurrentPlayer : function() {
						return games;
					}
			};
			controller.injectObserver(observer);

			request(controller)
				.get('/makeReady')
				.set('cookie',['gameId=somthing'])
				.expect('select more ships')
				.expect(200,done);
		});
	});
	// describe('/placingOfShip',function(){
	// 	it('should give used coordinates of user',function(done){
	// 		var game = {
	// 						players : ['sooraj', 'shibi'],
	// 						placedShipsPosition : function(){return []}
	// 					};
	// 		var observer = {
	// 			gameOfCurrentPlayer : function() {
	// 				console.log("hahahahahahhahahahhahah")
	// 					return game;
	// 				}
	// 		};
	// 		controller.injectObserver(observer);

	// 		request(controller.injectObserver({}))
	// 			.post('/placingOfShip')
	// 			.set('cookie',['gameId=somthing'])
	// 			.expect(200,done);
	// 	})
	// })
	describe('/usedSpace',function(){
		it('should give used coordinates of user',function(done){					
			var game = {
							currentPlayer :function(){return player},
						};
			var player = {
							grid:{
								usedCoordinates:['a1','a2']
							}
			
						};
			var games = [game];
			
			var observer = {
				gameOfCurrentPlayer : function() {
						return games;
					}
			};
			controller.injectObserver(observer);

			request(controller)
			.get('/usedSpace')
			.expect('Content-Type',/application\/json/)
			.expect(['a1','a2'])
			.expect(200,done);
		})
	})
	describe('/attack',function(){
		it('should give attacking points are hit or miss',function(done){
			var game = {
						currentPlayer :function(){return player},
						isHit : function(){return true;},
						removeHitPoint:function(){},
						checkForAllShipsSunk:function(){},
						insert_point_into_hitPoints:function(){},
						changeTurn : function(){}
						};
			var observer = {
				gameOfCurrentPlayer : function() {
						return game;
					}
			};
			controller.injectObserver(observer);

			request(controller)
			// .post('/attack')
			// .send({point:"a1"})
			// .set('cookie',['name=shibi'])
			// .expect('Content-Type',/text\/html/)
			// .expect('success')
			// .expect(200,done);
		})
	})
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
			.expect('Content-Type',/text\/html/)
			.expect(200,done);
		})
	})
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
