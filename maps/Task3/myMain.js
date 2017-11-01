"use strict";

var myFunctionHolder = {};
//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
  if (feature.properties && feature.properties.Location) {
    layer.bindPopup("<b>Address: </b>" + feature.properties.Location);
  }
}

//declaring function 2
myFunctionHolder.pointToCircle = function (feature, latlng) {
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "yellow",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
  return circleMarker;
}

//execute
window.onload = function () {
  var mapObject = L.map('mapDivId').setView([39.99, -75.16], 11);

  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.01,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'value'
  };

  var heatmapLayer = new HeatmapOverlay(cfg);
  heatmapLayer.setData(theftsHeatMapData);
  mapObject.addLayer(heatmapLayer);

  // bikeThefts is the variable name we difined in Bike_Thefts_2011.js file. 
  //var bikesLayerGroup = L.geoJSON(bikeThefts, {
  //  onEachFeature: myFunctionHolder.addPopups,
  //  pointToLayer: myFunctionHolder.pointToCircle
  //});

  //mapObject.addLayer(bikesLayerGroup);
  //mapObject.fitBounds(bikesLayerGroup.getBounds());
};