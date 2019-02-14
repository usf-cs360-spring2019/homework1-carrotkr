// Width and height.
var w = 960;
var h = 500;

// Set width and height of svg.
d3.select('svg')
  .style('width', w)
  .style('height', h);

d3.csv('Police.csv').then(function(csv_data) {
  var tempData = d3.nest()
    .key(function(d) { return d.IncidentDayOfWeek; })
    .rollup(function(v) { return v.length; })
    .entries(csv_data);

  console.log(tempData);
  console.log(tempData[1].value);
    
  var dataset =[]
  console.log(tempData.length);

  var i;
  for (i = 0; i < tempData.length; i++) {
        dataset.push(tempData[i].value)
  }
  console.log(dataset);
  
  var day = []
  for (i = 0; i < tempData.length; i++) {
        day.push(tempData[i].key)
  }

  var outerRadius = w / 3;
  var innerRadius = 0;
  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
            
  var pie = d3.pie();
            
  // Colors accessible via a 10-step ordinal scale.
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG element.
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
            
  // Set up groups.
  var arcs = svg.selectAll("g.arc")
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
            
  // Draw arc paths.
  arcs.append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", arc);
            
  // Labels.
  arcs.append("text")
    .attr("transform", function(d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr('dy', '-20')
    .style("font", "bold 16px Arial")
    .text(function(d, i) {
        //   return d.value + " incidents\
        // (" + tempData[i].key + ")";
      return d.value;
    });

  // Add a legendLabel to each arc slice.
  arcs.append("text")
    .attr("transform", function(d) { // Set the label's origin to the center of the arc.
        // Set these before calling arc.centroid.
        d.outerRadius = outerRadius + 50; // Set Outer Coordinate.
        d.innerRadius = outerRadius + 45; // Set Inner Coordinate.
        return "translate(" + arc.centroid(d) + ")";
      })

    // .attr("text-anchor", "right") // Center the text on it's origin.
      .style("fill", "Purple")
      .style("font", "bold 14px Arial")
      .text(function(d, i) { return tempData[i].key; }); // Get the label from original data array.
}); 
