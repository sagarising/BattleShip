var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};
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
			var selectedShip = document.querySelector('#ship');
			selectedShip.remove(selectedShip.selectedIndex);
			shipCoordinate.map(function(element){
				var cell = document.getElementById(element);
				cell.bgColor ='red';
			})
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