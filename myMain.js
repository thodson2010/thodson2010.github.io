"use strict";

var myFunctionHolder = {};
//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
  if (feature.properties && feature.properties.Location) {
    layer.bindPopup("<b>Crime Type : </b>" + feature.properties["Incident Type"] + "<b> Description : </b>" + feature.properties.Description);
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
  var mapObject = L.map('mapDivId');

  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

  // bikeThefts is the variable name we difined in Bike_Thefts_2011.js file. 
  var crimeLayerGroup = L.geoJSON(crimeData, {
    onEachFeature: myFunctionHolder.addPopups,
    pointToLayer: myFunctionHolder.pointToCircle
  });

  mapObject.addLayer(crimeLayerGroup);
  mapObject.fitBounds(crimeLayerGroup.getBounds());
};