var webdriver = require('selenium-webdriver'),
	chrome = require('selenium-webdriver/chrome'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder().forBrowser('chrome').build();

var fillInformation = function(){
	driver.findElement(By.name('name')).sendKeys('Robot');
	// driver.findElement(By.name('gameId')).sendKeys('9994');
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

var attacker = function() {
	driver.wait(function(){
		return driver.isElementPresent(webdriver.By.id("enemy"));
	},10000).then(function(){
		console.log(driver.getPageSource("Enemy's turn"));
	})

}

driver.get('http://battleship-step2015.rhcloud.com/');
fillInformation().place().attack();
driver.quit();

// driver.quit();