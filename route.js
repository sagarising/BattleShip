var fs = require('fs');
var querystring = require('querystring');
var lib = require('./battleShip.js');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
// <<<<<<< HEAD
// =======

var currentPlayer = function(players,cookie){
	var player_who_requested;
	players.forEach(function(element){
		if(element.name == cookie){
			player_who_requested = element;
		};
	});
	return player_who_requested;
};

var enemyPlayer = function(players,cookie){
	var index = +(!players.indexOf(currentPlayer(players,cookie)));
	return players[index];
}

// var checkAndSubmit = function(req, res){
// >>>>>>> fc5cee57354eef60211f8239bd656b875b278df0
var checkAndSubmit = function(req,res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var args = data.split(" ");
		var name = args[0];
		var shipIndex = args[1];
		var startingPoint = args[2];
		var align = args[3];
// <<<<<<< HEAD
// 		var player=currentPlayer(playerName);
// 		console.log(player,'player ...')
// 		lib.positionShip(player.ships[index],align,startingPoint,lib.players[0].grid);
// 		res.end(JSON.stringify(lib.players[0].grid.usedCoordinates));
// =======
		var player = currentPlayer(lib.players,req.headers.cookie);
		lib.positionShip(player.ships[shipIndex],align,startingPoint,player.grid);
		res.end(JSON.stringify(player.grid.usedCoordinates));
// >>>>>>> fc5cee57354eef60211f8239bd656b875b278df0
	});
}

// var currentPlayer=function(playerName){
// 	var player;
// 	lib.players.forEach(function(eachPlayer){
// 		if(eachPlayer.name==playerName)
// 			player=eachPlayer;
// 	});
// 	return player;
// };

var createPlayer = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var entry = querystring.parse(data);
		lib.players.push(new lib.Player(entry.name));
		res.writeHead(200,
			{'Set-Cookie':entry.name});
		res.end()
	});
};

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};

var showDetails = function(req,res) {
	res.end(JSON.stringify(lib.players));
}

var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			next();
		}
	});
};

// <<<<<<< HEAD
var usedSpace = function(req,res){
	var player=currentPlayer(lib.players,req.headers.cookie);
	res.end(JSON.stringify(player.grid.usedCoordinates))
	// console.log(playerName,'playerName.;.;')
};

// var placeShip = function(req,res,next,name) {
// 	var response = {};
// 	var player;
// 	var shipToPlace;
// 	var shipData = '';
// 	req.on('data',function(chunk){
// 		lib.players.forEach(function(eachPlayer){
// 			if(eachPlayer.name == name)
// 				player = eachPlayer;
// 		})
// 		shipData +=chunk; 
// 		var shipDetails = querystring.parse(shipData);
// 		var ship = shipDetails.shipName;
// 		var align = shipDetails.align;
// 		var firstPoint = shipDetails.fp;
// 		player.ships.forEach(function(eachShip){
// 			if(eachShip.shipName == ship)
// 				shipToPlace = eachShip;
// 		})
// 		if(lib.positionShip(shipToPlace,align,firstPoint,player.grid)){
// 			req.on('end',function(){
// 				response.result = 'ok';
// 				response.ship = shipToPlace.coordinates;
// 				res.end(JSON.stringify(response));
// 			})
// 		}
// 	})
// }
// =======
var areBothReady = function(){
	return lib.players.every(function(player){
		return player.isReady;
	});	
};

var routingToGame = function(req,res){
	var player = currentPlayer(lib.players,req.headers.cookie);
	player.isReady=true;
	res.end(Number(areBothReady()&&lib.players.length == 2).toString());
};

var checkAttackedPoint = function(req,res) {
	var attackPoint = '';
	lib.players[0].turn = true;
	var mySelf = currentPlayer(lib.players,req.headers.cookie);
	var enemy = enemyPlayer(lib.players,req.headers.cookie);
	if(mySelf.turn){
		req.on('data',function(chunk){
			attackPoint+=chunk;
		})
		if(lib.hitOrMiss(attackPoint)){
			// emitter.emit('removeAttackedPoint')
			req.end(true)
		}
		mySelf.turn =false;
		enemy.turn = true;
	}
}

// >>>>>>> fc5cee57354eef60211f8239bd656b875b278df0

var fileNotFound = function(req, res){
	res.statusCode = 404;
	console.log(req.url);
	res.end('Not Found');
};

exports.post_handlers = [
	{path: '^/player$', handler: createPlayer},
	{path:'^/placingOfShip$',handler:checkAndSubmit},
	{path:'^/attack$',handler:checkAttackedPoint},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [

	{path: '^/$', handler: serveIndex},
	{path: '^/show$', handler: showDetails},
// <<<<<<< HEAD
	{path: '^/usedSpace$',handler:usedSpace},
	// {path: '^/ready$', handler: isReady},
	// {path: '^/gamePage.html$', handler: isReady},
// =======
	{path:'^/makeReady$',handler:routingToGame},
// >>>>>>> fc5cee57354eef60211f8239bd656b875b278df0
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

