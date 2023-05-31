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

    
    

    var Provinces = L.tileLayer.wms('http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms', {
        layers: 'Provinces',
        format: 'image/png',
        transparent: true
    });

   var Regions = L.tileLayer.wms('http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms', {
        layers: 'Regions',
        format: 'image/png',
        transparent: true
    });
    
   
    
    
    
    
    
    L.control.fullscreen().addTo(map);
    L.control.scale().addTo(map);
   
    var printer = L.easyPrint({
      tileLayer: Provinces,
      sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
      filename: 'myMap',
      exportOnly: true,
      hideControlContainer: true
}).addTo(map);
     
//Provinces
  var owsrootUrl_provinces = 'http://localhost:8080/geoserver/Projet_Sant%C3%A9/ows';

  var defaultParameters_provinces = {
      service : 'WFS',
      version : '1.0.0',
      request : 'GetFeature',
      typeName : 'Projet_Santé:Provinces',
      outputFormat : 'text/javascript',
      format_options : 'callback:getJson',
      SrsName : 'EPSG:4326'
  };
  
  var parameters_provinces = L.Util.extend(defaultParameters_provinces);
  
  //Régions 
  var owsrootUrl_regions = 'http://localhost:8080/geoserver/Projet_Sant%C3%A9/ows';

  var defaultParameters_regions = {
      service : 'WFS',
      version : '1.0.0',
      request : 'GetFeature',
      typeName : 'Projet_Santé:Regions',
      outputFormat : 'text/javascript',
      format_options : 'callback:getJson',
      SrsName : 'EPSG:4326'
  };
  
  var parameters_regions = L.Util.extend(defaultParameters_regions);




 



  var WFSLayer = null;
  var hoverStyle = {
    color: 'green', // Outline color on hover
    weight: 3 // Outline weight on hover
  };
  var featureProperties = [];
  var indicator_popup = document.getElementById('indicators').value;
  


 /*var ajax = $.ajax({
      url : selectedURL,
      dataType : 'jsonp',
      jsonpCallback : 'getJson',
      success : function (response) {
          
          WFSLayer = L.geoJson(response, {
            style: function(feature) {
                return {
                  color: 'blue', 
                  weight: 1,
                  fillOpacity: 0
                };
            },
            
              
              onEachFeature: function (feature, layer) {
                featureProperties.push(feature.properties);
                refreshAttributeTable();
                var popupContent = '<b>Name:</b> ' + feature.properties.nom + '<br>' +
                           '<b>'+ indicator_popup +': </b> ' + feature.properties[indicator_popup];
                  layer.bindPopup(popupContent);
                  layer.on({
                    mouseover: function() {
                        if (!layer.clicked) {
                            layer.setStyle(hoverStyle);
                          }
                    },
                    mouseout: function() {
                        if (!layer.clicked) {
                            layer.setStyle({
                                color: 'blue', 
                                weight: 1,
                                fillOpacity: 0
                            });
                          }
                      },
                      click: function() {
    
                        layer.clicked = !layer.clicked; // Toggle clicked state
            if (layer.clicked) {
              layer.setStyle(hoverStyle);
            } else {
              layer.setStyle({
                color: 'black', // Reset to default outline color
                weight: 1, 
                fillOpacity: 0 
              });
            }
          }
        
                     
                });
              }
          }).addTo(map);

          

         
          
      
          
      }
  });

  */
  function createLayerControl(overlayMaps) {
    // Create a new layer control
    var layerControl = L.control.layers(basemaps, overlayMaps).addTo(map);
  
    // Return the created layer control
    return layerControl;
  }


  function refreshAttributeTable() {
    var attributeTable = document.getElementById('tableBody');
    var selectedLevel = document.getElementById('levelSelect').value;
    var selectedIndicator = document.getElementById('indicators').value;
    var indicatorHeader = document.getElementById('indicatorHeader');
    indicatorHeader.textContent = selectedIndicator + ' (' + selectedLevel + ')';
  
    // Reset existingRows object
    var existingRows = {};
  
    // Clear existing attribute table
    attributeTable.innerHTML = '';
  
    if (featureProperties.length === 0) {
      return; // Exit the function if featureProperties is empty
    }
  
    // Sort featureProperties in descending order based on selectedIndicator
    featureProperties.sort(function(a, b) {
      return b[selectedIndicator] - a[selectedIndicator];
    });
  
    var labels = featureProperties.map(function(feature) {
      return feature.nom;
    });
  
    var data = featureProperties.map(function(feature) {
      return feature[selectedIndicator];
    });
  
    var statisticalValue = document.getElementById('statisticalValue').value;
  
    // Calculate the statistical value based on selectedIndicator
    var statisticalData;
    switch (statisticalValue) {
      case 'mean':
        statisticalData = calculateMean(data);
        break;
      case 'median':
        statisticalData = calculateMedian(data);
        break;
      case 'min':
        statisticalData = calculateMin(data);
        break;
      case 'max':
        statisticalData = calculateMax(data);
        break;
      default:
        statisticalData = [];
    }
  
    var ctx = document.getElementById('barGraph').getContext('2d');
    if (window.chart) {
      window.chart.destroy();
    }
    window.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: selectedIndicator,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: statisticalValue,
            data: statisticalData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    for (var i = 0; i < featureProperties.length; i++) {
      var feature = featureProperties[i];
      var featureName = feature.nom;
  
      var featureRow = document.createElement('tr');
      featureRow.addEventListener('click', zoomToFeature.bind(null, featureName));
  
      var nomCell = document.createElement('td');
      nomCell.textContent = featureName;
      featureRow.appendChild(nomCell);
  
      var indicatorCell = document.createElement('td');
      indicatorCell.classList.add('indicator-cell');
      indicatorCell.textContent = feature[selectedIndicator];
      featureRow.appendChild(indicatorCell);
  
      attributeTable.appendChild(featureRow);
  
      // Store the row in existingRows object for future reference
      existingRows[featureName] = featureRow;
    }
  }
  
  // Helper function to calculate the mean value
  function calculateMean(data) {
    var sum = data.reduce(function(a, b) {
      return a + b;
    }, 0);
    var mean = sum / data.length;
    return Array(data.length).fill(mean);
  }
  
  // Helper function to calculate the median value
  function calculateMedian(data) {
    var sortedData = data.slice().sort(function(a, b) {
      return a - b;
    });
    var mid = Math.floor(sortedData.length / 2);
    var median =
      sortedData.length % 2 === 0
        ? (sortedData[mid - 1] + sortedData[mid]) / 2
        : sortedData[mid];
    return Array(data.length).fill(median);
  }
  
  // Helper function to calculate the minimum value
  function calculateMin(data) {
    var min = Math.min(...data);
    return Array(data.length).fill(min);
  }
  
  // Helper function to calculate the maximum value
  function calculateMax(data) {
    var max = Math.max(...data);
    return Array(data.length).fill(max);
  }
  
  
  
  
  
  

  
  
  
  function zoomToFeature(name) {
    // Find the feature in the GeoJSON layer that matches the clicked name
    var targetFeature = WFSLayer.getLayers().find(function(layer) {
      return layer.feature.properties.nom === name;
    });
  
    if (targetFeature) {
      // Get the feature's geometry
      var featureGeometry = targetFeature.getBounds();
  
      // Zoom the map to the feature's geometry
      map.fitBounds(featureGeometry);
  
      // Reset the styles of all layers in the GeoJSON layer
      WFSLayer.eachLayer(function(layer) {
        layer.setStyle({
          color: 'blue',
          weight: 1,
          fillOpacity: 0
        });
      });
  
      // Set the style of the clicked layer to green with fill
      targetFeature.setStyle({
        color: 'green',
        weight: 1,
        fillOpacity: 0.5,
        fillColor: 'green'
      });
    }
  }
  

  var layerControl = L.control.layers(basemaps).addTo(map);

  var wmsLayerGroup = L.layerGroup().addTo(map); // Create a layer group for WMS layers

  function updateLayer() {
      var selectedLevel = document.getElementById('levelSelect').value;
      var selectedIndicator = document.getElementById('indicators').value;
      var selectedURL;
      var selectedLayer;
    
      // Define the URLs for regions and provinces
      var URL_regions = owsrootUrl_regions + L.Util.getParamString(parameters_regions);
      var URL_provinces = owsrootUrl_provinces + L.Util.getParamString(parameters_provinces);
    
      // Set the selectedURL and selectedLayer based on the selected level
      if (selectedLevel === 'regions') {
        selectedURL = URL_regions;
        selectedLayer = Regions;
      } else if (selectedLevel === 'provinces') {
        selectedURL = URL_provinces;
        selectedLayer = Provinces;
      }
    
      var style = 'Projet_Santé:' + selectedLevel + '_' + selectedIndicator;
      selectedLayer.setParams({ styles: style });
    
      // Remove the existing WFS layer if it already exists
      if (WFSLayer) {
        map.removeLayer(WFSLayer);
      }
    
      // Remove the existing WMS layer group
      map.removeLayer(wmsLayerGroup);
      wmsLayerGroup.clearLayers();
    
      // Fetch the GeoJSON data from the selected URL
      var ajax = $.ajax({
        url: selectedURL,
        dataType: 'jsonp',
        jsonpCallback: 'getJson',
        success: function(response) {
          featureProperties = []; // Clear the featureProperties array

          WFSLayer = L.geoJson(response, {
            style: function(feature) {
              return {
                color: 'blue',
                weight: 1,
                fillOpacity: 0
              };
            },
            onEachFeature: function(feature, layer) {
              featureProperties.push(feature.properties);
              var popupContent =  feature.properties.nom  
                
              layer.bindPopup(popupContent);
              layer.on({
                mouseover: function() {
                  if (!layer.clicked) {
                    layer.setStyle(hoverStyle);
                  }
                },
                mouseout: function() {
                  if (!layer.clicked) {
                    layer.setStyle({
                      color: 'blue',
                      weight: 1,
                      fillOpacity: 0
                    });
                  }
                },
                click: function() {
                  layer.clicked = !layer.clicked; // Toggle clicked state
                  if (layer.clicked) {
                    layer.setStyle(hoverStyle);
                  } else {
                    layer.setStyle({
                      color: 'black', // Reset to default outline color
                      weight: 1,
                      fillOpacity: 0
                    });
                  }
                }
              });
            }
          });
      
          // Add the WFS layer to the map
          WFSLayer.addTo(map);
      
          // Add the selectedLayer to the WMS layer group
          selectedLayer.addTo(wmsLayerGroup);
      
          // Add the WMS layer group to the map
          wmsLayerGroup.addTo(map);
      
          // Update the layer control
          layerControl.remove();
          layerControl = L.control.layers(basemaps, { [selectedLevel]: wmsLayerGroup }).addTo(map);
      
          generateLegend(selectedLayer, selectedIndicator);
      
          refreshAttributeTable(); // Call refreshAttributeTable after featureProperties is updated
        }
      });
      
  }
  
  
  

  var levelSelect = document.getElementById('levelSelect');
  levelSelect.addEventListener('change', refreshAttributeTable);  
  levelSelect.addEventListener('change', updateLayer);  
     var indicatorSelect = document.getElementById('indicators');
     indicatorSelect.addEventListener('change',refreshAttributeTable);
indicatorSelect.addEventListener('change', updateLayer);
var StatisticalValueselect = document.getElementById('statisticalValue');
StatisticalValueselect.addEventListener('change', refreshAttributeTable);  





function generateLegend(layer, selectedIndicator) {
  var style ;
  // Construct the legend URL based on the layer and selected indicator
  if(layer === Regions){
    style = 'Projet_Santé:regions'  + '_' + selectedIndicator;

  }
  else if(layer === Provinces){
    style = 'Projet_Santé:provinces'+ '_' + selectedIndicator;

  }
  var legendUrl = 'http://localhost:8080/geoserver/Projet_Sant%C3%A9/wms?' +
    'REQUEST=GetLegendGraphic' +
    '&VERSION=1.0.0' +
    '&FORMAT=image/png' +
    '&WIDTH=20' +
    '&HEIGHT=20' +
    '&LAYER=' + encodeURIComponent(layer.options.layers) +
    '&STYLE=' + encodeURIComponent(style);
  // Create an image element for the legend
  var legendImg = document.createElement('img');
  legendImg.src = legendUrl;
  
  // Add the legend image to the legend container
  var legendContainer = document.getElementById('legend');
  legendContainer.innerHTML = '';
  legendContainer.appendChild(legendImg);
}

function convertToCSV(data) {
  var csv = '';
  // Add header row
  var header = Object.keys(data[0]);
  csv += header.join(',') + '\n';

  // Add data rows
  data.forEach(function (row) {
    var rowData = Object.values(row);
    csv += rowData.join(',') + '\n';
  });

  return csv;
}

function downloadAttributeTable() {
  var attributeTable = document.getElementById('attributeTable');
  var rows = attributeTable.querySelectorAll('tr');

  // Convert table rows to an array of objects representing each row's data
  var data = [];
  var headerRow = attributeTable.querySelector('thead tr');
  var headerCells = headerRow.querySelectorAll('th');
  var headerData = Array.from(headerCells).map(function(headerCell) {
    return headerCell.textContent.trim();
  });

  // Process the table rows
  rows.forEach(function(row) {
    var rowData = {};
    var cells = row.querySelectorAll('td');
    if (cells.length === headerData.length) { // Skip rows with different number of cells
      cells.forEach(function(cell, index) {
        var columnName = headerData[index];
        var cellValue = cell.textContent.trim();
        rowData[columnName] = cellValue;
      });
      data.push(rowData);
    }
  });

  // Convert data to CSV format
  var csv = convertToCSV(data);
  var selectedIndicator = document.getElementById('indicators').value;
  var selectedLevel = document.getElementById('levelSelect').value;



  // Create a download link for the CSV file
  var link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  link.target = '_blank';
  link.download = 'attribute_table_'+selectedLevel+'_'+selectedIndicator+'.csv';

  // Trigger the download
  link.click();
}





  

  





var downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', downloadAttributeTable);















updateLayer();

  
  

  
  

    

    
    
    

 
  
      

      




}

  
    
