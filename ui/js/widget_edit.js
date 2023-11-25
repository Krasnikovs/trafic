var w_offset = $(".widget-offset-edit").html();
var w_key = $("#w_key").html();
var w_state_key = $("#w_state_key").html();
var offset_text = $("#offset").html();

function getWidgetDevicesList() {
	$.ajax({
		url: "bwiot/api/v1/widget/device/",
		type: "GET",
		async : false,
		success: function (result) {
			if(result["status"] == "Success") {
				var html = "";
				for (var i = result.data.length - 1; i >= 0; i--) {
					html += "<option>" + result.data[i] + "</option>";
				}
				$("#widget-device-edit").html(html);
				getWidgetTopicList();
			}
		}
	});
}


$("#widget-device-selector").change(function() {
	getWidgetTopicList();
});
function getWidgetTopicList() {
	var data = {};
	data["device"] = $("#widget-device-edit").val();
	$.ajax({
		url: "bwiot/api/v1/widget/topic/",
		type: "GET",
		data : data,
		async : false,
		success: function (result) {
			if(result["status"] == "Success") {
				var html = "";
				for (var i = result.data.length - 1; i >= 0; i--) {
					html += "<option>" + result.data[i] + "</option>";
				}
				$("#widget-topic-edit").html(html);
				getWidgetKeyList();
			}
		}
	});
}
$("#widget-topic-selector").change(function() {
	getWidgetKeyList();
});
function getWidgetKeyList() {
	var data = {};
	data["device"] = $("#widget-device-edit").val();
	data["topic"] = $("#widget-topic-edit").val();
	$.ajax({
		url: "bwiot/api/v1/widget/key/",
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

function editWidget(th, widget_id) {
	// console.log(th);
	$(th).find(".editwid").removeClass("editwid");
	$("span.editwid").css("pointer-events", "none");
	// $(th).parent().parent().parent().parent().removeClass("col-md-3");
	$(th).parent().parent().parent().attr("style", "background-color: white;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);");
	$(th).parent().parent().parent().find(".card-header").removeClass("widget_header");
	$(th).parent().parent().parent().find(".card-body").html($("#widget-edit-base-form").parent().html());
	$(th).parent().parent().parent().find(".card-body").css("background-color", "white");
	var w_id = $(th).parent().parent().parent().find("form").attr("id", "widget-edit-form");
	$(th).parent().parent().parent().find("form").addClass("mt-3 mb-5 ml-3 mr-3")
	$(th).parent().parent().find(".pull-right").remove();
	$(th).parent().remove();
	$("#widget-edit-form").prepend("<input type='hidden' name='widget_id' value='"+widget_id+"'>")
	getWidgetDevicesList();
	$.ajax({
		url : "/bwiot/api/v1/widget/edit/",
		method : "GET",
		data : {"widget_id" : widget_id},
		async : false,
		success : function(data) {
			if(data["status"] == "Success") {
				$("#widget-edit-form").find("[name='name']").val(data["widget_data"]["name"]);
				$("#widget-edit-form").find("[name='device']").val(data["widget_data"]["device"]);
				edit_SubTopic_widget();
				getWidgetTopicList();
				$("#widget-edit-form").find("[name='topic']").val(data["widget_data"]["topic"]);
				$("#widget-edit-form").find("Select[name='type']").val(data["widget_data"]["type"]);
				getWidgetKeyList();
				$("#widget-edit-form").find("[name='act_msg']").val(data["widget_data"]["data"]["act_msg"]);
				$("#widget-edit-form").find("[name='act_msg_color']").val(data["widget_data"]["data"]["act_color"]);
				$("#widget-edit-form").find("[name='inact_msg']").val(data["widget_data"]["data"]["inact_msg"]);
				$("#widget-edit-form").find("[name='inact_msg_color']").val(data["widget_data"]["data"]["inact_color"]);
				$("#widget-edit-form").find("[name='minval']").val(data["widget_data"]["data"]["min"]);
				$("#widget-edit-form").find("[name='maxval']").val(data["widget_data"]["data"]["max"]);
				var html = "";
				var j = 0;
				for(i in data["widget_data"]["data"]["key"]) {
					$("#widget-edit-form").find(".w_state_key").val(i);
					html += '<div class="form-group row">\
								<div class="col-md-6 col-sm-12 col-12">\
									<label> Key </label>\
									<input class="form-control f-key" name="key" list="widget-key-selector" autocomplete="off" value="'+i+'" required="">\
								</div>'
					if(data["widget_data"]["type"] == "color" || data["widget_data"]["type"] == "line_chart" || data["widget_data"]["type"] == "bar_chart") {
						html += '<div class="col-md-12 col-sm-12 col-12">'
					}
					else {
						html += '<div class="col-md-12 col-sm-12 col-12" style="display: none;">'
					}
					if(Array.isArray(data["widget_data"]["data"]["key"][i]["sub_title"])) {
						html += '<label class="sub"> Subtitle </label>\
									<input type="text" class="form-control textbox1 sub" autocomplete="off" value="'+ data["widget_data"]["data"]["key"][i]["sub_title"][0]+'" name="sub_title">\
								</div>'
					}
					else {
						html += '<label class="sub"> Subtitle </label>\
									<input type="text" class="form-control textbox1 sub" autocomplete="off" value="'+ data["widget_data"]["data"]["key"][i]["sub_title"]+'" name="sub_title">\
								</div>'
					}
					if(data["widget_data"]["type"] == "color") {
						html += 	'<div class="col-md-3 col-sm-12 col-12" style="display: none;">'
					}
					else {
						html += 	'<div class="col-md-3 col-sm-12 col-12">'
					}
					html += '<label class="unit"> Unit </label>\
							<input type="text" list="widget-unit-selector" class="form-control textbox1 unit" autocomplete="off" id="widget-unit-edit" value="'+data["widget_data"]["data"]["key"][i]["unit"]+'" name="unit">\
						</div>\
						<div class="col-md-3 col-sm-12 col-12">\
							<label> color </label><br>\
							<input type="color" name="offset_color" value="'+data["widget_data"]["data"]["key"][i]["color"]+'">\
						</div>'
					if(data["widget_data"]["type"] == "line_chart" || data["widget_data"]["type"] == "bar_chart") {
						html += '<div class="col-md-3 col-sm-12 col-12">\
									<label> Add </label>\
									<a class="btn btn-sm btn-block btn-outline-dark bg-white" data-toggle="tooltip" title="Add-Key" href="javascript:console.log();" onclick="removeKey(this);">\
										<i class="fa nav-icon add_key_icon fa-minus text-warning"></i></a>\
								</div>'
					}
					html += '</div>'
				}
				if(data["widget_data"]["type"] == "line_chart" || data["widget_data"]["type"] == "bar_chart") {
					$("#widget-edit-form").find(".widget-keys").prepend(html);
				}
				else if(data["widget_data"]["type"] == "led" || data["widget_data"]["type"] == "switch") {
					$("#widget-edit-form").find(".widget-keys").html("");
					$("#widget-edit-form").find("[name='key']").val(data["widget_data"]["key"]);
					$("#widget-edit-form").find("#edit-widget-subtopic").val(data["widget_data"]["data"]["sub_topic"]);
				}
				else {
					$("#widget-edit-form").find(".widget-keys").html(html);
				}
				html = "";
				if(data["widget_data"]["type"] == "color") {
					for(i in data["widget_data"]["data"]["offset"]) {
						if(j == 0) {
							j ++;
							continue;
						}
						html += '<div class="row">\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Offset </label>\
										<input type="number" step="0.01" id="widget-offset" class="form-control textbox1" name="offset" value="'+i+'" autocomplete="off">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Subtitle </label>\
										<input type="text" class="form-control textbox1" name="sub_title" autocomplete="off" value="'+data["widget_data"]["data"]["offset"][i]["sub_title"]+'">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Color </label><br>\
										<input type="color" class="textbox1" name="offset_color" value="'+data["widget_data"]["data"]["offset"][i]["color"]+'">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12 add-offset">\
										<label> Add </label>\
										<a class="btn btn-sm btn-block btn-outline-dark bg-white" data-toggle="tooltip" title="Add offset" onclick="removeOffset(this);">\
											<i class="fa nav-icon add_key_icon fa-minus text-warning" style="color: white;"></i></a>\
									</div>\
								</div>'
					}
					$("[name='sub_title']").removeAttr("disabled");
				}
				else {
					for(i in data["widget_data"]["data"]["offset"]) {
						if(j == 0) {
							j ++;
							continue;
						}
						html += '<div class="row">\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Offset </label>\
										<input type="number" step="0.01" id="widget-offset" class="form-control textbox1" name="offset" value="'+i+'" autocomplete="off">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Subtitle </label>\
										<input type="text" class="form-control textbox1" name="sub_title" autocomplete="off" disabled="">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12">\
										<label> Color </label><br>\
										<input type="color" class="textbox1" name="offset_color" value="'+data["widget_data"]["data"]["offset"][i]["color"]+'">\
									</div>\
									<div class="col-md-3 col-sm-12 col-12 add-offset">\
										<label> Add </label>\
										<a class="btn btn-sm btn-block btn-outline-dark bg-white" data-toggle="tooltip" title="Add offset" onclick="removeOffset(this);">\
											<i class="fa nav-icon add_key_icon fa-minus text-warning" style="color: white;"></i></a>\
									</div>\
								</div>'
					}
				}
				if(data["widget_data"]["type"] == "line_chart" || data["widget_data"]["type"] == "bar_chart") {
					$("#widget-edit-form").find(".widget-offset-edit").html("");
					$("#widget-edit-form").find(".widget-key").remove();
					$("#widget-edit-form").find("[name='minval']").parent().parent().remove()
				}
				else if(data["widget_data"]["type"] == "led") {
					// $("#widget-edit-form").find(".widget-offset-edit").remove();
					// $("#widget-edit-form").find(".act_div").show();
					// $("#widget-edit-form").find("[name='minval']").parent().parent().remove();
					// $("#widget-edit-form").find("[name='unit']").parent().remove();
					// $("#widget-edit-form").find("[name='offset_color']").parent().remove();
					$("#widget-edit-form").find(".widget-offset-edit").html("");
					$("#widget-edit-form").find(".act_div").show();
					$("#widget-edit-form").find("[name='minval']").parent().parent().remove();
					$("#widget-edit-form").find("w_key").remove();

				}
				else if(data["widget_data"]["type"] == "switch") {
					$("#widget-edit-form").find(".widget-offset-edit").html("");
					$("#widget-edit-form").find("[name='sub_topic']").parent().show();
					// $("#widget-edit-form").find("[name='act_msg']").parent().show();
					// $("#widget-edit-form").find("[name='inact_msg'']").parent().show();
					$("#widget-edit-form").find(".act_div").show();
					$("#widget-edit-form").find(".max-min").hide();
					$("#widget-edit-form").find("[name='act_msg_color']").hide();
					$("#widget-edit-form").find("[name='inact_msg_color']").hide();
				}
				else {
					$("#widget-edit-form").find(".widget-offset-edit").prepend(html);
					$("#widget-edit-form").find(".widget-key").remove();
				}
			}
		}
	});
}

function close_edit(){

	// alert('close');
	window.location.reload();
	// $(".page-widget").hide();
	// $(".page-dashboard").show();
}

function updateWidget() {
	// alert("updateWidget");
	$("#widget-edit-form").find("[name='type']").removeAttr("disabled");
	var data = {};
	var w_key_select = false;
	jQuery("#widget-edit-form").serializeArray().map(function(item) {
		if ( data[item.name] ) {
			if ( typeof(data[item.name]) === "string" ) {
				data[item.name] = [data[item.name]];
			}
			data[item.name].push(item.value);
			}
		else {
			// console.log(item.name, item.value);
			data[item.name] = item.value;
		}
		if(item.name == "minval") {
			data["offset"] = [];
			data["offset"].push(item.value);
		}
	});

	var keys = "";
	data["data_key"] = {};
	// console.log(data["key"])
	// if((typeof(data["key"]) == "object" || Array.isArray(data["key"])) && data["key"].length > 1) {
	// 	for(i in data["key"]) {
	// 		keys = keys + data["key"][i] + ",";
	// 		data["data_key"][data["key"][i]] = {"sub_title" : data["sub_title"][i], "unit" : data["unit"][i], "color" : data["offset_color"][i]}

	// 	}
	// 	keys = keys.substring(0, keys.length-1)
	// }
	// else {
	// 	keys = data["key"];
	// 	data["data_key"][data["key"]] = {"sub_title" : data["sub_title"], "unit" : data["unit"], "color" : data["offset_color"][0]}
	// }
	// console.log(data);
	if(data["type"]=="led"){

		if((typeof(data["key"]) == "object" || Array.isArray(data["key"])) && data["key"].length > 1) {
		for(i in data["key"]) {
			keys = keys + data["key"][i] + ",";
			data["data_key"][data["key"][i]] = {"sub_title" : data["sub_title"][i], "unit" : data["unit"][i], "color" : "#ffffff"}

		}
		keys = keys.substring(0, keys.length-1)
		}
		else {
			keys = data["key"];
			data["data_key"][data["key"]] = {"sub_title" : data["sub_title"], "unit" : data["unit"], "color" : "#ffffff"}
		}
	}
	else{
		if((typeof(data["key"]) == "object" || Array.isArray(data["key"])) && data["key"].length > 1) {
			for(i in data["key"]) {
				keys = keys + data["key"][i] + ",";
				data["data_key"][data["key"][i]] = {"sub_title" : data["sub_title"][i], "unit" : data["unit"][i], "color" : data["offset_color"][i]}

			}
			keys = keys.substring(0, keys.length-1)
		}
		else {
			keys = data["key"];
			if (data["type"]=="switch"){
				data["data_key"][data["key"]] = {"sub_title" : data["sub_title"]||"", "unit" : data["unit"]||"", "color" : "#ffffff"}			
			}else{
				// console.log(data["offset_color"][0]);
				data["data_key"][data["key"]] = {"sub_title" : data["sub_title"]||"", "unit" : data["unit"]||"", "color" : data["offset_color"][0]||"#ffffff"}
			}
		}
	}

	var d_o = []
	data["widget_offset"] = {}
	for(off in data["offset"]) {
		if(data["offset"][off]) {
			d_o.push(data["offset"][off]);
			data["widget_offset"][data["offset"][off]] = {"sub_title" : data["sub_title"][off], "color" : data["offset_color"][off]}
		}
	}
	data["offset"] = d_o.sort();
	data["offset"].sort();
	datum = {}
	datum["widget_id"] = data["widget_id"];
	datum["name"] = data["name"];
	datum["device"] = data["device"];
	datum["topic"] = data["topic"];
	datum["data"] = {};
	datum["key"] = keys
	datum["data"] = JSON.stringify({"keys" : keys, "key" : data["data_key"], "max" : data["maxval"], "min" : data["minval"], "offset" : data["offset"], "sub_topic" : data["sub_topic"], "act_msg" : data["act_msg"], "inact_msg" : data["inact_msg"], "yaxis_val" : data["yaxis_val"], "offset" : data["widget_offset"], "offset_data" : data["offset"], "act_color" : data["act_msg_color"], "inact_color" : data["inact_msg_color"]});
	datum["type"] = data["type"];
	// console.log(datum);
	$.ajax({
		url : "/bwiot/api/v1/widget/edit/",
		method : "POST",
		data : datum,
		success : function(data) {
				var dashboard_id = window.location.hash;
				// console.log((dashboard_id.split("/"))[1])
				getWidgets((dashboard_id.split("/"))[1]);
		}
	});
	
}


function addkey(th){
	$(th).find("i").removeClass("fa-plus");
	$(th).find("i").addClass("fa-minus");
	$(th).parent().parent().parent().append(w_key);
	//$("#w_key").append(w_key);
	$(".w_key").fadeIn(2000);
}

function removeKey(th) {
	$(th).parent().parent().remove();
}

function addOffset(th) {
  $(th).find("i").removeClass("fa-plus");
  $(th).find("i").addClass("fa-minus");
  $(th).parent().parent().parent().append(w_offset);
  // console.log($("#widget-edit-form").find("[name='type']").val());
  //$("#offset").append(w_offset);
	if($("#widget-edit-form").find("[name='type']").val() == "color") {
		$("[name='sub_title']").removeAttr("disabled");
	}
}

function removeOffset(th) {
  $(th).parent().parent().remove();
}

function edit_SubTopic_widget() {
	var data = {};
	data["device_id"] = $("#widget-device-edit").val();
    $.ajax({
        method: "GET",
        data : data,
        url: "/bwiot/api/v1/device/subscribe_topic/",
        success: function (result) {
        	if(result["status"] == "Success"){
				$("#edit-widget-subtopic").empty();
	            for (i = 0; i < result.active_subscription.length; i++) {
	                $('#edit-widget-subtopic').append(new Option(result.active_subscription[i]["topic"], result.active_subscription[i]["topic"], false, false));
	            }
        	}else{
        		console.log("no sub topics");
        	}
            
        }
    });
}