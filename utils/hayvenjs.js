var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
const metascraper = require('metascraper');
const got = require('got');
var fetch = require("node-fetch");
var router = app.Router();
const isUuid = require('uuid-validate');
var { email } = require('./../utils/email');

var { models } = require('./../config/db/express-cassandra');
var { passwordToHass, passwordToCompare } = require('./../utils/hassing');
var {getReplayConvData, getUnreadReplayMsg} = require('./reply_helper');

var hayvenjs = [];

var get_conversation = (conversation_id, seartTxt, allFilteredItem = [], user_id = '', unreadThread = false, filterOnlyTagMsgA = [], allUserTagList = [], callback) => {
    console.log(16, filterOnlyTagMsgA);
    // console.log(16,allUserTagList);
    console.log(16, allFilteredItem);
    if (seartTxt == 1) {
        console.log("Fron true:  " + seartTxt);
        var objquery = { conversation_id: conversation_id, $orderby: { '$desc': 'msg_id' } }
        if (unreadThread) {
            objquery['has_reply'] = { '$gt': 0 }
        } else if (filterOnlyTagMsgA.length > 0) {
            _.each(filterOnlyTagMsgA, function(v, k) {
                if (v == 'filteTagOnly') {
                    // _.each(allUserTagList,function(va,ka){
                    //   objquery['tag_list'] = { $contains:va.tag_id}
                    // })
                    objquery['$limit'] = 500;
                } else {
                    objquery['tag_list'] = { $contains: v }
                }
            })
        } else {
            if (allFilteredItem.length > 0) {
                _.each(allFilteredItem, function(v, k) {
                    if (v == 'flag') {
                        objquery['has_flagged'] = { $contains: user_id }
                    } else {
                        objquery['$like'] = { 'msg_type': 'checklist' }
                    }

                })
            } else {
                objquery['$limit'] = 50;
            }
        }

        models.instance.Messages.find(objquery, { raw: true, allow_filtering: true }, function(err, conversation) {

            if (err) {
                console.log(err);
                callback({ status: false, err: err });
            } else {
                console.log(21, "conversation length:  " + conversation.length);

                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });


                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    } else {
        console.log("Fron false:  " + seartTxt);
        var objquery = { conversation_id: conversation_id, $orderby: { '$desc': 'msg_id' } }
        if (unreadThread) {
            objquery['has_reply'] = { '$gt': 0 }
        } else if (filterOnlyTagMsgA.length > 0) {
            _.each(filterOnlyTagMsgA, function(v, k) {
                if (v == 'filteTagOnly') {
                    //   _.each(allUserTagList,function(va,ka){
                    //   objquery['tag_list'] = { $contains:va.tag_id}
                    // })
                    objquery['$limit'] = 500;
                } else {
                    objquery['tag_list'] = { $contains: v }
                }
            })
        } else {
            if (allFilteredItem.length > 0) {
                _.each(allFilteredItem, function(v, k) {
                    if (v == 'flag') {
                        objquery['has_flagged'] = { $contains: user_id }
                    } else {
                        objquery['$like'] = { 'msg_type': 'checklist' }
                    }

                })
            } else {
                objquery['$limit'] = 50;
            }
        }

        models.instance.Messages.find(objquery, { raw: true, allow_filtering: true }, function(err, conversation) {

            if (err) {
                callback({ status: false, err: err });
            } else {
                console.log("conversation length:  " + conversation.length);
                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    }
};
var get_conversation_thread = (conversation_id, seartTxt, callback) => {
    if (seartTxt == 1) {
        console.log("Fron true:  " + seartTxt);
        models.instance.Messages.find({ conversation_id: conversation_id, $orderby: { '$desc': 'msg_id' }, has_reply: { '$gt': 0 }, }, { raw: true, allow_filtering: true }, function(err, conversation) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                console.log(21, "conversation length:  " + conversation.length);

                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });


                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    } else {
        console.log("Fron false:  " + seartTxt);
        models.instance.Messages.find({ conversation_id: conversation_id, $orderby: { '$desc': 'msg_id' } }, { raw: true, allow_filtering: true }, function(err, conversation) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                console.log("conversation length:  " + conversation.length);
                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    }
};
var get_conversation_secret = (conversation_id, seartTxt, callback) => {
    if (seartTxt == 1) {
        console.log("Fron true:  " + seartTxt);
        models.instance.Messages.find({ conversation_id: conversation_id, $orderby: { '$desc': 'msg_id' }, is_secret:true, }, { raw: true, allow_filtering: true }, function(err, conversation) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                console.log(21, "conversation length:  " + conversation.length);

                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });


                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    } else {
        console.log("Fron false:  " + seartTxt);
        models.instance.Messages.find({ conversation_id: conversation_id,is_secret:true, $orderby: { '$desc': 'msg_id' } }, { raw: true, allow_filtering: true }, function(err, conversation) {
            if (err) {
                callback({ status: false, err: err });
            } else {
                console.log("conversation length:  " + conversation.length);
                var checklistMsgId = [];

                _.each(conversation, function(v, k) {
                    if (v.msg_type == 'checklist') {
                        checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                    }
                });

                if (checklistMsgId.length > 0) {
                    var query = {
                        msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                        if (cerror) {
                            callback({ status: false, error: cerror });
                        } else {
                            callback({ status: true, conversation: _.reverse(conversation), checklist: cresult });
                        }
                    });
                } else {
                    callback({ status: true, conversation: _.reverse(conversation) });
                }
            }
        });
    }
};


var get_messages_tag = (conversation_id, user_id, callback) => {
    models.instance.MessagesTag.find({ conversation_id: models.uuidFromString(conversation_id), tagged_by: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, tags) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, tags: tags });
        }
    });
};

var get_connect_topic = (conversation_id, user_id, callback) => {
    models.instance.ConnectTopic.find({ conversation_id: models.uuidFromString(conversation_id), tagged_by: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, topics) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, topics: topics });
        }
    });
};

var get_myTags = (conversation_id, user_id, callback) => {
    models.instance.Tag.find({
        tagged_by: models.uuidFromString(user_id),
        type: "CONNECT"
    }, {
        allow_filtering: true
    }, function(tagserr, tags) {
        if (tagserr) {
            callback({
                status: false,
                err: tagserr
            });
        } else {

            models.instance.Convtag.find({
                conversation_id: models.uuidFromString(conversation_id)
            }, {
                allow_filtering: true
            }, function(err, Ctags) {
                if (tagserr) {
                    callback({
                        status: false,
                        err: tagserr
                    });
                } else {
                    callback({
                        status: true,
                        tags: tags,
                        Ctags: Ctags
                    });
                }
            });
        }
    });
};

hayvenjs["update_permission"] = (data, callback) => {
    var set_query = (data.type == "add") ? { $add: [data.access] } : (data.type == "remove") ? { $remove: [data.access] } : "";
    var qry = { id: models.uuidFromString(data.uid) };

    models.instance.Users.update(qry, { access: set_query }, update_if_exists, function(err) {
        if (err) callback({ status: false, error: err });
        callback({ status: true, uid: data.uid, access: data.access });
    });
}
hayvenjs["update_role"] = (data, callback) => {
    var qry = { id: models.uuidFromString(data.uid) };
    models.instance.Role.find({ role_id: models.timeuuidFromString(data.role) }, { allow_filtering: true }, function(err, roledata) {
        if (err) callback({ status: false, error: err });
        if (roledata.length == 1) {
            var set_data = {
                role: roledata[0].role_title,
                access: roledata[0].role_access
            }
            models.instance.Users.update(qry, set_data, update_if_exists, function(err) {
                if (err) callback({ status: false, error: err });
                callback({ status: true, data });
            });
        }
    });
}

hayvenjs["update_user_role_from_um"] = (data, callback) => {
    var qry = { id: models.uuidFromString(data.uid) };
    models.instance.Role.find({ role_id: models.timeuuidFromString(data.role_id) }, { allow_filtering: true }, function(err, roledata) {
        if (err) callback({ status: false, error: err });
        if (roledata.length == 1) {
            // console.log(roledata);
            var set_data = {
                role: roledata[0].role_title,
                access: roledata[0].role_access
            }
            models.instance.Users.update(qry, set_data, update_if_exists, function(err) {
                if (err) callback({ status: false, error: err });
                callback({ status: true, data });
            });
        }
    });
}

hayvenjs["add_user"] = (data, callback) => {
    if (data.from_where == 'user_management') {
        var comid = userCompany_id[data.created_by];
    } else if (data.from_where == 'company_management') {
        var comid = data.user_company_id;
    }

    models.instance.Users.find({ email: data.email, company_id: models.timeuuidFromString(comid) }, { allow_filtering: true }, function(error, udata) {
        if (error) callback({ status: false, err: error });
        if (udata.length > 0) {
            callback({ status: false, err: "This email already used.", data: udata });
        } else {
            models.instance.Role.find({ role_id: models.timeuuidFromString(data.role) }, function(err, roledata) {
                if (err) callback({ status: false, err: err });
                var uid = models.uuid()
                var udata = {
                    id: uid,
                    email: data.email,
                    fullname: data.fullname,
                    password: passwordToHass(data.pass),
                    dept: data.dept,
                    designation: '',
                    company_id: models.timeuuidFromString(comid),
                    access: roledata[0].role_access,
                    role: roledata[0].role_title,
                    img: 'img.png',
                    created_by: data.created_by,
                    conference_id: models.timeuuid().toString() + '_personal'
                }
                var user = new models.instance.Users(udata);
                user.saveAsync().then(function() {
					console.log(416, data.team);
					if(data.team !== undefined && data.team.length > 0){
						var teamids = [];
						_.each(data.team, function(v, k){
							models.instance.Team.update({team_id: models.timeuuidFromString(v)}, { participants: { '$add': [uid.toString()] } }, update_if_exists, function(error){
								if(error) console.log("team not update", error);
							});
						});
					}
                    var urllink = process.env.BASE_URL;
                    var email_data = {
                        to: 'mahfuzak08@gmail.com',
                        sub: 'Invitation from Freeli',
                        text: 'Your password is : ' + data.pass,
                        msghtml: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <head> <meta charset="UTF-8"> <meta content="width=device-width, initial-scale=1" name="viewport"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta content="telephone=no" name="format-detection"> <title>mahfuztest</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if !mso]><!-- --> <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet"> <!--<![endif]--> <style type="text/css">@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:40px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:40px!important; text-align:center } h2 a { font-size:26px!important; text-align:center } h3 a { font-size:20px!important; text-align:center } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:11px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:18px!important; display:inline-block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}</style> </head> <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <div class="es-wrapper-color" style="background-color:#F7F7F7;"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f7f7f7"></v:fill> </v:background><![endif]--> <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td valign="top" style="padding:0;Margin:0;"> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:10px;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="580" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:13px;color:#999999;">Put your preheader text here. <a href="https://esputnik.com/viewInBrowser" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;">View in browser</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3D5CA3;" width="600" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#CCCCCC;" bgcolor="#cccccc" align="left"> <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="270" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;"> <img src="https://wfss001.freeli.io/common/freeli-logo.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="135" height="100"></td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="270" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="' + urllink + '" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Signup</a> </span> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FAFAFA;" width="600" cellspacing="0" cellpadding="0" bgcolor="#fafafa" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px;background-repeat:no-repeat;" align="left"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;"> <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#333333;">Hi ' + data.fullname + ',</h4> </td> </tr> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0;padding-bottom:20px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;">You have been invited to sign up for Freeli. <br><br>Your password is: <b style="font-size:30px;">' + data.pass + '</b>.</p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="' + urllink + '" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Signup Now »</a> </span> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px;background-color:#F7C052;" bgcolor="#f7c052" align="left"> <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="202" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0r es-m-p20b" width="182" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/39911527588288171.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-left:5px;padding-right:5px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">House #3D, Road #2A, Block - J, Baridhara.</p> </td> </tr> </table> </td> <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> </tr> </table> <!--[if mso]></td><td width="179" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/35681527588356492.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td esdev-links-color="#ffffff" align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#FFFFFF;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:18px;text-decoration:underline;color:#FFFFFF;" href="mailto:info@name.com">info@ca.freeli.</a>io</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="179" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/50681527588357616.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-123-45-67<br></p> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-987-65-43</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <a target="_blank" href="http://viewstripo.email/?utm_source=templates&amp;utm_medium=email&amp;utm_campaign=education&amp;utm_content=trigger_newsletter" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;"> <img src="https://wfss001.freeli.io/common/freeli-logo.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="100" height="30"> </a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </div> </body></html>'
                    };
                    email.send(email_data, function(er) { console.log("invitation email result: ", er); });
                    callback({ status: true, data: udata });
                }).catch(function(err) {
                    callback({ status: false, err: err });
                });
            });
        }
    });
}
hayvenjs["restore"] = (data, callback) => {
    models.instance.Users.update({ id: models.uuidFromString(data.id) }, { is_delete: 0, password: passwordToHass('123456') }, update_if_exists, function(error) {
        if (error) callback({ status: false, err: error });
        callback({ status: true, msg: "Default password is 123456" });
    })
}
var {
    getOneConversation,
    getLoadConv_n_Message,
    getConversationFiles,
    getConversationChecklist,
    getConversationMessages
} = require('./../utils/redis_scripts');
// hayvenjs["get_conversation_redis"] = async (data, callback) => {
//   if (data.conversationid != undefined) {
//     if(data.allFilteredItem == undefined){
//       data.allFilteredItem = [];
//     }
//     if(data.user_id == undefined){
//       data.user_id = '';
//     }
//     if(data.unreadThread == undefined){
//       data.unreadThread = false;
//     }

//     if(data.seartTxt == '1' && data.allFilteredItem.length == 0 && data.unreadThread == false && data.filterOnlyTagMsgA.length == 0){
//       console.log('Get conv from redis:')
//       var all_messages =  await getConversationMessages(data.user_id,data.conversationid);
//       var all_checklist =  await getConversationChecklist(data.user_id,data.conversationid);
//       var all_files =  await getConversationFiles(data.user_id,data.conversationid);
//       var res_data = await getLoadConv_n_Message(data.user_id,data.conversationid);
//       callback(res_data);
//     }else{
//       var conversationDetail = await getOneConversation(data.conversationid);
//       get_conversation(models.uuidFromString(data.conversationid), data.seartTxt,data.allFilteredItem,data.user_id,data.unreadThread,data.filterOnlyTagMsgA,data.allUserTagList, (result, error) => {

//         models.instance.Pinned.findOne({ user_id: models.uuidFromString(data.user_id), block_id: models.timeuuidFromString(data.conversationid) }, { allow_filtering: true }, function (err, pinnedBlocks) {
//           if (err) throw err;

//           models.instance.File.find({conversation_id: models.uuidFromString(data.conversationid)}, { raw: true, allow_filtering: true }, function(err, files){
//             if(err){
//               callback({status: false, error: err})
//             }else{
//               var res_data = {
//                 conversation_id: data.conversationid,
//                 conversation_type: data.type,
//                 conversation: conversationDetail,
//                 room_id: data.id,
//                 room_name: data.name,
//                 room_img: data.img,
//                 conversation_list: result.conversation,
//                 totalTags: [],
//                 tags: [],
//                 topics:[],
//                 condtagsid: [],
//                 pinnedStatus: pinnedBlocks,
//                 messagestag: [],
//                 files: _.orderBy(files, ["created_at"],['desc']),
//                 msg: 'success'
//               };
//               if(result.checklist != undefined){
//                 res_data['checklist'] = result.checklist;
//               }
//               callback(res_data);
//             }
//           });

//           // get_myTags(data.conversationid, data.user_id, (tRes, Terr) => {

//           //   if (Terr) throw Terr;

//           //   var tagID = [];
//           //   var tags = [];
//           //   var condtagsid = [];

//           //   _.each(tRes.Ctags, function (value, key) {
//           //     tagID.push(value.id.toString());
//           //     condtagsid.push(value.tag_id.toString());
//           //   });

//           //   get_messages_tag(data.conversationid, data.user_id, (mtgsRes, mtgsErr) => {
//           //     if (mtgsErr) throw mtgsErr;

//           //     get_connect_topic(data.conversationid, data.user_id, (topicsRes,topicErr) => {
//           //       if (topicErr) throw topicErr;

//           //       models.instance.File.find({conversation_id: models.uuidFromString(data.conversationid)}, { raw: true, allow_filtering: true }, function(err, files){
//           //         if(err){
//           //           callback({status: false, error: err})
//           //         }else{
//           //           var res_data = {
//           //             conversation_id: data.conversationid,
//           //             conversation_type: data.type,
//           //             conversation: conversationDetail,
//           //             room_id: data.id,
//           //             room_name: data.name,
//           //             room_img: data.img,
//           //             conversation_list: result.conversation,
//           //             totalTags: [],
//           //             tags: tagID,
//           //             topics:[],
//           //             condtagsid: condtagsid,
//           //             pinnedStatus: pinnedBlocks,
//           //             messagestag: [],
//           //             files: _.orderBy(files, ["created_at"],['desc']),
//           //             msg: 'success'
//           //           };
//           //           if(result.checklist != undefined){
//           //             res_data['checklist'] = result.checklist;
//           //           }
//           //           callback(res_data);
//           //         }
//           //       });
//           //     });
//           //   });
//           // });

//         });
//       });
//     }
//   } else {
//     callback({ msg: 'fail' });
//   }

// };
hayvenjs["get_conversation"] = (data, callback) => {
    if (data.conversationid != undefined) {
        models.instance.Conversation.find({ conversation_id: models.uuidFromString(data.conversationid) }, function(err, conversationDetail) {
            if (err) {
                console.log(err)
            };
            if (data.allFilteredItem == undefined) {
                data.allFilteredItem = [];
            }
            if (data.user_id == undefined) {
                data.user_id = '';
            }
            if (data.unreadThread == undefined) {
                data.unreadThread = false;
            }
            get_conversation(models.uuidFromString(data.conversationid), data.seartTxt, data.allFilteredItem, data.user_id, data.unreadThread, data.filterOnlyTagMsgA, data.allUserTagList, (result, error) => {

                models.instance.Pinned.findOne({ user_id: models.uuidFromString(data.user_id), block_id: models.timeuuidFromString(data.conversationid) }, { allow_filtering: true }, function(err, pinnedBlocks) {
                    if (err) {
                        console.log(err)
                    };
                    models.instance.File.find({ conversation_id: models.uuidFromString(data.conversationid) }, { raw: true, allow_filtering: true }, function(err, files) {
                        if (err) {
                            callback({ status: false, error: err })
                        } else {
                            var res_data = {
                                conversation_id: data.conversationid,
                                conversation_type: data.type,
                                conversation: conversationDetail,
                                room_id: data.id,
                                room_name: data.name,
                                room_img: data.img,
                                conversation_list: result.conversation,
                                totalTags: [],
                                tags: [],
                                topics: [],
                                condtagsid: [],
                                pinnedStatus: pinnedBlocks,
                                messagestag: [],
                                files: _.orderBy(files, ["created_at"], ['desc']),
                                msg: 'success'
                            };
                            if (result.checklist != undefined) {
                                res_data['checklist'] = result.checklist;
                            }
                            callback(res_data);
                        }
                    });

                    // get_myTags(data.conversationid, data.user_id, (tRes, Terr) => {

                    //   if (Terr) throw Terr;

                    //   var tagID = [];
                    //   var tags = [];
                    //   var condtagsid = [];

                    //   _.each(tRes.Ctags, function (value, key) {
                    //     tagID.push(value.id.toString());
                    //     condtagsid.push(value.tag_id.toString());
                    //   });

                    //   get_messages_tag(data.conversationid, data.user_id, (mtgsRes, mtgsErr) => {
                    //     if (mtgsErr) throw mtgsErr;

                    //     get_connect_topic(data.conversationid, data.user_id, (topicsRes,topicErr) => {
                    //       if (topicErr) throw topicErr;

                    //       models.instance.File.find({conversation_id: models.uuidFromString(data.conversationid)}, { raw: true, allow_filtering: true }, function(err, files){
                    //         if(err){
                    //           callback({status: false, error: err})
                    //         }else{
                    //           var res_data = {
                    //             conversation_id: data.conversationid,
                    //             conversation_type: data.type,
                    //             conversation: conversationDetail,
                    //             room_id: data.id,
                    //             room_name: data.name,
                    //             room_img: data.img,
                    //             conversation_list: result.conversation,
                    //             totalTags: [],
                    //             tags: tagID,
                    //             topics:[],
                    //             condtagsid: condtagsid,
                    //             pinnedStatus: pinnedBlocks,
                    //             messagestag: [],
                    //             files: _.orderBy(files, ["created_at"],['desc']),
                    //             msg: 'success'
                    //           };
                    //           if(result.checklist != undefined){
                    //             res_data['checklist'] = result.checklist;
                    //           }
                    //           callback(res_data);
                    //         }
                    //       });
                    //     });
                    //   });
                    // });

                });
            });
        });
    } else {
        callback({ msg: 'fail' });
    }

};
hayvenjs["get_conversation_thread"] = (data, callback) => {
    if (data.conversationid != undefined) {
        models.instance.Conversation.find({ conversation_id: models.uuidFromString(data.conversationid) }, function(err, conversationDetail) {
            if (err) throw err;

            get_conversation_thread(models.uuidFromString(data.conversationid), data.seartTxt, (result, error) => {

                models.instance.Pinned.findOne({ user_id: models.uuidFromString(data.user_id), block_id: models.timeuuidFromString(data.conversationid) }, { allow_filtering: true }, function(err, pinnedBlocks) {
                    if (err) throw err;

                    models.instance.File.find({ conversation_id: models.uuidFromString(data.conversationid) }, { raw: true, allow_filtering: true }, function(err, files) {
                        if (err) {
                            callback({ status: false, error: err })
                        } else {
                            var res_data = {
                                conversation_id: data.conversationid,
                                conversation_type: data.type,
                                conversation: conversationDetail,
                                room_id: data.id,
                                room_name: data.name,
                                room_img: data.img,
                                conversation_list: result.conversation,
                                totalTags: [],
                                tags: [],
                                topics: [],
                                condtagsid: [],
                                pinnedStatus: pinnedBlocks,
                                messagestag: [],
                                files: _.orderBy(files, ["created_at"], ['desc']),
                                msg: 'success'
                            };
                            if (result.checklist != undefined) {
                                res_data['checklist'] = result.checklist;
                            }
                            callback(res_data);
                        }
                    });

                    // get_myTags(data.conversationid, data.user_id, (tRes, Terr) => {

                    //   if (Terr) throw Terr;

                    //   var tagID = [];
                    //   var tags = [];
                    //   var condtagsid = [];

                    //   _.each(tRes.Ctags, function (value, key) {
                    //     tagID.push(value.id.toString());
                    //     condtagsid.push(value.tag_id.toString());
                    //   });

                    //   get_messages_tag(data.conversationid, data.user_id, (mtgsRes, mtgsErr) => {
                    //     if (mtgsErr) throw mtgsErr;

                    //     get_connect_topic(data.conversationid, data.user_id, (topicsRes,topicErr) => {
                    //       if (topicErr) throw topicErr;

                    //       models.instance.File.find({conversation_id: models.uuidFromString(data.conversationid)}, { raw: true, allow_filtering: true }, function(err, files){
                    //         if(err){
                    //           callback({status: false, error: err})
                    //         }else{
                    //           var res_data = {
                    //             conversation_id: data.conversationid,
                    //             conversation_type: data.type,
                    //             conversation: conversationDetail,
                    //             room_id: data.id,
                    //             room_name: data.name,
                    //             room_img: data.img,
                    //             conversation_list: result.conversation,
                    //             totalTags: [],
                    //             tags: tagID,
                    //             topics:[],
                    //             condtagsid: condtagsid,
                    //             pinnedStatus: pinnedBlocks,
                    //             messagestag: [],
                    //             files: _.orderBy(files, ["created_at"],['desc']),
                    //             msg: 'success'
                    //           };
                    //           if(result.checklist != undefined){
                    //             res_data['checklist'] = result.checklist;
                    //           }
                    //           callback(res_data);
                    //         }
                    //       });
                    //     });
                    //   });
                    // });

                });
            });
        });
    } else {
        callback({ msg: 'fail' });
    }

};
hayvenjs["get_conversation_secret"] = (data, callback) => {
    if (data.conversationid != undefined) {
        models.instance.Conversation.find({ conversation_id: models.uuidFromString(data.conversationid) }, function(err, conversationDetail) {
            if (err) throw err;

            get_conversation_secret(models.uuidFromString(data.conversationid), data.seartTxt, (result, error) => {

                models.instance.Pinned.findOne({ user_id: models.uuidFromString(data.user_id), block_id: models.timeuuidFromString(data.conversationid) }, { allow_filtering: true }, function(err, pinnedBlocks) {
                    if (err) throw err;

                    models.instance.File.find({ conversation_id: models.uuidFromString(data.conversationid) }, { raw: true, allow_filtering: true }, function(err, files) {
                        if (err) {
                            callback({ status: false, error: err })
                        } else {
                            var res_data = {
                                conversation_id: data.conversationid,
                                conversation_type: data.type,
                                conversation: conversationDetail,
                                room_id: data.id,
                                room_name: data.name,
                                room_img: data.img,
                                conversation_list: result.conversation,
                                totalTags: [],
                                tags: [],
                                topics: [],
                                condtagsid: [],
                                pinnedStatus: pinnedBlocks,
                                messagestag: [],
                                files: _.orderBy(files, ["created_at"], ['desc']),
                                msg: 'success'
                            };
                            if (result.checklist != undefined) {
                                res_data['checklist'] = result.checklist;
                            }
                            callback(res_data);
                        }
                    });

                    // get_myTags(data.conversationid, data.user_id, (tRes, Terr) => {

                    //   if (Terr) throw Terr;

                    //   var tagID = [];
                    //   var tags = [];
                    //   var condtagsid = [];

                    //   _.each(tRes.Ctags, function (value, key) {
                    //     tagID.push(value.id.toString());
                    //     condtagsid.push(value.tag_id.toString());
                    //   });

                    //   get_messages_tag(data.conversationid, data.user_id, (mtgsRes, mtgsErr) => {
                    //     if (mtgsErr) throw mtgsErr;

                    //     get_connect_topic(data.conversationid, data.user_id, (topicsRes,topicErr) => {
                    //       if (topicErr) throw topicErr;

                    //       models.instance.File.find({conversation_id: models.uuidFromString(data.conversationid)}, { raw: true, allow_filtering: true }, function(err, files){
                    //         if(err){
                    //           callback({status: false, error: err})
                    //         }else{
                    //           var res_data = {
                    //             conversation_id: data.conversationid,
                    //             conversation_type: data.type,
                    //             conversation: conversationDetail,
                    //             room_id: data.id,
                    //             room_name: data.name,
                    //             room_img: data.img,
                    //             conversation_list: result.conversation,
                    //             totalTags: [],
                    //             tags: tagID,
                    //             topics:[],
                    //             condtagsid: condtagsid,
                    //             pinnedStatus: pinnedBlocks,
                    //             messagestag: [],
                    //             files: _.orderBy(files, ["created_at"],['desc']),
                    //             msg: 'success'
                    //           };
                    //           if(result.checklist != undefined){
                    //             res_data['checklist'] = result.checklist;
                    //           }
                    //           callback(res_data);
                    //         }
                    //       });
                    //     });
                    //   });
                    // });

                });
            });
        });
    } else {
        callback({ msg: 'fail' });
    }

};

hayvenjs["get_old_msg"] = (data, callback) => {
    if (data.conversation_id != undefined && data.msg_id != undefined) {
        if (isUuid(data.msg_id) && isUuid(data.conversation_id)) {

            $query = {
                conversation_id: models.uuidFromString(data.conversation_id),
                msg_id: { '$lt': models.timeuuidFromString(data.msg_id) },
                $orderby: { '$desc': 'msg_id' },
                $limit: 25
            };

            models.instance.Messages.find($query, { raw: true, allow_filtering: true }, function(err, conversation) {
                if (err) {
                    callback({ status: false, err: err });
                } else {
                    models.instance.File.find({ conversation_id: models.uuidFromString(data.conversation_id.toString()), is_delete: 0 }, { raw: true, allow_filtering: true }, async function(ferr, files) {
                        if (ferr) {
                            callback({ status: false, err: ferr });
                        } else {
                            var checklistMsgId = [];
							var msg_ids = [];
							
                            _.each(conversation, function(v, k) {
                                v.unread_reply = 0;
								if (v.msg_type == 'checklist') {
                                    checklistMsgId.push(models.timeuuidFromString(v.msg_id.toString()));
                                }
								if(v.has_reply > 0) msg_ids.push(v.msg_id);
                            });
							
							if(msg_ids.length > 0){
								var rep_ids = await getReplayConvData(models.uuidFromString(data.conversation_id), msg_ids);
								var convids = [];
								_.each(rep_ids, function(vv, kk){
									convids.push(vv.rep_id);
								});
								var rep_msgs = await getUnreadReplayMsg(convids, data.user_id);
								if(rep_msgs.length > 0){
									_.each(rep_ids, function(v, k){
										v.unread_reply = 0;
										_.each(rep_msgs, function(vv, kk){
											if(vv.conversation_id.toString() == v.rep_id.toString())
												v.unread_reply++;
										});
									});
									
									_.each(conversation, function(v, k){
										_.each(rep_ids, function(vv, kk){
											if(vv.msg_id.toString() == v.msg_id.toString())
												v.unread_reply = vv.unread_reply;
										});
									});
								}
							}

                            if (checklistMsgId.length > 0) {
                                var query = {
                                    msg_id: { '$in': checklistMsgId }
                                };
                                models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function(cerror, cresult) {
                                    if (cerror) {
                                        callback({ status: false, error: cerror });
                                    } else {
                                        callback({ status: true, result: conversation, checklist: cresult, files: files });
                                    }
                                });
                            } else {
                                callback({ status: true, result: conversation, files: files });
                            }
                        }
                    });
                }
            });
        } else {
            callback({ status: false, err: 'Data missing' });
        }
    } else {
        callback({ status: false, err: 'Data missing' });
    }

};

hayvenjs["call_history"] = (data, callback) => {
    if (data.conversation_id != undefined && data.msg_id != undefined) {
        if (data.msg_id != "" && data.conversation_id != "") {

            $query = {
                conversation_id: models.uuidFromString(data.conversation_id),
                msg_id: { '$lt': models.timeuuidFromString(data.msg_id) },
                $orderby: { '$desc': 'msg_id' },
                $limit: 20
            };

            models.instance.Messages.find($query, { raw: true, allow_filtering: true }, function(err, conversation) {
                if (err) {
                    callback({ status: false, err: err });
                } else {
                    var conversations = [];
                    if (conversation != undefined) {
                        if (conversation.length > 0) {

                            _.each(conversation, function(value, key) {
                                if (value.call_type == 'video' || value.call_type == 'audio')
                                    conversations.push({
                                        'conversation_id': value.conversation_id,
                                        'msg_body': value.msg_body,
                                        'created_at': value.created_at,
                                        'call_duration': (value.call_duration == "" ? 0 : value.call_duration),
                                        'call_type': value.call_type,
                                        'call_status': value.call_status,
                                        'call_msg': value.call_msg,
                                        'msg_id': value.msg_id,
                                        'msg_type': value.msg_type,
                                        'sender_name': value.sender_name
                                    });
                            });
                        }
                    }
                    callback({ status: true, result: conversations });
                }
            });
        } else {
            callback({ status: false, err: 'Data missing' });
        }
    } else {
        callback({ status: false, err: 'Data missing' });
    }

};

// Get all public rooms from db where workspace define
hayvenjs["myTopicList"] = (data, callback) => {

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

// Get all public rooms from db where workspace define
hayvenjs["public_conversation"] = (data, callback) => {

    var query = {
        // group_keyspace: { $eq: data.keySpace },
        // privacy: { $eq: 'public' },
        single: { $eq: 'no' }
    };

    models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(err, rooms) {
        if (err) {
            var res_data = {
                staus: false
            };
            callback(res_data);
        } else {

            models.instance.Tag.find({}, { raw: true, allow_filtering: true }, function(terr, tags) {
                if (terr) {
                    console.log(terr);
                } else {
                    var convID = [];
                    var convTag = [];

                    _.each(rooms, function(value, key) {
                        convID.push(value.conversation_id.toString());
                    });

                    var res_data = {
                        rooms: rooms,
                        convTag: convTag,
                        staus: true
                    };
                    callback(res_data);
                }
            });


        }

    });

};
// Get all public rooms from db where workspace define
hayvenjs["room_status"] = (data, callback) => {

    var query = {
        company_id: { $eq: data.keySpace }
        // privacy: { $eq: 'public' },
        // single: { $eq: 'no' }
    };

    models.instance.Conversation.find(query, { raw: true, allow_filtering: true }, function(err, rooms) {
        if (err) {
            var res_data = {
                staus: false
            };
            callback(res_data);
        } else {

            models.instance.Tag.find({}, { raw: true, allow_filtering: true }, function(terr, tags) {
                if (terr) {
                    console.log(terr);
                } else {
                    var convID = [];
                    var convTag = [];

                    _.each(rooms, function(value, key) {
                        convID.push(value.conversation_id.toString());
                    });

                    var res_data = {
                        rooms: rooms,
                        convTag: convTag,
                        staus: true
                    };
                    callback(res_data);
                }
            });


        }

    });

};


/*
    Function name: clear_all_history()
    Type: Cron job function
    Details: This function clear the data from messages table,
            where all participants in a conversation, are hide their
            messages.
            The function call from socket.js file 'connection' event
*/
clear_conv_list = [];
hayvenjs['clear_all_history'] = () => {
    // models.instance.Conversation.find({},function(err, conversation){
    //     if(err) console.log(err);
    //     for(var i=0; i<conversation.length; i++){
    //         if(clear_conv_list.indexOf(conversation[i].conversation_id.toString()) == -1){
    //             clear_conv_list.push(conversation[i].conversation_id.toString());
    //             var participants = conversation[i].participants;
    //             var conversation_id = conversation[i].conversation_id;
    //             models.instance.Messages.find({conversation_id: conversation_id}, { raw: true, allow_filtering: true }, function(err2, msg){
    //                 if(err2) console.log(err2);

    //                 if(msg.length > 0){
    //                     if(_.isEqual(msg[0].has_hide, participants)){
    //                         // console.log("*********************************************************************");
    //                         // console.log(conversation_id.toString());
    //                         models.instance.Messages.delete({conversation_id: conversation_id}, function(err3){
    //                             if(err3) console.log(err3);
    //                             console.log('Messages table data clear successfully');
    //                         });
    //                     }
    //                 }
    //             });
    //             i = conversation.length + 1;
    //         }
    //     }
    //     if(clear_conv_list.length == conversation.length)
    //         clear_conv_list = [];
    // });
};

hayvenjs['get_bucket_info'] = (data, callback) => {
    fetch(data.baseurl + '/s3Local/create_bucket_if_not_exists/' + data.email_user_id)
        .then((fetchData) => {
            return fetchData.json();
        })
        .then((json) => {
            callback({ status: true, bucket_name: json.bucket_name });
        })
        .catch(err => callback({ status: false, error: err }));
}

hayvenjs['single_conv_detail'] = (data, callback) => {
    models.instance.Conversation.findOne({ conversation_id: models.uuidFromString(data.conversation_id) }, function(err, result) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            if (result) {
                if (result.single == 'yes') {
                    var all_member = result.participants.slice();
                    all_member.splice(all_member.indexOf(data.user_id), 1);
                    var rep_data = {
                        "conversation_id": result.conversation_id,
                        "conversation_type": "Personal",
                        "msg_body": result.last_msg,
                        "participants": result.participants,
                        "conversation_with": all_member.toString(),
                        "conversation_title": idToNameArr([all_member]).toString(),
                        "participants_name": idToNameArr(result.participants)
                    }
                    callback({ status: true, result: rep_data });
                } else {
                    var rep_data = {
                        "conversation_id": result.conversation_id,
                        "conversation_type": "Group",
                        "msg_body": result.last_msg,
                        "participants": result.participants,
                        "conversation_with": "Group",
                        "conversation_title": result.title,
                        "participants_name": idToNameArr(result.participants)
                    }
                    callback({ status: true, result: rep_data });
                }
            } else callback({ status: false, err: "No data found" });
        }
    })
}

function idToNameArr(idArry) {
    var namearr = [];
    _.each(idArry, function(v, k) {
        namearr.push(alluserOnLoad[v])
    });
    return namearr;
}
hayvenjs['save_files_data'] = (data, callback) => {
    var queries = [];
    if (!Array.isArray(data.allfiles)) {
        data.allfiles = JSON.parse(data.allfiles);
    }
    var returnData = [];
    if (data.allfiles.length > 0) {
        _.forEach(data.allfiles, function(v, k) {
            console.log(805, v);
            var sdata = {
                id: models.timeuuid(),
                user_id: data.user_id,
                msg_id: data.msgid,
                conversation_id: data.conversation_id,
                acl: v.acl,
                bucket: v.bucket,
                file_type: v.mimetype,
                key: v.key,
                location: v.bucket + '/' + v.key,
                originalname: (v.voriginalName === undefined) ? v.originalname : v.voriginalName,
                file_size: v.size.toString(),
                tag_list: data.tempAttachmentTag,
                mention_user: data.mention_user,
                root_conv_id: (data.root_conv_id != undefined) ? data.root_conv_id : null,
                secret_user: data.secret_user,
                is_secret: data.secret_user && data.secret_user.length ? true : false 
            }
            returnData.push(sdata)
            var file_data = new models.instance.File(sdata);
            var save_query = file_data.save({ return_query: true });
            queries.push(save_query);
        });
        models.doBatch(queries, function(err) {
            if (err) callback({ status: false, error: err });
            callback({ status: true, data: returnData });
        });
    } else {
        callback({ status: true });
    }
};

hayvenjs['update_files_data'] = (data, callback) => {
    setTimeout(function() {
        models.instance.File.find({ conversation_id: models.uuidFromString(data.conversation_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, files) {
            if (err) callback({ status: false, error: err });
            else {
                if (files) {
                    var queries = [];
                    _.forEach(files, function(v, k) {
                        var update_query = models.instance.File.update({ id: v.id }, { conversation_id: models.uuidFromString(data.update_conv) }, { return_query: true });
                        queries.push(update_query);
                    });
                    models.doBatch(queries, function(err) {
                        if (err) callback({ status: false, error: err });
                        callback({ status: true, data });
                    });
                } else {
                    callback({ status: false });
                }
            }
        });
    }, 3000);
};

hayvenjs['all_files'] = (data, callback) => {
    data.conversation_id = data.conversation_id.split('/');
    if (data.conversation_id.indexOf('allConv') > -1) {
        console.log(1070, data)
        data.conversation_id = data.conversation_id[0];
        models.instance.Conversation.find({ participants: { $contains: data.conversation_id } }, { raw: true, allow_filtering: true }, function(err1, conversations) {
            if (err1) {
                console.log(err1);
            } else {
                var allConvids = [];
                for (var i = 0; i < conversations.length; i++) {
                    allConvids.push(models.uuidFromString(conversations[i].conversation_id.toString()));
                }
                if (allConvids.length > 0) {
                    models.instance.File.find({ conversation_id: { $in: allConvids }, is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, files) {
                        if (err) {
                            console.log(err)
                            callback({ status: false, error: err })
                        } else {
                            console.log(581, files.length);
                            models.instance.Link.find({ conversation_id: { $in: allConvids } }, { raw: true, allow_filtering: true }, function(error, links) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        // console.log(587, files);
                                        // console.log(702,links)
                                        // callback({status: true, allMediaMsg:msg.rows});
                                        models.instance.File.find({ conversation_id: models.uuidFromString(data.conversation_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(err3, files3) {
                                            if (err3) {
                                                console.log(err)
                                                callback({ status: false, error: err3 })
                                            } else {
                                                models.instance.UserTag.find({ tagged_by: models.uuidFromString(data.conversation_id) }, function(errT, tags) {
                                                    if (errT) {
                                                        console.log(errT)
                                                    } else {

                                                        callback({ status: true, files: _.orderBy(files, ["created_at"], ['desc']), msg_links: links, my_files: _.orderBy(files3, ["created_at"], ['desc']), all_conv: conversations, all_tags: tags });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                })
                                // var query = "SELECT * FROM link WHERE conversation_id="+models.uuidFromString(data.conversation_id)+"";
                                // models.instance.Link.execute_query(query, {}, function(error, msg){

                            // });
                        };
                    });
                } else {
                    callback({ status: true, files: [], msg_links: [], all_conv: [], all_tags: [] });
                }
            }
        })
    } else {
        data.conversation_id = data.conversation_id[0];
        models.instance.File.find({ conversation_id: models.uuidFromString(data.conversation_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, files) {
            if (err) {
                callback({ status: false, error: err })
            } else {
                console.log(581);
                models.instance.Link.find({ conversation_id: models.uuidFromString(data.conversation_id) }, {raw: true }, function(error, links) {
                        if (error) {
                            console.log(error);
                        } else {
                            // console.log(587, files);
                            // console.log(702,links)
                            // callback({status: true, allMediaMsg:msg.rows});
                            if(files.length>0){
                                _.each(files, function(v,k){
                                    v.upload_by = idToNameArr([v.user_id])[0];
                                });
                            }
                            if(links.length>0){
                                _.each(links, function(v,k){
                                    v.shared_by = idToNameArr([v.user_id])[0];
                                    v.title = v.title == null || v.title == "null" ? "" : v.title;
                                });
                            }
                            callback({ status: true, files: _.orderBy(files, ["created_at"], ['desc']), msg_links: links });
                        }
                    })
                    // var query = "SELECT * FROM link WHERE conversation_id="+models.uuidFromString(data.conversation_id)+"";
                    // models.instance.Link.execute_query(query, {}, function(error, msg){

                // });
            };
        });
    }
}

hayvenjs['all_files_uid'] = (data, callback) => {
    models.instance.File.find({ user_id: models.uuidFromString(data.user_id), is_delete: data.type }, { raw: true, allow_filtering: true }, function(err, files) {
        if (err) {
            callback({ status: false, error: err })
        } else {
            callback({ status: true, files: _.orderBy(files, ["created_at"], ['desc']) });
        }
    });
}

hayvenjs['files_delete'] = (data, conv_id,locations = [],msg_id = '', callback) => {
    var queries = [];
    _.forEach(data, function(v, k) {
        var update_query = models.instance.File.update({ id: models.timeuuidFromString(v), conversation_id: models.uuidFromString(conv_id) }, { is_delete: 1 }, { return_query: true });
        var update_query = models.instance.File.update({ id: models.timeuuidFromString(v), conversation_id: models.uuidFromString(conv_id) }, { is_delete: 1 }, { return_query: true });
        queries.push(update_query);
    });
    console.log(1367,locations,msg_id,conv_id)
    if(msg_id != '' && locations.length > 0){
        let update_query2 = models.instance.Messages.update({ msg_id: models.timeuuidFromString(msg_id), conversation_id: models.uuidFromString(conv_id) }, { attch_imgfile: {'$remove':locations},attch_audiofile: {'$remove':locations},attch_videofile: {'$remove':locations},attch_otherfile: {'$remove':locations} }, { return_query: true });
        queries.push(update_query2);
    }
    models.doBatch(queries, function(err) {
        if (err) callback({ status: false, error: err });
        callback({ status: true });
    });
}
hayvenjs['delete_obj'] = (data, conversation_id, callback) => {
    models.instance.File.delete({ id: models.timeuuidFromString(data), conversation_id: models.uuidFromString(conversation_id) }, function(err) {
        if (err) callback({ err });
        callback({ status: "Successfully deleted" });
    });
}

hayvenjs['getAllFiles'] = (data, callback) => {
    var allfiles = [];
    models.instance.File.find({ msg_id: models.timeuuidFromString(data.msgid) }, { raw: true, allow_filtering: true }, function(err, files) {
        console.log(937, data);
        if (data.attach_files.imgfile !== undefined) {
            _.each(data.attach_files.imgfile, function(v, k) {
                console.log(940, v);
                for (var i = 0; i < files.length; i++) {
                    if (files[i].location == v) {
                        if (data.need_id) {
                            allfiles.push({
                                id: files[i].id,
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        } else {
                            allfiles.push({
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        }
                    }
                    if (i + 1 == files.length) {
                        callback(allfiles);
                    }
                }
            });
        } else if (data.attach_files.videofile !== undefined) {
            _.each(data.attach_files.videofile, function(v, k) {
                console.log(940, v);
                for (var i = 0; i < files.length; i++) {
                    if (files[i].location == v) {
                        if (data.need_id) {
                            allfiles.push({
                                id: files[i].id,
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        } else {
                            allfiles.push({
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        }
                    }
                    if (i + 1 == files.length) {
                        callback(allfiles);
                    }
                }
            });
        } else if (data.attach_files.audiofile !== undefined) {
            _.each(data.attach_files.audiofile, function(v, k) {
                console.log(940, v);
                for (var i = 0; i < files.length; i++) {
                    if (files[i].location == v) {
                        if (data.need_id) {
                            allfiles.push({
                                id: files[i].id,
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        } else {
                            allfiles.push({
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        }
                    }
                    if (i + 1 == files.length) {
                        callback(allfiles);
                    }
                }
            });
        } else if (data.attach_files.otherfile !== undefined) {
            _.each(data.attach_files.otherfile, function(v, k) {
                console.log(940, v);
                for (var i = 0; i < files.length; i++) {
                    if (files[i].location == v) {
                        if (data.need_id) {
                            allfiles.push({
                                id: files[i].id,
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        } else {
                            allfiles.push({
                                acl: files[i].acl,
                                bucket: files[i].bucket,
                                location: files[i].location,
                                mimetype: files[i].file_type,
                                key: files[i].key,
                                originalname: files[i].originalname,
                                size: files[i].file_size,
                                conversation_id: files[i].conversation_id,
                                root_conv_id:files[i].root_conv_id
                            });
                        }
                    }
                    if (i + 1 == files.length) {
                        callback(allfiles);
                    }
                }
            });
        } else {
            callback(allfiles);
        }
    });
}

hayvenjs['check_email'] = (str) => {
    return new Promise((resolve, reject) => {
        models.instance.Users.find({ email: str }, { raw: true, allow_filtering: true }, function(err, user) {
            if (err) {
                reject({ status: false, error: err });
            } else {
                resolve(user);
            }
        });
    });
}

hayvenjs['check_company'] = (str) => {
    return new Promise((resolve, reject) => {
        models.instance.Company.find({ company_name: str }, { raw: true, allow_filtering: true }, function(err, company) {
            if (err) {
                reject({ status: false, error: err });
            } else {
                resolve(company);
            }
        });
    });
}

hayvenjs['convid_to_repids'] = (convid, callback) => {
    if (uuid_checker(convid)) {
        models.instance.ReplayConv.find({ conversation_id: models.uuidFromString(convid) }, { raw: true, allow_filtering: true }, function(err, reply) {
            if (err) {
                callback({ status: false, error: err });
            } else {
                if (reply.length > 0) {
                    var rep_ids = [];
                    _.forEach(reply, function(v, k) {
                        rep_ids.push(v.rep_id.toString());
                    })
                    callback({ status: true, rep_ids });
                } else callback({ status: false, rep_ids: [] });
            }
        });
    } else {
        callback({ status: false, error: convid });
    }
}

module.exports = { hayvenjs };