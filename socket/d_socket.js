var _ = require('lodash');
var moment = require('moment');
var { models } = require('./../config/db/express-cassandra');
module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var { sendNewMsg, send_notification_msg,send_msg_firebase } = require('./../utils/message');
    var {
        hideRoom,
        checkParticipants,
        updateConvStatus,
        room_members
    } = require('./../utils/conversation');
    const isEmpty = require('../validation/is-empty');
    var {
        saveActivityUtils,
        saveActivityByUtils,
        saveParticipantsUtils,
        singleActivityUtils,
        singleActivityParticipantsUtils,
        childActivitysResponseUtils,
        activityUpdateSocketUtils,
        subActivitiesParticipantsUtils,
        deleteParticipants,
        deleteActivityUtils,
        saveCustomColUtils,
        customActivityColUtils,
        customColUpdateUtils,
        ccolValUpdateUtils,
        activityUtilityUtils,
        singleActivityPinUtils,
        singleActivityFlagUtils,
        get_myTags,
        get_messages_tag,
        getActivityDetail,
        customStatusSaveUtils,
        getMycustomStatus,
        flaggeddDataUtils,
        deleteStatusUtils,
        cStatusUpdateUtils,
        UpdateLogEntryUtils,
        _partiDltUtils,
        updateBatchPriorityUtils,
        saveParticipants_onfly,
        _setting_utils,
        activitySettingUtils,
        getThisChangeLog,
        getMyactivitiesOnConnectUtils,
        _saveColSerial_utils,
        _getAllColSortOnSingleActivity,
        _convarsationListUtils,
        businessUnitSearch,
        conversationTagSearch,
        updateUserEmail,
        updateUserName
    } = require('./../utils/activity');
    
    // async function send_msg_firebase(user_id, data, fcm_type, calling_data = false) {
    //     if (user_id && data) {
    //         models.instance.Users.findOne({ id: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
    //             if (err) {} else {
    //                 if (user && user.fcm_id) {
    //                     let data2send = { fcm_type: fcm_type };
    //                     var options = {
    //                         priority: "high",
    //                         timeToLive: 60 * 60 * 24,
    //                         mutableContent: true,
    //                         //   contentAvailable: true
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
    //                     data2send['fcm_type'] = fcm_type;
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
    //                                 } else {
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
    //                                     //   "category" : "VIEWORCANCEL"
    //                                 };
    //                             }

    //                             firebase_admin.messaging().sendToDevice(fcm_id, message, options)
    //                                 .then(function(response) {
    //                                     // console.log("========> Firebase:Ok:", message.data.fcm_type, response);
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

    io.on('connection', function(socket) {
        socket.on('checklistBrdcast', function(message, callback) {
            socket.broadcast.emit('new_checklist', message); // this emit receive all users except me
            callback({ 'msg': 'success' });
        });

        socket.on('closeRoom', function(params, callback) {
            if (params.conv_id != undefined) {
                updateConvStatus(params.conv_id, params.conv_type, params.dataId, params.company_id, (result) => {
                    if (result.status) {
                        checkParticipants(params.conv_id)
                            .then((response) => {
                                if (response.conversation.participants.length > 0) {
                                    let data = {
                                        conversation_id: params.conv_id,
                                        conversation_name: response.conversation.title,
                                        participants: response.conversation.participants,
                                        participants_admin: response.conversation.participants_admin,
                                        closed_by: params.dataId_name,
                                        type: (params.conv_type == 'close' ? 'closed' : 'reopened'),
                                        last_update_time: moment(new Date().getTime()).format('DD-MM-YYYY LT')
                                    }
                                    socket.broadcast.emit('colseBroadcast', data); // this emit receive all users except me
                                    var str = "This room has been " + (params.conv_type == 'close' ? 'closed' : 'reopened') + " by " + params.dataId_name;
                                    var attach_files = undefined;
                                    var notidata = {
                                        type: 'room_close',
                                        sender: params.dataId,
                                        sender_name: params.dataId_name,
                                        sender_img: params.dataId_img,
                                        conversation_id: params.conv_id,
                                        msg_type: 'notification',
                                        msg_body: str
                                    }
                                    send_notification_msg(notidata, async function(res) {
                                        if (res.status) {
                                            res.data.attch_imgfile = [];
                                            res.data.attch_audiofile = [];
                                            res.data.attch_videofile = [];
                                            res.data.attch_otherfile = [];

                                            var conv_members = await room_members(notidata.conversation_id, notidata.sender);
                                            var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                            var conversation_title = conv_members.group == 'yes' ? conv_members.title : notidata.sender_name;
                                            var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : notidata.sender_img;

                                            for (var n = 0; n < conv_members.participants.length; n++) {
                                                io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: res.data, conversation_type, conversation_title, conversation_img });
                                                send_msg_firebase(conv_members.participants[n], { status: true, msg: res.data, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                            }

                                            //   socket.broadcast.emit('newMessage', {status:true,msg:res.data});
                                            //   socket.emit('newMessage', {status:true,msg:res.data});
                                            callback({ status: true, msg: 'success', data: res.data });
                                        }
                                    })

                                } else {
                                    callback({ status: true, msg: 'success' });
                                }
                            }).catch((crr) => {
                                callback({ msg: 'fail', status: false });
                            });
                    } else {
                        callback({ status: false, msg: 'fail', res: result.err });
                    }
                });
            }
        });

        socket.on('reopenThisRoom', function(params, callback) {
            if (params.conv_id != undefined) {
                updateConvStatus(params.conv_id, params.conv_type, params.dataId, params.company_id, (result) => {
                    if (result.status) {
                        checkParticipants(params.conv_id)
                            .then((response) => {
                                if (response.conversation.participants.length > 0) {

                                    let data = {
                                        conversation_id: params.conv_id,
                                        conversation_name: response.conversation.title,
                                        created_by: response.conversation.created_by,
                                        group_keyspace: response.conversation.group_keyspace,
                                        participants: response.conversation.participants,
                                        participants_admin: response.conversation.participants_admin,
                                        closed_by: params.dataId_name,
                                        type: (params.conv_type == 'close' ? 'closed' : 'reopened')
                                    }
                                    socket.broadcast.emit('colseBroadcast', data); // this emit receive all users except me
                                    var str = "This room has been " + (params.conv_type == 'close' ? 'closed' : 'reopened') + " by " + params.dataId_name;
                                    var attach_files = undefined;

                                    var notidata = {
                                        type: 'reopen_room',
                                        sender: params.dataId,
                                        sender_name: params.dataId_name,
                                        sender_img: params.dataId_img,
                                        conversation_id: params.conv_id,
                                        msg_type: 'notification',
                                        msg_body: str
                                    }
                                    send_notification_msg(notidata, async function(res) {
                                        if (res.status) {
                                            res.data.attch_imgfile = [];
                                            res.data.attch_audiofile = [];
                                            res.data.attch_videofile = [];
                                            res.data.attch_otherfile = [];

                                            var conv_members = await room_members(notidata.conversation_id, notidata.sender);
                                            var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                            var conversation_title = conv_members.group == 'yes' ? conv_members.title : notidata.sender_name;
                                            var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : notidata.sender_img;

                                            for (var n = 0; n < conv_members.participants.length; n++) {
                                                io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: res.data, conversation_type, conversation_title, conversation_img });
                                                send_msg_firebase(conv_members.participants[n], { status: true, msg: res.data, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                            }

                                            // socket.broadcast.emit('newMessage', {status:true,msg:res.data});
                                            // socket.emit('newMessage', {status:true,msg:res.data});
                                            callback({ status: true, msg: 'success', data: res.data });
                                        }
                                    })
                                } else {
                                    callback({ status: true, msg: 'success' });
                                }
                            }).catch((crr) => {
                                callback({ status: false, msg: 'fail' });
                            });
                    } else {
                        callback({ status: false, msg: 'fail', res: result.err });
                    }
                });
            }
        });

        socket.on('hideroom', function(params, callback) {
            if (params.conv_id != undefined) {
                hideRoom(params.conv_id, params.dataId, params.company_id, (result) => {
                    if (result.status) {
                        callback({ msg: 'success' });
                    } else {
                        callback({ msg: 'fail', res: result.err });
                    }
                });
            }
        });

        // For Old Activity Save
        socket.on('saveActivitySocket', async function(params, callback) {
            var activityResponse = await saveActivityUtils(params.data).catch((err) => { console.log(199, err) });
            callback(activityResponse);
        });

        // For new Activity Save
        socket.on('saveActivityBySocket', async function(params, callback) {
            var activityResponse = await saveActivityByUtils(params.data).catch((err) => { console.log(205, err) });
            callback(activityResponse);
        });

        socket.on('saveParticipants', async function(params, callback) {
            var participantsResponse = await saveParticipantsUtils(params.data).catch((err) => { console.log(210, err) });
            socket.broadcast.emit('CreateActivityBrdcst', { status: '200', params });
            callback(participantsResponse);
        });

        // Old Single Activity
        socket.on('singleActivity', async function(params, callback) {

            var singleActivityResponse = await singleActivityUtils(params.data).catch((err) => { console.log(113, err) });
            var singleActivityParticipantsResponse = await singleActivityParticipantsUtils(params.data).catch((err) => { console.log(114, err) });
            var childActivitysResponse = await childActivitysResponseUtils(params.data).catch((err) => { console.log(115, err) });
            var singleActivityPinResponse = await singleActivityPinUtils(params.data).catch((err) => { console.log(116, err) });
            var activitySettingResponse = await activitySettingUtils(params.data).catch((err) => { console.log(116, err) });
            var singleActivityFlagResponse = await singleActivityFlagUtils(params.data).catch((err) => { console.log(117, err) });
            var get_myTagsResponse = await get_myTags(params.data).catch((err) => { console.log(118, err) });
            var getMycustomStatusResponse = await getMycustomStatus(params.data).catch((err) => { console.log(119, err) });
            var getChangeLogResponse = await getThisChangeLog(params.data).catch((err) => { console.log(197, err) });
            var _getAllColSortOnSingleActivityRes = await _getAllColSortOnSingleActivity(params.data.activity_id).catch((err) => { console.log(200, err) });

            var tagID = [];
            var condtagsid = [];

            _.each(get_myTagsResponse.Ctags, function(value, key) {
                tagID.push(value.id.toString());
                condtagsid.push(value.tag_id.toString());
            });

            var get_msgTagsResponse = await get_messages_tag(params.data).catch((err) => { console.log(128, err) });

            callback({
                singleActivityResponse: singleActivityResponse,
                singleActivityParticipantsResponse: singleActivityParticipantsResponse,
                childActivitysResponse: childActivitysResponse,
                singleActivityPinResponse: singleActivityPinResponse,
                singleActivityFlagResponse: singleActivityFlagResponse,
                totalTags: get_myTagsResponse.tags,
                tags: tagID,
                condtagsid: condtagsid,
                messagestag: get_msgTagsResponse.tags,
                customStatusResponse: getMycustomStatusResponse,
                activitySettingResponse: activitySettingResponse,
                getChangeLogResponse: getChangeLogResponse,
                _getAllColSortOnSingleActivityRes: _getAllColSortOnSingleActivityRes
            });
        });

        // New Single Activity
        socket.on('singleActivityBySocket', async function(params, callback) {
            var singleActivityResponse = await singleActivityUtils(params.data).catch((err) => { console.log(113, err) });

            callback({ singleActivityResponse: singleActivityResponse });
        });

        socket.on('childActivitys', async function(params, callback) {
            var childActivitysResponse = await childActivitysResponseUtils(params.data).catch((err) => { console.log(144, err) });
            var customActivityColRes = await customActivityColUtils(params.data).catch((err) => { console.log(145, err) });

            var acti_id = [];
            _.each(childActivitysResponse.activities, function(v, k) {
                if (acti_id.indexOf(v.activity_id.toString()) == -1) {
                    acti_id.push(v.activity_id.toString());
                }
            });


            if (acti_id.length > 0) {
                var childActivityFlagResponse = await flaggeddDataUtils(acti_id, params.data.created_by).catch((err) => { console.log(156, err) });

                var subActivitiesParticipantsresponse = await subActivitiesParticipantsUtils(acti_id).catch((err) => { console.log(158, err) });
                callback({
                    childActivitysResponse: childActivitysResponse,
                    subActivitiesParticipantsresponse: subActivitiesParticipantsresponse,
                    customActivityColRes: customActivityColRes,
                    childActivityFlagResponse: childActivityFlagResponse
                });
            } else {
                callback({
                    childActivitysResponse: childActivitysResponse,
                    subActivitiesParticipantsresponse: { status: false },
                    customActivityColRes: customActivityColRes,
                    childActivityFlagResponse: { status: false }

                });
            }
        });

        socket.on('activityUpdateSocket', async function(params, callback) {
            var activityUpdateResponse = await activityUpdateSocketUtils(params.data).catch((err) => { console.log(289, err) });
            socket.broadcast.emit('update_activity_on_fly', { status: '200', params });
            UpdateLogEntryUtils(params.data);
            callback({
                activityUpdateResponse: activityUpdateResponse
            });
        });

        socket.on('activityBatchUpdateSocket', async function(params, callback) {
            var activityUpdateResponse = await updateBatchPriorityUtils(params.data).catch((err) => { console.log(298, err) });
            // socket.broadcast.emit('update_activity_on_fly', { status: '200', params });
            //UpdateLogEntryUtils(params.data);
            callback({
                activityUpdateResponse: activityUpdateResponse
            });
        });

        socket.on('assigneeParticipantsDeleteSocket', async function(params, callback) {
            deleteParticipants(params.data, (response) => {
                socket.broadcast.emit('deleteParticipants_socket', { status: '200', params });
                callback(response);
            });
        });

        socket.on('deleteActivitySocket', async function(params, callback) {
            var deleteActivityResponse = await deleteActivityUtils(params.data).catch((err) => { console.log(192, err) });
            callback({
                deleteActivityResponse: deleteActivityResponse
            });
        });

        socket.on('deleteStatusSocket', async function(params, callback) {
            var deleteStatusResponse = await deleteStatusUtils(params.data).catch((err) => { console.log(199, err) });
            callback({
                deleteStatusResponse: deleteStatusResponse
            });
        });

        socket.on('saveCustomColSocket', async function(params, callback) {
            var saveCustomColResponse = await saveCustomColUtils(params.data).catch((err) => { console.log(206, err) });
            callback({
                saveCustomColResponse: saveCustomColResponse
            });
        });

        socket.on('customColSaveSocket', async function(params, callback) {
            var customColUpdateResponse = await customColUpdateUtils(params.data).catch((err) => { console.log(213, err) });
            callback({
                customColUpdateResponse: customColUpdateResponse
            });
        });

        socket.on('colValUpdateSocket', async function(params, callback) {
            var colValUpdateResponse = await ccolValUpdateUtils(params.data).catch((err) => { console.log(220, err) });
            callback({
                colValUpdateResponse: colValUpdateResponse
            });
        });

        socket.on('customStatusUpdateSocket', async function(params, callback) {
            var cStatusUpdateResponse = await cStatusUpdateUtils(params.data).catch((err) => { console.log(227, err) });
            callback({
                cStatusUpdateResponse: cStatusUpdateResponse
            });
        });

        socket.on('activityUtilitySocket', async function(params, callback) {
            var activityUtilityResponse = await activityUtilityUtils(params.data).catch((err) => { console.log(234, err) });
            callback({
                activityUtilityResponse: activityUtilityResponse
            });
        });

        socket.on('activityHistorySocket', async function(params, callback) {
            var acti_id = [];
            acti_id.push(params.data.targetId);
            var subActivitiesParticipantsresponse = await subActivitiesParticipantsUtils(acti_id).catch((err) => { console.log(158, err) });
            if (subActivitiesParticipantsresponse.status) {
                var participants = subActivitiesParticipantsresponse.data;
                var participants_ss = [];

                _.each(participants, function(v, k) {
                    _.each(v, function(vu, ku) {
                        participants_ss.push({
                            userid: vu.user_id.toString(),
                            tbl_id: vu.tbl_id.toString(),
                            type: vu.participant_type
                        });
                    });
                });

                getActivityDetail(params.data, (activityDetail) => {
                    callback({ activityDetail, participants_ss });
                });
            }

        });

        socket.on('customStatusSaveSocket', async function(params, callback) {
            var customStatusSaveResponse = await customStatusSaveUtils(params.data).catch((err) => { console.log(247, err) });
            callback({
                customStatusSaveResponse: customStatusSaveResponse
            });
        });

        socket.on('_partiDltSocket', async function(params, callback) {
            deleteParticipants(params.data, (response) => {
                socket.broadcast.emit('deleteParticipants_socket', { status: '200', params });
                callback(response);
            });
        });

        socket.on('_s_p_o_f_socket', async function(params, callback) {
            var _partiDltRes = await saveParticipants_onfly(params.data.activityId, params.data.activityUpdateData, params.data.activityType).catch((err) => { console.log(255, err) });
            callback({
                _partiDltRes: _partiDltRes
            });
        });

        socket.on('_setting_socket', async function(params, callback) {
            var _setting_response = await _setting_utils(params.data).catch((err) => { console.log(301, err) });
            callback({
                _setting_response: _setting_response
            });
        });

        socket.on('singleActivity_participants', async function(params, callback) {
            var singleActivityParticipantsResponse = await singleActivityParticipantsUtils(params.data).catch((err) => { console.log(114, err) });
            callback({
                singleActivityParticipantsResponse: singleActivityParticipantsResponse
            });
        });

        socket.on('getMyactivitiesOnConnectSocket', function(params, callback) {
            getMyactivitiesOnConnectUtils(params.data, function(response) {
                callback(response);
            });
        });

        socket.on('_saveColSerial_socket', async function(params, callback) {
            var _saveColSerial_response = await _saveColSerial_utils(params.data).catch((err) => { console.log(400, err) });
            callback({
                _saveColSerial_response: _saveColSerial_response
            });
        });

        socket.on('updateUserEmail', function(data, callback) {
            updateUserEmail(data, function(response) {
                callback(response);
            });
        });
        
        socket.on('updateUserName', function(data, callback) {
            updateUserName(data, function(response) {
                callback(response);
            });
        });


        /*
        Search keyup value from convarsation table, 
        message tag table and users table, 
        its tricky. happy coding
        */

        socket.on('searchTextOnDetail', function(params, callback) {
            _convarsationListUtils(params.value, params.conversation_list, (convarsationListRes) => {
                var conID = [];
                var businessUnitId = [];
                var businessIDConversation = {};
                if (convarsationListRes.status) {
                    if (convarsationListRes.data.length > 0) {
                        _.forEach(convarsationListRes.data, function(valu, key) {
                            var title = valu.title.toLowerCase();;
                            if (title.search(params.value) > -1) {
                                if (conID.indexOf(valu.conversation_id.toString()) == -1) {
                                    conID.push(valu.conversation_id.toString());
                                }
                            }
                            var group_keyspace = valu.group_keyspace.toLowerCase();
                            if (group_keyspace.search(params.value) > -1) {
                                if (conID.indexOf(valu.conversation_id.toString()) == -1) {
                                    conID.push(valu.conversation_id.toString());
                                }
                            }
                            if (!isEmpty(valu.b_unit_id)) {
                                if (businessUnitId.indexOf(valu.b_unit_id.toString()) == -1) {
                                    businessUnitId.push(valu.b_unit_id.toString());
                                    businessIDConversation[valu.b_unit_id.toString()] = valu.conversation_id.toString();
                                }
                            }

                            if (!isEmpty(valu.participants)) {
                                _.forEach(valu.participants, function(partiv, partik) {
                                    var uName = alluserOnLoad[partiv.toString()].toLowerCase()
                                    if (uName.search(params.value) > -1) {
                                        if (conID.indexOf(valu.conversation_id.toString()) == -1) {
                                            conID.push(valu.conversation_id.toString());
                                        }
                                    }
                                });
                            }
                        });

                        if (businessUnitId.length > 0) {
                            businessUnitSearch(businessUnitId, (response) => {
                                if (response.status) {
                                    _.forEach(response.data, function(resValu, resKey) {
                                        if (resValu != undefined) {
                                            if (businessUnitId.indexOf(resValu.unit_id.toString()) > -1) {
                                                var unit_name = resValu.unit_name.toLowerCase();
                                                if (unit_name.search(params.value) > -1) {
                                                    if (conID.indexOf(businessIDConversation[resValu.unit_id.toString()]) == -1) {
                                                        conID.push(businessIDConversation[resValu.unit_id.toString()]);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if (params.conversation_list.length > 0) {
                                        conversationTagSearch(params.conversation_list, (tagresult) => {
                                            if (tagresult.status) {
                                                _.forEach(tagresult.data, function(tagresValu, tagresKey) {
                                                    if (tagresValu.length > 0) {
                                                        _.forEach(tagresValu, function(tgV, tgK) {
                                                            var tagName = myAllTag[tgV.tag_id.toString()];
                                                            if (tagName.search(params.value) > -1) {
                                                                if (conID.indexOf(tgV.conversation_id.toString()) == -1) {
                                                                    conID.push(tgV.conversation_id.toString());
                                                                }
                                                            }
                                                        });
                                                    }
                                                });

                                                callback({
                                                    searchRes: conID
                                                });
                                            } else {
                                                callback({
                                                    searchRes: conID
                                                });
                                            }
                                        });
                                    }

                                }
                            });

                        } else {
                            if (params.conversation_list.length > 0) {
                                conversationTagSearch(params.conversation_list, (tagresult) => {
                                    if (tagresult.status) {
                                        _.forEach(tagresult.data, function(tagresValu, tagresKey) {
                                            if (tagresValu.length > 0) {
                                                _.forEach(tagresValu, function(tgV, tgK) {
                                                    var tagName = myAllTag[tgV.tag_id.toString()];
                                                    if (tagName.search(params.value) > -1) {
                                                        if (conID.indexOf(tgV.conversation_id.toString()) == -1) {
                                                            conID.push(tgV.conversation_id.toString());
                                                        }
                                                    }
                                                });
                                            }
                                        });

                                        callback({
                                            searchRes: conID
                                        });
                                    } else {
                                        callback({
                                            searchRes: conID
                                        });
                                    }
                                });
                            }
                        }
                    } else {
                        callback({
                            searchRes: conID
                        });
                    }
                }

            });
        });
    });
    return router;
}