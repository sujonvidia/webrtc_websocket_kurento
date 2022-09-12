var app = require('express');
var _ = require('lodash');

var { models } = require('./../config/db/express-cassandra');
var { passwordToHass, passwordToCompare } = require('./../utils/hassing');
// var {email} = require('./../utils/email');
var { sg_email } = require('./../utils/sg_email');

var settings = [];

function isRealString(str) {
    return typeof str === 'string' && str.trim().length > 0;
}

settings['change_password'] = (data, callback) => {
    try{
        models.instance.Users.findOne({ id: models.uuidFromString(data.user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
            if (err) throw err;
            //user is an array of plain objects with only name and age
            if (user) {
                if (passwordToCompare(data.old_password, user.password)) {
                    var userids = [];
                    userids.push(models.uuidFromString(data.user_id));
                    models.instance.Users.find({ email: user.email }, { raw: true, allow_filtering: true }, function(err2, users) {
                        if(err2) throw err2;
                        if(users.length > 1){
                            _.forEach(users, function(v, k){
                                userids.push(v.id);
                            });
                        }
                        models.instance.Users.update({ id: {$in: userids} }, { password: passwordToHass(data.new_password) }, function(error) {
                            if(error) throw error;
                            callback({ status: true, msg: "Password changed successfully" });
                        });
                    });
                } else {
                    callback({ status: false, msg: "Current password doesn't match" });
                }
            } else {
                callback({ status: false, msg: "User is invalid" });
            }
        });
    }catch(e){
        callback({status: false, msg: e});
    }
};

settings['change_reset_password'] = (data, callback) => {
    models.instance.Users.findOne({ id: models.uuidFromString(data.user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
        if (err) throw err;

        if (user) {
            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, { password: passwordToHass(data.new_password) }, update_if_exists, function(error) {
                callback({ status: true, msg: "Password changed successfully" });
            });
        } else {
            callback({ status: false, msg: "User is invalid" });
        }
    });
};

settings['reset_password'] = (data, callback) => {
    models.instance.Users.findOne({ id: models.uuidFromString(data.id) }, { raw: true, allow_filtering: true }, function(err, user) {
        if (err) callback({ status: false, msg: err });

        if (user) {
            models.instance.EmailFormat.find({ company_id: models.timeuuidFromString(user.company_id.toString()) }, { raw: true, allow_filtering: true }, function(err, formats) {
                if (err) callback({ status: false, msg: err });
                // console.log(57, formats);
                var randompas = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                var newpass = passwordToHass(randompas.toString());
                // console.log(43, randompas, process.env.FILE_SERVER, process.env.BASE_URL);
                var file_server = process.env.FILE_SERVER;
                var base_url = process.env.BASE_URL;
                models.instance.Users.update({ id: models.uuidFromString(data.id) }, { password: newpass }, update_if_exists, function(error) {

                    var baseurl = process.env.BASE_URL;
                    var tophtml = '<!DOCTYPE html><html><head></head><body style="background-color:#CCC"><br><br><br><div style="width: 600px;height: auto;background-color: #FFF;position: absolute;top:100;bottom: 0;left: 0;right: 0;margin: auto;border-radius:10px;padding:10px;">';

                    var bodyhtml = '<p>Welcome to <b>WORKFREELI</b><br><br>Your new password is: ' + randompas + '<br><br>Thank you,<br>WORKFREELI Team<br>workfreeli.com<br>support@workfreeli.com</p>';

                    var foothtml = '</div></body></html>';
                    console.log(71, formats.length);
                    if (formats.length > 0) {
                        _.forEach(formats, function(v, k) {
                            console.log(74, v.email_type);
                            if (v.email_type == 'reset') {
                                bodyhtml = v.format_text.replace('[[fn]]', user.fullname);
                                bodyhtml = bodyhtml.replace('[[np]]', randompas);
                            }
                        });
                    }

                    var emaildata = {
                        to: user.email,
                        bcc: 'mahfuzak08@gmail.com',
                        subject: 'Your password reseted by admin.',
                        text: 'Your new password is: ' + randompas,
                        html: tophtml + bodyhtml + foothtml
                    }

                    sg_email.send(emaildata, (result) => {
                        console.log(106, formats);
                        if (result.msg == 'success') {
                            callback({ status: true, msg: "Password reset successfully" });
                        } else callback({ status: false, msg: "Error ...." });
                    });
                });
            });

            // var emaildata = {
            //     to: [user.email],
            //     sub: 'Your password reseted by admin.',
            //     text: 'Your password reseted by admin. Your password is: '+randompas,
            //     msghtml: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"><head> <meta charset="UTF-8"> <meta content="width=device-width, initial-scale=1" name="viewport"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta content="telephone=no" name="format-detection"> <title>Workfreeli</title><!--[if gte mso 9]><style type="text/css">img.header { width: 600px; } /* or something like that */</style><![endif]--></head><body style="text-align: center;"><span style="display:none">Your password reseted by admin.</span><table style="border-collapse: collapse;margin: auto;width: 600px;border: 1px solid #203864;"> <tr> <td style="padding: 20px;"> <table style="width: 600px;"> <tr> <td style="width: 600px; text-align: center;"><img style="width: 75px; height: 60px;" src="'+ file_server +'common/freeli-logo.jpg" width="75" height="60"></td></tr></table> <table> <tr> <td> <p> Hi '+ user.fullname +',</p><p>We have just received a password reset request for your account.</p><p style="text-align: center;">Your new password is: <span style="font-size: 20px; font-weight: 700;">'+ randompas +'</span></p><p>Please change your password as soon as your login with this temporary one. Please note that your password must be six (6) characters or more.</p><p>Thank you for using Workfreeli.</p></td></tr></table> </td></tr><tr> <td style="text-align: center; font-size: 25px; color: #FFF; background:#203864;padding: 8px;"> <a href="'+ base_url +'" style="text-decoration: none;color: #FFF;">Login Now >></a> </td></tr></table></body></html>'
            // };
            // email.send(emaildata, (result)=>{
            //     if(result.msg == 'success'){
            //         callback({status: true, msg: "Password reset successfully"});
            //     }
            //     else
            //         callback({status: false, msg: "Error ...."});
            // });
        } else {
            callback({ status: false, msg: "User is invalid" });
        }
    });
};

settings['save_role'] = (data, callback) => {
    var role_id = models.timeuuid();
    if (isRealString(data.role_title)) {
        var access = USER_ACCESS;
        if (data.role_title == 'Guest') access.push(1600);
        var data = new models.instance.Role({
            role_id: role_id,
            created_by: models.uuidFromString(data.created_by),
            role_title: data.role_title,
            company_id: models.timeuuidFromString(userCompany_id[data.created_by]),
            role_access: access
        });

        data.saveAsync()
            .then(function(res) {
                callback({ status: true, msg: data });
            })
            .catch(function(err) {
                callback({ status: false, err: err });
            });
    }
};

settings['get_allrole'] = (uid, callback) => {
    models.instance.Role.find({ company_id: models.timeuuidFromString(userCompany_id[uid]) }, { raw: true, allow_filtering: true }, function(err, data) {
        if (err) callback({ status: false, err: err });
        callback({ status: true, roles: data });
    });
};

settings['update_role_access'] = (data, callback) => {
    var roleacc = (data.type == 'add') ? { '$add': [data.acc] } : { '$remove': [data.acc] };
    models.instance.Role.update({ role_id: models.timeuuidFromString(data.role_id) }, { role_access: roleacc }, update_if_exists,
        function(err) {
            if (err) callback({ status: false });
            callback({ status: true });
        }
    );
};
settings['delete_role'] = (data, callback) => {
    models.instance.Role.delete({ role_id: models.timeuuidFromString(data.role_id) },
        function(err) {
            if (err) callback({ status: false, error: err });
            callback({ status: true });
        }
    );
};
settings['save_team'] = (data, callback) => {
    var team_id = models.timeuuid();
    if (isRealString(data.team_title)) {
        var comid = models.timeuuidFromString(userCompany_id[data.created_by]);
        models.instance.Team.find({ team_title: data.team_title, company_id: comid }, { raw: true, allow_filtering: true }, function(error, teamdata) {
            if (error) callback({ status: false, err: error });
            console.log(teamdata);
            if (teamdata.length > 0) {
                callback({ status: false, err: "Sorry, this team name already used!!!" });
            } else {
                var datain = new models.instance.Team({
                    team_id: team_id,
                    created_by: models.uuidFromString(data.created_by),
                    updated_by: models.uuidFromString(data.updated_by),
                    company_id: comid,
                    participants: [data.created_by.toString()],
                    team_title: data.team_title
                });
                datain.saveAsync()
                    .then(function(res) {
                        callback({ status: true, msg: data });
                    })
                    .catch(function(err) {
                        callback({ status: false, err: err });
                    });
            }
        });
    }
};
settings['get_team_info'] = (data, callback) => {
    models.instance.Team.find({ team_id: models.timeuuidFromString(data.team_id) }, { raw: true, allow_filtering: true }, function(err, data) {
        if (err) callback({ status: false, err: err });
        callback({ status: true, team: data });
    });
};
settings['add_team_member'] = (data, callback) => {
    if (data.type == 'add') {
        var participants = { '$add': [data.uid] };
        models.instance.Team.update({ team_id: models.timeuuidFromString(data.teamid) }, { participants: participants, updated_by: models.uuidFromString(data.user_id) }, update_if_exists, function(err) {
            if (err) callback({ status: false, err: err });
            callback({ status: true, team: data });
        });
    } else {
        models.instance.Conversation.find({ group_keyspace: data.teamid.toString() }, { raw: true, allow_filtering: true }, function(error, convdata) {
            if (error) callback({ status: false, error: error });
            // console.log(167, convdata.length);
            // if (convdata.length == 0) {
                var participants = { '$remove': [data.uid] };
                var queries = [];
                for(let c of convdata){
                    if(c.participants.indexOf(data.uid) > -1){
                        var update_query = models.instance.Conversation.update(
                            {conversation_id: models.uuidFromString(c.conversation_id.toString()),company_id: models.timeuuidFromString(c.company_id.toString())},
                            {participants: participants},
                            {return_query: true}
                        );
                        queries.push(update_query);
                    }
                }
                var newUpq = models.instance.Team.update(
                    { team_id: models.timeuuidFromString(data.teamid) }, 
                    { participants: participants, updated_by: models.uuidFromString(data.user_id), updated_at: new Date() },
                    {return_query: true}
                );
                queries.push(newUpq);
                models.doBatch(queries, function(err){
                    if(err) throw err;
                    models.instance.Team.find({ team_id: models.timeuuidFromString(data.teamid) }, { raw: true, allow_filtering: true }, function(err, teamDataFromdb) {
                        if (err) callback({ status: false, err: err });
                        callback({ status: true, team: data, teamFromdb: teamDataFromdb });
                    });

                });
            // } else {
            //     callback({ status: false, error: "This team used in many conversation. So user won't be deleted." });
            // }
        });
    }
};
settings['add_team_members'] = (data, callback) => {
    models.instance.Team.find({ team_id: models.timeuuidFromString(data.teamid) }, { raw: true, allow_filtering: true }, function(error, tdata) {
        if (error) callback({ status: false, err: error });
        var participants = tdata[0].participants;
        _.forEach(data.uids, function(v, k) {
            participants.push(v);
        });

        models.instance.Team.update({ team_id: models.timeuuidFromString(data.teamid) }, { participants: participants, updated_by: models.uuidFromString(data.user_id), updated_at: new Date() }, update_if_exists, function(err) {
            if (err) callback({ status: false, err: err });
            callback({ status: true, team: data });
        });
    });
};
settings['get_allteam'] = (uid, all, callback) => {
    models.instance.Users.find({ id: models.uuidFromString(uid.toString()) }, { raw: true, allow_filtering: true }, function(error, udata) {
        if (error) callback({ status: false, err: error });
        if (udata[0].role == 'System Admin' && all === true) {
            models.instance.Team.find({ company_id: udata[0].company_id }, { raw: true, allow_filtering: true }, function(err, data) {
                if (err) callback({ status: false, err: err });
                callback({ status: true, teams: data });
            });
        } else {
            models.instance.Team.find({ participants: { $contains: uid.toString() } }, { raw: true, allow_filtering: true }, function(err, data) {
                if (err) callback({ status: false, err: err });
                callback({ status: true, teams: data });
            });
        }
    });
};
settings['update_team_name'] = (data, callback) => {
    models.instance.Team.update({ team_id: models.timeuuidFromString(data.team_id) }, { team_title: data.team_title, updated_by: models.timeuuidFromString(data.updated_by) }, update_if_exists, function(err) {
        if (err) callback({ status: false, err: err });
        callback({ status: true });
    });
};
settings['delete_team'] = (data, callback) => {
    models.instance.Conversation.find({ group_keyspace: data.teamid.toString() }, { raw: true, allow_filtering: true }, function(error, convdata) {
        if (error) callback({ status: false, error: error });
        if (convdata.length == 0) {
            models.instance.Team.delete({ team_id: models.timeuuidFromString(data.teamid) }, function(err) {
                if (err) callback({ status: false, err: err });
                callback({ status: true });
            });
        } else {
            callback({ status: false, error: "This team already used." });
        }
    });
};

settings['allConvListForTips'] = (data, callback) => {
    var query = {
        participants: { $contains: data.userid },
        single: { $eq: 'no' }
    };

    models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(err, rooms) {
        if (err) {
            var res_data = {
                staus: false,
                err: err
            };
            callback(res_data);
        } else {
            var res_data = {
                rooms: rooms,
                staus: true
            };
            callback(res_data);
        }
    });
};

settings['create_tips'] = (data, callback) => {
    var tips_id = models.timeuuid();
    if (isRealString(data.tips_title)) {
        // var comid = models.timeuuidFromString(userCompany_id[data.created_by]);
        models.instance.Tips.find({ tips_title: data.tips_title }, { raw: true, allow_filtering: true }, function(error, tipsdata) {
            if (error) callback({ status: false, err: error });
            console.log(tipsdata);
            if (tipsdata.length > 0) {
                callback({ status: false, err: "Sorry, this tips name already used!!!" });
            } else {
                var datain = new models.instance.Tips({
                    tips_id: tips_id,
                    created_by: models.uuidFromString(data.created_by),
                    updated_by: models.uuidFromString(data.updated_by),
                    tips_title: data.tips_title,
                    tips_details: data.tips_details,
                    tips_hotkeys: data.tips_hotkeys
                });
                console.log(272, datain);
                datain.saveAsync()
                    .then(function(res) {
                        callback({ status: true, msg: data });
                    })
                    .catch(function(err) {
                        callback({ status: false, err: err });
                    });
            }
        });
    }
};

settings['update_tips'] = (data, callback) => {
    var tips_id = models.timeuuidFromString(data.tips_id);
    var created_by = models.uuidFromString(data.created_by);
    if (isRealString(data.tips_title)) {
        // var comid = models.timeuuidFromString(userCompany_id[data.created_by]);

        // models.instance.Tips.find({tips_title: data.tips_title}, {raw:true, allow_filtering: true}, function(error, tipsdata){
        //     if(error) callback({status:false, err: error});
        //     console.log(tipsdata);
        //     if(tipsdata.length > 0){
        //         callback({status:false, err: "Sorry, this tips name already used!!!"});
        //     }else{
        var query_object = { tips_id: tips_id, created_by: created_by };
        var update_values_object = {
            tips_title: data.tips_title,
            tips_details: data.tips_details,
            tips_hotkeys: data.tips_hotkeys
        };
        console.log('315 update values object', update_values_object, query_object);
        models.instance.Tips.update(query_object, update_values_object, update_if_exists, function(err) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                callback({ status: true, msg: data });
            }
        });

        //     }
        // });
    }
};

settings['delete_tips'] = (data, callback) => {
    console.log(data);
    models.instance.Tips.delete({ tips_id: models.timeuuidFromString(data.tips_id), created_by: models.uuidFromString(data.user_id) },
        function(err) {
            if (err) {
                callback({ status: false, error: err });
            } else {
                callback({ status: true });
            }
        }
    );
};

settings['getAllTipsForShow'] = (data, callback) => {
    models.instance.Tips.find({ created_by: models.uuidFromString(data.user_id) }, { raw: true, allow_filtering: true }, function(err, tipsdata) {
        if (err) {
            var res_data = {
                status: false,
                err: err
            };
            callback(res_data);
        } else {
            var res_data = {
                tipsdata: tipsdata,
                status: true
            };
            callback(res_data);
        }
    });
};

settings['getATipsById'] = (data, callback) => {
    models.instance.Tips.find({ tips_id: models.timeuuidFromString(data.tips_id), created_by: models.uuidFromString(data.user_id) }, { allow_filtering: true }, function(err, onetipsdata) {
        if (err) {
            var res_data = {
                status: false,
                err: err
            };
            callback(res_data);
        } else {
            var res_data = {
                onetipsdata: onetipsdata,
                status: true
            };
            callback(res_data);
        }
    });
};

settings['notification_sound_save'] = (data, callback) => {
    // console.log(381, data);
    var noti = new models.instance.NotificationSound({
        id: models.timeuuid(),
        created_by: models.uuidFromString(data.user_id),
        company_id: models.timeuuidFromString(data.company_id),
        key: data.key,
        originalname: data.originalname,
        size: data.size,
        location: data.location
    });

    noti.saveAsync()
        .then(function(res) {
            models.instance.NotificationSound.find({}, function(err, notisound) {
                if (err) callback({ status: false, err: err });
                callback({ status: true, msg: data, sounds: notisound });
            });
        })
        .catch(function(err) {
            callback({ status: false, err: err });
        });
};

settings['getAllNotificationSound'] = (data, callback) => {

    models.instance.NotificationSound.find({}, function(err, notisound) {
        if (err) callback({ status: false, err: err });
        callback({ status: true, sounds: notisound });
    });

};

settings['delete_noti_file'] = (data, callback) => {
    var query = { id: models.timeuuidFromString(data.id) }
    models.instance.NotificationSound.delete(query, function(err) {
        if (err) callback({ status: false, err: err });
        callback({ status: true });
    });
}

settings['get_allcompany'] = (uid, callback) => {
    models.instance.Company.find({}, function(error, cdata) {
        if (error) callback({ status: false, err: error });
        callback({ status: true, companies: cdata });

        // models.instance.Users.find({company_id: cdata[0].company_id}, {raw:true, allow_filtering: true}, function(err, cUsers){
        //     if(err) callback({status: false, err: err});
        //     // callback({status: true, companies: cdata, companyUsers: cUsers});
        // });
    });
};


settings['get_company_info_by_id'] = (data, callback) => {
    models.instance.Company.find({ company_id: models.timeuuidFromString(data.company_id), company_name: data.company_name }, { raw: true, allow_filtering: true }, function(err, cdata) {
        if (err) callback({ status: false, err: err });
        callback({ status: true, company: cdata });
    });
};
settings['get_users_by_company_id'] = (data, callback) => {
    // console.log("get_company socket2");
    // console.log(data.company_id);
    models.instance.Users.find({ company_id: models.timeuuidFromString(data.company_id) }, { raw: true, allow_filtering: true }, function(error, data) {
        if (error) callback({ status: false, err: error });
        callback({ status: true, company_users: data });
    });
};
settings['update_company_name'] = (data, callback) => {
    // console.log("company_id", data.company_id, "\n");
    // console.log("prev_company_name", data.prev_company_name, "\n");
    // console.log("company_name", data.company_name, "\n");
    // console.log("updated_by", data.updated_by, "\n");
    models.instance.Company.find({ company_id: models.timeuuidFromString(data.company_id), company_name: data.prev_company_name }, { raw: true, allow_filtering: true }, function(err, companyFind) {
        if (err) callback({ status: false, err: err });
        var del_com = { company_id: models.timeuuidFromString(data.company_id), company_name: data.prev_company_name };
        // console.log("companyFind", companyFind);
        // console.log("companyFind.created_by", companyFind[0].created_by);
        models.instance.Company.delete(del_com, function(err) {
            if (err) callback({ status: false, err: err });
            // console.log("companyFind.created_by", companyFind[0].created_by);
            var saveCompanyAgain = new models.instance.Company({
                company_id: models.timeuuidFromString(data.company_id),
                company_name: data.company_name,
                created_by: companyFind[0].created_by,
                updated_by: data.updated_by,
                created_at: companyFind[0].created_at,
                updated_at: new Date()
                    // updated_by: models.uuidFromString(data.updated_by)
            });
            saveCompanyAgain.saveAsync()
                .then(function(res) {
                    // console.log("After Delete Company saved again For update= ", res);
                    models.instance.Company.find({ company_id: models.timeuuidFromString(data.company_id), company_name: data.company_name }, { raw: true, allow_filtering: true }, function(err, companyInfo) {
                        if (err) callback({ status: false, err: err });
                        // console.log("companyInfo", companyInfo);
                        callback({ status: true, company_info: companyInfo });
                    });
                })
                .catch(function(err) {
                    callback({ status: false, err: err });
                });
        });
    });
};
settings['create_or_delete_company'] = (data, callback) => {
    var companyId = models.timeuuid();
    if (data.type == 'create') {
        // console.log("create = ", data.type);
        models.instance.Company.find({ company_name: data.company_name }, { raw: true, allow_filtering: true }, function(err, comNameExist) {
            if (err) callback({ status: false, err: err });
            if (comNameExist.length == 0) {
                // console.log("comNameExist =", comNameExist);
                if (isRealString(data.company_name)) {
                    var saveCompanyData = new models.instance.Company({
                        company_id: companyId,
                        company_name: data.company_name,
                        created_by: models.uuidFromString(data.created_by),
                        updated_by: data.updated_by
                            // updated_by: models.uuidFromString(data.updated_by)
                    });
                    if (data.request_from == 'admin_setting') {
                        var sa = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500];
                        var na = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];

                        var sarole = new models.instance.Role({
                            role_id: models.timeuuid(),
                            created_by: models.uuidFromString(data.created_by),
                            role_title: "System Admin",
                            company_id: companyId,
                            role_access: sa
                        });

                        var narole = new models.instance.Role({
                            role_id: models.timeuuid(),
                            created_by: models.uuidFromString(data.created_by),
                            role_title: "Normal User",
                            company_id: companyId,
                            role_access: na
                        });
                    }
                    saveCompanyData.saveAsync()
                        .then(function(res) {
                            console.log("Company saved = ", res);
                            sarole.save(function(err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                console.log('System admin Role created!');
                            });
                            narole.save(function(err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                console.log('Normal user Role created!');
                            });
                            callback({ status: true, return_data: data, msg: 'Company saved succesfully.' });
                        })
                        .catch(function(err) {
                            callback({ status: false, err: err });
                        });
                }
            } else {
                callback({ status: false, msg: "Company name is already exist." });
            }
        });
    } else if (data.type == 'delete') {
        if (data.request_from == 'admin_setting') {
            var query = { company_id: models.timeuuidFromString(data.company_id), company_name: data.company_name };
            models.instance.Company.delete(query, function(err) {
                if (err) callback({ status: false, err: err });
                models.instance.Role.find({ company_id: models.timeuuidFromString(data.company_id) }, { raw: true, allow_filtering: true }, function(err, getAllRoles) {
                    if (err) callback({ status: false, err: err });
                    if (getAllRoles.length > 0) {
                        // console.log("getAllRoles", getAllRoles);


                        // _.forEach(getAllRoles, function(role, key) {
                        // 	console.log(key, "=", role);
                        // 	console.log(role.role_id);
                        // 	var query = {role_id: models.timeuuidFromString(role.role_id)};
                        // 	models.instance.Role.delete(query, function(err){
                        // 		if(err) callback({status:false, err: err});
                        // 		console.log("Delete Role = ", role.role_id);
                        // 	});
                        // });


                        var deleteRoleQuery = [];

                        _.forEach(getAllRoles, function(role, key) {
                            console.log(key, "=", role);
                            console.log("534", role.role_id);
                            var del_query = models.instance.Role.delete({ role_id: role.role_id }, { return_query: true });
                            console.log("del_query = ", del_query);
                            deleteRoleQuery.push(del_query);
                        });

                        models.doBatch(deleteRoleQuery, function(err) {
                            if (err) throw err;
                            callback({ status: true });
                        });
                    }
                });
            });
        }
    }
};
settings['get_role_by_company'] = (data, callback) => {
    models.instance.Role.find({ company_id: models.timeuuidFromString(data.company_id) }, { raw: true, allow_filtering: true }, function(error, data) {
        if (error) callback({ status: false, err: error });
        callback({ status: true, roles_by_company: data });
    });
};
settings['is_exist_user_under_company'] = (data, callback) => {
    models.instance.Users.find({ company_id: models.timeuuidFromString(data.company_id) }, { raw: true, allow_filtering: true }, function(error, data) {
        if (error) callback({ status: false, err: error });
        callback({ status: true, exist_user: data });
    });
};
settings['add_company_members'] = (data, callback) => {
    // uids
    // companyId
    // user_id

    // models.instance.Users.find({team_id: models.timeuuidFromString(data.teamid)}, {raw:true, allow_filtering: true}, function(error, tdata){
    //     if(error) callback({status: false, err: error});
    //     var participants = tdata[0].participants;
    //     _.forEach(data.uids, function(v, k){
    //         participants.push(v);
    //     });
    // });
};


module.exports = { settings };