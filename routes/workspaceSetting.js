var express = require('express');
var moment = require('moment');
var router = express.Router();
var MobileDetect = require('mobile-detect');
const isUuid = require('uuid-validate');

var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {email} = require('./../utils/email');
var {settings} = require('./../utils/settings');
var {getActiveUsers} = require('./../utils/chatuser');
var {get_running_calls} = require('./../utils/voice_video');
var {get_all_users_of_all_company} = require('./../utils/all_company_user');

/* GET listing. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    // get_all_users_of_all_company((repAllcomUser)=> {
      getActiveUsers(req.session.user_id, (users)=>{
        if(! users.status) throw users;
        //user is an array of plain objects with only name and age
        // get_running_calls((running_calls) => {
          // if(running_calls.length==0) running_calls='false';
          settings.get_allrole(req.session.user_id, (reprole)=>{
            settings.get_allteam(req.session.user_id, true, (repteam)=>{
              // settings.get_allcompany(req.session.user_id, (repcompany)=>{
                var res_data = {
                  url:'settings',
                  title: 'Admin Settings',
                  page_title:'Admin Settings',
                  bodyClass: 'setting',
                  page:'admin_setting',
                  is_team_admin: typeof req.cookies.not_a_system_admin !== 'undefined' && req.cookies.not_a_system_admin == 'yes' ? 'yes' : 'no',
                  success: req.session.success,
                  error: req.session.error,
                  user_id: req.session.user_id,
                  company_id: req.session.company_id,
                  user_fullname: req.session.user_fullname,
                  user_email: req.session.user_email,
                  user_img: req.session.user_img,
                  session_id: req.session.id,
                  file_server: process.env.FILE_SERVER,
                  has_login: true,
                  data: users.users,
                  roles: reprole.status ? reprole.roles : [],
                  teams: repteam.status ? repteam.teams : [],
                  companies: [],
                  // companies: repcompany.status ? repcompany.companies : [],
                  running_calls: [],
                  moment:moment,
                  // running_calls: running_calls,
                  all_company_user: []
                  // all_company_user: repAllcomUser.all_company_user
                };
                var md = new MobileDetect(req.headers['user-agent']);
                var os = md.os();
                if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
                  res.render('mob_admin-setting', res_data);
                else
                  res.render('workspace', res_data);
              // });
            });
          });
        // });
      });
    // });
  } else {
    res.redirect('/');
  }
});

router.post('/send_invitation', function(req, res, next){
  if(req.session.login){
    // req.body.msg_id, req.body.conversation_id, (result, err) =>{
    var sendermsg = (req.body.sendermsg != "")?"<b>Sender Messages</b>"+req.body.sendermsg:"";
    var randompas = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var urllink = encodeURI('http://bd.freeli.io:4004/settings/invited_user/'+ req.body.email + '/' + randompas);
    var data = {
      to: [req.body.email],
      sub: 'Invitation for Signup into Hayven',
      text: 'Invitation for Signup into Hayven',
      msghtml: ' <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <head> <meta charset="UTF-8"> <meta content="width=device-width, initial-scale=1" name="viewport"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta content="telephone=no" name="format-detection"> <title>mahfuztest</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if !mso]><!-- --> <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet"> <!--<![endif]--> <style type="text/css">@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:40px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:40px!important; text-align:center } h2 a { font-size:26px!important; text-align:center } h3 a { font-size:20px!important; text-align:center } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:11px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:18px!important; display:inline-block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}</style> </head> <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <div class="es-wrapper-color" style="background-color:#F7F7F7;"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f7f7f7"></v:fill> </v:background><![endif]--> <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td valign="top" style="padding:0;Margin:0;"> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:10px;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="580" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:13px;color:#999999;">Put your preheader text here. <a href="https://esputnik.com/viewInBrowser" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;">View in browser</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3D5CA3;" width="600" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#CCCCCC;" bgcolor="#cccccc" align="left"> <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="270" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_7e1107c7fc040e7f9dcba390ed3579f1/images/50081558513219175.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="183" height="62.71"></td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="270" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="'+ urllink +'" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Signup</a> </span> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FAFAFA;" width="600" cellspacing="0" cellpadding="0" bgcolor="#fafafa" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px;background-repeat:no-repeat;" align="left"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;"> <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#333333;">Hi '+ req.body.fullname +',</h4> </td> </tr> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0;padding-bottom:20px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;">You have been invited by '+ req.body.sender +' to sign up for Hayven. <br><br>Your OTP is: <b style="font-size:30px;">'+ randompas +'</b>.</p> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;">' + sendermsg + '</p></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="'+ urllink +'" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Signup Now »</a> </span> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px;background-color:#F7C052;" bgcolor="#f7c052" align="left"> <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="202" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0r es-m-p20b" width="182" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/39911527588288171.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-left:5px;padding-right:5px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">House #3D, Road #2A, Block - J, Baridhara.</p> </td> </tr> </table> </td> <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> </tr> </table> <!--[if mso]></td><td width="179" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/35681527588356492.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td esdev-links-color="#ffffff" align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#FFFFFF;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:18px;text-decoration:underline;color:#FFFFFF;" href="mailto:info@name.com">info@ca.freeli.</a>io</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="179" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/50681527588357616.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-123-45-67<br></p> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-987-65-43</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <a target="_blank" href="http://viewstripo.email/?utm_source=templates&amp;utm_medium=email&amp;utm_campaign=education&amp;utm_content=trigger_newsletter" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_7e1107c7fc040e7f9dcba390ed3579f1/images/50081558513219175.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="125" height="42.84"> </a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </div> </body></html>'
    };
    var user = new models.instance.Users({
        email: req.body.email,
        fullname: req.body.fullname ,
        password: passwordToHass(randompas.toString()),
        dept: 'ITL',
        designation: 'User',
        img: 'img.png',
        is_active: 0,
        conference_id : models.timeuuid().toString() + '_personal',
        created_by:req.body.created_by,
        company_id:models.timeuuidFromString(userCompany_id[req.body.created_by])
    });
    user.saveAsync().then(function() {
        email.send(data, (result)=>{
          if(result.msg == 'success'){
            res.json({status: true, result});
          }
          else
          res.json({status: false, result});
        });
    }).catch(function(err) {
      res.json({status: false, result:err});
    });
  }
});

router.post('/active_inactive', function(req, res, next){
  if(req.session.login){
    models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {is_active: Number(req.body.is_active)}, update_if_exists, function(err){
      if(err) res.json({status: false, err: err});
      else res.json({status: true});
    });
  }
});

// ALTER TABLE alpha2_test.team add team_admin SET<text>;
router.post('/add_remove_team_admin', function(req, res, next){
  try{
    if(req.session.login){
      if(req.body.type == 'add') {
        var team_admin = {team_admin: {'$add': [req.body.id]}};
        models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {access: { '$add': [1204] }}, update_if_exists, function(err){
          if(err) throw err;
        });
      }
      else {
        var team_admin = {team_admin: {'$remove': [req.body.id]}};
        models.instance.Team.find({team_admin: {'$contains': req.body.id } }, { raw: true, allow_filtering: true }, function(err, teams) {
          if(err) throw err;
          if(teams.length == 1){
            models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {access: { '$remove': [1204] }}, update_if_exists, function(error){
              if(error) throw error;
            });
          }
        });
      }
      models.instance.Team.update({team_id: models.timeuuidFromString(req.body.team_id)}, team_admin, update_if_exists, function(error){
        if(error) throw error;
        else{
          res.json({status: true, msg: 'Team admin '+ req.body.type + ' successfully.'});
        }
      });
    }
  }catch(e){
    res.json({status: false, error: e});
  }
});
router.post('/delete_user', function(req, res, next){
  if(req.session.login){
    models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {is_delete: 1}, update_if_exists, function(err){
      if(err) res.json({status: false, err: err});
      else res.json({status: true});
    });
  }
});
router.post('/update_user_info', function(req, res, next){
  if(req.session.login){
    models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {fullname: req.body.fullname, designation: req.body.designation}, update_if_exists, function(err){
      if(err) res.json({status: false, err: err});
      else res.json({status: true});
    });
  }
});
router.post('/update_user_propic', function(req, res, next){
  if(req.session.login){
    models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {img: req.body.img}, update_if_exists, function(err){
      if(err) res.json({status: false, err: err});
      else {
        req.session.user_img = req.body.img;
        res.json({status: true});
      }
    });
  }
});

router.get('/invited_user/:email/:pass', function(req, res, next){
  if (req.session.login) {
      res.redirect('/alpha2');
  } else {
      res.render('set-new-password-invite', { title: 'Invited User Signup | NEC',page_title:'Admin Settings',  bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.params.email, pass: req.params.pass });
      req.session.error = null;
  }
});
router.get('/set-new-password/:email/:pass', function(req, res, next){
  if (req.session.login) {
    res.redirect('/alpha2');
  } else {
      res.render('set-new-password-invite2', { title: 'Invited User Signup | NEC', page_title:'Admin Settings', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.params.email, pass: req.params.pass });
      req.session.error = null;
  }
});

router.post('/set-new-password', function(req, res, next){
  if(req.session.login){
      res.redirect('/alpha2');
  } else {
      models.instance.Users.find({email: req.body.email}, {raw:true, allow_filtering: true}, function(err, user){
          if(err) throw err;
          if(user.length == 1){
              if(passwordToCompare(req.body.oldpass, user[0].password)){
                models.instance.Users.update({id: user[0].id}, {password: passwordToHass(req.body.newpass), is_active: 1}, update_if_exists, function(error){
                    if(error) throw error;
                    else{
                        res.render('reset-successfull', { title: 'Reset Successfull | NEC', page_title:'Admin Settings', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false });
                    }
                });
              }
              else{
                req.session.success = false;
                req.session.error = [{ msg: 'OTP does not match.' }];
                res.redirect('/');
              }
          }
      });
  }
});


router.post('/get_email_format', function(req, res, next){
  if(req.session.login){
    models.instance.EmailFormat.find({company_id: models.timeuuidFromString(req.body.company_id)}, {raw:true, allow_filtering: true}, function(err, result){
      if(err) res.json({status: false, err: err});
      else res.json({status: true, result});
    });
  }
});

router.post('/set_email_format', function(req, res, next){
  if(req.session.login){
    if(isUuid(req.body.id)){
      try{
        models.instance.EmailFormat.update({id: models.timeuuidFromString(req.body.id), company_id: models.timeuuidFromString(req.body.company_id)}, {email_type: req.body.type, format_text: req.body.val, created_by: models.uuidFromString(req.body.user_id)}, update_if_exists, function(err){
          if(err) res.json({status: false, err: err});
          else res.json({status: true});
        });
      }catch(e){
        res.json({status: false, err: e});
      }
    }else{
      try{
        var data = new models.instance.EmailFormat ({
          id: models.timeuuid(),
          company_id: models.timeuuidFromString(req.body.company_id),
          email_type: req.body.type, 
          format_text: req.body.val, 
          created_by: models.uuidFromString(req.body.user_id)
        });
        
        data.saveAsync().then(function() {
          res.json({status: true, result: data});
        }).catch(function(err) {
          res.json({status: false, err:err});
        });
      }catch(e){
        res.json({status: false, err: e});
      }
    }
  }
});


module.exports = router;
