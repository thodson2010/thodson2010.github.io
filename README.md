CrimeTime BETA (updated 12.7.17)
Developed by: 
	Tim Hodson - hodson.24@buckeyemail.osu.edu
	Sam Mortinger - mortinger.4@buckeyemail.osu.edu
	Chris Kinder - kinder.54@buckeyemail.osu.edu
	Arafat Hassan - hassan.239@buckeyemail.osu.edu
	Developed for: Morteza Karimzadeh, Geovisualization (Geog 5201)
	https://geography.osu.edu/courses/5201 

VIDEO INTRODUCTION:
	https://youtu.be/FWyyP7MNEHo
	
DATA
	Data from January - October 2017
	Data obtained from the OSU Daily Crime Log
	https://dps.osu.edu/daily-crime-log

RESOURCES AND ACKNOWLEDGEMENTS
	Beautiful Soup Python Library 
		https://www.crummy.com/software/BeautifulSoup/
	Leaflet Library
		http://leafletjs.com/
	Leaflet MarkerCluster Plugin
		https://github.com/Leaflet/Leaflet.markercluster
	Dynamic Heatmap
		https://www.patrick-wied.at/static/heatmapjs/
	Leaflet Heatmap Plugin
		https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html

WHAT AM I SEEING?
The application consists of 3 different elements:
	The map (left) - 
		* displays the desired data on a map
		* clusters are green for 0-9 crimes in an area, yellow for 10-99, and red for 100+
	The month selector box (top right) -
		* allows the selection of crime in a specific month to be displayed
	The description/selector box (middle right) -
		* if dot map is selected, displays useful information of an individual crime occurrence
		* if heat map is selected, allows the selection of certain crime type to be displayed
	The graph (bottom right) - 
		* shows totals by crime type with current time filter

HOW DO I USE THE APP?
	Toolbar -
		* Select how the data is displayed on the map (plots of individual crimes or a heat map)
	In-Map Filters (when dot map is selected) -
		* Select which types of crimes to be displayed on the dot map
	Selector Box Filters (when heat map is selected) -
		* When heat map is displayed, filtering options become available for the heat map. Select
	 	  the desired crime type to be displayed on the heat map
	Month Selector -
		* Select month of crime data to be displayed
		* Combination of month and crime type filtering is possible for both map types
		* When using the heatmap option, select the month first then select the crime type

PROBLEMS TO BE FIXED
	Chart Bug - 
		The chart does not update for heat map filtering
	Spiral Display of Points -
		When clicking on a point in the spiral display of individual crimes, the spiral collapses
		in that location
	Points Bug -
		When some crime type filters are unchecked when selecting a new month in dot map, all crime
		types become visible again. This can result in crime points still being on the map when no
		crime types are checked.
