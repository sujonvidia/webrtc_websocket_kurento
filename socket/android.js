var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
const isEmpty = require('../validation/is-empty');
const validator = require('validator');
const isUuid = require('uuid-validate');
var { models } = require('./../config/db/express-cassandra');
var {
    findConversationHistory,
    createPersonalConv,
    createPersonalConv2,
    getAllTagsforList,
    get_one_room_data,
    get_conv_data,
    room_members
} = require('./../utils/conversation');
var {
    sendNewMsg,
    updateTextMsg,
    send_notification_msg,
    forwardMessage,
    send_msg_firebase
} = require('./../utils/message');

var {
    update_msg_status_add_viewer,
    get_messages_tag,
    createChecklistAndroid,
    updateChecklistAndroid,
    updateChecklistAndroidv2,
    update_checklist_process,
    delete_checklist_item,
    count_unread
} = require('./../utils/message');
var { hayvenjs } = require('./../utils/hayvenjs');

var {
    remove_gcm_id,
    createGroupAndroid,
    updateGroupAndroid,
    join_new_group
} = require('./../utils/android');

var { get_conv_links } = require('./../utils/links');


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
var { getAllbunit } = require('./../utils/b_unit');
var { getAllUserTag } = require('./../utils/user_tag');

function validate(req, type, name, value) {
    if (req == true) {
        if (isEmpty(value)) return { status: false, error: name + ' is empty.' };
    }
    if (type == 'uuid') {
        if (!isUuid(value)) return { status: false, error: name + ' is not valid.' };
    }
    if (type == 'email') {
        if (!validator.isEmail(value)) return { status: false, error: name + ' is not valid.' };
    }

    return { status: true };
}

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
        socket.on('personalConCreate', function(data, callback) {
            // console.log("personal conv==>",data);
            createPersonalConv(data.user_id, data.targetID, data.ecosystem, data.company_id, (result, err) => {
                if (err) {
                    if (err) throw err;
                } else if (result.status) {

                    var conversation_id = result.conversation_id;
                    models.instance.Conversation.update({ conversation_id: models.uuidFromString(conversation_id.toString()), company_id: models.timeuuidFromString(data.company_id) }, {
                            is_active: { $remove: [data.targetID] },
                        }, update_if_exists,
                        function(err) {
                            if (err) {
                                console.log('fail');
                            } else {
                                console.log('success');
                            }
                        }
                    );
                    findConversationHistory(conversation_id, null, (result, error) => {
                        if (result.status) {
                            // var conversation_list = result.conversation;
                            // result.conversation = _.filter(result.conversation, row => row.has_reply > 0);
                            var conversation_list = _.orderBy(result.conversation, ["created_at"], ["desc"]);
                            var unseenId = [];
                            _.each(conversation_list, function(vc, kc) {
                                if (vc.msg_status == null) {
                                    console.log(291, vc.msg_status);
                                    unseenId.push(vc.msg_id.toString());
                                } else {
                                    var seenId = vc.msg_status;
                                    if (seenId.indexOf(data.user_id) == -1) {
                                        unseenId.push(vc.msg_id.toString());
                                    }
                                }
                            });
                            get_myTags(conversation_id.toString(), data.user_id, (tRes, Terr) => {
                                if (Terr) throw Terr;

                                get_messages_tag(conversation_id.toString(), data.user_id, (mtgsRes) => {
                                    var tagID = [];
                                    var tags = [];
                                    var condtagsid = [];
                                    var usedTag = {};

                                    _.each(tRes.Ctags, function(value, key) {
                                        tagID.push(value.id.toString());
                                        if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                                            condtagsid.push(value.tag_id.toString());
                                        }
                                    });

                                    var myConvList = JSON.parse(data.my_list);

                                    getAllTagsforList(myConvList, (result, error) => {
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

                                            _.each(tRes.tags, function(v, k) {
                                                if (tagsIDS.indexOf(v.tag_id) > -1) {
                                                    usedTag[v.tag_id] = true;
                                                } else {
                                                    usedTag[v.tag_id] = false;
                                                }
                                            });

                                            if (unseenId.length > 0) {
                                                update_msg_status_add_viewer(unseenId, data.user_id, conversation_id.toString(), (result) => {
                                                    if (result.status) {
                                                        callback({
                                                            status: true,
                                                            conversation_id: conversation_id,
                                                            result: conversation_list,
                                                            totalTags: tRes.tags,
                                                            messagestag: mtgsRes.tags,
                                                            con_tag_id: condtagsid,
                                                            usedTag: usedTag,
                                                            tagsIDS: tagsIDS
                                                        });
                                                    } else {
                                                        console.log(199, result);
                                                    }
                                                });
                                            } else {
                                                callback({
                                                    status: true,
                                                    conversation_id: conversation_id,
                                                    result: conversation_list,
                                                    totalTags: tRes.tags,
                                                    messagestag: mtgsRes.tags,
                                                    con_tag_id: condtagsid,
                                                    usedTag: usedTag,
                                                    tagsIDS: tagsIDS
                                                });
                                            }

                                        } else {
                                            callback({ status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: [] });
                                        }
                                    });


                                });
                            });
                        } else {
                            callback({ status: false, conversation_id: conversation_id, result: [] });
                        }
                    });

                } else {
                    callback(false);
                }
            });
            // callback(data);
        });

        socket.on('get_conv_data', function(data, callback) {
            var startDate = new Date();
            // Sample data
            // socket.emit("get_conv_data", {"user_id":"c2785844-ea4c-4d03-9157-690067663cde","convid":"9713c925-140a-4291-9d8e-558544e90626","company_id":"79df4d50-ce4a-11e9-90f6-e9974a7dde09","ecosystem":"NavCon","type":"Group"}, (res)=>{console.log(res); });
            console.log(244, data);

            if (!validate(true, 'uuid', 'Conversation ID', data.convid).status) {
                callback({ msg: "Invalid Conversation ID", status: false, conversation_id: data.convid, result: [] }, null);
            }
            if (!validate(true, 'uuid', 'User ID', data.user_id).status) {
                callback({ msg: "Invalid User ID", status: false, conversation_id: data.convid, result: [] }, null);
            }
            if (!validate(true, 'uuid', 'Company ID', data.company_id).status) {
                callback({ msg: "Invalid Company ID", status: false, conversation_id: data.convid, result: [] }, null);
            }
            if (data.type == 'Group') {
                console.log(246);
                var conversation_id = models.uuidFromString(data.convid);
                findConversationHistory(conversation_id, { user_id: data.user_id, request_type: data.request_type }, async (result, error) => {
                    console.log(249);
                    var links = await get_conv_links(conversation_id.toString());
                    console.log(393, links.length);

                    if (result.status) {
                        // var conversation_list = result.conversation;

                        var conversation_list = _.orderBy(result.conversation, ["created_at"], ["desc"]);
                        var unseenId = [];
                        var checklistMsgId = [];

                        var location = [];
                        let file_size = [];
                        _.forEach(result.files, function(fv, fk) {
                            location.push(fv.location);
                            file_size.push(fv.file_size);
                        });
                        // console.log(389, file_size);
                        _.each(conversation_list, function(vc, kc) {
                            vc.link_title = "";
                            vc.link_id = "";
                            if(links.length>0){
                                _.each(links, function(lv, lk){
                                    if(lv.msg_id == vc.msg_id.toString()){
                                        vc.link_title = lv.title;
                                        vc.link_id = lv.url_id;
                                        return false;
                                    }
                                });
                            }
                            vc.attch_otherfile_size = [];
                            if (vc.created_at == null || vc.msg_body == null || vc.sender == null) {
                                console.log(293, "Null data problem.");
                                callback({ msg: "Null data problem.", status: false, conversation_id: conversation_id, result: [] }, null);
                                return 0;
                            }

                            if (vc.msg_status == null) {
                                unseenId.push(vc.msg_id.toString());
                            } else {
                                var seenId = vc.msg_status;
                                if (seenId.indexOf(data.user_id) == -1) {
                                    unseenId.push(vc.msg_id.toString());
                                }
                            }
                            if (vc.msg_type == 'checklist') {
                                checklistMsgId.push(models.timeuuidFromString(vc.msg_id.toString()));
                            } else if (vc.msg_type.indexOf('media') > -1) {
                                if (vc.msg_type.indexOf('imgfile') > -1) {
                                    var temparr = [];
                                    var temparr2 = [];
                                    _.forEach(vc.attch_imgfile, function(vcv, vck) {
                                        // console.log(272, vcv);
                                        if (location.indexOf(vcv) > -1) {
                                            if (vcv.indexOf(".svg") > -1)
                                                temparr2.push(vcv);
                                            else
                                                temparr.push(vcv);
                                        } else {
                                            temparr.push('common/file-removed-message.png');
                                        }
                                    });
                                    vc.attch_imgfile = temparr.length == 0 ? null : temparr;
                                    if (temparr2.length > 0) {
                                        vc.attch_otherfile = temparr2;
                                    }
                                }
                                if (vc.msg_type.indexOf('audiofile') > -1) {
                                    var temparr = [];
                                    _.forEach(vc.attch_audiofile, function(vcv, vck) {
                                        if (location.indexOf(vcv) > -1) temparr.push(vcv);
                                    });
                                    vc.attch_audiofile = temparr.length == 0 ? null : temparr;
                                }
                                if (vc.msg_type.indexOf('videofile') > -1) {
                                    var temparr = [];
                                    _.forEach(vc.attch_videofile, function(vcv, vck) {
                                        if (location.indexOf(vcv) > -1) temparr.push(vcv);
                                    });
                                    vc.attch_videofile = temparr.length == 0 ? null : temparr;
                                }
                                if (vc.msg_type.indexOf('otherfile') > -1) {
                                    var temparr = [];
                                    _.forEach(vc.attch_otherfile, function(vcv, vck) {
                                        if (location.indexOf(vcv) > -1) {
                                            temparr.push(vcv);
                                            vc.attch_otherfile_size.push(file_size[location.indexOf(vcv)]);
                                        }
                                    });
                                    vc.attch_otherfile = temparr.length == 0 ? null : temparr;
                                }
                            }
                            vc.attch_otherfile_size = vc.attch_otherfile_size.length == 0 ? null : vc.attch_otherfile_size;
                        });

                        get_conv_data({ conversation_id: conversation_id.toString(), company_id: data.company_id, user_id: data.user_id }, (conv_rep) => {
                            get_myTags(conversation_id.toString(), data.user_id, (tRes, Terr) => {
                                if (Terr) throw Terr;

                                get_messages_tag(conversation_id.toString(), data.user_id, (mtgsRes) => {
                                    var tagID = [];
                                    var tags = [];
                                    var condtagsid = [];
                                    var usedTag = {};

                                    _.each(tRes.Ctags, function(value, key) {
                                        tagID.push(value.id.toString());
                                        if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                                            condtagsid.push(value.tag_id.toString());
                                        }
                                    });

                                    // var myConvList = JSON.parse(data.my_list);

                                    // getAllTagsforList(myConvList, (result, error) => {
                                    //   if (result.status) {
                                    var tagsIDS = [];

                                    // _.each(result.data, function (v, k) {
                                    //   if (v.length > 0) {
                                    //     _.each(v, function (vt, kt) {
                                    //       if (tagsIDS.indexOf(vt.tag_id.toString()) === -1) {
                                    //         tagsIDS.push(vt.tag_id.toString());
                                    //       }
                                    //     });
                                    //   }
                                    // });

                                    _.each(tRes.tags, function(v, k) {
                                        if (tagsIDS.indexOf(v.tag_id) > -1) {
                                            usedTag[v.tag_id] = true;
                                        } else {
                                            usedTag[v.tag_id] = false;
                                        }
                                    });

                                    if (checklistMsgId.length > 0) {
                                        var query = {
                                            msg_id: { '$in': checklistMsgId }
                                        };
                                        models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                                            if (cerror) {
                                                callback({ status: false, error: cerror, conversation_id: conversation_id, result: [] });
                                            } else {
                                                if (cresult.length > 0) {
                                                    _.each(conversation_list, function(mv, mk) {
                                                        if (mv.msg_type == 'checklist') {
                                                            var thismsgcl = [];
                                                            _.each(cresult, function(cv, ck) {
                                                                if (cv.msg_id.toString() == mv.msg_id.toString()) {
                                                                    thismsgcl.push(cv);
                                                                    // console.log(307, thismsgcl);
                                                                }
                                                            });
                                                            // console.log(310,thismsgcl);
                                                            conversation_list[mk]['checklist'] = thismsgcl;
                                                        } else {
                                                            conversation_list[mk]['checklist'] = [];
                                                        }
                                                    })
                                                }

                                                if (unseenId.length > 0) {
                                                    update_msg_status_add_viewer(unseenId, data.user_id, conversation_id.toString(), (result) => {
                                                        if (result.status) {
                                                            callback({
                                                                status: true,
                                                                conversation_id: conversation_id,
                                                                result: conversation_list,
                                                                totalTags: tRes.tags,
                                                                messagestag: mtgsRes.tags,
                                                                con_tag_id: condtagsid,
                                                                usedTag: usedTag,
                                                                tagsIDS: tagsIDS,
                                                                myUserList: conv_rep.status ? conv_rep.convdata : []
                                                            });
                                                        } else {
                                                            console.log(332, result);
                                                        }
                                                    });
                                                } else {
                                                    console.log('api end point', (new Date() - startDate));
                                                    callback({
                                                        status: true,
                                                        conversation_id: conversation_id,
                                                        result: conversation_list,
                                                        totalTags: tRes.tags,
                                                        messagestag: mtgsRes.tags,
                                                        con_tag_id: condtagsid,
                                                        usedTag: usedTag,
                                                        tagsIDS: tagsIDS,
                                                        myUserList: conv_rep.status ? conv_rep.convdata : []
                                                    });
                                                }

                                            }
                                        });
                                    } else {
                                        _.each(conversation_list, function(mv, mk) {
                                            if (mv.msg_type != 'checklist') {
                                                conversation_list[mk]['checklist'] = [];
                                            }
                                        })

                                        if (unseenId.length > 0) {
                                            update_msg_status_add_viewer(unseenId, data.user_id, conversation_id.toString(), (result) => {
                                                if (result.status) {
                                                    callback({
                                                        status: true,
                                                        conversation_id: conversation_id,
                                                        result: conversation_list,
                                                        totalTags: tRes.tags,
                                                        messagestag: mtgsRes.tags,
                                                        con_tag_id: condtagsid,
                                                        usedTag: usedTag,
                                                        tagsIDS: tagsIDS,
                                                        myUserList: conv_rep.status ? conv_rep.convdata : []
                                                    });
                                                } else {
                                                    console.log(363, result);
                                                }
                                            });
                                        } else {
                                            console.log('api end point', (new Date() - startDate));
                                            callback({
                                                status: true,
                                                conversation_id: conversation_id,
                                                result: conversation_list,
                                                totalTags: tRes.tags,
                                                messagestag: mtgsRes.tags,
                                                con_tag_id: condtagsid,
                                                usedTag: usedTag,
                                                tagsIDS: tagsIDS,
                                                myUserList: conv_rep.status ? conv_rep.convdata : []
                                            });
                                        }
                                    }
                                    // } else {
                                    // _.each(conversation_list,function(mv,mk){
                                    //   if(mv.msg_type != 'checklist'){
                                    //     conversation_list[mk]['checklist'] =  [];
                                    //   }
                                    // })
                                    // callback({status: true, conversation_id: conversation_id, result: conversation_list,totalTags: tRes.tags,messagestag: mtgsRes.tags,con_tag_id:condtagsid,usedTag:[]});
                                    // }
                                    // });


                                });
                            });
                        });
                    } else {
                        callback({ status: false, conversation_id: conversation_id, result: [] });
                    }
                });
            } else {
                console.log(390, "**************************");

                createPersonalConv2(data.user_id, data.convid, data.ecosystem, data.company_id, (result1, err) => {
                    if (err) {
                        console.log(393, err);
                        callback({ status: false, conversation_id: conversation_id, result: [], error: err });
                    } else {
                        // console.log(394, JSON.stringify(result1));

                        // if(result1.status)
                        //   var conversation_id = result1.conversation_id;
                        // else
                        if (data.request_type == 'request_type') {
                            var conversation_id = models.uuidFromString(data.convid);
                        } else {
                            if (result1.status)
                                var conversation_id = result1.conversation_id;
                            else
                                var conversation_id = models.uuidFromString(data.convid);
                        }

                        findConversationHistory(conversation_id, { user_id: data.user_id, request_type: data.request_type }, async (result, error) => {
                            // console.log(result);
                            var links = await get_conv_links(conversation_id.toString());
                            console.log(660, links.length);

                            if (result.status) {
                                // var conversation_list = result.conversation;

                                var conversation_list = _.orderBy(result.conversation, ["created_at"], ["desc"]);
                                var unseenId = [];
                                var checklistMsgId = [];

                                var location = [];
                                let file_size = [];
                                _.forEach(result.files, function(fv, fk) {
                                    location.push(fv.location);
                                    file_size.push(fv.file_size);
                                });

                                _.each(conversation_list, function(vc, kc) {
                                    vc.attch_otherfile_size = [];
                                    if (vc.created_at == null || vc.msg_body == null || vc.sender == null) {
                                        console.log(510, "Null data problem.");
                                        callback({ msg: "Null data problem.", status: false, conversation_id: conversation_id, result: [] }, null);
                                        return 0;

                                    }

                                    vc.link_title = "";
                                    vc.link_id = "";
                                    if(links.length>0){
                                        _.each(links, function(lv, lk){
                                            if(lv.msg_id == vc.msg_id.toString()){
                                                vc.link_title = lv.title;
                                                vc.link_id = lv.url_id;
                                                return false;
                                            }
                                        });
                                    }
                                    
                                    if (vc.msg_status == null) {
                                        unseenId.push(vc.msg_id.toString());
                                    } else {
                                        var seenId = vc.msg_status;
                                        if (seenId.indexOf(data.user_id) == -1) {
                                            unseenId.push(vc.msg_id.toString());
                                        }
                                    }
                                    if (vc.msg_type == 'checklist') {
                                        checklistMsgId.push(models.timeuuidFromString(vc.msg_id.toString()));
                                    } else if (vc.msg_type.indexOf('media') > -1) {
                                        if (vc.msg_type.indexOf('imgfile') > -1) {
                                            var temparr = [];
                                            var temparr2 = [];
                                            _.forEach(vc.attch_imgfile, function(vcv, vck) {
                                                // console.log(272, vcv);
                                                if (location.indexOf(vcv) > -1) {
                                                    if (vcv.indexOf(".svg") > -1)
                                                        temparr2.push(vcv);
                                                    else
                                                        temparr.push(vcv);
                                                } else {
                                                    temparr.push('common/file-removed-message.png');
                                                }
                                            });
                                            vc.attch_imgfile = temparr.length == 0 ? null : temparr;
                                            if (temparr2.length > 0) {
                                                vc.attch_otherfile = temparr2;
                                            }
                                        }
                                        if (vc.msg_type.indexOf('audiofile') > -1) {
                                            var temparr = [];
                                            _.forEach(vc.attch_audiofile, function(vcv, vck) {
                                                if (location.indexOf(vcv) > -1) temparr.push(vcv);
                                            });
                                            vc.attch_audiofile = temparr.length == 0 ? null : temparr;
                                        }
                                        if (vc.msg_type.indexOf('videofile') > -1) {
                                            var temparr = [];
                                            _.forEach(vc.attch_videofile, function(vcv, vck) {
                                                if (location.indexOf(vcv) > -1) temparr.push(vcv);
                                            });
                                            vc.attch_videofile = temparr.length == 0 ? null : temparr;
                                        }
                                        if (vc.msg_type.indexOf('otherfile') > -1) {
                                            var temparr = [];
                                            _.forEach(vc.attch_otherfile, function(vcv, vck) {
                                                if (location.indexOf(vcv) > -1) {
                                                    temparr.push(vcv);
                                                    vc.attch_otherfile_size.push(file_size[location.indexOf(vcv)]);
                                                }
                                            });
                                            vc.attch_otherfile = temparr.length == 0 ? null : temparr;
                                        }
                                    }
                                    vc.attch_otherfile_size = vc.attch_otherfile_size.length == 0 ? null : vc.attch_otherfile_size;
                                });

                                get_conv_data({ conversation_id: conversation_id.toString(), company_id: data.company_id, user_id: data.user_id }, (conv_rep) => {
                                    get_myTags(conversation_id.toString(), data.user_id, (tRes, Terr) => {
                                        if (Terr) throw Terr;

                                        get_messages_tag(conversation_id.toString(), data.user_id, (mtgsRes) => {
                                            var tagID = [];
                                            var tags = [];
                                            var condtagsid = [];
                                            var usedTag = {};
                                            console.log(619, 'android data')
                                            _.each(tRes.Ctags, function(value, key) {
                                                tagID.push(value.id.toString());
                                                if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                                                    condtagsid.push(value.tag_id.toString());
                                                }
                                            });

                                            // var myConvList = JSON.parse(data.my_list);

                                            var tagsIDS = [];

                                            _.each(tRes.tags, function(v, k) {
                                                if (tagsIDS.indexOf(v.tag_id) > -1) {
                                                    usedTag[v.tag_id] = true;
                                                } else {
                                                    usedTag[v.tag_id] = false;
                                                }
                                            });

                                            if (checklistMsgId.length > 0) {
                                                var query = {
                                                    msg_id: { '$in': checklistMsgId }
                                                };
                                                models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                                                    if (cerror) {
                                                        callback({ status: false, error: cerror, conversation_id: conversation_id, result: [] });
                                                    } else {
                                                        if (cresult.length > 0) {
                                                            _.each(conversation_list, function(mv, mk) {
                                                                if (mv.msg_type == 'checklist') {
                                                                    var thismsgcl = [];
                                                                    _.each(cresult, function(cv, ck) {
                                                                        if (cv.msg_id.toString() == mv.msg_id.toString()) {
                                                                            thismsgcl.push(cv);
                                                                            // console.log(478, thismsgcl);
                                                                        }
                                                                    });
                                                                    // console.log(481, thismsgcl);
                                                                    conversation_list[mk]['checklist'] = thismsgcl;
                                                                } else {
                                                                    conversation_list[mk]['checklist'] = [];
                                                                }
                                                            })
                                                        }

                                                        if (unseenId.length > 0) {
                                                            update_msg_status_add_viewer(unseenId, data.user_id, conversation_id.toString(), (result) => {
                                                                if (result.status) {
                                                                    console.log('api end point', (new Date() - startDate));
                                                                    callback({
                                                                        status: true,
                                                                        conversation_id: conversation_id,
                                                                        result: conversation_list,
                                                                        totalTags: tRes.tags,
                                                                        messagestag: mtgsRes.tags,
                                                                        con_tag_id: condtagsid,
                                                                        usedTag: usedTag,
                                                                        tagsIDS: tagsIDS,
                                                                        myUserList: conv_rep.status ? conv_rep.convdata : []
                                                                    });
                                                                } else {
                                                                    console.log(514, result);
                                                                }
                                                            });
                                                        } else {
                                                            // console.log(512,conversation_list);
                                                            console.log('api end point', (new Date() - startDate));
                                                            callback({
                                                                status: true,
                                                                conversation_id: conversation_id,
                                                                result: conversation_list,
                                                                totalTags: tRes.tags,
                                                                messagestag: mtgsRes.tags,
                                                                con_tag_id: condtagsid,
                                                                usedTag: usedTag,
                                                                tagsIDS: tagsIDS,
                                                                myUserList: conv_rep.status ? conv_rep.convdata : []
                                                            });
                                                        }

                                                    }
                                                });
                                            } else {
                                                _.each(conversation_list, function(mv, mk) {
                                                    if (mv.msg_type != 'checklist') {
                                                        conversation_list[mk]['checklist'] = [];
                                                    }
                                                })

                                                if (unseenId.length > 0) {
                                                    update_msg_status_add_viewer(unseenId, data.user_id, conversation_id.toString(), (result) => {
                                                        if (result.status) {
                                                            // console.log(529,conversation_list);
                                                            callback({
                                                                status: true,
                                                                conversation_id: conversation_id,
                                                                result: conversation_list,
                                                                totalTags: tRes.tags,
                                                                messagestag: mtgsRes.tags,
                                                                con_tag_id: condtagsid,
                                                                usedTag: usedTag,
                                                                tagsIDS: tagsIDS,
                                                                myUserList: conv_rep.status ? conv_rep.convdata : []
                                                            });
                                                        } else {
                                                            console.log(556, result);
                                                        }
                                                    });
                                                } else {
                                                    console.log('api end point', (new Date() - startDate));
                                                    // console.log(545,conversation_list);
                                                    callback({
                                                        status: true,
                                                        conversation_id: conversation_id,
                                                        result: conversation_list,
                                                        totalTags: tRes.tags,
                                                        messagestag: mtgsRes.tags,
                                                        con_tag_id: condtagsid,
                                                        usedTag: usedTag,
                                                        tagsIDS: tagsIDS,
                                                        myUserList: conv_rep.status ? conv_rep.convdata : []
                                                    });
                                                }
                                            }


                                        });
                                    });
                                });
                            } else {
                                callback({ status: false, conversation_id: conversation_id, result: [] });
                            }
                        });
                    }
                });
            }
        });

        socket.on('single_conv_data', function(data, callback) {
            hayvenjs.single_conv_detail(data, (res) => {
                console.log(566, res);
                if (res.status)
                    callback(res);
            })
        });

        socket.on('logout_from_mobile', function(data, callback) {
            remove_gcm_id(data, (res) => {
                if (res.status)
                    callback(res);
            });
        });

        function findMyAllConversations(user_id) {
            return new Promise((resolve, reject) => {
                models.instance.Conversation.find({ participants: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }

        function findMyAllfriendData(user_ids) {
            return new Promise((resolve, reject) => {
                models.instance.Users.find({ id: { $in: user_ids } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }

        function findReplyConversationWithArray(conversation_ids) {
            return new Promise((resolve, reject) => {
                models.instance.ReplayConv.find({ conversation_id: { $in: conversation_ids } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }

        function findAllMyUnreadMessageFun(user_id) {
            return new Promise((resolve, reject) => {
                models.instance.Messages.find({ msg_status: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }

        function findAllMyUnreadMessageFunEditMsg(user_id) {
            return new Promise((resolve, reject) => {
                models.instance.Messages.find({ edit_seen: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }
        socket.on('get_unread_conversation', async function(user_id, callback) {
            var getMyAllConv = await findMyAllConversations(user_id);
            var allSingleUserId = [];
            var allSingleUseruuid = [];
            var allHasReplayRootConversationids = [];
            for (let i = 0; i < getMyAllConv.length; i++) {
                if (getMyAllConv[i].single == 'yes') {
                    let myindx = getMyAllConv[i].participants.indexOf(user_id);
                    let friendidindex = (myindx == 0 ? 1 : 0);
                    let friendid = getMyAllConv[i].participants[friendidindex];
                    if (allSingleUserId.indexOf(friendid) == -1) {
                        if (friendid != undefined && friendid != '') {
                            allSingleUserId.push(friendid);

                        }
                    }
                    getMyAllConv[i]['fid'] = (friendid == undefined ? '' : friendid);
                }
                allHasReplayRootConversationids.push(getMyAllConv[i].conversation_id);
            }
            for (let i = 0; i < allSingleUserId.length; i++) {
                allSingleUseruuid.push(models.uuidFromString(allSingleUserId[i]))
            }
            var getAllMyfriendData = [];
            if (allSingleUseruuid.length > 0) {
                getAllMyfriendData = await findMyAllfriendData(allSingleUseruuid);
            }
            var getAllmyUreadMessages = await findAllMyUnreadMessageFun(user_id);
            var getAllmyUreadMessages2 = [];
            // var getAllmyUreadMessages2 = await findAllMyUnreadMessageFunEditMsg(user_id);
            getAllmyUreadMessages = getAllmyUreadMessages.concat(getAllmyUreadMessages2);


            var conversationCounter = {};
            var total_unreadAll = 0;
            for (let i = 0; i < getAllmyUreadMessages.length; i++) {

                if (getAllmyUreadMessages[i].has_delete == null) {
                    getAllmyUreadMessages[i].has_delete = [];
                }

                if (getAllmyUreadMessages[i].has_delete.indexOf('delete_for_all') == -1 && getAllmyUreadMessages[i].has_delete.indexOf(user_id) == -1 && getAllmyUreadMessages[i].root_conv_id == null) {
                    total_unreadAll++;
                    if (conversationCounter[getAllmyUreadMessages[i].conversation_id.toString()] == undefined) {
                        conversationCounter[getAllmyUreadMessages[i].conversation_id.toString()] = 1;
                    } else {
                        conversationCounter[getAllmyUreadMessages[i].conversation_id.toString()] = (conversationCounter[getAllmyUreadMessages[i].conversation_id.toString()] + 1);
                    }
                }
            }
            var getMyallRepConv = [];
            if (allHasReplayRootConversationids.length > 0) {
                getMyallRepConv = await findReplyConversationWithArray(allHasReplayRootConversationids);
            }
            var thread_total_unread = 0;
            var callBackOnlyReplyThreadConv = [];
            for (let i = 0; i < getMyAllConv.length; i++) {
                if (getMyAllConv[i].is_active == null) {
                    getMyAllConv[i].is_active = [];
                }
                if (getMyAllConv[i].is_active.indexOf(user_id) == -1) {
                    var rep_id = [];
                    for (let r = 0; r < getMyallRepConv.length; r++) {
                        if (getMyAllConv[i].conversation_id.toString() == getMyallRepConv[r].conversation_id.toString()) {
                            if (rep_id.indexOf(getMyallRepConv[r].rep_id.toString()) == -1) {
                                rep_id.push(getMyallRepConv[r].rep_id.toString());
                            }
                        }
                    }
                    getMyAllConv[i]['reply_ids'] = rep_id;
                    let thisConvTotalReplyUnread = 0;
                    for (let r = 0; r < rep_id.length; r++) {
                        if (conversationCounter[rep_id[r]] == undefined) {
                            conversationCounter[rep_id[r]] = 0;
                        }
                        thisConvTotalReplyUnread = thisConvTotalReplyUnread + conversationCounter[rep_id[r]]
                    }
                    getMyAllConv[i]['total_unread_thread'] = thisConvTotalReplyUnread;
                    getMyAllConv[i]['unread_count'] = (conversationCounter[getMyAllConv[i].conversation_id.toString()] == undefined ? 0 : conversationCounter[getMyAllConv[i].conversation_id.toString()]);
                    thread_total_unread = thread_total_unread + thisConvTotalReplyUnread;
                    if (getMyAllConv[i].single == 'yes') {
                        for (let n = 0; n < getAllMyfriendData.length; n++) {
                            let myindx = getMyAllConv[i].participants.indexOf(user_id);
                            let friendidindex = (myindx == 0 ? 1 : 0);
                            let friendid = getMyAllConv[i].participants[friendidindex];
                            if (friendid == getAllMyfriendData[n].id.toString()) {

                                getMyAllConv[i]['title'] = getAllMyfriendData[n].fullname;
                                getMyAllConv[i]['conv_img'] = getAllMyfriendData[n].img;
                            }
                        }
                    }
                    if (thisConvTotalReplyUnread > 0) {
                        callBackOnlyReplyThreadConv.push(getMyAllConv[i])
                    }
                }

            }
            var convs = [];
            for (let i = 0; i < callBackOnlyReplyThreadConv.length; i++) {
                var data = {
                    'conversation_id': callBackOnlyReplyThreadConv[i].conversation_id,
                    'conversation_type': callBackOnlyReplyThreadConv[i].group == 'yes' ? 'Group' : 'Personal',
                    'conversation_with': callBackOnlyReplyThreadConv[i].group == 'yes' ? 'Group' : callBackOnlyReplyThreadConv[i].fid,
                    'conversation_title': callBackOnlyReplyThreadConv[i].title,
                    'privacy': callBackOnlyReplyThreadConv[i].privacy,
                    'msg_body': (callBackOnlyReplyThreadConv[i].last_msg == null ? 'Message body...' : callBackOnlyReplyThreadConv[i].last_msg),
                    'participants': callBackOnlyReplyThreadConv[i].participants,
                    'status': callBackOnlyReplyThreadConv[i].status,
                    'is_active': callBackOnlyReplyThreadConv[i].is_active != null ? callBackOnlyReplyThreadConv[i].is_active : [],
                    'participants_admin': callBackOnlyReplyThreadConv[i].participants_admin != null ? callBackOnlyReplyThreadConv[i].participants_admin : [],
                    'participants_name': idToNameArr(callBackOnlyReplyThreadConv[i].participants),
                    'created_at': callBackOnlyReplyThreadConv[i].last_msg_time,
                    'msg_id': '',
                    'msg_type': '',
                    'sender_img': callBackOnlyReplyThreadConv[i].conv_img,
                    'sender_name': callBackOnlyReplyThreadConv[i].title,
                    'totalUnread': callBackOnlyReplyThreadConv[i].unread_count,
                    'totalThreadUnread': callBackOnlyReplyThreadConv[i].total_unread_thread,
                    'conference_id': callBackOnlyReplyThreadConv[i].conference_id
                }
                convs.push(data);
            }
            callback({ status: true, data: { conversation: convs, thread_unread: thread_total_unread } })
        })

        socket.on('groupCreateAndroid', function(message, callback) {
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
                            send_notification_msg(data, function(res) {
                                if (res.status) {
                                    socket.broadcast.emit('newMessage', { status: true, msg: res.data });
                                    socket.emit('newMessage', { status: true, msg: res.data });
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
                                    callback(result);
                                }
                            })
                            callback(result);
                        } else {
                            callback({ status: false, err: result.err });
                        }
                    }
                });
            }
        });

        socket.on('groupUpdateAndroid', function(message, callback) {
            var str = message.memberList;
            var strUUID = message.memberListUUID;
            var adminList = message.adminList;
            var adminListUUID = message.adminListUUID;
            var memberlist = str.concat(adminList);
            var joinMenber = memberlist.join(',');
            console.log(671, message);

            // var memberlistUUID = strUUID.concat(adminListUUID);
            if (message.teamname !== "") {
                updateGroupAndroid({
                    conversation_id: message.conversation_id,
                    adminList: adminListUUID,
                    memberList: message.memberListUUID,
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
                }, (result) => {
                    console.log(691, result);
                    if (result.status) {
                        callback(result);
                        io.emit('saveBroadcastRoom', result);
                    } else {
                        callback({ status: false });
                    }
                });
            }
        });

        socket.on('join_new_group', function(data, callback) {
            console.log(770, data);
            join_new_group(data, (res) => {
                if (res.status) {
                    callback(res);
                } else {
                    callback({ status: false });
                }
            })
        })

        socket.on('create_checklist', function(data, callback) {
            createChecklistAndroid(data, async(res) => {
                if (res.status) {
                    var newmsg = res.msg;
                    newmsg.attch_imgfile = [];
                    newmsg.attch_audiofile = [];
                    newmsg.attch_videofile = [];
                    newmsg.attch_otherfile = [];
                    // socket.broadcast.emit('newMessage',{status:true,msg:newmsg,checklist:res.checklist});
                    // io.to(data.sender).emit('newMessage', {status:true,msg:newmsg,checklist:res.checklist});
                    var conv_members = await room_members(data.conversation_id, data.sender);
                    var conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                    var conversation_title = conv_members.group == 'yes' ? conv_members.title : newmsg.sender_name;
                    var conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : newmsg.sender_img;
                    for (var n = 0; n < conv_members.participants.length; n++) {
                        io.to(conv_members.participants[n]).emit('newMessage', { status: true, msg: newmsg, checklist: res.checklist, conversation_type, conversation_title, conversation_img });
                        send_msg_firebase(conv_members.participants[n], { status: true, msg: newmsg, checklist: res.checklist, conversation_type, conversation_title, conversation_img }, 'newMessage');
                    }
                }
                callback(res);
            })
        });

        socket.on('update_checklist', function(data, callback) {
            updateChecklistAndroid(data, (res) => {
                if (res.status) {
                    var newmsg = res.msg;
                    newmsg.attch_imgfile = [];
                    newmsg.attch_audiofile = [];
                    newmsg.attch_videofile = [];
                    newmsg.attch_otherfile = [];
                    socket.broadcast.emit('newMessage', { status: true, msg: newmsg, checklist: res.checklist });
                    socket.emit('newMessage', { status: true, msg: newmsg, checklist: res.checklist });
                    // send_msg_firebase(conv_members.participants[n],{status:true,msg:newmsg,checklist:res.checklist},'newMessage');
                }
                callback(res);
            })
        });

        socket.on('update_checklistv2', function(data, callback) {
            if (isUuid(data.conversation_id) && isUuid(data.msg_id) && isUuid(data.user_id)) {
                updateChecklistAndroidv2(data, async function(res) {
                    if (res.status && data.req_type === undefined) {
                        var newmsg = res.msg;
                        newmsg.attch_imgfile = newmsg.attch_imgfile == null ? [] : newmsg.attch_imgfile;
                        newmsg.attch_audiofile = newmsg.attch_audiofile == null ? [] : newmsg.attch_audiofile;
                        newmsg.attch_videofile = newmsg.attch_videofile == null ? [] : newmsg.attch_videofile;
                        newmsg.attch_otherfile = newmsg.attch_otherfile == null ? [] : newmsg.attch_otherfile;

                        var conv_members = await room_members(data.conversation_id, data.user_id);
                        res['conversation_type'] = conv_members.group == 'yes' ? 'group' : 'single';
                        res['conversation_title'] = conv_members.group == 'yes' ? conv_members.title : newmsg.sender_name;
                        res['conversation_img'] = conv_members.group == 'yes' ? conv_members.conv_img : newmsg.sender_img;
                        // console.log(893, newmsg);
                        for (var n = 0; n < conv_members.participants.length; n++) {
                            // if(conv_members.participants[n] == data.user_id) continue;
                            io.to(conv_members.participants[n]).emit('newMessage', res);
                            send_msg_firebase(conv_members.participants[n], res, 'newMessage');
                        }
                    }
                    if (res.status && data.req_type == 'web') {
                        data['checklist'] = res.checklist;
                        socket.broadcast.emit('saveChecklistStatusAndTitle', data);
                    }
                    callback(res);
                });
            } else {
                callback({ status: false, msg: "Data type error" });
            }
        });

        socket.on('update_checklist_process', function(data, callback) {
            var is_data_valid = true;
            if (isUuid(data.checklist_id) && isUuid(data.msg_id) && isUuid(data.user_id)) {
                if (data.type == 'new_assignee' && !isUuid(data.assign_to)) {
                    is_data_valid = false;
                } else if (data.type == 'alternative_assign_to' && !isUuid(data.assign_to)) {
                    is_data_valid = false;
                } else if (data.type == 'request' && (data.request_note == undefined || data.request_date == undefined)) {
                    is_data_valid = false;
                } else if (data.type == 'decline' && data.decline_note == undefined) {
                    is_data_valid = false;
                }
                if (is_data_valid) {
                    update_checklist_process(data, function(res) {
                        // need to send a notification sms
                        socket.broadcast.emit('update_checklist_process', res);
                        callback(res);
                    });
                } else {
                    callback({ status: false, msg: "Data type error" });
                }
            } else {
                callback({ status: false, msg: "Data type error" });
            }
        });

        socket.on('delete_checklist_item', function(data, callback) {
            if (isUuid(data.checklist_id) && isUuid(data.msg_id)) {
                delete_checklist_item(data, function(res) {
                    data.type = "Delete";
                    socket.broadcast.emit('update_checklist_settings_last', data);
                    callback(res);
                });

            } else {
                callback({ status: false, msg: "Data type error" });
            }
        });

        socket.on('forward_attach', function(message, callback) {
            var conv_arr = message.conversation_id;
            var to_arr = message.to;
            var old_created_time = null;
            var last_update_user = null;

            message.has_reply = 0;
            message.rep_id = null;
            console.log(684, message);
            hayvenjs.getAllFiles({ msgid: message.msgid, attach_files: message.attach_files, need_id: false }, (response) => {
                message.attach_files.allfiles = response;
                _.each(conv_arr, function(v, k) {
                    message.conversation_id = v;
                    var paramsData = {
                        io: io,
                        socket: socket,
                        from: message.sender_id,
                        sender_img: message.sender_img,
                        sender_name: message.sender_name,
                        conversation_id: v,
                        msg: message.text,
                        attachment: message.attach_files,
                        timer: message.has_timer,
                        old_created_time: old_created_time,
                        last_update_user: last_update_user,
                        updatedMsgid: '',
                        tag_list: message.tag_list,
                        has_reply: message.has_reply,
                        rep_id: message.rep_id,
                        service_provider: []
                    }
                    console.log()
                    sendNewMsg(paramsData, async(result, err) => {
                        if (err) {
                            console.log(127, err);
                        } else {
                            if (result.status) {

                                var conv_members = await room_members(v, message.sender_id);
                                result.conversation_type = conv_members.group == 'yes' ? 'group' : 'single';
                                result.conversation_title = conv_members.group == 'yes' ? conv_members.title : result.msg.sender_name;
                                result.conversation_img = conv_members.group == 'yes' ? conv_members.conv_img : result.msg.sender_img;
                                for (var n = 0; n < conv_members.participants.length; n++) {
                                    io.to(conv_members.participants[n]).emit('newMessage', result);
                                    send_msg_firebase(conv_members.participants[n], result, 'newMessage');
                                }
                                // socket.broadcast.emit('newMessage', result);
                                // io.to(message.sender_id).emit('newMessage', result);
                                if (result.unreadChecklist !== undefined) {
                                    if (result.unreadChecklist) {
                                        socket.broadcast.emit('unreadChecklist', result);
                                    }
                                }
                                callback({ status: true });
                            } else {
                                // console.log(result);
                                callback({ status: false });
                            }
                        }
                    });
                });
            });
        });

        socket.on('getConvId', function(data, callback) {
            console.log(735, data);
            createPersonalConv2(data.user_id, data.convid, data.ecosystem, data.company_id, (result1, err) => {
                if (err)
                    callback({ status: false, error: err });
                else {
                    console.log(720, { status: true, conversation_id: result1.conversation_id });
                    callback({ status: true, conversation_id: result1.conversation_id });
                }
            });
        });


        socket.on('edit_msg_android', function(data, callback) {
            console.log(749, data)
            updateTextMsg(data, (result, err) => {
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
                    console.log(766, result)
                    socket.broadcast.emit('newMessage', { msg: newmsg });
                    io.to(data.sender).emit('newMessage', { msg: newmsg });
                    send_msg_firebase(data.sender, { msg: newmsg }, 'newMessage');
                    socket.broadcast.emit('msg_fully_delete_broadcast', { conversation_id: data.conversation_id, msg_id: data.msg_id });
                    callback(result);
                }
            });
        });

        socket.on('forwardMessageV2_mob', function(data, callback) {
            console.log(912, data);
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
                                    // io.emit('newMessage', {status:true, msg:v});
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
                            // io.emit('newMessage', {status:true, msg:v});
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
                        });
                        callback(res);
                    }
                });
            }
        });

        socket.on('get_room_formdata', function(data, callback) {
            // console.log(899, data);
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
        socket.on('update_message_status_api', function(data, callback) {
            models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_status: { $contains: data.user_id } }, { allow_filtering: true, raw: true }, function(err, result) {
                if (err) {
                    console.log(err);
                    callback({ status: false })
                } else {
                    var allMsgIds = [];
                    if (result != null) {
                        for (let i = 0; i < result.length; i++) {
                            allMsgIds.push(result[i].msg_id);
                        }
                        if (allMsgIds.length > 0) {
                            models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: { $in: allMsgIds } }, { msg_status: { $remove: [data.user_id] } }, function(err1, result1) {
                                if (err1) {

                                    console.log(1393, err1);
                                } else {
                                    callback({ status: true, update_length: allMsgIds.length });
                                }
                            })
                        } else {
                            callback({ status: true, update_length: allMsgIds.length })
                        }
                    } else {
                        callback({ status: true, update_length: allMsgIds.length });
                    }

                }
            })
        })

        socket.on('load_older_msg_mob', function(data, callback) {
            // sample data
            // socket.emit("load_older_msg_mob", {"conversation_id": "47c8609d-5a0e-473e-bc38-1c0c230dc64b", "msg_id":"d5fab920-cdc2-11eb-8960-567f8e0306cc", "user_id": "12098018-6816-45c6-946a-8f260a42bd0e"}, (res)=>{console.log(res);});

            // console.log(1097, data);
            hayvenjs.get_old_msg(data, async (data_rep) => {
                var links = await get_conv_links(data.conversation_id);
                if (data_rep.files !== undefined && data_rep.files.length > 0) {
                    var location = [];
                    var file_size = [];
                    _.forEach(data_rep.files, function(fv, fk) {
                        location.push(fv.location);
                        file_size.push(fv.file_size);
                    });
                }
                _.each(data_rep.result, function(mv, mk) {
                    mv.attch_otherfile_size = [];
                    if (mv.created_at == null || mv.msg_body == null || mv.sender == null) {
                        console.log(1126, "Null data problem.");
                        callback({ msg: "Null data problem.", status: false }, null);
                        return 0;
                    }

                    mv.link_title = "";
                    mv.link_id = "";
                    if(links.length>0){
                        _.each(links, function(lv, lk){
                            if(lv.msg_id == mv.msg_id.toString()){
                                mv.link_title = lv.title;
                                mv.link_id = lv.url_id;
                                return false;
                            }
                        });
                    }

                    data_rep.result[mk]['checklist'] = [];
                    if (mv.msg_type == 'checklist' && data_rep.checklist !== undefined && data_rep.checklist.length > 0) {
                        var thismsgcl = [];
                        _.each(data_rep.checklist, function(cv, ck) {
                            if (cv.msg_id.toString() == mv.msg_id.toString()) {
                                thismsgcl.push(cv);
                                // console.log(307, thismsgcl);
                            }
                        });
                        // console.log(310,thismsgcl);
                        data_rep.result[mk]['checklist'] = thismsgcl;
                    } else if (mv.msg_type.indexOf('media') > -1 && data_rep.files !== undefined && data_rep.files.length > 0) {
                        if (mv.msg_type.indexOf('imgfile') > -1) {
                            var temparr = [];
                            _.forEach(mv.attch_imgfile, function(vcv, vck) {
                                console.log(272, vcv);
                                if (location.indexOf(vcv) > -1) temparr.push(vcv);
                                else temparr.push('common/file-removed-message.png');
                            });
                            mv.attch_imgfile = temparr.length == 0 ? null : temparr;
                        }
                        if (mv.msg_type.indexOf('audiofile') > -1) {
                            var temparr = [];
                            _.forEach(mv.attch_audiofile, function(vcv, vck) {
                                if (location.indexOf(vcv) > -1) temparr.push(vcv);
                            });
                            mv.attch_audiofile = temparr.length == 0 ? null : temparr;
                        }
                        if (mv.msg_type.indexOf('videofile') > -1) {
                            var temparr = [];
                            _.forEach(mv.attch_videofile, function(vcv, vck) {
                                if (location.indexOf(vcv) > -1) temparr.push(vcv);
                            });
                            mv.attch_videofile = temparr.length == 0 ? null : temparr;
                        }
                        if (mv.msg_type.indexOf('otherfile') > -1) {
                            var temparr = [];
                            _.forEach(mv.attch_otherfile, function(vcv, vck) {
                                if (location.indexOf(vcv) > -1) {
                                    temparr.push(vcv);
                                    mv.attch_otherfile_size.push(file_size[location.indexOf(vcv)]);
                                }
                            });
                            mv.attch_otherfile = temparr.length == 0 ? null : temparr;
                        }
                    }
                    mv.attch_otherfile_size = mv.attch_otherfile_size.length == 0 ? null : mv.attch_otherfile_size;
                });

                callback(data_rep);
            });
        });


    });
    return router;
}