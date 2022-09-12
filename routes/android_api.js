var express = require('express');
var bcrypt = require('bcryptjs');
var FCM = require('fcm-node');
var multer = require('multer');
var fcm = new FCM('AAAAwSuL-Gg:APA91bGQeZg_iF_nu7zWvGq4XfkPKRas5H8T8BVKL3Ve8o5HqKHQh2vMcWZYL4W5kl1fUPqd8osSP4EXNA59Y2QstNSd1S0MoptoXRCusSia1-ql62fapg8NT7tRlAuxBHRnEqeNxE4c');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
var inArray = require('in-array');
var jwt = require('jsonwebtoken');

var { models } = require('./../config/db/express-cassandra');
var { passwordToHass, passwordToCompare } = require('./../utils/hassing');
var { getActiveUsers } = require('./../utils/chatuser');
var { hayvenjs } = require('./../utils/hayvenjs');
var { customTitle } = require('./../utils/customtitle');
var { signup_utils } = require('./../utils/signup_utils');
var { ensureToken, token_verify_by_device_id } = require('./../utils/jwt_helper');

var {
  saveConversation,
  findConversationHistory,
  checkAdmin,
  createPersonalConv,
  createPersonalConv2,
  check_only_Creator_or_admin,
  getAllTagsforList,
  saveTag,
  saveConTag,
  saveConvD,
  deleteUnusedTag,
  checkParticipants
} = require('./../utils/conversation');
var {
  generateMessage,
  sendNewMsg,
  sendBusyMsg,
  commit_msg_delete,
  flag_unflag,
  read_msg_data,
  add_reac_emoji,
  view_reac_emoji_list,
  get_group_lists,
  update_msg_status_add_viewer,
  check_reac_emoji_list,
  delete_reac_emoji,
  update_reac_emoji,
  get_messages_tag,
  getAllUnread,
  getPersonalConversation,
  replyId,
  find_reply_list,
  getsinglemsgchecklist,
  deleteThisTag,
  readallmsgintoconv
} = require('./../utils/message');

var {
  getAllConversation,
  getAllMsg,
  set_status,
  getAllpinUnpinList,
  getAllMuteList
} = require('./../utils/android');
var {
  
  get_busyData,
  getRoomInfoUser
} = require('./../utils/voice_video');

const isEmpty = require('../validation/is-empty');
const validator = require('validator');
const isUuid = require('uuid-validate');

// creates a configured middleware instance
// destination: handles destination
// filenane: allows you to set the name of the recorded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload/`))
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.replace(path.extname(file.originalname), '@') + Date.now() + path.extname(file.originalname));
  }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });

function validate(req, type, name, value) {
  if (req == true) {
    if (isEmpty(value)) return { status: false, error: name + ' is empty.' };
  }
  if (type == 'uuid') {
    if (!isUuid(value)) return { status: false, error: name + ' is not valid.' };
  }
  if (type == 'email') {
    if (!validator.isEmail(value)) return { status: false, error: name + ' is not valid.' };
  }
  if(type == 'int'){
		if(! validator.isInt(value)) return {status: false, error: name + ' is not valid.'};
	}

  return { status: true };
}

function update_gcm_id(user_id, gcm_id) {
  return new Promise((resolve, reject) => {
    // var update_values_object = { gcm_id: null };
    // var options = { conditions: { gcm_id: gcm_id } };
    // models.instance.Users.update({ id: user_id }, update_values_object, options, function (err) {
    //   if (err) {
    //     reject({ status: false, error: err });
    //   } else {
    //     resolve({ status: true, data: "GCM id update successfully" });
    //   }
    // });
  });
}

/* GET login page. */
router.get('/', function (req, res, next) {
  if (req.session.login) {
    res.redirect('/apps1');
  } else {
    res.send('This is android new api https://27.147.195.222:2267');
  }
});

/**
 * Login with multiple company and Pagination home page data
 */
// router.post('/login2', function(req, res, next) {
//   var session_id = req.sessionID;
//   if(! validate(true, 'email', 'Email', req.body.email).status){
//     res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'email', 'Email', req.body.email).error });
//   }
//   else if(! validate(true, 'text', 'Password', req.body.password).status){
//     res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'Password', req.body.password).error });
//   }
//   else if(! validate(true, 'text', 'GCM ID', req.body.gcm_id).status){
//     res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'GCM ID', req.body.gcm_id).error });
//   }
//   else if(! validate(true, 'text', 'Device ID', req.body.device_id).status){
//     res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'Device ID', req.body.device_id).error });
//   }
//   else if(req.body.company_id !== undefined && ! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
//       res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error });
//   }	
//   else{
//     try{
//       var query = {email:req.body.email, is_delete:0};
//       if(req.body.company_id !== undefined) query.company_id = models.timeuuidFromString(req.body.company_id);
//       models.instance.Users.find(query, {raw:true, allow_filtering: true}, async function(error, oneUser){
//           if(oneUser.length == 1){
//           var payload = {};
//           var is_new_device = "0";
//           var remove_device_list = [];
//           var update_values_object = {};
//           if(passwordToCompare(req.body.password, oneUser[0].password)){
//             if (oneUser[0].conference_id == null) {
//               var newid = models.timeuuid().toString() + '_personal';
//               update_values_object.conference_id = newid;
//             }else{
//               var newid = oneUser[0].conference_id;
//             }
            
//             if(oneUser[0].gcm_id != req.body.gcm_id)
//               update_values_object.gcm_id = req.body.gcm_id;

//             var device = oneUser[0].device != null ? oneUser[0].device : [];
//             if (device.indexOf(req.body.device_id) == -1) {
//               is_new_device = "1";
//               device.push(req.body.device_id);
//               remove_device_list = device.join();
//               update_values_object.device = device;
//             }

//             payload = { id: oneUser[0].id, email: oneUser[0].email, company_id: oneUser[0].company_id, device_id: req.body.device_id };
//             token = jwt.sign(payload, process.env.SECRET);
// console.log(179, update_values_object, oneUser[0]);
//             if(!isEmpty(update_values_object)) {
//               models.instance.Users.update({ id: oneUser[0].id }, update_values_object, update_if_exists, function (err) {});
//             }
            
//             userCompany_id[oneUser[0].id] = oneUser[0].company_id.toString();

//             // let iscall = await getRoomInfoUser(oneUser[0].id.toString());
//             // if (iscall == false) //await del_busyData(oneUser[0].id.toString());
//             res.redirect('/android_api/home2/' + oneUser[0].id + '/' + oneUser[0].company_id + '/' + token + '/' + is_new_device + '/0');
//           }else{
//             res.status(403).send({conversations: [], user: {}, companies:[], token: "", msg: "Password does not match" });
//           }
//           }
//           else if(oneUser.length > 1){
//             var companies = await signup_utils.get_company_by_user_email(req.body.email);
//             _.forEach(companies, function(v, k){
//               if((v.company_name).indexOf("@") > -1){
//                 v.company_name = (v.company_name).substring(0, (v.company_name).indexOf("@"));
//               }
//             });
//             res.status(200).send({companies, token: "", conversations: [], user: {}, msg: "Email address used in multiple company. So select company.", token: ""});
//           }
//           else{
//             res.status(403).send({conversations: [], user: {}, companies:[], token: "", msg: "Email address is invalid" });
//           }
//       });
//     }
//     catch(error){
//       res.status(404).send({conversations: [], user: {}, companies:[], msg: error });
//     }
//   }
// });
/**
* Home page reload or pagination for more data
*/
router.post('/homepage', ensureToken, function(req, res, next){
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ conversations: [], user: {}, companies:[], msg: err });
    else if (decoded.id != req.body.id) res.status(403).send({ conversations: [], user: {}, companies:[], msg: "ID not match" });
    else{
      token_verify_by_device_id(decoded).then(() => {
        var start_at = 0;
        if(req.body.start_at !== undefined) 
          start_at = Number(req.body.start_at);
        
        res.redirect('/android_api/home2/' + models.uuidFromString(decoded.id) + '/' + models.timeuuidFromString(decoded.company_id) + '/' + req.token + '/0/' + start_at);    
      }).catch((e) => {
        res.status(403).send(e);
      });
    }
  });
});
/**
* Make home page data
*/
router.get('/home2/:id/:company_id/:token/:new_device/:start_at', function(req, res, next){
  console.log(203, req.params.start_at)
  models.instance.Users.find({company_id:models.timeuuidFromString(req.params.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
    if(err) {res.status(404).send({conversations: [], user: {}, companies:[], token:"", msg: err });}
    //user is an array of plain objects with only name and age
    var alluserlist = [];
    var user = {id: req.params.id};
    var msg = '';
    var start_at = Number(req.params.start_at);
    _.each(users, function(v,k){
      alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
      alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
      // console.log(1537, v.fullname);
      if(req.params.id.toString() == v.id.toString()){
        user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: v.conference_id, device: v.device };
        userCompany_id[user.id] = user.company_id.toString();
      }
    });
    // Get all conversations
    var remove_device_list = req.params.new_device == "1" ? user.device : [];
    var myuserlist = [];
    models.instance.Conversation.find({participants: { $contains: req.params.id.toString() }}, { raw: true, allow_filtering: true }, function(error, all_conv){
      if(error) res.status(404).send({myuserlist, user, companies:[], token:"", msg: error });
      if(all_conv.length == 0) res.status(200).send({myuserlist, user, remove_device_list, alluserlist, companies:[], token: req.params.token, msg: "No conversation found." });
      else{
        all_conv = _.orderBy(all_conv, ['last_msg_time'], ['desc']);
        var counter = 0;
        _.each(all_conv, function(per_conv, key){
          if(counter > 19) return;
          if(start_at <= key){
            if(per_conv.group != 'yes') {
              var fid = per_conv.participants.join().replace(req.params.id.toString(), '').replace(',', '');
              var single_user_img = "";
              _.each(alluserlist, function(sv, sk){
                if(sv.id == fid){
                  single_user_img = sv.img;
                  return false;
                }
                if(sk+1 == alluserlist.length){
                  single_user_img = 'img.png';
                  return false;
                }
              });
              var ftitle = idToNameArr([fid]).toString();
              if(ftitle.indexOf('Deleted')>-1) return;
              else if(ftitle == "" || ftitle === undefined) return;
            }
            
            // myuserlist.push({
            //   'conversation_id': per_conv.conversation_id,
            //   'conversation_type': per_conv.group == 'yes' ? 'Group' : 'Personal',
            //   'conversation_with': per_conv.group == 'yes' ? 'Group' : fid,
            //   'conversation_title': per_conv.group == 'yes' ? per_conv.title : ftitle,
            //   'privacy': per_conv.privacy,
            //   'msg_body': (per_conv.last_msg == null ? 'Message body...': per_conv.last_msg),
            //   'participants': per_conv.participants,
            //   'status': per_conv.status,
            //   'is_active': per_conv.is_active != null ? per_conv.is_active : [],
            //   'participants_admin': per_conv.participants_admin != null ? per_conv.participants_admin :[],
            //   'participants_name': idToNameArr(per_conv.participants),
            //   'created_at': per_conv.created_at,
            //   'last_msg_time': per_conv.last_msg_time,
            //   'conv_img': per_conv.group == 'yes' ? per_conv.conv_img : single_user_img,
            //   'totalUnread': 0,
            //   'conference_id': per_conv.conference_id
            // });
            myuserlist.push({
              'conversation_id': per_conv.conversation_id,
              'conversation_type': per_conv.group == 'yes' ? 'Group' : 'Personal',
              'conversation_with': per_conv.group == 'yes' ? 'Group' : fid,
              'conversation_title': per_conv.group == 'yes' ? per_conv.title : ftitle,
              'privacy': per_conv.privacy,
              'msg_body': (per_conv.last_msg == null ? 'Message body...': per_conv.last_msg),
              'participants': per_conv.participants,
              'status': per_conv.status,
              'is_active': per_conv.is_active != null ? per_conv.is_active : [],
              'participants_admin': per_conv.participants_admin != null ? per_conv.participants_admin :[],
              'participants_name': idToNameArr(per_conv.participants),
              'created_at': per_conv.last_msg_time,
              'msg_id': '',
              'msg_type': '',
              'sender_img': per_conv.group == 'yes' ? per_conv.conv_img : single_user_img,
              'sender_name': per_conv.group == 'yes' ? per_conv.title : ftitle,
              'totalUnread': 0,
              'conference_id': per_conv.conference_id
            });
            counter++;
          }
          // console.log(1568, start_at, counter, key)
        });

        // if no more conversation found
        if(myuserlist.length == 0) res.status(200).send({token: req.params.token, myuserlist, user, remove_device_list, alluserlist,  companies:[], msg: "No conversation found." });
        else{
          getAllpinUnpinList(req.params.id.toString()).then((response) => {
            _.each(myuserlist, function (val, k) {
              val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
              val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
            });
    
            getAllMuteList(req.params.id.toString()).then((mute_res)=>{
              _.each(myuserlist, function (mval, mk) {
                if (mute_res.allMuteActiveConv.indexOf(mval.conversation_id.toString()) > -1) {
                  mval['isMute'] = true;
                  mval['mute_id'] = mute_res.mute_id[mval.conversation_id.toString()];
                  mval['mute_duration'] = mute_res.mute_duration[mval.conversation_id.toString()];
                  mval['muteData'] = mute_res.muData[mute_res.allMuteActiveConv.indexOf(mval.conversation_id.toString())];
                } else {
                  mval['isMute'] = false;
                  mval['mute_id'] = false;
                  mval['mute_duration'] = false;
                  mval['muteData'] = {};
                }
              });
    
              res.status(200).send({token: req.params.token, myuserlist, user, remove_device_list, alluserlist, companies:[], msg: "success" });
            }).catch((me)=>{
              res.status(404).send({token: "", myuserlist,  user, remove_device_list, alluserlist, companies:[], msg: me });	
            });
          }).catch((error)=>{
            res.status(404).send({token: "", myuserlist,  user, remove_device_list, alluserlist, companies:[], msg: error });
          });
        }
      }
    });
  });
});

/**
 * Get all users from given company id
 */
router.post("/all_users", ensureToken, function(req, res, next){
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ all_users:[], msg: err });
    else if (decoded.company_id != req.body.company_id) res.status(403).send({ all_users:[], msg: "Company ID not match" });
    else{
      token_verify_by_device_id(decoded).then(() => {
        models.instance.Users.find({company_id:models.timeuuidFromString(req.body.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
          if(err) {res.status(404).send({all_users:[], msg: err });}
          //user is an array of plain objects with only name and age
          var all_users = [];
          if(users){
            _.each(users, function(v,k){
              all_users.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
            });
            res.status(200).send({all_users, msg: 'success'});
          }
          else res.status(404).send({all_users:[], msg: 'No user found.' });
        });
      }).catch((e) => {
        res.status(403).send(e);
      });
    }
  });
});

/**
 * Get user details
 */
router.post("/user_info_by_id", ensureToken, function(req, res, next){
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ user_info:{}, msg: err });
    else if(! validate(true, 'uuid', 'ID', req.body.id).status){
      res.status(403).send({user_info:{}, msg: validate(true, 'uuid', 'ID', req.body.id).error });
    }
    else{
      token_verify_by_device_id(decoded).then(() => {
        models.instance.Users.findOne({id:models.uuidFromString(req.body.id.toString())}, {raw:true, allow_filtering: true}, function(err, user){
          if(err) {res.status(404).send({user_info:{}, msg: err });}
          if(user){
            var user_info = {id: user.id, dept: user.dept, designation: user.designation, email: user.email, fullname: user.fullname, img: user.img, is_delete: user.is_delete.toString(), company_id: user.company_id};
            res.status(200).send({user_info, msg: 'success'});
          }
          else res.status(404).send({user_info:{}, msg: 'No user found.' });
        });
      }).catch((e) => {
        res.status(403).send(e);
      });
    }
  });
});

/**
 * Share or forward conversation lists
 */
router.post("/to_lists", ensureToken, function(req, res, next){
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ to_lists:[], msg: err });
    else if (decoded.id != req.body.user_id) res.status(403).send({ to_lists:[], msg: "User ID not match or invalid." });
    else if (decoded.company_id != req.body.company_id) res.status(403).send({ to_lists:[], msg: "Company ID not match or invalid." });
    else{
      token_verify_by_device_id(decoded).then(() => {
        models.instance.Users.find({company_id:models.timeuuidFromString(req.body.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
          if(err) {res.status(404).send({to_lists:[], msg: err });}
          //user is an array of plain objects with only name and age
          var to_lists = [];
          var already_push = [];
          if(users){
            _.each(users, function(v,k){
              if(v.is_delete == 1 || v.access.indexOf(1600) > -1) return;
              already_push.push(v.id);
              to_lists.push({
                'to_id': v.id,
                'conversation_type': 'Personal',
                'conversation_with': v.id,
                'conversation_title': v.fullname,
                'privacy': 'private',
                'participants': [v.id, req.body.user_id],
                'participants_admin': [v.id, req.body.user_id],
                'conv_img': v.img});
            });
            
            models.instance.Conversation.find({participants: { $contains: req.body.user_id }}, { raw: true, allow_filtering: true }, function(error, all_conv){
              if(error) res.status(404).send({to_lists, msg: error });
              if(all_conv.length == 0) res.status(200).send({to_lists: _.orderBy(to_lists, ['conversation_title'], ['asc']), msg: "No room found" });
              else{
                _.each(all_conv, function(per_conv,k){
                  if(per_conv.group == 'yes'){
                    to_lists.push({
                      'to_id': per_conv.conversation_id,
                      'conversation_type': 'Group',
                      'conversation_with': 'Group',
                      'conversation_title': per_conv.title,
                      'privacy': per_conv.privacy,
                      'participants': per_conv.participants,
                      'participants_admin': per_conv.participants_admin != null ? per_conv.participants_admin :[],
                      'conv_img': per_conv.conv_img});
                  }
                });
                res.status(200).send({to_lists: _.orderBy(to_lists, ['conversation_title'], ['asc']), msg: 'success'});
              }
            });            
          }
          else res.status(404).send({to_lists:[], msg: 'No user found.' });
        });
      }).catch((e) => {
        res.status(403).send(e);
      });
    }
  });
});

// Url for leave from room
router.post("/leave_room", ensureToken, function (req, res, next) {
  console.log(84, req.body);
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      checkParticipants(req.body.conversation_id)
        .then((response) => {
          if (req.body.type == "leave") {
            if (response.conversation.participants.length > 1) {
              models.instance.Conversation.update(
                {
                  conversation_id: models.uuidFromString(req.body.conversation_id),
                  company_id: models.timeuuidFromString(req.body.company_id)
                },
                {
                  participants: { $remove: [req.body.targetID] },
                  participants_admin: { $remove: [req.body.targetID] },
                }, update_if_exists,
                function (err) {
                  if (err) {
                    if (err) throw err;
                    console.log({ msg: "fail" });
                    res.send(JSON.stringify({ msg: "fail" }));
                  } else {
                    console.log({ msg: "success" });
                    res.send(JSON.stringify({ msg: "success" }));
                  }
                }
              );
            } else {
              console.log({ msg: "fail" });
              res.send(JSON.stringify({ msg: "nomem" }));
            }
          } else if (req.body.type == "delete") {
            if (response.conversation.participants_admin.indexOf(req.body.targetID) > -1) {
              var query_object = {
                conversation_id: models.uuidFromString(req.body.conversation_id),
                company_id: models.timeuuidFromString(req.body.company_id)
              };

              models.instance.Conversation.delete(query_object, function (err) {
                if (err) {
                  res.send(JSON.stringify({ msg: "fail" }));
                } else {
                  res.send(JSON.stringify({ msg: "delete", conversation: response.conversation }));
                }
              });
            } else {
              res.send(JSON.stringify({ msg: "nomem" }));
            }
          }

        }).catch((crr) => {
          console.log(crr);
        });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

/* POST login listing. */
router.post('/login', async function (req, res, next) {
  var companies = [];
  if (req.body.company_id !== undefined && req.body.company_id != "")
    var query = { email: req.body.email.trim(), company_id: models.timeuuidFromString(req.body.company_id), is_delete: 0 };
  else
    var query = { email: req.body.email.trim(), is_delete: 0 };
  models.instance.Users.find(query, { raw: true, allow_filtering: true }, async function (err, getuser) {
    if (err) throw err;
    //getuser is an array of plain objects with only name and age
    if (getuser.length == 1) {
      if (getuser[0].is_active == 1) {
        if (passwordToCompare(req.body.password, getuser[0].password)) {
          res.redirect('/android_api/home/' + getuser[0].id + '/' + req.body.email + '/' + req.body.gcm_id + '/' + req.body.device_id);
        } else {
          res.send({
            alluserlist: [], conversations: [], user: {}, msg: "Password does not match.",
            session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
            my_room: [], joined_room: [], to_be_join: [], companies
          });
        }
      } else {
        res.send({
          alluserlist: [], conversations: [], user: {}, msg: "User is inactive.",
          session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
          my_room: [], joined_room: [], to_be_join: [], companies
        });
      }
    }
    else if (getuser.length > 1) {
      companies = await signup_utils.get_company_by_user_email(req.body.email);
      _.forEach(companies, function(v, k){
        if((v.company_name).indexOf("@") > -1){
          v.company_name = (v.company_name).substring(0, (v.company_name).indexOf("@"));
        }
      });
      res.send({
        alluserlist: [], conversations: [], user: {}, msg: "Email address used in multiple company. So select company.",
        session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
        my_room: [], joined_room: [], to_be_join: [], companies
      });
    }
    else {
      res.send({
        alluserlist: [], conversations: [], user: {}, msg: "Email address is invalid",
        session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
        my_room: [], joined_room: [], to_be_join: [], companies
      });
    }
  });
});

router.get('/home/:id/:email/:gcm_id/:device_id', function (req, res, next) {
  console.log(166, req.params);
  models.instance.Users.findOne({ id: models.uuidFromString(req.params.id) }, function (error, oneUser) {
    if (oneUser != null) {
      models.instance.Users.find({ company_id: models.timeuuidFromString(oneUser.company_id.toString()) }, { raw: true, allow_filtering: true }, async function (err, users) {
        if (err) throw err;
        //user is an array of plain objects with only name and age
        var alluserlist = [];
        var user = {};
        var payload = {};
        var remove_device_list = [];
        var token = "";
        var msg = '';
        _.each(users, function (v, k) {
          alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id, conference_id: v.conference_id });
          alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
          // console.log(alluserOnLoad[v.id], v.company_id);
          // Removing the old gcm_id if any
          // var query_object = { id: v.id };
          // var options = { conditions: { gcm_id: req.params.gcm_id } };
          // if (req.params.gcm_id == v.gcm_id && req.params.email != v.email) {
          //   models.instance.Users.update(query_object, { gcm_id: null }, options, function (err) {
          //     if (err) console.log(err);
          //     else console.log('Removing the old gcm_id if any');
          //   });
          // }
          // End of removing the old gcm_id if any

          if (req.params.email == v.email) {
            // if(passwordToCompare(req.params.password, v.password)){
            msg = "true";
            var update_values_object = {};
            if (v.conference_id == null) {
              var newid = models.timeuuid().toString() + '_personal';
              update_values_object.conference_id = newid;
            } else {
              var newid = v.conference_id;
            }

            // if (v.gcm_id != req.params.gcm_id)
              // update_values_object.gcm_id = req.params.gcm_id; 
            update_values_object.fcm_id = {'$add': ['android@@@'+req.params.gcm_id]};
            
            var device = v.device != null ? v.device : [];
            if (device.indexOf(req.params.device_id) == -1) {
              device.push(req.params.device_id);
              remove_device_list = device.join();
              update_values_object.device = device;
            }
            if (!isEmpty(update_values_object)) {
              models.instance.Users.update({ id: v.id }, update_values_object, update_if_exists, function (err) {
                if (err) console.log(1748, err);
              });
            }

            user = { id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: newid };
            payload = { id: v.id, email: v.email, company_id: v.company_id, device_id: req.params.device_id };
            userCompany_id[user.id] = user.company_id.toString();

            token = jwt.sign(payload, process.env.SECRET);

            if (remove_device_list.length > 0) {
              remove_device_list = remove_device_list.replace("," + req.params.device_id, "").split(",");
            }
            // }else{
            //   msg = 'Password does not match';
            // }
          }
        });

        if (msg == "") {
          res.send({
            alluserlist: [], conversations: [], user: {}, msg: "Email address is invalid",
            session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
            my_room: [], joined_room: [], to_be_join: [], companies: []
          });
        }
        else if (msg == "Password does not match") {
          res.send({
            alluserlist: [], conversations: [], user: {}, msg: "Password does not match",
            session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
            my_room: [], joined_room: [], to_be_join: [], companies: []
          });
        }
        else {
          // getRoomInfoUser(user.id.toString(), async (error, iscall, roomname) => {
            // if (iscall == false) 
            // await del_busyData(user.id.toString());
          // });
          // Get all conversations
          getAllConversation(user.id.toString(), (result) => {
            customTitle({ user_id: user.id.toString(), type: 'get' }, (allNic) => {
              var allCusName = {};
              if (allNic.status) {
                _.each(allNic.result, function (nv, nk) {
                  allCusName[nv.change_id] = { nv };
                })
              }
              if (result.status) {
                // query_object = { id: user.id };
                // update_values_object = { gcm_id: req.params.gcm_id };
                // options = { conditions: { email: req.params.email } };

                var conversations = result.conversations;
                var myConversationList = [] // keep all conversatons in this array
                var conversationTitle = {};
                var conversationType = {};
                var conversationLastMsgTime = {};
                var conversationWith = {};
                var conversationImage = {};
                var conversationPrivacy = {};
                var conversationParticipants = {};
                var conversationStatus = {};
                var conversationParticipants_admin = {};
                var userName = {};
                var conversationisActive = {};
                var userImg = {};
                var myConversationID = "";
                var call_conference_id = {};
                // var call_participants_all = {};
                // var call_participants_admin = {};

                alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

                _.each(alluserlist, function (users, k) {
                  userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
                  if (allCusName[users.id] != undefined) {
                    userName[users.id] = allCusName[users.id]['nv'].change_title;
                  }
                  userImg[users.id] = users.img;
                });
                //Get conversation detail along with user table for further user list to android
				        // var rc = 0;
				        // console.log(725, conversations.length);
                if (result.conversations.length > 0) {
                  _.each(result.conversations, function (conversations, k) {
                    if(conversations.root_conv_id != null){ 
                      // rc++; console.log(727, rc); 
                      return; 
                    }
                    if (!isEmpty(conversations.title)) {
                      if (checkThisIdActiveOrNot(conversations.is_active, user.id.toString())) {
                        if (myConversationList.indexOf(conversations.conversation_id.toString()) === -1) {

                          myConversationList.push(conversations.conversation_id.toString());
                          conversationTitle[conversations.conversation_id.toString()] = conversations.title;
                          conversationType[conversations.conversation_id.toString()] = conversations.single;
                          conversationLastMsgTime[conversations.conversation_id.toString()] = conversations.last_msg_time;
                          conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
                          conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
                          conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
                          conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
                          conversationStatus[conversations.conversation_id.toString()] = conversations.status;
                          conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;
                          call_conference_id[conversations.conversation_id.toString()] = conversations.conference_id;
                          // call_participants_all[conversations.conversation_id.toString()] = conversations.participants;
                          // call_participants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;

                          if (conversations.single == 'yes') {
                            if (conversations.participants.length == 1) {
                              myConversationID = conversations.conversation_id.toString();
                            } else {
                              _.forEach(conversations.participants, function (pv, pk) {
                                if (pv !== null && pv.toString() !== user.id.toString()) {
                                  conversationWith[conversations.conversation_id.toString()] = pv;
                                }
                              });
                            }
                          }
                        }
                      }
                    }
                  });

                  if (myConversationList.length > 0) {
                    getAllMsg(myConversationList, (result) => {
                      if (result.status) {
                        var all_unread = [];
                        var all_message = [];
                        var counts = {};
                        var last_conversation_id = [];
                        var androidUserList = [];
                        var androidCallList = [];

                        // Push all messages
                        _.forEach(result.data, function (amv, amk) {
                          if (amv.length > 0) {
                            _.each(amv, function (mv, mk) {
                              if (mv.has_hide != null) {
                                if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
                                  if (mv.has_delete != null) {
                                    if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                      all_message.push(mv);
                                    }
                                  } else {
                                    all_message.push(mv);
                                  }
                                }
                              } else {
                                if (mv.has_delete != null) {
                                  if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                    all_message.push(mv);
                                  }
                                } else {
                                  all_message.push(mv);
                                }
                              }
                            });
                          }
                        });

                        // Get all unread message
                        var all_message_orderBy = all_message;
                        _.forEach(all_message_orderBy, function (amv, amk) {
                          // if (amv.msg_status == null && amv.sender != null && amv.sender.toString() != user.id.toString()) {
                          //   all_unread.push(amv);
                          // }
                          if(amv.msg_status == null){
                            amv.msg_status = []
                          }
                          if(amv.msg_status.indexOf(user.id.toString()) > -1){
                            all_unread.push(amv);
                          }
                        });
                        //Count unread message and push it to counts array
                        all_unread.forEach(function (x) {
                          counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0) + 1;
                        });

                        //Get All last Message
						_.forEach(all_message_orderBy, function (amv, amk) {
						  if (last_conversation_id.indexOf(amv.conversation_id.toString()) === -1) {
                            last_conversation_id.push(amv.conversation_id.toString());
                            // all_last_message.push(amv);
                            if (amv.conversation_id.toString() !== myConversationID) {
                              if (userName[conversationWith[amv.conversation_id.toString()]] == undefined) userName[conversationWith[amv.conversation_id.toString()]] = "Deleted User";
                              if (conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
                              if (!isEmpty(amv.msg_body)) {
                                var participants_admin = [];

                                androidUserList.push({
                                  'conversation_id': amv.conversation_id,
                                  'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
                                  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
                                  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
                                  'privacy': conversationPrivacy[amv.conversation_id.toString()],
                                  'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
                                  'participants': conversationParticipants[amv.conversation_id.toString()],
                                  'status': conversationStatus[amv.conversation_id.toString()],
                                  'is_active': (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()] : []),
                                  'participants_admin': (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()] : []),
                                  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
                                  // 'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
                                  'created_at': conversationLastMsgTime[amv.conversation_id.toString()],
                                  'msg_id': amv.msg_id,
                                  'msg_type': amv.msg_type,
                                  'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
                                  'sender_name': amv.sender_name,
                                  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0),
                                  'conference_id': call_conference_id[amv.conversation_id.toString()]
                                });
                              }

                              if (amv.msg_type == 'call') {
                                androidCallList.push({
                                  'conversation_id': amv.conversation_id,
                                  'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
                                  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
                                  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
                                  'privacy': conversationPrivacy[amv.conversation_id.toString()],
                                  'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
                                  'participants': conversationParticipants[amv.conversation_id.toString()],
                                  'status': conversationStatus[amv.conversation_id.toString()],
                                  'is_active': (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()] : []),
                                  'participants_admin': (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()] : []),
                                  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
                                  // 'created_at': (amv.msg_body == null ? 'null' : amv.created_at),
                                  'created_at': conversationLastMsgTime[amv.conversation_id.toString()],
                                  'call_duration': (amv.call_duration == "" ? 0 : amv.call_duration),
                                  'call_type': amv.call_type,
                                  'call_status': amv.call_status,
                                  'call_msg': amv.call_msg,
                                  'msg_id': amv.msg_id,
                                  'msg_type': amv.msg_type,
                                  'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
                                  'sender_name': amv.sender_name,
                                  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0),
                                  'conference_id': call_conference_id[amv.conversation_id.toString()]
                                });
                              }
                            }
                          }
                        });

						
                        getAllpinUnpinList(user.id.toString())
                          .then((response) => {

                            _.forEach(androidUserList, function (val, k) {
                              val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
                              val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
                            });

                            var query = {
                              mute_by: { $eq: models.uuidFromString(user.id.toString()) }
                            };
                            models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function (error, all_conv) {
                              if (error) {
                                callback({ status: false });
                              } else {

                                var allMuteActiveConv = [];
                                var muData = [];
                                var mute_id = {};
                                var mute_duration = {};
                                _.forEach(all_conv, function (v, k) {
                                  if (v.mute_status == "active") {
                                    allMuteActiveConv.push(v.conversation_id.toString());
                                    mute_id[v.conversation_id.toString()] = v.mute_id;
                                    mute_duration[v.conversation_id.toString()] = v.mute_duration;
                                    muData.push(v);
                                  }
                                });

                                _.forEach(androidUserList, function (val, k) {
                                  if (allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1) {
                                    val['isMute'] = true;
                                    val['mute_id'] = mute_id[val.conversation_id.toString()];
                                    val['mute_duration'] = mute_duration[val.conversation_id.toString()];
                                    val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
                                  } else {
                                    val['isMute'] = false;
                                    val['mute_id'] = false;
                                    val['mute_duration'] = false;
                                    val['muteData'] = {};
                                  }
                                });

                                var data = {
                                  keySpace: user.company_id
                                };

                                models.instance.Tag.find({ tagged_by: models.uuidFromString(user.id.toString()) }, { allow_filtering: true }, function (tagserr, tags) {

                                  if (tagserr) {
                                    throw tagserr;
                                  } else {
                                    hayvenjs.room_status(data, (demodata) => {
                                      if (demodata.staus) {

                                        _.forEach(demodata.rooms, function (bbv, bbk) {
                                          if (bbv.single == 'yes') {

                                            if (bbv.participants.length > 1) {
                                              _.forEach(bbv.participants, function (bpv, bpk) {
                                                if (bpv !== null && bpv.toString() !== user.id.toString()) {
                                                  conversationWith[bbv.conversation_id.toString()] = bpv;
                                                }
                                              });
                                            }
                                          }
                                        });
                                        var unique_conversation = [];
                                        var my_room = [];
                                        var joined_room = [];
                                        var to_be_join = [];
                                        _.forEach(demodata.rooms, function (dv, dk) {
                                          // console.log(947, dv.participants);
                                          if (unique_conversation.indexOf(dv.conversation_id.toString()) == -1 && dv.participants !== null) {
                                            unique_conversation.push(dv.conversation_id.toString());
                                            if (dv.single == 'yes') {
                                              // console.log(dv.conversation_id.toString()+"=="+userName[conversationWith[dv.conversation_id.toString()]]);
                                              // dv['join_status'] = 'personal';
                                              // dv['user_name'] =  userName[conversationWith[dv.conversation_id.toString()]];
                                              // dv['user_img'] = userImg[conversationWith[dv.conversation_id.toString()]];
                                            } else {
                                              if (dv.created_by) {
                                                if (dv.created_by.toString() == user.id.toString()) {
                                                  dv['join_status'] = 'my_room';
                                                  dv['user_name'] = null;
                                                  dv['user_img'] = null;
                                                  dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                                                  my_room.push(dv);
                                                } else if (dv.participants.indexOf(user.id.toString()) > -1) {
                                                  dv['join_status'] = 'joined_room';
                                                  dv['user_name'] = null;
                                                  dv['user_img'] = null;
                                                  dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                                                  joined_room.push(dv);
                                                } else if (dv.participants.indexOf(user.id.toString()) == -1 && dv.privacy == 'public') {
                                                  dv['join_status'] = 'to_be_join';
                                                  dv['user_name'] = null;
                                                  dv['user_img'] = null;
                                                  dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                                                  to_be_join.push(dv);
                                                }
                                              }

                                            }
                                          }
                                        });
                                      }
                                      androidUserList = _.filter(androidUserList, function(aul){ return aul.conversation_title != 'Deleted User';});
                                      res.send({
                                        alluserlist: alluserlist,
                                        conversations: conversations,
                                        user: user,
                                        msg: msg,
                                        tags: tags,
                                        myUserList: _.orderBy(androidUserList, ['created_at'], ['desc']),
                                        androidCallList: androidCallList,
                                        session_id: req.sessionID,
                                        my_room: my_room,
                                        joined_room: joined_room,
                                        to_be_join: to_be_join,
                                        companies: [],
                                        token: token,
                                        remove_device_list: remove_device_list
                                        // rooms: demodata.rooms
                                      });
                                    });

                                  }
                                });

                              };
                            });

                          }).catch((err) => {
                            console.log(err);
                          });

                      } else {
                        console.log(result);
                      }
                    });
                  }
                } else {
                  res.send({
                    alluserlist, conversations: [], user, msg,
                    session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
                    my_room: [], joined_room: [], to_be_join: [], companies: [], token: token,
                    remove_device_list: remove_device_list
                  });
                }
              } else {
                console.log(result);
              }
            })

          });
        }
      });
    } else {
      res.send({
        alluserlist: [], conversations: [], user: {}, msg: "Email address is invalid",
        session_id: req.sessionID, tags: [], myUserList: [], androidCallList: [],
        my_room: [], joined_room: [], to_be_join: [], companies: []
      });
    }
  });
});

router.post('/switch_account', ensureToken, function(req, res, next){
	// console.log(1796, req.body);
	jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
		// console.log(1798, req.body.email);
		if (err) res.status(403).send({ msg: err });
		else if (decoded.email != req.body.email) res.status(403).send({ msg: "Email ID not match" });
		else if (decoded.company_id != req.body.company_id) res.status(403).send({ msg: "Company ID not match" });
		else{
			token_verify_by_device_id(decoded).then(() => {
				// console.log(1804);
				models.instance.Users.find({email: req.body.email.trim(), company_id: models.timeuuidFromString(req.body.new_company_id), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
					// console.log(1806, getuser.length);
					if(err) res.status(403).send({ msg: err });
					else if(getuser.length == 1){
						res.redirect('/android_api/home/' + getuser[0].id + '/' + getuser[0].email + '/' + req.body.gcm_id + '/' + req.body.device_id);
					}
					else{
						res.status(403).send({msg: "Something wrong..."});
					}
				});
			});
		}
	});
});

// router.post('/newlogin', function (req, res, next) {
//   console.log("530 ", moment().format("HH:mm:ss:SSS"));
//   var session_id = req.sessionID;
//   models.instance.Users.find({}, { raw: true, allow_filtering: true }, function (err, users) {
//     if (err) throw err;
//     //user is an array of plain objects with only name and age
//     var alluserlist = [];
//     var user = [];
//     var msg = '';
//     _.each(users, function (v, k) {
//       alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id });
//       alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
//       // Removing the old gcm_id if any
//       var query_object = { id: v.id };
//       var update_values_object = { gcm_id: null };
//       var options = { conditions: { gcm_id: req.body.gcm_id } };
//       // if (req.body.gcm_id == v.gcm_id && req.body.email != v.email) {
//       //   models.instance.Users.update(query_object, update_values_object, options, function (err) {
//       //     if (err) console.log(err);
//       //     else console.log('Removing the old gcm_id if any');
//       //   });
//       // }
//       // End of removing the old gcm_id if any
//     });

//     _.each(users, function (v, k) {
//       if (req.body.email == v.email) {
//         if (passwordToCompare(req.body.password, v.password)) {
//           console.log("557 ", moment().format("HH:mm:ss:SSS"));
//           msg = "true";
//           user = { id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id };
//           // console.log(user);
//           userCompany_id[user.id] = user.company_id.toString();
//           update_gcm_id(v.id, req.body.gcm_id).then(async function (res2) {
//             // getRoomInfoUser(user.id.toString(), async (error, iscall, roomname) => {
//               // if (iscall == false) 
//               await del_busyData(user.id.toString());
//             // });
//             // Get all conversations
//             getAllConversation(user.id.toString(), (result) => {
//               if (result.status) {
//                 //Get conversation detail along with user table for further user list to android
//                 if (result.conversations.length > 0) {
//                   var androidUserList = _.reject(result.conversations, ['created_at', null]);
//                   androidUserList = _.orderBy(androidUserList, ['last_msg_time'], ['asc']);
//                   getAllpinUnpinList(user.id.toString()).then((response) => {
//                     models.instance.ConversationMute.find({ mute_by: { $eq: models.uuidFromString(user.id.toString()) } }, { raw: true, allow_filtering: true }, function (error, muteconv) {
//                       if (error) {
//                         callback({ status: false });
//                       } else {

//                         var allMuteActiveConv = [];
//                         var muData = [];
//                         var mute_id = {};
//                         var mute_duration = {};
//                         _.forEach(muteconv, function (mv, mk) {
//                           if (mv.mute_status == "active") {
//                             allMuteActiveConv.push(mv.conversation_id.toString());
//                             mute_id[mv.conversation_id.toString()] = mv.mute_id;
//                             mute_duration[mv.conversation_id.toString()] = mv.mute_duration;
//                             muData.push(mv);
//                           }
//                         });


//                         _.forEach(androidUserList, function (val, k) {
//                           val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
//                           val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
//                           if (allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1) {
//                             val['isMute'] = true;
//                             val['mute_id'] = mute_id[val.conversation_id.toString()];
//                             val['mute_duration'] = mute_duration[val.conversation_id.toString()];
//                             val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
//                           } else {
//                             val['isMute'] = false;
//                             val['mute_id'] = false;
//                             val['mute_duration'] = false;
//                             val['muteData'] = {};
//                           }

//                           if (val['msg_status'] == null) {
//                             val['msg_status'] = "0";
//                           } else {
//                             var myno = val['msg_status'].substring(val['msg_status'].indexOf(user.id.toString()) + 37);
//                             val['msg_status'] = Number(myno.split("@")[0]) > 0 ? myno.split("@")[0] : "0";
//                           }
//                           val['participants_name'] = get_participants_name(alluserlist, val.participants);
//                         });
//                         console.log("608 ", moment().format("HH:mm:ss:SSS"));
//                         res.send({
//                           alluserlist: alluserlist,
//                           user: user,
//                           msg: msg,
//                           myUserList: androidUserList,
//                           session_id: session_id
//                         });
//                       }
//                     });
//                   }).catch((err) => {
//                     console.log(err);
//                   });
//                 } else {
//                   res.send({
//                     alluserlist: [], user: {}, msg: msg,
//                     session_id: session_id, myUserList: []
//                   });
//                 }
//               } else {
//                 console.log(result);
//               }
//             });
//           }).catch(function (err2) {
//             console.log(err2);
//           });
//         } else {
//           res.send({
//             alluserlist: [], user: {}, msg: "Password does not match",
//             session_id: session_id, myUserList: []
//           });
//         }
//       }
//     });
//   });
// });

function get_participants_name(alluserlist, participants) {
  var participants_name = [];
  // for(var i=0; i<participants.length; i++){
  //     // participants_name.push(_.find(alluserlist, { 'id': participants[i] }));
  //     console.log(_.find(alluserlist, { 'id': participants[i] }));
  // }
  return "participants_name";
}

function idToNameArr(idArry) {
  var namearr = [];
  _.each(idArry, function (v, k) {
    namearr.push(alluserOnLoad[v])
  });
  return namearr;
}

function checkThisIdActiveOrNot(array, myid) {
  if (array == null) {
    return true;
  } else if (array.indexOf(myid) > -1) {
    return false;
  } else {
    return true;
  }
}


function getConfirmation(data, userid) {
  return new Promise((resolve, reject) => {
    let myval = 1;
    if (data != null) {
      if (data.has_delete != null) {
        if (data.has_delete.indexOf(userid) === -1) {
          myval++;
        }
      }

      if (data.has_hide != null) {
        if (data.has_hide.indexOf(userid) === -1) {
          myval++;
        }
      }

      resolve({ myval: myval });
    } else {
      reject({ myval: 0 });
    }
  });
}

/* after login reload all data by user id. */
router.post('/reload_conversation', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ alluserlist: [], myUserList: [], session_id: "", error: err });
    else {
      console.log(719, req.body);

      var session_id = req.sessionID;
      models.instance.Users.find({ company_id: models.timeuuidFromString(decoded.company_id.toString()) }, { raw: true, allow_filtering: true }, function (err, users) {
        if (err) res.status(404).send({ alluserlist: [], myUserList: [], session_id: "", error: err });
        if(users.length == 0) res.status(404).send({ alluserlist: [], myUserList: [], session_id: "", error: "No user found. Please Login." });
        
        //user is an array of plain objects with only name and age
        var alluserlist = [];
        var user = '';
        var msg = "true";
        var flag = true;
        _.each(users, function (v, k) {
          alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id });
          alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
          if (v.id.toString() == decoded.id) {
            if (v.device.indexOf(decoded.device_id) == -1) {
              flag = false;
              res.status(404).send({ alluserlist: [], myUserList: [], session_id: "", error: "Device is not listed. Please Login." });
            }
            user = { id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, gcm_id : v.gcm_id, company_id: v.company_id };
            userCompany_id[decoded.id] = v.company_id.toString();
          }
        });
        if (flag) {
          if (user == '') {
            res.send({ status: false });
          }
          
          res.redirect('/android_api/home/' + decoded.id + '/' + decoded.email + '/' + user.gcm_id + '/' + decoded.device_id);
          // Get all conversations
          // getAllConversation(decoded.id.toString(), (result) => {
          //   customTitle({ user_id: user.id.toString(), type: 'get' }, (allNic) => {
          //     var allCusName = {};
          //     if (allNic.status) {
          //       _.each(allNic.result, function (nv, nk) {
          //         allCusName[nv.change_id] = { nv };
          //       })
          //     }
          //     if (result.status) {
          //       var conversations = result.conversations;
          //       var myConversationList = [] // keep all conversatons in this array
          //       var conversationTitle = {};
          //       var conversationType = {};
          //       var conversationWith = {};
          //       var conversationImage = {};
          //       var conversationPrivacy = {};
          //       var conversationStatus = {};
          //       var conversationParticipants = {};
          //       var conversationParticipants_admin = {};
          //       var userName = {};
          //       var userImg = {};
          //       var myConversationID = "";
          //       var conversationisActive = {};

          //       alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

          //       // _.each(alluserlist, function(users,k){
          //       //   userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
          //       //   userImg[users.id] = users.img;
          //       // });
          //       _.each(alluserlist, function (users, k) {
          //         userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
          //         if (allCusName[users.id] != undefined) {
          //           userName[users.id] = allCusName[users.id]['nv'].change_title;
          //         }
          //         userImg[users.id] = users.img;
          //       });

          //       //Get conversation detail along with user table for further user list to android
          //       if (result.conversations.length > 0) {
          //         _.each(result.conversations, function (conversations, k) {
          //           if (!isEmpty(conversations.title)) {
          //             if (checkThisIdActiveOrNot(conversations.is_active, user.id.toString())) {
          //               if (myConversationList.indexOf(conversations.conversation_id.toString()) === -1) {

          //                 myConversationList.push(conversations.conversation_id.toString());
          //                 conversationTitle[conversations.conversation_id.toString()] = conversations.title;
          //                 conversationType[conversations.conversation_id.toString()] = conversations.single;
          //                 conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
          //                 conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
          //                 conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
          //                 conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
          //                 conversationStatus[conversations.conversation_id.toString()] = conversations.status;
          //                 conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;

          //                 if (conversations.single == 'yes') {
          //                   if (conversations.participants.length == 1) {
          //                     myConversationID = conversations.conversation_id.toString();
          //                   } else {
          //                     _.forEach(conversations.participants, function (pv, pk) {
          //                       // console.log(491, pv);
          //                       if (pv !== null && pv.toString() !== user.id.toString()) {
          //                         conversationWith[conversations.conversation_id.toString()] = pv;
          //                       }
          //                     });
          //                   }
          //                 }
          //               }
          //             }
          //           }
          //         });

          //         if (myConversationList.length > 0) {
          //           getAllMsg(myConversationList, (result) => {

          //             if (result.status) {

          //               var all_unread = [];
          //               var all_message = [];
          //               var counts = {};
          //               var last_conversation_id = [];
          //               var androidUserList = [];
          //               var androidCallList = [];

          //               // Push all messages
          //               _.forEach(result.data, function (amv, amk) {
          //                 if (amv.length > 0) {

          //                   _.each(amv, function (mv, mk) {

          //                     if (mv.has_hide != null) {
          //                       if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
          //                         if (mv.has_delete != null) {
          //                           if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
          //                             // if ((mv.has_delete).indexOf('Sender delete it') > -1) {

          //                             // } else {
          //                             all_message.push(mv);
          //                             // }
          //                           }
          //                         } else {
          //                           all_message.push(mv);
          //                         }
          //                       }
          //                     } else {
          //                       if (mv.has_delete != null) {
          //                         if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
          //                           // if ((mv.has_delete).indexOf('Sender delete it') > -1) {

          //                           // }else{
          //                           all_message.push(mv);
          //                           // }
          //                         }
          //                       } else {
          //                         all_message.push(mv);
          //                       }
          //                     }
          //                   });
          //                 }
          //               });

          //               // Get all unread message
          //               var all_message_orderBy = all_message;

          //               _.forEach(all_message_orderBy, function (amv, amk) {
          //                 if (amv.msg_status == null && amv.sender != null && amv.sender.toString() != user.id.toString()) {
          //                   //all_unread.push(amv);
          //                 }
          //                 if(amv.msg_status == null){
          //                   amv.msg_status = []
          //                 }
          //                 if(amv.msg_status.indexOf(user.id.toString()) > -1){
          //                   all_unread.push(amv);
          //                 }
          //               });

          //               //Count unread message and push it to counts array
          //               all_unread.forEach(function (x) {
          //                 counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0) + 1;
          //               });

          //               //Get All last Message
          //               _.forEach(all_message_orderBy, function (amv, amk) {
          //                 if (last_conversation_id.indexOf(amv.conversation_id.toString()) === -1) {
          //                   last_conversation_id.push(amv.conversation_id.toString());
          //                   // all_last_message.push(amv);
          //                   if (amv.conversation_id.toString() !== myConversationID) {
          //                     if (userName[conversationWith[amv.conversation_id.toString()]] == undefined) userName[conversationWith[amv.conversation_id.toString()]] = "Deleted User";
          //                     if (conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
          //                     if (amv.participants_admin != null) {
          //                       participants_admin = amv.participants_admin;
          //                     }
          //                     if (!isEmpty(amv.msg_body)) {
          //                       androidUserList.push({
          //                         'conversation_id': amv.conversation_id,
          //                         'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
          //                         'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
          //                         'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
          //                         'privacy': conversationPrivacy[amv.conversation_id.toString()],
          //                         'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
          //                         'participants': conversationParticipants[amv.conversation_id.toString()],
          //                         'status': conversationStatus[amv.conversation_id.toString()],
          //                         'is_active': (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()] : []),
          //                         'participants_admin': (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()] : []),
          //                         'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
          //                         'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
          //                         'msg_id': amv.msg_id,
          //                         'msg_type': amv.msg_type,
          //                         'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
          //                         'sender_name': amv.sender_name,
          //                         'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
          //                       });
          //                     }

          //                     if (amv.msg_type == 'call') {
          //                       androidCallList.push({
          //                         'conversation_id': amv.conversation_id,
          //                         'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
          //                         'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
          //                         'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
          //                         'privacy': conversationPrivacy[amv.conversation_id.toString()],
          //                         'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
          //                         'participants': conversationParticipants[amv.conversation_id.toString()],
          //                         'status': conversationStatus[amv.conversation_id.toString()],
          //                         'is_active': (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()] : []),
          //                         'participants_admin': (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()] : []),
          //                         'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
          //                         'created_at': (amv.msg_body == null ? 'null' : amv.created_at),
          //                         'call_duration': (amv.call_duration == "" ? 0 : amv.call_duration),
          //                         'call_type': amv.call_type,
          //                         'call_status': amv.call_status,
          //                         'call_msg': amv.call_msg,
          //                         'msg_id': amv.msg_id,
          //                         'msg_type': amv.msg_type,
          //                         'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
          //                         'sender_name': amv.sender_name,
          //                         'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
          //                       });
          //                     }
          //                   }

          //                 }
          //               });
          //               // console.log(930, androidUserList);

          //               getAllpinUnpinList(user.id.toString())
          //                 .then((response) => {

          //                   _.forEach(androidUserList, function (val, k) {
          //                     val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
          //                     val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
          //                   });

          //                   var query = {
          //                     mute_by: { $eq: models.uuidFromString(user.id.toString()) }
          //                   };

          //                   models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function (error, all_conv) {
          //                     if (error) {
          //                       callback({ status: false });
          //                     } else {

          //                       var allMuteActiveConv = [];
          //                       var muData = [];
          //                       var mute_id = {};
          //                       var mute_duration = {};
          //                       _.forEach(all_conv, function (v, k) {
          //                         if (v.mute_status == "active") {
          //                           allMuteActiveConv.push(v.conversation_id.toString());
          //                           mute_id[v.conversation_id.toString()] = v.mute_id;
          //                           mute_duration[v.conversation_id.toString()] = v.mute_duration;
          //                           muData.push(v);
          //                         }
          //                       });

          //                       _.forEach(androidUserList, function (val, k) {

          //                         if (allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1) {
          //                           val['isMute'] = true;
          //                           val['mute_id'] = mute_id[val.conversation_id.toString()];
          //                           val['mute_duration'] = mute_duration[val.conversation_id.toString()];
          //                           val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
          //                         } else {
          //                           val['isMute'] = false;
          //                           val['mute_id'] = false;
          //                           val['mute_duration'] = false;
          //                           val['muteData'] = {};
          //                         }
          //                       });

          //                       var data = {
          //                         keySpace: user.company_id
          //                       };

          //                       models.instance.Tag.find({ tagged_by: models.uuidFromString(user.id.toString()) }, { allow_filtering: true }, function (tagserr, tags) {

          //                         if (tagserr) {
          //                           throw tagserr;
          //                         } else {
          //                           hayvenjs.room_status(data, (demodata) => {
          //                             if (demodata.staus) {

          //                               _.forEach(demodata.rooms, function (bbv, bbk) {
          //                                 if (bbv.single == 'yes') {

          //                                   if (bbv.participants.length > 1) {
          //                                     _.forEach(bbv.participants, function (bpv, bpk) {
          //                                       if (bpv !== null && bpv.toString() !== user.id.toString()) {
          //                                         conversationWith[bbv.conversation_id.toString()] = bpv;
          //                                       }
          //                                     });
          //                                   }
          //                                 }
          //                               });
          //                               var unique_conversation = [];
          //                               var my_room = [];
          //                               var joined_room = [];
          //                               var to_be_join = [];
          //                               _.forEach(demodata.rooms, function (dv, dk) {
          //                                 if (unique_conversation.indexOf(dv.conversation_id.toString()) == -1 && dv.participants !== null) {
          //                                   unique_conversation.push(dv.conversation_id.toString());
          //                                   if (dv.single == 'yes') {
          //                                     // console.log(dv.conversation_id.toString()+"=="+userName[conversationWith[dv.conversation_id.toString()]]);
          //                                     // dv['join_status'] = 'personal';
          //                                     // dv['user_name'] =  userName[conversationWith[dv.conversation_id.toString()]];
          //                                     // dv['user_img'] = userImg[conversationWith[dv.conversation_id.toString()]];
          //                                   } else {
          //                                     if (dv.created_by) {
          //                                       if (dv.created_by.toString() == user.id.toString()) {
          //                                         dv['join_status'] = 'my_room';
          //                                         dv['user_name'] = null;
          //                                         dv['user_img'] = null;
          //                                         dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
          //                                         my_room.push(dv);
          //                                       } else if (dv.participants.indexOf(user.id.toString()) > -1) {
          //                                         dv['join_status'] = 'joined_room';
          //                                         dv['user_name'] = null;
          //                                         dv['user_img'] = null;
          //                                         dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
          //                                         joined_room.push(dv);
          //                                       } else if (dv.participants.indexOf(user.id.toString()) == -1 && dv.privacy == 'public') {
          //                                         dv['join_status'] = 'to_be_join';
          //                                         dv['user_name'] = null;
          //                                         dv['user_img'] = null;
          //                                         dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
          //                                         to_be_join.push(dv);
          //                                       }
          //                                     }

          //                                   }
          //                                 }
          //                               });
          //                             }
          //                             androidUserList = _.filter(androidUserList, function(aul){ return aul.conversation_title != 'Deleted User';});
          //                             res.send({
          //                               alluserlist: alluserlist,
          //                               conversations: conversations,
          //                               user: user,
          //                               msg: msg,
          //                               tags: tags,
          //                               myUserList: _.orderBy(androidUserList, ['created_at'], ['desc']),
          //                               androidCallList: androidCallList,
          //                               session_id: req.sessionID,
          //                               my_room: my_room,
          //                               joined_room: joined_room,
          //                               to_be_join: to_be_join
          //                               // rooms: demodata.rooms
          //                             });
          //                           });

          //                         }
          //                       });

          //                     };
          //                   });

          //                 }).catch((err) => {
          //                   console.log(err);
          //                 });

          //             } else {
          //               console.log(result);
          //             }
          //           });
          //         }
          //       } else {
          //         res.send({
          //           alluserlist: alluserlist,
          //           conversations: '',
          //           user: user,
          //           msg: msg,
          //           myUserList: '',
          //           session_id: req.sessionID
          //         });
          //       }
          //     } else {
          //       console.log(result);
          //     }
          //   });
          // });
        }
      });
    }
  });
});

router.post('/newreload_conversation', function (req, res, next) {
  var session_id = req.sessionID;
  console.log("1021 ", moment().format("HH:mm:ss:SSS"));
  models.instance.Users.find({}, { raw: true, allow_filtering: true }, function (err, users) {
    if (err) throw err;
    //user is an array of plain objects with only name and age
    var alluserlist = [];
    var user = [];
    var msg = '';
    _.each(users, function (v, k) {
      alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id });
      alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
    });

    _.each(users, function (v, k) {
      if (req.body.id == v.id) {
        console.log("1035 ", moment().format("HH:mm:ss:SSS"));
        msg = "true";
        user = { id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id };
        // console.log(user);
        userCompany_id[user.id] = user.company_id.toString();

        // Get all conversations
        getAllConversation(user.id.toString(), (result) => {
          if (result.status) {
            //Get conversation detail along with user table for further user list to android
            if (result.conversations.length > 0) {
              var androidUserList = _.reject(result.conversations, ['created_at', null]);
              androidUserList = _.orderBy(androidUserList, ['last_msg_time'], ['asc']);
              getAllpinUnpinList(user.id.toString()).then((response) => {
                models.instance.ConversationMute.find({ mute_by: { $eq: models.uuidFromString(user.id.toString()) } }, { raw: true, allow_filtering: true }, function (error, muteconv) {
                  if (error) {
                    callback({ status: false });
                  } else {

                    var allMuteActiveConv = [];
                    var muData = [];
                    var mute_id = {};
                    var mute_duration = {};
                    _.forEach(muteconv, function (mv, mk) {
                      if (mv.mute_status == "active") {
                        allMuteActiveConv.push(mv.conversation_id.toString());
                        mute_id[mv.conversation_id.toString()] = mv.mute_id;
                        mute_duration[mv.conversation_id.toString()] = mv.mute_duration;
                        muData.push(mv);
                      }
                    });


                    _.forEach(androidUserList, function (val, k) {
                      val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
                      val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
                      if (allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1) {
                        val['isMute'] = true;
                        val['mute_id'] = mute_id[val.conversation_id.toString()];
                        val['mute_duration'] = mute_duration[val.conversation_id.toString()];
                        val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
                      } else {
                        val['isMute'] = false;
                        val['mute_id'] = false;
                        val['mute_duration'] = false;
                        val['muteData'] = {};
                      }

                      if (val['msg_status'] == null) {
                        val['msg_status'] = "0";
                      } else {
                        var myno = val['msg_status'].substring(val['msg_status'].indexOf(user.id.toString()) + 37);
                        val['msg_status'] = Number(myno.split("@")[0]) > 0 ? myno.split("@")[0] : "0";
                      }
                      val['participants_name'] = get_participants_name(alluserlist, val.participants);
                    });
                    console.log("1084 ", moment().format("HH:mm:ss:SSS"));
                    res.send({
                      alluserlist: alluserlist,
                      user: user,
                      msg: msg,
                      myUserList: androidUserList,
                      session_id: session_id
                    });
                  }
                });
              }).catch((err) => {
                console.log(err);
              });
            } else {
              res.send({
                alluserlist: [], user: {}, msg: msg,
                session_id: session_id, myUserList: []
              });
            }
          } else {
            console.log(result);
          }
        });
      }
    });
  });
});


/* Send fcm . */
/* Send fcm . */
// router.post('/fcm_send', ensureToken, function (req, res, next) {
//   jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
//     if (err) res.status(403).send({ error: err });
//     token_verify_by_device_id(decoded).then(() => {
//       var sender_id = req.body.sender_id;
//       var reciver_id = models.uuidFromString(req.body.reciver_id);
//       var call_type = req.body.call_type;
//       var msg = req.body.msg;

//       models.instance.Users.find({ id: reciver_id }, { raw: true, allow_filtering: true }, function (err, user) {
//         if (err) throw err;

//         if (user[0].fcm_id != null) {
//           var message = {
//             to: user[0].fcm_id,
//             data: {
//               sender_id: sender_id,
//               reciver_id: req.body.reciver_id,
//               reciver_token: user[0].fcm_id,
//               call_type: call_type,
//               msg: msg
//             }
//           };

//           if (call_type == "cancel") {
//             set_status(models.uuidFromString(sender_id), reciver_id, 0, (result, err1) => {
//               if (err1) throw err1;
//               if (result.status) {
//                 fcm.send(message, function (err, response) {
//                   if (err) {
//                     console.log(err);
//                     res.send({ status: "FCM Error: ", response: err });
//                   } else {
//                     res.send({ status: "Successfully sent with response: ", response: response, message: message });
//                   }
//                 });
//               }
//             });
//           }
//           else if (call_type == "accept") {
//             fcm.send(message, function (err, response) {
//               if (err) {
//                 console.log(err);
//                 res.send({ status: "FCM Error: ", response: err });
//               } else {
//                 res.send({ status: "Successfully sent with response: ", response: response, message: message });
//               }
//             });
//           }
//           else {
//             if (user[0].is_busy == 1) {
//               res.send({ status: "User is busy" });
//             }
//             else {
//               set_status(models.uuidFromString(sender_id), reciver_id, 1, (result, err1) => {
//                 if (err1) throw err1;
//                 if (result.status) {
//                   fcm.send(message, function (err, response) {
//                     if (err) {
//                       console.log(err);
//                       res.send({ status: "FCM Error: ", response: err });
//                     } else {
//                       res.send({ status: "Successfully sent with response: ", response: response, message: message });
//                     }
//                   });
//                 }
//               });
//             }
//           }
//         }
//         else {
//           res.send({ status: "user have no gcm id" });
//         }
//       });
//     }).catch((e) => {
//       res.status(403).send(e);
//     });
//   });
// });


// Url for add member ID in conversation tbl
router.post("/personalConCreate", function (req, res, next) {

  createPersonalConv(req.body.user_id, req.body.targetID, req.body.ecosystem, req.body.company_id, (result, err) => {
    if (err) {
      if (err) throw err;
    } else if (result.status) {
      // res.send(JSON.stringify(result));
      var conversation_id = result.conversation_id;
      models.instance.Conversation.update(
        { conversation_id: models.uuidFromString(conversation_id.toString()), company_id: models.timeuuidFromString(req.body.company_id) },
        {
          is_active: { $remove: [req.body.targetID] },
        }, update_if_exists,
        function (err) {
          if (err) {
            console.log('fail');
          } else {
            console.log('success');
          }
        }
      );
      findConversationHistory(conversation_id,null, (result, error) => {

        if (result.status) {
          var conversation_list = _.sortBy(result.conversation, ["created_at"]);
          var unseenId = [];
          _.each(conversation_list, function (vc, kc) {
            if (vc.msg_status == null) {
              console.log(291, vc.msg_status);
              unseenId.push(vc.msg_id.toString());
            } else {
              var seenId = vc.msg_status;
              if (seenId.indexOf(req.body.user_id) == -1) {
                unseenId.push(vc.msg_id.toString());
              }
            }
          });

          get_myTags(conversation_id.toString(), req.body.user_id, (tRes, Terr) => {

            if (Terr) throw Terr;



            get_messages_tag(conversation_id.toString(), req.body.user_id, (mtgsRes, mtgsErr) => {

              if (Terr) throw Terr;

              var tagID = [];
              var tags = [];
              var condtagsid = [];
              var usedTag = {};

              _.each(tRes.Ctags, function (value, key) {
                tagID.push(value.id.toString());
                if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                  condtagsid.push(value.tag_id.toString());
                }
              });

              var myConvList = JSON.parse(req.body.my_list);

              getAllTagsforList(myConvList, (result, error) => {
                if (result.status) {
                  var tagsIDS = [];

                  _.each(result.data, function (v, k) {
                    if (v.length > 0) {
                      _.each(v, function (vt, kt) {
                        if (tagsIDS.indexOf(vt.tag_id.toString()) === -1) {
                          tagsIDS.push(vt.tag_id.toString());
                        }
                      });
                    }
                  });

                  _.each(tRes.tags, function (v, k) {
                    if (tagsIDS.indexOf(v.tag_id) > -1) {
                      usedTag[v.tag_id] = true;
                    } else {
                      usedTag[v.tag_id] = false;
                    }
                  });

                  if (unseenId.length > 0) {
                    update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) => {
                      if (result.status) {
                        res.send({
                          status: true,
                          conversation_id: conversation_id,
                          result: conversation_list,
                          totalTags: tRes.tags,
                          messagestag: mtgsRes.tags,
                          con_tag_id: condtagsid,
                          usedTag: usedTag,
                          tagsIDS: tagsIDS
                        });
                      } else {
                        console.log(result);
                      }
                    });
                  } else {
                    res.send({
                      status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: usedTag,
                      tagsIDS: tagsIDS
                    });
                  }

                } else {
                  res.send({ status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: [] });
                }
              });


            });
          });
        } else {
          res.send({ status: false, conversation_id: conversation_id, result: [] });
        }
      });

    } else {
      res.send(false);
    }
  });
});

router.post("/save_api_tag", ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      var message_msgIdsFtag = JSON.parse(req.body.messagestag);
      var message_messgids = JSON.parse(req.body.msgidlist);
      var tagTitleArr = []
      tagTitleArr.push(req.body.title);
      console.log({ message_msgIdsFtag, message_messgids, tagTitleArr });
      saveTag(message_msgIdsFtag, req.body.convid, message_messgids, req.body.uid, tagTitleArr, req.body.type, (result, err) => {
        if (err) {
          throw err;
        } else {
          saveConTag(result.tags, req.body.convid, (cresult, cerr) => {
            if (err) {
              throw err;
            } else {
              if (cresult.status) {
                res.send({
                  status: true,
                  tags: cresult.tags[0],
                  roottags: cresult.roottags[0],
                  mtagsid: result.mtagsid
                });

              } else {
                res.send({ status: false });

              }
            }
          });
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

router.post("/active_tag_api", ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      console.log('active_tag_api', req.body);
      var message_msgIdsFtag = JSON.parse(req.body.messagestag);
      saveConvD(message_msgIdsFtag, req.body.title, req.body.tagid, req.body.convid, (cresult, cerr) => {
        if (cerr) {
          res.send({ status: false });
        } else {
          // res.send({status: true,response:cresult});
          res.send({
            status: true,
            id: cresult.id,
            rootid: cresult.rootid,
          });
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

router.post("/inactive_tag_api", ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      console.log('inactive_tag_api', req.body);
      var message_msgIdsFtag = JSON.parse(req.body.messagestag);
      deleteThisTag(message_msgIdsFtag, req.body.title, req.body.tagid, req.body.convid, (respond, error) => {
        if (error) {
          res.send({ status: false });
        } else if (respond.status) {
          res.send({ status: true, response: respond });
        } else {
          res.send({ status: false });
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

router.post("/delete_unused_tag", ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      deleteUnusedTag(req.body.roottagid, req.body.convid, req.body.title, (respond, error) => {
        if (error) {
          if (error) throw error;
        } else if (respond.status) {
          res.send({ status: true, response: respond });
        } else {
          res.send({ status: false });
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});



var get_messages_tag = (conversation_id, user_id, callback) => {
  models.instance.MessagesTag.find({ conversation_id: models.uuidFromString(conversation_id), tagged_by: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function (err, tags) {
    if (err) {
      callback({ status: false, err: err });
    } else {
      callback({ status: true, tags: tags });
    }
  });
};

var get_myTags = (conversation_id, user_id, callback) => {
  models.instance.Tag.find({
    tagged_by: models.uuidFromString(user_id),
    type: "CONNECT"
  }, {
    allow_filtering: true
  }, function (tagserr, tags) {
    if (tagserr) {
      callback({
        status: false,
        err: tagserr
      });
    } else {

      models.instance.Convtag.find({
        conversation_id: models.uuidFromString(conversation_id)
      }, {
        allow_filtering: true
      }, function (err, Ctags) {
        if (tagserr) {
          callback({
            status: false,
            err: tagserr
          });
        } else {
          var condtagsid = [];
          var tagList = [];
          var conv_tag = {};
          _.each(Ctags, function (value, key) {
            if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
              condtagsid.push(value.tag_id.toString());
              conv_tag[value.tag_id.toString()] = value.id.toString();
            }
          });
          console.log(conv_tag);
          _.each(tags, function (value, key) {

            var data = {};
            if (condtagsid.indexOf(value.tag_id.toString()) > -1) {
              data['isActive'] = true;
            } else {
              data['isActive'] = false;
            }
            data['tag_id'] = value.tag_id.toString();
            data['tagged_by'] = value.tagged_by.toString();
            data['title'] = value.title;
            data['type'] = value.type;
            data['created_at'] = value.created_at;
            if (conv_tag[value.tag_id.toString()] == null || conv_tag[value.tag_id.toString()] == undefined) {
              data['conv_tag_id'] = 0;
            } else {
              data['conv_tag_id'] = conv_tag[value.tag_id.toString()];
            }

            tagList.push(data);
          });

          callback({
            status: true,
            tags: tagList,
            Ctags: Ctags
          });
        }
      });
    }
  });
};

// All conversation history
router.post("/conversation_history", function (req, res, next) {
  var conversation_id = models.uuidFromString(req.body.conversation_id);
  findConversationHistory(conversation_id,null, (result, error) => {
    console.log(515, conversation_id, req.body.user_id);
    if (result.status) {
      var conversation_list = _.sortBy(result.conversation, ["created_at"]);
      var unseenId = [];
      _.each(conversation_list, function (vc, kc) {
        if (vc.msg_status == null) {
          console.log(291, vc.msg_status);
          unseenId.push(vc.msg_id.toString());
        } else {
          var seenId = vc.msg_status;
          if (seenId.indexOf(req.body.user_id) == -1) {
            unseenId.push(vc.msg_id.toString());
          }
        }
      });

      if (unseenId.length > 0) {
        update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) => {
          if (result.status) {
            res.send({ status: true, conversation_id: conversation_id, result: conversation_list });
          } else {
            console.log(result);
          }
        });
      } else {
        res.send({ status: true, conversation_id: conversation_id, result: conversation_list });
      }
    } else {
      res.send({ status: false, conversation_id: conversation_id, result: [] });
    }
  });
});

// Delete a message
router.post('/commit_msg_delete', function (req, res, next) {
  commit_msg_delete(req.body.convid, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
    res.json(result);
  });
});

// Flag and Unflag
// Single msg
router.post('/flag_unflag', function (req, res, next) {
  flag_unflag(req.body.msgid, req.body.uid, req.body.is_add, req.body.convid, (result) => {
    res.json(result);
  });
});
// multiple msg
router.post('/flag_unflags', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      var data = req.body.msgid;
      var results = [];

      if (!_.isArray(data)) {
        data = JSON.parse(data);
      }
      _.forEach(data, function (v, k) {
        read_msg_data(v, (rep) => {
          var yesno = (rep.has_flagged == null) ? 'yes' : (rep.has_flagged).indexOf(req.body.uid) > -1 ? 'no' : 'yes';
          flag_unflag(v, req.body.uid, yesno, req.body.convid, (result) => {
            console.log(result);
            results.push(result);
          });
          if (data.length == (k + 1)) {
            res.json(results);
          }
        });
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

router.post('/add_reac_emoji', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      check_reac_emoji_list(req.body.msgid, req.body.user_id, (result) => {
        if (result.status) {
          if (result.result.length == 0) {
            // add first time like/reaction
            add_reac_emoji(req.body.conversation_id, req.body.msgid, req.body.user_id, req.body.user_fullname, req.body.emoji, (result1) => {
              // console.log(290, result1);
              res.json(result1);
            });
          } else {
            if (result.result[0].emoji_name == req.body.emoji) {
              // delete same user same type reaction
              delete_reac_emoji(req.body.conversation_id, req.body.msgid, req.body.user_id, req.body.emoji, (result2) => {
                res.json(result2);
              });
            } else {
              update_reac_emoji(req.body.conversation_id, req.body.msgid, req.body.user_id, req.body.emoji, (result3) => {
                res.json(result3);
              });
            }
          }
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

// Url for add ID in is_active
router.post("/hideUserinSidebar", ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      var response = {};
      if (req.body.conversation_id != undefined && req.body.targetID != undefined) {


        models.instance.Conversation.update(
          { conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) },
          {
            is_active: { $add: [req.body.targetID] },
          }, update_if_exists,
          function (err) {
            if (err) {
              response['status'] = false;
              response['response'] = err;
              res.json(response);
            } else {
              response['status'] = true;
              response['response'] = 'success';
              res.json(response);
            }
          }
        );
      } else {
        response['status'] = false;
        response['response'] = 'Params Missing';
        res.json(response);
      }
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

// Flag and Unflag
router.post('/test', function (req, res, next) {
  console.log("Test work");
});

// Reply open_thread
router.post('/open_thread', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      replyId(req.body.msg_id, req.body.conversation_id, (result, err) => {
        if (result.status) {
          find_reply_list(req.body.msg_id, req.body.conversation_id, async (result2) => {
            result2["thread_id"] = _.toString(result.result);
            result2.msgdata = result.msgdata;
            if(result.msgdata.msg_type == 'checklist'){
              result2['checklist'] = await getsinglemsgchecklist(result.msgdata.msg_id);
            }else{
				result2['checklist'] = { data: [] };
			}
            res.json(result2);
          });
        } else {
          res.json(result);
        }
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});


router.post('/testgetConvData', function (req, res, next) {
  console.log(1420, req.body.user_id);
  console.log(1421, req.body.convid);
  console.log(1422, req.body.my_list);
  // console.log(userCompany_id[req.body.user_id]);
  createPersonalConv2(req.body.user_id, req.body.convid, req.body.ecosystem, req.body.company_id, (result, err) => {
    if (err) {
      if (err) throw err;
    } else if (result.status) {
      // res.send(JSON.stringify(result));
      var conversation_id = result.conversation_id;
      models.instance.Conversation.update(
        { conversation_id: models.uuidFromString(conversation_id.toString()), company_id: models.timeuuidFromString(req.body.company_id) },
        {
          is_active: { $remove: [req.body.convid] },
        }, update_if_exists,
        function (err) {
          if (err) {
            console.log('fail');
          } else {
            console.log('success');
          }
        }
      );
      var conversation_id = models.uuidFromString(req.body.convid);
      findConversationHistory(conversation_id,null, (result, error) => {
        if (result.status) {
          var conversation_list = _.sortBy(result.conversation, ["created_at"]);
          var unseenId = [];
          var checklistMsgId = [];
          _.each(conversation_list, function (vc, kc) {
            if (vc.msg_status == null) {
              console.log(291, vc.msg_status);
              unseenId.push(vc.msg_id.toString());
            } else {
              var seenId = vc.msg_status;
              if (seenId.indexOf(req.body.user_id) == -1) {
                unseenId.push(vc.msg_id.toString());
              }
            }
            if (vc.msg_type == 'checklist') {
              checklistMsgId.push(models.timeuuidFromString(vc.msg_id.toString()));
            }
          });


          get_myTags(conversation_id.toString(), req.body.user_id, (tRes, Terr) => {
            if (Terr) throw Terr;

            get_messages_tag(conversation_id.toString(), req.body.user_id, (mtgsRes) => {
              var tagID = [];
              var tags = [];
              var condtagsid = [];
              var usedTag = {};

              _.each(tRes.Ctags, function (value, key) {
                tagID.push(value.id.toString());
                if (condtagsid.indexOf(value.tag_id.toString()) === -1) {
                  condtagsid.push(value.tag_id.toString());
                }
              });

              var myConvList = JSON.parse(req.body.my_list);

              getAllTagsforList(myConvList, (result, error) => {
                if (result.status) {
                  var tagsIDS = [];

                  _.each(result.data, function (v, k) {
                    if (v.length > 0) {
                      _.each(v, function (vt, kt) {
                        if (tagsIDS.indexOf(vt.tag_id.toString()) === -1) {
                          tagsIDS.push(vt.tag_id.toString());
                        }
                      });
                    }
                  });

                  _.each(tRes.tags, function (v, k) {
                    if (tagsIDS.indexOf(v.tag_id) > -1) {
                      usedTag[v.tag_id] = true;
                    } else {
                      usedTag[v.tag_id] = false;
                    }
                  });

                  if (checklistMsgId.length > 0) {
                    var query = {
                      msg_id: { '$in': checklistMsgId }
                    };
                    models.instance.MessageChecklist.find(query, { raw: true, allow_filtering: true }, function (cerror, cresult) {
                      if (cerror) {
                        res.json({ status: false, error: cerror, conversation_id: conversation_id, result: [] });
                      } else {
                        if (cresult.length > 0) {
                          _.each(conversation_list, function (mv, mk) {
                            if (mv.msg_type == 'checklist') {
                              var thismsgcl = [];
                              _.each(cresult, function (cv, ck) {
                                if (cv.msg_id.toString() == mv.msg_id.toString()) {
                                  thismsgcl.push(cv);
                                  console.log(thismsgcl);
                                }
                              });
                              console.log(thismsgcl);
                              conversation_list[mk]['checklist'] = thismsgcl;
                            } else {
                              conversation_list[mk]['checklist'] = [];
                            }
                          })
                        }

                        if (unseenId.length > 0) {
                          update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) => {
                            if (result.status) {
                              res.json({
                                status: true,
                                conversation_id: conversation_id,
                                result: conversation_list,
                                totalTags: tRes.tags,
                                messagestag: mtgsRes.tags,
                                con_tag_id: condtagsid,
                                usedTag: usedTag,
                                tagsIDS: tagsIDS
                              });
                            } else {
                              console.log(result);
                            }
                          });
                        } else {
                          res.json({
                            status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: usedTag,
                            tagsIDS: tagsIDS
                          });
                        }

                      }
                    });
                  } else {
                    _.each(conversation_list, function (mv, mk) {
                      if (mv.msg_type != 'checklist') {
                        conversation_list[mk]['checklist'] = [];
                      }
                    })

                    if (unseenId.length > 0) {
                      update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) => {
                        if (result.status) {
                          res.json({
                            status: true,
                            conversation_id: conversation_id,
                            result: conversation_list,
                            totalTags: tRes.tags,
                            messagestag: mtgsRes.tags,
                            con_tag_id: condtagsid,
                            usedTag: usedTag,
                            tagsIDS: tagsIDS
                          });
                        } else {
                          console.log(result);
                        }
                      });
                    } else {
                      res.json({
                        status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: usedTag,
                        tagsIDS: tagsIDS
                      });
                    }
                  }
                } else {
                  _.each(conversation_list, function (mv, mk) {
                    if (mv.msg_type != 'checklist') {
                      conversation_list[mk]['checklist'] = [];
                    }
                  })
                  res.json({ status: true, conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id: condtagsid, usedTag: [] });
                }
              });


            });
          });
        } else {
          res.json({ status: false, conversation_id: conversation_id, result: [] });
        }
      });
    }
  });
});

router.post('/room_lists', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err });
    token_verify_by_device_id(decoded).then(() => {
      console.log(1881, req.body);

      models.instance.Users.find({ company_id: models.timeuuidFromString(req.body.company_id.toString()) }, { raw: true, allow_filtering: true }, function (err, users) {
        if (err) throw err;
        //user is an array of plain objects with only name and age
        var alluserlist = [];
        var user = '';
        var msg = "true";
        _.each(users, function (v, k) {
          alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id });
          alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
          if (v.id.toString() == req.body.id) {
            user = { id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id };
            userCompany_id[req.body.id] = v.company_id.toString();
          }
        });

        if (user == '') {
          res.send({ status: false });
        }

        // Get all conversations
        getAllConversation(req.body.id.toString(), (result) => {
          if (result.status) {
            var conversations = result.conversations;
            var myConversationList = [] // keep all conversatons in this array
            var conversationTitle = {};
            var conversationType = {};
            var conversationWith = {};
            var conversationImage = {};
            var conversationStatus = {};
            var conversationParticipants = {};
            var conversationParticipants_admin = {};
            var userName = {};
            var userImg = {};
            var myConversationID = "";
            var conversationisActive = {};

            alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

            _.each(alluserlist, function (users, k) {
              userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
              userImg[users.id] = users.img;
            });

            //Get conversation detail along with user table for further user list to android
            if (result.conversations.length > 0) {
              _.each(result.conversations, function (conversations, k) {
                if (!isEmpty(conversations.title)) {
                  if (checkThisIdActiveOrNot(conversations.is_active, user.id.toString())) {
                    if (myConversationList.indexOf(conversations.conversation_id.toString()) === -1) {

                      myConversationList.push(conversations.conversation_id.toString());
                      conversationTitle[conversations.conversation_id.toString()] = conversations.title;
                      conversationType[conversations.conversation_id.toString()] = conversations.single;
                      conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
                      conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
                      conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
                      conversationStatus[conversations.conversation_id.toString()] = conversations.status;
                      conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;

                      if (conversations.single == 'yes') {
                        if (conversations.participants.length == 1) {
                          myConversationID = conversations.conversation_id.toString();
                        } else {
                          _.forEach(conversations.participants, function (pv, pk) {
                            // console.log(491, pv);
                            if (pv !== null && pv.toString() !== user.id.toString()) {
                              conversationWith[conversations.conversation_id.toString()] = pv;
                            }
                          });
                        }
                      }
                    }
                  }
                }
              });
              var data = { keySpace: user.company_id };

              hayvenjs.room_status(data, (demodata) => {
                if (demodata.staus) {

                  _.forEach(demodata.rooms, function (bbv, bbk) {
                    if (bbv.single == 'yes') {

                      if (bbv.participants.length > 1) {
                        _.forEach(bbv.participants, function (bpv, bpk) {
                          if (bpv !== null && bpv.toString() !== user.id.toString()) {
                            conversationWith[bbv.conversation_id.toString()] = bpv;
                          }
                        });
                      }
                    }
                  });
                  var unique_conversation = [];
                  var my_room = [];
                  var joined_room = [];
                  var to_be_join = [];
                  _.forEach(demodata.rooms, function (dv, dk) {
                    if (unique_conversation.indexOf(dv.conversation_id.toString()) == -1 && dv.participants !== null) {
                      unique_conversation.push(dv.conversation_id.toString());
                      if (dv.single == 'yes') {
                        // console.log(dv.conversation_id.toString()+"=="+userName[conversationWith[dv.conversation_id.toString()]]);
                        // dv['join_status'] = 'personal';
                        // dv['user_name'] =  userName[conversationWith[dv.conversation_id.toString()]];
                        // dv['user_img'] = userImg[conversationWith[dv.conversation_id.toString()]];
                      } else {
                        if (dv.created_by) {
                          if (dv.created_by.toString() == user.id.toString()) {
                            dv['join_status'] = 'my_room';
                            dv['user_name'] = null;
                            dv['user_img'] = null;
                            dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                            my_room.push(dv);
                          } else if (dv.participants.indexOf(user.id.toString()) > -1) {
                            dv['join_status'] = 'joined_room';
                            dv['user_name'] = null;
                            dv['user_img'] = null;
                            dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                            joined_room.push(dv);
                          } else if (dv.participants.indexOf(user.id.toString()) == -1 && dv.privacy == 'public') {
                            dv['join_status'] = 'to_be_join';
                            dv['user_name'] = null;
                            dv['user_img'] = null;
                            dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
                            to_be_join.push(dv);
                          }
                        }

                      }
                    }
                  });
                }

                res.send({
                  status: true,
                  my_room: my_room,
                  joined_room: joined_room,
                  to_be_join: to_be_join
                });
              });
            }
          }
          else {
            res.send({ status: false, my_room: [], joined_room: [], to_be_join: [] });
          }
        });
      });
    }).catch((e) => {
      res.status(403).send(e);
    });
  });
});

router.post('/remove_device', ensureToken, function (req, res, next) {
  jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
    if (err) res.status(403).send({ error: err, msg: "" });
    else {
      token_verify_by_device_id(decoded).then(() => {
        if (!validate(true, 'text', 'Type', req.body.type).status) {
          res.status(404).send({ error: validate(true, 'text', 'Type', req.body.type).error, msg: "" });
        }
        else if (!validate(true, 'array', 'Device ids', req.body.device_ids).status) {
          res.status(404).send({ error: validate(true, 'array', 'Device ids', req.body.device_ids).error, msg: "" });
        }
        else {
          var update_values_object = {};
          if (req.body.type == "all") {
            update_values_object.device = [decoded.device_id];
            models.instance.Users.update({ id: models.uuidFromString(decoded.id) }, update_values_object, update_if_exists, function (err) {
              if (err) res.status(404).send({ error: err, msg: "" });
              req.app.io.sockets.emit("active_device", { status: true, user_id: decoded.id, device: [decoded.device_id] });
              res.status(200).send({ msg: "all old device removed successfully.", error: "" });
            });
          }
          else {
            update_values_object.device = { '$remove': req.body.device_ids };
            models.instance.Users.update({ id: models.uuidFromString(decoded.id) }, update_values_object, update_if_exists, function (err) {
              if (err) res.status(404).send({ error: err, msg: "" });
              models.instance.Users.findOne({ id: models.uuidFromString(decoded.id) }, function (e, user) {
                if (e) res.status(404).send({ error: e, msg: "" });
                req.app.io.sockets.emit("active_device", { status: true, user_id: decoded.id, device: user.device });
              });
              res.status(200).send({ msg: "device removed successfully.", error: "" });
            });
          }
        }
      }).catch((e) => {
        res.status(403).send(e);
      });
    }
  });

});

// router.post('/read_all_selected_convs', ensureToken, function(req, res, next){
//   jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
//     if (err) res.status(403).send({ error: err, msg: "" });
//     else {
//       token_verify_by_device_id(decoded).then(() => {
//         var count = 0; var flag = true;
//         _.each(req.body.conversation_ids, function(v,k){
//           console.log(2714, v);
//           if(! validate(true, 'uuid', 'Conversation ID', v).status){
//             res.status(404).send({ status: false, msg: validate(true, 'uuid', 'Conversation ID', v).error,});
//             return false;
//           }
//           readallmsgintoconv({conversation_id: v, user_id: decoded.id}, function(result){
//             if(! result.status) {
//               flag = false;
//             }
//             count++;
//           });
//           if(flag === false) { 
//             res.status(403).send({status: false, error: "Unexpexted error"}); 
//             return false; // stop execution
//           }
//         });
//         res.status(200).send({status: true});
//       }).catch((e) => {
//         res.status(403).send(e);
//       });
//     }
//   });
// });

module.exports = router;
