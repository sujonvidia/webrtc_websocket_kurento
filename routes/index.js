var express = require('express');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var router = express.Router();
var MobileDetect = require('mobile-detect');
var fs = require('fs');
const axios = require('axios');
const isUuid = require('uuid-validate');

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
  console.log("process.env.BASE_URL = ", process.env.BASE_URL);
  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    } else {
      res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }else{ // web
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    } else {
      res.render('index', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }
});
/* GET login page from email link. */
router.get('/loginwith/:id/:convid', function(req, res, next) {
  var md = new MobileDetect(req.headers['user-agent']);
  var os = md.os();
  var eee = req.session.error;
  req.session.error = [];
  req.session.temp_email = "";
  req.session.temp_password = "";
  if(req.params.convid !== undefined && isUuid(req.params.convid) && req.params.id !== undefined && isUuid(req.params.id)){
    signup_utils.update_invite_link({conversation_id: req.params.convid, id: req.params.id, status: "Accepted"});
    req.session.email_link_conversation = req.params.convid;
  }
  console.log("process.env.BASE_URL = ", process.env.BASE_URL);
  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    } else {
      res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }else{ // web
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    } else {
      res.render('index', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }
});

const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

/* GET Custom Url page. */
router.get('/url/:id', async function(req, res, next) {
  var rawdata = fs.readFileSync('./URL_Data.json');
  var allUrl = JSON.parse(rawdata);
  var adr = allUrl[req.params.id];
  if(typeof(allUrl[req.params.id]) !== 'undefined'){
    adr = allUrl[adr]['url'];
    // res.redirect(allUrl[req.params.id]);
    // var datA = await getScript(allUrl[req.params.id]);
    var type = '';
    if(adr.indexOf('Photos') > -1){
      type = 'Photos';
    }else if(adr.indexOf('Videos') > -1){
      type = 'Videos';
    }else if(adr.indexOf('Music') > -1){
      type = 'Music';
    }else if(adr.indexOf('Others') > -1){
      type = 'Others';
    }
    console.log(type);
    if(type == ''){
      res.redirect(allUrl[req.params.id]);
    }else{
      let newUrl = adr.split('/');
      newUrl = newUrl[newUrl.length - 1];
      models.instance.File.findOne({key:newUrl},{allow_filtering:true,raw:true},function(err,result){
        if(err){
          res.render('customHtml',{type:'notfound',url:'adr'});
        }else{
          console.log(192,result)
          if(result){
            if(result.is_delete == 1){
              res.render('customHtml',{type:'notfound',url:'adr'});
            }else{
              res.render('customHtml',{type:type,url:adr});
            }
          }else{
            res.render('customHtml',{type:'notfound',url:'adr'});
          }
        }
      });
    }
  }else{
    res.render('customHtml',{type:'notfound',url:'adr'});
  }
});

router.get('/login/:email/:name/:company_id/:pass/:ex', function(req, res, next) {
  var md = new MobileDetect(req.headers['user-agent']);
  var os = md.os();
  var eee = req.session.error;
  req.session.error = [];
  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    } else {
      res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
    }
  }else{ // web
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    } else {
      var now = new Date();
      var time = Math.round(now.getTime() / 1000);
      if(time < req.params.ex && req.params.email != undefined && req.params.company_id != undefined && req.params.pass != undefined){
        res.render('index2', { 
          title: 'Freeli | Sign In', 
          page_title:'Workfreeli | Sign In', 
          bodyClass: 'centered-form', 
          success: req.session.success, 
          error: eee, 
          has_login: false,
          name: Buffer.from(req.params.name, 'base64').toString('ascii'),
          email: Buffer.from(req.params.email, 'base64').toString('ascii'),
          comid: req.params.company_id,
          pass: req.params.pass
        });
      }
      else{
        res.render('index', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
      }
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
    if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){ // mobile
      if(req.session.user_role == 'Parent User'){
        res.redirect('/covid/mobile'); 
      } 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    }
    else{ // web
      if(req.session.user_role == 'Parent User'){
        res.redirect('/covid/mobile'); 
      } 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    }
  } else {
    models.instance.Users.find({email: req.body.email.trim(), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
        if(err) throw err;
        //getuser is an array of plain objects with only name and age
        if(getuser.length == 1){
          if(getuser[0].is_active == 1){
            if(passwordToCompare(req.body.password, getuser[0].password)) {
              if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
                if(req.body.first_name === undefined || req.body.first_name == '' || req.body.last_name === undefined || req.body.last_name == ''){
                  if(getuser[0].fullname == ""){
					req.session.success = false;
					req.session.error = [{ msg: 'Invalid login information.' }];
					res.redirect('/');
				  }
                }else{
                  getuser[0].fullname = req.body.first_name + ' ' + req.body.last_name;
                }
              }
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = _.replace(getuser[0].id, 'Uuid: ', '');
              req.session.user_fullname = getuser[0].fullname;
              req.session.user_email = getuser[0].email;
              req.session.user_img = getuser[0].img;
              req.session.user_role = getuser[0].role;
              req.session.company_id = getuser[0].company_id.toString();
              req.session.parent_list = getuser[0].parent_list;
              req.session.student_list = getuser[0].student_list;
              req.session.cpmsg = '';
              if(req.body.password == '123456')
                req.session.cpa = true;
              else
                req.session.cpa = false;
              if(getuser[0].login_total == null)
                req.session.login_total = 0;
              else
                req.session.login_total = getuser[0].login_total;
              
							userCompany_id[req.session.user_id] = getuser[0].company_id.toString();
              // let iscall = await getRoomInfoUser(getuser[0].id.toString());
              // if (iscall == false) //await del_busyData(getuser[0].id.toString());
              // sendBusyMsg({user_id:getuser[0].id,is_busy:0}, (result) =>{
                // if(result.status){
                  var md = new MobileDetect(req.headers['user-agent']);
                  var os = md.os();
                  if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{fullname: getuser[0].fullname, login_total:1,last_login:new Date()});
                  }else{
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:(getuser[0].login_total+1),last_login:new Date()});

                  }
                  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
                    if(req.session.user_role == 'Parent User'){
                      res.redirect('/covid/mobile'); 
                    } 
                    else if(req.session.user_role == 'Student User'){
                      res.redirect('/covid/mobile');
                      // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
                    }
                    else if(req.session.user_role == 'Stuff User'){
                      res.redirect('/covid/mobile');
                    }
                    else if(req.session.user_role == 'Admin User'){
                      res.redirect('/covid/mobile');
                    }
                    else{
                      res.redirect('/connect');
                    }
                    // res.redirect('/connect');
                  } // web
                  else if(req.body.guest_signup !== undefined && req.body.guest_signup == '1'){
                    res.render('change_pass', { page_title:'Set Password',title: 'Set Password', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, id: getuser[0].id });
                  }
                  else if(req.session.user_role == 'Parent User'){
                    res.redirect('/covid/mobile');
                  }
                  else if(req.session.user_role == 'Student User'){
                    
                      res.redirect('/covid/mobile');
                    // }else{
                      // res.redirect('/covid/signup/'+String(getuser[0].id)+'/'+String(getuser[0].company_id));
                    // }
                  }
                  else if(req.session.user_role == 'Stuff User'){
                    res.redirect('/covid/mobile');
                  }
                  else if(req.session.user_role == 'Admin User'){
                    res.redirect('/covid/mobile');
                  }
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
          if(req.body.password == '123456')
            req.session.cpa = true;
          else
            req.session.cpa = false;
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
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    } else {
      res.render('mob_com_options', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false, company: companies });
    }
  }else{ // web
    if(req.session.login){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    } else {
      res.render('company_options', { title: 'Freeli | Sign In', page_title:'Workfreeli | Sign In', bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false, company: companies });
    }
  }
});

/* POST company listing. */
router.post('/company', function(req, res, next) {
  if(req.session.login){
    var md = new MobileDetect(req.headers['user-agent']);
    var os = md.os();
    if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/connect');
      }
      // res.redirect('/connect');
    }
    else{ // web
      if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
      else if(req.session.user_role == 'Student User'){
        
        res.redirect('/covid/mobile');
        // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
      }
      else if(req.session.user_role == 'Stuff User'){
        res.redirect('/covid/mobile');
      }
      else if(req.session.user_role == 'Admin User'){
        res.redirect('/covid/mobile');
      }
      else{
        res.redirect('/alpha2');
      }
      // res.redirect('/alpha2');
    }
  } else {
    models.instance.Users.find({email: req.session.temp_email, company_id: models.timeuuidFromString(req.body.company_name), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
        if(err) throw err;
        
        if(getuser.length == 1){
          if(getuser[0].is_active == 1){
            if(passwordToCompare(req.session.temp_password, getuser[0].password)) {
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = _.replace(getuser[0].id, 'Uuid: ', '');
              req.session.user_fullname = getuser[0].fullname;
              req.session.user_email = getuser[0].email;
              req.session.user_img = getuser[0].img;
              req.session.user_role = getuser[0].role;
              req.session.company_id = getuser[0].company_id.toString();
              req.session.parent_list = getuser[0].parent_list;
              req.session.student_list = getuser[0].student_list;
              if(getuser[0].login_total == null)
                req.session.login_total = 0;
              else
                req.session.login_total = getuser[0].login_total;
              
							userCompany_id[req.session.user_id] = getuser[0].company_id.toString();
              // let iscall = await getRoomInfoUser(getuser[0].id.toString());
              // if (iscall == false) //await del_busyData(getuser[0].id.toString());
              // sendBusyMsg({user_id:getuser[0].id,is_busy:0}, (result) =>{
                // if(result.status){
                  var md = new MobileDetect(req.headers['user-agent']);
                  var os = md.os();
                  if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:1,last_login:new Date()});
                  }else{
                    models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:(getuser[0].login_total+1),last_login:new Date()});

                  }
                  if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
                    if(req.session.user_role == 'Parent User') res.redirect('/covid/mobile'); 
                    else if(req.session.user_role == 'Student User'){
                      res.redirect('/covid/mobile');
                      // else res.redirect('/covid/signup/'+req.session.user_id+'/'+req.session.company_id); 
                    }
                    else if(req.session.user_role == 'Stuff User'){
                      res.redirect('/covid/mobile');
                    }
                    else if(req.session.user_role == 'Admin User'){
                      res.redirect('/covid/mobile');
                    }
                    else{
                      res.redirect('/connect');
                    }
                    // res.redirect('/connect');
                  } // web
                  else if(getuser[0].role == 'Parent User'){
                    req.session.student_list = getuser[0].student_list;
                    res.redirect('/covid/mobile');
                  }
                  else if(getuser[0].role=='Student User'){
                    if(getuser[0].parent_list){
                      req.session.parent_list = getuser[0].parent_list;
                      res.redirect('/covid/mobile');
                    }
                    else if(req.session.user_role == 'Stuff User'){
                      res.redirect('/covid/mobile');
                    }
                    else if(req.session.user_role == 'Admin User'){
                      res.redirect('/covid/mobile');
                    }
                    else{
                      res.redirect('/covid/mobile');
                      // res.redirect('/covid/signup/'+String(getuser[0].id)+'/'+String(getuser[0].company_id));
                    }
                  }
                  else
                    res.redirect('/alpha2');
                    // res.redirect('/settings');
                    
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
