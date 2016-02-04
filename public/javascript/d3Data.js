// // d3.selectAll("p").style("color", function(d, i) {
// //   return i % 2 ? "red" : "blue";
// // });
// d3.selectAll("p")
//     .data([15, 16, 23, 42])
//     .style("font-size", function(d) { return d +
// data = [{name:"sagar",score:56},{name:"vijay",score:34},{name:"shyam",score:84}, {name:"ram",score:37},{name:"ghanshyam",score:43}];

var data = [{"name":"adasqq","accuracy":89,"gameid":34,"time":"2016-02-03T15:52:47.485Z"},{"name":"Shruti","accuracy":87,"gameid":30,"time":"2016-02-02T20:21:40.306Z"},{"name":"Shruti","accuracy":85,"gameid":31,"time":"2016-02-02T20:26:45.672Z"},{"name":"shibi","accuracy":78,"gameid":22,"time":"2016-02-02T16:51:03.271Z"},{"name":"Nabeel","accuracy":75,"gameid":3,"time":"2016-01-28T18:12:48.403Z"}]
var x = d3.scale.linear()
    .domain([0,100])
    .range([80, 420]);


d3.select("body").selectAll("div")
    .data(data)
  	.enter().append("div")
    .text(function(d,i) { return ++i+"."+d.name})
    .style("width",function(d,i){
    	 return x(d.accuracy)+"px";
    })
    .style("background-color","orange")
    .style("margin","5px")
    .style("mouseover")

