/*
TODO: FIX THIS. 
*/

let svgSlider = d3.select("#slider").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-" +
        adj + " -" +
        adj + " " +
        (width + adj * 3) + " " +
        (height + adj * 3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true)

let xSlider = d3.scaleLinear()  
    .domain([0, 180])
    .range([0, width])
    .clamp(true);

let slider = svgSlider.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + ", " + height/2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", xSlider.range()[0])
    .attr("x2", xSlider.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(xSlider.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(xSlider.ticks(10))
  .enter().append("text")
    .attr("x", xSlider)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "°"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue", function() {
      var i = d3.interpolate(0, 70);
      return function(t) { hue(i(t)); };
    });

function hue(h) {
  handle.attr("cx", xSlider(h));
  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}

