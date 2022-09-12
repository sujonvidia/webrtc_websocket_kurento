var app = require('express');
var router = app.Router();
var moment = require('moment');
var _ = require('lodash');

var {models} = require('./../config/db/express-cassandra');

var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

var getAllUserTag = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.UserTag.find({company_id:models.timeuuidFromString(data.company_id)},function(err,result){
            if(err){
                reject({status:false,data:err});
            }else{
                resolve({status:true,data:result});
            }
        })
    });
}

var createNewUserTag = (data)=>{
    return new Promise((resolve,reject)=>{
        var newdata = {
            tag_id:models.timeuuid(),
            tagged_by:models.uuidFromString(data.tagged_by),
            title:data.title,
            company_id:models.timeuuidFromString(userCompany_id[data.tagged_by]),
            type:'tag',
            tag_type:data.tag_type,
            mention_users:data.mention_users,
            created_at:moment().format('MM/DD/YYYY hh:mm:ss').toString(),
            tag_color:data.tag_color,
            shared_tag:data.shared_tag,
            team_list: data.team_list
        }
        console.log(36,newdata)

        new models.instance.UserTag(newdata).saveAsync().then((res)=>{
            console.log(39,res)
            resolve({status:true,data:newdata})
        }).catch((err)=>{
            console.log(42,err)
            reject({status:false,err:err})
        })

    });
}


var deleteOneTag = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.UserTag.delete({tag_id:models.timeuuidFromString(data.tag_id),tagged_by:models.uuidFromString(data.tagged_by)},function(err){
            if(err){
                reject({status:false,err:err})
            }else{
                resolve({status:true,msg:'success'});
            }
        })
    })
}
var updateUserTagTitle = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.UserTag.update({tag_id:models.timeuuidFromString(data.tag_id),tagged_by:models.uuidFromString(data.tagged_by)},{title:data.title,update_at:moment().format('MM/DD/YYYY hh:mm:ss').toString(),update_by:models.uuidFromString(data.update_by)}, update_if_exists,function(err){
            if(err){
                reject({status:false,err:err});
            }else{
                resolve({status:true,msg:'success'});
            }
        })
    })
}
var updatedColorTag = (data,callback)=>{
    console.log(1222,data);
    models.instance.UserTag.update({tag_id:models.timeuuidFromString(data.tag_id),tagged_by:models.uuidFromString(data.tagged_by)},{tag_color:data.tag_color}, update_if_exists,function(err,result){
        console.log(76,err,result)
        if(err){
            callback({status:false,err:err});
        }else{
            callback({status:true,msg:'success'});
        }
    });
}

var sharedTag = (data,callback)=>{
    console.log(1222,data);
    models.instance.UserTag.update({tag_id:models.timeuuidFromString(data.tag_id),tagged_by:models.uuidFromString(data.tagged_by)},{shared_tag:data.shared_tag}, update_if_exists,function(err,result){
        console.log(76,err,result)
        if(err){
            callback({status:false,err:err});
        }else{
            callback({status:true,msg:'success'});
        }
    });
}
var sharedTagArray = (data,callback)=>{
    console.log(1222,data);
    var newIds = [];
    _.each(data.tag_id,function(v,k){
        newIds.push(models.timeuuidFromString(v));
    })
    models.instance.UserTag.update({tag_id:{'$in':Array.from(newIds)},tagged_by:models.uuidFromString(data.tagged_by)},{shared_tag:data.shared_tag},function(err,result){
        console.log(76,err,result)
        if(err){
            callback({status:false,err:err});
        }else{
            callback({status:true,msg:'success'});
        }
    });
}

var getCompanyTag = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.UserTag.find({company_id:models.timeuuidFromString(data.company_id)},function(err,result){
            if(err){
                reject({status:false,err:err});
            }else{
                // tagged_by:models.uuidFromString(data.user_id),
                var cbtags = [];
                _.each(result,function(v,k){
                    if(v.tag_type == 'public' || v.tagged_by.toString() == data.user_id.toString() || v.shared_tag != null){
                        cbtags.push(v);
                    }
                });
                resolve({status:true,data:cbtags});
            }
        })
    })
}

var delteMyTagV2 = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.UserTag.delete({tagged_by:models.uuidFromString(data.user_id),tag_id:models.timeuuidFromString(data.tag_id)},function(err,result){
            if(err){
                reject({status:false,err:err});
            }else{
                console.log(result);
                resolve({status:true,data:result});
            }
        })
    })
}

var tagOneMsg = (data)=>{
    console.log(87,data);
    return new Promise((resolve,reject)=>{
        models.instance.Messages.update({conversation_id:models.uuidFromString(data.conversation_id),msg_id:models.timeuuidFromString(data.msg_id)},{tag_list:{$add:[data.tag_id]}}, update_if_exists,function(err){
            if(err){
                console.log(90,err)
                reject({status:false,err:err});
            }else{
                console.log('add msg tag success');
                var newActionData = {
                    action_id:models.timeuuid(),
                    tag_id:models.timeuuidFromString(data.tag_id),
                    created_by:models.uuidFromString(data.user_id),
                    action_type:'addmsg',
                    msg_id:models.timeuuidFromString(data.msg_id)

                }
                console.log(102,newActionData);
                new models.instance.TagActionLogs(newActionData).saveAsync().then((res)=>{
                    console.log('tag logs success '+res);
                }).catch((err)=>{
                    console.log('tag log err '+err);
                })
                resolve({status:true,msg:'success'});
            }
        })
    })
}

var getConvTagId = (data)=>{
    return new Promise((resolve,reject)=>{

        models.instance.Conversation.find({conversation_id:models.uuidFromString(data.conversation_id)},function(err,result){
            if(err){
                reject({status:true,err:err});
            }else{
                resolve({status:true,data:result});
            }
        })
    })
}

var tagOnCov = (data)=>{
    console.log('129 tagOnCov', data);
    return new Promise((resolve,reject)=>{

        models.instance.Conversation.update({conversation_id:models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)},{tag_list:{$add:[data.tag_id]}}, update_if_exists,function(err,result){
            if(err){
                reject({status:true,err:err});
            }else{
                console.log(136, result);
                resolve({status:true,msg:'success'});
            }
        })
    })
}
var updateConvTagV2 = (data)=>{
    console.log('129 tagOnCov', data);
    return new Promise((resolve,reject)=>{
      if(data.newtag.length > 0){
        models.instance.Conversation.update({conversation_id:models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)},{tag_list:{$add:data.newtag}}, update_if_exists,function(err,result){
          if(err){
            console.log(err);
          }else{
            console.log(result);
          }
        });
      }
      if(data.removetag.length > 0){
        models.instance.Conversation.update({conversation_id:models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)},{tag_list:{$remove:data.removetag}}, update_if_exists,function(err,result){
          if(err){
            console.log(err);
          }else{
            console.log(result);
          }
        });
      }
      resolve({status:true});
    })
}

var removeConvTag = (data)=>{
    return new Promise((resolve,reject)=>{

        models.instance.Conversation.update({conversation_id:models.uuidFromString(data.conversation_id),company_id:models.timeuuidFromString(data.company_id)},{tag_list:{$remove:[data.tag_id]}}, update_if_exists,function(err,result){
            if(err){
                reject({status:true,err:err});
            }else{
                resolve({status:true,msg:'success'});
            }
        })
    })
}
var getCompanyTeam = (data)=>{
    return new Promise((resolve,reject)=>{

        models.instance.Team.find({company_id:models.timeuuidFromString(data.company_id)},{ raw: true, allow_filtering: true },function(err,result){
            if(err){
                reject({status:true,err:err});
            }else{
                resolve({status:true,result:result});
            }
        })
    })
}
var removeOnMsgTag = (data)=>{
    return new Promise((resolve,reject)=>{
        models.instance.Messages.update({msg_id:models.timeuuidFromString(data.msg_id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$remove:[data.tag_id]}}, update_if_exists,function(err,result){
            if(err){
                reject({status:true,err:err});
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

                resolve({status:true,msg:'success'});
            }
        })
    })
}

module.exports = {getAllUserTag,
    createNewUserTag,
    deleteOneTag,
    updateUserTagTitle,
    getCompanyTag,
    tagOneMsg,
    getConvTagId,
    tagOnCov,
    removeConvTag,
    removeOnMsgTag,
    updateConvTagV2,
    delteMyTagV2,
    updatedColorTag,
    sharedTag,
    sharedTagArray,
    getCompanyTeam

};
