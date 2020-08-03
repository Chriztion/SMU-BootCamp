//Use the document.ready to run the page 
$(document).ready(function() {
    let fullURL = $('#timeFilter').val();
    makeMap(fullURL, -1);

    // Dropdown change
    $("#timeFilter, #magFilter").change(function() {
        let fullURL = $('#timeFilter').val();
        let minMag = $('#magFilter').val();
        let vizText = $("#timeFilter option:selected").text();
        $('#vizTitle').text(`Earthquakes in the ${vizText}`);
        makeMap(fullURL, minMag);
    });
});

function makeMap(fullURL, minMag) {
    // Empty out the values of the map
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:800px" id="map"></div>');

    // Tile layer(s) for the map
    // Street Map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    // Light Map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });
    // Dark Map
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    // Satellite Map
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    // FullURL is gotten from the dropdown
    d3.json(fullURL).then(function(response) {
        // Check the reponse in console log 
        // console.log(response);

        // Markers and Heatmap
        var markers = L.markerClusterGroup(); //this is already a master layer
        var heatArray = [];
        var circles = [];

        var quakeData = response.features;

        quakeData.forEach(function(earthquake) {
            if ((earthquake.geometry.coordinates[1]) && (earthquake.geometry.coordinates[0])) {
                if (earthquake.properties.mag >= minMag) { // Filter the magnitude
                    // CLuster Marker
                    let temp = L.marker([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]]).bindPopup(`<h4>${earthquake.properties.place}</h4><hr><h5>Mag: ${earthquake.properties.mag}</h5><hr><h5>Time: ${new Date(earthquake.properties.time)}</h5>`);
                    markers.addLayer(temp);

                    // Heat Map Points
                    heatArray.push([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]]);

                    // Circle Pointss
                    let circle = L.circle([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]], {
                        fillOpacity: 0.8,
                        color: "white",
                        fillColor: circleColor(earthquake.properties.mag),
                        radius: markerSize(earthquake.properties.mag)
                    }).bindPopup(`<h4>${earthquake.properties.place}</h4><hr><h5>Mag: ${earthquake.properties.mag}</h5><hr><h5>Time: ${new Date(earthquake.properties.time)}</h5>`);

                    circles.push(circle);
                }
            }
        });

        // Read the other dataset
        var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
        d3.json(tectonicPlatesURL).then(function(plates) {
            let plateLayer = L.geoJson(plates, {
                // Style for each plate
                style: function(feature) {
                    return {
                        color: "cyan",
                        weight: 1.5
                    };
                }
            });

            //Layer for Heatmap
            var heat = L.heatLayer(heatArray, {
                radius: 60,
                blur: 40
            });

            //Layer for circle
            var circleLayer = L.layerGroup(circles);

            // Basemaps object to hold light and dark maps
            var baseMaps = {
                "Street": streetmap,
                "Dark": darkmap,
                "Light": lightmap,
                "Satellite": satellitemap
            };

            // Create an overlayMaps object here to contain the "State Population" and "City Population" layers
            var overlayMaps = {
                "Heatmap": heat,
                "Markers": markers,
                "Circles": circleLayer,
                "Tectonic Plates": plateLayer
            };

            // myMap object
            var myMap = L.map("map", {
                center: [37.7749, -122.419],
                zoom: 4,
                layers: [streetmap, markers, plateLayer]
            });

            // Layer control for baseMaps, overlayMaps and add to myMap
            myMap.addLayer(markers);
            L.control.layers(baseMaps, overlayMaps).addTo(myMap);

            // reate Legend
            var legend = L.control({ position: 'bottomleft' });
            legend.onAdd = function() {
                var div = L.DomUtil.create("div", "info legend");

                //HTML for legend (has to be i tags) then add to myMap
                div.innerHTML += "<h4>Magnitudes</h4>";
                div.innerHTML += '<i style="background: #98ee00"></i><span>0-1</span><br>';
                div.innerHTML += '<i style="background: #d4ee00"></i><span>1-2</span><br>';
                div.innerHTML += '<i style="background: #eecc00"></i><span>2-3</span><br>';
                div.innerHTML += '<i style="background: #ee9c00"></i><span>3-4</span><br>';
                div.innerHTML += '<i style="background: #ea822c"></i><span>4-5</span><br>';
                div.innerHTML += '<i style="background: #ea2c2c"></i><span>5+</span>';

                return div
            }
            legend.addTo(myMap);
        });
    });
}

//Marker size and Circle color funcitons
function markerSize(mag) {
    let radius = 50000;
    if (mag > 0) {
        radius = mag * 50000;
    }
    return radius;
}

function circleColor(mag) {
    let color = "";
    if (mag >= 5) {
        color = "#ea2c2c";
    } else if (mag >= 4) {
        color = "#ea822c";
    } else if (mag >= 3) {
        color = "#ee9c00";
    } else if (mag >= 2) {
        color = "#eecc00";
    } else if (mag >= 1) {
        color = "#d4ee00";
    } else {
        color = "#98ee00";
    }

    return color;
}