//Authors: Tim Hodson, Sam Mortinger, Chris Kinder, Arafat Hassan
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

//Filter for each crime type
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
    //writing reported date/time
    var reported = "<p><b>Reported On: </b>" + feature.properties["Reported_On"] + "</p>";
    //combining
    document.getElementById("description-box").innerHTML = intro + type + description + location + reported;
  });
  return circleMarker;
}

//execute onload
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

  //Code for clustering
  var clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    removeOutsideVisibleBounds: true

  });
  clusterGroup.addLayer(theftLayerGroup);
  clusterGroup.addLayer(assaultLayerGroup);
  clusterGroup.addLayer(drugLayerGroup);
  clusterGroup.addLayer(crashLayerGroup);
  clusterGroup.addLayer(adminLayerGroup);
  clusterGroup.addLayer(otherLayerGroup);

  mapObject.addLayer(clusterGroup);
  //end code for clustering

  //originally show every layer
  /*mapObject.addLayer(otherLayerGroup);
  mapObject.addLayer(theftLayerGroup);
  mapObject.addLayer(crashLayerGroup);
  mapObject.addLayer(drugLayerGroup);
  mapObject.addLayer(adminLayerGroup);
  mapObject.addLayer(assaultLayerGroup);
  */

  //disable zoom on double click
  mapObject.doubleClickZoom.disable();


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

  //Checks for each toggle on dotmap
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

  //reload the map when dotMap is selected
  document.getElementById('dotMap').onclick = function () {
    location.reload();
  }

  // ************************************************************************************
  // HeatMap Functions
  //*************************************************************************************

  document.getElementById('heatMap').onclick = function () {

    //remove the current layers from the map
    mapObject.removeLayer(otherLayerGroup);
    mapObject.removeLayer(theftLayerGroup);
    mapObject.removeLayer(crashLayerGroup);
    mapObject.removeLayer(drugLayerGroup);
    mapObject.removeLayer(adminLayerGroup);
    mapObject.removeLayer(assaultLayerGroup);
    mapObject.removeLayer(clusterGroup);

    //uncheck all checkboxes
    $('#otherToggle').attr('checked', false);
    $('#theftToggle').attr('checked', false);
    $('#crashToggle').attr('checked', false);
    $('#drugToggle').attr('checked', false);
    $('#adminToggle').attr('checked', false);
    $('#assaultToggle').attr('checked', false);

    //heatmap code from leaflet
    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.001,
      "maxOpacity": .5,
      // scales the radius based on map zoom
      "scaleRadius": true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": false,
      // which field name in your data represents the latitude - default "lat"
      latField: 'Lat',
      max: 'max',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'Lon',
      // which field name in your data represents the data value - default "value"
      valueField: 'Value'
    };

    //add original full data heatmap
    var heatmapLayer = new HeatmapOverlay(cfg);
    heatmapLayer.setData(filteredheatData);
    mapObject.addLayer(heatmapLayer);

    //Make buttons visiable
    document.getElementById("theftHeat").style.visibility = "visible";
    document.getElementById("crashHeat").style.visibility = "visible";
    document.getElementById("drugHeat").style.visibility = "visible";
    document.getElementById("adminHeat").style.visibility = "visible";
    document.getElementById("assaultHeat").style.visibility = "visible";
    document.getElementById("otherHeat").style.visibility = "visible";
    document.getElementById("allHeat").style.visibility = "visible";

    //shows only theft heatmap
    $("#theftHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Theft";
      });
      var theftHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(theftHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only crash heatmap
    $("#crashHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Crash";
      });
      var crashHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(crashHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only drug heatmap
    $("#drugHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Drug";
      });
      var drugHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(drugHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only admin heatmap
    $("#adminHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Admin";
      });
      var adminHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(adminHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only assault/criminal heatmap
    $("#assaultHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Assault";
      });
      var assaultHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(assaultHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only "other" heatmap
    $("#otherHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        return element.Crime_Type == "Other";
      });
      var otherHeat = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(otherHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //resets to full data heatmap
    $("#allHeat").click(function () {
      mapObject.removeLayer(heatmapLayer)
      heatmapLayer.setData(filteredheatData);
      mapObject.addLayer(heatmapLayer);
    });

    document.getElementById("description-box").innerHTML = "<p><b>Select a crime type here to see heatmap!</b></p>"
  }//end of heatmap onclick

  //*************************************************************************************
  // End HeatMap Functions
  //*************************************************************************************

  var ctx = document.getElementById("chartContainer").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Drug-Related", "Theft", "Traffic Incident", "Administrative", "Criminal Incident", "Other"],
      datasets: [
        {
          label: "Number of Occurrences",
          backgroundColor: ["#800080", "#008000", "#0000FF", "#FFFF00", "#FF0000", "#F0F0F0"],
          data: [drugLayerGroup.getLayers().length, theftLayerGroup.getLayers().length, crashLayerGroup.getLayers().length, adminLayerGroup.getLayers().length, assaultLayerGroup.getLayers().length, otherLayerGroup.getLayers().length]
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
