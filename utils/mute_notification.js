 var app = require('express');
 var router = app.Router();
 var _ = require('lodash');
 var moment = require('moment');
 const isUuid = require('uuid-validate');

 var { models } = require('./../config/db/express-cassandra');

 var isRealString = (str) => {
     return typeof str === 'string' && str.trim().length > 0;
 }


 var connect_mute_create = async(data, callback) => {
     console.log(14, data);
     // var alldata = [];
     // var i = 0;
     // _.each(data.allConv,function(v,k){
     //     i = i+1;
     //     var createMuteId = models.timeuuid();
     //     var mute_notification = new models.instance.ConversationMute({
     //         mute_id:createMuteId,
     //         conversation_id: models.uuidFromString(v),
     //         mute_by: models.uuidFromString(data.user_id),
     //         mute_duration:data.mute_duration,
     //         mute_start_time:data.mute_start_time,
     //         mute_end_time:data.mute_end_time,
     //         mute_day:data.mute_day,
     //         mute_status:"active"
     //     });
     //     mute_notification.saveAsync().then(function(res){
     //         alldata.push(mute_notification);
     //         console.log(data.allConv.length, k, k+1);
     //         if (data.allConv.length == k+1) {
     //             callback({ status: alldata});
     //         }
     //     }).catch(function(err) {
     //         callback({status:false, err: err});
     //     });
     // });


     var queries = [];
     var alldata = [];
     if(!data.allConv) return;
     for (let v of data.allConv) {
         //  _.each(data.allConv, async function(v, k) {
         var createMuteId = models.timeuuid();
         var nowUnix = moment(data.mute_start_time + ' ' + data.timezone, 'llll Z').unix();
         var endUnix = moment(data.mute_end_time + ' ' + data.timezone, 'llll Z').unix();

         var mute_status = await new Promise(pr => {
             models.instance.ConversationMute.find({ conversation_id: models.uuidFromString(v), mute_by: models.uuidFromString(data.user_id) }, { raw: true, allow_filtering: true }, async function(err1, res1) {
                 if (err1) { console.trace(err1); }
                 return pr(res1);
             });
         });
         if (mute_status && mute_status.length) {
             for (let mute_row of mute_status) {
                 await new Promise(pr => {
                     models.instance.ConversationMute.delete({ mute_id: mute_row.mute_id }, function(err) {
                         if (err) { console.trace(err); }
                         return pr(true);
                     });
                 });
             }
         }

         var mute_notification = new models.instance.ConversationMute({
             mute_id: createMuteId,
             conversation_id: models.uuidFromString(v),
             mute_by: models.uuidFromString(data.user_id),
             mute_duration: data.mute_duration,
             mute_start_time: data.mute_start_time,
             mute_end_time: data.mute_end_time,
             mute_day: data.mute_day,
             mute_status: "active",
             mute_unix_start: nowUnix ? nowUnix.toString() : "0",
             mute_unix_end: endUnix ? endUnix.toString() : "0",
             mute_timezone: data.timezone ? data.timezone : '',
            //  show_notification: data.hasOwnProperty('show_notification') ? data.show_notification : false
         });
         console.log('connect__mute__create', JSON.stringify(mute_notification));

         var save_query = mute_notification.save({ return_query: true });
         queries.push(save_query);
         alldata.push(mute_notification);
     }
     //  });

     models.doBatch(queries, function(err) {
         if (err) { console.log('error in batch query '); throw err; } else {
             callback({ status: true, data: alldata });
         }
     });

 }

 var get_all_mute_conv = (data, callback) => {

     var query = {
         mute_by: { $eq: models.uuidFromString(data) }
     };
     models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv) {
         if (error) {
             callback({ status: false });
         } else {
             var allMuteActiveConv = [];
             _.forEach(all_conv, function(v, k) {
                 if (v.mute_status == "active") {
                     allMuteActiveConv.push(v);
                 }
             });
             callback(allMuteActiveConv);
         };
     });
 }


 var update_mute_notification = (data, callback) => {
     var nowUnix = moment(data.mute_start_time + ' ' + data.timezone, 'llll Z').unix();
     var endUnix = moment(data.mute_end_time + ' ' + data.timezone, 'llll Z').unix();
     var qdata = {
         mute_start_time: data.mute_start_time,
         mute_duration: data.mute_duration,
         mute_end_time: data.mute_end_time,
         mute_day: data.mute_day,
         mute_unix_start: nowUnix ? nowUnix.toString() : "0",
         mute_unix_end: endUnix ? endUnix.toString() : "0",
         mute_timezone: data.timezone ? data.timezone : ''
     }
     console.log('update__mute__notification', JSON.stringify(data));
     models.instance.ConversationMute.update({ mute_id: models.uuidFromString(data.mute_id) }, qdata, update_if_exists, function(err) {
         if (err) {
             callback(err)
         } else {
             callback({ status: 'success' });
         }
     });
 }


 var delete_mute_notification = (data, callback) => {
     console.log('delete_mute_notification', data)
     _.each(data.mute_id, function(v, k) {
         console.log('116kv=', v);
         console.log('117kv=', models.uuidFromString(v));
         models.instance.ConversationMute.delete({ mute_id: models.uuidFromString(v) }, function(err) {
             if (err) {
                 callback(err);
             } else {
                 callback({ status: 'success' });
             }
         });
     });
 }


 module.exports = {
     connect_mute_create,
     get_all_mute_conv,
     update_mute_notification,
     delete_mute_notification
 };