function drawDefault() {
var margin = {top: 10, right: 60, bottom: 40, left:60};
   var width = 1200 - margin.left - margin.right;
   var height = 600 - margin.top - margin.bottom;

    //used to parse time data on "year" only
    var parseTime = d3.timeParse("%Y");
   var xValue = function(d) { return d.year;}
    var xScale = d3.scaleTime().range([0, width-80]);
    var xMap = function(d) { return xScale(xValue(d));};
    
    var yValue = function(d) { return d.category;};
	//var yScale = d3.scalePoint().range([height, 0]).padding(1);

    var yScale = d3.scaleLinear().range([height, 0]);

    //var yMap = function(d) { return yScale(yValue(d))+d3.randomUniform(15, 45)();};
    var yMap = function(d) { return yScale(yValue(d));};

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var cValue = function(d) { return d.continent;};
    var circles;
   
    
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale).ticks(11).tickSize(0,9,0).tickFormat( function(d) { return mapfunc(d);});
    
    //.tickFormat(function(d) { return mapping[d.category2]; });
	var svg = d3.select('body')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	    .append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
   
        
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    

// Gridlines in x axis funcitons
function make_x_gridlines() {  
    return d3.axisBottom(xScale)
         .ticks(13)
}

// Gridlines in y axis function
function make_y_gridlines() {        
    return d3.axisLeft(yScale)
        .ticks(11)
}

d3.csv('sorted data.csv',function(error, data){
		data.forEach(function(d){
             d.year2 = d.year;
             d.year = parseTime(d.yearMap);       
			 d.name=d.name;
             d.category = d.catMap;
             d.country=d.country;
             d.award = d.award;
             d.Rationale = d.Rationale;
             d.continent = d.continent;
		});

		xScale.domain([d3.min(data, function(d){return d.year;}),
        d3.max(data,function(d){return d.year;})]).nice();
        
		yScale.domain([d3.min(data, function(d) { return d.category2;})-1, d3.max(data, function(d) { return d.category2;})]);

//		yScale.domain(d3.extent(data, function(d){
//			return d.category2;
//		})).nice();
        //yScale.domain(data.map(function(d) { return d.category; }));
    
		// adding axes is also simpler now, just translate x-axis to (0,height) and it's alread defined to be a bottom axis. 
		var gx=svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis)
           .append("text")
             .attr("x",width/2)
             .attr("y",+30)
             .attr("fill", "#000")
             .style("text-anchor", "middle")
             .attr("font-size", "12px")
             .text("Decade");

// y-axis is translated to (0,0)
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .attr("y", 26)
    .attr("x",-60)
    .attr("cx", -1000)
    .attr("cy", -1000)
    .attr("dy", ".85em")
    .attr("font-weight","bold")
    //.attr("transform", "rotate(60)")
    .style("text-anchor", "start")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x",-50)
        .attr("y",-30)
        .attr("fill", "#000")
        .text("Categories");
         
    // Draw the x gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
         .tickSize(-height)
         .tickFormat("")
         )
    
    // Draw the y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
             .tickSize(-width+80)
             .tickFormat("")
             )     
    
    
    circles=svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
        d3.select(this)
          tooltip.transition()
               .duration(200)
               .attr('r',10)
               .style("opacity", .9);
          tooltip.html(d.name+"<br/>"+"Year: "+ d.year2+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.cat+"<br/>"+"________________"+"<br/>"+d.Rationale) 
               .style("left", (d3.event.pageX - 5.5) + "px")
               .style("top", (d3.event.pageY + 1) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });     
 
    
      // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
    
      .attr("x", width + 26)
      //.attr("y", 3)
      .attr("dy", "0.65em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
}

function mapfunc(d){
    
    if(d==1){return "Art";}
    if(d==2){return "Litrature";}
    if(d==3){return "Medicine";}
    if(d==4){return "Chemistary";}
    if(d==5){return "Physics";}
    if(d==6){return "Math";}
    if(d==7){return "Computer";}
    if(d==8){return "Leadership";}
    if(d==9){return "Pioneers";}
    if(d==10){return "Peace";}
 
}

