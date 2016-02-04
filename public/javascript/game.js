
// gamepage
var intervalObject;

var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		placesWhereShipArePlaced = data;
		changingTheColorOfGrid('own',placesWhereShipArePlaced,'grey');
	});
};

var attack = function(point) {
	$.post('attack',{point:point.id},function(data){
		if(data=='success')
		$(point).addClass("noClick");
	});
	$(point).css("animation","scale_once 0.5s 1 alternate");
	soundPlay();
};


var soundPlay=function(){
	var audio = $("#mysoundclip")[0];
	audio.play();
};

//gamePage

//
var changingTheColorOfGrid=function(clas,usedSpace,colour){
	usedSpace.forEach(function(eachCoordinate){
		$('.'+clas+' [id='+eachCoordinate+']').css("background-color",colour);
	});
};

var statusUpdate = function(id,array){
	console.log(id,'id')
	// console.log(array,"array")
	array.forEach(function(each,index){
		if(!each){
			var ship = $('#'+id+' tr')[index].children[1];
			ship.style.backgroundColor = "red";
		};
	});
};

//gamePage

var displayTurn = function(turn){
	if(turn == true){
		$( ".turn" ).html( "<p>Your turn</p>" );
		$("#enemy").css("pointer-events","auto");
	}
	else{
		$( ".turn" ).html( "<p>Enemy's turn</p>" );
		$("#enemy").css("pointer-events","none");
	};
};

var update = function(){
	$.get('givingUpdate',function(data){
		var shipStatus = [];
		var gridStatus = [];
		var updates = data;
		var playerTurn = updates.isTurn;
		displayTurn(playerTurn);
		shipStatus = updates.enemyStatusTable;
		statusUpdate(shipStatus.table,shipStatus.stat);
		var gridStatus = [updates.ownHit,updates.enemyMiss,updates.enemyHit];
		gridStatus.forEach(function(clas){
			changingTheColorOfGrid(clas.table,clas.stat,clas.color)
		});
		if(updates.isGameOver){
			clearInterval(intervalObject);
			$.get('getResult',function(data){
				$('html').html(data);
				winnerAndLoser();
			})
		};
	});
};

var hitAccuracy = function(player){
	var attempts = player.hits.length + player.misses.length;
	var ratioOfHits = player.hits.length / attempts ;
	var percentage = Math.round(ratioOfHits*100);
	return percentage+"%";
}

var Context = function(updates){
	var winner = JSON.parse(updates.won);
	var loser = JSON.parse(updates.lost);
	this.winner = winner.name;
	this.loser = loser.name;
	this.winnerStatus = updates.status.filter(function(ele){return ele==0}).length+"/5";
	this.loserStatus = "5/5";
	this.winnerAccuracy = hitAccuracy(winner);
	this.loserAccuracy =  hitAccuracy(loser);
}

var winnerAndLoser = function(){
	$.get('gameOver',function(data){
		var updates = data;
		var winnerShipsSunk = updates.status.filter(function(ele){return ele==0}).length;
		var context = new Context(updates);
		var source = $('#declare').html();
		var template = Handlebars.compile(source);
		$('#result').html(template(context));
		changingTheColorOfGrid('enemy',JSON.parse(updates.won).misses,'#ccfff4')
		changingTheColorOfGrid('enemy',JSON.parse(updates.won).hits,'red')
		changingTheColorOfGrid('own',JSON.parse(updates.won).grid.usedCoordinates,'grey')
		changingTheColorOfGrid('own',JSON.parse(updates.lost).misses,'#ccfff4')
		changingTheColorOfGrid('own',JSON.parse(updates.lost).hits,'red')
		changingTheColorOfGrid('enemy',JSON.parse(updates.lost).grid.usedCoordinates,'grey')
	})
	soundPlay();
};

var serveStatus = function(){
	changeTheColorOfGamePage();
	intervalObject = setInterval(update,500);
};
var d3Function=function(data){
    var x = d3.scale.linear()
        .domain([0,100])
        .range([110, 400]);

    d3.select("body").selectAll("div")
        .data(data)
      	.enter().append("div")
        .text(function(d,i) { return ++i+"."+d.name+'-'+d.accuracy+'%'})
        .style("width",function(d,i){
        	 return x(d.accuracy)+"px";
        })
        .style("background-color","orange")
        .style("height",'40px')
        .style("margin","5px")
        .on("mouseover", function(d) {
            d3.select(this).style('background-color', 'red');
        })
        .on("mouseout",function(d){
            d3.select(this).style('background-color','orange')
        }) 
};              

var highscore = function(){
	$.get('highscore',function(data){
		d3Function(JSON.parse(data))
	});
};