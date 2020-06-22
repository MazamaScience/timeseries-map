var map = L.map('map').setView([-41.2858, 174.7868], 13);
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
 
 d3.json("http://localhost:8000/data.json")
 .then(function(collection) {
  // Add a LatLng object to each item in the dataset
  collection.objects.forEach(function(d) {
   d.LatLng = new L.LatLng(d.circle.coordinates[0],
                           d.circle.coordinates[1])
  })

  var mouseOver = function() {
      var circle = d3.select(this);
      circle.style("stroke", "blue");
  }
  
  var feature = g.selectAll("circle")
   .data(collection.objects)
   .enter()
   .append("circle")
        .style("stroke", "black") 
        .style("opacity", .6) 
        .style("fill", "red")
        .attr("r", 20)
        .on("mouseover", mouseOver)
        .on("click", doSomething);
  
  map.on("viewreset", update);
  update();

function update() {
  feature.attr("transform", 
  function(d) { 
       return "translate("+ 
    map.latLngToLayerPoint(d.LatLng).x +","+ 
    map.latLngToLayerPoint(d.LatLng).y +")";
       }
   )
  }
})    

var doSomething = function(d) {
     var poi = d3.select(this);
     poi.style("fill", "black");
     //console.log(d);
     
}