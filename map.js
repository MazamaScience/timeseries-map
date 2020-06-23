// ----- CREATE LEAFLET ---------------------------//
var map = L.map('map').setView([35.5, -96.5], 4);
mapLink =
  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

// Initialize the SVG layer
map._initPathRoot()

// We pick up the SVG from the map object
var svg = d3.select("#map").select("svg"),
  g = svg.append("g");


// ----- DATA PREPARATION ------------------------//
var meta = d3.csv("http://localhost:8000/meta.csv");
meta.then(function (meta) {
  meta.map(function (m) {
    m.latitude = +m.latitude;
    m.longitude = +m.longitude;
    return m;
  });
});

// ----- ADD CIRCLES TO MAP --------------------//
meta.then(function (meta) {
  // Add a LatLng object to each item in the dataset
  meta.forEach(function (m) {
    m.LatLng = new L.LatLng(m.latitude, m.longitude)
  })

  var mouseOver = function () {
    var circle = d3.select(this);
    circle.style("stroke", "blue");
  }

  var feature = g.selectAll("circle")
    .data(meta)
    .enter()
    .append("circle")
    .style("stroke", "black")
    .style("opacity", .6)
    .style("fill", "red")
    .attr("r", 10)
    .on("mouseover", mouseOver)
    .on("click", doSomething);

  map.on("viewreset", update);
  update();

  function update() {
    feature.attr("transform",
      function (d) {
        return "translate(" +
          map.latLngToLayerPoint(d.LatLng).x + "," +
          map.latLngToLayerPoint(d.LatLng).y + ")";
      }
    )
  }
})

var doSomething = function (d) {
  var poi = d3.select(this);
  poi.style("fill", "black");
  console.log(d);

}