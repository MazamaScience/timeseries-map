const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;

// append SVG first
let svgPlot = d3.select("#plot").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-" +
        adj + " -" +
        adj + " " +
        (width + adj * 3) + " " +
        (height + adj * 3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

// ----- Sensor Click Input --------------------//
map.on("click", function(d) {
    //console.log(sensorID, d);
    svgPlot.selectAll("path")
        //.attr("visibility", "hidden")
        .style("opacity", 0);

    svgPlot.selectAll(".domain").style("opacity", 1); //.attr("visibility", "visible");

    svgPlot.selectAll("path.line-" + sensorID)
        //.attr("visibility", "visible")
        .transition()
        .style("opacity", 1)
        .style("stroke", "red");



});

dataset.then(function(data) {

    // This chunk takes the CSV data, remaps it to a more appropriate format
    let slc = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {
                    date: parseDate(d.datetime),
                    pm25: +d[id],
                    color: d3.interpolateYlGn(+d[id])
                };
            })
        }
    });

    // Scale prep
    const xScl = d3.scaleUtc().range([0, width]);
    const yScl = d3.scaleLinear().rangeRound([height, 0]);

    xScl.domain(d3.extent(data, function (d) {
        return parseDate(d.datetime)
    }));
    yScl.domain([(0), d3.max(slc, function (c) {
        return d3.max(c.values, function (d) {
            return d.pm25 + 4;
        });
    })]);

    // Axis prep
    const xAxis = d3.axisBottom()
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat("%b %d"))
        .scale(xScl);

    const yAxis = d3.axisLeft()
        .ticks((slc[0].values).length)
        .scale(yScl);

    // Line Prep
    // TODO: Make bars 
    const line = d3.line()
        .x(d => {
            return xScl(d.date)
        })
        .y(d => {
            return yScl(d.pm25)
        });

    // Add custom class id to each line using monitorID
    let i = 0;
    const ids = () => {
        return "line-" + slc[i++].id
    }

    svgPlot.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgPlot.append("g")
        .attr("class", "axis")
        .call(yAxis)
    // .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("dy", "0.75em")
    // .attr("y", 6)
    // .style("text-anchor", "end")
    // .text("PM2.5");

    const lines = svgPlot.selectAll("lines")
        .data(slc)
        .enter()
        .append("g");

    lines.append("path")
        .attr("class", ids)
        .attr("d", function (d) {
            return line(d.values)
        })
        //.style("opacity", 0)
        .style("fill", "none");

    // let brush = d3.brushX()
    //     .extent([
    //         [0, 0],
    //         [width, height]
    //     ])
    //     .on("end", updatePlot)
    // svgPlot
    //     .attr("class", "brush")
    //     .call(brush);



    // function updatePlot() {
    //     extent = d3.selection.extent
    //     //console.log(extent)

    // }

});
