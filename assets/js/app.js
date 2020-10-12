// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(dataState) {

    // Step 1: Parse Data/Cast as numbers
  dataState.forEach(function(data) {
    data.poverty = +data.poverty;
    data.smokes = +data.smokes
    data.states = data.abbr
    console.log(data.poverty);
    console.log(data.smokes);
    console.log(data.states);
  });

    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(dataState, d => d.poverty + 2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(dataState, d => d.smokes + 2)])
      .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes and to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(dataState)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".7")

      //Step 6: Create Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d) {
          return (`${d.states}<br>Poverty %: ${d.poverty}<br>Smoking %: ${d.smokes}`);
        });

      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // Step 8. Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% of Population that Smokes");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("% of Population in Poverty");
    }).catch(function(error) {
      console.log(error);

});
