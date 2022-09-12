// const socket = require("../../socket/socket");

/**
 * When message form submit
 **/
var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
var hasurlTemp = 1;
var foundUrlTemp = '';
var blockUrlPreview = true;
var mentionUsers = [];

$('#msg').on('keydown', function(event) {

    if (event.keyCode == 13) {
        // //debugger
        if ($('#mention_user_list').is(':visible')) {
            // console.log(16139,$('#mention_user_list').is(':visible'))
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#mention_user_list .mention_user.selected').click();
            return false;
        } else if (event.keyCode == 27) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#mention_user_list').hide();
            return false;
        }

    }

    arrowAndEnterFormen(event, 'mention_user_list', 'down');
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        mentionUsers = [];
        event.preventDefault();
        event.stopImmediatePropagation();
        if ($('#msg').find('.solid_mention').length > 0) {
            $.each($('#msg').find('.solid_mention'), function(k, v) {
                if (mentionUsers.indexOf($(v).attr('data-id')) == -1) {
                    mentionUsers.push($(v).attr('data-id'))
                }
            })
        }
        msg_form_submit();
        mention_div_action('hide');
        localStorage.removeItem('draft_msg');

        foundUrlTemp = '';
        hasurlTemp = 1;
        blockUrlPreview = false;
        if ($('#msgUrlPreview').is(':visible')) {
            closeModal('msgUrlPreview');

        }

        if ($('.send-msgs.issueActive').is(':visible')) {
            $('#createIssueBtn').trigger('click');
        }

    } else {
        blockUrlPreview = true;
    }

    // When typing start into message box
    if ($('#secretUserList').find('.secret_heading').length == 0) {
        if (typing === false) {
            typing = true;

            socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: conversation_id, reply: false, msg_id: false });
            timeout = setTimeout(timeoutFunction, 2000);
        }
    }

    msg_draft_auto_save();

});


$('#msg').on('keyup', function(event) {

    if ($('#mention_user_list').is(':visible')) {
        if (event.keyCode == 40 || event.keyCode == 38) {
            event.preventDefault();
            event.stopImmediatePropagation();
            arrowAndEnterFormen(event, 'mention_user_list', 'up');
            return false;
        } else if (event.keyCode == 27) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#mention_user_list').hide();
            return false;
        }
    }

    var code = event.keyCode || event.which;

    if (code !== 13) {
        if (isUrlValid($('#msg').text())) {
            if (hasurlTemp == 1) {
                var data = {
                        url: $('#msg').text(),
                        conversation_id: '',
                        msg_id: '',
                        base_url: baseUrl
                    }
                    //   socket.emit('socket_url_preview', data, (res) => {
                    //       if (res.status) {
                    //           if($('#msg').find('a').length > 0){
                    //               if(blockUrlPreview){

                //                   $('#msgUrlPreview').slideDown();

                //                   var img = '';
                //                   if (res.body.image) {
                //                       img = '<img src="' + res.body.image + '">';
                //                   } else {
                //                       img = '<img src="' + res.body.logo + '">';
                //                   }
                //                   if (res.body.publisher){
                //                       var publisher = '<p>' + res.body.publisher + '</p>';
                //                   }else{
                //                       var publisher = '<p>' + res.body.title + '</p>';
                //                   }
                //                   var desc = '<p>' + res.body.description + '</p>';
                //                   $('#msgUrlPreview .url_title').html('');
                //                   $('#msgUrlPreview .ulr_img').html('');
                //                   $('#msgUrlPreview .url_title').html('');
                //                   $('#msgUrlPreview .url_desc').html('');
                //                   $('#msgUrlPreview .url_title').append(publisher);
                //                   $('#msgUrlPreview .ulr_img').append(img);
                //                 //   $('#msgUrlPreview .url_title').append(res.body.msg_body);
                //                   $('#msgUrlPreview .url_title').append('<a href="'+res.body.url+'" target="_blank">'+res.body.url+'</a>');
                //                   $('#msgUrlPreview .url_desc').append(desc);
                //                   foundUrlTemp = res.body.url;
                //                   hasurlTemp = 2;
                //               }
                //           }
                //       }
                //   });
            }
        }

        //   console.log(foundUrlTemp, $('#msg').text() );
        //   console.log(foundUrlTemp.toLocaleLowerCase().search($('#msg').text().toLocaleLowerCase()));
        //   if ($('#msg').text().search(foundUrlTemp) == -1) {
        //       hasurlTemp = 1;
        //       if ($('#msgUrlPreview').is(':visible')) {
        //           closeModal('msgUrlPreview');
        //       }
        //   }
        if ($('#msg').text().length < 3) {
            hasurlTemp = 1;
            if ($('#msgUrlPreview').is(':visible')) {
                closeModal('msgUrlPreview');
            }

        }
    }
});

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

var msg_sending_process = (str, allLink = null) => {
    // console.log(555)
    var is_room = (conversation_type == 'group') ? true : false;
    $(".Chat_File_Upload").closest('form').trigger("reset");
    $("#FileComment").html("");
    $("#attach_chat_file_list").html("");
    selectedSp = [];
    if ($('#issue_req_users').attr('data-id') !== '') {
        selectedSp = $('#issue_req_users').attr('data-id').split(',');
    }
    var data = {
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
            selectedSp: selectedSp,
            has_timer: ((!$('#setMsgTimer').hasClass('activeTime')) ? null : $('#setMsgTimer').attr('value')),
            mention_user: mentionUsers,
            allLink: allLink
        }
        // console.log(4444, data.allLink);
        // console.log(allfiles);
    if (allfiles.length > 0) {
        $.each(allfiles, function(k, v) {
            v['conversation_id'] = conversation_id;
            v.location = v.location.replace('http://', 'https://').replace('%40', '@');
            v.location = v.location.replace(file_server, '');
            v.is_delete = 0;
            per_conv_all_files.push(v);
        });
        // console.log(185,per_conv_all_files);
        socket.emit('conv_files_added', per_conv_all_files);
    }
    $('#formantion_text').html(str);
    var allMention = $('#formantion_text').find('.mention_user_msg.solid_mention');
    if (allMention.length > 0) {
        $.each(allMention, function(k, v) {
            var uid = $(v).attr('data-id');
            if (uid == 'undefined') {
                $(v).replaceWith(' ~@Everyone   ');
            } else {

                $(v).replaceWith(' ~@' + findObjForUser(uid).originalname + '   ');
            }
        });
        console.log(217,data['text'])
        data['text'] = $('#formantion_text').html();
    }
    socket.emit('send_message', data);
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
    allfiles = [];

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
    allfiles = [];
    formDataTemp.length = 0;
    formDataTemp = [];
    var _draw_type = true;
    if ($('#groupChatContainer').hasClass('task_assignment')) {
        _draw_type = false;
    }

    console.log('message_sent Fun Data', data);
    var html = draw_msg(data.msg, _draw_type);
    if (checkdrawmsg(data.msg, adminArra, activeConvPrivacy)) {

        $('#msg-container').append(html);
    }
    viewchecklisttype = 'count';
    countAndGetchecklist();
    scrollToBottom('.chat-page .os-viewport');

    last_delivered_always_show();
    $('#msg').html('').focus();
    $('#setMsgTimer').removeClass('activeTime');
    // if($('.msg_id_' + data.msg.msg_id).find('.has_url a[data-preview="true"]').length > 0){
    //     if ($('.msg_id_' + data.msg.msg_id).find('.has_url a').length > 0) {
    //         var url = $('.msg_id_' + data.msg.msg_id).find('.has_url a').attr('href');
    //         socket.emit('msg_url2preview', {
    //             url: url, to: to,
    //             conversation_id: conversation_id,
    //             msgid: data.msg.msg_id,
    //             base_url: location.protocol + '//' + location.host,
    //             msg_type:$('.msg_id_'+data.msg.msg_id).attr('data-msg-type')
    //         }, (response) => {
    //             console.log(79, response);
    //             if(response.status){
    //                 setTimeout(function(){
    //                     var attchhtml = per_msg_url_attachment(
    //                         response.body.publisher,
    //                         response.body.title,
    //                         response.body.description,
    //                         response.body.image,
    //                         response.body.logo,url);
    //                     //$('.msg_id_' + data.msg.msg_id).find('.has_url a').text(response.body.title);
    //                     //$('.msg_id_' + data.msg.msg_id).find('.has_url').append(attchhtml);
    //                     //update_local_conv_msg_preview(response.conversation_id, response.msg_id, response.body);
    //                 }, 3000);
    //             }
    //         });
    //     }
    // }
    scrollToBottom('.chat-page .os-viewport');

    if (data.tagmsgid != undefined) {
        if (msgIdsFtag.indexOf(data.tagmsgid) === -1) {
            msgIdsFtag.push(data.tagmsgid);
        }
    }
    inviewfun();
};
// socket.on('url2preview', function(data) {
//     console.log(data);
//     if(data.status){
//         var attchhtml = per_msg_url_attachment(data.body.publisher, data.body.title, data.body.description, data.body.image, data.body.logo);
//         //$('.msg_id_' + data.msg_id).find('.has_url a').text(data.body.title);
//        // $('.msg_id_' + data.msg_id).find('.has_url').append(attchhtml);
//     }
// });
/**
 * timeoutFunction call after 2 second typing start
 **/
var timeoutFunction = () => {
    var rep = false;
    let convid = conversation_id;
    if ($('#threadReplyPopUp').is(':visible')) {
        // msgid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_msg_id');
        convid = $('#threadReplyPopUp').attr('thread_root');
        rep = true;
    }
    typing = false;
    socket.emit("client_typing", { display: false, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: convid, reply: rep });
};

/**
 * Receive typing event and
 * display indicator images hide and show
 **/
socket.on('server_typing_emit', function(data) {
    if (data.sender_id != user_id) {
        if ($('#threadReplyPopUp').is(':visible') && ($('#threadReplyPopUp').attr('thread_root') == data.conversation_id) && (data.reply === true)) {
            draw_rep_typing_indicator(data.display, data.img, data.name);
        } else if ((conversation_id == data.conversation_id) && (data.reply === false)) {
            draw_typing_indicator(data.display, data.img, data.name);
        }
    }
});

// Message topic add on message send

function topicAdd(msg_id, conversation_id, tag_title) {
    if (conversation_id) {
        var data = {
            conversation_id: conversation_id,
            message_id: msg_id,
            tag_title: tag_title,
            tagged_by: user_id
        }
        socket.emit('topicMessageTagSocket', data, (res) => {
            var filetag = '';
            $.each(tag_title, (k, v) => {
                filetag += '<span class="filesTag">' + v + '</span>';
            });

            $('#filesTag' + msg_id).append(filetag);
            $('#filesTagHolder' + msg_id).show();
        });
    }
}

/**
 * When a new message come,
 * Check user message container is opne or not.
 * if open, it show's the message in the container
 * else marked as a notification that new message arived
 **/
socket.on('newMessage', function(message, callback) {
    // debugger;
    // alert('sbc');
    console.log('newMessage 373', message);
    socket.emit('msg_ack', {
        user_id: user_id,
        session_id: session_id,
        message: message
    });
    findMyLinks(conversation_id)
        // if(message.filedata.length > 0){
        //     if(message.msg.conversation_id.toString() == user_id){
        //         if($('#hayvenFilePage').hasClass('active')){
        //             // allMediaMyFilesData
        //             $.each(message.filedata,function(k,v){
        //                 allMediaMyFilesData.push(v);
        //             });
        //             if($('#mediaPersonalDivHead').hasClass('active')){
        //                 $('#mediaPersonalDivHead').trigger('click');
        //             }
        //         }

    //     }
    // }

    // if Task/Assignment is active
    var _draw_type = true;
    if ($('#groupChatContainer').hasClass('task_assignment')) {
        _draw_type = false;
        // if ($('.msgs-form-users.editable_checklistMsg').is(':visible')) {
        //     conversation_id = $('.msgs-form-users.editable_checklistMsg').attr('conv-id');
        //     adminArra = get_conversation_obj(conversation_id).participants_admin;
        //     activeConvPrivacy = get_conversation_obj(conversation_id).privacy;
        //     console.log(111, conversation_id, adminArra, activeConvPrivacy)
        // }
        if (lastEditConv != "") {
            conversation_id = lastEditConv;
            adminArra = get_conversation_obj(conversation_id).participants_admin;
            activeConvPrivacy = get_conversation_obj(conversation_id).privacy;
        }
    }

    $.each(message.filedata, function(k, v) {
        per_conv_all_files.push(v);
    });
    if (checkguestMsg(message.msg)) {
        if (message.msg.secret_user != null && message.msg.secret_user != undefined) {
            if (message.msg.secret_user.length > 0) {
                if (message.msg.sender != user_id) {
                    if (message.msg.secret_user.indexOf(user_id) == -1) {
                        return false;
                    }
                }
            }
        }

        if (conversation_id != message.msg.conversation_id) {
            allUnreadMessages.push(message.msg)
            if ($('._subconvUnread' + message.msg.conversation_id).is(':visible')) {
                var count = $('._subconvUnread' + message.msg.conversation_id).find('.counter').attr('data-length');
                if (count == '') {
                    count = 0;
                } else {
                    count = Number(count) + 1;
                }
                $('._subconvUnread' + message.msg.conversation_id).find('.counter').attr('data-length', count).html(count);

            }

        }
        // if(message.msg.msg_body.indexOf('secret_user _scret_msg_') > -1){
        //     var secretuser = message.msg.msg_body.split('@:_S');
        //         secretuser = secretuser[1];
        //         if(user_id != secretuser && user_id != message.msg.sender){
        //             return false;
        //         }
        // }




        if ($('.msgs-form-users').last().length == 1) {
            var checkScroll = ($('.msgs-form-users').last()[0].offsetTop - $('.msgs-form-users').last()[0].scrollHeight) - $('.chat-page .os-viewport').innerHeight();
        } else {

            checkScroll = 0;
        }
        if (message["checklist"] != undefined) {

            message.msg['checklist'] = message.checklist;
        }
        // var key = has_conv_into_local(message.msg.conversation_id);
        // update_local_conv(key, message);

        /**
         * New message conversation id and global conversation id is same
         */
        //  console.log('MessageDrawOrNot', conversation_id)
        var MessageDrawOrNot = newMessageCheckfun(conversation_id, message.msg);

        if (conversation_id == message.msg.conversation_id && !MessageDrawOrNot) {
            var notihtml = 'You have new notification(s) in this channel. <span onclick="newMsgClickFun(event)" class="goNewMsgToast">Click here to go back to this channel.</span>'
            showFreeliToaster(true, notihtml);
        }

        //  console.log('MessageDrawOrNot', MessageDrawOrNot);

        if (MessageDrawOrNot) {
            if (!$('#conv' + conversation_id).is(':visible')) {
                $('#conv' + conversation_id).show();
            }
            /**
             * New message conversation id and global conversation id is same,
             * and new message sender id and global user id is same.
             * So this block is, sender block for print the last send msg.
             */

            if (user_id == message.msg.sender) {
                if (allFilteredItem.length == 0) {
                    if (message.old_msg_id != undefined) {
                        message.msg['old_msg_id'] = message.old_msg_id;
                    }
                    message_sent(message);
                }

                if ($('#msg_tag_container .item>.valtext').length > 0) {
                    topicAdd(message.msg.msg_id, message.msg.conversation_id, topicTagItem);
                }
                $('.msg-separetor-unread').hide();
                // for files tag. while file uploading
                if (message.msg.attch_audiofile == null) {
                    message.msg.attch_audiofile = [];
                }
                if (message.msg.attch_imgfile == null) {
                    message.msg.attch_imgfile = [];
                }
                if (message.msg.attch_otherfile == null) {
                    message.msg.attch_otherfile = [];
                }
                if (message.msg.attch_videofile == null) {
                    message.msg.attch_videofile = [];
                }
                if (message.msg.attch_audiofile.length > 0 || message.msg.attch_imgfile.length > 0 || message.msg.attch_otherfile.length > 0 || message.msg.attch_videofile.length > 0) {
                    if (tagListForFileAttach.length > 0) {
                        var hiddentag = [];
                        $.each($('.hiddenTag'), function(a, b) {
                            hiddentag.push($(b).text().trim().toLowerCase());
                        });

                        var vL = 0;
                        $.each(tagListForFileAttach, function(kt, vt) {
                            if (hiddentag.indexOf(vt.toLowerCase()) == -1) {
                                $("#filesTag" + message.msg.msg_id).append('<span class="filesTag">' + vt + '</span>');
                            } else {
                                vL = vL + 1;
                            }
                        });
                        if (vL > 0) {

                            $("#filesTag" + message.msg.msg_id).show();
                            $("#filesTagHolder" + message.msg.msg_id).show();
                        }
                    }
                }
                // update_msg_counter(message.msg, 0);
                socket.emit('seen_emit', { msgid: message.msg.msg_id, senderid: to, receiverid: user_id, conversation_id: conversation_id });
            }
            /**
             * New message conversation id and global conversation id is same,
             * but sender id and global user id are not same.
             * So this block is receiver block for print the last new msg.
             * and remove the typing indication, add has delivered
             */
            else {
                // if(! $('body').hasClass('chklst_incompleted')){
                if (!$('#callNotifications').hasClass('active')) {
                    $('.typing-indicator').html("");
                    message.msg.has_delivered = 1;
                    if ($('.msg-separetor-unread').is(':visible')) {
                        var counter = parseInt($('.msg-separetor-unread').attr('data-length')) + 1;
                        // $('.msg-separetor-unread:visible').find('p').html(''+counter+' new message');
                        $('.msg-separetor-unread:visible').find('p').html('New Message(s)');
                        $('.msg-separetor-unread:visible').attr('data-length', counter);

                    } else {
                        $('.msg-separetor-unread').remove();
                        // var ureadHtml = '<div class="msg-separetor-unread" data-length="1"><p>1 new message</p></div>';
                        var ureadHtml = '<div class="msg-separetor-unread" data-length="1"><p>New Message(s)</p></div>';
                        $("#msg-container").append(ureadHtml);
                    }

                    $('.msg-separetor-unread').show();
                    console.log(524, message);
                    if (checkdrawmsg(message.msg, adminArra, activeConvPrivacy)) {
                        if (message.old_msg_id != undefined) {
                            message.msg['old_msg_id'] = message.old_msg_id;
                        }
                        var html = draw_msg(message.msg, _draw_type);
                    }
                }

                viewchecklisttype = 'count';
                countAndGetchecklist();
                if (checkdrawmsg(message.msg, adminArra, activeConvPrivacy)) {
                    // var checkScrollornot = ($('.chat-page .os-viewport').prop("scrollHeight") - $('.chat-page .os-viewport').scrollTop());
                    if (checkScroll <= $('.chat-page .os-viewport').scrollTop()) {
                        $('#msg-container').append(html);
                        scrollToBottom('.chat-page .os-viewport', 0);
                        if (allFilteredItem.length == 0) {
                            //   $('#conv'+conversation_id).find('.unreadMsgCount').html('');
                        }

                        $('#msg').focus();
                    } else {
                        var unredMsg = (parseInt($('#unredScrollMsg').attr('data-value')) + 1)
                        $('#unredScrollMsg').attr('data-value', unredMsg);
                        // $("#conv" + message.msg.conversation_id).find('.unreadMsgCount').html($('#unredScrollMsg').attr('data-value'))
                        $('#msg-container').append(html);
                    }

                }

                // scrollToBottom('.chat-page .os-viewport',0);

                inviewfun();
                if (allFilteredItem.length == 0) {
                    socket.emit('seen_emit', { msgid: message.msg.msg_id, senderid: to, receiverid: user_id, conversation_id: conversation_id });
                }

                $('.msg-send-seen-delivered').hide();

                // }
                // else if($('body').hasClass('chklst_incompleted') && message.msg.msg_type == 'checklist'){
                //   console.log('2007');
                //     // $('#conv'+message.msg.conversation_id).trigger('click');
                // }
                if (!isTabActive) {
                    unreadinactiveCounter = (unreadinactiveCounter + 1);
                    unreadinactiveCounterTime();
                }
                update_msg_counter(message.msg, "set");
                if (getCookie("skip_msg_hidding") != conversation_id && $('body').hasClass('chklst_incompleted')) {
                    if (message.msg.msg_type == 'checklist' && checklist_has_pending_process(message.msg)) {
                        $(".msg_id_" + message.msg.msg_id).show();
                    } else {
                        $(".msg_id_" + message.msg.msg_id).hide();
                        $(".msg-separetor-unread").hide();
                    }
                }

            }
        }
        /**
         * In the receiver end, receiver receive a new message
         * but receiver not in the same thread. So print this msg
         * as a new msg notification. remove the old local.
         */
        else if ($("#conv" + message.msg.conversation_id).length == 1 && message.msg.sender !== user_id && deletedMessages.indexOf(message.msg.msg_id) == -1) {
            //   remove_conv_from_local(user_id+message.msg.conversation_id);
            if (message.status) {
                data_unreadAllMsg.push(message.msg);
            } else if (message.status == undefined) {
                data_allEditUnreadMsg.push(message.msg)
            }
            update_msg_counter(message.msg, "set");
            // Add delivered
            // console.log(message.msg);
            var adin = [];
            adin.push(message.msg);
            socket.emit('add_delivered_if_need', adin);

            // push notification
            if (myAllMuteConvid.indexOf(message.msg.conversation_id) == -1) {
                if (checkSpecialChars(message.msg.msg_body) == false) {
                    // console.log('push notification',message.msg)
                    if (message.msg.sender !== user_id && message.msg.msg_type !== 'call') {
                        Push.Permission.request();
                        Push.create(message.msg.sender_name, {
                            body: message.msg.msg_body,
                            icon: file_server + "profile-pic/Photos/" + message.msg.sender_img,
                            timeout: 10000,
                            onClick: function() {
                                //   document.getElementById("conv" + message.msg.conversation_id).click();
                            }
                        });
                    }
                }
                if (!isTabActive) {
                    unreadinactiveCounter = (unreadinactiveCounter + 1);
                    unreadinactiveCounterTime();
                }
            } else {
                $.each(myAllMuteConv, function(k, v) {
                    if (v.conversation_id == message.msg.conversation_id) {
                        if (v.mute_duration == 'ownMuteOption') {
                            var startTime = moment(new Date(v.mute_start_time)).format("llll")
                            var now = moment(new Date()).format("llll"); //todays date
                            var date2 = new Date(now);
                            var date1 = new Date(startTime);
                            var timeDiff = Math.ceil(date1.getTime() - date2.getTime());
                            if (timeDiff > 0) {
                                if (checkSpecialChars(message.msg.msg_body) == false) {
                                    // console.log('push notification',message.msg)
                                    if (message.msg.sender !== user_id && message.msg.msg_type !== 'call') {
                                        Push.Permission.request();
                                        Push.create(message.msg.sender_name, {
                                            body: message.msg.msg_body,
                                            icon: file_server + "profile-pic/Photos/" + message.msg.sender_img,
                                            timeout: 10000,
                                            onClick: function() {
                                                //document.getElementById("conv" + message.msg.conversation_id).click();
                                            }
                                        });
                                    }
                                }

                            }
                        }
                    }
                });
                if (!isTabActive) {
                    unreadinactiveCounter = (unreadinactiveCounter + 1);
                    unreadinactiveCounterTime();
                }
            }

        }
        /**
         * This is totally a new msg from a new user.
         * So need to print new conversation block in
         * left sidebar. and no need to update any local
         */
        else if ($("#conv" + message.msg.conversation_id).length == 0) {

            var data = {
                conv_id: message.msg.conversation_id,
                user_id: user_id
            }
            var subconvhide = message.msg.root_conv_id != null ? 'itssubconvhide' : '';
            socket.emit('check_Conv_Part', data, (res) => {
                var muteDesign = '';
                if (res != null) {
                    if (res.participants.indexOf(user_id) !== -1) {
                        if (myAllMuteConvid.indexOf(res.conversation_id) !== -1) {
                            $.each(myAllMuteConv, function(k, v) {
                                if (v.conversation_id == res.conversation_id) {
                                    muteDesign = '<span data-mute-id="' + v.mute_id + '" class="mute_bell" onclick="showMuteDropDown(event,\'' + v.mute_id + '\',\'' + res.conversation_id + '\')"></span>';
                                }
                            });
                        }
                        if (res.privacy == 'private') {
                            if (res.group == 'yes') {
                                if (res.title.indexOf(',') > -1) {

                                    if (res.title.length > 17) {
                                        var tooltip = 'data-balloon="' + res.title + '" data-balloon-pos="up" data-balloon-length="fit"';
                                    }
                                    var design = '<li ' + tooltip + ' data-privacy="private" data-myid="' + user_id + '" data-createdby="' + res.created_by + '"  data-octr="0"  onclick="start_conversation(event)" data-nor="0" data-id="' + message.msg.sender + '" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="' + message.msg.conversation_id + '" data-name="' + res.title + '" data-img="' + message.conversation_img + '" id="conv' + res.conversation_id + '" data-root_conv_id = "' + subconvhide + '" class= "' + subconvhide + '" data-nom="1" data-tm="' + res.participants.length + '">';
                                    design += '<span class="lock"></span><span class="usersName">' + res.title + '</span>';
                                    design += '<span class="subroomunread"></span>';
                                    design += '<span class="unreadMsgCount">1</span>';
                                    design += muteDesign;
                                    design += '</li>';

                                    if (!$('#conv' + res.conversation_id).is(':visible')) {
                                        $('#conversation_list_sidebar').prepend(design);
                                        playNotification(message.msg.conversation_id);

                                        if ($('.threadasideContainer').is(':visible')) {
                                            $('#conv' + res.conversation_id).hide();
                                        }
                                    }
                                } else {

                                    $("#conv" + message.msg.conversation_id).remove();
                                    if (res.title.length > 17) {
                                        var tooltip = 'data-balloon="' + res.title + '" data-balloon-pos="up" data-balloon-length="fit"';
                                    }
                                    var design = '<li ' + tooltip + ' data-privacy="private" data-myid="' + user_id + '" data-createdby="' + res.created_by + '"  data-octr="0"  onclick="start_conversation(event)" data-nor="0" data-id="' + message.msg.sender + '" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="' + message.msg.conversation_id + '" data-name="' + res.title + '" data-img="' + message.conversation_img + '" id="conv' + res.conversation_id + '" data-root_conv_id = "' + subconvhide + '" class= "' + subconvhide + '" data-nom="1" data-tm="' + res.participants.length + '">';
                                    design += '<span class="lock"></span><span class="usersName">' + res.title + '</span>';
                                    design += '<span class="subroomunread"></span> ';
                                    design += '<span class="unreadMsgCount">1</span> ';
                                    design += muteDesign;
                                    design += '</li>';
                                    if (!$('#conv' + message.msg.conversation_id).is(':visible')) {
                                        $('#conversation_list_sidebar').prepend(design);
                                        playNotification(message.msg.conversation_id);

                                        if ($('.threadasideContainer').is(':visible')) {
                                            $('#conv' + res.conversation_id).hide();
                                        }
                                    }

                                }
                            } else {
                                var alreadyAdd = false;
                                $.each(res.participants, function(k, v) {
                                    // if(res.title == 'Personal'){
                                    if (!alreadyAdd) {
                                        if (v !== user_id) {
                                            alreadyAdd = true;
                                            if (message.msg.sender_name.length > 17) {
                                                var tooltip = 'data-balloon="' + findObjForUser(v).fullname + '" data-balloon-pos="up" data-balloon-length="fit"';
                                            }
                                            var design = '<li ' + tooltip + ' data-privacy="private" data-myid="' + user_id + '" data-createdby="' + res.created_by + '"  data-octr="' + res.created_by + '"  onclick="start_conversation(event)" data-nor="0" data-id="' + v + '" data-subtitle="Navigate" data-conversationtype="personal" data-conversationid="' + message.msg.conversation_id + '" data-name="' + findObjForUser(v).fullname + '" data-img="' + findObjForUser(v).img + '" id="conv' + res.conversation_id + '" data-nom="1" data-tm="' + res.participants.length + '">';
                                            design += '<span class="online_' + v + ' ' + (onlineUserList.indexOf(v) === -1 ? "offline" : "online") + '"></span><span class="usersName">' + findObjForUser(v).fullname + '</span>';
                                            design += '<span class="subroomunread"></span> ';
                                            design += '<span class="unreadMsgCount">1</span> ';
                                            design += muteDesign;
                                            design += '</li>';
                                            if (!$('#conv' + res.conversation_id).is(':visible')) {
                                                $('#conversation_list_sidebar').prepend(design);
                                                playNotification(message.msg.conversation_id);
                                                if ($('.threadasideContainer').is(':visible')) {
                                                    $('#conv' + res.conversation_id).hide();
                                                }
                                            }
                                        }
                                    }
                                    // }
                                });


                            }

                        } else {
                            if (res.title.length > 17) {
                                var tooltip = 'data-balloon="' + res.title + '" data-balloon-pos="up" data-balloon-length="fit"';
                            }
                            var design = '<li ' + tooltip + ' data-privacy="public" data-myid="' + user_id + '" data-createdby="' + res.created_by + '"  data-octr="0"  onclick="start_conversation(event)" data-nor="0" data-id="' + user_id + '" data-subtitle="Navigate" data-conversationtype="group" data-conversationid="' + message.msg.conversation_id + '" data-name="' + res.title + '" data-img="' + res.conv_img + '" id="conv' + res.conversation_id + '" data-nom="1" data-tm="' + res.participants.length + '">';
                            design += '<span class="hash"></span><span class="usersName">' + res.title + '</span>';
                            design += '<span class="subroomunread"></span>';
                            design += '<span class="unreadMsgCount">1</span>';
                            design += muteDesign;
                            design += '</li>';

                            if (!$('#conv' + res.conversation_id).is(':visible')) {
                                $('#conversation_list_sidebar').prepend(design);
                                playNotification(message.msg.conversation_id);
                                if ($('.threadasideContainer').is(':visible')) {
                                    $('#conv' + res.conversation_id).hide();
                                }
                            }
                        }
                        if (!$('.scroll_unreadMsg').is(':visible')) {
                            display_show_hide_unread_bar(1);
                        } else {
                            count = parseInt($('.scroll_unreadMsg>h5>span').text()) + 1;
                            display_show_hide_unread_bar(count);

                        }

                        ///push notification
                        if (myAllMuteConvid.indexOf(message.msg.conversation_id) == -1) {
                            if (checkSpecialChars(message.msg.msg_body) == false) {
                                // console.log('push notification',message.msg)
                                if (message.msg.sender !== user_id && message.msg.msg_type !== 'call') {
                                    Push.Permission.request();
                                    Push.create(message.msg.sender_name, {
                                        body: message.msg.msg_body,
                                        icon: file_server + "profile-pic/Photos/" + message.msg.sender_img,
                                        timeout: 10000,
                                        onClick: function() {
                                            //document.getElementById("conv" + message.msg.conversation_id).click();
                                        }
                                    });
                                }
                            }

                        }
                    }
                }

            });
            if (!isTabActive) {
                unreadinactiveCounter = (unreadinactiveCounter + 1);
                unreadinactiveCounterTime();
            }
        }
        unread_msg_conv_intop();

        // new conv into top
        conv_into_top(message.msg.conversation_id);
        if (message.msg.root_conv_id != null) {
            conv_into_top(message.msg.root_conv_id);

        }
        // if($("#conv" + message.msg.conversation_id).closest("ul").attr("id") == "pintul"){
        //     var val = $("#conv" + message.msg.conversation_id)[0].outerHTML;
        //     $("#conv" + message.msg.conversation_id).remove();
        //     $('#pintul').prepend(val);

        //     val = $("#conv"+user_id)[0].outerHTML;
        //     $("#conv"+user_id).remove();
        //     $('#pintul').prepend(val);
        // }else if($("#conv" + message.msg.conversation_id).closest("ul").attr("id") == "conversation_list_sidebar"){
        //     var val = $("#conv" + message.msg.conversation_id)[0].outerHTML;
        //     $("#conv" + message.msg.conversation_id).remove();
        //     $('#conversation_list_sidebar').prepend(val);

        // }else if($("#conv" + message.msg.conversation_id).length > 0){
        //     var val = $("#conv" + message.msg.conversation_id)[0].outerHTML;
        //     $("#conv" + message.msg.conversation_id).remove();
        //     $('#conversation_list_sidebar').prepend(val);
        // }
        // }
        // });

        if ($('#roomIdDiv').attr('data-privecy') == 'protected') {
            if (message.msg.tag_list != null) {
                if (message.msg.tag_list.length > 0) {

                    socket.emit('getconvissuetag', { allmsgTagid: message.msg.tag_list }, function(issuedata) {
                        // console.log(1198,issuedata.data)
                        if (issuedata.data.length > 0) {
                            $.each(issuedata.data, function(k, v) {
                                $('.issuetagid' + v.tag_id).html(issueTagDesign2(v));
                                allconvissuetag.push(v);
                            });
                        }
                    });
                } else {
                    $('.requestHolder').show();
                }
            }
        }
    }
    changeAllCustomTitle();
});

function conv_into_top(id) {
    $("#conv" + id).removeClass("conv_hide");
    if ($("#conv" + id).closest("ul").attr("id") == "pintul") {
        var val = $("#conv" + id)[0].outerHTML;
        $("#conv" + id).remove();
        $('#pintul').prepend(val);

        val = $("#conv" + user_id)[0].outerHTML;
        $("#conv" + user_id).remove();
        $('#pintul').prepend(val);
    } else if ($("#conv" + id).closest("ul").attr("id") == "conversation_list_sidebar") {
        var val = $("#conv" + id)[0].outerHTML;
        $("#conv" + id).remove();
        $('#conversation_list_sidebar').prepend(val);

    } else if ($("#conv" + id).length > 0) {
        var val = $("#conv" + id)[0].outerHTML;
        $("#conv" + id).remove();
        $('#conversation_list_sidebar').prepend(val);
    }
}

function update_msg_counter(data, set) {
    // console.log(844,data, set);
    if (data.msg_type == 'checklist' && msg_checklist_counter.indexOf(data.msg_id) > -1) {
        return false;
    }
    if (data.msg_type == 'checklist' && msg_checklist_counter.indexOf(data.msg_id) == -1) {
        msg_checklist_counter.push(data.msg_id);
    }

    if (set == "set") {
        if (data.sender != user_id) {
            playNotification(data.conversation_id);
        }
        set = $("#conv" + data.conversation_id).find(".unreadMsgCount").html();
        set = Number(set) > 0 ? Number(set) + 1 : 1;
        if ($(".scroll_unreadMsg").is(":visible"))
            set = Number($(".scroll_unreadMsg>h5>span").text()) + 1;
        display_show_hide_unread_bar(set);
    } else {
        set = "";
    }
    $("#conv" + data.conversation_id).find(".unreadMsgCount").html(set);
    $("#conv" + data.conversation_id).attr("data-nom", set);
    $("#conv" + data.conversation_id).show();
    if (data.root_conv_id != null && data.sender != user_id && conversation_id != data.conversation_id) {
        $("#conv" + data.root_conv_id).find(".subroomunread").show();
    }
    has_any_pending_in_conv();
}

function scollPos() {
    var div = document.getElementById("groupChatContainerChatpage").scrollTop;
    document.getElementById("msg-container").innerHTML = div;
}

/**
 * When add new emoji reaction,
 **/
socket.on('emoji_on_emit', function(data) {
    var chklsky = has_conv_into_local(data.conversation_id);
    if (data.sender_id != user_id) {
        if (data.type == 'add') {
            append_reac_emoji(data.msgid, data.src, 1);
            local_conv_add_reac_into_replies(data.conversation_id, data.msgid, data.emoji_name, 1);
            // update_conv_local_by_convid(data.conversation_id);
        } else if (data.type == 'delete') {
            update_reac_emoji(data.msgid, data.src, -1);
            local_conv_add_reac_into_replies(data.conversation_id, data.msgid, data.emoji_name, -1);
            // update_conv_local_by_convid(data.conversation_id);
        } else if (data.type == 'update') {
            update_reac_emoji(data.msgid, data.oldsrc, -1);
            local_conv_add_reac_into_replies(data.conversation_id, data.msgid, data.emojiname, -1);
            append_reac_emoji(data.msgid, data.src, 1);
            local_conv_add_reac_into_replies(data.conversation_id, data.msgid, data.emojiname, 1);
        }
        setTimeout(function() {
            if (data.conversation_id == conversation_id) {
                // add_conv_into_local('html', $("#msg-container").html().toString(), user_id+conversation_id);
            } else {
                // remove_conv_from_local(user_id+conversation_id);
            }
        }, 500);
    }
});

socket.on('updateRoomPrivecy', function(data) {
    if ($("#conv" + data.conversation_id).is(':visible')) {
        if ($("#conv" + data.conversation_id).attr('data-conversationtype') == 'group') {

            let roomTitle = $("#conv" + data.conversation_id + " .usersName").text();
            if (data.grpprivacy == 'private') {
                $("#conv" + data.conversation_id).find('span:first-child').removeClass('hash').addClass('lock');

            }

            if (data.grpprivacy == 'public') {
                $("#conv" + data.conversation_id).find('span:first-child').removeClass('lock').addClass('hash');
            }

            // toastr["success"]("\"" + roomTitle + "\" room is " + data.grpprivacy + " now", "Success");
        }
    }
});

socket.on('groupCreate', function(params) {
    if (!$("#conv" + params.room_id).is(':visible')) {
        if (params.memberList.indexOf(user_id) > -1) {
            if (params.teamname.length > 17) {
                var over_length = "over_length";
            }
            if (params.teamname.indexOf(',') > -1) {
                $("#conversation_list_sidebar").append('<li data-privacy="' + params.grpprivacy + '" data-octr="' + params.createdbyid + '"  onclick="start_conversation(event)" data-nor="0" data-subtitle="' + params.selectecosystem + '" data-id="' + params.createdbyid + '" data-conversationtype="group" data-tm= "' + parseInt(params.memberList.length) + '" data-conversationid="' + params.room_id + '" data-root_conv_id="' + params.root_conv_id + '" data-name="' + params.teamname + '" data-img="feelix.jpg"  id="conv' + params.room_id + '" class="' + over_length + ' ' + (params.root_conv_id != null ? 'itssubconvhide' : '') + '"><span class="' + (params.grpprivacy === 'public' ? "hash" : "lock") + '"></span> <span class="usersName">' + params.teamname + '</span><span class=" unreadMsgCount"></span></li>');
            } else {
                $("#conversation_list_sidebar").prepend('<li data-privacy="' + params.grpprivacy + '" data-octr="' + params.createdbyid + '"  onclick="start_conversation(event)" data-nor="0" data-subtitle="' + params.selectecosystem + '" data-id="' + params.createdbyid + '" data-conversationtype="group" data-tm= "' + parseInt(params.memberList.length) + '" data-conversationid="' + params.room_id + '" data-root_conv_id="' + params.root_conv_id + '" data-name="' + params.teamname + '" data-img="feelix.jpg"  id="conv' + params.room_id + '" class="' + (params.root_conv_id != null ? 'itssubconvhide' : '') + ' ' + over_length + '"><span class="' + (params.grpprivacy === 'public' ? "hash" : "lock") + ' ' + (params.root_conv_id != null ? 'itssubconvhide' : '') + '"></span> <span class="usersName">' + params.teamname + '</span><span class=" unreadMsgCount"></span></li>');
            }
            if ($('#memberListBackWrap').is(':visible')) {
                closeAllPopUp();
            }
            if ($('#createChannelContainer').is(':visible')) {
                closeRightSection();
            }
            if ($('#joinChannelPanel').is(':visible')) {
                closeRightSection();
            }
            /**
             * New sub conversation added, but main room not found in left side
             * then get main room details and add it into left side
             */
            if (params.root_conv_id != null && $("#conv" + params.root_conv_id).length == 0) {
                socket.emit("get_conversation_detail", { conversation_id: params.root_conv_id }, (res) => {
                    if (res.status) {
                        var main_conv = res.conversationDetail[0];
                        $("#conversation_list_sidebar").prepend('<li data-privacy="' + main_conv.privacy + '" data-octr="' + main_conv.created_by + '"  onclick="start_conversation(event)" data-nor="0" data-subtitle="' + main_conv.group_keyspace + '" data-id="' + main_conv.created_by + '" data-conversationtype="group" data-tm= "' + parseInt(main_conv.participants.length) + '" data-conversationid="' + main_conv.conversation_id + '" data-name="' + main_conv.title + '" data-img="feelix.jpg"  id="conv' + main_conv.conversation_id + '" class="' + over_length + '"><span class="' + (main_conv.privacy === 'public' ? "hash" : "lock") + '"></span> <span class="usersName">' + main_conv.title + '</span><span class="subroomunread" style="display: inline;"></span><span class=" unreadMsgCount"></span></li>');
                    }
                });
            }
            sidebarLiMouseEnter();
            // socket.emit('join_into_room', {conversation_ids: [params.room_id]}, (jres)=>{
            //     console.log("New Group Join res: ", jres);
            // });
            // <span class="sub-text"> - ' + params.selectecosystem + '</span>

            // toastr["success"]("You are added to a new " + params.grpprivacy + " room \"" + params.teamname + "\" by \"" + params.createdby + "\"", "Success");
        }
    } else {
        if (params.memberList.indexOf(user_id) != -1) {
            // toastr["warning"]("You are removed from a " + params.grpprivacy + " room \"" + params.teamname + "\" by \"" + params.createdby + "\"", "warning");
            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text("You are removed from a " + params.grpprivacy + " room \"" + params.teamname + "\" by \"" + params.createdby + "\"");


            if ($("#conv" + params.room_id).hasClass('sideActive')) {
                $("#conv" + params.room_id).remove();
                $("#conv" + user_id).trigger('click');
            } else {
                $("#conv" + params.room_id).remove();
            }


            if ($('#memberListBackWrap').is(':visible')) {
                closeAllPopUp();
            }
            if ($('#createChannelContainer').is(':visible')) {
                closeRightSection();
            }
            if ($('#joinChannelPanel').is(':visible')) {
                closeRightSection();
            }
        } else {
            if ($("#conv" + params.room_id).hasClass('sideActive')) {
                participants = params.memberList;
                $('#totalMember').text(participants.length);
                forActiveCallIcon(onlineUserList, participants, conversation_type);
                $("#conv" + params.room_id).attr('data-tm', participants.length);
                if ($('#memberListBackWrap').is(':visible')) {
                    closeAllPopUp();
                }
                if ($('#createChannelContainer').is(':visible')) {
                    closeRightSection();
                }
                if ($('#joinChannelPanel').is(':visible')) {
                    closeRightSection();
                }
                //participants.push()
            }
        }
    }
});


socket.on('removefromGroup', function(params) {
    // console.log(1019, params);
    if (params.targetID == user_id) {
        // toastr["success"]("You are removed from a " + params.grpprivacy + " room \"" + params.teamname + "\" by \"" + params.createdby + "\"", "Success");
        if ($("#conv" + params.room_id).hasClass('sideActive')) {
            $("#conv" + params.room_id).remove();
            $("._subconvUnread" + params.room_id).remove();
            $("#conv" + user_id).trigger('click');
        } else {
            $("#conv" + params.room_id).remove();
            $("._subconvUnread" + params.room_id).remove();
        }
        if (params.root_conv === false) {
            $("#conv" + params.root_conv_id).remove();
        }
        if ($('#sub_conv_holder').find('.item').length == 0) {
            $('#sub_conv_holder').html('');
        }



        if ($('#memberListBackWrap').is(':visible')) {
            closeAllPopUp();
        }
        if ($('#createChannelContainer').is(':visible')) {
            closeRightSection();
        }
        if ($('#joinChannelPanel').is(':visible')) {
            closeRightSection();
        }
    }

    if (params.participants.indexOf(user_id) != -1) {
        if (params.room_id == conversation_id) {
            participants = params.participants;
            $('#totalMember').text(participants.length - participants_sub.length);
        }
    }
});

socket.on('colseBroadcast', function(params) {
    if (params.participants.indexOf(user_id) > -1) {
        // toastr["info"]("\"" + params.conversation_name + "\" room has been " + params.type+" by \"" + params.closed_by + "\"", "Hello  "+user_fullname+"!!!");
        if ($("#conv" + params.conversation_id).hasClass('sideActive')) {
            if (params.type == 'closed') {

                if (params.participants_admin.indexOf(user_id) > -1) {
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

                } else {
                    $('#clear_all').hide();
                    $('#selectMessage').hide();
                    $('#leaveThisRoom').hide();
                    $('#closeThisRoom').hide();
                    $('#callNotifications').hide();
                    $('#viewMuteNotification').hide();
                    $('#clear_all_deleted_msg').hide();
                    $('#reopenThisRoom').hide();
                    $('#reOpenThisRoomBtn').hide();
                    $('#hideThisRoom').show();
                }
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
                $('#closeRoomMsg').html('This room has been closed by ' + params.closed_by + ' on ' + params.last_update_time + '');
                $("#msg").attr('placeholder', 'This room has been closed by ' + params.closed_by + ' on ' + params.last_update_time + '');
                // This room has been closed by [" + params.closed_by + "] on ["+ params.last_update_time +"]"

                $(".send-msgs .send-emoji").hide();
                $(".send-msgs .send-attach-file").hide();
                $(".send-msgs .circle_up_arrow").hide();
                $(".send-msgs #msgCheckListBtn").hide();
                // $("#hideRoom_fromLeft").css('display','flex');
                $('body').addClass('room_closed');
                $("#msg").css({ 'opacity': '0.7', 'border': '1px solid var(--AIC)' });
            } else {

                if (params.participants_admin.indexOf(user_id) > -1) {
                    $('#leaveThisRoom').hide();
                    $('#closeThisRoom').show();
                    $('#hideThisRoom').show();
                    $('#reopenThisRoom').hide();
                    $('#reOpenThisRoomBtn').hide();

                } else {
                    $('#leaveThisRoom').hide();
                    $('#closeThisRoom').hide();
                    $('#reopenThisRoom').hide();
                    $('#reOpenThisRoomBtn').hide();
                    $('#hideThisRoom').show();

                    $('#clear_all').show();
                    $('#selectMessage').show();
                    $('#callNotifications').show();
                    $('#viewMuteNotification').show();
                    $('#clear_all_deleted_msg').show();

                }

                $(".chat-head-name").css('pointer-events', 'auto');
                $(".chat-head-more-menu").css('pointer-events', 'auto');
                $(".pin-unpin").css('pointer-events', 'auto');
                $(".tagged").css('pointer-events', 'auto');
                $(".media").css('pointer-events', 'auto');
                $("#msg").css('pointer-events', 'auto');
                $(".msgs-form-users").css('pointer-events', 'auto');
                $("#msg").attr('contenteditable', true);
                $("#msg").focus();
                $("#msg").text('');
                $('.moreMenuPopup').hide();
                $("#msg").attr('placeholder', 'Message ' + params.conversation_name + '');

                $(".send-msgs .send-emoji").show();
                $(".send-msgs .send-attach-file").show();
                $(".send-msgs .circle_up_arrow").show();
                $(".send-msgs #msgCheckListBtn").show();
                // $("#hideRoom_fromLeft").hide();
                $('body').removeClass('room_closed');
                $("#msg").css({ 'opacity': '1', 'border': '1px solid var(--PrimaryC)' });
            }

        }

        if (params.type == 'closed') {
            $("#conv" + params.conversation_id).find('.closeSta').show();
            $("#conv" + params.conversation_id).addClass('conv_closed');
        } else {
            $("#conv" + params.conversation_id).find('.closeSta').hide();
            $("#conv" + params.conversation_id).removeClass('conv_closed');
        }
    }

    if ($("#joinChannelPanel").is(':visible')) {

        if (params.type == 'closed') {
            $("#roomBtn" + params.conversation_id).removeAttr('onclick');
            $("#roomBtn" + params.conversation_id).text('Closed Room');
            $("#roomBtn" + params.conversation_id).css('color', 'red');
        } else {
            $("#roomBtn" + params.conversation_id).attr('onclick', 'joinRoom(\'' + params.participants.length + '\',\'' + params.created_by + '\',\'public\',\'' + params.group_keyspace + '\',\'' + params.conversation_id + '\',\'' + user_id + '\',\'' + params.conversation_name + '\')');
            $("#roomBtn" + params.conversation_id).text('Join Room');
            $("#roomBtn" + params.conversation_id).removeAttr('style');
        }
    }
});

/* Reply Messages */
$('#msg_rep').on('keydown', function(event) {

    if (event.keyCode == 13) {
        if ($('#replymention_user').is(':visible')) {
            // console.log(16139,$('#replymention_user').is(':visible'))
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#replymention_user .mention_user.selected').click();
            return false;
        }

    }

    // arrowAndEnterFormen(event,'replymention_user');
    var code = event.keyCode || event.which;
    if (code == 13 && !event.shiftKey) { //Enter keycode = 13
        event.preventDefault();
        rep_msg_send_fn();
        var containerHeight = $(".replies-container").height();
        $('.forScrollBar .os-viewport').animate({ scrollTop: containerHeight }, 1);
    }

    // When typing start into reply message box
    if (typing === false) {
        typing = true;
        var convid = $('#threadReplyPopUp').attr('thread_root');
        //   var convid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_con_id');
        //   var msgid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_msg_id');
        // console.log(1262, convid);
        socket.emit('client_typing', { display: true, room_id: to, sender_id: user_id, sender_name: user_fullname, sender_img: user_img, conversation_id: convid, reply: true });
        timeout = setTimeout(timeoutFunction, 2000);
    }
});

var rep_msg_send_fn = () => {
    var str = $('#msg_rep').html();
    var s = str.split('<br>');
    str = s.join(' <br> ')

    var d = str.split('<div>');
    str = d.join(' <div> ')

    var d2 = str.split('</div>');
    str = d2.join(' </div> ')



    str = str.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/ig, '$1');
    str = createTextLinks_(str);
    str = str.replace(/\n/gi, '<br>');

    var dt = $('#define_thread_text').text();

    var allLink = linkify(str).split('$_link_$');
    var filteredLink = [];
    $.each(allLink, function(k, v) {
        if (validURL(v.trim())) {
            if (v != '') {
                if (filteredLink.indexOf(v.trim()) == -1) {
                    filteredLink.push(v.trim());
                }
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
        if (dt != '') {
            str = '<p class="thread_chk_item">' + dt + '</p>' + str;
        }
        $('#define_thread_text').text('');
        var is_room = (conversation_type == 'group') ? true : false;
        $(".Chat_File_Upload").closest('form').trigger("reset");
        $("#FileComment").html("");
        $("#attach_chat_file_list").html("");

        if ($('.msg_id_' + thread_root_id).length > 0)
            var convid = actionConvID;
        else
            var convid = $('#threadReplyPopUp .main-thread-msgs').find('.thread-user-msg').attr('data-rep_con_id');

        // alert(thread_id);

        $('#formantion_text').html(str);
        var allMention = $('#formantion_text').find('.mention_user_msg.solid_mention');
        if (allMention.length > 0) {
            $.each(allMention, function(k, v) {
                var uid = $(v).attr('data-id');
                if (uid == 'undefined') {
                    $(v).replaceWith(' ~@Everyone   ');
                } else {

                    $(v).replaceWith(' ~@' + findObjForUser(uid).originalname + '   ');
                }
            });
            str = $('#formantion_text').html();
        }
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
            secret_user: threadReplySecrectuser,
            msg_status: threadReplyMsgStatus,
            allLink: filteredLink,
            user_id: user_id
        });

        // bellow 1st line use for make the conversation in top, when user send a reply
        conv_into_top(convid);

        // console.log(1090, allfiles);
        if (allfiles.length > 0) {
            $.each(allfiles, function(k, v) {
                v['conversation_id'] = convid;
                v.location = v.location.replace('http://', 'https://').replace('%40', '@');
                v.location = v.location.replace(file_server, '');
                v.is_delete = 0;
                per_conv_all_files.push(v);
            });
            // console.log(1096,per_conv_all_files);
            // socket.emit('update_files_data', {conversation_id: thread_id, update_conv: convid}, function(res){
            //     socket.emit('conv_files_added', per_conv_all_files);
            //     allfiles = [];
            //     // console.log(1100, res);
            // });
        }
        // var img = filedata[0].imgfile.length;
        // var audio = filedata[0].audiofile.length;
        // var other = filedata[0].otherfile.length ;
        // var video = filedata[0].videofile.length ;
        // if(img > 0 || audio > 0 || other > 0 || video > 0){
        //     var dataLgn = Number(img+audio+other+video);

        //     socket.emit('update_repAttch_count', { msg_id: thread_root_id, conversation_id: convid, has_rep_attachment: dataLgn }, function(data) {
        //         if (data.has_rep_attachment > 1) {
        //             $('.msg_id_'+thread_root_id+'').find('.count_rep_attch_').text(+data.has_rep_attachment+' attachment(s)');
        //         }else{
        //             $('.msg_id_'+thread_root_id+'').find('.count_rep_attch_').text(+data.has_rep_attachment+' attachment');
        //         }
        //     });

        // }

        socket.emit('update_thread_count', { msg_id: thread_root_id, conversation_id: convid, last_reply_name: user_fullname, thread_id: thread_id });
        local_conv_update_thread_count(convid, thread_root_id, 'You');
        draw_rep_count(thread_root_id, 'You', thread_id);
        // if(allfiles.length>0){
        //     $.each(allfiles, function(k, v){
        //         v['conversation_id'] = convid;
        //         per_conv_all_files.push(v);
        //     });
        //     socket.emit('update_files_data', {conversation_id: thread_id, update_conv: convid}, function(res){
        //         socket.emit('conv_files_added', per_conv_all_files);
        //         allfiles = [];
        //         console.log(929, res);
        //     });
        // }
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
        $("#msg_rep").html("");
        $("#msg_rep").focus();
    }
};

socket.on('newRepMessage', function(message) {
    

    var repNoti_id = 'repMsg';
    // console.log("newRepMessage 1231 ", message);
    $.each(message.filedata, function(k, v) {
        per_conv_all_files.push(v);
    });
    if (checkguestMsg(message.msg)) {
        if (message.msg.secret_user != null) {
            if (message.msg.secret_user.length > 0) {
                if (message.msg.sender != user_id) {
                    if (message.msg.secret_user.indexOf(user_id) == -1) {
                        return false;
                    }
                }

            }
        }

        // console.log(1267,message.root_conv_id);
        // console.log(945,thread_id,message.msg.conversation_id,conversation_id)
        // console.log(1265,thread_id,message.msg.conversation_id)
        var checkScroll = ($('.main-thread-msgs').last()[0].offsetTop - $('.main-thread-msgs').last()[0].scrollHeight) - $('#repChatContainer').innerHeight();

        if ($('#live-chat').is(':visible')) {
            if (message.res.status) {
                if ($('.thread-user-msg').attr('data-rep_con_id') == message.data.thread_root_id) {
                    // console.log(1240, message.res.msg)
                    draw_rep_task_msg(message.res.msg);
                    $('.msg-separetor-unread').hide();
                    if (!isTabActive) {
                        unreadinactiveCounter = (unreadinactiveCounter + 1);
                        unreadinactiveCounterTime();
                    }
                }
            }
        } else {
            // console.log(1126,message);
            // console.log(1265,thread_id,message.msg.conversation_id)
            if (message.status) {
                if (thread_id == message.msg.conversation_id) {
                    if (message.msg.sender != user_id) {
                        var screct_h = true;
                        if (message.msg.secret_user != null && message.msg.secret_user != undefined) {
                            if (message.msg.secret_user.length > 0) {
                                if (message.msg.secret_user.indexOf(user_id) == -1) {
                                    screct_h = false;
                                }
                            }
                        }
                        // console.log(1450,message.secret_user,user_id,screct_h);
                        if (screct_h) {

                            unread_replay_data.push({
                                rep_conv: message.msg.conversation_id,
                                msg_id: message.msg.msg_id,
                                root_conv_id: message.root_conv_id,
                                root_msg_id: message.root_msg_id,
                                is_seen: false
                            });
                        }
                        urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));

                        update_rep_counter(message.root_conv_id);
                        reply_msg_counter();
                        playNotification(message.root_conv_id);
                    } else {
                        /**
                         * When replay send, all old unread will be change the status read
                         */
                        if ($('#threadReplyPopUp').is(':visible')) {
                            if (message.msg.conversation_id == $('#threadReplyPopUp').attr('thread_root')) {
                                socket.emit('seen_emit', { msgid: message.msg.msg_id, senderid: message.msg.sender, receiverid: user_id, conversation_id: message.msg.conversation_id });
                                check_unread_replay_data(message.root_msg_id);
                                reply_msg_counter();
                            }
                        }
                    }

                    draw_rep_msg(message.msg, true);
                    findMyLinks(conversation_id);
                    if (user_id != message.msg.sender) {
                        if (checkScroll >= $('#repChatContainer').scrollTop()) {
                            var oldcounter = parseInt($('#unreadthreadMsgCounter').attr('data-counter'));
                            $('#unreadthreadMsgCounter').attr('data-counter', oldcounter + 1);
                            if (parseInt($('#unreadthreadMsgCounter').attr('data-counter')) > 1) {
                                $('#unreadthreadMsgCounter').html(' New Replies');
                            } else {
                                $('#unreadthreadMsgCounter').html(' New Reply');
                            }
                        } else {
                            scrollToBottom('#repChatContainer', 0);
                        }
                    } else {
                        scrollToBottom('#repChatContainer', 0);
                    }
                    if (!isTabActive) {
                        unreadinactiveCounter = (unreadinactiveCounter + 1);
                        unreadinactiveCounterTime();
                    }

                }
                if (thread_id != message.msg.conversation_id) {
                    if (user_id != message.msg.sender && deletedMessages.indexOf(message.root_msg_id) == -1) {
                        var screct_h = true;
                        if (message.msg.secret_user != null && message.msg.secret_user != undefined) {
                            if (message.msg.secret_user.length > 0) {
                                if (message.msg.secret_user.indexOf(user_id) == -1) {
                                    screct_h = false;
                                }
                            }
                        }
                        if (screct_h) {
                            unread_replay_data.push({
                                rep_conv: message.msg.conversation_id,
                                msg_id: message.msg.msg_id,
                                root_conv_id: message.root_conv_id,
                                root_msg_id: message.root_msg_id,
                                is_seen: false
                            });
                        }
                        urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
                        update_rep_counter(message.root_conv_id);
                        reply_msg_counter();
                        playNotification(message.root_conv_id);
                        // console.log('push notification',message.msg)
                        // if(message.msg.sender !== user_id){
                        //     if(thread_id != message.msg.conversation_id){
                        //         Push.Permission.request();
                        //         Push.create(message.msg.sender_name, {
                        //             body: message.msg.msg_body,
                        //             icon: file_server+ "profile-pic/Photos/"+message.msg.sender_img,
                        //             timeout: 10000,
                        //             onClick: function() {
                        //                 // document.getElementById("conv"+message.msg.conversation_id).click();
                        //             }
                        //         });
                        //     }
                        // }
                        if (!isTabActive) {
                            unreadinactiveCounter = (unreadinactiveCounter + 1);
                            unreadinactiveCounterTime();
                        }
                        checkunreadthread(message.root_msg_id);
                        // unread_thread_out_of_txt(message.root_msg_id);
                    }
                }
            }
        }
    }
});

function check_unread_replay_data(rmid) {
    // console.log(1438,rmid)
    var read_rep_counter = 0;
    $.each(unread_replay_data, function(k, v) {
        if (v.root_msg_id == rmid) {
            var nor = Number($('#conv' + v.root_conv_id).attr('data-nor'));
            $('#conv' + v.root_conv_id).attr('data-nor', (nor - 1 > 0) ? nor - 1 : "");
            $('#conv' + v.root_conv_id).find('.unreadMsgCount').text((nor - 1 > 0) ? nor - 1 : "");
            v.root_msg_id = 0;
            v.root_conv_id = 0;
            read_rep_counter++;
        }
    });
    if ((unread_replay_data.length - read_rep_counter) == 0) {
        $(".thread_active").hide();
        $(".thread_message").hide();
        read_rep_counter = 0;
    }
}

function update_rep_counter(id) {
    var nor = Number($('#conv' + id).attr('data-nor'));
    $('#conv' + id).attr('data-nor', Number(nor + 1));
    $('#conv' + id).addClass("has_unread_replay");
    $(".thread_active").show();
    // console.log(1577,'show')
    $(".thread_message").show();
}

socket.on('update_thread_counter', function(data) {
        draw_rep_count(data.msg_id, data.last_reply_name, data.thread_id);
        // local_conv_update_thread_count(data.conversation_id, data.msg_id, data.last_reply_name);
    })
    /* End Reply Messages */

socket.on('receive_emit', function(data) {
    update_msg_seen_status(data);
});

socket.on('update_msg_receive_seen', function(data) {
    $.each(data.msgid, function(k, v) {
        update_msg_seen_status(v);
    });
});

var data_unreadAllMsg = [];
var data_allEditUnreadMsg = [];
var allMediaFilesData_forFilter = [];
var allMediaLinksData_forFilter = [];
$(function() {
    getAllShortUrl();
    socket.emit('find_all_files', { conversation_id: user_id + '/allConv' }, function(res) {
        allMediaFilesData_forFilter = res.files;
        allMediaLinksData_forFilter = res.msg_links;
    });
    // update_conv_counter();
    var my_all_conv = [];
    var my_all_personal_conv = [];
    var my_all_group_conv = [];

    $.each($('[id^=conv]'), function(k, v) {
        if ($(v).is("li"))
            my_all_conv.push($(v).attr('data-conversationid'));
    });

    // socket.emit('join_into_room', {conversation_ids: my_all_conv}, (jres)=>{
    //     console.log("Join res: ", jres);
    // });
    $.each($('[id^=conv]'), function(k, v) {

        if ($(v).is("li") && $(v).attr("data-conversationtype") == 'personal')
            my_all_personal_conv.push($(v).attr('data-conversationid'));

        setCookie("myAllPerConvId", my_all_personal_conv);
    });

    $.each($('[id^=conv]'), function(k, v) {

        if ($(v).is("li") && $(v).attr("data-conversationtype") == 'group')
            my_all_group_conv.push($(v).attr('data-conversationid'));

        setCookie("myAllGrpConvId", my_all_group_conv);
    });


    // setTimeout(function(){ scrollToBottom('.chat-page .os-viewport') }, 3000);
    // setTimeout(function(){ scrollToBottom('.chat-page .os-viewport') }, 5000);
    // setTimeout(function(){ scrollToBottom('.chat-page .os-viewport') }, 10000);

    socket.emit('getAllmydeletemessage', user_id, function(res) {
        if (res.status) {
            deletedMessages = [];
            if (res.data.length > 0) {
                $.each(res.data, function(k, v) {
                    deletedMessages.push(v.delete_id);
                })
            }
        }
        //    socket.emit('all_unread_msg', {my_all_conv}, function(data){
        //         // console.log(1040,data);
        //         // last message sender conversation show in top
        //         // but it disabled now, because this work done by refresh or onload
        //         // lastmsgConvid = data.all_msg_desc;
        //         // $.each(lastmsgConvid, function (k, v) {
        //         //     if ($('#conversation_list_sidebar #conv' + v.convid).length > 0) {
        //         //         var val = $('#conversation_list_sidebar #conv' + v.convid)[0].outerHTML;
        //         //         if (val !== undefined) {
        //         //             lastmsg_convDesign = val;
        //         //         }
        //         //         $('#conversation_list_sidebar #conv' + v.convid).remove();
        //         //         $('#conversation_list_sidebar').prepend(val);
        //         //         $('.custom_loader').removeClass('custom_loader');
        //         //         $('.custom_loader_hide ').removeClass('custom_loader_hide');
        //         //     }
        //         // });
        //     // console.log(1070,data)
        //         lastmsgConvid = data.all_msg_desc;
        //         // this part comes from onload
        //             // $.each(lastmsgConvid, function (k, v) {
        //             //     if ($('#conversation_list_sidebar #conv' + v.convid).length > 0) {
        //             //         var val = $('#conversation_list_sidebar #conv' + v.convid)[0].outerHTML;
        //             //         if (val !== undefined) {
        //             //             lastmsg_convDesign = val;
        //             //         }
        //             //         $('#conversation_list_sidebar #conv' + v.convid).remove();
        //             //         $('#conversation_list_sidebar').prepend(val);
        //             //         $('.custom_loader').removeClass('custom_loader');
        //             //         $('.custom_loader_hide ').removeClass('custom_loader_hide');
        //             //     }
        //             //     else if($('#pintul #conv' + v.convid).length > 0){
        //             //         var val = $('#pintul #conv' + v.convid)[0].outerHTML;
        //             //         if(val != undefined){
        //             //             lastmsg_convDesign = val;
        //             //         }
        //             //         $('#pintul #conv' + v.convid).remove();
        //             //         $('#pintul').prepend(val);
        //             //     }
        //             // });
        //         var val = $("#conv"+user_id)[0].outerHTML;
        //         $("#conv"+user_id).remove();
        //         $('#pintul').prepend(val);
        //         //console.log(lastmsg_convDesign);
        //         // Unread messages
        //         var dataallunread = []
        //         $.each(data.all_unread, function(k,v){
        //             if(deletedMessages.indexOf(v.msg_id)){
        //                 if (checkguestMsg(v)) {
        //                     dataallunread.push(v);
        //                     var id = v.conversation_id.toString();
        //                     var c = Number($("#conv"+id).find(".unreadMsgCount").text());
        //                     $("#conv"+id).find(".unreadMsgCount").html(c+1);
        //                     $("#conv"+id).attr("data-nom", c+1);
        //                 }
        //             }
        //         });
        //         data_unreadAllMsg = dataallunread;
        //         data_allEditUnreadMsg = data.edit_unseen;
        //         if (data.edit_unseen != null){
        //             // if (data.edit_unseen.length > 0) {
        //             //     $.each(data.edit_unseen, function (k, v) {
        //             //         if(deletedMessages.indexOf(v.msg_id)){
        //             //             var id = v.conversation_id.toString();
        //             //             var c = Number($("#conv" + id).find(".unreadMsgCount").text());
        //             //             $("#conv" + id).find(".unreadMsgCount").html(c + 1);
        //             //             $("#conv" + id).attr("data-nom", c + 1);
        //             //             $("#conv" + id).attr("data-isedit", "yes");
        //             //         }
        //             //     });
        //             // }
        //         }

        //         //unread_msg_conv_intop();
        //         // total_unread_count = parseInt(data.all_unread.length) + parseInt(data.edit_unseen.length);
        //         display_show_hide_unread_bar(total_unread_count);
        //         // Unread end

        //         // Add delivered
        //         socket.emit('add_delivered_if_need', data.all_unread);

        //         // Unread replay
        //         if(data.unread_replay.length > 0){
        //             // $(".side_bar_thread_ico").show();
        //             $(".thread_active").show();
        //             $(".thread_message").show();
        //             reply_msg_counter();

        //             $.each(data.rep_con_data, function(k,v){
        //                 $.each(data.unread_replay, function(kk, vv){
        //                     if(v.has_delete == null){
        //                         v.has_delete = [];
        //                     }
        //                     if(deletedMessages.indexOf(v.msg_id) == -1 && deletedMessages.indexOf(vv.msg_id) == -1){
        //                         if(v.rep_id == vv.conversation_id){
        //                             if (checkguestMsg(vv)) {
        //                                 unread_replay_data.push({
        //                                     rep_conv: vv.conversation_id,
        //                                     msg_id: vv.msg_id,
        //                                     root_conv_id: v.conversation_id,
        //                                     root_msg_id: v.msg_id,
        //                                     is_seen:false
        //                                 });
        //                                 console.log(1511,v)
        //                                 $("#conv"+v.conversation_id).addClass("has_unread_replay");
        //                                 var nor = Number($("#conv"+v.conversation_id).attr("data-nor"));
        //                                 $("#conv"+v.conversation_id).attr("data-nor", Number(nor+1));
        //                                 checkunreadthread(v.msg_id)
        //                             }
        //                         }
        //                     }
        //                 });
        //             });
        //             urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
        //         }
        //         if (getCookie('lastNotification') != "") {
        //             $('#conv'+ getCookie('lastNotification')).trigger('click');
        //             $('.chat-head-name').show();
        //             $('.chat-head-calling').show();
        //             setCookie('lastNotification', '', 1);
        //         }else{
        //             // forlastActiveconv()

        //         }
        //         // $("#conv"+user_id).trigger('click');
        //         // $("#msg").focus();
        //         reply_msg_counter();

        //     });
    });

    // update_conv_counter();

    $.each(user_list, function(k, v) {
        $('._participants_id' + v.id).text(v.fullname);
    })
    setTimeout(function() {
        // pageTitleOn = $('#titleTag').text();
        unreadinactiveCounterTime();
    }, 2000)

});

function checklist_pending_unread(id) {
    // var chk_pending = Number($("#conv"+id).attr("data-checklist_pending"));
    // chk_pending = isNaN(chk_pending) ? 0 : chk_pending;
    // if(chk_pending > 0)
    // 	$('#conv'+id).find('.unreadMsgCount').html(chk_pending);
}

function update_task_panel_counter() {
    var upchk = 0;
    $.each($('[id^=conv]'), function(k, v) {
        if ($(v).is("li")) {
            var chk = Number($(v).attr("chk_action_req"));
            chk = isNaN(chk) ? 0 : chk;
            upchk += chk;
        }
    });
    upchk = upchk > 0 ? upchk : "";
    $("#task_assignment").find(".unreadMsgCount").html(upchk);
    $("#task_assignment").attr("data-nom", upchk);
}

function conv_add_coun(id) {
    var c = Number($("#task_assignment").find(".unreadMsgCount").text());
    var chk = Number($("#conv" + id).attr("chk_action_req"));
    chk = isNaN(chk) ? 0 : chk;
    $("#task_assignment").find(".unreadMsgCount").html(c + 1);
    $("#task_assignment").attr("data-nom", c + 1);
    $("#conv" + id).attr("chk_action_req", chk + 1);
    // conv_into_top(id);
}

function set_checklist_item_counter(data, type = 'new') {
    // console.log(1795, data);
    var upchk = 0;
    $.each(data, function(k, v) {
        if ($("#conv" + v.convid).length == 1) {
            if (checklistCounterLenthString([v]) > 0) {
                // console.log(1798, v);
                if (type == 'new')
                    conv_add_coun(v.convid);
                else if (type == 'update')
                    upchk++;
            }
        }
    });
    // var old_chks = [];
    // var upchk = 0;
    // $.each(data, function(k, v){
    //     // console.log(1691,v);
    //     var flag = false;
    //     if(moment(v.created_at).unix() > 1612881033){
    //         if(v.request_ttl_approved_date != null){
    //             v.end_due_date = (moment(v.request_ttl_approved_date,"YYYY-MM-DD HH:mm").unix() * 1000);
    //         }
    //         var adminlist = [];
    //         var conversation_type = $("#conv"+v.convid).attr("data-cnv-type");
    //         $.each($("#conv"+v.convid).find(".conv_admin"), function(ak, av){
    //             adminlist.push($(av).attr("data-id"));
    //         });
    //         var assusr = v.last_action == null ? v.alternative_assign_to == null ? v.assign_to : v.alternative_assign_to : v.last_action;
    //         if(assusr == v.assignedby) return;
    //         if(assusr == user_id && v.Request_ttl_by != user_id){
    //             if(conversation_type != 'single' && (v.assign_status == v.created_by || adminlist.indexOf(v.assign_status) > -1)){
    //                 console.log(1814, v.msg_title);
    //                 if(type=='new')
    //                     conv_add_coun(v.convid);
    //                 else if(type=='update')
    //                     upchk++;
    //             }
    //             else if(v.assign_status != "2" && v.assign_status != "1" && conversation_type == 'single'){
    //                 console.log(1821, v.msg_title);
    //                 if(type=='new')
    //                     conv_add_coun(v.convid);
    //                 else if(type=='update')
    //                     upchk++;
    //             }
    //             else if(v.checklist_status == 0 && v.assign_status != 1){
    //                 // console.log(1694)
    //                 // if(Number(v.end_due_date) < moment().unix() * 1000){
    //                 //     console.log(1695)
    //                 //     if(type=='new')
    //                 //         conv_add_coun(v.convid);
    //                 //     else if(type=='update')
    //                 //         upchk++;
    //                 // }
    //             }
    //         }
    //         else if(v.created_by == user_id || adminlist.indexOf(user_id) > -1){
    //             if(assusr != user_id && (v.assign_status == 1 || v.Request_ttl_by  != null)){
    //                 console.log(1840, v.msg_title);
    //                 if(type=='new')
    //                     conv_add_coun(v.convid);
    //                 else if(type=='update')
    //                     upchk++;
    //             }
    //         }
    //     }else{
    //         old_chks.push({checklist_id: v.checklist_id, msg_id: v.msg_id});
    //     }
    // });
    // if(old_chks.length > 0)
    //     socket.emit("complete_old_checklist", old_chks);
    return upchk;
}
var last_check_result4has_pending = { conversation_id: "", set: 0 };

function has_any_pending_in_conv() {
    if (getCookie("skip_msg_hidding") != conversation_id) {
        if (last_check_result4has_pending.conversation_id == conversation_id) {
            if (last_check_result4has_pending.set == 0) {
                $("#conv" + conversation_id).find(".unreadMsgCount").html("");
                // $("#conv"+conversation_id).attr("data-checklist_pending", 0);
            } else {
                $("#conv" + conversation_id).find(".unreadMsgCount").html(last_check_result4has_pending.set);
                // $("#conv"+conversation_id).attr("data-checklist_pending", last_check_result4has_pending.set);
            }
        } else {
            // console.log(1792);
            socket.emit("has_pending_chk_in_conv", { user_id, convid: conversation_id }, function(res) {
                // console.log(1737);
                var suchk = set_checklist_item_counter(res, 'update');
                suchk = isNaN(suchk) ? 0 : suchk;
                if (suchk > 0) {
                    // console.log(1741, suchk);
                    $("#conv" + conversation_id).attr("chk_action_req", suchk);
                    setTimeout(function() { has_incompleted_checklist_yet(); }, 1000);
                } else {
                    $('body').removeClass('chklst_incompleted');
                    $('.msgs-form-users').removeClass('pending_chk_process');
                    $('.send-msgs').show();
                    $('.msgs-form-users').show();
                    $("#conv" + conversation_id).find(".unreadMsgCount").html("");
                    // $("#conv"+conversation_id).attr("data-checklist_pending", 0);
                }
                setTimeout(function() { update_task_panel_counter(); }, 1500);
                last_check_result4has_pending.conversation_id = conversation_id;
                last_check_result4has_pending.set = suchk;
                setTimeout(function() {
                    last_check_result4has_pending.conversation_id = "";
                }, 3000);
            });
        }
    }
}
var allUnreadMessages = [];

function update_conv_counter(getdata = false) {
    if (getdata === false) return;
    var data = getdata.data;
    // console.log(1608);
    var my_all_conv = [];

    $.each($('[id^=conv]'), function(k, v) {
        if ($(v).is("li")) {
            $(v).find(".unreadMsgCount").text("");
            $(v).attr("data-nom", "");
            $(v).attr("data-nor", "");
            my_all_conv.push($(v).attr('data-conversationid'));
        }
    });

    set_checklist_item_counter(data.all_chk);

    // console.log("all_unread_msg ========= ", data.all_unread);
    allUnreadMessages = data.all_unread;
    // Unread messages
    var dataallunread = [];
    data.all_unread = _.orderBy(data.all_unread, ["created_at"], ["asc"]);
    if (data.all_unread.length > 0) {
        $.each(data.all_unread, function(k, v) {
            // console.log(1737, v.created_at)
            if (deletedMessages.indexOf(v.msg_id)) {
                if (checkguestMsg(v)) {
                    dataallunread.push(v);
                    if (v.root_conv_id == null) {
                        var id = v.conversation_id.toString();
                        var c = Number($("#conv" + id).find(".unreadMsgCount").text());
                        $("#conv" + id).find(".unreadMsgCount").html(c + 1);
                        $("#conv" + id).attr("data-nom", c + 1);
                        conv_into_top(id);
                    } else {
                        // $("#conv"+v.root_conv_id).find(".unreadMsgCount").addClass("subroomunread");
                        $("#conv" + v.root_conv_id).find('.subroomunread').show();
                    }
                }
            }
        });
    }
    data_unreadAllMsg = dataallunread;
    data_allEditUnreadMsg = data.edit_unseen;
    if (data.unread_replay.length > 0) {
        // console.log("all_ ", data.unread_replay);
        // $(".side_bar_thread_ico").show();
        $(".thread_active").show();
        $(".thread_message").show();
        $.each(data.rep_con_data, function(k, v) {
            $.each(data.unread_replay, function(kk, vv) {
                if (v.has_delete == null) {
                    v.has_delete = [];
                }
                if (deletedMessages.indexOf(v.msg_id) == -1 && deletedMessages.indexOf(vv.msg_id) == -1) {
                    if (v.rep_id == vv.conversation_id) {
                        if (checkguestMsg(vv)) {
                            var screct_h = true;
                            if (vv.secret_user != null && vv.secret_user != undefined) {
                                if (vv.secret_user.length > 0) {
                                    if (vv.secret_user.indexOf(user_id) == -1) {
                                        screct_h = false;
                                    }
                                }
                            }
                            if (screct_h) {
                                unread_replay_data.push({
                                    rep_conv: vv.conversation_id,
                                    msg_id: vv.msg_id,
                                    root_conv_id: v.conversation_id,
                                    root_msg_id: v.msg_id,
                                    is_seen: false
                                });
                                $("#conv" + v.conversation_id).addClass("has_unread_replay");
                                var nor = Number($("#conv" + v.conversation_id).attr("data-nor"));
                                $("#conv" + v.conversation_id).attr("data-nor", Number(nor + 1));
                                checkunreadthread(v.msg_id);
                            }
                        }
                    }
                }
            });
        });
        urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
        reply_msg_counter();
    }

    // $.ajax({
    //     url: '/alpha2/all_unread_msgV2',
    //     type: 'POST',
    //     data: {
    //         my_all_conv: my_all_conv,
    //         user_id: user_id
    //     },
    //     dataType: 'JSON',
    //     success: function (data) {
    //         console.log("all_unread_msg ========= ", data);
    //         allUnreadMessages = data.all_unread;
    //         // Unread messages
    //         var dataallunread = []
    //         if(data.all_unread.length > 0){
    //             $.each(data.all_unread, function(k,v){
    //                 if(deletedMessages.indexOf(v.msg_id)){
    //                     if (checkguestMsg(v)) {
    //                         dataallunread.push(v);
    //                         var id = v.conversation_id.toString();
    //                         var c = Number($("#conv"+id).find(".unreadMsgCount").text());
    //                         $("#conv"+id).find(".unreadMsgCount").html(c+1);
    //                         $("#conv"+id).attr("data-nom", c+1);
    //                         conv_into_top(id);
    //                     }
    //                 }
    //             });
    //         }
    //         data_unreadAllMsg = dataallunread;
    //         data_allEditUnreadMsg = data.edit_unseen;
    //         if(data.unread_replay.length > 0){
    //             console.log("all_ ", data.unread_replay);
    //             // $(".side_bar_thread_ico").show();
    //             $(".thread_active").show();
    //             $(".thread_message").show();
    //             $.each(data.rep_con_data, function(k,v){
    //                 $.each(data.unread_replay, function(kk, vv){
    //                     if(v.has_delete == null){
    //                         v.has_delete = [];
    //                     }
    //                     if(deletedMessages.indexOf(v.msg_id) == -1 && deletedMessages.indexOf(vv.msg_id) == -1){
    //                         if(v.rep_id == vv.conversation_id){
    //                             if (checkguestMsg(vv)) {
    //                                 unread_replay_data.push({
    //                                     rep_conv: vv.conversation_id,
    //                                     msg_id: vv.msg_id,
    //                                     root_conv_id: v.conversation_id,
    //                                     root_msg_id: v.msg_id,
    //                                     is_seen:false
    //                                 });
    //                                 $("#conv"+v.conversation_id).addClass("has_unread_replay");
    //                                 var nor = Number($("#conv"+v.conversation_id).attr("data-nor"));
    //                                 $("#conv"+v.conversation_id).attr("data-nor", Number(nor+1));
    //                                 checkunreadthread(v.msg_id);
    //                             }
    //                         }
    //                     }
    //                 });
    //             });
    //             urrm_pn = JSON.parse(JSON.stringify(unread_replay_data));
    //             reply_msg_counter();
    //         }
    //     },
    //     error: function(e){
    //         console.log(1679, e);
    //     }
    // });
    // socket.emit('all_unread_msg', {my_all_conv}, function(data){

    // });
}
// console.log(1843,all_unread_data)
update_conv_counter(all_unread_data);
// all other things are loaded as well, such as the images
// then scroll to bottom
$(window).on("load", function() {

    scrollToBottom('.chat-page .os-viewport', 0);
});
socket.on('get_delivered_notification', function(data) {
    $.each(data, function(k, v) {
        if ($('.msg_id_' + v.msg_id).length > 0) {
            $('.msg_id_' + v.msg_id).find('.msg-send-seen-delivered').text(' - Delivered');
        }
    });
    last_delivered_always_show();
});

var load_older_data = (conv_id, msg_id, callback) => {
    // var key = has_conv_into_local(conv_id);
    // var has_data = has_prev_msg_into_local(conv_id, msg_id);
    // console.log('Load older Msg')
    var noattch = 0;
    // if(has_data <= 1){
    socket.emit('load_older_msg', { conversation_id: conv_id, msg_id: msg_id, user_id: user_id }, (result) => {
        if (result.result.length > 0) {
            // $("#onscrollloading").show();
            // $("#msg-container").hide();
            // $("#top-date").attr("data-txt", $("#top-date").text());
            // $("#top-date").text("Loading...");
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
                // if(noattch > 8) return false;
                // noattch += count_no_of_attch(v);
                if (checkdrawmsg(v, adminArra, activeConvPrivacy)) {
                    draw_msg(v, false);
                    // console.log(1342);
                }
                // update_local_conv_msg_prepend(key, v);
            });
            changeAllCustomTitle();
            callback({ status: true });
        } else {
            $('#scroll_loader').hide();
            callback({ status: true });
        }
    });
};

socket.on('room_delete_broadcast', function(data) {
    if (data.user_id != user_id) {
        if (data.conv_participants.indexOf(user_id) > -1) {
            // toastr.options.closeButton = true;
            // toastr.options.timeOut = 2000;
            // toastr.options.extendedTimeOut = 1000;
            // toastr["info"]("\"" + data.user_fullname + "\" has deleted \"" + data.title + "\", please contact with \"" + data.user_fullname + "\" for further assistence", "Hi " + user_fullname + " !!!");

            $("#conv" + data.roomId).remove();
            if ($("#createChannelContainer").is(':visible')) {
                if ($("#conv" + data.roomId).hasClass('active')) {
                    closeRightSection();
                }

            }
        }
    }
});


socket.on('msg_fully_delete_broadcast', function(data) {
    if (data.conv_id == undefined) {
        data.conv_id = data.conversation_id;
    }
    if ($('#conv' + data.conv_id).hasClass('sideActive')) {
        if ($('.msg_id_' + data.msg_id).is(':visible')) {
            // console.log(1811, data , 'Remove msg log');
            if (!$('.msg_id_' + data.msg_id).hasClass('editable_checklistMsg')) {
                $('.msg_id_' + data.msg_id).remove();
            }
        }
    } else if ($('#threadReplyPopUp').attr('thread_root') == data.conv_id) {
        $('.rep_msg_' + data.msg_id).remove();
    } else {
        // console.log('Need to remove');
    }
});


socket.on('make_Member_Broadcast', function(data) {
    if (data.targetId == user_id) {
        // toastr["success"]("You are member of '"+data.conv_name+"' ", "Success");
        if ($('#conv' + data.targetConv).hasClass('sideActive')) {
            if ($('#memberListBackWrap').is(':visible')) {
                closeAllPopUp();
            }
            if ($('#createChannelContainer').is(':visible')) {
                closeRightSection();
            }
            if ($('.moreMenuPopup').is(':visible')) {
                $('.moreMenuPopup').hide();
            }
            $('#closeThisRoom').hide();
            $('#hideThisRoom').show();
            $('#reopenThisRoom').hide();
            $('#reOpenThisRoomBtn').hide();
            $('#hideThisRoom').text('Leave room');

            removeA(adminArra, data.targetId);
        }
    }
});

socket.on('make_Admin_Broadcast', function(data) {
    if (data.targetId == user_id) {
        // toastr["success"]("You are admin of '"+data.conv_name+"' ", "Success");
        if ($('#conv' + data.targetConv).hasClass('sideActive')) {
            if ($('#memberListBackWrap').is(':visible')) {
                closeAllPopUp();
            }
            if ($('#createChannelContainer').is(':visible')) {
                closeRightSection();
            }
            if ($('.moreMenuPopup').is(':visible')) {
                $('.moreMenuPopup').hide();
            }

            if ($('#conv' + data.targetConv).hasClass('conv_closed')) {

                $('#reopenThisRoom').show();
                $('#reOpenThisRoomBtn').show();
                $('#closeThisRoom').hide();

            } else {
                $('#closeThisRoom').show();
                $('#reopenThisRoom').hide();
                $('#reOpenThisRoomBtn').hide();

            }

            adminArra.push(targetId);

            if (adminArra.length > 1) {
                $('#hideThisRoom').show();
                $('#hideThisRoom').text('Delete room');
            } else {
                $('#hideThisRoom').hide();
            }



        }

    }

});


function onoffteam(event) {
    var teamid = (event.target.id).replace("myteamid", "");
    if (event.target.checked) {
        $.each($("#connectAsideContainer li"), function(k, v) {
            if ($(v).attr("data-subtitle") == teamid) $(v).show();
        });
    } else {
        $.each($("#connectAsideContainer li"), function(k, v) {
            if ($(v).attr("data-subtitle") == teamid) $(v).hide();
        });
    }
}
socket.on('unreadChecklist', function(res) {
    if (conversation_id == res.msg.conversation_id) {
        setTimeout(function() {
            $('#filterPending_' + res.msg.msg_id).addClass('unread');
        }, 1000)
    }
})


socket.on('remove_pending_status', function(data) {
    // console.log(1581,data.msg_id)
    setTimeout(function() {
        $('.msg_id_' + data.msg_id).find('.msg-send-seen-delivered').html(' - Delivered');
    }, 1000)
})

//
// $('body').on('click','.fil_attach.attach-file.lightbox',function(event){
//   $(this).find('.img_action.view_ico').click();
// })
$(document).keydown(function(event) {
    if ((event.keyCode == 18) && !$('body').hasClass('altKey')) {
        $('body').addClass('altKey');
        $(".images-slide-body>img").css("cursor", "zoom-out");
    }
});

$(document).keyup(function(event) {
    if (event.keyCode == 18) {
        $('body').removeClass('altKey');
        $(".images-slide-body>img").css("cursor", "zoom-in");
    }
});

// $("#msg").bind("paste", function(e){
//   if(!$('#msgCheckItemContainer').is(':visible')){
//     e.preventDefault();
//       // access the clipboard using the api
//       var pastedData = e.originalEvent.clipboardData.getData('text');
//   	var paste_data_link = create_file_link(pastedData);
//   	var str = $(this).html();
//   	if(paste_data_link == null){
//   		$(this).html(str + pastedData + '&nbsp;');
//   	}
//   	else{
//   		$(this).html(str + '<a href="'+ paste_data_link +'" target="_blank">' + paste_data_link + '</a>&nbsp;');
//   	}
//       placeCaretAtEnd(document.getElementById('msg'));
//   }


// });//

//  $("#msg").bind("paste", function(e){
//     var stripdata = stripHtml(e.originalEvent.clipboardData.getData('text'));
//     console.log(1757,stripdata);
//     var clipboardData, pastedData;

//     // Stop data actually being pasted into div
//     e.stopPropagation();
//     e.preventDefault();

//     // Get pasted data via clipboard API
//     clipboardData = e.clipboardData || window.clipboardData;
//     pastedData = clipboardData.getData('Text');

//     e.clipboardData.setData('text', document.getSelection() + stripdata);
//     e.preventDefault();

// });

document.querySelector('[contenteditable]').addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    window.document.execCommand('insertText', false, text);
});

function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

$("#msg_rep").bind("paste", function(e) {
    // e.preventDefault();
    //    // access the clipboard using the api
    //    var pastedData = e.originalEvent.clipboardData.getData('text');
    // var paste_data_link = create_file_link(pastedData);
    // var str = $(this).html();
    // if(paste_data_link == null){
    // 	$(this).html(str + pastedData + '&nbsp;');
    // }
    // else{
    // 	$(this).html(str + '<a href="'+ paste_data_link +'" target="_blank">' + paste_data_link + '</a>&nbsp;');
    // }
    //    placeCaretAtEnd(document.getElementById('msg_rep'));
    $('#msg_rep').find('a').attr('target', '_blank');
});

socket.on('updateLinkTitle', function() {

    findMyLinks(conversation_id);
})