var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Observer = require('./observer.js');
var observer = new Observer();
var Grid =  require('./grid');
var helmet = require('helmet');

// var ensureLogin = function(req,res,next){
// 	if(req.body.name) next();	
// 	else res.redirect('/');
// };

var reinitiate_usedCoordinates = function(req,res,next) {
	observer.reinitiatingUsedCoordinates(req.cookies);
	next();
}

var setPlayerCookie = function(req,res) {
	res.cookie('name',req.body.name);	
	res.cookie('gameId', observer.games[observer.games.length-1].gameID);
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/shipPlacingPage.html",reinitiate_usedCoordinates);
app.use(express.static('./public'));


app.post('/player',function(req,res){
	observer.allocatePlayer(req.body.name,new Grid());
	setPlayerCookie(req,res);
	res.redirect('/shipPlacingPage.html');
});

app.post('/placingOfShip',function(req,res){
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.placedShipsPosition(req.body,req.cookies));
});

app.get('/makeReady',function(req,res){
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.arePlayersReady(req.cookies));
});

app.get('/usedSpace',function(req,res){
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.usedCoordinatesOfPlayer(req.cookies));
})

app.post('/attack',function(req,res){
	var attackedPoint = req.body.point;
	var playerName = req.cookies.name;
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	if(game.isHit(attackedPoint,playerName)){
		game.removeHitPoint(attackedPoint,playerName);
		game.checkForAllShipsSunk(playerName)
		game.insert_point_into_hitPoints(attackedPoint);
	}
	else
		game.insert_point_into_missPoints(attackedPoint);
});

app.get('/givingUpdate',function(req,res){
	var update = {};
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	var mySelf = game.currentPlayer(req.cookies.name);
	var enemy = game.enemyPlayer(req.cookies.name);
	update['ownStatusTable'] = {table:'ownStatusTable',stat:mySelf.list_of_isAlive_of_each_ship()};
	update['enemyStatusTable'] = {table:'enemyStatusTable',stat:enemy.list_of_isAlive_of_each_ship()};
	update['ownHit'] = {table:'own',stat:mySelf.grid.destroyed,color:"red"};
	update['enemyMiss'] = {table:"enemy",stat:mySelf.misses,color:"paleturquoise"};
	update['enemyHit'] = {table:"enemy",stat:mySelf.hits,color:"red"};
	update['isGameOver'] = game.is_any_player_died();
	update['isTurn'] = mySelf.turn;
	res.send(update);
})

app.get('/gameOver',function(req,res){
	var game = observer.gameOfCurrentPlayer(req.cookies.gameId);
	var player1 = game.players[0],
		player2 = game.players[1],
		winner,looser;
		if(player1.isAlive){
			winner = player1;
			loser = player2;
		}
		else{
			winner = player2;
			loser = player1;
		}
		var winnerStatus = winner.list_of_isAlive_of_each_ship();
		var gameSummary = {winner:winner,loser:loser,shipsStatus:winnerStatus};

		res.send(gameSummary);
})

module.exports = app;