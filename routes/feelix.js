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
var { models } = require('./../config/db/express-cassandra');
var { file2mimetype } = require('./../utils/mimetype');
var { getActiveUsers } = require('./../utils/chatuser');
var { saveConversation, findConversationHistory, checkAdmin, createPersonalConv, check_only_Creator_or_admin, checkParticipants } = require('./../utils/conversation');
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
  getAllUnreadConv
} = require('./../utils/message');

var { todo_msg, commit_msg_delete_for_Todo, permanent_msg_delete_todo } = require('./../utils/todo_msg');
var { hayvenjs } = require('./../utils/hayvenjs');

// creates a configured middleware instance
// destination: handles destination
// filenane: allows you to set the name of the recorded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`https://ca.freeli.io:5000/upload/`))
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.replace(path.extname(file.originalname), '@') + Date.now() + path.extname(file.originalname));
  }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });


/* GET listing. */
router.get("/", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.find({ participants: { $contains: req.session.user_id } }, { raw: true, allow_filtering: true }, function (error, all_conv) {
      if (error) throw error;

      getActiveUsers(req.session.user_id, (userdata, user_error) => {
        var myid = [];
        var pin = [];
        var single_chat = [];
        var single_conv_id = [];
        var group_chat_inside_direct_msg = [];
        var group_chat = [];
        var all_pin_conv_id = [];
        var all_users = [];
        var allconvlist = [];


        if (userdata.status) {
          _.each(userdata.users, function (row, key) {
            all_users.push({
              id: row.id,
              createdat: row.createdat,
              dept: row.dept,
              designation: row.designation,
              email: row.email,
              fullname: row.fullname,
              gcm_id: row.fcm_id && row.fcm_id.includes('@@@') ? row.fcm_id.split('@@@')[1] : row.fcm_id,
              img: row.img,
              is_active: row.is_active,
              is_busy: row.is_busy,
              access: row.access,
              conference_id: row.conference_id,
              company_id: row.company_id
            });

            alluserOnLoad[row.id] = row.fullname;
          });
        }

        models.instance.Pinned.find({ user_id: models.uuidFromString(req.session.user_id) }, function (err, pinnedBlocks) {
          if (err) throw err;

          _.each(pinnedBlocks, function (val, key) {
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
            pined: true,
            sub_title: '',
            last_msg: '',
            last_msg_time: '',
            privecy: 'private',
            totalMember: '1',
            display: 'success'
          });

          _.each(all_conv, function (per_conv, key) {
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
                        last_msg: '',
                        last_msg_time: '',
                        privecy: per_conv.privacy,
                        totalMember: per_conv.participants.length,
                        display: 'default',
                        oriCreator: per_conv.created_by,
                        status: per_conv.status,
                        participants: per_conv.participants
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
                        last_msg: '',
                        last_msg_time: '',
                        privecy: per_conv.privacy,
                        totalMember: per_conv.participants.length,
                        display: 'default',
                        oriCreator: per_conv.created_by,
                        status: per_conv.status,
                        participants: per_conv.participants
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
                          last_msg: '',
                          last_msg_time: '',
                          privecy: per_conv.privacy,
                          totalMember: per_conv.participants.length,
                          display: 'default',
                          oriCreator: per_conv.created_by,
                          status: per_conv.status,
                          participants: per_conv.participants
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
                          last_msg: '',
                          last_msg_time: '',
                          privecy: per_conv.privacy,
                          totalMember: per_conv.participants.length,
                          display: 'default',
                          oriCreator: per_conv.created_by,
                          status: per_conv.status,
                          participants: per_conv.participants
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
                if (per_conv.participants_admin != null) {
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
                } else {
                  var createdBy = per_conv.created_by.toString();
                }
                if (!isEmpty(per_conv.title)) {
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
                      last_msg: '',
                      last_msg_time: per_conv.created_at,
                      privecy: per_conv.privacy,
                      totalMember: per_conv.participants.length,
                      display: 'default',
                      created_by: createdBy,
                      oriCreator: per_conv.created_by,
                      status: per_conv.status,
                      participants: per_conv.participants
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
                      last_msg: '',
                      last_msg_time: per_conv.created_at,
                      privecy: per_conv.privacy,
                      totalMember: per_conv.participants.length,
                      display: 'default',
                      created_by: createdBy,
                      oriCreator: per_conv.created_by,
                      status: per_conv.status,
                      participants: per_conv.participants
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
                      last_msg: '',
                      last_msg_time: per_conv.created_at,
                      privecy: per_conv.privacy,
                      totalMember: per_conv.participants.length,
                      display: 'default',
                      created_by: createdBy,
                      oriCreator: per_conv.created_by,
                      status: per_conv.status,
                      participants: per_conv.participants
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
                  if (!isEmpty(per_conv.title)) {
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
                        last_msg: '',
                        last_msg_time: per_conv.created_at,
                        privecy: per_conv.privacy,
                        totalMember: per_conv.participants.length,
                        display: 'default',
                        created_by: createdBy,
                        oriCreator: per_conv.created_by,
                        status: per_conv.status,
                        participants: per_conv.participants
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
                        last_msg: '',
                        last_msg_time: per_conv.created_at,
                        privecy: per_conv.privacy,
                        totalMember: per_conv.participants.length,
                        display: 'default',
                        created_by: createdBy,
                        oriCreator: per_conv.created_by,
                        status: per_conv.status,
                        participants: per_conv.participants
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
                        last_msg: '',
                        last_msg_time: per_conv.created_at,
                        privecy: per_conv.privacy,
                        totalMember: per_conv.participants.length,
                        display: 'default',
                        created_by: createdBy,
                        oriCreator: per_conv.created_by,
                        status: per_conv.status,
                        participants: per_conv.participants
                      });
                    }
                  }
                }
              }
            }
          });

          models.instance.Tag.find({ tagged_by: models.uuidFromString(req.session.user_id) }, { allow_filtering: true }, function (tagserr, tags) {
            if (tagserr) {
              throw tagserr;
            } else {
              _.each(tags, function (tagRow, aukey) {
                myAllTag[tagRow.tag_id] = tagRow.title;
              });

              getAllUnreadConv(allconvlist, req.session.user_id, (unred_res) => {
                // _.each(unred_res.data.all_msg_desc, function(v, k){
                //     allconvlist.push(v.convid.toString());
                // });

                /* old body*/
                var res_data = {
                  url: 'hayven',
                  title: "Connect",
                  page_title: 'Workfreeli | Connect',
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
                  highlight: highlight,
                  conv_history: [],
                  conv_id: "noid",
                  conv_type: "personal",
                  moment: moment,
                  restart_time: restart_time,
                  _: _,
                  has_login: true,
                  data: [{
                    users: all_users,
                    groupList: group_chat,
                    pin: pin,
                    myid: myid,
                    unpin: single_chat,
                    group_chat_inside_direct_msg: group_chat_inside_direct_msg,
                    tags: tags,
                    unread_msg_conv: unred_res
                  }],
                };
                if (typeof req.cookies.last_active_conv !== 'undefined') {
                  var index = _.findIndex(all_conv, function (voteItem) { return voteItem.conversation_id == req.cookies.last_active_conv });
                  if (index > -1) {
                    if (all_conv[index].single == 'yes') {
                      var ct = 'personal';
                      var myidindex = all_conv[index].participants.indexOf(req.session.user_id);
                      all_conv[index].participants.splice(myidindex, 1);
                      var to = all_conv[index].participants[0];
                      var uk = _.findIndex(all_users, function (row) { return row.id == to });
                      var cn = all_users[uk].fullname;
                      var img = all_users[uk].img;
                    } else if (all_conv[index].single == 'no') {
                      var ct = 'group';
                      var to = req.session.user_id;
                      var cn = all_conv[index].title;
                      var img = all_conv[index].conv_img;
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

                    hayvenjs.get_conversation(selected_data, (rep_data) => {
                      res_data.conv_id = req.cookies.last_active_conv;
                      res_data.conv_history = rep_data;
                      res_data.receiver_fullname = cn;
                      res_data.receiver_img = img;
                      res_data.conv_type = ct;
                      res_data.session_id = req.session.id;
                      res.render("feelix", res_data);
                    });
                  } else {
                    res_data.session_id = req.session.id;
                    res.render("feelix", res_data);
                  }
                } else {
                  res_data.session_id = req.session.id;
                  res.render("feelix", res_data);
                }
                /* end old body */
              });
            }
          });
        });
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get('/download/:fileid', function (req, res, next) {
  models.instance.File.find({ key: req.params.fileid }, { raw: true, allow_filtering: true }, function (err, filedata) {
    if (filedata) {
      var URL = process.env.FILE_SERVER + filedata[0].location;
      download(URL).then(data => {
        console.log('File write', moment().format("HH:mm:ss:SSS"));
        fs.writeFileSync(filedata[0].originalname, data);
        res.download(filedata[0].originalname, function (error) {
          console.log('File download', moment().format("HH:mm:ss:SSS"));
          fs.unlink(filedata[0].originalname, function (err) {
            if (err) throw err;
            req.app.io.sockets.emit("download_completed", { status: true });
          });
        });
      });
    }
  });
});

router.get("/chat/:type/:id/:conversationid/:name/:img", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.find({ conversation_id: models.timeuuidFromString(req.params.conversationid) }, function (err, conversationDetail) {
      if (err) throw err;

      findConversationHistory(models.timeuuidFromString(req.params.conversationid),null, (result, error) => {
        var conversation_list = _.sortBy(result.conversation, ["created_at",]);

        get_group_lists(req.session.user_id, (groups, error_in_group) => {
          if (error_in_group)
            console.log(error_in_group);

          getActiveUsers(req.session.user_id, (uresult, uerror) => {
            if (uerror)
              console.log(uerror);

            get_messages_tag(req.params.conversationid, (tagRes, tagError) => {
              if (tagError)
                console.log(tagError);
              var res_data = {
                url: 'hayven',
                title: "Connect",
                page_title: 'Workfreeli | Connect',
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
router.get('/chat-t/:id/:name/:img', function (req, res, next) {
  if (req.session.login) {
    getActiveUsers(req.session.user_id, (uresult, uerror) => {
      if (uerror) console.log(uerror);
      //user is an array of plain objects with only name and age
      var res_data = {
        url: 'hayven',
        title: 'Connect',
        page_title: 'Workfreeli | Connect',
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
        data: [{ 'room_id': req.params.id, 'room_name': req.params.name, 'room_img': req.params.img, 'users': uresult.users }]
      };
      res.render('oct', res_data);
    });
  } else {
    res.redirect('/');
  }
});

//This is a test route
router.get('/testmulter', function (req, res, next) {
  res.render('textpage');
});

router.post('/send_message', upload.array('photos', 10), function (req, res, next) {

  if (req.session.login) {
    if (req.files.length < 1) {
      res.json({ 'msg': 'No files were uploaded.' });
    }
    else {
      res.json({ 'file_info': req.files, 'msg': 'Successfully uploaded' });
    }
  } else {
    res.redirect('/');
  }
});

router.post('/convImg', upload.single('photos'), function (req, res, next) {
  if (req.session.login) {
    res.json({ 'msg': 'Successfully', 'filename': req.file.filename });
  } else {
    res.redirect('/');
  }
});

router.post('/msgFileUplod', upload.array('any_file_chat', 1000), function (req, res, next) {
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

router.post('/open_thread', function (req, res, next) {
  if (req.session.login) {
    replyId(req.body.msg_id, req.body.conversation_id, (result, err) => {
      if (result.status) {
        res.json(_.toString(result.result));
      } else {
        res.json(result);
      }
    });
  }
});

router.post('/add_reac_emoji', function (req, res, next) {
  if (req.session.login) {
    check_reac_emoji_list(req.body.msgid, req.session.user_id, (result) => {
      if (result.status) {
        if (result.result.length == 0) {
          // add first time like/reaction
          add_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.session.user_fullname, req.body.emoji, (result1) => {
            res.json(result1);
          });
        } else {
          if (result.result[0].emoji_name == req.body.emoji) {
            // delete same user same type reaction
            delete_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.body.emoji, (result2) => {
              res.json(result2);
            });
          } else {
            update_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.body.emoji, (result3) => {
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
router.post('/emoji_rep_list', function (req, res, next) {
  if (req.session.login) {
    view_reac_emoji_list(req.body.msgid, req.body.emojiname, (result) => {
      res.json(result.result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/flag_unflag', function (req, res, next) {
  if (req.session.login) {
    flag_unflag(req.body.msgid, req.body.uid, req.body.is_add, req.body.conversation_id, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});


router.post('/commit_msg_delete', function (req, res, next) {
  if (req.session.login) {
    commit_msg_delete(req.body.conversation_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/update_msg_status', function (req, res, next) {
  if (req.session.login) {
    update_msg_status_add_viewer(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/update_seen_status', function (req, res, next) {
  if (req.session.login) {
    update_seen_status(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});



router.get('/new-group', function (req, res, next) {
  if (req.session.login) {
    getActiveUsers(req.session.user_id, (uresult, uerror) => {
      if (uerror) console.log(uerror);
      //user is an array of plain objects with only name and age
      var res_data = {
        url: 'hayven',
        title: 'Connect',
        page_title: 'Workfreeli | Connect',
        bodyClass: 'chat',
        success: req.session.success,
        error: req.session.error,
        file_server: process.env.FILE_SERVER,
        user_id: req.session.user_id,
        user_fullname: req.session.user_fullname,
        user_email: req.session.user_email,
        user_img: req.session.user_img,
        has_login: true,
        data: [{ 'room_id': 0, 'room_name': 'Unnamed Group', 'users': uresult.users }]
      };
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
                models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
                  participants_admin: { $remove: [req.body.targetID] },
                  participants: { $remove: [req.body.targetID] },
                }, update_if_exists, function (err) {
                  if (err) {
                    if (err) throw err;
                    res.send(JSON.stringify("fail"));
                  } else {
                    res.send(JSON.stringify("success"));
                  }
                });
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
router.post("/groupMemberAdd", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) },
      {
        participants: { $add: [req.body.targetID] },
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


// Url for leave from room
router.post("/leave_room", function (req, res, next) {
  if (req.session.login) {

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
                  res.send(JSON.stringify({ msg: "fail" }));
                } else {
                  res.send(JSON.stringify({ msg: "success" }));
                }
              }
            );
          } else {
            res.send(JSON.stringify({ msg: "nomem" }));
          }
        } else if (req.body.type == "delete") {
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
router.post("/makeMember", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      {
        conversation_id: models.timeuuidFromString(req.body.conversation_id),
        company_id: models.timeuuidFromString(req.body.company_id)
      },
      {
        participants_admin: { $remove: [req.body.targetID] },
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

// Url for add member ID in conversation tbl
router.post("/makeAdmin", function (req, res, next) {
  if (req.session.login) {
    models.instance.Conversation.update(
      { conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) },
      {
        participants_admin: { $add: [req.body.targetID] },
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


// Url for add member ID in conversation tbl
router.post("/personalConCreate", function (req, res, next) {
  if (req.session.login) {
    createPersonalConv(req.session.user_id, req.body.targetID, req.body.ecosystem, req.body.company_id, (result, err) => {
      if (err) {
        if (err) throw err;
      } else if (result.status) {
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
router.post("/pinning", function (req, res, next) {
  if (req.session.login) {
    if (req.body.type == 'pin') {
      var id = models.uuid();
      var pinned = new models.instance.Pinned({
        id: id,
        user_id: models.uuidFromString(req.session.user_id),
        serial_number: parseInt(req.body.pinnedNumber),
        block_id: models.uuidFromString(req.body.blockID)
      });

      pinned.saveAsync().then(function () {
        res.send(JSON.stringify({ status: true, pinID: id }));
      }).catch(function (err) {
        if (err) throw err;
      });

    } else if (req.body.type == 'unpin') {
      //DELETE FROM Pinned WHERE id='??';
      var query_object = {
        id: models.uuidFromString(req.body.targetID)
      };

      models.instance.Pinned.delete(query_object, function (err) {
        if (err) res.send(JSON.stringify({ err }));
        else {
          res.send(JSON.stringify({ status: true }));
        }
      });
    }
  } else {
    res.redirect("/");
  }
});

// Url for delete conversation from conversation table by cpnversation id
router.post("/cnvDlt", function (req, res, next) {
  if (req.session.login) {

    check_only_Creator_or_admin(req.body.cnvID, req.body.targetID, result => {
      if (result.status) {
        var query_object = {
          conversation_id: models.uuidFromString(req.body.cnvID)
        };
        models.instance.Conversation.delete(query_object, function (err) {
          if (err) res.send(JSON.stringify({ err }));
          else {
            res.send(JSON.stringify({ msg: 'success' }));
          }
        });
      } else {
        checkAdmin(req.body.cnvID, req.body.targetID, result => {
          if (result) {
            if (result.status) {
              var newConversationArray = result.conversation;
              if (typeof newConversationArray[0] !== "undefined" && newConversationArray[0] !== null) {
                var query_object = {
                  conversation_id: models.uuidFromString(req.body.cnvID)
                };
                models.instance.Conversation.delete(query_object, function (err) {
                  if (err) res.send(JSON.stringify({ err }));
                  else {
                    res.send(JSON.stringify({ msg: 'success' }));
                  }
                });
              } else {
                res.send(JSON.stringify({ result }));
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
      { conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) },
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
      { conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) },
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

router.post('/todo_open_thread', function (req, res, next) {
  if (req.session.login) {
    todo_msg.replyId(req.body.msg_id, req.body.activity_id, (result, err) => {
      if (result.status) {
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

router.post('/permanent_msg_delete_todo', function (req, res, next) {
  if (req.session.login) {
    permanent_msg_delete_todo(req.body.activity_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
      res.json(result);
    });
  } else {
    res.redirect('/');
  }
});

router.get('/viewmsg', function (req, res, next) {
  models.instance.Messages.find({ conversation_id: models.uuidFromString('81b2343f-6c7c-4f87-8a6d-2e36d4fc3b1c') }, { raw: true, allow_filtering: true }, function (err, message) {
    // models.instance.Messages.find({conversation_id: models.uuidFromString('8fee0cb6-4d8f-4e3c-b702-cbcd2ce5584e')}, {raw:true, allow_filtering: true}, function(err, message){
    if (err) {
      console.log(error);
    }
    else {
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

router.post('/check_duplicate', function (req, res, next) {
  models.instance.File.find({ conversation_id: models.uuidFromString(req.body.conversation_id), is_delete: 0 }, { raw: true, allow_filtering: true }, function (err, files) {

    var allfiles = JSON.parse(req.body.allfiles);
    var has_duplicate = false;
    if (err) res.json({ status: has_duplicate, error: err });
    else if (files.length > 0) {
      _.forEach(files, function (v, k) {
        console.log(1166, v.originalname);
        for (var i = 0; i < allfiles.length; i++) {
          //allfiles[i].need_rename = false;
          if (allfiles[i].originalname == v.originalname) {
            allfiles[i].need_rename = true;
            has_duplicate = true;
            console.log(1170, has_duplicate);
          }
        }
        if (k + 1 == files.length)
          res.json({ status: has_duplicate, allfiles });
      });
    }
    else {
      res.json({ status: has_duplicate, msg: 'No file found.' });
    }
  });
});

module.exports = router;
