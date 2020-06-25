const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;
// append SVG first
var svg = d3.select("#plot").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-" +
        adj + " -" +
        adj + " " +
        (width + adj * 3) + " " +
        (height + adj * 3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "-" + adj + " -" + adj + " " + (width + adj) + " " + (height + adj))
//     .style("padding", 5)
//     .style("margin", 5)
//     .classed("svg-content", true);

// svg.append("text")
//     .style("font-size", "16px")
//     .text("pm2.5");

// ----- DATA PREPARATION ------------------------//
const dataset = d3.csv("http://localhost:8000/data.csv");

const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

dataset.then(function(data) {

    // This chunk takes the CSV data, remaps it to a more appropriate format
    var slc = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    date: parseDate(d.datetime),
                    pm25: +d[id]
                };
            })
        }
    });

    console.log(slc)



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

    let id = 0;
    const ids = () => {
        return "line-" + id++
    }

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
    // .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("dy", "0.75em")
    // .attr("y", 6)
    // .style("text-anchor", "end")
    // .text("PM2.5");

    const lines = svg.selectAll("lines")
        .data(slc)
        .enter()
        .append("g");

    lines.append("path")
        .attr("class", ids)
        .attr("d", function(d) { return line(d.values) });


    lines.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScl(d.value.date) + 10) + "," + (yScl(d.value.pm25) + 5 ) + ")"; })
    .attr("x", 5)
    .text(function(d) { return ("Serie ") + d.id; });

});

// dataset.then(function (dataObjects) {
//     // // Option 1 
//     // dataObjects.forEach(d => {
//     //     newObj = {
//     //         date: d.datetime,
//     //         values: Object.keys(d).map(function (key) {
//     //             if (key != "datetime") {
//     //                 return { [key]: d[key]}
//     //             }
//     //         })
//     //     }
//     //     console.log(newObj)
//     //     // fancy screen stuff 
//     //     // newObj.values.forEach{...}
//     // })

//     // // Option 2

//     dataObjects.map(function (obj) {
//         return 1
//     })

//     // data.entries();
//     // data.forEach(function (d) {
//     //     console.log(d)
//     // })
//     // data.map(function (d) {
//     //    // stuff
//     //     let dates = new Date(d.datetime)
//     //     //let vals = d[[dataCols]]
//     //     console.log(d)

//     //     return {
//     //         datetime: dates

//     //     }
//     // });

//     // console.log(data)

// });

/*
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
*/