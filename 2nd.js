function drawDefault() {
    var margin = {top: 10, right: 60, bottom: 20, left:150},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    
    
    var margin2 = {top: 10, right: 60, bottom: 20, left: 150},
    width2 = 1100 - margin2.left - margin2.right,
    height2 = 300 - margin2.top - margin2.bottom;
    
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


    var color = d3.scaleOrdinal().domain(["All","North America","South America", "Europe","Africa","Asia","Australia" ]).range(["#9b989a","#beaed4","#ffd92f","#a6d854","#e5c480","#fb9a99","#80b1d3"]);
    
    var circles;

    //#fbb4ae    
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale).ticks(11).tickSize(0,9,0).tickFormat( function(d) { return mapfunc(d);});

    //.tickFormat(function(d) { return mapping[d.category2]; });
    var svg = d3.select('body')
        .append('svg')
        .attr("id", 'default')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    //For draw cell
    var svg2 = d3.select('body')
        .append('svg')
        .attr("id", 'cell')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.top + margin2.bottom);
        

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    d3.csv('full.csv',function(error, data){
            data.forEach(function(d){
                 d.year2 = +d.year;
                 d.year = parseTime(d.yearMap); 
                 d.cat = d.cat;
                 d.name=d.name;
                 d.category = d.catMap;
                 d.country=d.country;
                 d.award = d.award;
                 d.Rationale = d.Rationale;
                 d.continent = d.continent;
            });

        
        xScale.domain([d3.min(data, function(d){return d.year;}),
            d3.max(data,function(d){return d.year;})]).nice();

        yScale.domain([d3.min(data, function(d) { return d.category2;})-1, d3.max(data, function(d) { return d.category2;})]).nice();

    //		yScale.domain(d3.extent(data, function(d){
    //			return d.category2;
    //		})).nice();
            //yScale.domain(data.map(function(d) { return d.category; }));

            // adding axes is also simpler now, just translate x-axis to (0,height) and it's alread defined to be a bottom axis. 
        var gx=svg.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'x axis')
                .call(xAxis);
               

    // y-axis is translated to (0,0)
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("y", 26)
        .attr("x",-5)
        .attr("cx", -1000)
        .attr("cy", -1000)
        .attr("dy", ".85em")
        .attr("font-weight","bold");
        //.attr("transform", "rotate(60)")
        

        // Draw the x gridlines
      svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines(xScale, 13)
             .tickSize(-height)
             .tickFormat("")
             )

        // Draw the y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(yScale, 11)
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
          .style("fill", function(d) { return color(d.continent);})
          .on("mouseover", function(d) {
            d3.select(this)
              tooltip.transition()
                   .duration(200)
                   .attr('r',10)
                   .style("opacity", .9);
              tooltip.html(d.name+"<br/>"+"Year: "+ d.year2+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.cat+"<br/>"+"________________"+"<br/>"+d.Rationale) 
                   .style("left", (d3.event.pageX -4) + "px")
                   .style("top", (d3.event.pageY+2 ) + "px");
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
          .attr("id", function(d, i ){
              return color.domain()[i];}) // assign ID to each legend
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      ;
    
    

      // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width - 50)
          .attr("rx",5)
          .attr("ry",5)
          .attr("width", 95)
          .attr("height", 19)
          .style("fill", color);
      
    //Adding click event
      legend.on("click", function(type) {
        
          
         //dim all of the legends
        //d3.selectAll(".legend")
          //  .style("opacity", 0.1);
        // make the one selected be un-dimmed
        //d3.select(this)
          //  .style("opacity", 1);
        
        //Show if 'All' selected
        if (d3.select(this).attr('id') == 'All') {
           d3.selectAll(".dot")
             .style("opacity", 1)
        } else {
          //Select all dot and hide
          d3.selectAll(".dot")
          .style("opacity", 0.1)
          .filter(function(d){
            return d["continent"] == type
          })
            //Make this line seen
           .style("opacity", 1);
        }  
      })

      // draw legend text
      legend.append("text")

          .attr("x", width - 2)
          .attr("y", 3)
          .attr("dy", "0.65em")
          .style("text-anchor", "middle")
          .style("font-size","14px")
          .text(function(d) { return d;})
    //ref: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774  

    var categoryMap = ["Art", "Literature", "Medicine", "Chemistry", "Physics", "Math",  "Computer", "Peace & Leadership", "Pioneers"];
        
    svg.on("click", function() {
        //Get click coordinate
        var coords = d3.mouse(this);
        //Convert pixel to data
        var posX = xScale.invert(coords[0]),
            posY = Math.floor(yScale.invert(coords[1]));
        var category = categoryMap[posY],
            date = new Date(posX),
            year = date.getFullYear();
        
        //Find decade boundary given year
        var decadeLower = year - year%10,
            decadeUpper = decadeLower + 10;
       
        //Get relevant data
        var cellData = data.filter(function(d) {
            return d["cat"] === category && d["year2"] < decadeUpper && d["year2"] >= decadeLower
        });
        clearCell();
        drawCell(margin2, color, decadeLower, decadeUpper, cellData);
        
        });
 
    });
    
    
}

//Clear cell svg
function clearCell() {
    var svg = document.getElementById("cell");
    if (svg.childNodes[0])
        svg.removeChild(svg.childNodes[0]);
}

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
//    var yScale = 
//        d3.scaleBand().range([height, 0]).padding(1);
//    yScale.domain(data.map(function(d) {
//            return d.continent;
//        }));

    //Set axis without ticks
    var xAxis = d3.axisBottom()
    .tickFormat(d3.format("d"))
    .ticks(10)
    .scale(xScale).tickSize([]);
    
//    yAxis = d3.axisLeft().scale(yScale).tickSize([]);
    

    
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    svg.append("g")
            .attr('transform', 'translate(0,' + (height - margin2.bottom) + ')')
            .attr('class', 'x axis')
            .call(xAxis);
    
//    svg.append("g")
//        .attr("class", "y axis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("font-weight","bold");
//    
    //Force layout ref: http://bl.ocks.org/bimannie/cf443db3222b747d3155f8797abc0593
    var nodes = data.map(function(node, index) {
        return {
                index: index,
                name: node.name,
                year: node.year2,
                rationale: node.Rationale,
                country: node.country,
                continent: node.continent,
                award: node.award,
                x: xScale(node.year2),
                fx: xScale(node.year2),       
            };                 
        });
    
    
    var simulation = d3.forceSimulation(nodes)
        .force("x", d3.forceX(function(d) { return xScale(d.year); }).strength(1))
        .force("y", d3.forceY(150))
        .force("collide", d3.forceCollide().radius(25))
        .force("manyBody", d3.forceManyBody().strength(-10))
        .stop();
    
    for (var i = 0; i < 15; ++i) simulation.tick();
    
    
    //TODO: try to add sort by continent
    var circle = svg.selectAll(".dot")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function(d) { return color(d.continent); })
        .attr("cx", function(d) { return d.x} )
        .attr("cy", function(d) { return d.y} )
        .attr("r", 20)
        .style("opacity", 0.6)
//            .sort(function(a, b) { return b.dy - a.dy; })

        .on("mouseover", function(d) {
                d3.select(this)
                  tooltip.transition()
                       .duration(200)
                       .attr('r',10)
                       .style("opacity", .5);
                  tooltip.html(d.name+"<br/>"+"Year: "+ d.year+"<br/>"+"Country: "+d.country+"<br/>"+"Award: "+d.award+" - "+d.cat+"<br/>"+"________________"+"<br/>"+d.rationale) 
                       .style("left", (d3.event.pageX - 5.5) + "px")
                       .style("top", (d3.event.pageY + 1) + "px");
              })
        .on("mouseout", function(d) {
            tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
              });

    
    //TODO: Append image to circle not showing image
    circle.append("image")
      .attr("xlink:href", "images/Strawberry.jpg")
      .attr("class", "circle-image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20);         
}


// Gridlines in x axis funcitons
function make_x_gridlines(xScale, ticks) {  
    return d3.axisBottom(xScale)
         .ticks(ticks)
}


// Gridlines in y axis function
function make_y_gridlines(yScale, ticks) {     
    return d3.axisLeft(yScale)
        .ticks(ticks)
}

function mapfunc(d){
    
    if(d==1){return "Art";}
    if(d==2){return "Literature";}
    if(d==3){return "Medicine";}
    if(d==4){return "Chemistry";}
    if(d==5){return "Physics";}
    if(d==6){return "Math";}
    if(d==7){return "Computer";}
    if(d==8){return "Peace & Leadership";}
    if(d==9){return "Pioneers";}
    if(d==10){return "Peace";}
 
}