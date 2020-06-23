var width = 960;
var height = 500;
var adj = 20;
// append SVG first
var svg = d3.select("#plot").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-" + adj + " -" + adj + " " + (width + adj) + " " + (height + adj))
    .style("padding", 5)
    .style("margin", 5)
    .classed("svg-content", true);

svg.append("text")
    .style("font-size", "16px")
    .text("pm2.5");

// ----- DATA PREPARATION ------------------------//
var dataset = d3.csv("http://localhost:8000/data.csv");
dataset.then(function (data) {
    data.map(function (d) {
        d.val = +d.val;
        return d;
    });
});

// ----- BAR CHART ---------------------------//
dataset.then(function (data) {
    svg.selectAll("div#plot")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) {
            for (i > 0; i < data.length; i++) {
                return i * 24; // Big bins temporary
            }
        })
        .attr("y", function (d) {
            return height - (d.val * 10);
        })
        .attr("width", 20)
        .attr("height", function (d) {
            return d.val * 10;
        });
});