var http = require('http');
var fs = require('fs');
var Emitter = require('events').EventEmitter;
var emitter = new Emitter();
var clients = [];

function allowToPlay(resObject){
	resObject.write("play");
}
emitter.on("play",allowToPlay);
var requestHandler = function(req,res){
	// if(clients.indexOf(req.connection.remoteAddress));
	// 	clients.push(req.connection.remoteAddress);
	// console.log("requested",req.connection.remoteAddress);
	// if(clients.length==1){
	// 	console.log(clients.length);
	// 	res.write("wait");
	// 	// res.end()
	// }
	// else{
	// 	emitter.emit("play",res);
	// 	// res.write("play")
	// 	res.end();
	// }
	if(req.method=='POST'){
		req.on('data',function(data){
			console.log(data.toString());
		});
		res.writeHead(301,{date: new Date(),'content-type': 'text/html'});
		res.end();
	}
	else
		{
		var fileName = req.url =="/" ? "index.html" : "."+req.url;
		fs.readFile(fileName,function(error,data){
			if(error){
				res.statusCode = 404;
				res.end('Not found');
				// console.log(res.statusCode);
				return;
			}
			res.statusCode = 200;
			// console.log(res.statusCode);
			res.end(data);
		});
	}
};
var server = http.createServer(requestHandler);
server.listen(4000,console.log("listening at 4000"));