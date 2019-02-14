var WIDTH = 960;
var HEIGHT = 500;

// Set width and height of svg.
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

// Fetch data.
d3.csv('Police.csv').then(function(csv_data) {
    var tempData = d3.nest()
        .key(function(d) {
            incidentTime = d.IncidentTime.toString()
            console.log("time", incidentTime)
            absIncidentTime = +incidentTime.slice(0,2)
            console.log("time", absIncidentTime)
            
            return absIncidentTime;
        })
      .rollup(function(v) { return v.length; })
      .entries(csv_data);

    console.log(tempData);

    d3.select('svg').selectAll('rect') // Select rectangles within svg.
        .data(tempData) // Attach data to the rectangles.
        .enter() // Find the data elements that are not attached to rectangles.
        .append('rect'); // Append rectangles for each data not attached to a rectangle.

    //-----Adjusting the height and the width of the bars.-----//
    
    var yScale = d3.scaleLinear(); // Create a linear scale.
    yScale.range([HEIGHT, 0]); // Set its visual range to 600->0.

    // Get the minimum y data value by looking at the count property of each datum.
    var yMin = d3.min(tempData, function(datum, index){
        return datum.value;
    })
    // console.log(yMin);

    // Get the maximum y data value by looking at the count property of each datum.
    var yMax = d3.max(tempData, function(datum, index){
        return datum.value;
    })
    // console.log(yMax);

    // Set the domain of yScale from yMin and yMax.
    yScale.domain([yMin, yMax]);

    d3.selectAll('rect')
        .attr('height', function(datum, index){
        // Set the height of each rectangle by getting the count property of each datum
        //  converting it to a visual value, using yScale
        //  then subtract that value from HEIGHT.
            return HEIGHT-yScale(datum.value);
        });

    //-----Adjusting the horizontal and the vertical placement of the bars.-----//

    var xScale = d3.scaleLinear(); // Create the xScale.
    xScale.range([0, WIDTH]); // Set the range to 0->800.
    xScale.domain([0, tempData.length]); // Set the domain from 0 to the number of data elements retrieved.
    
    d3.selectAll('rect') // Select all rectangles.
        .attr('x', function(datum, index){
            // Set the x position of each rectangle
            //  by converting the index of the elemnt in the array to a point between 0->800.
            return xScale(index);
        });

    d3.selectAll('rect')
        .attr('y', function(datum, index){
            // Set the y position of each rectangle
            //  by converting the count property of the datum to a visual value.
            return yScale(datum.value);
        });

    //-----Making the width of the bars dynamic.-----//

    // Set the width of all rectangles to be the width of the SVG divided by the number of data elements.
    d3.selectAll('rect')
        .attr('width', WIDTH/tempData.length);

    //-----Changing the color of the bar based on data.-----//

    var yDomain = d3.extent(tempData, function(datum, index) {
        // Set the y domain by getting the min/max
        //  and examining the count property of each datum.
        return datum.value;
    })
    var colorScale = d3.scaleLinear(); // Create a linear scale.
    colorScale.domain(yDomain)
    // colorScale.range(['#00cc00', 'blue']) // The visual range goes from green->blue.
    colorScale.range(['#9d6a41', '#4d3623'])
    
    d3.selectAll('rect')
        .attr('fill', function(datum, index) {
            // Set the fill of each rectangle
            //  by converting the count property of the datum to a color.
            return colorScale(datum.value)
        })
    
    //-----Adding axes.-----//

    var leftAxis = d3.axisLeft(yScale); // Create a left axis generator using the yScale.
    d3.select('svg')
        .append('g').attr('id', 'left-axis')
        .call(leftAxis);
    
    var skillScale = d3.scaleBand(); // Map skills to horizontal positions.
    var skillDomain = tempData.map(function(skill) { // Create an array of skill strings.
        return skill.key
    });
    skillScale.range([0, WIDTH]); // Set the range of the skillScale to 0->800.
    skillScale.domain(skillDomain); // Set the domain to be the array of skill strings.
    
    var bottomAxis = d3.axisBottom(skillScale); // Create a bottom axis generator that uses the skillScale.
    d3.select('svg')
        .append('g').attr('id', 'bottom-axis')
        .call(bottomAxis)
        .attr('transform', 'translate(0,'+HEIGHT+')'); // Move it to the bottom of the svg.
});
