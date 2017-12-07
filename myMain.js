//Authors: Tim Hodson, Sam Mortinger, Chris Kinder, Arafat Hassan
"use strict";


// ************************************************************************************
// Date Filter
//*************************************************************************************
var mapType = true;
var myMonth = "Empty"

function resetButtons() {
  document.getElementById("theftHeat").style.backgroundColor = "transparent";
  document.getElementById("crashHeat").style.backgroundColor = "transparent";
  document.getElementById("drugHeat").style.backgroundColor = "transparent";
  document.getElementById("adminHeat").style.backgroundColor = "transparent";
  document.getElementById("assaultHeat").style.backgroundColor = "transparent";
  document.getElementById("otherHeat").style.backgroundColor = "transparent";
  document.getElementById("allHeat").style.backgroundColor = "transparent";
}

function getMonth(month) {
  var e = document.getElementById('monthValue');
  myMonth = e.options[e.selectedIndex].value;
  return myMonth
}

$(document).on('change', '#monthValue', function () {
  var myMonth1 = ($(this).val());
  console.log(myMonth1);
  myMonth = getMonth(myMonth1);
  mapObject.removeLayer(clusterGroup);
  myFunctionHolder.setLayers(crimeData, mapObject);
  resetButtons()
});

var theftLayerGroup;
var adminLayerGroup;
var assaultLayerGroup;
var crashLayerGroup;
var drugLayerGroup;
var otherLayerGroup;
var clusterGroup;
var mapObject;
var myChart;
var theftLength, drugLength, adminLength, assaultLength, crashLength, otherLength;


//************************************************************************************
//End Date Filter
//*************************************************************************************
var myFunctionHolder = {};

//Filter for each crime type
myFunctionHolder.filterTheft = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if ((type.includes("Theft") || type.includes("Burglary") || type.includes("Breaking")) && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (type.includes("Theft") || type.includes("Burglary") || type.includes("Breaking")) {
        return true;
      }
    }
  }
}
myFunctionHolder.filterCrash = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if (type.includes("Crash") && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (type.includes("Crash")) {
        return true;
      }
    }
  }
}
myFunctionHolder.filterDrug = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if (type.includes("Drug") && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (type.includes("Drug")) {
        return true;
      }
    }
  }
}
myFunctionHolder.filterAdmin = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if ((type.includes("Administrative") || type.includes("Assist")) && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (type.includes("Administrative") || type.includes("Assist")) {
        return true;
      }
    }
  }
}

myFunctionHolder.filterAssault = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if ((type.includes("Assault") || type.includes("Criminal")) && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (type.includes("Assault") || type.includes("Criminal")) {
        return true;
      }
    }
  }
}

myFunctionHolder.filterOther = function (feature) {
  if (mapType == true){
    var type = feature.properties["Incident_Type"];
    if (myMonth != "Empty") {
      if ((!type.includes("Assault") && !type.includes("Criminal") && !type.includes("Administrative") && !type.includes("Assist") && !type.includes("Drug") && !type.includes("Crash") && !type.includes("Theft")) && feature.properties["Month"] === myMonth) {
        return true;
      }
    }
    else {
      if (!type.includes("Assault") && !type.includes("Criminal") && !type.includes("Administrative") && !type.includes("Assist") && !type.includes("Drug") && !type.includes("Crash") && !type.includes("Theft")
        && !type.includes("Burglary") && !type.includes("Breaking")) {
        return true;
      }
    }
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
    //data censoring
    //var description = "<p><b>Description: </b>" + feature.properties.Description + "</p>";
    var description = "<p><b>Description: </b>" + "Omitted" + "</p>";
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

myFunctionHolder.setLayers = function (data, map) {
  theftLayerGroup, adminLayerGroup, crashLayerGroup, drugLayerGroup, assaultLayerGroup, otherLayerGroup = {};
  //Create each layer group
  otherLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterOther,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  theftLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterTheft,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  crashLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterCrash,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  drugLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterDrug,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  adminLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterAdmin,
    pointToLayer: myFunctionHolder.pointToCircle
  });
  assaultLayerGroup = L.geoJSON(data, {
    filter: myFunctionHolder.filterAssault,
    pointToLayer: myFunctionHolder.pointToCircle
  });

  //Code for clustering
  clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true
  });

  clusterGroup.addLayer(theftLayerGroup);
  clusterGroup.addLayer(assaultLayerGroup);
  clusterGroup.addLayer(drugLayerGroup);
  clusterGroup.addLayer(crashLayerGroup);
  clusterGroup.addLayer(adminLayerGroup);
  clusterGroup.addLayer(otherLayerGroup);

  drugLength = drugLayerGroup.getLayers().length;
  theftLength = theftLayerGroup.getLayers().length;
  crashLength = crashLayerGroup.getLayers().length;
  adminLength = adminLayerGroup.getLayers().length;
  assaultLength = assaultLayerGroup.getLayers().length;
  otherLength = otherLayerGroup.getLayers().length;

  map.addLayer(clusterGroup);

  var ctx = document.getElementById("chartContainer").getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Drug-Related", "Theft", "Traffic Incident", "Administrative", "Criminal Incident", "Other"],
      datasets: [
        {
          label: "Number of Occurrences",
          backgroundColor: ["#800080", "#008000", "#0000FF", "#FFFF00", "#FF0000", "#adabab"],
          data: [drugLength, theftLength, crashLength, adminLength, assaultLength, otherLength]
        }
      ]
    },
    options: {
      legend: { display: false },
      /* scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max: 1000}}]
      }, */
      responsive: false,
      hover: { mode: null },
      maintainAspectRatio: true,
      title: {
        display: true,
        text: 'Crime Occurrences Around Campus'
      }
    }
  });
}

//execute onload
window.onload = function () {
  mapObject = L.map('mapDivId');
  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/thodson2010/cjaheuw43830s2rmoic7sv5ma/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhvZHNvbjIwMTAiLCJhIjoiY2o2emhxOTI2MDBscjMybWZlM3hiNWI2eSJ9.OuRWPHW_VJ9Ek4_ROgF0Pw', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

  //Add text to credit box
  document.getElementById("creditBox").innerHTML = "<p>Ohio State University Interactive Crime Map</p><p>Created by: Tim Hodson, Sam Mortinger, Chris Kinder, and Arafat Hassan</p><p>Produced for: Morteza Karimzadeh, Geovisualization (Geog 5201)</p>"

  //add data to map
  myFunctionHolder.setLayers(crimeData, mapObject);

  //disable zoom on double click
  mapObject.doubleClickZoom.disable();


  //add overlay for toggling crime types, id = "toggles"
  var toggle = L.control({ position: 'bottomleft' });
  var legend = L.control({ position: 'bottomright' });
  var heatLegend = L.control({ position: 'bottomright' });

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

  heatLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'heatLegend'),
      title = [];
    div.innerHTML += title.push('<strong>Number</strong>');
    div.innerHTML += title.push('<strong>Crimes</strong>');
    div.innerHTML += title.push('10');
    div.innerHTML += title.push('<i class="heatGradient"></i>');
    div.innerHTML += title.push('0');

    div.innerHTML = title.join('<br>');

    return div;
  }

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
      clusterGroup.addLayer(otherLayerGroup);
    else
      clusterGroup.removeLayer(otherLayerGroup);
  });

  $('#theftToggle').change(function () {
    if (this.checked)
      clusterGroup.addLayer(theftLayerGroup);
    else
      clusterGroup.removeLayer(theftLayerGroup);
  });

  $('#crashToggle').change(function () {
    if (this.checked)
      clusterGroup.addLayer(crashLayerGroup);
    else
      clusterGroup.removeLayer(crashLayerGroup);
  });

  $('#drugToggle').change(function () {
    if (this.checked)
      clusterGroup.addLayer(drugLayerGroup);
    else
      clusterGroup.removeLayer(drugLayerGroup);
  });

  $('#adminToggle').change(function () {
    if (this.checked)
      clusterGroup.addLayer(adminLayerGroup);
    else
      clusterGroup.removeLayer(adminLayerGroup);
  });
  $('#assaultToggle').change(function () {
    if (this.checked)
      clusterGroup.addLayer(assaultLayerGroup);
    else
      clusterGroup.removeLayer(assaultLayerGroup);
  });

  //reload the map when dotMap is selected
  document.getElementById('dotMap').onclick = function () {
    location.reload();
  }

  // ************************************************************************************
  // HeatMap Functions
  //*************************************************************************************

  document.getElementById('heatMap').onclick = function () {

    mapType = false;

    //remove the current layers from the map
    mapObject.removeLayer(otherLayerGroup);
    mapObject.removeLayer(theftLayerGroup);
    mapObject.removeLayer(crashLayerGroup);
    mapObject.removeLayer(drugLayerGroup);
    mapObject.removeLayer(adminLayerGroup);
    mapObject.removeLayer(assaultLayerGroup);
    mapObject.removeLayer(clusterGroup);

    //remove dot map filters and legends and add heat map legend
    mapObject.removeControl(toggle);
    mapObject.removeControl(legend);
    heatLegend.addTo(mapObject);

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

    //resets button background color to white


    resetButtons();

    //Make buttons visiable
    document.getElementById("theftHeat").style.visibility = "visible";
    document.getElementById("crashHeat").style.visibility = "visible";
    document.getElementById("drugHeat").style.visibility = "visible";
    document.getElementById("adminHeat").style.visibility = "visible";
    document.getElementById("assaultHeat").style.visibility = "visible";
    document.getElementById("otherHeat").style.visibility = "visible";
    document.getElementById("allHeat").style.visibility = "visible";
    document.getElementById("allHeat").style.backgroundColor = "grey";

    //shows only theft heatmap
    $("#theftHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("theftHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Theft";
        }
        else {
          return element.Crime_Type == "Theft" && element.Month == tempMonth;
        }
      });
      var theftHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(theftHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only crash heatmap
    $("#crashHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("crashHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Crash";
        }
        else {
          return element.Crime_Type == "Crash" && element.Month == tempMonth;
        }
      });
      var crashHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(crashHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only drug heatmap
    $("#drugHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("drugHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Drug";
        }
        else {
          return element.Crime_Type == "Drug" && element.Month == tempMonth;
        }
      });
      var drugHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(drugHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only admin heatmap
    $("#adminHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("adminHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Admin";
        }
        else {
          return element.Crime_Type == "Admin" && element.Month == tempMonth;
        }
      });
      var adminHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(adminHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only assault/criminal heatmap
    $("#assaultHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("assaultHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Assault";
        }
        else {
          return element.Crime_Type == "Assault" && element.Month == tempMonth;
        }
      });

      var assaultHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(assaultHeat);
      mapObject.addLayer(heatmapLayer);
    });

    //shows only "other" heatmap
    $("#otherHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("otherHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth === "Empty") {
          return element.Crime_Type == "Other";
        }
        else {
          return element.Crime_Type == "Other" && element.Month == tempMonth;
        }
      });
      var otherHeat = { "max": 5, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(otherHeat);
      mapObject.addLayer(heatmapLayer);
    });


    //resets to full data heatmap
    $("#allHeat").click(function () {
      var tempMonth = getMonth();
      resetButtons();
      document.getElementById("allHeat").style.backgroundColor = "grey";
      mapObject.removeLayer(heatmapLayer)
      var tempData = $.grep(filteredheatData.data, function (element, index) {
        if (tempMonth != "Empty") {
          return element.Month == tempMonth;
        }
        else {
          return element
        }
      });
      var allMonth = { "max": 10, "data": tempData }
      heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(allMonth);
      mapObject.addLayer(heatmapLayer);
    });

    document.getElementById("description-box").innerHTML = "<p><b>Select a month above, then select a button to see a heatmap for that month.</b></p>"
  }//end of heatmap onclick

  //*************************************************************************************
  // End HeatMap Functions
  //*************************************************************************************


};
