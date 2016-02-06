
var svgContainer = d3.select("#accuracy").append("svg")
						.attr("width", 1000)
						.attr("height",600);

var shipPlacementChart = function(){
	d3.selectAll('#bargraph').remove();
	var group = svgContainer.append("g")
    			.attr("id","circlegraph");
    var yAxis = group.append("line")
						.attr('x1',60)
						.attr('x2',60)
						.attr('y1',20)
						.attr('y2',550)
						.attr('stroke','black')
						.attr('stroke-width',2)
	var xAxis = group.append("line")
						.attr('x1',10)
						.attr('x2',1000)
						.attr('y1',500)
						.attr('y2',500)
						.attr('stroke','black')
						.attr('stroke-width',2)

};


var accuracyChart = function(data){
	var y = d3.scale.linear()
        .domain([0,100])
        .range([500,100]);
    var group = svgContainer.append("g")
    			.attr("id","bargraph");

	group.append("defs").append("path")
		.attr("id","accuracyPath")
		.attr("d","M50,220 50,130")


	var yAxis = group.append("line")
						.attr('x1',60)
						.attr('x2',60)
						.attr('y1',20)
						.attr('y2',550)
						.attr('stroke','black')
						.attr('stroke-width',2)

	var xAxis = group.append("line")
						.attr('x1',10)
						.attr('x2',1000)
						.attr('y1',500)
						.attr('y2',500)
						.attr('stroke','black')
						.attr('stroke-width',2)

	var accuracy = group.append("text")
						.append("textPath")
						.attr("xlink:href","#accuracyPath")
						.text("Accuracy")
	var player = group.append("text")
						.attr("x",400)
						.attr("y",520)
						.text("Players")

	var chart_label = group.append("text")
						.attr("x",300)
						.attr("y",120)
						.text("hover on bars to see details.")			
						.attr('fill','grey')		


	var text = group.selectAll(".text")
						.data(data)
						.enter().append("text")
						.attr('class','.text')
						.attr('id',function(d,i){
							return "text"+i;
						})
						.text(function(d){
							return d.name
						})

						.attr("x",function(d,i){
							return (i*50)+85;
						})
						.attr("y",function(d,i){
							return y(d.accuracy)-10;
						})
						.attr('stroke','black')
						.attr('stroke-width',1)
						.attr('visibility','hidden')

	var line = group.selectAll(".bars")
						.data(data)
						.enter().append('line')
						.attr('id',function(d,i){
							return "line"+i;
						})
						.attr('x1',function(d,i){
							return (i*50)+100
						})
						.attr('y1',500)
						.attr('x2',function(d,i){
							return (i*50)+100;
						})
						.on('mouseover',function(d,i){
							var id =this.id;
							var selector = id.replace('line','text')
							d3.selectAll("#"+selector)
							.attr('visibility','auto');
							d3.select(this)
							.attr('stroke','red')
            			})
            			.on('mouseout',function(d){
            				var id =this.id;
							var selector = id.replace('line','text')
							d3.selectAll("#"+selector)
            				.attr('visibility','hidden');
            				d3.select(this)
							.attr('stroke','black')
            			})
						.attr('y2',function(d){
							return 500;
						})
						.transition().duration(750).ease("linear")
						.attr('y2',function(d){
							return y(d.accuracy);
						})
						.attr('stroke','black')
						.attr('stroke-width',20)
}

var highscore = function(){
	$.get('highscore',function(data){
		accuracyChart(JSON.parse(data))
	});
	// $.get('shipPlacementData',function(data){
	// 	shipPlacementChart(JSON.parse(data))
	// });
};
