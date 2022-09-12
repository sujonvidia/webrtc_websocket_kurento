var fs = require('fs');
var path = require('path');
ccc = 0;
calling_user_conv = {};
var url = require('url');
let wsUrl1 = url.parse(process.env.ws_uri1).href;
let wsUrl2 = url.parse(process.env.ws_uri2).href;
var dev_mode = 'server';
var childProcess = require('child_process');
var validator = require('validator');
var spawn = childProcess.spawn;
var _ = require('lodash');
var FCM = require('fcm-node');
var fcm = new FCM('AAAAwSuL-Gg:APA91bGQeZg_iF_nu7zWvGq4XfkPKRas5H8T8BVKL3Ve8o5HqKHQh2vMcWZYL4W5kl1fUPqd8osSP4EXNA59Y2QstNSd1S0MoptoXRCusSia1-ql62fapg8NT7tRlAuxBHRnEqeNxE4c');

var minimst = require('minimist');
var kurento = require('kurento-client');
const { promisify } = require('util');
// ========== push notification ========================
const webpush = require('web-push'); //requiring the web-push module
const publicVapidKey = "BBzhmsKELXSrRNtP4AS6KBFx9lFFDCTFQdk_nt98cR-gzMuUAtxkvjaFImaapYM2aC9_582qinO_z50tFpnKe6c";
const privateVapidKey = "d21XgIB_3Wekit3ICloz7HO4yUdRwWkPGZqE5-rRAuM";
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);
async function send_msg_firebase(user_id, data, fcm_type, calling_data = false) {
    if (user_id && data) {
        let call_data = calling_data ? calling_data : await get_callingData(user_id);
        if (call_data && call_data.kurento_status != 'leave' && (await get_busyData(user_id)).status) {

        } else {
            models.instance.Users.findOne({ id: models.uuidFromString(user_id) }, { raw: true, allow_filtering: true }, function(err, user) {
                if (err) {} else {
                    if (user && user.fcm_id) {
                        let data2send = {};
                        var options = {
                            priority: "high",
                            timeToLive: 60,
                            mutableContent: true,
                            // contentAvailable: true
                        }
                        for (let ky in data) {
                            if (data[ky] != null) {
                                if (_.isString(data[ky])) {
                                    data2send[ky] = data[ky];
                                } else {
                                    data2send[ky] = JSON.stringify(data[ky]);
                                }
                            }
                        }
                        data2send['fcm_type'] = fcm_type;

                        let message = {
                            // notification: {
                            //   title: 'test',
                            //   body: 'body'
                            // },
                            data: data2send
                        };
                        // message["category"] = "VIEWORCANCEL";

                        firebase_admin.messaging().sendToDevice(user.fcm_id.includes('@@@') ? user.fcm_id.split('@@@')[1] : user.fcm_id, message, options)
                            .then(function(response) {
                                console.log("========> Firebase:Ok:", user_id, message.data.fcm_type, response);
                            })
                            .catch(function(error) {
                                console.trace("========> Firebase:Error:", user_id + message + error);
                            });
                        // }
                    }
                }
            });
        }
    }
}

function scanAsync(cursor, pattern, returnSet) {
    return redis_client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100").then(
        function(reply) {

            cursor = reply[0];
            var keys = reply[1];
            keys.forEach(function(key, i) {
                returnSet.add(key);
            });

            if (cursor === '0') {
                return Array.from(returnSet);
            } else {
                return scanAsync(cursor, pattern, returnSet)
            }

        });
}

function get_new_id() {
    return models.uuid().toString();
}

function Session(io, socket, room, message) {
    this.id = socket.id; // ??
    this.socket = socket.id; // ??
    this.name = message.name;
    this.user_id = message.user_id;
    this.join_time = message.jointime;
    this.user_fullname = message.user_fullname;
    this.convname = message.convname;
    this.mute_status = message.mute_status;
    this.hold_status = false;
    this.media_permission = false;
    this.screenstatus = message.screenstatus;
    this.isMobile = message.isMobile;
    this.msg_id = message.msgid;
    this.user_img = message.rootImg;
    this.join_who = message.join_who;
    this.user_role = message.user_role;
    this.call_type_init = message.call_type_init;
    this.call_type_route = message.call_type_route;
    this.reg_status = message.reg_status;
    this.conversation_type = message.conversation_type;
    this.conversation_id = message.conversation_id;
    this.conference_id = message.conference_id;
    this.kurentoIP = room.kurentoIP;
    this.outgoingMedia = false; // ??
    this.incomingAudioStatus = false;
    this.incomingVideoStatus = false;

};
async function addIceCandidateSession(data, candidate, user) {
    // return new Promise((resolve, reject) => {
    if (data.sender === user.name) { // self outgoing endpoint
        if (user.outgoingMedia) {
            let out_media = await get_kurentoMedia(user.kurentoIP, user.outgoingMedia); // from kurento server
            if (out_media) out_media.addIceCandidate(candidate); // kurento
        } else { // save 
            await ice_candidate_push(user.conversation_id, user.user_id, data, candidate);
        }
    } else { // others incoming endpoint
        var in_media_list = await kurento_incoming_get(user.user_id, 'ice'); // from redis
        if (in_media_list && in_media_list[data.sender]) {
            let in_media = await get_kurentoMedia(user.kurentoIP, in_media_list[data.sender]);
            if (in_media) in_media.addIceCandidate(candidate); // kurento
        } else { // save
            await ice_candidate_push(user.conversation_id, user.user_id, data, candidate);

        }
    }
    // });
}

async function sendMessage(io, user_id, info, sdata) {
    return new Promise(async(resolve, reject) => {
        var data = _.merge(info, sdata);
        if (data.emit_type == 'call') {
            io.to(user_id + '_call').emit(data.emitter, data);
        } else if (data.emit_type == 'user') {
            io.to(user_id).emit(data.emitter, data);
        }
        async_queue.push({
            type: 'sendMessage',
            data: data,
            io: io,
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });

}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// var userRegister = new Register();
// var rooms = {};
// var callingData = {};
// var ringingData = {};
// var ringingState = {};
// var userlistData = {};
// var userProfileData = {};
// var busyData = [];
var push_subscriptions = {};

var { models } = require('./../config/db/express-cassandra');

var {
    get_one_msg,
    update_conversation
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
    deleteRedisCache,
    insertRedisCache
} = require('./../utils/redis_scripts');
const { truncate } = require('lodash');
qqq = 0;
var async = require('async');
// const { resolve } = require('path');
async_queue = async.queue(function(job, next) {
    // qqq++; console.log('jjjjj:queue: ' + qqq + ' : ' + job.type);
    switch (job.type) {
        // _________________ "kurento.incomin g." + job.user_id _______________________________
        // hmset: key="kurento.incomin g." + uid, value= { [sender_id]: incoming_id }

        case 'kurento_incoming_set':
            var user_incoming = {
                [job.sender_id]: job.incoming_id
            };
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hmset("kurento.incoming." + job.user_id, user_incoming, async function(error2, reply2) {
                if (error2) {
                    console.error(error2);
                    job.reject();
                    next();
                } else {
                    if (reply2 == 'OK') {
                        job.resolve(user_incoming);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'kurento_incoming_get':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hgetall("kurento.incoming." + job.user_id, function(error, user_incoming) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } else {
                    if (user_incoming) {
                        job.resolve(user_incoming);
                        next();
                    } else {
                        job.resolve({});
                        next();
                    }
                }
            });
            break;
        case 'kurento_incoming_del':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hdel("kurento.incoming." + job.user_id, job.sender_id, function(error3, result3) {
                if (error3) {
                    console.error(error3);
                    job.reject();
                    next();
                } else {
                    if (result3) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'kurento_incoming_clear':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.del("kurento.incoming." + job.user_id, function(error3, result3) {
                if (error3) {
                    console.error(error3);
                    job.reject();
                    next();
                } else {
                    if (result3) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
            // ______________________ "kurento.ice." + job.user_id ____________________________________________
            // hmset: key="kurento.ice." + uid, value={[data.sender+'_'+uuid()]: stringify({ data: data, candidate: candidate }) }
        case 'ice_candidate_push':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            var iceObj = { data: job.data, candidate: job.candidate };
            var dataobj = {
                [job.data.sender + '_' + get_new_id()]: JSON.stringify(iceObj)
            };
            redis_client.hmset("kurento.ice." + job.user_id, dataobj, (err, reply) => {
                if (err) {
                    console.error(err);
                    job.reject();
                    next();
                } else {
                    job.resolve(true);
                    next();
                }
            });
            break;
        case 'ice_candidate_pull':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hgetall("kurento.ice." + job.user_id, function(error, get_buffer) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } else {
                    if (get_buffer) {
                        job.resolve(get_buffer);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'ice_candidate_del':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.del("kurento.ice." + job.user_id, function(error3, result3) {
                if (error3) {
                    console.error(error3);
                    job.reject();
                    next();
                } else {
                    if (result3) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
            // ___________________________ "kurento..room." + cid ________________________
            // hmset: key="kurento..room." + cid,value={data_obj}
        case 'kurento_set_room':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hmset("kurento.room." + job.index, job.data_obj, async function(error2, reply2) {
                if (error2) {
                    console.error(error2);
                    job.reject();
                    next();
                } else {
                    if (reply2 == 'OK') {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }

            });
            break;
        case 'get_kurentoroom':

            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hgetall("kurento.room." + job.index, function(error, get_room) {
                if (error) {
                    console.error(error);
                    job.resolve(false);
                    next();
                } else {
                    if (get_room) {
                        var room = { participants: {} };
                        for (const [key, value] of Object.entries(get_room)) {
                            if (key.includes("participants.")) {
                                var uid = key.split('.')[1];
                                room.participants[uid] = JSON.parse(value);
                            } else {
                                room[key] = value;
                            }
                        }
                        job.resolve(room);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }

            });
            break;
        case 'del_kurentoroom':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.del("kurento.room." + job.conversation_id, async function(error, reply) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    job.resolve();
                    next();
                }

            });
            break;
            // hmset: key="kurento..room." + cid,value={["participants." + uid]: stringify(val) }
        case 'kurento_set_session':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            var obj_participant = {
                ["participants." + job.user_id]: JSON.stringify(job.val)
            };
            redis_client.hmset("kurento.room." + job.conversation_id, obj_participant, async function(error2, reply2) {
                if (error2) {
                    console.error(error2);
                    job.reject();
                    next();
                } else {
                    if (reply2 == 'OK') {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'kurento_update_session':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hget("kurento.room." + job.conversation_id, "participants." + job.user_id, function(error, user_session) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (user_session) {
                        var usession = JSON.parse(user_session);
                        if (job.key == 'socket') {
                            usession["id"] = job.val;
                            usession["socket"] = job.val;
                        } else {
                            usession[job.key] = job.val;
                        }
                        var dataobj = {
                            ["participants." + job.user_id]: JSON.stringify(usession)
                        };
                        redis_client.hmset("kurento.room." + job.conversation_id, dataobj, async function(error2, reply2) {
                            if (error2) {
                                console.error(error2);
                                job.reject();
                                next();
                            } else {
                                if (reply2 == 'OK') {
                                    job.resolve(true);
                                    next();
                                } else {
                                    job.resolve(false);
                                    next();
                                }
                            }
                        });
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'kurento_get_session':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hget("kurento.room." + job.conversation_id, "participants." + job.user_id, function(error, user_session) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (user_session) {
                        var usession = JSON.parse(user_session);
                        job.resolve(usession);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'del_kurento_session':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hdel("kurento.room." + job.conversation_id, "participants." + job.user_id, (err, result) => {
                job.resolve();
                next();
            });

            break;
            // case 'get_kurentoroomAll':
            //   var rooms = [];
            //   redis_scanner.eachScan('kurento.room*', (matchingKeys) => {
            //     // Depending on the pattern being scanned for, many or most calls to
            //     // this function will be passed an empty array.
            //     if (matchingKeys.length) {
            //       // Matching keys found after this iteration of the SCAN command.
            //       console.log(matchingKeys);
            //       redis_client.hgetall(matchingKeys[0], function (error, get_room) {
            //         // if (error) { console.error(error); job.reject(); next(); }
            //         // else {

            //           var room = { participants: {} };
            //           for (const [key, value] of Object.entries(get_room)) {
            //             if (key.includes("participants.")) {
            //               var uid = key.split('.')[1];
            //               room.participants[uid] = JSON.parse(value);
            //             } else {
            //               room[key] = value;
            //             }
            //           }
            //           rooms.push(room);


            //         // }

            //       });
            //     }
            //   }, (err, matchCount) => {
            //     if (err) throw (err);

            //     // matchCount will be an integer count of how many total keys
            //     // were found and passed to the intermediate callback.
            //     console.log(`Found ${matchCount} keys.`);
            //     job.resolve(rooms); next();
            //   });
            //   break;
            // ______________________ "kurento.buffer." + job.user_id __________________________
            // hmset: key="kurento.buffer." + uid, value={ [data.ackid]: stringify(data) }
        case 'sendMessage':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            var dataobj = {
                [job.data.ackid]: JSON.stringify(job.data)
            };
            redis_client.hmset("kurento.buffer." + job.user_id, dataobj, (err, reply) => {
                if (err) {
                    console.error(err);
                    job.reject();
                    next();
                } else {
                    job.resolve(true);
                    next();
                }

            });
            break;
        case 'del_user_buffer':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hdel("kurento.buffer." + job.user_id, job.ackid, function(error3, result3) {
                if (error3) {
                    console.error(error3);
                    job.reject();
                    next();
                } else {
                    // console.log('qwerty_del:'+job.ackid);
                    if (result3) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }

            });
            break;
        case 'clear_user_buffer':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.del("kurento.buffer." + job.user_id, function(error3, result3) {
                if (error3) {
                    console.error(error3);
                    job.reject();
                    next();
                } else {
                    if (result3) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }

            });

            break;
        case 'get_user_buffer':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hgetall("kurento.buffer." + job.user_id, function(error, get_buffer) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    job.resolve(get_buffer);
                    next();
                }

            });
            break;

            // __________________ "ringingstate." + job.index ____________________________
            // sadd: key="ringingstate." + cid , value=[ring_index]
        case 'ringingState_push':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.sadd("ringingstate." + job.index, [job.ring_index], function(error, res) {
                console.log('rrrrr:ringingState_push');
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    job.resolve();
                    next();
                }

            });
            break;
        case 'ringingState_pull':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.srem("ringingstate." + job.index, [job.ring_index], function(error, res) {
                console.log('rrrrr:ringingState_pull');
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    job.resolve();
                    next();
                }

            });

            break;
        case 'ringingState_get':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.smembers("ringingstate." + job.index, function(error, states) {

                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (states.length > 0) {
                        job.resolve([...states]);
                        next();
                    } else {
                        job.resolve([]);
                        next();
                    }
                }

            });
            break;
            // ________________ "callingdata." + user_id _________________________________
            // hmset: key:"callingdata." + uid,value={[key+"@@"+typeof value]:(typeof value =="object"?stringify(value):value)}
        case 'set_callingData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            var obj_data = {};
            for (let [key, value] of Object.entries(job.data_obj)) {
                obj_data[key + "@@" + typeof value] = typeof value == "object" ? JSON.stringify(value) : String(value);
            }
            redis_client.hmset("callingdata." + job.user_id, obj_data, (err, reply) => {
                if (err) {
                    console.error(err);
                    job.reject();
                    next();
                } else {
                    job.resolve(true);
                    next();
                }

            });
            break;
        case 'get_callingData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.hgetall("callingdata." + job.index, function(error, get_room) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } else {
                    if (get_room) {
                        var obj_data = {};
                        for (let [key, value] of Object.entries(get_room)) {
                            let keydiv = key.split('@@');
                            if (keydiv[1] == 'object') value = JSON.parse(value);
                            if (keydiv[1] == 'number') value = parseInt(value);
                            if (keydiv[1] == 'boolean') value = JSON.parse(value);
                            obj_data[keydiv[0]] = value
                        }
                        job.resolve(obj_data);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }

            });
            break;
        case 'del_callingData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.del("callingdata." + job.index, function(error, reply) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (reply) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;

            // __________________ "ringingdata." + cid ___________________________________________
            // hmset: key:"ringingdata." + cid,value={[key+"@@"+typeof value]:(typeof value =="object"?stringify(value):value)}
        case 'set_ringingData':
            {
                if (!redis_client) {
                    job.resolve(false);
                    next();
                    return;
                }
                if (!redis_client.connected) {
                    job.resolve(false);
                    next();
                    return;
                }
                var obj_data = {};
                for (const [key, value] of Object.entries(job.data_obj)) {
                    obj_data[key + "@@" + typeof value] = (typeof value == "object" ? JSON.stringify(value) : value);
                }
                redis_client.hmset("ringingdata." + job.index, obj_data, (err, reply) => {
                    if (err) {
                        console.error(err);
                        job.reject();
                        next();
                    } else {
                        job.resolve(true);
                        next();
                    }

                });
                break;
            }
        case 'get_ringingData':
            {
                if (!redis_client) {
                    job.resolve(false);
                    next();
                    return;
                }
                if (!redis_client.connected) {
                    job.resolve(false);
                    next();
                    return;
                }
                redis_client.hgetall("ringingdata." + job.index, function(error, get_room) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } else {
                        if (get_room) {
                            var obj_data = {};
                            for (let [key, value] of Object.entries(get_room)) {
                                let keydiv = key.split('@@');
                                if (keydiv[1] == 'object') value = JSON.parse(value);
                                if (keydiv[1] == 'number') value = parseInt(value);
                                if (keydiv[1] == 'boolean') value = JSON.parse(value);
                                obj_data[keydiv[0]] = value
                            }
                            job.resolve(obj_data);
                            next();
                        } else {
                            job.resolve(false);
                            next();
                        }
                    }

                });
                break;
            }
        case 'del_ringingData':
            {
                if (!redis_client) {
                    job.resolve(false);
                    next();
                    return;
                }
                if (!redis_client.connected) {
                    job.resolve(false);
                    next();
                    return;
                }
                redis_client.del("ringingdata." + job.index, function(error, reply) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        job.resolve();
                        next();
                    }
                });
                break;
            }
            // _________________ "userlistdata." + cid __________________________
            // sadd: key:"userlistdata." + cid,value=[uid]
        case 'set_userlistData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.sadd("userlistdata." + job.index, job.data_obj, function(error, res) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    job.resolve();
                    next();
                }

            });
            break;
        case 'del_userlistData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.srem("userlistdata." + job.index, [job.user_id], async function(error, res) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (res) {
                        job.resolve(true);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
        case 'get_userlistData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            redis_client.smembers("userlistdata." + job.index, function(error, states) {
                if (error) {
                    console.error(error);
                    job.reject();
                    next();
                } // throw error;
                else {
                    if (states.length > 0) {
                        job.resolve([...states]);
                        next();
                    } else {
                        job.resolve(false);
                        next();
                    }
                }
            });
            break;
            // ______________ "busydata", user_id ________________________
            // sadd: key="busydata",value=[uid]
        case 'set_busyData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            if (job.user_id) {
                redis_client.hmset("busydata", {
                    [job.user_id.toString()]: job.conversation_id
                }, function(error, res) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        job.resolve();
                        next();
                    }
                });
            } else {
                next();
            }

            break;
        case 'get_busyData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            if (job.user_id) {
                redis_client.hget("busydata", job.user_id.toString(), function(error, reply) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        if (reply) {
                            job.resolve({ status: true, conversation_id: reply });
                            next();
                        } else {
                            job.resolve({ status: false });
                            next();
                        }
                    }
                });
            } else {
                next();
            }

            break;
        case 'del_busyData':
            if (!redis_client) {
                job.resolve(false);
                next();
                return;
            }
            if (!redis_client.connected) {
                job.resolve(false);
                next();
                return;
            }
            if (job.user_id) {
                redis_client.hdel("busydata", [job.user_id.toString()], function(error, res) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        job.resolve();
                        next();
                    }
                });
            } else {
                next();
            }
            break;
        case 'kurento_alluserdata_set':
            {
                if (!redis_client) {
                    job.resolve(false);
                    next();
                    return;
                }
                if (!redis_client.connected) {
                    job.resolve(false);
                    next();
                    return;
                }
                redis_client.set("kurento.alluserdata", JSON.stringify(job.allUserdata), function(error, res) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        job.resolve(true);
                        next();
                    }
                });
                break;
            }
        case 'kurento_alluserdata_get':
            {
                if (!redis_client) {
                    job.resolve(false);
                    next();
                    return;
                }
                if (!redis_client.connected) {
                    job.resolve(false);
                    next();
                    return;
                }
                redis_client.get("kurento.alluserdata", function(error, res) {
                    if (error) {
                        console.error(error);
                        job.reject();
                        next();
                    } // throw error;
                    else {
                        if (res) {
                            job.resolve(JSON.parse(res));
                            next();
                        } else {
                            job.resolve(false);
                            next();
                        }
                    }
                });
                break;
            }
            // _____________________ cassandra _________________________________
        case 'updateCallMsg':
            if (validator.isUUID(job.ring_data.msgid) && validator.isUUID(job.conversation_id)) {
                models.instance.Messages.findOne({
                    conversation_id: models.uuidFromString(job.conversation_id),
                    msg_id: models.timeuuidFromString(job.ring_data.msgid)
                }, { raw: true, allow_filtering: true }, async function(error2, msg_info) {
                    if (error2) {
                        console.error(error2);
                        job.reject();
                        next();
                    } else {
                        if (job.msg == "") job.msg = msg_info.msg_body;
                        if (job.ring_data.call_start_time == 0) { var call_duration = ''; } else {
                            var timeDifference = Math.abs(Date.now() - job.ring_data.call_start_time);
                            var call_duration = convertMS(timeDifference);
                        }
                        models.instance.Messages.update({
                            conversation_id: models.uuidFromString(job.conversation_id),
                            msg_id: models.timeuuidFromString(job.ring_data.msgid)
                        }, {
                            created_at: new Date().getTime(),
                            msg_body: job.msg,
                            call_status: job.call_status,
                            has_reply: msg_info.has_reply,
                            last_reply_time: msg_info.last_reply_time,
                            last_reply_name: msg_info.last_reply_name,
                            call_duration: call_duration,
                            call_running: false
                        }, update_if_exists, function(error4) {
                            if (error4) {
                                console.error(error4);
                                job.reject();
                                next();
                            } else {
                                msg_info.msg_body = job.msg;
                                update_conversation(models.uuidFromString(job.conversation_id), msg_info);
                                job.resolve(true);
                                next();

                            }
                        });
                    }
                });
            } else {
                job.reject();
                next();
            }

            break;
        case 'sendCallMsg':
            {
                var message = new models.instance.Messages(job.totalData);
                message.saveAsync()
                .then(function(res) {
                    job.callback({ status: true, res: job.msgid, msg: message });
                    next();
                })
                .catch(function(err) {
                    job.callback({ status: false, err: err });
                    next();
                });
                break;
            }
            // ________________ kurento ______________________________________
        case 'kurento_create_pipeline':
            job.kurentoClient.create('MediaPipeline', async(error2, pipeline) => { // ok
                if (error2) {
                    job.callback(error2);
                    job.resolve(false);
                    next();
                } else {
                    pipeline.setLatencyStats(true, function(error3) { console.log(error3); });
                    // await add_ringingData(data.conversation_id, 'pipeline_flag', true);
                    job.resolve({ pipeline: pipeline });
                    next();
                }
            });
            break;

    }
}, 1);
async_queue.drain = function() {
    console.log('The queue has finished processing!');
};

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return h + ':' + m + ':' + s;
}
async function call_stats_stop(io, user_id, conversation_id, conversation_init, ulist) {
    var conv_run;
    var user_run = false;
    var room_info = await get_kurentoroom(conversation_id);
    if (!room_info) conv_run = false;
    else conv_run = true;
    if (user_id) {
        var user_info = await getUserBusybyCID(user_id, conversation_id);
        if (!user_info) { user_run = false; } else {
            var ring_data = await get_ringingData(user_id);
            if (ring_data.call_option == 'window') user_run = true;
            else user_run = false;
        }
    }
    var ring_data = await get_ringingData(conversation_id);
    for (let n = 0; n < ring_data.participants_all.length; n++) {
        let uid = ring_data.participants_all[n];
        await sendMessage(io, uid, {
            ackid: get_new_id(),
            emitter: 'call_stats_stop',
            emit_type: 'user',
        }, {
            conversation_id: conversation_id,
            conversation_init: conversation_init,
            user_id: user_id,
            init_id: ring_data.init_id,
            call_option: ring_data.call_option,
            msg_id: ring_data.msgid,
            conv_run: conv_run,
            user_run: user_run,
            room_info: room_info,
            participants_all: ring_data.participants_all,
            ulist: ulist,
            conversation_list: ring_data.conversation_list
        });
        if (!ulist) {
            for (let j = 0; j < ring_data.conversation_list.length; j++) {
                let cid = ring_data.conversation_list[j];
                if (calling_user_conv[uid]) {
                    let idx = calling_user_conv[uid].indexOf(cid);
                    if (idx !== -1) { calling_user_conv[uid].splice(idx, 1); }
                }
            }
        }
    }



}

function clean_timer_stats(ring_index) {
    if (typeof call_stats_user[ring_index] != 'undefined') { // clear join
        clearTimeout(call_stats_user[ring_index]);
        delete call_stats_user[ring_index];
    }
}
// async function clean_timer_user(user_id, conversation_id) {
//   return new Promise(async (resolve, reject) => {
//     // for (let v in call_timer_user) {
//     //   if (conversation_id == v.split('_')[0]) {
//     //     if (user_id == v.split('_')[1]) {
//     //       if (typeof call_timer_user[v] != 'undefined') {
//     //         clearTimeout(call_timer_user[v]);
//     //         delete call_timer_user[v];


//     //       }
//     //     } 
//     //     if (user_id == v.split('_')[2]) {
//     //       if (typeof call_timer_user[v] != 'undefined') {
//     //         clearTimeout(call_timer_user[v]);
//     //         delete call_timer_user[v];

//     //       }
//     //     }

//     //   }
//     // };
//     resolve();
//   });
// }
async function clean_timer_self(user_id, conversation_id) {
    return new Promise(async(resolve, reject) => {
        for (let v in call_timer_self) {
            if (conversation_id == v.split('_')[0]) {
                if (user_id == v.split('_')[1] && user_id == v.split('_')[2]) {
                    if (typeof call_timer_self[v] != 'undefined') {
                        clearTimeout(call_timer_self[v]);
                        delete call_timer_self[v];
                        console.log('__status:timer:del = ' + v);
                    }
                }
            }
        };
        resolve();
    });

}
// function clean_timer_connect(user_id) {
//   // if (typeof call_timer_connect[user_id] != 'undefined') {

//   //   console.log('voip:timer:clear:connect:' + user_id);
//   //   delete call_timer_connect[user_id];
//   // }

// }
async function clean_timer_ring(io, ring_index, conversation_id) {
    return new Promise(async(resolve, reject) => {
        if (typeof calltimer_ring[ring_index] != 'undefined') {
            clearInterval(calltimer_ring[ring_index]);
            delete calltimer_ring[ring_index];
            await sendMessage(io, ring_index.split('_')[2], {
                ackid: get_new_id(),
                emitter: 'android_ring_end',
                emit_type: 'user',
            }, { ring_index: ring_index }); // ok

            await ringingState_pull(conversation_id, ring_index);
            resolve(true);
        }
    });
}
async function leaveRoomConfbyId(io, user_id, user_fullname, conversation_id, msg) {
    return new Promise(async(resolve, reject) => {
        if (msg != 6) {
            var ulist = await get_userlistData(conversation_id);
            if (ulist) {
                for (const v of ulist) {
                    if (user_id != v) {
                        let userSession = await kurento_get_session(v, conversation_id); // from queue system
                        await sendMessage(io, userSession.user_id, {
                            ackid: get_new_id(),
                            emitter: 'message_voip',
                            emit_type: 'call',
                        }, {
                            id: 'participantLeft',
                            name: user_id,
                            data: {
                                'reloadstatus': 'endcall',
                                'hangup_id': user_id,
                                'hangup_name': user_fullname,
                                'msg': msg
                            }
                        });
                    }
                };
            }
        }
        var room = await get_kurentoroom(conversation_id);
        if (!room) { resolve(0); return; }
        let userSession = await kurento_get_session(user_id, conversation_id); // from queue system
        if (userSession) { // disconnect self outgoing
            let user_outgoingMedia = await get_kurentoMedia(userSession.kurentoIP, userSession.outgoingMedia);
            if (user_outgoingMedia) {
                user_outgoingMedia.release();
                delete userSession.outgoingMedia;
                await kurento_set_session(userSession.user_id, userSession.conversation_id, '_set_', userSession);
            }

            var incoming_media = await kurento_incoming_get(userSession.user_id, 'clear');
            if (incoming_media) {
                for (var i in incoming_media) { // release incoming media for self
                    if (incoming_media[i]) {
                        var inc = incoming_media[i];
                        let user_incomingMedia = await get_kurentoMedia(userSession.kurentoIP, inc);
                        if (user_incomingMedia) {
                            user_incomingMedia.release();
                            delete incoming_media[i];
                        }
                    }
                }
            }
            await kurento_incoming_clear(userSession.user_id);
            await ice_candidate_del(userSession.user_id);
            // ================================================================================
            var room = await get_kurentoroom(userSession.conversation_id);
            for (var i in room.participants) { // disconnect from others incoming
                var incoming_media = await kurento_incoming_get(i, 'del');
                if (incoming_media && incoming_media[userSession.user_id]) { // release viewer from this
                    var inc = incoming_media[userSession.user_id];
                    let user_incomingMedia = await get_kurentoMedia(userSession.kurentoIP, inc);
                    if (user_incomingMedia) {
                        user_incomingMedia.release();
                        delete incoming_media[userSession.user_id];
                        await kurento_incoming_del(i, userSession.user_id);
                    }
                }
            }
            // delete userSession.conversation_id;
            await del_kurento_session(userSession.conversation_id, userSession.user_id);
            var room = await get_kurentoroom(userSession.conversation_id);
            if (msg != 6) {
                if (Object.keys(room.participants).length == 0) {
                    let _pipeline = await get_kurentoMedia(room.kurentoIP, room.pipeline);
                    if (_pipeline) _pipeline.release();
                    await del_kurentoroom(conversation_id);
                }
            }
        }
        var room = await get_kurentoroom(userSession.conversation_id);
        if (room && room.participants) resolve(Object.keys(room.participants).length);
        else resolve(0);
    });

}
async function clean_call_user(user_id, data, io, socket, clean_type = true) { // cclean
    return new Promise(async(resolve, reject) => {
        if (typeof user_id == 'undefined') return;
        data.user_left = await leaveRoomConfbyId(io, user_id, data.user_fullname, data.conversation_id, data.msg);
        var ring_data = await get_ringingData(data.conversation_id);
        for (let n = 0; n < ring_data.participants_all.length; n++) {
            await sendMessage(io, ring_data.participants_all[n], {
                ackid: get_new_id(),
                emitter: 'call_user_left',
                emit_type: 'user',
            }, data);
        }

        clean_timer_stats(data.conversation_id + '_' + user_id + '_stats_out');
        await del_busyData(user_id);
        await set_callingData(user_id, { 'cleanup_needed': !clean_type, 'kurento_status': 'leave' });
        var call_data = await get_callingData(user_id);
        if (call_data && call_data.conf_data && call_data.conf_data.join_who == 'guest' && socket.handshake.session.guest_status == 'ringing') {
            var ulist = await get_userlistData(data.conversation_id);
            if (ulist && ulist.length > 1) {
                data.usersOnline = ulist;
                for (let v of ulist) {
                    await sendMessage(io, v, {
                        ackid: get_new_id(),
                        emitter: 'guest_call_timeout',
                        emit_type: 'user',
                    }, data); // ok
                };
            }
            var ring_state = await ringingState_get(data.conversation_id);
            if (ring_state) {
                for (let v of ring_state) {
                    if (user_id == v.split('_')[1]) {
                        await clean_timer_ring(io, v, data.conversation_id);
                    }
                };
            }
            setGuestSession(io, user_id, 'ended', (getstatus) => {});
        }
        // await del_callingData(user_id);
        await clear_user_buffer(user_id);
        await del_userlistData(data.conversation_id, user_id);
        if (clean_type) {
            await sendMessage(io, user_id, {
                ackid: get_new_id(),
                emitter: 'android_call_end',
                emit_type: 'user',
            }, data);
            send_msg_firebase(user_id, data, 'android_call_end', call_data);
        }
        var ulist = await get_userlistData(data.conversation_id);
        call_stats_stop(io, user_id, data.conversation_id, data.conversation_init, ulist);
        if (!ulist) {
            if (ring_data && ring_data.end_flag == false) {
                await set_ringingData(data.conversation_id, { 'end_flag': true });
                await call_msgUpdate(data.conversation_id, ring_data, data, io);
                get_one_msg({
                    conversation_id: data.conversation_id,
                    msg_id: ring_data.msgid
                }, async(result, error5) => {
                    if (error5) { console.error(error5); } else {
                        result.msg.old_msgid = ring_data.msgid;
                        if (result.msg.attch_imgfile == null) result.msg.attch_imgfile = [];
                        if (result.msg.attch_audiofile == null) result.msg.attch_audiofile = [];
                        if (result.msg.attch_videofile == null) result.msg.attch_videofile = [];
                        if (result.msg.attch_otherfile == null) result.msg.attch_otherfile = [];
                        result.conversation_type = ring_data.conversation_init == 'personal' ? 'single' : 'group';
                        result.conversation_title = ring_data.convname;
                        result.conversation_img = 'img.png';
                        for (var n = 0; n < ring_data.participants_all.length; n++) {
                            await sendMessage(io, ring_data.participants_all[n], {
                                ackid: get_new_id(),
                                emitter: 'newMessageCall',
                                emit_type: 'user',
                            }, result); // ok
                        }

                    }
                });
            }
        }
        resolve(ulist);
    });
}

// REDIS:: busy ===========================================================
function set_busyData(user_id, conversation_id) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'set_busyData',
            user_id: user_id,
            conversation_id: conversation_id,
            resolve: resolve,
            reject: reject
        });
    });
}

function del_busyData(user_id) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'del_busyData',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });
}

function kurento_alluserdata_set(allUserdata) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'kurento_alluserdata_set',
            allUserdata: allUserdata,
            resolve: resolve,
            reject: reject
        });

    });
}

function kurento_alluserdata_get() { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'kurento_alluserdata_get',
            resolve: resolve,
            reject: reject
        });

    });
}

function get_busyData(user_id) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'get_busyData',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });

}
// ================================================================

// ==========================================================================================
function get_busyTimer(user_id) {
    if (user_id) {
        var user_id = user_id.toString();
        var is_timer_user = false;
        for (let v in call_timer_self) {
            if (user_id == v.split('_')[1]) {
                if (typeof call_timer_self[v] != 'undefined') {
                    var is_timer_user = true;
                }
            }
            if (user_id == v.split('_')[2]) {
                if (typeof call_timer_self[v] != 'undefined') {
                    var is_timer_user = true;
                }
            }
        };


        return is_timer_user;
    } else {
        return false;
    }
}
// ==================================================
// REDIS:: userlist =======================================================================
function set_userlistData(index, data_obj) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'set_userlistData',
            index: index,
            data_obj: data_obj,
            resolve: resolve,
            reject: reject
        });
    });
}

function get_userlistData(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'get_userlistData',
            index: index,
            resolve: resolve,
            reject: reject
        });

    });

}

function add_userlistData(index, data_obj) { // ok
    // return new Promise((resolve, reject) => {
    //   async_queue.push({
    //     type: 'add_userlistData',
    //     index: index,
    //     data_obj: data_obj,
    //     resolve: resolve, reject: reject
    //   });

    // });
}

function del_userlistData(index, user_id) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'del_userlistData',
            index: index,
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });
}
// redis:buffer ======================================================
function replacer(key, value) {
    const originalObject = this[key];
    if (originalObject instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(originalObject.entries()), // or with spread: value: [...originalObject]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function get_user_buffer(user_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'get_user_buffer',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });
    });
}

function del_user_buffer(user_id, ackid) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'del_user_buffer',
            ackid: ackid,
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });
}

async function clear_user_buffer(user_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'clear_user_buffer',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });
}

// REDIS::kurentodata ==============================================================================
function kurento_set_room(index, data_obj) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_set_room',
            index: index,
            data_obj: data_obj,
            resolve: resolve,
            reject: reject
        });

    });
}
async function kurento_set_session(user_id, conversation_id, key, val) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_set_session',
            user_id: user_id,
            conversation_id: conversation_id,
            key: key,
            val: val,
            resolve: resolve,
            reject: reject
        });
    });
}
async function kurento_update_session(user_id, conversation_id, key, val) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_update_session',
            user_id: user_id,
            conversation_id: conversation_id,
            key: key,
            val: val,
            resolve: resolve,
            reject: reject
        });
    });
}
async function kurento_get_session(user_id, conversation_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_get_session',
            user_id: user_id,
            conversation_id: conversation_id,
            resolve: resolve,
            reject: reject
        });
    });
}
async function kurento_incoming_set(conversation_id, user_id, sender_id, incoming_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_incoming_set',
            conversation_id: conversation_id,
            user_id: user_id,
            sender_id: sender_id,
            incoming_id: incoming_id,
            resolve: resolve,
            reject: reject
        });
    });
}
async function ice_candidate_push(conversation_id, user_id, data, candidate) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'ice_candidate_push',
            conversation_id: conversation_id,
            user_id: user_id,
            data: data,
            candidate: candidate,
            resolve: resolve,
            reject: reject
        });
    });
}
async function kurento_incoming_del(user_id, sender_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_incoming_del',
            user_id: user_id,
            sender_id: sender_id,
            resolve: resolve,
            reject: reject
        });

    });
}
async function kurento_incoming_clear(user_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_incoming_clear',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });
    });
}
async function del_kurento_session(conversation_id, user_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'del_kurento_session',
            user_id: user_id,
            conversation_id: conversation_id,
            resolve: resolve,
            reject: reject
        });
    });
}
async function getRoomInfo(conversation_id) { // old
    return new Promise(async(resolve, reject) => {
        let room = await get_kurentoroom(conversation_id);
        if (room) {
            resolve(room);
        } else {
            resolve(null);
        }
    });
}

function get_kurentoroom(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'get_kurentoroom',
            index: index,
            resolve: resolve,
            reject: reject
        });
    });
}

function get_kurentoroomAll() { // ok
    return new Promise((resolve, reject) => {
        // async_queue.push({
        //   type: 'get_kurentoroomAll',
        //   resolve: resolve, reject: reject
        // });

    });
}

function del_kurentoroom(conversation_id) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'del_kurentoroom',
            conversation_id: conversation_id,
            resolve: resolve,
            reject: reject
        });
    });
}

function get_kurentoMedia(kurentoIP, media_id) { // ok
    return new Promise((resolve, reject) => {
        getKurentoClientByIP(kurentoIP, (error, kurentoClient, kurentoIP) => {
            if (error) reject();
            else {
                kurentoClient.getMediaobjectById(media_id, (error, media) => { // ok
                    if (error) resolve(false);
                    else {
                        resolve(media);
                    }
                });
            }
        });
    });
}
// REDIS:: ringingData ==============================================================================
async function set_ringingData(index, data_obj) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'set_ringingData',
            index: index,
            data_obj: data_obj,
            resolve: resolve,
            reject: reject
        });
    });
}

function add_ringingData(index, data_obj) { // ok
    // return new Promise((resolve, reject) => {
    //   async_queue.push({
    //     type: 'add_ringingData',
    //     index: index,
    //     data_obj: data_obj,
    //     resolve: resolve, reject: reject
    //   });
    // });
}

function del_ringingData(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'del_ringingData',
            index: index,
            resolve: resolve,
            reject: reject
        });

    });
}

function get_ringingData(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'get_ringingData',
            index: index,
            resolve: resolve,
            reject: reject
        });


    });
}

// REDIS:: callingData ================================================================================
function set_callingData(user_id, data_obj) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'set_callingData',
            user_id: user_id,
            data_obj: data_obj,
            resolve: resolve,
            reject: reject
        });
    });
}

function get_callingData(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'get_callingData',
            index: index,
            resolve: resolve,
            reject: reject
        });



    });
}

function del_callingData(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'del_callingData',
            index: index,
            resolve: resolve,
            reject: reject
        });


    });

}

function add_callingData(index, data_obj) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'add_callingData',
            index: index,
            data_obj: data_obj,
            resolve: resolve,
            reject: reject
        });

    });
}
// REDIS:: ringingState ============================================================================
function ringingState_push(index, ring_index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'ringingState_push',
            index: index,
            ring_index: ring_index,
            resolve: resolve,
            reject: reject
        });


    });
}

function ringingState_pull(index, ring_index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'ringingState_pull',
            index: index,
            ring_index: ring_index,
            resolve: resolve,
            reject: reject
        });


    });
}

function ringingState_get(index) { // ok
    return new Promise((resolve, reject) => {
        async_queue.push({
            type: 'ringingState_get',
            index: index,
            resolve: resolve,
            reject: reject
        });


    });
}
// ===============================================================================================
function savePushSubscription(user_id, subscription) {
    // if (!push_subscriptions[user_id]) {
    push_subscriptions[user_id] = subscription;
    // }
}

function getPushSubscription(user_id) {
    if (push_subscriptions[user_id]) {
        return push_subscriptions[user_id];
    } else {
        return false;
    }
}
async function get_msg_rep_info(conversation_id, msg_id) {
    // var ring_data = await get_ringingData(conversation_id);
    return new Promise((resolve, reject) => { // ???????????????????????
        models.instance.Messages.findOne({
            conversation_id: models.uuidFromString(conversation_id),
            msg_id: models.timeuuidFromString(msg_id)
        }, { raw: true, allow_filtering: true }, async function(err, msg_info) {
            if (err) {} else {
                models.instance.ReplayConv.findOne({
                    msg_id: models.timeuuidFromString(msg_id),
                    conversation_id: models.uuidFromString(conversation_id)
                }, { raw: true, allow_filtering: true }, async function(err, reply_info) {
                    if (err) {} else {

                        resolve({
                            msg_info: msg_info,
                            reply_info: reply_info
                        });
                    }
                });

                // }
            }
        });
        // }
    });

}
async function send_new_msgid(io, conversation_id, msg_id) {
    // var ring_data = await get_ringingData(conversation_id);
    // get_one_msg({
    //   conversation_id: conversation_id,
    //   msg_id: msg_id
    // }, async (result, error) => {
    //   if (result.status) {
    //     result.msg.old_msgid = msg_id;
    //     if (result.msg.attch_imgfile == null) result.msg.attch_imgfile = [];
    //     if (result.msg.attch_audiofile == null) result.msg.attch_audiofile = [];
    //     if (result.msg.attch_videofile == null) result.msg.attch_videofile = [];
    //     if (result.msg.attch_otherfile == null) result.msg.attch_otherfile = [];
    //     result.conversation_type = ring_data.conversation_init == 'personal' ? 'single' : 'group';
    //     result.conversation_title = ring_data.convname;
    //     result.conversation_img = 'img.png';
    //     for (var n = 0; n < ring_data.participants_all.length; n++) {
    //       await sendMessage(io, ring_data.participants_all[n], {
    //         ackid: get_new_id(),
    //         emitter: 'newMessageCall',
    //         emit_type: 'user',
    //       }, result); // ok
    //     }
    //   }
    // });

}

var call_msgUpdate = async(conversation_id, ring_data, data, io) => {
    return new Promise(async(resolve, reject) => {
        if (ring_data) {
            if (parseInt(data.msg) == 0) {
                data.msg_body = ring_data.hangup_name + ' rejected your call.';
                data.call_status = 'message';
            } else if (parseInt(data.msg) == 1) {
                data.msg_body = ring_data.hangup_name + ' couldn\'t attend call from ' + ring_data.initiator_name + ' and replied back "I\'ll call you later."';
                data.call_status = 'message';
            } else if (parseInt(data.msg) == 2) {
                data.msg_body = ring_data.hangup_name + ' couldn\'t attend call from ' + ring_data.initiator_name + ' and replied back "Can\'t talk now. Call me later?"';
                data.call_status = 'message';
            } else if (parseInt(data.msg) == 3) {
                data.msg_body = ring_data.hangup_name + ' couldn\'t attend call from ' + ring_data.initiator_name + ' and replied back "I\'m in a meeting. I\'ll call you back."';
                data.call_status = 'message';
            } else if (parseInt(data.msg) == 4) {
                data.msg_body = 'missed call';
                data.call_status = 'miss';
            } else {
                data.msg_body = 'call ended';
                data.call_status = 'ended';
            }
            async_queue.push({
                type: 'updateCallMsg',
                io: io,
                msg: data.msg_body,
                call_status: data.call_status,
                conversation_id: conversation_id,
                ring_data: ring_data,
                resolve: resolve,
                reject: reject
            });
        } else {
            resolve(false);
        }
    });
}
var get_msgid_info = (msg_id, conversation_id, callback) => {
    if (parseInt(msg_id) == 0) {
        callback(false);
    } else {
        models.instance.Messages.find({
                conversation_id: models.uuidFromString(conversation_id),
                msg_id: models.timeuuidFromString(msg_id)
            }, { raw: true, allow_filtering: true },
            function(err, msgid_info) {
                if (msgid_info) callback(msgid_info);
                else callback(false);
            });
    }
}
var get_convid_info = (conversation_id, callback) => {
    // if (parseInt(conversation_id) == 0) {
    //   callback(false);
    // } else {

    if (models.instance.Conversation) {
        models.instance.Conversation.findOne({
            conversation_id: models.uuidFromString(conversation_id)
        }, { raw: true, allow_filtering: true }, function(err, convid_info) {
            if (convid_info) {
                callback(convid_info);
            } else {
                callback(false);
            }
        });
    }

    // }
}
var get_running_calls = (callback) => {
    models.instance.Messages.find({
            msg_type: 'call',
            call_running: true
        }, { raw: true, allow_filtering: true },
        function(err, msgid_info) {
            if (msgid_info) {
                callback(msgid_info);
            } else {
                callback('false');
            }

        });
}

async function send_socket_support(user_id, emitter, data, io, socket, is_firebase) {
    let call_data = await get_callingData(user_id);
    if (call_data && call_data.kurento_status != 'leave' && (await get_busyData(user_id)).status) {
        if (emitter == 'videoconf_send') {
            io.to(user_id + '_call').emit(emitter, data);
        } else {
            await sendMessage(io, user_id, {
                ackid: get_new_id(),
                emitter: emitter,
                emit_type: 'call',
            }, data);

        }
    } else {
        if (emitter == 'videoconf_send') {
            io.to(user_id).emit(emitter, data);
        } else {
            await sendMessage(io, user_id, {
                ackid: get_new_id(),
                emitter: emitter,
                emit_type: 'user',
            }, data);
        }
        if (is_firebase) send_msg_firebase(user_id, data, emitter, call_data);

    }
}

async function msgdb_alluser() {
    return new Promise(async(resolve, reject) => {
        var redis_alldata = await kurento_alluserdata_get();
        if (redis_alldata) {
            resolve(redis_alldata);
        } else {
            models.instance.Users.find({ is_delete: 0 }, { raw: true, allow_filtering: true }, async function(err, allUserdata) {
                if (err) { reject(false); } else {
                    await kurento_alluserdata_set(allUserdata);
                    resolve(allUserdata);

                }
            });
        }
    });
}
async function send_call_ringing(conversation_id, user_id, ring_index, data, io, socket, type) {
    // send_socket_support(user_id, 'videoconf_status', data, io, socket);
    send_socket_support(user_id, 'videoconf_send', data, io, socket, true);
    send_socket_support(user_id, 'videoconf_push', data, io, socket, false);

    let cc = 0;
    calltimer_ring[ring_index] = setInterval(async function() {
        data.ring_index = ring_index;
        cc++;
        if (cc == 12) {
            if (type == 1) { // ring
                data.msg = 4;
                await clean_timer_ring(io, data.ring_index, data.conversation_id);
                await clean_call_user(user_id, data, io, socket);
                if (data.conversation_init == 'personal') {
                    await clean_call_user(data.rootId, data, io, socket);
                }
            } else if (type == 2) { // add 
                data.msg = 4;
                await clean_timer_ring(io, data.ring_index, data.conversation_id);
                await clean_call_user(data.member_id, data, io, socket);
                let ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    for (let v of ulist) {
                        await sendMessage(io, v, {
                            ackid: get_new_id(),
                            emitter: 'conf_addmember_timeout',
                            emit_type: 'user',
                        }, data); // ok
                    };
                }
            } else if (type == 3) { // guest
                data.msg = 4;
                await clean_timer_ring(io, data.ring_index, data.conversation_id);
                setGuestSession(io, data.guestId, 'noresponse', (getstatus) => {});
                // let iscall = await getRoomInfoUser(user_id);
                var iscall = await getUserBusybyCID(user_id, data.conversation_id);
                if (!iscall) {
                    await del_busyData(user_id);
                    await del_userlistData(data.conversation_id, user_id);
                }
                for (const v of data.usersOnline) {
                    await sendMessage(io, v, {
                        ackid: get_new_id(),
                        emitter: 'guest_call_timeout',
                        emit_type: 'user',
                    }, data); // ok
                };
            }
        } else {
            send_socket_support(user_id, 'videoconf_send', data, io, socket, false);
            // send_socket_support(user_id, 'videoconf_status', data, io, socket);
        }
    }, 5000);
    await ringingState_push(conversation_id, ring_index);
    // var user_subs = getPushSubscription(user_id);
    // if (user_subs) {
    //   webpush.sendNotification(user_subs, JSON.stringify({
    //     sender_name: data.sender_name,
    //     sender_img: data.sender_img
    //   })).catch(err => console.error(err));
    // }
}

function joinRoomConf(io, socket, data, membercount, kurentoClient, kurentoIP, callback) {
    if (data.reg_status == 'switch_server') {
        if ((data.msgid) != '0') {
            models.instance.Messages.find({
                msg_id: models.timeuuidFromString(data.msgid),
                conversation_id: models.uuidFromString(data.conversation_id)
            }, { raw: true, allow_filtering: true }, async function(err, dbmessage) {
                if (err) callback(false);
                var newIP;
                if (dbmessage[0].call_server_addr == wsUrl1) newIP = wsUrl2;
                else newIP = wsUrl1;
                var room = await getRoomConfByIP(data.conversation_id, newIP, data.conference_id, data.convname, data.msgid).catch((error) => { callback(error); return; });
                joinConf(io, socket, room, data, membercount, (err, user, room_info) => {
                    if (err) { callback(err); return; }
                    callback(null, room, room_info);
                });

            });
        }
    } else {
        getRoomConf(io, socket, data, kurentoClient, kurentoIP, (error, room) => { // create new _room with pipe line or return it
            if (error) { callback(error); return; }
            joinConf(io, socket, room, data, membercount, (err, user, room_info) => {
                if (err) { callback(err); return; }
                callback(null, room, room_info);
            });
        });
    }
}
async function getRoomConf(io, socket, data, kurentoClient, kurentoIP, callback) { // get kurento room or create it
    let room = await get_kurentoroom(data.conversation_id);
    if (!room) {
        var kurento_create = await kurento_create_pipeline(kurentoClient, callback);
        if (kurento_create) {
            room = { // new room
                pipeline: kurento_create.pipeline.id,
                kurentoIP: kurentoIP,
                name: data.conversation_id,
                convname: data.convname,
                conference_id: data.conference_id,
                msg_id: data.msgid,
                conversation_init: data.conversation_init,
                // participants: {},
            };
            await kurento_set_room(data.conversation_id, room);
            callback(null, room);
            // start ring system ============================================================================
            var ring_data = await get_ringingData(data.conversation_id);
            if (data.join_who == 'initiator' && data.conversation_type.toLowerCase() != 'guest' && ring_data.ring_need == true) {
                await set_ringingData(data.conversation_id, { 'ring_need': false });
                var ring_data = await get_ringingData(data.conversation_id);
                // delete ring_data.allUserdata;
                if (ring_data && ring_data.call_option == 'ring') {
                    var ulist = await get_userlistData(data.conversation_id);
                    if (ulist) {
                        for (const v of ulist) { // acutal ring here
                            ring_data.ring_type = 'new';
                            if (data.user_id != v) {
                                if ((await get_busyData(v)).status == false || get_busyTimer(v) == false) {
                                    await set_busyData(v, data.conversation_id);
                                    let ring_index = data.conversation_id + '_' + data.user_id + '_' + v; // sender(U)_receiver(M)
                                    ring_data.ring_index = ring_index;
                                    send_call_ringing(data.conversation_id, v, ring_index, ring_data, io, socket, 1);
                                    // await ringingState_push(data.conversation_id, ring_index);
                                } // ???
                            } else { // send ringing to initiator (android)

                                await sendMessage(io, data.rootId, {
                                    ackid: get_new_id(),
                                    emitter: 'videoconf_status',
                                    emit_type: 'user',
                                }, ring_data); // ok
                            }
                        };
                    } else {
                        // ?? 
                    }
                }
            }
            if (data.join_who == 'initiator' && data.conversation_type.toLowerCase() == 'guest' && data.reloadstatus == 'newconf') {
                var ring_data = await get_ringingData(data.conversation_id);
                if (ring_data) {
                    data.init_id = ring_data.init_id;
                    data.msgid = ring_data.msgid;
                    data.repid = ring_data.repid;
                    await sendMessage(io, ring_data.guestId, {
                        ackid: get_new_id(),
                        emitter: 'guest_call_join',
                        emit_type: 'user',
                    }, data); // ok
                }
            }
            // end ring ==========================================
        }

    } else {
        callback(null, room);
    }
}
eee = 0;
async function create_endpoint_kurento(kurentoIP, pipeline_id) {
    return new Promise(async(resolve, reject) => {
        let _pipeline = await get_kurentoMedia(kurentoIP, pipeline_id);
        if (_pipeline) { // err???
            _pipeline.create('WebRtcEndpoint', async(error, webrtcMedia) => {
                resolve({ error, webrtcMedia, _pipeline })
            });
        } else {
            reject({ error: true })
        }
    });
}
// async function create_endpoint_in(kurentoIP, pipeline_id) {
//   return new Promise(async (resolve, reject) => {
//     let _pipeline = await get_kurentoMedia(kurentoIP, pipeline_id);
//     if (_pipeline) {
//       _pipeline.create('WebRtcEndpoint', async (error, incoming) => {
//         resolve({ error, incoming,_pipeline })
//       });
//     } else {
//       reject({error:true})
//     }
//   });
// }

async function joinConf(io, socket, room, data, membercount, callback) {
    // start checkpoint : 3 ===============================================================================================
    let call_data = await get_callingData(data.user_id);
    console.log('__status:step:3');
    if (call_data == false || call_data && call_data.user_status == 'leave') { callback('leave'); return; }
    await leaveRoomConfbyId(io, data.user_id, data.user_fullname, data.conversation_id, 6);
    let userSession = new Session(io, socket, room, data); // add user to session
    await kurento_set_session(userSession.user_id, userSession.conversation_id, '_set_', userSession); // ok
    let { error, webrtcMedia: outgoingMedia } = await create_endpoint_kurento(room.kurentoIP, room.pipeline);
    if (error) { return callback(error); }
    await kurento_update_session(userSession.user_id, userSession.conversation_id, 'outgoingMedia', outgoingMedia.id);
    // let call_data = await get_callingData(data.user_id); // ??????
    await set_callingData(data.user_id, { 'has_endpoint': true, 'kurento_status': 'joined' });
    // start checkpoint : 4 ===============================================================================================
    console.log('__status:step:4');
    if (call_data == false || call_data && call_data.user_status == 'leave') { callback('leave'); return; }
    // kurento : addIceCandidate from iceCandidateQueue =======================================================
    let iceCandidateQueue = await ice_candidate_pull(userSession.name);
    if (iceCandidateQueue) { // userSession.name in iceCandidateQueue
        for (const [key, value] of Object.entries(iceCandidateQueue)) {
            if (key.split('_')[0] == userSession.name) {
                let data = JSON.parse(value);
                outgoingMedia.addIceCandidate(data.candidate); // kurento
            }
        }
        await ice_candidate_del(userSession.name);
    }
    // =============================================================
    outgoingMedia.on('OnIceCandidate', async event => { // ICE listener
        let candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
        await sendMessage(io, userSession.user_id, {
            ackid: get_new_id(),
            emitter: 'message_voip',
            emit_type: 'call',
        }, {
            id: 'iceCandidate',
            name: userSession.name,
            candidate: candidate
        }); // ok
    });
    // socket : other users :  send newParticipantArrived to other users except me ==========================================
    var room = await get_kurentoroom(data.conversation_id);
    for (let i in room.participants) {
        if (i != userSession.name) { // except me
            await sendMessage(io, i, {
                ackid: get_new_id(),
                emitter: 'message_voip',
                emit_type: 'call'
            }, {
                id: 'newParticipantArrived',
                name: userSession.name,
                user_id: userSession.user_id,
                conversation_id: userSession.conversation_id,
                user_fullname: userSession.user_fullname,
                reg_status: userSession.reg_status,
                user_img: userSession.user_img,
                join_time: userSession.join_time,
                call_type_route: userSession.call_type_route,
                mute_status: userSession.mute_status,
                hold_status: userSession.hold_status,
                screenstatus: userSession.screenstatus,
                conversation_type: userSession.conversation_type,
                media_permission: userSession.media_permission,
                kurentoIP: userSession.kurentoIP,
                user_role: userSession.user_role,
            }); // ok
        }
    }
    // socket : current user:  existingParticipants (except me) : send list of other participants to current user =====
    let existingUsers = []; // send list of current user in the _room to current participant
    for (let i in room.participants) { // same loop
        if (i != userSession.user_id) { // except me
            existingUsers.push({
                name: room.participants[i].name,
                user_id: room.participants[i].user_id,
                conversation_id: room.participants[i].conversation_id,
                user_fullname: room.participants[i].user_fullname,
                user_img: room.participants[i].user_img,
                join_time: room.participants[i].join_time,
                call_type_route: room.participants[i].call_type_route,
                mute_status: room.participants[i].mute_status,
                hold_status: room.participants[i].hold_status,
                screenstatus: room.participants[i].screenstatus,
                media_permission: room.participants[i].media_permission,
                kurentoIP: room.participants[i].kurentoIP,
                user_role: room.participants[i].user_role
            });
        }
    }
    await sendMessage(io, userSession.user_id, {
        ackid: get_new_id(),
        emitter: 'message_voip',
        emit_type: 'call',
    }, {
        id: 'existingParticipants',
        data: existingUsers, // 2nd hit
        arr_participants: data.arr_participants,
        user_id: userSession.user_id,
        reg_status: userSession.reg_status,
        join_time: userSession.join_time,
        call_type_route: userSession.call_type_route,
        mute_status: userSession.mute_status,
        hold_status: userSession.hold_status,
        screenstatus: userSession.screenstatus,
        media_permission: userSession.media_permission,
        kurentoIP: userSession.kurentoIP,
        conversation_id: userSession.conversation_id,
        user_role: userSession.user_role
    });
    // socket : voip_ringstatus_ok + call_stats__server ==================================================
    await sendMessage(io, userSession.user_id, {
        ackid: get_new_id(),
        emitter: 'voip_ringstatus_ok',
        emit_type: 'call',
    }, data);
    await sendMessage(io, userSession.user_id, {
        ackid: get_new_id(),
        emitter: 'videoconf_status',
        emit_type: 'call',
    }, data);

    let ring_data = await get_ringingData(userSession.conversation_id);
    for (let n = 0; n < ring_data.participants_all.length; n++) {
        let uid = ring_data.participants_all[n];

        await sendMessage(io, uid, {
            ackid: get_new_id(),
            emitter: 'call_stats_server',
            emit_type: 'user',
        }, {
            user_id: userSession.user_id,
            msg_id: userSession.msg_id,
            conversation_id: userSession.conversation_id,
            call_type_init: userSession.call_type_init,
            call_type_route: userSession.call_type_route,
            conversation_init: ring_data.conversation_init,
            call_option: ring_data.call_option
        });
        calling_user_conv[uid] = calling_user_conv[uid] || [];
        if (calling_user_conv[uid].indexOf(userSession.conversation_id) === -1) calling_user_conv[uid].push(userSession.conversation_id);

    }
    callback(null, userSession, room); // add user to userlist
    // ============================================================================================
    // ============================ OUTGOING EVENTS =================================================
    // MediaElement events =====================================================
    // ----------------------------------------------------------------------
    outgoingMedia.on('MediaFlowOutStateChange', async(event) => {
        // if (event.mediaType == "AUDIO") console.log('mmmmmm:out:' + event.mediaType + ':' + event.state + ':' + userSession.user_fullname);
        if (event.state == "FLOWING") {
            await clean_timer_self(data.user_id, userSession.conversation_id); // clear network issue timer
            await set_callingData(userSession.user_id, { 'media_flow': true });
            let call_data = await get_callingData(data.user_id);
            if (call_data && call_data.android_emit == false) {
                await set_callingData(userSession.user_id, { 'android_emit': true });
                var ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    for (let v of ulist) {
                        if (data.rootId != v) {
                            await sendMessage(io, v, {
                                ackid: get_new_id(),
                                emitter: 'android_call_join',
                                emit_type: 'user',
                            }, data);
                        }
                    };
                }
            }
            // start checkpoint : 5 ===============================================================================================
            console.log('__status:step:5');
            if (call_data == false || call_data && call_data.user_status == 'leave') { callback('leave'); return; }
        } else {
            await set_callingData(userSession.user_id, { 'media_flow': false });

        }
    });
    // ------------------------------------------------------------------
    // outgoingMedia.on('ElementConnected', (event) => {
    //   // console.log('voip:kurento:event:outgoing:Element_Connect:' + event.mediaType + ':' + userSession.user_fullname);
    // });
    // outgoingMedia.on('ElementDisconnected', (event) => {
    //   // console.log('voip:kurento:event:outgoing:Element_Disconnect:' + event.mediaType + ':' + userSession.user_fullname);
    // });
    outgoingMedia.on('MediaTranscodingStateChange', (event) => {
        console.log('kurento___outgoing:MediaTranscoding:' + ':' + event.state + ':' + userSession.user_fullname);
    });
    // BaseRtpEndpoint events =====================================================
    // --------------------------------------------------------------------------------
    outgoingMedia.on('MediaStateChanged', async(event) => { // reconnect
        console.log('kurento___out:' + event.newState + ':' + userSession.user_fullname);
        if (event.newState == 'CONNECTED') {
            if (userSession) {
                // clean_timer_connect(userSession.user_id);
            }
        } else { // disconnected
            var member_left = await leaveRoomConfbyId(io, userSession.user_id, userSession.user_fullname, userSession.conversation_id, 5);
            var ring_data = await get_ringingData(userSession.conversation_id);
            if (member_left < 2 && ring_data.conversation_init == 'personal') {
                if (ring_data && ring_data.finish_flag == false) {
                    await set_ringingData(data.conversation_id, { 'finish_flag': true });
                    ring_data.msg = 5;
                    ring_data.hangup_id = userSession.user_id;
                    ring_data.hangup_name = userSession.user_fullname;
                    ring_data.user_id = userSession.user_id;
                    ring_data.user_fullname = userSession.user_fullname;
                    ring_data.sender_name = userSession.user_fullname;
                    ring_data.sender_img = userSession.user_img;
                    let ulist = await get_userlistData(userSession.conversation_id);
                    if (ulist) { for (let v of ulist) { await clean_call_user(v, ring_data, io, socket); }; }
                    let ring_state = await ringingState_get(data.conversation_id);
                    if (ring_state) { for (let v of ring_state) { await clean_timer_ring(io, v, data.conversation_id); }; }
                }
            } else {
                await clean_call_user(userSession.user_id, ring_data, io, socket, false);
            }
        }
    });
    // --------------------------------------------------------------------------------
    // outgoingMedia.on('ConnectionStateChanged', (event) => {
    //   // console.log('voip:kurento:event:outgoing:ConnectionState:', event.newState + ':' + userSession.user_fullname);
    //   if (event.newState == 'CONNECTED') {}
    // });
    // ------------------- WebRtc_Endpoint event -----------------------------
    // outgoingMedia.on('DataChannelClose', (event) => {
    // 	console.log('voip:kurento:event:outgoing:DataChannel_Close:' + ':' + userSession.user_fullname);

    // });
    // outgoingMedia.on('DataChannelOpen', (event) => {
    // 	console.log('voip:kurento:event:outgoing:DataChannel_Open:' + ':' + userSession.user_fullname);
    // });
    // outgoingMedia.on('IceCandidateFound', (event) => {
    //   console.log('voip:kurento:event:outgoing:IceCandidateFound:' + ':' + userSession.user_fullname);
    // });
    // outgoingMedia.on('IceComponentStateChange', (event) => {
    //   console.log('voip:kurento:event:outgoing:IceComponentState:' + ':' + event.state + ':' + userSession.user_fullname);
    // });
    // outgoingMedia.on('IceGatheringDone', (event) => {
    //   console.log('voip:kurento:event:outgoing:IceGatheringDone:' + ':' + userSession.user_fullname);
    // });
    // outgoingMedia.on('NewCandidatePairSelected', (event) => {
    //   console.log('voip:kurento:event:outgoing:NewCandidatePairSelected:' + ':' + userSession.user_fullname);
    // });
    // ====================== OUTGOING EVENTS ============================================================
    // =================================================================================================
    // });
    // }

}
async function getEndpointForUser(io, userSession, sender, socket) {
    return new Promise(async(resolve, reject) => {
        if (userSession.name === sender.name) { return resolve(userSession.outgoingMedia); }
        // let incoming = userSession.incomingMedia[sender.name]; // receive
        var incoming = await kurento_incoming_get(userSession.user_id, 'endpoint');
        if (!incoming[sender.name]) {
            var room = await getRoomConfByIP(userSession.conversation_id, userSession.kurentoIP, userSession.conference_id, userSession.convname, userSession.msg_id)
                .catch((error) => { reject(error); return; });
            let { error, webrtcMedia: incoming, _pipeline } = await create_endpoint_kurento(room.kurentoIP, room.pipeline);
            if (error) {
                if (Object.keys(room.participants).length === 0) {
                    _pipeline.release();
                    await del_kurentoroom(userSession.conversation_id);
                }
                reject(error);
                return;
            }
            await set_ringingData(userSession.conversation_id, { 'start_flag': true });
            await kurento_incoming_set(userSession.conversation_id, userSession.user_id, sender.name, incoming.id);
            let iceCandidateQueue = await ice_candidate_pull(userSession.name);
            if (iceCandidateQueue) { // userSession.name in iceCandidateQueue
                for (const [key, value] of Object.entries(iceCandidateQueue)) {
                    if (key.split('_')[0] == sender.name) {
                        let data = JSON.parse(value);
                        incoming.addIceCandidate(data.candidate); // kurento
                    }
                }
                await ice_candidate_del(userSession.name);
            }
            if (sender.outgoingMedia) {
                let sender_outMedia = await get_kurentoMedia(room.kurentoIP, sender.outgoingMedia);
                if (sender_outMedia) {
                    sender_outMedia.connect(incoming, error => {
                        if (error) { reject(error); return; }
                        resolve(incoming.id);
                    });
                }
            }

            // =============== INCOMING EVENTS =================================================================
            incoming.on('OnIceCandidate', async event => {
                // console.log('voip_zxc:kurento:event:ice:incoming:OnIceCandidate', event);
                let candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
                await sendMessage(io, userSession.user_id, {
                    ackid: get_new_id(),
                    emitter: 'message_voip',
                    emit_type: 'call',
                }, {
                    id: 'iceCandidate',
                    name: sender.name,
                    candidate: candidate
                });
            });
            // ------------------------------------------------------------------
            incoming.on('MediaFlowInStateChange', async(event) => {
                if (event.mediaType == "AUDIO") console.log('kurento___in:' + event.state + ':sender:' + sender.user_fullname + ':receiver:' + userSession.user_fullname);

                if (event.mediaType == 'AUDIO') {
                    if (event.state == "FLOWING") var media_audio = true;
                    else var media_audio = false;
                    await kurento_update_session(sender.user_id, sender.conversation_id, 'incomingAudioStatus', media_audio);
                }
                if (event.mediaType == 'VIDEO') {
                    if (event.state == "FLOWING") var media_video = true;
                    else var media_video = false;
                    await kurento_update_session(sender.user_id, sender.conversation_id, 'incomingVideoStatus', media_video);
                }
                var total_audio = 0,
                    total_video = 0,
                    total_users = [];
                var room = await get_kurentoroom(sender.conversation_id);
                if (room && room.participants) {
                    for (let i in room.participants) {
                        if (room.participants[i].incomingAudioStatus) { total_audio += 1; }
                        if (room.participants[i].incomingVideoStatus) { total_video += 1; }
                        total_users.push({
                            name: room.participants[i].name,
                            user_id: room.participants[i].user_id,
                            call_type_route: room.participants[i].call_type_route,
                            incomingAudioStatus: room.participants[i].incomingAudioStatus,
                            incomingVideoStatus: room.participants[i].incomingVideoStatus
                        });
                    }

                }
                var ring_data = await get_ringingData(sender.conversation_id);
                var dd = Date.now();
                if (total_audio > 1 || total_video > 1) {
                    if (ring_data.call_start_time == 0) {
                        await set_ringingData(sender.conversation_id, { 'call_start_time': dd });
                        ring_data = await get_ringingData(sender.conversation_id);
                    }
                }
                if (room && room.participants) {
                    for (let i in room.participants) {
                        // let senderSession = await getUserSessionByName(sender.user_id, sender.conversation_id);
                        let senderSession = await kurento_get_session(sender.user_id, sender.conversation_id); // from queue system
                        if (senderSession) {
                            await sendMessage(io, i, {
                                ackid: get_new_id(),
                                emitter: 'conf_connect',
                                emit_type: 'call',
                            }, {
                                state: event.state,
                                mediaType: event.mediaType,
                                senderid: sender.name,
                                sender_calltype: senderSession.call_type_route,
                            }); // ok
                            // console.log('sssssssssssssssssssss:get:' + ring_data.call_start_time + '::' + dd);
                            await sendMessage(io, i, {
                                ackid: get_new_id(),
                                emitter: 'conf_stream_count',
                                emit_type: 'call',
                            }, {
                                total_audio: total_audio,
                                total_video: total_video,
                                total_users: total_users,
                                call_start_time: ring_data.call_start_time,
                                call_now_time: Date.now()
                            }); // ok

                        }
                    }
                }
            });
            // --------------------------------------------------------------------
            // incoming.on('ConnectionStateChanged', (event) => {
            //   // console.log('voip:kurento:event:incoming:ConnectionState:' + event.newState + ':' + userSession.user_fullname);
            //   if (event.newState == 'CONNECTED') {            }
            // });
            // incoming.on('MediaStateChanged', (event) => {
            //   // console.log('voip:kurento:event:incoming:MediaState:' + event.newState + ':' + userSession.user_fullname);
            // });
            // incoming.on('IceGatheringDone', (event) => {
            //   // console.log('voip:kurento:event:incoming:IceGatheringDone:' + sender.user_id);
            // });
            // incoming.on('IceComponentStateChange', (event) => {
            //   // console.log('voip:kurento:event:incoming:IceComponentState:' + event.state + ':' + userSession.user_fullname);
            // });
            // incoming.on('ElementConnected', (event) => {
            //   // console.log('voip:kurento:event:incoming:Element_Connect:' + event.mediaType + ':' + userSession.user_fullname);
            // });
            // incoming.on('ElementDisconnected', (event) => {
            //   // console.log('voip:kurento:event:incoming:Element_Disconnect:' + event.mediaType + ':' + userSession.user_fullname);
            // });
            incoming.on('MediaTranscodingStateChange', (event) => {
                console.log('kurento___in:MediaTranscoding:' + ':' + event.state + ':' + userSession.user_fullname);
            });

            // ================ INCOMING EVENTS =================================================================

            // ================ kurento_getstats =======================================================
            // if (dev_mode == 'server') {
            //   let bytesPrev; let bytesPrev_audio;
            //   let timestampPrev; let timestampPrev_audio;
            //   // call_timer_user[userSession.conversation_id + '_stats_in'] = setInterval(function () {
            //   // 	incoming.getStats('VIDEO', function (error, statsMap) {
            //   // 		for (var key in statsMap) {
            //   // 			if (!statsMap.hasOwnProperty(key)) continue; //do not dig in prototypes
            //   // 			stats = statsMap[key];
            //   // 			const now = stats.timestamp;
            //   // 			let bitrate;
            //   // 			if (stats.type == 'outboundrtp') {
            //   // 				const bytes = stats.bytesSent;
            //   // 				if (timestampPrev) {
            //   // 					bitrate = 8 * (bytes - bytesPrev) / (now - timestampPrev);
            //   // 					bitrate = bitrate / 1024;
            //   // 					bitrate = Math.floor(bitrate);
            //   // 				}
            //   // 				bytesPrev = bytes;
            //   // 				timestampPrev = now;
            //   // 				userSession.incomingBitrate[sender.name] = bitrate;
            //   // 			}
            //   // 		}
            //   // 	});
            //   // 	incoming.getStats('AUDIO', function (error, statsMap) {
            //   // 		for (var key in statsMap) {
            //   // 			if (!statsMap.hasOwnProperty(key)) continue; //do not dig in prototypes
            //   // 			stats = statsMap[key];
            //   // 			const now_audio = stats.timestamp;
            //   // 			let bitrate_audio;
            //   // 			if (stats.type == 'outboundrtp') {
            //   // 				const bytes_audio = stats.bytesSent;
            //   // 				if (timestampPrev_audio) {
            //   // 					bitrate_audio = 8 * (bytes_audio - bytesPrev_audio) / (now_audio - timestampPrev_audio);
            //   // 					bitrate_audio = bitrate_audio / 1024;
            //   // 					bitrate_audio = Math.floor(bitrate_audio);
            //   // 				}
            //   // 				bytesPrev_audio = bytes_audio;
            //   // 				timestampPrev_audio = now_audio;

            //   // 				userSession.incomingBitrateAudio[sender.name] = bitrate_audio;
            //   // 			}

            //   // 		}
            //   // 	});
            //   // }, 2000);
            // }
            // ================ kurento_getstats =======================================================
            // });
            // }
        } else {
            let sender_outMedia = await get_kurentoMedia(userSession.kurentoIP, sender.outgoingMedia);
            if (sender_outMedia) {
                sender_outMedia.connect(incoming, error => {
                    if (error) { reject(error); }
                    resolve(incoming.id);
                });
            }

        }
    });
}
async function getRoomConfByIP(conversation_id, IP, conference_id, convname, msg_id) {
    return new Promise(async(resolve, reject) => {
        let room = await get_kurentoroom(conversation_id);
        if (!room) {
            console.log(`voip:kurento => create new _room by ip : ${conversation_id}`);
            getKurentoClientByIP(IP, (error, kurentoClient, kurentoIP) => {
                if (error) { return reject(error); }
                kurentoClient.create('MediaPipeline', async(error, pipeline) => { // ok
                    if (error) { return reject(error); }
                    room = {
                        name: conversation_id,
                        pipeline: pipeline.id,
                        kurentoIP: kurentoIP,
                        // participants: {},
                        convname: convname,
                        callwaiting: 0,
                        conference_id: conference_id,
                        msg_id: msg_id
                    };
                    await kurento_set_room(conversation_id, room);
                    resolve(room);
                    pipeline.setLatencyStats(true, function(error) {});
                });
            });
        } else {
            // console.log(`voip:kurento:get existing room : ${conversation_id}`);
            resolve(room);
        }
    });
}


async function getRoomInfoUser(user_id) {
    return new Promise(async(resolve, reject) => {
        var userbusy = false;
        // var rooms = await get_kurentoroomAll();
        // if (rooms) {
        //   for (let room of rooms) {
        //     for (let i in room.participants) {
        //       if (room.participants[i].user_id == user_id) {
        //         userbusy = true;
        //       }
        //     }
        //   };
        // }

        resolve(userbusy);
    });
}

async function getUserBusybyCID(user_id, conversation_id) {
    return new Promise(async(resolve, reject) => {
        let room = await get_kurentoroom(conversation_id);
        var userbusy = false;
        if (room) {
            for (let i in room.participants) {
                if (room.participants[i].user_id == user_id) { userbusy = true; }
            }
        }
        resolve(userbusy);
    });
}
async function kurento_create_pipeline(kurentoClient, callback) { // ok ???
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_create_pipeline',
            kurentoClient: kurentoClient,
            callback: callback,
            resolve: resolve,
            reject: reject
        });

    });
}
async function kurento_incoming_get(user_id, kind) { // ok ???
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'kurento_incoming_get',
            user_id: user_id,
            kind: kind,
            resolve: resolve,
            reject: reject
        });
    });
}
async function ice_candidate_pull(user_id) { // ok
    return new Promise(async(resolve, reject) => {

        async_queue.push({
            type: 'ice_candidate_pull',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });

    });
}
async function ice_candidate_del(user_id) { // ok
    return new Promise(async(resolve, reject) => {
        async_queue.push({
            type: 'ice_candidate_del',
            user_id: user_id,
            resolve: resolve,
            reject: reject
        });
    });
}

function getUserSessionByName(user_id, conversation_id) { // ok
    return new Promise(async(resolve, reject) => {
        var room = await get_kurentoroom(conversation_id);
        if (room && room.participants && user_id in room.participants) {
            resolve(room.participants[user_id]);
        } else {
            resolve(false);
        }
    });
}

async function getRoomUserSession(name, conversation_id, callback) {
    // let room = rooms[conversation_id]; // ok
    // let room = await get_kurentoroom(conversation_id).catch(() => { console.error('2126'); });
    // if (room) {
    //   if (Object.keys(room.participants).length > 0) {
    //     if (room.participants) {
    //       for (let i in room.participants) {
    //         if (room.participants[i].name == name) {
    //           callback(null, room.participants[i]);
    //         }
    //       }
    //     }
    //   } else {
    //     callback(true, null);
    //   }
    // } else {
    //   callback(true, null);
    // }

}

function generateSdpStreamConfig(nodeStreamIp, port, audioport, callback) {
    if (typeof nodeStreamIp === 'undefined' ||
        nodeStreamIp === null ||
        typeof port === 'undefined' ||
        port === null) {
        return callback('nodeStreamIp and port for generating Sdp Must be setted');
    }
    var sdpRtpOfferString = 'v=0\n';
    sdpRtpOfferString += 'o=- 0 0 IN IP4 ' + nodeStreamIp + '\n';
    sdpRtpOfferString += 's=KMS\n';
    sdpRtpOfferString += 'c=IN IP4 ' + nodeStreamIp + '\n';
    sdpRtpOfferString += 't=0 0\n';
    sdpRtpOfferString += 'm=audio ' + audioport + ' RTP/AVP 97\n';
    sdpRtpOfferString += 'a=recvonly\n';
    sdpRtpOfferString += 'a=rtpmap:97 PCMU/8000\n';
    sdpRtpOfferString += 'a=fmtp:97 profile-level-id=1;mode=AAC-hbr;sizelength=13;indexlength=3;indexdeltalength=3;config=1508\n';
    sdpRtpOfferString += 'm=video ' + port + ' RTP/AVP 96\n';
    sdpRtpOfferString += 'a=rtpmap:96 H264/90000\n';
    sdpRtpOfferString += 'a=fmtp:96 packetization-mode=1\n';
    return callback(null, sdpRtpOfferString);
}

function bindFFmpeg(streamip, streamport, sdpData, userSession) {
    var dir = './sdp';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(dir + '/' + streamip + '_' + streamport + '.sdp', sdpData);
    var ffmpeg_args = [
        // '-protocol_whitelist', 'file,udp,rtp',
        '-i', dir + '/' + streamip + '_' + streamport + '.sdp',
        '-vcodec', 'copy',
        '-acodec', 'copy',
        '-f', 'flv',
        'rtmp://localhost/live/' + streamip + '_' + streamport
    ].concat();
    var child = spawn('ffmpeg', ffmpeg_args);
    console.log('/live/' + streamip + '_' + streamport);

    // userSession.await sendMessage({
    //   ackid: get_new_id(),
    //   id: 'rtmp',
    //   message: '/live/' + streamip + '_' + streamport
    // });
    //ignore stdout
    //this.child.stdout.on('data', this.emit.bind(this, 'data'));
    // child.stderr.on('data', function (data) {
    //   var _len = data.length;
    //   var _str;
    //   if (data[_len - 1] == 13) {
    //     _str = data.toString().substring(0, _len - 1);
    //   } else {
    //     _str = data.toString();
    //   }

    //   // userSession.await sendMessage({
    //   //   ackid: get_new_id(),
    //   //   id: 'ffmpeg',
    //   //   message: _str
    //   // });
    // });

    child.on('error', function(err) {
        if (err.code == 'ENOENT') {
            // userSession.await sendMessage({
            //   ackid: get_new_id(),
            //   id: 'ffmpeg',
            //   message: 'The server has not installed ffmpeg yet.'
            // });
        } else {
            // userSession.await sendMessage({
            //   ackid: get_new_id(),
            //   id: 'ffmpeg',
            //   message: err
            // });
        }
    });

    child.on('close', function(code) {
        if (code === 0) {
            // userSession.await sendMessage({
            //   ackid: get_new_id(),
            //   id: 'ffmpeg',
            //   message: streamip + '_' + streamport + ' closed'
            // });
        }
    });
    return child;
};



function getUserSession(socketid, callback) {
    // let userSession = userRegister.getById(socketid);
    // if (userSession) callback(userSession);
    // else callback(false);
}



async function getUserSessionByUid(user_id) {
    return new Promise(async(resolve, reject) => {
        var usersessions = [];
        // var rooms = await get_kurentoroomAll();
        // if (rooms) {
        //   for (let room of rooms) {
        //     for (let i in room.participants) {
        //       if (room.participants[i].user_id == user_id) {
        //         usersessions.push(room.participants[i]);
        //       }
        //     }
        //   };
        // }

        resolve(usersessions);
    });
}

async function receiveVideoFrom(io, socket, user_id, senderName, sdpOffer, conversation_id, callback) {
    return new Promise(async(resolve, reject) => {
        // let userSession = await getUserSessionByName(user_id, conversation_id);
        let userSession = await kurento_get_session(user_id, conversation_id); // from queue system
        // let sender = await getUserSessionByName(senderName, conversation_id);
        let sender = await kurento_get_session(senderName, conversation_id);
        if (!userSession) {
            callback(false);
            reject();
            // return;
        }
        var endpoint = await getEndpointForUser(io, userSession, sender, socket);
        if (endpoint) {
            let _endpoint = await get_kurentoMedia(userSession.kurentoIP, endpoint);
            if (_endpoint) {
                _endpoint.processOffer(sdpOffer, async(error, sdpAnswer) => {
                    if (error) {
                        callback(false);
                        reject();
                        // console.log('fffff:receiveVideoFrom'); //next();
                        // return;
                    }
                    await sendMessage(io, userSession.user_id, {
                        ackid: get_new_id(),
                        emitter: 'message_voip',
                        emit_type: 'call',
                    }, {
                        id: 'receiveVideoAnswer',
                        name: sender.name,
                        sdpAnswer: sdpAnswer
                    }); // ok

                    _endpoint.gatherCandidates(error => {
                        if (error) {
                            callback(false);
                            reject();
                            // console.log('fffff:receiveVideoFrom'); //next();
                            // return
                        }
                    });
                    callback(true);
                    resolve(sdpAnswer);
                    // console.log('fffff:receiveVideoFrom'); //next();
                    // return
                });
            }

        } else {
            callback(false);
            resolve(false);
            // console.log('fffff:receiveVideoFrom'); //next();
            // return
        }
    });
}

async function getRoomMemberCount(conversation_id, callback) {
    // var room = rooms[conversation_id];
    // let room2 = await get_kurentoroom(conversation_id);
    // if (!room) {
    //   callback(0);
    // } else {
    //   callback(Object.keys(room.participants).length);
    // }
}



function getKurentoClient(callback) {
    var server_found = false;
    console.log('voip:kurento:get_Client: ' + wsUrl1);
    kurento(wsUrl1, { max_retries: 1, request_timeout: 60000, response_timeout: 60000, duplicates_timeout: 60000, failAfter: 1 }, (error, kurentoClient) => { // ok
        if (error) {
            console.log(`voip:kurento:Could not find media server at address ${wsUrl1}`);
        } else {
            console.log('voip:kurento:found_Client: ' + wsUrl1);
            if (server_found == false) {
                server_found = true;
                kurentoClient.on('connect', function(con) {
                    console.log("voip:kurento:connect");
                }).on('reconnect', function(n, delay) {
                    console.log("voip:kurento:reconnect:" + n + " Delay : " + delay);
                }).on('disconnect', function(err) {
                    console.log("voip:kurento:" + 'disconnected:', err);
                    callback('server down');
                }).on('fail', function(err) {
                    console.log("voip:kurento:fail:" + err);
                });

                callback(null, kurentoClient, wsUrl1);
            }
        }
    });

    console.log('voip:kurento:get_Client: ' + wsUrl2);
    kurento(wsUrl2, { max_retries: 1, request_timeout: 60000, response_timeout: 60000, duplicates_timeout: 60000, failAfter: 1 }, (error, kurentoClient) => {
        if (error) {
            console.log(`voip:kurento:Could not find media server at address ${wsUrl2}`);
        } else {
            console.log('found_KurentoClient: ' + wsUrl2);
            if (server_found == false) {
                server_found = true;
                kurentoClient.on('connect', function(con) {
                    console.log(">>kurento_server:Connect");
                }).on('reconnect', function(n, delay) {
                    console.log(">>kurento_server:reconnect:" + n + " Delay : " + delay);
                }).on('disconnect', function(err) {
                    console.log(">>kurento_server:" + 'disconnected:', err);
                    callback('server down');
                }).on('fail', function(err) {
                    console.log(">>kurento_server:disconnect:" + err);
                });

                callback(null, kurentoClient, wsUrl2);
            }
        }
    });

}

function getKurentoClientByIP(IP, callback) {
    console.log('ggg:kurento_ip', IP);
    if (IP) {
        kurento(IP, (error, kurentoClient) => { // ok
            if (error) {
                console.log(`Could not find media server at address ${wsUrl1}`);

            } else {
                kurentoClient.on('connect', function(con) {
                        console.log(">>kurento_server:Connect");
                    })
                    .on('reconnect', function(n, delay) {
                        console.log(">>kurento_server:reconnect:" + n + " Delay : " + delay);
                    })
                    .on('disconnect', function(err) {
                        console.log(">>kurento_server:" + 'disconnected:', err);
                        callback('server down');
                    })
                    .on('fail', function(err) {
                        console.log(">>kurento_server:disconnect:" + err);
                    });

                callback(null, kurentoClient, IP);
                // }
            }
        });

    }

}

async function addIceCandidateClient(socket, data, callback) { // app
    // let user = await getUserSessionByName(data.user_id, data.conversation_id); // from queue system
    let user = await kurento_get_session(data.user_id, data.conversation_id); // from queue system
    if (user) {
        let candidate = kurento.register.complexTypes.IceCandidate(data.candidate); // assign type to IceCandidate
        addIceCandidateSession(data, candidate, user); // session
        callback();
    } else {
        console.error(`voip:ice candidate with no user receive : ${data.sender}`); // *****************
        callback(new Error("voip:addIce_Candidate failed"));
    }
}


var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
}
var sendCallMsg = async(from, sender_img, sender_name, conversation_id, msg, msgduration, set_calltype, replycount, arr_participants, conference_id, call_running, call_status, last_reply_time, last_reply_name, callback) => {
    if (isRealString(msg) && from != null && sender_img != null && sender_name != null && conversation_id != null && msg != null && set_calltype != null && replycount != null && arr_participants != null && conference_id != null && call_running != null && call_status != null) {
        var msgid = models.timeuuid();
        var uuidconversation_id = models.uuidFromString(conversation_id);
        var uuidfrom = models.uuidFromString(from);
        var nullval = [];
        var imgfile = (typeof attachment === 'undefined') ? nullval : attachment.imgfile;
        var audiofile = (typeof attachment === 'undefined') ? nullval : attachment.audiofile;
        var videofile = (typeof attachment === 'undefined') ? nullval : attachment.videofile;
        var otherfile = (typeof attachment === 'undefined') ? nullval : attachment.otherfile;

        var totalData = {
            msg_id: msgid,
            msg_type: 'call',
            msg_body: msg,
            conversation_id: uuidconversation_id,
            call_type: set_calltype,
            call_status: call_status,
            call_duration: msgduration,
            call_running: call_running,
            call_participants: arr_participants,
            conference_id: conference_id,
            sender: uuidfrom,
            sender_name: sender_name,
            sender_img: sender_img,
            attch_imgfile: imgfile,
            attch_audiofile: audiofile,
            attch_videofile: videofile,
            attch_otherfile: otherfile,
            has_reply: replycount
        }

        if (last_reply_time != null) { totalData['last_reply_time'] = last_reply_time; }
        if (last_reply_name != null) { totalData['last_reply_name'] = last_reply_name; }

        // await insertRedisCache('messages',totalData);

        async_queue.push({
            type: 'sendCallMsg',
            totalData: totalData,
            msgid: msgid,
            callback: callback,
            // resolve: resolve, reject: reject
        });

        //this done by dalim for updating is_active col while new message com
        // var convquery = { conversation_id: uuidconversation_id, company_id: models.timeuuidFromString(userCompany_id[from.toString()]) };
        // models.instance.Conversation.find(convquery, { raw: true, allow_filtering: true }, function (errconv, convfind) {
        // 	if (convfind.length == 1) {
        // 		var msgstatus = "";
        // 		var abcd = (convfind[0].msg_status == null) ? [] : (convfind[0].msg_status).split("@");
        // 		_.each(convfind[0].participants, function (vp, kp) {
        // 			var kk = abcd.findIndex(element => element.includes(vp));
        // 			if (vp == uuidfrom) {
        // 				msgstatus += vp + ":0@";
        // 			}
        // 			else if (kk > -1) {
        // 				var noofur = Number(abcd[kk].replace(vp + ":", "")) + 1;
        // 				msgstatus += vp + ":" + noofur + "@";
        // 			}
        // 			else {
        // 				msgstatus += vp + ":1@";
        // 			}
        // 		});

        // 		models.instance.Conversation.update(convquery, { is_active: null, sender_id: uuidfrom, last_msg: msg, last_msg_time: moment().format('MM/DD/YYYY hh:mm:ss').toString(), msg_status: msgstatus }, function (err) {
        // 			if (err) {
        // 				if (err) throw err;
        // 			} else {
        // 				console.log("is_active remove successfully");
        // 			}
        // 		});
        // 	}
        // });


    } else {
        callback({ status: false, err: 'Message formate not supported.' });
    }
};

var getUserIsBusy = (from, callback) => {

    if (validator.isUUID(from)) {
        models.instance.Users.findOne({ id: models.uuidFromString(from) }, { raw: true, allow_filtering: true }, function(err, user) {
            if (err) throw err;
            //user is an array of plain objects with only name and age
            if (user) {
                callback({ db: true, status: user.is_busy });
            } else {
                callback({ db: false, status: false });
            }
        });

    } else {
        callback({ db: false, status: false });
    }
};

var getGuestStatus = (guestid, callback) => {
    models.instance.CallGuest.findOne({ id: models.uuidFromString(guestid) }, { raw: true, allow_filtering: true }, function(err, guestinfo) {
        if (err) throw err;
        if (guestinfo) {
            callback({ db: true, guestinfo: guestinfo });
        } else {
            callback({ db: false });
        }
    });
};

// var setGuestStatus = (guestid, newstatus, callback) => {
// 	models.instance.CallGuest.update({
// 		id: models.uuidFromString(guestid)
// 	}, { status: newstatus }, update_if_exists, function (err) {
// 		if (err) {
// 			callback(false);
// 		} else {
// 			callback(true);
// 		}
// 	});
// };

var setGuestSession = (io, guestId, newstatus, callback) => {
    if (io.sockets.adapter.rooms.hasOwnProperty(guestId)) {
        if (Object.keys(io.sockets.adapter.rooms[guestId].sockets).length > 0) {
            var guest_clients = io.sockets.adapter.rooms[guestId].sockets;
            for (var gId in guest_clients) {
                var clientSocket = io.sockets.connected[gId];
                clientSocket.handshake.session.guest_status = newstatus;
                clientSocket.handshake.session.join_who = 'guest';
                clientSocket.handshake.session.save();
                console.log('ggg:set:' + guestId + ':' + newstatus);
            }
            callback(true);
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }
};
var setUserConference = (io, guestId, conference_id, callback) => {
    if (io.sockets.adapter.rooms.hasOwnProperty(guestId)) {
        if (Object.keys(io.sockets.adapter.rooms[guestId].sockets).length > 0) {
            var guest_clients = io.sockets.adapter.rooms[guestId].sockets;
            for (var gId in guest_clients) {
                var clientSocket = io.sockets.connected[gId];
                clientSocket.handshake.session.conference_id = conference_id;
                clientSocket.handshake.session.guest_status = 'ringing';
                clientSocket.handshake.session.join_who = 'initiator';
                clientSocket.handshake.session.save();
            }
            callback(true);
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }

};
var conf_updateSocket = (old_sid, new_socket, callback) => {
    // let userSession = userRegister.getById(old_sid);
    // if (userSession) {
    //   userSession.updateSocket(new_socket);
    //   callback(new_socket.id);
    // } else {
    //   callback(false);
    // }

};

var getAllUsers = (callback) => {
    models.instance.Users.find({ is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, users) {
        if (err) {
            callback({ status: false, err: err });
        } else {
            callback({ status: true, users: users });
        }
    });
};

function get_call_user_role(is_login, room, participants_admin, user_id) {
    var admin_exists = [];
    var call_running = false;
    if (room) {
        call_running = true;
        for (let i in room.participants) {
            if (room.participants.hasOwnProperty(i)) {
                if (room.participants[i].user_role == 'moderator') {
                    admin_exists.push(i);
                }
            }
        }
    }
    var is_admin = _.includes(participants_admin, user_id);
    if (is_login) {
        if (is_admin == true) {
            var user_role = 'moderator';
        } else {
            if (admin_exists.length > 0) {
                var user_role = 'participant';
            } else {
                var user_role = 'moderator';
            }
        }
    } else {
        var user_role = 'guest';
    }
    return { user_role: user_role, call_running: call_running };

}

function import2RedisDB() {

}

module.exports = {
    getEndpointForUser,
    addIceCandidateClient,
    getKurentoClient,
    getKurentoClientByIP,
    leaveRoomConfbyId,
    getRoomMemberCount,
    receiveVideoFrom,
    getUserSession,
    joinConf,
    getRoomConf,
    getRoomConfByIP,
    getRoomInfo,
    getRoomInfoUser,
    getUserBusybyCID,
    getRoomUserSession,
    joinRoomConf,
    call_msgUpdate,
    sendCallMsg,
    getUserIsBusy,
    get_msgid_info,
    get_convid_info,
    get_running_calls,
    set_ringingData,
    get_ringingData,
    del_ringingData,
    add_ringingData,
    set_callingData,
    get_callingData,
    del_callingData,
    add_callingData,

    getGuestStatus,
    setGuestSession,
    setUserConference,
    conf_updateSocket,
    getUserSessionByUid,
    getUserSessionByName,
    getAllUsers,
    set_busyData,
    get_busyData,
    get_busyTimer,
    del_busyData,
    get_call_user_role,
    call_stats_stop,
    set_userlistData,
    get_userlistData,
    add_userlistData,
    del_userlistData,
    clean_call_user,
    clean_timer_ring,
    ringingState_push,
    ringingState_pull,
    ringingState_get,
    send_call_ringing,
    send_socket_support,
    getPushSubscription,
    savePushSubscription,
    del_kurentoroom,
    kurento_update_session,
    kurento_get_session,
    kurento_set_session,
    get_kurentoroom,
    del_user_buffer,
    get_user_buffer,
    sendMessage,
    clear_user_buffer,
    get_new_id,
    import2RedisDB,
    kurento_alluserdata_set,
    kurento_alluserdata_get,
    msgdb_alluser
};

// const NodeMediaServer = require('node-media-server').NodeMediaServer;
// const rtmp_server_config = {
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 60,
//     ping_timeout: 30
//   },
//   http: {
//     port: 8000,
//     allow_origin: '*'
//   }
// };
// var nms = new NodeMediaServer(rtmp_server_config);
// nms.run();
// var { argvConf } = require('../libav');