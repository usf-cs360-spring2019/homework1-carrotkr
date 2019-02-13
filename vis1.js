var WIDTH = 600;
var HEIGHT = 600;

// set width and height of svg
d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

// d3.json('data.json').then(function(data){
// Fetch data
d3.csv('Police.csv').then(function(csv_data) {
    var tempData = d3.nest()
      .key(function(d) { return d.IncidentDayOfWeek; })
      .rollup(function(v) { return v.length; })
      .entries(csv_data);

    console.log(tempData);

    d3.select('svg').selectAll('rect') //select rectangles within svg (even if none exist)
        .data(tempData) //attach data to the rectangles
        .enter() //find the data elements that are not attached to rectangles
        .append('rect'); //append rectangles for each data not attached to a rectangle

    //-----Adjusting the height and the width of the bars.-----//
    
    // Create a linear scale.
    var yScale = d3.scaleLinear();
    // Set its visual range to 600->0.
    yScale.range([HEIGHT, 0]);

    // Get the minimum y data value by looking at the count property of each datum.
    var yMin = d3.min(tempData, function(datum, index){
        return datum.value;
    })
    console.log(yMin);

    // Get the maximum y data value by looking at the count property of each datum.
    var yMax = d3.max(tempData, function(datum, index){
        return datum.value;
    })
    console.log(yMax);

    // Set the domain of yScale from yMin and yMax.
    yScale.domain([yMin-1451, yMax]);

    // Find all rectangles.
    d3.selectAll('rect')
        .attr('height', function(datum, index){
        // Set the height of each rectangle by getting the count property of each datum
        //  converting it to a visual value, using yScale
        //  then subtract that value from HEIGHT.
            return HEIGHT-yScale(datum.value);
        });

    var xScale = d3.scaleLinear(); //create the xScale
    xScale.range([0, WIDTH]); //set the range to 0->800
    xScale.domain([0, tempData.length]); //set the domain from 0 to the number of data elements retrieved
    d3.selectAll('rect') //select all rectangles
        .attr('x', function(datum, index){ //set the x position of each rectangle...
            return xScale(index);//by converting the index of the elemnt in the array to a point between 0->800
        });
    d3.selectAll('rect') //select all rectangles
        .attr('y', function(datum, index){ //set the y position of each rectangle...
            //by converting the count property of the datum to a visual value
            //(remember, when using yScale as it is set up, a large data value will give you a small visual value and vice versa)
            return yScale(datum.value);
        });
    d3.selectAll('rect') //select all rectangles
        .attr('width', WIDTH/tempData.length); //set the width of all rectangles to be the width of the SVG divided by the number of data elements
    var yDomain = d3.extent(tempData, function(datum, index){ //set the y domain by getting the min/max with d3.extent
        return datum.value; //... and examining the count property of each datum
    })
    var colorScale = d3.scaleLinear();//create a linear scale
    colorScale.domain(yDomain) //the domain is the yDomain
    colorScale.range(['#00cc00', 'blue']) //the visual range goes from green->blue
    d3.selectAll('rect') //select all rectangles
        .attr('fill', function(datum, index){ //set the fill of each rectangle
            return colorScale(datum.value) //by converting the count property of the datum to a color
        })
    var leftAxis = d3.axisLeft(yScale); //create a left axis generator using the yScale
    d3.select('svg') //select the svg
        .append('g').attr('id', 'left-axis') //append a <g> tag to it with id=left-axis
        .call(leftAxis); // create a left axis within that <g>
    var skillScale = d3.scaleBand(); //create a scale band that will map skills to horizontal positions
    var skillDomain = tempData.map(function(skill){ //create an array of skill strings
        return skill.key
    });
    skillScale.range([0, WIDTH]); //set the range of the skillScale to 0->800
    skillScale.domain(skillDomain); //set the domain to be the array of skill strings
    var bottomAxis = d3.axisBottom(skillScale); //create a bottom axis generator that uses the skillScale
    d3.select('svg') //select the svg
        .append('g').attr('id', 'bottom-axis') //append a <g> tag to it with id=bottom-axis
        .call(bottomAxis) // create a bottom axis within that <g>
        .attr('transform', 'translate(0,'+HEIGHT+')'); //move it to the bottom of the svg
});
