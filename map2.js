// mapid is the id of the div where the map will appear
let map = L
  .map('mapid')
  .setView([35.5, -96.5], 4); // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 12,
  }).addTo(map);

// Add popup layer group to leaflet
let sensorGroup = L.geoJSON(null, {
  onEachFeature: function (feature, layer) {
    console.log("hi")
    layer.bindPopup("Name: " + feature.properties.label + "<br />" + "Value: " + feature.properties.monitorID);
  },
  pointToLayer: function (feature, LatLng) {
    return new L.marker(LatLng, {
      icon: icon
    });
  },
});

// Parse meta csv to geoJSON and add to map
omnivore.csv("http://localhost:8000/meta.csv", null, sensorGroup)
  .addTo(map)
  .on("click", (d) => {
    
    let markerColor = "#f00"
    d.layer.options.icon.options.html = markerHtmlStyles2; 
    console.log(d.layer.options.icon.options.html)
  });//d.layer.feature.properties)});

//Custom markers 
let markerColor = '#583470'

const markerHtmlStyles =
  `background-color: ${markerColor};
   width: 1.5rem;
   height: 1.5rem;
   display: block;
   left: -0.75rem;
   top: -0.75rem;
   position: relative;
   border-radius: 3rem 3rem 0;
   transform: rotate(45deg);
   border: 1px solid #FFFFFF`


const markerHtmlStyles2 =
  `background-color: #f00;
   width: 1.5rem;
   height: 1.5rem;
   display: block;
   left: -0.75rem;
   top: -0.75rem;
   position: relative;
   border-radius: 3rem 3rem 0;
   transform: rotate(45deg);
   border: 1px solid #FFFFFF`

const icon = L.divIcon({
  className: "custom-pin",
  iconAnchor: [0, 24],
  labelAnchor: [-6, 0],
  popupAnchor: [0, -36],
  html: `<span style="${markerHtmlStyles}" />`
})

// Add a svg layer to the map

/*
L.svg().addTo(map);

// We pick up the SVG from the map object
let mapsvg = d3.select("#mapid").select("svg"),
  g = mapsvg.append("g");

// Load the meta csv and update map
d3.csv("http://localhost:8000/meta.csv").then(function (meta) {

  // Add a LatLng object from meta coords
  meta.forEach(m => {
    m.LatLng = new L.LatLng(m.latitude, m.longitude)
  })

  // Select the svg layer and add the circles to it
  let feature = g.selectAll("circle")
    .data(meta)
    .enter()
    .append("circle")
    .attr("cx", d =>  { map.latLngToLayerPoint(d.LatLng).x })
    .attr("cy", d => { map.latLngToLayerPoint(d.LatLng).y })
    .attr("r", 8)
    .style("fill", "red")
    .attr("stroke", "red")
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4)

  // Function that update circle position if something change
  function update() {
    //g.selectAll("circle")
    feature
      .attr("cx", function (d) {
        return map.latLngToLayerPoint(d.LatLng).x
      })
      .attr("cy", function (d) {
        return map.latLngToLayerPoint(d.LatLng).y
      })
  }

  // If the user change the map (zoom or drag), update circle position:
  map.on("moveend", update)
  update();

})
*/