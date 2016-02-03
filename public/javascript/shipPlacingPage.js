
var checkAndSubmit = function(self){
	soundPlay();
	var ship = $("#ship");
	var shipSize = ship.val();
	var coordinateValue = self.id;
	var align = $("#horizontal")[0].checked ? 'horizontal' :'vertical';	
	$.post('placingOfShip',{shipSize:shipSize,coordinate:coordinateValue,align:align},
		function(data){
			if (data.constructor == String) {
				$("#alert1").children("span").show()
				$("#alert1").children("span").text(data);
				setTimeout(function() {$("#alert1").children("span").hide();}, 1000);
			}
			else{
			var shipCoordinate = (data); 
			var ship = $('#ship')[0];
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0){
				$('#ready').css({"pointer-events":"auto","opacity":"1","animation":"scale 0.5s infinite alternate"}); 
				$('#placeShip').css({"pointer-events":"none","opacity":"0.5"});
			};
			shipCoordinate.map(function(element){
				$('#'+element).css("background-color","darkslategrey");
		});
	}
	});
};

var sendToGamePage = function(){
	var createInterval = setInterval(function(){
		$.get('makeReady',function(data){
			if(data==='select more ships'){
				$('#alert').show();
			}
			else{
				if(data===true){
					clearInterval(createInterval);				
					$.get('gamePage',function(data){
					$('html').html(data);
					serveStatus();
					});
				}
				$('#loading').css('visibility','visible');
				$('#selectShip').css('display','none');
				$('table').css('pointerEvents','none');
			}
		})
	},500);	
};

var instruct = function(){
	var str="Select ship and alignment from Control Panel. Then click on a cell below to place ship.";
	var length=str.length;
	var index=0;
	setInterval(function(){
		if(index==length)
			return;
		var text = $("#shipPlacingInstruction").text();
		text+=str[index++];
		$("#shipPlacingInstruction").html(text);
	},45);
};

instruct();
var reset=function(){
	$.get('reset',function(data){
		$('html').html(data);
	});
};

var soundPlay=function(){
	var audio = $("#mysoundclip")[0];
		audio.play();
};

