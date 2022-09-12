var conv_tagList = [];
var deletedMessages = [];
var allteams = [];
var allUnit = [];
var myAllNotificationdata = [];
var notification_draw_count = 0;

function showProfileNav(elm) {
    var check = $(elm).hasClass('active');

    if (check) {
        $(elm).removeClass('active');
        $('.profilenavMainSection').fadeOut();

    } else {
        // default_data();
        $(elm).addClass('active');
        $('.profilenavMainSection').show();
    }
}


var getuserNameList = (thisdata) => {
    var user_title_list = '';
    if (thisdata.new_user.length == 1) {
        var user = findObjForUser(thisdata.new_user[0]).fullname;
        if (thisdata.new_user[0] == user_id) {
            user = 'You'
        }
        user_title_list = user;
    } else {
        $.each(thisdata.new_user, function(k, v) {

            var user = findObjForUser(v).fullname;
            if (v == user_id) {
                user = 'You'
            }
            if (k == 0) {
                user_title_list = user;
            } else {
                if (thisdata.new_user.length == (k + 1)) {
                    user_title_list = user_title_list + ' & ' + user;
                } else {
                    user_title_list = user_title_list + ', ' + user;
                }
            }

        })
    }
    return user_title_list;
}

// var data_unreadAllMsg = [];
// var data_allEditUnreadMsg = [];
// var total_unread_msgs = [];
$(function() {
    // getAllUserCustomTitle();
    socket.emit('my_all_notification', { user_id: user_id }, function(res) {
        var ured = 0;
        $.each(res.data, function(k, v) {
            if (v.seen_users.indexOf(user_id) == -1) {
                ured += 1;
            }
        });
        // if(parseInt(login_total) !== 0){
        if (ured > 0) {
            $('#notificaitonClickItem').find('.unreadMsgCount').text(ured);
            $('#notificaitonClickItem').find('.unreadMsgCount').css('display', 'flex');
        }
        // }
    })

    // get all unread msg

    var my_all_conv = [];
    // var my_all_personal_conv = [];
    // var my_all_group_conv = [];

    $.each($('.conv_area'), function(k, v) {
        if ($(v).attr('data-conv-id') != undefined && $(v).attr('data-conv-id') != user_id) {
            my_all_conv.push($(v).attr('data-conv-id'));
        }
    });

    socket.emit('getAllmydeletemessage', user_id, function(res) {
        if (res.status) {
            deletedMessages = [];
            if (res.data.length > 0) {
                $.each(res.data, function(k, v) {
                    deletedMessages.push(v.delete_id);
                })
            }
        }
        socket.emit('all_unread_msg', { my_all_conv }, function(data) {
            lastmsgConvid = data.all_msg_desc;

            // Unread replay
            if (data.unread_replay.length > 0) {
                reply_msg_counter();

                $.each(data.rep_con_data, function(k, v) {
                    $.each(data.unread_replay, function(kk, vv) {
                        if (v.has_delete == null) {
                            v.has_delete = [];
                        }
                        if (deletedMessages.indexOf(v.msg_id) == -1 && deletedMessages.indexOf(vv.msg_id) == -1) {
                            if (v.rep_id == vv.conversation_id) {
                                if (checkguestMsg(vv)) {
                                    unread_replay_data.push({
                                        rep_conv: vv.conversation_id,
                                        msg_id: vv.msg_id,
                                        root_conv_id: v.conversation_id,
                                        root_msg_id: v.msg_id,
                                        is_seen: false
                                    });
                                    $(".convid" + v.conversation_id).addClass("has_unread_replay");
                                    var nor = Number($(".convid" + v.conversation_id).attr("data-nor"));
                                    $(".convid" + v.conversation_id).attr("data-nor", Number(nor + 1));
                                    // checkunreadthread(v.msg_id);
                                }
                            }
                        }
                    });
                });

                if (unread_replay_data != undefined) {
                    urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
                }
            }
            // if (getCookie('lastNotification') != "") {
            // 	$('#conv'+ getCookie('lastNotification')).trigger('click');
            // 	$('.chat-head-name').show();
            // 	$('.chat-head-calling').show();
            // 	setCookie('lastNotification', '', 1);
            // }else{
            // 	// forlastActiveconv()
            // }
            reply_msg_counter();
        });
    });

    $.each(user_list, function(k, v) {
        $('._participants_id' + v.id).text(v.fullname);
    })
})


// Floating Date in the notification top bar
var draw_noti_loading = false;
// $('#notification_body').on('scroll', function () {
// 	var scrollTop = $('#notification_body').scrollTop();
// 	console.log('scrollTop = ',scrollTop);
// 	if(scrollTop == 0){
// 		if(!draw_noti_loading){
// 			draw_noti_loading = true;
// 			setTimeout(function(){
// 				draw_noti_loading = false;
// 			},1000);
// 			var limit_t = notification_draw_count + 20;
// 			var i = 0;
// 			$.each(myAllNotificationdata,function(k,v){
// 				if(i < limit_t){
// 					if(!$('#noti_id_'+v.notification_id).is(':visible')){
// 						if(v.is_delete != null){
// 							if(v.is_delete.indexOf(user_id) == -1){
// 								draw_notification(v,false);
// 								i++;
// 								notification_draw_count++;
// 							}
// 						}else{
// 							draw_notification(v,false);
// 							i++;
// 							notification_draw_count++;
// 						}
// 					}
// 					if(k == (myAllNotificationdata.length - 1) ){
// 						if(!$('#anwarSir_notificaiton').is(':visible')){
// 							welcome_freeli(true);
// 						}
// 					}
// 				}
// 			});
// 		}
// 	}

// 	$(".msg-separetor").each(function () {
// 		var last = true;
// 		if (last)
// 			$(this).removeClass('not_visible');

// 		if ($(this).offset().top < 170) {
// 			last = false;
// 			$(this).addClass("not_visible");
// 			$('.chatting-date-header p').html($('#notification_body .not_visible p').last().text()).show();
// 		}
// 	});

// 	if (scrollTop < 575){
// 		console.log('scrollTop = ',scrollTop);
// 		$('#NotificationContainer .chatting-date-header p').html("").hide();
// 	}
// });

var start_scroll = false;
var mousewheelevent = true;
$(window).bind('touchmove', function(event) {
    if ($(event.target).length) {
        if (mousewheelevent) {
            var scrollTop = $('#notification_body').scrollTop();
            console.log(6681, scrollTop);
            var msgid = $('.notify_msg ').first().attr('data-notification');
            if (scrollTop == 0) {
                mousewheelevent = false;

                var limit_t = notification_draw_count + 20;
                var i = 0;
                $.each(myAllNotificationdata, function(k, v) {
                    if (i < limit_t) {
                        if (!$('#noti_id_' + v.notification_id).is(':visible')) {
                            if (v.is_delete != null) {
                                if (v.is_delete.indexOf(user_id) == -1) {
                                    draw_notification(v, false);
                                    i++;
                                    notification_draw_count++;
                                }
                            } else {
                                draw_notification(v, false);
                                i++;
                                notification_draw_count++;
                            }
                        }
                        if (k == (myAllNotificationdata.length - 1)) {
                            if (!$('#anwarSir_notificaiton').is(':visible')) {
                                welcome_freeli(true);
                            }
                        }
                    }
                });

                setTimeout(function() {
                    $(document).ready(function() {
                        mousewheelevent = true;
                    });
                }, 1000);
            }
        }

    }

});

var my_all_callconv = [];

function headerTab(elm, type) {
    $('.foot_right').attr('style', '');
    $('.unread_thread').html('');
    $('.unread_msg').removeAttr('style');
    $('.conv_area').attr('data-unreadThread', 'false');
    var check = $(elm).hasClass('active');
    // default_data();
    if (type == 'chats') {
        reply_msg_counter();
        if (!check) {
            $('.connect_tab_container li').removeClass('active');
            $('.conv_list_container').hide()
            $(elm).addClass('active');
            $('#chat_conversations').show();
        }
        if ($("#all_channels").is(':visible')) {
            $("#all_channels").html('').hide();
            $('#chat_conversations').show();
        }
    } else if (type == 'notify') {
        console.log(265, type);
        $('#notification_body').html('<div class="loading_connect callLoader"> <img src="/images/assets/loading_data.gif"></div>');

        $('.connect_section').removeClass('thread_notify_visible');
        $('.head_container .search_ico').css('display', 'none');
        if (!check) {
            $('.connect_tab_container li').removeClass('active');
            $('.conv_list_container').hide()
            $(elm).addClass('active');
            $('#conversations_notify').show();
        }
        $('#notificaitonClickItem').find('.unreadMsgCount').html('');
        $('#notificaitonClickItem').find('.unreadMsgCount').css('display', 'none');
        socket.emit('my_all_notification', { user_id: user_id }, function(res) {
            console.log(278, type, res);
            $('#notification_body').html("");

            $('#NotificationContainer').css('display', 'block');
            // welcome_freeli();
            var data = _.orderBy(res.data, ['created_at'], ['asc']);
            var i = 0;
            data = data.reverse();
            myAllNotificationdata = data;
            notification_draw_count = 0;
            $.each(data, function(k, v) {
                if (i < 20) {
                    if (v.is_delete != null) {
                        if (v.is_delete.indexOf(user_id) == -1) {
                            draw_notification(v, false);
                            i++;
                            notification_draw_count++;
                        }
                    } else {
                        draw_notification(v, false);
                        i++;
                        notification_draw_count++;
                    }
                }
            });
            // scroll_down_fun('notification');
            seenUnreadNotification();
            if (i > 0) {
                scroll_down_fun('notification');
            }
        })
        return false;
    } else if (type == 'calls') {
        console.log(303, type);
        $('#call_conversations').prepend('<div class="loading_connect callLoader"> <img src="/images/assets/loading_data.gif"></div>');
        $('.connect_section').removeClass('thread_notify_visible');
        if (!check) {
            $('.connect_tab_container li').removeClass('active');
            $('.conv_list_container').hide()
            $(elm).addClass('active');
            $('#call_conversations').show();

            var call_all_conv = [];


            socket.emit('get_call_details', {
                id: user_id,
            }, function(data) {
                if (data.status) {
                    $('#call_conversations').html('');
                    $.each(data.androidCallList, function(k, v) {
                        call_all_conv.push(v.conversation_id);
                        var html = '<div class="conv_area _call_' + v.conversation_id + '" data-id="' + v.conversation_with + '" data-name="' + v.conversation_title + '" data-conversationtype="' + v.conversation_type + '" conv_id="' + v.conversation_id + '" msg_id="' + v.msg_id + '" participants="' + v.participants + '">';
                        html += '	<div class="right_" onclick="viewCallerInfo(this,\'' + v.conversation_type + '\',\'' + v.conversation_id + '\',\'' + v.conversation_title + '\')">';
                        html += '		<div class="conv_img">';
                        if (v.conversation_type == 'Personal') {
                            html += '			<img src="' + file_server + 'profile-pic/Photos/' + v.sender_img + '">';
                        } else {
                            html += '			<img src="' + file_server + 'room-images-uploads/Photos/' + v.sender_img + '">';
                        }
                        html += '			<div class="status offline"></div>';
                        html += '		</div>';
                        html += '	</div>';
                        html += '	<div class="mid_" onclick="viewCallerInfo(this,\'' + v.conversation_type + '\',\'' + v.conversation_id + '\',\'' + v.conversation_title + '\')">';
                        html += '		<div class="conv_name">';
                        html += '			<div class="title">' + v.conversation_title + '</div>';
                        html += '		</div>';
                        // if (v.call_duration !== 0) {
                        if (v.call_duration != null && v.call_duration != '') {
                            html += '		<div class="last_call_time ' + (v.sender_name == findObjForUser(user_id).fullname ? 'outgoing' : 'incoming') + '">' + moment(v.created_at).format('ll') + '</div>'; //May 20, 2019, 12:38 pm
                        } else {
                            html += '		<div class="last_call_time missed">' + moment(v.created_at).format('ll') + '</div>'; //May 20, 2019, 12:38 pm
                        }
                        html += '	</div>';
                        html += '	<div class="left_">';
                        if (v.call_type == 'audio') {
                            html += '		<div data-type="audio" data-conversationid="' + v.conversation_id + '" data-convname="' + v.conversation_title + '" data-partnername="' + v.conversation_title + '" data-participants="' + v.participants + '" data-conversationtype="' + v.conversation_type + '" data-privacy="public" onclick="openVideoCall(this)" class="onC called_icon voice conv_' + v.conversation_id + '"></div>';
                        } else {
                            html += '		<div data-type="video" data-conversationid="' + v.conversation_id + '" data-convname="' + v.conversation_title + '" data-partnername="' + v.conversation_title + '" data-participants="' + v.participants + '" data-conversationtype="' + v.conversation_type + '" data-privacy="public" onclick="openVideoCall(this)" class="onC called_icon video conv_' + v.conversation_id + '"></div>';
                        }
                        html += '	</div>';
                        html += '</div>';
                        $('#call_conversations').append(html);
                    });

                }
            });
        }
    }

    default_data();

}


function welcome_freeli(type = false) {
    var welcome_msg = '<div class="user_msg welcome_freeli" id="anwarSir_notificaiton"> <div class="plain_text" >' +
        '<h1 class="layer">Welcome to Workfreeli!</h1>' +
        '<p>Workfreeli is the smart business management application that reorganizes your work world and combines all your channels into a single platform. It is a new business application that OHS Global Inc. has been developing and we are happy to begin implementation of this application within our internal teams. To kick off, we’re launching the Connect platform. </p><br>' +
        '<p style="margin-top:16px;font-weight:600">With Workfreeli Connect, you can:</p>' +
        '<ul>' +
        '<li>Connect one-on-one with team members or create a Room to communicate with multiple people</li>' +
        '<li>Send instant messages, make audio calls, have video conferences</li>' +
        '<li>Create checklists and share any type of file</li>' +
        '<li>Easily edit privacy settings to change who can join conversations and view content</li>' +
        '<li>Take file management to a whole other level by tagging any type of content</li>' +
        '</ul>' +
        '<p>Stay tuned for more! Over the next few weeks, we will be rolling out additional functions and features.</p>' +
        '<p>As we’re still under development, please feel free to direct message me of any bugs or issues you find.</p>' +
        '<p style="margin-top:40px">Enjoy!</p>' +
        '<p>Anwar Ali</p>' +
        '</div></div>';

    if (type) {
        $('#notification_body').prepend(welcome_msg);
    } else {
        $('#notification_body').append(welcome_msg);
    }

}

function draw_notification(data, append, newN = '') {
    if (data.is_delete != null) {
        if (data.is_delete.indexOf(user_id) > -1) {
            return false;
        }
    }
    var notification_by = findObjForUser(data.created_by).fullname;
    if (data.created_by == user_id) {
        notification_by = 'You'
    }
    var unreadClass = '';
    if (data.seen_users.indexOf(user_id) == -1)
        unreadClass = 'unreadNoti';

    var msg_body = '';
    if (data.type == 'room_delete') {
        msg_body = '"' + data.title + '" room has been deleted.';
        //msg_body = '"'+data.title +'" room has been deleted by '+ notification_by +' on '+moment(data.created_at).format('DD-MM-YYYY') +' at '+ moment(data.created_at).format('LT');
    } else if (data.type == 'remove_conv_member') {
        console.log('remove_conv_member', data);
        var thisdata = JSON.parse(data.body);
        var user_title_list = getuserNameList(thisdata);
        if (thisdata.new_user.indexOf(user_id) > -1) {
            msg_body = 'You have been removed from "' + data.title + '" room.';
        } else {
            msg_body = notification_by + ' removed "' + user_title_list + '" in "' + data.title + '" Room.';
        }
    } else if (data.type == 'add_conv_member') {
        console.log('add_conv_member', data);
        var thisdata = JSON.parse(data.body);
        var user_title_list = getuserNameList(thisdata);
        msg_body = notification_by + ' added "' + user_title_list + '" in "' + data.title + '" Room.'
    } else if (data.type == 'add_team_member') {
        var thisdata = JSON.parse(data.body);
        var user_title_list = getuserNameList(thisdata);
        if (thisdata.new_user.indexOf(user_id) > -1) {
            msg_body = 'Welcome to "' + data.title + '" Team! You have been added as a "Member".   <a href="/">Click here to refresh your account.</a>';
        } else {
            msg_body = notification_by + ' added "' + user_title_list + '" in "' + data.title + '" Team.';
        }
    } else if (data.type == 'make_admin') {
        var thisdata = JSON.parse(data.body);
        var user_title_list = getuserNameList(thisdata);

        if (thisdata.new_user.indexOf(user_id) > -1) {
            msg_body = 'You are now an admin of "' + data.title + '" room.';
        }
    } else if (data.type == 'make_member') {
        var thisdata = JSON.parse(data.body);
        var user_title_list = getuserNameList(thisdata);

        if (thisdata.new_user.indexOf(user_id) > -1) {
            msg_body = 'Your admin access level to "' + data.title + '" room has been revoked.';
        }
    } else if (data.type == 'checklist_changes') {
        var thisdata = JSON.parse(data.body);
        // var user_title_list = getuserNameList(thisdata);
        if (data.title == 'status_change') {
            msg_body = notification_by + ' changed the status of "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'edit_checklist') {
            msg_body = notification_by + ' edited and item of "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'new_assignee') {
            msg_body = notification_by + ' assigned you on "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'remove_assignee') {
            msg_body = notification_by + ' removed you on "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'change_due_date') {
            msg_body = notification_by + ' changed due date on "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'alternative_assign_to') {
            msg_body = notification_by + ' added you as a alternate assignee on "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'ttlRequest') {
            // User-A has requested to change the assignment due date named " a" in Test.
            msg_body = notification_by + ' has requested to change the assignment due date named "' + thisdata.item_title + '" in "' + thisdata.checklist_title + '".';
        } else if (data.title == 'cancel_request') {
            // User-A has requested to change the assignment due date named " a" in Test.
            msg_body = notification_by + ' has Cancel Extension request named "' + thisdata.item_title + '" in "' + thisdata.checklist_title + '".';
        } else if (data.title == 'ttlAccepted') {
            // User-A has accepted the assignment named " a" in Test
            msg_body = notification_by + ' has accepted the assignment named "' + thisdata.item_title + '" in "' + thisdata.checklist_title + '".';
        } else if (data.title == 'ttlCancelled') {
            if (thisdata.type == 'reject') {
                msg_body = notification_by + ' cancelled your due date extension request in "' + thisdata.checklist_title + '" checklist.';
            } else if (thisdata.type == 'decline') {
                // User-A has declined the assignment named " a" in Test
                msg_body = notification_by + ' has declined the assignment named "' + thisdata.item_title + '" in "' + thisdata.checklist_title + '".';
            } else if (thisdata.type == 'cancel_decline') {
                // User-A has declined the assignment named " a" in Test
                msg_body = notification_by + ' has Cancel decline the assignment named "' + thisdata.item_title + '" in "' + thisdata.checklist_title + '".';
            }
        } else if (data.title == 'ttlDelete') {
            msg_body = notification_by + ' deleted "' + thisdata.item_title + '" item from "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'addItem') {
            msg_body = notification_by + ' Added "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        } else if (data.title == 'updateItem') {
            msg_body = notification_by + ' Updated "' + thisdata.item_title + '" item in "' + thisdata.checklist_title + '" checklist.';
        }
    }

    if (msg_body !== '') {
        /* Start Date Group By */
        var msg_date = moment(data.created_at).calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
            sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
        });
        var temp_date = msg_date;
        var unread_noti = '<div class="msg-separetor-unread" data-length="1" ><p>1 New Notification</p></div>';
        if ($('#notification_body').find('.msg-separetor-unread').length == 0) {
            if (unreadClass != '') {
                $('#notification_body').append(unread_noti);
            }

        } else {
            if (unreadClass != '') {
                var c = parseInt($('#notification_body').find('.msg-separetor-unread').attr('data-length')) + 1;
                $('#notification_body').find('.msg-separetor-unread').attr('data-length', c).find('p').text(c + ' New Notification');
            }
        }

        // if (append) {
        $.each($('#notification_body').find('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                msg_date = null;
                return 0;
            }
        });
        if (msg_date !== null && $('#notification_body').find('.msg-separetor-unread').length == 0) {
            var date_html = '<div class="msg-separetor" data-date="' + msg_date + '"><p>' + msg_date + '</p></div>';
            if (append) {
                $('#notification_body').append(date_html);
            }
        }
        // }
        /* End Date Group By */

        var html = '<div class="notify_msg ' + unreadClass + '" id="noti_id_' + data.notification_id + '" data-notification="' + data.notification_id + '">';
        html += '<div class="user_img">';
        html += '<img class="" src="' + file_server + 'profile-pic/Photos/' + findObjForUser(data.created_by).img + '" alt="' + findObjForUser(data.created_by).img + '" >';
        html += '</div>';
        html += '<div class="msg_section" style="padding-right: 14px;">';
        html += '	<div class="user_info_sec">';
        html += '		<div class="user_name">' + findObjForUser(data.created_by).fullname + '</div>';
        html += '		<div class="msg_time">' + moment(data.created_at).format('DD-MM-YYYY') + ' ' + moment(data.created_at).format('LT') + '	</div>';
        html += '	</div>';
        html += '	<div class="plain_text" >' + msg_body + '</div>';
        html += '</div>';
        html += '<div class="thread_msg_opt" onclick="threadAction(event,\'open\')">';
        html += '	<span  onclick="notiRemoveForMe(this)" data-noti="' + data.notification_id + '" class="delete_thisThread"></span>';
        html += '	<span onclick="threadAction(event,\'close\')" class="cancel_threadAction"></span>';
        html += '</div>';
        html += '</div>';

        // if(append){
        // 	$('#notification_body').append(html);
        // }else{
        // 	$('#notification_body').prepend(html);
        // }
        if (append) {
            $('#notification_body').append(html);
        } else {
            $('#notification_body').prepend(html);
            if (msg_date !== null && $('#notification_body').find('.msg-separetor-unread').length == 0) {
                var date_html = '<div class="msg-separetor" data-date="' + msg_date + '"><p>' + msg_date + '</p></div>';
                $('#notification_body').prepend(date_html);
            }
        }
    }
}


function seenUnreadNotification() {
    var allUnreadNoti = $('#notification_body').find('.unreadNoti');

    var allid = [];
    $.each(allUnreadNoti, function(k, v) {
        var id = $(v).attr('data-notification');
        if (allid.indexOf(id) == -1) {
            allid.push(id);
        }
    });

    if (allid.length > 0) {
        socket.emit('update_notification', { user_id: user_id, noti_ids: allid, type: 'room_delete', update_type: 'seen' });
    }
}

var scroll_down_fun = (type) => {
    if (type == 'notification') {
        if ($('#notification_body').find('.msg-separetor-unread').length == 0) {
            $('#conversations_notify').animate({ scrollTop: $('#conversations_notify').prop("scrollHeight") }, 0);
        } else {
            var genunixid = 'unredbar' + moment().unix();
            $('#notification_body').find('.msg-separetor-unread').last().attr('id', genunixid);
            var elmnt = document.getElementById(genunixid);
            elmnt.scrollIntoView();
        }
    }
}

function notiRemoveForMe(elm) {
    var noti_id = $(elm).attr('data-noti');
    socket.emit('update_notification', { user_id: user_id, noti_id: noti_id, type: 'room_delete', update_type: 'delete' });
    $('#noti_id_' + noti_id).remove();
}

socket.on('newNotification', function(data) {
    if (data.receive_users.indexOf(user_id) > -1) {
        if ($('#conversations_notify').is(':visible')) {
            draw_notification(data, true);
            seenUnreadNotification();
        } else {
            var tst_id = 420;
            playNotification(tst_id);
            var u_length = $('#notificaitonClickItem').find('.unreadMsgCount').text();
            if (u_length != '') {
                u_length = parseInt(u_length)
            } else {
                u_length = 0;
            }
            $('#notificaitonClickItem').find('.unreadMsgCount').html((u_length + 1));
            $('#notificaitonClickItem').find('.unreadMsgCount').css('display', 'flex');
        }
    }
});

function removeDeleted_msg() {
    $.each($('.user_msg.deleted'), function(k, v) {
        $(v).find('.silent_delete').trigger('click');
    });
    $('#removeDeleted_msg').hide();
}

function showOption(e, elm, type) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ($('.backwrap:visible').length == 0) {
        if (type == 'chat_actions_list') {
            $('#chat_actions_list').fadeIn();
            $(elm).addClass('active')
        } else if (type == 'more_options') {
            $('#more_options').show();
            $(elm).find('.more_ico').addClass('active')
        }
    }

}

function toggleRemember(elm) {
    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
    } else {
        $(elm).addClass('active');
    }
}

function startConversation(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var unreadThread = $(elm).attr('data-unreadthread');
    var has_flagged = $(elm).attr('has_flagged');
    var type = $(elm).attr('data-conv-type');
    var userid = $(elm).attr('user-id');
    var privacy = $(elm).attr('data-privacy');
    var conversationid = $(elm).attr('data-conv-id');
    var name = $(elm).attr('data-name').replace(/#/g, "");
    var img = $(elm).attr('data-img');
    var status = $(elm).attr('room-status');
    var pin = $(elm).find('.pin').hasClass('active') ? 'pin' : 'unpin';
    var mute = $(elm).find('.mute_noti').hasClass('active') ? $(elm).find('.mute_noti').attr('data-mute-id') : 'unmute';
    window.open('/connect/chat/' + type + '/' + privacy + '/' + userid + '/' + unreadThread + '/' + has_flagged + '/' + status + '/' + conversationid + '/' + name + '/' + img + '/' + pin + '/' + mute, '_self');
    scrollToBottom('#msg-container');
}

function backToConnect2(e, elm) {
    window.open('/connect', '_self');
}

function viewCallHistory(e, elm) {
    $('.connect_section,.head_container,.foot_container').hide();
    $('#call_view_histroy').show();
}


function backToConnect(e, elm) {
    $('.connect_section,.head_container,.foot_container').show();
    $('.connect_section,.head_container,.foot_container').show();
    $('#call_view_histroy').hide();
}

function moreActionBW(e, elm, type) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ($(elm).attr('data-checklist') == 'true') {
        addMsgCheckList();
        $(elm).removeAttr('data-checklist');
    } else {
        if ($('#' + type).is(':visible')) {
            $('#' + type).hide();
        } else {
            $('#' + type).show();
            var url = window.location.href.split('/');

            var mute = decodeURI(url[url.length - 1]);
            if (mute == 'unmute') {
                $("#more_options_chat").find(".muteNotifi").find(".text").text('Mute');
                $("#more_options_chat").find(".muteNotifi").attr('onclick', 'muteNotification(this)');
            } else {
                $("#more_options_chat").find(".muteNotifi").find(".text").text('Unmute');
                $("#more_options_chat").find(".muteNotifi").attr('onclick', 'unmuteNotification(event, "' + mute + '")');
            }
        }
    }
}

$(document).mouseup(function(e) {
    var emojiPopup = $("#emojiPopup");
    var emoji_popover = $(".intercom-composer-emoji-popover");
    var fileTagsPopup = $(".fileTagsPopup");
    var image_viewer = $("#image_viewer");
    var optMore_options = $(".optMore_options");
    var msg_reactionsDiv = $(".msg_reactionsDiv");
    var more_options_chat = $("#more_options_chat");
    var filter = $(".b_label.filter");
    var msgSingleOpt = $(".thread_msg_opt.active");

    var popupSec = $('.popup_sec');
    var moreBW = $('#more_options');
    var moreBWChat = $('#more_options_chat');
    var moreBWMsg = $('#more_options_msg');
    var chatActionBW = $('#chat_actions_list');
    var profileNav = $('.profilenavMainSection');
    var filter_popup = $('.filter_popup');
    var _task_opt_popup = $('._task_opt_popup');

    if (emojiPopup.is(':visible')) {
        if (!emojiPopup.is(e.target) && emojiPopup.has(e.target).length === 0 && !$('.emoji_ico').is(e.target) && $('.emoji_ico').has(e.target).length === 0) {
            emojiPopup.hide();
        }
    }
    if (emoji_popover.is(':visible')) {
        if ($(e.target).attr('class') != '.intercom-composer-emoji-popover' &&
            $(e.target).parents(".intercom-composer-emoji-popover").length == 0 &&
            !$('.emoji_ico').is(e.target) && $('.emoji_ico').has(e.target).length === 0) {
            emoji_popover.hide();
        }
    }
    if (filter_popup.is(':visible')) {
        if (!filter_popup.is(e.target) && !$('.rm_hidden_mob').is(e.target) && filter_popup.has(e.target).length === 0) {
            filter_popup.hide();
            $('.breakText.rm_hidden_mob').removeClass('active');
        }
    }
    if (_task_opt_popup.is(':visible')) {
        if (!_task_opt_popup.is(e.target) && _task_opt_popup.has(e.target).length === 0) {
            _task_opt_popup.hide();
            $('.checkListItem ._task_option').removeClass('active');
        }
    }
    if (fileTagsPopup.is(':visible')) {
        if (!fileTagsPopup.is(e.target) && fileTagsPopup.has(e.target).length === 0 && !$('.file_tags').is(e.target) && $('.file_tags').has(e.target).length === 0) {
            fileTagsPopup.hide();
        }
    }
    if (optMore_options.is(':visible')) {
        if (!optMore_options.is(e.target) && optMore_options.has(e.target).length === 0 && !$('.options.opt_more').is(e.target)) {
            optMore_options.hide();
        }
    }
    if (msg_reactionsDiv.is(':visible')) {
        if (!msg_reactionsDiv.is(e.target) && msg_reactionsDiv.has(e.target).length === 0 && !$('.options.opt_emoji').is(e.target)) {
            msg_reactionsDiv.hide();
        }
    }
    if (more_options_chat.is(':visible')) {
        if (!more_options_chat.is(e.target) &&
            more_options_chat.has(e.target).length === 0 &&
            !$('.more_ico2').is(e.target)) {
            more_options_chat.hide();
        }
    }
    if (filter.hasClass('active')) {
        if (!filter.is(e.target) && filter.has(e.target).length === 0 && !$('#filterDataPopup').is(e.target) && $('#filterDataPopup').has(e.target).length === 0) {
            more_options_chat.hide();
            $(filter).removeClass('active');
            $('#filterDataPopup').css('right', '-280px');
        }
    }

    if ($('.popup_sec').is(':visible')) {
        if (!$('.popup_sec .option').is(e.target) && $('.popup_sec .option').has(e.target).length === 0) {
            $('.popup_sec').fadeOut();
        }
    }
    if (msgSingleOpt.is(':visible')) {
        if (!msgSingleOpt.is(e.target) && msgSingleOpt.has(e.target).length === 0) {
            msgSingleOpt.removeClass('active');
        }
    }
    if (moreBWMsg.is(':visible')) {
        if (!$('#more_options_msg .option').is(e.target) && $('#more_options_msg .option').has(e.target).length === 0) {
            moreBWMsg.fadeOut();
        }
    } else if (moreBW.is(':visible')) {
        if (!$('#more_options .option').is(e.target) && $('#more_options .option').has(e.target).length === 0) {
            $('.foot_left .more_ico').removeClass('active')
            moreBW.fadeOut();
        }
    } else if (chatActionBW.is(':visible')) {
        if (!$('#chat_actions_list .option').is(e.target) && $('#chat_actions_list .option').has(e.target).length === 0) {
            $('.foot_mid .chat_action_ico').removeClass('active');
            chatActionBW.fadeOut();
        }
    } else if (profileNav.is(':visible')) {
        if (!$(e.target).hasClass('down_arrow')) {
            if (!profileNav.is(e.target) && profileNav.has(e.target).length === 0) {
                showProfileNav($('.head_container .down_arrow'));
            }
        }
    }

});

function viewMsg_options(elm) {
    if ($(elm).attr('data-type') == 'collapse') {
        $(elm).attr('data-type', 'expand');
    } else {
        $(elm).attr('data-type', 'collapse');
    }
}

var datalength = 0;
var duration = 400;
var already_taphold = false;
var single_click = false;
var touch_move = false;

$("body").on("touchmove", "div.user_msg", function(event) {
    if (event.type == 'touchmove') {
        touch_move = true;
    }
});

$("body").on("taphold", "div.user_msg", { duration }, function(event) {
    var chk_1 = $(event.target).parents('div.user_msg').hasClass('editable_msg');
    var chk_2 = $(event.target).parents('div.user_msg').hasClass('deleted');
    if (!chk_1 && !chk_2) {
        msg_selection(event);
        already_taphold = true;
        if (touch_move) {
            single_click = false;
        }
    }
});

$("body").on("touchend", "div.user_msg", function(event) {
    var chk_2 = $(event.target).parents('div.user_msg').hasClass('deleted');
    if ($('#msg_opt_div').is(':visible')) {
        if (touch_move) {
            single_click = false;
            touch_move = false;
        } else {
            single_click = true;
        }
    }
    if (already_taphold === false && single_click === true && touch_move === false) {
        if (!chk_2) {
            msg_selection(event);
        }
    } else {
        already_taphold = false;
    }
});

function msg_selection(event) {
    var msg;
    if (!$('div.user_msg').is(event.target)) {
        msg = $(event.target).parents('div.user_msg');
    } else {
        msg = $(event.target);
    }

    if (msg.hasClass('selected_msg')) {
        datalength -= 1;
        $('.count_selected_msg').text(datalength);
        $('#selectAllMsg').removeClass('selected');
        msg.removeClass('selected_msg');
        var sender = $('.user_msg.selected_msg').attr('data-senderid');
        if (datalength < 1) {
            $('.options.opt_emoji').css({ 'pointer-events': 'none', 'opacity': '0.5' });
            $('.options.opt_flag').css({ 'pointer-events': 'none', 'opacity': '0.5' });
            $('.options.opt_reaply').css({ 'pointer-events': 'none', 'opacity': '0.5' });
            $('.options.opt_delete').css({ 'pointer-events': 'none', 'opacity': '0.5' });
            $('.options.opt_more').css({ 'pointer-events': 'none', 'opacity': '0.5' });

            if (msg.find('.msg_flag .flaged_icon').length) {
                $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/NotFlagged.svg)' });
            }
            already_taphold = false;
            single_click = false;
        } else if (datalength == 1) {
            // msg.removeClass('selected_msg');
            $('.msg_options .options').css('width', '16.5%');
            $('.options.selected_msg').hide();
            $('.options.opt_emoji, .options.opt_reaply').show();
            $('.moreOptList.addtagMsg').show();
            if ($('.user_msg.selected_msg').attr('msg-type') == 'call') {
                $('.moreOptList.editMsg').hide();
                $('.moreOptList.convert_task').hide();
                $('.moreOptList.addtagMsg').hide();
            } else {
                if (sender != user_id) {
                    $('.moreOptList.editMsg').hide();
                    if ($('.user_msg.selected_msg').attr('msg-type') == 'checklist' &&
                        // $('.user_msg.selected_msg').find('.msg-send-seen-delivered').text() == '- Editable' && 
                        !$('.user_msg.selected_msg').hasClass('converted')) {
                        $('.moreOptList.editMsg').show();
                    }
                } else {
                    $('.moreOptList.editMsg').show();
                    if ($('.user_msg.selected_msg').attr('msg-type') == 'checklist' && $('.user_msg.selected_msg').hasClass('converted')) {
                        $('.moreOptList.editMsg').hide();
                    }
                }
                if ($('.user_msg.selected_msg').attr('msg-type') != 'checklist') {
                    $('.moreOptList.convert_task').show();
                } else {
                    $('.moreOptList.convert_task').hide();
                }
            }


            if ($('div.user_msg.selected_msg').find('.msg_flag .flaged_icon').length) {
                $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/Flagged.svg)' });
            }
        } else {
            $('.moreOptList.editMsg').hide();
            $('.moreOptList.convert_task').hide();
            $('.moreOptList.addtagMsg').hide();
        }
        // msg.removeClass('selected_msg');
    } else {
        console.log(msg.attr('msg-type'))
        if (msg.attr('msg-type') != 'notification') {
            var visibleData = $('#msg-container .user_msg:visible').length;
            var sender = msg.attr('data-senderid');

            $('#msg_opt_div').show();
            $('.msg_separator').hide();
            msg.addClass('selected_msg');
            datalength += 1;
            $('.count_selected_msg').text(datalength);

            if (datalength > 1) {
                $('.options.opt_emoji, .options.opt_reaply').hide();
                $('.options.selected_msg').css('display', 'flex');
                $('.msg_options .options').css('width', '20%');
                $('.options.select_msg').show();
                $('.moreOptList.addtagMsg').hide();
                if ($('div.user_msg.selected_msg').find('.msg_flag .flaged_icon').length) {
                    $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/NotFlagged.svg)' });
                }
                $('.moreOptList.editMsg').hide();
                $('.moreOptList.convert_task').hide();
            } else if (datalength == 1) {
                if ($('.user_msg.selected_msg').attr('msg-type') == 'call') {
                    $('.moreOptList.editMsg').hide();
                    $('.moreOptList.convert_task').hide();
                    $('.moreOptList.addtagMsg').hide();
                } else {
                    if (sender != user_id) {
                        $('.moreOptList.editMsg').hide();
                        if (msg.attr('msg-type') == 'checklist' &&
                            !msg.hasClass('converted') &&
                            msg.find('.msg-send-seen-delivered').text() == '- Editable') {
                            $('.moreOptList.editMsg').show();
                        }
                    } else {
                        $('.moreOptList.editMsg').show();
                        if ($('.user_msg.selected_msg').attr('msg-type') == 'checklist' && $('.user_msg.selected_msg').hasClass('converted')) {
                            $('.moreOptList.editMsg').hide();
                        }
                    }
                    if (msg.attr('msg-type') != 'checklist') {
                        $('.moreOptList.convert_task').show();
                    } else {
                        $('.moreOptList.convert_task').hide();
                    }

                }

                if ($('div.user_msg.selected_msg').find('.msg_flag .flaged_icon').length) {
                    $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/Flagged.svg)' });
                }

                $('.options.opt_emoji').css({ 'pointer-events': 'auto', 'opacity': '1' });
                $('.options.opt_flag').css({ 'pointer-events': 'auto', 'opacity': '1' });
                $('.options.opt_reaply').css({ 'pointer-events': 'auto', 'opacity': '1' });
                $('.options.opt_delete').css({ 'pointer-events': 'auto', 'opacity': '1' });
                $('.options.opt_more').css({ 'pointer-events': 'auto', 'opacity': '1' });
            }
            if (datalength == visibleData) {
                $('#selectAllMsg').addClass('selected');
            }
        }
    }
}

// function thread_selection(e) {
// 	console.log(e.target);
// 	var msg;
// 	if(!$('div.main-thread-msgs').is(e.target)){
// 		msg = $(e.target).parents('div.main-thread-msgs');
// 	}else{
// 		msg = $(e.target);
// 	}

// 	if (msg.hasClass('selected_msg')) {
// 		msg.removeClass('selected_msg');
// 	} else {
// 		// $('#msg_opt_div').show()
// 		msg.addClass('selected_msg');
// 	}
// }

function selectConvs() {
    if ($('#selectAllMsg').hasClass('selected')) {
        $('#selectAllMsg').removeClass('selected')
    }
    $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/NotFlagged.svg)' });

    already_taphold = true;
    // if (touch_move) {
    // 	single_click = false;
    // }
    single_click = true;
    $('#more_options_chat').hide();
    $('#msg_opt_div').show()
    $('.msg_separator').hide();
    $('.moreOptList.editMsg').hide();

    $('.options.opt_emoji').css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('.options.opt_flag').css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('.options.opt_reaply').css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('.options.opt_delete').css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('.options.opt_more').css({ 'pointer-events': 'none', 'opacity': '0.5' });
}

function opt_selectAllMsg(elm) {
    $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/NotFlagged.svg)' });
    if ($(elm).hasClass('selected') == false) {
        $(elm).addClass('selected');
        $('#msg-container .user_msg').removeClass('selected_msg');
        $('.count_selected_msg').text(0);
        $.each($('#msg-container .user_msg:visible'), function(k, v) {
            datalength = k + 1;
            $(v).addClass('selected_msg');
            $('.count_selected_msg').text(k + 1);
            $('.options.opt_emoji, .options.opt_reaply').hide();
            $('.moreOptList.editMsg').hide();
            $('.options.selected_msg').css('display', 'flex');
            $('.msg_options .options').css('width', '20%');
            $('.options.select_msg').show();
        });

        $('.options.opt_emoji').css({ 'pointer-events': 'auto', 'opacity': '1' });
        $('.options.opt_flag').css({ 'pointer-events': 'auto', 'opacity': '1' });
        $('.options.opt_reaply').css({ 'pointer-events': 'auto', 'opacity': '1' });
        $('.options.opt_delete').css({ 'pointer-events': 'auto', 'opacity': '1' });
        $('.options.opt_more').css({ 'pointer-events': 'auto', 'opacity': '1' });
    } else {
        $(elm).removeClass('selected');
        $.each($('#msg-container .selected_msg'), function(k, v) {
            datalength = 0;
            $(v).removeClass('selected_msg');
            $('.count_selected_msg').text(0);
            $('.msg_options .options').css('width', '16.5%');
            $('.options.selected_msg').hide();
            $('.options.opt_emoji, .options.opt_reaply').show();
            $('.moreOptList.editMsg').hide();
        });

        $('.options.opt_emoji').css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $('.options.opt_flag').css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $('.options.opt_reaply').css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $('.options.opt_delete').css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $('.options.opt_more').css({ 'pointer-events': 'none', 'opacity': '0.5' });
    }
}

function cancel_selection() {
    datalength = 0;
    single_click = false;
    selected_msgid = [];
    $('.options.selected_msg').hide();
    $('.msg_options .options').css('width', '16.5%');
    $('.options.opt_emoji, .options.opt_reaply').show();
    $('#msg_opt_div').hide();
    $('.msg_separator').css('display', 'flex');
    $('.user_msg.selected_msg').removeClass('selected_msg');

    $('.options.opt_emoji').css({ 'pointer-events': 'auto', 'opacity': '1' });
    $('.options.opt_flag').css({ 'pointer-events': 'auto', 'opacity': '1' });
    $('.options.opt_reaply').css({ 'pointer-events': 'auto', 'opacity': '1' });
    $('.options.opt_delete').css({ 'pointer-events': 'auto', 'opacity': '1' });
    $('.options.opt_more').css({ 'pointer-events': 'auto', 'opacity': '1' });

    if ($('#selectAllMsg').hasClass('selected')) {
        $('#selectAllMsg').removeClass('selected')
    }
    $('.options.opt_flag').css({ 'background-image': 'url(/images/basicAssets/NotFlagged.svg)' });
    already_taphold = false;
    single_click = false;
}

function opt_moreView(elm) {
    if ($('.optMore_options').is(':visible')) {
        $('.optMore_options').hide();
    } else {
        if ($('.user_msg.selected_msg').attr('msg-type') == 'checklist' && !$('.user_msg.selected_msg').hasClass('converted')) {
            $('.moreOptList.editMsg').show();
            console.log('Test');
        }
        $('.optMore_options').show();
    }
}


function threadAction(e, type) {
    if (type == 'open') {
        $('.thread_msg_opt ').removeClass('active');
        $(e.target).addClass('active');
    } else if (type == 'close') {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(e.target).parent('.thread_msg_opt').removeClass('active');
    }
}

function deleteThreadMsg(e) {
    var creator = $(e.target).parent('.thread_msg_opt').attr('created-by');
    var msg_id = $(e.target).parent('.thread_msg_opt').attr('msg-id');
    var msg = $('.rep_msg_' + msg_id).html();

    $('#deleteMsgPopup').css({ 'display': 'flex', 'z-index': '3' });
    $('#deleteMsgPopup .main-deleted-msg').html(msg);
    if (creator == user_id) {
        // console.log('Welcome ! Its you.');
        $('#deleteMsgPopup .msg_del_all').show();
        $('#deleteMsgPopup .msg_del_me').show();
    } else {
        // console.log('Sorry ! Its not you.');
        $('#deleteMsgPopup .msg_del_me').show();
        $('#deleteMsgPopup .msg_del_all').hide();
    }
}




var old_body = '';

function editReplyMsg(e) {
    var msg_id = $(e.target).parent('.thread_msg_opt').attr('msg-id');
    old_body = $('#rep_msg_body' + msg_id).html();
    $('#rep_msg_body' + msg_id).hide();
    $('#rep_msg_body' + msg_id).after('<div id="edit_rep_body' + msg_id + '" contenteditable="true" class="editRepMsgBody">' + old_body + '</div>');
    $('#edit_rep_body' + msg_id).after('<div class="msgBtnGroup"><button onclick="cancelEditRepMsg(this,\'' + msg_id + '\')" class="hv_btn hv_btn_sm" style="margin-right: 12px">Cancel</button> <button onclick="saveEditRepMsg(this,\'' + msg_id + '\')" class="hv_btn hv_btn_sm btn_success">Update</button></div>');
    $('.rep_msg_' + msg_id).addClass('edit_action_on');
    placeCaretAtEnd(document.getElementById('edit_rep_body' + msg_id));
}

function saveEditRepMsg(ele, msg_id) {
    // console.log(11, $('#reaplyMsgPopup').attr('thread_root'));

    var new_body = $('#edit_rep_body' + msg_id).html();
    new_body = new_body.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    new_body = convert(new_body);
    new_body = new_body.replace(/&nbsp;/gi, '').trim();
    new_body = new_body.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');

    var data = {
        conv_id: thread_id,
        thread_root_id: $("#reaplyMsgPopup").attr("data-rep_con_id"),
        msg_id: msg_id,
        msg_body: new_body,
        update_at: new Date().getTime().toString(),
        sender: user_id,
        sender_img: user_img,
        sender_name: user_fullname,
        attch_audiofile: [],
        attch_imgfile: [],
        attch_otherfile: [],
        attch_videofile: [],
        type: 'reply'
    };

    if ($('#rep_msg_body' + msg_id).text() == $('#edit_rep_body' + msg_id).text()) {
        console.log('Nothing to change');
    } else {
        if ($('#edit_rep_body' + msg_id).text().length > 0) {
            socket.emit('msg_update', data, (res) => {
                $('.rep_msg_' + msg_id).remove();
            });
        }
    }
}


socket.on('msg_fully_delete_broadcast', function(data) {

    console.log(data);
    // if(data.conv_id == undefined){
    //     data.conv_id = data.conversation_id;
    // }
    // if($('#conv'+data.conv_id).hasClass('sideActive')){
    //     if($('.msg_id_'+data.msg_id).is(':visible')){
    //         $('.msg_id_'+data.msg_id).remove();
    //     }
    // }else if($('#threadReplyPopUp').attr('thread_root') == data.conv_id){
    $('.rep_msg_' + data.msg_id).remove();
    $('.msg_id_' + data.msg_id).remove();
    // }
});


function cancelEditRepMsg(ele, msg_id) {
    $('.rep_msg_' + msg_id).removeClass('edit_action_on');
    $('.rep_msg_' + msg_id).find('.editRepMsgBody').remove();
    $('.rep_msg_' + msg_id).find('.msgBtnGroup').remove();
    $('#rep_msg_body' + msg_id).show();
}



function open_new_topic_popup() {
    $("#temp_invite_member_list").html("");
    $("#roomImg")[0].reset();
    $("#room-name").val("");
    $("#topic_tag_list").html("");
    $("#view_room_img").attr("src", file_server + 'room-images-uploads/Photos/feelix.jpg').attr("data-src", "feelix.jpg");
    memberList = [];
    memberListUUID = [];
    allteams = [];
    // $("#temp_invite_member_list").attr("onclick", "open_invite_member_list()");
    $("#topic_tag_list").closest('.topic_rows').show();
    if (page_title == 'connect') {
        $("#grpPrivacy").prop("checked", true);
        socket.emit('getBUnit', { user_id: user_id }, function(res) {
            if (res.status) {
                allUnit = res.data;
                $('#business_unit').html("");
                $.each(allUnit, function(k, v) {
                    $('#business_unit').prepend('<option value="' + v.unit_id + '">' + v.unit_name + '</option>');
                });
            }
        });
        socket.emit('get_all_team', { user_id: user_id }, function(res) {
            if (res.status) {
                $('#select-ecosystem').html("");
                allteams = res.teams;
                $.each(allteams, function(k, v) {
                    $('#select-ecosystem').prepend('<option value="' + v.team_id + '">' + v.team_title + '</option>');
                });
            }
        });
        $('#newTopicPopup').css('display', 'flex');
        $('.caller_id_row').hide();
        $('#more_options_chat').hide();
    }
    if (page_title == 'chat' && $("#user_head_id").attr('conv-type') === 'group') {
        var keyspace = $("#user_head_id").attr('data-keyspace');
        $('#select-ecosystem').html("");
        $("#grpPrivacy").attr('onclick', 'grpPrivacyUpdate(event)').attr('id', 'grpPrivacyUpdate');
        var pathname = window.location.href;
        pathname = pathname.split('/');

        if (pathname.indexOf('public') != -1) {
            $("#grpPrivacyUpdate").prop("checked", false);
        } else if (pathname.indexOf('private') != -1) {
            $("#grpPrivacyUpdate").prop("checked", true);
        }

        socket.emit('getBUnit', { user_id: user_id }, function(res) {
            if (res.status) {
                allUnit = res.data;
                $.each(allUnit, function(k, v) {
                    if (v.unit_id == $("#user_head_id").attr('data-bunit')) {
                        $('#business_unit').append('<option value="' + v.unit_id + '" selected>' + v.unit_name + '</option>');
                    } else {
                        $('#business_unit').append('<option value="' + v.unit_id + '">' + v.unit_name + '</option>');

                    }
                });
            }
        });

        socket.emit('get_all_team', { user_id: user_id }, function(res) {
            if (res.status) {
                $('#select-ecosystem').html("");
                allteams = res.teams;
                for (var i = 0; i < allteams.length; i++) {
                    var selected = (allteams[i].team_id == keyspace) ? 'selected' : '';
                    var opt = '<option value="' + allteams[i].team_id + '" ' + selected + '>' + allteams[i].team_title + '</option>';
                    $("#select-ecosystem").append(opt);
                }
            }
        });

        socket.emit('getConvTagId', { conversation_id: conversation_id, company_id: company_id }, function(res) {
            if (res.status) {
                console.log(res);
                $('#callerid_url').val(window.location.origin + "/call/" + res.vgd);
            }
        });

        var conv_name = $(".converstaion_name").text();
        $("#room-name").val(conv_name);
        $("#newTopicPopup .popup_title").text('Update Room');
        $("#CreateGroup").text('Update Room');
        $("#CreateGroup").attr('onclick', 'updateRooms()');
        $("#business_unit").attr('onchange', 'business_unitChangeUp(this)');
        $("#upload-channel-photo").attr('onchange', 'roomImageUpdate(\'' + $("#user_head_id").attr('room-id') + '\',event,this.files)');
        $("#select-ecosystem").attr('onchange', 'updateWorkspace(this.value)');
        $("#view_room_img").attr('src', $("#roomImage").attr('src'));
        $("#temp_guest_member_list").html("");
        console.log(user_list, participants)
        $.each(user_list, function(ka, va) {
            $.each(participants, function(k, v) {
                if (va.id == v) {
                    var mydata = {
                        id: va.id,
                        fullname: va.fullname,
                        img: va.img,
                        role: va.role
                    };
                    memberList.push(mydata.fullname);
                    memberListUUID.push(mydata.id);
                    if (va.role == 'Guest') {
                        $("#temp_guest_member_list").append(draw_selected_room_user(mydata, 'Guest'));
                    } else {
                        $("#temp_invite_member_list").append(draw_selected_room_user(mydata));
                    }
                }
            });
        });
        if (adminListUUID.indexOf(user_id) == -1) {
            $("#business_unit").attr("disabled", true);
            $("#room-name").attr("disabled", true);
            $("#select-ecosystem").attr("disabled", true);
            $("#temp_invite_member_list").attr("onclick", "");
        }
        $("#topic_tag_list").closest('.topic_rows').hide();
        $('#newTopicPopup').css('display', 'flex');
        $('.caller_id_row').show();
        $('#more_options_chat').hide();
    }
}

function selecteTopic(elm, type) {
    if (type == 'social') {
        $('.topicTypeWork').removeClass('selected');
        $(elm).addClass('selected');
        $('.business_unit_row').hide();
        $("#room_type").val("social");
    } else if (type == 'work') {
        $('.topicTypeSocial').removeClass('selected');
        $(elm).addClass('selected');
        $('.business_unit_row').css('display', 'flow-root');
        $("#room_type").val("work");
    }
}

function updateRooms() {
    var pathname = window.location.href;
    pathname = pathname.split('/');

    var rmImg = $('#view_room_img').attr('src');
    rmImg = rmImg.split('/')[rmImg.split('/').length - 1];
    var data_src = $('#view_room_img').attr('data-src');
    var rmTitle = $('#room-name').val().trim();
    var rmPrivacy = $('#grpPrivacyUpdate').is(':checked');
    var imgIndex = pathname.indexOf(rmImg);
    var privacy = '';
    if (rmPrivacy) {
        privacy = 'private';
    } else {
        privacy = 'public';
    }

    var conditionChecker = false;
    if (conditionChecker == false) {
        if (imgIndex == -1) {
            pathname[pathname.length - 3] = data_src;
        }
        if (decodeURI(pathname[pathname.length - 4]) != rmTitle) {
            pathname[pathname.length - 4] = rmTitle;
        }
        if (pathname.indexOf(privacy) == -1) {
            // param_change(pathname[pathname.indexOf(privacy)], privacy);
            pathname[6] = privacy;
        }
        conditionChecker = true;
    }
    if (conditionChecker) {
        window.location.href = pathname.join('/');
    }
    closePopUps('#newTopicPopup');
}

function updateWorkspace(thisValue) {
    if ($.inArray(user_id, adminListUUID) !== -1) {

        var roomid = $("#user_head_id").attr('room-id');
        var roomTitle = $(".conv_title.converstaion_name").text();

        socket.emit('updateKeySpace', {
            conversation_id: roomid,
            keySpace: thisValue,
            user_id: user_id,
            company_id: company_id
        }, (callBack) => {
            // toastr["success"]("Workspace changed successfully", "Success");
        });
    } else {
        // toastr["warning"]("Please contact with room owner or admin", "Warning");

        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('Please contact with Room Owner or Admin');
    }
}

function business_unitChangeUp(elm) {
    var val = $(elm).val();
    if (val == '') {
        val = null;
    }
    var roomid = $('#user_head_id').attr('room-id');
    if (roomid !== '') {
        socket.emit('updateBusinessUnit', {
            conversation_id: roomid,
            unit_id: val,
            user_id: user_id,
            company_id: company_id
        }, function(res) {
            if (res.status) {
                $.each(allUnit, function(k, v) {
                    if (v.unit_id == val) {
                        $('#room-name').text(v.unit_name);
                    }
                });
            } else {
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Something wrong!!!!');
            }
        });
    }
}

function open_invite_member_list(type) {
    if (type == 'member') {
        $('.topic_rows.members_row').find('.popup_title').html('Add Member(s)');
        $('#newRoomMemberList').html("");
        var teamid = $("#select-ecosystem").val();
        $.each(allteams, function(tk, tv) {
            if (teamid == tv.team_id) {
                $.each(user_list, function(k, v) {
                    if (v.id != user_id) {
                        if (tv.participants.indexOf(v.id) > -1)
                            $('#newRoomMemberList').append(returnRoomMListDe(v));
                    }
                });
                $('.members_row .invite_userList').show();
            }
        });
    } else if (type == 'guest') {
        $('.topic_rows.guest_row').find('.popup_title').html('Update Guest(s) <span class="addnewguest" onclick="open_add_new_guest_Pop()">Add New</span>');
        $('#newguestMemberList').html("");
        // var teamid = $("#select-ecosystem").val();
        // $.each(allteams, function (tk, tv) {
        // 	if (teamid == tv.team_id) {
        // 		$.each(user_list, function (k, v) {
        // 			if(v.id != user_id){
        // 				if (tv.participants.indexOf(v.id) > -1)
        // 					$('#newRoomMemberList').append(returnRoomMListDe(v));
        // 			}
        // 		});
        // 		$('.guest_row .invite_userList').show();
        // 	}
        // });
        $.each(user_list, function(k, v) {
            // if(participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1){
            if (v.role == 'Guest') {
                if (v.id != user_id) {
                    if (v.is_active !== 0 && v.is_delete == 0) {
                        $('#newguestMemberList').append(returnRoomMListDe(v));
                    }
                }
            }
        })
        $('.guest_row .invite_userList').show();
    }
}

function open_add_new_guest_Pop() {
    $('#add_Guest_popup').css('display', 'flex');
}

function add_temp_guest_user() {
    var name1 = $("#gufn1").val().trim();
    var name2 = $("#gufn2").val().trim();
    var email = $("#guem").val().trim();
    var type = (page_title == 'chat') ? "update" : "new";
    console.log(1086, { email, name1, name2, company_id: company_id });
    var re = /\S+@\S+\.\S+/;
    if (re.test(email) && name1 != '' && name2 != '') {
        socket.emit('add_guest_user', { email, name: name1 + ' ' + name2, company_id: company_id, created_by: user_id }, (res) => {
            console.log(936, res);
            if (res.status) {
                var id = res.user.id;
                res.user.is_active = 1;
                res.user.is_delete = 0;
                user_list.push(res.user);
                allUserdata[0].users.push(res.user);
                userlistWithname[id] = res.user.fullname;
                closePopUps('#add_Guest_popup');
                if (type == 'new') {
                    temppNewMemberuudi.push(id);
                    $(".addGuestBtn").trigger("click");
                } else if (type == 'update') {
                    $(".addGuestBtn").trigger("click");
                }
            } else {
                if (res.user.id) {
                    alert("This user already exists into this company.");
                } else {
                    alert("Invalid email address.");
                }
            }
        });
    } else {
        alert("Name or email missing.");
    }
}

function add_contact_list() {
    drawAllContactList();
    $('#addContactPopup').show();
}

function inviteMember(elm, type) {
    var mydata = {
        id: $(elm).attr('data-id'),
        fullname: $(elm).attr('data-name'),
        img: $(elm).attr('data-img')
    }
    if (page_title == 'chat') {
        if (type == 'not_yet') {
            if ($(elm).hasClass('selected') == false) {
                $(elm).addClass('selected').removeClass('not_yet');
                $(elm).attr('onclick', 'inviteMember(this,\'selected\')');
                memberList.push(mydata.fullname);
                memberListUUID.push(mydata.id);
                $("#temp_invite_member_list").append(draw_selected_room_user(mydata));
                makeMember(mydata.id, mydata.fullname, 'add_new_member');
            } else {
                removeA(memberList, mydata.fullname);
                removeA(memberListUUID, mydata.id);
                $("#temp_invite_member_list").find("#tmpinvuid" + mydata.id).remove();
                $(elm).removeClass('selected');
                removeMember(mydata.id, mydata.fullname);
            }
        } else if (type == 'selected') {
            if (adminListUUID.indexOf(mydata.id) > -1) {
                $('#makeAdminPopup .make-admin-btn').text('Remove Admin');
                $('#makeAdminPopup .make-admin-btn').attr('onclick', 'makeMember("' + mydata.id + '", "' + mydata.fullname + '", "remove_admin")');
                $('#makeAdminPopup .hv_btn.btn_danger').hide();
            } else {
                $('#makeAdminPopup .make-admin-btn').text('Make Admin');
                $('#makeAdminPopup .make-admin-btn').attr('onclick', 'makeAdmin("' + mydata.id + '", "' + mydata.fullname + '")');
                $('#makeAdminPopup .hv_btn.btn_danger').attr('onclick', 'removeMember("' + mydata.id + '", "' + mydata.fullname + '")');
                $('#makeAdminPopup .hv_btn.btn_danger').show();
            }
            $('#makeAdminPopup').css('display', 'flex');
        }
    } else {
        if ($(elm).hasClass('selected') == false) {
            $(elm).addClass('selected');
            memberList.push(mydata.fullname);
            memberListUUID.push(mydata.id);
            $("#temp_invite_member_list").append(draw_selected_room_user(mydata));
        } else {
            removeA(memberList, mydata.fullname);
            removeA(memberListUUID, mydata.id);
            $("#temp_invite_member_list").find("#tmpinvuid" + mydata.id).remove();
            $(elm).removeClass('selected');
        }
    }
}

function draw_selected_room_user(data, type) {
    var admin = (adminListUUID.indexOf(data.id) > -1) ? 'Admin' : 'Member';
    var html = '<div class="invited_user ' + admin + '" id="tmpinvuid' + data.id + '">';
    html += '<span class="tempE img"><img src="' + file_server + 'profile-pic/Photos/' + data.img + '"></span>';
    html += '<p class="tempE name">' + data.fullname + '</p>';
    html += '<p class="tempE designation">[' + (type != 'Guest' ? admin : type) + ']</p>';
    html += '<span class="tempE tempRemove"></span>';
    html += '</div>';
    return html;
}

function drawnewRoomMemberList() {
    $('#newRoomMemberList').html("");

    $.each(user_list, function(k, v) {
        $('#newRoomMemberList').append(returnRoomMListDe(v))
    })
}

var temppconvSingle = false;
var temppconvSingleGo = false;
var temppconvSingleFriendId = null;
var goconvId = [];

function drawAllContactList() {
    $('#AllContactMemberList').html("");
    $.each(user_list, function(k, v) {
        if (v.id != user_id) {
            var html = '<div class="eachmember showEl" onclick="temmpSingleConv(this,\'' + v.id + '\',\'' + v.img + '\',\'' + v.fullname + '\',\'' + v.designation + '\')" data-id="' + v.id + '" data-img="' + v.img + '" data-name="' + v.fullname + '">';
            html += '<div class="member_img">';
            html += '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
            html += '<div class="status ' + (onlineUserList.indexOf(v.id) === -1 ? "offline" : "online") + ' conv_' + v.id + '"></div>';
            html += '</div>';

            html += '<div class="member_info">';
            html += '<h2 class="member_title name"> ' + v.fullname + '</h2>';
            html += '<span class="invite_btn"></span>';
            html += '</div>';
            html += '</div>';
            $('#AllContactMemberList').append(html);
        }
    })

    temppconvSingle = false;
    temppconvSingleGo = false;
    temppconvSingleFriendId = null;
}


function temmpSingleConv(elm, id, img, fullname, designation) {
    if (temppconvSingle) {
        if ($(elm).hasClass('selected')) {
            $(elm).removeClass('selected');
            $('#startSingleConv').removeClass('active');
            temppconvSingle = false;
            temppconvSingleGo = false;
            temppconvSingleFriendId = null;
        } else {
            $('#AllContactMemberList .eachmember').removeClass('selected');
            $(elm).addClass('selected');
            temppconvSingle = true;

            socket.emit('findConvExistornot', {
                friend_id: id,
                user_id: user_id
            }, function(res) {
                if (res.exist) {
                    goconvId = res.result;
                    if ($('.convid' + goconvId.conversation_id).is(':visible')) {
                        $('#startSingleConv').text('Go to Conversation');
                    } else {
                        $('#startSingleConv').text('Start Conversation');
                    }
                    $('#startSingleConv').addClass('active');
                    temppconvSingleGo = true;
                    temppconvSingleFriendId = id;
                } else {
                    $('#startSingleConv').text('Start Conversation');
                    $('#startSingleConv').addClass('active');
                    temppconvSingleGo = false;
                    temppconvSingleFriendId = id;
                }
            });
        }
    } else {
        $(elm).addClass('selected');
        temppconvSingle = true;
        socket.emit('findConvExistornot', {
            friend_id: id,
            user_id: user_id
        }, function(res) {
            if (res.exist) {
                goconvId = res.result;
                if ($('.convid' + goconvId.conversation_id).is(':visible')) {
                    $('#startSingleConv').text('Go to Conversation');
                } else {
                    $('#startSingleConv').text('Start Conversation');
                }
                $('#startSingleConv').addClass('active');
                temppconvSingleGo = true;
                temppconvSingleFriendId = id;
            } else {
                $('#startSingleConv').text('Start Conversation');
                $('#startSingleConv').addClass('active');
                temppconvSingleGo = false;
                temppconvSingleFriendId = id;
            }
        });
    }
}


function submitnewSingleConv() {
    if (temppconvSingleGo) {
        if ($('.convid' + goconvId.conversation_id).is(':visible')) {
            $('.convid' + goconvId.conversation_id).trigger('click');
        } else {
            var conv_Id = goconvId.conversation_id;

            var design = '<div data-conv-type="personal" room-status="active" user-id="' + temppconvSingleFriendId + '" data-conv-id="' + conv_Id + '" data-name="' + findObjForUser(temppconvSingleFriendId).fullname + '" data-img="' + findObjForUser(temppconvSingleFriendId).img + '" class="conv_area unpinuser groupuser convid' + conv_Id + '" data-convtype="personal" data-unreadThread="false" has_flagged="false" onclick="startConversation(event,this)">';
            design += '	<div class="right_">';
            design += '		<div class="conv_img">';
            design += '			<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(temppconvSingleFriendId).img + '">';
            design += '			<div class="status offline conv_' + conv_Id + '"></div>';
            design += '		</div>';
            design += '	</div>';
            design += '	<div class="mid_">';
            design += '		<div class="conv_name">';
            design += '			<div class="title">' + findObjForUser(temppconvSingleFriendId).fullname + '</div>';
            design += '		</div>';
            design += '		<div class="last_msg"></div>';
            design += '	</div>';
            design += '	<div class="left_">';
            design += '		<div class="last_msg_date"></div>';
            design += '		<div class="more_noti">';
            design += '			<div class="unread_msg"></div>';
            design += '			<div class="unread_thread"></div>';
            design += '			<div class="pin"></div>';
            design += '			<div class="mute_noti"></div>';
            design += '			<div class="room_status">[Closed]</div>';
            design += '		</div>';
            design += '	</div>';
            design += '</div>';

            $("#chat_conversations").append(design);
            $('.convid' + conv_Id).click();
            // addSidebarListUser(temppconvSingleFriendId, conv_Id);
        }
        closePopUps('#addContactPopup');
    } else {
        var data = {
            created_by: user_id,
            participants: [user_id, temppconvSingleFriendId],
            company_id: company_id

        }
        socket.emit('createNewSingleconv', data, function(res) {
            if (res.status) {
                var conv_Id = res.result.conversation_id;

                var design = '<div data-conv-type="personal" room-status="active" user-id="' + temppconvSingleFriendId + '" data-conv-id="' + conv_Id + '" data-name="' + findObjForUser(temppconvSingleFriendId).fullname + '" data-img="' + findObjForUser(temppconvSingleFriendId).img + '" class="conv_area unpinuser groupuser convid' + conv_Id + '" data-convtype="personal" data-unreadThread="false" has_flagged="false" onclick="startConversation(event,this)">';
                design += '	<div class="right_">';
                design += '		<div class="conv_img">';
                design += '			<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(temppconvSingleFriendId).img + '">';
                design += '			<div class="status offline conv_' + conv_Id + '"></div>';
                design += '		</div>';
                design += '	</div>';
                design += '	<div class="mid_">';
                design += '		<div class="conv_name">';
                design += '			<div class="title">' + findObjForUser(temppconvSingleFriendId).fullname + '</div>';
                design += '		</div>';
                design += '		<div class="last_msg"></div>';
                design += '	</div>';
                design += '	<div class="left_">';
                design += '		<div class="last_msg_date"></div>';
                design += '		<div class="more_noti">';
                design += '			<div class="unread_msg"></div>';
                design += '			<div class="unread_thread"></div>';
                design += '			<div class="pin"></div>';
                design += '			<div class="mute_noti"></div>';
                design += '			<div class="room_status">[Closed]</div>';
                design += '		</div>';
                design += '	</div>';
                design += '</div>';

                $("#chat_conversations").append(design);
                $('.convid' + conv_Id).click();
                addSidebarListUser(temppconvSingleFriendId, conv_Id);
            } else {
                console.log(3330, res)
            }
            closePopUps('#addContactPopup');
        })
    }
}

var addSidebarListUser = (uuID, conv_Id) => {
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conv_Id,
            targetID: uuID,
            company_id: company_id
        },
        dataType: 'json',
        url: '/connect/removeHideUserinSidebar',
        success: function(data) {}
    });
}

function removeThisMemberList(name, id) {
    removeA(memberList, name);
    removeA(memberListUUID, id);
    $("#numbers").text(parseInt(memberList.length) + 1);
    $('._miniMList_' + id).remove();
    $.each(user_list, function(k, v) {
        if (v.id == id) {
            $('#newRoomMemberList').append(returnRoomMListDe(v));
        }
    })
}

function returnRoomMListDe(v) {
    //old onlick addroomMember()
    // already_member
    var selected = (memberListUUID.indexOf(v.id) > -1) ? "selected" : "not_yet";
    var html = '<div class="eachmember showEl ' + selected + '" onclick="inviteMember(this,\'' + selected + '\')" data-id="' + v.id + '" data-img="' + v.img + '" data-name="' + v.fullname + '">';
    html += '<div class="member_img">';
    html += '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
    html += '<div class="status ' + (onlineUserList.indexOf(v.id) === -1 ? "offline" : "online") + ' conv_' + v.id + '"></div>';
    html += '</div>';
    html += '<div class="member_info">';
    html += '<h2 class="member_title name">' + v.fullname + '</h2>';
    html += '<span class="invite_btn"></span>';
    html += '</div>';
    html += '</div>';
    return html;
}

// function returnAllContactList(v){
// 	//old onlick addroomMember()
// 	// already_member
// 	var selected = (memberListUUID.indexOf(v.id)>-1)?"selected":"not_yet";
// 	var html =  '<div class="eachmember showEl '+ selected +'" onclick="inviteMember(this,\''+selected+'\')" data-id="'+v.id+'" data-img="'+v.img+'" data-name="'+v.fullname+'">';
// 		html +=		'<div class="member_img">';
// 		html +=			'<img src="/images/users/'+v.img+'" class="profile">';
// 		html +=		'</div>';
// 		html +=		'<div class="member_info">';
// 		html +=			'<h2 class="member_title name">'+v.fullname+'</h2>';
// 		html +=			'<span class="invite_btn"></span>';
// 		html +=		'</div>';
// 		html += '</div>';
// 	return html;
// }

function opentagpopup() {

    var html = "";
    // $("#search_CreateMsgTag").attr("onkeyup", "check4add(event)");

    if (page_title == 'chat' && $("#newTopicPopup").is(":visible")) {

    } else {

        $.each(allUserTagList, function(k, v) {
            if (v.title != "" && v.visibility != null && v.visibility != 'hidden') {
                var status = (temTNA.indexOf(v.title) > -1) ? "checked" : "";
                html += '<div class="eachMsgTag et' + v.tag_id + '" data-status="' + status + '" data-convtag_id="" data-tagid="' + v.tag_id + '" onclick="add_temp_tag(this)">';
                html += '<h3 class="tagTitle">' + v.title + '</h3>';
                html += '<span class="checked_tag"></span>';
                html += '<span class="delete_tag"></span>';
                html += '</div>';
            }
        });
    }
    $('#chatTagPopup .msgTagList').html(html);
    $('#chatTagPopup').css('display', 'flex');
}


var alreadyTaged = [];

function add_temp_tag(elm) {
    $("#topic_tag_list").html("");
    var str = $(elm).find('.tagTitle').text().toLowerCase();
    var tid = $(elm).attr('data-tagid');
    if ($(elm).attr('data-status') == 'checked') {
        $(elm).attr('data-status', '');
        $(elm).attr('data-convtag_id', "");
        removeA(temTNA, str);
        removeA(alreadyTaged, tid);
    } else {
        temTNA.push(str);
        alreadyTaged.push(tid);
        $(elm).attr('data-status', 'checked');
    }
    $.each(temTNA, function(k, v) {
        var html = '<div class="created_tag">';
        html += '<p class="tempE name">' + v + '</p>';
        html += '<span class="tempE tempRemove" onclick="remove_temp_tag(event)"></span>';
        html += '</div>';
        $("#topic_tag_list").prepend(html);
    });
}
// function check4add(event){
// 	var code = event.keyCode || event.which;
// 	if(code == 13 || code == 32 || code ==188 || code == 59){
// 		var str = $("#search_CreateMsgTag").val().trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
// 		if(str != ""){
// 			temTNA.push(str);
// 			var html = '<div class="created_tag">';
// 			html += '<p class="tempE name">'+ str +'</p>';
// 			html += '<span class="tempE tempRemove" onclick="remove_temp_tag(event)"></span>';
// 			html += '</div>';
// 			$("#topic_tag_list").prepend(html);
// 			$("#search_CreateMsgTag").val("");

// 			html = '<div class="eachMsgTag" data-status="checked" data-convtag_id="">';
// 			html +=		'<h3 class="tagTitle">'+ str +'</h3>';
// 			html +=		'<span class="checked_tag"></span>';
// 			html +=		'<span class="delete_tag"></span>';
// 			html +=	'</div>';
// 			$('#chatTagPopup .msgTagList').append(html);
// 		}
// 	}
// }

function remove_temp_tag(event) {
    event.stopPropagation();
    var str = $(event.target).closest(".created_tag").find(".name").text();
    removeA(temTNA, str);
    $(event.target).closest(".created_tag").remove();
}

function roomImageUpdate(roomid, event, files) {
    var formData = new FormData();
    formData.append('bucket_name', 'room-images-uploads');
    formData.append('room_image', files[0]);
    var slid = Number(moment().unix());
    formData.append('sl', slid);
    $('#view_room_img').attr('src', file_server + 'common/imgLoader.gif');

    $.ajax({
        url: '/s3Local/convImg',
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(res) {
            $("#view_room_img").attr('src', res.data.location);
            $("#view_room_img").attr('data-src', res.data.key);

            socket.emit('updateRoomimg', {
                conversation_id: roomid,
                conv_img: res.data.key,
                user_id: user_id,
                company_id: company_id
            }, (callBack) => {
                $("#view_room_img").attr('src', res.data.location);
                $("#view_room_img").attr('data-src', res.data.key);
            });
        }
    });

    // $.ajax({
    // 	url: '/s3Local/convImg',
    // 	type: "POST",
    // 	data: formData,
    // 	dataType: 'json',
    // 	contentType: false,
    // 	processData: false,
    // 	success: function(res){
    // 		$("#view_room_img").attr('src',res.data.location);
    // 		$("#view_room_img").attr('data-src',res.data.key);
    // 	}
    // });
}
var CreateGroup = () => {
    adminList = [];
    adminListUUID = [];
    var teamname = $("#room-name").val().trim().replace(/,/g, ' ');
    var selectecosystem = $("#select-ecosystem").val();
    var grpprivacy = 'public';

    if ($("#grpPrivacy").is(":checked")) {
        grpprivacy = 'private';
    } else {
        grpprivacy = 'public';
    }


    if (selectecosystem == "") {
        selectecosystem = 'Navigate';
    } else {
        selectecosystem = selectecosystem;
    }

    if (teamname != "" && teamname != " ") {
        if (selectecosystem != "") {
            if (grpprivacy != "") {
                adminList.push(user_fullname);
                adminListUUID.push(user_id);
            }
        }
    }
    var b_unit_name = '';
    var b_unit_id = '';


    if ($('#room_type').val() == 'work') {
        b_unit_name = null;
        $.each(allUnit, function(k, v) {
            if (v.unit_id == $('#business_unit').val()) {
                b_unit_name = v.unit_name;
                b_unit_id = v.unit_id;
            }
        });
    }

    if (teamname != "" && teamname != " " && b_unit_name != null && b_unit_name != '') {

        socket.emit('mob_groupCreateBrdcst', {
                createdby: user_id,
                createdby_name: user_fullname,
                memberList: memberList,
                memberListUUID: memberListUUID,
                adminList: adminList,
                adminListUUID: adminListUUID,
                is_room: '6',
                teamname: teamname,
                selectecosystem: selectecosystem,
                grpprivacy: grpprivacy,
                conv_img: $("#view_room_img").attr('data-src'),
                user_id: user_id,
                topic_type: $('#room_type').val(),
                b_unit_id: b_unit_id,
                b_unit_name: b_unit_name,
                tag_list: alreadyTaged,
                company_id: company_id
            },
            function(confirmation) {
                window.location.reload();
            });
    }

}

function searchConversations(elm) {
    $('#more_options_chat').hide();
    $('.conv_title.converstaion_name').css('color', '#fff')
    $('.src_convs').addClass('active');
    $('.src_convs').focus();
    // $('.src_convs').animate({right: '11px'});
}

function closePopUps(selector) {
    $(selector).hide();
    if (selector == "#reaplyMsgPopup") {
        datalength = 0;
        selected_msgid = [];
        checklistRepText = null;
        $("#define_thread_text").remove();
        $("#msg_opt_div").hide();
        $(".user_msg").removeClass("selected_msg");
        $(selector).attr('thread_root', 'f2e1c4d50053-48ea-894408e6bad74da0');
        if ($('#reaplyMsgPopup').hasClass('fileActive')) {
            $("#call_filter_result").hide();
        }
    }
    if (selector == "#shareMsgPopup") {
        $("#msg_opt_div").hide();
        $(".user_msg").removeClass("selected_msg");
    }
    if (selector == "#deleteMsgPopup") {
        $("#msg_opt_div").hide();
        $(".user_msg").removeClass("selected_msg");
    }
    if (selector == "#chatTagPopup") {
        if (page_title == 'chat' && !$("#newTopicPopup").is(":visible")) {
            if ($('#chatTagPopup').attr('data-reload') == 'true') {
                window.location.reload();
            } else {
                $('#chatTagPopup').hide();
            }
        } else {
            $("#search_CreateMsgTag").attr("onkeyup", "create_search(event)");
        }
    }
    if (selector == "#task_manager" && $('#task_manager').hasClass('request_open')) {
        $('#task_manager').removeClass('request_open');
    }
    cancel_selection();
}

function create_search(event) {
    var str = $("#search_CreateMsgTag").val().trim().toLowerCase();
    $.each($(".eachMsgTag"), function(k, v) {
        if ($(v).find(".tagTitle").text().toLowerCase().indexOf(str) > -1) {
            $(v).show();
        } else {
            $(v).hide();
        }
    });
    if ($(".eachMsgTag").length == $('.eachMsgTag[style="display: none;"]').length) {
        $('.addNewTagBtn').css('display', 'flex');
    } else {
        $('.addNewTagBtn').hide();
    }

}

function searchMembers(e) {
    var str;
    if ($('.invite_userList').is(':visible')) {
        str = $('#search_mbrInvite').val().trim().toLowerCase();
    } else {
        str = $('#search_dirMsgUsr').val().trim().toLowerCase();
    }


    $.each($(".eachmember"), function(k, v) {
        if ($(v).find(".member_title").text().toLowerCase().indexOf(str) > -1)
            $(v).show();
        else
            $(v).hide();
    });
}
// function delete_tag_from_all (event){
// 	event.stopPropagation();
// 	var data = {
// 		tagid: $(event.target).closest(".eachMsgTag").attr("data-tagid"),
// 		convid: conversation_id,
// 		tagTitle: $(event.target).closest(".eachMsgTag").find(".tagTitle").text()
// 	};
// 	socket.emit("deleteUnusedTag", data, (rep)=>{
// 		if(rep.status){
// 			$(event.target).closest(".eachMsgTag").remove();
// 		}
// 	});
// }

function muteNotification(elm) {
    $('#muteMotifiPopup').css('display', 'flex');
    $('#more_options_chat').hide();
}

function selectMuteOpt(elm) {
    if ($(elm).attr('data-status') == 'unchecked') {
        $('.eachMuteTime').attr('data-status', 'unchecked');
        $(elm).attr('data-status', 'checked');
    }
}

function viewImgOpt(elm) {
    // console.log('1615', 'clicked');
    if ($(elm).attr('attr-type') == 'opt_hidden') {
        $(elm).attr('attr-type', 'opt_show')
        $('#removeBtn').css({
            'display': 'flex',
            'width': '115px'
        });
    } else {
        $(elm).attr('attr-type', 'opt_hidden')
        $('#removeBtn').css({
            'width': '0px',
            'display': 'none'
        });
    }
}

function viewCallerInfo(elm, type, conv_id, conv_title) {
    var all_message = [];
    $('#callerInfoPopup').css('display', 'flex');
    var conv_img = $(elm).parents('.conv_area').find('.conv_img img').attr('src');
    $('#conv_img').attr('src', conv_img);
    $('#caller_title').text(conv_title);
    // $('#_voiceCall').attr('data-conversationtype',type);
    // $('#_videoCall').attr('data-conversationtype',type);
    $('#msgFrom_callInfo').attr('onclick', 'triggerconv(\'' + conv_id + '\')');

    $('#_voiceCall, #_videoCall')
        .attr('data-conversationid', conv_id)
        .attr('data-conversationtype', type)
        .attr('data-convname', conv_title)
        .attr('data-participants', $(elm).parents('.conv_area').attr('participants'))
        .attr('data-partnername', conv_title)
        .attr('data-privacy', 'public');

    socket.emit('findCallsByConversation', conv_id, function(res) {
        $('.callerInfoDetail').html('');
        if (res.status) {
            $.each(res.data, function(k, v) {
                if (v.has_hide != null) {
                    if ((v.has_hide).indexOf(user_id) === -1) {
                        if (v.has_delete != null) {
                            if ((v.has_delete).indexOf(user_id) == -1) {
                                all_message.push(v);
                            }
                        } else {
                            all_message.push(v);
                        }
                    }
                } else {
                    if (v.has_delete != null) {
                        if ((v.has_delete).indexOf(user_id) == -1) {
                            all_message.push(v);
                        }
                    } else {
                        all_message.push(v);
                    }
                }
            });

            if (all_message.length > 0) {
                $.each(all_message, function(k, v) {
                    /* Start Date Group By */
                    var msg_date = moment(v.created_at).calendar(null, {
                        sameDay: '[Today]',
                        lastDay: '[Yesterday]',
                        lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                        sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                    });
                    var temp_date = msg_date;

                    $.each($('#callerInfoDetail .callerInfoDateSepator'), function(k, v) {
                        if ($(v).text() == msg_date) {
                            msg_date = null;
                            return 0;
                        }
                    });

                    if (msg_date !== null) {
                        var date_html = '<div class="callerInfoDateSepator" data-date="' + msg_date + '"><p>' + msg_date + '</p></div>';
                        $("#callerInfoDetail").append(date_html);
                    }

                    var html = '';
                    html += '<div class="callTimingList">';
                    html += '<div class="mid_">';
                    html += '<div class="conv_name">';
                    html += '<div class="title">' + (v.sender == user_id ? 'Outgoing' : 'Incoming') + '</div>';
                    html += '</div>';
                    if (v.call_status == 'miss') {
                        html += '<p class="last_call_time missed">' + moment(v.created_at).format('h:mm a') + '</p>'; //May 20, 2019, 12:38 pm
                    } else {
                        html += '<p class="last_call_time ' + (v.sender == user_id ? 'outgoing' : 'incoming') + '">' + moment(v.created_at).format('h:mm a') + '</p>'; //May 20, 2019, 12:38 pm
                    }
                    html += '<p class="calling_duration">' + (v.call_duration == '' ? '' : '' + v.call_duration + '') + '</p>'; //0:0:54
                    html += '</div>';
                    html += '</div>';

                    $('.callerInfoDetail').append(html);
                })
            }
        }
    });
}

function profileSetting() {
    $('#profileSettingPopup').css('display', 'flex');
    var img = findObjForUser(user_id).img;
    $("#profileSettingPopup #cur_user_img").val(img);
    if (img != "feelix.jpg")
        $("#profileSettingPopup #view_room_img").attr('src', file_server + 'profile-pic/Photos/' + img);
    $("#profileSettingPopup #fullname").val(findObjForUser(user_id).fullname);
    $("#profileSettingPopup #username").val(findObjForUser(user_id).email).attr("disabled", true).css("background", "#EFEFEF");
    $("#profileSettingPopup #email").val(findObjForUser(user_id).email).attr("disabled", true).css("background", "#EFEFEF");
    $("#profileSettingPopup #caller_id").val(window.location.origin + '/call/' + findObjForUser(user_id).conference_id).attr("disabled", true).css("background", "#EFEFEF");
    // $("#profileSettingPopup #job_title").val(findObjForUser(user_id).designation);
}

function upload_user_img(files) {
    // console.log(1607, files[0]);
    var formData = new FormData();
    formData.append('bucket_name', 'profile-pic');
    formData.append('file_upload', files[0]);
    var slid = Number(moment().unix());
    formData.append('sl', slid);
    $.ajax({
        url: '/s3Local/propic',
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        beforeSend: function() {
            $('#profileSettingPopup #view_room_img').attr('src', file_server + 'common/imgLoader.gif');
        },
        success: function(res) {
            // console.log(14020,res);
            $('#profileSettingPopup #cur_user_img').val(res.file_info[0].key)
            $('#profileSettingPopup #view_room_img').attr('src', res.file_info[0].location);
            // $('#profileSettingPopup #removeBtn').show();
        },
        error: function(e) {
            console.log(1629, e);
        }
    });
}

function remove_user_img() {
    $("#profileSettingPopup #view_room_img").attr('src', '/upload/feelix.jpg');
    $('#profileSettingPopup #cur_user_img').val('feelix.jpg');
}

function update_user_info() {
    var data = {
        fullname: $("#profileSettingPopup #fullname").val(),
        // job_title: $("#profileSettingPopup #job_title").val(),
        img: $('#profileSettingPopup #cur_user_img').val(),
        id: user_id
    };
    if (data.img != '' && data.fullname != '') {
        socket.emit('update_user_profile', data, function(res) {
            if (res.status) {
                if (page_title == 'chat') {
                    var pathname = window.location.href;
                    pathname = pathname.split('/');

                    var imgIndex = pathname.indexOf(data.img);

                    var conditionChecker = false;
                    if (!conditionChecker) {
                        if (imgIndex == -1) {
                            pathname[pathname.length - 3] = data.img;
                        }

                        conditionChecker = true;
                    }
                    if (conditionChecker) {
                        window.location.href = pathname.join('/');
                    }
                } else {
                    window.location.reload();
                }
            }
        });
    }
}
var clipboard_copyurl = new Clipboard('#copy_caller_id', {
    text: function() {
        escToClose = '#warningsPopup .closeModal';
        return document.querySelector('#caller_id').value;
    }
});

clipboard_copyurl.on('success', function(e) {
    $('#warningsPopup .popup_title').text('Alert !');
    $('#warningsPopup .warningMsg').text('URL copied to clipboard.');
    $('#warningsPopup').css('display', 'flex');
    // e.clearSelection();
});

function profile_url_reset(type) {
    socket.emit('reset_call_url', { user_id: user_id, type: type }, (callBack) => {
        if (callBack != null) {
            $("#profileSettingPopup #caller_id").val(window.location.origin + "/call/" + callBack.conference_id);
        }
    });
}

function changeProTabs(elm) {
    var id = $(elm).val();
    $('.profileBodyTabs').hide();
    $('#' + id).css('display', 'flow-root');
}

var makeAdmin = (id, name) => {
    //alert(conversation_id);
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetUser: name,
            targetID: id,
            company_id: company_id
        },
        dataType: 'json',
        url: '/connect/makeAdmin',
        success: function(data) {
            adminListUUID.push(id);
            closePopUps('#makeAdminPopup');
        }
    });
};

var makeMember = (id, name, type) => {
    var method_name = (type == 'remove_admin') ? 'makeMember' : 'groupMemberAdd';

    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetUser: name,
            targetID: id
        },
        dataType: 'json',
        url: '/connect/' + method_name,
        success: function(data) {
            memberList.push(name);
            memberListUUID.push(id);
            var emitData = {
                targetId: id,
                targetName: name,
                targetConv: conversation_id
            }
            socket.emit('makeMember', emitData);

            var stringBody = {
                conversation_id: conversation_id,
                room_name: $('.conv_title.converstaion_name').text(),
                new_user: [id]
            }

            // var participantsWU = [];
            // $.each(participants,function(k,v){
            // 	if(v != user_id){
            // 		participantsWU.push(v);
            // 	}
            // });
            if (participants.indexOf(id) == -1) {
                participants.push(id)
            }

            var noti_data = {
                type: 'add_conv_member',
                title: $('.conv_title.converstaion_name').text(),
                body: JSON.stringify(stringBody),
                created_at: new Date(),
                created_by: user_id,
                seen_users: [user_id],
                receive_users: participants
            }
            if (conversation_id !== user_id) {
                insertNotiFun(noti_data);
            }
            //   console.log(noti_data);
            removeA(adminListUUID, id);
            closePopUps('#makeAdminPopup');
        }
    });
};

function insertNotiFun(data) {
    socket.emit('insert_notification', data)
}

socket.on('make_Member_Broadcast', function(data) {
    if (data.targetId == user_id) {
        window.location.reload();
    }
});

function removeMember(targetID, targetUser) {
    var data = {
        conversation_id: conversation_id,
        targetUser: targetUser,
        targetID: targetID
    }
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetUser: targetUser,
            targetID: targetID,
            company_id: company_id
        },
        dataType: 'json',
        url: '/connect/groupMemberDelete',
        success: function(data) {
            if (data == 'success') {
                removeA(memberList, targetUser);
                removeA(memberListUUID, targetID);
                $("#temp_invite_member_list").find("#tmpinvuid" + targetID).remove();
                $.each($(".eachmember.selected"), function(k, v) {
                    if ($(v).attr('data-id') == targetID)
                        $(v).addClass('not_yet').removeClass('selected');
                    $(v).attr('onclick', 'inviteMember(this,\'not_yet\')');
                })
                closePopUps('#makeAdminPopup');
                socket.emit('mob_groupMemberDelete', {
                    room_id: conversation_id,
                    targetID: targetID,
                    company_id: company_id
                });


                var stringBody = {
                    conversation_id: conversation_id,
                    room_name: $('.conv_title.converstaion_name').text(),
                    new_user: [targetID],
                    type: 'member'
                }

                // var participantsWU = [];
                // $.each(participants,function(k,v){
                // 	if(v != user_id){
                // 		participantsWU.push(v);
                // 	}
                // });

                var noti_data = {
                        type: 'remove_conv_member',
                        title: $('.conv_title.converstaion_name').text(),
                        body: JSON.stringify(stringBody),
                        created_at: new Date(),
                        created_by: user_id,
                        seen_users: [user_id],
                        receive_users: participants
                    }
                    //   console.log(noti_data)
                if (conversation_id !== user_id) {
                    insertNotiFun(noti_data);
                }
                removeA(participants, targetID);
            }
        }
    });
}

socket.on('removefromGroup', function(data) {
    if (data.targetId == user_id && data.room_id == conversation_id) {
        window.location.href = '/connect';
    }
});

function update_room_title() {
    if (adminListUUID.indexOf(user_id) > -1 && page_title == 'chat') {
        var newGroupname = $("#room-name").val().trim().replace(/,/g, ' ');
        if (newGroupname != "" && newGroupname != " ") {
            socket.emit('saveGroupName', {
                conversation_id: conversation_id,
                newGroupname: newGroupname,
                user_id: user_id,
                company_id: company_id
            }, (rep) => {
                if (rep.status) {

                    var prevName = $('.conv_title.converstaion_name').text();
                    $("#user_head_id .conv_title").text(newGroupname);

                    var msg_body = 'Room name has been changed from "' + prevName + '" to "' + newGroupname + '"'
                    var data = {
                        type: 'update_room_title',
                        sender: user_id,
                        sender_name: user_fullname,
                        sender_img: user_img,
                        conversation_id: conversation_id,
                        msg_type: 'notification',
                        msg_body: msg_body
                    }
                    sendNotificationMsg(data);
                }
            });
        } else {
            $("#room-name").val($("#user_head_id .conv_title").text());
        }

    } else {
        // toastr["warning"]("Please contact with room owner or admin", "Warning");
    }
}

function activeHead(elm, type) {
    $('.combineHead_li').removeClass('active');
    $(elm).addClass('active');
    $('.combineBodys').hide();
    if (type == 'channel') {
        $('.channels_body').css('display', 'flow-root');
    } else if (type == 'team') {
        $('.teams_body').css('display', 'flow-root');
    } else {
        $('.permissions_body').css('display', 'flow-root');
    }
}

function selectNavigate(elm, type) {
    $('.navigates').removeClass('active');
    $(elm).addClass('active');
    $('.tab_Bodies').hide();
    if (type == 'teams') {
        $('.navigatesTeamBody').show();
        $('#body_title').text('Teams (6)');
    } else if (type == 'members') {
        $('.navigatesMemberBody').show();
        $('#body_title').text('Members (49)');
    } else {
        $('.navigatesRoomBody').show();
        $('#body_title').text('Rooms (4)');
    }
}

function chooseTag() {
    $('.filterItem').hide();
    $('.chooseTag').css('display', 'flow-root');
}

function open_hide_conv() {
    $('.filterItem').hide();
    $('.open_hide_conv').css('display', 'flow-root');
}

function chooseTopic() {
    $('.filterItem').hide();
    $('.chooseTopic').css('display', 'flow-root');
    $(".tag-search input").val("");
    $("#topicItem .added-topic-list").show();
}

function backToFilter() {
    $('.chooseTag').hide();
    $('.open_hide_conv').hide();
    $('.chooseTopic').hide();
    $('.filterItem').css('display', 'flow-root');
}

function filterData(elm) {
    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
        $('#filterDataPopup').css('right', '-280px');
    } else {
        default_data();
        $(elm).addClass('active');
        $('#filterDataPopup').css('right', '0');
    }
}

function default_data() {
    // if($('.search_ico').hasClass('active')){
    $(".closeSearch").trigger("click");
    $(".search_ico").removeClass("active");
    $(".src_convs").removeClass("active");
    $(".src_convUser").blur();
    // }
    if ($('#notificaitonClickItem').hasClass('active')) {
        $('.head_container .search_ico').css('display', 'none');
    } else {
        $('.head_container .search_ico').css('display', 'block');
    }
    $(".filterItem li").css("background", "#FFF");
    $(".filterItem li").removeClass("filtered");
    $('#filterDataPopup').find('input:checkbox').removeAttr('checked');
    $('#filterDataPopup').find('input[type=checkbox]').prop('checked', false);
    backToFilter();
}

function search_usrs(elm) {
    $(elm).addClass('active');
    $('.searchAdmin_input').focus();
}

function createTeam(elm) {
    $('#createTeamPopup').css('display', 'flex');
}

function createRoomFromAdmin() {
    $('#newTopicPopup').css('display', 'flex');
}


function convStr(key) {
    var str = $(key).text();
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    return str;
}

function searchDivActionDiv(event) {
    event.preventDefault();
}

function convCallHistory(ele) {
    $('#msg-container').html('');
    var cc = 0;
    if (!$('#viewCallHistory').hasClass('active')) {
        $('#more_options_chat').hide();
        socket.emit('getConvCallMsg', { conversation_id: conversation_id }, function(res) {
            if (res.status) {
                // $('#convCallCounter').html(res.data.length);
                $('#viewCallHistory').addClass('active');
                $('#msg-container').attr('data-filter', 'true');
                $('#call_filter_result').css('display', 'flex');
                if (res.data.length > 0) {
                    // 	$('#msg-container').html('<h2 class="empty_msg">No call history in this channel</h2>');
                    // }else
                    // {
                    $.each(res.data, function(k, v) {
                        if (v.msg_type == 'call') {
                            if (v.has_hide != null) {
                                if ((v.has_hide).indexOf(user_id) === -1) {
                                    if (v.has_delete != null) {
                                        if ((v.has_delete).indexOf(user_id) == -1) {
                                            draw_msg(v, false);
                                            cc += 1;
                                        }
                                    } else {
                                        draw_msg(v, false);
                                        cc += 1;
                                    }
                                }
                            } else {
                                if (v.has_delete != null) {
                                    if ((v.has_delete).indexOf(user_id) == -1) {
                                        draw_msg(v, false);
                                        cc += 1;
                                    }
                                } else {
                                    draw_msg(v, false);
                                    cc += 1;
                                }
                            }
                        }
                    });
                }
                $('#convCallCounter').html(cc);
                if (cc == 0) {
                    $('#msg-container').html('<h2 class="empty_msg">No call history in this channel</h2>');
                }
            }
        });
    } else {
        $('#more_options_chat').hide();
        // socket.emit('getConvOnlyMsg',{conversation_id:conversation_id},function(res){
        // 	if(res.status){
        // 		$('#viewCallHistory').removeClass('active');
        // 		$('#call_filter_result').hide();
        // 		$.each(res.data,function(k,v){
        // 			if(v.msg_type != 'call'){
        // 				draw_msg(v,false);
        // 			}
        // 		});
        // 		// msg_taphold();
        // 	}
        // });
        location.reload();
    }
}

function filter_flag(e) {
    var cc = 0;
    $('#msg-container').html('');
    if (!$('#filterFlagged_msg_2').hasClass('active')) {
        $('#filterFlagged_msg_2').addClass('active');
        $('#more_options_chat').hide();
        $('#msg-container').attr('data-filter', 'true');

        socket.emit('getConvAllMsgs', { conversation_id: conversation_id }, function(res) {
            if (res.status) {
                $.each(res.data, function(k, v) {
                    if (v.has_flagged != null) {
                        if ((v.has_flagged).indexOf(user_id) != -1) {
                            draw_msg(v, false);
                            cc += 1;
                        }
                    }
                });

                if (cc == 0) {
                    $('#msg-container').html('<h2 class="empty_msg">No message(s) were found in this channel !</h2>');
                }

                $('#call_filter_result p').text('Showing flagged messages(s) from this channel.');
                $('#call_filter_result').css('display', 'flex');
            }
        });

    } else {
        $('#filterFlagged_msg_2').removeClass('active');

        $('#more_options_chat').hide();
        $('#msg-container').attr('data-filter', 'false');
        $('#call_filter_result').hide();
        location.reload();
    }
}

function hideMsgSeparetor() {
    $('.msg-separetor').attr('area-hidden', true);
    $.each($('.user_msg'), function(k, v) {
        if ($(v).is(':visible')) {
            $(v).prevAll('.msg-separetor:first').show();
            $(v).prevAll('.msg-separetor:first').attr('area-hidden', false);
        } else {
            if ($(v).prevAll('.msg-separetor:first').attr('area-hidden')) {
                $(v).prevAll('.msg-separetor:first').hide();
            }
        }
    });
}

function submitOffCallMsWithkey(e) {
    if (e.keyCode == 13) {
        var str = $('#messageForCalOff').val();
        str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
        str = convert(str);
        str = str.replace(/&nbsp;/gi, '').trim();
        str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
        if (str != "") {
            msg_sending_process(str);
        }

        closePopUps('#warningPopupForCallMsg');
    }
}

function submitOffCallMs() {
    var str = $('#messageForCalOff').val();
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    if (str != "") {
        msg_sending_process(str);
    }
    closePopUps('#warningPopupForCallMsg');
}

function closeSearchBox(elm, e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(elm).prev('input').val('');
    $(elm).parent('.searchAdmin').removeClass('active');
    $('.conv_title.converstaion_name').css('color', '#000000');
    $(".search_ico").removeClass("active");
    $(".src_convs").removeClass("active");
    $.each($(".conv_area"), function(k, v) {
        $(v).show();
    });
    $.each($(".msg_body"), function(k, v) {
        $(v).closest(".user_msg").show();
    });

    $('.empty_msg').remove();

    if ($('#chat_conversations').is(':visible')) {
        $('#chat_conversations').find('.empty_msg').remove();
    } else if ($('#call_conversations').is(':visible')) {
        $('#call_conversations').find('.empty_msg').remove();
    } else if ($('#all_channels').is(':visible')) {
        $('#all_channels').find('.empty_msg').remove();
    }

    if ($('#single_chat_section').is(':visible')) {
        if ($("#search_conv_input").hasClass('src_on')) {
            $("#search_conv_input").removeClass('src_on');
            onlydrawMsg(conversation_id);
        }
        $('#msg-container').attr('data-search', false);
    }
    if ($('.filter_div').is(':visible')) {
        $('.src_convs.filter_on').removeClass('filter_on');
        // $('.filter_div').hide();
    }
}

function searchTopic(str) {
    $("#topicItem .added-topic-list").each(function() {
        if ($(this).find('label').text().toLowerCase().search(str.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function conv_show_hide(event) {
    var convid = $(event.target).attr("id").replace("topic_id", "");
    if (event.target.checked) {
        addThisList(convid, user_id);
    } else {
        removeThisList(convid);
    }
}
var addThisList = (conv_Id, uuID) => {
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conv_Id,
            targetID: uuID,
            company_id: company_id
        },
        dataType: 'json',
        url: '/connect/removeHideUserinSidebar',
        success: function(data) {
            if (data == 'success') {
                window.location.reload();
            }
        }
    });
}
var removeThisList = (convid) => {

    var roomid = convid;
    var uuid = user_id;

    $.ajax({
        type: 'POST',
        data: {
            conversation_id: roomid,
            targetID: uuid,
            company_id: company_id
        },
        dataType: 'json',
        url: '/connect/hideUserinSidebar',
        success: function(data) {
            $(".convid" + convid).hide();
            $('#user_head_id .back_ico').trigger('click');
        }
    });

}

var oldMsgHtml = "";
var oldMessageValue = "";
var old_assignee = "";

function editSelectedMsg(elm) {
    var msgid = $('.user_msg.selected_msg').attr('data-msgid');
    if ($('#msgid_' + msgid).attr('msg-type') == 'checklist') {

        $('#single_chat_section').addClass('editChecklist_active');
        $('#msgid_' + msgid).addClass('editable_checklistMsg');
        $('#filterShowall_' + msgid).removeClass('active');
        // filterchecklistLastime(msgid, 'showall');
        var dateOver_due = Number($('.msg_id_' + msgid).find('.checkListItem.dateOver_due').length);
        var response_req = Number($('.msg_id_' + msgid).find('.checkListItem.response_req').length);
        taskItemCounter(msgid);
        if (response_req > 0) {
            $('#filterMyResReq_' + msgid).addClass('active');
            filterchecklistLastime(msgid, 'my_res_req');
        } else {
            if (dateOver_due == 1 || dateOver_due > 1) {
                $('#filterOverDue_' + msgid).addClass('active');
                filterchecklistLastime(msgid, 'show_over_due');
            } else {
                $('#filterPending_' + msgid).addClass('active');
                filterchecklistLastime(msgid, 'pending');
            }
        }

        oldMsgHtml = "";
        oldMsgHtml = $('#data_msg_body' + msgid + ' .msgCheckListContainer')[0].outerHTML;
        $('#msgid_' + msgid).addClass('editable_msg');
        $('.cancel_selection').trigger('click');
        $('.optMore_options').hide();
        $('#data_msg_body' + msgid + ' .msgCheckListContainer').remove();
        $('#data_msg_body' + msgid).prepend('<div class="editMessageBody">' + oldMsgHtml + '</div>');
        var check_text_i = 0;
        var text_i = 0;
        $('#checkListPlainText1').focus();
        // $('.msgCheckListBtnGroup').css('display', 'flex');
        $('#data_msg_body' + msgid + ' .msgCheckListContainer').attr('id', 'msgCheckItemContainer');
        $.each($('#data_msg_body' + msgid + ' .msgCheckListContainer .checkBoxTitle'), function(k, v) {
            check_text_i++;
            $(v).attr('contenteditable', 'true');
            $(v).attr('id', 'checkBoxTitle' + check_text_i + '');
        });

        $.each($('#data_msg_body' + msgid + ' .msgCheckListContainer .checkListPlainText'), function(k, v) {
            text_i++;
            $(v).attr('contenteditable', 'true');
            $(v).attr('id', 'checkListPlainText' + text_i + '');
        });
        $('.msg_id_' + msgid + ' .itemContainer').show();
        addNewCheckItemTemp();
        $('.editable_msg .add_a_task').attr('onclick', 'filterchecklistLastime(\'' + msgid + '\',\'pending\')');
    } else {
        oldMessageValue = "";
        var editMessageId = msgid;
        oldMessageValue = $('#data_msg_body' + msgid).text();
        var msgbodyHtml = $('#data_msg_body' + msgid)[0].outerHTML;

        if ($('#editedMsg_id' + msgid).is(':visible')) {
            $('#data_msg_body' + msgid).remove();
            $('#editedMsg_id' + msgid).prepend('<div class="editMessageBody">' + msgbodyHtml + '</div>');
        } else {
            $('#data_msg_body' + msgid).remove();
            $('#msgid_' + msgid + ' .msg_body').prepend('<div class="editMessageBody">' + msgbodyHtml + '</div>');
        }

        $('#msgid_' + msgid).addClass('editable_msg');
        $('#msgid_' + msgid).find('.mainMsgtext').attr('contenteditable', true).focus();
        $('.optMore_options').hide();
        $('.cancel_selection').trigger('click');

        placeCaretAtEnd(document.getElementById('data_msg_body' + msgid));
    }
}

function cancelupChecklist(event, ele) {
    var id = $(ele).parents('.user_msg').attr('data-msgid');
    $('.msg_id_' + id).attr('check_edit', false);
    $('.msg_id_' + id).removeClass('editable_msg');
    $('.msg_id_' + id).removeClass('editable_checklistMsg');
    $('#single_chat_section').removeClass('editChecklist_active');

    if (last_checkList_body.msg_id == id) {
        $('#data_msg_body' + id).html('');
        $('#data_msg_body' + id).html(last_checkList_body.msg_body);
        last_checkList_body = '';
    }

    if ($('.msg_id_' + id + ' #msgCheckItemContainer').is(':visible')) {
        $('.editMessageBody').remove();
        $('.msg_id_' + id + ' #data_msg_body' + id + '').append(oldMsgHtml);
        $('.msgCheckListBtnGroup').hide();
    }
    $('.checkListItem').removeAttr('style');
}


function cancelEditAction(el, id) {
    if (($('.msg_id_' + id).find('.checkListItem.needUpdate').length > 0 || $('.msg_id_' + id).find('.checkListItem.new_item .checkBoxTitle').text() != '') && !$('#save_warning').is(':visible')) {
        $('#save_warning').find('.btn-cancel').attr('onclick', 'cancelEditAction(this,\'' + id + '\')');
        $('#save_warning').find('#save_unsaved').attr('onclick', 'editMessageSaveAction(\'' + id + '\',\'remove_msg\')');
        console.log('save_unsaved');
        updateCheckList(id);
        return;
    }

    if (temp_assign_checklist_id.length > 0) {
        for (var n = 0; n < temp_assign_checklist_id.length; n++)
            only_add_remove_assignee(id, temp_assign_checklist_id[n], 'remove');
    }

    var newdata = [];
    if ($('.editable_msg').find('.checkListItem.new_append').length > 0) {
        $.each($('.editable_msg').find('.checkListItem.new_append'), function(k, v) {
            newdata.push(v);
        });
    }

    if ($('.msg_id_' + id + ' #msgCheckItemContainer').is(':visible')) {
        console.log('Block 1')
        $('.msg_id_' + id + ' .msgCheckListContainer .checkBoxTitle').blur();
        $('.msg_id_' + id + ' .msgCheckListContainer .checkListPlainText').blur();
        $('.msg_id_' + id + ' .msgCheckListContainer .checkBoxTitle').removeAttr('id');
        $('.msg_id_' + id + ' .msgCheckListContainer .checkListPlainText').removeAttr('id');

        $('.editMessageBody').remove();
        $('.msg_id_' + id + ' #data_msg_body' + id + '').append(oldMsgHtml);
        $('.msgCheckListBtnGroup').hide();
        if (newdata.length > 0) {
            $.each(newdata, function(k, v) {
                $('.msg_id_' + id + ' #data_msg_body' + id + '').find('.itemContainer .updatebtn').before($(v));
            });
        }
        $('.msg_id_' + id + ' .itemContainer').hide();
        taskItemCounter(id);
    } else {
        console.log('Block 2')
        $('#data_msg_body' + id).html(oldMessageHtml);
        updateCheckList(id);
    }
    // scrollToBottom('.chat-page .os-viewport',0);

    $('.msg_id_' + id).attr('check_edit', false);
    $('.msg_id_' + id).removeAttr('style');
    $('.msg_id_' + id).removeClass('editable_msg');
    $('.msg_id_' + id).removeClass('editable_checklistMsg');
    $('#single_chat_section').removeClass('editChecklist_active');
}

function editMessageSaveAction(id, type) {

    if ($('.editMessageBody #msgCheckItemContainer').is(':visible')) {
        $.each($('#msgCheckItemContainer .checkListPlainText'), function(k, v) {
            if ($(v).text() == '') {
                $(v).remove();
            }
        });

        $('#data_msg_body' + id + ' .msgCheckListContainer').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkBoxTitle').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkBoxTitle').attr('contenteditable', 'false');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkListPlainText').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkListPlainText').attr('contenteditable', 'false');
        var newHtml = $('#data_msg_body' + id + ' .msgCheckListContainer')[0].outerHTML;
        var updateAt = '' + new Date().getTime() + '';
        var str = newHtml;
        str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
        str = convert(str);
        str = str.replace(/&nbsp;/gi, '').trim();
        str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
        if (newHtml == oldMsgHtml) {
            $('.editMessageBody').remove();
            $('#data_msg_body' + id).prepend(oldMsgHtml);
        } else {
            if (str == '') {
                $('.editMessageBody').remove();
                $('#data_msg_body' + id).prepend(oldMsgHtml);
            } else {

                var data = {
                    conv_id: conversation_id,
                    msg_id: id,
                    msg_body: newHtml,
                    update_at: updateAt,
                    sender: user_id,
                    sender_img: user_img,
                    sender_name: user_fullname,
                    attch_audiofile: [],
                    attch_imgfile: [],
                    attch_otherfile: [],
                    attch_videofile: [],
                    created_at: $('#msgid_' + id).attr('data-msg-date')
                };

                socket.emit('msg_fully_delete', data, (res) => {
                    console.log(3813, res)

                    $('.msg_id_' + data.msg_id).remove();
                    var clData = {
                        conversation_id: conversation_id,
                        msg_id: id,
                        msg_body: newHtml,
                        participants: participants

                    }

                    socket.emit('updateChecklistLastTime', clData, function(res) {
                        console.log(3823, res)
                    });
                });
            }
        }
    } else {
        if ($('#data_msg_body' + id).text().length > 0) {

            $('#data_msg_body' + id).attr('contenteditable', 'false');
            var msgbodyHtml = $('#data_msg_body' + id)[0].outerHTML;
            $('.editMessageBody').remove();
            if ($('#editedMsg_id' + id).is(':visible')) {
                $('#editedMsg_id' + id).prepend(msgbodyHtml);
            } else {
                $('#msgid_' + id + ' .msg_body').prepend(msgbodyHtml);
            }

            var updateAt = '' + new Date().getTime() + '';
            var str = $('#data_msg_body' + id).html();

            str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
            str = convert(str);
            str = str.replace(/&nbsp;/gi, '').trim();
            str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');

            var data = {
                conv_id: conversation_id,
                msg_id: id,
                msg_body: str,
                update_at: updateAt,
                sender: user_id,
                sender_img: user_img,
                sender_name: user_fullname,
                attch_audiofile: [],
                attch_imgfile: [],
                attch_otherfile: [],
                attch_videofile: []
            };

            if (oldMessageValue !== $('#data_msg_body' + id).text()) {
                if (str.indexOf('msgCheckListContainer') == -1) {
                    $('#data_msg_body' + id).text(oldMessageValue);
                    socket.emit('msg_update', data, (res) => {
                        $('#msgid_' + id).remove();
                    });
                } else {
                    socket.emit('msgUpdateChecklist', data, (res) => {
                        data.update_at = Number(data.update_at);
                    });
                }
                $('#msgid_' + id).removeClass('editable_msg');
            } else {
                $('#data_msg_body' + id).text($('#data_msg_body' + id).text().trim());
                $('#msgid_' + id).removeClass('editable_msg');
                console.log('No changes available');
            }
        }
    }
}

function cancelEditMsg(elm, id) {
    $(elm).parents('.user_msg.editable_msg').removeClass('editable_msg');
    $(elm).parents('.msgBtnGroup').siblings('.mainMsgtext').removeAttr('contenteditable');

    if ($('#data_msg_body' + id + ' #msgCheckItemContainer').is(':visible')) {
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkBoxTitle').blur();
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkListPlainText').blur();
        $('#data_msg_body' + id + ' .msgCheckListContainer').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkBoxTitle').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkBoxTitle').attr('contenteditable', 'false');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkListPlainText').removeAttr('id');
        $('#data_msg_body' + id + ' .msgCheckListContainer .checkListPlainText').attr('contenteditable', 'false');
        $('.editMessageBody').remove();
        $('#data_msg_body' + id).prepend(oldMsgHtml);
        $('.user_msg.editable_msg').removeClass('editable_msg');
    } else {
        $('#data_msg_body' + id).text(oldMessageValue);
        $('#data_msg_body' + id).attr('contenteditable', false);
    }
}


function colorChange(id) {
    $("#data_msg_body" + id).addClass('addcolor');
    setTimeout(function() {
        $("#data_msg_body" + id).removeClass('addcolor');
    }, 3000);
}

function closeThisRoom() {
    var data = {
        conv_id: $("#user_head_id").attr('room-id'),
        dataId: user_id,
        dataId_name: user_fullname,
        dataId_img: user_img,
        conv_type: 'close',
        company_id: company_id
    }
    socket.emit('closeRoom', data, function(response) {
        if (response.msg == "success") {
            $('#more_options_chat').attr('room-status', 'close').attr('user-type', 'admin');
            $('.voice-call.aud_ico,.video-call.vid_ico').attr('room-status', 'close');
            $('#msg-container .user_msg').attr('room-status', 'close');
            $('.chat_foot_container').attr('room-status', 'close').attr('user-type', 'admin');
            // $("#msg").attr('placeholder','You are not allowed to send any message(s) to this room until it reopens by the admin');
            closePopUps('#closeRoomPopup');
            var pathname = window.location.href;
            pathname = pathname.split('/');
            var index = pathname.indexOf('active');
            if (~index) {
                pathname[index] = 'close';
            }
            window.location.href = pathname.join('/');
        }
    });
}

function reopenThisRoom() {
    var data = {
        conv_id: $("#user_head_id").attr('room-id'),
        dataId: user_id,
        dataId_name: user_fullname,
        dataId_img: user_img,
        conv_type: 'active',
        company_id: company_id
    }
    socket.emit('reopenThisRoom', data, function(response) {
        if (response.msg == "success") {
            $('#more_options_chat').attr('room-status', 'active').attr('user-type', 'admin');
            $('.voice-call.aud_ico,.video-call.vid_ico').attr('room-status', 'active');
            $('#msg-container .user_msg').attr('room-status', 'active');
            $('.chat_foot_container').attr('room-status', 'active').attr('user-type', 'admin');
            closePopUps('#reopenRoomPopup');
            var pathname = window.location.href;
            pathname = pathname.split('/');
            var index = pathname.indexOf('close');
            if (~index) {
                pathname[index] = 'active';
            }
            window.location.href = pathname.join('/');
        }
    });
}


function viewPopFunc(hide, show) {
    $(hide).hide();
    $(show).css('display', 'flex');
    if (show == '#deleteRoomPopup') {
        var r = Math.floor(100000 + Math.random() * 900000);
        $('#deleteConvLastTimeVal').text(r);
    }
}


function addCheckedCls(elm) {
    if ($(elm).hasClass('checked')) {
        $(elm).removeClass('checked');
    } else {
        $(elm).addClass('checked');
    }
}

function confirmDelete(e) {
    var a = $('#deleteConvLastTimeVal').text();
    var b = $('#deleteConvLastTimeInput').val();
    if (a == b) {
        $('#rm_delete_btn').css({ 'pointer-events': 'auto', 'opacity': 1 });
    } else {
        $('#rm_delete_btn').css({ 'pointer-events': 'none', 'opacity': 0.5 });
    }
    if (e.keyCode !== 8) {
        if (b.length >= 6) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (a == b) {
                $('#deleteConvLastTimeInput').css("border-color", "green");
                $(e.target).blur();
            } else {
                $('#deleteConvLastTimeInput').css("border-color", "red");
            }
        }
    } else {
        if (a == b) {
            $('#deleteConvLastTimeInput').css("border-color", "green");
            $(e.target).blur();
        } else {
            $('#deleteConvLastTimeInput').css("border-color", "#d8d8d8");
        }
    }
}

function roomDeleteLastTime() {
    if ($("#user_head_id").attr('room-id') != '') {
        socket.emit('room_delete_emit', { conversation_id: $("#user_head_id").attr('room-id'), company_id: company_id, participants: participants, user_id: user_id, user_fullname: user_fullname, room_title: $('.conv_title.converstaion_name').text(), created_at: new Date() }, function(res) {
            $('#deleteRoomPopup').hide();
            var origin = window.location.origin;
            window.location.href = origin + '/connect';
        });
    }
}

function grpPrivacyUpdate(e) {
    if (e.target.checked) {
        var grpprivacy = 'Private';
    } else {
        var grpprivacy = 'Public';
    }

    socket.emit('updatePrivecy', {
        conversation_id: $("#user_head_id").attr('room-id'),
        grpprivacy: grpprivacy.toLowerCase(),
        user_id: user_id,
        company_id: company_id
    }, (callBack) => {

        if (callBack.status) {
            console.log(2566, callBack)
        }
    });
}


function viewThreadFiles() {
    closePopUps
    if ($('#reaplyMsgPopup').hasClass('fileActive')) {
        $('#reaplyMsgPopup').removeClass('fileActive');
        $('#call_filter_result p').text('');
        $('#call_filter_result').css('display', 'none');
        $('#call_filter_result .closePopup').attr('onclick', '');
    } else {
        $('#reaplyMsgPopup').addClass('fileActive');
        var msg = 'Showing media thread messages(s).';
        $('#call_filter_result p').text(msg);
        $('#call_filter_result').css('display', 'flex');
        $('#call_filter_result .closePopup').attr('onclick', 'viewThreadFiles()');
    }
}

$(window).on('load', function() {
    $('.chat_container').show();
    $('.connect_section').show();
    $('.loading_connect').hide();
    if ($("#msg-container").is(":visible")) {
        scrollToBottom('#msg-container');
    }
});

$(window).resize(function() {
    var origin = window.location.origin;
    var url = window.location.href;
    url = url.split('/');
    if ($(window).width() > 770) {
        if (url.indexOf('connect') != -1) {
            if (url.indexOf('covid') == -1) window.location.href = origin + '/alpha2';
        }
    }
});

function relocateOnload() {
    var origin = window.location.origin;
    var url = window.location.href;
    url = url.split('/');
    if ($(window).width() > 770) {
        if (url.indexOf('connect') != -1) {
            if (url.indexOf('covid') == -1) window.location.href = origin + '/alpha2';
        }
    }

}
relocateOnload();


var download_win = "";

function show_noti(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // $("#prepar_download").show();
    download_win = window.open($(e.target).attr('href'), "Download", "width=200,height=100");
}
socket.on("download_completed", (res) => {
    // $("#prepar_download").hide();
    download_win.close();
});

function downloadAnyFile(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var url = $(elm).attr('data-href');
    var fileName = $(elm).attr('file-name');
    var type;
    var xhttp = new XMLHttpRequest();
    xhttp.open('HEAD', url);
    xhttp.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            type = this.getResponseHeader("Content-Type");
            d_file(url, type);
            // mimetype
        }
    };
    xhttp.send();
}

function d_file(url, fileName, type) {
    download(url, type);
}

function searchShareList(el) {
    var val = $(el).val().trim().toLowerCase();
    $.each($('#shareList .eachmember'), function(k, v) {
        if ($(v).find(".member_title").text().toLowerCase().indexOf(val) > -1) {
            $(v).show();
        } else {
            $(v).hide();
        }
    });
}

function set_filter(el) {
    if ($(el).parents('.src_convs').hasClass('filter_on')) {
        $(el).parents('.src_convs').removeClass('filter_on');
    } else {
        $(el).parents('.src_convs').addClass('filter_on');
    }
}

function search_filter(type) {
    var value = $('#search_conv_input').val();
    $('#gallery_search').val(value).attr('filter-type', type);
    _src_filter = true;
    // $('.src_convs').removeClass('filter_on').removeClass('active');
    $('.src_convs .closeSearch').click();
    showFilesGallery();
    $('.tab_list.active').removeClass('active');
    if (type == 'Images') {
        $('#mediaImgsTab').trigger('click');
    } else if (type == 'Videos') {
        $('#mediaViedeosTab').trigger('click');
    } else if (type == 'Audios') {
        $('#mediaAudiosTab').trigger('click');
    } else if (type == 'Files') {
        $('#mediaFilesTab').trigger('click');
    } else if (type == 'Tags') {
        $('#mediaLinksTab').trigger('click');
    } else if (type == 'Links') {
        $('#mediaTagDivHead').trigger('click');
    }
}

console.log('conversation_type', conversation_type);

socket.emit('call_running_conf', { // first check if user is busy in calling
    conversation_id: conversation_id ? conversation_id : null,
    partner_id: typeof call_partner == "undefined" ? null : call_partner,
    user_id: user_id,
    conversation_type: conversation_type,
}, function(status_conf) {
    if (status_conf.conv_run || status_conf.partner_run || status_conf.partner_allow) {
        $('.video-call,.voice-call').hide();
        $('.join-call').show();
    } else {
        $('.join-call').hide();
        $('.video-call,.voice-call').show();
    }
    if (status_conf.user_busy) {
        if (status_conf.call_type_route == 'video') {
            $('#profile_video_call').show();
            $('#profile_audio_call').hide();
        } else {
            $('#profile_video_call').hide();
            $('#profile_audio_call').show();
        }
    }
});


function addNewCheckItemTemp() {
    var id_length = $('#msgCheckItemContainer .checkListItem').length + 1;
    var checkHtml = '';
    checkHtml += '<div class="checkListItem new_item" checklist_status="0" review_status="0">';
    if ($('#msgCustomEditOption .activeRadio').hasClass('active')) {
        checkHtml += '<div class="checkBox radio_btn" onclick="selectCheckItem(this)"></div>';
        checkHtml += '<div id="checkBoxTitle' + id_length + '" class="checkBoxTitle" contenteditable="true" placeholder="Add questionnaire ' + id_length + '" onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '"></div>';
    } else if ($('#msgCustomEditOption .activeNumber').hasClass('active')) {
        checkHtml += '<div class="checkBox list_item" data-list-num="' + id_length + '." onclick="selectCheckItem(this)"></div>';
        checkHtml += '<div id="checkBoxTitle' + id_length + '" class="checkBoxTitle" contenteditable="true" placeholder="Type a new list item..." onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '"></div>';
    } else {
        checkHtml += '<div class="checkBox" onclick="selectCheckItem(this)"></div>';
        checkHtml += '<div id="checkBoxTitle' + id_length + '" class="checkBoxTitle" contenteditable="true" placeholder="Type a new list item..." onkeyup="checkListTitleKeyup(event)" onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '"></div>';
        checkHtml += '<div class="item_toolbar">';
        if ($('#checkListPlainText1').attr('end-date') != '' && $('#checkListPlainText1').attr('end-date') != undefined) {
            checkHtml += '<div class="dueDateIcon active AssigneeUser" start-date="" end-date="' + $('#checkListPlainText1').attr('end-date') + '" data-privacy="' + $('#checkListPlainText1').attr('data-privacy') + '" data-assignee="' + $('#checkListPlainText1').attr('data-assignee') + '" onclick="checklistDueDate(this,event)"><img src="' + file_server + 'profile-pic/Photos/' + findObjForUser($('#checkListPlainText1').attr('data-assignee')).img + '"></div>';
        } else {
            checkHtml += '<div class="dueDateIcon" start-date="" onclick="checklistDueDate(this,event)"></div>';
        }
        checkHtml += '<div class="item_UpdateButton" type="add" onclick="item_UpdateButton(event,\'assign\')"></div>';
        checkHtml += '</div>';
    }
    checkHtml += '<div style="display:none" class="activity_list_all"></div>';
    checkHtml += '<div class="assign_info"></div>';
    checkHtml += '<div style="" class="add_a_task">Add a Task</div>';
    checkHtml += '</div>';
    var checkstring = true;
    var checklistid = '';
    $.each($('#msgCheckItemContainer').find('.checkListItem'), function(k, v) {
        if (checkstring) {
            if ($(v).find('.checkBoxTitle').text().trim().length == 0) {
                checkstring = false;
                checklistid = $(v).find('.checkBoxTitle').attr('id');
            }
        }
    });

    if (checkstring) {
        $('#msgCheckItemContainer .updatebtn').before(checkHtml);
        if ($('#msg[data-checklist="true"]').is(':visible')) {
            $('#msg #msgCheckItemContainer').append(checkHtml);
        }
        placeCaretAtEnd(document.getElementById('checkBoxTitle' + id_length));
    } else {
        placeCaretAtEnd(document.getElementById(checklistid));
    }
}

function addMsgCheckList() {
    var str = convStr('#msg');
    $('#more_options_msg').hide();
    if ($('#msg').attr('data-checklist') == 'false') {
        $('#msg').html('');
        var checkList = '<div id="msgCheckItemContainer" class="msgCheckListContainer">';
        if (str !== '') {
            checkList += '	<p id="checkListPlainText1" class="checkListPlainText title _text_large" contenteditable="true" onkeydown="checkListPlainText(event)" onblur="plainCheckTextBlur(event)" placeholder="Write a checklist to check discussion.">' + str + '</p><span class="settingsIco" onclick="checklistDueDate(\'settings\',event)" msg-id=""></span>';
        } else {
            checkList += '	<p id="checkListPlainText1" class="checkListPlainText title _text_large" contenteditable="true" onkeydown="checkListPlainText(event)" onblur="plainCheckTextBlur(event)" placeholder="Write a checklist to ' + $('.conv_title.converstaion_name').text() + '."></p><span class="settingsIco" onclick="checklistDueDate(\'settings\',event)" msg-id=""></span>';
        }
        checkList += '	<div class="checkListItem" checklist_status="0" review_status="0">';
        checkList += '		<div class="checkBox" onclick="selectCheckItem(this)"></div>';
        checkList += '		<div spellcheck="false" id="checkBoxTitle1" class="checkBoxTitle" placeholder="Type a new list item..." onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '" contenteditable="true"></div>';
        checkList += '		<div class="dueDateIcon" start-date="" onclick="checklistDueDate(this,event)"></div>';
        checkList += '		<div class="item_UpdateButton" type="update" onclick="item_UpdateButton(event)"></div>';
        checkList += '	</div>';
        checkList += '	<div class="checkListItem" checklist_status="0" review_status="0">';
        checkList += '		<div class="checkBox" onclick="selectCheckItem(this)"></div>';
        checkList += '		<div spellcheck="false" id="checkBoxTitle2" class="checkBoxTitle" placeholder="Type a new list item..." onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '" contenteditable="true"></div>';
        checkList += '		<div class="dueDateIcon" start-date="" onclick="checklistDueDate(this,event)"></div>';
        checkList += '		<div class="item_UpdateButton" type="update" onclick="item_UpdateButton(event)"></div>';
        checkList += '	</div>';
        checkList += '	<div class="checkListItem" checklist_status="0" review_status="0">';
        checkList += '		<div class="checkBox" onclick="selectCheckItem(this)"></div>';
        checkList += '		<div spellcheck="false" id="checkBoxTitle3" class="checkBoxTitle" placeholder="Type a new list item..." onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" creator_id="' + user_id + '" contenteditable="true"></div>';
        checkList += '		<div class="dueDateIcon" start-date="" onclick="checklistDueDate(this,event)"></div>';
        checkList += '		<div class="item_UpdateButton" type="update" onclick="item_UpdateButton(event)"></div>';
        checkList += '	</div>';
        checkList += '</div>';

        $('#msg').attr('data-checklist', 'true');
        $('.chat_foot_container .send_ico').attr('data-checklist', 'true');
        $('.chat_foot_container .send_ico').attr('onclick', 'checklistSubmit()');
        $('.chat_foot_container .plus_ico').attr('data-checklist', 'true');
        $('#msg').attr('contenteditable', false);
        $('#msg').append(checkList);
        $('#checkListPlainText1').focus();
    } else {
        $('#msg').html('');
        $('#msg').attr('contenteditable', true).focus();
        $('#msg').attr('data-checklist', false);
        $('.chat_foot_container .send_ico').attr('onclick', 'msg_form_submit()');
        $('.chat_foot_container .send_ico').attr('data-checklist', false);
        $('.chat_foot_container .close_ico').attr('data-checklist', false);
    }
}

function msgCheckListTitle(e) {
    var code = e.keyCode || e.which;
    var lstChild = $('#msgCheckItemContainer .checkListItem').last().find('.checkBoxTitle').text();
    if (code == 13) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var str = $(e.target).text().trim();
        var nextElement = $(e.target).parent('.checkListItem').next();
        if (nextElement.hasClass('checkListItem')) {
            // placeCaretAtEnd(document.getElementById($(nextElement).find('.checkBoxTitle').attr('id')));
            if ($(e.target).closest(".checkListItem").hasClass("needUpdate")) {
                $(e.target).closest(".checkListItem").removeClass("needUpdate");
                add_chk_item($(e.target).closest(".checkListItem").find(".checkBoxTitle").attr("id"), 'update');
                console.log('needUpdate');
                if (str.length == 0) {
                    var removeItem = [];
                    var checklist_id = $(e.target).closest(".checkListItem").attr('checklist-id');
                    var msg_id = $(e.target).closest(".checkListItem").attr('msg_id');
                    removeItem.push(checklist_id);
                    var d2 = {
                            conv_id: conversation_id,
                            msg_id: msg_id,
                            removeItem: removeItem
                        }
                        // console.log(d2);
                    $('.perchecklist_' + checklist_id).remove();
                    socket.emit('removeItem', d2, function(res) {
                        console.log(13624, res);
                        taskItemCounter(msg_id);
                    });
                }
            }
            if (nextElement.hasClass('completed_item')) {
                $('#msgCheckItemContainer').find('.checkBoxTitle').last().focus();
            } else {
                placeCaretAtEnd(document.getElementById($(nextElement).find('.checkBoxTitle').attr('id')));
            }
        } else if (lstChild !== '') {
            if (str.length == 0) {
                e.preventDefault();
                e.stopImmediatePropagation();
                placeCaretAtEnd(document.getElementById('checkListPlainText1'));
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (str !== '') {
                    add_chk_item(event.target.id, 'add');
                    addNewCheckItemTemp();
                    $(e.target).blur();
                }
            }
        } else {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (str !== '') {
                addNewCheckItemTemp();
                $(event.target).blur();

            } else {

            }
        }
    }
}


function checkListPlainTextKeyup(e) {
    var old_v = $(e.target).attr('title').trim();
    var new_v = $(e.target).text().trim();
    var has_update = false;
    var action = $('.editable_msg .msgCheckListBtnGroup');
    if ($('.editable_msg .new_chk').length > 0 || $('.editable_msg .new_unchk').length > 0) {
        has_update = true;
    }
    if (old_v != new_v) {
        action.addClass('chk_active');
        action.removeClass('backChat');
    } else {
        if (has_update == false) {
            action.addClass('backChat');
            action.removeClass('chk_active');
        }
    }

    // if ($(e.target).text().length > 50) {
    // 	if ($(e.target).text().length > 70) {
    // 		$('.editMessageBody #checkListPlainText1').css('font-size','16px');
    // 	}else {
    // 		$('.editMessageBody #checkListPlainText1').css('font-size','22px');
    // 	}
    // }else {
    // 	$('.editMessageBody #checkListPlainText1').css('font-size','34px');
    // }
}


function checkListPlainText(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $(e.target).blur();
        $(e.target).siblings('.itemContainer').find('.checkListItem:first').find('.checkBoxTitle').focus();
    }
    console.log($(e.target).text());
}

function plainCheckTextBlur(e) {
    if ($(e.target).text() == '' || $(event.target).html() == '<br>') {
        $(e.target).html('');
    }
}

function searchAssignee(event) {
    if (event == 'focus') {
        $('#task_manager .searchDivAction').html('').show();
        $.each(participants, function(k, v) {
            var user = findObjForUser(v);
            var html = '<li onclick="assignUser(this)" data-user="' + v + '"><img src="' + file_server + 'profile-pic/Photos/' + user.img + '"><span class="name">' + user.fullname + '</span></li>';
            $('#task_manager .searchDivAction').append(html);
        })
    } else {
        var searchTagVal = $(event.target).val();
        $('#task_manager .searchDivAction li').each(function() {
            if ($(this).find('.name').text().toLowerCase().search(searchTagVal.toLowerCase()) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}
var alternatAssigneeUserid = '';

function assignUser(e) {
    var uid = $(e).attr('data-user');
    var user = findObjForUser(uid);
    var html = '<div class="mini_item _mini_item_' + user.id + '" data-id="' + user.id + '"><p class="mini_name">' + user.fullname + '</p><span class="mini_remove_ico" onclick="removeAssignMember(event,\'' + user + '\')"></span></div>';
    $('._3coldiv').find('.user').html(html);
    $('._3coldiv').find('.user').next('input').hide();
    $('#task_manager .searchDivAction').hide();

    var id = '';

    if ($(e.target).parents('.main_sec_tab').attr('id') == 'alternatAssigneeSec') {
        id = 'alternatAssigneeSec';
        alternatAssigneeUserid = user.id;
    } else {
        id = 'normalAssineeSec';
    }
    if ($('#initialSubBtn').find('.buttonAction').text() == 'Update') {
        alternatAssigneeUserid = user.id;
    }
    $('#' + id).find('.user').html(html);
    $('#' + id).find('.user').next('input').hide();

    if (user.id != old_assignee && old_assignee != "") {
        if ($('#task_manager').attr('action-submit') != 'settings') {
            $('#alternatAssigneeSec').show();
        }
        $('#alternatAssigneeSec ._3coldiv').show();
        $('#assigneeChangeResone').removeAttr('disabled');
    }

    if (user.id == old_assignee && old_assignee != "") {
        if (!$('#checklistRequestBtn').is(':visible')) {
            $('#initialSubBtn').hide();
            $('#alternatAssigneeSec').hide();
            $('#checklistRequestBtn').show();
        }
    }
    $('#task_manager .searchDivAction').hide();
    $("#normalAssineeSec input").blur();
}

function removeAssignMember(e, userid) {
    var id = ''
    if ($(e.target).parents('.main_sec_tab').attr('id') == 'alternatAssigneeSec') {
        id = 'alternatAssigneeSec';
        alternatAssigneeUserid = '';
    } else {
        id = 'normalAssineeSec';
    }
    $('#' + id).find('.user').html('');
    $('#' + id).find('.user').next('input').val('');
    $('#' + id).find('.user').next('input').show();
    if ($('#checklistRequestBtn').is(':visible')) {
        $('#checklistRequestBtn').hide();
        $('#initialSubBtn').show();
    }
    $('#alternatAssigneeSec').hide();
}

var checklistManageId = '';
var checklistManageId_msg = '';
var checklistManageId_Reqttl = '';
var checklist_request_repetition = 0;
var checklist_created_by = '';

function showDesignChecklisManagement(data) {
    old_assignee = "";
    checklist_created_by = '';
    checklistManageId = data.checklist_id;
    checklistManageId_msg = data.msg_id;
    checklistManageId_Reqttl = '';
    checklist_request_repetition = data.request_repetition;
    checklist_created_by = data.created_by;
    var assusr = data.alternative_assign_to == null ? data.assign_to : data.alternative_assign_to;
    var lock_for_user = '';

    var newDate = moment().add(1, 'day');
    var oneSection = false;
    var twoSection = false;
    var threeSection = false;
    var twoSectionStatus = false;
    var acceptPermission = false;
    $('#assigneeChangeResone').val("");
    $(".decline_note_sec").hide();
    $("#decline_btn_sec").hide();
    $('.button_del').hide();
    $('.button_Unass').hide();
    if (conversation_id == user_id) {
        data.assign_to = data.assign_status = assusr = user_id;
    }
    if (assusr == user_id) {
        if (data.assign_status == user_id) {
            if (conversation_type == 'single') {
                lock_for_user = '';
            } else {
                if (adminArra.indexOf(user_id) > -1) {
                    lock_for_user = '';
                }
            }
        } else {
            // if (data.assign_status != 2 && data.assign_status != user_id) {
            // 	lock_for_user = ' lock_for_user';
            // }
            if (assusr == user_id && data.assign_status == data.assignedby && data.assignedby != assusr) {
                lock_for_user = ' lock_for_user';
            }
        }
    }
    console.log('showDesignChecklisManagement', data);

    if (data.assign_to == user_id && data.alternative_assign_to == null) {
        old_assignee = data.assign_to;
        if (!$("#task_manager").hasClass("decline_open")) {
            twoSection = true;
        }
        if (data.request_ttl_date != null) {
            twoSectionStatus = true;
        }
    } else {
        if (conversation_type == 'single') {
            adminArra = participants;

        }
        if (adminArra.indexOf(user_id) > -1 || data.created_by == user_id || conversation_type == 'single') {
            oneSection = true;
            if (data.assign_to == null) {

            } else {
                // threeSection = true;
                $('#alternatAssigneeSec').hide();
                if (data.alternative_assign_to != null) {
                    old_assignee = data.alternative_assign_to;
                    if (data.assignee_change_reason != null) {
                        $('#alternatAssigneeSec').show();
                        $('#assigneeChangeResone').val(data.assignee_change_reason).show().attr('disabled', 'disabled');
                    }
                } else {
                    old_assignee = data.assign_to;
                }
            }

            if (data.request_ttl_date != null) {
                twoSection = true;
                twoSectionStatus = true;
                acceptPermission = true;
            }
        } else if (data.alternative_assign_to == user_id) {
            if (!$("#task_manager").hasClass("decline_open")) {
                twoSection = true;
            }
        }
    }

    $('.managementOneSection').removeClass('deactive_sec');
    $('#requestNewDateSec').hide();

    if ($('#task_manager').attr('msg-id') == '') {
        $('#initialSubBtn').find('.buttonAction').text('Submit');
    } else {
        $('#initialSubBtn').find('.buttonAction').text('Update');
    }

    // Request note section
    $('#requestNewDateSec').hide();
    $('#requestNote').hide();
    if (data.request_ttl_message != null) {
        $('.request_note_sec').show();
        $('#requestNewDateSec').show();
        $('#requestNote').val(data.request_ttl_message).show().attr('disabled', 'disabled');
    } else if ($("#task_manager").hasClass("request_open")) {
        $('.request_note_sec').show();
        $('#requestNewDateSec').show();
        $('#alternatAssigneeSec').hide();
        $('#requestNote').val("").show();
        $('#checklistRequestBtn').find('.buttonAction').text('Request').attr('disabled', 'disabled');
        $('#checklistRequestBtn').find('.buttonCancel').text('Close');
        $('#checklistRequestBtn').find('.buttonAction').removeClass('inactive');
        $('#initialSubBtn').hide();
        $('.button_del').hide();
        $('.button_Unass').hide();
        $('#checklistRequestBtn').show();
    }

    // Decline note section
    if (data.assign_status == 1 && data.assign_decline_note != null) {
        decline_sec_fun('', data.assign_decline_note);
    }
    if ($("#task_manager").hasClass("decline_open")) {
        twoSection = true;
        decline_sec_fun('edit', data.assign_decline_note);
        $('#alternatAssigneeSec').hide();
    }

    if (oneSection) {
        console.log(1111)
        $('.managementOneSection').removeClass('deactive_sec');
        if (data.request_ttl_approved_date != null) {
            if (adminArra.indexOf(user_id) == -1 && data.created_by != user_id && conversation_type != 'single') {
                $('#TaskDatePicker').closest('.managementOneSection').addClass('deactive_sec');
            }
        }
    } else {
        console.log(2222)
        if (data.assign_status == null && data.alternative_assign_to == user_id) {
            $('#TaskDatePicker').closest('.managementOneSection').removeClass('deactive_sec');
        }
    }

    $('#TaskDatePicker').val(moment(Number(data.end_due_date)).format('YYYY-MM-DD HH:mm'));
    $('#TaskDatePicker').attr('old-date', moment(Number(data.end_due_date)).format('YYYY-MM-DD HH:mm'));
    console.log(11, moment(Number(data.end_due_date)).format('YYYY-MM-DD HH:mm'))
    if (data.assign_to == null) {
        // $('#TaskDatePicker').val(moment(newDate).format('YYYY-MM-DD HH:mm'));
        $('#TaskDatePicker').val('');
        $('#TaskUserId').html('');
        $('#TaskUserId').next('input').show().val('');
    } else if (data.alternative_assign_to != null) {
        $('#TaskUserId').next('input').hide().val('');
        $('#TaskUserId').html('<div class="mini_item _mini_item_' + data.alternative_assign_to + '" data-id="' + data.alternative_assign_to + '"><p class="mini_name">' + findObjForUser(data.alternative_assign_to).fullname + '</p><span class="mini_remove_ico tooltipmsg' + lock_for_user + '" onclick="removeAssignMember(event,\'' + data.alternative_assign_to + '\')"></span></div>')
        $('#TaskUserId').attr('assign-id', data.alternative_assign_to);
    } else {
        $('#TaskUserId').next('input').hide().val('');
        $('#TaskUserId').html('<div class="mini_item _mini_item_' + data.assign_to + '" data-id="' + data.assign_to + '"><p class="mini_name">' + findObjForUser(data.assign_to).fullname + '</p><span class="mini_remove_ico tooltipmsg' + lock_for_user + '" onclick="removeAssignMember(event,\'' + data.assign_to + '\')"></span></div>')
        $('#TaskUserId').attr('assign-id', data.assign_to);
    }

    if (twoSection) {
        console.log('twoSection');
        $('#checklistRequestBtn').show();
        $('#initialSubBtn').hide();
        $('.managementOneSection').find('#TaskDatePicker').closest('.deactive_sec').removeClass('deactive_sec');
        // $('#TaskDatePicker2').val('');
        $('#checklistRequestBtn').find('.buttonAction').removeClass('inactive');

        if (twoSectionStatus) {
            if (data.request_ttl_time != null) {
                $('#TaskDatePicker').val(moment(Number(data.request_ttl_time)).format('YYYY-MM-DD HH:mm'));
            }
            $('#requestNote').val(data.request_ttl_message);
        }
        if (acceptPermission) {
            if (twoSectionStatus) {
                checklistManageId_Reqttl = data.assign_to;
                $('#checklistRequestBtn').find('.buttonAction').text('Approve');
                $('#checklistRequestBtn').find('.buttonCancel').text('Reject');
            }
        } else {
            if (twoSectionStatus) {

            } else {
                if ($("#task_manager").hasClass("decline_open")) {
                    $('#TaskDatePicker').closest('.managementOneSection').addClass('deactive_sec');
                    $('#checklistRequestBtn').hide();
                    $('.button_del').hide();
                    $('.button_Unass').hide();
                    $('#decline_btn_sec').show();
                } else {
                    console.log('Member 2')
                    $('#checklistRequestBtn').show();
                    $('#decline_btn_sec').hide();
                    $('#checklistRequestBtn').find('.buttonAction').text('Request');
                    if (assusr == user_id && !$("#task_manager").hasClass("request_open")) {
                        console.log(11111)
                        if (data.assign_status == user_id) {
                            if (conversation_type == 'single') {
                                $('#checklistRequestBtn').find('.buttonAction').text('Update');
                            } else {
                                if (adminArra.indexOf(user_id) > -1) {
                                    $('#checklistRequestBtn').find('.buttonAction').text('Update');
                                } else {
                                    if (data.assignedby == user_id && assusr == user_id) {
                                        $('#checklistRequestBtn').hide();
                                        $('#decline_btn_sec').hide();
                                        $('#initialSubBtn').show();
                                    }
                                }
                            }
                        } else if (assusr == user_id && data.assign_status == 2) {
                            // already accepted user
                            // $('#TaskUserId').find('.mini_remove_ico').removeClass('lock_for_user');
                            $('#requestNewDateSec').hide();
                            $('#checklistRequestBtn').hide();
                            $('#decline_btn_sec').hide();
                            $('#initialSubBtn').show();
                        }
                    }
                    $('#checklistRequestBtn').find('.buttonCancel').text('Close');
                }
            }
        }
    } else if (threeSection) {
        console.log('threeSection');
        $('#initialSubBtn').hide();
        $('#alternatAssigneeSec').show();
        $('#alternatAssigneeSec').find('input').val('');
        $('#alternatAssigneeSec').find('.user').html('');
        if (data.alternative_assign_to != null) {
            $('#TaskUserId').html('<div class="mini_item _mini_item_' + data.alternative_assign_to + lock_for_user + '" data-id="' + data.assign_to + '"><p class="mini_name">' + findObjForUser(data.alternative_assign_to).fullname + '</p><span class="mini_remove_ico tooltipmsg" data-balloon="Remove assignee" data-balloon-pos="left" onclick="removeAssignMember(event,\'' + data.alternative_assign_to + '\')"></span></div>')
            $('#TaskUserId').attr('assign-id', data.alternative_assign_to);
            $('#assigneeChangeResone').val(data.assignee_change_reason);
            $('#TaskUserId').next('input').hide().val('');
            // $('#alternatAssigneeSec').find('._3coldiv').first().hide();
            if (adminArra.indexOf(user_id) > -1 || data.created_by == user_id || conversation_type == 'single') {
                $('.managementOneSection').removeClass('deactive_sec');
            }
        } else {
            $('#TaskUserId2').next('input').show().val('');
        }
        $('#checklistRequestBtn').hide();
        $('#initialSubBtn').show();
    } else {
        console.log(3333)
        if (!$("#task_manager").hasClass("request_open") && data.review_status != 1) {
            $('#initialSubBtn').show();
        }
        if (assusr == user_id && data.assign_status == 2 && data.review_status != 1) {
            // already accepted user
            // $('#TaskUserId').find('.mini_remove_ico').removeClass('lock_for_user');
            $('#requestNewDateSec').hide();
            $('#alternatAssigneeSec').hide();
            $('#checklistRequestBtn').hide();
            $('#decline_btn_sec').hide();
            $('#initialSubBtn').show();
        }

        $('#initialSubBtn').find('.buttonCancel').text('Cancel');
        // if (data.review_status == 1) {
        // 	$('.managementOneSection').addClass('deactive_sec');
        // 	$('#marked_btn_sec').show();
        // }else {
        // 	$('#marked_btn_sec').hide();
        // }
    }

    if (data.assign_status == null || data.end_due_date == null) {
        $('#initialSubBtn').find('.buttonAction').text('Assign');
        $('.button_Unass').hide();
        $('.button_del').show();
        var newDate = moment();
        var cs = '' + moment(newDate).format('YYYY-MM-DD') + ' 23:59';
        $('#TaskDatePicker').val('');
        $('#TaskDatePicker').attr('old-date', '');
    } else {
        if (!$("#task_manager").hasClass("request_open") && !$("#task_manager").hasClass("decline_open")) {
            $('.button_Unass').show();
            $('.button_del').show();
        }
    }

    if (conversation_id == user_id) {
        $('#requestNewDateSec').hide();
        $('#alternatAssigneeSec').hide();
        $('#checklistRequestBtn').hide();
        $('#decline_btn_sec').hide();
        $('#initialSubBtn').show();
    }
    $('#dueDatePickerChecklist').css('display', 'flex');
}

function requestActive() {
    var olddate = $('#TaskDatePicker').attr('old-date');
    var newdate = $('#TaskDatePicker').val();
    console.log(olddate, newdate);
    if ($('#requestNote').val() != '' && olddate != newdate) {
        $('#checklistRequestBtn .buttonAction').removeAttr('disabled');
    } else {
        $('#checklistRequestBtn .buttonAction').attr('disabled', 'disabled');
    }
}

var flatpickr_options = {
    minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultHour: 23,
    defaultMinute: 59,
    allowInput: true,
    disableMobile: "true",
    onChange: function(selectedDates, dateStr, instance) {
        if (dateStr) {
            if ($('#task_manager').hasClass('request_open')) {
                $('#requestNote').show().removeAttr('disabled');
                $('#requestNewDateSec').show();
                $('.request_note_sec').show();
                requestActive();
            }
            // instance.close();
        }
    },
    onOpen: function(selectedDates, dateStr, instance) {
        console.log(3794, dateStr);
        if ($('#TaskDatePicker').val() == '') {
            instance.clear();
        }
    }
}

$('#dueStartDateTime').flatpickr(flatpickr_options);
$('#dueEndDateTime').flatpickr(flatpickr_options);
$('#TaskDatePicker').flatpickr(flatpickr_options);
var flatpickrEvent = null;
var oldAssignUser = '';

function checklistDueDate(elm, event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    alternatAssigneeUserid = '';
    oldAssignUser = '';
    var newDate = moment().add(1, 'day');
    if (elm == 'settings') {
        $('#task_manager').attr('action-submit', 'settings');
        $('#task_manager').attr('msg-id', $(event.target).attr('msg-id'));
        $('#task_manager').attr('data-id', '');
        $('#task_manager').attr('data-reciver', '');
        $('#TaskUserId').html('');
        $('#TaskPrivacyStatus').prop('checked', true);
        $('#TaskDatePicker').val(moment(newDate).format('YYYY-MM-DD HH:mm'));
        $('#TaskUserId').next('input').show().val('');
        $('#task_manager').css('display', 'flex');
        $('#initialSubBtn').find('.buttonAction').text('Submit');
        $('.button_del').hide();
        $('.button_Unass').hide();
        $('#initialSubBtn').show();
    } else {
        $('#task_manager').attr('action-submit', 'single');
        flatpickrEvent = elm;
        $('#task_manager').attr('msg-id', '');
        $('#task_manager').attr('data-id', '');
        $('#task_manager').show();
        // $('#task_manager').removeClass('request_open');
        // $('#task_manager').removeClass('decline_open');

        if ($(elm).attr('end-date') == '' || $(elm).attr('end-date') == undefined) {
            // $('#TaskDatePicker').val(moment(newDate).format('YYYY-MM-DD HH:mm'));
            $('#TaskDatePicker').val('');
            $('#TaskUserId').html('');
            $('#TaskUserId').next('input').show().val('');
        } else {
            var assign_to = $(elm).attr('data-assignee');
            var privacy = $(elm).attr('data-privacy');
            if ($(elm).attr('data-privacy') == 'Private') {
                $('#TaskPrivacyStatus').prop('checked', true);
            } else {
                $('#TaskPrivacyStatus').prop('checked', false);
            }
            var user = findObjForUser(assign_to);
            $('#TaskUserId').html('<div class="mini_item _mini_item_' + user.id + '" data-id="' + user.id + '"><p class="mini_name">' + user.fullname + '</p><span class="mini_remove_ico" onclick="removeAssignMember(event,\'' + user.id + '\')"></span></div>');
            $('#TaskDatePicker').attr('old-date', moment(Number($(elm).attr('end-date'))).format('YYYY-MM-DD HH:mm'));
            $('#TaskDatePicker').val(moment(Number($(elm).attr('end-date'))).format('YYYY-MM-DD HH:mm'));
            $('#TaskUserId').next('input').hide().val('');

            console.log(22, moment(Number($(elm).attr('end-date'))).format('YYYY-MM-DD HH:mm'));
            console.log(2966, moment(Number($(elm).attr('end-date'))).format('YYYY-MM-DD HH:mm'));
        }
        if ($(elm).parents('.msg_body').length > 0) {
            var msg_id = $(elm).attr('msg-id');
            var checklist_id = $(elm).attr('data-id');
            $('#task_manager').attr('msg-id', msg_id);
            $('#task_manager').attr('data-id', checklist_id);
            if (checklist_id != '' && checklist_id != undefined || msg_id != '' && msg_id != undefined) {
                socket.emit('getOneChecklistData', { checklist_id: checklist_id, msg_id: msg_id }, function(res) {
                    var data = res.data;
                    $('#task_manager').attr('data-reciver', data.assignedby);
                    if (data.request_ttl_approved_date != null) {
                        data.end_due_date = (moment(data.request_ttl_approved_date, "YYYY-MM-DD HH:mm").unix() * 1000);
                    }
                    showDesignChecklisManagement(data);
                    if (data.alternative_assign_to == null) {
                        oldAssignUser = data.assign_to;
                    } else {
                        oldAssignUser = data.alternative_assign_to;
                    }
                })
            }
        } else {
            $('#initialSubBtn').show();
            var newDate = moment();
            var cs = '' + moment(newDate).format('YYYY-MM-DD') + ' 23:59';
            $('#TaskDatePicker').val(cs);
            $('#TaskDatePicker').attr('old-date', cs);
            if (conversation_id == user_id) {
                console.log(44444);
                var user = findObjForUser(user_id);
                var html = '<div class="mini_item _mini_item_' + user.id + '" data-id="' + user.id + '"><p class="mini_name">' + user.fullname + '</p><span class="mini_remove_ico tooltipmsg" data-balloon="Remove assignee" data-balloon-pos="left" onclick="removeAssignMember(event,\'' + user + '\')"></span></div>';
                $('#normalAssineeSec').find('.user').html(html);
                $('#normalAssineeSec').find('.user').next('input').hide();
                $("#normalAssineeSec input").blur();
            }
        }
        $('#TaskCheckForallStatus').prop('checked', false);
    }
}

function SubmitDueCheckList(type = null) {
    var enddate = moment($('#TaskDatePicker').val(), "YYYY-MM-DD HH:mm").unix();
    var olddate = moment($('#TaskDatePicker').attr('old-date'), "YYYY-MM-DD HH:mm").unix();
    enddate = enddate * 1000;
    var assign_to = $('#TaskUserId').find('.mini_item').attr('data-id');
    var privacy = ($('#TaskPrivacyStatus').prop('checked') ? 'Private' : 'Public');
    var msg_id = $('#task_manager').attr('msg-id');
    var checklist_id = $('#task_manager').attr('data-id');
    if (enddate != '' && enddate != undefined && assign_to != '' && assign_to != undefined && privacy != '' && privacy != undefined) {

    } else {
        enddate = null;
        assign_to = null;
        privacy = null;
    }
    if (type == null) {
        if ($('#task_manager').attr('action-submit') == 'settings' && $('#task_manager').attr('msg-id') != '') {
            var tData = {
                msg_id: $('#task_manager').attr('msg-id'),
                end_due_date: enddate.toString(),
                assign_to: assign_to,
                privacy: privacy,
                assign_status: user_id,
                assignedby: user_id

            }
            socket.emit('update_checklist_time_multi', tData, function(res) {
                console.log(11, res);
            })
        } else {
            if ($('#task_manager').attr('msg-id') != '' && $('#task_manager').attr('data-id') != '') {
                if ($('#TaskCheckForallStatus').prop('checked')) {
                    var tData = {
                        msg_id: $('#task_manager').attr('msg-id'),
                        end_due_date: ((enddate == null ? null : enddate.toString())),
                        assign_to: assign_to,
                        assign_status: user_id,
                        privacy: privacy

                    }

                    socket.emit('update_checklist_time_multi', tData, function(res) {
                        console.log(22, res);
                    })
                } else {
                    if ($('#alternatAssigneeSec').is(':visible')) {
                        if (alternatAssigneeUserid != '') {
                            var updateData = {
                                request_ttl_date: null,
                                request_ttl_message: null,
                                request_ttl_time: null,
                                Request_ttl_by: null,
                                msg_id: msg_id,
                                checklist_id: checklist_id,
                                alternative_assign_to: alternatAssigneeUserid,
                                assignee_change_reason: $('#assigneeChangeResone').val(),
                                assign_status: user_id,
                                assignedby: user_id,
                                end_due_date: ((enddate == null ? null : enddate.toString())),
                                last_updated_at: moment().format(),
                                last_updated_by: user_id,
                                type: 'assigneeChange'
                            }
                            var stringBody = {
                                conversation_id: conversation_id,
                                conversation_type: conversation_type,
                                msg_id: msg_id,
                                checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
                                checklist_id: checklist_id,
                                end_due_date: ((enddate == null ? null : enddate.toString())),
                                alternative_assign_to: alternatAssigneeUserid,
                                privacy: privacy,
                                item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text()
                            }
                            notititle = 'alternative_assign_to';
                            var noti_data = {
                                type: 'checklist_changes',
                                title: notititle,
                                body: JSON.stringify(stringBody),
                                created_at: new Date(),
                                created_by: user_id,
                                seen_users: [user_id],
                                receive_users: [alternatAssigneeUserid]
                            }
                            if (conversation_id !== user_id) {

                                insertNotiFun(noti_data);
                            }


                            var id = $('#task_manager').attr('data-id');
                            // var up_check = $('.perchecklist_'+id).find('.end_due_date.upBy_name');
                            var dt = moment().format();
                            var crtBy = $('.perchecklist_' + id).find('.createdBy_name').text();

                            var assign_info = '<div class="assign_info">'
                                // var assign_info = ''
                            assign_info += '<span class="createdBy_name">' + crtBy + '</span>'
                            assign_info += ' <span class="end_due_date upBy_name" data="">| Updated by ' + findObjForUser(user_id).fullname + ' on ' + moment(dt).format('MMM Do YYYY - h:mm a') + '</span>'

                            if (updateData.alternative_assign_to == user_id && updateData.assignedby == user_id && updateData.assign_status == user_id) {
                                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(updateData.alternative_assign_to).fullname + '">| Self-assigned</span> '
                                assign_info += ' <span class="end_due_date _due_date" data="' + (updateData.end_due_date != null ? moment.unix(Number(updateData.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (updateData.end_due_date != null ? moment.unix(Number(updateData.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                            } else {
                                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(updateData.alternative_assign_to).fullname + '">| Assigned to ' + findObjForUser(updateData.alternative_assign_to).fullname + ' </span>'
                                assign_info += ' <span class="end_due_date _due_date" data="' + (updateData.end_due_date != null ? moment.unix(Number(updateData.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (updateData.end_due_date != null ? moment.unix(Number(updateData.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                                assign_info += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(updateData.assignedby).fullname + '">| Assigned by ' + findObjForUser(updateData.assignedby).fullname + ' </span>'
                            }
                            assign_info += '</div>';

                            var allActivity = '';
                            if (updateData.alternative_assign_to != null && updateData.end_due_date != null) {
                                allActivity += '<span class="activity_assignedTo"> | Assigned to ' + findObjForUser(updateData.alternative_assign_to).fullname + ' </span>'
                            }
                            if (updateData.assignedby != null && updateData.end_due_date != null) {
                                allActivity += '<span class="activity_assignedBy"> | Assigned by ' + findObjForUser(updateData.assignedby).fullname + ' </span>'
                            }

                            if (updateData.alternative_assign_to != null) {
                                if ($('.perchecklist_' + id).find('.assign_info').length == 1) {
                                    $('.perchecklist_' + id).find('.assign_info').remove();
                                    $('.perchecklist_' + id).append(assign_info);
                                } else {
                                    $('.perchecklist_' + id).append(assign_info);
                                }
                                $('.perchecklist_' + id).attr('assign-to', updateData.alternative_assign_to);
                                $('.perchecklist_' + id).attr('assigned-by', updateData.assignedby);
                                $('.perchecklist_' + id).find('.dueDateIcon img').attr('src', file_server + 'profile-pic/Photos/' + findObjForUser(alternatAssigneeUserid).img);
                                $('.ttl_request' + id).remove();
                                if (updateData.assignedby == user_id && updateData.alternative_assign_to != user_id) {
                                    $('.perchecklist_' + id).find('.assign_info').append('<div class="ttl_requestTime ttl_request' + id + '">| <span class="success_btn red_color" data-id="' + id + '">Pending Acceptance.</span></div>');
                                }
                                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedTo').remove();
                                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedBy').remove();
                                $('.perchecklist_' + id).find('.activity_list_all').append(allActivity);
                            } else {
                                $('.perchecklist_' + id).find('.assign_info').remove();
                                $('.perchecklist_' + id).removeClass('item_accepted');
                                $('.perchecklist_' + id).removeClass('waiting_3');
                                $('.perchecklist_' + id).attr('assign-to', 'null');
                                $('.perchecklist_' + id).attr('assigned-by', 'null');
                                $('.ttl_request' + id).remove();
                            }

                            socket.emit('manage_checklist', updateData, function(res) {
                                $(flatpickrEvent).addClass('AssigneeUser');
                                $(flatpickrEvent).html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(alternatAssigneeUserid).img + '">');
                                $(".ttl_request" + checklistManageId).remove();
                                $('.perchecklist_' + id).find('.dueDateIcon').css('pointer-events', 'auto');
                                // $('.perchecklist_'+id).find('.item_del').show();
                            })
                        } else {

                        }
                    } else {

                        var uid = $('#TaskUserId').attr('assign-id');
                        var old_t = $('#TaskDatePicker').attr('old-date');
                        var new_t = $('#TaskDatePicker').val();
                        var user = findObjForUser(uid);

                        if (assign_to == old_assignee && old_t == new_t) {
                            if ($('#task_manager').attr('action') != 'declined') {
                                console.log(111, 'return')
                                return;
                            }
                            $('#task_manager').removeAttr('action');
                        } else if (uid == '' && assign_to == null) {
                            console.log(222, 'return')
                            if ($('#initialSubBtn').is(':visible') && $('#initialSubBtn .buttonAction').text() == 'Assign') {
                                return;
                            }
                        }

                        var data = {
                            request_ttl_date: null,
                            request_ttl_message: null,
                            request_ttl_time: null,
                            Request_ttl_by: null,
                            msg_id: msg_id,
                            checklist_id: checklist_id,
                            end_due_date: ((enddate == null ? null : enddate.toString())),
                            assign_to: assign_to,
                            alternative_assign_to: null,
                            assign_status: user_id,
                            assignedby: user_id,
                            privacy: privacy,
                            last_updated_at: moment().format(),
                            last_updated_by: user_id
                        }

                        var stringBody = {
                            conversation_id: conversation_id,
                            conversation_type: conversation_type,
                            msg_id: $('#task_manager').attr('msg-id'),
                            checklist_title: $('.msg_id_' + $('#task_manager').attr('msg-id')).find('.checkListPlainText').text(),
                            checklist_id: $('#task_manager').attr('data-id'),
                            end_due_date: ((enddate == null ? null : enddate.toString())),
                            assign_to: assign_to,
                            privacy: privacy,
                            item_title: $('.perchecklist_' + $('#task_manager').attr('data-id')).find('.checkBoxTitle').text()
                        }

                        if (data.assign_to != null) {
                            notititle = 'new_assignee';
                        } else {
                            notititle = 'remove_assignee';
                        }
                        var noti_data = {
                            type: 'checklist_changes',
                            title: notititle,
                            body: JSON.stringify(stringBody),
                            created_at: new Date(),
                            created_by: user_id,
                            seen_users: [user_id],
                            receive_users: (data.assign_to != null ? [data.assign_to] : [$('#TaskUserId').attr('assign-id')])
                        }
                        if (conversation_id !== user_id) {
                            insertNotiFun(noti_data);
                        }
                        var id = $('#task_manager').attr('data-id');
                        // var up_check = $('.perchecklist_'+id).find('.end_due_date.upBy_name');
                        var dt = moment().format();
                        var crtBy = $('.perchecklist_' + id).find('.createdBy_name').text();

                        var assign_info = '<div class="assign_info">'
                        assign_info += '<span class="createdBy_name">' + crtBy + '</span>'
                        assign_info += ' <span class="end_due_date upBy_name" data="">| Updated by ' + findObjForUser(user_id).fullname + ' on ' + moment(dt).format('MMM Do YYYY - h:mm a') + '</span>'
                        if (data.assign_to != null) {
                            if (data.assign_to == user_id && data.assignedby == user_id && data.assign_status == user_id) {
                                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">| Self-assigned</span> '
                                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                            } else {
                                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">| Assigned to ' + findObjForUser(data.assign_to).fullname + ' </span>'
                                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                                assign_info += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(data.assignedby).fullname + '">| Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>'
                            }
                        }
                        assign_info += '</div>';


                        var allActivity = '';
                        if (data.assign_to != null && data.end_due_date != null) {
                            allActivity += '<span class="activity_assignedTo"> | Assigned to ' + findObjForUser(data.assign_to).fullname + ' </span>'
                        }
                        if (data.assignedby != null && data.end_due_date != null) {
                            allActivity += '<span class="activity_assignedBy"> | Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>'
                        }
                        if (data.assign_to != null) {
                            if ($('.perchecklist_' + id).find('.assign_info').length == 1) {
                                $('.perchecklist_' + id).find('.assign_info').remove();
                                $('.perchecklist_' + id).append(assign_info);
                            } else {
                                $('.perchecklist_' + id).append(assign_info);
                            }
                            $('.perchecklist_' + id).addClass('has_assign').removeClass('unassigned');
                            $('.perchecklist_' + id).attr('assign-to', data.assign_to);
                            $('.perchecklist_' + id).attr('assigned-by', data.assignedby);
                            $('.ttl_request' + id).remove();
                            if (data.assignedby == user_id && data.assign_to != user_id) {
                                $('.perchecklist_' + id).find('.assign_info').append('<div class="ttl_requestTime ttl_request' + id + '">| <span class="success_btn red_color" data-id="' + id + '">Pending Acceptance.</span></div>');
                            }
                            $('.perchecklist_' + id).find('.activity_list_all .activity_assignedTo').remove();
                            $('.perchecklist_' + id).find('.activity_list_all .activity_assignedBy').remove();
                            $('.perchecklist_' + id).find('.activity_list_all').append(allActivity);
                        } else {
                            $('.perchecklist_' + id).find('.assign_info').remove();
                            $('.perchecklist_' + id).attr('assign-to', 'null');
                            $('.perchecklist_' + id).attr('assigned-by', 'null');
                            $('.perchecklist_' + id).removeClass('item_accepted');
                            $('.perchecklist_' + id).removeClass('waiting_3');
                            $('.ttl_request' + id).remove();
                            $('.perchecklist_' + id).removeClass('has_assign').addClass('unassigned');
                            $('.perchecklist_' + id).find('.activity_list_all .activity_assignedTo').remove();
                            $('.perchecklist_' + id).find('.activity_list_all .activity_assignedBy').remove();
                            $('.perchecklist_' + id).find('.dueDateIcon img').remove();
                            $('.perchecklist_' + id).find('.dueDateIcon').css('pointer-events', 'auto');
                            $('.perchecklist_' + id).find('.dueDateIcon').removeClass('active').removeClass('AssigneeUser');
                            $('.perchecklist_' + id).find('.dueDateIcon').attr('data-assignee', '').attr('end-date', '');
                            $('.perchecklist_' + id).append(assign_info);
                            console.log('Assignee Removed!');
                        }
                        taskItemCounter(data.msg_id)


                        socket.emit('update_checklist_time', data, function(res) {
                            console.log(33, res);
                        })
                    }
                }
            } else {
                if ($('#task_manager').attr('action-submit') == 'settings') {
                    var allDueElm = $('#msgCheckItemContainer').find('.dueDateIcon');
                    $.each(allDueElm, function(k, v) {
                        if (enddate == null) {
                            $(v).attr('end-date', '');
                            $(v).attr('data-privacy', '');
                            $(v).attr('data-assignee', '');
                            $(v).removeClass('active');
                            $(v).removeClass('AssigneeUser');
                            $(v).html('');
                            $('#checkListPlainText1').attr('end-date', '');
                            $('#checkListPlainText1').attr('data-privacy', '');
                            $('#checkListPlainText1').attr('data-assignee', '');
                        } else {
                            $(v).attr('end-date', enddate);
                            $(v).attr('data-privacy', privacy);
                            $(v).attr('data-assignee', assign_to);
                            $('#checkListPlainText1').attr('end-date', enddate);
                            $('#checkListPlainText1').attr('data-privacy', privacy);
                            $('#checkListPlainText1').attr('data-assignee', assign_to);
                            $(v).addClass('active');
                            $(v).addClass('AssigneeUser');
                            $(v).html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(assign_to).img + '">');
                        }
                    })

                } else {
                    if (enddate == null) {
                        $(flatpickrEvent).attr('end-date', '');
                        $(flatpickrEvent).attr('data-privacy', '');
                        $(flatpickrEvent).attr('data-assignee', '');

                        $(flatpickrEvent).removeClass('active');
                        $(flatpickrEvent).removeClass('AssigneeUser');
                        $(flatpickrEvent).html('');
                    } else {
                        $(flatpickrEvent).attr('end-date', enddate);
                        $(flatpickrEvent).attr('data-privacy', privacy);
                        $(flatpickrEvent).attr('data-assignee', assign_to);

                        $(flatpickrEvent).addClass('active');
                        $(flatpickrEvent).addClass('AssigneeUser');
                        $(flatpickrEvent).html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(assign_to).img + '">');
                    }
                }
            }
        }
    } else {
        $('#TaskUserId').find('.mini_remove_ico').click();
    }
    closePopUps('#task_manager');
}