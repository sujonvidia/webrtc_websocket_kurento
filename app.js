Error.stackTraceLimit = Infinity;
// require('trace-unhandled/register');
redis_cache_allow = false;
firebase_admin = require("firebase-admin");
var serviceAccount = require("./workfreeli-firebase-adminsdk.json");
firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount)
});
global.__basedir = __dirname;
redis_cache_ok = false;
model_cache_schema = {};
require('./config/config.js');
// ===== redis cache toogle ===========================================
redis_cache_enabled = process.env.redis_cache == 'true' ? true : false; // true = enable cache, false = disable cache
// process.on('unhandledRejection', (reason, p) => {
//     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//     // application specific logging, throwing an error, or other logic here
// });
// redis_cache_enabled = false;
// console.log('cache::redis_cache__enabled::',redis_cache_enabled);
// ------------------------------------------------------------------

// if(process.env.BASE_URL && process.env.redis_ip){
//     if(process.env.redis_ip.includes("27.147.195.218") && process.env.BASE_URL.includes("freeli")){
//         redis_cache_allow = true;
//     }
//     if(!process.env.CASSANDRA_URL.includes("27.147.195.221") && !process.env.redis_ip.includes("27.147.195.218")){
//         redis_cache_allow = true;
//     }
// }

// ===================================================================
var express = require('express');
const cors = require('cors');
const webpush = require('web-push'); //requiring the web-push module
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var moment = require('moment');

// setTimeout(() => {

//     var ss = JSON.parse("false");


// }, 5000);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session')({
    secret: process.env.SECRET,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }, // session expire after one year
    resave: true,
    saveUninitialized: true
});
uuid_checker = require('uuid-validate');
var socketIO = require('socket.io');
var sharedsession = require("express-socket.io-session");
var jwt = require('jsonwebtoken');

// var bootstrap = require('bootstrap');
var index = require('./routes/index');
var connectRouter = require('./routes/connect');
var signup = require('./routes/signup');
var signup_Initial = require('./routes/signup_initial');
var signup_work_account = require('./routes/signup_work_account');
var signup_activation = require('./routes/signup_activation');
var signup_set_password = require('./routes/signup_set_password');
var signup_complete = require('./routes/signup_complete');
var signup_invite = require('./routes/signup_invite');
var signup_invite_notify = require('./routes/signup_invite_notify');
var signup_social_account = require('./routes/signup_social_account');
var signup_invite_people = require('./routes/signup_invite_people');

var covid = require('./routes/covid');

var forgotpassword = require('./routes/forgot-password');
var logout = require('./routes/logout');
var chat = require('./routes/chat');
var hayven = require('./routes/hayven');
var call = require('./routes/call');
var projects = require('./routes/projects');
var quicklists = require('./routes/quicklists');
var polls = require('./routes/polls');
var notification = require('./routes/notification');
var api = require('./routes/api');
var android_api = require('./routes/android_api');
var workspaceSetting = require('./routes/workspaceSetting');
var user_settings = require('./routes/user_settings');
var files = require('./routes/files_main_page');
var files_upload = require('./routes/files');
var hayven_files_list = require('./routes/hayven_files_list');
var contacts = require('./routes/contacts');
var s3Local = require('./routes/s3Local');
var Calendar = require('./routes/calendar');
var BasicView = require('./routes/basic_view_connect');
var BasicViewToDo = require('./routes/basic_to_do');
var BasicCalendar = require('./routes/basic_calendar');
var companyOptions = require('./routes/company_options');

// var activity_OLD = require('./routes/activity_Old');
var activity = require('./routes/activity');
var activity_new = require('./routes/activity_new');
// Added by Manzurul alam
var feelixRouter = require('./routes/feelix');

// var fileUpload = require('express-fileupload');
free_buffer = {};
user_session = {};
alluserlist = []; // {user_id: '345234rqwerq3w452345452345dfadf', user_fullname: 'User Full Name'}
allIdleUsers = []; // {user_id: '345234rqwerq3w452345452345dfadf', user_fullname: 'User Full Name'}
alluserOnLoad = {}; // '345234rqwerq3w452345452345dfadf':'User Full Name'
allOnlineUserStatus = [] //{user_id:'345234rqwerq3w452345452345dfadf',name:'rabbi',length:2}
myAllTag = {}; //'345234rqwerq3w452345452345dfadf':'tag title'
userCompany_id = {} //'345234rqwerq3w452345452345dfadf':'345234rqwerq3w452345452345dfadf'
update_if_exists = { if_exists: true };
restart_time = Date.now();
lal = {};
// SA_ACCESS= [ 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1180, 1181, 1182, 1183, 1200, 1201, 1202, 1203, 1220, 1240, 1260, 1500 ];
USER_ACCESS = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1020, 1040, 1060, 1061, 1062, 1063, 1080, 1081, 1100, 1101, 1102, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1140, 1141, 1142, 1143, 1144, 1146, 1147, 1500];
// Express
var app = express();
// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'public','view_call')]);
app.set('view engine', 'html');

// app.use(fileUpload({
//   limits: { fileSize: 80 * 1024 * 1024 },
// }));

// var {models} = require('./config/db/express-cassandra');

// function token_verify_by_device_id(data){
//     return new Promise((resolve,reject)=>{
//         models.instance.Users.findOne({id: models.uuidFromString(data.id)}, function (err, user) {
//             if (err){
//                 reject({status: false, error: err});
//             }else{
//                 if(data.device_id === undefined){
//                     resolve({status: true});
//                 }
//                 else if(user.device.indexOf(data.device_id) > -1){
//                     resolve({status: true});
//                 }
//                 else 
//                     reject({ status: false, error: "Device is not listed. Please Login." });
//             }
//         });
//     });
// }

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
// app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressSession({secret: 'keyboard3245235cat', resave: false, saveUninitialized: false}));
app.use(expressSession);
app.use(express.static("public"));
// Socket.io
var io = socketIO();
__io = io;
app.io = io;
io.use(sharedsession(expressSession, {
    autoSave: true
}));



// io.use(function(socket, next){
//     if (socket.handshake.query && socket.handshake.query.token){
//         jwt.verify(socket.handshake.query.token, process.env.SECRET, function(err, decoded) {
//             if(err) return next(new Error('Authentication error'));
//             socket.decoded = decoded;
//             console.log(134, decoded);
//             token_verify_by_device_id(decoded).then(()=>{ next() }).catch((e)=>{
//                 console.log(137, e);
//                 next(new Error(e.error));
//             });
//         });
//     } else {
//         next(new Error('Authentication error'));
//     }    
// });
io.of('/namespace').use(sharedsession(expressSession, {
    autoSave: true
}));

require('./socket/socket.js')(io);
require('./socket/mob_socket.js')(io);
require('./socket/_global.js')(io);
require('./socket/d_socket.js')(io);
require('./socket/voip_socket.js')(io);
require('./socket/android.js')(io);
require('./socket/_api_socket.js')(io);
require('./socket/_settings.js')(io);

// settings = require('./utils/settings');

app.use('/', index);
app.use('/connect', connectRouter);
app.use('/signup', signup);
app.use('/signup_Initial', signup_Initial);
app.use('/signup_work_account', signup_work_account);
app.use('/signup_activation', signup_activation);
app.use('/signup_set_password', signup_set_password);
app.use('/signup_complete', signup_complete);
app.use('/signup_invite', signup_invite);
app.use('/signup_invite_notify', signup_invite_notify);
app.use('/signup_social_account', signup_social_account);
app.use('/signup_invite_people', signup_invite_people);

app.use('/covid', covid);

app.use('/forgot-password', forgotpassword);
app.use('/logout', logout);
app.use('/chat', chat);
app.use('/alpha2', hayven);
app.use('/call', call);
app.use('/projects', projects);
app.use('/quicklists', quicklists);
app.use('/polls', polls);
app.use('/notification', notification);
app.use('/api', api);
app.use('/android_api', android_api);
app.use('/settings', workspaceSetting);
app.use('/user_settings', user_settings);
app.use('/files', files);
app.use('/files_upload', files_upload);
app.use('/hayven_files_list', hayven_files_list);
app.use('/contacts', contacts);
app.use('/s3Local', s3Local);
app.use('/calendar', Calendar);
app.use('/basic_view_connect', BasicView);
app.use('/basic_to_do', BasicViewToDo);
app.use('/basic_calendar', BasicCalendar);
app.use('/company_options', companyOptions);

// app.use('/activity_OLD', activity_OLD);
app.use('/boards', activity);
app.use('/activity_new', activity_new);
// This route created by manzurul alam
app.use('/feelix', feelixRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error', {title: 'Not Found', bodyClass: ''});
    res.send(err.message);
});
// node --max-old-space-size=2000;
module.exports = app;