var casper = require('casper').create();

var x=require('casper').selectXPath;
casper.start('http://localhost:5000');
casper.then(function(){
	this.sendKeys('#name','Abhishek')
	console.log('Name filled')
})

casper.run();