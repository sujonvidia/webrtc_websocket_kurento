var app = require('express');
var router = app.Router();
var _ = require('lodash');
var validator = require('validator');

var {models} = require('./../config/db/express-cassandra');

//Get All conversations by userid

var getAllConversation = (myID,callback) => {
    var query = {
          participants: { $contains: myID }
        };
    
    models.instance.Conversation.find( query, { raw: true, allow_filtering: true }, function(err, conversations) {
        if (err){
            console.log(17,err);
            callback({status:false, err});
        }else{
            callback({status:true, conversations});
        }
    })
};

var getAllMsg = (convArray,callback) => {
    
    var convid = new Set();
    _.forEach(convArray, function(val, k){
        convid.add(models.uuidFromString(val));
    });
    var convid_array = Array.from(convid);
    
    var promises = [];
	var itemRows = convid_array;
	for(var i = 0; i < itemRows.length; i++) {
		var id = itemRows[i];
		var p = new Promise(function(resolve, reject){dbData(id, resolve, reject);});
    promises.push(p);
	}
	Promise.all(promises).then(function(data) {
		callback({status:true, data:data});
    });
};

var dbData = (id, resolve, reject)=>{
    
    var query = {
        conversation_id: {'$eq': id},
        $orderby:{ '$desc' :'msg_id' }
    };

    models.instance.Messages.find(query, { raw: true, allow_filtering: true }, function(error, all_msg){
        if(error) {
            return reject();
        }else{
            // if(all_msg.length == 0){
              // all_msg.push({
                // conversation_id: id,
                // msg_id: models.timeuuid(),
                // activity_id: null,
                // assign_to: null,
                // attch_audiofile: null,
                // attch_imgfile: null,
                // attch_otherfile: null,
                // attch_videofile: null,
                // call_duration: null,
                // call_msg: null,
                // call_participants: null,
                // call_receiver_device: '',
                // call_receiver_ip: '',
                // call_running: false,
                // call_sender_device: '',
                // call_sender_ip: '',
                // call_server_addr: '',
                // call_server_switch: false,
                // call_status: null,
                // call_type: null,
                // conference_id: null,
                // created_at: '2000-07-20T11:30:28.014Z',
                // edit_history: null,
                // edit_seen: null,
                // edit_status: null,
                // forward_at: '2000-07-20T11:30:28.014Z',
                // forward_by: null,
                // has_delete: null,
                // has_delivered: 1,
                // has_emoji: {
                  // disappointed_relieved: 0,
                  // folded_hands: 0,
                  // grinning: 0,
                  // heart: 0,
                  // joy: 0,
                  // open_mouth: 0,
                  // rage: 0,
                  // thumbsdown: 0,
                  // thumbsup: 1
                // },
                // has_flagged: null,
                // has_hide: null,
                // has_reply: 0,
                // has_tag_text: null,
                // has_timer: null,
                // is_secret: null,
                // issue_accept_user: null,
                // last_reply_name: '',
                // last_reply_time: null,
                // last_update_time: '',
                // last_update_user: null,
                // mention_user: null,
                // msg_body: 'This conversation is empty.',
                // msg_status: null,
                // msg_text: 'This conversation is empty.',
                // msg_type: 'text',
                // old_created_time: null,
                // root_conv_id: null,
                // secret_user: null,
                // sender: '48b953f54c5b416d90c4922806e93a5e',
                // sender_img: 'img.png',
                // sender_name: 'WorkFreelibots',
                // service_provider: null,
                // tag_list: null,
                // updatedmsgid: null,
                // url_base_title: null,
                // url_body: null,
                // url_favicon: null,
                // url_image: null,
                // url_title: null,
                // user_tag_string: null
              // });
            // }
            return resolve(all_msg);
        }
    })
}

var set_status = (sender_id, reciver_id, status, callback) => {
  var uuids = new Set();
  uuids.add(sender_id);
  uuids.add(reciver_id);
  var uuidsarray = Array.from(uuids);
  var query = {id: {'$in': uuidsarray}};

  models.instance.Users.update(query, {
      is_busy: status
  }, update_if_exists, function(err){
      if(err){
        // console.log(1149);
        callback({status: false});
        throw err;
      }
      // console.log(1153, query);
      callback({status: true});
  });
};

function getAllpinUnpinList(user_id){
    return new Promise((resolve,reject)=>{
        if (user_id != undefined){
            models.instance.Pinned.find({ user_id: models.uuidFromString(user_id) }, function (err, pinnedBlocks) {
                if (err) {
                    reject(err);
                } else {
                    var convid = new Set();
                    var pinid_array = {};
                    if (pinnedBlocks != null){
                        _.forEach(pinnedBlocks, function (val, k) {
                            convid.add(val.block_id.toString());
                            pinid_array[val.block_id.toString()] = val.id.toString()
                        });
                    }
                    var convid_array = Array.from(convid);
                    

                    resolve({ convid_array: convid_array, pinid_array: pinid_array});
                }
            });
        }else{
            reject({err:"Userid Undefined"});
        }
    });
}

function getAllMuteList(user_id){
    return new Promise((resolve,reject)=>{
        if (user_id != undefined){
            models.instance.ConversationMute.find({ mute_by: models.uuidFromString(user_id) }, function (err, muteBlock) {
                if (err) {
                    reject(err);
                } else {
                    var allMuteActiveConv = [];
                    var muData = [];
                    var mute_id = {};
                    var mute_duration = {};
                    _.forEach(muteBlock, function (v, k) {
                      if (v.mute_status == "active") {
                        allMuteActiveConv.push(v.conversation_id.toString());
                        mute_id[v.conversation_id.toString()] = v.mute_id;
                        mute_duration[v.conversation_id.toString()] = v.mute_duration;
                        muData.push(v);
                      }
                    });
                    resolve({ allMuteActiveConv, muData, mute_id, mute_duration});
                }
            });
        }else{
            reject({err:"Userid Undefined"});
        }
    });
}

var remove_gcm_id = (data, callback) => {
  if(data.type == 'single'){
    models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, { fcm_id:{'$remove': ['android@@@'+data.gcm_id]} }, update_if_exists, function (err) {
      if (err) callback({ status: false, msg: err });
      callback({ status: true });
    });

  }else{
    models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, { fcm_id: null }, update_if_exists, function (err) {
      if (err) callback({ status: false, msg: err });
      callback({ status: true });
    });

  }
  
};


// var createGroupAndroid = (adminList,memberList,groupName,createdBy,ecosystem,grpprivacy,conv_img,topic_type,b_unit_id,b_unit_name,alltags,temTNA,company_id,callback) =>{

//     var conversation_id = models.uuid();
//     var conversation = new models.instance.Conversation({
//         conversation_id: conversation_id,
//         created_by: models.uuidFromString(createdBy),
//         company_id: models.timeuuidFromString(company_id),
//         group: 'yes',
//         group_keyspace:ecosystem,
//         privacy:grpprivacy,
//         single: 'no',
//         participants_admin: adminList,
//         participants: memberList,
//         title:groupName,
//         conv_img : conv_img,
//         topic_type:topic_type,
//         b_unit_id:b_unit_id,
//         conference_id : models.timeuuid().toString() + '_group'
//     });

//     // var tagTitle = [topic_type,groupName,b_unit_name,ecosystem];
//     // var queries = [];
//     // var tags = [];
//     var newTaglist = [];

//     // var tagListArray = [];

//     // var allOldTitle = [];
//     // alltags = JSON.parse(alltags);
//     // _.each(alltags,function(va,ka){
//     //   allOldTitle.push(va.title);
//     // });

//     // _.each(tagTitle, function(v, k) {
//     //   var newTag = v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
//     //       newTag = newTag.replace(/\s/g, '');


//     //   _.each(alltags,function(va,ka){
//     //     if(va.title.toLowerCase() == newTag){

//     //       tags.push(va.tag_id.toString());
//     //     }
//     //   });

//     //   if(allOldTitle.indexOf(newTag) == -1){

//     //     var tag_id = models.uuid();
//     //     var tag = new models.instance.Tag({
//     //       tag_id: tag_id,
//     //       tagged_by: models.uuidFromString(createdBy),
//     //       title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //       type: 'CONNECT',
//     //       visibility: 'hidden'
//     //     });
//     //     var save_query = tag.save({return_query: true});
//     //     queries.push(save_query);
//     //     tags.push(tag_id);
//     //     newTaglist.push({
//     //       tag_id: tag_id,
//     //       tagged_by: models.uuidFromString(createdBy),
//     //       title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //       type: 'CONNECT',
//     //       visibility: 'hidden'
//     //     })
//     //     tagListArray.push({
//     //       tag_id: tag_id,
//     //       tagged_by: models.uuidFromString(createdBy),
//     //       title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //       type: 'CONNECT',
//     //       visibility: 'hidden'
//     //     })
//     //   }

//     // });

//     // _.each(temTNA,function(v,k){
//     //     if(allOldTitle.indexOf(v) == -1 && tagTitle.indexOf(v) == -1){
//     //       var tag_id = models.uuid();
//     //       var tag = new models.instance.Tag({
//     //         tag_id: tag_id,
//     //         tagged_by: models.uuidFromString(createdBy),
//     //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //         type: 'CONNECT',
//     //         visibility:'visible'
//     //       });
//     //       var save_query = tag.save({return_query: true});
//     //       queries.push(save_query);
//     //       tags.push(tag_id);
//     //       newTaglist.push({
//     //         tag_id: tag_id,
//     //         tagged_by: models.uuidFromString(createdBy),
//     //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //         type: 'CONNECT',
//     //         visibility:'visible'
//     //       });
//     //       tagListArray.push({
//     //         tag_id: tag_id,
//     //         tagged_by: models.uuidFromString(createdBy),
//     //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
//     //         type: 'CONNECT',
//     //         visibility:'visible'
//     //       })
//     //     }
//     //   });

//     var condtagsid = [];
//     // var convTQ = [];
//     // _.each(tags,function(v,k){
//     //   console.log(v);
//     //   var id = models.uuid();
//     //   var tag2 = new models.instance.Convtag({
//     //     id: id,
//     //     tag_id: models.uuidFromString(v.toString()),
//     //     conversation_id: conversation_id
//     //   });
//     //   var save_query = tag2.save({return_query: true});
//     //   convTQ.push(save_query);
//     //   _.each(tagListArray,function(vu,ku){
//     //     if(vu.tag_id == v){

//     //       condtagsid.push({cnvtagid:id,roomid:conversation_id,tagTitle:vu.title,tagid:vu.tag_id,visibility:vu.visibility});
//     //     }

//     //   });
//     // });
    
//     // models.doBatch(queries, function(err){
//     //     if(err){ throw err;}
//     //     else {

//     //       models.doBatch(convTQ, function(err2){
//     //         if(err2){ throw err2;}
//     //         else {
//     //           console.log({status:true});
//     //         }
//     //     });
//     //     }
//     // });


//     var validateCheck = [
//       ckEmpty('Conversation Image',conv_img),
//       ckEmpty('Title',groupName),
//       ckEmpty('Privacy',grpprivacy),
//       ckEmpty('Created By',createdBy),
//       ckEmpty('Workspace Name',ecosystem)
//     ];

//     if(returnValid(validateCheck)){
//       conversation.saveAsync().then(function() {
//         callback({status:true, conversation_id,tags:newTaglist,condtagsid:condtagsid});
//       }).catch(function(err) {
//         callback({status:false, err: err});
//       });
//     }else{
//       callback({status:false, err: validateCheck});
//     }

    
// };

var createGroupAndroid = (data, callback) =>{
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(data.company_id)+" AND title like '"+ data.groupName+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr) {
      console.log(282,cerr);
      callback({status:false, err: cerr});
    }else{
          console.log('exist room length:',cresult.rows.length);
    
          if(cresult.rows.length > 0){
            callback({status:false, exist:true, err: "Room already exists.", data:cresult.rows});
          }else{
            data.conv_img = data.conv_img == "" ? 'feelix.jpg' : data.conv_img;
            data.service_provider = data.service_provider == "" ? null : data.service_provider;
            // console.log(data);
            var conversation_id = models.uuid();
            var conversation = new models.instance.Conversation({
                conversation_id: conversation_id,
                created_by: models.uuidFromString(data.createdBy),
                group: 'yes',
                group_keyspace: data.ecosystem,
                privacy: data.grpprivacy,
                single: 'no',
                participants_admin: data.adminList,
                service_provider: data.service_provider,
                participants: data.memberList,
                title: data.groupName,
                conv_img : data.conv_img,
                topic_type: data.topic_type,
                b_unit_id: data.b_unit_id,
                tag_list: data.readyTag,
                company_id:models.timeuuidFromString(data.company_id),
                conference_id : models.timeuuid().toString() + '_group'
            });

            // callback({status: false});
            
            var validateCheck = [
              ckEmpty('Conversation Image', data.conv_img),
              ckEmpty('Title', data.groupName),
              ckEmpty('Privacy', data.grpprivacy),
              ckEmpty('Created By', data.createdBy),
              ckEmpty('Workspace Name', data.ecosystem)
            ];
            
            if(returnValid(validateCheck)){
              conversation.saveAsync().then(function() {
                callback({status:true, conversation_id,tags:[],condtagsid:[], exist:false});
              }).catch(function(err) {
                callback({status:false, err: err});
              });
              
            }else{
              callback({status:false, err: validateCheck});
            }
          }
    }
  });
};
var updateGroupAndroid = (data, callback) =>{
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(data.company_id)+" AND title like '"+ data.groupName+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr) {
      console.log(341,cerr);
      callback({status:false, err: cerr});
    }else{
          if(cresult.rows.length > 0 && cresult.rows[0].conversation_id.toString() != data.conversation_id){
            console.log(345)
            callback({status:false, error: "Sorry, group name already exists."});
          }else{
            data.conv_img = data.conv_img == "" ? 'feelix.jpg' : data.conv_img;
            data.service_provider = data.service_provider == "" ? null : data.service_provider;
            var conversation = {
                created_by: models.uuidFromString(data.createdBy),
                group_keyspace: data.ecosystem,
                privacy: data.grpprivacy,
                participants_admin: data.adminList,
                service_provider: data.service_provider,
                participants: data.memberList,
                title: data.groupName,
                conv_img : data.conv_img,
                topic_type: data.topic_type,
                b_unit_id: data.b_unit_id,
                tag_list: data.readyTag
            };
            
            var validateCheck = [
              ckEmpty('Conversation Image', data.conv_img),
              ckEmpty('Title', data.groupName),
              ckEmpty('Privacy', data.grpprivacy),
              ckEmpty('Created By', data.createdBy),
              ckEmpty('Workspace Name', data.ecosystem)
            ];
            
            if(returnValid(validateCheck)){
              models.instance.Conversation.update({conversation_id: models.uuidFromString(data.conversation_id), company_id: models.timeuuidFromString(data.company_id)}, conversation, update_if_exists, function(error){
                if(error) {console.log(378) 
                  callback({status:false, err: error});}
                else {
                  console.log(381, data.memberList);
                  conversation.conversation_id = data.conversation_id;
                  var pn = [];
                  for(var i=0; i<data.memberList.length; i++){
                      pn.push(alluserOnLoad[data.memberList[i]]);
                  }
                  conversation.participants_name = pn;
                  console.log(384, pn);
                  console.log(385, conversation.participants_name);
                  callback({status: true, conversation});
                }
              });
            }else{
              console.log(386)
              callback({status:false, err: validateCheck});
            }
          }
    }
  });
};


function ckEmpty(key,value){
    var data = {};
    if(validator.isEmpty(value)){
        data.msg = key+' is required.';
        data.status = false;
    }else{
        data.msg = key+' is valid.';
        data.status = true;
    }

    return data;
}
function returnValid(array){
    var status = true;
  
    var i;
    for (i = 0; i < array.length; i++) { 
      if(status){
        if(array[i].status){
          status = true;
        }else{
          status = false;
        }
        if(i+1 == array.length){
  
          return status;
        }
  
      }else{
        status = false;
        return status;
      }
    }
  }

  var join_new_group =(data,callback)=>{
    console.log("**********************************");
    console.log(data);
    console.log("**********************************");
    models.instance.Conversation.update(
      { conversation_id: models.uuidFromString(data.conversation_id), company_id: models.timeuuidFromString(data.company_id) },
      {
        participants: { $add: [data.targetID] },
      }, update_if_exists,
      function(err) {
        if (err) {
          if (err) {console.log(err); callback({status: false, err: err})}
        } else {
          callback({status:true,data:data});
        }
      }
    );
  }
  
  var team_base_user_lists =(data, callback)=>{
    console.log("team_base_user_lists", data);
    
    models.instance.Team.findOne({team_id: models.timeuuidFromString(data.team_id)}, function(err, teamdata) {
        if (err) {
          if (err) {console.log(err); callback({status: false, err: err})}
        } else {
          models.instance.Users.find({company_id: models.timeuuidFromString(data.company_id)}, {raw:true, allow_filtering: true}, function(uerr, userdata){
            if(uerr){console.log(uerr); callback({status: false, err: uerr})}
            else{
              var users = [];
              _.forEach(userdata, function(val, k){
                  if((teamdata.participants).indexOf(val.id.toString()) > -1)
                    users.push({id: val.id, email: val.email, fullname: val.fullname, img: val.img });
              });
              callback({status:true, users});
            }
          })
        }
      }
    );
  }
module.exports = {
    getAllConversation,
    getAllMsg,
    set_status,
    getAllpinUnpinList,
    getAllMuteList,
    remove_gcm_id,
    createGroupAndroid,
    updateGroupAndroid,
    join_new_group,
    team_base_user_lists
};
