
const Validator = require('validator');
//Import Model
var {models} = require('./../config/db/express-cassandra');

module.exports = function hasPowerOnParticipantsDlt(data) {

  if (Validator.isEmpty(data.activityid) && Validator.isEmpty(data.userid)) {
    return false;
  }else{
    models.instance.Activity.findOne({activity_id:models.timeuuidFromString(data.targetId)},{ raw: true, allow_filtering: true }, function(err, activityDetail){
        if(err){
        callback({status: false, err: err});
        }else{
        callback({status: true, activityDetail: activityDetail});
        }
    });
  }

};