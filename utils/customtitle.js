var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
const got = require('got');
var router = app.Router();

var {models} = require('./../config/db/express-cassandra');




var customTitle = (data,callback)=>{
	if(data.type == 'link' || data.type == 'file' || data.type == 'conv_title' ){
		var newData = {
			change_id:data.change_id,
			user_id:models.uuidFromString(data.user_id),
			type:data.type,
			change_title:data.change_title,
			original_name:data.original_name
		}
		 new models.instance.CustomTitle(newData).saveAsync().then((res)=>{
		 	callback({status:true,result:res});
		 }).catch((err)=>{
		 	callback({status:false,err:err});
		 })
	}else if(data.type == 'get'){
		models.instance.CustomTitle.find({user_id:models.uuidFromString(data.user_id)}, {raw: true, allow_filtering: true}, function(err, result){
			if(err){
				console.log(30,err);
			}else{
				callback({status:true,result:result});
			}
		});
	}

}

var setAsNotification = (data,callback)=>{
	var newData = {
		user_id:models.uuidFromString(data.user_id),
		conversation_id:models.uuidFromString(data.conversation_id),
		type:data.type,
		tune_title:data.tune_title
	}
	var query_object = {conversation_id:models.uuidFromString(data.conversation_id),user_id:models.uuidFromString(data.user_id)};
	var update_values = {tune_title:data.tune_title,status:data.status};

	models.instance.SetTune.find(query_object, {raw: true, allow_filtering: true}, function(err, result){
		if(err){
			console.log(30,err);
		}else{
			if (result.length == 1) {
				models.instance.SetTune.update({id:result[0].id}, update_values, update_if_exists, function(err){
				    if(err){
						console.log(57,err);
					}else{
						callback({status:true,result:result});
					}
				});
			}else if (result.length == 0){
				new models.instance.SetTune(newData).saveAsync().then((res)=>{
				 	callback({status:true,result:res});
				}).catch((err)=>{
				 	callback({status:false,err:err});
				})
			}
		}
	});

}
var getNotificationSound = (data,callback)=>{
	models.instance.SetTune.find({user_id:models.uuidFromString(data.user_id)}, {raw: true, allow_filtering: true}, function(err, result){
		if(err){
			console.log(30,err);
		}else{
			callback({status:true,result:result});
		}
	});

}













module.exports = {customTitle, setAsNotification,getNotificationSound};