var rule_pages = 1;
var rule_page = 1;
$( function() {
	$( ".hasDatepicker" ).datepicker();
});
function ruleTypeChange() {
	var rule_type = $("#rule-type").val();
	$("#rule-inputs").html($("#" + rule_type).html());
}

function getRules() {
	var data = {};
	$("#sub_nav").css("display",'none');
	data["page"] = rule_page;
	$.ajax({
		url : "/bwiot/api/v1/ruleengine/",
		type : "GET",
		data : data,
		success : function(result) {
			if(result["status"] == "Success") {
				rule_pages = result["pages"];
				var html = ""
				for(i in result["rules"]) {
					if((result["rules"][i]["ruleType"]>70 && result["rules"][i]["ruleType"]<75) || (result["rules"][i]["ruleType"]>80 && result["rules"][i]["ruleType"] < 85) || result["rules"][i]["ruleType"]==2) {
						result["rules"][i]["action"]["forwardingmsg"] = "Send as receive"
					}
					//console.log(result["rules"][i]["condition"]["publishedtopic"]);
					if(result["rules"][i]["ruleType"] < 3) {
						html += "<tr><td>Client-Topic</td><td><label>Publisher : </label>" + result["rules"][i]["condition"]["publisher"];
						html += "<br><label>Publish Topic : </label>" + result["rules"][i]["condition"]["publishedtopic"];
						html += "</td><td><label>Forwarding Topic : </label>" + result["rules"][i]["action"]["forwardingtopic"];
					}
					else if(result["rules"][i]["ruleType"] < 7 || (result["rules"][i]["ruleType"]>70 && result["rules"][i]["ruleType"]<75)) {
						html += "<tr><td>Topic-Message</td><td><label>Publish Topic : </label>" + result["rules"][i]["condition"]["publishedtopic"];
						html += "<br><label>published message : </label>" + result["rules"][i]["condition"]["publishedmsg"];
						if(result["rules"][i]["ruleType"]==3){
							html += "<br><label>condition : = </label>"
						}
						else if(result["rules"][i]["ruleType"]==4){
							html += "<br><label>condition : != </label>"
						}
						else if(result["rules"][i]["ruleType"]==5){
							html += "<br><label>condition : < </label>"
						}
						else if(result["rules"][i]["ruleType"]==6){
							html += "<br><label>condition : > </label>"
						}	
						html += "</td><td><label>Forwarding Topic : </label>" + result["rules"][i]["action"]["forwardingtopic"];

					}
					else if(result["rules"][i]["ruleType"] < 12 || (result["rules"][i]["ruleType"]>80 && result["rules"][i]["ruleType"] < 85) ) {
						html += "<tr><td>Client-Topic-Message</td><td><label>Publisher : </label>" + result["rules"][i]["condition"]["publisher"];
						html += "<br><label>Publish Topic : </label>" + result["rules"][i]["condition"]["publishedtopic"];						
						html += "<br><label>published message : </label>" + result["rules"][i]["condition"]["publishedmsg"];
						if(result["rules"][i]["ruleType"]==8){
							html += "<br><label>condition : = </label>"
						}
						else if(result["rules"][i]["ruleType"]==9){
							html += "<br><label>condition : != </label>"
						}
						else if(result["rules"][i]["ruleType"]==10){
							html += "<br><label>condition : < </label>"
						}
						else if(result["rules"][i]["ruleType"]==11){
							html += "<br><label>condition : > </label>"
						}
						html += "</td><td><label>Forwarding Topic : </label>" + result["rules"][i]["action"]["forwardingtopic"];

					}
					else if(result["rules"][i]["ruleType"] == 50) {
						html += "<tr><td>Timer</td><td><label>Publisher : </label>" + result["rules"][i]["condition"]["publisher"];
						html += "<br><label>Publish Topic : </label>" + result["rules"][i]["condition"]["topic"];
						//html += "</td><td><label>Date : </label>" + result["rules"][i]["condition"]["date"];
						html += "</td><td><label>Start Date : </label>" + result["rules"][i]["condition"]["start_date"];
						html += "&nbsp;&nbsp;<label>End Date : </label>" + result["rules"][i]["condition"]["end_date"];
						html += "<br><label>Day Of Week : </label>" + result["rules"][i]["condition"]["day_of_week"];
						html += "&nbsp;&nbsp;<label>Hour : </label>" + result["rules"][i]["condition"]["hour"];
						html += "&nbsp;&nbsp;<label>minute : </label>" + result["rules"][i]["condition"]["minute"];
					}
					/*else if(result["rules"][i]["ruleType"] == 19) {
						html += "<tr><td>Timer</td><td><label>Publisher : </label>" + result["rules"][i]["condition"]["publisher"];
						html += "<br><label>Publish Topic : </label>" + result["rules"][i]["condition"]["topic"];
						html += "</td><td><label>Start Date : </label>" + result["rules"][i]["condition"]["start_date"];
						html += "&nbsp;&nbsp;<label>End Date : </label>" + result["rules"][i]["condition"]["end_date"];
					}
					else if(result["rules"][i]["ruleType"] == 20) {
						html += "<tr><td>Timer</td><td><label>Publisher : </label>" + result["rules"][i]["condition"]["publisher"];
						html += "<br><label>Publish Topic : </label>" + result["rules"][i]["condition"]["topic"];
						html += "</td><td><label>Day of the week : </label>" + result["rules"][i]["condition"]["day_of_week"];
					}*/
					if(result["rules"][i]["ruleType"] == 50) {
						html += "<br><label>Forward Message : </label>" + result["rules"][i]["condition"]["msg"];
					}
					else if(result["rules"][i]["action"] != "") {
						html += "<br><label>Forward Message : </label>" + result["rules"][i]["action"]["forwardingmsg"];
					}
					else {
						html += "<br><label>Forward Message : </label>Send as Receive";
					}
					html += "</td><td><i class='fa fa-times text-danger' onclick='deleteRule("+ result["rules"][i]["id"] +")'></i></td></tr>";
				}
				$("#rule-table").html(html);
			}
			else if (result["status"] == "Failed") 
           {
                   //alert("failed...")
                   $(".page-rule").hide();
                   $(".page-plan-update").show();
           }

		}
	})
}

function changeRuleEnginePage(n) {
	if(rule_page + n <= rule_pages && rule_page +n >= 1) {
		rule_page = rule_page + n;
		getRules();
	}
}

function deleteRule(rule_id) {
	var data = {};
	data["rule_id"] = rule_id;
	$.ajax({
		url : "/bwiot/api/v1/ruleengine/delete/",
		type  : "POST",
		data : data,
		success : function(result) {
			if(result["status"] == "Success") {
				getRules();
			}
		}
	})
}

function checkSAR(th) {
	if($(th).is(":checked")) {
		$(th).parent().parent().parent().find(".send_as_recv").val("SEND AS RECEIVE");
	}
	else {
		$(th).parent().parent().parent().find(".send_as_recv").val("");
	}
	alert($(th).parent().parent().parent().find(".send_as_recv").val());
}

function createRule() {
	var data = {}
	$("#rule-form").serializeArray().map(function(item) {
		if ( data[item.name] ) {
			if ( typeof(data[item.name]) === "string" ) {
				data[item.name] = [data[item.name]];
			}
			data[item.name].push(item.value);
			}
		else {
			data[item.name] = item.value;
		}
	});

	var datum = {};
	/*if("send_as_recv" in data) {
		datum["rule_type"] = parseInt(data["type"]) + 1;
		data["forwardingmsg"] = "";
	}
	else {
		datum["rule_type"] = parseInt(data["type"]);
	}*/
	//console.log(data["type"], typeof(data["type"]))
	if(parseInt(data["type"]) < 3) {
		if("send_as_recv" in data) {
		datum["rule_type"] = parseInt(data["type"]) + 1;
		data["forwardingmsg"] = "";
		}
		else {
			datum["rule_type"] = parseInt(data["type"]);
		}
		datum["condition"] = JSON.stringify({"publisher" : data["publisher"], "publishedtopic" : data["publishedtopic"]});
		datum["action"] = JSON.stringify({"forwardingtopic" : data["forwardingtopic"], "forwardingmsg" : data["forwardingmsg"]});
	}
	else if(parseInt(data["type"]) < 7) {
		if("send_as_recv" in data) {
		datum["rule_type"] = parseInt(data["type"]) + 68;
		data["forwardingmsg"] = "";
		}
		else {
			datum["rule_type"] = parseInt(data["type"]);
		}
		/*alert("knldkjsnn")*/
		datum["condition"] = JSON.stringify({"publisher" : data["publisher"], "publishedtopic" : data["publishedtopic"], "publishedmsg" : data["publishedmsg"]});
		datum["action"] = JSON.stringify({"forwardingtopic" : data["forwardingtopic"], "forwardingmsg" : data["forwardingmsg"]});
	}
	else if(parseInt(data["type"]) < 12) {
		if("send_as_recv" in data) {
		datum["rule_type"] = parseInt(data["type"]) + 73;
		data["forwardingmsg"] = "";
		}
		else {
			datum["rule_type"] = parseInt(data["type"]);
		}
		datum["condition"] = JSON.stringify({"publisher" : data["publisher"], "publishedtopic" : data["publishedtopic"], "publishedmsg" : data["publishedmsg"]});
		datum["action"] = JSON.stringify({"forwardingtopic" : data["forwardingtopic"], "forwardingmsg" : data["forwardingmsg"]});
	}
	else {
		datum["rule_type"] = 50;
		if(parseInt(data["type"]) == 18) {
			data["start_date"] = data["date_text"]
			data["end_date"] = data["date_text"]
			data["day_of_week"] = "*"
		}
		else if(parseInt(data["type"]) == 19) {
			data["day_of_week"] = "*"
		}
		else if(parseInt(data["type"]) == 20) {
			data["start_date"] = "*"
			data["end_date"] = "*"

			var j = 0;
			if(Array.isArray(data["day_of_week"])) {
				day_week = ""
				for(i in data["day_of_week"]) {
					day_week += [i];
					// console.log(data["day_of_week"].length, i)
					if(data["day_of_week"].length > ++j) {
						day_week += ",";
					}
				}
				data["day_of_week"] = day_week;
			}
			//data["day_of_week"] = 
		}
		datum["condition"] = JSON.stringify({"publisher": data["publisher"], "topic":data["topic"], "msg": data["msg"], "hour":data["hr"], "minute":data["min"], "start_date":data["start_date"], "end_date":data["end_date"], "day_of_week":data["day_of_week"]})
		datum["action"] = JSON.stringify({"username":""})
	}
	/*else if (parseInt(data["type"]) == 18 ) {
		datum["condition"] = JSON.stringify({"publisher":data["publisher"], "topic":data["topic"], "hour":data["hr"], "minute":data["min"], "date":data["date_text"]});
		datum["action"] = JSON.stringify({"forwardingmsg":data["forwardingmsg"]}); 
	}
	else if (parseInt(data["type"]) == 19) {
		datum["condition"] = JSON.stringify({"publisher":data["publisher"], "topic":data["topic"], "hour":data["hr"], "minute":data["min"], "start_date":data["start_date"], "end_date":data["end_date"]});
		datum["action"] = JSON.stringify({"forwardingmsg":data["forwardingmsg"]}); 
	}
	else if (parseInt(data["type"]) == 20) {
		datum["condition"] = JSON.stringify({"publisher":data["publisher"], "topic":data["topic"], "hour":data["hr"], "minute":data["min"],"day_of_week":data["day_of_week"]});
		datum["action"] = JSON.stringify({"forwardingmsg":data["forwardingmsg"]}); 
	}*/
	// console.log(datum);
	$.ajax({
		url : "/bwiot/api/v1/ruleengine/",
		type : "POST",
		data : datum,
		success : function(result) {
			if(result["status"] == "Success") {
				getRules();
				$(".modal").modal("hide");
			}
			else
			{
				alert(result['reason']);
								$(".modal").modal("hide");

			}
		}
	})
}

function daySelector(th) {
	if($(th).is(":checked")) {
		$(th).parent().find("input").attr("checked", "true");
	}
	else {
		$(th).parent().find("input").removeAttr("checked");
	}
}

function fnschedule(val)
{
	var schedule_rule = val;
    if(schedule_rule==="18") {
		document.getElementById('date_div').style.display='block';
		document.getElementById('from_div').style.display='none';
		document.getElementById('to_div').style.display='none';
		document.getElementById('week_div').style.display='none';
    }
    else if (schedule_rule==="19") {
		document.getElementById('date_div').style.display='none';
		document.getElementById('from_div').style.display='block';
		document.getElementById('to_div').style.display='block';
		document.getElementById('week_div').style.display='none';
    } 
    else if (schedule_rule==="20") {
		document.getElementById('date_div').style.display='none';
		document.getElementById('from_div').style.display='none';
		document.getElementById('to_div').style.display='none';
		document.getElementById('week_div').style.display='block';
    }   
   	  
}


	


