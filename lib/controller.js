var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Observer = require('./observer.js');
var observer = new Observer();
var Grid =  require('./grid');


// var player=function(req,res,next){
// 	if(req.cookies.name)
// 		req.player = {name:req.cookies.name};
// 	next();
// };

// var ensureLogin = function(req,res,next){
// 	if(req.cookies.name){
// 		next();	
// 	} 
// 	else res.redirect('/');
// };

app.injectObserver =function(observer){
	app.observer = observer;
};


var reinitiate_usedCoordinates = function(req,res,next) {
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var player = game[0].currentPlayer(req.cookies.name);
	player.grid.usedCoordinates = [];
	next();
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/shipPlacingPage.html",reinitiate_usedCoordinates)

app.use(express.static('./public'));

app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/index.html')
});

// app.use('/player',ensureLogin);

app.post('/player',function(req,res){
	var grid = new Grid();
	app.observer.allocatePlayer(req.body.name,grid);
	res.cookie('name',req.body.name+app.observer.games[app.observer.games.length-1].gameID);	
	res.redirect('/shipPlacingPage.html');
});

app.get('/makeReady',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var player = game[0].currentPlayer(req.cookies.name);
	if (player.grid.usedCoordinates.length==17) {
		player.isReady=true;
		game[0].players[0].turn = true;
		res.send(JSON.stringify(game[0].canStartPlaying()));	
	}
	else{
		res.send(JSON.stringify('select more ships'));
	}
});

app.post('/placingOfShip',function(req,res){
	var shipInfo = req.body;
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var player = game[0].currentPlayer(req.cookies.name);
	game[0].positionShip(shipInfo,player);
	res.send(player.grid.usedCoordinates);
});

app.get('/usedSpace',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var player=game[0].currentPlayer(req.cookies.name);
	res.send(player.grid.usedCoordinates);
})

app.post('/attack',function(req,res){
	var allHits = [];
	var sunkShips=[];
	var attackPoint = '';
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var mySelf = game[0].currentPlayer(req.cookies.name);
	var enemy = game[0].enemyPlayer(req.cookies.name);

	var point = req.body.point;
	if(mySelf.turn){
		result = enemy.if_it_is_Hit(point);
		if(result)
			mySelf.hits.push(point);
		else
			mySelf.misses.push(point);
		mySelf.turn =false;
		enemy.turn = true;
		res.send(1);
	};
	res.end(0);
});

app.get('/givingUpdate',function(req,res){
	var update = {};
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var mySelf = game[0].currentPlayer(req.cookies.name);
	var enemy = game[0].enemyPlayer(req.cookies.name);
	update['ownStatusTable'] = {table:'ownStatusTable',stat:mySelf.list_of_isAlive_of_each_ship()};
	update['enemyStatusTable'] = {table:'enemyStatusTable',stat:enemy.list_of_isAlive_of_each_ship()};
	update['ownHit'] = {table:'own',stat:mySelf.grid.destroyed,color:"red"};
	update['enemyMiss'] = {table:"enemy",stat:mySelf.misses,color:"paleturquoise"};
	update['enemyHit'] = {table:"enemy",stat:mySelf.hits,color:"red"};
	update['isGameOver'] = game[0].is_any_player_died();
	update['isTurn'] = mySelf.turn;
	res.send(update);
})

app.get('/gameOver',function(req,res){
	var game = app.observer.gameOfCurrentPlayer(req.cookies.name);
	var player1 = game[0].players[0],
		player2 = game[0].players[1],
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
});

app.injectObserver(observer);

module.exports = app;