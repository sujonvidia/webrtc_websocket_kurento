var app = require('express');
// var cassandra = require('cassandra-driver');
var router = app.Router();

var { models } = require('./../config/db/express-cassandra');

var getActiveUsers = (uid, callback) => {
    models.instance.Users.find({ company_id: models.timeuuidFromString(userCompany_id[uid]) }, { raw: true, allow_filtering: true }, function(err, users) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, users: users });
        }
    });
};
var getAllUsers = (uid, callback) => {
    models.instance.Users.find({ is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, users) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, users: users });
        }
    });
};
// var getActiveUsers = (callback) =>{
//   // { select: ['id','createdat', 'email', 'fullname', 'dept', 'designation', 'gcm_id', 'img', 'is_active', 'is_delete', 'is_busy'] },
//   console.log(userCompany_id[req.session.user_id]);
//   models.instance.Users.find({is_delete: 0}, {raw:true, allow_filtering: true}, function(err, users){
//     if(err){
//       callback({status: false, err: err});
//     }else{
//       callback({status: true, users: users});
//     }
//   });
// };


module.exports = { getActiveUsers, };