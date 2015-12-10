var fs = require('fs');
var querystring = require('querystring');
var lib = require('./battleShip.js');
game = new lib.Game();
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};

var checkAndSubmit = function(req,res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var placingInfo = querystring.parse(data);
		var name = placingInfo.shipName;
		var shipIndex = placingInfo.shipSize;
		var startingPoint = placingInfo.coordinate;
		var align = placingInfo.align;
		var player = game.currentPlayer(req.headers.cookie);
		lib.positionShip(player.ships[shipIndex],align,startingPoint,player.grid);
		res.end(JSON.stringify(player.grid.usedCoordinates));
	});
};

var createPlayer = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		debugger;
		var entry = querystring.parse(data);
		game.addPlayer(new lib.Player(entry.name));
		
		res.writeHead(200,
			{'Set-Cookie':entry.name});
		res.end(JSON.stringify(entry.name))
	});
};

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};

var showDetails = function(req,res) {
	res.end(JSON.stringify(game.players));
};

var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}else{
			next();
		};
	});
};

var usedSpace = function(req,res){
	var player=game.currentPlayer(req.headers.cookie);
	res.end(JSON.stringify(player.grid.usedCoordinates))
};

var routingToGame = function(req,res){
	var player = game.currentPlayer(req.headers.cookie);
	if (player.grid.usedCoordinates.length==17) {
		player.isReady=true;
		game.players[0].turn = true;
		res.end(JSON.stringify(game.canStartPlaying()));	
	}
	else{
		res.end(JSON.stringify('select more ships'));
	}
};

var serveShipPlacingPage = function(req,res){
	debugger;
	var mySelf = game.currentPlayer(req.headers.cookie);
	mySelf.grid.usedCoordinates = [];
	serveStaticFile(req,res);
};

var checkAttackedPoint = function(req,res) {
	var allHits = [];
	var sunkShips=[];
	var attackPoint = '';
	var mySelf = game.currentPlayer(req.headers.cookie);
	var enemy = game.enemyPlayer(req.headers.cookie);

	req.on('data',function(chunk){
		attackPoint += chunk;
	});
	req.on('end', function(){
		var point = querystring.parse(attackPoint).point;
		if(mySelf.turn){
			result = enemy.if_it_is_Hit(point);
			if(result)
				mySelf.hits.push(point);
			else
				mySelf.misses.push(point);
			mySelf.turn =false;
			enemy.turn = true;
			res.end(JSON.stringify(1));
		};
		res.end(JSON.stringify(0));
	});
};

var fileNotFound = function(req, res){
	res.statusCode = 404;
	console.log(req.url);
	res.end('Not Found');
};

var updates = function(req,res){
	var update = {};
	var mySelf = game.currentPlayer(req.headers.cookie);
	var enemy = game.enemyPlayer(req.headers.cookie);

	update['ownStatusTable'] = {table:'ownStatusTable',stat:mySelf.list_of_isAlive_of_each_ship()};
	update['enemyStatusTable'] = {table:'enemyStatusTable',stat:enemy.list_of_isAlive_of_each_ship()};
	update['ownHit'] = {table:'own',stat:mySelf.grid.destroyed,color:"red"};
	update['enemyMiss'] = {table:"enemy",stat:mySelf.misses,color:"paleturquoise"};
	update['enemyHit'] = {table:"enemy",stat:mySelf.hits,color:"red"};
	update['isGameOver'] = game.if_a_player_dies();
	update['isTurn'] = mySelf.turn;
	res.end(JSON.stringify(update));	
};

var gameOver = function(req,res) {
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
		res.end(JSON.stringify(gameSummary));
}

exports.post_handlers = [
	{path: '^/player$', handler: createPlayer},
	{path:'^/placingOfShip$',handler:checkAndSubmit},
	{path:'^/attack$',handler:checkAttackedPoint},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/show$', handler: showDetails},
	{path: '^/usedSpace$',handler:usedSpace},
	{path:'^/makeReady$',handler:routingToGame},
	{path:'^/givingUpdate$',handler:updates},
	{path:'^/gameOver$',handler:gameOver},
	{path:'^/shipPlacingPage.html$',handler:serveShipPlacingPage},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

