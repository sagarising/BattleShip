var Data;
var highscore = function(){
	$.get('highscore',function(data){
		Data=JSON.parse(data);
		accuracyChart(Data)
	});
};


var svgContainer = d3.select("#chartdiv").append("svg")
						.attr("width", 1000)
						.attr("height",600);



var accuracyChart = function(){
	var data = Data;

	d3.selectAll(".graph").remove()
	var y = d3.scale.linear()
        .domain([0,100])
        .range([500,100]);

    var group = svgContainer.append("g")
    			.attr("id","bargraph")
    			.attr("class","graph");

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10)
				.tickPadding(10)
				.innerTickSize(-1000)

	
	var xAxis = group.append("line")
						.attr('x1',50)
						.attr('x2',1000)
						.attr('y1',500)
						.attr('y2',500)
						.attr('stroke','black')

	var accuracy = group.append("text")
						.attr('transform','rotate(-90 120 100)')
						.text("Accuracy in %")
	var player = group.append("text")
						.attr("x",400)
						.attr("y",520)
						.text("Players")

	var chart_label = group.append("text")
						.attr("x",300)
						.attr("y",90)
						.text("hover on bars to see details.")			
						.attr('fill','grey')		


	
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
							.attr('stroke','grey')
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
						.attr('stroke-width',45);
	group.append('g')
		.attr('class','axis')
		.call(yAxis)
		.attr('transform','translate(60,0)');

	var text = group.selectAll(".text")
						.data(data)
						.enter().append("text")
						.attr('class','.text')
						.attr('id',function(d,i){
							return "text"+i;
						})
						.attr("x",function(d,i){
							return (i*50)+80;
						})
						.attr("y",function(d,i){
							return y(d.accuracy)-10;
						})
						.attr('stroke','black')
						.attr('stroke-width',1)
						.attr('visibility','hidden')
						.text(function(d){
							return d.name+'('+d.accuracy+')'
						})

}


