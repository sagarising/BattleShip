
var highscore = function(){
	$.get('highscore',function(data){
		data=JSON.parse(data);
		accuracyChart(data)
	});
};

var shipPosition=function(){
	$.get('shipposition',function(data){
		data = JSON.parse(data);
		shipPositionChart(data);
	});
};


var svgContainer = d3.select("#chartdiv").append("svg")
						.attr("width", 1000)
						.attr("height",600);

var shipPositionChart = function(data){
	d3.selectAll(".graph").remove();
	var max = d3.max(data,function(d){return d.counts;});
									

	var ramp=d3.scale.linear()
					 .domain([0,max/2,max])
					 .range(["white","yellow","orange"]);
	var group = svgContainer.append("g")
    			.attr("id","shipPosition")
    			.attr("class","graph");
    var rectangles = group.selectAll("rect")
    					  .data(data)
    					  .enter().append('rect')
    					  .attr('x',function(d,i){
    					  	return (+(d.column_id)*50)+300
    					  })
    					  .attr('y',function(d,i){
    					  	var charCode = d.row_id.charCodeAt();
    					  	return ((charCode*50)-3200)
    					  })
    					  .attr('height',50)
    					  .attr('width',50)
    					  .attr('fill','white')
    					  .attr('stroke-width',1)
    					  .attr('stroke','black')
    rectangles.append('svg:title')
        .text(function(d){return d.row_id+d.column_id+" "+d.counts+'times'})
    rectangles.transition().duration(3000)
    	.attr('fill',function(d,i){
    		return ramp(d.counts)
		  })
};

var accuracyChart = function(data){
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


	
	var lines = group.selectAll(".bars")
						.data(data)
						.enter().append('line')
						.attr('y2',500)
						.attr('x1',function(d,i){
							return (i*50)+100
						})
						.attr('x2',function(d,i){
							return (i*50)+100;
						})
						.attr('y1',500)
						.on('mouseover',function(d,i){
							d3.select(this).attr('stroke','brown')
            			})
            			.on('mouseout',function(d){
							d3.select(this).attr('stroke','steelblue')
            			})
						.attr('stroke','steelblue')
						.attr('stroke-width',45)
    
    lines.append('svg:title')
        .text(function(d){return d.name.trim()+' '+d.accuracy+'%'})
	

	lines.transition()
		.duration(1000).ease('bounce')
		.attr('y2',function(d){
			return y(d.accuracy);
		});
	
	group.append('g')
		.attr('class','axis')
		.call(yAxis)
		.attr('transform','translate(60,0)');
};


