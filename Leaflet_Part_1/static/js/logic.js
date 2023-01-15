// Leaflet challenge Part 1:
// By: Zack Crowley


function createMap(bikeStations) {

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
	let eqs = response.data.stations;
  
	// Initialize an array to hold the bike markers.
	let eqMarkers = [];
  
	// Loop through the stations array.
	for (let index = 0; index < eqs.length; index++) {
		let eq = eqs[index];
  
	  // For each station, create a marker, and bind a popup with the station's name.
	  let eqMarker = L.circleMarker([eq.lat, eq.lon])
		.bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
  
	  // Add the marker to the eqMarkers array.
	  eqMarkers.push(eqMarker);
	}
  
	// Create a layer group that's made from the bike markers array, and pass it to the createMap function.
	createMap(L.layerGroup(bikeMarkers));
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);
  
// USGS topo tile

let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

