var express = require('express');
var router = express.Router();
var _ = require('lodash');
const isUuid = require('uuid-validate');

var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {email} = require('./../utils/email');
var {signup_utils} = require('./../utils/signup_utils');

/* GET signup listing. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect('/alpha2');
  } else {
    models.instance.Company.find({$limit:1000}, function(error, data){
      res.render('signup2', { page_title:'Signup | NEC',title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, company: data });
      req.session.error = null;
    });
  }
});

/* POST signup listing. */
router.post('/', async function(req, res, next) {
  if(req.session.login){
    res.redirect('/alpha2');
  } else {
    if(req.body.account_type == "Social") req.body.company_name = "Social@"+ new Date().getTime();
    req.check('first_name', 'First name is required').isLength({ min:1 }).trim();
    req.check('last_name', 'Last name is required').isLength({ min:1 }).trim();
    req.check('email', 'Invalid email address').isEmail();
    req.check('company_name', 'Company name is required').isLength({min:3}).trim();
    
    // req.check('email', 'Email already registered').custom(email => alreadyHaveEmail(email));
    // req.check('password', 'Password should be at least 6 characters.').isLength({ min: 6 }).trim();
    //req.check('phone_Number', 'Phone Number').trim();

    // var randompas = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var randompas = 123456;
    var sa = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500];
    var na = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
    var getuser = await signup_utils.check_email(req.body.email);
    var company = await signup_utils.check_company(req.body.company_name);
    var uid = models.uuid();
    var user = new models.instance.Users({
      id: uid,
      email: req.body.email,
      fullname: req.body.first_name + ' ' + req.body.last_name,
      password: passwordToHass(randompas.toString()),
      dept: (req.body.account_type == "Social") ? "Social" : "Business",
      designation: '',
      img: 'img.png',
      created_by:uid.toString(),
        conference_id : models.timeuuid().toString() + '_personal'
    });
    // var data = {
    //   to: [req.body.email],
    //   sub: 'Signup from bd freeli',
    //   text: 'Signup from bd freeli. Your password is: ',
    //   msghtml: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <head> <meta charset="UTF-8"> <meta content="width=device-width, initial-scale=1" name="viewport"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta content="telephone=no" name="format-detection"> <title>mahfuztest</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if !mso]><!-- --> <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet"> <!--<![endif]--> <style type="text/css">@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:40px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:40px!important; text-align:center } h2 a { font-size:26px!important; text-align:center } h3 a { font-size:20px!important; text-align:center } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:11px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:18px!important; display:inline-block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}</style> </head> <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> <div class="es-wrapper-color" style="background-color:#F7F7F7;"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f7f7f7"></v:fill> </v:background><![endif]--> <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td valign="top" style="padding:0;Margin:0;"> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:10px;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="580" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:13px;color:#999999;">Put your preheader text here. <a href="https://esputnik.com/viewInBrowser" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;">View in browser</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td class="es-adaptive" align="center" style="padding:0;Margin:0;"> <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3D5CA3;" width="600" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#CCCCCC;" bgcolor="#cccccc" align="left"> <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="270" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0l es-m-txt-c" align="left" style="padding:0;Margin:0;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_7e1107c7fc040e7f9dcba390ed3579f1/images/50081558513219175.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="183" height="62.71"></td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="270" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="270" align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="https://ca.freeli.io/" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Login</a> </span> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FAFAFA;" width="600" cellspacing="0" cellpadding="0" bgcolor="#fafafa" align="center"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px;background-repeat:no-repeat;" align="left"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:20px;"> <h1 style="Margin:0;line-height:60px;mso-line-height-rule:exactly;font-family:lora, georgia, \'times new roman\', serif;font-size:50px;font-style:normal;font-weight:normal;color:#333333;"><em>Welcome</em></h1> </td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;"> <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#333333;">Thanks for joining with us.</h4> </td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:20px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;">Please click the button below to validate your account.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;">Your initial password is: <strong>'+ randompas +'</strong></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:4px;width:auto;"> <a href="https://ca.freeli.io/" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:10px 15px 10px 15px;display:inline-block;background:#FFFFFF;border-radius:4px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;">Login Now »</a> </span> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px;background-color:#F7C052;" bgcolor="#f7c052" align="left"> <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="202" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p0r es-m-p20b" width="182" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/39911527588288171.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-left:5px;padding-right:5px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">House #3D, Road #2A, Block - J, Baridhara.</p> </td> </tr> </table> </td> <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> </tr> </table> <!--[if mso]></td><td width="179" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> <tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/35681527588356492.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td esdev-links-color="#ffffff" align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#FFFFFF;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:18px;text-decoration:underline;color:#FFFFFF;" href="mailto:info@name.com">info@ca.freeli.</a>io</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td><td width="20"></td><td width="179" valign="top"><![endif]--> <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> <tr style="border-collapse:collapse;"> <td width="179" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-bottom:5px;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_66498ea076b5d00c6f9553055acdb37a/images/50681527588357616.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="24" height="24.30"></td> </tr> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-123-45-67<br></p> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#FFFFFF;">1-800-987-65-43</p> </td> </tr> </table> </td> </tr> </table> <!--[if mso]></td></tr></table><![endif]--> </td> </tr> </table> </td> </tr> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:13px;font-size:11px;color:#999999;"> <a target="_blank" href="http://viewstripo.email/?utm_source=templates&amp;utm_medium=email&amp;utm_campaign=education&amp;utm_content=trigger_newsletter" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:11px;text-decoration:underline;color:#3D5CA3;"> <img src="https://jydli.stripocdn.email/content/guids/CABINET_7e1107c7fc040e7f9dcba390ed3579f1/images/50081558513219175.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="125" height="42.84"> </a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </div> </body></html>'
    // };
    if(getuser.length){
      if(company.length){
        var flag = 1;
        _.forEach(getuser, function(v, k){
          if(company[0].company_id.toString() == v.company_id.toString()){
            // Already exists
            console.log(65, 'Email already registered in this company');
            req.session.error = [{msg: 'Email already registered in this company'}];
            req.session.success = false;
            res.redirect('/signup');
            flag = 0;
            return false;
          }
        });
        if(flag == 1){
          console.log(74, req.body.email);
          req.session.success = true;
          // Normal user
          user.access = na;
          user.role = "Normal User";
          user.company_id = company[0].company_id;
          user.saveAsync().then(function() {
              // email.send(data, (result)=>{
              //   if(result.msg == 'success'){
                    req.session.error = null;
                    res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
              //     }
              //   else
              //       res.redirect('/signup');
              // });
          }).catch(function(err) {
              console.log(err);
          });
        }
      }
      else{
        // supper admin access
        var comid = models.timeuuid();
        var comdata = new models.instance.Company({
          company_id: comid,
          company_name: req.body.company_name
        });
    
        comdata.saveAsync().then(function(){
          user.access = sa;
          user.role = "System Admin";
          user.company_id = comid;
          user.saveAsync().then(function() {
              // email.send(data, (result)=>{
                // console.log(result);
                // if(result.msg == 'success'){
                    var bq = [];
                    var sarole = new models.instance.Role({
                      role_id: models.timeuuid(),
                      created_by: uid,
                      role_title: "System Admin",
                      company_id: comid,
                      role_access: sa
                    });
                    bq.push(sarole.save({ return_query: true }));
                    var narole = new models.instance.Role({
                      role_id: models.timeuuid(),
                      created_by: uid,
                      role_title: "Normal User",
                      company_id: comid,
                      role_access: na
                    });
                    bq.push(narole.save({ return_query: true }));

                    models.instance.Company.update({company_id: comid, company_name: req.body.company_name}, {created_by: uid}, function(uperr){
                      if(uperr) console.log(uperr);
                      models.doBatch(bq, function(err){
                        if(err) console.log(124, err);
                      });
                      req.session.error = null;
                      res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
                    });
                  // }
                // else
                    // res.redirect('/signup');
              // });
          }).catch(function(err) {
              console.log(err);
          });
        });
      }
    }else{
      if(company.length){
        req.session.success = true;
        // Normal user
        user.access = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
        user.role = "Normal User";
        user.company_id = company[0].company_id;
        user.saveAsync().then(function() {
            // email.send(data, (result)=>{
            //   if(result.msg == 'success'){
                  req.session.error = null;
                  res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
            //     }
            //   else
            //       res.redirect('/signup');
            // });
        }).catch(function(err) {
            console.log(err);
        });
      }else{
        // supper admin access
        var comid = models.timeuuid();
        var comdata = new models.instance.Company({
          company_id: comid,
          company_name: req.body.company_name
        });
    
        comdata.saveAsync().then(function(){
          user.access = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500];
          user.role = "System Admin";
          user.company_id = comid;
          user.saveAsync().then(function() {
              // email.send(data, (result)=>{
                // console.log(result);
                // if(result.msg == 'success'){
                    var bq = [];
                    var sarole = new models.instance.Role({
                      role_id: models.timeuuid(),
                      created_by: uid,
                      role_title: "System Admin",
                      company_id: comid,
                      role_access: sa
                    });
                    bq.push(sarole.save({ return_query: true }));
                    var narole = new models.instance.Role({
                      role_id: models.timeuuid(),
                      created_by: uid,
                      role_title: "Normal User",
                      company_id: comid,
                      role_access: na
                    });
                    bq.push(narole.save({ return_query: true }));
                    models.instance.Company.update({company_id: comid, company_name: req.body.company_name}, {created_by: uid}, function(uperr){
                      if(uperr) console.log(uperr);
                      models.doBatch(bq, function(err){
                        if(err) console.log(124, err);
                      });
                      req.session.error = null;
                      res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
                    });
                  // }
                // else
                    // res.redirect('/signup');
              // });
          }).catch(function(err) {
              console.log(err);
          });
        });
      }
    }
  }
});


router.get('/signup_mailing', function(req, res, next) {
    if (req.session.login) {
        res.redirect('/alpha2');
    } else {
        res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false });
        req.session.error = null;
    }
});


router.get('/verify/:id?/:convid?', function(req, res, next) {
  console.log(231, req.params);
  if(req.params.id == '' || req.params.id === undefined){
    res.redirect('/');
  }else if(req.session.login){
    res.redirect('/alpha2');
  } else if(isUuid(req.params.id)) {
    try{
      if(req.params.convid !== undefined && isUuid(req.params.convid) && req.params.id !== undefined && isUuid(req.params.id)){
        signup_utils.update_invite_link({conversation_id: req.params.convid, id: req.params.id, status: "Accepted"});
      }
      req.session.email_link_conversation = req.params.convid;
      models.instance.Users.findOne({id: models.uuidFromString(req.params.id)}, function(err, user){
        if(err) throw err;
        var names = user.fullname.split(" ");
        res.render('signup_verify', { page_title:'Signup | NEC',title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: user.email, fname: names[0], lname: user.fullname.replace(names[0], '').trim() });
        req.session.error = null;
      });
    }catch(e){
      res.redirect('/');
    }
  }
});

router.post('/pass_set', function(req, res, next){
  console.log(251, req.body);
  req.session.loading_msg = "";
  if(req.body.id != undefined && isUuid(req.body.id) && req.body.pass != '' && req.body.pass2 != '' && req.body.pass == req.body.pass2){
    try{
      models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {password: passwordToHass(req.body.pass)}, update_if_exists, function(error){
        req.session.loading_msg = "Password has been changed sucessfully.";
        // res.redirect('/');
        res.json({status: true})
      });
    }catch(e){
      console.log(264, e)
      // req.session.cpmsg = "Password changed unexpected error.";
      res.json({status: false, error: e})
      // res.redirect('/');
    }
  }else{
    // req.session.cpmsg = "Password changed error.";
    // res.redirect('/');
    res.json({status: false, error: "Password changed error."})
  }
});

router.get('/loading', function(req, res, next){
  var loading_msg = (req.session.loading_msg != "Password has been changed sucessfully.") ? "" : req.session.loading_msg;
  res.render('loading_guest', { page_title:'Signup | Completed',title: 'Signup | Completed', bodyClass: 'centered-form', loading_msg: loading_msg, success: req.session.success, error: req.session.error, has_login: false });
});

module.exports = router;
