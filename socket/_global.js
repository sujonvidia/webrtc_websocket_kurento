var app = require('express');
var router = app.Router();
var _ = require('lodash');

var { hayvenjs } = require('./../utils/hayvenjs');
var {settings} = require('./../utils/settings');

module.exports = function(io) {
    
    io.on('connection', function(socket){
        socket.on('join_into_room', function(data, callback){
            socket.join(data.conversation_ids, (e)=>{
                callback(e);
            });
            // it require for reply message room
            for(var i=0; i<data.conversation_ids.length; i++){
                hayvenjs.convid_to_repids(data.conversation_ids[i], (rep_ans)=>{
                    if(rep_ans.status) socket.join(rep_ans.rep_ids);
                    else console.log('globaljs 18 ', rep_ans);
                });
            }
            callback({status: true});
        });
        socket.on('has_login', function(callback){
            if(socket.handshake.session.login === true)
                callback(true);
            else
                callback(false);
        });

        // also use in android team
        socket.on('change_password', function(data, callback){
            settings.change_password(data, (res)=>{
                if(res.status) {
                    socket.handshake.session.cpa = false;
                    socket.handshake.session.save();
                }
                callback(res);
            });
        });

        socket.on('change_reset_password', function(data, callback){
            settings.change_reset_password(data, (res)=>{
                callback(res);
            });
        });
        
        socket.on('reset_password', function(data, callback){
            settings.reset_password(data, (res)=>{
                callback(res);
            });
        });
        
        // this socket use in both side. web and android
        socket.on('get_bucket_info', function(data, callback){
            hayvenjs.get_bucket_info(data, (res)=>{
                callback(res);
            });
        });

        socket.on('get_all_team', function(data, callback){
            var uid = data.user_id;
            settings.get_allteam(uid, true, (rep)=>{
                callback(rep);
            });
        });

        socket.on('update_team_name', function(data, callback){
            settings.update_team_name(data, (rep)=>{
                callback(rep);
            });
        });
        
        socket.on('delete_team', function(data, callback){
            settings.delete_team(data, (rep)=>{
                callback(rep);
            });
        });

        socket.on('change_access', function(data, callback){
            hayvenjs.update_permission(data, (res) =>{
                callback(res);
            });
        });
        
        socket.on('update_role', function(data, callback){
            hayvenjs.update_role(data, (res) =>{
                callback(res);
            });
        });

        socket.on('update_user_role_from_um', function(data, callback){
            hayvenjs.update_user_role_from_um(data, (res) =>{
                callback(res);
            });
        });
        
        socket.on('create_new_user', function(data, callback){
            hayvenjs.add_user(data, (res) =>{
                callback(res);
            });
        });

        socket.on('update_files_data', function(data, callback){
            hayvenjs.update_files_data(data, (res)=>{
                callback(res);
            });
        });

        socket.on('find_all_files', function(data,callback){
            hayvenjs.all_files(data,function(result){
                var msg_links = [];
                if(result.msg_links != null){
                    if(result.msg_links.length > 0){
                        _.forEach(result.msg_links, function(v, k){
                            if(v.url && v.url.indexOf('//localhost') == -1){
                                msg_links.push(v);
                            }
                        });
                        result.msg_links = msg_links;
                    }
                }
                callback(result);
            });
        });
        
        socket.on('find_allfiles_by_user_id', function(data,callback){
            hayvenjs.all_files_uid(data,function(result){
                callback(result);
            });
        });
        
        socket.on('files_delete', function(data,conv_id,callback){
            hayvenjs.files_delete(data,conv_id,function(result){
                callback(result);
            });
        });
        
        socket.on('delete_obj', function(data,conversation_id){
            hayvenjs.delete_obj(data,conversation_id,function(result){
                console.log(105, result);
            });
        });
        
        socket.on('conv_files_added', function(data){
            socket.broadcast.emit('conv_files_added', data);
        });
        
        socket.on('conv_files_deleted', function(data){
            socket.broadcast.emit('conv_files_deleted', data);
        });

        socket.on('restore', function(data, callback){
            hayvenjs.restore(data,function(result){
                callback(result);
            });
        });

        socket.on('delete_attach', function (data, callback) {
            console.log(125, data);
            hayvenjs.getAllFiles({msgid: data.msgid, attach_files: data.attach_files, need_id: true}, (rep)=>{
                console.log(127, rep[0]);
                if(rep.length > 0){
                    var msgids = [];
                    var conv_id = '';
                    var location = "";
                    var locations = [];
                    _.each(rep, function(v, k){
                        msgids.push(v.id.toString());
                        location = v.location;
                        locations.push(v.location);
                        console.log(159,v)
                        conv_id = v.root_conv_id == null ? v.conversation_id.toString():v.root_conv_id.toString();
                    });
                    hayvenjs.files_delete(msgids,conv_id,locations,data.msgid, function(res){
                        console.log(163,{msgid: data.msgid, location: location, type: data.type});
                        io.emit("attachment_delete", {msgid: data.msgid, location: location, type: data.type});
                        callback({status: true, data: res});
                    });
                }
                else 
                    callback({status: false, data: "No data found"});
            });
        });

        socket.on('conv_read_notification', function(data){
            io.to(data.user_id).emit('receive_read_notification', data);
        });
    });

    return router;
}
