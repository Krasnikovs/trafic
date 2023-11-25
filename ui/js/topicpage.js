var topicOffset = 0;
var topicCount = 0;
var currentTopicId = 1;
var currentTopicName = "";
var publisherOffset = 0;
var publisherCount = 0;
var publisherStatus = 2;
var subscriberOffset = 0;
var subscriberCount = 0;
var subscriberStatus = 2;
var searchTopicContent = "";

function currentTopicIdModifier(id, name, th) {
	/*$(".topic-list").attr("style", 'background-color: white;');
	$(th).parent().attr("style", 'background-color: #ecf0f5;');
	$(".pub-status").attr("style", "background-color: white");
	$("#all-pub").attr("style", "background-color: #ecf0f5");
	$(".sub-status").attr("style", "background-color: white");
	$("#all-sub").attr("style", "background-color: #ecf0f5");*/
	publisherOffset = 0;
	publisherCount = 0;
	publisherStatus = 2;
	currentTopicId = id;
	currentTopicName = name;
	$("#selected-topic").text($(th).text());
	offsetSetter(1, 1);
	offsetSetter(2, 1);
	getTopicMessageCount();
}

function publisherStatusModifier(n, th) {
	/*$(".pub-status").attr("style", "background-color: white");
	$(th).attr("style", "background-color: #ecf0f5");*/
	publisherOffset = 0;
	publisherCount = 0;
	publisherStatus = n;
	offsetSetter(1, 1);
}

function subscriberStatusModifier(n, th) {
	/*$(".sub-status").attr("style", "background-color: white");
	$(th).attr("style", "background-color: #ecf0f5");*/
	subscriberOffset = 0;
	subscriberCount = 0;
	subscriberStatus = n;
	offsetSetter(2, 1);
}

function getTopicList(data) {
	var data = {}
	data["offset"] = topicOffset;
	data["searchCont"] = searchTopicContent;
	$.ajax({
		url : "/getTopicList",
		type : "GET",
		data : data,
		async : false,
		success : function(data) {
			var html = "";
			topicCount = data["topicCount"];
			if(data.data.length > 0) {
				currentTopicId = data.data[0]["id"];
				currentTopicName = data.data[0]["name"];
				$("#selected-topic").text(data.data[0]["name"]);
			}
			for(var i = 0; i < data.data.length; i++) {
				if(i ==0) {
					html += "<li class='mt-2 nav-item topic-list'><a style='cursor:pointer' onclick=currentTopicIdModifier("+data.data[i]["id"] + ",'" + data.data[i]["name"]+"',this)>"+data.data[i]["name"]+"</a></li>";
				}
				else {
					html += "<li class='mt-2 nav-item topic-list'><a style=cursor:pointer onclick=currentTopicIdModifier("+data.data[i]["id"]+ ",'" + data.data[i]["name"]+"',this)>"+data.data[i]["name"]+"</a></li>";
				}
			}
			//console.log(html);
			$("#topic-list").html(html);
		}
	});
}

function getTopicMessageCount() {
	data = {}
	data["topicName"] = currentTopicName;
	data["topicId"] = currentTopicId;
	$.ajax({
		url : "/getTopicMessageCount",
		type : "GET",
		data : data,
		async : false,
		success : function(data) {
			$("#topic-pub-msg-cnt").text(data["recvMsgCnt"]);
			$("#topic-pub-hr-msg-cnt").text(data["recvHrMsgCnt"]);
			/*$("#topic-sub-msg-cnt").text(data["sentMsgCnt"]);
			$("#topic-sub-hr-msg-cnt").text(data["sentHrMsgCount"]);*/
		}
	});
}

function getTopicPublisher(topicId) {
	data = {};
	data["topicName"] = currentTopicName;
	data["topicId"] = topicId;
	data["offset"] = publisherOffset;
	data["status"] = publisherStatus;
	$.ajax({
		url : "/getTopicPublisher",
		type : "GET",
		data : data,
		async : false,
		success : function(data) {
			publisherCount = data["count"];
			var html = "";
			for(var i = 0; i < data.data.length; i++) {
				html += "<tr><td>"+data.data[i]["id"]+"</td><td>"+data.data[i]["ip"]+"</td><td>"+data.data[i]["status"]+"</td><td>"+ new Date(data.data[i]["time"]).toString().slice(0, 25) +"</td></tr>";
			}
			$("#pub-dev").html(html);
		}
	});
}

function getTopicSubscriber(topicId) {
	data = {}
	data["topicName"] = currentTopicName;
	data["topicId"] = topicId;
	data["offset"] = subscriberOffset;
	data["status"] = subscriberStatus;
	console.log(data);
	$.ajax({
		url : "/getTopicSubscriber",
		type : "GET",
		data : data,
		async : false,
		success : function(data)  {
			// console.log(data);
			subscriberCount = data["count"];
			var html = "";
			for(var i = 0; i < data.data.length; i++) {
				html += "<tr><td>"+data.data[i]["id"]+"</td><td>"+data.data[i]["ip"]+"</td><td>"+data.data[i]["status"]+"</td><td>"+ new Date(data.data[i]["time"]).toString().slice(0,25) +"</td></tr>";
			}
			$("#sub-dev").html(html);
		}
	});
}

function offsetSetter(type, page) {
	totalPage = 0;
	if(type == 0) {
		topicOffset = (page - 1) * 10;
		getTopicList();
		totalPage = parseInt(topicCount / 10);
		if((topicCount % 10) != 0) {
			totalPage += 1;
		}
		if(totalPage == 0) {
			totalPage = 1;
		}
		html = setPagination(totalPage, page, type);
		$("#topic-pagination").html(html);
	}
	else if(type == 1) {
		publisherOffset = (page - 1) * 10;
		getTopicPublisher(currentTopicId);
		totalPage = parseInt(publisherCount / 10);
		if((publisherCount % 10) != 0) {
			totalPage += 1;
		}
		if(totalPage == 0) {
			totalPage = 1;
		}
		html = setPagination(totalPage, page, type);
		$("#topic-pub-pagi").html(html);
	}
	else if(type == 2) {
		subscriberOffset = (page - 1) * 10;
		getTopicSubscriber(currentTopicId);
		totalPage = parseInt(subscriberCount / 10);
		if((subscriberCount % 10) != 0) {
			totalPage += 1;
		}
		if(totalPage == 0) {
			totalPage = 1;
		}
		html = setPagination(totalPage, page, type);
		$("#topic-sub-pagi").html(html);
	}
}

function setPagination(totalPage, page, type) {
	if(type == 0) {
		offsetSetter(1, 1);
		offsetSetter(2, 1);
	}
	startPage = 1;
	endPage = totalPage
	if(page > 1) {
		startPage = page - 1;
	}
	if(page < totalPage) {
		endPage = page + 1;
	}
	if(page == 1 && page == totalPage ) {
		startPage = 1;
		endPage = 1
	}
	else if(totalPage > page && page > 1) {
		startPage = page - 1;
		endPage = page + 1;
	}
	html = "";
	html= '<li class="page-item"><a class="page-link" style=cursor:pointer onclick="offsetSetter('+type+','+1+')">«</a></li>'
	for(var i = startPage; i<= endPage; i++) {
		html += '<li class="page-item"><a class="page-link" style=cursor:pointer onclick="offsetSetter('+type+','+i+')">'+i+'</a></li>'
	}
	html += '<li class="page-item"><a class="page-link" style=cursor:pointer onclick="offsetSetter('+type+','+totalPage+')">»</a></li>'
	return html
}

function searchTopic(id) {
	if(id == "search-topic") {
		$("#search-topic").attr("style", "display: none");
		$("#topic-search-cont").attr("style", "display: block");
	}
	else {
		$("#search-topic").attr("style", "display: block");
		$("#topic-search-cont").attr("style", "display: none");
	}
}

function showSearchedTopic(th) {
	searchTopicContent = $("#search-text").val();
	offsetSetter(0, 1);
	//searchTopic($(th).id);
}

function autoRefresh() {
	getTopicMessageCount();
	p = parseInt(publisherOffset /10) + 1
	offsetSetter(1, p);
	p = parseInt(subscriberOffset /10) + 1
	offsetSetter(2, p);
}
function getTopiccountFromDb() {
	$.ajax({
		url: '/graph/topic_count',
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			console.log(msg);
			var obj=JSON.parse(msg);
			var key;
			var msgratecnt=0;
			var msgkey=[]
			var msgrate=0;
			var ntopic=document.getElementById("active_topic");
			for (var key in obj) {
				ntopic.innerHTML=obj[key][1]+"";
			}
		},
		error: function () {}
	});
}
/*window.setInterval(function(){
		getTopiccountFromDb();
  autoRefresh();
}, 5000);*/