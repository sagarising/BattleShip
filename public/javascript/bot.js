var page = require('webpage').create();

page.viewportSize = { width: 1600, height: 768 };
page.clipRect = { top: 0, left: 0, width: 1600, height: 768 };

page.onConsoleMessage = function(msg){
	console.log("Message :"+msg.toString());
}
page.open('http://localhost:5000',function(status){
	console.log('Back to page.open: ',page.url)
	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {	
		page.evaluate(function(){
			$('#name').val("Robot");
			// $('#gameId').val("12");
			$('button').click();
		});
	});

page.onLoadStartes = function() {
	console.log("Started")
}

page.onLoadFinished = function() {
	console.log("Load finished");
}

// page.onLoadFinished = function() {
// 	console.log('Finished')
// 	page.evaluate(function(){
// 		var points=[["A3","F6","J2","J7","D8"],["A3","J1","I3","C6","B8"],["G5","B2","A1","J7","G4"]]
// 		var point = points[Math.ceil(Math.random()*2)];
// 		$('#'+point[0]).click();
// 		setTimeout(function(){
// 			console.log(point[1]);
// 			$('#'+point[1]).click();
// 		},100);
// 		setTimeout(function(){
// 			console.log(point[2])
// 			$('#'+point[2]).click();
// 		},200);
// 		setTimeout(function(){
// 			console.log(point[3])
// 			$('#'+point[3]).click();
// 		},300);
// 		setTimeout(function(){
// 			console.log(point[4])
// 			$('#'+point[4]).click();
// 		},400);
// 		setTimeout(function(){
// 			$('#ready').click();
// 		},600);
// 		setTimeout(function(){
// 			setInterval(function(){
// 				if($('p').text() == 'Your turn'){
// 					var point = String.fromCharCode(Math.ceil(Math.random()*10+64))+Math.ceil(Math.random()*10);
// 					console.log('Hit point',point);
// 					$('#enemy [id='+point+']').click();
// 				}
// 			},5000);
// 		},2000)
// 	});
// 	};	
page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};
	setTimeout(function(){
		page.render('Ships.jpg');
		phantom.exit();
	},10000)
});


page.onResourceRequested = function(response){
	console.log("Url :",response.url," Request No. :",response.id);
};






