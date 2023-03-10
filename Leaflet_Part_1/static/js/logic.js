// Leaflet challenge Part 1:
// By: Zack Crowley
// Create a map of all the earthquakes in the past week in the US:

// Set up the usgs url:
let usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// createMap takes the markers array made below and creates a basemap and overlay- overlay has the markers, gets passed the layer group with the e1 markers= aliased as "earthQuakes":
function createMap(earthQuakes) {

	/// Set streetmap as osm:
	let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 8,
		minZoom: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	// Save the USGS_USTopo as a var: 
	let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 8,
		minZoom: 2,
		attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
	});

	// Save the Dark tiles as a var:
	let dark_tile = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
		maxZoom: 8,
		minZoom: 2,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	});
  
	// Create a baseMaps object to hold the different map tiles on the main layer:
	let baseMaps = {
	"Street Map": streetmap,
    "Topographic Map": USGS_USTopo, 
	"Dark Map": dark_tile
	};

	// Create an overlayMaps object to hold the earthQuakes layer:
	let overlayMaps = {
		"Earthquakes": earthQuakes
	};
  
	// Create the map object with options.
	let myMap = L.map("map-id", { 
	  center: [39.8283, -98.5795], 
	  zoom: 4,
	  layers: [streetmap, earthQuakes] 
	});
	
	// Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map:
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	  }).addTo(myMap); 

	// Legend setup:
	// Create a legend, in the bottom right of the map and pass it to the map:
	let legend = L.control({position: 'bottomright'}); 
	// Function to add content to the legend:
	legend.onAdd = function (map) {
	// Create a div for the legend in the html using js: '<strong>Depth (km)</strong>'
	let div = L.DomUtil.create('div', 'info legend');
	labels = ['<strong>Depth (km)</strong>'];
	categories = ['-10','10','30','50','70','90'];
	// List of colors from getColors() in createMarkers() below:
	colors = ['limegreen', '#ffff33', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']

	// Loop through for each category in categories and set up the label and color in the legend for each break, this requires using the element, index and array to get all the info in the right order in the legend:
	categories.forEach((category, index, array) => { 
        div.innerHTML +=
		labels.push(
            '<i style="background:' + colors[index] + '"></i> ' +
            category + (array[index+1] ? '&ndash;' + array[index+1] : '+')); 
    	})
		div.innerHTML = labels.join('<br>');
    return div;
	};
	// Add the legend to the map:
	legend.addTo(myMap); 
}
  
// Create a function to make the eq markers, pass in API call response data:
function createMarkers(response) {
	// Pull the response.features property from response:
	let eqs = response.features;

	// A function to determine the marker size based on the magnitude of the eq:
	function markerSize(mag) {
		return mag*30000;
	}
	// A function to determine the marker color based on the depth of the eq:
	function getColor(d) {
		return d > 90 ? '#bd0026' :
			   d > 70  ? '#f03b20' :
			   d > 50  ? '#fd8d3c' :
			   d > 30  ? '#fecc5c' :
			   d > 10   ? '#ffff33' :
						  'limegreen'; 
	}

	// Function to format the time from UNIX ms to ISO:
	function format_time(t) {
		return new Date(t).toLocaleTimeString('en-US'); 
	  }
	// Function to Format date:
	function format_date(d) { 
		return new Date(d).toDateString('en-US');   
	  }

  
	// Initialize an array to hold the earthquake markers.
	let eqMarkers = [];
  
	// Loop through the eq array with a forEach:                
	eqs.forEach(eq => {

		// For each earthquake, create a marker, and bind a popup with the earthquake's ids, time, and location (place), then push to the eqMarkers array:
		eqMarkers.push(
			L.circle([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], {
			fillOpacity:1,
			color:"black", 
			weight:1,
			fillColor:getColor(eq.geometry.coordinates[2]), // depth is the third coordinate in geometry   
			radius:markerSize(eq.properties.mag)
			}).bindPopup(`<h3>Magnitude: ${eq.properties.mag}</h3><h3>Depth: ${eq.geometry.coordinates[2]} km</h3></h3><hr><h3>Date: ${format_date(eq.properties.time)}</h3><h3>Time: ${format_time(eq.properties.time)}</h3><hr><h3>Location: ${eq.properties.place}</h3>`)
			); 
		});
	
	// Set up the eqMarkers into a layer group and save as a var named "earthQuakes":
	let earthQuakes = L.layerGroup(eqMarkers)

// Create a layer group that's made from the eqMarkers array, and pass it to the createMap function (sends the layer setup to data to createMap() on line 10):
createMap(earthQuakes);
} 

// Perform an API call to the USGS API to get the earthquakes info for all eq in the past week, then call createMarkers() when it is finished (sends the data to createMarkers() on line 84):
d3.json(usgs_url).then(data => createMarkers(data));    

