var express = require('express');
var router = express.Router();
var _ = require('lodash');

var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {signup_utils} = require('./../utils/signup_utils');
var {sg_email} = require('../utils/sg_email');

/* GET forgot password listing. */
router.get('/', function(req, res, next) {
    if(req.session.login){
        res.redirect('/alpha2');
    } else{
        res.render('forgot-pass', { page_title:'Signup | NEC',title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, _:_ });
        req.session.error = null;
    }
});

/* POST forgot-password listing. */
router.post('/', async function(req, res, next) {
    if(req.session.login){
        res.redirect('/alpha2');
    } else {
        req.check('email', 'Invalid email address').isEmail();
        // req.check('company_name', 'Company name is required').isLength({min:3}).trim();
        console.log(27, req.body);
        var error = req.validationErrors();
        if(error) {
            req.session.error = error;
            req.session.success = false;
            res.redirect('/');
        }
        else{
            try{
                models.instance.Users.find({email: req.body.email}, {raw:true, allow_filtering: true}, function(err, user){
                    if(err) throw err;
                    if(user.length > 0){
                        models.instance.EmailFormat.find({company_id: user[0].company_id}, {raw:true, allow_filtering:true}, function(err, formats){
                            if(err) throw err;

                            var baseurl = process.env.BASE_URL;
                            var bodyhtml = "Please go to below link to reset your password.";
                            if(formats.length>0){
                                _.forEach(formats, function(v, k){
                                    if(v.email_type == 'forgot'){
                                        bodyhtml = v.format_text.replace('[[gn]]', user[0].fullname);
                                        bodyhtml = bodyhtml.replace('[[rl]]', '<a style="text-decoration: none;width: 322px;border-radius: 4px;border: none;color: #ffffff;font-size: 18px;font-weight: 600;line-height: 21px;text-align: center;background-color: #023d67;padding: 10px 25px;" href="'+ baseurl +'forgot-password/reset-email/'+ user[0].id +'/'+ user[0].company_id +'">Reset Password</a>');
                                    }
                                });
                            }
        
                            var emaildata = {
                                to: user[0].email,
                                bcc: 'mahfuzak08@gmail.com',
                                subject: 'Workfreeli password reset link',
                                text: 'Please go to below link to reset your password.',
                                html: bodyhtml
                            }
                            console.log(emaildata);
                            sg_email.send(emaildata, (result)=>{
                                if(result.msg == 'success'){
                                    req.session.error = null;
                                    res.render('reset-email-send', { page_title:'Reset email send', title: 'Reset email send', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, email: req.body.email });
                                }
                                else throw result;
                            });
                        });
                    }else{
                        req.session.error = "No user found.";
                        req.session.success = false;
                        res.redirect('/forgot-password');
                    }
                });
            }catch(e){
                console.log(66, e);
                req.session.error = e;
                req.session.success = false;
                res.redirect('/forgot-password');
            }
        }
    }

});

router.get('/reset-email/:id/:comid', function(req, res, next){
    try{
        models.instance.Users.find({id: models.uuidFromString(req.params.id)}, function(err, user){
            if(user.length == 1){
                res.render('set-new-password', { page_title:'Reset Password', title: 'Reset Password', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, id: req.params.id, comid: req.params.comid, email: user[0].email });
                req.session.error = null;
            }
        });
    }catch(e){
        req.session.error = e;
        res.redirect('/');
    }
});

router.post('/set-new-password', function(req, res, next){
    if(req.session.login){
        res.redirect('/alpha2');
    } else {
        try{
            req.assert('conpass', 'Passwords do not match').equals(req.body.newpass);
            var error = req.validationErrors();
            if(error) throw error;

            models.instance.Users.find({email: req.body.email}, {raw:true, allow_filtering: true}, function(err, user){
                if(err) throw err;
                if(user.length > 1){
                    _.forEach(user, function(v, k){
                        models.instance.Users.update({id: v.id}, {password: passwordToHass(req.body.newpass)}, update_if_exists, function(e){
                            if(e) throw e;
                            else if(user.length == k+1){
                                res.render('reset-successfull', { page_title: 'Reset Successfull', title: 'Reset Successfull', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false });
                            }
                        });    
                    });
                } else if(user.length == 1){
                    models.instance.Users.update({id: models.uuidFromString(req.body.id)}, {password: passwordToHass(req.body.newpass)}, update_if_exists, function(e){
                        if(e) throw e;
                        else{
                            res.render('reset-successfull', { page_title: 'Reset Successfull', title: 'Reset Successfull', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false });
                        }
                    });
                }
            });
    
        }catch(e){
            req.session.success = false;
            req.session.error = e;
            res.redirect('/reset-email/'+ req.body.id +'/' + req.body.comid);
        }
    }
});
module.exports = router;