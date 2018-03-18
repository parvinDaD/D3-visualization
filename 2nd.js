//Default visualization
function drawDefault() {
    var margin = {top: 10, right: 60, bottom: 40, left:150};
       var width = 1100 - margin.left - margin.right;
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


        var color = d3.scaleOrdinal().domain(["North America","South America", "Europe","Asia","Australia","Africa", "All"]).range(["#7fc97f","#dbe587","#fb9a99","#80b1d3","#fdb462","#decbe4", "#9b989a"]);
        
        var circles;

        //#fbb4ae    
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


    d3.csv('final_data.csv',function(error, data){
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
        console.log(data);
            
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
        .call(make_x_gridlines(xScale)
             .tickSize(-height)
             .tickFormat("")
             )

        // Draw the y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines(yScale)
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
          .attr("id", function(d, i ){
              return color.domain()[i];}) // assign ID to each legend
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
    

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
        //TODO: add multi-selection
          
         //dim all of the legends
        d3.selectAll(".legend")
            .style("opacity", 0.1);
        // make the one selected be un-dimmed
        d3.select(this)
            .style("opacity", 1);
        
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
    });
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

// Gridlines in x axis funcitons
function make_x_gridlines(xScale) {  
    return d3.axisBottom(xScale)
         .ticks(13)
}


// Gridlines in y axis function
function make_y_gridlines(yScale) {        
    return d3.axisLeft(yScale)
        .ticks(11)
}



