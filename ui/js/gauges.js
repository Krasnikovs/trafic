function radialWidgetValueInjecter(device, topic, id, key) {
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
			var value = widget_device_data[device][topic][0]["message"];
	}
	else {
		keys = key.split(".")
			message = widget_device_data[device][topic][0]["message"];
			fun(message, keys);
			value = fun_data;
	}
	var extra_data = widget_extra[id];
	var extra_offset = extra_data["offset"]
	var unit = extra_data["key"][key]["unit"]
	var min = extra_data["min"];
	var max = extra_data["max"]
	var extra_offset_data = extra_data["offset_data"];
	extra_offset_data.push(max);
	var highlights = [];
	var majorTicks = [];
	for(i in extra_offset_data) {
		if(extra_offset_data.length-1 > i) {
			highlights.push({from : Math.round(parseFloat(extra_offset_data[i]) * 100) / 100, to : Math.round(parseFloat(extra_offset_data[parseInt(i)+1])* 100) / 100, color : extra_offset[extra_offset_data[i]]["color"]})
		}
	}
	for(var i = parseInt(min); i<= parseInt(max);) {
		majorTicks.push(Math.round(i * 100) / 100);
		i = i + ((parseInt(max)-parseInt(min))/10);
	}
	gaugeObject[id] = null;
	gaugeObject[id] = new RadialGauge({
    renderTo: id,
    width: 263,
    height: 263,
    units: unit,
    title: false,
    value: value,
    minValue: min,
    maxValue: max,
    majorTicks: majorTicks,
    minorTicks: 2,
    strokeTicks: false,
    highlights: highlights,
    colorPlate: '#222',
    colorMajorTicks: '#f5f5f5',
    colorMinorTicks: '#ddd',
    colorTitle: '#fff',
    colorUnits: '#ccc',
    colorNumbers: '#eee',
    colorNeedle: 'rgba(240, 128, 128, 1)',
    colorNeedleEnd: 'rgba(255, 160, 122, .9)',
    valueBox: true,
    animationRule: 'linear',
    animationDuration: 500
});
    gaugeObject[id].draw();
    /*$("#" + id).css("width", "100%");*/
    /*$("#" + id).css("height", "100%");
    console.log("height :", $("#" + id).height());*/
    //console.log("height :", $("#" + id).parent().height(), parseFloat($("#" + id).parent().width()), parseFloat($("#" + id).height()) > parseFloat($("#" + id).width()));
    if(parseFloat($("#" + id).height()) == 0 || parseFloat($("#" + id).width()) == 0) {

    }
    else if(parseFloat($("#" + id).height()) > parseFloat($("#" + id).width())) {
    	$("#" + id).css("width", $("#" + id).width());
    	$("#" + id).css("height", $("#" + id).width());
    }
    else {
    	$("#" + id).css("width", $("#" + id).height());
    	$("#" + id).css("height", $("#" + id).height());
    }
    //$("#" + id).css("width", $("#" + id).height());
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}

function verticalWidgetValueInjecter(device, topic, id, key) {
	//console.log(key);
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
		var msg = widget_device_data[device][topic][0]["message"];
		//verticalScale(id, key, msg);
	}
	else {
		keys = key.split(".")
		message = widget_device_data[device][topic][0]["message"];
		fun(message, keys);
		message = fun_data;
		//verticalScale(id, key, message);
	}
	value = msg;
	var extra_data = widget_extra[id];
	var extra_offset = extra_data["offset"]
	var unit = extra_data["key"][key]["unit"]
	var min = extra_data["min"];
	var max = extra_data["max"]
	var extra_offset_data = extra_data["offset_data"];
	extra_offset_data.push(max);
	var highlights = [];
	var majorTicks = [];
	for(i in extra_offset_data) {
		if(extra_offset_data.length-1 > i) {
			highlights.push({from : parseFloat(extra_offset_data[i]), to : parseFloat(extra_offset_data[parseInt(i)+1]), color : extra_offset[extra_offset_data[i]]["color"]})
		}
	}
	var i = Number(min)
	var j = Number(max);
	while(i < j) {
		majorTicks.push(Math.round(i * 100) / 100);
		i += (Math.abs(parseFloat(max)-parseFloat(min))/10);
	}
	majorTicks.push(max)
	gaugeObject[id] = null;
	gaugeObject[id] = new LinearGauge({
    renderTo: id,
    width: 120,
    height: 278,
    units: unit,
    title: false,
    value: value,
    minValue: min,
    maxValue: max,
    majorTicks: majorTicks,
    minorTicks: 2,
    strokeTicks: false,
    highlights: highlights,
    valueBox: true,
    animationRule: 'linear',
    animationDuration: 500
});
    gaugeObject[id].draw();
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}

function horizontalWidgetValueInjecter(device, topic, id, key) {
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
			var value = widget_device_data[device][topic][0]["message"];
	}
	else {
		keys = key.split(".")
			message = widget_device_data[device][topic][0]["message"];
			fun(message, keys);
			value = fun_data;
	}
	var extra_data = widget_extra[id];
	var extra_offset = extra_data["offset"]
	var unit = extra_data["key"][key]["unit"]
	var min = extra_data["min"];
	var max = extra_data["max"]
	var extra_offset_data = extra_data["offset_data"];
	extra_offset_data.push(max);
	var highlights = [];
	var majorTicks = [];
	for(i in extra_offset_data) {
		if(extra_offset_data.length-1 > i) {
			highlights.push({from : parseFloat(extra_offset_data[i]), to : parseFloat(extra_offset_data[parseInt(i)+1]), color : extra_offset[extra_offset_data[i]]["color"]})
		}
	}
	var i = Number(min)
	var j = Number(max);
	//console.log(i,j)
	while(i < j) {
		majorTicks.push(Math.round(i * 100) / 100);
		i += (Math.abs(parseFloat(max)-parseFloat(min))/10);
		//console.log(i);
	}

	majorTicks.push(max);
	gaugeObject[id] = null;
	gaugeObject[id] = new LinearGauge({
		renderTo: id,
		width: 500,
		height: 150,
		units: unit,
		title: false,
		value: value,
		minValue: min,
		maxValue: max,
		majorTicks: majorTicks,
		minorTicks: 2,
		strokeTicks: false,
		highlights: highlights,
		valueBox: false,
		barBeginCircle: false,
		animationRule: 'linear',
		animationDuration: 500
	});
	gaugeObject[id].draw();

	/*var canvas = document.getElementById(id);

	canvas.width = "100%";*/
	/*canvas.height = height;*/
	$("#" + id).css("width", "100%");
	//$("#" + id).css("height", "100%");
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}