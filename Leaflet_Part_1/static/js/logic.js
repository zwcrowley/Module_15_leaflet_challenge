// Leaflet challenge Part 1:
// By: Zack Crowley
// Create a map of all the earthquakes in the past week in the US:

// Run an API call from: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
let usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// createMap takes the markers array made below and creates a basemap and overlay- overlay has the markers:
function createMap(earthQuakes) {

	let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
								maxZoom: 20, attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'});
  
	// Create a baseMaps object to hold the USGS_USTopo layer.
	let baseMaps = {
	  "Topo Map": USGS_USTopo
	};
  
	// Create an overlayMaps object to hold the bikeStations layer.
	let overlayMaps = {
	  "Earthquakes": earthQuakes
	};
  
	// Create the map object with options.
	let map = L.map("map", {
	  center: [39.8283, -98.5795],
	  zoom: 12,
	  layers: [USGS_USTopo, earthQuakes]
	});
  
	// Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
	L.control.layers(baseMaps, overlayMaps, {
	  collapsed: false
	}).addTo(map);
  
}
  
function createMarkers(response) {
  
	// Pull the "stations" property from response.data.
	let eqs = response.features;
	console.log("All EQS", eqs);
  
	// Initialize an array to hold the bike markers.
	let eqMarkers = [];
  
	// Loop through the ea array.                  NOT WORKING!!!!!!!!!!!!!!
	for (var index = 0; index < eqs.length; index++) {
		let eq = eqs[index];

		console.log("eq lat", eq.geometry.coordinates[2]);  
		console.log("eq long", eq.geometry.coordinates[1]);  
		console.log("eq mag", eq.properties.mag);  
		console.log("eq depth", eq.geometry.coordinates[2]);  
		console.log("eq ids", eq.properties.ids);  
		console.log("eq time", eq.properties.time);  
		console.log("eq location", eq.properties.place);  

		// For each earthquake, create a marker, and bind a popup with the earthquake's ids, time, and location (place):
		L.circle([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], {
			fillOpacity:1,
			color:eq.properties.mag,
			fillColor:eq.properties.mag,
			radius:eq.geometry.coordinates[2] // depth is the third coordinate in geometry
			}).addTo(map).bindPopup(`<h1>${eq.properties.ids}</h1><hr><h3>Time: ${eq.properties.time}</h3><hr><h3>Location: ${eq.properties.place}</h3>`)
		}


	// Create a layer group that's made from the eqMarkers array, and pass it to the createMap function.
	createMap(L.layerGroup(eqMarkers));
	
}
  
  
// Perform an API call to the USGS API to get the earthquakes info for all eq in the past week, then call createMarkers when it completes.
d3.json(usgs_url).then(createMarkers);

// d3.json(usgs_url).then(function(data) { 
// 	console.log("all data", data.features);  
// } 
// );


