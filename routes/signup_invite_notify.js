var express = require('express');
var router = express.Router();
var _ = require('lodash');

var {models} = require('../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('../utils/hassing');
var {email} = require('../utils/email');
var {signup_utils} = require('../utils/signup_utils');

/* GET signup listing. */
router.get('/:em?', function(req, res, next) {
  if(req.session.login){
    res.redirect('/alpha2');
  } else {
    models.instance.Company.find({$limit:1000}, function(error, data){
      res.render('signup_invite_notify', { page_title:'Invite notifications | NEC',title: 'Signup | NEC', bodyClass: 'centered-form', success: req.session.success, error: req.session.error, has_login: false, company: data, email: req.params.em });
      req.session.error = null;
    });
  }
});






module.exports = router;
