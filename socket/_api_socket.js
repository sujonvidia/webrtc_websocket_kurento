var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
const isUuid = require('uuid-validate');
var { models } = require('./../config/db/express-cassandra');
var {
    findConversationHistory,
    createPersonalConv,
    createPersonalConv2,
    getAllTagsforList,
    get_one_room_data,
    get_conv_data,
    room_members,
    room_name_exist
} = require('./../utils/conversation');
var {
    sendNewMsg,
    updateTextMsg,
    send_notification_msg,
    forwardMessage,
    readallmsgintoconv,
    send_msg_firebase
} = require('./../utils/message');

var {
    update_msg_status_add_viewer,
    get_messages_tag,
    createChecklistAndroid,
    updateChecklistAndroid
} = require('./../utils/message');
var { hayvenjs } = require('./../utils/hayvenjs');
var { create_conv_link, hidethisurl, hidethisurl_forAll, delete_selected_link } = require('./../utils/links');
var {
    remove_gcm_id,
    createGroupAndroid,
    updateGroupAndroid,
    join_new_group,
    team_base_user_lists
} = require('./../utils/android');


// async function send_msg_firebase(user_id, data, fcm_type, calling_data = false) {
//     if (user_id && data) {
//         models.instance.Users.findOne({ id: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
//             if (err) {} else {
//                 if (user && user.fcm_id) {
//                     let data2send = {};
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
//                                     // "category" : "VIEWORCANCEL"
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

var { settings } = require('./../utils/settings');
var { signup_utils } = require('./../utils/signup_utils');
var { getAllbunit, findOrAddIndustry } = require('./../utils/b_unit');
var { getAllUserTag } = require('./../utils/user_tag');

function idToNameArr(idArry) {
    var namearr = [];
    _.each(idArry, function(v, k) {
        namearr.push(alluserOnLoad[v])
    });
    return namearr;
}

var get_myTags = (conversation_id, user_id, callback) => {
    models.instance.Tag.find({
        tagged_by: models.uuidFromString(user_id),
        type: "CONNECT"
    }, {
        allow_filtering: true
    }, function(tagserr, tags) {
        if (tagserr) {
            callback({
                status: false,
                err: tagserr
            });
        } else {

            models.instance.Convtag.find({
                conversation_id: models.uuidFromString(conversation_id)
            }, {
                allow_filtering: true
            }, function(err, Ctags) {
                if (tagserr) {
                    callback({
                        status: false,
                        err: tagserr
                    });
                } else {
                    var condtagsid = [];
                    var tagList = [];
                    var conv_tag = {};
                    _.each(Ctags, function(value, key) {
                        if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                            condtagsid.push(value.tag_id.toString());
                            conv_tag[value.tag_id.toString()] = value.id.toString();
                        }
                    });
                    _.each(tags, function(value, key) {
                        var data = {};
                        if (condtagsid.indexOf(value.tag_id.toString()) > -1) {
                            data['isActive'] = true;
                        } else {
                            data['isActive'] = false;
                        }
                        data['tag_id'] = value.tag_id.toString();
                        data['tagged_by'] = value.tagged_by.toString();
                        data['title'] = value.title;
                        data['type'] = value.type;
                        data['created_at'] = value.created_at;
                        if (conv_tag[value.tag_id.toString()] == null || conv_tag[value.tag_id.toString()] == undefined) {
                            data['conv_tag_id'] = 0;
                        } else {
                            data['conv_tag_id'] = conv_tag[value.tag_id.toString()];
                        }

                        tagList.push(data);
                    });
                    callback({
                        status: true,
                        tags: tagList,
                        Ctags: Ctags
                    });
                }
            });
        }
    });
};

var get_messages_tag = (conversation_id, user_id, callback) => {
    models.instance.MessagesTag.find({ conversation_id: models.uuidFromString(conversation_id), tagged_by: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, tags: tags });
        }
    });
};

module.exports = function(io) {

    io.on('connection', function(socket) {
        socket.on('has_server_restart', function(callback) {
            if (socket.handshake.session.login === true)
                callback({ status: true });
            else
                callback({ status: false });
        });

        socket.on('room_name_exist', function(data, callback) {
            console.log('room_name_exist ', data);
            if (isUuid(data.company_id)) {
                room_name_exist(data, (res) => {
                    callback(res);
                });
            } else {
                callback({ status: false, msg: 'Company id missing or invalid' });
            }
        });

        socket.on('group_create', function(message, callback) {
            var str = message.memberList;
            var strUUID = message.memberListUUID;
            var adminList = message.adminList;
            var adminListUUID = message.adminListUUID;
            var memberlist = str.concat(adminList);
            var joinMenber = memberlist.join(',');

            var memberlistUUID = strUUID.concat(adminListUUID);
            if (message.teamname !== "") {
                createGroupAndroid({
                    adminList: adminListUUID,
                    memberList: memberlistUUID,
                    groupName: message.teamname,
                    createdBy: message.createdby,
                    ecosystem: message.selectecosystem,
                    grpprivacy: message.grpprivacy,
                    conv_img: message.conv_img,
                    topic_type: message.topic_type.toLowerCase(),
                    b_unit_id: message.b_unit_id,
                    b_unit_name: message.b_unit_name,
                    readyTag: message.alltags,
                    service_provider: message.service_provider,
                    temTNA: message.temTNA,
                    company_id: message.company_id
                }, (result, err) => {
                    if (err) {
                        console.log(638, err);
                    } else {
                        if (result.status) {
                            var data = {
                                type: 'welcome',
                                sender: message.createdby,
                                sender_name: message.createdby_name,
                                sender_img: message.conv_img,
                                conversation_id: result.conversation_id.toString(),
                                msg_type: 'notification',
                                msg_body: 'Welcome to "' + message.teamname + '" room.'
                            }
                            send_notification_msg(data, async function(res) {
                                    if (res.status) {
                                        var conv_members = await room_members(data.conversation_id, data.sender);
                                        var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                        var conversation_title = conv_members.group == 'yes' ? conv_members.title : data.sender_name;
                                        var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : data.sender_img;

                                        for (var n = 0; n < conv_members.participants.length; n++) {
                                            io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: res.data, conversation_type, conversation_title, conversation_img });
                                            send_msg_firebase(conv_members.participants[n], { status: true, msg: res.data, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                        }

                                        // socket.broadcast.emit('newMessage', {status:true,msg:res.data});
                                        // socket.emit('newMessage', {status:true,msg:res.data});
                                        io.emit('groupCreate', {
                                            room_id: result.conversation_id.toString(),
                                            memberList: strUUID,
                                            adminList: adminListUUID,
                                            selectecosystem: message.selectecosystem,
                                            teamname: message.teamname,
                                            grpprivacy: message.grpprivacy,
                                            conv_img: message.conv_img == "" ? 'feelix.jpg' : message.conv_img,
                                            createdby: message.createdby_name,
                                            createdbyid: message.createdby,
                                            msg_id: res.data.msg_id,
                                            sender_img: message.conv_img == "" ? 'feelix.jpg' : message.conv_img,
                                            sender_name: message.teamname,
                                            memberList_name: str
                                        });

                                        var friend_id = strUUID.slice();
                                        friend_id.splice(friend_id.indexOf(message.createdby), 1);
                                        var callback_data = {
                                            "conversation_id": result.conversation_id.toString(),
                                            "conversation_type": conv_members.group == 'yes' ? 'Group' : 'Personal',
                                            "conversation_with": conv_members.group == 'yes' ? 'Group' : friend_id,
                                            "conversation_title": conversation_title,
                                            "privacy": message.grpprivacy,
                                            "msg_body": data.msg_body,
                                            "participants": strUUID,
                                            "status": 'active',
                                            "is_active": [],
                                            "participants_admin": conv_members.group == 'yes' ? adminListUUID : [],
                                            "participants_name": idToNameArr(strUUID),
                                            "created_at": conv_members.created_at,
                                            "msg_id": res.data.msg_id,
                                            "msg_type": res.data.msg_type,
                                            "sender_img": res.data.sender_img,
                                            "sender_name": res.data.sender_name,
                                            "totalUnread": 0
                                        }
                                        callback({ "status": true, "conversation_id": result.conversation_id, room_info: callback_data });
                                    }
                                })
                                // callback(result);
                        } else {
                            callback({ status: false, err: result.err });
                        }
                    }
                });
            }
        });

        socket.on('send_message_api', async function(message) {
            console.log("_api_socket.js -> send_message_api ->", message);
            message.text = message.text.replace(/<br>/gi, ' \n ');
            message.text = (message.text || "").replace(
                /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
                function(match, space, url) {
                    var hyperlink = url;
                    // console.log(5674, hyperlink);
                    if (!hyperlink.match('^https?:\/\/')) {
                        // console.log(5676, hyperlink);
                        hyperlink = 'http://' + hyperlink;
                    }
                    hyperlink = hyperlink.replace(/&nbsp;/gi, '');
                    // console.log(5680, hyperlink);
                    return space + '<a href="' + hyperlink + '" target="_blank" data-preview="true">' + url + '</a>';
                }
            ); 

            var old_created_time = null;
            var last_update_user = null;
            var allLink = message.allLink;

            if (message.old_created_time != undefined) {
                old_created_time = message.old_created_time;
            }
            if (message.last_update_user != undefined) {
                last_update_user = message.last_update_user
            }
            var conv_members = await room_members(message.conversation_id, message.sender_id);
            if (conv_members.participants.length > 0) {
                // if (message.is_room === false) {
                //   if(message.has_reply == undefined){
                //     message.has_reply = 0;
                //   }
                //   if(message.rep_id == undefined){
                //     message.rep_id = null;
                //   }
                //   var paramsData = {
                //                 io:io,
                //                 socket:socket,
                //                 from:message.sender_id,
                //                 sender_img:message.sender_img,
                //                 sender_name:message.sender_name,
                //                 conversation_id:message.conversation_id,
                //                 msg:message.text,
                //                 attachment:message.attach_files,
                //                 timer:message.has_timer,
                //                 old_created_time:old_created_time,
                //                 last_update_user:last_update_user,
                //                 updatedMsgid:'',
                //                 tag_list:message.tag_list,
                //                 has_reply:message.has_reply,
                //                 rep_id:message.rep_id,
                //                 service_provider:message.selectedSp
                //               }
                //               // console.log(528,paramsData);
                //   sendNewMsg(paramsData, (result, err) => {
                //       if (err) {
                //         console.log(127, err);
                //       } else {
                //         if (result.status) {
                //             // socket.broadcast.emit('newMessage', result);
                //             // io.to(message.sender_id).emit('newMessage', result);
                //             for(var n=0; n<conv_members.length; n++){
                //               io.to(conv_members[n]).emit('newMessage', result, (recNewSms)=>{
                //                 console.log(243, recNewSms);
                //               });
                //             }
                //             if(result.unreadChecklist !== undefined){
                //               if(result.unreadChecklist){
                //                 socket.broadcast.emit('unreadChecklist',result);
                //               }
                //             }
                //         } else {
                //           console.log(result);
                //         }
                //       }
                //     });
                // }
                // else if (message.is_room === true) {
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
                    service_provider: message.selectedSp
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
                                            user_id: message.sender_id,
                                            secret_user:[]
                                        }
                                        console.log(463, linkdata);
                                        create_conv_link(linkdata, function(res) {
                                            console.log(3147, res);
                                        })
                                    }
                                }
                            }
                            // unable to check
                            // result.msg.attch_otherfile_size = [];
                            // if(message.attach_files != undefined && message.attach_files.allfiles !== undefined){
                            //     if(message.attach_files.otherfile != undefined){
                            //         for(let i=0; i < message.attach_files.otherfile.length; i++){
                            //             _.each(message.attach_files.allfiles, function(fv, fk){
                            //                 if(fv.key == message.attach_files.otherfile[i]){
                            //                   result.msg.attch_otherfile_size.push(fv.size);
                            //                 }
                            //             });
                            //         }
                            //     }
                            // }
                            // result.msg.attch_otherfile_size = result.msg.attch_otherfile_size.length == 0 ? null : result.msg.attch_otherfile_size;

                            result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                            result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                            result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                            for (var n = 0; n < conv_members.participants.length; n++) {
                                io.to(conv_members.participants[n]).emit('newMessage', result);
                                send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                            }
                            // socket.broadcast.emit('newMessage', result); // this emit receive all users except me
                            // io.to(message.sender_id).emit('newMessage', result); // this emit receive all users except me
                            // console.log({msg_id: result.res, msg_from: message.to, msg_text: message.text, msg_sender_name: message.sender_name, msg_sender_img: message.sender_img, msg_attach_files: message.attach_files, msg_conv_id: message.conversation_id});
                            // callback(result);
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
                // }
            } else {
                console.log("sendMessageFromMobile member not found error");
            }
        });

        socket.on('get_room_dropdown_data', function(data, callback) {
            console.log(311, data);
            var uid = data.user_id;
            settings.get_allteam(uid, false, (rep) => {
                if (rep.status) {
                    getAllbunit(data, function(res) {
                        if (res.status) {
                            getAllUserTag(data).then((res2) => {
                                if (data.conversation_id !== undefined && data.conversation_id != "") {
                                    get_one_room_data({ conversation_id: data.conversation_id, company_id: data.company_id }, (conv_res) => {
                                        if (conv_res.status) {
                                            conv_res.data.tag_list = conv_res.data.tag_list === null ? [] : conv_res.data.tag_list;
                                            callback({
                                                status: true,
                                                teams: rep.teams,
                                                bUnit: res.data,
                                                tags: res2.data,
                                                conversation: conv_res.data
                                            });
                                        } else {
                                            callback({ status: false, teams: [], industry: [], tags: [], conversation: {} });
                                        }
                                    });
                                } else {
                                    callback({
                                        status: true,
                                        teams: rep.teams,
                                        bUnit: res.data,
                                        tags: res2.data,
                                        conversation: {}
                                    });
                                }
                            }).catch((err) => {
                                callback({ status: false, teams: [], industry: [], tags: [], conversation: {} });
                            });
                        } else {
                            callback({ status: false, teams: [], industry: [], tags: [], conversation: {} });
                        }
                    });
                } else {
                    callback({ status: false, teams: [], industry: [], tags: [], conversation: [] });
                }
            });
        });

        socket.on('get_all_industry', function(callback) {
            findOrAddIndustry(function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            })
        });

        socket.on('get_all_category', function(data, callback) {
            getAllbunit(data, function(res) {
                if (res.status) {
                    callback(res);
                } else {
                    callback(res);
                }
            });
        });

        socket.on('forward_message', function(data, callback) {
            data.msg_id = [data.msg_id];
            if (data.is_group.toLowerCase() == "no") {
                createPersonalConv2(data.user_id, data.share_conv[0], 'NavCon', data.company_id, (result1, err) => {
                    if (err)
                        callback({ status: false, error: err });
                    else {
                        data.share_conv[0] = result1.conversation_id.toString();

                        data['io'] = io;
                        data['socket'] = socket;
                        forwardMessage(data, function(res) {
                            // console.log(831, res);
                            if (res.status) {
                                _.each(res.data, function(v, k) {
                                    v.attch_imgfile = (v.attch_imgfile == null) ? [] : v.attch_imgfile;
                                    v.attch_audiofile = (v.attch_audiofile == null) ? [] : v.attch_audiofile;
                                    v.attch_videofile = (v.attch_videofile == null) ? [] : v.attch_videofile;
                                    v.attch_otherfile = (v.attch_otherfile == null) ? [] : v.attch_otherfile;
                                    _.each(data.share_conv, async function(convv, convk) {
                                        var conv_members = await room_members(convv, data.user_id);
                                        var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                        var conversation_title = conv_members.group == 'yes' ? conv_members.title : v.sender_name;
                                        var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : v.sender_img;
                                        for (var n = 0; n < conv_members.participants.length; n++) {
                                            io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: v, conversation_type, conversation_title, conversation_img });
                                            send_msg_firebase(conv_members.participants[n], { status: true, msg: v, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                        }
                                    });
                                    // io.emit('newMessage', {status:true, msg:v});
                                });
                                callback(res);
                            }
                        });
                    }
                });
            } else {
                data['io'] = io;
                data['socket'] = socket;
                forwardMessage(data, function(res) {
                    if (res.status) {
                        _.each(res.data, function(v, k) {
                            v.attch_imgfile = (v.attch_imgfile == null) ? [] : v.attch_imgfile;
                            v.attch_audiofile = (v.attch_audiofile == null) ? [] : v.attch_audiofile;
                            v.attch_videofile = (v.attch_videofile == null) ? [] : v.attch_videofile;
                            v.attch_otherfile = (v.attch_otherfile == null) ? [] : v.attch_otherfile;
                            _.each(data.share_conv, async function(convv, convk) {
                                var conv_members = await room_members(convv, data.user_id);
                                var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                var conversation_title = conv_members.group == 'yes' ? conv_members.title : v.sender_name;
                                var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : v.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: v, conversation_type, conversation_title, conversation_img });
                                    send_msg_firebase(conv_members.participants[n], { status: true, msg: v, conversation_type, conversation_title, conversation_img }, 'newMessage');
                                }
                            });
                            // io.emit('newMessage', {status:true, msg:v});
                        });
                        callback(res);
                    }
                });
            }
        });

        socket.on('get_conversation_id', function(data, callback) {
            console.log(413, data);
            data.ecosystem = "NavCon";
            createPersonalConv2(data.user_id, data.convid, data.ecosystem, data.company_id, (result1, err) => {
                if (err)
                    callback({ status: false, error: err });
                else {
                    // console.log(419, {status: true, conversation_id: result1.conversation_id});
                    callback({ status: true, conversation_id: result1.conversation_id });
                }
            });
        });

        socket.on('company_name_team_lists', function(data, callback) {
            var uid = data.user_id;
            signup_utils.check_company_id(data.company_id).then((com) => {
                settings.get_allteam(uid, false, (rep) => {
                    var teams = [];
                    _.each(rep.teams, function(v, k) {
                        if (v.created_at !== null && v.team_title !== null)
                            teams.push(v);
                    });
                    callback({ status: rep.status, company: com, teams: teams });
                });
            }).catch((e) => {
                console.log(e);
            });
        });

        socket.on('team_base_user_lists', function(data, callback) {
            team_base_user_lists(data, (res) => {
                callback(res);
            });
        });

        socket.on('conv_pin_unpin_mob', function(params, callback) {
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
                            msg: 'Pinned Successfully',
                            convid: params.convid
                        }
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

        socket.on('edit_msg_mob', function(data, callback) {
            // console.log(582,data)
            updateTextMsg(data, async(result, err) => {
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
                    // console.log(766,result)
                    var conv_members = await room_members(data.conversation_id, data.sender);
                    var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                    var conversation_title = conv_members.group == 'yes' ? conv_members.title : v.sender_name;
                    var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : v.sender_img;
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        io.to(conv_members.participants[n]).emit('newMessage', { msg: newmsg, conversation_type, conversation_title, conversation_img });
                        send_msg_firebase(conv_members.participants[n], { msg: newmsg, conversation_type, conversation_title, conversation_img }, 'newMessage');
                    }
                    socket.broadcast.emit('msg_fully_delete_broadcast', { conversation_id: data.conversation_id, msg_id: data.msg_id });
                    callback(result);
                }
            });
        });

        socket.on("read_all_selected_convs", function(data, callback) {
            var flag = true;
            _.each(data.conversation_ids, function(v, k) {
                console.log(782, v);
                readallmsgintoconv({ conversation_id: v, user_id: data.user_id }, function(result) {
                    if (!result.status) {
                        flag = false;
                    }
                });
                if (flag === false) {
                    callback({ status: false, error: "Unexpexted error" });
                    return false; // stop execution
                }
            });
            if (flag)
                callback({ status: true });
        });
		
		
		/**
		*	To find message has unread reply or not
		**/
		socket.on('msg_has_unread_reply', function(data, callback) {
			if(isUuid(data.conversation_id) && isUuid(data.msg_id) && isUuid(data.user_id)) {
				models.instance.ReplayConv.find({ msg_id: models.timeuuidFromString(data.msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, { raw: true }, function(err, reply_info) {
					if (err) {
						callback({ status: false, error: err });
					} else {
						if (reply_info.length == 0) {
							callback({ status: false, error: "No reply message found!" });
						} else {
							models.instance.Messages.find({ conversation_id: reply_info[0].rep_id, msg_status: { $contains: data.user_id } }, { raw: true, allow_filtering: true }, function(e, reply_msg_info) {
								if(e){
									
								}else{
									if(reply_msg_info.length > 0){
										callback({ status: true, result: reply_msg_info.length });
									}
								}
							});
						}
					}
				});
			}else{
				callback({status: false, error: "Invalid data"});
			}
		});

    });
    return router;
}