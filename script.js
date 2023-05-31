window.onload = init;
function init() {
    var map = new L.map('map');
    map.setView([30.427755, -9.598107], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    

    const basemaps = {
        StreetView: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
        Topographic:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
          }),
        Satellite:L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWxheml6aWF5bWFuIiwiYSI6ImNsaTRzeGd6NDByZmQzZm85eXFiNXNwenMifQ.CeJMMqAT3YRjAXhz_t_1ww', {
            attribution: 'Map data &copy; Mapbox',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZWxheml6aWF5bWFuIiwiYSI6ImNsaTRzeGd6NDByZmQzZm85eXFiNXNwenMifQ.CeJMMqAT3YRjAXhz_t_1ww'
          }),
    };

    
    

    

   
    var Hopitals = L.tileLayer.wms('http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms', {
        layers: 'Hopitals',
        format: 'image/png',
        transparent: true
    }).addTo(map);

    var Pharmacies = L.tileLayer.wms('http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms', {
        layers: 'Pharmacies',
        format: 'image/png',
        transparent: true
    }).addTo(map);
    
    var Regions = L.tileLayer.wms('http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms', {
        layers: 'Regions',
        format: 'image/png',
        transparent: true
    }).addTo(map);

    
    
    const overlayMaps = {
        "Régions": Regions,
        "Pharmacies": Pharmacies,
        "Hôpitaux": Hopitals
        
        
        
        
    };
   
    var layerControl = L.control.layers(basemaps, overlayMaps).addTo(map)
   
    var overlayLayers = Object.values(overlayMaps); // Convert overlayMaps object to an array of layers
generateLegend(overlayLayers);

    

    
    
    
    
    L.control.fullscreen().addTo(map);
    L.control.scale().addTo(map);
    L.control.locate().addTo(map);
   

function generateLegend(layers) {
    var legendContainer = document.getElementById('legend');
    legendContainer.innerHTML = '';
  
    layers.forEach(function(layer) {
      var style;
      var layerName;
      
      // Determine the layer name and style based on the layer
      if (layer === Hopitals) {
        layerName = 'Hôpitaux';
        style = 'Projet_Santé:style_hopitals';
      } else if (layer === Pharmacies) {
        layerName = 'Pharmacies';
        style = 'Projet_Santé:style_pharmacies';
      }
      else if (layer === Regions) {
        layerName = 'Régions';
        style = 'Projet_Santé:style_regions';
      }
  
      var legendUrl =
        'http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms?' +
        'REQUEST=GetLegendGraphic' +
        '&VERSION=1.0.0' +
        '&FORMAT=image/png' +
        '&WIDTH=20' +
        '&HEIGHT=20' +
        '&LAYER=' + encodeURIComponent(layer.options.layers) +
        '&STYLE=' + encodeURIComponent(style);
  
      // Create a legend container element
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
  
      // Create an image element for the legend
      var legendImg = document.createElement('img');
      legendImg.src = legendUrl;
  
      // Create a span element for the layer name
      var legendName = document.createElement('span');
      legendName.textContent = layerName;
  
      // Append the legend image and layer name to the legend container
      legendItem.appendChild(legendImg);
      legendItem.appendChild(legendName);
  
      // Add the legend item to the legend container
      legendContainer.appendChild(legendItem);
    });
  }
  
}