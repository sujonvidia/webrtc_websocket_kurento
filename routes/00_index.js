var express = require('express');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var router = express.Router();
var MobileDetect = require('mobile-detect');


var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {signup_utils} = require('./../utils/signup_utils');
var {
	get_busyData,
  getRoomInfoUser
} = require('./../utils/voice_video');
var {generateMessage, sendNewMsg, sendBusyMsg, commit_msg_delete, flag_unflag, add_reac_emoji} = require('./../utils/message');

// console.log ( ip.address() );


/* GET login page. */
router.get('/', function(req, res, next) {
  var md = new MobileDetect(req.headers['user-agent']);
  var os = md.os();
  var eee = req.session.error;
  req.session.error = [];
  req.session.temp_email = "";
  req.session.temp_password = "";
  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
    if(req.session.login){
      res.redirect('/connect');
    } else {
      res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }else{
    if(req.session.login){
      res.redirect('/alpha2');
    } else {
      res.render('index', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }
});



/* GET Auto login page. */
// router.get('/al', function (req, res, next) {
//   if (req.session.login) {
//     res.redirect('/alpha2');
//   } else {
//     res.render('autologin');
//   }
// });

/* POST login listing. */
router.post('/', function(req, res, next) {
  if(req.session.login){
    var md = new MobileDetect(req.headers['user-agent']);
    var os = md.os();
    if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
      res.redirect('/connect');
    else
      res.redirect('/alpha2');
  } else {
    models.instance.Users.find({email: req.body.email.trim(), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
        if(err) throw err;
        //getuser is an array of plain objects with only name and age
        if(getuser.length == 1){
          if(getuser[0].is_active == 1){
            if(passwordToCompare(req.body.password, getuser[0].password)) {
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = _.replace(getuser[0].id, 'Uuid: ', '');
              req.session.user_fullname = getuser[0].fullname;
              req.session.user_email = getuser[0].email;
              req.session.user_img = getuser[0].img;
              req.session.company_id = getuser[0].company_id.toString();
              if(getuser[0].login_total == null)
                req.session.login_total = 0;
              else
                req.session.login_total = getuser[0].login_total;
              
							userCompany_id[req.session.user_id] = getuser[0].company_id.toString();
              // getRoomInfoUser(getuser[0].id.toString(), async (error, iscall, roomname) => {
                // if (iscall == false) 
                // await del_busyData(getuser[0].id.toString());
              // });
              // sendBusyMsg({user_id:getuser[0].id,is_busy:0}, (result) =>{
                // if(result.status){
                  var md = new MobileDetect(req.headers['user-agent']);
                  var os = md.os();
                  if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:1,last_login:new Date()});
                  }else{
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:(getuser[0].login_total+1),last_login:new Date()});

                  }
                  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
                    res.redirect('/connect');
                  else
                    res.redirect('/alpha2');
                // }
              // });
            } else {
              req.session.success = false;
              // req.session.error = [{ msg: 'Username or Password or both are Invalid.' }];
              req.session.error = [{ msg: 'Invalid login information.' }];
              res.redirect('/');
            }
          } else {
            req.session.success = false;
            req.session.error = [{ msg: 'User is deactive or deleted. Please contact with admin.' }];
            res.redirect('/');
          }
        } 
        else if(getuser.length > 1){
          req.session.success = true;
          req.session.temp_email = req.body.email;
          req.session.temp_password = req.body.password;
          req.session.invalid_login = 0;
          req.session.comid = 0;
          res.redirect('/company');
        }
        else {
          req.session.success = false;
          // req.session.error = [{ msg: 'Username invalid.' }];
          req.session.error = [{ msg: 'Invalid login information.' }];
          res.redirect('/');
        }
    });
  }
});

/* GET company selection page. */
router.get('/company', async function(req, res, next) {
  var md = new MobileDetect(req.headers['user-agent']);
  var os = md.os();
  var eee = req.session.error;
  req.session.error = [];
  var companies = await signup_utils.get_company_by_user_email(req.session.temp_email);
  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
    if(req.session.login){
      res.redirect('/connect');
    } else {
      res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }else{
    if(req.session.login){
      res.redirect('/alpha2');
    } else {
      res.render('company_options', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false, company: companies, need_password: req.session.invalid_login, comid: req.session.comid });
    }
  }
});

/* POST company listing. */
router.post('/company', function(req, res, next) {
  if(req.session.login){
    var md = new MobileDetect(req.headers['user-agent']);
    var os = md.os();
    if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
      res.redirect('/connect');
    else
      res.redirect('/alpha2');
  } else {
    models.instance.Users.find({email: req.session.temp_email, company_id: models.timeuuidFromString(req.body.company_name), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
        if(err) throw err;
        
        if(getuser.length == 1){
          if(getuser[0].is_active == 1){
            var pass = req.body.pass == "" ? req.session.temp_password : req.body.pass;
            if(passwordToCompare(pass, getuser[0].password)) {
              // if(req.body.pass != ""){

              // }
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = _.replace(getuser[0].id, 'Uuid: ', '');
              req.session.user_fullname = getuser[0].fullname;
              req.session.user_email = getuser[0].email;
              req.session.user_img = getuser[0].img;
              req.session.company_id = getuser[0].company_id.toString();
              if(getuser[0].login_total == null)
                req.session.login_total = 0;
              else
                req.session.login_total = getuser[0].login_total;
              
							userCompany_id[req.session.user_id] = getuser[0].company_id.toString();
              // getRoomInfoUser(getuser[0].id.toString(), async (error, iscall, roomname) => {
                // if (iscall == false) 
                // await del_busyData(getuser[0].id.toString());
              // });
              // sendBusyMsg({user_id:getuser[0].id,is_busy:0}, (result) =>{
                // if(result.status){
                  var md = new MobileDetect(req.headers['user-agent']);
                  var os = md.os();
                  if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:1,last_login:new Date()});
                  }else{
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:(getuser[0].login_total+1),last_login:new Date()});

                  }
                  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
                    res.redirect('/connect');
                  else
                    res.redirect('/alpha2');
                    // res.redirect('/settings');
                    
                // }
              // });
            } else {
              req.session.success = false;
              // req.session.error = [{ msg: 'Username or Password or both are Invalid.' }];
              req.session.error = [{ msg: 'Invalid login information.' }];
              req.session.invalid_login += 1;
              req.session.comid = req.body.company_name;
              if(req.session.invalid_login > 3)
                res.redirect('/');
              else
                res.redirect('/company');
            }
          } else {
            req.session.success = false;
            req.session.error = [{ msg: 'User is deactive or deleted. Please contact with admin.' }];
            res.redirect('/');
          }
        }
        else {
          req.session.success = false;
          // req.session.error = [{ msg: 'Username invalid.' }];
          req.session.error = [{ msg: 'Invalid login information.' }];
          res.redirect('/');
        }
    });
  }
});

module.exports = router;
