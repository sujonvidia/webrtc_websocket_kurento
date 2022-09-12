var _ = require('lodash');
var fs = require('fs');
const shortid = require('shortid');
var moment = require('moment');
const nodemailer = require("nodemailer");
var gravatar = require('gravatar');
const isUuid = require('uuid-validate');
var vgd = require('vgd');
var Minio = require('minio');
const { resolve } = require('path');
var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.FILE_SERVER_ACCESS_KEY,
    secretKey: process.env.FILE_SERVER_SECRET_KEY
});

const validURL = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function add2buffer(data) {
    console.log(30, user_session[data.user_id]);
    if (user_session[data.user_id] && user_session[data.user_id].length > 0) {
        console.log(31)
        if (!free_buffer.hasOwnProperty(data.user_id)) {
            free_buffer[data.user_id] = [];
        }
        free_buffer[data.user_id].push({ ack_id: data.msg.ack_id, session_id: user_session[data.user_id], msg: data.msg });
        console.log(43211543, 'add2_buffer', free_buffer[data.user_id]);
    }

}

function remove_buffer(data) {
    console.log(40, free_buffer);
    if (free_buffer.hasOwnProperty(data.user_id)) {
        var _buffer = free_buffer[data.user_id];
        _.each(_buffer, function(v, k) {
            if (v.ack_id == data.message.ack_id) {
                if (v.session_id.length == 1) {
                    free_buffer[data.user_id] = [];
                    console.log('rem_buffer_clear', data.user_id);

                } else {
                    v.session_id.splice(v.session_id.indexOf(data.session_id), 1);
                    console.log('rem_buffer_splice', v.session_id);
                }
                return false;
            }
        })
    }
    console.log(52, free_buffer);
}

function idToNameArr(idArry) {
    var namearr = [];
    _.each(idArry, function(v, k) {
        if (alluserOnLoad[v] !== undefined)
            namearr.push(alluserOnLoad[v]);
    });
    return namearr;
}

module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var {
        generateMessage,
        sendNewMsg,
        sendCallMsg,
        sendBusyMsg,
        getUserIsBusy,
        update_one_msg_status_add_viewer,
        update_msg_status_add_viewer,
        hasMessageThisTag,
        deleteThisTag,
        replyId,
        thread_reply_update,
        // thread_replyAttch_update,
        find_reply_list,
        url_preview,
        readOldMessage,
        getAllUnreadConv,
        count_unread,
        update_delivered_if_need,
        getAllSearchMsg,
        getAllDataForTag,
        get_one_msg,
        check_reac_emoji_list,
        get_conversation_info,
        connect_msgUpdate,
        connect_msgUpdatechecklist,
        read_msg_data,
        url_attachment_data_update,
        clear_conv_history,
        update_msg_tag,
        create_sp_tag,
        get_tagmsg_id,
        commit_msg_delete,
        mediaAllMsg,
        updateMsgTimer,
        edit_msg_attch_list,
        searchMsgBody,
        msg_delete_full,
        findMsgBymsg_id,
        getChecklistMsg,
        getsinglemsgchecklist,
        updateCheckStatus,
        createtagNcreateIssueTag,
        getconvissuetag,
        getmsgissuetag,
        msgtagAddorRemove,
        acceptOrRejectIssue,
        forwardMessage,
        findmsgRepId,
        need_msg_status_update,
        getlasthundredmsg,
        delete_message_last_time,
        updateHasHideThismsg,
        getAllmydeletemessage,
        send_notification_msg,
        updateTextMsg,
        editRepMsg,
        getConvCallMsg,
        getConvOnlyMsg,
        getConvAllMsgs,
        update_user_profile,
        update_company_profile,
        deleteconvMessage,
        issueAssignMsg,
        Filter_Conv_Last_Time,
        clear_all_deleted_msg,
        update_checklist_time,
        update_checklist_time_multi,
        get_flagged_msg_only,
        convertTask,
        updateMsg_tag_emit,
        updateChecklistLastTime,
        add_chk_item,
        only_add_remove_assignee,
        chk_due_date_today,
        getOneChecklistData,
        manage_checklist,
        removeItem,
        complete_old_checklist,
        getOneChecklistMsg,
        findTeamChecklistData,
        getTeamTaskData,
        deleteEmptyTeamTask,
        my_all_task_assignment,
        has_pending_chk_in_conv,
        update_team_to_user,
        saveAndCancelChecklist,
        saveNewChecklistMsg,
        send_msg_firebase,
        getALlMessagesLinkData,
        update_conversation
    } = require('./../utils/message');
    const isEmpty = require('../validation/is-empty');
    var { getAllMsg } = require('./../utils/android');
    var {
        saveConversation,
        findConversationHistory,
        createGroup,
        createPersonalConv,
        findConvDetail,
        saveNewGroup,
        updateGroupName,
        updateKeySpace,
        updatePrivecy,
        updateRoomimg,
        saveTag,
        findtag,
        saveConTag,
        saveConvD,
        getAllTagData,
        taggedFilterUtils,
        filesTag,
        getAllTagsforList,
        deleteUnusedTag,
        find_new_message_participants,
        setPinUnpin,
        update_group_participants,
        findconvTag,
        up_R_Parti,
        up_R_Admins,
        findMsgIdByTag,
        updateTopicType,
        updateBusinessUnit,
        topicTag,
        TopicMessagesTag,
        topicTagItemDelete,
        getFilterMessage,
        getAllUsedConvTag,
        getuseunitid,
        getAllThreadCov,
        getallThreadMsg,
        findConvExistornot,
        createNewSingleconv,
        findandgetconv,
        checkThisTitle,
        deleteRoom,
        hideUserinSidebar,
        addGuestuseronroom,
        createPersonalConv2,
        pin_unpin_conversation,
        get_one_room_data,
        getAllConversations,
        findCallsByConversation,
        room_members,
        add_guest_into_room
    } = require('./../utils/conversation');

    var { file_unlink, getallFileOnConv, findThisFile, updateFileTagV2 } = require('./../utils/files');
    var {
        getAllUserTag,
        createNewUserTag,
        deleteOneTag,
        updateUserTagTitle,
        getCompanyTag,
        tagOneMsg,
        getConvTagId,
        tagOnCov,
        removeConvTag,
        removeOnMsgTag,
        updateConvTagV2,
        delteMyTagV2,
        updatedColorTag,
        sharedTag,
        sharedTagArray
    } = require('./../utils/user_tag');
    var {
        getBUnitByUser,
        getAllbunit,
        addNewBUnit,
        findOrAddIndustry,
        updateunitTitle,
        removeBunitbyid
    } = require('./../utils/b_unit');
    var { create_conv_link, hidethisurl, hidethisurl_forAll, delete_selected_link } = require('./../utils/links');
    var { customTitle, setAsNotification, getNotificationSound } = require('./../utils/customtitle');
    //Import Model
    var {
        insert_notification,
        my_all_notification,
        my_last_notification_and_total,
        update_notification,
        get_all_tips
    } = require('./../utils/all_notifications');
    var { models } = require('./../config/db/express-cassandra');

    var {
        createActivity,
        getActivityDetail,
        insertChecklist,
        getChecklist,
        updateActivity,
        todosearch,
        deleteCheclList,
        deleteSubTask,
        getAllActivityhMsg,
        get_myTags,
        get_messages_tag,
        getAllCompletedActivity,
        draftActivity,
        updateDraftActivity,
        getSubtasklist,
        createSubActivity,
        updateActivityList,
        activityAccepted,
        allActivityMsg,
        saveCokkeiFiles,
        UpdatecokkieFiles,
        update_activity_participants,
        getCompanyIdByUser
    } = require('./../utils/todo');

    var { hayvenjs } = require('./../utils/hayvenjs');
    var {
        todo_msg,
        taskMediaAllMsg,
    } = require('./../utils/todo_msg');

    // added by sujon
    var {
        getUserIsBusy,
        sendCallMsg,
        get_kurentoroom,

    } = require('./../utils/voice_video');

    // async function send_msg_firebase(user_id, data, fcm_type, calling_data = false) {
    //     if (user_id && data) {
    //         models.instance.Users.findOne({ id: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
    //             if (err) {} 
    //             else {
    //                 if (user && user.fcm_id) {
    //                     let data2send = { fcm_type: fcm_type };
    //                     var options = {
    //                         priority: "high",
    //                         timeToLive: 60 * 60 * 24,
    //                         mutableContent: true,
    //                         // contentAvailable: true
    //                     }
    //                     var sender_name = '';
    //                     var msg_body = '';
    //                     var sender = '';
    //                     for (let ky in data) {
    //                         if (data[ky] != null) {
    //                             if (_.isString(data[ky])) {
    //                                 data2send[ky] = data[ky];
    //                             } else {
    //                                 data2send[ky] = JSON.stringify(data[ky]);

    //                                 if (data[ky].hasOwnProperty('sender_name')) { sender_name = data[ky]['sender_name']; }
    //                                 if (data[ky].hasOwnProperty('msg_body')) { msg_body = data[ky]['msg_body']; }
    //                                 if (data[ky].hasOwnProperty('sender')) { sender = String(data[ky]['sender']); }
    //                             }
    //                         }
    //                     }
    //                     // data2send['fcm_type'] = fcm_type;
    //                     if (data.conversation_type == 'single') {
    //                         var notification_obj = {
    //                             title: sender_name,
    //                             body: msg_body
    //                         }
    //                     } else {
    //                         var notification_obj = {
    //                             title: data.conversation_title,
    //                             body: sender_name + ': ' + msg_body
    //                         }
    //                     }

    //                     if (sender != user_id) {
    //                         for (let fid of user.fcm_id) {
    //                             if (fid.includes('@@@')) {
    //                                 var device = fid.split('@@@')[0];
    //                                 var fcm_id = fid.split('@@@')[1];
    //                                 if (device == 'android') {
    //                                     var message = {
    //                                         data: data2send
    //                                     };
    //                                 } else { // iOS
    //                                     var message = {
    //                                         notification: notification_obj,
    //                                         data: data2send,
    //                                         apns: {
    //                                             payload: {
    //                                               aps: {
    //                                                 'category': 'VIEWORCANCEL'
    //                                               }
    //                                             }
    //                                           },
    //                                     };
    //                                     // message["category"] = "VIEWORCANCEL";
    //                                 }
    //                             } else {
    //                                 var fcm_id = fid;
    //                                 var message = {
    //                                     notification: notification_obj,
    //                                     data: data2send,
    //                                     // "category" : "VIEWORCANCEL"
    //                                 };
    //                             }

    //                             firebase_admin.messaging().sendToDevice(fcm_id, message, options)
    //                                 .then(function(response) {
    //                                     console.log("========> Firebase:Ok:", message.data.fcm_type, response);
    //                                 })
    //                                 .catch(function(error) {
    //                                     console.trace("========> Firebase:Error:", message, error);
    //                                 });
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // }

    var {
        connect_mute_create,
        get_all_mute_conv,
        update_mute_notification,
        delete_mute_notification
    } = require('./../utils/mute_notification');
    var {
        getConversationFiles,
        getConversationMessages,
        getAllTags
    } = require('./../utils/redis_scripts');

    var { add_activity } = require('../utils/user_activity');
    var { signup_utils } = require('../utils/signup_utils');

    socket_sid_store = {};
    socket_uid_store = {};
    socket_cid_store = {};

    io.on('connection', function(socket) {
        socket.join('1');
        // socket.join('bde4b452-0734-4aaf-b5c1-09cc12d7ab64');
        // setInterval(function(){
        //   console.log(205, socket.handshake.session.userdata.text);
        // }, 1000);
        console.log('check 1================================', socket.connected);

        // socket.on('heartbeat', function(data) {
        //     // console.log(377, data.name);
        // });

        socket.on('login', function(userdata, callback) {
            if (userdata.from) {
                socket_sid_store[socket.id] = userdata.from;
                if (!socket_uid_store.hasOwnProperty(userdata.from)) socket_uid_store[userdata.from] = [];
                if (socket_uid_store[userdata.from].indexOf(socket.id) === -1) socket_uid_store[userdata.from].push(socket.id);
                console.log('socket_store_connect', socket_uid_store);
            }


            socket.join('navigate_2018_902770');
            socket.join(userdata.from);
            // console.log('socket login data: '+userdata.from);
            console.log('socket login user name: ' + userdata.text);
            console.log('socket login data: ' + JSON.stringify(userdata));
            console.log('==socket:login:', socket.id, userdata.from);

            var userStatus = {
                user_id: userdata.from,
                name: userdata.text,
                length: 1
            }
            var checkUserNew = true;
            if (allOnlineUserStatus.length == 0) {
                allOnlineUserStatus.push(userStatus);
            } else {
                _.each(allOnlineUserStatus, function(v, k) {
                    if (checkUserNew) {
                        if (v.user_id == userdata.from) {
                            checkUserNew = false;
                            allOnlineUserStatus[k]['length'] = v.length + 1;
                        } else {
                            if (k == allOnlineUserStatus.length - 1) {
                                allOnlineUserStatus.push(userStatus);
                            }
                        }
                    }
                });
            }

            // if(typeof userdata.room_groups !== 'undefined'){
            //   _.forEach(userdata.room_groups, function(v, k){
            //     socket.join(v.conversation_id);
            //   });
            // }

            socket.handshake.session.userdata = userdata;
            socket.handshake.session.save();

            if (alluserlist.indexOf(userdata.from) != -1) {
                console.log(userdata.text + ' is connected into socket');
            } else {
                alluserlist.push(userdata.from);
            }
            // var room = io.sockets.adapter.rooms['navigate_2018_902770'];
            // room.length
            socket.emit('online_user_list', generateMessage('Admin', alluserlist)); // this emit receive only who is login
            socket.broadcast.emit('new_user_notification', generateMessage('Admin', socket.handshake.session.userdata)); // this emit receive all users except me
            if (callback) callback(true);


        });

        socket.on('reconnecttry', function(data) {
            console.log(261, new Date(), data);
        })

        socket.on('disconnect', async function(reason) {
            let user_id = socket_sid_store[socket.id];
            if (user_id) {
                if (!socket_uid_store.hasOwnProperty(user_id)) socket_uid_store[user_id] = [];
                var index = socket_uid_store[user_id].indexOf(socket.id);
                if (index !== -1) { socket_uid_store[user_id].splice(index, 1); }
                delete socket_sid_store[socket.id]
                console.log('socket_store_disconnect', socket_uid_store);
            }


            console.log('check 2===============================', socket.connected);
            console.log('qqqqqqqqqqqqqqqq:disconnect:' + socket.id);
            // _.each(allOnlineUserStatus,function(v,k){
            //     if(v.user_id == socket.handshake.session.userdata.from){
            //       if(v.length > 0){
            //         allOnlineUserStatus[k]['length'] = v.length - 1;
            //       }
            //     }
            // });


            var logoutEmit = false;
            if (socket.handshake.session !== undefined && socket.handshake.session.userdata != undefined && socket.handshake.session.userdata.from != undefined) {
                console.log('==socket:disconnect:', socket.id, socket.handshake.session.userdata.from);
                if (io.sockets.adapter.rooms.hasOwnProperty(socket.handshake.session.userdata.from)) {
                    var ct = Object.keys(io.sockets.adapter.rooms[socket.handshake.session.userdata.from].sockets).length;
                    if (ct == 0) {
                        logoutEmit = true;
                    }
                } else {
                    logoutEmit = true;
                }
            }

            console.log('time:', new Date());

            // if(socket.handshake.session !== undefined){
            // 	if(socket.handshake.session.userdata !== undefined){
            //     // console.log('===> logout',logoutEmit, socket.handshake.session.userdata);
            // 		if(socket.handshake.session.userdata.from !== undefined){
            // 			// console.log(socket.handshake.session.userdata);
            // 			_.each(allOnlineUserStatus,function(v,k){
            // 				if(v.user_id == socket.handshake.session.userdata.from){
            // 					if(v.length > 0){
            // 						allOnlineUserStatus[k]['length'] = v.length - 1;
            // 					}
            // 					if(allOnlineUserStatus[k]['length'] == 0){
            // 						logoutEmit = true;
            // 					}
            // 				}
            // 			});
            // 		}
            // 	}
            // }


            if (logoutEmit) {
                io.sockets.in('navigate_2018_902770').emit('logout', { userdata: socket.handshake.session.userdata });
                console.log('qqqqqqqqqqqq:logout:' + socket.handshake.session.userdata.from);
                if (socket.handshake.session.userdata) {
                    alluserlist = alluserlist.filter(function(el) {
                        return el !== socket.handshake.session.userdata.from;
                    });
                    delete socket.handshake.session.userdata;
                    socket.handshake.session.save();
                }
            }



        });

        socket.on('o2otoGroup', function(message, callback) {
            if (message.currentConvID != "") {
                findConvDetail(message.currentConvID, (result, err) => {
                    if (err) { throw err; } else {
                        console.log(result);
                        var previousList = result.conversationDetail[0].participants;
                        var newMember = [message.targetUserID];
                        var conversationMemList = previousList.concat(newMember);
                        saveNewGroup(conversationMemList, message.ecosystem, message.crtUserID.toString(), message.company_id, (result, err) => {
                            if (err) { throw err; } else {
                                callback(result);
                            }
                        });
                    }
                });
            }
        });

        socket.on('get_conversation_detail', function(data, callback) {
            findConvDetail(data.conversation_id, (result, err) => {
                if (err) { callback({ status: false, err }); } else { callback(result); }
            });
        });

        socket.on('saveGroupName', function(message, callback) {
            if (message.currentConvID != "") {
                updateGroupName(message.conversation_id, message.newGroupname, message.user_id, message.company_id, (result, err) => {
                    if (err) {
                        throw err;
                    } else {
                        socket.broadcast.emit('saveBroadcastRoom', message);
                        callback(result);
                    }
                });
            }
        });


        // socket.on('sendMessage', function (message, callback) {
        //   var old_created_time = null;
        //   var last_update_user = null;

        //   if(message.old_created_time != undefined){
        //     old_created_time = message.old_created_time;
        //   }
        //   if(message.last_update_user != undefined){
        //     last_update_user = message.last_update_user
        //   }
        //   if (message.is_room === false) {
        //     if(message.has_reply == undefined){
        //       message.has_reply = 0;
        //     }
        //     if(message.rep_id == undefined){
        //       message.rep_id = null;
        //     }
        //     var paramsData = {
        //                    io:io,
        //                    socket:socket,
        //                    from:socket.handshake.session.userdata.from,
        //                    sender_img:message.sender_img,
        //                    sender_name:message.sender_name,
        //                    conversation_id:message.conversation_id,
        //                    msg:message.text,
        //                    attachment:message.attach_files,
        //                    timer:message.has_timer,
        //                    old_created_time:old_created_time,
        //                    last_update_user:last_update_user,
        //                    updatedMsgid:'',
        //                    tag_list:message.tag_list,
        //                    has_reply:message.has_reply,
        //                    rep_id:message.rep_id,
        //                    service_provider:message.selectedSp
        //                 }

        //     sendNewMsg(paramsData,(result, err) => {
        //         if (err) {
        //           console.log(72, err);
        //         } else {
        //           console.log(358,result);
        //           if (result.status) {
        //             if (socket.handshake.session.user_id.toString() !== message.to.toString()) {
        //               io.to(message.to).emit('newMessage', {
        //                 msg_id: result.res,
        //                 msg_from: socket.handshake.session.user_id,
        //                 msg_text: message.text,
        //                 msg_sender_name: message.sender_name,
        //                 msg_sender_img: message.sender_img,
        //                 msg_attach_files: message.attach_files,
        //                 msg_conv_id: message.conversation_id,
        //                 msg_thread_root_id: message.thread_root_id
        //               });
        //               if(result.unreadChecklist !== undefined){
        //                 if(result.unreadChecklist){
        //                   socket.broadcast.emit('unreadChecklist',result);
        //                 }
        //               }
        //             }
        //             // console.log('socketjs 38', result);
        //             callback(result);
        //           } else {
        //             console.log(result);
        //           }
        //         }
        //       });
        //   }
        //   else if (message.is_room === true) {
        //     // console.log('something wrong!!!');
        //     // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
        //     // This is temporary group message.
        //     var old_created_time = null;
        //     var last_update_user = null;

        //     if(message.old_created_time != undefined){
        //       old_created_time = message.old_created_time;
        //     }
        //     if(message.last_update_user != undefined){
        //       last_update_user = message.last_update_user
        //     }
        //     if(message.has_reply == undefined){
        //       message.has_reply = 0;
        //     }
        //     if(message.rep_id == undefined){
        //       message.rep_id = null;
        //     }
        //     var paramsData = {
        //                    io:io,
        //                    socket:socket,
        //                    from:socket.handshake.session.userdata.from,
        //                    sender_img:message.sender_img,
        //                    sender_name:message.sender_name,
        //                    conversation_id:message.conversation_id,
        //                    msg:message.text,
        //                    attachment:message.attach_files,
        //                    timer:message.has_timer,
        //                    old_created_time:old_created_time,
        //                    last_update_user:last_update_user,
        //                    updatedMsgid:'',
        //                    tag_list:message.tag_list,
        //                    has_reply:message.has_reply,
        //                    rep_id:message.rep_id,
        //                    service_provider:message.selectedSp
        //                 }
        //     sendNewMsg(paramsData,(result, err) => {
        //         if (err) {
        //           console.log(err);
        //         } else {
        //           if (result.status) {
        //             socket.broadcast.emit('newMessage', {
        //               msg_id: result.res,
        //               msg_from: message.to,
        //               msg_text: message.text,
        //               msg_sender_name: message.sender_name,
        //               msg_sender_img: message.sender_img,
        //               msg_attach_files: message.attach_files,
        //               msg_conv_id: message.conversation_id,
        //               msg_thread_root_id: message.thread_root_id
        //             }); // this emit receive all users except me
        //             // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
        //             // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
        //             if(result.unreadChecklist !== undefined){
        //               if(result.unreadChecklist){
        //                 socket.broadcast.emit('unreadChecklist',result);
        //               }
        //             }
        //             callback(result);
        //           } else {
        //             console.log(result);
        //           }
        //         }
        //       });
        //   }
        // });

        /*for mobile*/
        // socket.on('sendMessageFromMobile', async function (message) {
        //   console.log("*************************************************************************************");
        //   console.log(449, message);
        //   console.log("*************************************************************************************");
        //   var old_created_time = null;
        //   var last_update_user = null;

        //   if(message.old_created_time != undefined){
        //     old_created_time = message.old_created_time;
        //   }
        //   if(message.last_update_user != undefined){
        //     last_update_user = message.last_update_user
        //   }
        //   var conv_members = await room_members(message.conversation_id, socket.handshake.session.userdata.from);
        //   if(conv_members.length>0){
        //     if (message.is_room === false) {
        //       if(message.has_reply == undefined){
        //         message.has_reply = 0;
        //       }
        //       if(message.rep_id == undefined){
        //         message.rep_id = null;
        //       }
        //       var paramsData = {
        //                     io:io,
        //                     socket:socket,
        //                     from:message.sender_id,
        //                     sender_img:message.sender_img,
        //                     sender_name:message.sender_name,
        //                     conversation_id:message.conversation_id,
        //                     msg:message.text,
        //                     attachment:message.attach_files,
        //                     timer:message.has_timer,
        //                     old_created_time:old_created_time,
        //                     last_update_user:last_update_user,
        //                     updatedMsgid:'',
        //                     tag_list:message.tag_list,
        //                     has_reply:message.has_reply,
        //                     rep_id:message.rep_id,
        //                     service_provider:message.selectedSp
        //                   }
        //                   console.log(528,paramsData);
        //       sendNewMsg(paramsData, (result, err) => {
        //           if (err) {
        //             console.log(127, err);
        //           } else {
        //             if (result.status) {
        //                 for(var n=0; n<conv_members.length; n++){
        //                   io.to(conv_members[n]).emit('newMessage', result);
        //                 }
        //                 // socket.broadcast.emit('newMessage', result);
        //                 // io.to(message.sender_id).emit('newMessage', result);
        //                 if(result.unreadChecklist !== undefined){
        //                   if(result.unreadChecklist){
        //                     socket.broadcast.emit('unreadChecklist',result);
        //                   }
        //                 }
        //             } else {
        //               console.log(result);
        //             }
        //           }
        //         });
        //     }
        //     else if (message.is_room === true) {
        //       // console.log('something wrong!!!');
        //       // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
        //       // This is temporary group message.
        //       var old_created_time = null;
        //       var last_update_user = null;

        //       if(message.old_created_time != undefined){
        //         old_created_time = message.old_created_time;
        //       }
        //       if(message.last_update_user != undefined){
        //         last_update_user = message.last_update_user
        //       }
        //       if(message.has_reply == undefined){
        //         message.has_reply = 0;
        //       }
        //       if(message.rep_id == undefined){
        //         message.rep_id = null;
        //       }
        //       var paramsData = {
        //                     io:io,
        //                     socket:socket,
        //                     from:message.sender_id,
        //                     sender_img:message.sender_img,
        //                     sender_name:message.sender_name,
        //                     conversation_id:message.conversation_id,
        //                     msg:message.text,
        //                     attachment:message.attach_files,
        //                     timer:message.has_timer,
        //                     old_created_time:old_created_time,
        //                     last_update_user:last_update_user,
        //                     updatedMsgid:'',
        //                     tag_list:message.tag_list,
        //                     has_reply:message.has_reply,
        //                     rep_id:message.rep_id,
        //                     service_provider:message.selectedSp
        //                   }
        //       sendNewMsg(paramsData, (result, err) => {
        //           if (err) {
        //             console.log(err);
        //           } else {
        //             if (result.status) {
        //               for(var n=0; n<conv_members.length; n++){
        //                 io.to(conv_members[n]).emit('newMessage', result);
        //               }
        //               // socket.broadcast.emit('newMessage', result); // this emit receive all users except me
        //               // io.to(message.sender_id).emit('newMessage', result); // this emit receive all users except me
        //               // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
        //               // callback(result);
        //               if(result.unreadChecklist !== undefined){
        //                 if(result.unreadChecklist){
        //                   socket.broadcast.emit('unreadChecklist',result);
        //                 }
        //               }
        //             } else {
        //               console.log(result);
        //             }
        //           }
        //         });
        //     }
        //   }
        //   else{
        //     console.log("sendMessageFromMobile member not found error");
        //   }
        // });

        socket.on('msg_url2preview', function(data, callback) {
            console.log(577, data);
            url_preview(data, (res) => {
                if (res.status) {
                    console.log(580, res);
                    socket.broadcast.emit('url2preview', res);
                    callback(res);
                } else {
                    callback(res);
                }
            });
        });

        socket.on('unlink_file', function(data) {
            file_unlink(data);
        });

        socket.on('seen_emit', function(data) {
            console.log(260, data);
            // update_one_msg_status_add_viewer(data.msgid, data.receiverid, data.conversation_id, (result) => {
            update_msg_status_add_viewer('', data.receiverid, data.conversation_id, (result) => {
                if (result.status)
                    io.to(data.senderid).emit('receive_emit', data.msgid);
            });
        });

        socket.on('update_msg_seen', function(data) {
            io.to(data.senderid).emit('update_msg_receive_seen', data);
        });

        socket.on('one_user_deleted_this', function(data) {
            socket.broadcast.emit('delete_from_all', data);
        });

        socket.on('update_thread_count', function(data) {
            thread_reply_update(data, (result) => {
                if (result.status) {
                    console.log('socket update_thread_count update status = ', result);
                    socket.broadcast.emit('update_thread_counter', data);
                    // callback(_.toString(result.result));
                } else {
                    console.log('socket 130', result);
                    // callback(result);
                }
            });
        });

        // socket.on('update_repAttch_count', function (data,callback) {
        //   thread_replyAttch_update(data, (result) => {
        //     if (result.status) {
        //       socket.broadcast.emit('thread_replyAttch_update', data);
        //       callback(result);
        //     } else {
        //       console.log('socket 130', result);
        //       // callback(result);
        //     }
        //   });
        // });

        socket.on('find_reply', function(data, callback) {
            find_reply_list(data.msg_id, data.conversation_id, (result) => {
                callback(result);
            });
        });

        socket.on('addNewMeberToGroup', function(message, callback) {
            io.to(message.userID).emit('popUpgroupblock', {
                senderName: message.senderName,
                userID: message.userID,
                userName: message.userName,
                userImg: message.userImg,
                cnvID: message.cnvID,
                desig: message.desig,
                groupName: message.groupName
            });
        });

        socket.on('shareThisMsg', function(data, callback) {
            createPersonalConv(data.myID, data.targetID, 'personal', data.company_id, (result, err) => {
                if (err) {
                    if (err) throw err;
                } else if (result.status) {
                    callback(result);
                } else {
                    console.log(result);
                }
            });
        });

        socket.on('shareMessage', function(data, callback) {
            readOldMessage(data, (result, error) => {
                // console.log(result);
                if (result.status) {
                    io.to(data.target_user).emit('newMessage', {
                        msg_id: result.res,
                        msg_from: data.sender_id,
                        msg_text: result.message_data.msg_body,
                        msg_sender_name: data.sender_name,
                        msg_sender_img: data.sender_img,
                        msg_attach_files: {
                            attch_imgfile: result.message_data.attch_imgfile,
                            attch_audiofile: result.message_data.attch_audiofile,
                            attch_videofile: result.message_data.attch_videofile,
                            attch_otherfile: result.message_data.attch_otherfile
                        },
                        msg_conv_id: data.conversation_id,
                        msg_thread_root_id: false
                    });
                    send_msg_firebase(data.target_user, {
                        msg_id: result.res,
                        msg_from: data.sender_id,
                        msg_text: result.message_data.msg_body,
                        msg_sender_name: data.sender_name,
                        msg_sender_img: data.sender_img,
                        msg_attach_files: {
                            attch_imgfile: result.message_data.attch_imgfile,
                            attch_audiofile: result.message_data.attch_audiofile,
                            attch_videofile: result.message_data.attch_videofile,
                            attch_otherfile: result.message_data.attch_otherfile
                        },
                        msg_conv_id: data.conversation_id,
                        msg_thread_root_id: false
                    }, 'newMessage');
                    callback(result);
                } else {
                    callback({ status: false });
                }
            });
        });

        socket.on('messageTagSave', function(data, callback) {
            hasMessageThisTag(data.conversation_id, data.msg_id, data.userid, data.tagTitle, (respond, error) => {
                if (error) {
                    if (error) throw error;
                } else if (respond.status) {
                    callback({ status: true, respond: respond });
                } else {
                    callback({ status: false, respond: respond });
                }
            });
        });

        socket.on('deleteTag', function(data, callback) {
            if (data.tagid != undefined && data.tagid != "") {
                deleteThisTag(data.msgIdsFtag, data.tagtile, data.tagid, data.rommID, (respond, error) => {
                    if (error) {
                        if (error) throw error;
                    } else if (respond.status) {
                        callback({ status: true, respond: respond });
                    } else {
                        callback({ status: false, respond: respond });
                    }
                });
            }
        });

        // socket.on('add_guest_user', async function(data, callback){
        //   if(data.guest_member_emails !== undefined && data.guest_member_emails != ''){
        //     var emails = data.guest_member_emails.split(";");
        //     for(var n=0; n<emails.length; n++){
        //       var guest = await signup_utils.add_guest_user({email: emails[n], comid: data.company_id});
        //       callback(guest);
        //     }
        //   }
        // });
        socket.on('add_guest_user', async function(data, callback) {
            var guest = await signup_utils.add_guest_user({ email: data.email, name: data.name, comid: data.company_id, created_by: data.created_by });
            callback(guest);
        });

        socket.on('send_invitation_to_join_room', async function(data, callback) {
            console.log(848, data);
            var guest = await signup_utils.send_invitation_to_join_room(data);
            callback(guest);
        });
        socket.on('send_email_remove_notification', async function(data, callback) {
            console.log(923, data);
            var guest = await signup_utils.send_email_remove_notification(data);
            callback(guest);
        });
        socket.on('check_update_invitation', function(data, callback) {
            console.log(928, data);
            signup_utils.update_invite_link(data, (res) => {
                callback(res);
            });
        });
        socket.on('get_guest_invite_status', function(data, callback) {
            console.log(923, data);
            signup_utils.get_guest_invite_status(data, (invite_status) => {
                callback(invite_status);
            });
        });

        socket.on('add_guest_into_room', function(data, callback) {
            add_guest_into_room(data, (rep) => {
                callback(rep);
            });
        });
        socket.on('update_team_to_user', function(data, callback) {
            update_team_to_user(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('groupCreateBrdcst', async function(message, callback) {
            // console.log(837, message.memberListUUID);
            console.log(845, message.memberListUUID);
            var str = message.memberList;
            var strUUID = message.memberListUUID;
            var adminList = message.adminList;
            var adminListUUID = message.adminListUUID;
            var memberlist = str.concat(adminList);
            var joinMenber = memberlist.join(',');
            if (adminListUUID == undefined) {
                adminListUUID = [];
                adminListUUID.push(socket.handshake.session.userdata.from);
            } else {
                if (adminListUUID.indexOf(socket.handshake.session.userdata.from) == -1) {
                    adminListUUID.push(socket.handshake.session.userdata.from);
                }
            }
            if (memberlistUUID == undefined) {
                memberlistUUID = [];
                memberlistUUID.push(socket.handshake.session.userdata.from);
            } else {
                if (memberlistUUID.indexOf(socket.handshake.session.userdata.from) == -1) {
                    memberlistUUID.push(socket.handshake.session.userdata.from);
                }
            }

            var memberlistUUID = strUUID.concat(adminListUUID);
            if (message.teamname !== "") {
                var root_conv_id = null;
                if (message.itsSubConvid != undefined) {
                    root_conv_id = message.itsSubConvid;
                }
                createGroup(adminListUUID, memberlistUUID, message.teamname, message.createdby, message.selectecosystem, message.grpprivacy, message.conv_img, message.topic_type, message.b_unit_id, message.b_unit_name, message.alltags, message.temTNA, message.readyTag, message.service_provider, message.company_id, root_conv_id, (result, err) => {
                    if (err) {
                        console.log(654, err);
                    } else {
                        if (result.status) {
                            console.log(951, root_conv_id);
                            if (!result.exist) {
                                var data = {
                                        type: 'welcome',
                                        sender: message.createdby,
                                        sender_name: message.createdby_name,
                                        sender_img: message.conv_img,
                                        conversation_id: result.conversation_id.toString(),
                                        msg_type: 'notification',
                                        msg_body: 'Welcome to "' + message.teamname + '" room.',
                                        root_conv_id: root_conv_id
                                    }
                                    // socket.join(result.conversation_id.toString());
                                send_notification_msg(data, async function(res) {
                                        if (res.status) {
                                            var temp = [];
                                            var conv_members = await room_members(data.conversation_id, data.sender);
                                            var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                            var conversation_title = conv_members.group == 'yes' ? conv_members.title : data.sender_name;
                                            var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : data.sender_img;

                                            _.forEach(memberlistUUID, function(mv, mk) {
                                                if (temp.indexOf(mv.toString()) == -1) {
                                                    temp.push(mv.toString());
                                                    io.to(mv.toString()).emit('groupCreate', {
                                                        room_id: result.conversation_id.toString(),
                                                        memberList: strUUID,
                                                        adminList: adminListUUID,
                                                        selectecosystem: message.selectecosystem,
                                                        teamname: message.teamname,
                                                        grpprivacy: message.grpprivacy,
                                                        conv_img: message.conv_img,
                                                        createdby: message.createdby_name,
                                                        createdbyid: message.createdby,
                                                        msg_id: res.data.msg_id,
                                                        sender_img: message.conv_img,
                                                        sender_name: message.teamname,
                                                        memberList_name: str,
                                                        root_conv_id: root_conv_id
                                                    });
                                                    io.to(mv.toString()).emit('newMessage', { status: true, msg: res.data, conversation_type, conversation_title, conversation_img });
                                                    send_msg_firebase(mv.toString(), { status: true, msg: res.data, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                                }
                                            });
                                            if (message.guest_member_ids !== undefined && message.guest_member_ids != '') {
                                                var ids = message.guest_member_ids.split(";");
                                                for (var n = 0; n < ids.length; n++) {
                                                    var guest = await signup_utils.send_invitation_to_join_room({ conversation_id: data.conversation_id, id: ids[n], room_name: message.teamname, sender_name: message.createdby_name });
                                                }
                                            }
                                            callback(result);
                                        }
                                    })
                                    // sendNewMsg(io, socket, message.createdby,
                                    //   message.conv_img, message.teamname, result.conversation_id.toString(),
                                    //   'Welcome to '+message.teamname+' room', [], null, null,
                                    //   null, null, null, null, null, (replywelmsg, errwelmsg) => {
                                    //     if(errwelmsg) { console.log("something wrong in default msg send"); callback(result);}
                                    //     console.log(748, replywelmsg.msg.msg_id);
                                    //     socket.broadcast.emit('groupCreate', {
                                    //       room_id: result.conversation_id.toString(),
                                    //       memberList: strUUID,
                                    //       adminList: adminListUUID,
                                    //       selectecosystem: message.selectecosystem,
                                    //       teamname: message.teamname,
                                    //       grpprivacy: message.grpprivacy,
                                    //       conv_img: message.conv_img,
                                    //       createdby: message.createdby_name,
                                    //       createdbyid: message.createdby,
                                    //       msg_id: replywelmsg.msg.msg_id,
                                    //       sender_img: message.conv_img,
                                    //       sender_name: message.teamname,
                                    //       memberList_name: str
                                    //     });
                                    //     callback(result);
                                    // });
                            }
                            callback(result);
                        } else {
                            console.log(674, result);
                        }
                    }
                });
            }
        });

        socket.on('groupMemberAdd', function(message, callback) {
            socket.broadcast.emit('groupCreate', {
                room_id: message.room_id,
                memberList: message.memberList,
                selectecosystem: message.selectecosystem,
                teamname: message.teamname,
                grpprivacy: message.grpprivacy,
                createdby: message.createdby_name,
                createdbyid: message.createdby,
                targetID: message.targetID,
                root_conv_id: message.root_conv_id
            });
        });

        socket.on('restrictColumn', function(message, callback) {
            socket.broadcast.emit('restrictColumnBrd', {
                rootid: message.rootid,
                status: message.status
            });
        });

        socket.on('restrictView', function(message, callback) {
            socket.broadcast.emit('restrictViewBrd', {
                viewid: message.viewid,
                status: message.status
            });
        });

        socket.on('groupMemberDelete', function(message, callback) {
            signup_utils.remove_invite_link({ conversation_id: message.room_id, invite_to: message.targetID });
            socket.broadcast.emit('removefromGroup', {
                room_id: message.room_id,
                memberList: message.memberList,
                selectecosystem: message.selectecosystem,
                teamname: message.teamname,
                grpprivacy: message.grpprivacy,
                createdby: message.createdby_name,
                createdbyid: message.createdby,
                targetID: message.targetID,
                participants: message.participants,
                adminArra: message.adminArra,
                conv_data: message.conv_data,
                root_conv_id: message.root_conv_id,
                root_conv: message.root_conv

            });
        });

        socket.on('client_typing', function(message) {
            // console.log('line 112 room_id= ', message.room_id);
            // console.log('line 113 sender_id= ', message.sender_id);
            // console.log('line 114 conversation_id ', message.conversation_id);
            if (message.room_id == message.sender_id) {
                // io.to(message.conversation_id).emit('server_typing_emit', { display: message.display, room_id: message.room_id, sender_id: message.sender_id, img: message.sender_img, name: message.sender_name, conversation_id: message.conversation_id, msg_id: message.msg_id, reply: message.reply });
                socket.broadcast.emit('server_typing_emit', { display: message.display, room_id: message.room_id, sender_id: message.sender_id, img: message.sender_img, name: message.sender_name, conversation_id: message.conversation_id, msg_id: message.msg_id, reply: message.reply });
            } else {
                // io.to(message.room_id).emit('server_typing_emit', { display: message.display, room_id: message.room_id, sender_id: message.sender_id, img: message.sender_img, name: message.sender_name, conversation_id: message.conversation_id, msg_id: message.msg_id, reply: message.reply });
                socket.broadcast.emit('server_typing_emit', { display: message.display, room_id: message.room_id, sender_id: message.sender_id, img: message.sender_img, name: message.sender_name, conversation_id: message.conversation_id, msg_id: message.msg_id, reply: message.reply });
            }
            // socket.broadcast.emit('typingBroadcast', {display: message.display, msgsenderroom: message.sendto, img: message.sender_img, name: message.sender_name});
        });

        socket.on('emoji_emit', function(data) {
            add_activity({
                type: data.type + 'emoji', 
                title: data.user_fullname + ' ' + data.type + ' a reaction.', 
                body: {msg_id: data.msgid, conversation_id: data.conversation_id, emoji_name: data.emoji_name, src: data.src}, 
                receive_users: data.participants, 
                created_by: data.sender_id, 
                created_by_name: data.user_fullname, 
                created_by_img: data.user_img, 
                company_id: data.company_id});
            socket.broadcast.emit('emoji_on_emit', data);
        });

        socket.on('group_join', function(group) {
            socket.join(group.group_id);
        });


        /***********************************************************************/
        /***********************************************************************/
        socket.on('get_conversation_history', function(data, callback) {
            socket.join(data.conversationid)
            hayvenjs.get_conversation(data, (demodata) => {
                callback(demodata);
            });
        });
        socket.on('get_conversation_history_thread', function(data, callback) {
            hayvenjs.get_conversation_thread(data, (demodata) => {
                callback(demodata);
            });
        });
        socket.on('get_conversation_history_secret', function(data, callback) {
            hayvenjs.get_conversation_secret(data, (demodata) => {
                callback(demodata);
            });
        });

        socket.on('load_older_msg', function(data, callback) {
            hayvenjs.get_old_msg(data, (data_rep) => {
                callback(data_rep);
            });
        });

        // Sample socket for checking
        // Also use in android side. So if any change, please also knock to API team.
        // socket.emit("call_history", {conversation_id: "24dd858a-525f-40ef-9e7a-ca07b72a31a5"}, (res)=>{console.log(res)});
        socket.on('call_history', function(data, callback) {
            // hayvenjs.call_history(data, (data_rep) => {
            //   callback(data_rep);
            // });
            findCallsByConversation(data.conversation_id, (result, err) => {
                if (result.status)
                    callback({ status: true, res_text: "Success", data: result.conv_data });
                else
                    callback({ status: false, res_text: "Connection error. Please try again.", err: result });
            });
        });

        // Get all public rooms from db where workspace define
        socket.on('public_conversation_history', function(data, callback) {
            hayvenjs.public_conversation(data, (demodata) => {
                callback(demodata);
            });
        });

        // Get all public rooms from db where workspace define
        socket.on('myTopicList', function(data, callback) {
            hayvenjs.myTopicList(data, (demodata) => {
                callback(demodata);
            });
        });

        socket.on('updateKeySpace', function(message, callback) {
            if (message.conversation_id != "") {
                updateKeySpace(message.conversation_id, message.keySpace, message.user_id, message.company_id, (result, err) => {
                    if (err) {
                        throw err;
                    } else {
                        callback(result);
                    }
                });
            }
        });


        socket.on('updatePrivecy', function(message, callback) {
            if (message.conversation_id != "") {
                updatePrivecy(message.conversation_id, message.grpprivacy, message.user_id, message.company_id, (result, err) => {
                    if (err) {
                        throw err;
                    } else {
                        socket.broadcast.emit('updateRoomPrivecy', message);
                        callback(result);
                    }
                });
            }
        });

        socket.on('updateRoomimg', function(message, callback) {
            if (message.conversation_id != "") {
                updateRoomimg(message.conversation_id, message.conv_img, message.user_id, message.company_id, (result, err) => {
                    if (err) {
                        throw err;
                    } else {
                        callback(result);
                    }
                });
            }
        });

        socket.on('submit_url', function(data, callback) {
            create_conv_link(data, function(res) {
                callback(res);
            })
        });

        socket.on('allow_covid_survey', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$add': [1700] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });
        });
        socket.on('deny_covid_survey', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$remove': [1700] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });
        });
        // ===========================
        socket.on('allow_covid_admin', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$add': [1701] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$remove': [1702] },
            }, update_if_exists, function(err) {
                // if(err) callback(false);
                // else callback(true);

            });
        });
        socket.on('deny_covid_admin', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$remove': [1701] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });
        });
        // ========================
        socket.on('allow_covid_stuff', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$add': [1702] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$remove': [1701] },
            }, update_if_exists, function(err) {
                // if(err) callback(false);
                // else callback(true);

            });
        });
        socket.on('deny_covid_stuff', function(data, callback) {
            console.log(data);
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, {
                access: { '$remove': [1702] },
            }, update_if_exists, function(err) {
                if (err) callback(false);
                else callback(true);

            });

        });

        socket.on('msg_ack', function(ack) {
            // console.log(1492, ack);
            remove_buffer(ack);
        });

        socket.on('check_in_buffer', function(data, callback) {
            // console.log(1431, free_buffer);
            var return_status = false;
            console.log(1439, free_buffer.hasOwnProperty(data.user_id));
            if (free_buffer.hasOwnProperty(data.user_id)) {
                console.log(1441);
                var _buffer = free_buffer[data.user_id];
                _.each(_buffer, function(v, k) {
                    console.log(1444, v.session_id && v.session_id.indexOf(data.session_id) > 0, data.user_id);
                    if (v.session_id && v.session_id.indexOf(data.session_id) !== -1) {
                        return_status = true;
                        io.to(data.user_id).emit('newMessage', v.msg);
                    }
                });
            }
            callback({ status: return_status, free_buffer });
        });

        socket.on('send_message', async function(message) {
            // if(socket.handshake.session.login === true){
            // console.log(1165, socket.handshake.session.login);
            // console.log(1038,'=======================>', message);
            var allLink = message.allLink;
            var senderid = message.sender;
            if (senderid == undefined) {
                senderid = socket.handshake.session.userdata.from;
            }
            // console.log(881,message.sender);
            // console.log(882,socket.handshake.session.userdata.from);
            var old_created_time = null;
            var last_update_user = null;

            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            var conv_members = await room_members(message.conversation_id, socket.handshake.session.userdata.from);
            if (conv_members.participants.length > 0) {
                if (message.is_room === false) {
                    if (message.has_reply == undefined) {
                        message.has_reply = 0;
                    }
                    if (message.rep_id == undefined) {
                        message.rep_id = null;
                    }

                    var paramsData = {
                        io: io,
                        socket: socket,
                        from: senderid,
                        sender_img: message.sender_img,
                        sender_name: message.sender_name,
                        conversation_id: message.conversation_id,
                        msg: message.text,
                        attachment: message.attach_files,
                        timer: message.has_timer,
                        old_created_time: old_created_time,
                        last_update_user: last_update_user,
                        updatedMsgid: '',
                        tag_list: message.tag_list,
                        has_reply: message.has_reply,
                        rep_id: message.rep_id,
                        service_provider: message.selectedSp,
                        mention_user: message.mention_user,
                        has_flagged: ((message.has_flagged != undefined) ? message.has_flagged : [])
                    }

                    sendNewMsg(paramsData, (result, err) => {
                        if (err) {
                            console.log(72, err);
                        } else {
                            if (result.status) {

                                if (allLink != null) {
                                    if (allLink.length > 0) {
                                        var allvalidLink = [];
                                        _.each(allLink, function(v, k) {
                                            if (allvalidLink.indexOf(v) == -1) {
                                                allvalidLink.push(v);
                                            }
                                        });
                                        if (allvalidLink.length > 0) {
                                            var linkdata = {
                                                msg_id: result.msg.msg_id.toString(),
                                                url_list: allvalidLink,
                                                conversation_id: message.conversation_id,
                                                user_id: message.user_id,
                                                secret_user: []
                                            }
                                            console.log(1363, linkdata);
                                            create_conv_link(linkdata, function(res) {
                                                console.log(3147, res);
                                            })
                                        }
                                    }
                                }

                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    let ack_id = models.timeuuid();
                                    result.ack_id = ack_id;

                                    io.to(conv_members.participants[n]).emit('newMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                                    add2buffer({ msg: result, user_id: conv_members.participants[n] });
                                }
                                console.log(1504, free_buffer);

                                if (result.unreadChecklist !== undefined) {
                                    if (result.unreadChecklist) {
                                        socket.broadcast.emit('unreadChecklist', result);
                                    }
                                }
                            } else {
                                console.log(result);
                            }
                        }
                    });
                } else if (message.is_room === true) {
                    // console.log('something wrong!!!');
                    // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
                    // This is temporary group message.
                    var old_created_time = null;
                    var last_update_user = null;

                    if (message.old_created_time != undefined) {
                        old_created_time = message.old_created_time;
                    }
                    if (message.last_update_user != undefined) {
                        last_update_user = message.last_update_user
                    }
                    if (message.has_reply == undefined) {
                        message.has_reply = 0;
                    }
                    if (message.rep_id == undefined) {
                        message.rep_id = null;
                    }
                    var paramsData = {
                        io: io,
                        socket: socket,
                        from: senderid,
                        sender_img: message.sender_img,
                        sender_name: message.sender_name,
                        conversation_id: message.conversation_id,
                        msg: message.text,
                        attachment: message.attach_files,
                        timer: message.has_timer,
                        old_created_time: old_created_time,
                        last_update_user: last_update_user,
                        updatedMsgid: '',
                        tag_list: message.tag_list,
                        has_reply: message.has_reply,
                        rep_id: message.rep_id,
                        service_provider: message.selectedSp,
                        mention_user: message.mention_user,
                        has_flagged: ((message.has_flagged != undefined) ? message.has_flagged : [])
                    }
                    sendNewMsg(paramsData, (result, err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result.status) {

                                if (allLink != null) {
                                    if (allLink.length > 0) {
                                        var allvalidLink = [];
                                        _.each(allLink, function(v, k) {
                                            if (allvalidLink.indexOf(v) == -1) {
                                                allvalidLink.push(v);
                                            }
                                        });
                                        if (allvalidLink.length > 0) {
                                            var linkdata = {
                                                msg_id: result.msg.msg_id.toString(),
                                                url_list: allvalidLink,
                                                conversation_id: message.conversation_id,
                                                user_id: message.user_id,
                                                secret_user: []
                                            }
                                            console.log(1449, linkdata);
                                            create_conv_link(linkdata, function(res) {
                                                console.log(3147, res);
                                            })
                                        }
                                    }
                                }

                                result.msg['checklist'] = result.checklist;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                                    if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                                        let act_id = models.uuid();
                                        result.act_id = act_id;
                                        // add2buffer({act_id: act_id, user_id: conv_members.participants[n], msg: result.msg}, io);
                                        io.to(conv_members.participants[n]).emit('newMessage', result);
                                        send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                                    }
                                }
                                // socket.broadcast.emit('newMessage', result); // this emit receive all users except me
                                //io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                // io.to(socket.handshake.session.userdata.from.toString()).emit('message_sent', result);

                                if (message.attach_files !== undefined) {
                                    filesTag(result.msg.msg_id, message.conversation_id, socket.handshake.session.userdata.from, message.tags, (response, err) => {
                                        if (err) {
                                            console.log(998, err);
                                        } else {
                                            if (socket.handshake.session.userdata.from && socket.handshake.session.userdata.from.toString() !== message.to.toString()) {
                                                let act_id = models.uuid();
                                                result.act_id = act_id;
                                                // add2buffer({act_id: act_id, user_id: message.to, msg: result.msg}, io);

                                                io.to(message.to).emit('newMessage', result);
                                                send_msg_firebase(message.to, result, 'newMessage');
                                            }
                                            // io.to(socket.handshake.session.userdata.from.toString()).emit('message_sent', {msg:result.msg,tagmsgid:response.id});
                                            result.tagmsgid = response.id;
                                            let act_id = models.uuid();
                                            result.act_id = act_id;
                                            // add2buffer({act_id: act_id, user_id: socket.handshake.session.userdata.from.toString(), msg: result.msg}, io);

                                            io.to(socket.handshake.session.userdata.from.toString()).emit('newMessage', result);
                                            send_msg_firebase(socket.handshake.session.userdata.from.toString(), result, 'newMessage');
                                        }
                                    });
                                } else {
                                    let act_id = models.uuid();
                                    result.act_id = act_id;
                                    // add2buffer({act_id: act_id, user_id: socket.handshake.session.userdata.from.toString(), msg: result.msg}, io);

                                    io.to(socket.handshake.session.userdata.from.toString()).emit('newMessage', result);
                                    send_msg_firebase(socket.handshake.session.userdata.from.toString(), result, 'newMessage');
                                }

                                if (result.unreadChecklist !== undefined) {
                                    if (result.unreadChecklist) {
                                        socket.broadcast.emit('unreadChecklist', result);
                                    }
                                }

                            } else {
                                console.log(result);
                            }
                        }
                    });
                }
            } else {
                console.log("send_message no participants found");
            }
        });

        socket.on('topicTagItemSocket', function(data, callback) {
            if (data.topicItem != "") {
                topicTag(data.fromAddTopic, data.fromAddmsgid, data.topicItem, data.created_by, data.conversation_id, (result) => {
                    callback({
                        status: result
                    });
                });
            }
        });

        socket.on('topicMessageTagSocket', function(data, callback) {
            if (data.topicItem != "") {
                TopicMessagesTag(data.message_id, data.conversation_id, data.tagged_by, data.tag_title, (result) => {
                    callback({
                        status: result
                    });
                });
            }
        });

        socket.on('topicTagItemDeleteSocket', function(data, callback) {
            if (data.conversation_id != "") {
                topicTagItemDelete(data.tagid, data.title, data.conversation_id, (result) => {
                    callback({
                        status: result
                    });
                });
            }
        });

        socket.on('saveTag', function(message, callback) {
            if (message.currentConvID != "") {
                saveTag(message.msgIdsFtag, message.conversation_id, message.messgids, message.created_by, message.tagTitle, message.tagType, (result, err) => {
                    if (err) {
                        throw err;
                    } else {
                        saveConTag(result.tags, message.conversation_id, (cresult, cerr) => {
                            if (err) {
                                throw err;
                            } else {
                                if (cresult.status) {
                                    callback({
                                        status: true,
                                        tags: cresult.tags,
                                        roottags: cresult.roottags,
                                        mtagsid: result.mtagsid
                                    });
                                } else {
                                    callback({
                                        status: false
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });


        socket.on('saveConvTag', function(message, callback) {
            saveConvD(message.msgIdsFtag, message.tagtile, message.tagid, message.conversation_id, (cresult, cerr) => {
                if (cerr) {
                    throw cerr;
                } else {
                    callback(cresult);
                }
            });
        });

        socket.on('taggedFilterData', function(message, callback) {
            taggedFilterUtils(message.taggedby, message.tagarr, (result, err) => {
                if (err) {
                    throw err;
                } else {
                    callback(result);
                }
            });
        });

        socket.on('taggedData', function(message, callback) {
            getAllTagData(message.tagid, (result, err) => {
                if (err) {
                    throw err;
                } else {
                    callback(result);
                }
            });
        });

        socket.on('send_rep_message', async function(message) {
            console.log(1341, message);
            var old_created_time = null;
            var last_update_user = null;

            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            if (message.has_reply == undefined) {
                message.has_reply = 0;
            }
            if (message.rep_id == undefined) {
                message.rep_id = null;
            }
            var conv_members = await room_members(message.thread_root_id, socket.handshake.session.userdata.from);
            var paramsData = {
                io: io,
                socket: socket,
                from: socket.handshake.session.userdata.from,
                sender_img: message.sender_img,
                sender_name: message.sender_name,
                conversation_id: message.conversation_id,
                msg: message.text,
                attachment: message.attach_files,
                timer: message.has_timer,
                old_created_time: old_created_time,
                last_update_user: last_update_user,
                updatedMsgid: '',
                tag_list: message.tag_list,
                has_reply: message.has_reply,
                rep_id: message.rep_id,
                service_provider: message.selectedSp,
                root_conv_id: message.thread_root_id,
                root_msg_id: message.thread_root_id
            }
            if (conv_members.participants.length > 0) {
                if (message.is_room === false) {
                    // console.log(1378, paramsData)
                    sendNewMsg(paramsData, (result, err) => {
                        if (err) {
                            console.log(72, err);
                        } else {
                            if (result.status) {
                                console.log(1652, result);
                                console.log(1652, message.allLink);

                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newRepMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newRepMessage');
                                }
                                var allLink = message.allLink;
                                if (allLink != null) {
                                    if (allLink.length > 0) {
                                        var allvalidLink = [];
                                        _.each(allLink, function(v, k) {
                                            if (allvalidLink.indexOf(v) == -1) {
                                                allvalidLink.push(v);
                                            }
                                        });
                                        if (allvalidLink.length > 0) {
                                            var linkdata = {
                                                msg_id: result.msg.msg_id.toString(),
                                                url_list: allvalidLink,
                                                conversation_id: message.thread_root_id.toString(),
                                                user_id: message.user_id,
                                                root_conv_id: message.conversation_id.toString()
                                            }
                                            console.log(1363, '=========================================>', linkdata);
                                            create_conv_link(linkdata, function(res) {
                                                console.log(3147, res);
                                            })
                                        }
                                    }
                                }
                            } else {
                                console.log(result);
                            }
                        }
                    });
                } else if (message.is_room === true) {
                    console.log(1397)
                        // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
                        // This is temporary group message.
                    var old_created_time = null;
                    var last_update_user = null;

                    if (message.old_created_time != undefined) {
                        old_created_time = message.old_created_time;
                    }
                    if (message.last_update_user != undefined) {
                        last_update_user = message.last_update_user
                    }
                    if (message.has_reply == undefined) {
                        message.has_reply = 0;
                    }
                    if (message.rep_id == undefined) {
                        message.rep_id = null;
                    }
                    if (message.secret_user.length > 0) {
                        console.log(1416)
                        var data = {
                            type: 'secret_msg',
                            sender: socket.handshake.session.userdata.from.toString(),
                            sender_name: message.sender_name,
                            sender_img: message.sender_img,
                            conversation_id: message.conversation_id,
                            msg_type: 'text',
                            msg_body: message.text,
                            secret_user: message.secret_user,
                            msg_status: message.msg_status,
                            attach_files: message.attach_files,
                            root_conv_id: message.thread_root_id,
                            is_secret: true

                        }



                        send_notification_msg(data, function(result) {
                            if (result.status) {
                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.data);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                result['status'] = true;
                                result['msg'] = result.data;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.data.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.data.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newRepMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newRepMessage');
                                }
                                var allLink = message.allLink;
                                if (allLink != null) {
                                    if (allLink.length > 0) {
                                        var allvalidLink = [];
                                        _.each(allLink, function(v, k) {
                                            if (allvalidLink.indexOf(v) == -1) {
                                                allvalidLink.push(v);
                                            }
                                        });
                                        if (allvalidLink.length > 0) {
                                            var linkdata = {
                                                msg_id: result.msg.msg_id.toString(),
                                                url_list: allvalidLink,
                                                conversation_id: message.thread_root_id.toString(),
                                                user_id: message.user_id,
                                                root_conv_id: message.conversation_id.toString()
                                            }
                                            console.log(1363, '=========================================>', linkdata);
                                            create_conv_link(linkdata, function(res) {
                                                console.log(3147, res);
                                            })
                                        }
                                    }
                                }
                                // io.to(message.conversation_id).emit('newRepMessage', result);
                                // socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me
                                // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                // io.to(socket.handshake.session.userdata.from.toString()).emit('newRepMessage', result);
                            }
                        })
                    } else {
                        console.log(1446)
                        var paramsData = {
                            io: io,
                            socket: socket,
                            from: socket.handshake.session.userdata.from,
                            sender_img: message.sender_img,
                            sender_name: message.sender_name,
                            conversation_id: message.conversation_id,
                            msg: message.text,
                            attachment: message.attach_files,
                            timer: message.has_timer,
                            old_created_time: old_created_time,
                            last_update_user: last_update_user,
                            updatedMsgid: '',
                            tag_list: message.tag_list,
                            has_reply: message.has_reply,
                            rep_id: message.rep_id,
                            service_provider: message.selectedSp,
                            root_conv_id: message.thread_root_id,
                            root_msg_id: message.thread_root_id
                        }
                        sendNewMsg(paramsData, (result, err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (result.status) {

                                    // bellow 1st line use for make the conversation in top, when user send a reply
                                    update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                    result['root_conv_id'] = message.thread_root_id;
                                    result['root_msg_id'] = message.root_msg_id;

                                    result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                    result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                    result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;

                                    for (var n = 0; n < conv_members.participants.length; n++) {
                                        io.to(conv_members.participants[n]).emit('newRepMessage', result);
                                        send_msg_firebase(conv_members.participants[n], result, 'newRepMessage');
                                    }

                                    var allLink = message.allLink;
                                    if (allLink != null) {
                                        if (allLink.length > 0) {
                                            var allvalidLink = [];
                                            _.each(allLink, function(v, k) {
                                                if (allvalidLink.indexOf(v) == -1) {
                                                    allvalidLink.push(v);
                                                }
                                            });
                                            if (allvalidLink.length > 0) {
                                                var linkdata = {
                                                    msg_id: result.msg.msg_id.toString(),
                                                    url_list: allvalidLink,
                                                    conversation_id: message.thread_root_id.toString(),
                                                    user_id: message.user_id,
                                                    root_conv_id: message.conversation_id.toString()
                                                }
                                                console.log(1363, '=========================================>', linkdata);
                                                create_conv_link(linkdata, function(res) {
                                                    console.log(3147, res);
                                                })
                                            }
                                        }
                                    }
                                    // io.to(message.conversation_id).emit('newRepMessage', result);
                                    // socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me
                                    // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                    // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                    // io.to(socket.handshake.session.userdata.from.toString()).emit('newRepMessage', result);
                                } else {
                                    console.log(result);
                                }
                            }
                        });
                    }
                }
            }
        });

        socket.on('send_rep_message_call', async function(message, callback) {
            var user_from = message.user_id;
            if (!user_from) return;
            var old_created_time = null;
            var last_update_user = null;

            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            if (message.has_reply == undefined) {
                message.has_reply = 0;
            }
            if (message.rep_id == undefined) {
                message.rep_id = null;
            }
            var conv_members = await room_members(message.thread_root_id, socket.handshake.session.userdata.from);
            var paramsData = {
                io: io,
                socket: socket,
                from: socket.handshake.session.userdata.from,
                sender_img: message.sender_img,
                sender_name: message.sender_name,
                conversation_id: message.conversation_id,
                msg: message.text,
                attachment: message.attach_files,
                timer: message.has_timer,
                old_created_time: old_created_time,
                last_update_user: last_update_user,
                updatedMsgid: '',
                tag_list: message.tag_list,
                has_reply: message.has_reply,
                rep_id: message.rep_id,
                service_provider: message.selectedSp,
                root_conv_id: message.thread_root_id,
                root_msg_id: message.thread_root_id
            }
            if (conv_members.participants.length > 0) {
                if (message.is_room === false) {
                    sendNewMsg(paramsData, async(result, err) => {
                        if (err) {
                            console.log(72, err);
                        } else {
                            if (result.status) {
                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                result.user_id = message.user_id;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;

                                var room = await get_kurentoroom(message.thread_root_id);
                                if (room) {
                                    for (let i in room.participants) {
                                        if (room.participants.hasOwnProperty(i)) {
                                            io.to(room.participants[i].user_id).emit('newRepMessage', result);
                                            send_msg_firebase(room.participants[i].user_id, result, 'newRepMessage');
                                        }
                                    }
                                }
                                callback(room);
                            } else {
                                console.log(result);
                            }
                        }
                    });
                } else if (message.is_room === true) {
                    // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
                    // This is temporary group message.
                    var old_created_time = null;
                    var last_update_user = null;

                    if (message.old_created_time != undefined) {
                        old_created_time = message.old_created_time;
                    }
                    if (message.last_update_user != undefined) {
                        last_update_user = message.last_update_user
                    }
                    if (message.has_reply == undefined) {
                        message.has_reply = 0;
                    }
                    if (message.rep_id == undefined) {
                        message.rep_id = null;
                    }
                    if (message.secret_user.length > 0) {
                        var data = {
                            type: 'secret_msg',
                            sender: socket.handshake.session.userdata.from.toString(),
                            sender_name: message.sender_name,
                            sender_img: message.sender_img,
                            conversation_id: message.conversation_id,
                            msg_type: 'text',
                            msg_body: message.text,
                            secret_user: message.secret_user,
                            msg_status: message.msg_status,
                            attach_files: message.attach_files

                        }

                        send_notification_msg(data, async function(result) {
                            if (result.status) {
                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.data);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                result.user_id = message.user_id;
                                result['status'] = true;
                                result['msg'] = result.data;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.data.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.data.sender_img;

                                // socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me
                                // // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                // // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                // io.to(socket.handshake.session.userdata.from.toString()).emit('newRepMessage', result);

                                var room = await get_kurentoroom(message.thread_root_id);
                                if (room) {
                                    for (let i in room.participants) {
                                        if (room.participants.hasOwnProperty(i)) {
                                            io.to(room.participants[i].user_id).emit('newRepMessage', result);
                                            send_msg_firebase(room.participants[i].user_id, result, 'newRepMessage');
                                        }
                                    }
                                }
                                callback(room);

                            }
                        })
                    } else {
                        var paramsData = {
                            io: io,
                            socket: socket,
                            from: socket.handshake.session.userdata.from,
                            sender_img: message.sender_img,
                            sender_name: message.sender_name,
                            conversation_id: message.conversation_id,
                            msg: message.text,
                            attachment: message.attach_files,
                            timer: message.has_timer,
                            old_created_time: old_created_time,
                            last_update_user: last_update_user,
                            updatedMsgid: '',
                            tag_list: message.tag_list,
                            has_reply: message.has_reply,
                            rep_id: message.rep_id,
                            service_provider: message.selectedSp,
                            root_conv_id: message.thread_root_id,
                            root_msg_id: message.thread_root_id
                        }
                        sendNewMsg(paramsData, async(result, err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (result.status) {
                                    // bellow 1st line use for make the conversation in top, when user send a reply
                                    update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                    result['root_conv_id'] = message.thread_root_id;
                                    result['root_msg_id'] = message.root_msg_id;
                                    result.user_id = message.user_id;
                                    result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                    result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                    result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;

                                    var room = await get_kurentoroom(message.thread_root_id);
                                    if (room) {
                                        for (let i in room.participants) {
                                            if (room.participants.hasOwnProperty(i)) {
                                                io.to(room.participants[i].user_id).emit('newRepMessage', result);
                                                send_msg_firebase(room.participants[i].user_id, result, 'newRepMessage');
                                            }
                                        }
                                    }
                                    callback(room);

                                    // socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me
                                    // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                    // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                    // io.to(socket.handshake.session.userdata.from.toString()).emit('newRepMessage', result);
                                } else {
                                    console.log(result);
                                }
                            }
                        });
                    }
                }
            }
        });

        socket.on('send_rep_message_mobile', async function(message) {
            if (message.item_title !== undefined) {
                message.text = '<p class="thread_chk_item">' + message.item_title + ':</p>' + message.text;
            }
            var old_created_time = null;
            var last_update_user = null;
            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            if (message.has_reply == undefined) {
                message.has_reply = 0;
            }
            if (message.rep_id == undefined) {
                message.rep_id = null;
            }
            if (message.thread_root_id == undefined) {
                message.thread_root_id = message.to;
            }
            console.log(1714, message);
            var conv_members = await room_members(message.thread_root_id, message.sender_id);
            if (conv_members.participants.length > 0) {
                if (message.is_room === false) {
                    var paramsData = {
                        io: io,
                        socket: socket,
                        from: message.sender_id,
                        sender_img: message.sender_img,
                        sender_name: message.sender_name,
                        conversation_id: message.conversation_id,
                        msg: message.text,
                        attachment: message.attach_files,
                        timer: message.has_timer,
                        old_created_time: old_created_time,
                        last_update_user: last_update_user,
                        updatedMsgid: '',
                        tag_list: message.tag_list,
                        has_reply: message.has_reply,
                        rep_id: message.rep_id,
                        service_provider: message.selectedSp,
                        root_conv_id: message.thread_root_id,
                        root_msg_id: message.root_msg_id

                    }
                    sendNewMsg(paramsData, (result, err) => {
                        if (err) {
                            console.log('send_rep_message 756', err);
                        } else {
                            if (result.status) {
                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                // socket.broadcast.emit('newRepMessage', result);
                                // io.to(message.sender_id).emit('newRepMessage', result);
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newRepMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newRepMessage');
                                }
                            } else {
                                console.log(768, result);
                            }
                        }
                    });
                } else if (message.is_room === true) {
                    // io.to('navigate_2018_902770').emit('newMessage', generateMessage(socket.handshake.session.userdata.from, message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img));
                    // This is temporary group message.

                    if (message.has_reply == undefined) {
                        message.has_reply = 0;
                    }
                    if (message.rep_id == undefined) {
                        message.rep_id = null;
                    }
                    var paramsData = {
                        io: io,
                        socket: socket,
                        from: message.sender_id,
                        sender_img: message.sender_img,
                        sender_name: message.sender_name,
                        conversation_id: message.conversation_id,
                        msg: message.text,
                        attachment: message.attach_files,
                        timer: message.has_timer,
                        old_created_time: old_created_time,
                        last_update_user: last_update_user,
                        updatedMsgid: '',
                        tag_list: message.tag_list,
                        has_reply: message.has_reply,
                        rep_id: message.rep_id,
                        service_provider: message.selectedSp,
                        root_conv_id: message.thread_root_id,
                        root_msg_id: message.root_msg_id
                    }
                    sendNewMsg(paramsData, (result, err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result.status) {
                                // bellow 1st line use for make the conversation in top, when user send a reply
                                update_conversation(models.uuidFromString(message.thread_root_id), result.msg);
                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newRepMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newRepMessage');
                                }
                                // socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me
                                // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                                // io.to(message.sender_id).emit('newRepMessage', result);
                                if (result.unreadChecklist !== undefined) {
                                    if (result.unreadChecklist) {
                                        socket.broadcast.emit('unreadChecklist', result);
                                    }
                                }
                            } else {
                                console.log(result);
                            }
                        }
                    });
                }
            } else {
                console.log("send_rep_message_mobile error, no members found");
            }
        });

        socket.on('all_unread_msg', function(data, callback) {
            // getAllUnreadConv(data.my_all_conv, socket.handshake.session.userdata.from, function (repdata, error) {
            count_unread(data.my_all_conv, socket.handshake.session.userdata.from, function(repdata, error) {
                if (repdata.status)
                    callback(repdata.data);
                else
                    callback(error);
            });
        });

        socket.on('add_delivered_if_need', function(data) {
            update_delivered_if_need(data, function(delidata, error) {
                if (delidata.status)
                    socket.broadcast.emit('get_delivered_notification', delidata.msgs);
                else
                    console.log(1136, delidata.status, error);
            });
        });

        socket.on('getAllDataForSearch', function(data, callback) {
            getAllSearchMsg(data.conversation_list, data.target_text, data.target_filter, data.user_id, (result, error) => {
                if (result.status) {
                    callback({ status: result.status, data: result.data });
                } else {
                    callback({ status: result.status, data: result.error });
                }
            });
        });
        socket.on('getAllDataForTag', function(data, callback) {
            getAllDataForTag(data, (result, error) => {
                if (result.status) {
                    callback({ status: result.status, data: result.data });
                } else {
                    callback({ status: result.status, data: result.error });
                }
            });
        });

        socket.on('get_one_msg_info', function(data, callback) {
            get_one_msg(data, (result, error) => {
                if (result.status) {
                    callback(result.msg);
                } else {
                    console.log(error);
                    callback(result);
                }
            });
        });

        socket.on('getAllTagsforList', function(data, callback) {
            getAllTagsforList(data.myconversation_list, (result, error) => {
                if (result.status) {
                    var tagsIDS = [];
                    _.each(result.data, function(v, k) {
                        if (v.length > 0) {
                            _.each(v, function(vt, kt) {
                                if (tagsIDS.indexOf(vt.tag_id.toString()) === -1) {
                                    tagsIDS.push(vt.tag_id.toString());
                                }
                            });
                        }
                    });
                    callback({ status: result.status, data: tagsIDS });
                } else {
                    callback({ status: result.status, data: result.error });
                }
            });
        });

        socket.on('deleteUnusedTag', function(data, callback) {
            if (data.tagid != undefined && data.tagid != "") {
                deleteUnusedTag(data.tagid, data.convid, data.tagTitle, data.type, (respond, error) => {
                    if (error) {
                        if (error) throw error;
                    } else if (respond.status) {
                        callback({ status: true, respond: respond });
                    } else {
                        callback({ status: false, respond: respond });
                    }
                });
            }
        });

        /***********************************************************************/
        /***********************************************************************/
        /********************    TODO SOCKET START HERE     ********************/
        /***********************************************************************/
        /***********************************************************************/

        // Create activity
        socket.on('toCreateBrdcst', function(message, callback) {
            var adminListUUID = message.adminListUUID;
            var userMsdlist = {};
            if (message.teamname !== "") {
                createActivity(message.activityType, message.activityTitle, message.activityDescription, message.createdBy, message.endTime, message.ecosystem, adminListUUID, message.todoFrom, message.todoTo, message.todoReminder, (result, err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.status) {
                            if (message.adminListUUID.length == 1) {
                                if (message.createdBy == message.adminListUUID[0]) {
                                    if (message.checklist.length > 0) {
                                        insertChecklist(message.checkedList, message.checklist, result.activity_id, message.createdBy, (res, err) => {
                                            callback({ "activityres": result, "checklist": res });
                                        });
                                    } else {
                                        callback({ "activityres": result });
                                    }
                                }
                            } else {
                                todo_msg.send_acceptance(result.activity_id.toString(), message, message.byname, message.byImg, (msgsend) => {
                                    _.forEach(msgsend, function(v, k) {
                                        io.to(v.uid).emit('newMessage', v);
                                        send_msg_firebase(v.uid, v, 'newMessage');
                                        io.to(v.uid).emit('addTnTodo', {
                                            by: message.byname,
                                            title: message.activityTitle,
                                            sender: message.byUsrID,
                                            activity_id: result.activity_id,
                                            msg_id: v.msg.msg_id.toString(),
                                            conversation_id: v.msg.conversation_id.toString()
                                        });
                                        userMsdlist[v.uid] = v.msg.msg_id.toString();
                                    });

                                    if (message.checklist.length > 0) {
                                        insertChecklist(message.checkedList, message.checklist, result.activity_id, message.createdBy, (res, err) => {
                                            socket.broadcast.emit('CreateActivityBrdcst', { status: '200', message, result, userMsdlist });
                                            callback({ "activityres": result, "checklist": res });
                                        });
                                    } else {
                                        socket.broadcast.emit('CreateActivityBrdcst', { status: '200', message, result, userMsdlist });
                                        callback({ "activityres": result });
                                    }
                                });

                            }
                        } else {
                            console.log(result);
                        }
                    }
                });
            }
        });

        socket.on('sendMsgOngroupMemberadddelete', function(message, callback) {
            var old_created_time = null;
            var last_update_user = null;

            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            if (message.type == 'add') {
                todo_msg.send_acceptance(message.activity_id, message, message.fullname, message.img, (msgsend) => {
                    _.forEach(msgsend, function(v, k) {
                        io.to(v.uid).emit('newMessage', v);
                        send_msg_firebase(v.uid, v, 'newMessage');
                        io.to(v.uid).emit('addTnTodo', {
                            by: message.fullname,
                            title: message.activityTitle,
                            sender: message.sender_id,
                            activity_id: message.activity_id,
                            msg_id: v.msg.msg_id.toString(),
                            conversation_id: v.msg.conversation_id.toString()
                        });
                    });
                    callback(msgsend);
                });
            } else if (message.type == 'delete') {
                createPersonalConv(message.createdBy, message.uuID, message.ecosystem, req.body.company_id, (res) => {
                    if (res.conversation_id != null) {
                        allActivityMsg(res.conversation_id.toString(), message.activity_id)
                            .then((response) => {
                                var msglist = _.orderBy(response.msg, ["created_at"], ["asc"]);

                                todo_msg.update_decline_toto(msglist[msglist.length - 1].conversation_id.toString(), msglist[msglist.length - 1].msg_id.toString(), message.activity_id, message.uuID, (res) => {

                                    var text = 'You are removed from Task "' + message.activityTitle + '" by ' + message.fullname;
                                    if (message.has_reply == undefined) {
                                        message.has_reply = 0;
                                    }
                                    if (message.rep_id == undefined) {
                                        message.rep_id = null;
                                    }
                                    var paramsData = {
                                        io: io,
                                        socket: socket,
                                        from: message.sender_id,
                                        sender_img: message.img,
                                        sender_name: message.fullname,
                                        conversation_id: msglist[msglist.length - 1].conversation_id.toString(),
                                        msg: message.text,
                                        attachment: undefined,
                                        timer: message.has_timer,
                                        old_created_time: old_created_time,
                                        last_update_user: last_update_user,
                                        updatedMsgid: '',
                                        tag_list: message.tag_list,
                                        has_reply: message.has_reply,
                                        rep_id: message.rep_id,
                                        service_provider: message.selectedSp
                                    }
                                    sendNewMsg(paramsData, (result, err) => {
                                        if (err) {
                                            console.log(72, err);
                                        } else {
                                            io.to(message.uuID).emit('newMessage', result);
                                            send_msg_firebase(message.uuID, result, 'newMessage');
                                            io.to(message.uuID).emit('removeFromTodo', {
                                                by: message.fullname,
                                                title: message.activityTitle,
                                                sender: message.sender_id,
                                                activity_id: message.activity_id,
                                                msg_id: msglist[msglist.length - 1].msg_id.toString(),
                                                conversation_id: msglist[msglist.length - 1].conversation_id.toString()
                                            });
                                            if (result.unreadChecklist !== undefined) {
                                                if (result.unreadChecklist) {
                                                    socket.broadcast.emit('unreadChecklist', result);
                                                }
                                            }
                                            callback(res);
                                        }
                                    });
                                });
                            }).catch((err) => {
                                console.log(err);
                            });
                    }
                });
            }
        });


        // Create activity
        socket.on('updateDraftActivity', function(message, callback) {
            var adminListUUID = message.adminListUUID;
            if (message.teamname !== "") {
                updateDraftActivity(
                    message.activityid,
                    message.clusteringkey,
                    message.activityTitle,
                    message.activityDescription,
                    message.endTime,
                    message.ecosystem,
                    adminListUUID,
                    message.todoFrom,
                    message.todoTo,
                    message.todoReminder,
                    (result, err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result.status) {
                                todo_msg.send_acceptance(message.activityid, message, socket.handshake.session.user_fullname, socket.handshake.session.user_img, (msgsend) => {
                                    _.forEach(msgsend, function(v, k) {

                                        io.to(v.uid).emit('newMessage', v);
                                        send_msg_firebase(v.uid, v, 'newMessage');
                                    });
                                });

                                callback({ "activityres": result });
                            } else {
                                console.log(result);
                            }
                        }
                    });
            }
        });

        socket.on('CreateDraftActivity', function(message, callback) {
            var adminListUUID = message.adminListUUID;
            if (message.teamname !== "") {
                draftActivity(message.activityType, message.activityTitle, message.createdBy, message.ecosystem, adminListUUID, message.status, (result, err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.status) {


                            callback({ "activityres": result });
                        } else {
                            console.log(result);
                        }
                    }
                });
            }
        });

        //Get activity details by activity ID

        socket.on('get_activity_history', function(data, callback) {

            getActivityDetail(data, (activityDetail) => {
                getChecklist(data.activity_id, (response) => {

                    get_myTags(data.activity_id, data.user_id, (tRes, Terr) => {

                        if (Terr) throw Terr;

                        var tagID = [];
                        var tags = [];
                        var condtagsid = [];

                        _.each(tRes.Ctags, function(value, key) {
                            tagID.push(value.id.toString());
                            condtagsid.push(value.tag_id.toString());
                        });

                        get_messages_tag(data.activity_id, data.user_id, (mtgsRes, mtgsErr) => {

                            if (Terr) throw Terr;

                            callback({
                                activityDetail,
                                response,
                                totalTags: tRes.tags,
                                tags: tagID,
                                condtagsid: condtagsid,
                                messagestag: mtgsRes.tags,
                                files: mtgsRes.files
                            });

                        });
                    });

                });

            });
        });

        socket.on('todochat_join', function(data, callback) {
            _.forEach(data.all_my_activity_id, function(v, k) {
                socket.join(v);
            });
            todo_msg.get_todo_unread(data.all_my_activity_id, data.user_id, (res) => {
                callback(res);
            });
        });

        socket.on('find_todo_chat_history', function(data, callback) {
            if (data.all_activity !== undefined) {
                todo_msg.get_task_subtask_msg(data, (res) => {
                    callback(res);
                });
            } else {
                todo_msg.get_todo_msg(data, (res) => {
                    callback(res);
                });
            }
        });

        socket.on('subtask_chat_history', function(data, callback) {
            todo_msg.get_todo_msg(data, (res) => {
                callback(res);
            });
        });

        socket.on('todo_send_message', function(data, callback) {
            todo_msg.save_msg(data, (res) => {
                if (data.thread_root_id == 0) {
                    if (data.attach_files !== undefined) {
                        filesTag(res.msg.msg_id, data.activity_id, socket.handshake.session.userdata.from, data.tags, (response, err) => {
                            if (err) {
                                console.log(998, err);
                            } else {
                                res.tagmsgid = response;
                                io.to(data.activity_id).emit('todo_msg_receive', res);
                                socket.broadcast.emit('todo_msg_receive_forcheck', { status: '200', res });
                            }
                        });
                    } else {
                        io.to(data.activity_id).emit('todo_msg_receive', res);
                        socket.broadcast.emit('todo_msg_receive_forcheck', { status: '200', res });
                    }
                    callback({ res, data });
                } else {
                    io.to(data.thread_root_id).emit('newRepMessage', { status: true, res, data });
                    send_msg_firebase(data.thread_root_id, { status: true, res, data }, 'newRepMessage');
                    var newdata = { activity_id: data.thread_root_id, msg_id: data.root_msg_id, last_reply_name: data.sender_name };
                    todo_msg.thread_reply_update(newdata, (result) => {
                        if (result.status) {
                            console.log('socket 1312 = ', result);
                            io.to(data.thread_root_id).emit('update_thread_counter', newdata);
                        } else {
                            console.log('socket 130', result);
                            // callback(result);
                        }
                    });
                    callback({ res, data });
                }
            });
        });

        socket.on('cokkieFilesSave', function(data, callback) {
            saveCokkeiFiles(data, (res, err) => {
                callback({ res, data });
            });
        });

        socket.on('cokkieFilesUpdate', function(data, callback) {
            UpdatecokkieFiles(data, (res, err) => {
                callback({ res, data });
            });
        });
        socket.on('update_todo_msg_status_mul', function(data) {
            todo_msg.update_mul_todomsg_status_add_viewer(data, (res) => {
                console.log('update_todo_msg_status', res);
            });
        });
        socket.on('update_todo_msg_status', function(data) {
            todo_msg.update_todomsg_status_add_viewer(data, (res) => {
                console.log('update_todo_msg_status', res);
            });
        });

        socket.on('toodoUpdate', function(data, callback) {
            updateActivity(data.clusteringkey, data.contain, data.targetID, data.type, (response, error) => {
                socket.broadcast.emit('update_activity_on_fly', { status: '200', data });

                callback({ "msg": response });
            });
        });

        socket.on('todosearch', function(data, callback) {
            todosearch(data.userid, data.type, data.activity_list, (response, error) => {
                callback(response);
            });
        });

        socket.on('todo_user_typing', function(data) {
            io.to(data.activity_id).emit('todo_server_typing_emit', {
                display: data.display,
                sender_id: data.sender_id,
                img: data.sender_img,
                name: data.sender_name,
                activity_id: data.activity_id
            });
        });
        socket.on('updateChecklist', function(message, callback) {
            insertChecklist(message.checkedList, message.checklist, message.activity_id, message.createdBy, (res, err) => {
                socket.broadcast.emit('new_checklist', { status: '200', message, res });
                callback({ res });
            });
        });

        socket.on('deleteCheclList', function(message, callback) {
            deleteCheclList(message.checklist_id, message.clusteringkey, (res, err) => {
                socket.broadcast.emit('remove_on_fly', { status: '200', message, res });
                callback({
                    res
                });
            });
        });

        socket.on('deleteSubTask', function(message, callback) {
            deleteSubTask(message.s_id, message.clusteringkey, (res, err) => {
                // socket.broadcast.emit('remove_on_fly', { status: '200', message, res });
                callback({
                    res
                });
            });
        });

        socket.on('todoListForSearch', function(data, callback) {
            getAllActivityhMsg(data.allActivityList, data.target_text, data.target_filter, data.user_id, (result, error) => {
                if (result.status) {
                    callback({ status: result.status, data: result.data });
                } else {
                    callback({ status: result.status, data: result.error });
                }
            });
        });

        socket.on('todo_flag_unflag', function(data, callback) {
            todo_msg.flag_unflag(data, (res) => {
                callback(res);
            });
        });

        socket.on('add_reac_emoji', function(data, callback) {
            check_reac_emoji_list(data.msg_id, data.user_id, (result) => {
                if (result.status) {
                    if (result.result.length == 0) {
                        // add first time like/reaction
                        todo_msg.add_reac_emoji(data.activity_id, data.msg_id, data.user_id, data.user_fullname, data.emojiname, (res) => {
                            callback(res);
                        });
                    } else {
                        if (result.result[0].emoji_name == data.emojiname) {
                            // delete same user same type reaction
                            todo_msg.delete_reac_emoji(data.activity_id, data.msg_id, data.user_id, data.emojiname, (res) => {
                                callback(res);
                            });
                        } else {
                            todo_msg.update_reac_emoji(data.activity_id, data.msg_id, data.user_id, data.emojiname, (res) => {
                                callback(res);
                            });
                        }
                    }
                }
            });
        });

        socket.on('emoji_rep_list', function(data, callback) {
            todo_msg.view_reac_emoji_list(data.msg_id, data.emojiname, (result) => {
                callback(result.result);
            });
        });

        socket.on('find_todo_reply', function(data, callback) {
            todo_msg.find_reply_list(data.msg_id, data.activity_id, (result) => {
                callback(result);
            });
        });

        socket.on('getCompletedTodo', (data, callback) => {
            getAllCompletedActivity(data.user_id, (res) => {
                callback({ res });
            });
        });

        socket.on('find_unread_reply', function(data, callback) {
            todo_msg.findUnreadRep(data, (res) => {
                _.forEach(res.reply, function(v, k) {
                    socket.join(v.toString());
                });
                callback(res);
            });
        });

        socket.on('need_todo_info', function(data, callback) {
            todo_msg.todo_info(data, (res) => {
                callback(res);
            });
        })
        socket.on('todo_acepted', function(conversation_id, msg_id, user_id, activity_id, callback) {
            todo_msg.update_accept_toto(conversation_id, msg_id, (res) => {
                io.to(user_id).emit('activityAcceptFromMessage', { conversation_id: conversation_id, user_id: user_id, activity_id: activity_id });
                callback(res);
            });
        });
        socket.on('todo_decline', function(conversation_id, msg_id, activity_id, user_id, callback) {
            todo_msg.update_decline_toto(conversation_id, msg_id, activity_id, user_id, (res) => {
                io.to(user_id).emit('activityDeclineFromMessage', { conversation_id: conversation_id, user_id: user_id, activity_id: activity_id });
                callback(res);
            });
        });

        socket.on('has_new_reply', function(data, callback) {
            todo_msg.has_new_todo_reply(data, (res) => {
                callback(res);
            });
        });

        socket.on('todo_chat_search', function(data, callback) {
            todo_msg.todo_chat_search(data, (res) => {
                callback(res);
            });
        });

        socket.on('removethisline', function(data, callback) {
            io.to(data.user_id).emit('removedline', data);
        });

        socket.on('taskMsg_removethisline', function(data, callback) {
            io.to(data.user_id).emit('taskMsg_removedline', data);
        });

        socket.on('upTagMsg', function(data, callback) {
            update_msg_tag(data, (res) => {
                callback(res);
            });
        });
        socket.on('createNewspTag', function(data, callback) {
            create_sp_tag(data, (res) => {
                callback(res);
            });
        });
        socket.on('get_msgTag_id', function(data, callback) {
            get_tagmsg_id(data, (res) => {
                callback(res);
            });
        });

        /***********************************************************************/
        /***********************************************************************/
        /********************    TODO SOCKET END HERE     **********************/
        /***********************************************************************/
        /***********************************************************************/


        // also use in android & ios tema
        // sample data
        // socket.email("msg_update", { conv_id: '26658137-789f-4bd2-8601-f2c875f81089', msg_id: '34cae520-8ead-11ea-9e4d-f5e8e9f251aa', msg_body: 'test4', update_at: '1588842775762', sender: '12098018-6816-45c6-946a-8f260a42bd0e', sender_img: 'mahfuz@1585025591434.jpg', sender_name: 'Md. Mahfuzur Rahman', attch_audiofile: [], attch_imgfile: [], attch_otherfile: [], attch_videofile: [], type: 'reply' }, (res)=>{console.log(res);});
        socket.on('msg_update', function(data, callback) {
            console.log(1826, data)
            var attach_files = {
                "imgfile": data.attch_imgfile,
                "audiofile": data.attch_audiofile,
                "videofile": data.attch_videofile,
                "otherfile": data.attch_otherfile
            };

            var old_created_time = null;
            var last_update_user = null;
            var has_timer = null;

            var msg = {
                msg_id: data.msg_id,
                msg_body: data.msg_body,
                sender: data.sender,
                sender_name: data.sender_name,
                sender_img: data.sender_img,
                conversation_id: data.conv_id,
                update_at: data.update_at

            }
            if (data.has_reply == undefined) {
                data.has_reply = 0;
            }

            if (data.rep_id == undefined) {
                data.rep_id = null;
            }
            updateTextMsg(msg, async(result, err) => {
                if (err) {
                    callback(err);
                } else {
                    var newmsg = result.msg;
                    if (newmsg.attch_imgfile == null) {
                        newmsg.attch_imgfile = [];
                    }
                    if (newmsg.attch_audiofile == null) {
                        newmsg.attch_audiofile = [];
                    }
                    if (newmsg.attch_videofile == null) {
                        newmsg.attch_videofile = [];
                    }
                    if (newmsg.attch_otherfile == null) {
                        newmsg.attch_otherfile = [];
                    }

                    if (data.type == 'reply') {
                        var conv_members = await room_members(data.thread_root_id, data.sender);
                        var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                        var conversation_title = conv_members.group == 'yes' ? conv_members.title : newmsg.sender_name;
                        var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : newmsg.sender_img;
                        for (var n = 0; n < conv_members.participants.length; n++) {
                            io.to(conv_members.participants[n]).emit('newRepMessage', { status: true, msg: newmsg, conversation_type, conversation_title, conversation_img });
                            send_msg_firebase(conv_members.participants[n], { status: true, msg: newmsg, conversation_type, conversation_title, conversation_img }, 'newRepMessage');
                        }
                        // socket.broadcast.emit('newRepMessage',{status:true, msg: newmsg});
                        // io.to(data.sender).emit('newRepMessage',{status:true, msg: newmsg});
                        socket.broadcast.emit('msg_fully_delete_broadcast', { conversation_id: data.conversation_id, msg_id: data.msg_id });
                    } else {
                        var conv_members = await room_members(data.conv_id, data.sender);
                        var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                        var conversation_title = conv_members.group == 'yes' ? conv_members.title : newmsg.sender_name;
                        var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : newmsg.sender_img;
                        for (var n = 0; n < conv_members.participants.length; n++) {
                            conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                            if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                                io.to(conv_members.participants[n]).emit('newMessage', { msg: newmsg, conversation_type, conversation_title, conversation_img });
                                send_msg_firebase(conv_members.participants[n], { msg: newmsg, conversation_type, conversation_title, conversation_img }, 'newMessage');
                            }
                        }
                        // socket.broadcast.emit('newMessage',{ msg: newmsg});
                        // io.to(data.sender).emit('newMessage', { msg: newmsg});
                        socket.broadcast.emit('msg_fully_delete_broadcast', { conversation_id: data.conversation_id, msg_id: data.msg_id });
                    }

                    callback(result);
                }
            });

            // connect_msgUpdate(data).then((res)=>{
            //   console.log(res);
            //   var msg = {
            //     msg_id: data.msg_id,
            //     msg_from: data.sender,
            //     msg_body: data.msg_body,
            //     sender: data.sender,
            //     sender_name: data.sender_name,
            //     sender_img: data.sender_img,
            //     conversation_id: data.conv_id,
            //     msg_thread_root_id: 0,
            //     attch_audiofile		: data.attch_audiofile,
            // 		attch_imgfile		: data.attch_imgfile,
            // 		attch_otherfile		: data.attch_otherfile,
            // 		attch_videofile		: data.attch_videofile
            //   }
            //   socket.broadcast.emit('newMessage', { msg: msg});
            //   callback(res);
            // }).catch((err)=>{
            //   callback(err);
            // });
        });
        socket.on('msgUpdateChecklist', function(data, callback) {
            connect_msgUpdatechecklist(data).then((res) => {
                getsinglemsgchecklist(data.msg_id).then(async(res2) => {
                    var msg = {
                            msg_id: data.msg_id,
                            msg_from: data.sender,
                            msg_body: res.msg_title,
                            sender: data.sender,
                            sender_name: data.sender_name,
                            sender_img: data.sender_img,
                            conversation_id: data.conv_id,
                            msg_thread_root_id: 0,
                            attch_audiofile: data.attch_audiofile,
                            attch_imgfile: data.attch_imgfile,
                            attch_otherfile: data.attch_otherfile,
                            attch_videofile: data.attch_videofile,
                            checklist: res2.data,
                            msg_type: 'checklist'
                        }
                        // socket.broadcast.emit('newMessage', { msg: msg});
                    var conv_members = await room_members(data.conv_id, data.sender);
                    var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                    var conversation_title = conv_members.group == 'yes' ? conv_members.title : msg.sender_name;
                    var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : msg.sender_img;
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                        if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                            if (conv_members.participants[n] == data.sender) continue;
                            io.to(conv_members.participants[n]).emit('newMessage', { msg: msg, conversation_type, conversation_title, conversation_img });
                            send_msg_firebase(conv_members.participants[n], { msg: msg, conversation_type, conversation_title, conversation_img }, 'newMessage');
                        }
                    }
                    callback({ msg: msg });
                }).catch((err2) => {
                    callback(err2);
                });
            }).catch((err) => {
                callback(err);
            });

        });

        socket.on('msg_fully_delete', function(data, callback) {
            // msg_delete_full(data,function(res){
            //   if(res.status){
            //     socket.broadcast.emit('msg_fully_delete_broadcast',data)
            //     callback(res);
            //   }else{
            //     callback(res);
            //   }
            // })
            socket.broadcast.emit('msg_fully_delete_broadcast', data);
            callback({ status: true });
        })
        socket.on('updateChecklistLastTime', function(data, callback) {
            updateChecklistLastTime(data, function(res) {
                if (res.status) {
                    res.msg['checklist'] = res.checklist;
                    res['conversation_img'] = data.conversation_img;
                    res['conversation_title'] = data.conversation_title;
                    res['conversation_type'] = data.conversation_type;
                    for (var n = 0; n < data.participants.length; n++) {
                        data.participants_guest = data.participants_guest == null ? [] : data.participants_guest;
                        if (data.participants_guest.indexOf(data.participants[n]) == -1) {
                            io.to(data.participants[n]).emit('newMessage', res);
                            send_msg_firebase(data.participants[n], res, 'newMessage');
                        }
                    }

                    var allLink = data.allLink;
                    if (allLink != null) {
                        if (allLink.length > 0) {
                            var allvalidLink = [];
                            _.each(allLink, function(v, k) {
                                if (allvalidLink.indexOf(v) == -1) {
                                    allvalidLink.push(v);
                                }
                            });
                            if (allvalidLink.length > 0) {
                                var linkdata = {
                                    msg_id: data.msg_id,
                                    url_list: allvalidLink,
                                    conversation_id: data.conversation_id,
                                    user_id: data.user_id
                                }
                                console.log(2875, linkdata);
                                create_conv_link(linkdata, function(res) {
                                    console.log(3147, res);
                                })
                            }
                        }
                    }
                    // socket.emit('newMessage', res);
                    callback(res);
                } else {

                    callback(res);
                }
            })
        })
        socket.on('add_chk_item', function(data, callback) {
            console.log(2633, data);
            var data_type_error = false;
            if (!isUuid(data.convid) || !isUuid(data.msg_id) || !isUuid(data.user_id)) {
                data_type_error = true;
            }
            if (data.type == 'update' && !isUuid(data.checklist_id)) {
                data_type_error = true;
            }
            if (data_type_error === true) {
                callback({ status: false, msg: 'Data type error' });
            } else {
                add_chk_item(data, async function(res) {
                    // res.data.type = data.type;
                    // console.log(2635, res.data, data.type);
                    var conv_members = await room_members(data.convid, data.user_id);
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        if (conv_members.participants[n] == data.user_id) continue;
                        io.to(conv_members.participants[n]).emit('add_chk_new_item', res, );
                    }
                    callback(res);
                });
            }
        });
        socket.on('only_add_remove_assignee', function(data, callback) {
            only_add_remove_assignee(data, function(res) {
                callback(res);
            });
        });
        socket.on('chk_due_date_today', function(data, callback) {
            chk_due_date_today(data, function(res) {
                callback(res);
            })
        });
        //******************************//
        // use for room or group delete //
        //******************************//
        socket.on('roomdelete', function(params) {
            socket.broadcast.emit('room_delete_broadcast', params);
        })


        // *********************************
        // This socket need for Android Call
        // *********************************
        socket.on('kurento_call', function(data) {
            io.to(data.sender).emit('kurento', data);
            io.to(data.reciver).emit('kurento', data);
        });

        socket.on('share_with', function(data, callback) {

            var count = 0;
            read_msg_data(data.msg_id, function(message) {
                var old_created_time = null;
                var last_update_user = null;

                if (message.old_created_time != undefined) {
                    old_created_time = message.old_created_time;
                }
                if (message.last_update_user != undefined) {
                    last_update_user = message.last_update_user
                }
                var attach_files = { "imgfile": message.attch_imgfile, "audiofile": message.attch_audiofile, "videofile": message.attch_videofile, "otherfile": message.attch_otherfile };

                _.forEach(data.selectedShareMember, function(v, k) {
                    createPersonalConv(data.user_id, v, "Navigate", data.company_id, function(rep, error) {
                        if (message.msg_type == 'checklist') {
                            message.msg_body = data.msg_body;
                        }
                        if (message.has_reply == undefined) {
                            message.has_reply = 0;
                        }
                        if (data.rep_id == undefined) {
                            data.rep_id = null;
                        }
                        var paramsData = {
                            io: io,
                            socket: socket,
                            from: data.user_id,
                            sender_img: data.user_img,
                            sender_name: data.user_fullname,
                            conversation_id: rep.conversation_id.toString(),
                            msg: message.msg_body,
                            attachment: attach_files,
                            timer: data.has_timer,
                            old_created_time: old_created_time,
                            last_update_user: last_update_user,
                            updatedMsgid: '',
                            tag_list: message.tag_list,
                            has_reply: message.has_reply,
                            rep_id: data.rep_id,
                            service_provider: message.selectedSp
                        }
                        sendNewMsg(paramsData, (result, err) => {

                            if (result.status) {
                                io.to(v).emit('newMessage', result);
                                send_msg_firebase(v, result, 'newMessage');
                                count++;
                                console.log(message.url_title);
                                if (message.url_title != null) {
                                    url_attachment_data_update({
                                        conversation_id: rep.conversation_id.toString(),
                                        msg_id: result.msg.msg_id.toString(),
                                        logo: message.url_favicon,
                                        publisher: message.url_base_title,
                                        title: message.url_title,
                                        description: message.url_body,
                                        url_image: message.url_image
                                    });
                                }
                            }
                            if (result.unreadChecklist !== undefined) {
                                if (result.unreadChecklist) {
                                    socket.broadcast.emit('unreadChecklist', result);
                                }
                            }
                            if (count == data.selectedShareMember.length)
                                callback(true);
                        });
                    });
                });
                // console.log(message.msg_id);
            });
        });

        socket.on('share_withConv', function(data, callback) {
            console.log(2289, data);
            if (data.is_group.toLowerCase() == "no") {
                createPersonalConv2(data.user_id, data.selectedShareMember[0], 'NavCon', data.company_id, (result1, err) => {
                    if (err)
                        callback({ status: false, error: err });
                    else {
                        console.log(2295, { status: true, conversation_id: result1.conversation_id });
                        // callback({status: true, conversation_id: result1.conversation_id});
                        data.selectedShareMember[0] = result1.conversation_id;
                        var count = 0;
                        read_msg_data(data.msg_id, function(message) {
                            var old_created_time = null;
                            var last_update_user = null;

                            if (message.old_created_time != undefined) {
                                old_created_time = message.old_created_time;
                            }
                            if (message.last_update_user != undefined) {
                                last_update_user = message.last_update_user
                            }
                            var attach_files = { "imgfile": message.attch_imgfile, "audiofile": message.attch_audiofile, "videofile": message.attch_videofile, "otherfile": message.attch_otherfile };

                            _.forEach(data.selectedShareMember, function(v, k) {
                                // console.log(2251, rep);
                                var conv_id = v.toString();
                                if (message.msg_type == 'checklist') {
                                    message.msg_body = data.msg_body;
                                }
                                if (message.has_reply == undefined) {
                                    message.has_reply = 0;
                                }
                                if (message.rep_id == undefined) {
                                    message.rep_id = null;
                                }
                                var paramsData = {
                                    io: io,
                                    socket: socket,
                                    from: data.user_id,
                                    sender_img: data.user_img,
                                    sender_name: data.user_fullname,
                                    conversation_id: conv_id,
                                    msg: message.msg_body,
                                    attachment: attach_files,
                                    timer: data.has_timer,
                                    old_created_time: old_created_time,
                                    last_update_user: last_update_user,
                                    updatedMsgid: '',
                                    tag_list: message.tag_list,
                                    has_reply: message.has_reply,
                                    rep_id: message.rep_id,
                                    service_provider: message.selectedSp
                                }

                                sendNewMsg(paramsData, async(result, err) => {

                                    if (result.status) {

                                        result.root_conv_id = message.thread_root_id;
                                        result.root_msg_id = message.root_msg_id;
                                        var conv_members = await room_members(conv_id, data.user_id);
                                        result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                        result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                        result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                        for (var n = 0; n < conv_members.participants.length; n++) {
                                            conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                                            if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                                                io.to(conv_members.participants[n]).emit('newMessage', result);
                                                send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                                            }
                                        }
                                        // socket.broadcast.emit('newMessage', result); // this emit receive all users except me
                                        // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                        // io.to(data.user_id).emit('newMessage', result);
                                        count++;
                                        if (message.url_title != null) {
                                            url_attachment_data_update({
                                                conversation_id: rep.conversation_id.toString(),
                                                msg_id: result.msg.msg_id.toString(),
                                                logo: message.url_favicon,
                                                publisher: message.url_base_title,
                                                title: message.url_title,
                                                description: message.url_body,
                                                url_image: message.url_image
                                            });
                                        }
                                    }

                                    if (result.unreadChecklist !== undefined) {
                                        if (result.unreadChecklist) {
                                            socket.broadcast.emit('unreadChecklist', result);
                                        }
                                    }

                                    if (count == data.selectedShareMember.length)
                                        callback({ status: true });
                                });

                            });
                            // console.log(message.msg_id);
                        });
                    }
                });
            } else if (data.is_group.toLowerCase() == "yes") {
                console.log(2382)
                var count = 0;
                read_msg_data(data.msg_id, function(message) {
                    var old_created_time = null;
                    var last_update_user = null;

                    if (message.old_created_time != undefined) {
                        old_created_time = message.old_created_time;
                    }
                    if (message.last_update_user != undefined) {
                        last_update_user = message.last_update_user
                    }
                    var attach_files = { "imgfile": message.attch_imgfile, "audiofile": message.attch_audiofile, "videofile": message.attch_videofile, "otherfile": message.attch_otherfile };

                    _.forEach(data.selectedShareMember, function(v, k) {
                        // console.log(2251, rep);
                        var conv_id = v.toString();
                        if (message.msg_type == 'checklist') {
                            message.msg_body = data.msg_body;
                        }
                        if (message.has_reply == undefined) {
                            message.has_reply = 0;
                        }
                        if (message.rep_id == undefined) {
                            message.rep_id = null;
                        }
                        var paramsData = {
                            io: io,
                            socket: socket,
                            from: data.user_id,
                            sender_img: data.user_img,
                            sender_name: data.user_fullname,
                            conversation_id: conv_id,
                            msg: message.msg_body,
                            attachment: attach_files,
                            timer: data.has_timer,
                            old_created_time: old_created_time,
                            last_update_user: last_update_user,
                            updatedMsgid: '',
                            tag_list: message.tag_list,
                            has_reply: message.has_reply,
                            rep_id: message.rep_id,
                            service_provider: message.selectedSp
                        }

                        sendNewMsg(paramsData, async(result, err) => {

                            if (result.status) {

                                result.root_conv_id = message.thread_root_id;
                                result.root_msg_id = message.root_msg_id;
                                // io.to(conv_id).emit('newMessage', result);
                                // socket.broadcast.emit('newMessage', result); // this emit receive all users except me
                                // io.to(message.conversation_id).emit('newMessage', {msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id}); // this emit receive all users except me
                                // io.to(data.user_id).emit('newMessage', result);
                                var conv_members = await room_members(conv_id, data.user_id);
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                                    if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                                        io.to(conv_members.participants[n]).emit('newMessage', result);
                                        send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                                    }
                                }
                                count++;
                                if (message.url_title != null) {
                                    url_attachment_data_update({
                                        conversation_id: rep.conversation_id.toString(),
                                        msg_id: result.msg.msg_id.toString(),
                                        logo: message.url_favicon,
                                        publisher: message.url_base_title,
                                        title: message.url_title,
                                        description: message.url_body,
                                        url_image: message.url_image
                                    });
                                }
                            }

                            if (result.unreadChecklist !== undefined) {
                                if (result.unreadChecklist) {
                                    socket.broadcast.emit('unreadChecklist', result);
                                }
                            }

                            if (count == data.selectedShareMember.length)
                                callback({ status: true });
                        });

                    });
                    // console.log(message.msg_id);
                });
            } else {
                callback({ status: false, error: "Data type missing" });
            }
        });




        socket.on('conv_mute', function(android, callback) {
            if (android.mute_day && android.mute_day.length) {
                var startTime = android.mute_start_date.toUpperCase();
                var endTime = android.mute_end_date.toUpperCase();

            } else {
                var startTime = moment(android.mute_start_date).format("llll");
                var endTime = moment(android.mute_end_date).format("llll");
            }
            console.log('conv__mute', android);
            if (android.type == 'create') {
                var data = {
                    allConv: android.allConv,
                    conv_id: android.conversation_id,
                    user_id: android.mute_by,
                    mute_start_time: startTime,
                    mute_duration: android.mute_duration,
                    mute_end_time: endTime,
                    mute_day: android.mute_day,
                    timezone: android.timezone ? android.timezone : '',
                    // show_notification: android.show_notification ? JSON.parse(android.show_notification) : false
                };
                if (android.conversation_id !== undefined && android.mute_by !== undefined) {
                    connect_mute_create(data, (result, err) => {
                        if (err) {
                            callback(err);
                        } else {
                            io.to(data.user_id).emit('mute_sync_create', {
                                status: 'create',
                                result: result
                            });
                            // callback({
                            //     status: 'create',
                            //     result: result
                            // });
                        }
                    });
                }
            } else if (android.type == 'change') {
                var data = {
                    mute_id: android.mute_id,
                    mute_start_time: startTime,
                    mute_duration: android.mute_duration,
                    mute_end_time: endTime,
                    mute_day: android.mute_day,
                    timezone: android.timezone ? android.timezone : ''
                };
                update_mute_notification(data, function(result, error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback({
                            status: 'change',
                            result: result
                        });
                    }
                });

            } else if (android.type == 'cancel') {
                var data = {
                    mute_id: android.mute_id,
                    user_id: android.mute_by
                };
                delete_mute_notification(data, function(result, error) {
                    if (error) {
                        callback(error);
                    } else {
                        // callback({
                        //     status: 'cancel',
                        //     result: result
                        // });
                        io.to(data.user_id).emit('mute_sync_delete', { status: 'success', mute_id: data.mute_id });
                    }
                });
            }
        })

        ///for mute notification
        socket.on('mute_create', function(data, callback) {
            connect_mute_create(data, (result, err) => {
                if (err) {
                    callback(err);
                } else {
                    // callback(result);
                    // io.to(data.user_id).emit('mute_sync_create', result);

                    io.to(data.user_id).emit('mute_sync_create', {
                        status: 'create',
                        result: result
                    });
                }
            });
        });

        socket.on('all_mute_conv', function(data, callback) {
            get_all_mute_conv(data, function(result, error) {
                if (error) {
                    callback(error);
                } else {
                    callback(result);
                }
            });
        });

        socket.on('mute_update', function(data, callback) {
            update_mute_notification(data, function(result, error) {
                if (error) {
                    callback(error);
                } else {
                    callback(result);
                }
            });
        });

        socket.on('unmute_notification', function(data, callback) {
            console.log('Socket data', data);
            if (!Array.isArray(data.mute_id)) data.mute_id = [data.mute_id];
            delete_mute_notification(data, function(result, error) {
                if (error) {
                    callback(error);
                } else {
                    // callback(result);
                    io.to(data.user_id).emit('mute_sync_delete', { status: 'success', mute_id: data.mute_id });
                }
            });
        });

        ///for check new message participants
        socket.on('check_Conv_Part', (data, callback) => {
            find_new_message_participants(data, function(result, error) {
                if (error) {
                    callback(error);
                } else {
                    callback(result);
                }
            });
        });

        socket.on('makeMember', function(data) {
            socket.broadcast.emit('make_Member_Broadcast', data);
        });
        socket.on('make_admin', function(data) {
            socket.broadcast.emit('make_Admin_Broadcast', data);
        });

        socket.on('clear_conv', function(data, callback) {
            clear_conv_history(data, function(result, error) {
                if (error) callback({ result, error });
                else callback(result);
            });
        });

        socket.on('group_participants_update', function(data, callback) {
            update_group_participants(data, function(result, error) {
                if (error)
                    callback(error);
                else
                    callback(result);
            });
        });
        socket.on('activity_participants_update', function(data, callback) {
            update_activity_participants(data, function(result, error) {
                if (error)
                    callback(error);
                else
                    callback(result);
            });
        });
        ///for url preview
        socket.on('socket_url_preview', (data, callback) => {
            url_preview(data, function(result, error) {
                if (error) {
                    callback(error);
                } else {
                    callback(result);
                }
            });
        });


        socket.on('idleEmitClient', function(data) {
            // console.log('idle', data);
            // if(data.type == 'add'){
            //   if(allIdleUsers.indexOf(data.id) == -1){
            //     allIdleUsers.push(data.id);
            //   }
            //     var data = {
            //       type : 'add',
            //       user_id : data.id,
            //       allIdleUsers : allIdleUsers
            //     }

            //     socket.broadcast.emit('idleUsers', data);
            //     socket.emit('idleUsersForuser', data);
            // }else if(data.type == 'remove'){
            //   if(allIdleUsers.indexOf(data.id) > -1){
            //     allIdleUsers.splice(allIdleUsers.indexOf(data.id),1);
            //   }
            //     var data = {
            //       type : 'add',
            //       user_id : data.id,
            //       allIdleUsers : allIdleUsers
            //     }

            //     socket.broadcast.emit('idleUsers', data);
            //     socket.emit('idleUsersForuser', data);
            // }
            // console.log('idle ##################################',allIdleUsers);
        });
        /////////////////////////for find task & Subtask media msg ////////////////////////////
        socket.on('findTaskMediaMsg', function(data, callback) {
            taskMediaAllMsg(data, function(result, err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(result);
                }
            });
        });
        ///////////////for find conv tag by user ////////////////
        socket.on('findconvtagbyuser', function(data, callback) {
                findconvTag(data, function(result, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(result);
                    }
                })
            })
            //000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000//
            //000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000//
            //////////////////////////////////////////////ANDROID API VIA SOCKET////////////////////////////////////////////
            //000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000//
            //000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000//

        // socket.on('android_pin_unpin', function (params, callback) {
        //   if (params.uid != undefined){
        //     setPinUnpin(params)
        //     .then((response)=>{
        //       if (response.status){
        //         var result = {
        //           status: true,
        //           msg: 'Pinned Successfully',
        //           pinid: response.pinID
        //         }
        //       }else{
        //         var result = {
        //           status: false,
        //           msg: 'Something Wrong'
        //         }
        //       }
        //       callback(result);

        //     }).catch((err)=>{
        //       var result = {
        //         status: false,
        //         msg: 'Param Missing'
        //       }
        //       callback(result);
        //     });
        //   }else{
        //     var result = {
        //       status:false,
        //       msg: 'Param Missing'
        //     }
        //     callback(result);
        //   }

        // });


        // API for hide members from list

        socket.on('android_hide_from_sidebar', function(params, callback) {
            if (params.conversation_id.length > 0 && params.targetID != undefined) {
                var mqueries = [];
                _.each(params.conversation_id, function(v, k) {
                    var update_query = models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(v.toString()), company_id: models.timeuuidFromString(params.company_id) }, { is_active: { $add: [params.targetID] } }, { return_query: true });
                    mqueries.push(update_query);
                });
                models.doBatch(mqueries, function(err) {
                    if (err) {
                        callback({ status: false, error: err });
                    } else {
                        callback({ status: true });
                    }
                });
            } else {
                callback({ status: false, error: 'Param Missing' });
            }
        });

        // API for mark unread all msg from list

        socket.on('andriod_all_unread', function(params, callback) {
            getAllUnreadConv(params.my_all_conv, params.uid, function(repdata, error) {
                if (repdata.status) {
                    if (repdata.data.all_unread.length > 0) {
                        var mqueries = [];
                        _.each(repdata.data.all_unread, function(v, k) {
                            var update_query = models.instance.Messages.update({
                                conversation_id: { $eq: models.uuidFromString(v.conversation_id.toString()) },
                                msg_id: { $eq: models.timeuuidFromString(v.msg_id.toString()) }
                            }, {
                                msg_status: { '$add': [params.uid] },
                                has_delivered: 1
                            }, { return_query: true });
                            mqueries.push(update_query);
                        });

                        models.doBatch(mqueries, function(err) {
                            if (err) {
                                callback({ status: true, error: err });
                            } else {
                                callback({ status: true });
                            }
                        });
                    } else {
                        callback({ status: true });
                    }

                } else {
                    callback({ status: true, error: error });
                }
            });
        });

        // API for pin unpin all msg from list

        socket.on('android_pin_unpin', function(params, callback) {
            if (params.convid.length > 0) {
                $query = {
                    user_id: models.uuidFromString(params.uid)
                };

                models.instance.Pinned.find($query, { raw: true, allow_filtering: true }, function(err, conversation) {
                    if (err) {
                        var result = {
                            status: false,
                            msg: 'DB ERROR'
                        }
                        callback(result);
                    } else {
                        var alreadyPinned = [];
                        var tobePinned = [];
                        var blockid = [];
                        if (conversation != undefined) {
                            if (conversation.length > 0) {
                                _.each(conversation, (v, k) => {
                                    if (params.convid.indexOf(v.block_id.toString()) > -1) {
                                        if (alreadyPinned.indexOf(v.id.toString()) == -1) {
                                            alreadyPinned.push(v.id.toString());
                                        }
                                        if (blockid.indexOf(v.id.toString()) == -1) {
                                            blockid.push(v.block_id.toString());
                                        }
                                    }
                                });
                            } else {
                                tobePinned = params.convid;
                            }
                        } else {
                            tobePinned = params.convid;
                        }

                        if (blockid.length > 0) {
                            _.each(params.convid, (v, k) => {
                                if (blockid.indexOf(v) == -1) {
                                    if (tobePinned.indexOf(v) == -1) {
                                        tobePinned.push(v);
                                    }
                                }
                            });
                        } else {
                            tobePinned = params.convid;
                        }

                        if (alreadyPinned.length > 0) {
                            var queries = [];
                            _.each(alreadyPinned, (v, k) => {
                                queries.push({
                                    query: "DELETE FROM pinned WHERE id = ? ",
                                    params: [v.toString()]
                                });
                            });

                            models.instance.Pinned.execute_batch(queries, function(err) {
                                console.log('done delete');
                            });
                        }

                        if (tobePinned.length > 0) {
                            var mqueries = [];
                            var con_pin = {};
                            _.each(tobePinned, function(v, k) {
                                var mid = models.uuid();
                                var mtag = new models.instance.Pinned({
                                    id: mid,
                                    user_id: models.uuidFromString(params.uid),
                                    serial_number: k,
                                    block_id: models.uuidFromString(v)
                                });
                                var msave_query = mtag.save({ return_query: true });
                                mqueries.push(msave_query);
                                con_pin[v] = mid.toString();
                            });

                            models.doBatch(mqueries, function(err) {
                                console.log('done add');
                            });
                        }

                        var result = {
                            status: true,
                            onetimeid: 'android',
                            msg: 'Pinned Successfully',
                            convid: params.convid
                        }
                        io.to(params.uid).emit('pin_unpin_broadcast', result);
                        callback(result);
                    }
                });
            } else {
                var result = {
                    status: false,
                    msg: 'Param Missing'
                }
                callback(result);
            }
        });

        socket.on("pin_unpin_done", function(data) {
            io.to(data.uid).emit('pin_unpin_broadcast', data);
        });

        socket.on("delete_selected_msgs", function(data, callback) {
            console.log(3299, data);
            if (!_.isArray(data.msgids)) {
                data.msgids = JSON.parse(data.msgids);
            }

            _.forEach(data.msgids, function(v, k) {
                commit_msg_delete(data.conversation_id, v, data.user_id, 'no', 'no', (res) => {
                    if (res.status !== true)
                        callback({ status: false, data: data, msgid: v, msg: "this msg could not be deleted" });
                    if (data.msgids.length == (k + 1))
                        callback({ status: true, data: data, msg: "completed" });
                });
            });
        });

        ////// for mail //////

        socket.on('sendEmail', (data, callback) => {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'mailtestimaginebd@gmail.com', // generated ethereal user
                    pass: 'mailTestImaginebd123' // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'mailtestimaginebd@gmail.com', // sender address
                to: data.to, // list of receivers
                subject: data.sub, // Subject line
                text: data.text, // plain text body
                // html: data.msghtml // html body
                html: data.msghtml // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    callback({ msg: 'success', data: info })
                }

                // // Preview only available when sending through an Ethereal account
                // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            });
        });
        socket.on('gravatarImg', (data, callback) => {
            var url = gravatar.url(data.email, { s: data.s, r: 'pg', d: 'mm' });
            callback(url);
        });

        socket.on('updateMsgTimer', (data, callback) => {
            updateMsgTimer(data, function(res) {
                if (res.msg == 'success') {
                    socket.broadcast.emit('msgTimerBroadcast', data);
                    callback({ msg: 'success' });
                }
            });
        })

        socket.on('edit_msg_attch_list', function(data, callback) {
            edit_msg_attch_list(data, (res) => {
                if (res.status)
                    socket.broadcast.emit('newMessage', { msg: res.message });
                callback(res);
            });
        });

        socket.on('assignEventTask', function(data) {
            io.to(data.assign_id).emit('assignNewTask', data);
        });

        socket.on('taskStatuschange', function(data) {
            io.to(data.to).emit('taskStatuschangeemit', data);
        });

        socket.on('find_mynote', function(data, callback) {
            todo_msg.find_mynote_history(data, (response) => {
                if (response.status)
                    callback(response);
            });
        });

        socket.on('save_mynote', (data, callback) => {
            todo_msg.save_mynote(data, (res) => {
                callback(res);
            });
        });

        socket.on('update_mynote', (data, callback) => {
            todo_msg.update_mynote(data, (res) => {
                callback(res);
            });
        });

        socket.on('create_find_batch_sms', function(data, callback) {
            todo_msg.find_or_create_ifnot(data, (res) => {
                socket.join(res.batch_activity.batch_id);
                callback(res);
            });
        });

        socket.on('send_batch_message', function(data, callback) {
            todo_msg.save_msg(data, (res) => {
                // if (data.attach_files !== undefined) {
                //   filesTag(res.msg.msg_id, data.activity_id, socket.handshake.session.userdata.from, data.tags, (response, err) => {
                //     if (err) {
                //       console.log(998, err);
                //     } else {
                //       res.tagmsgid = response;
                //       io.to(data.activity_id).emit('todo_msg_receive', res);
                //     }
                //   });
                // }
                // else {
                io.to(data.activity_id).emit('batch_msg_receive', res);
                // }
                callback({ res, data });
            });
        });




        socket.on('create_find_batch_note', function(data, callback) {
            todo_msg.find_note_or_create_ifnot(data, (res) => {
                // socket.join(res.batch_activity.batch_id);
                callback(res);
            });
        });

        socket.on('delete_bn', function(data, callback) {
            todo_msg.delete_bn(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('update_note_label', (data, callback) => {
            todo_msg.update_note_label(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('count_note_msg', (data, callback) => {
            todo_msg.count_note_msg(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('update_note_seen', (data, callback) => {
            todo_msg.update_note_seen(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('getAllIdleList', function(cb) {
            cb(allIdleUsers)
        });

        socket.on('searchMsgBody', function(data, callback) {
            searchMsgBody(data, function(res) {
                if (res.msg == 'success') {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        /////////////////////// UPDATE ROOM MEMBERS //////////////

        socket.on('updateRoomPart', function(data, callback) {

            up_R_Parti(data, function(res) {
                if (res.status) {
                    socket.broadcast.emit('updateRoomPartBroad', data);
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('updateRoomPartAdmin', function(data, callback) {
            up_R_Admins(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });


        /////////////////////// Get Business Unit By User //////////////

        socket.on('getBUnit', function(data, callback) {
            getAllbunit(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            });
        });

        /////////////////////// Get Company ID By User //////////////

        socket.on('getCompanyIdByUser', function(data, callback) {
            getCompanyIdByUser(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            });
        });


        /////////////////////// add new business unit //////////////

        socket.on('addNewBUnit', function(data, callback) {
            addNewBUnit(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            })
        });


        socket.on('getAllIndustry', function(callback) {
            findOrAddIndustry(function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            })
        });


        socket.on('getSearchMessages', function(data, callback) {
            findMsgIdByTag(data, function(res) {
                if (res.status) {
                    var msgIdA = [];
                    var convid = data.conversation_id;

                    _.each(res.data, function(v, k) {
                        msgIdA.push(v.message_id);
                    });

                    if (res.data.length > 0) {
                        findMsgBymsg_id({ conversation_id: convid, msgSet: msgIdA }, function(res2) {
                            if (res2.status) {
                                callback(res2);
                            }
                        });
                    } else {
                        callback(res);
                    }

                }
            });
        });

        socket.on('updateTopicType', function(data, callback) {
            updateTopicType(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('updateBusinessUnit', function(data, callback) {
            updateBusinessUnit(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('getfilterDatamessageSocket', function(data, callback) {
            getFilterMessage(data, function(res) {
                callback(res);
            });
        });

        socket.on('getChecklistConv', function(data, callback) {
            getChecklistMsg(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('my_all_task_assignment', function(data, callback) {
            my_all_task_assignment(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        })
        socket.on('bunittitleUpdate', function(data, callback) {
            updateunitTitle(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('removeBunit', function(data, callback) {
            removeBunitbyid(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    console.log(res);
                }
            })
        });

        socket.on('cheklistUpdateStatus', function(data, callback) {
            updateCheckStatus(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        })

        socket.on('getAllUsedConvTag', function(data, callback) {
            getAllUsedConvTag(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        })
        socket.on('getuseunitid', function(callback) {
            getuseunitid().then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        });

        socket.on('createIssueTag', function(data, callback) {
            createtagNcreateIssueTag(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(2656, error);
            })
        })

        socket.on('getconvissuetag', function(data, callback) {
            getconvissuetag(data).then((res) => {
                console.log(2873, data);
                callback(res);
            }).catch((error) => {
                console.log(2666, error);
            })
        });

        socket.on('getMsgissueTag', function(data, callback) {
            getmsgissuetag(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        });

        socket.on('msgtagAddorRemove', function(data, callback) {
            msgtagAddorRemove(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        });
        socket.on('acceptOrRejectIssue', function(data, callback) {
            acceptOrRejectIssue(data).then((res) => {
                callback(res);
            }).catch((error) => {
                console.log(error);
            })
        });

        socket.on('forwardMessageV2', function(data, callback) {
            data['io'] = io;
            data['socket'] = socket;
            forwardMessage(data, function(res) {
                if (res.status) {
                    // console.log(3722,res)
                    _.each(res.data, function(v, k) {
                        _.each(data.share_conv, async function(convv, convk) {
                            var conv_members = await room_members(convv, data.user_id);
                            var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                            var conversation_title = conv_members.group == 'yes' ? conv_members.title : v.sender_name;
                            var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : v.sender_img;
                            for (var n = 0; n < conv_members.participants.length; n++) {
                                conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                                if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                                    io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: v, conversation_type, conversation_title, conversation_img });
                                    send_msg_firebase(conv_members.participants[n], { status: true, msg: v, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                }
                            }
                        });

                        // socket.broadcast.emit('newMessage', {status:true,msg:v});
                        // socket.emit('newMessage', {status:true,msg:v});
                    });
                    callback(res);
                }
            })

        });

        socket.on('getAllUserTag', function(data, callback) {
            getAllUserTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('createNewUserTag', function(data, callback) {
            createNewUserTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });
        socket.on('updateConvTagV2', function(data, callback) {
            updateConvTagV2(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });
        socket.on('updateTeamtagListperMsgupdate', function(data) {
            if (data.file_id != undefined) {
                socket.emit('updateTeamtagListperMsgBrocast', data);
            }
            socket.broadcast.emit('updateTeamtagListperMsgBrocast', data);
        });
        socket.on('updateTeamtagListperMsgBrocast', function(data) {
            socket.broadcast.emit('updateTeamtagListperMsgBrocast', data);
        })
        socket.on('updateFileTagV2', function(data, callback) {
            updateFileTagV2(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });


        socket.on('deleteOneTag', function(data, callback) {
            deleteOneTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });


        socket.on('updateUserTagTitle', function(data, callback) {
            updateUserTagTitle(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('getCompanyTag', function(data, callback) {
            getCompanyTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('tagOneMsg', function(data, callback) {
            tagOneMsg(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('removeOnMsgTag', function(data, callback) {
            removeOnMsgTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('getConvTagId', function(data, callback) {
            getConvTagId(data).then((res) => {
                if (res.data[0].conference_id == null) {
                    var query_object = {
                        conversation_id: models.uuidFromString(data.conversation_id),
                        company_id: models.timeuuidFromString(data.company_id)
                    };
                    var newid = models.timeuuid().toString() + '_group';
                    var update_values_object = { conference_id: newid };
                    models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err) {
                        if (err) { callback(null); } else {
                            res.vgd = newid;
                            callback(res);
                        }
                    });
                } else {
                    res.vgd = res.data[0].conference_id;
                    callback(res);
                }
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('tagOnCov', function(data, callback) {
            tagOnCov(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });
        socket.on('delteMyTagV2', function(data, callback) {
            delteMyTagV2(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('removeConvTag', function(data, callback) {
            removeConvTag(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on("need_msg_status_update", function(data, callback) {
            need_msg_status_update(data, (rep) => {
                callback(rep);
            });
        });

        socket.on('findmsgRepId', function(data, callback) {
            findmsgRepId(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('getAllThreadCov', function(data, callback) {
            getAllThreadCov(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('getallThreadMsg', function(data, callback) {
            getallThreadMsg(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });
        socket.on('getlasthundredmsg', function(data, callback) {
            getlasthundredmsg(data).then((res) => {
                callback(res);
            }).catch((err) => {
                callback(err);
            })
        });

        socket.on('findConvExistornot', function(data, callback) {
            findConvExistornot(data, function(res) {
                callback(res)
            })
        });
        socket.on('createNewSingleconv', function(data, callback) {
            createNewSingleconv(data, function(res) {
                callback(res)
            })
        });
        socket.on('findandgetconv', function(data, callback) {
            findandgetconv(data, function(res) {
                callback(res)
            })
        });

        // also use in android api
        // sample 
        // socket.emit("delete_message_last_time", {msg_id: '2f3cc6a0-8ead-11ea-9c6b-30fd06b61b7b', participants: [ '12098018-6816-45c6-946a-8f260a42bd0e', '57ce7cbf-1180-4a2d-9009-249a0098619e' ], conversation_id: '26658137-789f-4bd2-8601-f2c875f81089', user_id: '12098018-6816-45c6-946a-8f260a42bd0e', type: 'for_all', main_conv_id: '74269cc5-a444-4ab4-9d2a-e7ceb5722e42'}, (res)=>{console.log(res);});
        socket.on('delete_message_last_time', function(data, callback) {
            // console.log(3745, data);
            // data.socket = socket;
            delete_message_last_time(data, socket, function(res) {
                if (res.status) {
                    if (data.type == 'for_all') {

                        socket.broadcast.emit('msg_remove_for_All_broadcast', data)
                        io.to(socket.handshake.session.userdata.from).emit('msg_remove_IO_io', data);
                    } else {
                        io.to(socket.handshake.session.userdata.from).emit('msg_remove_IO_io', data);
                    }
                }
                callback(res)
            })
        });
        socket.on('updateHasHideThismsg', function(data, callback) {
            updateHasHideThismsg(data, function(res) {
                if (res.status) {
                    io.to(socket.handshake.session.userdata.from).emit('removedline', data);
                }
                callback(res)
            })
        });


        socket.on('refresh_flag_msg', function(data) {
            io.to(socket.handshake.session.userdata.from).emit('refresh_flag', data);
        });

        socket.on('getAllmydeletemessage', function(user_id, callback) {
            getAllmydeletemessage(user_id, function(res) {
                callback(res);
            })
        });
        socket.on('checkThisTitle', function(data, callback) {
            checkThisTitle(data, function(res) {
                callback(res);
            })
        });
        socket.on('editRepMsg', function(data, callback) {
            editRepMsg(data, function(res) {
                callback(res);
            })
        });

        socket.on('send_notification_msg', function(data, callback) {
            console.log("====================================", data)
            send_notification_msg(data, async function(res) {
                if (res.status) {
                    var conv_members = await room_members(data.conversation_id, data.sender);
                    var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                    var conversation_title = conv_members.group == 'yes' ? conv_members.title : res.data.sender_name;
                    var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : res.data.sender_img;
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                        if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                            if (res.filedata) {
                                io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: res.data, filedata: res.filedata, conversation_type, conversation_title, conversation_img });
                                send_msg_firebase(conv_members.participants[n], { status: true, msg: res.data, filedata: res.filedata, conversation_type, conversation_title, conversation_img }, 'newMessage');

                            } else {
                                io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: res.data, conversation_type, conversation_title, conversation_img });
                                send_msg_firebase(conv_members.participants[n], { status: true, msg: res.data, conversation_type, conversation_title, conversation_img }, 'newMessage');
                            }

                        }
                    }
                    // socket.broadcast.emit('newMessage', {status:true,msg:res.data});
                    // socket.emit('newMessage', {status:true,msg:res.data});
                    callback(res);
                }
            })
        });

        socket.on('getConvCallMsg', function(data, callback) {
            getConvCallMsg(data, function(res) {
                if (res.status) {
                    callback(res);
                }
            })
        });

        socket.on('getConvOnlyMsg', function(data, callback) {
            getConvOnlyMsg(data, function(res) {
                if (res.status) {
                    callback(res);
                }
            })
        });
        socket.on('getConvAllMsgs', function(data, callback) {
            getConvAllMsgs(data, function(res) {
                if (res.status) {
                    callback(res);
                }
            })
        });

        // socket.on('insert_notification',function(data){
        //     insert_notification(data,function(noti){
        //       if(noti.status){
        //         socket.broadcast.emit('newNotification',noti.data);
        //       }
        //   })
        // });

        socket.on('insert_notification', function(data) {
            console.log(4256, data);
            if (data.request_from !== undefined && data.request_from == 'api') {
                data.created_at = new Date();
                var temp_body = typeof data.body === 'object' ? data.body : JSON.parse(data.body);
                if (!Number.isInteger(Number(temp_body.end_due_date))) {
                    temp_body.end_due_date = moment(temp_body.end_due_date, "YYYY-MM-DD HH:mm").unix() * 1000;
                }
                if (!Number.isInteger(Number(temp_body.request_ttl_approved_date))) {
                    temp_body.request_ttl_approved_date = moment(temp_body.request_ttl_approved_date, "YYYY-MM-DD HH:mm").unix() * 1000;
                }
                data.body = JSON.stringify(temp_body);
            }
            console.log(4263, data);
            insert_notification(data, function(noti) {
                if (noti.status) {
                    socket.broadcast.emit('newNotification', noti.data);
                }
            });
        });

        socket.on("has_pending_chk_in_conv", function(data, callback) {
            has_pending_chk_in_conv(data, function(checklists) {
                callback(checklists);
            });
        });

        socket.on('room_delete_emit', function(data, callback) {

            deleteRoom(data, function(res) {
                if (res.status) {
                    var noti_data = {
                        type: 'room_delete',
                        title: data.room_title,
                        body: data.room_title,
                        created_at: data.created_at,
                        created_by: data.user_id,
                        seen_users: [data.user_id],
                        receive_users: data.participants
                    }
                    insert_notification(noti_data, function(noti) {
                        if (noti.status)
                            socket.broadcast.emit('newNotification', noti.data);

                        getallFileOnConv(data, function(res1) {
                            _.each(res1, function(v, k) {
                                var bucket_name = v.bucket.split('/')[0];
                                var objectsList = v.location.split('/');
                                objectsList.splice(0, 1);
                                objectsList = objectsList.join('/');
                                minioClient.removeObjects(bucket_name, [objectsList], function(e) {
                                    if (e) res.json({ status: false, error: 'Unable to remove Objects ', e });
                                    console.log("Removed the objects successfully.");
                                });
                            })
                            deleteconvMessage(data, function(res2) {
                                console.log(res2)
                            });
                        })
                        socket.broadcast.emit('delete_room_broadcast', data);
                        socket.emit('delete_room_broadcast', data);
                        callback({ status: true, data: data })
                    })
                } else {
                    callback({ status: true, data: data })
                }
            })
        });

        // Also use in android side. So if any change, please also knock to API team.
        socket.on('update_user_profile', function(data, callback) {
            update_user_profile(data, function(res) {
                if (res.status) {
                    socket.handshake.session.user_fullname = data.fullname;
                    socket.handshake.session.user_img = data.img;
                    socket.handshake.session.save();
                    socket.broadcast.emit('changeUserProfile', data);
                    socket.emit('changeUserProfile', data);
                    var user = { id: res.user.id, dept: res.user.dept, designation: res.user.designation, email: res.user.email, fullname: res.user.fullname, img: res.user.img, company_id: res.user.company_id, caller_id: res.user.conference_id, device: res.user.device }
                    callback({ status: true, user });
                }
            })
        });

        socket.on('update_user_profile_covid', function(data, callback) {
            update_user_profile(data, function(res) {
                if (res.status) {
                    socket.handshake.session.user_fullname = data.fullname;
                    socket.handshake.session.user_img = data.img;
                    socket.handshake.session.save();
                    socket.broadcast.emit('changeUserProfile', data);
                    socket.emit('changeUserProfile', data);
                    var user = { id: res.user.id, dept: res.user.dept, designation: res.user.designation, email: res.user.email, fullname: res.user.fullname, img: res.user.img, company_id: res.user.company_id, caller_id: res.user.conference_id, device: res.user.device }
                    callback({ status: true, user });

                    models.instance.Covid_Survey.find({
                        student_id: models.uuidFromString(socket.handshake.session.user_id)
                    }, { allow_filtering: true }, function(err, user_data) {
                        if (user_data && user_data.length) {
                            for (let user of user_data) {
                                user.student_img = data.img;
                                user.save(function(err) {
                                    if (err) console.log(err);
                                    else console.log('Yuppiie!');
                                });

                            }
                        }

                    });

                }
            })
        });

        socket.on('update_company_profile', function(data, callback) {
            update_company_profile(data, function(res) {
                if (res.status) {
                    // socket.handshake.session.user_fullname = data.fullname;
                    // socket.handshake.session.user_img = data.img;
                    // socket.handshake.session.save();
                    // socket.broadcast.emit('changeUserProfile',data);
                    // socket.emit('changeUserProfile',data);
                    // var user = {id: res.user.id, dept: res.user.dept, designation: res.user.designation, email: res.user.email, fullname: res.user.fullname, img: res.user.img, company_id: res.user.company_id, caller_id: res.user.conference_id, device: res.user.device }
                    callback({ status: true });
                }
            })
        });

        socket.on('hideUserinSidebar', function(data, callback) {
            hideUserinSidebar(data, function(res) {
                callback(res);
            })
        });

        // socket.on('create_conv_link',function(data){
        //   console.log(8888888888, data);
        //   create_conv_link(data,function(res){
        //     console.log(3147,res);
        //   })
        // });
        socket.on('addGuestuseronroom', function(data, callback) {
            addGuestuseronroom(data, function(res) {
                callback(res);
            })
        });

        socket.on('customTitle', function(data, callback) {
            customTitle(data, function(res) {
                // console.log(3186,res);
                callback(res);
            })
        });

        socket.on('setAsNotification', function(data, callback) {
            setAsNotification(data, function(res) {
                callback(res);
            });
        });
        socket.on('getNotificationSound', function(data, callback) {
            getNotificationSound(data, function(res) {
                callback(res);
            });
        });

        socket.on('issueAssignMsg', function(data, callback) {
            issueAssignMsg(data, function(result) {
                // socket.broadcast.emit('issueAssignMsg',data);
                // socket.emit('issueAssignMsg',data);
                // callback(res);

                socket.broadcast.emit('newMessage', { msg: result.msg });
                io.to(socket.handshake.session.user_id).emit('newMessage', { msg: result.msg });
                send_msg_firebase(socket.handshake.session.user_id, { msg: result.msg }, 'newMessage');
                socket.broadcast.emit('msg_fully_delete_broadcast', { conversation_id: data.conversation_id, msg_id: data.msg_id });
                callback(result);
            })
        });

        socket.on('Filter_Conv_Last_Time', function(data, callback) {
            Filter_Conv_Last_Time(data, function(res) {
                callback(res);
            })
        });
        socket.on('my_all_notification', function(data, callback) {
            my_all_notification(data, function(res) {
                if (res.status) {
                    _.each(res.data, function(v, k) {
                        v.created_by_name = idToNameArr([v.created_by])[0];
                        v.receive_users_name = idToNameArr(v.receive_users);
                        v.seen_users_name = idToNameArr(v.seen_users);
                        if (k + 1 == res.data.length)
                            callback(res);
                    });
                } else
                    callback(res);
            })
        })
        socket.on('my_all_notification_v2', function(data, callback) {
            my_last_notification_and_total(data, function(res) {
                if (res.status) {
                    if (res.data.length > 0) {
                        _.each(res.data, function(v, k) {
                            v.created_by_name = idToNameArr([v.created_by])[0];
                            v.receive_users_name = idToNameArr(v.receive_users);
                            v.seen_users_name = idToNameArr(v.seen_users);
                            if (k + 1 == res.data.length)
                                callback(res);
                        });
                    } else {
                        callback(res);
                    }
                } else
                    callback(res);
            })
        })

        socket.on('update_notification', function(data) {
            update_notification(data);
        })
        socket.on('get_all_tips', function(data, callback) {
            get_all_tips(data, function(res) {
                callback(res);
            })
        })


        socket.on('broadCastFlagged', function(data) {
            socket.emit('broadCastFlagged', data);
            socket.broadcast.emit('broadCastFlagged', data);
        })

        socket.on('pin_unpin_conversation', function(data, callback) {
            pin_unpin_conversation(data, function(res) {
                callback(res)
            })
        })
        socket.on('clear_all_deleted_msg', function(data, callback) {
            clear_all_deleted_msg(data, function(res) {
                callback(res)
            })
        })
        socket.on('get_one_room_data', function(data, callback) {
            get_one_room_data(data, function(res) {
                callback(res)
            })
        })

        function checkThisIdActiveOrNot(array, myid) {
            if (array == null) {
                return true;
            } else if (array.indexOf(myid) > -1) {
                return false;
            } else {
                return true;
            }
        }

        // Sample socket for checking
        // Also use in android side. So if any change, please also knock to API team.
        // socket.emit("get_call_details", {id: "cb52366f-a191-47f5-9035-a3c4e41b6a4b"}, (res)=>{console.log(res);});
        socket.on('get_call_details', function(user, callback) {
            models.instance.Users.find({}, { raw: true, allow_filtering: true }, function(err, users) {
                var alluserlist = [];
                _.each(users, function(v, k) {
                    alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, conference_id: v.conference_id });
                });

                getAllConversations(user.id.toString(), (result) => {
                    if (result.status) {
                        var conversations = result.conversations;
                        var myConversationList = [] // keep all conversatons in this array
                        var conversationTitle = {};
                        var conversationType = {};
                        var conversationWith = {};
                        var conversationImage = {};
                        var conversationParticipants = {};
                        var conversationParticipants_admin = {};
                        var userName = {};
                        var userImg = {};
                        var myConversationID = "";
                        var call_conference_id = {};

                        _.each(alluserlist, function(users, k) {
                            userName[users.id] = users.fullname;
                            userImg[users.id] = users.img;
                        });

                        // console.log(3699, conversations.length);
                        //Get conversation detail along with user table for further user list to android
                        if (conversations.length > 0) {
                            _.each(conversations, function(v, k) {
                                if (v.status == 'active') {
                                    if (!isEmpty(v.title)) {
                                        if (checkThisIdActiveOrNot(v.is_active, user.id.toString())) {
                                            if (myConversationList.indexOf(v.conversation_id.toString()) == -1) {

                                                myConversationList.push(v.conversation_id.toString());
                                                conversationTitle[v.conversation_id.toString()] = v.title;
                                                conversationType[v.conversation_id.toString()] = v.single;
                                                conversationImage[v.conversation_id.toString()] = v.conv_img;
                                                conversationParticipants[v.conversation_id.toString()] = v.participants;
                                                conversationParticipants_admin[v.conversation_id.toString()] = v.participants_admin;
                                                call_conference_id[v.conversation_id.toString()] = v.conference_id;

                                                if (v.single == 'yes') {
                                                    if (v.participants.length == 1) {
                                                        myConversationID = v.conversation_id.toString();
                                                    } else {
                                                        _.forEach(v.participants, function(pv, pk) {
                                                            if (pv !== null && pv.toString() !== user.id.toString()) {
                                                                conversationWith[v.conversation_id.toString()] = pv;
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            if (myConversationList.length > 0) {
                                // console.log('3732 myConversationList', myConversationList.length);
                                getAllMsg(myConversationList, (result) => {

                                    if (result.status) {

                                        var all_unread = [];
                                        var all_message = [];
                                        var counts = {};
                                        var last_conversation_id = [];
                                        var androidUserList = [];
                                        var androidCallList = [];

                                        // Push all messages

                                        _.forEach(result.data, function(amv, amk) {
                                            if (amv.length > 0) {
                                                // console.log('3747 amv_length', amv.length);
                                                _.each(amv, function(mv, mk) {
                                                    if (mv.msg_type == 'call') {
                                                        if (mv.has_hide != null) {
                                                            if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
                                                                if (mv.has_delete != null) {
                                                                    if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                                                        all_message.push(mv);
                                                                    }
                                                                } else {
                                                                    all_message.push(mv);
                                                                }
                                                            }
                                                        } else {
                                                            if (mv.has_delete != null) {
                                                                if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                                                    all_message.push(mv);
                                                                }
                                                            } else {
                                                                all_message.push(mv);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });

                                        // Get all unread message

                                        // console.log('3777', all_message.length);

                                        var all_message_orderBy = _.orderBy(all_message, ['created_at'], ['desc']);

                                        _.forEach(all_message_orderBy, function(amv, amk) {
                                            if (amv.msg_status == null && amv.sender.toString() != user.id.toString()) {
                                                all_unread.push(amv);
                                            }
                                        });

                                        // Count unread message and push it to counts array

                                        all_unread.forEach(function(x) {
                                            counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0) + 1;
                                        });

                                        // Get All last Message
                                        _.forEach(all_message_orderBy, function(amv, amk) {
                                            if (last_conversation_id.indexOf(amv.conversation_id.toString()) === -1) {
                                                last_conversation_id.push(amv.conversation_id.toString());
                                                // all_last_message.push(amv);
                                                if (amv.conversation_id.toString() !== myConversationID) {
                                                    if (amv.msg_type == 'call') {
                                                        androidCallList.push({
                                                            'conversation_id': amv.conversation_id,
                                                            'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
                                                            'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
                                                            'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
                                                            'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
                                                            'participants': conversationParticipants[amv.conversation_id.toString()],
                                                            'participants_admin': (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()] : []),
                                                            'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
                                                            'created_at': (amv.msg_body == null ? 'null' : amv.created_at),
                                                            'call_duration': (amv.call_duration == "" ? 0 : amv.call_duration),
                                                            'call_type': amv.call_type,
                                                            'call_status': amv.call_status,
                                                            'call_msg': amv.call_msg,
                                                            'msg_id': amv.msg_id,
                                                            'msg_type': amv.msg_type,
                                                            'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
                                                            'sender_name': amv.sender_name,
                                                            'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0),
                                                            'conference_id': call_conference_id[amv.conversation_id.toString()]
                                                        });
                                                    }
                                                }
                                            }
                                        });

                                        // callback(all_message);
                                        androidCallList = _.filter(androidCallList, function(acl) { return acl.conversation_title != undefined });
                                        androidCallList = _.filter(androidCallList, function(acl) { return acl.conversation_title != 'Deleted User' });
                                        callback({ status: true, res_text: "Success", androidCallList });

                                    } else {
                                        console.log(result);
                                        callback({ status: false, res_text: "No message data found" });
                                    }
                                });
                            }
                        } else {
                            callback({ status: false, res_text: "No data found" });
                        }
                    } else {
                        // console.log(result);
                        callback({ status: false, res_text: "Connection error. Please try again." });
                    }
                });
            });
        });

        // socket.emit("findCallsByConversation", "24dd858a-525f-40ef-9e7a-ca07b72a31a5", (res)=>{console.log(res)});
        socket.on('findCallsByConversation', function(conv_id, callback) {
            findCallsByConversation(conv_id, (result, err) => {
                if (result.status) {
                    callback({ status: true, res_text: "Success", data: result.conv_data });
                } else callback({ status: false, res_text: "Connection error. Please try again." })
            });
        });


        socket.on('hidethisurl', function(data, callback) {
            hidethisurl(data, (result, err) => {
                callback(result);
            });
        });
        socket.on('hidethisurl_forAll', function(data, callback) {
            hidethisurl_forAll(data, (result, err) => {
                callback(result);
            });
        });

        socket.on('lal', function(data, callback) {
            if (data.latitude != undefined) {
                lal = data;
            }
            socket.broadcast.emit('lalClient', lal);
        })
        socket.on('delete_selected_link', function(data, callback) {
            delete_selected_link(data, function(res) {
                callback(res);
            })
        })
        socket.on('findThisFile', function(data, callback) {
            findThisFile(data, function(res) {
                callback(res);
            })
        })
        socket.on('update_checklist_time', function(data, callback) {
            update_checklist_time(data, function(res) {
                socket.emit('update_checklist_settings', { data: data, type: 'single' });
                socket.broadcast.emit('update_checklist_settings', { data: data, type: 'single' });
                callback(res);
            })
        })
        socket.on('update_checklist_time_multi', function(data, callback) {
            update_checklist_time_multi(data, function(res) {
                socket.emit('update_checklist_settings', { data: data, type: 'all' });
                socket.broadcast.emit('update_checklist_settings', { data: data, type: 'all' });
                callback(res);
            })
        })
        socket.on('get_flagged_msg_only', function(data, callback) {
            get_flagged_msg_only(data, function(res) {
                callback(res);
            })
        })

        socket.on('convertTask', function(data, callback) {
            convertTask(io, socket, data, function(res) {
                callback(res);
            })
        })
        socket.on('updateMsg_tag_emit', function(data, callback) {
            updateMsg_tag_emit(data, function(res) {
                if (res.all_files != undefined) {
                    socket.broadcast.emit('updateGlobalFileTag', res);
                }
                callback(res);
            })
        })
        socket.on('getOneChecklistData', function(data, callback) {
            getOneChecklistData(data, function(res) {
                callback(res);
            })
        })

        socket.on('saveNewChecklistMsg', async function(data, callback) {
            console.log(4819, data)
            var conv_members = await room_members(data.conversation_id, data.user_id);
            data.conv = conv_members;
            saveNewChecklistMsg(data, function(res) {
                res['conversation_img'] = conv_members.group == 'yes' ? conv_members.conv_img : data.user_img;
                res['conversation_title'] = conv_members.group == 'yes' ? conv_members.title : data.fullname;
                res['conversation_type'] = conv_members.group == 'yes' ? 'group' : 'single';
                for (var n = 0; n < conv_members.participants.length; n++) {
                    conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                    if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                        io.to(conv_members.participants[n]).emit('newMessage', res);
                        send_msg_firebase(conv_members.participants[n], res, 'newMessage');
                    }
                }
                callback(res);
            });
        });

        socket.on('saveAndCancelChecklist', function(data, callback) {
            saveAndCancelChecklist(data, async function(res) {
                if (res.status) {
                    var conv_members = await room_members(data.conversation_id, data.sender);
                    res['conversation_img'] = conv_members.group == 'yes' ? conv_members.conv_img : data.sender_img;
                    res['conversation_title'] = conv_members.group == 'yes' ? conv_members.title : data.sender_name;
                    res['conversation_type'] = conv_members.group == 'yes' ? 'group' : 'single';
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        conv_members.participants_guest = conv_members.participants_guest == null ? [] : conv_members.participants_guest;
                        if (conv_members.participants_guest.indexOf(conv_members.participants[n]) == -1) {
                            io.to(conv_members.participants[n]).emit('newMessage', res);
                            send_msg_firebase(conv_members.participants[n], res, 'newMessage');
                        }
                    }
                    callback(res);
                    // var allLink = data.allLink;
                    // if (allLink != null) {
                    //   if(allLink.length > 0){
                    //     var allvalidLink = [];
                    //     _.each(allLink, function(v,k){
                    //         if(allvalidLink.indexOf(v) == -1){
                    //           allvalidLink.push(v);
                    //         }
                    //     });
                    //     if(allvalidLink.length > 0){
                    //       var linkdata = {
                    //          msg_id:data.msg_id,
                    //          url_list:allvalidLink,
                    //          conversation_id:data.conversation_id,
                    //          user_id:data.user_id
                    //       }
                    //         create_conv_link(linkdata,function(res){
                    //           console.log(3147,res);
                    //         })
                    //     }
                    //   }
                    // }
                } else {
                    callback(res);
                }
            })
        })
        socket.on('updatedColorTag', function(data, callback) {
            updatedColorTag(data, function(res) {
                callback(res);
            })
        })

        socket.on('manage_checklist', function(data, callback) {
            manage_checklist(data, function(res) {
                socket.broadcast.emit('update_checklist_settings_last', data);
                callback(res);
            })
        })
        socket.on('removeItem', function(data, callback) {
            removeItem(data, function(res) {
                callback(res);
            })
        })
        socket.on('complete_old_checklist', function(data) {
            complete_old_checklist(data);
        });
        socket.on('sharedTag', function(data, callback) {
            sharedTag(data, function(res) {
                callback(res);
            })
        })
        socket.on('sharedTagArray', function(data, callback) {
            sharedTagArray(data, function(res) {
                callback(res);
            })
        })
        socket.on('getOneChecklistMsg', function(data, callback) {
            getOneChecklistMsg(data, function(res) {
                callback(res);
            })
        })

        function isObjectEmpty(obj) {
            return Object.keys(obj).length === 0;
        }
        socket.on('removeShareLink', function(data) {
            var rawdata = fs.readFileSync('URL_Data.json');
            var allUrl = {};
            if (!isObjectEmpty(rawdata)) {
                allUrl = JSON.parse(rawdata);
            }

            if (typeof(allUrl[data.id]) != 'undefined') {
                var fileUid = allUrl[data.id];
                delete allUrl[fileUid];
                delete allUrl[data.id];
                var strignFlyData = JSON.stringify(allUrl);
                fs.writeFile("URL_Data.json", strignFlyData, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('remove Share link')
                    }
                });
            }


        })
        socket.on('getallSharedLink', function(data, callback) {
            var rawdata = fs.readFileSync('URL_Data.json');
            var allUrl = {};
            if (!isObjectEmpty(rawdata)) {
                allUrl = JSON.parse(rawdata);
            }

            var allSharedLinks = [];
            _.each(data.data, function(v, k) {
                if (typeof(allUrl[v]) != 'undefined') {
                    allSharedLinks.push(v);
                }
            });
            callback({ data: allSharedLinks });

        })
        socket.on('getRoomWiseShareTag', async function(data, callback) {
            var getAllMsg = await getConversationMessages(data.user_id, data.conversation_id);
            var getAllFiles = await getConversationFiles(data.user_id, data.conversation_id);
            var all_find_tags = await getAllTags(data.user_id);
            var allTagsIds = [];
            var allShareTags = [];
            var allMsgUseTag = [];
            var allFileUseTag = [];
            var allUsesTag = [];
            var allUsesShareTag = [];
            if (all_find_tags != null) {
                for (var i = 0; i < all_find_tags.length; i++) {
                    allTagsIds.push(all_find_tags[i].tag_id);
                    if (all_find_tags[i].shared_tag != null) {
                        allShareTags.push(all_find_tags[i].tag_id);
                    }
                }
            }
            console.log(4569, all_find_tags.length)
            console.log(4579, getAllMsg.length)
            console.log(4589, getAllFiles.length)
            if (getAllMsg != null) {
                for (var i = 0; i < getAllMsg.length; i++) {
                    if (getAllMsg[i].tag_list != undefined && getAllMsg[i].tag_list != null) {
                        for (var t = 0; t < getAllMsg[i].tag_list.length; t++) {
                            if (allMsgUseTag.indexOf(getAllMsg[i].tag_list[t]) == -1) {
                                allMsgUseTag.push(getAllMsg[i].tag_list[t]);
                                if (allUsesTag.indexOf(getAllMsg[i].tag_list[t]) == -1) {
                                    allUsesTag.push(getAllMsg[i].tag_list[t]);
                                }
                                if (allShareTags.indexOf(getAllMsg[i].tag_list[t]) > -1) {
                                    if (allUsesShareTag.indexOf(getAllMsg[i].tag_list[t]) == -1) {
                                        allUsesShareTag.push(getAllMsg[i].tag_list[t])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (getAllFiles != null) {
                for (var i = 0; i < getAllFiles.length; i++) {
                    if (getAllFiles[i].tag_list != undefined && getAllFiles[i].tag_list != null) {
                        for (var t = 0; t < getAllFiles[i].tag_list.length; t++) {
                            if (allFileUseTag.indexOf(getAllFiles[i].tag_list[t]) == -1) {
                                allFileUseTag.push(getAllFiles[i].tag_list[t]);
                                if (allUsesTag.indexOf(getAllFiles[i].tag_list[t]) == -1) {
                                    allUsesTag.push(getAllFiles[i].tag_list[t]);
                                }
                                if (allShareTags.indexOf(getAllFiles[i].tag_list[t]) > -1) {
                                    if (allUsesShareTag.indexOf(getAllFiles[i].tag_list[t]) == -1) {
                                        allUsesShareTag.push(getAllFiles[i].tag_list[t])
                                    }
                                }
                            }
                        }
                    }
                }
            }

            var resData = {
                all_tags: allTagsIds,
                all_uses_tag: allUsesTag,
                all_shared_tag: allShareTags,
                all_uses_share_tag: allUsesShareTag,
                status: true
            }

            callback(resData);



        })
        socket.on('SetURLshorten', function(data, callback) {
            var rawdata = fs.readFileSync('URL_Data.json');
            var allUrl = {};
            if (!isObjectEmpty(rawdata)) {
                allUrl = JSON.parse(rawdata);
            }
            if (data.type == 'single') {
                var uniq = shortid.generate();
                var file_name = data.link.split('/');
                file_name = file_name[file_name.length - 1];
                console.log(4538, data, allUrl[file_name + data.user_id])
                if (typeof(allUrl[file_name + data.user_id]) == 'undefined') {
                    if (data.create) {
                        allUrl[uniq] = file_name + data.user_id;
                        allUrl[file_name + data.user_id] = { url: data.link, shortid: uniq }

                        var strignFlyData = JSON.stringify(allUrl);
                        console.log(4545, data)

                        fs.writeFile("URL_Data.json", strignFlyData, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                callback({ data: uniq, old: false });
                            }
                        });
                    } else {
                        callback({ old: false });
                    }
                } else {
                    callback({ data: allUrl[file_name + data.user_id].shortid, old: true });

                }

            } else {
                var newUniqArray = [];
                var changeStatus = false;
                _.each(data.linkArray, function(v, k) {
                    var uniq = shortid.generate();
                    var file_name = v.split('/');
                    file_name = file_name[file_name.length - 1];
                    if (typeof(allUrl[file_name + data.user_id]) == 'undefined') {
                        allUrl[uniq] = file_name + data.user_id;
                        allUrl[file_name + data.user_id] = { url: v, shortid: uniq }
                        changeStatus = true;
                        newUniqArray.push(uniq);
                    } else {
                        newUniqArray.push(allUrl[file_name + data.user_id]["shortid"]);
                    }
                    // allUrl[uniq] = v;
                    // newUniqArray.push(uniq)
                });
                var strignFlyData = JSON.stringify(allUrl);
                if (changeStatus) {
                    fs.writeFile("URL_Data.json", strignFlyData, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            callback({ data: newUniqArray });
                        }
                    });
                } else {
                    callback({ data: newUniqArray });
                }
            }
        })
        socket.on('teamtoDeleteUserBefore',function(data,callback){
            models.instance.Conversation.find({group_keyspace:data.team_id},{allow_filtering:true,raw:true},function(err,result){
                if(err){
                    console.log(5468,err)
                }else{
                    var allConversation = [];
                    for(let u of result){
                        if(u.participants.indexOf(data.user_id) > -1){
                            allConversation.push(u);
                        }
                    }
                    callback({status:true,data:allConversation});
                }
            })
        })
        socket.on('SetURLshortenAll', function(callback) {
            var rawdata = fs.readFileSync('URL_Data.json');
            var allUrl = {};
            if (!isObjectEmpty(rawdata)) {
                allUrl = JSON.parse(rawdata);
            }
            callback(allUrl)

        })

        function getOneMsg(msg_id) {
            return new Promise((resolve, reject) => {
                read_msg_data(msg_id, function(res) {
                    resolve(res);
                })
            })
        }
        socket.on('findTeamChecklistData', async function(data, callback) {
            var resData = { status: false };
            var teamTaskData = await getTeamTaskData(data);
            var getChecklistData = await findTeamChecklistData(data);
            var msg_data = {};
            if (getChecklistData.status) {
                if (getChecklistData.data.length > 0) {
                    msg_data = await getOneMsg(getChecklistData.data[0].msg_id);
                    msg_data['checklist'] = getChecklistData.data;
                    resData = { status: true, msg: msg_data }
                    callback(resData);
                    return false;
                } else {
                    if (getChecklistData.data.length == 0 && teamTaskData.data.length > 0) {
                        var data = {
                                convid: teamTaskData.data[0].conversation_id,
                                msg_id: teamTaskData.data[0].msg_id
                            }
                            // console.log(4801, teamTaskData.data[0]);23
                        deleteEmptyTeamTask(data, function(res) {
                            res.data['type'] = 'deleted';
                            resData = { status: false, msg: res.data, getTeamTaskData: teamTaskData.data, getChecklistData: getChecklistData.data }
                            callback(resData);
                            return false;
                        });
                    } else {
                        callback(resData);
                    }
                }

            }
            // callback(resData);

        })
        socket.on('updateConversation_seen', function(data, callback) {
            if (data.type == 'array') {
                var msg_ids = [];
                for (let i = 0; i < data.msg_id.length; i++) {
                    msg_ids.push(models.timeuuidFromString(data.msg_id[i]));
                }
                console.log(4747, data)
                models.instance.Messages.update({ msg_id: { $in: msg_ids }, conversation_id: models.uuidFromString(data.conversation_id) }, { msg_status: { $remove: [data.user_id] }, edit_seen: { $remove: [data.user_id] } }, function(err, res) {
                    if (err) {
                        console.log(4748, err);
                    } else {
                        callback(res);
                    }
                })
            }

        })
        socket.on('getAllSubConversation', function(conversation_id, callback) {
            models.instance.Conversation.find({ root_conv_id: conversation_id }, { raw: true, allow_filtering: true }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback(result)
                }
            })

        })
        socket.on('convert_conversation', function(data, callback) {
            if (data.root_conv_id != null) {
                models.instance.Conversation.find({ root_conv_id: data.root_conv_id }, { raw: true, allow_filtering: true }, function(err, res) {
                    if (err) {
                        callback({ staus: false, err: err });
                    } else {
                        if (res.length >= 10) {
                            callback({ status: true, limit: false })
                        } else {
                            convert_conversation(data, callback);
                        }
                    }
                })

            } else {
                convert_conversation(data, callback);

            }

        });
        socket.on('filter_all_conv_emit', function(user_id, callback) {
            models.instance.Conversation.find({ participants: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback(result);
                }
            })

        });
        socket.on('delete_link_signle', function(data, callback) {
            models.instance.Link.update({ url_id: models.timeuuidFromString(data.url_id), conversation_id: models.uuidFromString(data.conversation_id) }, { has_delete: { $add: [data.user_id] } }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback({ status: true, result: result });
                }
            })

        });
        socket.on('updateDeleteLinkids', function(id, callback) {
            socket.broadcast.emit('updateDeleteLinkids', id)

        });
        socket.on('updateLinkTitle', function(data, callback) {

            models.instance.Link.update({ conversation_id: models.uuidFromString(data.conversation_id), url_id: models.timeuuidFromString(data.url_id) }, { title: data.title }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback({ status: true });
                }
            })

        });
        socket.on('find_allfiles', function(callback) {
            models.instance.File.find({ is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, files) {
                if (err) {
                    callback({ status: false, error: err })
                } else {
                    callback({ status: true, files: _.orderBy(files, ["created_at"], ['desc']) });
                }
            });
        });

        socket.on('broadcast_for_msg_send', async function(data) {
            var getMsg = await getOneMsg(data.msg_id);
            for (p in data.conv.participants) {
                console.log(5245, data.conv.participants[p])
                io.to(data.conv.participants[p]).emit('newMessage', { msg: getMsg, conversation_type: data.conv.topic_type, conversation_title: data.conv.title, conversation_img: data.conv.conv_img });
            }

        });

        socket.on('forwardFiles', async function(data, callback) {
            var copyMyFiles = await copyFilesData(data);
            if (copyMyFiles.status) {
                var q = [];
                for (c in data.conversations) {
                    console.log(52, copyMyFiles.msgids[data.conversations[c]].toString());
                    console.log(52, models.timeuuidFromString(copyMyFiles.msgids[data.conversations[c]].toString()));
                    var msg = {
                        msg_id: models.timeuuidFromString(copyMyFiles.msgids[data.conversations[c]].toString()),
                        conversation_id: models.uuidFromString(data.conversations[c]),
                        sender: models.uuidFromString(data.user_id),
                        sender_name: 'demo',
                        sender_img: 'demo.jpg',
                        msg_type: 'text',
                        msg_body: data.comments,
                        root_conv_id: null,
                        attch_imgfile: [],
                        attch_audiofile: [],
                        attch_videofile: [],
                        attch_otherfile: [],
                        forward_by: models.uuidFromString(data.user_id),
                        forward_at: moment().format().toString(),
                    }
                    for (f in data.files) {
                        if (data.files[f].file_type.indexOf('image') > -1) {
                            msg['attch_imgfile'].push(data.files[f].location.toString());
                        } else if (data.files[f].file_type.indexOf('audio') > -1) {
                            msg['attch_audiofile'].push(data.files[f].location.toString());
                        } else if (data.files[f].file_type.indexOf('video') > -1) {
                            msg['attch_videofile'].push(data.files[f].location.toString());
                        } else {
                            msg['attch_otherfile'].push(data.files[f].location.toString());
                        }
                    }
                    console.log(52, 73, msg)
                    var n = new models.instance.Messages(msg)
                    var save_query = n.save({ return_query: true });
                    q.push(save_query);
                    var n2 = models.instance.Conversation.update({ conversation_id: models.uuidFromString(data.conversations[c]), company_id: models.timeuuidFromString(data.company_id) }, { last_msg_time: moment().format().toString(), last_msg: msg.msg_body }, { return_query: true });
                    // var save_query2 = n2.save({return_query: true});
                    q.push(n2);
                    // new models.instance.Messages(msg).save(function(err,result){
                    //   if(err){
                    //     console.log(err);
                    //   }else{
                    //     models.instance.Messages.findOne({conversation_id:msg.conversation_id,msg_id:msg.msg_id},function(error,res){
                    //       if(error){
                    //         console.log(error);
                    //       }else{
                    //         callback({status:true,data:res});
                    //       }
                    //     })
                    //   }
                    // })

                }
                models.doBatch(q, function(err) {
                    if (err) throw err;
                    callback({ status: true, msgAndConv: copyMyFiles.msgAndConv });
                });
            }
        });
        var copyFilesData = (data) => {
            return new Promise((resolve, reject) => {
                var newMsgIds = {};
                var msgAndConv = [];
                var filesData = [];
                var q = [];
                for (c in data.conversations) {
                    newMsgIds[data.conversations[c]] = models.timeuuid()
                    msgAndConv.push({ msg_id: newMsgIds[data.conversations[c]], conversation_id: data.conversations[c] });
                    for (f in data.files) {
                        let d = data.files[f];
                        d.conversation_id = models.uuidFromString(data.conversations[c]);
                        d.user_id = models.uuidFromString(data.user_id);
                        d.id = models.timeuuid();
                        d.msg_id = newMsgIds[data.conversations[c]];
                        var n = new models.instance.File(d);
                        var save_query = n.save({ return_query: true });
                        q.push(save_query);
                        filesData.push(d)
                    }
                }
                models.doBatch(q, function(err) {
                    if (err) throw err;

                    resolve({ status: true, files: filesData, msgids: newMsgIds, msgAndConv: msgAndConv });
                });
            })
        }
        socket.on('updatePartiOnFly', function(data) {
            console.log(5085)
            socket.broadcast.emit('updatePartiOnFly', data);
        });

        socket.on('saveLinkTitle', function(data, callback) {
            models.instance.Link.update({ url_id: models.timeuuidFromString(data.url_id), conversation_id: models.uuidFromString(data.conversation_id) }, { title: data.title }, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    socket.broadcast.emit('updateLinkTitle', data);
                    // io.to(data.user_id).emit("updateLinkTitleSync", data);
                    callback(res);
                }
            })
        })
        socket.on('find_msg_to_link', function(msg_id, callback) {
            models.instance.Link.find({ msg_id: msg_id }, { allow_filtering: true, raw: true }, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    callback(res);
                }
            })
        })
        socket.on('getOneMessage', function(data, callback) {
            models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { allow_filtering: true, raw: true }, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(5732, data)
                    if (data.conv_type == 'null') {
                        let n = { rep: false, data: res }
                        callback(n);
                    } else {
                        models.instance.ReplayConv.find({ rep_id: models.uuidFromString(data.conversation_id) }, { raw: true, allow_filtering: true }, function(err2, res2) {
                            if (err2) {
                                console.log(err2);
                            } else {
                                if (res2.length > 0) {
                                    models.instance.Messages.find({ conversation_id: models.uuidFromString(res2[0].conversation_id.toString()), msg_id: models.timeuuidFromString(res2[0].msg_id.toString()) }, { allow_filtering: true, raw: true }, function(err3, res3) {
                                        if (err3) {
                                            console.log(err3)
                                        } else {
                                            let n = { rep: true, data: res3 }
                                            callback(n);

                                        }
                                    });
                                } else {
                                    callback([]);
                                }
                            }
                        })
                    }
                }
            })
        })
        socket.on('findLinkData', function(data, callback) {
            models.instance.Link.find({ msg_id: data.msg_id }, { allow_filtering: true, raw: true }, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    callback(res);
                }
            })
        })
        socket.on('thistagUseOrNot', function(data, callback) {
            models.instance.File.find({ tag_list: { $contains: data.tag_id } }, { raw: true, allow_filtering: true }, function(err, res) {
                if (err) {
                    console.log(err)
                    callback({ status: false })
                } else {
                    if (res.length > 0) {
                        callback({ status: true })
                    } else {
                        callback({ status: false })
                    }
                }
            })
        })
        socket.on('confirmTagDelete', function(data, callback) {
            models.instance.UserTag.delete({ tagged_by: models.uuidFromString(data.tagged_by), tag_id: models.timeuuidFromString(data.tag_id) }, function(err, result) {
                if (err) {
                    callback({ status: false, err: err });
                } else {
                    callback({ status: true, data: result });
                }
            })
        })
        socket.on('confirmTagEdit', function(data, callback) {
            models.instance.UserTag.update({ tagged_by: models.uuidFromString(data.tagged_by), tag_id: models.timeuuidFromString(data.tag_id) }, { title: data.title, tag_color: data.tag_color, team_list: data.team_list }, function(err, result) {
                if (err) {
                    callback({ status: false, err: err });
                } else {
                    callback({ status: true, data: result });
                }
            })
        })
        socket.on('getAllLinks', async function(conversation_id, callback) {
            var allLInks = await getALlMessagesLinkData(conversation_id);
            callback(allLInks)
        })
        socket.on('getMyActivity', function(data, callback) {
            models.instance.UserActivity.find({receiver_id:data.user_id},function(err,res){
            // models.instance.UserActivity.find({},function(err,res){
                if(err){
                    callback({status:false,data:err})
                }else{
                    callback({status:true,data:res});
                }
            })
        })
        socket.on("room_converted_emit", async function(data, callback) {
            console.log(5040, data);
            var convdata = await findThisConvData(data);
            if (data.type == "subroom2mainroom") {
                console.log(5043);
                var rootconvdata = await findThisConvData({ conversation_id: data.old_root_conv_id });
            } else if (data.type == "mainroom2subroom") {
                console.log(5046);
                var rootconvdata = await findThisConvData({ conversation_id: data.new_root_conv_id });
            }
            for (var i = 0; i < rootconvdata.participants.length; i++) {
                io.to(rootconvdata.participants[i]).emit("room_converted_brodcast", { data, rootconvdata, convdata });
            }
            for (var i = 0; i < convdata.participants.length; i++) {
                if (rootconvdata.participants.indexOf(convdata.participants[i]) == -1)
                    io.to(convdata.participants[i]).emit("room_converted_brodcast", { data, rootconvdata, convdata });
            }
            callback({ data, rootconvdata, convdata });
        });

        function findThisConvData(data) {
            return new Promise((resolve, reject) => {
                models.instance.Conversation.findOne({ conversation_id: models.uuidFromString(data.conversation_id.toString()) }, function(err, result) {
                    if (err) throw err;
                    else resolve(result);
                })
            })
        }

        function findAllGuestMember(data) {
            return new Promise((resolve, reject) => {
                models.instance.Conversation.find({ root_conv_id: data.root_conv_id.toString() }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(5032, result.length);
                        if (result.length > 0) {
                            var subconvparti = [];
                            var allMembers = [];
                            for (let i = 0; i < result.length; i++) {
                                if (data.sub_conv_id.toString() == result[i].conversation_id.toString()) {
                                    subconvparti = result[i].participants;
                                } else {
                                    if (result[i].participants != null) {
                                        for (let l = 0; l < result[i].participants.length; l++) {
                                            if (allMembers.indexOf(result[i].participants[l]) == -1) {
                                                allMembers.push(result[i].participants[l]);
                                            }
                                        }
                                    }
                                }
                            }
                            var removeGuest = [];
                            console.log(5050, subconvparti)
                            for (let i = 0; i < subconvparti.length; i++) {
                                if (allMembers.indexOf(subconvparti[i]) == -1) {
                                    removeGuest.push(subconvparti[i]);
                                }
                            }
                            console.log(5056, removeGuest)
                            resolve(removeGuest);
                        }
                    }
                })
            })
        }

        function updateMyGuestInRootConv(data, type) {
            console.log(5061, data, type)
            return new Promise((resolve, reject) => {
                models.instance.Conversation.update({ conversation_id: models.uuidFromString(data.conversation_id.toString()), company_id: models.timeuuidFromString(data.company_id.toString()) }, {
                    participants_sub: {
                        [type]: data.allGuestMember
                    },
                    participants: {
                        [type]: data.allGuestMember
                    }
                }, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve({ status: true })
                    }
                })
            })
        }


        async function convert_conversation(data, callback) {
            console.log(5019, data)
            var findConvData = await findThisConvData({ conversation_id: data.conversation_id });
            if (findConvData.root_conv_id !== null) {
                var rootConvIdData = await findThisConvData({ conversation_id: findConvData.root_conv_id });
                var allGuestMember = await findAllGuestMember({ root_conv_id: rootConvIdData.conversation_id, sub_conv_id: data.conversation_id });
                var myguest = [];
                if (rootConvIdData.participants_guest !== null) {
                    for (let i = 0; i < allGuestMember.length; i++) {
                        if (rootConvIdData.participants_guest.indexOf(allGuestMember[i]) > -1) {
                            myguest.push(allGuestMember[i]);
                        }
                    }
                }
                if (allGuestMember.length > 0) {
                    await updateMyGuestInRootConv({ conversation_id: rootConvIdData.conversation_id, allGuestMember: myguest, company_id: data.company_id }, '$remove');
                }

            } else {
                var rootConvIdData = await findThisConvData({ conversation_id: data.root_conv_id });
                var guest = [];
                for (var i = 0; i < findConvData.participants.length; i++) {
                    if (rootConvIdData.participants.indexOf(findConvData.participants[i]) == -1) {
                        guest.push(findConvData.participants[i]);
                    }
                }
                console.log(5091, { conversation_id: rootConvIdData.conversation_id, allGuestMember: guest, company_id: data.company_id })
                await updateMyGuestInRootConv({ conversation_id: rootConvIdData.conversation_id, allGuestMember: guest, company_id: data.company_id }, '$add');
            }

            models.instance.Conversation.update({ conversation_id: models.uuidFromString(data.conversation_id), company_id: models.timeuuidFromString(data.company_id) }, { root_conv_id: data.root_conv_id }, function(err, result) {
                if (err) {
                    callback({ status: false, error: err });
                } else {
                    var msg = '';
                    console.log(5025, data)
                    if (data.root_conv_id == null) {
                        msg = 'Converted from sub-conversation to main conversation';
                    } else {
                        msg = 'Converted from main conversation to sub-conversation';
                    }
                    var newD = {
                            type: 'welcome',
                            sender: data.user_id,
                            sender_name: 'demo',
                            sender_img: 'feelix.jpg',
                            conversation_id: data.conversation_id,
                            msg_type: 'notification',
                            msg_body: msg,
                            root_conv_id: data.root_conv_id
                        }
                        // socket.join(result.conversation_id.toString());
                    send_notification_msg(newD, async function(res) {
                        // console.log(5042,res)
                    });

                    callback({ status: true, limit: true, root_conv_id: findConvData.root_conv_id });
                }
            })
        }

    });

    return router;
}