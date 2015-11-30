var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};

var sendToGamePage = function(){
	var req = new XMLHttpRequest;
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			console.log(req.responseText);
			if(+req.responseText)
				window.location.href='game.html';
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
	// var ship = new makeShip(shipName,shipSize);
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
window.onload = function(){
	document.querySelector('#placeShipButton').onclick = checkAndSubmit;
 }

var changingTheColor=function(clas,array,colour){
	var p = document.querySelector('#'+clas).getElementsByTagName('td');
	for(var i=0;i<array.length;i++){
		p[array[i]].setAttribute("style","background-color:"+colour);
	};
};


var isSecondPlayerReady = function() {
	req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status ==200) {
				var res = req.responseText;
				if(res =='wait')
					document.querySelector('#wait').innerHTML = res;
				else
					document.querySelector('html').innerHTML = res;
			}
		}
	req.open('GET','ready',true);
	req.send()
}
