var express = require('express');
var router = express.Router();
// var fileUpload = require('express-fileupload');
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
    getAllUnreadConv,
    all_unread_dataFun
} = require('./../utils/message');

var { todo_msg, commit_msg_delete_for_Todo, permanent_msg_delete_todo } = require('./../utils/todo_msg');
var { hayvenjs } = require('./../utils/hayvenjs');

// creates a configured middleware instance
// destination: handles destination
// filenane: allows you to set the name of the recorded file
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve(`https://ca.freeli.io:5000/upload/`))
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname.replace(path.extname(file.originalname), '@') + Date.now() + path.extname(file.originalname));
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });

function getOnlyConvIds(data) {
    var convids = [];
    for (var i = 0; i < data.length; i++) {
        convids.push(data[i].conversation_id.toString())
    }
    return convids;
}

/* GET listing. */
router.get("/", async function(req, res, next) {
    if (req.session.login) {
        if (!user_session.hasOwnProperty(req.session.user_id)) user_session[req.session.user_id] = [];
        if (user_session[req.session.user_id].indexOf(req.session.id) == -1) user_session[req.session.user_id].push(req.session.id);
        models.instance.Conversation.find({ participants: { $contains: req.session.user_id } }, { raw: true, allow_filtering: true }, async function(error, all_conv) {
            if (error) throw error;
            var allConvids = getOnlyConvIds(all_conv);
            var all_unread_data = await all_unread_dataFun({ my_all_conv: allConvids, user_id: req.session.user_id });
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
                var all_unpin = [];

                if (userdata.status) {
                    _.each(userdata.users, function(row, key) {
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
                            roll: row.roll,
                            access: row.access,
                            conference_id: row.conference_id,
                            company_id: row.company_id
                        });
                        alluserOnLoad[row.id] = row.fullname;
                    });
                }

                models.instance.Pinned.find({ user_id: models.uuidFromString(req.session.user_id) }, function(err, pinnedBlocks) {
                    if (err) throw err;

                    _.each(pinnedBlocks, function(val, key) {
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
                    all_conv = _.orderBy(all_conv, ['last_msg_time'], ['desc']);
                    _.each(all_conv, function(per_conv, key) {
                        // if (per_conv.participants.length == 1 && per_conv.participants[0].toString() == req.session.user_id) {
                        //   // Continue
                        // }

                        // // Single conversation
                        // else

                        if (per_conv.single == "yes") {
                            // to find the user name, user img and other info
                            if (per_conv.is_active == null) {
                                _.each(all_users, function(row, aukey) {
                                    if (row.id.toString() != req.session.user_id && per_conv.participants.indexOf(row.id.toString()) != -1) {
                                        // to find pin conversation
                                        var pinidkey = all_pin_conv_id.indexOf(per_conv.conversation_id.toString());
                                        if (pinidkey != -1) {
                                            allconvlist.push(per_conv.conversation_id.toString());
                                            pin.push({
                                                user_id: row.id.toString(),
                                                conversation_id: per_conv.conversation_id.toString(),
                                                conversation_type: "personal",
                                                unread: 0,
                                                users_name: row.fullname,
                                                users_img: row.img,
                                                pined: true,
                                                pinid: pinnedBlocks[pinidkey].id,
                                                sub_title: per_conv.group_keyspace,
                                                last_msg: per_conv.last_msg,
                                                last_msg_time: per_conv.last_msg_time,
                                                privecy: per_conv.privacy,
                                                totalMember: per_conv.participants.length,
                                                display: 'default',
                                                oriCreator: per_conv.created_by,
                                                status: per_conv.status,
                                                participants: per_conv.participants
                                            });
                                        } else {
                                            single_conv_id.push(per_conv.conversation_id.toString());
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
                                                participants: per_conv.participants
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
                                                participants: per_conv.participants
                                            });
                                        }
                                    }
                                });
                            }
                            if (per_conv.is_active !== null) {
                                _.each(all_users, function(row, aukey) {
                                    if (per_conv.is_active.indexOf(row.id.toString()) === -1) {
                                        if (row.id.toString() != req.session.user_id && per_conv.participants.indexOf(row.id.toString()) != -1) {
                                            // to find pin conversation
                                            var pinidkey = all_pin_conv_id.indexOf(per_conv.conversation_id.toString());
                                            if (pinidkey != -1) {
                                                allconvlist.push(per_conv.conversation_id.toString());
                                                pin.push({
                                                    user_id: row.id.toString(),
                                                    conversation_id: per_conv.conversation_id.toString(),
                                                    conversation_type: "personal",
                                                    unread: 0,
                                                    users_name: row.fullname,
                                                    users_img: row.img,
                                                    pined: true,
                                                    pinid: pinnedBlocks[pinidkey].id,
                                                    sub_title: per_conv.group_keyspace,
                                                    last_msg: per_conv.last_msg,
                                                    last_msg_time: per_conv.last_msg_time,
                                                    privecy: per_conv.privacy,
                                                    totalMember: per_conv.participants.length,
                                                    display: 'default',
                                                    oriCreator: per_conv.created_by,
                                                    status: per_conv.status,
                                                    participants: per_conv.participants
                                                });
                                            } else {
                                                single_conv_id.push(per_conv.conversation_id.toString());
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
                                                    participants: per_conv.participants
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
                                    // if (per_conv.title.indexOf(',') > -1) {
                                    //   group_chat_inside_direct_msg.push({
                                    //     userid: req.session.user_id,
                                    //     conversation_id: per_conv.conversation_id.toString(),
                                    //     conversation_type: "group",
                                    //     unread: 0,
                                    //     users_name: per_conv.title,
                                    //     users_img: per_conv.conv_img,
                                    //     pined: false,
                                    //     sub_title: per_conv.group_keyspace,
                                    //     last_msg: '',
                                    //     last_msg_time: per_conv.created_at,
                                    //     privecy: per_conv.privacy,
                                    //     totalMember: per_conv.participants.length,
                                    //     display: 'default',
                                    //     created_by: createdBy,
                                    //     oriCreator: per_conv.created_by,
                                    //     status: per_conv.status
                                    //   });
                                    // } else 
                                    if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                                        allconvlist.push(per_conv.conversation_id.toString());
                                        pin.push({
                                            user_id: req.session.user_id,
                                            conversation_id: per_conv.conversation_id.toString(),
                                            conversation_type: "group",
                                            unread: 0,
                                            users_name: per_conv.title,
                                            users_img: per_conv.conv_img,
                                            pined: true,
                                            pinid: pinnedBlocks[all_pin_conv_id.indexOf(per_conv.conversation_id.toString())].id,
                                            sub_title: per_conv.group_keyspace,
                                            last_msg: per_conv.last_msg,
                                            last_msg_time: per_conv.last_msg_time,
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
                                            last_msg: per_conv.last_msg,
                                            last_msg_time: per_conv.last_msg_time,
                                            privecy: per_conv.privacy,
                                            totalMember: per_conv.participants.length,
                                            display: 'default',
                                            created_by: createdBy,
                                            oriCreator: per_conv.created_by,
                                            status: per_conv.status,
                                            participants: per_conv.participants
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
                                        // if (per_conv.title.indexOf(',') > -1) {
                                        //   group_chat_inside_direct_msg.push({
                                        //     userid: req.session.user_id,
                                        //     conversation_id: per_conv.conversation_id.toString(),
                                        //     conversation_type: "group",
                                        //     unread: 0,
                                        //     users_name: per_conv.title,
                                        //     users_img: per_conv.conv_img,
                                        //     pined: false,
                                        //     sub_title: per_conv.group_keyspace,
                                        //     last_msg: '',
                                        //     last_msg_time: per_conv.created_at,
                                        //     privecy: per_conv.privacy,
                                        //     totalMember: per_conv.participants.length,
                                        //     display: 'default',
                                        //     created_by: createdBy,
                                        //     oriCreator: per_conv.created_by,
                                        //     status: per_conv.status
                                        //   });
                                        // } else 
                                        if (all_pin_conv_id.indexOf(per_conv.conversation_id.toString()) != -1) {
                                            allconvlist.push(per_conv.conversation_id.toString());
                                            pin.push({
                                                user_id: req.session.user_id,
                                                conversation_id: per_conv.conversation_id.toString(),
                                                conversation_type: "group",
                                                unread: 0,
                                                users_name: per_conv.title,
                                                users_img: per_conv.conv_img,
                                                pined: true,
                                                pinid: pinnedBlocks[all_pin_conv_id.indexOf(per_conv.conversation_id.toString())].id,
                                                sub_title: per_conv.group_keyspace,
                                                last_msg: per_conv.last_msg,
                                                last_msg_time: per_conv.last_msg_time,
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
                                                last_msg: per_conv.last_msg,
                                                last_msg_time: per_conv.last_msg_time,
                                                privecy: per_conv.privacy,
                                                totalMember: per_conv.participants.length,
                                                display: 'default',
                                                created_by: createdBy,
                                                oriCreator: per_conv.created_by,
                                                status: per_conv.status,
                                                participants: per_conv.participants
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
                                                participants: per_conv.participants
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });

                    // models.instance.Tag.find({tagged_by: models.uuidFromString(req.session.user_id)}, { allow_filtering: true }, function(tagserr, tags){
                    models.instance.UserTag.find({ company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]) }, { allow_filtering: true }, function(tagserr, tags) {
                        if (tagserr) {
                            throw tagserr;
                        } else {
                            // getAllUnreadConv(allconvlist, req.session.user_id, (unred_res)=>{
                            /* old body*/
                            var res_data = {
                                url: 'hayven',
                                title: "Connect",
                                bodyClass: "chat",
                                success: req.session.success,
                                error: req.session.error,
                                file_server: process.env.FILE_SERVER,
                                user_id: req.session.user_id,
                                company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]),
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
                                all_unread_data: all_unread_data,
                                has_login: true,
                                page: 'connect',
                                data: [{
                                    all_conv: all_conv,
                                    users: all_users,
                                    groupList: group_chat,
                                    pin: pin,
                                    myid: myid,
                                    unpin: single_chat,
                                    group_chat_inside_direct_msg: group_chat_inside_direct_msg,
                                    tags: tags,
                                    unread_msg_conv: [],
                                    all_unpin: all_unpin
                                }],
                            };

                            res_data.session_id = req.session.id;
                            res.render('mob_connect', res_data);
                            // }
                            /* end old body */
                            // });
                        }
                    });
                });
            });
        });
    } else {
        res.redirect("/");
    }
});

router.get("/route_test", function(req, res, next) {
    res.json({ "status": "Route is ok" });
})

router.get("/chat/:type/:privacy/:userid/:unreadThread/:has_flagged/:status/:conversationid/:name/:img/:p/:m", function(req, res, next) {
    if (req.session.login) {
        console.log(504, req.params);
        models.instance.Conversation.find({ conversation_id: models.timeuuidFromString(req.params.conversationid) }, function(err, conversationDetail) {
            if (err) throw err;

            findConversationHistory(models.timeuuidFromString(req.params.conversationid), null, (result, error) => {
                var conversation_list = result.conversation;
                var checklist = result.checklist;

                get_group_lists(req.session.user_id, (groups, error_in_group) => {
                    if (error_in_group)
                        console.log(error_in_group);

                    getActiveUsers(req.session.user_id, (uresult, uerror) => {
                        if (uerror)
                            console.log(uerror);

                        models.instance.Tag.find({ tagged_by: models.uuidFromString(req.session.user_id) }, { allow_filtering: true }, function(tagserr, tags) {
                            if (tagserr) {
                                throw tagserr;
                            } else {
                                models.instance.Convtag.find({ conversation_id: models.timeuuidFromString(req.params.conversationid) }, { allow_filtering: true }, function(convtagerr, conv_tag) {
                                    if (convtagerr) console.log(convtagerr);
                                    models.instance.MessagesTag.find({ conversation_id: models.timeuuidFromString(req.params.conversationid) }, { allow_filtering: true }, function(msgtagerr, msg_tag) {
                                        if (msgtagerr) console.log(msgtagerr);
                                        models.instance.File.find({ conversation_id: models.timeuuidFromString(req.params.conversationid), is_delete: 0 }, { allow_filtering: true }, function(fileerr, filedata) {
                                            if (fileerr) console.log(522, fileerr);
                                            var res_data = {
                                                url: 'hayven',
                                                title: "Connect",
                                                bodyClass: "chat",
                                                success: req.session.success,
                                                error: req.session.error,
                                                file_server: process.env.FILE_SERVER,
                                                user_id: req.session.user_id,
                                                company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]),
                                                conversationid: req.params.conversationid,
                                                user_fullname: req.session.user_fullname,
                                                user_email: req.session.user_email,
                                                user_img: req.session.user_img,
                                                session_id: req.session.id,
                                                to_user_name: req.params.name,
                                                highlight: highlight,
                                                _: _,
                                                moment: moment,
                                                restart_time: restart_time,
                                                file_message: "No",
                                                has_login: true,
                                                page: 'chat',
                                                conversation_status: req.params.status,
                                                conversation_type: req.params.type,
                                                pin_status: req.params.p,
                                                mute_status: req.params.m,
                                                data: [{
                                                    conversation_id: req.params.conversationid,
                                                    conversation_type: req.params.type,
                                                    users: uresult.users,
                                                    conversation: conversationDetail,
                                                    // participants: conversationDetail[0].participants,
                                                    room_id: req.params.userid,
                                                    room_name: req.params.name,
                                                    privacy: req.params.privacy,
                                                    unreadThread: req.params.unreadThread,
                                                    has_flagged: req.params.has_flagged,
                                                    room_img: req.params.img,
                                                    conversation_list: conversation_list,
                                                    checklist: checklist,
                                                    groups: groups.result,
                                                    tags: tags,
                                                    conv_tag: conv_tag,
                                                    msg_tag: msg_tag,
                                                    files: filedata
                                                }, ],
                                            };
                                            res.render("mob_chat", res_data);
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    } else {
        res.redirect("/");
    }
});

// Pinned URL
router.post("/pinning", function(req, res, next) {
    if (req.session.login) {
        if (req.body.type == 'pin') {
            var bkid = models.uuidFromString(req.body.blockID);
            var uid = models.uuidFromString(req.session.user_id);
            models.instance.Pinned.find({ block_id: bkid, user_id: uid }, { raw: true, allow_filtering: true }, function(err, pindata) {
                if (err) {
                    res.send({ status: false, err: err });
                } else {
                    var id = models.uuid();
                    var pinned = new models.instance.Pinned({
                        id: id,
                        user_id: uid,
                        serial_number: pindata.length > 0 ? pindata.length + 1 : 1,
                        block_id: bkid
                    });
                    pinned.saveAsync().then(function() {
                        res.send(JSON.stringify({ status: true, msg: 'pin', pinID: id }));
                    }).catch(function(err) {
                        if (err) throw err;
                    });
                }
            });
        } else if (req.body.type == 'unpin') {
            //DELETE FROM Pinned WHERE id='??';
            var query_object = {
                id: models.uuidFromString(req.body.targetID)
            };

            models.instance.Pinned.delete(query_object, function(err) {
                if (err) res.send(JSON.stringify({ err }));
                else {
                    res.send(JSON.stringify({ status: true, msg: 'unpin' }));
                }
            });
        }
    } else {
        res.redirect("/");
    }
});

// For New Group Testing Purpose ocn = open chat test
router.get('/chat-t/:id/:name/:img', function(req, res, next) {
    if (req.session.login) {
        getActiveUsers(req.session.user_id, (uresult, uerror) => {
            if (uerror) console.log(uerror);
            //user is an array of plain objects with only name and age
            var res_data = {
                url: 'hayven',
                title: 'Connect',
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
router.get('/testmulter', function(req, res, next) {
    res.render('textpage');
});

router.post('/send_message', upload.array('photos', 10), function(req, res, next) {
    if (req.session.login) {
        if (req.files.length < 1) {
            res.json({ 'msg': 'No files were uploaded.' });
        } else {
            res.json({ 'file_info': req.files, 'msg': 'Successfully uploaded' });
        }
    } else {
        res.redirect('/');
    }
});

router.post('/convImg', upload.single('photos'), function(req, res, next) {
    if (req.session.login) {
        res.json({ 'msg': 'Successfully', 'filename': req.file.filename });
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

router.post('/add_reac_emoji', function(req, res, next) {
    if (req.session.login) {
        check_reac_emoji_list(req.body.msgid, req.session.user_id, (result) => {
            if (result.status) {
                // console.log(791, result);
                if (result.result.length == 0) {
                    // add first time like/reaction
                    add_reac_emoji(req.body.conversation_id, req.body.msgid, req.session.user_id, req.session.user_fullname, req.body.emoji, (result1) => {
                        res.json(result1);
                    });
                } else {
                    // console.log(789, result.result[0].emoji_name,  req.body.emoji)
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
router.post('/emoji_rep_list', function(req, res, next) {
    if (req.session.login) {
        view_reac_emoji_list(req.body.msgid, req.body.emojiname, (result) => {
            res.json(result.result);
        });
    } else {
        res.redirect('/');
    }
});

router.post('/flag_unflag', function(req, res, next) {
    if (req.session.login) {
        flag_unflag(req.body.msgid, req.body.uid, req.body.is_add, req.body.conversation_id, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});


router.post('/commit_msg_delete', function(req, res, next) {
    if (req.session.login) {
        commit_msg_delete(req.body.conversation_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});

router.post('/update_msg_status', function(req, res, next) {
    if (req.session.login) {
        update_msg_status_add_viewer(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});

router.post('/update_seen_status', function(req, res, next) {
    if (req.session.login) {
        update_seen_status(JSON.parse(req.body.msgid_lists), req.body.user_id, req.body.conversation_id, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});



router.get('/new-group', function(req, res, next) {
    if (req.session.login) {
        getActiveUsers(req.session.user_id, (uresult, uerror) => {
            if (uerror) console.log(uerror);
            //user is an array of plain objects with only name and age
            var res_data = {
                url: 'hayven',
                title: 'Connect',
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
router.post("/groupMemberDelete", function(req, res, next) {
    if (req.session.login) {
        checkAdmin(req.body.conversation_id, req.body.targetID, result => {
            if (result) {
                if (result.status) {
                    var newConversationArray = result.conversation;
                    if (typeof newConversationArray[0] !== "undefined" && newConversationArray[0] !== null) {
                        res.send(JSON.stringify("creator"));
                    } else {
                        checkParticipants(req.body.conversation_id)
                            .then((response) => {
                                if (response.conversation.participants.length > 1) {
                                    models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
                                        participants_admin: { $remove: [req.body.targetID] },
                                        participants: { $remove: [req.body.targetID] },
                                    }, update_if_exists, function(err) {
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
                    }
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
        models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]) }, {
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
router.post("/leave_room", function(req, res, next) {
    if (req.session.login) {

        checkParticipants(req.body.conversation_id)
            .then((response) => {
                if (req.body.type == "leave") {
                    if (response.conversation.participants.length > 1) {
                        models.instance.Conversation.update({ conversation_id: models.uuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
                                participants: { $remove: [req.body.targetID] },
                                participants_admin: { $remove: [req.body.targetID] },
                            }, update_if_exists,
                            function(err) {
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

                        models.instance.Conversation.delete(query_object, function(err) {
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
        //               { conversation_id: models.uuidFromString(req.body.conversation_id),company_id:models.timeuuidFromString(userCompany_id[req.session.user_id]) },
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
        models.instance.Conversation.update({
                conversation_id: models.timeuuidFromString(req.body.conversation_id),
                company_id: models.timeuuidFromString(req.body.company_id)
            }, {
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
        models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
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


// Url for delete conversation from conversation table by cpnversation id
router.post("/cnvDlt", function(req, res, next) {
    if (req.session.login) {

        check_only_Creator_or_admin(req.body.cnvID, req.body.targetID, result => {
            if (result.status) {
                var query_object = {
                    conversation_id: models.uuidFromString(req.body.cnvID)
                };
                models.instance.Conversation.delete(query_object, function(err) {
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
                                models.instance.Conversation.delete(query_object, function(err) {
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
router.post("/hideUserinSidebar", function(req, res, next) {
    if (req.session.login) {
        models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
                is_active: { $add: [req.body.targetID] },
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

// Url for add participants ID in conversation tbl
router.post("/removeHideUserinSidebar", function(req, res, next) {
    if (req.session.login) {
        models.instance.Conversation.update({ conversation_id: models.timeuuidFromString(req.body.conversation_id), company_id: models.timeuuidFromString(req.body.company_id) }, {
                is_active: { $remove: [req.body.targetID] },
            }, update_if_exists,
            function(err) {
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
router.post('/commit_msg_delete_for_Todo', function(req, res, next) {
    if (req.session.login) {
        commit_msg_delete_for_Todo(req.body.activity_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});

router.post('/permanent_msg_delete_todo', function(req, res, next) {
    if (req.session.login) {
        permanent_msg_delete_todo(req.body.activity_id, req.body.msgid, req.body.uid, req.body.is_seen, req.body.remove, (result) => {
            res.json(result);
        });
    } else {
        res.redirect('/');
    }
});

router.get('/viewmsg', function(req, res, next) {
    models.instance.Messages.find({ conversation_id: models.uuidFromString('81b2343f-6c7c-4f87-8a6d-2e36d4fc3b1c') }, { raw: true, allow_filtering: true }, function(err, message) {
        // models.instance.Messages.find({conversation_id: models.uuidFromString('8fee0cb6-4d8f-4e3c-b702-cbcd2ce5584e')}, {raw:true, allow_filtering: true}, function(err, message){
        if (err) {
            console.log(error);
        } else {
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
module.exports = router;