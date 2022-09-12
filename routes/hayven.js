var express = require('express');
var router = express.Router();
// var fileUpload = require('express-fileupload');
const fs = require('fs');
const download = require('download');
var multer = require('multer');
var highlight = require('highlight');
var moment = require('moment');
var path = require('path');
var _ = require('lodash');
var inArray = require('in-array');
const isEmpty = require('../validation/is-empty');
var {models} = require('./../config/db/express-cassandra');
var {file2mimetype} = require('./../utils/mimetype');
var {getActiveUsers} = require('./../utils/chatuser');
var { getRoomInfoUser } = require('./../utils/voice_video');
var MobileDetect = require('mobile-detect');
var { saveConversation, findConversationHistory, checkAdmin, createPersonalConv, check_only_Creator_or_admin, checkParticipants} = require('./../utils/conversation');
var { getCompanyTag,getCompanyTeam } = require('./../utils/user_tag');
var { getAllMsg } = require('./../utils/android');
var {
  generateMessage,
  sendNewMsg,
  sendBusyMsg,
  commit_msg_delete,
  flag_unflag,
  add_reac_emoji,
  view_reac_emoji_list,
  get_group_lists,
  update_msg_status_add_viewer,
  update_seen_status,
  check_reac_emoji_list,
  delete_reac_emoji,
  update_reac_emoji,
  get_messages_tag,
  getAllUnread,
  getPersonalConversation,
  replyId,
  getAllUnreadConv,
  count_unread,
  all_unread_dataFun,
  readallmsgintoconv
} = require('./../utils/message');
var {
  getSingleUserConversation,
  getAllNickName,
  getUserPinBlocks,
  getConversationMessages,
  getLoadConv_n_Message,
  getConversationFiles,
  getConversationChecklist,
  updateRedisCache,
  deleteRedisCache
} = require('./../utils/redis_scripts');

var {todo_msg,commit_msg_delete_for_Todo,permanent_msg_delete_todo} = require('./../utils/todo_msg');
var { hayvenjs } = require('./../utils/hayvenjs');
var { customTitle } = require('./../utils/customtitle');

// creates a configured middleware instance
// destination: handles destination
// filenane: allows you to set the name of the recorded file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`https://ca.freeli.io:5000/upload/`))
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.replace(path.extname(file.originalname), '@') +Date.now() +  path.extname(file.originalname));
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });

function compare(a, b) {
  const bandA = a.fullname.toUpperCase();
  const bandB = b.fullname.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
      comparison = 1;
  } else if (bandA < bandB) {
      comparison = -1;
  }
  return comparison;
}
function getOnlyConvIds(data){
  var convids=[];
  for(var i = 0; i<data.length; i++){
    convids.push(data[i].conversation_id.toString())
  }
  return convids;
}

/* GET listing. */
router.get("/", async function(req, res, next) {
  if (req.session.login) {
    console.log('Get Start = ', moment().format("HH:mm:ss:SSS"));
    // var all_conv = await getSingleUserConversation(req.session.user_id);
    // console.log('redis data',all_conv);
    if(! user_session.hasOwnProperty(req.session.user_id)) user_session[req.session.user_id] = [];
    if(user_session[req.session.user_id].indexOf(req.session.id) == -1) user_session[req.session.user_id].push(req.session.id);
    models.instance.Conversation.find({participants: { $contains: req.session.user_id }}, { raw: true, allow_filtering: true }, async function(error, all_conv){
      if (error) throw error;
      var allConvids = getOnlyConvIds(all_conv);
      var all_unread_data = await all_unread_dataFun({my_all_conv:allConvids,user_id: req.session.user_id});
      getAllMsg(allConvids, (msgresult)=>{
        var tempconvids = [];
        var lastmsg_all_conv = [];
        _.forEach(msgresult.data, function(v, k){
          if(v.length > 0){
            if(allConvids.indexOf(v[0].conversation_id.toString()) > -1 && tempconvids.indexOf(v[0].conversation_id.toString()) == -1){
              tempconvids.push(v[0].conversation_id.toString());
              _.forEach(all_conv, function(av, ak){
                if(av.conversation_id.toString() == v[0].conversation_id.toString()){
                  lastmsg_all_conv.push(av);
                }
              });
            }
            // console.log(111, v[0].conversation_id);
          }
        });

        customTitle({user_id:req.session.user_id,type:'get'},(allNic)=>{
          getActiveUsers(req.session.user_id, (userdata, user_error) =>{
              var myid = [];
              var pin =[];
              var single_chat = [];
              var single_conv_id = [];
              var group_chat_inside_direct_msg = [];
              var group_chat = [];
              var all_pin_conv_id =[];
              var all_users = [];
              var allconvlist = [];
              var all_unpin = [];
              var allusermodi = [];

              if(userdata.status){
                  _.each(userdata.users, function(row, key){
                      all_users.push({
                          id: row.id,
                          createdat: row.createdat,
                          dept: row.dept,
                          designation: row.designation,
                          email: row.email,
                          fullname: (row.is_delete == 1) ? row.fullname + "[Deleted]" : row.fullname,
                          gcm_id: row.fcm_id && row.fcm_id.includes('@@@') ? row.fcm_id.split('@@@')[1] : row.fcm_id,
                          img: row.img,
                          is_active: row.is_active,
                          is_delete: row.is_delete,
                          is_busy: row.is_busy,
                          access: row.access,
                          company_id:row.company_id,
                          conference_id: row.conference_id ? row.conference_id.toString() : null
                      });

                      alluserOnLoad[row.id] = row.fullname;
                  });
                  
                    if(allNic.status){
                      var pushuserid = [];
                      _.each(allNic.result,function(nv,nk){
                        _.each(all_users, function(uv, uk){
                          if(uv.id == nv.change_id){
                            const orname = uv.fullname;
                            const cngtitle = nv.change_title;
                            // uv['fullname'] = nv.change_title;
                            uv['fullname'] = cngtitle;
                            uv['originalname'] = orname;
                            if(pushuserid.indexOf(uv.id.toString()) == -1){
                              pushuserid.push(uv.id.toString());
                            }
                          }else{
                            if(pushuserid.indexOf(uv.id.toString()) == -1){
                              uv['originalname'] = uv.fullname;
                              pushuserid.push(uv.id.toString());
                            }
                          }
                        });
                      });
                    }
              }

              all_users = all_users.sort(compare);
              console.log()

              models.instance.Pinned.find({user_id: models.uuidFromString(req.session.user_id) }, function(err, pinnedBlocks) {
                  if (err) throw err;

                  _.each(pinnedBlocks, function(val,key){
                    all_pin_conv_id.push(val.block_id.toString());
                  });

                  // My Conversation
                  myid.push({
                      userid: req.session.user_id,
                      conversation_id: req.session.user_id.toString(),
                      conversation_type: "personal",
                      unread: 0,
                      // users_name: "You",
                      users_name: req.session.user_fullname,
                      users_img: req.session.user_img,
                      user_role: req.session.user_role,
                      pined: true,
                      sub_title: '',
                      last_msg: '',
                      last_msg_time:  '',
                      privecy:  'private',
                      totalMember : '1',
                      display: 'success'
                    });
                  
                  all_conv = _.orderBy(lastmsg_all_conv, ['last_msg_time'], ['desc']);
                  _.each(all_conv, function(per_conv, key){
                    // console.log('voip:conv',per_conv.conference_id);
                    // if (per_conv.participants.length == 1 && per_conv.participants[0].toString() == req.session.user_id) {
                    //   // Continue
                    // }

                    // // Single conversation
                    // else

                    if (per_conv.single == "yes") {
                      // to find the user name, user img and other info
                      if (per_conv.is_active == null) {
                        _.each(all_users, function (row, aukey) {
                          if (row.id.toString() != req.session.user_id && per_conv.participants.indexOf(row.id.toString()) != -1) {

                            // to find pin conversation
                            if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                              allconvlist.push(per_conv.conversation_id.toString());
                              pin.push({
                                user_id: row.id.toString(),
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "personal",
                                unread: 0,
                                users_name: row.fullname,
                                users_img: row.img,
                                pined: true,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                oriCreator: per_conv.created_by,
                                status:per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                            } else {
                              allconvlist.push(per_conv.conversation_id.toString());
                              single_chat.push({
                                user_id: row.id.toString(),
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "personal",
                                unread: 0,
                                users_name: row.fullname,
                                users_img: row.img,
                                pined: false,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                              all_unpin.push({
                                user_id: row.id.toString(),
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "personal",
                                unread: 0,
                                users_name: row.fullname,
                                users_img: row.img,
                                pined: false,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                            }
                          }
                        });
                      }
                      if (per_conv.is_active !== null) {
                        _.each(all_users, function (row, aukey) {
                          if (per_conv.is_active.indexOf(row.id.toString()) === -1) {
                            if (row.id.toString() != req.session.user_id && per_conv.participants.indexOf(row.id.toString()) != -1) {

                              // to find pin conversation
                              if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                                allconvlist.push(per_conv.conversation_id.toString());
                                pin.push({
                                  user_id: row.id.toString(),
                                  conversation_id: per_conv.conversation_id.toString(),
                                  conversation_type: "personal",
                                  unread: 0,
                                  users_name: row.fullname,
                                  users_img: row.img,
                                  pined: true,
                                  sub_title: per_conv.group_keyspace,
                                  last_msg: per_conv.last_msg,
                                  last_msg_time: per_conv.last_msg_time,
                                  privecy: per_conv.privacy,
                                  totalMember: per_conv.participants.length,
                                  display: 'default',
                                  oriCreator: per_conv.created_by,
                                  status: per_conv.status,
                                  participants:per_conv.participants,
                                  participants_admin:per_conv.participants_admin,
                                  conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                  root_conv_id:per_conv.root_conv_id
                                });
                              } else {
                                  allconvlist.push(per_conv.conversation_id.toString());
                                  single_chat.push({
                                    user_id: row.id.toString(),
                                    conversation_id: per_conv.conversation_id.toString(),
                                    conversation_type: "personal",
                                    unread: 0,
                                    users_name: row.fullname,
                                    users_img: row.img,
                                    pined: false,
                                    sub_title: per_conv.group_keyspace,
                                    last_msg: per_conv.last_msg,
                                    last_msg_time: per_conv.last_msg_time,
                                    privecy: per_conv.privacy,
                                    totalMember: per_conv.participants.length,
                                    display: 'default',
                                    oriCreator: per_conv.created_by,
                                    status: per_conv.status,
                                    participants:per_conv.participants,
                                    participants_admin:per_conv.participants_admin,
                                    conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                    root_conv_id:per_conv.root_conv_id
                                  });
                                  all_unpin.push({
                                    user_id: row.id.toString(),
                                    conversation_id: per_conv.conversation_id.toString(),
                                    conversation_type: "personal",
                                    unread: 0,
                                    users_name: row.fullname,
                                    users_img: row.img,
                                    pined: false,
                                    sub_title: per_conv.group_keyspace,
                                    last_msg: per_conv.last_msg,
                                    last_msg_time: per_conv.last_msg_time,
                                    privecy: per_conv.privacy,
                                    totalMember: per_conv.participants.length,
                                    display: 'default',
                                    oriCreator: per_conv.created_by,
                                    status: per_conv.status,
                                    participants:per_conv.participants,
                                    participants_admin:per_conv.participants_admin,
                                    conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                    root_conv_id:per_conv.root_conv_id
                                  });
                              }
                            }
                          }
                        });
                      }
                    }

                    // Group conversation
                    else if (per_conv.single == "no") {
                      if (per_conv.is_active == null) {
                        if (per_conv.participants_admin != null){
                          if (per_conv.created_by.toString() !== req.session.user_id.toString()) {
                            var createdBy = req.session.user_id.toString();
                          } else if (per_conv.created_by.toString() === req.session.user_id.toString() && per_conv.participants_admin.length > 1) {
                            var createdBy = per_conv.created_by.toString();
                          } else if (per_conv.created_by.toString() === req.session.user_id.toString() && per_conv.participants_admin.indexOf(req.session.user_id.toString()) === -1) {
                            var createdBy = per_conv.created_by.toString();
                          } else {
                            var createdBy = '0';
                            // var createdBy = per_conv.created_by.toString();
                          }
                        }else{
                          var createdBy = per_conv.created_by.toString();
                        }
                        if(!isEmpty(per_conv.title)){
                          if (per_conv.title.indexOf(',') > -1) {
                            group_chat_inside_direct_msg.push({
                              userid: req.session.user_id,
                              conversation_id: per_conv.conversation_id.toString(),
                              conversation_type: "group",
                              unread: 0,
                              users_name: per_conv.title,
                              users_img: per_conv.conv_img,
                              pined: false,
                              sub_title: per_conv.group_keyspace,
                              last_msg: per_conv.last_msg,
                              last_msg_time: per_conv.last_msg_time,
                              privecy: per_conv.privacy,
                              totalMember: per_conv.participants.length,
                              display: 'default',
                              created_by: createdBy,
                              oriCreator: per_conv.created_by,
                              status: per_conv.status,
                              participants:per_conv.participants,
                              participants_admin:per_conv.participants_admin,
                              conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                              root_conv_id:per_conv.root_conv_id
                            });
                          } else if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                            allconvlist.push(per_conv.conversation_id.toString());
                            pin.push({
                              userid: req.session.user_id,
                              conversation_id: per_conv.conversation_id.toString(),
                              conversation_type: "group",
                              unread: 0,
                              users_name: per_conv.title,
                              users_img: per_conv.conv_img,
                              pined: true,
                              sub_title: per_conv.group_keyspace,
                              last_msg: per_conv.last_msg,
                              last_msg_time: per_conv.last_msg_time,
                              privecy: per_conv.privacy,
                              totalMember: per_conv.participants.length,
                              display: 'default',
                              created_by: createdBy,
                              oriCreator: per_conv.created_by,
                              status: per_conv.status,
                              participants:per_conv.participants,
                              participants_admin:per_conv.participants_admin,
                              conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                              root_conv_id:per_conv.root_conv_id
                            });
                          } else {
                            allconvlist.push(per_conv.conversation_id.toString());
                            group_chat.push({
                              userid: req.session.user_id,
                              conversation_id: per_conv.conversation_id.toString(),
                              conversation_type: "group",
                              unread: 0,
                              users_name: per_conv.title,
                              users_img: per_conv.conv_img,
                              pined: false,
                              sub_title: per_conv.group_keyspace,
                              last_msg: per_conv.last_msg,
                              last_msg_time: per_conv.last_msg_time,
                              privecy: per_conv.privacy,
                              totalMember: per_conv.participants.length,
                              display: 'default',
                              created_by: createdBy,
                              oriCreator: per_conv.created_by,
                              status: per_conv.status,
                              participants:per_conv.participants,
                              participants_admin:per_conv.participants_admin,
                              conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                              root_conv_id:per_conv.root_conv_id
                            });
                            all_unpin.push({
                              user_id: req.session.user_id,
                              conversation_id: per_conv.conversation_id.toString(),
                              conversation_type: "group",
                              unread: 0,
                              users_name: per_conv.title,
                              users_img: per_conv.conv_img,
                              pined: false,
                              sub_title: per_conv.group_keyspace,
                              last_msg: per_conv.last_msg,
                              last_msg_time: per_conv.last_msg_time,
                              privecy: per_conv.privacy,
                              totalMember: per_conv.participants.length,
                              display: 'default',
                              created_by: createdBy,
                              oriCreator: per_conv.created_by,
                              status: per_conv.status,
                              participants:per_conv.participants,
                              participants_admin:per_conv.participants_admin,
                              conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                              root_conv_id:per_conv.root_conv_id
                            });
                          }
                        }

                      } else {
                        if (per_conv.is_active.indexOf(req.session.user_id) === -1) {
                          if (per_conv.created_by.toString() !== req.session.user_id.toString()) {
                            var createdBy = req.session.user_id.toString();
                          } else if (per_conv.created_by.toString() === req.session.user_id.toString() && per_conv.participants_admin.length > 1) {
                            var createdBy = per_conv.created_by.toString();
                          } else if (per_conv.created_by.toString() === req.session.user_id.toString() && per_conv.participants_admin.indexOf(req.session.user_id.toString()) === -1) {
                            var createdBy = per_conv.created_by.toString();
                          } else {
                            var createdBy = '0';
                            // var createdBy = per_conv.created_by.toString();
                          }
                          if(!isEmpty(per_conv.title)){
                            if (per_conv.title.indexOf(',') > -1) {
                              group_chat_inside_direct_msg.push({
                                userid: req.session.user_id,
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "group",
                                unread: 0,
                                users_name: per_conv.title,
                                users_img: per_conv.conv_img,
                                pined: false,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                created_by: createdBy,
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                            } else if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                              allconvlist.push(per_conv.conversation_id.toString());
                              pin.push({
                                userid: req.session.user_id,
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "group",
                                unread: 0,
                                users_name: per_conv.title,
                                users_img: per_conv.conv_img,
                                pined: true,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                created_by: createdBy,
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                            } else {
                              allconvlist.push(per_conv.conversation_id.toString());
                              group_chat.push({
                                userid: req.session.user_id,
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "group",
                                unread: 0,
                                users_name: per_conv.title,
                                users_img: per_conv.conv_img,
                                pined: false,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                created_by: createdBy,
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                              all_unpin.push({
                                user_id: req.session.user_id,
                                conversation_id: per_conv.conversation_id.toString(),
                                conversation_type: "group",
                                unread: 0,
                                users_name: per_conv.title,
                                users_img: per_conv.conv_img,
                                pined: false,
                                sub_title: per_conv.group_keyspace,
                                last_msg: per_conv.last_msg,
                                last_msg_time: per_conv.last_msg_time,
                                privecy: per_conv.privacy,
                                totalMember: per_conv.participants.length,
                                display: 'default',
                                created_by: createdBy,
                                oriCreator: per_conv.created_by,
                                status: per_conv.status,
                                participants:per_conv.participants,
                                participants_admin:per_conv.participants_admin,
                                conference_id: per_conv.conference_id ? per_conv.conference_id.toString() : null,
                                root_conv_id:per_conv.root_conv_id
                              });
                            }
                          }
                        }
                      }
                    }
                  });

                  models.instance.Tag.find({tagged_by: models.uuidFromString(req.session.user_id)}, { allow_filtering: true }, async function(tagserr, tags){
                    if(tagserr){
                      throw tagserr;
                    }else{
                      _.each(tags, function (tagRow, aukey) {
                        myAllTag[tagRow.tag_id] = tagRow.title;
                      });
                      console.log(524, allconvlist.length);
                      // getAllUnreadConv(allconvlist, req.session.user_id, (unred_res)=>{
                        // _.each(unred_res.data.all_msg_desc, function(v, k){
                        //     allconvlist.push(v.convid.toString());
                        // });
                        // console.log(529, unred_res.data.all_msg_desc.length);
                          var company_tag = await getCompanyTag({user_id: req.session.user_id, company_id: req.session.company_id});
                          var allteam = await getCompanyTeam({user_id: req.session.user_id, company_id: req.session.company_id});
                          /* old body*/
                          var res_data = {
                            url:'hayven',
                            title: "Connect",
                            page_title:'Workfreeli | Connect',
                            bodyClass: "chat",
                            success: req.session.success,
                            error: req.session.error,
                            file_server: process.env.FILE_SERVER,
                            user_id: req.session.user_id,
                            company_id: req.session.company_id,
                            user_fullname: req.session.user_fullname,
                            receiver_fullname: req.session.user_fullname,
                            user_email: req.session.user_email,
                            user_img: req.session.user_img,
                            receiver_img: req.session.user_img,
                            login_total : req.session.login_total,
                            cpa: req.session.cpa,
                            cpmsg: req.session.cpmsg,
                            highlight: highlight,
                            conv_history: [],
                            conv_id: "noid",
                            conv_type: "personal",
                            moment: moment,
                            restart_time:restart_time,
                            all_unread_data:all_unread_data,
                            allteams:allteam.result,
                            _:_,
                            has_login: true,
                            data: [{
                                users: all_users,
                                groupList:group_chat,
                                pin:pin,
                                myid:myid,
                                unpin:single_chat,
                                group_chat_inside_direct_msg: group_chat_inside_direct_msg,
                                tags:tags,
                                unread_msg_conv: [],
                                all_unpin: all_unpin,
                                company_tag: company_tag
                            }],
                          };
                          req.session.login_total = (req.session.login_total + 1);
                          if(myid[0].user_role == 'Guest' && req.session.email_link_conversation != undefined){
                            req.cookies.last_active_conv = req.session.email_link_conversation;
                          }
                          if(typeof req.cookies.last_active_conv !== 'undefined'){
                              var index = _.findIndex(all_conv, function(voteItem) { return voteItem.conversation_id == req.cookies.last_active_conv });
                              if(index>-1){
                                var render_status = true;
                                  if(all_conv[index].single == 'yes'){
                                      var ct = 'personal';
                                      var myidindex = all_conv[index].participants.indexOf(req.session.user_id);
                                      all_conv[index].participants.splice(myidindex, 1);
                                      var to = all_conv[index].participants[0];
                                      var uk = _.findIndex(all_users, function(row) {return row.id == to});
                                      if(typeof all_users[uk] !== 'undefined'){
                                        var cn = all_users[uk].fullname;
                                        var img = all_users[uk].img;
                                      }else{
                                        render_status = false;
                                        res_data.session_id = req.session.id;
                                        console.log('645', moment().format("HH:mm:ss:SSS"));
                                        res.render("basic_view_connect", res_data);
                                      }
                                  } else if(all_conv[index].single == 'no'){
                                      var ct = 'group';
                                      var to = req.session.user_id;
                                      if(typeof all_conv[index] !== 'undefined'){
                                        var cn = all_conv[index].title;
                                        var img = all_conv[index].conv_img;
                                      }else{
                                        render_status = false;
                                        res_data.session_id = req.session.id;
                                        console.log('657', moment().format("HH:mm:ss:SSS"));
                                        res.render("basic_view_connect", res_data);
                                      }
                                  } else {
                                      var ct = 'personal';
                                      var to = req.session.user_id;
                                      var cn = req.session.user_fullname;
                                      var img = req.session.user_img;
                                  }

                                  var selected_data = {
                                      "conversationid": req.cookies.last_active_conv,
                                      "user_id": req.session.user_id,
                                      "name": cn,
                                      "img": img,
                                      "type": ct,
                                      "id": to,
                                      "seartTxt": 1
                                  };
                                  if(render_status){
                                    hayvenjs.get_conversation(selected_data, (rep_data) => {
                                      res_data.conv_id = req.cookies.last_active_conv;
                                      res_data.conv_history = rep_data;
                                      res_data.receiver_fullname = cn;
                                      res_data.receiver_img = img;
                                      res_data.conv_type = ct;
                                      res_data.session_id = req.session.id;
                                      res_data.id = to;
                                      console.log('Send response at = ', moment().format("HH:mm:ss:SSS"));
                                      res.render("basic_view_connect", res_data);
                                    });
                                  }
                              }else{
                                var selected_data = {
                                    "conversationid": req.session.user_id,
                                    "user_id": req.session.user_id,
                                    "name": req.session.user_fullname,
                                    "img": req.session.user_img,
                                    "type": 'personal',
                                    "id": req.session.user_id,
                                    "seartTxt": 1
                                };
                                console.log(703, selected_data);
                                hayvenjs.get_conversation(selected_data, (rep_data) => {
                                  res_data.conv_id = req.session.user_id;
                                  res_data.conv_history = rep_data;
                                  res_data.receiver_fullname = cn;
                                  res_data.receiver_img = img;
                                  res_data.conv_type = ct;
                                  res_data.session_id = req.session.id;
                                  res_data.id = to;
                                  console.log('2 Send response at = ', moment().format("HH:mm:ss:SSS"));
                                  res.render("basic_view_connect", res_data);
                                });
                              }
                          } else {
                              var selected_data = {
                                  "conversationid": req.session.user_id,
                                  "user_id": req.session.user_id,
                                  "name": req.session.user_fullname,
                                  "img": req.session.user_img,
                                  "type": 'personal',
                                  "id": req.session.user_id,
                                  "seartTxt": 1
                              };
                          
                              hayvenjs.get_conversation(selected_data, (rep_data) => {
                                res_data.conv_id = req.session.user_id;
                                res_data.conv_history = rep_data;
                                res_data.receiver_fullname = cn;
                                res_data.receiver_img = img;
                                res_data.conv_type = ct;
                                res_data.session_id = req.session.id;
                                res_data.id = to;
                                console.log(735, selected_data);
                                console.log('2 Send response at = ', moment().format("HH:mm:ss:SSS"));
                                res.render("basic_view_connect", res_data);
                              });
                          }
                          /* end old body */
                      // });
                    }
                  });
              });
          });
        });
      });
    });
  } else {
    res.redirect("/");
  }
});
router.get("/files", async function(req, res, next) {
  if (req.session.login) {
    // var all_conv = await getSingleUserConversation(req.session.user_id);
    // console.log('redis data',all_conv);
    
    models.instance.Conversation.find({participants: { $contains: req.session.user_id }}, { raw: true, allow_filtering: true }, async function(error, all_conv){
      if (error) throw error;
      var allConvids = getOnlyConvIds(all_conv);
      var all_unread_data = await all_unread_dataFun({my_all_conv:allConvids,user_id: req.session.user_id});
      customTitle({user_id:req.session.user_id,type:'get'},(allNic)=>{
        getActiveUsers(req.session.user_id, (userdata, user_error) =>{
            var myid = [];
            var pin =[];
            var single_chat = [];
            var single_conv_id = [];
            var group_chat_inside_direct_msg = [];
            var group_chat = [];
            var all_pin_conv_id =[];
            var all_users = [];
            var allconvlist = [];
            var all_unpin = [];


            if(userdata.status){
                _.each(userdata.users, function(row, key){
                    all_users.push({
                        id: row.id,
                        createdat: row.createdat,
                        dept: row.dept,
                        designation: row.designation,
                        email: row.email,
                        fullname: (row.is_delete == 1) ? row.fullname + "[Deleted]" : row.fullname,
                        gcm_id: row.fcm_id && row.fcm_id.includes('@@@') ? row.fcm_id.split('@@@')[1] : row.fcm_id,
                        img: row.img,
                        is_active: row.is_active,
                        is_delete: row.is_delete,
                        is_busy: row.is_busy,
                        access: row.access,
                        company_id:row.company_id,
                        conference_id: row.conference_id ? row.conference_id.toString() : null
                    });

                    alluserOnLoad[row.id] = row.fullname;
                });
                
                  if(allNic.status){
                    _.each(allNic.result,function(nv,nk){
                      _.each(all_users, function(uv, uk){
                        if(uv.id == nv.change_id){
                          uv.fullname = nv.change_title;
                        }
                      });
                    });
                  }
            }

            all_users = all_users.sort(compare);
            var res_data = {
              url:'hayven',
              title: "Files",
              page_title:'Workfreeli | Files',
              bodyClass: "files",
              success: req.session.success,
              error: req.session.error,
              file_server: process.env.FILE_SERVER,
              user_id: req.session.user_id,
              company_id: req.session.company_id,
              user_fullname: req.session.user_fullname,
              receiver_fullname: req.session.user_fullname,
              user_email: req.session.user_email,
              user_img: req.session.user_img,
              receiver_img: req.session.user_img,
              login_total : req.session.login_total,
              cpa: req.session.cpa,
              cpmsg: req.session.cpmsg,
              highlight: highlight,
              conv_history: [],
              conv_id: "noid",
              conv_type: "personal",
              moment: moment,
              restart_time:restart_time,
              all_unread_data:[],
              _:_,
              has_login: true,
              data: [{
                  users: all_users
              }],
            };
            res_data.session_id = req.session.id;
            res_data.id = '';
            res.render("files_page", res_data);

          
        });
      });
    });
  } else {
    res.redirect("/");
  }
});

router.post("/switch_account", function(req, res, next){
  req.session.regenerate((err) => {
    console.log(err);
  });
  models.instance.Users.find({email: req.body.email.trim(), company_id: models.timeuuidFromString(req.body.comid), is_delete: 0}, {raw:true, allow_filtering: true}, async function(err, getuser){
    if(err) throw err;
    if(getuser.length == 1){
      req.session.success = true;
      req.session.login = true;
      req.session.user_id = _.replace(getuser[0].id, 'Uuid: ', '');
      req.session.user_fullname = getuser[0].fullname;
      req.session.user_email = getuser[0].email;
      req.session.user_img = getuser[0].img;
      req.session.company_id = getuser[0].company_id.toString();
      req.session.user_role = getuser[0].role;
      req.session.parent_list = getuser[0].parent_list;
      req.session.student_list = getuser[0].student_list;
      if(getuser[0].login_total == null)
        req.session.login_total = 0;
      else
        req.session.login_total = getuser[0].login_total;

      userCompany_id[req.session.user_id] = getuser[0].company_id.toString();
      // let iscall = await getRoomInfoUser(getuser[0].id.toString());
      // if (iscall == false) //await del_busyData(getuser[0].id.toString());
      
      if(getuser[0].login_total == 0 || getuser[0].login_total == null ){
        models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:1,last_login:new Date()});
      }else{
        models.instance.Users.update({id:models.uuidFromString(getuser[0].id.toString())},{login_total:(getuser[0].login_total+1),last_login:new Date()});
      }

      var md = new MobileDetect(req.headers['user-agent']);
      var os = md.os();
      if(os == 'iOS' || os == 'AndroidOS' || os == 'BlackBerryOS'){
        if(req.session.login){
          if(req.session.user_role == 'Parent User') res.json({status: true,'url': '/covid/mobile'});
          else if(req.session.user_role == 'Student User'){
            res.json({status: true,'url': '/covid/mobile'});
            
          }else{
            res.redirect('/connect');
          }
          // res.redirect('/connect');
        } else {
          res.render('mob_index', { title: 'Freeli || Sign In',page:'index',page_title:'Workfreeli | Sign In',bodyClass: 'centered-form', success: req.session.success, error: eee, has_login: false });
        }
      }else{
        if(req.session.user_role == 'Parent User'){ res.json({status: true,'url': '/covid/mobile'}); }
        else if(req.session.user_role == 'Student User'){
          // if(req.session.parent_list){
            res.json({status: true,'url': '/covid/mobile'});
          
        }else{
          res.json({status: true,'url': '/'});
        }

      }
      
      
      
    }
    else{
      res.json({status: false, msg: "Something wrong..."});
    }
  });
});

router.get('/switch_for_signup/:em/:type', function(req, res, next){
    req.session.destroy();
    res.redirect('/signup_'+ req.params.type+ '_account/'+req.params.em);
});

router.get('/download/:fileid', function(req, res, next) {
  models.instance.File.find({key: req.params.fileid}, {raw:true, allow_filtering: true}, function(err, filedata){
    if(filedata){
      var URL = process.env.FILE_SERVER + filedata[0].location;
      download(URL).then(data => {
          console.log('File write', moment().format("HH:mm:ss:SSS"));
          fs.writeFileSync(filedata[0].key, data);
          res.download(filedata[0].key, function(error){
            console.log('File download', moment().format("HH:mm:ss:SSS"));
            fs.unlink(filedata[0].key, function (err) {
                if (err) throw err;
                req.app.io.sockets.emit("download_completed", {status: true});
            });
          });
      });
    }
  });
});

router.get("/chat/:type/:id/:conversationid/:name/:img", function(req,res,next) {
  if (req.session.login) {
    models.instance.Conversation.find({conversation_id: models.timeuuidFromString(req.params.conversationid) }, function(err, conversationDetail) {
        if (err) throw err;

        findConversationHistory(models.timeuuidFromString(req.params.conversationid),null, (result, error) => {
          var conversation_list = _.sortBy(result.conversation, ["created_at",]);

          get_group_lists(req.session.user_id, (groups, error_in_group) => {
            if(error_in_group)
              console.log(error_in_group);

            getActiveUsers(req.session.user_id, (uresult, uerror) => {
              if(uerror)
                console.log(uerror);

                get_messages_tag(req.params.conversationid,(tagRes, tagError)=>{
                  if(tagError)
                    console.log(tagError);
                  var res_data = {
                    url:'hayven',
                    title: "Connect",
                    page_title:'Workfreeli | Connect',
                    bodyClass: "chat",
                    success: req.session.success,
                    error: req.session.error,
                    file_server: process.env.FILE_SERVER,
                    user_id: req.session.user_id,
                    conversationid: req.params.conversationid,
                    user_fullname: req.session.user_fullname,
                    user_email: req.session.user_email,
                    user_img: req.session.user_img,
                    to_user_name: req.params.name,
                    highlight: highlight,
                    _: _,
                    moment: moment,
                    file_message: "No",
                    has_login: true,

                    data: [
                      {
                        conversation_id: req.params.conversationid,
                        conversation_type: req.params.type,
                        users: uresult.users,
                        conversation: conversationDetail,
                        room_id: req.params.id,
                        room_name: req.params.name,
                        room_img: req.params.img,
                        conversation_list: conversation_list,
                        groups: groups.result,
                        tags: tagRes.tags
                      },
                    ],
                  };

                  res.render("open-chat", res_data);
                });
            });
          });
        });
    });
  } else {
    res.redirect("/");
  }
});

// For New Group Testing Purpose ocn = open chat test
router.get('/chat-t/:id/:name/:img', function(req, res, next){
  if(req.session.login){
    getActiveUsers(req.session.user_id, (uresult, uerror) => {
      if(uerror) console.log(uerror);
        //user is an array of plain objects with only name and age
        var res_data = {
          url:'hayven',
          title: 'Connect',
          page_title:'Workfreeli | Connect',
          bodyClass: 'chat',
          success: req.session.success,
          error: req.session.error,
          file_server: process.env.FILE_SERVER,
          user_id: req.session.user_id,
          user_fullname: req.session.user_fullname,
          user_email: req.session.user_email,
          user_img: req.session.user_img,
          highlight: highlight,
          moment: moment,
          file_message: 'No',
          has_login: true,
          data: [{'room_id':req.params.id, 'room_name':req.params.name, 'room_img':req.params.img,'users':uresult.users}] };
          res.render('oct', res_data);
    });
  } else {
    res.redirect('/');
  }
});

//This is a test route
router.get('/testmulter', function(req, res, next){
  res.render('textpage');
});

router.post('/send_message', upload.array('photos', 10), function(req, res, next){

  if(req.session.login){
    if (req.files.length < 1){
      res.json({'msg':'No files were uploaded.'});
    }
    else{
      res.json({'file_info': req.files, 'msg': 'Successfully uploaded'});
    }
  } else {
    res.redirect('/');
  }
});

router.post('/convImg', upload.single('photos'), function(req, res, next){
  if(req.session.login){
    res.json({'msg':'Successfully','filename':req.file.filename});
  } else {
    res.redirect('/');
  }
});

router.post('/msgFileUplod', upload.array('any_file_chat', 1000), function(req, res, next) {
    if (req.session.login) {
        if (req.files.length < 1) {
            res.json({ 'msg': 'No files were uploaded.' });
        } else {
            res.json({ 'file_info': req.files, 'msg': 'Successfully uploaded', 'sl': req.body.sl });
        }
    } else {
        res.redirect('/');
    }
});

router.post('/open_thread', function(req, res, next) {
  if(req.session.login){
    replyId(req.body.msg_id, req.body.conversation_id, (result, err) =>{
      // console.log(940,result);
      if(result.status){
        res.json(_.toString(result.result));
      } else {
        res.json(result);
      }
    });
  }
});

router.post('/add_reac_emoji', function(req, res, next){
  if(req.session.login){
    check_reac_emoji_list(req.body.msgid, req.session.user_id, (result) =>{
      if(result.status){
        if(result.result.length == 0){
          // add first time like/reaction
          add_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.session.user_fullname, req.body.emoji, (result1) =>{
            res.json(result1);
          });
        } else {
          if(result.result[0].emoji_name == req.body.emoji){
            // delete same user same type reaction
            delete_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.body.emoji, (result2) =>{
              res.json(result2);
            });
          } else {
            update_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.body.emoji, (result3) =>{
              res.json(result3);
            });
          }
        }
      }
    });
  } else {
    res.redirect('/');
  }
});
router.post('/emoji_rep_list', function(req, res, next){
  if(req.session.login){
    view_reac_emoji_list(req.body.msgid, req.body.emojiname, (result) =>{
      res.json(result.result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/flag_unflag', function(req, res, next){
  if(req.session.login){
    flag_unflag(req.body.msgid, req.body.uid, req.body.is_add, req.body.conversation_id, (result) =>{
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});


router.post('/commit_msg_delete', function(req, res, next){
  if(req.session.login){
    commit_msg_delete(req.body.conversation_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) =>{
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/update_msg_status', function(req, res, next){
    if(req.session.login){
        // update_msg_status_add_viewer(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) =>{
        update_msg_status_add_viewer('',req.body.user_id, req.body.conversation_id, (result) =>{
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});

router.post('/update_seen_status', function(req, res, next){
    if(req.session.login){
        update_seen_status(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) =>{
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});



router.get('/new-group', function(req, res, next){
  if(req.session.login){
    getActiveUsers(req.session.user_id, (uresult, uerror) => {
      if(uerror) console.log(uerror);
        //user is an array of plain objects with only name and age
      var res_data = {
        url:'hayven',
        title: 'Connect',
        page_title:'Workfreeli | Connect',
        bodyClass: 'chat',
        success: req.session.success,
        error: req.session.error,
        file_server: process.env.FILE_SERVER,
        user_id: req.session.user_id,
        user_fullname: req.session.user_fullname,
        user_email: req.session.user_email,
        user_img: req.session.user_img,
        has_login: true,
        data: [{'room_id':0, 'room_name':'Unnamed Group','users':uresult.users}] };
      res.render('chat-new-group', res_data);
    });

  } else {
    res.redirect('/');
  }
});


// Url for remove participants ID from conversation tbl
router.post("/groupMemberDelete", function (req, res, next) {
  if (req.session.login) {
    checkAdmin(req.body.conversation_id, req.body.targetID, result => {
      if (result) {
        if (result.status) {
          var newConversationArray = result.conversation;
          // if (typeof newConversationArray[0] !== "undefined" && newConversationArray[0] !== null) {
          //   res.send(JSON.stringify("creator"));
          // } else {

            checkParticipants(req.body.conversation_id)
              .then((response) => {
                if (response.conversation.participants.length > 1) {
                  if(req.body.root_conv_id == ''){
                    req.body.root_conv_id = null;
                  }
                  console.log(1036,req.body,req.body.root_conv_id !== null)
                  var obj = {root_conv_id:(req.body.root_conv_id != null ? req.body.root_conv_id:req.body.conversation_id)};
                  models.instance.Conversation.find(obj,{raw:true,allow_filtering:true},function(err1,res1){
                    if(err1){
                      console.log(err1);
                    }else{
                      var participantsmy = [];
                      var conv_data = []
                      if(res1.length > 0){
                        for(let i = 0; i < res1.length; i++){
                          if(res1[i].conversation_id.toString() != req.body.conversation_id ){
                            for(let l = 0; l < res1[i].participants.length; l++){
                              if(participantsmy.indexOf(res1[i].participants[l]) == -1){
                                participantsmy.push(res1[i].participants[l])
                              }
                            }
                            conv_data.push(res1[i]);
                          }
                        }
                      }

                      if(req.body.root_conv_id !== null){
                        models.instance.Conversation.find({conversation_id: models.timeuuidFromString(req.body.root_conv_id)},{raw:true,allow_filtering:true},function(err2,res2){

                          if(err2){
                            if (err) throw err;
                            res.send(JSON.stringify("fail"));
                          }else{
                            if(res2[0].participants_guest == null){
                              res2[0].participants_guest = [];
                            }
                            if(res2[0].participants_sub == null){
                              res2[0].participants_sub = [];
                            }
                            if(res2[0].participants_sub.indexOf(req.body.targetID) > -1 && participantsmy.indexOf(req.body.targetID) == -1){
                                models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.root_conv_id),company_id:models.timeuuidFromString(req.body.company_id) }, {
                                  participants_admin: { $remove: [req.body.targetID] },
                                  participants: { $remove: [req.body.targetID] },
                                  participants_guest: { $remove: [req.body.targetID] },
                                  participants_sub: { $remove: [req.body.targetID] },
                                }, update_if_exists, function (err) {
                                  if (err) {
                                    if (err) throw err;
                                    res.send(JSON.stringify("fail"));
                                  } else {
                                    models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) }, {
                                      participants_admin: { $remove: [req.body.targetID] },
                                      participants: { $remove: [req.body.targetID] },
                                      participants_guest: { $remove: [req.body.targetID] },
                                      participants_sub: { $remove: [req.body.targetID] },
                                    }, update_if_exists, function (err3) {
                                      if (err3) {
                                        if (err3) throw err;
                                        res.send(JSON.stringify("fail"));
                                      } else {
                                        conv_data.push(res2[0]);
                                        res.send({msg:'success',data:conv_data,root_conv:false});
                                      }
                                    });
                                  }
                                });
                            }else{
                              models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) }, {
                                participants_admin: { $remove: [req.body.targetID] },
                                participants: { $remove: [req.body.targetID] },
                                participants_guest: { $remove: [req.body.targetID] },
                                participants_sub: { $remove: [req.body.targetID] },
                              }, update_if_exists, function (err3) {
                                if (err3) {
                                  if (err3) throw err;
                                  res.send(JSON.stringify("fail"));
                                } else {
                                  res.send({msg:'success',data:conv_data,root_conv:true});
                                }
                              });
                            }
                          }
                        })

                       
                      }else{
                        
                        if(participantsmy.indexOf(req.body.targetID) > -1){
                          models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) }, {
                            participants_admin: { $remove: [req.body.targetID] },
                            participants_sub: { $add: [req.body.targetID] },
                          }, update_if_exists, function (err) {
  
                            if (err) {
                              console.log(1118,err)
                              
                            } else {
                              res.send({msg:'success',data:res1,root_conv:true});
                            }
                          });
                          
                        }else{
                          models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) }, {
                            participants_admin: { $remove: [req.body.targetID] },
                            participants: { $remove: [req.body.targetID] },
                            participants_guest: { $remove: [req.body.targetID] },
                            participants_sub: { $remove: [req.body.targetID] },
                          }, update_if_exists, function (err) {
                            if (err) {
                              if (err) throw err;
                              res.send(JSON.stringify("fail"));
                            } else {
                              res.send({msg:'success',data:res1,root_conv:false});
                            }
                          });
                        }
                      }
                      
                      
                    }
                  })
                } else {
                  res.send(JSON.stringify("nomem"));
                }
              }).catch((crr) => {
                console.log(crr);
              });
          // }
        } else {
          console.log(result.status);
        }
      } else {
        console.log(result);
      }
    });
  } else {
    res.redirect("/");
  }
});


// Url for add participants ID in conversation tbl
router.post("/groupMemberAdd", function(req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.uuidFromString(req.body.conversation_id), company_id:models.timeuuidFromString(req.body.company_id) },
      {
        participants: { $add: [req.body.targetID] },
      }, update_if_exists,
      function(err) {
        if (err) {
          if (err) throw err;
        } else {
          res.send(JSON.stringify("success"));
        }
      }
    );
  } else {
    res.redirect("/");
  }
});


// Url for leave from room
router.post("/leave_room", function (req, res, next) {
  if (req.session.login) {

    checkParticipants(req.body.conversation_id)
      .then((response) => {
        if (req.body.type == "leave"){
          if (response.conversation.participants.length > 1) {
            models.instance.Conversation.update(
              { conversation_id: models.uuidFromString(req.body.conversation_id),
                company_id:models.timeuuidFromString(req.body.company_id) },
              {
                participants: { $remove: [req.body.targetID] },
                participants_admin: { $remove: [req.body.targetID] },
              }, update_if_exists,
              function (err) {
                if (err) {
                  if (err) throw err;
                  res.send(JSON.stringify({ msg: "fail" }));
                } else {
                  res.send(JSON.stringify({ msg: "success" }));
                }
              }
            );
          } else {
            res.send(JSON.stringify({ msg: "nomem" }));
          }
        } else if (req.body.type == "delete"){
          if (response.conversation.participants_admin.indexOf(req.body.targetID) > -1) {
              var query_object = {
                conversation_id: models.uuidFromString(req.body.conversation_id)
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
    // checkAdmin(req.body.conversation_id, req.body.targetID, result => {
    //   if (result.status) {
    //     console.log(result);
    //     if (result.conversation.length > 0) {
    //       var query_object = {
    //         conversation_id: models.uuidFromString(req.body.conversation_id)
    //       };

    //       models.instance.Conversation.delete(query_object, function (err) {
    //         if (err) {
    //           res.send(JSON.stringify({ msg: "fail" }));
    //         } else {
    //           res.send(JSON.stringify({ msg: "delete", conversation: result.conversation }));
    //         }
    //       });

    //     } else {
    //       checkParticipants(req.body.conversation_id)
    //         .then((response) => {
    //           if (response.conversation.participants.length > 1) {
    //             models.instance.Conversation.update(
    //               { conversation_id: models.uuidFromString(req.body.conversation_id) },
    //               {
    //                 participants: { $remove: [req.body.targetID] },
    //               },
    //               function (err) {
    //                 if (err) {
    //                   if (err) throw err;
    //                   res.send(JSON.stringify({ msg: "fail" }));
    //                 } else {
    //                   res.send(JSON.stringify({ msg: "success" }));
    //                 }
    //               }
    //             );
    //           } else {
    //             res.send(JSON.stringify({ msg: "nomem" }));
    //           }
    //         }).catch((crr) => {
    //           console.log(crr);
    //         });
    //     }
    //   }

    // });
  } else {
    res.redirect("/");
  }
});


// Url for add member ID in conversation tbl
router.post("/makeMember", function(req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      {
        conversation_id: models.timeuuidFromString(req.body.conversation_id),
        company_id:models.timeuuidFromString(req.body.company_id)
      },
      {
        participants_admin: { $remove: [req.body.targetID] },
      }, update_if_exists,
      function(err) {
        if (err) {
          if (err) throw err;
        } else {
          res.send(JSON.stringify("success"));
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

// Url for add member ID in conversation tbl
router.post("/makeAdmin", function(req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) },
      {
        participants_admin: { $add: [req.body.targetID] },
      }, update_if_exists,
      function(err) {
        if (err) {
          if (err) throw err;
        } else {
          res.send(JSON.stringify("success"));
        }
      }
    );
  } else {
    res.redirect("/");
  }
});


// Url for add member ID in conversation tbl
router.post("/personalConCreate", function(req, res, next) {
  if (req.session.login) {
    createPersonalConv( req.session.user_id, req.body.targetID, req.body.ecosystem,req.body.company_id, (result, err) =>{
		if (err) {
          if (err) throw err;
		} else if(result.status){
			res.send(JSON.stringify(result));
		} else {
			console.log(result);
		}
    });

    // res.json("hi");
  } else {
    res.redirect("/");
  }
});



// Pinned URL
router.post("/pinning", function(req, res, next) {
  console.log("Pin/unpin From hayven.js");
  console.log("Pined Number =", req.body.pinnedNumber);
  if (req.session.login) {
    if(req.body.type == 'pin'){
      var id = models.uuid();
      var pinned = new models.instance.Pinned({
        id: id,
        user_id: models.uuidFromString(req.session.user_id),
        serial_number: parseInt(req.body.pinnedNumber),
        block_id:models.uuidFromString(req.body.blockID)
      });

      pinned.saveAsync().then(function() {
        res.send(JSON.stringify({status:true, pinID:id }));
      }).catch(function(err) {
        if (err) throw err;
      });

    }else if(req.body.type == 'unpin'){
      //DELETE FROM Pinned WHERE id='??';
      var query_object = {
        id: models.uuidFromString(req.body.targetID)
      };

      models.instance.Pinned.delete(query_object, function(err){
          if(err) res.send(JSON.stringify({err}));
          else {
            res.send(JSON.stringify({status:true }));
          }
      });
    }
  } else {
    res.redirect("/");
  }
});

// Url for delete conversation from conversation table by cpnversation id
router.post("/cnvDlt", function(req, res, next) {
  if (req.session.login) {

    check_only_Creator_or_admin(req.body.cnvID, req.body.targetID, result => {
      if(result.status){
        var query_object = {
          conversation_id: models.uuidFromString(req.body.cnvID)
        };
        models.instance.Conversation.delete(query_object, function(err){
            if(err) res.send(JSON.stringify({err}));
            else {
              res.send(JSON.stringify({msg:'success'}));
            }
        });
    }else{
      checkAdmin(req.body.cnvID, req.body.targetID, result => {
        if (result) {
          if (result.status) {
            var newConversationArray = result.conversation;
            if (typeof newConversationArray[0] !== "undefined" && newConversationArray[0] !== null) {
              var query_object = {
                conversation_id: models.uuidFromString(req.body.cnvID)
              };
              models.instance.Conversation.delete(query_object, function(err){
                  if(err) res.send(JSON.stringify({err}));
                  else {
                    res.send(JSON.stringify({msg:'success'}));
                  }
              });
            } else {
              res.send(JSON.stringify({result}));
            }
          } else {
            console.log(result.status);
          }
        } else {
          console.log(result);
        }
      });
    }


    });
  } else {
    res.redirect("/");
  }
});

// Url for add ID in is_active
router.post("/hideUserinSidebar", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) },
      {
        is_active: { $add: [req.body.targetID] },
      }, update_if_exists,
      function (err) {
        if (err) {
          if (err) throw err;
        } else {
          res.send(JSON.stringify("success"));
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

// Url for add participants ID in conversation tbl
router.post("/removeHideUserinSidebar", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(req.body.company_id) },
      {
        is_active: { $remove: [req.body.targetID] },
      }, update_if_exists,
      function (err) {
        if (err) {
          res.send(JSON.stringify(err));;
        } else {
          res.send(JSON.stringify("success"));
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

router.post('/todo_open_thread', function(req, res, next) {
  if(req.session.login){
    todo_msg.replyId(req.body.msg_id, req.body.activity_id, (result, err) =>{
      if(result.status){
        res.json(_.toString(result.result));
      } else {
        res.json(result);
      }
    });
  }
});

//url for delete todo msg
router.post('/commit_msg_delete_for_Todo', function (req, res, next) {
  if (req.session.login) {
    commit_msg_delete_for_Todo(req.body.activity_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/permanent_msg_delete_todo', function(req, res, next){
  if (req.session.login) {
    permanent_msg_delete_todo(req.body.activity_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.get('/viewmsg', function(req, res, next){
  models.instance.Messages.find({conversation_id: models.uuidFromString('81b2343f-6c7c-4f87-8a6d-2e36d4fc3b1c')}, {raw:true, allow_filtering: true}, function(err, message){
  // models.instance.Messages.find({conversation_id: models.uuidFromString('8fee0cb6-4d8f-4e3c-b702-cbcd2ce5584e')}, {raw:true, allow_filtering: true}, function(err, message){
    if(err){
      console.log(error);
    }
    else{
      var data = {
        'id': '81b2343f-6c7c-4f87-8a6d-2e36d4fc3b1c',
        'msg': message,
        'file_server': process.env.FILE_SERVER
      };
      res.render("test_view", data);
      // res.json(message);
    }
  });
});

router.post('/check_duplicate', function(req, res, next){
    models.instance.File.find({conversation_id: models.uuidFromString(req.body.conversation_id), is_delete: 0}, {raw:true, allow_filtering: true},function(err, files){

        var allfiles = JSON.parse(req.body.allfiles);
        var has_duplicate = false;
        if(err) res.json({status: has_duplicate, error: err});
        else if(files.length > 0) {
            _.forEach(files, function(v, k){
                console.log(1166, v.originalname);
                for(var i=0; i<allfiles.length; i++){
                    //allfiles[i].need_rename = false;
                    if(allfiles[i].originalname == v.originalname){
                        allfiles[i].need_rename = true;
                        has_duplicate = true;
                        console.log(1170, has_duplicate);
                    }
                }
                if(k+1 == files.length)
                    res.json({status: has_duplicate, allfiles });
            });
        }
        else{
            res.json({status: has_duplicate, msg: 'No file found.'});
        }
    });
});

router.post('/rename_dbfile', function(req, res, next){
  models.instance.File.findOne({id: models.timeuuidFromString(req.body.id)},function(e,re){
    if(e){
      console.log(e);
    }else{
      models.instance.File.update({id: models.timeuuidFromString(req.body.id),conversation_id:models.uuidFromString(re.conversation_id.toString())}, {originalname: req.body.name}, update_if_exists, function(err){
          if(err) res.json({status: false, error: err});
          else res.json({status: true });
      });
    }
  })
    
});

router.post('/get_notification', function(req, res, next){
  if (req.session.login) {
    models.instance.Users.findOne({email: req.body.user_email, company_id: models.timeuuidFromString(req.body.company_id)}, { raw: true, allow_filtering: true }, function(err1, user){
      if(err1) res.json({status: false, msg: "User error", error: err1});
      if(user){
        models.instance.Conversation.find({participants: { $contains: user.id.toString() }, company_id: models.timeuuidFromString(req.body.company_id)}, { raw: true, allow_filtering: true }, function(error, all_conv){
          if (error) res.json({status: false, msg: "Conversation error", error: error});
          if(all_conv.length > 0){
            var convs = [];
            _.forEach(all_conv, function(v, k){
              convs.push(v.conversation_id.toString());
            });
            count_unread(convs, user.id.toString(), (result)=>{
              if(result.status)
                res.json({status: true, company_id: req.body.company_id, result: result.data, msg: "Success"});
              else
                res.json({status: false, msg: "No data found", result: result});
            });
          }
          else{
            res.json({status: false, msg: "No conv found"});
          }
        });
      }
      else{
        res.json({status: false, msg: "User not found"});
      }
    });
  }
});

// Url for add member ID in conversation tbl
router.post("/all_unread_msgV2", function(req, res, next) {
    count_unread(req.body.my_all_conv, req.body.user_id, function (repdata, error) {
      if (repdata.status)
        res.json(repdata.data);
      else
        res.json(error);
    });
});

router.post("/read_all_msgs", function(req, res, next){
  if(req.body.is_thread){
    models.instance.ReplayConv.find({conversation_id: models.uuidFromString(req.body.conversation_id)}, { raw: true, allow_filtering: true }, function(err2, result1){
        if(err2) res.json({status: false, err2});
        else{
          if(result1.length > 0){
            var convids = new Set();
            _.forEach(result1, function(v, k){
                convids.add(v.rep_id);
            });
            var convid_array = Array.from(convids);

            models.instance.Messages.find({conversation_id: {'$in': convid_array}, msg_status: {'$contains' : req.body.user_id}}, { raw: true, allow_filtering: true }, function(err3, result2){
                if(err3) res.json({status: false, err3});
                
                if(result2.length > 0){
                  var qry = [];
                  try{
                    _.forEach(result2, function(v, k){
                      var q = models.instance.Messages.update(
                        {conversation_id: v.conversation_id, msg_id: v.msg_id},
                        {msg_status: {'$remove': [req.body.user_id]}},
                        { return_query: true}
                      );
                      qry.push(q);
                    });

                    models.doBatch(qry, function(err4){
                      if(err4) res.json({status: false, err4});
                      else res.json({status: true, reply_read: result2.length, msg: 'all done'});
                      // res.json({status: true, result2});
                    });
                  } catch(e){
                    res.json({status: false, e});
                  }
                }else{
                  res.json({status: true, result1});
                }
            });
          }else{
            res.json({status: true});
          }
        }
    });
  }else{
    readallmsgintoconv(req.body, function(result){
      res.json(result);
    });
  }
});

module.exports = router;
