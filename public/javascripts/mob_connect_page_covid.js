var all_current_sms = [];
var fileSizeStore = [];
var allTempEmailAddress = [];
var filedata = [],
    audiofile = [],
    videofile = [],
    imgfile = [],
    otherfile = [];
allfiles = [];
var thread_id = "";
var to = "";
var thread_root_id = "";
var swap_conversation_id = "";
var conversation_id = "";
var drawmsgtype = 'old';
var viewchecklisttype = 'count';
// var adminArra = [];
var roomTitle = "";
var privacy = "";
var keySpace = "";
var attachFileList = [];
var msgIdsFtag = [];
var formDataTemp = [];
var urrm_pn = [];
var need_todo_details = [];
var loaderEndTime;
var recentEmo = [];
var checkedList = {};
var totalTagListTitleCon = [];
var user_id_to_img = {};
var userlistWithname = {};
var allUserTagList = [];
var alldeletemsgid = [];
var tempAttachmentTag = [];
var thisroomTagList = [];
var business_unitChangename = '';
var activeConvPrivacy = '';
var allconvissuetag = [];
var updatedMsgArr = [];
var per_conv_all_files = [];
var allrepData = [];
var allmyUnreadThread = [];

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
var hasurlTemp = 1;
var foundUrlTemp = '';
var blockUrlPreview = true;
var mentionUsers = [];
// var allteams = [];
var activeSound = [];
var all_user_string_tag = [];
var deletedMessages = [];

$(function() {
    socket.emit('getAllmydeletemessage', user_id, function(res) {
        if (res.status) {
            deletedMessages = [];
            if (res.data.length > 0) {
                $.each(res.data, function(k, v) {
                    deletedMessages.push(v.delete_id);
                })
            }
        }
    })
});

function checkguestMsg(data) {
    if (data.sender != user_id) {
        if (has_permission(user_id, GUEST)) {
            if (has_permission(user_id, ALL_MESSAGE)) {
                if (has_permission(user_id, MENTION_MESSAGE)) {
                    if (data.msg_body.indexOf(user_id) == -1) {
                        return false;
                    }
                }
            } else {
                if (has_permission(user_id, MESSAGE_AFTER_JOINED)) {
                    if (moment(data.created_at).unix() < moment(findObjForUser(user_id).createdat).unix()) {
                        return false;
                    } else {
                        if (has_permission(user_id, MENTION_MESSAGE)) {
                            if (data.msg_body.indexOf(user_id) == -1) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

socket.on('conv_files_deleted', function(data) {
    if (per_conv_all_files[0].conversation_id == data.conv_id) {
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (per_conv_all_files[i].key == data.key) {
                per_conv_all_files[i].is_delete = 1;
                var divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                $('.' + divkeyclass).html('<p style="font-size:16px; color:#F00; padding:30px;word-break: break-word;"></p>');
            }
        }
    }
});

socket.on('conv_files_added', function(data) {
    // console.log(91,data);
    if (per_conv_all_files[0].conversation_id == data[0].conversation_id) {
        per_conv_all_files = data;
    }
});


// var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
// $.each(user_list, function (k, v) {
// 	user_id_to_img[v.id] = v.img;
// 	userlistWithname[v.id] = v.fullname;
// });


function bytesToSize2(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    var size = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    return size;
}


function settunePopup() {
    $('#more_options_chat').hide();
    $('#setTunePopup').css('display', 'flex')
    socket.emit('getAllNotificationSound', { user_id: user_id }, function(res) {
        if (res.status) {
            $("#tuneList").html('');
            if (res.sounds.length > 0) {
                $.each(res.sounds, function(k, v) {
                    // console.log(k,v);
                    var html = '';

                    if (activeSound.length > 0) {
                        $.each(activeSound, function(ka, va) {
                            if (va.conv == conversation_id && v.location == va.location) {
                                $('#setTunePopup').attr('data-title', va.location);

                                html = '<div class="eachTune selected" data-type="notification" data-title="' + v.location + '" data-status="1" onclick="selectTune(this)">' +
                                    '<div class="tune_info">' +
                                    '<h2 class="tune_title name">' + v.originalname + '</h2>' +
                                    '<span class="invite_btn"></span>' +
                                    '</div>' +
                                    '</div>';
                            } else {
                                html = '<div class="eachTune" data-type="notification" data-title="' + v.location + '" data-status="0" onclick="selectTune(this)">' +
                                    '<div class="tune_info">' +
                                    '<h2 class="tune_title name">' + v.originalname + '</h2>' +
                                    '<span class="invite_btn"></span>' +
                                    '</div>' +
                                    '</div>';
                            }
                        });
                    } else {
                        html = '<div class="eachTune" data-type="notification" data-title="' + v.location + '" data-status="0" onclick="selectTune(this)">' +
                            '<div class="tune_info">' +
                            '<h2 class="tune_title name">' + v.originalname + '</h2>' +
                            '<span class="invite_btn"></span>' +
                            '</div>' +
                            '</div>';
                    }

                    $("#tuneList").append(html);
                });
            } else {
                // $("#setNotify").hide();
            }
        }
    });
}

function selectTune(el) {
    if ($(el).hasClass('selected')) {
        $(el).removeClass('selected');
    } else {
        $('.eachTune').removeClass('selected');
        $(el).addClass('selected');
    }
}

function getNotificationSound() {
    var data = {
        user_id: user_id
    }

    socket.emit('getNotificationSound', data, function(res) {
        if (res.status) {
            if (res.result[0] != undefined) {
                activeSound = [];
                $('#notifyAudioContainer').html('');
                var html = '<audio id="notifyAudio" style="display:none">' +
                    '<source src="' + file_server + 'notification/Music/short_tone.mp3" type="audio/mp3">' +
                    'Your browser does not support the audio element.' +
                    '</audio>';
                $('#notifyAudioContainer').html(html);
                // console.log(333333333, res.result)
                $.each(res.result, function(k, v) {
                    var file_ext = v.tune_title.split('.').pop().toLowerCase();
                    if (v.status == 1) {
                        activeSound.push({ conv: v.conversation_id, location: v.tune_title, status: v.status });
                        var html = '<audio id="notifyAudio_' + v.conversation_id + '" style="display:none">' +
                            '<source src="' + v.tune_title + '" type="audio/' + file_ext + '">' +
                            'Your browser does not support the audio element.' +
                            '</audio>';
                        $('#notifyAudioContainer').append(html);
                    }
                });
            } else {
                var html = '<audio id="notifyAudio" style="display:none">' +
                    '<source src="' + file_server + 'notification/Music/short_tone.mp3" type="audio/mp3">' +
                    'Your browser does not support the audio element.' +
                    '</audio>';
                $('#notifyAudioContainer').html(html);
            }
        }
    })
}

getNotificationSound();

function setAsNotify(elm) {
    var status = '';
    var type = 'notification';
    var tune_title = '';
    if ($('.eachTune.selected').length == 0) {
        status = 0;
        tune_title = $('.eachTune[data-status="1"]').attr('data-title');
    } else {
        status = 1;
        tune_title = $('.eachTune.selected').attr('data-title');
    }
    var data = {
        user_id: user_id,
        conversation_id: conversation_id,
        type: type,
        tune_title: tune_title,
        status: status
    }

    if ($('#setTunePopup').attr('data-title') != $('.eachTune.selected').attr('data-title')) {
        socket.emit('setAsNotification', data, function(res) {
            if (res.status) {
                $('#setTunePopup').hide();
                getNotificationSound();
            }
        })
    } else {
        $('#setTunePopup').hide();
    }

}


function playNotification(id) {
    var ids = 'notifyAudio_' + id;
    var playDefault = document.getElementById("notifyAudio");

    if ($('#' + ids).length == 1) {
        var playS = document.getElementById(ids);
        playS.play();
        console.log('Played Dynamic Tune..')
    } else {
        console.log('Played default Tune..')
        playDefault.play();
    }
}


var PVM = false;

function scrollToBottom(target, delay = 800) {
    // $(target).animate({ scrollTop: $(target).prop("scrollHeight") }, delay);
};

// function checkdrawmsg(data,adminlist,privacy){
// 	if(activeConvPrivacy == 'protected'){
// 		if(data.sender == user_id || adminlist.indexOf(user_id) > -1){
// 			return true;
// 		}else{
// 			return false;
// 		}
// 	}else{
// 		return true;
// 	}

// }

function checkdrawmsg(data, adminlist, privacy) {
    if (activeConvPrivacy == 'protected') {
        var msg_service_provider = [];
        if (data.service_provider != null && data.service_provider != undefined) {
            msg_service_provider = data.service_provider
        }
        var msg_assignusers = [];

        if (data.assign_to != null && data.assign_to != undefined) {
            msg_assignusers = data.assign_to;
        }
        var msg_type = '';
        if (data.msg_type != null) {
            msg_type = data.msg_type;
        }

        if (data.sender == user_id || adminlist.indexOf(user_id) > -1 || msg_service_provider.indexOf(user_id) > -1 || msg_assignusers.indexOf(user_id) || msg_type == 'welcome') {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }

}

function checklistView() {
    // $.each(allUserTagList,function(k,v){
    // 	$('.tag_name_view_'+v.tag_id).text(v.title);
    // });

    $.each(allUserTagList, function(k, v) {
        // console.log(111, k, v);
        var st = '';
        if (v.shared_tag != null) {
            st = ' shared_tag_user ';
            if (v.shared_tag !== user_id) {
                st = st + ' others_userTag ';
            }
        }
        if (v.tag_type == 'public') {
            var color = (v.tag_color != null ? v.tag_color : '');
            $('.tag_name_view_' + v.tag_id).text(v.title)
            $('.tag_name_view_' + v.tag_id).addClass('_public_tag');
            $('.tag_name_view_' + v.tag_id).css('background-color', color);
            // newHtml += '<span class="single_tag _public_tag tag_name_view_'+v.tag_id+'"  style="'+(v.tag_color != null ? 'background-color:'+v.tag_color+'':'')+'" data-id="'+v.tag_id+'" onclick="//removeThisTag(event)">'+v.title+'</span>';
        } else {
            var color = (v.tag_color != null ? v.tag_color : '');
            $('.tag_name_view_' + v.tag_id).text(v.title)
            $('.tag_name_view_' + v.tag_id).addClass(st);

            // newHtml += '<span class="single_tag tag_name_view_'+v.tag_id+st+'" data-id="'+v.tag_id+'" onclick="//removeThisTag(event)">'+v.title+'</span>';
        }
    });
}

// $(function(){	
// 	socket.emit('getCompanyTag',{user_id:user_id,company_id:company_id},function(res){
// 		if(res.status){
// 			allUserTagList = res.data;
// 			checklistView();
// 		}else{
// 			console.log(res);
// 		}
// 	});
// });

// function getAllUserTag(){
// 	socket.emit('getCompanyTag',{user_id:user_id,company_id:company_id},function(res){
// 		if(res.status){
// 			allUserTagList = res.data;
// 			// $.each(allUserTagList,function(k,v){
// 			// 	$('#filterUserTag').append('<div class="tag_list filter_tag_'+v.tag_id+'" onclick="filterThis(this)" tag-id="'+v.tag_id+'">'+v.title+'</div>')
// 			// })

// 			console.log(999, res.data);
// 			checklistView();
// 		}else{
// 			console.log(res);
// 		}
// 	});
// }

// getAllUserTag();

var isURL = (str) => {
    var url_pattern = new RegExp("(www.|http://|https://|ftp://)\w*");
    if (!url_pattern.test(str)) {
        return false;
    } else {
        if (str.indexOf(file_server + 'emoji/hv') > -1) return false;
        else return true;
    }
}

var convert = (str) => {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var text1 = str.replace(exp, "<a target='_blank' href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
}

var count_no_of_attch = (data) => {
    var count = 0;
    count += (data.attch_imgfile === null) ? 0 : data.attch_imgfile.length;
    count += (data.attch_videofile === null) ? 0 : data.attch_videofile.length;
    count += (data.attch_audiofile === null) ? 0 : data.attch_audiofile.length;
    count += (data.attch_otherfile === null) ? 0 : data.attch_otherfile.length;
    return count;
}

var draw_urhr = () => {
    $("#msg-container").find('.msg-separetor-unread').remove();
    var html = '<div class="msg-separetor-unread mid_mg_sep" data-length="1" ><p>1 new message</p></div>';
    $("#msg-container").prepend(html);
}

var find_urhr_add_s = (nour) => {
    $("#msg-container").find('.msg-separetor-unread>p').html(nour + ' new messages');
    $("#msg-container").find('.msg-separetor-unread').attr('data-length', nour);
}

function draw_call_history(data) {
    var html = '';
    if (data.call_duration != null && data.call_duration != '') {
        html += '<div class="plain_text">In a call for ' + get_call_duration(data.call_duration) + '</div>';
    } else {

        if (typeof data.old_msgid != 'undefined' && parseInt(data.old_msgid) == 0) {
            if (conversation_type == 'single') {
                html += '<div class="plain_text">Call in progress...</div>';
            } else {
                html += '<div class="plain_text">Call in progress, please join the call now by clicking the Call icon on top.</div>';
            }
        } else {
            if (data.call_status == 'message') {
                html += '<div class="plain_text">' + data.msg_body + '</div>';
            } else {
                html += '<div class="plain_text">Missed a call</div>';
            }
        }
    }
    return html;
}
var draw_msg = (data, append = true) => {
    if (data.conversation_id !== conversation_id) {
        return false;
    }

    all_user_string_tag[data.msg_id] = data.user_tag_string;
    var thisStatus = false;
    if (conversation_type == 'group') {
        if (data.sender.toString() == user_id) {
            thisStatus = true;
        } else {
            if (adminArra.indexOf(user_id) > -1) {
                thisStatus = true;
            }
        }
    } else {
        thisStatus = true;
    }

    var dataAssign = '';

    if (data.assign_to == null || data.assign_to == undefined) {
        data.assign_to = [];
    }

    if (data.assign_to.length > 0) {
        var design = '<span class="secret_heading" data-id="' + data.assign_to.join(',') + '">Assign to ';
        $.each(data.assign_to, function(k, v) {
            if (k == 0) {
                design += '<span> ' + findObjForUser(v).fullname + ' </span>';
            } else {
                if (data.assign_to.length == (k + 1)) {
                    design += ' & <span>' + findObjForUser(v).fullname + ' </span>';
                } else {
                    design += '<span>, ' + findObjForUser(v).fullname + ' </span>';
                }
            }
        })
        design += '</span>';
        dataAssign += design;
    }

    var secretUserPerMsg = data.secret_user;
    if (data.secret_user != null && data.secret_user != undefined) {
        if (data.secret_user.length > 0) {
            if (data.secret_user.indexOf(user_id) == -1) {
                return false;
            }
        }
    } else {
        secretUserPerMsg = [];
    }


    var end_timer = null;
    // if(data.has_timer !== null){
    // 	if(data.has_timer > new moment().unix()){
    // 		end_timer = moment.unix(data.has_timer).format("hh:mm A");
    // 	}else{
    // 		return;
    // 	}
    // }
    $('.user_msg.msg_id_' + data.msg_id).remove(); // sujon

    var attach_show = true,
        deletebtn_active = true,
        permanently = false;


    if (data.has_hide !== null && data.has_hide !== undefined) {
        if (data.has_hide.indexOf(user_id) > -1) {
            return false;
        }
    }

    var has_title = findObjForUser(data.sender).fullname;
    if (data.sender == user_id) {
        has_title = "You";
    }
    var hasDelete = false;

    if (data.has_delete != null && data.has_delete != undefined) {
        if (data.has_delete.indexOf('delete_for_all') > -1) {
            hasDelete = true;
            if (data.msg_type == 'checklist') {
                data.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> "' + data.msg_body + '" Checklist has been deleted by  ' + has_title + '</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
            } else {
                data.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> ' + has_title + ' deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
            }
        } else if (data.has_delete.indexOf(user_id) > -1) {
            hasDelete = true;
            if (data.msg_type == 'checklist') {
                data.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> "' + data.msg_body + '" Checklist has been deleted by  ' + has_title + '</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
            } else {
                data.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
            }
        }
    }
    data.hasDelete = hasDelete;
    var msgdeleteClass = ''
    if (hasDelete) {
        msgdeleteClass = 'deleted'
    }

    if (secretUserPerMsg.length > 0) {
        msgdeleteClass = msgdeleteClass + ' secret_message_found'
    }

    /* Start Date Group By */
    var msg_date = moment(data.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
        sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
    });
    var temp_date = msg_date;

    if (append) {
        $.each($('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                msg_date = null;
                return 0;
            }
        });
        if (msg_date !== null && $('.msg-separetor-unread').length == 0) {
            var date_html = '<div class="msg-separetor mid_mg_sep" data-date="' + msg_date + '"><span>' + msg_date + '</span></div>';
            $("#msg-container").append(date_html);
        }
    }
    /* End Date Group By */

    if (data.msg_type == 'call') {
        var html = '<div class="user_msg msg_id_' + data.msg_id + ' ' + msgdeleteClass + ' ' + (data.msg_type == 'notification' ? 'notify_msg' : '') + '" data-msgbody="' + data.msg_body.toString() + '" flaged-data="' + ((data.has_flagged != null) ? data.has_flagged : '') + '" id="msgid_' + data.msg_id + '" msg-type="' + data.msg_type + '" data-msgid="' + data.msg_id + '" data-sendername="' + data.sender_name + '" data-senderId="' + data.sender + '" data-senderimg="' + data.sender_img + '">';
    } else {
        var html = '<div class="user_msg msg_id_' + data.msg_id + ' ' + msgdeleteClass + ' ' + (data.msg_type == 'notification' ? 'notify_msg' : '') + ' ' + (data.msg_body == 'Converted Checklist' ? 'converted' : '') + ' ' + (thisStatus ? 'EditableClass ' : 'ReadonlyCladd ') + '" data-msgbody="' + (data.msg_type == 'checklist' ? (hasDelete ? '' : data.msg_body.toString()) : '') + '" flaged-data="' + ((data.has_flagged != null) ? data.has_flagged : '') + '" id="msgid_' + data.msg_id + '" msg-type="' + data.msg_type + '" data-msgid="' + data.msg_id + '" data-sendername="' + data.sender_name + '" data-senderId="' + data.sender + '" data-senderimg="' + data.sender_img + '" data-msg-date="' + ((data.old_created_time == null) ? data.created_at : data.old_created_time) + '">';
        if (data.msg_type == 'checklist') {
            html += '<div class="checklistMsg_head">';
            html += '<h3><img src="/images/basicAssets/BackArrow.svg" alt="" onclick="cancelEditAction(this,\'' + data.msg_id + '\')">';
            html += ' <span class="viewFileThread" id="viewFileThreadId" onclick="viewThreadFiles(event,this)">Checklist</span></h3>';
            html += '<span class="tooltipmsg">';
            html += '<img class="thread-close" src="/images/basicAssets/close_button.svg" alt="" onclick="cancelEditAction(this,\'' + data.msg_id + '\')">';
            html += '</span>';
            html += '</div>';
        }
    }

    html += '<span class="checked_msg"></span>';

    if (data.sender_name == $('.conv_title.converstaion_name').text()) {
        if (conversation_type == 'group') {
            if (data.msg_type == 'notification') {
                html += '<div class="user_img"><img src="' + file_server + 'profile-pic/Photos/msg_notification.svg" alt=""></div>';
            } else {
                html += '<div class="user_img"><img src="' + file_server + 'room-images-uploads/Photos/' + room_img + '" alt=""></div>';
            }
        } else {
            html += '<div class="user_img"><img src="' + file_server + 'profile-pic/Photos/' + user_id_to_img[data.sender] + '" alt="' + user_id_to_img[data.sender] + '"></div>';
        }
    } else {
        if (data.msg_type == 'notification') {
            html += '<div class="user_img"><img src="' + file_server + 'profile-pic/Photos/msg_notification.svg" alt="msg_notification.svg"></div>';
        } else {
            html += '<div class="user_img"><img src="' + file_server + 'profile-pic/Photos/' + user_id_to_img[data.sender] + '" alt="' + user_id_to_img[data.sender] + '"></div>';
        }
    }
    html += '<div class="msg_section">';
    // html += '<div class="user_info_sec" style="display:'+(data.msg_type == 'notification'?'none':'')+'">';
    html += '<div class="user_info_sec">';
    if (data.forward_by != null) {
        html += '<div class="user_name">' + (data.msg_type == 'notification' ? 'WorkFreelibots' : findObjForUser(data.forward_by).fullname) + '</div>';
    } else {
        html += '<div class="user_name">' + (data.msg_type == 'notification' ? 'WorkFreelibots' : data.sender_name) + '</div>';
    }

    // html += '<div class="msg_time">'+ moment(data.created_at).format('h:mm a') +'</div>';

    if (data.edit_status != null) {
        // html += '<span class="msg_time" >'+moment(Number(data.edit_status)).format('h:mm a')+'</span>';
        if (data.msg_type == 'checklist') {
            html += '<span class="msg_time" >' + 'Created on ' + moment(data.created_at).format('DD-MM-YYYY hh:mm a') + '</span>';
        } else {
            html += '<span class="msg_time" >' + moment(Number(data.edit_status)).format('h:mm a') + '</span>';
        }
    } else {
        html += '<span class="msg_time" >' + ((data.old_created_time != null) ? 'Created on ' + moment(data.old_created_time).format('DD-MM-YYYY hh:mm a') : moment(data.created_at).format('h:mm a')) + '</span>';
    }

    // if(data.sender == user_id){
    // 	console.log(575, end_timer)
    // 	if(end_timer !== null){
    // 		console.log(577, end_timer)
    // 		html += '<span class="msg-timer timer_msg active" data-value="'+data.has_timer+'" ></span>';
    // 		html += '<span class="remove-timer" onclick="removeMsgTimer(this)" data-msg-id="'+data.msg_id+'">Remove</span>';
    // 	}
    // }else{
    // 	if(end_timer !== null)
    // 		html += '<span class="msg-timer timer_msg" data-value="'+data.has_timer+'"></span>';
    // }

    // html += '<span class="_assign_to_'+data.msg_id+'">'
    // if(dataAssign != ''){
    // 	html +='&nbsp;'+dataAssign
    // }
    // html += '</span>';

    if (data.forward_by != null) {
        html += '<p class="forwarded_text">Forwarded</p>';
    }
    // Sms seen unseen
    var delete_both_side = 0;


    if (data.msg_type == 'checklist') {
        html += '<span class="msg-send-seen-delivered">' + (thisStatus ? '- Editable' : '- Readonly') + '';
        html += '</span>';
    } else {
        html += '<span class="msg-send-seen-delivered">';
        if ((data.conversation_id != user_id && data.sender == user_id) || data.forward_by == user_id) {

            if (data.message_pending != undefined) {
                html += ' - Sent';
            } else {
                delete_both_side = 0;
                html += ' - Delivered';
            }
        }
        html += '</span>';
    }

    html += '<div class="msg_flag">';
    // Check flag and unflag message
    if (data.has_flagged != null && (data.has_flagged).indexOf(user_id) != -1) {
        html += '<img class="flaged_icon" onclick="flaggedUserMsg(event)" src="/images/basicAssets/Flagged.svg">';
    }
    html += '</div>';
    html += '</div>';


    removeA(secretUserPerMsg, user_id);
    if (secretUserPerMsg.length > 0) {
        if (data.sender == user_id) {
            html += '<span class="secret_heading" style="line-height: unset;margin: 3px 0 !important;display: inline-block;" data-id="' + secretUserPerMsg.join(',') + '">Private message to: ';
            $.each(secretUserPerMsg, function(k, v) {
                if (v !== user_id) {
                    if (k == 0) {
                        html += '<span> ' + findObjForUser(v).fullname + ' </span>';
                    } else {
                        if (secretUserPerMsg.length == (k + 1)) {
                            html += ' & <span>' + findObjForUser(v).fullname + ' </span>';
                        } else {
                            html += '<span>, ' + findObjForUser(v).fullname + ' </span>';
                        }
                    }
                }
            });
            html += '</span>';
        } else {
            html += '<span class="secret_heading" style="line-height: unset;margin: 3px 0 !important;display: inline-block;" data-id="' + secretUserPerMsg.join(',') + '">Private message </span>';
        }
    }

    html += '<div class="msg_body plain_text" class="data_msg_body' + data.msg_id + '">';
    /*========================== MSG TEXT BODY =======================================*/
    var multi_type_file = 0;
    if (data.attch_imgfile === null || data.attch_imgfile.length == 0)
        data.attch_imgfile = [];
    else multi_type_file = data.attch_imgfile.length;
    if (data.attch_videofile === null || data.attch_videofile.length == 0)
        data.attch_videofile = [];
    else multi_type_file += data.attch_videofile.length;
    if (data.attch_audiofile === null || data.attch_audiofile.length == 0)
        data.attch_audiofile = [];
    else multi_type_file++;
    if (data.attch_otherfile === null || data.attch_otherfile.length == 0)
        data.attch_otherfile = [];
    else multi_type_file++;

    var isiturl = isURL(data.msg_body);
    // if (data.msg_body == 'No Comments'){
    // 	html += '<div id="data_msg_body'+data.msg_id+'" class="mainMsgtext">' + data.msg_body + '</div>';
    // } else 
    if (data.msg_type == 'todo') {
        html += draw_todo_share(data);
        need_todo_details.push(data.activity_id);
    } else if (data.msg_type == 'call') {
        html += draw_call_history(data);
    }
    // else if(isiturl){
    // html += '<p class="has_url" data-date="'+ data.created_at +'">' + data.msg_body;
    // if(data.url_title != null){
    // 	html += per_msg_url_attachment(data.url_base_title, data.url_title, data.url_body, data.url_image, data.url_favicon);
    // }
    // html += '</p>';
    else if (isiturl && data.msg_type != 'checklist') {
        if (data.edit_history != null) {
            if (data.hasDelete) {
                html += '<div class="mainMsgtext" id="data_msg_body' + data.msg_id + '">' + data.msg_body + '</div>';
            } else {
                html += returnedithistoryDesign(data.edit_history, data, 'mainMsgtext');
            }
        } else {
            html += '<div id="data_msg_body' + data.msg_id + '" class="has_url mainMsgtext " data-date="' + data.created_at + '">' + data.msg_body;
            if (data.url_title != null) {
                var htmlObject = document.createElement('div');
                htmlObject.innerHTML = data.msg_body;
                var url = $(htmlObject).find('a:first').attr('href');
                //html += per_msg_url_attachment(data.url_base_title, data.url_title, data.url_body, data.url_image, data.url_favicon,url);
            }
            if (data.msg_body.indexOf(file_server) > -1) {
                var htmlObject = document.createElement('div');
                htmlObject.innerHTML = data.msg_body;
                var url = $(htmlObject).find('a:first').attr('href');
                html += per_msg_url_attachment("", "", "", url, "", "");
            }
            html += '</div>';
        }
        html += '<div class="msgBtnGroup global"><button onclick="cancelEditMsg(this,\'' + data.msg_id + '\')" class="hv_btn hv_btn_sm" style="margin-right: 12px">Cancel</button> <button onclick="editMessageSaveAction(\'' + data.msg_id + '\',\'' + data.msg_type + '\')" class="hv_btn hv_btn_sm btn_success">Update</button></div>';
    } else if (data.attch_imgfile.length > 0 || data.attch_videofile.length > 0 || data.attch_audiofile.length > 0 || data.attch_otherfile.length > 0) {
        if (data.edit_history != null) {
            if (data.hasDelete) {
                html += '<p class="msg_caption">' + data.msg_body + '</p>';
            } else {
                html += returnedithistoryDesign(data.edit_history, data, 'mainMsgtext');
            }
        } else {
            html += '<div id="data_msg_body' + data.msg_id + '" class="mainMsgtext">' + data.msg_body + '</div>';
        }
        html += '<div class="msgBtnGroup global"><button onclick="cancelEditMsg(this,\'' + data.msg_id + '\')" class="hv_btn hv_btn_sm" style="margin-right: 12px">Cancel</button> <button onclick="editMessageSaveAction(\'' + data.msg_id + '\',\'' + data.msg_type + '\')" class="hv_btn hv_btn_sm btn_success">Update</button></div>';
    } else {
        if (data.msg_type == 'checklist') {
            if (data.msg_body.indexOf('msgCheckListContainer') == -1) {
                html += '<div class="plain_text" id="data_msg_body' + data.msg_id + '">';
                if (hasDelete) {
                    html += '' + data.msg_body + '';
                } else {
                    html += draw_msg_checklist(data);
                }
                html += '</div>';
            } else {
                html += '<div class="plain_text" id="data_msg_body' + data.msg_id + '">' + data.msg_body + '</div>';
            }
            html += '<div class="msgCheckListBtnGroup"><button onclick="cancelEditAction(this,\'' + data.msg_id + '\')" class="hv_btn hv_btn_sm" style="margin-right: 12px">Close</button> <button onclick="updateCheckList(\'' + data.msg_id + '\')" class="hv_btn hv_btn_sm btn_success">Submit</button></div>';
        } else {
            if (data.edit_history != null) {
                if (data.hasDelete) {
                    html += '<div id="data_msg_body' + data.msg_id + '" class="mainMsgtext">' + data.msg_body + '</div>';
                } else {
                    html += returnedithistoryDesign(data.edit_history, data, 'mainMsgtext');
                }
            } else {
                html += '<div id="data_msg_body' + data.msg_id + '" class="mainMsgtext">' + data.msg_body + '</div>';
            }
            html += '<div class="msgBtnGroup global"><button onclick="cancelEditMsg(this,\'' + data.msg_id + '\')" class="hv_btn hv_btn_sm" style="margin-right: 12px">Cancel</button> <button onclick="editMessageSaveAction(\'' + data.msg_id + '\',\'' + data.msg_type + '\')" class="hv_btn hv_btn_sm btn_success">Update</button></div>';
        }
    }

    /*========================== MSG TEXT BODY END ====================================*/
    // if (data.has_delete.indexOf(user_id) == -1 && data.has_delete.indexOf('delete_for_all') == -1) {
    if (data.has_delete == null || data.has_delete.indexOf(user_id) == -1) {
        if (data.attch_videofile.length > 0 && attach_show) {
            if (user_id === data.sender) { if (attachFileList.indexOf(data.msg_id) === -1) { attachFileList.push(data.msg_id); } }

            if (multi_type_file == 1) {
                html += per_msg_video_attachment(data.msg_id, data.attch_videofile, data.sender_name);
            } else {
                html += per_msg_file_attachment(data.attch_videofile, data.sender_name);
            }
        }
        if (data.attch_imgfile.length > 0 && attach_show) {
            if (user_id === data.sender) { if (attachFileList.indexOf(data.msg_id) === -1) { attachFileList.push(data.msg_id); } }
            html += per_msg_img_attachment(data.msg_id, data.attch_imgfile, data.sender_name, data.sender_img, data.msg_body);

            // console.log(442, multi_type_file, data.attch_imgfile.length);
            // if(multi_type_file == data.attch_imgfile.length){
            // }else{
            // html += per_msg_file_attachment(data.attch_videofile, data.sender_name);
            // html += per_msg_file_attachment(data.msg_id, data.attch_imgfile, data.sender_name, data.sender_img, data.msg_body);
            // }
        }
        if (data.attch_audiofile.length > 0 && attach_show) {
            if (user_id === data.sender) { if (attachFileList.indexOf(data.msg_id) === -1) { attachFileList.push(data.msg_id); } }
            html += per_msg_file_attachment(data.attch_audiofile, data.sender_name, data.msg_id);
        }
        if (data.attch_otherfile.length > 0 && attach_show) {
            if (user_id === data.sender) { if (attachFileList.indexOf(data.msg_id) === -1) { attachFileList.push(data.msg_id); } }
            html += per_msg_file_attachment(data.attch_otherfile, data.sender_name, data.msg_id);
        }
    }

    html += '<div class="replies reactionEmoji">';
    // Check emoji reaction message
    if (data.has_emoji !== null && attach_show) {
        $.each(data.has_emoji, function(k, v) {
            if (v > 0)
                html += emoji_html(k, data.msg_id, "/images/emoji/" + k + ".svg", v);
        });
    }
    html += '</div>';
    // console.log(data.msg_id, data.has_reply);
    if (data.has_reply > 0 && attach_show) {
        html += per_msg_rep_btn(data.msg_id, data.has_reply, data.last_reply_time, data.last_reply_name, data.msg_type);
    }
    html += '</div>'; // end of .msg_body

    var this_tag_list = [];
    if (data.tag_list != null) {
        this_tag_list = data.tag_list
    }

    if (alldeletemsgid.indexOf(data.msg_id) == -1) {
        html += '<div id="msg_tag_list' + data.msg_id + '" class="attach_tag" tag-list="' + this_tag_list.join(',') + '">';
        $.each(this_tag_list, function(ck, cv) {
            html += '<span class="single_tag tag_name_view_' + cv + '" data-id="' + cv + '" onclick="removeThisTag(event)"></span>'
        });
        // console.log(111, allUserTagList);
        // var newHtml = '';
        // $.each(allUserTagList,function(k,v){
        // 	console.log(111, k, v);
        // 	if(this_tag_list.indexOf(v.tag_id) > -1){
        // 		var st = '';
        // 		if(v.shared_tag != null){
        // 			st = ' shared_tag_user ';
        // 			if(v.shared_tag !== user_id){
        // 				st = st+' others_userTag ';
        // 			}
        // 		}
        // 		if(v.tag_type == 'public'){
        // 			newHtml += '<span class="single_tag _public_tag tag_name_view_'+v.tag_id+'"  style="'+(v.tag_color != null ? 'background-color:'+v.tag_color+'':'')+'" data-id="'+v.tag_id+'" onclick="//removeThisTag(event)">'+v.title+'</span>';
        // 		}else{
        // 			newHtml += '<span class="single_tag tag_name_view_'+v.tag_id+st+'" data-id="'+v.tag_id+'" onclick="//removeThisTag(event)">'+v.title+'</span>';
        // 		}

        // 	}
        // });
        // html += newHtml;
        html += '</div>';
    }
    html += '</div>'; // end of .msg_section
    html += '</div>'; // end of .user_msg

    if (append) {
        if (data.updatedmsgid == null || data.updatedmsgid == '') {

            $("#msg-container").append(html);

        } else {
            $("#msg-container").append(html);

            if ($('#data_msg_body' + data.updatedmsgid).is(':visible')) {
                var tDesign = '<div style="padding: 5px 0px;position: relative;" class="updatedDivCOntainer" id="updatedMsgBody' + data.msg_id + '"><a onclick="colorChange(\'' + data.updatedmsgid + '\');" href="#msgThread_' + data.updatedmsgid + '"><p class="updatedTextOriginal">' + $("#data_msg_body" + data.updatedmsgid).html() + '</p></a></div>';
                $('#data_msg_body' + data.msg_id).before(tDesign);
            } else {
                updatedMsgArr.push({
                    'id': data.msg_id.toString(),
                    'updatedmsgid': data.updatedmsgid.toString(),
                    'msgbody': data.msg_body,
                    'created_at': data.created_at
                });
            }
        }
    } else {
        if (data.updatedmsgid == null || data.updatedmsgid == '') {
            $("#msg-container").prepend(html);
        } else {
            $("#msg-container").prepend(html);

            if ($('#data_msg_body' + data.updatedmsgid).is(':visible')) {
                var tDesign = '<div style="padding: 5px 0px;position: relative;" class="updatedDivCOntainer" id="updatedMsgBody' + data.msg_id + '"><a onclick="colorChange(\'' + data.updatedmsgid + '\');" href="#msgThread_' + data.updatedmsgid + '"><p class="updatedTextOriginal">' + $("#data_msg_body" + data.updatedmsgid).html() + '</p></a></div>';
                $('#data_msg_body' + data.msg_id).before(tDesign);
            } else {
                updatedMsgArr.push({
                    'id': data.msg_id.toString(),
                    'updatedmsgid': data.updatedmsgid.toString(),
                    'msgbody': data.msg_body,
                    'created_at': data.created_at
                });
            }
        }

        $.each($('.msg-separetor'), function(k, v) {
            if ($(v).text() == msg_date) {
                $(v).remove();
                return 0;
            }
        });
        var date_html = '<div class="msg-separetor mid_mg_sep" data-date="' + msg_date + '"><span>' + msg_date + '</span></div>';
        $("#msg-container").prepend(date_html);
    }

    if ($('#selectAllMsg').hasClass('selected')) {
        $('#selectAllMsg').removeClass('selected');
    }

    if (data.checklist !== undefined) {
        var checklist_item = _.orderBy(data.checklist, ["checklist_id"], ["asc"]);
        $.each(checklist_item, function(ck, cv) {
            $('#clcounterperMsg' + data.msg_id).attr('data-length', checklist_item.length);
            if (cv.checklist_status !== 0) {
                $('#clcounterperMsg' + data.msg_id).attr('data-com', parseInt($('#clcounterperMsg' + data.msg_id).attr('data-com')) + 1);
            }
            $('#clcounterperMsg' + data.msg_id).html('(' + $('#clcounterperMsg' + data.msg_id).attr('data-com') + '/' + checklist_item.length + ')')
        });

    }

    messageEllipsis(data.msg_id)

    if (data.tag_list != null) {
        if (data.tag_list.length > 0) {
            checklistView();
        }
    }

    hideMsgSeparetor();

    if (data.msg_type == 'checklist') {
        // if(drawmsgtype == 'new'){
        viewchecklisttype = 'count';
        countAndGetchecklist()
            // }
    }

    // set_fileTag();

}

function set_fileTag() {
    var file_tbl_data = [];
    for (var i = 0; i < per_conv_all_files.length; i++) {
        if (per_conv_all_files[i].tag_list != null) {
            // if(file_tbl_id.id.indexOf(per_conv_all_files[i].id) == -1){
            file_tbl_data.push({
                id: per_conv_all_files[i].id,
                msg_id: per_conv_all_files[i].msg_id,
                tags: per_conv_all_files[i].tag_list
            });
            // }

            // $.each(allUserTagList,function(k,v){
            // 	if(per_conv_all_files[i].tag_list.indexOf(v.tag_id) > -1){
            // 		tagDesign += '<div class="tag_design">'+v.title+'</div>'
            // 	}
            // })
        }
    }
    $.each(file_tbl_data, function(k, v) {
        // console.log(k,v);
        $('._file_id_' + v.id).find('.filetag_icon').addClass('active').attr('msg-id', v.msg_id).attr('data-tags', v.tags);
        // console.log($('._file_id_'+v.id))
        $.each(allUserTagList, function(ka, va) {
            if (v.tags.indexOf(va.tag_id) > -1) {
                // $('#fileid'+v.id).append('<li class="" data-id="'+va.tag_id+'">'+va.title+'</li>');
                // console.log(va)
            }
        });
    });
}

function filter_flag(event) {
    // if($("#filterFlagged_msg_2").hasClass('activeComFilter')){
    // 	$('#filterFlagged_msg_2').removeClass('activeComFilter');
    // 	removeA(allFilteredItem,'flag');
    // 	activeFlagFilterConv = '';
    // 	showFreeliToaster(false);
    // }else{
    // 	$('#filterFlagged_msg_2').addClass('activeComFilter');
    // 	allFilteredItem.push('flag');
    // 	activeFlagFilterConv = conversation_id;
    // 	var msg = 'Showing flagged messages(s) from this channel.';
    // 	showFreeliToaster(true,msg);
    // 	$('#workFreeliToaster').attr('data-id','flagged_msg');
    // }
    // $('#conv'+conversation_id).removeClass('sideActive');
    // $('#conv'+conversation_id).trigger('click');
}

function messageEllipsis(msg_id, type) {
    if (type == 'reply') {
        var msg_thread = $('.rep_msg_' + msg_id).find('.updatedTextOriginal');
        $.each(msg_thread, function(k, v) {
            var text = $(v).find('.msg_historyBody').html();
            if (text != undefined) {
                text = text.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, "");
                $(v).find('.msg_historyBody').html(text);
            }
        });
        var msg_thread = $('.rep_msg_' + msg_id).find('.updatedTextOriginal');

        $.each(msg_thread, function(k, v) {
            if ($(v).height() > 66) {
                if (!$(v).hasClass('ellipsis_active')) {
                    $(v).addClass('ellipsis_active');
                    $(v).find('.lastUpdateTime').before('<div class="showMoreEditedmsg" onclick="showEditFullMsg(\'' + msg_id + '\',this)"> + Show full message</div>')
                }

            }
        })
    } else {
        var msg_thread = $('#msgid_' + msg_id).find('.updatedTextOriginal');
        $.each(msg_thread, function(k, v) {
            var text = $(v).find('.msg_historyBody').html();
            if (text != undefined) {
                text = text.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, "");
                $(v).find('.msg_historyBody').html(text);
            }
        });

        var msg_thread = $('#msgid_' + msg_id).find('.updatedTextOriginal');

        $.each(msg_thread, function(k, v) {
            if ($(v).height() > 66) {
                if (!$(v).hasClass('ellipsis_active')) {
                    $(v).addClass('ellipsis_active');
                    $(v).find('.lastUpdateTime').before('<div class="showMoreEditedmsg" onclick="showEditFullMsg(\'' + msg_id + '\',this)"> + Show full message</div>')
                }
            }
        });
    }

}

function showEditFullMsg(msg_id, elm) {
    if (!$(elm).hasClass('active')) {
        $(elm).parent('.updatedTextOriginal').removeClass('ellipsis_active');
        $(elm).text('- Hide full message');
        $(elm).addClass('active');
    } else {
        $(elm).parent('.updatedTextOriginal').addClass('ellipsis_active');
        $(elm).text('+ Show full message');
        $(elm).removeClass('active');
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

var convlist;
var msg_ids = [];
var start_conv_success = (respons, conversation_id) => {
    per_conv_all_files = respons.files;

    if (conversation_id == user_id) {
        respons.conversation.push({
            b_unit_id: null,
            company_id: null,
            conv_img: user_img,
            conversation_id: user_id,
            created_at: moment().unix(),
            created_by: user_id,
            group: 'no',
            group_keyspace: null,
            guests: 'no',
            is_active: null,
            is_busy: 0,
            participants: [user_id],
            participants_admin: [user_id],
            participants_guest: null,
            room_id: user_id,
            single: "no",
            status: null,
            tag_list: [],
            title: user_fullname,
            topic_type: ''

        })
        forviewconv(conversation_id);
    } else {
        // alert(call_partner);

    }


    activeConvPrivacy = respons.conversation[0].privacy;
    if (respons.checklist != undefined) {
        $.each(respons.conversation_list, function(mk, mv) {
            if (mv.msg_type == 'checklist') {
                if (mv.msg_body.indexOf('msgCheckListContainer') == -1) {
                    var thismsgcl = [];
                    $.each(respons.checklist, function(ck, cv) {
                        if (cv.msg_id == mv.msg_id) {
                            thismsgcl.push(cv);
                            respons.conversation_list[mk]['checklist'] = thismsgcl;
                        }
                    });
                }
            }
        })
    }
    thisroomTagList = [];

    if (respons.conversation[0].tag_list !== null) {
        if (respons.conversation[0].tag_list.length > 0) {
            thisroomTagList = respons.conversation[0].tag_list;
        }
    }

    var need_update_message_seen_list = [];
    msg_ids = [];
    var noattch = 0;
    convlist = respons.conversation_list;
    convlist = _.sortBy(convlist, ["created_at", ]);
    // if($('#threadChatsOnly').hasClass('active')){
    convlist.reverse();
    // }

    // console.log(1038, convlist)

    if (convlist.length == 0) {
        $('#msg-container').attr('has-msg', false);
    }

    if (!onlyUnread_thread) {
        $.each(convlist, function(k, v) {
            // console.log(858, k,v)

            // if number of attachment > 20 pc, then no more messages will be show
            // if(noattch > 8) return false;
            noattch += count_no_of_attch(v);
            if (k > 19) return false;
            // if(k>start_pos){
            msg_ids.push(v.msg_id);

            draw_msg(v, false);

            if (v.msg_status == null) {
                if (v.sender == user_id) {
                    // This msg send by this user; so no need to change any seen status
                } else {
                    // This msg receive by this user; so need to change seen status
                    need_update_message_seen_list.push(v.msg_id);
                    draw_urhr();
                }
            }

            // If msg status have some user id, then
            else {
                if (v.msg_status.indexOf(user_id) > -1) {
                    // This msg already this user seen
                    if (v.sender != user_id) {
                        // This msg receive by this user; so need to change seen status
                        need_update_message_seen_list.push(v.msg_id);
                        draw_urhr();
                    }
                } else {

                }
            }
        });
    }

    if (need_update_message_seen_list.length > 1) {
        find_urhr_add_s(need_update_message_seen_list.length);
    }

    setTimeout(function() {
        start_scroll = false;
        socket.emit('check_pin_conv', { convid: conversation_id, user_id: user_id }, (rep) => {
            if (rep.status && rep.pindata.length > 0) {
                $("#more_options_chat").find(".pin_ico").closest('.option').attr("onclick", "unpinme('" + rep.pindata[0].id + "', '" + conversation_id + "', event)");
                $('.option.pinUnpin .text').text('Unpin');
            } else {
                $("#more_options_chat").find(".pin_ico").closest('.option').attr("onclick", "pinme('" + conversation_id + "')");
                $('.option.pinUnpin .text').text('Pin');
            }
        });
    }, 100);

    /**
     * update per message seen status
     */
    // if (need_update_message_seen_list.length > 0) {
    last_delivered_always_show();
    $.ajax({
        url: '/alpha2/update_msg_status',
        type: 'POST',
        data: {
            // msgid_lists: JSON.stringify(need_update_message_seen_list),
            user_id: user_id,
            conversation_id: conversation_id,
            edit_seen_lts: []
        },
        dataType: 'JSON',
        success: function(res) {
            console.log(res);
            socket.emit('update_msg_seen', {
                msgid: res.msg_ids,
                senderid: to,
                receiverid: user_id,
                conversation_id: conversation_id
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
    // }

    var url = window.location.href.split('/');

    var mute = decodeURI(url[url.length - 1]);
    if (mute == 'unmute') {
        $("#user_head_id").attr('data-mute', 'unmute');
    } else {
        $("#user_head_id").attr('data-mute', 'mute');
    }

    drawFile_size();
    findReplyUnreadMsg(conversation_id);

}

function findReplyUnreadMsg(conversation_id) {
    allrepData = [];
    allmyUnreadThread = [];
    socket.emit('getAllThreadCov', conversation_id, function(res) {
        if (res.status) {
            if (res.data.length > 0) {
                allrepData = res.data;
                var all_Conv_id = []
                $.each(allrepData, function(k, v) {
                    if (all_Conv_id.indexOf(v.rep_id) == -1) {
                        all_Conv_id.push(v.rep_id);
                    }
                });
                socket.emit('getallThreadMsg', { conversation_id: all_Conv_id }, function(res2) {
                    $.each(allrepData, function(k, v) {
                        $.each(res2.data, function(ka, va) {
                            if (va.conversation_id == v.rep_id) {
                                if (va.msg_status == null) {
                                    va.msg_status = [];
                                }
                                if (va.msg_status.indexOf(user_id) > -1) {
                                    if (va.sender != user_id) {
                                        if (allmyUnreadThread.indexOf(v.msg_id) == -1) {
                                            allmyUnreadThread.push(v.msg_id);
                                            $('#msgid_' + v.msg_id).addClass('msg_unread');
                                            $('#msgid_' + v.msg_id).find('.perMsg_reply').addClass('unreadOn');
                                        }
                                    }
                                }
                            }
                        });
                    });

                    if (onlyUnread_thread) {
                        var noattch = 0;
                        // convlist.reverse();

                        $.each(convlist, function(k, v) {

                            noattch += count_no_of_attch(v);
                            // if(k>19) return false;
                            msg_ids.push(v.msg_id);

                            if (allmyUnreadThread.indexOf(v.msg_id) > -1) {
                                draw_msg(v, false);

                                $('#msgid_' + v.msg_id).addClass('msg_unread');
                                $('#msgid_' + v.msg_id).find('.perMsg_reply').addClass('unreadOn');
                            }

                            if (v.msg_status == null) {
                                if (v.sender == user_id) {
                                    // This msg send by this user; so no need to change any seen status
                                } else {
                                    // This msg receive by this user; so need to change seen status
                                    need_update_message_seen_list.push(v.msg_id);
                                    draw_urhr();
                                }
                            }

                            // If msg status have some user id, then
                            else {
                                if (v.msg_status.indexOf(user_id) > -1) {
                                    // This msg already this user seen
                                    if (v.sender != user_id) {
                                        // This msg receive by this user; so need to change seen status
                                        need_update_message_seen_list.push(v.msg_id);
                                        draw_urhr();
                                    }
                                } else {

                                }
                            }
                        });

                        if ($("#msg-container").is(':empty')) {
                            $('#msg-container').html('<h2 class="empty_msg" data-filter="msg">No message(s) were found in this channel !</h2>');
                        } else {
                            console.log("Not Empty");
                        }

                        $('#call_filter_result p').text('Showing unread thread messages(s) from this channel.');
                        $('#call_filter_result .closePopup').attr('onclick', 'cancelUnreadThread()');
                        $('#call_filter_result').css('display', 'flex');
                        // scrollToBottom('#msg-container');

                    }

                });
            }
        }
    });

}

function drawFile_size() {
    $.each(fileSizeStore, function(k, v) {
        getFileSize(v.url, v.cls);
    });
}

function forviewconv(conversation_id) {
    if (conversation_id == user_id) {

        $('.head_end_area').find('.voice-call').show();
        $('.head_end_area').find('.video-call').show();
        $('.head_end_area').find('.join-call').hide();
        $('.head_end_area').css({
            'width': 'auto',
            'float': 'right'
        });
        // $('.chat-head-calling').find('.tagged').hide();
        // $('#callNotifications').hide();
        // $('#pin-to-bar').parent('.pin-unpin ').addClass('pined');
        // $('#pin-to-bar').parent('.pin-unpin ').addClass('pined');
        // $('#pin-to-bar').parent('.pin-unpin ').css('pointer-events','none');
    } else {

    }
}

var start_conversation_onload = (convid, respons) => {
    conversation_id = convid;
    $("#msg").html("");
    $("#msg-container").html("");

    start_conv_success(respons, conversation_id);
    countAndGetchecklist();
    // Floating Date in the top bar
    $('#msg-container').on('scroll', function() {
        var scrollTop = $('#msg-container').scrollTop();
        $(".msg-separetor").each(function() {
            var last = true;
            if (last)
                $(this).removeClass('not_visible');
            if ($(this).offset().top < 75) {
                last = false;
                $(this).addClass("not_visible");
                $('#top-date').html($('.not_visible').last().attr('data-date'));
            }
        });
        if (scrollTop == 0) {
            $('#top-date').html("");
        }
        if (getCookie('filtered') != "") {
            $('.msg-separetor').hide();
            switch (getCookie('filtered')) {
                case 'flag':
                    $('.user_msg').hide();
                    $('.flaged_icon').closest('.user_msg').show();
                    setCookie('filtered', '', 0);
                    break;
                case 'tag':
                    $('.user_msg').hide();
                    var taglist = getCookie('filtered_tag').split("@");
                    $.each($(".single_tag"), function(k, v) {
                        if (taglist.indexOf($(v).text()) > -1 && $(v).text() != "") {
                            $(v).closest('.user_msg').show();
                        }
                    });
                    break;
            }

            setCookie('filtered', '', 0);
            setCookie('filtered_tag', '', 0);
        }
    });

    setTimeout(function() {
        if ($('.online_' + to).hasClass('online')) {
            $('.voice-call , .redial-audiocall').addClass('onC');
            $('.video-call , .redial-videocall').addClass('onC');
            $('.voice-call img , .redial-audiocall img').attr('src', '/images/basicAssets/voice_call_for_active.svg');
            $('.video-call img , .redial-videocall img').attr('src', '/images/basicAssets/video_call_for_active.svg');
        }

    }, 3000);
    nameArry = [];
    nameArryid = [];
    nameArryimg = [];
    // $.each(user_list,function(k,v){
    // 	if(participants.indexOf(v.id) !== -1 && v.is_delete == 0){
    // 		nameArry.push(v.fullname);
    // 		nameArryid.push(v.id);
    // 		nameArryimg.push(v.img);
    // 	}
    // });
}

var per_msg_img_attachment = (msg_id, msg_attach_img, sender_name, sender_img, data_msg) => {
    var datalen = msg_attach_img.length > 4 ? 4 : msg_attach_img.length;
    var datamorelen = msg_attach_img.length > 4 ? "data-more=" + msg_attach_img.length : "";
    var html = '<div class="attach_img" data="' + datalen + '" ' + datamorelen + '>';
    var sender;
    $.each(msg_attach_img, function(k, v) {
        var originalname = "";
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        var is_hide = true;
        var fileTag = [];
        var file_tbl_id = '';
        var ac_class = '';
        var sender = '';

        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                originalname = per_conv_all_files[i].originalname;
                id = per_conv_all_files[i].key;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
                file_tbl_id = per_conv_all_files[i].id;
                sender = per_conv_all_files[i].user_id;
                if (per_conv_all_files[i].tag_list != null) {
                    ac_class = 'active';
                    fileTag = per_conv_all_files[i].tag_list;
                    // $.each(allUserTagList,function(k,v){
                    // 	if(per_conv_all_files[i].tag_list.indexOf(v.tag_id) > -1){
                    // 		tagDesign += '<div class="tag_design">'+v.title+'</div>'
                    // 	}
                    // })
                }
            }
        }

        // console.log(1064, allUserTagList);

        if (is_hide) {
            html += '<div class="imgholder deleted_class" placeholder="Item already deleted" data-status="deleted">';
            // html += '<img class="img_attach" style="" src="' + file_server + 'common/file-removed-message.png">';
            html += '</div>';
        } else {
            if (k > 3) {
                html += '<div class="fil_attach imgholder _file_id_' + file_tbl_id + '" file-id="' + file_tbl_id + '" file-tag="' + fileTag + '" data-status="active" style="display:none;">';
                html += '	<img class="img_attach blazy"  file-tag="' + fileTag + '" file-id="' + file_tbl_id + '" file-tag="' + fileTag + '" src="' + file_server + msg_attach_img[k] + '" data-sender_name="' + sender_name + '" data-sender_img="' + sender_img + '" sender-id="' + sender + '" onclick="viewMediaImagePopup(\'' + msg_id + '\',this)">';
                html += '</div>';
            } else {
                html += '<div class="fil_attach imgholder _file_id_' + file_tbl_id + '" file-id="' + file_tbl_id + '" file-tag="' + fileTag + '" data-status="active">';
                html += '<i class="filetag_icon ' + ac_class + '" file-tag="' + fileTag + '" file-id="' + file_tbl_id + '" onclick="viewTagForFiles(event,this,\'frmFile\')">' + fileTag.length + '</i>';
                if (id != "") {
                    html += '<img class="img_attach blazy"  file-tag="' + fileTag + '" file-id="' + file_tbl_id + '" file-tag="' + fileTag + '" src="' + file_server + v + '" data-sender_name="' + sender_name + '" data-sender_img="' + sender_img + '" sender-id="' + sender + '" onclick="viewMediaImagePopup(\'' + msg_id + '\',this)">';
                }
                html += '</div>';
            }
        }
    });
    if (datamorelen != "") {
        var morelen = msg_attach_img.length - 4;
        html += '<div class="showHiddenfile" sender-id="' + sender + '" onclick="viewMediaImagePopup(\'' + msg_id + '\',this)">+ ' + morelen + '</div>';
    }
    html += '</div>';
    return html;
}

var per_msg_video_attachment = (msg_id, msg_attach_video, sender_name) => {
    var html = '';
    $.each(msg_attach_video, function(k, v) {
        // console.log(1098, k,v);
        var originalname = "";
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        var is_hide = true;
        var sender = '';
        var namespl = v.split('/')[v.split('/').length - 1];
        namespl = namespl.split('@');
        if (namespl.length > 2) {
            removeA(namespl, namespl[namespl.length - 1]);
        } else {
            namespl = namespl[0];
        }

        var classV = namespl + Date.now();
        // classV = classV.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                originalname = per_conv_all_files[i].originalname;
                id = per_conv_all_files[i].key;
                sender = per_conv_all_files[i].user_id;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
            }
        }
        if (id != "") {
            var file_type = v.split('.').pop().toLowerCase();
            if (is_hide) {
                html += '<div class="imgholder deleted_class" placeholder="Item already deleted" data-status="deleted">';
                // html += '<img class="img_attach" style="" src="' + file_server + 'common/file-removed-message.png">';
                html += '</div>';
            } else {
                if (file_type == 'avi') {
                    html += '<div class="fil_attach attach-file lightbox" onclick="triggerView(event,this)" data-sender_name="' + sender_name + '" data-filetype="' + file_type + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
                    html += '	<i class="file_viewAction" onclick="file_actions(event,this)"><i class="fas fa-ellipsis-h"></i></i>';
                    html += '	<div class="file_viewImg">';
                    html += '		<img src="/images/basicAssets/' + file_type + '.svg" alt="' + v + '">';
                    // html += '		<img src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
                    html += '	</div>';
                    html += '<div class="fileInfrm"><p class="name_span">' + originalname + '</p><p class="file_size">' + bytesToSize2(filesize) + '</p></div>';

                    html += '<div class="per_img_hover_opt">';
                    html += '<p class="img_action view_ico" file-name="' + originalname + '" data-href="' + file_server + v + '" onclick="downloadFilePopup(event, this,\'frmMsg\')">';
                    html += '<img src="/images/basicAssets/mobile/view.svg" alt=""/>';
                    // html += 		'	<a download target="_blank" href="' + file_server + v + '" style="width: unset !important;">';
                    // html += 		'	</a>';
                    html += '</p>';
                    html += '<p class="img_action" onclick="show_noti(event)" data-href="' + file_server + v + '">';
                    html += '	<a download="' + originalname + '" target="_blank" href="/alpha2/download/' + v.split('/')[v.split('/').length - 1] + '" style="width: unset !important;">';
                    html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
                    html += '	</a>';
                    html += '</p>';
                    html += '<p class="img_action" msg-id="" onclick="viewTagForFiles(event,this,\'frmFile\')"><img style="width:16px;" src="/images/basicAssets/mobile/tag.svg" alt=""/></p>';
                    html += '<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
                    // html += 		'<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/info.svg" alt=""/></p>';
                    if (sender == user_id) {
                        html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="video" msg-id="' + msg_id + '" data-value="' + file_server + v + '"></p>';
                    }
                    html += '</div>';
                    html += '</div>';
                } else {
                    html += '<div class="fil_attach attach_video">';
                    html += '	<i class="file_viewAction" onclick="file_actions(event,this)"><i class="fas fa-ellipsis-h"></i></i>';
                    // html += '	<i class="filetag_icon" onclick="viewTagForFiles(event,this,\'frmFile\')"></i>';
                    html += '	<video controls class="media-msg">';
                    html += '		<source class="vdo_attach" src="' + file_server + v + '" type="video/' + file_type + '" data-file_name="' + v + '" data-sender_name="' + sender_name + '">';
                    html += '		Your browser does not support HTML5 video.';
                    html += '	</video>';
                    html += '	<div class="per_img_hover_opt">';
                    html += '<p class="img_action">';
                    html += '<a download target="_blank" href="' + file_server + v + '" style="width: unset !important;">';
                    html += '<img src="/images/basicAssets/mobile/view.svg" alt=""/>';
                    html += '</a>';
                    html += '</p>';
                    html += '<p class="img_action" onclick="show_noti(event)" data-href="' + file_server + v + '">';
                    html += '	<a download="' + originalname + '" target="_blank" href="/alpha2/download/' + v.split('/')[v.split('/').length - 1] + '" style="width: unset !important;">';
                    html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
                    html += '	</a>';
                    html += '</p>';
                    // html += 		'<p class="img_action" msg-id="" onclick="viewTagForFiles(event,this,\'frmFile\')"><img style="width:16px;" src="/images/basicAssets/mobile/tag.svg" alt=""/></p>';
                    html += '<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
                    // html += 		'<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/info.svg" alt=""/></p>';
                    if (sender == user_id) {
                        html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="video" msg-id="' + msg_id + '" data-value="' + file_server + v + '"></p>';
                    }
                    html += '	</div>';
                    html += '</div>';

                }
            }
        } else {
            html += '<div class="imgholder"></div>';
        }
        var url2 = file_server + v;
        var data = {
            url: url2,
            cls: classV
        }
        fileSizeStore.push(data);
    });
    return html;
}

var per_msg_audio_attachment = (msg_attach_audio, sender_name) => {
    var html = '<div class="attach_audio">';
    $.each(msg_attach_audio, function(k, v) {
        var originalname = "";
        var id = "";
        var divkeyclass = "";
        var filesize = 0;
        var is_hide = true;
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                originalname = per_conv_all_files[i].originalname;
                id = per_conv_all_files[i].key;
                divkeyclass = per_conv_all_files[i].key.replace(/[^\w\s]/gi, '');
                filesize = per_conv_all_files[i].file_size == undefined ? per_conv_all_files[i].size : per_conv_all_files[i].file_size;
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
            }
        }
        if (id != "") {
            var file_type = v.split('.').pop().toLowerCase();
            if (is_hide) {
                html += '<div class="imgholder deleted_class" placeholder="Item already deleted" data-status="deleted">';
                // html += '<img class="img_attach" style="" src="' + file_server + 'common/file-removed-message.png">';
                html += '</div>';
            } else {
                if (file_type == 'm4a') {
                    html += '<video controls class="media-msg">';
                    html += '<source class="vdo_attach" src="' + file_server + v + '" type="audio/mp4" data-file_name="' + v + '" data-sender_name="' + sender_name + '">';
                    html += 'Your browser does not support HTML5 video.';
                    html += '</video>';
                } else {
                    html += '<audio controls class="media-msg">';
                    html += '<source class="ado_attach" src="' + file_server + v + '" type="audio/' + file_type + '" data-file_name="' + v + '" data-sender_name="' + sender_name + '">';
                    html += 'Your browser does not support audio tag.';
                    html += '</audio>';
                }
            }
        } else {
            html += '<div class="imgholder"></div>';
        }
    });
    html += '</div>';
    return html;
}

var setFile_data = [];
var per_msg_file_attachment = (msg_attach_file, sender_name, msg_id) => {
    var html = "";
    $.each(msg_attach_file, function(k, v) {
        var file_type = v.split('.').pop().toLowerCase();
        switch (file_type) {
            case 'ai':
            case 'apk':
            case 'mp3':
            case 'ogg':
            case 'mp4':
            case 'mkv':
            case 'avi':
            case 'wmv':
            case 'm4v':
            case 'mpg':
            case 'doc':
            case 'docx':
            case 'exe':
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
        var is_hide = true;
        var tagDesign = '';
        var fileTag = [];
        var file_tbl_id = '';
        var originalname = '';
        var ac_class = '';
        var file_size = '';
        var sender = '';


        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (v == per_conv_all_files[i].bucket + '/' + per_conv_all_files[i].key) {
                // console.log(1586, per_conv_all_files[i])
                is_hide = per_conv_all_files[i].is_delete == 1 ? true : false;
                file_tbl_id = per_conv_all_files[i].id;
                originalname = per_conv_all_files[i].originalname;
                file_size = per_conv_all_files[i].file_size;
                sender = per_conv_all_files[i].user_id;
                if (per_conv_all_files[i].tag_list != null) {
                    ac_class = 'active';
                    fileTag = per_conv_all_files[i].tag_list;

                    // $.each(allUserTagList,function(k,v){
                    // 	if(per_conv_all_files[i].tag_list.indexOf(v.tag_id) > -1){
                    // 		tagDesign += '<div class="tag_design">'+v.title+'</div>'
                    // 	}
                    // })
                    // console.log(9797, fileTag);
                }
            }
        }
        var key = v.substring(v.lastIndexOf('/') + 1);
        var thisfilename = v.substring(0, v.lastIndexOf('@'));
        thisfilename = thisfilename.substring(thisfilename.lastIndexOf('/') + 1);
        // var classN = thisfilename + Date.now();
        // classN2 = classN.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

        if (is_hide) {
            html += '<div class="imgholder deleted_class" placeholder="Item already deleted" data-status="deleted">';
            // html += '<img class="img_attach" style="" src="' + file_server + 'common/file-removed-message.png">';
            html += '</div>';
        } else {

            html += '<div onclick="' + (ext == 'mp3' || ext == 'ogg' ? 'playmusic(event,this,\'' + file_tbl_id + '\')' : 'triggerView(event,this)') + '" class="fil_attach attach-file _file_id_' + file_tbl_id + '" file-id="' + file_tbl_id + '" file-tag="' + fileTag + '" data-sender_name="' + sender_name + '" data-filetype="' + ext + '" data-src="' + file_server + v + '" data-file_name="' + v + '">';
            html += '<i class="file_viewAction" onclick="file_actions(event,this)"><i class="fas fa-ellipsis-h"></i></i>';
            html += '<i class="filetag_icon ' + ac_class + '" file-tag="' + fileTag + '" file-id="' + file_tbl_id + '" onclick="viewTagForFiles(event,this,\'frmFile\')">' + fileTag.length + '</i>';
            html += '	<div class="file_viewImg">';
            html += '		<img src="/images/basicAssets/' + ext + '.svg" alt="' + v + '">';
            html += '	</div>';
            html += '<div class="fileInfrm"><p class="name_span">' + originalname + '</p><p class="file_size">' + bytesToSize2(file_size) + '</p></div>';
            if (ext == 'mp3' || ext == 'ogg') {
                html += '<audio controls id="msgaudio_' + file_tbl_id + '">';
                html += '<source src="' + file_server + v + '" type="audio/' + ext + '"> Your browser does not support the audio element.';
                html += '</audio>';
            }
            html += '<div class="per_img_hover_opt">';

            html += '<p class="img_action view_ico" data-size="' + bytesToSize2(file_size) + '" file-type="' + ext + '" file-name="' + originalname + '" data-href="' + file_server + v + '" onclick="downloadFilePopup(event, this,\'frmMsg\')">';
            html += '<img src="/images/basicAssets/mobile/view.svg" alt=""/>';
            html += '</p>';

            if (ext == 'pdf' || ext == 'mp3' || ext == 'zip') {
                html += '<p class="img_action" onclick="downloadAnyFile(event, this)" data-href="' + file_server + v + '">';
                // html += 		'	<a target="_blank" onclick="show_noti(event)" href="/alpha2/download/' + key +'" style="width: unset !important;" >';
                html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
                // html += 		'	</a>';
                html += '</p>';
            } else {
                html += '<p class="img_action" onClick="preventFunc(event,this)" data-href="' + file_server + v + '">';
                html += '	<a download="' + originalname + '" target="_blank" href="' + file_server + v + '" style="width: unset !important">';
                html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
                html += '	</a>';
                html += '</p>';
            }
            html += '<p class="img_action" msg-id="' + msg_id + '" file-tag="' + fileTag + '" onclick="viewTagForFiles(event,this,\'frmFile\')"><img style="width:16px;" src="/images/basicAssets/mobile/tag.svg" alt=""/></p>';
            html += '<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
            // html += 		'<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="' + file_server + v + '"><img src="/images/basicAssets/mobile/info.svg" alt=""/></p>';
            if (sender == user_id) {
                html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="other" msg-id="' + msg_id + '" data-value="' + file_server + v + '"></p>';
            }
            html += '</div>';
            html += '</div>';
        }

        // var url2 = file_server + v;
        // var data ={
        // 	url: url2,
        // 	cls: classN2
        // }
        // fileSizeStore.push(data);
    });
    return html;
}


function playmusic(e, elm, id) {
    var x = document.getElementById("audio_" + id);
    var y = document.getElementById("msgaudio_" + id);
    // console.log(16623,$(elm));
    if (!$(e.target).hasClass('per_img_hover_opt') && $(e.target).parents('.per_img_hover_opt').length == 0) {
        // console.log(99)
        if ($(elm).hasClass('g_audio')) {
            if (!$(elm).hasClass('activePlay')) {
                x.play();
                $(elm).addClass('activePlay');
            } else {
                x.pause();
                $(elm).removeClass('activePlay');
            }
        } else {
            if (!$(elm).hasClass('activePlay')) {
                y.play();
                $(elm).addClass('activePlay');
            } else {
                y.pause();
                $(elm).removeClass('activePlay');
            }
        }
    }
}

function file_actions(e, ele) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ($(ele).parents('.fil_attach').hasClass('active')) {
        $(ele).html('<i class="fas fa-ellipsis-h"></i>');
        $(ele).parents('.fil_attach').removeClass('active');
    } else {
        $('.fil_attach').removeClass('active');
        $('.file_viewAction').html('<i class="fas fa-ellipsis-h"></i>');
        $(ele).html('<i class="fas fa-times"></i>');
        $(ele).parents('.fil_attach').addClass('active');
    }
}

var per_msg_url_attachment = (site_name, title, des, img, logo, url) => {
    // console.log(1678, site_name, title, des, img, logo, url)
    // var html = '<div class="url-details">';
    // html += '<div class="base-link" onclick="click_on_url(event)">';
    // if(logo != null)
    // html += '<img src="' + logo + '" class="url_pub_logo" onclick="click_on_url(event)">';
    // else
    // 	html += '<img src="/images/chat-action_20px_500 @1x.png" onclick="click_on_url(event)">';
    // if(site_name != null)
    //  	html += site_name;

    // html += '</div>';
    // if(site_name != "YouTube")
    // 	html += '<div class="title-link" onclick="click_on_url(event)">' + title + '</div>';
    // if(des != null)
    // 	html += '<div class="detail-link" onclick="click_on_url(event)">' + des + '</div>';
    // 	if(img != null && site_name == "YouTube"){
    // 		html += '<div class="youtube_container">';
    // 		html += '<img src="/images/youtube.jpg" class="youtube_btn" onclick="make_it_youtube_object(event)">';
    // 		html += '<img src="' + img + '" class="url_img" onclick="make_it_youtube_object(event)">';
    // 		html += '</div>';
    // 	}
    // else if(img != null)
    // 	html += '<img src="' + img + '" class="url_img" onclick="click_on_url(event)">';
    // html += '</div>';
    // return html;

    var html = '<div class="msg_url_preview" style="">' +
        '<div class="ulr_img"><img src="' + img + '"></div>' +
        '<div class="url_properties">' +
        '<div class="url_title"><p>' + title + '</p><a href="' + url + '" target="_blank">' + url + '</a></div>' +
        '<div class="url_desc"><p>' + des + '</p></div>' +
        '</div>' +
        '</div>';
    return html;
}

var make_it_youtube_object = (event) => {
    var url = $(event.target).closest('.user_msg').find('a').attr('href');
    url = url.replace("watch?v=", "embed/");

    var html = '<iframe width="300" height="224" src="' + url + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    $(event.target).closest('.user_msg').find('.youtube_container').html(html);
}

// var draw_call_history = (data) => {
// 	// //debugger;
// 	var html = '';
// 	var dur_str = '';

// 	if(data.call_duration != null && data.call_duration !=''){
// 		var dur_split = data.call_duration.split(':');
// 		if(dur_split[0] != '0' ) dur_str += dur_split[0] + ' hour ';
// 		if(dur_split[1] != '0' ) dur_str += dur_split[1] + ' min ';
// 		if(dur_split[2] != '0' ) dur_str += dur_split[2] + ' sec';
// 		html += '<div class="plain_text">In a call for '+dur_str+'</div>';
// 	}else{
// 		// if(data.call_running == true){
// 		if(typeof data.old_msgid != 'undefined' && parseInt(data.old_msgid) == 0){
// 			if(conversation_type == 'single'){
// 				html += '<div class="plain_text">Call in progress...</div>';
// 			}else{
// 				html += '<div class="plain_text">Call in progress, please join the call now by clicking the Call icon on top.</div>';
// 			}
// 		}else{
// 			if(data.call_status=='message'){
// 				html += '<div class="plain_text">'+ data.msg_body+'</div>';
// 			}else{
// 				html += '<div class="plain_text">Missed a call</div>';
// 			}

// 		}
// 	}

// 	return html;
// }

var per_msg_rep_btn = (msgid, count, rep_time, rep_name, msg_type) => {
    var html = "";
    html += '<div class="msgReply" data-count="' + count + '">';
    html += '<div class="countReply">';

    if (msg_type == "call") {
        html += '<p class="perMsg_reply" onclick="open_reply_msg(\'' + msgid + '\', \'' + msg_type + '\')">In-call chat history (<span class="no-of-replies" >' + count + '</span>)</p>';
    } else {
        html += '<p class="perMsg_reply" onclick="open_reply_msg(\'' + msgid + '\', \'' + msg_type + '\')">View threaded chat (<span class="no-of-replies" >' + count + '</span>) <span class="last_rep_text"> Last reply ' + moment(rep_time).fromNow() + ' from ' + rep_name + '</span></p>';
    }
    html += '</div>';
    html += '</div>';
    return html;
}


function checklistVisiblityCheck(data) {
    if (data.privacy == 'Private') {
        if (conversation_type == 'group') {
            if (adminArra.indexOf(user_id) > -1 || data.assign_to == user_id) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function checklistSettingsAuth(data) {
    // if(data.created_by == user_id || adminArra.indexOf(user_id) > -1){
    // 	return true;
    // }else{
    // 	return false;
    // }
    return true;
}


function draw_msg_checklist(data) {

    if (data.checklist == undefined) {
        data.checklist = [];
    }
    $('#clcounterperMsg' + data.msg_id).attr('data-length', data.checklist.length);
    var unchecklist = 0;
    var html = '<div class="msgCheckListContainer" onclick="makeEditablechecklist(event,\'' + data.sender + '\',\'' + data.msg_id + '\')">';
    html += '<p class="checkListPlainText" title="' + data.msg_body + '" onkeydown="checkListPlainText(event)" onkeyup="checkListPlainTextKeyup(event)">' + data.msg_body + '</p><span class="settingsIco" msg-id="' + data.msg_id + '" onclick="checklistDueDate(\'settings\',event)"></span>';
    html += '	<span class="checklistcounter" data-com="0" data-length="0" id="clcounterperMsg' + data.msg_id + '" style="display:none"></span><span class="filterchecklist" onclick="toggleChecklistf(\'' + data.msg_id + '\')" style="display:none">Show Pending</span>';
    html += '<div class="chkOpt">';
    html += '	<span class="filterShowall showAllChecklist S1" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'showall\',this)" id="filterShowall_' + data.msg_id + '" data-all="' + data.checklist.length + '">Show All (' + data.checklist.length + ')</span> <span class="breakText">|</span>';
    html += '	<span class="filterpending P1" data-unread="" id="filterPending_' + data.msg_id + '" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'pending\',this)">All Pending (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterMypending hidden_mob MP1" data-unread="" id="filterMyPending_' + data.msg_id + '" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'my_pending\',this)">My Pending (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterMyResReq hidden_mob MR1" data-unread="" id="filterMyResReq_' + data.msg_id + '" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'my_res_req\',this)">My Response Required (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterShowall completed_all hidden_mob C1" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'com_all\',this)" id="filterCompletedall_' + data.msg_id + '" data-com="0">Completed (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterShowall assignment_count hidden_mob AS1" data-assingment="0" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_assigned\',this)" id="filterassigned_' + data.msg_id + '"  msg-id="' + data.msg_id + '" filter-type="show_assigned" >Assigned (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterShowall unassignment_count hidden_mob US1" data-assingment="0" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_unassigned\',this)" id="filterUnassigned_' + data.msg_id + '"  msg-id="' + data.msg_id + '" filter-type="show_unassigned" >Unassigned (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterShowall over_due hidden_mob OD1" data-assingment="0" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_over_due\',this)" id="filterOverDue_' + data.msg_id + '"  msg-id="' + data.msg_id + '" filter-type="show_over_due" >Over Due (0)</span> <span class="breakText hidden_mob">|</span>';
    html += '	<span class="filterShowall show_activity hidden_mob SA1" onclick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_activity\',this); //filterOnChecklist(this)"  msg-id="' + data.msg_id + '" filter-type="show_activity" >Show Audit Trail</span>';
    html += '	<span class="breakText rm_hidden_mob" onclick="rm_hidden_mob(this)"></span>';

    html += '	<ul class="filter_popup">';
    html += '		<li class="S1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'showall\',this) //filter_taskItem(\'showall\')">Show All</li>';
    html += '		<li class="P1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'pending\',this) //filter_taskItem(\'pending\')">All Pending</li>';
    html += '		<li class="MP1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'my_pending\',this) //filter_taskItem(\'my_pending\')">My Pending</li>';
    html += '		<li class="MR1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'my_res_req\',this) //filter_taskItem(\'my_res_req\')">My Response Required</li>';
    html += '		<li class="C1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'com_all\',this) //filter_taskItem(\'com_all\')">Completed</li>';
    html += '		<li class="AS1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_assigned\',this) //filter_taskItem(\'show_assigned\')">Assigned</li>';
    html += '		<li class="US1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_unassigned\',this) //filter_taskItem(\'show_unassigned\')">Unassigned</li>';
    html += '		<li class="OD1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_over_due\',this) //filter_taskItem(\'show_over_due\')">Over Due</li>';
    html += '		<li class="SA1" onClick="filterchecklistLastime(\'' + data.msg_id + '\',\'show_activity\',this) //filter_taskItem(\'show_activity\')">Show Audit Trails</li>';
    html += '	</ul>';
    html += '</div>';
    html += '<div class="itemContainer">';
    var checklist_item = _.orderBy(data.checklist, ["created_at", "checklist_id"], ["asc", "asc"]);
    $.each(checklist_item, function(ck, cv) {
        var hiddenCls = '';

        var due_date_is_today = false;
        var AssC = 0;
        if (cv.alternative_assign_to != null) {
            AssC += 1;
        } else if (cv.assign_to != null) {
            AssC += 1;
        }

        var hiddenCls = '';
        var lock_for_user = '';
        var assusr = cv.alternative_assign_to == null ? cv.assign_to : cv.alternative_assign_to;

        var self_ass = false;
        var msg_creator = data.sender;
        if (assusr == user_id && cv.assignedby == user_id) {
            self_ass = true;
        }

        if (conversation_type == 'single') {
            if (cv.assign_status == 1 || cv.Request_ttl_by != null) {
                lock_for_user = ' lock_for_user';
            }
        } else {
            if (cv.assign_status == 1 || cv.Request_ttl_by != null) {
                lock_for_user = ' lock_for_user';
            }
        }

        var allActivity = '<span class="activity_created"> Created  by ' + findObjForUser(cv.created_by).fullname + ' @ ' + moment(cv.created_at).format('MMM Do YYYY - h:mm a') + ' </span>';
        if (assusr != null && cv.end_due_date != null) {
            allActivity += '<span class="activity_assignedTo"> | Assigned to ' + findObjForUser(assusr).fullname + ' </span>'
        }
        if (cv.assignedby != null && cv.end_due_date != null) {
            allActivity += '<span class="activity_assignedBy"> | Assigned by ' + findObjForUser(cv.assignedby).fullname + ' </span>'
        }
        if (cv.last_edited_by !== null) {
            allActivity += '<span class="activity_editedBy"> | Edited by ' + findObjForUser(cv.last_edited_by).fullname + ' @ ' + moment(cv.last_edited_at).format('MMM Do YYYY - h:mm a') + ' </span>'
        }
        if (cv.last_updated_by !== null) {
            // allActivity += '<span class="activity_Comp"> | '+((cv.checklist_status == 0)? 'Unchecked':'Completed')+' by '+findObjForUser(cv.last_updated_by).fullname+' @ '+moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a')+' </span>'
            allActivity += '<span class="activity_Comp"> | Updated by ' + findObjForUser(cv.last_updated_by).fullname + ' @ ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + ' </span>'
        }

        if (cv.end_due_date != null) {
            if (Number(cv.end_due_date) < moment().unix()) {
                if (cv.last_updated_by !== null) {
                    if (moment(cv.last_updated_at).unix() > Number(cv.end_due_date) && cv.checklist_status == 0) {
                        hiddenCls += ' overdue'
                    }
                } else {
                    hiddenCls += ' overdue'
                }
            }
        }

        var cvPrivacy = checklistVisiblityCheck(cv);
        var visibilityCk = '';
        if (cvPrivacy) {
            visibilityCk = 'visible';
        } else {
            visibilityCk = 'invisible';
        }

        if (cv.request_ttl_approved_date != null) {
            cv.end_due_date = (moment(cv.request_ttl_approved_date, "YYYY-MM-DD HH:mm").unix() * 1000);
        }

        var additional_check = '';
        var response_req = '';
        if (cv.checklist_status == 0) {
            // if((cv.created_by == user_id || adminArra.indexOf(user_id) > -1) && assusr != user_id ){
            if (assusr != user_id) {
                if (cv.assign_status == 1 && cv.assignedby == user_id) {
                    // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'"><span class="success_btn red_color" data-id="'+cv.checklist_id+'">Assigned user declined this task.<span class="short_cart_btn" onclick="open_duedate_box(this)">Review</span></span></div>';
                    response_req = 'response_req';
                    additional_check = 'waiting_3';
                } else if (cv.Request_ttl_by != null && cv.assignedby == user_id) {
                    // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'"><span class="success_btn red_color" data-id="'+cv.checklist_id+'">Time extension has been requested, please review and take action <span class="short_cart_btn" onclick="open_duedate_box(this)">Review</span></span></div>';
                    response_req = 'response_req';
                    additional_check = 'waiting_3';
                }
                if (cv.assign_status == user_id && cv.assignedby == user_id && cv.Request_ttl_by == null && cv.end_due_date != null) {
                    // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'">| <span class="success_btn red_color" data-id="'+cv.checklist_id+'">Pending Acceptance. </span></div>';
                }
            } else {
                if (cv.assign_status != null && cv.assign_status != 2 && cv.assign_status != user_id && assusr == user_id) {
                    if ((cv.assignee_change_reason != null || cv.assign_decline_note != null) && cv.assign_status != 1 && cv.Request_ttl_by == null) {
                        additional_check = 'waiting_3';
                        response_req = 'response_req';
                    } else if (cv.assign_status == 1 && assusr == user_id) {
                        // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'"><span class="success_btn red_color" data-id="'+cv.checklist_id+'"><span class="short_cart_btn" data-type="cancel_decline" msg-id="'+updateData.msg_id+'" checklist-id="'+updateData.checklist_id+'" data-reciver="'+receive_id+'" onclick="requesttlBtn(this)">Cancel Decline</span></span></div>';
                    } else if (cv.Request_ttl_by == user_id) {
                        // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'"><span class="success_btn red_color" data-id="'+cv.checklist_id+'"><span class="short_cart_btn" data-type="cancel_request" onclick="requesttlBtn(this)">Cancel Extension request</span></span></div>'
                    } else {
                        additional_check = 'waiting_3';
                        response_req = 'response_req';
                    }
                }
            }

            if (due_date_is_today && assusr == user_id && cv.assignedby != user_id) {
                if (cv.assign_status == 2 && cv.Request_ttl_by == user_id) {
                    // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'">| <span class="success_btn red_color" data-id="'+cv.checklist_id+'"><span class="short_cart_btn" data-type="cancel_request" msg-id="'+cv.msg_id+'" checklist-id="'+cv.checklist_id+'" data-reciver="'+cv.assignedby+'" onclick="requesttlBtn(this)">Cancel Extension request</span></span></div>'
                } else {
                    if (cv.Request_ttl_by == null) {
                        additional_check = 'waiting_3';
                        response_req = 'response_req';
                        // html += '<div class="ttl_requestTime ttl_request'+cv.checklist_id+'">| <span class="success_btn" data-id="'+cv.checklist_id+'"><span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Mark complete" onclick="open_duedate_box(this)">Mark complete</span></span></div>';
                    }
                }
            }
        }

        var review_status = ((cv.review_status == null) ? 0 : cv.review_status);
        var check_mark = ((cv.checklist_status == 1) ? true : false);
        var my_pending = '';
        if (assusr == user_id && check_mark == false) {
            my_pending = 'my_pending';
        }

        // remove html tags
        var isURL = validURL(cv.checklist_title);
        var title = cv.checklist_title.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1');

        var cvSettingsChanger = checklistSettingsAuth(cv);
        html += '<div created_by="' + cv.created_by + '" is-url="' + isURL + '" assigned-by="' + cv.assignedby + '" assign-to="' + assusr + '" data-ass="' + AssC + '" created_at="' + cv.created_at + '" msg_id="' + data.msg_id + '" checklist_status="' + cv.checklist_status + '" review_status="' + review_status + '" class="' + additional_check + ' ' + response_req + ' ' + my_pending + ' ' + (due_date_is_today ? 'dateOver_due' : '') + ' ' + (AssC == 1 ? 'has_assign' : 'unassigned') + ' ' + (cv.created_by == user_id ? 'crt_me' : 'crt_other') + ' ' + (cvSettingsChanger ? '' : 'settingsFalse ') + ' checkListItem ' + hiddenCls + ' ' + visibilityCk + ' perchecklist_' + cv.checklist_id + ' ' + (check_mark ? 'completed_item' : 'pending_item') + '" checklist-id="' + cv.checklist_id + '" created-at="' + cv.created_at + '">';
        html += '<div class="' + (cvPrivacy ? '' : 'checkUNauth ') + 'checkBox ' + ((cv.checklist_status == 0) ? '' : 'checked') + '" onclick="selectCheckItem(this)"></div>';
        html += '<div creator_id="' + cv.created_by + '" class="checkBoxTitle" onpaste="onpasteFun(event)" created_at="' + cv.created_at + '" contenteditable="false" placeholder="Add a new task" onkeyup="checkListTitleKeyup(event)" onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" my-id="' + user_id + '" edited-by="' + cv.last_edited_by + '" edited-at="' + cv.last_edited_at + '" data-title="' + title + '">' + title + '</div>';
        html += '<div class="item_toolbar">'
        html += '	<div last_updated_by="' + cv.last_updated_by + '" onclick="checklistDueDate(this,event)" checklist_status="' + cv.checklist_status + '" review_status="' + cv.review_status + '" class="dueDateIcon ' + (cv.end_due_date != null ? 'AssigneeUser active' : '') + '" msg-id="' + data.msg_id + '" data-id="' + cv.checklist_id + '" data-privacy="' + (cv.privacy != null ? cv.privacy : '') + '" data-assignee="' + (cv.alternative_assign_to != null ? cv.alternative_assign_to : cv.assign_to != null ? cv.assign_to : '') + '" end-date="' + (cv.end_due_date != null ? cv.end_due_date : '') + '" start-date="' + (cv.start_due_date != null ? cv.start_due_date : '') + '">'
        if (cv.alternative_assign_to != null) {
            html += '<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(cv.alternative_assign_to).img + '" >'
        } else if (cv.assign_to != null) {
            html += '<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(cv.assign_to).img + '" >'
        }
        html += '	</div>'

        html += '	<div class="item_UpdateButton" type="update" onclick="item_UpdateButton(event)"></div>'
        html += '	<div class="_task_option" onclick="_task_opt_popup(this)" msg_id="' + data.msg_id + '" checklist-id="' + cv.checklist_id + '" data-title="">...</div>'
        html += '	<ul class="_task_opt_popup">';
        html += '		<li class="_task_link" onclick="window.open(\'' + title + '\') //link_open(\'' + title + '\')" data-title="' + title + '">Preview Link</li>';
        html += '		<li class="_task_reply" onclick="openThreadForCheckI(event,this)" msg_id="' + data.msg_id + '" checklist-id="' + cv.checklist_id + '">Reply</li>';
        html += '		<li class="_task_copy" onclick="copyThis_item(this)">Copy</li>';
        html += '		<li class="_task_delete" onclick="delete_item_div(this,event)">Delete</li>';
        html += '	</ul>';
        html += '</div>'
            // html += '<div class="checkboxReplyBtn" onclick="openThreadForCheckI(event,this)" msg_id="'+data.msg_id+'" checklist-id="'+cv.checklist_id+'" data-title=""></div>'	
        html += '<div style="display:none" class="activity_list_all">' + allActivity + '</div>'



        if (assusr == user_id && cv.assignedby == user_id && cv.assign_status == user_id) {
            html += '<div class="assign_info">'
            html += '<span class="createdBy_name"> Created  by ' + findObjForUser(cv.created_by).fullname + ' on ' + moment(cv.created_at).format('MMM Do YYYY - h:mm a') + ' </span>';
            if (cv.last_updated_by != null) {
                html += ' <span class="end_due_date upBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Updated by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span>'
            }
            if (assusr != null) {
                if (cv.end_due_date != null) {
                    html += '<span class="end_due_date assignee_name" data="' + findObjForUser(assusr).fullname + '">' + (cv.last_updated_by != null ? ' | ' : ' | ') + 'Self-assigned</span> '
                    if (cv.checklist_status == 0) {
                        html += ' <span class="end_due_date _due_date" data="' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                    } else {
                        html += ' <span class="end_due_date compBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Completed by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + ' </span>'
                    }
                    // html += ' <span class="end_due_date assignBy_name" data="'+findObjForUser(cv.assignedby).fullname+'">Assigned by '+findObjForUser(cv.assignedby).fullname+' </span>'
                }
            }
            html += '</div>'
        } else if (assusr != user_id && cv.assignedby == assusr && cv.assign_status == assusr) {
            html += '<div class="assign_info">'
            html += '<span class="createdBy_name"> Created  by ' + findObjForUser(cv.created_by).fullname + ' on ' + moment(cv.created_at).format('MMM Do YYYY - h:mm a') + ' </span>';
            if (cv.last_updated_by != null) {
                html += ' <span class="end_due_date upBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Updated by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span>'
            }
            if (assusr != null) {
                if (cv.end_due_date != null) {
                    html += '<span class="end_due_date assignee_name" data="' + findObjForUser(assusr).fullname + '">' + (cv.last_updated_by != null ? ' | ' : ' | ') + 'Self-assigned by ' + findObjForUser(assusr).fullname + '</span> '
                    if (cv.checklist_status == 0) {
                        html += ' <span class="end_due_date _due_date" data="' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                    } else {
                        html += ' <span class="end_due_date compBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Completed by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + ' </span>'
                    }
                    // html += ' <span class="end_due_date assignBy_name" data="'+findObjForUser(cv.assignedby).fullname+'">Assigned by '+findObjForUser(cv.assignedby).fullname+' </span>'
                }
            }
            html += '</div>'
        } else {
            html += '<div class="assign_info">'
            html += '<span class="createdBy_name"> Created  by ' + findObjForUser(cv.created_by).fullname + ' on ' + moment(cv.created_at).format('MMM Do YYYY - h:mm a') + ' </span>';
            if (cv.last_updated_by != null) {
                html += ' <span class="end_due_date upBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Updated by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span>'
            }
            if (assusr != null) {
                if (cv.end_due_date != null) {
                    html += '<span class="end_due_date assignee_name" data="' + findObjForUser(assusr).fullname + '">' + (cv.last_updated_by != null ? ' | ' : ' | ') + 'Assigned to ' + findObjForUser(assusr).fullname + ' </span>'
                    if (cv.checklist_status == 0) {
                        html += ' <span class="end_due_date _due_date" data="' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (cv.end_due_date != null ? moment.unix(Number(cv.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>'
                    }
                    html += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(cv.assignedby).fullname + '">| Assigned by ' + findObjForUser(cv.assignedby).fullname + ' </span>'
                    if (cv.checklist_status != 0) {
                        html += ' <span class="end_due_date compBy_name" data="' + findObjForUser(cv.last_updated_by).fullname + '">| Completed by ' + findObjForUser(cv.last_updated_by).fullname + ' on ' + moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a') + ' </span>'
                    }
                }

                if (cv.checklist_status == 0) {
                    // if((cv.created_by == user_id || adminArra.indexOf(user_id) > -1) && assusr != user_id ){
                    if (assusr != user_id) {
                        if (cv.assign_status == 1 && cv.assignedby == user_id) {
                            html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span style="color: red">Declined </span>  <span class="success_btn red_color" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" data-type="Review" onclick="open_duedate_box(this)" action="declined">Review</span></span></div>';
                        } else if (cv.Request_ttl_by != null && cv.assignedby == user_id) {
                            html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span style="color: red">Extension requested </span>  <span class="success_btn red_color" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" data-type="Review" onclick="open_duedate_box(this)">Review</span></span></div>';
                        }
                        if (cv.assign_status == user_id && cv.assignedby == user_id && cv.Request_ttl_by == null && cv.end_due_date != null) {
                            html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn red_color" data-id="' + cv.checklist_id + '">Pending Acceptance. </span></div>';
                        }
                    } else {
                        if (cv.assign_status != null && cv.assign_status != 2 && cv.assign_status != user_id && assusr == user_id) {
                            if ((cv.assignee_change_reason != null || cv.assign_decline_note != null) && cv.assign_status != 1 && cv.Request_ttl_by == null) {
                                html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn" data-id="' + cv.checklist_id + '"><span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" data-type="Request" onclick="open_duedate_box(this)">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
                                due_date_is_today = false;
                            } else if (cv.assign_status == 1 && assusr == user_id) {
                                html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn red_color" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" data-type="cancel_decline" msg-id="' + cv.msg_id + '" checklist-id="' + cv.checklist_id + '" data-reciver="' + cv.assignedby + '" onclick="requesttlBtn(this)">Cancel Decline</span></span></div>';
                            } else if (cv.Request_ttl_by == user_id) {
                                html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn red_color" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" data-type="cancel_request" msg-id="' + cv.msg_id + '" checklist-id="' + cv.checklist_id + '" data-reciver="' + cv.assignedby + '" onclick="requesttlBtn(this)">Cancel Extension request</span></span></div>'
                            } else {
                                html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn" data-id="' + cv.checklist_id + '"><span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" data-type="Request" onclick="open_duedate_box(this)">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
                                due_date_is_today = false;
                            }
                        }
                    }

                    if (due_date_is_today && assusr == user_id && cv.assignedby != user_id) {
                        if (cv.assign_status == 2 && cv.Request_ttl_by == user_id) {
                            html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn red_color" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" data-type="cancel_request" msg-id="' + cv.msg_id + '" checklist-id="' + cv.checklist_id + '" data-reciver="' + cv.assignedby + '" onclick="requesttlBtn(this)">Cancel Extension request</span></span></div>'
                        } else {
                            if (cv.Request_ttl_by == null) {
                                html += '<div class="ttl_requestTime ttl_request' + cv.checklist_id + '">| <span class="success_btn" data-id="' + cv.checklist_id + '"><span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Mark complete" onclick="open_duedate_box(this)">Mark complete</span></span></div>';
                            }
                        }
                    }
                }
            }
            html += '</div>'
        }
        // html += '<div  style=display:none !important" class=" created_by_div" >Created  by '+findObjForUser(cv.created_by).fullname+' @ '+moment(cv.created_at).format('MMM Do YYYY - h:mm a')+'</div>';
        // if(cv.last_edited_by !== null){
        // 	html += '<div  style="display:none !important; width:auto; margin-left:2px" class=" last_edited_by_div" update-by="'+cv.last_edited_by+'" update-time="'+cv.last_edited_by+'"> | Edited by '+findObjForUser(cv.last_edited_by).fullname+' @ '+moment(cv.last_edited_at).format('MMM Do YYYY - h:mm a')+'</div>'
        // }
        // if(cv.last_updated_by  !== null){
        // 	html += '<div style="display:none !important;  margin-left:2px" class="completed_by last_updated_by_div" update-by="'+cv.last_updated_by+'" update-time="'+cv.last_updated_at+'"> | '+((cv.checklist_status == 0)? 'Unchecked':'Completed')+' by '+findObjForUser(cv.last_updated_by).fullname+' @ '+moment(cv.last_updated_at).format('MMM Do YYYY - h:mm a')+'</div>'
        // }

        html += '</div>';
    });

    // html += '</div>';
    html += '<div class="updatebtn">';
    html += '<div class="update_btn" onclick="updateCheckList(\'' + data.msg_id + '\')">Submit</div>';
    html += '<div class="cancel_btn" onclick="cancelEditAction(this,\'' + data.msg_id + '\')">Close</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    //    return html;
    if (!data.hasDelete) {
        return html;
    }
}

function _task_opt_popup(el) {
    var ele = $(el).parents('.checkListItem').find('._task_opt_popup');
    if (ele.is(':visible')) {
        ele.hide();
        $(el).removeClass('active');
    } else {
        $('.checkListItem').find('._task_opt_popup').hide();
        $(el).addClass('active');
        ele.show();
    }
}

function filterchecklistLastime(msgid, type, el) {
    var totalcompletecl = $('#data_msg_body' + msgid).find('.checkBox.checked').length;
    var totalcl = $('#data_msg_body' + msgid).find('.checkBox').length;
    $('.breakText.rm_hidden_mob').removeClass('active');
    if (type != 'show_activity') {
        $('.filter_by').attr('active-filter', '');
        $('.filter_by_name').text('');
        $('.editMessageBody .filterpending').removeClass('active');
        $('.editMessageBody .filterMypending').removeClass('active');
        $('.editMessageBody .filterMyResReq').removeClass('active');
        $('.editMessageBody .filterShowall').removeClass('active');
        $('.filter_popup li').removeClass('active');
    }
    $(el).addClass('active');
    // S1
    // 
    if (type == 'pending') {
        $('.editMessageBody .P1').addClass('active');
        $('.msg_id_' + msgid).addClass('view_pending');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');
        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkBox').parent('.checkListItem').show();
        $('.msg_id_' + msgid).find('.checkListItem.new_item .checkBoxTitle').focus();
    } else if (type == 'my_pending') {
        $('.editMessageBody .MP1').addClass('active');
        $('.msg_id_' + msgid).addClass('my_pending');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');
        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkBox').parent('.checkListItem').show();
        $('.msg_id_' + msgid).find('.checkListItem.new_item .checkBoxTitle').focus();
    } else if (type == 'my_res_req') {
        $('.editMessageBody .MR1').addClass('active');
        $('.msg_id_' + msgid).addClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');
        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkBox').parent('.checkListItem').show();
    } else if (type == 'com_all') {
        $('.editMessageBody .C1').addClass('active');
        $('#filterCompletedall_' + msgid).removeClass('unread');
        $('#filterShowall_' + msgid).text('Show All (' + totalcl + ')');
        $('#filterShowall_' + msgid).attr('data-all', totalcl);
        $('#filterShowall_' + msgid).removeClass('active');

        $('.msg_id_' + msgid).addClass('view_complete');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');
        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkBox').parent('.checkListItem').show();
    } else if (type == 'show_assigned') {
        $('.editMessageBody .AS1').addClass('active');
        $('#filterCompletedall_' + msgid).removeClass('unread');
        $('#filterShowall_' + msgid).text('Show All (' + totalcl + ')');
        $('#filterShowall_' + msgid).attr('data-all', totalcl);
        $('#filterShowall_' + msgid).removeClass('active');

        $('.msg_id_' + msgid).addClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');

        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkListItem').show();
    } else if (type == 'show_unassigned') {
        $('.editMessageBody .US1').addClass('active');
        $('#filterCompletedall_' + msgid).removeClass('unread');
        $('#filterShowall_' + msgid).text('Show All (' + totalcl + ')');
        $('#filterShowall_' + msgid).attr('data-all', totalcl);
        $('#filterShowall_' + msgid).removeClass('active');

        $('.msg_id_' + msgid).addClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');

        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkListItem').show();
    } else if (type == 'show_over_due') {
        $('.editMessageBody .OD1').addClass('active');
        $('#filterCompletedall_' + msgid).removeClass('unread');
        $('#filterShowall_' + msgid).text('Show All (' + totalcl + ')');
        $('#filterShowall_' + msgid).attr('data-all', totalcl);
        $('#filterShowall_' + msgid).removeClass('active');

        $('.msg_id_' + msgid).addClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');

        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkListItem').show();
    } else if (type == 'me_all') {
        $('#filterShowall_' + msgid).removeClass('active');
        $('.item_more_items.filter_other').removeClass('active');
        $('.item_more_items.filter_me').addClass('active');

        $('.msg_id_' + msgid).addClass('crtBy_me');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('crtBy_other');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');

        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkListItem.crt_other').hide();
        $('.msg_id_' + msgid).find('.checkListItem').show();
    } else if (type == 'other_all') {
        $('#filterShowall_' + msgid).removeClass('active');
        $('.item_more_items.filter_me').removeClass('active');
        $('.item_more_items.filter_other').addClass('active');
        $('.msg_id_' + msgid).addClass('crtBy_other');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('crtBy_me');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).removeClass('filter_assign');

        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.msg_id_' + msgid).find('.checkListItem.crt_me').hide();
        $('.msg_id_' + msgid).find('.checkListItem').show();
    } else if (type == 'assigneeF') {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#filterShowall_' + msgid).removeClass('active');
        $('.item_more_items.assigneeF').removeClass('active');
        $(e.target).addClass('active');
        $('.msg_id_' + msgid).addClass('filter_assign');
        $('.msg_id_' + msgid).removeClass('my_res_req');
        $('.msg_id_' + msgid).removeClass('my_pending');
        $('.msg_id_' + msgid).removeClass('show_over_due');
        $('.msg_id_' + msgid).removeClass('show_assigned');
        $('.msg_id_' + msgid).removeClass('show_unassigned');
        $('.msg_id_' + msgid).removeClass('view_complete');
        $('.msg_id_' + msgid).removeClass('view_pending');
        $('.msg_id_' + msgid).find('.checkListItem').removeClass('hiddenCl');
        $('.checkListItem').removeClass('f_byAssign');

        // var assList = [];
        $('.filter_by').attr('active-filter', name);
        $('.filter_by_name').html('Filtered by ' + name + ' only <span class="close_filter" onclick="filterchecklistLastime(\'' + msgid + '\',\'showall\')"></span>');

        $.each($('.editMessageBody').find('.checkListItem'), function(k, v) {
            var name2 = $(v).find('.assignee_name').attr('data');

            if (name != undefined) {
                if (name2 != undefined) {
                    if (name == name2) {
                        $(v).addClass('f_byAssign');
                    }
                }
            }
        });
        if ($('#threadReplyPopUp').is(':visible')) {
            $('.main-thread-msgs.main_thread').addClass('filter_assign');
        }
    } else if (type == 'show_activity') {
        var el = $('.msg_id_' + msgid).find('.filterShowall.show_activity');

        if ($(el).hasClass('active')) {
            $('.editMessageBody .SA1').removeClass('active');
            $(el).removeClass('active');
            $('.msg_id_' + msgid).find('.activity_list_all').hide();
            $('.msg_id_' + msgid).find('.assign_info').show();
            $('.msg_id_' + msgid).find('.ttl_requestTime').show();
        } else {
            $(el).addClass('active');
            $('.msg_id_' + msgid).find('.activity_list_all').show();
            $('.msg_id_' + msgid).find('.assign_info').hide();
            $('.msg_id_' + msgid).find('.ttl_requestTime').hide();
        }
    } else {
        if ($('#threadReplyPopUp').is(':visible')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $('.main-thread-msgs.main_thread').removeClass('filter_assign');
        } else {
            $('.editMessageBody .S1').addClass('active');
            $('.filterShowall.showAllChecklist').addClass('active');
            $('.msg_id_' + msgid).removeClass('my_res_req');
            $('.msg_id_' + msgid).removeClass('my_pending');
            $('.msg_id_' + msgid).removeClass('show_over_due');
            $('.msg_id_' + msgid).removeClass('show_assigned');
            $('.msg_id_' + msgid).removeClass('show_unassigned');
            $('.msg_id_' + msgid).removeClass('view_complete');
            $('.msg_id_' + msgid).removeClass('view_pending');
            $('.msg_id_' + msgid).removeClass('filter_assign');
            $('.item_more_items.filter_me').removeClass('active');
            $('.item_more_items.filter_other').removeClass('active');
            $('#data_msg_body' + msgid).find('.checkListItem').show();
        }
    }

    $('.filter_popup').hide();
}



function rm_hidden_mob(ele) {
    if ($('.filter_popup').is(':visible')) {
        $('.filter_popup').hide();
        $(ele).removeClass('active');
    } else {
        $(ele).addClass('active');
        $('.filter_popup').show();
    }
}

var last_checkList_body = '';

function updateCheckList(msg_id) {

    var participants_of_chk = participants;
    var removeItem = [];
    var item_ids = [];
    if (participants_of_chk.indexOf(user_id) == -1) {
        participants_of_chk.push(user_id);
    }

    $.each($('#msgCheckItemContainer .checkListPlainText'), function(k, v) {
        if ($(v).text() == '') {
            $(v).remove();
        }
    });

    $.each($('#msgCheckItemContainer .checkListItem'), function(k, v) {
        if ($(v).find('.checkBoxTitle').text() == '') {
            var id = $(v).attr('checklist-id');
            if (id != undefined) {
                removeItem.push(id);
            }
            $(v).remove();
        }
        if ($(v).hasClass('waiting_3') && $(v).find('.new_chk').length > 0) {
            var id = $(v).attr('checklist-id');
            var assign_id = $(v).attr('assign-to');
            if (assign_id != undefined && assign_id == user_id) {
                item_ids.push(id);
            }
        }
    });

    // var updateAt = ''+new Date().getTime()+'';
    var elHtml = $('.msg_id_' + msg_id).find('.msgCheckListContainer')[0].outerHTML;
    var id = msg_id;

    var str = elHtml;
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    var strOld = oldMsgHtml;
    strOld = strOld.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    strOld = convert(strOld);
    strOld = strOld.replace(/&nbsp;/gi, '').trim();
    strOld = strOld.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');

    if (str == strOld || str == '') {
        $('.editMessageBody').remove();
        $('.msg_id_' + id + ' #data_msg_body' + id + '').append(oldMsgHtml);
        $('#groupChatContainer').removeClass('editChecklist_active');

        $('.msg_id_' + id).attr('check_edit', false);
        $('.msg_id_' + id).removeClass('editable_msg');
        $('.msg_id_' + id).removeClass('editable_checklistMsg');
        $('#single_chat_section').removeClass('editChecklist_active');
        $('.msgCheckListBtnGroup').hide();
    } else {
        // if(str == ''){
        // 	$('.editMessageBody').remove();
        // 	$('.msg_id_'+id+' #data_msg_body'+id+'').append(oldMsgHtml);
        // 	$('.msg_id_'+id).removeAttr('style');
        // 	$('.msg_id_'+id+' .msgs-form-users-options').removeAttr('style');

        // 	if($('#data_msg_body'+id).hasClass('updatedAtText')){
        // 		$('#updatedMsgBody'+id+' .updatedTextP').show();
        // 		$('#msgThread_'+id+' .deleSingleMsgConnect').remove();
        // 	}
        // }else{
        var updateAt = new Date().getTime();
        var attch_audiofile = [];
        var attch_imgfile = [];
        var attch_otherfile = [];
        var attch_videofile = [];

        var taskLinks = [];
        $.each($('.editable_checklistMsg .checkListItem.needUpdate'), function(k, v) {
            var allLink = linkify($(v).find('.checkBoxTitle').text().trim()).split('$_link_$');
            $.each(allLink, function(k, v) {
                if (v != '') {
                    if (taskLinks.indexOf(v.trim()) == -1) {
                        taskLinks.push(v.trim());
                    }
                }
            });
        });
        $.each($('.editable_checklistMsg .checkListItem.new_item'), function(k, v) {
            var allLink = linkify($(v).find('.checkBoxTitle').text().trim()).split('$_link_$');
            $.each(allLink, function(k, v) {
                if (v != '') {
                    if (taskLinks.indexOf(v.trim()) == -1) {
                        taskLinks.push(v.trim());
                    }
                }
            });
        });
        $.each($('.editable_checklistMsg .checkListItem.just_added'), function(k, v) {
            var allLink = linkify($(v).find('.checkBoxTitle').text().trim()).split('$_link_$');
            $.each(allLink, function(k, v) {
                if (v != '') {
                    if (taskLinks.indexOf(v.trim()) == -1) {
                        taskLinks.push(v.trim());
                    }
                }
            });
        });

        console.log(14118, taskLinks);

        var data = {
            conv_id: conversation_id,
            msg_id: id,
            msg_body: elHtml,
            update_at: updateAt.toString(),
            sender: $('.msg_id_' + id).attr('data-senderid'),
            sender_img: $('.msg_id_' + id).attr('data-senderimg'),
            sender_name: $('.msg_id_' + id).attr('data-sendername'),
            attch_audiofile: attch_audiofile,
            attch_imgfile: attch_imgfile,
            attch_otherfile: attch_otherfile,
            attch_videofile: attch_videofile,
            created_at: $('.msg_id_' + id).attr('data-msg-date'),
            has_flagged: (($('.msg_id_' + id).attr('flaged-data') != '') ? $('.msg_id_' + id).attr('flaged-data').split(',') : [])
        };

        if (removeItem.length > 0) {
            var d2 = {
                conv_id: conversation_id,
                msg_id: id,
                removeItem: removeItem
            }
            socket.emit('removeItem', d2, function(res) {
                console.log(13624, res);
            });
        }

        if (item_ids.length > 0) {
            var updateData = {
                msg_id: id,
                checklist_id: item_ids,
                assign_status: "2",
                assign_decline_note: null,
                type: 'assign_accept_ar'
            }
            socket.emit('manage_checklist', updateData, function(res) {
                console.log(13605, res);
            });
        }

        socket.emit('msg_fully_delete', data, (res) => {
            var clData = {
                conversation_id: conversation_id,
                conversation_type: conversation_type,
                conversation_title: $("#conv" + conversation_id).attr("data-name"),
                msg_id: id,
                msg_body: elHtml,
                participants: participants_of_chk,
                allLink: taskLinks,
                user_id: user_id
            }
            var stringBody = {
                conversation_id: conversation_id,
                conversation_type: conversation_type,
                msg_id: id,
                checklist_title: $('.msg_id_' + id).find('.checkListPlainText').text()
            }
            var noti_data = {
                type: 'checklist_changes',
                title: 'edit_checklist',
                body: JSON.stringify(stringBody),
                created_at: new Date(),
                created_by: user_id,
                seen_users: [user_id],
                receive_users: participants
            }
            if (type == 'remove_msg') {
                $('.msg_id_' + data.msg_id).remove();
            }
            insertNotiFun(noti_data);
            socket.emit('updateChecklistLastTime', clData, function(res) {
                console.log(1582, res)
                    // has_incompleted_checklist_yet();
            });
            if (type == 'remove_msg') {
                // $('.msg_id_'+data.msg_id).remove();
                $('#groupChatContainer').removeClass('editChecklist_active');
            }
        });
        // }
    }
}

var temp_assign_checklist_id = [];

function only_add_remove_assignee(msg_id, checklist_id, type) {
    console.log(15855, { msg_id, checklist_id, user_id, type });
    socket.emit('only_add_remove_assignee', { msg_id, checklist_id, user_id, type }, (res) => {
        console.log(15856, res);
        if (type == 'add') {
            temp_assign_checklist_id.push(checklist_id);
            $(".perchecklist_" + checklist_id).attr('assigned-by', user_id);
            $(".perchecklist_" + checklist_id).attr('assign-to', user_id);

            $(".perchecklist_" + checklist_id).find('.dueDateIcon').addClass("AssigneeUser").addClass("active");
            $(".perchecklist_" + checklist_id).find('.dueDateIcon').attr('data-assignee', user_id);
            $(".perchecklist_" + checklist_id).find('.dueDateIcon').attr('end-date', moment().format());
            $(".perchecklist_" + checklist_id).find('.dueDateIcon').html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(user_id).img + '">');
        } else {
            temp_assign_checklist_id.splice(temp_assign_checklist_id.indexOf(checklist_id));
            $(".perchecklist_" + checklist_id).attr('assigned-by', 'null');
            $(".perchecklist_" + checklist_id).attr('assign-to', 'null');

            $(".perchecklist_" + checklist_id).find('.dueDateIcon').removeClass("AssigneeUser").removeClass("active");
            $(".perchecklist_" + checklist_id).find('.dueDateIcon').attr('data-assignee', 'null');
            $(".perchecklist_" + checklist_id).find('.dueDateIcon').attr('end-date', 'null');
            $(".perchecklist_" + checklist_id).find('.dueDateIcon>img').remove();
        }
    })
}

function selectCheckItem(ele) {
    var updateAt = moment().format();
    var row = $(ele).parent('.checkListItem');
    var c_id = $(ele).parent('.checkListItem').attr('checklist-id');
    var assignedby = row.attr('assigned-by');
    var assign_to = row.attr('assign-to');
    var donemark = [];

    if (assignedby != null && assignedby != 'null' && assignedby != undefined) {
        if (donemark.indexOf(user_id) == -1) {
            donemark.push(assignedby);
        }
    }

    if (assign_to != null && assign_to != 'null' && assign_to != undefined) {
        if (donemark.indexOf(user_id) == -1) {
            donemark.push(assign_to);
        }
    }

    if (row.hasClass('has_assign')) {
        if (donemark.indexOf(user_id) == -1) {
            if (conversation_type == 'group') {
                if (adminArra.indexOf(user_id) == -1) {
                    return false;
                }
            }
        }
    } else {
        if (assign_to == null || assign_to == 'null' || assign_to === undefined) {
            assignedby = assign_to = user_id;
            console.log('only_add_remove_assignee');
            only_add_remove_assignee(row.attr("msg_id"), row.attr("checklist-id"), 'add');
        }
    }

    if ($(ele).parents('.user_msg').length == 1) {
        if ($(ele).parents('.user_msg').find('.showMorechecklist').is(':visible')) {
            $(ele).parents('.user_msg').find('.showMorechecklist').trigger('click');
        }

        $('.user_msg').attr('check_edit', false);
        if (!$('.editMessageBody #msgCheckItemContainer').is(':visible')) {
            $(ele).parents('.user_msg').attr('check_edit', true);
        }

        var elHtml = $(ele).parents('.user_msg').find('.msgCheckListContainer')[0].outerHTML;
        if ($(ele).parents('.editMessageBody').length == 1) {
            console.log(111)
            if ($(ele).hasClass('radio_btn')) {
                console.log(222)
                if ($(ele).next('.checkBoxTitle').text() !== '') {
                    $(ele).parents('.editMessageBody').find('.checkBox').removeClass('checked');
                    $(ele).parents('.editMessageBody').find('.completed_by').remove();
                    $(ele).addClass('checked');
                    row.attr('checklist_status', 1);
                    $(ele).parent('.checkListItem').append('<div class="completed_by" update-by="' + user_id + '" update-time="' + moment().format('MM/DD/YYYY hh:mm:ss') + '">Completed by ' + user_fullname + ' @ ' + moment(new Date()).format('MMM Do YYYY - h:mm a') + '</div>');
                }
            } else if ($(ele).hasClass('list_item') == false) {
                console.log(333)
                if ($(ele).hasClass('checked')) {
                    $(ele).parent('.checkListItem').find('.completed_by').remove();
                    $(ele).removeClass('checked');
                    row.attr('checklist_status', 0);
                    row.attr('review_status', 0);
                    row.removeClass('marked');

                    if ($(ele).parent('.checkListItem').hasClass('completed_item')) {
                        if ($(ele).hasClass('new_unchk')) {
                            $(ele).removeClass('new_unchk')
                        } else {
                            $(ele).addClass('new_unchk');
                        }
                    } else {
                        $(ele).removeClass('new_chk');
                        if (!row.hasClass('has_assign')) {
                            only_add_remove_assignee(row.attr("msg_id"), row.attr("checklist-id"), 'remove');
                        }
                    }
                } else {
                    if ($(ele).next('.checkBoxTitle').text() !== '') {
                        $(ele).parent('.checkListItem').find('.completed_by').remove();
                        $(ele).parent('.checkListItem').append('<div class="completed_by" update-by="' + user_id + '" update-time="' + moment().format('MM/DD/YYYY hh:mm:ss') + '">Completed by ' + user_fullname + ' @ ' + moment(new Date()).format('MMM Do YYYY - h:mm a') + '</div>');
                        $(ele).addClass('checked');
                        row.attr('checklist_status', 1);
                        row.addClass('marked');

                        if ($(ele).parent('.checkListItem').hasClass('pending_item')) {
                            if ($(ele).hasClass('new_chk')) {
                                $(ele).removeClass('new_chk');
                            } else {
                                $(ele).addClass('new_chk');
                            }
                        } else {
                            $(ele).removeClass('new_unchk');
                        }
                        var id = $(ele).parents('.user_msg').attr('data-msgid');

                        if (last_checkList_body !== '') {
                            if (last_checkList_body.msg_id !== id) {
                                last_checkList_body = {
                                    msg_id: id,
                                    msg_body: elHtml
                                }
                            }
                        } else {
                            last_checkList_body = {
                                msg_id: id,
                                msg_body: elHtml
                            }
                        }
                    }
                }

                var el = $('.editable_msg .checkListPlainText');
                var old_v = el.attr('title').trim();
                var new_v = el.text().trim();
                var has_update = false;
                if (old_v != new_v) {
                    has_update = true;
                }
                if ($('.editable_msg .new_chk').length > 0 || $('.editable_msg .new_unchk').length > 0) {
                    $(ele).parents('.msg_body').find('.msgCheckListBtnGroup').removeClass('backChat');
                    $(ele).parents('.msg_body').find('.msgCheckListBtnGroup').addClass('chk_active');
                } else {
                    if (has_update == false) {
                        $(ele).parents('.msg_body').find('.msgCheckListBtnGroup').addClass('backChat');
                        $(ele).parents('.msg_body').find('.msgCheckListBtnGroup').removeClass('chk_active');
                    }
                }
            }
        } else {
            if ($(ele).hasClass('list_item') == false) {
                if ($(ele).hasClass('checked')) {
                    if ($(ele).hasClass('radio_btn') == false) {
                        $(ele).parent('.checkListItem').find('.completed_by').remove();
                        $(ele).parent('.checkListItem').append('<div class="completed_by" update-by="' + user_id + '" update-time="' + moment().format('MM/DD/YYYY hh:mm:ss') + '">Unchecked by ' + user_fullname + ' @ ' + moment(new Date()).format('MMM Do YYYY - h:mm a') + '</div>');
                        $(ele).removeClass('checked');
                    }
                } else {
                    if ($(ele).hasClass('radio_btn')) {
                        $(ele).parents('.msgCheckListContainer').find('.completed_by').remove()
                        $(ele).parents('.msgCheckListContainer').find('.checkBox').removeClass('checked');
                    }
                    $(ele).parent('.checkListItem').find('.completed_by').remove();
                    $(ele).parent('.checkListItem').append('<div class="completed_by" update-by="' + user_id + '" update-time="' + moment().format('MM/DD/YYYY hh:mm:ss') + '">Completed by ' + user_fullname + ' @ ' + moment(new Date()).format('MMM Do YYYY - h:mm a') + '</div>');
                    $(ele).addClass('checked');
                    var id = $(ele).parents('.user_msg').attr('data-msgid');

                    if (last_checkList_body !== '') {
                        if (last_checkList_body.msg_id !== id) {
                            last_checkList_body = {
                                msg_id: id,
                                msg_body: elHtml
                            }
                        }
                    } else {
                        last_checkList_body = {
                            msg_id: id,
                            msg_body: elHtml
                        }
                    }

                }
            }
        }
    }
}

function msgChecklistBlur(e) {
    if ($(e.target).text() == '') {
        $(e.target).html('');
    }
}

function showMoreChecklist(elm) {
    $(elm).parent('.msgCheckListContainer').find('.checkListItem').removeClass('hiddenCl');
    $(elm).remove();
}

function toggleChecklistf(msgid) {
    var allchecklist = $('#data_msg_body' + msgid).find('.checkListItem');
    if ($('#data_msg_body' + msgid).find('.filterchecklist').hasClass('active')) {
        $('#data_msg_body' + msgid).find('.filterchecklist').removeClass('active');
        $('#data_msg_body' + msgid).find('.filterchecklist').text('Show Pending (' + $('#data_msg_body' + msgid).find('.filterchecklist').attr('data-in') + ')');
        $('#data_msg_body' + msgid).find('.checkListItem').show();
        $('#clcounterperMsg' + msgid).show();
    } else {
        $('#data_msg_body' + msgid).find('.filterchecklist').addClass('active');
        $('#data_msg_body' + msgid).find('.showMorechecklist').click();

        $.each(allchecklist, function(k, v) {
            if (!$(v).find('.checkBox').hasClass('checked')) {
                $(v).show();
            } else {
                $(v).hide();
            }
        });
        $('#clcounterperMsg' + msgid).hide();
        $('#data_msg_body' + msgid).find('.filterchecklist').text('Show All (' + $('#data_msg_body' + msgid).find('.filterchecklist').attr('data-length') + ')');
    }
}

function makeEditablechecklist(e, u, m) {
    // if(!$(e.target).hasClass('filterchecklist')){
    // 	if($('#msgid_'+m).attr('check_edit') == "true" || $('#msgid_'+m).find('.editMessageBody').length > 0 ){
    // 		return false;
    // 	}else{
    // 		var hasright = false;
    // 		if(adminListUUID != null){
    // 			if(adminListUUID.indexOf(user_id) > -1 || u == user_id){
    // 				hasright = true;
    // 			}
    // 		}else if(u == user_id){
    // 			hasright = true;
    // 		}
    // 		if(hasright){
    // 			if($(e.target).hasClass('checkBox') || $(e.target).hasClass('filterpending') || $(e.target).hasClass('filterShowall') || $(e.target).hasClass('showMorechecklist') ){
    // 				return false;
    // 			}else{
    // 				ediCheckListMessage(m);
    // 			}
    // 		}else{
    // 			return false;
    // 		}
    // 	}
    // }
}

var checklistRepText = null;

function openThreadForCheckI(event, elm) {
    var cid = $(event.target).attr('checklist-id');
    var mid = $(event.target).attr('msg_id');
    var t = $(event.target).parents('.checkListItem').find('.checkBoxTitle').text();
    checklistRepText = t;
    if (checklistRepText != null) {
        $('#define_thread_text').remove();
        $('.write-thread-msgs').prepend('<div id="define_thread_text">' + checklistRepText + '</div>');
    }
    open_reply_msg(mid);
}

function viewMediaImagePopup(msg_id, elm) {

    let prnt = $(elm).parents('.attach_img').find('.imgholder[data-status="active"] img'),
        src = prnt.attr('src'),
        tag = prnt.attr('file-tag'),
        sender = $(elm).attr('sender-id'),
        name = src.split('/')[src.split('/').length - 1];
    if (!$('#msgid_' + msg_id).hasClass('selected_msg')) {

        if (prnt.length == 1) {
            var file_id = prnt.attr('file-id');
            $('.img_container').html('').attr('data', '1');
            var html = '<div class="fil_attach each_img_prev img_' + msg_id + '" file-id="' + file_id + '" style="position: relative">';
            html += '<div class="fileInfrm">';
            html += '	<p class="name_span">' + name + '</p>';
            html += '	<p class="file_size"></p>';
            html += '</div>';
            html += '<img src="' + src + '" class="view_image_holder">';
            html += '<div class="per_img_hover_opt">';
            html += '<p class="img_action">';
            html += '<a download target="_blank" href="' + src + '" style="width: unset !important;">';
            html += '<img src="/images/basicAssets/mobile/view.svg" alt=""/>';
            html += '</a>';
            html += '</p>';
            html += '<p class="img_action" onclick="downloadAnyFile(event, this); //show_noti(event)" data-href="' + src + '">';
            html += '	<a download="' + name + '" target="_blank" href="/alpha2/download/' + name + '" style="width: unset !important;">';
            html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
            html += '	</a>';
            html += '</p>';
            html += '<p class="img_action" msg-id="' + msg_id + '" file-tag="' + tag + '" onclick="viewTagForFiles(event,this,\'frmFile\')"><img style="width:16px;" src="/images/basicAssets/mobile/tag.svg" alt=""/></p>';
            html += '<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + src + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
            html += '<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="' + src + '"><img src="/images/basicAssets/mobile/info.svg" alt=""/></p>';
            if (sender == user_id) {
                html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="img" msg-id="' + msg_id + '" data-value="' + src + '"></p>';
            }
            html += '</div>';
            html += '</div>';
            $('.img_container').append(html);
        } else {
            $('.img_container').html('').attr('data', '1+');
            $.each(prnt, function(k, v) {
                let srcdata = $(v).attr('src'),
                    file_id = $(v).attr('file-id'),
                    name = srcdata.split('/')[srcdata.split('/').length - 1];

                var html = '<div class="fil_attach each_img_prev img_' + msg_id + '" file-id="' + file_id + '" style="position: relative">';
                html += '<div class="fileInfrm">';
                html += '	<p class="name_span">' + name + '</p>';
                html += '	<p class="file_size"></p>';
                html += '</div>';
                html += '<img src="' + srcdata + '" class="view_image_holder">';
                html += '<div class="per_img_hover_opt">';
                html += '<p class="img_action">';
                html += '<a download target="_blank" href="' + srcdata + '" style="width: unset !important;">';
                html += '<img src="/images/basicAssets/mobile/view.svg" alt=""/>';
                html += '</a>';
                html += '</p>';
                html += '<p class="img_action" onclick="downloadAnyFile(event, this); //show_noti(event)" data-href="' + srcdata + '">';
                html += '	<a download="' + name + '" target="_blank" href="/alpha2/download/' + name + '" style="width: unset !important;">';
                html += '		<img src="/images/basicAssets/mobile/download.svg" alt="" >';
                html += '	</a>';
                html += '</p>';
                html += '<p class="img_action" msg-id="' + msg_id + '" file-tag="' + tag + '" onclick="viewTagForFiles(event,this,\'frmFile\')"><img style="width:16px;" src="/images/basicAssets/mobile/tag.svg" alt=""/></p>';
                html += '<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + srcdata + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
                html += '<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="' + srcdata + '"><img src="/images/basicAssets/mobile/info.svg" alt=""/></p>';
                if (sender == user_id) {
                    html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="img" msg-id="' + msg_id + '" data-value="' + srcdata + '"></p>';
                }
                html += '</div>';
                html += '</div>';
                $('.img_container').append(html);
                $('.img_container').scrollTop(0);
            });
        }
        $('#image_viewer').show();
    }
}


function imageSaveLink(e) {
    e.preventDefault();
    $('.view_image_holder').multiDownload();
}

/**
 * Pin and unpin a conversation
 */
function pinme(convid) {
    pin_unpin({ pinnedNumber: 'findnoofpin', blockID: convid, type: 'pin' });
}

function unpinme(id, convid, e) { // id = pin table id
    e.preventDefault();
    e.stopImmediatePropagation();
    pin_unpin({ pinnedNumber: '', targetID: id, blockID: convid, type: 'unpin' });
}

function pin_unpin(data) {
    $.ajax({
        type: 'POST',
        data: data,
        dataType: 'json',
        url: '/connect/pinning',
        success: function(res) {

            if (res.msg == 'pin') {
                param_change('unpin', 'pin');
            } else if (res.msg == 'unpin') {
                if (!$('.more_noti').is(':visible')) {
                    param_change('pin', 'unpin');
                }
            }
            if (data.type == 'unpin') {
                $(".convid" + data.blockID).find(".pin").removeClass("active");
                $(".convid" + data.blockID).parent().find(".unpinuser:first").before($(".convid" + data.blockID));
            }
            $('#more_options_chat').hide();
        }
    });
};

$('#msg').on('keydown', function(event) {
    var code = event.keyCode || event.which;
    // if (code == 13 && !event.shiftKey) { //Enter keycode = 13
    //   event.preventDefault();
    //   msg_form_submit();

    //   foundUrlTemp = '';
    //   hasurlTemp = 1;
    //   blockUrlPreview = false;
    //   if ($('#msgUrlPreview').is(':visible')) {
    // 	  closeModal('msgUrlPreview');
    //   }

    // }else{
    //   blockUrlPreview = true;
    // }

    // When typing start into message box
    if (typing === false) {
        typing = true;
        socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: false, msg_id: false });
        timeout = setTimeout(timeoutFunction, 2000);
    }
});

function getSelectionCharacterOffsetWithin(element) {
    var start = 0;
    var end = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            end = preCaretRange.toString().length;
        }
    } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToStart", textRange);
        start = preCaretTextRange.text.length;
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        end = preCaretTextRange.text.length;
    }
    return { start: start, end: end };
}


var mentionisActive = false;
var firstIndexOfMention = 0;
var lastIndexOfMention = 0;
var mentionFor = '';

function keyupfunction(e) {
    var mentioncheck = checkMenOrNot(e, nameArry);
    if (mentioncheck) {
        if (mentioncheck.check == '@') {
            mentionFor = '@';
        } else {
            mentionFor = '!@';
        }
        if (mentioncheck.last_t != '@' && mentioncheck.last_t != '!@') {
            if (!mentionisActive) {
                mentionisActive = true;
                draw_mention_design('#mention_user_list', true, nameArry);
            } else {
                searchMentionFun(e, '#mention_user_list', '.mention_user');
            }
        } else {
            mentionisActive = true;
            draw_mention_design('#mention_user_list', true, nameArry);
        }
    } else {
        mentionFor = '';
        draw_mention_design('#mention_user_list', false, nameArry);
        mentionisActive = false;
    }
}

function searchMentionFun(e, div, item) {
    var t = $(e.target).text();
    var check = '@';
    if (check == '@') {
        var str = t.substring((firstIndexOfMention + 1), lastIndexOfMention + 1);
    } else {
        var str = t.substring((firstIndexOfMention + 2), lastIndexOfMention + 1);
    }
    var c = 0;
    if (str != check && str != ' ') {
        // console.log($('#mention_user_list').find('.mention_user').length)
        $.each($(div).find(item), function(k, v) {
            // console.log($(v),$(v).text())
            if ($(v).find('.name').text().toLowerCase().indexOf(str.toLowerCase()) > -1) {
                c += 1;
                $(v).show();
            } else {
                $(v).hide();
            }
        });
        if (c > 0) {
            $(div).show();
        } else {
            $(div).hide();
        }
    }

}

function addThisMen(elm) {
    var name = $(elm).attr('user-name');
    var div = $(elm).attr('msg-div');
    var main = $(elm).attr('main-div');
    var str = document.getElementById(div).innerHTML;
    var text = $('#' + div).text();

    var useri = $(elm).attr('user-i')
    if (mentionFor == '!@') {
        // console.log(nameArryid[useri])
        var res = str.slice(0, str.lastIndexOf("!@"));

        document.getElementById(div).innerHTML = res;
        var id = nameArryid[useri];
        var personalUser = [];
        //
        var secretDiv = 'secretUserList';
        if (div == 'reply_msg') {
            secretDiv = 'secretUserList_rep';
        }

        if ($('#' + secretDiv).find('.secret_heading').length > 0) {
            personalUser = $('#' + secretDiv).find('.secret_heading').attr('data-id').split(',');
            if (personalUser.indexOf(id) > -1) {
                removeA(personalUser, id);
            } else {
                personalUser.push(nameArryid[useri]);
            }
            $('#' + div).text().trim();
            $('#' + secretDiv).find('.secret_heading').attr('data-id', personalUser.join(','))
        } else {
            var design = '<span onclick="viewmention_div_action()" class="secret_heading hideaftersent" contenteditable="false" style="cursor:pointer" spellcheck="false" data-id="' + id + '"><span>Private message to: ' + name + '</span> <span class="removeSecretUser" onclick="removeSecretUsers(event)"></span></span>';
            // console.log(17865,design)
            $('#' + div).text().trim();
            $('#' + secretDiv).find('.secret_heading.hideaftersent').remove();
            $('#' + secretDiv).prepend(design);
        }

        draw_mention_design(main, false, nameArry, div);
        placeCaretAtEnd(document.getElementById(div));
        privateMsgTo(div, secretDiv);
    } else {
        var res = str.slice(0, str.lastIndexOf("@"));

        document.getElementById(div).innerHTML = res;
        $('#' + div).text().trim();
        var html = '<span onclick="actionMentionUser(\'' + nameArryid[useri] + '\')" data-id="' + nameArryid[useri] + '" class="mention_user_msg solid_mention"  data-mention="' + '@' + name + '"></span>&nbsp;';
        // var html = '<div data-id="'+nameArryid[useri]+'" class="mention_user_msg solid_mention"  data-mention="'+'@'+name+'"></div>&nbsp;'
        $('#' + div).append(html);
        draw_mention_design(main, false, nameArry, div);
        placeCaretAtEnd(document.getElementById(div));
    }

}


var nameArry = [];
var nameArryid = [];
var nameArryimg = [];

function checkMenOrNot(e, user_array, usedoption) {
    var i = window.getSelection().getRangeAt(0).startOffset - 1;
    lastIndexOfMention = i;
    var t = $(e.target).text();
    var el = document.getElementById($(e.target).attr('id'));
    i = (getSelectionCharacterOffsetWithin(el).end - 1);
    if (t[i] == '@') {
        if (i == 0) {
            firstIndexOfMention = i;
            return { index: i, text: t[i], check: '@', last_t: t.charAt(i) }
        } else if (t[i - 1] == ' ' || t.charCodeAt(i - 1) == 160 || t.charCodeAt(i - 1) == 32) {
            firstIndexOfMention = i;
            return { index: i, text: t[i], check: '@', last_t: t.charAt(i) }
        } else {
            if (usedoption == 'both') {
                if (t[i - 1] == '!') {
                    firstIndexOfMention = i;
                    return { index: i, text: t[i], check: '!@', last_t: t.charAt(i) }
                }
            }

        }
    } else {
        var c = 0;
        var check = '@';
        if (firstIndexOfMention != 0) {
            if (t.charAt(firstIndexOfMention - 1) == '!') {
                check = '!@'
            }
        }
        if (lastIndexOfMention != firstIndexOfMention && lastIndexOfMention > firstIndexOfMention) {
            if (check == '@') {
                var str = t.substring((firstIndexOfMention + 1), lastIndexOfMention);
            } else {
                var str = t.substring((firstIndexOfMention + 2), lastIndexOfMention);
            }
            $.each(user_array, function(k, v) {
                if (v.toLowerCase().indexOf(str.toLowerCase()) > -1) {
                    c += 1;
                }
            });
        }
        if (c != 0) {
            return { index: i, text: t[i], check: check, last_t: t.charAt(i) };
        } else {
            return false;
        }
    }
}

function arrowAndEnterFormen(e, id, type) {
    // console.log(e,id)

    if ($('#' + id).is(':visible')) {

        if (e.keyCode == 13) {
            if (type == 'up') {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
                if ($("#" + id + " .mention_user.selected").is(':visible')) {
                    $("#" + id + " .mention_user.selected").trigger('click');
                    return false;
                } else {
                    return false;
                }
            }


        }
        if (e.keyCode == 40 || e.keyCode == 38) {
            if (type == 'up') {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (e.keyCode == 38) {

                    var nextelm = $("#" + id + " .mention_user.selected").prev();
                } else {
                    var nextelm = $("#" + id + " .mention_user.selected").next();

                }
                if ($(nextelm).length == 0) {
                    nextelm = $("#" + id + " .mention_user").first();
                }
                $("#" + id + " .mention_user").removeClass('selected');
                $('#triggerElement').attr('href', nextelm);
                $(nextelm).addClass('selected');
                $('#triggerElement').trigger('click');
                $(nextelm).focus();
                return false;
            }

        }
    }
}

var searchMsgUser = false;
var searchMsgUseRep = false;
var typing = false;
$('body').on('keyup', '#msg', function(e) {
    var str = $('#msg').text();
    // if(str.length == 1){
    // 	placeCaretAtEnd(document.getElementById('msg'));
    // }
    if (!$('#msgCheckItemContainer').is(':visible')) {
        var mentioncheck = checkMenOrNot(e, nameArry, 'both');
        if (mentioncheck) {
            if (mentioncheck.check == '@') {
                mentionFor = '@';
            } else {
                mentionFor = '!@';
            }
            if (mentioncheck.last_t != '@' && mentioncheck.last_t != '!@') {
                // if(!mentionisActive){
                // 	mentionisActive = true;
                // 	draw_mention_design('#mention_user_list',true,nameArry,'msg');
                // }else{
                // 	searchMentionFun(e,'#mention_user_list','.mention_user');
                // }
                searchMentionFun(e, '#mention_user_list', '.mention_user');
            } else {
                // searchMentionFun(e,'#mention_user_list','.mention_user');
                mentionisActive = true;
                draw_mention_design('#mention_user_list', true, nameArry, 'msg');
            }
        } else {
            mentionFor = '';
            draw_mention_design('#mention_user_list', false, nameArry, 'msg');
            mentionisActive = false;
        }
    }

    if (e.keyCode == 32) {

        // if($('#mention_user_list').find('.mention_user:visible').length == 0){
        // 	// console.log(12543,$('#mention_user_list').find('.mention_user:visible'))
        // 	searchMsgUser = false;
        // 	mention_div_action('hide');
        // }else{
        // 	// e.preventDefault();
        // 	// e.stopImmediatePropagation();
        // 	//return false;
        // 	//$('#msg').html($('#msg').html().replace(/&nbsp;/gi,' '));
        //     //  placeCaretAtEnd(document.getElementById('msg'));
        // }
    } else if (e.keyCode == 27) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // searchMsgUser = false;
        // mention_div_action('hide');
        mentionFor = '';
        draw_mention_design('#mention_user_list', false, nameArry, 'msg');
        mentionisActive = false;

    }
})

$('body').on('keydown', '#msg', function(e) {

    var str = $('#msg').text().trim();
    if (e.keyCode == 8) {
        var text = $('#msg').html().split('&nbsp;');
        if (text[text.length - 1] == '') {
            if (text[text.length - 2].indexOf('mention_user_msg') > -1) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $('#msg').find('.mention_user_msg').last().remove();
                // privateMsgTo();
            }
        }
    }

    // When typing start into message box
    if ($('#secretUserList').find('.secret_heading').length == 0) {
        if (typing === false) {
            typing = true;
            // console.log({ display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: false, msg_id: false })
            socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: false, msg_id: false });
            timeout = setTimeout(timeoutFunction, 2000);
        }
    }
});

$('body').on('keyup', '#fileComments', function(e) {
    // console.log(e)
    arrowAndEnterFormen(e, 'mention_user_list_file', 'up');
    var str = $('#fileComments').text();
    if (str.length == 1) {
        placeCaretAtEnd(document.getElementById('fileComments'));
    }
    var mentioncheck = checkMenOrNot(e, nameArry, '@');
    // console.log(15843,mentioncheck)
    if (mentioncheck) {
        if (mentioncheck.check == '@') {
            mentionFor = '@';
        }
        if (mentioncheck.last_t != '@') {
            searchMentionFun(e, '#mention_user_list_file', '.mention_user');
        } else {
            mentionisActive = true;
            draw_mention_design('#mention_user_list_file', true, nameArry, 'fileComments');
        }
    } else {
        mentionFor = '';
        draw_mention_design('#mention_user_list_file', false, nameArry, 'fileComments');
        mentionisActive = false;
    }

    if (e.keyCode == 32) {

    } else if (e.keyCode == 27) {
        e.preventDefault();
        e.stopImmediatePropagation();
        mentionFor = '';
        draw_mention_design('#mention_user_list_file', false, nameArry, 'fileComments');
        mentionisActive = false;

    }

});

$('body').on('keydown', '#fileComments', function(e) {
    // console.log(e)
    if (e.keyCode == 13) {
        if ($('#mention_user_list').is(':visible')) {
            // console.log(16139,$('#mention_user_list').is(':visible'))
            e.preventDefault();
            e.stopImmediatePropagation();
            $('#mention_user_list .mention_user.selected').click();
            return false;
        }

    }

});

function rep_keyup(e) {
    arrowAndEnterFormen(e, 'replymention_user', 'up');

    var str = $('#reply_msg').text();

    if (str.length == 1) {
        placeCaretAtEnd(document.getElementById('reply_msg'));
    }
    var mentioncheck = checkMenOrNot(e, nameArry, '@');
    // console.log(15843,mentioncheck)
    if (mentioncheck) {
        if (mentioncheck.check == '@') {
            mentionFor = '@';
        }
        if (mentioncheck.last_t != '@') {
            searchMentionFun(e, '#replymention_user', '.mention_user');
        } else {
            mentionisActive = true;
            draw_mention_design('#replymention_user', true, nameArry, 'reply_msg');
        }
    } else {
        mentionFor = '';
        draw_mention_design('#replymention_user', false, nameArry, 'reply_msg');
        mentionisActive = false;
    }

    if (e.keyCode == 32) {

    } else if (e.keyCode == 27) {
        e.preventDefault();
        e.stopImmediatePropagation();
        mentionFor = '';
        draw_mention_design('#replymention_user', false, nameArry, 'reply_msg');
        mentionisActive = false;

    }
}

function draw_mention_design(div, status, user_array, main) {
    $(div).html('');
    if (status) {
        var personalUser = []
        var secretUserList = 'secretUserList';

        if (main == 'reply_msg') {
            secretUserList = 'secretUserList_rep';
        } else {
            secretUserList = 'secretUserList';
        }
        if ($('#' + secretUserList).find('.secret_heading').length > 0) {
            personalUser = $('#' + secretUserList).find('.secret_heading').attr('data-id').split(',');
        }

        $.each(user_array, function(k, v) {
            if (mentionFor == '!@') {
                if (nameArryid[k] != user_id) {
                    var activeClass = '';
                    if (personalUser.indexOf(nameArryid[k]) > -1) {
                        activeClass = 'removeIcon';
                    }
                    var design = '<div class="mention_user ' + activeClass + '" msg-div="' + main + '" user-i="' + k + '" onclick="addThisMen(this)" user-name="' + v + '" main-div="' + div + '" >' +
                        '<img src="' + file_server + 'profile-pic/Photos/' + nameArryimg[k] + '" alt="">' +
                        '<div class="name">' + v + '</div>' +
                        '</div>';
                    $(div).append(design);
                    $(div).show();
                }
            } else {
                var design = '<div class="mention_user" msg-div="' + main + '" user-i="' + k + '" onclick="addThisMen(this)" user-name="' + v + '" main-div="' + div + '" >' +
                    '<img src="' + file_server + 'profile-pic/Photos/' + nameArryimg[k] + '" alt="">' +
                    '<div class="name">' + v + '</div>' +
                    '</div>';
                $(div).append(design);
                $(div).show();
            }

        });
        if (mentionFor == '@') {
            var design = '<div class="mention_user everyOneClass" msg-div="' + main + '" user-i="everyOne" onclick="addThisMen(this)" user-name="Everyone" main-div="' + div + '" >' +
                '<div class="name">Everyone</div>' +
                '</div>';
            $(div).prepend(design);
            $(div).show();
        }
        $(div).find('.mention_user').removeClass('selected');
        $(div).find('.mention_user').first().addClass('selected');
    } else {
        $(div).hide();
    }

}

function mention_div_action(type) {
    if (type == 'show') {
        $('#mention_user_list').html('');
        if (mentionUser_ListView == '@') {
            $.each(user_list, function(k, v) {
                if (participants.indexOf(v.id) !== -1) {
                    var fullname = v.fullname;
                    // fullname = fullname.join('');
                    // fullname = fullname.toLowerCase();
                    var youtext = '';
                    if (v.id == user_id) {
                        youtext = '(You)';
                    }

                    var design = '<div class="mention_user" id="mention_user_msg_' + v.id + '" onclick="addUserThisMsg(\'' + v.id + '\',\'' + fullname + '\')" data-id="' + v.id + '" >' +
                        '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" alt="">' +
                        '<div class="name">' + fullname + youtext + '</div>' +
                        '</div>';
                    $('#mention_user_list').append(design);
                }
            });
        } else {
            var personalUser = [];

            if ($('#secretUserList').find('.secret_heading').length > 0) {
                personalUser = $('#secretUserList').find('.secret_heading').attr('data-id').split(',');
            }

            $.each(user_list, function(k, v) {
                if (participants.indexOf(v.id) !== -1) {
                    if (v.id !== user_id) {
                        var fullname = v.fullname;
                        if (personalUser.indexOf(v.id) > -1) {
                            var design = '<div class="mention_user removeIcon" id="mention_user_msg_' + v.id + '" onclick="addUserThisMsg(\'' + v.id + '\',\'' + fullname + '\')" data-id="' + v.id + '" >';
                        } else {

                            var design = '<div class="mention_user" id="mention_user_msg_' + v.id + '" onclick="addUserThisMsg(\'' + v.id + '\',\'' + fullname + '\')" data-id="' + v.id + '" >';
                        }
                        design += '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" alt="">';
                        design += '<div class="name">' + fullname + '</div>';
                        design += '</div>';
                        $('#mention_user_list').append(design);
                    }
                }
            });
        }

        $('#mention_user_list').show();
        // $('#mention_user_list .mention_user:first').addClass('selected');
    } else if (type == 'hide') {
        $('#mention_user_list').html('');
        $('#mention_user_list').hide();
        searchMsgUser = false;
    }
}

var mentionUser_ListView = '@';

function addUserThisMsg(id, fullname) {
    var str = document.getElementById("msg").innerHTML;
    var text = $('#msg').text();
    if (mentionUser_ListView == '!@') {
        var res = str.slice(0, str.lastIndexOf("!@"));

        document.getElementById("msg").innerHTML = res;
        var personalUser = [];

        if ($('#secretUserList').find('.secret_heading').length > 0) {
            personalUser = $('#secretUserList').find('.secret_heading').attr('data-id').split(',');
            if (personalUser.indexOf(id) > -1) {
                removeA(personalUser, id);
            } else {
                personalUser.push(id)
            }
            $('#msg').text().trim();
            $('#secretUserList').find('.secret_heading').attr('data-id', personalUser.join(','))
        } else {
            var design = '<span onclick="viewmention_div_action()" class="secret_heading hideaftersent" contenteditable="false" style="cursor:pointer" spellcheck="false" data-id="' + id + '"><span>Private message to: ' + findObjForUser(id).fullname + '</span> <span class="removeSecretUser" onclick="removeSecretUsers(event)"></span></span>';

            $('#msg').text().trim();
            $('#secretUserList').find('.secret_heading.hideaftersent').remove();
            $('#secretUserList').prepend(design);
        }

        mention_div_action('hide');
        placeCaretAtEnd(document.getElementById('msg'));
        privateMsgTo();
    } else {
        var res = str.slice(0, str.lastIndexOf("@"));

        document.getElementById("msg").innerHTML = res;
        $('#msg').text().trim();
        $('#msg').append('<span onclick="actionMentionUser(\'' + id + '\')" data-id="' + id + '" class="mention_user_msg solid_mention"  data-mention="' + '@' + fullname + '"></span>&nbsp;');
        // $('#msg').append('<div data-id="'+id+'" class="mention_user_msg solid_mention" data-mention="'+'@'+fullname+'"></div>&nbsp;')
        // 	$('#msg').html(res);
        mention_div_action('hide');
        placeCaretAtEnd(document.getElementById('msg'));
    }
}


function actionMentionUser(id) {
    // socket.emit('get_call_url',{user_id : user_id , type: 'profile'},function(res){
    var userornot = false;
    if (id != user_id) {
        $.each(user_list, function(k, v) {
            if (id == v.id) {
                userornot = true;
                $('#myModalImgview').find('.img_foot_action div').removeClass('off_G_C');
                $('#myModalImgview').find('.img_foot_action div').addClass('off_P_C');
                if (id == user_id) {
                    $('#myModalImgview').attr('chat-text', false);
                    if (res != null) {
                        $('#callerid_url_profile').text(window.location.origin + "/call/" + findObjForUser(id).conference_id);
                        $('#user_calleridPopupbox').show();
                    }

                } else {
                    $('#myModalImgview').attr('chat-text', true);
                    $('#user_calleridPopupbox').hide();

                }
                $('#myModalImgview').attr('data-userid', v.id);
                $('#zoomImgView').attr('src', file_server + 'profile-pic/Photos/' + v.img);
                $('#myModalImgview').css('display', 'flex');
                $('#zoomImgShare').attr('data-value', file_server + 'profile-pic/Photos/' + v.img);
                $('#user_namePopupbox').text(v.fullname);
                $('#user_namePopupbox').attr('class', 'P_user_name conv_nickname_' + v.id + '');
                $('#user_namePopupbox').attr('onclick', 'editCustomTitle(\'conv_title\',\'' + v.id + '\',\'' + v.fullname + '\')');

                $('#user_emailPopupbox').text(v.email);
                $('#dconvUsers').html('');

                $('#temppdconvM').html('');
                temppconvSingle = false;
                temppconvSingleGo = false;
                temppconvSingleFriendId = null;
                changeAllCustomTitle();

            }
        });
        if (!userornot) {
            $('#myModalImgview').find('.img_foot_action div').removeClass('off_P_C');
            $('#myModalImgview').find('.img_foot_action div').addClass('off_G_C');
        }
    } else {
        editProfileBackwrap();
    }
    // });

}


function privateMsgTo() {
    $('#msg').text().trim();

    var secretUserPerMsg = [];
    if ($('#secretUserList .secret_heading.hideaftersent').length > 0) {
        if ($('#secretUserList .secret_heading.hideaftersent').attr('data-id') !== "") {
            secretUserPerMsg = $('#secretUserList .secret_heading.hideaftersent').attr('data-id').split(',');
        }
    }

    if (secretUserPerMsg.length == 0) {
        $('#secretUserList .secret_heading.hideaftersent').remove();
        return false;
    }

    // var secretUserPerMsg = [];
    // // $('#msg .mention_user_msg.secret_user._scret_msg_').css('display','inline-block')
    // // $('#msg .mention_user_msg.secret_user._scret_msg_').first().css('display','none')
    // $.each(allPrivatUser,function(k,v){
    // 	if($(v).attr('data-id') != user_id){
    // 		if(secretUserPerMsg.indexOf($(v).attr('data-id')) == -1){
    // 			secretUserPerMsg.push($(v).attr('data-id'));
    // 		}
    // 	}
    // })
    // console.log(14247,secretUserPerMsg);

    var design = '';

    if (secretUserPerMsg.length > 0) {
        design += '<span onclick="viewmention_div_action()" class="secret_heading hideaftersent" contenteditable="false" style="cursor:pointer" spellcheck="false" data-id="' + secretUserPerMsg.join(',') + '">Private message to: ';
        $.each(secretUserPerMsg, function(k, v) {
            if (v !== user_id) {
                if (k == 0) {
                    design += '<span> ' + findObjForUser(v).fullname + ' </span>';
                } else {
                    if (secretUserPerMsg.length == (k + 1)) {
                        design += ' & <span>' + findObjForUser(v).fullname + ' </span>';
                    } else {
                        design += '<span>, ' + findObjForUser(v).fullname + ' </span>';
                    }
                }
            }
        });
        design += '<span class="removeSecretUser" onclick="removeSecretUsers(event)"></span>';
        design += '</span>'
    }
    $('#secretUserList').find('.secret_heading.hideaftersent').remove();
    $('#secretUserList').prepend(design);
    placeCaretAtEnd(document.getElementById('msg'));
}

function removeSecretUsers(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('#secretUserList').html('');
    placeCaretAtEnd(document.getElementById('msg'));
}

function viewmention_div_action() {
    mentionUser_ListView = '!@';
    var ys = $('#msg').text();
    if (ys.charAt(ys.length - 1) !== '@' && ys.charAt(ys.length - 2) !== '!') {

        var div = document.getElementById('msg');

        div.insertAdjacentHTML('beforeend', '!@');
    }

    placeCaretAtEnd(document.getElementById('msg'));
    mention_div_action('show');
}

// $('#msg').on('keyup', function (event){
// 	var code = event.keyCode || event.which;
// 	if (code !== 13) {
// 		if (isUrlValid($('#msg').text())) {
// 			if (hasurlTemp == 1) {
// 				var data = {
// 					url: $('#msg').text(),
// 					conversation_id: '',
// 					msg_id: '',
// 					base_url: baseUrl
// 				}
// 				socket.emit('socket_url_preview', data, (res) => {
// 					if (res.status) {
// 						if($('#msg').find('a').length > 0){
// 							if(blockUrlPreview){

// 								$('#msgUrlPreview').slideDown();

// 								var img = '';
// 								if (res.body.image) {
// 									img = '<img src="' + res.body.image + '">';
// 								} else {
// 									img = '<img src="' + res.body.logo + '">';
// 								}
// 								if (res.body.publisher){
// 									var publisher = '<p>' + res.body.publisher + '</p>';
// 								}else{
// 									var publisher = '<p>' + res.body.title + '</p>';
// 								}
// 								var desc = '<p>' + res.body.description + '</p>';
// 								$('#msgUrlPreview .url_title').html('');
// 								$('#msgUrlPreview .ulr_img').html('');
// 								$('#msgUrlPreview .url_title').html('');
// 								$('#msgUrlPreview .url_desc').html('');
// 								$('#msgUrlPreview .url_title').append(publisher);
// 								$('#msgUrlPreview .ulr_img').append(img);
// 								$('#msgUrlPreview .url_title').append(res.body.msg_body);
// 								$('#msgUrlPreview .url_desc').append(desc);
// 								foundUrlTemp = res.body.url;
// 								hasurlTemp = 2;
// 							}
// 						}
// 					}
// 				});
// 			}
// 		}

// 		//   console.log(foundUrlTemp, $('#msg').text() );
// 		//   console.log(foundUrlTemp.toLocaleLowerCase().search($('#msg').text().toLocaleLowerCase()));
// 		//   if ($('#msg').text().search(foundUrlTemp) == -1) {
// 		//       hasurlTemp = 1;
// 		//       if ($('#msgUrlPreview').is(':visible')) {
// 		//           closeModal('msgUrlPreview');
// 		//       }
// 		//   }
// 		if ($('#msg').text().length < 3) {
// 			hasurlTemp = 1;
// 			if ($('#msgUrlPreview').is(':visible')) {
// 				closeModal('msgUrlPreview');
// 			}

// 		}
// 	}
// });

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

// var msg_sending_process = (str) => {
var msg_sending_process = (str, allLink = null) => {
    var uniquestrtag = [];
    $.each(str_tag_active_attch, function(k, v) {
        if (uniquestrtag.indexOf(v) == -1) uniquestrtag.push(v);
    });
    var is_room = (conversation_type == 'group') ? true : false;
    $("#ChatFileUpload").closest('form').trigger("reset");
    $("#fileComments").html("");
    $(".filePreviewSection").html("");
    $("#msg").html("");
    socket.emit('send_message', {
        conversation_id: conversation_id,
        sender_img: user_img,
        sender_name: user_fullname,
        user_id: user_id,
        to: to,
        is_room: is_room,
        text: str,
        attach_files: filedata[0],
        thread_root_id: swap_conversation_id,
        tag_list: tempAttachmentTag,
        selectedSp: [],
        has_timer: ((!$('#setMsgTimer').hasClass('activeTime')) ? null : $('#setMsgTimer').attr('value')),
        mention_user: mentionUsers,
        allLink: allLink
    });
    if (allfiles.length > 0) {
        $.each(allfiles, function(k, v) {
            v['conversation_id'] = conversation_id;
            v.location = v.location.replace('http://', 'https://').replace('%40', '@');
            v.location = v.location.replace(file_server, '');
            per_conv_all_files.push(v);
        });

        socket.emit('conv_files_added', per_conv_all_files);
    }
    tempAttachmentTag = [];
    filedata.length = 0;
    filedata = [];
    audiofile.length = 0;
    audiofile = [];
    imgfile.length = 0;
    imgfile = [];
    otherfile.length = 0;
    otherfile = [];
    videofile.length = 0;
    videofile = [];
    formDataTemp.length = 0;
    formDataTemp = [];
    // $('#emojiPopup').hide();
    $('.intercom-composer-emoji-popover').hide();
};


var message_sent = (data) => {
    $('.typing-indicator').html("");
    filedata.length = 0;
    filedata = [];
    audiofile.length = 0;
    audiofile = [];
    imgfile.length = 0;
    imgfile = [];
    otherfile.length = 0;
    otherfile = [];
    videofile.length = 0;
    videofile = [];
    formDataTemp.length = 0;
    formDataTemp = [];
    var html = draw_msg(data.msg, true);
    $('#msg-container').append(html);
    // scrollToBottom('#msg-container');
    // msg_taphold();

    last_delivered_always_show();
    $('#msg').html('').focus();
    // $('#setMsgTimer').removeClass('activeTime');
    // if($('#msgid_' + data.msg.msg_id).find('.has_url a[data-preview="true"]').length > 0){
    if ($('#msgid_' + data.msg.msg_id).find('.has_url a').length > 0) {
        var url = $('#msgid_' + data.msg.msg_id).find('.has_url a').attr('href');
        socket.emit('msg_url2preview', {
            url: url,
            to: to,
            conversation_id: conversation_id,
            msgid: data.msg.msg_id,
            base_url: location.protocol + '//' + location.host,
            msg_type: $('#msgid_' + data.msg.msg_id).attr('data-msg-type')
        }, (response) => {
            if (response.status) {
                setTimeout(function() {
                    var attchhtml = per_msg_url_attachment(
                        response.body.publisher,
                        response.body.title,
                        response.body.description,
                        response.body.image,
                        response.body.logo);
                    $('#msgid_' + data.msg.msg_id).find('.has_url a').text(response.body.title);
                    $('#msgid_' + data.msg.msg_id).find('.has_url').append(attchhtml);
                    // update_local_conv_msg_preview(response.conversation_id, response.msg_id, response.body);
                }, 3000);
            }
        });
    }
    // }
    // scrollToBottom('.chat-page .os-viewport');

    if (data.tagmsgid != undefined) {
        if (msgIdsFtag.indexOf(data.tagmsgid) === -1) {
            msgIdsFtag.push(data.tagmsgid);
        }
    }
    // inviewfun();
};
socket.on('url2preview', function(data) {
    if (data.status) {
        var attchhtml = per_msg_url_attachment(data.body.publisher, data.body.title, data.body.description, data.body.image, data.body.logo);
        $('#msgid_' + data.msg_id).find('.has_url a').text(data.body.title);
        $('#msgid_' + data.msg_id).find('.has_url').append(attchhtml);
    }
});

var msg_form_submit = () => {

    $('#msg').find('a').attr('target', '_blank')
    $('#msg').find('a').attr('data-preview', true);

    // if($('#msgUrlPreview').is(':visible')){
    // 	$('#msg').find('a').attr('data-preview',true);
    // }else{
    // 	$('#msg').find('a').attr('data-preview',false);
    // }

    var _str = $('#msg').text().trim();
    var chk_1 = $('#msg').find('.solid_mention').length > 0 ? true : false;
    var str = $('#msg').html();
    str = str.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, '$1'); // remove all script
    str = str.replace(/&nbsp;/gi, '').trim(); // remove all white space
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, ''); // remove all white new line
    str = str.replace(/<div><br><\/div>/gi, ''); // remove all white new line from mobile browser
    // str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    // str = convert(str);
    // str = str.replace(/&nbsp;/gi, '').trim();
    // str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');

    // var hasEmail = extractEmails($('#msg').html());
    // $.each(hasEmail,function(k,v){

    // 	str =	str.replace(v, html);
    // })
    // if(hasEmail != null){

    // 	if(hasEmail.length > 0){
    // 		var html = '<a href="mailto:'+hasEmail.join('; ')+'" class="msg_emailBtn hv_btn hv_btn_sm btn_info" style="margin-left: 5px;font-size: 12px !important;">Send Email</a>';
    // 		$('#msg').append(html);

    // 		// if($('#msgUrlPreview').is(':visible')){
    // 		// 	$('#msg').find('a').attr('data-preview',true);
    // 		// }else{
    // 		// 	$('#msg').find('a').attr('data-preview',false);
    // 		// }

    // 		str = $('#msg').html();
    // 	}
    // }

    // if (str != "") {
    // 	str = createTextLinks_(str);
    // 	msg_sending_process(str);
    // 	if ($('#msgUrlPreview').is(':visible')) {
    // 			closeModal('msgUrlPreview');
    // 	}
    // }

    // if (_str != "" || chk_1) {
    if (str != "") {
        var allLink = linkify($('#msg').text().trim()).split('$_link_$');

        str = createTextLinks_(str);
        str = str.replace(/\n/gi, '<br>');
        if ($('#secretUserList .secret_heading.hideaftersent').length > 0) {
            var secret_user = [];
            if ($('#secretUserList .secret_heading.hideaftersent').attr('data-id') !== "") {
                secret_user = $('#secretUserList .secret_heading.hideaftersent').attr('data-id').split(',');
            }
            if (secret_user.indexOf(user_id) == -1) {
                secret_user.push(user_id);
            }
            var msg_status = [];

            $.each(participants, function(k, v) {
                if (secret_user.indexOf(v) == -1) {
                    msg_status.push(v);
                }
            })
            msg_status.push(user_id);

            var data = {
                type: 'secret_msg',
                sender: user_id,
                sender_name: user_fullname,
                sender_img: user_img,
                conversation_id: conversation_id,
                msg_type: 'text',
                msg_body: str,
                secret_user: secret_user,
                msg_status: msg_status,
                attach_files: [],
                mention_user: mentionUsers

            }
            var strnew = $('#msg').text()
            strnew = convert(strnew);
            strnew = strnew.replace(/&nbsp;/gi, '').trim();
            strnew = strnew.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
            if (strnew.length > 0) {

                sendNotificationMsg(data);
            } else if ($('#msg').html().indexOf('class="mention_user_msg"') > -1) {
                sendNotificationMsg(data);
            }
            $('#secretUserList').html('');
        } else {

            var hasEmail = extractEmails(str);
            $.each(hasEmail, function(k, v) {
                var html = '<a href="mailto:' + v + '" class="email_link">' + v + '</a>';
                str = str.replace(v, html);
            })

            var filteredLink = [];
            $.each(allLink, function(k, v) {
                if (validURL(v.trim())) {
                    if (filteredLink.indexOf(v.trim()) == -1) {
                        filteredLink.push(v.trim());
                    }
                }
            })
            msg_sending_process(str, filteredLink);
            // msg_sending_process(str);
        }
        if ($('#msgUrlPreview').is(':visible')) {
            closeModal('msgUrlPreview');
        }
    }
    $('#msg').html('');

    if ($('#add_more_opt').attr('data-checklist') == 'true') {
        // addMsgCheckList();
        $('#add_more_opt').trigger('click');
        console.log($('#add_more_opt').length)
    }
    // drawFile_size();
}

function extractEmails(text) {
    if (text.indexOf('http') == -1 || text.indexOf('https') == -1) {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    } else {
        return null;
    }
}

function linkify(text) {
    return (text || "").replace(
        /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
        function(match, space, url) {
            var hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
            }
            hyperlink = hyperlink.replace(/&nbsp;/gi, '');
            return space + '$_link_$' + url + '$_link_$';
        }
    );
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function sendNotificationMsg(data) {
    socket.emit('send_notification_msg', data, function(res) {
        console.log('2345 sendNotificationMsg', res);
    })
}

function createTextLinks_(text) {

    return (text || "").replace(
        /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
        function(match, space, url) {
            var hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
            }
            hyperlink = hyperlink.replace(/&nbsp;/gi, '');
            return space + '<a href="' + hyperlink + '" target="_blank">' + url + '</a>';
        }
    );

};

/**
 * When a new message come,
 * Check user message container is opne or not.
 * if open, it show's the message in the container
 * else marked as a notification that new message arived
 **/
var last_msg_id_temp = "";
var data_unreadAllMsg = [];
var data_allEditUnreadMsg = [];
// socket.on('newMessage', function(message) {

//     console.log(3650, message)

//     var visibleId = $('#user_head_id[room-id="' + message.msg.conversation_id + '"]');

//     if (message["checklist"] != undefined) {

//         message.msg['checklist'] = message.checklist;
//     }
//     if (last_msg_id_temp != message.msg.msg_id) {
//         last_msg_id_temp = message.msg.msg_id;
//         /**
//          * New message conversation id and global conversation id is same
//          */
//         if (conversation_id == message.msg.conversation_id) {
//             /**
//              * New message conversation id and global conversation id is same,
//              * and new message sender id and global user id is same.
//              * So this block is, sender block for print the last send msg.
//              */
//             if (user_id == message.msg.sender) {
//                 message_sent(message);
//                 $('.msg-separetor-unread').hide();
//                 // for files tag. while file uploading
//                 // if (message.msg.attch_audiofile.length > 0 || message.msg.attch_imgfile.length > 0 || message.msg.attch_otherfile.length > 0 || message.msg.attch_videofile.length > 0  ){
//                 // 	if(str_tag_active_attch.length>0){
//                 // 		var html = "<div>";
//                 // 		var uniquestrtag = [];
//                 // 		$.each(str_tag_active_attch, function(kt,vt){
//                 // 			if(uniquestrtag.indexOf(vt) == -1){
//                 // 				html += '<span class="single_tag">'+vt+'</span>';
//                 // 				uniquestrtag.push(vt);
//                 // 			}
//                 // 		});
//                 // 		html += "</div>";
//                 // 		$("#msgid_"+message.msg.msg_id).find(".msg_section").append(html);
//                 // 	}
//                 // }
//             }
//             /**
//              * New message conversation id and global conversation id is same,
//              * but sender id and global user id are not same.
//              * So this block is receiver block for print the last new msg.
//              * and remove the typing indication, add has delivered
//              */
//             else {
//                 $('.typing-indicator').html("");
//                 message.msg.has_delivered = 1;
//                 if ($('.msg-separetor-unread').is(':visible')) {
//                     var counter = parseInt($('.msg-separetor-unread').attr('data-length')) + 1;
//                     $('.msg-separetor-unread:visible').find('p').html('' + counter + ' new message');
//                     $('.msg-separetor-unread:visible').attr('data-length', counter);

//                 } else {
//                     $('.msg-separetor-unread').remove();
//                     var ureadHtml = '<div class="msg-separetor-unread" data-length="1"><p>1 new message</p></div>';
//                     $("#msg-container").append(ureadHtml);
//                 }

//                 $('.msg-separetor-unread').show();
//                 last_msg_id_temp = message.msg.msg_id;
//                 var html = draw_msg(message.msg, true);

//                 $('#msg-container').append(html);

//                 // scrollToBottom('#msg-container');
//                 // inviewfun();
//                 socket.emit('seen_emit', { msgid: message.msg.msg_id, senderid: to, receiverid: user_id, conversation_id: conversation_id });
//                 $('.msg-send-seen-delivered').hide();
//             }
//         }
//         /**
//          * In the receiver end, receiver receive a new message
//          * but receiver not in the same thread. So print this msg
//          * as a new msg notification. remove the old cache.
//          */
//         else if ($(".convid" + message.msg.conversation_id).length == 1 && message.msg.sender !== user_id) {

//             // remove_conv_from_cache(user_id+message.msg.conversation_id);
//             if (message.status) {
//                 data_unreadAllMsg.push(message.msg);
//             } else if (message.status == undefined) {
//                 data_allEditUnreadMsg.push(message.msg)
//             }
//             // console.log('sound test 111');
//             playNotification(message.msg.conversation_id);
//             var count = $(".convid" + message.msg.conversation_id).find(".unread_msg").html();
//             count = Number(count) > 0 ? Number(count) + 1 : 1;

//             socket.emit('getCompanyTag', { user_id: user_id, company_id: company_id }, function(res) {
//                 if (res.status) {
//                     allUserTagList = res.data;

//                     checklistView();
//                 } else {
//                     console.log(res);
//                 }
//             });

//             console.log('sender: ', message.msg.sender, 'user_id: ', user_id)
//             $(".convid" + message.msg.conversation_id).find(".last_msg").html(message.msg.msg_body);
//             $(".convid" + message.msg.conversation_id).find(".unread_msg").html(count);
//             // $(".convid"+message.msg.conversation_id).attr("data-nom", count);
//             // if($(".scroll_unreadMsg").is(":visible"))
//             // 	count = Number($(".scroll_unreadMsg>h5>span").text())+1;
//             // display_show_hide_unread_bar(count);
//             // Add delivered

//             var last_msg_conv = $(".convid" + message.msg.conversation_id)[0].outerHTML;
//             if ($(".convid" + message.msg.conversation_id).hasClass('unpinuser')) {
//                 $(".convid" + message.msg.conversation_id).remove();
//                 $('.conv_area.unpinuser').first().before(last_msg_conv);
//             } else if ($(".convid" + message.msg.conversation_id).hasClass('pinuser')) {
//                 $(".convid" + message.msg.conversation_id).remove();
//                 $('.conv_area.pinuser').first().after(last_msg_conv);
//             }


//             var adin = [];
//             adin.push(message.msg);
//             socket.emit('add_delivered_if_need', adin);

//         }
//         /**
//          * This is totally a new msg from a new user.
//          * So need to print new conversation block in
//          * left sidebar. and no need to update any cache
//          */
//         else if ($(".convid" + message.msg.conversation_id).length == 0) {
//             var data = {
//                 conv_id: message.msg.conversation_id,
//                 user_id: user_id
//             }
//             if (visibleId.length == 0 && message.msg.sender !== user_id) {
//                 // console.log('sound test 222');
//                 playNotification(message.msg.conversation_id);
//             }

//             // socket.emit('check_Conv_Part', data, (res)=>{
//             //     var muteDesign = '';
//             //     if(res.participants.indexOf(user_id) !== -1){
//             //         if(myAllMuteConvid.indexOf(res.conversation_id) !== -1){
//             //             $.each(myAllMuteConv, function(k,v){
//             //                 if(v.conversation_id == res.conversation_id){
//             //                     muteDesign = '<span data-mute-id="'+v.mute_id+'" class="mute_bell" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+res.conversation_id+'\')"></span>';
//             //                 }
//             //             });
//             //             //var muteDesign = '<span data-mute-id="" class="mute_bell" onclick="showMuteDropDown(event,'',\''+res.conversation_id+'\')"></span>';
//             //         }
//             //         if(res.privacy == 'private'){
//             //                 if(res.group == 'yes'){
//             //                     if(res.title.indexOf(',') > -1){
//             //                         var design = '<li data-myid="' + user_id + '" data-createdby="'+ res.created_by +'"  data-octr="0"  onclick="start_conversation(event)" data-id="'+message.msg.sender+'" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="'+message.msg.conversation_id+'" data-name="'+res.title+'" data-img="'+message.msg.sender_img+'" id="conv'+res.conversation_id+'" data-nom="1" data-tm="'+res.participants.length+'">';
//             //                         design += '<span class="lock"></span><span class="usersName">'+res.title+'</span>';
//             //                         design += '<span class="unreadMsgCount">1</span> <span style="display:none" class="remove" onclick="removeThisList(\''+res.conversation_id+'\')" onmouseenter="asideRemoveMouseEnter(\''+res.conversation_id+'\')" onmouseleave="asideRemoveMouseLeave(\''+res.conversation_id+'\')"></span>';
//             //                         design += muteDesign;
//             //                         design += '</li>';
//             //                         $('#conversation_list_sidebar').prepend(design);
//             //                     }else{
//             //                         var design = '<li data-myid="' + user_id + '" data-createdby="'+ res.created_by +'"  data-octr="0"  onclick="start_conversation(event)" data-id="'+message.msg.sender+'" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="'+message.msg.conversation_id+'" data-name="'+res.title+'" data-img="'+message.msg.sender_img+'" id="conv'+res.conversation_id+'" data-nom="1" data-tm="'+res.participants.length+'">';
//             //                         design += '<span class="lock"></span><span class="usersName">'+res.title+'</span>';
//             //                         design += '<span class="unreadMsgCount">1</span> <span style="display:none" class="remove" onclick="removeThisList(\''+res.conversation_id+'\')" onmouseenter="asideRemoveMouseEnter(\''+res.conversation_id+'\')" onmouseleave="asideRemoveMouseLeave(\''+res.conversation_id+'\')"></span>';
//             //                         design += muteDesign;
//             //                         design += '</li>';
//             //                         $('#conversation_list_sidebar').prepend(design);

//             //                     }
//             //                 }
//             //                 else{
//             //                     var design = '<li data-myid="' + user_id + '" data-createdby="'+ res.created_by +'"  data-octr="'+res.created_by+'"  onclick="start_conversation(event)" data-id="'+message.msg.sender+'" data-subtitle="Navigate" data-conversationtype="personal" data-conversationid="'+message.msg.conversation_id+'" data-name="'+message.msg.sender_name+'" data-img="'+message.msg.sender_img+'" id="conv'+res.conversation_id+'" data-nom="1" data-tm="'+res.participants.length+'">';
//             //                     design += '<span class="online_'+message.msg.sender+' '+(onlineUserList.indexOf(message.msg.sender) === -1 ? "offline":"online" ) +'"></span><span class="usersName">'+message.msg.sender_name+'</span>';
//             //                     design += '<span class="unreadMsgCount">1</span> <span style="display:none" class="remove" onclick="removeThisList(\''+res.conversation_id+'\')" onmouseenter="asideRemoveMouseEnter(\''+res.conversation_id+'\')" onmouseleave="asideRemoveMouseLeave(\''+res.conversation_id+'\')"></span>';
//             //                     design += muteDesign;
//             //                     design += '</li>';
//             //                     $('#conversation_list_sidebar').prepend(design);
//             //                 }

//             //         }else{

//             //                 var design = '<li data-myid="' + user_id + '" data-createdby="'+ res.created_by +'"  data-octr="0"  onclick="start_conversation(event)" data-id="'+user_id+'" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="'+message.msg.conversation_id+'" data-name="'+res.title+'" data-img="'+res.conv_img+'" id="conv'+res.conversation_id+'" data-nom="1" data-tm="'+res.participants.length+'">';
//             //                     design += '<span class="hash"></span><span class="usersName">'+res.title+'</span>';
//             //                     design += '<span class="unreadMsgCount">1</span> <span style="display:none" class="remove" onclick="removeThisList(\''+res.conversation_id+'\')" onmouseenter="asideRemoveMouseEnter(\''+res.conversation_id+'\')" onmouseleave="asideRemoveMouseLeave(\''+res.conversation_id+'\')"></span>';
//             //                     design += muteDesign;
//             //                     design += '</li>';
//             //                 $('#conversation_list_sidebar').prepend(design);
//             //         }
//             //         if(!$('.scroll_unreadMsg').is(':visible')){
//             //                 display_show_hide_unread_bar(1);
//             //         }else{
//             //             count = parseInt($('.scroll_unreadMsg>h5>span').text()) + 1;
//             //             display_show_hide_unread_bar(count);

//             //         }

//             //         ///push notification
//             //         if(myAllMuteConvid.indexOf(message.msg.conversation_id) == -1){
//             //           if(checkSpecialChars(message.msg.msg_body) == false){
//             //             Push.create(message.msg.sender_name, {
//             //                 body: message.msg.msg_body,
//             //                 icon: "/images/users/" + message.msg.sender_img,
//             //                 timeout: 10000,
//             //                 onClick: function () {
//             //                     document.getElementById("conv" + message.msg.conversation_id).click();
//             //                 }
//             //             });
//             //           }

//             //         }
//             //     }

//             // });
//         }
//     }
// });

// var emoCount = 0;
// var emojiArray= ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚','🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺' ,'😸', '😹', '😻' ,'😼', '😽' ,'🙀' ,'😿' ,'😾'];
// var peopleFantasy = ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '🧔', '👱‍♂️', '👱‍♀️', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '👨‍🦳', '👩‍🦳', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🤶', '🎅', '🧙‍♀️', '🧙‍♂️', '🧝‍♀️', '🧝‍♂️', '🧛‍♀️', '🧛‍♂️', '🧟‍♀️', '🧟‍♂️', '🧞‍♀️', '🧞‍♂️', '🧜‍♀️', '🧜‍♂️', '🧚‍♀️', '🧚‍♂️', '👼', '🤰', '🤱', '🙇‍♀️', '🙇‍♂️', '💁‍♀️', '💁‍♂️', '🙅‍♀️', '🙅‍♂️', '🙆‍♀️', '🙆‍♂️', '🙋‍♀️', '🙋‍♂️', '🤦‍♀️', '🤦‍♂️', '🤷‍♀️', '🤷‍♂️', '🙎‍♀️', '🙎‍♂️', '🙍‍♀️', '🙍‍♂️', '💇‍♀️', '💇‍♂️', '💆‍♀️', '💆‍♂️', '🧖‍♀️', '🧖‍♂️', '💅', '🤳', '💃', '🕺', '👯‍♀️', '👯‍♂️', '🕴', '🚶‍♀️', '🚶‍♂️', '🏃‍♀️', '🏃‍♂️', '👫', '👭', '👬', '💑', '👩‍❤️‍👩', '👨‍❤️‍👨', '💏', '👩‍❤️‍💋‍👩', '👨‍❤️‍💋‍👨', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '🤲', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🦵', '🦶', '🖕', '✍️', '🙏', '💍', '💄', '💋', '👄', '👅', '👂', '👃', '👣', '👁', '👀', '🧠', '🦴', '🦷', '🗣', '👤', '👥'];

// var clothingAccessories = ['🧥', '👚', '👕', '👖', '👔', '👗', '👙', '👘', '👠', '👡', '👢', '👞', '👟', '🥾', '🥿', '🧦', '🧤', '🧣', '🎩', '🧢', '👒', '🎓', '⛑', '👑', '👝', '👛', '👜', '💼', '🎒', '👓', '🕶', '🥽', '🥼', '🌂', '🧵', '🧶'];

// var paleEmojis = ['👶🏻', '👦🏻', '👧🏻', '👨🏻', '👩🏻', '👱🏻‍♀️', '👱🏻', '👴🏻', '👵🏻', '👲🏻', '👳🏻‍♀️', '👳🏻', '👮🏻‍♀️', '👮🏻', '👷🏻‍♀️', '👷🏻', '💂🏻‍♀️', '💂🏻', '🕵🏻‍♀️', '🕵🏻', '👩🏻‍⚕️', '👨🏻‍⚕️', '👩🏻‍🌾', '👨🏻‍🌾', '👩🏻‍🍳', '👨🏻‍🍳', '👩🏻‍🎓', '👨🏻‍🎓', '👩🏻‍🎤', '👨🏻‍🎤', '👩🏻‍🏫', '👨🏻‍🏫', '👩🏻‍🏭', '👨🏻‍🏭', '👩🏻‍💻', '👨🏻‍💻', '👩🏻‍💼', '👨🏻‍💼', '👩🏻‍🔧', '👨🏻‍🔧', '👩🏻‍🔬', '👨🏻‍🔬', '👩🏻‍🎨', '👨🏻‍🎨', '👩🏻‍🚒', '👨🏻‍🚒', '👩🏻‍✈️', '👨🏻‍✈️', '👩🏻‍🚀', '👨🏻‍🚀', '👩🏻‍⚖️', '👨🏻‍⚖️', '🤶🏻', '🎅🏻', '👸🏻', '🤴🏻', '👰🏻', '🤵🏻', '👼🏻', '🤰🏻', '🙇🏻‍♀️', '🙇🏻', '💁🏻', '💁🏻‍♂️', '🙅🏻', '🙅🏻‍♂️', '🙆🏻', '🙆🏻‍♂️', '🙋🏻', '🙋🏻‍♂️', '🤦🏻‍♀️', '🤦🏻‍♂️', '🤷🏻‍♀️', '🤷🏻‍♂️', '🙎🏻', '🙎🏻‍♂️', '🙍🏻', '🙍🏻‍♂️', '💇🏻', '💇🏻‍♂️', '💆🏻', '💆🏻‍♂️', '🕴🏻', '💃🏻', '🕺🏻', '🚶🏻‍♀️', '🚶🏻', '🏃🏻‍♀️', '🏃🏻', '🤲🏻', '👐🏻', '🙌🏻', '👏🏻', '🙏🏻', '👍🏻', '👎🏻', '👊🏻', '✊🏻', '🤛🏻', '🤜🏻', '🤞🏻', '✌🏻', '🤟🏻', '🤘🏻', '👌🏻', '👈🏻', '👉🏻', '👆🏻', '👇🏻', '☝🏻', '✋🏻', '🤚🏻', '🖐🏻', '🖖🏻', '👋🏻', '🤙🏻', '💪🏻', '🖕🏻', '✍🏻', '🤳🏻', '💅🏻', '👂🏻', '👃🏻'];

// var creamWhiteEmojis = ['👶🏼', '👦🏼', '👧🏼', '👨🏼', '👩🏼', '👱🏼‍♀️', '👱🏼', '👴🏼', '👵🏼', '👲🏼', '👳🏼‍♀️', '👳🏼', '👮🏼‍♀️', '👮🏼', '👷🏼‍♀️', '👷🏼', '💂🏼‍♀️', '💂🏼', '🕵🏼‍♀️', '🕵🏼', '👩🏼‍⚕️', '👨🏼‍⚕️', '👩🏼‍🌾', '👨🏼‍🌾', '👩🏼‍🍳', '👨🏼‍🍳', '👩🏼‍🎓', '👨🏼‍🎓', '👩🏼‍🎤', '👨🏼‍🎤', '👩🏼‍🏫', '👨🏼‍🏫', '👩🏼‍🏭', '👨🏼‍🏭', '👩🏼‍💻', '👨🏼‍💻', '👩🏼‍💼', '👨🏼‍💼', '👩🏼‍🔧', '👨🏼‍🔧', '👩🏼‍🔬', '👨🏼‍🔬', '👩🏼‍🎨', '👨🏼‍🎨', '👩🏼‍🚒', '👨🏼‍🚒', '👩🏼‍✈️', '👨🏼‍✈️', '👩🏼‍🚀', '👨🏼‍🚀', '👩🏼‍⚖️', '👨🏼‍⚖️', '🤶🏼', '🎅🏼', '👸🏼', '🤴🏼', '👰🏼', '🤵🏼', '👼🏼', '🤰🏼', '🙇🏼‍♀️', '🙇🏼', '💁🏼', '💁🏼‍♂️', '🙅🏼', '🙅🏼‍♂️', '🙆🏼', '🙆🏼‍♂️', '🙋🏼', '🙋🏼‍♂️', '🤦🏼‍♀️', '🤦🏼‍♂️', '🤷🏼‍♀️', '🤷🏼‍♂️', '🙎🏼', '🙎🏼‍♂️', '🙍🏼', '🙍🏼‍♂️', '💇🏼', '💇🏼‍♂️', '💆🏼', '💆🏼‍♂️', '🕴🏼', '💃🏼', '🕺🏼', '🚶🏼‍♀️', '🚶🏼', '🏃🏼‍♀️', '🏃🏼', '🤲🏼', '👐🏼', '🙌🏼', '👏🏼', '🙏🏼', '👍🏼', '👎🏼', '👊🏼', '✊🏼', '🤛🏼', '🤜🏼', '🤞🏼', '✌🏼', '🤟🏼', '🤘🏼', '👌🏼', '👈🏼', '👉🏼', '👆🏼', '👇🏼', '☝🏼', '✋🏼', '🤚🏼', '🖐🏼', '🖖🏼', '👋🏼', '🤙🏼', '💪🏼', '🖕🏼', '✍🏼', '🤳🏼', '💅🏼', '👂🏼', '👃🏼'];

// var moderateBrownEmojis = ['👶🏽', '👦🏽', '👧🏽', '👨🏽', '👩🏽', '👱🏽‍♀️', '👱🏽', '👴🏽', '👵🏽', '👲🏽', '👳🏽‍♀️', '👳🏽', '👮🏽‍♀️', '👮🏽', '👷🏽‍♀️', '👷🏽', '💂🏽‍♀️', '💂🏽', '🕵🏽‍♀️', '🕵🏽', '👩🏽‍⚕️', '👨🏽‍⚕️', '👩🏽‍🌾', '👨🏽‍🌾', '👩🏽‍🍳', '👨🏽‍🍳', '👩🏽‍🎓', '👨🏽‍🎓', '👩🏽‍🎤', '👨🏽‍🎤', '👩🏽‍🏫', '👨🏽‍🏫', '👩🏽‍🏭', '👨🏽‍🏭', '👩🏽‍💻', '👨🏽‍💻', '👩🏽‍💼', '👨🏽‍💼', '👩🏽‍🔧', '👨🏽‍🔧', '👩🏽‍🔬', '👨🏽‍🔬', '👩🏽‍🎨', '👨🏽‍🎨', '👩🏽‍🚒', '👨🏽‍🚒', '👩🏽‍✈️', '👨🏽‍✈️', '👩🏽‍🚀', '👨🏽‍🚀', '👩🏽‍⚖️', '👨🏽‍⚖️', '🤶🏽', '🎅🏽', '👸🏽', '🤴🏽', '👰🏽', '🤵🏽', '👼🏽', '🤰🏽', '🙇🏽‍♀️', '🙇🏽', '💁🏽', '💁🏽‍♂️', '🙅🏽', '🙅🏽‍♂️', '🙆🏽', '🙆🏽‍♂️', '🙋🏽', '🙋🏽‍♂️', '🤦🏽‍♀️', '🤦🏽‍♂️', '🤷🏽‍♀️', '🤷🏽‍♂️', '🙎🏽', '🙎🏽‍♂️', '🙍🏽', '🙍🏽‍♂️', '💇🏽', '💇🏽‍♂️', '💆🏽', '💆🏽‍♂️', '🕴🏼', '💃🏽', '🕺🏽', '🚶🏽‍♀️', '🚶🏽', '🏃🏽‍♀️', '🏃🏽', '🤲🏽', '👐🏽', '🙌🏽', '👏🏽', '🙏🏽', '👍🏽', '👎🏽', '👊🏽', '✊🏽', '🤛🏽', '🤜🏽', '🤞🏽', '✌🏽', '🤟🏽', '🤘🏽', '👌🏽', '👈🏽', '👉🏽', '👆🏽', '👇🏽', '☝🏽', '✋🏽', '🤚🏽', '🖐🏽', '🖖🏽', '👋🏽', '🤙🏽', '💪🏽', '🖕🏽', '✍🏽', '🤳🏽', '💅🏽', '👂🏽', '👃🏽'];

var lastUsedEmoji = [];

function set_cookie(cookiename, cookievalue, hours) {
    var date = new Date();
    date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
    document.cookie = cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();

}

// function showEmojiIcons(id) {

// 	if($('#emojiPopup').is(':visible')){
// 		$('#emojiPopup').hide();
// 	}else{
// 		$('#emoji_container').html('');
// 		if (getCookie('recentEmo') != "") {
// 			var drawRecent = JSON.parse(getCookie('recentEmo'));
// 		} else {
// 			var drawRecent = 0;
// 		}

// 		emoCount = 0;
// 		var design = '<div class="emoji_div">';

// 		if (drawRecent.length > 0) {
// 			design += '<div class="emoji-container-name recentEmo">Recent reaction</div>';
// 			design += '<div class="emoji-container overlayScrollbars recentEmo" style="height: auto;">';
// 			$.each(drawRecent, function (k, v) {
// 				design += '<span>'+v+'</span>';
// 			});
// 			design += '</div>';
// 		}

// 		design += '<p class="emojiHeading">Smileys</p>'
// 		for (var i = 0; i < emojiArray.length;) {
// 			design += '<span>'+emojiArray[i]+'</span>';
// 			i++;
// 		}
// 		design += '<p class="emojiHeading">People and Fantasy</p>'
// 		for ( var i = 0; i < peopleFantasy.length;) {
// 			design += '<span>' + peopleFantasy[i]+'</span>';
// 			i++;
// 		}
// 		design += '<p class="emojiHeading">Clothing and Accessories</p>'
// 		for (var i = 0; i < clothingAccessories.length;) {
// 			design += '<span>' + clothingAccessories[i]+'</span>';
// 			i++;
// 		}
// 		design += '<p class="emojiHeading">Pale Emojis</p>'
// 		for (var i = 0; i < paleEmojis.length;) {
// 			design += '<span>' + paleEmojis[i]+'</span>';
// 			i++;
// 		}
// 		design += '<p class="emojiHeading">Cream White Emojis</p>'
// 		for (var i = 0; i < creamWhiteEmojis.length;) {
// 			design += '<span>' + paleEmojis[i]+'</span>';
// 			i++;
// 		}
// 		design += '<p class="emojiHeading">Moderate Brown Emojis</p>'
// 		for (var i = 0; i < moderateBrownEmojis.length;) {
// 			design += '<span>' + moderateBrownEmojis[i]+'</span>';
// 			i++;
// 		}

// 		design += '</div>';

// 		$('#emoji_container').append(design);
// 		insert_emoji(id);
// 		$('#emojiPopup').css('z-index', 9);
// 		$('#emojiPopup').show();
// 	}
// }
var visibleId = '';

function showEmojiIcons(id) {
    visibleId = id;

    var json_str = getCookie('usedEmoji');
    if (json_str == '') {
        json_str = '[]';
    }
    lastUsedEmoji = JSON.parse(json_str);
    $('#AllrecentEmoji').html('');
    if (lastUsedEmoji.length > 0) {
        $('#AllrecentEmoji').parent('.intercom-emoji-picker-group').show();
        $.each(lastUsedEmoji, function(k, v) {
            $('#AllrecentEmoji').append('<span class="intercom-emoji-picker-emoji" title="' + v.name + '">' + v.unicode + '</span>');
        })
    } else {
        $('#AllrecentEmoji').parent('.intercom-emoji-picker-group').hide();
    }

    if ($('.intercom-composer-emoji-popover').is(':visible')) {
        $('.intercom-composer-emoji-popover').hide();
    } else {

        $('.intercom-composer-emoji-popover').css('z-index', 9);
        $('.intercom-composer-emoji-popover').show();
        // insert_emoji(id);
    }
}

// var insert_emoji = (id) => {
// 	$('#emoji_container span').on('click', function () {
// 		var emoji_name = $(this).html();
// 		if(recentEmo.indexOf(emoji_name) == -1){
// 			if (recentEmo.length > 15) {
// 				recentEmo.shift();
// 			}
// 			recentEmo.push(emoji_name);
// 		}
// 		setCookie('recentEmo', JSON.stringify(recentEmo), 1);
// 		$('#' + id).append('<span>' + emoji_name +'</span>');
// 		var el = document.getElementById(id);
// 		placeCaretAtEnd(el);
// 	});
// };

// var insert_emoji = (id) => {
// $('.intercom-emoji-picker-emoji').on('click', function () {
$(document).on("click", ".intercom-emoji-picker-emoji", function(e) {
    var emoji_name = $(this).html();

    console.log(emoji_name);
    $('#' + visibleId).append(emoji_name);
    // $('#' + id).append('<span>' + emoji_name +'</span>');

    var data = {
        name: $(this).attr('title'),
        unicode: $(this).html()
    }

    var allTitle = [];
    $.each(lastUsedEmoji, function(k, v) {
        allTitle.push(v.name);
    });
    if (allTitle.indexOf($(this).attr('title')) == -1) {
        if (lastUsedEmoji.length > 8) {
            lastUsedEmoji.pop();
        }
        lastUsedEmoji.unshift(data);
    }
    // console.log(lastUsedEmoji);
    var json_str = JSON.stringify(lastUsedEmoji);
    set_cookie('usedEmoji', json_str, 24);
    var el = document.getElementById(visibleId);
    placeCaretAtEnd(el);
});
// };


$('.intercom-composer-popover-input').on('input', function() {
    var query = this.value;
    if (query != "") {
        $(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
    } else {
        $(".intercom-emoji-picker-emoji").show();
    }
});

var placeCaretAtEnd = (el) => {
    el.focus();
    if (typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined") {
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


/**
 * File upload function
 */
var request = [];
var count_files = 0;
var comment_text = '';
var temp_conv_ori_name = [];
var uploadAttachFileServer = (files) => {
    request = [];
    formDataTemp.length = 0;
    for (var i = 0; i < files.length; i++) {
        if (count_files > 19) {
            // alert("You can upload max 20 files at a time");
            $('#fileWrnPopup .delete_msg_sec_title').text('You can upload max 20 files at a time.');
            $('#fileWrnPopup').css('display', 'flex');
            return false;
        }
        var fileName = document.getElementById('UploadFiles').value.toLowerCase();
        // var fileName = files[i].name;
        // fileName.toLowerCase();
        if (fileName.endsWith('.dll') || fileName.endsWith('.exe') || fileName.endsWith('.bat')) {
            $('#fileWrnPopup .delete_msg_sec_title').text('ddl,exe,bat files are not allowed to upload here..');
            $('#fileWrnPopup').css('display', 'flex');
            return false;
        }
        var formData = new FormData();

        console.log(files[i].name);
        var entries = formData.entries();
        for (var pair of entries) {
            formData.delete(pair[0]);
        }
        var has_already = false;
        formDataTemp.forEach(function(vv) {
            if (vv.name == files[i].name) {
                has_already = true;
            }
        });
        if (has_already === true) continue;
        // comment_text += files[i].name + '\n'; // If file name as comment
        comment_text = 'No Comments';
        formDataTemp.push(files[i]);
        formData.append('bucket_name', bucket_name);
        formData.append('file_upload', files[i]);
        count_files++;
        var slid = Number(moment().unix()) + i + 1;
        formData.append('sl', slid);
        var file_ext = files[i].name.split('.').pop().toLowerCase();
        switch (file_ext) {
            case 'ai':
            case 'mp3':
            case 'mp4':
            case 'mkv':
            case 'avi':
            case 'wmv':
            case 'm4v':
            case 'mpg':
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
                file_ext = file_ext;
                break;
            default:
                file_ext = 'other';
        }

        if (files[i].type.startsWith('image/')) {
            var imgsrc = window.URL.createObjectURL(files[i]);
        } else {
            var imgsrc = "/images/basicAssets/" + file_ext + ".svg";
        }
        var imgalt = window.URL.createObjectURL(files[i]);
        var stopthis = () => {
            this.abort();
        };
        request[slid] = $.ajax({
            xhr: function() {
                $('.fileno_' + slid).find('.chat_file_progress').show();
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("loadstart", function(et) {
                    var ext = files[i].name.split('.').pop();
                    this.progressId = slid;
                    var html = '<div class="chat-uploading-files fileno_' + this.progressId + '">';
                    html += '<span class="close-chat-uploading-file"> <span class="remove"></span></span>';
                    html += '<div class="chat-file-icons">';
                    html += '<img src="' + imgsrc + '" alt="' + imgalt + '" data-filetype="' + files[i].type + '" data-name="' + files[i].name + '">';
                    html += '</div>';
                    html += '<div class="chat-file-information">';
                    html += '<h4><span class="name" onclick="active_for_rename(event)" onblur="rename_done_for_check(\'' + slid + '\')">' + (files[i].name).replace("." + ext, "") + '</span><span>.' + ext + '</span></h4>';
                    html += '<p>' + moment().format('MMM DD, YYYY @ h:mm a') + '</p>';
                    html += '<div class="chat_file_progress">';
                    html += '<div class="progress-bar progress-bar-success progress-bar-striped">&nbsp;</div>';
                    html += '</div>';
                    html += '</div>';
                    $(".filePreviewSection").append(html);
                    $("#viewUploadFileviewUploadFile").append(html);
                    closeAttachFile(this.progressId);
                    $('.fileno_' + slid).find('.chat_file_progress').show();
                });
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        var percom = Math.ceil(percentComplete * 100);
                        // if(percom >50) xhr.abort();
                        $('.fileno_' + this.progressId).find('.progress-bar').css("width", percom + "%");
                        $('.fileno_' + this.progressId).find('.progress-bar').attr("aria-valuenow", percom);
                    }
                }, false);
                return xhr;
            },
            url: '/s3Local/upload_obj',
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function(res) {
                $('.fileno_' + res.sl).find('.chat_file_progress').remove();
                var comfile = JSON.parse(request[res.sl].responseText);

                $('.fileno_' + res.sl).find('.close-chat-uploading-file').attr('data-filename', comfile.file_info[0].bucket + '/' + comfile.file_info[0].key);
                add_file_data(res.file_info);

                if ($("#attachmentPopup").find(".warning").length == 0)
                    $('.send-attachment').addClass('active').removeClass('inactive');
                if (temp_conv_ori_name.indexOf(comfile.file_info[0].originalname) > -1) {
                    rename_needed(res.sl);
                    $('.send-attachment').addClass('inactive').removeClass('active');
                }

                $("div#fileComments").focus();

                var entries = formData.entries();
                for (var pair of entries) {
                    formData.delete(pair[0]);
                }
            },
            complete: function(e) {
                // $('.send-attachment').addClass('active').removeClass('inactive');
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
};

var submit_attachment = () => {
    var msg_text_from_file_comment = $('#fileComments').html();
    if ($("#reaplyMsgPopup").is(":visible")) {
        if (msg_text_from_file_comment != "")
            $('#reply_msg').html(msg_text_from_file_comment);
        else
            $('#reply_msg').html(comment_text);

        $('#fileComments').addClass('inactive').removeClass('active');

        rep_msg_send_fn();
    } else {
        if (msg_text_from_file_comment != "") {
            $('#msg').html(msg_text_from_file_comment);
            msg_text_from_file_comment = '';
        } else
            $('#msg').html(comment_text);

        $('#fileComments').addClass('inactive').removeClass('active');

        msg_form_submit();
    }
    closeUploadPopup();
}

function viewAttachPopup(elm) {
    if ($('#attachmentPopup').is(':visible')) {
        $('#attachmentPopup').hide();
    } else {
        $('#more_options_msg').hide();
        $('#fileComments').html('');
        $('#search_CreateMsgTag_att').val('');

        console.log(4249, $("#attachmentPopup form")[0])
        $("#attachmentPopup form")[0].reset();
        filedata.length = 0;
        filedata = [];
        audiofile.length = 0;
        audiofile = [];
        imgfile.length = 0;
        imgfile = [];
        otherfile.length = 0;
        otherfile = [];
        videofile.length = 0;
        videofile = [];
        formDataTemp.length = 0;
        formDataTemp = [];
        count_files = 0;
        comment_text = '';
        temp_conv_ori_name = [];
        $.each(per_conv_all_files, function(k, v) {
            temp_conv_ori_name.push(v.originalname);
        });

        $('#attachmentPopup').show();
        tempAttachmentTag = room_tag;

        $('.send-attachment').addClass('inactive').removeClass('active');
    }
}
var closeUploadPopup = () => {
    allfiles.length = 0;
    allfiles = [];
    filedata.length = 0;
    filedata = [];
    audiofile.length = 0;
    audiofile = [];
    imgfile.length = 0;
    imgfile = [];
    otherfile.length = 0;
    otherfile = [];
    videofile.length = 0;
    videofile = [];
    formDataTemp.length = 0;
    formDataTemp = [];
    temp_conv_ori_name = [];
    instant_tag = [];
    $(".filePreviewSection").html("");
    $('#attachmentPopup').hide()

}
var add_file_data = (data) => {
    $.each(data, function(k, v) {
        allfiles.push(v);
        // per_conv_all_files.push(v);
        var mime = v.mimetype;
        if (mime.indexOf('image') != -1)
            imgfile.push(v.bucket + '/' + v.key);
        else if (mime.indexOf('video') != -1)
            videofile.push(v.bucket + '/' + v.key);
        else if (mime.indexOf('audio') != -1)
            audiofile.push(v.bucket + '/' + v.key);
        else
            otherfile.push(v.bucket + '/' + v.key);
    });
    filedata = [{
        audiofile,
        imgfile,
        otherfile,
        videofile,
        allfiles
    }];
};
var closeAttachFile = (id) => {
    $('.close-chat-uploading-file').on('click', function(e) {
        var filename = $(this).parents('.chat-uploading-files').find('.chat-file-icons>img').attr('data-name');
        var filename_for_unlink = $(this).parents('.chat-uploading-files').find('.close-chat-uploading-file').attr('data-filename');
        console.log("filename_for_unlink", filename_for_unlink);
        formDataTemp.forEach(function(vv, key) {
            if (vv.name == filename) {
                formDataTemp.splice(key, 1);
            }
        });
        audiofile.forEach(function(fv, fk) {
            if (fv == filename_for_unlink)
                audiofile.splice(fk, 1);
        });
        imgfile.forEach(function(fv, fk) {
            if (fv == filename_for_unlink)
                imgfile.splice(fk, 1);
        });
        otherfile.forEach(function(fv, fk) {
            if (fv == filename_for_unlink)
                otherfile.splice(fk, 1);
        });
        videofile.forEach(function(fv, fk) {
            if (fv == filename_for_unlink)
                videofile.splice(fk, 1);
        });

        count_files--;

        $(this).parents('.chat-uploading-files').remove();

        temp_conv_ori_name = [];
        $.each(per_conv_all_files, function(k, v) {
            temp_conv_ori_name.push(v.originalname);
        });

        $.each($(".chat-file-information h4"), function(k, v) {
            if (temp_conv_ori_name.indexOf($(v).text()) > -1) {
                var sl = $(v).closest('.chat-uploading-files').attr('class').replace('chat-uploading-files fileno_', '');
                rename_needed(sl);
                $('.send-attachment').addClass('inactive').removeClass('active');
            } else
                temp_conv_ori_name.push($(v).text());
        });

        if ($("#attachmentPopup").find(".warning").length == 0 && $("#attachmentPopup").find('.chat-uploading-files').length != 0)
            $('.send-attachment').addClass('active').removeClass('inactive');
        else
            $('.send-attachment').addClass('inactive').removeClass('active');

        request[id].abort();
        var bucket_name = filename_for_unlink.substring(0, filename_for_unlink.indexOf("/"));
        var attch_list = JSON.stringify([filename_for_unlink.substring(filename_for_unlink.indexOf("/") + 1)]);

        $.ajax({
            url: "/s3Local/deleteObjects",
            type: "POST",
            data: { bucket_name, attch_list },
            dataType: 'json',
            beforeSend: function() {
                console.log(2156, bucket_name, attch_list);
            },
            success: function(res) {
                console.log("Mobile Unlink successfully", res);
            },
            error: function(e) {
                console.log("Error in unlink: ", e);
            }
        });
    });
}

function rename_needed(sl) {
    $('.fileno_' + sl).find('h4').attr('data-oldname', $('.fileno_' + sl).find('h4').text());
    $('.fileno_' + sl).find('h4 .name').attr('contenteditable', true);
    $('.fileno_' + sl).find('h4').css('background', '#FFF');
    $('.fileno_' + sl).find('h4 .name')
        .attr('onkeyup', 'check_all_files_for_unique(event, ' + sl + ')')
        .attr('onkeydown', 'check_all_files_for_unique(event, ' + sl + ')');
    if ($('.fileno_' + sl).find('.chat-file-information').find('.warning').length == 0)
        $('.fileno_' + sl).find('.chat-file-information').append('<p class="warning" style="color:#F00;">A file with the same name and extension already exists in this channel! Please revise the name of this new file.</p>');
    $('.fileno_' + sl).find('h4 .name').attr('ondblclick', 'active_for_rename(event)');
    $('.fileno_' + sl).find('h4 .name').attr('onblur', 'rename_done_for_check(' + sl + ')');
    $('.fileno_' + sl).css('background', '#fdea64');
    $('.send-attachment').addClass('inactive').removeClass('active');
}

function rename_done(sl) {
    for (var i = 0; i < allfiles.length; i++) {
        if ($('.fileno_' + sl).find('.close-chat-uploading-file').attr('data-filename') == allfiles[i].bucket + '/' + allfiles[i].key) {
            allfiles[i].originalname = $('.fileno_' + sl).find('h4').text();
            allfiles[i].voriginalName = $('.fileno_' + sl).find('h4').text();
            i = allfiles.length;
        }
    }
    $('.fileno_' + sl).find('h4 .name').attr('data-oldname', $('.fileno_' + sl).find('h4').text());
    $('.fileno_' + sl).find('h4 .name').attr('contenteditable', false);
    $('.fileno_' + sl).find('h4').css('background', 'unset');
    $('.fileno_' + sl).find('h4 .name').attr('onkeypress', 'check_all_files_for_unique(event, ' + sl + ')');
    $('.fileno_' + sl).find('.warning').remove();
    $('.fileno_' + sl).find('h4 .name').attr('ondblclick', 'active_for_rename(event)');
    $('.fileno_' + sl).find('h4 .name').attr('onblur', 'rename_done_for_check(' + sl + ')');
    $('.fileno_' + sl).css('background', '#FFF');
    if ($("#attachmentPopup").find(".warning").length == 0)
        $('.send-attachment').addClass('active').removeClass('inactive');
}

function upload_attachment() {
    $("#ChatFileUpload").hide();
}

function active_for_rename(event) {
    $(event.target).closest('.chat-uploading-files').css('background', '#fdea64');
    $(event.target).attr('contenteditable', true);
    $(event.target).css('background', '#FFF');
    $('.send-attachment').addClass('inactive').removeClass('active');
}

function check_all_files_for_unique(event, sl) {
    if (event.keyCode == 13) {
        event.preventDefault();
        event.stopImmediatePropagation();
        rename_done_for_check(sl);
    } else {
        rename_valid(sl);
    }
}

function rename_done_for_check(sl) {
    var str = $('.fileno_' + sl).find('h4').text().trim();
    var regx1 = /^[^\\\/\:\*\?\"\<\>\|\.]+(\.[^\\\/\ \\:\*\?\"\<\>\|\.]+)+$/;
    var msg1 = 'A file with the same name and extension already exists in this channel! Please revise the name of this new file.';
    var msg2 = 'Filename cannot be blank! Please give a unique name to this file to avoid file name conflict in this channel.';
    var msg3 = 'Invalid filename! Please give a valid filename with extention.';
    var warn_div = $('.fileno_' + sl).find('.chat-file-information').find('.warning');
    if (regx1.test(str)) {
        if (temp_conv_ori_name.indexOf(str) == -1 && str.length > 0) {
            var no_match = 0;
            $.each($('.chat-uploading-files h4'), function(k, v) {
                if ($(v).text() == str) no_match++;
                if (k + 1 == $('.chat-uploading-files').length && no_match == 1) {
                    rename_done(sl);
                } else if (k + 1 == $('.chat-uploading-files').length) {
                    if (warn_div.length == 0) {
                        warn_div.text(msg1);
                    }
                }
            });
        } else {
            if (str == '') {
                $('.fileno_' + sl).find('.chat-file-information').text(msg2);
            } else {
                if (warn_div.length == 0) {
                    $('.fileno_' + sl).find('.chat-file-information').append('<p class="warning" style="color:#F00;">' + msg1 + '</p>').show();
                } else {
                    warn_div.text(msg1);
                }
            }
        }
    } else {
        $('.fileno_' + sl).css('background', '#fdea64');
        if (warn_div.length == 0) {
            $('.fileno_' + sl).find('.chat-file-information').append('<p class="warning" style="color:#F00;">' + msg3 + '</p>').show();
        } else {
            warn_div.text(msg3).show();
        }
    }
}

function rename_valid(sl) {
    var str = $('.fileno_' + sl).find('h4').text();
    if (temp_conv_ori_name.indexOf(str) == -1) {
        var no_match = 0;
        $.each($('.chat-uploading-files h4'), function(k, v) {
            if ($(v).text() == str && str.length > 0) no_match++;
            if (k + 1 == $('.chat-uploading-files').length && no_match == 1) {
                $('.fileno_' + sl).find('.chat-file-information').find('.warning').hide();
            } else if (k + 1 == $('.chat-uploading-files').length) {
                $('.fileno_' + sl).css('background', '#fdea64');
                $('.fileno_' + sl).find('.chat-file-information').find('.warning').show();
                $('.uploadbtn').addClass('inactive').removeClass('active');
            }
        });
    } else {
        $('.fileno_' + sl).css('background', '#fdea64');
        $('.fileno_' + sl).find('.chat-file-information').find('.warning').show();
        $('.uploadbtn').addClass('inactive').removeClass('active');
    }
}
/**
 * End file upload
 */

/**
 * msg options
 * flug
 */
function opt_flagView() {
    var eles = $('.user_msg.selected_msg');
    $.each(eles, function(k, v) {
        if ($(v).attr('msg-type') != 'call' && $(v).attr('msg-type') != 'notification') {
            selected_msgid.push($(v).attr("data-msgid"));
        }
    });
    flagSelectedMsg();
}

function flagSelectedMsg() {
    if (selected_msgid.length > 0) {
        $.each(selected_msgid, function(k, v) {
            var ele = $("#msgid_" + v);
            flagunflag(ele);
        });
    }
}
var flagunflag = (ele) => {
    var flaggedMsg = '<img class="flaged_icon" onclick="flaggedUserMsg(event)" src="/images/basicAssets/Flagged.svg">';

    var msgid = $(ele).attr('data-msgid');

    if ($(ele).find(".flaged_icon").length == 1) {
        $.ajax({
            url: '/alpha2/flag_unflag',
            type: 'POST',
            data: { uid: user_id, msgid: msgid, is_add: 'no', conversation_id: conversation_id },
            dataType: 'JSON',
            success: function(res) {
                if (res.status) {
                    $(ele).find(".flaged_icon").remove();
                    $(".cancel_selection").trigger("click");
                    selected_msgid = [];
                }
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });
    } else {
        $.ajax({
            url: '/alpha2/flag_unflag',
            type: 'POST',
            data: { uid: user_id, msgid: msgid, is_add: 'yes', conversation_id: conversation_id },
            dataType: 'JSON',
            success: function(res) {
                if (res.status) {
                    $(ele).find(".msg_flag").append(flaggedMsg);
                    $(".cancel_selection").trigger("click");
                    selected_msgid = [];
                }
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });
    }
    $('.options.selected_msg').hide();
    $('.msg_options .options').css('width', '16.5%');
    $('.options.opt_emoji, .options.opt_reaply').show();
};

var flaggedUserMsg = (event) => {
        var msgid = $(event.target).closest('.user_msg').attr('data-msgid');
        var ele = $("#msgid_" + msgid);
        flagunflag(ele);
    }
    /* End flag */

/**
 * reply emoji
 */
function opt_emojiView(elm) {
    if ($('.msg_reactionsDiv').is(':visible')) {
        $('.msg_reactionsDiv').hide();
    } else {
        if ($('.user_msg.selected_msg').attr('msg-type') != 'call' && $('.user_msg.selected_msg').attr('msg-type') != 'notification') {
            $('.msg_reactionsDiv').show();
        }
    }
}

var add_reac_into_replies = (emojiname, msgid) => {
    var selected_msgid = [];
    var eles = $('.user_msg.selected_msg');

    $.each(eles, function(k, v) {
        selected_msgid.push($(v).attr("data-msgid"));
    });

    if (msgid != null) {
        selected_msgid.push(msgid);
    }

    if (selected_msgid.length == 1) {
        var msg_id = selected_msgid[0];
        var src = '/images/emoji/' + emojiname + '.svg';

        $.ajax({
            url: '/alpha2/add_reac_emoji',
            type: 'POST',
            data: { msgid: msg_id, conversation_id: conversation_id, emoji: emojiname },
            dataType: 'JSON',
            success: function(res) {
                if (res.status) {
                    if (res.rep == 'add') {
                        append_reac_emoji(msg_id, src, 1);
                        socket.emit("emoji_emit", { msgid: msg_id, emoji_name: emojiname, src: src, type: res.rep, sender_id: user_id, conversation_id: conversation_id });
                        selected_msgid = [];
                    } else if (res.rep == 'delete') {
                        update_reac_emoji(msg_id, src, -1);
                        socket.emit("emoji_emit", { msgid: msg_id, emoji_name: emojiname, src: src, type: res.rep, sender_id: user_id, conversation_id: conversation_id });
                        selected_msgid = [];
                    } else if (res.rep == 'update') {
                        var oldsrc = '/images/emoji/' + res.old_rep + '.svg';
                        update_reac_emoji(msg_id, oldsrc, -1);
                        append_reac_emoji(msg_id, src, 1);
                        socket.emit("emoji_emit", { msgid: msg_id, emoji_name: emojiname, src: src, oldsrc: oldsrc, type: res.rep, sender_id: user_id, conversation_id: conversation_id });
                        selected_msgid = [];
                    }
                }
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });
    }
};
var append_reac_emoji = (msgid, src, count) => {
    var allemoji = $('#msgid_' + msgid).find('.emoji img');
    if (allemoji == undefined) {
        emoji_html_append(msgid, src, count);
    } else {
        var noe = 0;
        $.each(allemoji, function(k, v) {
            if ($(v).attr('src') == src) {
                noe = parseInt($(v).next('.count-emoji').text());
                $(v).next('.count-emoji').text(noe + 1);
            }
        });
        if (noe === 0) {
            emoji_html_append(msgid, src, count);
        }
    }
    $(".msg_reactionsDiv").hide();
    selected_msgid = [];
    $(".cancel_selection").trigger("click");
};
var update_reac_emoji = (msgid, src, count) => {
    var allemoji = $('#msgid_' + msgid).find('.emoji img');

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
    $(".msg_reactionsDiv").hide();
    selected_msgid = [];
    $(".cancel_selection").trigger("click");
};
var emoji_html_append = (msgid, src, count) => {
    var emoji_name = ((src.split('/'))[3]).replace('.svg', '');
    var html = emoji_html(emoji_name, msgid, src, count);
    $('#msgid_' + msgid).find('.replies').append(html);
};
var emoji_html = (emoji_name, msgid, src, count) => {
    var html = '<span class="emoji ' + emoji_name + ' ">';
    html += '<img src="' + src + '" onclick="add_reac_into_replies(\'' + emoji_name + '\',\'' + msgid + '\')" data-msgid="' + msgid + '" data-name="' + emoji_name + '"> ';
    html += '<span class="count-emoji">' + count + '</span>';
    html += '</span>';
    return html;
}

/**
 * delete messages
 */
function opt_deleteView() {
    selected_msgid = [];
    var msg_id = $('.user_msg.selected_msg');
    $.each(msg_id, function(k, v) {
        selected_msgid.push($(v).attr("data-msgid"));
    });
    if (selected_msgid.length == 1) {
        var msgid = selected_msgid[0];
        var sender_id = $("#msgid_" + msgid).attr("data-senderid");
        var is_sender = (sender_id == user_id);
        $("#deleteMsgPopup").show();
        $('.main-deleted-msg').show();
        $('.main-deleted-msg .msg-user-photo img').attr('src', $('#msgid_' + msgid).find('.user_img img').attr('src'));
        $('.main-deleted-msg .delbody').html($('#msgid_' + msgid).find('.msg_section').html());
        $('#delete_msg_div').find('.btn-msg-del').attr('data-id', msgid);
        // for my conversation this code are needed
        // if ($('#conv' + user_id).hasClass('sideActive')) {
        // 	$('#delete_msg_div').find('.btn-msg-del').hide();
        // 	$('#delete_msg_div').find('.btn-msg-del.permanent_delete').show();
        // } else {
        // 	$('#delete_msg_div').find('.permanent_delete').hide();
        // }
    } else if (selected_msgid.length > 1) {
        $("#deleteMsgPopup").show();
        $('.main-deleted-msg').hide();
    }

    if (is_sender)
        $('.msg_del_all').show();
    else
        $('.msg_del_all').hide();
}


var delete_commit = (e, type) => {

    var msgid = $('.user_msg.selected_msg').attr('data-msgid');
    var msg_type = 'text';
    var msg_chk_title = '';
    if ($('#data_msg_body' + msgid).find('.msgCheckListContainer').length > 0) {
        msg_type = 'checklist';
        msg_chk_title = $('#data_msg_body' + msgid).find('.checkListPlainText').text();
    }

    if (type == 'for_all') {
        if ($('#reaplyMsgPopup').is(':visible')) {
            msgid = $('.main-deleted-msg>.thread_msg_opt').attr('msg-id');
            var main_conv_id = conversation_id;
            socket.emit('delete_message_last_time', { msg_id: msgid, participants: participants, conversation_id: thread_id, user_id: user_id, type: type, main_conv_id: main_conv_id }, function(res) {
                if (res.status) {
                    $('.rep_msg_' + msgid).find('.thread_msg_opt').remove();
                    $('.rep_msg_' + msgid).find('.thread_chk_item').remove();
                    $('.rep_msg_' + msgid).find('.updatedTextOriginal').remove();
                    $('.rep_msg_' + msgid).find('#rep_msg_body' + msgid).html('').append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i>');
                    closePopUps('#deleteMsgPopup');
                }
            })
        } else {
            socket.emit('delete_message_last_time', { msg_id: msgid, conversation_id, user_id, type, main_conv_id: "" }, function(res) {
                if (res.status) {
                    if (msg_type == 'checklist') {
                        $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> "' + msg_chk_title + '" Checklist has been deleted by  ' + user_fullname + '</i><span onclick="permanent_delete_silently(this,\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                    } else {
                        $('#msgid_' + msgid).addClass('deleted');
                        $('#msgid_' + msgid).find('.msg_body').html('<p class="msg_caption"><i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span></p>');
                    }
                    closePopUps('#deleteMsgPopup');
                    cancel_selection();
                }
            });
        }
    } else {
        if ($('#reaplyMsgPopup').is(':visible')) {
            msgid = $('.main-deleted-msg>.thread_msg_opt').attr('msg-id');
            var main_conv_id = conversation_id;
            socket.emit('delete_message_last_time', { msg_id: msgid, participants: participants, conversation_id: thread_id, user_id: user_id, type: type, main_conv_id: main_conv_id }, function(res) {
                if (res.status) {
                    $('.rep_msg_' + msgid).find('.thread_msg_opt').remove();
                    $('.rep_msg_' + msgid).find('.thread_chk_item').remove();
                    $('.rep_msg_' + msgid).find('.updatedTextOriginal').remove();
                    $('.rep_msg_' + msgid).find('#rep_msg_body' + msgid).html('').append('<i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i>');
                    closePopUps('#deleteMsgPopup');
                }
            });
        } else {
            if (selected_msgid.length > 1) {
                var data = { msgids: selected_msgid, user_id, conversation_id };
                socket.emit("delete_selected_msgs", data, (res) => {
                    if (res.status) {
                        $('#delete_msg_div').hide();
                        $.each(selected_msgid, function(k, v) {
                            $('#msgid_' + v).addClass('deleted');
                            $('#msgid_' + v).find('.msg_body').html('<p class="msg_caption"><i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + v + '\')" class="silent_delete"> (Remove this line)</span></p>');
                        });
                        closePopUps('#deleteMsgPopup');
                        cancel_selection();
                    }
                });
            } else {
                socket.emit('delete_message_last_time', { msg_id: msgid, conversation_id, user_id, type, main_conv_id: "" }, function(res) {
                    if (res.status) {
                        $('#delete_msg_div').hide();
                        if (msg_type == 'checklist') {
                            $('#msgid_' + msgid).addClass('deleted');
                            $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> "' + msg_chk_title + '" Checklist has been deleted by ' + user_fullname + '</i><span onclick="permanent_delete_silently(this,this,\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span>');
                        } else {
                            $('#msgid_' + msgid).addClass('deleted');
                            $('#msgid_' + msgid).find('.msg_body').html('<p class="msg_caption"><i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + msgid + '\')" class="silent_delete"> (Remove this line)</span></p>');
                        }
                        closePopUps('#deleteMsgPopup');
                        cancel_selection();
                    }
                });
            }
        }
    }
};


socket.on('msg_remove_for_All_broadcast', function(data) {
    var msg_type = 'text';
    if ($('#data_msg_body' + data.msg_id).find('.msgCheckListContainer').length > 0) {
        msg_type = 'checklist';
    }
    if (data.user_id !== user_id) {
        if (msg_type == 'checklist') {
            $('#data_msg_body' + msgid).html('<i><img src="/images/delete_msg.png" class="deleteicon"> &nbsp; Checklist ' + $('#data_msg_body' + data.msg_id).find('.checkListPlainText').text() + ' has been deleted by ' + findObjForUser(data.user_id).fullname + '</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span>');
        } else {
            $('#msgid_' + data.msg_id).find('.msg_body').html('<p class="msg_caption"><i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + data.msg_id + '\')" class="silent_delete"> (Remove this line)</span></p>');
        }
    }
});

var permanent_delete_silently = (el, msgid) => {
    $('.msg_id_' + msgid).prev('.msg-separetor-unread').remove();
    socket.emit('updateHasHideThismsg', { msg_id: msgid, conversation_id: conversation_id, user_id: user_id }, function(res) {
        if (res.status) {
            $('.msg_id_' + msgid).remove();
        }
    });
};

socket.on('removedline', function(data) {
    if ($('#msgid_' + data.msg_id).prev().hasClass('msg-separetor') &&
        ($('#msgid_' + data.msg_id).next().hasClass('msg-separetor') || $('#msgid_' + data.msg_id).next().length == 0)) {
        $('#msgid_' + data.msg_id).prev().remove();
        $('#msgid_' + data.msg_id).remove();
    } else {
        $('#msgid_' + data.msg_id).remove();
    }
});

socket.on("delete_from_all", function(data) {

    var delhtml = '<p> <i><img src="/images/delete_msg.png" class="deleteicon"> This message was deleted.</i><span onclick="permanent_delete_silently(this,\'' + data.msgid + '\')" class="silent_delete"> (Remove this line)</span></p>';
    $('#data_msg_body' + data.msgid).html(delhtml);
    alldeletemsgid.push(data.msgid);
    countAndGetchecklist();
});

socket.on('msg_remove_IO_io', function(res) {
        var delhtml = '<p> <i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + res.msg_id + '\')" class="silent_delete"> (Remove this line)</span></p>';
        $('#data_msg_body' + res.msg_id).html(delhtml);
        alldeletemsgid.push(res.msg_id);
        countAndGetchecklist();
    })
    // end of delete message

/**
 * share message
 */

var allconvdetails = [];
var alluserandrooms = [];

function shareThisMsg(elm) {
    selected_msgid = [];
    alluserandrooms = [];
    var eles = $('.user_msg.selected_msg');
    $.each(eles, function(k, v) {
        selected_msgid.push($(v).attr("data-msgid"));
    });

    console.log(4854, all_rooms);

    $.each(all_rooms, function(k, v) {
        var data = {
            conversation_id: v.conversation_id,
            conv_img: v.conv_img,
            title: v.title,
            type: 'group'
        }
        if (v.single == 'no') {
            if (v.title != '' && v.title != null) {
                alluserandrooms.push(data);
            }
        }
    });

    $.each(user_list, function(k, v) {
        var data = {
            conversation_id: v.id,
            conv_img: v.img,
            title: v.fullname,
            type: 'user'
        }
        if (!has_permission(v.id, 1600) && v.is_delete == 0) {
            alluserandrooms.push(data);
        }
    });
    var newdata = _.sortBy(alluserandrooms, ["title", 'asc']);

    // console.log(4702, newdata);

    $('.optMore_options').hide();
    var html = '';

    $.each(newdata, function(k, v) {
        html += '<div class="eachmember">'
        html += '<div class="member_img">';
        if (v.type == 'group') {
            html += '<img src="' + file_server + 'room-images-uploads/Photos/' + v.conv_img + '" alt="' + v.title + '">';
        } else {
            html += '<img src="' + file_server + 'profile-pic/Photos/' + v.conv_img + '" alt="' + v.title + '">';
        }
        html += '</div>';
        html += '<div class="member_info">';
        html += '<h2 class="member_title">' + v.title + '</h2>';
        html += '<span class="send_member sharebtn_' + v.conversation_id + '" data-type="' + v.type + '" data-uid="' + v.conversation_id + '" onclick="share_this_msg_with(event)">Send</span>';
        html += '</div>';
        html += '</div>';
    });
    $('#shareMsgPopup .membersList').html(html);
    $('#shareMsgPopup .popup_title').text('Forward message');
    $('#shareMsgPopup').css('display', 'flex');
}
var share_this_msg_with = (event) => {
    var uid = [$(event.target).attr("data-uid")];
    var type = $(event.target).attr("data-type");

    var data = {
        msg_id: selected_msgid,
        conversation_id: conversation_id,
        user_id: user_id,
        share_conv: uid
    }

    if (convertToChecklist) {
        data['type'] = 'convert';
        data['user_fullname'] = user_fullname;
        data['user_image'] = user_img;
        data['msg_body'] = $('#data_msg_body' + selected_msgid[0]).text();
    }

    if (type == 'user') {
        if (user_id == uid) {
            socket.emit('forwardMessageV2', data, (res) => {
                if (res) {
                    $('.sharebtn_' + uid).attr('onclick', '');
                    $('.sharebtn_' + uid).html('Sent').attr('data-status', 'sent');
                }
            });
        } else {
            data.share_conv = [];
            socket.emit('findandgetconv', { user_id: user_id, fnd_id: uid }, function(res) {
                if (res.status) {
                    data.share_conv = [res.data.conversation_id];

                    socket.emit('forwardMessageV2', data, (res) => {
                        if (res) {
                            $('.sharebtn_' + uid).attr('onclick', '');
                            $('.sharebtn_' + uid).html('Sent').attr('data-status', 'sent');
                        }
                    });
                } else {
                    if (res.err) {
                        console.log(4923, res.err);
                    } else {
                        var data2 = {
                            created_by: user_id,
                            participants: [user_id, uid],
                            company_id: company_id
                        }
                        socket.emit('createNewSingleconv', data2, function(res2) {
                            if (res2.status) {
                                data.share_conv = [res2.result.conversation_id];

                                socket.emit('forwardMessageV2', data, (res) => {
                                    if (res) {
                                        $('.sharebtn_' + uid).attr('onclick', '');
                                        $('.sharebtn_' + uid).html('Sent').attr('data-status', 'sent');
                                    }
                                });
                            } else {
                                console.log(4941, res2);
                            }
                        })
                    }
                }
            });
        }
    } else {
        socket.emit('forwardMessageV2', data, (res) => {
            if (res) {
                $('.sharebtn_' + uid).attr('onclick', '');
                $('.sharebtn_' + uid).html('Sent').attr('data-status', 'sent');
            }
        });
    }

    console.log(4937, data);

};
// share msg end

function open_search_input() {
    $(".search_ico").addClass("active");
    $(".src_convUser").focus();

    $(".src_convs").removeClass("active");
    $(".filterItem li").css("background", "#FFF");
    $('input:checkbox').removeAttr('checked');
    $('input[type=checkbox]').prop('checked', false);
    $.each($(".conv_area"), function(k, v) {
        $(v).show();
    });
    $.each($(".msg_body"), function(k, v) {
        $(v).closest(".user_msg").show();
    });
}

function search_conv_list(e) {
    var str = $(".src_convUser").val().trim().toLowerCase();
    str = str.replace(/,/g, ';');
    str = str.split(";");
    var src_div;
    if ($('#chat_conversations').is(':visible')) {
        src_div = $('#chat_conversations');
    } else if ($('#call_conversations').is(':visible')) {
        src_div = $('#call_conversations');
    } else if ($('#all_channels').is(':visible')) {
        src_div = $('#all_channels');
    }

    // $.each(src_div.find('.conv_area'), function(k, v){
    // 	// if($(v).attr("data-name").trim().toLowerCase().indexOf(str) > -1){
    // 	if($(v).find('.title').text().trim().toLowerCase().indexOf(str) > -1){
    // 		$(v).removeClass('hide_data').show();
    // 	}else{
    // 		$(v).addClass('hide_data').hide();
    // 	}
    // });
    var code = e.keyCode || e.which;
    if (code == 8) {
        $('.conv_area').removeClass('hide_data').show();
    }

    $.each(str, function(k, v) {

        // console.log(k,v);
        var value = v.trim();
        src_div.find('.conv_area:visible').each(function() {
            if ($(this).find('.conv_name').text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).removeClass('hide_data').show();
            } else {
                $(this).addClass('hide_data').hide();
            }
        });
    });

    var data = $('.hide_data');
    if (src_div.find('.conv_area').length == data.length) {
        if (src_div.find('.empty_msg').length == 0) {
            if ($('#call_conversations').is(':visible')) {
                src_div.prepend('<h2 class="empty_msg">No call(s) were found.</h2>');
            } else {
                src_div.prepend('<h2 class="empty_msg">No channel(s) were found.</h2>');
            }
        }
    } else {
        src_div.find('.empty_msg').remove();
    }

}

/**
 * Reply a message
 */

function opt_reaplyView() {
    var msgid = $('.user_msg.selected_msg').attr("data-msgid");
    var type = $('.user_msg.selected_msg').attr("msg-type");
    open_reply_msg(msgid, type);
}

function open_reply_msg(msgid, type = null) {
    selected_msgid = [];

    if ($('#reaplyMsgPopup').is(":visible") == false) {
        if ($('.user_msg.selected_msg').attr('msg-type') != 'call' && $('.user_msg.selected_msg').attr('msg-type') != 'notification') {
            selected_msgid.push(msgid);
            if (selected_msgid.length == 1) {
                $('.user_msg.selected_msg')
                var msgid = selected_msgid[0];
                $('#msgid_' + msgid).removeClass('msg_unread');
                $('#reaplyMsgPopup').removeClass('fileActive');
                $("#msgid_" + msgid).find(".unreadOn").removeClass("unreadOn");
                var img_url_prifix = file_server + 'profile-pic/Photos/';
                $.ajax({
                    url: "/alpha2/open_thread",
                    type: "POST",
                    data: { msg_id: msgid, conversation_id: conversation_id },
                    dataType: "JSON",
                    success: function(threadrep) {
                        thread_id = threadrep;
                        thread_root_id = msgid;
                        $('#reaplyMsgPopup .replies-container').html("");
                        /* main thread msg html design */
                        draw_reply_popup_html(
                            conversation_id,
                            msgid,
                            $('#msgid_' + msgid).attr('data-senderid'),
                            $('#msgid_' + msgid).find('.msg_time').html(),
                            $('#msgid_' + msgid).find('.msg_body').html());
                        $('#reply_msg').attr('placeholder', 'Reply to ' + $('#msgid_' + msgid).attr('data-sendername'));

                        /* end of main thread msg html design */

                        // $('#reaplyMsgPopup .replies-container').html("");
                        if (checklistRepText == null) {
                            $('#define_thread_text').remove();
                        }
                        $('#reaplyMsgPopup').css('display', 'flex');
                        $('#reply_msg').html('').focus();

                        find_and_show_reply_msg(msgid);
                    },
                    error: function(err) {
                        console.log(err.responseText);
                    }
                });

                if (type == 'call') {
                    $('.write-thread-msgs').hide();
                } else {
                    $('.write-thread-msgs').show();
                }
            }
        }
    }
}


var read_rep_counter = 0;
var find_and_show_reply_msg = (msgid) => {
    var noofreply;
    if ($('#msgid_' + msgid).find('.no-of-replies').text() == '') {
        noofreply = 'No';

    } else {
        noofreply = parseInt($('#msgid_' + msgid).find('.no-of-replies').text());
    }
    $('.reply-separetor p').html(noofreply + ' Reply');
    // $.each(unread_replay_data, function (k, v) {
    // 	if (v.root_msg_id == msgid) {
    // 		var nor = Number($('#conv' + v.root_conv_id).attr('data-nor'));
    // 		$('#conv' + v.root_conv_id).attr('data-nor', (nor - 1 > 0) ? nor - 1 : "");
    // 		$('#conv' + v.root_conv_id).find('.unreadMsgCount').text((nor - 1 > 0) ? nor - 1 : "");
    // 		$('#msgid_' + msgid).css('background', 'transparent');
    // 		v.root_msg_id = 0;
    // 		v.root_conv_id = 0;
    // 		read_rep_counter++;
    // 	}
    // });
    // if ((unread_replay_data.length - read_rep_counter) == 0) {
    // 	$(".thread_active").hide();
    // 	$(".thread_message").hide();
    // 	read_rep_counter = 0;
    // }

    if (noofreply > 0) {
        socket.emit('find_reply', { msg_id: msgid, conversation_id: conversation_id }, (reply_list) => {
            if (reply_list.status) {
                var reply_list_data = _.sortBy(reply_list.data, ["created_at", ]);
                var need_update_reply_message_seen_list = [];
                var rep_conv_id = reply_list_data[0].conversation_id;
                $.each(reply_list.files, function(k, v) {
                    v['conversation_id'] = rep_conv_id;
                    v.location = v.location.replace('http://', 'https://').replace('%40', '@');
                    v.location = v.location.replace(file_server, '');
                    per_conv_all_files.push(v);
                });
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
                            if (row.sender != user_id) {
                                // This msg receive by this user; so need to change seen status
                                need_update_reply_message_seen_list.push(row.msg_id);
                            }
                        } else {

                        }
                    }
                    if (need_update_reply_message_seen_list.length == 1)
                        draw_rep_urhr();
                    draw_rep_msg(row);
                });
                // scrollToBottom(".replies-container");
                if (need_update_reply_message_seen_list.length > 1)
                    find_rep_urhr_add_s(need_update_reply_message_seen_list.length);

                // if (need_update_reply_message_seen_list.length > 0) {
                $.ajax({
                    url: '/alpha2/update_msg_status',
                    type: 'POST',
                    data: {
                        // msgid_lists: JSON.stringify(need_update_reply_message_seen_list),
                        user_id: user_id,
                        conversation_id: rep_conv_id
                    },
                    dataType: 'JSON',
                    success: function(res) {
                        socket.emit('update_msg_seen', {
                            msgid: res.msg_ids,
                            senderid: to,
                            receiverid: user_id,
                            conversation_id: conversation_id
                        });
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
                // }

                // separetor_show_hide();
            } else {
                console.log('replay search query error', reply_list); // error meessage here
            }
        });
    }
};

var draw_reply_popup_html = (rep_con_id, rep_msg_id, senderid, time, body) => {
    $("#reaplyMsgPopup").attr("data-rep_con_id", rep_con_id);
    $("#reaplyMsgPopup").attr("data-rep_msg_id", rep_msg_id);
    var html = '<div id="rep_main_msg">' +
        '<div class="main-thread-msgs">' +
        '<div class="thread-user-photo thread-msg-img"><img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(senderid).img + '" alt="' + file_server + 'profile-pic/Photos/' + findObjForUser(senderid).img + '"></div>' +
        '<div class="thread-user-msg"><h4><span class="thread-msg-name">' + findObjForUser(senderid).fullname + '</span>&nbsp;<span class="thread-msg-time tmt">' + time + '</span></h4>' +
        '<div class="mtmbody">' + body + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#reaplyMsgPopup .replies-container').prepend(html);
    // $("#reaplyMsgPopup").find(".thread-msg-img img").attr("src", file_server+'profile-pic/Photos/'+findObjForUser(senderid).img);
    // $("#reaplyMsgPopup").find(".thread-msg-name").html(findObjForUser(senderid).fullname);
    // $("#reaplyMsgPopup").find(".tmt").html(time);
    // $("#reaplyMsgPopup").find(".mtmbody").html(body);
    // $('.toggle_msg').hide();
    // setTimeout(function(){
    //        if ($('#rep_main_msg').height() > 50) {
    //        	$('.toggle_msg').addClass('active').show();
    //        	$('#rep_main_msg').addClass('active');
    //        }
    //    }, 1000);
};

function toggle_msg(el) {
    if ($(el).hasClass('active')) {
        $(el).text('Show full message');
        $(el).removeClass('active');
        $('#rep_main_msg').removeClass('active').css('max-height', '48px');
    } else {
        $(el).text('Hide full message');
        $(el).addClass('active');
        $('#rep_main_msg').addClass('active').removeAttr('style');
    }
}

var draw_rep_msg = (row) => {
    /* Start Date Group By */
    var msg_date = moment(row.created_at).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
        sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
    });
    var temp_date = msg_date;

    // if (append) {
    $.each($('.replies-container .msg-separetor'), function(k, v) {
        if ($(v).text() == msg_date) {
            msg_date = null;
            return 0;
        }
    });
    // && $('.replies-container .msg-separetor-unread').length == 0
    if (msg_date !== null) {
        var date_html = '<div class="msg-separetor" data-date="' + msg_date + '"><p>' + msg_date + '</p></div>';
        $("#reaplyMsgPopup .replies-container").append(date_html);
    }
    // }
    $('#reaplyMsgPopup').attr('thread_root', row.conversation_id)

    var msg_append = true;
    var msg_deleted = false;

    if (row.has_delete != null) {
        if (row.has_delete.indexOf('delete_for_all') == -1) {
            if (row.has_delete.indexOf(user_id) > -1) {
                msg_deleted = true;
            }
        } else {
            msg_deleted = true;
        }
    }
    if (row.has_hide != null) {
        if (row.has_hide.indexOf(user_id) > -1) {
            msg_append = false;
        }
    }
    var has_title = findObjForUser(row.sender).fullname;
    if (row.sender == user_id) {
        has_title = "You";
    }
    if (msg_deleted) {
        // row.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> '+has_title+' deleted this message.</i><span onclick="permanent_delete_silently(this,\'' + row.msg_id + '\')" class="silent_delete"> (Remove this line)</span>';
        row.msg_body = '<i><img src="/images/delete_msg.png" class="deleteicon"> ' + has_title + ' deleted this message.</i>';
    }
    var img_url_prifix = file_server + 'profile-pic/Photos/';
    var html = '<div class="main-thread-msgs rep_msg_' + row.msg_id + ' ' + (row.msg_type == 'text' ? 'msg_text' : 'msg_file') + '" style="margin-top:10px;">';
    if (!msg_deleted) {
        html += '<div class="thread_msg_opt" created-by="' + row.sender + '" msg-id="' + row.msg_id + '" onclick="threadAction(event,\'open\')">';
        if (row.sender == user_id) {
            html += '	<span onclick="editReplyMsg(event)" class="edit_thisThread"></span>';
        }
        html += '	<span onclick="deleteThreadMsg(event)" class="delete_thisThread"></span>';
        html += '	<span onclick="threadAction(event,\'close\')" class="cancel_threadAction"></span>';
        html += '</div>';
    }
    html += '<div class="thread-user-photo">';
    html += '<img src="' + img_url_prifix + row.sender_img + '" alt="">';
    html += '</div>';
    html += '<div class="thread-user-msg">';
    html += '<h4>' + row.sender_name + '&nbsp;<span class="thread-msg-time">' + moment(row.created_at).format('h:mm a') + '</span></h4>';

    if (msg_deleted) {
        html += '<p>' + row.msg_body + '</p>'
    } else {

        if (row.msg_body == 'No Comments') {
            html += '<p></p>';
        } else if (row.attch_imgfile !== null || row.attch_videofile !== null || row.attch_otherfile !== null) {
            if (row.edit_history != null) {
                html += returnedithistoryDesignrep(row.edit_history, row, 'reaplied_text');
            } else {
                if (row.msg_body.indexOf('thread_chk_item') == -1) {
                    html += '<div class="rep_mainMsg" id="rep_msg_body' + row.msg_id + '">' + row.msg_body + '</div>';
                } else {
                    var thread_chk_item = row.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
                    var msg_body = row.msg_body.split(thread_chk_item)[row.msg_body.split(thread_chk_item).length - 1];

                    html += '' + thread_chk_item + '';
                    html += '<div class="rep_mainMsg" id="rep_msg_body' + row.msg_id + '">' + msg_body + '</div>';
                }
            }
        } else {
            if (row.edit_history != null) {
                html += returnedithistoryDesignrep(row.edit_history, row, 'reaplied_text');
            } else {
                if (row.msg_body.indexOf('thread_chk_item') == -1) {
                    html += '<div class="rep_mainMsg" id="rep_msg_body' + row.msg_id + '">' + row.msg_body + '</div>';
                } else {
                    var thread_chk_item = row.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
                    var msg_body = row.msg_body.split(thread_chk_item)[row.msg_body.split(thread_chk_item).length - 1];

                    html += '' + thread_chk_item + '';
                    html += '<div class="rep_mainMsg" id="rep_msg_body' + row.msg_id + '">' + msg_body + '</div>';
                }
            }
        }
        if (row.attch_videofile !== null) {
            html += per_msg_video_attachment(row.msg_id, row.attch_videofile);
        }
        if (row.attch_imgfile != null) {
            html += per_msg_img_attachment(row.msg_id, row.attch_imgfile, row.sender_name, row.sender_img);
        }
        if (row.attch_audiofile !== null) {
            // html += per_msg_audio_attachment(row.attch_audiofile);
            html += per_msg_file_attachment(row.attch_audiofile, row.sender_name, row.msg_id);
        }
        if (row.attch_otherfile !== null) {
            html += per_msg_file_attachment(row.attch_otherfile, row.sender_name, row.msg_id);
        }

    }

    html += '</div>';
    html += '</div>';

    if (msg_append) {
        $('#reaplyMsgPopup .replies-container').append(html);
    }

    messageEllipsis(row.msg_id, 'reply');
}
var draw_rep_urhr = () => {
    var html = '<div class="msg-separetor-unread"><p>1 new reply</p></div>';
    $("#reaplyMsgPopup .replies-container").append(html);
};
var find_rep_urhr_add_s = (nour) => {
    $("#reaplyMsgPopup .replies-container").find('.msg-separetor-unread>p').html(nour + ' new replies');
};
var draw_rep_count = (msgid, sender) => {
    var noofreply = Number($('#msgid_' + msgid).find('.no-of-replies').text());
    if (noofreply > 0) {
        $('#msgid_' + msgid).find('.no-of-replies').text(noofreply + 1);
        $('#msgid_' + msgid).find('.msgReply').attr('data-count', noofreply + 1);
        $('#msgid_' + msgid).find('.last_rep_text').html('Last reply ' + moment(new Date()).fromNow() + ' <b><i>' + sender + '</i></b>');
    } else {
        var html = per_msg_rep_btn(msgid, noofreply + 1, new Date(), sender, '');
        $('#msgid_' + msgid).find('.msgReply').attr('data-count', noofreply + 1);
        $('#msgid_' + msgid).find('.msg_body').append(html);
        if (sender != 'You') {
            $('#msgid_' + msgid).addClass('msg_unread');
            $('#msgid_' + msgid).find('.perMsg_reply').addClass('unreadOn');
        }
    }
    $('.reply-separetor p').html((noofreply + 1) + ' Reply');
}


function returnedithistoryDesignrep(edit_history, data, typeclass) {

    var design = '';
    var allmsg_edit = edit_history.split('@_$cUsJs');
    allmsg_edit.reverse();
    var hiddenCls = '';
    $.each(allmsg_edit, function(k, v) {
        var newData = JSON.parse(v);
        if (k == 0) {
            if (data.msg_body.indexOf('thread_chk_item') > -1) {
                var thread_chk_item = data.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
                design += '' + thread_chk_item + '';
            }
            design += '<div  class="orginal_text" id="rep_msg_body' + data.msg_id + '" data-index="' + k + '">' + newData.msg_body + '</div>';
        } else {
            design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + k + '"><p class="msg_historyBody">' + newData.msg_body + '</p><div class="lastUpdateTime">' + moment(Number(newData.update_at)).format('MMM Do YYYY') + ' at ' + moment(data.created_at).format('h:mm a') + '</div></div>';
            if (k == 2 && allmsg_edit.length > 3) {
                if (hiddenCls == '') {
                    hiddenCls = 'hiddenCl';
                    design += '<div class="showMoreEditedmsg" onclick="showfulleditedMsg(\'' + data.msg_id + '\',this)"> + Show All</div>'
                }
            }
        }
    });
    if (data.msg_body.indexOf('thread_chk_item') == -1) {
        design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + allmsg_edit.length + '"><p class="msg_historyBody">' + data.msg_body + '</p><div class="lastUpdateTime">' + moment(data.created_at).format('MMM Do YYYY - h:mm a') + '</div></div>';
    } else {
        var thread_chk_item = data.msg_body.match(/<p class="thread_chk_item">([^\<]*?)<\/p>/g);
        var msg_body = data.msg_body.split(thread_chk_item)[data.msg_body.split(thread_chk_item).length - 1];

        design += '<div class="updatedTextOriginal ' + hiddenCls + '" data-index="' + allmsg_edit.length + '"><p class="msg_historyBody">' + msg_body + '</p><div class="lastUpdateTime">' + moment(data.created_at).format('MMM Do YYYY - h:mm a') + '</div></div>';
    }

    return design;


    // var hiddenCls = '';
    // $.each(allmsg_edit,function(k,v){
    // 	var newData = JSON.parse(v);
    // 	if(k == 0){
    // 		design += '<div class="orginal_text" id="editedMsg_id'+data.msg_id+'"><div class="'+typeclass+'" id="data_msg_body'+data.msg_id+'">' + newData.msg_body + '</div></div>';
    // 	}else{
    // 		design += '<div class="updatedTextOriginal '+hiddenCls+'"><p class="msg_historyBody">'+newData.msg_body+'</p><div class="lastUpdateTime">'+moment(Number(newData.update_at)).format('MMM Do YYYY')+' at '+moment(data.created_at).format('h:mm a')+'</div></div>';
    // 		if(k == 2 && allmsg_edit.length > 3){
    // 			if(hiddenCls == ''){
    // 				hiddenCls = 'hiddenCl';
    // 				design += '<div class="showMoreEditedmsg" onclick="showfulleditedMsg(\''+data.msg_id+'\',this)"> + Show All</div>'
    // 			}
    // 		}
    // 	}
    // });
    // // design += '<div class="orginal_text" data33="333">' + data.msg_body + '</div>';
    // design += '<div class="updatedTextOriginal '+hiddenCls+'"><p class="msg_historyBody">' + data.msg_body + '</p><div class="lastUpdateTime">'+moment(data.created_at).format('MMM Do YYYY - h:mm a')+'</div></div>';

}

function check4submit(event) {
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        event.preventDefault();
        rep_msg_send_fn();
        // scrollToBottom(".replies-container");
    }

    // When typing start into reply message box
    if (typing === false) {
        console.log('x: number');
        typing = true;
        var convid = $('#reaplyMsgPopup').attr('data-rep_con_id');
        var msgid = $('#reaplyMsgPopup').attr('data-rep_msg_id');

        console.log(convid, msgid)

        socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: convid, reply: true, msg_id: msgid });
        timeout = setTimeout(timeoutFunction, 2000);
    }
}
var rep_msg_send_fn = () => {
    var str = $('#reply_msg').html();
    str = str.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, '$1');
    str = createTextLinks_(str);

    var dt = $('#define_thread_text').text();
    var allLink = linkify($('#reply_msg').text()).split('$_link_$');
    var filteredLink = [];
    $.each(allLink, function(k, v) {
        if (validURL(v.trim())) {
            if (filteredLink.indexOf(v.trim()) == -1) {
                filteredLink.push(v.trim());
            }
        }
    });
    //  console.log(18975,filteredLink)
    // if (filteredLink.length > 0) {
    //     var data = {
    //         msg_id: null,
    //         url_list: filteredLink,
    //         conversation_id: conversation_id,
    //         user_id: user_id
    //     }
    //     socket.emit('submit_url', data, function(res) {
    //         // console.log(18984,res);
    //     })
    // }

    if (str != "") {
        if ($('#define_thread_text').length > 0) {
            if (dt != '') {
                str = '<p class="thread_chk_item">' + dt + ': </p>' + str;
            }
            checklistRepText = null;
            $('#define_thread_text').remove();
        }

        var is_room = (conversation_type == 'group') ? true : false;
        $("#ChatFileUpload").closest('form').trigger("reset");
        $("#fileComments").html("");
        $("#attachmentPopup").hide("");
        var convid = $('#reaplyMsgPopup').attr('data-rep_con_id');
        socket.emit('send_rep_message', {
            conversation_id: thread_id,
            sender_img: user_img,
            sender_name: user_fullname,
            to: to,
            is_room: is_room,
            text: str,
            attach_files: filedata[0],
            thread_root_id: convid,
            root_msg_id: thread_root_id,
            secret_user: [],
            msg_status: [],
            allLink:filteredLink
        });

        if (allfiles.length > 0) {
            $.each(allfiles, function(k, v) {
                v['conversation_id'] = convid;
                v.location = v.location.replace('http://', 'https://').replace('%40', '@');
                v.location = v.location.replace(file_server, '');
                per_conv_all_files.push(v);
            });
            // socket.emit('conv_files_added', per_conv_all_files);
            // socket.emit('update_files_data', {conversation_id: thread_id, update_conv: convid}, function(res){
            //     socket.emit('conv_files_added', per_conv_all_files);
            //     allfiles = [];
            //     // console.log(1100, res);
            // });
        }

        socket.emit('update_thread_count', { msg_id: thread_root_id, conversation_id: convid, last_reply_name: user_fullname });
        draw_rep_count(thread_root_id, 'You');
        filedata.length = 0;
        filedata = [];
        audiofile.length = 0;
        audiofile = [];
        imgfile.length = 0;
        imgfile = [];
        otherfile.length = 0;
        otherfile = [];
        videofile.length = 0;
        videofile = [];
        formDataTemp.length = 0;
        formDataTemp = [];
        $("#reply_msg").html("");
        $("#reply_msg").focus();
    }
};

var temp_rep_msg_id = "";
socket.on('newRepMessage', function(message) {
    if (message.status && temp_rep_msg_id != message.msg.msg_id) {
        if (to == message.msg.sender_id || thread_id == message.msg.conversation_id) {
            temp_rep_msg_id = message.msg.msg_id;
            draw_rep_msg(message.msg);
            scrollToBottom(".replies-container");
        }

        console.log(111, user_id, message.msg.sender)
        if (user_id != message.msg.sender) {
            var data = {
                rep_conv: message.msg.conversation_id,
                msg_id: message.msg.msg_id,
                root_conv_id: message.root_conv_id,
                root_msg_id: message.root_msg_id,
                is_seen: false
            }
            console.log(222, data);

            // unread_replay_data.push(data);

            // console.log(333, unread_replay_data);
            // urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
            var nor = Number($('.convid' + message.root_conv_id).attr('data-nor'));
            $('.convid' + message.root_conv_id).attr('data-nor', Number(nor + 1));
            $('.convid' + message.root_conv_id).addClass("has_unread_replay");

            reply_msg_counter();

            var repLable = $('#msgid_' + message.root_msg_id).find('.perMsg_reply');
            if (!repLable.hasClass('unreadOn')) {
                $('#msgid_' + message.root_msg_id).addClass('msg_unread');
                repLable.addClass('unreadOn');
            }

            if ($('#reaplyMsgPopup').attr('thread_root') != message.msg.conversation_id || $('#reaplyMsgPopup').attr('thread_root') == '') {
                playNotification(data.root_conv_id);
                console.log('x: number');
            }

        }
    }
});
socket.on('update_thread_counter', function(data) {
    draw_rep_count(data.msg_id, data.last_reply_name);
});

var unread_thread_conv = [];

function reply_msg_counter() {
    var rmstA = 0;
    $.each($(".conv_area"), function(k, per_li) {
        if ($(per_li).attr('data-nor') !== undefined) {
            if ($(per_li).attr('data-nor') !== NaN) {
                if ($(per_li).attr('data-nor') !== '') {
                    var counter = parseInt($(per_li).attr('data-nor'));
                    rmstA = rmstA + counter;

                    console.log(5651, rmstA);
                    if (rmstA > 1) {
                        $("#thread_notify").html('<span id="thread_notify_cntr">' + rmstA + '</span> Threaded message(s)');
                    } else {
                        $("#thread_notify").html('<span>' + rmstA + '</span> Threaded message');
                    }

                    if ($(per_li).attr('data-nor') > 0) {
                        unread_thread_conv.push($(per_li).attr('data-conv-id'));
                    }

                    if (rmstA == 0) {
                        $(".connect_section").removeClass('thread_notify_visible');
                        // $("#thread_notify").hide();
                    } else {
                        $(".connect_section").addClass('thread_notify_visible');
                        // $("#thread_notify").css('display','flex');
                    }
                }
            }
        }
    });
}

function filter_thread_msg() {
    $('.conv_area').hide();
    $('.conv_area').attr('data-unreadThread', 'false');
    $('.unread_msg').hide();
    $.each(unread_thread_conv, function(k, v) {
        // console.log(v);
        $('.convid' + v).show();
        $('.convid' + v).attr('data-unreadThread', 'true');
        var nor = $('.convid' + v).attr('data-nor');
        $('.convid' + v).find('.unread_thread').html(nor);
    });
}

function clear_all_history() {
    var check_msg = [];
    if ($('#deletewithmedia').hasClass('checked')) {
        check_msg.push('media');
    }
    if ($('#deletewithflagged').hasClass('checked')) {
        check_msg.push('flagged');
    }
    var data = { conversation_id: conversation_id, user_id: user_id, allmyUnreadThread: allmyUnreadThread, check_msg: check_msg };
    socket.emit('clear_conv', data, (res) => {
        if (res.status) {
            // $('#msg-container').html("");
            location.reload();
        } else {
            console.log(res);
        }
        closePopUps('#clear_conversation');
        $("#more_options_chat").hide();
    });
}

function muteSubmit() {
    var muteNotificationValue = false;
    $.each($(".eachMuteTime"), function(k, v) {
        if ($(v).attr("data-status") == "checked") {
            muteNotificationValue = $(v).attr("data-val");
            return false;
        }
    });

    if (muteNotificationValue !== false) {
        // var mute_id = $('#notificationPopup').attr('data-mute-id');
        var nowTime = moment().format('llll');
        var endTime;
        if (muteNotificationValue == "30M") {
            endTime = moment(nowTime).add('30', 'minutes').format('llll');
        } else if (muteNotificationValue == "1H") {
            endTime = moment(nowTime).add('1', 'hour').format('llll');
        } else if (muteNotificationValue == "12H") {
            endTime = moment(nowTime).add('12', 'hours').format('llll');
        } else if (muteNotificationValue == "1D") {
            endTime = moment(nowTime).add('1', 'day').format('llll');
        } else if (muteNotificationValue == "1W") {
            endTime = moment(nowTime).add('1', 'week').format('llll');
        } else if (muteNotificationValue == "1Y") {
            endTime = moment(nowTime).add('1', 'year').format('llll');
        } else if (muteNotificationValue == "20Y") {
            endTime = moment(nowTime).add('20', 'years').format('llll');
        } else if (muteNotificationValue == "ownMuteOption") {
            nowTime = moment($('#muteCustomDate').val()).format('llll');
            endTime = moment($('#muteCustomendDate').val()).format('llll');
        }

        if ($('#muteMotifiPopup').is(':visible')) {
            var data = {
                conv_id: conversation_id,
                user_id: user_id,
                mute_start_time: nowTime,
                mute_duration: muteNotificationValue,
                mute_end_time: endTime,
                timezone: moment().format('Z')
            };

            socket.emit('mute_create', data, (res) => {
                closePopUps('#muteMotifiPopup');
                param_change('unmute', res.status.mute_id);
            });
        }
        // else{
        // 	var data = {
        // 		mute_id : mute_id,
        // 		mute_start_time : nowTime,
        // 		mute_duration : muteNotificationValue,
        // 		mute_end_time : endTime
        // 	};
        // 	socket.emit('mute_update',data,(res)=>{
        // 		$.each(myAllMuteConv,function(k,v){
        // 			if(v.mute_id == mute_id){
        // 				v.mute_start_time = nowTime;
        // 				v.mute_duration = muteNotificationValue;
        // 				v.mute_end_time = endTime;
        // 			}
        // 		});
        // 		closeModal('notificationPopup');
        // 	});
        // }
    }
}

function param_change(old, current) {
    var pathname = window.location.href;
    pathname = pathname.split('/');
    var index = pathname.indexOf(old);
    if (~index) {
        pathname[index] = current;
    }
    window.location.href = pathname.join('/');
}

function unmuteNotification(event, muteId) {
    event.stopImmediatePropagation();
    var data = {
        mute_id: muteId,
        user_id: user_id
    };
    if (muteId !== "") {
        $(event.target).removeClass('active');
        socket.emit('unmute_notification', data, (res) => {
            if (res.status == "success") {
                // $.each(myAllMuteConv,function(ka,va){
                // 	if(va.mute_id == muteId){
                // 		$('#conv'+va.conversation_id).children('.mute_bell').remove();
                // 		removeA(myAllMuteConv,va);
                // 		removeA(myAllMuteConvid,va.conversation_id);
                // 		closeModal('notificationPopup');
                // 		$('.customTooltipSidebar').remove();
                // 		return false;
                // 	}
                // });
                if (window.location.href.indexOf('/chat/') > -1) {
                    param_change(muteId, 'unmute');
                }
                // console.log(res);
            } else {
                console.log(res);
            }
        });
    }
}

// function search_convs(){
// 	var str = $(".src_convs").val().trim().toLowerCase();
// 	$.each($(".msg_body"), function(k, v){
// 		if($(v).find('p').text().trim().toLowerCase().indexOf(str) > -1){
// 			$(v).closest(".user_msg").show();
// 		}else{
// 			$(v).closest(".user_msg").hide();
// 		}
// 	});
// }

function removeThisTag(e) {
    // $('.main-deleted-tag .tagTitle').text($(e.target).text());
    $('#deleteMsgTag').css('display', 'flex');
    $('#deleteTagBtn').attr('data-tagid', $(e.target).attr('data-id'));
    $('#deleteTagBtn').attr('data-tagstr', $(e.target).text());
    $('#deleteTagBtn').attr('data-msgid', $(e.target).closest('.user_msg').attr('data-msgid'));
}

function delete_this_tag_from_this_msg(event) {
    var str = $(event.target).attr('data-tagstr');
    var msg_id = $(event.target).attr('data-msgid');
    var conv_id = $('#user_head_id').attr('room-id');
    var tagspanid = $(event.target).attr('data-tagid');
    var tag_id = tagspanid.replace("_" + str, "");
    socket.emit("delete_this_tag_from_this_msg", { msg_id, conv_id, tag_id, user_id }, function(rep) {
        if (rep.status) {
            $(".tag_name_view_" + tag_id).remove();
            closePopUps('#deleteMsgTag');
        }
    });
}

function leave_room() {

    var conv_admin = allUserdata[0].conversation[0].participants_admin;
    $('#leaveRoomPopup .delete_msg_sec_title').text('Are you sure you want to leave this room?');
    $('#leaveRoomPopup .msg_del_me').show();
    if (conv_admin.indexOf(user_id) > -1) {
        if (conv_admin.length == 1) {
            $('#leaveRoomPopup .msg_del_me').hide();
            $('#leaveRoomPopup .delete_msg_sec_title').text('Please add a room admin, then you may leave.');
        }
    }
    $('#leaveRoomPopup').css('display', 'flex');
    $('#more_options_chat').hide();
}

function leave_me() {
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetID: user_id,
            type: "leave",
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/leave_room',
        success: function(data) {
            if (data.msg == 'success') {

                var msg_body = user_fullname + ' left the room';
                var data = {
                    type: 'leave_room',
                    sender: user_id,
                    sender_name: user_fullname,
                    sender_img: user_img,
                    conversation_id: conversation_id,
                    msg_type: 'notification',
                    msg_body: msg_body
                }
                sendNotificationMsg(data);
                $('.back_ico').trigger('click');
                // window.location.href="/connect";
            }
        }
    });
}

function filter_unread(ele) {
    var i = 1;
    if ($(ele).hasClass('filtered')) {
        $(ele).css('background', '#FFF');
        $(ele).removeClass('filtered');
        $('.conv_area').show();
    } else {
        $(ele).css('background', '#D8D8D8');
        $(ele).addClass('filtered');
        var conv_unread = $(".unread_msg");
        $.each(conv_unread, function(k, v) {
            if (Number($(v).text()) == 0) {
                i = i + 1;
                $(v).closest('.conv_area').hide();
            }
        });
        console.log($('.conv_area').length, i);
        if ($('.conv_area').length == i) {
            var data = '<h2 class="empty_msg">No channel(s) were found.</h2>';

            if ($('#chat_conversations .empty_msg').length == 0) {
                $('#chat_conversations').prepend(data);
            }
        }
    }
    $(".b_label.filter").trigger('click');
}

function show_flag_msg(ele) {
    if ($(ele).hasClass('filtered')) {
        $(ele).css('background', '#FFF');
        $(ele).removeClass('filtered');
        $('.conv_area').show();
        $(".b_label.filter").trigger('click');
        setCookie("filtered", '', 0);
    } else {
        var conv_list = [];
        var all_conv = $(".conv_area");
        $(".loading_connect").css('display', 'flex');
        $.each(all_conv, function(k, v) {
            if ($(v).is(':visible')) {
                conv_list.push($(v).attr('data-conv-id'));
            }
        });

        socket.emit('getAllDataForSearch', {
            conversation_list: conv_list,
            target_text: '',
            target_filter: 'flag',
            user_id: user_id
        }, (rep) => {
            if (rep.status && rep.data.length > 0) {
                $(ele).css('background', '#D8D8D8');
                $(ele).addClass('filtered');
                $(".b_label.filter").trigger('click');
                setCookie("filtered", 'flag', 1);
                $.each(conv_list, function(k, v) {
                    if ((rep.data).indexOf(v) > -1) {
                        $('.convid' + v).show();
                        $('.convid' + v).attr('has_flagged', true);
                    } else {
                        $('.convid' + v).hide();
                        $('.convid' + v).attr('has_flagged', false);
                    }
                });
                $(".loading_connect").hide();
            } else {
                alert("No data found");
            }
        });

    }
}

var filter_conv_list = [];
var tag_title_list = '';

function select_filter_tag(e) {
    e.stopImmediatePropagation();
    var existingConv = [];
    $('.conv_area').each(function(i, obj) {
        if ($(obj).attr('data-conv-id') != undefined)
            existingConv.push($(obj).attr('data-conv-id'));
    });
    if (e.target.checked) {
        var tagtitle = $("#" + e.target.id).attr('data-tagtitle');
        var tagid = $("#" + e.target.id).attr('data-tagid');
        tag_title_list += "@" + tagtitle;

        socket.emit('getAllDataForTag', { conversation_list: existingConv, target_text: "", target_filter: 'tag', user_id: user_id, tag_list: [tagid], company_id: company_id }, (rep) => {
            if (rep.status) {
                $('.conv_area').hide();
                $.each(rep.data, function(k, v) {
                    $('.convid' + v).show();
                });
                $('.b_label.filter').trigger('click');
            } else {
                $('.conv_area').show();
                alert("No tag conversation found");
            }
        });
    } else {
        $('.conv_area').show();
        // var tagtitle = $("#"+e.target.id).attr('data-tagtitle');
        // var tagid = $("#"+e.target.id).attr('data-tagid');
        // tag_title_list = tag_title_list.replace("@"+tagtitle, '');
        // tag_title_list = tag_title_list != '' ? tag_title_list : '';

        // setCookie("filtered_tag", tag_title_list, 1);

        // var taglist = tag_title_list.split("@");

        // if(taglist.length > 0 && tag_title_list != ""){
        // 	$(".conv_area").hide();
        // 	$.each(filter_conv_list, function(k, v){
        // 		if(taglist.indexOf(v.title) > -1){
        // 			$.each(v.respons, function(tdk,tdv){
        // 				$('.convid'+tdv.conversation_id).show();
        // 			});
        // 		}
        // 	});
        // }else{
        // 	setCookie("filtered", "", 0);
        // 	filter_conv_list = [];
        // 	$(".conv_area").show();
        // }
    }
}

function searchconv(str) {
    $.each($('.hiddenconv-list'), function(k, v) {
        if ($(v).text().toLowerCase().trim().indexOf(str.toLowerCase().trim()) > -1)
            $(v).show();
        else
            $(v).hide();
    });
}

function show_hidden_conv(convid, company_id) {
    $("#unhide_conv").hide('slow');
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: convid,
            targetID: user_id,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/removeHideUserinSidebar',
        success: function(data) {
            if (data == 'success') {
                window.location.reload();
            } else {
                console.log(data);
            }
        }
    });
}

function detectswipe(el, callback) {

    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function(swipedir) {}

    touchsurface.addEventListener('touchstart', function(e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function(e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

function mobile_spiped(dir) {
    // alert("you swiped on element with id '"+el+"' to "+d+" direction");
    var msgid = $('.user_msg').first().attr('data-msgid');
    load_older_data(conversation_id, msgid);
    console.log(5743, dir);
}

var el = document.getElementById("msg-container");
// detectswipe(el, mobile_spiped);

var load_older_data = (conv_id, msg_id) => {
    if ($('#msg-container').attr('data-filter') == 'false' && $('#msg-container').attr('data-search') == 'false') {
        $('#scroll_loader').show();
        socket.emit('load_older_msg', { conversation_id: conv_id, msg_id: msg_id }, (result) => {
            $('#scroll_loader').hide();
            if (result.result.length > 0) {
                last_delivered_always_show();
                var convlist = _.sortBy(result.result, ["created_at", ]);
                convlist.reverse();
                result.result = convlist;

                $.each(result.result, function(mk, mv) {
                    if (mv.msg_type == 'checklist') {
                        if (mv.msg_body.indexOf('msgCheckListContainer') == -1) {
                            var thismsgcl = [];
                            $.each(result.checklist, function(ck, cv) {
                                if (cv.msg_id == mv.msg_id) {
                                    thismsgcl.push(cv);
                                    result.result[mk]['checklist'] = thismsgcl;
                                }
                            });
                        }
                    }
                });

                $.each(result.result, function(k, v) {
                    if ($('#selectAllMsg').hasClass('selected')) {
                        $('#selectAllMsg').removeClass('selected');
                    }
                    if (!$('#viewCallHistory').hasClass('active')) {
                        if (checkdrawmsg(v, adminArra, activeConvPrivacy)) {
                            draw_msg(v, false);
                        }
                    }
                });
            }
        });
    } else {
        console.log('Data filter true');
    }
};

var start_scroll = false;
var mousewheelevent = true;
$(window).bind('touchmove', function(event) {
    if (mousewheelevent) {
        var scrollTop = $('#msg-container').scrollTop();
        console.log(6681, scrollTop);
        var msgid = $('.user_msg').first().attr('data-msgid');
        if (scrollTop < 400 && msgid != undefined && conversation_id != undefined) {
            mousewheelevent = false;
            load_older_data(conversation_id, msgid);
            setTimeout(function() {
                $(document).ready(function() {
                    mousewheelevent = true;
                });
            }, 5000);
        }
    }
});


function checklistSubmit() {
    var hasitem = false;
    $.each($('#msgCheckItemContainer .checkListItem'), function(k, v) {
        if (!hasitem) {
            if ($(v).text().trim().length > 0) {
                hasitem = true;
            }
        }
    });
    if (!hasitem) {
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text("Sorry! At least one checklist item is required to post a checklist. Please add a checklist item and then click submit.");
        // alert("Minimum one chcklist required. Please write a checklist item.");
        return false;
    }

    if (convStr('#checkListPlainText1') == '') {
        if ($('#checkListPlainText1').hasClass('required') == false) {
            $('#checkListPlainText1').addClass('required');
        }
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text("Sorry! Checklist title is required to post a checklist. Please write checklist title and then click submit.");
        $('#checkListPlainText1').focus();
    } else {
        checklistMsgOption({ type: 'itemRemove' });
        if ($('#msgCheckItemContainer .checkListItem').length !== 0 || $('#msgCheckItemContainer .checkListPlainText').length !== 0) {
            checklistMsgOption({ type: 'send' });
        } else {
            checklistMsgOption({ type: 'remove' });
        }
    }
}

function checklistMsgOption(data) {
    if (data.type == 'send') {
        var emailSub = $('#checkListPlainText1').text();
        var checklist = [];
        $.each($('#msg .checkListItem'), function(k, v) {
            checklist.push($(v).find('.checkBoxTitle').text());
        });
        var msgtitle = $('#msgCheckItemContainer .checkListPlainText').text();
        $('#msgCheckItemContainer .checkListPlainText').html(msgtitle);
        $('#msgCheckItemContainer .checkListPlainText').attr('contenteditable', 'false');
        $('#msgCheckItemContainer .buttonAction').remove();
        $('#msgCheckItemContainer .checkBoxTitle').attr('contenteditable', 'false');
        $('#msgCheckItemContainer .checkBoxTitle').removeAttr('id');
        $('#msgCheckItemContainer .checkListPlainText').removeAttr('id');
        $('#msgCheckItemContainer').removeAttr('id');
        var email = $('#msg_email').val();
        if ($('#msg_email').is(':visible') && $('#msg_email').hasClass('active')) {
            var htmlData = {
                type: 'checklist',
                title: emailSub,
                checkitem: checklist
            }
            $('#msg_email').remove();
            var data = {
                to: allTempEmailAddress,
                sub: emailSub,
                text: '',
                msghtml: emailHtml(htmlData)
            }
            socket.emit('sendEmail', data, (res) => {
                if (res.msg == 'success') {
                    console.log('Email has been sent');
                }
            });
        }
        $('#msg_email').remove();
        msg_sending_process($('#msg').html());
        // countAndGetchecklist();
        $('#add_more_opt').trigger('click');
        $('.chat_foot_container .send_ico').attr('onclick', 'msg_form_submit()');
        $('.chat_foot_container .send_ico').attr('data-checklist', false);
        $('.chat_foot_container .close_ico').attr('data-checklist', false);
        $('#msg').attr('data-checklist', 'false');
        $('#msg').attr('contenteditable', true);
        $('#msgCheckListBtn').removeClass('active');
        $('#msg .msgCheckListContainer').remove();
        $('#msg').focus();
        $('#msgCustomEditOption .activeNumber').removeClass('active');
        $('#msgCustomEditOption .activeRadio').removeClass('active');
        allTempEmailAddress = [];
    } else if (data.type == 'remove') {
        $('#msgCheckItemContainer .checkListPlainText').attr('contenteditable', 'false');
        $('#msgCheckItemContainer .buttonAction').remove();
        $('#msgCheckItemContainer .checkBoxTitle').attr('contenteditable', 'false');
        $('#msgCheckItemContainer .checkBoxTitle').removeAttr('id');
        $('#msgCheckItemContainer .checkListPlainText').removeAttr('id');
        $('#msgCheckItemContainer').removeAttr('id');
        $('#msg').attr('data-checklist', 'false');
        $('#msg').attr('contenteditable', true);
        $('#msgCheckListBtn').removeClass('active');
        $('#msg .msgCheckListContainer').remove();
        $('#msg').focus();
        $('#msgCustomEditOption .activeNumber').removeClass('active');
        $('#msgCustomEditOption .activeRadio').removeClass('active');
        $('#msgCustomEditOption div').removeClass('active');
        allTempEmailAddress = [];
    } else if (data.type == 'itemRemove') {
        $.each($('#msgCheckItemContainer .checkBoxTitle'), function(k, v) {
            if ($(v).text() == '') {
                $(v).parent('.checkListItem').remove();
            }
        });

        $.each($('#msgCheckItemContainer .checkListPlainText'), function(k, v) {
            if ($(v).text() == '') {
                $(v).remove();
            }
        });
    }
}

function countAndGetchecklist(showing = null) {
    if (showing != null) {
        viewchecklisttype = 'view';
        $("#onscrollloading").show();
        $('#msg-container').html('');
        $('#msg-container').attr('has-msg', true);
        $('#msg-container').attr('data-checklist', true);

    }

    // console.log(6169, showing);
    allChecklistData = [];
    unchecklistMsglist = [];
    checklistMsglist = [];
    socket.emit('getChecklistConv', { conversation_id: conversation_id }, function(res) {
        if (res.status) {
            if (res.data.length > 0) {
                var unchecklist = 0;
                var completechecklist = 0;
                var allchecklist = 0;
                var allchecklistMsg = 0;
                var unchecklistmsg = 0;
                var completeChecklistMsg = 0;
                $.each(res.data, function(k, v) {
                    if (alldeletemsgid.indexOf(v.msg_id) == -1) {
                        $('#clcounterperMsg' + v.msg_id).attr('data-com', '0');
                        $('#clcounterperMsg' + v.msg_id).attr('data-length', '0');
                        if (v.msg_type == "checklist") {

                            var checkedlength = $('.msg_id_' + v.msg_id).find('.checkBox.checked').length;
                            if (checkedlength == 0) {
                                unchecklistmsg = unchecklistmsg + 1;
                            } else {
                                if (checkedlength == $('.msg_id_' + v.msg_id).find('.checkBox').length) {
                                    completeChecklistMsg = completeChecklistMsg + 1;
                                } else {
                                    unchecklistmsg = unchecklistmsg + 1;
                                }
                            }
                            allchecklistMsg = allchecklistMsg + 1;
                        }

                        var checklistall = []
                        $.each(res.checklist, function(ck, cv) {
                            if (cv.msg_id == v.msg_id) {
                                $('#clcounterperMsg' + v.msg_id).attr('data-length', (parseInt($('#clcounterperMsg' + v.msg_id).attr('data-length')) + 1));
                                var thismsgtotalcomcl = parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'));
                                var thismsgTotalcl = parseInt($('#clcounterperMsg' + v.msg_id).attr('data-length'));

                                checklistall.push(cv);
                                res.data[k]['checklist'] = checklistall;
                                if (cv.checklist_status == 0) {
                                    unchecklist = unchecklist + 1;
                                    unchecklistMsglist.push(res.data[k]);
                                    checklistMsglist.push(res.data[k]);
                                    $('#clcounterperMsg' + v.msg_id).html('(' + parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com')) + '/' + thismsgTotalcl + ')');
                                } else {
                                    checklistMsglist.push(res.data[k]);
                                    completechecklist = completechecklist + 1
                                    $('#clcounterperMsg' + v.msg_id).attr('data-com', (thismsgtotalcomcl + 1));
                                    $('#clcounterperMsg' + v.msg_id).html('(' + parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com')) + '/' + thismsgTotalcl + ')');
                                }
                                allchecklist = allchecklist + 1;

                                $('#data_msg_body' + v.msg_id).find('.filterchecklist').text('Show Pending (' + (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))) + ')');
                                $('#data_msg_body' + v.msg_id).find('.filterchecklist.active').text('Show All (' + thismsgTotalcl + ')');
                                $('#data_msg_body' + v.msg_id).find('.filterchecklist').attr('data-length', thismsgTotalcl);
                                $('#data_msg_body' + v.msg_id).find('.filterchecklist').attr('data-in', (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))));
                                $('#data_msg_body' + v.msg_id).find('.filterpending').text('All Pending (' + (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))) + ')');
                                $('#filterCompletedall_' + v.msg_id).text('Completed (' + $('#clcounterperMsg' + v.msg_id).attr('data-com') + ')');
                                $('#msg-container .msg-separetor-unread').nextAll('.user_msg').find('.filterpending').addClass('unread');
                            }
                        });
                    }
                });
            }
            allChecklistData = res.data;
            if (viewchecklisttype == 'view') {
                // showIncompleteChecklist()
                if (showing == 'showinc') {
                    $('#msg-container').html('');
                    if (unchecklistMsglist.length == 0) {
                        $('#msg-container').attr('data-checklist', false);
                    }

                    $.each(unchecklistMsglist, function(k, v) {
                        if (checkdrawmsg(v, adminListUUID, activeConvPrivacy)) {
                            draw_msg(v);
                        }
                    });
                    $("#onscrollloading").hide();
                }

                if (showing == 'showcom') {
                    $('#msg-container').html('');
                    if (checklistMsglist.length == 0) {
                        $('#msg-container').attr('data-checklist', false);
                    }

                    $.each(checklistMsglist, function(k, v) {
                        if (checkdrawmsg(v, adminListUUID, activeConvPrivacy)) {
                            draw_msg(v);
                        }
                    });
                    $('#msg-container').attr('data-checklist', false);

                    // if($("#msg-container").is(':empty')){
                    // 	$('#msg-container').html('<h2 class="empty_msg" data-filter="checklist">No message(s) were found in this channel !</h2>');
                    // }else{
                    // 	console.log("Not Empty");
                    // }
                    $("#onscrollloading").hide();
                }
                permsgchecklistCounter(res.data, res.checklist);
            } else {

                $('#completeChecklist').attr('data-item', allchecklistMsg);
                $('#incompleteChecklist').attr('data-item', unchecklistmsg);
                $('#completeChecklist').attr('data-itemS', '(' + allchecklistMsg + ')');
                $('#incompleteChecklist').attr('data-itemS', '(' + unchecklistmsg + ')');

                if (unchecklistmsg > 0) {
                    // $('#checkListCounter').html('Checklist <span>'+completeChecklistMsg+'/'+allchecklistMsg+'</span>');
                    // $('#checkListCounter').attr('data-val',unchecklistmsg);
                    // $('#checkListCounter').parent('.headFiles').show();
                } else {
                    if (completeChecklistMsg > 0) {
                        // $('#checkListCounter').html('Checklist <span>'+allchecklistMsg+'/'+allchecklistMsg+'</span>');
                        // $('#checkListCounter').attr('data-val','0');
                        // $('#checkListCounter').parent('.headFiles').show();
                    } else {

                        // $('#checkListCounter').parent('.headFiles').hide();
                        $('#checkListCounter').removeClass('active');
                        $('#checklistActiondiv').removeClass('active');
                        $('#groupChatContainer').removeClass('checklistActive');
                    }

                }
            }
            viewchecklisttype = 'count';
        }
    });
}

function permsgchecklistCounter(data, checklist) {
    var unchecklist = 0;
    var completechecklist = 0;
    var allchecklist = 0;
    var allchecklistMsg = 0;
    var unchecklistmsg = 0;
    var completeChecklistMsg = 0;
    $.each(data, function(k, v) {
        if (alldeletemsgid.indexOf(v.msg_id) == -1) {
            // if($('.msg_id_'+v.msg_id).length > 0 ){

            $('#clcounterperMsg' + v.msg_id).attr('data-com', '0')
            $('#clcounterperMsg' + v.msg_id).attr('data-length', '0')
            if (v.msg_type == "checklist") {

                var checkedlength = $('.msg_id_' + v.msg_id).find('.checkBox.checked').length;
                if (checkedlength == 0) {
                    unchecklistmsg = unchecklistmsg + 1;
                } else {
                    if (checkedlength == $('.msg_id_' + v.msg_id).find('.checkBox').length) {
                        completeChecklistMsg = completeChecklistMsg + 1;
                    } else {
                        unchecklistmsg = unchecklistmsg + 1;
                    }
                }
                allchecklistMsg = allchecklistMsg + 1;
            }

            var checklistall = []
            $.each(checklist, function(ck, cv) {
                if (cv.msg_id == v.msg_id) {
                    $('#clcounterperMsg' + v.msg_id).attr('data-length', (parseInt($('#clcounterperMsg' + v.msg_id).attr('data-length')) + 1));
                    var thismsgtotalcomcl = parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'));
                    var thismsgTotalcl = parseInt($('#clcounterperMsg' + v.msg_id).attr('data-length'));

                    checklistall.push(cv);
                    data[k]['checklist'] = checklistall;
                    if (cv.checklist_status == 0) {
                        unchecklist = unchecklist + 1;
                        $('#clcounterperMsg' + v.msg_id).html('(' + parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com')) + '/' + thismsgTotalcl + ')');
                    } else {
                        completechecklist = completechecklist + 1
                        $('#clcounterperMsg' + v.msg_id).attr('data-com', (thismsgtotalcomcl + 1));
                        $('#clcounterperMsg' + v.msg_id).html('(' + parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com')) + '/' + thismsgTotalcl + ')');
                    }
                    allchecklist = allchecklist + 1;
                    $('#data_msg_body' + v.msg_id).find('.filterchecklist').text('Show Pending (' + (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))) + ')');
                    $('#data_msg_body' + v.msg_id).find('.filterchecklist.active').text('Show All (' + thismsgTotalcl + ')');
                    $('#data_msg_body' + v.msg_id).find('.filterchecklist').attr('data-length', thismsgTotalcl);
                    $('#data_msg_body' + v.msg_id).find('.filterchecklist').attr('data-in', (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))));
                    $('#data_msg_body' + v.msg_id).find('.filterpending').text('All Pending (' + (thismsgTotalcl - parseInt($('#clcounterperMsg' + v.msg_id).attr('data-com'))) + ')');
                    $('#filterCompletedall_' + v.msg_id).text('Completed (' + $('#clcounterperMsg' + v.msg_id).attr('data-com') + ')');
                    $('#msg-container .msg-separetor-unread').nextAll('.user_msg').find('.filterpending').addClass('unread');
                }
            });
            // }
        }
    });
}


function filterOnChecklist(elm) {
    var ftype = $(elm).attr('filter-type');
    var mid = $(elm).attr('msg-id');
    if (!$('#msgid_' + mid).find('.showAllChecklist').hasClass('active')) {
        $('#msgid_' + mid).find('.showAllChecklist').trigger('click');
    }

    if (ftype == 'disply_list_createdby') {
        if ($('#msgid_' + mid).find('.filterShowall.show_activity').hasClass('active')) {
            $('#msgid_' + mid).find('.filterShowall.show_activity').removeClass('active');
            $('#msgid_' + mid).find('.completed_by.created_by_div').removeClass('active');
            $('#msgid_' + mid).find('.completed_by.last_updated_by_div').removeClass('active');
            $('#msgid_' + mid).find('.completed_by.last_edited_by_div').removeClass('active');
        }
        disply_list_createdby(elm, mid);
    } else if (ftype == 'show_activity') {
        // if($('#msgid_'+mid).find('.filterShowall.disply_list_createdby').hasClass('active')){
        //   $('#msgid_'+mid).find('.filterShowall.disply_list_createdby').removeClass('active');
        // 	$('#msgid_'+mid).find('.completed_by.created_by_div').removeClass('active');
        // }
        // disply_show_activity(elm,mid);

        if ($(elm).hasClass('active')) {
            $(elm).removeClass('active');
            $('#msgid_' + mid).find('.activity_list_all').hide();
        } else {
            $(elm).addClass('active');
            $('#msgid_' + mid).find('.activity_list_all').show();
        }
    }
}


function disply_list_createdby(elm, mid) {
    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
        $(elm).text('Show Audit Trail');
        $('#msgid_' + mid).find('.completed_by.created_by_div').removeClass('active');
    } else {
        $(elm).addClass('active');
        $(elm).text('Hide Audit Trail');
        $('#msgid_' + mid).find('.completed_by.created_by_div').addClass('active');
    }
}


function disply_show_activity(elm, mid) {
    var allchecklist = $('#msgid_' + mid).find('.checkListItem');
    $('#msgid_' + mid).find('.completed_by.created_by_div').removeClass('active');
    $('#msgid_' + mid).find('.completed_by.last_updated_by_div').removeClass('active');
    $('#msgid_' + mid).find('.completed_by.last_edited_by_div').removeClass('active');
    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
        $(elm).text('Show Audit Trail');
    } else {
        $(elm).addClass('active');
        $(elm).text('Hide Audit Trail');
        $.each(allchecklist, function(k, v) {
            if ($(v).find('.completed_by.last_updated_by_div').length != 0) {
                $(v).find('.completed_by.last_updated_by_div').addClass('active');
            } else {
                $(v).find('.completed_by.created_by_div').addClass('active');
            }
            if ($(v).find('.completed_by.last_edited_by_div').length != 0) {
                $(v).find('.completed_by.last_edited_by_div').addClass('active');
            }
        })
    }
}

function getFileSize(url, classN) {
    var fileSize = '';
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false); // false = Synchronous
    http.send(null); // it will stop here until this http request is complete
    if (http.status === 200) {
        fileSize = http.getResponseHeader('content-length');
        bytesToSize(fileSize, classN);
    }
    // return fileSize;
}

function bytesToSize(bytes, classN) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    $('.' + classN).text(Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]);
}

function viewShreImgPop(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var value = $(elm).attr('data-value')
    $('#shareLinkPop').css('display', 'flex');
    $('#shareLink').val(value);
    $('#shareLink').focus().select();
}

function copyShareLink(elm) {
    $('#shareLink').select();
    document.execCommand("copy");
    closeModal('shareLinkPop');
}

function closeModal(id) {
    $('#' + id).hide();
    $('.' + id).hide();
}


function onlydrawMsg(convid) {
    var allmsgTagid = [];
    // $('#secretUserList').html('');
    // $("#onscrollloading").show();
    $('#msg-container').attr('has-msg', true);
    $('#msg-container').html('');
    if ($('#checkListCounter').hasClass('active')) {
        $('#checkListCounter').removeClass('active');
    }

    socket.emit('getlasthundredmsg', { conversation_id: convid }, function(res) {
        if (res.status) {
            var allmsg = [];

            $.each(res.msg, function(k, v) {
                if (v.msg_type == 'checklist') {
                    var msg = v;
                    var newcheclist = [];
                    $.each(res.checklist, function(ka, va) {
                        if (va.msg_id == v.msg_id) {
                            newcheclist.push(va);
                        }
                    });
                    msg['checklist'] = newcheclist;
                    allmsg.push(msg);
                } else {
                    allmsg.push(v);
                }
                if (v.tag_list != null) {
                    if (v.tag_list.length > 0) {
                        $.each(v.tag_list, function(kt, vt) {
                            if (allmsgTagid.indexOf(vt) == -1) {
                                allmsgTagid.push(vt);
                            }
                        });
                    }
                }
            });
            $.each(allmsg, function(k, v) {
                draw_msg(v, true);
            })

            scrollToBottom('#msg-container');

            // $("#onscrollloading").hide();

            if (res.msg.length == 0) {
                $('#msg-container').attr('has-msg', false);
            }
            viewchecklisttype = 'count';
            countAndGetchecklist();
        }
        // inviewfun();
        // $('#msg').focus();
        // if($('#roomIdDiv').attr('data-privecy') == 'protected'){
        // 	if(allmsgTagid != null){
        // 		if(allmsgTagid.length > 0){

        // 			socket.emit('getconvissuetag',{allmsgTagid:allmsgTagid},function(issuedata){
        // 				if(issuedata.data.length > 0){
        // 					$.each(issuedata.data,function(k,v){
        // 						$('.issuetagid'+v.tag_id).html(issueTagDesign2(v));
        // 						allconvissuetag.push(v);
        // 					});
        // 				}
        // 			});
        // 		}else{
        // 			$('.requestHolder').show();
        // 		}
        // 	}
        // }
    });
}


function viewChecklistMsg() {
    if (!$('#checkListCounter').hasClass('active') && $('#checklistActiondiv').is(':visible') && $('#selectMessage').hasClass('selected')) {
        $('#selectMessage').trigger('click');
    } else {

        if ($('#checkListCounter').hasClass('active')) {
            // $('#checkListCounter').removeClass('active');
            // $('#msg-container').html('');
            // viewchecklisttype = 'count';
            // $('#incompleteChecklist').removeClass('active');
            // $('#completeChecklist').removeClass('active');
            // onlydrawMsg(conversation_id);
            $('#more_options_chat').hide();
            // $('#call_filter_result').hide();
            // $('.chat_foot_container').attr('data-filter',false);
            location.reload();
        } else {
            $('#msg-container').attr('data-filter', 'true');
            $('#checkListCounter').addClass('active');
            $('#incompleteChecklist').addClass('active');
            // showIncompleteChecklist()
            viewchecklisttype = 'view';
            countAndGetchecklist('showinc');
            $('#more_options_chat').hide();
            $('#call_filter_result p').text('Showing Checklist messages(s) from this channel.');
            $('#call_filter_result').css('display', 'flex');
            // $('.chat_foot_container').attr('data-filter',true);
        }
    }
}

function threadChatOnly(elm) {
    var type = $('#more_options_chat').attr('conv-type');
    // var id = $('#user_head_id').attr('room-id');
    var name = $('.conv_title.converstaion_name').text();
    var img = $('#roomImage').attr('data-img');
    var seartTxt = 1;
    var id = user_id;
    var conversationid = conversation_id;
    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
        // socket.emit('getConvOnlyMsg',{conversation_id:conversation_id},function(res){
        // 	if(res.status){
        // 		$('#msg-container').html('');
        // 		$(elm).removeClass('active');
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
    } else {
        $(elm).addClass('active');
        $('#msg-container').attr('data-filter', 'true');
        $('#call_filter_result p').text('Showing thread messages(s) from this channel.');
        $('#call_filter_result').css('display', 'flex');

        socket.emit('get_conversation_history_thread', { type, id, conversationid, name, img, user_id, seartTxt }, (respons) => {
            // console.log(4964,respons);
            if (respons.msg == "success") {
                $('#msg-container').html('');
                start_conv_success(respons, conversation_id);

                if ($("#msg-container").is(':empty')) {
                    $('#msg-container').html('<h2 class="empty_msg" data-filter="msg">No message(s) were found in this channel !</h2>');
                } else {
                    console.log("Not Empty");
                }
            } else {
                console.log("failed to load filter data");
            }
        });
    }
    $('#more_options_chat').hide();
}

var selectedMediaImgTempArray = [],
    selectedMediaVidTempArray = [],
    selectedMediaAudTempArray = [],
    selectedMediaFileTempArray = [],
    selectedMediaTagTempArray = [];

var _src_filter = false;

function showFilesGallery() {
    $('#filesGallery').show();
    var loader = '<div class="loading_connect gallery_loader"> <img src="/images/assets/loading_data.gif" alt="loading_data.gif"></div>';
    $('.files_container').html(loader);

    selectedMediaImgTempArray = [];
    selectedMediaVidTempArray = [];
    selectedMediaAudTempArray = [];
    selectedMediaFileTempArray = [];
    selectedMediaTagTempArray = [];

    socket.emit('find_all_files', { conversation_id: $('#user_head_id').attr('room-id') }, function(res) {
        if (res.status == true) {
            var allMediaMsgId = [];
            var allMediaImg = [];
            var allMediaAudio = [];
            var allMediaVideo = [];
            var allMediaOthers = [];
            var allMediaLink = [];
            var allTagMsg = [];
            var allcomtagid = [];
            var alltagfiles = [];
            $.each(res.files, function(k, v) {
                if (v.file_type !== null) {

                    if (v.file_type.indexOf('image/') > -1)
                        allMediaImg.push(v);
                    else if (v.file_type.indexOf('audio/') > -1)
                        allMediaAudio.push(v);
                    else if (v.file_type.indexOf('video') > -1)
                        allMediaVideo.push(v);
                    else
                        allMediaOthers.push(v);
                }
                if (v.tag_list != null) {
                    $.each(v.tag_list, function(ka, va) {
                        if (allcomtagid.indexOf(va) == -1) {
                            allcomtagid.push(va);
                        }
                    });
                    if (alltagfiles.indexOf(v) == -1) {
                        alltagfiles.push(v);
                    }
                }
            });
            $.each(res.msg_links, function(k, v) {
                    if (!has_permission(user_id, 1600)) {
                        if (v.has_delete == null) {
                            v.has_delete = [];
                        }
                        if (v.has_delete.indexOf(user_id) == -1) {
                            if (validURL(v.url)) {
                                allMediaLink.push(v);
                            }
                        }
                    }
                })
                // $('#mediaTagDivHead a').text('By Tag(s) ('+allcomtagid.length+')');
            $("#g_Image_container").html("");

            if (allMediaImg.length === 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No image(s) were found in this channel !</h2>'
                $("#g_Image_container").append(notFoundMsg);
                $("#g_Image_container").css('style', '');
                $("#g_Image_container .notFoundMsg").show();
            }

            var lastid_f_i;
            var countImg = 0;
            $.each(allMediaImg, function(k, v) {
                var imgname = file_server + v.location;
                var sender = findObjForUser(v.user_id);

                var msg_date = moment(v.created_at).calendar(null, {
                    sameDay: '[Today]',
                    lastDay: '[Yesterday]',
                    lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                    sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                });

                $.each($('.date_by_images h3'), function(dk, dv) {
                    if ($(dv).text() == msg_date) {
                        msg_date = null;
                        return 0;
                    }
                });

                if (msg_date !== null) {
                    lastid_f_i = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "img";
                    var dataofimg = '<div class="date_by_images" id="' + lastid_f_i + '"><h3>' + msg_date + '</h3></div>';
                    $("#g_Image_container").append(dataofimg);
                }
                var html;
                var chk = $('#gallery_search').attr('filter-type');
                if (chk == 'Images' && chk != undefined) {
                    html = getImgMediaHtml(v, $('#gallery_search').val());
                } else {
                    html = getImgMediaHtml(v);
                }
                $("#g_Image_container #" + lastid_f_i).append(html);
                countImg = countImg + 1;
                // $('#mediaImgsTab a').text('Images ('+countImg+')');
                // console.log(6873, $('#g_Image_container .date_by_images').children(':visible').length)

            });

            $('#g_video_container').html("");

            if (allMediaVideo.length === 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No video file(s) were found in this channel !</h2>'
                $("#g_video_container").append(notFoundMsg);
                $("#g_video_container .notFoundMsg").show();
            }
            var lastid_f_V;
            var countvideo = 0;
            $.each(allMediaVideo, function(k, v) {
                var name = file_server + v.location;
                var sender = findObjForUser(v.user_id);
                var vidName = file_server + v.location;
                var vidType = name.split('.');
                var actType = vidType[vidType.length - 1];
                var videoname = vidName[0] + '.' + actType;
                var v1 = vidName[0].split('/');
                var v2 = v1[v1.length - 1];
                var classN4 = v2 + Date.now();
                classN4 = classN4.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

                var msg_date = moment(v.created_at).calendar(null, {
                    sameDay: '[Today]',
                    lastDay: '[Yesterday]',
                    lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                    sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                });

                $.each($('.date_by_videos h3'), function(dk, dv) {
                    if ($(dv).text() == msg_date) {
                        msg_date = null;
                        return 0;
                    }
                });

                if (msg_date !== null) {
                    lastid_f_V = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "vdo";
                    var dataofvdo = '<div class="date_by_videos" id="' + lastid_f_V + '"><h3>' + msg_date + '</h3></div>';
                    $("#g_video_container").append(dataofvdo);
                }

                var html;
                var chk = $('#gallery_search').attr('filter-type');
                if (chk == 'Videos' && chk != undefined) {
                    html = getVideoMediaHtml(v, $('#gallery_search').val());
                } else {
                    html = getVideoMediaHtml(v);
                }

                $('#g_video_container #' + lastid_f_V).append(html);
                countvideo = countvideo + 1;
                $('#mediaViedeosTab a').text('Videos (' + countvideo + ')');
            });

            //for audios
            $('#g_audio_container').html("");
            // var allAudios = $('.msgs-form-users .ado_attach');
            if (allMediaAudio.length === 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No audio file(s) were found in this channel !</h2>'
                $("#g_audio_container").append(notFoundMsg);
                // $("#mediaAudios").addClass('flex_class');
                // $("#g_audio_container").css();
                $("#g_audio_container .notFoundMsg").show();
            }
            var countAudio = 0;
            var lastid_f_A;
            $.each(allMediaAudio, function(k, v) {
                var name = file_server + v.location;
                var sender = findObjForUser(v.user_id);
                var audName = name.split('@');
                var audType = name.split('.');
                var actType = audType[audType.length - 1];
                var audioname = audName[0] + '.' + actType;
                var a1 = audName[0].split('/');
                var a2 = a1[a1.length - 1];
                var classN5 = a2 + Date.now();
                classN5 = classN5.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

                var msg_date = moment(v.created_at).calendar(null, {
                    sameDay: '[Today]',
                    lastDay: '[Yesterday]',
                    lastWeek: function(now) {
                        return '[' + this.format("MMM Do, YYYY") + ']';
                    },
                    sameElse: function(now) {
                        return '[' + this.format("MMM Do, YYYY") + ']';
                    }
                });

                $.each($('.date_by_audios h3'), function(dk, dv) {
                    if ($(dv).text() == msg_date) {
                        msg_date = null;
                        return 0;
                    }
                });

                if (msg_date !== null) {
                    lastid_f_A = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "ado";
                    var dataofado = '<div class="date_by_audios" id="' + lastid_f_A + '"><h3>' + msg_date + '</h3></div>';
                    $("#g_audio_container").prepend(dataofado);
                }
                var html;
                var chk = $('#gallery_search').attr('filter-type');
                if (chk == 'Audios' && chk != undefined) {
                    html = getAudioMediaHtml(v, $('#gallery_search').val());
                } else {
                    html = getAudioMediaHtml(v);
                }
                // var eachaudio =  getAudioMediaHtml(v);;
                $('#g_audio_container #' + lastid_f_A).append(html);
                // countAudio = countAudio + 1;
                // $('#mediaAudiosTab a').text('Audios ('+countAudio+')');
            });

            ////end audios
            $('#g_file_container').html("");
            // var allfiles = $('.msgs-form-users .fil_attach');

            if (allMediaOthers.length === 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No file(s) were found in this channel !</h2>'
                $("#g_file_container").append(notFoundMsg);
                // $("#g_file_container").addClass('flex_class');
                $("#g_file_container .notFoundMsg").show();
            }

            var lastid_f_f;
            var countFiles = 0;
            $.each(allMediaOthers, function(k, v) {
                var sender = findObjForUser(v.user_id);
                var name = file_server + v.location;
                var namespl = name.split('/');
                var filename = namespl[namespl.length - 1];
                var f_nameSpl = filename.split('@');
                var f_nameOrg = f_nameSpl[0];
                var f_typeSpl = f_nameSpl[f_nameSpl.length - 1].split('.');
                var f_type = f_typeSpl[f_typeSpl.length - 1];

                var classN6 = f_nameOrg + Date.now();
                classN6 = classN6.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

                var msg_date = moment(v.created_at).calendar(null, {
                    sameDay: '[Today]',
                    lastDay: '[Yesterday]',
                    lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                    sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                });

                $.each($('.date_by_files h3'), function(dk, dv) {
                    if ($(dv).text() == msg_date) {
                        msg_date = null;
                        return 0;
                    }
                });

                if (msg_date !== null) {
                    lastid_f_f = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "file";
                    var dataofFile = '<div class="date_by_files" id="' + lastid_f_f + '"><h3>' + msg_date + '</h3></div>';
                    $("#g_file_container").append(dataofFile);
                }

                var html;
                var chk = $('#gallery_search').attr('filter-type');
                if (chk == 'Files' && chk != undefined) {
                    html = getFilesMediaHtml(v, $('#gallery_search').val());
                } else {
                    html = getFilesMediaHtml(v);
                }
                // var eachFiles = getFilesMediaHtml(v);

                // countFiles = countFiles + 1;
                $('#g_file_container #' + lastid_f_f).append(html);
                // $('#mediaFilesTab a').text('Files ('+countFiles+')');
            });

            $('#g_link_container').html("");
            // var alllink = $('.msgs-form-users .has_url');
            // var countLinks = 0;
            var lastid_f_l;
            if (allMediaLink.length === 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No link(s) were found in this channel !</h2>'
                $("#g_link_container").append(notFoundMsg);
                // $("#g_link_container").addClass('flex_class');
                $("#g_link_container .notFoundMsg").show();
            }

            $.each(allMediaLink, function(k, v) {

                // console.log(k,v);
                var senderName = v.sender_name;
                var unixt = v.created_at;

                var msg_date = moment(unixt).calendar(null, {
                    sameDay: '[Today]',
                    lastDay: '[Yesterday]',
                    lastWeek: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                    sameElse: function(now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                });

                $.each($('.date_by_links h3'), function(dk, dv) {
                    if ($(dv).text() == msg_date) {
                        msg_date = null;
                        return 0;
                    }
                });

                if (msg_date !== null) {
                    lastid_f_l = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "link";
                    var dataofLink = '<div class="date_by_links" id="' + lastid_f_l + '"><h3>' + msg_date + '</h3></div>';
                    $("#g_link_container").append(dataofLink);
                }

                // countLinks = countLinks + 1;


                var html;
                var chk = $('#gallery_search').attr('filter-type');
                if (chk == 'Links' && chk != undefined) {
                    html = getLinksHtml(v, $('#gallery_search').val());
                } else {
                    html = getLinksHtml(v);
                }
                // var html = getLinksHtml(v);

                $('#g_link_container #' + lastid_f_l).append(html);
                // 	$('#mediaLinksTab a').text('Links ('+countLinks+')');
            });



            getAllUserCustomTitle();


            //for tags
            $('#g_tag_container').html("");
            // var allTags = $('.msgs-form-users .attach_tag');

            var allmessageTagTitles = [];

            if (allcomtagid.length == 0) {
                var notFoundMsg = '<h2 class="notFoundMsg">No tag(s) were found in this channel !</h2>';
                $("#g_tag_container").append(notFoundMsg);
                $("#g_tag_container .notFoundMsg").show();
            } else {
                $("#g_tag_container").append('<div id="visibleTagMedia"></div>');
            }

            var allTitleandTagFiles = {};
            $.each(allUserTagList, function(k, v) {
                if (allcomtagid.indexOf(v.tag_id) > -1) {
                    if (allmessageTagTitles.indexOf(v.title) == -1) {
                        allmessageTagTitles.push(v.title);
                        allTitleandTagFiles[v.title] = [];
                        $.each(alltagfiles, function(ka, va) {
                            if (va.tag_list != null) {
                                if (va.tag_list.indexOf(v.tag_id) > -1) {
                                    allTitleandTagFiles[v.title].push(va);
                                }
                            }
                        })
                    }
                }
            });

            allmessageTagTitles.sort();
            var myalltagAttach = allTagMsg;
            $('#visibleTagMedia').html('');
            $('#hiddenTagMedia').html('');
            $('#visibleTagList').show();
            $('#hiddenTagList').hide();
            $.each(allmessageTagTitles, function(k, v) {
                $('#visibleTagMedia').append('<span class="active" onclick="filterTagMedia(this,$(this).attr(\'data-type\'),\'' + v + '\')" data-type="remove"> ' + v + '</span>');
                var dataofLink = '<div class="date_by_tags" id="tagCustomid' + v + '"><h3>Tag Name :<span style="background-color: var(--RBC);border-radius: 14px;padding: 0px 8px;color: #ffffff;margin-left:8px;">' + v + '</span></h3></div>';
                $("#g_tag_container").append(dataofLink);
            });
            $.each(allTitleandTagFiles, function(ka, va) {
                if (va.length > 0) {
                    $.each(va, function(k, v) {
                        if (v.file_type.indexOf('image/') > -1) {
                            $("#tagCustomid" + ka).append(getImgMediaHtml(v));
                        } else if (v.file_type.indexOf('audio/') > -1) {
                            $("#tagCustomid" + ka).append(getAudioMediaHtml(v));
                        } else if (v.file_type.indexOf('video') > -1) {
                            $("#tagCustomid" + ka).append(getVideoMediaHtml(v));
                        } else {
                            $("#tagCustomid" + ka).append(getFilesMediaHtml(v));

                        }
                    });
                }
            });

            //$('#mediaTags').css('height','calc(100vh - '+($('#tagListFormediaView').height()+200)+'px)');
            ///end tags
            // mediaFileSearch();
            // changeAllCustomTitle();

            // getAllUserCustomTitle();
            if (_src_filter) {
                visible_chk();
            }
        }
    });

}

function visible_chk() {
    var chk = $('#gallery_search').attr('filter-type');
    var i = 0;
    if (chk == 'Images') {
        $.each($('#g_Image_container .date_by_images'), function(k, v) {
            if ($(v).find('.g_images:visible').length == 0) {
                $(v).hide();
            }

            if ($(v).is(':visible')) {
                i = i + 1;
            }
        });
        if (i == 0) {
            if (!$('#g_Image_container .notFoundMsg').is(':visible')) {
                $('#g_Image_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No image(s) were found in this channel !</h2>');
            }
        }
    } else if (chk == 'Videos') {
        $.each($('#g_video_container .date_by_videos'), function(k, v) {
            if ($(v).find('.g_video:visible').length == 0) {
                $(v).hide();
            }

            if ($(v).is(':visible')) {
                i = i + 1;
            }
        });
        if (i == 0) {
            if (!$('#g_video_container .notFoundMsg').is(':visible')) {
                $('#g_video_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No video(s) were found in this channel !</h2>');
            }
        }
    } else if (chk == 'Audios') {
        $.each($('#g_audio_container .date_by_audios'), function(k, v) {
            if ($(v).find('.g_audio:visible').length == 0) {
                $(v).hide();
            }

            if ($(v).is(':visible')) {
                i = i + 1;
            }
        });
        if (i == 0) {
            if (!$('#g_audio_container .notFoundMsg').is(':visible')) {
                $('#g_audio_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No audio(s) were found in this channel !</h2>');
            }
        }
    } else if (chk == 'Files') {
        $.each($('#g_file_container .date_by_files'), function(k, v) {
            if ($(v).find('.g_file:visible').length == 0) {
                $(v).hide();
            }

            if ($(v).is(':visible')) {
                i = i + 1;
            }
        });

        if (i == 0) {
            if (!$('#g_file_container .notFoundMsg').is(':visible')) {
                $('#g_file_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No file(s) were found in this channel !</h2>');
            }
        }
    } else if (chk == 'Links') {
        $.each($('#g_link_container .date_by_links'), function(k, v) {
            if ($(v).find('.g_link:visible').length == 0) {
                $(v).hide();
            }

            if ($(v).is(':visible')) {
                i = i + 1;
            }
        });
        if (i == 0) {
            if (!$('#g_link_container .notFoundMsg').is(':visible')) {
                $('#g_link_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No link(s) were found in this channel !</h2>');
            }
        }
    }
}

function getImgMediaHtml(v, src = null) {

    var sender = findObjForUser(v.user_id);
    var imgname = file_server + v.location;
    var name = v.location.split('/')[v.location.split('/').length - 1];
    var html = '';
    if (_src_filter) {
        if (src != null && v.originalname.includes(src)) {
            html += '<div class="g_images g_images_' + v.id + '" data-src="' + imgname + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '">';
        } else {
            html += '<div class="g_images g_images_' + v.id + '" style="display: none" data-src="' + imgname + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '">';
        }
    } else {
        html += '<div class="g_images g_images_' + v.id + '" data-src="' + imgname + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '">';
    }
    html += '	<div class="fileInfrm">';
    html += '		<p class="name_span file_title_' + v.id + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '">' + v.originalname + '</p><br>';
    html += '		<p class="file_size">(' + bytesToSize2(v.file_size) + ')</p><br>';
    html += '		<p class="file_auth">Uploaded by ' + sender.fullname + ' on ' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</p>';
    html += '	</div>';
    html += '	<img src="' + imgname + '" alt="' + v.originalname + '" style="pointer-events: none;" class="view_image_holder">';
    html += '	<div class="per_img_hover_opt">';
    html += '		<p class="img_action">';
    html += '			<a target="_blank" href="' + imgname + '" style="width: unset !important;">';
    html += '				<img src="/images/basicAssets/mobile/view.svg" alt="">';
    html += '			</a>';
    html += '		</p>';
    html += '		<p class="img_action" onclick="downloadAnyFile(event, this)" data-href="' + imgname + '">';
    html += '			<a download="' + v.originalname + '" target="_blank" href="/alpha2/download/' + name + '" style="width: unset !important;">		';
    html += '				<img src="/images/basicAssets/mobile/download.svg" alt="">	';
    html += '			</a>';
    html += '		</p>';
    html += '		<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + imgname + '">';
    html += '			<img src="/images/basicAssets/mobile/share.svg" alt="">';
    html += '		</p>';
    html += '		<p class="img_action shareimg" onclick="editCustomTitle(event, \'file\',\'' + v.id + '\',\'' + v.originalname + '\')" data-value="' + imgname + '">';
    html += '			<img src="/images/basicAssets/editmsg_fff.svg" alt="">';
    html += '		</p>';
    html += '		<p class="img_action fileInfo" onclick="fileInfoView(event, this)" data-value="">';
    html += '			<img src="/images/basicAssets/mobile/info.svg" alt="">';
    html += '		</p>';
    if (sender.fullname == user_fullname) {
        html += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="img" msg-id="' + v.msg_id + '" data-value="' + imgname + '"></p>';
    }
    html += '	</div>';
    html += '</div>';

    return html;
}

function getVideoMediaHtml(v, src = null) {

    var sender = findObjForUser(v.user_id);
    var name = file_server + v.location;
    var vidName = file_server + v.location;
    var vidType = name.split('.');
    var actType = vidType[vidType.length - 1];
    var videoname = vidName[0] + '.' + actType;
    var v1 = vidName[0].split('/');
    var v2 = v1[v1.length - 1];

    switch (actType) {
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'wmv':
        case 'm4v':
        case 'mpg':
            actType = actType;
            break;
        default:
            actType = 'other';
    }
    var eachVideo = '';
    if (_src_filter) {
        if (src != null && v.originalname.includes(src)) {
            eachVideo = '<div class="g_video" view-type="grid" file-type="' + actType + '" data-src="' + file_server + v.location + '" onclick="triggerAviFile(event, this)">';
        } else {
            eachVideo = '<div class="g_video" style="display: none" view-type="grid" file-type="' + actType + '" data-src="' + file_server + v.location + '" onclick="triggerAviFile(event, this)">';
        }
    } else {
        eachVideo = '<div class="g_video" view-type="grid" file-type="' + actType + '" data-src="' + file_server + v.location + '" onclick="triggerAviFile(event, this)">';
    }

    if (actType == 'avi' || actType == 'wmv') {
        eachVideo += '<div class="fileInfrm">';
        eachVideo += '	<p class="name_span file_title_' + v.id + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '">' + v.originalname + '</p><br>';
        eachVideo += '	<p class="file_size">(' + bytesToSize2(v.file_size) + ')</p><br>';
        eachVideo += '	<p class="file_auth">Uploaded by ' + sender.fullname + ' on ' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</p>';
        eachVideo += '</div>';
        eachVideo += '<img src="/images/basicAssets/' + actType + '.svg" alt="' + v.originalname + '" style="pointer-events: none;">';
        eachVideo += '<div class="per_img_hover_opt">';
        eachVideo += '<p class="img_action preview" data-size="' + bytesToSize2(v.file_size) + '" onclick="downloadFilePopup(event, this,\'frmGlry\')" data-href="' + file_server + v.location + '" file-name="' + v.originalname + '">';
        eachVideo += '<img src="/images/basicAssets/mobile/view.svg" alt=""/></p>';
        eachVideo += '<a download="' + v.originalname + '" class="download_link" target="_blank" style="display:none" href="' + file_server + v.location + '">';
        eachVideo += '</a>';
        eachVideo += '</p>';
        eachVideo += '<p class="img_action">';
        eachVideo += '<a download="' + v.originalname + '" onclick="show_noti(event)" target="_blank" href="/alpha2/download/' + v.key + '" style="width: unset !important;">';
        eachVideo += '<img src="/images/basicAssets/mobile/download.svg" alt="" >';
        eachVideo += '</a>';
        eachVideo += '</p>';
        eachVideo += '<p class="img_action" onclick="viewShreImgPop(event,this)" data-value="' + name + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
        eachVideo += '<p class="img_action fileInfo" onclick="fileInfoView(event, this)" data-value="">';
        eachVideo += '	<img src="/images/basicAssets/mobile/info.svg" alt="">';
        eachVideo += '</p>';
        if (sender.fullname == user_fullname) {
            eachVideo += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="video" msg-id="' + v.msg_id + '" data-value="' + name + '"></p>';
        }
        eachVideo += '</div>';
    } else {
        eachVideo += '<div class="fileInfrm">';
        eachVideo += '	<p class="name_span file_title_' + v.id + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '">' + v.originalname + '</p><br>';
        eachVideo += '	<p class="file_size">(' + bytesToSize2(v.file_size) + ')</p><br>';
        eachVideo += '	<p class="file_auth">Uploaded by ' + sender.fullname + ' on ' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</p>';
        eachVideo += '</div>';
        eachVideo += '<video controls>';
        eachVideo += '<source class="vdo_attach" src="' + file_server + v.location + '" type="' + v.file_type + '" data-file_name="' + v.originalname + '">';
        eachVideo += '</video>';
        eachVideo += '<div class="per_img_hover_opt">';
        eachVideo += '<p class="img_action">';
        eachVideo += '<a download="' + v.originalname + '" onclick="show_noti(event)" target="_blank" href="/alpha2/download/' + v.key + '" style="width: unset !important;">';
        eachVideo += '<img src="/images/basicAssets/mobile/download.svg" alt="" >';
        eachVideo += '</a>';
        eachVideo += '</p>';
        eachVideo += '<p class="img_action" onclick="viewShreImgPop(event,this)" data-value="' + name + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
        eachVideo += '<p class="img_action fileInfo" onclick="fileInfoView(event, this)" data-value="">';
        eachVideo += '	<img src="/images/basicAssets/mobile/info.svg" alt="">';
        eachVideo += '</p>';
        if (sender.fullname == user_fullname) {
            eachVideo += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="video" msg-id="' + v.msg_id + '" data-value="' + name + '"></p>';
        }
        eachVideo += '</div>';
    }
    eachVideo += '</div>';

    return eachVideo;
}

function getAudioMediaHtml(v, src = null) {
    var sender = findObjForUser(v.user_id);
    var name = file_server + v.location;
    var audName = name.split('@');
    var audType = name.split('.');
    var actType = audType[audType.length - 1];
    var audioname = audName[0] + '.' + actType;
    var a1 = audName[0].split('/');
    var a2 = a1[a1.length - 1];
    var classN5 = a2 + Date.now();
    classN5 = classN5.replace(/[\s&\/\\@#,+()$~%.'":*?<>{}]/g, '');

    var eachaudio = '';
    if (_src_filter) {
        if (src != null && v.originalname.includes(src)) {
            eachaudio = '<div class="g_audio" onclick="playmusic(event,this,\'' + v.id + '\')" data-src="' + file_server + v.location + '">';
        } else {
            eachaudio = '<div class="g_audio" style="display: none" onclick="playmusic(event,this,\'' + v.id + '\')" data-src="' + file_server + v.location + '">';
        }
    } else {
        eachaudio = '<div class="g_audio" onclick="playmusic(event,this,\'' + v.id + '\')" data-src="' + file_server + v.location + '">';
    }
    eachaudio += '<div class="fileInfrm">';
    eachaudio += '	<p class="name_span file_title_' + v.id + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '">' + v.originalname + '</p><br>';
    eachaudio += '	<p class="file_size">(' + bytesToSize2(v.file_size) + ')</p><br>';
    eachaudio += '	<p class="file_auth">Uploaded by ' + sender.fullname + ' on ' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</p>';
    eachaudio += '</div>';
    eachaudio += '<audio controls id="audio_' + v.id + '">';
    eachaudio += '<source class="ado_attach" src="' + file_server + v.location + '" type="' + v.file_type + '" data-file_name="' + v.originalname + '">';
    eachaudio += '</audio>';
    eachaudio += '<div class="per_img_hover_opt">';
    eachaudio += '<p class="img_action">';
    eachaudio += '<a download="' + v.originalname + '" onclick="downloadAnyFile(event, this); //show_noti(event)" data-href="' + file_server + v.location + '" target="_blank" href="/alpha2/download/' + v.key + '" style="width: unset !important;">';
    eachaudio += '<img src="/images/basicAssets/mobile/download.svg" alt="" >';
    eachaudio += '</a>';
    eachaudio += '</p>';
    eachaudio += '<p class="img_action" onclick="viewShreImgPop(event,this)" data-value="' + file_server + v.location + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
    eachaudio += '<p class="img_action fileInfo" onclick="fileInfoView(event, this)" data-value="">';
    eachaudio += '	<img src="/images/basicAssets/mobile/info.svg" alt="">';
    eachaudio += '</p>';
    if (sender.fullname == user_fullname) {
        eachaudio += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="audio" msg-id="' + v.msg_id + '" data-value="' + file_server + v.location + '"></p>';
    }
    eachaudio += '</div>';
    eachaudio += '</div>';

    return eachaudio;
}

function fileInfoView(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(elm).parents('.per_img_hover_opt').siblings('.fileInfrm').toggleClass('active');
}

function getFilesMediaHtml(v, src = null) {
    var sender = findObjForUser(v.user_id);
    var name = file_server + v.location;
    var namespl = name.split('/');
    var filename = namespl[namespl.length - 1];
    var f_nameSpl = filename.split('@');
    var f_nameOrg = f_nameSpl[0];
    var f_typeSpl = f_nameSpl[f_nameSpl.length - 1].split('.');
    var f_type = f_typeSpl[f_typeSpl.length - 1];
    switch (f_type) {
        case 'ai':
        case 'apk':
        case 'mp3':
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'wmv':
        case 'm4v':
        case 'mpg':
        case 'doc':
        case 'docx':
        case 'exe':
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
            f_type = f_type;
            break;
        default:
            f_type = 'other';
    }
    var eachFiles = '';
    if (_src_filter) {
        if (src != null && v.originalname.includes(src)) {
            eachFiles += '<div class="g_file" data-msg="" data-src="' + file_server + v.location + '" data-filename="' + file_server + v.location + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '" onclick="' + (f_type == 'pdf' ? 'triggerView(event,this)' : 'openImage(event,this)') + '">';
        } else {
            eachFiles += '<div class="g_file" style="display: none" data-msg="" data-src="' + file_server + v.location + '" data-filename="' + file_server + v.location + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '" onclick="' + (f_type == 'pdf' ? 'triggerView(event,this)' : 'openImage(event,this)') + '">';
        }
    } else {
        eachFiles += '<div class="g_file" data-msg="" data-src="' + file_server + v.location + '" data-filename="' + file_server + v.location + '" data-sender_name="' + sender.fullname + '" data-sender_img="' + sender.img + '" onclick="' + (f_type == 'pdf' ? 'triggerView(event,this)' : 'openImage(event,this)') + '">';
    }
    eachFiles += '<div class="fileInfrm">';
    eachFiles += '	<p class="name_span file_title_' + v.id + '" data-original="' + v.originalname + '" data-customName="' + v.originalname + '">' + v.originalname + '</p><br>';
    eachFiles += '	<p class="file_size">(' + bytesToSize2(v.file_size) + ')</p><br>';
    eachFiles += '	<p class="file_auth">Uploaded by ' + sender.fullname + ' on ' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</p>';
    eachFiles += '</div>';
    // if(f_type == 'pdf'){
    // 	eachFiles += 	'<a download="'+ v.originalname +'" style="height: 100%;display: block;" target="_blank" href="' + file_server + v.location + '">';
    // 	eachFiles += 		'<img class="fileIcon" src="/images/basicAssets/' + f_type + '.svg" alt="' + file_server + v.location + '" style="pointer-events: none;width: 186px;">';
    // 	eachFiles += 	'</a>';
    // }else{
    eachFiles += '<img class="fileIcon" src="/images/basicAssets/' + f_type + '.svg" alt="' + file_server + v.location + '" style="pointer-events: none;">';
    // }
    eachFiles += '<div class="per_img_hover_opt">';
    if (f_type == 'pdf') {
        eachFiles += '<p class="img_action view_ico" file-type="' + f_type + '">';
        eachFiles += '<a download="' + v.originalname + '" target="_blank" href="' + file_server + v.location + '">';
        eachFiles += '<img src="/images/basicAssets/mobile/view.svg" alt=""/></p>';
        eachFiles += '</a>';
        eachFiles += '</p>';
        eachFiles += '<p class="img_action" file-name="' + v.originalname + '" data-href="' + file_server + v.location + '">';
        eachFiles += '<a download="' + v.originalname + '" onclick="show_noti(event)" target="_blank" href="/alpha2/download/' + v.location.split('/')[v.location.split('/').length - 1] + '">';
        eachFiles += '<img src="/images/basicAssets/mobile/download.svg" alt="" >';
        eachFiles += '</a>';
        eachFiles += '</p>';
    } else {
        eachFiles += '<p class="img_action preview" data-size="' + bytesToSize2(v.file_size) + '" onclick="downloadFilePopup(event, this,\'frmGlry\')" data-href="' + file_server + v.location + '" file-name="' + v.originalname + '">';
        eachFiles += '<img src="/images/basicAssets/mobile/view.svg" alt=""/></p>';
        eachFiles += '<a download="' + v.originalname + '" class="download_link" target="_blank" style="display:none" href="' + file_server + v.location + '">';
        eachFiles += '</a>';
        eachFiles += '</p>';
        eachFiles += '<p class="img_action" onClick="preventFunc(event,this)" file-name="' + v.originalname + '" data-href="' + file_server + v.location + '">';
        eachFiles += '<a download="' + v.originalname + '" target="_blank" href="' + file_server + v.location + '">';
        eachFiles += '<img src="/images/basicAssets/mobile/download.svg" alt="" >';
        eachFiles += '</a>';
        eachFiles += '</p>';
    }
    eachFiles += '<p class="img_action" onclick="viewShreImgPop(event,this)" data-value="' + name + '"><img src="/images/basicAssets/mobile/share.svg" alt=""/></p>';
    eachFiles += '<p class="img_action fileInfo" onclick="fileInfoView(event, this)" data-value="">';
    eachFiles += '	<img src="/images/basicAssets/mobile/info.svg" alt="">';
    eachFiles += '</p>';
    if (sender.fullname == user_fullname) {
        eachFiles += '<p class="img_action deleteitem delete_ico" onclick="deleteItem(event,this)" data-type="other" msg-id="' + v.msg_id + '" data-value="' + name + '"></p>';
    }
    eachFiles += '</div>';
    eachFiles += '</div>';

    return eachFiles;
}

function getLinksHtml(v, src = null) {
    var link = '';
    if (_src_filter) {
        if (src != null && v.originalname.includes(src)) {
            link = '<div class="g_link" id="g_link' + v.url_id + '" data-customname="default" style="cursor:pointer">';
        } else {
            link = '<div class="g_link" style="display: none" id="g_link' + v.url_id + '" data-customname="default" style="cursor:pointer">';
        }
    } else {
        link = '<div class="g_link" id="g_link' + v.url_id + '" data-customname="default" style="cursor:pointer">';
    }
    link += '<div class="link-details" onclick=window.open("' + v.url + '")>';
    // link+= 		'<h4 style="height:20px;overflow:hidden;">'+v.title+'</h4>';
    link += '<p class="name_span url_title_' + v.url_id + '" data-original="' + v.url + '" data-customName="' + v.url + '"></p>';
    link += '<p style="color: var(--TBC);height:22px;overflow:hidden;">' + v.url + '</p>';
    link += '<p>Shared by ' + findObjForUser(v.user_id).fullname + ' <span>' + moment(v.created_at).format('MMMM Do YYYY, h:mm a') + '</span></p>';
    link += '</div>';
    // link+= 	'<div class="linkHovitem"> <div class="shareIcon" onclick="viewShreImgPop(event,this)"></div> </div>';

    link += '	<div class="per_img_hover_opt">';
    link += '		<p class="img_action shareimg" onclick="viewShreImgPop(event,this)" data-value="' + v.url + '">';
    link += '			<img src="/images/basicAssets/mobile/share.svg" alt="">';
    link += '		</p>';
    link += '		<p class="img_action shareimg" onclick="editCustomTitle(event, \'link\',\'' + v.url_id + '\',\'\')" data-value="' + v.url + '">';
    link += '			<img src="/images/basicAssets/editmsg_fff.svg" alt="">';
    link += '		</p>';
    // link += '		<p class="img_action fileInfo" onclick="$(this).parents(\'.per_img_hover_opt\').siblings(\'.fileInfrm\').toggleClass(\'active\')" data-value="">';
    // link += '			<img src="/images/basicAssets/mobile/info.svg" alt="">';
    // link += '		</p>';
    link += '<p class="img_action deleteitem delete_ico" onclick="deleteLink(\'' + v.url_id + '\',event,this)" msg-id="' + v.msg_id + '" data-value="' + v.url + '"></p>';
    link += '	</div>';

    link += '</div>';

    return link;
}

function activeGalleryTab(ele) {
    $('.tab_list').removeClass('active');
    $(ele).addClass('active');
    if ($('#gallery_search + .closeSearch').is(':visible')) {
        // $('#gallery_search + .closeSearch').trigger('click');
    }
    var type = $(ele).attr('id');

    if (type == 'mediaImgsTab') {
        $('.files_container').hide();
        $('#g_Image_container').show();
        $('#gallery_search').attr('placeholder', 'Search images');
    } else if (type == 'mediaViedeosTab') {
        $('.files_container').hide();
        $('#g_video_container').show();
        $('#gallery_search').attr('placeholder', 'Search videos');
    } else if (type == 'mediaAudiosTab') {
        $('.files_container').hide();
        $('#g_audio_container').show();
        $('#gallery_search').attr('placeholder', 'Search audios');
    } else if (type == 'mediaFilesTab') {
        $('.files_container').hide();
        $('#g_file_container').show();
        $('#gallery_search').attr('placeholder', 'Search files');
    } else if (type == 'mediaLinksTab') {
        $('.files_container').hide();
        $('#g_link_container').show();
        $('#gallery_search').attr('placeholder', 'Search links');
    } else if (type == 'mediaTagDivHead') {
        $('.files_container').hide();
        $('#g_tag_container').show();
        $('#gallery_search').attr('placeholder', 'Search tags');
    }
}

function filterTagMedia(ele, type, value) {
    var v = value;
    if (type == 'remove') {
        $('#tagCustomid' + v + '').hide();
        $(ele).removeClass('active');
        $(ele).addClass('inactive');
        $(ele).attr('data-type', 'add');

    } else if (type == 'add') {
        $('#tagCustomid' + v + '').show();
        $(ele).removeClass('inactive');
        $(ele).addClass('active');
        $(ele).attr('data-type', 'remove');

    }

    if ($('#visibleTagMedia span').length == 0) {
        $('#visibleTagList').hide();
    } else {
        $('#visibleTagList').show();
    }

    if ($('#hiddenTagMedia span').length == 0) {
        $('#hiddenTagList').hide();
    } else {
        $('#hiddenTagList').show();
    }
}

function returnedithistoryDesign(edit_history, data, typeclass) {
    var design = '';
    var allmsg_edit = edit_history.split('@_$cUsJs');

    allmsg_edit.reverse();
    var hiddenCls = '';
    $.each(allmsg_edit, function(k, v) {
        var newData = JSON.parse(v);
        if (k == 0) {
            design += '<div class="orginal_text" id="editedMsg_id' + data.msg_id + '"><div class="' + typeclass + '" id="data_msg_body' + data.msg_id + '">' + newData.msg_body + '</div></div>';
        } else {
            design += '<div class="updatedTextOriginal ' + hiddenCls + '"><div class="msg_historyBody">' + newData.msg_body + '</div><div class="lastUpdateTime">' + moment(Number(newData.update_at)).format('MMM Do YYYY') + ' at ' + moment(data.created_at).format('h:mm a') + '</div></div>';
            if (k == 2 && allmsg_edit.length > 3) {
                if (hiddenCls == '') {
                    hiddenCls = 'hiddenCl';
                    design += '<div class="showMoreEditedmsg" onclick="showfulleditedMsg(\'' + data.msg_id + '\',this)"> + Show All</div>'
                }
            }
        }
    });
    design += '<div class="updatedTextOriginal ' + hiddenCls + '"><div class="msg_historyBody">' + data.msg_body + '</div><div class="lastUpdateTime">' + moment(data.created_at).format('MMM Do YYYY - h:mm a') + '</div></div>';

    return design;
}

var customNameStore = {};
var customNameStoreQuery = false;
var urlTitleEditId = '';
var fileTitleEditId = '';
var convTitleEditId = '';

function editCustomTitle(e, type, uniq_id, originalname) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log(type, uniq_id, originalname);
    if (type == 'file') {
        $('#editCustomTitle .popup_title').text('Set your own custom file name');
        $('#editCustomTitle').attr('data-type', 'file_title');
        $('#editCustomTitle').attr('data-original', originalname);
        fileTitleEditId = uniq_id;
        $('#editCustomTitle').css('display', 'flex');
        if ($('.file_title_' + uniq_id).attr('data-customname') == originalname) {
            $('#inputFile_title').val('').focus();
            $('#reset_title').hide();
        } else {
            $('#inputFile_title').val($('.file_title_' + uniq_id + '').attr('data-customname')).focus();
            $('#reset_title').show();
        }
        // if($('.file_title_'+uniq_id).attr('data-customname') == originalname){
        // 	$('#reset_title').hide();
        // }else{
        // 	$('#reset_title').show();
        // }
    } else if (type == 'link') {
        $('#editCustomTitle .popup_title').html('Set your own custom link title');
        $('#editCustomTitle').attr('data-type', 'link_title');
        $('#editCustomTitle').attr('data-original', originalname);
        urlTitleEditId = uniq_id;
        $('#editCustomTitle').css('display', 'flex');
        // $('#editCutomActionId').text('Link Title');
        $('#editCustomActionVal').attr('placeholder', 'Link Title')
        $('#editCustomActionVal').val($('#url_title_' + uniq_id + '').text());
        $('#editCustomActionVal').focus();

        if ($('.url_title_' + uniq_id).text() == '') {
            $('#inputFile_title').val('').focus();
            $('#reset_title').hide();
        } else {
            $('#inputFile_title').val($('.url_title_' + uniq_id + '').attr('data-customname')).focus();
            $('#reset_title').show();
        }
        // if($('#url_title_'+uniq_id+'').text() == originalname){
        // 	$('#titleResetActionBtn').hide();
        // }else{
        // 	$('#titleResetActionBtn').show();
        // }
    }
}

function editTitleResetFun(type) {
    $('#inputFile_title').val($('#editCustomTitle').attr('data-original'));
    actionCustomTitle(type);
}

function actionCustomTitle(type) {

    if (type == 'link_title') {
        var data = {
            change_id: urlTitleEditId,
            change_title: $('#editCustomActionVal').val(),
            user_id: user_id,
            type: 'link',
            original_name: $('#editCustomTitle').attr('data-original')
        }
        socket.emit('customTitle', data, function(res) {
            if (res.status) {
                customNameStore[data.change_id] = data.change_title;
                $('.url_title_' + data.change_id + '').text(data.change_title);
            }
            closeModal('editCustomTitle');

        })

    } else if (type == 'file_title') {
        if ($('#inputFile_title').val().length > 0) {
            var data = {
                change_id: fileTitleEditId,
                change_title: $('#inputFile_title').val(),
                user_id: user_id,
                type: 'file',
                original_name: $('#editCustomTitle').attr('data-original')
            }
            socket.emit('customTitle', data, function(res) {
                if (res.status) {
                    customNameStore[data.change_id] = data.change_title;
                    if ($('.file_title_' + data.change_id + '').attr('data-original') == data.change_title) {
                        $('.file_title_' + data.change_id + '').text(data.change_title);
                    } else {
                        $('.file_title_' + data.change_id + '').text(data.change_title + '(' + $('.file_title_' + data.change_id + '').attr('data-original') + ')');
                    }

                    $('.file_title_' + data.change_id).attr('data-customname', data.change_title);

                    // if($('.file_title_'+data.change_id+'').attr('data-original') == data.change_title ){
                    // 	$('.file_cus_title_'+data.change_id+'').hide();
                    // }else{
                    // 	$('.file_cus_title_'+data.change_id+'').text(data.change_title);
                    // 	$('.file_cus_title_'+data.change_id+'').parent('.cus_title').show();
                    // }
                    // $('.file_cus_title_'+data.change_id+'').attr('data-custom',data.change_title);

                }
                closeModal('editCustomTitle');
            })
        }
    } else {
        console.log('Under construction');
    }
}


function getAllUserCustomTitle() {
    var data = {
        user_id: user_id,
        type: 'get'
    }
    socket.emit('customTitle', data, function(res) {
        customNameStoreQuery = true;
        if (res.status) {
            $.each(res.result, function(k, v) {
                customNameStore[v.change_id] = v.change_title;
            });
            changeAllCustomTitle();
        }
    })
}

function changeAllCustomTitle() {
    if (customNameStoreQuery) {
        for (var key in customNameStore) {

            if (customNameStore.hasOwnProperty(key)) {

                $('.url_title_' + key).html(customNameStore[key]).attr('data-customname', customNameStore[key]);
                if ($('.file_title_' + key + '').attr('data-original') == customNameStore[key]) {
                    $('.file_title_' + key).html(customNameStore[key]);
                } else {
                    $('.file_title_' + key).html(customNameStore[key] + '(' + $('.file_title_' + key + '').attr('data-original') + ')');
                }
                $('.file_title_' + key).attr('data-customname', customNameStore[key]);

                //   	if($('.file_cus_title_'+key+'').first().attr('data-original') == customNameStore[key] ){
                //   		$('.file_cus_title_'+key).parent('.cus_title').hide();
                //   	}else{
                // 	$('.file_cus_title_'+key).html(customNameStore[key]);
                // 	$('.file_cus_title_'+key).parent('.cus_title').show();
                //   	}
                // $('.file_cus_title_'+key).attr('data-custom',customNameStore[key]);


                $('.conv_nickname_' + key).html(customNameStore[key]);
                $('#update_title_' + key).html(customNameStore[key]);
                $('.user_name' + key).html(customNameStore[key]);
            }
        }
    } else {
        getAllUserCustomTitle();
    }
}

function deleteLink(id, e, ele) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var data = {
            url_id: id,
            conversation_id: conversation_id,
            user_id: user_id
        }
        // console.log(11, data);
    socket.emit('hidethisurl', data, function(callback) {
        if (callback.status) {
            // console.log(22, data);
            if ($('#g_link' + id).closest('.date_by_links').children().length == 2) {
                $('#g_link' + id).closest('.date_by_links').remove();
            } else {
                $('#g_link' + id).remove();
            }
            if ($('#g_link_container .g_link').length == 0) {
                $('#g_link_container').append('<h2 class="notFoundMsg" style="display: block;">No link(s) were found in this channel !</h2>')
            }
        }
    });
}

function showfulleditedMsg(msg_id, elm) {
    $(elm).remove();
    $('#msgid_' + msg_id).find('.updatedTextOriginal ').removeClass('hiddenCl');
    $('.rep_msg_' + msg_id).find('.updatedTextOriginal ').removeClass('hiddenCl');
}

function removeRoomImg(elm, type) {
    if (type == 'create') {
        $("#view_room_img").attr('src', '' + file_server + 'room-images-uploads/Photos/feelix.jpg');
        $('.viewRoomImg').trigger('click');
    }
}

$(window).on('load', function() {
    $('.chat_container').show();
    $('.connect_section').show();
    $('.loading_connect').hide();
    if ($("#msg-container").is(":visible")) {
        scrollToBottom('#msg-container');
        // showEditSingleMsg();
    }
    // set_fileTag();
});

function open_change_password() {
    $('.head_container .down_arrow').trigger('click');
    $('#changePwdPopup').css('display', 'flex');
}

function close_change_password() {
    $('#changePwdPopup').hide();
}

function onoffteamroom(event) {
    var teamid = $(event.target).attr("value");
    // console.log(teamid);
    if (event.target.checked) {
        // console.log(teamid, 'checked');
        // $(event.target).attr("data-check", "checked");
        var shtl = getCookie("sh_team_lists").split("@");
        if (shtl.length > 0) {
            if (shtl.indexOf(teamid) > -1) {
                setCookie("sh_team_lists", getCookie("sh_team_lists").replace(teamid + "@", ""));
            }
        }
        $.each($("#chat_conversations .conv_area"), function(k, v) {
            if ($(v).attr("data-team") == teamid) $(v).show();
        });
    } else {
        // console.log(teamid, 'unchecked');
        // $(event.target).attr("data-check", "unchecked");
        var shtl = getCookie("sh_team_lists").split("@");
        if (shtl.length > 0) {
            if (shtl.indexOf(teamid) == -1) {
                setCookie("sh_team_lists", getCookie("sh_team_lists") + teamid + "@");
            }
        } else {
            setCookie("sh_team_lists", teamid + "@");
        }
        $.each($("#chat_conversations .conv_area"), function(k, v) {
            if ($(v).attr("data-team") == teamid) $(v).hide();
        });
    }
    $(".convid" + user_id).show();
}

function show_all_rooms() {
    $("#chat_conversations").hide();
    $("#call_conversations").hide();
    $("#conversations_notify").hide();
    $(".connect_tab_container .b_label").removeClass('active');
    $("#all_channels").html('').show();
    $('.foot_right').css('pointer-events', 'none');
    $('.connect_section').removeClass('thread_notify_visible');
    $('#all_channels').prepend('<div class="loading_connect callLoader"> <img src="/images/assets/loading_data.gif"></div>');
    default_data();
    var keySpace = 'Navigate';
    socket.emit('public_conversation_history', { keySpace }, (respons) => {
        $("#all_channels").html('');
        var private = [],
            public = [],
            close = [];
        var i = 0;
        $.each(respons.rooms, function(k, v) {
            if (v.title != null) {
                if (v.title.indexOf(',') === -1) {
                    if (v.status != 'close') {
                        i = i + 1;
                        if (v.privacy == 'private') {
                            // console.log(8528, v.participants);
                            if (v.participants != null && v.participants.indexOf(user_id) > -1) {
                                if (v.participants_admin.indexOf(user_id) > -1) {
                                    if (v.participants_admin.length != 1) {
                                        private.push(v);
                                    } else {
                                        private.push(v);
                                    }
                                } else {
                                    private.push(v);
                                }
                            }
                        } else if (v.privacy == 'public') {
                            if (v.participants.indexOf(user_id) > -1) {
                                if (v.participants_admin.indexOf(user_id) > -1) {
                                    if (v.participants_admin.length != 1) {
                                        public.push(v);
                                    } else {
                                        public.push(v);
                                    }
                                } else {
                                    public.push(v);
                                }
                            } else {
                                public.push(v);
                            }
                        }
                    } else {
                        if (v.participants.indexOf(user_id) != -1) {
                            close.push(v);
                        }
                    }
                }
            }
        });
        $.each(private, function(k, v) {
            draw_list(v);
        });
        $.each(public, function(k, v) {
            draw_list(v);
        });
        $.each(close, function(k, v) {
            draw_list(v);
        });
        $('.foot_right').css('pointer-events', 'auto');

        if ($("#all_channels").is(':empty')) {
            $("#all_channels").append('<h2 class="channels_notFound">No channels were found !</h2>');
        }
    });
}

function draw_list(data) {
    // console.log(111, data)
    if (data.participants_admin == null) return false;
    if (data.participants.indexOf(user_id) > -1 || data.participants_admin.indexOf(user_id) > -1) {
        var btntxt = "Go";
    } else {
        var btntxt = "Join";
    }

    var html = "";
    if (data.single == 'yes')
        var dirname = 'profile-pic';
    else {
        var dirname = 'room-images-uploads';
        data.single = "group"
    }

    html += '<div data-conv-type="' + data.single + '"';
    html += ' room-status="' + data.status + '"';
    html += ' user-id="' + user_id + '"';
    html += ' data-conv-id="' + data.conversation_id + '"';
    html += ' data-name="' + data.title + '"';
    html += ' data-img="' + data.conv_img + '"';
    html += ' data-team="' + data.group_keyspace + '"';
    html += ' data-privacy="' + data.privacy + '"';
    html += ' data-unreadThread="false"';
    html += ' has_flagged="false"';
    html += ' class="conv_area"';
    if (btntxt == 'Join') {
        html += ' onclick="joinRoom(this, \'' + user_id + '\', \'' + data.privacy + '\', \'' + data.group_keyspace + '\', \'' + data.conversation_id + '\', \'' + user_id + '\', \'' + data.title + '\')">';
    } else {
        html += ' onclick="triggerconv(\'' + data.conversation_id + '\')">';
    }
    html += '<div class="right_">';
    html += '<div class="conv_img">';
    html += '<img src="' + file_server + dirname + '/Photos/' + data.conv_img + '">';
    html += '<div class="status offline conv_' + data.conversation_id + '"></div>';
    html += '<div class="privacy_status"></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mid_">';
    html += '<div class="conv_name">';
    // html +=				'<div class="privacy_status"></div>';
    html += '<div class="title">' + data.title + '</div>';
    $.each(data.participants, function(k, v) {
        html += '<span class="conv_participant _participants_id' + v + '">' + findObjForUser(v).fullname + '</span>';
    });

    // $.each(user_list,function(k,v){
    //        $('._participants_id'+v.id).text(v.fullname);
    // 	html += 			'<span class="conv_participant _participants_id'+v+'">'+findObjForUser(v).fullname+'</span>';
    //    })

    html += '</div>';
    html += '<div class="last_msg">' + data.participants.length + ' Members</div>';
    html += '</div>';
    html += '<div class="left_">';
    html += '<div class="last_msg_date"></div>';
    html += '<div class="more_noti">';
    html += '<div class="unread_msg btntxt_' + btntxt + '">' + btntxt + '</div>';
    html += '<div class="pin"></div>';
    html += '<div class="mute_noti"></div>';
    html += '<div class="room_status">[Closed]</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $("#all_channels").append(html);
}


var joinRoom = (ele, createdbyid, grpprivacy, selectecosystem, roomId, user_id, title) => {
    var conversation_type = 'group',
        users_img = $(ele).attr('data-img');

    $.ajax({
        type: 'POST',
        data: {
            conversation_id: roomId,
            targetID: user_id,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/groupMemberAdd',
        success: function(data) {
            if (data == 'success') {

                $(ele).attr('onclick', 'triggerconv(\'' + roomId + '\')');
                $('#trigger_room').attr('onclick', 'triggerconv(\'' + roomId + '\')');
                $(ele).find('.btntxt_Join').addClass('btntxt_Go').removeClass('btntxt_Join');
                $('#joinRoomPopup .delete_msg_sec_title').text('You are now a member of "#' + title + '" room. Would you like to visit this Room now?');
                $('#joinRoomPopup').css('display', 'flex');

                var currentDate = new Date();
                var msg_body = user_fullname + ' joined #' + title;
                if (grpprivacy == 'public') {
                    var data = {
                        type: 'join_public_room',
                        sender: user_id,
                        sender_name: user_fullname,
                        sender_img: user_img,
                        conversation_id: roomId,
                        msg_type: 'notification',
                        msg_body: msg_body
                    }
                    sendNotificationMsg(data);
                }

                var html = '<div data-conv-type="' + conversation_type + '" ';
                html += 'room-status="active" ';
                html += 'data-convtype="pinuser" user-id="' + user_id + '" ';
                html += 'data-conv-id="' + roomId + '"';
                html += 'data-name="' + title + '" data-img="' + users_img + '" ';
                html += 'data-team="' + selectecosystem + '" data-nom="0"';
                html += 'data-privacy = "' + grpprivacy + '"';
                html += 'data-unreadThread="false" ';
                html += 'has_flagged="false" ';
                html += 'class="conv_area convid' + roomId + '" ';
                html += 'onclick="startConversation(event,this)">';
                html += '	<div class="right_">';
                html += '		<div class="conv_img">';
                html += '			<img src="' + file_server + 'room-images-uploads/Photos/' + users_img + '">';
                html += '			<div class="status offline conv_' + roomId + '"></div>';
                html += '			<div class="privacy_status"></div>';
                html += '		</div>';
                html += '	</div>';
                html += '	<div class="mid_">';
                html += '		<div class="conv_name">';
                // html  += '			<div class="privacy_status"></div>';
                html += '			<div class="title">' + title + ' </div>';
                html += '		</div>';
                html += '		<div class="last_msg">' + msg_body + '</div>';
                html += '	</div>';
                html += '	<div class="left_">';
                html += '		<div class="last_msg_date">' + moment(currentDate).format('ll') + '</div>';
                html += '		<div class="more_noti">';
                html += '			<div class="unread_msg"></div>';
                html += '			<div class="unread_thread"></div>';
                html += '			<div class="pin" onclick=""></div>';
                html += '			<div class="mute_noti"></div>';
                html += '			<div class="room_status">[Closed]</div>';
                html += '		</div>';
                html += '	</div>';
                html += '</div>';

                $('#chat_conversations').append(html);

            }
        }
    });
};

function triggerconv(id) {
    $(".convid" + id).trigger("click");
}

function cancelUnreadThread() {
    var url = window.location.href.split('/');
    // console.log(url);
    param_change('true', 'false');
}


var lastConvHtml = null;

function search_convs(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var value = $(elm).val().trim();
    var convId = $('#user_head_id').attr('room-id');
    if (value !== '') {
        if (e.keyCode == 13) {
            $(elm).addClass('src_on');
            var tagNameArray = value.split(',');
            var tagNameFind = [];

            $.each(allUserTagList, function(k, v) {
                if (tagNameArray.indexOf(v.title) > -1) {
                    tagNameFind.push(v.tag_id);
                }
            })
            e.preventDefault();
            // $("#onscrollloading").show();
            socket.emit('searchMsgBody', { conversation_id: convId, value: value, tag_data: tagNameFind }, function(res) {

                if (res.msg == 'success') {
                    $('.loading_connect.chatPage_loader').css('display', 'flex');
                    console.log(99, res.data.length);
                    var allMsg = _.orderBy(res.data, ["created_at"], ["asc"]);
                    // $('#top-date').text('');
                    $('#msg-container').attr('data-search', true);
                    $('#msg-container').html('');
                    $.each(allMsg, function(k, v) {
                        if (checkdrawmsg(v, adminArra, activeConvPrivacy)) {
                            if (v.msg_type == 'checklist') {
                                var cl = [];
                                $.each(res.checklist, function(ka, va) {
                                    if (va.msg_id == v.msg_id) {
                                        cl.push(va);
                                    }
                                });
                                v['checklist'] = cl;
                                draw_msg(v, true);
                            } else {
                                draw_msg(v, true);
                            }
                        }

                    });
                    viewchecklisttype = 'count';
                    countAndGetchecklist();

                    $(".user_msg .msg_section").each(function() {
                        if ($(this).text().toLowerCase().search($('.src_convs.active').val().toLowerCase()) > -1) {
                            $(this).parents('.user_msg').show();
                        } else {
                            $(this).parents('.user_msg').hide();
                        }
                    });
                    // if($(".user_msg .msg_section:visible").length == 0){
                    // 	$('.msg-separetor').hide();
                    // }else{
                    // 	$('.msg-separetor').show();
                    // }

                    $('.user_msg .msg_section ').unhighlight();
                    $('.user_msg .msg_section').highlight($('.src_convs').val());

                    $('.loading_connect.chatPage_loader').css('display', 'none');
                    if (res.data.length == 0) {
                        // var html = '<h2 class="empty_msg">No message(s) were found in this channel.</h2>';
                        $('#msg-container').append('<h2 class="empty_msg">No message(s) were found in this channel.</h2>');
                    }
                    data_search = true;
                }
            });
        }
    }

}
data_search = false;


function openImage(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // if ($(e.target).hasClass('msg_per_img_div')) {
    // 	$(elm).find('.per_img_hover_opt .img_action:first').trigger('click');
    // }

    if ($(elm).hasClass('g_file')) {
        console.log(14095, 'g_file')
        $(elm).find('.per_img_hover_opt .img_action.preview').trigger('click');
    }

}

function downloadFilePopup(e, elm, type) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log(type)

    var file_size = '';
    var file_name = $(elm).attr('file-name');
    var file_link = $(elm).attr('data-href');
    if (type == 'frmMsg') {
        // file_size = $(elm).parents('.per_img_hover_opt').siblings('.file-name').find('.fileSize').text();
        file_size = $(elm).attr('data-size');
    } else {
        file_size = $(elm).parents('.per_img_hover_opt').siblings('.fileInfrm').find('.file_size').text();
    }
    $('#downloadPreviewPopup').css('display', 'flex');
    $('.file_namee').text('File : ' + file_name);
    $('.file_sizee').text('size : ' + file_size);
    $('#download_link').attr('href', file_link);
}

function triggerAviFile(e, elm) {

    if ($(elm).attr('file-type') == 'mp4' && $(elm).attr('view-type') == 'list') {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(elm).find('.per_img_hover_opt .img_action.preview').trigger('click');
    } else if ($(elm).attr('file-type') != 'mp4') {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(elm).find('.per_img_hover_opt .img_action.preview').trigger('click');
    }
}


function triggerView(e, ele) {
    var type = $(ele).find('.per_img_hover_opt .img_action.view_ico').attr('file-type');
    if ($(e.target).hasClass('per_img_hover_opt')) {
        e.preventDefault();
        e.stopImmediatePropagation();
    } else {
        if (type == 'pdf') {
            window.open($(ele).attr('data-src'), '_blank');
        } else {
            $(ele).find('.per_img_hover_opt .img_action.view_ico').trigger('click');
        }
    }
}

function preventFunc(e, el) {
    // e.preventDefault();
    e.stopImmediatePropagation();
}

function media_view_change(elm, type) {
    if (!$(elm).hasClass('active')) {
        $('.media_view li').removeClass('active');
        $(elm).addClass('active');

        $('.files_container').attr('view-type', type);
    }
}

// window.addEventListener("navigate", function (event, data) {
// $(window).on("navigate", function (event, data) {
//   var direction = data.state.direction;
//     event.preventDefault();
//     event.stopImmediatePropagation();
//     console.log(direction)
//   if (direction == 'back') {
//     // do something
//     alert('Hello world! back');
//   }
//   if (direction == 'forward') {
//     // do something else
//     alert('Hello world! forward');
//   }
// });

// window.addEventListener('beforeunload', (event) => {
//   // Cancel the event as stated by the standard.
//   event.preventDefault();
//   // Chrome requires returnValue to be set.
//   event.returnValue = '';
//   alert('message?: DOMString');
// });

/**
 * Receive typing event and
 * display indicator images hide and show
 **/
socket.on('server_typing_emit', function(data) {
    if (data.sender_id != user_id) {
        if ($('#reaplyMsgPopup').is(':visible') && $('#reaplyMsgPopup').attr('data-rep_msg_id') == data.msg_id && data.reply === true) {
            draw_rep_typing_indicator(data.display, data.img, data.name);
        } else if (conversation_id == data.conversation_id && data.reply === false) {
            draw_typing_indicator(data.display, data.img, data.name);
        }

        // console.log(data);
    }
});


var draw_typing_indicator = (add_remove, img, name) => {
    if (add_remove) {
        if ($('.typing-indicator').html() == "") {
            $('.typing-indicator').html(name + '&nbsp;<span>is typing....</span>');

        }
    } else {
        $('.typing-indicator').html("");
    }
};
var draw_rep_typing_indicator = (add_remove, img, name) => {
    if (add_remove) {
        if ($('.rep-typing-indicator').html() == "") {
            $('.rep-typing-indicator').html(name + '&nbsp;<span>is typing....</span>');
        }
    } else {
        $('.rep-typing-indicator').html("");
    }
};

/**
 * timeoutFunction call after 2 second typing start
 **/
var timeoutFunction = () => {
    var rep = false;
    var msgid = false;
    if ($('#reaplyMsgPopup').is(':visible')) {
        msgid = $('#reaplyMsgPopup').attr('data-rep_msg_id');
        rep = true;
    }
    typing = false;
    socket.emit("client_typing", { display: false, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: rep, msg_id: msgid });
};

function deleteItem(event, ele) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var location = $(event.target).attr("data-value").replace(file_server, "");
    var msgid = $(event.target).attr("msg-id");
    var type = $(event.target).attr("data-type");

    console.log(1628, msgid, type, location);
    $("#deleteFilePopup").attr("data-msgid", msgid);
    $("#deleteFilePopup").attr("data-location", location);
    $("#deleteFilePopup").attr("data-type", type);
    $("#deleteFilePopup").css('display', 'flex');
}

function delete_attach() {
    var msgid = $("#deleteFilePopup").attr("data-msgid");
    var location = [$("#deleteFilePopup").attr("data-location")];
    var type = $("#deleteFilePopup").attr("data-type");
    switch (type) {
        case "img":
            var files = { "imgfile": location };
            break;
        case "video":
            var files = { "videofile": location };
            break;
        case "audio":
            var files = { "audiofile": location };
            break;
        case "other":
            var files = { "otherfile": location };
            break;
    }

    socket.emit("delete_attach", { msgid, attach_files: files, need_id: true }, (res) => {
        // console.log(1615, res);
        if (res.status) {
            $("#deleteFilePopup").hide();
            if (type == 'img') {
                $.each($(".msg_id_" + msgid).find(".attach_img .img_attach"), function(k, v) {
                    if ($(v).attr('src') == file_server + location[0]) {
                        $(this).closest(".attach_img .imgholder").addClass('deleted_class').attr("data-status", "deleted").attr('placeholder', 'Item already deleted').html('');
                    }
                });
                if ($("#filesGallery").is(':visible')) {
                    $.each($(".g_images"), function(k, v) {
                        if ($(v).attr("data-src") == file_server + location[0]) {
                            if ($(this).closest('.date_by_images').children().length == 2) {
                                $(this).closest('.date_by_images').remove();
                            } else {
                                $(this).remove();
                            }
                        }
                    });
                }
                if ($('#image_viewer').is(':visible')) {
                    if ($('.img_container').attr('data') == '1') {
                        closePopUps('#image_viewer');
                    } else {
                        closePopUps('#image_viewer');
                    }
                }
            } else if (type == 'video') {
                $.each($(".msg_id_" + msgid).find(".attach_video .fil_attach"), function(k, v) {
                    if ($(v).attr('data-src') == file_server + location[0]) {
                        $(this).closest(".fil_attach").after('<div class="imgholder" data-status="deleted" placeholder="Item already deleted"></div>');
                        $(this).closest(".fil_attach").remove();
                    }
                });
                if ($("#filesGallery").is(':visible')) {
                    $.each($(".g_video"), function(k, v) {
                        if ($(v).attr('data-src') == file_server + location[0]) {
                            if ($(this).closest('.date_by_videos').children().length == 2) {
                                $(this).closest('.date_by_videos').remove();
                            } else {
                                $(this).remove();
                            }
                        }
                    });
                }
            } else if (type == 'other' || type == 'audio') {
                $.each($(".msg_id_" + msgid).find(".fil_attach"), function(k, v) {
                    if ($(v).attr('data-src') == file_server + location[0]) {
                        $(this).closest(".fil_attach").after('<div class="imgholder" data-status="deleted"><img class="img_attach" style="" src="' + file_server + 'common/file-removed-message.png"></div>');
                        $(this).closest(".fil_attach").remove();
                    }
                });
                if ($("#filesGallery").is(':visible')) {
                    if (type == 'audio') {
                        $.each($(".g_audio"), function(k, v) {
                            if ($(v).attr('data-src') == file_server + location[0]) {
                                if ($(this).closest('.date_by_audios').children().length == 2) {
                                    $(this).closest('.date_by_audios').remove();
                                } else {
                                    $(this).remove();
                                }
                            }
                        });
                    } else {
                        $.each($(".g_file"), function(k, v) {
                            if ($(v).attr("data-src") == file_server + location[0]) {
                                if ($(this).closest('.date_by_files').children().length == 2) {
                                    $(this).closest('.date_by_files').remove();
                                } else {
                                    $(this).remove();
                                }
                            }
                        });
                    }
                }
            } else {
                window.location.reload();
            }
        }
    });
}

var convertToChecklist = false;
var convertToChecklistMsg_id = '';
var convertToChecklistmsg = '';

function convertTask(event) {
    var msg_id = $('.user_msg selected_msg').attr('data-msgid');
    convertToChecklist = true;
    convertToChecklistmsg = $('#data_msg_body' + msg_id).text();
    convertToChecklistMsg_id = msg_id;
    selectedShareMember = [];

    // var userid = user_id;
    // if(allconvdetails.length > 0){
    // 	$.each(allconvdetails, function (k, v) {
    // 		var data = {
    // 			conversation_id:v.conversation_id,
    // 			conv_img:v.conv_img,
    // 			title:v.title,
    // 			type:'group'

    // 		}
    // 		if(v.single == 'no'){
    // 			if(v.title != '' && v.title != null){
    // 				alluserandrooms.push(data);
    // 			}
    // 		}
    // 	});
    // 	$.each(user_list,function(k,v){
    // 		var data ={
    // 			conversation_id:v.id,
    // 			conv_img:v.img,
    // 			title:v.fullname,
    // 			type:'user'
    // 		}
    // 		if (!has_permission(v.id,1600)  && v.is_delete == 0){
    // 			alluserandrooms.push(data);
    // 		}
    // 	});
    // 	var newdata = _.sortBy(alluserandrooms, ["title",'asc']);
    // 	$('#shareSuggestedList').html("");
    // 	$.each(newdata,function(k,v){
    // 		if($('#suggestUsers'+v.conversation_id).length == 0){

    // 			$('#shareSuggestedList').append(userListDesign(v));
    // 		}
    // 	})
    // }else{
    // 	socket.emit('myTopicList', { userid }, (respons) => {
    // 		if (respons.staus) {
    // 			allRooms = respons.rooms;
    // 			$.each(respons.rooms, function (k, v) {
    // 				allconvdetails.push(v);
    // 				if(v.conversation_id !== conversation_id){
    // 					if(v.single == 'no'){
    // 						if(v.title != '' && v.title != null){
    // 							var data = {
    // 								conversation_id:v.conversation_id,
    // 								conv_img:v.conv_img,
    // 								title:v.title,
    // 								type:'group'
    // 							}
    // 							alluserandrooms.push(data);
    // 						}
    // 					}
    // 				}
    // 			});
    // 			$.each(user_list,function(k,v){
    // 				var data ={
    // 					conversation_id:v.id,
    // 					conv_img:v.img,
    // 					title:v.fullname,
    // 					type:'user'
    // 				}
    // 				if (!has_permission(v.id, 1600)  && v.is_delete == 0) {

    // 					alluserandrooms.push(data);
    // 				}
    // 			});
    // 			var newdata = _.sortBy(alluserandrooms, ["title",'asc']);

    // 			$.each(newdata,function(k,v){
    // 				$('#shareSuggestedList').append(userListDesign(v));
    // 			})
    // 		}
    // 	});
    // }
    // popupMouseEnter();

    selected_msgid = [];
    alluserandrooms = [];
    var eles = $('.user_msg.selected_msg');
    $.each(eles, function(k, v) {
        selected_msgid.push($(v).attr("data-msgid"));
    });

    console.log(4854, all_rooms);

    $.each(all_rooms, function(k, v) {
        var data = {
            conversation_id: v.conversation_id,
            conv_img: v.conv_img,
            title: v.title,
            type: 'group'
        }
        if (v.single == 'no') {
            if (v.title != '' && v.title != null) {
                alluserandrooms.push(data);
            }
        }
    });

    $.each(user_list, function(k, v) {
        var data = {
            conversation_id: v.id,
            conv_img: v.img,
            title: v.fullname,
            type: 'user'
        }
        if (!has_permission(v.id, 1600) && v.is_delete == 0) {
            alluserandrooms.push(data);
        }
    });
    var newdata = _.sortBy(alluserandrooms, ["title", 'asc']);

    // console.log(4702, newdata);

    $('.optMore_options').hide();
    var html = '';

    $.each(newdata, function(k, v) {
        html += '<div class="eachmember">'
        html += '<div class="member_img">';
        if (v.type == 'group') {
            html += '<img src="' + file_server + 'room-images-uploads/Photos/' + v.conv_img + '" alt="' + v.title + '">';
        } else {
            html += '<img src="' + file_server + 'profile-pic/Photos/' + v.conv_img + '" alt="' + v.title + '">';
        }
        html += '</div>';
        html += '<div class="member_info">';
        html += '<h2 class="member_title">' + v.title + '</h2>';
        html += '<span class="send_member sharebtn_' + v.conversation_id + '" data-type="' + v.type + '" data-uid="' + v.conversation_id + '" onclick="share_this_msg_with(event)">Send</span>';
        html += '</div>';
        html += '</div>';
    });
    $('#shareMsgPopup .membersList').html(html);
    $('#shareMsgPopup .popup_title').text('Convert to task');
    $('#shareMsgPopup').css('display', 'flex');
}

socket.on('get_delivered_notification', function(data) {
    $.each(data, function(k, v) {
        if ($('.msg_id_' + v.msg_id).length > 0) {
            $('.msg_id_' + v.msg_id).find('.msg-send-seen-delivered').text('- Delivered');
        }
    });
    last_delivered_always_show();
});

socket.on('receive_emit', function(data) {
    update_msg_seen_status(data);
});

socket.on('update_msg_receive_seen', function(data) {
    $.each(data.msgid, function(k, v) {
        update_msg_seen_status(v);
    });
});

socket.on('remove_pending_status', function(data) {
    setTimeout(function() {
        $('.msg_id_' + data.msg_id).find('.msg-send-seen-delivered').html(' - Delivered');
    }, 1000)
});


// console.log(8436, user_img);
var last_delivered_always_show = () => {
    var last_img = $('.msg-send-seen-delivered').last().closest('.user_msg').find('.user_img>img').attr('alt');
    if (user_img == last_img && $('.msg-send-seen-delivered').last().text() != '- Sent') {
        $('.msg-send-seen-delivered').hide();
        $('.msg-send-seen-delivered').last().text(' - Delivered');
        $('.msg-send-seen-delivered').last().show();
    }

    setTimeout(function() {
        $.each($('.msg-send-seen-delivered'), function(k, v) {
            if ($(v).text() == '- Editable' || $(v).text() == '- Readonly') {
                $(v).show();
                if ($(v).parents('.user_msg').hasClass('converted')) { $(v).hide(); }
            } else {
                $(v).hide();
            }
        });
    }, 1000)
};

var update_msg_seen_status = (msgid) => {
    if ($('.msg-send-seen-delivered').last().text() != '- Delivered')
        $('.msg_id_' + msgid).find('.msg-send-seen-delivered').text('- Delivered').delay(3000).fadeOut();
    last_delivered_always_show();
};

function update_conv_counter() {
    // console.log(x: number)
}

function gallery_search(e, el) {
    var data = $(event.target).val();

    if ($('#mediaImgsTab').hasClass('active')) {

        $("#g_Image_container .g_images .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_images').show();
                $(this).parents('.date_by_images').show();

                if ($('.date_by_images:visible').length > 0) {
                    if ($('#g_Image_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_Image_container .notFoundMsg.src_log').remove();
                    }
                }
            } else {
                $(this).parents('.g_images').hide();
                if ($(this).parents('.date_by_images').find('.g_images:visible').length == 0) {
                    $(this).parents('.date_by_images').hide();
                }

                if ($('.date_by_images:visible').length == 0) {
                    if (!$('#g_Image_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_Image_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No image(s) were found in this channel !</h2>');
                    }
                }
            }
        });
        // $('#g_Image_container .g_images .name_span').unhighlight();
        // $('#g_Image_container .g_images .name_span').highlight(data);

        // if(searchTagVal == ''){
        // 	$('#mediaTagsDatabase').hide();
        // 	if(!$('#g_Image_container .notFoundMsg').is(':visible')){
        // 		$('#g_Image_container').show();
        // 	}
        // }

    } else if ($('#mediaViedeosTab').hasClass('active')) {
        // var Searchfiles = $(event.target).val();
        // var searchTagVal = $(event.target).val();

        $("#g_video_container .g_video .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_video').show();
                $(this).parents('.date_by_videos').show();

                if ($('.date_by_videos:visible').length > 0) {
                    if ($('#g_video_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_video_container .notFoundMsg.src_log').remove();
                    }
                }
            } else {
                $(this).parents('.g_video').hide();
                if ($(this).parents('.date_by_videos').find('.g_video:visible').length == 0) {
                    $(this).parents('.date_by_videos').hide();
                }

                if ($('.date_by_videos:visible').length == 0) {
                    if (!$('#g_video_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_video_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No video(s) were found in this channel !</h2>');
                    }
                }
            }
        });
        // $('#g_video_container .g_video .name_span').unhighlight();
        // $('#g_video_container .g_video .name_span').highlight(searchTagVal);

        // if(searchTagVal == ''){
        // 	$('#mediaTagsDatabase').hide();
        // 	if(!$('#g_video_container .notFoundMsg').is(':visible')){
        // 		$('#g_video_container').show();
        // 	}
        // }
    } else if ($('#mediaAudiosTab').hasClass('active')) {
        // var searchTagVal = $(event.target).val();
        $("#g_audio_container .g_audio .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_audio').show();
                $(this).parents('.date_by_audios').show();

                if ($('.date_by_audios:visible').length > 0) {
                    if ($('#g_audio_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_audio_container .notFoundMsg.src_log').remove();
                    }
                }
            } else {
                $(this).parents('.g_audio').hide();
                if ($(this).parents('.date_by_audios').find('.g_audio:visible').length == 0) {
                    $(this).parents('.date_by_audios').hide();
                }

                if ($('.date_by_audios:visible').length == 0) {
                    if (!$('#g_audio_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_audio_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No audio(s) were found in this channel !</h2>');
                    }
                }
            }
        });
        // $('#mediaAudios .g_audio .name_span').unhighlight();
        // $('#mediaAudios .g_audio .name_span').highlight(searchTagVal);

        // if(searchTagVal == ''){
        // 	$('#mediaTagsDatabase').hide();
        // 	if(!$('#mediaAudios .notFoundMsg').is(':visible')){
        // 		$('#mediaAudios').show();
        // 	}
        // }

    } else if ($('#mediaFilesTab').hasClass('active')) {
        // var Searchfiles = $(event.target).val();
        // var searchTagVal = $(event.target).val();

        $("#g_file_container .g_file .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_file').show();
                $(this).parents('.date_by_files').show();

                if ($('.date_by_files:visible').length > 0) {
                    if ($('#g_file_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_file_container .notFoundMsg.src_log').remove();
                    }
                }
            } else {
                $(this).parents('.g_file').hide();
                if ($(this).parents('.date_by_files').find('.g_file:visible').length == 0) {
                    $(this).parents('.date_by_files').hide();
                }
                if ($('.date_by_files:visible').length == 0) {
                    if (!$('#g_file_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_file_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No file(s) were found in this channel !</h2>');
                    }
                }
            }
        });
        // $('#g_file_container .g_file .name_span').unhighlight();
        // $('#g_file_container .g_file .name_span').highlight(searchTagVal);

        // if(searchTagVal == ''){
        // 	$('#mediaTagsDatabase').hide();
        // 	if(!$('#g_file_container .notFoundMsg').is(':visible')){
        // 		$('#g_file_container').show();
        // 	}
        // }
    } else if ($('#mediaLinksTab').hasClass('active')) {
        // var searchLinkVal = $(event.target).val();
        // var searchTagVal = $(event.target).val();

        $("#g_link_container .g_link .name_span").each(function() {
            if ($(this).parent('.g_link').text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_link').show();
                $(this).parents('.date_by_links').show();

                if ($('.date_by_links:visible').length > 0) {
                    if ($('#g_link_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_link_container .notFoundMsg.src_log').remove();
                    }
                }
            } else {
                $(this).parents('.g_link').hide();
                if ($(this).parents('.date_by_links').find('.g_link:visible').length == 0) {
                    $(this).parents('.date_by_links').hide();
                }

                if ($('.date_by_links:visible').length == 0) {
                    if (!$('#g_link_container .notFoundMsg.src_log').is(':visible')) {
                        $('#g_link_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No link(s) were found in this channel !</h2>');
                    }
                }
            }
        });
        // $('#g_link_container .g_link h4').unhighlight();
        // $('#g_link_container .g_link h4').highlight(searchTagVal);

        // if(searchTagVal == ''){
        // 	$('#mediaTagsDatabase').hide();
        // 	if(!$('#g_link_container .notFoundMsg').is(':visible')){
        // 		$('#g_link_container').show();
        // 	}
        // }

    } else if ($('#mediaTagDivHead').hasClass('active')) {

        // var searchTagVal = $(event.target).val();

        $("#g_tag_container .g_audio .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_audio').show();
                $(this).parents('.date_by_tags').show();
            } else {
                $(this).parents('.g_audio').hide();
                if ($(this).parents('.date_by_tags').find('.g_audio:visible').length == 0) {
                    $(this).parents('.date_by_tags').hide();
                }
            }
        });
        // $('#g_tag_container .g_audio .name_span').unhighlight();
        // $('#g_tag_container .g_audio .name_span').highlight(searchTagVal);

        $("#g_tag_container .g_file .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_file').show();
                $(this).parents('.date_by_tags').show();
            } else {
                $(this).parents('.g_file').hide();
                if ($(this).parents('.date_by_tags').find('.g_file:visible').length == 0) {
                    $(this).parents('.date_by_tags').hide();
                }
            }
        });
        // $('#g_tag_container .g_file .name_span').unhighlight();
        // $('#g_tag_container .g_file .name_span').highlight(searchTagVal);

        $("#g_tag_container .g_video .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_video').show();
                $(this).parents('.date_by_tags').show();
            } else {
                $(this).parents('.g_video').hide();
                if ($(this).parents('.date_by_tags').find('.g_video:visible').length == 0) {
                    $(this).parents('.date_by_tags').hide();
                }
            }
        });
        // $('#g_tag_container .g_video .name_span').unhighlight();
        // $('#g_tag_container .g_video .name_span').highlight(data);

        $("#g_tag_container .g_images .name_span").each(function() {
            if ($(this).text().toLowerCase().search(data.toLowerCase()) > -1) {
                $(this).parents('.g_images').show();
                $(this).parents('.date_by_tags').show();
            } else {
                $(this).parents('.g_images').hide();
                if ($(this).parents('.date_by_tags').find('.g_images:visible').length == 0) {
                    $(this).parents('.date_by_tags').hide();
                }
            }
        });
        // $('#g_tag_container .g_images .name_span').unhighlight();
        // $('#g_tag_container .g_images .name_span').highlight(data);


        // if(searchTagVal == ''){
        // 	$('#g_tag_containerDatabase').hide();
        // 	if(!$('#g_tag_container .notFoundMsg').is(':visible')){
        // 		$('#tagListFormediaView').show();
        // 		$('#g_tag_container').show();
        // 	}
        // }

        if (!$('#g_tag_container .notFoundMsg.src_log').is(':visible')) {
            if ($('#g_tag_container .date_by_tags:visible').length > 0) {
                if ($('#g_tag_container .notFoundMsg.src_log').is(':visible')) {
                    $('#g_tag_container .notFoundMsg.src_log').remove();
                    $('#visibleTagMedia').css('display', 'flow-root');
                }
            } else if ($('#g_tag_container .date_by_tags:visible').length == 0) {
                if (!$('#g_tag_container .notFoundMsg.src_log').is(':visible')) {
                    $('#visibleTagMedia').hide();
                    $('#g_tag_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No tag(s) were found in this channel !</h2>');
                }
            }
        } else {
            if ($('#g_tag_container .date_by_tags:visible').length > 0) {
                if ($('#g_tag_container .notFoundMsg.src_log').is(':visible')) {
                    $('#g_tag_container .notFoundMsg.src_log').remove();
                    $('#visibleTagMedia').css('display', 'flow-root');
                }
            } else if ($('#g_tag_container .date_by_tags:visible').length == 0) {
                if (!$('#g_tag_container .notFoundMsg.src_log').is(':visible')) {
                    $('#visibleTagMedia').hide();
                    $('#g_tag_container').prepend('<h2 class="notFoundMsg src_log" style="display: block;">No tag(s) were found in this channel !</h2>');
                }
            }
        }

    }
}

function clr_gSearch(el, e) {
    if ($('.notFoundMsg.src_log').is(':visible')) {
        $('.notFoundMsg.src_log').remove();
    }
    if (!$('#visibleTagMedia').is(':visible')) {
        $('#visibleTagMedia').css('display', 'flow-root');
    }
    $('.date_by_images').show();
    $('.date_by_videos').show();
    $('.date_by_audios').show();
    $('.date_by_files').show();
    $('.date_by_links').show();
    $('.date_by_tags').show();

    $('.g_images').show();
    $('.g_video').show();
    $('.g_audio').show();
    $('.g_file').show();
    $('.g_link').show();
    $('#gallery_search').val('');
}

function getTagColor(tag_id) {
    var c = '#000';
    $.each(allUserTagList, function(k, v) {
        if (v.tag_id == tag_id) {
            if (v.tag_color != null) {
                c = v.tag_color;
            }
            if (v.tag_type !== 'public') {
                if (v.tagged_by == user_id) {
                    c = '#023D67';
                    if (v.shared_tag != null) {
                        c = '#023D67';
                    }
                } else {
                    if (v.shared_tag != null) {
                        c = 'blue';
                    }
                }
            } else {
                if (v.tag_color == null) {
                    c = '#000';
                }
            }
        }


    });
    return c;
}

function getShareOrnotTag(tag_id) {
    var onlyTagCls = 'notShared';
    $.each(allUserTagList, function(k, v) {
        if (tag_id == v.tag_id) {
            if (v.shared_tag != null) {
                onlyTagCls = 'shared_tag_only'
            }
        }
    });
    return onlyTagCls;
}


function permsg_tagsList(msg_id) {

    var allTagIds = $('#thisMsgTagLists' + msg_id).attr('data-id');

    var this_tag_list = [];
    if (allTagIds == null) {
        allTagIds = [];
    } else if (allTagIds == '') {
        allTagIds = [];
    } else {
        this_tag_list = allTagIds.split(',')
    }
    var useLength = 0;
    var tooltipcount = 0;
    var html = '';
    var newHtml = '';
    $.each(allUserTagList, function(k, v) {
        if (this_tag_list.indexOf(v.tag_id) > -1) {
            console.log(21600, v);
            var st = '';
            if (v.shared_tag != null) {
                st = ' shared_tag_user ';
                if (v.shared_tag !== user_id) {
                    st = st + ' others_userTag ';
                }
            }
            if (useLength < 3) {
                if (v.tag_type == 'public') {
                    newHtml += '<span class="tag_design public_tag_team tag_name_view_' + v.tag_id + '" style="' + (v.tag_color != null ? 'background-color:' + v.tag_color + '' : '') + '">' + v.title + ' </span>';
                } else {
                    newHtml += '<span class="tag_design tag_name_view_' + v.tag_id + st + '">' + v.title + ' </span>';
                }

            } else {
                tooltipcount++;
            }

            useLength++;
        }
    });
    if (useLength > 0) {
        html += '<span class="ToggleTagActionMsg counter_tag' + useLength + '" onclick="thisMsgTags(this)">(' + useLength + ')</span>'
    }
    html += newHtml;
    if (tooltipcount > 0) {
        html += '<span class="tag_design moreTooltipBtn">+' + tooltipcount + ' more</span>'
        html += '<div class="tag_toolTip for_tag" data-pos="top">'
            // html += 	'<span class="tooltip_close" onclick="tooltip_close()"></span>'
        html += '<div class="tooltip_body">'
        useLength = 0;
        $.each(allUserTagList, function(k, v) {
            if (this_tag_list.indexOf(v.tag_id) > -1) {
                if (useLength > 2) {
                    if (v.tag_type == 'public') {
                        html += '<li class="tag_name_view_' + v.tag_id + '" style="' + (v.tag_color != null ? 'color:' + v.tag_color + '' : '#000') + '">' + v.title + ' </li>';
                    } else {
                        var sc = ''
                        if (v.shared_tag != null) {
                            if (v.shared_tag !== user_id) {
                                sc = 'color:blue';
                            } else {
                                sc = 'color:green';
                            }
                        }
                        html += '<li class="tag_name_view_' + v.tag_id + '" style="' + sc + '">' + v.title + ' </li>';
                    }

                }
                useLength++;
            }
        });
        html += '</div>'
        html += '</div>'
    }

    $('#thisMsgTagLists' + msg_id).html(html);
}


var thisConvTagName = [];
var thisConvTagId = [];
var oldConvMytag = [];

// var has_other_conv = [];
function viewChatTag(elm) {

    socket.emit('getConvTagId', {
        conversation_id: conversation_id,
        company_id: company_id
    }, function(res) {
        if (res.status) {
            var taglist = res.data[0].tag_list;
            if (taglist == null) {
                taglist = [];
            }

            $('#chatTagPopup .msgTagList').html('');
            $('#chatTagPopup').show();
            $.each(allUserTagList, function(k, v) {
                var html = '';
                if (taglist.indexOf(v.tag_id) > -1) {
                    html += '<div class="eachMsgTag tag_id_' + v.tag_id + '" data-status="checked" data-val="' + v.title + '" tag-id="' + v.tag_id + '" onclick="removeConvTag(this)">';
                } else {
                    html += '<div class="eachMsgTag tag_id_' + v.tag_id + '" data-status="unchecked" data-id="' + v.tag_id + '" conv-id="' + conversation_id + '" onclick="tagOnCov(this)">';
                }
                html += '<h3 class="tagTitle" id="tag_title_' + v.tag_id + '">' + v.title + '</h3>';
                html += '<span class="checked_tag"></span>';
                html += '</div>';

                $('#chatTagPopup .msgTagList').prepend(html);
            });
        }
    });

}

function submitTagFunc() {
    if ($('#chatTagPopup').attr('data-reload') == 'true') {
        window.location.reload();
    } else {
        $('#chatTagPopup').hide();
    }
}

function removeConvTag(elm) {
    var tag_id = $(elm).attr('tag-id');
    socket.emit('removeConvTag', {
        conversation_id: conversation_id,
        user_id: user_id,
        tag_id: tag_id,
        company_id: company_id
    }, function(res) {
        if (res.status) {
            removeA(thisroomTagList, tag_id);
            $(elm).attr('data-status', 'unchecked');
            $(elm).attr('onclick', 'tagOnCov(this)');
        } else {
            console.log(res);
        }
    });
}

function tagOnCov(elm) {
    var tag_id = $(elm).attr('data-id');
    socket.emit('tagOnCov', {
        conversation_id: conversation_id,
        tag_id: tag_id,
        user_id: user_id,
        company_id: company_id
    }, function(res) {
        if (res.status) {
            thisroomTagList.push(tag_id);
            $(elm).attr('data-status', 'checked');
            $(elm).attr('onclick', 'removeConvTag(this)');
        } else {
            console.log(res);
        }
    });
}


var thisMsgAllTagid = [];
var thisMsgAllTagidNew = [];
var msg_tagUsers = null;
var all_user_string_tag = {};

function viewTagForFiles(e, elm, type) {
    e.preventDefault();
    e.stopImmediatePropagation();

    thisMsgAllTagid = [];
    thisMsgAllTagidNew = [];
    msg_tagUsers = null;
    tagremoveOld = [];

    var msg_id = '';
    msg_id = $('.user_msg.selected_msg').attr('data-msgid');

    if (all_user_string_tag[msg_id] != null && all_user_string_tag[msg_id] != 'null') {
        msg_tagUsers = all_user_string_tag[msg_id];
    }

    var allUserTag;
    thisConvTagName = [];
    thisConvTag = [];
    if (type == 'frmFile') {
        allUserTag = $(elm).attr('file-tag');
        $('#chatTagPopup').removeClass('msg_tag')
            .addClass('file_tag')
            .attr('file-id', $(elm).parents('.fil_attach').attr('file-id'));
    } else if (type == 'frmOpt') {
        $('#chatTagPopup').removeClass('file_tag').addClass('msg_tag');
        msg_id = $('.user_msg.selected_msg').attr('data-msgid');
        allUserTag = $('#msg_tag_list' + msg_id).attr('tag-list');
    }

    $('#chatTagPopup .msgTagList').css('pointer-events', 'auto');

    if (allUserTag != null) {
        allUserTag = allUserTag.split(',');
    } else {
        allUserTag = [];
    }
    $('#chatTagPopup .msgTagList').html('');
    $('#chatTagPopup').show();

    if (msg_tagUsers != null) {
        msg_tagUsers = JSON.parse(msg_tagUsers);
    }

    $.each(allUserTagList, function(k, v) {
        thisConvTagName.push(v.title);
        thisConvTag.push(v.tag_id);

        var removeAction = 'inactive';
        if (msg_tagUsers != null) {
            if (msg_tagUsers[user_id] != undefined) {
                if (msg_tagUsers[user_id].indexOf(v.tag_id) > -1) {
                    removeAction = '';
                }
            }
        }
        var st = 'shared_icon';
        var sa = '';
        if (v.shared_tag != null) {
            st = st + ' active';
            if (v.shared_tag !== user_id) {
                sa = ' others_userTag ';
            }
        }

        var html = '';
        if (allUserTag.indexOf(v.tag_id) > -1) {
            html += '<div style="border-left:4px solid ' + getTagColor(v.tag_id) + '" class="eachMsgTag ' + (v.tag_type == 'public' ? 'public_tag ' : 'private_tag') + (v.shared_tag !== null ? ' shared_tag ' : ' ') + sa + getShareOrnotTag(v.tag_id) + ' tag_id_' + v.tag_id + '" data-status="checked" data-val="' + v.title + '" tag-id="' + v.tag_id + '" msg-id="' + msg_id + '" onclick="removeOnMsgTag(this)">';
        } else {
            html += '<div style="border-left:4px solid ' + getTagColor(v.tag_id) + '" class="eachMsgTag ' + (v.tag_type == 'public' ? 'public_tag ' : 'private_tag') + (v.shared_tag !== null ? ' shared_tag ' : ' ') + sa + getShareOrnotTag(v.tag_id) + ' tag_id_' + v.tag_id + '" data-status="unchecked" data-id="' + v.tag_id + '" msg-id="' + msg_id + '" onclick="tagOneMsg(this)">';
        }
        html += '<h3 class="tagTitle" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)" id="tag_title_' + v.tag_id + '">' + v.title + '</h3>';
        html += '<div class="_tag_opt">';
        html += '	<span class="share_tag" onclick="shareThisTag(event,\'' + v.tag_id + '\')"></span>';
        html += '	<span class="edit_tag" onclick="editTagTitle(event,\'' + v.tag_id + '\')"></span>';
        html += '	<span class="delete_tag" onclick="delete_this_tag(\'' + v.tag_id + '\',event)"></span>';
        html += '	<span class="checked_tag"></span>';
        html += '</div>';
        html += '</div>';

        $('#chatTagPopup .msgTagList').append(html);
    });

    // if(allUserTag.indexOf(v.tag_id) > -1){
    // }else{

    // 	var privateDesign = '<span style="border-color:'+getTagColor(v.tag_id)+'"  class="color_defiendBtn" style="background-color:'+getTagColor(v.tag_id)+'"></span><span id="thisTagId_'+v.tag_id+'" class="this_title" data-id="'+v.tag_id+'" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)" data-balloon="Type and enter to save this tag" data-balloon-pos="up">'+v.title+'</span>'+getSharedTagUserName(v.tag_id)+'<span class="removeIcon" data-balloon="Delete" data-balloon-pos="up"></span><span class="editIcon" data-balloon="Edit" data-balloon-pos="up"></span><span class="'+st+'" data-balloon="Make visible to other(s)" data-balloon-pos="up"></span>';
    // 	if(v.tag_type == 'public'){
    // 		privateDesign = '<span class="color_defiendBtn" style="background-color:'+getTagColor(v.tag_id)+'"></span><span id="thisTagId_'+v.tag_id+'" class="this_title" data-id="'+v.tag_id+'">'+v.title+'</span>';
    // 	}
    // 	$('#AllTagList').prepend('<div style="border-color:'+getTagColor(v.tag_id)+'" onclick="tagOneMsg(this,event)" class="'+(v.tag_type == 'public' ? 'public_tag public_tag_show ':'private_tag_show ') + (v.shared_tag !== null ? ' shared_tag_user ':' ') +sa+ getShareOrnotTag(v.tag_id) +' tag tag_id_'+v.tag_id+'" data-id="'+v.tag_id+'" msg-id="'+msg_id+'">'+privateDesign+'</div>');
    // }

}

function tagOneMsg(elm) {
    var addNewTag = [];
    var removeOldTag = [];
    var msg_id = $(elm).attr('msg-id');
    var tag_id = $(elm).attr('data-id');
    var file_id = $('#chatTagPopup').attr('file-id');
    var title = $('#chatTagPopup .msgTagList').find('.tag_id_' + tag_id).text();
    var thisPublic = ($(elm).hasClass('public_tag') ? true : false);
    $('#chatTagPopup').attr('data-reload', 'true');
    if ($('#tag_title_' + tag_id).attr('contenteditable') == 'true') {
        return false;
    }
    if ($('#chatTagPopup').hasClass('file_tag')) {
        if (addNewTag.length < 1) {
            addNewTag.push(tag_id);
        }
        console.log('id:', file_id,
            'newtag:', addNewTag,
            'removetag:', removeOldTag,
            'conversation_id:', conversation_id,
            'user_id:', user_id,
            'company_id:', company_id)

        socket.emit('updateFileTagV2', { id: file_id, newtag: addNewTag, removetag: removeOldTag, conversation_id: conversation_id, user_id: user_id, company_id: company_id }, function(res) {
            if (res.status) {
                addNewTag = [];
                $(elm).attr('data-status', 'checked');
                $(elm).attr('onclick', 'removeOnMsgTag(this)');
            }
        });
    } else {
        socket.emit('tagOneMsg', {
            msg_id: msg_id,
            conversation_id: conversation_id,
            tag_id: tag_id,
            user_id: user_id
        }, function(res) {
            if (res.status) {
                $(elm).attr('data-status', 'checked');
                $(elm).attr('onclick', 'removeOnMsgTag(this)');

                var oldTagList = $('#msg_tag_list' + msg_id).attr('tag-list');
                if (oldTagList != null) {
                    oldTagList = oldTagList.split(',');
                } else {
                    oldTagList = [];
                }
                oldTagList.push(tag_id);
                $('#msg_tag_list' + msg_id).attr('tag-list', oldTagList);
                $('#msg_tag_list' + msg_id).append('<span class="single_tag tag_name_view_' + tag_id + '" data-id="' + tag_id + '">' + title + '</span>');
            }
        });
    }
}

function shareThisTag(e, tag_id) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ($('.tag_id_' + tag_id).hasClass('shared_tag')) {
        $('.tag_id_' + tag_id).removeClass('shared_tag');
        // $('.tag_id_'+tag_id).css('border-color','var(--PrimaryC)');
        // $('.tag_id_'+tag_id).removeClass('shared_tag_user');
        // $('.tag_id_'+tag_id).removeClass('shared_tag_only');
        $('.tag_id_' + tag_id).addClass('notShared');
        // changeShareTagC(tag_id,false);
        socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: null }, function(res) {
            socket.emit('updateTeamtagListperMsgBrocast', { type: 'removeShare', tag_id: tag_id });
            console.log(res);
        })
    } else {
        $('.tag_id_' + tag_id).addClass('shared_tag');
        // $('.tag_id_'+tag_id).css('border-color','var(--PrimaryC');
        // $('.tag_id_'+tag_id).addClass('shared_tag_user');
        // $('.tag_id_'+tag_id).addClass('shared_tag_only');
        $('.tag_id_' + tag_id).removeClass('notShared');
        // changeShareTagC(tag_id,true);
        socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: user_id }, function(res) {
            $.each(allUserTagList, function(k, v) {
                if (v.tag_id == tag_id) {
                    socket.emit('updateTeamtagListperMsgBrocast', { type: 'addShare', tag_id: tag_id, user_id: user_id, tag: allUserTagList[k] });
                }
            });
            console.log(res);
        })
    }
}

function removeOnMsgTag(elm) {
    var addNewTag = [];
    var removeOldTag = [];
    var tag_id = $(elm).attr('tag-id');
    var title = $(elm).attr('data-val');
    var msg_id = $(elm).attr('msg-id');
    var file_id = $('#chatTagPopup').attr('file-id');
    $('#chatTagPopup').attr('data-reload', 'true');
    if ($('#chatTagPopup').hasClass('file_tag')) {
        if (removeOldTag.length < 1) {
            removeOldTag.push(tag_id);
        }
        socket.emit('updateFileTagV2', { id: file_id, newtag: addNewTag, removetag: removeOldTag, conversation_id: conversation_id, user_id: user_id, company_id: company_id }, function(res) {
            if (res.status) {
                removeOldTag = [];
                $(elm).attr('data-status', 'unchecked');
                $(elm).attr('onclick', 'tagOneMsg(this)');
            }
        });
    } else {
        socket.emit('removeOnMsgTag', {
            msg_id: msg_id,
            conversation_id: conversation_id,
            user_id: user_id,
            tag_id: tag_id
        }, function(res) {
            if (res.status) {
                $(elm).attr('data-status', 'unchecked');
                $(elm).attr('onclick', 'tagOneMsg(this)');
                var allUserTag = $('#msg_tag_list' + msg_id).attr('tag-list');
                if (allUserTag != null) {

                    allUserTag = allUserTag.split(',');
                    var newtaglist = []
                    $.each(allUserTag, function(k, v) {
                        if (v !== tag_id) {
                            newtaglist.push(v);
                        }
                    });
                    $('#msg_tag_list' + msg_id).attr('tag-list', newtaglist);
                } else {
                    allUserTag = [];
                    $('#msg_tag_list' + msg_id).attr('tag-list', '');
                }

                $('#msg_tag_list' + msg_id).find('.tag_name_view_' + tag_id).remove();
            } else {
                console.log(res);
            }
        });
    }
}

var instant_tag = [];

function viewfileTagsPopup(elm) {
    var html = "";
    if ($(".fileTagsPopup").is(':visible')) {
        $(".fileTagsPopup").hide();
        $('#fileTagsPopup').html("");
    } else {
        if (tempAttachmentTag != null) {
            $.each(allUserTagList, function(k, v) {
                if (v.title != "" && v.visibility != null && v.visibility != 'hidden') {
                    if (tempAttachmentTag.indexOf(v.tag_id) > -1) {
                        return;
                        // html += '<div class="eachMsgTag et' + v.tag_id + '" style="display:none" data-status="checked" data-tagid="' + v.tag_id + '" onclick="selectMsgAttTag(this)">';
                    } else {
                        html += '<div class="eachMsgTag et' + v.tag_id + '" data-status="unchecked" data-tagid="' + v.tag_id + '" onclick="selectMsgAttTag(this)">';
                    }
                    html += '<h3 class="tagTitle">' + v.title + '</h3>';
                    html += '<span class="checked_tag"></span>';
                    html += '</div>';
                }
            });

            if (instant_tag.length > 0) {
                $.each(instant_tag, function(k, v) {
                    $.each(allUserTagList, function(k2, v2) {
                        if (v2.title == v) {
                            html += '<div class="eachMsgTag et' + v2.tag_id + '" data-status="checked" data-tagid="' + v2.tag_id + '" onclick="selectMsgAttTag(this)">';
                            html += '<h3 class="tagTitle">' + v2.title + '</h3>';
                            html += '<span class="checked_tag"></span>';
                            html += '</div>';
                        }
                    });
                });
            }
            $('#fileTagsPopup').html(html);
            $(".fileTagsPopup").show();
        } else {
            $.each(allUserTagList, function(k, v) {
                if (v.title != "" && v.visibility != null && v.visibility != 'hidden') {
                    html += '<div class="eachMsgTag et' + v.tag_id + '" data-status="unchecked" data-tagid="' + v.tag_id + '" onclick="selectMsgAttTag(this)">';
                    html += '<h3 class="tagTitle">' + v.title + '</h3>';
                    html += '<span class="checked_tag"></span>';
                    html += '</div>';
                }
            });
            $('#fileTagsPopup').html(html);
            $(".fileTagsPopup").show();
        }
    }
}

function selectMsgAttTag(elm) {
    if (tempAttachmentTag == null) {
        tempAttachmentTag = [];
    }
    var ttl = $(elm).find('.tagTitle').text();
    var ttid = $(elm).attr('data-tagid');
    if ($(elm).attr('data-status') == 'checked') {
        removeA(tempAttachmentTag, $(elm).attr('data-tagid'))
        removeA(instant_tag, ttl);
        $(elm).attr('data-status', 'unchecked');
        $('#search_CreateMsgTag_att').val(instant_tag);
    } else {
        tempAttachmentTag.push($(elm).attr('data-tagid'));
        instant_tag.push(ttl);
        $(elm).attr('data-status', 'checked');
        $('#search_CreateMsgTag_att').val(instant_tag);
    }
}

function create_search_atttag(event) {
    var code = event.keyCode || event.which;
    var str = $("#search_CreateMsgTag_att").val().trim().toLowerCase();
    // if(code == 13){
    // 	// str not listed in tag. so create new tag and add it
    // 	var taglist = str.split(",");
    // 	var data = {
    // 		created_by: user_id,
    // 		conversation_id: conversation_id,
    // 		tagTitle: taglist,
    // 		messgids: attachFileList,
    // 		msgIdsFtag: msgIdsFtag,
    // 		tagType: "CONNECT"
    // 	};
    // 	socket.emit('saveTag', data, (rep) => {
    // 		$("#search_CreateMsgTag_att").val("");
    // 		$(".eachMsgTag").show();
    // 		// window.location.reload();
    // 		var html = '<div class="eachMsgTag et'+ rep.tags +'" data-status="checked" data-convtag_id="'+ rep.roottags[0] +'" data-tagid="'+ rep.tags +'" onclick="selectMsgAttTag(this)">'+
    // 						'<h3 class="tagTitle">'+ taglist[0] +'</h3>'+
    // 						'<span class="checked_tag"></span>'+
    // 						'<span class="delete_tag"></span>'+
    // 					'</div>';
    // 		$('#fileTagsPopup').append(html);
    // 		str_tag_active_attch.push(taglist[0]);
    // 	});
    // }else{
    $.each($(".eachMsgTag"), function(k, v) {
        if ($(v).find(".tagTitle").text().toLowerCase().indexOf(str) > -1)
            $(v).show();
        else
            $(v).hide();
    });
    // }
}

function delete_this_tag(tagid, e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('#deleteTagPopup').attr('data-tagid', tagid);
    $('#deleteTagPopup').css('display', 'flex');
}

function deletePrivateTag(tagid) {
    var data = {
        tag_id: tagid,
        type: 'conv'
    }

    socket.emit('delteMyTagV2', { tag_id: data.tag_id, user_id: user_id, company_id: company_id }, function(res) {
        if (res.status) {
            $('#deleteTagPopup').hide();
            $('.tag_id_' + tagid).remove();
            var removeIdx = -1;
            $.each(allUserTagList, function(k, v) {
                if (data.tag_id == v.tag_id) {
                    removeIdx = k;
                }
            });
            allUserTagList.splice(removeIdx, 1);
        }
    })
}

function createNewTagFunc(el) {
    var val = $("#search_CreateMsgTag").val();
    createNewTagV2({ title: val, type: 'conv' });
    $(el).hide();
    $('.eachMsgTag').show();
    $("#search_CreateMsgTag").val('');
}

function createNewTagV2(data) {
    var newdata = {
        tagged_by: user_id,
        title: data.title,
        company_id: company_id,
        type: 'tag',
        tag_type: 'private',
        mention_users: [],
        created_at: moment().format('MM/DD/YYYY hh:mm:ss').toString()
    }
    socket.emit('createNewUserTag', newdata, function(res) {
        console.log(1470, res);
        if (res.status) {
            if (data.type == 'conv') {
                var html = ' <div class="eachMsgTag tag_id_' + res.data.tag_id + '" data-status="unchecked" data-id="' + res.data.tag_id + '" msg-id="" onclick="tagOneMsg(this)">' +
                    '<h3 class="tagTitle" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)" id="tag_title_' + res.data.tag_id + '">' + res.data.title + '</h3>' +
                    '<span class="edit_tag" onclick="editTagTitle(event,\'' + res.data.tag_id + '\')"></span>' +
                    '<span class="delete_tag" onclick="delete_this_tag(\'' + res.data.tag_id + '\',event)"></span>' +
                    '<span class="checked_tag"></span>' +
                    '</div>';

                allUserTagList.push(res.data);
                $('#chatTagPopup .msgTagList').prepend(html);
                thisConvTagName.push(data.title);
            }
        }
    });
}


var editTag_id = '';
var old_edit_tag_title = '';

function updateTagTitle(event, elm) {
    if (event.type == 'blur') {
        $(elm).text(old_edit_tag_title);
        editTag_id = '';
        old_edit_tag_title = '';
        $(elm).attr('contenteditable', false);
    } else {
        if (event.keyCode == 13) {
            var newText = $(elm).text().trim();
            if (newText != '' && old_edit_tag_title.trim() !== newText && thisConvTagName.indexOf(newText) == -1) {
                event.preventDefault();
                event.stopImmediatePropagation();
                thisConvTagName[thisConvTagName.indexOf(old_edit_tag_title)] = newText;
                old_edit_tag_title = newText;
                socket.emit('updateUserTagTitle', { update_by: user_id, title: newText, tag_id: editTag_id, tagged_by: user_id }, function(res) {
                    $.each(allUserTagList, function(k, v) {
                        if (v.tag_id == editTag_id) {
                            allUserTagList[k].title = newText;
                            $(elm).blur();
                        }
                    })

                });
            } else {
                $(elm).blur();
            }

        }
    }
}


function editTagTitle(e, tag_id) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var title = $('#tag_title_' + tag_id).text();
    $('#tag_title_' + tag_id).attr('contenteditable', true);
    var el = document.getElementById('tag_title_' + tag_id + '');
    placeCaretAtEnd(el);
    editTag_id = tag_id;
    old_edit_tag_title = title;
}


function link_open(el) {
    var _url = $(el).attr('data-title');
    // console.log(_url);
    // var win = window.open(_url, '_blank');
    //  	win.focus();

    Object.assign(document.createElement('a'), {
        target: '_blank',
        href: _url,
    }).click();
}

function copyThis_item(el) {
    var ctext = $(el).parents('.checkListItem').find('.checkBoxTitle').text();
    var $temp = $("<input>");
    $(el).parents('.checkListItem').append($temp);
    $temp.val(ctext).select();
    document.execCommand("copy");
    $temp.remove();
    // flash_msg_updated_fun($(el).attr('msg_id'), 'Copied');
    $('._task_opt_popup').hide();
}

function delete_item_div(el, e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var checklist_id = $(el).closest(".checkListItem").attr("checklist-id");
    var msg_id = $(el).closest(".checkListItem").attr("msg_id");
    $('#delete_item_div').attr('data-id', checklist_id);
    $('#delete_item_div').attr('msg-id', msg_id);
    $('#delete_item_div').css('display', 'flex');
    // closeTaskAssignModal('task_manager');
}

$('body').on('keyup', function(e) {
    if ($(e.target).attr('id') == 'requestNote') {
        var olddate = $('#TaskDatePicker').attr('old-date');
        var newdate = $('#TaskDatePicker').val();
        if ($(e.target).val() != '' && olddate != newdate) {
            $('#checklistRequestBtn .buttonAction').removeAttr('disabled');
        } else {
            $('#checklistRequestBtn .buttonAction').attr('disabled', 'disabled');
        }
    } else if ($(e.target).attr('id') == 'declineNote') {
        if ($(e.target).val() != '') {
            $('#decline_btn_sec .decline_btn_sec').removeAttr('disabled');
        } else {
            $('#decline_btn_sec .decline_btn_sec').attr('disabled', 'disabled');
        }
    }
});


function checkListTitleKeyup(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var code = e.keyCode || e.which;
    if (!$(e.target).parents('.checkListItem').hasClass('new_item')) {
        var itemOldValue = $(e.target).attr('data-title').trim();
        var itemNewValue = $(e.target).text().trim();

        if (itemOldValue != itemNewValue) {
            $(e.target).parents('.checkListItem').addClass('needUpdate');
        } else {
            $(e.target).parents('.checkListItem').removeClass('needUpdate');
        }
    }
}

function item_UpdateButton(event, Btype = null) {
    var type = $(event.target).attr('type');
    $(event.target).closest(".checkListItem").removeClass("needUpdate");
    add_chk_item($(event.target).closest(".checkListItem").find(".checkBoxTitle").attr("id"), type, Btype);
    if ($(event.target).closest(".checkListItem").hasClass('new_item')) {
        addNewCheckItemTemp();
    }
}

function add_chk_item(chk_sl, type, Btype) {
    console.log("chk_sl ", chk_sl, type);
    var str = $("#" + chk_sl).text();
    var msg_id = $("#" + chk_sl).closest(".editable_msg").attr("data-msgid");
    var checklist_id = $("#" + chk_sl).closest(".checkListItem").attr("checklist-id");
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    var str2 = str;
    str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    if (str != "") {
        var item = {
            msg_id: msg_id,
            msg_title: $("#" + chk_sl).closest(".editable_msg").attr("data-msgbody"),
            user_id: user_id,
            convid: conversation_id,
            chk_title: str,
            checklist_id: checklist_id,
            type: type
        };
        socket.emit('add_chk_item', item, function(res) {
            console.log(16070, res);
            if (res.status) {
                if (type == 'add') {
                    var url = validURL(str2);
                    $("#" + chk_sl).closest(".checkListItem").removeClass('new_item').attr('is-url', url);
                    $("#" + chk_sl).attr("data-title", str);
                    $("#" + chk_sl).attr("edited-by", "null");
                    $("#" + chk_sl).attr("edited-at", "null");
                    $("#" + chk_sl).attr("last-action", "null");
                    $("#" + chk_sl).attr("my-id", user_id);
                    $("#" + chk_sl).attr("creator_id", user_id);
                    $("#" + chk_sl).attr("created_at", moment(res.data.created_at).toISOString());
                    $("#" + chk_sl).closest(".checkListItem").attr("created_by", user_id);
                    $("#" + chk_sl).closest(".checkListItem").attr("assigned-by", 'null');
                    $("#" + chk_sl).closest(".checkListItem").attr("assign-to", 'null');
                    $("#" + chk_sl).closest(".checkListItem").attr("created_at", moment(res.data.created_at).toISOString());
                    $("#" + chk_sl).closest(".checkListItem").attr("msg_id", res.data.msg_id);
                    $("#" + chk_sl).closest(".checkListItem").attr("checklist-id", res.data.checklist_id);
                    $("#" + chk_sl).closest(".checkListItem").find(".item_UpdateButton").attr('type', 'update');
                    $("#" + chk_sl).closest(".checkListItem").addClass("perchecklist_" + res.data.checklist_id);
                    $("#" + chk_sl).closest(".checkListItem").addClass("crt_me").addClass("visible").addClass("pending_item").addClass("just_added").addClass("unassigned").addClass("my_pending");
                    $("#" + chk_sl).closest(".checkListItem").find(".item_toolbar .dueDateIcon").attr("msg-id", res.data.msg_id).attr("data-id", res.data.checklist_id).attr("data-privacy", "").attr("data-assignee", "").attr("end-date", "").attr("start-date", "");
                    $("#" + chk_sl).closest(".checkListItem").find(".item_toolbar .link_open").attr("data-title", str2);
                    $("#" + chk_sl).closest(".checkListItem").find(".activity_list_all").html('<span class="activity_created">Created  by ' + findObjForUser(res.data.created_by).fullname + ' @ ' + moment(res.data.created_at).format('MMM Do YYYY - h:mm a') + '</span>');
                    $("#" + chk_sl).closest(".checkListItem").find(".assign_info").html('<span class="createdBy_name">Created  by ' + findObjForUser(res.data.created_by).fullname + ' on ' + moment(res.data.created_at).format('MMM Do YYYY - h:mm a') + '</span>');
                    var html = '';
                    html += '	<div class="_task_option" onclick="_task_opt_popup(this)" msg_id="' + res.data.msg_id + '" checklist-id="' + res.data.checklist_id + '" data-title="">...</div>'
                    html += '	<ul class="_task_opt_popup">';
                    html += '		<li class="_task_link" onclick="window.open(\'' + str2 + '\') //link_open(\'' + str2 + '\')" data-title="' + str2 + '">Preview Link</li>';
                    html += '		<li class="_task_reply" onclick="openThreadForCheckI(event,this)" msg_id="' + res.data.msg_id + '" checklist-id="' + res.data.checklist_id + '">Reply</li>';
                    html += '		<li class="_task_copy" onclick="copyThis_item(this)">Copy</li>';
                    html += '		<li class="_task_delete" onclick="delete_item_div(this,event)">Delete</li>';
                    html += '	</ul>';
                    $("#" + chk_sl).closest(".checkListItem").find('.item_toolbar').append(html);
                    taskItemCounter(res.data.msg_id);
                    var stringBody = {
                        conversation_id: conversation_id,
                        conversation_type: conversation_type,
                        msg_id: res.data.msg_id,
                        checklist_title: $('.msg_id_' + res.data.msg_id).find('.checkListPlainText').text(),
                        checklist_id: res.data.checklist_id,
                        item_title: $(".perchecklist_" + res.data.checklist_id).find('.checkBoxTitle').text(),
                        request_by: user_id
                    }
                    var noti_data = {
                        type: 'checklist_changes',
                        title: 'addItem',
                        body: JSON.stringify(stringBody),
                        created_at: new Date(),
                        created_by: user_id,
                        seen_users: [user_id],
                        receive_users: participants
                    }
                    console.log(stringBody, noti_data)
                    insertNotiFun(noti_data);
                    if (Btype == 'assign') {
                        $("#" + chk_sl).closest(".checkListItem").find('.item_toolbar .dueDateIcon').trigger('click');
                    }
                } else if (type == 'update') {
                    console.log(18504, str);
                    $("#" + chk_sl).attr("data-title", str);
                    var dt = moment().format();
                    var v_check = $('.perchecklist_' + checklist_id).find('.end_due_date.upBy_name').is(':visible');
                    var v_check2 = $('.perchecklist_' + checklist_id).find('.end_due_date.assignee_name').is(':visible');
                    var html = ' <span class="end_due_date upBy_name" data="' + findObjForUser(user_id).fullname + '">| Updated by ' + findObjForUser(user_id).fullname + ' on ' + moment(dt).format('MMM Do YYYY - h:mm a') + '' + (v_check2 ? ' | ' : '') + '</span>'
                    $('.perchecklist_' + checklist_id).find('.end_due_date.upBy_name').remove();
                    // $('.perchecklist_'+checklist_id).find('.createdBy_name').remove();
                    $('.perchecklist_' + checklist_id).find('.assign_info').append(html);

                    var stringBody = {
                        conversation_id: conversation_id,
                        conversation_type: conversation_type,
                        msg_id: msg_id,
                        checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
                        checklist_id: checklist_id,
                        item_title: str,
                        request_by: user_id
                    }
                    var noti_data = {
                        type: 'checklist_changes',
                        title: 'updateItem',
                        body: JSON.stringify(stringBody),
                        created_at: new Date(),
                        created_by: user_id,
                        seen_users: [user_id],
                        receive_users: participants
                    }
                    insertNotiFun(noti_data);
                    // console.log(stringBody, noti_data, str)
                }
            }
            console.log("add_chk_item res ", res)
        });
    }
}

socket.on("add_chk_new_item", (res) => {
    var data = res.data;
    var result = res.result;
    console.log(17576, data, result);
    console.log(17576, conversation_id);
    if (data.convid == conversation_id) {
        if ($(".msg_id_" + data.msg_id).is(":visible")) {
            if (result.type == 'update') {
                console.log('Item updated');
                var v_check = $('.perchecklist_' + data.checklist_id).find('.end_due_date.upBy_name').is(':visible');
                var v_check2 = $('.perchecklist_' + data.checklist_id).find('.end_due_date.assignee_name').is(':visible');
                var html = ' <span class="end_due_date upBy_name" data="' + findObjForUser(data.last_updated_by).fullname + '">| Updated by ' + findObjForUser(data.last_updated_by).fullname + ' on ' + moment(data.last_updated_at).format('MMM Do YYYY - h:mm a') + '' + (v_check2 ? ' | ' : '') + '</span>';
                $('.perchecklist_' + data.checklist_id).find('.end_due_date.upBy_name').remove();
                // $('.perchecklist_'+data.checklist_id).find('.createdBy_name').remove();
                $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);

                $('.perchecklist_' + data.checklist_id).find('.checkBoxTitle').text(data.checklist_title);
                $('.perchecklist_' + data.checklist_id).find('.checkBoxTitle').attr('data-title', data.checklist_title);
            } else {
                console.log('Item Added');
                var id_length = $(".msg_id_" + res.data.msg_id).find('.checkListItem').length + 1;

                var str = res.data.checklist_title.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
                var url = validURL(str);
                var html = '<div created_by="' + res.data.created_by + '" is-url="' + url + '" assigned-by="null" assign-to="null" data-ass="" checklist_status="0" review_status="0" created_at="' + moment(res.data.created_at).toISOString() + '" msg_id="' + res.data.msg_id + '" class="my_pending unassigned checkListItem hiddenCl visible perchecklist_' + res.data.checklist_id + ' pending_item new_append" checklist-id="' + res.data.checklist_id + '" created-at="">';
                html += '	<div class="checkBox " onclick="selectCheckItem(this)"></div>';
                html += '	<div creator_id="' + res.data.created_by + '" class="checkBoxTitle" onpaste="onpasteFun(event)" created_at="' + moment(res.data.created_at).toISOString() + '" contenteditable="true" placeholder="Add a new task" onkeyup="checkListTitleKeyup(event)" onkeydown="msgCheckListTitle(event)" onblur="msgChecklistBlur(event)" data-title="' + str + '" my-id="' + user_id + '" edited-by="" edited-at="" last-action="" id="checkBoxTitle' + id_length + '">' + str + '</div>';
                html += '	<div class="item_toolbar">';
                html += '		<div last_updated_by="" msg-id="' + res.data.msg_id + '" data-id="' + res.data.checklist_id + '" class="dueDateIcon"></div>';
                html += '		<div class="item_UpdateButton" type="update" onclick="item_UpdateButton(event)"></div>';
                html += '		<div class="_task_option" onclick="_task_opt_popup(this)" msg_id="' + res.data.msg_id + '" checklist-id="' + res.data.checklist_id + '" data-title="">...</div>'
                html += '		<ul class="_task_opt_popup">';
                html += '			<li class="_task_link" onclick="window.open(\'' + str + '\') //link_open(\'' + str + '\')" data-title="' + str + '">Preview Link</li>';
                html += '			<li class="_task_reply" onclick="openThreadForCheckI(event,this)" msg_id="' + res.data.msg_id + '" checklist-id="' + res.data.checklist_id + '">Reply</li>';
                html += '			<li class="_task_copy" onclick="copyThis_item(this)">Copy</li>';
                html += '			<li class="_task_delete" onclick="delete_item_div(this,event)">Delete</li>';
                html += '		</ul>';
                html += '	</div>';
                html += '	<div class="activity_list_all"><span class="activity_created">Created  by ' + findObjForUser(res.data.created_by).fullname + ' @ ' + moment(res.data.created_at).format('MMM Do YYYY - h:mm a') + '</span></div>';
                html += '	<div class="assign_info"><span class="createdBy_name">Created  by ' + findObjForUser(res.data.created_by).fullname + ' on ' + moment(res.data.created_at).format('MMM Do YYYY - h:mm a') + '</span></div>';
                html += '</div>';

                if ($(".msg_id_" + res.data.msg_id).find(".checkListItem.new_item").length > 0) {
                    $(".msg_id_" + res.data.msg_id).find(".checkListItem.new_item").before(html);
                } else {
                    $(".msg_id_" + res.data.msg_id).find(".updatebtn").before(html);
                }
                taskItemCounter(res.data.msg_id);
            }

            // flash_msg_updated_bottom(res.data.msg_id);
        }
    }
});

function requesttlBtn(elm) {
    // need_reprint = true;
    console.log($(elm).text());
    if ($(elm).text() == 'Request') {
        var msg_id = $('#task_manager').attr('msg-id');
        var checklist_id = $('#task_manager').attr('data-id');
        var rec_id = $('#task_manager').attr('data-reciver');
        var receive_id = '';
        if (rec_id != 1 && rec_id != 2 && rec_id != undefined) {
            receive_id = rec_id;
        }
        // socket.emit('getOneChecklistData',{checklist_id:checklist_id,msg_id:msg_id},function(res){
        // 	var data = res.data;
        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            request_ttl_date: (moment().unix() * 1000),
            request_ttl_message: $('#requestNote').val(),
            request_ttl_time: (moment($('#TaskDatePicker').val(), "YYYY-MM-DD HH:mm").unix() * 1000),
            Request_ttl_by: user_id,
            assignedby: receive_id,
            type: 'request'
        }
        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: updateData.msg_id,
            checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
            checklist_id: checklistManageId,
            privacy: privacy,
            item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
            request_by: user_id
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlRequest',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: [receive_id]
        }
        insertNotiFun(noti_data);
        console.log(10443, updateData);
        socket.emit('manage_checklist', updateData, function(res) {
            $('.ttl_request' + updateData.checklist_id).remove();
            var html = '<div class="ttl_requestTime ttl_request' + updateData.checklist_id + '">| <span class="success_btn red_color" data-id="' + updateData.checklist_id + '"><span class="short_cart_btn" data-type="cancel_request" msg-id="' + updateData.msg_id + '" checklist-id="' + updateData.checklist_id + '" data-reciver="' + receive_id + '" onclick="requesttlBtn(this)">Cancel Extension request</span></span></div>';
            $('.perchecklist_' + updateData.checklist_id).find('.assign_info').append(html);
            $(elm).addClass('inactive').text('Pending');
            $('.perchecklist_' + updateData.checklist_id).removeClass('response_req').removeClass('dateOver_due');

            taskItemCounter(msg_id);
        });
        // });
    } else if ($(elm).text() == 'Approve') {
        var msg_id = $('#task_manager').attr('msg-id');
        var checklist_id = $('#task_manager').attr('data-id');
        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            request_ttl_date: null,
            request_ttl_message: $('#requestNote').val(),
            request_ttl_time: null,
            Request_ttl_by: null,
            request_repetition: checklist_request_repetition + 1,
            request_ttl_approved_by: user_id,
            request_ttl_approved_date: (moment($('#TaskDatePicker').val(), "YYYY-MM-DD HH:mm").add(6, 'hours').unix() * 1000),
            // request_ttl_approved_date:(moment($('#TaskDatePicker2').val(),"YYYY-MM-DD HH:mm").unix() * 1000),
            type: 'accept'
        }
        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: updateData.msg_id,
            checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
            checklist_id: checklistManageId,
            item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
            request_by: user_id
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlAccepted',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: [checklistManageId_Reqttl]
        }
        insertNotiFun(noti_data);
        console.log(12255, updateData)
        socket.emit('manage_checklist', updateData, function(res) {
            $(elm).addClass('inactive').text('Accepted');
            $('.perchecklist_' + checklist_id).find('.dueDateIcon').css('pointer-events', 'auto');
            $('.perchecklist_' + checklist_id).find('.item_del').show();
            $('.ttl_request' + checklist_id).remove();

            $('.perchecklist_' + updateData.checklist_id).removeClass('response_req');
            var response_req = Number($('.msg_id_' + updateData.msg_id).find('.checkListItem.response_req').length);
            $('#filterMyResReq_' + updateData.msg_id).text('My Response Required (' + response_req + ')');
            if (updateData.request_ttl_approved_date != null) {
                $('.perchecklist_' + updateData.checklist_id).find('.assign_info .end_due_date._due_date').text('Due by: ' + (updateData.request_ttl_approved_date != null ? moment.unix(Number(updateData.request_ttl_approved_date / 1000)).format('ll') : ''));
            }

            console.log(res);
        })
    } else if ($(elm).text() == 'Close' || $(elm).text() == 'Cancel') {
        $("#task_manager").removeClass("decline_open").removeClass("request_open");

    } else if ($(elm).text() == 'Reject') {
        var updateData = {
            msg_id: checklistManageId_msg,
            checklist_id: checklistManageId,
            request_ttl_date: null,
            request_ttl_message: null,
            request_ttl_time: null,
            Request_ttl_by: null,
            type: 'cancel'
        }
        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: updateData.msg_id,
            checklist_title: $('.msg_id_' + checklistManageId_msg).find('.checkListPlainText').text(),
            checklist_id: checklistManageId,
            item_title: $('.perchecklist_' + checklistManageId).find('.checkBoxTitle').text(),
            request_by: user_id,
            type: 'reject'
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlCancelled',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: [checklistManageId_Reqttl]
        }
        insertNotiFun(noti_data);
        $('.ttl_request' + checklistManageId).remove();
        socket.emit('manage_checklist', updateData, function(res) {
            flash_msg_updated_fun(updateData.msg_id, 'Updated');
            flash_msg_item_bottom(updateData.checklist_id);
            $('.perchecklist_' + updateData.checklist_id).find('.dueDateIcon').css('pointer-events', 'auto');
        });
    } else if ($(elm).text() == "Decline") {
        var rec_id = $('#task_manager').attr('data-reciver');
        var msg_id = $('#task_manager').attr('msg-id');
        var checklist_id = $('#task_manager').attr('data-id');
        var receive_id = '';
        if (rec_id != 1 && rec_id != 2 && rec_id != undefined) {
            receive_id = rec_id;
        } else {
            receive_id = checklist_created_by;
        }
        // socket.emit('getOneChecklistData',{checklist_id:checklist_id,msg_id:msg_id},function(res){
        // 	var data = res.data;
        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            assign_status: "1",
            assign_decline_note: $('#declineNote').val().trim(),
            assignedby: receive_id,
            type: 'Decline'
        }
        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: msg_id,
            checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
            checklist_id: checklist_id,
            item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
            request_by: user_id,
            type: 'decline'
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlCancelled',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: [receive_id]
        }
        insertNotiFun(noti_data);
        $('.ttl_request' + checklistManageId).remove();
        socket.emit('manage_checklist', updateData, function(res) {
            $("#task_manager").removeClass("decline_open").removeClass("request_open");
            $('.ttl_request' + updateData.checklist_id).remove();
            var html = '<div class="ttl_requestTime ttl_request' + updateData.checklist_id + '">| <span class="success_btn red_color" data-id="' + updateData.checklist_id + '"><span class="short_cart_btn" data-type="cancel_decline" msg-id="' + updateData.msg_id + '" checklist-id="' + updateData.checklist_id + '" data-reciver="' + receive_id + '" onclick="requesttlBtn(this)">Cancel Decline</span></span></div>';

            $('.perchecklist_' + updateData.checklist_id).find('.assign_info').append(html);
            $('.perchecklist_' + updateData.checklist_id).removeClass('response_req');
            var response_req = Number($('.msg_id_' + updateData.msg_id).find('.checkListItem.response_req').length);
            $('#filterMyResReq_' + updateData.msg_id).text('My Response Required (' + response_req + ')');
        });
        // });
    } else if ($(elm).attr("data-label") == "Delete") {

        var checklist_id = $('#delete_item_div').attr("data-id");
        var msg_id = $('#delete_item_div').attr("msg-id");
        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            type: 'Delete'
        }

        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: updateData.msg_id,
            checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
            checklist_id: checklist_id,
            privacy: privacy,
            item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
            request_by: user_id
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlDelete',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: participants
        }

        if (checklist_id == undefined && $(elm).parents('.checkListItem').hasClass('new_item')) {
            $(elm).parents('.checkListItem.new_item').remove();
        } else {
            insertNotiFun(noti_data);
            socket.emit('manage_checklist', updateData, function(res) {
                $('.perchecklist_' + checklist_id).remove();
                $('#delete_item_div').hide();
                taskItemCounter(msg_id);
            });
        }
    } else if ($(elm).attr('data-type') == 'complete_review') {
        var msg_id = $('#task_manager').attr('msg-id');
        var checklist_id = $('#task_manager').attr('data-id');
        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            review_status: 0,
            type: 'complete_review'
        }

        $('.ttl_request' + checklist_id).remove();
        $('.perchecklist_' + checklist_id).removeClass('pending_item');
        $('.perchecklist_' + checklist_id).addClass('completed_item');
        $('.perchecklist_' + checklist_id).find('.checkBox').addClass('checked');
        $('.perchecklist_' + checklist_id).attr('review_status', 0);
        var item_c = Number($('.msg_id_' + msg_id).find('.checkListItem.completed_item').length);
        var item_p = Number($('.msg_id_' + msg_id).find('.checkListItem.pending_item').length);
        var unassigned = Number($('.msg_id_' + msg_id).find('.checkListItem.unassigned').length);
        var item_mp = Number($('.msg_id_' + msg_id).find('.checkListItem.my_pending').length);

        $('#filterMyPending_' + msg_id).text('My Pending (' + item_mp + ')').attr('data-pending', item_mp);
        $('#filterCompletedall_' + msg_id).text('Completed (' + item_c + ')').attr('data-com', item_c);
        $('#filterPending_' + msg_id).text('All Pending (' + item_p + ')').attr('data-pending', item_p);
        socket.emit('manage_checklist', updateData, function(res) {
            flash_msg_updated_fun(updateData.msg_id, 'Updated');
            flash_msg_item_bottom(updateData.checklist_id);
        });
    } else if ($(elm).attr('data-type') == 'recheck') {
        var msg_id = $('#task_manager').attr('msg-id');
        var checklist_id = $('#task_manager').attr('data-id');
        var updateData = {
                msg_id: msg_id,
                checklist_id: checklist_id,
                review_status: 2,
                checklist_status: 0,
                type: 'recheck'
            }
            // var stringBody = {
            // 	conversation_id:conversation_id,
            // 	conversation_type:conversation_type,
            // 	msg_id:updateData.msg_id,
            // 	checklist_title:$('.msg_id_'+checklistManageId_msg).find('.checkListPlainText').text(),
            // 	checklist_id:checklistManageId,
            // 	item_title:$('.perchecklist_'+checklistManageId).find('.checkBoxTitle').text(),
            // 	request_by:user_id,
            // 	type:'reject'
            // }
            // var noti_data = {
            // 	type:'checklist_changes',
            // 	title:'ttlCancelled',
            // 	body:JSON.stringify(stringBody),
            // 	created_at:new Date(),
            // 	created_by:user_id,
            // 	seen_users:[user_id],
            // 	receive_users: [checklistManageId_Reqttl]
            //   }
            // insertNotiFun(noti_data);
        $('.ttl_request' + checklist_id).remove();
        $('.perchecklist_' + checklist_id).attr('review_status', 2);
        $('.perchecklist_' + checklist_id).attr('checklist_status', 0);
        socket.emit('manage_checklist', updateData, function(res) {
            flash_msg_updated_fun(updateData.msg_id, 'Updated');
            flash_msg_item_bottom(updateData.checklist_id);
        });
    }

    if ($(elm).attr('data-type') == 'cancel_request') {
        var msg_id = $(elm).attr('msg-id');
        var checklist_id = $(elm).attr('checklist-id');
        var receive_id = $(elm).attr('data-reciver');
        socket.emit('getOneChecklistData', { checklist_id: checklist_id, msg_id: msg_id }, function(res) {
            var data = res.data;
            var updateData = {
                msg_id: msg_id,
                checklist_id: checklist_id,
                request_ttl_date: null,
                request_ttl_message: null,
                request_ttl_time: null,
                Request_ttl_by: null,
                status: data.assign_status,
                type: 'cancel_request'
            }
            var stringBody = {
                conversation_id: conversation_id,
                conversation_type: conversation_type,
                msg_id: updateData.msg_id,
                checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
                checklist_id: checklist_id,
                privacy: privacy,
                item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
                request_by: user_id
            }
            var noti_data = {
                type: 'checklist_changes',
                title: 'cancel_request',
                body: JSON.stringify(stringBody),
                created_at: new Date(),
                created_by: user_id,
                seen_users: [user_id],
                receive_users: [receive_id]
            }
            insertNotiFun(noti_data);

            socket.emit('manage_checklist', updateData, function(res) {
                $('.ttl_request' + updateData.checklist_id).remove();
                if (data.assign_status == 2) {
                    var html = '<div class="ttl_requestTime ttl_request' + updateData.checklist_id + '">| <span class="success_btn" data-id="' + updateData.checklist_id + '"><span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Mark complete" onclick="open_duedate_box(this)">Mark complete</span></span></div>';
                } else {
                    var html = '<div class="ttl_requestTime ttl_request' + updateData.checklist_id + '">| <span class="success_btn" data-id="' + updateData.checklist_id + '"><span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
                }
                $('.perchecklist_' + updateData.checklist_id).find('.assign_info').append(html);
                $('.perchecklist_' + updateData.checklist_id).addClass('response_req');
                taskItemCounter(msg_id);
            });
        });
    } else if ($(elm).attr('data-type') == 'cancel_decline') {
        var msg_id = $(elm).attr('msg-id');
        var checklist_id = $(elm).attr('checklist-id');
        var receive_id = $(elm).attr('data-reciver');

        var updateData = {
            msg_id: msg_id,
            checklist_id: checklist_id,
            assign_status: receive_id,
            assign_decline_note: null,
            type: 'cancel_decline'
        }
        var stringBody = {
            conversation_id: conversation_id,
            conversation_type: conversation_type,
            msg_id: updateData.msg_id,
            checklist_title: $('.msg_id_' + msg_id).find('.checkListPlainText').text(),
            checklist_id: checklist_id,
            item_title: $('.perchecklist_' + checklist_id).find('.checkBoxTitle').text(),
            request_by: user_id,
            type: 'cancel_decline'
        }
        var noti_data = {
            type: 'checklist_changes',
            title: 'ttlCancelled',
            body: JSON.stringify(stringBody),
            created_at: new Date(),
            created_by: user_id,
            seen_users: [user_id],
            receive_users: [receive_id]
        }
        insertNotiFun(noti_data);

        socket.emit('manage_checklist', updateData, function(res) {
            $('.ttl_request' + updateData.checklist_id).remove();
            var html = '<div class="ttl_requestTime ttl_request' + updateData.checklist_id + '">| <span class="success_btn" data-id="' + updateData.checklist_id + '"><span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
            $('.perchecklist_' + updateData.checklist_id).find('.assign_info').append(html);
            $('.perchecklist_' + updateData.checklist_id).addClass('response_req');
            taskItemCounter(msg_id);
        });
    }
    closePopUps('#task_manager');
}

function shortcart_accept_btn(elm) {
    // conversation_type
    var row = $(elm).closest('.checkListItem');
    var msg_id = $(row).attr('msg_id');
    var checklist_id = $(row).attr('checklist-id');

    if (checklist_id != '' && checklist_id != undefined) {

        socket.emit('getOneChecklistData', { checklist_id: checklist_id, msg_id: msg_id }, function(res) {
            console.log(res.data);
            var updateData = {
                msg_id: msg_id,
                checklist_id: checklist_id,
                assign_status: "2",
                assign_decline_note: null,
                type: 'assign_accept'
            }
            var stringBody = {
                conversation_id: conversation_id,
                conversation_type: conversation_type,
                msg_id: msg_id,
                checklist_title: $(row).closest('#msgCheckItemContainer').find('.checkListPlainText').text(),
                checklist_id: checklist_id,
                item_title: $(row).find('.checkBoxTitle').text(),
                request_by: user_id
            }
            var noti_data = {
                type: 'checklist_changes',
                title: 'ttlAccepted',
                body: JSON.stringify(stringBody),
                created_at: new Date(),
                created_by: user_id,
                seen_users: [user_id],
                receive_users: [res.data.assign_status]
            }
            insertNotiFun(noti_data);

            var ckDate = moment().format();
            ckDate = moment(ckDate).format('MMM Do YYYY');
            var ttDate = $(row).find('.end_due_date._due_date').attr('data');

            console.log(15487, ttDate, ckDate);
            socket.emit('manage_checklist', updateData, function(res) {
                $('.ttl_request' + checklist_id).remove();
                row.removeClass('waiting_3');
                // row.find('.dueDateIcon').removeClass('lock_for_user');
                if (ckDate == ttDate || ckDate > ttDate) {
                    console.log('ckDate > ttDate');
                    row.addClass('waiting_3');
                    var html = '<div class="ttl_requestTime ttl_request' + checklist_id + '">| <span class="success_btn" data-id="' + checklist_id + '"><span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Mark complete" onclick="open_duedate_box(this)">Mark complete</span></span></div>';
                    $(row).find('.assign_info').append(html);
                } else {
                    $('.perchecklist_' + checklist_id).removeClass('response_req');
                    taskItemCounter(msg_id);
                }
            });
        });
    }
}

function decline_sec_fun(type, data = null) {
    $('.request_note_sec').hide();
    $('#requestNewDateSec').show();
    $('.decline_note_sec').show();
    $('#declineNote').val("");
    if (data !== null) {
        $('#declineNote').val(data).attr('disabled', 'disabled');
    }
    if (type == 'edit') {
        $('#declineNote').removeAttr('disabled');
    }
}

function open_duedate_box(elm) {
    var type = $(elm).attr('data-type');
    $("#task_manager").removeClass("decline_open").removeClass("request_open");
    $('#marked_btn_sec').hide();
    if (type == "Decline") {
        $("#task_manager").addClass("decline_open");
        $(".decline_btn_sec").attr('disabled', 'disabled');
    } else if (type == "Request") {
        $("#task_manager").addClass("request_open");
    } else if (type == "Review") {
        $('.buttonAction').removeAttr('disabled');
        if ($(elm).attr('action') == 'declined' && $(elm).attr('action') != undefined) {
            $('#task_manager').attr('action', 'declined');
        } else if ($(elm).attr('action') == 'marked' && $(elm).attr('action') != undefined) {
            $('#marked_btn_sec').show();
        }
    }

    if (type == "Mark complete") {
        $(elm).closest(".checkListItem").find(".checkBox").trigger("click");
    } else {
        // open the popup box
        $(elm).closest(".checkListItem").find(".dueDateIcon").trigger("click");
    }
}


function taskItemCounter(msg_id) {
    console.log(msg_id);
    var dateOver_due = Number($('.msg_id_' + msg_id).find('.checkListItem.dateOver_due').length);
    var response_req = Number($('.msg_id_' + msg_id).find('.checkListItem.response_req').length);
    var ttckl = Number($('.msg_id_' + msg_id).find('.checkListItem').length);
    var comckl = Number($('.msg_id_' + msg_id).find('.checkListItem.completed_item').length);
    var pndckl = Number($('.msg_id_' + msg_id).find('.checkListItem.pending_item').length);
    var assigned = Number($('.msg_id_' + msg_id).find('.checkListItem.has_assign').length);
    var unassigned = Number($('.msg_id_' + msg_id).find('.checkListItem.unassigned').length);
    var my_pending = Number($('.msg_id_' + msg_id).find('.checkListItem.my_pending').length);
    $('.msg_id_' + msg_id).find('.S1').text('Show All (' + ttckl + ')');
    $('.msg_id_' + msg_id).find('.P1').text('All Pending (' + pndckl + ')');
    $('.msg_id_' + msg_id).find('.MP1').text('My Pending (' + my_pending + ')');
    $('.msg_id_' + msg_id).find('.MR1').text('My Response Required (' + response_req + ')');
    $('.msg_id_' + msg_id).find('.C1').text('Completed (' + comckl + ')');
    $('.msg_id_' + msg_id).find('.AS1').text('Assigned (' + assigned + ')');
    $('.msg_id_' + msg_id).find('.US1').text('Unassigned (' + unassigned + ')');
    $('.msg_id_' + msg_id).find('.OD1').text('Over Due (' + dateOver_due + ')');
}

socket.on('update_checklist_settings', function(res) {
    console.log('update_checklist_settings', res.data);
    var hiddenCls = '';
    var data = res.data;
    var cvPrivacy = checklistVisiblityCheck(data);
    var id = data.checklist_id;
    var up_check = $('.perchecklist_' + id).find('.end_due_date.upBy_name');
    console.log(125, up_check)
    if (data.end_due_date != null) {
        if (Number(data.end_due_date) < moment().unix()) {
            if (!$('.perchecklist_' + data.checklist_id).hasClass('overdue')) {
                $('.perchecklist_' + data.checklist_id).addClass('overdue')
            }
        } else {
            $('.perchecklist_' + data.checklist_id).removeClass('overdue')
        }
        if (res.type == 'single') {
            console.log(26187, res.type);
            $('.perchecklist_' + data.checklist_id).find('.checkBox').removeClass('checkUNauth');
            if (!cvPrivacy) {
                $('.perchecklist_' + data.checklist_id).find('.checkBox').addClass('checkUNauth');
            }
            $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('data-privacy', data.privacy);
            $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('data-assignee', data.assign_to);
            $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('end-date', data.end_due_date);
            $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(data.assign_to).img + '">')
            if (!$('.perchecklist_' + data.checklist_id).find('.dueDateIcon').hasClass('active')) {
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').addClass('active AssigneeUser');
            }
            if (data.end_due_date != null) {
                if (Number(data.end_due_date) < moment().unix()) {
                    if (!$('.perchecklist_' + data.checklist_id).hasClass('overdue')) {
                        $('.perchecklist_' + data.checklist_id).addClass('overdue')
                    }
                } else {
                    $('.perchecklist_' + data.checklist_id).removeClass('overdue')
                }
            }

            var id = data.checklist_id;
            var up_check = $('.perchecklist_' + id).find('.end_due_date.upBy_name');
            var crtBy = $('.perchecklist_' + id).find('.createdBy_name').text();
            var assign_info = '<div class="assign_info">';
            assign_info += '<span class="createdBy_name">' + crtBy + '</span>'
            assign_info += ' <span class="end_due_date upBy_name" data="">| Updated by ' + findObjForUser(data.last_updated_by).fullname + ' on ' + moment(data.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span>'
            if (data.assign_to != user_id && data.assignedby == data.assign_to && data.assign_status == data.assign_to) {
                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">| Self-assigned by ' + findObjForUser(data.assign_to).fullname + '</span> ';
                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';
            } else {
                assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">| Assigned to ' + findObjForUser(data.assign_to).fullname + ' </span>';
                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';
                assign_info += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(data.assignedby).fullname + '">| Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>';
            }
            assign_info += '</div>';

            var Ac = $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').attr('data-assingment');
            Ac = Number(Ac);

            var allActivity = '';
            if (data.assign_to != null && data.end_due_date != null) {
                allActivity += '<span class="activity_assignedTo"> | Assigned to ' + findObjForUser(data.assign_to).fullname + ' </span>'
            }
            if (data.assignedby != null && data.end_due_date != null) {
                allActivity += '<span class="activity_assignedBy"> | Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>'
            }

            if (data.assign_to != null) {
                if (data.assignedby != user_id && data.assign_status != user_id) {
                    if ($('.perchecklist_' + id).find('.assign_info').length == 1) {
                        $('.perchecklist_' + id).find('.assign_info').remove();
                        $('.perchecklist_' + id).append(assign_info);
                    } else {
                        $('.perchecklist_' + id).append(assign_info);
                    }
                }
                Ac = Number(Ac + 1);
                $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').text('Assigned (' + Ac + ')');
                $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').attr('data-assingment', Ac);
                $('.perchecklist_' + id).addClass('has_assign').removeClass('unassigned');
                $('.perchecklist_' + id).attr('assign-to', data.assign_to);
                $('.perchecklist_' + id).attr('assigned-by', data.assignedby);
                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedTo').remove();
                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedBy').remove();
                $('.perchecklist_' + id).find('.activity_list_all').append(allActivity);
                if (data.assignedby != user_id) {
                    $('.perchecklist_' + id).addClass('response_req');
                    var response_req = Number($('.msg_id_' + data.msg_id).find('.checkListItem.response_req').length);
                    $('#filterMyResReq_' + data.msg_id).text('My Response Required (' + response_req + ')');
                }
            } else {
                Ac = Number(Ac - 1);
                $('.perchecklist_' + id).find('.assign_info').remove();
                $('.perchecklist_' + id).append(assign_info);
                $('.perchecklist_' + id).attr('assign-to', 'null');
                $('.perchecklist_' + id).attr('assigned-by', 'null');
                $('.perchecklist_' + id).removeClass('item_accepted');
                $('.perchecklist_' + id).removeClass('waiting_3');
                $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').text('Assigned (' + Ac + ')');
                $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').attr('data-assingment', Ac);
                $('.perchecklist_' + id).removeClass('has_assign').addClass('unassigned');
                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedTo').remove();
                $('.perchecklist_' + id).find('.activity_list_all .activity_assignedBy').remove();
            }
        } else {
            console.log('setting', 123);
            var alldue = $('.msg_id_' + data.msg_id).find('.dueDateIcon');
            var allItem = $('.msg_id_' + data.msg_id).find('.checkListItem');

            $('.msg_id_' + data.msg_id).find('.checkListPlainText').attr('data-privacy', data.privacy);
            $('.msg_id_' + data.msg_id).find('.checkListPlainText').attr('data-assignee', data.assign_to);
            $('.msg_id_' + data.msg_id).find('.checkListPlainText').attr('end-date', data.end_due_date);

            var id = data.checklist_id;
            var up_check = $('.perchecklist_' + id).find('.end_due_date.upBy_name');
            var assign_info = '<div class="assign_info">';
            if (up_check.length > 0) {
                assign_info += '<span class="end_due_date upBy_name" data="">' + up_check.text() + '</span>'
            }
            if (data.assign_to != user_id && data.assignedby == data.assign_to && data.assign_status == data.assign_to) {
                assign_info += '<span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">' + (up_check.length > 0 ? ' | ' : ' | ') + 'Self-assigned by ' + findObjForUser(data.assign_to).fullname + '</span> ';
                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';
            } else {
                assign_info += '<span class="end_due_date assignee_name" data="' + findObjForUser(data.assign_to).fullname + '">' + (up_check.length > 0 ? ' | ' : ' | ') + 'Assigned to ' + findObjForUser(data.assign_to).fullname + ' </span>';
                assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';
                assign_info += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(data.assignedby).fullname + '">| Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>';
            }
            assign_info += '</div>';
            $.each(alldue, function(k, v) {
                $(v).parents('.checkListItem').find('.checkBox').removeClass('checkUNauth');
                if (!cvPrivacy) {
                    $(v).parents('.checkListItem').find('.checkBox').addClass('checkUNauth');
                }
                if (data.end_due_date != null) {
                    if (Number(data.end_due_date) < moment().unix()) {
                        if (!$(v).parents('.checkListItem').hasClass('overdue')) {
                            $(v).parents('.checkListItem').addClass('overdue')
                        }
                    } else {
                        $(v).parents('.checkListItem').removeClass('overdue')
                    }
                }

                $(v).attr('data-privacy', data.privacy);
                $(v).attr('data-assignee', data.assign_to);
                $(v).attr('end-date', data.end_due_date);
                // $(v).html('<img src="'+file_server+'profile-pic/Photos/'+findObjForUser(data.assign_to).img+'">')
                if (!$(v).hasClass('active')) {
                    $(v).addClass('active AssigneeUser');
                }
            });
            console.log(allItem);
            $.each(allItem, function(k, v) {
                if (!$(v).hasClass('new_item')) {
                    var checklist_id = $(v).attr('checklist-id');
                    if (data.assignedby != user_id && data.assign_status != user_id) {
                        $(v).append(assign_info);
                    }
                    $(v).addClass('has_assign').removeClass('unassigned');
                    $(v).attr('assign_to', data.assign_to);
                    $(v).attr('assignedby', data.assignedby);
                    $(v).find('.assign_info').append('<div class="ttl_requestTime ttl_request' + checklist_id + '">| <span class="success_btn red_color" data-id="' + checklist_id + '">Pending Acceptance. </span></div>');
                    $(v).find('.dueDateIcon').html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(data.assign_to).img + '">')
                }
            });
            // console.log(23927, Number(allItem.length-1));
            $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').text('Assigned (' + Number(allItem.length - 1) + ')');
            $('.msg_id_' + data.msg_id).find('.filterShowall.assignment_count').attr('data-assingment', Number(allItem.length - 1));
        }
    } else {
        $('.perchecklist_' + data.checklist_id).removeClass('overdue');
        if (res.type == 'single') {
            console.log(26334, res.type);
            if (data.last_updated_by != user_id) {
                $('.perchecklist_' + data.checklist_id).find('.checkBox').removeClass('checkUNauth');
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('data-privacy', '');
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('data-assignee', '');
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').attr('end-date', '');
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').html('');
                $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').removeClass('active AssigneeUser');

                var id = data.checklist_id;
                // var dt = moment().format();
                $('.perchecklist_' + id).find('.assign_info').remove();

                $('.perchecklist_' + id).append('<div class="assign_info"><span class="end_due_date upBy_name" data="">Updated by ' + findObjForUser(data.last_updated_by).fullname + ' on ' + moment(data.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span></div>');
                $('.perchecklist_' + id).attr('assign-to', 'null');
                $('.perchecklist_' + id).attr('assigned-by', 'null');
                $('.perchecklist_' + id).removeClass('item_accepted');
                $('.perchecklist_' + id).removeClass('waiting_3');
                $('.perchecklist_' + id).find('.ttl_requestTime').remove();
                $('.perchecklist_' + id).removeClass('has_assign').addClass('unassigned');

                $('.perchecklist_' + id).removeClass('response_req');
                taskItemCounter(res.data.msg_id);
            }

        } else {
            var allItem = $('.msg_id_' + data.msg_id).find('.dueDateIcon');
            $.each(allItem, function(k, v) {
                $(v).parents('.checkListItem').find('.checkBox').removeClass('checkUNauth');
                $(v).parents('.checkListItem').removeClass('overdue');
                $(v).attr('data-privacy', '');
                $(v).attr('data-assignee', '');
                $(v).attr('end-date', '');
                $(v).html('')
                $(v).removeClass('active AssigneeUser');
            })
        }
    }

    if (data.assignedby != user_id && data.assign_to == user_id) {
        console.log(23942, data.assignedby, data.assign_to, user_id);
        $('.ttl_request' + data.checklist_id).remove();
        var html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn" data-id="' + data.checklist_id + '"><span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" onclick="open_duedate_box(this)" data-type="Request">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
        $('.perchecklist_' + data.checklist_id).addClass('waiting_3');
        $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
    }
});

socket.on('update_checklist_settings_last', function(data) {
    console.log('update_checklist_settings_last', data);
    if (data.type == 'accept' || data.type == 'cancel') {
        if (data.type == 'accept') {
            console.log(24405, data);
            $('.ttl_request' + data.checklist_id).remove();
            $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').css('pointer-events', 'auto');
            $('.perchecklist_' + data.checklist_id).removeClass('waiting_3');
            $('hayven_Modal_Container').removeClass('request_open');
            var html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn" data-id="' + data.checklist_id + '">Request Accepted</span></div>';
            if (data.request_ttl_approved_date != null) {
                $('.perchecklist_' + data.checklist_id).find('.assign_info .end_due_date._due_date').text('Due by: ' + (data.request_ttl_approved_date != null ? moment.unix(Number(data.request_ttl_approved_date / 1000)).format('ll') : ''));
            }
            $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
        } else {
            if ($('.ttl_request' + data.checklist_id).is(':visible')) {
                var html = '<span class="success_btn red_color"  data-id="' + data.checklist_id + '">Request Canceled</span>';
                $('.ttl_request' + data.checklist_id).html(html);

            }
        }
    } else if (data.type == 'assign_accept') {
        $('.ttl_request' + data.checklist_id).remove();
        // flash_msg_item_bottom(data.checklist_id);
    } else if (data.type == 'request') {
        $('.ttl_request' + data.checklist_id).remove();
        var html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span style="color: red">Extension requested </span>  <span class="success_btn red_color" data-id="' + data.checklist_id + '"> <span class="short_cart_btn" data-type="Review" onclick="open_duedate_box(this)">Review</span></span></div>';
        console.log(24517, conversation_type);
        if (conversation_type == 'single') {
            if (data.assign_to != user_id) {
                $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
            }
        } else {
            if (data.assignedby == user_id) {
                if (data.assign_to != user_id) {
                    $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
                }
            }
        }
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .item_del').hide();
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .dueDateIcon').css('pointer-events', 'none');
    } else if (data.type == 'cancel_request') {
        $('.ttl_request' + data.checklist_id).remove();
        var html = '';
        if (data.status != 2) {
            html += '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn red_color" data-id="' + data.checklist_id + '">Pending Acceptance</span></div>';
        }
        if (conversation_type == 'personal') {
            if (data.assign_to != user_id) {
                $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
            }
        } else {
            if (data.assign_to != user_id) {
                $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
            }
        }
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .item_del').show()
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .dueDateIcon').css('pointer-events', 'auto');
    } else if (data.type == 'assigneeChange') {
        var id = data.checklist_id;
        // var up_check = $('.perchecklist_'+id).find('.end_due_date.upBy_name');
        // var dt = moment().format();
        var crtBy = $('.perchecklist_' + id).find('.createdBy_name').text();
        var assign_info = '<div class="assign_info">';
        assign_info += '<span class="createdBy_name">' + crtBy + '</span>'
        assign_info += ' <span class="end_due_date upBy_name" data="">| Updated by ' + findObjForUser(data.last_updated_by).fullname + ' on ' + moment(data.last_updated_at).format('MMM Do YYYY - h:mm a') + '</span>';
        if (data.alternative_assign_to != user_id && data.assignedby == data.alternative_assign_to && data.assign_status == data.alternative_assign_to) {
            assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.alternative_assign_to).fullname + '">| Self-assigned by ' + findObjForUser(data.alternative_assign_to).fullname + '</span> ';
            assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';

            $('.perchecklist_' + data.checklist_id).find('.item_toolbar .end_due_date').hide();
        } else {
            assign_info += ' <span class="end_due_date assignee_name" data="' + findObjForUser(data.alternative_assign_to).fullname + '">| Assigned to ' + findObjForUser(data.alternative_assign_to).fullname + ' </span>';
            assign_info += ' <span class="end_due_date _due_date" data="' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY') : '') + '">| Due by: ' + (data.end_due_date != null ? moment.unix(Number(data.end_due_date / 1000)).format('MMM Do YYYY - h:mm a') : '') + '</span>';
            assign_info += ' <span class="end_due_date assignBy_name" data="' + findObjForUser(data.assignedby).fullname + '">| Assigned by ' + findObjForUser(data.assignedby).fullname + ' </span>';
        }
        assign_info += '</div>';
        var id = data.checklist_id;
        if (data.alternative_assign_to != null) {
            if (data.assignedby != user_id && data.assign_status != user_id) {
                if ($('.perchecklist_' + id).find('.assign_info').length == 1) {
                    $('.perchecklist_' + id).find('.assign_info').remove();
                    $('.perchecklist_' + id).append(assign_info);
                } else {
                    $('.perchecklist_' + id).append(assign_info);
                }
            }
            $('.perchecklist_' + id).attr('assign-to', data.alternative_assign_to);
            $('.perchecklist_' + id).attr('assigned-by', data.assignedby);
        } else {
            $('.perchecklist_' + id).find('.assign_info').remove();
            $('.perchecklist_' + id).append(assign_info);
            $('.perchecklist_' + id).attr('assign-to', 'null');
            $('.perchecklist_' + id).attr('assigned-by', 'null');
            $('.perchecklist_' + id).removeClass('item_accepted');
            $('.perchecklist_' + id).removeClass('waiting_3');
        }

        $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').addClass('AssigneeUser');
        $('.perchecklist_' + data.checklist_id).find('.dueDateIcon').html('<img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(data.alternative_assign_to).img + '">');

        $('.ttl_request' + data.checklist_id).remove();
        var html = '';

        if (data.alternative_assign_to == user_id) {
            $('.perchecklist_' + data.checklist_id).addClass('waiting_3');
            html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn" data-id="' + data.checklist_id + '"> <span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" data-type="Request" onclick="open_duedate_box(this)">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
        } else {
            $('.perchecklist_' + data.checklist_id).removeClass('waiting_3');
            if (adminArra.indexOf(user_id) > -1) {
                console.log('Assignee change');
            }
            html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn" data-id="' + data.checklist_id + '">Assignee changed</span></div>';
        }
        $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);

    } else if (data.type == 'Decline') {
        $('.ttl_request' + data.checklist_id).remove();
        var html = "";
        if (conversation_type == 'single') {
            if (data.assign_status == 1) {
                html += '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span style="color: red">Declined </span>  <span class="success_btn red_color" data-id="' + data.checklist_id + '"> <span class="short_cart_btn" data-type="Review" onclick="open_duedate_box(this)" action="declined">Review</span></span></div>';
            }
        } else {
            if (data.assignedby == user_id) {
                if (data.assign_status == 1) {
                    html += '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span style="color: red">Declined </span>  <span class="success_btn red_color" data-id="' + data.checklist_id + '"> <span class="short_cart_btn" data-type="Review" onclick="open_duedate_box(this)" action="declined">Review</span></span></div>';
                }
            }
        }
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .item_del').hide()
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .dueDateIcon').css('pointer-events', 'none');
        $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
    } else if (data.type == 'cancel_decline') {
        $('.ttl_request' + data.checklist_id).remove();
        var html = "";
        if (conversation_type == 'single') {
            if (data.assign_status != 1) {
                html += '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn red_color" data-id="' + data.checklist_id + '">Pending Acceptance</span></div>';
            }
        } else {
            if (adminArra.indexOf(user_id) > -1) {
                if (data.assign_status != 1) {
                    html += '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn red_color" data-id="' + data.checklist_id + '">Pending Acceptance</span></div>';
                }
            }
        }
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .item_del').show();
        $('.perchecklist_' + data.checklist_id).find('.item_toolbar .dueDateIcon').css('pointer-events', 'auto');
        $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
    } else if (data.type == 'duedate_change_creator') {
        $('.ttl_request' + data.checklist_id).remove();
        var html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span class="success_btn" data-id="' + data.checklist_id + '"> <span class="short_cart_btn aprove_btn_sortcart" onclick="shortcart_accept_btn(this)">Accept</span> <span class="short_cart_btn" data-type="Request" onclick="open_duedate_box(this)">Request for extension</span> <span class="short_cart_btn" data-type="Decline" onclick="open_duedate_box(this)">Decline</span></span></div>';
        $('.perchecklist_' + data.checklist_id).append(html);
    } else if (data.type == 'Delete') {
        $('.perchecklist_' + data.checklist_id).remove();
        taskItemCounter(data.msg_id);
    } else if (data.type == 'complete_review') {
        $('.perchecklist_' + data.checklist_id).attr('review_status', 0);
        console.log(25952, data.type);
    } else if (data.type == 'recheck') {
        $('.perchecklist_' + data.checklist_id).addClass('pending_item');
        $('.perchecklist_' + data.checklist_id).removeClass('completed_item');
        $('.perchecklist_' + data.checklist_id).find('.checkBox').removeClass('checked');
        $('.perchecklist_' + data.checklist_id).attr('review_status', 2);
        $('.perchecklist_' + data.checklist_id).attr('checklist_status', 0);

        taskItemCounter(data.msg_id);

        var html = '<div class="ttl_requestTime ttl_request' + data.checklist_id + '">| <span style="color: red"></span>  <span class="success_btn red_color" data-id="' + data.checklist_id + '"> Task Re-check</span></div>';
        $('.ttl_request' + data.checklist_id).remove();
        $('.perchecklist_' + data.checklist_id).find('.assign_info').append(html);
    }
})


var allUnreadMessages = [];

function update_conv_counter(getdata = false) {
    if (getdata === false) return;
    var data = getdata.data;
    var my_all_conv = [];

    $.each($('[id^=conv]'), function(k, v) {
        if ($(v).is("li")) {
            $(v).find(".unreadMsgCount").text("");
            $(va).ttr("data-nom", "");
            $(v).attr("data-nor", "");
            my_all_conv.push($(v).attr('data-conversationid'));
        }
    });

    //$.each(allUserdata[0].unread_msg_conv.data.all_unread, function(k,v){
    // 	var id = v.conversation_id.toString();
    // 	var c = Number($(".convid"+id).find(".unread_msg").text());
    // 	$(".convid"+id).find(".unread_msg").html(c+1);
    // 	$(".convid"+id).attr("data-nom", c+1);
    // });

    // set_checklist_item_counter(data.all_chk);

    console.log("all_unread_msg ========= ", data);
    allUnreadMessages = data.all_unread;
    // Unread messages
    var dataallunread = [];
    if (data.all_unread.length > 0) {
        $.each(data.all_unread, function(k, v) {
            if (deletedMessages.indexOf(v.msg_id)) {
                if (checkguestMsg(v)) {
                    dataallunread.push(v);
                    if (v.root_conv_id == null) {
                        var id = v.conversation_id.toString();
                        var c = Number($(".convid" + id).find(".unread_msg").text());
                        $(".convid" + id).find(".unread_msg").html(c + 1);
                        $(".convid" + id).attr("data-nom", c + 1);
                        // conv_into_top(id);
                    } else {
                        // $("#conv"+v.root_conv_id).find('.subroomunread').show();
                    }
                }
            }
        });
    }
    data_unreadAllMsg = dataallunread;
    data_allEditUnreadMsg = data.edit_unseen;
    // if(data.unread_replay.length > 0){
    //     $(".thread_active").show();
    //     $(".thread_message").show();
    //     $.each(data.rep_con_data, function(k,v){
    //         $.each(data.unread_replay, function(kk, vv){
    //             if(v.has_delete == null){
    //                 v.has_delete = [];
    //             }
    //             if(deletedMessages.indexOf(v.msg_id) == -1 && deletedMessages.indexOf(vv.msg_id) == -1){
    //                 if(v.rep_id == vv.conversation_id){
    //                     if (checkguestMsg(vv)) {
    //                         unread_replay_data.push({
    //                             rep_conv: vv.conversation_id,
    //                             msg_id: vv.msg_id,
    //                             root_conv_id: v.conversation_id,
    //                             root_msg_id: v.msg_id,
    //                             is_seen:false
    //                         });
    //                         $("#conv"+v.conversation_id).addClass("has_unread_replay");
    //                         var nor = Number($("#conv"+v.conversation_id).attr("data-nor"));
    //                         $("#conv"+v.conversation_id).attr("data-nor", Number(nor+1));
    //                         // checkunreadthread(v.msg_id);
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
    //     reply_msg_counter();
    // }
}
// update_conv_counter(all_unread_data);


function onpasteFun(e) {
    e.preventDefault();
    var text = '';
    console.log(17748, e);
    if (e.clipboardData || e.originalEvent.clipboardData) {
        text = (e.originalEvent || e).clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
        text = window.clipboardData.getData('Text');
    }
    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
    } else {
        document.execCommand('paste', false, text);
    }
}
stats_green = 0;
stats_yellow = 0;
stats_checkin = 0;
stats_deny = 0;
status_total = 0;

function searchStudentsCampus(_status=true) {
    // //debugger;
    var campus_input = $('#search_campus_input').val();
    var student_input = $('#search_student_input').val();

    var start_date = $('#filter_start_date').val(); //alert(start_date);
    var end_date = $('#filter_end_date').val();
    var dateObj = {};
    if (start_date) dateObj.start_date = moment(start_date).startOf('day').unix();
    if (end_date) dateObj.end_date = moment(end_date).endOf('day').unix();
    // alert(dateObj.end_date);

    $.ajax({
        url: '/covid/search_student_campus',
        type: "POST",
        data: {
            user: {
                // campus: campus_input,
                student_name: student_input,
                company_id:company_id
            },
            date: dateObj
        },
        success: function(data) {
            // debugger
            console.log('search__student', data);
            $('#report_table_body').empty();
            $('#close_campus_input').css('visibility', 'visible');
            if(_status) $('#box_idcard').empty();
            stats_green = 0;
            stats_yellow = 0;
            stats_checkin = 0;
            stats_deny = 0;
            status_total = 0;

            if (data.res1.length) {
                for (let r of data.res1) {
                    drawCardLayout(r, '#box_idcard',false);
                }
                $('#box_nofound').hide();
            } else {
                $('#box_nofound').show();
            }

            if (user_role != 'Stuff User' && _status==true) { open_searchForm(); }

            if (user_role == 'Admin User') {
                // $('#box_idcard').hide();
                if(_status) $('#box_admin_counters').css('display', 'grid');
                $('#report_count_total').text(status_total);
                $('#report_count_green').text(stats_green);
                $('#report_count_yellow').text(stats_yellow);
                $('#report_count_checkin').text(stats_checkin);
                $('#report_count_deny').text(stats_deny);
                $('#report_count_red').text(user_list.length - data.res1.length);
                view_idcard_default();
                start_covid_form('xls');
                start_covid_form('pdf');
            }
        },
        complete: function() {
            console.log('process complete');
        },
        error: function(err) {
            console.log('process error', err);
            alert('No Response');
        }
    });


    // } else {
    // 	$('#warnignMsgText').text('No input to search.');
    // 	$('#warningsPopup').css('display', 'flex');
    // }


}

function clearSearchValues() {
    // //debugger

    $('#search_student_input').val('');

    if (user_role == 'Stuff User') {
        // getActiveStuff();
    } else {
        // filter_start_date.clear();
        // filter_end_date.clear();
        filter_start_date.setDate('today');
        filter_end_date.setDate('today');
        // $('select').val('US');
        $('#search_campus_input').val('').trigger('change');

        getActiveStuff();
        open_searchForm()
    }
}

function view_idcard_btn(id) {
    // debugger
    $('.idcard_btn_cancel:visible').each(function(index, value) {
        var id = $(this).parents('.idcard_main').attr('data-id');
        $('#idcard_main_' + id).find('.idcard_btn').hide();
        $('#idcard_main_' + id).find('.idcard_propic').show();

        if ($('#idcard_main_' + id).attr('covid-status') == 'yes') {
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').hide();
            $('#idcard_main_' + id).find('.idcard_name_out').hide();

            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_check').hide();

            $('#idcard_main_' + id).find('.idcard_deny').show();
            $('#idcard_main_' + id).find('.idcard_valid').hide();



        } else {
            if ($('#idcard_main_' + id).attr('checkin_set') != ($('#idcard_main_' + id).attr('checkout_set'))) {
                $('#idcard_main_' + id).find('.idcard_name').show();
                $('#idcard_main_' + id).find('.idcard_name_in').hide();
                $('#idcard_main_' + id).find('.idcard_name_out').show();

                $('#idcard_main_' + id).find('.idcard_info').show();
                $('#idcard_main_' + id).find('.idcard_filled').show();
                $('#idcard_main_' + id).find('.idcard_check').show();

                $('#idcard_main_' + id).find('.idcard_deny').hide();
                $('#idcard_main_' + id).find('.idcard_valid').hide();
            } else {
                $('#idcard_main_' + id).find('.idcard_name').show();
                $('#idcard_main_' + id).find('.idcard_name_in').show();
                $('#idcard_main_' + id).find('.idcard_name_out').hide();

                $('#idcard_main_' + id).find('.idcard_info').show();
                $('#idcard_main_' + id).find('.idcard_filled').show();
                $('#idcard_main_' + id).find('.idcard_check').show();

                $('#idcard_main_' + id).find('.idcard_deny').hide();
                $('#idcard_main_' + id).find('.idcard_valid').hide();
            }

        }
    });
    var main_height = (document.getElementById('idcard_main_' + id).offsetHeight);
    if (page_type != 'survey') {
        if (user_role == 'Stuff User' || user_role == 'Admin User') {

            if ($('#idcard_main_' + id).find('.idcard_btn_cancel').is(':visible')) { // close button

                $('#idcard_main_' + id).find('.idcard_btn').hide();
                $('#idcard_main_' + id).find('.idcard_check').show();
                $('#idcard_main_' + id).find('.idcard_filled').show();
                $('#idcard_main_' + id).find('.idcard_info').show();
                $('#idcard_main_' + id).find('.idcard_name_in').show();
                $('#idcard_main_' + id).find('.idcard_propic').show();

            } else if ($('#idcard_main_' + id).find('.idcard_name_in').is(':visible')) {
                setTimeout(() => {
                    $('#idcard_main_' + id).find('.idcard_check').hide();
                    $('#idcard_main_' + id).find('.idcard_btn').show();
                    $('#idcard_main_' + id).find('.idcard_btn_allow').css({
                        'height': ((main_height / 2)) + 'px',
                        'display': 'table',
                        'width': '100%'
                    });
                    $('#idcard_main_' + id).find('.idcard_btn_deny').css({
                        'height': ((main_height / 2)) + 'px',
                        'display': 'table',
                        'width': '100%'
                    });
                    $('#idcard_main_' + id).find('.idcard_btn_cancel').show();
                    $('#idcard_main_' + id).find('.idcard_btn_checkout').hide();

                    $('#idcard_main_' + id).find('.idcard_filled').hide();
                    $('#idcard_main_' + id).find('.idcard_info').hide();
                    $('#idcard_main_' + id).find('.idcard_name_in').hide();

                    $('#idcard_main_' + id).find('.idcard_propic').hide();
                    $('#idcard_main_' + id).find('.idcard_name').hide();


                }, 0)


            } else if ($('#idcard_main_' + id).find('.idcard_name_out').is(':visible')) {
                $('#idcard_main_' + id).find('.idcard_check').hide();
                $('#idcard_main_' + id).find('.idcard_btn').show();

                $('#idcard_main_' + id).find('.idcard_btn_allow').hide();
                $('#idcard_main_' + id).find('.idcard_btn_deny').hide();
                $('#idcard_main_' + id).find('.idcard_btn_cancel').show();
                $('#idcard_main_' + id).find('.idcard_btn_checkout').css({
                    'height': ((main_height)) + 'px',
                    'display': 'table',
                    'width': '100%'
                });

                $('#idcard_main_' + id).find('.idcard_filled').hide();
                $('#idcard_main_' + id).find('.idcard_info').hide();
                $('#idcard_main_' + id).find('.idcard_name_out').hide();
                $('#idcard_main_' + id).find('.idcard_propic').hide();
                $('#idcard_main_' + id).find('.idcard_name').hide();

            } else if ($('#idcard_main_' + id).attr('covid-status') == 'yes' && user_role == 'Admin User') {

                setTimeout(() => {
                    $('#idcard_main_' + id).find('.idcard_check').hide();
                    $('#idcard_main_' + id).find('.idcard_btn').show();
                    $('#idcard_main_' + id).find('.idcard_btn_allow').css({
                        'height': ((main_height / 2)) + 'px',
                        'display': 'table',
                        'width': '100%'
                    });
                    $('#idcard_main_' + id).find('.idcard_btn_deny').css({
                        'height': ((main_height / 2)) + 'px',
                        'display': 'table',
                        'width': '100%'
                    });
                    $('#idcard_main_' + id).find('.idcard_btn_cancel').show();
                    $('#idcard_main_' + id).find('.idcard_btn_checkout').hide();

                    $('#idcard_main_' + id).find('.idcard_filled').hide();
                    $('#idcard_main_' + id).find('.idcard_info').hide();
                    $('#idcard_main_' + id).find('.idcard_name_in').hide();
                    $('#idcard_main_' + id).find('.idcard_name').show();
                    $('#idcard_main_' + id).find('.idcard_deny').hide();
                    $('#idcard_main_' + id).find('.idcard_propic').hide();
                    $('#idcard_main_' + id).find('.idcard_name').hide();



                }, 0)

            }

        }
    }

}
st_roll_num = 0;

function drawCardLayout(r, selector, viewstatus = false,_status=true) {
    
    var id = r.student_id + r.date_of;
    var name = r.student_name;
    console.log($('#search_student_input').val());
    
    if($('#search_student_input').val()){
        
        let s1 = name.toLowerCase().includes( $('#search_student_input').val().toLowerCase() );
        let s2 = r.roll_number.toLowerCase() ==  $('#search_student_input').val().toLowerCase();
        if( s1 == false && s2 == false ) return;
        else debugger
    }else{
        // if(r.user_role=='Public User'){
        //     debugger
        //     if (r.checkin_set) {
        //         for (let chkin_db of r.checkin_set) {
        //             if (chkin_db.includes(company_id)) viewstatus = true;
        //         }
        //     }else{
        //         debugger
        //         if(r.company_id.includes(company_id)) viewstatus = true;
        //     }

        //     // if(r.checkin=="") return
        //     // if(r.checkin_company && r.checkin_company.indexOf(company_id) === -1 ) return;
        // }else{
            if(r.company_id != company_id){
                if(r.checkin=="") return
                if(r.checkin_company && r.checkin_company.indexOf(company_id) === -1 ) return;

            };
        // }
        
    };
    if (page_type == 'survey') { 
        var checkin_text = 'OK to check-in for '+ moment(r.created_at).format('DD-MM-YYYY'); 
    } 
    else { 
        var checkin_text = 'OK to check-in for '+ moment(r.created_at).format('DD-MM-YYYY'); 
    }
    if (page_type == 'survey') { 
        var checkout_text = 'OK to check-out for '+moment(r.created_at).format('DD-MM-YYYY'); 
    } 
    else { 
        var checkout_text = 'OK to check-out for '+moment(r.created_at).format('DD-MM-YYYY'); 
    }
    
    // if (user_role == 'Admin User' && r.user_role == 'Public User' && viewstatus == false) {
    //     // var viewstatus = false;
    //     // if (r.checkin_set) {
    //     //     for (let chkin_db of r.checkin_set) {
    //     //         if (chkin_db.includes(company_id)) viewstatus = true;
    //     //     }
    //     // }else{
    //     //     debugger
    //     //     if(r.company_id.includes(company_id)) viewstatus = true;
    //     // }

    //     if (!viewstatus) return;
    // }
    if (r.answer_result == 'yes') stats_yellow++;
    else if (r.answer_result == 'no') stats_green++;
    if (r.checkin) stats_checkin++;
    if (r.checkin_deny) stats_deny++;
    status_total++;
    debugger
    // if(_status == false) return;
    console.log('drawCard_Layout', r);
    $(selector).append(
            '<div data-create-date="'+r.created_at+'" data-checkin-time="'+r.checkin+'" data-checkout-time="'+r.checkout+'" data-name="'+r.student_name+'" id="idcard_main_' + id + '" user-role="' + r.user_role + '" row-id="' + r.row_id + '" data-id=' + id + ' student-id="' + r.student_id + '" covid-status="' + r.answer_result + '" data-deny="' + r.checkin_deny + '" data-checkin="' + (r.checkin ? 'yes' : 'no') + '" data-checkout="' + (r.checkout ? 'yes' : 'no') + '" onclick="view_idcard_btn(\'' + id + '\')" class="option-box box_stuff1 idcard_main">' +
            '   <div style=display:'+ (page_type != 'survey' ? 'block':'none')+' class="idcard_propic" style="flex: 0;" onclick="covid_propic_public()">' +
            '       <img class="idcard_img">' +
            '   </div>' +
            '   <div class="idcard_detail" style="flex: 1;">' +
            '	    <div class="idcard_name" data-name="' + name + '">' + name + '</div>' +
            '	    <div class="idcard_name_in" data-name="' + name + '">' + checkin_text + '</div>' +
            '	    <div class="idcard_name_out" style="display:none" data-name="' + name + '">' + checkout_text + '</div>' +
            // '	    <div class="idcard_info">ID: <span class="idcard_info_id"></span> | CLASS V | SEC: BLUE | SPL SRU</div>' +
            '	    <div class="idcard_info">ID: <span class="idcard_info_id"></span></div>' +
            (user_role != 'Public User' ? '<div class="idcard_filled">Filled by ' + r.filled_by + '</div>' : '') +
            (user_role != 'Public User' ?
                '	    <div class="idcard_check">' +
                '		    CHECK-IN: <span class="idcard_check_in">' + (r.checkin ? moment(r.checkin).format('hh:mmA') : '') + '</span>' +
                ' 	        | CHECK-OUT: <span class="idcard_check_out">' + (r.checkout ? moment(r.checkout).format('hh:mmA') : '') + '</span>' +
                '       </div>' :
                r.checkin ?
                '	    <div class="idcard_check">' +
                '		    CHECK-IN at <span class="idcard_check_in">' + (r.checkin ? moment(r.checkin).format('hh:mmA') : '') + '</span>' +
                ' 	        in <span class="idcard_check_location">' + (r.checkin_location ? r.checkin_location : '') + '</span>' +
                '       </div>' : '') +

            '	    <div class="idcard_btn" style="display:none">' +
            '		    <div class="cancel idcard_btn_allow idcard_check_btn" id="btn_check_in" onclick="student_checkin_allow(event)"><span style="display: table-cell;vertical-align: middle;">ALLOW</span></div>' +
            '		    <div class="cancel idcard_btn_deny idcard_check_btn" onclick="student_checkin_deny(event)"><span style="display: table-cell;vertical-align: middle;">DENY</span></div>' +
            '		    <div class="cancel idcard_btn_checkout idcard_check_btn" onclick="student_check_out(event)"><span style="display: table-cell;vertical-align: middle;">CHECK-OUT</span></div>' +
            '		    <div class="cancel idcard_btn_cancel idcard_check_btn" onclick="student_checkin_cancel(event)"></div>' +
            '	    </div>' +
            '	    <div class="idcard_deny" style="display:none">DO NOT ALLOW TO CHECK-IN</div>' +
            '	    <div class="idcard_valid" style="display:none"></div>' +
            '   </div>' +
            '</div>')
    
    $('#idcard_main_' + id).find('.idcard_info_id').text(r.roll_number);
    $('#idcard_main_' + id).find('.idcard_img').attr('src', file_server + 'profile-pic/Photos/' + r.student_img);
    $('#idcard_main_' + id).css('display', 'flex');

    if (r.answer_result == 'no') {
        if (!r.checkin_set) r.checkin_set = [];
        if (!r.checkout_set) r.checkout_set = [];

        $('#idcard_main_' + id).attr({
            'checkin_set': r.checkin_set.length,
            'checkout_set': r.checkout_set.length
        });

        if ($('#idcard_main_' + id).attr('checkin_set') != ($('#idcard_main_' + id).attr('checkout_set'))) {
            $('#idcard_main_' + id).css('background', '#70AD47');

            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').hide();
            $('#idcard_main_' + id).find('.idcard_name_out').show();

            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_deny').hide();
            $('#idcard_main_' + id).find('.idcard_btn').hide();
            $('#idcard_main_' + id).find('.idcard_check').show();

        } else {
            $('#idcard_main_' + id).css('background', '#70AD47');
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').show();
            $('#idcard_main_' + id).find('.idcard_name_out').hide();
            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_deny').hide();
            $('#idcard_main_' + id).find('.idcard_btn').hide();
            $('#idcard_main_' + id).find('.idcard_check').show();

        }



    } else if (r.answer_result == 'yes') {
        $('#idcard_main_' + id).css('background', '#ED7D31');
        $('#idcard_main_' + id).find('.idcard_name').show();
        $('#idcard_main_' + id).find('.idcard_name_in').hide();
        $('#idcard_main_' + id).find('.idcard_name_out').hide();
        $('#idcard_main_' + id).find('.idcard_info').show();
        $('#idcard_main_' + id).find('.idcard_filled').show();
        $('#idcard_main_' + id).find('.idcard_deny').show();
        $('#idcard_main_' + id).find('.idcard_btn').hide();
        $('#idcard_main_' + id).find('.idcard_check').hide();
    }

}

function getActiveStuff() {
    var campus_input = $('#search_campus_input').val();
    var start_date = $('#filter_start_date').val();
    var end_date = $('#filter_end_date').val();
    var dateObj = {};
    if (start_date) dateObj.start_date = moment(start_date).startOf('day').unix();
    if (end_date) dateObj.end_date = moment(end_date).endOf('day').unix();

    $.ajax({
        url: '/covid/get_report_today',
        type: "POST",
        data: {
            user: {
                campus: campus_input,
                company_id:company_id
                // student_name: student_input,
            },
            // user_campus: user_campus,
            date: dateObj
        },
        dataType: "JSON",
        success: function(data) {
            console.log('get_report__today', data);
            // debugger;
            $('#box_idcard').empty();
            stats_green = 0;
            stats_yellow = 0;
            stats_checkin = 0;
            stats_deny = 0;
            status_total = 0;

            if (data.res1) {
                if (data.res1.length) {
                    for (let r of data.res1) {
                        drawCardLayout(r, '#box_idcard',false,false);
                    }
                    $('#box_nofound').hide();
                } else {
                    $('#box_nofound').show();

                }
            }
            $('#report').show();

            if (user_role == 'Admin User') {
                // $('#box_idcard').hide();
                $('#box_admin_counters').css('display', 'grid');
                $('#report_count_total').text(status_total);
                $('#report_count_green').text(stats_green);
                $('#report_count_yellow').text(stats_yellow);
                $('#report_count_checkin').text(stats_checkin);
                $('#report_count_deny').text(stats_deny);
                $('#report_count_red').text(user_list.length - data.res1.length);
                view_idcard_default();
                start_covid_form('xls');
                start_covid_form('pdf');
            }
        },
        error: function(err) {
            console.log(462, err);
            alert('No Response');
        }
    });
}

function student_checkin_cancel(e) {
    // //debugger
    e.preventDefault();
    e.stopPropagation();
    var id = $(e.currentTarget).parents('.idcard_main').attr('data-id');
    $('#idcard_main_' + id).find('.idcard_btn').hide();
    $('#idcard_main_' + id).find('.idcard_propic').show();

    if ($('#idcard_main_' + id).attr('covid-status') == 'yes') {
        $('#idcard_main_' + id).find('.idcard_name').show();
        $('#idcard_main_' + id).find('.idcard_name_in').hide();
        $('#idcard_main_' + id).find('.idcard_name_out').hide();

        $('#idcard_main_' + id).find('.idcard_info').show();
        $('#idcard_main_' + id).find('.idcard_filled').show();
        $('#idcard_main_' + id).find('.idcard_check').hide();

        $('#idcard_main_' + id).find('.idcard_deny').show();
        $('#idcard_main_' + id).find('.idcard_valid').hide();
    
    } else {
        if ($('#idcard_main_' + id).attr('checkin_set') != ($('#idcard_main_' + id).attr('checkout_set'))) {
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').hide();
            $('#idcard_main_' + id).find('.idcard_name_out').show();

            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_check').show();

            $('#idcard_main_' + id).find('.idcard_deny').hide();
            $('#idcard_main_' + id).find('.idcard_valid').hide();
        } else {
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').show();
            $('#idcard_main_' + id).find('.idcard_name_out').hide();

            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_check').show();

            $('#idcard_main_' + id).find('.idcard_deny').hide();
            $('#idcard_main_' + id).find('.idcard_valid').hide();
        }

    }
}

function student_checkin_allow(e) {
    // debugger
    e.preventDefault();
    e.stopPropagation();
    var id = $(e.currentTarget).parents('.idcard_main').attr('data-id');

    $.ajax({
        url: '/covid/checkin',
        type: "POST",
        data: {
            student_id: $(e.currentTarget).parents('.idcard_main').attr('student-id'),
            row_id: $(e.currentTarget).parents('.idcard_main').attr('row-id'),
            user_campus: user_campus,
            company_id: company_id
        },
        dataType: "JSON",
        success: function(res) {
            console.log(res);
            // debugger;
            $('#idcard_main_' + id).find('.idcard_btn').hide();
            $('#idcard_main_' + id).attr('covid-status', 'no');
            $('#idcard_main_' + id).css('background', '#70AD47'); // 
            $('#idcard_main_' + id).find('.idcard_check_in').text(moment(res.checkin_date).format('hh:mmA'));
            $('#idcard_main_' + id).attr('data-checkin-time',res.checkin_date);
            $('#idcard_main_' + id).find('.idcard_check').show();

            $('#idcard_main_' + id).find('.idcard_name_out').show();
            $('#idcard_main_' + id).find('.idcard_name_in').hide();
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_propic').show();


            $('#idcard_main_' + id).attr({
                'checkin_set': parseInt($('#idcard_main_' + id).attr('checkin_set')) + 1,
            });
            // searchStudentsCampus(false);
        },
        error: function(err) {
            console.log(462, err);
        }
    });


}

function student_check_out(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(e.currentTarget).parents('.idcard_main').attr('data-id');
    $.ajax({
        url: '/covid/checkout',
        type: "POST",
        data: {
            student_id: $(e.currentTarget).parents('.idcard_main').attr('student-id'),
            row_id: $(e.currentTarget).parents('.idcard_main').attr('row-id'),
            user_campus: user_campus,
            company_id: company_id
        },
        dataType: "JSON",
        success: function(res) {
            $('#idcard_main_' + id).attr('covid-status', 'no');
            $('#idcard_main_' + id).css('background', '#70AD47');
            $('#idcard_main_' + id).find('.idcard_check_out').text(moment(res.checkout_date).format('hh:mmA'));
            $('#idcard_main_' + id).attr('data-checkout-time',res.checkout_date);
            $('#idcard_main_' + id).find('.idcard_check').show();
            $('#idcard_main_' + id).find('.idcard_btn').hide();

            $('#btn_check_out').hide();

            $('#idcard_main_' + id).find('.idcard_name_out').hide();
            $('#idcard_main_' + id).find('.idcard_name_in').show();
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_propic').show();
            $('#idcard_main_' + id).find('.idcard_info').show();

            $('#idcard_main_' + id).attr({
                'checkout_set': parseInt($('#idcard_main_' + id).attr('checkout_set')) + 1,
            });
            // searchStudentsCampus(false);
        },
        error: function(err) {
            console.log(462, err);
        }
    });
}

function student_checkin_deny(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(e.currentTarget).parents('.idcard_main').attr('data-id');

    $.ajax({
        url: '/covid/checkin_deny',
        type: "POST",
        data: {
            student_id: $(e.currentTarget).parents('.idcard_main').attr('student-id'),
            row_id: $(e.currentTarget).parents('.idcard_main').attr('row-id'),
            company_id: company_id
        },
        dataType: "JSON",
        success: function(res) {
            console.log(res);
            $('#idcard_main_' + id).attr('covid-status', 'yes');
            $('#idcard_main_' + id).css('background', '#ED7D31');
            $('#idcard_main_' + id).find('.idcard_name').show();
            $('#idcard_main_' + id).find('.idcard_name_in').hide();
            $('#idcard_main_' + id).find('.idcard_name_out').hide();
            $('#idcard_main_' + id).find('.idcard_deny').show();
            $('#idcard_main_' + id).find('.idcard_btn').hide();
            $('#idcard_main_' + id).find('.idcard_check').hide();

            $('#idcard_main_' + id).find('.idcard_info').show();
            $('#idcard_main_' + id).find('.idcard_filled').show();
            $('#idcard_main_' + id).find('.idcard_propic').show();
            // searchStudentsCampus(false);


        },
        error: function(err) {
            console.log(462, err);
        }
    });

}



$("#agreement").change(function() {
    if ($(this).is(':checked')) {
        $('#submitBtn').removeClass('submitDisable')
    } else {
        $('#submitBtn').addClass('submitDisable')
    }
});



function reset_question_form() {
    // $("#question_list li").each(function (idx, li) { // main li loop

    // });
    $("#question_list li").css('display', 'none');
    $("#question_list .question").css('display', '');
    $("#question_list .grey").css('display', '');
    $('.right-input label').css('pointer-events', '');
}


function next_covid_btn(e) {

    e.preventDefault();
    scanner.stop();
    $('.question-head').css('vertical-align', '');
    $('#form_qrcode').hide();
    $('#survey_back_btn').hide();
    $('#question_list').removeClass('disabled');
    $('#form_id').hide();

    if ($(e.currentTarget).text() == 'NEXT') {
        $('#form_start').hide();
        $('#form_survey').show();
        $('#form_report').hide();

        var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
        cq++;
        reset_question_form();
        if ($('#ques' + cq).attr('data-chk') == 'true') {
            $('.right-input label').css('pointer-events', '').show();
        } else {
            $('.right-input label').css('pointer-events', 'none').hide();
        }
        // $('#ques' + cq).show();

        if (cq == 9) { // review form
            $('.survey_action_btn').hide();
            $('#survey_action_btn').show();
            $('.right-input label').css('pointer-events', '').show();
            $('.right-input input').attr('disabled', 'disabled');
            $('.start_survey_form').hide();
            $('.review_survey_form').show();

            $('.question-result').show();

            $('.question').removeClass('hideinput');
            $('.grey').hide();
            $('.question-head').css('vertical-align', 'middle');
            $('#form_qrcode').hide();
            chkcount = 0;

            $("#question_list li").each(function(idx, li) { // main li loop
                // debugger
                var chksub = 0;
                if ($(li).find('.question').length > 1) { // multiple questions 5no
                    // alert($(li).find('input:checked').length);
                    $(li).find('.question').each(function(idx, qs) {
                        if ($(qs).find('input:checked').val()) {
                            $(qs).show();
                            $(li).show();
                            chkcount += 1;
                            chksub += 1;
                        } else {
                            $(qs).hide();
                            if (chksub == 0) $(li).hide();
                        };
                    });
                } else { // single question
                    if ($(li).find('input:checked').val()) {
                        $(li).show();
                        chkcount += 1;
                    } else {
                        $(li).hide();
                    };
                }
            });
            $('#survey_back_btn').show();
            $('#question_list').addClass('disabled');

            $('#form_start').hide();
            $('#form_survey').show();
            $('#form_report').hide();

            $('#form_id').hide();
            $('#ques8').show();
        } else if (cq < 9) {
            $('#survey_action_btn').hide();
            $('#ques' + cq).show();
            $('.question-result').hide();
            $('.right-input input').removeAttr('disabled');

            $('.btnAlign').addClass('btnGrid');
        } else if (cq < 2) {
            $('.right-input input').removeAttr('disabled');
            $('.question-result').hide();
            $('#survey_action_btn').hide();
            // $('.question').removeClass('hideinput');
            // $('.right-input label').css('pointer-events', '');
            $('#submit_covid_div').show();
            // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
            $('.btnAlign').removeClass('btnGrid');
        }
    } else if ($(e.currentTarget).text() == 'YES') {
        $('#form_start').hide();
        $('#form_survey').show();
        $('#form_report').hide();
        $('.question-result').hide();
        $('.right-input input').removeAttr('disabled');

        var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
        $('#ques' + cq).find('input[type="checkbox"]').prop('checked', true);
        $('#ques' + cq).find('.question-result').text('YES');
        cq++;
        reset_question_form();
        if ($('#ques' + cq).attr('data-chk') == 'true') {
            $('.right-input label').css('pointer-events', '').show();
        } else {
            $('.right-input label').css('pointer-events', 'none').hide();
        }
        // $('#ques' + cq).show();

        if (cq == 9) {
            $('.right-input input').removeAttr('disabled');
            reset_question_form();
            $("#form_survey").submit();

            // $('.start_survey_form').hide();
            // $('.review_survey_form').show();
            // $('.survey_action_btn').hide();
            // $('#survey_action_btn').show();

            // $('.question').removeClass('hideinput');
            // $('.grey').hide();
            // $('.question-head').css('vertical-align', 'middle');
            // $('#form_qrcode').hide();
            // chkcount = 0;
            // chksub = 0;
            // $("#question_list li").each(function(idx, li) { // main li loop
            //     if ($(li).find('.question').length > 1) { // multiple questions 5no
            //         $(li).find('.question').each(function(idx, qs) {
            //             if ($(qs).find('input:checked').val()) {
            //                 $(qs).show();
            //                 $(li).show();
            //                 chkcount += 1;
            //                 chksub += 1;
            //             } else {
            //                 $(qs).hide();
            //                 if (chksub == 0) $(li).hide();
            //             };
            //         });
            //     } else { // single question
            //         if ($(li).find('input:checked').val()) {
            //             $(li).show();
            //             chkcount += 1;
            //         } else {
            //             $(li).show();
            //         };
            //     }
            // });
            // $('#survey_back_btn').show();
            // $('#question_list').addClass('disabled');

            // $('#form_start').hide();
            // $('#form_survey').show();
            // $('#form_report').hide();

            // $('#form_id').hide();
        } else if (cq < 9) {
            $('#survey_action_btn').hide();
            // $('.right-input label').css('pointer-events', 'none').hide();
            // $('.question').addClass('hideinput');
            $('#ques' + cq).show();
            // $('#submit_covid_btn').text('YES')
            // $('#submit_covid_div').addClass('back_covid_res').show();
            // $('#no_covid_btn').text('NO')
            // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
            $('.btnAlign').addClass('btnGrid');


        } else if (cq < 2) {
            $('#survey_action_btn').hide();
            $('.question').removeClass('hideinput');
            // $('.right-input label').css('pointer-events', '');
            // $('#submit_covid_btn').text('NEXT')
            $('#submit_covid_div').show();
            // $('#no_covid_btn').text('NO')
            // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
            $('.btnAlign').removeClass('btnGrid');

        }

    } else if ($(e.currentTarget).text() == 'NO') {
        $('#form_start').hide();
        $('#form_survey').show();
        $('#form_report').hide();
        $('.question-result').hide();
        $('.right-input input').removeAttr('disabled');

        var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
        $('#ques' + cq).find('input[type="checkbox"]').prop('checked', false);
        $('#ques' + cq).find('.question-result').text('NO');
        cq++;
        reset_question_form();
        if ($('#ques' + cq).attr('data-chk') == 'true') {
            $('.right-input label').css('pointer-events', '').show();
        } else {
            $('.right-input label').css('pointer-events', 'none').hide();
        }
        $('.question-head').css('vertical-align', '');

        if (cq == 9) {
            $('.right-input input').removeAttr('disabled');
            reset_question_form();
            $("#form_survey").submit();

            // $('.start_survey_form').hide();
            // $('.review_survey_form').show();
            // $('.survey_action_btn').hide();
            // $('#survey_action_btn').show();

            // // $('#submit_covid_div').removeClass('back_covid_res').show();
            // // $('#no_covid_div').removeClass('back_covid_res').show();
            // // $('.right-input label').css('pointer-events', 'none').show();
            // $('.question').removeClass('hideinput');
            // $('.grey').hide();
            // $('.question-head').css('vertical-align', 'middle');
            // $('#form_qrcode').hide();
            // chkcount = 0;
            // chksub = 0;
            // $("#question_list li").each(function(idx, li) { // main li loop
            //     if ($(li).find('.question').length > 1) { // multiple questions 5no
            //         $(li).find('.question').each(function(idx, qs) {
            //             if ($(qs).find('input:checked').val()) {
            //                 $(qs).show();
            //                 $(li).show();
            //                 chkcount += 1;
            //                 chksub += 1;
            //             } else {
            //                 $(qs).show();
            //                 if (chksub == 0) $(li).show();
            //             };
            //         });
            //     } else { // single question
            //         if ($(li).find('input:checked').val()) {
            //             $(li).show();
            //             chkcount += 1;
            //         } else {
            //             $(li).show();
            //         };
            //     }
            // });
            // $('#survey_back_btn').show();
            // $('#question_list').addClass('disabled');

            // $('#form_start').hide();
            // $('#form_survey').show();
            // $('#form_report').hide();

            // $('#form_id').hide();

        } else if (cq < 9) {
            $('#survey_action_btn').hide();
            // $('.right-input label').css('pointer-events', 'none').hide();
            // $('.question').addClass('hideinput');
            $('#ques' + cq).show();
            // $('#submit_covid_btn').text('YES')
            // $('#submit_covid_div').addClass('back_covid_res').show();
            // $('#no_covid_btn').text('NO')
            // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
            $('.btnAlign').addClass('btnGrid');


        } else if (cq < 2) {
            $('#survey_action_btn').hide();
            $('.question').removeClass('hideinput');
            // $('.right-input label').css('pointer-events', '').show();
            // $('#submit_covid_btn').text('NEXT');
            $('#submit_covid_div').show()
                // $('#no_covid_btn').text('NO')
                // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
            $('.btnAlign').removeClass('btnGrid');

        }

    } else if ($(e.currentTarget).text() == 'SUBMIT') {
        $('.right-input input').removeAttr('disabled');
        reset_question_form();
        $("#form_survey").submit();
    } else if ($(e.currentTarget).text() == 'RE-TAKE SCREENING') {
        debugger
        $('.start_survey_form').show();
        $('.review_survey_form').hide();
        $('.question-result').hide();
        $('.right-input input').removeAttr('disabled');

        $('.survey_action_btn').show();
        $('#survey_action_btn').hide();

        reset_question_form();
        $('#ques1').show();
        $('.survey_action_btn').show();
        if ($('#ques1').attr('data-chk') == 'true') {
            $('.right-input label').css('pointer-events', '').show();
        } else {
            $('.right-input label').css('pointer-events', 'none').hide();
        }


        $('#submit_covid_btn').addClass('disable').show();
        // $('#no_covid_btn').text('NO')
        // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
        $('.btnAlign').removeClass('btnGrid');


        $('#form_survey').trigger("reset");
        $('#covid_report').removeClass('sideActive selected');

        $('#conversation_list_sidebar li').removeClass('sideActive selected');

        $('#form_start').hide();
        $('#form_survey').show();
        $('#form_report').hide();
        $('#report').hide();


        scanner.stop()
    }
    // else if ($(e.currentTarget).text() == 'Review') {
    //     // //debugger;
    //     $('.grey').hide();
    //     $('#form_qrcode').hide();
    //     chkcount = 0;
    //     chksub = 0;
    //     $("#question_list li").each(function(idx, li) { // main li loop
    //         if ($(li).find('.question').length > 1) { // multiple questions 5no
    //             $(li).find('.question').each(function(idx, qs) {
    //                 if ($(qs).find('input:checked').val()) {
    //                     $(qs).show();
    //                     $(li).show();
    //                     chkcount += 1;
    //                     chksub += 1;
    //                 } else {
    //                     $(qs).hide();
    //                     if (chksub == 0) $(li).hide();
    //                 };
    //             });
    //         } else { // single question
    //             if ($(li).find('input:checked').val()) {
    //                 $(li).show();
    //                 chkcount += 1;
    //             } else {
    //                 $(li).hide();
    //             };
    //         }
    //     });
    //     $('#survey_back_btn').show();
    //     $('#question_list').addClass('disabled');

    //     $('#form_start').hide();
    //     $('#form_survey').show();
    //     $('#form_report').hide();
    //     $('#submit_covid_btn').text('SUBMIT');
    //     $('#submit_covid_div').show();
    //     $('#form_id').hide();
    // } 


}
function viewIDcard(content) {
    // alert(content);
    var dateObj = {
        '$gte': String(moment().startOf('day').unix()),
        '$lte': String(moment().endOf('day').unix())
    };

    // scanner.stop();
    // if (user_role == 'Stuff User') {
    $.ajax({
        url: '/covid/read_qrcode',
        type: "POST",
        data: {
            qrcode: content,
            date: dateObj
        },
        success: function(data) {
            console.log('read_qrcode',data);
            
            if (data.msg == "success") {
                $('#box_idcard').empty();
                $('#search_student_input').val(data.user_info.student_name);
                if (user_role != 'Admin User') $('.leftContent').hide();
                if (user_role == 'Admin User') close_searchForm()
                    // $('#box_idcard').append('<div id="box_scan_propic" class="option-box">' +
                    //     '<img src="https://wfss001.freeli.io/profile-pic/Photos/' + data.user_info.student_img + '">' +
                    //     '</div>');
                drawCardLayout(data.user_info, '#box_idcard', true);
                start_covid_form('xls');
                start_covid_form('pdf');

                $('#form_id').hide();
                // if(user_role == 'Admin User' && page_type=='qr') $('.report_head').hide();
                $('#report').show();
                $('#form_start').hide();
                $('#form_survey').hide();
                $('#form_report').hide();
                $('#submit_covid_div').hide();
                $('#form_qrcode').hide();
                $('#box_nofound').hide();
                $('#box_admin_counters').hide();
                // ==================================
                // //debugger
                
                $('#qr_student_name').text(data.user_info.student_name);
                $('#qr_student_id').text(data.user_info.id);
                $('#qr_student_email').text(data.user_info.email);
                $('#clear_search_input').show();
                if (data.user_info.checkin) {
                    $('#btn_check_in').hide();
                }
                if (data.user_info.checkout) {
                    $('#btn_check_out').hide();
                }

                // $('#box_survey_qrcode').show();

                if (data.user_info.answer_result == 'yes') {
                    $('#qr_status').text('POSITIVE').css({
                        'background': 'red',
                        'color': 'white'
                    })
                    $('.submitBtn').hide();

                } else {
                    $('#qr_status').text('NEGATIVE').css({
                        'background': 'green',
                        'color': 'white'
                    });
                    $('.submitBtn').show();

                }
                // $('#box_scan_propic').show();
                // $('#box_scan_propic img').attr('src','https://wfss001.freeli.io/profile-pic/Photos/'+data.user_info.student_img);

                // $('#box_survey_finish').show();
            } else if (data.msg == "nodata") {
                $('#warnignMsgText').text('Survey not found.');
                $('#warningsPopup').css('display', 'flex');
                // reset_question_form();
                // $('#survey_back_btn').hide();
                // $('#submit_covid_btn').text('Review').show();
                // $('#question_list').removeClass('disabled');
                // $('#form_survey').trigger("reset");
                // $('#covid_report').removeClass('sideActive selected');

                // $('#student_id_form').val(content);

                // $('#form_start').hide();
                // $('#form_survey').show();
                // $('#form_report').hide();
                // $('#report').hide();
                // $('#form_id').hide();
                // $('#form_qrcode').hide();
            } else {
                $('#warnignMsgText').text('User not found.');
                $('#warningsPopup').css('display', 'flex');

            }

        },
        complete: function() {
            console.log('process complete');
        },
        error: function(err) {
            console.log('process error', err);
        }
    });

    // }

}
function back_covid_btn(e) {
    // debugger
    e.preventDefault();
    scanner.stop();
    if ($('#form_qrcode').is(':visible')) {
        if (page_type == 'scan' || page_type == 'report') {
            start_covid_form('search')

        } else {
            if (user_role == 'Public User') {
                window.open('/covid/public', '_self');
            } else {
                window.open('/covid/mobile', '_self');
            }
        }
    } else if ($('#form_id').is(':visible')) {
        $('#form_start').show();
        $('#form_survey').hide();
        $('#form_report').hide();
        $('#report').hide();
        $('#form_id').hide();
        $('#form_qrcode').hide();

    } else if ($('#form_start').is(':visible')) {
        if (user_role == 'Public User') {
            window.open('/covid/public', '_self');
        } else {
            window.open('/covid/mobile', '_self');
        }
    } else if ($('#report').is(':visible')) {

        if (user_role == 'Public User') {
            window.open('/covid/public', '_self');
        } else {
            window.open('/covid/mobile', '_self');
        }
    } else if ($('#form_report').is(':visible')) {
        if (user_role == 'Public User') {
            window.open('/covid/public', '_self');
        } else {
            window.open('/covid/mobile', '_self');
        }
    } else if ($('#form_addparent').is(':visible')) {
        $('#form_start').show();
        $('#form_survey').hide();
        $('#form_report').hide();
        $('#report').hide();
        $('#form_id').hide();
        $('#form_qrcode').hide();
        $('#form_addparent').hide();

    } else if ($('#form_survey').is(':visible')) {
        $('.right-input input').removeAttr('disabled');

        var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));

        $('.question-head').css('vertical-align', '');
        $('.question-result').hide();

        if ($('.action_covid_btn:visible').text() == 'SUBMIT') {
            debugger
            reset_question_form();

            // $('#ques' + cq).hide();
            // cq--;
            $('.start_survey_form').show();
            $('.review_survey_form').hide();
            $('.survey_action_btn').show();
            $('#survey_action_btn').hide();
            $('.right-input input').removeAttr('disabled');
            $('#ques1').hide();
            $('#ques8').show();
            if ($('#ques8').attr('data-chk') == 'true') {
                $('.right-input label').css('pointer-events', '').show();
            } else {
                $('.right-input label').css('pointer-events', 'none').hide();
            }

            // if (cq == 0) {
            //     start_covid_form('start');
            // } else if (cq > 1) {
            //     $('#ques8').show();
            //     if($('#ques' + cq).attr('data-chk') == 'true'){
            //         $('.right-input label').css('pointer-events', '').show();
            //     }else{
            //         $('.right-input label').css('pointer-events', 'none').hide();
            //     }
            //     // $('.question').addClass('hideinput');

            //     // $('#submit_covid_btn').text('YES')
            //     // $('#submit_covid_div').addClass('back_covid_res').show();
            //     // $('#no_covid_btn').text('NO')
            //     // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
            //     $('.btnAlign').addClass('btnGrid');


            // } else {
            //     $('.right-input label').css('pointer-events', '').show();
            //     $('.question').removeClass('hideinput');
            //     reset_question_form();
            //     $('#ques' + cq).show();
            //     if($('#ques' + cq).attr('data-chk') == 'true'){
            //         $('.right-input label').css('pointer-events', '').show();
            //     }else{
            //         $('.right-input label').css('pointer-events', 'none').hide();
            //     }
            //     // $('#submit_covid_btn').text('NEXT')
            //     // $('#submit_covid_div').removeClass('back_covid_res').show();
            //     // $('#no_covid_btn').text('NO')
            //     // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
            //     $('.btnAlign').removeClass('btnGrid');

            // }

            $('#survey_back_btn').hide();
            $('#question_list').removeClass('disabled');

            $('#form_start').hide();
            $('#form_survey').show();
            $('#form_report').hide();
            // $('#submit_covid_btn').text('Review').show();
            // $('#submit_covid_btn').text('YES')
            // $('#submit_covid_div').addClass('back_covid_res').show();
            // $('#no_covid_btn').text('NO')
            // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
            $('.btnAlign').addClass('btnGrid');

        } else if ($('.action_covid_btn:visible').text() == 'NEXT') {
            // //debugger
            $('#survey_back_btn').hide();
            $('#question_list').removeClass('disabled');

            // var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
            $('#ques' + cq).hide();
            cq--;
            if (cq == 0) {
                start_covid_form('start');
            } else if (cq > 1) {
                $('.right-input label').css('pointer-events', 'none').hide();
                // $('.question').addClass('hideinput');
                $('#ques' + cq).show();
                if ($('#ques' + cq).attr('data-chk') == 'true') {
                    $('.right-input label').css('pointer-events', '').show();
                } else {
                    $('.right-input label').css('pointer-events', 'none').hide();
                }
                // $('#submit_covid_btn').text('YES')
                // $('#submit_covid_div').addClass('back_covid_res').show();
                // $('#no_covid_btn').text('NO')
                // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
                $('.btnAlign').addClass('btnGrid');


            } else {
                reset_question_form();
                $('.question').removeClass('hideinput');
                $('#ques' + cq).show();
                if ($('#ques' + cq).attr('data-chk') == 'true') {
                    $('.right-input label').css('pointer-events', '').show();
                } else {
                    $('.right-input label').css('pointer-events', 'none').hide();
                }
                // $('#submit_covid_btn').text('NEXT')
                // $('#submit_covid_div').removeClass('back_covid_res').show();
                // $('#no_covid_btn').text('NO')
                // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
                $('.btnAlign').removeClass('btnGrid');

            }

        } else if ($('.action_covid_btn:visible').text() == 'YES') {
            $('#survey_back_btn').hide();
            $('#question_list').removeClass('disabled');
            // var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
            $('#ques' + cq).hide();
            cq--;
            if (cq == 0) {
                start_covid_form('start');
            } else if (cq > 1) {
                $('.right-input label').css('pointer-events', 'none').hide();
                // $('.question').addClass('hideinput');
                $('#ques' + cq).show();
                if ($('#ques' + cq).attr('data-chk') == 'true') {
                    $('.right-input label').css('pointer-events', '').show();
                } else {
                    $('.right-input label').css('pointer-events', 'none').hide();
                }
                // $('#submit_covid_btn').text('YES')
                // $('#submit_covid_div').addClass('back_covid_res').show();
                // $('#no_covid_btn').text('NO')
                // $('#no_covid_div').addClass('back_covid_res').removeClass('retake').show();
                $('.btnAlign').addClass('btnGrid');


            } else {
                $('.question').removeClass('hideinput');
                $('.right-input label').css('pointer-events', '').show();
                reset_question_form();
                $('#ques' + cq).show();
                if ($('#ques' + cq).attr('data-chk') == 'true') {
                    $('.right-input label').css('pointer-events', '').show();
                } else {
                    $('.right-input label').css('pointer-events', 'none').hide();
                }
                // $('#submit_covid_btn').text('NEXT')
                // $('#submit_covid_div').removeClass('back_covid_res').show();
                // $('#no_covid_btn').text('NO')
                // $('#no_covid_div').removeClass('back_covid_res').removeClass('retake').hide();
                $('.btnAlign').removeClass('btnGrid');

            }
        }
        // else if ($('#submit_covid_btn').text() == 'Review') {
        // 	// reset_question_form();

        // 	$('#survey_back_btn').hide();
        // 	$('#question_list').removeClass('disabled');

        // 	$('#form_start').hide();
        // 	$('#form_survey').show();
        // 	$('#form_report').hide();

        // 	var cq = parseInt($('#question_list li:visible').attr('id').replace(/^\D+/g, ''));
        // 	$('#ques' + cq).hide();
        // 	cq--;
        // 	if (cq == 0) {

        // 		start_covid_form(e, 'start');
        // 	} 
        // 	else if (cq > 1) {
        // 		$('#ques' + cq).show();
        // 		$('#submit_covid_btn').text('Yes').show().addClass('back_covid_res');
        // 		$('.back_covid_btn').text('No').show().addClass('back_covid_res');

        // 	}
        // 	else {
        // 		reset_question_form();
        // 		$('#ques' + cq).show();
        // 		$('#submit_covid_btn').text('Next').show().removeClass('back_covid_res');
        // 		$('.back_covid_btn').text('No').hide().removeClass('back_covid_res');
        // 	}
        // 	// $('#submit_covid_btn').text('Next').show();
        // }
    }


}




// function searchStudents() {
//     var txt = $('#search_student_input').val();
//     if (txt) {
//         $.ajax({
//             url: '/covid/search_student',
//             type: "POST",
//             data: {
//                 txt: txt
//             },
//             success: function(data) {
//                 console.log('sssrr', data);
//                 $('#report_table_body').empty();
//                 $('#close_student_input').css('visibility', 'visible');
//                 if (data.getuser.length > 0) {
//                     for (let r of data.getuser) {
//                         // if(r.checkin && r.checkout){
//                         $('#report_table_body').append('<tr onclick="viewIDcard(\'' + r.id + '\')" student-id="' + r.id + '" class="report_list">' +
//                             '<td style="" title="' + r.fullname + '">' + r.fullname + '</td>' +
//                             '<td style="" title="campus">' + (r.campus ? r.campus : '') + '</td>' +
//                             '<td style="" class="checklisticon_vew">' + r.email + '</td>' +
//                             '<td >' + (r.checkin ? r.checkin : '') + '</td>' +
//                             '<td>' + (r.checkout ? r.checkout : '') + '</td>' +
//                             '<td class="rep_stid' + r.id + '" title="' + r.answer_result + '">' + (r.answer_result == 'yes' ? 'POSITIVE' : 'NEGATIVE') + '</td>' +
//                             '</tr>');
//                         if (r.answer_result == 'yes') {
//                             $('.rep_stid' + r.id).css({
//                                 'background': 'red',
//                                 'color': 'white'
//                             });
//                         } else {
//                             $('.rep_stid' + r.id).css({
//                                 'background': 'green',
//                                 'color': 'white'
//                             });
//                         }


//                     }
//                     // $('.report_table th').css({ 'fontSize': '1rem' });
//                     // $('.report_list td').css({ 'fontSize': '1rem' });
//                 }


//             },
//             complete: function() {
//                 console.log('process complete');
//             },
//             error: function(err) {
//                 console.log('process error', err);
//             }
//         });
//     }
// }