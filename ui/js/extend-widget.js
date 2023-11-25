var offset_clone = $(".offset").html();
var widget_device_data = [];
var key_clone = $(".widget-keys").html();
var gaugeObject = {};
var widget_list = {};
var donut_widget_data = {};

var fun_data = null;

function createDashboard() {
	var data = {};
	//console.log($("#dashboard-form").html());
	$.each($("#dashboard-form").serializeArray(), function() {
		data[this.name] = this.value;
	})

	data = JSON.stringify(data);
	$.ajax({
		url: "/bwiot/extend-ui/create-dashboard/",
		type: "POST",
		"data": data,
		success: function (result) {// console.log(result);
			if(result["status"] == "Success") {
				$(".modal").modal("hide");
				dashboardCreater(result.id, result.name, result.description, result.time)
			}
			else
			{
				alert(result['reason'])
			}
		}
	});
}

getDashboards();

function getDashboards() {
	//$("#second-navbar").css("display","none")
	/*var data = {};
	//console.log($("#dashboard-form").html());
	$.each($("#dashboard-form").serializeArray(), function() {
		data[this.name] = this.value;
	})*/
	$.ajax({
		url: "/bwiot/extend-ui/get-dashboard/",
		type: "GET",
		success: function (result) {
			if(result["status"] == "Success") {
				var result = result.dashboards;
				for(i in result) {
					dashboardCreater(result[i].id, result[i].name, result[i].description, result[i].time)
				}
			}
		}
	});
}

function deleteDashboard() {

	conf = confirm("Do you want to delete?");
	if(conf) {
		var dashboard_id = (window.location.hash).split("/")[1]
		$.ajax({
			url: "/bwiot/extend-ui/delete-dashboard/",
			type: "DELETE",
			data : {"id" : dashboard_id},
			success: function (result) {
				if(result["status"] == "Success") {
					getDashboards();
					window.location = "/";
				}
			}
		});
	}
}


function dashboardCreater(id, name, desc, time) {
	var html = '<li class="nav-item"><a class="nav-link" href="javascript: getWidgets('+id+')">';
	html += name + "</a></li>";
	$(html).insertAfter("#mqtt-navbar");
}

function loadDevices() {
	$.ajax({
		url: "/bwiot/api/v1/widget/device/",
		type: "GET",
		async : false,
		success: function (result) {
			if(result["status"] == "Success") {
				var html = "";
				for (var i = result.data.length - 1; i >= 0; i--) {
					html += "<option>" + result.data[i] + "</option>";
				}
				$("#device-selector").html(html);
			}
		}
	});
}

function loadTopics() {
	var data = {};
	data["device"] = $("[list='device-selector']").val();
	$.ajax({
		url: "/bwiot/api/v1/widget/topic/",
		type: "GET",
		data : data,
		async : false,
		success: function (result) {
			if(result["status"] == "Success") {
				var html = "";
				for (var i = result.data.length - 1; i >= 0; i--) {
					html += "<option>" + result.data[i] + "</option>";
				}
				$("#topic-selector").html(html);
			}
		}
	});
}

function loadKey() {
	var data = {};
	data["device"] = $("[list='device-selector']").val();
	data["topic"] = $("[list='topic-selector']").val();
	$.ajax({
		url: "/bwiot/api/v1/widget/key/",
		type: "GET",
		data : data,
		async : false,
		success: function (result) {
			if(result["status"] == "Success") {
				var html = "";
				for (var i = result.data.length - 1; i >= 0; i--) {
					html += "<option>" + result.data[i] + "</option>";
				}
				$("#widget-key-selector").html(html)
			}
		}
	});
}

function getWidgets(id) {
	$("#full_widget_icon").text(id);
	$(".page").hide();
	$(".page-widget").show();
	$("#widget-creater").parent().html($("#widget-creater").clone());
	window.location.hash = "#page-widget/" + id;
	var data = {};
	data["id"] = id;
	$.ajax({
		url: "/bwiot/extend-ui/widget/",
		type: "GET",
		data : JSON.stringify(data),
		async : false,
		success: function (result) {
			// console.log(result,"dsafdsafdsafsa")
			if(result["status"] == "Success") {
				widget_id = result["widget_id"];
				widget_list = result.widgets;
				widget_extra = result["widget_extra"];
				widget_position = result["widget_position"];
				widget_device_data = result.data;
				for (var i = result.init.length - 1; i >= 0; i--) {
					try {
						createwidgetvisual(result.init[i]["id"], result.init[i]["name"], result.init[i]["device"], result.init[i]["topic"], result.init[i]["key"], result.init[i]["type"], result.init[i]["widget_id"]);
					}
					catch(e) {}
				}
				//createwidgetvisual()
				//widget_id, title, device, topic, key, type
				//console.log(result);
				//renderWidgets(result["data"]);
				//	console.log(result);
				/*var result = result.dashboards;
				for(i in result) {
					widgetCreater(result[i].id, result[i].name, result[i].description, result[i].time)
				}*/
			}
			else
			{
				alert(result["reason"])
			}
		}
	});
}
function getWidgetsfull(id) {
	//window.location = "/dashboard/" + id;
	/*$("#full_widget_icon").text(id);
	$(".page").hide();
	$(".page-widget").show();
	$("#widget-creater").parent().html($("#widget-creater").clone());
	window.location.hash = "#page-widget/" + id;*/
	
	var data = {};
	data["id"] = id;
	$.ajax({
		url: "/bwiot/extend-ui/widget/",
		type: "GET",
		data : JSON.stringify(data),
		async : false,
		success: function (result) {
			// console.log(result,"dsafdsafdsafsa")
			if(result["status"] == "Success") {
				widget_id = result["widget_id"];
				widget_list = result.widgets;
				widget_extra = result["widget_extra"];
				widget_position = result["widget_position"];
				widget_device_data = result.data;
				for (var i = result.init.length - 1; i >= 0; i--) {
					try {
						createwidgetvisualfull(result.init[i]["id"], result.init[i]["name"], result.init[i]["device"], result.init[i]["topic"], result.init[i]["key"], result.init[i]["type"], result.init[i]["widget_id"]);
					}
					catch(e) {
						console.log(e)
					}
				}
				//createwidgetvisual()
				//widget_id, title, device, topic, key, type
				//console.log(result);
				//renderWidgets(result["data"]);
				//	console.log(result);
				/*var result = result.dashboards;
				for(i in result) {
					widgetCreater(result[i].id, result[i].name, result[i].description, result[i].time)
				}*/
			}
			else
			{
				alert(result["reason"])
			}
		}
	});
}



/*function createWidget() {
	var data = {};
	var datum = {};
	$("#widget-form").serializeArray().map(function(item) {
		if ( data[item.name] ) {
			if ( typeof(data[item.name]) === "string" ) {
				data[item.name] = [data[item.name]];
			}
			data[item.name].push(item.value);
			}
		else {
			data[item.name] = item.value;
		}
		if(item.name == "minval") {
			data["offset"] = [];
			data["offset"].push(item.value);
		}
	});
	
	datum[data["key"]] = {};
	datum[data["key"]]["offset"] = {};
	for(i in data["offset"]) {
		datum[data["key"]]["offset"][data["offset"][i]] = {};
		datum[data["key"]]["offset"][data["offset"][i]]["offset_color"] = data["offset_color"][i];
		datum[data["key"]]["offset"][data["offset"][i]]["sub_title"] = {};
		datum[data["key"]]["offset"][data["offset"][i]]["sub_title"] = data["sub_title"][i];
	}
	data["data"] = {};
	data["data"]["key"] = datum;
	data["data"]["offset"] = data["offset"];
	data["data"]["min"] = data["minval"];
	data["data"]["max"] = data["maxval"];
	data["data"]["subscribe"] = {"inact" : {"message" : data["inact_msg"], "color" : data["inact_msg_color"]}, "act" : {"msg" : data["act_msg"], "color" : data["act_msg_color"]}}
	data["data"]["subscribe"]["topic"] = data["sub_topic"];
	data["data"] = JSON.stringify(data["data"]);
	console.log(data, "DATA");
	//datum[data["key"]["offset"]] = 
	//data["dashboard_id"] = id;
	$.ajax({
		url: "bwiot/api/v1/widget/",
		type: "POST",
		data : data,
		success: function (result) {
			if(result["status"] == "Success") {
				
			}
		}
	});
}*/

function createWidget() {
	var data = {};
	//var config = {};
	jQuery("#widget-form").serializeArray().map(function(item) {
		if ( data[item.name] ) {
			if ( typeof(data[item.name]) === "string" ) {
				data[item.name] = [data[item.name]];
			}
			data[item.name].push(item.value);
			}
		else {
			data[item.name] = item.value;
		}
		if(item.name == "minval") {
			data["offset"] = [];
			data["offset"].push(item.value);
		}
	});
	/*var d_o = [];
	for(i in data["offset"]) {
		d_o.push(parseFloat(data["offset"][i]));
	}
	data["offset"] = d_o.sort();*/
	/*$.each($("#create-widget-form").serializeArray(), function() {
		data[this.name] = this.value;
	});*/

	var keys = "";
	data["data_key"] = {};
	if((typeof(data["key"]) == "object" || Array.isArray(data["key"])) && data["key"].length > 1) {
		for(i in data["key"]) {
			keys = keys + data["key"][i] + ",";
			data["data_key"][data["key"][i]] = {"sub_title" : data["sub_title"][i], "unit" : data["unit"][i], "color" : data["offset_color"][i]}

		}
		keys = keys.substring(0, keys.length-1)
	}
	else {
		keys = data["key"];
		data["data_key"][data["key"]] = {"sub_title" : data["sub_title"], "unit" : data["unit"], "color" : data["offset_color"][0]}
	}
	var d_o = []
	data["widget_offset"] = {}
	for(off in data["offset"]) {
		if(data["offset"][off]) {
			d_o.push(parseFloat(data["offset"][off]));
			data["widget_offset"][data["offset"][off]] = {"sub_title" : data["sub_title"][off], "color" : data["offset_color"][off]}
		}
	}
	data["offset"] = d_o.sort();
	data["offset"].sort();
	datum = {}
	dashboard_id = ((window.location.hash).split("/"))[1]
	datum["id"] = dashboard_id;
	datum["name"] = data["name"];
	datum["device"] = data["device"];
	datum["topic"] = data["topic"];
	datum["data"] = {};
	datum["key"] = keys
	datum["data"] = JSON.stringify({"keys" : keys, "key" : data["data_key"], "max" : data["maxval"], "min" : data["minval"], "offset" : data["offset"], "sub_topic" : data["sub_topic"], "act_msg" : data["act_msg"], "inact_msg" : data["inact_msg"], "yaxis_val" : data["yaxis_val"], "offset" : data["widget_offset"], "offset_data" : data["offset"], "act_color" : data["act_msg_color"], "inact_color" : data["inact_msg_color"]});
	datum["type"] = data["type"];
	$.ajax({
		url : "/bwiot/extend-ui/create-widget/",
		method : "POST",
		data : JSON.stringify(datum),
		success : function(data) {
			if(data["status"] == "Success") {
				$(".modal").modal("hide");
				var dashboard_id = (window.location.hash).split("/")[1]
				getWidgets(dashboard_id)
				document.getElementById("widget-form").reset();
			}
		}
	});
	
}


function initWidgetModal(th) {
	loadDevices();
	loadTopics();
	loadKey();
	$(".offset").html(offset_clone);
	$(".widget-keys").html(key_clone);
	$(".case").hide();
	switch($(th).val()) {
		case "text" :
			$(".case-1").show();
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "color" :
			$(".case-1").show();
			$("[name='sub_title']").removeAttr("disabled");
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "line_chart" :
			$(".case-3").show();
			break;
		case "bar_chart" :
			$(".case-3").show();
			break;
		case "gauge" :
			$(".case-1").show();
			$("[name='key']").removeAttr("onkeydown");
			break;
		/*case "line_graph" :
			$(".case-3").show();
			break;*/
		case "vertical_gauge" :
			$(".case-1").show();
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "horizontal_gauge" :
			$(".case-1").show();
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "donut" :
			$(".case-3").show();
			$(".max-min").show();
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "led" :
			$(".case-2").show();
			$(".case-3").show();
			$(".sub-topic").hide();
			$("[name='sub_title']").attr("disabled", "true");
			$("[name='unit']").attr("disabled", "true");
			$("[name='key']").removeAttr("onkeydown");
			break;
		case "switch" :
			$(".case-2").show();
			$(".case-3").show();
			$("[name='sub_title']").attr("disabled", "true");
			$("[name='unit']").attr("disabled", "true");
			$("[name='key']").removeAttr("onkeydown");
			break;
	}
}

function addKey(th) {
	$(th).parent().parent().parent().append($(th).parent().parent().clone());
	$(th).removeAttr("onkeydown");
}


/*function renderWidgets(data) {
	for(i in widget_id) {
		for(j in widget_id[i]) {
			for(k in widget_id[i][j]) {
				switch(i) {
					case "text" :
						for(l in widget_id[i][j][k]) {
							//console.log(data[j][k]);
							var html = '<div class="col-lg-2 col-12">\
										<div class="small-box">\
										<div class="inner text-center"><h5>'
							html +=		widget_position[widget_id[i][j][k][l]]["name"] + '</h5><p id="'+widget_id[i][j][k][l]+'">'
							html +=		data[j][k]["message"] + '</p>\
										</div>\
										<a class="small-box-footer"><i class="fa fa-clock-o">'+ new Date(data[j][k]["time"]).toString().slice(0, 25) +'</i></a>\
										</div>\
										</div>'
										$(html).insertBefore("#widget-creater");
						}
						break;
					case "color" :
						for(l in widget_id[i][j][k]) {
							current_widget_id = widget_id[i][j][k][l];
							//console.log(data[j][k], [key]["offset"][offsets[off]]["offset_color"]);
							var current_widget_offset = widget_extra[widget_id[i][j][k][l]]["key"]["offset"];
							var offsets = widget_extra[widget_id[i][j][k][l]]["offset"];
							for(m in widget_extra[current_widget_id]["key"]) {
								for(off in offsets) {
									if(parseFloat(data[j][k]["message"]) > parseFloat(offsets[off])) {
										var widget_text = widget_extra[current_widget_id]["key"][m]["offset"][offsets[off]]["sub_title"];
									}
								}
							}
							var html = '<div class="col-lg-2 col-12">\
										<div class="small-box">\
										<div class="inner text-center"><h5>'
							html +=		widget_position[widget_id[i][j][k][l]]["name"] + '</h5><p id="'+current_widget_id+'">'
							html +=	 	widget_text + '</p>\
										</div>\
										<a class="small-box-footer"><i class="fa fa-clock-o">'+ new Date(data[j][k]["time"]).toString().slice(0, 25) +'</i></a>\
										</div>\
										</div>'
										$(html).insertBefore("#widget-creater");
						}
						break;
					case "donut" :
						for(l in widget_id[i][j][k]) {
							//console.log(data[j][k]);
							var html = '<div class="col-lg-2 col-12">\
										<div class="card">\
										<div class="text-center"><h5>'
							html +=		widget_position[widget_id[i][j][k][l]]["name"] + '</h5></div><div class="card-body text-center"><input type="text" data-step="0.01" id="'+widget_id[i][j][k][l]+'" class="knob" data-thickness="0.2" data-angleArc="250" data-angleOffset="-125" value="0" data-width="100" data-height="100" data-fgColor="#00c0ef">'
							html +=		'</div>\
										<div class="card-footer"><i class="fa fa-clock-o">'+ new Date(data[j][k]["time"]).toString().slice(0, 25) +'</i></div>\
										</div>\
										</div>'
										$(html).insertBefore("#widget-creater");
										donutWidgetValueInjecter(j, k, widget_id[i][j][k][l], data)
						}
						break;
					case "gauge" :
						for(l in widget_id[i][j][k]) {
							console.log(data[j][k]);
							var html = '<div class="col-lg-2 col-12">\
										<div class="card">\
										<div class="text-center"><h5>'
							html +=		widget_position[widget_id[i][j][k][l]]["name"] + '</h5></div><div class="card-body text-center"><canvas id="'+widget_id[i][j][k][l]+'" ></canvas>'
							html +=		'</div>\
										<div class="card-footer"><i class="fa fa-clock-o">'+ new Date(data[j][k]["time"]).toString().slice(0, 25) +'</i></div>\
										</div>\
										</div>'
										$(html).insertBefore("#widget-creater");
										gaugeWidgetValueInjecter(data[j][k]["message"], widget_id[i][j][k][l], "number", widget_position[widget_id[i][j][k][l]]["name"])
						}
						break;
					case "vertical_gauge" :
						for(l in widget_id[i][j][k]) {
							console.log(data[j][k]);
							var html = '<div class="col-lg-2 col-12">\
										<div class="card">\
										<div class="text-center"><h5>'
							html +=		widget_position[widget_id[i][j][k][l]]["name"] + '</h5></div><div class="card-body text-center"><canvas id="'+widget_id[i][j][k][l]+'" ></canvas>'
							html +=		'</div>\
										<div class="card-footer"><i class="fa fa-clock-o">'+ new Date(data[j][k]["time"]).toString().slice(0, 25) +'</i></div>\
										</div>\
										</div>'
										$(html).insertBefore("#widget-creater");
										verticalScale(widget_id[i][j][k][l], "message-integer", widget_position[widget_id[i][j][k][l]]["name"])
						}
						break;
				}
			}
		}
	}
}*/



function createwidgetvisual(widget_id, title, device, topic, key, type, id) {
		var html = 	"<section class='col-sm-12 col-md-3 widget mt-2'>"
		html +=	"<div class='card card-1 widget_card' style='height:400px;'>"
		html += "<div class='card-header widget_card widget_header card-outline card-dark'><span class='text-center text-primary' style='font-size: 20px;'>"+ title +"</span><div class='ml-2 pull-right'><span class='fa fa-download' device='"+device+"' topic='"+topic+"' key='"+key+"' onclick='DownloadData(this, "+widget_id+")' style='cursor: pointer;'></span></div></div>"
		html += "<div class='card-body' onload=''>"
		switch(type) {
			case "text" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "color" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "gauge" :
				html += "<div class='mt-4 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "vertical_gauge" :
				html += "<div class='mt-2 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "horizontal_gauge" :
				html += "<div class='mt-5 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "donut" :
				html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
				break;
			case "line_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "bar_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "led" :
				html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div></div>"
				break;
			case "switch" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
				break;
		}
		/*if(type == "text" || type == "colour") {
			html += "<div class='row'><div class='col-lg-12 mt-5'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div>\</div>"
		}
		else if(type == "donut"){
		    html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
		}
		else if(type == "gauge_chart"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div>"
		}
		else if(type == "vertical_gauge"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='vertical_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "horizontal_gauge"){
		    html += "<div class='row'><div class='col-lg-12'><canvas class='horizontal_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "led_light"){
			html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div>"
		}
		else if(type == "onoff_switch"){
			html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
		}
		else if(type == "bar_chart"){
			html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div>"
		}
		else if(type == "table") {

		}
		else {
			html += "<div class='row'><div class='col-lg-12'><div class='line_chart wid' id="+id+"></div></div>"
		}*/
		html += "</div><div class='card-footer'><i class='fa fa-clock-o'></i><div class='ml-2 pull-right'><span class='fa fa-times text-danger' onclick='deleteWidget(this, "+widget_id+")' style='cursor: pointer;'></span></div><div class='pull-right'><span class='fa fa-pencil-square-o' onclick='editWidget(this, "+widget_id+")' style='cursor: pointer;'></span></div></div></div></section>"
		$(html).insertBefore("#widget-creater");

		switch(type) {
			case "text" :
				widgetValueInjecter(device, topic, id, key);
				break;
			case "color" :
				colourWidgetInjector(title, device, topic, id, key);
				break;
			case "gauge" :
				radialWidgetValueInjecter(device, topic, id, key);
				break;
			case "vertical_gauge" :
				verticalWidgetValueInjecter(device, topic, id, key);
				break;
			case "horizontal_gauge" :
				horizontalWidgetValueInjecter(device, topic, id, key);
				break;
			case "donut" :
				donutWidgetValueInjecter(device, topic, id, key);
				break;
			case "line_chart" :
				lineChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "bar_chart" :
				barChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "led" :
				ledWidgetValueInjecter(device, topic, id, key);
				break;
			case "switch" :
				onoffWidgetValueInjecter(device, topic, id, key);
				break;
		}
		/*if(type == "text") {
			widgetValueInjecter(device, topic, id, key);
		}
		else if(type == "colour") {
			colourWidgetInjector(title, device, topic, id, key);
		}
		else if(type == "line_chart") {
			lineChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if(type == "bar_chart") {
			barChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if (type == "gauge_chart") {
			gaugeWidgetValueInjecter(device, topic, id, key, title);
		}
		else if (type == "donut") {
			donutWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "vertical_gauge") {
			verticalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "horizontal_gauge") {
			horizontalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "led_light") {
			ledWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "onoff_switch") {
			onoffWidgetValueInjecter(device, topic, id, key);
		}*/
}
function createwidgetvisualfull(widget_id, title, device, topic, key, type, id) {
		var html = 	"<section class='col-sm-12 col-md-3 widget mt-2'>"
		html +=	"<div class='card card-1 widget_card' style='height:400px;'>"
		html += "<div class='card-header widget_card widget_header card-outline card-dark'><span class='text-center text-primary' style='font-size: 20px;'>"+ title +"</span><div class='ml-2 pull-right'><span class='fa fa-download' device='"+device+"' topic='"+topic+"' key='"+key+"' onclick='DownloadData(this, "+widget_id+")' style='cursor: pointer;'></span> </div></div>"
		html += "<div class='card-body' onload=''>"
		switch(type) {
			case "text" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "color" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "gauge" :
				html += "<div class='mt-4 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "vertical_gauge" :
				html += "<div class='mt-2 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "horizontal_gauge" :
				html += "<div class='mt-5 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "donut" :
				html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
				break;
			case "line_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "bar_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "led" :
				html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div></div>"
				break;
			case "switch" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
				break;
		}
		/*if(type == "text" || type == "colour") {
			html += "<div class='row'><div class='col-lg-12 mt-5'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div>\</div>"
		}
		else if(type == "donut"){
		    html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
		}
		else if(type == "gauge_chart"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div>"
		}
		else if(type == "vertical_gauge"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='vertical_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "horizontal_gauge"){
		    html += "<div class='row'><div class='col-lg-12'><canvas class='horizontal_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "led_light"){
			html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div>"
		}
		else if(type == "onoff_switch"){
			html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
		}
		else if(type == "bar_chart"){
			html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div>"
		}
		else if(type == "table") {

		}
		else {
			html += "<div class='row'><div class='col-lg-12'><div class='line_chart wid' id="+id+"></div></div>"
		}*/
		html += "</div><div class='card-footer'><i class='fa fa-clock-o'></i></div></div></section>"
		$("#widgets").append(html);
		switch(type) {
			case "text" :
				widgetValueInjecter(device, topic, id, key);
				break;
			case "color" :
				colourWidgetInjector(title, device, topic, id, key);
				break;
			case "gauge" :
				radialWidgetValueInjecter(device, topic, id, key);
				break;
			case "vertical_gauge" :
				verticalWidgetValueInjecter(device, topic, id, key);
				break;
			case "horizontal_gauge" :
				horizontalWidgetValueInjecter(device, topic, id, key);
				break;
			case "donut" :
				donutWidgetValueInjecter(device, topic, id, key);
				break;
			case "line_chart" :
				lineChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "bar_chart" :
				barChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "led" :
				ledWidgetValueInjecter(device, topic, id, key);
				break;
			case "switch" :
				onoffWidgetValueInjecter(device, topic, id, key);
				break;
		}
		/*if(type == "text") {
			widgetValueInjecter(device, topic, id, key);
		}
		else if(type == "colour") {
			colourWidgetInjector(title, device, topic, id, key);
		}
		else if(type == "line_chart") {
			lineChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if(type == "bar_chart") {
			barChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if (type == "gauge_chart") {
			gaugeWidgetValueInjecter(device, topic, id, key, title);
		}
		else if (type == "donut") {
			donutWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "vertical_gauge") {
			verticalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "horizontal_gauge") {
			horizontalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "led_light") {
			ledWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "onoff_switch") {
			onoffWidgetValueInjecter(device, topic, id, key);
		}*/
}
function createwidgetvisualfullwidget(widget_id, title, device, topic, key, type, id) {
		var html = 	"<section class='col-sm-12  widget mt-2' id=full_widget_disp_"+widget_id+">"
		html +=	"<div class='card card-1 widget_card' style='height:400px;'>"
		html += "<div class='card-header widget_card widget_header card-outline card-dark'><span class='text-center text-primary' style='font-size: 20px;'>"+ title +"</span><div class='ml-2 pull-right'><span class='fa fa-download' device='"+device+"' topic='"+topic+"' key='"+key+"' onclick='DownloadData(this, "+widget_id+")' style='cursor: pointer;'></span> <i class ='fa fa-compress' onclick=closesinglewidget("+widget_id+")></i></div></div>"
		html += "<div class='card-body' onload=''>"
		switch(type) {
			case "text" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "color" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div></div>"
				break;
			case "gauge" :
				html += "<div class='mt-4 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "vertical_gauge" :
				html += "<div class='mt-2 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "horizontal_gauge" :
				html += "<div class='mt-5 row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div></div>"
				break;
			case "donut" :
				html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
				break;
			case "line_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "bar_chart" :
				html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div></div>"
				break;
			case "led" :
				html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div></div>"
				break;
			case "switch" :
				html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
				break;
		}
		/*if(type == "text" || type == "colour") {
			html += "<div class='row'><div class='col-lg-12 mt-5'><h1 id="+id+" class='text mt-5 font-weight-bold font-italic wid'></h1></div>\</div>"
		}
		else if(type == "donut"){
		    html += "<div class='row'><div class='col-lg-12 mt-5 knob'><input type='text' data-step='0.01' id="+id+" class='knob wid' data-thickness='0.2' data-angleArc='250' data-angleOffset='-125' value='0' data-width='200' data-height='200' data-fgColor='#00c0ef'></div>"
		}
		else if(type == "gauge_chart"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='gauge_chart wid' id="+id+"></canvas></div>"
		}
		else if(type == "vertical_gauge"){
		    html += "<div class='row'><div class='col-lg-12 text-center'><canvas class='vertical_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "horizontal_gauge"){
		    html += "<div class='row'><div class='col-lg-12'><canvas class='horizontal_gauge wid' id="+id+"></canvas></div>"
		}
		else if(type == "led_light"){
			html += "<div class='row'><div class='col-lg-12 mt-5'><div class='mt-5 led_light led-red blink_me1 wid' id="+id+"></div></div>"
		}
		else if(type == "onoff_switch"){
			html += "<div class='row'><div class='col-lg-12 mt-5 text-center'><label class='switch1 mt-5 wid' id='"+ id +"'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label></div></div>"
		}
		else if(type == "bar_chart"){
			html += "<div class='row'><div class='col-lg-12'><div class='bar_chart wid' id="+id+"></div></div>"
		}
		else if(type == "table") {

		}
		else {
			html += "<div class='row'><div class='col-lg-12'><div class='line_chart wid' id="+id+"></div></div>"
		}*/
		html += "</div><div class='card-footer'><i class='fa fa-clock-o'></i></div></div></section>"
		$(html).insertBefore("#maheshkumar");

		switch(type) {
			case "text" :
				widgetValueInjecter(device, topic, id, key);
				break;
			case "color" :
				colourWidgetInjector(title, device, topic, id, key);
				break;
			case "gauge" :
				radialWidgetValueInjecter(device, topic, id, key);
				break;
			case "vertical_gauge" :
				verticalWidgetValueInjecter(device, topic, id, key);
				break;
			case "horizontal_gauge" :
				horizontalWidgetValueInjecter(device, topic, id, key);
				break;
			case "donut" :
				donutWidgetValueInjecter(device, topic, id, key);
				break;
			case "line_chart" :
				lineChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "bar_chart" :
				barChartWidgetValueInjecter(title, device, topic, id, key);
				break;
			case "led" :
				ledWidgetValueInjecter(device, topic, id, key);
				break;
			case "switch" :
				onoffWidgetValueInjecter(device, topic, id, key);
				break;
		}
		/*if(type == "text") {
			widgetValueInjecter(device, topic, id, key);
		}
		else if(type == "colour") {
			colourWidgetInjector(title, device, topic, id, key);
		}
		else if(type == "line_chart") {
			lineChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if(type == "bar_chart") {
			barChartWidgetValueInjecter(title, device, topic, id, key);
		}
		else if (type == "gauge_chart") {
			gaugeWidgetValueInjecter(device, topic, id, key, title);
		}
		else if (type == "donut") {
			donutWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "vertical_gauge") {
			verticalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "horizontal_gauge") {
			horizontalWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "led_light") {
			ledWidgetValueInjecter(device, topic, id, key);
		}
		else if (type == "onoff_switch") {
			onoffWidgetValueInjecter(device, topic, id, key);
		}*/
}
/*function updateWidgets(device, topic, msg, time) {
	for(i in widget_id) {
		for(device in widget_id[i]) {
			for(topic in widget_id[i][device]) {
				switch(i) {
					case "text" :
						for(l in widget_id[i][device][topic]) {
							document.getElementById(widget_id[i][device][topic][l]).innerHTML = msg;
							//console.log(widget_extra[widget_id[i][device][topic][l]]);
							var current_widget_offset = widget_extra[widget_id[i][device][topic][l]]["key"]["offset"];
							var offsets = widget_extra[widget_id[i][device][topic][l]]["offset"];
							// console.log(offsets);
							// console.log(parseFloat(offsets[off]), parseFloat(msg), parseFloat(offsets[off]) < parseFloat(msg));
							for(key in widget_extra[widget_id[i][device][topic][l]]["key"]) {
								if(key == "number" || key == "string") {
									for(off in offsets) {
										//console.log(offsets[off], parseFloat(msg), offsets[off] != "" )
										if(parseFloat(offsets[off]) < parseFloat(msg) && offsets[off] != "" ) {
											//console.log(offsets[off], parseFloat(msg), widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["offset_color"])
											$("#" + widget_id[i][device][topic][l]).parent().css("background-color", widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["offset_color"]);
										}
									}
								}
								else {
									$("#" + widget_id[i][device][topic][l]).parent().css("background-color", widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["offset_color"]);
								}
							}
						}
						break;
					case "color" :
						for(l in widget_id[i][device][topic]) {
							var current_widget_offset = widget_extra[widget_id[i][device][topic][l]]["key"]["offset"];
							var offsets = widget_extra[widget_id[i][device][topic][l]]["offset"];
							for(key in widget_extra[widget_id[i][device][topic][l]]["key"]) {
								if(key == "number" || key == "string") {
									for(off in offsets) {
										if(parseFloat(offsets[off]) < parseFloat(msg) && offsets[off] != "" ) {
											document.getElementById(widget_id[i][device][topic][l]).innerHTML = widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["sub_title"];
											$("#" + widget_id[i][device][topic][l]).parent().css("background-color", widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["offset_color"]);
										}
									}
								}
								else {
									$("#" + widget_id[i][device][topic][l]).parent().css("background-color", widget_extra[widget_id[i][device][topic][l]]["key"][key]["offset"][offsets[off]]["offset_color"]);
								}
							}
						}
						break;
					case "donut" :
						for(l in widget_id[i][device][topic]) {
							// console.log(widget_id[i][device][topic][l], msg);
							//document.getElementById(widget_id[i][device][topic][l]).innerHTML = msg;
							//console.log(msg);
							$("#" + widget_id[i][device][topic][l]).val(parseFloat(msg)).trigger('change');
						}
						break;
					case "gauge" :
						for(l in widget_id[i][device][topic]) {
							gaugeObject[widget_id[i][device][topic][l]].value = msg;
							//$("#" + widget_id[i][device][topic][l]).val(parseFloat(msg)).trigger('change');
						}
						break;
				}
			}
		}
	}
}*/


function updateWidgets(device, topic, message, time) {
	
	/*for(var w in widget_list) {
		if((device in widget_list[w]) && (topic in widget_list[w][device])) {
			$(".widget-last-updated-time").html(new Date(time).toString().substring(0, 25));
		}
		break;
	}*/
	for(x in widget_list) {
		if(x == "text") {
			if(device in widget_list["text"]) {
				if(topic in widget_list["text"][device]) {
					key = widget_list["text"][device][topic];
					
					for (var i = key.length - 1; i >= 0; i--) {
						
						id = getWidgetId(x, device, topic, key[i]);
						
						if(id == null) {
							
						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
				                var extra = widget_extra[id];
				                //var text_offset = extra["offset"];
								if(key[i] == "message-integer" || key[i] == "message-float" || key[i] == "message-string") {
									var unit = extra["key"][key]["unit"];
									document.getElementById(id[j]).innerHTML = Math.round(message *100)/100 + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc";
									for(ar in extra["offset_data"]) {
										if(parseFloat(message) >= parseFloat(extra["offset_data"][ar])) {
											bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
											colr = colorpicker(bgcolr);
										}
									}
									//console.log(bgcolr, colr, parseFloat(message), parseFloat(extra["offset_data"][ar]))
									$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
									$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
									$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
									$("#" +id).attr("style", "color: #" + colr);
									$("#" +id).parent().parent().parent().parent().css("color", "#" + colr);
									$("#" +id).parent().parent().parent().find(".class-header").css("color", "#" + colr);
								}
								else {
									keys = []
									keys = key[i].split(".");
									fun(message, keys);
									var unit = extra["key"][key[i]]["unit"];
									msg = Math.round(parseFloat(fun_data) *100)/100;
									document.getElementById(id[j]).innerHTML = msg + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc"
									for(ar in extra["offset_data"]) {
										if(parseFloat(msg) >= parseFloat(extra["offset_data"][ar])) {
											bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
											colr = colorpicker(bgcolr);
										}
									}
									$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
									$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
									$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
									$("#" +id).attr("style", "color: #" + colr);
									$("#" +id).parent().parent().parent().parent().css("color", "#" + colr);
									$("#" +id).parent().parent().parent().find(".class-header").css("color", "#" + colr);
								}
							}
						}
					}
				}
			}
		}
		if(x == "table") {
			if(device in widget_list["table"]) {
				if(topic in widget_list["table"][device]) {
					key = widget_list["table"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
						
						id = getWidgetId(x, device, topic, key[i]);
						
						if(id == null) {
							
						}
						else {
							for(j in id) {

								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								//console.log(id[i], widget_extra[id])
				                var extra = widget_extra[id[j]];
				                //var text_offset = extra["offset"];
								if(key[i] == "message-integer" || key[i] == "message-float" || key[i] == "message-string") {
									var unit = extra["sub"]["unit"];
									document.getElementById(id[j]).innerHTML = Math.round(message *100)/100 + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc";
									var offset_data = [];
									/*for(i in extra["offset"]) {
										offset_data.push(i);
									}*/
									for(ar in extra["offset"]) {
										if(parseFloat(message) >= parseFloat(ar)) {
											bgcolr = extra["offset"][ar]["color"]
											colr = colorpicker(bgcolr);
										}
									}
									//console.log(bgcolr, colr, parseFloat(message), parseFloat(extra["offset_data"][ar]))
									$("#" +id[j]).parent().css("background-color", bgcolr);
									$("#" +id[j]).parent().css("color", "#" + colr);
								}
								else {
									keys = []
									keys = key[i].split(".");
									fun(message, keys);
									//console.log(id[j])
									var unit = extra["sub"]["unit"];
									msg = Math.round(parseFloat(fun_data) *100)/100;
									document.getElementById(id[j]).innerHTML = msg + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc"
									var offset_data = [];
									/*for(i in extra["offset"]) {
										offset_data.push(i);
									}*/
									for(ar in extra["offset"]) {
										//console.log(ar, parseFloat(msg) >= parseFloat(extra["offset"][ar]), extra["offset"]);
										if(parseFloat(msg) >= parseFloat(ar)) {
											bgcolr = extra["offset"][ar]["color"]
											if(extra["offset"][ar]["status"] != "") {
												document.getElementById(id[j]).innerHTML = extra["offset"][ar]["status"]
											}
											colr = "#" + colorpicker(bgcolr);
										}
									}
									//console.log($("#" +id[j]).parent().parent().html(), colr, bgcolr);
									$("#" +id[j]).parent().css("background-color", bgcolr);
									$("#" +id[j]).parent().css("color", colr);
								}
							}
						}
					}
				}
			}
		}
		else if(x == "color") {
			if(device in widget_list["color"]) {
				if(topic in widget_list["color"][device]) {
					key = widget_list["color"][device][topic];
					
					for (var i = key.length - 1; i >= 0; i--) {
						
						id = getWidgetId(x, device, topic, key[i]);
						
						if(id == null) {
							
						}
						else {
							for(j in id) {

								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
				                var extra = widget_extra[id];
				                //var text_offset = extra["offset"];
								if(key[i] == "message-integer" || key[i] == "message-float" || key[i] == "message-string") {
									var unit = extra["key"][key]["unit"];
									//document.getElementById(id[j]).innerHTML = Math.round(message *100)/100 + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc";
									var msg_content = "";
									for(ar in extra["offset_data"]) {
										if(parseFloat(message) >= parseFloat(extra["offset_data"][ar])) {
											bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
											colr = colorpicker(bgcolr);
											msg_content = extra["offset"][extra["offset_data"][ar]]["sub_title"];
										}
									}
									document.getElementById(id[j]).innerHTML = msg_content;
									$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
									$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
									$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
									$("#" +id).attr("style", "color: #" + colr);
									$("#" +id).parent().parent().parent().parent().css("color", "#" + colr);
									$("#" +id).parent().parent().parent().find(".class-header").css("color", "#" + colr);
								}
								else {
									keys = []
									keys = key[i].split(".");
									fun(message, keys);
									var unit = extra["key"][key[i]]["unit"];
									msg = Math.round(parseFloat(fun_data) *100)/100;
									document.getElementById(id[j]).innerHTML = msg + "   <small>" + unit + "</small>";
									var bgcolr = "#ffffff"
									var colr = "2303fc";
									var msg_content = "";
									for(ar in extra["offset_data"]) {
										if(parseFloat(msg) >= parseFloat(extra["offset_data"][ar])) {
											bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
											colr = colorpicker(bgcolr);
											msg_content = extra["offset"][extra["offset_data"][ar]]["sub_title"];
										}
									}
									document.getElementById(id[j]).innerHTML = msg_content;
									$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
									$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
									$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
									$("#" +id).attr("style", "color: #" + colr);
									$("#" +id).parent().parent().parent().parent().css("color", "#" + colr);
									$("#" +id).parent().parent().parent().find(".class-header").css("color", "#" + colr);
								}
							}
						}
					}
				}
			}
		}
		else if(x == "line_chart") {
			if(device in widget_list["line_chart"]) {
				if(topic in widget_list["line_chart"][device]) {
					key = widget_list["line_chart"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
						
						id = getWidgetId(x, device, topic, key[i]);
						
						if(id == null) {
							
						}
						else {
							for(j in id) {

								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
								
									updateLineGraph(time, time, id[j], message)
								}
								else {
									keys = []
									
										keys = key[i].split(".");
										//fun(message, keys);
										updateLineGraph(time, time, id[j], message)
									
								}
							}
						}
					}
				}
			}
		}

		else if(x == "bar_chart") {
			if(device in widget_list["bar_chart"]) {
				if(topic in widget_list["bar_chart"][device]) {
					key = widget_list["bar_chart"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
						
						id = getWidgetId(x, device, topic, key[i]);
						
						if(id == null) {
							
						}
						else {
							for(j in id) {

								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									updateLineGraph(time, time, id[j], message)
									//updateBarGraph(time, time, id[j], message)
								}
								else {
									keys = []
									
										keys = key[i].split(".");
										//fun(message, keys);
										updateLineGraph(time, time, id[j], message)
									
								}
							}
						}
					}
				}
			}
		}

		else if(x == "gauge") {
			
			if(device in widget_list["gauge"]) {
			
				if(topic in widget_list["gauge"][device]) {
					key = widget_list["gauge"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
			
						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {
							
						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									gaugeObject[id].value = message;
									//randomize(message,id)
								}
								else {
									keys = []
									keys = key[i].split(".");
									fun(message, keys);
									gaugeObject[id[j]].value = fun_data;									
								}
							}
						}
					}
				}
			}
		}
		else if(x == "vertical_gauge") {
		
			if(device in widget_list["vertical_gauge"]) {
		
				if(topic in widget_list["vertical_gauge"][device]) {
					key = widget_list["vertical_gauge"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
		
						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {

						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									//v_gauge(id[j], message)
									gaugeObject[id[j]].value= message;

								}
								else {
									keys = []
		
										keys = key[i].split(".");
										fun_data = null;
										fun(message, keys);
										gaugeObject[id[j]].value= fun_data;
										//v_gauge(id[j], fun_data)
									//}
								}
							}
						}
					}
				}
			}
		}
		else if(x == "horizontal_gauge") {
		
			if(device in widget_list["horizontal_gauge"]) {
		
				if(topic in widget_list["horizontal_gauge"][device]) {
					key = widget_list["horizontal_gauge"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
		
						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {
							
						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									//h_gauge(id[j], message)
									gaugeObject[id[j]].value= message;

								}
								else {
									keys = []
		
										keys = key[i].split(".");
										fun(message, keys);
										gaugeObject[id[j]].value= fun_data;
										//h_gauge(id[j], fun_data);
		
								}
							}
						}
					}
				}
			}
		}
		else if(x == "donut") {
		
			if(device in widget_list["donut"]) {
		
				if(topic in widget_list["donut"][device]) {
					key = widget_list["donut"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
		
						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {
							
						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									donut_widget_data[id[j]] = parseFloat(message);
									/*console.log(message, $("#" + id[j]).val())*/
									// console.log(parseFloat(message));
									$("#" + id[j]).val(parseFloat(message)).trigger('change');
								}
								else {
									/*console.log(message)*/
									keys = []
									keys = key[i].split(".");
									fun(message, keys);
									donut_widget_data[id[j]] = parseFloat(fun_data);
									$("#" + id[j]).val(parseFloat(fun_data)).trigger('change');
								}
							}
						}
					}
				}
			}
		}
		else if(x == "switch") {
		
			if(device in widget_list["switch"]) {
			
				if(topic in widget_list["switch"][device]) {
					key = widget_list["switch"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {
			
						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {
							
						}
						else {
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {
									var m_msg = message;
								}
								else {
									keys = []
			
										keys = key[i].split(".");
										//fun_data = null;
										fun(message, keys);
										var m_msg = fun_data;
										//message = fun_data;
								}
								var onoff_extra = widget_extra[id[j]];
								var onoff_inact_msg = onoff_extra["inact_msg"];
								var onoff_act_msg = onoff_extra["act_msg"];
								/*console.log(onoff_act_msg == m_msg)*/
								if(onoff_act_msg == m_msg) {
									$("#togBtn" +id[j]).attr("checked", true)
								}
								else {
									$("#togBtn" +id[j]).removeAttr("checked")
								}
							}
						}
					}
				}
			}
		}
		else if(x == "led") {
			
			if(device in widget_list["led"]) {

				if(topic in widget_list["led"][device]) {
					key = widget_list["led"][device][topic];
					for (var i = key.length - 1; i >= 0; i--) {

						id = getWidgetId(x, device, topic, key[i]);
						if(id == null) {
							
						}
						else {
							var led_extra = widget_extra[id];
							var led_sub_topic = led_extra["sub_topic"];
							var led_act_msg = led_extra["act_msg"];
							var act_color = led_extra["act_color"];
							var led_inact_msg = led_extra["inact_msg"];
							var inact_color = led_extra["inact_color"];
							for(j in id) {
								$("#" + id[j]).parent().parent().parent().parent().find(".fa-clock-o").html(time);
								if(key == "message-integer" || key == "message-float" || key == "message-string") {

									 if (message == led_act_msg) {
											$('#' +id).css('background-color', act_color);
				 						}

									 else {
									 		$('#' +id).css('background-color', inact_color);
									 	}
								}
								else {
									keys = []
									//for (var i = key.length - 1; i >= 0; i--) {
									keys = key[i].split(".");
									fun(message, keys);
									if (fun_data == led_act_msg) {
										$('#' +id).css('background-color', act_color);
									}

									else {
										$('#' +id).css('background-color', inact_color);
									}

									//}
								}
							}
						}
					}
				}
			}
		}
	}
}



function getWidgetId(type, device, topic, key) {
	widgets_id = "";
	if(type in widget_id) {
	
		widgets_id = widget_id[type]

		if(device in widgets_id) {
			
			widgets_id = widgets_id[device];
			
			if(topic in widgets_id) {
			
				widgets_id = widgets_id[topic];
				if(key in widgets_id) {
					widgets_id = widgets_id[key];
					return widgets_id;
				}
			}
		}
	}
	return null;
}


function colorpicker(c1) {
	var colr = "";
	if(parseInt(c1.substring(1,3), 16) >= 77) {
		//alert(parseInt(c1.substring(0,2), 16))
		colr += "00"
	}
	else {
		colr += "ff"
	}
	if(parseInt(c1.substring(3,5), 16) >= 77) {
		colr += "00"
		//alert(parseInt(c1.substring(2, 4), 16))
	}
	else {
		colr += "ff"
	}
	if(parseInt(c1.substring(5, 7), 16) >= 77) {
		colr += "00"
		//alert(parseInt(c1.substring(4,6), 16))
	}
	else {
		colr += "ff"
	}
	return colr
}


function widgetValueInjecter(device, topic, id, key) {
  var extra = widget_extra[id];
  var text_offset = parseFloat(extra["offset"]);
  var unit = extra["key"][key]["unit"];
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
		var message = widget_device_data[device][topic][0]["message"];
		message = Math.round(parseFloat(message) *100)/100;
		document.getElementById(id).innerHTML = message + "   <small>" + unit + "</small>";
	}
	else {
		keys = key.split(".")
			message = widget_device_data[device][topic][0]["message"];
			fun(message, keys);
			console.log(message, keys, fun_data);
			var message = Math.round(parseFloat(fun_data) *100)/100;
			document.getElementById(id).innerHTML = message + "   <small>" + unit + "</small>";
		//}
	}
	var bgcolr = "#ffffff"
	var colr = "2303fc";
	for(ar in extra["offset_data"]) {
		if(message >= parseFloat(extra["offset_data"][ar])) {
			bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
			colr = colorpicker(bgcolr);
		}
	}
	//console.log(bgcolr, colr, parseFloat(message), parseFloat(extra["offset_data"][ar]))
	$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
	$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
	$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
	$("#" +id).attr("style", "color: #" + colr);
	$("#" +id).parent().parent().parent().parent().css("color", "#" + colr);
	$("#" +id).parent().parent().parent().find(".class-header").css("color", "#" + colr);
}







function colourWidgetInjector(title, device, topic, id, key) {
	var extra = widget_extra[id];
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
		var message = widget_device_data[device][topic][0]["message"];
		message = Math.round(parseFloat(message) *100)/100;
		//document.getElementById(id).innerHTML = message + "   <small>" + unit + "</small>";
	}
	else {
		keys = key.split(".")
			message = widget_device_data[device][topic][0]["message"];
			fun(message, keys);
			var message = Math.round(parseFloat(fun_data) *100)/100;
			//document.getElementById(id).innerHTML = message + "   <small>" + unit + "</small>";
		//}
	}
	var bgcolr = "#ffffff"
	var colr = "2303fc";
	var msg_content = "";
	for(ar in extra["offset_data"]) {
		if(message >= parseFloat(extra["offset_data"][ar])) {
			bgcolr = extra["offset"][extra["offset_data"][ar]]["color"]
			colr = colorpicker(bgcolr);
			msg_content = extra["offset"][extra["offset_data"][ar]]["sub_title"]
		}
	}
	document.getElementById(id).innerHTML = msg_content;
	$("#" +id).parent().parent().parent().parent().css("background-color", bgcolr);
	$("#" +id).parent().parent().parent().parent().find(".card-header").find(".fa-times").removeClass("text-danger")
	$("#" +id).parent().parent().parent().parent().find(".card-header").find("span").removeClass("text-primary")
	$("#" +id).attr("style", "color: #" + colr);
}

function deleteWidget(th, widget_id) {

	var conf = confirm("Do you want to delete?");
	if(conf) {
		var data = {};
		data["id"] = widget_id;
		$.ajax({
			url : "/bwiot/api/v1/widget/delete/",
			type  : "POST",
			data : data,
			success : function(result) {
				if(result["status"] == "Success") {
					$(th).parent().parent().parent().parent().remove();
				}
			}
		})
	}
}

function DownloadData(th, id) {
	$("[name='gt']").datepicker().datepicker("setDate", new Date());
	$("[name='lt']").datepicker().datepicker("setDate", new Date());
	$("#create-widget-extract-model").find(".modal-title").text($(th).parent().parent().find(".text-center").text());
	$("#widget-extract-form").find("[name='device']").val($(th).attr("device"));
	$("#widget-extract-form").find("[name='topic']").val($(th).attr("topic"));
	$("#widget-extract-form").find("[name='key']").val($(th).attr("key"));
	/*$(th).removeClass("fa-file-o");
	$(th).addClass("fa-spinner fa-pulse")*/
	$("#create-widget-extract-model").modal("show");
}

function exportWidgetData() {
	var datum = {};
	var form_data = $("#widget-extract-form").serializeArray()
	for(i in form_data) {
		datum[form_data[i]["name"]] = form_data[i]["value"];
	}

	$.ajax({
		url : "/bwiot/api/v1/widget/data_export/",
		method : "GET",
		data : datum,
		success : function(data) {

			csv_msg_headers = [];

			for(i in data.data[0]) {
				csv_msg_headers.push(i)
			}
			for(i in data.data) {
                data.data[i]["time"] = dateString(data.data[i]["time"]);
                //console.log(data.data[i]["time"]);
            }
			var header = "Device" + "," + "Topic" + "," + "Key" + "\r\n";
			header += datum["device"] + "," + datum["topic"] + "," + datum["key"] + "\r\n";
			exportCSVFile(csv_msg_headers, data.data, "report", header);
			$("#create-widget-extract-model").modal("hide");
		}
	});
}

function fun(msg, key) {

	if(Array.isArray(msg)) {
		for (var i = msg.length - 1; i >= 0; i--) {
			fun(msg[i], key)
		}
	}
	else if(typeof(msg) == "object") {
		if(key[0] in msg) {
			msg = msg[key[0]]
			key.shift()
			if(key.length == 0){
				fun_data = msg;
			}
			else {
				fun(msg, key)
			}
		}
	}
	else if(typeof(msg) == "string") {
		try {
			msg = msg.replace(/'/gi, '"');
		
			msg = JSON.parse(msg)
			fun(msg, key)
		}
		catch(err) {
			
		}
	}
}

function getfullwidget_init(dashboard_id)
{	/*val=$("#full_widget_icon").text()
	$(".extract_full").css("display","none");
	$(".compress_full").css("display","block");
	$("#widget_create_modal").css("display","none");
	$("#widget-creater-del").css("display","none");
	$("#main_nav").css("display","none");
	$("#sub_nav").css("display","none");*/
	//getWidgetsfull(val);
	var hashurl = (window.location.hash).split("#");
	var dashboard_id = hashurl[1].split("/");
	window.location = "/dashboard/" + dashboard_id[1];

}
function getwidget_init()
{
	val=$("#full_widget_icon").text()
	$(".extract_full").css("display","block");
	$(".compress_full").css("display","none");
	$("#widget_create_modal").css("display","block");
	$("#widget-creater-del").css("display","block");
	$("#main_nav").css("display","block");
	$("#sub_nav").css("display","block");
	getWidgets(val);

}

function getsinglewidget(p)
{
	$("#maheshkumar").css("display","none");
	$(".extract_full").css("display","none");
	$(".compress_full").css("display","none");
	var data={}
	data["id"]=p;
	$.ajax({
		url: "/bwiot/api/v1/single/widget/",
		type: "POST",
		data : data,
		async : false,
		success: function (result)
		 {
			if(result["status"] == "Success") 
			{
				widget_id = result["widget_id"];
				widget_list = result.widgets;
				widget_extra = result["widget_extra"];
				widget_position = result["widget_position"];
				widget_device_data = result.data;
				for (var i = result.init.length - 1; i >= 0; i--)
				 {
					createwidgetvisualfullwidget(result.init[i]["id"], result.init[i]["name"], result.init[i]["device"], result.init[i]["topic"], result.init[i]["key"], result.init[i]["type"], result.init[i]["widget_id"]);
				}
		}
	}});

}
function closesinglewidget(w)
{
	val=$("#full_widget_icon").text()
	$("#maheshkumar").css("display","");
	console.log("#full_widget_disp_"+w)
	$("#full_widget_disp_"+w).css("display","none")
	$(".extract_full").css("display","none");
	$(".compress_full").css("display","block");
	$("#widget_create_modal").css("display","none");
	$("#widget-creater-del").css("display","none");
	$("#main_nav").css("display","none");
	$("#sub_nav").css("display","none");
	getWidgetsfull(val);
}
