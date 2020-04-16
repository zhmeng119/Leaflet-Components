function getFeatureInfo(evt, layer) {
	//if (!identifyEnabled) {return;}
	
	var url = getFeatureInfoUrl(evt.latlng,layer);	
	$.ajax({
		url: url, 
		//context: this,
		//headers: {'Access-Control-Allow-Origin': '*'},
		success: function (data, status, xhr) {
			var err = typeof data === 'string' ? null : data;
			showGetFeatureInfo(err, evt.latlng, data, layer);
		},
		error: function (xhr, status, error, layer) {
			showGetFeatureInfo(error);  
		}
	});
};


function getFeatureInfoUrl(latlng, layer) {
	var point = layer._map.latLngToContainerPoint(latlng, layer._map.getZoom()),
		size = layer._map.getSize(),

		params = {
			request: 'GetFeatureInfo',
			service: 'WMS',
			srs: 'EPSG:4326',
			styles: layer.wmsParams.styles,
			transparent: layer.wmsParams.transparent,
			version: layer.wmsParams.version,      
			format: layer.wmsParams.format,
			bbox: layer._map.getBounds().toBBoxString(),
			height: size.y,
			width: size.x,
			layers: layer.wmsParams.layers,
			query_layers: layer.wmsParams.layers,
			info_format: 'text/html'
		};
	
	// console.log("point: ", point)
	
	params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);//must be rounded  
	params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

	// console.log("url: ", currentLayer._url + L.Util.getParamString(params, currentLayer._url, true));
	return layer._url + L.Util.getParamString(params, layer._url, true);
};

function showGetFeatureInfo(err, latlng, content, layer) {
	if (err) { console.log(err); return; } // do nothing if there's an error
	
	var ind10 = content.indexOf("<td></td>");
	var ind11 = content.indexOf("<td>", ind10+9);
	var val = content.substring(ind11+4, ind11+6);
	// get value at click location
	var val0;
	var ind13 = val.indexOf(".");
	if (ind13 > -1) {
		var tmp = val.substring(0,1);
	    val0 = parseInt(tmp);
	} else {
		val0 = parseInt(val);
	}
	
	var infoContent;
	var ind0 = content.indexOf("landcover");
	if (ind0 > -1) {
		// handle land cover info. 1) covert value to class name 2) construct infoContent
		//infoContent = "<span>Land Cover</span><br/><span>Category:</span>" + landcoverCode[val0];
		infoContent = landcoverCode[val0];
	}

	var ind1 = content.indexOf("landchange");
	if (ind1 > -1) {
		// handle land change info
		//infoContent = "<span>Land Change</span><br/><span>Category:</span>" + landchangeCode[val0];
		infoContent = landchangeCode[val0];
		
	}
	var ind2 = content.indexOf("vulnerability");
	if (ind2 > -1) {
		// handle vulnerability info
		//infoContent = "<span>Vulnerability</span><br/><span>Possiblity:</span>" + val0;
		
	}
	var ind3 = content.indexOf("risk");
	if (ind3 > -1) {
		// handle risk info
		//infoContent = "<span>Future Risk</span><br/><span>Category:</span>" + landcoverCode[val0];
		
	}
	
	  infoPopup = mymap.openPopup(infoContent, latlng, { maxWidth: 800});
}
