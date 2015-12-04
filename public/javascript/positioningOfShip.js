


var alertId=function(self){
	alert(self.id)
};

var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};

var createPlayer = function(){
	document.getElementsByTagName('button')[1].style.display='inline';
	if(document.querySelector('#name').value=='')
		alert('first enter your name')
	else{
		req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status ==200) {
				console.log("welcome");
				window.location.href = 'shipPlacingPage.html'
			}
		}
		req.open('POST','player',true);
		req.send('name='+document.querySelector('#name').value);
	}
}

var sendToGamePage = function(){
	var req = new XMLHttpRequest;
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			console.log(req.responseText);
			if(+req.responseText)
				window.location.href='game.html';
			document.getElementsByTagName('img')[0].style.visibility='visible';
			document.getElementById('selectShip').style.visibility='hidden';
			document.getElementsByTagName('table')[0].style.pointerEvents='none';
		}
	}
	req.open('GET',"makeReady",true);
	req.send();
}

var checkAndSubmit = function(){
	var req = new XMLHttpRequest();
	var ship = document.getElementById("ship");
	var shipName = ship.options[ship.selectedIndex].text;
	var shipSize = document.getElementById("ship").value;
	var coordinateValue = document.getElementById("text").value;
	var align = document.getElementById("horizontal").checked ? 'horizontal' :'vertical';	
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			var shipCoordinate = JSON.parse(req.responseText); 
			var ship = document.querySelector('#ship');
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0){
				setInterval(sendToGamePage,20); 
			}
			shipCoordinate.map(function(element){
			var cell = document.getElementById(element);
			cell.bgColor ='grey';
			});
		}
	}
	req.open('POST','placingOfShip',true);
	req.send(shipName+" "+shipSize+" "+coordinateValue+" "+align);
};	


