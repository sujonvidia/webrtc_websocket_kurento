var _ = require('lodash');

module.exports = function (io) {
  var app = require('express');
  var router = app.Router();
  var { sendNewMsg, send_notification_msg } = require('./../utils/message');
  var {
    createGroup,
    saveConvD
  } = require('./../utils/conversation');
 
  var { mobile_view } = require('./../utils/mobile_view');

  io.on('connection', function (socket) {
    
    socket.on('mob_groupCreateBrdcst', function (message, callback) {
        var str = message.memberList;
        var strUUID = message.memberListUUID;
        var adminList = message.adminList;
        var adminListUUID = message.adminListUUID;
        var memberlist = str.concat(adminList);
        var joinMenber = memberlist.join(',');
        if(adminListUUID == undefined){
            adminListUUID = [];
            adminListUUID.push(socket.handshake.session.userdata.from);
        }else{
          if(adminListUUID.indexOf(socket.handshake.session.userdata.from) == -1){
              adminListUUID.push(socket.handshake.session.userdata.from);
          }
        }
        if(memberlistUUID == undefined){
            memberlistUUID = [];
            memberlistUUID.push(socket.handshake.session.userdata.from);
        }else{
          if(memberlistUUID.indexOf(socket.handshake.session.userdata.from) == -1){
              memberlistUUID.push(socket.handshake.session.userdata.from);
          }
        }
        var memberlistUUID = strUUID.concat(adminListUUID);
        if (message.teamname !== "") {
          mobile_view.createGroup(adminListUUID, memberlistUUID, message.teamname, message.createdby, message.selectecosystem, message.grpprivacy, message.conv_img,message.topic_type,message.b_unit_id,message.b_unit_name,message.tag_list,message.company_id, (result, err) => {
            if (err) {
              console.log(err);
            } else {
              if (result.status) {
                var data = {
                  type:'welcome',
                  sender:message.createdby,
                  sender_name:message.createdby_name,
                  sender_img:message.conv_img,
                  conversation_id:result.conversation_id.toString(),
                  msg_type:'notification',
                  msg_body:'Welcome to "'+message.teamname+'" room.'
                }
                send_notification_msg(data,function(res){
                  if(res.status){
                    socket.broadcast.emit('newMessage', {status:true,msg:res.data});
                    socket.emit('newMessage', {status:true,msg:res.data});
                    socket.broadcast.emit('groupCreate', {
                      room_id: result.conversation_id.toString(),
                      memberList: strUUID,
                      adminList: adminListUUID,
                      selectecosystem: message.selectecosystem,
                      teamname: message.teamname,
                      grpprivacy: message.grpprivacy,
                      conv_img: message.conv_img,
                      createdby: message.createdby_name,
                      createdbyid: message.createdby,
                      msg_id: res.data.msg_id,
                      sender_img: message.conv_img,
                      sender_name: message.teamname,
                      memberList_name: str
                    });
                    callback(result); 
                  }
                });
              } else {
                callback(result);
              }
            }
          });
        }
    });

    
    // mob_req
    socket.on('mob_groupMemberDelete', function (message) {
        socket.broadcast.emit('removefromGroup', message);
    });

    // mob_req
    socket.on('mob_saveConvTag', function (message, callback) {
        saveConvD(message.msgIdsFtag, message.tagtile, message.tagid, message.conversation_id, message.messgids, message.uid, (cresult, cerr) => {
          if (cerr) {
            throw cerr;
          } else {
            callback(cresult);
          }
        });
    });


    /////////////////////// Get Business Unit By User //////////////
    // mob_confuse
    // socket.on('getBUnit',function(data,callback){
    //   getAllbunit(data,function(res){
    //     if(res.status){
    //       callback(res);
    //     }else{
    //       callback(res);
    //     }
    //   });
    // })


    socket.on('check_pin_conv', (data, callback)=>{
        mobile_view.check_pin(data, (rep)=>{
          callback(rep);
        });
    });

    socket.on("tag_active_in_other_conv", (data, callback)=>{
        mobile_view.has_tag_active_in_other_conv(data, (rep)=>{
          callback(rep);
        });
    });
    
    socket.on("delete_this_tag_from_this_msg", (data, callback)=>{
        mobile_view.delete_this_msg_tag(data, (rep)=>{
          callback(rep);
        });
    });

    socket.on("get_all_member_ina_room", (data, callback) =>{
      // console.log(135, data);
        mobile_view.get_all_member_ina_room(data, (rep)=>{
            callback(rep);
        });
    });

  });
  return router;
}
