var express = require('express');
var router = express.Router();
var _ = require('lodash');

var {models} = require('../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('../utils/hassing');
var {email} = require('../utils/email');
var {signup_utils} = require('../utils/signup_utils');

/* GET signup listing. */
router.get('/:type/:em/:com', function(req, res, next) {
  if(req.session.login){
    // models.instance.Company.find({$limit:1000}, function(error, data){
      res.render('signup_invite', { 
        page_title:'Invite | NEC',
        title: 'Signup | NEC', 
        bodyClass: 'centered-form', 
        success: req.session.success, 
        error: req.session.error, 
        has_login: false,
        type: req.params.type,
        email: req.params.em,
        comid: req.params.com
      });
      req.session.error = null;
    // });
  } else {
    res.redirect('/');
  }
});

router.post('/', function(req, res, next){
  _.forEach(req.body.inviteEmail, function(v, k){
    if(v != ""){
      var url = process.env.BASE_URL+'signup_'+ req.body.type +'_account/' + v + '/' + req.body.invite_by_comid;
      console.log(url);
      var data = {
        // to: [v],
        to: ['msrkhokoncse@gmail.com'],
        sub: 'Invitation from bd freeli',
        text: 'Invitation from bd freeli.',
        msghtml: "<html><body><p>Dear "+v+",<br>You are invited by "+ req.body.invite_by_email +" from bd freeli.</p><br><a href='"+ url +"'>Signup now</a><p>"+ req.body.message +"</p><br><br>Thanks<br><b>Freeli Team</b></body></html>"
      };
  
      email.send(data, function(result){ console.log(40, result) });
    }
    if(req.body.inviteEmail.length == k+1){
      res.send('<script>window.close()</script>');
    }
  });
  
  // console.log(req.body.inviteEmail);
  // res.json({
  //   sender: req.body.invite_by_email,
  //   sender_comid: req.body.invite_by_comid,
  //   email: req.body.inviteEmail,
  // });
});

module.exports = router;
