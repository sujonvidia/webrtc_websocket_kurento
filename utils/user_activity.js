var app = require('express');
var _ = require('lodash');
var moment = require('moment');
var {models} = require('./../config/db/express-cassandra');
const isUuid = require('uuid-validate');


var add_activity = (data)=>{
    var queries = [];
    _.each(data.receive_users, function(v, k){
        if(v != data.created_by){
            var insert_data = {
                activity_id     : models.timeuuid(),
                type            : data.type,
                title           : data.title,
                body            : JSON.stringify(data.body),
                created_by_id   : data.created_by,
                created_by_name : data.created_by_name,
                created_by_img  : data.created_by_img,
                receiver_id     : v,
                company_id      : data.company_id,
            }
            var new_data = new models.instance.UserActivity(insert_data);
            queries.push(new_data.save({ return_query: true }));
        }
    });
    
    if (queries.length > 0) {
        models.doBatch(queries, function(err) {
            if (err) {
                console.log("add_activity error", err );
            } else {
                console.log("add_activity success");
            }
        });
    }
}

module.exports = {add_activity};
