// const { find } = require("lodash");




var searchRooms = (value) => {
    $('.more_channel').remove();
    if (value == '') {
        $('.added-channels.pr').show();
        $('#joinChannelPanel').find('.chanel-name').removeClass('searchThis');
        $('#joinChannelPanel').find('.roomGallary').show();

    } else {

        $(".chanel-name").each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('div').show();
                $(this).parent('div').removeClass('searchThis');
            } else {
                $(this).parent('div').hide();
                $(this).parent('div').addClass('searchThis');
            }
        });
        $('.added-channels.pr').each(function() {
            if ($(this).find('.chanel-name').text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).show()
            } else {
                $(this).hide();
            }
        })

        // if ($(".added-channels:visible").length > 0) {
        // 	$("#nrf").remove();

        // } else {
        // 	var design = '<span id="nrf">No room found</span>';
        // 	$('#nrf').remove();
        // 	$('#joinedRoomDivFull').after(design)
        // }
        $('.added-channels.pr').find('.chanel-name').unhighlight();
        $('.added-channels.pr').find('.chanel-name').highlight(value);
    }


    $('.added-channels.pr').find('.chanel-name').unhighlight();
    $('.added-channels.pr').find('.chanel-name').highlight(value);
    $('#private_rooms .roomCounter').html($('#allPrivateRoomsView').find('.added-channels:visible').length);
    $('#public_rooms .roomCounter').html($('#allPublicRoomsView').find('.added-channels:visible').length);
    $('#closed_rooms .roomCounter').html($('#allClosedRoomView').find('.added-channels:visible').length);
}

function afterSearchMassonary() {
    var masonryOptions = {
        itemSelector: '.searchThis',
        columnWidth: 405,
        gutter: 20,
        percentPosition: true
    };

    var $grid1 = $('#joinedDiv').masonry(masonryOptions);
    $grid1.masonry('destroy');
    $grid1.masonry(masonryOptions);

    var $grid2 = $('#joinDiv').masonry(masonryOptions);
    $grid2.masonry('destroy');
    $grid2.masonry(masonryOptions);
}

var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
$.each(user_list, function(ky, va) {
    if (jQuery.inArray(va.dept, dept) == -1) {
        dept.push(va.dept);
    }
    if (va.id != user_id) {
        var design = '	<li>';
        design += '		<label class="">' + va.fullname + '';
        design += '			<input onclick="memAssignForTodo(event,\'' + va.id + '\')" id="' + va.fullname.replace(/\s/g, '') + '" class="checkTask" data-uid="' + va.id + '" type="checkbox">';
        design += '			<span class="checkmark"></span>';
        design += '		</label>';
        design += '		</li>';

        // var design = '	<div class="added-channel-members">';
        // 	design += '		<input onclick="memAssignForTodo(event,\''+va.id+'\')" id="'+va.fullname.replace(/\s/g,'')+'" class="checkTask" data-uid="'+va.id+'" type="checkbox">';
        // 	design += '		<label for="'+va.fullname.replace(/\s/g,'')+'">'+va.fullname+'</label>';
        // 	design += '	</div>';

        $("#memberHolder").append(design);
    }

});

$.each(dept, function(k, v) {
    var ulDes = '<li>';
    ulDes += '      <div class="department">' + v + '</div>';
    ulDes += '      <div class="dpt-members">';
    ulDes += '        <ul class="suggested-list" id="s-l-' + v + '" >';
    ulDes += '        </ul>';
    ulDes += '      </div>';
    ulDes += '    </li>';

    $("#s-m-ul").append(ulDes);
});
// Render all user accoroding to designation
$.each(allUserdata[0].users, function(ky, va) {
    if (va.id == user_id) {
        var adminDes = '<li>';
        adminDes += '        <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="profile">';
        adminDes += '        <span class="name" data-uuid="' + va.id + '">' + va.fullname + '</span> <span class="is-admin"> (Admin)</span>';
        adminDes += '      </li>';
        $("#memberlist").append(adminDes);
    } else {
        var liDes = '<li>';
        liDes += '      <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="profile">';
        liDes += '      <span class="name" data-uuid="' + va.id + '">' + va.fullname + '</span> <span class="designation-name">, ' + va.designation + '</span>';
        liDes += '    </li>';
        var dept = va.dept;
        $("#s-l-" + dept).append(liDes);
    }

    var definedList = '<li class="showEl">';
    definedList += '      <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="profile">';
    definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span><span class="designation-name">, ' + va.designation + '</span>';
    definedList += '    </li>';

    $("#s-l-def").append(definedList);
    $("#directMsgUserList").append(definedList);
});

/** Add suggested user list to
selected group member list */
var directMsgCont = 1;
var directMsgName = "";
var directMsgUUID = "";
var directMsgImg = "";
var directMsgSubtitle = "";

$('.add-team-member').on('keyup', function(e) {
    var str = $(e.target).val();
    if (str != "") {
        $('.suggested-type-list').show();
        $('#createChannelContainer .submitBtn').hide();
        $('#createChannelContainer .member_list').hide();
        $('#createChannelContainer .adminList').hide();
        $('.invite-member .remove').show();
        if (str.indexOf('@') != -1) {
            $('.suggested-type-list li').hide();
            send_email_invite(str);
        }
    } else {
        $('.suggested-type-list').show();
        $('#createChannelContainer .submitBtn').hide();
        $('#createChannelContainer .member_list').hide();
        $('#createChannelContainer .adminList').hide();
        $('.invite-member .remove').hide();
    }
});

// $(".ml-listHl .member-div").mouseenter(function(e) {
// 	$(this).find('.add-admin').show();
// 	$(this).find('.remove-it').show();
// }).mouseleave(function() {
// 	$(this).find('.add-admin').hide();
// 	$(this).find('.remove-it').hide();
// });

// $(".ml-listHA .member-div").mouseenter(function(e) {
// 	$(this).find('.remove-admin').show();
// 	$(this).find('.remove-it').show();
// }).mouseleave(function() {
// 	$(this).find('.remove-admin').hide();
// 	$(this).find('.remove-it').hide();
// });

/*
Create Chat Group on click create btn
*/

var getInfo = (event) => {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#demoImg").attr('src', URL.createObjectURL(event.target.files[0]));
};

var roomImageUpdate = (roomid, event, files) => {
    var formData = new FormData();
    formData.append('bucket_name', 'room-images-uploads');
    formData.append('room_image', files[0]);
    var slid = Number(moment().unix());
    formData.append('sl', slid);
    $('#updateRoomImg').attr('src', file_server + 'common/imgLoader.gif');
    $('#demoImg').attr('src', file_server + 'common/imgLoader.gif');
    $.ajax({
        url: '/s3Local/convImg',
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(res) {
            if ($('#updatechannelContainer').is(':visible')) {
                socket.emit('updateRoomimg', {
                    conversation_id: roomid,
                    conv_img: res.data.key,
                    company_id: company_id,
                    user_id: user_id
                }, (callBack) => {
                    $("#updateRoomImg").attr('src', res.data.location);
                    $("#conv_title .msg-user-photo img").attr('src', res.data.location);
                    $('#conv' + roomid).attr('data-img', res.data.key);
                    $('#roomIdDiv').attr('data-convimg', res.data.key);
                    $('#roomIdDiv').attr('data-value', 'room-images-uploads/Photos/' + res.data.key);
                    $('#roomIdDiv').find('.msg-user-photo img').attr('data-value', 'room-images-uploads/Photos/' + res.data.key);
                    $('#forClearRoomImg').show();
                    call_toastr();
                });
            } else {
                $('#upload-channel-photo').attr('data-img', res.data.key);
                $('#demoImg').attr('src', res.data.location);
            }
        }
    });
}


function removeRoomImg(elm, type) {
    if (type == 'create') {
        $("#demoImg").attr('src', '' + file_server + 'room-images-uploads/Photos/feelix.jpg');
    } else {
        $('#forClearRoomImg').hide();
        $("#updateRoomImg").attr('src', '' + file_server + 'room-images-uploads/Photos/feelix.jpg');
        $("#conv_title .msg-user-photo img").attr('src', '' + file_server + 'room-images-uploads/Photos/feelix.jpg');
        $('#roomIdDiv').attr('data-convimg', 'feelix.jpg');

        socket.emit('updateRoomimg', {
            conversation_id: $('#roomIdDiv').attr('data-roomid'),
            conv_img: 'feelix.jpg',
            user_id: user_id,
            company_id: company_id
        }, (callBack) => {
            $('#conv' + $('#roomIdDiv').attr('data-roomid')).attr('data-img', 'feelix.jpg');
            $('#roomIdDiv').find('.msg-user-photo img').attr('data-value', 'room-images-uploads/Photos/feelix.jpg');
        });
    }
}
var CreateGroup = () => {

    var teamname = $("#team-name").val().trim().replace(/,/g, ' ');
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
    var topic_type = $('[name="room_type"]:checked').val();
    var guest_member_ids = "";

    if (teamname != "" && teamname != " ") {
        if (selectecosystem != "") {
            if (grpprivacy != "") {
                if (topic_type == 'support_room') {

                    if (teamname[0] != '#') {
                        teamname = '# ' + teamname;
                    }

                    if (teamname[teamname.length - 1] != '#') {
                        teamname = teamname + ' #';
                    }
                    // console.log(275,teamname)

                    var teamid = $("#select-ecosystem").val();
                    if (teamid != 0) {
                        for (var i = 0; i < allteams.length; i++) {
                            if (allteams[i].team_id == teamid) {
                                if (allteams[i].participants.length == 1) { alert("Please add team member, then create room by this team"); return false; }
                                $.each(user_list, function(k, v) {
                                    if (allteams[i].participants.indexOf(v.id) > -1) {
                                        if (v.id !== user_id) {
                                            if (v.is_active !== 0) {
                                                memberListUUID.push(v.id);
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }

                    adminListUUID = temppNewAdminuudi;
                    // memberListUUID = temppNewMemberuudi;
                    adminListUUID.push(user_id);
                    grpprivacy = 'protected';
                } else if ($('#guestlistAddedmember li').length >= 1) {
                    memberListUUID = [];
                    adminListUUID = [];
                    $.each($('#listAddedmember li'), function(mk, mv) {
                        var mid = $(mv).find('.name.s-l-def-clas').attr('data-uuid');
                        if (mk == 0)
                            adminListUUID.push(mid);
                        else
                            memberListUUID.push(mid);
                    });

                    $.each($('#guestlistAddedmember li'), function(gk, gv) {
                        var gid = $(gv).find('.name.s-l-def-clas').attr('data-uuid');
                        guest_member_ids = guest_member_ids != '' ? guest_member_ids + ';' + gid : gid;
                        memberListUUID.push(gid);
                    });
                } else {

                    // adminList.push(user_fullname);
                    // adminListUUID.push(user_id);
                    adminListUUID = temppNewAdminuudi;
                    memberListUUID = temppNewMemberuudi;
                    adminListUUID.push(user_id);
                }

                $(".backWrap").hide();
                $(".new-group-chat-popup").hide();

            } else {
                $("#grp-privacy").css('border', '1px solid RED');
            }
        } else {
            $("#select-ecosystem").css('border', '1px solid RED');
        }
    } else {
        $("#team-name").css('border', '1px solid RED');
        $("#team-name").val('');
        $("#team-name").focus();
    }
    var b_unit_name = '';
    var b_unit_id = '';


    if ($('[name="room_type"]:checked').val() == 'work') {
        b_unit_name = null;

        $.each(allUnit, function(k, v) {
            if (v.unit_id == $('#business_unit').val()) {
                b_unit_name = v.unit_name;
                b_unit_id = v.unit_id;
            }
        });
    }

    if (teamname != "" && teamname != " " && b_unit_name != null) {
        console.log(343, adminListUUID, memberListUUID, guest_member_ids);
        socket.emit('groupCreateBrdcst', {
                createdby: user_id,
                createdby_name: user_fullname,
                memberList: memberList,
                memberListUUID: memberListUUID,
                adminList: adminList,
                adminListUUID: adminListUUID,
                service_provider: temppNewSPuudi,
                is_room: '6',
                teamname: teamname,
                selectecosystem: selectecosystem,
                grpprivacy: grpprivacy,
                conv_img: $('#upload-channel-photo').attr('data-img'),
                user_id: user_id,
                topic_type: topic_type,
                b_unit_id: b_unit_id,
                b_unit_name: b_unit_name,
                alltags: [],
                temTNA: [],
                readyTag: readyTag,
                company_id: company_id,
                itsSubConvid: itsSubConvid,
                guest_member_ids: guest_member_ids
            },
            function(confirmation) {
                console.log("create group====================================================================================================================1");
                var hideClass = '';
                if (confirmation.status && confirmation.exist) {
                    if (confirmation.data[0].root_conv_id != null) {
                        hideClass = 'itssubconvhide';
                    }
                    // $('#existRoomPrivate').hide();
                    // $('#existRoomPublic').hide();
                    if (!$("#team-name").is(":focus")) {

                        $('#roomExistPop').css('display', 'flex');
                    }
                    $('#existRoomFoot').html("");
                    $('#existDataTitle').text(confirmation.data[0].title);
                    if (confirmation.data[0].privacy == 'private') {
                        // $('#exitDataPrivacy').attr("class",'lock');
                        // $('#existRoomPrivate').show();
                        // $('#existRoomPublic').hide();

                    } else {
                        // $('#existRoomPrivate').show();
                        $('#exitDataPrivacy').attr("class", 'hash');
                        if (confirmation.data[0].participants.indexOf(user_id) == -1) {
                            $('#existRoomFoot').append('<h3 class="click-to-join width100" id="exitJoinBtn">Join this room</h3>');
                            $("#exitJoinBtn").attr("onclick", "joinRoom('','" + confirmation.data[0].created_by + "', '" + confirmation.data[0].privacy + "' ,'" + confirmation.data[0].group_keyspace + "','" + confirmation.data[0].conversation_id + "','" + user_id + "','" + confirmation.data[0].title + "')");
                        } else {
                            if (confirmation.data[0].participants_admin.length > 1) {

                                $('#existRoomFoot').append('<h3 class="click-to-leave width100" id="exitLeaveBtn">Leave this room</h3>');
                            } else {
                                $('#existRoomFoot').append('<h3 class="click-to-leave width100 inactive">Leave this room</h3>');

                            }
                            $("#exitLeaveBtn").attr("onclick", "leaveRoom(\'" + confirmation.data[0].participants.length + "\',\'" + confirmation.data[0].created_by + "\',\'" + confirmation.data[0].privacy + "\',\'" + confirmation.data[0].group_keyspace + "\',\'" + confirmation.data[0].conversation_id + "\',\'" + user_id + "\')");
                        }

                    }

                    $('#existRoomName').attr('data-roomid', confirmation.data[0].conversation_id);
                    $('#existRoomName').attr('data-title', confirmation.data[0].title);
                    $('#existRoomName').attr('data-privecy', confirmation.data[0].privecy);
                    $('#existRoomName').attr('data-keyspace', confirmation.data[0].group_keyspace);
                    $('#existRoomName').attr('data-admin', confirmation.data[0].participants_admin.join(','));
                    $('#existRoomName').attr('data-participants', confirmation.data[0].participants.join(','));
                    $('#existRoomTooltip').html("");
                    $.each(user_list, function(k, v) {
                        if (confirmation.data[0].participants.indexOf(v.id) > -1) {
                            $('#existRoomTooltip').append(v.fullname + '<br>');
                        }
                    });
                    $('#existRoomPcount').html('<img src="/images/basicAssets/Users.svg" alt="" > ' + confirmation.data[0].participants.length + ' Members');


                } else if (confirmation.status) {
                    // $.each(guest_member_ids.split(";"), function(k,v){
                    // 	setCookie('send_invitation_'+ v + confirmation.conversation_id , 'yes');
                    // });
                    if (guest_member_ids.length > 0)
                        call_toastr("Room created successfully. Invitation sent to Guest(s)");
                    else
                        call_toastr("Room created successfully");
                    if (itsSubConvid != null) {
                        hideClass = 'itssubconvhide';
                    }
                    var icon = 'hash';
                    if (grpprivacy === 'public') {
                        icon = 'hash';
                    } else if (grpprivacy === 'private') {
                        icon = 'lock';
                    } else if (grpprivacy === 'protected') {
                        icon = 'protected';
                    }

                    $("#defaultRoom").remove();
                    if (teamname.length >= 25) {
                        $("#conversation_list_sidebar").prepend('<li data-balloon-pos="up" data-privacy="' + grpprivacy + '" data-balloon-length="fit" data-balloon="' + teamname + '" data-myid="' + user_id + '" data-createdby="0"  data-octr="' + user_id + '" onclick="start_conversation(event)" data-nor="0" data-subtitle="' + selectecosystem + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + parseInt(parseInt(memberListUUID.length) + 1) + '" data-conversationid="' + confirmation.conversation_id + '" data-name="' + teamname + '" data-img="' + $('#upload-channel-photo').attr('data-img') + '"  id="conv' + confirmation.conversation_id + '" class="' + hideClass + '"><span class="' + icon + '"></span><span class="usersName">' + teamname + '</span><span class=" unreadMsgCount"></span> </li>');
                    } else if (teamname.length >= 17 && teamname.length < 25) {
                        $("#conversation_list_sidebar").prepend('<li data-balloon-pos="up" data-privacy="' + grpprivacy + '" data-balloon-length="medium" data-balloon="' + teamname + '" data-myid="' + user_id + '" data-createdby="0"  data-octr="' + user_id + '" onclick="start_conversation(event)" data-nor="0" data-subtitle="' + selectecosystem + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + parseInt(parseInt(memberListUUID.length) + 1) + '" data-conversationid="' + confirmation.conversation_id + '" data-name="' + teamname + '" data-img="' + $('#upload-channel-photo').attr('data-img') + '"  id="conv' + confirmation.conversation_id + '" class="' + hideClass + '"><span class="' + icon + '"></span><span class="usersName">' + teamname + '</span><span class=" unreadMsgCount "></span></li>');
                    } else if (teamname.length < 17) {
                        $("#conversation_list_sidebar").prepend('<li  data-myid="' + user_id + '" data-privacy="' + grpprivacy + '" data-createdby="0"  data-octr="' + user_id + '" onclick="start_conversation(event)" data-nor="0" data-subtitle="' + selectecosystem + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + parseInt(parseInt(memberListUUID.length) + 1) + '" data-conversationid="' + confirmation.conversation_id + '" data-name="' + teamname + '" data-img="' + $('#upload-channel-photo').attr('data-img') + '"  id="conv' + confirmation.conversation_id + '" class="' + hideClass + '"><span class="' + icon + '"></span><span class="usersName">' + teamname + '</span><span class=" unreadMsgCount"></span></li>');
                    }
                    //$("#conversation_list_sidebar").prepend('<li data-myid="' + user_id + '" data-createdby="0"  data-octr="' + user_id + '" onclick="start_conversation(event)" data-subtitle="' + selectecosystem + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + parseInt(parseInt(memberListUUID.length) + 1) + '" data-conversationid="' + confirmation.conversation_id + '" data-name="' + teamname + '" data-img="feelix.jpg"  id="conv' + confirmation.conversation_id + '" class=""><span class="' + (grpprivacy === 'public' ? "hash" : "lock") + '"></span> <span class="usersName">'+teamname+'</span></li>');
                    $("#team-name").val("");
                    $("#ml-admintype").hide();
                    $("#ml-membertype").hide();

                    $("#ml-listHA").html('');
                    $("#ml-listHl").html('');
                    $("#grpPrivacy").prop("checked", false);
                    closeRightSection();
                    $('.list_Count span').text(memberListUUID.length + 1);
                    $('#totalMember').text(memberListUUID.length + 1);
                    forActiveCallIcon(onlineUserList, participants, conversation_type);

                    tooltipForOverLength();
                    console.log(confirmation)
                    $('#conv' + confirmation.conversation_id).click();
                    var looptagid = [];
                    if (confirmation.status) {
                        $.each(confirmation.tags, function(k, v) {
                            $.each(confirmation.condtagsid, function(ku, vu) {
                                if (looptagid.indexOf(v.tag_id) == -1 && vu.tagid == v.tag_id) {
                                    looptagid.push(v.tag_id)
                                    var conv_tagid = vu.cnvtagid;
                                    var roomid = confirmation.conversation_id;
                                    var tag_id = v.tag_id;
                                    var tagTitle = v.title;
                                    console.log($('#level' + tag_id).length, $('#tagLi' + tag_id).length);
                                    if ($('#level' + conv_tagid).length == 0) {
                                        if ($('#tagLi' + tag_id).length == 0) {
                                            if (v.visibility !== 'visible') {

                                                var design = '<li class="hiddenTag" onclick="removeLevel(\'' + tag_id + '\',\'' + roomid + '\',\'' + conv_tagid + '\')">' + tagTitle + '<span class="tagcheck" id="level' + vu.cnvtagid + '" ></span></li>';
                                            } else {
                                                var design = '<li onclick="removeLevel(\'' + tag_id + '\',\'' + roomid + '\',\'' + conv_tagid + '\')">' + tagTitle + '<span class="tagcheck" id="level' + vu.cnvtagid + '" ></span></li>';
                                            }

                                            tagLsitDetail.push({
                                                'cnvtagid': conv_tagid,
                                                'tagid': conv_tagid,
                                                'tagTitle': tagTitle,
                                                'roomid': roomid,
                                            });
                                            $('#taggedList').append(design);

                                            var tag_itemdesign = '<div class="added-channel-members">';
                                            tag_itemdesign += '	<input id="tag_' + conv_tagid + '" data-tagid="' + conv_tagid + '" data-tagtitle="' + tagTitle + '" class="checkToDo" type="checkbox">';
                                            tag_itemdesign += '<label for="tag_' + conv_tagid + '">' + tagTitle + '</label>';
                                            tag_itemdesign += '</div>';

                                            $("#taggedItem").append(tag_itemdesign);

                                            my_tag_list[tag_id] = tagTitle;
                                            my_tag_id.push(tag_id);
                                        }
                                    }
                                }
                            });
                        });


                    }
                }
                allconvdetails.push(confirmation.data[0]);

            });
        all_action_for_selected_member();
    }

}

$(".remove-suggested-type-list").click(function() {
    $('.add-direct-member').html("");
    $('.add-team-member').val("");
    if ($('#createDirMsgContainer').is(':visible') == true) {
        $('.suggested-type-list').show();
        $('#createChannelContainer .submitBtn').hide();
        $('#createChannelContainer .member_list').hide();
        $('#createChannelContainer .adminList').hide();
        $('.suggested-type-list li').show();
        $('#directMsgUserList li').removeClass('selected');
        $('#directMsgUserList li').addClass('showEl');
        $('#directMsgUserList li.showEl:first').addClass('selected');
        $('.s-l-def-clas').unhighlight();
        $(this).hide();
    } else {
        $('.suggested-type-list').hide();
        $('#createChannelContainer .submitBtn').show();
        $('#createChannelContainer .member_list').show();
        $('#createChannelContainer .adminList').show();
    }
});



/** action for selected member list */
var all_action_for_selected_member = () => {
    /** On hover into the selected group member list,
    if member is already admin, show the remove admin btn,
    if member is not admin, show the make admin btn */

    // $(".ml-listHl .member-div").mouseenter(function(e) {
    // 	$(this).find('.add-admin').show();
    // 	$(this).find('.remove-it').show();
    // }).mouseleave(function() {
    // 	$(this).find('.add-admin').hide();
    // 	$(this).find('.remove-it').hide();
    // });

    // $(".ml-listHA .member-div").mouseenter(function(e) {
    // 	$(this).find('.remove-admin').show();
    // 	$(this).find('.remove-it').show();
    // }).mouseleave(function() {
    // 	$(this).find('.remove-admin').hide();
    // 	$(this).find('.remove-it').hide();
    // });
    /** When click on the make admin btn,
    admin text show and hide add admin btn */

    /** When click on the remove admin btn,
    admin text null and hide remove admin btn */
    $(".remove-admin").on('click', function() {
        $(this).closest('li').find('.is-admin').text('').hide();
        $(this).closest('li').find('.remove-admin').hide();
        adminList.splice($(this).closest('li').find('.name').text(), 1);
        adminList.splice($(this).closest('li').find('.name').attr('data-uuid'), 1);
        memberList.push($(this).closest('li').find('.name').text());
        memberListUUID.push($(this).closest('li').find('.name').attr('data-uuid'));
    });

    // $('.remove-it').on('click', function(e){
    // 	e.preventDefault();
    // 	e.stopImmediatePropagation();

    // 	var name = $(this).closest('div').find('.name').text();
    // 	var img = $(this).closest('div').find('img').attr('src');
    // 	var uuid = $(this).closest('div').find('.name').attr('data-uuid');
    // 	// if($(this).parent('.member-div') == true){
    // 	// 	alert('Yes , I got this');
    // 	// }
    // 	if(!$(this).hasClass('GroupFlRight')){
    // 		directMsgCont = 1;

    // 		removeA(memberList, name);
    // 		removeA(memberListUUID, uuid);
    // 		$("#numbers").text(parseInt(memberList.length)+1);
    // 		$(this).closest('div').remove();
    // 		if($(".ml-listHl>.member-div").length == 0){
    // 			$("#ml-membertype").hide();
    // 		}

    // 		var definedList = '<li>';
    // 		definedList += '      <img src="'+img+'" class="profile">';
    // 		definedList += '      <span class="name s-l-def-clas" data-uuid="'+uuid+'">'+name+'</span>';
    // 		definedList += '    </li>';
    // 		$("#s-l-def li [data-uuid="+uuid+"]").parent('li').removeClass('active');
    // 		// $("#s-l-def").append(definedList);
    // 		$("#directMsgUserList").append(definedList);

    // 		all_action_for_selected_member();
    // 	}


    // });

    $('.suggested-list li').on('click', function(event) {
        event.stopImmediatePropagation();

        var img_src = $(this).find('img').attr('src');
        var name = $(this).find('.name').text();
        var uuid = $(this).find('.name').attr('data-uuid');
        var subtitle = $(this).find('.designation-name').text();

        // if($("#createDirMsgContainer").is(":visible") && $("#roomIdDiv").attr('data-rfu') == ''){
        if ($("#createDirMsgContainer").is(":visible")) {
            if (directMsgCont == 1 && memberListUUID.indexOf(uuid) === -1 && memberListUUID.length < 10) {
                memberList.push(name);
                memberListUUID.push(uuid);
                directMsgCont++;
                directMsgName = name;
                directMsgUUID = uuid;
                directMsgImg = img_src;
                directMsgSubtitle = subtitle;
                // group_member_li_draw(name, img_src, uuid,'0','0',subtitle);
                // all_action_for_selected_member();
                // createDirectmsg();
                draw_name();
                $('.add-direct-member').append('<span class="selected_member_name" data-uuid="' + uuid + '" data-img="' + img_src + '"><span class="user_name">' + name + '</span><img src="/images/basicAssets/Remove.svg" onClick="remove_this_user(event,\'' + uuid + '\',\'' + img_src + '\',\'' + name + '\')"></span> &shy;'); // it's a special char &shy; non visible in html
                make_content_non_editable('selected_member_name');
                directMsgCont = 1;
                directMsgUUID = [];
                $(this).remove(); // Remove this user after selected;
                // $(this).addClass('active');
                var el = document.getElementById('add_direct_member');
                placeCaretAtEnd(el);

            } else {
                // toastr["warning"]("Multiple member is not allowed in direct message", "Warning");
                // toastr["warning"]("This member is not allowed.", "Warning");
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('This member is not allowed.');
            }
        } else if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
            var roomid = $("#roomIdDiv").attr('data-roomid');
            var roomTitle = $("#roomIdDiv").attr('data-title');

            if (jQuery.inArray(uuid, participants) === -1) {
                $(this).addClass('active');
                $.ajax({
                    type: 'POST',
                    data: {
                        conversation_id: roomid,
                        targetID: uuid,
                        company_id: company_id
                    },
                    dataType: 'json',
                    url: '/alpha2/groupMemberAdd',
                    success: function(data) {
                        participants.push(uuid);
                        countRoomPart(adminArra, participants);
                        group_member_li_draw(name, img_src, uuid, 'ready', roomid, subtitle);
                        $('.suggested-type-list').show();
                        $('#createChannelContainer .submitBtn').hide();
                        $('#createChannelContainer .member_list').hide();
                        $('#createChannelContainer .adminList').hide();
                        $('.list_Count span').text(participants.length);

                        $('#totalMember').text(participants.length);
                        forActiveCallIcon(onlineUserList, participants, conversation_type);
                        $("#conv" + roomid).attr('data-tm', participants.length);

                        var workSpaceName = $('#roomIdDiv').attr('data-keyspace');
                        var groupPrivacy = $('#roomIdDiv').attr('data-privecy');


                        socket.emit('groupMemberAdd', {
                            room_id: roomid,
                            memberList: participants,
                            selectecosystem: workSpaceName,
                            teamname: roomTitle,
                            grpprivacy: groupPrivacy,
                            createdby: user_id,
                            createdby_name: user_fullname
                        });
                    }
                });
            } else {
                $('#member' + uuid).find('.remove-it').trigger('click');
                $(this).removeClass('active');
                //toastr["warning"](name+" is a member of \""+roomTitle+"\" room", "Warning");
            }

        } else {
            if ($(".inviteMember").length == 0) {
                $(".memberList").show();
            }

            if (jQuery.inArray(name, memberList) !== -1) {
                $('#member' + uuid).find('.remove-it').trigger('click');
            } else {
                memberList.push(name);
                memberListUUID.push(uuid);
                $("#numbers").text(parseInt(memberList.length) + 1);
                // $(this).remove();
                $(this).addClass('active');
                group_member_li_draw(name, img_src, uuid, '0', '0', subtitle);
                all_action_for_selected_member();
                $('.suggested-type-list').show();
                $('#createChannelContainer .submitBtn').hide();
                $('#createChannelContainer .member_list').hide();
                $('#createChannelContainer .adminList').hide();
            }

            // all_action_for_selected_member();
        }

        // $(this).remove();

    });

    $(".checkToDo").click(function(e) {
        console.log(e);
        if (e.target.checked) {

            var tagtitle = $("#" + e.target.id).attr('data-tagtitle');
            var tagid = $("#" + e.target.id).attr('data-tagid');

            socket.emit('taggedData', {
                tagid: tagid
            }, (callBack) => {
                console.log(callBack);
                if (callBack.status) {
                    var len = callBack.tagDet;
                    if (len.length > 0) {

                        var checked = 1;

                        $('.chooseTag .checkToDo').each(function(i, row) {
                            if ($(row).is(':checked')) {
                                if (taggedCheckedID.indexOf($(row).attr('data-tagid')) === -1) {
                                    taggedCheckedID.push($(row).attr('data-tagid'));
                                }
                                checked++;
                            }
                        });



                        $("#conversation_list_sidebar li").hide();
                        $("#pintul li").hide();
                        $("#conversation_list_sidebar li").hide();

                        var design = '<div class="tag_item" id="' + e.target.id + '_ed"><img src="/images/basicAssets/custom_not_tag.svg" class="tagged"><p>' + tagtitle + '</p><img onclick="removeTagFilter(\'' + e.target.id + '\')" src="/images/basicAssets/Close.svg"></div>';

                        $('.tagg_list').append(design);
                        if ($(".tag_item").length > 0) {
                            $('.tagg_list').show();
                        }

                        $.each(callBack.tagDet, function(tdk, tdv) {
                            taggedRoomID.push({ 'tagid': tagid, 'roomid': tdv.conversation_id });
                        });

                        $.each(taggedRoomID, function(tdk, tdv) {
                            $("#conv" + tdv.roomid).show();
                        });

                    } else {
                        // toastr["warning"]("No tagged found", "Warning");
                        $('#warningsPopup').css('display', 'flex');
                        $('#warningsPopup .warningMsg').text('No tagged found.');
                    }
                }

            });
        } else {

            var tagid = $("#" + e.target.id).attr('data-tagid');

            removeA(taggedCheckedID, tagid);

            $("#" + e.target.id + "_ed").remove();

            $("#conversation_list_sidebar li").hide();
            $("#pintul li").hide();
            $("#conversation_list_sidebar li").hide();

            if ($(".tag_item").length == 0) {
                $("#conversation_list_sidebar li").show();
                $("#pintul li").show();
                $("#conversation_list_sidebar li").show();
            } else {
                $.each(taggedRoomID, function(tdk, tdv) {
                    $("#conv" + tdv.roomid).show();
                });
            }
        }
    });

};

/** selected group member list row html */
var group_member_li_draw = (name, img, uuid, urf, roomid, designation, email) => {
    console.log('onlineUserList inside', onlineUserList);
    console.log(782, img)
    console.log(828, urf)
    if (urf === 'ready') {
        var immg = img.split("/");
        var mldesign = '<div class="member-div" data-type="member" id="member' + uuid + '">';
        if (onlineUserList.indexOf(uuid) == -1) {
            mldesign += '<span class="offline online_' + uuid + '" style="top: 32px; left: 6px; position: absolute;"></span>';
        } else {
            mldesign += '<span class="online online_' + uuid + '" style="top: 32px; left: 6px; position: absolute;"></span>';
        }
        mldesign += '          <img src="' + img + '" class="member-img">';
        if (designation == 'Guest')
            mldesign += '          <div class="member-name"><p style="line-height: 21px; float:left">' + name + '<span>[Guest]</span></p><p class="mbr_email">[' + email + ']</p></div>';
        else
            mldesign += '          <div class="member-name"><p style="line-height: 21px; float:left">' + name + '<span>[Member]</span></p><p class="mbr_email">[' + email + ']</p></div>';
        // mldesign += '          <div class="designation-name"> ' + designation + '</div>';

        if (designation == 'Guest') {
            mldesign += re_invite_btn(uuid);
        }

        mldesign += '          <span class="remove-it GroupFlRight" onclick = "removeMember(\'member\',\'' + uuid + '\',\'' + roomid + '\');">Remove</span>';
        mldesign += '          <img src="/images/admin-remove_12px @1x.png" class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + immg[3] + '\',\'' + name + '\',\'' + designation + '\',\'' + uuid + '\',\'' + roomid + '\')">';
        if (designation != 'Guest')
            mldesign += '          <span  class="add-admin add2 GroupFlRight arfImg"  onclick="makeAdmin(\'' + immg[3] + '\',\'' + name + '\',\'' + designation + '\',\'' + uuid + '\',\'' + roomid + '\')">Make Admin</span>';
        mldesign += '        </div>';
        if (designation == 'Guest') {
            if (participants_sub.indexOf(uuid) == -1) {

                $("#guestml-listHl").append(mldesign);
                if ($(".sendinvitebtn").length > 0) {
                    $("#guest_member_emails3").attr("data-value", $(".sendinvitebtn").length);
                    $("#guest_member_emails3").html("Send Invitation (" + $(".sendinvitebtn").length + ")").show();
                }
            }

        } else {
            if (participants_guest.indexOf(uuid) == -1 && participants_sub.indexOf(uuid) == -1)
                $("#ml-listHl").append(mldesign);

        }
    } else {
        var html = '<div class="member-div" id="member' + uuid + '">';
        if (onlineUserList.indexOf(uuid) == -1) {
            mldesign += '<span class="offline online_' + uuid + '" style="top: 32px; left: 6px; position: absolute;"></span>';
        } else {
            mldesign += '<span class="online online_' + uuid + '" style="top: 32px; left: 6px; position: absolute;"></span>';
        }
        html += '<img src="' + img + '" class="member-img">';
        html += '<div data-uuid="' + uuid + '" class="member-name name">' + name + '</div>';
        html += '<div data-uuid="' + uuid + '" class="designation-name">' + designation + '</div>';
        html += '<img src="/images/remove_8px_200 @1x.png" class="remove-it">';
        html += '</div>';

        $('.ml-listHl').append(html);
    }

    $('.no-of-group-members').text($('.selected-group-members li:visible').length);
    $('.suggested-type-list').hide();
    $('#createChannelContainer .submitBtn').show();
    $('#createChannelContainer .member_list').show();
    $('#createChannelContainer .adminList').show();
    $('.add-team-member').val("");

    if ($('#ml-listHA .member-div').length > 0) {
        $("#ml-admintype").show();
    } else {
        $("#ml-admintype").hide();
    }

    if ($('#ml-listHl .member-div').length > 0) {
        $("#ml-membertype").show();
    } else {
        $("#ml-membertype").hide();
    }
};
var onetimeid = "";
socket.on("pin_unpin_broadcast", function(data){
    console.log(904, data);
    if(data.onetimeid != onetimeid){
        $.each(data.convid, function(k, v){
            var ele = $("#conv" + v);
            var is_pin = $("#conv" + v).attr('data-pin') == 'pin' ? 'pin' : 'unpin';
            $("#conv" + v).remove();
            if(is_pin == 'pin'){
                $("#conversation_list_sidebar").append(ele);
                $("#conv" + v).attr('data-pin', 'unpin');
            }else{
                $("#pintul").append(ele);
                $("#conv" + v).attr('data-pin', 'pin');
            }
            
            // if this conversation is open
            if(v == conversation_id){
                $("#conv"+v).trigger("click");
            }
        });
    }
    onetimeid = "";
});

$('div').on('click', '.pin-to-bar', function(event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    console.log(846, $(this).hasClass('pined'))
        // if($("#pin-to-bar").hasClass('pined')){
        // 	$("#pin-to-bar").parent('.pin-unpin').removeClass('pined');
        // 	$("#pin-to-bar").removeClass('pined');
        // 	$("#pin-to-bar").attr('src','/images/basicAssets/custom_not_pin.svg');
        // 	pin_unpinfun(false,conversation_id,user_id);
        // }else{
        // 	$("#pin-to-bar").parent('.pin-unpin').addClass('pined');
        // 	$("#pin-to-bar").addClass('pined');
        // 	$("#pin-to-bar").attr('src','/images/basicAssets/custom_pinned.svg');
        // 	pin_unpinfun(true,conversation_id,user_id);
        // }

    var conversationid = $(event.target).attr('data-conversationid');
    if (conversationid != "") {
        if ($(event.target).hasClass('pined')) {
            var pinnedid = $(event.target).attr('data-pinned');
            var blockID = $(event.target).attr('data-conversationid');
            var targetID = $(event.target).attr('data-id');

            var subtitle = $(event.target).attr('data-subtitle');
            var img = $(event.target).attr('data-img');
            var name = $(event.target).attr('data-name');

            //// var myid = $(event.target).attr('data-myid');
            //// var createdby = $(event.target).attr('data-createdby');
            //// var octr = $(event.target).attr('data-octr');
            var type = $(event.target).attr('data-type');
            ////console.log("myid = ", myid, "| ", "createdby = ", createdby, "| ", "octr = ", octr, "| ", "type = ", type);
            //console.log("type = ", type);

            var createdby = $("#conv" + blockID).attr('data-createdby'); //if it room then present id else empty text
            var octr = $("#conv" + blockID).attr('data-octr');
            var tm = $("#conv" + blockID).attr('data-tm');
            //console.log("createdby = ", createdby, "| ", "octr = ", octr, "| ", "tm = ", tm);

            var hash = $("#conv" + blockID).find('span:first').hasClass('hash');
            var lock = $("#conv" + blockID).find('span:first').hasClass('lock');
            var protected = $("#conv" + blockID).find('span:first').hasClass('protected');
            //console.log("Hash = ", hash, "| ", "Lock = ", lock, "| ", "Protected = ", protected);

            var isUser = ($('.online_' + targetID).is(':visible') ? 'user' : 'group'); //check group or user

            $.ajax({
                type: 'POST',
                data: {
                    pinnedNumber: '',
                    targetID: pinnedid,
                    blockID: '',
                    type: 'unpin'
                },
                dataType: 'json',
                url: '/alpha2/pinning',
                success: function(data) {
                    // update_local_pin_data(conversationid, pinnedid, 'remove');
                    if(data.status){
                        console.log(985)
                        onetimeid = Number(moment().unix());
                        socket.emit('pin_unpin_done', {status: true, onetimeid: onetimeid, uid: user_id, msg: "Pinned Successfully", convid: [conversationid]});
                    }
                    $("#pin-to-bar").removeClass('pined');
                    $("#pin-to-bar").parent('.pin-unpin').removeClass('pined');
                    $("#pin-to-bar").attr('src', '/images/basicAssets/custom_not_pin.svg');

                    var sapnClasses = $("#conv" + blockID).find('span').attr('class'); //find first span
                    var splitClass = sapnClasses.split(' ');
                    var status = '';
                    var tooltip = '';
                    if (name.length > 17) {
                        tooltip = 'data-balloon="' + name + '" data-balloon-pos="up" data-balloon-length="fit"';
                    }

                    if ($.inArray('online', splitClass) !== -1) {
                        status = 'online';
                    } else if ($.inArray('offline', splitClass) !== -1) {
                        status = 'offline';
                    }
                    // $("#conv"+blockID).attr("id", "convphide"+conversationid).hide();
                    $("#conv" + blockID).remove(); //remove converstion from left-top pined part

                    // if($("#convuphide"+conversationid).is(":hidden")){
                    // 	$("#convuphide"+conversationid).attr("id", "conv"+conversationid).show();
                    // }else{
                    // $("#conv"+blockID).remove();

                    var design = '<li ' + tooltip + ' data-privacy="' + (hash ? "public" : "private") + '" data-pin="unpin" data-myid="' + myid + '" data-createdby="' + createdby + '"  data-octr="' + octr + '"  onclick="start_conversation(event)" data-nor="0" data-id="' + targetID + '" data-subtitle="Navigate" data-conversationtype="' + type + '" data-conversationid="' + blockID + '" data-name="' + name + '" data-img="' + img + '" id="conv' + blockID + '" data-nom="1" data-tm="' + tm + '" class="sideActive">';

                    if (isUser == 'user') {
                        design += '<span class="online_' + targetID + ' ' + (onlineUserList.indexOf(targetID) > -1 ? "online" : "offline") + '"  style="left: 6px;"></span>';
                    } else {
                        if (name.indexOf(',') > -1) {
                            design += '<span class="lock rLock" style="left: 6px;"></span>';
                        } else {
                            if (hash) {
                                design += '<span class="hash" style="left: 6px;"></span>';
                            }

                            if (lock) {
                                design += '<span class="lock" style="left: 6px;"></span>';
                            }
                            if (protected) {
                                design += '<span class="protected" style="left: 6px;"></span>';
                            }

                        }
                    }

                    design += '<span class="usersName">' + name + '</span>';
                    design += '<span class="subroomunread"></span> <span class="unreadMsgCount"></span> <span class="remove" onclick="removeThisList(\'' + blockID + '\')" data-balloon="Click to hide" data-balloon-pos="left" onmouseenter="asideRemoveMouseEnter(\'' + blockID + '\')" onmouseleave="asideRemoveMouseLeave(\'' + blockID + '\')"></span>';
                    design += '</li>';


                    if (type == 'personal') {

                        if (name == user_fullname && blockID == user_id) {
                            $("#conversation_list_sidebar").prepend(design);
                        } else {
                            $("#conversation_list_sidebar").append(design);
                        }

                    } else if (type == 'group') {
                        if (name.indexOf(',') > -1) {
                            $("#conversation_list_sidebar").append(design);
                        } else {
                            $("#conversation_list_sidebar").append(design);
                        }
                    }
                    // }



                }
            });

        } else {

            var pinnedCount = $('.pin').length;
            // console.log("pinnedCount", pinnedCount);
            var PinnedNumber = parseInt(pinnedCount) + 1;

            var targetID = $(event.target).attr('data-id');
            var blockID = $(event.target).attr('data-conversationid');
            var subtitle = $(event.target).attr('data-subtitle');
            var img = $(event.target).attr('data-img');
            var name = $(event.target).attr('data-name');
            var type = $(event.target).attr('data-type');
            var myid = $("#conv" + blockID).attr('data-myid');
            var createdby = $("#conv" + blockID).attr('data-createdby');
            var octr = $("#conv" + blockID).attr('data-octr');
            var tm = $("#conv" + blockID).attr('data-tm');
            var hash = $("#conv" + blockID).find('span:first').hasClass('hash');
            var lock = $("#conv" + blockID).find('span:first').hasClass('lock');
            var protected = $("#conv" + blockID).find('span:first').hasClass('protected');
            var isUser = ($('.online_' + targetID).is(':visible') ? 'user' : 'group');


            $.ajax({
                type: 'POST',
                data: {
                    pinnedNumber: PinnedNumber,
                    targetID: targetID,
                    blockID: blockID,
                    type: 'pin'
                },
                dataType: 'json',
                url: '/alpha2/pinning',
                success: function(data) {
                    // update_local_pin_data(conversationid, data.pinID, 'add');
                    if(data.status){
                        console.log(1097)
                        onetimeid = Number(moment().unix());
                        socket.emit('pin_unpin_done', {status: true, onetimeid: onetimeid, uid: user_id, msg: "Pinned Successfully", convid: [conversationid]});
                    }
                    $("#pin-to-bar").addClass('pined');
                    $("#pin-to-bar").parent('.pin-unpin').addClass('pined');
                    $("#pin-to-bar").attr('src', '/images/basicAssets/custom_pinned.svg');
                    $("#pin-to-bar").attr('data-pinned', data.pinID);

                    var sapnClasses = $("#conv" + blockID).find('span').attr('class');
                    var splitClass = sapnClasses.split(' ');
                    var status = '';

                    if ($.inArray('online', splitClass) !== -1) {
                        status = 'online';
                    } else if ($.inArray('offline', splitClass) !== -1) {
                        status = 'offline';
                    }

                    // $("#conv"+blockID).attr("id", "convuphide"+blockID).hide();
                    $("#conv" + blockID).remove();

                    // if($("#convphide"+blockID).is(":hidden")){
                    // 	$("#convphide"+blockID).attr("id", "conv"+blockID).show();
                    // }else{
                    // $("#conv"+blockID).remove();
                    var tooltip = "";
                    if (name.length > 17) {
                        tooltip = 'data-balloon="' + name + '" data-balloon-pos="up" data-balloon-length="fit"';
                    }


                    var design = '<li ' + tooltip + ' data-privacy="' + (hash ? "public" : "private") + '" data-pin="pin" data-myid="' + myid + '" data-createdby="' + createdby + '"  data-octr="' + octr + '"  onclick="start_conversation(event)" data-nor="0" data-id="' + targetID + '" data-subtitle="Navigate" data-conversationtype="' + type + '" data-conversationid="' + blockID + '" data-name="' + name + '" data-img="' + img + '" id="conv' + blockID + '" data-nom="1" data-tm="' + tm + '" class="sideActive">';

                    if (isUser == 'user') {
                        design += '<span class="online_' + targetID + ' ' + (onlineUserList.indexOf(targetID) > -1 ? "online" : "offline") + '" style="left: 6px;"></span>';
                    } else {

                        if (name.indexOf(',') > -1) {
                            design += '<span class="lock rLock" style="left: 6px;"></span>';
                        } else {
                            if (hash) {
                                design += '<span class="hash" style="left: 6px;"></span>';
                            }

                            if (lock) {
                                design += '<span class="lock" style="left: 6px;"></span>';
                            }
                            if (protected) {
                                design += '<span class="protected" style="left: 6px;"></span>';
                            }

                        }
                    }

                    design += '<span class="usersName">' + name + '</span>';
                    design += '<span class="subroomunread"></span><span class="unreadMsgCount"></span> <span class="remove" onclick="removeThisList(\'' + blockID + '\')" data-balloon="Click to hide" data-balloon-pos="left" onmouseenter="asideRemoveMouseEnter(\'' + blockID + '\')" onmouseleave="asideRemoveMouseLeave(\'' + blockID + '\')"></span>';
                    design += '</li>';

                    $("#pintul").append(design);
                    // }
                }
            });
        }
    }

});


var getPublicData = (keySpace) => {
    socket.emit('public_conversation_history', { keySpace }, (respons) => {

        if (respons.staus) {

            //$("#joinedDiv").html("");
            $("#joinDiv").html("");

            $(".connect_right_section").hide();
            $('#joinChannelPanel').show();

            //console.log(respons);
            $.each(respons.rooms, function(k, v) {
                if (v.title.indexOf(',') === -1) {

                    if (v.privacy === 'private') {
                        if (checkEligibilty(user_id, v.created_by, v.participants_admin)) {
                            if (v.created_by === user_id && v.privacy === 'private') {
                                //privateRoomDraw_f_admin(v, 'JD');
                            }
                        } else {
                            if (v.participants_admin.indexOf(user_id) > -1 && v.participants.indexOf(user_id) > -1 && v.participants_admin.length == 1 && v.privacy === 'private') {
                                //privateRoomDraw_f_member(v, 'JD');
                            } else if (v.participants_admin.indexOf(user_id) === -1 && v.participants.indexOf(user_id) > -1 && v.privacy === 'private') {
                                //privateRoomDraw_f_admin(v, 'JD');
                            }
                        }
                    } else {

                        if (checkEligibilty(user_id, v.created_by, v.participants_admin)) {
                            if (v.created_by === user_id && v.privacy === 'public') {
                                //privateRoomDraw_f_admin(v, 'JD');
                            }
                        } else {
                            if (v.participants_admin.indexOf(user_id) > -1 && v.participants.indexOf(user_id) > -1 && v.participants_admin.length == 1 && v.privacy === 'public') {
                                //privateRoomDraw_f_member(v, 'JD');
                            } else if (v.participants_admin.indexOf(user_id) === -1 && v.participants.indexOf(user_id) > -1 && v.privacy === 'public') {
                                //privateRoomDraw_f_admin(v, 'JD');
                            } else {
                                joinRoomDraw(v, 'J');
                            }
                        }

                        // if ($.inArray(user_id, v.participants) === -1 && v.privacy === 'public') {
                        // 	joinRoomDraw(v)
                        // }
                    }
                    checkRoomChannelHide();
                    checkRoomJoinHide();
                }
            });



            tooltipForOverLength();

        }
    });
};


function addToListPromise(uuID, conv_Id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            data: {
                conversation_id: conv_Id,
                targetID: uuID,
                company_id: company_id
            },
            dataType: 'json',
            url: '/alpha2/removeHideUserinSidebar',
            success: function(data) {
                if (data == 'success') {
                    resolve({ msg: data });
                } else {
                    reject({ msg: data });
                }
            }
        });
    })
}


var addtoList = (memberList, createdbyid, grpprivacy, selectecosystem, roomId, user_id, title) => {
    var selectecosystem = $("#workspaceList").val();

    addToListPromise(user_id, roomId)
        .then((response) => {
            if (response.msg == 'success') {
                var ststus = (grpprivacy == "public" ? "hash" : "lock");

                $("#roomBtn" + roomId).addClass('width100');
                $("#addtoList" + roomId).addClass('addlistHide');

                var design = '<li class="conv_closed"  data-myid="' + user_id + '" data-tm="' + memberList + '" data-createdby="0"  data-octr="' + createdbyid + '" data-subtitle="' + selectecosystem + '" data-conversationtype="group"  onclick="start_conversation(event)" data-nor="0" data-id="' + user_id + '" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="' + roomId + '" data-name="' + title + '" data-img="feelix.jpg" id="conv' + roomId + '">';
                design += '<span class="' + ststus + '"></span><span class="usersName">' + title + '</span>';
                design += '<span class="subroomunread"></span>';
                design += '<span class="unreadMsgCount"></span>';
                if ($('#allClosedRoomView').find('#channel_' + roomId).length == 1) {
                    design += '<span class=" closeSta" style="display:block;">[closed]</span>';
                }
                design += '</li>';
                if (!$('#conv' + roomId).is(':visible')) {
                    $('#conversation_list_sidebar').prepend(design);
                }

                sidebarLiMouseEnter();
                joinChannelPanel();
            }
        })
        .catch((err) => {
            console.log(err);
        });

};



var joinRoom = (memberList, createdbyid, grpprivacy, selectecosystem, roomId, user_id, title) => {

    if ($('#joinChanelTile' + roomId).hasClass('alreadyJoined')) {
        return false;
    } else {
        $('#joinChanelTile' + roomId).addClass('alreadyJoined')
    }
    var selectecosystem = $("#workspaceList").val();

    if (gothisroompop) {
        gothisroompop = false;
        $('#warningPopup').css('display', 'flex');
        $('#warningPopup').attr('data-type', 'gothisRoomreq');
        $('#warningPopup').attr('data-id', roomId);
        $('#warningTitle').text('Update !');
        var room_name = $('#channel_' + roomId).find('.roomGallary .chanel-name').text();
        $('#warningMessage').text('You are now a member of "#' + room_name + '" room. Would you like to visit this Room now?');
        $('.buttonAction').removeClass('bg_danger').text('Yes');
        $('.buttonCancel').text('Later');
    }

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
                var ststus = (grpprivacy == "public" ? "hash" : "lock");
                $("#roomJoin" + roomId).show();
                // $("#roomBtn" + roomId).removeClass('click-to-join').addClass('click-to-leave');
                // $("#roomBtn" + roomId).text("Leave this room");

                var design = '<li data-privacy="' + grpprivacy + '" data-myid="' + user_id + '" data-tm="' + memberList + '" data-createdby="0"  data-octr="' + createdbyid + '" data-subtitle="' + selectecosystem + '" data-conversationtype="group"  onclick="start_conversation(event)" data-nor="0" data-id="' + user_id + '" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="' + roomId + '" data-name="' + title + '" data-img="feelix.jpg" id="conv' + roomId + '">';
                design += '<span class="' + ststus + '"></span><span class="usersName">' + title + '</span>';
                design += '<span class="subroomunread"></span>';
                design += '<span class="unreadMsgCount"></span>';
                design += '</li>';
                if (!$('#conv' + roomId).is(':visible')) {
                    $('#conversation_list_sidebar').prepend(design);
                }
                if (grpprivacy == 'public') {
                    var msg_body = user_fullname + ' joined #' + title;
                    var data = {
                        type: 'join_public_room',
                        sender: user_id,
                        sender_name: user_fullname,
                        sender_img: user_img,
                        conversation_id: roomId,
                        root_conv_id: root_conv_id,
                        msg_type: 'notification',
                        msg_body: msg_body
                    }
                    sendNotificationMsg(data);
                }


                sidebarLiMouseEnter();

                if ($('#roomExistPop').is(':visible')) {
                    closeModal('roomExistPop');
                    closeRightSection();
                } else {

                    // $("#roomBtn" + roomId).attr("onclick", "leaveRoom('" + memberList + "','" + createdbyid + "', '" + grpprivacy + "' ,'" + selectecosystem + "','" + roomId + "','" + user_id + "')");
                    $("#roomBtn" + roomId).attr("onclick", "goToThisRoom(event,'" + roomId + "')");
                    $("#roomBtn" + roomId).removeClass("colorjoin").text('GO');
                    $("#roomBtn" + roomId).parent(".roomFoot").removeAttr('onclick');
                    $('#channel_' + roomId).find('.roomGallary').removeAttr('onclick');
                    $('#channel_' + roomId).attr('data-roomid', roomId);
                    $('#channel_' + roomId).attr('data-roomid', roomId);
                    $('#channel_' + roomId).attr('data-rfu', 'join');
                    $('#channel_' + roomId).attr('data-title', title);
                    $('#channel_' + roomId).attr('data-privecy', grpprivacy);
                    $('#channel_' + roomId).attr('data-keyspace', selectecosystem);
                    $('#channel_' + roomId).attr('data-participants', $('#joinChanelTile' + roomId).attr('data-participants'));
                    $('#channel_' + roomId).attr('data-admin', $('#joinChanelTile' + roomId).attr('data-admin'));
                    $('#channel_' + roomId).attr('onclick', "roomFromJOin(event,$(this).attr('data-participants'),$(this).attr('data-admin'),$(this).attr('data-roomid'),$(this).attr('data-title'),$(this).attr('data-privecy'),$(this).attr('data-keyspace'))");
                    // joinChannelPanel();
                }


            }
        }
    });
};

$('#leaveThisRoom').click(function(params) {
    var conv_id = $("#roomIdDiv").attr('data-roomid');
    var dataId = user_id;
    var memberList = $("#conv" + conv_id).attr('data-tm');
    var createdbyid = $("#conv" + conv_id).attr('data-createdby');
    var selectecosystem = 'Navigate';
    var grpprivacy = 'public';
    leaveRoom(memberList, createdbyid, grpprivacy, selectecosystem, conv_id, dataId, 'leave');
});

$('#closeThisRoom').click(function(params) {
    $('#warningPopup').css('display', 'flex');
    $('#warningPopup').attr('data-type', 'closeRoom');
    $('#warningTitle').text($('#closeThisRoom').text());
    // $('#warningMessage').text('Are you sure you want to close this Room ?');
    var design = '<h3 style="font-weight:600">Are you sure you want to <span class="action_red">close</span> this Room?</h3>'

    +'<h3>Closing this Room means users can view all existing content in the Room but can no longer make calls or send any new content to the Room.</h3>'

    +
    '<h3>This is not a permanent action and a Room can always be re-opened in the future if you like.</h3>'
    $('#warningMessage').html(design);
    $('.buttonCancel').text('Cancel');
    $('.buttonAction').addClass('bg_danger').text('Close');

});

$('#reopenThisRoom').click(function(params) {
    $('#warningPopup').css('display', 'flex');
    $('#warningPopup').attr('data-type', 'reopenRoom');
    $('#warningTitle').text($('#reopenThisRoom').text());
    $('#warningMessage').text('Are you sure you want to re-open this Room?');
    $('.buttonCancel').text('Cancel');
    $('.buttonAction').text('Re-open');
});

$('#clear_all').click(function(params) {
    // $('#warningPopup').show();
    // $('#warningPopup').attr('data-type', 'clear_all');
    // $('#warningTitle').text('Clear Message(s)');
    // $('#warningMessage').html('<h3 style="font-weight:600;">Are you sure you want to clear all the message(s) in this channel?</h3>');

    $('#clearMessages').css('display', 'flex');
    $('#deletewithmedia').removeClass('checked');
    $('#deletewithflagged').removeClass('checked');
    $('.buttonCancel').text('Cancel');
    $('.buttonAction').addClass('bg_danger').text('Clear');
});

$('#clear_all_deleted_msg').click(function(params) {
    $('#warningPopup').css('display', 'flex');
    $('#warningPopup').attr('data-type', 'clear_all_deleted_msg');
    $('#warningTitle').text('Remove Deleted Message(s)');
    $('#warningMessage').html('<h3 style="font-weight:600;">Are you sure you want to remove all deleted message(s) from this channel?</h3>');
    $('.buttonCancel').text('Cancel');
    $('.buttonAction').addClass('bg_danger').text('Remove');
});

function actionWarning(type) {
    if (type == 'clear_all_notification') {
        socket.emit('update_notification', { user_id: user_id, update_type: 'delete_all_noti' });
        setTimeout(function() {
            start_conversation('notification');
        }, 1500)
    } else
    if (type == 'convert_to_main') {
        socket.emit('convert_conversation', { conversation_id: conversation_id, root_conv_id: null, company_id: company_id, user_id: user_id }, function(res) {
            // console.log(28514, res);
            if (res.status) {
                $('#conv' + conversation_id).removeClass('itssubconvhide');
                $('#conv' + conversation_id).trigger('click');
                socket.emit("room_converted_emit", { type: "subroom2mainroom", conversation_id, old_root_conv_id: res.root_conv_id }, function(result) {
                    // console.log(28518);
                    // if(result.rootconvdata.participants.indexOf(user_id) == -1){
                    // 	$("#conv"+result.rootconvdata.conversation_id).remove();
                    // }
                });
            }
        })
    } else
    if (type == 'delete_link_single') {
        var id = $('#warningPopup').attr('link-id');
        var data = {
            url_id: id,
            conversation_id: conversation_id,
            user_id: user_id
        }
        socket.emit('hidethisurl', data, function(callback) {
            if (callback.status) {
                if ($('#links' + id).closest('.date-by-links').children().length == 2) {
                    $('#links' + id).closest('.date-by-links').remove();
                } else {
                    $('#links' + id).remove();
                }
                var a = $("#mediaLinksTab").text();
                var b = Number(a.replace(/[a-zA-Z()]/g, "")) - 1;
                $("#mediaLinksTab").html("<a>Links (" + b + ")</a>");
                if ($('#mediaLinks .all-links').length == 0) {
                    $('#mediaLinks').addClass('flex_class')
                    $('#mediaLinks').append('<h2 class="notFoundMsg" style="display: block;">No link(s) were found in this channel !</h2>')
                    $('.individual-tab-seach-con').hide();
                } else {
                    $('.individual-tab-seach-con').show();
                }
            }
        });
    } else if (type == 'delete_tag') {
        var tag_id = $('#warningPopup').attr('tag-id');
        $('#AllTagList').find('.tag_id_' + tag_id).remove();
        $('.tag_id_' + tag_id).remove();
        delteMyTagV2({ tag_id: tag_id, type: 'conv' });
        $('.tag_name_view_' + tag_id).remove();
        tag_counterSet('private', false)

    } else if (type == 'removeShare') {
        var tag_id = $('#warningPopup').attr('tag-id');
        $('#thisTagId_' + tag_id).parent('div').find('.shared_icon').removeClass('active');
        $('.tag_id_' + tag_id).css('border-color', 'var(--PrimaryC)');
        $('.tag_id_' + tag_id).removeClass('shared_tag_user');
        $('.tag_name_view_' + tag_id).removeClass('shared_tag_user');
        $('.tag_id_' + tag_id).removeClass('shared_tag_only');
        $('.tag_id_' + tag_id).addClass('notShared');
        changeShareTagC(tag_id, false);
        socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: null }, function(res) {
            socket.emit('updateTeamtagListperMsgBrocast', { type: 'removeShare', tag_id: tag_id });
            // console.log(res);
        })
    } else if (type == 'addShare') {
        var tag_id = $('#warningPopup').attr('tag-id');
        $('#thisTagId_' + tag_id).parent('div').find('.shared_icon').addClass('active');
        $('.tag_id_' + tag_id).css('border-color', 'var(--PrimaryC');
        $('.tag_id_' + tag_id).addClass('shared_tag_user');
        $('.tag_name_view_' + tag_id).addClass('shared_tag_user');
        $('.tag_id_' + tag_id).addClass('shared_tag_only');
        $('.tag_id_' + tag_id).removeClass('notShared');
        changeShareTagC(tag_id, true);
        socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: user_id }, function(res) {
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (v.tag_id == tag_id) {
                        socket.emit('updateTeamtagListperMsgBrocast', { type: 'addShare', tag_id: tag_id, user_id: user_id, tag: allUserTagList[k], oldAddedtag: oldAddedtag });
                    }
                }
            });
            // console.log(res);
        })

    } else if (type == 'delete_room') {
        if ($("#roomIdDiv").attr('data-roomid') != '') {
            socket.emit('room_delete_emit', { conversation_id: $("#roomIdDiv").attr('data-roomid'), company_id: company_id }, function(res) {
                // console.log(res);
            })
        }

    } else if (type == 'closeRoom') {
        var conv_id = $("#roomIdDiv").attr('data-roomid');
        var dataId = user_id;
        var dataId_name = user_fullname;
        var dataId_img = user_img;
        var memberList = $("#conv" + conv_id).attr('data-tm');
        var createdbyid = $("#conv" + conv_id).attr('data-createdby');

        closeRoom(conv_id, dataId, dataId_name, dataId_img);
    } else if (type == 'reopenRoom') {
        var conv_id = $("#roomIdDiv").attr('data-roomid');
        var dataId = user_id;
        var dataId_name = user_fullname;
        var dataId_img = user_img;
        var memberList = $("#conv" + conv_id).attr('data-tm');
        var createdbyid = $("#conv" + conv_id).attr('data-createdby');
        reopenThisRoom(conv_id, dataId, dataId_name, dataId_img, company_id);
    } else if (type == 'clear_all') {
        var data = { conversation_id, user_id, allmyUnreadThread };
        socket.emit('clear_conv', data, (res) => {
            if (res.status) {
                // console.log(res)
                $('#conv' + conversation_id).removeClass('sideActive').trigger('click');
                // var nor = Number($('#conv'+conversation_id).attr('data-nor'));
                // $('#conv'+conversation_id).attr('data-nor', '');
                // if(nor>0){
                // 	var cn = Number($(".thread_message span").text());
                // 	if(cn == nor)
                // 		$(".thread_message").hide();
                // 	$(".thread_message span").text(cn-nor);
                // }
            } else {
                // console.log(res);
            }
            $('.moreMenuPopup').hide();
        });
        // toastr.options.closeButton = true;
        // toastr.options.timeOut = 2000;
        // toastr.options.extendedTimeOut = 2000;
        // toastr.options.onShown = function() {
        // 	setTimeout(function(){
        // 		if(undoAll_action.indexOf(conversation_id) !== -1){
        // 			removeA(undoAll_action, conversation_id);
        // 		}else{
        // 			var data = {conversation_id, user_id};
        // 			socket.emit('clear_conv', data, (res)=>{
        // 				if(res.status){
        // 					$('#msg-container').html("");
        // 					update_localstorage_clear(conversation_id, user_id);
        // 				}else{
        // 					console.log(res);
        // 				}
        // 				$('.moreMenuPopup').hide();
        // 			});
        // 		}
        // 		toastr.remove();
        // 	 }, 2600);
        // }
        // toastr.options.onclick = function(event) {
        // 	if($(event.target).hasClass('undoAllMessages')){
        // 		undoAll_action.push(conversation_id);
        // 		toastr.remove();
        // 	}
        // }
        // toastr.options.onCloseClick = function() {
        // 	var data = {conversation_id, user_id};
        // 	socket.emit('clear_conv', data, (res)=>{
        // 		if(res.status){
        // 			$('#msg-container').html("");
        // 		}else{
        // 			console.log(res);
        // 		}
        // 		$('.moreMenuPopup').hide();
        // 	});
        // 	toastr.remove();
        // }
        // toastr["info"]('<div>If you want all messages(s) !<br> Then click to undo button.</div><div><button type="button" class="btn btn-accept undoAllMessages">Undo</button></div>');
    } else if (type == 'leave_room') {
        var conv_id = $("#roomIdDiv").attr('data-roomid');
        var dataId = user_id;
        var memberList = $("#conv" + conv_id).attr('data-tm');
        var createdbyid = $("#conv" + conv_id).attr('data-createdby');
        var selectecosystem = 'Navigate';
        var grpprivacy = 'public';
        leaveRoom(memberList, createdbyid, grpprivacy, selectecosystem, conv_id, dataId, 'leave');
        // toastr.options.closeButton = true;
        // toastr.options.timeOut = 2000;
        // toastr.options.extendedTimeOut = 2000;
        // toastr.options.onShown = function() {
        // 	setTimeout(function(){
        // 		if(undoAll_action.indexOf(conv_id) !== -1){
        // 			removeA(undoAll_action, conv_id);
        // 		}else{
        // 			leaveRoom(memberList, createdbyid, grpprivacy, selectecosystem, conv_id, dataId, 'leave');
        // 		}
        // 		toastr.remove();
        // 	 }, 2600);
        // }
        // toastr.options.onclick = function(event) {
        // 	if($(event.target).hasClass('undoLeave')){
        // 		undoAll_action.push(conv_id);
        // 		toastr.remove();
        // 	}
        // }
        // toastr.options.onCloseClick = function() {
        // 	leaveRoom(memberList, createdbyid, grpprivacy, selectecosystem, conv_id, dataId, 'leave');
        // 	toastr.remove();
        // }
        // toastr["info"]('<div>If you want this room, then click to undo button.</div><div><button type="button" class="btn btn-accept undoLeave">Undo</button></div>');
    } else if (type == 'delete_selected_msgs') {
        var data = { msg_id: selectedMessages, user_id, participants: get_conversation_obj(conversation_id).participants, conversation_id, type: "for_me", main_conv_id: "" };
        // socket.emit("delete_selected_msgs", data, (res) => {
        socket.emit("delete_message_last_time", data, (res) => {
            if (res.status) {
                // console.log(res);
                var key = has_conv_into_local(conversation_id);
                $.each(selectedMessages, function(k, v) {
                    //update_local_conv_msg_delete(key, v);
                    // var h4data = $('.msg_id_' + v).find('.user-msg>h4').html();
                    // $('.msg_id_' + v).addClass('deleted');
                    // var delhtml = '<p> <i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message.</i><span onclick="permanent_delete_silently(\'' + v + '\')" class="silent_delete"> (Remove this line)</span></p>';
                    // $('.msg_id_' + v).find('.user-msg').html('<h4>' + h4data + '</h4>' + delhtml);
                    // $('.msg_id_' + v).find('.msg-more-popup>p').last().attr('onclick', 'delete_permanently(event)');
                    $('.msg_id_' + v).remove();
                    permanent_delete_silently(v);
                });
                var ele = $("#selectMessage");
                selectMessageOn(ele);

            }
        });
    } else if (type == 'confirm_delete_image') {
        // console.log(temp_img_msgid);
        var msg_ele = $('.msg_id_' + temp_img_msgid[0]);
        if ($(msg_ele).find('.user-msg').attr('data-senderid') == user_id) {
            var msg_id = temp_img_msgid[0];
            var src = temp_img_msgid[1];
            src = src.replace(file_server, "");
            var attch_list = [src.substring((src.indexOf("/") + 1))];
            socket.emit('edit_msg_attch_list', { conversation_id, msg_id, bucket_name, src, attch_list }, (rep) => {
                // console.log(rep);
                $.ajax({
                    url: '/s3Local/deleteObjects',
                    type: 'POST',
                    data: { bucket_name: bucket_name, attch_list: JSON.stringify(attch_list) },
                    dataType: 'JSON',
                    success: function(resfile) {
                        var slno = $(msg_ele).find('.is-loaded').last().attr('class');
                        slno = slno.replace("msg_per_img_div", "").replace("perimgsl_", "").replace("is-loaded", "").replace("hidden", "").trim();
                        $(msg_ele).find('.showmore_' + slno).remove();
                        var plushtml = '<div class="msg_per_img_div showmore_' + slno + '" onclick="loadnext8(this, ' + slno + ');" style="cursor:pointer"><img src="/images/basicAssets/Top Nav - Plus.svg" style="margin-top: 20%;width: 50px;"><br>View More</div>';
                        slno++;
                        $(msg_ele).find('.perimgsl_' + slno).show();
                        $(msg_ele).find('.perimgsl_' + slno).after(plushtml);
                        $.each($(msg_ele).find('.img_attach'), function(k, v) {
                            if ($(v).attr('data-src') == temp_img_msgid[1]) {
                                $(v).closest('.msg_per_img_div').remove();
                                return false;
                            }
                        });
                        // console.log('deletethisimg line 7100 ', resfile);
                    },
                    error: function(error) {
                        // console.log('deletethisimg error ', error);
                    }
                });
            });

        } else {
            // alert("You are not allowed to delete this file.");

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('You are not allowed to delete this file.');
        }

        closeModal('imageDeleteWarning');
    } else if (type == 'clear_all_deleted_msg') {
        var data = {
            conversation_id: conversation_id,
            user_id: user_id
        }
        socket.emit('clear_all_deleted_msg', data, function(res) {
                if (res.status) {
                    if (data.conversation_id == conversation_id) {
                        $('#conv' + conversation_id).removeClass('sideActive');
                        $('#conv' + conversation_id).trigger('click');
                    }
                }
            })
            // $.each($('.msgs-form-users.deleted'),function(k,v){
            // 	$(v).find('.silent_delete').trigger('click');
            // })

    } else if (type == 'joinroomReq') {
        $('#roomBtnforClick' + $('#warningPopup').attr('data-id')).trigger('click');
    } else if (type == 'gothisRoomreq') {
        $('#conv' + $('#warningPopup').attr('data-id')).trigger('click');
    } else if (type == 'change_profile') {
        var data = {
                img: $('#useronchangeimgvalue').val(),
                fullname: $('#editUserProfileName').val(),
                id: user_id,
                company_id: company_id
            }
            // console.log(1404,data)
        if (data.img != '' && data.fullname != '') {
            socket.emit('update_user_profile', data, function(res) {
                closeModal('editProfile');
                if (res.status) {
                    // console.log('success Profile Change');
                }
            })
        }

    } else if (type == 'call_reset_url') {
        warning = true;
        if (reset_type == 'group') {
            // $('#call_reseturl_btn').trigger('click');
            call_reset_url('group')
        } else {
            // $('#presonal_callerIdreset').trigger('click');
            call_reset_url('profile')
        }
    } else if (type == 'delete_link') {
        var alll_items = $('#mediaLinks .all-links');
        var all_link_id = []
        $.each(alll_items, function(k, v) {
            var data = $(v).find('.hyvenCheckbox').attr('data');
            if ($(v).find('.hyvenCheckbox').hasClass('checked')) {
                all_link_id.push($(v).attr('data_id'));
                $(v).remove();
            }
        });

        var a = $("#mediaLinksTab").text();
        var b = Number(a.replace(/[a-zA-Z()]/g, "")) - 1;
        $("#mediaLinksTab").html("<a>Links (" + b + ")</a>");
        if ($('#mediaLinks .all-links').length == 0) {
            $('#mediaLinks').addClass('flex_class')
            $('#mediaLinks').append('<h2 class="notFoundMsg" style="display: block;">No link(s) were found in this channel !</h2>')
            $('.individual-tab-seach-con').hide();
        } else {
            $('.individual-tab-seach-con').show();
        }
        selectedMediaLinkTempArray = [];
        $('#media_Action_Div').hide();

        socket.emit('delete_selected_link', { url_id: all_link_id, conversation_id: conversation_id, user_id: user_id }, function(res) {
            // console.log(res)
        });
    } else if (type == 'submit_tag') {
        submitTagOption(true);
    } else if (type == 'delete_link_signle') {
        socket.emit('delete_link_signle', { url_id: $('#warningPopup').attr('link-id'), user_id: user_id, conversation_id: conversation_id }, function(res) {
            if (res.status) {
                if ($('#links' + $('#warningPopup').attr('link-id')).parent('.date-by-links').find('.all-links').length == 1) {
                    $('#links' + $('#warningPopup').attr('link-id')).parent('.date-by-links').remove();
                } else {
                    $('#links' + $('#warningPopup').attr('link-id')).remove();
                }
            }
        })
    }

    closeModal('warningPopup');
}

function flagSelectedMsg() {
    if (selectedMessages.length > 0) {
        $.each(selectedMessages, function(k, v) {
            var ele = $("#data_msg_body" + v);
            flagunflag(ele);
            if (selectedMessages.length == (k + 1)) {
                var ele = $("#selectMessage");
                selectMessageOn(ele);
            }
        });
    }
}

var undoAll_action = [];
// function undoclear_all_messages(id){
// 	undoAll_messags_action.push(id);
// }

$('#hideThisRoom').click(function(params) {

    $('#warningPopup').css('display', 'flex');
    $('#warningPopup').attr('data-type', 'leave_room');
    if ($('#hideThisRoom').text() == 'Delete this room') {
        $('#warningMessage').text('Are you sure you want to delete this room permanently ?');
        $('#warningTitle').text($('#hideThisRoom').text());
        $('.buttonAction').addClass('bg_danger').text('Delete');
    } else if ($('#hideThisRoom').text() == 'Delete this group') {
        $('#warningMessage').text('Are you sure you want to delete this group permanently ?');
        $('#warningTitle').text($('#hideThisRoom').text());
        $('.buttonAction').addClass('bg_danger').text('Delete');
    } else {
        $('#warningMessage').text('Are you sure you want to leave this thread ?');
        $('#warningTitle').text($('#hideThisRoom').text());
        $('.buttonAction').addClass('bg_danger').text('Leave');
    }
    $('.buttonCancel').text('Cancel');

});

function reopenThisRoom(conv_id, dataId, dataId_name, dataId_img) {
    var data = {
        conv_id,
        dataId,
        dataId_name,
        dataId_img,
        conv_type: 'active',
        company_id
    }
    socket.emit('reopenThisRoom', data, function(response) {
        if (response.msg == "success") {
            draw_msg(response.data);

            $('#clear_all').show();
            $('#selectMessage').show();
            $('#callNotifications').show();
            $('#viewMuteNotification').show();
            $('#clear_all_deleted_msg').show();

            $('#leaveThisRoom').hide();
            $('#closeThisRoom').show();
            $('#reopenThisRoom').hide();
            $('#reOpenThisRoomBtn').hide();
            $('#hideThisRoom').hide();

            $(".chat-head-name").css('pointer-events', 'auto');
            $(".chat-head-more-menu").css('pointer-events', 'auto');
            $(".pin-unpin").css('pointer-events', 'auto');
            $(".tagged").css('pointer-events', 'auto');
            $(".media").css('pointer-events', 'auto');
            $("#msg").css('pointer-events', 'auto');
            $(".msgs-form-users").css('pointer-events', 'auto');
            $("#msg").attr('contenteditable', true);
            $("#msg").focus();
            $("#msg").attr('placeholder', 'Message ' + $('.converstaion_name').text());
            $("#msg").focus();
            $('.moreMenuPopup').hide();

            $(".send-msgs .send-emoji").show();
            $(".send-msgs .send-attach-file").show();
            $(".send-msgs .circle_up_arrow").show();
            $(".send-msgs #msgCheckListBtn").show();
            $("body").removeClass('room_closed');
            $("#msg").css({ 'opacity': '1', 'border': '1px solid var(--PrimaryC)' });

            $("#conv" + conv_id).find('.closeSta').hide();
            $("#conv" + conv_id).removeClass('conv_closed');
        }
    });
}

function closeRoom(conv_id, dataId, dataId_name, dataId_img) {
    var data = {
        conv_id,
        dataId,
        dataId_name,
        dataId_img,
        conv_type: 'close',
        company_id: company_id
    }
    socket.emit('closeRoom', data, function(response) {
        if (response.msg == "success") {
            draw_msg(response.data);

            $('#clear_all').hide();
            $('#selectMessage').hide();
            $('#leaveThisRoom').hide();
            $('#closeThisRoom').hide();
            $('#callNotifications').hide();
            $('#viewMuteNotification').hide();
            $('#clear_all_deleted_msg').hide();

            $('#hideThisRoom').show();
            $('#reopenThisRoom').show();
            $('#reOpenThisRoomBtn').show();
            // $('.moreMenuPopup').attr('room-status','closed');

            $(".chat-head-name").css('pointer-events', 'auto');
            $(".chat-head-more-menu").css('pointer-events', 'none');
            $(".pin-unpin").css('pointer-events', 'none');
            $(".tagged").css('pointer-events', 'none');
            $(".media").css('pointer-events', 'none');
            $("#msg").css('pointer-events', 'none');
            $(".msgs-form-users").css('pointer-events', 'none');
            $("#msg").attr('contenteditable', false);
            $("#msg").blur();
            $("#msg").text('');
            $('.moreMenuPopup').hide();
            $('#closeRoomMsg').html('This room has been closed by you on ' + moment(new Date().getTime()).format('DD-MM-YYYY') + ' at ' + moment(new Date().getTime()).format('LT') + '')
            $("#msg").attr('placeholder', 'This room has been closed by you on ' + moment(new Date().getTime()).format('DD-MM-YYYY') + ' at ' + moment(new Date().getTime()).format('LT') + '');
            // moment(new Date().getTime()).format('DD-MM-YYYY LT')
            $(".send-msgs .send-emoji").hide();
            $(".send-msgs .send-attach-file").hide();
            $(".send-msgs .circle_up_arrow").hide();
            $(".send-msgs #msgCheckListBtn").hide();
            // $("#closeRoomLabel").show();
            //close_room_offf
            $("body").addClass('room_closed');
            // $("#msg").css({'opacity':'0.7','border':'1px solid var(--AIC)'});

            $("#conv" + conv_id).find('.closeSta').show();
            $("#conv" + conv_id).addClass('conv_closed');

            $("#searchBefore").css('pointer-events', 'none');
            $(".name_and_profile").css('pointer-events', 'none');
            // $("#viewlistUpdateroom").css('pointer-events', 'none');
            $(".channel-name").css('pointer-events', 'none');
            $("#updateWorkspaceTeam").css('pointer-events', 'none');
            $("#business_unitUpdate").css('pointer-events', 'none');
            $(".select-ecosystem").css('pointer-events', 'none');
            $(".upload-channel-photo").css('pointer-events', 'none');
            $(".file-up-div label").css('pointer-events', 'none');
            $("#forAdminBtn .create").css('pointer-events', 'none');
        }
    });
}

function hidethisroom(conv_id, dataId, dataId_name, dataId_img) {
    var data = {
        conv_id,
        dataId,
        dataId_name,
        dataId_img,
        company_id
    }
    socket.emit('hideroom', data, function(response) {
        // console.log(response);
        if (response.msg == "success") {
            if ($("#conv" + conv_id).hasClass('sideActive')) {
                $("#conv" + dataId).trigger('click');
                $("#conv" + conv_id).remove();
                $('.moreMenuPopup').hide();
            }
        }
    });
}

var makeAdminToast = () => {
    // toastr.options.closeButton = true;
    // toastr.options.timeOut = 2000;
    // toastr.options.extendedTimeOut = 1000;
    // toastr["warning"]("Add a member first", "Warning");
}

var leaveRoom = (memberList, createdbyid, grpprivacy, selectecosystem, roomId, user_id, type = "leave") => {

    var roomTitle = $("#roomTitle" + roomId).text();
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: roomId,
            targetID: user_id,
            type: type,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/leave_room',
        success: function(data) {
            if (data.msg == 'success') {
                $("#conv" + roomId).remove();
                if ($("#joinChannelPanel").is(':visible')) {
                    $("#roomJoin" + roomId).hide();
                    $("#roomBtn" + roomId).removeClass('click-to-leave').addClass('click-to-join');
                    $("#roomBtn" + roomId).text("Join this room");
                    $("#roomBtn" + roomId).attr("onclick", "joinRoom('" + memberList + "','" + createdbyid + "', '" + grpprivacy + "' ,'" + selectecosystem + "','" + roomId + "','" + user_id + "','" + roomTitle + "')");

                    if ($("#conv" + roomId).hasClass('active')) {
                        closeRightSection();
                    }

                    if (grpprivacy == 'private') {
                        $("#channel_" + roomId).remove();
                    }

                    joinChannelPanel();

                } else {
                    if ($('#roomExistPop').is(':visible')) {
                        closeModal('roomExistPop');
                    } else {

                        // $('.moreMenuPopup').hide();
                        // $("#conv"+user_id).trigger('click');
                    }
                }
                if (conversation_id == roomId) {
                    $('.moreMenuPopup').hide();
                    $('#conv' + user_id).trigger('click');
                }
                var msg_body = user_fullname + ' left the room';
                var data = {
                    type: 'leave_room',
                    sender: user_id,
                    sender_name: user_fullname,
                    sender_img: user_img,
                    conversation_id: roomId,
                    root_conv_id: root_conv_id,
                    msg_type: 'notification',
                    msg_body: msg_body
                }
                sendNotificationMsg(data);

            } else if (data.msg == 'nomem') {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("Add a member first", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Add a member first.');

            } else if (data.msg == 'delete') {
                var conv_participants = data.conversation.participants;
                var title = data.conversation.title;
                socket.emit('roomdelete', { conv_participants, user_fullname, title, user_id, roomId });


                if ($("#createChannelContainer").is(':visible')) {
                    if ($("#conv" + roomId).hasClass('sideActive')) {
                        closeRightSection();
                        $("#conv" + user_id).click();
                    }
                }

                if ($("#conv" + roomId).hasClass('sideActive')) {
                    $("#conv" + user_id).trigger('click');
                }

                $("#conv" + roomId).remove();

                $('#delete_msg_div').hide();
                $('.moreMenuPopup').hide();
            } else {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("You can't remove", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('You can\'t remove.');
            }

            if ($('#joinChannelPanel').is(':visible')) {
                $("#addtoList" + roomId).addClass('addlistHide');
                $("#roomBtn" + roomId).addClass('width100');
            }
        }
    });
};


function returnRoomMinide(v, type) {
    var conversation_id = $('#roomIdDiv').attr('data-roomid');
    if (type == 'add') {
        var html = '<div class="email_profile addRoom  _miniMList_' + v.id + '" user-type="member">'
    } else {

        var html = '<div class="email_profile  updateRoomMini _miniMList_' + v.id + '" user-type="' + ((adminArra.indexOf(v.id) > -1) ? 'admin' : 'member') + '" >'
    }
    html += '<span class="tempE img">'
    html += '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '">'
    html += '</span>'
    html += '<p class="tempE email">' + v.fullname + '</p>'
    if (type == 'add') {
        html += '<span class="tempE tempRemove" onclick="removeThisMemberList(\'' + v.fullname + '\',\'' + v.id + '\')" data-id="' + v.id + '"></span>'
    } else {
        if (type == 'tempo') {
            html += '<span class="tempE tempRemove" onclick="removeTempoArray(\'' + v.fullname + '\',\'' + v.id + '\')" data-id="' + v.id + '"></span>'
        } else {

            if (adminArra.indexOf(user_id) > -1) {
                if (adminArra.length > 1) {
                    if (adminArra.indexOf(v.id) > -1) {

                        html += '<span class="tempE tempRemove" onclick="makeMember(\'' + v.img + '\',\'' + v.fullname + '\',\'' + v.designation + '\',\'' + v.id + '\',\'' + conversation_id + '\')" data-id="' + v.id + '"></span>'
                    } else {
                        html += '<span class="tempE tempRemove" onclick="removeMember(\'member\',\'' + v.id + '\',\'' + conversation_id + '\')" data-id="' + v.id + '"></span>'

                    }
                } else {
                    if (v.id !== user_id) {
                        if (adminArra.indexOf(v.id) > -1) {

                            html += '<span class="tempE tempRemove" onclick="makeMember(\'' + v.img + '\',\'' + v.fullname + '\',\'' + v.designation + '\',\'' + v.id + '\',\'' + conversation_id + '\')" data-id="' + v.id + '"></span>'
                        } else {
                            html += '<span class="tempE tempRemove" onclick="removeMember(\'member\',\'' + v.id + '\',\'' + conversation_id + '\')" data-id="' + v.id + '"></span>'

                        }
                    }
                }
            }
        }
    }
    html += '</div>';

    return html;
}

function returnRoomMListDe(v) {
    if (!has_permission(v.id, GUEST)) {
        //old onlick addroomMember()
        var html = '<li class="showEl" onclick="addTemppMember(event,this)" data-id="' + v.id + '" data-img="' + v.img + '" data-name="' + v.fullname + '">' +
            '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">' +
            '<span class="name s-l-def-clas">' + v.fullname + '</span>' +
            '<span class="designation-name">[' + v.email + ']</span>' +
            '</li>';
        return html;
    }
}

function returnGuestRoomMListDe(v) {
    if (has_permission(v.id, GUEST)) {
        //old onlick addroomMember()
        var html = '<li class="showEl" onclick="addTemppMember(event,this)" data-id="' + v.id + '" data-img="' + v.img + '" data-name="' + v.fullname + '">' +
            '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">' +
            '<span class="name s-l-def-clas">' + v.fullname + '</span>' +
            ' <span class="designation-name">[' + v.email + ']</span>' +
            '</li>';
        return html;
    }
}


function rethisuserInRoom(elm, type) {

}
var tempoRoomUpdateArray = [];

function addTemppMember(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var mydata = {
        id: $(elm).attr('data-id'),
        fullname: $(elm).attr('data-name'),
        img: $(elm).attr('data-img')
    }
    $(elm).remove();

    if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
        // $('#memberAddBtn').show();
        var subtitle = $(elm).find('.designation-name').text();
        //$('#inviteMemberBox').prepend(returnRoomMinide(mydata,'tempo'));
        $('#updatenewMemberMini').prepend(mini_itemDesign(mydata, 'tempo'));
        tempoRoomUpdateArray.push(mydata.id);
        $('#updatenewMemberMini').next('input').val('');
        $('#updatenewMemberMini').next('input').focus();
        submitActiveClass('updateMemberPopup', tempoRoomUpdateArray.length);
    } else {
        memberList.push(mydata.fullname);
        memberListUUID.push(mydata.id);
        $("#numbers").text(parseInt(memberList.length) + 1);
        $('#newlyAddmembers').prepend(returnRoomMinide(mydata, 'add'));
        $('#addnewMemberMini').next('input').val('');
        $('#addnewMemberMini').next('input').focus();
    }

    $("#updateMemberPopup #updateRoomListMember2 li").show();
    $("#updateMemberPopup #search_member_update").val("");
}

function removeTempoArray(name, id) {
    removeA(tempoRoomUpdateArray, id);
    $('._miniMList_' + id).remove();
    $('._mini_item_' + id).remove();
    // if(tempoRoomUpdateArray.length == 0){
    // 	$('#memberAddBtn').hide()
    // }
    $.each(allUserdata[0].users, function(ky, va) {
        if (id == va.id) {
            $('#updateRoomListMember').append(returnRoomMListDe(va));
            $('#updateRoomListMember2').append(returnGuestRoomMListDe(va));

        }
    });

    submitActiveClass('updateMemberPopup', tempoRoomUpdateArray.length);
    $("#updateMemberPopup #updateRoomListMember2 li").show();
    $("#updateMemberPopup #search_member_update").val("");
}


var changeTS = false;
var team_user_list = [];
var invite_status = [];

function re_invite_btn(id) {
    // console.log(2188, id)
    for (let n = 0; n < invite_status.length; n++) {
        // console.log(2491, invite_status[n], invite_status[n].invite_to.toString() == id)
        if (invite_status[n].invite_to.toString() == id) {
            if (invite_status[n].status == "Invited") {
                return '<span class="add-admin add2 GroupFlRight arfImg" onclick="action_guest_invite(\'invite\', \'' + id + '\',event)">Reinvite</span><span class="invitation_status">Invitation Sent</span>';
            } else if (invite_status[n].status == "Accepted") {
                return '<span class="invitation_status">Accepted</span>';
            } else if (invite_status[n].status == "Viewed") {
                return '<span class="invitation_status" data-balloon="Last viewed at ' + moment(invite_status[n].invite_time).format('YYYY-MM-DD LT') + '" data-balloon-pos="up">Viewed</span>';
            } else {
                return '<span data-type="invite" class="add-admin sendinvitebtn add2 GroupFlRight arfImg" onclick="action_guest_invite(\'invite\', \'' + id + '\',event)"></span><span class="invitation_status"></span>';
            }
        }
    }
    return '<span data-type="invite" class="add-admin sendinvitebtn add2 GroupFlRight arfImg" onclick="action_guest_invite(\'invite\', \'' + id + '\',event)"></span><span class="invitation_status"></span>';
}
var roomEdit = (event, roomid, title, privecy, keyspace, rromimg) => {
    $('#updatechannelContainer').attr({ 'conv-id': roomid, 'room-title': title });
    lastPopup = '';
    prevConvid = $('li.sideActive').attr('data-conversationid');
    $('#findUserForRoom').prop('disabled', 'disabled')
    changeTS = false;

    if ($(event.target).parent('.msg-user-photo').length == 2) {
        // event.preventDefault();
    } else {
        PVM = false;
        if (privecy == 'protected') {
            // $('#viewlistUpdateroom .member_list').hide();
            $('#viewlistUpdateroom .member_list').show();
            $('body').addClass('protected');
        } else {
            $('#viewlistUpdateroom .member_list').show();
            $('body').removeClass('protected');
        }
        // console.log('axx',$('#updatechannelContainer').attr('has-admin'));
        $('#callerid_url').val('');
        $('#call_copyurl_btn').css("visibility", "hidden");
        $('#call_reseturl_btn').css("visibility", "hidden");

        socket.emit('getConvTagId', { conversation_id: conversation_id, company_id: company_id }, function(res) {
            if (res.status) {
                $('#callerid_url').val(window.location.origin + "/call/" + res.vgd);
                $('#call_copyurl_btn').css("visibility", "visible");
                $('#call_reseturl_btn').css("visibility", "visible");
                var taglist = res.data[0].tag_list;
                if (taglist == null) {
                    taglist = [];
                }
                if (adminArra.indexOf(user_id) == -1) {
                    $('#updateMessageTag .hayven_Modal_Content').css('pointer-events', 'none');
                } else {
                    $('#updateMessageTag .hayven_Modal_Content').css('pointer-events', 'auto');
                }
                $('#AllTagList').html('');
                $('#updateMsgTagContainer').html('');
                $('#convTagslistmini').html('');
                $.each(allUserTagList, function(k, v) {
                    if (v != undefined) {
                        if (taglist.indexOf(v.tag_id) > -1) {
                            $('#updateMsgTagContainer').prepend('<div class="item"><p class="valtext">' + v.title + '</p><span class="valremove" data-val="' + v.title + '" tag-id="' + v.tag_id + '" onclick="removeConvTag(this)" data-balloon="Remove tag" data-balloon-pos="up"></span></div>')
                            $('#convTagslistmini').prepend('<div class="item convTagslistmini_' + v.tag_id + '"><p class="valtext">' + v.title + '</p></div>')
                        } else {

                            $('#AllTagList').prepend('<div style="border-color:' + getTagColor(v.tag_id) + '"  onclick="tagOnCov(this,event)" class="tag tag_id_' + v.tag_id + '" data-id="' + v.tag_id + '" conv-id="' + conversation_id + '"><span class="color_defiendBtn" style="background-color:' + getTagColor(v.tag_id) + '"></span><span id="thisTagIdConv_' + v.tag_id + '" class="this_title" data-id="' + v.tag_id + '" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)">' + v.title + '</span>' + getSharedTagUserName(v.tag_id) + '<span class="removeIcon" data-balloon="Delete" data-balloon-pos="up"></span><span class="editIcon" data-balloon="Edit" data-balloon-pos="up"></span></div>');
                        }
                    }
                });
                $('#updateMsgTagContainer input').focus();
            }
        })
        $(".connect_right_section").hide();
        // $('#createChannelContainer').show();
        $('#updatechannelContainer').show();
        $('#updatechannelContainer').attr('data-esc', true);

        $('#createChannelContainer').attr('update-action', true);
        $('.photo-upload-invite-member').css('width', '100%');
        // $('#createChannelContainer .submitBtn').addClass('hideElm');
        $('.memberList').show();
        $("#ml-listHl").html("");
        $("#guestml-listHl").html("");
        // $("#updatenewMemberMini").html("");
        // $("#ml-listHA").html("");
        $("#updateRoomTitle").val(title);
        $("#room_title_edit").text(title);
        $("#room_title_edit").attr('class', 'create-topic-heading conv_nickname_' + conversation_id + '');
        $("#room_title_edit").attr('onclick', 'editCustomTitle(\'conv_title\',\'' + conversation_id + '\',\'' + title + '\')');
        changeAllCustomTitle();
        $("#demoImg").attr('src', '/upload/' + rromimg);
        $("#updateRoomImg").attr('src', '' + file_server + 'room-images-uploads/Photos/' + rromimg);
        if (rromimg == 'feelix.jpg') {
            $('#forClearRoomImg').hide();
        } else {
            $('#forClearRoomImg').show();
        }

        $("#upload-channel-photo").attr("onchange", "roomImageUpdate(\'" + roomid + "\',event,this.files)");
        $("#updateImgInput").attr("onchange", "roomImageUpdate(\'" + roomid + "\',event,this.files)");

        $(".submitBtn").hide();
        $(".create-channel-heading").text("Update Room");
        // $("#updateWorkspaceTeam .select-ecosystem").select2();
        $("#updateWorkspaceTeam .select-ecosystem").html("");

        for (var i = 0; i < allteams.length; i++) {
            var selected = (allteams[i].team_id == keyspace) ? 'selected' : '';
            var opt = '<option value="' + allteams[i].team_id + '" ' + selected + '>' + allteams[i].team_title + '</option>';
            $("#updateWorkspaceTeam .select-ecosystem").append(opt);
        }

        // $("#updateWorkspaceTeam option").each(function(){
        // 	if($(this).val() == keyspace){ // match here
        // 		$(this).attr("selected","selected");
        // 	}
        // });

        // This line use for checking room update or room create
        $("#roomIdDiv").attr('data-rfu', 'ready');


        // $("#select-ecosystemUpdate option").each(function(){
        // 	if($(this).val() == keyspace){ // match here
        // 		$(this).attr("selected","selected");
        // 	}
        // });

        var topic_type = $("#roomIdDiv").attr('topic-type');
        $('#updatechannelContainer [name="room_type"]').prop('checked', false);
        $('#updatechannelContainer [name="room_type"][value="' + topic_type + '"]').prop('checked', true);

        if (topic_type == 'work') {
            $('#upbusinessHolder').show();
        } else {
            $('#upbusinessHolder').hide();
        }

        $('#business_unitUpdate').html("");
        $('#business_unitUpdate').prepend('<option value="">Select a work category</option>');
        $.each(allUnit, function(k, v) {
            if (v.unit_id == $("#roomIdDiv").attr('topic-unit')) {

                $('#business_unitUpdate').append('<option value="' + v.unit_id + '" selected>' + v.unit_name + '</option>');
                $('#topicTypeName').text(v.unit_name);
            } else {
                $('#business_unitUpdate').append('<option value="' + v.unit_id + '">' + v.unit_name + '</option>');

            }
        });

        // temmpTagContainerUpdate
        $('#temmpTagContainerUpdate').html('');
        $('#temmpTagContainerUpdate').next('input').val('');

        var updateTagId = $('#roomIdDiv').attr('topic-tag').split(',');

        $.each(updateTagId, function(k, v) {
            $.each(tagLsitDetail, function(ku, vu) {
                if (vu.cnvtagid == v) {
                    if (vu.visibility == 'visible') {
                        var design = '<div class="item _minitag_' + vu.cnvtagid + '">' +
                            '<p class="valtext">' + vu.tagTitle + '</p>' +
                            '</div>';
                        var design2 = '<div class="item _minitag_' + vu.cnvtagid + '" >' +
                            '<p class="valtext">' + vu.tagTitle + '</p>' +
                            '<span class="valremove" data-val="' + vu.cnvtagid + '" tag-id="' + vu.tagid + '"  onclick="removeLevel(\'' + vu.cnvtagid + '\',\'' + vu.roomid + '\',\'' + vu.tagid + '\')" data-balloon="Remove tag" data-balloon-pos="up"></span>' +
                            '</div>';


                        $('#temmpTagContainerUpdate').append(design);
                        // $('#updateTagContainer').append(design2);

                    }
                }
            })

        });

        //   socket.emit('getAllUsedConvTag',{roomid},(res)=>{
        // 	  console.log(res)
        //   });

        $('#oldCovTagall').html('');


        var usedTagid = [];
        $.each(tagLsitDetail, function(k, v) {
            usedTagid.push(v.tagid);
        })
        $.each(alltagsFull, function(k, v) {
            if (v.visibility == 'visible') {
                if (usedTagid.indexOf(v.tag_id) == -1) {

                    if (!$('#temmpTagContainerUpdate .valremove[tag-id="' + v.tag_id + '"]').is(':visible')) {
                        $('#oldCovTagall').prepend('<div room-id="' + roomid + '" onclick="addTagto(\'' + v.tag_id + '\',\'' + roomid + '\')" class="tag tag_id_' + v.tag_id + '" data-id="' + v.tag_id + '">' + v.title + '</div>');
                    }
                }
            }
        })




        var totalMember = 0;
        $.each(participants, function(t, y) {
            if (adminArra.indexOf(y) == -1) {
                totalMember = totalMember + 1;
            }
        });
        $.each(adminArra, function(t, y) {
            totalMember = totalMember + 1;
        });
        var ptext = '';
        if (totalMember > 1) {
            ptext = totalMember + ' members';
        } else {
            ptext = totalMember + ' member';
        }
        addprivacyClass('updatechannelContainer', privecy);
        if (privecy === 'private') {
            $('#grpPrivacy').prop('checked', true);
            $('#grpPrivacyUpdate').prop('checked', true);
            $("#roomStatusUpdate").find('.label_head.head').html('Private Room <span>(' + ptext + ')</span>');

        } else if (privecy === 'public') {
            $('#grpPrivacy').prop('checked', false);
            $('#grpPrivacyUpdate').prop('checked', false);
            $("#roomStatusUpdate").find('.label_head.head').html('Public Room <span>(' + ptext + ')</span>');
        } else if (privecy === 'protected') {
            $('#grpPrivacy').prop('checked', true);
            $('#grpPrivacyUpdate').prop('checked', true);
            $("#roomStatusUpdate").find('.label_head.head').html('Support Room <span>(' + ptext + ')</span>');

        }

        if ($.inArray(user_id, adminArra) === -1) {
            $(".add-team-member").prop("disabled", true);
            $('#grpPrivacy').prop("disabled", true);
            $('#grpPrivacyUpdate').prop("disabled", true);
        }

        $("#s-l-def").html("");
        $("#directMsgUserList").html("");
        $('#inviteMemberBox .email_profile').remove();

        $('#updateRoomListMember2').html('');
        $('#updateRoomListMember').html('');
        team_user_list = [];
        for (var i = 0; i < allteams.length; i++) {
            if (allteams[i].team_id == keyspace) {
                if (allteams[i].participants.length == 1) { alert("Please add team member, then create room by this team"); return false; }
                $.each(user_list, function(k, v) {
                    if (allteams[i].participants.indexOf(v.id) > -1) {
                        if (v.id !== user_id) {
                            if (v.is_active !== 0 && v.is_delete == 0) {
                                if (team_user_list.indexOf(v.id) == -1) {
                                    team_user_list.push(v.id);
                                }
                            }
                        }
                    }
                });
            }
        }

        $("#guest_member_emails3").attr("data-value", 0);
        $("#guest_member_emails3").hide();
        socket.emit("get_guest_invite_status", { conversation_id }, (reply) => {
            invite_status = reply.status === true ? reply.link : [];
            $.each(allUserdata[0].users, function(ky, va) {

                if (participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1) {
                    if (va.id != user_id) {
                        if (va.is_active !== 0 && va.is_delete == 0) {
                            $('#updateRoomListMember').append(returnRoomMListDe(va));
                            if (team_user_list.indexOf(va.id) > -1 && va) {
                                $('#updateRoomListMember2').append(returnRoomMListDe(va));
                            }
                        }
                    }
                }

                if (privecy == 'protected') {
                    if (adminArra.indexOf(va.id) == -1) {
                        if (va.is_active !== 0 && va.is_delete == 0) {
                            if (team_user_list.indexOf(va.id) > -1) {
                                $('#updateRoomListMember2').append(returnRoomMListDe(va));
                            }
                            // $('#updateRoomListMember2').append(returnRoomMListDe(va));
                        }
                    }
                }
                // console.log(2437, participants)
                $.each(participants, function(k, v) {
                    if (va.id === v) {
                        // $('#inviteMemberBox').prepend(returnRoomMinide(va,'tempo'));
                        if (jQuery.inArray(v, adminArra) === -1) {
                            var designation = 'Member';
                            if (conv_service_provider.indexOf(va.id) > -1) {
                                designation = 'Service Provider';
                            }
                            if (has_permission(va.id, GUEST)) {
                                designation = 'Guest';
                            }
                            // console.log(2212, va.fullname.indexOf('Deleted'));
                            if (va.fullname.indexOf('Deleted') > -1) {
                                var mldesign = '<div class="member-div" data-status="Deleted" data-type="member" id="member' + va.id + '">';
                            } else {
                                var mldesign = '<div class="member-div" data-type="member" id="member' + va.id + '">';
                            }
                            if (onlineUserList.indexOf(va.id) == -1) {
                                mldesign += '<span class="offline online_' + va.id + '" style="top: 32px; left: 6px; position: absolute;"></span>';
                            } else {
                                mldesign += '<span class="online online_' + va.id + '" style="top: 32px; left: 6px; position: absolute;"></span>';
                            }
                            // mldesign += '<span class="offline online_'+va.id+'" style="top: 32px; left: 6px; position: absolute;"></span>'
                            mldesign += '          <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="member-img">';
                            mldesign += '          <div class="member-name" onclick="actionMentionUser(\'' + va.id + '\')"><p style="line-height: 21px; float:left">' + va.fullname + '<span>[' + designation + ']</span></p><p class="mbr_email">[' + va.email + ']</p></div>';
                            // mldesign += '          <div class="member-designation">, ' + va.designation + '</div>';
                            if ($.inArray(user_id, adminArra) !== -1) {
                                if (va.fullname.indexOf('Deleted') == -1) {
                                    // if(designation == 'Guest' && getCookie('send_invitation_' + va.id + conversation_id) == ''){
                                    if (designation == 'Guest' && invite_status.length > 0) {
                                        mldesign += re_invite_btn(va.id);
                                    }
                                    mldesign += '          <span class="remove-it GroupFlRight" onclick = "removeMember(\'member\',\'' + va.id + '\',\'' + roomid + '\');">Remove</span>';
                                    mldesign += '          <span class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">REMOVE ADMIN</span>';
                                    if (designation != 'Guest') {
                                        mldesign += '          <span class="add-admin add2 GroupFlRight arfImg" onclick="makeAdmin(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">Make Admin</span>';
                                    }
                                }
                            }
                            mldesign += '        </div>';
                            if (designation == 'Guest') {
                                if (participants_sub.indexOf(va.id) == -1) {

                                    $("#guestml-listHl").append(mldesign);
                                    if ($(".sendinvitebtn").length > 0) {
                                        $("#guest_member_emails3").attr("data-value", $(".sendinvitebtn").length);
                                        $("#guest_member_emails3").html("Send Invitation (" + $(".sendinvitebtn").length + ")").show();
                                    }
                                }
                            } else {
                                if (participants_guest.indexOf(va.id) == -1 && participants_sub.indexOf(va.id) == -1)
                                    $("#ml-listHl").append(mldesign);
                            }
                            // $("#updatenewMemberMini").append(mini_itemDesign(va,'tempp'));
                            $("#ml-membertype").show();

                        }
                    }
                });

                if (adminArra !== null) {
                    $.each(adminArra, function(kad, vad) {
                        if (va.id == vad) {
                            var mldesign = '<div class="member-div" data-type="admin" id="member' + va.id + '">';
                            if (onlineUserList.indexOf(va.id) == -1) {
                                mldesign += '<span class="offline online_' + va.id + '" style="top: 32px; left: 6px; position: absolute;"></span>';
                            } else {
                                mldesign += '<span class="online online_' + va.id + '" style="top: 32px; left: 6px; position: absolute;"></span>';
                            }
                            // mldesign += '		<span class="offline online_'+va.id+'" style="top: 32px; left: 6px; position: absolute;"></span>'
                            mldesign += '          <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="member-img">';
                            if (va.id == created_by) {
                                mldesign += '          <div class="member-name" onclick="actionMentionUser(\'' + va.id + '\')"><p style="line-height: 21px; float:left">' + va.fullname + '<span>[Creator]</span></p><p class="mbr_email">[' + va.email + ']</p></div>';
                            } else {
                                mldesign += '          <div class="member-name" onclick="actionMentionUser(\'' + va.id + '\')"><p style="line-height: 21px; float:left">' + va.fullname + '<span>[Admin]</span></p><p class="mbr_email">[' + va.email + ']</p></div>';
                            }
                            // mldesign += '          <div class="member-designation">' + va.designation + '</div>';
                            if ($.inArray(user_id, adminArra) !== -1) {
                                mldesign += '          <span class="remove-it GroupFlRight" onclick = "removeMember(\'admin\',\'' + va.id + '\',\'' + roomid + '\');">Remove</span>';
                                mldesign += '          <span class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">REMOVE ADMIN</span>';
                                mldesign += '          <span class="add-admin add2 GroupFlRight arfImg"  onclick="makeAdmin(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">Make Admin</span>';
                            }
                            mldesign += '        </div>';

                            if (participants_guest.indexOf(va.id) == -1 && participants_sub.indexOf(va.id) == -1)
                                $("#ml-listHl").prepend(mldesign);

                            $("#ml-admintype").show();

                        }
                    });
                }

                var definedList = '	<li>';
                definedList += '      <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="profile">';
                definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '" onclick="actionMentionUser(\'' + va.id + '\')">' + va.fullname + '</span> <span class="designation-name">, ' + va.designation + '</span>';
                definedList += '    </li>';

                $("#s-l-def").append(definedList);
                $("#directMsgUserList").append(definedList);

                countRoomPart(adminArra, participants);

                editRoomPermission(user_id, adminArra);

                if (privecy == 'protected') {
                    $('#grpPrivacyUpdate').prop('disabled', 'disabled');
                }

            });
        });


        $('#grpPrivacyUpdate').click(function(e) {
            e.stopImmediatePropagation();

            if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
                var roomid = $("#roomIdDiv").attr('data-roomid');
                var roomTitle = $("#roomIdDiv").attr('data-title');

                if ($.inArray(user_id, adminArra) !== -1) {
                    if (e.target.checked) {
                        var grpprivacy = 'Private';
                    } else {
                        var grpprivacy = 'Public';
                    }

                    socket.emit('updatePrivecy', {
                        conversation_id: roomid,
                        grpprivacy: grpprivacy.toLowerCase(),
                        user_id: user_id,
                        company_id: company_id
                    }, (callBack) => {

                        //toastr["success"]("This room is "+grpprivacy+" now", "Success");
                        var msg_body = '' + user_fullname + ' made ' + $('#conv_title .converstaion_name').text() + ' ' + grpprivacy;
                        var data = {
                            type: 'update_room_Privacy',
                            sender: user_id,
                            sender_name: user_fullname,
                            sender_img: user_img,
                            conversation_id: conversation_id,
                            root_conv_id: root_conv_id,
                            msg_type: 'notification',
                            msg_body: msg_body
                        }
                        sendNotificationMsg(data);
                        call_toastr();
                        if (grpprivacy.toLowerCase() == 'private') {
                            $("#conv" + roomid).find('span:first-child').removeClass('hash').addClass('lock');
                            $('#privacyTitle').text('Private Room');
                            $('#roomIdDiv').attr('data-privecy', 'private')
                        }

                        if (grpprivacy.toLowerCase() == 'public') {
                            $("#conv" + roomid).find('span:first-child').removeClass('lock').addClass('hash');
                            $('#privacyTitle').text('Public Room');
                            $('#roomIdDiv').attr('data-privecy', 'public')
                        }
                    });

                } else {
                    // toastr["warning"]("Please contact with room owner or admin", "Warning");

                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('Please contact with Room Owner or Admin.');
                }

            }
        });

        all_action_for_selected_member();
        changeTS = true;
    }
    check_permission();
};

var thisConvTagName = [];
var thisConvTagId = [];
var oldConvMytag = [];

function submitTagOption(from_warning = false) {
    console.log(2665,allUserTagList)
    var goConfirm = true;
    var addNewTag = [];
    var removeOldTag = oldConvMytag;
    $.each(thisConvTagId, function(k, v) {
        if (oldConvMytag.indexOf(v) > -1) {
            removeA(removeOldTag, v);
        } else {
            addNewTag.push(v);
        }
    });
    // console.log(2390,addNewTag,removeOldTag);
    // console.log(2390,thisMsgAllTagid,thisConvTagId);
    // console.log(2390,removeOldTag);
    if ($('#updateMessageTag').attr('file-id')) {
        var file_id = $('#updateMessageTag').attr('file-id');
        var file_data = {}
        var key = $('#updateMessageTag').attr('file-key');
        $('#oneFileTag' + file_id).html('');
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (per_conv_all_files[i].id == file_id) {
                file_data = per_conv_all_files[i];
                var newAllTagArr = per_conv_all_files[i].tag_list;
                if (newAllTagArr == null) {
                    newAllTagArr = [];
                }
                var tagl = [];
                $.each(allUserTagList, function(k, v) {
                    if (v != undefined) {
                        if (removeOldTag.indexOf(v.tag_id) == -1) {
                            if (addNewTag.indexOf(v.tag_id) > -1) {
                                tagl.push(v.tag_id);
                            } else if (newAllTagArr.indexOf(v.tag_id) > -1) {
                                tagl.push(v.tag_id);
                            }
                        }
                    }
                });
                per_conv_all_files[i].tag_list = tagl;

                console.log(2748,per_conv_all_files[i].tag_list_with_user)
                



            }
        }
        console.log(2710,thisConvTagId);
        
        // var useLength = 0;
        // var tooltipcount  = 0;
        // $.each(allUserTagList,function(k,v){
        // 	if(thisConvTagId.indexOf(v.tag_id) > -1){
        // 		if(useLength < 3){
        // 			// html += '<span class="tag_design">'+v.title+' </span>';
        // 			html = '<div class="img_action tag_ico active" onclick="viewOnlyFileTag(event,this,\''+key+'\')"></div>';
        // 		}else{
        // 			tooltipcount++;
        // 		}
        // 		useLength++;
        // 		// $('#oneFileTag'+file_id).append('<div class="tag_design">'+v.title+'</div>');
        // 	}
        // })
        // if(useLength > 0){
        // 	// html += '<span class="moreTooltipBtn">+'+tooltipcount+' more</span>'
        // 	html += '<div class="tag_toolTip for_tag" data-pos="top">'
        // 	// html += 	'<span class="tooltip_close" onclick="tooltip_close()"></span>'
        // 	html += 	'<div class="tooltip_body">'
        // 	useLength = 0;
        // 	$.each(allUserTagList,function(k,v){
        // 		if(thisConvTagId.indexOf(v.tag_id) > -1){
        // 			// if(useLength > 2){
        // 				html += '<li class="tag_name_view_'+v.tag_id+'">'+v.title + (v.tag_type == 'public' ? '(public)':'')+' </li>';
        // 			// }
        // 			useLength++;
        // 		}
        // 	});
        // 	html += 	'</div>'
        // 	html += '</div>'
        // }
        var tag_list_with_user = {};
        for(let i of per_conv_all_files){
             if(i.id == file_id ){
                
                tag_list_with_user = {};
                var withUser = {};
                if(i.tag_list_with_user == null || i.tag_list_with_user == 'null'){
                    withUser = {};
                }else{
                    withUser = JSON.parse(i.tag_list_with_user);
                }
                if(removeOldTag.length > 0){
                    for( let rt of  removeOldTag){
                        delete withUser[rt]; 
                    }
                }
                if(addNewTag.length > 0){
                    for(let at of addNewTag){
                        withUser[at] = user_id;
                    }
                }

                tag_list_with_user = withUser;

             }       
        }
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (per_conv_all_files[i].id == file_id) {
                file_data = per_conv_all_files[i];
                per_conv_all_files[i]['tag_list_with_user'] = JSON.stringify(tag_list_with_user);
            }
        }
        var html = gethtmlForFileTag(file_id, thisConvTagId,file_data);
        console.log(2770,JSON.stringify(tag_list_with_user),tag_list_with_user)
        console.log(2743, { id: $('#updateMessageTag').attr('file-id'), newtag: addNewTag, addNewTag: addNewTag, removetag: removeOldTag, conversation_id: conversation_id, user_id: user_id, company_id: company_id });
        // console.log('id:',$('#updateMessageTag').attr('file-id'),'newtag:',addNewTag,'removetag:',removeOldTag,'conversation_id:',conversation_id,'user_id:',user_id,'company_id:',company_id)
        $('#oneFileTag' + file_id).html(html);
        // $('#oneFileTag'+file_id).find('.img_action').text('('+useLength+')');
        socket.emit('updateFileTagV2', { id: $('#updateMessageTag').attr('file-id'), newtag: addNewTag, addNewTag: addNewTag, removetag: removeOldTag, conversation_id: conversation_id, user_id: user_id, company_id: company_id,tag_list_with_user:JSON.stringify(tag_list_with_user) }, function(res) {
            console.log(2748,res);
            socket.emit('updateTeamtagListperMsgupdate', { file_id: file_id, addNewTag: addNewTag, removeOldTag: removeOldTag, msg_id: $('#updateMessageTag').attr('msg-id'), tag_list: thisMsgAllTagid, allUserTagList: allUserTagList,tag_list_with_user:tag_list_with_user });
        });
    } else {

        var msg_id = $('#updateMessageTag').attr('msg-id');
        if ($('#msgThread_' + msg_id).find('.attachI').length > 0) {
            if (from_warning) {
                goConfirm = true;
            } else {
                goConfirm = false;
                $('#warningMessage').html('');
                $('#warningTitle').html('');
                $('#warningPopup').css('display', 'flex');
                $('#warningPopup').attr('data-type', 'submit_tag');
                $('#warningTitle').text('Submit Tag');
                $('#warningMessage').html('<h4 style="font-weight:normal; font-size:16px;">Do you want to tag on all associated file(s) in this message?</h4>');
                $('.buttonCancel').text('Cancel');
                $('.buttonAction').removeClass('bg_danger').text('Submit');
            }
        }
        if (goConfirm) {
            socket.emit('updateConvTagV2', { newtag: addNewTag, removetag: removeOldTag, conversation_id: conversation_id, user_id: user_id, company_id: company_id }, function(res) {
                // console.log(res);
            });
            if ($('#updateMsgTagContainer').find('.item').length > 0) {
                $('#groupChatContainer .chat-head-calling .tagged').attr('active-status', true);
            } else {
                $('#groupChatContainer .chat-head-calling .tagged').attr('active-status', false);
            }
            var userObj = {
                [user_id]: thisMsgAllTagidNew
            }
            if (msg_tagUsers != null) {
                msg_tagUsers[user_id] = msg_tagUsers[user_id] + thisMsgAllTagidNew;
            } else {
                msg_tagUsers = userObj;
            }
            msg_tagUsers = JSON.stringify(msg_tagUsers);
            all_user_string_tag[$('#updateMessageTag').attr('msg-id')] = msg_tagUsers;

            if ($('#selectToallShareTag').find('.Custom_checkboxF').hasClass('activei')) {
                var allSharedTagList = [];
                $.each(allUserTagList, function(k, v) {
                    if (v != undefined) {
                        if (thisMsgAllTagid.indexOf(v.tag_id) > -1) {
                            if (v.tag_type !== 'public') {
                                if (v.tagged_by == user_id) {
                                    allUserTagList[k]['shared_tag'] = user_id;
                                    allSharedTagList.push(v.tag_id);
                                }
                            }
                        }
                    }
                })
                if (allSharedTagList.length > 0) {
                    socket.emit('sharedTagArray', { tagged_by: user_id, tag_id: allSharedTagList, shared_tag: user_id }, function(res) {
                        // console.log(res);
                    })
                }
            }
            socket.emit('updateMsg_tag_emit', { tag_list: thisMsgAllTagid, removetag: tagremoveOld, user_tag_string: msg_tagUsers, msg_id: $('#updateMessageTag').attr('msg-id'), conversation_id: conversation_id, company_id: company_id }, function(res) {
                $('#thisMsgTagLists' + $('#updateMessageTag').attr('msg-id')).attr('data-id', thisMsgAllTagid);
                $('#msg_tag_list' + $('#updateMessageTag').attr('msg-id')).attr('tag-list', thisMsgAllTagid);
                permsg_tagsList($('#updateMessageTag').attr('msg-id'));
                socket.emit('updateTeamtagListperMsgupdate', { msg_id: $('#updateMessageTag').attr('msg-id'), tag_list: thisMsgAllTagid, user_tag_string: msg_tagUsers, allUserTagList: allUserTagList });
                if (res.all_files != undefined) {
                    changeFileTagUpdateGlobal(res.all_files);
                }
            })
        }
    }
    if (goConfirm) {

        closeModal('updateMessageTag');
    }
}
socket.on('updateGlobalFileTag', function(res) {
    changeFileTagUpdateGlobal(res.all_files);
})

function changeFileTagUpdateGlobal(data) {
    // console.log(2675,data)
    for (var i = 0; i < per_conv_all_files.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (per_conv_all_files[i].id == data[j].id) {
                per_conv_all_files[i].tag_list = data[j].tag_list;
                var html = gethtmlForFileTag(data[j].id, per_conv_all_files[i].tag_list,per_conv_all_files[i]);
                var htmlFile = getFileTagHtml(data[j].id, per_conv_all_files[i].tag_list);
                $('.file_media_' + data[j].id).find('.per_img_hover_opt').next('.img-name').find('.attach_tag').remove();
                $('.file_media_' + data[j].id).find('.per_img_hover_opt').next('.img-name').append(htmlFile);
                $('#oneFileTag' + data[j].id).html(html);
            }
        }
    }
}
socket.on('updateTeamtagListperMsgBrocast', function(data) {
    // console.log(2577,data);
    if (data.file_id != undefined && data.oldAddedtag == undefined) {
        for (var i = 0; i < per_conv_all_files.length; i++) {
            if (per_conv_all_files[i].id == data.file_id) {
                var newAllTagArr = per_conv_all_files[i].tag_list;
                if (newAllTagArr == null) {
                    newAllTagArr = [];
                }
                var tagl = [];
                $.each(allUserTagList, function(k, v) {
                    if (v != undefined) {
                        if (data.removeOldTag.indexOf(v.tag_id) == -1) {
                            if (data.addNewTag.indexOf(v.tag_id) > -1) {
                                tagl.push(v.tag_id);
                            } else if (newAllTagArr.indexOf(v.tag_id) > -1) {
                                tagl.push(v.tag_id);
                            }
                        }
                    }
                });
                per_conv_all_files[i].tag_list = tagl;



                console.log(2620,data.file_id,per_conv_all_files[i].tag_list)
                var html = gethtmlForFileTag(data.file_id, per_conv_all_files[i].tag_list,per_conv_all_files[i]);
                var htmlFile = getFileTagHtml(data.file_id, per_conv_all_files[i].tag_list);
                $('.file_media_' + data.file_id).find('.per_img_hover_opt').next('.img-name').find('.attach_tag').remove();
                $('.file_media_' + data.file_id).find('.per_img_hover_opt').next('.img-name').append(htmlFile);
                $('#oneFileTag' + data.file_id).html(html);
            }
        }

    } else {
        if (data.type == 'newTag') {
            allUserTagList.push(data.data);
        } else if (data.type == 'deleteTag') {
            var rk = null;
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (v.tag_id == data.tag_id) {
                        rk = k;
                    }
                }
            })
            if (rk != null) {
                delete allUserTagList[rk];
            }
            $('.tag_name_view_' + data.tag_id).remove();
            tagFileHovCounter(data.tag_id);
        } else if (data.type == 'addShare') {
            var idn = null;
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (v.tag_id == data.tag.tag_id) {
                        allUserTagList[k].shared_tag = data.user_id;
                        idn = v;
                    }
                }
            });
            if (idn == null) {
                allUserTagList.push(data.tag);
                if (data.oldAddedtag.indexOf(data.tag.tag_id) > -1) {
                    for (var i = 0; i < per_conv_all_files.length; i++) {
                        if (per_conv_all_files[i].id == data.file_id) {
                            per_conv_all_files[i].tag_list.push(data.file_id);
                            var html = gethtmlForFileTag(data.file_id, per_conv_all_files[i].tag_list,per_conv_all_files[i]);
                            var htmlFile = getFileTagHtml(data.file_id, per_conv_all_files[i].tag_list);
                            $('.file_media_' + data.file_id).find('.per_img_hover_opt').next('.img-name').find('.attach_tag').remove();
                            $('.file_media_' + data.file_id).find('.per_img_hover_opt').next('.img-name').append(htmlFile);
                            $('#oneFileTag' + data.file_id).html(html);
                        }
                    }
                }
            }
        } else if (data.type == 'removeShare') {
            var LengthI = null;
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {

                    if (v.tag_id == data.tag_id) {
                        if ($('.tag_name_view_' + data.tag_id).parent('.tooltip_body').find('li').length == 1) {
                            $('.tag_name_view_' + data.tag_id).parents('.attach_tag.onlyFileTag ').removeClass('active');
                        }
                        $('.tag_name_view_' + data.tag_id).remove();
                        var text = $('.file_id_cls.tag_design.moreTooltipBtn').text();
                        text = Number(text) - 1;
                        if (text > -1) {
                            $('.file_id_cls.tag_design.moreTooltipBtn').text(text);
                        }
                        LengthI = k;


                    }
                }

            });
            // console.log(2664,allUserTagList);
            if (LengthI != null) {
                delete allUserTagList[LengthI];
            }
            // console.log(2668,allUserTagList);

        } else {
            // console.log(3764,data);
            var oldList = $('#thisMsgTagLists' + data.msg_id).attr('data-id');

            if (oldList == null) {
                oldList = [];
            } else {
                oldList = oldList.split(',')
            }
            // console.log(oldList);
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (v.shared_tag != null) {
                        if (oldList.indexOf(v.tag_id) > -1) {
                            removeA(oldList, v.tag_id);
                        }
                        if (data.tag_list.indexOf(v.tag_id) > -1) {
                            oldList.push(v.tag_id);
                        }
                    }
                }

            });
            // console.log(oldList);

            $('#thisMsgTagLists' + data.msg_id).attr('data-id', oldList);
            $('#msg_tag_list' + data.msg_id).attr('tag-list', oldList);
            permsg_tagsList(data.msg_id);
            all_user_string_tag[data.msg_id] = data.user_tag_string;

        }
    }


})

$('body').on('click', '.user-msg .tag_design', function(event) {
    var msg_id = $(event.target).parents('.msgs-form-users').attr('data-msgid');
    if (!$(event.target).hasClass('file_id_cls')) {
        $('.tagOP[msg-id=' + msg_id + ']').click();

    }



    // if($(event.target).hasClass('public_tag_team')){
    // 	changeTagMode('public');
    // }else if($(event.target).hasClass('shared_tag_user')){
    // 	changeTagMode('sharedtag');
    // }
})

function getSharedTagUserName(tag_id) {
    var html = '';

    $.each(allUserTagList, function(k, v) {
        if (v != undefined) {
            if (tag_id == v.tag_id) {
                if (v.shared_tag != null) {
                    if (v.shared_tag != user_id) {
                        html = '<span class="shared_tagUser">[' + findObjForUser(v.shared_tag).fullname + ']</span>';
                    }
                }
            }
        }
    });
    return html;
}

function tagPopupOpen() {
    $('#updateMessageTag').attr('msg-id', '');
    $('#updateMessageTag').attr('file-id', '');
    $('#tagAddBtn').hide();
    $('#updateMessageTag .sub_btn').show();
    socket.emit('getConvTagId', { conversation_id: conversation_id, company_id: company_id }, function(res) {
            thisConvTagName = [];
            thisConvTag = [];
            oldConvMytag = [];
            if (res.status) {
                var taglist = res.data[0].tag_list;
                if (taglist == null) {
                    taglist = [];
                }
                $('#updateMessageTag .hayven_Modal_Content').css('pointer-events', 'auto');
                // if(conversation_type != 'personal'){
                // 	if(adminArra.indexOf(user_id) == -1){
                // 		$('#updateMessageTag .hayven_Modal_Content').css('pointer-events','none');
                // 	}else{
                // 		$('#updateMessageTag .hayven_Modal_Content').css('pointer-events','auto');
                // 	}
                // }else{
                // 	$('#updateMessageTag .hayven_Modal_Content').css('pointer-events','auto');
                // }

                $('#AllTagList').html('');
                $('#updateMsgTagContainer').html('');
                $('#updateMessageTag').css('display', 'flex');

                $.each(allUserTagList, function(k, v) {
                    if (v != undefined) {
                        if (taglist.indexOf(v.tag_id) > -1) {
                            thisConvTagName.push(v.title);
                            thisConvTagId.push(v.tag_id);
                            oldConvMytag.push(v.tag_id);
                            $('#updateMsgTagContainer').prepend('<div class="item"><p class="valtext">' + v.title + '</p><span class="valremove" data-val="' + v.title + '" tag-id="' + v.tag_id + '" onclick="removeConvTag(this)" data-balloon="Remove tag" data-balloon-pos="up"></span></div>')
                        } else {

                            $('#AllTagList').prepend('<div style="border-color:' + getTagColor(v.tag_id) + '"  onclick="tagOnCov(this,event)" class="tag tag_id_' + v.tag_id + '" data-id="' + v.tag_id + '" conv-id="' + conversation_id + '"><span class="color_defiendBtn" style="background-color:' + getTagColor(v.tag_id) + '"></span><span id="thisTagIdConv_' + v.tag_id + '" class="this_title" data-id="' + v.tag_id + '" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)">' + v.title + '</span>' + getSharedTagUserName(v.tag_id) + '<span class="removeIcon" data-balloon="Delete" data-balloon-pos="up"></span><span class="editIcon" data-balloon="Edit" data-balloon-pos="up"></span></div>');
                        }
                    }
                });
                $('#updateMsgTagContainer input').focus();
                addClassActive(thisConvTagId, '#updateMessageTag .sub_btn');
            }
        })
        // $('#updateroomTagPopup').show();
        // $('#updateTagContainer').html('');
        // $('#updateTagContainer').next('input').focus();

    // var updateTagId = $('#roomIdDiv').attr('topic-tag').split(',');

    // $.each(updateTagId,function(k,v){
    // 	$.each(tagLsitDetail,function(ku,vu){
    // 		if(vu.cnvtagid == v){
    // 			if(vu.visibility == 'visible'){
    // 				var design = '<div class="item _minitag_'+vu.cnvtagid+'">'
    // 								+'<p class="valtext">'+vu.tagTitle+'</p>'
    // 							+'</div>';
    // 				var design2 = '<div class="item _minitag_'+vu.cnvtagid+'" >'
    // 								+'<p class="valtext">'+vu.tagTitle+'</p>'
    // 								+'<span class="valremove" data-val="'+vu.cnvtagid+'" tag-id="'+vu.tagid+'"  onclick="removeLevel(\''+vu.cnvtagid+'\',\''+vu.roomid+'\',\''+vu.tagid+'\')"></span>'
    // 							+'</div>';


    // 				$('#temmpTagContainerUpdate').append(design);
    // 				$('#updateTagContainer').append(design2);

    // 			}
    // 		}
    // 	});

    // });
    // $('#oldCovTagall').html('');
    // $.each(alltagsFull,function(k,v){
    // 	if(v.visibility == 'visible'){

    // 		if(!$('#temmpTagContainerUpdate .valremove[tag-id="'+v.tag_id+'"]').is(':visible')){
    // 			$('#oldCovTagall').prepend('<div room-id="'+conversation_id+'" onclick="addTagto(\''+v.tag_id+'\',\''+conversation_id+'\')" class="tag tag_id_'+v.tag_id+'" data-id="'+v.tag_id+'">'+v.title+'</div>');
    // 		}
    // 	}
    // })
}

function getTagColor(tag_id) {
    var c = '#000';
    // console.log(2816,allUserTagList)
    $.each(allUserTagList, function(k, v) {
        if (v != undefined) {
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
                            c = '#023D67';
                        }
                    }
                } else {
                    if (v.tag_color == null) {
                        c = '#000';
                    }
                }
            }
        }


    });
    return c;
}

function getShareOrnotTag(tag_id) {
    var onlyTagCls = 'notShared';
    $.each(allUserTagList, function(k, v) {
        if (v != undefined) {
            if (tag_id == v.tag_id) {
                if (v.shared_tag != null) {
                    onlyTagCls = ' shared_tag_only '
                }
                if (v.tagged_by != user_id && v.shared_tag != null) {
                    onlyTagCls = onlyTagCls + ' OthersSharedTag ';
                }
            }
        }
    });


    return onlyTagCls;
}

function removeConvTag(elm) {
    var tag_id = $(elm).attr('tag-id');
    var tag_title = $(elm).attr('data-val');
    $(elm).parent('.item').remove();
    $('.convTagslistmini_' + tag_id).remove();
    var thisShared = ($(elm).parent('.item').hasClass('shared_tag_only') ? true : false);
    removeA(thisConvTagName, tag_title);
    removeA(thisConvTagId, tag_id);

    var st = 'shared_icon';
    if (thisShared) {
        st = st + ' active';
    }
    if (oldAddedtag.indexOf(tag_id) > -1) {
        anyChangeThisAction.push(tag_id);
    } else if (anyChangeThisAction.indexOf(tag_id) > -1) {
        removeA(anyChangeThisAction, tag_id);
    }

    $('#AllTagList').prepend('<div style="border-color:' + getTagColor(tag_id) + '"  onclick="tagOnCov(this,event)" class="' + ($(elm).hasClass('public_tag') ? 'public_tag public_tag_show ' : 'private_tag_show ') + getShareOrnotTag(tag_id) + ' tag tag_id_' + tag_id + '" data-id="' + tag_id + '" conv-id="' + conversation_id + '"><span class="color_defiendBtn" style="background-color:' + getTagColor(tag_id) + '"></span><span id="thisTagIdConv_' + tag_id + '" class="this_title" data-id="' + tag_id + '" onkeyup="updateTagTitle(event,this)" onblur="updateTagTitle(event,this)">' + tag_title + '</span>' + getSharedTagUserName(tag_id) + '<span class="removeIcon" data-balloon="Delete" data-balloon-pos="up"></span><span class="editIcon" data-balloon="Edit" data-balloon-pos="up"></span> <span class="' + st + '" data-balloon="Make tag available to others in this room" data-balloon-pos="left"></span></div>');
    $('#updateMessageTag input').focus();
    addClassActive(thisConvTagId, '#updateMessageTag .sub_btn');
    // socket.emit('removeConvTag',{conversation_id:conversation_id,user_id:user_id,tag_id:tag_id,company_id:company_id},function(res){
    // 	if(res.status){
    //
    // 		removeA(thisroomTagList,tag_id);
    // 		$('#AllTagList').prepend('<div onclick="tagOnCov(this)" class="tag tag_id_'+tag_id+'" data-id="'+tag_id+'" conv-id="'+conversation_id+'">'+tag_title+'</div>');
    // 		if($('#updateMsgTagContainer').find('.item').length > 0){
    // 			$('#groupChatContainer .chat-head-calling .tagged').attr('active-status',true);
    // 		}else{
    // 			$('#groupChatContainer .chat-head-calling .tagged').attr('active-status',false);
    // 		}
    // 	}else{
    // 		console.log(res);
    // 	}
    // });
    checkTagLength();
}

function delteMyTagV2(data) {

    socket.emit('delteMyTagV2', { tag_id: data.tag_id, user_id: user_id, company_id: company_id }, function(res) {
        if (res.status) {
            var removeIdx = -1;
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (data.tag_id == v.tag_id) {
                        removeIdx = k;
                    }
                }
            });
            // console.log(2515,allUserTagList,removeIdx);
            allUserTagList.splice(removeIdx, 1);
            // console.log(2515,allUserTagList,removeIdx);
            socket.emit('updateTeamtagListperMsgBrocast', { type: 'deleteTag', tag_id: data.tag_id });
            tagFileHovCounter(data.tag_id);
        }
    })

}

function tagFileHovCounter(tag_id) {
    // console.log(3054,tag_id)
    var LengthI = null;
    $.each(allUserTagList, function(k, v) {
        if (v != undefined) {

            if (v.tag_id == tag_id) {
                if ($('.tag_name_view_' + tag_id).parent('.tooltip_body').find('li').length == 1) {
                    $('.tag_name_view_' + tag_id).parents('.attach_tag.onlyFileTag ').removeClass('active');
                }
                $('.tag_name_view_' + tag_id).remove();
                var text = $('.file_id_cls.tag_design.moreTooltipBtn').text();
                text = Number(text) - 1;
                if (text > -1) {
                    $('.file_id_cls.tag_design.moreTooltipBtn').text(text);
                }
                LengthI = k;


            }
        }

    });
    if (LengthI != null) {
        delete allUserTagList[LengthI];
    }

    // var a  = $('.onlyFileTag');
    // $.each(a,function(k,v){
    // 	var allCounter = $(v).attr('data-id');
    // 	if(allCounter != undefined){
    // 		console.log(3058,allCounter);
    // 			allCounter = allCounter.split(',');
    // 		if(allCounter.indexOf(tag_id) ==  -1){
    // 			removeA(allCounter,tag_id);
    // 		}
    // 		$(v).attr('data-id',allCounter);
    // 		var acCounter = [];
    // 		$.each(allUserTagList,function(k,v){
    // 			if(allCounter.indexOf(v.tag_id) != -1){
    // 				acCounter.push(v.tag_id);
    // 			}
    // 		});
    // 		$(v).find('.file_id_cls.moreTooltipBtn').text(acCounter.length);
    // 		if(acCounter.length == 0){
    // 			$(v).find('.file_id_cls.moreTooltipBtn').hide();
    // 		}
    // 	}
    // })
}

function tagOnCov(elm, event) {
    var file_id = $('#updateMessageTag').attr('file-id');
    var tag_id = $(elm).attr('data-id');
    var title = $('#AllTagList').find('.tag_id_' + tag_id).text();
    if ($(event.target).hasClass('removeIcon')) {
        $('#warningPopup').css('display', 'flex');
        $('#warningPopup').attr('data-type', 'delete_tag');
        $('#warningPopup').attr('tag-id', tag_id);
        $('#warningTitle').text('Delete Tag');
        $('#warningMessage').html('<h4 style="font-weight:normal; font-size:16px;"> Are you sure about deleting this tag? All content previously tagged with this one will be untagged as well.</h4>');
        $('.buttonCancel').text('Cancel');
        $('.buttonAction').addClass('bg_danger').text('Delete');

        // event.preventDefault();
        // $(elm).remove();
        // delteMyTagV2({tag_id:tag_id,type:'conv'});
        // $('.tag_name_view_'+tag_id).remove();
    } else if ($(event.target).hasClass('shared_icon')) {
        if ($(event.target).hasClass('active')) {
            $(event.target).removeClass('active');
            $('.tag_id_' + tag_id).css('border-color', 'var(--PrimaryC)');
            $('.tag_id_' + tag_id).removeClass('shared_tag_user');
            $('.tag_name_view_' + tag_id).removeClass('shared_tag_user');
            $('.tag_id_' + tag_id).removeClass('shared_tag_only');
            $('.tag_id_' + tag_id).addClass('notShared');
            changeShareTagC(tag_id, false);
            socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: null }, function(res) {
                    // console.log(res);
                    socket.emit('updateTeamtagListperMsgBrocast', { type: 'removeShare', tag_id: tag_id });
                })
                // event.preventDefault();
                // event.stopImmediatePropagation();
                // $('#warningMessage').html('');
                // $('#warningTitle').html('');
                // $('#warningPopup').show();
                // $('#warningPopup').attr('data-type', 'removeShare');
                // $('#warningPopup').attr('tag-id',tag_id );
                // $('#warningTitle').text('Share Tag');
                // $('#warningMessage').html('<h4 style="font-weight:normal; font-size:16px;"> Do you want to revoke sharing on this tag? No one on this channel with this tag can view.</h4>');
                // $('.buttonCancel').text('Cancel');
                // $('.buttonAction').addClass('bg_danger').text('Revoke');
        } else {
            $(event.target).addClass('active');
            $('.tag_id_' + tag_id).css('border-color', 'var(--PrimaryC');
            $('.tag_id_' + tag_id).addClass('shared_tag_user');
            $('.tag_id_' + tag_id).addClass('shared_tag_only');
            $('.tag_name_view_' + tag_id).addClass('shared_tag_user');
            $('.tag_id_' + tag_id).removeClass('notShared');
            changeShareTagC(tag_id, true);
            socket.emit('sharedTag', { tagged_by: user_id, tag_id: tag_id, shared_tag: user_id }, function(res) {
                    $.each(allUserTagList, function(k, v) {
                            if (v != undefined) {
                                if (v.tag_id == tag_id) {
                                    socket.emit('updateTeamtagListperMsgBrocast', { type: 'addShare', tag_id: tag_id, user_id: user_id, tag: allUserTagList[k], oldAddedtag: oldAddedtag, file_id: file_id });
                                }
                            }
                        })
                        // console.log(res);
                })
                // $('#warningMessage').html('');
                // $('#warningTitle').html('');
                // $('#warningPopup').show();
                // $('#warningPopup').attr('data-type', 'addShare');
                // $('#warningPopup').attr('tag-id',tag_id );
                // $('#warningTitle').text('Share Tag');
                // $('#warningMessage').html('<h4 style="font-weight:normal; font-size:16px;"> Do you want to share this tag? Anyone on this channel with this tag can view.</h4>');
                // $('.buttonCancel').text('Cancel');
                // $('.buttonAction').removeClass('bg_danger').text('Share');
        }
    } else if ($(event.target).hasClass('editIcon')) {
        event.preventDefault();
        $(elm).find('.this_title').attr('contenteditable', true);

        var el = document.getElementById('thisTagId_' + tag_id + '');
        placeCaretAtEnd(el);
        editTag_id = tag_id;
        old_edit_tag_title = title;


    } else {
        if ($('#AllTagList').find('.tag_id_' + tag_id).hasClass('active')) {
            removeA(thisConvTagName, title);
            removeA(thisConvTagId, tag_id);
            if (oldAddedtag.indexOf(tag_id) > -1) {
                anyChangeThisAction.push(tag_id);
            } else if (anyChangeThisAction.indexOf(tag_id) > -1) {
                removeA(anyChangeThisAction, tag_id);
            }

            $('#AllTagList').find('.tag_id_' + tag_id).removeClass('active');
            $('#updateMessageTag input').val('');
            $('#updateMessageTag input').focus();

        } else {
            thisConvTagName.push(title);
            $.each(allUserTagList, function(k, v) {
                if (v != undefined) {
                    if (v.tag_id == tag_id) {
                        thisConvTagId.push(tag_id);
                        // $('#updateMsgTagContainer').prepend('<div class="item '+($(elm).hasClass('public_tag') ? 'public_tag_show ':'private_tag_show ')+ getShareOrnotTag(tag_id) +'"><p class="valtext">'+title+'</p><span class="valremove '+($(elm).hasClass('public_tag') ? 'public_tag ':' ')+'" data-val="'+title+'" tag-id="'+tag_id+'" onclick="removeConvTag(this)" data-balloon="Remove tag" data-balloon-pos="up"></span></div>');
                        // $('#convTagslistmini').prepend('<div class="item convTagslistmini_'+tag_id+'"><p class="valtext">'+title+'</p></div>');
                    }
                }
            })
            if (oldAddedtag.indexOf(tag_id) > -1) {
                removeA(anyChangeThisAction, tag_id);
            } else {
                anyChangeThisAction.push(tag_id);
            }
            $('#AllTagList').find('.tag_id_' + tag_id).addClass('active');
            // $('#AllTagList').find('.tag_id_'+tag_id).remove();
            $('#updateMessageTag input').val('');
            $('#updateMessageTag input').focus();

        }
        addClassActive(thisConvTagId, '#updateMessageTag .sub_btn');
        checkTagLength();
        checkTagLength();


    }

    // socket.emit('tagOnCov',{conversation_id:conversation_id,tag_id:tag_id,user_id:user_id,company_id:company_id},function(res){
    // 	if(res.status){
    // 		thisroomTagList.push(tag_id);
    // 		$('#updateMsgTagContainer').prepend('<div class="item"><p class="valtext">'+title+'</p><span class="valremove" data-val="'+title+'" tag-id="'+tag_id+'" onclick="removeConvTag(this)"></span></div>');
    // 		$('#convTagslistmini').prepend('<div class="item convTagslistmini_'+tag_id+'"><p class="valtext">'+title+'</p></div>');
    //
    //
    // 		if($('#updateMsgTagContainer').find('.item').length > 0){
    // 			$('#groupChatContainer .chat-head-calling .tagged').attr('active-status',true);
    // 		}else{
    // 			$('#groupChatContainer .chat-head-calling .tagged').attr('active-status',false);
    // 		}
    // 	}
    // });
    checkTagLength();
}

var lastPopup = '';
var prevConvid = '';
var roomFromJOin = (event, participantsOld, admin, roomid, title, privecy, keyspace) => {
    // console.log(2443,event,participantsOld, admin, roomid, title, privecy, keyspace);
    if ($(event.target).hasClass('click-to-join') || $(event.target).hasClass('imagediv')) {
        return false;
    }
    PVM = true;
    lastPopup = 'updateRoom';
    updateContainer = true;
    prevConvid = $('li.sideActive').attr('data-conversationid');

    $('#conv' + roomid).removeClass('sideActive');
    $('#conv' + roomid).addClass('triggered');
    $('#conv' + roomid).trigger('click');
    // $('#roomIdDiv').trigger('click');
    $('#joinChannelPanel').hide();
    $('#updatechannelContainer').show();
    $('#updatechannelContainer').attr('data-esc', true);



    $.each(allRooms, function(k, resData) {
        if (resData.conversation_id == roomid) {

            if (!$('#conv' + roomid).is(':visible')) {
                $("#conversation_list_sidebar").prepend('<li data-privacy="' + resData.privacy + '" data-myid="' + user_id + '" data-createdby="0"  data-octr="' + resData.created_by + '" onclick="start_conversation(event)" data-nor="0" data-subtitle="' + resData.group_keyspace + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + parseInt(parseInt(resData.participants.length) + 1) + '" data-conversationid="' + resData.conversation_id + '" data-name="' + resData.title + '" data-img="' + resData.conv_img + '"  id="conv' + resData.conversation_id + '" class="temppSideli ' + (resData.root_conv_id != null ? 'itssubconvhide' : '') + '"><span class="' + (resData.privacy === 'public' ? "hash" : "lock") + '"></span><span class="usersName">' + resData.title + '</span><span class=" unreadMsgCount"></span></li>');
                $('#conv' + roomid).trigger('click');
            }
            // $(".connect_right_section").hide();
            // $('#createChannelContainer').show();
            $('#createChannelContainer').attr('update-action', true);
            $('.photo-upload-invite-member').css('width', '100%');
            $('#createChannelContainer .submitBtn').addClass('hideElm');
            $('.memberList').show();
            $("#ml-listHl").html("");
            // $("#updatenewMemberMini").html("");
            $("#ml-listHA").html("");
            $("#updateRoomTitle").val(title);
            $("#demoImg").attr('src', '/upload/' + resData.conv_img);
            $("#updateRoomImg").attr('src', '' + file_server + 'room-images-uploads/Photos/' + resData.conv_img);
            if (resData.conv_img == 'feelix.jpg') {
                $('#forClearRoomImg').hide();
            } else {
                $('#forClearRoomImg').show();
            }

            $("#upload-channel-photo").attr("onchange", "roomImageUpdate(\'" + roomid + "\',event,this.files)");
            $("#updateImgInput").attr("onchange", "roomImageUpdate(\'" + roomid + "\',event,this.files)");



            $(".submitBtn").hide();
            $(".create-channel-heading").text("Update Room");

            $("#updateWorkspaceTeam option").each(function() {
                if ($(this).val() == resData.keyspace) { // match here
                    $(this).attr("selected", "selected");
                }
            });
            // This line use for checking room update or room create
            $("#roomIdDiv").attr('data-rfu', 'ready');


            // $("#select-ecosystemUpdate option").each(function(){
            // 	if($(this).val() == resData.keyspace){ // match here
            // 		$(this).attr("selected","selected");
            // 	}
            // });

            var totalMember = 0;
            $.each(resData.participants, function(t, y) {
                if (resData.participants_admin.indexOf(y) == -1) {
                    totalMember = totalMember + 1;
                }
            });
            $.each(resData.participants_admin, function(t, y) {
                totalMember = totalMember + 1;
            });

            var ptext = '';
            if (totalMember > 1) {
                ptext = totalMember + ' members';
            } else {
                ptext = totalMember + ' member';
            }

            if (resData.privacy === 'private') {
                $('#grpPrivacy').prop('checked', true);
                $('#grpPrivacyUpdate').prop('checked', true);
                $("#roomStatusUpdate").find('.label_head.head').html('Private Room <span>(' + ptext + ')</span>');

            } else if (resData.privacy === 'public') {
                $('#grpPrivacy').prop('checked', false);
                $('#grpPrivacyUpdate').prop('checked', false);
                $("#roomStatusUpdate").find('.label_head.head').html('Public Room <span>(' + ptext + ')</span>');
            }

            if ($.inArray(user_id, resData.participants_admin) === -1) {
                $(".add-team-member").prop("disabled", true);
                $('#grpPrivacy').prop("disabled", true);
                $('#grpPrivacyUpdate').prop("disabled", true);
            }

            $("#s-l-def").html("");
            $("#directMsgUserList").html("");
            $('#inviteMemberBox .email_profile').remove();


            $.each(allUserdata[0].users, function(ky, va) {

                if (resData.participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1 || participants_sub.indexOf(va.id) > -1) {
                    if (va.is_active !== 0 && va.is_delete == 0) {
                        $('#updateRoomListMember').append(returnRoomMListDe(va));
                        $('#updateRoomListMember2').append(returnRoomMListDe(va));
                    }
                }

                $.each(resData.participants, function(k, v) {
                    if (va.id === v) {
                        // $('#inviteMemberBox').prepend(returnRoomMinide(va,'tempo'));
                        if (jQuery.inArray(v, resData.participants_admin) === -1) {
                            var mldesign = '<div class="member-div" data-type="member" id="member' + va.id + '">';
                            mldesign += '          <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="member-img">';
                            mldesign += '          <div class="member-name">' + va.fullname + ' <span>@ Member</span></div>';
                            // mldesign += '          <div class="member-designation">, ' + va.designation + '</div>';
                            if ($.inArray(user_id, resData.participants_admin) !== -1) {
                                mldesign += '          <span class="remove-it GroupFlRight" onclick = "removeMember(\'member\',\'' + va.id + '\',\'' + roomid + '\');">Remove</span>';
                                mldesign += '          <img src="/images/admin-remove_12px @1x.png" class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">';
                                mldesign += '          <span class="add-admin add2 GroupFlRight arfImg" onclick="makeAdmin(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">Make Admin</span>';
                            }
                            mldesign += '        </div>';

                            if (participants_guest.indexOf(va.id) == -1 && participants_sub.indexOf(va.id) == -1)
                                $("#ml-listHl").append(mldesign);

                            // $("#updatenewMemberMini").append(mini_itemDesign(va,'tempp'));
                            $("#ml-membertype").show();

                        }
                    }
                });

                if (resData.participants_admin !== null) {
                    $.each(resData.participants_admin, function(kad, vad) {
                        if (va.id == vad) {
                            var mldesign = '<div class="member-div" data-type="admin" id="member' + va.id + '">';
                            mldesign += '          <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="member-img">';
                            mldesign += '          <div class="member-name">' + va.fullname + ' <span>@ Admin</span></div>';
                            // mldesign += '          <div class="member-designation">' + va.designation + '</div>';
                            if ($.inArray(user_id, resData.participants_admin) !== -1) {
                                mldesign += '          <span class="remove-it GroupFlRight" onclick = "removeMember(\'admin\',\'' + va.id + '\',\'' + roomid + '\');">Remove</span>';
                                mldesign += '          <img src="/images/admin-remove_12px @1x.png" class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">';
                                mldesign += '          <span class="add-admin add2 GroupFlRight arfImg"  onclick="makeAdmin(\'' + va.img + '\',\'' + va.fullname + '\',\'' + va.designation + '\',\'' + va.id + '\',\'' + roomid + '\')">Make Admin</span>';
                            }
                            mldesign += '        </div>';
                            $("#ml-listHl").prepend(mldesign);
                            $("#ml-admintype").show();

                        }
                    });
                }

                var definedList = '	<li>';
                definedList += '      <img src="' + file_server + 'profile-pic/Photos/' + va.img + '" class="profile">';
                definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> <span class="designation-name">, ' + va.designation + '</span>';
                definedList += '    </li>';

                $("#s-l-def").append(definedList);
                $("#directMsgUserList").append(definedList);

                countRoomPart(resData.participants_admin, resData.participants);

                editRoomPermission(user_id, resData.participants_admin);

            });



            $('#grpPrivacyUpdate').click(function(e) {
                e.stopImmediatePropagation();

                if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
                    var roomid = $("#roomIdDiv").attr('data-roomid');
                    var roomTitle = $("#roomIdDiv").attr('data-title');

                    if ($.inArray(user_id, resData.participants_admin) !== -1) {
                        if (e.target.checked) {
                            var grpprivacy = 'Private';
                        } else {
                            var grpprivacy = 'Public';
                        }

                        socket.emit('updatePrivecy', {
                            conversation_id: roomid,
                            grpprivacy: grpprivacy,
                            company_id: company_id
                        }, (callBack) => {

                            //toastr["success"]("This room is "+grpprivacy+" now", "Success");
                            var msg_body = '' + user_fullname + ' made ' + $('#conv_title .converstaion_name').text() + ' ' + grpprivacy;
                            var data = {
                                type: 'update_room_Privacy',
                                sender: user_id,
                                sender_name: user_fullname,
                                sender_img: user_img,
                                conversation_id: conversation_id,
                                root_conv_id: root_conv_id,
                                msg_type: 'notification',
                                msg_body: msg_body
                            }
                            sendNotificationMsg(data);
                            call_toastr();
                            if (grpprivacy == 'private') {
                                $("#conv" + roomid).find('span:first-child').removeClass('hash').addClass('lock');
                                $("#conv" + roomid).attr('data-privacy', 'private');

                            }

                            if (grpprivacy == 'public') {
                                $("#conv" + roomid).find('span:first-child').removeClass('lock').addClass('hash');
                                $("#conv" + roomid).attr('data-privacy', 'public');
                            }
                        });

                    } else {
                        // toastr["warning"]("Please contact with room owner or admin", "Warning");
                        $('#warningsPopup').css('display', 'flex');
                        $('#warningsPopup .warningMsg').text('Please contact with Room Owner or Admin.');
                    }

                }
            });

            all_action_for_selected_member();
        }
    })











    // $("#divCheck").val('2');

    // if(participantsOld != null){
    // 	participants = participantsOld.split(',');
    // }

    // if(admin != null){
    // 	adminArra = admin.split(',');
    // }else{
    // 	adminArra = admin;
    // }

    // $(".connect_right_section").hide();
    // $('#createChannelContainer').show();
    // $('.memberList').show();
    // $("#ml-listHl").html("");
    // $("#ml-listHA").html("");
    // $("#team-name").val(title);

    // $(".submitBtn").hide();
    // $(".create-channel-heading").text(title);

    // // This line use for checking room update or room create
    // $("#roomIdDiv").attr('data-rfu','ready');

    // $("#select-ecosystem option").each(function(){
    // 	if($(this).val()== keyspace){ // match here
    // 		$(this).attr("selected","selected");
    // 	}
    // });

    // if(privecy == 'private'){
    // 	$('#grpPrivacy').attr('checked', true);
    // }

    // $(".add-team-member").prop("disabled",true);
    // $("#team-name").prop("disabled",true);

    // $.each(allUserdata[0].users, function(ky, va) {
    // 	$.each(participants, function(k, v) {
    // 		if (va.id === v) {
    // 			if (jQuery.inArray(v, adminArra) === -1) {
    // 				var mldesign = '<div class="member-div" id="member' + va.id + '">';
    // 				mldesign += '          <img src="/images/users/' + va.img + '" class="member-img">';
    // 				mldesign += '          <div class="member-name">' + va.fullname + '</div>';
    // 				mldesign += '        </div>';
    // 				$("#ml-listHl").append(mldesign);
    // 				$("#ml-membertype").show();
    // 			}
    // 		}
    // 	});

    // 	if (adminArra !== null) {
    // 		$.each(adminArra, function(kad, vad) {
    // 			if (va.id == vad) {
    // 				var mldesign = '<div class="member-div" id="member' + va.id + '">';
    // 				mldesign += '          <img src="/images/users/' + va.img + '" class="member-img">';
    // 				mldesign += '          <div class="member-name">' + va.fullname + '</div>';
    // 				mldesign += '        </div>';
    // 				$("#ml-listHA").append(mldesign);
    // 				$("#ml-admintype").show();
    // 			}
    // 		});
    // 	}
    // });
};

var undoRemoveMArray = [];

function custom_confirm() {
    $('#removeWarning').css('display', 'flex');

    $('#removeWarning .buttonAction').click(function() {
        closeModal('removeWarning');
        yesCallback();
    });
    $('#removeWarning  .buttonCancel').click(function() {
        closeModal('removeWarning');
        noCallback();
    });
}
var removeMember = (targetUser, targetID, conversation_id) => {
    // var res = true;
    $('#removeWarning').find('.buttonAction').attr('onclick', 'removeMemberAction(\'' + targetUser + '\', \'' + targetID + '\', \'' + conversation_id + '\')');
    $('#removeWarning').css('display', 'flex');
};

function removeMemberAction(targetUser, targetID, conversation_id) {
    $('#removeWarning').find('.buttonAction').attr('onclick', '');
    closeModal('removeWarning');
    var memberImgarray = $('#member' + targetID).find('img').attr('src').split("/");
    var memberImg = memberImgarray[memberImgarray.length - 1];
    var memberName = $('#member' + targetID).find('.memberName').text();
    var design = '<li onclick="updateMember(event, \'' + memberImg + '\',\'' + memberName + '\',\'' + targetID + '\')" class="showEl">';
    design += '		<div class="list" id="membere' + targetID + '">';
    design += '			<img src="' + file_server + 'profile-pic/Photos/' + memberImg + '">';
    design += '			<span class="online_' + targetID + ' ' + (onlineUserList.indexOf(targetID) === -1 ? "offline" : "online") + '"></span>';
    design += '			<h1 class="memberName" data-uuid="' + targetID + '">' + memberName + '</h1>';
    design += '		</div>';
    design += '</li>';

    if (targetUser == 'admin') {
        if (adminArra.length > 1) {
            var remain = parseInt($("#conv" + conversation_id).attr('data-tm')) - 1;
            var alldata = {
                    targetUser: targetUser,
                    targetID: targetID,
                    conversation_id: conversation_id,
                    memberImgarray: memberImgarray,
                    memberImg: memberImg,
                    memberName: memberName,
                    design: design,
                    remain: remain,
                }
                //undoRemoveMArray.push({conv_id:conversation_id,member_id:targetID,endTime:(new Date).getTime() + 10000,data:alldata});
            removeuseradmin(targetUser, targetID, conversation_id, memberImgarray, memberImg, memberName, design, remain);

            $('#member' + targetID).hide();
            // toastr.options.closeButton = false;
            // toastr.options.positionClass = 'toast-bottom-right';
            // toastr.options.timeOut = 9000;
            // toastr.options.extendedTimeOut = 9000;
            // toastr["info"]('<div><span data-interval="10">10s</span> Undo remove '+findObjForUser(targetID).fullname+'</div><div><button type="button" class="btn btn-accept undoremove" onclick="undoRemoveAction(this)" data-conv="'+conversation_id+'" data-user="'+targetID+'">Undo</button></div>');
        } else {
            // toastr["warning"]("You can\'t remove this user. Make an admin first", "Warning");
            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('You can\'t remove this user. Make an Admin first.');
        }
    } else {
        var remain = parseInt($("#conv" + conversation_id).attr('data-tm')) - 1;
        var alldata = {
                targetUser: targetUser,
                targetID: targetID,
                conversation_id: conversation_id,
                memberImgarray: memberImgarray,
                memberImg: memberImg,
                memberName: memberName,
                design: design,
                remain: remain,
            }
            //console.log(alldata);
            //undoRemoveMArray.push({conv_id:conversation_id,member_id:targetID,endTime:(new Date).getTime() + 10000,data:alldata})
        removeusermember(targetUser, targetID, conversation_id, memberImgarray, memberImg, memberName, design, remain);

        if (has_permission(targetID, GUEST)) {
            $("#guest_member_emails3").attr("data-value", Number($("#guest_member_emails3").attr("data-value")) - 1);
            if (Number($("#guest_member_emails3").attr("data-value")) > 0)
                $("#guest_member_emails3").html("Send Invitation (" + Number($("#guest_member_emails3").attr("data-value")) + ")").show();
            else
                $("#guest_member_emails3").hide();
        }
        $('#member' + targetID).remove();
        // setCookie('send_invitation_'+ targetID + conversation_id , '');
        // toastr.options.closeButton = false;
        // toastr.options.positionClass = 'toast-bottom-right';
        // toastr.options.timeOut = 9000;
        // toastr.options.extendedTimeOut = 9000;
        // 	toastr["info"]('<div><span data-interval="10">10s</span> Undo remove '+findObjForUser(targetID).fullname+'</div><div><button type="button" class="btn btn-accept undoremove" onclick="undoRemoveAction(this)" data-conv="'+conversation_id+'" data-user="'+targetID+'">Undo</button></div>');

    }
}


function removeuseradmin(targetUser, targetID, conversation_id, memberImgarray, memberImg, memberName, design, remain) {
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetUser: targetUser,
            targetID: targetID,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/groupMemberDelete',
        success: function(data) {
            // console.log(2641,data);
            if (data == 'success') {
                var totalMember = parseInt($('.list_Count span').text());
                if (totalMember > 0) {
                    $('.list_Count span').text(totalMember - 1);
                    $('#totalMember').text(totalMember - 1);
                    forActiveCallIcon(onlineUserList, participants, conversation_type);
                    $("#conv" + conversation_id).attr('data-tm', totalMember - 1);
                } else {
                    $('.list_Count span').text(0);
                    $('#totalMember').text(0);
                    // forActiveCallIcon(onlineUserList, participants, conversation_type);
                }
                $('._miniMList_' + targetID).remove();
                if (data == 'creator') {
                    // toastr["warning"]("You can\'t delete this user", "Warning");

                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('You can\'t delete this user.');
                } else {
                    if ($('#memberListBackWrap').is(':visible') == true) {
                        $('li #member' + targetID + '').parent('li').next('.showEl').addClass('selected');
                        $("#member" + targetID).parent('li').remove();
                    } else {
                        $("#member" + targetID).remove();
                    }

                    $.each(user_list, function(k, v) {
                        if (v.id == targetID) {
                            if (v.is_active !== 0 && v.is_delete == 0) {
                                $('#updateRoomListMember').prepend(returnRoomMListDe(v))
                                $('#updateRoomListMember2').prepend(returnRoomMListDe(v))
                            }
                        }
                    })

                    removeA(adminArra, targetID);
                    removeA(participants, targetID);
                    $('#totalMember').text(participants.length);
                    forActiveCallIcon(onlineUserList, participants, conversation_type);
                    var memberList = $('.list_Count span').text();
                    var workSpaceName = $('#roomIdDiv').attr('data-keyspace');
                    var groupPrivacy = $('#roomIdDiv').attr('data-privecy');
                    var roomTitle = $("#roomIdDiv").attr('data-title');
                    socket.emit('groupMemberDelete', {
                        room_id: conversation_id,
                        memberList: memberList,
                        selectecosystem: workSpaceName,
                        teamname: roomTitle,
                        grpprivacy: groupPrivacy,
                        targetID: targetID,
                        createdby: user_id,
                        createdby_name: user_fullname,
                        company_id: company_id,
                        participants: participants,
                        adminArra: adminArra
                    });
                }
            } else if (data == 'nomem') {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("Add a member first", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Add a Member first".');
            } else {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("You can't remove", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('You can\'t remove.');
            }
            countRoomPart(adminArra, participants);
        }
    });
}

function removeusermember(targetUser, targetID, conversation_id, memberImgarray, memberImg, memberName, design, remain) {

    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conversation_id,
            targetUser: targetUser,
            targetID: targetID,
            user_id: user_id,
            company_id: company_id,
            root_conv_id: root_conv_id
        },
        dataType: 'json',
        url: '/alpha2/groupMemberDelete',
        success: function(data) {
            // console.log(2730,data);
            if (data.msg == 'success') {
                var stringBody = {
                    conv_id: conversation_id,
                    conv_title: $("#roomIdDiv").attr('data-title'),
                    new_user: [targetID],
                    type: 'member'
                }
                var noti_data = {
                    type: 'remove_conv_member',
                    title: $("#roomIdDiv").attr('data-title'),
                    body: JSON.stringify(stringBody),
                    created_at: new Date(),
                    created_by: user_id,
                    seen_users: [user_id],
                    receive_users: [targetID]
                }
                if(conversation_id !== user_id){
                    insertNotiFun(noti_data);
                  }

                var msg_body = '"' + findObjForUser(targetID).fullname + '" has been removed from this Room.';
                var notidata = {
                    type: 'remove_member',
                    sender: user_id,
                    sender_name: user_fullname,
                    sender_img: user_img,
                    conversation_id: conversation_id,
                    root_conv_id: root_conv_id,
                    msg_type: 'notification',
                    msg_body: msg_body
                }
                sendNotificationMsg(notidata);
                call_toastr(msg_body);
                if (has_permission(targetID, GUEST)) {
                    var remove_email_data = {
                        guest_id: targetID,
                        guest_name: findObjForUser(targetID).fullname,
                        guest_email: findObjForUser(targetID).email,
                        remove_by: user_fullname,
                        remove_by_email: user_email,
                        conversation_title: $("#roomIdDiv").attr('data-title'),
                        root_room_name: root_conv_id != null ? $("#conv" + root_conv_id).attr("data-name") : null,
                        company_id: company_id
                    };
                    socket.emit("send_email_remove_notification", remove_email_data, (rep) => {
                        // console.log("send_email_remove_notification", rep);
                    });
                }
                removeA(participants, targetID);
                var totalMember = parseInt($('.list_Count span').text());
                $('._miniMList_' + targetID).remove();
                if (totalMember > 0) {
                    $('.list_Count span').text(totalMember - 1);
                    $('#totalMember').text(totalMember - 1);
                    forActiveCallIcon(onlineUserList, participants, conversation_type);
                    $("#conv" + conversation_id).attr('data-tm', totalMember - 1);
                } else {
                    $('.list_Count span').text(0);
                    $('#totalMember').text(0);
                    // forActiveCallIcon(onlineUserList, participants, conversation_type);
                }
                // console.log(data.msg)

                if (data.msg == 'creator') {
                    // toastr["warning"]("You can\'t delete this user", "Warning");

                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('You can\'t delete this user.');
                } else {
                    if ($('#memberListBackWrap').is(':visible') == true) {
                        $('li #member' + targetID + '').parent('li').next('.showEl').addClass('selected');
                        $('li #member' + targetID + '').parent('li').remove();
                        removeA(adminArra, targetID);
                        removeA(participants, targetID);
                        $('#memberListBackWrap li:last').after(design);
                        popupMouseEnter();
                    } else {
                        removeA(adminArra, targetID);
                        removeA(participants, targetID);
                        $("#member" + targetID).remove();
                    }

                    var memberList = $('.list_Count span').text();
                    var workSpaceName = $('#roomIdDiv').attr('data-keyspace');
                    var groupPrivacy = $('#roomIdDiv').attr('data-privecy');
                    var roomTitle = $("#roomIdDiv").attr('data-title');
                    $('#totalMember').text(participants.length);
                    forActiveCallIcon(onlineUserList, participants, conversation_type);

                    for (let n = 0; n < invite_status.length; n++) {
                        if (invite_status[n].invite_to.toString() == targetID) {
                            invite_status.splice(n, 1);
                            break;
                        }
                    }

                    socket.emit('groupMemberDelete', {
                        room_id: conversation_id,
                        memberList: memberList,
                        selectecosystem: workSpaceName,
                        teamname: roomTitle,
                        targetID: targetID,
                        grpprivacy: groupPrivacy,
                        createdby: user_id,
                        createdby_name: user_fullname,
                        company_id: company_id,
                        participants: participants,
                        adminArra: adminArra,
                        conv_data: data.data,
                        root_conv_id: root_conv_id,
                        root_conv: data.root_conv
                    });
                }
            } else if (data.msg == 'nomem') {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("Add a member first", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Add a Member first.');
            } else {
                // toastr.options.closeButton = true;
                // toastr.options.timeOut = 2000;
                // toastr.options.extendedTimeOut = 1000;
                // toastr["warning"]("You can't remove", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('You can\'t remove.');
            }
            countRoomPart(adminArra, participants);
        }
    });
    $('#totalMember').text(participants.length);
    forActiveCallIcon(onlineUserList, participants, conversation_type);
}
// makeMember function used for make member as  a member from admin
var makeMember = (img, name, desig, id, cnvid) => {

    if (adminArra.length > 1) {
        $.ajax({
            type: 'POST',
            data: {
                conversation_id: cnvid,
                targetUser: name,
                targetID: id,
                user_id: user_id,
                company_id: company_id
            },
            dataType: 'json',
            url: '/alpha2/makeMember',
            success: function(data) {

                var convName = $('#conv' + cnvid).attr('data-name');
                var emitData = {
                        targetId: id,
                        targetName: name,
                        targetDesig: desig,
                        targetConv: cnvid,
                        targetImg: img,
                        conv_name: convName
                    }
                    // var stringBody = {
                    // 	conversation_id:cnvid,
                    // 	conversation_title:convName,
                    // 	new_user:[id]
                    // }
                    // var noti_data = {
                    // 	type:'make_member',
                    // 	title:convName,
                    // 	body:JSON.stringify(stringBody),
                    // 	created_at:new Date(),
                    // 	created_by:user_id,
                    // 	seen_users:[user_id],
                    // 	receive_users:[id]
                    //   }
                    // insertNotiFun(noti_data);
                var msg_body = '' + findObjForUser(id).fullname + ' admin access level to "' + convName + '" room has been revoked.';
                var data = {
                    type: 'make_member',
                    sender: user_id,
                    sender_name: user_fullname,
                    sender_img: user_img,
                    conversation_id: conversation_id,
                    root_conv_id: root_conv_id,
                    msg_type: 'notification',
                    msg_body: msg_body
                }
                sendNotificationMsg(data);
                call_toastr(msg_body);
                socket.emit('makeMember', emitData);
                $("#member" + id).remove();
                $('._miniMList_' + id).attr('user-type', 'member');
                var mldesign = ' <div class="member-div" data-type="member" id="member' + id + '">';
                mldesign += '   <img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(id).img + '" class="member-img">';
                mldesign += '   <div class="member-name">' + name + ' <span>@ Member</span></div>';
                // mldesign += '   <div class="member-designation" style="float:left;">, Navigate</div>';
                mldesign += '	<span class="remove-it GroupFlRight" onclick = "removeMember(\'member\',\'' + id + '\',\'' + cnvid + '\');">Remove</span>';
                mldesign += '   <span class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + img + '\',\'' + name + '\',\'' + desig + '\',\'' + id + '\',\'' + cnvid + '\')">REMOVE ADMIN</span>';
                mldesign += '   <span class="add-admin add2 GroupFlRight arfImg"   onclick="makeAdmin(\'' + img + '\',\'' + name + '\',\'' + desig + '\',\'' + id + '\',\'' + cnvid + '\')">Make Admin</span>';
                mldesign += ' </div>';

                $('#ml-listHl').append(mldesign);

                // $(".ml-listHl .member-div").mouseenter(function(e) {
                // 	$(this).find('.add-admin').show();
                // 	$(this).find('.remove-it').show();
                // }).mouseleave(function() {
                // 	$(this).find('.add-admin').hide();
                // 	$(this).find('.remove-it').hide();
                // });

                if ($('#ml-listHA .member-div').length > 0) {
                    $("#ml-admintype").show();
                } else {
                    $("#ml-admintype").hide();
                }

                if ($('#ml-listHl .member-div').length > 0) {
                    $("#ml-membertype").show();
                } else {
                    $("#ml-membertype").hide();
                }
                removeA(adminArra, id);
                countRoomPart(adminArra, participants);

                if (adminArra.length == 1) {
                    if ($("#conv" + cnvid).attr('data-createdby').trim() === adminArra[0]) {
                        $("#conv" + cnvid).attr('data-createdby', 0);
                        $("#conv" + cnvid + " .removeThisGroup").remove();
                    }
                }

                if (adminArra.length > 1) {
                    $('#hideThisRoom').show();
                } else {
                    $('#hideThisRoom').hide();
                }
            }
        });
    } else {
        // toastr["warning"]("You can\'t remove this user. Make an admin first", "Warning");
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('You can\'t remove this user. Make an admin first');
    }
};

// makeMember function used for make admin as  a member from member
var makeAdmin = (img, name, desig, id, cnvid) => {

    $.ajax({
        type: 'POST',
        data: {
            conversation_id: cnvid,
            targetUser: name,
            targetID: id,
            user_id: user_id,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/makeAdmin',
        success: function(data) {
            var convName = $('#conv' + conversation_id).attr('data-name');
            var emitData = {
                    targetId: id,
                    targetName: name,
                    targetDesig: desig,
                    targetConv: cnvid,
                    targetImg: img,
                    conv_name: convName,
                }
                // var stringBody = {
                // 	conversation_id:cnvid,
                // 	conversation_title:convName,
                // 	new_user:[id]
                // }
                // var noti_data = {
                // 	type:'make_admin',
                // 	title:convName,
                // 	body:JSON.stringify(stringBody),
                // 	created_at:new Date(),
                // 	created_by:user_id,
                // 	seen_users:[user_id],
                // 	receive_users:[id]
                //   }
                // insertNotiFun(noti_data);
            var msg_body = '' + findObjForUser(id).fullname + ' is now an admin for this room.';
            var data = {
                type: 'make_admin',
                sender: user_id,
                sender_name: user_fullname,
                sender_img: user_img,
                conversation_id: conversation_id,
                root_conv_id: root_conv_id,
                msg_type: 'notification',
                msg_body: msg_body
            }
            sendNotificationMsg(data);
            call_toastr(msg_body);
            socket.emit('make_admin', emitData);
            $('._miniMList_' + id).attr('user-type', 'admin');
            $("#member" + id).remove();
            var mldesign = ' <div class="member-div" data-type="admin" id="member' + id + '">';
            mldesign += '   <img src="' + file_server + 'profile-pic/Photos/' + findObjForUser(id).img + '" class="member-img">';
            mldesign += '   <div class="member-name">' + name + ' <span>@ Admin </span></div>';
            mldesign += '   <div class="member-designation" style="float:left;"></div>';
            mldesign += '   <span class="remove-it GroupFlRight" onclick = "removeMember(\'admin\',\'' + id + '\',\'' + cnvid + '\');">Remove</span>';
            mldesign += '   <span class="remove-admin remove2 GroupFlRight arfImg" onclick="makeMember(\'' + img + '\',\'' + name + '\',\'' + desig + '\',\'' + id + '\',\'' + cnvid + '\')">REMOVE ADMIN</span>';
            mldesign += '   <span class="add-admin add2 GroupFlRight arfImg"   onclick="makeAdmin(\'' + img + '\',\'' + name + '\',\'' + desig + '\',\'' + id + '\',\'' + cnvid + '\')">Make Admin</span>';
            mldesign += ' </div>';

            $('#ml-listHl').prepend(mldesign);

            // $("#ml-listHl .member-div").mouseenter(function(e) {
            // 	$(this).find('.remove-admin').show();
            // 	$(this).find('.remove-it').show();
            // }).mouseleave(function() {
            // 	$(this).find('.remove-admin').hide();
            // 	$(this).find('.remove-it').hide();
            // });

            if ($('#ml-listHl .member-div').length > 0) {
                $("#ml-admintype").show();
            } else {
                $("#ml-admintype").hide();
            }

            if ($('#ml-listHl .member-div').length > 0) {
                $("#ml-membertype").show();
            } else {
                $("#ml-membertype").hide();
            }

            adminArra.push(id);
            countRoomPart(adminArra, participants)

            if (adminArra.length > 1) {
                $('#hideThisRoom').show();
            } else {
                $('#hideThisRoom').hide();
            }

            // if ($("#conv" + cnvid).attr('data-createdby') == 0) {
            // 	$("#conv" + cnvid).attr('data-createdby', user_id.trim())
            // 	$("#conv" + cnvid).append('<span class="remove removeThisGroup" onclick="removeThisGroup(\'' + cnvid + '\')" data-balloon="Click to leave" data-balloon-pos="left" style="display: inline;"></span>');
            // }

        }
    });
};

// $("#team-name").on('blur keypress', function(e) {


// });

function saveFUpdate(e) {
    // var code = e.keyCode || e.which;
    if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
        if ($.inArray(user_id, adminArra) !== -1) {
            var roomid = $("#updatechannelContainer").attr('conv-id');
            var roomTitle = $("#updatechannelContainer").attr('room-title');
            // if (code == 13) { //Enter keycode = 13
            // e.preventDefault();
            // e.stopImmediatePropagation();
            if ($("#updateRoomTitle").val() != "" && $("#updateRoomTitle").val() != " ") {
                var newGroupname = $("#updateRoomTitle").val().trim().replace(/,/g, ' ');

                socket.emit('saveGroupName', {
                    conversation_id: roomid,
                    newGroupname: newGroupname,
                    user_id: user_id,
                    company_id: company_id
                }, (callback) => {


                    if (callback.status) {
                        //$("#updateRoomTitle").blur();
                        // var msg_body = ''+user_fullname+' changed the Room Title from "'+$('#conv_title .converstaion_name').text()+'" to "'+newGroupname+'"'
                        var msg_body = 'Room name has been changed from "' + $('#conv_title .converstaion_name').text() + '" to "' + newGroupname + '"'
                        var data = {
                            type: 'update_room_title',
                            sender: user_id,
                            sender_name: user_fullname,
                            sender_img: user_img,
                            conversation_id: conversation_id,
                            root_conv_id: root_conv_id,
                            msg_type: 'notification',
                            msg_body: msg_body
                        }
                        sendNotificationMsg(data);
                        call_toastr(msg_body);
                        $("#conv_title .converstaion_name").text(newGroupname);
                        $("#conv" + roomid + ' .usersName').text(newGroupname);
                        $("#roomIdDiv").attr('data-title', newGroupname)
                        $("#updateRoomTitle").val(newGroupname);
                        $(".side_bar_list_item li.sideActive").attr('data-name', newGroupname);
                    } else if (callback.exist) {
                        if (roomTitle != newGroupname && $('#updatechannelContainer').is(':visible')) {
                            // $('#existRoomPrivate').hide();
                            // $('#existRoomPublic').hide();
                            if (!$("#team-name").is(":focus")) {
                                // //debugger;
                                $("#roomExistPop .hayven_Modal_heading h1").text("This Room already exists."); // ?? sujon
                                $('#roomExistPop').css('display', 'flex');
                            }
                            $('#existRoomFoot').html("");
                            $('#existDataTitle').text(callback.data[0].title);
                            if (callback.data[0].privacy == 'private') {
                                // $('#exitDataPrivacy').attr("class",'lock');
                                $('#existRoomPrivate').show();
                                // $('#existRoomPublic').hide();

                            } else {
                                $('#existRoomPrivate').show();
                                $('#exitDataPrivacy').attr("class", 'hash');
                                if (callback.data[0].participants.indexOf(user_id) == -1) {
                                    $('#existRoomFoot').append('<h3 class="click-to-join width100" id="exitJoinBtn">Join this room</h3>');
                                    $("#exitJoinBtn").attr("onclick", "joinRoom('','" + callback.data[0].created_by + "', '" + callback.data[0].privacy + "' ,'" + callback.data[0].group_keyspace + "','" + callback.data[0].conversation_id + "','" + user_id + "','" + callback.data[0].title + "')");
                                } else {
                                    if (callback.data[0].participants_admin.length > 1) {

                                        $('#existRoomFoot').append('<h3 class="click-to-leave width100" id="exitLeaveBtn">Leave this room</h3>');
                                    } else {
                                        $('#existRoomFoot').append('<h3 class="click-to-leave width100 inactive">Leave this room</h3>');

                                    }
                                    $("#exitLeaveBtn").attr("onclick", "leaveRoom(\'" + callback.data[0].participants.length + "\',\'" + callback.data[0].created_by + "\',\'" + callback.data[0].privacy + "\',\'" + callback.data[0].group_keyspace + "\',\'" + callback.data[0].conversation_id + "\',\'" + user_id + "\')");
                                }

                            }

                            $('#existRoomName').attr('data-roomid', callback.data[0].conversation_id);
                            $('#existRoomName').attr('data-title', callback.data[0].title);
                            $('#existRoomName').attr('data-privecy', callback.data[0].privecy);
                            $('#existRoomName').attr('data-keyspace', callback.data[0].group_keyspace);
                            $('#existRoomName').attr('data-admin', callback.data[0].participants_admin.join(','));
                            $('#existRoomName').attr('data-participants', callback.data[0].participants.join(','));
                            $('#existRoomTooltip').html("");
                            $.each(user_list, function(k, v) {
                                if (callback.data[0].participants.indexOf(v.id) > -1) {
                                    $('#existRoomTooltip').append(v.fullname + '<br>');
                                }
                            });
                            $('#existRoomPcount').html('<img src="/images/basicAssets/Users.svg" alt="" > ' + callback.data[0].participants.length + ' Members');


                        }
                    }
                });
            } else {
                $("#updateRoomTitle").val(newGroupname);
                // toastr["warning"]("You can\'t set an empty group name", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('You can\'t set an empty group name');
            }
            // }
        } else {
            // toastr["warning"]("Please contact with room owner or admin", "Warning");

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('Please contact with Room Owner or Admin');
        }

    } else if ($('#createChannelContainer').is(':visible')) {
        if ($('#team-name').val() != ' ' && $('#team-name').val() != '') {
            socket.emit('checkThisTitle', { user_id: user_id, title: $('#team-name').val(), company_id: company_id }, function(callback) {
                if (callback.status && callback.exist) {

                    // $('#existRoomPrivate').hide();
                    // $('#existRoomPublic').hide();
                    if (!$("#team-name").is(":focus")) {
                        // //debugger;
                        $("#roomExistPop .hayven_Modal_heading h1").text("This Room already exists."); // ?? sujon
                        $('#roomExistPop').css('display', 'flex');
                    }
                    $('#existRoomFoot').html("");
                    $('#existDataTitle').text(callback.data[0].title);
                    checktitleforcreateroom = false;
                    if (callback.data[0].privacy == 'private') {
                        // $('#exitDataPrivacy').attr("class",'lock');
                        $('#existRoomPrivate').show();
                        $('#existRoomPublic').hide();

                    } else {
                        $('#existRoomPublic').show();
                        $('#exitDataPrivacy').attr("class", 'hash');
                        if (callback.data[0].participants.indexOf(user_id) == -1) {
                            $('#existRoomFoot').append('<h3 class="click-to-join width100" id="exitJoinBtn">Join this room</h3>');
                            $("#exitJoinBtn").attr("onclick", "joinRoom('','" + callback.data[0].created_by + "', '" + callback.data[0].privacy + "' ,'" + callback.data[0].group_keyspace + "','" + callback.data[0].conversation_id + "','" + user_id + "','" + callback.data[0].title + "')");
                        } else {
                            if (callback.data[0].participants_admin.length > 1) {

                                $('#existRoomFoot').append('<h3 class="click-to-leave width100" id="exitLeaveBtn">Leave this room</h3>');
                            } else {
                                $('#existRoomFoot').append('<h3 class="click-to-leave width100 inactive">Leave this room</h3>');

                            }
                            $("#exitLeaveBtn").attr("onclick", "leaveRoom(\'" + callback.data[0].participants.length + "\',\'" + callback.data[0].created_by + "\',\'" + callback.data[0].privacy + "\',\'" + callback.data[0].group_keyspace + "\',\'" + callback.data[0].conversation_id + "\',\'" + user_id + "\')");
                        }

                    }

                    $('#existRoomName').attr('data-roomid', callback.data[0].conversation_id);
                    $('#existRoomName').attr('data-title', callback.data[0].title);
                    $('#existRoomName').attr('data-privecy', callback.data[0].privecy);
                    $('#existRoomName').attr('data-keyspace', callback.data[0].group_keyspace);
                    $('#existRoomName').attr('data-admin', callback.data[0].participants_admin.join(','));
                    $('#existRoomName').attr('data-participants', callback.data[0].participants.join(','));
                    $('#existRoomTooltip').html("");
                    $.each(user_list, function(k, v) {
                        if (callback.data[0].participants.indexOf(v.id) > -1) {
                            $('#existRoomTooltip').append(v.fullname + '<br>');
                        }
                    });
                    $('#existRoomPcount').html('<img src="/images/basicAssets/Users.svg" alt="" > ' + callback.data[0].participants.length + ' Members');
                } else {
                    checktitleforcreateroom = true;

                }
                createRoomCheckReqdata();
            })
        } else {
            checktitleforcreateroom = false;
            createRoomCheckReqdata();
        }
    }
}

function titleRoomOnClick(ele) {
    var room_name = $(ele).val().trim();
    var work_category = $("#business_unit").children("option:selected").val().trim();
    if (work_category == "") {
        $("#warnignMsgText").html("Please select a work category.");
        $("#warningsPopup").css('display', 'flex');
    }
}

function sendNotificationMsg(data) {
    socket.emit('send_notification_msg', data, function(res) {

    })
}
$('body').on('keydown', '#updateRoomTitle', function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $("#updateRoomTitle").blur();
    }
})

var updateWorkspace = (thisValue) => {
    if (thisValue != 0) {
        $("#team_name_holder .select2-selection .select2-selection__rendered").css("color", "#000 !important");
    } else {
        $("#team_name_holder .select2-selection .select2-selection__rendered").css("color", "#D2DDEA !important");
    }
    if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
        if ($.inArray(user_id, adminArra) !== -1) {

            var roomid = $("#roomIdDiv").attr('data-roomid');
            var roomTitle = $("#roomIdDiv").attr('data-title');

            socket.emit('updateKeySpace', {
                conversation_id: roomid,
                keySpace: thisValue,
                user_id: user_id,
                company_id: company_id
            }, (callBack) => {

                // console.log(callBack);
                toastr["success"]("Workspace changed successfully", "Success");
            });
        } else {
            // toastr["warning"]("Please contact with room owner or admin", "Warning");

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('Please contact with Room Owner or Admin');
        }
    } else if ($('#createChannelContainer').is(':visible')) {
        memberListUUID = [];
        adminListUUID = [];
        $('.temppaddedMember_').remove();
        $('#newlyAddmembers').trigger('click');
    }
    createRoomCheckReqdata();
};

// msg history for own msg
var tagListTitle = [];
var tagLsitDetail = [];
var alltags = [];
var alltagsFull = [];

var my_conversation = (event) => {
    $('#roomIdDiv').removeAttr('data-balloon-pos').removeAttr('data-balloon');
    $('#roomIdDiv .msg-user-photo img').removeClass('viewTooltip');
    $('.chat-head-name').css('height', 'unset')
    if ($('#msg').attr('data-checklist') == 'true') {
        $('#msgCheckItemContainer').remove();
        $('#msg').attr('data-checklist', 'false');
        $('#msg').attr('contenteditable', true);
        $('#msgCheckListBtn').removeClass('active');
        $('#msg').remove('.msgCheckListContainer');
        $('#msg').focus();
    }
    selectedMessages = [];
    $('#selectMessage').removeClass('selected');
    $('#selectMessage').removeClass('activeComFilter');
    // $('#selectedMsgActionDiv').hide();
    $('#groupChatContainer').removeClass('selectAction');

    pageCustomLoader(true);
    if (!$(event.target).hasClass('sideActive')) {
        adminArra = [];
        participants = [];
        participants_guest = [];
        participants_sub = [];

        if ($('#groupChatContainer').is(":visible") == false) {
            $(".connect_right_section").hide();
            $('#groupChatContainer').show();
        }

        if ($("#defaultRoom").is(":visible")) {
            $("#defaultRoom").remove();
        }

        var id = to = room_id = $(event.target).attr("data-id");
        var type = conversation_type = $(event.target).attr("data-conversationtype");
        var conversationid = conversation_id = $(event.target).attr("data-conversationid");
        var name = room_name = $(event.target).attr("data-name");
        var img = room_img = $(event.target).attr("data-img");
        var subtitle = $(event.target).attr("data-subtitle");
        var tm = $(event.target).attr("data-tm");
        var status = $(event.target).find('.online, .offline, .hash, .lock').attr('class');
        updateLastActiveConnect(conversationid);

        $("#pin-to-bar").attr('data-conversationid', '');
        $("#createConvTag").attr('data-roomid', conversationid);

        $("#lastActive").val(conversationid);

        $("#pin-to-bar").attr('data-id', '');
        $("#pin-to-bar").attr('data-subtitle', '');
        $("#pin-to-bar").attr('data-img', '');
        $("#pin-to-bar").attr('data-name', '');
        $("#pin-to-bar").attr('data-type', '');
        $("#pin-to-bar").attr('src', '/images/basicAssets/custom_pinned.svg');

        // //use for set title upper side of msg body
        // $("#conv_title").text('#'+name);
        // $("#conv_key").text('@'+subtitle);
        // $("#totalMember").text('1');


        //use for set title upper side of msg body
        $("#conv_title").html('<span class="' + status + '" style="top: 16px;z-index: 9;"></span><div class="msg-user-photo" style=""><img src="' + file_server + 'profile-pic/Photos/' + img + '" alt="" data-value="' + file_server + 'profile-pic/Photos/' + img + '" onclick="viewRoomImg(event,\'user\',this)" style="position:absolute; margin:auto;left:17px;top:18px;background: #f5f5f5;"></div><span class="converstaion_name">' + name + '</span>');
        $("#conv_key").text('@ ' + subtitle);
        $("#conv_title").css('margin-left', '27px');

        // $("#totalMember").text(tm);
        $("#msg").html("");
        $("#msg-container").html("");

        $('.voice-call').hide();
        $('.video-call').hide();
        //Msg placeholder
        $("#msg").attr('placeholder', 'Message ' + name + '');

        // Chat head member count div
        if (type == "group") {
            $('.chat-head-name h4').css('display', 'block');
            $('.chat-head-name').css('margin-top', '17px');
            $('#roomIdDiv').css('cursor', 'pointer');
            //$('#leaveThisRoom').show();
            $('#roomIdDiv').attr('onclick', "roomEdit(event,$(this).attr('data-roomid'),$(this).attr('data-title'),$(this).attr('data-privecy'),$(this).attr('data-keyspace'),$(this).attr('data-convimg'))");
            if (name.indexOf(',') > -1) {
                $('#leaveThisRoom').text('Leave group');
            } else {
                $('#leaveThisRoom').text('Leave this room');
            }

        } else if (type == "personal") {
            $("#roomIdDiv").attr('data-roomid', conversation_id);
            $('.chat-head-name h4').css('display', 'none');
            $('.chat-head-name').css('margin-top', '28px');
            $('#roomIdDiv').removeAttr('onclick');
            $('#roomIdDiv').css('cursor', 'default');
            $('#leaveThisRoom').hide();
            $(".chat-head-name").css('pointer-events', 'auto');
            $(".chat-head-more-menu").css('pointer-events', 'auto');
            $(".pin-unpin").css('pointer-events', 'none');
            $(".tagged").css('pointer-events', 'auto');
            $(".media").css('pointer-events', 'auto');
            $("#msg").css('pointer-events', 'auto');
            $(".msgs-form-users").css('pointer-events', 'auto');
            $("#msg").attr('contenteditable', true);
            $("#msg").focus();
        }

        // For tag purpose. while clicking on room or personal
        $('.chat-head-calling .more-menu').show();
        $('.chat-head-calling .addTagConv').hide();
        $('.chat-head-calling .tagged').show();
        $("#taggedList").html("");
        $("#levelListp").html("");
        tagListTitle = [];
        tagLsitDetail = [];
        $("#fileAttachTagLs").html('');
        tagListForFileAttach = [];

        FtempArray = [];
        FtaggedList = [];

        $("#taggedIMG").attr('src', '/images/basicAssets/custom_not_tag.svg');
        $("#createConvTag").val('');
        $("#tagItemList").text('');

        var this_msg_unread = $("#conv" + conversation_id).find(".unreadMsgCount").html();
        total_unread_count -= Number(this_msg_unread);
        display_show_hide_unread_bar(total_unread_count);
        $("#conv" + conversation_id).find(".unreadMsgCount").html("");

        var seartTxt = $("#searchText").val();

        var chklsky = has_conv_into_local(conversationid);
        if (chklsky != -1) {
            start_my_conv_success(localstorage['get_conversation_history'][chklsky], type, id, conversationid, name, img, user_id, seartTxt, 100);
        } else {
            $("#onscrollloading").show();
            socket.emit('get_conversation_history', { type, id, conversationid, name, img, user_id, seartTxt }, (respons) => {
                if (respons.msg == "success") {
                    localstorage['get_conversation_history'].push(respons);
                    // localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
                    start_my_conv_success(respons, type, id, conversationid, name, img, user_id, seartTxt, 1000);
                } else {
                    // console.log("failed to load");
                }
                $("#onscrollloading").hide();
            });
        }

        sideBarActiveInactive(event);
        unread_msg_conv_intop();
    }

    if ($('#mediaFilePreview').is(':visible')) {
        $('#mediaFilePreview').hide();
    }
    if (windowWidth <= 415) {
        $('#hayvenSidebar').hide();
    }

    $('#conversationFileView').removeClass('active');
    if ($('.attach_tag').length > 0) {
        $('#conversationFileView').addClass('active');
    }
};

function start_my_conv_success(respons, type, id, conversation_id, name, img, user_id, seartTxt, time = 1000) {
    pageCustomLoader(false);
    var need_update_message_seen_list = [];

    if (respons.tags != undefined) {

        var taggedID = respons.tags; //all con tag tag_id
        var condtagsid = FtaggedList = respons.condtagsid; //all con tag id

        var tempTagList = [];

        var totalTagslist = FtempArray = _.orderBy(respons.totalTags, ['title'], ['asc']);

        $.each(totalTagslist, function(k, v) {

            if (alltags.indexOf(v.title.toLowerCase()) === -1) {
                my_tag_list[v.tag_id] = v.title.toLowerCase();
                alltags.push(v.title.toLowerCase());
                alltagsFull.push(v);
                my_tag_id.push(v.tag_id.toString());
            }

            if (condtagsid.indexOf(v.tag_id) !== -1) {
                tagListForFileAttach.push(v.title.toLowerCase());
                if (hiddenTagName.indexOf(v.title) == -1) {
                    tagListTitle.push(v.title.toLowerCase());
                }
                tagLsitDetail.push({ 'cnvtagid': taggedID[condtagsid.indexOf(v.tag_id)], 'tagid': v.tag_id, 'tagTitle': v.title.toLowerCase(), 'roomid': conversation_id, 'visibility': v.visibility });

                var newClass = (v.visibility == 'hidden') ? "hiddenTag _htid_" + v.tag_id : "visibletrue";
                var design = '<li onclick="removeLevel(\'' + taggedID[condtagsid.indexOf(v.tag_id)] + '\',\'' + conversation_id + '\',\'' + v.tag_id + '\')" class=' + newClass + '>' + v.title + '<span class="tagcheck" id="level' + taggedID[condtagsid.indexOf(v.tag_id)] + '"></span></li>';

                if (tempTagList.indexOf(v.tag_id) === -1) { tempTagList.push(v.tag_id); }
                if ($('#level' + taggedID[condtagsid.indexOf(v.tag_id)]).length == 0) {

                    $('#taggedList').append(design);
                }
            }
        });
        $.each(totalTagslist, function(k, v) {
            var newClass = (v.visibility == 'hidden') ? "hiddenTag _htid_" + v.tag_id : "visibletrue";
            if (tempTagList.indexOf(v.tag_id) === -1) {
                var design = '<li id="tagLi' + v.tag_id + '" onclick="addTagto(\'' + v.tag_id + '\',\'' + conversation_id + '\')" class=' + newClass + '>' + v.title + '</li>';
                if ($('#tagLi' + v.tag_id).length == 0) {

                    $('#taggedList').append(design);
                }
            }
        });

        if (tagListTitle.length > 0) {
            $("#tagItemList").text(tagListTitle.join(','));
            $("#taggedIMG").attr('src', '/images/basicAssets/custom_tagged.svg');
        }
    }

    var msg_ids = [];
    var noattch = 0;
    var convlist = respons.conversation_list;
    convlist.reverse();
    $.each(convlist, function(k, v) {
        if (noattch > 8) return false;
        noattch += count_no_of_attch(v);
        // console.log(noattch);
        msg_ids.push(v.msg_id);
        draw_msg(v, false);
        if (v.msg_status == null) {
            if (v.sender == user_id) {
                // This msg send by this user; so no need to change any seen status
            } else {
                // This msg receive by this user; so need to change seen status
                need_update_message_seen_list.push(v.msg_id);
            }
        }

        // If msg status have some user id, then
        else {
            if (v.msg_status.indexOf(user_id) > -1) {
                // This msg already this user seen
                if (v.sender != user_id) {
                    // This msg receive by this user; so need to change seen status
                    need_update_message_seen_list.push(v.msg_id);
                }
            } else {}
        }
    });

    // var bLazy = new Blazy({
    // 	selector: '.blazy',
    // 	offset: 100,
    // 	container: '#msg-container'
    // });
    inviewfun();

    if (respons.messagestag != undefined) {
        if (respons.messagestag.length > 0) {
            $.each(respons.messagestag, function(k, v) {
                msgIdsFtag.push(v.id);
                if (v.tag_title != undefined) {
                    if (v.tag_title !== null) {
                        if (v.tag_title.length > 0) {
                            $.each(v.tag_title, function(kt, vt) {
                                $("#filesTag" + v.message_id).append('<span class="filesTag">' + vt + '</span>')
                            });
                            $("#filesTag" + v.message_id).show();
                            $("#filesTagHolder" + v.message_id).show();
                        }
                    }
                }
            });
        }
    }

    // if($("#sideBarSearch").val() != ""){
    // 	var str = $('#sideBarSearch').val();
    // 	str = str.replace(/<\/?[^>]+(>|$)/g, "");
    // 	$('.user-msg>p').unhighlight();
    // 	$('.user-msg>p').highlight(str);
    // }

    setTimeout(function() {
        scrollToBottom('.chat-page .os-viewport', 0);
    }, time);

    // if (need_update_message_seen_list.length > 0) {
    // 	$.ajax({
    // 		url: '/alpha2/update_msg_status',
    // 		type: 'POST',
    // 		data: {
    // 			msgid_lists: JSON.stringify(need_update_message_seen_list),
    // 			user_id: user_id
    // 		},
    // 		dataType: 'JSON',
    // 		success: function(res) {
    // 			socket.emit('update_msg_seen', {
    // 				msgid: need_update_message_seen_list,
    // 				senderid: to,
    // 				receiverid: user_id,
    // 				conversation_id: conversation_id
    // 			});
    // 		},
    // 		error: function(err) {
    // 			console.log(err);
    // 		}
    // 	});
    // }

    scrollToBottom('.chat-page .os-viewport', 0);
}
var msgIdsFtag = [];


var removeLevel = (lID, rommID, rootTag) => {
    var thisText = '';
    var indx = "";

    if ($('#updatechannelContainer').is(':visible')) {
        $('#temmpTagContainerUpdate .valremove[data-val="' + lID + '"]').parent('.item').remove();
    }

    var sendTagaT = $("#level" + lID).parent('li').text().toLowerCase();

    socket.emit('deleteTag', {
        tagid: lID,
        rommID: rommID,
        msgIdsFtag: msgIdsFtag,
        tagtile: sendTagaT
    }, (callBack) => {
        if (callBack.status) {

            $("#level" + lID).parent('li').attr('id', 'tagLi' + rootTag);
            $("#level" + lID).parent('li').attr('onclick', 'addTagto(\'' + rootTag + '\',\'' + rommID + '\')');
            $("#level" + lID).remove();

            $.each(tagLsitDetail, function(tdk, tdv) {
                if (rootTag == tdv.tagid && rommID == tdv.roomid) {
                    thisText = tdv.tagTitle;
                    indx = tdk;
                }
            });

            removeA(tagListForFileAttach, thisText);
            removeA(tagListTitle, thisText);
            tagLsitDetail.splice(indx, 1);

            $("#tagItemList").text(tagListTitle.join(','));

            if (tagListTitle.length > 0) {
                $("#taggedIMG").attr('src', '/images/basicAssets/custom_tagged.svg');
            }

            if (tagListTitle.length == 0) {
                $("#createConvTag").val("");
                $("#taggedIMG").attr('src', '/images/basicAssets/custom_not_tag.svg');
            }

            $(".filesTag").each(function() {
                if ($(this).text() == thisText) {
                    $(this).remove();
                }
            });

            $.each(attachFileList, function(k, v) {
                if ($("#filesTag" + v + " .filesTag").length == 0) {
                    $("#filesTagHolder" + v).hide();
                }
            });
        }
        var localData = {
            rommID: rommID,
            tagid: rootTag,
            tagtile: sendTagaT
        }
        update_local_conv_tag('deactive', localData, lID)

        if ($('#updatechannelContainer').is(':visible')) {
            $('._minitag_' + lID + '').remove();
            $('#temmpTagContainerUpdate .valremove[tag-id="' + rootTag + '"]').parent('.item').remove();
            $.each(alltagsFull, function(k, v) {
                // console.log(rootTag,v.tag_id)
                if (v.visibility == 'visible') {
                    if (rootTag == v.tag_id) {
                        if (!$('#temmpTagContainerUpdate .valremove[tag-id="' + v.tag_id + '"]').is(':visible')) {
                            $('#oldCovTagall').prepend('<div room-id="' + rommID + '" onclick="addTagto(\'' + v.tag_id + '\',\'' + rommID + '\')" class="tag tag_id_' + v.tag_id + '" data-id="' + v.tag_id + '">' + v.title + '</div>');
                        }
                    }
                }
            })
        } else {
            $('._minitag_' + lID + '').remove();
            $('#temmpTagContainerUpdate .valremove[tag-id="' + rootTag + '"]').parent('.item').remove();
        }
        submitActiveClass('updateroomTagPopup', $('#updateTagContainer .item').length);
    });
};

var addTagto = (lID, rommID) => {
    var sendTagarr = [];
    var tagssid = [];
    var sendTagaT = $("#tagLi" + lID).text().toLowerCase();
    var tagName = $("#oldCovTagall .tag_id_" + lID).text().toLowerCase();
    socket.emit('saveConvTag', {
        tagid: lID,
        conversation_id: rommID,
        messgids: attachFileList,
        msgIdsFtag: msgIdsFtag,
        tagtile: sendTagaT
    }, (callBack) => {
        // console.log(callBack);
        if (callBack.status) {

            $("#tagLi" + lID).removeAttr('onclick');
            $("#tagLi" + lID).html($("#tagLi" + lID).text() + '<span class="tagcheck" id="level' + callBack.id + '"></span>');

            $("#tagLi" + lID).attr('onclick', 'removeLevel(\'' + callBack.id + '\',\'' + rommID + '\',\'' + lID + '\')');
            $("#tagLi" + lID).removeAttr('id');

            tagListForFileAttach.push(sendTagaT.toLowerCase());
            if (hiddenTagName.indexOf(sendTagaT.toLowerCase()) == -1) {
                // console.log(2836,sendTagaT.toLowerCase())
                tagListTitle.push(sendTagaT.toLowerCase());
            }
            tagLsitDetail.push({ 'cnvtagid': callBack.id, 'tagid': lID, 'tagTitle': sendTagaT, 'roomid': rommID, 'visibility': callBack.visibility });

            if (tagListTitle.length > 0) {
                $("#tagItemList").text(tagListTitle.join(','));
                $("#taggedIMG").attr('src', '/images/basicAssets/custom_tagged.svg');
            }

            $.each(attachFileList, function(k, v) {
                $("#filesTag" + v).append('<span class="filesTag">' + sendTagaT.toLowerCase() + '</span>');
                $("#filesTagHolder" + v).show();
            });

            my_tag_list[lID] = sendTagaT.toLowerCase();
            my_tag_id.push(lID);
            var localData = {
                tagid: lID,
                conversation_id: rommID,
                tagtile: sendTagaT
            }
            update_local_conv_tag('active', localData, callBack.id);

            if ($('#updatechannelContainer').is(':visible')) {
                var tagid = callBack.id;
                var tagname = tagName;
                $('.tag_id_' + lID + '').remove();
                var html2 = '<div class="item _minitag_' + callBack.id + '">' +
                    '<p class="valtext">' + tagname + '</p>' +
                    '<span class="valremove" data-val="' + tagname + '" data-id="' + tagid + '" onclick="removeLevel(\'' + callBack.id + '\',\'' + rommID + '\',\'' + lID + '\')" tag-id="' + lID + '" data-balloon="Remove tag" data-balloon-pos="up"></span>' +
                    '</div>'

                var newHtml = '<div class="item _minitag_' + callBack.id + '" >' +
                    '<p class="valtext">' + tagname + '</p>' +
                    '</div>';

                $('#temmpTagContainerUpdate').prepend(newHtml);
                $('#updateTagContainer').prepend(html2);
                $('#updateTagContainer').next('input').focus();
            } else {
                var tagid = callBack.id;
                var tagname = tagName;
                $('.tag_id_' + lID + '').remove();
                var html2 = '<div class="item _minitag_' + callBack.id + '">' +
                    '<p class="valtext">' + tagname + '</p>' +
                    '<span class="valremove" data-val="' + tagname + '" data-id="' + tagid + '" onclick="removeLevel(\'' + callBack.id + '\',\'' + rommID + '\',\'' + lID + '\')" tag-id="' + lID + '" data-balloon="Remove tag" data-balloon-pos="up"></span>' +
                    '</div>'

                var newHtml = '<div class="item _minitag_' + callBack.id + '" >' +
                    '<p class="valtext">' + tagname + '</p>' +
                    '</div>';

                $('#temmpTagContainerUpdate').prepend(newHtml);
                $('#updateTagContainer').prepend(html2);
                $('#updateTagContainer').next('input').focus();
            }

        } else {
            if (callBack.err == 'at') {
                // toastr["warning"]("\""+tagTitle+"\" already tagged", "Warning");

                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text("\"" + tagTitle + "\" already tagged.");
            }
        }
        submitActiveClass('updateroomTagPopup', $('#updateTagContainer .item').length);
    });
}

var taggedIDOnload = [];
var taggedRoomID = [];
var taggedCheckedID = [];
var taggedCheckedRoom = [];

function getTaggedData(Darray) {
    var promises = [];
    var itemRows = Darray;
    for (var i = 0; i < itemRows.length; i++) {
        var id = itemRows[i];
        var p = new Promise(function(resolve, reject) { dbData(id, resolve, reject); });
        promises.push(p);
    }
    Promise.all(promises).then(function(data) {
        recalcTotals(data);
    });
}

function dbData(id, resolve, reject) {
    socket.emit('taggedData', {
        tagid: id
    }, (callBack) => {
        if (callBack.status) {
            return resolve(callBack.tagDet);
        } else {
            return reject();
        }

    });
}

function search(tagid, roomid, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].tagid === tagid && myArray[i].roomid === roomid) {
            return myArray[i];
        }
    }
}

function countElement(item, array) {
    var count = 0;
    $.each(array, function(i, v) { if (v === item) count++; });
    return count;
}

var tagged_conv_list = [];

function recalcTotals(data) {
    if (data.length > 0) {
        var dbData = [];

        $.each(data, function(k, v) {
            $.each(v, function(kd, vd) {
                dbData.push(vd);
            });
        });

        $.each(dbData, function(k, v) {
            if (search(v.tag_id, v.conversation_id, taggedCheckedRoom) == undefined) {
                taggedCheckedRoom.push({ 'tagid': v.tag_id, 'roomid': v.conversation_id });
                taggedRoomID.push(v.conversation_id);
            }
        });

        $.each(taggedRoomID, function(k, v) {
            if (parseInt(taggedCheckedID.length) == parseInt(countElement(v, taggedRoomID))) {
                if (currentConv_list.length > 0) {
                    if (currentConv_list.indexOf(v) > -1) {
                        $("#conv" + v).show();
                    }
                } else {
                    $("#conv" + v).show();
                    if (tagged_conv_list.indexOf(v) === -1) {
                        tagged_conv_list.push(v);
                    }
                }
            }
        });

    }
}

// $(".checkToDo").click(function(e){

// 	if(e.target.checked){
// 		e.preventDefault();
// 		e.stopImmediatePropagation();

// 		var tagtitle = $("#"+e.target.id).attr('data-tagtitle');
// 		var tagid = $("#"+e.target.id).attr('data-tagid');

// 		console.log(tagtitle);

// 		$('#taggedItem .checkToDo').each(function (i, row) {
// 		    if($(row).is(':checked')){
// 		    	if(taggedCheckedID.indexOf($(row).attr('data-tagid')) === -1){
// 		    		taggedCheckedID.push($(row).attr('data-tagid'));
// 		    	}
// 		    }

// 		});

// 		$("#conversation_list_sidebar li").hide();
// 		$("#pintul li").hide();
// 		$("#conversation_list_sidebar li").hide();

// 		var design 	= '<div class="tag_item" id="'+e.target.id+'_ed"><img src="/images/basicAssets/custom_not_tag.svg" class="tagged"><p>'+tagtitle+'</p><img onclick="removeTagFilter(\''+e.target.id+'\')" src="/images/basicAssets/Close.svg"></div>';

// 		$('.tagg_list').append(design);

// 		if($(".tag_item").length > 0){
// 			$('.tagg_list').show();
// 		}

// 		getTaggedData(taggedCheckedID);

// 	}else{

// 		$("#"+e.target.id+"_ed").remove();
// 		var tagid = $("#"+e.target.id).attr('data-tagid');

// 		$("#conversation_list_sidebar li").hide();
// 		$("#pintul li").hide();
// 		$("#conversation_list_sidebar li").hide();

// 		removeA(taggedCheckedID,tagid);


// 		for(var i=0 ; i<taggedCheckedRoom.length; i++){
// 		    if(taggedCheckedRoom[i].tagid == tagid)
// 		        taggedCheckedRoom.splice(i);
// 		}

// 		getTaggedData(taggedCheckedID);

// 		if($(".checkToDo:checked").length == 0){

// 			taggedCheckedRoom = [];
// 			taggedRoomID = [];
// 			taggedCheckedID = [];

// 			if(currentConv_list.length > 0){
// 				$("#conversation_list_sidebar li").hide();
// 				$("#pintul li").hide();
// 				$("#conversation_list_sidebar li").hide();

// 				$.each(currentConv_list,function(k,v){
// 					$("#conv"+v).show();
// 				});

// 				$.each($('.msgs-form-users'), function() {
// 					$(this).prev('.msg-separetor').show();
// 					$(this).show();
// 				});

// 				$('.user-msg>p').unhighlight();
// 				$('.user-msg>p').highlight(searchTagList[searchTagList.length-1].replace("_"," "));

// 				$.each($('.msgs-form-users'), function() {
// 					if ($(this).find('.highlight').length == 0) {
// 						$(this).prev('.msg-separetor').hide();
// 						$(this).hide();
// 					} else {
// 						$(this).prev('.msg-separetor').show();
// 						$(this).show();
// 					}
// 				});

// 				$("#searchText").val(searchTagList[searchTagList.length-1].replace("_"," "));
// 				$('#sideBarSearch').val("");
// 				$('#sideBarSearch').hide();
// 				$(".side-bar-search-icon").show();
// 			}else{
// 				$("#conversation_list_sidebar li").show();
// 				$("#pintul li").show();
// 				$("#conversation_list_sidebar li").show();
// 			}
// 		}
// 	}
// });

$(document).ready(function() {
    $('.side_bar_list_item li').each(function(k, v) {
        if ($(v).attr('data-conversationid') != user_id) {
            if (currentConv_list.indexOf($(v).attr('data-conversationid')) === -1) {
                currentConv_list.push($(v).attr('data-conversationid'));
            }
        }
    });
});

var searchTopic = (value) => {
    $("#topicItem .added-tag-list").each(function() {

        if ($(this).find('label').text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#topicItem .added-tag-list").unhighlight();
    $("#topicItem .added-tag-list").highlight(value);
}

$("body").on("click", ".checkTopic", function(e) {
    var conversationid = $("#" + e.target.id).attr('data-tagid');
    var conversation_title = $("#" + e.target.id).attr('data-tagtitle');

    if ($('#filterUnread_msg').hasClass('activeComFilter')) {
        $('#filterUnread_msg').removeClass('activeComFilter');
        backToChat();
    }

    if (e.target.checked) {
        addtoList('undefined', user_id, 'public', 'Navigate', conversationid, user_id, conversation_title);
        $("#topicLi_" + conversationid).remove();
        var design = '<li  class="added-tag-list" id="topicLi_' + conversationid + '">';
        design += '	<label for="tag_' + conversationid + '"> ' + conversation_title + '';
        design += '	<input id="tag_' + conversationid + '" data-tagid="' + conversationid + '" data-tagtitle="' + conversation_title + '" class="checkmember checkTopic" type ="checkbox" checked>';
        design += '	<span class="checkmark"></span>';
        design += '	</label>';
        design += '</li>';
        $("#topicItem").prepend(design);
    } else {
        removeThisList(conversationid);
        $("#topicLi_" + conversationid).remove();
        var design = '<li  class="added-tag-list" id="topicLi_' + conversationid + '">';
        design += '	<label for="tag_' + conversationid + '"> ' + conversation_title + '';
        design += '	<input id="tag_' + conversationid + '" data-tagid="' + conversationid + '" data-tagtitle="' + conversation_title + '" class="checkmember checkTopic" type ="checkbox">';
        design += '	<span class="checkmark"></span>';
        design += '	</label>';
        design += '</li>';
        $("#topicItem").append(design);
    }
});

/*
Tag item filter on side tag icon
*/
// $( "body" ).on( "click", ".checkToDo", function() {
$(".checkToDo").click(function(e) {
    $('#errMsg').hide();
    var checkedTitle = [];
    var checked = 0;
    $('.chooseTag .checkToDo').each(function(i, row) {
        if ($(row).is(':checked')) {
            if (checkedTitle.indexOf($(row).attr('data-tagtitle')) === -1) {
                checkedTitle.push($(row).attr('data-tagtitle'));
                if (taggedCheckedID.indexOf($(row).attr('data-tagid')) === -1) {
                    taggedCheckedID.push($(row).attr('data-tagid'));
                }
                checked++;
            }
        }
    });

    if ($('#filterUnread_msg').hasClass('activeComFilter')) {
        $('#filterUnread_msg').removeClass('activeComFilter');
        backToChat();
    }

    var tagtitle = $("#" + e.target.id).attr('data-tagtitle');
    var tagid = $("#" + e.target.id).attr('data-tagid');

    socket.emit('taggedFilterData', {
        taggedby: user_id,
        tagarr: checkedTitle
    }, (callBack) => {
        if (callBack.status) {
            if (checked > 0) {
                if (e.target.checked) {
                    var design = '<div class="tag_item" id="' + e.target.id + '_ed"><img src="/images/basicAssets/custom_not_tag.svg" class="tagged"><p>' + tagtitle + '</p><img onclick="removeTagFilter(\'' + e.target.id + '\')" src="/images/basicAssets/Close.svg"></div>';
                    $('.tagg_list').append(design);
                    if ($(".tag_item").length > 0) {
                        $('.tagg_list').show();
                    }
                } else {
                    $("#" + e.target.id + "_ed").remove();
                    if ($(".tag_item").length == 0) {
                        $('.tagg_list').hide();
                    }
                }

                if (callBack.data.length > 0) {
                    if (currentConv_list.length > 0) {
                        $("#conversation_list_sidebar li").hide();
                        $("#pintul li").hide();
                        $("#conversation_list_sidebar li").hide();

                        $.each(currentConv_list, function(k, v) {
                            if (callBack.data.indexOf(v) > -1) {
                                $("#conv" + v).show();
                            }
                        });
                    }
                } else {

                    $("#conversation_list_sidebar li").hide();
                    $("#pintul li").hide();
                    $("#conversation_list_sidebar li").hide();
                    // toastr["warning"]("No tagged found", "Warning");

                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('No tagged found.');

                    $('#errMsg').html('');
                    $('#errMsg').text('No tagged message found');
                    $('#errMsg').show();
                }

            } else {
                $("#" + e.target.id + "_ed").remove();
                if ($(".tag_item").length == 0) {
                    $('.tagg_list').hide();
                }

                if (currentConv_list.length > 0) {
                    $("#conversation_list_sidebar li").hide();
                    $("#pintul li").show();
                    $("#conversation_list_sidebar li").hide();

                    $.each(currentConv_list, function(k, v) {
                        $("#conv" + v).show();
                    });
                }
            }
        }
    });

    // if(e.target.checked){

    // 	var tagtitle = $("#"+e.target.id).attr('data-tagtitle');
    // 	var tagid = $("#"+e.target.id).attr('data-tagid');

    // 	socket.emit('taggedData', {
    // 		tagid: tagid
    // 	}, (callBack) => {
    // 		console.log(callBack);
    // 		if(callBack.status){
    // 			var len = callBack.tagDet;
    // 			if(len.length > 0){

    // 				var checked = 1;

    // 				$('.chooseTag .checkToDo').each(function (i, row) {
    // 					if($(row).is(':checked')){
    // 						if(taggedCheckedID.indexOf($(row).attr('data-tagid')) === -1){
    // 							taggedCheckedID.push($(row).attr('data-tagid'));
    // 						}
    // 						checked++;
    // 					}
    // 				});



    // 				$("#conversation_list_sidebar li").hide();
    // 				$("#pintul li").hide();
    // 				$("#conversation_list_sidebar li").hide();

    // 				var design 	= '<div class="tag_item" id="'+e.target.id+'_ed"><img src="/images/basicAssets/custom_not_tag.svg" class="tagged"><p>'+tagtitle+'</p><img onclick="removeTagFilter(\''+e.target.id+'\')" src="/images/basicAssets/Close.svg"></div>';

    // 				$('.tagg_list').append(design);
    // 				if($(".tag_item").length > 0){
    // 					$('.tagg_list').show();
    // 				}

    // 				$.each(callBack.tagDet, function(tdk,tdv){
    // 					taggedRoomID.push({'tagid':tagid,'roomid':tdv.conversation_id});
    // 				});

    // 				$.each(taggedRoomID, function(tdk,tdv){
    // 					$("#conv"+tdv.roomid).show();
    // 				});

    // 			}else{
    // 				toastr["warning"]("No tagged found", "Warning");
    // 			}
    // 		}

    // 	});
    // }else{

    // 	$("#"+e.target.id+"_ed").remove();
    // 	var tagid = $("#"+e.target.id).attr('data-tagid');

    // 	$("#conversation_list_sidebar li").hide();
    // 	$("#pintul li").hide();
    // 	$("#conversation_list_sidebar li").hide();

    // 	removeA(taggedCheckedID,tagid);


    // 	for(var i=0 ; i<taggedCheckedRoom.length; i++){
    // 	    if(taggedCheckedRoom[i].tagid == tagid)
    // 	        taggedCheckedRoom.splice(i);
    // 	}

    // 	getTaggedData(taggedCheckedID);

    // 	if($(".checkToDo:checked").length == 0){

    // 		taggedCheckedRoom = [];
    // 		taggedRoomID = [];
    // 		taggedCheckedID = [];

    // 		if(currentConv_list.length > 0){
    // 			$("#conversation_list_sidebar li").hide();
    // 			$("#pintul li").hide();
    // 			$("#conversation_list_sidebar li").hide();

    // 			$.each(currentConv_list,function(k,v){
    // 				$("#conv"+v).show();
    // 			});

    // 			$.each($('.msgs-form-users'), function() {
    // 				$(this).prev('.msg-separetor').show();
    // 				$(this).show();
    // 			});

    // 			$('.user-msg>p').unhighlight();
    // 			$('.user-msg>p').highlight(searchTagList[searchTagList.length-1].replace("_"," "));

    // 			$.each($('.msgs-form-users'), function() {
    // 				if ($(this).find('.highlight').length == 0) {
    // 					$(this).prev('.msg-separetor').hide();
    // 					$(this).hide();
    // 				} else {
    // 					$(this).prev('.msg-separetor').show();
    // 					$(this).show();
    // 				}
    // 			});

    // 			$("#searchText").val(searchTagList[searchTagList.length-1].replace("_"," "));
    // 			$('#sideBarSearch').val("");
    // 			$('#sideBarSearch').hide();
    // 			$(".side-bar-search-icon").show();
    // 		}else{
    // 			$("#conversation_list_sidebar li").show();
    // 			$("#pintul li").show();
    // 			$("#conversation_list_sidebar li").show();
    // 		}
    // 	}
    // }
});

var removeTagFilter = (id) => {

    $("#" + id + "_ed").remove();
    $("#" + id).prop('checked', false);

    var splitID = id.split("_");

    $("#conversation_list_sidebar li").hide();
    $("#pintul li").hide();
    $("#conversation_list_sidebar li").hide();

    removeA(taggedCheckedID, splitID[1]);

    for (var i = 0; i < taggedCheckedRoom.length; i++) {
        if (taggedCheckedRoom[i].tagid == splitID[1])
            taggedCheckedRoom.splice(i);
    }

    getTaggedData(taggedCheckedID);

    if ($(".checkToDo:checked").length == 0) {

        taggedCheckedRoom = [];
        taggedRoomID = [];
        taggedCheckedID = [];

        if (currentConv_list.length > 0) {
            $("#conversation_list_sidebar li").hide();
            $("#pintul li").hide();
            $("#conversation_list_sidebar li").hide();

            $.each(currentConv_list, function(k, v) {
                $("#conv" + v).show();
            });

            $.each($('.msgs-form-users'), function() {
                $(this).prev('.msg-separetor').show();
                $(this).show();
            });

            $('.user-msg>p').unhighlight();
            $('.user-msg>p').highlight(searchTagList[searchTagList.length - 1].replace("_", " "));

            $.each($('.msgs-form-users'), function() {
                if ($(this).find('.highlight').length == 0) {
                    $(this).prev('.msg-separetor').hide();
                    $(this).hide();
                } else {
                    $(this).prev('.msg-separetor').show();
                    $(this).show();
                }
            });

            $("#searchText").val(searchTagList[searchTagList.length - 1].replace("_", " "));
            $('#sideBarSearch').val("");
            $('#sideBarSearch').hide();
            $(".side-bar-search-icon").show();
            $('.sidebarSearchremove').hide();
        } else {
            $("#conversation_list_sidebar li").show();
            $("#pintul li").show();
            $("#conversation_list_sidebar li").show();
        }
    }
}



var searchTag = (value) => {
    $("#taggedItem .added-channel-members").each(function() {

        if ($(this).find('label').text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#taggedItem .added-channel-members").unhighlight();
    $("#taggedItem .added-channel-members").highlight(value);
}

var createDirectmsg = () => {
    if (directMsgName != "" && directMsgUUID != "") {
        var uuID = directMsgUUID;
        $.ajax({
            type: 'POST',
            data: {
                targetUser: directMsgName,
                targetID: directMsgUUID,
                ecosystem: 'Navigate',
                company_id: company_id,
            },
            dataType: 'json',
            url: '/alpha2/personalConCreate',
            success: function(data) {
                var immg = directMsgImg.split("/");
                if ($('#conv' + data.conversation_id).is(':visible')) {
                    $('#conv' + data.conversation_id).click();
                } else {
                    var design = '<li data-privacy="private" data-myid="' + user_id + '" data-createdby="0"  data-octr="' + user_id + '"  onclick="start_conversation(event)" data-nor="0" data-id="' + uuID + '" data-subtitle="' + directMsgSubtitle + '" data-conversationtype="personal" data-conversationid="' + data.conversation_id + '" data-name="' + directMsgName + '" data-img="' + immg[3] + '" id="conv' + data.conversation_id + '">';
                    design += '<span class="online_' + uuID + ' ' + (onlineUserList.indexOf(uuID) === -1 ? "offline" : "online") + '"></span><span class="usersName">' + directMsgName + '</span>';
                    design += '<span class="subroomunread"></span><span class="unreadMsgCount"></span> <span class="remove" onclick="removeThisList(event)"></span>';
                    design += '</li>';
                    $("#conversation_list_sidebar").append(design);
                    $('#conv' + data.conversation_id).click();
                    var conv_Id = data.conversation_id;
                    addSidebarListUser(uuID, conv_Id);
                }
                closeAllPopUp();
                set_default();
            },
            error: function(err) {
                console.log(err);
            }
        });
    } else {
        // toastr["warning"]("Unable to start direct message", "Warning");

        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('Unable to start direct message');
    }

}

//remove from sidebar hide list user

var addSidebarListUser = (uuID, conv_Id) => {
    $.ajax({
        type: 'POST',
        data: {
            conversation_id: conv_Id,
            targetID: uuID,
            company_id: company_id
        },
        dataType: 'json',
        url: '/alpha2/removeHideUserinSidebar',
        success: function(data) {}
    });
}


var myconversation_list = [];
var searchTagList = [];
var currentConv_list = [];


/* Flag Filtaring  */
var setFlagConvArray = [];

function flagDataRetrive() {
    $('.side_bar_list_item li').each(function(k, v) {
        if ($(v).attr('data-conversationid') != user_id) {
            if (myconversation_list.indexOf($(v).attr('data-conversationid')) === -1) {
                myconversation_list.push($(v).attr('data-conversationid'));
            }
        }
    });

    removeA(myconversation_list, undefined);

    var seartTxt = $("#searchText").val();
    socket.emit('getAllDataForSearch', {
        conversation_list: (searchTagList.length > 0 ? currentConv_list : myconversation_list),
        target_text: seartTxt,
        target_filter: 'flag',
        user_id: user_id
    }, (callBack) => {
        // console.log(callBack);
        if (callBack.status) {
            $('.tagg_list').show();
            if (callBack.data.length > 0) {
                $("#conversation_list_sidebar li").hide();
                $("#pintul li").hide();
                $("#conversation_list_sidebar li").hide();
                $.each(callBack.data, function(k, v) {
                    $("#conv" + v).show();
                    if (setFlagConvArray.indexOf(v) === -1) {
                        setFlagConvArray.push(v);
                    }
                });

                // $.each($('.msgs-form-users'), function() {
                // 	$(this).prev('.msg-separetor').show();
                // 	$(this).show();
                // });

                // if(currentConv_list.length > 0){
                // 	$('.user-msg>p').unhighlight();
                // 	$('.user-msg>p').highlight(seartTxt);

                // 	$.each($('.msgs-form-users'), function() {
                // 		if ($(this).find('.highlight').length == 0) {
                // 			$(this).prev('.msg-separetor').hide();
                // 			$(this).hide();
                // 		} else {
                // 			$(this).prev('.msg-separetor').show();
                // 			$(this).show();
                // 		}

                // 		if ($(this).find('.flaggedMsg').length == 0) {
                // 			$(this).prev('.msg-separetor').hide();
                // 			$(this).hide();
                // 		}
                // 	});
                // }

                $("#searchAction").val(2);
                if ($('#conv' + $('#roomIdDiv').attr('data-roomid')).is(':visible')) {
                    $('#conv' + $('#roomIdDiv').attr('data-roomid')).removeClass('sideActive');
                    $('#conv' + $('#roomIdDiv').attr('data-roomid')).trigger('click');
                }
                if (!$("#c_flag_ed").is(':visible')) {
                    var design = '<div class="tag_item" id="c_flag_ed"><img src="/images/basicAssets/Flagged.svg" class="flagged"><p>Flagged</p><img onclick="removeFlagFilter(\'c_flag_ed\')" src="/images/basicAssets/Close.svg"></div>';

                    $('.tagg_list').append(design);
                }

                $('.tagg_list').show();
                // if($(".tag_item").length > 0){
                // }
            } else {
                var design = '<div class="tag_item" id="c_flag_ed"><img src="/images/basicAssets/Flagged.svg" class="flagged"><p>Flagged</p><img onclick="removeFlagFilter(\'c_flag_ed\')" src="/images/basicAssets/Close.svg"></div>';
                $('.tagg_list').append(design);
                $("#errMsg").text('No Result(s) Found');
                $("#errMsg").show();
            }

        }
    });
}
var show_flag_msg = () => {
    if (!$('.filterFlagged_msg').hasClass('activeComFilter')) {
        $('.filterFlagged_msg').addClass('activeComFilter');
        if (!$("#c_flag_ed").is(':visible')) {
            flagDataRetrive();
        } else {

            $("#errMsg").text('');
            $("#errMsg").hide();

            $("#searchAction").val(1);
            $("#c_flag_ed").remove();

            $('.chooseTopic').hide();
            $('.chooseTag').hide();

            var seartTxt = $("#searchText").val();

            if (currentConv_list.length > 0) {
                $("#conversation_list_sidebar li").hide();
                $("#pintul li").hide();
                $("#conversation_list_sidebar li").hide();

                $.each(currentConv_list, function(k, v) {
                    $("#conv" + v).show();
                });

                $.each($('.msgs-form-users'), function() {
                    $(this).prev('.msg-separetor').show();
                    $(this).show();
                });

                $('.user-msg>p').unhighlight();
                $('.user-msg>p').highlight(seartTxt);

                $.each($('.msgs-form-users'), function() {
                    if ($(this).find('.highlight').length == 0) {
                        $(this).prev('.msg-separetor').hide();
                        $(this).hide();
                    } else {
                        $(this).prev('.msg-separetor').show();
                        $(this).show();
                    }
                });

                $("#searchText").val(seartTxt);
                $('#sideBarSearch').val("");
                $('#sideBarSearch').hide();
                $(".side-bar-search-icon").show();
                $('.sidebarSearchremove').hide();
            } else {

                $("#conversation_list_sidebar li").show();
                $("#pintul li").show();
                $("#conversation_list_sidebar li").show();

                if ($(".tag_item").length == 0) {
                    $('.tagg_list').hide();
                }
            }
        }
        $('#groupChatContainer').addClass('filteron');
    } else {
        removeFlagFilter('c_flag_ed');
    }


};

var removeFlagFilter = (serID) => {


    if (serID == 'f_checklist') {
        $('#filterChecklist_msg').removeClass('activeComFilter');
        if ($('#filterOnly_pending_Checklist').hasClass('activeComFilter')) {
            $('#' + serID).hide();
        } else {
            $('#' + serID).remove();
            removeA(allFilteredItem, 'checklist');
        }
        // $('#filterOnly_pending_Checklist').removeClass('activeComFilter');
        $('#filterFlagged_checklist').removeClass('activeComFilter');

        removeA(allFilteredItem, 'flagged_checklist');
        // removeA(allFilteredItem,'pending_checklist');
        // $('#f_checklist_pending').remove();
        $('#f_checklist_flagged').remove();
    } else if (serID == 'f_checklist_pending') {
        $('#' + serID).remove();
        removeA(allFilteredItem, 'pending_checklist');
        if ($('#f_checklist').length == 1 && !$('#f_checklist').is(':visible')) {
            removeA(allFilteredItem, 'checklist');
            $('#f_checklist').remove();
        }
        $('#f_checklist_pending').remove();
        $('#filterOnly_pending_Checklist').removeClass('activeComFilter');
    } else if (serID == 'f_checklist_flagged') {
        $('#' + serID).remove();
        removeA(allFilteredItem, 'flagged_checklist');
        $('#f_checklist_flagged').remove();
        $('#filterFlagged_checklist').removeClass('activeComFilter');
    } else {
        $('#' + serID).remove();
        $('.filterFlagged_msg').removeClass('activeComFilter');
        removeA(allFilteredItem, 'flag');
    }
    if (allFilteredItem.length == 0) {
        $('#connectAsideContainer').find('.backToChat').hide();
    }


    filterConversationLastT();

    // $("#errMsg").text('');
    // $("#errMsg").hide();


    // setFlagConvArray = [];
    // $("#"+serID).remove();

    // $("#searchAction").val(1);

    // console.log(currentConv_list.length);

    // if($('#conv'+$('#roomIdDiv').attr('data-roomid')).is(':visible')){
    // 	$('#conv'+$('#roomIdDiv').attr('data-roomid')).removeClass('sideActive');
    // 	$('#conv'+$('#roomIdDiv').attr('data-roomid')).trigger('click');
    // }

    // if(currentConv_list.length > 0){
    // 	var seartTxt = $("#searchText").val();
    // 	if(seartTxt != 1){
    // 		socket.emit('getAllDataForSearch', {
    // 			conversation_list: myconversation_list,
    // 			target_text:seartTxt,
    // 			target_filter:'text',
    // 			user_id:user_id
    // 		}, (callBack) => {

    // 			if(callBack.status){

    // 				currentConv_list = [];
    // 				$.each(callBack.data,function(k,v){
    // 					$("#conv"+v).show();
    // 					currentConv_list.push(v);
    // 				});

    // 				$('.user-msg>p').unhighlight();
    // 				$('.user-msg>p').highlight(seartTxt);

    // 				var c_str = seartTxt.replace(/ /g,"_");

    // 				searchTagList = [];

    // 				if(searchTagList.indexOf(c_str) === -1){
    // 					searchTagList.push(c_str);
    // 				}

    // 				$.each($('.msgs-form-users'), function() {
    // 					if ($(this).find('.highlight').length == 0) {
    // 						$(this).prev('.msg-separetor').hide();
    // 						$(this).hide();
    // 					} else {
    // 						$(this).prev('.msg-separetor').show();
    // 						$(this).show();
    // 					}
    // 				});

    // 				$("#searchText").val(seartTxt);
    // 				$('#sideBarSearch').val("");
    // 				$('#sideBarSearch').hide();
    // 				$(".side-bar-search-icon").show();
    // 				$('.sidebarSearchremove').hide();
    // 			}
    // 		});
    // 	}else{
    // 		$("#conversation_list_sidebar li").hide();
    // 		$("#pintul li").show();
    // 		$("#conversation_list_sidebar li").hide();

    // 		$.each(currentConv_list,function(k,v){
    // 			$("#conv"+v).show();
    // 		});

    // 		$.each($('.msgs-form-users'), function() {
    // 			$(this).prev('.msg-separetor').show();
    // 			$(this).show();
    // 		});

    // 		$('.user-msg>p').unhighlight();


    // 		$.each($('.msgs-form-users'), function() {
    // 			if ($(this).find('.highlight').length == 0) {
    // 				$(this).prev('.msg-separetor').hide();
    // 				$(this).hide();
    // 			} else {
    // 				$(this).prev('.msg-separetor').show();
    // 				$(this).show();
    // 			}
    // 		});
    // 		if(searchTagList.length > 0){
    // 			$('.user-msg>p').highlight(searchTagList[searchTagList.length-1].replace("_"," "));
    // 			$("#searchText").val(searchTagList[searchTagList.length-1].replace("_"," "));
    // 		}

    // 		$('#sideBarSearch').val("");
    // 		$('#sideBarSearch').hide();
    // 		$(".side-bar-search-icon").show();
    // 		$('.sidebarSearchremove').hide();
    // 	}

    // }else{

    // 	var seartTxt = $("#searchText").val();

    // 	console.log(seartTxt);

    // 	if(seartTxt != 1){
    // 		socket.emit('getAllDataForSearch', {
    // 			conversation_list: myconversation_list,
    // 			target_text:seartTxt,
    // 			target_filter:'text',
    // 			user_id:user_id
    // 		}, (callBack) => {

    // 			if(callBack.status){
    // 				if(callBack.data.length > 0){

    // 					currentConv_list = [];
    // 					$.each(callBack.data,function(k,v){
    // 						$("#conv"+v).show();
    // 						currentConv_list.push(v);
    // 					});

    // 					$('.user-msg>p').unhighlight();
    // 					$('.user-msg>p').highlight(seartTxt);

    // 					var c_str = seartTxt.replace(/ /g,"_");

    // 					searchTagList = [];

    // 					if(searchTagList.indexOf(c_str) === -1){
    // 						searchTagList.push(c_str);
    // 					}

    // 					$.each($('.msgs-form-users'), function() {
    // 						if ($(this).find('.highlight').length == 0) {
    // 							$(this).prev('.msg-separetor').hide();
    // 							$(this).hide();
    // 						} else {
    // 							$(this).prev('.msg-separetor').show();
    // 							$(this).show();
    // 						}
    // 					});

    // 					$("#searchText").val(seartTxt);
    // 					$('#sideBarSearch').val("");
    // 					$('#sideBarSearch').hide();
    // 					$(".side-bar-search-icon").show();
    // 					$('.sidebarSearchremove').hide();
    // 				}else{

    // 					$("#conversation_list_sidebar li").hide();
    // 					$("#pintul li").hide();
    // 					$("#conversation_list_sidebar li").hide();

    // 					var c_str = seartTxt.replace(/ /g,"_");
    // 					searchTagList = [];
    // 					$('.search_tag').remove();

    // 					var design 	= '<div class="tag_item search_tag" id="'+c_str+'_ed"><img src="/images/basicAssets/Search.svg"><p>'+seartTxt+'</p><img onclick="removesearchFilter(\''+c_str+'\')" src="/images/basicAssets/Close.svg"></div>';
    // 					$('.tagg_list').append(design);

    // 					if($(".tag_item").length > 0){
    // 						$('.tagg_list').show();
    // 					}

    // 					searchTagList.push(c_str);
    // 					$("#searchText").val(seartTxt);
    // 					$("#errMsg").text('No Result(s) Found');
    // 					$("#errMsg").show();
    // 				}
    // 			}
    // 		});
    // 	}else{
    // 		$("#conversation_list_sidebar li").show();
    // 		$("#pintul li").show();
    // 		$("#conversation_list_sidebar li").show();

    // 		if($(".tag_item").length == 0){
    // 			$('.tagg_list').hide();
    // 		}

    // 		$.each($('.msgs-form-users'), function() {
    // 			$(this).prev('.msg-separetor').show();
    // 			$(this).show();
    // 		});
    // 	}


    // }
    // $('#filterFlagged_msg').removeClass('activeComFilter');
    // $('#groupChatContainer').removeClass('filteron');
}

var removesearchFilter = (serID) => {

    $("#errMsg").text('');
    $("#errMsg").hide();

    //$("#"+serID+"_ed").remove();
    $("#searchFilter_ed").remove();
    removeA(searchTagList, serID);


    if (searchTagList.length > 0) {
        var seartTxt = $("#searchText").val();
        socket.emit('getAllDataForSearch', {
            conversation_list: myconversation_list,
            target_text: seartTxt,
            target_filter: 'text',
            user_id: user_id
        }, (callBack) => {
            if (callBack.status) {

                $("#conversation_list_sidebar li").hide();
                $("#pintul li").hide();
                $("#conversation_list_sidebar li").hide();

                currentConv_list = [];
                $.each(callBack.data, function(k, v) {
                    $("#conv" + v).show();
                    currentConv_list.push(v);
                });

                $.each(callBack.data, function(k, v) {
                    $("#conv" + v).show();
                });

                $.each($('.msgs-form-users'), function() {
                    $(this).prev('.msg-separetor').show();
                    $(this).show();
                });


                $('.user-msg>p').unhighlight();
                $('.user-msg>p').highlight(searchTagList[searchTagList.length - 1].replace("_", " "));

                $.each($('.msgs-form-users'), function() {
                    if ($(this).find('.highlight').length == 0) {
                        $(this).prev('.msg-separetor').hide();
                        $(this).hide();
                    } else {
                        $(this).prev('.msg-separetor').show();
                        $(this).show();
                    }
                });

                $("#searchText").val(searchTagList[searchTagList.length - 1].replace("_", " "));
                $('#sideBarSearch').val("");
                $('#sideBarSearch').hide();
                $(".side-bar-search-icon").show();
                $('.sidebarSearchremove').hide();
            }
        });
    } else {



        currentConv_list = [];

        if (setFlagConvArray.length > 0) {

            $("#searchText").val(1);
            $('#sideBarSearch').hide();
            $("#sideBarSearch").val("");

            flagDataRetrive();

        } else {

            if ($("#c_flag_ed").is(':visible')) {

                $("#searchText").val(1);
                $('#sideBarSearch').hide();
                $("#sideBarSearch").val("");

                flagDataRetrive();
            } else {
                $("#conversation_list_sidebar li").show();
                $("#pintul li").show();
                $("#conversation_list_sidebar li").show();

                $("#searchText").val(1);
                $('#sideBarSearch').hide();
                $("#sideBarSearch").val("");

                $(".side-bar-search-icon").show();
                $('.sidebarSearchremove').hide();

                $('.user-msg>p').unhighlight();

                $.each($('.msgs-form-users'), function() {
                    $(this).prev('.msg-separetor').show();
                    $(this).show();
                });

                if ($(".tag_item").length == 0) {
                    $('.tagg_list').hide();
                }
            }
        }
    }
}

$('#taggedList li').mouseleave(function() {
    // console.log($(this).has( "span" ).length);
    if ($(this).has("span").length == 0) {

    }
    // $(this).find('span').removeClass('remove').addClass('tagcheck');
    $(this).removeAttr('onclick');
});

$('#taggedList li').mouseenter(function() {
    // console.log($(this).has( "span" ).length);
    if ($(this).has("span").length == 0) {
        $(this).find('span').removeClass('tagcheck').addClass('remove');
        $(this).find('span').attr('onclick', 'deleteTag(\'' + $(this).text().toLowerCase() + '\')');
    }
});

var removeUsertag = (event) => {

    var roomid = $('#roomIdDiv').attr('data-roomid');

    $('.side_bar_list_item li').each(function(k, v) {
        if ($(v).attr('data-conversationid') != user_id) {
            if (myconversation_list.indexOf($(v).attr('data-conversationid')) === -1) {
                myconversation_list.push($(v).attr('data-conversationid'));
            }
        }
    });

    socket.emit('getAllTagsforList', {
        myconversation_list: myconversation_list
    }, (callBack) => {

        if (callBack.status) {
            // console.log(callBack);
            var my_tagged_ids = callBack.data;
            $('#memberListBackWrap').show();
            $('#memberListBackWrap').html("");
            $('.tagslistFloting').html("");
            $("#roomIdDiv").attr('data-rfu', 'ready');

            var html = '<div class="adminContainer">';
            html += '	<div class="closeBackwrap" onclick="closeAllPopUp()"><img src="/images/basicAssets/close_button.svg"></div>';
            html += '	<div class="label">';
            html += '		<h1 class="label_Title">Tag(s) </h1>';
            html += '	</div>';
            html += '	<input type="text" class="searchMember" placeholder="Search by title" onkeyup="searchtags($(this).val());">';
            html += '	<span class="remove searchClear"></span>';
            html += '	<div class="suggest_Container overlayScrollbars" style="display: block;">';
            html += '		<ul class="suggested-list tagslistFloting">';
            $.each(my_tag_list, function(ky, va) {
                if (my_tagged_ids.indexOf(ky) !== -1) {
                    html += '		<li id="t_' + ky + '">';
                    html += '			<div class="list" id="member' + ky + '">';
                    html += '				<h1 class="memberName">' + va + '</h1>';
                    html += '				<span class="tagcheck"></span>';
                    html += '			</div>';
                    html += '		</li>';
                }
            });

            $.each(my_tag_list, function(ky, va) {
                if (my_tagged_ids.indexOf(ky) === -1) {
                    html += '		<li id="t_' + ky + '">';
                    html += '			<div class="list" id="member' + ky + '">';
                    html += '				<h1 class="memberName">' + va + '</h1>';
                    html += '				<span class="remove" onclick="removeTagsUnused(\'' + ky + '\',\'' + va + '\');"></span>';
                    html += '			</div>';
                    html += '		</li>';
                }
            });

            html += '		</ul>';
            html += '	</div>';
            html += '</div>';

            overlayScrollbars();
            $('#memberListBackWrap').append(html);
            searchClearInput();
        }
    });
}


function searchClearInput() {
    $('.remove.searchClear').on('click', function() {
        $('.searchMember').val('');
        $('.adminContainer li').addClass('showEl');
        $('.adminContainer li').show();
        $('.adminContainer li.showEl').removeClass('selected');
        $('.adminContainer li.showEl:first').addClass('selected');
        $('.add-team-member').val('');
        $('#s-l-def li').show();
        $('#s-l-def li').addClass('showEl');
        $('#s-l-def li.showEl').removeClass('selected');
        $('#s-l-def li.showEl:first').addClass('selected');
        $(this).hide();
    });
}
var removeTagsUnused = (id, title) => {

    socket.emit('deleteUnusedTag', {
        tagid: id,
        convid: conversation_id,
        tagTitle: title,
        type: 'connect'
    }, (callBack) => {
        // console.log(callBack);
        if (callBack.status) {
            $("#t_" + id).remove();
            var indx = '';

            $.each(tagLsitDetail, function(tdk, tdv) {
                if (id == tdv.tagid && title == tdv.tagTitle) {
                    indx = tdk;
                }
            });

            removeA(tagListForFileAttach, title);
            removeA(tagListTitle, title);
            removeA(alltags, title);
            removeA(my_tag_id, id);

            tagLsitDetail.splice(indx, 1);
            var newTaglist = {};
            $.each(my_tag_list, function(tdk, tdv) {
                if (id == tdk && title == tdv) {
                    //console.log(tdk);
                } else {
                    newTaglist[tdk] = tdv;
                }
            });
            my_tag_list = {};
            my_tag_list = newTaglist;

            $("#taggedList li").each(function() {
                if ($(this).text() == title) {
                    $(this).remove();
                }
            });

            if (tagListTitle.length > 0) {
                $("#tagItemList").text(tagListTitle.join(','));
                $("#taggedIMG").attr('src', '/images/basicAssets/custom_tagged.svg');
            } else {
                $("#createConvTag").val("");
                $("#taggedIMG").attr('src', '/images/basicAssets/custom_not_tag.svg');
            }

            $(".filesTag").each(function() {
                if ($(this).text() == title) {
                    $(this).remove();
                }
            });
        }
        var localData = {
            tagid: id,
            convid: conversation_id,
            tagTitle: title
        }
        update_local_conv_tag('removeTag', localData);
    });
}

var searchtags = (thisval) => {

    $(".tagslistFloting li .memberName").each(function() {

        if ($(this).text().toLowerCase().search(thisval.toLowerCase()) > -1) {
            $(this).closest('li').show();
        } else {
            $(this).closest('li').hide();
        }
    });

    $('.tagslistFloting li .memberName').unhighlight();
    $('.tagslistFloting li .memberName').highlight(thisval);
}

// for creating new todo from msg

function viewCreateTodoPopup() {
    $('#createToDoPopup').show();
}

/* Newly added by mahfuz. For the issue #15 */

var remove_this_user = (event, dataID, img_src, name) => {
    var design = '<li class="showEl">';
    design += '		<img src="' + img_src + '" class="profile">';
    design += '		<span class="name s-l-def-clas" data-uuid="' + dataID + '">' + name + '</span>';
    design += '		<span class="designation-name">, Navigate</span>';
    design += '</li>';
    var name = $(event.target).closest('.selected_member_name').text();
    var uuid = $(event.target).closest('.selected_member_name').attr('data-uuid');
    removeA(memberList, name);
    removeA(memberListUUID, uuid);
    $(event.target).closest('.selected_member_name').remove();
    $('#directMsgUserList').append(design);
    popupMouseEnter();
    draw_name();
    // // suggestedListLiClick();
    all_action_for_selected_member();

};
var check_and_submit_for_new_conv = () => {
    if (memberListUUID.length == 1) {
        directMsgUUID = memberListUUID[0];
        createDirectmsg();
    } else {
        CreateGroup_without_title();
    }
};

var CreateGroup_without_title = () => {
    memberListUUID.push(user_id);
    var total_member = memberListUUID.length;
    var teamname = user_fullname + ',' + memberList.toString();
    var selectecosystem = $("#conv_key").text().replace('@ ', '');
    var grpprivacy = 'public';
    if (teamname.length > 17) {
        var over_length = "over_length";
    }

    grpprivacy = 'private';

    socket.emit('groupCreateBrdcst', {
        createdby: user_id,
        createdby_name: user_fullname,
        memberList: memberList,
        memberListUUID: memberListUUID,
        adminList: memberList,
        adminListUUID: memberListUUID,
        is_room: '6',
        teamname: teamname,
        selectecosystem: selectecosystem,
        grpprivacy: grpprivacy,
        conv_img: 'feelix.jpg'
    }, function(confirmation) {
        $("#conversation_list_sidebar").prepend('<li data-privacy="' + grpprivacy + '" data-myid="' + user_id + '" data-createdby="0"  data-octr="' + user_id + '" onclick="start_conversation(event)" data-nor="0" data-subtitle="' + selectecosystem + '" data-id="' + user_id + '" data-conversationtype="group" data-tm= "' + memberListUUID.length + '" data-conversationid="' + confirmation.conversation_id + '" data-name="' + teamname + '" data-img="feelix.jpg"  id="conv' + confirmation.conversation_id + '" class="' + over_length + '"><span class="' + (grpprivacy === 'public' ? "hash" : "lock") + '"></span> <span class="usersName">' + teamname + '</span><span class=" unreadMsgCount"></span></li>');
        sidebarLiMouseEnter();
        closeRightSection();
        $('#conv' + confirmation.conversation_id).click();
        tooltipForOverLength();
        closeAllPopUp();
        $('#totalMember').html(total_member);
        forActiveCallIcon(onlineUserList, participants, conversation_type);
    });

};
/* End of new fn for issue #15 */



function countRoomPart(adminArra, participants) {
    $('#ml-membertype').hide();
    $('#ml-listHl').attr('admin-length', '1');
    if (adminArra.length > 0) {
        // $('#ml-admintype').text('Room Admin(s) ('+adminArra.length+')');
        $('#ml-listHA').attr('admin-length', adminArra.length);
        $('#ml-listHl').attr('admin-length', adminArra.length);
    }

    var member = 0;
    if (participants.length > 0) {
        $.each(participants, function(k, v) {
            if (jQuery.inArray(v, adminArra) === -1) {
                $('#ml-membertype').show();
                member = member + 1;
                // $('#ml-membertype').text('Member ('+(participants.length - 1 )+')');
                // $('#ml-membertype').text('Room Member(s) ('+member+')');
                $('#ml-membertype').attr('member-length', member);

            }
        });
    } else {
        $('#ml-membertype').hide();
    }
    if (adminArra.indexOf(user_id) == -1) {
        $('#ml-listHl').attr('data-action', 'false');
        $('#updatechannelContainer').attr('has-admin', 'false');
        // $('#call_copyurl_btn').css('width', '100%');
        // $('#call_reseturl_btn').css('width', '0%');

    } else {
        $('#ml-listHl').attr('data-action', 'true');
        $('#updatechannelContainer').attr('has-admin', 'true');
        // $('#call_copyurl_btn').css('width', '45%');
        // $('#call_reseturl_btn').css('width', '45%');
    }
}


function fiMFROnfocus(elm) {
    $('#updateRoomListMember').show();
    $('#viewlistUpdateroom').hide();
    $('#newRoomMemberList').show();
    $('.s-l-def-clas').unhighlight();
    $('.s-l-def-clas').highlight($(elm).val());
    $(".s-l-def-clas").parent('li').show();
    $('#updatenewMemberMini').html('');
    tempoRoomUpdateArray = [];
    $('#updateRoomListMember').html("");
    $('#updateRoomListMember2').html("");

    $.each(allUserdata[0].users, function(ky, va) {
        if (participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1 || participants_sub.indexOf(va.id) > -1) {
            if (va.id != user_id) {
                if (va.is_active !== 0 && va.is_delete == 0) {
                    $('#updateRoomListMember').append(returnRoomMListDe(va));
                    $('#updateRoomListMember2').append(returnRoomMListDe(va));
                }
            }
        }
    });

    $('#updatenewMemberMini input').focus();

}

function updateInviteMemberBox(ele) {
    $('#updateRoomListMember2').html('');
    $(".hayven_Modal_heading h1").text("Update Member(s)");
    $('#updateRoomListMember2').attr('data-type', "member");
    $.each(allUserdata[0].users, function(ky, va) {
        if (participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1 || participants_sub.indexOf(va.id) > -1) {
            if (va.id != user_id) {
                if (va.is_active !== 0 && va.is_delete == 0) {
                    if (team_user_list.indexOf(va.id) > -1) {
                        $('#updateRoomListMember2').append(returnRoomMListDe(va));
                    }
                }
            }
        }
    });

    $(ele).find('.invitedMem').focus();
    $('#updateMemberPopup').css('display', 'flex');
    $('#updateMemberPopup').find('.input_hayven input').focus().val('');
    $('#updateRoomListMember2 li').show();
    $('#updateRoomListMember2 .s-l-def-clas').unhighlight()
}

function updateGuestMemberBox(ele) {
    $('#updateRoomListMember2').html('');
    $('#updateRoomListMember2').attr('data-type', "guest");
    $("#updateMemberPopup .hayven_Modal_heading h1").html("Update Guest(s) <span class='addnewguest' onclick='open_add_new_guest_Pop()'>Add New</span>");
    $.each(allUserdata[0].users, function(ky, va) {
        if (participants.indexOf(va.id) == -1 || participants_guest.indexOf(va.id) > -1 || participants_sub.indexOf(va.id) > -1) {
            if (va.id != user_id) {
                if (va.is_active !== 0 && va.is_delete == 0) {

                    $('#updateRoomListMember2').append(returnGuestRoomMListDe(va));

                }
            }
        }
    });

    $(ele).find('.invitedMem').focus();
    $('#updateMemberPopup').css('display', 'flex');
    $('#updateMemberPopup').find('.input_hayven input').focus().val('');
    $('#updateRoomListMember2 li').show();
    $('#updateRoomListMember2 .s-l-def-clas').unhighlight()
}

function findMemberForRoom(e, elm) {
    var value = $(elm).val().trim();
    if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13 && e.keyCode !== 27) {
        $(".s-l-def-clas").each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('li').show();
                $(this).parent('li').addClass('showEl');
            } else {
                $(this).parent('li').hide();
                $(this).parent('li').removeClass('showEl');
            }
        });

        $('.s-l-def-clas').unhighlight();
        $('.s-l-def-clas').highlight(value);

        if (e.keyCode == 8) {
            if (value == '') {
                $(elm).parent('.input_email').find('.email_profile[user-type="member"]:last').find('.tempE.tempRemove').trigger('click');
                // $('.hayvenList li').show();
                // $('#updateRoomListMember').show();
                // $('#newRoomMemberList').show();
            }
        }

    } else if (event.keyCode == 27) {
        $(elm).blur();
    }
}

function fimfronblur(elm) {
    // $('#updateRoomListMember').hide();
    $(elm).val('');
}


function addroomMember(e, elm) {
    e.preventDefault();
    var mydata = {
        id: $(elm).attr('data-id'),
        fullname: $(elm).attr('data-name'),
        img: $(elm).attr('data-img')
    }

    $(elm).remove();
    var subtitle = $(elm).find('.designation-name').text();


    if ($("#roomIdDiv").attr('data-rfu') == 'ready') {
        var roomid = $("#roomIdDiv").attr('data-roomid');
        var roomTitle = $("#roomIdDiv").attr('data-title');
        var uuid = mydata.id;

        if (jQuery.inArray(uuid, participants) === -1) {
            $.ajax({
                type: 'POST',
                data: {
                    conversation_id: roomid,
                    targetID: uuid,
                    company_id: company_id
                },
                dataType: 'json',
                url: '/alpha2/groupMemberAdd',
                success: function(data) {
                    participants.push(uuid);

                    // $('#inviteMemberBox').prepend(returnRoomMinide(mydata,'tempo'));
                    var workSpaceName = $('#roomIdDiv').attr('data-keyspace');
                    var groupPrivacy = $('#roomIdDiv').attr('data-privecy');

                    group_member_li_draw(mydata.fullname, '' + file_server + 'profile-pic/Photos/' + mydata.img + '', uuid, 'ready', roomid, subtitle);


                    socket.emit('groupMemberAdd', {
                        room_id: roomid,
                        memberList: participants,
                        selectecosystem: workSpaceName,
                        teamname: roomTitle,
                        grpprivacy: groupPrivacy,
                        createdby: user_id,
                        createdby_name: user_fullname
                    });

                    countRoomPart(adminArra, participants);
                }
            });
        }

    } else {
        memberList.push(mydata.fullname);
        memberListUUID.push(mydata.id);
        $("#numbers").text(parseInt(memberList.length) + 1);
        $('#newlyAddmembers').prepend(returnRoomMinide(mydata, 'add'));
    }

}


function editRoomPermission(id, adminArra) {
    $('#updateRoomTitle').removeClass('active');
    $('#select-ecosystemUpdate').removeClass('active');
    $('#roomStatusUpdate').removeClass('active');
    $('#channelNameHead').removeClass('active');
    $('#memberAddBtn').hide();
    $('#upbusinessHolder').show();

    if (adminArra.indexOf(id) > -1) {
        $('#roomimgOptionDiv .uploadimg').show();



        $('#updateRoomTitle').addClass('active');
        $('#updateRoomTitle').removeAttr('disabled');
        $('#inviteMemberBox').show();
        $('.labelinputBox').show();
        $('#select-ecosystemUpdate').removeAttr('disabled');
        $('#grpPrivacyUpdate').removeAttr('disabled');
        $('#select-ecosystemUpdate').addClass('active');
        $('#roomStatusUpdate').addClass('active');
        $('#channelNameHead').addClass('active');
        $('#changePrivacy').show();

        $('#updatechannelContainer .radioItemInput').removeAttr('disabled');
        $('#update_b_unit').removeAttr('disabled');

        $('#upbusinessHolder').next('.workspace').css('margin-top', '22px');
        $('#viewlistUpdateroom').css('margin-top', '22px');
        $('#upbusinessHolder').css('pointer-events', 'auto');
        $('#updateWorkspaceTeam').css('pointer-events', 'auto');
        // $('#forAdminBtn').show();
        $('#forMemberBtn').hide();
        $('#updatechannelContainer').attr('has-admin', true);
        // $('#call_copyurl_btn').css('width', '45%');
        // $('#call_reseturl_btn').css('width', '45%');


    } else {
        $('#roomimgOptionDiv .uploadimg').hide();
        $('#roomimgOptionDiv .removeImg').hide();
        $('#updateRoomTitle').attr('disabled', 'true');
        $('#inviteMemberBox').hide();
        $('.labelinputBox').hide();
        $('#select-ecosystemUpdate').attr('disabled', 'true');
        $('#grpPrivacyUpdate').attr('disabled', 'true');
        $('#changePrivacy').hide();

        $('#updatechannelContainer .radioItemInput').attr('disabled', true);
        $('#update_b_unit').attr('disabled', true);
        $('#upbusinessHolder').next('.workspace').css('margin-top', '0px');
        $('#viewlistUpdateroom').css('margin-top', '0px');
        $('#upbusinessHolder').css('pointer-events', 'none');
        $('#updateWorkspaceTeam').css('pointer-events', 'none');
        $('#forAdminBtn').hide();
        $('#forMemberBtn').show();
        $('#updatechannelContainer').attr('has-admin', false);
        // $('#call_copyurl_btn').css('width', '100%');
        // $('#call_reseturl_btn').css('width', '0%');
    }
}

function addtagNew(elm) {
    if ($('#updatechannelContainer').is(':visible') || $('#updateroomTagPopup').is(':visible')) {
        var e = $.Event("keyup", { which: 13 });
        $(elm).prev('input').trigger(e);
        countTagforactivebtn($('#updateTagContainer .item').length)
    } else {
        var value = $(elm).prev('input').val();
        value = value.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
        value = value.replace(/\s/g, '');
        customTagAddlike($(elm).prev('input'), value);
    }
}
var temppReadyTag = [];
var temppcusTna = [];

function customTagAddlike(input, value) {
    if (value !== '') {

        if (alltags.indexOf(value) == -1 && temTNA.indexOf(value) == -1) {
            // temTNA.push(value);
            temppcusTna.push(value);
            $('#temmpTagContainer').prepend(retemt({ name: value }));
            input.val('');
            input.focus();

        } else {
            // alert(value+' already exist.');

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text(value + ' already exist.');

        }
    }
}

setInterval(function() {
    var nowTime = (new Date).getTime();

    ///for remove room member
    var temmpUndoarray = undoRemoveMArray;
    $.each(temmpUndoarray, function(k, v) {
        if (v !== '') {
            if (v.endTime < nowTime) {
                if (v.data.targetUser == 'member') {
                    removeusermember(v.data.targetUser, v.data.targetID, v.data.conversation_id, v.data.memberImgarray, v.data.memberImg, v.data.memberName, v.data.design, v.data.remain);
                } else {
                    removeuseradmin(v.data.targetUser, v.data.targetID, v.data.conversation_id, v.data.memberImgarray, v.data.memberImg, v.data.memberName, v.data.design, v.data.remain);
                }
                undoRemoveMArray[k] = '';
            }
        }
    });


    $.each($('[data-interval]'), function(k, v) {
        var thisval = parseInt($(v).attr('data-interval'))
        if (thisval !== 0) {

            $(v).attr('data-interval', thisval - 1).text((thisval - 1) + 's');
        } else {
            $(v).attr('data-interval', '0').text('0s');
            $(v).parents('.toast.toast-info').remove();
        }
    })


}, 1000);


function undoRemoveAction(elm) {

    var conversation_id = $(elm).attr('data-conv');
    var targetID = $(elm).attr('data-user');
    if ($(elm).hasClass('undoremove')) {
        var temmpUndoarray = undoRemoveMArray;
        $.each(temmpUndoarray, function(k, v) {
            if (v !== '') {

                if (v.conv_id == conversation_id && v.member_id == targetID) {

                    undoRemoveMArray[k] = '';
                }
            }

        });
        $('#member' + targetID).show();
    }
    $(elm).parents('.toast.toast-info').remove();

}

function countTagforactivebtn(num) {
    if (num == 0) {
        $('#updateroomTagPopup .sub_btn').removeClass('active');
    } else {
        $('#updateroomTagPopup .sub_btn').addClass('active');
    }
}

// function call_reset_url(type){
// 	socket.emit('reset_call_url', {
// 		conversation_id: conversation_id,
// 		company_id: company_id,
// 		user_id: user_id,
// 		type : type
// 	}, (callBack) => {
// 		if(callBack != null){
// 			if(type=='group'){
// 				$('#callerid_url').val(window.location.origin+"/call/"+callBack.conference_id);
// 			}else{
// 				$('#callerid_url_profile').text(window.location.origin+"/call/"+callBack.conference_id);
// 				$('#callerid_url_personal').val(window.location.origin+"/call/"+callBack.conference_id);
// 			}

// 		}
// 	});
// }

// var clipboard = new Clipboard('#call_copyurl_btn', {
// 	text: function () {
// 		escToClose = '#warningsPopup .closeModal' ;
// 		return document.querySelector('#callerid_url').value;
// 	}
// });
// var clipboardPersonal = new Clipboard('#call_copyurl_btn_personal', {
// 	text: function () {
// 		escToClose = '#warningsPopup .closeModal' ;
// 		return document.querySelector('#callerid_url_personal').value;
// 	}
// });

// clipboardPersonal.on('success', function (e) {
// 	$('#warningsPopup .popup_title').text('Alert !');
// 	$('#warningsPopup .warningMsg').text('URL copied to clipboard.');
// 	$('#warningsPopup').css('display', 'flex');
// 		// e.clearSelection();
// 	});
// clipboard.on('success', function (e) {
// 	$('#warningsPopup .popup_title').text('Alert !');
// 	$('#warningsPopup .warningMsg').text('URL copied to clipboard.');
// 	$('#warningsPopup').css('display', 'flex');
// 		// e.clearSelection();
// 	});





socket.on('saveBroadcastRoom', function(data) {
    if (conversation_id == data.conversation_id) {
        var oldName = $("#conv_title .converstaion_name").text();
        $("#conv_title .converstaion_name").text(data.newGroupname);
        $("#roomIdDiv").attr('data-title', data.newGroupname);
        $("#updateRoomTitle").val(data.newGroupname);
        $('#workFreeliToaster').attr('data-id', 'room_change');
        // showFreeliToaster(true,`Room name has been changed from "${oldName}" to "${data.newGroupname}".`);
    }
    $("#conv" + data.conversation_id + ' .usersName').text(data.newGroupname);
    $("#conv" + data.conversation_id).attr('data-name', data.newGroupname);
})



function pin_unpinfun(s, cid, uid) {

    var data = {
        status: s,
        conversation_id: cid,
        user_id: uid,
        company_id: company_id
    }
    socket.emit('pin_unpin_conversation', data, function(res) {
        // console.log(res);
    })

}

function editMyOwnLink(elm) {
    var msg_id = $(elm).attr("data-value");

    socket.emit('find_msg_to_link', msg_id, function(res) {
        $('#set_your_own_title').html('Set your own custom link title');
        $('#editCustomTitle').attr('data-type', 'link_title');
        $('#editCustomTitle').attr('data-origi', 'original_link');
        $('#editCustomTitle').attr('data-conv', res[0].conversation_id);
        urlTitleEditId = res[0].url_id;

        $('#editCustomTitle').css('display', 'flex');
        $('#editCustomTitle').attr('msgid', msg_id);
        $('#editCutomActionId').text('Link Title');
        $('#editCustomActionVal').attr('placeholder', 'Link Title')
        $('#editCustomActionVal').val((res[0].title == 'null' ? '' : res[0].title));
        $('#editCustomActionVal').focus();
        $('#titleResetActionBtn').hide();
        // if ('null' == res[0].title) {
        // 	$('#titleResetActionBtn').hide();
        // } else {
        // 	$('#titleResetActionBtn').show();
        // }
        $('#titleResetActionBtn').attr('data-original', res[0].title);
        $('#customTitleSavebtn').text("Save")
    })
}