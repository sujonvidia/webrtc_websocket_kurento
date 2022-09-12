var express = require('express');
var router = express.Router();
var _ = require('lodash');
const isUuid = require('uuid-validate');
var MobileDetect = require('mobile-detect');
var {models} = require('../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('../utils/hassing');
var {email} = require('../utils/email');
var {signup_utils} = require('../utils/signup_utils');


var server_address = process.env.BASE_URL+'login/';
/* POST signup listing. */
router.post('/', async function(req, res, next) {
  if(req.session.login){
    res.redirect('/alpha2');
  } else {
    if(req.body.account_type == "Social" && req.body.company_name == "") req.body.company_name = "Social@"+ new Date().getTime();
    req.check('first_name', 'First name is required').isLength({ min:1 }).trim();
    req.check('last_name', 'Last name is required').isLength({ min:1 }).trim();
    req.check('email', 'Invalid email address').isEmail();
    req.check('company_name', 'Company name is required').isLength({min:3}).trim();
    
    // req.check('email', 'Email already registered').custom(email => alreadyHaveEmail(email));
    // req.check('password', 'Password should be at least 6 characters.').isLength({ min: 6 }).trim();
    //req.check('phone_Number', 'Phone Number').trim();

    var randompas = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
    var md5pass = Buffer.from(randompas).toString('base64');
    // var randompas = 123456;
    var sa = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500];
    var na = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
    var getuser = await signup_utils.check_email(req.body.email);
    var company_id = "";
    if(isUuid(req.body.company_name)){
      company_id = models.timeuuidFromString(req.body.company_name);
    }else{
      var company = await signup_utils.check_company(req.body.company_name);
      if(company.length > 0)
        company_id = company[0].company_id;
    }
    console.log(39, company_id);
    var uid = models.uuid();
    var user = new models.instance.Users({
      id: uid,
      email: req.body.email,
      fullname: req.body.first_name + ' ' + req.body.last_name,
      password: passwordToHass(randompas.toString()),
      dept: (req.body.account_type == "Social") ? "Social" : "Business",
      designation: req.body.phone == undefined ? '' : req.body.phone,
      img: 'img.png',
      created_by:uid.toString(),
        conference_id : models.timeuuid().toString() + '_personal'
    });

    var emaildata = {
      // to: [req.body.email],
      to: ['msrkhokoncse@gmail.com'],
      // to: ['mahfuzak08@gmail.com'],
      sub: 'Login info from bd freeli',
      text: 'Login info from bd freeli. Your password is: ' + randompas
    }
    
    if(getuser.length){
      var em = Buffer.from(req.body.email).toString('base64');
      var name = Buffer.from(req.body.first_name + ' ' + req.body.last_name).toString('base64');
      var now = new Date();
      var time = Math.round(now.getTime() / 1000);
      var ex = time + 24*60*60;
      if(company_id != ""){
        var flag = 1;
        _.forEach(getuser, function(v, k){
          if(company_id.toString() == v.company_id.toString()){
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
          req.session.success = true;
          emaildata.msghtml = '<html><body><p>Welcome to bd freeli.<br>Your password is: <b>'+ randompas + '</b></p>'+
                              '<p>Please <a href="'+ server_address + em +'/'+ name +'/'+company_id+'/'+ md5pass + '/' + ex +'">Login Now</a></p>'+
                              '<p>Thanks<br>Freeli Team</p></body></html>';
          email.send(emaildata, (result)=>{
            if(result.msg == 'success'){
                req.session.error = null;
                res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
              }
            else
                res.redirect('/signup');
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
        console.log(109, comdata);
        comdata.saveAsync().then(function(){
          emaildata.msghtml = '<html><body><p>Welcome to bd freeli.<br>Your password is: <b>'+ randompas + '</b></p>'+
                              '<p>Please <a href="'+ server_address + em +'/'+ name +'/'+comid+ '/'+ md5pass + '/' + ex +'">Login Now</a></p>'+
                              '<p>Thanks<br>Freeli Team</p></body></html>';
          email.send(emaildata, (result)=>{
                  req.session.error = null;
                  console.log(116)
                  res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
          });
        }).catch((e)=>{
          console.log(e);
        });
      }
      // if(company_id != ""){
      //   var flag = 1;
      //   _.forEach(getuser, function(v, k){
      //     if(company_id.toString() == v.company_id.toString()){
      //       // Already exists
      //       console.log(65, 'Email already registered in this company');
      //       req.session.error = [{msg: 'Email already registered in this company'}];
      //       req.session.success = false;
      //       res.redirect('/signup');
      //       flag = 0;
      //       return false;
      //     }
      //   });
      //   if(flag == 1){
      //     console.log(74, req.body.email);
      //     req.session.success = true;
      //     // Normal user
      //     user.access = na;
      //     user.role = "Normal User";
      //     user.company_id = company_id;
      //     user.saveAsync().then(function() {
      //         email.send(emaildata, (result)=>{
      //           if(result.msg == 'success'){
      //               req.session.error = null;
      //               res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
      //             }
      //           else
      //               res.redirect('/signup');
      //         });
      //     }).catch(function(err) {
      //         console.log(err);
      //     });
      //   }
      // }
      // else{
      //   // supper admin access
      //   var comid = models.timeuuid();
      //   var comdata = new models.instance.Company({
      //     company_id: comid,
      //     company_name: req.body.company_name
      //   });
    
      //   comdata.saveAsync().then(function(){
      //     user.access = sa;
      //     user.role = "System Admin";
      //     user.company_id = comid;
      //     user.saveAsync().then(function() {
      //         email.send(emaildata, (result)=>{
      //           console.log(result);
      //           if(result.msg == 'success'){
      //               var bq = [];
      //               var sarole = new models.instance.Role({
      //                 role_id: models.timeuuid(),
      //                 created_by: uid,
      //                 role_title: "System Admin",
      //                 company_id: comid,
      //                 role_access: sa
      //               });
      //               bq.push(sarole.save({ return_query: true }));
      //               var narole = new models.instance.Role({
      //                 role_id: models.timeuuid(),
      //                 created_by: uid,
      //                 role_title: "Normal User",
      //                 company_id: comid,
      //                 role_access: na
      //               });
      //               bq.push(narole.save({ return_query: true }));

      //               models.instance.Company.update({company_id: comid, company_name: req.body.company_name}, {created_by: uid}, function(uperr){
      //                 if(uperr) console.log(uperr);
      //                 models.doBatch(bq, function(err){
      //                   if(err) console.log(124, err);
      //                 });
      //                 req.session.error = null;
      //                 res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
      //               });
      //             }
      //           else
      //               res.redirect('/signup');
      //         });
      //     }).catch(function(err) {
      //         console.log(err);
      //     });
      //   });
      // }
    }else{
      if(company_id != ""){
        req.session.success = true;
        // Normal user
        user.access = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
        user.role = "Normal User";
        user.company_id = company_id;
        user.saveAsync().then(function() {
            email.send(emaildata, (result)=>{
              if(result.msg == 'success'){
                  req.session.error = null;
                  res.render('signup_mailing', {page_title:'Signup', title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
                }
              else
                  res.redirect('/signup');
            });
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
              email.send(emaildata, (result)=>{
                console.log(result);
                if(result.msg == 'success'){
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
                  }
                else
                    res.redirect('/signup');
              });
          }).catch(function(err) {
              console.log(err);
          });
        });
      }
    }
  }
});
router.post('/login', async function(req, res, next) {
  if(req.session.login){
    res.redirect('/alpha2');
  } else {
    req.check('name', 'Name is required').isLength({ min:1 }).trim();
    req.check('email', 'Invalid email address').isEmail();
    req.check('company_name', 'Company name is required').isLength({min:3}).trim();
    
    var sa = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500];
    var na = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
    if(req.body.password == Buffer.from(req.body.pass, 'base64').toString('ascii')){
      // console.log(284, req.body);
      var getuser = await signup_utils.check_email(req.body.email);
      var company = await signup_utils.check_company_id(req.body.company_name);
      req.session.success = true;
      var uid = models.uuid();
      var allpass = passwordToHass(req.body.password.toString());
      var user = new models.instance.Users({
        id: uid,
        company_id: company.company_id,
        email: req.body.email,
        fullname: req.body.name,
        password: allpass,
        dept: (req.body.account_type == undefined) ? "Business" : req.body.account_type,
        designation: req.body.phone == undefined ? '' : req.body.phone,
        img: 'img.png',
        access: (company.created_by == null) ? sa : na,
        role: (company.created_by == null) ? 'System Admin' : 'Normal User',
        conference_id : models.timeuuid().toString() + '_personal',
        login_total:1,
        created_by:uid.toString(),
        last_login:new Date()
      });
    
      user.saveAsync().then(function() {
        if(company.created_by == null){
          models.instance.Company.update({company_id: company.company_id, company_name: company.company_name}, {created_by: uid}, update_if_exists, function(uperr){
            if(uperr) console.log(315, uperr);
          });

          var bq = [];
          var sarole = new models.instance.Role({
            role_id: models.timeuuid(),
            created_by: uid,
            role_title: "System Admin",
            company_id: company.company_id,
            role_access: sa
          });
          bq.push(sarole.save({ return_query: true }));
          var narole = new models.instance.Role({
            role_id: models.timeuuid(),
            created_by: uid,
            role_title: "Normal User",
            company_id: company.company_id,
            role_access: na
          });
          bq.push(narole.save({ return_query: true }));

          models.doBatch(bq, function(err){
            if(err) console.log(124, err);
          });
        }

        signup_utils.change_all_pass(req.body.email, allpass, (change_res)=>{
          console.log(342, change_res);
        });
        req.session.success = true;
        req.session.login = true;
        req.session.user_id = _.replace(user.id, 'Uuid: ', '');
        req.session.user_fullname = user.fullname;
        req.session.user_email = user.email;
        req.session.user_img = user.img;
        req.session.company_id = user.company_id.toString();
        req.session.cpmsg = '';
        if(req.body.password == '123456')
          req.session.cpa = true;
        else
          req.session.cpa = false;
        
        req.session.login_total = 0;
        
        userCompany_id[req.session.user_id] = user.company_id.toString();
        var md = new MobileDetect(req.headers['user-agent']);
        var os = md.os();
        
        if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS')
          res.redirect('/connect');
        else
          res.redirect('/alpha2');
        
      }).catch(function(err) {
          console.log(err);
      });
      
    }
    else{
      res.status(404).send({"message": "Password not match. Please try your email link again."});
    }
  }
});

module.exports = router;
