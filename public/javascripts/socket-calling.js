var timerConf = null;
var win_voip = null;
var ring_stream = null;
// var ring_state = [];
var rejectMsgBtn_element = null;
var partner_id_call;
var push_promise = null;

function sendAckInfo(data) {
    if (data.ackid) socket.emit('ack_message_voip', {
        user_id: user_id,
        data: data
    });
}

const CALL_RING_TIME = 60000; // default: 60000
const CALL_WAIT_TIME = 30000; // default: 60000
const CALL_CLOSE_TIME = 30000; // default: 60000
function refreshOnlineUsersList() {
    // console.trace('refreshOnlineUsersList',$('#suggested_list_add li').length);
    $('#suggested_list_add .showEl').each(function(kv, el) {
        if ($(el).find('span[class^="online_"]').hasClass('online')) {
            $(el).show();
        } else {
            $(el).hide();
        }
    });
    $('#list_count_add').text($('#suggested_list_add li:visible').length);
}

function clean_timer_user() {
    if (timerConf != null) {
        clearTimeout(timerConf);
        timerConf = null;
        console.log('voip:client:timer:clear');
    }
    // if (ring_stream) {
    // 	let rss = ring_stream.getTracks();
    // 	rss.forEach(function (track) { track.stop(); });
    // 	console.log(rss);
    // 	ring_stream = null;
    // }
}

function call_clear_cookies() {
    console.log('call_clear_cookies');

    setCookieCall('reloadstatus', '', 1);
    setCookieCall('callList_username', '', 1);
}

function clear_push_promise() {
    if (push_promise) {
        // push_promise.close();
        push_promise.then(function(notification) {
            console.log('push_close');
            // if (notification) notification.close();
            Push.close('foo');
            push_promise = null;
        });

    }
}

function get_msgtextbyId(msg, hangup_name, data) {
    console.log('get_msgtext_byId', data)
    var txtmsg = '';
    if (hangup_name) {
        if (msg == 0) txtmsg = hangup_name + ' rejected your call.';
        else if (msg == 1) txtmsg = 'I\'ll call you later.<br>- ' + hangup_name;
        else if (msg == 2) txtmsg = 'Can\'t talk now. Call me later?<br>- ' + hangup_name;
        else if (msg == 3) txtmsg = 'I\'m in a meeting. I\'ll call you back.<br>- ' + hangup_name;
        else if (msg == 4) txtmsg = hangup_name + ' not answered your call.';
        else if (msg == 5) txtmsg = hangup_name + ' has lost connection.';
        else txtmsg = hangup_name + ' has ended the call.';
    }
    return txtmsg + "<br>You may close this window now.";

}
var per_msg_top_call = (msgid, msg_date, msg_right, msg_mirror, msg_user_img, msg_user_name, msg_is_flag) => {
    console.log('per_msg_top_call', msgid, msg_date, msg_right, msg_mirror, msg_user_img, msg_user_name, msg_is_flag);
    $.each($('.separetor'), function(k, v) {
        if ($(v).text() == msg_date) {
            msg_date = " ";
            return 0;
        }
    });
    var html = "";
    html += '<div class="separetor">' + msg_date + '</div>';
    html += '<div class="per-msg ' + msg_right + ' msg_id_' + msgid + '" data-msgid="' + msgid + '">';
    html += '<input type="checkbox" class="selectIt">';
    html += '<div class="profile-picture">';
    html += '<img src="' + file_server + 'profile-pic/Photos/' + msg_user_img + '">';
    html += '</div>';
    html += '<div class="triangle-up-right ' + msg_mirror + '"></div>';
    html += '<div class="msg-con">';
    html += '<div class="msg-header">';
    html += '<div class="user-name">' + msg_user_name + '</div>';
    html += '<div class="toolbar">';
    html += '<img src="/images/incoming-reaction_20px @1x.png" class="toolbar-img" onclick="open_reaction(event)">';
    html += '<img src="/images/incoming-thread_20px @1x.png" class="toolbar-img">';
    if (msg_is_flag) {
        html += '<img src="/images/flagged_20px @1x.png" class="toolbar-img flaged" onclick="flag_unflag(event)">';
    } else {
        html += '<img src="/images/incoming-flag_20px @1x.png" class="toolbar-img" onclick="flag_unflag(event)">';
    }
    html += '<img src="/images/incoming-more_20px @1x.png" class="toolbar-img" onclick="open_more(\'' + msgid + '\',event)">';
    html += '</div>';
    html += '</div>'; // end of 'msg-header' div
    return html;
};
var per_msg_main_body_call = (msg_text, msg_type, msg_from, sender_name, receiver_name, msg_link_url, msg_time, msg_status = true) => {
    console.log('per_msg_main_body', msg_text, msg_link_url, msg_time, msg_status);
    // Check miss call related messages
    if (msg_type == 'call') {
        if (msg_from == user_id) { // right side
            var msg_text = receiver_name + " missed a " + (msg_text == "audio" ? "" : msg_text) + " call from you. " + "<a href='javascript:void(0)' data-calltype='" + msg_text + "' onclick='callbackAudioVideo(this)'>Callback</a>";
        } else { // left side
            var msg_text = "You missed a " + (msg_text == "audio" ? "" : msg_text) + " call from " + sender_name + ". " + "<a href='javascript:void(0)' data-calltype='" + msg_text + "' onclick='callbackAudioVideo(this)'>Callback</a>";
        }
    }

    // Check call related messages
    else if (msg_type == 'network') {
        if (msg_from == user_id) {
            // right side
            var msg_text = "You tried to call " + receiver_name + " from outside network. ";
        } else {
            // left side
            var msg_text = sender_name + " tried to call you from outside network. ";
        }
    } else {
        var msg_text = row.msg_body;
    }

    var html = "";
    html += '<div class="msg-body">';
    html += '<div class="body-text">';
    html += '<span class="msg-text">' + msg_text;
    if (msg_link_url.length > 0) {
        html += '<a href="' + msg_link_url[0] + '" target="_blank">' + msg_link_url[0] + '</a>';
    }
    html += '\n</span>';
    html += '<div class="msg-send-seen-delivered">';
    if (msg_status) {
        html += '<img src="/images/reciept-delivered_14px_200 @1x.png">';
    } else {
        html += '<img src="/images/reciept-sent_14px_200 @1x.png">';
    }
    html += '</div>';
    html += '<div class="per-msg-time">' + msg_time + '</div>';
    html += '<div class="attachment"></div>';
    html += '<div class="replies"></div>';
    html += '</div>'; // end of 'body-text' div
    html += '<div class="per-msg-action"><img src="/images/NavbarIcons/actions-create_24px_FFF.png" class="pointer"></div>';
    html += '</div>'; // end of 'msg-body' div
    html += '<div class="msg-footer"></div>';
    html += '</div>'; // end of 'msg-con' div, which start when call the per_msg_top() function.
    html += '</div>'; // end of 'per-msg' div, which start when call the per_msg_top() function.
    return html;
};

function tog_groupcall_chk(element) {
    if ($(element).attr('data-status') == 'yes') {
        $(element).attr('data-status', 'no').attr('src', '/images/call/groupcall_checkmark_no.png').css('opacity', '0.5');
    } else {
        $(element).attr('data-status', 'yes').attr('src', '/images/call/groupcall_checkmark_yes.png').css('opacity', '1');
    }
}
var searchCallMember = (value) => {
    $("#memberHolderCall li").each(function() {

        if ($(this).find('label').text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#memberHolderCall li").unhighlight();
    $("#memberHolderCall li").highlight(value);
}

function memAssignForCall(e, memUUID) {
    if (e.target.checked) {
        $(e.target).attr('checked', 'checked');
    } else {
        $(e.target).removeAttr('checked');
    }
    if ($('.checkGroupCall[checked]').length == 1 || $('.checkGroupCall[checked]').length == 0) {
        $('#btnMakecall').attr('data-type', 'window').text('Open Window');
    } else {
        $('#btnMakecall').attr('data-type', 'ring').text('Make a call');
    }
}

function cancelCall() {
    $('.videoCallMenuPopup').hide();
}

function stringifyEvent(e) {
    const obj = {};
    for (let k in e) {
        obj[k] = e[k];
    }
    return JSON.stringify(obj, (k, v) => {
        if (v instanceof Node) return 'Node';
        if (v instanceof Window) return 'Window';
        return v;
    }, ' ');
}

function openCallWindow(TIMER_OUT) {
    var ww = screen.availWidth * 0.8;
    var hh = screen.availHeight * 0.8;
    var left = (screen.width / 2) - (ww / 2);
    var top = (screen.height / 2) - (hh / 2);
    // window.name = "parent";
    win_voip = window.open("", "calling", "width=" + ww + ",height=" + hh + ', top=' + top + ', left=' + left);

    clean_timer_user();
    if (TIMER_OUT > 0) {
        timerConf = setTimeout(function() {
            console.log('voip:timer:personal:new');
            clean_timer_user();
            if (win_voip) win_voip.close();
        }, TIMER_OUT);
    }
    return win_voip;
}

function openVideoCall(element) {
    if (socket.connected) {
        // //debugger;
        if ($('.myCallModal').length) { alert('Please answer incoming call.'); return }
        $('#btnMakecall').attr('data-type', 'window').text('Open Window');
        $('#rejectmsgListBackWrap').hide();
        $('.videoCallMenuPopup').hide();
        // data collection start =======================================================================
        conversation_img_call = $(element).attr('data-img');
        conversation_status_call = $(element).attr('data-status');
        conversation_mute_call = $(element).attr('data-mute');
        conversation_pin_call = $(element).attr('data-pin');

        set_calltype = $(element).attr('data-type');
        conversation_id_call = $(element).attr('data-conversationid');
        conference_id_call = $(element).attr('data-conferenceid');
        conversation_type_call = $(element).attr('data-conversationtype');
        if (conversation_type_call == 'single' || conversation_type_call == 'Personal') conversation_type_call = 'personal';
        convname_call = $(element).attr('data-convname'); // group call

        privacy_icon_call = $(element).attr('data-privacy'); // group call
        participants_all = $(element).attr('data-participants').split(',');
        var pathArray = window.location.href.split('/');
        if (pathArray[3] == "connect") { // mobile site
            partner_name_call = $(element).attr('data-partnername'); // personal call
            if (conversation_type_call == 'personal') {
                participants_all.forEach(member_id => {
                    if (member_id != user_id) partner_id_call = member_id; // personal call
                });
                var chk_participants = [user_id, partner_id_call];
            } else { // group
                partner_id_call = user_id; // personal 
                var chk_participants = participants;
            }
        } else { // web site
            if ($('#myModalImgview').is(':visible')) { // profile
                partner_id_call = $('#myModalImgview').attr('data-userid');
                if (partner_id_call == user_id) return;
                conversation_type_call = 'personal';
                partner_name_call = $('#user_namePopupbox').text();
                var chk_participants = [user_id, partner_id_call];
            } else if (conversation_type_call == 'personal') {
                if (participants_all.length == 1) {
                    var chk_participants = [user_id];
                    partner_id_call = user_id;
                } else {
                    participants_all.forEach(member_id => {
                        if (member_id != user_id) partner_id_call = member_id;
                    });
                    var chk_participants = [user_id, partner_id_call];
                }
                partner_name_call = $(element).attr('data-partnername');
            } else { // group
                partner_id_call = room_id;
                partner_name_call = $(element).attr('data-partnername');
                var chk_participants = participants;
            }
        }
        if ($('.sideActive.selected').children(":first").hasClass('lock')) { privacy_icon_call = 'private' } else privacy_icon_call = 'public';
        // data collection end =============================================================================
        if (conversation_type_call == 'personal' && !$(element).hasClass('onC') && chk_participants.length > 1) {
            showBusyMsgCall('offline', 'personal');
            return;
        }
        if (conversation_type_call == 'personal') { openCallWindow(0); }

        socket.emit('get_isbusy_conf', {
            sender_id: user_id,
            conversation_id: conversation_id_call,
            arr_participants: chk_participants,
            conversation_type: conversation_type_call,
        }, function(isbusy) {
            // //debugger;
            console.log('isbusy:first:', isbusy); //alert(isbusy.caller_data.media_flow);
            if (!isbusy.redis_status) {
                clean_timer_user();
                if (win_voip) win_voip.close();
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Redis server not connected!');
            } else {
                if (isbusy.caller_busy) {
                    focusVideoCall();
                } else if (isbusy.conf_timeout) {
                    clean_timer_user();
                    if (win_voip) win_voip.close();
                    // $('#warningsPopup .popup_title').text('Warning !');
                    $('#warningsPopup .warningMsg').text('Please try again after a moment.');
                    $('#warningsPopup').css('display', 'flex');
                } else if (isbusy.personal_join) {
                    openCallWindow(0);
                    win_voip.location.href = isbusy.call_url;
                } else if (isbusy.partner_busy) {
                    clean_timer_user();
                    if (win_voip) win_voip.close();
                    showBusyMsgCall('busy', 'personal');
                } else if (isbusy.room_busy) {
                    if ($('#myModalImgview').is(':visible')) {
                        clean_timer_user();
                        if (win_voip) win_voip.close();
                        $('#warningsPopup').css('display', 'flex');
                        $('#warningsPopup .warningMsg').text('Group call is in progress. Call rejected !');
                    } else {
                        openCallWindow(0);
                        win_voip.location.href = isbusy.call_url;
                    }
                } else { // new call
                    if (conversation_type_call == 'personal') { // personal call
                        var arr_participants = chk_participants;
                        socket.emit('call_send_msgdb', { // set_ringingData
                            user_id: user_id,
                            user_email: user_email,
                            sender_name: user_fullname,
                            sender_img: user_img,
                            room_id: partner_id_call,
                            room_name: partner_name_call, // new
                            conversation_id: conversation_id_call,
                            conversation_type: conversation_type_call,
                            convname: user_fullname,
                            arr_participants: arr_participants, // redis
                            set_calltype: set_calltype,
                            privacy: privacy_icon_call,
                            call_option: arr_participants.length == 1 ? 'window' : 'ring', // optional
                            conference_id: findObjForUser(user_id).conference_id, // new
                            participants_admin: [user_id], // new
                            participants_all: participants_all, // new
                            conversation_img: conversation_img_call,
                            conversation_status: conversation_status_call,
                            conversation_mute: conversation_mute_call,
                            conversation_pin: conversation_pin_call,
                            company_id: company_id
                        }, function(cb_data) {
                            console.log('voip_client:call__send__msgdb', cb_data);
                            if (cb_data && cb_data.ring_status == "true") {
                                win_voip.location.href = cb_data.call_url;
                            } else {
                                clean_timer_user();
                                if (win_voip) win_voip.close();
                                $('#warningsPopup').css('display', 'flex');
                                if (cb_data.err_status == "promise") {
                                    $('#warningsPopup .warningMsg').text('Server not responding. Please try again later.');
                                    console.log('voip_client:call__send__msgdb', cb_data.err_obj);
                                } else $('#warningsPopup .warningMsg').text('User is offline.');
                            }
                        });
                    } else {
                        var pathArray = window.location.href.split('/');
                        if (pathArray[3] == "connect") { // mobile version
                            if ($(element).closest('.conv_area').length > 0) {
                                participants = $(element).closest('.conv_area').attr('participants').split(',');
                            }
                        }
                        viewMemberListCall();
                    }
                }

            }


        });
    } else {
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('You are not connected.');
    }
}
var viewMemberListCall = () => {
    if (socket.connected) {
        socket.emit('get_call_userlist', {
            user_id: user_id,
            participants: participants
        }, function(allUser_data) {
            console.log('get:call:userlist', allUser_data, onlineUserList, adminArra, participants);
            $('#memberHolderCall').html("");

            var mycallhtml = '';
            $.each(allUser_data, function(ky, va) {
                $.each(participants, function(k, v) {
                    // if (va.id === v && va.id != user_id) {
                    // 	if (onlineUserList.indexOf(va.id) > -1) {
                    // 		var design = '	<li ' + (va.is_busy == true ? 'style="padding-top:5px"' : '') + '>';
                    // 		design += '		<label class="">' + va.fullname + '<span class="statusmini">' + (va.is_busy == true ? '(Busy)' : '') + '</span><div ' + (va.is_busy == true ? 'style="display:inline"' : 'style="display:none"') + '><img  data-name="' + va.fullname + '" onclick="showBusyMsgCall(\'busy\',\'personal\')" class="calling_busymsg" src="/images/basicAssets/thread.svg"></div>';
                    // 		design += '			<input ' + (va.is_busy == true ? 'disabled' : '') + ' data-online="true" onclick="memAssignForCall(event,\'' + va.id + '\')" id="' + va.fullname.replace(/\s/g, '') + '" class="checkGroupCall" data-uid="' + va.id + '" type="checkbox">';
                    // 		design += '			<span class="checkmark"></span>';
                    // 		design += '		</label>';
                    // 		design += '		</li>';
                    // 		$("#memberHolderCall").append(design);
                    // 	}
                    // }

                    if (va.id === v) {
                        if (va.id != user_id) {
                            if (onlineUserList.indexOf(va.id) > -1) {
                                var design = '	<li ' + (va.is_busy == true ? 'style="padding-top:5px"' : '') + '>';
                                design += '		<label class="">' + va.fullname + '<span class="statusmini">' + (va.is_busy == true ? '(Busy)' : '') + '</span><div ' + (va.is_busy == true ? 'style="display:inline"' : 'style="display:none"') + '><img  data-name="' + va.fullname + '" onclick="showBusyMsgCall(\'busy\',\'personal\')" class="calling_busymsg" src="/images/basicAssets/thread.svg"></div>';
                                design += '			<input ' + (va.is_busy == true ? 'disabled' : '') + ' data-online="true" onclick="memAssignForCall(event,\'' + va.id + '\')" id="' + va.fullname.replace(/\s/g, '') + '" class="checkGroupCall" data-uid="' + va.id + '" type="checkbox">';
                                design += '			<span class="checkmark"></span>';
                                design += '		</label>';
                                design += '		</li>';
                                $("#memberHolderCall").append(design);
                            }
                        } else {
                            mycallhtml += '	<li style="">';
                            mycallhtml += '		<label class="" style="cursor: unset;">' + va.fullname + ' (You)<span class="statusmini">' + (va.is_busy == true ? '(Busy)' : '') + '</span><div ' + (va.is_busy == true ? 'style="display:inline"' : 'style="display:none"') + '><img  data-name="' + va.fullname + '" onclick="showBusyMsgCall(\'busy\',\'personal\')" class="calling_busymsg" src="/images/basicAssets/thread.svg"></div>';
                            // mycallhtml += '			<input ' + (va.is_busy == true ? 'disabled' : '') + ' data-online="true" onclick="memAssignForCall(event,\'' + va.id + '\')" id="' + va.fullname.replace(/\s/g, '') + '" class="checkGroupCall" data-uid="' + va.id + '" type="checkbox">';
                            mycallhtml += '			<input disabled data-online="true" onclick="memAssignForCall(event,\'' + va.id + '\')" id="' + va.fullname.replace(/\s/g, '') + '" class="checkGroupCall" data-uid="' + va.id + '" type="checkbox" checked="checked">';
                            mycallhtml += '			<span class="checkmark"></span>';
                            mycallhtml += '		</label>';
                            mycallhtml += '		</li>';
                        }
                    }
                });
            });
            $("#memberHolderCall").prepend(mycallhtml);

            $('.checkGroupCall[data-online="false"]').closest("li").hide();
            var online_user_count = $('.checkGroupCall[data-online="true"]').length;
            var offline_user_count = participants.length - online_user_count;
            $('.call-users-online').text(online_user_count);
            $('.call-users-offline').text(offline_user_count);
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            // if (!isMobile) overlayScrollbars();

            if ($('.videoCallMenuPopup').is(":visible") == false) {
                if (participants.length == 2) {
                    $('.checkGroupCall').attr('checked', 'checked');
                    ringGroupCall();
                } else {
                    $('.videoCallMenuPopup').show();
                }
            } else {
                $('.videoCallMenuPopup').hide();
            }
        });
    } else {
        alert('Please check your network.');
    }
}

function ringGroupCall() {
    if (socket.connected) {
        $('.videoCallMenuPopup').hide();
        openCallWindow(0);
        var arr_participants = [];
        $('.checkGroupCall[checked]').each(function(k, v) { arr_participants.push($(v).attr('data-uid')); });
        socket.emit('get_isbusy_conf', {
            sender_id: user_id,
            conversation_id: conversation_id_call,
            arr_participants: arr_participants,
            conversation_type: 'group'
        }, function(isbusy) {
            console.log('isbusy:group', isbusy);
            if (isbusy.caller_busy == true) {
                focusVideoCall();
            } else if (isbusy.conf_timeout == true) {
                clean_timer_user();
                if (win_voip) win_voip.close();
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Please try again after a moment.');
            } else if (isbusy.partner_busy) {
                clean_timer_user();
                if (win_voip) win_voip.close();
                showBusyMsgCall('busy', 'group');
            } else if (isbusy.room_busy) {
                if ($('#myModalImgview').is(':visible')) {
                    clean_timer_user();
                    if (win_voip) win_voip.close();
                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('Call is in progress. Call rejected !');
                } else {
                    openCallWindow(0);
                    win_voip.location.href = isbusy.call_url;
                }
            } else { // new group call
                socket.emit('call_send_msgdb', {
                    user_id: user_id,
                    user_email: user_email,
                    sender_name: user_fullname,
                    sender_img: user_img,
                    room_id: partner_id_call,
                    room_name: partner_name_call,
                    conversation_id: conversation_id_call,
                    conversation_type: 'group',
                    convname: convname_call,
                    privacy: privacy_icon_call,
                    arr_participants: arr_participants,
                    set_calltype: set_calltype,
                    conference_id: conference_id_call,
                    call_option: $('#btnMakecall').attr('data-type'),
                    participants_admin: adminArra,
                    participants_all: participants_all,
                    conversation_img: conversation_img_call,
                    conversation_status: conversation_status_call,
                    conversation_mute: conversation_mute_call,
                    conversation_pin: conversation_pin_call,
                    company_id: company_id
                }, function(cb_data) {
                    console.log('voip_client:call__send__msgdb', cb_data);
                    if (cb_data && cb_data.ring_status == "true") {
                        win_voip.location.href = cb_data.call_url;
                    } else {
                        clean_timer_user();
                        if (win_voip) win_voip.close();
                        $('#warningsPopup').css('display', 'flex');
                        if (cb_data.err_status == "promise") $('#warningsPopup .warningMsg').text('Server problem. Please try again later.');
                        else $('#warningsPopup .warningMsg').text('Network problem. Please try again.');
                    }

                });
            }
        });
    } else {
        alert('Please check your network!')
    }
}

function showBusyMsgCall(status, convtype) {
    var message = "";
    var convName = "";
    if (convtype == 'personal') convName = 'User';
    else convName = 'Everyone';
    // if ($(element).hasClass('off_P_C')) {
    if (status == 'offline') message = convName + ' is currently unavailable. Please try again later or leave a message instead.';
    else if (status == 'busy') message = convName + ' is currently busy in another call. Please try again later or leave a message instead.';

    // } else if ($(element).hasClass('off_G_C')) {
    // message = 'Everyone in this channel is currently offline. Please leave a message instead.';
    // }
    $('#messageForCalOff').val('');
    $('#warningPopupForCallMsg').css('display', 'flex');
    $('#warningTitleForCallMsg').text('Sorry !');
    $('#warningMessageForCallMsg').text(message);
    $('#messageForCalOff').attr('placeholder', 'Message ' + convName + '');
    $('#messageForCalOff').focus();

}

function rejectMsgBtn(element) {
    if ($('#rejectmsgListBackWrap').is(":visible") == false) {
        $('#rejectmsgListBackWrap').show();
        rejectMsgBtn_element = element;
    } else {
        $('#rejectmsgListBackWrap').hide();
        rejectMsgBtn_element = null;
    }

}

function callbackAudioVideo(element) {
    var calltype = element.getAttribute('data-calltype');
    if (calltype == 'audio') {
        $('.audio_call_icon').click();
    } else {
        $('.icon_video_call').click();
    }

}

function closeAllPopUpMsgReject() {
    $('#rejectmsgListBackWrap').hide();
    $('#mobile_call_option_div').hide();

}

function openCallBusyMsg(el) {
    var message = "";
    var convName = $(el).attr('data-name');
    message = 'Everyone in this channel is currently offline. Please leave a message instead.';

    $('#messageForCalOff').val('');
    $('#warningPopupForCallMsg').css('display', 'flex');
    $('#warningTitleForCallMsg').text('Sorry !');
    $('#warningMessageForCallMsg').text(message);
    $('#messageForCalOff').attr('placeholder', 'Message ' + convName + '');
    $('#messageForCalOff').focus();
}
// event listener start ------------------------------------------------------
window.onload = function() { //alert("It's loaded!") 
    }
    // socket listener start ------------------------------------------------
socket.on('conf_addmember_timeout', function(data) {
    console.log('conf_addmember__timeout', data);
    sendAckInfo(data);
    if (data.member_id == user_id) {
        var _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
        let aud = _this.find(".call_ringtone_audio")[0];
        if (aud) {
            aud.pause();
            aud.currentTime = 0;
        }
        if (_this.length > 0) { _this.remove(); }
        clear_push_promise();
    } else {
        $('.forActive[data-uid="' + data.member_id + '"]').text("").attr('data-status', 'no');
    }

});
socket.on('voip_ringstatus_ok', function(data) {
    sendAckInfo(data);
    console.log('voip_ringstatus__ok', data);
    clean_timer_user();
    if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
        $('#participants').show();
        $('#beforecallicons').hide();

        $('#icons').show().animate({ height: '10%' }, function() {});
        $('#room').animate({ height: '85%' }, function() {
            redrawConf();
            if (isMobile == true || devicetype == 'android') {
                // setIconsToggleMenu();
            }
        });
    }
});
socket.on('videoconf_status', function(data) {
    console.log('voip:video_conf_status', data); // alert('ring');
    sendAckInfo(data);

});
socket.on('videoconf_send', function(data) {
    // callback(true);
    console.log('voip:video_conf_send', data); // alert('ring');
    if (typeof callCleanupLogic != 'function' && window.name != 'calling' && data.ring_type == 'add') return;
    if (typeof callCleanupLogic == 'function' && window.name == 'calling' && user_role == 'guest') return;
    if (typeof callCleanupLogic == 'function' && window.name == 'calling' && is_register == false) return;

    var _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
    if (_this.length == 0) {
        var sender_id = data.ring_index.split('_')[1];
        var receiver_id = data.ring_index.split('_')[2];
        var chtml = '';
        chtml += '<div id="callring_' + data.user_id + '" class="myCallModal" data-senderid="' + sender_id + '" data-receiverid="' + receiver_id + '" data-uid="' + data.user_id + '" data-index="' + data.ring_index + '" role="dialog">';
        chtml += '<div class="modal-dialog">';
        chtml += '<div class="modal-content">';
        chtml += '<div class="modal-body">';
        chtml += '<img class="calling_userimg">';
        chtml += '<img class="calling_userspace" src="/images/guest_16px.png">';
        chtml += '<p class="modalCallMsg"></p>';
        chtml += '<p class="modal_incomingcall">INCOMING CALL</p>';
        chtml += '<p class="modal_callstatus">CONNECTING...</p>';
        chtml += '<audio data-index="' + data.ring_index + '" class="mdCallRingtone call_ringtone_audio" playsinline src="/ringtones/simple_corporate_tone.mp3" controls="controls" loop></audio>';
        chtml += '</div>';
        chtml += '<div class="modal-footer" style="display: block !important;visibility:visible !important;">'
        chtml += '<button class="modalCallCloseBtn" style="display:none" type="button" class="btn btn-danger" data-dismiss="modal">Reject</button>';
        chtml += '<img src="/images/call/hang-up_56px.png" class="modalCallReject" onclick="callRejectBtn(0,this)" class="call-btn">'
        chtml += '<img src="/images/answer_64px.png" class="modalCallAccept" onclick="callAcceptBtn(this)">'
        chtml += '<img src="/images/message_56px.png" class="modalCallTextMsg" onclick="rejectMsgBtn(this)">'
        chtml += '</div>';
        chtml += '</div>';
        chtml += '</div>';
        chtml += '</div>';
        $('#call_ring_container').append(chtml);
        _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
        _this.find('.modal_callstatus').text('RINGING...');
        _this.find('.modalCallAccept').attr('data-str', JSON.stringify(data)); // save data
        _this.find(".modalCallMsg").text(data.rootFullname);
        _this.find('.calling_userimg').attr('src', file_server + "profile-pic/Photos/" + data.rootImg);

        if (data.conversation_type == "personal") {
            _this.find(".modal_incomingcall").text("INCOMING DIRECT CALL");
        } else if (data.conversation_type == "addparticipant") {
            _this.find(".modal_incomingcall").text("INCOMING JOIN CALL");
        } else if (data.conversation_type == "guest") {
            _this.find(".modal_incomingcall").text("INCOMING GUEST CALL (" + data.convname + ")");
        } else {
            _this.find(".modal_incomingcall").text("INCOMING GROUP CALL");
        }
        if (typeof callCleanupLogic == 'function' && window.name == 'calling' && data.user_role == 'guest' && $('.toggle_guest_auto[data-status="auto"]').length > 0) {
            _this.find('.modalCallAccept').click();
        } else if (typeof callCleanupLogic == 'function' && window.name == 'calling' && data.user_role == 'participant' && $('.toggle_participant_auto[data-status="auto"]').length > 0) {
            _this.find('.modalCallAccept').click();
        } else {
            _this.show();
            var aud = _this.find(".call_ringtone_audio")[0];
            aud.currentTime = 0;
            // if (window.location.href.split('/')[3] != 'call') {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function(rstream) {
                    aud.play();
                    rstream.getTracks().forEach(function(track) { track.stop(); });
                })
                // } else {
                // 	aud.play();
                // }

        }
        clean_timer_user();
        timerConf = setTimeout(function() {
            let aud = _this.find(".call_ringtone_audio")[0];
            if (aud) {
                aud.pause();
                aud.currentTime = 0;
            }
            _this.remove();
            clear_push_promise();
            clean_timer_user();
        }, CALL_RING_TIME);

    }
});
socket.on('videoconf_push', function(data) {
    console.log('voip:video_conf_push', data); // alert('ring');
    sendAckInfo(data);
    console.log('push_show');
    if (push_promise == null) {
        // //debugger;
        // Notification.requestPermission();
        // push_promise = new Notification(message.sender_name + " is calling you...", {
        // 	body: "Click to receive the call",
        // 	icon: "/images/users/" + message.sender_img,
        // 	requireInteraction: true,

        // });
        // push_promise.onclick = function (event) {
        // 	event.preventDefault();
        // 	console.log('[sw]:Notification click');
        // 	// //debugger;
        // 	if (message.ring_type == 'new') { openCallWindow(0); }
        // 	socket.emit('call_accept_conf', {
        // 		'user_id': user_id,
        // 		'user_fullname': user_fullname, // new
        // 		'user_img': user_img, // new
        // 		'user_email': user_email,
        // 		'data_conf': message,
        // 	}, function (cb_data) {
        // 		// //debugger;
        // 		if (win_voip) {
        // 			console.log('cb:::' + cb_data.call_url); //alert(cb_data.call_url);
        // 			win_voip.location.href = cb_data.call_url;
        // 		}
        // 	});
        // };

        Push.Permission.request();
        push_promise = Push.create(data.sender_name + " is calling you...", {
            body: "Click to receive the call",
            icon: "/images/users/" + data.sender_img,
            requireInteraction: true,
            tag: 'foo',
            onClick: function() {
                // //debugger;
                if (data.ring_type == 'new') { openCallWindow(0); }
                socket.emit('call_accept_conf', {
                    'user_id': user_id,
                    'user_fullname': user_fullname, // new
                    'user_img': user_img, // new
                    'user_email': user_email,
                    'data_conf': data,
                }, function(cb_data) {
                    // //debugger;
                    if (win_voip) {
                        console.log('cb:::' + cb_data.call_url); //alert(cb_data.call_url);
                        win_voip.location.href = cb_data.call_url;
                    }
                });
            },
        });
    }

});

function get_call_duration(call_duration) {
    var dur_str = '';
    var dur_split = call_duration.split(':');
    if (dur_split[0] != '0') dur_str += dur_split[0] + ' hour ';
    if (dur_split[1] != '0') dur_str += dur_split[1] + ' min ';
    if (dur_split[2] != '0') dur_str += dur_split[2] + ' sec';
    return dur_str;

}
// function draw_call_history(data) {
// 	var html = '';
// 	if (data.call_duration != null && data.call_duration != '') {
// 		html += '<div class="plain_text">In a call for ' + get_call_duration(data.call_duration) + '</div>';
// 	}
// 	else {

// 		if (typeof data.old_msgid != 'undefined' && parseInt(data.old_msgid) == 0) {
// 			if (conversation_type == 'personal') {
// 				html += '<div class="plain_text">Call in progress...</div>';
// 			} else {
// 				html += '<div class="plain_text">Call in progress, please join the call now by clicking the Call icon on top.</div>';
// 			}
// 		}
// 		else {
// 			if (data.call_status == 'message') {
// 				html += '<div class="plain_text">' + data.msg_body + '</div>';
// 			} else {
// 				html += '<div class="plain_text">Missed a call</div>';
// 			}
// 		}
// 	}
// 	return html;
// }
socket.on('newMessageCall', function(data) {
    console.log('newMessage_call', data);
    sendAckInfo(data);
    var ee = $('.msg_id_' + data.msg.old_msgid).find('.msg-time');
    var dd = moment(data.msg.created_at).format('hh:mm a');
    ee.text(dd);
    if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
        if (data.msg.call_duration != null && data.msg.call_duration != '') {
            var dur_str = get_call_duration(data.msg.call_duration);
            $('.msg_id_' + data.msg.old_msgid).find('.plain_text').text('In a call for ' + dur_str);
        } else {
            if (data.msg.call_status == 'message') {
                $('.msg_id_' + data.msg.old_msgid).find('.plain_text').text(data.msg.msg_body);
            } else {
                $('.msg_id_' + data.msg.old_msgid).find('.plain_text').text('Missed a call');
            }
        }
        $('.msg_id_' + data.msg.old_msgid).appendTo("#msg-container");
        if (typeof participants !== 'undefined') {
            forActiveCallIcon(onlineUserList, participants, conversation_type);
        }
    }
});

function sendAcceptInfo(_this) {
    var data = JSON.parse(_this.find('.modalCallAccept').attr('data-str'));
    console.log('voip:Accept_Btn', data); // get data
    if (data.ring_type == 'new') { openCallWindow(0); }

    socket.emit('call_accept_conf', {
        'user_id': user_id,
        'user_fullname': user_fullname, // new
        'user_img': user_img, // new
        'user_email': user_email,
        'data_conf': data,
        // 'session_id': session_id ? session_id : null,
    }, function(cb_data) {
        // //debugger;
        if (win_voip) {
            console.log('cb:::' + cb_data.call_url);
            win_voip.location.href = cb_data.call_url;
        }
    });
    let aud = _this.find(".call_ringtone_audio")[0];
    if (aud) {
        aud.pause();
        aud.currentTime = 0;
    }
    _this.remove();
    clear_push_promise();

    $('#rejectmsgListBackWrap').hide();

}

function callAcceptBtn(element) { // aaa
    // //debugger;
    if (socket.connected) {
        clean_timer_user(); // stop ring timer
        var _this = $(element).closest('.myCallModal');
        var data = JSON.parse(_this.find('.modalCallAccept').attr('data-str'));
        if ((typeof callCleanupLogic == 'function' && window.name == 'calling') && (data.conversation_id != conversation_id)) {
            $('#mypopupcall_div').attr({ 'data-type': 'other_call', 'data-index': data.ring_index }).show();
            $('#mypopupcall_msg').text('Do you want to leave this conversation?');
            _this.hide();
            return;
        } else {
            sendAcceptInfo(_this)
        }
    } else {
        alert('You are not connected.');
    }
}

function sendRejectInfo(_this, msg) {
    var data_conf = JSON.parse(_this.find('.modalCallAccept').attr('data-str'));
    console.log('voip:callReject_Btn', data_conf);

    socket.emit('call_reject_conf', {
        user_id: user_id,
        user_fullname: user_fullname,
        data_conf: data_conf,
        msg: msg,
        call_status: 'rejected',
    }, function(data) {
        let aud = _this.find(".call_ringtone_audio")[0];
        if (aud) {
            aud.pause();
            aud.currentTime = 0;
        }
        _this.remove();
    });

    setCookieCall('reloadstatus', 'newconf', 1);
    $('#rejectmsgListBackWrap').hide();
    closeAllPopUpMsgReject();

}

function callRejectBtn(msg = 0, element) { // call rejected by receiver
    // //debugger;
    if (socket.connected) {
        clean_timer_user();
        if (msg != 0 && rejectMsgBtn_element != null) {
            var _this = $(rejectMsgBtn_element).closest('.myCallModal');
        } else {
            var _this = $(element).closest('.myCallModal');
        }
        sendRejectInfo(_this, msg);

    } else {
        alert('You are not connected.');
    }
};
socket.on('callconf_user_reject', function(data) {
    console.log('voip:callconf_user__reject', data);
    sendAckInfo(data);

    // if($('#memberListBackWrap').is(":visible")){
    $('.forActive[data-uid="' + data.user_id + '"]').text("").attr('data-status', 'no');
    // }


});
socket.on('callconf_selfwaiting_reject', function(data) {
    var aud2 = document.getElementById("mdCallWaitingTone");
    aud2.pause();
    aud2.currentTime = 0;
});
socket.on('callconf_userwaiting_reject', function(data) {
    $('#warningsPopupCall .popup_title').text('Rejected !');
    $('#warningsPopupCall .warningMsg').text(get_msgtextbyId(data.msg, data.user_fullname, data));
    $('#warningsPopupCall').css('display', 'flex');

});
// socket.on('conf_reg_screen', function (data) { // not in use
// 	if (typeof callCleanupLogic == 'function' && window.name == 'calling') {

// 	}

// });
socket.on('conf_hold_msg', function(data) {
    console.log('conf_hold__msg', data);

    $('.onhold_message').hide();
    callwaiting = "no";
});
socket.on('conf_hold_switch', function(data) {
    console.log('conf_hold__switch', data);
    // sessionStorage.setItem("callwaiting", "no");
    callwaiting = "no";
    // participants[name].rtcPeer.processCallWaiting(false);
    $('.onhold_message').hide();


});
// socket.on('conf_reg_switch', function (data) { // not in use
// 	if (typeof callCleanupLogic == 'function' && window.name == 'calling') {


// 	}

// });
socket.on('recv_callwaiting_status', function(data) {
    // if (data.conversation_id == conversation_id) {
    if (data.hold_status) {
        $('.onhold_message[uid="' + data.name + '"]').show();
    } else {
        $('.onhold_message[uid="' + data.name + '"]').hide();
    }
    // }
});

socket.on('android_ring_end', function(data) {
    console.log('voip:android_ring__end', data);
    sendAckInfo(data);
    var _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
    let aud = _this.find(".call_ringtone_audio")[0];
    if (aud) {
        aud.pause();
        aud.currentTime = 0;
    }
    if (_this.length > 0) { _this.remove(); }
    clear_push_promise();

});
socket.on('android_call_end', function(data) {
    console.log('android__call__end', data.user_left);
    sendAckInfo(data);
    // //debugger;
    // if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
    guest_status = 'rejected';
    if (data) {
        if (participants[user_id]) {
            participants[user_id].dispose('ended', data.hangup_id, data.hangup_name, data.msg);
            delete participants[user_id];
        }
        // //debugger;
        if (data.hangup_id == user_id) { // self hangup
            if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
                if (parseInt(data.msg) == 5) {
                    // alert('Connection lost');
                } else {
                    if (close_window == false) {
                        close_window = true;
                    } else {
                        window.close();
                    }
                }
            } else {
                $('#chat_container,#call_container_form,#guest_again_div,#guest_msg_div').hide();
                $('#guest_container_form,#guest_thankyou_div').show();
            }
        } else { // others hangup
            $('#chat_container,#call_container_form,#guest_again_div,#guest_thankyou_div').hide();
            $('#guest_msg_span').html(get_msgtextbyId(data.msg, data.hangup_name, data));
            $('#guest_container_form,#guest_msg_div').show();
        }
        // if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
        // 	$('#guest_thankyou_btn').show();
        // }
        // else {
        // 	$('#guest_thankyou_btn').show();
        // }
        // }
    }
    // }
    clean_timer_user();
    setCookieCall('reloadstatus', 'newconf', 1);
    $('#rejectmsgListBackWrap').hide();
});
socket.on('guest_call_reject', function(data) {
    console.log('guest_call__reject', data);
    // if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
    guest_status = 'rejected';
    if (parseInt(data.msg) == 0) {
        $('#call_container_form,#guest_again_div,#guest_thankyou_div').hide();
        if (data.hangup_name) {
            $('#guest_msg_span').text(data.hangup_name + ' has ended the call.');
        }
        $('#guest_container_form,#guest_msg_div').show();
        closeVideoCall();
    } else {
        $('#call_container_form,#guest_again_div,#guest_thankyou_div').hide();
        $('#guest_msg_span').html(get_msgtextbyId(data.msg, data.hangup_name, data));
        $('#guest_container_form,#guest_msg_div').show();
    }
    // }

    $('#rejectmsgListBackWrap').hide();

});
socket.on('android_call_join', function(data) {
    console.log('socket:android_call__join');
    sendAckInfo(data);
    clean_timer_user();
});
socket.on('android_receiver_join', function(data) {
    sendAckInfo(data);

});
socket.on('send_accept_conf', (data) => {
    // alert('accept');
    sendAckInfo(data);
    console.log('qq:send__accept__conf', data);
    // //debugger;
    let _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
    let aud = _this.find(".call_ringtone_audio")[0];
    if (aud) {
        aud.pause();
        aud.currentTime = 0;
    }

    if (_this.length > 0) { _this.remove(); }
    clear_push_promise();
});
socket.on('call_reject_recv', function(data) {
    sendAckInfo(data);
    console.log('call_reject__recv', data);
    guest_status = 'rejected';
    var _this = $('.myCallModal[data-index="' + data.ring_index + '"]');
    let aud = _this.find(".call_ringtone_audio")[0];
    if (aud) {
        aud.pause();
        aud.currentTime = 0;
    }
    if (_this.length > 0) { _this.remove(); }
    clear_push_promise();
});
socket.on('guest_call_timeout', function(data) {
    console.log('guest_call__timeout', data);
    sendAckInfo(data);
    if (data.guestId == user_id) {
        guest_status = 'rejected';

        $('#call_container_form').hide();
        $('#guest_container_form').show();
        $('#guest_thankyou_div').hide();
        $('#guest_msg_div').hide();
        $('#guest_again_span').text('Sorry! Nobody is answering your call now. Please try again a little later.');
        $('#guest_again_div').show();
    } else {

    }

    $('#rejectmsgListBackWrap').hide();
});

socket.on('last_calling_data', function(data) {
    console.log('last_calling_data', data);
});

// var calling_data_invite = localStorage.getItem("calling.data.invite");
// if (calling_data_invite == null) calling_data_invite = [];
// else calling_data_invite = JSON.parse(calling_data_invite);

// for (let i = 0; i < calling_data_invite.length; i++) {
// 	let call_li_add = $('#connectAsideContainer #conv' + calling_data_invite[i]); // unblink running conversation
// 	if (call_li_add.length) { // conversation found
// 		call_li_add.children('span:first').addClass('animate-flicker-call').addClass('audio').addClass('call').addClass('running');
// 		call_li_add.find('.sidebartooltipcall').css("display", "block");
// 	}
// }

socket.on('call_stats_add', function(data) {
    console.log('call_stats__add', data);
    // //debugger;
    // if (data.conversation_init == "personal") {
    var call_li_grp = $('#connectAsideContainer #conv' + data.conversation_id); // blink running conversation
    if (call_li_grp.length) {
        call_li_grp.children('span:first').addClass('animate-flicker-call').addClass('audio').addClass('call').addClass('running');
        call_li_grp.find('.sidebartooltipcall').css("display", "block");
    }

    if (data.conversation_id == conversation_id) { // If selected currently
        $('.video-call,.voice-call').hide();
        $('.join-call').show();
    }

    // let calling_data_invite = localStorage.getItem("calling.data.invite");
    // if (calling_data_invite == null) calling_data_invite = [];
    // else calling_data_invite = JSON.parse(calling_data_invite);

    // calling_data_invite.push(data.conversation_id);
    // localStorage.setItem('calling.data.invite', JSON.stringify(calling_data_invite));

    // }

});
socket.on('call_stats_server', function(data) {
    console.log('call__stats__server', data);
    // =================  1.flick + 2.tooltip + 3. a/v/join icons  ========================================
    if (data.call_option == 'window' && data.conversation_id == data.user_id) { // personal window
        var call_li_personal = $('#connectAsideContainer ul.side_bar_list_item li[data-id="' + data.user_id + '"]');
        if (call_li_personal.length) { // flick + tooltip
            call_li_personal.children('span:first').addClass('animate-flicker-call').addClass('audio').addClass('call').addClass('running');
            call_li_personal.find('.sidebartooltipcall').css("display", "block");
        }
        if ($(call_li_personal).hasClass('selected')) { // audio/video/join icon
            $('.video-call,.voice-call').hide();
            $('.join-call').show();
        }
    } else { // other window
        var call_li_grp = $('#connectAsideContainer #conv' + data.conversation_id); // blink running conversation
        if (call_li_grp.length) { // flick + tooltip
            call_li_grp.children('span:first').addClass('animate-flicker-call').addClass('audio').addClass('call').addClass('running');
            call_li_grp.find('.sidebartooltipcall').css("display", "block");
        }
        if (data.conversation_id == conversation_id) { // audio/video/join icon
            $('.video-call,.voice-call').hide();
            $('.join-call').show();
        }
        // let calling_data_invite = localStorage.getItem("calling.data.invite");
        // if (calling_data_invite == null) calling_data_invite = [];
        // else calling_data_invite = JSON.parse(calling_data_invite);

        // calling_data_invite.push(data.conversation_id);
        // localStorage.setItem('calling.data.invite', JSON.stringify(calling_data_invite));
    }
    // ================== 4. change text based on msg_id ==========================================
    if (data.conversation_init == 'personal') {
        $('.msg_id_' + data.msg_id).find('.plain_text').text('Call in progress...');
    } else {
        $('.msg_id_' + data.msg_id).find('.plain_text').text('Call in progress, please join the call now by clicking the Call icon on top.');
    }
    // ================= 5. show my profile calling icon if my call running ===========================
    if (data.user_id == user_id) {
        if (data.call_type_route == 'video') {
            $('#profile_video_call').show();
            $('#profile_audio_call').hide();
        } else {
            $('#profile_video_call').hide();
            $('#profile_audio_call').show();
        }
    }

});
socket.on('call_stats_stop', function(data) {
    console.log('call__stats__stop', data);
    // 1. flick, 2.tooltip, 3.a/v/join icons remove ====================================================
    if (data.call_option == 'window' && data.conversation_id == data.user_id) { // personal window
        var call_li_personal = $('#connectAsideContainer ul.side_bar_list_item li[data-id="' + data.user_id + '"]');
        if (call_li_personal.length) { // personal window conversation found
            call_li_personal.children('span:first').removeClass('animate-flicker-call').removeClass('audio').removeClass('video').removeClass('call').removeClass('running');
            call_li_personal.find('.sidebartooltipcall').css("display", "none");
        }
        if ($(call_li_personal).hasClass('selected')) {
            $('.video-call,.voice-call').show();
            $('.join-call').hide();
        }
    } else { // conversation window
        if (data.ulist == false) {
            // //debugger;
            var call_li_grp = $('#connectAsideContainer #conv' + data.conversation_id); // unblink running conversation
            if (call_li_grp.length) { // conversation found
                call_li_grp.children('span:first').removeClass('animate-flicker-call').removeClass('audio').removeClass('video').removeClass('call').removeClass('running');
                call_li_grp.find('.sidebartooltipcall').css("display", "none");
            }
            if (data.conversation_id == conversation_id) { // selected
                $('.video-call,.voice-call').show();
                $('.join-call').hide();
                // if (data.conv_run == true || data.user_run == true) {
                // 	$('.video-call,.voice-call').hide();
                // 	$('.join-call').show();
                // } else {
                // 	$('.video-call,.voice-call').show();
                // 	$('.join-call').hide();
                // }
            }
            for (let i = 0; i < data.conversation_list.length; i++) {
                let call_li_add = $('#connectAsideContainer #conv' + data.conversation_list[i]); // unblink running conversation
                if (call_li_add.length) { // conversation found
                    call_li_add.children('span:first').removeClass('animate-flicker-call').removeClass('audio').removeClass('video').removeClass('call').removeClass('running');
                    call_li_add.find('.sidebartooltipcall').css("display", "none");
                }
                if (data.conversation_list[i] == conversation_id) {
                    $('.video-call,.voice-call').show();
                    $('.join-call').hide();
                }
            }
        }
    }
    if (data.user_id == user_id) { // hide my profile calling icon if not running 
        $('#profile_video_call').hide();
        $('#profile_audio_call').hide();
        // console.log('call__stats__stop', data.user_id);
    }
    // $('.switch-this-call[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"]').hide();
    // -------------------------------- new 

    if (data.room_info) {
        if (data.conversation_init == 'personal') {
            $('.msg_id_' + data.room_info.msg_id).find('.plain_text').text('Call in progress...');
        } else {
            $('.msg_id_' + data.room_info.msg_id).find('.plain_text').text('Call in progress, please join the call now by clicking the Call icon on top.');
        }
    }
});

socket.on('disconnect', function() {
    console.log('xyz:socket:disconnect');
    $('.video-call,.voice-call').show();
    $('.join-call').hide();
    $('#profile_video_call').hide();
    $('#profile_audio_call').hide();
    $('#connectAsideContainer ul.side_bar_list_item li > span:first-child').removeClass('audio').removeClass('video').removeClass('call').removeClass('running').removeClass('animate-flicker-call');

});


socket.on('voip_connection_ok', function(data) {
    clean_timer_user();
});

socket.on('redis_flushed', function(data) {
    console.log('redis_flushed');
});

socket.on('service_worker_change', function(data) {
    console.log('service_worker__change', data);
    updateServiceWorker();
});
socket.on('send_switch_user_conf', function(data) {
    if (data.name == user_id) {
        if (data.video_status == 'video') {
            $('#profile_video_call').show();
            $('#profile_audio_call').hide();
        } else {
            $('#profile_video_call').hide();
            $('#profile_audio_call').show();

        }
    }
});

function update_conv_counter() {
    // console.log(x: number)
}

// socket listener end ------------------------------------------------

function focusVideoCall() {
    clean_timer_user();
    var ww = screen.availWidth * 0.8;
    var hh = screen.availHeight * 0.8;
    var left = (screen.width / 2) - (ww / 2);
    var top = (screen.height / 2) - (hh / 2);
    win_voip = window.open("", "calling", "width=" + ww + ",height=" + hh + ', top=' + top + ', left=' + left);

}

function goto_callingWindow() {
    $('body')[0].style.setProperty('background', '#000', 'important');
    $('.main-container').show();
    $('.iframe_parent').hide();
    redrawConf();
}

function goParentWindow() {
    // var goBack = window.open('', 'parent');
    // goBack.focus();
    $('body')[0].style.setProperty('background', '#fff', 'important');
    $('.main-container').hide();
    $('.iframe_parent').show();
}
if (window.location.href.split('/')[3] != 'call') {
    // window.name = 'parent';
}
socket.on('call_user_left', function(data) {
    console.log('call_user_left', data.user_left);
    if (data.user_left > 0) {
        $('#rejoin_call_btn').show();
        $('#close_call_btn').show();

    } else {
        $('#rejoin_call_btn').hide();
        $('#close_call_btn').show();

    }
    $('#rejoin_call_div').show();
});

// setTimeout(function () {
// 	var t = performance.timing;
// 	console.log('timing::Network latency:', t.responseEnd - t.fetchStart);
// 	console.log('timing::page load:', t.loadEventEnd - t.responseEnd);
// 	console.log('timing::whole process:', t.loadEventEnd - t.navigationStart);
// }, 10000);

console.log('swc44');