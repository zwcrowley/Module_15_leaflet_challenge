// Leaflet challenge Part 1:
// By: Zack Crowley
// Create a map of all the earthquakes in the past week in the US:

// Run an API call from: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
let usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// createMap takes the markers array made below and creates a basemap and overlay- overlay has the markers, gets passed the layer group with the e1 markers= aliased as "earthQuakes":
function createMap(earthQuakes) {
	// Save the the topo as a var: NOT WORKING!!!!
	let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 20,
		attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
	});

	/// Set streetmap as osm:
	let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	let dark_tile = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	});

	/// Set topo as OpenTopoMap:
	let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	  });
	
  
	// Create a baseMaps object to hold the USGS_USTopo layer.
	let baseMaps = {
	"Street Map": streetmap,
    "Topographic Map": USGS_USTopo, 
	"Dark Map": dark_tile
	};

	// Create an overlayMaps object to hold the earthQuakes layer.
	let overlayMaps = {
		"Earthquakes": earthQuakes
	};
  
	// Create the map object with options.
	let myMap = L.map("map-id", { 
	  center: [39.8283, -98.5795], 
	  zoom: 4,
	  layers: [streetmap, earthQuakes] 
	});
	
	// Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	  }).addTo(myMap); 

	// Create a legend, in the bottom right of the map and pass it to the map:
	let legend = L.control({position: 'bottomright'}); 
	
	legend.onAdd = function (map) {
	// Create a div for the legend in the html using js: '<strong>Depth (km)</strong>'
	let div = L.DomUtil.create('div', 'info legend');
	labels = ['<strong>Depth (km)</strong>'];
	categories = ['0','10','30','50','70','90'];
	colors = ['limegreen', '#ffff33', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']

	// Define the getColor function again so that legend can use it to pull out the colors:
	function getColor(d) {
		return d > 90 ? '#bd0026' :
			   d > 70  ? '#f03b20' :
			   d > 50  ? '#fd8d3c' :
			   d > 30  ? '#fecc5c' :
			   d > 10   ? '#ffff33' :
						  'limegreen'; 
	}
	
	// Loop through for each category in categories and set up the label and color in the legend:
	for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+'); 
			console.log("cat",getColor(categories[i]))  
    	}

    return div;
	};
	// Add the legend to the map:
	legend.addTo(myMap);
}
  
// Create a function to make the eq markers, pass in API call response data:
function createMarkers(response) {
  
	// Pull the response.features property from response:
	let eqs = response.features;
	// console.log("All EQS", eqs);

	// A function to determine the marker size based on the magnitude of the eq:
	function markerSize(mag) {
		return mag*30000;
	}
	// A function to determine the marker color based on the depth of the eq: !!!! Adjust colors::::::::::::::::
	function getColor(d) {
		return d > 90 ? '#bd0026' :
			   d > 70  ? '#f03b20' :
			   d > 50  ? '#fd8d3c' :
			   d > 30  ? '#fecc5c' :
			   d > 10   ? '#ffff33' :
						  'limegreen'; 
	}

	// Function to format the time from UNIX ms to ISO:
	// set options for time/date conversion;
	// const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	function format_time(t) {
		return new Date(t).toLocaleTimeString('en-US'); 
	  }
	// Format date:
	function format_date(d) { 
		return new Date(d).toDateString('en-US');   
	  }

  
	// Initialize an array to hold the bike markers.
	let eqMarkers = [];
  
	// Loop through the eq array with a forEach:                
	eqs.forEach(eq => {
		// Pull out the index for the eq that is in the loop:
		// let eq = eqs[i];

		// For each earthquake, create a marker, and bind a popup with the earthquake's ids, time, and location (place), then push to the eqMarkers array:
		eqMarkers.push(
			L.circle([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], {
			fillOpacity:1,
			color:"gray", 
			fillColor:getColor(eq.geometry.coordinates[2]), // depth is the third coordinate in geometry   
			radius:markerSize(eq.properties.mag)
			}).bindPopup(`<h2>Magnitude: ${eq.properties.mag}</h2><h2>Depth: ${eq.geometry.coordinates[2]} km</h2></h2><hr><h2>Date: ${format_date(eq.properties.time)}</h2><h2>Time: ${format_time(eq.properties.time)}</h2><hr><h2>Location: ${eq.properties.place}</h2>`)
			); 
		
		});

// Create a layer group that's made from the eqMarkers array, and pass it to the createMap function.
createMap(L.layerGroup(eqMarkers));
} 

// Perform an API call to the USGS API to get the earthquakes info for all eq in the past week, then call createMarkers when it completes.
d3.json(usgs_url).then(data => createMarkers(data));   

// NEED TO MAKE A LEGEND