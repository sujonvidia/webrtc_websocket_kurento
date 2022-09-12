var app = require('express');
var router = app.Router();

var emailCheck = require('email-check');
var emailExistence = require('email-existence');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var sg_email = [];

sg_email["send"] = (data, callback) =>{
  console.log("Sendgrid call for sending mail to : "+data.to);
  data.from = 'no-reply@workfreeli.com';
  var tophtml = '<!DOCTYPE html><html><head></head><body><br><br><br><div style="width: 700px;height: auto;background-color: #FFF;position: absolute;top:100;bottom: 0;left: 0;right: 0;margin: auto;border:1px solid #000;color:black;font-size: 18px;"><p style="background-color:#023d67; text-align: center;margin: 0px;"><img src="https://wfss001.freeli.io/common/Workfreeli_logo_full_connect.png"></p><div style="padding:10px;">';
  var foothtml = '</div></div></body></html>';
  data.html = tophtml + data.html + foothtml;
  try{
    sgMail.send(data).then(() => {
      console.log('Email sent')
      callback({msg:'success'});
    }).catch((error) => {
        console.log(error)
        callback({msg:'error'});
    });
  }catch(e){
    console.log("send grid error" ,e);
    callback({msg:'error'});
  }
}

// sg_email["check_valid_email"] = (data, callback) =>{
//   emailCheck(data.email).then(function (res) {
//     callback({status: true});
//   }).catch(function (err) {
//     if (err.message === 'refuse') {
//       // The MX server is refusing requests from your IP address.
//       callback({status: false});
//     } else {
//       // Decide what to do with other errors.
//       callback({status: false});
//     }
//   });
// }

// emailCheck('info@seawindshippingservices.com', {
//   from: 'no-reply@workfreeli.com',
//   timeout: 10000
// }).then(function (res) {
//   console.log('email checck 0', res);
// }).catch(function (err) {
//   if (err.message === 'refuse') {
//     // The MX server is refusing requests from your IP address.
//     console.log('email checck 1', err);
//   } else {
//     // Decide what to do with other errors.
//     console.log('email checck 2', err);
//   }
// });

// emailExistence.check('info@seawindshippingservices.com', function(error, response){
//   console.log('email check res: '+response);
// });

module.exports = {sg_email};