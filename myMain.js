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
    document.getElementById("description-box").innerHTML = description + location + type;
  });
  return circleMarker;
}

//execute
window.onload = function () {
  var mapObject = L.map('mapDivId');
  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

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
    categories = ['Theft', 'Traffic Incident', 'Drug Related', 'Administrative', 'Criminal Incident', 'Other'];

    for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] + '<br>' : '+');
    }

    return div;
  };

  function getColor(d) {
    if (d === 'Theft') {
      return 'green';
    } else if (d === 'Traffic Incident') {
      return 'blue';
    } else if (d === "Drug Related") {
      return 'purple';
    } else if (d === "Administrative") {
      return 'yellow';
    } else if (d === "Criminal Incident") {
      return 'red';
    } else {
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
};
