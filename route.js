var fs = require('fs');
var querystring = require('querystring');
// var comments = require('./comments.js');
var lib = require('./battleShip.js');

// var template = fs.readFileSync('./templates/guestBook.html', 'utf8');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
// var renderGuestBook = function(req, res){
// 	res.end(template.replace(/__COMMENTS_TABLE__/, comments.generateTable()));
// };
// var getComments = function(req,res){
// 	res.end(JSON.stringify(comments.getAll()));
// };
var createPlayer = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var entry = querystring.parse(data);
		lib.Player(entry.name,lib.grid,[]);
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
	console.log(res.statusCode);
};
// var redirectToGuestPage = function(req, res){
// 	res.writeHead(302, {Location: '/guestBook'});
// 	res.end();
// };

exports.post_handlers = [
	{path: '^/player$', handler: createPlayer},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

