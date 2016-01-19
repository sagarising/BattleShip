var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Observer = require('./observer.js');
var observer = new Observer();
var Grid =  require('./grid');
var db = require('./db.js');
var pg = require('pg');

app.injectObserver =function(observer){
	app.observer = observer;
};

var reinitiate_usedCoordinates = function(req,res,next) {
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	game.reinitiatingUsedCoordinates(req.cookies);
	next();
};

var setPlayerCookie = function(req,res) {
	res.cookie('name',req.body.name);	
	if(req.body.gameId)
		res.cookie('gameId',"P"+req.body.gameId)
	else
		res.cookie('gameId',app.observer.games[app.observer.games.length-1].gameID);
};
var insertHighScorer = function(){
	db.getInfo();
};
// app.use(app.router);

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/shipPlacingPage.html",reinitiate_usedCoordinates);
app.use(express.static('./public'));


app.post('/player',function(req,res){
	// db.insertInfo(1,'abhi',19);
	// insertHighScorer();
	// db.getInfo();
	if(!req.body.gameId)
		app.observer.allocatePlayer(req.body.name,new Grid());
	else
		app.observer.allocatePlayerToSpecificGame(req.body.name,new Grid(),"P"+req.body.gameId);
	setPlayerCookie(req,res);
	res.redirect('/shipPlacingPage.html');
});

app.post('/placingOfShip',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.placedShipsPosition(req.body,req.cookies));
});

app.get('/makeReady',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.gameId);
	res.send(game.arePlayersReady(req.cookies));
});

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
	var winner = JSON.parse(stat.won);
	var accuracy = Math.round(((winner.hits.length+winner.misses.length)/winner.hits.length)*100);
	db.insertInfo(winner.name,accuracy);
	res.send(stat);
});

app.get('/highscore',function(req,res){
	var result = [];
	var conString = "postgres://postgres:Thoughtworks@1994@localhost:5433/battleship";
	pg.connect(conString,function(err,client,done){
		if(err) console.log(err);
		var query = client.query('select * from highscores order by accuracy desc limit 5')
		query.on('row',function(row){
			result.push(row);
		});	
		query.on('end',function(){
			client.end();
			res.send(JSON.stringify(result));
		});
	});
})

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