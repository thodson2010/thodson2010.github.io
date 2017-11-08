"use strict";

var myFunctionHolder = {};
//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
  if (feature.properties && feature.properties.Location) {
    var incLocation = feature.properties.Location
    var endLoc = incLocation.indexOf("Ohio");
    incLocation = incLocation.substring(0, endLoc-1);
    layer.bindPopup("<b>Crime Type : </b>" + feature.properties["Incident Type"] + "<br><b> Location : </b>" + incLocation);
  }
}

//declaring function 2
myFunctionHolder.pointToCircle = function (feature, latlng) {
  var fillColorVar = "white";
  var type = feature.properties["Incident Type"];
  if(type.includes("Crash"))
  {
    fillColorVar = "blue";
  }
  else if(type.includes("Drug"))
  {
    fillColorVar = "purple";
  }
  else if(type.includes("Theft") || type.includes("Burglary") || type.includes("Breaking"))
  {
    fillColorVar = "green";
  }
  else if(type.includes("Assault") || type.includes("Criminal"))
  {
    fillColorVar = "red";
  }
  else if(type.includes("Administrative") || type.includes("Assist"))
  {
    fillColorVar = "yellow";
  }
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: fillColorVar,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
  circleMarker.on('click', function(){
        var description = "<p><b>Description : </b>" + feature.properties.Description + "</p>";
        document.getElementById("description-box").innerHTML = description;
    });
  return circleMarker;
}

//this would be where we filter data, for now just prints the type to console
myFunctionHolder.filter = function(type){
	console.log(type);
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
  
  //add event listeners
  var filter1 = document.getElementById("filter1").addEventListener('click', myFunctionHolder.filter(1));
  var filter2 = document.getElementById("filter2").addEventListener('click', myFunctionHolder.filter(2));
  var filter3 = document.getElementById("filter3").addEventListener('click', myFunctionHolder.filter(3));

  mapObject.addLayer(crimeLayerGroup);
  mapObject.fitBounds(crimeLayerGroup.getBounds());
};
