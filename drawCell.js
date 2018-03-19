//Render cellData and draw sub svg
function drawCell(margin2, color, yearLower, yearUpper, data) {
    console.log("cellData", data);
    
   var height = d3.select("#cell").attr("height"),
       width = d3.select("#cell").attr("width");
    
    var svg = d3.select("#cell").append('g')
        .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    var xScale = 
        d3.scaleLinear().range([0, width-100])
        .domain([yearLower-1, yearUpper]).nice();
    
  
    //Set yscale with padding
    var yScale = 
        d3.scaleBand().range([height, 0]).padding(1);
    yScale.domain(data.map(function(d) {
            return d.continent;
        }));

    //Set axis without ticks
    var xAxis = d3.axisBottom()
    .tickFormat(d3.format("d"))
    .ticks(10)
    .scale(xScale).tickSize([]);
    
    yAxis = d3.axisLeft().scale(yScale).tickSize([]);
    

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    
    svg.append("g")
        .attr('transform', 'translate(0,' + (height - margin2.bottom) + ')')
        .attr('class', 'x axis')
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("font-weight","bold");
//    
    //Force layout ref: http://bl.ocks.org/bimannie/cf443db3222b747d3155f8797abc0593
    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function(d) { return xScale(d.year2); }).strength(1))
        .force("y", d3.forceY(function(d){
            return yScale(d.continent)
        }).strength(0.05))
        .force("collide", d3.forceCollide().radius(20));
//        .force("manyBody", d3.forceManyBody().strength(-10))
//        .stop();
    
//    for (var i = 0; i < 15; ++i)
//        simulation.tick();
    
    
    //Append image to circles
    //https://www.youtube.com/watch?v=FUJjNG4zkWY&t=5s
    for (var i = 0; i< data.length; ++i) {
        svg.append("defs")
        .append("pattern")
        //Need to remove char ' and white space for js to work out
        .attr("id", data[i].name.toLowerCase().replace(/ /g, "_").replace("'", ""))
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
    }
    

    //Make the image resizable
    svg.selectAll("pattern").append('image')
        .data(data)
        .attr("xlink:href", function (d){ return "square_images/" + d.name + ".jpg"; })
        .attr("class", "image")
        .attr("patternContentUnits", "none")
      .attr("width", 1)
      .attr("height", 1);       
  
    var circle = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-image")
        .attr("fill", function(d) {
            return "url(#"+d.name.toLowerCase().replace(/ /g, "_").replace("'", "")+")"
        })
        .attr("cx", function(d) { return xScale(d.year2)} )
        .attr("cy", function(d) { return yScale(d.continent)} )
        .attr("r", 25)
        .on("mouseover", function(d) {
            d3.select(this)
            tooltip.transition()
                .duration(200)
                .attr('r',10)
                .style("opacity", .6);
            tooltip.html(d.name+"<br/>"+"Year: "+ d.year2+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.cat+"<br/>"+"________________"+"<br/>"+d.Rationale) 
                .style("left", (d3.event.pageX - 5.5) + "px")
                .style("top", (d3.event.pageY + 1) + "px");
              })
        .on("mouseout", function(d) {
            tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
        });
            
}

