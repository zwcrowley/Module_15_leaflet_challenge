// Leaflet challenge Part 1:
// By: Zack Crowley
// Create a map of all the earthquakes in the past week in the US:

// Run an API call from: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
let usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// A function to determine the marker size based on the population
function markerSize(mag) {
	return Math.sqrt(mag) * 50;
  }
  

// createMap takes the markers array made below and creates a basemap and overlay- overlay has the markers, gets passed the layer group with the e1 markers= aliased as "earthQuakes":
function createMap(earthQuakes) {
	// Save the the topo as a var: NOT WORKING!!!!
	// let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {maxZoom: 20, attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'});

	/// Set streetmap as osm:
	let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	/// Set topo as OpenTopoMap:
	let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	  });
	
  
	// Create a baseMaps object to hold the USGS_USTopo layer.
	let baseMaps = {
	"Street Map": streetmap,
    "Topographic Map": topo
	};

	// Create an overlayMaps object to hold the earthQuakes layer.
	let overlayMaps = {
		"Earthquakes": earthQuakes
	};
  
	// Create the map object with options.
	let myMap = L.map("map-id", { 
	  center: [39.8283, -98.5795], 
	  zoom: 5,
	  layers: [streetmap, earthQuakes] 
	});
	
	// Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	  }).addTo(myMap); 
}
  
// Create a function to make the eq markers, pass in API call response data:
function createMarkers(response) {
  
	// Pull the response.features property from response:
	let eqs = response.features;
	// console.log("All EQS", eqs);
  
	// Initialize an array to hold the bike markers.
	let eqMarkers = [];
  
	// Loop through the eq array:                NOT WORKING!!!!!!!!!!!!!!
	for (var i = 0; i < eqs.length; i++) {
		// Pull out the index for the eq that is in the loop:
		let eq = eqs[i];

		// console.log("eq lat", eq.geometry.coordinates[2]);  
		// console.log("eq long", eq.geometry.coordinates[1]);  
		// console.log("eq mag", eq.properties.mag);  
		// console.log("eq depth", eq.geometry.coordinates[2]);  
		// console.log("eq ids", eq.properties.ids);  
		// console.log("eq time", eq.properties.time);  
		// console.log("eq location", eq.properties.place);  

		// For each earthquake, create a marker, and bind a popup with the earthquake's ids, time, and location (place), then push to the eqMarkers array:
		eqMarkers.push(
			L.circle([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], {
			fillOpacity:1,
			color:eq.properties.mag,
			fillColor:eq.geometry.coordinates[2], // depth is the third coordinate in geometry
			radius:eq.properties.mag  // Not working
			}).bindPopup(`<h1>${eq.properties.ids}</h1><hr><h3>Time: ${eq.properties.time}</h3><hr><h3>Location: ${eq.properties.place}</h3>`)
			); 
		
		}

// Create a layer group that's made from the eqMarkers array, and pass it to the createMap function.
createMap(L.layerGroup(eqMarkers));
} 

// Perform an API call to the USGS API to get the earthquakes info for all eq in the past week, then call createMarkers when it completes.
d3.json(usgs_url).then(data => createMarkers(data));   

