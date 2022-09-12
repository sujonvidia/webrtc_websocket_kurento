var app = require('express');
var router = app.Router();
var _ = require('lodash');

var {models} = require('./../config/db/express-cassandra');
var {getReplayConvData, getUnreadReplayMsg} = require('./reply_helper');

var validator = require('validator');
const { reject } = require('async');

function idToNameArr(idArry){
  var namearr = [];
  _.each(idArry, function(v,k){
    namearr.push(alluserOnLoad[v])
  });
  return namearr;
}

var saveConversation = (created_by, participants, title,company_id, callback) => {
  var conversation_id = models.uuid();
  var conversation = new models.instance.Conversation({
    conversation_id: conversation_id,
    created_by: models.uuidFromString(created_by),
    participants: participants,
    title: title,
    company_id:  models.timeuuidFromString(company_id),
    conference_id : models.timeuuid().toString() + '_group'
  });
  conversation.saveAsync().then(function() {
    callback({status:true, conversation_id});
  }).catch(function(err) {
    callback({status:false, err: err});
  });
};

function root_conv_check_and_update_if_req(company_id, root_conv_id, members,type){
  try{
    root_conv_id = root_conv_id.toString();
    var need_add = [];
    models.instance.Conversation.find({conversation_id: models.uuidFromString(root_conv_id), company_id: models.timeuuidFromString(company_id)}, function(err, conv){
      if(err) throw err;
      if(conv.length == 1){
        _.forEach(members, function(v, k){
          if(conv[0].participants.indexOf(v) == -1){
            need_add.push(v);
          }
        });
        if(need_add.length > 0){
          var updateQuery = {}
          // if(type == 'guest'){
          //   updateQuery = {participants: {$add: need_add}, participants_guest: {$add: need_add} }
          // }else{
            
          // }
          updateQuery = {participants: {$add: need_add}, participants_sub: {$add: need_add} }
          models.instance.Conversation.update({conversation_id: models.uuidFromString(root_conv_id), company_id: models.timeuuidFromString(company_id)}, updateQuery, update_if_exists, function(error){
            if(error) throw error;
            return true;
          });
        }
      }else{
        return false;
      }
    });
  }catch(e){
    console.log(41, e);
    return false;
  }
}

function has_root_conv(conv_id, comid){
  return new Promise((resolve,reject)=>{
    models.instance.Conversation.find({conversation_id: models.uuidFromString(conv_id), company_id: models.timeuuidFromString(comid)}, function(err,result){
      if(err){
        console.log(err);
        reject({status: false});
      }
      else if(result.length > 0){
        resolve({status: true, root_id: result[0].root_conv_id});
      }else{
        reject({status: false});
      }
    })
  })
}

var createGroup = (adminList,memberList,groupName,createdBy,ecosystem,grpprivacy,conv_img,topic_type,b_unit_id,b_unit_name,alltags,temTNA,readyTag,service_provider,company_id,root_conv_id = null,callback) =>{
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(company_id)+" AND title like '"+groupName+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr) {
      console.log(28,cerr);
      callback({status:false, err: cerr});
    }else{
          console.log('exist room length:',cresult.rows.length);

          if(cresult.rows.length > 0){
            callback({status:true, exist:true,data:cresult.rows});
          }else{
            var conversation_id = models.uuid();
            var conversation = new models.instance.Conversation({
                conversation_id: conversation_id,
                created_by: models.uuidFromString(createdBy),
                group: 'yes',
                group_keyspace:ecosystem,
                privacy:grpprivacy,
                single: 'no',
                participants_admin: adminList,
                service_provider:service_provider,
                participants: memberList,
                title:groupName,
                conv_img : conv_img,
                topic_type:topic_type,
                b_unit_id:b_unit_id,
                tag_list:readyTag,
                company_id:models.timeuuidFromString(company_id),
                conference_id : models.timeuuid().toString() + '_group',
                root_conv_id:root_conv_id
            });

            var tagTitle = [topic_type,groupName,b_unit_name,ecosystem];
            var queries = [];
            var tags = [];
            var newTaglist = [];
            var convTQ = [];
            var tagListArray = [];

            var allOldTitle = [];
            // _.each(alltags,function(va,ka){
            //   if(readyTag.indexOf(va.tag_id) > -1){
            //     var id = models.uuid();
            //     var tag2 = new models.instance.Convtag({
            //       id: id,
            //       tag_id: models.uuidFromString(va.tag_id),
            //       conversation_id: conversation_id
            //     });
            //     var save_query = tag2.save({return_query: true});
            //     convTQ.push(save_query);
            //   }
            //   allOldTitle.push(va.title);
            // });

          // _.each(tagTitle, function(v, k) {
          //   var newTag = v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
          //       newTag = newTag.replace(/\s/g, '');


          //   _.each(alltags,function(va,ka){
          //     if(va.title.toLowerCase() == newTag){

          //       tags.push(va.tag_id.toString());
          //     }
          //   });

            // if(allOldTitle.indexOf(newTag) == -1){

            //   var tag_id = models.uuid();
            //   var tag = new models.instance.Tag({
            //     tag_id: tag_id,
            //     tagged_by: models.uuidFromString(createdBy),
            //     title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
            //     type: 'CONNECT',
            //     visibility: 'hidden'
            //   });
            //   var save_query = tag.save({return_query: true});
            //   queries.push(save_query);
            //   tags.push(tag_id);
            //   newTaglist.push({
            //     tag_id: tag_id,
            //     tagged_by: models.uuidFromString(createdBy),
            //     title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
            //     type: 'CONNECT',
            //     visibility: 'hidden'
            //   })
            //   tagListArray.push({
            //     tag_id: tag_id,
            //     tagged_by: models.uuidFromString(createdBy),
            //     title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
            //     type: 'CONNECT',
            //     visibility: 'hidden'
            //   })
            // }

          // });

        //  _.each(temTNA,function(v,k){
        //     if(allOldTitle.indexOf(v) == -1 && tagTitle.indexOf(v) == -1){
        //       var tag_id = models.uuid();
        //       var tag = new models.instance.Tag({
        //         tag_id: tag_id,
        //         tagged_by: models.uuidFromString(createdBy),
        //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
        //         type: 'CONNECT',
        //         visibility:'visible'
        //       });
        //       var save_query = tag.save({return_query: true});
        //       queries.push(save_query);
        //       tags.push(tag_id);
        //       newTaglist.push({
        //         tag_id: tag_id,
        //         tagged_by: models.uuidFromString(createdBy),
        //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
        //         type: 'CONNECT',
        //         visibility:'visible'
        //       });
        //       tagListArray.push({
        //         tag_id: tag_id,
        //         tagged_by: models.uuidFromString(createdBy),
        //         title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
        //         type: 'CONNECT',
        //         visibility:'visible'
        //       })
        //     }
        //   })
        var condtagsid = [];

          // _.each(tags,function(v,k){
          //   console.log(v);
          //   var id = models.uuid();
          //   var tag2 = new models.instance.Convtag({
          //     id: id,
          //     tag_id: models.uuidFromString(v.toString()),
          //     conversation_id: conversation_id
          //   });
          //   var save_query = tag2.save({return_query: true});
          //   convTQ.push(save_query);
          //   _.each(tagListArray,function(vu,ku){
          //     if(vu.tag_id == v){

          //       condtagsid.push({cnvtagid:id,roomid:conversation_id,tagTitle:vu.title,tagid:vu.tag_id,visibility:vu.visibility});
          //     }

          //   });
          // });
          // models.doBatch(queries, function(err){
          //     if(err){ throw err;}
          //     else {

          //       models.doBatch(convTQ, function(err2){
          //         if(err2){ throw err2;}
          //         else {
          //           console.log({status:true});
          //         }
          //     });
          //     }
          // });


            var validateCheck = [
              ckEmpty('Conversation Image',conv_img),
              ckEmpty('Title',groupName),
              ckEmpty('Privacy',grpprivacy),
              ckEmpty('Created By',createdBy),
              ckEmpty('Workspace Name',ecosystem)
            ];

            if(returnValid(validateCheck)){
              conversation.saveAsync().then(function() {
                if(root_conv_id != null){
                  root_conv_check_and_update_if_req(company_id, root_conv_id, memberList,'');
                }
                callback({status:true, conversation_id,tags:newTaglist,condtagsid:condtagsid, exist:false});
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

function getOnlyReplayConvData(conv_id){
  return new Promise((resolve,reject)=>{
    models.instance.ReplayConv.find({conversation_id:conv_id},{raw:true, allow_filtering: true},function(err,result){
      if(err){
        console.log(err);
        reject('errr');
      }else{
        resolve(result)
      }
    })
  })
}

function findMyConvMsg(params){
  return new Promise((resolve,reject)=>{
    if(params.type == 'contains'){
      models.instance.Messages.find({msg_status:{$contains:params.data}},{raw:true, allow_filtering: true},function(err,result){
        if(err){
          console.log(err);
          reject('errr');
        }else{
          resolve(result)
        }
      })
    }else if(params.type == 'arraymsg'){
      models.instance.Messages.find({msg_id:{$in:params.data}},{raw:true, allow_filtering: true},function(err,result){
        if(err){
          console.log(err);
          reject('errr');
        }else{
          resolve(result)
        }
      })
    }else{
      console.log(341, params);
      let query = {
        conversation_id:params.data, 
        $limit:20
      };
      if(params.request_type.request_type !== undefined){
        if(params.request_type.request_type == 'checklist'){
          query.msg_type = 'checklist';
        }
        else if(params.request_type.request_type == 'call'){
          query.msg_type = 'call';
        }
        else if(params.request_type.request_type == 'flag'){
          query.has_flagged = { $contains: params.request_type.user_id };
        }
      }
      
      models.instance.Messages.find(query, {raw:true, allow_filtering: true}, async function(err,result){
        if(err){
          console.log(err);
          reject('errr');
        }else{
			var msg_ids = [];
			if(result.length > 0){
				_.each(result, function(v, k){
					v.unread_reply = 0;
					if(v.has_reply > 0) msg_ids.push(v.msg_id);
				});
				if(msg_ids.length > 0){
					var rep_ids = await getReplayConvData(query.conversation_id, msg_ids);
					var convids = [];
					_.each(rep_ids, function(vv, kk){
						convids.push(vv.rep_id);
					});
					var rep_msgs = await getUnreadReplayMsg(convids, params.request_type.user_id);
					if(rep_msgs.length > 0){
						_.each(rep_ids, function(v, k){
							v.unread_reply = 0;
							_.each(rep_msgs, function(vv, kk){
								if(vv.conversation_id.toString() == v.rep_id.toString())
									v.unread_reply++;
							});
						});
						
						_.each(result, function(v, k){
							_.each(rep_ids, function(vv, kk){
								if(vv.msg_id.toString() == v.msg_id.toString())
									v.unread_reply = vv.unread_reply;
							});
						});
					}
					console.log(400, rep_ids);
				}
			}
			resolve(result)
        }
      })
    }
  })
}

var  findConversationHistory = async (conversation_id,request_type = {}, callback) =>{
  // models.instance.Messages.find({conversation_id: conversation_id, $orderby:{ '$desc' :'msg_id' }, $limit:20}, {raw:true, allow_filtering: true}, function(err, conversation){
  // // models.instance.Messages.find({conversation_id: conversation_id}, {raw:true, allow_filtering: true}, function(err, conversation){
  //   if(err){
  //     callback({status: false, err: err});
  //   }else{
  //     console.log('line 49 conversation length = ', conversation.length);
  //     callback({status: true, conversation: conversation});
  //   }
  // });
  var allRepConv = [];
  var all_has_rep_msg_id = [];
  var all_has_rep_convids = [];
  var conversation =  [];
  var hasRepConvids =  [];
  var hasRepmsg_ids =  [];
  if(request_type == null){
    request_type = {};
  }
  if(request_type.request_type == 'threaded_msg'){
    allRepConv = await getOnlyReplayConvData(conversation_id);
    for(let i = 0; i<allRepConv.length; i++){
      if(all_has_rep_convids.indexOf(allRepConv[i].rep_id.toString()) == -1){
        all_has_rep_convids.push(allRepConv[i].rep_id.toString());
        all_has_rep_msg_id.push(models.timeuuidFromString(allRepConv[i].msg_id.toString()));
      }
    }
    var mymsg = await findMyConvMsg({data:request_type.user_id,type:'contains', request_type});
    if(all_has_rep_msg_id.length > 0){
      mymsg2 = await findMyConvMsg({data:all_has_rep_msg_id,type:'arraymsg', request_type});
    }
    var allMsg_idsForcheck = [];

    for(let i = 0; i<mymsg.length; i++){
      allMsg_idsForcheck.push(mymsg[i].msg_id.toString());
    }
    for(let i = 0; i < mymsg2.length; i++){
      if(allMsg_idsForcheck.indexOf(mymsg2[i].msg_id.toString()) == -1){
        mymsg.push(mymsg2[i])
      }
    }

    
    for(let i =0; i<mymsg.length; i++){
      if(all_has_rep_convids.indexOf(mymsg[i].conversation_id.toString()) > -1 || mymsg[i].conversation_id == conversation_id ){
        if(mymsg[i].msg_status == null){
          mymsg[i].msg_status = [];
        }
        if(mymsg[i].msg_status.indexOf(request_type.user_id.toString()) > -1){
          console.log(323,mymsg[i].conversation_id)
          if(hasRepConvids.indexOf(mymsg[i].conversation_id.toString()) == -1){
            hasRepConvids.push(mymsg[i].conversation_id.toString());
          }
        }
      }
    }
    for(let i = 0; i<allRepConv.length;i++){
      if(hasRepConvids.indexOf(allRepConv[i].rep_id.toString()) > -1){
        if(hasRepmsg_ids.indexOf(allRepConv[i].msg_id.toString()) == -1){
          hasRepmsg_ids.push(allRepConv[i].msg_id.toString());
        }
      }
    }
    for(let i = 0; i<mymsg.length;i++ ){
        if(hasRepmsg_ids.indexOf(mymsg[i].msg_id.toString()) > -1){
          conversation.push(mymsg[i])
        }
    }
    console.log(341,conversation.length,hasRepConvids.length,hasRepmsg_ids.length,mymsg.length)
  }else{
    conversation = await findMyConvMsg({data:conversation_id,type:'limit', request_type});
  }
 

  models.instance.File.find({ conversation_id: models.uuidFromString(conversation_id.toString()), is_delete: 0}, { raw: true, allow_filtering: true }, function (ferr, files) {
    if (ferr) {
      console.log(269, conversation.length)
      callback({status: false, err: ferr});
    } else {
      console.log(271, conversation.length)
      var checklistMsgId = [];
      _.each(conversation,function(v,k){
        if(v.msg_type == 'checklist'){
          checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
        }
      });

      if(checklistMsgId.length > 0){
        var query = {
            msg_id: {'$in': checklistMsgId}
        };
        models.instance.MessageChecklist.find(query,{raw:true, allow_filtering: true},function(cerror,cresult){
          if(cerror){
            callback({status: false, error: cerror});
          }else{
            callback({status: true, conversation: conversation, files: files, checklist:cresult});
          }
        });
      }else{
        callback({status: true, conversation: conversation, files: files});
      }
    }
  });

};

var checkAdmin = (conversation_id,useruuid, callback) =>{
  models.instance.Conversation.find({conversation_id: models.timeuuidFromString(conversation_id),created_by: models.timeuuidFromString(useruuid)}, {raw:true, allow_filtering: true}, function(err, conversation){
    if(err){
      callback({status: false, err: err});
    }else{
      callback({status: true, conversation: conversation});
    }
  });
};

var check_only_Creator_or_admin = (conversation_id, useruuid, callback) =>{
  var query = {
    participants_admin: { $contains: useruuid },
    conversation_id: { $eq: models.uuidFromString(conversation_id) }
  };

  models.instance.Conversation.find(query,{ raw: true, allow_filtering: true }, function(err, conversation) {
    if(err){
      console.log("This is err",err);
      callback({status: false, err: err});
    }else{
      callback({status: true, conversation_id: conversation});
    }
  });
};


var createPersonalConv = (myID, frndID, ecosystem,company_id, callback) =>{
  console.log(311,myID, frndID, ecosystem,company_id);
  var query = {
    participants: { $contains: myID},
    group: { $eq: 'no' },
    single: { $eq: 'yes' }
  };

  models.instance.Conversation.find(query,{ raw: true, allow_filtering: true }, function(err, conversation) {
    if(err){
      console.log("This is err",err);
      callback({status: false, err: err});
    }else{
      console.log(319, conversation);
      var resultCount = 0;
      var resultArray = 0;
      var ownCount = 0;

      if(myID === frndID){
        _.each(conversation, function(v, k) {
          if(v.participants.length == 1){
            if(v.participants[0]== frndID){
              resultArray = v.conversation_id;
            }
          }else{
            ownCount++;
          }
        });

        if(parseInt(ownCount) === parseInt(conversation.length)){
          var conversation_id = models.uuid();
          var memberList = [myID,frndID];
          var conversation = new models.instance.Conversation({
              conversation_id: conversation_id,
              created_by: models.uuidFromString(myID),
              group: 'no',
              group_keyspace:ecosystem,
              privacy:'private',
              single: 'yes',
              participants: memberList,
              title: 'Personal',
              company_id:  models.timeuuidFromString(company_id),
              conference_id : models.timeuuid().toString() + '_group'
          });
          conversation.saveAsync().then(function() {
            callback({status:true, conversation_id});
          }).catch(function(err) {
            callback({status:false, err: err});
          });
        }else{
          callback({status: true, conversation_id: resultArray});
        }

      }else{
        _.each(conversation, function(v, k) {

          var result = _.find(v.participants, function (str, i) {
            if (str.match(frndID)){
              return true;
            }
          });

          if(result !== undefined){
            resultCount++;
            resultArray = v.conversation_id;
          }
        });

        if(resultCount>0){
          callback({status: true, conversation_id: resultArray});
        }else{
          var conversation_id = models.uuid();
          var memberList = [myID,frndID];
          var conversation = new models.instance.Conversation({
              conversation_id: conversation_id,
              created_by: models.uuidFromString(myID),
              group: 'no',
              group_keyspace:ecosystem,
              privacy:'private',
              single: 'yes',
              participants: memberList,
              title: 'Personal',
              company_id:  models.timeuuidFromString(company_id),
              conference_id : models.timeuuid().toString() + '_group'
          });
          conversation.saveAsync().then(function() {
            callback({status:true, conversation_id});
          }).catch(function(err) {
            callback({status:false, err: err});
          });
        }
      }
    }
  });
};

var createPersonalConv2 = (myID, frndID, ecosystem,company_id, callback) =>{
  console.log(398);
  if(myID == frndID){
    console.log(400);
    callback({status: true, conversation_id: models.uuidFromString(myID)});
  }
  else{
    console.log(403);

    var query = {
      participants: { $contains: myID},
      group: { $eq: 'no' },
      single: { $eq: 'yes' },
      company_id: { $eq: models.timeuuidFromString(company_id)}
    };

    models.instance.Conversation.find(query,{ raw: true, allow_filtering: true }, function(err, conversation) {
      if(err){
        console.log("This is err",err);
        callback({status: false, err: err});
      }else{
        var resultCount = 0;
        var resultArray = 0;
        // console.log(420, conversation);
        if(conversation.length > 0){
          _.each(conversation, function(v, k) {
            if(v.participants.indexOf(frndID)>-1 && v.participants.length <= 2){
              console.log(423, v.conversation_id);
              resultCount++;
              callback({status: true, conversation_id: v.conversation_id,data:v});
            }
          });
          if(resultCount == 0){
            var conversation_id = models.uuid();
            var memberList = [myID,frndID];
            var conversation = new models.instance.Conversation({
                conversation_id: conversation_id,
                created_by: models.uuidFromString(myID),
                group: 'no',
                group_keyspace:ecosystem,
                privacy:'private',
                single: 'yes',
                participants: memberList,
                title: 'Personal',
                company_id:  models.timeuuidFromString(company_id),
                conference_id : models.timeuuid().toString() + '_group'
            });
            conversation.saveAsync().then(function() {
              callback({status:true, conversation_id});
            }).catch(function(err) {
              callback({status:false, err: err});
            });
          }
        }else{
          var conversation_id = models.uuid();
          var memberList = [myID,frndID];
          var conversation = new models.instance.Conversation({
              conversation_id: conversation_id,
              created_by: models.uuidFromString(myID),
              group: 'no',
              group_keyspace:ecosystem,
              privacy:'private',
              single: 'yes',
              participants: memberList,
              title: 'Personal',
              company_id:  models.timeuuidFromString(company_id),
              conference_id : models.timeuuid().toString() + '_group'
          });
          conversation.saveAsync().then(function() {
            callback({status:true, conversation_id});
          }).catch(function(err) {
            callback({status:false, err: err});
          });
        }
      }
    });

  }
};

var findConvDetail = (conversationid, callback) =>{
  models.instance.Conversation.find({conversation_id: models.uuidFromString(conversationid) }, function(err, conversationDetail) {
    if (err) throw err;
    else callback({status:true, conversationDetail: conversationDetail});
  });
};

var saveNewGroup = (conversationMemList,ecosystem,crtUserID,company_id, callback) =>{
  var conversation_id = models.uuid();
  var conversation = new models.instance.Conversation({
      conversation_id: conversation_id,
      created_by: models.uuidFromString(crtUserID),
      group: 'yes',
      group_keyspace:ecosystem,
      privacy:'private',
      single: 'no',
      participants: conversationMemList,
      title: 'Group',
      company_id:  models.timeuuidFromString(company_id),
      conference_id : models.timeuuid().toString() + '_group'
  });
  conversation.saveAsync().then(function() {
    callback({status:true, conversation_id});
  }).catch(function(err) {
    callback({status:false, err: err});
  });
};

var updateGroupName = (conversationid,newGroupname,user_id,company_id, callback) =>{
  var query_object = {conversation_id: models.uuidFromString(conversationid), company_id: models.timeuuidFromString(company_id)};
  var gname = (newGroupname == '' ? 'Group':newGroupname);
  var update_values_object = {title: gname};
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(company_id)+" AND title like '"+gname+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr){
      console.log(cerr);
    }else{
      if(cresult.rows.length > 0){
        callback({status:false,exist:true,data:cresult.rows})
      }else{
        models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
      }
    }
  });

};

var room_name_exist = (data, callback) =>{
  var gname = (data.room_name == '' ? 'Group': data.room_name);
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(data.company_id)+" AND title like '"+gname+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr){
      console.log(cerr);
    }else{
      if(cresult.rows.length > 0){
        callback({status:false, exist:true, data:cresult.rows})
      }
      else{
        callback({status:true, exist:false, data: []});
      }
    }
  });
};

var updateKeySpace = (conversation_id,keySpace,user_id,company_id, callback) =>{
  var query_object = {conversation_id: models.uuidFromString(conversation_id), company_id: models.timeuuidFromString(company_id)};
  var update_values_object = {group_keyspace: keySpace};
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err){
      if(err) callback({status:false, err: err});
      else callback({status:true});
  });
};

var updatePrivecy = (conversation_id,grpprivacy,user_id,company_id, callback) =>{
  var query_object = {conversation_id: models.uuidFromString(conversation_id),company_id: models.timeuuidFromString(company_id)};
  var update_values_object = {privacy: grpprivacy};
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err){
      if(err) callback({status:false, err: err});
      else callback({status:true});
  });
};

var updateRoomimg = (conversation_id,roomName,user_id,company_id, callback) =>{
  var query_object = {conversation_id: models.uuidFromString(conversation_id), company_id: models.timeuuidFromString(company_id)};
  var update_values_object = {conv_img: roomName};
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err){
      if(err) callback({status:false, err: err});
      else callback({status:true});
  });
};

var topicTag = (fromAddTopic,fromAddmsgid,str,created_by,conversation_id,callback) => {
  if(str != ""){
    var topic_id = models.uuid();
    var tag = new models.instance.ConnectTopic({
      topic_id: topic_id,
      conversation_id : models.uuidFromString(conversation_id),
      tagged_by: models.uuidFromString(created_by),
      title: str.replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''),
      type: 'CONNECT'
    });

    tag.saveAsync().then(function() {
      if(fromAddTopic == 1){
        var mid = models.timeuuid();
        var mtag = new models.instance.MessagesTag({
          id: mid,
          tag_title: [str],
          tagged_by: models.uuidFromString(created_by),
          conversation_id: models.uuidFromString(conversation_id),
          message_id: models.timeuuidFromString(fromAddmsgid),
          tagged_type: 'topic'
        });

        mtag.saveAsync().then(function() {
          callback({status:true, topic_id});
        }).catch(function(err) {
          callback({status:false, err: err});
        });
      }else{
        callback({status:true, topic_id});
      }

    }).catch(function(err) {
      callback({status:false, err: err});
    });
  }else{
    callback({'status': false});
  }
};

var getFilterMessage = (data,callback) =>{
  var query_object = {
    conversation_id: models.uuidFromString(data.conversation_id),
    tagged_type: {'$eq': 'topic'}
  };
  var msgid = [];
  models.instance.MessagesTag.find(query_object,{ raw: true, allow_filtering: true },function(err,result){
    if(err){
      console.log(err);
    }else{
      if(result.length > 0){
        _.each(result, function(v, k) {
          if(v.tag_title != '' && v.tag_title != null){
            if(v.tag_title.indexOf(data.topictitle) > -1){
              msgid.push(v.message_id);
            }
          }
        });

        if (msgid.length > 0) {
          var messid = new Set();
          _.forEach(msgid, function(val, k){
              messid.add(models.timeuuidFromString(val.toString()));
          });
          var msgarray = Array.from(messid);
          var query = {
              conversation_id: {$eq: models.uuidFromString(data.conversation_id)},
              msg_id: {'$in': msgarray}
          };
          models.instance.Messages.find(query,{ raw: true, allow_filtering: true },function(err,result){
            if(err){
              callback({status:false});
            }else{
              callback({status:true,data:result});
            }
          })
        }else{
          callback({status:false});
        }

      }else{
        callback({status:false});
      }
    }
  });

}



var topicTagItemDelete = (tagid,tagTitle,conversation_id,callback) =>{
  var query_object = {
    conversation_id: models.uuidFromString(conversation_id),
    tagged_type: {'$eq': 'topic'}
  };
  var topicIDmsgid = [];
  var msgid = [];
  models.instance.MessagesTag.find(query_object,{ raw: true, allow_filtering: true },function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      console.log(result.length);
      if(result.length > 0){
        _.each(result, function(v, k) {
          if(v.tag_title != '' && v.tag_title != null){
            if(v.tag_title.indexOf(tagTitle) > -1){
              topicIDmsgid.push(v.id);
              msgid.push(v.message_id);
            }
          }
        });

        if (topicIDmsgid.length > 0) {
          var mqueries = [];
          _.each(topicIDmsgid, function (v, k) {
            var update_query = models.instance.MessagesTag.update(
              { id: v },
              { tag_title: { $remove: [tagTitle] } },
              { if_exists: true, return_query: true }
            );
            mqueries.push(update_query);
          });

          models.doBatch(mqueries, function (err) {
            if (err) { throw err; }
            else {
              var query_object = {
                topic_id: { $eq:  models.uuidFromString(tagid)}
              };
              models.instance.ConnectTopic.delete(query_object, function (err) {
                if (err){
                  callback({ status: false});
                }else {
                  callback({ status: true,topicIDmsgid:topicIDmsgid,msgid:msgid});
                }
              });
            }
          });
        }else{
          var query_object = {
            topic_id: { $eq:  models.uuidFromString(tagid)}
          };
          models.instance.ConnectTopic.delete(query_object, function (err) {
            if (err){
              callback({ status: false});
            }else {
              callback({ status: true,topicIDmsgid:topicIDmsgid,msgid:msgid});
            }
          });
        }

      }else{
        var query_object = {
          topic_id: { $eq:  models.uuidFromString(tagid)}
        };
        models.instance.ConnectTopic.delete(query_object, function (err) {
          if (err){
            callback({ status: false});
          }else {
            callback({ status: true,topicIDmsgid:topicIDmsgid});
          }
        });
      }
    }
  });
}

var TopicMessagesTag = (mstagid, roomid, created_by, tagTitle, callback) => {
  if(mstagid != ''){
    var mid = models.timeuuid();
    var mtag = new models.instance.MessagesTag({
      id: mid,
      tag_title: tagTitle,
      tagged_by: models.uuidFromString(created_by),
      conversation_id: models.uuidFromString(roomid),
      message_id: models.timeuuidFromString(mstagid),
      tagged_type: 'topic'
    });

    mtag.saveAsync().then(function() {
      callback({status:true, mid});
    }).catch(function(err) {
      callback({status:false, err: err});
    });
  }
}

var saveTag = (mstagids, roomid, messgids, created_by, tagTitle, tagType, callback) => {

  var queries = [];
  var tags = [];
  var mtagsid = [];

  _.each(tagTitle, function(v, k) {
    var tag_id = models.uuid();
    var tag = new models.instance.Tag({
      tag_id: tag_id,
      tagged_by: models.uuidFromString(created_by),
      title: v.replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''),
      type: tagType
    });
    var save_query = tag.save({return_query: true});
    queries.push(save_query);
    tags.push(tag_id);

  });

  models.doBatch(queries, function(err){
      if(err){ throw err;}
      else {
        if (messgids.length > 0) {
          if (mstagids.length > 0) {
            var mqueries = [];
            _.each(mstagids, function (v, k) {
              var update_query = models.instance.MessagesTag.update(
                { id: models.timeuuidFromString(v) },
                { tag_title: { $add: tagTitle } },
                { if_exists: true, return_query: true }
              );
              mqueries.push(update_query);
              mtagsid.push(v);
            });
          } else {
            var mqueries = [];
            _.each(messgids, function (v, k) {
              var mid = models.timeuuid();
              var mtag = new models.instance.MessagesTag({
                id: mid,
                tag_title: tagTitle,
                tagged_by: models.uuidFromString(created_by),
                conversation_id: models.uuidFromString(roomid),
                message_id: models.timeuuidFromString(v)
              });
              var msave_query = mtag.save({ return_query: true });
              mqueries.push(msave_query);
              mtagsid.push(mid);
            });
          }

          models.doBatch(mqueries, function (err) {
            if (err) { throw err; }
            else {
              callback({ status: true, tags: tags, mtagsid: mtagsid });
            }
          });
        } else {
          callback({ status: true, tags: tags });
        }

      }
  });
};

var filesTag = (message_id,conversation_id,tagged_by,tag_title,callback) =>{
  var mid = models.timeuuid();
  var mtag = new models.instance.MessagesTag({
    id: mid,
    tag_title: tag_title,
    tagged_by: models.uuidFromString(tagged_by),
    conversation_id: models.uuidFromString(conversation_id),
    message_id: message_id
  });

  mtag.saveAsync().then(function() {
    callback({status:true, id:mid});
  }).catch(function(err) {
    callback({status:false, err: err});
  });
};

// var findMsgIDs = (roomid,userid,callback)=>{
//   models.instance.MessagesTag.find({conversation_id: models.uuidFromString(roomid),tagged_by: models.uuidFromString(userid)}, function(err, conversationDetail) {
//     if (err) throw err;
//     else callback({status:true, conversationDetail: conversationDetail});
//   });
// }

var saveConTag = (tagid, roomid, callback) => {

  var queries = [];
  var tags = [];
  var roottags = [];
  var messagesTagQuries = [];

  _.each(tagid, function(v, k) {
    var id = models.uuid();
    var tag = new models.instance.Convtag({
      id: id,
      tag_id: v,
      conversation_id: models.uuidFromString(roomid)
    });

    var save_query = tag.save({return_query: true});
    queries.push(save_query);

    //Loop for save tag to users or rooms in tag table (END HERE)
    tags.push(id); // used for tag in convTag table
    roottags.push(v); // root tag mean
  });

  models.doBatch(queries, function(err){
      if(err){ throw err;}
      else {
        callback({status:true,tags:tags,roottags:roottags});
      }
  });

};

var saveConvD = (mstagids,tagTitle,tag_id,roomID, callback) => {
  var mtagsid = [];
  var id = models.uuid();
  var tag = new models.instance.Convtag({
    id: id,
    tag_id: models.uuidFromString(tag_id),
    conversation_id: models.uuidFromString(roomID)
  });
  tag.saveAsync().then(function() {
    if(mstagids.length == 0){
      callback({status:true,id:id,rootid:tag_id});
    }else{
      if(mstagids.length > 0){
        var mqueries = [];
        _.each(mstagids, function(v, k) {
          var update_query = models.instance.MessagesTag.update(
            {id: models.timeuuidFromString(v)},
            {tag_title: { $add: [tagTitle]} },
            {if_exists:true, return_query: true}
          );
          mqueries.push(update_query);
          mtagsid.push(v);
        });

        models.doBatch(mqueries, function(err){
          if(err){ throw err;}
          else {
            callback({status:true,id:id,rootid:tag_id});
          }
        });
      }
    }
  }).catch(function(err) {
    callback({status:false, err: err});
  });
};

var findtag = (conversation_id,title, callback) =>{
  models.instance.Tag.find({tagged_by: models.uuidFromString(conversation_id),title: title}, {raw:true, allow_filtering: true}, function(err, tagDet){
    if(err){
      callback({status: false, err: err});
    }else{
      callback({status: true, tagDet: tagDet});
    }
  });
};

var getAllTagData = (tagid, callback) =>{
  models.instance.Convtag.find({tag_id: models.uuidFromString(tagid)}, {raw:true, allow_filtering: true}, function(err, tagDet){
    if(err){
      callback({status: false, err: err});
    }else{
      callback({status: true, tagDet: tagDet});
    }
  });
};

var getAllTagsforList = (myconversation_list,callback) =>{
  var c_id = new Set();
  _.forEach(myconversation_list, function(val, k){
    c_id.add(models.uuidFromString(val));
  });
  var msgarray = Array.from(c_id);
  var promises = [];
  var itemRows = msgarray;
  for(var i = 0; i < itemRows.length; i++) {
    var id = itemRows[i];
    var p = new Promise(function(resolve, reject){dbData(id, resolve, reject);});
    promises.push(p);
  }
  Promise.all(promises).then(function(data) {
    callback({status:true, data:data});
  });
}

var dbData = (id, resolve, reject)=>{

  var query = {
      conversation_id: {'$eq': id}
  };

  models.instance.Convtag.find(query, { raw: true, allow_filtering: true }, function(error, all_msg){
    if(error) {
        return reject();
    }else{
        return resolve(all_msg);
    }
  });
};


var deleteUnusedTag = (tagid, roomid, tagTitle, type, callback) =>{

  var query_object = {
    tag_id: models.timeuuidFromString(tagid)
  };
  models.instance.Tag.delete(query_object, function(err){
    if(err) {
      callback({status: false});
    }else {
      if (type == 'task') {
        callback({ status: true });
      }else{
        removeMessageTag(roomid, tagTitle)
          .then((res) => { callback({ status: true });})
          .catch((err)=>{console.log(err)});
      }
    }
  });
};

function removeMessageTag(conversationid, tagTitle){
  return new Promise((resolve,reject)=>{
    models.instance.MessagesTag.find({ conversation_id: models.uuidFromString(conversationid) }, { raw: true, allow_filtering: true }, function (err, mstagids) {
      if (err) {
        reject({ status: false, err: err });
      } else {

        if (mstagids.length > 0) {
          var mqueries = [];
          _.each(mstagids, function (v, k) {
            var update_query = models.instance.MessagesTag.update(
              { id: v.id },
              { tag_title: { $remove: [tagTitle] } },
              { if_exists: true, return_query: true }
            );
            mqueries.push(update_query);
          });

          models.doBatch(mqueries, function (err) {
            if (err) { throw err; }
            else {
              resolve({ status: true});
            }
          });
        }


      }
    });
  });
}

function checkParticipants(conversation_id) {

  return new Promise((resolve, reject) => {
    models.instance.Conversation.findOne({ conversation_id: models.uuidFromString(conversation_id.toString())}, { raw: true, allow_filtering: true }, function (err, conversation) {
      if (err) {
        reject({ status: false, err: err });
      } else {
        resolve({ status: true, conversation: conversation });
      }
    });
  });
}

// has_flagged: {'$remove': [uid]}
var updateConvStatus = (conversationid, obj_status,user_id,company_id, callback) => {
  var query_object = { conversation_id: models.uuidFromString(conversationid),company_id:models.timeuuidFromString(company_id) };
  var update_values_object = { is_active: null, status: obj_status,sender_id:models.uuidFromString(user_id),last_msg_time: new Date().getTime() };
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err){
      throw err;
    }else{
      callback({ status: true });
    }
  });
};


var hideRoom = (conversationid,userid,company_id, callback) => {
  var query_object = { conversation_id: models.uuidFromString(conversationid),company_id:models.timeuuidFromString(company_id) };
  var update_values_object = { close_for: { $add: [userid] } };

  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err) callback({ status: false, err: err });
    else callback({ status: true });
  });
};


var find_new_message_participants = (data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conv_id) };
  models.instance.Conversation.findOne(query_object, function(err, result){
    if(err){
      callback(err);
    }else{
      callback(result);
    }
  });

}



function setPinUnpin(params){

  return new Promise((resolve,reject)=>{
    if (params.type == 'pin') {
      var mqueries = [];
      var con_pin = {};
      _.each(params.convid, function (v, k) {
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

      models.doBatch(mqueries, function (err) {
        if (err) {
          reject({ status: false, err: err });
        }else {
          resolve({ status: true, pinIDs: con_pin });
        }
      });
    } else if (params.type == 'unpin') {
      //DELETE FROM Pinned WHERE id='??';
      var c_id = new Set();

      _.forEach(params.pinnedid, function(val, k){
          c_id.add(models.uuidFromString(val));
      });

      var msgarray = Array.from(c_id);
      var promises = [];
      var itemRows = msgarray;

      for(var i = 0; i < itemRows.length; i++) {
          var id = itemRows[i];
          var p = new Promise(function(resolve, reject){dbDataDlt(id, resolve, reject);});
          promises.push(p);
      }

      Promise.all(promises).then(function(data) {
        resolve({status:true, data:data});
      }).catch((err)=>{
        reject({status:false,err:err});
      });
    }
  });
}

function dbDataDlt(id, resolve, reject){
  var query_object = {
    id: { $eq:  id}
  };
  models.instance.Pinned.delete(query_object, function (err) {
    if (err){
      reject({ status: false});
    }else {
      resolve({ status: true});
    }
  });
}

var update_group_participants = (data, callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id) };
  var update_values_object = {
    participants: data.participants,
    participants_admin: data.participants_admin

  };
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err)
      callback(err);
    else
      callback({ status: "success" });
  });
}

var add_guest_into_room = (data, callback)=>{
  try{
    var query_object = { conversation_id: models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id) };
    var update_values_object = {
      participants: {'$add': [data.id]}
    };
    models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
      if(err) throw err;
      callback({status: true});
    });
  }catch(e){
    callback({status: false, err: e});
  }
}

var findconvTag = (data,callback)=>{
  models.instance.MessagesTag.find({ conversation_id: models.uuidFromString(data.conversation_id),tagged_by:models.uuidFromString(data.tagged_by) }, { raw: true, allow_filtering: true }, function (err, mstagids) {
    if(err){
      console.log(err);
    }else{
      callback({status:true,data:mstagids});
    }
  });
}

var up_R_Parti = (data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)};
  var update_values_object = {
    participants: data.participants
  };
  console.log(1372,data.type)
  if(data.type != 'guest'){
    update_values_object['participants_guest'] = {'$remove':data.participants};
    update_values_object['participants_sub'] = {'$remove':data.participants};

  }
  // console.log(1066, query_object);
  // console.log(1067, data);
  // console.log(1068, update_values_object);
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, async function (err) {
    if (err)
      callback(err);
    else{
      var find_root_conv_id = await has_root_conv(data.conversation_id, data.company_id);
      if(find_root_conv_id.status){
        root_conv_check_and_update_if_req(data.company_id, find_root_conv_id.root_id, data.participants,data.type);
      }
      callback({ status: true });
    }
  });
}

var up_R_Admins = (data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id), company_id:models.timeuuidFromString(data.company_id)};
  var update_values_object = {
    participants_admin: data.participants_admin
  };
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err)
      callback(err);
    else
      callback({ status: true });
  });
}

var findMsgIdByTag = (data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id), tag_title: { $contains: data.search_val },};
  models.instance.MessagesTag.find(query_object,{ raw: true, allow_filtering: true },function(err,result){
    if(err){
      console.log(err);
    }else{
      callback({status:true,data:result})
    }
  })
}

var taggedFilterUtils = (taggedby,tagarr,callback) =>{
  var query_object = { tagged_by: models.uuidFromString(taggedby)};
  models.instance.MessagesTag.find(query_object,{ raw: true, allow_filtering: true },function(err,result){
    if(err){
      console.log(err);
    }else{
      var res = [];
      if(tagarr.length > 0){
        if(result.length > 0){
          _.forEach(result, function(val, k){
            console.log(tagarr);
            console.log(_.intersection(tagarr, val.tag_title));
            if(_.intersection(tagarr, val.tag_title).length === tagarr.length){
              if(res.indexOf(val.conversation_id) == -1){
                res.push(val.conversation_id);
              }
            }
          });
          callback({status:true,data:res})
        }else{
          callback({status:true,data:res})
        }
      }else{
        callback({status:true,data:res})
      }
    }
  })
}


var updateTopicType=(data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id.toString()),company_id:models.timeuuidFromString(data.company_id)};
   var update_values_object = {
    topic_type: data.type
  };
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err)
      callback(err);
    else
      callback({ status: true });
  });
}

var updateBusinessUnit=(data,callback)=>{
  var query_object = { conversation_id: models.uuidFromString(data.conversation_id.toString()), company_id:models.timeuuidFromString(data.company_id)};
   var update_values_object = {
    b_unit_id: data.unit_id
  };
  models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
    if (err)
      callback(err);
    else
      callback({ status: true });
  });
}

var getAllUsedConvTag = (data)=>{
  return new Promise((reslove,reject)=>{
      models.instance.Convtag.find({conversation_id:data.roomid},{ raw: true, allow_filtering: true },function(err,result){
        if(err) {

          console.log(err)
        }
        else{
          reslove({result})
          // var alltagid = [];
          // _.each(result,function(v,k){
          //   alltagid.push(v.tag_id);
          // });

          // models.instance.Tag.find({tag_id:{'$in':alltagid}},)
        }
      });
  });
}

var getuseunitid = ()=>{
  return new Promise((reslove,reject)=>{
    var query = "SELECT * FROM messages ALLOW FILTERING;";
    models.instance.Conversation.execute_query(query, {}, function(error, data){
      if(error) {
       console.log(error)
      }else{
        reslove({data})
      }
    });
  })
}

var getAllThreadCov = (conv_id)=>{
  return new Promise((reslove,reject)=>{
    models.instance.ReplayConv.find({conversation_id:models.uuidFromString(conv_id)},{ raw: true, allow_filtering: true },function(err,data){
      if(err){
        console.log(1191,err);
      }else{
        reslove({status:true,data:data});
      }
    })
  })
}
var getallThreadMsg = (convlist)=>{
  return new Promise((reslove,reject)=>{
    var conversationList = [];
    _.each(convlist.conversation_id,function(v,k){
      conversationList.push(models.uuidFromString(v.toString()));
    });

    models.instance.Messages.find({conversation_id:{$in:conversationList}},{ raw: true, allow_filtering: true },function(err,data){
      if(err){
        console.log(1211,err);
      }else{
        reslove({status:true,data:data});
      }
    })
  })
}
var findConvExistornot = (data,callback)=>{
  var query = {
    participants: { $contains: data.user_id},
    group: { $eq: 'no' },
    single: { $eq: 'yes' }
  };

  models.instance.Conversation.find(query,{ raw: true, allow_filtering: true }, function(err, conversation) {
    if(err){
      console.log("This is err",err);
      callback({status: false, err: err});
    }else{

      var exist = false;
      var conversation_id = null;
      var result = null
      _.each(conversation,function(v,k){
        if(v.participants.indexOf(data.friend_id.toString()) > -1 ){
          exist =true;
          conversation_id =v.conversation_id;
          result = v;
        }
      });
      var pinned = false;
      if(conversation_id != null){

        models.instance.Pinned.find({block_id:models.uuidFromString(conversation_id.toString()),user_id:models.uuidFromString(data.user_id)},{ raw: true, allow_filtering: true },function(err2,result2){
          if(err2){
            callback({status: false, err: err2});
          }else if(result2.length > 0){
            pinned = true;
            callback({status:true,exist:exist,conversation_id:conversation_id,result:result,pinned});
          }else{
            callback({status:true,exist:exist,conversation_id:conversation_id,result:result,pinned});
          }
        })
      }else{
        callback({status:true,exist:exist,conversation_id:conversation_id,result:result,pinned});
      }

      
    }
  });
}
var createNewSingleconv = (data,callback)=>{
  console.log(1631, data);
  var query = "SELECT * FROM conversation WHERE participants contains '"+ data.participants[0] +"' AND participants contains '"+ data.participants[1] +"' AND group = 'no' AND single = 'yes' ALLOW FILTERING;";
  // console.log(1633, query);
  models.instance.Conversation.execute_query(query, {raw: true, allow_filtering: true}, function(e, re){
    if(e) callback({status: false, err: e});
    console.log(1636, re.rows.length);
    if(re && re.rows.length > 0){ 
      console.log("Already have this conversation.", re.rows[0]);
      callback({status: false});
      // callback({status: true, result: re.rows[0]});
    }
    else{
      var newData = {
        conversation_id: models.uuid(),
        created_by:models.uuidFromString(data.created_by),
        participants:data.participants,
        title:'Personal',
        privacy:'private',
        topic_type:'social',
        company_id:models.timeuuidFromString(data.company_id)
      };

      var newconv = new models.instance.Conversation(newData);
      newconv.saveAsync().then((res)=>{
        models.instance.Conversation.findOne({conversation_id:newData.conversation_id,company_id:newData.company_id},function(err,result){
          if(err){
            callback({status:false,err:err});
          }else{
            callback({status:true,result:result});
          }
        })
      }).catch((err)=>{
        callback({status:false});
      });
    }
  });
}
var findandgetconv = (data,callback)=>{
  var query = {
    participants: { $contains: data.user_id},
    group: { $eq: 'no' },
    single: { $eq: 'yes' }
  };

  models.instance.Conversation.find(query,{ raw: true, allow_filtering: true }, function(err, conversation) {
    if(err){
      console.log("This is err",err);
      callback({status: false, err: err});
    }else{
      var hasconv = false;

        _.each(conversation,function(v,k){
          if(!hasconv){
            if(v.participants.indexOf(data.fnd_id.toString()) > -1){
              hasconv = false;
              callback({status:true,data:v});
            }
          }
        });

        if(!hasconv){
          callback({status:false});
        }
    }
  });
}

var checkThisTitle = (data,callback)=>{
  var query = "SELECT * FROM conversation WHERE company_id="+models.timeuuidFromString(data.company_id)+" AND title like '"+data.title+"' ALLOW FILTERING;";
  models.instance.Conversation.execute_query(query, {}, function(cerr, cresult){
    if(cerr){
      console.log(cerr);
    }else{
      if(cresult.rows.length > 0){
        callback({status:true,exist:true,data:cresult.rows})
      }else{
        callback({status:false,exist:false,data:[]})
      }
    }
  });
}
var deleteRoom = (data,callback)=>{
  var query_object = {
    conversation_id:models.uuidFromString(data.conversation_id)
  };
  models.instance.Messages.delete(query_object,function(err,result){
    if(err){
      callback({ status: false});
    }else{
      models.instance.Conversation.delete(query_object, function (err1,result1) {
        if (err1){
          callback({ status: false});
        }else {
          callback({ status: true});
        }
      });
    }
  })
}
var hideUserinSidebar = (data,callback)=>{
  models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id) },
      {
        is_active: { $add: [data.targetID] },
      }, update_if_exists,
      function (err) {
        if (err) {
          console.log(1416,err);
        } else {
          callback({status:'success'});
        }
      }
    );
}

var addGuestuseronroom = (data,callback)=>{
  var participants = { '$add': [data.id] };
  var mqueries = [];
  var mqueries2 = [];
      _.each(data.conversation_id, function (v, k) {
        var mconv = models.instance.Conversation.update({conversation_id:models.uuid(v.toString()),company_id: models.timeuuidFromString(data.company_id)},{
          participants: participants,
        },{ return_query: true });
        mqueries.push(mconv);
      });

      _.each(data.team_id, function (v, k) {
        var mteam = models.instance.Team.update({team_id:models.timeuuidFromString(v.toString())},{ participants: participants }, { return_query: true });
        mqueries2.push(mteam);
      });

      models.doBatch(mqueries, function (err) {
        if (err) {
          console.log(1416, err);
        }else {
          models.doBatch(mqueries2, function (err) {
            if (err) {
              console.log(1416, err);
            }else {
              callback({ status: true});
            }
          });
        }
      });
}


var pin_unpin_conversation = (data,callback)=>{
  models.instance.Conversation.update(
    { conversation_id: models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id) },
    {
      is_pinned_users: ((data.s) ?  { $add: [data.user_id] } : { $remove: [data.user_id] }),
    }, update_if_exists,
    function (err,result) {
      if (err) {
        console.log(1484,err);
        callback({status:false});
      } else {
        console.log(1486,result)
        callback({status:true});
      }
    }
  );
}

var get_one_room_data = (data,callback)=>{
  models.instance.Conversation.findOne({conversation_id:models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)},function(err,result){
    if(err){
      callback({status:false})
    }else{
      callback({status:true,data:result});
    }
  })
}

function get_pin_info(user_id, conversation_id){
	return new Promise((resolve, reject)=>{
        if (user_id != undefined){
            models.instance.Pinned.findOne({ user_id: models.uuidFromString(user_id), block_id: models.uuidFromString(conversation_id) }, {raw: true, allow_filtering: true}, function (err, pinned) {
                if (err) {
                    reject({ status: false, err});
                } else {
                    if(pinned){
						resolve({ status: true, pin: pinned.block_id.toString(), pinned: true });
					}else{
						resolve({ status: true, pin: "0", pinned: false });
					}
                }
            });
        }else{
            reject({ status: false, err:"Userid Undefined"});
        }
    });
}

function get_mute_info(user_id, conversation_id){
	return new Promise((resolve, reject)=>{
        if (user_id != undefined){
            models.instance.ConversationMute.findOne({ mute_by: models.uuidFromString(user_id), conversation_id: models.uuidFromString(conversation_id) }, {raw: true, allow_filtering: true}, function (err, mute) {
                if (err) {
                    reject({ status: false, err});
                } else {
                    if(mute){
						resolve({ status: true, mute_id: mute.mute_id, mute_duration: mute.mute_duration, muteData: mute });
					}else{
						resolve({ status: true, mute_id: false, mute_duration: false, muteData: {} });
					}
                }
            });
        }else{
            reject({ status: false, err:"Userid Undefined"});
        }
    });
}

var get_conv_data = (data, callback)=>{
  if(data.conversation_id == data.user_id){
	var convdata = {
      'conversation_id':data.conversation_id,
      'conversation_type': 'Personal',
      'conversation_with': data.user_id,
      'conversation_title': idToNameArr([data.user_id]).toString(),
	  'conversation_img': 'feelix.jpg',
      'privacy': 'private',
      'msg_body': 'null',
      'participants' : [data.user_id],
      'status' : 'null',
      'is_active' : [],
      'participants_admin' : [data.user_id],
      'participants_name': idToNameArr([data.user_id]),
      'created_at': data.user_id,
      'msg_id':"",
      'msg_type':"",
      'sender_img':"",
      'sender_name':"",
      'totalUnread': 0,
	  "pinned": false,
	  "pin": "0",
	  "mute_id": false,
	  "mute_duration": false,
	  "muteData": {}
    };
    callback({status:true,convdata:convdata});
  }else{
    models.instance.Conversation.findOne({conversation_id: models.uuidFromString(data.conversation_id), company_id: models.timeuuidFromString(data.company_id)}, async function(err,result){
      if(err){
        callback({status:false})
      }else{
        if(result){
		  var pindata = await get_pin_info(data.user_id, data.conversation_id);
		  var mutedata = await get_mute_info(data.user_id, data.conversation_id);
		  
          if(result.group != 'yes') var fid = result.participants.join().replace(data.user_id, '').replace(',', '');
          var convdata = {
            'conversation_id':result.conversation_id,
            'conversation_type': result.group == 'yes' ? 'Group' : 'Personal',
            'conversation_with': result.group == 'yes' ? 'Group' : fid,
            'conversation_title': result.group == 'yes' ? result.title : idToNameArr([fid]).toString(),
			'conversation_img': result.group == 'yes' ? result.conv_img : 'feelix.jpg',
            'privacy': result.privacy,
            'msg_body': (result.msg_body == null ? 'null': result.msg_body),
            'participants' : result.participants,
            'status' : result.status,
            'is_active' : result.is_active != null ? result.is_active : [],
            'participants_admin' : result.participants_admin != null ? result.participants_admin :[],
            'participants_name': idToNameArr(result.participants),
            'created_at': result.created_at,
            'msg_id':"",
            'msg_type':"",
            'sender_img':"",
            'sender_name':"",
            'totalUnread': 0,
			"pinned": pindata.status ? pindata.pinned : false,
			"pin": pindata.status ? pindata.pin : "0",
			"mute_id": mutedata.status ? mutedata.mute_id : false,
			"mute_duration": mutedata.status ? mutedata.mute_duration : false,
			"muteData": mutedata.status ? mutedata.muteData : {}
          };
          callback({status:true,convdata:convdata});
        }
        else{
          callback({status:false})
        }
      }
    });
  }
}

var getAllConversations = (myID,callback) => {
  var query = {
        participants: { $contains: myID }
      };
  
  models.instance.Conversation.find( query, { raw: true, allow_filtering: true }, function(err, conversations) {
      if (err){
          console.log(1517,err);
          callback({status:false, err});
      }else{
          callback({status:true, conversations});
      }
  })
};

var findCallsByConversation = (conv_id,callback) =>{
  models.instance.Messages.find({conversation_id: models.uuidFromString(conv_id.toString()), $orderby:{ '$desc' :'msg_id' } }, {raw:true, allow_filtering: true}, function(err, conv_data){
    if(err){
      callback({status: false, err: err});
    }else{
          var callData = [];
          _.each(conv_data,function(v,k){
            if(v.msg_type == 'call'){
              v.call_duration = (v.call_duration == "" || v.call_duration == null ? 0 : v.call_duration);
              callData.push(v);
            }
          });

      callback({status: true, conv_data: callData});
    }
  });
}
function room_members(conversation_id, user_id){
  return new Promise((resolve, reject) => {
    if(conversation_id == user_id) resolve({participants: [conversation_id], group: 'no'});
    else{
      models.instance.Conversation.findOne({ conversation_id: models.uuidFromString(conversation_id.toString())}, function (err, conversation) {
        if (err) {
          console.log('room_members error ', err);
          reject([]);
        } else {
          if(conversation){
            resolve(conversation);
          }else{
            console.log('room_members not found error ', err);
            reject([]);
          }
        }
      });
    }
  });
}

module.exports = {
  saveConversation,
  findConversationHistory,
  createGroup,
  checkAdmin,
  createPersonalConv,
  createPersonalConv2,
  check_only_Creator_or_admin,
  findConvDetail,
  saveNewGroup,
  updateGroupName,
  room_name_exist,
  updateKeySpace,
  updatePrivecy,
  updateRoomimg,
  saveTag,
  findtag,
  saveConTag,
  saveConvD,
  getAllTagData,
  filesTag,
  getAllTagsforList,
  deleteUnusedTag,
  checkParticipants,
  updateConvStatus,
  hideRoom,
  find_new_message_participants,
  setPinUnpin,
  update_group_participants,
  add_guest_into_room,
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
  taggedFilterUtils,
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
  pin_unpin_conversation,
  get_one_room_data,
  getAllConversations,
  findCallsByConversation,
  get_conv_data,
  room_members
};
