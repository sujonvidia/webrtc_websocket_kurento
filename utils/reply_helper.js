var {models} = require('./../config/db/express-cassandra');

function getReplayConvData(conv_id, msg_ids){
  return new Promise((resolve,reject)=>{
	  console.log(322, msg_ids);
    models.instance.ReplayConv.find({conversation_id:conv_id, msg_id:{$in:msg_ids}},{raw:true},function(err,result){
      if(err){
        console.log(err);
        reject('errr');
      }else{
        resolve(result)
      }
    })
  })
}
function getUnreadReplayMsg(convids, userid){
  return new Promise((resolve,reject)=>{
    models.instance.Messages.find({conversation_id:{$in: convids}, msg_status:{$contains: userid}},{raw:true, allow_filtering: true},function(err,result){
    // models.instance.Messages.find({conversation_id:{$in: convids}},{raw:true, allow_filtering: true},function(err,result){
      if(err){
        console.log(err);
        reject('errr');
      }else{
        resolve(result)
      }
    })
  })
}

module.exports = {getReplayConvData, getUnreadReplayMsg};