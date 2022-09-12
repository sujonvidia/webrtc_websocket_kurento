var app = require('express');
var router = app.Router();
var _ = require('lodash');
var moment = require('moment');

//Import Validation
const Validator = require('validator');
const isEmpty = require('../validation/is-empty');
const hasPowerOnParticipantsDlt = require('../validation/has-power');

//Import Model
var {models} = require('./../config/db/express-cassandra');

// Access all member method by self Ex: self.getMyAllActivityUtils() inside this file.
var self =  module.exports = {
    getMyAllActivityUtils : function(userid,type){
        return new Promise((resolve,reject)=>{
            if(!isEmpty(userid)){
                var query = {
                    activity_created_by: { $eq:  models.uuidFromString(userid)},
                    activity_type: { $eq: type },
                };
                models.instance.Task.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false});
            }
        });
    },

    getParcipatedActivityUtils : function(userid,type){
        return new Promise((resolve,reject)=>{
            if(!isEmpty(userid)){
                var query = {
                    participants: { $contains: userid},
                    activity_type: { $eq: type },
                };
                models.instance.Task.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities });
                    }
                });
            }else{
                reject({ status: false});
            }
        });
    },

    //Old task Query
    // getParcipatedActivityListUtils : function(activity_ids){
    //     return new Promise((resolve,reject)=>{
    //         if(activity_ids.length > 0){
    //             var activityid = new Set();
    //             _.forEach(activity_ids, function(val, k){
    //                 activityid.add(models.timeuuidFromString(val));
    //             });
    //             var activityarray = Array.from(activityid);
    
    //             var query = {
    //                 activity_id: {'$in': activityarray}
    //             };
    //             models.instance.Activity.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
    //                 if (err) {
    //                     reject({ status: false, err: err });
    //                 } else {
    //                     resolve({ status: true, activities: activities});
    //                 }
    //             });
    //         }else{
    //             reject({ status: false});
    //         }
    //     });
    // },

    // New task Query
    getParcipatedActivityListUtils : function(activity_ids){
        return new Promise((resolve,reject)=>{
            if(activity_ids.length > 0){
                var activityid = new Set();
                _.forEach(activity_ids, function(val, k){
                    activityid.add(models.timeuuidFromString(val));
                });
                var activityarray = Array.from(activityid);
    
                var query = {
                    activity_id: {'$in': activityarray}
                };
                models.instance.Task.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false});
            }
        });
    },

    pinnedDataUtils : function(activity_ids,user_id){
        return new Promise((resolve,reject)=>{
            if(activity_ids.length > 0){
                var activityid = new Set();
                _.forEach(activity_ids, function(val, k){
                    activityid.add(models.uuidFromString(val));
                });
                var activityarray = Array.from(activityid);
    
                var query = {
                    activity_id: {'$in': activityarray},
                    user_id: {'$eq': models.uuidFromString(user_id)}
                };
                models.instance.Activitypin.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false});
            }
        });
    },

    flaggeddDataUtils : function(activity_ids,user_id){
        return new Promise((resolve,reject)=>{
            if(activity_ids.length > 0){
                var activityid = new Set();
                _.forEach(activity_ids, function(val, k){
                    activityid.add(models.uuidFromString(val));
                });
                var activityarray = Array.from(activityid);
    
                var query = {
                    activity_id: {'$in': activityarray},
                    user_id: {'$eq': models.uuidFromString(user_id)}
                };
                models.instance.ActivityFlag.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false});
            }
        });
    },

    saveActivityUtils : function (params){
        return new Promise((resolve,reject)=>{
            var activityTitle = !Validator.isEmpty(params.activityTitle) ? params.activityTitle : '';
            if (Validator.isEmpty(activityTitle)) {
                reject({'status':false});
            }else{
                
                var activity_id = models.timeuuid();
                let clusteringkey = new Date().getTime();
                var endTime=params.activityDueDate.split("-");
                var newDate = endTime[1]+"/"+endTime[0]+"/"+endTime[2];
    
                var activity = new models.instance.Activity({
                    activity_id                     : activity_id,
                    activity_type                   : params.activityType,
                    activity_title                  : params.activityTitle,
                    activity_description            : params.activityNotesArea,
                    activity_created_by             : models.uuidFromString(params.activityCreatedBy),
                    activity_created_at             : clusteringkey,
                    activity_is_active              : 1,
                    activity_start_time             : clusteringkey,
                    activity_end_time               : newDate,
                    activity_workspace              : params.activityEcosystem,
                    activity_for                    : params.activityEcosystem,
                    activity_status                 : params.activityStatus,
                    activity_from                   : params.activityFfrom,
                    activity_to                     : params.activityTo,
                    activity_has_reminder           : params.activityReminder,
                    activity_is_publish             : 1,
                    activity_budget_amount          : params.activityBudgeAmount,
                    activity_actual_amount          : params.activityActualAmount,
                    activity_est_hour               : params.activityEstHour,
                    activity_est_hourly_rate        : params.activityEstHourRate,
                    activity_actual_hour            : params.activityActualHour,
                    activity_actual_hourly_rate     : params.activityActualHourRate,
                    activity_has_root               : params.activityHasRoot,
                    activity_root_id                : (!isEmpty(params.activityRootId) ? models.uuidFromString(params.activityRootId) : null) 
                });
    
                activity.saveAsync().then(function() {
                    resolve({ status: true, activity_id, clusteringkey: clusteringkey});
                }).catch(function(err) {
                    reject({status:false, err: err});
                });
            }
        });
    },

    // For New activity Save
    saveActivityByUtils : function (params){
        return new Promise((resolve,reject)=>{
            var activityTitle = !Validator.isEmpty(params.activityTitle) ? params.activityTitle : '';
            if (Validator.isEmpty(activityTitle)) {
                reject({'status':false});
            }else{
                
                var activity_id = models.timeuuid();
                let clusteringkey = new Date().getTime();
                // var endTime=params.activityDueDate.split("-");
                // var newDate = endTime[1]+"/"+endTime[0]+"/"+endTime[2];
                // var clusteringkey2 = new Date(params.activityDueDate).getTime();
                console.log(221, new Date(params.activityDueDate).getTime());
                console.log(222, params.activityDueDate);
                var activity = new models.instance.Task({
                    activity_id                     : activity_id,
                    activity_type                   : params.activityType,
                    activity_title                  : params.activityTitle,
                    activity_description            : params.activityNotesArea,
                    activity_created_by             : models.uuidFromString(params.activityCreatedBy),
                    activity_created_at             : clusteringkey,
                    activity_start_time             : clusteringkey,
                    activity_end_time               : (params.activityDueDate != null) ? new Date(params.activityDueDate).getTime() : null ,
                    activity_workspace              : params.activityEcosystem,
                    activity_status                 : params.activityStatus,
                    activity_has_reminder           : params.activityReminder,
                    activity_is_publish             : 1,
                    activity_budget_amount          : params.activityBudgeAmount,
                    activity_actual_amount          : params.activityActualAmount,
                    activity_est_hour               : params.activityEstHour,
                    activity_est_hourly_rate        : params.activityEstHourRate,
                    activity_actual_hour            : params.activityActualHour,
                    activity_actual_hourly_rate     : params.activityActualHourRate,
                    participants                    : params.participantsArry,
                    company_id                      : models.timeuuidFromString(params.companyID),
                    activity_admin                  : params.activity_admin,
                    activity_observer               : params.activity_observer,
                    activity_member                 : params.activity_member,
                    flag_id                         : params.flag_id,
                    pin_id                          : params.pin_id,
                    bunit_id                        : models.timeuuidFromString(params.bunit_id),
                });
    
                activity.saveAsync().then(function() {
                    resolve({ status: true, activity_id, clusteringkey: clusteringkey});
                }).catch(function(err) {
                    reject({status:false, err: err});
                });
            }
        });
    },

    saveParticipantsUtils : function(params){
        return new Promise((resolve,reject)=>{
            var participant = params.participant;
            var activityId = params.activity_id;
            var tblid = [];
            var tblIdAssign = {};
            
            if(!Validator.isEmpty(activityId)){
                var queries = [];
                _.each(participant, function(v, k) {
                    let user_d = v.id;
                    let type = !Validator.isEmpty(v.type) ? v.type : 'owner';
                    var tbl_id = models.uuid();
                    var activityParticipants = new models.instance.ActivityParticipants({
                        tbl_id              : tbl_id,
                        user_id             : models.uuidFromString(user_d),
                        participant_type    : type.replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                        activity_type       : !Validator.isEmpty(params.activity_type) ? params.activity_type : 'Task',
                        activity_id         : models.timeuuidFromString(activityId)
    
                    });
                    var save_query = activityParticipants.save({return_query: true});
                    queries.push(save_query);
                    tblid.push(tbl_id.toString());
                    tblIdAssign[user_d] = tbl_id.toString();
                });
                
                models.doBatch(queries, function(err){
                    if(err){ 
                        reject({status:false, err: err});
                    }else {
                        resolve({ status: true,tblid:tblid,tblIdAssign:tblIdAssign});
                    }
                });
            }
        });
    },

    singleActivityUtils : function(params){
    
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.timeuuidFromString(params.activity_id)}
                };
                models.instance.Task.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },


    singleActivityParticipantsUtils : function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)}
                };
                models.instance.ActivityParticipants.find(query, { raw: true, allow_filtering: true }, function (err, participants) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, participants: participants});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    childActivitysResponseUtils : function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_root_id: {'$eq': models.uuidFromString(params.activity_id)}
                };
                models.instance.Activity.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    customActivityColUtils : function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)},
                    created_by: {'$eq': models.uuidFromString(params.created_by)}
                };
                models.instance.ActivityCustomCol.find(query, { raw: true, allow_filtering: true }, function (err, cols) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {

                        var c_id = new Set();

                        _.forEach(cols, function(val, k){
                            c_id.add(models.uuidFromString(val.col_id.toString()));
                        });

                        var msgarray = Array.from(c_id);
                        var promises = [];
                        var itemRows = msgarray;

                        for(var i = 0; i < itemRows.length; i++) {
                            var id = itemRows[i];
                            var p = new Promise(function(resolve, reject){self.cusColVal(id, resolve, reject);});
                            promises.push(p);
                        }

                        Promise.all(promises).then(function(data) {
                            resolve({ status: true, cols: cols, data:data});
                        }).catch((err)=>{
                            reject({status:false});
                        });
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    activityUpdateSocketUtils : function(params){
        console.log(370, params)
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.targetId) && !Validator.isEmpty(params.activityUpdateType)){
                if(params.activityUpdateType == 'participants'){
                    self.deleteParticipants(
                        params,
                        (response)=>{
                        if(response.status){
                            var data = {
                                participant     :   params.activityUpdateData,
                                activity_id     :   params.targetId,
                                activity_type   :   params.activityType
                            };

                            self.saveParticipantsUtils(data)
                            .then((response)=>{
                                resolve({ status: true, response: response});
                            })
                            .catch((err)=>{
                                reject({ status: false, response: err });
                            });
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'title'){
                    self.updateActivityTitle(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskDescKeyUp'){
                    self.updateActivityNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'workspace'){
                    self.updateWorkspaceNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskStatus'){
                    self.updateTaskStatusNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'duedate'){
                    self.updateDuedateNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'comdate'){
                    self.updateCompletedateNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskBAinput'){
                    self.updateBudgetAmountNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskAAinput'){
                    self.updateActualAmountNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskEHinput'){
                    self.updatetaskEHinputNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskAHinput'){
                    self.updatetaskAHinputNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskEHRinput'){
                    self.updatetaskEHRinputNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'taskAHRinput'){
                    self.updatetaskAHRinputNote(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'priority'){
                    self.updatePriority(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'ManHourRate'){
                    self.updateManHourRate(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'hourlyRate'){
                    self.updateHourlyRate(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'variance'){
                    self.updateVariance(
                        params.activityUpdateData,
                        params.clusteringKey,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }else if(params.activityUpdateType == 'statusClr'){
                    self.updateCustomStatusClr(
                        params.activityUpdateData,
                        params.targetId,
                        (response)=>{
                        if(response.status){
                            resolve({ status: true, response: response});
                        }else{
                            reject({ status: false, response: response });
                        }
                    });
                }
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    updateBatchPriorityUtils : function(params){
        return new Promise((resolve,reject)=>{
            console.log(553,params);
            if(params.activityUpdateType == 'batchPriority'){
                self.updateBatchPriority(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchStatus'){
                self.updateBatchStatus(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchDueDate'){
                self.updateBatchDueDate(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchBAinput'){
                self.updateBatchBAinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchAAinput'){
                self.updateBatchAAinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchEWHinput'){
                self.updateBatchEWHinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchEHRinput'){
                self.updateBatchEHRinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchAHinput'){
                self.updateBatchAHinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchAHRinput'){
                self.updateBatchAHRinput(
                    params.activityUpdateData,
                    params.targetId,
                    (response)=>{
                    if(response.status){
                        resolve({ status: true, response: response});
                    }else{
                        reject({ status: false, response: response });
                    }
                });
            }else if(params.activityUpdateType == 'batchParticipants'){
                var userid = params.activityUpdateData;
                var activityids = [];
                var participantedTblID = [];

                _.each(params.targetId, function(v, k) {
                    if(activityids.indexOf(v.id) == -1){
                        activityids.push(v.id);
                    }
                });

                self.subActivitiesParticipantsUtils(activityids)
                    .then((response)=>{
                        _.each(response.data, function(vl, kl) {
                            _.each(vl, function(v, k) {
                                if(v.participant_type == params.activityType){
                                    if(participantedTblID.indexOf(v.tbl_id.toString()) == -1){
                                        participantedTblID.push(v.tbl_id.toString());
                                    }
                                }
                            });
                        });

                        var data = {
                            participantedTblID:participantedTblID
                        };

                        if(params.isBatchActive == 0){
                            self.deleteParticipants(data,(response)=>{
                                if(response.status){
                                    self.saveBatchParticipants(activityids,userid,params.activityType).then((res)=>{
                                        if(response.status){
                                            resolve({ status: true, response: response});
                                        }else{
                                            reject({ status: false, response: response });
                                        }
                                    }).catch((err)=>{
                                        reject({ status: false, response: err });
                                    });
                                }
                            });
                        }else{
                            self.saveBatchParticipants(activityids,userid,params.activityType).then((res)=>{
                                if(response.status){
                                    resolve({ status: true, response: response});
                                }else{
                                    reject({ status: false, response: response });
                                }
                            }).catch((err)=>{
                                reject({ status: false, response: err });
                            });
                        }
                        

                    }).catch((err)=>{
                        reject({ status: false, response: err });
                    })
            }else if(params.activityUpdateType == 'batchParticipantsDlt'){
                var userid = params.activityUpdateData;
                var activityids = [];
                var participantedTblID = [];

                _.each(params.targetId, function(v, k) {
                    if(activityids.indexOf(v.id) == -1){
                        activityids.push(v.id);
                    }
                });

                self.subActivitiesParticipantsUtils(activityids)
                    .then((response)=>{
                        _.each(response.data, function(vl, kl) {
                            _.each(vl, function(v, k) {
                                if(v.participant_type == params.activityType && v.user_id == userid){
                                    if(participantedTblID.indexOf(v.tbl_id.toString()) == -1){
                                        participantedTblID.push(v.tbl_id.toString());
                                    }
                                }
                            });
                        });

                        var data = {
                            participantedTblID:participantedTblID
                        };

                        self.deleteParticipants(data,(response)=>{
                            if(response.status){
                                resolve({ status: true, response: response});
                            }else{
                                reject({ status: false, response: response });
                            }
                        });
                        

                    }).catch((err)=>{
                        reject({ status: false, response: err });
                    });
            }
        });
    },  
    
    saveBatchParticipants : function(activityids,userid,type){
        return new Promise((resolve,reject)=>{
            var tblid = [];
            var queries = [];
            _.each(activityids, function(v, k) {
                var tbl_id = models.uuid();
                var activityParticipants = new models.instance.ActivityParticipants({
                    tbl_id              : tbl_id,
                    user_id             : models.uuidFromString(userid),
                    participant_type    : type.replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                    activity_type       : 'SubTask',
                    activity_id         : models.timeuuidFromString(v)

                });
                var save_query = activityParticipants.save({return_query: true});
                queries.push(save_query);
                tblid.push(tbl_id.toString());
            });
            
            models.doBatch(queries, function(err){
                if(err){ 
                    reject({status:false, err: err});
                }else {
                    resolve({ status: true,tblid:tblid});
                }
            });
        });
    },

    saveParticipants_onfly : function(activityids,userids,type){

        console.log(784, {activityids,userids,type});

        return new Promise((resolve,reject)=>{
            var tblid = [];
            var queries = [];
            _.each(activityids, function(va, ka) {
                _.each(userids, function(vu, ku) {
                    var tbl_id = models.uuid();
                    var activityParticipants = new models.instance.ActivityParticipants({
                        tbl_id              : tbl_id,
                        user_id             : models.uuidFromString(vu),
                        participant_type    : type.replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                        activity_type       : 'SubTask',
                        activity_id         : models.timeuuidFromString(va)
    
                    });
                    var save_query = activityParticipants.save({return_query: true});
                    queries.push(save_query);
                    tblid.push(tbl_id.toString());

                });
            });
            
            models.doBatch(queries, function(err){
                if(err){ 
                    reject({status:false, err: err});
                }else {
                    resolve({ status: true,tblid:tblid});
                }
            });
        });
    },

    updateBatchAHRinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_actual_hourly_rate : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    }, 

    updateBatchAHinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_actual_hour : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    }, 

    updateBatchEHRinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_est_hourly_rate : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    }, 

    updateBatchEWHinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_est_hour : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    }, 

    updateBatchAAinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_actual_amount : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    },  

    updateBatchBAinput : function(value,data,callback){
        
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_budget_amount : value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    },  

    updateBatchDueDate : function(value,data,callback){
        var endTime = value.split("-");
        var newDate = endTime[1]+"/"+endTime[0]+"/"+endTime[2];
        var mqueries = [];

        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_end_time: newDate 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    },  

    updateBatchStatus : function(value,data,callback){
        var mqueries = [];
        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_status: value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    },

    updateBatchPriority : function(value,data,callback){
        var mqueries = [];
        _.each(data, function(v, k) {
            var update_query = models.instance.Activity.update(
            {   
                activity_id: models.timeuuidFromString(v.id),
                activity_created_by: models.uuidFromString(v.createdby)
            },
            {
                activity_priority: value 
            },
            {return_query: true}
            );
            mqueries.push(update_query);
        });

        models.doBatch(mqueries, function(err){
            if(err){ 
                callback({status:false,err:err});
            } else {
                callback({status:true});
            }
        });
    },

    deleteParticipants :  function(tblIds,callback){
        var c_id = new Set();

        _.forEach(tblIds.participantedTblID, function(val, k){
            c_id.add(models.uuidFromString(val));
        });

        var msgarray = Array.from(c_id);
        var promises = [];
        var itemRows = msgarray;

        for(var i = 0; i < itemRows.length; i++) {
            var id = itemRows[i];
            var p = new Promise(function(resolve, reject){self.dbDataDlt(id, resolve, reject);});
            promises.push(p);
        }

        Promise.all(promises).then(function(data) {
            callback({status:true, data:data});
        }).catch((err)=>{
            callback({status:false,err:err});
        });
    },

    dbDataDlt : function(id, resolve, reject){
        var query = {
            tbl_id: { $eq:  id}
        };
        models.instance.ActivityParticipants.delete(query, function(err){
            if(err) {
                return reject();
            }else{
                return resolve(id);
            }
        });
    },
    
    updateCustomStatusClr : function(data,targetId,callback){
        if(!Validator.isEmpty(data)){
            var query_object = {
                id: models.timeuuidFromString(targetId)
            };
    
            var update_values_object = {color_code: data};
            var options = {ttl: 86400, if_exists: true};
            models.instance.ActivityCusStatus.update(query_object, update_values_object, options, function(err){
                if(err) callback({status:false, err: err});
                else callback({status:true});
            });
        }else{
            callback({status:false});
        }
    },
    
    updateActivityTitle : function(data,clusteringKey,targetId,callback){
        if(!Validator.isEmpty(data)){
            var query_object = {
                activity_id: models.timeuuidFromString(targetId),
                activity_created_by: models.uuidFromString(clusteringKey),
            };
    
            var update_values_object = {activity_title: data};
            var options = {ttl: 86400, if_exists: true};
            models.instance.Activity.update(query_object, update_values_object, options, function(err){
                if(err) callback({status:false, err: err});
                else callback({status:true});
            });
        }else{
            callback({status:false})
        }
        
    },

    updateActivityNote : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_description: data};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },
    
    updateActualAmountNote : function(data,clusteringKey,targetId,callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{

                if(isEmpty(activityDetail.activity_actual_amount)){
                    var prevVal = 0;
                }else{
                    var prevVal = activityDetail.activity_actual_amount;
                }

                self.changeLogInsert(targetId,parseFloat(prevVal).toFixed(2), parseFloat(data).toFixed(2), 'taskAAinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_actual_amount: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
        
    },
    
    updatetaskEHinputNote : function(data,clusteringKey,targetId,callback){
        
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{

                if(isEmpty(activityDetail.activity_est_hour)){
                    var prevVal = '0:00';
                }else{
                    var prevVal = activityDetail.activity_est_hour;
                }

                self.changeLogInsert(targetId,prevVal, data, 'taskEHinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_est_hour: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
        
    },
    
    updatetaskAHinputNote : function(data,clusteringKey,targetId,callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{
                if(isEmpty(activityDetail.activity_actual_hour)){
                    var prevVal = '0:00';
                }else{
                    var prevVal = activityDetail.activity_actual_hour;
                }

                self.changeLogInsert(targetId,prevVal, data, 'taskAHinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_actual_hour: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
        
    },
    
    updatetaskEHRinputNote : function(data,clusteringKey,targetId,callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{

                if(isEmpty(activityDetail.activity_est_hourly_rate)){
                    var prevVal = 0;
                }else{
                    var prevVal = activityDetail.activity_est_hourly_rate;
                }

                self.changeLogInsert(targetId,parseFloat(prevVal).toFixed(2), parseFloat(data).toFixed(2), 'taskEHRinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_est_hourly_rate: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
        
    },
    
    updatetaskAHRinputNote : function(data,clusteringKey,targetId,callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{

                if(isEmpty(activityDetail.activity_actual_hourly_rate)){
                    var prevVal = 0;
                }else{
                    var prevVal = activityDetail.activity_actual_hourly_rate;
                }

                self.changeLogInsert(targetId,parseFloat(prevVal).toFixed(2), parseFloat(data).toFixed(2), 'taskAHRinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_actual_hourly_rate: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
        
    },

    changeLogInsert : function(targetId,prev_val,current_val,activity_type,user_id){
        console.log('targetId',targetId);
        console.log('prev_val',prev_val);
        console.log('current_val',current_val);
        console.log('activity_type',activity_type);

        var id = models.timeuuid();
        
        var activitySet = new models.instance.Activitychangelog({
            log_id         : id,
            user_id        :  models.uuidFromString(user_id),
            activity_id    : models.uuidFromString(targetId),
            activity_type  : activity_type,
            prev_val       : prev_val.toString(),
            current_val    : current_val.toString()
        });

        activitySet.saveAsync().then(function() {
            console.log(id)
        }).catch(function(err) {
            console.log(err)
        });
    },

    getThisChangeLog : function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)},
                };
                models.instance.Activitychangelog.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });

    },

    updateBudgetAmountNote : function(data,clusteringKey,targetId,callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{

                if(isEmpty(activityDetail.activity_budget_amount)){
                    var prevVal = 0;
                }else{
                    var prevVal = activityDetail.activity_budget_amount;
                }
                
                self.changeLogInsert(targetId,parseFloat(prevVal).toFixed(2), parseFloat(data).toFixed(2), 'taskBAinput',clusteringKey);

                var query_object = {
                    activity_id: models.timeuuidFromString(targetId),
                    activity_created_by: models.uuidFromString(clusteringKey),
                };
        
                var update_values_object = {activity_budget_amount: data.toString()};
                var options = {ttl: 86400, if_exists: true};
                models.instance.Activity.update(query_object, update_values_object, options, function(err){
                    if(err) callback({status:false, err: err});
                    else callback({status:true});
                });
            }
        });
  
    },

    updateVariance : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_varience: data.toString()};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateHourlyRate : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_manhourly_rate: data.toString()};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateManHourRate : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_manhour_cost: data.toString()};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateWorkspaceNote : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_workspace: data};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateTaskStatusNote : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_status: data};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateCompletedateNote : function(data,clusteringKey,targetId,callback){
        var endTime = data.split("-");
        var newDate = endTime[1]+"/"+endTime[0]+"/"+endTime[2];

        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_completed_at: newDate};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },


    updateDuedateNote : function(data,clusteringKey,targetId,callback){
        
        
        var endTime = data.split("-");
        var newDate = endTime[1]+"/"+endTime[0]+"/"+endTime[2];

        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_end_time: newDate};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updatePriority : function(data,clusteringKey,targetId,callback){
        var query_object = {
            activity_id: models.timeuuidFromString(targetId),
            activity_created_by: models.uuidFromString(clusteringKey),
        };

        var update_values_object = {activity_priority: data};
        var options = {ttl: 86400, if_exists: true};
        models.instance.Activity.update(query_object, update_values_object, options, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    subActivitiesParticipantsUtils : function(params){
        return new Promise((resolve,reject)=>{
            
            var c_id = new Set();

            _.forEach(params, function(val, k){
                c_id.add(models.uuidFromString(val));
            });

            var msgarray = Array.from(c_id);
            var promises = [];
            var itemRows = msgarray;

            for(var i = 0; i < itemRows.length; i++) {
                var id = itemRows[i];
                var p = new Promise(function(resolve, reject){self.dbData(id, resolve, reject);});
                promises.push(p);
            }

            Promise.all(promises).then(function(data) {
                resolve({status:true, data:data});
            }).catch((err)=>{
                reject({status:false});
            });
        });
    },
    
    cusColVal : function(id, resolve, reject){
    
        var query = {
            col_id: { $eq:  id}
        };
        models.instance.ActivityCCValue.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
            if(err) {
                return reject();
            }else{
                return resolve(activities);
            }
        });
    },
    
    dbData : function(id, resolve, reject){
    
        var query = {
            activity_id: { $eq:  id}
        };
        models.instance.ActivityParticipants.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
            if(err) {
                return reject();
            }else{
                return resolve(activities);
            }
        });
    },

    deleteStatusUtils : function(param){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(param.targetId)){
                var query_object = {
                    id: models.timeuuidFromString(param.targetId)
                };
                
                models.instance.ActivityCusStatus.delete(query_object, function(err){
                    if(err) {
                        reject({ status: false, err: err });
                    }else {
                        resolve({ status: true});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    deleteActivityUtils : function(param){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(param.targetId)){
                var query_object = {
                    activity_id: models.timeuuidFromString(param.targetId),
                    activity_created_by: models.uuidFromString(param.clusteringKey)
                };
                
                models.instance.Activity.delete(query_object, function(err){
                    if(err) {
                        reject({ status: false, err: err });
                    }else {
                        resolve({ status: true});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    saveCustomColUtils : function(params){
        return new Promise((resolve,reject)=>{
            var col_title = !Validator.isEmpty(params.col_title) ? params.col_title : '';
            if (Validator.isEmpty(col_title)) {
                reject({'status':false});
            }else{
                
                var col_id = models.uuid();
    
                var activityCustomCol = new models.instance.ActivityCustomCol({
                    col_id          : col_id,
                    col_type        : params.col_type,
                    col_title       : params.col_title,
                    col_formula     : params.col_formula,
                    activity_id     : models.uuidFromString(params.activity_id),
                    created_by      : models.uuidFromString(params.created_by)
                });
    
                activityCustomCol.saveAsync().then(function() {
                    resolve({ status: true, col_id});
                }).catch(function(err) {
                    reject({status:false, err: err});
                });
            }
        });
    },

    customColUpdateUtils : function(params){
        return new Promise((resolve,reject)=>{
            if (Validator.isEmpty(params.activity_id)) {
                reject({'status':false});
            }else{
                
                var id = models.uuid();
    
                var activityCustomCol = new models.instance.ActivityCCValue({
                    id          : id,
                    col_id      : models.uuidFromString(params.col_id),
                    activity_id : models.uuidFromString(params.activity_id),
                    col_value   : params.col_value.toString(),
                    created_by  : models.uuidFromString(params.created_by)
                });
    
                activityCustomCol.saveAsync().then(function() {
                    resolve({ status: true, id:id});
                }).catch(function(err) {
                    reject({status:false, err: err});
                });
            }
        });
    },

    activityUtilityUtils : function(params){
        return new Promise((resolve,reject)=>{
            if (Validator.isEmpty(params.targetId)) {
                reject({'status':false});
            }else{
                var respons;

                var data = {
                    targetId      : params.targetId,
                    createdby     : params.createdby
                };

                switch(params.type){
                    case 'pin':
                        self.activityPin(data,(response)=>{
                            resolve({respons:response});
                        });
                        break;
                    case 'unpin':
                        self.activityUnPin(data,(response)=>{
                            resolve({respons:response});
                        });
                        break;
                    case 'flag':
                        self.activityFlag(data,(response)=>{
                            resolve({respons:response});
                        });
                        break;
                    case 'unflag':
                        self.activityUnFlag(data,(response)=>{
                            resolve({respons:response});
                        });
                        break;
                }

                
            }
        });
    },
    activityPin: function(params,callback){

        var pinid = models.uuid();
    
        var activityCustomCol = new models.instance.Activitypin({
            pin_id          : pinid,
            activity_id     : models.uuidFromString(params.targetId),
            user_id         : models.uuidFromString(params.createdby)
        });

        activityCustomCol.saveAsync().then(function() {
            callback({ status: true, id:pinid});
        }).catch(function(err) {
            callback({ status:false, err: err});
        });
    },

    activityFlag: function(params,callback){

        var flag_id = models.uuid();
    
        var activityCustomCol = new models.instance.ActivityFlag({
            flag_id       : flag_id,
            activity_id   : models.uuidFromString(params.targetId),
            user_id       : models.uuidFromString(params.createdby)
        });

        activityCustomCol.saveAsync().then(function() {
            callback({ status: true, id:flag_id});
        }).catch(function(err) {
            callback({ status:false, err: err});
        });
    },

    activityUnPin: function(params,callback){

        var query_object = {
            pin_id: models.uuidFromString(params.targetId),
            activity_id: models.uuidFromString(params.createdby)
        };
        
        models.instance.Activitypin.delete(query_object, function(err){
            if(err) {
                callback({ status:false, err: err});
            }else {
                callback({ status:true, id:params.targetId});
            }
        });
    },

    activityUnFlag: function(params,callback){

        var query_object = {
            flag_id: models.uuidFromString(params.targetId),
            activity_id: models.uuidFromString(params.createdby)
        };
        
        models.instance.ActivityFlag.delete(query_object, function(err){
            if(err) {
                callback({ status:false, err: err});
            }else {
                callback({ status:true, id:params.targetId});
            }
        });
    },

    singleActivityPinUtils: function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)},
                    user_id: {'$eq': models.uuidFromString(params.activityCreatedBy)}
                };
                models.instance.Activitypin.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    activitySettingUtils: function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)},
                    user_id: {'$eq': models.uuidFromString(params.activityCreatedBy)}
                };
                models.instance.ActivitiesSettings.find(query, { raw: true, allow_filtering: true }, function (err, settings) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, settings: settings});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },

    singleActivityFlagUtils: function(params){
        return new Promise((resolve,reject)=>{
            if(!Validator.isEmpty(params.activity_id)){
                var query = {
                    activity_id: {'$eq': models.uuidFromString(params.activity_id)},
                    user_id: {'$eq': models.uuidFromString(params.activityCreatedBy)}
                };
                models.instance.ActivityFlag.find(query, { raw: true, allow_filtering: true }, function (err, activities) {
                    if (err) {
                        reject({ status: false, err: err });
                    } else {
                        resolve({ status: true, activities: activities});
                    }
                });
            }else{
                reject({ status: false, err: 'Data Missing' });
            }
        });
    },
    
    get_messages_tag : function(params){
        return new Promise((resolve,reject)=>{
            models.instance.MessagesTag.find({conversation_id: models.uuidFromString(params.activity_id), tagged_by:models.uuidFromString(params.activityCreatedBy) }, {raw:true, allow_filtering: true}, function(err, tags){
                if(err){
                    reject({status: false, err: err});
                }else{
                    resolve({status: true, tags: tags});
                }
            });
        });
    },
      
    get_myTags : function(params) {
        return new Promise((resolve,reject)=>{
            models.instance.Tag.find({
                tagged_by: models.uuidFromString(params.activityCreatedBy),
                type: "TODO"
            }, {
                allow_filtering: true
            }, function (tagserr, tags) {
                if (tagserr) {
                    reject({
                        status: false,
                        err: tagserr
                    });
                } else {
            
                    models.instance.Convtag.find({
                        conversation_id: models.uuidFromString(params.activity_id)
                    }, {
                        allow_filtering: true
                    }, function (err, Ctags) {
                        if (tagserr) {
                            reject({
                                status: false,
                                err: tagserr
                            });
                        } else {
                            resolve({
                                status: true,
                                tags: tags,
                                Ctags: Ctags
                            });
                        }
                    });
                }
            });
        });
        
    },

    getMycustomStatus : function(data, callback){
        console.log(1138,data);
        return new Promise((resolve,reject)=>{
            models.instance.ActivityCusStatus.find({user_id: models.uuidFromString(data.activityCreatedBy) }, {raw:true, allow_filtering: true}, function(err, response){
                if(err){
                    reject({status: false, err: err});
                }else{
                    resolve({status: true, response: response});
                }
            });
        });
    },

    getActivityDetail : function(data, callback){
        models.instance.Activity.findOne({activity_id:models.timeuuidFromString(data.targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
            if(err){
            callback({status: false, err: err});
            }else{
            callback({status: true, activityDetail: activityDetail});
            }
        });
    },

    customStatusSaveUtils : function(params){
        return new Promise((resolve,reject)=>{
            if (Validator.isEmpty(params.activityId)) {
                reject({'status':false});
            }else{
                
                var id = models.timeuuid();
    
                var activityCustomCol = new models.instance.ActivityCusStatus({
                    id          : id,
                    activity_id : models.uuidFromString(params.activityId),
                    user_id     : models.uuidFromString(params.activityCreatedBy),
                    title       : params.activityUpdateData.name,
                    type        : params.activityUpdateType,
                    color_code  : params.activityUpdateData.color
                });
    
                activityCustomCol.saveAsync().then(function() {
                    resolve({ status: true, id:id});
                }).catch(function(err) {
                    reject({status:false, err: err});
                });
            }
        });
    },

    cStatusUpdateUtils : function(params){
        return new Promise((resolve,reject)=>{
            var query_object = {
                id: models.timeuuidFromString(params.targetId),
            };
    
            var update_values_object = {title: params.value};
            var options = {ttl: 86400, if_exists: true};
            models.instance.ActivityCusStatus.update(query_object, update_values_object, options, function(err){
                if(err) 
                    reject({status:false, err: err});
                else
                    resolve({ status: true});
            });
        });
    },

    ccolValUpdateUtils : function(params){
        return new Promise((resolve,reject)=>{
            // var query_object = {
            //     id: models.timeuuidFromString(params.targetId),
            // };
    
            // var update_values_object = {title: params.value};
            // var options = {ttl: 86400, if_exists: true};
            // models.instance.ActivityCusStatus.update(query_object, update_values_object, options, function(err){
            //     if(err) 
            //         reject({status:false, err: err});
            //     else
            //         resolve({ status: true});
            // });
            resolve({ status: true});
        });
    },

    UpdateLogEntryUtils : function(params){
        var id = models.timeuuid();
    
        var activityCustomCol = new models.instance.ActivityMasterTbl({
            id                      : id,
            target_position         : params.activityUpdateType,
            target_id               : models.uuidFromString(params.targetId),
            updated_by              : models.uuidFromString(params.clusteringKey),
            target_pre_value        : params.activityUpdateData.toString(),
            target_current_value    : (Array.isArray(params.activityUpdateData ) ? params.activityUpdateData.join(',') : params.activityUpdateData.toString())
        });


        activityCustomCol.saveAsync().then(function() {
            console.log(1235,params);
        }).catch(function(err) {
            console.log(1237,err);
        });
    },

    activitychangelog: function(params,callback){
        var query = {
            activity_id: { $eq:  models.uuidFromString(params.targetId)},
            activity_type: { $eq: params.targetType },
        };
        
        models.instance.Activitychangelog.find(query, {allow_filtering: true },function(err, activityDetail){
            if(err){
                callback({status: false, err: err});
            }else{
                callback({status: true, activityDetail: activityDetail});
            }
        });
    },


    _setting_utils : function(params){
        console.log(params);
        return new Promise((resolve,reject)=>{
            if(isEmpty(params.activityUpdateData && isEmpty(params.activityType))){
                reject({ status: false, err: 'Value missing' });
            }else{
                if(params.activityUpdateData == '2'){
                    var id = models.uuid();
            
                    var activitySet = new models.instance.ActivitiesSettings({
                        setting_id     : id,
                        activity_type  : (params.clusteringKey == undefined ? 'Task':params.clusteringKey),
                        activity_id    : models.uuidFromString(params.activityId),
                        user_id        : models.uuidFromString(params.activityCreatedBy),
                        setting_type   : params.activityType.toString(),
                        setting_val    : 0
                    });
        
        
                    activitySet.saveAsync().then(function() {
                        resolve({ status: true, settingid: id});
                    }).catch(function(err) {
                        reject({ status: false, err: err });
                    });
                }else{
                    if(isEmpty(params.targetId) && isEmpty(params.activityType)){
                        reject({ status: false, err: 'Setting id missing'});
                    }else{

                        if(params.clusteringKey == 'freeze'){
                            if(params.activityUpdateData == '1'){
                                self.deleteAllFreezeSetting(params.activityId,params.clusteringKey);
                                resolve({ status: true, settingid: params.targetId});
                            }else if(params.activityUpdateData == '4'){
                                var setid = self.addFreezeSettingAfterDel(params.activityId,params.clusteringKey,params.activityCreatedBy,params.activityType);
                                if(setid){
                                    resolve({ status: true, settingid: setid});
                                }
                            }
                            
                        }else{
                            var query_object = {
                                setting_id: models.uuidFromString(params.targetId),
                            };
                    
                            var update_values_object = {setting_val: parseInt(params.activityUpdateData)};
                            var options = {ttl: 86400, if_exists: true};
                            models.instance.ActivitiesSettings.update(query_object, update_values_object, options, function(err){
                                if(err) 
                                    reject({status:false, err: err});
                                else
                                resolve({ status: true, settingid: params.targetId});
                            });
                        }
                    }
                }
            }
        });
    },

    deleteAllFreezeSetting: function(activity_id,clusteringKey){
        var query = {
            activity_id: { $eq:  models.uuidFromString(activity_id)},
            activity_type: { $eq:  clusteringKey}
        };
        models.instance.ActivitiesSettings.find(query, { raw: true, allow_filtering: true }, function (err, sets) {
            if (err) {
                console.log(err);
            } else {

                var queries = [];
                _.each(sets, (v,k)=>{
                    queries.push({
                        query: "DELETE FROM activitiessettings WHERE setting_id = ? ",
                        params: [v.setting_id.toString()]
                    });
                });
                
                models.instance.ActivitiesSettings.execute_batch(queries, function(err){
                    return true;
                });
            }
        });
    },

    addFreezeSettingAfterDel: function(activity_id,clusteringKey,activityCreatedBy,activityType){
        var query = {
            activity_id: { $eq:  models.uuidFromString(activity_id)},
            activity_type: { $eq:  clusteringKey}
        };
        models.instance.ActivitiesSettings.find(query, { raw: true, allow_filtering: true }, function (err, sets) {
            if (err) {
                console.log(err);
            } else {

                var queries = [];
                _.each(sets, (v,k)=>{
                    queries.push({
                        query: "DELETE FROM activitiessettings WHERE setting_id = ? ",
                        params: [v.setting_id.toString()]
                    });
                });
                
                models.instance.ActivitiesSettings.execute_batch(queries, function(err){
                    var id = models.uuid();
            
                    var activitySet = new models.instance.ActivitiesSettings({
                        setting_id     : id,
                        activity_type  : clusteringKey,
                        activity_id    : models.uuidFromString(activity_id),
                        user_id        : models.uuidFromString(activityCreatedBy),
                        setting_type   : activityType.toString(),
                        setting_val    : 0
                    });
        
        
                    activitySet.saveAsync().then(function() {
                        return id;
                    }).catch(function(err) {
                        return false;
                    });
                });
            }
        });
    },

    getMyactivitiesOnConnectUtils : async function(params, callback){
        var activityIds = [];
        var myActivityIds = [];
        const users = await self.findCalendarUser();
        const getMyAllActivity = await self.getMyAllActivityUtils(params.targetId,'Task').catch((err)=>{console.log(36,err)});
        const getParcipatedActivity = await self.getParcipatedActivityUtils(params.targetId,'Task').catch((err)=>{console.log(37,err)});
        
        if(getParcipatedActivity.activities.length > 0){
            _.forEach(getParcipatedActivity.activities, function(val, k){
                if(activityIds.indexOf(val.activity_id.toString()) == -1){
                    activityIds.push(val.activity_id.toString());
                }
            });
        }

        if(getMyAllActivity.activities.length > 0){
            _.forEach(getMyAllActivity.activities, function(val, k){
                if(myActivityIds.indexOf(val.activity_id.toString()) == -1){
                    myActivityIds.push(val.activity_id.toString());
                }
            });
        }

        if(activityIds.length > 0){
            const getParcipatedActivityList = await self.getParcipatedActivityListUtils(activityIds).catch((err)=>{console.log(47,err)});
            var activities = _.concat(getMyAllActivity.activities, getParcipatedActivityList.activities);
        }else{
            var activities = _.orderBy(getMyAllActivity.activities, ["activity_created_at"], ["desc"]);
        }

        var allActivities = _.concat(myActivityIds,activityIds);
        var pinnedData = await self.pinnedDataUtils(allActivities,params.targetId).catch((err)=>{console.log(56,err)});
        var flaggeddData = await self.flaggeddDataUtils(allActivities,params.targetId).catch((err)=>{console.log(57,err)});

        
        var pinIs = [];
        var flagsIs = [];
        if(pinnedData != undefined){
            if(pinnedData.status){
                if(pinnedData.activities.length > 0){
                    _.forEach(pinnedData.activities, function(val, k){
                        if(pinIs.indexOf(val.activity_id.toString()) == -1){
                            pinIs.push(val.activity_id.toString());
                        }
                    });
                }
            }
        }
        
        if(flaggeddData != undefined){
            if(flaggeddData.status){
                if(flaggeddData.activities.length > 0){
                    _.forEach(flaggeddData.activities, function(val, k){
                        if(flagsIs.indexOf(val.activity_id.toString()) == -1){
                            flagsIs.push(val.activity_id.toString());
                        }
                    });
                }
            }
        }

        var now = moment(new Date()); //todays date
        var mytdoList = {};
        var overdue = [];
        var pinned = [];
        var normaltodo = [];
        var uniqActivitiesid = [];

        _.each(activities, function(todo,ke){
            if(uniqActivitiesid.indexOf(todo.activity_id.toString()) == -1){
                uniqActivitiesid.push(todo.activity_id.toString())
                mytdoList[todo.activity_id] = {
                    'todoid': todo.activity_id,
                    'reminder_time': todo.activity_has_reminder,
                    'todo_enddate': todo.activity_end_time,
                    'todo_starttime': todo.activity_from,
                    'todo_endtime': todo.activity_to,
                    'todo_createdby': todo.activity_created_by
                };
    
                var date2 = new Date();
                var date1 = new Date(todo.activity_end_time);
                var timeDiff = date2.getTime() - date1.getTime();
                var days = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (flagsIs.indexOf(todo.activity_id.toString()) > -1) {
                    todo['hasflag'] = 1;
                } else {
                    todo['hasflag'] = 0;
                }
                todo['days'] =  days;
                if(days > 1){ // if days greater then 1 it will cross today
                    if (pinIs.indexOf(todo.activity_id.toString()) > -1) {
                        pinned.push(todo);
                    } else {
                        overdue.push(todo);
                    }
                }else{
                    if (pinIs.indexOf(todo.activity_id.toString()) > -1) {
                        pinned.push(todo);
                    } else {
                        normaltodo.push(todo);
                    }
                   
                }
            }
        });

        models.instance.Tag.find({ tagged_by: models.uuidFromString(params.targetId), type: "TODO"}, { allow_filtering: true }, function(tagserr, tags){
            if(tagserr){
              throw tagserr;
            }else{
              
              var res_data = {
                data: [{
                    users: users,
                    pinned:pinned,
                    overdue:overdue,
                    normaltodo:normaltodo,
                    tags: tags,
                    tdoList: mytdoList
                }]
              };

              callback(res_data);
            }
        });
    },

    findCalendarUser : function(){
        return new Promise((resolve,reject)=>{
            models.instance.Users.find({
                is_delete: 0
            }, {
                raw: true,
                allow_filtering: true
            }, function (err, users) {
                if (err){
                    reject(err);
                }else{
                    resolve(users);
                }
            });
        });
    },

    _saveColSerial_utils : function(params){
        return new Promise((resolve,reject)=>{
            if(!isEmpty(params.targetId)){
                self._deleteColSort(params.targetId,params.activityType,(response)=>{
                    if(response.status){
                        var queries = [];
                        _.each(params.activityUpdateData, (v,k)=>{
                            var id = models.uuid();
                            queries.push({
                                query: "INSERT INTO activitydnd(id,activity_id,user_id,col_name,col_sl,col_type) VALUES(?,?,?,?,?,?)",
                                params: [id,params.targetId,params.activityCreatedBy,v,k,params.activityType]
                            });
                        });
                        
                        models.instance.ActivitiesSettings.execute_batch(queries, function(err){
                            resolve({status:true});
                        });
                    }else{
                        reject({status:false,error:'unable to delete, please contact with dev team',response});
                    }
                });
            }else{
                reject({status:false,error:'param missing'});
            }
        });
    },

    _deleteColSort : function(targetid,activityType,callback){
        models.instance.Activitydnd.find({
            activity_id: { $eq:  models.uuidFromString(targetid)},
            col_type : { $eq:  activityType}
        }, {
            raw: true,
            allow_filtering: true
        }, function (err, sortRes) {
            if (err){
                callback({status:false,err:err});
            }else{
                if(sortRes != undefined){
                    if(sortRes.length > 0){
                        var queries = [];
                        _.each(sortRes, (v,k)=>{
                            queries.push({
                                query: "DELETE FROM activitydnd WHERE id = ?",
                                params: [v.id.toString()]
                            });
                        });
                        
                        models.instance.Activitydnd.execute_batch(queries, function(err){
                            if(err) {
                                callback({status:false,err:err});
                            }else{
                                callback({status:true});
                            }
                        });
                    }else{
                        callback({status:true});
                    }   
                }else{
                    callback({status:false,err:'Error in find query'});
                }
                
            }
        });
    },

    _getAllColSortOnSingleActivity : function(targetid){
        return new Promise((resolve,reject)=>{
            models.instance.Activitydnd.find({
                activity_id: { $eq:  models.uuidFromString(targetid)}
            }, {
                raw: true,
                allow_filtering: true
            }, function (err, sortRes) {
                if (err){
                    reject({status:false,res:'param missing'});
                }else{
                    resolve({status:true,res:sortRes});
                }
            });
        });
    },

    _convarsationListUtils : function (str,con_list,callback){
        var c_id = new Set();

        _.forEach(con_list, function(val, k){
            c_id.add(models.uuidFromString(val));
        });

        var msgarray = Array.from(c_id);
        var promises = [];
        var itemRows = msgarray;

        for(var i = 0; i < itemRows.length; i++) {
            var id = itemRows[i];
            var p = new Promise(function(resolve, reject){self.conversationdata(id, resolve, reject);});
            promises.push(p);
        }

        Promise.all(promises).then(function(data) {
            callback({status:true, data:data});
        }).catch((err)=>{
            callback({status:false,err:err});
        });
    },

    businessUnitSearch : function(bunitlist, callback){
        var c_id = new Set();

        _.forEach(bunitlist, function(val, k){
            c_id.add(models.timeuuidFromString(val));
        });

        var msgarray = Array.from(c_id);
        var promises = [];
        var itemRows = msgarray;

        for(var i = 0; i < itemRows.length; i++) {
            var id = itemRows[i];
            var p = new Promise(function(resolve, reject){self.bunitdata(id, resolve, reject);});
            promises.push(p);
        }

        Promise.all(promises).then(function(data) {
            callback({status:true, data:data});
        }).catch((err)=>{
            callback({status:false,err:err});
        });
    },

    conversationTagSearch : function(con_list, callback){
        var c_id = new Set();

        _.forEach(con_list, function(val, k){
            c_id.add(models.timeuuidFromString(val));
        });

        var msgarray = Array.from(c_id);
        var promises = [];
        var itemRows = msgarray;

        for(var i = 0; i < itemRows.length; i++) {
            var id = itemRows[i];
            var p = new Promise(function(resolve, reject){self.convtagdata(id, resolve, reject);});
            promises.push(p);
        }

        Promise.all(promises).then(function(data) {
            callback({status:true, data:data});
        }).catch((err)=>{
            callback({status:false,err:err});
        });
    },
    
    conversationdata : function(id, resolve, reject){
        var query = {
            conversation_id: { $eq:  id}
        };
        
        models.instance.Conversation.findOne(query, {allow_filtering: true },function(err, detail){
            if(err) {
                return reject();
            }else{
                return resolve(detail);
            }
        });
    },
    
    bunitdata : function(id, resolve, reject){
        var query = {
            unit_id: { $eq:  id}
        };
        
        models.instance.BusinessUnit.findOne(query, {allow_filtering: true },function(err, detail){
            if(err) {
                return reject();
            }else{
                return resolve(detail);
            }
        });
    },
    
    convtagdata : function(id, resolve, reject){
        var query = {
            conversation_id: { $eq:  id}
        };

        models.instance.Convtag.find(query, { raw: true, allow_filtering: true },function(err, detail){
            if(err) {
                return reject();
            }else{
                return resolve(detail);
            }
        });
    },

    updateUserEmail : function(data, callback) {
        var updateQuery = {email: data.email};
        models.instance.Users.update({id: models.uuidFromString(data.id)}, updateQuery, update_if_exists, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    },

    updateUserName : function(data, callback) {
        var updateQuery = {fullname: data.name};
        models.instance.Users.update({id: models.uuidFromString(data.id)}, updateQuery, update_if_exists, function(err){
            if(err) callback({status:false, err: err});
            else callback({status:true});
        });
    }
    

};

