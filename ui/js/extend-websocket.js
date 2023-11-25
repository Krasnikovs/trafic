function wsConnection() {
	if (location.protocol == 'https:') {
		var ws = "wss://" + window.location.hostname + ":8081/ws"
	}
	else {
		var ws = "ws://" + window.location.hostname + ":8081/ws"
	}

	socket = new WebSocket(ws);

	socket.onmessage = function (e) {
		// console.log(e.data, typeof(e.data))
		data = JSON.parse(e.data);
		
		var time = dateString(data["time"]);
		console.log(data["work"]"****extend_ws*****")
		switch(data["work"]) {
			case "agg" :
				updateWidgets(data["id"], data["topic"], data["msg"], time)
				break;
		}
	}

	socket.onclose = function(e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(function() {
			wsConnection();
		}, 1000);
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

wsConnection();