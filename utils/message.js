var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
// var urlMetadata = require('url-metadata');
// var ogs = require('open-graph-scraper');
const metascraper = require('metascraper');
const got = require('got');
var router = app.Router();
const isUuid = require('uuid-validate');

var Minio = require('minio');
var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.FILE_SERVER_ACCESS_KEY,
    secretKey: process.env.FILE_SERVER_SECRET_KEY
});

var { models } = require('./../config/db/express-cassandra');
const cheerio = require('cheerio');

var { create_conv_link } = require('./../utils/links');
var { hayvenjs } = require('./../utils/hayvenjs');



// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     console.log('content-type:', res.headers['content-type']);
//     console.log('content-length:', res.headers['content-length']);
//
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };

function download(uri, filename) {
    return new Promise(resolve => request(uri).pipe(fs.createWriteStream(filename)).on('end', resolve(true)));
}
// function download(uri, filename){
//     return new Promise((resolve) => {
//         var stream = request(uri).pipe(fs.createWriteStream(filename));
//         stream.on('finish', resolve(true));
//     });
// }

var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
}

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};
var save_files_data = (data, callback) => {
    hayvenjs.save_files_data(data, (res) => {
        if (!res.status)
            console.log('error save_files_data from messages.js', res);
        else
            callback(res)
    });
};

// var amqp = require('amqplib');
var amqp = require('amqplib/callback_api');
const { resolve } = require('path');
var rabbitMQconfig = 'amqp://' + process.env.RABBITMQ_USER + ':' + process.env.RABBITMQ_PASSWORD + '@' + process.env.RABBITMQ_URL;


var startRabbitMQ = () => {
        amqp.connect(rabbitMQconfig + "?heartbeat=60", function(err, conn) {
            if (err) {
                console.error("[RabbitMQ]", err.message);
                return setTimeout(startRabbitMQ, 1000);
            }
            conn.on("error", function(err) {
                if (err.message !== "Connection closing") {
                    console.error("[RabbitMQ] conn error", err.message);
                }
            });
            conn.on("close", function() {
                console.error("[RabbitMQ] reconnecting");
                return setTimeout(startRabbitMQ, 1000);
            });
            console.log("[RabbitMQ] connected");
            amqpConn = conn;
            //   whenConnected();
        });
    }
    // startRabbitMQ();




var q = 'freeli-msg';
var qforwardMsg = 'freeli-forwardmMsg';

function bail(err) {
    console.error(88, err);
    process.exit(1);
}

// Publisher
function publisher(conn, data, io, socket) {
    conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);

        ch.assertQueue(q);
        ch.sendToQueue(q, Buffer.from(JSON.stringify(data)));
        // var attachment = data.attachment;
        var unreadChecklist = data.unreadChecklist;
        // var root_conv_id = data.root_conv_id;
        // var root_msg_id = data.root_msg_id;
        var mychecklist = data.mychecklist;
        // delete data['attachment'];
        // delete data['unreadChecklist'];
        // delete data['root_conv_id'];
        // delete data['root_msg_id'];
        // delete data['mychecklist'];
        data['checklist'] = mychecklist;
        data['unreadChecklist'] = unreadChecklist;
        data['message_pending'] = true;
        if (data.root_msg_id != null && data.root_msg_id != undefined) {
            io.to(socket.handshake.session.userdata.from).emit('newRepMessage', { msg: data, status: true });
            send_msg_firebase(socket.handshake.session.userdata.from, { msg: data, status: true }, 'newRepMessage');
            socket.broadcast.emit('newRepMessage', { msg: data, status: true });
        } else {
            io.to(socket.handshake.session.userdata.from).emit('newMessage', { msg: data });
            send_msg_firebase(socket.handshake.session.userdata.from, { msg: data }, 'newMessage');
            socket.broadcast.emit('newMessage', { msg: data });
        }
    }
}
// Publisher
function publisherForwardmsg(conn, data, returnData, socket, io) {
    conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(qforwardMsg);
        ch.sendToQueue(qforwardMsg, Buffer.from(JSON.stringify(data)));
        _.each(returnData, function(v, k) {
            // io.to(socket.handshake.session.userdata.from).emit('newMessage',  { msg: returnData});
            socket.broadcast.emit('newMessage', { status: true, msg: v });
        })
    }
}

// Consumer
function consumer(conn, data, socket, io) {
    var ok = conn.createChannel(on_open);
    // console.log(138,ok);
    function on_open(err, ch) {
        // console.log(140,err,ch)
        if (err != null) {
            bail(err);
        }
        ch.assertQueue(q);
        ch.consume(q, function(msg) {
            if (msg !== null) {
                var thismsg = JSON.parse(msg.content.toString());
                var attachment = thismsg.attachment;
                var unreadChecklist = thismsg.unreadChecklist;
                var root_conv_id = thismsg.root_conv_id;
                var root_msg_id = thismsg.root_msg_id;
                var mychecklist = thismsg.mychecklist;
                delete thismsg['attachment'];
                delete thismsg['unreadChecklist'];
                delete thismsg['root_conv_id'];
                delete thismsg['root_msg_id'];
                delete thismsg['mychecklist'];

                thismsg.msg_id = models.timeuuidFromString(thismsg.msg_id);
                thismsg.conversation_id = models.uuidFromString(thismsg.conversation_id);
                thismsg.sender = models.uuidFromString(thismsg.sender);
                if (thismsg.last_update_user != undefined) {
                    thismsg.last_update_user = models.uuidFromString(thismsg.last_update_user);
                }
                if (thismsg.updatedmsgid != undefined) {
                    thismsg.updatedmsgid = models.uuidFromString(thismsg.updatedmsgid);
                } else {
                    delete thismsg['old_created_time'];
                    delete thismsg['last_update_user'];
                }
                var message = new models.instance.Messages(thismsg);
                message.saveAsync()
                    .then(function(res) {

                        models.instance.Messages.findOne({ conversation_id: thismsg.conversation_id, msg_id: thismsg.msg_id }, function(err, message) {
                            if (err) {
                                console.log(94, err);
                            } else {
                                thismsg.attch_imgfile = (message.attch_imgfile == null) ? [] : message.attch_imgfile;
                                thismsg.attch_audiofile = (message.attch_audiofile == null) ? [] : message.attch_audiofile;
                                thismsg.attch_videofile = (message.attch_videofile == null) ? [] : message.attch_videofile;
                                thismsg.attch_otherfile = (message.attch_otherfile == null) ? [] : message.attch_otherfile;
                                if (thismsg.msg_type == 'checklist') {
                                    models.instance.MessageChecklist.find({ msg_id: thismsg.msg_id, $orderby: { '$desc': 'checklist_id' } }, function(error, checklist) {
                                        if (error) {
                                            console.log(250, error);
                                        } else {
                                            thismsg['checklist'] = checklist;
                                            thismsg['unreadChecklist'] = unreadChecklist;

                                            ch.ack(msg);
                                            console.log(84, '===========> msg sent successfully');
                                            socket.emit('remove_pending_status', { msg_id: thismsg.msg_id });
                                            // socket.broadcast.emit('newMessage',{msg:thismsg});

                                        }
                                    });
                                } else {
                                    if (attachment != undefined && attachment.allfiles !== undefined) {
                                        // console.log(143,{ allfiles: attachment.allfiles, msgid: thismsg.msg_id, conversation_id: thismsg.conversation_id, user_id: thismsg.sender, tempAttachmentTag: message.tag_list, mention_user: message.mention_user})
                                        if (attachment.allfiles.length > 0) {
                                            save_files_data({ allfiles: attachment.allfiles, msgid: thismsg.msg_id, conversation_id: thismsg.conversation_id, user_id: thismsg.sender, tempAttachmentTag: message.tag_list, mention_user: message.mention_user }, function(filedata) {

                                            });
                                        }
                                    }
                                    console.log(84, '===========> msg sent successfully');
                                    socket.emit('remove_pending_status', { msg_id: thismsg.msg_id });
                                    // if(root_msg_id != null && root_msg_id != undefined){
                                    //   thismsg['root_conv_id'] = root_conv_id;
                                    //   thismsg['root_msg_id'] = root_msg_id;
                                    //   io.to(thismsg.sender).emit('newRepMessage',  { msg: thismsg,status:true});
                                    //   socket.broadcast.emit('newRepMessage',{msg:thismsg,status:true});
                                    // }
                                    ch.ack(msg);
                                    // socket.broadcast.emit('newMessage',{msg:thismsg});
                                    // callback({status:true, msg: message});
                                }
                            };
                        });

                    })
                    .catch(function(err) {
                        console.log(263, err);
                    });

            }
        });
    }
}
// Consumer
function consumerForwardMsg(conn, data, returnData, socket, io) {
    var ok = conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(qforwardMsg);
        ch.consume(qforwardMsg, function(msg) {
            batchQueryDone(data).then((result) => {
                console.log('forwardmsg sent============')
                _.each(returnData, function(v, k) {
                    socket.emit('remove_pending_status', { msg_id: v.msg_id });
                })
            }).catch(err => {
                console.log(244, err)
            });


        });
    }
}

var updateChecklistLastTime = (data, callback) => {
    var createdat = new Date().getTime();
    var mqueries = [];
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(err1, result1) {
        if (err1) {
            console.log(err1);
        } else {
            models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, function(err2, result2) {
                if (err2) {
                    console.log(err2);
                } else {
                    var $ = cheerio.load(data.msg_body);
                    var mychecklist = [];
                    var unreadChecklist = false
                    var allChecklist = $('.msgCheckListContainer').find($('.checkListItem'));
                    var checklistTitle = $('.msgCheckListContainer').find($('.checkListPlainText')).text();
                    var q = models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { created_at: createdat, msg_body: checklistTitle, last_update_user: models.uuidFromString(data.user_id) }, { return_query: true });
                    mqueries.push(q);
                    result1[0]['created_at'] = createdat;
                    result1[0]['msg_body'] = checklistTitle;
                    _.each(allChecklist, function(v, k) {
                        var genid = models.timeuuid();
                        // var oldornew = $(v).attr('checklist-id');
                        var editOrnot = false;
                        // var last_action = null;
                        var last_edited_by = null;
                        var last_edited_at = null;
                        var created_at = new Date().getTime();
                        var created_by = $(v).find($('.checkBoxTitle')).attr('creator_id');
                        if ($(v).attr('checklist-id') != undefined) {
                            console.log(290, $(v).find($('.checkBoxTitle')).text().toString());
                            console.log(291, $(v).find($('.checkBoxTitle')).attr('data-title').toString());
                            console.log(292, $(v).find($('.checkBoxTitle')).text().toString() == $(v).find($('.checkBoxTitle')).attr('data-title').toString());
                            if ($(v).find($('.checkBoxTitle')).text().toString() == $(v).find($('.checkBoxTitle')).attr('data-title').toString()) {
                                editOrnot = false;
                                if ($(v).find($('.checkBoxTitle')).attr('edited-by').toString() != 'null') {
                                    last_edited_by = $(v).find($('.checkBoxTitle')).attr('edited-by').toString();
                                    last_edited_at = $(v).find($('.checkBoxTitle')).attr('edited-at').toString();
                                }

                            } else {
                                editOrnot = true;
                                last_edited_by = $(v).find($('.checkBoxTitle')).attr('my-id').toString();
                                last_edited_at = new Date().getTime();
                                // last_action = 'edit';
                            }
                            created_at = $(v).find($('.checkBoxTitle')).attr('created_at').toString();
                        }
                        var oldornew = undefined;
                        var checklist_status = parseInt($(v).attr('checklist_status'));
                        var review_status = parseInt($(v).attr('review_status'));
                        console.log(30000000000000005, $(v).attr('checklist-id'));
                        // (($(v).find($('.checkBox.checked')).length == 1)? 1:0)
                        var checklistData = {
                            checklist_id: ($(v).attr('checklist-id') != undefined) ? models.timeuuidFromString($(v).attr('checklist-id')) : genid,
                            msg_id: models.timeuuidFromString(data.msg_id),
                            msg_title: $('.msgCheckListContainer').find($('.checkListPlainText')).text().toString(),
                            created_by: models.uuidFromString($(v).find($('.checkBoxTitle')).attr('creator_id')),
                            checklist_title: $(v).find($('.checkBoxTitle')).text().toString(),
                            last_updated_by: (($(v).find($('.completed_by')).length == 1) ? $(v).find($('.completed_by')).attr('update-by') : null),
                            checklist_status: checklist_status,
                            review_status: review_status,
                            created_at: created_at,
                            last_edited_by: last_edited_by,
                            last_edited_at: last_edited_at,
                            convid: data.conversation_id.toString(),
                            start_due_date: created_at.toString(),
                            privacy: ($(v).find($('.dueDateIcon')).attr('data-privacy') != '' ? $(v).find($('.dueDateIcon')).attr('data-privacy') : null),
                            assign_to: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? $(v).find($('.dueDateIcon')).attr('data-assignee') : null),
                            last_action: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? $(v).find($('.dueDateIcon')).attr('data-assignee') : null),
                            assign_status: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? null : $(v).find($('.checkBoxTitle')).attr('creator_id')),
                            end_due_date: ($(v).find($('.dueDateIcon')).attr('end-date') != '' ? $(v).find($('.dueDateIcon')).attr('end-date') : null)
                        }
                        if (checklistData.end_due_date != '' && checklistData.end_due_date != undefined) {
                            var now = moment(Number(checklistData.start_due_date)).format('YYYY-MM-DD HH:mm');
                            var then = moment(Number(checklistData.end_due_date)).format('YYYY-MM-DD HH:mm');
                            var diff = moment(moment(now, "YYYY-MM-DD HH:mm").diff(moment(then, "YYYY-MM-DD HH:mm")));
                            var getdu = moment.duration(diff);
                            checklistData['original_ttl'] = (moment(then).diff(moment(now), 'minutes') * 60).toString();
                            checklistData['assignedby'] = checklistData.created_by.toString();
                            checklistData['assignby_role'] = 'admin';
                            checklistData['Is_direct_group'] = 'group';
                            checklistData['participant_id'] = [checklistData.created_by.toString(), checklistData.assign_to];
                            checklistData['request_repetition'] = 0;
                        }
                        console.log(350, checklistData);
                        mychecklist.push(checklistData);
                        // console.log(229,$(v).attr('checklist-id'))
                        if ($(v).attr('checklist-id') == undefined) {
                            if (unreadChecklist == false) {
                                unreadChecklist = true;
                            }
                        }
                        // $(v).attr('checklist-id',checklistData.checklist_id);
                        if ($(v).attr('checklist-id') == undefined) {
                            // delete checklistData['last_updated_by'];
                            if ($(v).find($('.completed_by')).length == 1) {
                                checklistData['last_updated_at'] = (($(v).find($('.completed_by')).attr('update-time') == undefined) ? $(v).attr('created-at') : $(v).find($('.completed_by')).attr('update-time'))
                            }

                            console.log(350, checklistData);
                            var q = new models.instance.MessageChecklist(checklistData);
                            console.log(550, checklistData);
                            var save_query = q.save({ return_query: true });
                            mqueries.push(save_query);
                            $(v).attr('created-at', moment().format('YYYY-MM-DD hh:mm:ss'));

                        } else {
                            var created_by = $(v).attr('created_by');
                            if (checklistData.checklist_status == NaN) {
                                checklistData.checklist_status = 0
                            }
                            var checklistData2 = {
                                msg_title: checklistTitle.toString(),
                                created_by: models.uuidFromString(created_by),
                                checklist_title: checklistData.checklist_title.toString(),
                                last_updated_by: checklistData.last_updated_by,
                                checklist_status: checklistData.checklist_status,
                                review_status: checklistData.review_status,
                                created_at: $(v).attr('created_at'),
                                last_updated_at: (($(v).find($('.completed_by')).attr('update-time') == undefined) ? $(v).attr('created-at') : $(v).find($('.completed_by')).attr('update-time'))

                            }
                            try {
                                mychecklist.push(checklistData2);
                                var q2 = models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString($(v).attr('checklist-id')) }, checklistData2, { return_query: true });
                                mqueries.push(q2);
                            } catch (e) {
                                console.log(380, "Error into checklist item update");
                            }
                        }
                    });
                    try {
                        models.doBatch(mqueries, function(err) {
                            if (err) {
                                console.log(386, err)
                            } else {
                                var returnData = { msg: result1[0], status: true };
                                models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, function(err5, result5) {
                                    if (err5) {
                                        console.log(err5)
                                    } else {
                                        returnData['checklist'] = result5;
                                        callback(returnData)
                                    }
                                })
                            }
                        });
                    } catch (e) {
                        console.log(402, "Error in catch block");
                    }
                }
            });
        }
    });
}
var sendNewMsg = (param,
    // io,
    // socket,
    // from,
    // sender_img,
    // sender_name,
    // conversation_id,
    // msg,
    // attachment,
    // timer,
    // old_created_time,
    // last_update_user,
    // updatedmsgid,
    // tag_list,
    // has_reply = null,
    // rep_id = null,
    // service_provider = null,
    callback) => {
    var io = param.io;
    var socket = param.socket;
    var from = param.from;
    var sender_img = param.sender_img;
    var sender_name = param.sender_name;
    var conversation_id = param.conversation_id;
    var msg = param.msg;
    var attachment = param.attachment;
    var timer = param.timer;
    var old_created_time = param.old_created_time;
    var last_update_user = param.last_update_user;
    var updatedmsgid = param.updatedmsgid;
    var tag_list = param.tag_list;
    var has_reply = (param.has_reply != undefined) ? param.has_reply : null;
    var mention_user = (param.mention_user != undefined) ? param.mention_user : [];
    var rep_id = (param.rep_id != undefined) ? param.rep_id : null;
    var root_conv_id = (param.root_conv_id != undefined) ? param.root_conv_id : null;
    var root_msg_id = (param.root_msg_id != undefined) ? param.root_msg_id : null;
    var service_provider = (param.service_provider != undefined) ? param.service_provider : [];
    var has_flagged = (param.has_flagged != undefined) ? param.has_flagged : [];

    if (tag_list == undefined || tag_list == null) {
        tag_list = [];
    }
    if (has_reply == null || has_reply == NaN) {
        has_reply = 0;
    }
    // console.log(560, param)
    models.instance.Conversation.findOne({ conversation_id: (root_conv_id == null ? models.uuidFromString(conversation_id) : models.uuidFromString(root_conv_id.toString())) }, function(er, conv) {
        var createdat = new Date().getTime();
        var msgid = models.timeuuid();
        // console.log(309,param);
        if (isRealString(msg)) {
            var uuidconversation_id = models.uuidFromString(conversation_id);
            if (last_update_user != null) {
                last_update_user = models.uuidFromString(last_update_user.toString());
            }

            var nullval = [];
            var uuidfrom = models.uuidFromString(from);
            var imgfile = (typeof attachment === 'undefined') ? nullval : attachment.imgfile;
            var audiofile = (typeof attachment === 'undefined') ? nullval : attachment.audiofile;
            var videofile = (typeof attachment === 'undefined') ? nullval : attachment.videofile;
            var otherfile = (typeof attachment === 'undefined') ? nullval : attachment.otherfile;

            var total_file_length = imgfile.length + audiofile.length + videofile.length + otherfile.length;

            console.log(470, imgfile)

            var msgType;
            console.log(323, imgfile, audiofile, videofile, otherfile);
            if (imgfile.length == 0 && audiofile.length == 0 && videofile.length == 0 && otherfile.length == 0 && msg.indexOf('href=') == -1) {
                if (msg.indexOf('class="msgCheckListContainer"') > 0) {
                    msgType = 'checklist';
                } else {
                    msgType = 'text';
                }
            } else {
                msgType = 'media';

                if (imgfile != null) {
                    if (imgfile.length > 0) {
                        msgType = msgType + '_imgfile';
                    }
                }
                if (audiofile != null) {
                    if (audiofile.length > 0) {
                        msgType = msgType + '_audiofile';
                    }
                }
                if (videofile != null) {
                    if (videofile.length > 0) {
                        msgType = msgType + '_videofile';
                    }
                }
                if (otherfile != null) {
                    if (otherfile.length > 0) {
                        msgType = msgType + '_otherfile';
                    }
                }
                if (msg.indexOf('href=')) {
                    msgType = msgType + '_link';
                }
                if (msgType == 'media') {
                    msgType = 'text';
                }
                if (msg.indexOf('class="msgCheckListContainer"') > 0) {
                    msgType = 'checklist';
                }

            }

            var $ = cheerio.load(msg);
            var checklistCheck = $('.msgCheckListContainer').length;
            var repconvQ = [];
            var t = $('html *').contents().map(function() {
                return (this.type === 'text') ? $(this).text() : '';
            }).get().join('');

            var mt = '';
            if (imgfile != null && audiofile != null && videofile != null && otherfile != null) {
                if (imgfile.length > 0) {
                    mt = mt + imgfile.join('');
                }
                if (audiofile.length > 0) {
                    mt = mt + audiofile.join('');
                }
                if (videofile.length > 0) {
                    mt = mt + videofile.join('');
                }
                if (otherfile.length > 0) {
                    mt = mt + otherfile.join('');
                }
            }

            var msg_text = t;
            checkrepmsg(rep_id).then((rep) => {
                console.log("637 =====================", uuidconversation_id.toString(), root_conv_id);
                var last_reply_time = moment().format('YYYY-MM-DD hh:mm:ss').toString();
                if (rep.status) {
                    if (rep.data.length > 0) {
                        var newRepconvid = models.uuid();
                        _.each(rep.data, function(v, k) {
                            var newMsg = v;
                            newMsg['msg_id'] = models.timeuuid();
                            newMsg['conversation_id'] = newRepconvid;
                            if (k == 1) {
                                last_reply_time = v.created_at;
                            }

                            var newMsgData = new models.instance.Messages(newMsg);
                            var msave_query = newMsgData.save({ return_query: true });
                            repconvQ.push(msave_query);

                        });
                        var newRepConv = {
                                rep_id: newRepconvid,
                                conversation_id: models.uuidFromString(conversation_id.toString()),
                                msg_id: msgid
                            }
                            // console.log(134,newRepConv);
                        var newRe = new models.instance.ReplayConv(newRepConv);
                        var msave_queryR = newRe.save({ return_query: true });
                        repconvQ.push(msave_queryR);
                    }
                    if (repconvQ.length > 0) {
                        models.doBatch(repconvQ, function(err) {
                            if (err) {
                                console.log(386, err)
                            } else {
                                console.log('repmsg success.')
                            }
                        });
                    }
                }
                var mychecklist = [];
                if (checklistCheck == 1) {
                    var allChecklist = $('.msgCheckListContainer').find($('.checkListItem'));
                    var checklistTitle = $('.msgCheckListContainer').find($('.checkListPlainText')).text();

                    checklistPromis(msgid, allChecklist, checklistTitle, $, from, sender_img, sender_name, conversation_id, msg, attachment, timer, old_created_time, last_update_user, conv).then((res) => {
                        // mychecklist = res.mychecklist;
                        if (res.mychecklist.length > 0) {
                            _.each(res.mychecklist, function(v, k) {
                                // console.log(v.last_updated_at,v.created_at)
                                // v.last_updated_at = moment(v.last_updated_at).format('LLLL');
                                v.created_at = moment(v.created_at).format('LLLL');
                                mychecklist.push(v);
                            });
                        }
                        sendNewMsgTempp(io, socket, nullval, msgid, msg, imgfile, audiofile, videofile, otherfile, uuidfrom, sender_name, sender_img, uuidconversation_id, timer, msgType, old_created_time, last_update_user, updatedmsgid, tag_list, has_reply, last_reply_time, res.unreadChecklist, msg_text, service_provider, mention_user, attachment, mychecklist, rep_id, root_conv_id, root_msg_id, has_flagged, conv, total_file_length, function(cbresult) {
                            callback(cbresult);
                        });
                    }).catch()
                    msg = checklistTitle;
                } else {
                    sendNewMsgTempp(io, socket, nullval, msgid, msg, imgfile, audiofile, videofile, otherfile, uuidfrom, sender_name, sender_img, uuidconversation_id, timer, msgType, old_created_time, last_update_user, updatedmsgid, tag_list, has_reply, last_reply_time, false, msg_text, service_provider, mention_user, attachment, mychecklist, rep_id, root_conv_id, root_msg_id, has_flagged, conv, total_file_length, function(cbresult) {
                        var file_conv_id = uuidconversation_id;
                        if (root_conv_id != null || rep_id != null) {
                            file_conv_id = models.timeuuidFromString(root_conv_id);
                        }
                        console.log("705 ===========", uuidconversation_id.toString(), file_conv_id.toString());
                        if (attachment !== undefined && attachment.allfiles !== undefined) {
                            if (!Array.isArray(attachment.allfiles)) {
                                attachment.allfiles = JSON.parse(attachment.allfiles);
                            }

                            if (otherfile != undefined && otherfile.length > 0) {
                                for (var i = 0; i < otherfile.length; i++) {
                                    _.each(attachment.allfiles, function(fv, fk) {
                                        if (fv.bucket + '/' + fv.key == otherfile[i]) {
                                            cbresult.msg.attch_otherfile_size.push(fv.size.toString());
                                            console.log(712, cbresult.msg.attch_otherfile_size);
                                            console.log(713, cbresult.msg.attch_imgfile);
                                        }
                                    });
                                }
                            }

                            save_files_data({ root_conv_id: uuidconversation_id.toString(), allfiles: attachment.allfiles, msgid: msgid, conversation_id: file_conv_id, user_id: uuidfrom, tempAttachmentTag: tag_list, mention_user: mention_user, conv: conv, secret_user: param.secret_user }, function(filedata) {
                                cbresult['filedata'] = filedata.data;
                                callback(cbresult);
                            });
                        } else {
                            callback(cbresult);
                        }
                    });

                }
            }).catch((errrr) => {
                console.log(errrr)
            })


        } else {
            callback({ status: false, err: 'Message formate not supported.' });
        }
    })
};

function checkrepmsg(rep_id) {
    return new Promise((resolve, reject) => {
        if (rep_id == null) {
            resolve({ status: false });
        } else {
            models.instance.Messages.find({ conversation_id: models.uuidFromString(rep_id) }, function(err, result) {
                if (err) {
                    console.log(441, err);
                } else {
                    resolve({ status: true, data: result });
                }
            })
        }
    });
}

function checklistPromis(msgid, allChecklist, checklistTitle, $, from, sender_img, sender_name, conversation_id, msg, attachment, timer, old_created_time, last_update_user, conv) {
    return new Promise((resolve, reject) => {
        var mychecklist = [];
        var mqueries = [];
        var unreadChecklist = false
        _.each(allChecklist, function(v, k) {
            var genid = models.timeuuid();
            // var oldornew = $(v).attr('checklist-id');
            var editOrnot = false;
            // var last_action = null;
            var last_edited_by = null;
            var last_edited_at = null;
            var created_at = new Date().getTime();
            if ($(v).attr('checklist-id') != undefined) {
                if ($(v).find($('.checkBoxTitle')).text().toString() == $(v).find($('.checkBoxTitle')).attr('data-title').toString()) {
                    editOrnot = false;
                    if ($(v).find($('.checkBoxTitle')).attr('edited-by').toString() != 'null') {
                        last_edited_by = $(v).find($('.checkBoxTitle')).attr('edited-by').toString();
                        last_edited_at = $(v).find($('.checkBoxTitle')).attr('edited-at').toString();
                    }

                } else {
                    editOrnot = true;
                    last_edited_by = $(v).find($('.checkBoxTitle')).attr('my-id').toString();
                    last_edited_at = new Date().getTime();
                    // last_action = 'edit';
                }
                created_at = $(v).find($('.checkBoxTitle')).attr('created_at').toString();
            }
            var oldornew = undefined;
            var checklist_status = parseInt($(v).attr('checklist_status'));
            if (checklist_status == NaN) {
                checklist_status = 0
            }
            var review_status = parseInt($(v).attr('review_status'));
            // (($(v).find($('.checkBox.checked')).length == 1)? 1:0)
            var checklistData = {
                checklist_id: (oldornew != undefined) ? $(v).attr('checklist-id') : genid,
                msg_id: msgid,
                msg_title: $('.msgCheckListContainer').find($('.checkListPlainText')).text().toString(),
                created_by: models.uuidFromString($(v).find($('.checkBoxTitle')).attr('creator_id')),
                checklist_title: $(v).find($('.checkBoxTitle')).text().toString(),
                last_updated_by: (($(v).find($('.completed_by')).length == 1) ? $(v).find($('.completed_by')).attr('update-by') : null),
                checklist_status: checklist_status,
                review_status: review_status,
                created_at: created_at,
                last_edited_by: last_edited_by,
                last_edited_at: last_edited_at,
                convid: conversation_id.toString(),
                start_due_date: created_at.toString(),
                privacy: ($(v).find($('.dueDateIcon')).attr('data-privacy') != '' ? $(v).find($('.dueDateIcon')).attr('data-privacy') : null),
                assign_to: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? $(v).find($('.dueDateIcon')).attr('data-assignee') : null),
                last_action: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? $(v).find($('.dueDateIcon')).attr('data-assignee') : null),
                assign_status: ($(v).find($('.dueDateIcon')).attr('data-assignee') != '' ? null : $(v).find($('.checkBoxTitle')).attr('creator_id')),
                end_due_date: ($(v).find($('.dueDateIcon')).attr('end-date') != '' ? $(v).find($('.dueDateIcon')).attr('end-date') : null),
                root_conv_id: (conv != undefined ? conv.root_conv_id != null ? conv.root_conv_id.toString() : null : null)
            }
            if (checklistData.end_due_date != '' && checklistData.end_due_date != undefined) {
                var now = moment(Number(checklistData.start_due_date)).format('YYYY-MM-DD HH:mm');
                var then = moment(Number(checklistData.end_due_date)).format('YYYY-MM-DD HH:mm');
                var diff = moment(moment(now, "YYYY-MM-DD HH:mm").diff(moment(then, "YYYY-MM-DD HH:mm")));
                var getdu = moment.duration(diff);
                checklistData['original_ttl'] = (moment(then).diff(moment(now), 'minutes') * 60).toString();
                checklistData['assignedby'] = checklistData.created_by.toString();
                checklistData['assign_status'] = checklistData.created_by.toString();
                checklistData['assignby_role'] = 'admin';
                checklistData['Is_direct_group'] = 'group';
                checklistData['participant_id'] = [checklistData.created_by.toString(), checklistData.assign_to];
                checklistData['request_repetition'] = 0;
            }
            // if(from.toString() == conversation_id.toString()){
            //   checklistData['assign_to'] = from.toString();
            //   checklistData['assignedby'] = from.toString();
            //   checklistData['assign_status'] = from.toString();
            // }

            mychecklist.push(checklistData);
            // console.log(229,$(v).attr('checklist-id'))
            if ($(v).attr('checklist-id') == undefined) {
                if (unreadChecklist == false) {
                    unreadChecklist = true;
                }
            }
            $(v).attr('checklist-id', checklistData.checklist_id);
            if (oldornew == undefined) {
                // delete checklistData['last_updated_by'];
                if ($(v).find($('.completed_by')).length == 1) {
                    checklistData['last_updated_at'] = (($(v).find($('.completed_by')).attr('update-time') == undefined) ? $(v).attr('created-at') : $(v).find($('.completed_by')).attr('update-time'))
                }


                var q = new models.instance.MessageChecklist(checklistData);
                console.log(550, checklistData);
                var save_query = q.save({ return_query: true });
                mqueries.push(save_query);
                $(v).attr('created-at', moment().format('YYYY-MM-DD hh:mm:ss'));

            } else {
                var created_by = $(v).attr('created_by');

                var checklistData2 = {
                    checklist_id: genid,
                    msg_id: msgid,
                    msg_title: checklistTitle.toString(),
                    created_by: models.uuidFromString(created_by),
                    checklist_title: checklistData.checklist_title.toString(),
                    last_updated_by: checklistData.last_updated_by,
                    checklist_status: checklistData.checklist_status,
                    review_status: checklistData.review_status,
                    created_at: $(v).attr('created_at'),
                    last_updated_at: (($(v).find($('.completed_by')).attr('update-time') == undefined) ? $(v).attr('created-at') : $(v).find($('.completed_by')).attr('update-time')),
                    root_conv_id: conv.root_conv_id

                }
                mychecklist.push(checklistData2);
                var q2 = new models.instance.MessageChecklist(checklistData2);
                var save_query2 = q2.save({ return_query: true });
                mqueries.push(save_query2);

                var query_object = {
                    msg_id: models.timeuuidFromString($(v).attr('msg_id')),
                    checklist_id: models.timeuuidFromString(checklistData.checklist_id)
                };
                models.instance.MessageChecklist.delete(query_object, function(err3) {
                    if (err3) {
                        console.log(err3)
                    } else {
                        console.log({ msg: 'Delete Success' })
                    }
                });

            }
        });
        models.doBatch(mqueries, function(err) {
            if (err) { console.log(522, err); } else {

                resolve({ status: true, unreadChecklist: unreadChecklist, mychecklist: mychecklist });
            }
        });

    });
}

function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
var sendNewMsgTempp = (io, socket, nullval, msgid, msg, imgfile, audiofile, videofile, otherfile, uuidfrom, sender_name, sender_img, uuidconversation_id, timer, msgType, old_created_time, last_update_user, updatedmsgid, tag_list, has_reply, last_reply_time, unreadChecklist, msg_text, service_provider, mention_user, attachment, mychecklist, rep_id, root_conv_id, root_msg_id, has_flagged, conv, total_file_length, callback) => {

    if (updatedmsgid == undefined) updatedmsgid = "";
    var ceriO = cheerio.load(msg_text);
    var totalData = {
        msg_id: msgid,
        msg_body: msg.toString(),
        attch_imgfile: imgfile,
        attch_audiofile: audiofile,
        attch_videofile: videofile,
        attch_otherfile: otherfile,
        sender: uuidfrom,
        sender_name: sender_name,
        sender_img: sender_img,
        has_delivered: 0,
        conversation_id: uuidconversation_id,
        has_reply: parseInt(has_reply),
        has_timer: timer,
        msg_type: msgType,
        tag_list: tag_list,
        old_created_time: old_created_time,
        last_update_user: last_update_user,
        msg_text: ceriO.text(),
        updatedmsgid: (updatedmsgid == '' ? null : models.uuidFromString(updatedmsgid)),
        service_provider: service_provider,
        mention_user: mention_user,
        has_hide: [],
        has_flagged: has_flagged,
        total_files: total_file_length.toString()
    }
    if (has_reply != 0) {
        totalData['last_reply_time'] = last_reply_time;
    }


    //this done by dalim for updating is_active col while new message com
    // var convquery = { conversation_id: uuidconversation_id,company_id:models.timeuuidFromString(userCompany_id[socket.handshake.session.userdata.from.toString()]) };
    // models.instance.Conversation.find(convquery, {raw: true, allow_filtering: true}, function(errconv, convfind){
    //   if(convfind.length == 1){
    //     var msgstatus = "";
    //     var abcd = (convfind[0].msg_status == null)?[]:(convfind[0].msg_status).split("@");
    //     _.each(convfind[0].participants, function(vp, kp){
    //         var kk = abcd.findIndex(element => element.includes(vp));
    //         if(vp == uuidfrom){
    //             msgstatus += vp+":0@";
    //         }
    //         else{
    //           var noofur = Number(abcd[kk].replace(vp+":", "")) + 1;
    //           msgstatus += vp+":"+noofur+"@";
    //         }
    //     });

    //     models.instance.Conversation.update(convquery ,{is_active: null, sender_id: uuidfrom, last_msg:msg,last_msg_time:moment().format('YYYY-MM-DD hh:mm:ss').toString(), msg_status: msgstatus },function (err) {
    //       if (err) {
    //         if (err) console.log('msg_js',err);
    //       } else {
    //         console.log("is_active remove successfully");
    //       }
    //     });
    //   }
    // });

    // amqp.connect(rabbitMQconfig, function(err, conn) {
    //     if (err != null) bail(err);
    //     totalData['unreadChecklist'] = unreadChecklist;
    //     totalData['attachment'] = attachment;
    //     totalData['root_conv_id'] = root_conv_id ,totalData['root_msg_id'] = root_msg_id;
    //     totalData['mychecklist'] = mychecklist;
    //     consumer(conn,totalData,socket,io);
    //     publisher(conn,totalData,io,socket);
    //   });
    //     totalData['unreadChecklist'] = unreadChecklist;
    //     totalData['attachment'] = attachment;
    //     totalData['root_conv_id'] = root_conv_id ,totalData['root_msg_id'] = root_msg_id;
    //     totalData['mychecklist'] = mychecklist;
    // consumer(amqpConn,totalData,socket,io);
    // publisher(amqpConn,totalData,io,socket);
    if (conv != null) {

        var guest_participants = (conv.participants_guest == null ? [] : conv.participants_guest);
        var msg_status = conv.participants;
        var edit_seen = [];
        for (var i = 0; i < guest_participants.length; i++) {

            removeA(msg_status, guest_participants[i].toString());
            removeA(edit_seen, guest_participants[i].toString());
        }
        removeA(msg_status, uuidfrom.toString());

        totalData['msg_status'] = msg_status;
        totalData['edit_seen'] = edit_seen;
        totalData['root_conv_id'] = conv.root_conv_id;

    }
    var message = new models.instance.Messages(totalData);
    message.saveAsync()
        .then(function(res) {
            models.instance.Messages.findOne({ conversation_id: uuidconversation_id, msg_id: msgid }, { raw: true, allow_filtering: true }, function(err, message) {
                if (err) {
                    callback({ status: false, err: err })
                } else {
                    message.attch_imgfile = (message.attch_imgfile == null) ? nullval : message.attch_imgfile;
                    message.attch_audiofile = (message.attch_audiofile == null) ? nullval : message.attch_audiofile;
                    message.attch_videofile = (message.attch_videofile == null) ? nullval : message.attch_videofile;
                    message.attch_otherfile = (message.attch_otherfile == null) ? nullval : message.attch_otherfile;
                    message.attch_otherfile_size = [];
                    message.link_title = "";
                    message.link_id = "";
                    if (msgType == 'checklist') {
                        models.instance.MessageChecklist.find({ msg_id: msgid, $orderby: { '$desc': 'checklist_id' } }, function(error, checklist) {
                            if (error) {
                                console.log(250, error)
                                callback({ status: false, err: error })
                            } else {
                                console.log('callbacksuccess')
                                callback({ status: true, msg: message, checklist: checklist, unreadChecklist: unreadChecklist });
                                update_conversation(uuidconversation_id, message);
                            }
                        });
                    } else {
                        callback({ status: true, msg: message });
                        update_conversation(uuidconversation_id, message);
                        if (conv != null) {
                            if (conv.root_conv_id != null) {
                                update_conversationForSub(models.uuidFromString(conv.root_conv_id), message);
                            }
                        }
                    }
                };
            });
            // callback({status:true, msg: {conversation_id: uuidconversation_id}});
        })
        .catch(function(err) {
            console.log(263, err)
            callback({ status: false, err: err });
        });
}

function update_conversation(conversation_id, msg) {
    models.instance.Conversation.findOne({ conversation_id }, { raw: true, allow_filtering: true }, function(err, conv) {
        if (err) { console.log('in message.js file find conversation error ', err); }
        if (conv) {
            var cur_time = new Date().getTime();
            // console.log(1060, msg);
            models.instance.Conversation.update({ conversation_id: conv.conversation_id, company_id: conv.company_id }, { last_msg: msg.msg_body, last_msg_time: cur_time, is_active: { '$remove': [msg.sender.toString()] } },
                update_if_exists,
                function(ue, data) {
                    if (ue) console.log("in message.js update conversation error ", ue);
                }
            )
        }
    });
}

function update_conversationForSub(conversation_id, msg) {
    models.instance.Conversation.findOne({ conversation_id }, { raw: true, allow_filtering: true }, function(err, conv) {
        if (err) { console.log('in message.js file find conversation error ', err); }
        if (conv) {
            var cur_time = new Date().getTime();
            models.instance.Conversation.update({ conversation_id: conv.conversation_id, company_id: conv.company_id }, { last_msg_time: cur_time, is_active: { '$remove': [msg.sender.toString()] } },
                update_if_exists,
                function(ue, data) {
                    if (ue) console.log("in message.js update conversation error ", ue);
                }
            )
        }
    });
}
var readOldMessage = (data, callback) => {
    models.instance.Messages.findOne({ msg_id: models.timeuuidFromString(data.old_msg_id) }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) callback({ status: false, error: err });
        else {
            var msgid = models.timeuuid();

            var message = new models.instance.Messages({
                msg_id: msgid,
                msg_body: message.msg_body,
                attch_imgfile: message.attch_imgfile,
                attch_audiofile: message.attch_audiofile,
                attch_videofile: message.attch_videofile,
                attch_otherfile: message.attch_otherfile,
                sender: models.uuidFromString(data.sender_id),
                sender_name: data.sender_name,
                sender_img: data.sender_img,
                conversation_id: models.uuidFromString(data.conversation_id)
            });

            message.saveAsync()
                .then(function(res) {
                    callback({ status: true, res: msgid, message_data: message });
                })
                .catch(function(err) {
                    callback({ status: false, err: err });
                });
        }
    });
};
var getConvCallMsg = (data, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_type: 'call' }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, data: message });
        }
    });
};
var getConvOnlyMsg = (data, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), $limit: 25 }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, data: message });
        }
    });
};

var getConvAllMsgs = (data, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id) }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, data: message });
        }
    });
};
var update_user_profile = (data, callback) => {
    var uid = data.id;
    models.instance.Users.update({ id: models.uuidFromString(data.id) }, { img: data.img, fullname: data.fullname }, update_if_exists, function(err, data) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            models.instance.Users.findOne({ id: models.uuidFromString(uid) }, function(error, user) {
                if (error) {
                    console.log(error);
                    callback({ status: false, data: data });
                }

                callback({ status: true, data: data, user });
            })
        }
    });
};
var update_company_profile = (data, callback) => {
    models.instance.Company.update({ company_id: models.timeuuidFromString(data.company_id), company_name: data.company_name }, { company_img: data.img }, update_if_exists, function(err, data) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            // models.instance.Users.findOne({ id: models.uuidFromString(uid) }, function(error, user) {
            // if (error) {
            // console.log(error);
            // callback({ status: false, data: data });
            // }
            callback({ status: true, data: data });
            // })
        }
    });
};

var add_reac_emoji = (conversation_id, msg_id, user_id, user_fullname, emoji, callback) => {
    var c_grinning = 0;
    var c_joy = 0;
    var c_open_mouth = 0;
    var c_disappointed_relieved = 0;
    var c_rage = 0;
    var c_thumbsup = 0;
    var c_thumbsdown = 0;
    var c_heart = 0;
    var c_folded_hands = 0;
    var c_check_mark = 0;
    // var c_warning = 0;

    models.instance.Messages.find({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) {
            console.log(error);
        } else {
            var messageEmoji = new models.instance.MessageEmoji({
                msg_id: models.timeuuidFromString(msg_id),
                user_id: models.uuidFromString(user_id),
                user_fullname: user_fullname,
                emoji_name: emoji
            });
            messageEmoji.saveAsync().then(function() {
                console.log('Ok');
            }).catch(function(err) {
                console.log(err);
            });
            if (message[0].has_emoji['folded_hands'] == undefined) {
                message[0].has_emoji['folded_hands'] = 0;
            }
            if (message[0].has_emoji['check_mark'] == undefined) {
                message[0].has_emoji['check_mark'] = 0;
            }
            // if (message[0].has_emoji['warning'] == undefined) {
            //     message[0].has_emoji['warning'] = 0;
            // }
            _.forEach(message[0].has_emoji, function(v, k) {
                switch (k) {
                    case "grinning":
                        v += (k == emoji) ? 1 : 0;
                        c_grinning += v;
                        break;
                    case "joy":
                        v += (k == emoji) ? 1 : 0;
                        c_joy += v;
                        break;
                    case "open_mouth":
                        v += (k == emoji) ? 1 : 0;
                        c_open_mouth += v;
                        break;
                    case "disappointed_relieved":
                        v += (k == emoji) ? 1 : 0;
                        c_disappointed_relieved += v;
                        break;
                    case "rage":
                        v += (k == emoji) ? 1 : 0;
                        c_rage += v;
                        break;
                    case "thumbsup":
                        v += (k == emoji) ? 1 : 0;
                        c_thumbsup += v;
                        break;
                    case "thumbsdown":
                        v += (k == emoji) ? 1 : 0;
                        c_thumbsdown += v;
                        break;
                    case "heart":
                        v += (k == emoji) ? 1 : 0;
                        c_heart += v;
                        break;
                    case "folded_hands":
                        v += (k == emoji) ? 1 : 0;
                        c_folded_hands += v;
                        break;
                    case "check_mark":
                        v += (k == emoji) ? 1 : 0;
                        c_check_mark += v;
                        break;
                        // case "warning":
                        //     v += (k == emoji) ? 1 : 0;
                        //     c_warning += v;
                        //     break;
                }
            });
            console.log(815, message);
            models.instance.Messages.update({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, {
                has_emoji: {
                    "grinning": c_grinning,
                    "joy": c_joy,
                    "open_mouth": c_open_mouth,
                    "disappointed_relieved": c_disappointed_relieved,
                    "rage": c_rage,
                    "thumbsup": c_thumbsup,
                    "thumbsdown": c_thumbsdown,
                    "heart": c_heart,
                    "folded_hands": c_folded_hands,
                    "check_mark": c_check_mark
                        // "warning": c_warning
                }
            }, update_if_exists, function(err) {
                if (err) {
                    callback({ status: false, err: err });

                } else {
                    models.instance.Messages.find({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err, message) {
                        console.log(832, message)
                    })
                    callback({ status: true, rep: 'add' });

                }
            });
        }
    });
};
var check_reac_emoji_list = (msg_id, uid, callback) => {
    models.instance.MessageEmoji.find({ msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, { raw: true, allow_filtering: true }, function(err, emoji_user) {
        if (err) {
            callback({ status: false, result: err });
        } else {
            callback({ status: true, result: emoji_user });
        }
    });
};
var delete_reac_emoji = (conversation_id, msg_id, uid, emoji, callback) => {
    models.instance.MessageEmoji.delete({ msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, function(err) {
        if (err) {
            callback({ status: false, result: err });
        } else {
            var c_grinning = 0;
            var c_joy = 0;
            var c_open_mouth = 0;
            var c_disappointed_relieved = 0;
            var c_rage = 0;
            var c_thumbsup = 0;
            var c_thumbsdown = 0;
            var c_heart = 0;
            var c_folded_hands = 0;
            var c_check_mark = 0;

            models.instance.Messages.find({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err, message) {
                if (err) {
                    console.log(error);
                } else {
                    _.forEach(message[0].has_emoji, function(v, k) {
                        switch (k) {
                            case "grinning":
                                v -= (k == emoji) ? 1 : 0;
                                c_grinning += v;
                                break;
                            case "joy":
                                v -= (k == emoji) ? 1 : 0;
                                c_joy += v;
                                break;
                            case "open_mouth":
                                v -= (k == emoji) ? 1 : 0;
                                c_open_mouth += v;
                                break;
                            case "disappointed_relieved":
                                v -= (k == emoji) ? 1 : 0;
                                c_disappointed_relieved += v;
                                break;
                            case "rage":
                                v -= (k == emoji) ? 1 : 0;
                                c_rage += v;
                                break;
                            case "thumbsup":
                                v -= (k == emoji) ? 1 : 0;
                                c_thumbsup += v;
                                break;
                            case "thumbsdown":
                                v -= (k == emoji) ? 1 : 0;
                                c_thumbsdown += v;
                                break;
                            case "heart":
                                v -= (k == emoji) ? 1 : 0;
                                c_heart += v;
                                break;
                            case "folded_hands":
                                v -= (k == emoji) ? 1 : 0;
                                c_folded_hands += v;
                                break;
                            case "check_mark":
                                v -= (k == emoji) ? 1 : 0;
                                c_check_mark += v;
                                break;
                        }
                    });

                    models.instance.Messages.update({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, {
                        has_emoji: {
                            '$add': {
                                "grinning": c_grinning,
                                "joy": c_joy,
                                "open_mouth": c_open_mouth,
                                "disappointed_relieved": c_disappointed_relieved,
                                "rage": c_rage,
                                "thumbsup": c_thumbsup,
                                "thumbsdown": c_thumbsdown,
                                "heart": c_heart,
                                "folded_hands": c_folded_hands,
                                "check_mark": c_check_mark
                            }
                        }
                    }, update_if_exists, function(err) {
                        if (err) callback({ status: false, err: err });
                        callback({ status: true, rep: 'delete' });
                        // callback({status: true, result: emoji_user});
                    });
                }
            });
            // callback({status: true});
        }
    });
};
var update_reac_emoji = (conversation_id, msg_id, uid, emoji, callback) => {
    var c_grinning = 0;
    var c_joy = 0;
    var c_open_mouth = 0;
    var c_disappointed_relieved = 0;
    var c_rage = 0;
    var c_thumbsup = 0;
    var c_thumbsdown = 0;
    var c_heart = 0;
    var c_folded_hands = 0;
    var c_check_mark = 0;
    models.instance.MessageEmoji.find({ msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, { raw: true, allow_filtering: true }, function(err, emoji_user) {
        if (err) callback({ status: false, err: err });
        else {
            var old_rec = emoji_user[0].emoji_name;
            models.instance.MessageEmoji.update({ msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, { emoji_name: emoji }, update_if_exists, function(err2) {
                if (err2) callback({ status: false, err: err2 });
                else {
                    models.instance.Messages.find({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err3, message) {
                        _.forEach(message[0].has_emoji, function(v, k) {
                            if (k == "grinning") {
                                c_grinning = v;
                                if (k == emoji) c_grinning++;
                                if (k == old_rec) c_grinning--;
                            }
                            if (k == "joy") {
                                c_joy = v;
                                if (k == emoji) c_joy++;
                                if (k == old_rec) c_joy--;
                            }
                            if (k == "open_mouth") {
                                c_open_mouth = v;
                                if (k == emoji) c_open_mouth++;
                                if (k == old_rec) c_open_mouth--;
                            }
                            if (k == "disappointed_relieved") {
                                c_disappointed_relieved = v;
                                if (k == emoji) c_disappointed_relieved++;
                                if (k == old_rec) c_disappointed_relieved--;
                            }
                            if (k == "rage") {
                                c_rage = v;
                                if (k == emoji) c_rage++;
                                if (k == old_rec) c_rage--;
                            }
                            if (k == "thumbsup") {
                                c_thumbsup = v;
                                if (k == emoji) c_thumbsup++;
                                if (k == old_rec) c_thumbsup--;
                            }
                            if (k == "thumbsdown") {
                                c_thumbsdown = v;
                                if (k == emoji) c_thumbsdown++;
                                if (k == old_rec) c_thumbsdown--;
                            }
                            if (k == "heart") {
                                c_heart = v;
                                if (k == emoji) c_heart++;
                                if (k == old_rec) c_heart--;
                            }
                            if (k == "folded_hands") {
                                c_folded_hands = v;
                                if (k == emoji) c_folded_hands++;
                                if (k == old_rec) c_folded_hands--;
                            }
                            if (k == "check_mark") {
                                c_check_mark = v;
                                if (k == emoji) c_check_mark++;
                                if (k == old_rec) c_check_mark--;
                            }
                        });

                        models.instance.Messages.update({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, {
                            has_emoji: {
                                '$add': {
                                    "grinning": c_grinning,
                                    "joy": c_joy,
                                    "open_mouth": c_open_mouth,
                                    "disappointed_relieved": c_disappointed_relieved,
                                    "rage": c_rage,
                                    "thumbsup": c_thumbsup,
                                    "thumbsdown": c_thumbsdown,
                                    "heart": c_heart,
                                    "folded_hands": c_folded_hands,
                                    "check_mark": c_check_mark
                                }
                            }
                        }, update_if_exists, function(err) {
                            if (err) callback({ status: false, err: err });
                            else callback({ status: true, rep: 'update', old_rep: old_rec });
                        });
                    });
                }
            });
        }
    });
};
var view_reac_emoji_list = (msg_id, emoji, callback) => {
    models.instance.MessageEmoji.find({ msg_id: models.timeuuidFromString(msg_id), emoji_name: emoji }, { raw: true, allow_filtering: true }, function(err, emoji_user_list) {
        if (err) {
            callback({ status: false, result: err });
        } else {
            callback({ status: true, result: emoji_user_list });
        }
    });
};


var flag_unflag = (msg_id, uid, is_add, conversation_id, callback) => {
    if (is_add == 'no') {
        models.instance.Messages.update({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, {
            has_flagged: { '$remove': [uid] }
        }, update_if_exists, function(err) {
            if (err) callback({ status: false, err: err });
            callback({ status: true });
        });
    } else if (is_add == 'yes') {
        models.instance.Messages.update({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, {
            has_flagged: { '$add': [uid] }
        }, update_if_exists, function(err) {
            if (err) callback({ status: false, err: err });
            callback({ status: true });
        });
    }
};

var commit_msg_delete = (convid, msg_id, uid, is_seen, remove, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(error, msg) {
        if (error) {
            callback({ status: false, err: error });
        } else if (msg.length == 1) {
            for (let i = 0; i < msg.length; i++) {
                updateMyrepMsgStatus({ conversation_id: convid, msg_id: msg[i].msg_id.toString(), user_id: uid, type: (is_seen == 'permanent_delete' ? 'for_all' : 'single') });
            }
            var attch_list = [];
            if (is_seen == 'permanent_delete') {
                if (uid == msg[0].sender) {
                    if (msg[0].attch_imgfile != null) {
                        for (var i = 0; i < msg[0].attch_imgfile.length; i++)
                            attch_list.push(msg[0].attch_imgfile[i].substring((msg[0].attch_imgfile[i].indexOf("/") + 1)));
                    }
                    if (msg[0].attch_audiofile != null) {
                        for (var i = 0; i < msg[0].attch_audiofile.length; i++)
                            attch_list.push(msg[0].attch_audiofile[i]);
                    }
                    if (msg[0].attch_videofile != null) {
                        for (var i = 0; i < msg[0].attch_videofile.length; i++)
                            attch_list.push(msg[0].attch_videofile[i]);
                    }
                    if (msg[0].attch_otherfile != null) {
                        for (var i = 0; i < msg[0].attch_otherfile.length; i++)
                            attch_list.push(msg[0].attch_otherfile[i].substring((msg[0].attch_otherfile[i].indexOf("/") + 1)));
                    }
                    models.instance.Messages.delete({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, function(err) {
                        if (err) console.log(err);
                        callback({ status: true, msg: 'Msg delete successfully', attch_list });
                    });
                } else {
                    models.instance.Messages.update({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, { has_hide: { '$add': [uid] } }, update_if_exists, function(err) {
                        if (err) console.log(err);
                        callback({ status: true, msg: 'Msg hide successfully', attch_list });
                    });
                }
            } else {
                if (msg[0].msg_status == null) { // unread msg can delete sender and system change the msg body for receiver
                    models.instance.Messages.update({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, {
                        has_delete: { '$add': [uid] },
                        msg_body: 'This message was deleted.'
                    }, update_if_exists, function(err) {
                        if (err) callback({ status: false, err: err, attch_list });
                        else {
                            models.instance.File.find({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
                                if (ferr) callback({ status: false, err: ferr });
                                if (files) {
                                    var queries = [];
                                    _.forEach(files, function(v, k) {
                                        var update_query = models.instance.File.update({ id: v.id }, { is_delete: 1 }, { if_exists: true, return_query: true });
                                        queries.push(update_query);
                                    });
                                    models.doBatch(queries, function(err) {
                                        if (err) {
                                            callback({ status: false, error: err });
                                        } else {
                                            callback({ status: true });
                                        }
                                    });
                                } else {
                                    callback({ status: true });
                                }
                            });
                        }
                        // callback({status: true, attch_list});
                    });
                } else { // add delete status, but connect no change
                    models.instance.Messages.find({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err, msg) {
                        if (msg.length == 1) {
                            if (remove == 'true') {
                                models.instance.Conversation.find({ conversation_id: models.uuidFromString(convid) }, { raw: true, allow_filtering: true }, function(eeee, conv) {
                                    models.instance.Messages.update({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, {
                                        has_delete: conv[0].participants
                                    }, update_if_exists, function(err) {
                                        if (err) callback({ status: false, err: err, attch_list });
                                        callback({ status: true, attch_list });
                                    });
                                });
                            } else {
                                models.instance.Messages.update({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id) }, {
                                    has_delete: { '$add': [uid] }
                                }, update_if_exists, function(err) {
                                    if (err) callback({ status: false, err: err, attch_list });
                                    else {
                                        models.instance.File.find({ conversation_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
                                            if (ferr) callback({ status: false, err: ferr });
                                            if (files) {
                                                var queries = [];
                                                _.forEach(files, function(v, k) {
                                                    var update_query = models.instance.File.update({ id: v.id }, { is_delete: 1 }, { if_exists: true, return_query: true });
                                                    queries.push(update_query);
                                                });
                                                models.doBatch(queries, function(err) {
                                                    if (err) {
                                                        callback({ status: false, error: err });
                                                    } else {
                                                        callback({ status: true });
                                                    }
                                                });
                                            } else {
                                                callback({ status: true });
                                            }
                                        });
                                    }
                                    // callback({status: true, attch_list});
                                });
                            }
                        }
                    });
                }
            }
        } else {
            callback({ status: false, err: 'Message id not found', attch_list });
        }
    });
};

var replyId = (msg_id, conversation_id, callback) => {
    models.instance.Messages.findOne({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id) }, function(error, msg) {
        if (error) callback({ status: false, result: error });
        else {
            models.instance.ReplayConv.find({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id) }, { raw: true, allow_filtering: true }, function(err, reply_info) {
                if (err) {
                    callback({ status: false, result: err });
                } else {
                    if (reply_info.length == 0) {
                        var reply_uuid = models.uuid();
                        var replyData = new models.instance.ReplayConv({
                            rep_id: reply_uuid,
                            msg_id: models.timeuuidFromString(msg_id),
                            conversation_id: models.uuidFromString(conversation_id)
                        });
                        replyData.saveAsync().then(function(res) {
                            callback({ status: true, result: reply_uuid, msgdata: msg });
                        }).catch(function(err) {
                            callback({ status: false, err: err });
                        });
                    } else {
                        callback({ status: true, result: reply_info[0].rep_id, msgdata: msg });
                    }
                }
            });
        }
    });
};
var thread_reply_update = (data, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { raw: true, allow_filtering: true }, function(err, msg_info) {
        if (err) {
            callback({ status: false, result: err });
        } else {
            // console.log(845,update_if_exists);
            if (msg_info.length > 0) {
                models.instance.Messages.update({ conversation_id: msg_info[0].conversation_id, msg_id: msg_info[0].msg_id }, { has_reply: (Number(msg_info[0].has_reply) + 1), last_reply_time: new Date().getTime(), last_reply_name: data.last_reply_name }, update_if_exists, function(err) {
                    if (err) callback({ status: false, msg: err });
                    callback({ status: true });
                });
            }
        }
    });
};


// var thread_replyAttch_update = (data, callback) =>{
//   models.instance.Messages.find({conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id)}, {raw:true, allow_filtering: true}, function(err, msg_info){
//     if(err){
//       callback({status: false, result: err});
//     }else{
//       if (msg_info[0].has_rep_attachment != null) {
//           models.instance.Messages.update({conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id)},
//               {has_rep_attachment: (Number(msg_info[0].has_rep_attachment) + data.has_rep_attachment)}, function(err){
//             if(err) callback({status:false, msg: err});
//             callback({status:true,has_rep_attachment: (Number(msg_info[0].has_rep_attachment) + data.has_rep_attachment)});
//         });
//       } else {
//           models.instance.Messages.update({conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id)},
//               {has_rep_attachment: data.has_rep_attachment}, function(err){
//             if(err) callback({status:false, msg: err});
//             callback({status:true, has_rep_attachment: data.has_rep_attachment});
//         });
//       }
//     }
//   });
// };

var find_reply_list = (msg_id, conversation_id, callback) => {
    models.instance.ReplayConv.find({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id) }, { raw: true, allow_filtering: true }, function(err, rep_id) {
        if (err) callback({ status: false, data: err });
        else {
            if (rep_id && rep_id.length > 0) {
                models.instance.Messages.find({ conversation_id: rep_id[0].rep_id }, { raw: true, allow_filtering: true }, function(error, rep_list) {
                    if (error) callback({ status: false, data: err });
                    models.instance.File.find({ conversation_id: rep_id[0].rep_id, is_delete: 0 }, { raw: true, allow_filtering: true }, function(ef, filedata) {
                        if (ef) console.log(1140, ef);

                        callback({ status: true, data: rep_list, files: filedata });
                    });
                });

            } else {
                callback({ status: false });
            }

        }
    });
};

var update_msg_status_add_viewer = ({}, uid, conversation_id, callback) => {
    models.instance.Messages.find({ conversation_id: models.uuidFromString(conversation_id) }, { raw: true, allow_filtering: true }, function(error, allmsgs) {
        if (error) {
            callback({ status: false, error });
        }
        // console.log(1234, allmsgs.length);
        var msg_ids = [];
        if (allmsgs && allmsgs.length > 0) {
            _.forEach(allmsgs, function(v, k) {
                if (v.sender != uid) {
                    if (v.msg_status == null) {
                        msg_ids.push(v.msg_id);
                        // console.log(1241, v.msg_id);
                    } else if (v.msg_status.indexOf(uid) > -1) {
                        msg_ids.push(v.msg_id);
                        // console.log(1245, v.msg_id);
                    }
                }
            });
            console.log(1249, msg_ids.length);
            if (msg_ids.length > 0) {
                var msgarray = Array.from(msg_ids);
                var query = {
                    conversation_id: { $eq: models.uuidFromString(conversation_id) },
                    msg_id: { '$in': msgarray }
                };

                models.instance.Messages.update(query, {
                    msg_status: { '$remove': [uid] },
                    has_delivered: 1
                }, function(err) {
                    if (err) {
                        callback({ status: false, error: err });
                    }
                    callback({ status: true, msg_ids });
                });
            } else {
                callback({ status: true });
            }
        }
    });
    // var messid = new Set();
    // _.forEach(msg_ids, function(val, k){
    //     console.log(val);
    //     messid.add(models.timeuuidFromString(val));
    // });
    // var msgarray = Array.from(messid);
    // var query = {
    //     conversation_id: {$eq: models.uuidFromString(conversation_id)},
    //     msg_id: {'$in': msgarray}
    // };
    // // console.log(886, query);

    // models.instance.Messages.update(query, {
    //     msg_status: {'$add': [uid]},
    //     has_delivered: 1
    // }, function(err){
    //     if(err){
    //         callback({status: false});
    //     }
    //     callback({status: true});
    // });
};

var update_seen_status = (msg_ids, uid, conversation_id, callback) => {
    var messid = new Set();
    _.forEach(msg_ids, function(val, k) {
        // console.log(val);
        messid.add(models.timeuuidFromString(val));
    });
    var msgarray = Array.from(messid);
    var query = {
        conversation_id: { $eq: models.uuidFromString(conversation_id) },
        msg_id: { '$in': msgarray }
    };
    // console.log(430, query);

    models.instance.Messages.update(query, {
        edit_seen: { '$remove': [uid] }
    }, update_if_exists, function(err) {
        if (err) {
            console.log(1160, 'msg_js', err);
            callback({ status: false });
        } else {

            callback({ status: true });
        }
    });
};


var update_one_msg_status_add_viewer = (msg_id, uid, conversation_id, callback) => {
    // console.log(16)
    //   var messid = new Set();
    //   messid.add(models.timeuuidFromString(msg_id));
    //   var msgarray = Array.from(messid);
    //   var query = {
    //       conversation_id: {$eq: models.uuidFromString(conversation_id)},
    //       msg_id: {'$in': msgarray}
    //   };
    var query = {
        conversation_id: { $eq: models.uuidFromString(conversation_id) },
        msg_id: models.timeuuidFromString(msg_id)
    };

    models.instance.Messages.update(query, {
        msg_status: { '$remove': [uid] },
        has_delivered: 1
    }, update_if_exists, function(err) {
        if (err) {
            callback({ status: false });
            console.log(1183, 'msg_js', err);
        }
    });
    callback({ status: true });
};


var sendBusyMsg = (data, callback) => {
    if (typeof data.user_id == 'object') {
        var uuidfrom = (data.user_id);
    } else {
        var uuidfrom = models.uuidFromString(data.user_id);
    }


    var query_object = { id: uuidfrom };
    var update_values_object = { is_busy: data.is_busy };
    var options = { ttl: 86400, if_exists: true };

    models.instance.Users.update(query_object, update_values_object, update_if_exists, function(err) {
        if (err) callback({ status: false, err: err });
        callback({ status: true });
    });
};

// var sendCallMsg = (from, sender_img, sender_name, conversation_id, msg, msgtype,msgduration, callback) => {

//   var createdat = new Date().getTime();
//   var msgid = models.timeuuid();
//   if(isRealString(msg)){
//     uuidconversation_id = models.uuidFromString(conversation_id);
//     uuidfrom = models.uuidFromString(from);
//     var message = new models.instance.Messages({
//         msg_id: msgid,
//         call_type: msg,
//         call_status: 'missed',
//         sender: uuidfrom,
//         sender_name: sender_name,
//         sender_img: sender_img,
//         conversation_id: uuidconversation_id,
//         msg_type : msgtype,
//         call_duration: msgduration
//     });

//     message.saveAsync()
//         .then(function(res) {
//             callback({status:true, res: msgid});
//         })
//         .catch(function(err) {
//             callback({status:false, err: err});
//         });
//   } else {
//     callback({status:false, err: 'Message formate not supported.'});
//   }
// };

// var getUserIsBusy = (from, callback) => {
//   models.instance.Users.findOne({id: models.uuidFromString(from)}, {raw:true, allow_filtering: true}, function(err, user){
//         if(err) console.log('msg_js',err);
//         //user is an array of plain objects with only name and age
//         if(user){
//           callback({status:user.is_busy});

//         } else {
//           callback({status:false});
//         }
//     });
//   };

var get_group_lists = (user_id, callback) => {
    var query = {
        participants: { $contains: user_id },
        group: { $eq: 'yes' },
        single: { $eq: 'no' }
    };
    models.instance.Conversation.find(query, { raw: true, allow_filtering: true },
        function(err, peoples) {
            if (err) callback({ status: false, result: err });
            else callback({ status: true, result: peoples });
        });
};


var hasMessageThisTag = (conversation_id, msgid, userid, tagname, callback) => {

    var query = {
        tag_title: { $eq: tagname },
        message_id: { $eq: models.uuidFromString(msgid) }
    };

    models.instance.MessagesTag.find(query, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            if (error) throw error;
        } else {

            if (tags.length == 0) {
                var tagid = models.timeuuid();
                var createdat = new Date().getTime();
                var messagestags = new models.instance.MessagesTag({
                    tag_id: tagid,
                    created_by: models.uuidFromString(userid),
                    created_at: createdat,
                    tag_title: tagname,
                    tagged_by: models.uuidFromString(userid),
                    conversation_id: models.uuidFromString(conversation_id),
                    message_id: models.uuidFromString(msgid)
                });
                messagestags.saveAsync().then(function() {
                    callback({ status: true, tagid: tagid });
                }).catch(function(err) {
                    if (err) console.log(1293, 'msg_js', err);
                });
            } else {
                callback({ status: false, err: 'Already tagged' });
            }

        }
    });
};

var hasUserThisTag = (convrsationid, msgid, userid, tagname, callback) => {

    var query = {
        tag_title: { $contains: tagname },
        conversation_id: { $eq: models.uuidFromString(convrsationid) },
        message_id: { $eq: models.uuidFromString(msgid) },
        created_by: { $eq: models.uuidFromString(userid) }
    };

    models.instance.MessagesTag.find(query, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, hasUserThisTag: tags });
        }
    });
};

var get_messages_tag = (conversation_id, callback) => {
    var query = {
        conversation_id: { $eq: models.uuidFromString(conversation_id) }
    };

    models.instance.MessagesTag.find(query, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, tags: tags });
        }
    });
};

// var deleteThisTag = (tagid, callback) =>{
//   var query_object = {
//     tag_id: models.timeuuidFromString(tagid)
//   };
//
//   models.instance.MessagesTag.delete(query_object, function(err){
//     if(err) {
//       callback({status: false});
//     }else {
//       callback({status: true});
//     }
//   });
// };

var deleteThisTag = (mstagids, tagTitle, tagid, rommID, callback) => {
    // console.log({mstagids,tagTitle,tagid});
    var mtagsid = [];

    var query_object = {
        id: models.uuidFromString(tagid)
    };

    models.instance.Convtag.delete(query_object, function(err) {
        if (err) {
            console.log(err);
            callback({ status: false });
        } else {
            if (mstagids.length == 0) {
                callback({ status: true });
            } else {
                if (mstagids.length > 0) {
                    var mqueries = [];
                    _.each(mstagids, function(v, k) {
                        var update_query = models.instance.MessagesTag.update({ id: models.timeuuidFromString(v) }, { tag_title: { $remove: [tagTitle] } }, { if_exists: true, return_query: true });
                        mqueries.push(update_query);
                        mtagsid.push(v);
                    });

                    models.doBatch(mqueries, function(err) {
                        if (err) { console.log(1378, 'msg_js', err); } else {
                            callback({ status: true });
                        }
                    });
                }
            }

        }
    });
};
// var getAllUnread = (user_id, callback) =>{

//   models.instance.Messages.find({},{ raw: true, allow_filtering: true }, function(err, tags) {
//     if(err){
//       console.log(err);
//     }else{
//       var query = {
//         participants: { $contains: user_id }
//       };

//       models.instance.Conversation.find( query, { raw: true, allow_filtering: true }, function(err, peoples) {
//         if (err) console.log('msg_js',err);

//         models.instance.ReplayConv.find({},{ raw: true, allow_filtering: true }, function(err, ReplayConvs) {
//           if(err){
//             console.log(err);
//           }else{

//             var replyConvID = []; //reply id as conversation in msg tbl
//             var replyMsgConvID = []; //message conversation id which has reply thread
//             var replyMsg = []; //message conversation which has reply thread
//             var replyRootMsgID = []; //message conversation which has reply thread

//             _.forEach(newrplList, function(rv,rk){
//               _.forEach(tags, function(tv,tk){
//                 if(rv.msg_id.toString() == tv.msg_id.toString()){
//                   replyConvID.push(rv.rep_id.toString());
//                   replyMsgConvID.push(rv.conversation_id.toString());
//                   replyRootMsgID.push(rv.msg_id.toString());
//                 }
//               });
//             });

//             var replyConvIDunique = replyConvID.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

//             _.forEach(replyConvIDunique, function(rcv,tck){
//               _.forEach(tags, function(tv,tk){
//                 if(tv.conversation_id.toString() == rcv){
//                   if(tv.sender.toString() != user_id.toString()){
//                     replyMsg.push({
//                       'conversation_id':replyMsgConvID[tck],
//                       'msg_body':tv.msg_body,
//                       'created_at':tv.created_at,
//                       'msg_id':replyRootMsgID[tck]
//                     });
//                   }
//                 }
//               });
//             });

//             _.sortBy(replyMsg, ['created_at'],'desc');

//             var status = [];
//             var conversation = [];
//             _.forEach(tags, function(v,k){
//               conversation.push(v.conversation_id.toString());
//               _.forEach(peoples, function(valu,key){
//                 if(v.conversation_id.toString() == valu.conversation_id.toString()){
//                   if(v.sender.toString() != user_id.toString()){
//                     status.push({
//                       "conersation_id":v.conversation_id.toString(),
//                       "msg_id":v.msg_id.toString(),
//                       "msg_status":v.msg_status,
//                       "msg":v.msg_body,
//                       "created_at":v.created_at
//                     });
//                   }

//                 }
//               });
//             });

//             var array_elements = [];
//             var msgbodyArray = [];
//             var unique = conversation.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
//             _.forEach(status, function(v,k){
//               if(conversation.indexOf(v.conersation_id) != -1){
//                 if(v.msg_status == null){
//                   array_elements.push(v.conersation_id);
//                   msgbodyArray.push({
//                     'conversation_id':v.conersation_id,
//                     'msg_body':v.msg,
//                     'created_at':v.created_at,
//                     'msg_id':v.msg_id
//                   });
//                 }
//               }
//             });

//             array_elements.sort();
//             var newMsgBoddy = replyMsg.concat(msgbodyArray);
//             callback({status: true, array_elements:array_elements,msgbodyArray:newMsgBoddy,unique:unique});
//           }
//         });
//       });
//     }
//   });
// };

// var getAllUnread = (user_id, callback) =>{

//   models.instance.Messages.find({},{ raw: true, allow_filtering: true }, function(err, tags) {
//     if(err){
//       console.log(err);
//     }else{
//       var query = {
//         participants: { $contains: user_id }
//       };

//       models.instance.Conversation.find( query, { raw: true, allow_filtering: true }, function(err, peoples) {
//         if (err) console.log('msg_js',err);

//         models.instance.ReplayConv.find({},{ raw: true, allow_filtering: true }, function(err, ReplayConvs) {
//           if(err){
//             console.log(err);
//           }else{

//             var replyConvID = []; //reply id as conversation in msg tbl
//             var replyMsgConvID = []; //message conversation id which has reply thread
//             var replyMsg = []; //message conversation which has reply thread
//             var replyRootMsgID = []; //message conversation which has reply thread

//             var newrplList = _.sortBy(ReplayConvs, ['rep_id']);

//             _.forEach(newrplList, function(rv,rk){
//               _.forEach(tags, function(tv,tk){
//                 if(rv.msg_id.toString() == tv.msg_id.toString()){
//                   replyConvID.push(rv.rep_id.toString());
//                   replyMsgConvID.push(rv.conversation_id.toString());
//                   replyRootMsgID.push(rv.msg_id.toString());
//                 }
//               });
//             });

//             var replyConvIDunique = replyConvID.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

//             _.forEach(replyConvIDunique, function(rcv,tck){
//               _.forEach(tags, function(tv,tk){
//                 if(tv.conversation_id.toString() == rcv){
//                   if(tv.sender.toString() != user_id.toString()){
//                     replyMsg.push({
//                       'conversation_id':replyMsgConvID[tck],
//                       'conversation_rep_id':tv.conversation_id.toString(),
//                       'msg_body':tv.msg_body,
//                       'created_at':tv.created_at,
//                       'msg_id':replyRootMsgID[tck],
//                       'msg_status':tv.msg_status
//                     });
//                   }
//                 }
//               });
//             });


//             var OrreplyMsg = _.orderBy(replyMsg, ['created_at'], ['desc']);
//             var newReplyList = [];
//             var neMsgBody = [];

//             _.forEach(OrreplyMsg, function(cv,ck){
//               if(cv.msg_status != null){
//                 var parti = cv.msg_status;
//                 if(parti.indexOf(user_id.toString()) == -1){
//                   neMsgBody.push({
//                     'conversation_id':cv.conversation_id,
//                     'msg_body':cv.msg_body,
//                     'created_at':cv.created_at,
//                     'msg_id':cv.msg_id,
//                     'msg_type':'reply'
//                   });
//                 }
//               }else{
//                 if(newReplyList.indexOf(cv.conversation_rep_id) == -1){
//                   newReplyList.push(cv.conversation_rep_id);
//                   neMsgBody.push({
//                     'conversation_id':cv.conversation_id,
//                     'msg_body':cv.msg_body,
//                     'created_at':cv.created_at,
//                     'msg_id':cv.msg_id,
//                     'msg_type':'reply'
//                   });
//                 }
//               }

//             });

//             var status = [];
//             var conversation = [];

//             _.forEach(tags, function(v,k){
//               conversation.push(v.conversation_id.toString());
//               _.forEach(peoples, function(valu,key){
//                 if(v.conversation_id.toString() == valu.conversation_id.toString()){
//                   if(v.sender.toString() != user_id.toString()){
//                     status.push({
//                       "conersation_id":v.conversation_id.toString(),
//                       "msg_id":v.msg_id.toString(),
//                       "msg_status":v.msg_status,
//                       "msg":v.msg_body,
//                       "created_at":v.created_at
//                     });
//                   }
//                 }
//               });
//             });

//             var array_elements = [];
//             var msgbodyArray = [];

//             var unique = conversation.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
//             _.forEach(status, function(v,k){
//               if(conversation.indexOf(v.conersation_id) != -1){
//                 if(v.msg_status == null){
//                   array_elements.push(v.conersation_id);
//                   msgbodyArray.push({
//                     'conversation_id':v.conersation_id,
//                     'msg_body':v.msg,
//                     'created_at':v.created_at,
//                     'msg_id':v.msg_id,
//                     'msg_type':'direct'
//                   });
//                 }
//               }
//             });

//             array_elements.sort();
//             var newMsgBoddy = neMsgBody.concat(msgbodyArray);
//             callback({status: true, array_elements:array_elements,msgbodyArray:newMsgBoddy,unique:unique});

//           }
//         });
//       });
//     }
//   });
// };

var getAllUnread = (user_id, callback) => {

    models.instance.Messages.find({}, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            console.log(err);
        } else {
            var query = {
                participants: { $contains: user_id }
            };

            models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(err, peoples) {
                if (err) console.log(1635, 'msg_js', err);

                models.instance.ReplayConv.find({}, { raw: true, allow_filtering: true }, function(err, ReplayConvs) {
                    if (err) {
                        console.log(err);
                    } else {

                        var replyConvID = []; //reply id as conversation in msg tbl
                        var replyMsgConvID = []; //message conversation id which has reply thread
                        var replyMsg = []; //message conversation which has reply thread
                        var replyRootMsgID = []; //message conversation which has reply thread

                        var newrplList = _.sortBy(ReplayConvs, ['rep_id']);

                        _.forEach(newrplList, function(rv, rk) {
                            _.forEach(tags, function(tv, tk) {
                                if (rv.msg_id.toString() == tv.msg_id.toString()) {
                                    replyConvID.push(rv.rep_id.toString());
                                    replyMsgConvID.push(rv.conversation_id.toString());
                                    replyRootMsgID.push(rv.msg_id.toString());
                                }
                            });
                        });

                        var replyConvIDunique = replyConvID.filter(function(item, i, ar) { return ar.indexOf(item) === i; });

                        _.forEach(replyConvIDunique, function(rcv, tck) {
                            _.forEach(tags, function(tv, tk) {
                                if (tv.conversation_id.toString() == rcv) {
                                    if (tv.sender.toString() != user_id.toString()) {
                                        replyMsg.push({
                                            'conversation_id': replyMsgConvID[tck],
                                            'conversation_rep_id': tv.conversation_id.toString(),
                                            'msg_body': tv.msg_body,
                                            'created_at': tv.created_at,
                                            'msg_id': replyRootMsgID[tck],
                                            'msg_status': tv.msg_status,
                                            'sender_img': tv.sender_img,
                                            'sender_name': tv.sender_name
                                        });
                                    }
                                }
                            });
                        });

                        var OrreplyMsg = _.orderBy(replyMsg, ['created_at'], ['desc']);
                        var newReplyList = [];
                        var neMsgBody = [];

                        _.forEach(OrreplyMsg, function(cv, ck) {
                            if (cv.msg_status != null) {
                                var parti = cv.msg_status;
                                if (parti.indexOf(user_id.toString()) == -1) {
                                    neMsgBody.push({
                                        'conversation_id': cv.conversation_id,
                                        'msg_body': cv.msg_body,
                                        'created_at': cv.created_at,
                                        'msg_id': cv.msg_id,
                                        'msg_type': 'reply',
                                        'sender_img': cv.sender_img,
                                        'sender_name': cv.sender_name
                                    });
                                }
                            } else {
                                if (newReplyList.indexOf(cv.conversation_rep_id) == -1) {
                                    newReplyList.push(cv.conversation_rep_id);
                                    neMsgBody.push({
                                        'conversation_id': cv.conversation_id,
                                        'msg_body': cv.msg_body,
                                        'created_at': cv.created_at,
                                        'msg_id': cv.msg_id,
                                        'msg_type': 'reply',
                                        'sender_img': cv.sender_img,
                                        'sender_name': cv.sender_name
                                    });
                                }
                            }

                        });

                        var status = [];
                        var conversation = [];

                        _.forEach(tags, function(v, k) {
                            conversation.push(v.conversation_id.toString());
                            _.forEach(peoples, function(valu, key) {
                                if (v.conversation_id.toString() == valu.conversation_id.toString()) {
                                    if (v.sender.toString() != user_id.toString()) {
                                        status.push({
                                            "conersation_id": v.conversation_id.toString(),
                                            "msg_id": v.msg_id.toString(),
                                            "msg_status": v.msg_status,
                                            "msg": v.msg_body,
                                            "created_at": v.created_at,
                                            'sender_img': v.sender_img,
                                            'sender_name': v.sender_name
                                        });
                                    }
                                }
                            });
                        });

                        var array_elements = [];
                        var msgbodyArray = [];
                        var ReadmsgbodyArray = [];

                        var unique = conversation.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
                        _.forEach(status, function(v, k) {
                            if (conversation.indexOf(v.conersation_id) != -1) {
                                if (v.msg_status == null) {
                                    array_elements.push(v.conersation_id);
                                    msgbodyArray.push({
                                        'conversation_id': v.conersation_id,
                                        'msg_body': v.msg,
                                        'created_at': v.created_at,
                                        'msg_id': v.msg_id,
                                        'msg_type': 'direct',
                                        'sender_img': v.sender_img,
                                        'sender_name': v.sender_name
                                    });
                                } else {
                                    ReadmsgbodyArray.push({
                                        'conversation_id': v.conersation_id,
                                        'msg_body': v.msg,
                                        'created_at': v.created_at,
                                        'msg_id': v.msg_id,
                                        'msg_type': 'read',
                                        'sender_img': v.sender_img,
                                        'sender_name': v.sender_name
                                    });
                                }
                            }
                        });



                        array_elements.sort();
                        var newMsgBoddy = neMsgBody.concat(msgbodyArray);
                        var unreadmsgbody = msgbodyArray;
                        var Readmsgbody = ReadmsgbodyArray;
                        callback({
                            status: true,
                            array_elements: array_elements,
                            msgbodyArray: newMsgBoddy,
                            unique: unique,
                            unreadmsgbody: unreadmsgbody,
                            Readmsgbody: Readmsgbody
                        });

                    }
                });
            });
        }
    });
};

var getAllUnreadConv = (data, uid, callback) => {
    var allConvId = [];
    var all_unread = [];
    var msg_has_rep = [];
    var unread_replay = [];
    var edit_unseen = [];
    var lastMsg = {};
    var all_msg_desc = [];

    if (data.length > 0) {
        var convid = new Set();
        _.forEach(data, function(val, k) {
            convid.add(models.uuidFromString(val));
        });
        var convid_array = Array.from(convid);
        var query = {
            conversation_id: { '$in': convid_array }
        };


        models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error, all_msg) {
            if (error) console.log({ status: false }, error);
            console.log(1974, "==============================", all_msg.length);
            // Get all unread messages
            // var all_msg_desc = _.orderBy(all_msg, ['cre'], ['desc']);
            _.forEach(all_msg, function(amv, amk) {
                if (allConvId.indexOf(amv.conversation_id.toString()) == -1) {
                    allConvId.push(amv.conversation_id.toString());
                    lastMsg[amv.conversation_id.toString()] = {
                        "convid": amv.conversation_id,
                        "time": amv.created_at,
                        "msgBody": amv.msg_body,
                        "msg_type": amv.msg_type
                    };
                }

                if (amv.sender != null) {
                    if (amv.msg_status == null && amv.sender.toString() != uid) {
                        all_unread.push(amv);
                    }

                    if (amv.has_reply > 0) {
                        if (msg_has_rep.indexOf(amv.msg_id) == -1) {
                            if (amv.has_hide != null) {
                                if (amv.has_hide.indexOf(uid) == -1) {
                                    msg_has_rep.push(amv.msg_id);
                                }
                            } else {
                                msg_has_rep.push(amv.msg_id);
                            }
                        }
                    }
                    if (amv.sender.toString() != uid) {
                        if (amv.edit_status != null) {
                            if (amv.edit_seen != null) {
                                if (amv.edit_seen.indexOf(uid) === -1) {
                                    edit_unseen.push(amv);
                                }
                            } else {
                                edit_unseen.push(amv);
                            }

                        }
                    }
                }
            });

            var all_msg_desc = _.orderBy(lastMsg, ['time'], ['desc']);
            console.log(2017, all_msg_desc.length);
            // Get all unread replay
            if (msg_has_rep.length) {
                models.instance.ReplayConv.find({ msg_id: { '$in': msg_has_rep } }, { raw: true, allow_filtering: true }, function(error_rep, rep_con_data) {
                    if (error_rep) console.log({ status: false }, error_rep);

                    var rep_con_id = [];
                    _.forEach(rep_con_data, function(rcv, rck) {
                        rep_con_id.push(rcv.rep_id);
                    });

                    var query = { conversation_id: { '$in': rep_con_id } };
                    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error_rep, all_rep_msg) {
                        if (error_rep) console.log({ status: false }, error_rep);

                        _.forEach(all_rep_msg, function(amv, amk) {
                            if (amv.msg_status == null && amv.sender.toString() != uid)
                                unread_replay.push(amv);
                        });
                        callback({
                            status: true,
                            data: {
                                all_unread,
                                unread_replay,
                                rep_con_data,
                                edit_unseen,
                                all_msg_desc
                            }
                        }, false);
                    });
                });
            } else {
                callback({
                    status: true,
                    data: {
                        all_unread,
                        edit_unseen,
                        unread_replay,
                        rep_con_data: [],
                        all_msg_desc
                    }
                }, false);
            }
        });
    } else {
        callback({
            status: true,
            data: {
                all_unread,
                edit_unseen,
                unread_replay,
                rep_con_data: [],
                all_msg_desc
            }
        }, false);
    }

};

function getMyAllUnreadMsg(user_id) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ msg_status: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js 2315', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}

function get_assign_chk(user_id, convid = false) {
    return new Promise((resolve, reject) => {
        var query = { assign_to: user_id, checklist_status: 0 };
        if (convid !== false) query.convid = convid;
        models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js get_assign_chk', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}

function get_last_action_chk(user_id, convid = false) {
    return new Promise((resolve, reject) => {
        var query = { last_action: user_id, checklist_status: 0 };
        if (convid !== false) query.convid = convid;
        models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js get_last_action_chk', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}

function get_create_chk(user_id, convid = false) {
    return new Promise((resolve, reject) => {
        var query = { created_by: models.uuidFromString(user_id), checklist_status: 0 };
        if (convid !== false) query.convid = convid;
        models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js get_create_chk', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}

function get_al_assign_chk(user_id, convid = false) {
    return new Promise((resolve, reject) => {
        var query = { alternative_assign_to: user_id, checklist_status: 0 };
        if (convid !== false) query.convid = convid;
        models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js get_al_assign_chk', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}
async function has_pending_chk_in_conv(data, callback) {
    console.log(2430, data);
    // var assign_chk = await get_assign_chk(data.user_id, data.convid);
    var last_action_chk = await get_last_action_chk(data.user_id, data.convid);
    // console.log(2408, assign_chk.length);
    var create_chk = await get_create_chk(data.user_id, data.convid);
    // console.log(2410, create_chk.length);
    // var al_assign_chk = await get_al_assign_chk(data.user_id, data.convid);
    // console.log(2412, al_assign_chk.length);
    var all_chk_ids = [];
    var all_chk = [];
    // for(let n=0; n<assign_chk.length; n++){
    //   if(assign_chk[n].convid != null && all_chk_ids.indexOf(assign_chk[n].checklist_id.toString()) == -1){
    //     all_chk.push(assign_chk[n]);
    //     all_chk_ids.push(assign_chk[n].checklist_id.toString());
    //     // console.log(2419, all_chk_ids.length);
    //   }
    // }
    for (let n = 0; n < last_action_chk.length; n++) {
        if (last_action_chk[n].convid != null && all_chk_ids.indexOf(last_action_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(last_action_chk[n]);
            all_chk_ids.push(last_action_chk[n].checklist_id.toString());
            // console.log(2426, all_chk_ids.length);
        }
    }
    for (let n = 0; n < create_chk.length; n++) {
        if (create_chk[n].convid != null && all_chk_ids.indexOf(create_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(create_chk[n]);
            all_chk_ids.push(create_chk[n].checklist_id.toString());
            // console.log(2433, all_chk_ids.length);
        }
    }
    // for(let n=0; n<al_assign_chk.length; n++){
    //   if(al_assign_chk[n].convid != null && all_chk_ids.indexOf(al_assign_chk[n].checklist_id.toString()) == -1){
    //     all_chk.push(al_assign_chk[n]);
    //     all_chk_ids.push(al_assign_chk[n].checklist_id.toString());
    //     // console.log(2440, all_chk_ids.length);
    //   }
    // }
    callback(all_chk);
}

function getMyAllUnreadMsgRep(user_id) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ edit_seen: { $contains: user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log('message.js 2315', err);
                resolve([]);
            } else {
                resolve(result);
            }
        })
    })
}

function checkDeleteOrnot(data, uid) {
    if (data.has_delete == null) {
        return false;
    } else {
        if (data.has_delete.indexOf(uid) || data.has_delete.indexOf('delete_for_all')) {
            return true;
        }
    }
}

var count_unread = async(data, uid, callback) => {
    console.log(2094, data.length);
    var allMsg_id = [];
    var alleditMsg = [];
    // console.log(2405)
    var assign_chk = await get_assign_chk(uid);
    var last_action_chk = await get_last_action_chk(uid);
    // console.log(2408, assign_chk.length);
    var create_chk = await get_create_chk(uid);
    // console.log(2410, create_chk.length);
    var al_assign_chk = await get_al_assign_chk(uid);
    // console.log(2412, al_assign_chk.length);
    var all_chk_ids = [];
    var all_chk = [];
    for (let n = 0; n < assign_chk.length; n++) {
        if (assign_chk[n].convid != null && all_chk_ids.indexOf(assign_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(assign_chk[n]);
            all_chk_ids.push(assign_chk[n].checklist_id.toString());
            // console.log(2419, all_chk_ids.length);
        }
    }
    for (let n = 0; n < last_action_chk.length; n++) {
        if (last_action_chk[n].convid != null && all_chk_ids.indexOf(last_action_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(last_action_chk[n]);
            all_chk_ids.push(last_action_chk[n].checklist_id.toString());
            // console.log(2426, all_chk_ids.length);
        }
    }
    for (let n = 0; n < create_chk.length; n++) {
        if (create_chk[n].convid != null && all_chk_ids.indexOf(create_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(create_chk[n]);
            all_chk_ids.push(create_chk[n].checklist_id.toString());
            // console.log(2433, all_chk_ids.length);
        }
    }
    for (let n = 0; n < al_assign_chk.length; n++) {
        if (al_assign_chk[n].convid != null && all_chk_ids.indexOf(al_assign_chk[n].checklist_id.toString()) == -1) {
            all_chk.push(al_assign_chk[n]);
            all_chk_ids.push(al_assign_chk[n].checklist_id.toString());
            // console.log(2440, all_chk_ids.length);
        }
    }
    // console.log(2443, all_chk_ids.length);
    // console.log(2423, all_chk_ids);

    var all_unread1 = await getMyAllUnreadMsg(uid);
    // console.log(2370)
    var all_unread2 = [];
    // var all_unread2 = await getMyAllUnreadMsgRep(uid);
    var all_unread = [];
    var msg_has_rep = [];
    var unread_replay = [];
    var edit_unseen = [];
    var ans = [];
    var allrepConversationids = [];


    for (let i = 0; i < all_unread1.length; i++) {
        if (!checkDeleteOrnot(all_unread1[i], uid)) {

            allMsg_id.push(all_unread1[i].msg_id);
        }
    }
    for (let l = 0; l < all_unread2.length; l++) {
        if (!checkDeleteOrnot(all_unread2[l], uid)) {
            if (allMsg_id.indexOf(all_unread2[l].msg_id) == -1) {
                all_unread1.push(all_unread2[l]);
            }
            alleditMsg.push(all_unread2[l].msg_id);
        }
    }
    console.log(2358, all_unread1.length)
    for (let i = 0; i < all_unread1.length; i++) {
        if (!checkDeleteOrnot(all_unread1[i], uid)) {
            if (data.indexOf(all_unread1[i].conversation_id.toString()) == -1) {
                unread_replay.push(all_unread1[i]);
                // allrepConversationids.push(all_unread1[i].conversation_id);
            } else if (alleditMsg.indexOf(all_unread1[i].msg_id) > -1) {
                edit_unseen.push(all_unread1[i]);
            } else {
                all_unread.push(all_unread1[i]);
            }
        }

    }
    for (var i = 0; i < data.length; i++) {
        allrepConversationids.push(models.uuidFromString(data[i]));
    }

    if (allrepConversationids.length > 0) {
        models.instance.ReplayConv.find({ conversation_id: { '$in': allrepConversationids } }, { raw: true, allow_filtering: true }, async function(error_rep, rep_con_data) {
            var repIds = [];
            var repUmsg = [];
            console.log(2377, error_rep)
            for (var i = 0; i < rep_con_data.length; i++) {
                repIds.push(rep_con_data[i].rep_id.toString())
            }

            for (var i = 0; i < unread_replay.length; i++) {
                if (repIds.indexOf(unread_replay[i].conversation_id.toString()) > -1) {
                    repUmsg.push(unread_replay[i]);
                }
            }

            callback({
                status: true,
                data: {
                    all_unread,
                    edit_unseen,
                    unread_replay: repUmsg,
                    rep_con_data,
                    all_chk,
                    all_msg_desc: []
                }
            }, false);
        });
    } else {
        callback({
            status: true,
            data: {
                all_unread,
                edit_unseen,
                unread_replay,
                rep_con_data: [],
                all_chk,
                all_msg_desc: []
            }
        }, false);
    }

    // for(var i=0; i<data.length; i++){
    //   var msgs = await get_msgs(data[i]);
    //   ans.push(msgs.convid)
    //   _.forEach(msgs.result, function(mv, mk){
    //     if (mv.sender != null){
    //       // if (mv.msg_status == null && mv.sender.toString() != uid) {
    //       //   all_unread.push(mv);
    //       // }
    //       if(mv.sender.toString() != uid){
    //         if(mv.msg_status == null){
    //           all_unread.push(mv);
    //         }
    //         else if(mv.msg_status.indexOf(uid) == -1){
    //           all_unread.push(mv);
    //         }
    //       }

    //       if (mv.has_reply > 0) {
    //         if (msg_has_rep.indexOf(mv.msg_id) == -1){
    //           if(mv.has_hide != null){
    //             if(mv.has_hide.indexOf(uid) == -1){
    //               msg_has_rep.push(mv.msg_id);
    //             }
    //           }
    //           else{
    //             msg_has_rep.push(mv.msg_id);
    //           }
    //         }
    //       }

    //       if (mv.sender.toString() != uid) {
    //         if (mv.edit_status != null) {
    //           if (mv.edit_seen != null) {
    //             if (mv.edit_seen.indexOf(uid) === -1) {
    //               edit_unseen.push(mv);
    //             }
    //           } else {
    //             edit_unseen.push(mv);
    //           }

    //         }
    //       }
    //     }
    //   });
    //   if(_.isEqual(_.sortBy(data), _.sortBy(ans))){
    //     if(msg_has_rep.length>0){
    //       console.log(2138, msg_has_rep.length)
    //       models.instance.ReplayConv.find({msg_id:{'$in':msg_has_rep}}, { raw: true, allow_filtering: true }, async function(error_rep, rep_con_data){
    //           if(error_rep) console.log("find replay id error ", error_rep);

    //           var ans_rep_con_id = [];
    //           for(var n=0; n<rep_con_data.length; n++){
    //               var repmsgs = await get_msgs(rep_con_data[n].rep_id.toString());
    //               ans_rep_con_id.push(repmsgs.convid);
    //               _.forEach(repmsgs.result, function(rmv, rmk){
    //                 if(rmv.sender.toString() != uid){
    //                   if(rmv.msg_status == null){
    //                     unread_replay.push(rmv);
    //                   }
    //                   else if(rmv.msg_status.indexOf(uid) == -1){
    //                     unread_replay.push(rmv);
    //                   }
    //                 }
    //               });

    //               // console.log(2153, ans_rep_con_id.lenght);
    //               if(ans_rep_con_id.length == rep_con_data.length){
    //                 // console.log(2155, "------------------", ans_rep_con_id.length);
    //                 callback({status: true,
    //                   data: {
    //                     all_unread,
    //                     edit_unseen,
    //                     unread_replay,
    //                     rep_con_data,
    //                     all_msg_desc:[]
    //                   }
    //                 }, false);
    //               }
    //           }
    //       });
    //     }else{
    //       callback({status: true,
    //         data: {
    //           all_unread,
    //           edit_unseen,
    //           unread_replay,
    //           rep_con_data: [],
    //           all_msg_desc:[]
    //         }
    //       }, false);
    //     }
    //   }
    // }
};

function get_msgs(convid) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ conversation_id: models.uuidFromString(convid), $orderby: { '$desc': 'msg_id' }, $limit: 100 }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                reject(err);
            } else {
                // console.log('rrrzzz',convid,result.length);
                resolve({ result, convid });
            }
        });
    });
}

var update_delivered_if_need = (data, callback) => {
    var update_deli_qry = [];
    var update_data = [];
    _.forEach(data, function(val, k) {
        if (val.has_delivered == 0) {
            var update_query = models.instance.Messages.update({ conversation_id: models.uuidFromString(val.conversation_id), msg_id: models.timeuuidFromString(val.msg_id) }, { has_delivered: 1 }, { return_query: true });
            update_deli_qry.push(update_query);
            update_data.push(val);
        }
    });
    if (update_deli_qry.length > 0) {
        models.doBatch(update_deli_qry, function(err) {
            if (err) { console.log(1925, 'msg_js', err); }

            callback({ status: true, msgs: update_data });
        });
    } else {
        callback({ status: false });
    }
};
var getPersonalConversation = (user_id, callback) => {
    var query = {
        participants: { $contains: user_id },
        group: { $eq: 'no' },
        single: { $eq: 'yes' }
    };

    models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(err, conversations) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, conversations: conversations });
        }
    });
};


var getAllSearchMsg = (data, target_text, targetFilter, userid, callback) => {
    var convid = new Set();
    _.forEach(data, function(val, k) {
        convid.add(models.uuidFromString(val));
    });
    var convid_array = Array.from(convid);
    var query = {
        conversation_id: { '$in': convid_array }
    };

    //Query for get msges

    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error, all_msg) {
        if (error) {
            callback({ status: false, error: error });
        } else {
            var convList = [];
            if (targetFilter === 'text') {
                //loop using for match text with msg body for search text in whole messages
                _.forEach(all_msg, function(val, k) {
                    var str = val.msg_body.toLowerCase();
                    var target_case = target_text.toLowerCase();
                    var res = str.match(target_case);
                    if (res != null) {
                        if (res.index > -1) {
                            if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                convList.push(val.conversation_id.toString());
                            }
                        }
                    }
                });
            } else if (targetFilter === 'flag') {
                //loop using for check flagged data
                var target_case = target_text.toLowerCase();
                _.forEach(all_msg, function(val, k) {
                    if (val.has_hide == null || val.has_hide.indexOf(userid) == -1) {

                        if (val.has_flagged !== null) {
                            if (target_text != 1) {
                                var str = val.msg_body.toLowerCase();
                                var target_case = target_text.toLowerCase();
                                var res = str.match(target_case);
                                if (res != null) {
                                    if (res.index > -1) {
                                        // console.log(val.has_flagged);
                                        if (val.has_flagged.indexOf(userid.toString()) !== -1) {
                                            if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                                convList.push(val.conversation_id.toString());
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (val.has_flagged.indexOf(userid.toString()) !== -1) {
                                    if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                        convList.push(val.conversation_id.toString());
                                    }
                                }
                            }

                        }
                    }

                });
            } else if (targetFilter === 'tag') {
                var target_case = target_text.toLowerCase();
                // console.log(data.tag_list)
                _.forEach(all_msg, function(val, k) {
                    if (val.tag_list !== null) {
                        _.each(val.tag_list, function(v, ka) {
                            if (data.tag_list.indexOf(v.toString()) > -1) {
                                if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                    convList.push(val.conversation_id.toString());
                                }
                            }
                        });
                    }

                });
            }

            callback({ status: true, data: convList });
        }
    });
};

var getAllDataForTag = (data, callback) => {
    var convid = new Set();
    // console.log(1750, data);
    _.forEach(data.conversation_list, function(val, k) {
        // console.log(1750, val);
        convid.add(models.uuidFromString(val));
    });
    var convid_array = Array.from(convid);
    var query = {
        conversation_id: { '$in': convid_array }
    };

    //Query for get msges
    // console.log(1758, query);
    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error, all_msg) {
        if (error) {
            callback({ status: false, error: error });
        } else {
            models.instance.Conversation.find({ conversation_id: { '$in': convid_array }, company_id: models.timeuuidFromString(data.company_id) }, function(err, result) {
                if (err) {
                    callback({ status: false, error: err });
                } else {
                    var convList = [];
                    if (data.target_filter === 'tag') {
                        _.forEach(all_msg, function(val, k) {
                            if (val.tag_list !== null) {
                                _.each(val.tag_list, function(v, ka) {
                                    if (data.tag_list.indexOf(v.toString()) > -1) {
                                        if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                            convList.push(val.conversation_id.toString());
                                        }
                                    }
                                });
                            }

                        });

                        _.forEach(result, function(val, k) {
                            if (val.tag_list !== null) {
                                _.each(val.tag_list, function(v, ka) {
                                    if (data.tag_list.indexOf(v.toString()) > -1) {
                                        if (convList.indexOf(val.conversation_id.toString()) === -1) {
                                            convList.push(val.conversation_id.toString());
                                        }
                                    }
                                });
                            }

                        });
                    }
                    callback({ status: true, data: convList });
                }
            })

        }
    });
};

var get_one_msg = (data, callback) => {
    var query = {
        conversation_id: models.uuidFromString(data.conversation_id),
        msg_id: models.timeuuidFromString(data.msg_id)
    }
    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error, msg) {
        if (error) {
            callback({ status: false, error: error });
        } else {
            callback({ status: true, msg: msg[0] });
        }
    });
};

var url_preview = (data, callback) => {
    (async() => {
        try {
            const { body: html, url } = await got(data.url);
            const metadata = await metascraper({ html, url });
            var new_img_name = new Date().getTime() + '.jpg';
            var new_img_url = data.base_url + '/upload/' + new_img_name;
            var new_logo_url = data.base_url + '/upload/l' + new_img_name;
            var is_preview_img_download = false;
            var is_preview_logo_download = false;
            if (metadata.title != null) {
                if (metadata.image != null)
                    is_preview_img_download = await download(metadata.image, './public/upload/' + new_img_name);

                if (metadata.logo != null)
                    is_preview_logo_download = await download(metadata.logo, './public/upload/l' + new_img_name);
                if (data.msg_id == "") {
                    metadata.msg_body = '<a href="' + metadata.url + '" target="_blank">' + metadata.title + '</a>';
                    callback({
                        status: true,
                        body: metadata,
                        conversation_id: data.conversation_id,
                        msg_id: data.msgid
                    });
                } else {
                    models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msgid) }, {
                        url_favicon: (is_preview_logo_download === true) ? new_logo_url : metadata.logo,
                        url_base_title: metadata.publisher,
                        url_title: metadata.title,
                        url_body: metadata.description,
                        url_image: (is_preview_img_download === true) ? new_img_url : null,
                        msg_type: ((data.msg_type == 'text') ? 'media_url' : 'url_' + data.msg_type)
                    }, update_if_exists, function(err) {
                        if (err) callback({ status: false, body: err });
                        metadata.logo = (is_preview_logo_download === true) ? new_logo_url : null;
                        metadata.image = (is_preview_img_download === true) ? new_img_url : null;
                        callback({ status: true, body: metadata, conversation_id: data.conversation_id, msg_id: data.msgid });
                    });
                }
            } else {
                callback({ status: false, msg: 'metascraper did not get any data' });
            }
        } catch (error) {
            callback({ status: false, body: error });
        }
    })();
};
var send_todo_msg_acceptance = (from, sender_img, sender_name, conversation_id, msg, attachment, msgtype, activity_id, callback) => {
    var createdat = new Date().getTime();
    var msgid = models.timeuuid();
    if (isRealString(msg)) {
        var uuidconversation_id = models.uuidFromString(conversation_id);
        var nullval = [];
        var uuidfrom = models.uuidFromString(from);
        var imgfile = (typeof attachment === 'undefined') ? nullval : attachment.imgfile;
        var audiofile = (typeof attachment === 'undefined') ? nullval : attachment.audiofile;
        var videofile = (typeof attachment === 'undefined') ? nullval : attachment.videofile;
        var otherfile = (typeof attachment === 'undefined') ? nullval : attachment.otherfile;

        var message = new models.instance.Messages({
            msg_id: msgid,
            msg_body: msg,
            attch_imgfile: imgfile,
            attch_audiofile: audiofile,
            attch_videofile: videofile,
            attch_otherfile: otherfile,
            sender: uuidfrom,
            sender_name: sender_name,
            sender_img: sender_img,
            has_delivered: 0,
            msg_type: msgtype,
            activity_id: activity_id,
            conversation_id: uuidconversation_id
        });

        message.saveAsync()
            .then(function(res) {
                callback({ status: true, msg: message });
            })
            .catch(function(err) {
                callback({ status: false, err: err });
            });
    } else {
        callback({ status: false, err: 'Message formate not supported.' });
    }
};

var get_conversation_info = (conversation_id, callback) => {
    models.instance.Conversation.find({ conversation_id: models.timeuuidFromString(conversation_id) }, function(err, conversationDetail) {

        callback(conversationDetail[0].participants);
    });


}

// var update_userbusy = (arr_participants, is_busy, callback) =>{
//   console.log('============> update_userbusy',arr_participants);
//   var messid = new Set();

//   if(typeof arr_participants=='object'){

//     _.forEach(arr_participants, function(val, k){
//         console.log(val);
//         messid.add(models.uuidFromString(val));
//     });
//   }else{
//     messid.add(models.uuidFromString(arr_participants));
//   }

//   var msgarray = Array.from(messid);

//   var query = {
//       id: {'$in': msgarray}
//   };


//   models.instance.Users.update(query, {
//       is_busy: is_busy
//   }, function(err){
//       if(err){
//           callback({status: false});
//           console.log('msg_js',err);
//       }
//       callback({status: true});
//   });

// }

var connect_msgUpdate = (data) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.update({
            conversation_id: models.uuidFromString(data.conv_id),
            msg_id: models.timeuuidFromString(data.msg_id)
        }, { edit_status: data.update_at }, update_if_exists, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ "msg": "success" });
            }
        });
    });
}
var connect_msgUpdatechecklist = (data) => {
    return new Promise((resolve, reject) => {
        var $ = cheerio.load(data.msg_body);
        var checklistTitle = $('.msgCheckListContainer').find($('.checkListPlainText')).text().trim();
        models.instance.Messages.update({
            conversation_id: models.uuidFromString(data.conv_id),
            msg_id: models.timeuuidFromString(data.msg_id)
        }, {
            msg_body: checklistTitle,
            edit_status: data.update_at,
            last_update_user: models.uuidFromString(data.sender),
            last_update_time: moment().format('YYYY-MM-DD hh:mm:ss').toString()
        }, update_if_exists, function(err) {
            if (err) {
                reject(err);
            } else {
                var allChecklist = $('.msgCheckListContainer').find($('.checkListItem'));
                var mqueries = [];
                _.each(allChecklist, function(v, k) {
                    var thistitle = $(v).find($('.checkBoxTitle')).text().trim()
                    if (thistitle.length > 0) {
                        if ($(v).attr('checklist-id') != undefined) {
                            var checklistData = {
                                checklist_id: models.timeuuidFromString($(v).attr('checklist-id')),
                                msg_id: models.timeuuidFromString(data.msg_id),
                                msg_title: checklistTitle,
                                checklist_title: thistitle
                            }
                            var update_query = models.instance.MessageChecklist.update({
                                msg_id: models.timeuuidFromString(data.msg_id.toString()),
                                checklist_id: models.timeuuidFromString(checklistData.checklist_id.toString())
                            }, {
                                msg_title: checklistData.msg_title,
                                checklist_title: checklistData.checklist_title
                            }, { if_exists: true, return_query: true });
                            mqueries.push(update_query);
                        } else {
                            var newcheck = new models.instance.MessageChecklist({
                                checklist_id: models.timeuuid(),
                                msg_id: models.timeuuidFromString(data.msg_id),
                                msg_title: checklistTitle,
                                checklist_title: $(v).find($('.checkBoxTitle')).text(),
                                created_by: models.uuidFromString(data.sender)

                            });
                            var msave_query = newcheck.save({ return_query: true });
                            mqueries.push(msave_query);
                        }
                    } else {
                        if ($(v).attr('checklist-id') != undefined) {
                            var deletelist = models.instance.MessageChecklist.delete({
                                checklist_id: models.timeuuidFromString($(v).attr('checklist-id')),
                                msg_id: models.timeuuidFromString(data.msg_id)
                            }, { return_query: true });
                            mqueries.push(deletelist);
                        }
                    }
                });
                models.doBatch(mqueries, function(err) {
                    if (err) { console.log(2317, 'msg_js', err); } else {

                        resolve({ msg: "success", msg_title: checklistTitle });
                    }
                });

            }
        });
    });
}

var read_msg_data = (msg_id, callback) => {
    models.instance.Messages.findOne({ msg_id: models.timeuuidFromString(msg_id.toString()) }, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) callback(false);
        callback(message);
    });
};

var url_attachment_data_update = (data) => {
    models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, {
        url_favicon: data.logo,
        url_base_title: data.publisher,
        url_title: data.title,
        url_body: data.description,
        url_image: data.url_image
    }, update_if_exists, function(err) {
        if (err) console.log({ status: false, body: err });
        console.log({ status: true });
    });
};

function checkClearFun(msg, data) {
    if (data.check_msg.length > 0) {
        var msg_type = msg.msg_type;
        var has_flagged = [];
        if (msg.has_flagged != null) {
            has_flagged = msg.has_flagged;
        }
        if (msg_type == '' || msg_type == undefined) {
            msg_type = 'text';
        }
        if (msg_type.match(/media/g))
            msg_type = 'media';

        var return_ans = false;

        // console.log(3351, has_flagged, msg.msg_body)
        if (has_flagged.indexOf(data.user_id.toString()) > -1) {
            if (data.check_msg.indexOf('flagged') > -1)
                return true;
            else
                return false;
        } else {
            switch (msg_type) {
                case "text":
                    return_ans = data.check_msg.indexOf("text") > -1;
                    break;
                case "media":
                    return_ans = data.check_msg.indexOf("media") > -1;
                    break;
                case "checklist":
                    return_ans = data.check_msg.indexOf("checklist") > -1;
                    break;
                default:
                    return_ans = true;
            }
            return return_ans;
        }


        // if (data.check_msg.indexOf('flagged') > -1 && data.check_msg.indexOf('media') > -1) {
        //     if (has_flagged.indexOf(data.user_id.toString()) !== -1 && msg_type.match(/media/g) !== null) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // } else if (data.check_msg.indexOf('flagged') > -1) {
        //     if (has_flagged.indexOf(data.user_id.toString()) !== -1) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // } else {
        //     if (msg_type.match(/media/g) !== null) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
    } else {
        return false;
    }
}
var clear_conv_history = (data, callback) => {
    var convid = models.uuidFromString(data.conversation_id);
    var uid = data.user_id;
    var afterCkmsgids = [];
    models.instance.Messages.find({ conversation_id: convid }, { raw: true, allow_filtering: true }, function(error, conv_msg) {
        if (error) callback({ error });
        else {
            var has_delete_update_q = new Set();
            var has_hide_update_q = new Set();
            _.forEach(conv_msg, function(v, k) {
                v.has_hide = v.has_hide == null ? [] : v.has_hide;
                v.has_delete = v.has_delete == null ? [] : v.has_delete;
                if (v.has_hide.indexOf(uid) == -1 && v.has_delete.indexOf(uid) == -1) {
                    if (checkClearFun(v, data)) {
                        afterCkmsgids.push(v.msg_id.toString());
                        if (data.allmyUnreadThread.indexOf(v.msg_id.toString()) == -1) {
                            // if (v.msg_type != 'checklist') {
                            if (v.sender == uid) {
                                has_delete_update_q.add(v.msg_id);
                            } else {
                                has_hide_update_q.add(v.msg_id);
                            }
                            // }
                        }
                    }
                }
            });
            var delete_array = Array.from(has_delete_update_q);
            var hide_array = Array.from(has_hide_update_q);
            models.instance.File.find({ conversation_id: convid, is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
                if (ferr) console.log({ status: false, err: ferr });
                if (files) {
                    var queries = [];
                    _.forEach(files, function(v, k) {
                        if (afterCkmsgids.indexOf(v.msg_id.toString()) > -1) {
                            if (v.user_id.toString() == uid) {
                                var update_query = models.instance.File.update({ id: v.id }, { is_delete: 1 }, { return_query: true });
                                queries.push(update_query);
                                var bucket_name = v.bucket.split('/')[0];
                                var objectsList = v.location.split('/');
                                objectsList.splice(0, 1);
                                objectsList = objectsList.join('/');
                                minioClient.removeObjects(bucket_name, [objectsList], function(e) {
                                    if (e) res.json({ status: false, error: 'Unable to remove Objects ', e });
                                    console.log("Removed the objects successfully.");
                                });
                            }
                        }
                    });
                    models.doBatch(queries, function(err) {
                        if (err) {
                            console.log({ status: false, error: err });
                        } else {
                            console.log({ status: true, msg: "File delete successfully." });
                        }
                    });
                } else {
                    console.log({ status: true, msg: "File delete successfully." });
                }
            });

            if (delete_array.length > 0) {
                models.instance.Messages.update({ conversation_id: convid, msg_id: { '$in': delete_array } }, { has_delete: { '$add': [uid] }, has_hide: { '$add': [uid] } }, function(err1) {
                    if (err1) callback({ status: false, err1 });

                    if (hide_array.length > 0) {
                        models.instance.Messages.update({ conversation_id: { $eq: convid }, msg_id: { '$in': hide_array } }, { has_hide: { '$add': [uid] } }, function(err2) {
                            if (err2) callback({ status: false, err2 });
                            callback({ status: true, 'line': 1496, data, conv_msg });
                        });
                    } else {
                        callback({ status: true, 'line': 1500, data, conv_msg });
                    }
                });
            } else {
                if (hide_array.length > 0) {
                    models.instance.Messages.update({ conversation_id: { $eq: convid }, msg_id: { '$in': hide_array } }, { has_hide: { '$add': [uid] } }, function(err3) {
                        if (err3) callback({ status: false, err3 });
                        callback({ status: true, 'line': 1507, data, conv_msg });
                    });
                } else {
                    callback({ status: true, 'line': 1510, data, conv_msg });
                }
            }
        }
    });
};


var update_msg_tag = (data, callback) => {
    models.instance.MessagesTag.update({
            id: models.timeuuidFromString(data.id)
        }, {
            tag_title: data.tag_title
        }, update_if_exists,
        function(err) {
            if (err) {
                console.log(err);
            } else {
                callback(data);
            }
        });
}

var get_tagmsg_id = (data, callback) => {
    models.instance.MessagesTag.findOne({
            conversation_id: models.uuidFromString(data.conversation_id),
            message_id: models.uuidFromString(data.message_id),
            tagged_by: models.uuidFromString(data.user_id)
        }, {
            raw: true,
            allow_filtering: true
        },
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);
                callback(result);
            }
        });
}
var create_sp_tag = (data, callback) => {
    var new_id = models.timeuuid();
    var newMsgTag = new models.instance.MessagesTag({
        id: new_id,
        conversation_id: models.uuidFromString(data.conversation_id),
        message_id: models.uuidFromString(data.message_id),
        tag_title: data.tag_title,
        tagged_by: models.uuidFromString(data.tagged_by)
    });
    newMsgTag.saveAsync()
        .then(function(res) {
            models.instance.MessagesTag.findOne({
                id: new_id
            }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(result);
                    callback(result);
                }
            });
        })
        .catch(function(err) {
            callback({
                status: false,
                err: err
            });
        });
}

var mediaAllMsg = (data, callback) => {
    // var query = "SELECT * FROM messages WHERE conversation_id="+models.uuidFromString(data.conversation_id)+" AND msg_type like 'media%' ALLOW FILTERING;";
    // models.instance.Messages.execute_query(query, {}, function(error, msg){
    //   if(error) {
    callback({ status: false, error: "this query changed" });
    //   }else{
    //     callback({status: true, allMediaMsg:msg.rows});
    //   }
    // });
}

var searchMsgBody = (data, callback) => {
    var checkFilter = '';
    switch (data.filter_type) {
        case 'linkss':
            checkFilter = "media_link";
            break;
        case 'tagss':
            checkFilter = "all";
            break;
        case 'filess':
            checkFilter = "media_otherfile";
            break;
        default:
            checkFilter = "all";
    }

    var query = "SELECT * FROM messages WHERE conversation_id=" + models.uuidFromString(data.conversation_id) + "  AND msg_text like '%" + data.value + "%'  ALLOW FILTERING ;";

    if (data.filter_type == 'linkss') {
        query = "SELECT * FROM messages WHERE conversation_id=" + models.uuidFromString(data.conversation_id) + " AND msg_type='media_link' AND msg_text like '%" + data.value + "%'  ALLOW FILTERING ;";
    }
    if (data.filter_type == 'filess') {
        query = "SELECT * FROM messages WHERE conversation_id=" + models.uuidFromString(data.conversation_id) + " AND msg_type='media_otherfile' AND msg_text like '%" + data.value + "%'  ALLOW FILTERING ;";
    }


    if (data.tag_data.length > 0) {
        // console.log(data.tag_data[0])
        query = "SELECT * FROM messages WHERE conversation_id=" + models.uuidFromString(data.conversation_id) + " AND tag_list CONTAINS \'" + data.tag_data[0] + "\' ALLOW FILTERING ;";
    }

    models.instance.Messages.execute_query(query, {}, function(error, msg) {
        if (error) {
            callback({ msg: false, error: error });
        } else {
            var allclmsg = []
            _.each(msg.rows, function(v, k) {
                if (v.msg_type == 'checklist') {
                    allclmsg.push(models.timeuuidFromString(v.msg_id.toString()));
                }
            });
            if (allclmsg.length > 0) {
                models.instance.MessageChecklist.find({ msg_id: { $in: allclmsg } }, { raw: true, allow_filtering: true }, function(err, result) {
                    if (err) {
                        console.log(err)
                        callback({ msg: false, error: err });
                    } else {
                        // console.log(result)
                        callback({ msg: 'success', data: msg.rows, checklist: result });
                    }
                });
            } else {
                callback({ msg: 'success', data: msg.rows, checklist: [] });
            }
        }
    });
}
var getChecklistMsg = (data, callback) => {
    // console.log('uuid_checker('+data.conversation_id+') =====>',uuid_checker(data.conversation_id));
    if (uuid_checker(data.conversation_id)) {
        var query = "SELECT * FROM messages WHERE conversation_id=" + models.uuidFromString(data.conversation_id) + " AND msg_type = 'checklist' ALLOW FILTERING ;";
        models.instance.Messages.execute_query(query, {}, function(error, msg) {
            if (error) {
                callback({ msg: false, error: error });
            } else {
                var checklistMsgId = [];

                _.each(msg.rows, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {

                            callback({ status: true, data: _.reverse(msg.rows), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, data: _.reverse(msg.rows) });
                }
            }
        });
    } else {
        callback({ status: false });
    }
}

var my_all_task_assignment = (data, callback) => {
    try {
        var result = [];
        var checklistMsgId = [];
        // for(var i=0; i < data.convlist.length; i++){
        // var query = {conversation_id:  models.uuidFromString(data.convlist[i]), msg_type: 'checklist'};
        models.instance.Messages.find({ msg_type: 'checklist' }, function(err, messages) {
            if (err) callback({ status: false, err });
            console.log(3520, messages.length);
            if (messages.length > 0) {
                _.each(messages, function(v, k) {
                    if (data.convlist.indexOf(v.conversation_id.toString()) > -1) {
                        result.push(v);
                        checklistMsgId.push(v.msg_id);
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    console.log(3534);
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, item) {
                        console.log(3536, item.length);
                        if (cerror) {
                            console.log(3538);
                            callback({ status: false, error: cerror });
                        } else {
                            console.log(3541);
                            callback({ status: true, result, checklist: item });
                        }
                    });
                } else {
                    console.log(3546);
                    callback({ status: true, result });
                }
            }
        });




        // var result = [];
        // var checklistMsgId = [];
        // for(var i=0; i < data.convlist.length; i++){
        //   var query = {conversation_id:  models.uuidFromString(data.convlist[i]), msg_type: 'checklist'};
        //   models.instance.Messages.find(query, {raw: true, allow_filtering: true}, function(err, message){
        //     if(err) callback({status: false, err});
        //     // console.log(3280, message);
        //     if(message.length > 0){
        //       result.push(message);

        //       _.each(message,function(v,k){
        //           checklistMsgId.push(v.msg_id);
        //       });
        //     }
        //   });

        //   if(i+1 == data.convlist.length){
        //     setTimeout(function(){
        //       if(checklistMsgId.length > 0){
        //         var query = {
        //             msg_id: {'$in': checklistMsgId}
        //         };
        //         models.instance.MessageChecklist.find(query,{raw:true, allow_filtering: true},function(cerror,item){
        //           if(cerror){
        //             callback({status: false, error: cerror});
        //           }else{
        //             callback({status: true,result,checklist:item});
        //           }
        //         });
        //       }else{
        //         callback({status: true, result});
        //       }
        //     }, 3000);
        //   }
        // }
    } catch (e) {
        console.log(3591);
        callback({ status: false, e });
    }
}

var updateMsgTimer = (data, callback) => {
    if (data.type == 'add') {
        models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conv_id), msg_id: models.timeuuidFromString(data.msg_id) }, { has_timer: data.unixTime }, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ msg: 'success' });
            }
        });
    } else {
        models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conv_id), msg_id: models.timeuuidFromString(data.msg_id) }, { has_timer: null }, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ msg: 'success' });
            }
        });
    }
}

var edit_msg_attch_list = (data, callback) => {
    // console.log(1722, data);
    var query = { conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) };
    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(err, message) {
        if (err) callback({ status: false, msg: 'No data found and ' + err });
        // console.log("image attch length before ", message[0].attch_imgfile.length);
        message[0].attch_imgfile = _.remove(message[0].attch_imgfile, function(n) {
            return n != data.src;
        });
        // console.log(message[0].attch_imgfile);
        message[0].attch_imgfile = (message[0].attch_imgfile.length == 0) ? null : message[0].attch_imgfile;
        models.instance.Messages.update(query, { attch_imgfile: message[0].attch_imgfile }, update_if_exists, function(msgerr, result) {
            if (msgerr) callback({ status: false, msg: 'Message update error ' + msgerr });
            callback({ status: true, message: message[0] });
        });
    });
};


var msg_delete_full = (data, callback) => {
    var query_object = {
        conversation_id: models.uuidFromString(data.conv_id),
        msg_id: models.timeuuidFromString(data.msg_id)
    };

    models.instance.Messages.delete(query_object, function(err) {
        if (err) {
            callback({ status: false });
        } else {
            callback({ status: true });
        }
    });
}

var findMsgBymsg_id = (data, callback) => {

    var messid = new Set();
    _.forEach(data.msgSet, function(val, k) {
        messid.add(models.timeuuidFromString(val.toString()));
    });
    var msgarray = Array.from(messid);
    var query = {
        conversation_id: { $eq: models.uuidFromString(data.conversation_id) },
        msg_id: { '$in': msgarray }
    };
    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(err, result) {
        if (err) {
            console.log(1850, err);
        } else {
            callback({ status: true, data: result });
        }
    })
}

var getsinglemsgchecklist = (msgid) => {
    return new Promise((resolve, reject) => {
        // console.log(1989,msgid)
        models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(msgid.toString()) }, function(err, result) {
            if (err) {
                reject({ error });
            } else {
                resolve({ data: result })
            }
        })
    });
}

var updateCheckStatus = (data) => {
    // console.log(2035,data);
    return new Promise((resolve, reject) => {
        // console.log(data);
        var updateQ = {
                last_update_time: moment().format('YYYY-MM-DD hh:mm:ss').toString(),
                last_update_user: models.uuidFromString(data.user_id)
            }
            // console.log(2041,updateQ)
            // models.instance.Messages.update({msg_id:models.timeuuidFromString(data.msg_id),conversation_id:models.uuidFromString(data.conversation_id)},updateQ,function(err){
            //   if(err){
            //     console.log(err);
            //   }else{
            //     console.log('message updated successfully.')
            //   }
            // })

        models.instance.Messages.find({ msg_id: models.timeuuidFromString(data.msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, function(err, dataresult) {
            if (err) {
                console.log(err);
            } else {
                var newLogMsg = dataresult[0]
                newLogMsg['edit_log_id'] = models.timeuuid();
                newLogMsg['log_created_by'] = updateQ.last_update_user;
                var newLogMsgQ = new models.instance.MessageEditLog(newLogMsg);
                newLogMsgQ.saveAsync()
                    .then(function(res) {
                        console.log('successfully saved');
                        models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, function(er, res) {
                                if (er) {
                                    console.log(er);
                                } else {
                                    var newChecklsitQ = [];
                                    var newChecklsitAll = [];
                                    var newMsgId = models.timeuuid();
                                    res.reverse();
                                    _.each(res, function(v, k) {
                                        var newCheckId = models.timeuuid();
                                        var oldData = v;
                                        if (v.checklist_id == data.checklist_id) {
                                            oldData['checklist_status'] = data.checklist_status;
                                            oldData['last_updated_by'] = data.user_id;
                                            oldData['last_updated_at'] = moment().format('YYYY-MM-DD hh:mm:ss').toString();
                                        }

                                        oldData['msg_id'] = newMsgId;
                                        oldData['checklist_id'] = newCheckId;
                                        var q2 = new models.instance.MessageChecklist(oldData);
                                        var save_query2 = q2.save({ return_query: true });
                                        newChecklsitQ.push(save_query2);
                                        newChecklsitAll.push(oldData);
                                    });

                                    models.doBatch(newChecklsitQ, function(err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var newMsgData = dataresult[0];
                                            newMsgData['msg_id'] = newMsgId;
                                            if (newMsgData['old_created_time'] == null) {
                                                newMsgData['old_created_time'] = newMsgData.created_at;
                                            }
                                            if (newMsgData['updatedmsgid'] == null) {
                                                // newMsgData['updatedmsgid'] = models.uuidFromString(data.msg_id);
                                            } else {
                                                newMsgData['updatedmsgid'] = null;
                                            }
                                            newMsgData['last_update_time'] = moment().format('YYYY-MM-DD hh:mm:ss').toString()
                                            newMsgData['last_update_user'] = models.uuidFromString(data.user_id);

                                            models.instance.Messages.delete({ msg_id: models.timeuuidFromString(data.msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, function(err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                            new models.instance.Messages(newMsgData).saveAsync()
                                                .then((success) => {
                                                    console.log(2121, 'success');
                                                    resolve({ status: true, data: newMsgData, newChecklist: newChecklsitAll })
                                                }).catch((er) => {
                                                    console.log(er);
                                                });
                                        }
                                    })
                                }
                            })
                            // models.instance.MessageChecklist.update(
                            //   {
                            //     msg_id:models.timeuuidFromString(data.msg_id),
                            //     checklist_id:models.timeuuidFromString(data.checklist_id)
                            //   },
                            //   {
                            //     checklist_status:data.checklist_status,
                            //     last_updated_by:data.user_id,
                            //     last_updated_at:moment().format('YYYY-MM-DD hh:mm:ss').toString()
                            //   },function(error){
                            //     if(error){
                            //       console.log(error)
                            //     }else{
                            //       resolve({status:true})
                            //     }
                            //   });

                    })
                    .catch(function(err) {
                        console.log(err)
                    });
                console.log('message updated successfully.')
            }
        })

        // models.instance.MessageChecklist.update(
        //   {
        //     msg_id:models.timeuuidFromString(data.msg_id),
        //     checklist_id:models.timeuuidFromString(data.checklist_id)
        //   },
        //   {
        //     checklist_status:data.checklist_status,
        //     last_updated_by:data.user_id,
        //     last_updated_at:moment().format('YYYY-MM-DD hh:mm:ss').toString()
        //   },function(error){
        //     if(error){
        //       console.log(error)
        //     }else{
        //       resolve({status:true})
        //     }
        //   });
    })
}

var createtagNcreateIssueTag = (data) => {
    return new Promise((resolve, reject) => {
        var tag_id = models.timeuuid();
        var tagdata = {
            tag_id: tag_id,
            tagged_by: models.uuidFromString(data.tagged_by),
            title: data.tag_title,
            type: 'CONNECT',
            tag_type: 'issuemsg',
            visibility: 'visible',
            mention_users: data.mention_users,
            company_id: models.timeuuidFromString(userCompany_id[data.tagged_by]),
            created_at: moment().format('YYYY-MM-DD hh:mm:ss').toString()
        }
        var findtag = {
                tagged_by: models.uuidFromString(data.tagged_by),
                title: data.tag_title
            }
            // console.log(2088,findtag)
        models.instance.UserTag.find(findtag, { raw: true, allow_filtering: true }, function(terr, tresult) {
            if (terr) {
                console.log(2090, terr);
            } else {
                var matchdata = [];
                _.each(tresult, function(v, k) {
                    var matcthornot = _.difference(v.mention_users, data.mention_users);
                    if (matcthornot.length == 0) {
                        matchdata.push(v);
                    }
                });
                if (matchdata.length > 0) {
                    var query = {
                            conversation_id: models.uuidFromString(data.conversation_id),
                            msg_id: models.timeuuidFromString(data.msg_id)
                        }
                        // console.log(2105,models.timeuuidFromString(matchdata[0].tag_id.toString()))
                    models.instance.Messages.update(query, { tag_list: { $add: [matchdata[0].tag_id.toString()] } }, update_if_exists, function(err) {
                        if (err) {
                            reject({ status: false, err: err });
                        } else {
                            resolve({ status: true, data: matchdata[0] });
                        }
                    })
                } else {
                    new models.instance.UserTag(tagdata).saveAsync().then(function(res) {
                            var query = {
                                conversation_id: models.uuidFromString(data.conversation_id),
                                msg_id: models.timeuuidFromString(data.msg_id)
                            }
                            var updatedata = {
                                tag_list: { $add: [tag_id.toString()] }
                            }
                            models.instance.Messages.update(query, updatedata, update_if_exists, function(err) {
                                if (err) {
                                    reject({ status: false, err: err });
                                } else {
                                    resolve({ status: true, data: tagdata })
                                }
                            })
                        })
                        .catch(function(err) {
                            reject({ status: false, err: err });
                        });
                }
            }
        })
    })
}

var getconvissuetag = (data) => {
    return new Promise((resolve, reject) => {
        var allmsgtag = [];
        _.each(data.allmsgTagid, function(v, k) {
            allmsgtag.push(models.timeuuidFromString(v.toString()))
        });
        models.instance.UserTag.find({ tag_id: { $in: allmsgtag } }, { raw: true, allow_filtering: true }, function(error, result) {
            if (error) {
                reject({ status: false, error: error });
            } else {
                resolve({ status: true, data: result });
            }
        })
    })
}

var getmsgissuetag = (data) => {
    return new Promise((resolve, reject) => {
        models.instance.MessageIssueTag.find({ message_id: models.timeuuidFromString(data.message_id) }, { raw: true, allow_filtering: true }, function(error, result) {
            if (error) {
                reject({ status: false, error: error });
            } else {
                resolve({ status: true, data: result });
            }
        })
    })
}
var msgtagAddorRemove = (data) => {
    return new Promise((resolve, reject) => {
        var query = {
            conversation_id: models.uuidFromString(data.conversation_id.toString()),
            msg_id: models.timeuuidFromString(data.msg_id.toString())
        }
        if (data.type == 'remove') {
            models.instance.Messages.update(query, { tag_list: { $remove: data.tag_id } }, update_if_exists, function(err) {
                if (err) {
                    reject({ status: false, error: err });
                } else {
                    resolve({ status: true });
                }
            });
        } else if (data.type == 'add') {
            models.instance.Messages.update(query, { tag_list: { $add: data.tag_id } }, update_if_exists, function(err) {
                if (err) {
                    reject({ status: false, error: err });
                } else {
                    resolve({ status: true });
                }
            });
        }
    })
}
var acceptOrRejectIssue = (data) => {
    return new Promise((resolve, reject) => {
        var query = {
            conversation_id: models.uuidFromString(data.conversation_id.toString()),
            msg_id: models.timeuuidFromString(data.msg_id.toString())
        }
        if (data.type == 'add') {
            models.instance.Messages.update(query, { issue_accept_user: { $add: data.user_id } }, update_if_exists, function(err) {
                if (err) {
                    reject({ status: false, error: err });
                } else {
                    resolve({ status: true });
                }
            });
        }
    })
}


async function forwardMessage(data, callback) {
    var allmsgId = [];
    var allreplyconv = [];
    var allreplymsg = [];
    var allMsgData = [];
    var allmsgfiles = [];
    var allfiles = [];
    var repfilemsgids = [];
    var repmsgfiles = [];
    _.each(data.msg_id, function(v, k) {
        allmsgId.push(models.timeuuidFromString(v));
    });
    var allLinkData = [];
    var getAllmsgData = await getALlMessages(data.conversation_id, allmsgId);
    // console.log('getAllmsgData ',getAllmsgData);
    if (data.type == 'convert') {
        if (getAllmsgData.status) {
            var allConvertQuery = [];
            var cbData = [];
            _.each(data.share_conv, function(vc, kc) {
                var genMId = models.timeuuid();
                var totalData = {
                    msg_id: genMId,
                    msg_body: 'Converted Checklist',
                    attch_imgfile: [],
                    attch_audiofile: [],
                    attch_videofile: [],
                    attch_otherfile: [],
                    sender: models.uuidFromString(data.user_id),
                    sender_name: data.user_fullname,
                    sender_img: data.user_image,
                    has_delivered: 0,
                    conversation_id: models.uuidFromString(vc),
                    has_reply: 0,
                    has_timer: null,
                    msg_type: 'checklist',
                    tag_list: [],
                    old_created_time: null,
                    last_update_user: null,
                    msg_text: getAllmsgData.data[0].msg_body,
                    updatedmsgid: null,
                    service_provider: null,
                    mention_user: null,
                    has_hide: [],
                    has_flagged: [],
                    created_by: models.uuidFromString(data.user_id),
                    created_at: data.created_at_local
                }
                var message = new models.instance.Messages(totalData);
                var repconvQu = message.save({ return_query: true });
                allConvertQuery.push(repconvQu);

                var ndata = {
                    checklist_id: models.timeuuid(),
                    msg_id: genMId,
                    msg_title: 'Converted Checklist',
                    created_by: models.uuidFromString(data.user_id),
                    checklist_title: data.msg_body,
                    created_at: data.created_at_local,
                    checklist_status: 0,
                    review_status: 0,
                    end_due_date: null,
                    // last_action:null,
                    last_edited_at: null,
                    last_edited_by: null,
                    last_updated_at: null,
                    last_updated_by: null,
                    privacy: null,
                    start_due_date: null,
                }
                totalData['checklist'] = [ndata]
                cbData.push(totalData);
                var messageChecklist = new models.instance.MessageChecklist(ndata);
                var repconvQucl = messageChecklist.save({ return_query: true });
                allConvertQuery.push(repconvQucl);

                batchQueryDone(allConvertQuery).then((result) => {
                    console.log('forwardmsg sent============');
                    // console.log(3222, returndata);
                    // _.each(returnData,function(v,k){
                    //   // socket.emit('remove_pending_status',  { msg_id: v.msg_id});
                    // })
                    callback({ status: true, data: cbData })
                }).catch(err => {
                    console.log(244, err)
                });

            });
        }
    } else {
        var getAllMsgLinkData = await getALlMessagesLinkData(data.conversation_id);
        var allconvdata = await getALlConvParticipants(data.share_conv);

        if (getAllMsgLinkData.status) {
            if (getAllMsgLinkData.data.length > 0) {
                _.each(getAllMsgLinkData.data, function(v, k) {
                    if (data.msg_id.indexOf(v.msg_id) > -1) {
                        allLinkData.push(v);
                    }
                });
            }
        }
        // console.log('getAllMsgLinkData ',getAllMsgLinkData);
        // console.log(3028, getAllmsgData);
        allmsgfiles = await getAllFiles(data.conversation_id);

        // console.log('allmsgfiles ', allmsgfiles)
        if (getAllmsgData.status) {
            var allhasReplaymsgid = []
            _.each(getAllmsgData.data, function(v, k) {
                if (v.has_reply > 0) {
                    allhasReplaymsgid.push(models.timeuuidFromString(v.msg_id.toString()));
                }
                allMsgData.push(v);
            });
            if (allhasReplaymsgid.length > 0) {
                var getreplyConvData = await getreplyConv(data.conversation_id, allhasReplaymsgid);
                if (getreplyConvData.status) {
                    if (getreplyConvData.data.length > 0) {
                        var allrepConv = [];
                        _.each(getreplyConvData.data, function(v, k) {
                            allrepConv.push(models.uuidFromString(v.rep_id.toString()));
                        });
                        allreplyconv = getreplyConvData.data;
                        var getallRepMsg = await getallRepMsgAwait(allrepConv);
                        if (getallRepMsg.status) {

                            allreplymsg = getallRepMsg.data;
                        }

                    }
                }
            }

            var allForwardMsgQ = [];
            var allreqlyConvQ = [];
            var checklistmsgid = [];
            var returndata = [];


            _.each(allMsgData, function(v, k) {

                if (v.msg_type == 'checklist') {
                    checklistmsgid.push(models.timeuuidFromString(v.msg_id.toString()));
                } else {
                    _.each(data.share_conv, function(vc, kc) {
                        var hasrepattach = false;
                        var participants = [];
                        _.each(allconvdata.data, function(alv, alk) {
                            if (alv.conversation_id.toString() == vc) {
                                alv.participants.splice(alv.participants.indexOf(data.user_id), 1);
                                participants = alv.participants;
                            }
                        });
                        var msg_id = models.timeuuid();
                        if (v.has_reply > 0) {
                            var newRepdataConv = {
                                msg_id: msg_id,
                                conversation_id: models.uuidFromString(vc),
                                rep_id: models.uuid()
                            }
                            var newMsgData = new models.instance.ReplayConv(newRepdataConv);
                            var repconvQu = newMsgData.save({ return_query: true });
                            allForwardMsgQ.push(repconvQu);

                            _.each(allreplyconv, function(rv, rk) {
                                if (rv.msg_id.toString() == v.msg_id.toString()) {
                                    _.each(allreplymsg, function(rpv, rpk) {
                                        if (rpv.conversation_id.toString() == rv.rep_id.toString()) {
                                            var newrepdata = returnMsgfield(rpv);
                                            newrepdata['msg_id'] = models.timeuuid();
                                            newrepdata['conversation_id'] = newRepdataConv.rep_id;
                                            newrepdata['tag_list'] = [];
                                            var newrepmsg = new models.instance.Messages(newrepdata);
                                            var msaveQr = newrepmsg.save({ return_query: true });
                                            allForwardMsgQ.push(msaveQr);

                                            if (rpv.attch_imgfile !== null || rpv.attch_audiofile !== null || rpv.attch_videofile !== null || rpv.attch_otherfile !== null) {
                                                hasrepattach = true;
                                                repmsgfiles[rpv.msg_id.toString()] = newrepdata['msg_id'].toString();
                                                repfilemsgids.push(rpv.msg_id.toString());
                                                console.log(3454)
                                            }
                                        }
                                    })
                                }
                            });
                        }
                        // console.log(4164, participants);
                        var needtofindattach = false;
                        var attch_otherfile_size = [];
                        if (v.attch_imgfile !== null || v.attch_audiofile !== null || v.attch_videofile !== null || v.attch_otherfile !== null)
                            needtofindattach = true;

                        var msgdata = returnMsgfield(v);
                        if (needtofindattach) {
                            for (var i = 0; i < allmsgfiles.length; i++) {
                                // console.log(3024,allmsgfiles[i])
                                if (allmsgfiles[i].msg_id != null) {
                                    if (allmsgfiles[i].msg_id.toString() == v.msg_id.toString()) {
                                        console.log(3474)
                                        var file_data = new models.instance.File({
                                            id: models.timeuuid(),
                                            user_id: models.uuidFromString(data.user_id),
                                            msg_id: msg_id,
                                            conversation_id: models.uuidFromString(vc),
                                            acl: allmsgfiles[i].acl,
                                            bucket: allmsgfiles[i].bucket,
                                            file_type: allmsgfiles[i].mimetype,
                                            key: allmsgfiles[i].key,
                                            location: allmsgfiles[i].bucket + '/' + allmsgfiles[i].key,
                                            originalname: allmsgfiles[i].originalname,
                                            file_size: allmsgfiles[i].size.toString()
                                        });
                                        var save_query = file_data.save({ return_query: true });
                                        allForwardMsgQ.push(save_query);
                                        if (allmsgfiles[i].mimetype.indexOf('image') == -1 && allmsgfiles[i].mimetype.indexOf('video') == -1 && allmsgfiles[i].mimetype.indexOf('audio') == -1) {
                                            attch_otherfile_size.push(allmsgfiles[i].size.toString());
                                        }
                                    }
                                }
                            }
                        }
                        if (hasrepattach) {
                            for (var i = 0; i < allmsgfiles.length; i++) {
                                if (allmsgfiles[i].msg_id != null) {
                                    if (repfilemsgids.length > 0) {
                                        if (repfilemsgids.indexOf(allmsgfiles[i].msg_id.toString()) > -1) {
                                            var file_data = new models.instance.File({
                                                id: models.timeuuid(),
                                                user_id: models.uuidFromString(data.user_id),
                                                msg_id: models.timeuuidFromString(repmsgfiles[allmsgfiles[i].msg_id.toString()]),
                                                conversation_id: models.uuidFromString(vc),
                                                acl: allmsgfiles[i].acl,
                                                bucket: allmsgfiles[i].bucket,
                                                file_type: allmsgfiles[i].mimetype,
                                                key: allmsgfiles[i].key,
                                                location: allmsgfiles[i].bucket + '/' + allmsgfiles[i].key,
                                                originalname: allmsgfiles[i].originalname,
                                                file_size: allmsgfiles[i].size.toString()
                                            });
                                            var save_query = file_data.save({ return_query: true });
                                            allForwardMsgQ.push(save_query);
                                        }
                                    }
                                }
                            }
                        }
                        _.each(allLinkData, function(vl, kl) {
                            if (vl.msg_id.toString() == v.msg_id.toString()) {
                                var newLinkData = vl;
                                newLinkData['url_id'] = models.timeuuid();
                                newLinkData['msg_id'] = msg_id.toString();
                                newLinkData['user_id'] = models.uuidFromString(data.user_id);
                                newLinkData['created_at'] = data.created_at_local;
                                newLinkData['conversation_id'] = models.uuidFromString(vc);
                                var newMsgLink = new models.instance.Link(newLinkData);
                                var msave_queryLink = newMsgLink.save({ return_query: true });
                                allForwardMsgQ.push(msave_queryLink);
                            }
                        });

                        msgdata['msg_id'] = msg_id;
                        msgdata['conversation_id'] = models.uuidFromString(vc);
                        msgdata['msg_status'] = participants;
                        msgdata['sender'] = models.uuidFromString(data.user_id);
                        msgdata['forward_by'] = models.uuidFromString(data.user_id);
                        msgdata['forward_at'] = data.created_at_local;
                        msgdata['created_at'] = data.created_at_local;
                        msgdata['tag_list'] = [];

                        delete msgdata.forward_at;

                        var newMsgData = new models.instance.Messages(msgdata);
                        var msave_query = newMsgData.save({ return_query: true });
                        update_conversation(models.uuidFromString(vc), newMsgData);
                        allForwardMsgQ.push(msave_query);
                        msgdata['attch_otherfile_size'] = attch_otherfile_size;
                        returndata.push(msgdata);

                    });
                }
            });

            // console.log(3140, returndata);

            if (checklistmsgid.length > 0) {
                var recklist = await returnMsgChecklist(checklistmsgid);

                if (recklist.status) {
                    var cklist = _.orderBy(recklist.data, ["created_at", "checklist_id"], ["asc", "asc"]);
                    _.each(allMsgData, function(v, k) {
                        var vmsg_id = v.msg_id;
                        if (v.msg_type == 'checklist') {
                            _.each(data.share_conv, function(vc, kc) {
                                var msg_id = models.timeuuid();
                                var participants = [];
                                _.each(allconvdata.data, function(alv, alk) {
                                    if (alv.conversation_id.toString() == vc) {
                                        alv.participants.splice(alv.participants.indexOf(data.user_id), 1);
                                        participants = alv.participants;
                                    }
                                });
                                // console.log(4275, participants);

                                if (v.has_reply > 0) {
                                    var newRepdataConv = {
                                        msg_id: msg_id,
                                        conversation_id: models.uuidFromString(vc),
                                        rep_id: models.uuid()
                                    }
                                    var newMsgData = new models.instance.ReplayConv(newRepdataConv);
                                    var repconvQu = newMsgData.save({ return_query: true });
                                    allForwardMsgQ.push(repconvQu);

                                    _.each(allreplyconv, function(rv, rk) {
                                        if (rv.msg_id.toString() == v.msg_id.toString()) {
                                            _.each(allreplymsg, function(rpv, rpk) {
                                                if (rpv.conversation_id.toString() == rv.rep_id.toString()) {
                                                    var newrepdata = returnMsgfield(rpv);
                                                    newrepdata['msg_id'] = models.timeuuid();
                                                    newrepdata['conversation_id'] = newRepdataConv.rep_id;
                                                    newrepdata['tag_list'] = [];
                                                    var newrepmsg = new models.instance.Messages(newrepdata);
                                                    var msaveQr = newrepmsg.save({ return_query: true });
                                                    allForwardMsgQ.push(msaveQr);
                                                }
                                            })
                                        }
                                    });
                                }
                                var msgdata = returnMsgfield(v);
                                msgdata['msg_id'] = msg_id;
                                msgdata['conversation_id'] = models.uuidFromString(vc);
                                msgdata['msg_status'] = participants;
                                msgdata['sender'] = models.uuidFromString(data.user_id);
                                msgdata['forward_by'] = models.uuidFromString(data.user_id);
                                msgdata['forward_at'] = data.created_at_local;
                                msgdata['created_at'] = data.created_at_local;
                                msgdata['tag_list'] = [];
                                delete msgdata.forward_at;
                                var newMsgData = new models.instance.Messages(msgdata);
                                var msave_query = newMsgData.save({ return_query: true });
                                update_conversation(models.uuidFromString(vc), newMsgData)
                                allForwardMsgQ.push(msave_query);

                                var thismsgCklist = [];

                                _.each(cklist, function(va, ka) {
                                    if (va.msg_id.toString() == vmsg_id.toString()) {
                                        var checklist_id = models.timeuuid();
                                        var ckdata = {};
                                        ckdata['checklist_status'] = va.checklist_status;
                                        ckdata['review_status'] = va.review_status;
                                        ckdata['checklist_title'] = va.checklist_title;
                                        ckdata['created_by'] = va.created_by;
                                        ckdata['last_updated_at'] = va.last_updated_at;
                                        ckdata['last_updated_by'] = va.last_updated_by;
                                        ckdata['msg_title'] = va.msg_title;
                                        ckdata['msg_id'] = msg_id;
                                        ckdata['checklist_id'] = checklist_id;
                                        ckdata['created_at'] = data.created_at_local;

                                        var newcheck = new models.instance.MessageChecklist(ckdata);
                                        var msave_query = newcheck.save({ return_query: true });
                                        allForwardMsgQ.push(msave_query);
                                        thismsgCklist.push(ckdata);
                                    }
                                });
                                msgdata['checklist'] = thismsgCklist;
                                returndata.push(msgdata);
                            });
                        }
                    });
                    // console.log(3218, returndata);

                    batchQueryDone(allForwardMsgQ).then((result) => {
                        console.log(3800, result, 'forwardmsg sent============');
                        // console.log(3222, returndata);
                        // _.each(returnData,function(v,k){
                        //   // socket.emit('remove_pending_status',  { msg_id: v.msg_id});
                        // })
                        callback({ status: true, data: returndata })
                    }).catch(err => {
                        console.log(244, err)
                    });

                }

            } else {
                batchQueryDone(allForwardMsgQ).then((result) => {
                    console.log(3800, 'forwardmsg sent============');
                    // console.log(4382, returndata);
                    // _.each(returnData,function(v,k){
                    //   // socket.emit('remove_pending_status',  { msg_id: v.msg_id});
                    // })

                    callback({ status: true, data: returndata })
                }).catch(err => {
                    console.log(244, err)
                });
            }

        }
    }
}
var returnMsgfield = (v) => {
    var msgdata = {};
    msgdata['attch_audiofile'] = v.attch_audiofile;
    msgdata['attch_imgfile'] = v.attch_imgfile;
    msgdata['attch_otherfile'] = v.attch_otherfile;
    msgdata['attch_videofile'] = v.attch_videofile;
    msgdata['call_duration'] = v.call_duration;
    msgdata['call_msg'] = v.call_msg;
    msgdata['call_participants'] = v.call_participants;
    msgdata['call_participants'] = v.call_participants;
    msgdata['conference_id'] = v.conference_id;
    msgdata['conference_id'] = v.conference_id;
    msgdata['edit_seen'] = v.edit_seen;
    msgdata['edit_status'] = v.edit_status;
    msgdata['has_delete'] = v.has_delete;
    msgdata['has_delivered'] = v.has_delivered;
    msgdata['has_emoji'] = v.has_emoji;
    msgdata['has_rep_attachment'] = v.has_rep_attachment;
    msgdata['has_reply'] = v.has_reply;
    msgdata['issue_accept_user'] = v.issue_accept_user;
    msgdata['last_reply_name'] = v.last_reply_name;
    msgdata['last_reply_time'] = v.last_reply_time;
    msgdata['last_update_time'] = v.last_update_time;
    msgdata['last_update_user'] = v.last_update_user;
    msgdata['msg_body'] = v.msg_body;
    msgdata['msg_status'] = v.msg_status;
    msgdata['msg_type'] = v.msg_type;
    msgdata['old_created_time'] = v.old_created_time;
    msgdata['sender'] = v.sender;
    msgdata['sender_img'] = v.sender_img;
    msgdata['sender_name'] = v.sender_name;
    msgdata['tag_list'] = v.tag_list;
    msgdata['updatedmsgid'] = v.updatedmsgid;
    msgdata['url_base_title'] = v.url_base_title;
    msgdata['url_body'] = v.url_body;
    msgdata['url_favicon'] = v.url_favicon;
    msgdata['url_image'] = v.url_image;
    msgdata['url_title'] = v.url_title;
    msgdata['checklist'] = v.checklist;
    msgdata['forward_by'] = v.forward_by;
    msgdata['forward_at'] = v.forward_at;
    msgdata['created_at'] = v.created_at;
    return msgdata;
}
var returnMsgChecklist = (checklistmsgid) => {
    return new Promise((resolve, reject) => {
        models.instance.MessageChecklist.find({ msg_id: { $in: checklistmsgid } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2355, err)
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}

var getallRepMsgAwait = (convArray) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ conversation_id: { $in: convArray } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2355, err)
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}
var getALlConvParticipants = (convs) => {
    return new Promise((resolve, reject) => {
        var convArray = [];
        _.each(convs, function(v, k) {
            convArray.push(models.uuidFromString(v));
        });
        models.instance.Conversation.find({ conversation_id: { $in: convArray } }, function(err, result) {
            if (err) {
                console.log(2355, err);
                reject({ status: false, data: [] });
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}
var getALlMessages = (convid, msgArray) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ conversation_id: models.uuidFromString(convid), msg_id: { $in: msgArray } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2355, err)
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}
var getALlMessagesLinkData = (convid) => {
    var option = {};
    if (convid !== 'all') {
        option = { conversation_id: models.uuidFromString(convid) };
    }
    return new Promise((resolve, reject) => {
        models.instance.Link.find(option, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2355, err)
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}

var getreplyConv = (conv_id, msgAraay) => {
    // console.log(2391,models.uuidFromString(conv_id.toString()),msgAraay)
    return new Promise((resolve, reject) => {
        models.instance.ReplayConv.find({ conversation_id: models.uuidFromString(conv_id.toString()), msg_id: { $in: msgAraay } }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2367, err);
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}


var batchQueryDone = (data) => {
    return new Promise((resolve, reject) => {
        models.doBatch(data, function(err) {
            if (err) {
                reject({ status: false, msg: err })
            } else {
                console.log('forward success.')
                resolve({ status: true, msg: 'success' });
            }
        });
    });
}

var findmsgRepId = (data) => {
    return new Promise((resolve, reject) => {
        models.instance.ReplayConv.findOne({ conversation_id: models.uuidFromString(data.conversation_id.toString()), msg_id: models.timeuuidFromString(data.msg_id) }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(2367, err);
            } else {
                resolve({ status: true, data: result });
            }
        });
    })
}

var getlasthundredmsg = (data) => {
    return new Promise((resolve, reject) => {

        models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), $orderby: { '$desc': 'msg_id' }, $limit: 25 }, { raw: true, allow_filtering: true }, function(err, conversation) {
            if (err) {
                console.log(err);
            } else {
                // console.log("conversation length:  "+conversation.length);
                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            resolve({ status: false, err: cerror })
                        } else {
                            resolve({ status: true, msg: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    resolve({ status: true, msg: _.reverse(conversation), checklist: [] });
                }
            }
        });
    })
}

function updateMyrepMsgStatus(data) {

    models.instance.ReplayConv.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(err, ressult) {
        if (err) {
            console.log('message.js4176', err);
        } else {
            console.log(4178, 'msg_find', ressult);
            if (ressult.length > 0) {
                models.instance.Messages.find({ conversation_id: models.uuidFromString(ressult[0].rep_id.toString()) }, function(err2, res2) {
                    if (err2) {
                        console.log('message.js4180', err2);
                    } else {
                        console.log(4184, res2.length)
                        var allMsgIds = [];
                        var conv_id = '';
                        if (res2 != null) {
                            if (res2.length > 0) {
                                for (let i = 0; i < res2.length; i++) {
                                    allMsgIds.push(res2[i].msg_id);
                                    conv_id = res2[i].conversation_id;
                                }
                            }
                        }
                        console.log(4195, allMsgIds);
                        if (allMsgIds.length > 0) {
                            console.log(41193, 'test for alllllllllllllllllllllll')
                            if (data.type == 'for_all') {
                                models.instance.Messages.update({ conversation_id: conv_id, msg_id: { $in: allMsgIds } }, { msg_status: null }, function(err3, res3) {
                                    if (err3) {
                                        console.log(4199, err3);
                                    } else {
                                        console.log('msg status update success', res3);
                                    }
                                });
                            } else {
                                models.instance.Messages.update({ conversation_id: conv_id, msg_id: { $in: allMsgIds } }, { msg_status: { $remove: [data.user_id] } }, function(err3, res3) {
                                    if (err3) {
                                        console.log(4199, err3);
                                    } else {
                                        console.log('msg status update success', res3);
                                    }
                                });
                            }
                        }
                    }
                })
            }
        }
    })
}

function updateMyrepMsgStatus2(data) {
    _.each(data.msg_id, function(v, k) {
        models.instance.ReplayConv.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(v) }, function(err, ressult) {
            if (err) {
                console.log('message.js4176', err);
            } else {
                console.log(4178, 'msg_find', ressult);
                if (ressult.length > 0) {
                    models.instance.Messages.find({ conversation_id: models.uuidFromString(ressult[0].rep_id.toString()) }, function(err2, res2) {
                        if (err2) {
                            console.log('message.js4180', err2);
                        } else {
                            console.log(4184, res2.length)
                            var allMsgIds = [];
                            var conv_id = '';
                            if (res2 != null) {
                                if (res2.length > 0) {
                                    for (let i = 0; i < res2.length; i++) {
                                        allMsgIds.push(res2[i].msg_id);
                                        conv_id = res2[i].conversation_id;
                                    }
                                }
                            }
                            console.log(4195, allMsgIds);
                            if (allMsgIds.length > 0) {
                                if (data.type == 'for_all') {
                                    models.instance.Messages.update({ conversation_id: conv_id, msg_id: { $in: allMsgIds } }, { msg_status: null }, function(err3, res3) {
                                        if (err3) {
                                            console.log(4199, err3);
                                        } else {
                                            console.log('msg status update success', res3);
                                        }
                                    });
                                } else {
                                    models.instance.Messages.update({ conversation_id: conv_id, msg_id: { $in: allMsgIds } }, { msg_status: { $remove: [data.user_id] } }, function(err3, res3) {
                                        if (err3) {
                                            console.log(4199, err3);
                                        } else {
                                            console.log('msg status update success', res3);
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            }
        })
    });
}

function add_delete_info(data) {
    var queries = [];
    _.each(data.msgid_array, function(v, k) {
        var deleteData = {
            user_id: models.uuidFromString(data.user_id),
            delete_id: v.toString(),
            delete_type: 'message'
        }
        var newQuery = new models.instance.DeleteInfo(deleteData);
        var msave_query = newQuery.save({ return_query: true });
        queries.push(msave_query)
    });
    models.doBatch(queries, function(err) {
        if (err) {
            console.log(4841, err);
        } else {
            console.log(4843, { status: true, msg: "delete info added successfully" });
        }
    });
}

function find_and_delete_msglink(data, socket) {
    _.each(data.msg_id, function(v, k) {
        models.instance.Link.find({ msg_id: v }, { allow_filtering: true, raw: true }, function(lerr, res) {
            if (lerr) console.log(4850, lerr);
            else {
                if (res.length > 0) {
                    var linkqueries = [];
                    var linkids = [];
                    for (let i of res) {
                        var q = { conversation_id: models.uuidFromString(data.conversation_id), url_id: models.timeuuidFromString(i.url_id) };
                        var u = { has_delete: { $add: [data.user_id] } };

                        var update_query = models.instance.Link.update(q, u, { return_query: true });
                        linkqueries.push(update_query);
                        linkids.push(i.url_id);

                    }
                    models.doBatch(linkqueries, function(err) {
                        if (err) {
                            console.log(4866, err);
                        } else {
                            for (let n of linkids)
                                socket.emit('updateDeleteLinkids', n);
                        }
                    });
                }
            }
        });
    });
}

var delete_message_last_time = (data, socket, callback) => {
        console.log(4879, 'msg_delete', data);
        if (!Array.isArray(data.msg_id)) {
            data.msg_id = JSON.parse(data.msg_id);
        }
        if (!Array.isArray(data.participants)) {
            data.participants = JSON.parse(data.participants);
        }
        console.log(4886, 'msg_delete', data);

        var msgid_array = [];
        _.each(data.msg_id, function(v, k) {
            msgid_array.push(models.timeuuidFromString(v));
        });

        updateMyrepMsgStatus2(data);
        if (data.type == 'for_me') {
            models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: { '$in': msgid_array } }, { has_delete: { $add: [data.user_id] } }, function(err1) {
                if (err1) callback({ status: false, err1 });
                else {
                    add_delete_info({ msgid_array, user_id: data.user_id });
                    callback({ status: true });
                }
            });
        } else if (data.type == 'for_all') {
            var new_has_delete = [];
            _.each(data.participants, function(v, k) {
                new_has_delete.push(v);
            });

            new_has_delete.push('delete_for_all');

            models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: { '$in': msgid_array } }, { has_delete: { $add: new_has_delete } }, function(err1) {
                if (err1) callback({ status: false, err1 });
                else {
                    find_and_delete_msglink(data, socket);

                    var conv_id = data.main_conv_id != "" ? data.main_conv_id : data.conversation_id;
                    models.instance.File.find({ conversation_id: models.uuidFromString(conv_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
                        if (ferr) callback({ status: false, err: ferr });
                        if (files) {
                            var queries = [];
                            var fileIds = [];
                            _.forEach(files, function(v, k) {
                                if (data.msg_id.indexOf(v.msg_id.toString()) > -1) {
                                    var update_query = models.instance.File.delete({ id: v.id }, { return_query: true });
                                    fileIds.push(v.originalname.toString());
                                    queries.push(update_query);
                                    var bucket_name = v.bucket.split('/')[0];
                                    var objectsList = v.location.split('/');
                                    objectsList.splice(0, 1);
                                    objectsList = objectsList.join('/');
                                    minioClient.removeObjects(bucket_name, [objectsList], function(e) {
                                        if (e) callback({ status: false, error: 'Unable to remove Objects ', e });
                                        console.log("Removed the objects successfully.");
                                    });
                                }
                            });
                            if (queries.length > 0) {
                                models.doBatch(queries, function(err) {
                                    if (err) callback({ status: false, error: err });
                                    callback({ status: true, file_ids: fileIds });
                                });
                            } else {
                                callback({ status: true });
                            }
                        } else {
                            callback({ status: true });
                        }
                    });

                    _.each(data.participants, function(v, k) {
                        add_delete_info({ msgid_array, user_id: v });
                    });
                }
            });
        }
    }
    // var delete_message_last_time = (data, callback) => {
    //     console.log(4221, 'msg_delete', data);
    //     updateMyrepMsgStatus(data);
    //     if (data.type == 'for_me') {
    //         // console.log(2891,data);
    //         models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { has_delete: { $add: [data.user_id] } }, update_if_exists, function(err, result) {
    //             if (err) {
    //                 callback({ status: false, err: err })
    //             } else {
    //                 models.instance.File.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
    //                     if (ferr) callback({ status: false, err: ferr });
    //                     if (files) {
    //                         var queries = [];
    //                         var fileIds = [];
    //                         _.forEach(files, function(v, k) {
    //                             if (v.user_id.toString() == data.user_id) {
    //                                 var update_query = models.instance.File.update({ id: v.id }, { is_delete: 1 }, { return_query: true });
    //                                 fileIds.push(v.id.toString());
    //                                 queries.push(update_query);
    //                                 var bucket_name = v.bucket.split('/')[0];
    //                                 var objectsList = v.location.split('/');
    //                                 objectsList.splice(0, 1);
    //                                 objectsList = objectsList.join('/');
    //                                 minioClient.removeObjects(bucket_name, [objectsList], function(e) {
    //                                     if (e) callback({ status: false, error: 'Unable to remove Objects ', e });
    //                                     console.log("Removed the objects successfully.");
    //                                 });

//                             }
//                         });
//                         models.doBatch(queries, function(err) {
//                             if (err) {
//                                 callback({ status: false, error: err });
//                             } else {
//                                 callback({ status: true, file_ids: fileIds });
//                             }
//                         });
//                     } else {
//                         callback({ status: true });
//                     }
//                 });
//                 var deleteData = {
//                     user_id: models.uuidFromString(data.user_id),
//                     delete_id: data.msg_id.toString(),
//                     delete_type: 'message'
//                 }
//                 new models.instance.DeleteInfo(deleteData).save(function(errr, res) {
//                     if (errr) {
//                         console.log(2963, errr);
//                     }
//                 })
//             }
//         })
//     } else if (data.type == 'for_all') {
//         // console.log('3450 Delete for all', data);
//         var new_has_delete = [];
//         _.each(data.participants, function(v, k) {
//             new_has_delete.push(v);
//         });

//         new_has_delete.push('delete_for_all');

//         models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { has_delete: { $add: new_has_delete } }, update_if_exists, function(err, result) {
//             if (err) {
//                 callback({ status: false, err: err })
//             } else {

//                 var conv_id = data.main_conv_id != "" ? data.main_conv_id : data.conversation_id;
//                 models.instance.File.find({ conversation_id: models.uuidFromString(conv_id), msg_id: models.timeuuidFromString(data.msg_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(ferr, files) {
//                     if (ferr) callback({ status: false, err: ferr });
//                     if (files) {
//                         var queries = [];
//                         var fileIds = [];
//                         _.forEach(files, function(v, k) {
//                             // var update_query = models.instance.File.update(
//                             //     {id: v.id},
//                             //     {is_delete: 1},
//                             //     {return_query: true}
//                             // );
//                             // var update_query = models.instance.File.update(
//                             //     {id: v.id},
//                             //     {is_delete: 1},
//                             //     {return_query: true}
//                             // );

//                             var update_query = models.instance.File.delete({ id: v.id }, { return_query: true });
//                             fileIds.push(v.originalname.toString());
//                             queries.push(update_query);
//                             var bucket_name = v.bucket.split('/')[0];
//                             var objectsList = v.location.split('/');
//                             objectsList.splice(0, 1);
//                             objectsList = objectsList.join('/');
//                             minioClient.removeObjects(bucket_name, [objectsList], function(e) {
//                                 if (e) callback({ status: false, error: 'Unable to remove Objects ', e });
//                                 console.log("Removed the objects successfully.");
//                             });
//                             // var update_query = models.instance.File.delete(
//                             //     {id: models.timeuuidFromString(v.id.toString())},
//                             //     {return_query: true}
//                             // );
//                             // queries.push(update_query);
//                         });
//                         models.doBatch(queries, function(err) {
//                             if (err) callback({ status: false, error: err });
//                             callback({ status: true, file_ids: fileIds });
//                         });
//                     } else {
//                         callback({ status: true });
//                     }
//                 });
//                 var queries = [];
//                 _.each(data.participants, function(v, k) {
//                     var deleteData = {
//                         user_id: models.uuidFromString(v),
//                         delete_id: data.msg_id.toString(),
//                         delete_type: 'message'
//                     }
//                     var newQuery = new models.instance.DeleteInfo(deleteData);
//                     var msave_query = newQuery.save({ return_query: true });
//                     queries.push(msave_query)
//                 })
//                 models.doBatch(queries, function(err) {
//                     if (err) {
//                         console.log(3012, err);
//                     } else {
//                         console.log(3012, { status: true })
//                     }
//                 });
//             }
//         })
//     }
// }

var updateHasHideThismsg = (data, callback) => {
    models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { has_hide: { $add: [data.user_id] } }, update_if_exists, function(err, result) {
        if (err) {
            callback({ status: false, err: err })
        } else {
            callback({ status: true })
        }
    })
}

async function createChecklistAndroid(data, callback) {
    var msg_id = models.timeuuid();
    var allQ = [];

    var newmsg = {
        msg_id: msg_id,
        conversation_id: models.uuidFromString(data.conversation_id),
        msg_body: data.checklist_title,
        sender: models.uuidFromString(data.sender),
        sender_img: data.sender_img,
        sender_name: data.sender_name,
        msg_type: 'checklist'
    }

    var newrepmsg = new models.instance.Messages(newmsg);
    var msaveQr = newrepmsg.save({ return_query: true });
    allQ.push(msaveQr);

    _.each(data.checklist_item, function(v, k) {
        var newChecklist = {
            checklist_id: models.timeuuid(),
            msg_id: msg_id,
            msg_title: data.checklist_title,
            created_by: models.uuidFromString(data.sender),
            checklist_title: v,
        }
        var newMsgChecklist = new models.instance.MessageChecklist(newChecklist);
        var checklistsave = newMsgChecklist.save({ return_query: true });
        allQ.push(checklistsave);
    });

    var saveallQ = await saveAllQuery(allQ);
    var findMsg = await findThismsg({ msg_id: msg_id.toString(), conversation_id: data.conversation_id });
    var findCl = await findChecklist({ msg_id: msg_id.toString() });
    var return_data = {
        status: true,
        msg: findMsg.result,
        checklist: findCl.result
    }

    callback(return_data);

}

function updateChecklistAndroidv2(data, callback) {
    console.log(4221, data);
    var msg_id = data.msg_id;
    var created_at = new Date().getTime();
    var totalData = {
        msg_body: data.msg_body,
        created_at: created_at
    }

    try {
        var batch_query = [];
        _.each(data.items, function(v, k) {

            v.mark = v.mark == '1' ? 1 : 0;
            var q2 = models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(msg_id), checklist_id: models.timeuuidFromString(v.id) }, { checklist_status: v.mark, last_updated_by: data.user_id, last_updated_at: created_at }, { return_query: true });
            batch_query.push(q2);

        });
        models.doBatch(batch_query, function(err) {
            if (err) {
                console.log(4236, err);
                callback({ status: false, err: err });
            }
        });
    } catch (e) {
        console.log(4242)
        callback({ status: false, err: e });
    }

    try {
        models.instance.Messages.update({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, totalData, update_if_exists, function(error, result) {
            if (error) {
                console.log(4180, error);
                callback({ status: false, err: error });
            }
            models.instance.Messages.findOne({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(msg_id) }, function(err, message) {
                if (err) {
                    console.log(4183, err);
                    callback({ status: false, err: err })
                } else {
                    models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(msg_id), $orderby: { '$desc': 'checklist_id' } }, function(error, checklist) {
                        if (error) {
                            console.log(4188, error);
                            callback({ status: false, err: error })
                        } else {
                            callback({ status: true, msg: message, checklist: checklist });
                        }
                    });
                };
            });
        });
    } catch (e) {
        console.log(4269)
        callback({ status: false, err: e });
    }
}
// async function updateChecklistAndroidv2(data,callback){
//   var msg_id = data.checklist[0].msg_id;
//   var checklistupdate = await update_checklist_item(data.checklist);
//   // console.log(4157, checklistupdate);
//   var created_at = new Date().getTime();
//   var totalData = {
//     msg_body: data.msg_body,
//     created_at: created_at
//   }
//   if(data.timer !== undefined){
//     totalData.has_timer = data.timer;
//   }
//   if(data.tag_list !== undefined){
//     totalData.tag_list = data.tag_list;
//   }
//   // console.log(4174, totalData);
//   try{
//     models.instance.Messages.update({msg_id: models.timeuuidFromString(msg_id), conversation_id:models.uuidFromString(data.conversation_id)}, totalData, update_if_exists, function(error, result){
//       console.log(4180, error);
//       if(error) callback({status: false, err: error});
//       models.instance.Messages.findOne({conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(msg_id)}, function(err, message){
//         console.log(4183, err);
//         if(err) {
//           callback({status:false, err: err})
//         }else{
//             models.instance.MessageChecklist.find({msg_id: models.timeuuidFromString(msg_id),$orderby:{ '$desc' :'checklist_id' }},function(error,checklist){
//               console.log(4188, error);
//               if(error){
//                 callback({status:false,err:error})
//               }else{
//                 callback({status:true, msg: message,checklist:checklist,unreadChecklist:false});
//               }
//             });
//         };
//       });
//     });
//   }catch(e){
//     callback({status: false, err: e});
//   }
// }

var update_checklist_item = (allChecklist) => {
    return new Promise((resolve, reject) => {
        var mqueries = [];
        var mychecklist = [];
        var unreadChecklist = false;
        _.each(allChecklist, function(v, k) {
            var genid = models.timeuuid();

            var checklistData = {
                msg_title: v.msg_title,
                created_by: models.uuidFromString(v.created_by),
                checklist_title: v.checklist_title,
                checklist_status: parseInt(v.checklist_status),
                created_at: v.created_at,
                last_updated_at: v.last_updated_at
            }
            if (v.last_updated_by !== undefined) {
                checklistData.last_updated_by = v.last_updated_by;
            }

            console.log(4218, checklistData);
            var q2 = models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(v.msg_id), checklist_id: models.timeuuidFromString(v.checklist_id) }, checklistData, { return_query: true });
            mqueries.push(q2);

        });
        models.doBatch(mqueries, function(err) {
            if (err) { console.log(4236, 'msg_js', err); } else {
                resolve({ status: true, unreadChecklist });
            }
        });
    })
}

async function updateChecklistAndroid(data, callback) {
    var msg_id = models.timeuuid();
    var newchecklistupdate = await updatechecklistFun(data.checklist, msg_id);
    var newRepmsgUpdate = await updateRepMsg(data.rep_id, msg_id, data.conversation_id);
    // console.log(3142,data);
    var totalData = {
        msg_id: msg_id,
        msg_body: data.msg_body,
        attch_imgfile: [],
        attch_audiofile: [],
        attch_videofile: [],
        attch_otherfile: [],
        sender: models.uuidFromString(data.sender),
        sender_name: data.sender_name,
        sender_img: data.sender_img,
        has_delivered: 0,
        conversation_id: models.uuidFromString(data.conversation_id),
        has_reply: parseInt(data.has_reply),
        has_timer: data.timer,
        msg_type: data.msg_type,
        tag_list: data.tag_list,
        old_created_time: data.old_created_time,
        last_update_user: models.uuidFromString(data.last_update_user.toString()),
        msg_text: data.msg_text,
        updatedmsgid: (data.updatedmsgid == '' ? null : models.uuidFromString(data.updatedmsgid))
    }

    if (totalData.has_reply != 0) {
        totalData['last_reply_time'] = data.last_reply_time;
    }
    var message = new models.instance.Messages(totalData);

    message.saveAsync()
        .then(function(res) {
            models.instance.Messages.findOne({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: msg_id }, function(err, message) {
                if (err) {
                    callback({ status: false, err: err })
                } else {
                    models.instance.MessageChecklist.find({ msg_id: msg_id, $orderby: { '$desc': 'checklist_id' } }, function(error, checklist) {
                        if (error) {
                            callback({ status: false, err: error })
                        } else {
                            callback({ status: true, msg: message, checklist: checklist, unreadChecklist: false });
                        }
                    });
                };
            });
        })
        .catch(function(err) {
            callback({ status: false, err: err });
        });


}

var updatechecklistFun = (allChecklist, msg_id) => {
    return new Promise((resolve, reject) => {
        var mqueries = [];
        var unreadChecklist = false;
        _.each(allChecklist, function(v, k) {
            var genid = models.timeuuid();

            var checklistData = {
                checklist_id: genid,
                msg_id: msg_id,
                msg_title: v.msg_title,
                created_by: models.uuidFromString(v.created_by),
                checklist_title: v.checklist_title,
                last_updated_by: v.last_updated_by,
                checklist_status: parseInt(v.checklist_status),
                created_at: v.created_at,
                last_updated_at: v.last_updated_at
            }

            var q2 = new models.instance.MessageChecklist(checklistData);
            var save_query2 = q2.save({ return_query: true });
            mqueries.push(save_query2);
            if (v.checklist_id !== '') {
                var query_object = {
                    msg_id: models.timeuuidFromString(v.msg_id),
                    checklist_id: models.timeuuidFromString(v.checklist_id)
                };
                var deletelist = models.instance.MessageChecklist.delete(query_object, { return_query: true });
                mqueries.push(deletelist);
            }
        });
        models.doBatch(mqueries, function(err) {
            if (err) { console.log(3522, 'msg_js', err); } else {
                resolve({ status: true, unreadChecklist });
            }
        });
    })
}

var updateRepMsg = (rep_id, msg_id, conversation_id) => {
    var repconvQ = [];
    return new Promise((resolve, reject) => {
        if (rep_id == null) {
            resolve({ status: false });
        } else {
            models.instance.Messages.find({ conversation_id: models.uuidFromString(rep_id.toString()) }, { raw: true, allow_filtering: true }, function(err, result) {
                if (err) {
                    resolve({ status: false, err: err });
                } else {

                    if (result.length > 0) {
                        var newRepconvid = models.uuid();
                        _.each(result, function(v, k) {
                            var newMsg = v;
                            newMsg['msg_id'] = models.timeuuid();
                            newMsg['conversation_id'] = newRepconvid;
                            if (k == 1) {
                                last_reply_time = v.created_at;
                            }

                            var newMsgData = new models.instance.Messages(newMsg);
                            var msave_query = newMsgData.save({ return_query: true });
                            repconvQ.push(msave_query);

                        });
                        var newRepConv = {
                            rep_id: newRepconvid,
                            conversation_id: models.uuidFromString(conversation_id.toString()),
                            msg_id: models.timeuuidFromString(msg_id.toString())
                        }
                        var newRe = new models.instance.ReplayConv(newRepConv);
                        var msave_queryR = newRe.save({ return_query: true });
                        repconvQ.push(msave_queryR);
                    }
                    if (repconvQ.length > 0) {
                        models.doBatch(repconvQ, function(err) {
                            if (err) {
                                resolve({ status: false, err: err });
                            } else {
                                resolve({ status: true });
                            }
                        });
                    }
                }
            })
        }
    })
}

var saveAllQuery = (data) => {
    return new Promise((resolve, reject) => {
        models.doBatch(data, function(err) {
            if (err) {
                resolve({ status: false, err: err });
            } else {
                resolve({ status: true });
            }
        });
    });
}
var findThismsg = (data) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.findOne({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(err, result) {
            if (err) {
                resolve({ status: false, err: err });
            } else {
                resolve({ status: true, result: result });
            }
        });
    });
}
var findChecklist = (data) => {
    return new Promise((resolve, reject) => {
        models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, function(err, result) {
            if (err) {
                resolve({ status: false, err: err });
            } else {
                resolve({ status: true, result: result });
            }
        });
    });
}

function getAllmydeletemessage(user_id, callback) {
    models.instance.DeleteInfo.find({ user_id: models.uuidFromString(user_id), delete_type: 'message' }, { raw: true, allow_filtering: true }, function(err, result) {
        if (err) {
            console.log(err);
            callback({ status: false, err: err });
        } else {
            callback({ status: true, data: result });
        }
    })
}

function send_notification_msg(data, callback) { // pvtmsg
    var nullval = [];
    // var uuidfrom = models.uuidFromString(from);
    var imgfile = (typeof data.attach_files === 'undefined') ? nullval : data.attach_files.imgfile;
    var audiofile = (typeof data.attach_files === 'undefined') ? nullval : data.attach_files.audiofile;
    var videofile = (typeof data.attach_files === 'undefined') ? nullval : data.attach_files.videofile;
    var otherfile = (typeof data.attach_files === 'undefined') ? nullval : data.attach_files.otherfile;
    console.log(470, imgfile)

    var msgType;
    var conversation_id = data.conversation_id;
    var uuidconversation_id = models.uuidFromString(conversation_id);
    var file_conv_id = uuidconversation_id;
    var root_conv_id = (data.root_conv_id != undefined) ? data.root_conv_id : null;
    var rep_id = (data.rep_id != undefined) ? data.rep_id : null;
    if (root_conv_id != null || rep_id != null) {
        file_conv_id = models.timeuuidFromString(root_conv_id);
    }
    console.log(323, imgfile, audiofile, videofile, otherfile);
    if (imgfile && imgfile.length == 0 && audiofile && audiofile.length == 0 && videofile && videofile.length == 0 && otherfile && otherfile.length == 0 && data.msg_body.indexOf('href=') == -1) {
        if (data.msg_body.indexOf('class="msgCheckListContainer"') > 0) {
            msgType = 'checklist';
        } else {
            msgType = 'text';
        }
    } else {
        msgType = 'media';

        if (imgfile != null) {
            if (imgfile.length > 0) {
                msgType = msgType + '_imgfile';
            }
        }
        if (audiofile != null) {
            if (audiofile.length > 0) {
                msgType = msgType + '_audiofile';
            }
        }
        if (videofile != null) {
            if (videofile.length > 0) {
                msgType = msgType + '_videofile';
            }
        }
        if (otherfile != null) {
            if (otherfile.length > 0) {
                msgType = msgType + '_otherfile';
            }
        }
        if (data.msg_body.indexOf('href=')) {
            msgType = msgType + '_link';
        }
        if (msgType == 'media') {
            msgType = 'text';
        }
        if (data.msg_body.indexOf('class="msgCheckListContainer"') > 0) {
            msgType = 'checklist';
        }

    }
    // ==================================
    console.log(5330, '============> secret', data.type, data);
    if (data.type == 'secret_msg') {
        // var attch_imgfile = [];
        // var attch_audiofile = [];
        // var attch_videofile = [];
        // var attch_otherfile = [];
        // console.log(3402,data.attach_files);
        // if (data.attach_files != undefined || data.attach_files != null) {
        //     if (data.attach_files.length > 0) {
        //         attch_imgfile = data.attach_files.imgfile;
        //         attch_audiofile = data.attach_files.audiofile;
        //         attch_videofile = data.attach_files.videofile;
        //         attch_otherfile = data.attach_files.otherfile;
        //     }
        // }
        var msgid = models.timeuuid();
        var msg = {
            msg_id: msgid,
            conversation_id: models.uuidFromString(conversation_id),
            sender: models.uuidFromString(data.sender),
            sender_name: data.sender_name,
            sender_img: data.sender_img,
            // msg_type: data.msg_type,
            msg_type: msgType,
            msg_body: data.msg_body,
            msg_text: data.msg_body,
            msg_status: data.msg_status,
            root_conv_id: data.root_conv_id !== undefined ? data.root_conv_id : null,
            secret_user: data.secret_user,
            attch_imgfile: imgfile,
            attch_audiofile: audiofile,
            attch_videofile: videofile,
            attch_otherfile: otherfile,
            is_secret: true
        }

        var allLink = data.allLink;
        console.log(5366, allLink, conversation_id, data.sender)
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
                        msg_id: msgid.toString(),
                        url_list: allvalidLink,
                        conversation_id: msg.conversation_id.toString(),
                        user_id: msg.sender.toString(),
                        secret_user: data.secret_user
                    }
                    console.log(1363, linkdata);
                    create_conv_link(linkdata, function(res) {
                        console.log(3147, res);
                    })
                }
            }
        }

    } else {
        var msg = {
            msg_id: models.timeuuid(),
            conversation_id: models.uuidFromString(data.conversation_id),
            sender: models.uuidFromString(data.sender),
            sender_name: data.sender_name,
            sender_img: data.sender_img,
            msg_type: data.msg_type,
            msg_body: data.msg_body,
            root_conv_id: data.root_conv_id !== undefined ? data.root_conv_id : null,
            attch_imgfile: [],
            attch_audiofile: [],
            attch_videofile: [],
            attch_otherfile: []
        }
    }
    new models.instance.Messages(msg).save(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            models.instance.Conversation.findOne({ conversation_id: (root_conv_id == null ? models.uuidFromString(conversation_id) : models.uuidFromString(root_conv_id.toString())) }, function(er, conv) {
                models.instance.Messages.findOne({ conversation_id: msg.conversation_id, msg_id: msg.msg_id }, function(error, res) {
                    if (error) {
                        console.log(error);
                    } else { // secret
                        var file_conv_id = uuidconversation_id;
                        if (root_conv_id != null || rep_id != null) {
                            file_conv_id = models.timeuuidFromString(root_conv_id);
                        }

                        console.log("705 ===========", uuidconversation_id.toString(), file_conv_id.toString());
                        if (data.attach_files !== undefined && data.attach_files.allfiles !== undefined) {
                            if (!Array.isArray(data.attach_files.allfiles)) {
                                data.attach_files.allfiles = JSON.parse(data.attach_files.allfiles);
                            }

                            if (otherfile != undefined && otherfile.length > 0) {
                                // for (var i = 0; i < otherfile.length; i++) {
                                //     _.each(data.attach_files.allfiles, function(fv, fk) {
                                //         if (fv.bucket + '/' + fv.key == otherfile[i]) {
                                //             // cbresult.msg.attch_otherfile_size.push(fv.size.toString());
                                //             // console.log(712, cbresult.msg.attch_otherfile_size);
                                //             // console.log(713, cbresult.msg.attch_imgfile);
                                //         }
                                //     });
                                // }
                            }
                            var senderid = data.sender;
                            // if (senderid == undefined) {
                            //     senderid = socket.handshake.session.userdata.from;
                            // }

                            var uuidfrom = models.uuidFromString(senderid);
                            var tag_list = data.tag_list;
                            if (tag_list == undefined || tag_list == null) {
                                tag_list = [];
                            }

                            var mention_user = (data.mention_user != undefined) ? data.mention_user : [];

                            save_files_data({ root_conv_id: uuidconversation_id.toString(), allfiles: data.attach_files.allfiles, msgid: msgid, conversation_id: file_conv_id, user_id: uuidfrom, tempAttachmentTag: tag_list, mention_user: mention_user, conv: conv, secret_user: data.secret_user }, function(filedata) {
                                // cbresult['filedata'] = filedata.data;
                                // callback(cbresult);
                                res.attch_imgfile = (res.attch_imgfile == null) ? nullval : res.attch_imgfile;
                                res.attch_audiofile = (res.attch_audiofile == null) ? nullval : res.attch_audiofile;
                                res.attch_videofile = (res.attch_videofile == null) ? nullval : res.attch_videofile;
                                res.attch_otherfile = (res.attch_otherfile == null) ? nullval : res.attch_otherfile;
                                res.attch_otherfile_size = [];
                                callback({ status: true, data: res, filedata: filedata.data });
                            });
                        } else {
                            callback({ status: true, data: res });
                        }
                        // ==============================================

                    }
                })
            });
        }
    })

}

var editRepMsg = async(data, callback) => {
    var findoldmsg = await getoldmsgdata(data.msg_id, data.conversation_id);
    if (findoldmsg.data != null) {
        var msg_id = models.timeuuid();
        var conversation_id = models.uuidFromString(data.conversation_id);
        var newmsg = findoldmsg.data;
        newmsg['msg_id'] = msg_id;
        newmsg['conversation_id'] = conversation_id;
        var edit_history = newmsg.edit_history;
        // if(edit_history == null){
        //   edit_history = '{"msg_body":"'+msg.msg_body.toString()+'","user_id":"'+msg.sender+'","update_at":"'+data.update_at+'"}';
        // }else{
        //   edit_history = edit_history + '@_$cUsJs{"msg_body":"'+msg.msg_body.toString()+'","user_id":"'+msg.sender+'","update_at":"'+data.update_at+'"}';
        // }
        var jsondata = JSON.stringify({ msg_body: data.msg_body.toString(), user_id: newmsg.sender.toString(), update_at: data.update_at });
        if (edit_history == null) {
            edit_history = jsondata.toString();
        } else {
            edit_history = edit_history + '@_$cUsJs' + jsondata.toString();
        }
        newmsg['edit_status'] = data.update_at;
        newmsg['sender'] = models.uuidFromString(newmsg.sender.toString());
        newmsg['edit_history'] = edit_history;

        new models.instance.Messages(newmsg).save(function(err, result) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                callback({ status: true });
            }
        })
    }
}

var updateTextMsg = async(msg, callback) => {
    var mqueries = [];
    var findoldmsg = await getoldmsgdata(msg.msg_id, msg.conversation_id);
    if (findoldmsg != null) {
        var msg_id = models.timeuuid();
        var conversation_id = models.uuidFromString(msg.conversation_id);
        var newmsg = findoldmsg.data;
        newmsg['msg_id'] = msg_id;
        newmsg['conversation_id'] = conversation_id;

        var edit_history = newmsg.edit_history;
        // if(edit_history == null){
        //   edit_history = '{"msg_body":"'+msg.msg_body.toString()+'","user_id":"'+msg.sender+'","update_at":"'+data.update_at+'"}';
        // }else{
        //   edit_history = edit_history + '@_$cUsJs{"msg_body":"'+msg.msg_body.toString()+'","user_id":"'+msg.sender+'","update_at":"'+data.update_at+'"}';
        // }
        var jsondata = JSON.stringify({ msg_body: msg.msg_body.toString(), user_id: msg.sender, update_at: msg.update_at });
        var ceriO = cheerio.load(msg.msg_body);
        msg.msg_body = ceriO.text();
        if (edit_history == null) {
            edit_history = jsondata.toString();

            newmsg['msg_text'] = newmsg.msg_text + msg.msg_body.toString();
            // console.log(3887,  newmsg['msg_text']);
        } else {
            edit_history = edit_history + '@_$cUsJs' + jsondata.toString();
            newmsg['msg_text'] = newmsg.msg_text + msg.msg_body.toString();
            // console.log(3887,  newmsg['msg_text']);
        }
        newmsg['edit_status'] = msg.update_at;
        newmsg['sender'] = models.uuidFromString(msg.sender);
        newmsg['edit_history'] = edit_history;
        // newmsg['created_at'] = new Date();
        var q2 = new models.instance.Messages(newmsg);
        var save_query2 = q2.save({ return_query: true });
        mqueries.push(save_query2);
        var repidornot = await findmsgRepId({ msg_id: msg.msg_id, conversation_id: msg.conversation_id });
        // console.log(3355,repidornot)
        if (repidornot.data != null && repidornot.data != undefined) {
            await updateRepMsg(repidornot.data.rep_id.toString(), msg_id.toString(), conversation_id.toString());
        }
        await msgDeletePromise(msg.conversation_id, msg.msg_id);
        models.doBatch(mqueries, function(err) {
            if (err) {
                console.log(3493, err);
            } else {
                console.log(3797, 'true')
                callback({ status: true, msg: newmsg });
            }
        });

    }

}

var msgDeletePromise = (conversation_id, msg_id) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.delete({ conversation_id: models.uuidFromString(conversation_id.toString()), msg_id: models.timeuuidFromString(msg_id.toString()) }, function(err, result) {
            if (err) {
                resolve({ status: false, err: err });
            } else {
                resolve({ status: true });
            }
        })
    })
}


var getoldmsgdata = (msg_id, conversation_id) => {
    return new Promise((resolve, reject) => {
        models.instance.Messages.findOne({ conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id) }, function(err, result) {
            if (err) {
                resolve({ status: false, err: err });
            } else {
                resolve({ status: true, data: result });
            }
        })
    })
}

var getAllFiles = (convid) => {
    return new Promise((resolve, reject) => {
        var allfiles = [];
        models.instance.File.find({ conversation_id: models.timeuuidFromString(convid) }, { raw: true, allow_filtering: true }, function(err, files) {
            if (err) reject({ status: false, error: err });
            for (var i = 0; i < files.length; i++) {
                allfiles.push({
                    acl: files[i].acl,
                    bucket: files[i].bucket,
                    mimetype: files[i].file_type,
                    mimetype: files[i].file_type,
                    key: files[i].key,
                    originalname: files[i].originalname,
                    size: files[i].file_size,
                    msg_id: files[i].msg_id
                });
            }
            resolve(allfiles);
        });
    });
}

var deleteconvMessage = (data, callback) => {
    models.instance.Messages.delete({ conversation_id: models.uuidFromString(data.conversation_id) }, function(err, result) {
        if (err) {
            console.log(3556, err);
            callback({ status: false });
        } else {
            callback({ status: true });
        }
    })
}

var issueAssignMsg = (data, callback) => {
    models.instance.Messages.findOne({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var newmsg = result;
            newmsg.msg_id = models.timeuuid();
            newmsg.assign_to = data.assign_to;
            newmsg.created_at = data.created_at;

            models.instance.Messages.delete({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(e1, r1) {
                if (e1) {
                    console.log(3632, e1);
                } else {
                    new models.instance.Messages(newmsg).save(function(err2, result2) {
                        if (err) {
                            callback({ status: false, err: err });
                        } else {
                            callback({ status: true, msg: newmsg });
                        }
                    })
                }
            })



        }
    });

    // models.instance.Messages.update({msg_id: models.timeuuidFromString(data.msg_id),conversation_id:models.uuidFromString(data.conversation_id)}, {assign_to:data.assign_to},update_if_exists, function(err, result){
    //    if(err){
    //      callback({status:false,err:err});
    //    }else{
    //      callback({status:true,data:data});
    //    }
    //  });
}
var clear_all_deleted_msg = (data, callback) => {
    var query = {
        conversation_id: models.uuidFromString(data.conversation_id),
        has_delete: { $contains: data.user_id }
        // has_hide:{$contains:data.user_id}
    }
    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(err, res) {
        if (err) {
            console.log(4024, err);
        } else {
            var allMsgIds = [];
            _.each(res, function(v, k) {
                if (v.has_hide == null) {
                    v.has_hide = [];
                }
                if (v.has_hide.indexOf(data.user_id) == -1) {
                    allMsgIds.push(v.msg_id.toString());

                }
            });

            var mqueries = [];
            _.each(allMsgIds, function(v, k) {
                var update_query = models.instance.Messages.update({ msg_id: models.timeuuidFromString(v), conversation_id: models.uuidFromString(data.conversation_id) }, { has_hide: { $add: [data.user_id] } }, { if_exists: true, return_query: true });
                mqueries.push(update_query);
            });

            models.doBatch(mqueries, function(err) {
                if (err) { throw err; } else {
                    callback({ status: true, allMsgIds: allMsgIds });
                }
            });

        }
    })
}

var Filter_Conv_Last_Time = (data, callback) => {
    var conversation_list = [];
    var callBackconversation = [];
    var callBackmsg = [];
    var alreadypushed = [];
    var filterPC = [];

    _.each(data.conversation_list, function(v, k) {
        conversation_list.push(models.timeuuidFromString(v));
    })
    var query = {
        conversation_id: { $in: conversation_list }
    };
    if (data.allFilteredItem.indexOf('flag') > -1) {
        query.has_flagged = { $contains: data.user_id };
    }

    models.instance.Conversation.find({ conversation_id: { $in: conversation_list } }, { raw: true, allow_filtering: true }, function(err2, result2) {
        if (err2) {
            console.log('message js 5727', err2)
        } else {
            result2 = _.orderBy(result2, ['last_msg_time'], ['desc']);
            models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(err, result) {
                if (err) {
                    console.log(1850, err);
                } else {
                    _.each(result, function(v, k) {
                        if (v.has_delete == null) {
                            v.has_delete = [];
                        }
                        if (v.has_hide == null) {
                            v.has_hide = [];
                        }
                        if (v.has_flagged == null) {
                            v.has_flagged = [];
                        }

                        if (v.msg_type != 'notification' && v.msg_type != 'call' && v.has_delete.indexOf(data.user_id) == -1 && v.has_delete.indexOf('delete_for_all') == -1 && v.has_hide.indexOf(data.user_id) == -1) {
                            var flaged = false;
                            var checklist = false;
                            if (data.allFilteredItem.indexOf('flag') != -1) {
                                flaged = true;
                                // if (data.allFilteredItem.length > 1) {
                                checklist = true;
                                // }
                            } else {
                                checklist = true;
                            }
                            _.each(data.allFilteredItem, function(va, ka) {
                                if (v.has_flagged == null) {
                                    v.has_flagged = [];
                                }
                                if (v.tag_list == null) {
                                    v.tag_list = [];
                                }
                                if (flaged && checklist) {
                                    if (v.has_flagged.indexOf(data.user_id.toString()) > -1 && v.msg_type == 'checklist') {
                                        if (callBackconversation.indexOf(v.conversation_id.toString()) == -1) {
                                            callBackconversation.push(v.conversation_id.toString());
                                        }
                                        if (alreadypushed.indexOf(v.msg_id.toString()) == -1) {
                                            callBackmsg.push(v);
                                            alreadypushed.push(v.msg_id.toString());
                                        }

                                        if (filterPC.indexOf(v.msg_id) == -1) {
                                            filterPC.push(v.msg_id);
                                        }
                                    } else if (v.has_flagged.indexOf(data.user_id.toString()) > -1) {
                                        if (callBackconversation.indexOf(v.conversation_id.toString()) == -1) {
                                            callBackconversation.push(v.conversation_id.toString());
                                        }
                                        if (alreadypushed.indexOf(v.msg_id.toString()) == -1) {
                                            callBackmsg.push(v);
                                            alreadypushed.push(v.msg_id.toString());
                                        }
                                    }
                                    console.log('****** Checklist && Flagged True *****')

                                } else if (flaged) {
                                    if (v.has_flagged.indexOf(data.user_id.toString()) > -1) {
                                        if (callBackconversation.indexOf(v.conversation_id.toString()) == -1) {
                                            callBackconversation.push(v.conversation_id.toString());
                                        }
                                        if (alreadypushed.indexOf(v.msg_id.toString()) == -1) {
                                            callBackmsg.push(v);
                                            alreadypushed.push(v.msg_id.toString());
                                        }
                                    }
                                } else if (checklist) {
                                    console.log('****** Checklist True *****')
                                    var f = false;
                                    if (data.allFilteredItem.indexOf('flagged_checklist') !== -1) {
                                        f = true;
                                    }
                                    if (v.msg_type == 'checklist') {
                                        if (data.allFilteredItem.indexOf('pending_checklist') !== -1) {
                                            if (filterPC.indexOf(v.msg_id) == -1) {
                                                filterPC.push(v.msg_id);
                                            }
                                        }
                                        if (callBackconversation.indexOf(v.conversation_id.toString()) == -1) {
                                            if (f) {
                                                if (v.has_flagged.indexOf(data.user_id.toString()) > -1) {
                                                    callBackconversation.push(v.conversation_id.toString());
                                                }
                                            } else {
                                                callBackconversation.push(v.conversation_id.toString());
                                            }

                                        }
                                        if (alreadypushed.indexOf(v.msg_id.toString()) == -1) {
                                            callBackmsg.push(v);
                                            alreadypushed.push(v.msg_id.toString());
                                        }
                                    }
                                }
                                // if(va == 'flag'){
                                //   if(v.has_flagged != null){
                                //     if(v.has_flagged.indexOf(data.user_id.toString()) >-1){
                                //       if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
                                //         callBackconversation.push(v.conversation_id.toString());
                                //       }
                                //       if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
                                //         callBackmsg.push(v);
                                //         alreadypushed.push(v.msg_id.toString());
                                //       }
                                //     }
                                //   }
                                // }else{
                                //   if(v.tag_list != null){
                                //     if(v.tag_list.indexOf(va) > -1){
                                //       if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
                                //         callBackconversation.push(v.conversation_id.toString());
                                //       }
                                //       if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
                                //         callBackmsg.push(v);
                                //         alreadypushed.push(v.msg_id.toString());
                                //       }
                                //     }
                                //   }
                                // }
                            });
                        }
                    });
                    if (filterPC.length > 0) {
                        var cquery = {
                            msg_id: { $in: filterPC }
                        };
                        var all_pending_C = [];
                        var all_Comp_C = [];
                        models.instance.MessageChecklist.find(cquery, { raw: true, allow_filtering: true }, function(err1, result1) {
                            if (err1) {
                                console.log(err1);
                            } else {
                                // var checklistItem = [];
                                // _.each(filterPC, function(v, k) {
                                //     _.each(result1, function(va, ka) {
                                //         if (v == va.msg_id) {
                                //             if(checklistItem.indexOf(v) == -1){
                                //                 checklistItem.push(v);
                                //                 console.log(k, v);
                                //             }
                                //         }
                                //     });
                                // });
                                // _.each(result1, function(v, k) {
                                // if (v.checklist_status == 1) {
                                //     if (all_pending_C.indexOf(v.msg_id.toString()) == -1) {
                                //         all_Comp_C.push(v.msg_id.toString());
                                //     }

                                // }

                                // if (v.checklist_status == 0) {

                                //     if (all_pending_C.indexOf(v.msg_id.toString()) == -1) {
                                //         //  console.log(4248,all_pending_C)
                                //         all_pending_C.push(v.msg_id.toString());
                                //     }
                                //     removeA(all_Comp_C, v.msg_id.toString());
                                // }

                                // if (k == (result1.length - 1)) {
                                //     var cbconv = [];
                                //     _.each(callBackmsg, function(v, k) {
                                //         if (all_pending_C.indexOf(v.msg_id.toString()) != -1) {
                                //             if (cbconv.indexOf(v.conversation_id.toString()) == -1) {
                                //                 cbconv.push(v.conversation_id.toString());
                                //             }
                                //         }
                                //         if (callBackconversation.indexOf(v.conversation_id.toString()) == -1) {
                                //             removeA(cbconv, v.conversation_id.toString());
                                //         }
                                //     })
                                //     callback({ status: true, data: { callBackconversation: cbconv, callBackmsg: callBackmsg,conv_data:result2, checklist: result1 } });
                                // }
                                // })
                                callback({ status: true, data: { callBackconversation: callBackconversation, callBackmsg: callBackmsg, conv_data: result2, checklist: result1 } });
                            }
                        });
                    } else {
                        callback({ status: true, data: { callBackconversation: callBackconversation, callBackmsg: callBackmsg, conv_data: result2, checklist: false } });
                    }
                    // callback({status:true,data:{callBackconversation:callBackconversation,callBackmsg:callBackmsg}});
                }
            })
        }
    })
}

// var Filter_Conv_Last_Time = (data,callback)=>{
//   var conversation_list = [];
//   var callBackconversation = [];
//   var callBackmsg = [];
//   var alreadypushed = [];
//   var filterPC = [];

//   _.each(data.conversation_list,function(v,k){
//     conversation_list.push(models.timeuuidFromString(v));
//   })
//   var query = {
//         conversation_id: {$in: conversation_list}
//     };
//     models.instance.Messages.find(query,{ raw: true, allow_filtering: true },function(err,result){
//       if(err){
//         console.log(1850,err);
//       }else{
//        _.each(result,function(v,k){
//          if(v.has_delete == null){
//            v.has_delete = [];
//          }
//          if(v.has_hide == null){
//            v.has_hide = [];
//          }
//          if(v.has_flagged == null){
//            v.has_flagged = [];
//          }

//          if(v.msg_type != 'notification' && v.msg_type != 'call' && v.has_delete.indexOf(data.user_id) == -1 && v.has_delete.indexOf('delete_for_all') == -1 && v.has_hide.indexOf(data.user_id) == -1){
//            var flaged = false;
//            var checklist = false;
//            if(data.allFilteredItem.indexOf('flag') != -1){
//              flaged = true;
//              if(data.allFilteredItem.length > 1){
//                checklist = true;
//              }
//            }else{
//              checklist = true;
//            }
//            _.each(data.allFilteredItem,function(va,ka){
//              if(v.has_flagged == null){
//                v.has_flagged = [];
//              }
//              if(v.tag_list == null){
//                v.tag_list = [];
//              }
//              if(flaged && checklist){
//                if(v.has_flagged.indexOf(data.user_id.toString()) >-1 && v.msg_type == 'checklist'){
//                  if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                    callBackconversation.push(v.conversation_id.toString());
//                  }
//                  if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
//                    callBackmsg.push(v);
//                    alreadypushed.push(v.msg_id.toString());
//                  }
//                }

//              }else if(flaged){
//                if(v.has_flagged.indexOf(data.user_id.toString()) >-1){
//                  if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                    callBackconversation.push(v.conversation_id.toString());
//                  }
//                  if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
//                    callBackmsg.push(v);
//                    alreadypushed.push(v.msg_id.toString());
//                  }
//                }
//              }else if(checklist){
//                var f = false;
//                if(data.allFilteredItem.indexOf('flagged_checklist') !== -1){
//                  f = true;
//                }
//                if(v.msg_type == 'checklist'){
//                  if(data.allFilteredItem.indexOf('pending_checklist') !== -1){
//                    if(filterPC.indexOf(v.msg_id) == -1){
//                      filterPC.push(v.msg_id);
//                    }
//                  }
//                  if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                    if(f){
//                      if(v.has_flagged.indexOf(data.user_id.toString()) > -1){
//                        callBackconversation.push(v.conversation_id.toString());
//                      }
//                    }else{
//                      callBackconversation.push(v.conversation_id.toString());
//                    }

//                  }
//                  if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
//                    callBackmsg.push(v);
//                    alreadypushed.push(v.msg_id.toString());
//                  }
//                }
//              }
//                // if(va == 'flag'){
//                //   if(v.has_flagged != null){
//                //     if(v.has_flagged.indexOf(data.user_id.toString()) >-1){
//                //       if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                //         callBackconversation.push(v.conversation_id.toString());
//                //       }
//                //       if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
//                //         callBackmsg.push(v);
//                //         alreadypushed.push(v.msg_id.toString());
//                //       }
//                //     }
//                //   }
//                // }else{
//                //   if(v.tag_list != null){
//                //     if(v.tag_list.indexOf(va) > -1){
//                //       if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                //         callBackconversation.push(v.conversation_id.toString());
//                //       }
//                //       if(alreadypushed.indexOf(v.msg_id.toString()) == -1){
//                //         callBackmsg.push(v);
//                //         alreadypushed.push(v.msg_id.toString());
//                //       }
//                //     }
//                //   }
//                // }
//            });
//          }
//        });
//        if(filterPC.length > 0){
//          var cquery = {
//                msg_id: {$in: filterPC}
//            };
//            var all_pending_C = [];
//            var all_Comp_C = [];
//            models.instance.MessageChecklist.find(cquery,{ raw: true, allow_filtering: true },function(err1,result1){
//              if(err1){
//                console.log(err1);
//              }else{
//                _.each(result1,function(v,k){
//                  if(v.checklist_status == 1){
//                    if(all_pending_C.indexOf(v.msg_id.toString()) == -1){
//                      all_Comp_C.push(v.msg_id.toString());
//                    }

//                  }
//                 //  console.log(4248,(v.checklist_status == 0))
//                  if(v.checklist_status == 0){

//                    if(all_pending_C.indexOf(v.msg_id.toString()) == -1){
//                     //  console.log(4248,all_pending_C)
//                      all_pending_C.push(v.msg_id.toString());
//                    }
//                    removeA(all_Comp_C,v.msg_id.toString());
//                  }
//                  if(k == (result1.length - 1)){
//                    var cbconv = [];
//                    _.each(callBackmsg,function(v,k){
//                      if(all_pending_C.indexOf(v.msg_id.toString()) != -1){
//                        if(cbconv.indexOf(v.conversation_id.toString()) == -1){
//                          cbconv.push(v.conversation_id.toString());
//                        }
//                      }
//                      if(callBackconversation.indexOf(v.conversation_id.toString()) == -1){
//                        removeA(cbconv,v.conversation_id.toString());
//                      }
//                    })
//                    callback({status:true,data:{callBackconversation:cbconv,callBackmsg:callBackmsg}});
//                  }
//                })
//              }
//            });
//        }else{
//          callback({status:true,data:{callBackconversation:callBackconversation,callBackmsg:callBackmsg}});
//        }
//        // callback({status:true,data:{callBackconversation:callBackconversation,callBackmsg:callBackmsg}});
//       }
//     })

// }

function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
// {msg_id:models.timeuuidFromString(data.msg_id),checklist_id:models.timeuuidFromString(data.checklist_id)},update_query,update_if_exists
function update_checklist_time(data, callback) {
    console.log('update_checklist_time', data);
    var update_query = {
        request_ttl_date: data.request_ttl_date,
        request_ttl_message: data.request_ttl_message,
        request_ttl_time: data.request_ttl_time,
        Request_ttl_by: data.Request_ttl_by,
        assign_decline_note: data.assign_decline_note,
        request_ttl_approved_by: data.request_ttl_approved_by,
        request_ttl_approved_date: data.request_ttl_approved_date,
        assign_to: data.assign_to,
        alternative_assign_to: data.alternative_assign_to,
        last_action: data.alternative_assign_to != null ? data.alternative_assign_to : data.assign_to,
        end_due_date: data.end_due_date,
        privacy: data.privacy,
        assign_status: data.assign_status,
        assignedby: data.assignedby,
        last_updated_at: new Date().getTime(),
        last_updated_by: data.assignedby
    }
    console.log(50222, update_query)
    try {
        models.instance.MessageChecklist.update({ checklist_id: models.timeuuidFromString(data.checklist_id), msg_id: models.timeuuidFromString(data.msg_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(5911, err);
                throw err;
            } else {
                callback({ status: true, result: result });
            }
        })
    } catch (e) {
        console.log(5911, e);
        callback({ status: false, error: e });
    }
}

function update_checklist_time_multi(data, callback) {
    try {
        models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var mqueries = [];

                _.each(result, function(v, k) {
                    var update_query = models.instance.MessageChecklist.update({ checklist_id: models.timeuuidFromString(v.checklist_id.toString()), msg_id: models.timeuuidFromString(v.msg_id.toString()) }, { assign_to: data.assign_to, last_action: data.assign_to, assignedby: data.assignedby, assign_status: data.assign_status, end_due_date: data.end_due_date, privacy: data.privacy }, { if_exists: true, return_query: true });
                    mqueries.push(update_query);
                });

                models.doBatch(mqueries, function(err) {
                    if (err) { console.log(522, err); } else {
                        callback({ status: true, data: data });
                    }
                });
            }
        })
    } catch (e) {
        console.log("error into update_checklist_time_multi", e);
    }
}

function get_flagged_msg_only(data, callback) {
    console.log(4413, data);
    if (data.conversation_id == 'noid') {
        data.conversation_id = data.user_id;
    }
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id.toString()), has_flagged: { $contains: data.user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            callback({ status: true, data: result });
        }
    })
}

function convertTask(io, socket, data, callback) {
    var msg_id = models.timeuuid();
    var conversation_id = models.uuidFromString(data.conversation_id);
    var msg_body = 'Converted Checklist';
    var user_id = models.uuidFromString(data.user_id);
    var sender_name = data.sender_name;
    var sender_img = data.sender_img;
    sendNewMsgTempp(io, socket, [], msg_id, msg_body, [], [], [], [], user_id, sender_name, sender_img, conversation_id, null, 'checklist', null, null, null, [], 0, null, [], data.msg_body, [], [], [], [], null, null, null, null, function(cbresult) {
        // console.log(4471,cbresult);
        if (cbresult.status) {
            var ndata = {
                checklist_id: models.timeuuid(),
                msg_id: msg_id,
                msg_title: msg_body,
                created_by: user_id,
                checklist_title: data.msg_body
            }
            var messageChecklist = new models.instance.MessageChecklist(ndata);
            messageChecklist.saveAsync()
                .then(function(res) {
                    ndata['created_at'] = moment().format();
                    ndata['end_due_date'] = null;
                    // ndata['last_action'] = null; 
                    ndata['last_edited_at'] = null;
                    ndata['last_edited_by'] = null;
                    ndata['last_updated_at'] = null;
                    ndata['last_updated_by'] = null;
                    ndata['privacy'] = null;
                    ndata['start_due_date'] = null;
                    ndata['checklist_status'] = 0;
                    ndata['review_status'] = 0;

                    io.to(conversation_id.toString()).emit('newMessage', { status: true, checklist: [ndata], unreadChecklist: true, msg: cbresult.msg });
                    // send_msg_firebase(conversation_id.toString(),{status:true,checklist:[ndata],unreadChecklist:true,msg:cbresult.msg},'newMessage');
                }).catch(function(err) {
                    console.log(err);
                })
        }
    });

}

function checkHasFileinMsg(data) {
    var returnRes = false;
    if (data.attch_audiofile == null) {
        returnRes = false;
    } else if (data.attch_audiofile.length > 0) {
        return true;
    }
    if (data.attch_imgfile == null) {
        returnRes = false;
    } else if (data.attch_imgfile.length > 0) {
        return true;
    }
    if (data.attch_otherfile == null) {
        returnRes = false;
    } else if (data.attch_otherfile.length > 0) {
        return true;
    }
    if (data.attch_videofile == null) {
        returnRes = false;
    } else if (data.attch_videofile.length > 0) {
        return true;
    }
    return false;
}

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

function getOnlyU_T(o, n, r) {
    if (o == null) {
        o = [];
    }
    if (n == null) {
        n = [];
    }
    if (r == null) {
        r = [];
    }
    var re = [];
    var arr = arrayUnique(o.concat(n));
    for (var i = 0; i < arr.length; i++) {
        if (r.indexOf(arr[i]) == -1) {
            re.push(arr[i]);
        }
    }
    return re;

}

function onlyOneMessageData(msg_id, conversation_id) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.findOne({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id) }, function(err, result) {
            if (err) {
                resolve({ status: false, result: null });
            } else {
                resolve({ status: true, result: result });
            }
        });
    });
}

function getFilesForTag(msg_id) {
    return new Promise((resolve, reject) => {
        models.instance.File.find({ msg_id: models.timeuuidFromString(msg_id) }, { raw: true, allow_filtering: true }, function(err, result) {
            if (err) {
                resolve({ status: false, result: null });
            } else {
                resolve({ status: true, result: result });
            }
        });
    });
}
async function updateOneMsgForTag(msg_id, conversation_id, tag_list, user_tag_string, callback, file = false, all_qu = [], responseFile = []) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.update({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id) }, { tag_list: tag_list, user_tag_string: user_tag_string }, update_if_exists, function(err, result) {
            if (err) {
                resolve(callback({ status: false }));
            } else {
                if (file) {
                    models.doBatch(all_qu, function(err2, result2) {
                        if (err2) {
                            resolve(callback({ status: false }));
                        } else {
                            resolve(callback({ status: true, all_files: responseFile }));
                        }
                    });
                } else {
                    resolve(callback({ status: true }));
                }
            }
        })
    })
}

//This function for add and remove tag in message. When this message has a file, then file tag(s) automatically is updated.
async function updateMsg_tag_emit(data, callback) {
    var msgdata = await onlyOneMessageData(data.msg_id, data.conversation_id);
    if (msgdata.result != null) {
        if (checkHasFileinMsg(msgdata.result)) {
            var all_f = await getFilesForTag(data.msg_id);
            if (all_f.result != null) {
                var all_qu = [];
                var responseFile = [];
                for (var i = 0; i < all_f.result.length; i++) {
                    let tag_list = getOnlyU_T(all_f.result[i].tag_list, data.tag_list, data.removetag);
                    let uq = models.instance.File.update({ id: all_f.result[i].id }, { tag_list: tag_list }, { return_query: true });
                    all_qu.push(uq);
                    all_f.result[i].tag_list = tag_list;
                    responseFile.push(all_f.result[i]);

                }
                var tag_list = getOnlyU_T(msgdata.result.tag_list, data.tag_list, data.removetag);
                await updateOneMsgForTag(data.msg_id, data.conversation_id, tag_list, data.user_tag_string, callback, file = true, all_qu, responseFile);
            }

        } else {
            var tag_list = getOnlyU_T(msgdata.result.tag_list, data.tag_list, data.removetag);
            await updateOneMsgForTag(data.msg_id, data.conversation_id, tag_list, data.user_tag_string, callback);
        }
    }

}

function getOneChecklistData(data, callback) {
    models.instance.MessageChecklist.findOne({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            callback({ status: true, data: result });
        }
    })
}

function saveNewChecklistMsg(data, callback) {
    // console.log('saveNewChecklistMsg', data.conv.participants);
    try {
        var queries = [];
        var msg_id = models.timeuuid();
        var msgdata = {
                msg_id: msg_id,
                msg_body: data.msg_body.toString(),
                sender: models.uuidFromString(data.user_id),
                sender_name: data.fullname,
                sender_img: data.user_img,
                conversation_id: models.uuidFromString(data.conversation_id),
                msg_type: 'checklist',
                msg_text: data.msg_body.toString(),
                msg_status: data.conv.participants
            }
            // console.log(6063)
        let mq = new models.instance.Messages(msgdata);
        queries.push(mq.save({ return_query: true }));
        // console.log(6066)
        var checklist = [];
        _.each(data.items, function(v, k) {
            // console.log(6069)
            var item = {
                    checklist_id: models.timeuuid(),
                    msg_id: msg_id,
                    msg_title: data.msg_body.toString(),
                    created_by: models.uuidFromString(data.user_id),
                    checklist_title: v.checklist_title,
                    convid: data.conversation_id,
                    created_at: new Date().getTime()
                }
                // console.log(6079)
            if (v.end_due_date != undefined) {
                item.end_due_date = v.end_due_date;
                item.assign_to = v.assign_to;
                item.last_action = v.assign_to;
                item.assignedby = data.user_id;
                item.assign_status = data.user_id;
                item.privacy = 'Public';
                item.request_repetition = 0;
            }
            // console.log(6089)
            let mq = new models.instance.MessageChecklist(item);
            queries.push(mq.save({ return_query: true }));
            checklist.push(item);
            // console.log(6093)
        });
        // console.log(6095)
        models.doBatch(queries, function(err) {
            if (err) { console.log('error in batch query '); throw err; } else {
                // console.log(6099)
                models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: msg_id }, { raw: true }, function(error, msg) {
                    if (error) { console.log('error in message find'); throw error; }
                    models.instance.MessageChecklist.find({ msg_id: msg_id }, { raw: true }, function(err, checklist_items) {
                        if (err) { console.log('error in message checklist find'); throw err; }
                        msg[0].checklist = checklist_items;
                        update_conversation(models.uuidFromString(data.conversation_id), msg[0]);
                        callback({ status: true, msg: msg[0], checklist: checklist_items });
                    });
                });
            }
        });
    } catch (e) {
        callback({ status: false, error: e });
    }
}

function saveAndCancelChecklist(data, callback) {
    try {
        models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, async function(error, msg) {
            if (error) { console.log('error in message find'); throw error; } else {
                if (msg[0].has_reply > 0) {
                    // console.log(6122)
                    var rep_info = await old_reply_msg_id(data);
                    if (!rep_info.status) msg[0].has_reply = 0;
                    // console.log(6124, rep_info.rep_id);
                }
                // console.log(6126);
                models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id), $orderby: { '$asc': 'checklist_id' } }, function(err, checklist_items) {
                    if (err) { console.log('error in message checklist find'); throw err; } else {
                        var queries = [];
                        var new_msg_id = models.timeuuid();
                        // console.log(6031, new_msg_id);
                        /**
                         * All checklist item save in this each loop
                         */
                        _.each(checklist_items, function(v, k) {
                            v.checklist_id = models.timeuuid();
                            v.msg_id = new_msg_id;
                            // console.log(6038, v.msg_id);

                            let q = new models.instance.MessageChecklist(v);
                            let save_query = q.save({ return_query: true });
                            queries.push(save_query);
                        });

                        /**
                         * New message same in this block
                         */
                        msg[0].msg_id = new_msg_id;
                        msg[0].last_update_user = models.uuidFromString(data.sender);
                        msg[0].last_update_time = new Date().getTime();
                        msg[0].created_at = new Date().getTime();
                        // console.log(6049);
                        let mq = new models.instance.Messages(msg[0]);
                        let save_query2 = mq.save({ return_query: true });
                        queries.push(save_query2);

                        /**
                         * Check old message has reply or not
                         * if yes then update the reply table as well
                         */
                        // console.log(6156, msg[0].has_reply)
                        if (msg[0].has_reply > 0) {
                            var new_rep_data = {
                                conversation_id: models.uuidFromString(data.conversation_id),
                                msg_id: new_msg_id,
                                rep_id: rep_info.rep_id
                            };
                            /**
                             * Delete old reply id
                             */
                            let drdata = models.instance.ReplayConv.delete({ msg_id: models.timeuuidFromString(data.msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, { return_query: true });
                            queries.push(drdata);

                            let replyData = new models.instance.ReplayConv(new_rep_data);
                            let save_query = replyData.save({ return_query: true });
                            queries.push(save_query);
                            // console.log(6178)
                        }

                        /**
                         * Delete block
                         * First delete the message
                         * then delete the checklist item
                         */
                        let delete_msg = models.instance.Messages.delete({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, { return_query: true });
                        queries.push(delete_msg);

                        let delete_chk_items = models.instance.MessageChecklist.delete({ msg_id: models.timeuuidFromString(data.msg_id) }, { return_query: true });
                        queries.push(delete_chk_items);
                        // console.log(6191)
                        models.doBatch(queries, function(err) {
                            if (err) { console.log('error in batch query '); throw err; } else {
                                msg[0].checklist = checklist_items;
                                update_conversation(models.uuidFromString(data.conversation_id), msg[0]);
                                callback({ status: true, old_msg_id: data.msg_id, msg: msg[0], checklist: checklist_items });
                            }
                        });
                    }
                });
            }
        });
    } catch (e) {
        callback({ status: false, error: e });
    }
}

function old_reply_msg_id(data) {
    return new Promise((resolve, reject) => {
        models.instance.ReplayConv.findOne({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, function(err, rep_data) {
            if (err) reject({ status: false, error: err });
            resolve({ status: true, rep_id: rep_data.rep_id });
        });
    });
}

function getOneChecklistMsg(data, callback) {
    models.instance.Messages.findOne({ msg_id: models.timeuuidFromString(data.msg_id), conversation_id: models.uuidFromString(data.conversation_id) }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            models.instance.MessageChecklist.find({ msg_id: models.timeuuidFromString(data.msg_id) }, function(err2, result2) {
                    if (err2) {
                        console.log(err2);
                    } else {
                        callback({ status: true, msg: result, checklist: result2 });
                    }
                })
                // callback({status:true,data:result});
        }
    })
}

function complete_old_checklist(data) {
    try {
        _.forEach(data, function(v, k) {
            models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(v.msg_id), checklist_id: models.timeuuidFromString(v.checklist_id) }, { checklist_status: 1 }, update_if_exists, function(err) {
                if (err) throw err;
            });
        });
    } catch (e) {
        console.log("error in complete_old_checklist", e);
    }
}

function manage_checklist(data, callback) {
    if (data.type == 'request') {
        var update_query = {
            request_ttl_date: data.request_ttl_date,
            request_ttl_message: data.request_ttl_message,
            request_ttl_time: data.request_ttl_time.toString(),
            Request_ttl_by: data.Request_ttl_by,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'cancel_request') {
        var update_query = {
            request_ttl_date: data.request_ttl_date,
            request_ttl_message: data.request_ttl_message,
            request_ttl_time: data.request_ttl_time,
            Request_ttl_by: data.Request_ttl_by,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'accept') {
        console.log('request_ttl_approved_date = ', data.request_ttl_approved_date)
        var update_query = {
            assign_status: "2",
            request_ttl_date: data.request_ttl_date,
            request_ttl_message: data.request_ttl_message,
            request_ttl_time: data.request_ttl_time,
            Request_ttl_by: data.Request_ttl_by,
            request_repetition: data.request_repetition,
            request_ttl_approved_by: data.request_ttl_approved_by,
            request_ttl_approved_date: data.request_ttl_approved_date,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }

        try {
            models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback({ status: true, data: result });
                }
            })
        } catch (e) {
            console.log("message js line 6394");
            callback({ status: false, error: e });
        }

    } else if (data.type == 'assigneeChange') {
        var update_query = {
            request_ttl_date: data.request_ttl_date,
            request_ttl_message: data.request_ttl_message,
            request_ttl_time: data.request_ttl_time,
            Request_ttl_by: data.Request_ttl_by,
            request_ttl_approved_by: data.request_ttl_approved_by,
            request_ttl_approved_date: data.request_ttl_approved_date,
            alternative_assign_to: data.alternative_assign_to,
            last_action: data.alternative_assign_to,
            assignee_change_reason: data.assignee_change_reason,
            assign_status: data.assign_status,
            assignedby: data.assignedby,
            end_due_date: data.end_due_date.toString(),
            last_updated_at: new Date().getTime(),
            last_updated_by: data.assignedby
        }
        console.log(50222, update_query)
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'duedate_change_creator') {
        try {
            var query = {
                msg_id: models.timeuuidFromString(data.msg_id),
                checklist_id: models.timeuuidFromString(data.checklist_id)
            };
            var update_query = {
                assign_status: null,
                end_due_date: data.end_due_date.toString()
            }
            console.log(5105, update_query);
            console.log(5105, data)

            models.instance.MessageChecklist.find(query, function(error, result) {
                if (error) callback({ status: false, error });
                else {
                    if (result.length == 1) {
                        models.instance.MessageChecklist.update(query, update_query, function(err) {
                            if (err) callback({ status: false, error: err });
                            models.instance.MessageChecklist.find(query, function(error, result2) {
                                if (error) callback({ status: false, error });
                                callback({ status: true, data: result2 });
                            });
                        });
                    } else {
                        callback({ status: false, error: "no data found" });
                    }
                }
            });
        } catch (e) {
            console.log("error into duedate_change_creator ", e);
        }
    } else if (data.type == 'cancel') {
        var update_query = {
            request_ttl_date: data.request_ttl_date,
            request_ttl_message: data.request_ttl_message,
            request_ttl_time: data.request_ttl_time,
            Request_ttl_by: data.Request_ttl_by
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'Decline') {
        var update_query = {
            assign_status: data.assign_status,
            assign_decline_note: data.assign_decline_note,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'cancel_decline') {
        var update_query = {
            assign_status: data.assign_status,
            assign_decline_note: data.assign_decline_note,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'assign_accept') {
        var update_query = {
            assign_status: data.assign_status,
            assign_decline_note: data.assign_decline_note,
            last_update_by: data.last_update_by,
            last_updated_at: data.last_updated_at
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'assign_accept_ar') {
        var ids = new Set();
        _.forEach(data.checklist_id, function(val, k) {
            ids.add(models.timeuuidFromString(val));
        });
        var items = Array.from(ids);
        var update_query = {
            assign_status: data.assign_status,
            assign_decline_note: data.assign_decline_note
        }
        var query = {
            msg_id: models.timeuuidFromString(data.msg_id),
            checklist_id: { '$in': items }
        }
        models.instance.MessageChecklist.update(query, update_query, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        });
    } else if (data.type == 'Delete') {
        models.instance.MessageChecklist.delete({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'complete_review') {
        var update_query = {
            review_status: data.review_status
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    } else if (data.type == 'recheck') {
        if (data.checklist_status == NaN) {
            data.checklist_status = 0
        }
        var update_query = {
            review_status: data.review_status,
            checklist_status: data.checklist_status
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        })
    }
}

function removeItem(data, callback) {
    var ids = new Set();
    _.forEach(data.removeItem, function(val, k) {
        ids.add(models.timeuuidFromString(val));
    });
    var items = Array.from(ids);
    var query = {
        msg_id: models.timeuuidFromString(data.msg_id),
        checklist_id: { '$in': items }
    };
    models.instance.MessageChecklist.delete(query, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            callback({ status: true, data: result });
        }
    });
}

function add_chk_item(data, callback) {
    try {
        if (data.checklist_id === undefined) {
            var item = new models.instance.MessageChecklist({
                checklist_id: models.timeuuid(),
                msg_id: models.timeuuidFromString(data.msg_id),
                msg_title: data.msg_title,
                created_by: models.uuidFromString(data.user_id),
                checklist_title: data.chk_title,
                convid: data.convid,
                created_at: new Date().getTime(),
                checklist_status: 0,
                review_status: 0,
                end_due_date: null,
                // last_action:null,
                last_edited_at: null,
                last_edited_by: null,
                last_updated_at: null,
                last_updated_by: null,
                privacy: null,
                start_due_date: null,
            });

            item.saveAsync().then(function() {
                callback({ status: true, data: item, result: data });
            }).catch(function(err) {
                callback({ status: false, err: err });
            });
        } else {
            var update_query = {
                checklist_title: data.chk_title,
                last_updated_at: new Date().getTime(),
                last_updated_by: data.user_id
            };
            models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    models.instance.MessageChecklist.findOne({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, function(err, item) {
                        callback({ status: true, data: item, result: data });
                    });
                }
            });
        }
    } catch (e) {
        console.log(5433, "error in add new checklist item");
    }
}

function only_add_remove_assignee(data, callback) {
    console.log(5443, data)
    try {
        var update_query = {
            assign_to: data.type == 'add' ? data.user_id : null,
            last_action: data.type == 'add' ? data.user_id : null,
            assignedby: data.type == 'add' ? data.user_id : null,
            assign_status: data.type == 'add' ? data.user_id : null,
            end_due_date: data.type == 'add' ? new Date().getTime().toString() : null
        }
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback({ status: true, data: result });
            }
        });
    } catch (e) {
        console.log(5458, "error in only_add_remove_assignee", e);
    }
}

function update_checklist_process(data, callback) {
    console.log(5443, data)
    var curtime = new Date().getTime();
    var update_query = {
        last_updated_at: curtime,
        last_updated_by: data.user_id
    };
    data.last_updated_at = curtime;

    if (data.end_due_date !== undefined) data.end_due_date = (moment(data.end_due_date).unix() * 1000).toString();

    if (data.type == 'new_assignee') {
        update_query.assign_to = data.assign_to;
        update_query.last_action = data.assign_to;
        update_query.assignedby = data.user_id;
        update_query.assign_status = data.user_id;
        update_query.end_due_date = data.end_due_date;
        update_query.assign_decline_note = null;
    } else if (data.type == 'alternative_assign_to') {
        update_query.request_ttl_date = null;
        update_query.request_ttl_message = null;
        update_query.request_ttl_time = null;
        update_query.Request_ttl_by = null;
        update_query.assign_decline_note = null;
        update_query.alternative_assign_to = data.assign_to;
        update_query.last_action = data.assign_to;
        update_query.assignee_change_reason = data.assignee_change_reason;
        update_query.assign_status = data.user_id;
        update_query.assignedby = data.user_id;
        update_query.end_due_date = data.end_due_date;
        update_query.last_updated_at = curtime;
        update_query.last_updated_by = data.user_id;
    } else if (data.type == 'assign_accept') {
        update_query.assign_status = "2";
        update_query.assign_decline_note = null;
    } else if (data.type == 'request') {
        data.request_date = (moment(data.request_date).unix() * 1000).toString();
        update_query.request_ttl_date = curtime;
        update_query.request_ttl_message = data.request_note;
        update_query.request_ttl_time = data.request_date;
        update_query.Request_ttl_by = data.user_id;
    } else if (data.type == 'reject') {
        update_query.request_ttl_date = null;
        update_query.request_ttl_message = null;
        update_query.request_ttl_time = null;
        update_query.Request_ttl_by = null;
    } else if (data.type == 'decline') {
        update_query.assign_status = "1";
        update_query.assign_decline_note = data.decline_note;

        data.assign_status = 1;
    } else if (data.type == 'mark_complete') {
        update_query.checklist_status = Number(data.status);
    } else if (data.type == 'cancel_decline') {
        update_query.assign_status = data.assign_status;
        update_query.assign_decline_note = null;
    } else if (data.type == 'cancel_request') {
        update_query.request_ttl_date = null;
        update_query.request_ttl_message = null;
        update_query.request_ttl_time = null;
        update_query.Request_ttl_by = null;
    } else if (data.type == 'approve') {
        update_query.request_ttl_date = null;
        update_query.request_ttl_time = null;
        update_query.Request_ttl_by = null;
        update_query.assign_status = "2";
        update_query.request_repetition = data.request_repetition;
        update_query.request_ttl_approved_by = data.user_id;
        update_query.request_ttl_approved_date = data.request_ttl_approved_date;
    } else if (data.type == 'decline_approve') {
        update_query.assign_status = data.user_id;
        update_query.end_due_date = data.end_due_date;
    } else if (data.type == 'cancel_assignee') {
        update_query.assign_to = null;
        update_query.last_action = null;
        update_query.assignedby = null;
        update_query.assign_status = null;
        update_query.end_due_date = null;
        update_query.assign_decline_note = null;
    }

    try {
        models.instance.MessageChecklist.update({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, update_query, update_if_exists, function(err, result) {
            if (err) throw err;
            else callback({ status: true, data: data });
        });
    } catch (e) {
        console.log(5764, "error in update_checklist_process", e);
    }
}

function delete_checklist_item(data, callback) {
    if (data.type == "delete") {
        try {
            models.instance.MessageChecklist.delete({ msg_id: models.timeuuidFromString(data.msg_id), checklist_id: models.timeuuidFromString(data.checklist_id) }, function(err, result) {
                if (err) {
                    callback({ status: false, error: err });
                } else {
                    callback({ status: true, data: result });
                }
            });
        } catch (e) {
            callback({ status: false, error: e });
        }
    }
}

function chk_due_date_today(data, callback) {
    console.log(5470, data)
    try {
        var update_query = {
            created_at: new Date().getTime()
        }
        if (isUuid(data.conversation_id) && isUuid(data.msg_id)) {
            models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: models.timeuuidFromString(data.msg_id) }, update_query, update_if_exists, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback({ status: true, data: result });
                }
            });
        } else {
            callback({ status: false, error: "Invalid id" });
        }
    } catch (e) {
        callback({ status: false, error: e });
        console.log(5458, "error in chk_due_date_today", e);
    }
}

function findTeamChecklistData(data) {
    return new Promise((resolve, reject) => {
        models.instance.MessageChecklist.find({ convid: data.conversation_id, msg_title: data.title }, { allow_filtering: true, raw: true }, function(err, result) {
            if (err) {
                reject({ status: false });
            } else {
                resolve({ status: true, data: result });
            }
        })
    })
}

function getTeamTaskData(data) {
    return new Promise((resolve, reject) => {
        models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_body: data.title }, { allow_filtering: true, raw: true }, function(err, result) {
            if (err) {
                reject({ status: false });
            } else {
                resolve({ status: true, data: result });
            }
        })
    })
}

function deleteEmptyTeamTask(data, callback) {
    var query_object = {
        conversation_id: data.convid,
        msg_id: data.msg_id
    };
    models.instance.Messages.delete(query_object, function(err) {
        if (err) console.log(err);
        callback({ status: true, data: query_object });
    });
}

function all_unread_dataFun(data) {
    return new Promise((resolve, reject) => {
        count_unread(data.my_all_conv, data.user_id, function(res) {
            resolve(res);
        })
    })
}

function update_team_to_user(data, callback) {
    var tems = [];
    for (var i = 0; i < data.team_id.length; i++) {
        tems.push(models.timeuuidFromString(data.team_id[i]));
    }
    models.instance.Team.update({ team_id: { '$in': tems } }, { participants: { '$add': [data.user_id] } }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            callback({ status: true, result: result });
        }
    })
}

function readallmsgintoconv(data, callback) {
    // console.log(6768, data)
    models.instance.Messages.find({ conversation_id: models.uuidFromString(data.conversation_id), msg_status: { '$contains': data.user_id } }, { raw: true, allow_filtering: true }, function(err, result) {
        if (err) callback({ status: false, err });
        else {
            if (result.length > 0) {
                var msgids = new Set();
                _.forEach(result, function(v, k) {
                    msgids.add(v.msg_id);
                });
                var msgid_array = Array.from(msgids);

                models.instance.Messages.update({ conversation_id: models.uuidFromString(data.conversation_id), msg_id: { '$in': msgid_array } }, { msg_status: { $remove: [data.user_id] } }, function(err1) {
                    if (err1) callback({ status: false, err1 });
                    else callback({ status: true });
                });
            }
        }
    });
}
/* global */
// fb = 0;
async function send_msg_firebase(user_id, data, fcm_type, calling_data = false) {
    if (user_id && data) {
        var sender = '';
        if (data.msg.hasOwnProperty('sender')) { sender = String(data.msg['sender']); }
        if (sender != user_id) {
            // fb++;
            // console.log("========> Firebase:mute:", fb, user_id);
            models.instance.ConversationMute.find({ mute_by: models.uuidFromString(user_id), conversation_id: data.msg.conversation_id }, { raw: true, allow_filtering: true }, function(error, mute_conv) {
                if (error) {
                    console.trace(error);
                } else {
                    // console.log("========> Firebase:get_Mute:", fb, user_id);
                    let mute_status = false;
                    if (mute_conv && mute_conv.length > 0) {
                        for (let i = 0; i < mute_conv.length; i++) {
                            if (mute_conv[i].mute_day && mute_conv[i].mute_day.length) { // recursive pattern
                                var db_tz = mute_conv[i].mute_timezone;
                                if (db_tz) {
                                    var user_moment = moment().utcOffset(db_tz);
                                    var user_day = user_moment.format('ddd');
                                    if (mute_conv[i].mute_day.indexOf(user_day) > -1) { // today match
                                        var currentDate = user_moment.format('DD-MM-YYYY');
                                        var db_mute_start = mute_conv[i].mute_start_time;
                                        var db_mute_end = mute_conv[i].mute_end_time;
                                        var st = moment(currentDate + ' ' + db_mute_start + ' ' + db_tz, 'DD-MM-YYYY LT Z');
                                        var et = moment(currentDate + ' ' + db_mute_end + ' ' + db_tz, 'DD-MM-YYYY LT Z');
                                        if ((st.hour() >= 12 && et.hour() <= 12) || et.isBefore(st)) { et.add(1, "days"); }

                                        if (user_moment.isBetween(st, et)) {
                                            // if (mute_conv[i].show_notification == null) mute_conv[i].show_notification = false;
                                            // if (mute_conv[i].show_notification == false) 
                                            mute_status = true;
                                        }
                                    }
                                }
                            } else { // normal pattern
                                var now_unix = moment().unix();
                                var mute_start = parseInt(mute_conv[i].mute_unix_start);
                                var mute_end = parseInt(mute_conv[i].mute_unix_end);
                                if (now_unix > mute_start && now_unix < mute_end) {
                                    // if (mute_conv[i].show_notification == null) mute_conv[i].show_notification = false;
                                    // if (mute_conv[i].show_notification == false) 
                                    mute_status = true;
                                }
                            }
                            // data.show_notification = mute_conv[i].show_notification ? mute_conv[i].show_notification : false
                        }

                    }
                    // else {
                    data.show_notification = false;
                    // }
                    if (mute_status == false) {
                        // console.log("========> Firebase:user:", user_id);
                        models.instance.Users.findOne({ id: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
                            if (err) {
                                console.trace(err);

                            } else {
                                if (user && user.fcm_id) {
                                    let data2send = { fcm_type: fcm_type };
                                    var options = {
                                        priority: "high",
                                        timeToLive: 60 * 60 * 24,
                                        mutableContent: true,
                                        // contentAvailable: true
                                    }
                                    var sender_name = '';
                                    var msg_body = '';

                                    for (let ky in data) {
                                        if (data[ky] != null) {
                                            if (_.isString(data[ky])) {
                                                data2send[ky] = data[ky];
                                            } else {
                                                data2send[ky] = JSON.stringify(data[ky]);
                                                if (data[ky].hasOwnProperty('sender_name')) { sender_name = data[ky]['sender_name']; }
                                                if (data[ky].hasOwnProperty('msg_body')) { msg_body = data[ky]['msg_body']; }

                                            }
                                        }
                                    }

                                    if (data.conversation_type == 'single') {
                                        var notification_obj = {
                                            title: sender_name,
                                            body: msg_body
                                        }
                                    } else {
                                        var notification_obj = {
                                            title: data.conversation_title,
                                            body: sender_name + ': ' + msg_body
                                        }
                                    }
                                    var messages = [];
                                    for (let fid of user.fcm_id) {
                                        if (fid.includes('@@@')) { // fcm split token
                                            var device = fid.split('@@@')[0];
                                            var fcm_id = fid.split('@@@')[1];
                                            if (device == 'android') {
                                                // var message = {
                                                //     data: data2send
                                                // };

                                                if (fcm_id != 'null') {
                                                    messages.push({
                                                        data: data2send,
                                                        token: fcm_id,
                                                        "android": {
                                                            "priority": "high",
                                                            // "ttl":"86400s"
                                                        },
                                                    });
                                                }
                                            } else { // iOS
                                                // var message = {
                                                //     notification: notification_obj,
                                                //     data: data2send,
                                                //     // apns: {
                                                //     //     payload: {
                                                //     //         aps: {
                                                //     //             'category': 'VIEWORCANCEL'
                                                //     //         }
                                                //     //     }
                                                //     // },
                                                // };

                                                if (fcm_id != 'null') {
                                                    messages.push({
                                                        notification: notification_obj,
                                                        data: data2send,
                                                        token: fcm_id,
                                                        "apns": {
                                                            "headers": {
                                                                "apns-priority": "10",
                                                                //   "apns-expiration":"1604750400"
                                                            },
                                                            "payload": {
                                                                "aps": {
                                                                    "mutable-content": 1
                                                                }
                                                            },
                                                        },
                                                    });
                                                }
                                            }
                                        } else { // fcm direct token
                                            var fcm_id = fid;
                                            // var message = {
                                            //     notification: notification_obj,
                                            //     data: data2send,
                                            //     // "category" : "VIEWORCANCEL"
                                            // };

                                            messages.push({
                                                notification: notification_obj,
                                                data: data2send,
                                                token: fcm_id
                                            });
                                        }
                                        // if (fcm_id != 'null') {
                                        //     // console.log("========> Firebase:before_send:", user_id, fcm_id);
                                        //     firebase_admin.messaging().sendToDevice(fcm_id, message, options)
                                        //         .then(function(response) {
                                        //             console.log("========> Firebase:success_send:", user_id);
                                        //             // console.log("========> Firebase:Success:", user_id, fcm_id);
                                        //         })
                                        //         .catch(function(error) {
                                        //             console.trace("========> Firebase:Error:", message, error);
                                        //         });

                                        // }


                                    }
                                    if (messages.length) {
                                        firebase_admin.messaging().sendAll(messages)
                                            .then((response) => {
                                                console.log('firebase: '+user_id+' : '+response.successCount + ' messages were sent successfully');
                                            });
                                    }
                                }
                            }
                        });

                    }

                }


            });
        }
    }
}

module.exports = {
    generateMessage,
    sendNewMsg,
    sendBusyMsg,
    commit_msg_delete,
    flag_unflag,
    add_reac_emoji,
    view_reac_emoji_list,
    get_group_lists,
    update_msg_status_add_viewer,
    update_one_msg_status_add_viewer,
    update_seen_status,
    check_reac_emoji_list,
    delete_reac_emoji,
    update_reac_emoji,
    get_messages_tag,
    hasUserThisTag,
    hasMessageThisTag,
    deleteThisTag,
    getAllUnread,
    getPersonalConversation,
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
    send_todo_msg_acceptance,
    get_conversation_info,
    connect_msgUpdate,
    connect_msgUpdatechecklist,
    read_msg_data,
    url_attachment_data_update,
    clear_conv_history,
    update_msg_tag,
    create_sp_tag,
    get_tagmsg_id,
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
    getlasthundredmsg,
    delete_message_last_time,
    updateHasHideThismsg,
    createChecklistAndroid,
    getAllmydeletemessage,
    send_notification_msg,
    updateChecklistAndroid,
    updateChecklistAndroidv2,
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
    update_checklist_process,
    delete_checklist_item,
    chk_due_date_today,
    getOneChecklistData,
    manage_checklist,
    removeItem,
    complete_old_checklist,
    getOneChecklistMsg,
    findTeamChecklistData,
    getTeamTaskData,
    deleteEmptyTeamTask,
    all_unread_dataFun,
    my_all_task_assignment,
    has_pending_chk_in_conv,
    update_team_to_user,
    saveAndCancelChecklist,
    saveNewChecklistMsg,
    readallmsgintoconv,
    send_msg_firebase,
    getALlMessagesLinkData,
    update_conversation
};