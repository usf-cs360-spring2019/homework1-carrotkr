// Width and height.
var w = 800;
var h = 600;

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
    var innerRadius = w / 4;
    var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
            
    var pie = d3.pie();
            
    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    //Create SVG element
    var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    //         var container = d3.select('g') //adjust the position of the <g> so it's in the center of the SVG
    // .attr('transform', 'translate(' + (w / 3) + ',' + (h / 3) + ')');
            
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
            
    //Labels
            arcs.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .attr('dy', '-20')
                .style("font", "bold 12px Arial")
                .text(function(d, i) {
                    return d.value + " incidents\
                     (" + tempData[i].key + ")";
                });

    // Add a legendLabel to each arc slice.
    arcs.append("text")
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius + 50; // Set Outer Coordinate
        d.innerRadius = outerRadius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      // .attr("text-anchor", "right") //center the text on it's origin
      .style("fill", "Purple")
      .style("font", "bold 12px Arial")
      .text(function(d, i) { return tempData[i].key; }); //get the label from our original data array
}); 
