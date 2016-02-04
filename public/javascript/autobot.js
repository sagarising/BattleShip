var webPage = require('webpage');
var page = webPage.create();


var page = require('webpage').create();
page.open('http://localhost:5000', function() {
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function() {
    page.evaluate(function() {
    $('#name').val('nab')
    $('#gameId').val(121)	
    $("button").click();
    });
	})
    page.onLoadFinished = function() {
	  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function() {
    	page.evaluate(function() {
    		$('#A2').click()	
    		setTimeout(function(){
	    		$('#B2').click()	
    		},100)
    		setTimeout(function(){
	    		$('#C2').click()	
    		},200)
    		setTimeout(function(){
	    		$('#D2').click()	
    		},300)
    		setTimeout(function(){
	    		$('#E2').click()	
    		},400)
    		setTimeout(function(){
	    		$('#ready').click()	
    		},500)
    	}); 
	});
  };
	setTimeout(function(){
    	page.render('nabeel.jpg')
    	phantom.exit()
	},10000)
});