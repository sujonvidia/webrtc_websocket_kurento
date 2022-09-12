var app = require('express');
var _ = require('lodash');

var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {email} = require('../utils/email');
var {sg_email} = require('../utils/sg_email');

var signup_utils = [];

signup_utils['check_email'] = (str) =>{
  return new Promise((resolve,reject)=>{
      models.instance.Users.find({email: str},  {raw:true, allow_filtering: true}, function (err, user) {
          if (err){
              reject({status: false, error: err});
          }else{
              resolve(user);
          }
      });
  });
}

signup_utils['check_email_company'] = (str,company_id) =>{
  return new Promise((resolve,reject)=>{
      models.instance.Users.find({email: str,company_id:company_id},  {raw:true, allow_filtering: true}, function (err, user) {
          if (err){
              reject({status: false, error: err});
          }else{
              resolve(user);
          }
      });
  });
}

signup_utils['check_company'] = (str) =>{
  return new Promise((resolve,reject)=>{
      models.instance.Company.find({company_name: str},  {raw:true, allow_filtering: true}, function (err, company) {
          if (err){
              reject({status: false, error: err});
          }else{
              resolve(company);
          }
      });
  });
}

signup_utils['check_company_id'] = (str) =>{
  return new Promise((resolve,reject)=>{
      models.instance.Company.findOne({company_id: models.timeuuidFromString(str)},  {raw:true, allow_filtering: true}, function (err, company) {
          if (err){
              reject({status: false, error: err});
          }else{
              resolve(company);
          }
      });
  });
}

signup_utils['change_all_pass'] = (email, pass, callback) =>{
    models.instance.Users.find({email: email},  {raw:true, allow_filtering: true}, function (err, allu) {
        if (err){
            callback({status: false, error: err});
        }else{
            var errs = [];
            _.forEach(allu, function(v, k){
                models.instance.Users.update(
                    { id: v.id }, 
                    { password: pass },
                    update_if_exists, function(err){
                        if(err) errs.push(err);
                        if(allu.length == k+1){
                            callback({errs, status: errs.length ? false : true});
                        }
                });
            });
        }
    });
}

signup_utils['get_link_accounts'] = (data, callback) =>{
    console.log(34, data);
    models.instance.LinkAccount.find({email: data.user_email, company_id: data.company_id},  {raw:true, allow_filtering: true}, function (err, linkacc) {
        if (err){
            callback({status: false, error: err});
        }else{
            models.instance.Company.find({}, function(cerr, company){
                if(cerr) callback({status: false, error: cerr});
                callback({linkacc, company});
            });
        }
    });
}

signup_utils['get_social_account'] = (data, callback) =>{
    console.log(48, data);
    models.instance.Users.find({email: data.user_email},  {raw:true, allow_filtering: true}, function (err, linkacc) {
        if (err){
            callback({status: false, error: err});
        }else{
            models.instance.Company.find({}, function(cerr, company){
                if(cerr) callback({status: false, error: cerr});
                callback({linkacc, company});
            });
        }
    });
}

signup_utils['get_img_by_email_company'] = (data, callback) =>{
    models.instance.Users.find({email: data.user_email, company_id: models.timeuuidFromString(data.company_id)}, {raw:true, allow_filtering: true}, function (err, udata) {
        if (err) callback({status: false, error: err});
        callback(udata);
    });
}

signup_utils['get_company_by_user_email'] = (str) =>{
    return new Promise((resolve,reject)=>{
        models.instance.Users.find({email: str},  {raw:true, allow_filtering: true}, function (err, users) {
            if (err){
                reject({status: false, error: err});
            }else{
                if(users.length){
                    var comids = [];
                    _.forEach(users, function(v, k){
                        comids.push(v.company_id);
                    });
                    models.instance.Company.find({company_id: {'$in': comids}}, function (cerr, companies){
                        if(cerr) reject({status: false, error: cerr});
                        // console.log(45, companies);
                        resolve(companies);
                    });
                }else{
                    reject({status: false, error: 'no company found by this email'})
                }
            }
        });
    });
}

signup_utils['check_and_add'] = (data)=>{
    return new Promise((resolve, reject)=>{
        models.instance.Users.find({email: data.email, company_id: models.timeuuidFromString(data.comid)}, {raw:true, allow_filtering:true}, function(err, user){
            console.log(60, data);
            if(err) reject({status: false, error: err});
            
            if(passwordToCompare(data.passw, user[0].password)){
                models.instance.LinkAccount.find({email: data.cur_user_email, company_id: data.cur_company_id}, { raw: true, allow_filtering: true }, function(lerr, linkd) {
                    if(lerr) reject({status: false, error: lerr});
                    
                    if(linkd.length == 1){
                        models.instance.LinkAccount.update(
                            {id: linkd[0].id},
                            {email_company: {'$add': [data.email+"="+data.comid]}},
                            update_if_exists, function(err){
                                if(err) callback({status: false, err: err});
                                
                                
                                models.instance.LinkAccount.find({email: data.email, company_id: data.comid}, { raw: true, allow_filtering: true }, function(lerr, linkd) {
                                    if(lerr) reject({status: false, error: lerr});
                                    
                                    if(linkd.length == 1){
                                        models.instance.LinkAccount.update(
                                            {id: linkd[0].id},
                                            {email_company: {'$add': [data.cur_user_email+"="+data.cur_company_id]}},
                                            update_if_exists, function(err){
                                                if(err) reject({status: false, err: err});
                                                resolve({status: true});
                                        });
                                    }else{
                                        var linkdata2 = new models.instance.LinkAccount({
                                            id: models.timeuuid(),
                                            email: data.email,
                                            company_id: data.comid,
                                            email_company: [data.email+"="+data.comid, data.cur_user_email+"="+data.cur_company_id]
                                        });
                                        linkdata2.save((err)=>{ 
                                            if(err)
                                                reject({status: false, error: err}); 
                                            else
                                                resolve({status: true});
                                        });
                                    }
                                });
                        });
                    }else{
                        var linkdata1 = new models.instance.LinkAccount({
                            id: models.timeuuid(),
                            email: data.cur_user_email,
                            company_id: data.cur_company_id,
                            email_company: [data.email+"="+data.comid, data.cur_user_email+"="+data.cur_company_id]
                        });
                        linkdata1.save((err)=>{ 
                            if(err)
                                reject({status: false, error: err}); 
                            
                                models.instance.LinkAccount.find({email: data.email, company_id: data.comid}, { raw: true, allow_filtering: true }, function(lerr, linkd) {
                                    if(lerr) reject({status: false, error: lerr});
                                    
                                    if(linkd.length == 1){
                                        models.instance.LinkAccount.update(
                                            {id: linkd[0].id},
                                            {email_company: {'$add': [data.cur_user_email+"="+data.cur_company_id]}},
                                            update_if_exists, function(err){
                                                if(err) reject({status: false, err: err});
                                                resolve({status: true});
                                        });
                                    }else{
                                        var linkdata2 = new models.instance.LinkAccount({
                                            id: models.timeuuid(),
                                            email: data.email,
                                            company_id: data.comid,
                                            email_company: [data.email+"="+data.comid, data.cur_user_email+"="+data.cur_company_id]
                                        });
                                        linkdata2.save((err)=>{ 
                                            if(err)
                                                reject({status: false, error: err}); 
                                            else
                                                resolve({status: true});
                                        });
                                    }
                                });
                        });
                    }
                });
                
                
            }
        });
    })
};

signup_utils['add_guest_user'] = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            models.instance.Users.find({email: data.email, company_id: models.timeuuidFromString(data.comid)}, {raw:true, allow_filtering:true}, function(err, users){
                console.log(222, data);
                if(err) reject({status: false, error: err});
                if(users.length == 0){
                    // sg_email.check_valid_email({email: data.email}, (reply)=>{
                    //     if(reply.status){
                            var uid = models.uuid();
                            var user = new models.instance.Users({
                                id: uid,
                                email: data.email,
                                fullname: data.name,
                                password: passwordToHass('123456'),
                                dept: 'Business',
                                img: 'img.png',
                                company_id: models.timeuuidFromString(data.comid),
                                access: [1000, 1001, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1140, 1143, 1146, 1147, 1600],
                                role: 'Guest',
                                created_by:data.created_by.toString(),
                                conference_id : models.timeuuid().toString() + '_personal'
                            });
                            
                            user.saveAsync().then(function() {
                                resolve({status: true, user});
                            }).catch(function(err) {
                                console.log(err);
                                reject({status: false, error: err});
                            });
                    //     }else{
                    //         resolve({status: false, error: 'Invalid email'});
                    //     }
                    // })
                    
                }else{
                    resolve({status: false, user: users[0]});
                }
            });
        } catch (e) {
            reject({status: false, error: e});
        }
    })
};

signup_utils['update_invite_link'] = (data)=>{
    console.log(264, data);
    try{
        var query = {conversation_id: models.uuidFromString(data.conversation_id), invite_to: models.uuidFromString(data.id)};
        models.instance.Invite.find(query, function(err, link){
            if(err) throw err;
            if(link.length == 0){
                var linkdata = new models.instance.Invite({
                    conversation_id: models.uuidFromString(data.conversation_id),
                    invite_to: models.uuidFromString(data.id),
                    email_to: data.email
                });
                linkdata.saveAsync().then(function(res){
                    console.log("update invite link save done");
                }).catch(function(e) {
                    throw e;
                });
            }else if(link.length == 1){
                // if(link[0].status == "Viewed" && data.status == "Viewed"){
                //     console.log("No update required");
                // }
                // else{
                    data.status = data.status === undefined ? "Invited" : data.status;
                    models.instance.Invite.update(query, {status: data.status, invite_time: new Date()}, update_if_exists, function(error){
                        if(error) throw error;
                        console.log("update invite link update done");
                    });
                // }
            }else{
                console.log("Something error in update invite link");
            }
        });
    } catch(e){
        console.log(271, e);
    }
};
signup_utils['get_guest_invite_status'] = (data, callback)=>{
    console.log(295, data);
    try{
        var query = {conversation_id: models.uuidFromString(data.conversation_id)};
        models.instance.Invite.find(query, function(err, link){
            if(err) throw err;
            callback({status: true, link});
        });
    } catch(e){
        console.log(303, e);
        callback({status: false, error: e});
    }
};
signup_utils['remove_invite_link'] = (data)=>{
    console.log(308, data);
    try{
        var query = {conversation_id: models.uuidFromString(data.conversation_id), invite_to: models.uuidFromString(data.invite_to)};
        models.instance.Invite.delete(query, function(err){
            if(err) throw err;
            console.log("remove_invite_link done");
        });
    } catch(e){
        console.log(316, e);
        callback({status: false, error: e});
    }
}

signup_utils['send_invitation_to_join_room'] = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            models.instance.Users.findOne({id: models.uuidFromString(data.id)}, function(err, user){
                console.log(274, data);
                if(err) throw err;
                var baseurl = process.env.BASE_URL;
                models.instance.EmailFormat.find({company_id: user.company_id}, {raw:true, allow_filtering:true}, function(err, formats){
                    if(err) throw err;
                   
                    if(user.login_total == 0 || user.login_total == null || user.login_total == ''){
                        var randompas = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
                        var hasspass = passwordToHass(randompas);
                        
                        var bodyhtml = '<p>Welcome to <b>WORKFREELI</b> - a teamwork app to work together!<br><br>'+ data.sender_name +' has invited you to join "<b>'+ data.room_name +'</b>" room on WORKFREELI. Once you join, you will be able to chat with room members, view their messages and files and share your files and tasks with them.<br><br>Your User ID is: <b>'+ user.email +'</b><br>Temporary OTP: <b>' + randompas + '</b><br><br><a style="text-align:center;" href="'+ baseurl +'signup/verify/'+user.id+'/'+data.conversation_id+'">Login</a>';
                        
                        models.instance.Users.update({id: user.id}, {password: hasspass}, update_if_exists, function(err){
                            if(err) throw err;
                        });

                        if(formats.length>0){
                            _.forEach(formats, function(v, k){
                                if(v.email_type == 'otp'){
                                    var temp = v.format_text.split("{{CASE}}");
                                    var rcn = '';
                                    if(data.root_room_name === undefined || data.root_room_name == '' || data.root_room_name == null) {
                                        temp[2] = '';
                                    }
                                    else if(data.root_room_name !== undefined && data.root_room_name != '' && data.root_room_name != null){
                                        temp[1] = '';
                                        rcn = data.root_room_name;
                                    }
                                    v.format_text = temp.join("");
                                    bodyhtml = v.format_text.replace('[[un]]', data.sender_name);
                                    bodyhtml = bodyhtml.replace('[[cn]]', data.room_name);
                                    bodyhtml = bodyhtml.replace('[[rcn]]', rcn);
                                    bodyhtml = bodyhtml.replace('[[ge]]', user.email);
                                    bodyhtml = bodyhtml.replace('[[otp]]', randompas);
                                    bodyhtml = bodyhtml.replace('[[sl]]', '<a style="position: absolute;text-decoration: none;width: 322px;border-radius: 4px;border: none;color: #ffffff;font-size: 18px;font-weight: 600;line-height: 21px;text-align: center;background-color: #023d67;padding: 10px 25px;" href="'+ baseurl +'signup/verify/'+user.id+'/'+data.conversation_id+'">Login</a><br>');
                                }
                            });
                        }
                    }else{
                        var bodyhtml = '<p>Hi '+ user.fullname +',<br><br>'+ data.sender_name +' has invited you to join "<b>'+ data.room_name +'</b>" room on WORKFREELI. Since you are already a guest member in their system, please use your following email ID and PIN/password that you set last time to login to work together.<br><br>Your User ID is: <b>'+ user.email +'</b><br><a href="'+ baseurl +'loginwith/'+user.id+'/'+data.conversation_id+'">Login</a>';
                        
                        if(formats.length>0){
                            _.forEach(formats, function(v, k){
                                if(v.email_type == 'invite'){
                                    var temp = v.format_text.split("{{CASE}}");
                                    var rcn = '';
                                    if(data.root_room_name === undefined || data.root_room_name == '' || data.root_room_name == null) {
                                        temp[2] = '';
                                    }
                                    else if(data.root_room_name !== undefined && data.root_room_name != '' && data.root_room_name != null){
                                        temp[1] = '';
                                        rcn = data.root_room_name;
                                    }
                                    v.format_text = temp.join("");
                                    bodyhtml = v.format_text.replace('[[gn]]', user.fullname);
                                    bodyhtml = bodyhtml.replace('[[un]]', data.sender_name);
                                    bodyhtml = bodyhtml.replace('[[cn]]', data.room_name);
                                    bodyhtml = bodyhtml.replace('[[rcn]]', rcn);
                                    bodyhtml = bodyhtml.replace('[[ge]]', user.email);
                                    bodyhtml = bodyhtml.replace('[[sl]]', '<a style="position: absolute;text-decoration: none;width: 322px;border-radius: 4px;border: none;color: #ffffff;font-size: 18px;font-weight: 600;line-height: 21px;text-align: center;background-color: #023d67;padding: 10px 25px;" href="'+ baseurl +'loginwith/'+user.id+'/'+data.conversation_id+'">Login</a><br>');
                                }
                            });
                        }
                    }
                    
                    var emaildata = {
                        to: user.email,
                        bcc: 'mahfuzak08@gmail.com',
                        subject: 'Workfreeli invitation',
                        text: 'You are invited to join "'+ data.room_name +'" room.',
                        html: bodyhtml
                    }
                    
                    sg_email.send(emaildata, (result)=>{
                        if(result.msg == 'success'){
                            data.email = user.email;
                            signup_utils.update_invite_link(data);
                            resolve({status: true});
                        }
                        else throw result;
                    });
                });
            });
        } catch (e) {
            reject({status: false, error: e});
        }
    })
};

signup_utils['send_email_remove_notification'] = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            models.instance.EmailFormat.find({company_id: models.timeuuidFromString(data.company_id)}, {raw:true, allow_filtering:true}, function(err, formats){
                var bodyhtml = '<p>Hi '+ data.guest_name +',<br><br>'+ data.remove_by +' has been removed you from "<b>'+ data.conversation_title +'</b>" room on WORKFREELI.';
                
                if(formats.length>0){
                    _.forEach(formats, function(v, k){
                        if(v.email_type == 'rmroom'){
                            var temp = v.format_text.split("{{CASE}}");
                            var rcn = '';
                            if(data.root_room_name === undefined || data.root_room_name == '' || data.root_room_name == null) {
                                temp[2] = '';
                            }
                            else if(data.root_room_name !== undefined && data.root_room_name != '' && data.root_room_name != null){
                                temp[1] = '';
                                rcn = data.root_room_name;
                            }
                            v.format_text = temp.join("");
                            bodyhtml = v.format_text.replace('[[gn]]', data.guest_name);
                            bodyhtml = bodyhtml.replace('[[un]]', data.remove_by);
                            bodyhtml = bodyhtml.replace('[[cn]]', data.conversation_title);
                            bodyhtml = bodyhtml.replace('[[rcn]]', rcn);
                            bodyhtml = bodyhtml.replace('[[ue]]', data.remove_by_email);
                        }
                    });
                }
                var emaildata = {
                    to: data.guest_email,
                    bcc: 'mahfuzak08@gmail.com',
                    subject: 'Room access remove notification',
                    text: 'You are removed from "'+ data.conversation_title +'" room.',
                    html: bodyhtml
                }
                sg_email.send(emaildata, (result)=>{
                    if(result.msg == 'success'){
                        data.email = data.guest_email;
                        resolve({status: true});
                    }
                    else throw result;
                });
            });
        } catch (e) {
            console.log(473, e);
            reject({status: false, error: e});
        }
    })
};

signup_utils['get_email_format'] = (data)=>{
    return new Promise((resolve, reject)=>{
        try{
            models.instance.EmailFormat.find({company_id: models.timeuuidFromString(data.company_id)}, {raw:true, allow_filtering:true}, function(err, formats){
                if(err) reject({status: false, error: err});
                if(formats.length > 0){
                    resolve({status: true, formats});
                }else{
                    resolve({status: false, formats: []});
                }
            });
        } catch (e) {
            reject({status: false, error: e});
        }
    })
};


module.exports = {signup_utils};
