var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var router = app.Router();
var validator = require('validator');


var {models} = require('./../config/db/express-cassandra');

var mobile_view = [];

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

mobile_view['check_pin'] = (data, callback) =>{
    models.instance.Pinned.find({block_id: models.uuidFromString(data.convid), user_id: models.uuidFromString(data.user_id)}, {raw:true, allow_filtering: true}, function(err, pindata){
        if(err){
          callback({status: false, err: err});
        }else{
          callback({status: true, pindata: pindata});
        }
    });
}

mobile_view['delete_this_msg_tag'] = (data, callback)=>{
  // return new Promise((resolve,reject)=>{
    models.instance.Messages.update({msg_id:models.timeuuidFromString(data.msg_id),conversation_id:models.uuidFromString(data.conv_id)},{tag_list:{$remove:[data.tag_id]}}, update_if_exists,function(err,result){
        if(err){
            // reject({status:true,err:err});
            console.log(err);
        }else{
            var newActionData = {
                action_id:models.timeuuid(),
                tag_id:models.timeuuidFromString(data.tag_id),
                created_by:models.uuidFromString(data.user_id),
                action_type:'removemsg',
                msg_id:models.timeuuidFromString(data.msg_id)

            }
            new models.instance.TagActionLogs(newActionData).saveAsync().then((res)=>{
                console.log('tag logs success '+res);
            }).catch((err)=>{
                console.log('tag log err '+err);
            });

            // resolve({status:true,msg:'success'});
            callback({status:true,msg:'success'});
        }
    });
  // });
};

mobile_view['has_tag_active_in_other_conv'] = (data, callback)=>{
  var has_tag_active = [];
  for(var i = 0; i < data.has_tag_active.length; i++) {
    var id = data.has_tag_active[i];
    var p = new Promise(function(resolve, reject){find_tag_into_conv(id, resolve, reject);});
    has_tag_active.push(p);
  }
  Promise.all(has_tag_active).then(function(result) {
    callback(result);
  });
};
mobile_view['createGroup'] = (adminList,memberList,groupName,createdBy,ecosystem,grpprivacy,conv_img,topic_type,b_unit_id,b_unit_name,tag_list,company_id,callback) =>{

  var conversation_id = models.uuid();
  var conversation = new models.instance.Conversation({
      conversation_id: conversation_id,
      created_by: models.uuidFromString(createdBy),
      group: 'yes',
      group_keyspace:ecosystem,
      privacy:grpprivacy,
      single: 'no',
      participants_admin: adminList,
      participants: memberList,
      title:groupName,
      conv_img : conv_img,
      topic_type:topic_type,
      b_unit_id:b_unit_id,
      tag_list:tag_list,
      company_id:models.timeuuidFromString(company_id),
      conference_id : models.timeuuid().toString() + '_group'
  });

  var tagTitle = [topic_type,groupName,b_unit_name,ecosystem];
  var queries = [];
  var tags = [];
  var newTaglist = [];

  var tagListArray = [];

  var allOldTitle = [];

  // _.each(alltags,function(va,ka){
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

  //   if(allOldTitle.indexOf(newTag) == -1){

  //     var tag_id = models.uuid();
  //     var tag = new models.instance.Tag({
  //       tag_id: tag_id,
  //       tagged_by: models.uuidFromString(createdBy),
  //       title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
  //       type: 'CONNECT',
  //       visibility: 'hidden'
  //     });
  //     var save_query = tag.save({return_query: true});
  //     queries.push(save_query);
  //     tags.push(tag_id);
  //     newTaglist.push(tag);
  //     tagListArray.push(tag);
  //   }

  // });

  var convTQ = [];
  // _.each(temTNA,function(v,k){
  //   if(allOldTitle.indexOf(v) == -1 && tagTitle.indexOf(v) == -1){
  //     var tag_id = models.uuid();
  //     var tag = new models.instance.Tag({
  //       tag_id: tag_id,
  //       tagged_by: models.uuidFromString(createdBy),
  //       title: v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, ''),
  //       type: 'CONNECT',
  //       visibility:'visible'
  //     });
  //     var save_query = tag.save({return_query: true});
  //     queries.push(save_query);
  //     tags.push(tag_id);
  //     newTaglist.push(tag);
  //     tagListArray.push(tag);
  //   }
  //   else{
  //     _.each(alltags,function(va,ka){
  //       if(va.title == v.trim().toLowerCase()){
  //         var id = models.uuid();
  //         var tag2 = new models.instance.Convtag({
  //           id: id,
  //           tag_id: models.uuidFromString(va.tag_id),
  //           conversation_id: conversation_id
  //         });
  //         var save_query = tag2.save({return_query: true});
  //         convTQ.push(save_query);
  //       }
  //     });
  //   }
  // });
  var condtagsid = [];
  
  // _.each(tags,function(v,k){
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

  models.doBatch(queries, function(err){
      if(err){ throw err;}
      else {

        models.doBatch(convTQ, function(err2){
          if(err2){ throw err2;}
          else {
            console.log({status:true});
          }
      });
      }
  });


  var validateCheck = [
    ckEmpty('Conversation Image',conv_img),
    ckEmpty('Title',groupName),
    ckEmpty('Privacy',grpprivacy),
    ckEmpty('Created By',createdBy),
    ckEmpty('Workspace Name',ecosystem)
  ];

  if(returnValid(validateCheck)){
    conversation.saveAsync().then(function() {
      callback({status:true, conversation_id,tags:newTaglist,condtagsid:condtagsid});
    }).catch(function(err) {
      callback({status:false, err: err});
    });
  }else{
    callback({status:false, err: validateCheck});
  }

  
};
mobile_view['get_all_member_ina_room'] = (data, callback) =>{
    var allConvId = [];
    var convid = new Set();
    _.forEach(data.my_all_conv, function(val, k){
        convid.add(models.uuidFromString(val));
    });
    var convid_array = Array.from(convid);
    var query = {
        conversation_id: {'$in': convid_array}
    };
    models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(error, convdata){
        if(error) callback(error);
        callback(convdata);
    });
}
module.exports = {mobile_view};
