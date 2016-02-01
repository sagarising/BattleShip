var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Observer = require('./observer.js');
var observer = new Observer();
var Grid =  require('./grid');
var db = require('./db.js');

app.injectObserver =function(observer){
	app.observer = observer;
};

var reinitiate_usedCoordinates = function(req,res,next) {
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	game.reinitiatingUsedCoordinates(req.cookies);
	next();
};


var setgameID = function(req,res) {
	if(req.body.gameId)
		return "P"+req.body.gameId;
	else
		return app.observer.games[app.observer.games.length-1].gameID;
};


app.set('view engine','jade');


app.get('/',function(req,res){
	res.render('login');
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/reset",reinitiate_usedCoordinates);
app.use(express.static('./public'));




app.post('/login',function(req,res){
	if(!req.body.gameId)
		app.observer.allocatePlayer(req.body.name,new Grid());
	else
		app.observer.allocatePlayerToSpecificGame(req.body.name,new Grid(),"P"+req.body.gameId);
	var gameID = setgameID(req,res);
	res.cookie('name',req.body.name);	
	res.cookie('gameId',gameID);
	res.render('shipDeployment',{playerInfo:req.body.name +' GameId: '+gameID});
});

app.get('/reset',function(req,res){
	var name = req.cookies.name;
	var gameID = req.cookies.gameId;
	res.render('shipDeployment',{playerInfo:name +' GameId: '+gameID});
});

app.post('/placingOfShip',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.placedShipsPosition(req.body,req.cookies));
});

app.get('/makeReady',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.arePlayersReady(req.cookies));
});
app.get('/gamePage',function(req,res){
	var name = req.cookies.name;
	var gameID = req.cookies.gameId;
	res.render('game',{playerInfo:name +' GameId: '+gameID});
});
app.get('/getResult',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	var stat = game.gameOver();
	console.log(game,stat);
	res.render('result');
})
app.get('/usedSpace',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.usedCoordinatesOfPlayer(req.cookies));
});

app.post('/attack',function(req,res){
	var attackedPoint = req.body.point;
	var playerName = req.cookies.name;
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	if(!game.currentPlayerTurn(playerName)){
		res.send('denied');
		return;
	}
	if(game.isHit(attackedPoint,playerName)){
		game.removeHitPoint(attackedPoint,playerName);
		game.checkForAllShipsSunk(playerName)
		game.insert_point_into_hitPoints(attackedPoint,playerName);
	}
	else
		game.insert_point_into_missPoints(attackedPoint,playerName);
	game.changeTurn(playerName);
	res.send('success');
});

app.get('/givingUpdate',function(req,res){
	var update = {};
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	var status = game.playersStatus(req.cookies.name);
	update = {
			ownStatusTable    : {table:'ownStatusTable',stat:status.currentPlayerShips},
			enemyStatusTable  : {table:'enemyStatusTable',stat:status.enemyPlayerShips},
			ownHit            : {table:'own',stat:status.destroyedPoints,color:'red'},
			enemyMiss         : {table:"enemy",stat:status.missPoints,color:"darkseagreen"},
			enemyHit          : {table:"enemy",stat:status.hitPoints,color:"red"},
			isGameOver        : game.is_any_player_died(),
			isTurn            : status.turn
	}
	res.send(update);
});



app.get('/gameOver',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	var stat = game.gameOver();
	res.send(stat);
});

app.get('/highscore',function(req,res){
	db.getHighscore(res);
});

app.use("/player",function(err, req, res, next) {
	if(err){
  	res.send(err.message);
	}
});

app.use("/placingOfShip",function(err, req, res, next) {
	if(err){
  	res.send(err.message);
	}
});

app.injectObserver(observer);

module.exports = app;
