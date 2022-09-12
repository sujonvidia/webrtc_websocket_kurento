var app = require('express');
var router = app.Router();
const nodemailer = require("nodemailer");

// var {models} = require('./../config/db/express-cassandra');
// var { hayvenjs } = require('./../utils/hayvenjs');

var auth = {
    username: 'webmaster@imaginebd.com',
    password: 'Itl@123#'
};

var email = [];

email["send"] = (data, callback) =>{
    let transporter = nodemailer.createTransport({
        // service: "gmail",
        host: "27.147.195.222",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: auth.username, // generated ethereal user
            pass: auth.password // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions = {
        from: auth.username, // sender address
        to: data.to, // list of receivers
        subject: data.sub, // Subject line
        text: data.text, // plain text body
        html: data.msghtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error,info)=>{
        if(error){
            console.log(error);
        }else{
            callback({msg:'success', data:info});
        }
    });
};

module.exports = {email};