var deviceClk=0;
var elt;
var addclk=0;
var devid=0;
var editflag;
var s="";
var id="0";
var pubclk=0;
var deveditflag=10;
var dev_cnt=1;
var dev_key=[];
var activedev_key=[]
var activedev_cnt=1;
var next_clk=0;
var rem_clk=0;
var nd=0;
var lastset=0;
var devtab=0;
var next_log_clk=0;
var lgrownumber=1;
var broker_start_time=0;
var logcount=0;
var pubcount=0;
var subcount=0;
var addrule=0;
var ruleselected=1;
var top=80;
var loglastset=0;
var clientcount=0;
var picker=0;
var startDate=new Date();
var endDate=new Date();
var mon=false,tue=false,wed=false,thu=false,fri=false,sat=false,sun=false;


$(document).ready(function(){

	$( "form" ).submit(function( event ) {
		event.preventDefault();
	});
	var errorlog_cnt = 0;
	checkCookie();
    $('.tab-pane .next-step').click(function(){
      $('.form-info').hide();
      $('.tab-pane').hide();
      $('.wizard li').removeClass("active");
      var value=$(this).data('value');
      $('#'+value).show();
      $('.'+value).show();
      $('.'+value).addClass("active");
      $('.'+value).removeClass("disabled");
    });
    
    $('.tab-pane .prev-step').click(function(){
      $('.form-info').hide();
      $('.wizard li').removeClass("active");
      $('.tab-pane').hide();
      var value=$(this).data('value');
      $('#'+value).show();
      $('.'+value).show();
      $('.'+value).addClass("active");
    });
    getDashboard();
    getErrorLog();
	getuserdetails();
	WebSocketPush();
	var input = document.getElementById("device_search");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("search_len").click();
    }
});

	$.ajax({
		url: '/client/count?curr_time='+new Date().getTime(),
		type: "GET",
		dataType: "text",
		async:false,
		success: function (msg) {
			var obj=JSON.parse(msg);
			clientcount=obj[1];
		},
		error: function () {
			//ErrorFunction();
		}
	});
var devtrack=document.getElementById("dev_track");
devtrack.innerHTML="";
if (clientcount>10)
{
//var n=parseInt(clientcount/10)+1;
var n=parseInt(clientcount/10);
if(parseInt(clientcount%10) > 0) {
	n = n + 1;
}
var i=0;
while (i<n)
{
	if (i==0)
	{
		devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a class=example  style=cursor:pointer;  id=firsti name=firsti onclick=setnextclk("+i+",id)>&laquo;</a></li>";	
		devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example style=cursor:pointer;background-color:#ecf0f5  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";
	}
	else
		devtrack.innerHTML=devtrack.innerHTML+"<li class=dev"+i+"><a  class=example style=cursor:pointer  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";


	i=i+1;
	if (i>4)
		break;
}
		devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";	
}
else
{
	devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=firsti name=firsti onclick=setnextclk(0,id)>&laquo;</a></li>";
	devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=1 name=1 onclick=setnextclk(0,id)>1</a></li>";
	devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";				
}
{
var list_size=$('#dev_track li').size();
var rec_count_start=0;
var rec_count_end=rec_count_start+12;
if (rec_count_start==0)
{
$('#dev_track li:gt(-1)').show();
var x=(5 <= list_size) ? 5 : list_size;
$('#dev_track li:lt('+(x+1)+')').show();
$('#dev_track li:gt('+x+')').hide();
$('#dev_track li:gt('+(list_size-2)+')').show();
}
else
{
$('#dev_track li:lt('+(rec_count_start+1)+')').hide();
$('#dev_track li:gt('+rec_count_start+')').show();
}
}

	if (document.getElementById("ruletab").value=="1") {
		getRuleEngine();
		document.getElementById("ruletab").value=="1";
	}
	if (document.getElementById("devtab").value=="0") {
		getDashboard();
		//WebSocketPush();
		document.getElementById("devtab").value="1";
	}
	document.getElementById("alldev").style.color="#FA0000";
	//adddevices()
	setnextclk(0);
	//nxtpre(0)
	var dname=document.getElementById("d_name").value;
	/*if($("#device li").size() > 0) {
		disp_detail(first);
	}
	else if($("#d_name").val() == "") {
		disp_detail(dname);
	}*/
	getRuleEngine();

});


	$("#rule_cancel").click(function(event){
		document.getElementById("editdialog").style.display="none";
		$("#editdialog").dialog("close");
		document.getElementById("pubd1").style.display="none";
		document.getElementById("dialog_wrapper").style.display="none";
	});


	$(".detail").hover(function(event){
			$(this).css("cursor","pointer");
		},
		function() {
	});


	$(".editdb").hover(function(event){
		$(this).css("cursor","pointer");
		},
		function()
		{
	});

	$(".dropdb").hover(function(event){
		$(this).css("cursor","pointer");
		},
		function()
		{
	});

	$(".detail").click(function(event){
		var xdetail=document.getElementsByClassName("detail");
		var xd;
		for(xd=0;xd<xdetail.length;xd++) {
			xdetail[xd].style.backgroundColor="#222d32";
			xdetail[xd].style.border="none";
			xdetail[xd].style.color="#b8c7ce";
		}
		dev_id=($(event.target).attr('id'));
		id=dev_id.substring(6);
		disp_detail(id);
	});

	$(".example").click(function(event){
		var xdetail=document.getElementsByClassName("example");
		var xd;

		for(xd=0;xd<xdetail.length;xd++) {
			xdetail[xd].style.backgroundColor="#ffffff";
		}

		var devtrack_id=document.getElementById(($(event.target).attr('id')));
		devtrack_id.style.backgroundColor="#ecf0f5";
	});

	$(".pubset").click(function(event){
		var xdetail=document.getElementsByClassName("pubset");
		var xd;
		for(xd=0;xd<xdetail.length;xd++) {
			xdetail[xd].style.backgroundColor="#ffffff";
		}
		var devtrack_id=document.getElementById(($(event.target).attr('id')));
		devtrack_id.style.backgroundColor="#ecf0f5";
	});

	$(".subset").click(function(event){
		var xdetail=document.getElementsByClassName("subset");
		var xd;
		for(xd=0;xd<xdetail.length;xd++){
			xdetail[xd].style.backgroundColor="#ffffff";
		}
		var devtrack_id=document.getElementById(($(event.target).attr('id')));
		devtrack_id.style.backgroundColor="#ecf0f5";
	});

	$(".logset").click(function(event){
		var xdetail=document.getElementsByClassName("logset");
		var xd;
		for(xd=0;xd<xdetail.length;xd++) {
			xdetail[xd].style.backgroundColor="#ffffff";
		}
		var xdetaillast=document.getElementsByClassName("loglastclass");
		xdetaillast[0].style.backgroundColor="#ffffff";
		var devtrack_id=document.getElementById(($(event.target).attr('id')));
		devtrack_id.style.backgroundColor="#ecf0f5";
	});

	function JsonpCallback(json) {
		document.getElementById('#summary').innerHtml=json.result;
	}


	function fnaddpub(id1) {
		if(id1=="pubimg") {
			s="addpub";
		}
		else if(id1=="subimg") {
			s="addsub";
		}
		document.getElementById("pid_txt").value=document.getElementById("d_name").value   

		document.getElementById("editdialog").style.display="block";
		document.getElementById("paid_txt").value="";
		document.getElementById("pubt_txt").value="";
		document.getElementById("pubm_txt").value="";
		document.getElementById("pqos_txt").value="";
		document.getElementById("prtn_txt").value="";

		id=document.getElementById("pid_txt").value;
		document.getElementById("pa").style="display:inline-block";
		document.getElementById("pubd1").style.display="block";
		$( "#editdialog" ).dialog();
	}


	function f1(id) {
		var s="";
		s=id.slice(6);
		var i=parseInt(s);
		document.getElementById("pub_topic").value="topic";
		document.getElementById("pub_msg").value="msg";
		document.getElementById("pub_retain").value="retain";
	}


	function getDashboard() {
		$.ajax({
			url: '/active/publish?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var px=document.getElementById("pub_tbl");
				while(px.rows[1]) px.deleteRow(1);
				var sx=document.getElementById("sub_tbl");
				while(sx.rows[1]) sx.deleteRow(1);
				var cx=document.getElementById("connect_tbl");
				while(cx.rows[1]) cx.deleteRow(1);
				var dx=document.getElementById("disconnect_tbl");
				while(dx.rows[1]) dx.deleteRow(1);
				var mx=document.getElementById("msgrate_tbl");
				while(mx.rows[1]) mx.deleteRow(1);

				var obj=JSON.parse(msg);
				var key;
				var pubactive=1;
				var pubrownumber=1;
				for (key in obj) {
					var pelt_tbl=document.getElementById("pub_tbl");
					var pubrow=pelt_tbl.insertRow(pubrownumber);
				  
					pubrownumber=pubrownumber+1;
					for (var pj=0;pj<4;pj++) {
						if(pj ==3) {
				   			m_data = timeConverter(obj[key][pj]);
				   		}
						else {
							m_data = obj[key][pj];
						}
						if (obj[key][pj]=="0") {
							pubactive=0;
							break;
						}
						var pcell1=pubrow.insertCell(pj);
						pcell1.innerHTML=m_data;//obj[key][pj];
						pcell1.style.fontWeight="normal";
						pcell1.style.textAlign="left";
						pcell1.style.wordBreak = "break-all";
						if ((pj==0) || (pj==3))
							pcell1.style.width = "15%";
						else if (pj==1)
							pcell1.style.width = "25%";
					}
				}
				if (pubactive==0) {
					var pelt_tbl=document.getElementById("pub_tbl");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="4";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="NO PUBLISHED MESSAGES";
				}
			},
			error: function () { }
		});


		/*$.ajax({
			url: '/active/subscribe?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var obj=JSON.parse(msg);
				var key;
				var pubrownumber=1;
				var active=1;
				for (key in obj) {
					var pelt_tbl=document.getElementById("sub_tbl");
					var pubrow=pelt_tbl.insertRow(pubrownumber);

					pubrownumber=pubrownumber+1;
					for (var pj=0;pj<2;pj++) {
						if(obj[key][pj]=="0") {
							active=0;
							break;
						}
						else {
							var pcell1=pubrow.insertCell(pj);
							pcell1.innerHTML=obj[key][pj];
							pcell1.style.fontWeight="normal";
							pcell1.style.textAlign="left";
						}
					}
				}
				if (active==0) {
					var pelt_tbl=document.getElementById("sub_tbl");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="2";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="NO ACTIVE SUBSCRIBERS";
				}
			},
	    	error: function () {    }
		});*/


		$.ajax({
			url: '/recent/connect?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var obj=JSON.parse(msg);
				var key;
				var rec_con=1;
				var pubrownumber=1;
				var content;
				for (key in obj) {
					var pelt_tbl=document.getElementById("connect_tbl");
					var pubrow=pelt_tbl.insertRow(pubrownumber);
					pubrownumber=pubrownumber+1;
					for (var pj=0;pj<=3;pj++) {
						if(pj != 2) {
						if (obj[key][pj]=="0") {
							rec_con=0;
							break;
						}
						if (pj==1) {
							content=timeConverter(obj[key][pj]);
						}
						else {
							content=obj[key][pj];
						}
						if(pj == 3){
							var pcell1=pubrow.insertCell(2);
						}
						else {
							var pcell1=pubrow.insertCell(pj);
						}
						pcell1.innerHTML=content;
						pcell1.style.width="230px";
						pcell1.style.fontWeight="normal";
						pcell1.style.textAlign="left";	
						}
					}
				}
				if (rec_con==0) {
					var pelt_tbl=document.getElementById("connect_tbl");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="3";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="NO CONNECTED CLIENTS";
				}
			},
			error: function () {}
		});


		$.ajax({
			url: '/recent/disconnect?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var obj=JSON.parse(msg);
				var key;
				var rec_dis=1;
				var pubrownumber=1;
				for (key in obj) {
					var pelt_tbl=document.getElementById("disconnect_tbl");
					var pubrow=pelt_tbl.insertRow(pubrownumber);

					pubrownumber=pubrownumber+1;
					for (var pj=0;pj<2;pj++) {
						if (obj[key][pj]=="0") {
							rec_dis=0;
							break;
						}
						var pcell1=pubrow.insertCell(pj);
						if (pj==1) {
							pcell1.innerHTML=timeConverter(obj[key][pj]);
						}
						else {
							pcell1.innerHTML=obj[key][pj];
						}
						pcell1.style.fontWeight="normal";
						pcell1.style.width="230px";
						pcell1.style.textAlign="left";
					}
				}
				if (rec_dis==0) {
					var pelt_tbl=document.getElementById("disconnect_tbl");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="2";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="NO DISCONNECTED CLIENTS";
				}
			},
			error: function () {    }
		});


		$.ajax({
			url: '/graph/message?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var obj=JSON.parse(msg);
				var key;
				var msgratecnt=0;
				var msgkey=[]
				var msgrate=0;
				for (key in obj) {
					msgkey[msgratecnt]=key;
					msgratecnt++;
					msgrate+=obj[key]["count"];
				}
				var avg_msgrate=parseInt(msgrate/msgratecnt);
				document.getElementById("avg_msg_rate").innerHTML=avg_msgrate;
			},
			error: function () {}
		});


		$.ajax({
			url: '/graph/topic_count?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
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


		$.ajax({
			url: '/ui/graph/client_count?curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:true,
			success: function (msg) {
				var obj=JSON.parse(msg);
				var key;
				var msgratecnt=0;
				var msgkey=[]
				var msgrate=0;
				var ntopic=document.getElementById("active_client");
				ntopic.innerHTML=obj["count"]+"";
			},
			error: function () {  }
		});
	}


function timeConverter(UNIX_timestamp){
	UNIX_timestamp=parseInt(UNIX_timestamp / 1000);
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
	var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
	var hour = a.getHours();
	var ms=a.getMilliseconds();
	var mss=new Date(UNIX_timestamp).getUTCMilliseconds()
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;// + ':' +mss;
	return time;
}


function last_log_disp(id) {
	var xdetail=document.getElementsByClassName("logset");
	var xd;
	for(xd=0;xd<xdetail.length;xd++) {
		xdetail[xd].style.backgroundColor="#ffffff";
	}
	var lastlogtrack=document.getElementById("lastlogi");
	lastlogtrack.style.backgroundColor="#ecf0f5";
	var list_size=$('#log_track li').size();
	next_log_disp(list_size-2, id);
}


function last_pub_disp(pid) {
	var xdetail=document.getElementsByClassName("pubset");
	var xd;
	for(xd=0;xd<xdetail.length;xd++) {
		xdetail[xd].style.backgroundColor="#ffffff";
	}
	var lastpubtrack=document.getElementById("lastpubi");
	lastpubtrack.style.backgroundColor="#ecf0f5";
	var list_size=$('#pub_track li').size();
	next_pub_disp(list_size-2,pid);
}


function last_dev_disp() {
	var xdetail=document.getElementsByClassName("example");
	var xd;
	for(xd=0;xd<xdetail.length;xd++){
		xdetail[xd].style.backgroundColor="#ffffff";
	}
	var lastlogtrack=document.getElementById("lastdevi");
	lastlogtrack.style.backgroundColor="#ecf0f5";
	var list_size=$('#dev_track li').size();
	setnextclk(list_size-2);
}


function next_log_disp(rec_cnt,lid) {
	var loglastset=0;
	var list_size=$('#log_track li').size();
	var rec_count_start=(rec_cnt*12);
	var rec_count_end=rec_count_start+12;
	var xdetail=document.getElementsByClassName("logset");
	var xd;
	for(xd=0;xd<xdetail.length;xd++) {
		xdetail[xd].style.backgroundColor="#ffffff";
	}
	document.getElementById(lid).style.backgroundColor="#ecf0f5";
	if(list_size>7) {
		if ((rec_cnt>=2) && (rec_cnt<(list_size-4))) {
			var showfrom=rec_cnt-2;
			var showto=rec_cnt+4;
			var hideright=rec_cnt+3;
			var hideleft=rec_cnt-1;

			$('#log_track li:gt('+showfrom+')').show();
			$('#log_track li:lt('+showto+')').show();
			$('#log_track li:gt('+hideright+')').hide();
			$('#log_track li:lt('+hideleft+')').hide();
			$('#log_track li:lt(1)').show();
			$('#log_track li').last().show();
		}
	}

	if(rec_cnt == 1){
		$('#log_track li:gt('+1+')').show();
		$('#log_track li:lt('+5+')').show();
		$('#log_track li:gt('+4+')').hide();
	}

	$('#log_track li:lt(1)').show();
	$('#log_track li').last().show();
	id=document.getElementById("d_name").value;
	next_log_clk++;
	var ofval=(rec_cnt-1)*10;
	if (parseInt(ofval)+10 >= logcount) {
		document.getElementById("next_log").style.display="none";
	}
	var u="/singleclient/log/get?a="+id+"&offsetvalue="+ofval+"&curr_time="+new Date().getTime();
	$.ajax({
		url: u,
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			var obj=JSON.parse(msg);
			var px1=document.getElementById("log_table");
			for (var key in obj) {
				if (obj[key][0]=="0")
					return;
			}
			while(px1.rows[1]) px1.deleteRow(1);
				var rownumber=1;
			for (var key in obj) {
				if (rownumber<=10) {
					var row=px1.insertRow(rownumber);
					var c1=0;
					for (var j=0;j<3;j++) {
						var cell1=row.insertCell(c1);
						cell1.style.width="180px";
						cell1.style.textAlign="left";
						cell1.style.fontWeight="normal";
						cell1.style.wordBreak="break-all";
						if (obj[key][j]=="NIL") data=0;
						if (j==0) {
							if (obj[key][j]=="0") {
								data=0;break;
							}
							else {
								cell1.innerHTML=timeConverter(obj[key][j]);
								cell1.value=timeConverter(obj[key][j]);
							}
						}
		/* else if (j==3)
		{
			if (obj[key][j]==0) lg_op="0-Atmost Once";
			else if (obj[key][j]==1) lg_op="1-Atleast Once";

			else if (obj[key][j]==2) lg_op="2-Exactly Once";

			else lg_op=obj[key][j];
			cell1.innerHTML=lg_op;
			cell1.value=lg_op;



		} */
						else {
							cell1.innerHTML=obj[key][j];
							cell1.value=obj[key][j];
						}
						c1=c1+1;
					}
					rownumber=rownumber+1;
					if (rownumber==11)
						break;
				}
			}
			var checkofval=(rec_cnt)*10;
			var u="/singleclient/log/get?a="+id+"&offsetvalue="+checkofval+"&curr_time="+new Date().getTime();
			$.ajax({
				url: u,
				type: "GET",
				dataType: "text",
				async:true,
				success: function (msg) {
					var obj=JSON.parse(msg);
					for (var key in obj) {
						if (obj[key][0]=="0") {
							loglastset=1;
							break;
						}
					}
				},
				error:function() {}
			});

			if (rec_cnt>2) {
				var a=document.getElementsByClassName("log"+(rec_cnt+1));
				if (a.length>0) {
					var xx=0;
				}
				else {
					if (loglastset==0) {
						$("<li class=log"+(rec_cnt+1)+" style=cursor:pointer><a class=logset id=alog"+(rec_cnt+1)+" name=alog"+(rec_cnt+1)+" onclick=next_log_disp("+(rec_cnt+1)+",id)>"+(rec_cnt+1)+"</a></li>").insertAfter("ul li.log"+rec_cnt);
					}
					var list_size=$('#log_track li').size();
					var lastlogtrack=document.getElementById("lastlogi");
					var rec_count_start=(rec_cnt*12);
					var rec_count_end=rec_count_start+12;
					if(list_size>7) {
						if (rec_cnt>4) {
							var showfrom=rec_cnt-3;
							var showto=rec_cnt+1;
							var hideright=rec_cnt+3;
							var hideleft=rec_cnt-1;
							$('#log_track li:gt('+showfrom+')').show();
							$('#log_track li:lt('+showto+')').show();
							$('#log_track li:gt('+showto+')').hide();
							$('#log_track li:lt('+showfrom+')').hide();

							$('#log_track li:lt(1)').show();
							$('#log_track li').last().show();
						}
					}
					$('#log_track li:lt(1)').show();
					$('#log_track li').last().show();
				}
			}
		},
		error:function() {}
	});
}



function next_pub_disp(rec_cnt,pid) {
var publastset=0;
var list_size=$('#pub_track li').size();
var rec_count_start=(rec_cnt*12);
var rec_count_end=rec_count_start+12;
var xdetail=document.getElementsByClassName("pubset");
var xd;
for(xd=0;xd<xdetail.length;xd++)
{
xdetail[xd].style.backgroundColor="#ffffff";
}
var lastpubtrack=document.getElementById("lastpubi");
lastpubtrack.style.backgroundColor="#ffffff";

document.getElementById(pid).style.backgroundColor="#ecf0f5";
if(list_size>7)
{
if ((rec_cnt>=2) && (rec_cnt<(list_size-4)))
{
var showfrom=rec_cnt-2;
var showto=rec_cnt+4;
var hideright=rec_cnt+3;
var hideleft=rec_cnt-1;

$('#pub_track li:gt('+showfrom+')').show();
$('#pub_track li:lt('+showto+')').show();
$('#pub_track li:gt('+hideright+')').hide();
$('#pub_track li:lt('+hideleft+')').hide();
$('#pub_track li:lt(1)').show();
$('#pub_track li').last().show();
}
}

if(rec_cnt == 1) {
	$('#pub_track li:gt('+1+')').show();
	$('#pub_track li:lt('+5+')').show();
	$('#pub_track li:gt('+4+')').hide();
}

$('#pub_track li:lt(1)').show();
$('#pub_track li').last().show();
id=document.getElementById("d_name").value;
//next_log_clk++;
var ofval=(rec_cnt-1)*10;
var u="/singleclient/pub/get?a="+id+"&offsetvalue="+ofval+"&curr_time="+new Date().getTime();
$.ajax({

	url: u,
    type: "GET",
dataType: "text",
    async:true,
     success: function (msg) {
var obj=JSON.parse(msg);
var px1=document.getElementById("pub_table");
while(px1.rows[1]) px1.deleteRow(1);
var rownumber=1;
for (var key in obj)
{
   var row=px1.insertRow(rownumber);
	var c1=0;
   for (var j=1;j<4;j++)
   {
	var cell1=row.insertCell(c1);
	cell1.style.width="180px";
	cell1.style.wordBreak="break-all";
        if (obj[key][j]=="NIL") data=0;
	if (j==3)
	{
		if (obj[key][j]==0) pqos="0-Atmost Once";
		else if (obj[key][j]==1) pqos="1-Atleast Once";
		else if (obj[key][j]==2) pqos="2-Exactly Once";
		else pqos=obj[key][j];
		cell1.innerHTML=pqos;
		cell1.value=pqos;
		cell1.style.textAlign="left";
		cell1.style.fontWeight="normal";
		cell1.style.wordBreak="break-all";
	}
        else{
	cell1.innerHTML=obj[key][j];
	cell1.value=obj[key][j];
	//cell1.style.width="180px";
	cell1.style.textAlign="left";
	cell1.style.fontWeight="normal";
	cell1.style.wordBreak="break-all";
	}
	c1=c1+1;
   }
   rownumber=rownumber+1;
   if (rownumber==11)
   	break;
}



var checkofval=(rec_cnt)*10;
var u="/singleclient/pub/get?a="+id+"&offsetvalue="+checkofval+"&curr_time="+new Date().getTime();
$.ajax({

	url: u,
    type: "GET",
dataType: "text",
    async:true,
     success: function (msg) {
var obj=JSON.parse(msg);
for (var key in obj)
{
	if (obj[key][0]=="0")
		{
			publastset=1;
			break;
		}
}
},
error:function()
{
}
});
if (rec_cnt>2)
{
var a=document.getElementsByClassName("pub"+(rec_cnt+1));
if (a.length>0)
{
var xx=0;
}
else
{
if (publastset==0)
{
$("<li class=pub"+(rec_cnt+1)+" style=cursor:pointer><a class=pubset id=apub"+(rec_cnt+1)+" name=apub"+(rec_cnt+1)+" onclick=next_pub_disp("+(rec_cnt+1)+",id)>"+(rec_cnt+1)+"</a></li>").insertAfter("ul li.pub"+rec_cnt);
}
var list_size=$('#pub_track li').size();
var lastpubtrack=document.getElementById("lastpubi");
var rec_count_start=(rec_cnt*12);
var rec_count_end=rec_count_start+12;
if(list_size>7)
{
if (rec_cnt>4)
{
var showfrom=rec_cnt-3;
var showto=rec_cnt+1;
var hideright=rec_cnt+3;
var hideleft=rec_cnt-1;
$('#pub_track li:gt('+showfrom+')').show();
$('#pub_track li:lt('+showto+')').show();
$('#pub_track li:gt('+showto+')').hide();
$('#pub_track li:lt('+showfrom+')').hide();

$('#pub_track li:lt(1)').show();
$('#pub_track li').last().show();
}
}
$('#pub_track li:lt(1)').show();
$('#pub_track li').last().show();

}
}
}

,
error:function()
{
}
});


}
function last_sub_disp(pid)
{
var xdetail=document.getElementsByClassName("subset");
var xd;
for(xd=0;xd<xdetail.length;xd++)
{
xdetail[xd].style.backgroundColor="#ffffff";
}
var lastsubtrack=document.getElementById("lastsubi");
lastsubtrack.style.backgroundColor="#ecf0f5";
var list_size=$('#sub_track li').size();
next_sub_disp(list_size-2,pid);
}


function next_sub_disp(rec_cnt,pid)
{
var sublastset=0;
var list_size=$('#sub_track li').size();
var rec_count_start=(rec_cnt*12);
var rec_count_end=rec_count_start+12;
var xdetail=document.getElementsByClassName("subset");
var xd;
for(xd=0;xd<xdetail.length;xd++)
{
xdetail[xd].style.backgroundColor="#ffffff";
}
var lastsubtrack=document.getElementById("lastsubi");
lastsubtrack.style.backgroundColor="#ffffff";

document.getElementById(pid).style.backgroundColor="#ecf0f5";
if(list_size>7)
{
if ((rec_cnt>=2) && (rec_cnt<(list_size-4)))
{
var showfrom=rec_cnt-2;
var showto=rec_cnt+4;
var hideright=rec_cnt+3;
var hideleft=rec_cnt-1;

$('#sub_track li:gt('+showfrom+')').show();
$('#sub_track li:lt('+showto+')').show();
$('#sub_track li:gt('+hideright+')').hide();
$('#sub_track li:lt('+hideleft+')').hide();
$('#sub_track li:lt(1)').show();
$('#sub_track li').last().show();
}
}
if (rec_cnt == 1 ){
	$('#sub_track li:gt('+1+')').show();
	$('#sub_track li:lt('+5+')').show();
	$('#sub_track li:gt('+4+')').hide();
}
$('#sub_track li:lt(1)').show();
$('#sub_track li').last().show();
id=document.getElementById("d_name").value;
//next_log_clk++;
var ofval=(rec_cnt-1)*10;
var u="/singleclient/sub/get?a="+id+"&offsetvalue="+ofval+"&curr_time="+new Date().getTime();
$.ajax({

	url: u,
    type: "GET",
dataType: "text",
    async:true,
     success: function (msg) {
var obj=JSON.parse(msg);
var px1=document.getElementById("sub_table");
while(px1.rows[1]) px1.deleteRow(1);
var rownumber=1;
for (var key in obj)
{
  var row=px1.insertRow(rownumber);
	var c1=0;
	for (var j=1;j>=0;j--)
	{
	var cell1=row.insertCell(c1);
	cell1.style.width="180px";
	if (j==1)
	{
	cell1.innerHTML=obj[key][j];
	cell1.value=obj[key][j];
	}
	else
	{
		var lg_op=obj[key][j];
		if (obj[key][j]==0) lg_op="0-Atmost Once";
		else if (obj[key][j]==1) lg_op="1-Atleast Once";

		else if (obj[key][j]==2) lg_op="2-Exactly Once";
		cell1.innerHTML=lg_op;
		cell1.value=lg_op;		
	}
	cell1.style.width="180px";
	cell1.style.textAlign="left";
	cell1.style.fontWeight="normal";
	c1=c1+1;
	}
   rownumber=rownumber+1;
   if (rownumber==11)
   	break;
}



var checkofval=(rec_cnt)*10;
var u="/singleclient/sub/get?a="+id+"&offsetvalue="+checkofval+"&curr_time="+new Date().getTime();
$.ajax({

	url: u,
    type: "GET",
dataType: "text",
    async:true,
     success: function (msg) {
var obj=JSON.parse(msg);
for (var key in obj)
{
	if (obj[key][0]=="0")
		{
			sublastset=1;
			break;
		}
}
},
error:function()
{
}
});
if (rec_cnt>2)
{
var a=document.getElementsByClassName("sub"+(rec_cnt+1));
if (a.length>0)
{	

var xx=0;
}
else
{
if (sublastset==0)
{
$("<li class=sub"+(rec_cnt+1)+" style=cursor:pointer><a class=subset id=asub"+(rec_cnt+1)+" name=asub"+(rec_cnt+1)+" onclick=next_sub_disp("+(rec_cnt+1)+",id)>"+(rec_cnt+1)+"</a></li>").insertAfter("ul li.sub"+rec_cnt);
}
var list_size=$('#sub_track li').size();
var lastsubtrack=document.getElementById("lastsubi");
var rec_count_start=(rec_cnt*12);
var rec_count_end=rec_count_start+12;
if(list_size>7)
{
if (rec_cnt>4)
{
var showfrom=rec_cnt-3;
var showto=rec_cnt+1;
var hideright=rec_cnt+3;
var hideleft=rec_cnt-1;
$('#sub_track li:gt('+showfrom+')').show();
$('#sub_track li:lt('+showto+')').show();
$('#sub_track li:gt('+showto+')').hide();
$('#sub_track li:lt('+showfrom+')').hide();

$('#sub_track li:lt(1)').show();
$('#sub_track li').last().show();
}
}
$('#sub_track li:lt(1)').show();
$('#sub_track li').last().show();

}
}
}

,
error:function()
{
}
});


}





function adddevices(devtrackcnt) {
	//_.defaults(options,{devtrackcnt:0});
	id=document.getElementById("d_name").value;
	document.getElementById("d_name").value='';
	document.getElementById("d_type").value='';
	document.getElementById("d_desc").value='';

	document.getElementById("will_topic").value='';
	document.getElementById("will_msg").value='';
	document.getElementById("will_retain").value='';

	var px1=document.getElementById("pub_table");
	while(px1.rows[1]) px1.deleteRow(1);
		var sx1=document.getElementById("sub_table");
	while(sx1.rows[1]) sx1.deleteRow(1);
		var lx1=document.getElementById("log_table");
	while(lx1.rows[1]) lx1.deleteRow(1);
		var addactive;
	addactive=document.getElementById("addactiveflag");
	var x=document.getElementById("device");
	//$("#device").children().hide();
	addactive=document.getElementById("addactiveflag").value;
	var clientoffset=devtrackcnt*10;
	var urlcheck;
	if (addactive=="1")
	   urlcheck='/client/active';
	else if(addactive=="0")
		urlcheck='/client/list?offset='+clientoffset+"&curr_time="+new Date().getTime();
//var emptydevice=document.getElementById("device");
//emptydevice.innerHTML="";
	x.innerHTML="";

	dev_cnt=1;
	dev_key=[];
	activedev_key=[]
	activedev_cnt=1;


	if($("#device_search").val() != "" && $("#device_search").val() != " ") {
		urlcheck= '/searchedclient/list?a='+$("#device_search").val()+'&offset='+clientoffset+'&curr_time='+new Date().getTime()
	}

	$.ajax({
		url: urlcheck,
		type: "GET",
		dataType: "text",
		async:false,

		success: function (msg) {
			if (deviceClk==0) {
				obj=JSON.parse(msg);
				var cnt=1;
				x=document.getElementById("device");
				var key;
				for (key in obj) {
					dev_key[dev_cnt]=key;
					dev_cnt++;
				}
				var first = null;
				for (key in obj) {
					elt=document.createElement("li");
					var ielt=document.createElement("i");
					ielt.className="fa fa-circle-o";
					elt.style.display="block";
					elt.style.cursor="pointer";
					elt.style.pointerEvents="auto";
						if (cnt==1) first=key;
			    		if (cnt==1)
			    			elt.style.padding="14px 4px 4px 4px";
			    		else
			    			elt.style.padding="4px 4px 4px 4px";

						if(obj[key][3] == 2) {
							elt.innerHTML="<a class=detail id='device"+escape(key)+"' name='device"+escape(key)+"' onclick=disp_detail('"+escape(key)+"')><i class='fa fa-circle-o'></i>"+key+" <img src='/static/images/green.png' style='position : absolute; top: 17px; right : 12px; width : 8px'></a>";
						}
						else {
							elt.innerHTML="<a class=detail id='device"+escape(key)+"' name='device"+escape(key)+"' onclick=disp_detail('"+escape(key)+"')><i class='fa fa-circle-o'></i>"+key+" <img src='/static/images/red.png' style='position : absolute; top: 17px; right : 12px; width : 8px'></a>";
						}
			    /*if(obj[key][3] == 2) {
					elt.innerHTML="<a class=detail id='device"+escape(key)+"' name='device"+escape(key)+"' onclick=disp_detail('"+escape(key)+"')><i class='fa fa-circle-o' style='margin-right: 5px;'></i>"+key+" <i class='fa fa-circle-o pull-right' ></i></i></a>";
				}
				else {
			    	elt.innerHTML="<a class=detail id='device"+escape(key)+"' name='device"+escape(key)+"' onclick=disp_detail('"+escape(key)+"')><i class='fa fa-circle-o' style='margin-right: 5px;'></i>"+key+" <i class='fa fa-circle-o pull-right'></i></a>";
			    }*/
					top=top+30;
					elt.value="device"+key;
					x.appendChild(elt);	
					elt.style.display="none";
					cnt=cnt+1;
				}
				nd=cnt-1;
				/*if ((nd==0) && (devtrackcnt==0)) {
					var i, tabcontent, tablinks;
				    tabcontent = document.getElementsByClassName("tabcontent");
				    for (i = 0; i < tabcontent.length; i++) {
				        tabcontent[i].style.display = "none";
				    }
					var dbelt=document.getElementById("dbtab");
					var devtabelt=document.getElementById("devtabhead");
					var ruletabelt=document.getElementById("ruletabhead");
					dbelt.style.display="none";
					devtabelt.style.display="none";
					ruletabelt.style.display="none";
					var errelt=document.getElementById("connectmsg");
					errelt.style.display="block";
					errelt.innerHTML="There are no devices connected. Please connect and load this page.";
					return;
				}*/
				var list_size=$('#device li').size();
				var rec_count_start=0;
				var rec_count_end=rec_count_start+12;
				if (rec_count_start==0) {
					$('#device li:gt(-1)').show();
					var x=(20 <= list_size) ? 20 : list_size;
					$('#device li:lt('+(x+1)+')').show();
					$('#device li:gt('+(x-1)+')').hide();
				}
				var top3=80;
				var stop_cnt=0;
				var ee;
				if (nd>12)  stop_cnt=12;
				else stop_cnt=nd;
				var ptag=document.getElementById("rec_count");
				var ptagtxt="";
				ptagtxt="1-"+stop_cnt+" of "+nd;
				ptag.innerHTML=ptagtxt;
				var md=document.getElementById("next");
				if (nd>12) {
					md.className="nextimgg";
					md.style="display:block";
					md.disabled=false;
				}
				else
					md.disabled=true;
				var nxt_txt=document.getElementById("next_clk_txt");
				nxt_txt.style="display:none";
				document.body.appendChild(nxt_txt);
				next_clk=parseInt(nxt_txt.value);
				if (document.getElementById("deveditflag").value=="10") {
					//alert("10");}
					if(first != null) {
						disp_detail(first);
					}
					else {
						var u="/singleclient/will/get?a="+id+"&curr_time="+new Date().getTime();
					$.ajax({
						url: u,
						type: "GET",
						dataType: "text",
						async:true,
						success: function (msg) {
							var ind1=msg.indexOf("[");
							var ind2=msg.indexOf("]");
							var willmsg=msg.slice(ind1,ind2+1);
							ind1=msg.indexOf("{");
							ind2=msg.indexOf("}");
							var timemsg=msg.slice(ind1,ind2+1);
							var timeobj=JSON.parse(timemsg);
							broker_start_time=parseInt(timeobj["0"]);
							var dd=new Date(broker_start_time);
							var xx=new Date();
							var ss=timeDiff(xx,dd);
							var obj=JSON.parse(willmsg);
							document.getElementById("edit").className='hidden';
							document.getElementById("will_topic").value=obj[1];
							document.getElementById("will_msg").value=obj[2];
							if (obj[4]==0) {
								document.getElementById("will_retain").value="0-Retain Flag is not set";
							}
							else if (obj[4]==1) {
								document.getElementById("will_retain").value="1-Retain Flag is set";
							}
							else  {
								document.getElementById("will_retain").value="NIL";
							}
						},
						error: function () {
						}
					});
					}
				}
				else if (document.getElementById("deveditflag").value=="1") {
				//alert("1")
					disp_detail(id); 
				}
				else {
					//alert("else")
					disp_detail(key); 
				}
			}
			else {
				//alert("main_else")
				disp_detail(id);
			}
		},
		error: function () {
		}
	});
}


function setnextclk(nextcnt) {	
	if(nextcnt == 0) {
		$('#dev_track li:gt(0)').show();
		$('#dev_track li:lt(6)').show();
		$('#dev_track li:gt(5)').hide();
		$('#dev_track li:lt(1)').show();
		$('#dev_track li').last().show();
	}
	else if(nextcnt == $("#dev_track li").size()-2) {
		$('#dev_track li:gt('+($("#dev_track li").size()-5)+')').show();
		$('#dev_track li:lt('+($("#dev_track li").size()-6)+')').hide();
		$('#dev_track li:lt(1)').show();
		$('#dev_track li').last().show();
	}
	var dev_list_size=$('#dev_track li').size();
	//var no_of_track=parseInt(clientcount/20)+1;
	var no_of_track=parseInt(clientcount/10);
	if(parseInt(clientcount%10) > 0) {
		no_of_track = no_of_track + 1;
	}
	var whole_list_size=no_of_track+2;
	var lastclicked=0;

	var devlastset=0;
	if (nextcnt==dev_list_size-2)
		lastclicked=1;
	var xdetail=document.getElementsByClassName("example");
	var xd;
	for(xd=0;xd<xdetail.length;xd++) {
		xdetail[xd].style.backgroundColor="#ffffff";
	}
	if (lastclicked==1)
		document.getElementById("lastdevi").style.backgroundColor="#ecf0f5";
	else {
		var nj=document.getElementById(nextcnt);
		if(nj)
			document.getElementById(nextcnt).style.backgroundColor="#ecf0f5";
	}
	if ((whole_list_size==dev_list_size) && (lastclicked==1))
		adddevices(nextcnt-1);
	else {
		adddevices(nextcnt);
		var nn=document.getElementById("d_name").value;
		var xdetail11=document.getElementById("device"+escape(nn));
		xdetail11.style.borderLeft="3px solid transparent";
		xdetail11.style.borderColor="#337ab7";
		xdetail11.style.color="#ffffff";

		var dev_list_size_temp=$('#dev_track li').size();
		if (dev_list_size_temp==whole_list_size)
			devlastset=1;
		var rec_cnt=nextcnt;
		if (lastclicked==0) {
			if(dev_list_size>7) {
				if ((nextcnt>=1) && (nextcnt<(dev_list_size-4))) {
					var showfrom=nextcnt-2;
					var showto=nextcnt+4;
					var hideright=nextcnt+3;
					if (nextcnt==1) {
					   showto=nextcnt+5;
					   hideright=nextcnt+4;
					}
					var hideleft=nextcnt-1;
					$('#dev_track li:gt('+showfrom+')').show();
					$('#dev_track li:lt('+showto+')').show();
					$('#dev_track li:gt('+hideright+')').hide();
					$('#dev_track li:lt('+hideleft+')').hide();
					$('#dev_track li:lt(1)').show();
					$('#dev_track li').last().show();
				}
			}
			$('#dev_track li:lt(1)').show();
			$('#dev_track li').last().show();
			if (rec_cnt>2) {
				var a=document.getElementsByClassName("dev"+(rec_cnt+1));
				if (a.length>0) {
					var xx=0;
				}
				else {
					if (devlastset==0) {
						$("<li class=dev"+(rec_cnt+1)+"  style=cursor:pointer><a class=example id='"+(rec_cnt+1)+"' name='"+(rec_cnt+1)+"' onclick=setnextclk("+(rec_cnt+1)+")>"+(rec_cnt+2)+"</a></li>").insertAfter("ul li.dev"+rec_cnt);
					}
					dev_list_size=$('#dev_track li').size();
					var lastdevtrack=document.getElementById("lastdevi");
					var rec_count_start=(rec_cnt*12);
					var rec_count_end=rec_count_start+12;

					if(dev_list_size>7) {
						var xne=dev_list_size-4;
						if ((nextcnt>=1) && (nextcnt>=(dev_list_size-4))) {
							var showfrom=nextcnt-2;
							var showto=nextcnt+4;
							var hideright=nextcnt+2;
							if (nextcnt==1) {
							   showto=nextcnt+5;
						  		hideright=nextcnt+4;
							}
							var hideleft=nextcnt-1;
							$('#dev_track li:gt('+showfrom+')').show();
							$('#dev_track li:lt('+showto+')').show();
							$('#dev_track li:gt('+hideright+')').hide();
							$('#dev_track li:lt('+hideleft+')').hide();
							$('#dev_track li:lt(1)').show();
							$('#dev_track li').last().show();
						}
					}
					$('#dev_track li:lt(1)').show();
					$('#dev_track li').last().show();
				}
			}
			if(dev_list_size>7) {
				if ((nextcnt>=1) && (nextcnt>=(dev_list_size-4))) {
					var showfrom=nextcnt-2;
					var showto=nextcnt+4;
					var hideright=nextcnt+2;
					if (nextcnt==1) {
						showto=nextcnt+5;
						hideright=nextcnt+4;
					}
					var hideleft=nextcnt-2;
					$('#dev_track li:gt('+showfrom+')').show();
					$('#dev_track li:lt('+showto+')').show();
					$('#dev_track li:gt('+hideright+')').hide();
					$('#dev_track li:lt('+hideleft+')').hide();
					$('#dev_track li:lt(1)').show();
					$('#dev_track li').last().show();
				}
			}
			$('#dev_track li:lt(1)').show();
			$('#dev_track li').last().show();
		}

		var list_size=$('#device li').size();
		var rec_count_start=(nextcnt*20);
		var rec_count_end=rec_count_start+20;

		$('#device li:gt(-1)').show();
		var x=(20 <= list_size) ? 20 : list_size;
		var newelt=$('#device li a').get(0);
		$('#device li:lt('+(x+1)+')').show();
		//disp_detail((newelt.innerText).toString());
		$('#device li:gt('+(x-1)+')').hide();
	}
}


function addactivedevices() {
	document.getElementById("activedev").style.color="#FA0000";
	document.getElementById("alldev").style.color="#000000";
	document.getElementById("addactiveflag").value="1";
	adddevices(0);
}


function addalldevices() {
	document.getElementById("alldev").style.color="#FA0000";
	document.getElementById("activedev").style.color="#000000";
	document.getElementById("addactiveflag").value="0";
	adddevices(0);
}


function startTime1() {
	var today = new Date();
	var brokerstart=new Date(broker_start_time);
	var uptime=timeDiff(today,brokerstart);
	var h=uptime.hours;
	var m=uptime.minutes1;
	var s=uptime.seconds1;
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('uptime').innerHTML =
	parseInt(h) + ":" + m + ":" + s;
	var t = setTimeout(startTime1, 500);
}


function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}


function timeDiff(date1, date2) {
	var a = new Date(date1).getTime(),
	b = new Date(date2).getTime(),
	diff = {};

	diff.milliseconds = a > b ? a % b : b % a;
	diff.seconds = diff.milliseconds / 1000;
	diff.seconds1=Math.floor(diff.seconds % 60);
	diff.minutes = diff.seconds / 60;
	diff.minutes1=Math.floor(diff.minutes % 60);
	diff.hours = diff.minutes / 60;
	diff.days = diff.hours / 24;
	diff.weeks = diff.days / 7;

	return diff;
}


function fnrulecancel() {
	$("#editdialog" ).dialog({
		width: 500,
		height: 600,
		autoOpen: true,
		show: {
			effect: "blind",
			duration: 500
		},
		hide: {
			effect: "blind",
			duration: 500
		}
	}); 

	document.getElementById("editdialog").style.display="none";
	$("#editdialog").dialog("close");
	document.getElementById("pubd1").style.display="none";
	document.getElementById("dialog_wrapper").style.display="none";
}


function fnaddrule() {
	$("#editdialog" ).dialog({
		width: 500,
		height: 400,
		autoOpen: true,
		show: {
			effect: "blind",
			duration: 500
		},
		hide: {
			effect: "blind",
			duration: 500
		}
	}); 

$('#editdialog').dialog('option', 'title', 'Add Rule');
addrule=1;
document.getElementById("prtype").style.display="block";

document.getElementById("dialog_wrapper").style.display="block";

//document.getElementById("dialog_wrapper").style.width="650px";
document.getElementById("pubd1").style.display="block";

//document.getElementById("pubd1").style.width="650px";
document.getElementById("paid_txt").value="";
document.getElementById("uname_txt").value="";
document.getElementById("hr").value='*';
document.getElementById("min").value='*';
document.getElementById("pruletype_txt").value=1;
document.getElementById("pid_txt").value="";
document.getElementById("pid_txt").style.disabled=true;
document.getElementById("pi").style.display="block";
document.getElementById("preqtopic_txt").value="";
document.getElementById("preqtopic_txt").style.disabled=true;
document.getElementById("pt").style.display="block";
document.getElementById("preqmsg_txt").value="";
document.getElementById("pm").style.display="none";
document.getElementById("prestopic_txt").value="";
document.getElementById("pq").style.display="block";
document.getElementById("pr").style.display="block";
document.getElementById("samemsg").checked=false;
document.getElementById("schedule_div").style.display="none";
document.getElementById("specific_date_div").style.display="none";
			document.getElementById("lbl_fwd_topic").innerHTML="Forwarding Topic";
			document.getElementById("lbl_fwd_msg").innerHTML="Forwarding Message";
			document.getElementById("pi").style.display="block";
			document.getElementById("pt").style.display="block";
			//document.getElementById("pm").style.display="block";
			document.getElementById("puser").style.display="none";
			document.getElementById("datetime").style.display="none";
			document.getElementById("tm").style.display="none";
			document.getElementById("days").style.display="none";
			document.getElementById("presmsg_txt").style.width="160px";
			document.getElementById("samemsg").style.display="block";
			document.getElementById("pub_update").style.top="320px";
			document.getElementById("rule_cancel").style.top="320px";
		var days_ar=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
		for (var j=0;j<7;j++)
			document.getElementById(days_ar[j]).checked=false;

var a=document.getElementById("samemsg").checked;
if(a==true)
{
document.getElementById("presmsg_txt").disabled=true;
document.getElementById("presmsg_txt").placeholder="Send as received message";
document.getElementById("presmsg_txt").value="MsgFORWARDED";
}
else
{
document.getElementById("presmsg_txt").disabled=false;
document.getElementById("presmsg_txt").placeholder="Enter Message";
document.getElementById("presmsg_txt").value="";
}
document.getElementById("presmsg_txt").value="";
document.getElementById("presmsg_txt").placeholder="Enter Message";
document.getElementById("samemsg").checked=false;
document.getElementById("presmsg_txt").style.disabled=false;
document.getElementById("prulecond_txt").style.display="none";
document.getElementById("dialog_wrapper").style.height="320px";
document.getElementById("dialog_wrapper").style.width="300px";
$( "#editdialog" ).dialog("open");
}

function fnpubupdate()
{
var rtyp=parseInt(document.getElementById("pruletype_txt").value);
var rcid=document.getElementById("pid_txt").value;
var reqt=document.getElementById("preqtopic_txt").value;
var reqm=document.getElementById("preqmsg_txt").value;
var samemsg=document.getElementById("samemsg").checked;
var compcond=document.getElementById("prulecond_txt").value;
var invalid=0;
if (rtyp==4)
{
	document.getElementById("ruletype").value="50";
}
else
{
	if ((rtyp==1) && (samemsg==true))
	{
	   document.getElementById("ruletype").value="2";
	}
	else
	if ((rtyp==1) && (samemsg==false))
	{
	   	document.getElementById("ruletype").value="1";
	}
	if ((rtyp==2) && (samemsg==true))
	{
	 	//document.getElementById("ruletype").value="7";
	   if (isNumber(reqm))
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="71";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="72";
	      else if (compcond==3)
	    	  document.getElementById("ruletype").value="73";
	      else if (compcond==4)
	    	  document.getElementById("ruletype").value="74";
	   }
	   else
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="71";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="72";
	      else
		  invalid=1;
	   }

	}
	else
	if ((rtyp==2) && (samemsg==false))
	{
	   if (isNumber(reqm))
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="3";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="4";
	      else if (compcond==3)
	    	  document.getElementById("ruletype").value="5";
	      else if (compcond==4)
	    	  document.getElementById("ruletype").value="6";
	   }
	   else
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="3";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="4";
	      else
		  invalid=1;
	   }
	}
	if ((rtyp==3) && (samemsg==true))
	{
	    	  //document.getElementById("ruletype").value="12";
	   if (isNumber(reqm))
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="81";
	      else if (compcond==3)
	    	  document.getElementById("ruletype").value="83";
	      else if (compcond==4)
	    	  document.getElementById("ruletype").value="84";
	      else if (compcond==2)
		 	{
		    	 document.getElementById("ruletype").value="82"; 
			  //invalid=1;
			}

	      
	   }
	   else
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="81";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="82";
	      else
		  invalid=1;
	   }

	}
	else
	if ((rtyp==3) && (samemsg==false))	
	{
	   if (isNumber(reqm))
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="8";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="9";
	      else if (compcond==3)
	    	  document.getElementById("ruletype").value="10";
	      else if (compcond==4)
	    	  document.getElementById("ruletype").value="11";
	   }
	   else
	   {
	      if (compcond==1)
	    	  document.getElementById("ruletype").value="8";
	      else if (compcond==2)
	    	  document.getElementById("ruletype").value="9";
	      else
		  invalid=1;
	   }
	}
}
var rest=document.getElementById("prestopic_txt").value;
var resm=document.getElementById("presmsg_txt").value;
var newrule=document.getElementById("ruletype").value;
if (newrule=="50")
{
	if (invalid==0)
	{
		if (rcid=="")
		{
			invalid=1;
		}
		if (rest=="")
		{
			invalid=1;
		}	
		if (resm=="")
			invalid=1;
		if (invalid==1)
			alert("Publisher/Topic/Message could not be empty");
			
	}
}
if ((newrule=="8") || (newrule=="9") || (newrule=="10") || (newrule=="11") || (newrule=="81") || (newrule=="82") || (newrule=="83") || (newrule=="84"))
{	
   if (invalid==0)
   {
	if (rcid=="")
	{
		invalid=1;
	}
	if (reqt=="")
	{
		invalid=1;
	}
	if (reqm=="")
	{
		invalid=1;
	}
	if (invalid==1)
		alert("ClientID/PublishedTopic/PublishedMessage could not be empty");
	if ((rest=="") || (resm==""))
		{
			if (invalid==0)
			alert("ForwardingTopic could not be empty");
				invalid=1;
		}
   }
}
if ((newrule=="3") || (newrule=="4") || (newrule=="5") || (newrule=="6") || (newrule=="71") || (newrule=="72") || (newrule=="73") || (newrule=="74"))
{
   if (invalid==0)
   {
	if (reqt=="")
	{
		invalid=1;
	}
	if (reqm=="")
	{
		invalid=1;
	}
	if (invalid==1)
		alert("PublishedTopic/PublishedMessage could not be empty");
	if ((rest=="") || (resm==""))
		{
			if (invalid==0)
			alert("ForwardingTopic/Message could not be empty");
				invalid=1;
		}
   }
}
if ((newrule=="1") || (newrule=="2"))
{
	if (rcid=="")
	{
		invalid=1;
	}
	if (reqt=="")
	{
		invalid=1;
	}
    if (invalid==1)
    	alert("ClientID/PublishedTopic could not be empty");
	if ((rest=="") || (resm=="")) 
	{
		if (invalid==0)
		alert("ForwardingTopic/Message could not be empty");
			invalid=1;
	}


}

if (invalid==0)
{
document.getElementById("editdialog").style="display:none;"
$("#editdialog").dialog("close");
document.getElementById("pubd1").style="display:none";
document.getElementById("dialog_wrapper").style.display="none";

document.getElementById("resmsg").value=document.getElementById("presmsg_txt").value;
$("#paid_txt").appendTo("#pa");
$("#pid_txt").appendTo("#pi");
$("#resmsg").appendTo("#myform");

$("#preqtopic_txt").appendTo("#pt");
$("#preqmsg_txt").appendTo("#pm");
$("#prulecond_txt").appendTo("#pm");
$("#prestopic_txt").appendTo("#pq");
$("#presmsg_txt").appendTo("#pr");

$("#pruletype_txt").appendTo("#prtype");

$("#paid_txt").appendTo("#myform");
$("#pid_txt").appendTo("#myform");


$("#preqtopic_txt").appendTo("#myform");
$("#prulecond_txt").appendTo("#myform");
$("#preqmsg_txt").appendTo("#myform");
$("#prestopic_txt").appendTo("#myform");
$("#presmsg_txt").appendTo("#myform");
$("#pruletype_txt").appendTo("#myform");
if (addrule==1)
{
	document.getElementById("choice").value='addrule';

	addrule=0;
}
else
	document.getElementById("choice").value='editrule';
var newchoice1=document.getElementById("choice").value;
var new_paid1=document.getElementById("paid_txt").value;
var new_pid1=document.getElementById("pid_txt").value;
var new_pt1=document.getElementById("preqtopic_txt").value;
var new_pm1=document.getElementById("preqmsg_txt").value;
var new_prest1=document.getElementById("prestopic_txt").value;
var new_presm1=document.getElementById("presmsg_txt").value;
var new_pruletype1=document.getElementById("ruletype").value;
var new_puser;
if (document.getElementById("uname_txt"))
	new_puser=document.getElementById("uname_txt").value;
else
	new_puser="";
var hr='*',min='*';
if (document.getElementById("hr"))
 hr=document.getElementById("hr").value;
if (document.getElementById("min"))
 min=document.getElementById("min").value;
document.getElementById("new_hr").value=hr;
document.getElementById("new_min").value=min;
document.getElementById("new_user").value=new_puser;
var day=new Array();
if (new_pruletype1=="50")
{
	day.push(document.getElementById("monday").checked);
	day.push(document.getElementById("tuesday").checked);
	day.push(document.getElementById("wednesday").checked);
	day.push(document.getElementById("thursday").checked);
	day.push(document.getElementById("friday").checked);
	day.push(document.getElementById("saturday").checked);
	day.push(document.getElementById("sunday").checked);
}
var day_of_week=new Array();
for (var dayindex=0;dayindex<day.length;dayindex++)
{
	if (day[dayindex]==true)
		day_of_week.push(dayindex);
}
var days=day_of_week.toString();
if (new_pruletype1=="50")
{
  var schedule_norms=document.getElementById("schedule").value;
  if (schedule_norms==1)
  {
  	startDate = $("#specific_date_txt").datepicker("option", "dateFormat", "yy-mm-dd").val();
  	endDate=$("#specific_date_txt").datepicker("option", "dateFormat", "yy-mm-dd").val();
  	days='*';
  }
  else if (schedule_norms==2)
  {
  	if (document.getElementById("datetime_txt"))
	{
		startDate = $('#datetime_txt').data('daterangepicker').startDate.format('YYYY-MM-DD');
		endDate = $('#datetime_txt').data('daterangepicker').endDate.format('YYYY-MM-DD');
	}

  	days='*';
  }
  else 
  {
  	startDate='*';
  	endDate='*';

  }
}
document.getElementById("new_start_date").value=startDate;
document.getElementById("new_end_date").value=endDate;
document.getElementById("new_days").value=days;
var $form=$("#myform");
var f=$form
var u=$form.attr("action")+"?"+$form.serialize();
$.ajax({


   url: '/editrule',

data: $("form[name='myform']").serialize(),
    type: "POST",
    async:true,
     success:function () {
}  
});
$("#paid_txt").appendTo("#pa");
$("#pid_txt").appendTo("#pi");
$("#preqtopic_txt").appendTo("#pt");
$("#preqmsg_txt").appendTo("#pm");
$("#prulecond_txt").appendTo("#pm");
$("#prestopic_txt").appendTo("#pq");
$("#presmsg_txt").appendTo("#pr");
$("#pruletype_txt").appendTo("#prtype");
$("#presmsg_txt").appendTo("#pr");

document.getElementById("pubd1").style="display:none";
id=document.getElementById("pid_txt").value;
getRuleEngine(); 
}
//else
//fnaddrule();

}

function fnalldays()
{
	var alldays=document.getElementById("alldays").checked;
	if (alldays==false)
	{
		var days_ar=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
		for (var j=0;j<7;j++)
		{
			document.getElementById(days_ar[j]).checked=true;
			document.getElementById(days_ar[j]).disabled=true;
		}


	}
	else
	{
		var days_ar=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
		for (var j=0;j<7;j++)
		{
			document.getElementById(days_ar[j]).checked=false;
			document.getElementById(days_ar[j]).disabled=false;
		}

	}
}
function fnschedule(val)
{
	var schedule_norms=val;
	if (schedule_norms==1)
	{
		document.getElementById("datetime").style.display="none";
		document.getElementById("specific_date_div").style.display="block";
		document.getElementById("days").style.display="none";
	}
	else if (schedule_norms==2)
	{
		document.getElementById("datetime").style.display="block";
		document.getElementById("specific_date_div").style.display="none";
		document.getElementById("days").style.display="none";
	}
	else if (schedule_norms==3)
	{
		document.getElementById("datetime").style.display="none";
		document.getElementById("specific_date_div").style.display="none";
		document.getElementById("days").style.display="block";
	}

}

function fnruletype(val)
{
		ruleselected=val;
		if (ruleselected==4)
		{
			  picker=$('input[name="datetime_txt"]').daterangepicker(/*{
        timePicker: false,
        timePickerIncrement: 05,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        },*/
        function(start, end) {
        startDate = start;
         endDate = end;  

       }
    );
			  d_picker=$('input[name="specific_date_txt"]').datepicker();
			  $("#specific_date_txt" ).datepicker({
  format: 'yyyy-mm-dd'
});
			  $("#specific_date_txt").datepicker( "setDate" , toString(new Date()) );
			$('#editdialog').dialog('option', 'height', '450');
			document.getElementById("lbl_fwd_topic").innerHTML="Topic";
			document.getElementById("lbl_fwd_msg").innerHTML="Message";
			document.getElementById("pi").style.display="block";
			document.getElementById("puser").style.display="block";
			document.getElementById("datetime").style.display="none";
			document.getElementById("tm").style.display="block";
			document.getElementById("schedule_div").style.display="block";
			document.getElementById("specific_date_div").style.display="block";
			document.getElementById("schedule").value=1;
			document.getElementById("days").style.display="none";
			document.getElementById("days").style.width="390px";
			document.getElementById("pt").style.display="none";
			document.getElementById("pm").style.display="none";	
			document.getElementById("presmsg_txt").style.width="200px";
			document.getElementById("samemsg").style.display="none";
			document.getElementById("pub_update").style.top="380px";
			document.getElementById("rule_cancel").style.top="380px";
			

		}
		else
		{
			document.getElementById("lbl_fwd_topic").innerHTML="Forwarding Topic";
			document.getElementById("lbl_fwd_msg").innerHTML="Forwarding Message";
			document.getElementById("pi").style.display="block";
			document.getElementById("pt").style.display="block";
			document.getElementById("pm").style.display="block";
			document.getElementById("puser").style.display="none";
			document.getElementById("datetime").style.display="none";
			document.getElementById("tm").style.display="none";
			document.getElementById("days").style.display="none";
			document.getElementById("presmsg_txt").style.width="160px";
			document.getElementById("samemsg").style.display="block";
			document.getElementById("pub_update").style.top="320px";
			document.getElementById("rule_cancel").style.top="320px";
			document.getElementById("schedule_div").style.display="none";
			document.getElementById("specific_date_div").style.display="none";
			document.getElementById("schedule_div").style.display="none";


		}
		if (ruleselected==1)
		{
			document.getElementById("pi").style.display="block";
			document.getElementById("pt").style.display="block";
			document.getElementById("pm").style.display="none";
			document.getElementById("prulecond_txt").style.display="none";
 			document.getElementById("presmsg_txt").style.display="block";
		}
		
		if (ruleselected==2)
		{
			document.getElementById("pi").style.display="none";
			document.getElementById("pt").style.display="block";
			$("#preqmsg_txt").appendTo("#pm");
			$("#prulecond_txt").appendTo("#pm");

			document.getElementById("pm").style.display="block";
			document.getElementById("pr").style.display="block";
 			document.getElementById("presmsg_txt").style.display="block";

			document.getElementById("prulecond_txt").style.display="block";
			document.getElementById("prulecond_txt").value="1";
 			document.getElementById("preqmsg_txt").style.display="block";

		}
		if (ruleselected==3)
		{
			document.getElementById("pi").style.display="block";
			document.getElementById("pt").style.display="block";
			$("#preqmsg_txt").appendTo("#pm");
			$("#prulecond_txt").appendTo("#pm");

			document.getElementById("pm").style.display="block";
			document.getElementById("prulecond_txt").style.display="block";
			document.getElementById("prulecond_txt").value="1";
 			document.getElementById("presmsg_txt").style.display="block";

		}
	
}



function fnedit(id2)
{
$("#editdialog" ).dialog({
  width: 500,
  height: 400,
  autoOpen: true,
  show: {
    effect: "blind",
    duration: 500
  },
  hide: {
    effect: "blind",
    duration: 500
  }
}); 

$('#editdialog').dialog('option', 'title', 'Edit Rule');
var btnid=id2;
var ind1=btnid.indexOf('edit');
var rownum=btnid.slice(3,ind1);
document.getElementById("prtype").style.display="block";
document.getElementById("dialog_wrapper").style.display="block";
document.getElementById("pubd1").style.display="block";
document.getElementById("paid_txt").value="";
document.getElementById("pruletype_txt").value=1;

document.getElementById("pid_txt").value="";
document.getElementById("pid_txt").style.disabled=true;
document.getElementById("pi").style.display="block";
document.getElementById("preqtopic_txt").value="";
document.getElementById("preqtopic_txt").style.disabled=true;
document.getElementById("pt").style.display="block";
document.getElementById("preqmsg_txt").value="";
document.getElementById("pm").style.display="none";
document.getElementById("prestopic_txt").value="";
document.getElementById("pq").style.display="block";
document.getElementById("pr").style.display="block";
document.getElementById("samemsg").checked=false;
var a=document.getElementById("samemsg").checked;
if(a==true)
{
document.getElementById("presmsg_txt").disabled=true;
document.getElementById("presmsg_txt").placeholder="Send as received message";
document.getElementById("presmsg_txt").value="MsgFORWARDED";
}
else
{
document.getElementById("presmsg_txt").disabled=false;
document.getElementById("presmsg_txt").placeholder="Enter Message";
document.getElementById("presmsg_txt").value="";
}

document.getElementById("presmsg_txt").value="";
document.getElementById("presmsg_txt").placeholder="Enter Message";
document.getElementById("samemsg").checked=false;
document.getElementById("presmsg_txt").style.disabled=false;
document.getElementById("prulecond_txt").style.display="none";

var condition=document.getElementById("rule"+rownum+"c1").value;
var action=document.getElementById("rule"+rownum+"c2").value;
var ruletype=document.getElementById("rule"+rownum+"c3").value;
var c=JSON.parse(condition);
var ckey;

var s_date=0,e_date=0;

document.getElementById("paid_txt").value=document.getElementById("rule"+rownum+"c0").value;
document.getElementById("pub_update").style.top="330px";
document.getElementById("rule_cancel").style.top="330px";
$('#editdialog').dialog('option', 'height', '400');
$('#editdialog').dialog('option', 'width', '500');
if ((ruletype=="1") || (ruletype=="2"))
{
	document.getElementById("pruletype_txt").value=1;
	document.getElementById("samemsg").style.display="block";
}
else if ((ruletype=="3") || (ruletype=="4") || (ruletype=="5") || (ruletype=="6") || (ruletype=="71") || (ruletype=="72") || (ruletype=="73") || (ruletype=="74"))
{	
	document.getElementById("pruletype_txt").value=2;
	document.getElementById("samemsg").style.display="block";
}
else if (ruletype=="50")
{
				document.getElementById("pub_update").style.top="400px";
			document.getElementById("rule_cancel").style.top="400px";
			$('#editdialog').dialog('option', 'height', '480');
$('#editdialog').dialog('option', 'width', '500');
	document.getElementById("pruletype_txt").value=4;
	document.getElementById("samemsg").style.display="none";
	document.getElementById("presmsg_txt").width="200px";
	document.getElementById("puser").style.display="block";
	document.getElementById("schedule_div").style.display="block";
	document.getElementById("schedule").value=1;
	document.getElementById("specific_date_div").style.display="block";
	$("#specific_date_txt" ).datepicker({
  format: 'yyyy-mm-dd'
});
			  $("#specific_date_txt").datepicker( "setDate" , toString(new Date()) );

	$("#specific_date_txt").datepicker("setDate",toString(new Date()));
	document.getElementById("datetime").style.display="none";
	document.getElementById("days").style.display="none";
}
else
{
	document.getElementById("pruletype_txt").value=3;
	document.getElementById("samemsg").style.display="block";
}
		document.getElementById("pi").style.display="none";
		document.getElementById("pt").style.display="none";
		document.getElementById("pm").style.display="none";
		document.getElementById("puser").style.display="none";
		document.getElementById("tm").style.display="none";
		document.getElementById("datetime").style.display="none";
		document.getElementById("days").style.display="none";

for (ckey in c)
{
	if (ckey=="publisher")
	{
		document.getElementById("pid_txt").value=c[ckey];
		document.getElementById("pi").style.display="block";
	}
	
	if (ckey=="publishedtopic")
	{
   		document.getElementById("preqtopic_txt").value=c[ckey];
		document.getElementById("pt").style.display="block";
	}

	if (ckey=="publishedmsg")
	{
   		document.getElementById("preqmsg_txt").value=c[ckey];
		if ((ruletype=="3") || (ruletype=="8") || (ruletype==71) || (ruletype==81))
			document.getElementById("prulecond_txt").value=1;
		else if ((ruletype=="4") || (ruletype=="9") || (ruletype==72) || (ruletype==82))
			document.getElementById("prulecond_txt").value=2;
		else if ((ruletype=="5") || (ruletype=="10") || (ruletype==73) || (ruletype==83))
			document.getElementById("prulecond_txt").value=3;
		else if ((ruletype=="6") || (ruletype=="11") || (ruletype==74) || (ruletype==84))
			document.getElementById("prulecond_txt").value=4;




			$("#preqmsg_txt").appendTo("#pm");
			$("#prulecond_txt").appendTo("#pm");

		document.getElementById("pm").style.display="block";
	}
		if (ckey=="topic")
	{
		document.getElementById("prestopic_txt").value=c[ckey];
		document.getElementById("pq").style.display="block";
	}
	if (ckey=="msg")
	{
				if (ruletype=="50")
		{
			document.getElementById("presmsg_txt").style.width="200px";
			document.getElementById("lbl_fwd_msg").innerText="Message";
			document.getElementById("lbl_fwd_topic").innerText="Topic";
		}
		else
		{
			document.getElementById("presmsg_txt").style.width="160px";
			document.getElementById("lbl_fwd_msg").innerText="Forwarding Message";
			document.getElementById("lbl_fwd_topic").innerText="Forwarding Topic";

		}

		document.getElementById("presmsg_txt").value=c[ckey];
		document.getElementById("pr").style.display="block";
	}
	if (ckey=="hour")
	{
		timer_rule=true;
		document.getElementById("tm").style.display="block";
		document.getElementById("hr").value=c[ckey];
	}
	if (ckey=="minute")
	{
		document.getElementById("tm").style.display="block";
		document.getElementById("min").value=c[ckey];
	}
	if (ckey=="start_date")
	{
		document.getElementById("datetime").style.display="block";
		if (c[ckey]=='*')
			s_date=toString(new Date());
		else
			s_date=c[ckey];
		document.getElementById("datetime").style.display="none";
	}
	if (ckey=="end_date")
	{
		document.getElementById("datetime").style.display="block";
		if (c[ckey]=='*')
			e_date=toString(new Date());
		else
			e_date=c[ckey];
		document.getElementById("datetime").style.display="none";
	}
	if ((s_date!=0) && (e_date!=0))
	{	
		s_date=new Date(s_date);
		e_date=new Date(e_date);
		$('input[name="datetime_txt"]').daterangepicker(
		{
		    locale: {
		      format: 'DD-MM-YYYY'
		    },
		    startDate: s_date,
		    endDate: e_date
		}
	);
		//$('#datetime_txt').data('daterangepicker').setDateRange(s_date,e_date);
		s_date=0;
		e_date=0;
	}
	if (ckey=="day_of_week")
	{
		document.getElementById("days").style.display="block";
		var ar=c[ckey].split(',');
		var days_ar=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
		for (var j=0;j<7;j++)
			document.getElementById(days_ar[j]).checked=false;
		for (var i=0;i<ar.length;i++)
			if (document.getElementById(days_ar[ar[i]]))
			document.getElementById(days_ar[ar[i]]).checked=true;
		document.getElementById("days").style.display="none";
	}


}
var a=JSON.parse(action);
var akey;
for (akey in a)
{
	if (akey=="forwardingtopic")
	{
   		document.getElementById("prestopic_txt").value=a[akey];
		document.getElementById("pq").style.display="block";
	}
	if (akey=="username")
	{
		document.getElementById("puser").style.display="block";
		document.getElementById("uname_txt").value=a[akey];
	}
	if (akey=="forwardingmsg")
	{
   		document.getElementById("presmsg_txt").value=a[akey];
		document.getElementById("pr").style.display="block";
		if (ruletype=="50")
		{
			document.getElementById("presmsg_txt").style.width="200px";
			document.getElementById("lbl_fwd_msg").innerText="Message";
			document.getElementById("lbl_fwd_topic").innerText="Topic";
		}
		else
		{
			document.getElementById("presmsg_txt").style.width="160px";
			document.getElementById("lbl_fwd_msg").innerText="Forwarding Message";
			document.getElementById("lbl_fwd_topic").innerText="Forwarding Topic";

		}
	}
	
}
if ((ruletype=="1") || (ruletype=="2"))
{
}

else
{
		document.getElementById("prulecond_txt").style.display="block";
		document.getElementById("presmsg_txt").style.display="block";

}
document.getElementById("pubd1").style.display="block";
document.getElementById("dialog_wrapper").style.display="block";
document.getElementById("dialog_wrapper").style.height="320px";
document.getElementById("dialog_wrapper").style.width="300px";

addrule=0;
$( "#editdialog" ).dialog("open");
$("#editdialog").attr("style", "min-height: 410px");


}



function fndrop(id1) {
	var btnid=id1;
	var ind1=btnid.indexOf('drop');
	var rownum=btnid.slice(3,ind1);
	var d_id=btnid.slice(ind1+4);
	var dropflag=btnid.indexOf('pub');
	document.getElementById("choice").value='droprule';

	$("#paid_txt").appendTo("#pa");
	$("#pid_txt").appendTo("#pi");
	$("#preqtopic_txt").appendTo("#pt");
	$("#preqmsg_txt").appendTo("#pm");
	$("#prulecond_txt").appendTo("#pm");
	$("#prestopic_txt").appendTo("#pq");
	$("#presmsg_txt").appendTo("#pr");
	$("#pruletype_txt").appendTo("#prtype");
	$("#presmsg_txt").appendTo("#pr");

	$("#paid_txt").appendTo("#myform");
	$("#pid_txt").appendTo("#myform");
	$("#preqtopic_txt").appendTo("#myform");
	$("#preqmsg_txt").appendTo("#myform");
	$("#prulecond_txt").appendTo("#myform");
	$("#prestopic_txt").appendTo("#myform");
	$("#presmsg_txt").appendTo("#myform");
	$("#pruletype_txt").appendTo("#myform");
	$("#presmsg_txt").appendTo("#myform");


	var condition=document.getElementById("rule"+rownum+"c1").value;
	var action=document.getElementById("rule"+rownum+"c2").value;
	var ruletype=document.getElementById("rule"+rownum+"c3").value;
	var c=JSON.parse(condition);
	var ckey;
	var timer_rule=false;
	var s_date=0,e_date=0;
	document.getElementById("paid_txt").value=document.getElementById("rule"+rownum+"c0").value;
	document.getElementById("pruletype_txt").value=document.getElementById("rule"+rownum+"c3").value;
	for (ckey in c) {
		timer_rule=false;
		if (ckey=="publisher")
		{
			document.getElementById("pid_txt").value=c[ckey];
			document.getElementById("pi").style.display="block";
		}
		
		if (ckey=="publishedtopic")
		{

	   		document.getElementById("preqtopic_txt").value=c[ckey];
			document.getElementById("pt").style.display="block";
		}

		if (ckey=="publishedmsg")
		{
	   		document.getElementById("preqmsg_txt").value=c[ckey];
			document.getElementById("pm").style.display="block";
		}

	}
	var a=JSON.parse(action);
	var akey;
	for (akey in a)
	{
		if (akey=="forwardingtopic")
		{
	   		document.getElementById("prestopic_txt").value=a[akey];
			document.getElementById("pq").style.display="block";
		}

		if (akey=="forwardingmsg")
		{
	   		document.getElementById("presmsg_txt").value=a[akey];
			document.getElementById("pr").style.display="block";
		}
		if (akey=="username")
		{
			document.getElementById("puser").style.display="block";
			document.getElementById("uname_txt").value=a[akey];
		}
		
	}

	var $form=$("#myform");
	var f=$form
	var u=$form.attr("action")+"?"+$form.serialize();

	$.ajax({
		url: '/editrule',
		data: $("form[name='myform']").serialize(),
		type: "POST",
		async:true,
		success:function () {  }
	});
	$("#paid_txt").appendTo("#pa");
	$("#pid_txt").appendTo("#pi");
	$("#preqtopic_txt").appendTo("#pt");
	$("#preqmsg_txt").appendTo("#pm");
	$("#prulecond_txt").appendTo("#pm");
	$("#prestopic_txt").appendTo("#pq");
	$("#presmsg_txt").appendTo("#pr");
	$("#pruletype_txt").appendTo("#prtype");
	$("#presmsg_txt").appendTo("#pr");

	getRuleEngine();
}

function getRuleEngine() {
	$.ajax({
		url: '/active/rule'+'?curr_time='+new Date().getTime(),
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			var px=document.getElementById("rule_table");
			while(px.rows[1]) px.deleteRow(1);
			var obj=JSON.parse(msg);
			var key;
			var pubactive=1;
			var pubrownumber=1;
			for (key in obj) {
				var pelt_tbl=document.getElementById("rule_table");
				var pubrow=pelt_tbl.insertRow(pubrownumber);
			  
				pubrownumber=pubrownumber+1;
				var pj=0;
				var p_aid;
				for (pj=0;pj<4;pj++) {
					if (obj[key][pj]=="0") {
						pubactive=0;
						break;
					}
					p_aid=obj[key][0];
					var pcell1=pubrow.insertCell(pj);
					pcell1.innerHTML=obj[key][pj];
					pcell1.style.fontWeight="normal";
					pcell1.style.textAlign="left";
					pcell1.id="rule"+p_aid+"c"+pj;
					if (pj==3) {
						var rpattern=obj[key][pj];
						var ruletxt;
						if (rpattern==50)
							ruletxt="Timer"
						else
						{
							if (rpattern<=2)
							{
								ruletxt="Client-Topic";
							}
							else if ((rpattern<7) || (rpattern==71) || (rpattern==72) || (rpattern==73) || (rpattern==74))  
								ruletxt="Topic-Message";
							else
								ruletxt="Client-Topic-Message";
						}
						pcell1.innerHTML=ruletxt;
					}
					pcell1.value=obj[key][pj];
					pcell1.setAttribute("name","rule"+p_aid+"c"+pj);
					if (pj==0)
						pcell1.style.display="none";
				   }

					if (pubactive != 0) {
						var cell2=pubrow.insertCell(pj);
						cell2.innerHTML="<img src='/static/images/dbedit.png' id=pub"+p_aid+"edit"+pj+" name=pub"+p_aid+"edit"+pj+"  style=width:20px;height:20px;cursor:pointer;align:left onclick=fnedit(this.id);>";
						cell2.style.textAlign="left";
						pj=pj+1;
						var cell3=pubrow.insertCell(pj);
						cell3.innerHTML="<img src='/static/images/dbdrop.png' id=pub"+p_aid+"drop"+pj+" name=pub"+p_aid+"drop"+pj+" style=width:20px;height:20px;cursor:pointer; onclick=fndrop(this.id);>";
						cell3.style.textAlign="left";
					}
				}
				if (pubactive==0) {
					var pelt_tbl=document.getElementById("rule_table");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="5";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="RULES ARE NOT YET DEFINED";
				}
		},
		error: function () {    }
	});
}


function fnsamemsg() {
	var a=document.getElementById("samemsg").checked;
	if(a==true) {
		document.getElementById("presmsg_txt").disabled=true;
		document.getElementById("presmsg_txt").placeholder="Send as received message";
		document.getElementById("presmsg_txt").value="MsgFORWARDED";
	}
	else {
		document.getElementById("presmsg_txt").disabled=false;
		document.getElementById("presmsg_txt").placeholder="Enter Message";
		document.getElementById("presmsg_txt").value="";
	}
	$("#paid_txt").appendTo("#pa");
	$("#pid_txt").appendTo("#pi");
	$("#preqtopic_txt").appendTo("#pt");
	$("#preqmsg_txt").appendTo("#pm");
	$("#prulecond_txt").appendTo("#pm");
	$("#prestopic_txt").appendTo("#pq");
	$("#presmsg_txt").appendTo("#pr");
	$("#pruletype_txt").appendTo("#prtype");
}
function disp_detail(id) {
	logcount=0;
	var xdetail1=document.getElementsByClassName("detail");
	var xd;
	for(xd=0;xd<xdetail1.length;xd++) {
		xdetail1[xd].style.backgroundColor="#ffffff";
		xdetail1[xd].style.border="none";
		xdetail1[xd].style.color="#000000";
	}

	document.getElementById("Devices").className="tabcontent active";
	var xdetail=document.getElementById("device"+escape(id));
	if(xdetail) {
		xdetail.style.borderLeft="3px solid transparent";
		xdetail.style.borderColor="#337ab7";
		xdetail.style.color="#000000";
	}
	var xdetail1=document.getElementById("device"+id);
	if(xdetail1) {
		xdetail1.style.borderLeft="3px solid transparent";
		xdetail1.style.borderColor="#337ab7";
		xdetail1.style.color="#000000";
	}

	devid=0;
	var elt=document.getElementById("pub_track");
	elt.innerHTML="";
	var u="/client/get?a="+id+"&curr_time="+new Date().getTime();

	$.ajax({
		url: u,
	    type: "GET",
 		dataType: "text",
    	async:true,
     	success: function (msg) {
			var obj=JSON.parse(msg);
			document.getElementById("d_name").value=obj[0];
			document.getElementById("d_desc").value=timeConverter(obj[2]);
			$("#ipaddr-value").val(obj[4]);
			document.getElementById("d_type").value='';
			if(obj[3] == 2) {
				$("#con-status").attr("style", "color : green")
				$("#con-status").text("Online");
			}
			else {
				$("#con-status").attr("style", "color : red")
				$("#con-status").text("Offline");
			}
		},
		error: function () {
		}
	});

	var u="/singleclient/will/get?a="+id+"&curr_time="+new Date().getTime();
	$.ajax({
		url: u,
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			var ind1=msg.indexOf("[");
			var ind2=msg.indexOf("]");
			var willmsg=msg.slice(ind1,ind2+1);
			ind1=msg.indexOf("{");
			ind2=msg.indexOf("}");
			var timemsg=msg.slice(ind1,ind2+1);
			var timeobj=JSON.parse(timemsg);
			broker_start_time=parseInt(timeobj["0"]);
			var dd=new Date(broker_start_time);
			var xx=new Date();
			var ss=timeDiff(xx,dd);
			var obj=JSON.parse(willmsg);
			document.getElementById("edit").className='hidden';
			document.getElementById("will_topic").value=obj[1];
			document.getElementById("will_msg").value=obj[2];
			if (obj[4]==0) {
				document.getElementById("will_retain").value="0-Retain Flag is not set";
			}
			else if (obj[4]==1) {
				document.getElementById("will_retain").value="1-Retain Flag is set";
			}
			else  {
				document.getElementById("will_retain").value="NIL";
			}
		},
		error: function () {
		}
	});

	var u="/singleclient/pub/get?a="+id+"&offsetvalue=0"+"&curr_time="+new Date().getTime();
	
	$.ajax({
		url: u,
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			var obj=JSON.parse(msg);
			var px1=document.getElementById("pub_table");
			while(px1.rows[1]) px1.deleteRow(1);
			var rownumber=1;
			pubcount=10;
			var pubtrack=document.getElementById("pub_track");
			pubtrack.innerHTML="";
			pubtrack.innerHTML=pubtrack.innerHTML+"<li class=pub0><a class=pubset  style=cursor:pointer id=firstpubi name=firstpubi onclick=next_pub_disp(1,id)>&laquo;</a></li>";
			pubtrack.innerHTML=pubtrack.innerHTML+"<li class=pub1 name=pub1><a class=pubset  style=cursor:pointer;background-color:#ecf0f5 id=apub1 name=apub1 onclick=next_pub_disp(1,id)>1</a></li>";

			for (var key in obj) {
				if (rownumber>10) {
					rownumber=rownumber+1;
					if (rownumber==12) {
						pubtrack.innerHTML=pubtrack.innerHTML+"<li class=pub2><a class=pubset  style=cursor:pointer id=apub2 name=apub2 onclick=next_pub_disp(2,id)>2</a></li>"
						continue;
					}
					else if (rownumber==21) {
						pubtrack.innerHTML=pubtrack.innerHTML+"<li class=pub3><a class=pubset  style=cursor:pointer id=apub3 name=apub3 onclick=next_pub_disp(3,id)>3</a></li>"
						break;
					}
				}
				if (rownumber<=10) {
					var row=px1.insertRow(rownumber);
					var c1=0;
					for (var j=1;j<4;j++) {
						var cell1=row.insertCell(c1);
						cell1.style.width="180px";
						if (obj[key][j]=="NIL") data=0;
						if (j==3) {
							if (obj[key][j]==0) pqos="0-Atmost Once";
							else if (obj[key][j]==1) pqos="1-Atleast Once";
							else if (obj[key][j]==2) pqos="2-Exactly Once";
							else pqos=obj[key][j];

							cell1.innerHTML=pqos;
							cell1.value=pqos;
							cell1.style.textAlign="left";
							cell1.style.fontWeight="normal";
							cell1.style.wordBreak="break-all";
						}
						else {
							cell1.innerHTML=obj[key][j];
							cell1.value=obj[key][j];
							//cell1.style.width="180px";
							cell1.style.textAlign="left";
							cell1.style.fontWeight="normal";
							cell1.style.wordBreak="break-all";
						}
						c1=c1+1;
					}
					rownumber=rownumber+1;
				}
			}
			var list_size=$('#pub_track li').size();
			pubtrack.innerHTML=pubtrack.innerHTML+"<li id=publast name=publast><a class=publastclass  style=cursor:pointer id=lastpubi name=lastpubi onclick=last_pub_disp(id)>&raquo;</a></li>";
		},
		error: function () {    }
	});



	var u="/singleclient/sub/get?a="+id+"&offsetvalue=0"+"&curr_time="+new Date().getTime();

	$.ajax({
		url: u,

		type: "GET",

		dataType: "text",
		async:true,
		success: function (msg) {
			var obj=JSON.parse(msg);
			var px1=document.getElementById("sub_table");
			while(px1.rows[1]) px1.deleteRow(1);
			var rownumber=1;
			pubcount=10;
			var subtrack=document.getElementById("sub_track");
			subtrack.innerHTML="";
			subtrack.innerHTML=subtrack.innerHTML+"<li class=sub0><a class=subset  style=cursor:pointer id=firstsubi name=firstsubi onclick=next_sub_disp(1,id)>&laquo;</a></li>";
			subtrack.innerHTML=subtrack.innerHTML+"<li class=sub1 name=sub1><a class=subset  style=cursor:pointer;background-color:#ecf0f5 id=asub1 name=asub1 onclick=next_sub_disp(1,id)>1</a></li>";

			for (var key in obj) {
				if (rownumber>10) {
					rownumber=rownumber+1;
					if (rownumber==12) {
						subtrack.innerHTML=subtrack.innerHTML+"<li class=sub2><a class=subset  style=cursor:pointer id=asub2 name=asub2 onclick=next_sub_disp(2,id)>2</a></li>"
						continue;
					}
					else if (rownumber==21) {
						subtrack.innerHTML=subtrack.innerHTML+"<li class=sub3><a class=subset  style=cursor:pointer id=asub3 name=asub3 onclick=next_sub_disp(3,id)>3</a></li>"
						break;
					}
				}
				if (rownumber<=10) {
					var row=px1.insertRow(rownumber);
					var c1=0;
					for (var j=1;j>=0;j--) {
						var cell1=row.insertCell(c1);
						cell1.style.width="180px";
						if (j==1) {
							cell1.innerHTML=obj[key][j];
							cell1.value=obj[key][j];
						}
						else {
							var lg_op=obj[key][j];
							if (obj[key][j]==0) lg_op="0-Atmost Once";
							else if (obj[key][j]==1) lg_op="1-Atleast Once";

							else if (obj[key][j]==2) lg_op="2-Exactly Once";
							cell1.innerHTML=lg_op;
							cell1.value=lg_op;		
						}
						cell1.style.width="180px";
						cell1.style.textAlign="left";
						cell1.style.fontWeight="normal";
						c1=c1+1;
					}
					rownumber=rownumber+1;
				}
			}
			var list_size=$('#sub_track li').size();
			subtrack.innerHTML=subtrack.innerHTML+"<li id=sublast name=sublast><a class=sublastclass  style=cursor:pointer id=lastsubi name=lastsubi onclick=last_sub_disp(id)>&raquo;</a></li>";
		},
		error: function () {
		}
	});
	
	var u="/singleclient/log/get?a="+id+"&curr_time="+new Date().getTime();

	$.ajax({
		url: u,
		type: "GET",
		dataType: "text",
		async:true,
		success: function (msg) {
			var obj=JSON.parse(msg);
			var px1=document.getElementById("log_table");
			while(px1.rows[1]) px1.deleteRow(1);
			var rownumber=1;
			logcount=10;
			var logtrack=document.getElementById("log_track");
			var data=1;
			logtrack.innerHTML="";
			logtrack.innerHTML=logtrack.innerHTML+"<li class=log0><a class=logset  style=cursor:pointer id=firstlogi name=firstlogi onclick=next_log_disp(1,id)>&laquo;</a></li>";
			logtrack.innerHTML=logtrack.innerHTML+"<li class=log1 name=log1><a class=logset  style=cursor:pointer;background-color:#ecf0f5 id=alog1 name=alog1 onclick=next_log_disp(1,id)>1</a></li>";
			for (var key in obj) {
				if (rownumber>10) {
					rownumber=rownumber+1;
					if (rownumber==12) {
						logtrack.innerHTML=logtrack.innerHTML+"<li class=log2><a class=logset  style=cursor:pointer id=alog2 name=alog2 onclick=next_log_disp(2,id)>2</a></li>"
						continue;
					}
					else if (rownumber==21) {
						logtrack.innerHTML=logtrack.innerHTML+"<li class=log3><a class=logset  style=cursor:pointer id=alog3 name=alog3 onclick=next_log_disp(3,id)>3</a></li>"
						break;
					}
				}
				if (rownumber<=10) {
					var row=px1.insertRow(rownumber);
					var c1=0;
					for (var j=0;j<3;j++) {
						var cell1=row.insertCell(c1);
						//cell1.style.width="180px";
						cell1.style.textAlign="left";
						cell1.style.fontWeight="normal";
						cell1.style.wordBreak="break-all";

						if (obj[key][j]=="NIL") data=0;
						if (j==0) {
							if (obj[key][j]=="0") {data=0;break;}
							else {
								cell1.innerHTML=timeConverter(obj[key][j]);
								cell1.value=timeConverter(obj[key][j]);
							}
						}
	/* else if (j==3)
	{
		if (obj[key][j]==0) lg_op="0-Atmost Once";
		else if (obj[key][j]==1) lg_op="1-Atleast Once";

		else if (obj[key][j]==2) lg_op="2-Exactly Once";

		else lg_op=obj[key][j];
		cell1.innerHTML=lg_op;
		cell1.value=lg_op;



	} */
						else {
							cell1.innerHTML=obj[key][j];
							cell1.value=obj[key][j];
						}
						c1=c1+1;
   					}
   					rownumber=rownumber+1;
   				}
   				if (data==0) {
					var pelt_tbl=document.getElementById("log_table");
					var pubrow=pelt_tbl.insertRow(1);
					var pcell1=pubrow.insertCell(0);
					pcell1.colSpan="3";
					pcell1.style.fontWeight="normal";
					pcell1.innerHTML="NO MESSAGE LOG";
				}
			}
			var list_size=$('#log_track li').size();
			logtrack.innerHTML=logtrack.innerHTML+"<li id=loglast name=loglast><a class=loglastclass  style=cursor:pointer id=lastlogi name=lastlogi onclick=last_log_disp(id)>&raquo;</a></li>";
		},
	    error: function () {
	    }
	});


	reloadSub(id);



}


function reloadSub(id) {
    $.ajax({
      url: '/active/subscribe?id='+id+'&curr_time='+new Date().getTime(),
      type: "GET",
      dataType: "text",
      async:true,
      success: function (msg) {
        var obj=JSON.parse(msg);
        $("#topic-selector").html("");
        if($("#con-status").text() == "Offline") {
          $("#dev-off-content").attr("style", "display: Block;text-align: center; font-size: 30px");
          $("#dev-no-sub").attr("style", "display: none;");
          $("#dev-ind-msg").attr("style", "display: none;");
          return false;
        }
        else if(obj["topic"].length == 0) {
          $("#dev-no-sub").attr("style", "display: Block; text-align: center; font-size: 30px;");
          $("#dev-off-content").attr("style", "display: none;");
          $("#dev-ind-msg").attr("style", "display: none;");
          return false;
        }
        $("#topic-selector").append('<option value="select_topic">Select Topic</option>');
        for(var i = 0; i < obj["topic"].length; i++) {
          $("#topic-selector").append('<option value="'+obj["topic"][i]+'">'+obj["topic"][i]+'</option>');
        }
        $("#dev-no-sub").attr("style", "display: none;");
        $("#dev-off-content").attr("style", "display: none;");
        $("#dev-ind-msg").attr("style", "display: Block;");
      },
        error: function () {    }
    });
  }


function openMsg(evt, msg) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(msg).style.display = "block";
    evt.currentTarget.className += " active";
}


/*THIS METHOD WEBSOCKETPUSH() WILL DELIVER THE DATA TO THE WEB CLIENT OF THE MQTT BROKER.
 WE HAVE USED THIS METHOD TO AUTOMATICALLY POPULATE THE DATA ON THE UI.
 WHEN YOU CHANGE YOUR USER INTERFACE, YOU CAN ALSO CHANGE THIS OR ADD NEW CODE TO UPDATE YOUR UI ELEMENTS AS WELL. */

function WebSocketPush()
{
	//var device_status_cnt = 0;
	if ("WebSocket" in window) {
		var ws = new WebSocket("ws://"+window.location.hostname+":8081");
		ws.onopen = function() {
			ws.send("routepublish");
		};

		ws.onmessage = function (evt) { 
		var received = evt.data;
		data = JSON.parse(received)
		//var recv = received.split("/");
		//var i;
		//clientName = document.getElementById("d_name").value;
		//rec_cli = recv[3];
		//alert(rec_cli);
		//senstype=recv[4];
		//alert(senstype);
		//alert(clientName);
		var client_count = parseInt($("#active_client").text());
		
		if(data["work"] == 'recv_pub') {
      		
      		$("#avg_msg_rate").text((parseInt($("#avg_msg_rate").text()))+ 1);
      		var tr_count = 0
	      	
	      	$("#pub_tbl tbody tr").each(function() {
	      		tr_count += 1
	      		if (tr_count >= 6) {
	      			$(this).remove();
	      		}
	      	})
	      	
	      	$("#pub_tbl tbody tr td:contains('NO PUBLISHED MESSAGES')").each(function() {
	      		$(this).parent().remove();
	      	})
	      	
	      	$("#pub_tbl tbody tr th").parent().after("<tr><td  style='font-weight: normal; width: 15%; text-align: left;word-break:break-all;'>"+data['id']+"</td><td  style='font-weight: normal; width: 25%; text-align: left;word-break:break-all;'>"+data['topic']+"</td><td  style='font-weight: normal;text-align: left;word-break:break-all;'>"+data['msg']+"</td><td  style='font-weight: normal; width:15%; text-align: left;'>"+timeConverter(data['time'] * 1000)+"</td></tr>")
	      	if(data['id'] == $("#d_name").val()) {
	      		var tr_count = 0
	      		

	      		$("#log_table tbody tr td:contains('NO MESSAGE LOG')").each(function() {
	      			$(this).parent().remove();
	      		});


	      		var contentWrapper = document.getElementById("alog1");
	      		var firstContent = document.getElementById("firstlogi");
	      		if(contentWrapper == null || contentWrapper.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);" || contentWrapper.getAttribute("style") == "cursor:pointer;background-color:#ecf0f5" || firstContent.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);") {


	      			$("#log_table tbody tr").each(function() {
	      			tr_count += 1
	      			if(tr_count >= 10) {
	      				$(this).remove();
	      			}
	      		})


	      			$("#log_table tbody tr th").parent().after("<tr><td  style='font-weight: normal; width: 230px; text-align: left;'>"+timeConverter(data['time'] * 1000 )+"</td><td  style='font-weight: normal; width: 230px; text-align: left;word-break:break-all;'>"+data['topic']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;word-break:break-all'>"+data['msg']+"</td></tr>")
	      		}
	      	}
	    }

	    else if(data["work"] == 'send' && data["status"] == 1) {
			if(data['id'] == $("#d_name").val()) {
				var tr_count = 0
				var data_qos = ''
				if(data["qos"] == 0 ){
					data_qos = "0-Atmost Once"
				}
				if(data["qos"] == 1 ){
					data_qos = "1-Atleast Once"
				}

				$("#pub_table tbody tr td:contains('NIL')").each(function() {
					$(this).parent().remove();
				});
				var contentWrapper = document.getElementById("apub1");
				var firstContent = document.getElementById("firstpubi");
				
				if(contentWrapper == null || contentWrapper.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);" || contentWrapper.getAttribute("style") == "cursor:pointer;background-color:#ecf0f5" || firstContent.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);") {
					$("#pub_table tbody tr td").each(function() {
						tr_count += 1
						if(tr_count >= 30) {
							$(this).parent().remove();
						}
					})
					$("#pub_table tbody tr th").parent().after("<tr><td  style='font-weight: normal; width: 230px; text-align: left;word-break:break-all;'>"+data['topic']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;word-break:break-all;'>"+data['msg']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;'>"+data_qos+"</td></tr>")
				}
			}
		}

	    else if(data["work"] == "errorlog") {
	    	if(document.getElementsByClassName("error-log").length > 4) {
      			$(".error-log").siblings(":last").remove();
      		}
      		$("#no-log").remove();
      		$(".error-log").attr("style", "margin-top: -14px;border-top: None;")
			var html = ""
			/*if(errorlog_cnt != 0) {
            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: -14px">'
            }
            else {*/
            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: 5px;border-top: None;">'
            //}
            html += '<div class="box-header with-border">'
            html += '  <h3 class="box-title">'
            html += data["error"]
            html += '</h3><div class="box-tools pull-right">'
            html += '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>'
            html += '</button></div></div>'
            html += '<div class="box-body"><label>Client Name :</label>'
            html += data["clientid"]+'<br><label>Client IP :</label>'+data["ip"]+'<br><label>Error :</label>'+data["detail"]+'<br><i class="pull-right">'+timeConverter(data['time'] * 1000)+'</i></div></div>'
            $("#error-log").prepend(html);
            $("#error-log-table").prepend('<tr><td style="font-weight: 500;">'+data["clientid"]+'</td><td style="font-weight: 500;">'+data["ip"]+'</td><td style="font-weight: 500;">'+data["detail"]+'</td><td style="font-weight: 500;">'+timeConverter(data["time"] * 1000)+'</td></tr>');
		}

	    else if(data["work"] == 'onsubscribe') {
	      	$("#sub_tbl tbody tr td:contains("+data['topic_name']+")").each(function() {
	      		$(this).parent().remove();
	      	})
	      	var  tr_count = 0;
	      	$("#sub_tbl tbody tr").each(function() {
	      		tr_count += 1;
	      		if(tr_count >= 6) {
		      			$(this).remove();
	      		}
	      	})
	      	$("#sub_tbl tbody tr td:contains('NO ACTIVE SUBSCRIBERS')").each(function() {
	      		$(this).parent().remove();
	      	})
	      	/*var j = 0;
	      	for(var i = 0; i < topicList.length; i++) {
	      		if(topicList[i] != data["topic"]) {
	      			j += 1;
				}
	      	}
	      	if(j == 0 ) {
	      		topicList.push(data["topic"])
	      		j = 1
	      	}
	      	var top_list_count = parseInt($("#active_topic").text())
	      	top_list_count += j
	      	$("#active_topic").text(top_list_count);*/
	      	$("#sub_tbl tbody tr th").parent().after("<tr><td  style='font-weight: normal; width: 230px; text-align: left;'>"+data['id']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;'>"+data['topic_name']+"</td></tr>")
      		
      		var data_qos = ''
	      		if(data["qos"] == 0 ){
	      			data_qos = "0-Atmost Once"
	      		}
	      		if(data["qos"] == 1 ){
	      			data_qos = "1-Atleast Once"
	      		}
      		if(data['id'] == $("#d_name").val()) {
      			$("#sub_table tbody tr td:contains("+data['topic_name']+")").each(function(){
	      			$(this).parent().remove();
	      		})
	      		$("#sub_table tbody tr td:contains('NIL')").each(function() {
	      			$(this).parent().remove();
	      		});

	      		var contentWrapper = document.getElementById("asub1");
	      		var firstContent = document.getElementById("firstsubi");
	      		if(contentWrapper == null || contentWrapper.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);" || contentWrapper.getAttribute("style") == "cursor:pointer;background-color:#ecf0f5" || firstContent.getAttribute("style") == "cursor: pointer; background-color: rgb(236, 240, 245);") {
	      			$("#sub_table tbody tr th").parent().after("<tr><td  style='font-weight: normal; width: 230px; text-align: left;'>"+data['topic_name']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;'>"+data_qos+"</td></tr>")
	      		}
      			reloadSub(data['id']);
      			

	      	}
      }

		else if(data["work"] == 'connect') {
			client_count += 1;
			$("#active_client").text(client_count)
			$("#disconnect_tbl tbody tr td:contains("+data['id']+")").each(function() {
				if($(this).text() == data["id"]) {
					$(this).parent().remove();
				}
			})
			$("#connect_tbl tbody tr td:contains('NO CONNECTED CLIENTS')").each(function() {
				$(this).parent().remove();
			});
			var topic = '';
			var tr_count= 0;
			$("#connect_tbl tbody tr").each(function() {
				tr_count += 1;
				if(tr_count >= 6) {
					$(this).remove();
				}
			});
			$("#connect_tbl tbody tr th").parent().after("<tr><td style='font-weight: normal; width: 230px; text-align: left;'>"+data['id']+"</td><td  style='font-weight: normal; width: 230px; text-align: left;'>"+timeConverter(data['time'] * 1000 )+"</td><td style='font-weight: normal; width: 230px; text-align: left;'>"+data["ipaddr"]+"</td></tr>")
			
			dev_count = $('#device li').size();
			$("#device li a:contains("+data['id']+")").each(function() {
				if(($(this).text()).replace(" ", "") == data["id"]) {
					$(this).parent().remove();
				}
			});

			var li_count  = 0;
			$("#device li").each(function() {
				li_count += 1
				if(li_count > 9) {
					$(this).remove();
				}
			})
			
			var on_clk_device = "'"+data["id"]+"'"
			$("#device").prepend('<li value="0" style="cursor: pointer; pointer-events: auto; padding: 4px;"><a class="detail" id="device'+data["id"]+'" name="device'+data["id"]+'" onclick="disp_detail('+on_clk_device+');" style="background-color: rgb(255, 255, 255); border: none; color: rgb(0, 0, 0); cursor: pointer;"><i class="fa fa-circle-o"></i>'+data["id"]+' <img src="/static/images/green.png" style="position : absolute; top: 17px; right : 12px; width : 8px"></a></li>');

			if(dev_count == 0) {
				$("#d_name").val(data['id']);
				$("#ipaddr-value").val(data["ipaddr"]);
				$("#d_desc").val(timeConverter(data['time'] * 1000 ));
				$("#device"+data['id']).removeAttr("style");
				$("#device"+data['id']).attr("style", "background-color: rgb(255, 255, 255); border-left: 3px solid rgb(51, 122, 183);cursor: pointer;")
			}

			if(data['id'] == $("#d_name").val()) {
				$("#con-status").attr("style", "color : green")
				$("#con-status").text("Online");
				reloadSub(data['id']);
			}

			/*var html = ""
			if(device_status_cnt != 0) {
            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: -14px">'
            }
            else {
            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: 5px;">'
            }
            html += '<div class="box-header with-border">'
            html += '  <h3 class="box-title">'
            html += data["id"]
            html += '</h3><div class="box-tools pull-right">'
            html += '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>'
            html += '</button></div></div>'
            html += '<div class="box-body"><label>Client Name :</label>'
            html += data["id"]+'<br><label>Client IP :</label>'+data["ipaddr"]+'<br><label>status :</label> Connected <br><i class="pull-right">'+timeConverter(data['time'] * 1000)+'</i></div></div>'
            $("#device-status").append(html);
            
            device_status_cnt ++;*/




		}
		else if(data["work"] == 'disconnect') {
			if(client_count >= 0) {
				client_count -= 1;
				if(client_count < 0){
					client_count = 0;
				}
				$("#active_client").text(client_count)
			}
			$("#connect_tbl tbody tr td:contains("+data['id']+")").each(function() {
				if($(this).text() == data["id"]) {
					$(this).parent().remove();
				}
				//var html = ""
			})
				$("#disconnect_tbl tbody tr td:contains('NO DISCONNECTED CLIENTS')").each(function() {
				$(this).parent().remove();
				//var html = ""
			})
			var tr_count = 0;
			$("#disconnect_tbl tbody tr").each(function() {
				tr_count += 1;
				if(tr_count >= 6) {
					$(this).remove();
				}
			});
			if(data['id'] == $("#d_name").val()) {
				$("#con-status").attr("style", "color : red")
				$("#con-status").text("Offline");
				$("#dev-off-content").attr("style", "display: Block;text-align: center; font-size: 30px");
          $("#dev-no-sub").attr("style", "display: none;");
          $("#dev-ind-msg").attr("style", "display: none;");
			}
				/*$("#device li a:contains("+data['id']+")").each(function() {
				$(this).parent().remove();
				})*/
			$("#device"+data["id"]+" img").attr("src","/static/images/red.png");

			$("#disconnect_tbl tbody tr th").parent().after("<tr><td style='font-weight: normal; width: 230px; text-align: left;'>"+data['id']+"</td><td style='font-weight: normal; width: 230px; text-align: left;'>"+timeConverter(data['time'] * 1000 )+"</td></tr>")
		}



      	/*value = recv[6];
      	//alert(value);
      	if(clientName == rec_cli) {
      		if(senstype=="TempSensor")
      		{

      			$(".temp").val(value)
      		}
      		else if(senstype=="DoorSensor")
      		{
      			if(value == "0") { 
      				$(".door").val("Open")
      			}
      			else {
					$(".door").val("Closed")
      			}
      		}
      		else if(senstype=="PIRSensor")
      		{
      			if(value == "0") { 
      				$(".person").val("Available")
      			}
      			else {
      				$(".person").val("Not Available")
      			}
      		}
      	}*/
      	
      	//$(".temp").val(recv[2])
      };        
      ws.onclose = function(evt)
      { 
		setTimeout(function() { 
			WebSocketPush(); 
		}, 5000);      	
        var received_msg = evt.data;
      };
            
      window.onbeforeunload = function(event) {
        ws.close();
      };
    }
            
    else
    {;
    }
}



function show_searched_device(tab) {
    $("#"+tab).hide();
    if("dev_head" == tab) {
      $("#dev_search").show();
    }
    else if("dev_search" == tab) {
    	if($("#device_search").val() == "" || $("#device_search").val() == " ") {
    		$("#dev_head").show();
    		return false;
    	}
    	var device = $("#device_search").val();
		$.ajax({
			url: '/searchedclient/count?a='+device+'&curr_time='+new Date().getTime(),
			type: "GET",
			dataType: "text",
			async:false,
			success: function (result) {
				result = JSON.parse(result);
				clientcount = result["cunt"];
			},
			error: function () {
			}
		});
		var devtrack=document.getElementById("dev_track");
		devtrack.innerHTML="";
		if (clientcount>10) {
			var n=parseInt(clientcount/10)+1;
			var i=0;
			while (i<n) {
				if (i==0) {
					devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a class=example  style=cursor:pointer;  id=firsti name=firsti onclick=setnextclk("+i+",id)>&laquo;</a></li>";	
					devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example style=cursor:pointer;background-color:#ecf0f5  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";
				}
				else
					devtrack.innerHTML=devtrack.innerHTML+"<li class=dev"+i+"><a  class=example style=cursor:pointer  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";
				i=i+1;
				if (i>4)
					break;
			}
			devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";	
		}
		else {
			devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=firsti name=firsti onclick=setnextclk(0,id)>&laquo;</a></li>";
			devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=1 name=1 onclick=setnextclk(0,id)>1</a></li>";
			devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";				
		}
		setnextclk(0);
		$("#dev_head").show();
	}
}


function deviceReset() {
	$('#device_search').val('');
	$("#dev_search").hide();
    $("#dev_head").show();
	$.ajax({
		url: '/client/count?curr_time='+new Date().getTime(),
		type: "GET",
		dataType: "text",
		async:false,
		success: function (msg) {
			var obj=JSON.parse(msg);
			clientcount=obj[1];
		},
		error: function () {
			//ErrorFunction();
		}
	});
	var devtrack=document.getElementById("dev_track");
	devtrack.innerHTML="";
	if (clientcount>10) {
		var n=parseInt(clientcount/10)+1;
		var i=0;
		while (i<n) {
			if (i==0) {
				devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a class=example  style=cursor:pointer;  id=firsti name=firsti onclick=setnextclk("+i+",id)>&laquo;</a></li>";	
				devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example style=cursor:pointer;background-color:#ecf0f5  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";
			}
			else
				devtrack.innerHTML=devtrack.innerHTML+"<li class=dev"+i+"><a  class=example style=cursor:pointer  id="+i+" name="+i+" onclick=setnextclk("+i+",id)>"+(i+1)+"</a></li>";
				i=i+1;
				if (i>4)
					break;
			}
			devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";	
		}
	else {
		devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=firsti name=firsti onclick=setnextclk(0,id)>&laquo;</a></li>";
		devtrack.innerHTML=devtrack.innerHTML+"<li class=dev0><a  class=example  style=cursor:pointer id=1 name=1 onclick=setnextclk(0,id)>1</a></li>";
		devtrack.innerHTML=devtrack.innerHTML+"<li class=devlast><a  class=example  style=cursor:pointer id=lastdevi name=lastdevi onclick=last_dev_disp()>&raquo;</a></li>";				
	}
	var list_size=$('#dev_track li').size();
	var rec_count_start=0;
	var rec_count_end=rec_count_start+12;
	if (rec_count_start==0) {
		$('#dev_track li:gt(-1)').show();
		var x=(5 <= list_size) ? 5 : list_size;
		$('#dev_track li:lt('+(x+1)+')').show();
		$('#dev_track li:gt('+x+')').hide();
		$('#dev_track li:gt('+(list_size-2)+')').show();
	}
	else {
		$('#dev_track li:lt('+(rec_count_start+1)+')').hide();
		$('#dev_track li:gt('+rec_count_start+')').show();
	}
	setnextclk(0);
}


function getErrorLog() {
	var errorlog_cnt = 0;
	$.ajax({
		url: '/geterrorlog?curr_time='+new Date().getTime(),
		type: "GET",
		dataType: "text",
		success: function (msg) {
			var obj=JSON.parse(msg);
			obj = obj["data"];
			if(obj.length > 4) len = 5
			else len= obj.length;
			$("#error-log").html("");
			if( obj.length == 0) {
				$("#error-log").append("<h5 style='font-size: large;text-align:center;' id='no-log'>NO ERROR HISTORY</h3>");
				return false;
			}
			for (var i = 0; i < len; i++) {
				var html = ""
				if(errorlog_cnt != 0) {
	            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: -14px; border-top: None;">'
	            }
	            else {
	            	html = '<div class="box box-default collapsed-box error-log" style="margin-top: 5px;border-top: None;">'
	            }
	            html += '<div class="box-header with-border">'
	            html += '  <h3 class="box-title">'
	            html += obj[i]["error"]
	            html += '</h3><div class="box-tools pull-right">'
	            html += '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>'
	            html += '</button></div></div>'
	            html += '<div class="box-body"><label>Client Name :</label>'
	            html += obj[i]["client_id"]+'<br><label>Client IP :</label>'+obj[i]["ip"]+'<br><label>Error :</label>'+obj[i]["detail"]+'<br><i class="pull-right">'+timeConverter(obj[i]['time'] * 1000)+'</i></div></div>'
	            $("#error-log").append(html);
	            errorlog_cnt ++;
	        }
			for(var i = 0; i < obj.length; i++) {
				$("#error-log-table").append('<tr><td style="font-weight: 500;">'+obj[i]["client_id"]+'</td><td style="font-weight: 500;">'+obj[i]["ip"]+'</td><td style="font-weight: 500;">'+obj[i]["detail"]+'</td><td style="font-weight: 500;">'+timeConverter(obj[i]["time"] * 1000)+'</td></tr>');
			}
		},
		error: function () {
			//ErrorFunction();
		}
	});
}