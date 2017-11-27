"use strict";

var myFunctionHolder = {};
//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
  if (feature.properties && feature.properties.Location) {
    var incLocation = feature.properties.Location
    var endLoc = incLocation.indexOf("Ohio");
    incLocation = incLocation.substring(0, endLoc - 1);
    //layer.bindPopup("<b>Crime Type : </b>" + feature.properties["Incident Type"] + "<br><b> Location : </b>" + incLocation);
  }
}

//Filter for each crime type: Need to find way of condensing to one method
myFunctionHolder.filterTheft = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (type.includes("Theft") || type.includes("Burglary") || type.includes("Breaking")) {
    return true;
  }
}
myFunctionHolder.filterCrash = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (type.includes("Crash")) {
    return true;
  }
}
myFunctionHolder.filterDrug = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (type.includes("Drug")) {
    return true;
  }
}
myFunctionHolder.filterAdmin = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (type.includes("Administrative") || type.includes("Assist")) {
    return true;
  }
}
myFunctionHolder.filterAssault = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (type.includes("Assault") || type.includes("Criminal")) {
    return true;
  }
}
myFunctionHolder.filterOther = function (feature) {
  var type = feature.properties["Incident_Type"];
  if (!type.includes("Assault") && !type.includes("Criminal") && !type.includes("Administrative") && !type.includes("Assist") && !type.includes("Drug") && !type.includes("Crash") && !type.includes("Theft")
    && !type.includes("Burglary") && !type.includes("Breaking")) {
    return true;
  }
}



//declaring function 2
myFunctionHolder.pointToCircle = function (feature, latlng) {
  var fillColorVar = "white";
  var type = feature.properties["Incident_Type"];
  if (type.includes("Crash")) {
    fillColorVar = "blue";
  }
  else if (type.includes("Drug")) {
    fillColorVar = "purple";
  }
  else if (type.includes("Theft") || type.includes("Burglary") || type.includes("Breaking")) {
    fillColorVar = "green";
  }
  else if (type.includes("Assault") || type.includes("Criminal")) {
    fillColorVar = "red";
  }
  else if (type.includes("Administrative") || type.includes("Assist")) {
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

  var intro = "<p><b>Please select a point on the map for details.</b></p>"
  document.getElementById("description-box").innerHTML = intro
  var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
  circleMarker.on('click', function () {

    geojsonMarkerOptions.color = "#FFF"; //not working, need to fix
    //writing type
    var type = "<p><b>Crime Type: </b>" + feature.properties["Incident_Type"] + "</p>";
    //writing description
    var description = "<p><b>Description: </b>" + feature.properties.Description + "</p>";
    //writing location, trim off end
    var incLocation = feature.properties.Location
    var endLoc = incLocation.indexOf("Ohio");
    incLocation = incLocation.substring(0, endLoc - 1);
    var location = "<p><b>Location: </b>" + incLocation + "</p>";
    //combining
    document.getElementById("description-box").innerHTML = intro + type + description + location;
  });
  return circleMarker;
}

//execute
window.onload = function () {
  var mapObject = L.map('mapDivId');
  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/thodson2010/cjaheuw43830s2rmoic7sv5ma/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhvZHNvbjIwMTAiLCJhIjoiY2o2emhxOTI2MDBscjMybWZlM3hiNWI2eSJ9.OuRWPHW_VJ9Ek4_ROgF0Pw', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

  //Add text to credit box
  document.getElementById("creditBox").innerHTML = "<p>Ohio State University Interactive Crime Map</p><p>Created by: Tim Hodson, Sam Mortinger, Chris Kinder, and Arafat Hassan</p>"

  //Create each layer group
  var otherLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterOther,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  var theftLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterTheft,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  var crashLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterCrash,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  var drugLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterDrug,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  var adminLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterAdmin,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  var assaultLayerGroup = L.geoJSON(crimeData, {
    filter: myFunctionHolder.filterAssault,
    pointToLayer: myFunctionHolder.pointToCircle
  });

  //originally show every layer
  mapObject.addLayer(otherLayerGroup);
  mapObject.addLayer(theftLayerGroup);
  mapObject.addLayer(crashLayerGroup);
  mapObject.addLayer(drugLayerGroup);
  mapObject.addLayer(adminLayerGroup);
  mapObject.addLayer(assaultLayerGroup);


  //add overlay for toggling crime types, id = "toggles"
  var toggle = L.control({ position: 'bottomleft' });
  var legend = L.control({ position: 'bottomright' });

  //Adds toggles to map
  toggle.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'toggles');
    div.innerHTML = "<b>Filters: </b><form><input type = \"checkbox\" id=\"theftToggle\" checked><label>Theft</label></input><input type = \"checkbox\" id = \"crashToggle\" checked><label>Traffic Incident</label></input></form><input type = \"checkbox\" id=\"drugToggle\" checked><label>Drug-related</label></input><input type = \"checkbox\" id=\"adminToggle\" checked><label>Administrative</label></input><input type = \"checkbox\" id=\"assaultToggle\" checked><label>Criminal Incident</label></input><input type = \"checkbox\" id=\"otherToggle\" checked><label>Other</label></input>";
    return div;
  };

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
      title = ['<strong> Crime Type </strong>'],
      categories = ['Theft', 'Traffic Incident', 'Drug Related', 'Administrative', 'Criminal Incident', 'Other'];

    for (var i = 0; i < categories.length; i++) {
      div.innerHTML += title.push(
        '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' + categories[i]);
    }
    div.innerHTML = title.join('<br>');

    return div;
  };

  function getColor(d) {
    switch (d) {
      case 'Theft':
        return 'green';
      case 'Traffic Incident':
        return 'blue';
      case 'Drug Related':
        return 'purple';
      case 'Administrative':
        return 'yellow';
      case 'Criminal Incident':
        return 'red';
      default:
        return 'white';
    }
  };

  var overlays = {
    "Thefts": theftLayerGroup
  };
  mapObject.fitBounds(adminLayerGroup.getBounds());
  toggle.addTo(mapObject);
  legend.addTo(mapObject);

  //Checks for each toggle
  $('#otherToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(otherLayerGroup);
    else
      mapObject.removeLayer(otherLayerGroup);
  });
  $('#theftToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(theftLayerGroup);
    else
      mapObject.removeLayer(theftLayerGroup);
  });

  $('#crashToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(crashLayerGroup);
    else
      mapObject.removeLayer(crashLayerGroup);
  });

  $('#drugToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(drugLayerGroup);
    else
      mapObject.removeLayer(drugLayerGroup);
  });

  $('#adminToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(adminLayerGroup);
    else
      mapObject.removeLayer(adminLayerGroup);
  });
  $('#assaultToggle').change(function () {
    if (this.checked)
      mapObject.addLayer(assaultLayerGroup);
    else
      mapObject.removeLayer(assaultLayerGroup);
  });

  var dotButton = document.getElementById('dotMap');
  dotButton.onclick = function(){
    console.log('Dot Success');
    location.reload();
  }

  var heatButton = document.getElementById('heatMap');
  heatButton.onclick = function(){
    console.log('Heat Success');

    mapObject.removeLayer(otherLayerGroup);
    mapObject.removeLayer(theftLayerGroup);
    mapObject.removeLayer(crashLayerGroup);
    mapObject.removeLayer(drugLayerGroup);
    mapObject.removeLayer(adminLayerGroup);
    mapObject.removeLayer(assaultLayerGroup);

    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.002,
      "maxOpacity": .5,
      // scales the radius based on map zoom
      "scaleRadius": true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": false,
      // which field name in your data represents the latitude - default "lat"
      latField: 'Lat',
      max: 5,
      // which field name in your data represents the longitude - default "lng"
      lngField: 'Lon',
      // which field name in your data represents the data value - default "value"
      valueField : 'Value'
    };

    var heatmapLayer = new HeatmapOverlay(cfg);
    heatmapLayer.setData(heatData);
    mapObject.addLayer(heatmapLayer);
    document.getElementById("description-box").innerHTML = "<p><b>Heatmap is only available for full dataset. Additional functionality coming soon!</b></p>"
  }

  var timeButton = document.getElementById('timeline');
  // timeButton.onclick = function(){
  //   console.log('Time Success');
  // }

  var ctx = document.getElementById("chartContainer").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Drug-Related", "Theft", "Traffic Incident", "Administrative", "Criminal Incident", "Other"],
      datasets: [
        {
          label: "Number of Occurrences",
          backgroundColor: ["#800080", "#008000","#0000FF","#FFFF00","#FF0000","#F0F0F0"],
          data: [drugLayerGroup.getLayers().length,theftLayerGroup.getLayers().length,crashLayerGroup.getLayers().length,adminLayerGroup.getLayers().length,assaultLayerGroup.getLayers().length,otherLayerGroup.getLayers().length]
        }
      ]
    },
    options: {
      legend: { display: false },
      responsive: false,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Crime Occurrences Around Campus'
      }
    }
});
};
