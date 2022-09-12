var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
const metascraper = require('metascraper');
const got = require('got');
var router = app.Router();

var {models} = require('./../config/db/express-cassandra');
var {createPersonalConv} = require('./../utils/conversation');
var {send_todo_msg_acceptance} = require('./../utils/message');

var todo_msg = [];

var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length >0;
}

var get_conversation = (activity_id, callback) =>{
    // models.instance.ActivityMessages.find({activity_id: activity_id, $orderby:{ '$desc' :'msg_id' }, $limit:20 }, {raw:true, allow_filtering: true}, function(err, conversation){
    models.instance.ActivityMessages.find({activity_id: activity_id, $orderby:{ '$desc' :'msg_id' } }, {raw:true, allow_filtering: true}, function(err, conversation){
        if(err) callback({status: false, err: err});
        else {
            callback({status: true, conversation: _.reverse(conversation)});
        }
    });
};
/** for multiple activity */
var get_mul_conversation = (activity_ids, callback) =>{
  var convid = new Set();
  _.forEach(activity_ids, function(val, k){
      convid.add(models.uuidFromString(val));
  });
  var convid_array = Array.from(convid);
  var query = {
      activity_id: {'$in': convid_array}
  };
  
  models.instance.ActivityMessages.find(query, {raw:true, allow_filtering: true}, function(err, conversation){
      if(err) callback({status: false, err: err});
      else {
          callback({status: true, conversation: _.orderBy(conversation, ['created_at'],['asc'])});
      }
  });
};

todo_msg["get_todo_unread"] = (data, uid, callback) =>{
    var convid = new Set();
    _.forEach(data, function(val, k){
        convid.add(models.uuidFromString(val));
    });
    var convid_array = Array.from(convid);
    var query = {
        activity_id: {'$in': convid_array}
    };

    models.instance.ActivityMessages.find(query, { raw: true, allow_filtering: true }, function(error, all_msg){
        if(error) callback({status: false}, error);

        var all_unread = [];
        var msg_has_rep = [];
        var unread_replay = [];

        // Get all unread messages
        _.forEach(all_msg, function(amv, amk){
            if(amv.msg_status == null && amv.sender.toString() != uid){
                
            }

            // if(amv.has_reply > 0){
            //     if(msg_has_rep.indexOf(amv.msg_id) == -1)
            //         msg_has_rep.push(amv.msg_id);
            // }
        });

        // Get all unread replay
        if(msg_has_rep.length){
            // models.instance.ReplayConv.find({msg_id:{'$in':msg_has_rep}}, { raw: true, allow_filtering: true }, function(error_rep, rep_con_data){
            //     if(error_rep) callback({status: false}, error_rep);
            //
            //     var rep_con_id = [];
            //     _.forEach(rep_con_data, function(rcv, rck){
            //         rep_con_id.push(rcv.rep_id);
            //     });
            //
            //     var query = { conversation_id: {'$in': rep_con_id} };
            //     models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error_rep, all_rep_msg){
            //         if(error_rep) callback({status: false}, error_rep);
            //
            //         _.forEach(all_rep_msg, function(amv, amk){
            //             if(amv.msg_status == null && amv.sender.toString() != uid)
            //                 unread_replay.push(amv);
            //         });
            //         callback({status: true, data: {all_unread, unread_replay, rep_con_data}}, false);
            //     });
            // });
        }else{
            callback({status: true, data: {all_unread, unread_replay, rep_con_data:[]}}, false);
        }
    });
}

todo_msg["update_todomsg_status_add_viewer"] = (data, callback) =>{
    var messid = new Set();
    _.forEach(data.msgids, function(val, k){

        messid.add(models.timeuuidFromString(val));
    });
    var uid = data.user_id;
    var msgarray = Array.from(messid);
    var query = {
        activity_id: {$eq: models.uuidFromString(data.activity_id)},
        msg_id: {'$in': msgarray}
    };
    var query_object = {activity_id: {$eq: models.uuidFromString(data.activity_id)},msg_id: {'$in': msgarray}};
    var update_values_object = {msg_status: {'$add': [uid]},has_delivered: 1};
    models.instance.ActivityMessages.update(query_object, update_values_object, update_if_exists, function(err){
        if(err){
            callback({status: false});
            throw err;
        }else{
            callback({status: true});
        }
    });
};
todo_msg["update_mul_todomsg_status_add_viewer"] = (data, callback) =>{
  var uid = data.user_id;
    _.forEach(data.msg_act, function(val, k){
      var query = {
          activity_id: {$eq: models.uuidFromString(val.activity_id)},
          msg_id: {$eq: models.timeuuidFromString(val.msg_id)}
      };
      var update_values_object = {msg_status: {'$add': [uid]},has_delivered: 1};
      models.instance.ActivityMessages.update(query, update_values_object, update_if_exists, function(err){
          if(err){
              callback({status: false});
              throw err;
          }
          if(data.msg_act.length == k+1)
              callback({status: true});
      });
    });
};


todo_msg["get_task_subtask_msg"] = (data, callback) =>{
    get_mul_conversation(data.all_activity, (result, error) => {
        if(error) callback({status: false, error: error});
        if(result.status && result.conversation.length>0)
            callback({status: true, conversation: result.conversation});
        else
            callback({status: false});
    });
};
todo_msg["get_todo_msg"] = (data, callback) =>{
    get_conversation(models.uuidFromString(data.activity_id), (result, error) => {
        if(error) callback({status: false, error: error});
        if(result.status && result.conversation.length>0)
            callback({status: true, conversation: result.conversation});
        else
            callback({status: false});
    });
};

todo_msg["save_msg"] = (data, callback) =>{
    var createdat = new Date().getTime();
    var msgid = models.timeuuid();

    if(isRealString(data.text)){
      var uuidconversation_id = models.uuidFromString(data.activity_id);
      var uuidfrom = models.uuidFromString(data.sender_id);
      var nullval = [];
      var imgfile = (typeof data.attach_files === 'undefined')?nullval:data.attach_files.imgfile;
      var audiofile = (typeof data.attach_files === 'undefined')?nullval:data.attach_files.audiofile;
      var videofile = (typeof data.attach_files === 'undefined')?nullval:data.attach_files.videofile;
      var otherfile = (typeof data.attach_files === 'undefined')?nullval:data.attach_files.otherfile;

      var msgType;
      if(imgfile == null && audiofile == null && videofile == null && otherfile == null)
        msgType = 'text';
      else{
        msgType = 'media';

        if(imgfile != null){
          if(imgfile.length > 0){
            msgType = msgType + '_imgfile';
          }
        }
        if(audiofile != null){
          if(audiofile.length > 0){
            msgType = msgType + '_audiofile';
          }
        }
        if(videofile != null){
          if(videofile.length > 0){
            msgType = msgType + '_videofile';
          }
        }
        if(otherfile != null){
          if(otherfile.length > 0){
            msgType = msgType + '_otherfile';
          }
        }
        if(msgType == 'media'){
          msgType = 'text';
        }
      }

      var message = new models.instance.ActivityMessages({
          msg_id: msgid,
          msg_body: data.text,
          attch_imgfile: imgfile,
          attch_audiofile: audiofile,
          attch_videofile: videofile,
          attch_otherfile: otherfile,
          sender: uuidfrom,
          sender_name: data.sender_name,
          sender_img: data.sender_img,
          has_delivered: 0,
          activity_id: uuidconversation_id,
          msg_type:msgType
      });

      message.saveAsync()
          .then(function(res) {
              callback({status:true, msg: message});
          })
          .catch(function(err) {
              callback({status:false, err: err});
          });
    } else {
      callback({status:false, err: 'Message formate not supported.'});
    }
};

todo_msg["flag_unflag"] = (data, callback) =>{
    if(data.is_add == 'no'){
        models.instance.ActivityMessages.update({activity_id: models.uuidFromString(data.activity_id), msg_id: models.timeuuidFromString(data.msg_id)}, {
        has_flagged: {'$remove': [data.user_id]}
        }, update_if_exists, function(err){
            if(err) callback({status: false, err: err});
            callback({status: true});
        });
    } else if(data.is_add == 'yes'){
        models.instance.ActivityMessages.update({activity_id: models.uuidFromString(data.activity_id), msg_id: models.timeuuidFromString(data.msg_id)}, {
        has_flagged: {'$add': [data.user_id]}
        }, update_if_exists, function(err){
            if(err) callback({status: false, err: err});
            callback({status: true});
        });
    }
};

todo_msg["add_reac_emoji"] = (activity_id, msg_id, user_id, user_fullname, emoji, callback) =>{
  var c_grinning = 0; var c_joy = 0; var c_open_mouth = 0; var c_disappointed_relieved = 0;
  var c_rage = 0; var c_thumbsup = 0; var c_thumbsdown = 0; var c_heart = 0;

  models.instance.ActivityMessages.find({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)}, {raw:true, allow_filtering: true}, function(err, message){
    if(err){
      console.log(error);
    }else{
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
      _.forEach(message[0].has_emoji, function(v,k){
        switch(k) {
          case "grinning":
            v += (k==emoji)?1:0; c_grinning += v; break;
          case "joy":
            v += (k==emoji)?1:0; c_joy += v; break;
          case "open_mouth":
            v += (k==emoji)?1:0; c_open_mouth += v; break;
          case "disappointed_relieved":
            v += (k==emoji)?1:0; c_disappointed_relieved += v; break;
          case "rage":
            v += (k==emoji)?1:0; c_rage += v; break;
          case "thumbsup":
            v += (k==emoji)?1:0; c_thumbsup += v; break;
          case "thumbsdown":
            v += (k==emoji)?1:0; c_thumbsdown += v; break;
          case "heart":
            v += (k==emoji)?1:0; c_heart += v; break;
        }
      });

      models.instance.ActivityMessages.update({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)}, {
          has_emoji: {'$add': {
                              "grinning": c_grinning,
                              "joy": c_joy,
                              "open_mouth": c_open_mouth,
                              "disappointed_relieved": c_disappointed_relieved,
                              "rage": c_rage,
                              "thumbsup": c_thumbsup,
                              "thumbsdown": c_thumbsdown,
                              "heart": c_heart } }
      }, update_if_exists, function(err){
          if(err) callback({status: false, err: err});
          callback({status: true, rep: 'add'});
      });
    }
  });
};

todo_msg["delete_reac_emoji"] = (activity_id, msg_id, uid, emoji, callback) =>{
  models.instance.MessageEmoji.delete({msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, function(err){
    if(err){
      callback({status: false, result: err});
    }else{
      var c_grinning = 0; var c_joy = 0; var c_open_mouth = 0; var c_disappointed_relieved = 0;
      var c_rage = 0; var c_thumbsup = 0; var c_thumbsdown = 0; var c_heart = 0;

      models.instance.ActivityMessages.find({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)},
            {raw:true, allow_filtering: true}, function(err, message){
        if(err){
          console.log(error);
        }else{
          _.forEach(message[0].has_emoji, function(v,k){
            switch(k) {
              case "grinning":
                v -= (k==emoji)?1:0; c_grinning += v; break;
              case "joy":
                v -= (k==emoji)?1:0; c_joy += v; break;
              case "open_mouth":
                v -= (k==emoji)?1:0; c_open_mouth += v; break;
              case "disappointed_relieved":
                v -= (k==emoji)?1:0; c_disappointed_relieved += v; break;
              case "rage":
                v -= (k==emoji)?1:0; c_rage += v; break;
              case "thumbsup":
                v -= (k==emoji)?1:0; c_thumbsup += v; break;
              case "thumbsdown":
                v -= (k==emoji)?1:0; c_thumbsdown += v; break;
              case "heart":
                v -= (k==emoji)?1:0; c_heart += v; break;
            }
          });

          models.instance.ActivityMessages.update({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)}, {
              has_emoji: {'$add': {
                                  "grinning": c_grinning,
                                  "joy": c_joy,
                                  "open_mouth": c_open_mouth,
                                  "disappointed_relieved": c_disappointed_relieved,
                                  "rage": c_rage,
                                  "thumbsup": c_thumbsup,
                                  "thumbsdown": c_thumbsdown,
                                  "heart": c_heart } }
          }, update_if_exists, function(err){
              if(err) callback({status: false, err: err});
              callback({status: true, rep: 'delete'});
              // callback({status: true, result: emoji_user});
          });
        }
      });
      // callback({status: true});
    }
  });
};

todo_msg["update_reac_emoji"] = (activity_id, msg_id, uid, emoji, callback) =>{
  var c_grinning = 0; var c_joy = 0; var c_open_mouth = 0; var c_disappointed_relieved = 0;
  var c_rage = 0; var c_thumbsup = 0; var c_thumbsdown = 0; var c_heart = 0;
  models.instance.MessageEmoji.find({msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, {raw:true, allow_filtering: true}, function(err, emoji_user){
    if(err) callback({status: false, err: err});
    else {
      var old_rec = emoji_user[0].emoji_name;
      models.instance.MessageEmoji.update({msg_id: models.timeuuidFromString(msg_id), user_id: models.uuidFromString(uid) }, {emoji_name: emoji}, update_if_exists, function(err2){
        if(err2) callback({status: false, err: err2});
        else{
          models.instance.ActivityMessages.find({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)},
                    {raw:true, allow_filtering: true}, function(err3, message){
            _.forEach(message[0].has_emoji, function(v,k){
                if(k == "grinning"){
                  c_grinning = v;
                  if(k==emoji) c_grinning++;
                  if(k==old_rec) c_grinning--;
                }
                if(k=="joy"){
                  c_joy = v;
                  if(k==emoji) c_joy++;
                  if(k==old_rec) c_joy--;
                }
                if(k=="open_mouth"){
                  c_open_mouth = v;
                  if(k==emoji) c_open_mouth++;
                  if(k==old_rec) c_open_mouth--;
                }
                if(k=="disappointed_relieved"){
                  c_disappointed_relieved = v;
                  if(k==emoji) c_disappointed_relieved++;
                  if(k==old_rec) c_disappointed_relieved--;
                }
                if(k=="rage"){
                  c_rage = v;
                  if(k==emoji) c_rage++;
                  if(k==old_rec) c_rage--;
                }
                if(k=="thumbsup"){
                  c_thumbsup = v;
                  if(k==emoji) c_thumbsup++;
                  if(k==old_rec) c_thumbsup--;
                }
                if(k=="thumbsdown"){
                  c_thumbsdown = v;
                  if(k==emoji) c_thumbsdown++;
                  if(k==old_rec) c_thumbsdown--;
                }
                if(k=="heart"){
                  c_heart = v;
                  if(k==emoji) c_heart++;
                  if(k==old_rec) c_heart--;
                }
            });

            models.instance.ActivityMessages.update({activity_id: models.uuidFromString(activity_id), msg_id: models.timeuuidFromString(msg_id)}, {
                  has_emoji: {'$add': {
                                      "grinning": c_grinning,
                                      "joy": c_joy,
                                      "open_mouth": c_open_mouth,
                                      "disappointed_relieved": c_disappointed_relieved,
                                      "rage": c_rage,
                                      "thumbsup": c_thumbsup,
                                      "thumbsdown": c_thumbsdown,
                                      "heart": c_heart } }
            }, update_if_exists, function(err){
                if(err) callback({status: false, err: err});
                else callback({status: true, rep: 'update', old_rep: old_rec});
            });
          });
        }
      });
    }
  });
};

todo_msg["view_reac_emoji_list"] = (msg_id, emoji, callback) =>{
  models.instance.MessageEmoji.find({msg_id: models.timeuuidFromString(msg_id), emoji_name: emoji}, {raw:true, allow_filtering: true}, function(err, emoji_user_list){
    if(err){
      callback({status: false, result: err});
    }else{
      callback({status: true, result: emoji_user_list});
    }
  });
};

todo_msg["replyId"] = (msg_id, conversation_id, callback) =>{
  models.instance.ReplayConv.find({msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conversation_id)},
          {raw:true, allow_filtering: true}, function(err, reply_info){
    if(err){
      callback({status: false, result: err});
    }else{
      if(reply_info.length == 0){
        var reply_uuid = models.uuid();
        var replyData = new models.instance.ReplayConv({
          rep_id: reply_uuid,
          msg_id: models.timeuuidFromString(msg_id),
          conversation_id: models.uuidFromString(conversation_id)
        });
        replyData.saveAsync().then(function(res) {
            callback({status:true, result: reply_uuid});
        }).catch(function(err) {
            callback({status:false, err: err});
        });
      }else{
        callback({status: true, result: reply_info[0].rep_id});
      }
    }
  });
};

todo_msg["thread_reply_update"] = (data, callback) =>{
  models.instance.ActivityMessages.find({activity_id: models.uuidFromString(data.activity_id), msg_id: models.timeuuidFromString(data.msg_id)}, {raw:true, allow_filtering: true}, function(err, msg_info){
    if(err){
      callback({status: false, result: err});
    }else{
        models.instance.ActivityMessages.update({activity_id: models.uuidFromString(data.activity_id), msg_id: models.timeuuidFromString(data.msg_id)},
            {has_reply: (Number(msg_info[0].has_reply) + 1), last_reply_time: new Date().getTime(), last_reply_name: data.last_reply_name}, update_if_exists, function(err){
          if(err) callback({status:false, msg: err});
          callback({status:true});
      });
    }
  });
};

todo_msg["find_reply_list"] = (msg_id, activity_id, callback) =>{
  models.instance.ReplayConv.find({msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(activity_id)},
      {raw:true, allow_filtering: true}, function(err, rep_id){
    if(err) callback({status: false, data: err});
    else{
      models.instance.ActivityMessages.find({activity_id: rep_id[0].rep_id},
            {raw:true, allow_filtering: true}, function(error, rep_list){
        if(error) callback({status: false, data: err});
        callback({status: true, data: rep_list});
      });
    }
  });
};

todo_msg["findUnreadRep"] = (data, callback) =>{
    var convid = new Set();
    _.forEach(data.has_reply_msgid, function(val, k){
        convid.add(models.timeuuidFromString(val));
    });
    var convid_array = Array.from(convid);
    var query = {
        msg_id: {'$in': convid_array},
        conversation_id: models.uuidFromString(data.activity_id)
    };

    models.instance.ReplayConv.find(query, { raw: true, allow_filtering: true }, function(err, reply){
        if(err) callback({status: false, error: err});
        else{
            if(reply.length>0){
                var aid = new Set();
                _.forEach(reply, function(v, k){
                    aid.add(v.rep_id);
                });
                var aid_array = Array.from(aid);
                models.instance.ActivityMessages.find({activity_id: {'$in': aid_array}}, { raw: true, allow_filtering: true }, function(error, act_msgs){
                    if(error)  callback({status: false, error: error});
                    else{
                        callback({status: true, reply, msgs: act_msgs});
                    }
                });
            }else{
                callback({status: false});
            }
        }
    });
};

todo_msg["send_acceptance"] = (activity_id, arg_data, sender_name, sender_img, callback) => {
    var nomsg = [];
    _.forEach(arg_data.adminListUUID, function (v, k) {
        if (arg_data.createdBy != v) {
            createPersonalConv(arg_data.createdBy, v, arg_data.ecosystem,arg_data.company_id, (res) => {
                send_todo_msg_acceptance(arg_data.createdBy, sender_img, sender_name, res.conversation_id.toString(), arg_data.activityTitle, [], 'todo', activity_id, (rep, err) => {
                    if (err) console.log('send_acceptance error: ', err);
                    nomsg.push({ uid: v, msg: rep.msg });
                    // if ((nomsg.length + 1) == arg_data.adminListUUID.length)
                    if(arg_data.adminListUUID.length == 2){
                        callback(nomsg);
                    }else{
                        if ((nomsg.length) == arg_data.adminListUUID.length)
                            callback(nomsg);
                    }
                    
                });
            });
        }
    });
};


todo_msg["todo_info"] = (data, callback) =>{
    var id = new Set();
    _.forEach(data, function(val, k){
        id.add(models.uuidFromString(val));
    });
    var idarray = Array.from(id);
    var query = {
        activity_id: {'$in': idarray}
    };

    models.instance.Activity.find(query, {raw:true, allow_filtering: true}, function(error, activity_list){
        if(error) callback({status: false, msg: error});
        else{
            callback({status: true, activity_list: activity_list});
        }
    });
};

todo_msg["update_accept_toto"] = (conversation_id, msg_id, callback) =>{
    models.instance.Messages.update({conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id)}, {msg_body: 'accept'}, update_if_exists, function(err){
        if(err) callback({status: false, error: err});
        else callback({status: true});
    });
};
todo_msg["update_decline_toto"] = (conversation_id, msg_id, activity_id, user_id, callback) =>{
    
    models.instance.Activity.find({ activity_id: models.uuidFromString(activity_id)}, {raw:true, allow_filtering: true}, function(error, activity){
        if(error) callback({status: false, error: error});

        models.instance.Activity.update({activity_id: models.uuidFromString(activity_id), activity_created_at: activity[0].activity_created_at}, {activity_participants: { $remove: [user_id] }}, update_if_exists, function(err){
            if(err) callback({status: false, error: err});
            else{
                models.instance.Messages.update({conversation_id: models.uuidFromString(conversation_id), msg_id: models.timeuuidFromString(msg_id)}, {msg_body: 'decline'}, update_if_exists, function(err){
                    if(err) callback({status: false, error: err});
                    else callback({status: true});
                });
            }
        });
    });
};

todo_msg["has_new_todo_reply"] = (data, callback) =>{
    var unread_replay = [];
    models.instance.ActivityMessages.find({activity_id: models.uuidFromString(data.activity_id), has_reply: { '$gt':0}}, {raw:true, allow_filtering: true}, function(e1, actmsg){
        if(e1) callback({status: false, error: e1, unread_replay});
        else if(actmsg.length > 0){
            var msgids = [];
            _.forEach(actmsg, function(v, k){
                msgids.push(v.msg_id);
            });

            models.instance.ReplayConv.find({conversation_id: models.uuidFromString(data.activity_id), msg_id: {'$in': msgids}}, {raw:true, allow_filtering: true}, function(e2, rep_conv){
                if(e2) callback({status: false, error: e2, unread_replay});
                else if(rep_conv.length>0){
                    var actids = [];
                    _.forEach(rep_conv, function(v, k){
                        actids.push(v.rep_id);
                    });

                    models.instance.ActivityMessages.find({activity_id: {'$in': actids}}, {raw:true, allow_filtering: true}, function(e3, all_replies){
                        if(e3) callback({status: false, error: e3, unread_replay});
                        else if(all_replies.length>0){
                            _.forEach(all_replies, function(amv, amk){
                                if(amv.msg_status == null && amv.sender.toString() != data.user_id)
                                    unread_replay.push(amv);
                                else if(amv.msg_status != null && amv.sender.toString() != data.user_id && amv.msg_status.indexOf(data.user_id) == -1)
                                    unread_replay.push(amv);
                            });
                            callback({status: true, unread_replay});
                        }
                        else{
                            callback({status: false, error: 'no reply msg', unread_replay});
                        }
                    });
                }
                else{
                    callback({status: false, error: 'no reply id', unread_replay});
                }
            });
        }
        else{
            callback({status: false, error: 'no reply activity', unread_replay});
        }
    });
};
todo_msg["todo_chat_search"] = (data, callback) =>{
    var msgids = [];    // msgids store all match string with flag true
                        // and all reply msg id with flag false, for check
    var rep_msg_id = [];

    /* Find all msg for given activity_id */
    models.instance.ActivityMessages.find({activity_id: models.uuidFromString(data.activity_id)}, {raw:true, allow_filtering: true}, function(e1, actmsg){
        if(e1) callback({status: false, error: e1, msgids});
        else if(actmsg.length > 0){
            _.forEach(actmsg, function(v, k){
                if((v.msg_body).toLowerCase().indexOf(data.str)>-1)
                    msgids.push({msg_id: v.msg_id.toString(), status: true});
                if(v.has_reply>0){
                    msgids.push({msg_id: v.msg_id.toString(), status: false}); // need check again
                    rep_msg_id.push(v.msg_id);
                }
            });

            if(rep_msg_id.length > 0){
                /* find all reply msg conversation id */
                models.instance.ReplayConv.find({conversation_id: models.uuidFromString(data.activity_id), msg_id: {'$in': rep_msg_id}}, {raw:true, allow_filtering: true}, function(e2, rep_conv){
                    if(e2) callback({status: false, error: e2, unread_replay});
                    else if(rep_conv.length>0){
                        var actids = [];
                        var repmsgids = [];         // all reply msg activity_id which not match the string
                        var has_repmsgids = [];     // all reply msg activity_id which match the string
                        var not_match_msgid = [];   // all reply msg parent id which not match the string
                        _.forEach(rep_conv, function(v, k){
                            actids.push(v.rep_id);
                        });

                        /* find all reply msg */
                        models.instance.ActivityMessages.find({activity_id: {'$in': actids}}, {raw:true, allow_filtering: true}, function(e3, all_replies){
                            if(e3) callback({status: false, error: e3, unread_replay});
                            else if(all_replies.length>0){
                                _.forEach(all_replies, function(amv, amk){
                                    // string match with the reply body
                                    if((amv.msg_body).toLowerCase().indexOf(data.str) > -1){
                                        if(has_repmsgids.indexOf(amv.activity_id.toString()) == -1){
                                            has_repmsgids.push(amv.activity_id.toString());
                                        }
                                    }
                                    // string not match with the reply body
                                    else if((amv.msg_body).toLowerCase().indexOf(data.str) == -1){
                                        if(repmsgids.indexOf(amv.activity_id.toString()) == -1){
                                            repmsgids.push(amv.activity_id.toString());
                                        }
                                    }
                                });

                                // remove matches id from not mstches id array
                                _.forEach(repmsgids, function(vv,kk){
                                    _.forEach(has_repmsgids, function(m, n){
                                        if(vv == m)
                                            repmsgids[kk] = 0;
                                    });
                                });

                                // store msg id which not match
                                _.forEach(repmsgids, function(vv,kk){
                                    _.forEach(rep_conv, function(m, n){
                                        if(vv == m.rep_id.toString()){
                                            if(not_match_msgid.indexOf(m.msg_id.toString()) == -1)
                                                not_match_msgid.push(m.msg_id.toString());
                                        }
                                    });
                                });

                                // create the final msg id array, which match the string
                                _.forEach(msgids, function(j, k){
                                    _.forEach(not_match_msgid, function(jj, kk){
                                        if(j.msg_id == jj && j.status === false){
                                            msgids[k].msg_id = 0;
                                        }
                                    });
                                });
                                callback({status: true, msgids});
                            }
                        });
                    }
                });
            }
            else{
                callback({status: true, msgids});
            }
        }
        else{
            callback({status: false, error: 'no reply activity', msgids});
        }
    });
};

var commit_msg_delete_for_Todo = (convid, msg_id, uid, is_seen, remove, callback) =>{
  models.instance.ActivityMessages.find({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)},
    {raw:true, allow_filtering: true}, function(error, msg){
    if(error){
      callback({status: false, err: error});
    }
    else if(msg.length == 1){
      if(uid == msg[0].sender){
        if(msg[0].msg_status == null){ // unread msg can delete sender and system change the msg body for receiver
          models.instance.ActivityMessages.update({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)}, {
                has_delete: {'$add': [uid]},
                msg_body: 'This message was deleted.'
                }, update_if_exists, function(err){
                    if(err) callback({status: false, err: err});
                    callback({status: true});
            });
        } else { // add delete status, but connect no change
            var sender_delete_it = (remove == 'true')?'Sender delete it':' ';
          models.instance.ActivityMessages.update({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)}, {
                has_delete: {'$add': [uid, sender_delete_it]}
                }, update_if_exists, function(err){
                    if(err) callback({status: false, err: err});
                    callback({status: true});
            });
        }
      }else{
        var sender_delete_it = (remove == 'true')?'Sender delete it':' ';
          models.instance.ActivityMessages.update({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)}, {
                has_delete: {'$add': [uid, sender_delete_it]}
                }, update_if_exists, function(err){
                    if(err) callback({status: false, err: err});
                    callback({status: true});
            });
      }

    }
    else{
      callback({status: false, err: 'Message id not found'});
    }
  });
};

var permanent_msg_delete_todo =(convid, msg_id, uid, is_seen, remove, callback)=>{
  models.instance.ActivityMessages.find({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)},
    {raw:true, allow_filtering: true}, function(error, msg){
      if(error){
      callback({status: false, err: error});
    }
    else if(msg.length == 1){
        if(is_seen == 'permanent_delete'){
            if(uid == msg[0].sender){
                models.instance.ActivityMessages.delete({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)}, function(err){
                    if(err) console.log(err);
                    callback({status: true, msg: 'Msg delete successfully'});
                });
            }else{
                models.instance.ActivityMessages.update({activity_id: models.uuidFromString(convid), msg_id: models.timeuuidFromString(msg_id)}, {has_hide: {'$add': [uid]}}, update_if_exists, function(err){
                    if(err) console.log(err);
                    callback({status: true, msg: 'Msg hide successfully'});
                });
            }
        }
    }
    else{
      callback({status: false, err: 'Message id not found'});
    }
    });
}

/* Todo My Note */
todo_msg["find_mynote_history"] = (data, callback)=>{
  var query = {
      subtask_id: models.uuidFromString(data.subtask_id)
  };
  models.instance.Mynote.find(query, {raw:true, allow_filtering: true}, function(err, note_msgs){
      if(err) callback({status: false, err: err});
      else {
          callback({status: true, msg: _.reverse(note_msgs)});
      }
  });
};

todo_msg["save_mynote"] = (data, callback) =>{
  var msgid = models.timeuuid();
  var createdat = new Date().getTime();
  if(isRealString(data.msg_body)){
    var uuidconversation_id = models.uuidFromString(data.activity_id);
    var uuidfrom = models.uuidFromString(data.sender);
    
    var message = new models.instance.Mynote({
        note_id: msgid,
        msg_body: data.msg_body,
        sender: uuidfrom,
        sender_name: 'Created by '+data.sender_name,
        sender_img: data.sender_img,
        has_delete: data.has_delete,
        subtask_id: uuidconversation_id,
        note_type: data.type,
        checklist: data.checklist,
        label: data.label,
        created_at: createdat,
        subtask_lists: data.subtask_lists
    });

    message.saveAsync()
        .then(function(res) {
            callback({status:true, msg: message});
        })
        .catch(function(err) {
            callback({status:false, err: err});
        });
  } else {
    callback({status:false, err: 'Note data formate not supported.'});
  }
};

todo_msg["find_or_create_ifnot"] = (data, callback)=>{
  models.instance.BatchActivity.findOne({activity_id: models.timeuuidFromString(data.activity_id)}, {raw:true, allow_filtering: true}, function(err, batch_activity){
      if(err) callback({status: false, err: err});
      else{
          if(typeof batch_activity == 'undefined'){
              var batch_id = models.timeuuid();
              var ba = new models.instance.BatchActivity({
                  batch_id: batch_id,
                  activity_id: models.timeuuidFromString(data.activity_id)
              });
              ba.saveAsync()
                  .then(function(res) {
                      callback({status:true, batch_activity: ba, batch_msg_history: []});
                  })
                  .catch(function(err) {
                      callback({status:false, err: err});
                  });
          }
          else{
              models.instance.ActivityMessages.find({activity_id: batch_activity.batch_id, $orderby:{ '$desc' :'msg_id' } }, {raw:true, allow_filtering: true}, function(err, conversation){
                  if(err) callback({status: false, err: err});
                  else {
                      callback({status: true, batch_activity: batch_activity, batch_msg_history: _.reverse(conversation)});
                  }
              });
          }
      }
  });
};
todo_msg["find_note_or_create_ifnot"] = (data, callback)=>{
  models.instance.Mynote.find({subtask_id: models.uuidFromString(data.activity_id)}, {raw:true, allow_filtering: true}, function(err, batch_note){
      if(err) callback({status: false, err: err});
      else{

          if(typeof batch_note == 'undefined')
            callback({status: true, batch_note: [], acid: data.activity_id });
            
          else
            callback({status: true, batch_note: batch_note, acid: data.activity_id});
      }
  });
};

todo_msg["delete_bn"] = (data, callback) =>{
  models.instance.Mynote.delete({note_id: models.timeuuidFromString(data.noteid), subtask_id: models.uuidFromString(data.batchid) }, function(err){
    if(err) callback({status: false, error: err});
    else callback({status: true});
  });
};

todo_msg["update_note_label"] = (data, callback) =>{
  models.instance.Mynote.update({note_id: models.timeuuidFromString(data.noteid), subtask_id: models.uuidFromString(data.batchid) }, {
      label: {'$remove': [data.value]}
      }, update_if_exists, function(err){
        if(err) callback({status: false, err: err});
        callback({status: true});
  });
};

todo_msg["update_mynote"] = (data, callback) =>{
  var createdat = new Date().getTime();
  var update_data = {
    sender_name: 'Edited by '+data.sender_name,
    msg_body: data.msg_body,
    note_type: data.type,
    checklist: data.checklist,
    label: data.label,
    created_at: createdat
  }
  models.instance.Mynote.update({note_id: models.timeuuidFromString(data.noteid), subtask_id: models.uuidFromString(data.activity_id) }, 
    update_data, update_if_exists, function(err){
        if(err) callback({status: false, err: err});
        callback({status: true, update_data});
  });
};

todo_msg["count_note_msg"] = (data, callback) =>{
  var convid = new Set();
  _.forEach(data.ids, function(val, k){
      convid.add(models.uuidFromString(val));
  });
  var convid_array = Array.from(convid);
  var query = {
    subtask_id: {'$in': convid_array}
  };

  models.instance.Mynote.find(query, { raw: true, allow_filtering: true }, function(error, all_note){
      if(error) callback({status: false}, error);  
      else callback({status: true, all_note: all_note});
  });
}

todo_msg["update_note_seen"] = (data, callback) =>{
  var query = {
    subtask_id: models.uuidFromString(data.subtask_id),
    note_id: models.timeuuidFromString(data.note_id)
  }
  models.instance.Mynote.update(query, {has_delete: data.has_delete}, update_if_exists, function(err){
    if(err) callback({status: false, err: err});
    else callback({status: true});
  });
}


var taskMediaAllMsg = (data,callback)=>{
  var query = "SELECT * FROM activitymessages WHERE activity_id="+models.uuidFromString(data.activity_id)+" AND msg_type like 'media%' ALLOW FILTERING;";
  models.instance.ActivityMessages.execute_query(query, {}, function(error, msg){
    if(error) {
      callback({status: false, error:error});
    }else{
      callback({status: true, allMediaMsg:msg.rows});
    }
  });
}


module.exports = {
  todo_msg,
  taskMediaAllMsg,
  commit_msg_delete_for_Todo,
  permanent_msg_delete_todo
};
