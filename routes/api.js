var express = require('express');
var bcrypt = require('bcryptjs');
var FCM = require('fcm-node');
var multer = require('multer');
var fcm = new FCM('AAAAwSuL-Gg:APA91bGQeZg_iF_nu7zWvGq4XfkPKRas5H8T8BVKL3Ve8o5HqKHQh2vMcWZYL4W5kl1fUPqd8osSP4EXNA59Y2QstNSd1S0MoptoXRCusSia1-ql62fapg8NT7tRlAuxBHRnEqeNxE4c');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
var inArray = require('in-array');
var {models} = require('./../config/db/express-cassandra');
var {passwordToHass, passwordToCompare} = require('./../utils/hassing');
var {getActiveUsers} = require('./../utils/chatuser');
var { hayvenjs } = require('./../utils/hayvenjs');
var { customTitle } = require('./../utils/customtitle');
var { ensureToken, token_verify_by_device_id } = require('./../utils/jwt_helper');
const isEmpty = require('../validation/is-empty');
const validator = require('validator');
const isUuid = require('uuid-validate');
var jwt = require('jsonwebtoken');


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
  getAllUnread,
  getPersonalConversation,
  replyId,
  find_reply_list,
  deleteThisTag,
  all_unread_dataFun
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
var {signup_utils} = require('./../utils/signup_utils');

var get_messages_tag = (conversation_id, user_id, callback) =>{
  models.instance.MessagesTag.find({conversation_id: models.uuidFromString(conversation_id), tagged_by:models.uuidFromString(user_id) }, {raw:true, allow_filtering: true}, function(err, tags){
    if(err){
      callback({status: false, err: err});
    }else{
      callback({status: true, tags: tags});
    }
  });
};

var get_myTags = (conversation_id, user_id, callback) => {
	models.instance.Tag.find({ tagged_by: models.uuidFromString(user_id), type: "CONNECT" }, {allow_filtering: true}, function (tagserr, tags) {
		if (tagserr) { 
			callback({status: false, err: tagserr});
		} else {
			models.instance.Convtag.find({ conversation_id: models.uuidFromString(conversation_id)}, {allow_filtering: true}, function (err, Ctags) {
				if (tagserr) { 
					callback({ status: false, err: tagserr });
				} 
				else {
					var condtagsid = [];
					var tagList = [];
					var conv_tag = {};
					
					_.each(Ctags, function (value, key) {
						if(condtagsid.indexOf(value.tag_id.toString()) === -1){
							condtagsid.push(value.tag_id.toString());
							conv_tag[value.tag_id.toString()] = value.id.toString();
						}
					});
					_.each(tags, function (value, key) {
						var data = {};
						if(condtagsid.indexOf(value.tag_id.toString()) > -1){
							data['isActive'] = true;
						}else{
							data['isActive'] = false;
						}
						data['tag_id'] = value.tag_id.toString();
						data['tagged_by'] = value.tagged_by.toString();
						data['title'] = value.title;
						data['type'] = value.type;
						data['created_at'] = value.created_at;
						if(conv_tag[value.tag_id.toString()] == null || conv_tag[value.tag_id.toString()] == undefined ){
							data['conv_tag_id'] = 0;
						}else{
							data['conv_tag_id'] = conv_tag[value.tag_id.toString()];
						}
						tagList.push(data);
					});
					callback({ status: true, tags: tagList, Ctags: Ctags });
				}
			});
		}
	});
};

// creates a configured middleware instance
// destination: handles destination
// filenane: allows you to set the name of the recorded file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/upload/`))
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.replace(path.extname(file.originalname), '@') +Date.now() +  path.extname(file.originalname));
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });

// function ensureToken(req, res, next){
// 	const bearerHeader = req.headers["authorization"];
// 	if(typeof bearerHeader !== 'undefined'){
// 		const bearer = bearerHeader.split(" ");
// 		const bearerToken = bearer[1];
// 		req.token = bearerToken;
// 		next();
// 	}
// 	else{
// 		res.sendStatus(403);
// 	}
// }

function checkThisIdActiveOrNot(array,myid){
    if (array == null) {
        return true;
    }else if (array.indexOf(myid) > -1){
        return false;
    }else{
        return true;
    }
}
function idToNameArr(idArry){
    var namearr = [];
    _.each(idArry, function(v,k){
        namearr.push(alluserOnLoad[v]==null ? "[Deleted]" : alluserOnLoad[v])
    });
    return namearr;
}

function validate(req, type, name, value)
{
	if(req == true){
		if(isEmpty(value)) return {status: false, error: name + ' is empty.'};
	}
	if(type == 'uuid'){
		if(! isUuid(value)) return {status: false, error: name + ' is not valid.'};
	}
	if(type == 'email'){
		if(! validator.isEmail(value)) return {status: false, error: name + ' is not valid.'};
	}
	if(type == 'int'){
		if(! validator.isInt(value)) return {status: false, error: name + ' is not valid.'};
	}
	
	return {status: true};
}

/* GET blank request and send 401 page. */
router.get('/', function(req, res, next) {
    res.status(401).send({ error : "You are unauthorized to make this request." });
});

/* POST login listing. */
router.post('/login', function(req, res, next) {
    var session_id = req.sessionID;
	if(! validate(true, 'email', 'Email', req.body.email).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'email', 'Email', req.body.email).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else if(! validate(true, 'text', 'Password', req.body.password).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'text', 'Password', req.body.password).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else{
		models.instance.Users.findOne({email:req.body.email, is_delete:0}, {raw:true, allow_filtering: true}, function(error, oneUser){
		  if(oneUser != null){
				models.instance.Users.find({company_id:models.timeuuidFromString(oneUser.company_id.toString())}, {raw:true, allow_filtering: true}, async function(err, users){
					if(err) throw err;
					//user is an array of plain objects with only name and age
					var alluserlist = [];
					var user = {};
					var msg = '';
					_.each(users, function(v,k){
						alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
						alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
						
						if(req.body.email == v.email){
							if(passwordToCompare(req.body.password, v.password)){
								msg = "true";
								if (v.conference_id == null) {
									var newid = models.timeuuid().toString() + '_personal';
									var update_values_object = { conference_id: newid };
									models.instance.Users.update({ id: models.uuidFromString(v.id) }, update_values_object, update_if_exists, function (err) {
									});
								}else{
									var newid = v.conference_id;
								}
								user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: newid };
								userCompany_id[user.id] = user.company_id.toString();
							}else{
								msg = 'Password does not match';
							}
						}
					});
			
					if(msg == ""){
						res.status(404).send({
						alluserlist: [],  conversations: [],  user: {}, msg: "Email address is invalid",
						session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [],
						my_room: [], joined_room: [], to_be_join: [] });
					}
					else if(msg == "Password does not match"){
						res.status(404).send({
						alluserlist: [],  conversations: [],  user: {}, msg: "Password does not match",
						session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [],
						my_room: [], joined_room: [], to_be_join: [] });
					}
					else{
						// let iscall = await getRoomInfoUser(user.id.toString());
            // if (iscall == false) //await del_busyData(user.id.toString());
						// Get all conversations
						getAllConversation(user.id.toString(),(result)=>{
							customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
								var allCusName = {};
								if(allNic.status){
									_.each(allNic.result,function(nv,nk){
										allCusName[nv.change_id] = {nv};
									});
								}
								if(result.status){
									query_object = {id: user.id};
									update_values_object = {gcm_id: req.body.gcm_id}; // ??
									options = {conditions: {email: req.body.email}};
					
									var conversations = result.conversations;
									var myConversationList = [] // keep all conversatons in this array
									var conversationTitle = {};
									var conversationType = {};
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
					
					
									alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);
					
									_.each(alluserlist, function(users,k){
										userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
										if(allCusName[users.id] != undefined){
											userName[users.id] = allCusName[users.id]['nv'].change_title;
										}
										userImg[users.id] = users.img;
									});
									//Get conversation detail along with user table for further user list to android
									if(result.conversations.length > 0){
										_.each(result.conversations, function(conversations,k){
											if(!isEmpty(conversations.title)){
												if(checkThisIdActiveOrNot(conversations.is_active,user.id.toString())){
													if(myConversationList.indexOf(conversations.conversation_id.toString()) === -1){							
														myConversationList.push(conversations.conversation_id.toString());
														conversationTitle[conversations.conversation_id.toString()] = conversations.title;
														conversationType[conversations.conversation_id.toString()] = conversations.single;
														conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
														conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
														conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
														conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
														conversationStatus[conversations.conversation_id.toString()] = conversations.status;
														conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;
								
														if(conversations.single == 'yes'){
															if(conversations.participants.length == 1){
																myConversationID = conversations.conversation_id.toString();
															} else {
																_.forEach(conversations.participants, function(pv, pk){
																	if(pv !== null && pv.toString() !== user.id.toString()){
																		conversationWith[conversations.conversation_id.toString()] = pv;
																	}
																});
															}
														}
													}
												}
											}
										});
						
										if(myConversationList.length > 0){
											getAllMsg(myConversationList,(result)=>{						
												if(result.status){							
													var all_unread = [];
													var all_message = [];
													var counts = {};
													var last_conversation_id = [];
													var androidUserList = [];
													var androidCallList = [];
							
													// Push all messages
													_.forEach(result.data, function(amv, amk){
													if(amv.length>0){
							
														_.each(amv, function (mv, mk) {
							
															if (mv.has_hide != null){
																if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
																	if (mv.has_delete != null) {
																		if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
																			all_message.push(mv);
																		}
																	} else {
																		all_message.push(mv);
																	}
																}
															}else{
																if (mv.has_delete != null) {
																	if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
																		all_message.push(mv);
																	}
																}else{
																	all_message.push(mv);
																}
															}
														});
													}
													});
							
													// Get all unread message
													var all_message_orderBy = all_message;
													_.forEach(all_message_orderBy, function(amv, amk){
														if(amv.msg_status == null){
															amv.msg_status = []
														}
														if(amv.msg_status.indexOf(user.id) > -1){
															all_unread.push(amv);
														}
													});
							
													//Count unread message and push it to counts array
													all_unread.forEach(function(x) {
													counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0)+1;
													});
							
													//Get All last Message
													_.forEach(all_message_orderBy, function(amv, amk){
													if(last_conversation_id.indexOf(amv.conversation_id.toString()) === -1){
														last_conversation_id.push(amv.conversation_id.toString());
														// all_last_message.push(amv);
														if(amv.conversation_id.toString() !== myConversationID){
														// if(conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
														if(!isEmpty(amv.msg_body)){
															var participants_admin = [];
							
															androidUserList.push({
															'conversation_id':amv.conversation_id,
															'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
															'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
															'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
															'privacy': conversationPrivacy[amv.conversation_id.toString()],
															'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
															'participants' : conversationParticipants[amv.conversation_id.toString()],
															'status' : conversationStatus[amv.conversation_id.toString()],
															'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
															'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
															'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
															'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
															'msg_id':amv.msg_id,
															'msg_type':amv.msg_type,
															'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
															'sender_name':amv.sender_name,
															'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
															});
														}
							
														if(amv.msg_type == 'call'){
															androidCallList.push({
															'conversation_id':amv.conversation_id,
															'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
															'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
															'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
															'privacy': conversationPrivacy[amv.conversation_id.toString()],
															'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
															'participants' : conversationParticipants[amv.conversation_id.toString()],
															'status' : conversationStatus[amv.conversation_id.toString()],
															'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
															'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
															'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
															'created_at':(amv.msg_body == null ? 'null':amv.created_at),
															'call_duration':(amv.call_duration == "" ? 0:amv.call_duration),
															'call_type':amv.call_type,
															'call_status':amv.call_status,
															'call_msg':amv.call_msg,
															'msg_id':amv.msg_id,
															'msg_type':amv.msg_type,
															'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
															'sender_name':amv.sender_name,
															'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
															});
														}
														}
													}
													});
							
													getAllpinUnpinList(user.id.toString())
													.then((response)=>{
							
														_.forEach(androidUserList, function (val, k) {
														val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true:false);
														val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()]:'0');
														});
							
														var query = {
														mute_by: {$eq: models.uuidFromString(user.id.toString())}
														};
														models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv){
														if(error){
															callback({status: false});
														}else{
							
															var allMuteActiveConv = [];
															var muData = [];
															var mute_id = {};
															var mute_duration = {};
															_.forEach(all_conv, function(v, k){
															if(v.mute_status == "active"){
																allMuteActiveConv.push(v.conversation_id.toString());
																mute_id[v.conversation_id.toString()] = v.mute_id;
																mute_duration[v.conversation_id.toString()] = v.mute_duration;
																muData.push(v);
															}
															});
							
															_.forEach(androidUserList, function (val, k) {
																if(allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1){
																val['isMute'] = true;
																val['mute_id'] = mute_id[val.conversation_id.toString()];
																val['mute_duration'] = mute_duration[val.conversation_id.toString()];
																val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
																}else{
																val['isMute'] = false;
																val['mute_id'] = false;
																val['mute_duration'] = false;
																val['muteData'] = {};
																}
															});
							
															var data = {
															keySpace: user.company_id
															};
							
															models.instance.Tag.find({tagged_by: models.uuidFromString(user.id.toString())}, { allow_filtering: true }, function(tagserr, tags){
							
															if(tagserr){
																throw tagserr;
															}else{
																hayvenjs.room_status(data, (demodata) => {
																if(demodata.staus){
							
																	_.forEach(demodata.rooms, function (bbv, bbk) {
																	if(bbv.single == 'yes'){
							
																		if(bbv.participants.length > 1){
																		_.forEach(bbv.participants, function(bpv, bpk){
																			if(bpv !== null && bpv.toString() !== user.id.toString()){
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
																	if(unique_conversation.indexOf(dv.conversation_id.toString()) == -1){
																		unique_conversation.push(dv.conversation_id.toString());
																		if(dv.single == 'yes'){
																		// console.log(dv.conversation_id.toString()+"=="+userName[conversationWith[dv.conversation_id.toString()]]);
																		// dv['join_status'] = 'personal';
																		// dv['user_name'] =  userName[conversationWith[dv.conversation_id.toString()]];
																		// dv['user_img'] = userImg[conversationWith[dv.conversation_id.toString()]];
																		}else{
																		if(dv.created_by){
																			if(dv.created_by.toString() == user.id.toString()){
																			dv['join_status'] = 'my_room';
																			dv['user_name'] = null;
																			dv['user_img'] =  null;
																			dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
																			my_room.push(dv);
																			}else if(dv.participants.indexOf(user.id.toString()) > -1 ){
																			dv['join_status'] = 'joined_room';
																			dv['user_name'] = null;
																			dv['user_img'] =  null;
																			dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
																			joined_room.push(dv);
																			}else if(dv.participants.indexOf(user.id.toString()) == -1 && dv.privacy == 'public'){
																			dv['join_status'] = 'to_be_join';
																			dv['user_name'] = null;
																			dv['user_img'] =  null;
																			dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
																			to_be_join.push(dv);
																			}
																		}
							
																		}
																	}
																	});
																}
							
																res.status(200).send({
																	alluserlist: alluserlist,
																	conversations: conversations,
																	user: user,
																	msg: msg,
																	tags:tags,
																	myUserList: _.orderBy(androidUserList, ['created_at'],['desc']),
																	androidCallList:androidCallList,
																	session_id:req.sessionID,
																	my_room:my_room,
																	joined_room:joined_room,
																	to_be_join:to_be_join
																	// rooms: demodata.rooms
																});
																});
							
															}
															});
							
														};
														});
							
													}).catch((err)=>{
														console.log(551, err);
													});
							
												}else{
													console.log(555, result);
												}
											});
										}
									}else{
										res.status(404).send({
											alluserlist,  conversations: [],  user, msg,
											session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [],
											my_room: [], joined_room: [], to_be_join: [] });
									}
								}else{
									console.log(566, result);
								}
							})
				
						});
					}
				});
		  }else{
				res.status(404).send({
				alluserlist: [],  conversations: [],  user: {}, msg: "Email address is invalid",
				session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [],
				my_room: [], joined_room: [], to_be_join: [] });
		  }
		});
	}
});

router.post('/reload_conversation', function(req, res, next) {
	console.log(602,'reload converwsationasdfasdfasdf asdfasdf asdf');
	var session_id = req.sessionID;
	if(! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else if(! validate(true, 'uuid', 'ID', req.body.id).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'uuid', 'ID', req.body.id).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else{
		models.instance.Users.find({company_id:models.timeuuidFromString(req.body.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
		  if(err) throw err;
		  //user is an array of plain objects with only name and age
		  var alluserlist = [];
		  var user = '';
		  var msg = "true";
		  _.each(users, function(v,k){
			alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
			alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
			if(v.id.toString() == req.body.id){
			  user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id};
			  userCompany_id[req.body.id] =  v.company_id.toString();
			}
		  });

		  if(user == ''){
			res.send({status:false});
		  }

		  // Get all conversations
		  getAllConversation(req.body.id.toString(),(result)=>{
			customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
			  var allCusName = {};
			  if(allNic.status){
				_.each(allNic.result,function(nv,nk){
				  allCusName[nv.change_id] = {nv};
				})
			  }
			  if(result.status){
				var conversations = result.conversations;
				var myConversationList = [] // keep all conversatons in this array
				var conversationTitle = {};
				var conversationType = {};
				var conversationWith = {};
				var conversationImage = {};
				var conversationPrivacy = {};
				var conversationStatus = {};
				var conversationParticipants = {};
				var conversationParticipants_admin = {};
				var userName = {};
				var userImg = {};
				var myConversationID = "";
				var conversationisActive = {};

				alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

				// _.each(alluserlist, function(users,k){
				//   userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
				//   userImg[users.id] = users.img;
				// });
				_.each(alluserlist, function(users,k){
				  userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
				  if(allCusName[users.id] != undefined){
					userName[users.id] = allCusName[users.id]['nv'].change_title;
				  }
				  userImg[users.id] = users.img;
				});

				//Get conversation detail along with user table for further user list to android
				if(result.conversations.length > 0){
					_.each(result.conversations, function(conversations,k){
					  if(!isEmpty(conversations.title)){
						if(checkThisIdActiveOrNot(conversations.is_active,user.id.toString())){
						  if(myConversationList.indexOf(conversations.conversation_id.toString()) === -1){

							myConversationList.push(conversations.conversation_id.toString());
							  conversationTitle[conversations.conversation_id.toString()] = conversations.title;
							  conversationType[conversations.conversation_id.toString()] = conversations.single;
							  conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
							  conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
							  conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
							  conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
							  conversationStatus[conversations.conversation_id.toString()] = conversations.status;
							  conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;

							if(conversations.single == 'yes'){
							  if(conversations.participants.length == 1){
								myConversationID = conversations.conversation_id.toString();
							  }else{
								_.forEach(conversations.participants, function(pv, pk){
								  // console.log(491, pv);
								  if(pv !== null && pv.toString() !== user.id.toString()){
									conversationWith[conversations.conversation_id.toString()] = pv;
								  }
								});
							  }
							}
						  }
						}
					  }
					});

				  if(myConversationList.length > 0){
					getAllMsg(myConversationList,(result)=>{

					  if(result.status){

						var all_unread = [];
						var all_message = [];
						var counts = {};
						var last_conversation_id = [];
						var androidUserList = [];
						var androidCallList = [];

						// Push all messages
						_.forEach(result.data, function(amv, amk){
						  if(amv.length>0){

							_.each(amv, function (mv, mk) {

							  if (mv.has_hide != null){
								if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
								  if (mv.has_delete != null) {
									if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
									  // if ((mv.has_delete).indexOf('Sender delete it') > -1) {

									  // } else {
										all_message.push(mv);
									  // }
									}
								  } else {
									all_message.push(mv);
								  }
								}
							  }else{
								if (mv.has_delete != null) {
								  if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
									// if ((mv.has_delete).indexOf('Sender delete it') > -1) {

									// }else{
									  all_message.push(mv);
									// }
								  }
								}else{
								  all_message.push(mv);
								}
							  }
							});
						  }
						});

						// Get all unread message
						var all_message_orderBy = all_message;
						var counter = 0;
						_.forEach(all_message_orderBy, function(amv, amk){
						  if(amv.msg_status == null && amv.sender.toString() != user.id.toString()){
							  //all_unread.push(amv);
						  }
						  	if(amv.msg_status == null){
								amv.msg_status = []
							}
							if(amv.msg_status.indexOf(user.id) > -1){
								counter++;
								all_unread.push(amv);
							}
						  
						});
						console.log(769,counter)

						//Count unread message and push it to counts array
						all_unread.forEach(function(x) {
						  counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0)+1;
						});

						//Get All last Message
						_.forEach(all_message_orderBy, function(amv, amk){
						  if(last_conversation_id.indexOf(amv.conversation_id.toString()) === -1){
							last_conversation_id.push(amv.conversation_id.toString());
							// all_last_message.push(amv);
							if(amv.conversation_id.toString() !== myConversationID){
							//   if(conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
							  if(amv.participants_admin != null){
								participants_admin = amv.participants_admin;
							  }
							  if(!isEmpty(amv.msg_body)){
								androidUserList.push({
								  'conversation_id':amv.conversation_id,
								  'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
								  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
								  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
								  'privacy': conversationPrivacy[amv.conversation_id.toString()],
								  'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
								  'participants' : conversationParticipants[amv.conversation_id.toString()],
								  'status' : conversationStatus[amv.conversation_id.toString()],
								  'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
								  'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
								  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
								  'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
								  'msg_id':amv.msg_id,
								  'msg_type':amv.msg_type,
								  'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
								  'sender_name':amv.sender_name,
								  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
								});
							  }

							  if(amv.msg_type == 'call'){
								androidCallList.push({
								  'conversation_id':amv.conversation_id,
								  'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
								  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
								  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
								  'privacy': conversationPrivacy[amv.conversation_id.toString()],
								  'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
								  'participants' : conversationParticipants[amv.conversation_id.toString()],
								  'status' : conversationStatus[amv.conversation_id.toString()],
								  'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
								  'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
								  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
								  'created_at':(amv.msg_body == null ? 'null':amv.created_at),
								  'call_duration':(amv.call_duration == "" ? 0:amv.call_duration),
								  'call_type':amv.call_type,
								  'call_status':amv.call_status,
								  'call_msg':amv.call_msg,
								  'msg_id':amv.msg_id,
								  'msg_type':amv.msg_type,
								  'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
								  'sender_name':amv.sender_name,
								  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
								});
							  }
							}

						  }
						});
						// console.log(930, androidUserList);

						getAllpinUnpinList(user.id.toString())
						  .then((response)=>{

							_.forEach(androidUserList, function (val, k) {
								val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true:false);
								val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()]:'0');
							});

							var query = {
							  mute_by: {$eq: models.uuidFromString(user.id.toString())}
							};

							models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv){
								if(error){
								  callback({status: false});
								}else{

								  var allMuteActiveConv = [];
								  var muData = [];
								  var mute_id = {};
								  var mute_duration = {};
								  _.forEach(all_conv, function(v, k){
									if(v.mute_status == "active"){
									  allMuteActiveConv.push(v.conversation_id.toString());
									  mute_id[v.conversation_id.toString()] = v.mute_id;
									  mute_duration[v.conversation_id.toString()] = v.mute_duration;
									  muData.push(v);
									}
								  });

								  _.forEach(androidUserList, function (val, k) {

									if(allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1){
									  val['isMute'] = true;
									  val['mute_id'] = mute_id[val.conversation_id.toString()];
									  val['mute_duration'] = mute_duration[val.conversation_id.toString()];
									  val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
									}else{
									  val['isMute'] = false;
									  val['mute_id'] = false;
									  val['mute_duration'] = false;
									  val['muteData'] = {};
									}
								  });

								  var data = {
									keySpace: user.company_id
								  };

								  models.instance.Tag.find({tagged_by: models.uuidFromString(user.id.toString())}, { allow_filtering: true }, function(tagserr, tags){

									if(tagserr){
									  throw tagserr;
									}else{
									  hayvenjs.room_status(data, (demodata) => {
										if(demodata.staus){

										  _.forEach(demodata.rooms, function (bbv, bbk) {
											if(bbv.single == 'yes'){

											  if(bbv.participants.length > 1){
												_.forEach(bbv.participants, function(bpv, bpk){
												  if(bpv !== null && bpv.toString() !== user.id.toString()){
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
											if(unique_conversation.indexOf(dv.conversation_id.toString()) == -1){
											  unique_conversation.push(dv.conversation_id.toString());
											  if(dv.single == 'yes'){
												// console.log(dv.conversation_id.toString()+"=="+userName[conversationWith[dv.conversation_id.toString()]]);
												// dv['join_status'] = 'personal';
												// dv['user_name'] =  userName[conversationWith[dv.conversation_id.toString()]];
												// dv['user_img'] = userImg[conversationWith[dv.conversation_id.toString()]];
											  }else{
												if(dv.created_by){
												  if(dv.created_by.toString() == user.id.toString()){
													dv['join_status'] = 'my_room';
													dv['user_name'] = null;
													dv['user_img'] =  null;
													dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
													my_room.push(dv);
												  }else if(dv.participants.indexOf(user.id.toString()) > -1 ){
													dv['join_status'] = 'joined_room';
													dv['user_name'] = null;
													dv['user_img'] =  null;
													dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
													joined_room.push(dv);
												  }else if(dv.participants.indexOf(user.id.toString()) == -1 && dv.privacy == 'public'){
													dv['join_status'] = 'to_be_join';
													dv['user_name'] = null;
													dv['user_img'] =  null;
													dv['participants_name'] = idToNameArr(conversationParticipants[dv.conversation_id.toString()]);
													to_be_join.push(dv);
												  }
												}

											  }
											}
										  });
										}

										res.status(200).send({
										  alluserlist: alluserlist,
										  conversations: conversations,
										  user: user,
										  msg: msg,
										  tags:tags,
										  myUserList: _.orderBy(androidUserList, ['created_at'],['desc']),
										  androidCallList:androidCallList,
										  session_id:req.sessionID,
										  my_room:my_room,
										  joined_room:joined_room,
										  to_be_join:to_be_join
										  // rooms: demodata.rooms
										});
									  });

									}
								  });

								};
							});

						  }).catch((err)=>{
							console.log(944, err);
						  });

					  }else{
						console.log(948, result);
					  }
					});
				  }
				}else{
				  res.status(200).send({
					alluserlist: alluserlist,
					conversations:'',
					user: user,
					msg: msg,
					myUserList:'',
					session_id:req.sessionID
				  });
				}
			  }else{
				console.log(963, result);
			  }
			});
		  });
		});
	}
});

router.post('/get_conversation_data', function(req, res, next){
	// convid = conversation id if type = Group 
	// convid = friend id if type = Single
	if(! validate(true, 'text', 'Conversation type', req.body.type).status){
		res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: validate(true, 'text', 'Conversation type', req.body.type).error});
	}
	else if(! validate(true, 'uuid', 'Conversation ID', req.body.convid).status){
		res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: validate(true, 'uuid', 'Conversation ID', req.body.convid).error});
	}
	else if(! validate(true, 'uuid', 'User ID', req.body.user_id).status){
		res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: validate(true, 'uuid', 'User ID', req.body.user_id).error});
	}
	else if(! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
		res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error});
	}
	else{
		if(req.body.type == 'Group'){
			var conversation_id = models.uuidFromString(req.body.convid);
			findConversationHistory(conversation_id,null, (result, error) => {
				if(result.status){
					var conversation_list = result.conversation;
					var unseenId = [];
					var checklistMsgId = [];
					
					var location = [];
					_.forEach(result.files, function(fv, fk){
						location.push(fv.location);
					});
					// console.log(259, location);
					_.each(conversation_list, function(vc,kc){
						if(vc.msg_status == null){
							unseenId.push(vc.msg_id.toString());
						}else{
							var seenId = vc.msg_status;
							if(seenId.indexOf(req.body.user_id) == -1){
								unseenId.push(vc.msg_id.toString());
							}
						}
						if(vc.msg_type == 'checklist'){
							checklistMsgId.push(models.timeuuidFromString(vc.msg_id.toString()));
						}
						else if(vc.msg_type.indexOf('media')>-1){
							if(vc.msg_type.indexOf('imgfile')>-1){
								var temparr = [];
								_.forEach(vc.attch_imgfile, function(vcv, vck){
									// console.log(272, vcv);
									if(location.indexOf(vcv) > -1) temparr.push(vcv); 
									else temparr.push('common/file-removed-message.png');
								});
							vc.attch_imgfile = temparr.length == 0 ? null : temparr;
							}
							if(vc.msg_type.indexOf('audiofile')>-1){
								var temparr = [];
								_.forEach(vc.attch_audiofile, function(vcv, vck){
									if(location.indexOf(vcv) > -1) temparr.push(vcv);
								});
								vc.attch_audiofile = temparr.length == 0 ? null : temparr;
							}
							if(vc.msg_type.indexOf('videofile')>-1){
								var temparr = [];
								_.forEach(vc.attch_videofile, function(vcv, vck){
									if(location.indexOf(vcv) > -1) temparr.push(vcv);
								});
								vc.attch_videofile = temparr.length == 0 ? null : temparr;
							}
							if(vc.msg_type.indexOf('otherfile')>-1){
								var temparr = [];
								_.forEach(vc.attch_otherfile, function(vcv, vck){
									if(location.indexOf(vcv) > -1) temparr.push(vcv);
								});
								vc.attch_otherfile = temparr.length == 0 ? null : temparr;
							}
						}
					});


					get_myTags(conversation_id.toString(), req.body.user_id, (tRes, Terr) => {
						if (Terr) res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[],msg: "get my tags error", error: Terr});
					  
						get_messages_tag(conversation_id.toString(), req.body.user_id, (mtgsRes) => {
							var tagID = [];
							var tags = [];
							var condtagsid = [];
							var usedTag = {};

							_.each(tRes.Ctags, function (value, key) {
								tagID.push(value.id.toString());
								if(condtagsid.indexOf(value.tag_id.toString()) === -1){
									condtagsid.push(value.tag_id.toString());
								}
							});

							var tagsIDS = [];

							_.each(tRes.tags, function (v, k) {
								if(tagsIDS.indexOf(v.tag_id) > -1){
									usedTag[v.tag_id] = true;
								}else{
									usedTag[v.tag_id] = false;
								}
							});

							if(checklistMsgId.length > 0){
								var query = {
									msg_id: {'$in': checklistMsgId}
								};
								models.instance.MessageChecklist.find(query,{raw:true, allow_filtering: true},function(cerror,cresult){
									if(cerror){
										res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[],msg: "Message Checklist error", error: cerror});
									}else{
										if(cresult.length > 0){
											_.each(conversation_list,function(mv,mk){
												if(mv.msg_type == 'checklist'){
													var thismsgcl = [];
													_.each(cresult,function(cv,ck){
														if(cv.msg_id.toString() == mv.msg_id.toString()){
															thismsgcl.push(cv);
															// console.log(307, thismsgcl);
														}
													});
													// console.log(310,thismsgcl);
													conversation_list[mk]['checklist'] =  thismsgcl;
												}
												else{
													conversation_list[mk]['checklist'] =  [];
												}
											});
										}

										if(unseenId.length > 0){
											update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) =>{
												if(result.status){
													res.status(200).send({conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS });
												}
												else{
													console.log(1107, result);
												}
											});
										}
										else{
											res.status(200).send({conversation_id: conversation_id, result: conversation_list,totalTags: tRes.tags,messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS});
										}
									}
								});
							}
							else{
								_.each(conversation_list,function(mv,mk){
									if(mv.msg_type != 'checklist'){
										conversation_list[mk]['checklist'] =  [];
									}
								});

								if(unseenId.length > 0){
									update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) =>{
										if(result.status){
											res.status(200).send({conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS});
										}
										else{
											console.log(363, result);
										}
									});
								}
								else{
									res.status(200).send({conversation_id: conversation_id, result: conversation_list,totalTags: tRes.tags,messagestag: mtgsRes.tags,con_tag_id:condtagsid,usedTag:usedTag, tagsIDS:tagsIDS});
								}
							}
						});
					});
				}
				else{
					res.status(404).send({conversation_id: conversation_id, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[],msg: "No data found."});
				}
			});
		}
		else{
			createPersonalConv2( req.body.user_id, req.body.convid, req.body.ecosystem, req.body.company_id, (result1, err) =>{
				if (err) {
					res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: "Conversation create error.", error: err});
				} 
				else {
					// console.log(394, JSON.stringify(result1));
					if(result1.status)
					  var conversation_id = result1.conversation_id;
					else
					  var conversation_id = models.uuidFromString(req.body.convid);
					console.log(1153,conversation_id);
					findConversationHistory(conversation_id,null, (result, error) => {
						console.log(1547);
						if(result.status){
							var conversation_list = result.conversation;
							var unseenId = [];
							var checklistMsgId = [];
							
							var location = [];
							_.forEach(result.files, function(fv, fk){
								location.push(fv.location);
							});
							
							_.each(conversation_list, function(vc,kc){
								if(vc.msg_status == null){
									unseenId.push(vc.msg_id.toString());
								}
								else{
									var seenId = vc.msg_status;
									if(seenId.indexOf(req.body.user_id) == -1){
										unseenId.push(vc.msg_id.toString());
									}
								}
								if(vc.msg_type == 'checklist'){
									checklistMsgId.push(models.timeuuidFromString(vc.msg_id.toString()));
								}
								else if(vc.msg_type.indexOf('media')>-1){
									if(vc.msg_type.indexOf('imgfile')>-1){
										var temparr = [];
										_.forEach(vc.attch_imgfile, function(vcv, vck){
											// console.log(272, vcv);
											if(location.indexOf(vcv) > -1) temparr.push(vcv);
											else temparr.push('common/file-removed-message.png');
										});
										vc.attch_imgfile = temparr.length == 0 ? null : temparr;
									}
									if(vc.msg_type.indexOf('audiofile')>-1){
										var temparr = [];
										_.forEach(vc.attch_audiofile, function(vcv, vck){
											if(location.indexOf(vcv) > -1) temparr.push(vcv);
										});
										vc.attch_audiofile = temparr.length == 0 ? null : temparr;
									}
									if(vc.msg_type.indexOf('videofile')>-1){
										var temparr = [];
										_.forEach(vc.attch_videofile, function(vcv, vck){
											if(location.indexOf(vcv) > -1) temparr.push(vcv);
										});
										vc.attch_videofile = temparr.length == 0 ? null : temparr;
									}
									if(vc.msg_type.indexOf('otherfile')>-1){
										var temparr = [];
										_.forEach(vc.attch_otherfile, function(vcv, vck){
											if(location.indexOf(vcv) > -1) temparr.push(vcv);
										});
										vc.attch_otherfile = temparr.length == 0 ? null : temparr;
									}
								}
							});
			  
							get_myTags(conversation_id.toString(), req.body.user_id, (tRes, Terr) => {
								if (Terr) 
									res.status(404).send({conversation_id: req.body.convid, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[],msg: "get my tags error", error: Terr});
							  
								get_messages_tag(conversation_id.toString(), req.body.user_id, (mtgsRes) => {
									var tagID = [];
									var tags = [];
									var condtagsid = [];
									var usedTag = {};
				  
									_.each(tRes.Ctags, function (value, key) {
										tagID.push(value.id.toString());
										if(condtagsid.indexOf(value.tag_id.toString()) === -1){
											condtagsid.push(value.tag_id.toString());
										}
									});
				  
									var tagsIDS = [];
				  
									_.each(tRes.tags, function (v, k) {
										if(tagsIDS.indexOf(v.tag_id) > -1){
											usedTag[v.tag_id] = true;
										}else{
											usedTag[v.tag_id] = false;
										}
									});
				  
									if(checklistMsgId.length > 0){
										var query = {
											msg_id: {'$in': checklistMsgId}
										};
										models.instance.MessageChecklist.find(query,{raw:true, allow_filtering: true},function(cerror,cresult){
											if(cerror){
												res.status(404).send({conversation_id: conversation_id, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[],msg: "Message checklist find error", error: cerror});
											}
											else{
												if(cresult.length > 0){
													_.each(conversation_list,function(mv,mk){
														if(mv.msg_type == 'checklist'){
															var thismsgcl = [];
															_.each(cresult,function(cv,ck){
																if(cv.msg_id.toString() == mv.msg_id.toString()){
																	thismsgcl.push(cv);
																	// console.log(478, thismsgcl);
																}
															});
															// console.log(481, thismsgcl);
															conversation_list[mk]['checklist'] =  thismsgcl;
														}else{
															conversation_list[mk]['checklist'] =  [];
														}
													});
												}
				  
												if(unseenId.length > 0){
													update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) =>{
														if(result.status){
															res.status(200).send({ conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS });
														}else{
															console.log(1276,result);
														}
													});
												}
												else{
													res.status(200).send({ conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS });
												}
											}
										});
									}
									else{
										_.each(conversation_list,function(mv,mk){
											if(mv.msg_type != 'checklist'){
												conversation_list[mk]['checklist'] =  [];
											}
										});
				  
										if(unseenId.length > 0){
											update_msg_status_add_viewer(unseenId, req.body.user_id, conversation_id.toString(), (result) =>{
												if(result.status){
												// console.log(529,conversation_list);
													res.status(200).send({ conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS });
												}
												else{
													console.log(1300, result);
												}
											});
										}
										else{
											// console.log(545,conversation_list);
											res.status(200).send({ conversation_id: conversation_id, result: conversation_list, totalTags: tRes.tags, messagestag: mtgsRes.tags, con_tag_id:condtagsid, usedTag:usedTag, tagsIDS:tagsIDS });
										}
									}
								});
							});
						}
						else{
							console.log(17001)
							res.status(404).send({conversation_id: conversation_id, result: [], totalTags: [], messagestag: [], con_tag_id:[], usedTag:[], tagsIDS:[], msg: "Conversation find error."});
						}
					});
				  }
			});
		}
	}
});

/**
 * leave from room
 * or delete a room
 */
router.post("/leave_delete_room", function (req, res, next) {
	console.log(1339, req.body);
	checkParticipants(req.body.conversation_id).then((response) => {
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
		}
		else if (req.body.type == "delete") {
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
		else{
			res.status(403).send(JSON.stringify({ msg: "invalid type" }));
		}
	}).catch((crr) => {
		console.log(crr);
		res.status(404).send(JSON.stringify({ msg: crr }));
	});
});

/**
 * Flag or unflag a message
 */
router.post('/flag_unflags', function (req, res, next) {
	var data = req.body.msgid;
	// console.log(1401, req.body);
	var results = [];

	if (!_.isArray(data)) {
		data = JSON.parse(data);
	}
	_.forEach(data, function (v, k) {
		// console.log(1408, v);
		read_msg_data(v, (rep) => {
			var yesno = (rep.has_flagged == null) ? 'yes' : (rep.has_flagged).indexOf(req.body.uid) > -1 ? 'no' : 'yes';
			flag_unflag(v, req.body.uid, yesno, req.body.convid, (result) => {
				console.log(result);
				results.push(result);
			});
			if (data.length == (k + 1)) {
				res.json({msg: "success"});
			}
		});
	});
});
/**
 * add reaction to message
 */
router.post('/add_reac_emoji', function (req, res, next) {
	console.log(1427, req.body);
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
});

/**
 * Home page reload or pagination for more data
 */
router.post('/homepage', function(req, res, next){
	if(! validate(true, 'uuid', 'User ID', req.body.user_id).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], msg: validate(true, 'uuid', 'User ID', req.body.user_id).error });
	}
	else if(! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error });
	}
	else if(req.body.start_at !== undefined && ! validate(false, 'int', 'Start at', req.body.start_at).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], msg: validate(false, 'int', 'Start at', req.body.start_at).error });
	}
	else{
		var start_at = 0;
		if(req.body.start_at !== undefined) start_at = Number(req.body.start_at);
		res.redirect('/api/home/' + models.uuidFromString(req.body.user_id) + '/' + models.timeuuidFromString(req.body.company_id) + '/' + start_at);
	}
});
/**
 * Make home page data
 */
router.get('/home/:id/:company_id/:start_at', function(req, res, next){
	console.log(1509, req.params.start_at)
	models.instance.Users.find({company_id:models.timeuuidFromString(req.params.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
		if(err) {res.status(404).send({conversations: [], user: {}, companies:[], msg: err });}
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
				user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: v.conference_id };
				userCompany_id[user.id] = user.company_id.toString();
			}
		});
		// Get all conversations
		var all_pin_conv_id = [];
		var conversations = [];
		models.instance.Conversation.find({participants: { $contains: req.params.id.toString() }}, { raw: true, allow_filtering: true }, async function(error, all_conv){
			if(error) res.status(404).send({conversations, user, companies:[], msg: error });
			if(all_conv.length == 0) res.status(200).send({conversations, user, companies:[], msg: "No conversation found." });

			all_conv = _.orderBy(all_conv, ['last_msg_time'], ['desc']);
			var counter = 0;
			var allConvids = [];
			for(var i = 0; i<all_conv.length; i++){
				allConvids.push(all_conv[i].conversation_id.toString())
			}
			var all_unread_data = await all_unread_dataFun({my_all_conv:allConvids,user_id: req.params.id});
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
						if(ftitle == '[Deleted]') return;
					}
					
					var total_msg_unread = 0;

					if(all_unread_data.status){
						for(var m=0; m<all_unread_data.data.all_unread.length; m++){
							if(all_unread_data.data.all_unread[m].conversation_id.toString() == per_conv.conversation_id.toString())
								total_msg_unread++;
						}
					}
					
					conversations.push({
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
						'created_at': per_conv.created_at,
						'last_msg_time': per_conv.last_msg_time,
						'conv_img': per_conv.group == 'yes' ? per_conv.conv_img : single_user_img,
						'totalUnread': total_msg_unread,
						'conference_id': per_conv.conference_id
					});
					counter++;
				}
				// console.log(1568, start_at, counter, key)
			});

			// if no more conversation found
			if(conversations.length == 0) res.status(200).send({conversations, user, companies:[], msg: "No conversation found." });
			
			getAllpinUnpinList(req.params.id.toString()).then((response) => {
				_.each(conversations, function (val, k) {
					val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
					val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
				});

				getAllMuteList(req.params.id.toString()).then((mute_res)=>{
					_.each(conversations, function (mval, mk) {
						if (mute_res.allMuteActiveConv.indexOf(mval.conversation_id.toString()) > -1) {
						  mval['isMute'] = true;
						  mval['mute_id'] = mute_res.mute_id[mval.conversation_id.toString()];
						  mval['mute_duration'] = mute_res.mute_duration[mval.conversation_id.toString()];
						  mval['muteData'] = mute_res.muData[allMuteActiveConv.indexOf(mval.conversation_id.toString())];
						} else {
						  mval['isMute'] = false;
						  mval['mute_id'] = false;
						  mval['mute_duration'] = false;
						  mval['muteData'] = {};
						}
					});

					res.status(200).send({conversations, user, companies:[], msg: "success" });
				}).catch((me)=>{
					res.status(404).send({conversations,  user, companies:[], msg: me });	
				});
			}).catch((error)=>{
				res.status(404).send({conversations,  user, companies:[], msg: error });
			});
		});
	});
});
/**
 * Login with multiple company and Pagination home page data
 */
router.post('/login2', function(req, res, next) {
    var session_id = req.sessionID;
	if(! validate(true, 'email', 'Email', req.body.email).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'email', 'Email', req.body.email).error });
	}
	else if(! validate(true, 'text', 'Password', req.body.password).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'Password', req.body.password).error });
	}
	else if(! validate(true, 'text', 'Device ID', req.body.device_id).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'Device ID', req.body.device_id).error });
	}
	else if(! validate(true, 'text', 'GCM ID', req.body.gcm_id).status){
		res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'text', 'GCM ID', req.body.gcm_id).error });
	}
	else if(req.body.company_id !== undefined && ! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
			res.status(403).send({conversations: [],  user: {}, companies:[], token: "", msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error });
	}	
	else{
		try{
			var query = {email:req.body.email, is_delete:0};
			if(req.body.company_id !== undefined) query.company_id = models.timeuuidFromString(req.body.company_id);
			models.instance.Users.find(query, {raw:true, allow_filtering: true}, async function(error, oneUser){
				  if(oneUser.length == 1){
					var user = {};
					var remove_device_list = [];
					var update_values_object = {};
					var is_new_device = "0";
					if(passwordToCompare(req.body.password, oneUser[0].password)){
						if (oneUser[0].conference_id == null) {
							var newid = models.timeuuid().toString() + '_personal';
							update_values_object = { conference_id: newid };
						}else{
							var newid = oneUser[0].conference_id;
						}
						
						userCompany_id[oneUser[0].id] = oneUser[0].company_id.toString();

						var device = oneUser[0].device != null ? oneUser[0].device : [];
						if (device.indexOf(req.body.device_id) == -1) {
							is_new_device = "1";
							device.push(req.body.device_id);
							remove_device_list = device.join();
							update_values_object.device = device;
						}

						update_values_object.fcm_id = {'$add': ['ios@@@'+req.body.gcm_id]};
	
						// getRoomInfoUser(oneUser[0].id.toString(), async (error, iscall, roomname) => {
						// 	if (iscall == false) //await del_busyData(oneUser[0].id.toString());
						// });
						// let iscall = await getRoomInfoUser(oneUser[0].id.toString());
						// if (iscall == false) //await del_busyData(oneUser[0].id.toString());

						if(!isEmpty(update_values_object)) {
							models.instance.Users.update({ id: oneUser[0].id }, update_values_object, update_if_exists, function (err) {});
						}
						var payload = { id: oneUser[0].id, email: oneUser[0].email, company_id: oneUser[0].company_id, device_id: req.body.device_id };
            			var token = jwt.sign(payload, process.env.SECRET);
	
						res.redirect('/api/home2/' + oneUser[0].id + '/' + oneUser[0].company_id + '/' + token +'/' + is_new_device + '/0');
					}else{
						res.status(403).send({conversations: [], user: {}, companies:[], msg: "Password does not match" });
					}
				  }
				  else if(oneUser.length > 1){
					var companies = await signup_utils.get_company_by_user_email(req.body.email);
					res.status(200).send({companies, conversations: [], user: {}, msg: "Email address used in multiple company. So select company.", token: ""});
				  }
				  else{
					res.status(403).send({conversations: [], user: {}, companies:[], msg: "Email address is invalid" });
				  }
			});
		}
		catch(error){
			res.status(404).send({conversations: [], user: {}, companies:[], msg: error });
		}
	}
});
router.post('/homepage2', ensureToken, function(req, res, next){
	jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
		if (err) res.status(403).send({ conversations: [], user: {}, companies:[], msg: err });
		else if (decoded.id != req.body.id) res.status(403).send({ conversations: [], user: {}, companies:[], msg: "ID not match" });
		else{
			token_verify_by_device_id(decoded).then(() => {
				var start_at = 0;
				if(req.body.start_at !== undefined) 
					start_at = Number(req.body.start_at);
				
				res.redirect('/api/home2/' + models.uuidFromString(decoded.id) + '/' + models.timeuuidFromString(decoded.company_id) + '/' + req.token + '/0/' + start_at);    
			}).catch((e) => {
				res.status(403).send(e);
			});
		}
	});
});
router.get('/home2/:id/:company_id/:token/:new_device/:start_at', function(req, res, next){
	console.log(1509, req.params.start_at)
	models.instance.Users.find({company_id:models.timeuuidFromString(req.params.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
		if(err) {res.status(404).send({conversations: [], user: {}, companies:[], msg: err });}
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
				user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, device: v.device, caller_id: v.conference_id };
				userCompany_id[user.id] = user.company_id.toString();
			}
		});
		// Get all conversations
		var all_pin_conv_id = [];
		var conversations = [];
		var remove_device_list = req.params.new_device == "1" ? user.device : [];
		models.instance.Conversation.find({participants: { $contains: req.params.id.toString() }}, { raw: true, allow_filtering: true }, async function(error, all_conv){
			if(error) res.status(404).send({conversations, user, companies:[], msg: error });
			if(all_conv.length == 0) {
				res.status(200).send({conversations, user, token: req.params.token, remove_device_list: remove_device_list, companies:[], msg: "No conversation found." });
			}
			else{
				all_conv = _.orderBy(all_conv, ['last_msg_time'], ['desc']);
				var counter = 0;
				var allConvids = [];
				for(var i = 0; i<all_conv.length; i++){
					allConvids.push(all_conv[i].conversation_id.toString())
				}
				var all_unread_data = await all_unread_dataFun({my_all_conv:allConvids,user_id: req.params.id});
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
							if(ftitle == '[Deleted]') return;
						}
						
						var total_msg_unread = 0;

						if(all_unread_data.status){
							for(var m=0; m<all_unread_data.data.all_unread.length; m++){
								if(all_unread_data.data.all_unread[m].conversation_id.toString() == per_conv.conversation_id.toString())
									total_msg_unread++;
							}
						}

						conversations.push({
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
							'created_at': per_conv.created_at,
							'last_msg_time': per_conv.last_msg_time,
							'conv_img': per_conv.group == 'yes' ? per_conv.conv_img : single_user_img,
							'totalUnread': total_msg_unread,
							'conference_id': per_conv.conference_id
						});
						counter++;
					}
					// console.log(1568, start_at, counter, key)
				});

				// if no more conversation found
				if(conversations.length == 0) {
					res.status(200).send({conversations, user, token: req.params.token, remove_device_list: remove_device_list, companies:[], msg: "No conversation found." });
				}else{
					getAllpinUnpinList(req.params.id.toString()).then((response) => {
						_.each(conversations, function (val, k) {
							val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true : false);
							val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()] : '0');
						});
	
						getAllMuteList(req.params.id.toString()).then((mute_res)=>{
							_.each(conversations, function (mval, mk) {
								if(mute_res.allMuteActiveConv !== undefined && mute_res.allMuteActiveConv.length > 0){
									if (mute_res.allMuteActiveConv.indexOf(mval.conversation_id.toString()) > -1) {
										mval['isMute'] = true;
										mval['mute_id'] = mute_res.mute_id[mval.conversation_id.toString()];
										mval['mute_duration'] = mute_res.mute_duration[mval.conversation_id.toString()];
										mval['muteData'] = mute_res.muData[mute_res.allMuteActiveConv.indexOf(mval.conversation_id.toString())];
									} else {
										mval['isMute'] = false;
										mval['mute_id'] = "false";
										mval['mute_duration'] = "false";
										mval['muteData'] = {};
									}
								}
								else {
									mval['isMute'] = false;
									mval['mute_id'] = "false";
									mval['mute_duration'] = "false";
									mval['muteData'] = {};
								}
							});
	
							res.status(200).send({conversations, user, token: req.params.token, remove_device_list: remove_device_list, companies:[], msg: "success" });
						}).catch((me)=>{
							res.status(404).send({conversations,  user, companies:[], msg: me });	
						});
					}).catch((error)=>{
						res.status(404).send({conversations,  user, companies:[], msg: error });
					});
				}
			}
		});
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
						var update_values_object = {};
						var is_new_device = "0";
						req.body.device_id = decoded.device_id;
						if (getuser[0].conference_id == null) {
							var newid = models.timeuuid().toString() + '_personal';
							update_values_object = { conference_id: newid };
						}else{
							var newid = getuser[0].conference_id;
						}
						
						userCompany_id[getuser[0].id] = getuser[0].company_id.toString();

						var device = getuser[0].device != null ? getuser[0].device : [];
						if (device.indexOf(req.body.device_id) == -1) {
							is_new_device = "1";
							device.push(req.body.device_id);
							remove_device_list = device.join();
							update_values_object.device = device;
						}
	
						if(!isEmpty(update_values_object)) {
							models.instance.Users.update({ id: getuser[0].id }, update_values_object, update_if_exists, function (err) {});
						}
						var payload = { id: getuser[0].id, email: getuser[0].email, company_id: getuser[0].company_id, device_id: req.body.device_id };
            			var token = jwt.sign(payload, process.env.SECRET);
	
						res.redirect('/api/home2/' + getuser[0].id + '/' + getuser[0].company_id + '/' + token +'/' + is_new_device + '/0');
					}
					else{
						res.status(403).send({msg: "Something wrong..."});
					}
				});
			});
		}
	});
})
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
 * Open reply thread
 */
// Reply open_thread
router.post('/open_thread', function (req, res, next) {
	if(! validate(true, 'uuid', 'Message ID', req.body.msg_id).status){
		res.status(403).send({msg: validate(true, 'uuid', 'Message ID', req.body.msg_id).error });
	}
	else if(! validate(true, 'uuid', 'Conversation ID', req.body.conversation_id).status){
		res.status(403).send({msg: validate(true, 'uuid', 'Conversation ID', req.body.conversation_id).error });
	}
	else {
		replyId(req.body.msg_id, req.body.conversation_id, (result, err) => {
			if (result.status) {
				find_reply_list(req.body.msg_id, req.body.conversation_id, (result2) => {
					result2["thread_id"] = _.toString(result.result);
					res.json(result2);
				});
			} else {
				res.json(result);
			}
		});
	}
});
/**
 * May be not used
 */
router.post('/login_users', function(req, res, next) {
    var session_id = req.sessionID;
	if(! validate(true, 'email', 'Email', req.body.email).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'email', 'Email', req.body.email).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else if(! validate(true, 'text', 'Password', req.body.password).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'text', 'Password', req.body.password).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else{
		models.instance.Users.findOne({email:req.body.email, is_delete:0}, {raw:true, allow_filtering: true}, function(error, oneUser){
		  if(oneUser != null){
			models.instance.Users.find({company_id:models.timeuuidFromString(oneUser.company_id.toString())}, {raw:true, allow_filtering: true}, async function(err, users){
			  if(err) throw err;
			  //user is an array of plain objects with only name and age
			  var alluserlist = [];
			  var user = {};
			  var msg = '';
			  _.each(users, function(v,k){
				  alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
				  alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
				  
				  if(req.body.email == v.email){
					if(passwordToCompare(req.body.password, v.password)){
					  msg = "true";
					  if (v.conference_id == null) {
						var newid = models.timeuuid().toString() + '_personal';
						var update_values_object = { conference_id: newid };
						models.instance.Users.update({ id: models.uuidFromString(v.id) }, update_values_object, update_if_exists, function (err) {
						});
					  }else{
						var newid = v.conference_id;
					  }
					  user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: newid };
					  userCompany_id[user.id] = user.company_id.toString();
					}else{
					  msg = 'Password does not match';
					}
				  }
			  });
	  
			  if(msg == ""){
				res.status(404).send({ alluserlist: [], user: {}, msg: "Email address is invalid", session_id:req.sessionID });
			  }
			  else if(msg == "Password does not match"){
				res.status(404).send({ alluserlist: [], user: {}, msg: "Password does not match", session_id:req.sessionID });
			  }
			  else{
				// getRoomInfoUser(user.id.toString(), async (error, iscall, roomname) => {
				//   if (iscall == false) //await del_busyData(user.id.toString());
				// });
				// let iscall = await getRoomInfoUser(user.id.toString());
        // if (iscall == false) //await del_busyData(user.id.toString());
				// Get all conversations
				customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
					var allCusName = {};
					if(allNic.status){
					  _.each(allNic.result,function(nv,nk){
						allCusName[nv.change_id] = {nv};
					  })
					}

					var userName = {};
					var userImg = {};

					alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);
	  
					_.each(alluserlist, function(users,k){
						userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
						if(allCusName[users.id] != undefined){
						  userName[users.id] = allCusName[users.id]['nv'].change_title;
						}
						userImg[users.id] = users.img;
					});
					res.status(200).send({
						alluserlist: alluserlist,
						user: user,
						session_id:req.sessionID,
						msg: msg
					});
				});
			  }
		  	});
		  }else{
			res.status(404).send({ alluserlist: [], user: {}, msg: "Email address is invalid", session_id:req.sessionID });
		  }
		});
	}
});
/**
 * May be not used
 */
router.post('/login_mylists', function(req, res, next) {
	var session_id = req.sessionID;
	if(! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else if(! validate(true, 'uuid', 'ID', req.body.id).status){
		res.status(404).send({
            alluserlist: [],  conversations: [],  user: {}, msg: validate(true, 'uuid', 'ID', req.body.id).error, session_id:req.sessionID, tags: [], myUserList: [], androidCallList: [], my_room: [], joined_room: [], to_be_join: [] });
	}
	else{
		models.instance.Users.find({company_id:models.timeuuidFromString(req.body.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
		  if(err) throw err;
		  //user is an array of plain objects with only name and age
		  var alluserlist = [];
		  var user = '';
		  var msg = "true";
		  _.each(users, function(v,k){
			alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
			alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
			if(v.id.toString() == req.body.id){
			  user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id};
			  userCompany_id[req.body.id] =  v.company_id.toString();
			}
		  });

		  if(user == ''){
			res.send({status:false});
		  }

		  // Get all conversations
		  getAllConversation(req.body.id.toString(),(result)=>{
			customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
			  var allCusName = {};
			  if(allNic.status){
				_.each(allNic.result,function(nv,nk){
				  allCusName[nv.change_id] = {nv};
				})
			  }
			  if(result.status){
				var conversations = result.conversations;
				var myConversationList = [] // keep all conversatons in this array
				var conversationTitle = {};
				var conversationType = {};
				var conversationWith = {};
				var conversationImage = {};
				var conversationPrivacy = {};
				var conversationStatus = {};
				var conversationParticipants = {};
				var conversationParticipants_admin = {};
				var userName = {};
				var userImg = {};
				var myConversationID = "";
				var conversationisActive = {};

				alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

				// _.each(alluserlist, function(users,k){
				//   userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
				//   userImg[users.id] = users.img;
				// });
				_.each(alluserlist, function(users,k){
				  userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
				  if(allCusName[users.id] != undefined){
					userName[users.id] = allCusName[users.id]['nv'].change_title;
				  }
				  userImg[users.id] = users.img;
				});

				//Get conversation detail along with user table for further user list to android
				if(result.conversations.length > 0){
					_.each(result.conversations, function(conversations,k){
					  if(!isEmpty(conversations.title)){
						if(checkThisIdActiveOrNot(conversations.is_active,user.id.toString())){
						  if(myConversationList.indexOf(conversations.conversation_id.toString()) === -1){

							myConversationList.push(conversations.conversation_id.toString());
							  conversationTitle[conversations.conversation_id.toString()] = conversations.title;
							  conversationType[conversations.conversation_id.toString()] = conversations.single;
							  conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
							  conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
							  conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
							  conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
							  conversationStatus[conversations.conversation_id.toString()] = conversations.status;
							  conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;

							if(conversations.single == 'yes'){
							  if(conversations.participants.length == 1){
								myConversationID = conversations.conversation_id.toString();
							  }else{
								_.forEach(conversations.participants, function(pv, pk){
								  // console.log(491, pv);
								  if(pv !== null && pv.toString() !== user.id.toString()){
									conversationWith[conversations.conversation_id.toString()] = pv;
								  }
								});
							  }
							}
						  }
						}
					  }
					});

				  if(myConversationList.length > 0){
					getAllMsg(myConversationList,(result)=>{

					  if(result.status){

						var all_unread = [];
						var all_message = [];
						var counts = {};
						var last_conversation_id = [];
						var androidUserList = [];
						var androidCallList = [];

						// Push all messages
						_.forEach(result.data, function(amv, amk){
						  if(amv.length>0){

							_.each(amv, function (mv, mk) {

							  if (mv.has_hide != null){
								if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
								  if (mv.has_delete != null) {
									if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
									  // if ((mv.has_delete).indexOf('Sender delete it') > -1) {

									  // } else {
										all_message.push(mv);
									  // }
									}
								  } else {
									all_message.push(mv);
								  }
								}
							  }else{
								if (mv.has_delete != null) {
								  if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
									// if ((mv.has_delete).indexOf('Sender delete it') > -1) {

									// }else{
									  all_message.push(mv);
									// }
								  }
								}else{
								  all_message.push(mv);
								}
							  }
							});
						  }
						});

						// Get all unread message
						var all_message_orderBy = all_message;

						_.forEach(all_message_orderBy, function(amv, amk){
						  if(amv.msg_status == null && amv.sender.toString() != user.id.toString()){
							  all_unread.push(amv);
						  }
						});

						//Count unread message and push it to counts array
						all_unread.forEach(function(x) {
						  counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0)+1;
						});

						//Get All last Message
						_.forEach(all_message_orderBy, function(amv, amk){
						  if(last_conversation_id.indexOf(amv.conversation_id.toString()) === -1){
							last_conversation_id.push(amv.conversation_id.toString());
							// all_last_message.push(amv);
							if(amv.conversation_id.toString() !== myConversationID){
							  if(conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
							  if(amv.participants_admin != null){
								participants_admin = amv.participants_admin;
							  }
							  if(!isEmpty(amv.msg_body)){
								androidUserList.push({
								  'conversation_id':amv.conversation_id,
								  'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
								  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
								  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
								  'privacy': conversationPrivacy[amv.conversation_id.toString()],
								  'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
								  'participants' : conversationParticipants[amv.conversation_id.toString()],
								  'status' : conversationStatus[amv.conversation_id.toString()],
								  'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
								  'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
								  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
								  'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
								  'msg_id':amv.msg_id,
								  'msg_type':amv.msg_type,
								  'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
								  'sender_name':amv.sender_name,
								  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
								});
							  }

							  
							}

						  }
						});
						// console.log(930, androidUserList);

						getAllpinUnpinList(user.id.toString())
						  .then((response)=>{

							_.forEach(androidUserList, function (val, k) {
								val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true:false);
								val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()]:'0');
							});

							var query = {
							  mute_by: {$eq: models.uuidFromString(user.id.toString())}
							};

							models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv){
								if(error){
								  callback({status: false});
								}else{

								  var allMuteActiveConv = [];
								  var muData = [];
								  var mute_id = {};
								  var mute_duration = {};
								  _.forEach(all_conv, function(v, k){
									if(v.mute_status == "active"){
									  allMuteActiveConv.push(v.conversation_id.toString());
									  mute_id[v.conversation_id.toString()] = v.mute_id;
									  mute_duration[v.conversation_id.toString()] = v.mute_duration;
									  muData.push(v);
									}
								  });

								  _.forEach(androidUserList, function (val, k) {

									if(allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1){
									  val['isMute'] = true;
									  val['mute_id'] = mute_id[val.conversation_id.toString()];
									  val['mute_duration'] = mute_duration[val.conversation_id.toString()];
									  val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
									}else{
									  val['isMute'] = false;
									  val['mute_id'] = false;
									  val['mute_duration'] = false;
									  val['muteData'] = {};
									}
								  });
								  	  	res.status(200).send({
										  msg: msg,
										  myUserList: _.orderBy(androidUserList, ['created_at'],['desc']),
										  session_id:req.sessionID
										});

								
								};
							});

						  }).catch((err)=>{
							console.log(944, err);
						  });

					  }else{
						console.log(948, result);
					  }
					});
				  }
				}else{
				  res.status(200).send({
					msg: msg,
					myUserList:[],
					session_id:req.sessionID
				  });
				}
			  }else{
				console.log(963, result);
			  }
			});
		  });
		});
	}
});

/* POST and JWT login */
// router.post('/login2', function(req, res, next){
// 	if(! validate(true, 'email', 'Email', req.body.email).status){
// 		res.status(404).send({user: {}, msg: validate(true, 'email', 'Email', req.body.email).error, token: "", companies: [] });
// 	}
// 	else if(! validate(true, 'text', 'Password', req.body.password).status){
// 		res.status(404).send({user: {}, msg: validate(true, 'text', 'Password', req.body.password).error, token: "", companies: [] });
// 	}
// 	else{
// 		models.instance.Users.find({email:req.body.email, is_delete:0}, {raw:true, allow_filtering: true}, async function(error, oneUser){
// 		  	if(oneUser.length == 1){
// 				var user = {};
// 				var payload = {};
// 				var msg = '';
// 				if(passwordToCompare(req.body.password, oneUser[0].password)){
// 					msg = "true";
// 					if (oneUser[0].conference_id == null) {
// 						var newid = models.timeuuid().toString() + '_personal';
// 						var update_values_object = { conference_id: newid };
// 						models.instance.Users.update({ id: models.uuidFromString(oneUser[0].id) }, update_values_object, update_if_exists, function (err) {});
// 					}else{
// 						var newid = oneUser[0].conference_id;
// 					}
// 					user = {id: oneUser[0].id, dept: oneUser[0].dept, designation: oneUser[0].designation, email: oneUser[0].email, fullname: oneUser[0].fullname, img: oneUser[0].img, company_id: oneUser[0].company_id, caller_id: newid };
// 					payload = {id: oneUser[0].id, email: oneUser[0].email, company_id: oneUser[0].company_id};
// 					userCompany_id[user.id] = user.company_id.toString();

// 					getRoomInfoUser(user.id.toString(), (error, iscall, roomname) => {
// 						if (iscall == false) del_busyData(user.id.toString());
// 					});

// 					var token = jwt.sign(payload, 'this_is_our_freeli_key');
// 					// Get all conversations
// 					res.status(200).send({user, msg, token, companies: []});
// 				}else{
// 					res.status(404).send({user: {}, msg: "Password does not match", token: "", companies: [] });
// 				}
// 		  	}
// 		  	else if(oneUser.length > 1){
// 				var companies = await signup_utils.get_company_by_user_email(req.body.email);
// 				// req.session.temp_email = req.body.email;
// 				// req.session.temp_pass = req.body.password;
// 				res.status(200).send({companies, user: {}, msg: "Email address used in multiple company. So select company.", token: ""});
// 		  	}
// 		  	else{
// 				res.status(404).send({user: {}, msg: "Email address is invalid", token: "", companies: [] });
// 		  	}
// 		});
// 	}
// });

router.post('/login_with_company', function(req, res, next){
	if(! validate(true, 'email', 'Email', req.body.email).status){
		res.status(404).send({user: {}, msg: validate(true, 'email', 'Email', req.body.email).error, token: "", companies: [] });
	}
	else if(! validate(true, 'text', 'Password', req.body.password).status){
		res.status(404).send({user: {}, msg: validate(true, 'text', 'Password', req.body.password).error, token: "", companies: [] });
	}
	else if(! validate(true, 'uuid', 'Company Id', req.body.company_id).status){
		res.status(404).send({user: {}, msg: validate(true, 'uuid', 'Company Id', req.body.company_id).error, token: "", companies: [] });
	}
	else{
		models.instance.Users.findOne({email: req.body.email, company_id: models.timeuuidFromString(req.body.company_id), is_delete: 0}, {raw:true, allow_filtering: true}, function(err, getuser){
			if(err) res.status(404).send({user: {}, msg: err, token: "", companies: []});
			
			var user = {};
			var payload = {};
			var msg = "";
			if(getuser){
				if(passwordToCompare(req.body.password, getuser.password)){
					msg = "true";
					user = {id: getuser.id, dept: getuser.dept, designation: getuser.designation, email: getuser.email, fullname: getuser.fullname, img: getuser.img, company_id: getuser.company_id};
					payload = {id: getuser.id, email: getuser.email, company_id: getuser.company_id};
					userCompany_id[req.body.id] =  getuser.company_id.toString();
				}
				else{
					msg = "Invalid Password.";
				}
				
				if(msg == "true"){
					var token = jwt.sign(payload, 'this_is_our_freeli_key');
					res.status(200).send({user, msg, token, companies: []});
				}
				else
					res.status(404).send({user: {}, msg, token: "", companies: []});
			}
			else {
			  res.status(404).send({user: {}, msg: 'Invalid company information.', token: "", companies: [] });
			}
		});
	}
});

router.get('/conversations', ensureToken, function(req, res, next){
	jwt.verify(req.token, 'this_is_our_freeli_key', (err, decoded)=>{
		if(err) res.sendStatus(403);
		else{
			models.instance.Users.find({company_id:models.timeuuidFromString(decoded.company_id.toString())}, {raw:true, allow_filtering: true}, function(user_err, users){
				if(user_err) res.sendStatus(404);

				var alluserlist = [];
				_.each(users, function(v,k){
					alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
					alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
				});
				// console.log(1815, alluserlist);
				// Get all conversations
				getAllConversation(decoded.id.toString(),(result)=>{
					customTitle({user_id:decoded.id.toString(),type:'get'},(allNic)=>{
					var allCusName = {};
					if(allNic.status){
						_.each(allNic.result,function(nv,nk){
						allCusName[nv.change_id] = {nv};
						})
					}
					if(result.status){
						var conversations = result.conversations;
						var myConversationList = [] // keep all conversatons in this array
						var conversationTitle = {};
						var conversationType = {};
						var conversationWith = {};
						var conversationImage = {};
						var conversationPrivacy = {};
						var conversationStatus = {};
						var conversationParticipants = {};
						var conversationParticipants_admin = {};
						var userName = {};
						var userImg = {};
						var myConversationID = "";
						var conversationisActive = {};
						// console.log(1854, alluserlist.length);
						// alluserlist = _.filter(alluserlist, ['company_id', decoded.company_id]);
		
						// _.each(alluserlist, function(users,k){
						//   userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
						//   userImg[users.id] = users.img;
						// });
						_.each(alluserlist, function(users,k){
							userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
							if(allCusName[users.id] != undefined){
								userName[users.id] = allCusName[users.id]['nv'].change_title;
							}
							userImg[users.id] = users.img;
						});
						// console.log(1854, alluserlist.length);
						//Get conversation detail along with user table for further user list to android
						if(result.conversations.length > 0){
							_.each(result.conversations, function(conversations,k){
							if(!isEmpty(conversations.title)){
								if(checkThisIdActiveOrNot(conversations.is_active,decoded.id.toString())){
								if(myConversationList.indexOf(conversations.conversation_id.toString()) === -1){
		
									myConversationList.push(conversations.conversation_id.toString());
									conversationTitle[conversations.conversation_id.toString()] = conversations.title;
									conversationType[conversations.conversation_id.toString()] = conversations.single;
									conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
									conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
									conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
									conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
									conversationStatus[conversations.conversation_id.toString()] = conversations.status;
									conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;
		
									if(conversations.single == 'yes'){
									if(conversations.participants.length == 1){
										myConversationID = conversations.conversation_id.toString();
									}else{
										_.forEach(conversations.participants, function(pv, pk){
										// console.log(491, pv);
										if(pv !== null && pv.toString() !== decoded.id.toString()){
											conversationWith[conversations.conversation_id.toString()] = pv;
										}
										});
									}
									}
								}
								}
							}
							});
		
							if(myConversationList.length > 0){
								getAllMsg(myConversationList,(result)=>{
			
								if(result.status){
			
									var all_unread = [];
									var all_message = [];
									var counts = {};
									var last_conversation_id = [];
									var androidUserList = [];
									var androidCallList = [];
			
									// Push all messages
									_.forEach(result.data, function(amv, amk){
									if(amv.length>0){
			
										_.each(amv, function (mv, mk) {
			
										if (mv.has_hide != null){
											if ((mv.has_hide).indexOf(decoded.id.toString()) === -1) {
											if (mv.has_delete != null) {
												if ((mv.has_delete).indexOf(decoded.id.toString()) == -1) {
												// if ((mv.has_delete).indexOf('Sender delete it') > -1) {
			
												// } else {
													all_message.push(mv);
												// }
												}
											} else {
												all_message.push(mv);
											}
											}
										}else{
											if (mv.has_delete != null) {
											if ((mv.has_delete).indexOf(decoded.id.toString()) == -1) {
												// if ((mv.has_delete).indexOf('Sender delete it') > -1) {
			
												// }else{
												all_message.push(mv);
												// }
											}
											}else{
											all_message.push(mv);
											}
										}
										});
									}
									});
			
									// Get all unread message
									var all_message_orderBy = all_message;
			
									_.forEach(all_message_orderBy, function(amv, amk){
									if(amv.msg_status == null && amv.sender.toString() != decoded.id.toString()){
										all_unread.push(amv);
									}
									});
			
									//Count unread message and push it to counts array
									all_unread.forEach(function(x) {
									counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0)+1;
									});
			
									//Get All last Message
									_.forEach(all_message_orderBy, function(amv, amk){
										if(last_conversation_id.indexOf(amv.conversation_id.toString()) === -1){
											last_conversation_id.push(amv.conversation_id.toString());
											// all_last_message.push(amv);
											if(amv.conversation_id.toString() !== myConversationID){
												// if(conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
												if(amv.participants_admin != null){
													participants_admin = amv.participants_admin;
												}
												if(!isEmpty(amv.msg_body)){
													androidUserList.push({
													'conversation_id':amv.conversation_id,
													'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
													'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
													'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
													'privacy': conversationPrivacy[amv.conversation_id.toString()],
													'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
													'participants' : conversationParticipants[amv.conversation_id.toString()],
													'status' : conversationStatus[amv.conversation_id.toString()],
													'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
													'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
													'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
													'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
													'msg_id':amv.msg_id,
													'msg_type':amv.msg_type,
													'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
													'sender_name':amv.sender_name,
													'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
													});
												}
											}
										}
									});
									// console.log(930, androidUserList);
									// console.log(1987, alluserlist.length);
									getAllpinUnpinList(decoded.id.toString())
									.then((response)=>{
			
										_.forEach(androidUserList, function (val, k) {
											val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true:false);
											val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()]:'0');
										});
			
										var query = {
											mute_by: {$eq: models.uuidFromString(decoded.id.toString())}
										};
			
										models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv){
											if(error){
												callback({status: false});
											}
											else{
			
												var allMuteActiveConv = [];
												var muData = [];
												var mute_id = {};
												var mute_duration = {};
												_.forEach(all_conv, function(v, k){
													if(v.mute_status == "active"){
													allMuteActiveConv.push(v.conversation_id.toString());
													mute_id[v.conversation_id.toString()] = v.mute_id;
													mute_duration[v.conversation_id.toString()] = v.mute_duration;
													muData.push(v);
													}
												});
				
												_.forEach(androidUserList, function (val, k) {
				
													if(allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1){
													val['isMute'] = true;
													val['mute_id'] = mute_id[val.conversation_id.toString()];
													val['mute_duration'] = mute_duration[val.conversation_id.toString()];
													val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
													}else{
													val['isMute'] = false;
													val['mute_id'] = false;
													val['mute_duration'] = false;
													val['muteData'] = {};
													}
												});
												// console.log(2033, alluserlist.length);
												res.status(200).send({
													alluserlist: alluserlist,
													myUserList: _.orderBy(androidUserList, ['created_at'],['desc']),
													session_id:req.sessionID
												});
											}
										});
			
									}).catch((err)=>{
										console.log(944, err);
									});
			
								}else{
									console.log(948, result);
								}
								});
							}
						}else{
							res.status(200).send({ myUserList:[], alluserlist, session_id:req.sessionID });
						}
					}else{
						res.status(404).send({ myUserList:[], alluserlist:[], session_id:result });
					}
					});
				});
			});
		}
	});
});

router.post('/login_mylists2', function(req, res, next) {
    var session_id = req.sessionID;
	if(! validate(true, 'email', 'Email', req.body.email).status){
		res.status(404).send({
            user: {}, msg: validate(true, 'email', 'Email', req.body.email).error, session_id:req.sessionID, myUserList: [] });
	}
	else if(! validate(true, 'text', 'Password', req.body.password).status){
		res.status(404).send({
            user: {}, msg: validate(true, 'text', 'Password', req.body.password).error, session_id:req.sessionID, myUserList: [] });
	}
	else{
		models.instance.Users.findOne({email:req.body.email, is_delete:0}, {raw:true, allow_filtering: true}, function(error, oneUser){
		  if(oneUser != null){
			models.instance.Users.find({company_id:models.timeuuidFromString(oneUser.company_id.toString())}, {raw:true, allow_filtering: true}, async function(err, users){
			  if(err) throw err;
			  //user is an array of plain objects with only name and age
			  var alluserlist = [];
			  var user = {};
			  var msg = '';
			  _.each(users, function(v,k){
				  alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
				  alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
				  
				  if(req.body.email == v.email){
					if(passwordToCompare(req.body.password, v.password)){
					  msg = "true";
					  if (v.conference_id == null) {
						var newid = models.timeuuid().toString() + '_personal';
						var update_values_object = { conference_id: newid };
						models.instance.Users.update({ id: models.uuidFromString(v.id) }, update_values_object, update_if_exists, function (err) {
						});
					  }else{
						var newid = v.conference_id;
					  }
					  user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id, caller_id: newid };
					  userCompany_id[user.id] = user.company_id.toString();
					}else{
					  msg = 'Password does not match';
					}
				  }
			  });
	  
			  if(msg == ""){
				res.status(404).send({ user: {}, msg: "Email address is invalid", session_id:req.sessionID, myUserList: [] });
			  }
			  else if(msg == "Password does not match"){
				res.status(404).send({ user: {}, msg: "Password does not match", session_id:req.sessionID, myUserList: [] });
			  }
			  else{
				// getRoomInfoUser(user.id.toString(), async (error, iscall, roomname) => {
				//   if (iscall == false) //await del_busyData(user.id.toString());
				// });
				// let iscall = await getRoomInfoUser(user.id.toString());
        // if (iscall == false) //await del_busyData(user.id.toString());
				// Get all conversations
				getAllConversation(user.id.toString(),(result)=>{
					customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
					  var allCusName = {};
					  if(allNic.status){
						_.each(allNic.result,function(nv,nk){
						  allCusName[nv.change_id] = {nv};
						})
					  }
					  if(result.status){
						var conversations = result.conversations;
						var myConversationList = [] // keep all conversatons in this array
						var conversationTitle = {};
						var conversationType = {};
						var conversationWith = {};
						var conversationImage = {};
						var conversationPrivacy = {};
						var conversationStatus = {};
						var conversationParticipants = {};
						var conversationParticipants_admin = {};
						var userName = {};
						var userImg = {};
						var myConversationID = "";
						var conversationisActive = {};
		
						alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);
		
						// _.each(alluserlist, function(users,k){
						//   userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
						//   userImg[users.id] = users.img;
						// });
						_.each(alluserlist, function(users,k){
						  userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
						  if(allCusName[users.id] != undefined){
							userName[users.id] = allCusName[users.id]['nv'].change_title;
						  }
						  userImg[users.id] = users.img;
						});
		
						//Get conversation detail along with user table for further user list to android
						if(result.conversations.length > 0){
							_.each(result.conversations, function(conversations,k){
							  if(!isEmpty(conversations.title)){
								if(checkThisIdActiveOrNot(conversations.is_active,user.id.toString())){
								  if(myConversationList.indexOf(conversations.conversation_id.toString()) === -1){
		
									myConversationList.push(conversations.conversation_id.toString());
									  conversationTitle[conversations.conversation_id.toString()] = conversations.title;
									  conversationType[conversations.conversation_id.toString()] = conversations.single;
									  conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
									  conversationPrivacy[conversations.conversation_id.toString()] = conversations.privacy;
									  conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;
									  conversationParticipants_admin[conversations.conversation_id.toString()] = conversations.participants_admin;
									  conversationStatus[conversations.conversation_id.toString()] = conversations.status;
									  conversationisActive[conversations.conversation_id.toString()] = conversations.is_active;
		
									if(conversations.single == 'yes'){
									  if(conversations.participants.length == 1){
										myConversationID = conversations.conversation_id.toString();
									  }else{
										_.forEach(conversations.participants, function(pv, pk){
										  // console.log(491, pv);
										  if(pv !== null && pv.toString() !== user.id.toString()){
											conversationWith[conversations.conversation_id.toString()] = pv;
										  }
										});
									  }
									}
								  }
								}
							  }
							});
		
						  if(myConversationList.length > 0){
							getAllMsg(myConversationList,(result)=>{
		
							  if(result.status){
		
								var all_unread = [];
								var all_message = [];
								var counts = {};
								var last_conversation_id = [];
								var androidUserList = [];
								var androidCallList = [];
		
								// Push all messages
								_.forEach(result.data, function(amv, amk){
								  if(amv.length>0){
		
									_.each(amv, function (mv, mk) {
		
									  if (mv.has_hide != null){
										if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
										  if (mv.has_delete != null) {
											if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
											  // if ((mv.has_delete).indexOf('Sender delete it') > -1) {
		
											  // } else {
												all_message.push(mv);
											  // }
											}
										  } else {
											all_message.push(mv);
										  }
										}
									  }else{
										if (mv.has_delete != null) {
										  if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
											// if ((mv.has_delete).indexOf('Sender delete it') > -1) {
		
											// }else{
											  all_message.push(mv);
											// }
										  }
										}else{
										  all_message.push(mv);
										}
									  }
									});
								  }
								});
		
								// Get all unread message
								var all_message_orderBy = all_message;
		
								_.forEach(all_message_orderBy, function(amv, amk){
								  if(amv.msg_status == null && amv.sender.toString() != user.id.toString()){
									  all_unread.push(amv);
								  }
								});
		
								//Count unread message and push it to counts array
								all_unread.forEach(function(x) {
								  counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0)+1;
								});
		
								//Get All last Message
								_.forEach(all_message_orderBy, function(amv, amk){
								  if(last_conversation_id.indexOf(amv.conversation_id.toString()) === -1){
									last_conversation_id.push(amv.conversation_id.toString());
									// all_last_message.push(amv);
									if(amv.conversation_id.toString() !== myConversationID){
									  if(conversationType[amv.conversation_id.toString()] == 'yes' && userName[conversationWith[amv.conversation_id.toString()]].indexOf('[Deleted]') > -1) return;
									  if(amv.participants_admin != null){
										participants_admin = amv.participants_admin;
									  }
									  if(!isEmpty(amv.msg_body)){
										androidUserList.push({
										  'conversation_id':amv.conversation_id,
										  'conversation_type':(conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal': 'Group'),
										  'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()]: 'Group'),
										  'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
										  'privacy': conversationPrivacy[amv.conversation_id.toString()],
										  'msg_body':(amv.msg_body == null ? 'null':amv.msg_body),
										  'participants' : conversationParticipants[amv.conversation_id.toString()],
										  'status' : conversationStatus[amv.conversation_id.toString()],
										  'is_active' : (conversationisActive[amv.conversation_id.toString()] != null ? conversationisActive[amv.conversation_id.toString()]:[] ),
										  'participants_admin' : (conversationParticipants_admin[amv.conversation_id.toString()] != null ? conversationParticipants_admin[amv.conversation_id.toString()]:[] ),
										  'participants_name': idToNameArr(conversationParticipants[amv.conversation_id.toString()]),
										  'created_at': (amv.forward_by === null) ? amv.created_at : amv.forward_at,
										  'msg_id':amv.msg_id,
										  'msg_type':amv.msg_type,
										  'sender_img':(conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]]: conversationImage[amv.conversation_id.toString()]),
										  'sender_name':amv.sender_name,
										  'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
										});
									  }
		
									  
									}
		
								  }
								});
								// console.log(930, androidUserList);
		
								getAllpinUnpinList(user.id.toString())
								  .then((response)=>{
		
									_.forEach(androidUserList, function (val, k) {
										val['pinned'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? true:false);
										val['pin'] = (response.convid_array.indexOf(val.conversation_id.toString()) > -1 ? response.pinid_array[val.conversation_id.toString()]:'0');
									});
		
									var query = {
									  mute_by: {$eq: models.uuidFromString(user.id.toString())}
									};
		
									models.instance.ConversationMute.find(query, { raw: true, allow_filtering: true }, function(error, all_conv){
										if(error){
										  callback({status: false});
										}else{
		
										  var allMuteActiveConv = [];
										  var muData = [];
										  var mute_id = {};
										  var mute_duration = {};
										  _.forEach(all_conv, function(v, k){
											if(v.mute_status == "active"){
											  allMuteActiveConv.push(v.conversation_id.toString());
											  mute_id[v.conversation_id.toString()] = v.mute_id;
											  mute_duration[v.conversation_id.toString()] = v.mute_duration;
											  muData.push(v);
											}
										  });
		
										  _.forEach(androidUserList, function (val, k) {
		
											if(allMuteActiveConv.indexOf(val.conversation_id.toString()) > -1){
											  val['isMute'] = true;
											  val['mute_id'] = mute_id[val.conversation_id.toString()];
											  val['mute_duration'] = mute_duration[val.conversation_id.toString()];
											  val['muteData'] = muData[allMuteActiveConv.indexOf(val.conversation_id.toString())];
											}else{
											  val['isMute'] = false;
											  val['mute_id'] = false;
											  val['mute_duration'] = false;
											  val['muteData'] = {};
											}
										  });
											res.status(200).send({
												msg: msg,
												user: user,
												myUserList: _.orderBy(androidUserList, ['created_at'],['desc']),
												session_id:req.sessionID
											});
		
										
										};
									});
		
								  }).catch((err)=>{
									console.log(944, err);
								  });
		
							  }else{
								console.log(948, result);
							  }
							});
						  }
						}else{
						  res.status(200).send({
							msg: msg,
							user: user,
							myUserList:[],
							session_id:req.sessionID
						  });
						}
					  }else{
						console.log(963, result);
					  }
					});
				});
			  }
		  	});
		  }else{
			res.status(404).send({ user: {}, myUserList: [], msg: "Email address is invalid", session_id:req.sessionID });
		  }
		});
	}
});

router.post('/login_users2', function(req, res, next) {
	var session_id = req.sessionID;
	if(! validate(true, 'uuid', 'Company ID', req.body.company_id).status){
		res.status(404).send({
            alluserlist: [], msg: validate(true, 'uuid', 'Company ID', req.body.company_id).error, session_id:req.sessionID });
	}
	else if(! validate(true, 'uuid', 'ID', req.body.id).status){
		res.status(404).send({
            alluserlist: [], msg: validate(true, 'uuid', 'ID', req.body.id).error, session_id:req.sessionID });
	}
	else{
		models.instance.Users.find({company_id:models.timeuuidFromString(req.body.company_id.toString())}, {raw:true, allow_filtering: true}, function(err, users){
		  if(err) throw err;
		  //user is an array of plain objects with only name and age
		  var alluserlist = [];
		  var user = '';
		  var msg = "true";
		  _.each(users, function(v,k){
			alluserlist.push({id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, is_delete: v.is_delete.toString(), company_id: v.company_id});
			alluserOnLoad[v.id] = (v.is_delete == 0) ? v.fullname : v.fullname + '[Deleted]';
			if(v.id.toString() == req.body.id){
			  user = {id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id};
			  userCompany_id[req.body.id] =  v.company_id.toString();
			}
		  });

		  if(user == ''){
			res.send({status:false});
		  }

		  	// Get all conversations
			customTitle({user_id:user.id.toString(),type:'get'},(allNic)=>{
			  var allCusName = {};
			  if(allNic.status){
				_.each(allNic.result,function(nv,nk){
				  allCusName[nv.change_id] = {nv};
				})
			  }

			  var userName = {};
			  var userImg = {};

			  alluserlist = _.filter(alluserlist, ['company_id', user.company_id]);

			  _.each(alluserlist, function(users,k){
				  userName[users.id] = (users.is_delete == 0) ? users.fullname : users.fullname + '[Deleted]';
				  if(allCusName[users.id] != undefined){
					userName[users.id] = allCusName[users.id]['nv'].change_title;
				  }
				  userImg[users.id] = users.img;
			  });
			  res.status(200).send({
				  alluserlist: alluserlist,
				  session_id:req.sessionID,
				  msg: msg
			  });
		  	});
		});
	}
});


module.exports = router;