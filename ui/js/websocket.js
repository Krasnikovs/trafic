function websocket() {
	if (location.protocol == 'https:') {
		var ws = "wss://" + window.location.hostname + ":" + wsport + "/ws"
	}
	else {
		var ws = "ws://" + window.location.hostname + ":" + wsport + "/ws"
	}
	socket = new WebSocket(ws);

	socket.onmessage = function (e) {

		data = JSON.parse(e.data);
		var time = dateString(data["time"]);

		if(window.location.pathname.split("/")[1] == "dashboard") {
			updateWidgets(dataVerifier(data["id"]), dataVerifier(data["topic"]), data["msg"],time);
		}
		else {
			switch(data["work"]) {
				case "recv_pub" :
					pageData(window.location.hash, dataVerifier(data["id"]), dataVerifier(data["topic"]), data["msg"], time, data["work"], data["qos"],null);
					break;
				case "send" :
					pageData(window.location.hash, dataVerifier(data["id"]), dataVerifier(data["topic"]), dataVerifier(data["msg"]), time, data["work"], data["qos"],null);
					break;
				case "errorlog" :
					pageData(window.location.hash, dataVerifier(data["clientid"]), data["ip"], data["error"], time, data["work"], null,null);
					break;
				case "connect" :
					pageData(window.location.hash, dataVerifier(data["id"]), data["ipaddr"], data["name"], time, data["work"], null,data["cleansession"]);
					break;
				case "disconnect" :
					pageData(window.location.hash, dataVerifier(data["id"]), data["ipaddr"], data["name"], time, data["work"], null,data["cleansession"]);
					break;
				case "onsubscribe":
					pageData(window.location.hash, dataVerifier(data["id"]), dataVerifier(data["topic_name"]), data["msg"], time, data["work"], data["qos"],null);
					break;
			}
		}
	}

	socket.onclose = function(e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(function() {
			wsConnection();
		}, 1000);
	}
}


function pageData(page, device, topic, msg, time, type, qos, cleansession) {
	var dashboard_id = window.location.hash.split("/")
	if(dashboard_id.length > 1) {
		page = "#page-widget";
	}
	switch(page) {
		case "#" :
			dashboardRealTimeDataRender(type, device, topic, msg, time);
			break;
		case "#page-device" :
			deviceListDataRender(type, device, topic, msg, time,cleansession);
			break;
		case "#page-single-device" :
			if(device == current_device_id) {
				deviceDataRender(type, device, topic, msg, time, qos);
			}
			break;
		case "#page-topic" :
			break;
		case "#page-topic1" :
			updatepubsubtopic(type, device, topic, msg, time,qos);
			break;
		case "#page-widget" :
			updateWidgets(device, topic, msg, time)
			break;
		default :
			dashboardRealTimeDataRender(type, device, topic, msg, time);
			break;
	}
}

function dateString(timestamp) {
	var time = new Date().toString().slice(4, 25);
	if(String(timestamp).length == 10) {
		if(new Date().setHours(0,0,0,0) == new Date(timestamp * 1000).setHours(0,0,0,0)) {
			time = "Today " + new Date(timestamp * 1000).toString().slice(15, 25)
		}
		else if(new Date().setHours(0,0,0,0) - (24 * 60 * 60 * 1000) == new Date(timestamp * 1000).setHours(0,0,0,0)) {
			time = "Yesterday " + new Date(timestamp * 1000).toString().slice(15, 25);
		}
		else {
			time = new Date(timestamp * 1000).toString().slice(4, 25);
		}
	}
	else {
		if(new Date().setHours(0,0,0,0) == new Date(timestamp).setHours(0,0,0,0)) {
			time = "Today " + new Date(timestamp).toString().slice(16, 25)
		}
		else if((new Date().setHours(0,0,0,0) + (48 * 60 * 60 * 1000)) == new Date(timestamp).setHours(0,0,0,0)) {
			time = "Yesterday " + new Date(timestamp).toString().slice(16, 25);
		}
		else {
			time = new Date(timestamp).toString().slice(4, 25);
		}
	}
	return time;
}


function dataVerifier(msg) {
	if(msg == null) {
		return ''
	}
	return msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

websocket();