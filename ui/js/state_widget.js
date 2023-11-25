function ledWidgetValueInjecter(device, topic, id, key, title) {
	message = widget_device_data[device][topic][0]["message"];
	var led_extra = widget_extra[id];
	var led_sub_topic = led_extra["sub_topic"];
	var led_act_msg = led_extra["act_msg"];
	var act_color = led_extra["act_color"];
	var led_inact_msg = led_extra["inact_msg"];
	var inact_color = led_extra["inact_color"];
	if(key != "message-integer" && key != "message-float" && key != "message-string") {
		keys = key.split(".")
		fun(message, keys);
		message = fun_data;
	}
	if (message == led_act_msg) {
		$('#' +id).css('background-color', act_color);
	}
	else {
	 	$('#' +id).css('background-color', inact_color);
	}
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}

function onoffWidgetValueInjecter(device, topic, id, key, title) {
	// alert("bvsjfdlbjfdbkdpo")
	var onoff_extra = widget_extra[id];
	var onoff_sub_topic = onoff_extra["sub_topic"];
	var onoff_inact_msg = onoff_extra["inact_msg"];
	var onoff_act_msg = onoff_extra["act_msg"];
	if(key == "message-integer" || key == "message-float" || key == "message-string") {
		message = widget_device_data[device][topic][0]["message"];
		if(onoff_act_msg == message) {
			$("#togBtn" +id).attr("checked", true)
		}
	}
	else {
		keys = key.split(".")
		message = widget_device_data[device][topic][0]["message"];
		fun(message, keys);
		message = fun_data;
		if(onoff_act_msg == message) {
			$("#togBtn" +id).attr("checked", true)
		}
	}
	$("#togBtn" +id).on('change', function() {
		if ($(this).is(':checked')) {
			var onoff_msg = onoff_act_msg;
		}
		else {
			var onoff_msg = onoff_inact_msg;
		}
		on(id, onoff_sub_topic, onoff_msg);
	});
	var time = widget_device_data[device][topic][0]["time"];
	time = dateString(time);
	$("#" + id).parent().parent().parent().parent().find(".clock-text").html(time);
}

function on(id, onoff_sub_topic, onoff_msg) {
	// alert("onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
	$.ajax({
		method: "POST",
		url: "/bwiot/api/v1/topic/send_command/",
		data: {
			topic: onoff_sub_topic,
			message: onoff_msg,
			QoS: 2,
			retain: 0
		},
		success: function (result) {
			//var html = "<label class='switch1 mt-5 wid'><input type='checkbox' id='togBtn" +id+"'><div class='slider1 round'><span class='on1'>ON</span><span class='off1'>OFF</span></div></label>";
			//$("#" + id).html(html);
			return;
		}
	});
}