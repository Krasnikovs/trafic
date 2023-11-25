var error_log_pages = 1;
var error_log_page = 1;
function getErrorLog() {
	var data = {};
	data["page"] = error_log_page;
	$.ajax({
		url : "/bwiot/api/v1/errorlog/",
		data : data,
		type : "GET",
		success : function(result) {
			var html = "";
			if(result["status"] == "Success") {
				error_log_pages = result["page"]
				for(i in result["errors"]) {
					html += "<tr><td>"
					html += result["errors"][i]["client_id"] + "</td><td>"
					html += result["errors"][i]["details"] + "</td><td>"
					html += result["errors"][i]["ip"] + "</td><td>"
					html += dateString(result["errors"][i]["time"]) + "</td></tr>";
				}
				$("#error-log-table").html(html);
			}
		}
	})
}

function changeErrorLogPage(n) {
	if(error_log_page + n <= error_log_pages && error_log_page + n >= 1) {
		error_log_page = error_log_page + n
		getErrorLog();
	}
}