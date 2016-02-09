var $ = require('jquerygo');
var async = require('async');

$.config.site = 'http://localhost:5000';
$.config.addJQuery = false;


async.series([
	$.go('visit','/'),
	$('#name').go('val','Abhishek'),
	$('button').go('click'),
	$.go('waitForElement'),
	function(done){
		$('#A1').text(function(text){
			console.log(text);
			done();
		})
	}
],function(){
	console.log("Done")
	$.capture('Ship.jpg')
	$.close();
})