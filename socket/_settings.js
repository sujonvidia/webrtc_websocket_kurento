var _ = require('lodash');

module.exports = function (io) {
  var app = require('express');
  var router = app.Router();
  
  var { settings } = require('./../utils/settings');
  var { signup_utils } = require('./../utils/signup_utils');

  io.on('connection', function (socket) {
    
    socket.on('create_team', function (data, callback) {
        settings.save_team(data, (rep)=>{
            callback(rep);
        });
    });
    
    socket.on('get_team_info', function (data, callback) {
        settings.get_team_info(data, (rep)=>{
            callback(rep);
        });
    });
    
    socket.on('add_team_member', function (data, callback) {
        settings.add_team_member(data, (rep)=>{
            callback(rep);
        });
    });
    socket.on('add_team_members', function (data, callback) {
        settings.add_team_members(data, (rep)=>{
            callback(rep);
        });
    });

    
    socket.on('create_role', function (data, callback) {
        settings.save_role(data, (rep)=>{
            callback(rep);
        });
    });
    
    socket.on('update_role_access', function (data, callback) {
        settings.update_role_access(data, (rep)=>{
            callback(rep);
        });
    });
    
    socket.on('delete_role', function (data, callback) {
        settings.delete_role(data, (rep)=>{
            callback(rep);
        });
    });

    socket.on('allConvListForTips', function (data, callback) {
        settings.allConvListForTips(data, (response) => {
            callback(response);
        });
    });

    socket.on('create_tips', function (data, callback) {
        settings.create_tips(data, (response) => {
            callback(response);
        });
    });
    
    socket.on('update_tips', function (data, callback) {
        settings.update_tips(data, (response) => {
            callback(response);
        });
    });

    socket.on('delete_tips', function (data, callback) {
        settings.delete_tips(data, (response) => {
            callback(response);
        });
    });

    socket.on('getAllTipsForShow', function (data, callback) {
        settings.getAllTipsForShow(data, (response) => {
            callback(response);
        });
    });

    socket.on('getATipsById', function (data, callback) {
        settings.getATipsById(data, (response) => {
            callback(response);
        });
    }); 
    
    socket.on('find_company_by_email', async function (data, callback) {
        var companies = await signup_utils.get_company_by_user_email(data.email);
        callback(companies);
    }); 
    
    socket.on('check_and_add', async function (data, callback) {
        console.log(96, data);
        try{
            var result = await signup_utils.check_and_add(data);
            callback(result);
        }catch(err){
            callback({status: false, error: err});
        }
    }); 
    
    socket.on('get_social_account', function (data, callback) {
        signup_utils.get_social_account(data, (result)=>{
            callback(result);
        });
    }); 
    socket.on('get_link_accounts', function (data, callback) {
        signup_utils.get_link_accounts(data, (result)=>{
            callback(result);
        });
    }); 
    socket.on('get_img_by_email_company', function (data, callback) {
        signup_utils.get_img_by_email_company(data, (result)=>{
            callback(result);
        });
    }); 
    
    socket.on('notification_sound_save', function (data, callback) {
        settings.notification_sound_save(data, (result)=>{
            callback(result);
        });
    }); 

    socket.on('getAllNotificationSound', function (data, callback) {
        settings.getAllNotificationSound(data, (result)=>{
            callback(result);
        });
    }); 

    socket.on('delete_noti_file', function(data,callback){
        settings.delete_noti_file(data, (result)=>{
            callback(result);
        });
    });
    
    socket.on('get_company_info_by_id', function (data, callback) {
        settings.get_company_info_by_id(data, (rep)=>{
            callback(rep);
        });
    });
    socket.on('get_users_by_company_id', function (data, callback) {
        settings.get_users_by_company_id(data, (rep)=>{
            callback(rep);
        });
    });
    
    socket.on('update_company_name', function(data, callback){
        settings.update_company_name(data, (rep)=>{
            callback(rep);
        });
    });
    socket.on('create_or_delete_company', function (data, callback) {
        settings.create_or_delete_company(data, (response) => {
            callback(response);
        });
    });
    socket.on('get_role_by_company', function (data, callback) {
        settings.get_role_by_company(data, (response) => {
            callback(response);
        });
    });
    socket.on('is_exist_user_under_company', function (data, callback) {
        settings.is_exist_user_under_company(data, (response) => {
            callback(response);
        });
    });
    socket.on('add_company_members', function (data, callback) {
        settings.add_company_members(data, (rep)=>{
            callback(rep);
        });
    });


    
  });
  return router;
}
