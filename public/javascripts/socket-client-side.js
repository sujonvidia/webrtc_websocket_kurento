var socket = io();
var onlineUserList = [];
bucket_name = 'hayven1';
var idleUsersList = [];
localstorage = [],
    localstorage['get_conversation_history'] = [];


var CONNECT = 1000;
var ROOM = 1001;
var ROOM_BROWSE = 1002;
var ROOM_CREATE = 1003;
var ROOM_LEAVE = 1004;
var ROOM_JOIN = 1005;
var ROOM_CLOSE = 1006;
var AUDIO_CALL = 1020;
var VIDEO_CALL = 1040;
var TAG = 1060;
var TAG_ADD = 1061;
var TAG_DELETE = 1062;
var TAG_ATTACHMENT = 1063;
var FILE = 1080;
var FILE_UPLOAD = 1081;
var CHECKLIST = 1100;
var CHECKLIST_CREATE = 1101;
var CHECKLIST_UPDATE = 1102;
var MSG = 1120;
var MSG_EMO_REPLY = 1121;
var MSG_FLAG = 1122;
var MSG_REPLY = 1123;
var MSG_SHARE = 1124;
var MSG_DELETE = 1125;
var MSG_EDIT = 1126;
var COTR = 1140;
var COTR_MUTE_NOTIFICATION = 1141;
var COTR_CLEAR_MESSAGES = 1142;
var COTR_FILTER = 1143;
var COTR_TEAM_LISTS = 1144;
var COTR_ADMIN_SETTINGS = 1145;
var COTR_USER_SETTINGS = 1146;
var COTR_CHANGE_PASSWORD = 1147;
var USER = 1160;
var USER_LISTS = 1161;
var USER_PROFILE_VIEW = 1162;
var USER_STATUS_CHANGE = 1163;
var USER_ROLE_CHANGE = 1164;
var USER_PERMISSION_UPDATE = 1165;
var USER_INFO_EDIT = 1166;
var USER_DELETE = 1167;
var USER_ADD = 1168;
var USER_PASS_RESET = 1169;
var ROLE = 1180;
var ROLE_ADD = 1181;
var ROLE_ACCESS_UPDATE = 1182;
var ROLE_REMOVE = 1183;
var TEAM = 1200;
var TEAM_ADD = 1201;
var TEAM_USER_MANAGE = 1202;
var TEAM_REMOVE = 1203;
var TEAM_ADMIN = 1204;
var FILE_MANAGE = 1220;
var CALLING = 1240;
var WORK_CAT = 1260;
var TASK = 1500;
var GUEST = 1600;
var MENTION_MESSAGE = 1601;
var ALL_MESSAGE = 1602;
var MESSAGE_AFTER_JOINED = 1603;
var COVID = 1700;
var COVID_ADMIN = 1701;
var COVID_STUFF = 1702;
var previouslyConnected = false; // sujon
var all_access_array = {
    '1000': 'Connect Page',
    '1001': 'Room',
    '1002': 'Show all my Rooms',
    '1003': 'Discussion Room Create',
    '1004': 'Leave from room',
    '1005': 'Join into room',
    '1006': 'Close room',
    '1020': 'Audio Call',
    '1040': 'Video Call',
    '1060': 'Tag',
    '1061': 'Tag Add',
    '1062': 'Tag Delete',
    '1063': 'Custom tag when attachment',
    '1080': 'File',
    '1081': 'Attachment upload',
    '1100': 'Checklist',
    '1101': 'Checklist create',
    '1102': 'Checklist update',
    '1120': 'Message',
    '1121': 'Emotion reply',
    '1122': 'Flag and unflag',
    '1123': 'Message reply',
    '1124': 'Message share',
    '1125': 'Message delete',
    '1126': 'Message edit',
    '1140': 'Connect Page Others',
    '1141': 'Mute Notification',
    '1142': 'Clear Messages',
    '1143': 'Filter By',
    '1144': 'Team lists',
    '1145': 'Admin Settings Button',
    '1146': 'User Settings Button',
    '1147': 'Change Password',
    '1160': 'User Management Tab',
    '1161': 'View User Lists',
    '1162': 'View Profile Details',
    '1163': 'Change status (Active/ Inactive)',
    '1164': 'Change role (SA/ Admin/ User)',
    '1165': 'Change User Permission',
    '1166': 'Edit User Info',
    '1167': 'Delete User',
    '1168': 'Create User',
    '1169': 'Reset Password',
    '1180': 'Role Management Tab',
    '1181': 'Add Role',
    '1182': 'Update Role Access',
    '1183': 'Remove Role',
    '1200': 'Team Management Tab',
    '1201': 'Create Team',
    '1202': 'Team Member Manage',
    '1203': 'Remove Team',
    '1204': 'Team Admin',
    '1220': 'File Management Tab',
    '1240': 'Calling',
    '1260': 'Work Category',
    '1500': 'TASK',
    '1600': 'GUEST',
    '1601': 'Mention Message',
    '1602': 'All Message',
    '1603': 'Message After Joined',
    '1700': 'COVID',
    '1701': 'COVID_ADMIN',
    '1702': 'COVID_STUFF'
};

function has_permission(user_id, access) {
    if (access_user_list) {
        for (var i = 0; i < access_user_list.length; i++) {
            if (access_user_list[i]['id'] === user_id) {
                return (access_user_list[i]['access'] && access_user_list[i]['access'].indexOf(access) > -1) ? true : false;
            }
        }
    }

    return false;
}

function change_permission(event) {
    event.stopImmediatePropagation();
    if (has_permission(user_id, USER_PERMISSION_UPDATE)) {
        var id = $("#UserProfileEmail").attr("data-id");
        if (id == undefined)
            id = $("#admin_userInfoUpdatePopup").attr("data-id");
        for (var i = 0; i < access_user_list.length; i++) {
            var acc = Number(event.target.value);
            if (access_user_list[i]['id'] === id) {

                var pos = (access_user_list[i]['access']).indexOf(acc);
                var type = false;
                if (event.target.checked && pos == -1) {
                    access_user_list[i]['access'].push(acc);
                    type = "add";
                } else if (!event.target.checked && pos > -1) {
                    access_user_list[i]['access'].splice(pos, 1);
                    type = "remove";
                }

                if (type !== false) {
                    socket.emit("change_access", { uid: id, access: acc, type: type }, (rep) => {
                        // console.log(rep);
                    });
                }
            }
        }
    } else {
        event.preventDefault();
        alert("Access denied");
    }
}

function update_role(event) {
    event.stopImmediatePropagation();
    if (has_permission(user_id, USER_ROLE_CHANGE)) {
        var role = $(event.target).attr('data-value');
        var uid = $(event.target).attr("data-uid");
        var etl = $(event.target).offset();
        $("#loadergif").css({ top: etl.top, left: etl.left }).show();
        socket.emit("update_role", { uid, role }, (rep) => {
            // console.log(rep);
            if (rep.status) {
                window.location.reload();
            }
        });
    } else {
        event.preventDefault();
        alert("Access denied");
    }
}

function editUserInfo(el,field,type){
    var bv = $(el).text();
    if(bv == 'Edit'){
        $('.edit_row').text('Edit');
        $('.userInfoField').removeAttr('contenteditable');
        $(el).text('Update');
        $('#'+field).attr('contenteditable',true);
        $('#'+field).focus();
        placeCaretAtEnd(document.getElementById(field));
    }else{
        $(el).text('Edit');
        $('#'+field).removeAttr('contenteditable');
        var id = $('#'+field).attr('data-id');
        var name = email = $('#'+field).text();
        if (type == 'name') {
            socket.emit('updateUserName',{id,name},function (res) {
                console.log(res);
                if(res.status){
                    $('#UserProfileName').text(name);
                }
            });
        }else{
            socket.emit('updateUserEmail',{id,email},function (res) {
                console.log(res);
            });
        }
    }
}
function userInfoOnBlur(e,el){
    $(el).focus();
}

var previous_role;
var select_index;
$(document).on("focus", ".role_options_cls", function() {
    previous_role = this.value;
    select_index = $(this).index();
    console.log(previous_role, select_index);
});

function cancel_user_role_from_um(from_where) {
    // $("select").eq(select_index).val(previous_role);
    $('#chageRolePopUpId').hide();
}
// var ind; var text;  
//   $("select").change(function(){
//     //$("select").eq(ind).val(text);

//   }).focus(function(){
//   	ind = $(this).index();
//     text = $(this).val();
//     console.log(ind,text);
//   });
// });

function update_user_role_pop_up_show(event, from_where) {
    if (from_where == 'from_user') {
        // console.log($(elem).find('option:selected'));
        // console.log($(event.target).find('option:selected'));  
        var role_id = $(event.target).find('option:selected').attr('data-role_id');
        var uid = $(event.target).find('option:selected').attr("data-uid");
        var role_name = $(event.target).find('option:selected').text();
        var user_name = $(event.target).closest('tr').find('td.fullName .usr_title').text();
        // console.log(role_id, '=', uid);
        // console.log(role_name, '=', user_name);
        $("#chageRolePopUpId .role-msg-con p").text("Are you sure, you want to save changes the role of user \"" + user_name + "\" as \"" + role_name + "\" ?");
        $("#chageRolePopUpId .changeRolePopupBody").attr("data-uid", uid).attr("data-role_id", role_id);
        $("#chageRolePopUpId .chg-role-btn-con .chg-role-btn").attr("onclick", "update_user_role_from_user_management('" + role_id + "', '" + uid + "')");
        $("#chageRolePopUpId .chg-role-btn-con .cancel-role-btn").attr("onclick", "cancel_user_role_from_um('" + from_where + "')");
        $("#chageRolePopUpId").show();
        // update_user_role_from_user_management(role_id, uid);
    } else if (from_where == 'from_role') {
        var role_id = $(event.target).find('option:selected').attr('data-role_id');
        var uid = $(event.target).find('option:selected').attr("data-uid");
        var role_name = $(event.target).find('option:selected').text();
        var user_name = $(event.target).closest('tr').find('td.fullName span').text();
        // console.log(role_id, '=', uid);
        // console.log(role_name, '=', user_name);
        $("#chageRolePopUpId .role-msg-con p").text("Are you sure, you want to save changes the role of user \"" + user_name + "\" as \"" + role_name + "\" ?");
        $("#chageRolePopUpId .changeRolePopupBody").attr("data-uid", uid).attr("data-role_id", role_id);
        $("#chageRolePopUpId .chg-role-btn-con .chg-role-btn").attr("onclick", "update_user_role_from_user_management('" + role_id + "', '" + uid + "')");
        $("#chageRolePopUpId .chg-role-btn-con .cancel-role-btn").attr("onclick", "cancel_user_role_from_um('" + uid + "','" + from_where + "')");
        $("#chageRolePopUpId").show();
    } else {}
}

function update_user_role_from_user_management(role_id, uid) {
    if (has_permission(user_id, USER_ROLE_CHANGE)) {
        socket.emit("update_user_role_from_um", { uid, role_id }, (res) => {
            // console.log(rep);
            if (res.status) {
                // console.log('kallol', res.status);
                // alert("Role changed successfully.");
                $("#chageRolePopUpId").hide();
                var sucMsg = "Role changed successfully.";
                success_msg_for_admin_setting(sucMsg);
            }
        });
    } else {
        var sucMsg = "Access denied.";
        warning_msg_for_admin_setting(sucMsg);
    }
}

function get_user_info_obj(id) {
    for (var i = 0; i < access_user_list.length; i++) {
        if (access_user_list[i]['id'] === id) {
            var userData = {
                email: access_user_list[i].email,
                fullname: (access_user_list[i].is_delete == 0) ? access_user_list[i].fullname : access_user_list[i].fullname + '[Deleted]',
                id: access_user_list[i].id,
                img: access_user_list[i].img,
                designation: access_user_list[i].designation,
                dept: access_user_list[i].dept,
                access: access_user_list[i].access
            }
            return userData;
        }
    }
    return false;
}

function is_user_delete(id) {
    var res = _.find(access_user_list, { 'id': id, 'is_delete': 1 });
    return res;
    // for (var i = 0; i < access_user_list.length; i++) {
    // 	if (access_user_list[i]['id'] === id && access_user_list[i]['is_delete'] == 1) {
    // 		return 'yes';
    //   }
    //   if(access_user_list.length == i+1)
    //     return 'no';
    // }
}
var pingpong;
/**
 * When disconnect event occured
 **/
 socket.on('disconnect', function() {
    console.log('Disconnected');
    pingpong = setInterval(function(){
        console.log('Try to open ...');
		if (! socket.connected) {
			socket.open();
            console.log('Opened again.');
            // socket.emit('check_in_buffer', {user_id: user_id, session_id: session_id}, function(result){
            //     console.log("314 check in buffer", result);
            // });
		}
		// socket.emit('heartbeat', { id: user_id, name: user_fullname });
	}, 200);
    $('.txt_user_connecting').show();
});

/**
 * When connect event occured
 **/
socket.on('connect', function() {
    console.log('socket connected. ---------------- 306');
    
    // emait the user as 'login' and send 'user_id' and 'user_fullname' which save into database
    // then update the database table field, that user is loged in by ajax calling.
    // console.log('client-socket 9 ', {from: user_id, text: user_fullname});
    
    if(sessionStorage.getItem('user.token') == null) sessionStorage.setItem('user.token', Date.now());
    let token_id = sessionStorage.getItem('user.token');
    // console.log('token_id',token_id);
    socket.emit('login', { from: user_id, text: user_fullname,token_id:token_id }, function() {
        if (previouslyConnected) {
            socket.emit('check_in_buffer', {user_id: user_id, session_id: session_id}, function(result){
                console.log("411 check in buffer when reconnect ", result);
            });
        }else{
            previouslyConnected = true;
        }

    });
    // socket.emit('login', {from: user_id, text: user_fullname, platform:'web'});
    clearInterval(pingpong);
    localStorage.hayven_user_id = user_id;
    // logout emait received from server
    socket.on("logout", function(data) {
        // console.log("Refresh ", data);
        removeA(onlineUserList, data.userdata.from);
        setInterval(function() {
            if (onlineUserList.indexOf(data.userdata.from) == -1) {
                // console.log("logout ", data);
                $('.online_' + data.userdata.from).addClass('offline').removeClass('online');
                $('.online_' + data.userdata.from).addClass('box-default').removeClass('box-success');
                if (typeof onlineUserList != 'undefined' && typeof participants != 'undefined' && typeof conversation_type != 'undefined' && typeof conversation_id != 'undefined') {
                    forActiveCallIcon(onlineUserList, participants, conversation_type, conversation_id);
                }
                if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
                    if ($('#memberListBackWrap:hover').length == 0) refreshOnlineUsersList();
                }
            }
        }, 10000);
    });
    // alert(typeof callCleanupLogic);
    if (typeof callCleanupLogic == 'function' && window.name === 'calling') {
        socket.emit('login_call', {
            from: user_id,
            text: user_fullname,
            conversation_id: conversation_id
        }, function() {
            if (previouslyConnected) {
                socket.emit('voip_reconnection', {
                    user_id: user_id,
                    user_fullname: user_fullname
                }, function(call_data) {
                    if (call_data) {

                    } else {
                        $('#chat_container').hide();
                        $('#call_container_form').hide();
                        $('#guest_container_form').show();
                        $('#guest_again_div').hide();
                        $('#guest_thankyou_div').hide();
                        $('#guest_msg_span').html('Call ended. You can close this window.');
                        $('#beforecallicons').hide();
                        $('#guest_msg_div').show();
                        // window.close();

                    }

                });
            } else {
                // first connection; any further connections means we disconnected
                previouslyConnected = true;
            }
        });
    }

});


/* reconnect_attempt attempt */
socket.on('reconnect_attempt', () => {
    console.log('reconnect_attempt *********** 382');
    socket.emit('has_login', function(res) {
        if (!res) {
            if (window.name != 'calling' && typeof callCleanupLogic != 'function') {
                window.location.href = "/";
            }
        }
    });
});

socket.on('reconnect', (attemptNumber) => {
    console.log('reconnect done ========== 393');
    clearInterval(pingpong);
    socket.emit('has_login', function(res) {
        // socket.emit('check_in_buffer', {user_id: user_id, session_id: session_id}, function(result){
        //     console.log("411 check in buffer when reconnect ", result);
        // });
    });
    // alert('reconnected');


    // if($('#participants').css('visibility')=='hidden'){
    // 	console.log('reconnect reload');
    // 	// alert('reload');
    // 	// location.reload();
    // 			socket.emit('voip_client_reload_user', {
    // 				arr_participants : arr_participants, 
    // 				conversation_id : conversation_id 
    // 			}, (res) => {

    // 			});

    // }else{
    $('.txt_user_connecting').hide();
    // }


});

/**
 * All active device list
 */
socket.on('active_device', function(data) {
    if (data.user_id == user_id) {
        console.log(354, data);
        // logout from all active list
        window.location.href = "/logout";
    }
});


/**
 * after login,
 * receive a welcome message with all online user lists, handled by socket.
 **/
function set_bucket_name() {
    var getUrl = window.location;
    var baseurl = getUrl.origin;
    var email_user_id = user_email.replace(/[^A-Z0-9]/ig, "-");
    if (email_user_id != bucket_name) {
        // socket.emit('get_bucket_info', {baseurl, email_user_id}, (res)=>{
        //     console.log('socket client side 291', res);
        //     if(res.status){
        //         console.log('Bucket name ', res.bucket_name);
        //         bucket_name = res.bucket_name;
        //     }
        //     else{
        //         console.log("Socket error. Bucket name not set. Please try again later.");
        //     }
        // });
        $.ajax({
            url: "/s3Local/create_bucket_if_not_exists/" + email_user_id,
            type: "GET",
            dataType: "JSON",
            success: function(res) {
                if (res.status) {
                    console.log('409 Bucket name ', res.bucket_name);
                    bucket_name = res.bucket_name;
                } else {
                    console.log(447, res);
                    alert("Bucket name not set. Please refresh your browser and try again.");
                    // set_bucket_name();
                }
            },
            error: function(err) {
                console.log(err);
                alert("Bucket name not set. Please refresh your browser and try again.");
            }
        })
    }
}

socket.on('online_user_list', function(message) {
    if(window.location.href.includes('covid')){ return; }
    
    set_bucket_name();

    $.each(message.text, function(k, v) {
        // console.log(v);
        onlineUserList.push(v);
        // $('.online_'+v).addClass('online').removeClass('offline');
        $('.online_' + v).addClass('online').removeClass('offline');
        $('.online_' + v).addClass('box-success').removeClass('box-default');
    });
    if (typeof onlineUserList != 'undefined' && typeof participants != 'undefined' && typeof conversation_type != 'undefined' && typeof conversation_id != 'undefined') {
        forActiveCallIcon(onlineUserList, participants, conversation_type, conversation_id);
    }
});


///for idle users
socket.on('idleUsers', function(data) {
    idleUsersList = data.allIdleUsers;
    $('.online').removeClass('idleUser');
    $('.offline').removeClass('idleUser');
    $.each(idleUsersList, function(k, v) {
        if ($('.online_' + v).hasClass('online')) {
            $('.online_' + v).addClass('idleUser');
        }
    });
});

socket.on('idleUsersForuser', function(data) {
    idleUsersList = data.allIdleUsers;
    $('.online').removeClass('idleUser');
    $.each(idleUsersList, function(k, v) {
        if ($('.online_' + v).hasClass('online')) {
            $('.online_' + v).addClass('idleUser');
        }
    });
})

/**
 * When a new user login,
 * broadcast to other user, that someone joined.
 * and user list marked as online
 **/
socket.on('new_user_notification', function(notification) {
    onlineUserList.push(notification.text.from);
    $('.online_' + notification.text.from).addClass('online').removeClass('offline');
    $('.online_' + notification.text.from).addClass('box-success').removeClass('box-default');
    if (typeof onlineUserList != 'undefined' && typeof participants != 'undefined' && typeof conversation_type != 'undefined' && typeof conversation_id != 'undefined') {
        forActiveCallIcon(onlineUserList, participants, conversation_type, conversation_id);
    }
    if (typeof callCleanupLogic == 'function' && window.name == 'calling') {
        // alert($('#memberListBackWrap:hover').length);
        refreshOnlineUsersList();
    }
});


function change_user_password() {
    var old_password = $("#old_password").val();
    var new_password = $("#new_password").val().trim();
    var con_password = $("#con_password").val();
    if (new_password == con_password) {
        if (new_password == '123456') {
            $("#errCurPasMsg").html("");
            $("#errNewPasMsg").html("You can not set your password like 123456.").css('color', '#F55');
            $("#errConPasMsg").html("");
        } else {
            // if(/(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g.test(new_password)){
            if (new_password.length >= 6) {
                socket.emit('change_password', { user_id, old_password, new_password }, (rep) => {
                    // $('#changePwdPopup').hide();
                    // alert(rep.msg);
                    $("#old_password").focus();
                    $("#errNewPasMsg").html("");
                    $("#errConPasMsg").html("");
                    $("#errCurPasMsg").html(rep.msg).css('color', '#F55');
                    if (rep.status) {
                        $("#old_password").val("");
                        $("#new_password").val("");
                        $("#con_password").val("");
                        $("#errCurPasMsg").html("");
                        $("#errNewPasMsg").html("");
                        $("#errConPasMsg").html("");
                        $('#changePwdPopup').hide();
                        $("#sucMsgTitle").html("Change Password");
                        $("#sucMsgGreen").html("Password changed successfully.").css('color', '#5DB75D');
                        $('#changePasSucMsg').show();

                        // console.log('Password changed successfully.');
                    }
                });
            } else {
                // alert("Password must have minimum 6 characters, at least one uppercase letter, one lowercase letter and al least one number or special character.");
                // alert("Password must have minimum 6 characters.");
                $("#errCurPasMsg").html("");
                $("#errNewPasMsg").html("Password must have minimum 6 characters.").css('color', '#F55');
                $("#errConPasMsg").html("");
            }
        }
    } else {
        // alert("New and Confirm Passwords are not same!");
        $("#errCurPasMsg").html("");
        $("#errNewPasMsg").html("New and Confirm Passwords are not same!").css('color', '#F55');
        $("#errConPasMsg").html("New and Confirm Passwords are not same!").css('color', '#F55');
    }
}

function reset_change_password_form() {
    $("#errCurPasMsg").html("");
    $("#errNewPasMsg").html("");
    $("#errConPasMsg").html("");
    $("#changePwdPopup .defpass").remove();
}
// $(window).bind("load", function() {
//   $('a, div, span, p').css('opacity', 1);
// });

function my_link_account(ulid) {
    var allready = [];
    socket.emit("get_link_accounts", { user_email, company_id }, (res) => {
        // console.log(1643, res);
        if (res.linkacc.length > 0) {
            $("#" + ulid).html("");
            $.each(res.linkacc[0].email_company, function(k, v) {
                if (v != user_email + "=" + company_id) {
                    var ec = v.split("=");
                    var comname = "";
                    $.each(res.company, function(ck, cv) {
                        if (ec[1] == cv.company_id.toString()) {
                            comname = cv.company_name;
                            return false;
                        }
                    });
                    allready.push(ec[0] + "=" + ec[1]);
                    if (ulid == "link_accounts") {
                        socket.emit("get_img_by_email_company", { user_email: ec[0], company_id: ec[1] }, (ures) => {
                            $("#" + ulid).append('<div class="linkaccimg" data-comid="' + ec[1] + '"><img onclick="switch_account(event)" data-email="' + ec[0] + '" data-comid="' + ec[1] + '" class="profilePic" title="' + comname + '" src="' + file_server + 'profile-pic/Photos/' + ures[0].img + '"><span class="socialMsgCount"></span></div>');
                        });
                    } else
                        $("#" + ulid).append('<li onclick="switch_account(event)" data-email="' + ec[0] + '" data-comid="' + ec[1] + '">' + comname + '</li>');
                }
            });
        }

        if (ulid == "link_accounts") {
            var print_social = true;
            socket.emit("get_social_account", { user_email }, (res) => {
                $.each(res.company, function(ck, cv) {
                    if (cv.company_id.toString() == company_id) {
                        // alert(cv.company_name);
                        $("#company_id_name").html(cv.company_name);
                    }
                });
                if (res.linkacc.length > 1) {
                    // $("#"+ulid).append('<img onclick="switch_account(event)" data-email="'+ res.linkacc[0].email +'" data-comid="'+ res.linkacc[0].company_id +'" class="profilePic" title="Social Account" src="'+ file_server+'profile-pic/Photos/'+ res.linkacc[0].img +'">');
                    // $("#"+ulid).html("");
                    $.each(res.linkacc, function(k, v) {
                        if (allready.indexOf(v.email + "=" + v.company_id) == -1) {
                            if (v.company_id != company_id) {
                                var comname = "";
                                $.each(res.company, function(ck, cv) {
                                    if (v.company_id == cv.company_id.toString()) {
                                        comname = cv.company_name.split("@");
                                        return false;
                                    }
                                });

                                if (comname.indexOf('Social') == -1) {
                                    $("#" + ulid).append('<div class="linkaccimg" data-comid="' + v.company_id + '"><img onclick="switch_account(event)" data-email="' + v.email + '" data-comid="' + v.company_id + '" class="profilePic" title="' + comname[0] + '" src="' + file_server + 'profile-pic/Photos/' + v.img + '"><span class="socialMsgCount"></span></div>');
                                }
                                if (comname.indexOf('Social') > -1) {
                                    print_social = false;
                                }
                            }
                        }
                    });
                }
                // if(print_social) {
                //   var type = findObjForUser(user_id).dept == "Social" ? "Business Account" : "Social Account";
                //   $("#"+ulid).append('<div class="linkaccimg" data-comid=""><img onclick="switch_account(event)" data-email="'+ user_email +'" data-comid="" class="profilePic" title="'+ type +'" src="'+ file_server+'profile-pic/Photos/img.png"><span class="socialMsgCount"></span></div>');
                // }
            });
        }

    });
}

function switch_account(e) {
    if ($(e.target).attr("data-comid") != "") {
        var data = {
            email: $(e.target).attr("data-email"),
            comid: $(e.target).attr("data-comid")
        };
        $.ajax({
            url: '/alpha2/switch_account',
            type: "POST",
            data: data,
            dataType: "JSON",
            beforeSend: function() {
                // console.log(456, data);
            },
            success: function(res) {
                // if(res.status) window.location.reload();
                if (res.status) window.location.href = res.url;
                else alert("Something error");
            },
            error: function(err) {
                console.log(462, err);
            }
        });
    } else {
        var em = $(e.target).attr("data-email");
        var type = findObjForUser(user_id).dept == "Social" ? "work" : "social";
        window.location.href = "/alpha2/switch_for_signup/" + em + "/" + type;
    }
}

$(function() {
    if(typeof user_role != 'undefined' && user_role == 'Public User'){
        return;
    }
    my_link_account("link_accounts");
    setInterval(function() {
        // console.log(508);
        check_link_account_notification();
    }, 300000);
    setInterval(function() {
        if (localStorage.hayven_user_id != user_id) {
            if (window.name != 'calling' && typeof callCleanupLogic != 'function') {
                window.location.href = "/";
            }

        }
    }, 5000);
    if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
        check_permission();
    }
});

function check_permission() {
    // check page permission
    setCookie("admintabname", "");
    setCookie("not_a_system_admin", "");

    if (!has_permission(user_id, ROOM_CREATE)) $("#create_conv_btn").hide();

    if (!has_permission(user_id, COTR_ADMIN_SETTINGS)) {
        $("#admin_settings_btn").hide();
        $(".guest_member_div").addClass("just_readonly"); // Normal member can not access guest invitaion div
        $("#subconversation_create").hide();

        // Team Admin Can Manage Tag
        if (has_permission(user_id, TEAM_ADMIN)) {
            $("#admin_settings_btn").show();
            setCookie("admintabname", "tag");
            setCookie("not_a_system_admin", "yes");
        }
    }

    if (has_permission(user_id, GUEST)) {
        $("#subconversation_create").hide();
        $(".caller-url").hide();
        $("#conv" + user_id).find(".sub-text").html("");
    }
}

function check_link_account_notification() {
    console.log(701);
    var has_notify = 0;
    $.each($("#link_accounts img"), function(k, v) {
        if ($(v).attr('data-comid') != "") {
            $.ajax({
                url: '/alpha2/get_notification',
                data: { user_email: $(v).attr('data-email'), company_id: $(v).attr('data-comid') },
                dataType: 'JSON',
                type: 'POST',
                beforeSend: function() {
                    // console.log(707, {user_email: $(v).attr('data-email'), company_id: $(v).attr('data-comid')})
                    console.log(712, "Search link account notification");
                },
                success: function(res) {
                    console.log(714, res);
                    if (res.status) {
                        if (res.result.all_unread.length > 0) {
                            has_notify += res.result.all_unread.length;
                            if ($('.head_container').find('.has_notify').length == 0) {
                                $('.head_container').append('<span class="has_notify">' + has_notify + '</span>');
                            }
                            $("#link_accounts div[data-comid='" + res.company_id + "']").find('span.socialMsgCount').text(res.result.all_unread.length);
                        }
                    }
                },
                error: function(err) {
                    console.log(532, err);
                }
            });
        }
    });
}
// alert('2x');