var webdriver = require('selenium-webdriver'),
	chrome = require('selenium-webdriver/chrome'),
	firefox = require('selenium-webdriver/firefox'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder().forBrowser('chrome').build();

var fillInformation = function(){
	driver.findElement(By.name('name')).sendKeys(process.argv[2]);
	driver.findElement(By.name('gameId')).sendKeys(process.argv[3]);
	driver.findElement(By.tagName('button')).click();
	return {place:placingShips};
}

var placingShips = function() {
	driver.wait(function(){
		return driver.isElementPresent(webdriver.By.id("shipDeployment"));
	},1000).then(function(){

		driver.findElement(By.id('A1')).click();
		driver.sleep(1000);
		driver.findElement(By.id('B1')).click();
		driver.sleep(1000);
		driver.findElement(By.id('C1')).click();
		driver.sleep(1000);
		driver.findElement(By.id('D1')).click();
		driver.sleep(1000);
		driver.findElement(By.id('E1')).click();
		driver.sleep(1000);
		driver.findElement(By.id('ready')).click();
	});
	return {attack:attacker};
}

var allPoints = function(){
	var points = [];
	for (var i=65;i<75;i++){
		for(var j=1;j<11;j++)
			points.push(String.fromCharCode(i)+j);
	};
	return points;
}

var attacker = function() {
	var points = allPoints(),i=0;
	driver.wait(function(){
		return driver.isElementPresent(webdriver.By.id("enemy"));
	},20000).then(function(){
		driver.sleep(2000);
		setInterval(function(){
			driver.findElement(By.className('turn')).getText().then(function(turn){
				if(turn == "Your turn"){
					console.log(turn,points[i]);
					driver.findElement(By.css('#enemy #'+points[i++])).click();
				}
			})
		},1000)
	})

}

driver.get('http://localhost:5000/');    //this is the url its going to hit
fillInformation().place().attack();
// driver.quit();

// driver.quit();