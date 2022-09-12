
"use strict";

function Activity(
    activityTitle,
    activityEcosystem,
    activityStatus,
    activityDueDate,
    activityNotesArea,
    activityFfrom,
    activityTo,
    activityReminder,
    activityBudgeAmount,
    activityEstHour,
    activityActualHour,
    activityType,
    activityActualAmount,
    activityEstHourRate,
    activityActualHourRate,
    activityCreatedBy,
    participantsArry,
    activityId,
    activityHasRoot,
    activityRootId,
    activityUpdateData,
    activityUpdateType,
    clusteringKey,
    participantType,
    participantedTblID,
    activityColType,
    activityColTitle,
    activityColFormula,
    customColId,
    targetID,
    isBatchActive
    ){
    this.activityTitle              = activityTitle;
    this.activityEcosystem          = activityEcosystem;
    this.activityStatus             = activityStatus;
    this.activityDueDate            = activityDueDate;
    this.activityNotesArea          = activityNotesArea;
    this.activityFfrom              = activityFfrom;
    this.activityTo                 = activityTo;
    this.activityReminder           = activityReminder;
    this.activityBudgeAmount        = activityBudgeAmount;
    this.activityActualAmount       = activityActualAmount;
    this.activityEstHour            = activityEstHour;
    this.activityEstHourRate        = activityEstHourRate;
    this.activityActualHour         = activityActualHour;
    this.activityActualHourRate     = activityActualHourRate;
    this.activityType               = activityType;
    this.activityCreatedBy          = activityCreatedBy;
    this.participantsArry           = participantsArry;
    this.activityId                 = activityId;
    this.activityHasRoot            = activityHasRoot;
    this.activityRootId             = activityRootId;
    this.activityUpdateData         = activityUpdateData;
    this.activityUpdateType         = activityUpdateType;
    this.clusteringKey              = clusteringKey;
    this.participantType            = participantType;
    this.participantedTblID         = participantedTblID;
    this.activityColType            = activityColType;
    this.activityColTitle           = activityColTitle;
    this.activityColFormula         = activityColFormula;
    this.customColId                = customColId;
    this.targetID                   = targetID;
    this.isBatchActive              = isBatchActive;
}

Activity.prototype.saveActivity = function (callback) {
    if(validate.isEmpty(this.activityTitle) && validate.isEmpty(this.activityCreatedBy)){
        callback({'status':false});
    }else{
        let data = {
            activityTitle           : (!validate.isEmpty(this.activityTitle)         ? this.activityTitle : 'NA') ,
            activityEcosystem       : (!validate.isEmpty(this.activityEcosystem)     ? this.activityEcosystem : 'Navigate'),
            activityStatus          : (!validate.isEmpty(this.activityStatus)        ? this.activityStatus : ''),
            activityDueDate         : (!validate.isEmpty(this.activityDueDate)       ? this.activityDueDate : ''),
            activityNotesArea       : (!validate.isEmpty(this.activityNotesArea)     ? this.activityNotesArea : ''),
            activityFfrom           : (!validate.isEmpty(this.activityFfrom)         ? this.activityFfrom : ''),
            activityTo              : (!validate.isEmpty(this.activityTo)            ? this.activityTo : ''),
            activityReminder        : (!validate.isEmpty(this.activityReminder)      ? this.activityReminder : ''),
            activityBudgeAmount     : (!validate.isEmpty(this.activityBudgeAmount)   ? this.activityBudgeAmount : null),
            activityActualAmount    : (!validate.isEmpty(this.activityActualAmount)  ? this.activityActualAmount : null),
            activityEstHour         : (!validate.isEmpty(this.activityEstHour)       ? this.activityEstHour : null),
            activityEstHourRate     : (!validate.isEmpty(this.activityEstHourRate)   ? this.activityEstHourRate : null),
            activityActualHour      : (!validate.isEmpty(this.activityActualHour)    ? this.activityActualHour : null),
            activityActualHourRate  : (!validate.isEmpty(this.activityActualHourRate)? this.activityActualHourRate : null),
            activityType            : (!validate.isEmpty(this.activityType)          ? this.activityType : 'Task'),
            activityCreatedBy       : (!validate.isEmpty(this.activityCreatedBy)     ? this.activityCreatedBy : ''),
            activityHasRoot         : (!validate.isEmpty(this.activityHasRoot)       ? this.activityHasRoot : null),
            activityRootId          : (!validate.isEmpty(this.activityRootId)        ? this.activityRootId : null)
        };

        var self = this;    
        
        socket.emit('saveActivitySocket', {
            data
        },function (confirmation) {
            if(!validate.isEmpty(confirmation)){
                if(validate.isBoolean(confirmation.status)){
                    self.activityid = confirmation.activity_id;
                    if(validate.isArray(self.participantsArry)){
                        if(self.participantsArry.length > 0){
                            Activity.prototype.addParticipants.call(self,(response)=>{
                                callback(confirmation);
                            });
                        }else{
                            callback(confirmation);
                        }
                    }else{
                        callback(confirmation);
                    }
                }
            }else{
                callback(confirmation);
            }
        });
    }
};

Activity.prototype.addParticipants = function (callback) {
    let data = {
        activityTitle           : this.activityTitle,
        activityCreatedBy       : this.activityCreatedBy,
        participant             : this.participantsArry,
        activity_id             : this.activityid,
        activity_type           : this.activityType,
        participantType         : this.participantType
    };

    socket.emit('saveParticipants', {
        data
    },function (confirmation) {
        if(validate.isBoolean(confirmation.status)){
            callback(confirmation);
        }
    });
};



Activity.prototype.singleActivity_participants = function (callback) {
    let data = {
        activity_id          : this.activityId
    };
    var self = this;
    socket.emit('singleActivity_participants', {
        data
    },function (confirmation) {
        
        let participantsRes = confirmation.singleActivityParticipantsResponse;
        var participants  = [];
        if(participantsRes.status){
            if(participantsRes.participants.length > 0){
                $.each(participantsRes.participants, (k,v)=>{
                    participants.push({
                        id      :   v.user_id,
                        type    :   v.participant_type,
                        tbl_id  :   v.tbl_id
                    });
                });
            }
            callback({
                status                          : true,
                participants                    : participants
            });
        }else{
            callback({
                status : false
            });
        }
        
    });
};

Activity.prototype.getSingleActivity = function (callback) {
    let data = {
        activity_id          : this.activityId,
        activityCreatedBy    : this.activityCreatedBy
    };
    var self = this;
    socket.emit('singleActivity', {
        data
    },function (confirmation) {
        let activityRes = confirmation.singleActivityResponse;
        let participantsRes = confirmation.singleActivityParticipantsResponse;
        
        if(activityRes.status){
            var activity = activityRes.activities;
            var participants  = [];
            if(participantsRes.status){
                if(participantsRes.participants.length > 0){
                    $.each(participantsRes.participants, (k,v)=>{
                        participants.push({
                            id      :   v.user_id,
                            type    :   v.participant_type,
                            tbl_id  :   v.tbl_id
                        });
                    });
                }

                Activity.prototype.getChildActivitys.call(self,(response)=>{
                    callback({
                        status                          : true,
                        activityDetail                  : activity,
                        participants                    : participants,
                        childActivities                 : response.childActivities,
                        childActivitiesParticipants     : response.childActivitiesParticipantsRes.data,
                        customActivityColRes            : response.customActivityColRes,
                        singleActivityPinResponse       : confirmation.singleActivityPinResponse,
                        singleActivityFlagResponse      : confirmation.singleActivityFlagResponse,
                        totalTags                       : confirmation.totalTags,
                        tags                            : confirmation.tags,
                        condtagsid                      : confirmation.condtagsid,
                        messagestag                     : confirmation.messagestag,
                        customStatusResponse            : confirmation.customStatusResponse, // for subtasks status and phase
                        childActivityFlagResponse       : response.childActivityFlagResponse, // For get subtask flagged data
                        activitySettingResponse         : confirmation.activitySettingResponse,
                        getChangeLogResponse            : confirmation.getChangeLogResponse, // for activity changelog
                        _ColSortOnActivity              : confirmation._getAllColSortOnSingleActivityRes //for subtask coloum sorting
                    });
                });
            }
        }else{
            callback({
                status : false
            });
        }
        
    });
};

Activity.prototype.getChildActivitys = function (callback) {
    let data = {
        activity_id     : this.activityId,
        created_by      : this.activityCreatedBy
    };
    socket.emit('childActivitys', { data },function (confirmation) {
        let childActivityRes                = confirmation.childActivitysResponse;
        let childActivitiesParticipantsRes  = confirmation.subActivitiesParticipantsresponse;
        let customActivityColRes            = confirmation.customActivityColRes;
        let childActivityFlagResponse       = confirmation.childActivityFlagResponse;

        if(childActivityRes.status){
            var activity = childActivityRes.activities;
            callback({
                status                          : true,
                childActivities                 : activity,
                childActivitiesParticipantsRes  : childActivitiesParticipantsRes,
                customActivityColRes            : customActivityColRes,
                childActivityFlagResponse       : childActivityFlagResponse,
            });
        }else{
            callback({
                status : false
            });
        }
        
    });
};

Activity.prototype.activityBatchUpdate = function (callback) {
    let data = {
        activityUpdateType      : this.activityUpdateType,
        activityUpdateData      : this.activityUpdateData,
        targetId                : this.activityId,
        activityType            : this.activityType,
        isBatchActive           : this.isBatchActive
    };

    if(!validate.isEmpty(this.activityUpdateData)){
        socket.emit('activityBatchUpdateSocket', {
            data
        },function (confirmation) {
            callback(confirmation);
        });
    }
    
};
Activity.prototype.activityUpdate = function (callback) {
    let data = {
        activityUpdateType      : this.activityUpdateType,
        activityUpdateData      : this.activityUpdateData,
        targetId                : this.activityId,
        clusteringKey           : this.clusteringKey,
        activityType            : this.activityType,
        participantType         : this.participantType,
        participantedTblID      : this.participantedTblID,
    };

    if(!validate.isEmpty(this.activityUpdateType)){
        socket.emit('activityUpdateSocket', { data },function (confirmation) {
            callback(confirmation);
        });
    }
    
};

Activity.prototype.assigneeParticipantsDelete = function (callback) {
    let data = {
        participantedTblID      : this.participantedTblID,
        activityId              : this.activityId,
        targetID                : this.targetID,
        participantType         : this.participantType
    };
    
    socket.emit('assigneeParticipantsDeleteSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.deleteActivity = function (callback) {
    let data = {
        targetId                : this.activityId,
        clusteringKey           : this.activityCreatedBy
    };
    
    socket.emit('deleteActivitySocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.saveCustomCol = function (callback) {
    let data = {
        col_type                : this.activityColType,
        activity_id             : this.activityId,
        created_by              : this.activityCreatedBy,
        col_title               : this.activityColTitle,
        col_formula             : this.activityColFormula
    };
    
    socket.emit('saveCustomColSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.customColSave = function(callback){
    let data = {
        activity_id             : this.activityId,
        created_by              : this.activityCreatedBy,
        col_id                  : this.customColId,
        col_value               : this.activityUpdateData
    };
    
    socket.emit('customColSaveSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.customColUpdate = function(callback){
    let data = {
        targetId          : this.targetID,
        clusteringKey     : this.customColId,
        value             : this.activityUpdateData
    };
    
    socket.emit('colValUpdateSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.activityUtility = function(callback){
    let data = {
        targetId          : this.activityId,
        createdby         : this.activityCreatedBy,
        type              : this.activityUpdateData
    };
    
    socket.emit('activityUtilitySocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.activityHistory = function(callback){
    let data = {
        targetId          : this.activityId
    };
    
    socket.emit('activityHistorySocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.customStatusSave = function(callback){
    let data = {
        activityId             : this.activityId,
        activityCreatedBy      : this.activityCreatedBy,
        activityUpdateType     : this.activityUpdateType,
        activityUpdateData     : this.activityUpdateData
    };
    
    socket.emit('customStatusSaveSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.deleteStatus = function (callback) {
    let data = {
        targetId                : this.activityId
    };
    
    socket.emit('deleteStatusSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype.customStatusUpdate = function(callback){
    let data = {
        targetId          : this.targetID,
        value             : this.activityUpdateData
    };
    
    socket.emit('customStatusUpdateSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype._partiDlt = function(callback){
    let data = {
        participantedTblID          : this.participantedTblID
    };
    
    socket.emit('_partiDltSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

// Assign member to child activity accoroding to root activity on demand.
// SEND 
// activityId          : this.activityId,
// activityUpdateData  : this.activityUpdateData,
// activityType        : this.activityType
// RECEIVE
// Row id for all user(s) with a status

Activity.prototype._s_p_o_f = function(callback){
    let data = {
        activityId          : this.activityId,
        activityUpdateData  : this.activityUpdateData,
        activityType        : this.activityType
    };
    
    socket.emit('_s_p_o_f_socket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

// Activities Setting wrt user id accoroding to activity
// SEND
// setting val
// setting type
// activity id
// user id
// RECEIVE
// setting tbl id as per user request for specific activity id

Activity.prototype._setting = function(callback){
    let data = {
        targetId            : this.targetID, //Setting id
        activityId          : this.activityId,
        activityUpdateData  : this.activityUpdateData,  //setting value
        activityType        : this.activityType,        //setting type
        activityCreatedBy   : this.activityCreatedBy,
        clusteringKey       : this.clusteringKey,
    };

    console.log(data);

    socket.emit('_setting_socket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

// Get all Activities for connect page

Activity.prototype.getMyactivitiesOnConnect = function(callback){
    let data = {
        targetId  : this.targetID
    };

    socket.emit('getMyactivitiesOnConnectSocket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};

Activity.prototype._saveColSerial = function(callback){
    let data = {
        targetId            : this.targetID, //Setting id
        activityUpdateData  : this.activityUpdateData,  //setting value
        activityCreatedBy   : this.activityCreatedBy,
        activityType        : this.activityType,
    };

    socket.emit('_saveColSerial_socket', {
        data
    },function (confirmation) {
        callback(confirmation);
    });
};
