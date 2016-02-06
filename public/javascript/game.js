
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
             

var d3Function = function(data){
	var x = d3.scale.linear()
        .domain([0,100])
        .range([0,10]);

	var svgContainer = d3.select(".chart").append("svg")
						.attr("width", 1000)
						.attr("height",600);
// ==============================================================
function slide(data) {
	console.log(data)
  var circle = d3.select(this);
  (function repeat() {
    circle = circle.transition()
        .attr("cy", 500)
      .transition()
        .attr("cy",data.accuracy+50)
        .each("end", repeat);
  })();
}

var text = svgContainer.selectAll("text")
						.data(data)
						.enter().append("text")
						.attr('id',function(d,i){
							return "text"+i;
						})
						.text(function(d){
							return d.name
						})

						.attr("x",function(d,i){
							return (i*50)+80
						})
						.attr("y",70)
						.attr('stroke','black')
						.attr('stroke-width',1)
						.attr('visibility','hidden')

var circle = svgContainer.selectAll("circle")
						.data(data)
						.enter().append("circle")
						.attr("id",function(d,i){
							return "circ"+i;
						})
						.attr("cx",function(d,i){
							return (i*50)+100;
						})
						.on('mouseover',function(d,i){
							d3.select(this)
							.interrupt()
							var id =this.id;
							var selector = id.replace('circ','text')
							d3.selectAll("#"+selector)
							.attr('visibility','auto');
							d3.select(this)
							.attr('fill','green')
            			})
            			.on('mouseout',function(d){
							d3.select(this)
            				.transition().duration(2000)
							.each(slide)
            				var id =this.id;
							var selector = id.replace('circ','text')
							d3.selectAll("#"+selector)
            				.attr('visibility','hidden');
            				d3.select(this)
							.attr('fill','red')
            			})
						.transition().duration(function(d,i){
							return d.accuracy*50
						})
						.each(slide)
						.attr("r",function(d,i){
							return d.accuracy/4
						})
						.attr('fill','red')
						
            			
// ==============================================================

	// svgContainer.append("defs").append("path")
	// 	.attr("id","accuracyPath")
	// 	.attr("d","M50,220 50,130")


	// var yAxis = svgContainer.append("line")
	// 					.attr('x1',60)
	// 					.attr('x2',60)
	// 					.attr('y1',20)
	// 					.attr('y2',550)
	// 					.attr('stroke','black')
	// 					.attr('stroke-width',2)

	// var xAxis = svgContainer.append("line")
	// 					.attr('x1',10)
	// 					.attr('x2',1000)
	// 					.attr('y1',500)
	// 					.attr('y2',500)
	// 					.attr('stroke','black')
	// 					.attr('stroke-width',2)

	// var accuracy = svgContainer.append("text")
	// 					.append("textPath")
	// 					.attr("xlink:href","#accuracyPath")
	// 					.text("Accuracy")


	// var text = svgContainer.selectAll("text")
	// 					.data(data)
	// 					.enter().append("text")
	// 					.attr('id',function(d,i){
	// 						return "text"+i;
	// 					})
	// 					.text(function(d){
	// 						return d.name
	// 					})

	// 					.attr("x",function(d,i){
	// 						return (i*50)+80
	// 					})
	// 					.attr("y",function(d,i){
	// 						if(i%2==0) return 150;
	// 						return 250;
	// 					})
	// 					.attr('stroke','black')
	// 					.attr('stroke-width',1)
	// 					.attr('visibility','hidden')

	// var line = svgContainer.selectAll("line")
	// 					.data(data)
	// 					.enter().append('line')
	// 					.attr('id',function(d,i){
	// 						return "line"+i;
	// 					})
	// 					.attr('x1',function(d,i){
	// 						return (i*50)+10
	// 					})
	// 					.attr('y1',500)
	// 					.attr('x2',function(d,i){
	// 						return (i*50)+10;
	// 					})
						// .on('mouseover',function(d,i){
						// 	var id =this.id;
						// 	var selector = id.replace('line','text')
						// 	d3.selectAll("#"+selector)
						// 	.attr('visibility','auto');
						// 	d3.select(this)
						// 	.attr('stroke','red')
      //       			})
      //       			.on('mouseout',function(d){
      //       				var id =this.id;
						// 	var selector = id.replace('line','text')
						// 	d3.selectAll("#"+selector)
      //       				.attr('visibility','hidden');
      //       				d3.select(this)
						// 	.attr('stroke','black')
      //       			})
	// 					.attr('y2',function(d){
	// 						return 500;
	// 					})
	// 					.transition().duration(750).ease("linear")
	// 					.attr('y2',function(d){
	// 						return x(d.accuracy);
	// 					})
	// 					.attr('stroke','black')
	// 					.attr('stroke-width',20)
}

var highscore = function(){
	$.get('highscore',function(data){
		d3Function(JSON.parse(data))
	});
};