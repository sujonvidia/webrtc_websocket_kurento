var app = require('express');
// var cassandra = require('cassandra-driver');
var router = app.Router();

var {models} = require('./../config/db/express-cassandra');


var get_all_users_of_all_company = (callback) => {
  models.instance.Users.find({}, {raw: true, allow_filtering: true}, function(err, all_company_user) {
    if(err){
      callback({status: false, err: err});
    }else{
      callback({status: true, all_company_user: all_company_user});
    }
  });
};

module.exports = {get_all_users_of_all_company};
