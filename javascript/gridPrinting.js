var FillBoxBy=function(self){
		// alert(self.id+self.parentNode.parentNode.parentNode.className);
		var coordianteBox = document.getElementById('text');
		coordianteBox.value = self.id+','+self.parentNode.parentNode.parentNode.className;
		// alert(self.parentNode.parentNode.parentNode.className)
};
var printGrid=function(clas){
	var a = [];
	for(var j=65;j<=74;j++){
		for(var i = 1 ; i <= 10 ; i++){
			a.push("<td width=40px height=40px id="+String.fromCharCode(j)+i+" onClick=FillBoxBy(this)></td>");
		}
			a.push('</tr><tr>')
	};
	a.splice(0,0,"<table border='1' class="+clas+">");
	a.push('</table>')
	a = a.join("\n");
	document.write(a);

};
var own=printGrid('own');
var enemy=printGrid('enemy');
// var checkAndSubmit = function(){
// 	var ship = document.getElementById("ship").value;
// 	if(document.getElementById("horizontal").checked) 
// 		var alignment = document.getElementById("horizontal").value;
// 	else
//  		var alignment = document.getElementById("vertical").value;
//  		var gridValue = document.getElementById("text").value;
//  		alert(ship+" "+alignment+" "+gridValue);
//  	};

// var givenarray=['E4','E5']

// changingTheColor('enemy',givenarray,"blue");
// changingTheColor('own',givenarray,"grey");
