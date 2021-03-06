const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;

// append SVG conatiner first
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
map.on("click", function (d) {
    //console.log(sensorID, d);
    svgPlot.selectAll("path")
        //.attr("visibility", "hidden")
        .style("opacity", 0);

    // Hacky way to show the xaxis and line on marker click
    svgPlot.selectAll(".mouse-line").style("opacity", 1);
    svgPlot.selectAll(".domain").style("opacity", 1); //.attr("visibility", "visible");

    svgPlot.selectAll("path.line-" + sensorID)
        //.attr("visibility", "visible")
        .transition()
        .style("opacity", 1)
        .style("stroke", "red");

});

// Create cursor follower
let focus = svgPlot.append("g");
//.append("display", "none");

// Store mouseover focus data 
let focusDate;
let focusColor;

// color ramp map 
let col = d3.scaleThreshold()
    .domain([12, 35, 55, 75, 100])
    // SCAQMD profile
    .range(["#abe3f4", "#118cba", "#286096", "#8659a5", "#6a367a"]);

//let playButton = d3.select("#play-button");

dataset.then(function(data) {

    // This chunk takes the CSV data, remaps it to a more appropriate format
    let slc = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    date: parseDate(d.datetime),
                    pm25: +d[id],
                    color: col(+d[id])
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


    // Add custom class id to each line using monitorID
    let i = 0;
    const ids = () => {
        return "line-" + slc[i++].id
    }

    // Add the x axis
    svgPlot.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y axis
    svgPlot.append("g")
        .attr("class", "y-axis")
        .call(yAxis);


    // Vertical line to follow mouse
    let mouseG = svgPlot.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path")
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 1);

    // Line Prep
    // TODO: Make bars 
    const line = d3.line()
        .x(d => {
            return xScl(d.date)
        })
        .y(d => {
            return yScl(d.pm25)
        });

    // // Add rects 
    // svgPlot.selectAll("rect")
    //     .data(slc)
    //     .enter()
    //     .append("rect")
    //         .attr("height", "250")//function(d, i) { return yScl(d.pm25)})
    //         .attr("width", "10")
    //         .attr("x", (d, i) => { return i * 12 + margin }) // Spacing
    //         .attr("y", (d, i ))

    // Add lines call
    let lines = svgPlot.selectAll("lines")
        .data(slc)
        .enter()
        .append("g");

    lines.append("path")
        .attr("class", ids)
        .attr("d", d => {
            return line(d.values)
        })
        // Hide all lines, only show the one clicked
        .style("fill", "none"); 

    // Bisect date long to left side of hour 
    const bisect = d3.bisector(d => {
        return d.date
    }).left;

    svgPlot //.selectAll("path.line-" + sensorID)
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", followMouse);

    // Map colors based on x pos 
    function mapColors(x) {

        let pp = slc.filter(d => {
            return d.id == sensorID
        })[0]

        let i = bisect(pp.values, x, 1)

        focusDate = slc.map(d => {
            return d.values[i].date
        });

        // Map the color to each timestep on cursor 
        focusColor = slc.map(d => {
            return {
                id: d.id,
                date: d.values[i].date,
                color: d.values[i].color
            }
        });

    };

    function followMouse() {


        let x0 = xScl.invert(d3.mouse(this)[0])

        // Map the colors based on the mouse position 
        mapColors(x0);

        // Move focus line 
        let mouse = d3.mouse(this);
        d3.select(".mouse-line")
            .attr("d", () => {
                let d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
            });

    }
});