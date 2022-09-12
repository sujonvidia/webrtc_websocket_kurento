var filedata = [], audiofile = [], imgfile = [], otherfile = [], videofile = [], formDataTemp = []; // file upload related
var temp_str_for_rep = "";

var task_join_into_room = () =>{
	var alltodoli = $('.com-t-l');
    var all_my_activity_id = [];
    $.each(alltodoli, function(k,v){
		if($(v).attr('data-activityid') != "")
        	all_my_activity_id.push($(v).attr('data-activityid'));
	});

	if(all_my_activity_id.length > 0){
		socket.emit('todochat_join', {all_my_activity_id, user_id}, (res) =>{
			if(res.status){
				$.each(res.data.all_unread, function(k, v){
					draw_ur_count(v.activity_id);
					if($("#activity_"+v.activity_id).hasClass('selected')){
						$('#chat_icon>img').attr('src', '/images/basicAssets/Chat_active.svg');
						$('#chat_icon>img').css({'width': '14px', 'height': '14px'});
					}
				});
			}
		});
	}
}

var subtask_join_into_room = () =>{
	setTimeout(function(){
		var allsubtask = $(".pulse-component");
		$.each(allsubtask, function(k,v){
			if(typeof $(v).attr('data-id') !== "undefined"){
				all_subtask_inthis_task.push($(v).attr('data-id'));
			}
		});
		if(all_subtask_inthis_task.length > 0){
			var all_my_activity_id = all_subtask_inthis_task;
			socket.emit('todochat_join', {all_my_activity_id, user_id}, (res) =>{
				if(res.status){
					$.each(res.data.all_unread, function(k, v){
						draw_ur_count(v.activity_id);
					});
				}
			});

			find_unread_note_count(all_subtask_inthis_task, user_id, 'subtask');
		}
	}, 2000);
};


var scrollToBottom = (target) => {
	$(target).animate({ scrollTop: $(target).prop("scrollHeight") }, 500);
};

var find_new_reply = (activity_id) =>{
	if (!validate.isEmpty(activity_id)) {		
		socket.emit('has_new_reply', {activity_id, user_id}, (res) =>{
			if(res.unread_replay.length>0){
				$('#chat_icon>img').attr('src', '/images/basicAssets/Chat_active.svg');
				$('#chat_icon>img').css({'width': '14px', 'height': '14px'});
			}
			else{
				if($("#activity_"+activity_id).attr("data-urm")==0){
					$('#chat_icon>img').attr('src', '/images/basicAssets/Chat.svg');
					$('#chat_icon>img').css({'width': '14px', 'height': '14px'});
				}
			}
		});
	}
};

var open_file_browser_for_send_msg = (elem) => {
	var activity_id = $(elem).attr('data-myid');

	if (typeof activity_id == 'undefined') {
		alert("please select a todo, then click here");
	} else if (activity_id == "") {
		open_file_browser();
		$("#uploadbtn").hide();
		$("#uploadbtn_f_todo").show();
	} else {
		open_file_browser();
			
		if($(elem).attr('data-type') == 'task'){
			$("#uploadbtn").show();
			$("#uploadbtn_f_todo").hide();
			$("#chat_icon").trigger('click');
			$("#chat_icon").addClass('fromOutsideLiveChat');
		}else if($(elem).attr('data-type') == 'subtask'){
			$('#subtaskProperty').show();
			openSubtaskChat(activity_id);
		}
		
	}
};

// open the todo live chat for todo
$("#chat_icon").click(function (event) {
	$('.todos-chat-write').show();
	$('.task-edit-write').hide();
	$('#live-chat').find('.todo-chat-body').css('height','calc(100vh - 194px)');
	var activity_id = $(event.target).attr('data-activity_id');
	var all_activity = myAllActivityGlobal;
	all_activity.push(activity_id);
    if(typeof activity_id == 'undefined'){
        alert("please select a todo, then click here");
    }else{
		if($('#activity_'+activity_id).length == 1){ // Task Chat
			var room_title = $('#activity_'+activity_id).find('.toDoName').html();
			$('.todo_chat_room_title').html(room_title);
		}else{ // Subtask Chat
			var room_title = $('#pulse_'+activity_id).find('.name-cell .pulse_title').text();
			$('.todo_chat_room_title').html(room_title);
			if($('#pulse_'+activity_id).find(".more_files").hasClass("newNoti")){
				$('#pulse_'+activity_id).find(".more_files").removeClass("newNoti");
				$('#pulse_'+activity_id).find(".subtask_chat").attr("data-unseen", "");
			}
		}
		
        $('#chatbox').attr('placeholder', 'Message '+ room_title +' …');
        $("#live-chat").removeClass();
        $("#live-chat").addClass('live_chat_box_'+activity_id);
        $('#chatboxEditor').hide();
        $('#live-chat .ql-toolbar.ql-snow').hide();
        $('#chatbox').show();
        $("#live-chat").show();
        $('.chat-history').html("");
        if($('#actCre').val() == user_id)
            if($('#activity_'+activity_id).attr('data-urm') > 0)
                $('#activity_'+activity_id).append('<span class="remove" onclick="hideThisTodo(event,\''+activity_id+'\')"></span>');
        $('#chat_icon>img').attr('src', '/images/basicAssets/Chat.svg');
        $('#activity_'+activity_id).attr('data-urm', 0);
        $('#activity_'+activity_id).find('.unreadMsgCount').html("");
        var arg_data = {activity_id: activity_id, all_activity: all_activity, user_id: user_id};

        var has_reply_msgid = [];
        socket.emit('find_todo_chat_history', arg_data, (res_data) =>{
            if(res_data.status == true){
                $('.msgNotFound').remove();
            }else{
                if($('.msgNotFound').length < 1)
                $('.chat-history').append('<h1 class="msgNotFound">No messages found in this thread !</h1>');
            }
            var numsl = []; // need_update_message_seen_list
            if(res_data.status){
                $.each(res_data.conversation, function(k, v){
                    if (v.msg_status == null) {
    					if (v.sender == user_id) {
    						// This msg send by this user; so no need to change any seen status
    					} else {
    						// This msg receive by this user; so need to change seen status
    						numsl.push({msg_id: v.msg_id, activity_id: v.activity_id});
    					}
    				}

    				// If msg status have some user id, then
    				else {
    					if (v.msg_status.indexOf(user_id) > -1) {
    						// This msg already this user seen
    					} else {
    						if (v.sender != user_id) {
    							// This msg receive by this user; so need to change seen status
    							numsl.push({msg_id: v.msg_id, activity_id: v.activity_id});
    						}
    					}
    				}
    				if(numsl.length == 1)
    					draw_urhr();
                    if(v.has_reply > 0)
						has_reply_msgid.push(v.msg_id);
						
					if(v.activity_id != activity_id)
						per_todo_msg(v, true, 'subtask #'+$('#pulse_'+v.activity_id).find('.row_pluse_count').text());
					else
						per_todo_msg(v, true);
                });
				scrollToBottom('.chat-history');

                if(numsl.length > 1)
                    find_urhr_add_s(numsl.length);

                if(has_reply_msgid.length > 0){
                    socket.emit('find_unread_reply', {has_reply_msgid, activity_id, user_id}, (rep)=>{
                        if(rep.reply.length>0){
                            $.each(rep.reply, function(k, v){
                                $.each(rep.msgs, function(kk, vv){
                                    if(vv.activity_id == v.rep_id){
                                        if(vv.sender != user_id && (vv.msg_status == null || (vv.msg_status).indexOf(user_id) == -1) ){
                                            v.nour = (v.nour>0)?v.nour+1:1;
                                        }
                                    }
                                });
                            });
                            $.each(rep.reply, function(k, v){
                                if(v.nour>0){
                                    $('.todo_msgid_'+v.msg_id).find('.replyicon').attr('src','/images/basicAssets/custom_thread_for_reply_unread.svg');
                                    var msg = (v.nour>1)?' replies':' reply';
                                    $('.todo_msgid_'+v.msg_id).find('.last_rep_text').append('<span class="urtext">&nbsp;(<span class="urrepno">'+ v.nour +'<span> new '+ msg +')<span>');
                                }
                            });
                        }
                    });
                }

				if(chatmessagestag != undefined){
					if(chatmessagestag.length>0){
						$.each(chatmessagestag, function(k,v){
							msgIdsFtag.push(v.id);
							if(v.tag_title != undefined){
								if (v.tag_title !== null) {
									if (v.tag_title.length > 0) {
										$.each(v.tag_title, function (kt, vt) {
											$("#filesTag" + v.message_id).append('<span class="filesTag">' + vt + '</span>');
										});
										$("#filesTag" + v.message_id).show();
										$("#filesTagHolder" + v.message_id).show();
									}
								}
							}
						});
					}
                }

                if (numsl.length > 0) {
                    var arg_data2 = { msg_act: numsl, user_id: user_id };
					socket.emit('update_todo_msg_status_mul', arg_data2);
					var subrows = $(".pulse-component");
					$.each(subrows, function(k, v){
						$(v).find('.more_files').removeClass('newNoti');
					});
    			}
            }
        });

        // Floating Date in the top bar
		$('.todo-chat-body .os-viewport').on('scroll', function () {
			var scrollTop = $('.todo-chat-body .os-viewport').scrollTop();
    		if (scrollTop === 0)
    			$('#top-date').html("");
    		$(".msg-separetor:visible").each(function () {
    			var last = true;
    			if (last)
    				$(this).removeClass('not_visible');
    			if ($(this).offset().top < 100) {
    				last = false;
    				$(this).addClass("not_visible");
    				$('#top-date').html($('.not_visible').last().attr('data-date'));
    			}
    		});
    	});
    }
    // if($(".chat-history").html() == ""){
    //     console.log('null')
    // }else{
    //     console.log('find')
	// }
	
	$('#live-chat').find('.headLabelTitle p').text('Task Chat');
    $('#live-chat').find('.headLabelTitle').css('width','90px');
});
// end open the todo live chat for todo


// close todo live chat
$('.chat-close').click(function () {
	var aid = getCookie('lastActive');
	$("#chat_icon").attr('data-activity_id', aid);
	$('.task-edit-write').hide();
    $("#live-chat").css('display', 'none');
    $("#todo_chat_search_input").val("");
    temp_str_for_rep = "";
    hide_search_input();
	if ($('#live-chat').is(':visible')) {
		var activity_id = $('#chat_icon').attr('data-activity_id');
	}else{
		var activity_id = $('.property_notes').attr('data-batch_id');
	}
    find_new_reply(activity_id);
    $('#chatboxEditor').hide();
    $('#live-chat .ql-toolbar.ql-snow').hide();
    $('#chatbox').show();
});
// end close todo live chat


// send message from todo live chat
// $('#chatbox').keypress(function (event) {
$('#chatbox').on('keydown', function(event) {

	var code = event.keyCode || event.which;
  	if (code == 13 && !event.shiftKey) { //Enter keycode = 13

		event.preventDefault();
		event.stopImmediatePropagation();
		todo_msg_send();
	}
  // When typing start into message box
  if (typing === false) {
	if ($('#live-chat').is(':visible')) {
		var activity_id = $('#chat_icon').attr('data-activity_id');
	}else{
		var activity_id = $('.property_notes').attr('data-batch_id');
	}
    typing = true;
    socket.emit('todo_user_typing', {
        display: true,
        sender_id: user_id,
        sender_name: user_fullname,
        sender_img: user_img,
		activity_id: activity_id});
    timeout = setTimeout(timeoutFunction, 2000);
  }
});

var todo_msg_send = () =>{
	var str = $('#chatbox').html();
	if ($('#live-chat').is(':visible')) {
		var activity_id = $('#chat_icon').attr('data-activity_id');
	}else{
		var activity_id = $('.property_notes').attr('data-batch_id');
	}
	
    if(str != ""){
        var arg_data = {
                activity_id: activity_id,
                sender_id: user_id,
                sender_img: user_img,
                sender_name: user_fullname,
                text: str,
                attach_files: filedata[0],
                thread_root_id: 0,
                root_msg_id: 0,
				tags:tagListForFileAttach
			};
			
        socket.emit('todo_send_message', arg_data, (res)=>{
            filedata.length = 0; filedata = [];
            audiofile.length = 0; audiofile = [];
            imgfile.length = 0; imgfile = [];
            otherfile.length = 0; otherfile = [];
            videofile.length = 0; videofile = [];
            formDataTemp.length = 0; formDataTemp = [];
		});
		
        $('#chatbox').html("");
        $('#chatbox').focus();
    }
};
// end send message from todo live chat


// get a new todo msg
// if same thread is open then draw it
// or draw the counter
socket.on('todo_msg_receive', function(data){
	$('.msg-separetor-unread').hide();
    $('.msgNotFound').remove();
	$('.typing-indicator').html("");
	if(data.status){
		if($('.live_chat_box_'+data.msg.activity_id).is(':visible')){
			per_todo_msg(data.msg, true);

			// for tag listing while append new msg with file
			if(data.msg.attch_audiofile != null || data.msg.attch_imgfile != null || data.msg.attch_otherfile != null || data.msg.attch_videofile != null  ){
				if(tagListForFileAttach.length>0){
					$.each(tagListForFileAttach, function(kt,vt){
						$("#filesTag"+data.msg.msg_id).append('<span class="filesTag">'+vt+'</span>')
					});
					$("#filesTag"+data.msg.msg_id).show();
					$("#filesTagHolder"+data.msg.msg_id).show();
				}
			}
			scrollToBottom('.chat-history');
		}
		else if($('.property_notes').attr('data-batch_id') == data.msg.activity_id && $(".property_notes .chat-history").is(":visible")){
			$('.msgNotFound').remove();
			$('.chatEmptyMsg').remove();
			per_todo_msg(data.msg, true);
		}
    }
    else
        draw_ur_count(data.msg.activity_id);
});


// draw todo thread unread counter
var draw_ur_count = (activity_id) =>{
    if($("#activity_"+activity_id).length == 1){ // Task chat
		var nour = $("#activity_"+activity_id).attr("data-urm"); // number of unread = nour
		nour++;
		$("#activity_"+activity_id).attr("data-urm", nour);
		$("#activity_"+activity_id).find(".unreadMsgCount").html(nour);
		// $("#activity_"+activity_id).find(".unreadMsgCount").html(' ');
		$("#activity_"+activity_id).find(".remove").remove();
	}
	else{ // Subtask chat
		if($('#pulse_'+activity_id).find(".subtask_chat").hasClass("unseen")){
			var nour = $('#pulse_'+activity_id).find(".subtask_chat").attr("data-unseen"); // number of unread = nour
			nour++;
		}else{
			var nour = 1;
			$('#pulse_'+activity_id).find(".subtask_chat").addClass('unseen');
		}
		$('#pulse_'+activity_id).find(".more_files").addClass("newNoti");
		$('#pulse_'+activity_id).find(".subtask_chat").attr("data-unseen", nour);
	}
};


// draw unread msg group head
var draw_urhr = () =>{
	var html = '<div class="msg-separetor-unread"><p>1 new message</p></div>';
	$(".chat-history").append(html);
};
var find_urhr_add_s = (nour) =>{
	$(".chat-history").find('.msg-separetor-unread>p').html(nour + ' new messages');
};
 
// draw todo live chat per msg
var per_todo_msg = (data, append=true, isit_subtask='') =>{
    if (data.has_hide != null)
        if ((data.has_hide).indexOf(user_id) > -1)
            return;
        
    var attach_show = true, deletebtn_active = true, permanently = false;
    if (data.has_delete != null) {
        if ((data.has_delete).indexOf(user_id) == -1) {
            if ((data.has_delete).indexOf('Sender delete it') > -1) {
                data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> This message was deleted.</i><span  class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
                attach_show = false;
            }
        }
        else {
            data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> You deleted this message.</i><span class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
            attach_show = false;
        }
    }

    if (data.msg_body == "This message was deleted.") {
        data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> This message was deleted.</i><span  class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
        attach_show = false;
    }
    /* Start Date Group By */
    var msg_date = moment(data.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) {return '['+this.format("MMM Do, YYYY")+']';},
        sameElse: function(now) {return '['+this.format("MMM Do, YYYY")+']';}
    });
	var temp_date = msg_date;

    if(append){
        $.each($('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                msg_date = null;
                return 0;
            }
		});

        if(msg_date !== null && $('.msg-separetor-unread').length == 0){
            var date_html = '<div class="msg-separetor" data-date="'+ msg_date +'"><p>'+ msg_date +'</p></div>';
			$(".chat-history").append(date_html);
			
        }
    }
    /* End Date Group By */
	var html = '';
		if(isit_subtask != ''){
    		html +=  '<div class="chat-message clearfix todo_msgid_'+ data.msg_id +'" msg-type="subtask_msg" data-msgid="'+ data.msg_id +'">';
		}else{
			html +=  '<div class="chat-message clearfix todo_msgid_'+ data.msg_id +'" msg-type="task_msg" data-msgid="'+ data.msg_id +'">';
		}
		html +=         '<img class="user-imgs" src="'+ file_server +'profile-pic/Photos/'+ data.sender_img +'" alt="'+ data.sender_img +'">';
    	html +=         '<div class="chat-message-content clearfix" data-sendername="'+ data.sender_name +'">';
    	html +=             '<h5>';
    	html +=                 data.sender_name +'<span class="chat-time">'+ moment(data.created_at).format('h:mm a') +'</span>';
    // Check flag and unflag message
    if(data.has_flagged != null && (data.has_flagged).indexOf(user_id) != -1){

		html += '&nbsp;<img onclick="flaggedUserMsg(event)" class="flaggedMsg" src="/images/basicAssets/Flagged.svg">';
    }
    	html +=             '</h5>';
    if(data.attch_imgfile!==null || data.attch_videofile!==null || data.attch_otherfile!==null)
	{
		if(user_id === data.sender){if(attachFileList.indexOf(data.msg_id) === -1){attachFileList.push(data.msg_id);}}
		html +=			'<p class="chating_para_2">' + data.msg_body +'</p>';
	}else
		html +=			'<p class="chating_para_2">' + data.msg_body +'</p>';
	if(isit_subtask != '')
		html += '<p style="background: #3d76ea;color: #FFF;width: fit-content;padding: 0px 10px;border-radius: 10px;display:inline-flex">'+isit_subtask+'</p>';
    if(data.attch_videofile!==null){
        html += per_msg_video_attachment(data.attch_videofile);
    }
    if(data.attch_imgfile!==null){
        html += per_msg_img_attachment(data.attch_imgfile, data.sender_name, data.sender_img);
    }
    if(data.attch_audiofile!==null){
        // html += per_msg_audio_attachment(data.attch_audiofile);
        html += per_msg_file_attachment(data.attch_audiofile);
    }
    if(data.attch_otherfile!==null){
        html += per_msg_file_attachment(data.attch_otherfile);
    }
    html +=             '<div class="replies">';
    // Check emoji reaction message
    if(data.has_emoji !== null){
        $.each(data.has_emoji, function(k, v){
            if(v>0)
            html += taskEmoji_html(k, "/images/emoji/"+ k +".svg", v);
        });
    }
    html +=             '</div>';
    if(data.has_reply > 0){
        html += taskPer_msg_rep_btn(data.has_reply, data.last_reply_time, data.last_reply_name);
    }
	html +=      '</div>';
	if(isit_subtask != ''){
		html +=      '<div class="msgs-form-users-options" style="display:none">';
	}else{
		html +=      '<div class="msgs-form-users-options">';
	}
	html +=         '<div class="call-rep-emoji" onclick="taskViewEmojiList(event)"></div>';
	// Check flag and unflag message
	if(data.has_flagged != null && (data.has_flagged).indexOf(user_id) != -1){
		html +=     '<div class="flag" onclick="taskFlggUserMsg(event)"></div>';
	}else{
		html +=	    '<div class="flag" onclick="taskFlggUserMsg(event)"></div>';
	}
	html +=	        '<div class="replys" onclick="taskThreadReply(event)"></div>';
	html +=	        '<div class="more" onclick="moreMsgAction(event)">';
	html +=            '<div class="msg-more-popup" style="display:none">';
	html +=	              '<p onclick="taskmsg2newtask(this)">Create a Task</p>';
	// html +=	          '<p>Schedule an event</p>';
	// html +=            '<p>Start a poll</p>';
	// html +=            '<p onclick="shareMessage(event)">Share Message</p>';
	var delete_all_active = (data.sender == user_id);
	html +=               '<p onclick="delete_this_task_msg(event, '+ delete_all_active +')">Delete Message</p>';
	html +=	           '</div>';
	html +=         '</div>';
	html +=        '</div>';
    html +=     '</div>';

    html +=			'<div id="filesTagHolder'+data.msg_id+'" style="display:none;margin: 8px 9% 0px; float: left;font-family: hvWorkSans;"><span style="margin: 0px 8px 0px 0px; float: left;font-size: 14px;font-family: hvAssistant;font-style: italic;">'+data.sender_name  +' tagged the attachment(s) as</span>  <span style="float: left;margin-top: 0px;" id="filesTag'+data.msg_id+'"></span></div>';

    $('.chat-history').append(html);
};

function moreMsgAction(event){

	let pgHeight = $('.todo-chat-body').height();
    var elmHeight = $(event.target).find('.msg-more-popup').height() + 36;
    let x = $(event.target).offset();
    let actHeight = pgHeight - x.top;
    let top = x.top;
    let left = x.left;

	if (actHeight < elmHeight) {
        $(event.target).find('.msg-more-popup').css({
            'top': -113 + 'px',
			'right': 0 + 'px'
        });
    } else {
        $(event.target).find('.msg-more-popup').css({
            'top': 22 + 'px',
            'right': 0 + 'px'
        });
	} 
	
    if($(event.target).find('.msg-more-popup').is(':visible')){
        $(event.target).find('.msg-more-popup').hide();
    }else{
		$('.msg-more-popup').hide();
		$(event.target).parents('.msgs-form-users-options').css('display','block')
		$(event.target).find('.msg-more-popup').attr('data-type','visible').show();
    }
}

var per_msg_img_attachment = (msg_attach_img, sender_name, sender_img) => {
	var html = "";
	var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=600,height=400";
	$.each(msg_attach_img, function(k,v){
		html +=	'<img data-sender_name="'+ sender_name +'" data-sender_img="'+ sender_img +'" class="img_attach" src="'+ file_server + v +'" alt="'+ v +'" onclick="window.open(\''+ file_server + v +'\', \'Image Viewer\', \''+ strWindowFeatures +'\')">';
	});
	return html;
}
var per_msg_video_attachment = (msg_attach_video) => {
	var html = "";
	$.each(msg_attach_video, function(k, v) {
		var file_type = v.split('.').pop().toLowerCase();
		html += '<video controls class="media-msg">';
		html += '<source class="vdo_attach" src="' + file_server +  v + '" type="video/' + file_type + '">';
		html += 'Your browser does not support HTML5 video.';
		html += '</video>';
	});
	return html;
}
var per_msg_audio_attachment = (msg_attach_audio) => {
	var html = "";
	$.each(msg_attach_audio, function(k, v) {
		var file_type = v.split('.').pop().toLowerCase();
		html += '<audio controls class="media-msg">';
		html += '<source class="ado_attach" src="' + file_server + v + '" type="audio/' + file_type + '">';
		html += 'Your browser does not support audio tag.';
		html += '</audio>';
	});
	return html;
}

var per_msg_file_attachment = (msg_attach_file) => {
	var html = "";
	$.each(msg_attach_file, function(k, v) {
		var file_type = v.split('.').pop().toLowerCase();
		switch (file_type) {
			case 'ai':
			case 'mp3':
			case 'doc':
			case 'docx':
			case 'indd':
			case 'js':
			case 'sql':
			case 'pdf':
			case 'ppt':
			case 'pptx':
			case 'psd':
			case 'svg':
			case 'xls':
			case 'xlsx':
			case 'zip':
			case 'rar':
			ext = file_type;
			break;
			default:
			ext = 'other';
		}
		html += '<a href="' + file_server + v + '" target="_blank">';
		html += '<div class="fil_attach attach-file lightbox" data-filetype="' + ext + '" data-src="' + file_server + v + '">';
		html += '<img src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
		html += '<div class="file-name">' + v.substring(0, v.lastIndexOf('@')) + '.' + file_type + '</div>';
		html += '<div class="file-time">' + moment().format('h:mm a') + '</div>';
		html += '</div>';
		html += '</a>';
	});
	return html;
};
/* Start Emoji */
function taskViewEmojiList (event){
	var design 	= '<div class="emojiListContainer">';
    	design += 	'<span data-name="grinning" onclick="taskAdd_reac_into_replies(event)">😄</span>';
    	design += 	'<span data-name="joy" onclick="taskAdd_reac_into_replies(event)">😂</span>';
    	design += 	'<span data-name="open_mouth" onclick="taskAdd_reac_into_replies(event)">😮</span>';
    	design += 	'<span data-name="disappointed_relieved" onclick="taskAdd_reac_into_replies(event)">😥</span>';
    	design += 	'<span data-name="rage" onclick="taskAdd_reac_into_replies(event)">😡</span>';
    	design += 	'<span data-name="thumbsup" onclick="taskAdd_reac_into_replies(event)">👍</span>';
    	design += 	'<span data-name="thumbsup" onclick="taskAdd_reac_into_replies(event)">👎</span>';
    	design += 	'<span data-name="heart" onclick="taskAdd_reac_into_replies(event)">♥️</span>';
    	design += '</div>';


	if(!$(event.target).closest(".call-rep-emoji").find(".emojiListContainer").length == 1){
		$(event.target).closest(".call-rep-emoji").append(design);
	}
	// else{
	// 	$(event.target).closest(".emoji").find(".emojiListContainer").remove();
	// }
};
var taskAdd_reac_into_replies = (event) => {
    if ($('#live-chat').is(':visible')) {
        var activity_id = $('#chat_icon').attr('data-activity_id');
    }else{
        var activity_id = $('.property_notes').attr('data-batch_id');
	}
	var msg_id = $(event.target).closest('.chat-message').attr('data-msgid');
	var src = $(event.target).attr('src');
	var emojiname = $(event.target).attr('data-name');
    var count = 1;
    var data = { user_id, user_fullname, msg_id, activity_id, emojiname, count};

    socket.emit('add_reac_emoji', data, (res)=>{
        if (res.status) {
            if (res.rep == 'add') {
                taskAppend_reac_emoji(msg_id, src, 1);
                // socket.emit("emoji_emit", { room_id: to, msgid: msg_id, emoji_name: emojiname, count: 1, sender_id: user_id });
            } else if (res.rep == 'delete') {
                taskUpdate_reac_emoji(msg_id, src, -1);
            } else if (res.rep == 'update') {
                taskUpdate_reac_emoji(msg_id, '/images/emoji/' + res.old_rep + '.svg', -1);
                taskAppend_reac_emoji(msg_id, src, 1);
            }
        }
    });
};
var taskAppend_reac_emoji = (msgid, src, count) => {
	var allemoji = $('.todo_msgid_' + msgid).find('.emoji img');
	if (allemoji == undefined) {
		taskEmoji_html_append(msgid, src, count);
	} else {
		var noe = 0;
		$.each(allemoji, function(k, v) {
			if ($(v).attr('src') == src) {
				noe = parseInt($(v).next('.count-emoji').text());
				$(v).next('.count-emoji').text(noe + 1);
			}
		});
		if (noe === 0) {
			taskEmoji_html_append(msgid, src, count);
		}
	}
	$('.emojiListContainer').remove();
};
var taskUpdate_reac_emoji = (msgid, src, count) => {
	var allemoji = $('.todo_msgid_' + msgid).find('.emoji img');

	var noe = 0;
	$.each(allemoji, function(k, v) {
		if ($(v).attr('src') == src) {
			noe = parseInt($(v).next('.count-emoji').text());
			if (noe == 1)
			$(v).closest('.emoji').remove();
			else
			$(v).next('.count-emoji').text(noe - 1);
		}
	});

	$('.emojiListContainer').remove();
};
var taskEmoji_html_append = (msgid, src, count) => {
	var emoji_name = ((src.split('/'))[3]).replace('.svg', '');
	var html = taskEmoji_html(emoji_name, src, count);
	$('.todo_msgid_' + msgid).find('.replies').append(html);
};
var taskEmoji_html = (emoji_name, src, count) =>{
	var html =  '<span class="emoji '+emoji_name+' "  onmouseover="taskOpen_rep_user_emo(event)" onmouseout="taskClose_rep_user_emo(event)">';
    	html +=    '<img src="' + src + '" data-name="'+emoji_name+'" onclick="taskAdd_reac_into_replies(event)"> ';
    	html +=    '<span class="count-emoji">' + count + '</span>';
    	html += '</span>';
	return html;
}
var taskOpen_rep_user_emo = (event) => {
	if ($('.rep_user_emo_list').length == 0) {
        // var activity_id = $('#chat_icon').attr('data-activity_id');
		var msg_id = $(event.target).closest('.chat-message').attr('data-msgid');
		var emojiname = (($(event.target).closest('.emoji').find('img').attr('src').split('/'))[3]).replace('.svg', '');

        var data = { msg_id, emojiname };
        socket.emit('emoji_rep_list', data, (res)=>{
            if (res.length > 0) {
                var nameList = [];
                var na = "";
                var html = '<div class="rep_user_emo_list">';
                $.each(res, function(k, v) {
                    nameList.push(v.user_fullname);
                });
                if(nameList.indexOf(user_fullname) !== -1){
                    if(nameList.length >1){
                        na = "You & "
                    }else{
                        na  = "You"
                    }
                    var tempIndx = nameList[0];
                    nameList[0] = na;
                    nameList[nameList.indexOf(user_fullname)] = tempIndx;
                }
                $.each(nameList, function(k, v) {
                    html += v+" ";
                });
                html += '</div>';
                $('.todo_msgid_' + msg_id).find('.'+ emojiname).append(html);
                var div_offset = $(event.target).closest('.emoji').offset();
                $('.rep_user_emo_list').css('left', div_offset.left - 290);
            }
        });

        // $.ajax({
		// 	url: '/alpha2/emoji_rep_list',
		// 	type: 'POST',
		// 	data: { msgid: msg_id, emojiname: emoji_name },
		// 	dataType: 'JSON',
		// 	success: function(res) {
		// 		if (res.length > 0) {
		// 			var nameList = [];
		// 			var na = "";
		// 			var html = '<div class="rep_user_emo_list">';
		// 			$.each(res, function(k, v) {
		// 				nameList.push(v.user_fullname);
		// 			});
		// 			if(nameList.indexOf(user_fullname) !== -1){
		// 				if(nameList.length >1){
		// 					na = "You & "
		// 				}else{
		// 					na  = "You"
		// 				}
		// 				var tempIndx = nameList[0];
		// 				nameList[0] = na;
		// 				nameList[nameList.indexOf(user_fullname)] = tempIndx;
		// 			}
		// 			$.each(nameList, function(k, v) {
		// 				html += v+" ";
		// 			});
		// 			html += '</div>';
		// 			$('.msg_id_' + msg_id).find('.'+ emoji_name).append(html);
		// 			var div_offset = $(event.target).closest('.emoji').offset();
		// 			$('.rep_user_emo_list').css('left', div_offset.left - 290);
		// 		}
		// 	},
		// 	error: function(err) {
		// 		console.log(err.responseText);
		// 	}
		// });
	}
};
var taskClose_rep_user_emo = (event) => {
	$('.rep_user_emo_list').remove();
};
/* End Emoji */
/* Flag and unflag */
var taskFlggUserMsg = (event) =>{
	var flaggedMsg ='<img class="flaggedMsg" onclick="flaggedUserMsg(event)" src="/images/basicAssets/Flagged.svg">';
	var flagged ='<img  src="/images/basicAssets/Flagged.svg" alt="Flagged">';
	var not_flagged = '<img src="/images/basicAssets/NotFlagged.svg" alt="Not Flagged">';

	var msg_id = $(event.target).closest('.chat-message').attr('data-msgid');
	if ($('#live-chat').is(':visible')) {
        var activity_id = $('#chat_icon').attr('data-activity_id');
    }else{
        var activity_id = $('.property_notes').attr('data-batch_id');
	}

	if($(event.target).closest('.chat-message').find(".flaggedMsg").length == 1){
        var data = { user_id, msg_id, is_add: 'no', activity_id };
        socket.emit('todo_flag_unflag', data, (res)=>{
            if (res.status) {
                $(event.target).closest(".chat-message").find(".flaggedMsg").remove();
                $(event.target).closest(".chat-message").find(".flag").html(not_flagged);
            }
        });
	}else{
		var data = { user_id, msg_id, is_add: 'yes', activity_id };
        socket.emit('todo_flag_unflag', data, (res)=>{
            if (res.status) {
                $(event.target).closest(".chat-message").find(".chat-time").append(flaggedMsg);
                $(event.target).closest(".chat-message").find(".flag").html(flagged);
            }
        });
	}
};
/* End flag */



var thread_id = "";
var thread_root_id = "";

function taskThreadReply(event){
	if($('#threadReplyPopUp_task').is(":visible") == false){
		var activity_id = $("#updateAction").val();
		var msgid = $(event.target).closest('.chat-message').attr('data-msgid');
		$.ajax({
			url: "/alpha2/todo_open_thread",
			type: "POST",
			data: { msg_id: msgid, activity_id: activity_id },
			dataType: "JSON",
			success: function(threadrep) {
				
				thread_id = threadrep;
				thread_root_id = msgid;

                $('.todo_msgid_'+msgid).find('.replyicon').attr('src','/images/basicAssets/custom_thread_for_reply.svg');
                $('.todo_msgid_'+msgid).find('.urtext').remove();

				/* main thread msg html design */
				draw_reply_task_popup_html(
					activity_id,
					msgid,
					$('.todo_msgid_'+msgid).find('.user-imgs').attr('alt'),
					$('.todo_msgid_'+msgid).find('.chat-message-content').attr('data-sendername'),
					$('.todo_msgid_'+msgid).find('.chat-time').html(),
					$('.todo_msgid_'+msgid).find('.chating_para_2').html());
				$('#task_msg_rep').attr('placeholder', 'Reply to '+ $('.todo_msgid_'+msgid).find('.chat-message-content').attr('data-sendername') +'');

				/* end of main thread msg html design */

				$('#threadReplyPopUp_task .replies-container').html("");
				$('.pevThread').hide();
				$('.nextThread').hide();
				var all_rep_btn = $(".msgReply");
                for(var i=0; i < all_rep_btn.length; i++){
                    if($(all_rep_btn[i]).closest('.chat-message').attr('data-msgid') == msgid){
						if(i > 0) {
							$('.pevThread').show();
							$('.pevThread').attr("data-ano_msg_id", $(all_rep_btn[i-1]).closest('.chat-message').attr('data-msgid'));
						}
						if(i+1 < all_rep_btn.length) {
							$('.nextThread').show();
							$('.nextThread').attr("data-ano_msg_id", $(all_rep_btn[i+1]).closest('.chat-message').attr('data-msgid'));
						}
					}
				}

				$('#threadReplyPopUp_task').show();
				$('#task_msg_rep').focus();

				find_and_show_reply_task_msg(msgid);
			},
			error: function(err) {
				console.log(err.responseText);
			}
		});

        $('#threadReplyPopUp_task').show();
	}
};
var read_rep_counter = 0;
var find_and_show_reply_task_msg = (msgid) => {
	if ($('#live-chat').is(':visible')) {
		var prefix = '#live-chat';
	}else{
		var prefix = '#proChatHistory';
	}
	var noofreply = Number($(prefix + ' .todo_msgid_'+msgid).find('.no-of-replies').text());
	$('.reply-separetor p').html(noofreply+' Reply');
	// $.each(unread_replay_data, function(k,v){
	// 	if(v.root_msg_id == msgid){
	// 		var nor = Number($('#conv'+v.root_conv_id).attr('data-nor'));
	// 		$('#conv'+v.root_conv_id).attr('data-nor', (nor-1 > 0)?nor-1:"");
	// 		$('#conv'+v.root_conv_id).find('.unreadMsgCount').text((nor-1 > 0)?nor-1:"");
	// 		$('.todo_msgid_'+msgid).css('background', 'transparent');
	// 		v.root_msg_id = 0;
	// 		v.root_conv_id = 0;
	// 		read_rep_counter++;
	// 	}
	// });
	// if((unread_replay_data.length - read_rep_counter) == 0){
	// 	$(".thread_active").hide();
	// 	read_rep_counter = 0;
	// }
	if (noofreply > 0) {
		if ($('#live-chat').is(':visible')) {
			var activity_id = $('#chat_icon').attr('data-activity_id');
		}else{
			var activity_id = $('.property_notes').attr('data-batch_id');
		}
		socket.emit('find_todo_reply', { msg_id: msgid, activity_id: activity_id }, (reply_list) => {
			if (reply_list.status) {
				var reply_list_data = _.sortBy(reply_list.data, ["created_at", ]);
				var need_update_reply_message_seen_list = [];
				var rep_conv_id = reply_list_data[0].activity_id;
				$.each(reply_list_data, function(key, row) {
					if (row.msg_status == null) {
						if (row.sender == user_id) {
							// This msg send by this user; so no need to change any seen status
						} else {
							// This msg receive by this user; so need to change seen status
							need_update_reply_message_seen_list.push(row.msg_id);
						}
					}
					// If msg status have some user id, then
					else {
						if (row.msg_status.indexOf(user_id) > -1) {
							// This msg already this user seen
						} else {
							if (row.sender != user_id) {
								// This msg receive by this user; so need to change seen status
								need_update_reply_message_seen_list.push(row.msg_id);
							}
						}
					}
					if(need_update_reply_message_seen_list.length == 1)
						draw_rep_task_urhr();
						draw_rep_task_msg(row);
				});
                if(need_update_reply_message_seen_list.length > 1)
                    find_rep_task_urhr_add_s(need_update_reply_message_seen_list.length);

                if (need_update_reply_message_seen_list.length > 0) {
                    var arg_data2 = { msgids: need_update_reply_message_seen_list, user_id: user_id, activity_id: rep_conv_id };
                    socket.emit('update_todo_msg_status', arg_data2);
    			}
			} else {
				console.log('replay search query error', reply_list); // error meessage here
			}
		});
	}
};
// var find_and_show_reply_msg_popup = (msgid, convid) => {
// 	$.each(unread_replay_data, function(k,v){
// 		if(v.root_msg_id == msgid){
// 			var nor = Number($('#conv'+v.root_conv_id).attr('data-nor'));
// 			$('#conv'+v.root_conv_id).attr('data-nor', (nor-1 > 0)?nor-1:"");
// 			$('#conv'+v.root_conv_id).find('.unreadMsgCount').text((nor-1 > 0)?nor-1:"");
// 			$('.todo_msgid_'+msgid).css('background', 'transparent');
// 			v.root_msg_id = 0;
// 			v.root_conv_id = 0;
// 			read_rep_counter++;
// 		}
// 	});
// 	if((unread_replay_data.length - read_rep_counter) == 0){
// 		$(".thread_active").hide();
// 		read_rep_counter = 0;
// 	}
// 	// if (noofreply > 0) {
// 		socket.emit('find_todo_reply', { msg_id: msgid, conversation_id: convid }, (reply_list) => {
// 			if (reply_list.status) {
// 				var reply_list_data = _.sortBy(reply_list.data, ["created_at", ]);
//
// 				var need_update_reply_message_seen_list = [];
// 				var rep_conv_id = reply_list_data[0].conversation_id;
// 				$.each(reply_list_data, function(key, row) {
// 					if (row.msg_status == null) {
// 						if (row.sender == user_id) {
// 							// This msg send by this user; so no need to change any seen status
// 						} else {
// 							// This msg receive by this user; so need to change seen status
// 							need_update_reply_message_seen_list.push(row.msg_id);
// 						}
// 					}
// 					// If msg status have some user id, then
// 					else {
// 						if (row.msg_status.indexOf(user_id) > -1) {
// 							// This msg already this user seen
// 						} else {
// 							if (row.sender != user_id) {
// 								// This msg receive by this user; so need to change seen status
// 								need_update_reply_message_seen_list.push(row.msg_id);
// 							}
// 						}
// 					}
// 					if(need_update_reply_message_seen_list.length == 1)
// 						draw_rep_urhr();
// 					draw_rep_msg(row);
// 				});
// 				var thisconv_count = 0;
// 				for(var m=0; m<urrm_pn.length; m++){
// 					if(urrm_pn[m].root_conv_id == convid)
// 						thisconv_count++;
// 					else
// 						thisconv_count = 1;
// 					if(urrm_pn[m].root_conv_id == convid && urrm_pn[m].root_msg_id == msgid){
// 						if(thisconv_count>1){
// 							if(urrm_pn[m-1].root_conv_id == convid){
// 								$('.pevThread').show();
// 								$('.pevThread').attr("data-ano_msg_id", urrm_pn[m-1].root_msg_id);
// 								$('.pevThread').attr("data-conv_id", urrm_pn[m-1].root_conv_id);
// 							}
// 						}
// 						if(m+1 < urrm_pn.length){
// 							if(urrm_pn[m+1].root_conv_id == convid){
// 								$('.nextThread').show();
// 								$('.nextThread').attr("data-ano_msg_id", urrm_pn[m+1].root_msg_id);
// 								$('.nextThread').attr("data-conv_id", urrm_pn[m+1].root_conv_id);
// 							}
// 						}
// 					}
// 				}
//
// 				if (need_update_reply_message_seen_list.length > 0) {
// 				  $.ajax({
// 				    url: '/alpha2/update_msg_status',
// 				    type: 'POST',
// 				    data: {
// 				      msgid_lists: JSON.stringify(need_update_reply_message_seen_list),
// 				      user_id: user_id,
// 					  conversation_id: rep_conv_id
// 				    },
// 				    dataType: 'JSON',
// 				    success: function(res) {
// 				      // socket.emit('update_msg_seen', {
// 				      //   msgid: need_update_reply_message_seen_list,
// 				      //   senderid: to,
// 				      //   receiverid: user_id,
// 				      //   conversation_id: convid
// 				      // });
// 				    },
// 				    error: function(err) {
// 				      console.log(err);
// 				    }
// 				  });
// 				}
//
// 				// separetor_show_hide();
// 			} else {
// 				console.log('replay search query error', reply_list); // error meessage here
// 			}
// 		});
// 	// }
// };

function draw_reply_task_popup_html(rep_con_id, rep_msg_id, img, name, time, body){
	var main_msg_body = '<div class="thread-user-photo"><img src="'+ file_server +'profile-pic/Photos/'+ img +'" alt="'+ img +'"></div>';
	main_msg_body += '<div class="thread-user-msg" data-rep_con_id="'+ rep_con_id +'" data-rep_msg_id="'+ rep_msg_id +'"><h4>';
	main_msg_body += name;
	main_msg_body += '&nbsp;<span class="thread-msg-time">'+ time +'</span>';
	main_msg_body += '</h4>';
	main_msg_body += '<p>'+ body +'</p>';
	main_msg_body += '</div>';
	$('#threadReplyPopUp_task .main-thread-msgs').html(main_msg_body);
};

function draw_rep_task_msg(row){
	var html = 	'<div class="main-thread-msgs rep_msg_'+ row.msg_id +'" style="margin-top:18px;">';
	html += 		'<div class="thread-user-photo">';
	html +=				'<img src="'+ file_server +'profile-pic/Photos/'+ row.sender_img +'" alt="">';
	html += 		'</div>';
	html +=			'<div class="thread-user-msg">';
	html += 			'<h4>'+ row.sender_name + '&nbsp;<span class="thread-msg-time">'+ moment(row.created_at).format('h:mm a') +'</span></h4>';
	if(row.attch_imgfile!==null || row.attch_videofile!==null || row.attch_otherfile!==null)
		html +=			'<p style="">'+ row.msg_body +'</p>';
	else
		html +=			'<p>'+ row.msg_body +'</p>';
	if(row.attch_videofile!==null){
		html += per_msg_video_attachment(row.attch_videofile);
	}
	if(row.attch_imgfile != null){
		html += per_msg_img_attachment(row.attch_imgfile, row.sender_name, row.sender_img);
	}
	if(row.attch_audiofile!==null){
		// html += per_msg_audio_attachment(row.attch_audiofile);
		html += per_msg_file_attachment(row.attch_audiofile);
	}
	if(row.attch_otherfile!==null){
		html += per_msg_file_attachment(row.attch_otherfile);
	}
	html += 		'</div>';
	html += 	'</div>';
	$('#threadReplyPopUp_task .replies-container').append(html);
	var containerHeight = $(".replies-container").height();
	$('.forScrollBar .os-viewport').animate({ scrollTop: containerHeight }, 1);
    if(temp_str_for_rep != ""){
        $('.thread-user-msg>p').unhighlight();
        $('.thread-user-msg>p').highlight(temp_str_for_rep);
    }
}
var draw_rep_task_urhr = () =>{
	var html = '<div class="msg-separetor-unread"><p>1 new reply</p></div>';
	$("#threadReplyPopUp_task .replies-container").append(html);
};
var find_rep_task_urhr_add_s = (nour) =>{
	$("#threadReplyPopUp_task .replies-container").find('.msg-separetor-unread>p').html(nour + ' new replies');
};
var draw_rep_task_count = (data) =>{
	if ($('#live-chat').is(':visible')) {
		var prefix = '#live-chat';
	}else{
		var prefix = '#proChatHistory';
	}
	var noofreply = Number($(prefix + ' .todo_msgid_'+data.msg_id).find('.no-of-replies').text());
    if(data.last_reply_name == user_fullname)
        var name = "You";
    else
        var name = data.last_reply_name;
	if(noofreply>0){
		$('.todo_msgid_'+data.msg_id).find('.no-of-replies').text(noofreply+1);
		$('.todo_msgid_'+data.msg_id).find('.last_rep_text').html('Last reply '+ moment(new Date()).fromNow() +' <b><i>'+ name +'</i></b>' );
	}else{
		var html = taskPer_msg_rep_btn(noofreply+1, new Date(), name);
		$('.todo_msgid_'+data.msg_id).find('.chat-message-content').append(html);
	}
	$('.reply-separetor p').html( (noofreply+1) +' Reply');
};
var open_another_rep = (event) =>{
	var msg_id = $(event.target).attr('data-ano_msg_id');
	if($('.todo_msgid_'+msg_id).length){
		closetodoreply();
		$('.todo_msgid_'+msg_id).find('.msgReply p').trigger('click');
	}
    // else{
	// 	var conv_id = $(event.target).attr('data-conv_id');
	// 	closeAllPopUp();
	// 	$('#conv'+conv_id).attr('data-tmp_msgid', msg_id);
	// 	$('#conv'+conv_id).trigger('click');
	// }
};
$('#task_msg_rep').on('keydown', function(event) {
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        event.preventDefault();
        rep_task_msg_send_fn();
        var containerHeight = $(".replies-container").height();
        $('.forScrollBar .os-viewport').animate({ scrollTop: containerHeight }, 1);
    }
});
var rep_task_msg_send_fn = () =>{
    var str = $('#task_msg_rep').html();
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
	// str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    if (str != "") {
        $(".Chat_File_Upload").closest('form').trigger("reset");
        $("#FileComment").val("");
        $("#attach_chat_file_list").html("");
        if($('.todo_msgid_'+thread_root_id).length > 0){
			if ($('#live-chat').is(':visible')) {
				var convid = aid = $('#chat_icon').attr('data-activity_id');
			}else{
				var convid = aid = $('.property_notes').attr('data-batch_id');
			}
		}
        else
			var convid = $('#threadReplyPopUp_task .main-thread-msgs .thread-user-msg:first').attr('data-rep_con_id');
			if ($('#live-chat').is(':visible')) {
				var aid = $('#chat_icon').attr('data-activity_id');
			}else{
				var aid = $('.property_notes').attr('data-batch_id');
			}
			var arg_data = {
                activity_id: thread_id,
                sender_id: user_id,
                sender_img: user_img,
                sender_name: user_fullname,
                text: str,
                attach_files: filedata[0],
                thread_root_id: aid,
                root_msg_id: $('.thread-user-msg').attr('data-rep_msg_id')
			};
        socket.emit('todo_send_message', arg_data, (rep)=>{
            $("#task_msg_rep").html("");
            $("#task_msg_rep").focus();
        });
        // socket.emit('update_thread_count', { msg_id: thread_root_id, conversation_id: convid, last_reply_name: user_fullname });

        filedata.length = 0; filedata = [];
        audiofile.length = 0; audiofile = [];
        imgfile.length = 0; imgfile = [];
        otherfile.length = 0; otherfile = [];
        videofile.length = 0; videofile = [];
        formDataTemp.length = 0; formDataTemp = [];
    }
};
// socket.on('newRepMessage', function(message) {
// 	console.log(1238, message)
//     if(message.res.status){
//         if ($('.thread-user-msg').attr('data-rep_con_id') == message.data.thread_root_id) {
// 			console.log(1240, message.res.msg)
//             draw_rep_task_msg(message.res.msg);
//             $('.msg-separetor-unread').hide();
//         }
//     }
// });

// socket.on('newRepTaskMessage', function(message) {
//     console.log(1238, message)
//     if(myAllActivityGlobal.indexOf(message.data.activity_id) > -1){
//         if(message.res.status){
//             if ($('.thread-user-msg').attr('data-rep_con_id') == message.data.thread_root_id) {
//                 console.log(1240, message.res.msg)
//                 draw_rep_task_msg(message.res.msg);
//                 $('.msg-separetor-unread').hide();
//             }
//         }
//     }
// });

socket.on('update_thread_counter', function(data){
    draw_rep_task_count(data);
});
var taskPer_msg_rep_btn = (count, rep_time, rep_name) =>{
	var html = "";
	html += 		'<div class="msgReply" >';
	html +=				'<div class="groupImg">';
	// for(var i=0; i<count; i++)
	// html +=				'<img src="/images/users/img.png">';
	html +=				'</div>';
	html +=				'<div class="countReply">';
	html += 				'<img class="replyicon" src="/images/basicAssets/custom_thread_for_reply.svg" onclick="taskThreadReply(event)">';
	html += 				'<img class="replyicon redsvg" src="/images/basicAssets/custom_thread_for_reply_red.svg" onclick="taskThreadReply(event)">';
	html += 				'<p onclick="taskThreadReply(event)"><span class="no-of-replies" >'+ count +'</span> Reply </p>';
	html +=					'<img class="replyarrow" src="/images/basicAssets/custom_rightChevron_for_reply.svg" onclick="taskThreadReply(event)">';
	html += 				'<span class="last_rep_text"> Last reply ' + moment(rep_time).fromNow() + ' from '+ rep_name +'</span>';
	html +=				'</div>';
	html += 		'</div>';
	return html;
}
var closetodoreply = () =>{
    $('#threadReplyPopUp_task').hide();
};
/**
* timeoutFunction call after 2 second typing start
**/
var timeoutFunction = () => {
	typing = false;
	if ($('#live-chat').is(':visible')) {
		var activity_id = $('#chat_icon').attr('data-activity_id');
	}else{
		var activity_id = $('.property_notes').attr('data-batch_id');
	}
    socket.emit("todo_user_typing", {
            display: false,
            sender_id: user_id,
            sender_name: user_fullname,
            sender_img: user_img,
            activity_id: activity_id});
};

/**
* Receive typing event and
* display indicator images hide and show
**/
socket.on('todo_server_typing_emit', function(data) {
  if (data.sender_id != user_id) {
      draw_todo_typing_indicator(data);
  }
});

var draw_todo_typing_indicator = (data) => {
	if (data.display) {
		if ($('.typing-indicator').html() == "") {
			$('.typing-indicator').html(data.name + '&nbsp;<span>is typing....</span>');
		}
	} else {
		$('.typing-indicator').html("");
	}
};



/* Start emoji sending */
var emoji_div_draw = () => {
	var emojiNumber;
	var design = '<div class="emoji_div">';
	design += '<div class="emoji-container-name">Pick your reaction</div>';
	design += '<div class="emoji-container overlayScrollbars">';
	for (emojiNumber = 1; emojiNumber < 65; emojiNumber++) {
		design += '<img src="/images/emojiPacks/hv'+emojiNumber+'.svg">';
	}
	design += '</div>';
	design += '</div>';
	return design;
};
var open_todo_emoji = () => {
	if ($('.emoji_div').length == 0) {
		var design = emoji_div_draw();
		if ($('#live-chat').is(':visible')) {
			$('.todos-chat-write').append(design);
			insert_emoji('chatbox');
		}else{
			$('.batchWriteText').append(design);
			insert_emoji('stpmsg');
		}
        $('.msg-separetor').hide();
        $('.msg-separetor-unread').hide();
	} else {
        $('.msg-separetor').show();
        $('.msg-separetor-unread').show();
		$('.emoji_div').remove();
	}
	overlayScrollbars();
}
var insert_emoji = (id) => {
	$('.emoji_div .emoji-container>img').on('click', function() {
		var emoji_name = $(this).attr('src');
		$('#'+id).append('<img src="' + emoji_name + '" style="width:20px; height:20px; vertical-align: middle;" />&nbsp;');
		// open_emoji();
		var el = document.getElementById(id);
		placeCaretAtEnd(el);
		// $('.emoji_div').remove(); // remove emoji div after insert.
	});
};

var open_rep_emoji = (event) => {
	// var offsetval = $(event.target).offset();
	if ($('.emoji_div').length == 0) {
		var design = emoji_div_draw();
		$('.write-thread-msgs').append(design);
		insert_emoji('msg_rep');
		// $('.emoji_div').css('top', offsetval.top - 314);
		// $('.emoji_div').css('left', offsetval.left);
		// $('.emoji_div').css('bottom', 'unset');
		$('.emoji_div').css('z-index', 9);
		// $('.emoji_div').css({'top': (offset.top - 314), 'left': offset.left, 'bottom': 'unset'});
	} else {
        $('.msg-separetor').show();
        $('.msg-separetor-unread').show();
		$('.emoji_div').remove();
	}
};

var placeCaretAtEnd = (el) => {
	el.focus();
	if (typeof window.getSelection != "undefined"
	&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
};

var show_search_input = () =>{
	if($('#live-chat').is(':visible')){
		$(".search-into-todo-msg").hide();
		$("#todo_chat_search_input").show();
		$("#todo_chat_search_input").focus();
		$("#live-chat .clear_search_box").show();
	}else if ($('#subtaskProperty').is(':visible')) {
		$(".search-into-todo-msg").hide();
		$("#sub_chat_search_input").show();
		$("#sub_chat_search_input").focus();
		$("#subtaskProperty .clear_search_box").show();
	}
};

function chat_search_input(event) {
	var code = event.keyCode || event.which;
    var str = $(event.target).val().toLowerCase().trim();
    if (code == 13 && !event.shiftKey && str != "") { //Enter keycode = 13
        event.preventDefault();
        if ($('#live-chat').is(':visible')) {
			var activity_id = $('#chat_icon').attr('data-activity_id');
		}else{
			var activity_id = $('.property_notes').attr('data-batch_id');
		}
		socket.emit('todo_chat_search', {activity_id, str}, (res)=>{
            $('.msg-separetor').hide();
            $('.chat-message').hide();
            $('.chating_para_2').unhighlight();
            // $('.chating_para_2 > span').removeClass('highlight');
            temp_str_for_rep = str;
            $.each(res.msgids, function(k, v){
                $('.todo_msgid_'+v.msg_id).prevAll("div.msg-separetor:first").show();
                $('.todo_msgid_'+v.msg_id).show();
                $('.chating_para_2').highlight(str);
            });
        });
    }else{
        $('.chat-message').show();
        $('.msg-separetor').show();
    }
}


var hide_search_input = () =>{
	if($('#live-chat').is(':visible')){
		if($("#todo_chat_search_input").val() == ""){
			$("#todo_chat_search_input").hide();
			$("#live-chat .clear_search_box").hide();
			$(".search-into-todo-msg").show();
			temp_str_for_rep = "";
		}
	}else if ($('#subtaskProperty').is(':visible')) {
		if($("#sub_chat_search_input").val() == ""){
			$("#sub_chat_search_input").hide();
			$("#subtaskProperty .clear_search_box").hide();
			$(".search-into-todo-msg").show();
			temp_str_for_rep = "";
		}
	}
};

var clear_search_box = () =>{
	$("#todo_chat_search_input").val("").focus();
	$("#sub_chat_search_input").val("").focus();
	$('.chat-message').show();
	$('.msg-separetor').show();
	$('.chating_para_2').unhighlight();
};

var overlayScrollbars =()=>{
	$(function() {
		$('.overlayScrollbars').overlayScrollbars({
			className: "os-theme-dark",
			resize: "none",
			sizeAutoCapable: true,
			paddingAbsolute: true,
			overflowBehavior: {
				x: "hidden",
				y: "scroll"
			},
			scrollbars: {
				visibility: "auto",
				autoHide: "move",
				autoHideDelay: 500,
				dragScrolling: true,
				clickScrolling: true,
				touchSupport: true
			},
		});
	});
};

overlayScrollbars();
/* End emoji sending */
$(document).mouseup(function(e){
    if((e.target.id == 'chatbox' || e.target.id == 'msg_rep') && $('.emoji_div').length == 1){
        $('.msg-separetor').show();
        $('.msg-separetor-unread').show();
        $('.emoji_div').remove();
    }
});

$('#noteBox').on('click',function(){
	$('#noteBox').hide();
	$('#noteBoxEditor').show();
	// $('#chatboxEditor').css('height','160px !important');
	$('#live-note .ql-toolbar.ql-snow').show();
	// $('#live-chat .todo-chat-body').css('height','calc(100vh - 422px)');
	$('#noteBoxEditor .ql-editor').html('<p></p>');
	$('#noteBoxEditor .ql-editor').focus();
	$('#submitLiveNote').show();
	// $('.noteContainer').show();
	// $('.noteContainer .noteName').removeClass('active');
	// $('#submitLiveNote').text('Save');
	// $('#myNote').addClass('active');
	// $('#shareNoteContainer').html('')
  
	// $.each(subTaskNoteArray,function(k,v){
	//   if(v.st_id == $('#live-note').attr('st-id') && user_id == v.user_id){
	//     if(v.my_note != ''){
	//       $('#noteBoxEditor .ql-editor').html(v.my_note);
	//     }
	//   }
	// })
});

var subtask_coowner_observer = (sid, type) =>{
	var data = [];
	if(type == 'co-owner'){
		$.each(addAsCoOwnerArr, function(k,v){
			if(v.activityid == sid){
				data.push(v);
				var html = '';
				html += '<div class="usersList">';
				html += 	'<img src="'+ file_server +'profile-pic/Photos/'+ findObjForUser(v.userid).img +'" class="demo_img" title="'+ findObjForUser(v.userid).fullname +'" alt="'+ findObjForUser(v.userid).fullname +'">';
				html +=		'<h3 class="name_label">'+ findObjForUser(v.userid).fullname +'</h3>';
				html += '</div>';
				$('#live-note .batchButtonSec .floatingBtn:eq(1)').find('.users_container').append(html);
			}
		});
	}
	else if(type == 'observer'){
		$.each(addAsObsrvrArr, function(k,v){
			if(v.activityid == sid){
				data.push(v);
				var html = '';
				html += '<div class="usersList">';
				html += 	'<img src="'+ file_server +'profile-pic/Photos/'+ findObjForUser(v.userid).img +'" class="demo_img" title="'+ findObjForUser(v.userid).fullname +'" alt="'+ findObjForUser(v.userid).fullname +'">';
				html +=		'<h3 class="name_label">'+ findObjForUser(v.userid).fullname +'</h3>';
				html += '</div>';
				$('#live-note .batchButtonSec .floatingBtn:eq(2)').find('.users_container').append(html);
			}
		});
	}
	else if(type == 'assignee'){
		$.each(addAsAssigneeArr, function(k,v){
			if(v.activityid == sid){
				data.push(v);
				var html = '';
				html += '<div class="usersList">';
				html += 	'<img src="'+ file_server +'profile-pic/Photos/'+ findObjForUser(v.userid).img +'" class="demo_img" title="'+ findObjForUser(v.userid).fullname +'" alt="'+ findObjForUser(v.userid).fullname +'">';
				html +=		'<h3 class="name_label">'+ findObjForUser(v.userid).fullname +'</h3>';
				html += '</div>';
				$('#live-note .batchButtonSec .floatingBtn:eq(3)').find('.users_container').append(html);
			}
		});
	}

	return data;
}
var viewuserlist = (event) =>{
	if($(event.target).text() != '(0)')
		$(event.target).closest('.floatingBtn').find('.assignee_users').show();
};
var hideuserlist = () =>{
	$('.assignee_users').hide();
}
var open_selected_subtask_propertis = () =>{
	$('#batchProcessing').show();
	$(".property_notes").attr("data-batch_id", "");
	$(".chat-history").html("");
	$("#batchProcessing").find(".bproperties").trigger("click");
}
var note_history = [];
function addNotePopup(e) {
	note_history = [];
	var subtask_id = $(e).parents('.pulse-component').attr('data-id');
	var subtask_createdby = $(e).parents('.pulse-component').find('.pulse_title').attr('data-createdby');
    var pulse_title = $(e).parents('.name-text').find('.pulse_title').text();
	$('#batchProcessing').show();
	$('.batchButtonSec').hide();
	$('#batchActionMenu').hide();
	$('#batchProDetails').hide();
	$('.st_chat').hide();
	$('#batchProcessing .batchHeading').html('');
	$('#batchProcessing .batchHeading').html('<h1>'+ pulse_title +'</h1>');
	$('#batchProcessing .batchHeading h1').addClass('livenotehead');
	// $('#batchProcessing .batchHeading h1').html('<span class="b_a_ico"></span> Batch Actions');
	var html = '';
	html +=	'<div class="headLabelTitle headLabelTitleNote">';
	html +=		'<p>Subtask Note</p>';
	html +=		'<div class="noteName active" id="myNote" onclick="noteToggle(this)">My Note</div>';
	html +=		'<div class="noteName" id="shareNote" onclick="noteToggle(this)">Collaborative Note</div>';
	html +=	'</div>';
	$("#batchProcessing .batchHeading").append(html);

	$('#batchPropertyNotes').show();
	$('.st_note').show();
	$('#batchPropertyNotes').css('margin-top', '0px');
	$('#batchPropertyNotes').attr('data-batch_id', subtask_id);
	$('#batchPropertyNotes').attr('data-notetype', 'my_note');
	$('#batchPropertyNotes').attr('data-createdby', subtask_createdby);

	// $('#live-note').show();
	// $('#live-note').show().find('.todo_chat_room_title').text(pulse_title);
    // $('#noteBox').attr('placeholder',pulse_title);
    // // $('.noteContainer').hide();
    // $('#live-note').attr('st-id', subtask_id);
	// $('#shareNoteContainer').html('');
	var data = { subtask_id, user_id };

	// $('.batchButtonSec').hide();
	// $('.headLabelTitleNote .noteName').removeClass('active');
	// $('#myNote').addClass('active');

	// $('.batchButtonSec .floatingBtn:eq(1)').find('span').text('('+ subtask_coowner_observer(subtask_id, 'co-owner').length +')');
	// $('.batchButtonSec .floatingBtn:eq(2)').find('span').text('('+ subtask_coowner_observer(subtask_id, 'observer').length +')');
	// $('.batchButtonSec .floatingBtn:eq(3)').find('span').text('('+ subtask_coowner_observer(subtask_id, 'assignee').length +')');
	$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').html('');
	socket.emit('find_mynote', data, (res)=>{
		if(res.status){
			$.each(res.msg, function(k, v){
				note_history.push(v);
				if(v.note_type == 'my_note' && v.sender == user_id){
					// $('.draw_unpin_note').append(noteDrawDesign(v));
					var html = draw_batch_note(v);
					$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').append(html);
				}
			});
		}
	});
}


var filter_note_history = (ele) =>{
	$('.batchButtonSec').find('.active').removeClass('active');
	$(ele.target).addClass('active');
	var tab_name = $(ele.target).attr('data-val');
	var subtask_id = $('#batchPropertyNotes').attr('data-batch_id');;
	
	switch(tab_name){
		case 'co-owner': 
			var tab_name_data = addAsCoOwnerArr;
			break;		
		case 'observer': 
			var tab_name_data = addAsObsrvrArr;
			break;		
		case 'assignee': 
			var tab_name_data = addAsAssigneeArr;
			break;		
		default:
			var tab_name_data = 'all';
			break;
	}
	$.each($('.b_n_w_c.done_note'), function(k, v){
		if(tab_name_data == 'all'){
			$(v).show();
		} else if(tab_name_data.length > 0) {
			$.each(tab_name_data, function(ok, ov){
				if(ov.activityid == subtask_id){
					if($(v).attr('data-id') == ov.userid){
						$(v).show();
						// if(v.has_delete != null){
						// 	if((v.has_delete).indexOf(user_id) > -1){
						// 		var newhasseen = v.has_delete.splice((v.has_delete).indexOf(user_id), 1);
						// 		socket.emit('update_note_seen', {subtask_id: v.subtask_id, note_id: v.note_id, has_delete: newhasseen}, (res)=>{
						// 			console.log(1562, res);
									
						// 		});
						// 	}
						// }
					}
					else
						$(v).hide();
				}
			});
		} else {
			$(v).hide();
		}
	});
};


var read_note_history = (subtask_id, type, uid) =>{
	$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').html('');
	$.each(note_history, function(k, v){
		if(v.subtask_id == subtask_id){
			if(v.note_type == type && v.sender == uid){
				var html = draw_batch_note(v);
				$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').append(html);
			}
			else if(v.note_type == type && type == 'share_note'){
				var html = draw_batch_note(v);
				$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').append(html);
			}

			if(v.has_delete != null){
				if((v.has_delete).indexOf(user_id) > -1){
					(v.has_delete).splice((v.has_delete).indexOf(user_id), 1);
					socket.emit('update_note_seen', {subtask_id: v.subtask_id, note_id: v.note_id, has_delete: v.has_delete}, (res)=>{
						if(res.status){
							for(var i = 0; i<note_history.length; i++){
								if(note_history[i].subtask_id == subtask_id && note_history[i].note_id == v.note_id)
									note_history[i].has_delete = v.has_delete;
							}
						}
					});
				}
			}
		}
	});
}

function hideNoteBox(){
    if($('#live-note').is(':visible')){
        $('#live-note').hide();
        $('#noteBoxEditor .ql-editor').text(' ');
        $('#live-note .ql-toolbar.ql-snow').hide();
        $('#noteBoxEditor').hide();
        $('#noteBox').show();
		$('#submitLiveNote').hide();
		$('.noteContainer').hide();  
		$('.todo-chat-body').removeClass('shareNote');
		$('.batchButtonSec').hide(); 
		note_history = [];     
		$('#live-note .batchButtonSec .floatingBtn').find('.users_container').html('');
    }
}

function noteToggle(elm){
	var thisId = $(elm).attr('id');
	var subtask_id = $('#batchPropertyNotes').attr('data-batch_id');
	if(!$(elm).hasClass('active')){
		$('.st_note').show();
		$('.headLabelTitleNote .noteName').removeClass('active');
		$(elm).addClass('active');
		$('#noteBoxEditor .ql-editor').html('<p></p>');
		$('#shareNoteContainer').html('');

		if(thisId == 'shareNote'){
			$('#batchPropertyNotes').css('margin-top', '38px');
			read_note_history(subtask_id, 'share_note', user_id);
			$('#submitLiveNote').text('Share');
			$('.todo-chat-body').addClass('shareNote');
			var html = 	'<div class="floatingBtn active" onclick="filter_note_history(event)" data-val="all">All</div>';
			html +=		'<div class="floatingBtn" onclick="filter_note_history(event)" data-val="co-owner">Admin <span onmouseover="viewuserlist(event)" onmouseout="hideuserlist()"></span>';
			html +=			'<div class="assignee_users" style="left: -45px;"><div class="users_container"></div></div>';
			html +=		'</div>';
			html +=		'<div class="floatingBtn" onclick="filter_note_history(event)" data-val="observer">Observer <span onmouseover="viewuserlist(event)" onmouseout="hideuserlist()"></span>';
			html +=			'<div class="assignee_users" style="left: -45px;"><div class="users_container"></div></div>';
			html += 	'</div>';
			html += 	'<div class="floatingBtn" onclick="filter_note_history(event)" data-val="assignee">Assignee <span onmouseover="viewuserlist(event)" onmouseout="hideuserlist()"></span>';
			html +=			'<div class="assignee_users" style="left: -45px;"><div class="users_container"></div></div>';
			html +=		'</div>';
			$('.batchButtonSec').html(html);
			$('.batchButtonSec').show();
			$('.batchButtonSec').find('.active').removeClass('active');
			$('.batchButtonSec .floatingBtn:first-child').addClass('active');
			$('#batchPropertyNotes').attr('data-notetype', 'share_note');
        }else if(thisId == 'myNote'){
			$('#batchPropertyNotes').css('margin-top', '0px');
			read_note_history(subtask_id, 'my_note', user_id);
			$('#submitLiveNote').text('Save');
			$('.todo-chat-body').removeClass('shareNote');
			$('.batchButtonSec').hide();
			$('#batchPropertyNotes').attr('data-notetype', 'my_note');
        }
        
	}
}

function saveLiveNote(elm){
	var notetype = $('.headLabelTitleNote .noteName.active').attr('id');
	var noteText = $('#noteBoxEditor .ql-editor').html();
	var stId = $('#batchPropertyNotes').attr('data-batch_id');
	if(noteText != ""){
		if($('#submitLiveNote').text() == 'Update'){
			editNoteElm.html(noteText);
			if(notetype == 'shareNote'){
				$('#submitLiveNote').text('Update');
			}else{
				$('#submitLiveNote').text('Save');
			}
	
			$('#noteBoxEditor .ql-editor').html('<p></p>');
	
		}else{
			var obj = {
				activity_id:stId,
				msg_body:noteText,
				sender:user_id,
				sender_name: user_fullname,
				sender_img: user_img
			};

			if(notetype == 'shareNote'){
				obj.type = 'share_note';
			}else if(notetype == 'myNote'){
				obj.type = 'my_note';
			}
			// socket.emit('save_mynote', obj, (res)=>{
			// 	if(res.status){
			// 		$('#shareNoteContainer').append(noteDrawDesign(obj));
			// 		note_history.push(res.msg);
			// 		$('#noteBoxEditor .ql-editor').html('<p></p>');
			// 		$('#noteBoxEditor .ql-editor p').focus();
			// 	}
			// });
		}
	}
}

function noteDrawDesign(data){
	var html = '';
		html += '<div class="chat-message" data-id="'+data.sender+'">';
		html +=     '<img class="user-imgs" src="'+ file_server +'profile-pic/Photos/'+data.sender_img+'" alt="'+data.sender_img+'">';
		html +=     '<div class="chat-message-content clearfix">';
		html +=         '<h5>'+data.sender_name+'<span class="chat-time"></span></h5>';
		html +=         '<div class="ql-editor">'+ data.msg_body +'</div>';
		html +=     '</div>';

	if(data.sender == user_id){
		html +=     '<div class="msgs-form-users-options" style="width:40px"> <div class="editico" onclick="editNote(this)"></div></div>'
	}
	html += '</div>';
	return html;
}

var editNoteElm = '';
function editNote(elm){
    editNoteElm = $(elm).parents('.chat-message').find('.ql-editor');
    var texthtml = $(elm).parents('.chat-message').find('.ql-editor').html();
    $('#noteBoxEditor .ql-editor').html(texthtml);
    $('#submitLiveNote').text('Update');
}
var open_batch_msg = () =>{
	/** 
	 * Due to new requirement, this block is stoped.
	 * This block make a new room, then send and receive.
	 * block id : 11062019A
	 * search by this id for reopen.
	 **/
	// $('#batchPropertyNotes .chat-history').html("");
	// var activity_id = $('#unpinTodoList').find('.activeTodo').attr('data-activityid');
	// $('#batchPropertyNotes').attr('data-batch_id', '');
	// socket.emit('create_find_batch_sms', {activity_id}, (res)=>{
	// 	if(res.status){
	// 		$('#batchPropertyNotes').attr('data-batch_id', res.batch_activity.batch_id);
	// 		$('#batchPropertyNotes').attr('data-notetype', 'batch_msg');
	// 		if(res.batch_msg_history.length > 0){
	// 			$.each(res.batch_msg_history, function(k, v){
	// 				per_batch_msg(v, true);
	// 			});
	// 			scrollToBottom('.todo-chat-body');
	// 		}
	// 	}else{
	// 		alert('Something error ...');
	// 	}
	// });
};

$('#batchmsg').keypress(function(event){
	var code = event.keyCode || event.which;
	if (code == 13 && !event.shiftKey) { //Enter keycode = 13
		event.preventDefault();
		sendbatchmsg();
	}
});

var sendbatchmsg = () =>{
	var str = $('#batchmsg').html();
    if(str != ""){
		var arg_data = {
                sender_id: user_id,
                sender_img: user_img,
                sender_name: user_fullname,
                text: str,
                attach_files: filedata[0],
                thread_root_id: 0,
                root_msg_id: 0,
				tags:tagListForFileAttach
		    };
		var subtask_selected_list = [];
		var subtask_row = $(".pulse-component");
		$.each(subtask_row, function(k, v){
			if($(v).find(".left-indicator-checkbox").hasClass("selected") && $(v).attr("data-id") != undefined)
				subtask_selected_list.push($(v).attr("data-id"));
		});
		
		if(subtask_selected_list.length > 0){
			$.each(subtask_selected_list, function(kk, vv){
				arg_data.activity_id = vv;
				socket.emit('todo_send_message', arg_data, (rep) =>{
					if(subtask_selected_list.length == kk+1){
						$('.chatEmptyMsg').remove();
						per_todo_msg(rep.res.msg, true);
						filedata.length = 0; filedata = [];
						audiofile.length = 0; audiofile = [];
						imgfile.length = 0; imgfile = [];
						otherfile.length = 0; otherfile = [];
						videofile.length = 0; videofile = [];
						formDataTemp.length = 0; formDataTemp = [];
					}
				});
			});
		}

		/** 
		 * Due to new requirement, this block is stoped.
		 * This block make a new room, then send and receive.
		 * block id : 11062019A
		 * search by this id for reopen.
		 **/
        // var arg_data = {
        //         activity_id: $('#batchPropertyNotes').attr('data-batch_id'),
        //         sender_id: user_id,
        //         sender_img: user_img,
        //         sender_name: user_fullname,
        //         text: str,
        //         attach_files: filedata[0],
        //         thread_root_id: 0,
        //         root_msg_id: 0,
		// 		tags:tagListForFileAttach
        //     };
        // socket.emit('send_batch_message', arg_data, (res)=>{
		// 	filedata.length = 0; filedata = [];
        //     audiofile.length = 0; audiofile = [];
        //     imgfile.length = 0; imgfile = [];
        //     otherfile.length = 0; otherfile = [];
        //     videofile.length = 0; videofile = [];
        //     formDataTemp.length = 0; formDataTemp = [];
		// });
		$('#batchmsg').html("");
        $('#batchmsg').focus();
    }
};

socket.on('batch_msg_receive', function(data){
	$('.msg-separetor-unread').hide();
    $('#batchPropertyNotes .chatEmptyMsg').remove();
    if(data.status && $('#batchPropertyNotes').attr('data-batch_id') == data.msg.activity_id){
        per_batch_msg(data.msg, true);
    	scrollToBottom('.todo-chat-body');
    }
});

var per_batch_msg = (data, append=true) =>{
	if (data.has_hide != null)
        if ((data.has_hide).indexOf(user_id) > -1)
            return;
        
    // if(data.has_delete == null || (data.has_delete).indexOf(user_id) == -1){
    var attach_show = true, deletebtn_active = true, permanently = false;
    if (data.has_delete != null) {
        if ((data.has_delete).indexOf(user_id) == -1) {
            if ((data.has_delete).indexOf('Sender delete it') > -1) {
                data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> This message was deleted.</i><span  class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
                attach_show = false;
            }
        }
        else {
            data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> You deleted this message.</i><span class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
            attach_show = false;
        }
    }

    if (data.msg_body == "This message was deleted.") {
        data.msg_body = "<i><img src='/images/delete_msg.png' class='deleteicon'> This message was deleted.</i><span  class='silent_delete' onclick='removeThisLine(event,\""+data.msg_id+"\")'> (Remove this line)</span>";
        attach_show = false;
    }
    /* Start Date Group By */
    var msg_date = moment(data.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) {return '['+this.format("MMM Do, YYYY")+']';},
        sameElse: function(now) {return '['+this.format("MMM Do, YYYY")+']';}
    });
    var temp_date = msg_date;

    if(append){
        $.each($('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                msg_date = null;
                return 0;
            }
        });
        if(msg_date !== null && $('.msg-separetor-unread').length == 0){
            var date_html = '<div class="msg-separetor" data-date="'+ msg_date +'"><p>'+ msg_date +'</p></div>';
            $(".chat-history").append(date_html);
        }
    }
    /* End Date Group By */

    var html =  '<div class="chat-message clearfix todo_msgid_'+ data.msg_id +'" data-msgid="'+ data.msg_id +'">';
    html +=         '<img class="user-imgs" src="'+ file_server +'profile-pic/Photos/'+ data.sender_img +'" alt="'+ data.sender_img +'">';
    html +=         '<div class="chat-message-content clearfix" data-sendername="'+ data.sender_name +'">';
    html +=             '<h5>';
    html +=                 data.sender_name +'<span class="chat-time">'+ moment(data.created_at).format('h:mm a') +'</span>';
    // Check flag and unflag message
    if(data.has_flagged != null && (data.has_flagged).indexOf(user_id) != -1){

		html += '&nbsp;<img onclick="flaggedUserMsg(event)" class="flaggedMsg" src="/images/basicAssets/Flagged.svg">';
    }
    html +=             '</h5>';
    if(data.attch_imgfile!==null || data.attch_videofile!==null || data.attch_otherfile!==null)
	{
		if(user_id === data.sender){if(attachFileList.indexOf(data.msg_id) === -1){attachFileList.push(data.msg_id);}}
		html +=			'<p class="chating_para_2" style="">' + data.msg_body +'</p>';
	}else
        html +=			'<p class="chating_para_2">' + data.msg_body +'</p>';
    if(data.attch_videofile!==null){
        html += per_msg_video_attachment(data.attch_videofile);
    }
    if(data.attch_imgfile!==null){
        html += per_msg_img_attachment(data.attch_imgfile, data.sender_name, data.sender_img);
    }
    if(data.attch_audiofile!==null){
        // html += per_msg_audio_attachment(data.attch_audiofile);
        html += per_msg_file_attachment(data.attch_audiofile);
    }
    if(data.attch_otherfile!==null){
        html += per_msg_file_attachment(data.attch_otherfile);
    }
    html +=             '<div class="replies">';
    // Check emoji reaction message
    if(data.has_emoji !== null){
        $.each(data.has_emoji, function(k, v){
            if(v>0)
            html += taskEmoji_html(k, "/images/emoji/"+ k +".svg", v);
        });
    }
    html +=             '</div>';
    if(data.has_reply > 0){
        html += taskPer_msg_rep_btn(data.has_reply, data.last_reply_time, data.last_reply_name);
    }
    html +=         '</div>';
    html +=         '<div class="msgs-form-users-options">';
    html +=             '<div class="call-rep-emoji" onclick="taskViewEmojiList(event)"><img src="/images/basicAssets/AddEmoji.svg" alt=""></div>';
    // Check flag and unflag message
    if(data.has_flagged != null && (data.has_flagged).indexOf(user_id) != -1){
        html +=             '<div class="flag" onclick="taskFlggUserMsg(event)"><img src="/images/basicAssets/Flagged.svg" alt=""></div>';
    }
    else{
        html +=	            '<div class="flag" onclick="taskFlggUserMsg(event)"><img src="/images/basicAssets/NotFlagged.svg" alt=""></div>';
    }
    html +=	            '<div class="replys" onclick="taskThreadReply(event)"><img src="/images/basicAssets/Thread.svg" alt=""></div>';
    // html +=	            '<div class="tagOP" onclick="taskThreadReply(event)"><img src="/images/basicAssets/select_tag.svg" alt=""></div>';
    html +=	            '<div class="more" onclick="moreMsgAction(event)">';
    html +=                 '<img src="/images/basicAssets/MoreMenu.svg" alt="">';
    html +=                     '<div class="msg-more-popup" style="display:none">';
    html +=	                    '<p onclick="taskmsg2newtask(this)">Create a Task</p>';
    // html +=	                    '<p>Schedule an event</p>';
    // html +=                     '<p>Start a poll</p>';
    // html +=                     '<p onclick="shareMessage(event)">Share Message</p>';
    var delete_all_active = (data.sender == user_id);
    html +=                     '<p onclick="delete_this_task_msg(event, '+ delete_all_active +')">Delete Message</p>';
    html +=	                '</div>';
    html +=             '</div>';
    html +=         '</div>';
    html +=     '</div>';

    html +=			'<div id="filesTagHolder'+data.msg_id+'" style="display:none;margin: 8px 9% 0px; float: left;font-family: hvWorkSans;"><span style="margin: 0px 8px 0px 0px; float: left;font-size: 14px;font-family: hvAssistant;font-style: italic;">'+data.sender_name  +' tagged the attachment(s) as</span>  <span style="float: left;margin-top: 0px;" id="filesTag'+data.msg_id+'"></span></div>';

    $('#batchPropertyNotes .chat-history').append(html);
};

// var open_batch_note = () =>{
// 	$('.draw_unpin_note').html("");
// 	var activity_id = $('#mainSideBarContent').find('.activeTodo').attr('data-activityid');
// 	$('#batchPropertyNotes').attr('data-batch_id', '');
// 	$('#batchPropertyNotes').css('margin-top', '38px');
// 	editorlabel = [];
// 	$('.openoldnote').hide();
// 	socket.emit('create_find_batch_note', {activity_id}, (res)=>{
// 		if(res.status){
// 			$('#batchPropertyNotes').attr('data-batch_id', res.acid);
// 			$('#batchPropertyNotes').attr('data-notetype', 'unpin_batch_note');
// 			$('#batchPropertyNotes').attr('data-createdby', $('#actCre').val());
// 			if(res.batch_note.length > 0){
// 				$.each(res.batch_note, function(k, v){
// 					var html = draw_batch_note(v);
// 					$('#batchPropertyNotes .draw_c_Note').find('.draw_unpin_note').append(html);

// 					if(v.has_delete != null){
// 						if((v.has_delete).indexOf(user_id) > -1){
// 							(v.has_delete).splice((v.has_delete).indexOf(user_id), 1);
// 							socket.emit('update_note_seen', {subtask_id: v.subtask_id, note_id: v.note_id, has_delete: v.has_delete}, (res)=>{
// 								if(res.status){
// 									console.log(1929, 'Successfully update');
// 								}
// 							});
// 						}
// 					}

// 					var heightElm = $('.mynote_'+v.note_id).find('.b_n_w_desc')[0].offsetHeight;
// 					if(heightElm > 95){
// 						$('.mynote_'+v.note_id).addClass('minHeight');
// 					}
// 				});
// 				// scrollToBottom('.todo-chat-body');
// 			}
// 		}else{
// 			alert('Something error ...');
// 		}
// 	});
// };
var open_subtask_note = (id) =>{
	note_history = [];
    var subtask_id = id;
    // if($('#pulse_'+id).length == 0){ // Batch note
	// 	var subtask_createdby = $('#actCre').val();
	// 	$('.property_notes').attr('data-batch_id', subtask_id);
	// 	$('.property_notes').attr('data-notetype', 'unpin_batch_note');
	// 	$('.property_notes').attr('data-createdby', subtask_createdby);
	// }else{ 
		// Subtask note
		var subtask_createdby = $('#pulse_'+id).find('.pulse_title').attr('data-createdby');
		$("#pulse_"+subtask_id).find('.more_files').removeClass('newNoti');
		$('.property_notes').attr('data-batch_id', subtask_id);
		$('.property_notes').attr('data-notetype', 'share_note');
		$('.property_notes').attr('data-createdby', subtask_createdby);
	// }
	
	$('.property_notes .draw_c_Note').find('.draw_unpin_note').html('');
	// var html = '';
	// html +=	'<div class="headLabelTitle headLabelTitleNote">';
	// html +=		'<div class="noteName active" id="myNote" onclick="noteToggle(this)">My Note</div>';
	// html +=		'<div class="noteName" id="shareNote" onclick="noteToggle(this)">Collaborative Note</div>';
	// html +=	'</div>';
	// $("#subtaskProperty header").append(html);
	
	$('.batchButtonSec').find('.floatingBtn').removeClass('active');
	$('.batchButtonSec .bnote').addClass('active');
	$('.property-details').hide();
	$('.property_notes').show();
	$('.st_chat').hide();
	$('.st_note').show();

	var data = { subtask_id, user_id };
	socket.emit('find_mynote', data, (res)=>{
		if(res.status){
			$('.property_notes .st_note').find('.noteEmptyMsg').remove();
			$.each(res.msg, function(k, v){
				note_history.push(v);
				var html = draw_batch_note(v);
				$('.property_notes .draw_c_Note').find('.draw_unpin_note').append(html);

				if(v.has_delete != null){
					if((v.has_delete).indexOf(user_id) > -1){
						(v.has_delete).splice((v.has_delete).indexOf(user_id), 1);
						socket.emit('update_note_seen', {subtask_id: v.subtask_id, note_id: v.note_id, has_delete: v.has_delete}, (res)=>{
							if(res.status){
								for(var i = 0; i<note_history.length; i++){
									if(note_history[i].subtask_id == subtask_id && note_history[i].note_id == v.note_id)
										note_history[i].has_delete = v.has_delete;
								}
							}
						});
					}
				}
			});
		}
	});
};

var open_batch_subtask_note = () =>{
	note_history = [];
	
	// $('.property_notes').attr('data-batch_id', subtask_id);
	$('.property_notes').attr('data-batch_id', "");
	$('.property_notes').attr('data-notetype', 'unpin_batch_note');
	
	$('.property_notes .draw_c_Note').find('.draw_unpin_note').html('');
	
	// $('.batchButtonSec').find('.floatingBtn').removeClass('active');
	// $('.batchButtonSec .bnote').addClass('active');
	// $('.property-details').hide();
	// $('.property_notes').show();
	// $('.st_chat').hide();
	// $('.st_note').show();

	// var data = { subtask_id, user_id };
	// socket.emit('find_mynote', data, (res)=>{
	// 	if(res.status){
	// 		$('.property_notes .st_note').find('.noteEmptyMsg').remove();
	// 		$.each(res.msg, function(k, v){
	// 			note_history.push(v);
	// 			var html = draw_batch_note(v);
	// 			$('.property_notes .draw_c_Note').find('.draw_unpin_note').append(html);

	// 			if(v.has_delete != null){
	// 				if((v.has_delete).indexOf(user_id) > -1){
	// 					(v.has_delete).splice((v.has_delete).indexOf(user_id), 1);
	// 					socket.emit('update_note_seen', {subtask_id: v.subtask_id, note_id: v.note_id, has_delete: v.has_delete}, (res)=>{
	// 						if(res.status){
	// 							for(var i = 0; i<note_history.length; i++){
	// 								if(note_history[i].subtask_id == subtask_id && note_history[i].note_id == v.note_id)
	// 									note_history[i].has_delete = v.has_delete;
	// 							}
	// 						}
	// 					});
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
var draw_batch_note = (data) =>{
	if((data.note_type == 'my_note' && data.sender == user_id) || data.note_type == 'share_note'){
		var body = (data.msg_body).split('@-@');
		var ishidden = '';
		var stl = data.subtask_lists.length;
		
		if($('.property_notes').attr('data-notetype') == 'unpin_batch_note' && stl != all_subtask_inthis_task.length){
			ishidden = 'hidden privnotegroup';
		}

		var html = 	'';
		if(ishidden == 'hidden privnotegroup'){
			// if($('.on'+stl).length == 0)
			// 	html += '<div class="on'+ stl +'" onclick="openoldnote(this, '+ stl +')" style="cursor:pointer;margin: 5px 0px;border: 1px solid #ddd;padding: 5px;text-align: center;font-size: 12px;border-radius: 3px;">View old note</div>';
			$('.openoldnote').show();
			$('.openoldnote').text('View '+ $('.privnotegroup').length +' previous note(s)');
		}
		
		// html +=		'<div class="b_n_w_c done_note mynote_'+data.note_id+' '+ ishidden +' privnotegroup_'+ stl +' " data-noteid="'+data.note_id+'" data-id="'+ data.sender +'" data-bg="#fff" style="">'+
		var can_edit = (data.sender == user_id)?'triggerEditNote(this)':'';

		html +=	'<div class="b_n_w_c '+((data.note_type == 'my_note')? 'my_note':'share_note') +' notetype_'+ data.note_type +' done_note mynote_'+data.note_id+' '+ ishidden +'" data-noteid="'+data.note_id+'" data-id="'+ data.sender +'" data-bg="#fff" style="">'+
						'<div class="b_n_t_r_s">'+
							'<div class="moreico" onclick="toggleNoteOptions(this)"></div>'+
							'<ul class="note_m_op">'+
								'<li class="" onclick="archiveBNote(this)">Archive</li>'+
								'<li class="editbtnNote" onclick="editBNote(this)">Edit</li>'+
								'<li class="" onclick="deleteBNote(this)">Delete</li>'+
							'</ul>'+
							'<div class="pinico" onclick="togglePinUnpin(this)"></div>'+
						'</div>'+
						'<div class="assign_photo"></div>'+
						'<div class="batch_note_text_part" onclick="'+ can_edit +'">'+
							'<div class="b_n_w_title" onclick="'+ can_edit +'">'+
								'<input type="text" placeholder="Title" value="'+ body[0] +'" readonly="readonly">'+
							'</div>'+
							'<div class="b_n_w_desc" onclick="'+ can_edit +'">'+
								'<div class="w_n_description" contenteditable="false" placeholder="Take a note..." style="">'+ body[1] +'</div>';
									if(data.checklist != null){
										html += '<div class="w_n_checkList">';
											var completed_display = 'none';
											var count_completed = 0;
											html += '<ul class="incompletedCheck">';
													$.each(data.checklist, function(k, v){
														var text = v.split('@-@');
														if(text[1]=='incompleted')
															html += '<li><span class="c_box" onclick="checkNLItem(this,\'incompleted\')"></span><span class="i_name" contenteditable="false" onkeydown="listitemName(event,this)">'+ text[0] +'</span> <span class="i_close" onclick="removeListItemN(this,\'in\')"></span></li>';
															else {
																completed_display = 'block';
																count_completed++;
															}
													});
											html += '</ul>';
											
											html += '<div class="addlistItemco" contenteditable="false" onkeydown="addlistItemCoIn(event,this)" onkeyup="addlistItemCoup(event,this)"></div>'+
													'<div class="completecheckItemCo" style="display:'+ completed_display +'">'+
													'<div class="headingCom" onclick="togglecompLI(this)"><i class="rotateArrow"></i> <span><span class="counter">'+ count_completed +'</span> Completed items</span></div>'+
														'<ul class="completedCheck">';
														$.each(data.checklist, function(k, v){
															var text = v.split('@-@');
															if(text[1]=='completed')
																html += '<li><span class="c_box active" onclick="checkNLItem(this,\'completed\')"></span><span class="i_name" contenteditable="true" onkeydown="listitemName(event,this)">'+ text[0] +'</span> <span class="i_close" onclick="removeListItemN(this,\'com\')"></span></li>';
														});
											html +=		'</ul>'+
													'</div>'+
												'</div>';
									}
									else{
										html += '<div class="w_n_checkList" style="display:none">';
											html += '<ul class="incompletedCheck">';
											html += '</ul>';
											html += '<div class="addlistItemco" contenteditable="false" onkeydown="addlistItemCoIn(event,this)" onkeyup="addlistItemCoup(event,this)"></div>'+
													'<div class="completecheckItemCo" style="display:none">'+
														'<div class="headingCom" onclick="togglecompLI(this)"><i class="rotateArrow"></i> <span><span class="counter">1</span> Completed items</span></div>'+
														'<ul class="completedCheck">';
											html +=		'</ul>'+
													'</div>'+
												'</div>';
									}
								html += '</div>'+
							'<div class="collapse" onclick="collapseNoteDesc(this)"></div>'+
							'<div class="n_label_container">';
							if(data.label != null){
								$.each(data.label, function(k,v){
									if(editorlabel.indexOf(v) == -1)
										editorlabel.push(v);
										html += '<div class="labelDiv" data-value="'+ v +'"><span class="l_img"></span><span class="l_text">'+ v +'</span>';
										if(can_edit != "")
											html += '<span class="l_close" onclick="completeN_label(this)"></span>';
										html += '</div>';
								});
							}
							html += '</div>'+
							'<div class="n_update_time"><span>'+ data.sender_name + ' at ' + moment(data.created_at).format('h:mm a') +'</span></div>'+
							'<div class="b_n_bottom_sec hide_n_elm">'+
								'<ul class="ico_holder">'+
									'<li class="addlabel_ico" onclick="openLabelNote(event,this)">'+
										'<div class="add_l_noteCo">'+
											'<div class="heading">Label Note</div>'+
											'<input class="search hvText" type="text" placeholder="Enter label name" onkeyup="findeditorLabel(event,this)">'+
											'<ul class="label_list"></ul>'+
											'<div class="create_ico" style="display: none" onclick="createENlabel(this)"><span>Create </span> "<span class="valueText"></span>"</div>'+
										'</div>'+
									'</li>'+
									'<li class="checklist_ico" onclick="toggleENCheckboxs(this)"></li>'+
									'<li class="delete_ico" onclick="deleteEN(this)"></li>'+
									'<li class="closediv btn_done_n" onclick="noteDone(this)" data-action="done">Done</li>'+
									'<li class="closediv btn_cancelNote" onclick="cancelUpdateNote(this)" data-action="cancel" >Cancel</li>'+
								'</ul>'+
								'<div class="group_input">'+
									'<label class="switchNav">'+
										'<input type="checkbox" id="bnpp_'+data.note_id+'" onchange="notetypechange(this)"'+((data.note_type == 'my_note')? 'checked':'') +'>'+
										'<span class="sliderNav round"></span>'+
										'<span class="switchFor" style="color:#2a76ea;font-size: 13px;font-weight:400;">Make this note private</span>'+
									'</label>'+
								'</div>'+
							'</div>'+
							'<div class="collaboratorDiv" data-bg="#fff">'+
								'<div class="colla_heading">'+
									'<span>Collaborators</span>'+
								'</div>'+
								'<div class="colla_content">'+
									'<ul class="collaborators_list">'+
										'<li>'+
											'<div class="uImg"><img src="/images/users/joni.jpg" alt=""></div>'+
											'<div class="nameNemail">'+
												'<div class="name">Dc Jony (Owner)</div>'+
												'<div class="email">dalimchyjony@gmail.com</div>'+
											'</div>'+
											'<div class="removeColla"></div>'+
										'</li>'+
									'</ul>'+
									'<div class="addColla">'+
											'<div class="uImg"><img src="/images/basicAssets/user-plus-solid.svg" alt=""></div>'+
											'<input type="email" class="addCollaInput" placeholder="Person or email to share with" onkeyup="addNoteCollaborator(event,this)">'+
									'</div>'+
								'</div>'+
								'<div class="colla_foot">'+
										'<div class="btnSave" onclick="saveNoteCollaborators(this)">Save</div>'+
										'<div class="btnCancel" onclick="cancelAddCollaborators(this)">Cancel</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
				'</div>';
		return html;
	}
}

var openoldnote = () =>{
	// $('.privnotegroup_'+id).show();
	// $(ele).remove();
	if($('.privnotegroup').is(':visible')){
		$('.privnotegroup').hide();
		$('.openoldnote').text($('.openoldnote').text().replace('Hide', 'View'));
	}
	else{
		$('.privnotegroup').show();
		$('.openoldnote').text($('.openoldnote').text().replace('View', 'Hide'));
	}
};

var openbatchactionbytrigger = () =>{
	$('#cbx').trigger('click');
};

var find_unread_note_count = (ids, uid, type) =>{
	for(var i=0; i<ids.length; i++){
		$("#pulse_"+ids[i]).find('.addNotePopup').removeClass('unseen');
		$("#pulse_"+ids[i]).find('.addNotePopup').attr('data-unseen', 0);
		// $("#pulse_"+ids[i]).find('.more_files').removeClass('active_files');
		$("#pulse_"+ids[i]).find('.more_files').removeClass('newNoti');
	}
	socket.emit('count_note_msg', {ids, uid}, (res)=>{
		$.each(res.all_note, function(k, v){
			if(v.has_delete != null){
				if((v.has_delete).indexOf(user_id) > -1 && v.sender != user_id && v.note_type == 'share_note'){

					if(type == 'subtask'){
						$("#pulse_"+v.subtask_id).find('.addNotePopup').addClass('unseen');
						// $("#pulse_"+v.subtask_id).find('.more_files').addClass('active_files');
						$("#pulse_"+v.subtask_id).find('.more_files').addClass('newNoti');
						var nc = Number($("#pulse_"+v.subtask_id).find('.addNotePopup').attr('data-unseen')) + 1;
						$("#pulse_"+v.subtask_id).find('.addNotePopup').attr('data-unseen', nc);
					}
					else if(type == 'batchnote'){
						var nc = Number($("#openBatchAction span").text()) + 1;
						$("#openBatchAction").html('Batch Action <span>('+nc+')</span>');
					}
				}
			}
		});
	});
};



var send_stp_msg = () =>{
	var str = $("#stpmsg").html();
	scrollToBottom('#proChatHistory');
	if(str != ""){
        var arg_data = {
                activity_id: $('.property_notes').attr('data-batch_id'),
                sender_id: user_id,
                sender_img: user_img,
                sender_name: user_fullname,
                text: str,
                attach_files: filedata[0],
                thread_root_id: 0,
                root_msg_id: 0,
				tags:tagListForFileAttach
            };
			socket.emit('todo_send_message', arg_data, (res)=>{
				if(res.res.status){
					var subtask_selected_list = [];
					var subtask_row = $(".pulse-component");
					$.each(subtask_row, function(k, v){
						if($(v).find(".left-indicator-checkbox").hasClass("selected") && $(v).attr("data-id") != undefined)
							subtask_selected_list.push($(v).attr("data-id"));
					});
					subtask_selected_list.splice(subtask_selected_list.indexOf(arg_data.activity_id), 1);
					if(subtask_selected_list.length > 0){
						$.each(subtask_selected_list, function(kk, vv){
							arg_data.activity_id = vv;
							socket.emit('todo_send_message', arg_data, (rep) =>{

								if(subtask_selected_list.length == kk+1){
									filedata.length = 0; filedata = [];
									audiofile.length = 0; audiofile = [];
									imgfile.length = 0; imgfile = [];
									otherfile.length = 0; otherfile = [];
									videofile.length = 0; videofile = [];
									formDataTemp.length = 0; formDataTemp = [];
								}
							});
						});
					}else{
						filedata.length = 0; filedata = [];
						audiofile.length = 0; audiofile = [];
						imgfile.length = 0; imgfile = [];
						otherfile.length = 0; otherfile = [];
						videofile.length = 0; videofile = [];
						formDataTemp.length = 0; formDataTemp = [];
					}
				}
			});
        $('#stpmsg').html("");
        $('#stpmsg').focus();
    }
};


var taskmsg2newtask = (elm) =>{
	createNewTodo();
	$('#live-chat .chat-close').trigger('click');
	$("#todoTitle").html($(elm).parents('.chat-message').find('.chating_para_2').text());
};

$('#stpmsg').on('keydown', function(event) {
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        event.preventDefault();
		send_stp_msg();
		$('.chatEmptyMsg').remove();
		scrollToBottom('#proChatHistory');
    }
});