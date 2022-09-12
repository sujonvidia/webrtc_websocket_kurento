var app = require('express');
var _ = require('lodash');
var moment = require('moment');
var {models} = require('./../config/db/express-cassandra');
const isUuid = require('uuid-validate');


var insert_notification = (data,callback)=>{

    var totaldata = {
        notification_id: models.uuid(),
        type:data.type,
        title:data.title,
        body:data.body,
        created_at:data.created_at,
        created_by:models.uuidFromString(data.created_by),
        seen_users:data.seen_users,
        receive_users:data.receive_users,
        is_delete:[]
    }
    console.log(21,totaldata);
    new models.instance.Gnotifications(totaldata).saveAsync().then(result=>{
        console.log('notificaiton save result ----->',result);
        callback({status:true,data:totaldata});
    }).catch(err =>{
        console.log('notificaiton save error ----->',err);
        callback({status:false,err:err});
    })
}

var my_all_notification = (data,callback)=>{
  var query = {
        receive_users: { $contains: data.user_id},
      };

      models.instance.Gnotifications.find(query,{ raw: true, allow_filtering: true }, function(err, result) {
        if(err){
          console.log("This is err",err);
          callback({status: false, err: err});
        }else{
          // var noti = _.orderBy(result, ['created_at'], ['desc']);
          callback({status:true,data:result})
        }
      });
}

var my_last_notification_and_total = (data,callback)=>{
  var q = `SELECT COUNT(*) AS total_unread FROM Gnotifications WHERE receive_users CONTAINS('${data.user_id}') AND seen_users CONTAINS('${data.user_id}') ALLOW FILTERING`;  
  models.instance.Gnotifications.execute_query(q, {}, function(e, r){
    if(e) callback({status: false, error: e});
    else{
      if(data.details !== undefined && data.details.toLowerCase() == 'yes'){
        data.limit = data.limit === undefined ? 50 : data.limit;
        var query = {
          receive_users : { $contains: data.user_id},
          $limit: data.limit
        };
        if(isUuid(data.notification_id)){
          query.notification_id = {$lt: models.uuidFromString(data.notification_id)};
        }
        models.instance.Gnotifications.find(query, { raw: true, allow_filtering: true }, function(err, result){
          if(err) callback({status: false, error: err});
          else{
            callback({status:true, total_notification_unread:r.rows[0].total_unread, data: result});
          }
        });
      }else{
        callback({status:true, total_notification_unread:r.rows[0].total_unread});
      }
    }
  });
}

var update_notification = (data)=>{
    if(data.update_type == 'seen'){
      var noti_id = new Set();
      _.forEach(data.noti_ids, function(val, k){
          noti_id.add(models.uuidFromString(val));
      });
      var notiarry = Array.from(noti_id);
      
      models.instance.Gnotifications.find({notification_id: {'$in': notiarry}},{raw:true,allow_filtering:true},function(err,result){
        if(err){
          console.log(err);
        }else{
          var queries = [];
          for(var i = 0; i < result.length; i++){
            var update_query = models.instance.Gnotifications.update(
              {notification_id: models.uuidFromString(result[i].notification_id.toString()), order_id: models.timeuuidFromString(result[i].order_id.toString()) },
              {seen_users: {'$remove': [data.user_id]}},
              {return_query: true}
            );
            queries.push(update_query);
          }
          if(queries.length > 0){
            models.doBatch(queries, function(err){
              if(err){
                console.log({msg: "notification seen", status: false, error: err});
              } else{
                console.log({msg: "notification seen", status:true});
              }
            });
          }
        }
      });
    }else if(data.update_type == 'delete'){
      models.instance.Gnotifications.find({notification_id: models.timeuuidFromString(data.noti_id)},{raw:true,allow_filtering:true},function(err,result){
        if(err){
          console.log(err);
        }else{
          var queries = [];
          for(var i = 0; i < result.length; i++){
            var update_query = models.instance.Gnotifications.update(
              {notification_id: models.uuidFromString(result[i].notification_id.toString()), order_id: models.timeuuidFromString(result[i].order_id.toString()) },
              {is_delete: {'$add': [data.user_id]}},
              {return_query: true}
            );
            queries.push(update_query);
          }
          if(queries.length > 0){
            models.doBatch(queries, function(err){
              if(err){
                console.log({msg: "notification delete", status: false, error: err});
              } else{
                console.log({msg: "notification delete", status:true});
              }
            });
          }
        }
      });
    }else if(data.update_type == 'update_many_seen'){
      models.instance.Gnotifications.find({seen_users:{$contains:data.user_id}},{raw:true,allow_filtering:true},function(err,result){
        if(err){
          console.log(err);
        }else{
          var queries = [];
          for(var i = 0; i < result.length; i++){
            // console.log(138, result[i].notification_id);
            var update_query = models.instance.Gnotifications.update(
              {notification_id: models.uuidFromString(result[i].notification_id.toString()), order_id: models.timeuuidFromString(result[i].order_id.toString()) },
              {seen_users: {'$remove': [data.user_id]}},
              {return_query: true}
            );
            queries.push(update_query);
          }
          if(queries.length > 0){
            models.doBatch(queries, function(err){
              if(err){
                console.log({msg: "update_many_seen", status: false, error: err});
              } else{
                console.log({msg: "update_many_seen", status:true});
              }
            });
          }
        }
      })
    }else if(data.update_type == 'delete_all_noti'){
      models.instance.Gnotifications.find({receive_users:{$contains:data.user_id}},{raw:true,allow_filtering:true},function(err,result){
        if(err){
          console.log(err);
        }else{
          var queries = [];
          for(var i = 0; i < result.length; i++){
            var update_query = models.instance.Gnotifications.update(
              {notification_id: models.uuidFromString(result[i].notification_id.toString()), order_id: models.timeuuidFromString(result[i].order_id.toString()) },
              {is_delete: {'$add': [data.user_id]}},
              {return_query: true}
            );
            queries.push(update_query);
          }
          if(queries.length > 0){
            models.doBatch(queries, function(err){
                if(err){
                  console.log({msg: "delete_all_noti", status: false, error: err});
                } else{
                  console.log({msg: "delete_all_noti", status:true});
                }
            });
          }
        }
      })
    }
}


var get_all_tips = (data,callback)=>{
  // var query = {
  //     receive_users: { $contains: data.user_id},
  //   };
  
    models.instance.Tips.find({}, function(err, result) {
      if(err){
        console.log("'Form all_notification.js' Tips error.",err);
        callback({status: false, err: err});
      }else{
        // console.log('Found ', result);
        callback({status:true,data:result});
      }
    });
}

module.exports = {insert_notification, my_all_notification, my_last_notification_and_total, update_notification, get_all_tips};
