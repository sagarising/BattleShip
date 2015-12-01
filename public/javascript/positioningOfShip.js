var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};


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
				window.location.href = "game.html";
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
// window.onload = function(){
// 	document.querySelector('#placeShipButton').onclick = checkAndSubmit;
//  }

var changingTheColor=function(clas,array,colour){
	var p = document.querySelector('#'+clas).getElementsByTagName('td');
	for(var i=0;i<array.length;i++){
		p[array[i]].setAttribute("style","background-color:"+colour);
	};
};

var changeTheColorOfGamePage = function(){
	req=new XMLHttpRequest();
	req.onreadystatechange=function(){
		if(req.readyState==4 && req.status==200){
			// console.log(JSON.parse(req.responseText),'response ;;;;')
			changingTheColor('own',JSON.parse(req.responseText),'grey')
		}
	}
	req.open('GET','usedSpace',true);
	req.send();
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


var createPlayer = function(){
	document.getElementsByTagName('button')[1].style.display='inline';
	if(document.querySelector('#name').value==''){
		alert('first enter your name')
	}
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
