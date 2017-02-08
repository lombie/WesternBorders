var map = L.map('map', {zoomControl:false, attributionControl: false } ).setView([39.240, 28.109], 7);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibG9tYmllIiwiYSI6IlAyVlJfU3MifQ.gMTKJU_NsIvulLTttw4-XA', {
			maxZoom: 12,
            attribution: 'Map: <a href="http://www.unhcr.org.tr">UNHCR Turkey</a> Data: ' +
				'<a href="http://www.sgk.tsk.tr/index_eng.asp">TCG</a>, ',
			id: 'lombie.nb901i12'
		}).addTo(map);
        
		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Rescue/Interceptions By TCG</h4>' +  (props ?
				'<b>' + props.name + '</b><br />' + 'Total: ' + props.total + '<br />' + 'Syrian: ' + props.Syria + '<br />' + 'Iraqi: ' + props.Iraq + '<br />' + 'Afghan: ' + props.Afghan + '<br />' + 'Iranian: ' + props.Iran + '<br />' + 'Other: ' + props.Other + '<br />'
				: 'Hover over a province');
		};

		info.addTo(map);
        
		function getColor(d) {
			return d > 12000 ? '#08306b' :
			       d > 10500  ? '#08519c' :
			       d > 9000  ? '#2171b5' :
			       d > 7500  ? '#4292c6' :
			       d > 6000   ? '#6baed6' :
			       d > 4500   ? '#9ecae1' :
			       d > 3000   ? '#c6dbef' :
                   d > 1500   ? '#deebf7' :    
			                  '#f7fbff';
		}
        
		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.2,
				fillColor: getColor(feature.properties.total)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);  
        
        //Marker Icons
        
        $.getJSON("Lib/bordercrossing.geojson",function(data){
            var borderIcon = L.icon({
                iconUrl: 'images/border.png',
                iconSize: [20,50],
                popupAnchor:  [0, -30],
                });
            L.geoJson(data,{
                pointToLayer: function(feature,latlng){
                    var marker = L.marker(latlng,{icon: borderIcon});
                    marker.bindPopup(feature.properties.title);
                    return marker;
                    }
                }).addTo(map);
            });
        
        $.getJSON("Lib/asam.geojson",function(data){
            var asamIcon = L.icon({
                iconUrl: 'images/asam.png',
                iconSize: [20,50],
                popupAnchor:  [0, -30],
                });
            L.geoJson(data,{
                pointToLayer: function(feature,latlng){
                    var marker = L.marker(latlng,{icon: asamIcon});
                    marker.bindPopup(feature.properties.title);
                    return marker;
                    }
                }).addTo(map);
            });
        
        $.getJSON("Lib/asammsc.geojson",function(data){
            var asammscIcon = L.icon({
                iconUrl: 'images/asamimc.png',
                iconSize: [20,50],
                popupAnchor:  [0, -30],
                });
            L.geoJson(data,{
                pointToLayer: function(feature,latlng){
                    var marker = L.marker(latlng,{icon: asammscIcon});
                    marker.bindPopup(feature.properties.title);
                    return marker;
                    }
                }).addTo(map);
            });
        
        $.getJSON("Lib/hrdf.geojson",function(data){
            var hrdfIcon = L.icon({
                iconUrl: 'images/hrdf.png',
                iconSize: [20,50],
                popupAnchor:  [0, -30],
                });
            L.geoJson(data,{
                pointToLayer: function(feature,latlng){
                    var marker = L.marker(latlng,{icon: hrdfIcon});
                    marker.bindPopup(feature.properties.title);
                    return marker;
                    }
                }).addTo(map);
            });
        
        var otherIcon = L.Icon.extend({
			options: {
				iconSize: [20,50],
                popupAnchor:  [0, -30],
			}
		});

        
        var trcIcon = new otherIcon({iconUrl: 'images/trc.png'}),
			multeciderIcon = new otherIcon({iconUrl: 'images/multecider.png'}),
            asamcfsIcon = new otherIcon({iconUrl: 'images/asamcfs.png'}),
            ibcIcon = new otherIcon({iconUrl: 'images/ibc.png'}),
			stlIcon = new otherIcon({iconUrl: 'images/stl.png'});

        
        L.marker([40.933023, 29.12356], {icon: trcIcon}).addTo(map).bindPopup("TRC Istanbul");
        L.marker([38.369876, 26.874830], {icon: multeciderIcon}).addTo(map).bindPopup("Multeci-Der Izmir");
        L.marker([41.034254, 28.97657], {icon: asamcfsIcon}).addTo(map).bindPopup("ASAM CFS Istanbul");
        L.marker([40.966321, 29.27290], {icon: ibcIcon}).addTo(map).bindPopup("IBC");
        L.marker([41.021531, 28.77361], {icon: stlIcon}).addTo(map).bindPopup("STL");


   
        //Legend

        var legend = L.control({position: 'bottomleft'}); 
        
		legend.onAdd = function (map) {
            
			var div = L.DomUtil.create('div', 'info legend'),
				labels = ["<img src='images/legend/border.png' height=20>Official Border Crossing Points", "<img src='images/legend/asam.png' height=20>ASAM Offices", "<img src='images/legend/asamcfs.png' height=20>ASAM CFS", "<img src='images/legend/asamimc.png' height=20>ASAM MSC", "<img src='images/legend/hrdf.png' height=20>HRDF (IKGV)", "<img src='images/legend/multecider.png' height=20>Multeci-Der", "<img src='images/legend/trc.png' height=20>TRC", "<img src='images/legend/stl.png' height=20>STL"],
				from, to;

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
        
                
        //various options
        
        L.control.scale({position: 'bottomright'}).addTo(map);
