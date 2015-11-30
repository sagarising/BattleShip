var fs = require('fs');
var querystring = require('querystring');
var lib = require('./battleShip.js');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var checkAndSubmit = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var args = data.split(" ");
		var name = args[0];
		var index = args[1];
		var startingPoint = args[2];
		var align = args[3];
		
		lib.positionShip(lib.players[0].ships[index],align,startingPoint,lib.players[0].grid);
		console.log(lib.players[0].ships[0].coordinates,">>>>in route.js");
		res.end(JSON.stringify(lib.players[0].grid.usedCoordinates));
	});

}
var createPlayer = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var entry = querystring.parse(data);

		lib.players.push(new lib.Player(entry.name));
		res.end('Now u can start the game')
	});
};

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};
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

var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	// console.log(res.statusCode);
};

exports.post_handlers = [
	{path: '^/player$', handler: createPlayer},
	{path:'^/placingOfShip$',handler:checkAndSubmit},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

