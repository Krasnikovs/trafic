function lineChartWidgetValueInjecter(title, device, topic, id, key) {
	var l_extra = widget_extra[id];
	var color = l_extra["key"];

	var message = widget_device_data[device][topic]
	//console.log(message)
	var layout = {};
	y_axis = []
	x_axis = []
	var data = [];

	yaxis_title = ""
	var keyList = key.split(",");
	// console.log(keyList, key)
	for(k in keyList) {
		y_axis = []
		x_axis = []
		key = keyList[k];
		var unit = l_extra["key"][key]["unit"];
		var l_title = l_extra["key"][key]["sub_title"] + " ("+unit+")";

		yaxis_title += l_title + "<br>"
		if(key == "message-integer" || key == "message-float" || key == "message-string") {
			for (var i = message.length - 1; i >= 0; i--) {
				y_axis.push(message[i]["message"]);
				x_axis.push(new Date(message[i]["time"]))
			}
		}
		else if(key) {
			for (var i = message.length - 1; i >= 0; i--) {
				keys = keyList[k].split(".");
				fun(message[i]["message"], keys)
				y_axis.push(fun_data);
				x_axis.push(new Date(message[i]["time"]))
			}
		}

		var unit = color[key]["unit"]
		var clr = color[key]["color"]
		data.push({
			x: x_axis,
			y: y_axis,
			name : l_title,
			/*yaxis : yaxis_1,*/
			mode: 'lines',
			line: {
				color: clr,
				shape: 'spline',
				smoothing: 1.3
			}
		})
	}
	layout["autosize"] = true;
	layout["xaxis"] = {}
	layout["xaxis"]["title"] = "Time";

	layout = {yaxis: {title: yaxis_title},
	          margin: {
			    l: 50,
			    r: 30,
			    b: 35,
			    t: 50,
			  },
			  height:260,
			  widgh:350,
			  legend : {"orientation" : "h"},
			font: {
				family: 'sans-serif',
				size: 11,
				color: '#000'
			},
	      };
	// console.log(data)
	Plotly.plot(id,data, layout,{displayModeBar: false, responsive: true});
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}

function barChartWidgetValueInjecter(title, device, topic, id, key) {

	var b_extra = widget_extra[id];
	var b_offset = parseFloat(b_extra["offset"]);

	var message = widget_device_data[device][topic]
	y_axis = []
	x_axis = []
	var data = [];
	var yaxis_title = ""
	var keyList = key.split(",");
	for(k in keyList) {
		y_axis = []
		x_axis = []
		key = keyList[k];
		//console.log(check_key, "#################################");
		// var b_title = b_extra["key"][key]["sub_title"];
		var unit = b_extra["key"][key]["unit"];

		var b_title = b_extra["key"][key]["sub_title"] + " ("+unit+")";






		yaxis_title += b_title + "<br>"
		if(key == "message-integer" || key == "message-float" || key == "message-string") {
			for (var i = message.length - 1; i >= 0; i--) {
				y_axis.push(message[i]["message"])
				x_axis.push(new Date(message[i]["time"]))
			}
		}
		else if(key) {
			for (var i = message.length-1; i >= 0; i--) {
				keys = key.split(".");
				fun(message[i]["message"], keys)
				rec_message = fun_data;
				y_axis.push(rec_message)
				x_axis.push(new Date(message[i]["time"]))
			}
		}
		data.push({x: x_axis,title : b_title,
						  y: y_axis, name : b_title, hoverinfo : "y+x+name",
						  type: 'bar', marker : {color : b_extra["key"][key]["color"]}})
	}
	//useResizeHandler: true


	layout = {		  	  
			  xaxis:
			  {
	           // fixedrange: true
	          }, 
	          yaxis:
	          {
	            title: yaxis_title
	          },
	         margin: 
	          {
			    l: 50,
			    r: 30,
			    b: 35,
			    t: 50,
			  },
			  //barmode: 'stack',
			  height:260,
			  width: 300,




			  legend : {orientation: "h"},
			  font: {
				family: 'sans-serif',
				size: 11,
				color: '#000'
			},

	      };
	Plotly.newPlot(id, data,layout,{displayModeBar: false, responsive: true});
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}


/*function updateLineGraph(old_time, new_time, graph_id, latest_data) {
	var key = widget_extra[graph_id]["keys"].split(",");
	time = new Date();
	var d = [];
	var y = [];
	var x = [];
	var update = {
		x:  [[time],[time],[time]],
		y: []
	}
	latest_data = JSON.parse(latest_data);
	for(i in key) {
		if(key[i] == "message-integer" && key[i] == "message-float") {
			//for(i in key) {
				x.push([time]);
				d.push(0);
				y.push([latest_data[key[i]]]);
			//}
		}
		else if(key[i]) {
			console.log(key[i]);
			x.push([time]);
			d.push(parseFloat(0));
			y.push([latest_data]);
			for(i in key) {
				x.push([time]);
				d.push(parseFloat(i));
				y.push([latest_data[key[i]]]);
			}
		}
	}
	update["y"] = y;
	update["x"] = x;
	time = new Date();
	var olderTime = time.setMinutes(time.getMinutes() - 1);
	var futureTime = time.setMinutes(time.getMinutes() + 1);
	var minuteView = {
		xaxis: {
			type: 'date',
			range: [olderTime, futureTime]
		}
	};
	console.log(key, x, y);
	Plotly.relayout(graph_id, minuteView);
	Plotly.extendTraces(graph_id, update, d)
}*/

function updateLineGraph(old_time, new_time, graph_id, latest_data) {
	var key = (widget_extra[graph_id])["keys"].split(",");
	time = new Date();
	var d = [];
	var y = [];
	var x = [];
	var update = {
		x:  [[time],[time],[time]],
		y: []
	}
	latest_data = JSON.parse(latest_data);
	// console.log(key)
	if(key[0] != "message-integer" && key[0] != "message-float" && key[0] != "message-string") {
		// console.log("GHGKHGHGGHGHGHGHG")
		for(i in key) {
			x.push([time]);
			d.push(parseFloat(i));
			y.push([latest_data[key[i]]]);
		}
	}
	else {
		// console.log("lkdjklqfakjakldjlj")
		x.push([time]);
		d.push(parseFloat(0));
		console.log(latest_data, y)
		y.push([latest_data]);
	}
	update["y"] = y;
	update["x"] = x;
	//console.log(update);
	time = new Date();
	var olderTime = time.setSeconds(time.getSeconds() - 15);
	var futureTime = time.setSeconds(time.getSeconds() + 15);
	// console.log(olderTime, futureTime)
	var minuteView = {
		xaxis: {
			type: 'date',
			range: [olderTime, futureTime]
		}
	};
	//console.log(key);
	Plotly.relayout(graph_id, minuteView);
	Plotly.extendTraces(graph_id, update, d)
}