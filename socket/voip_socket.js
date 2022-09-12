var path = require('path');
// var chokidar = require('chokidar');
var path = require('path');
var redis = require('redis');
var rejson = require('redis-rejson');
const redisearch = require('redis-redisearch');
redisearch(redis);
rejson(redis);
// redredisearch = require('redredisearch');
var scripto = require('redis-scripto');
var redis_modules_sdk = require('redis-modules-sdk');
const { promisify } = require('util');
const redisScan = require('node-redis-scan');
var scriptDir = path.join(global.__basedir, 'lua');
redis_client = false;
redis_client_connected = false;
redis_client2 = false;
redis_client_connected2 = false;

if (process.env.redis_port && process.env.redis_ip && process.env.BASE_URL) {
    redis_client = redis.createClient(process.env.redis_port, process.env.redis_ip);
    // redis_client2 = redis.createClient(process.env.redis_port2, process.env.redis_ip2);

    redis_script_manager = new scripto(redis_client);
    redis_script_manager.loadFromDir(scriptDir);
    // redis_script_manager2 = new scripto(redis_client2); redis_script_manager2.loadFromDir(scriptDir);
    let redis_flush = false;
    if (process.env.BASE_URL && process.env.BASE_URL.includes("freeli")) {
        redis_flush = true;
    }
    if (redis_flush) {
        redis_client.flushall(async function(err, succeeded) {
            console.log('flushall', succeeded); // will be true if successfull
        });
        // redis_client2.flushall(async function (err, succeeded) {
        // 	console.log('flushall', succeeded); // will be true if successfull
        // });
    }

    redis_client.on('connect', function() {
        redis_client_connected = true;
        console.log('Redis client connected');
    });

    redis_client.on('error', function(err) {
        console.log('redis went error ' + err);
    });
    redis_client.on('reconnecting', function(err) {
        console.log('redis went reconnecting ');
    });
    redis_client.on('ready', function(err) {
        console.log('redis went ready ');
    });
}
// }
// var fetch = require("node-fetch");

// scanAll = async (pattern) => {
// 	const found = [];
// 	let cursor = '0';

// 	do {
// 		const reply = await scan(cursor, 'MATCH', pattern);

// 		cursor = reply[0];
// 		found.push(...reply[1]);
// 	} while (cursor !== '0');

// 	return found;
// }

var _ = require('lodash');
var { models } = require('./../config/db/express-cassandra');
var { getActiveUsers } = require('./../utils/chatuser');
// var watch = require('recursive-watch');
// const webpush = require('web-push'); //requiring the web-push module

// call_timer_user = {};
call_timer_self = {};
call_stats_user = {};
calltimer_ring = {};
call_timer_connect = {};
call_socket_store = {};
call_socket_user = {};
log = console.log;


CALL_RING_INTERVAL = 5000;
CALL_RING_TIME = 60000; // default: 60000
CALL_WAIT_TIME = 20000; // default: 60000
CALL_CLOSE_TIME = 30000; // default: 60000

module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var {

        replyId,
        get_one_msg,

    } = require('./../utils/message');

    var {
        getEndpointForUser,
        addIceCandidateClient,
        getKurentoClient,
        getKurentoClientByIP,
        leaveRoomConfbyId,
        receiveVideoFrom,
        getUserSession,
        joinConf,
        getRoomConf,
        getRoomInfo,
        getRoomInfoUser,
        getUserBusybyCID,
        getRoomUserSession,
        joinRoomConf,
        call_msgUpdate,
        getUserIsBusy,
        sendCallMsg,
        set_callingData,
        get_callingData,
        del_callingData,
        add_callingData,

        getGuestStatus,
        setGuestSession,
        setUserConference,
        conf_updateSocket,
        get_running_calls,
        get_msgid_info,
        get_convid_info,
        getUserSessionByUid,
        set_busyData,
        get_busyData,
        get_busyTimer,
        del_busyData,
        getRoomMemberCount,
        set_ringingData,
        get_ringingData,
        del_ringingData,
        add_ringingData,
        getAllUsers,
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
        del_kurentoroom,
        kurento_update_session,
        kurento_set_session,
        get_kurentoroom,
        del_user_buffer,
        get_user_buffer,
        sendMessage,
        clear_user_buffer,
        get_new_id,

    } = require('./../utils/voice_video');
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
                                timeToLive: 60 * 60 * 24,
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
                            // data2send["category"] = "VIEWORCANCEL";
                            let message = {
                                data: data2send
                            };

                            firebase_admin.messaging().sendToDevice(user.fcm_id.includes('@@@') ? user.fcm_id.split('@@@')[1] : user.fcm_id, message, options)
                                .then(function(response) {
                                    // console.log("========> Firebase:Ok:", message.data.fcm_type, response);
                                })
                                .catch(function(error) {
                                    console.trace("========> Firebase:Error:", message, error);
                                });
                            // }
                        }
                    }
                });

            }

        }
    }

    var {
        getAllConversation,
        getAllMsg,
        set_status,
        getAllpinUnpinList
    } = require('./../utils/android');

    const isEmpty = require('../validation/is-empty');

    function checkThisIdActiveOrNot(array, myid) {
        if (array == null) {
            return true;
        } else if (array.indexOf(myid) > -1) {
            return false;
        } else {
            return true;
        }
    }

    // var fsTimeout1; var fsTimeout2;
    // watch('./public', function (filename) {
    // 	restart_time = Date.now();
    // 	// console.log('something changed with:1:', filename, restart_time);
    // 	if (!fsTimeout1) {
    // 		console.log('something changed with:1:', filename, restart_time);
    // 		fsTimeout1 = setTimeout(function () { fsTimeout1 = null }, 100);
    // 		io.emit('service_worker_change', {
    // 			filename: filename,
    // 			restart_time: restart_time
    // 		});
    // 		// if (user_subs) {
    // 		// 	// Create payload
    // 		// 	const payload = JSON.stringify({ title: "Push Test" });
    // 		// 	// Pass object into sendNotification
    // 		// 	webpush.sendNotification(user_subs, payload).catch(err => console.error(err));
    // 		// }

    // 	}

    // });

    // watch('./views', function (filename) {
    // 	restart_time = Date.now();

    // 	if (!fsTimeout2) {

    // 		fsTimeout2 = setTimeout(function () { fsTimeout2 = null }, 100);

    // 		io.emit('service_worker_change', {
    // 			filename: filename,
    // 			restart_time: restart_time
    // 		});
    // 	}
    // });
    var filesToCache = [
            './public/stylesheets/mob_style.css',
            './public/stylesheets/style_basic_connect.css',
            './public/stylesheets/pluginCss/OverlayScrollbars.css',
            './public/stylesheets/style-login.css',
            './public/stylesheets/pluginCss/hover.css',
            './public/stylesheets/jquery-ui.css',
            './public/stylesheets/conf/index.css',
            './public/stylesheets/style-call.css',
            './public/javascripts/plugins/FileSaver.js',
            './public/stylesheets/toastr.min.css',
            './public/stylesheets/pluginCss/balloon.min.css',
            './public/stylesheets/pluginCss/select2.min.css',
            './public/stylesheets/pluginCss/os-theme-round-light.css',
            './public/javascripts/plugins/select2.min.js',
            './public/javascripts/conf_participants.js',
            './public/javascripts/socket-client-side.js',
            './public/javascripts/mob_connect_page.js',
            './public/javascripts/taphold.js',
            './public/javascripts/mob_custom.js',
            './public/javascripts/plugins/jquery-multidownload.js',
            './public/bower_components/adapter.js/adapter-latest.js',
            './public/bower_components/adapter.js/adapter.js',
            './public/bower_components/kurento-utils/js/kurento-utils.js',
            './public/javascripts/conf_index.js',
            './public/javascripts/localstorage_fun.js',
            './public/javascripts/plugins/JSzip.js',
            './public/javascripts/plugins/jszip-utils.js',
            './public/javascripts/basic_connect.js',
            './public/javascripts/jquery-confirm/jquery-confirm.min.css',
            './public/javascripts/jquery-confirm/jquery-confirm.min.js',
            './public/javascripts/socket-calling.js',
            './public/javascripts/plugins/OverlayScrollbars.js',
            './public/javascripts/jQuery/jquery-ui.min.js',
            './public/javascripts/fontawesome-all.js',
            './public/javascripts/jQuery/jquery-3.3.1.min.js',
            './public/javascripts/lodash.js',
            './public/javascripts/moment.js',
            './public/javascripts/moment-timer.js',
            './public/javascripts/moment-timezone-with-data.js',
            './public/javascripts/tooltipster.bundle.min.js',
            './public/javascripts/jquery.highlight.js',
            './public/javascripts/toastr.min.js',
            './public/javascripts/masonry.pkgd.min.js',
            './public/javascripts/canvasjs.min.js',
            './public/javascripts/validate.min.js',
            './public/javascripts/plugins/clipboard.min.js',
            './public/stylesheets/jquery.mobile-1.4.5.min.css',
            './public/javascripts/jQuery/jquery.mobile-1.4.5.js',
            './public/javascripts/bootstrap.min.js',
            './public/images/workfreeli_final_logo.png',
            './public/images/forward_32.svg',
            './public/javascripts/plugins/socket.io.js',
            './public/stylesheets/style-basic.css',
            './public/stylesheets/responsive_basic.css',
            './public/stylesheets/pluginCss/flatpickr.min.css',
            './public/push.js',
            './public/javascripts/Activity.js',
            './public/stylesheets/fonts/haven-fonts.css',
            './public/stylesheets/fonts/fontawesome-all.css',
            './public/stylesheets/style-popup.css',
            './public/javascripts/socket_basic_connect.js',
            './public/javascripts/basic_connect_f_d.js',
            './public/javascripts/timepicki.js',
            './public/javascripts/plugins/in-view.min.js',
            './public/javascripts/plugins/jquery.panzoom.js',
            './public/images/basicAssets/close_button-white.svg',
            './public/images/basicAssets/custom_thread_for_reply-white.svg',
            './public/images/basicAssets/Top_Nav_Bell.svg',
            './public/images/basicAssets/video_call_for_profile.svg',
            './public/images/basicAssets/voice_call_for_profile.svg',
            './public/images/basicAssets/Down_Chevron.svg',
            './public/images/basicAssets/Settings.svg',
            './public/images/basicAssets/conv-i-new-bb.png',
            './public/images/basicAssets/search_bar_thread_ico.svg',
            './public/images/basicAssets/active_thread_searchbar_ico.svg',
            './public/images/basicAssets/backiconSidebar.svg',
            './public/images/basicAssets/plusiconSidebar.svg',
            './public/images/basicAssets/Users.svg',
            './public/images/basicAssets/CalendarChevronRight.svg',
            './public/images/loader.gif',
            './public/images/users/nayeem.jpg',
            './public/images/basicAssets/BackArrow.svg',
            './public/images/basicAssets/close_button.svg',
            './public/images/loading-icon-red.gif',
            './public/images/emojiPacks/hv1.svg',
            './public/images/emojiPacks/hv2.svg',
            './public/images/emojiPacks/hv3.svg',
            './public/images/emojiPacks/hv4.svg',
            './public/images/emojiPacks/hv5.svg',
            './public/images/emojiPacks/hv6.svg',
            './public/images/emojiPacks/hv7.svg',
            './public/images/emojiPacks/hv8.svg',
            './public/images/emojiPacks/hv9.svg',
            './public/images/emojiPacks/hv10.svg',
            './public/images/emojiPacks/hv11.svg',
            './public/images/emojiPacks/hv12.svg',
            './public/images/emojiPacks/hv13.svg',
            './public/images/basicAssets/prevThreadicon.svg',
            './public/images/basicAssets/nextThreadicon.svg',
            './public/images/users/joni.jpg',
            './public/images/basic_view/form-sent-successfully.gif',
            './public/images/basic_view/credit_cards.png',
            './public/images/basic_view/paypal.png',
            './public/images/basic_view/tooltip-question-mark.png',
            './public/stylesheets/fonts/mem8YaGs126MiZpBA-UFVZ0b.woff2',
            './public/stylesheets/fonts/SFProText-Regular.woff2',
            './public/images/basicAssets/activeSvg/newMessageHovAc.svg',
            './public/images/basicAssets/NotFlagged.svg',
            './public/images/basicAssets/search_icon_for_todo_chat.svg',
            './public/images/basicAssets/zmdidot-circle.svg',
            './public/images/basicAssets/zmdidot-offline.svg',
            './public/images/basicAssets/PrivateLock.svg',
            './public/images/basicAssets/inactiveSvg/time-circle-plus.svg',
            './public/images/flaticon/support.svg',
            './public/images/basicAssets/PublicHash.svg',
            './public/images/basicAssets/PrivateLockRed.svg',
            './public/images/basicAssets/OnlineStatus.svg',
            './public/images/basicAssets/custom_not_pin.svg',
            './public/images/basicAssets/MoreMenu.svg',
            './public/images/basicAssets/hayven_checked.svg',
            './public/images/basicAssets/Attach.svg',
            './public/images/basicAssets/AddEmoji_White.svg',
            './public/images/basicAssets/circle_up_arrow.svg',
            './public/stylesheets/webfonts/fa-solid-900.woff2',
            './public/images/basic_view/30_days_green.png',
            './public/images/basic_view/secure-shape.svg',
            './public/javascripts/custom-basic.js',
            './public/javascripts/responsive_basic.js',
            './public/javascripts/plugins/jquery.fileDownload.js',
            './public/javascripts/plugins/download.js',
            './public/ringtones/short_tone.mp3',
            './public/ringtones/simple_corporate_tone.mp3',
            './public/images/basicAssets/times-circle-regular_black.svg',
            './public/images/basicAssets/loading_msg.gif',
            './public/images/basicAssets/custom_voice_call.svg',
            './public/images/basicAssets/custom_video_call.svg',
            './public/images/basicAssets/custom_pinned.svg',
            './public/images/basicAssets/custom_thread_for_reply.svg',
            './public/images/basicAssets/custom_thread_for_reply_red.svg',
            './public/images/basicAssets/custom_rightChevron_for_reply.svg',
            './public/images/basicAssets/custom_rightChevron_for_reply_red.svg',
            './public/images/basicAssets/voice_call_for_active.svg',
            './public/images/basicAssets/video_call_for_active.svg',
            './public/images/basicAssets/inactiveSvg/call_forward.svg',
            './public/images/basicAssets/inactiveSvg/clearMsgIn.svg',
            './public/images/call/close-call.svg',
            './public/images/call/MoreMenu.svg',
            './public/images/call/add-contact_48px.svg',
            './public/images/call/screen-share-on_48px.svg',
            './public/images/call/message_56px.svg',
            './public/images/call/raise-hand.svg',
            './public/images/call/hang-up_56px.svg',
            './public/images/call/icon-down-arrow.svg',
            './public/images/basicAssets/thread.svg',
            './public/videos/black_new.mp4',
            './public/images/call/switch_video_48px.svg',
            './public/images/call/microphone-solid.svg',
            './public/images/call/video-off_48px_red.svg',
            './public/images/call/mute-speaker-client.svg',
            './public/images/call/mute-video-client.svg',
            './public/images/call/mute-screen-client.svg',
            './public/images/call/mute-speaker-server.svg',
            './public/images/call/black-background.jpg',
            './public/images/basicAssets/green_voice_call.svg',
            './public/images/basicAssets/custom_call_join.svg',
            './public/images/call/mute-off_48px_red.svg',
            './public/images/call/ellipsis_v.svg',
            './public/images/call/speaker-on_56px.svg',
            './public/images/call/video-on_48px.svg',
            './public/images/call/screen-share-off_48px.svg',
            './public/images/call/webcam-max.svg',
            './public/images/call/fullscreen-show.svg'

        ]
        // const watcher = chokidar.watch(filesToCache);
        // watcher.on('change', function (path, stats) {
        // 	restart_time = Date.now();
        // 	if (stats) console.log('__File:', path, 'changed size to', stats.size);
        // 	// if(stats.size){
        // 		io.emit('service_worker_change', {
        // 			filename: path,
        // 			restart_time: restart_time
        // 		});
        // 	// }

    // });

    // const watcher = chokidar.watch([
    // 	'./views',
    // 	path.join(__basedir, 'public', '/stylesheets/'),
    // 	path.join(__basedir, 'public', '/javascripts/'),
    // 	path.join(__basedir, 'public', '/images/basicAssets/'),
    // 	path.join(__basedir, 'public', '/images/emojiPacks/'),
    // 	path.join(__basedir, 'public', '/bower_components/'),
    // 	path.join(__basedir, 'public', '/images/call/'),
    // 	path.join(__basedir, 'public', '/images/basic_view/'),

    // 	// path.join(__basedir, 'public', '/images/workfreeli_final_logo.png'),
    // 	// path.join(__basedir, 'public', '/images/forward_32.svg'),
    // 	// path.join(__basedir, 'public', '/push.js'),
    // 	// path.join(__basedir, 'public', '/images/loading-icon-red.gif'),
    // 	// path.join(__basedir, 'public', '/images/loader.gif'),
    // 	// path.join(__basedir, 'public', '/images/users/nayeem.jpg'),
    // 	// path.join(__basedir, 'public', '/images/users/joni.jpg'),
    // 	// path.join(__basedir, 'public', '/images/flaticon/support.svg'),
    // 	// path.join(__basedir, 'public', '/ringtones/short_tone.mp3'),
    // 	// path.join(__basedir, 'public', '/ringtones/simple_corporate_tone.mp3'),
    // 	// path.join(__basedir, 'public', '/videos/black_new.mp4'),

    // 	// path.join(__basedir, 'public', '/javascripts/plugins/socket.io.js'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style-basic.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/responsive_basic.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/pluginCss/flatpickr.min.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/mob_style.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style_basic_connect.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/pluginCss/OverlayScrollbars.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style-login.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style-login.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/jquery-ui.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/conf/index.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style-call.css'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/FileSaver.js'),
    // 	// path.join(__basedir, 'public', '/stylesheets/toastr.min.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/pluginCss/balloon.min.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/pluginCss/select2.min.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/pluginCss/os-theme-round-light.css'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/select2.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/conf_participants.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/socket-client-side.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/mob_connect_page.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/taphold.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/mob_custom.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/jquery-multidownload.js'),
    // 	// path.join(__basedir, 'public', '/bower_components/adapter.js/adapter.js'),
    // 	// path.join(__basedir, 'public', '/bower_components/kurento-utils/js/kurento-utils.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/localstorage_fun.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/JSzip.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/jszip-utils.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/basic_connect.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/jquery-confirm/jquery-confirm.min.css'),
    // 	// path.join(__basedir, 'public', '/javascripts/jquery-confirm/jquery-confirm.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/socket-calling.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/OverlayScrollbars.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/jQuery/jquery-ui.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/fontawesome-all.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/jQuery/jquery-3.3.1.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/lodash.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/moment.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/moment-timer.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/moment-timezone-with-data.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/tooltipster.bundle.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/jquery.highlight.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/toastr.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/masonry.pkgd.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/canvasjs.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/validate.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/clipboard.min.js'),
    // 	// path.join(__basedir, 'public', '/stylesheets/jquery.mobile-1.4.5.min.css'),
    // 	// path.join(__basedir, 'public', '/javascripts/jQuery/jquery.mobile-1.4.5.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/bootstrap.min.js'),

    // 	// path.join(__basedir, 'public', '/javascripts/Activity.js'),
    // 	// path.join(__basedir, 'public', '/stylesheets/fonts/haven-fonts.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/fonts/fontawesome-all.css'),
    // 	// path.join(__basedir, 'public', '/stylesheets/style-popup.css'),
    // 	// path.join(__basedir, 'public', '/javascripts/socket_basic_connect.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/basic_connect_f_d.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/timepicki.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/in-view.min.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/jquery.panzoom.js'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/close_button-white.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/custom_thread_for_reply-white.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/Top_Nav_Bell.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/video_call_for_profile.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/voice_call_for_profile.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/Down_Chevron.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/Settings.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/conv-i-new-bb.png'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/search_bar_thread_ico.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/active_thread_searchbar_ico.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/backiconSidebar.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/plusiconSidebar.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/Users.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/CalendarChevronRight.svg'),

    // 	// path.join(__basedir, 'public', '/images/basicAssets/BackArrow.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/close_button.svg'),


    // 	// path.join(__basedir, 'public', '/images/basicAssets/prevThreadicon.svg'),
    // 	// path.join(__basedir, 'public', '/images/basicAssets/nextThreadicon.svg'),

    // 	// path.join(__basedir, 'public', '/images/basic_view/form-sent-successfully.gif'),
    // 	// path.join(__basedir, 'public', '/images/basic_view/credit_cards.png'),
    // 	// path.join(__basedir, 'public', '/images/basic_view/paypal.png'),
    // 	// path.join(__basedir, 'public', '/images/basic_view/tooltip-question-mark.png'),
    // 	// path.join(__basedir, 'public', '/stylesheets/fonts/mem8YaGs126MiZpBA-UFVZ0b.woff2'),
    // 	// path.join(__basedir, 'public', '/stylesheets/fonts/SFProText-Regular.woff2'),
    // 	// path.join(__basedir, 'public', '/stylesheets/fonts/SFProText-Regular.woff2'),


    // 	// path.join(__basedir, 'public', '/stylesheets/webfonts/fa-solid-900.woff2'),
    // 	// path.join(__basedir, 'public', '/images/basic_view/'),
    // 	// path.join(__basedir, 'public', '/javascripts/custom-basic.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/responsive_basic.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/jquery.fileDownload.js'),
    // 	// path.join(__basedir, 'public', '/javascripts/plugins/download.js'),

    // ]);



    io.on('connection', function(socket) { // ccc
        console.log('voipxyz:connnnnnnnnect');


        socket.on('login_call', async function(userdata, callback) {
            console.log('socket_call:connect:' + userdata.from + ':' + socket.id);
            socket.join(userdata.from + '_call');
            call_socket_store[socket.id] = userdata;
            call_socket_user[userdata.from] = socket.id;
            let call_data = await get_callingData(userdata.from);
            if (call_data && call_data.kurento_status != 'leave') {
                await set_busyData(userdata.from, userdata.conversation_id); // without timer
                callback(true);
            } else {
                callback(false);
            }

        });
        socket.on('disconnect', async function(reason) {
            if (call_socket_store[socket.id]) {
                var userdata = call_socket_store[socket.id];
                // let call_data = await get_callingData(userdata.from);
                await del_busyData(userdata.from);
                console.log('socket_call:disconnect:' + userdata.from + ':' + reason);
                delete call_socket_store[socket.id];
                delete call_socket_user[userdata.from];
            }
        });
        async function cleanEmptyCallRoom(data, io, socket) {
            if (data.user_role == 'guest' && socket.handshake.session.guest_status != 'ringing') return;
            var ring_data = await get_ringingData(data.conversation_id);

            if (ring_data && ring_data.finish_flag == false) {
                await set_ringingData(data.conversation_id, { 'finish_flag': true });
                let ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    console.log('__status:finish = cleanEmptyCallRoom:' + ulist.length);
                    for (let v of ulist) {
                        await clean_call_user(v, data, io, socket);
                    };
                }
                var ring_state = await ringingState_get(data.conversation_id);
                if (ring_state) {
                    for (let v of ring_state) {
                        await clean_timer_ring(io, v, data.conversation_id);
                    };
                }
            }
        }

        async function msgdb_p2(data) {
            return new Promise((resolve, reject) => {
                models.instance.Users.findOne({ id: models.uuidFromString(data.user_id) }, { raw: true, allow_filtering: true }, function(err, info_user) {
                    if (err) { reject(err); } else {
                        if (info_user.conference_id == null) {
                            var newid = models.timeuuid().toString() + '_personal';
                            var update_values_object = { conference_id: newid };
                            models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, update_values_object, update_if_exists, function(err) {
                                if (err) { reject(err); } else {
                                    resolve({
                                        conference_id: newid,
                                        participants_admin: [data.user_id]
                                    });
                                }
                            });
                        } else {
                            resolve({
                                conference_id: info_user.conference_id,
                                participants_admin: [data.user_id]
                            });
                        }
                    }
                });
            });

        }
        async function msgdb_p3(data) {
            return new Promise((resolve, reject) => {
                get_convid_info(data.conversation_id, (convid_info) => {
                    if (convid_info) {
                        if (convid_info.conference_id == null) {
                            var query_object = {
                                conversation_id: models.uuidFromString(data.conversation_id),
                                company_id: models.timeuuidFromString(userCompany_id[data.user_id])
                            };
                            var newid = models.timeuuid().toString() + '_group';
                            var update_values_object = { conference_id: newid };
                            models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err) {
                                if (err) { reject(err); } else {
                                    resolve({
                                        conference_id: newid,
                                        participants_admin: convid_info.participants_admin
                                    });
                                }
                            });
                        } else {
                            resolve({
                                conference_id: convid_info.conference_id,
                                participants_admin: convid_info.participants_admin
                            });
                        }
                    } else {
                        reject(null);
                    }
                });
            });

        }
        async function msgdb_p4(data) {
            return new Promise((resolve, reject) => {
                if (data.conversation_id) {
                    models.instance.Conversation.findOne({ conversation_id: models.uuidFromString(data.conversation_id.toString()) }, function(err, conversation) {
                        if (err) { reject([]); } else {
                            if (conversation) {
                                resolve(conversation.participants);
                            } else { reject([]); }
                        }
                    });

                }

            });

        }
        socket.on('call_send_msgdb', async function(data, callback) {
            try {
                if (typeof data.arr_participants === 'string' && data.arr_participants != "false") data.arr_participants = JSON.parse(data.arr_participants);
                if (typeof data.participants_all === 'string' && data.participants_all != "false") data.participants_all = JSON.parse(data.participants_all);
                if (typeof data.participants_admin === 'string' && data.participants_admin != "false") data.participants_admin = JSON.parse(data.participants_admin);
                if (typeof data.call_option === 'undefined') data.call_option = 'ring';
                if (data.call_option == 'window') data.arr_participants = [data.user_id];
                if (data.conversation_id == 0) data.conversation_id = get_new_id();
                data.conversation_list = [data.conversation_id];
                data.ipaddr = socket.handshake.address;
                data.initiatorid = data.user_id;
                data.init_id = data.user_id;
                data.name = data.user_id;
                data.rootId = data.user_id;
                data.initiator_name = data.sender_name;
                data.user_fullname = data.sender_name;
                data.rootFullname = data.sender_name;
                data.partner_id = data.room_id;
                data.conversation_type = data.conversation_type.toLowerCase();
                data.conversation_init = data.conversation_type.toLowerCase();
                data.rootImg = data.sender_img;
                data.call_type_route = data.set_calltype;
                data.reloadstatus = 'newconf';
                data.isRefresh = 'no';
                data.reg_status = 'webcam';
                data.callwaiting = 'no';
                data.msg_body = data.set_calltype;
                data.msgid = '0';
                data.msgid_list = [];
                data.accept_list = [];
                data.msg_info = false;
                data.reply_info = false;
                data.repid = '0';
                data.start_flag = false;
                data.msg_flag = false;
                data.ring_need = true;
                data.end_flag = false; // cassandra update flag
                data.finish_flag = false; // no member left
                data.pipeline_flag = false;
                data.database_flag = false;
                data.ring_type = 'new';
                data.hangup_id = data.user_id;
                data.hangup_name = data.user_fullname;
                data.call_start_time = 0;
                data.kurentoIP = '0';
                data.usersOnline = [];
                for (const v of data.arr_participants) {
                    if (io.sockets.adapter.rooms.hasOwnProperty(v)) {
                        var ss = io.sockets.adapter.rooms[v].sockets;
                        if (Object.keys(ss).length > 0) {
                            var bb1 = (await get_busyData(v)).status;
                            var bb2 = get_busyTimer(v);
                            if (bb1 == false || bb2 == false) data.usersOnline.push(v);
                        }
                    }
                };
                if (data.usersOnline.length > 1 || (data.usersOnline.length == 1 && data.call_option == "window")) {
                    // data.allUserdata = await msgdb_alluser(); 
                    // conference_id + participants_admin
                    if (data.conversation_init == 'personal') {
                        if (!data.conference_id || data.conference_id == "false") {
                            let p2data = await msgdb_p2(data);
                            data.conference_id = p2data.conference_id;
                            data.participants_admin = p2data.participants_admin;
                        }
                    } else if (data.conversation_init == 'group') {
                        if (!data.conference_id || data.conference_id == "false") {
                            let p3data = await msgdb_p3(data);
                            data.conference_id = p3data.conference_id;
                            data.participants_admin = p3data.participants_admin;
                        }
                    }
                    // participants_all
                    if (!data.participants_all && data.participants_all == "false") {
                        if (data.conversation_id == data.user_id) data.participants_all = [data.user_id];
                        else {
                            data.participants_all = await msgdb_p4(data);
                        }
                    }
                    data.ring_status = "true";
                    // _______ redis : ____________________________________________________________
                    await del_ringingData(data.conversation_id);
                    await set_ringingData(data.conversation_id, data); // new
                    await set_userlistData(data.conversation_id, data.arr_participants); // new
                    data.call_url = '/call/sender/' + data.user_id + '/' + data.conversation_id;
                    setUserConference(io, data.user_id, data.conference_id, (status) => {});
                    callback(data);

                } else {
                    data.ring_status = "false";
                    data.err_status = "offline";
                    callback(data);
                }
            } catch (error) {
                data.ring_status = "false";
                data.err_status = "promise";
                data.err_obj = error;
                callback(data);
            }
        });

        // -----------------------------------------------------------------------------
        // var partner_busy = false;
        // if (data.callRingBtn == 'call' && data.conversation_type.toLowerCase() != 'guest') {
        // 	var ulist = await get_userlistData(data.conversation_id);
        // 	if (ulist) {
        // 		for (const v of ulist) {
        // 			if (data.user_id != v) {
        // 				if (await get_busyData(v) || get_busyTimer(v)) {
        // 					partner_busy = true;
        // 				}
        // 			}
        // 		};
        // 	}
        // }
        // if (partner_busy == false && get_busyTimer(data.user_id) == false) {
        // ----------------------------------------------------------------------------
        socket.on('message_voip', async(data, callback) => {
            // console.log('voipxyz:on_message_voip:' + data.id + ':'+data.user_id+':'+socket.id);
            var call_data = await get_callingData(data.user_id);
            switch (data.id) {
                case 'joinRoom':
                    var ring_data = await get_ringingData(data.conversation_id);
                    if (ring_data) {
                        new Promise((resolve, reject) => {
                            if (ring_data && ring_data.kurentoIP == "0") {
                                getKurentoClient(async(error, kurentoClient, kurentoIP) => {
                                    if (error) {
                                        callback({ status: false, reason: error });
                                        reject();
                                    } else {
                                        await set_ringingData(data.conversation_id, { 'kurentoIP': kurentoIP });
                                        resolve({ kurentoClient: kurentoClient, kurentoIP: kurentoIP });
                                    }
                                });
                            } else {
                                getKurentoClientByIP(ring_data.kurentoIP, (error, kurentoClient, kurentoIP) => {
                                    if (error) {
                                        callback({ status: false, reason: error });
                                        reject();
                                    } else {
                                        resolve({ kurentoClient: kurentoClient, kurentoIP: kurentoIP });
                                    }
                                });

                            }
                        }).then(async(pro_kurento) => {
                            pro_kurento.kurentoClient.getServerManager().then(async function(serverManager) {
                                serverManager.getInfo(function(dd, kurento_i) {
                                    console.log(kurento_i);
                                });
                                // serverManager.getCpuCount(function(dd,kurento_i){
                                // 	console.log(kurento_i);
                                // });
                                serverManager.getUsedCpu(100, async function(error, kurento_load) {
                                    console.log('kurento___cpu:' + pro_kurento.kurentoIP + ':' + kurento_load);
                                    var load_ok = true;
                                    if (kurento_load == undefined) load_ok = true;
                                    else {
                                        if (kurento_load < 80) load_ok = true;
                                        else load_ok = false;
                                    }

                                    if (load_ok) {
                                        if (call_data) {
                                            await set_callingData(data.user_id, { 'kurento_status': 'joining', 'user_status': 'joining', 'cleanup_needed': true });
                                            if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(data.arr_participants);
                                            if (ring_data && ring_data.finish_flag == false) {
                                                // *** promise start : cassandra (msgid+repid) + newmessage ********
                                                new Promise((resolve, reject) => {
                                                    if (ring_data.init_id == data.user_id && data.join_who != "guest" && ring_data.database_flag == false) { // initiator
                                                        sendCallMsg(ring_data.user_id, ring_data.sender_img, ring_data.sender_name, ring_data.conversation_id, ring_data.msg_body, '', ring_data.set_calltype, 0, ring_data.usersOnline, ring_data.conference_id, true, 'called', null, '', async(res_msg) => {
                                                            if (res_msg.status) {
                                                                data.msgid = String(res_msg.res);
                                                                ring_data.msgid_list.push(ring_data.conversation_id + ':' + data.msgid);
                                                                await set_ringingData(data.conversation_id, { 'msgid_list': ring_data.msgid_list });
                                                                replyId(data.msgid, data.conversation_id, async(res_rep, err) => {
                                                                    if (res_rep.status) {
                                                                        data.repid = String(res_rep.result);
                                                                        // add calling data (block) =================================
                                                                        await set_ringingData(data.conversation_id, {
                                                                            'msgid': data.msgid.toString(),
                                                                            'repid': data.repid.toString(),
                                                                            'database_flag': true
                                                                        });
                                                                        // socket: newmessage (non-block) ===============================================
                                                                        get_one_msg({ conversation_id: data.conversation_id, msg_id: data.msgid }, async(result, error) => {
                                                                            if (result.status) {
                                                                                result.msg.old_msgid = 0;
                                                                                if (result.msg.attch_imgfile == null) result.msg.attch_imgfile = [];
                                                                                if (result.msg.attch_audiofile == null) result.msg.attch_audiofile = [];
                                                                                if (result.msg.attch_videofile == null) result.msg.attch_videofile = [];
                                                                                if (result.msg.attch_otherfile == null) result.msg.attch_otherfile = [];
                                                                                var ring_data = await get_ringingData(data.conversation_id);
                                                                                result.ring_data = ring_data;
                                                                                result.conversation_type = ring_data.conversation_init == 'personal' ? 'single' : 'group';
                                                                                result.conversation_title = ring_data.convname;
                                                                                result.conversation_img = 'img.png';
                                                                                for (var n = 0; n < ring_data.participants_all.length; n++) {
                                                                                    await sendMessage(io, ring_data.participants_all[n], {
                                                                                        ackid: get_new_id(),
                                                                                        emitter: 'newMessageId',
                                                                                        emit_type: 'user',
                                                                                    }, data); // ok

                                                                                    io.to(ring_data.participants_all[n]).emit('newMessage', result);
                                                                                    // send_msg_firebase(ring_data.participants_all[n], result,'newMessage');
                                                                                    // await await sendMessage(io, ring_data.participants_all[n], {
                                                                                    // 	ackid: get_new_id(),
                                                                                    // 	emitter: 'newMessage',
                                                                                    // 	emit_type: 'user',
                                                                                    // }, result); // ok
                                                                                }
                                                                            } else {
                                                                                console.log(error);
                                                                            }
                                                                        });
                                                                        // newmessage end ================================================================
                                                                        resolve({
                                                                            msgid: data.msgid,
                                                                            repid: data.repid,
                                                                        });
                                                                    } else { reject(null); }
                                                                });
                                                            } else { reject(null); }
                                                        });
                                                    } else { // participants
                                                        resolve({
                                                            msgid: ring_data.msgid,
                                                            repid: ring_data.repid,
                                                        });
                                                    }
                                                }).then(async(values) => {
                                                    await set_busyData(data.user_id, data.conversation_id); // works for direct join
                                                    // start role change =========================================
                                                    var room = await get_kurentoroom(data.conversation_id);
                                                    if (room) var memcount = Object.keys(room.participants).length;
                                                    else var memcount = 0;
                                                    var user_role = get_call_user_role(socket.handshake.session.login, room, ring_data.participants_admin, data.user_id);
                                                    if (data.user_role != user_role.user_role) {
                                                        data.user_role = user_role.user_role;
                                                        io.emit('call_role_change', {
                                                            conference_id: ring_data.conference_id,
                                                            user_id: data.user_id,
                                                            new_role: data.user_role
                                                        });
                                                        // var ulist = await get_userlistData(data.conversation_id);
                                                        // if (ulist) {
                                                        // 	for (let v of ulist) {
                                                        // 		await sendMessage(io, v, {
                                                        // 			ackid: get_new_id(),
                                                        // 			emitter: 'call_role_change',
                                                        // 			emit_type: 'user',
                                                        // 		}, {
                                                        // 			conference_id: ring_data.conference_id,
                                                        // 			user_id: data.user_id,
                                                        // 			new_role: data.user_role
                                                        // 		});
                                                        // 	};
                                                        // }

                                                    }
                                                    // ############### start timer (sender(A)_receiver(A)) : 30 sec 
                                                    data.ring_index = data.conversation_id + '_' + data.user_id + '_' + data.user_id; // 
                                                    if (call_timer_self[data.ring_index]) { clearTimeout(call_timer_self[data.ring_index]) }
                                                    console.log('__status:timer:set = ' + data.ring_index);
                                                    call_timer_self[data.ring_index] = setTimeout(async() => { // ctu
                                                        if (typeof call_timer_self[data.ring_index] != 'undefined') {
                                                            delete call_timer_self[data.ring_index];
                                                            console.log('__status:timer:del = ' + data.ring_index);
                                                            var ring_data = await get_ringingData(data.conversation_id);
                                                            data.msg = 4;
                                                            data.hangup_id = data.user_id;
                                                            data.hangup_name = data.user_fullname;
                                                            if (ring_data.start_flag == true && ring_data.call_option != 'window') {
                                                                var room = await get_kurentoroom(data.conversation_id);
                                                                if (room) await clean_call_user(data.user_id, data, io, socket);
                                                                else cleanEmptyCallRoom(data, io, socket);
                                                            } else {
                                                                cleanEmptyCallRoom(data, io, socket);
                                                            }
                                                        }
                                                    }, 30000);
                                                    // }
                                                    callback({ status: true, reason: 'ok' });
                                                    // end timer ==================================================================
                                                    joinRoomConf(io, socket, data, memcount, pro_kurento.kurentoClient, pro_kurento.kurentoIP, async(err, roominfo, room_mem) => {
                                                        if (err) { // error handle
                                                            await set_callingData(data.user_id, { 'kurento_status': 'error' });
                                                            console.log('__status:kurento:err:' + err);
                                                            if (err == 'server down') { // server error


                                                            } else { // other error: leave
                                                                var ring_data = await get_ringingData(data.conversation_id);
                                                                data.msg = 4;
                                                                data.hangup_id = data.user_id;
                                                                data.hangup_name = data.user_fullname;
                                                                if (ring_data.start_flag == true && ring_data.call_option != 'window') {
                                                                    var room = await get_kurentoroom(data.conversation_id);
                                                                    if (!room) {
                                                                        cleanEmptyCallRoom(data, io, socket);
                                                                    } else {
                                                                        await clean_call_user(data.user_id, data, io, socket);
                                                                    }
                                                                } else {
                                                                    cleanEmptyCallRoom(data, io, socket);
                                                                }

                                                            }
                                                        } // no error
                                                        else {
                                                            // join success =====================================================================
                                                            var ring_data = await get_ringingData(data.conversation_id);
                                                            var actual_admin = _.includes(ring_data.participants_admin, data.user_id);
                                                            if (actual_admin) { // role change
                                                                for (let i in roominfo.participants) {
                                                                    var is_admin = _.includes(ring_data.participants_admin, i);
                                                                    if (is_admin == false) {
                                                                        if (roominfo.participants[i].user_role == 'moderator') {
                                                                            roominfo.participants[i].user_role = 'participant';
                                                                            io.emit('call_role_change', {
                                                                                conference_id: ring_data.conference_id,
                                                                                user_id: roominfo.participants[i].user_id,
                                                                                new_role: 'participant'
                                                                            });
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            await set_userlistData(data.conversation_id, [data.user_id]); // add
                                                            // ==== add user to ringdata
                                                            if (ring_data.participants_all.indexOf(data.user_id) === -1) ring_data.participants_all.push(data.user_id);
                                                            await set_ringingData(data.conversation_id, { 'participants_all': ring_data.participants_all });
                                                            // =========================
                                                        }
                                                    });
                                                }).catch(function(error) {
                                                    console.error('voip:error:join_promise:' + data.user_fullname + ':' + error);
                                                    callback({ status: false, reason: error });
                                                });
                                            } else {
                                                callback({ status: false, reason: 'error' });
                                            }
                                        } else {
                                            callback({ status: false, reason: 'error' });
                                        }
                                    } else {
                                        callback({ status: false, reason: 'load' });
                                    }
                                });
                                // serverManager.getCpuCount(async function (error, kurento_load2) {
                                // 	console.log(kurento_load2);
                                // });
                                // serverManager.getInfo(async function (error, kurento_load2) {
                                // 	console.log(kurento_load2);
                                // });
                                // serverManager.getUsedMemory(async function (error, kurento_ram) {
                                // 	console.log('kurento___ram:' + pro_kurento.kurentoIP + ':' + kurento_ram);
                                // });
                            });

                        });

                    } else {
                        await del_busyData(data.user_id);
                        callback({ status: false, reason: 'error' });
                    }


                    break;

                case 'leaveRoom':
                    if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(datadata.arr_participants);
                    var ring_data = await get_ringingData(data.conversation_id);
                    var call_data = await get_callingData(data.user_id);
                    if (call_data && call_data.cleanup_needed == true) {
                        await set_callingData(data.user_id, { 'cleanup_needed': false, 'user_status': 'leave' });
                        if (data.reloadstatus == 'endcall') { // hangup buttondata
                            data.hangup_id = data.user_id;
                            data.hangup_name = data.user_fullname;
                            var room = await get_kurentoroom(data.conversation_id);
                            if (!room) {
                                cleanEmptyCallRoom(data, io, socket);
                            } else {
                                if (data.user_role == 'moderator' && data.isChoice == 'finish') { // finish call
                                    cleanEmptyCallRoom(data, io, socket);
                                } else { // leave call
                                    if (data.user_role == 'moderator') {
                                        await clean_call_user(data.user_id, data, io, socket);
                                    } else {
                                        if (Object.keys(room.participants).length > 2) {
                                            await clean_call_user(data.user_id, data, io, socket);
                                        } else { // last 2 participants =========================
                                            if (ring_data.call_option == 'window') { // conf system
                                                await clean_call_user(data.user_id, data, io, socket);
                                            } else { // ring system
                                                if (data.conversation_init == 'personal' && data.user_role != 'guest') {
                                                    cleanEmptyCallRoom(data, io, socket);
                                                } else { // group call
                                                    if (data.user_role == 'moderator') {
                                                        cleanEmptyCallRoom(data, io, socket);
                                                    } else {
                                                        await clean_call_user(data.user_id, data, io, socket);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (data.reloadstatus == 'refresh') { // browser unload
                            // if (data.cleanup_flag == true) {
                            var room = await get_kurentoroom(data.conversation_id);
                            data.hangup_id = data.user_id;
                            data.hangup_name = data.user_fullname;
                            var call_data = await get_callingData(data.user_id);
                            if (call_data && call_data.kurento_status != 'joining') { // during kurento join
                                if (!room) {
                                    cleanEmptyCallRoom(data, io, socket);
                                } else {
                                    var admin_count = 0;
                                    for (let i in room.participants) {
                                        if (room.participants[i].user_role == 'moderator') admin_count++;
                                    }
                                    if (data.user_role == 'moderator' && admin_count < 2) {
                                        cleanEmptyCallRoom(data, io, socket);
                                    } else {
                                        if (data.user_role == 'moderator') {
                                            await clean_call_user(data.user_id, data, io, socket);
                                        } else {
                                            if (Object.keys(room.participants).length > 2) {
                                                await clean_call_user(data.user_id, data, io, socket);
                                            } else { // last 2 participants ==========================
                                                if (ring_data.call_option == 'window') { // conf system
                                                    await clean_call_user(data.user_id, data, io, socket);
                                                } else { // ring system
                                                    if (data.conversation_init == 'personal' && data.user_role != 'guest') {
                                                        cleanEmptyCallRoom(data, io, socket);
                                                    } else { // group call
                                                        if (data.user_role == 'moderator') {
                                                            cleanEmptyCallRoom(data, io, socket);
                                                        } else {
                                                            await clean_call_user(data.user_id, data, io, socket);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // }
                        }
                        callback({ status: true, reason: 'ok' });
                    } else {
                        callback({ status: false, reason: 'error' });
                        // await add_callingData(data.user_id, 'close_needed', true);
                        await sendMessage(io, data.user_id, {
                            ackid: get_new_id(),
                            emitter: 'android_call_end',
                            emit_type: 'user',
                        }, data);
                        send_msg_firebase(data.user_id, data, 'android_call_end', call_data);
                    }

                    break;

                case 'receiveVideoFrom':
                    await receiveVideoFrom(io, socket, data.user_id, data.sender, data.sdpOffer, data.conversation_id, callback);
                    break;

                case 'onIceCandidate':
                    addIceCandidateClient(socket, data, (error) => { // app
                        if (error) {
                            console.error(error);
                            callback({ status: false, reason: 'error' });
                        } else {
                            // console.log('voip:success_IceCandidate:' + data.user_id + ':' + socket.id);
                            callback({ status: true, reason: 'ok' });
                        }
                    });

                    break;
                default:
                    socket.emit({ id: 'error', msg: `Invalid message ${data}` });
                    callback({ status: false, reason: 'error' });
            }
        });

        socket.on('get_isbusy_conf', async function(data, callback) {
            if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(data.arr_participants);
            var partner_busy = false,
                personal_join = false,
                partner_room = false;
            if (data.conversation_type.toLowerCase() == 'personal') {
                if (data.arr_participants.length > 1) {
                    for (const v of data.arr_participants) {
                        if (data.sender_id != v) {
                            // ___________ 1.1. partner busy check ________________________________________
                            let bb1 = await get_busyData(v);
                            let bb2 = get_busyTimer(v);
                            partner_busy = (bb1.status || bb2);
                            if (bb1.status) {
                                partner_room = await get_ringingData(bb1.conversation_id);
                                if (partner_room.conversation_list.indexOf(data.conversation_id) !== -1) {
                                    data.conversation_id = bb1.conversation_id;
                                    personal_join = true;
                                }
                            }

                            // ____________ 1.2. window calling check _______________________________
                            let receiver_session = await get_kurentoroom(v);
                            if (receiver_session) {
                                var ring_data = await get_ringingData(receiver_session.name);
                                if (ring_data.call_option == 'window' && ring_data.conversation_init == 'personal') {
                                    if (ring_data.init_id == v) {
                                        data.conversation_id = receiver_session.name;
                                        personal_join = true;
                                    }
                                }
                            }
                        }
                    };
                }
            }
            // ________________ 2. timeout check for all _______________________________
            var conf_timeout = false;
            for (const v of data.arr_participants) {
                if (get_busyTimer(v) == true) conf_timeout = true; // ?? break
            };
            // ________________ 3.caller recover ___________________________________________________________
            let caller_data = await get_callingData(data.sender_id);
            if (caller_data && caller_data.kurento_status == 'error') {
                console.log('__status:recover =');
                await del_busyData(data.sender_id);
                // await clean_timer_user(data.sender_id, data.conversation_id);
                await del_callingData(data.sender_id);
                await clear_user_buffer(data.sender_id);
            }
            // ________________ 4. caller busy check ____________________
            let user_busy = (await get_busyData(data.sender_id)).status;
            let user_timer = get_busyTimer(data.sender_id);
            var caller_busy = (user_busy || user_timer);
            // ________________ 5. room check ______________________
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { // room is free
                var room_busy = false;
                var call_url = false;
                var conference_id = false;
            } else { // room is busy
                var room_busy = true;
                var call_url = '/call/' + room.conference_id + '/audio/app/' + data.sender_id;
                var conference_id = room.conference_id;
            }
            callback({
                'room_busy': room_busy,
                'call_url': call_url,
                'conference_id': conference_id,
                'conf_timeout': conf_timeout,
                'caller_busy': caller_busy,
                'partner_busy': partner_busy,
                'personal_join': personal_join,
                'user_busy': user_busy,
                'user_timer': user_timer,
                // 'user_kurento': user_kurento,
                'caller_data': caller_data,
                redis_status: redis_client.connected

            });

        });

        // socket.on('send_rep_message_call', function (message) {
        // 	if (typeof message.arr_participants === 'string') {
        // 		message.arr_participants = JSON.parse(message.arr_participants);
        // 	}

        // 	if (message.is_room === false) {
        // 		sendCallMsg(message.user_id, message.sender_img, message.sender_name, message.conversation_id, message.text, 'call', '', message.set_calltype, 0, message.arr_participants, '0', true, 'called', null, null, (result, err) => {
        // 			if (err) {
        // 				console.log(72, err);
        // 			} else {
        // 				if (result.status) {
        // 					result.root_conv_id = message.thread_root_id;
        // 					result.root_msg_id = message.root_msg_id;
        // 					result.drawtype = 'text';
        // 					if (message.user_id !== message.to.toString()) {
        // 						io.to(message.to).emit('newRepMessage', result);
        // 					}
        // 					io.to(message.user_id).emit('newRepMessage', result);
        // 				} else {
        // 					console.log(result);
        // 				}
        // 			}
        // 		});
        // 	}
        // 	else if (message.is_room === true) {
        // 		// console.log('something wrong!!!');

        // 		// This is temporary group message.
        // 		sendCallMsg(message.user_id, message.sender_img, message.sender_name, message.conversation_id, message.text, 'call', '', message.set_calltype, 0, message.arr_participants, '0', true, 'called', null, null, (result, err) => {
        // 			if (err) {
        // 				console.log(err);
        // 			} else {
        // 				if (result.status) {
        // 					result.root_conv_id = message.thread_root_id;
        // 					result.root_msg_id = message.root_msg_id;
        // 					result.drawtype = 'text';
        // 					socket.broadcast.emit('newRepMessage', result); // this emit receive all users except me

        // 					io.to(message.user_id).emit('newRepMessage', result);
        // 				} else {
        // 					console.log(result);
        // 				}
        // 			}
        // 		});
        // 	}
        // });

        function Base64EncodeUrl(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        }

        function Base64DecodeUrl(str) {
            str = (str + '===').slice(0, str.length + (str.length % 4));
            return str.replace(/-/g, '+').replace(/_/g, '/');
        }



        // function findClientsSocket(io, roomId, namespace) {
        // 	var res = [],
        // 		ns = io.of(namespace || "/");    // the default namespace is "/"

        // 	if (ns) {
        // 		for (var id in ns.connected) {
        // 			if (roomId) {
        // 				// ns.connected[id].rooms is an object!
        // 				var rooms = Object.values(ns.connected[id].rooms);
        // 				var index = rooms.indexOf(roomId);
        // 				if (index !== -1) {
        // 					res.push(ns.connected[id]);
        // 				}
        // 			}
        // 			else {
        // 				res.push(ns.connected[id]);
        // 			}
        // 		}
        // 	}
        // 	return res;
        // }


        socket.on('hangupDynCall', async function(data, callback) {
            data.hangup_id = data.user_id;
            data.hangup_name = data.user_fullname;
            await clean_call_user(data.targetid, data, io, socket);
            var ring_state = await ringingState_get(data.conversation_id);
            if (ring_state) {
                for (let v of ring_state) {
                    if (data.targetid == v.split('_')[2]) {
                        await clean_timer_ring(io, v, data.conversation_id);
                    }
                };
            }
            data.member_id = data.targetid;
            var ulist = await get_userlistData(data.conversation_id);
            if (ulist) {
                for (let v of ulist) {
                    await sendMessage(io, v, {
                        ackid: get_new_id(),
                        emitter: 'conf_addmember_timeout',
                        emit_type: 'user',
                    }, data); // ok
                };
            }
            callback(true);
        });

        socket.on('socket_tog_raise_hand', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'socket_tog_raise_hand',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
                callback(true);
            }
        });

        socket.on('send_mute_user_conf', async function(data, callback) {
            await kurento_update_session(data.name, data.conversation_id, 'mute_status', data.mute_status);
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'send_mute_user_conf',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
                callback(true);
            }
        });

        socket.on('change_screenshare_status', async function(data, callback) {
            await kurento_update_session(data.user_id, data.conversation_id, 'screenstatus', data.screenstatus_new);
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'change_screenshare_status',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
                callback(true);
            }
        });
        socket.on('admin_screenshare_status', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                if (data.who == 'all') {
                    for (let i in room.participants) {
                        if (room.participants.hasOwnProperty(i)) {
                            if (data.user_id != i) {
                                await sendMessage(io, i, {
                                    ackid: get_new_id(),
                                    emitter: 'admin_screenshare_status',
                                    emit_type: 'user',
                                }, data); // ok
                            }
                        }
                    }
                } else {

                    await sendMessage(io, data.mute_uid, {
                        ackid: get_new_id(),
                        emitter: 'admin_screenshare_status',
                        emit_type: 'user',
                    }, data); // ok
                }
                callback(true);
            }
        });
        socket.on('admin_mute_status', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                if (data.who == 'all') {
                    for (let i in room.participants) {
                        if (room.participants.hasOwnProperty(i)) {
                            if (data.user_id != i) {
                                await sendMessage(io, i, {
                                    ackid: get_new_id(),
                                    emitter: 'admin_mute_status',
                                    emit_type: 'user',
                                }, data); // ok
                            }
                        }
                    }
                } else {
                    await sendMessage(io, data.mute_uid, {
                        ackid: get_new_id(),
                        emitter: 'admin_mute_status',
                        emit_type: 'user',
                    }, data); // ok
                }
                callback(true);
            }
        });
        socket.on('admin_video_status', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                if (data.who == 'all') {
                    for (let i in room.participants) {
                        if (room.participants.hasOwnProperty(i)) {
                            if (data.user_id != i) {
                                await sendMessage(io, i, {
                                    ackid: get_new_id(),
                                    emitter: 'admin_video_status',
                                    emit_type: 'user',
                                }, data); // ok
                            }
                        }
                    }
                }
                callback(true);
            }
        });
        socket.on('admin_hand_status', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'admin_hand_status',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
                callback(true);
            }
        });

        socket.on('send_switch_user_conf', async function(data, callback) {
            await kurento_update_session(data.name, data.conversation_id, 'call_type_route', data.video_status);
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) { callback(false); } else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'send_switch_user_conf',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
                callback(true);
            }
        });

        socket.on('getCallMemberList', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) {
                callback(null);
            } else {
                var arrUserList = [],
                    arrModList = [];
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        arrUserList.push(room.participants[i].user_id);
                        if (room.participants[i].user_role == 'moderator') {
                            arrModList.push(room.participants[i].user_id);
                        }

                    }
                }
                callback(arrUserList, arrModList);
            }

        });

        socket.on('getCallAdminList', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (room) {
                var room_users = Object.keys(room.participants);
                admin_list = _.intersection(data.participants_admin, room_users);
                callback(admin_list);
            } else {
                callback(null);
            }
        });



        socket.on('ringCallAdd', async function(data, callback) {
            if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(data.arr_participants);
            if ((await get_busyData(data.member_id)).status || get_busyTimer(data.member_id)) {
                callback({ status: 'busy' });
            } else {
                await set_busyData(data.member_id, data.conversation_id);
                data.ring_type = 'new';
                data.ring_index = data.conversation_id + '_' + data.user_id + '_' + data.member_id; // sender_receiver
                send_call_ringing(data.conversation_id, data.member_id, data.ring_index, data, io, socket, 2);
                await set_userlistData(data.conversation_id, [data.member_id]); // add
                // ==== add user to ring_data.participants_all
                let ring_data = await get_ringingData(data.conversation_id);
                if (ring_data.participants_all.indexOf(data.member_id) === -1) ring_data.participants_all.push(data.member_id);
                await set_ringingData(data.conversation_id, { 'participants_all': ring_data.participants_all });
                // =========================
                var query = "SELECT * FROM conversation WHERE participants CONTAINS ? AND participants CONTAINS ? AND company_id=? AND group='no' AND single='yes' ALLOW FILTERING;";
                models.instance.Conversation.execute_query(query, [data.arr_participants[0], data.arr_participants[1], data.company_id],
                    async function(err, Conversations) {
                        if (Conversations.rows && Conversations.rows.length) {
                            let conversation_add = String(Conversations.rows[0].conversation_id);
                            ring_data.conversation_list.push(conversation_add);
                            await set_ringingData(data.conversation_id, { 'conversation_list': ring_data.conversation_list });
                            sendMessage(io, data.member_id, {
                                ackid: get_new_id(),
                                emitter: 'call_stats_add',
                                emit_type: 'user',
                            }, {
                                participants_all: ring_data.participants_all,
                                conversation_init: ring_data.conversation_init,
                                conversation_id: conversation_add
                            });

                            calling_user_conv[data.member_id] = calling_user_conv[data.member_id] || [];
                            if (calling_user_conv[data.member_id].indexOf(conversation_add) === -1) calling_user_conv[data.member_id].push(conversation_add);

                            sendCallMsg(ring_data.user_id, ring_data.sender_img, ring_data.sender_name, conversation_add, ring_data.msg_body, '', ring_data.set_calltype, 0, ring_data.usersOnline, ring_data.conference_id, true, 'called', null, '', async(res_msg) => {
                                if (res_msg.status) {
                                    let msgid = String(res_msg.res);
                                    ring_data.msgid_list.push(conversation_add + ':' + msgid);
                                    await set_ringingData(data.conversation_id, { 'msgid_list': ring_data.msgid_list });
                                    // replyId(data.msgid, data.conversation_id, async (res_rep, err) => {
                                    // if (res_rep.status) {
                                    // data.repid = String(res_rep.result);
                                    // add calling data (block) =================================
                                    // await set_ringingData(data.conversation_id, {
                                    // 	'msgid': data.msgid.toString(),
                                    // 	'repid': data.repid.toString(),
                                    // 	'database_flag': true
                                    // });
                                    // socket: newmessage (non-block) ===============================================
                                    get_one_msg({ conversation_id: conversation_add, msg_id: msgid }, async(result, error) => {
                                        if (result.status) {
                                            result.msg.old_msgid = 0;
                                            if (result.msg.attch_imgfile == null) result.msg.attch_imgfile = [];
                                            if (result.msg.attch_audiofile == null) result.msg.attch_audiofile = [];
                                            if (result.msg.attch_videofile == null) result.msg.attch_videofile = [];
                                            if (result.msg.attch_otherfile == null) result.msg.attch_otherfile = [];
                                            // var ring_data = await get_ringingData(data.conversation_id);
                                            result.ring_data = ring_data;
                                            result.conversation_type = ring_data.conversation_init == 'personal' ? 'single' : 'group';
                                            result.conversation_title = ring_data.convname;
                                            result.conversation_img = 'img.png';
                                            // for (var n = 0; n < ring_data.participants_all.length; n++) {
                                            // await sendMessage(io, ring_data.participants_all[n], {
                                            // 	ackid: get_new_id(),
                                            // 	emitter: 'newMessageId',
                                            // 	emit_type: 'user',
                                            // }, data); // ok

                                            io.to(data.member_id).emit('newMessage', result);
                                            // send_msg_firebase(ring_data.participants_all[n], result,'newMessage');
                                            // await await sendMessage(io, ring_data.participants_all[n], {
                                            // 	ackid: get_new_id(),
                                            // 	emitter: 'newMessage',
                                            // 	emit_type: 'user',
                                            // }, result); // ok
                                            // }
                                        } else {
                                            console.log(error);
                                        }
                                    });
                                    // newmessage end ================================================================

                                    // }
                                    // });
                                }
                            });
                        }
                    });

                callback({ status: 'send' });
            }
        });

        var sendGuestCallMsg = async(data, callback) => {
            if (data.ring_type == 'new') {
                sendCallMsg(data.user_id, data.sender_img, data.sender_name, data.conversation_id, data.msg_body, '', data.set_calltype, 0, data.arr_participants, '', true, 'called', null, null, async(res_msg, err) => {
                    if (err) { console.log(72, err); } else {
                        if (res_msg.status) {
                            // let ring_data = await get_ringingData(data.conversation_id);
                            data.msgid = _.toString(res_msg.res);
                            // ring_data.msgid_list.push(data.msgid);
                            // await set_ringingData(data.conversation_id, { 'msgid_list': ring_data.msgid_list });
                            replyId(_.toString(res_msg.res), data.conversation_id, (res_rep, err) => {
                                if (res_rep.status) {
                                    data.repid = res_rep.result;
                                    callback({ msgid: data.msgid, repid: data.repid });
                                    get_one_msg({ conversation_id: data.conversation_id, msg_id: data.msgid }, async(result, error) => {
                                        if (result.status) {
                                            result.msg.old_msgid = 0;
                                            if (result.msg.attch_imgfile == null) result.msg.attch_imgfile = [];
                                            if (result.msg.attch_audiofile == null) result.msg.attch_audiofile = [];
                                            if (result.msg.attch_videofile == null) result.msg.attch_videofile = [];
                                            if (result.msg.attch_otherfile == null) result.msg.attch_otherfile = [];
                                            result.conversation_type = data.conversation_init == 'personal' ? 'single' : 'group';
                                            result.conversation_title = data.convname;
                                            result.conversation_img = 'img.png';

                                            for (var n = 0; n < data.participants_all.length; n++) {
                                                await sendMessage(io, data.participants_all[n], {
                                                    ackid: get_new_id(),
                                                    emitter: 'newMessageId',
                                                    emit_type: 'user',
                                                }, data); // ok
                                                io.to(data.participants_all[n]).emit('newMessage', result);
                                                // send_msg_firebase(data.participants_all[n], result,'newMessage');
                                                // await await sendMessage(io, data.participants_all[n], {
                                                // 	ackid: get_new_id(),
                                                // 	emitter: 'newMessage',
                                                // 	emit_type: 'user',
                                                // }, result); // ok
                                            }
                                        } else {
                                            console.log(error);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                var ring_data = await get_ringingData(data.conversation_id);
                callback({ msgid: ring_data.msgid, repid: ring_data.repid });
            }

        };

        socket.on('get_isbusy_guest', async function(data, callback) {
            if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(data.arr_participants);

            if (get_busyTimer(data.user_id)) {
                callback({ status: false, reason: 'timeout' });
            }
            // else if (get_busyConf(data.conference_id) == true) {
            // 	callback({ status: false, reason: 'pipeline' });
            // }
            // // else if (get_busyData(data.user_id)) { // not needed now
            // // 	callback({ status: false, reason: 'busy' });
            // // }
            // else if (ring_data && ring_data.pipeline_flag == false) {
            // 	callback({ status: false, reason: 'pipeline' });
            // }
            else {
                var usersOnline = [];
                var room = await get_kurentoroom(data.conversation_id);
                if (room) {
                    for (let i in room.participants) {
                        if (room.participants.hasOwnProperty(i)) {
                            if (room.participants[i].user_role == 'moderator') {
                                if (io.sockets.adapter.rooms.hasOwnProperty(i)) {
                                    if (Object.keys(io.sockets.adapter.rooms[i].sockets).length > 0) {
                                        let userSession = await get_busyData(i);
                                        let is_busy = userSession.status || get_busyTimer(i);
                                        let call_data = await get_callingData(i);
                                        if (is_busy == true && call_data == false) { // return; 
                                        } else if (is_busy == true && call_data != false && call_data.has_endpoint == false) { // return;
                                        } else {
                                            if (userSession.status) {
                                                if (userSession.conversation_id == data.conversation_id) {
                                                    usersOnline.push(i);
                                                } else {
                                                    return;
                                                }
                                            } else {
                                                usersOnline.push(i);
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                } else {
                    for (let i of data.participants_admin) {
                        if (io.sockets.adapter.rooms.hasOwnProperty(i)) {
                            if (Object.keys(io.sockets.adapter.rooms[i].sockets).length > 0) {
                                let userSession = await get_busyData(i);
                                let is_busy = userSession.status || get_busyTimer(i);
                                let call_data = await get_callingData(i);
                                if (is_busy == true && call_data == false) {
                                    // return; 
                                } else if (is_busy == true && call_data && call_data.has_endpoint == false) {
                                    // return;
                                } else if (is_busy == true && call_data && call_data.conf_data.conversation_id != data.conversation_id && call_data.has_endpoint == true) {
                                    console.log('no');
                                } else {
                                    if (userSession.status) {
                                        if (userSession.conversation_id == data.conversation_id) {
                                            usersOnline.push(i);
                                        } else {
                                            return;
                                        }
                                    } else {
                                        usersOnline.push(i);
                                    }
                                }
                            }
                        }
                    }
                }
                if (usersOnline.length > 0) {
                    setGuestSession(io, data.user_id, 'ringing', (getstatus) => {});
                    callback({ status: true });
                } else {
                    callback({ status: false, reason: 'offline' });
                }
            }
            // set_userProfileData(data.user_id, {
            // 	'name': data.user_fullname,
            // 	'img': data.rootImg,
            // 	'email': data.user_email
            // });
        });
        socket.on('ringCallGuest', async function(data, callback) {
            if (typeof data.arr_participants === 'string') data.arr_participants = JSON.parse(data.arr_participants);
            if (typeof data.participants_admin === 'string') data.participants_admin = JSON.parse(data.participants_admin);
            // await set_busyData(data.user_id); // without timer
            data.arr_participants = _.union([data.guestId], data.participants_admin);

            var room = await get_kurentoroom(data.conversation_id);
            var usersOnline = [data.guestId];
            if (!room) {
                // await set_busyConf(data.conference_id);
                data.ring_type = 'new';
                data.init_id = data.user_id;
                for (const i of data.participants_admin) {
                    if (io.sockets.adapter.rooms.hasOwnProperty(i)) {
                        if (Object.keys(io.sockets.adapter.rooms[i].sockets).length > 0) {
                            let userSession = await get_busyData(i);
                            let is_busy = userSession.status || get_busyTimer(i);
                            let call_data = await get_callingData(i);
                            if (is_busy == true && call_data == false) { return; } else if (is_busy == true && call_data != false && call_data.has_endpoint == false) { return; } else {
                                if (userSession.status) {
                                    if (userSession.conversation_id == data.conversation_id) {
                                        usersOnline.push(i);
                                    } else {
                                        return;
                                    }
                                } else {
                                    usersOnline.push(i);
                                }
                            }
                        }
                    }
                };
                if (usersOnline.length > 1) {
                    await set_userlistData(data.conversation_id, usersOnline); // set
                }
            } else {
                data.ring_type = 'add';
                for (let i in room.participants) {
                    if (room.participants[i].user_role == 'moderator') {
                        usersOnline.push(i);
                    }
                }
                await set_userlistData(data.conversation_id, [data.guestId]); // add
                // ==== add user to ringdata
                let ring_data = await get_ringingData(data.conversation_id);
                if (ring_data.participants_all.indexOf(data.guestId) === -1) ring_data.participants_all.push(data.guestId);
                await set_ringingData(data.conversation_id, { 'participants_all': ring_data.participants_all });
                // =========================
            }
            if (usersOnline.length > 1) {
                sendGuestCallMsg(data, async(guest_res) => {
                    if (guest_res.msgid) data.msgid = guest_res.msgid.toString();
                    if (guest_res.repid) data.repid = guest_res.repid.toString();
                    for (const i of usersOnline) {
                        if (data.guestId != i) {
                            data.ring_index = data.conversation_id + '_' + data.guestId + '_' + i;
                            await set_busyData(i, data.conversation_id);
                            data.usersOnline = usersOnline;
                            send_call_ringing(data.conversation_id, i, data.ring_index, data, io, socket, 3);
                        }
                    };

                    if (data.ring_type == 'new') {
                        data.msg_info = false;
                        data.reply_info = false;
                        data.start_flag = false;
                        data.end_flag = false;
                        data.finish_flag = false;
                        data.call_start_time = 0;
                        data.call_option = 'ring';
                        data.init_id = data.user_id;
                        data.kurentoIP = '0';
                        data.msgid_list = [data.conversation_id + ':' + data.msgid];
                        data.conversation_list = [data.conversation_id];
                        data.accept_list = [];
                        await set_ringingData(data.conversation_id, data); // new
                    }
                    callback(true);
                });

            } else {
                callback(false);
            }
        });


        socket.on('call_accept_conf', async function(data, callback) {
            if (typeof data.data_conf.arr_participants === 'string') data.data_conf.arr_participants = JSON.parse(data.data_conf.arr_participants);
            data.conversation_id = data.data_conf.conversation_id;
            data.conversation_type = data.data_conf.conversation_type.toLowerCase();
            data.ring_index = data.data_conf.ring_index;
            data.session_id = socket.id;
            data.data_conf.session_id = socket.id;
            data.msgid = data.data_conf.msgid;

            // var ring_data = await get_ringingData(data.conversation_id);

            var ring_state = await ringingState_get(data.conversation_id);
            console.log('fffffffffffffffffffffffffff:' + data.user_id + JSON.stringify(ring_state));

            if (ring_state.indexOf(data.data_conf.ring_index) > -1) {
                // ring_data.accept_list.push(data.data_conf.ring_index);
                // await set_ringingData(data.data_conf.conversation_id, {
                // 	'accept_list': ring_data.accept_list,
                // });

                await clean_timer_ring(io, data.ring_index, data.conversation_id);
                send_socket_support(data.user_id, 'send_accept_conf', data, io, socket, true);
                //// send_msg_firebase(data.user_id, data, 'send_accept_conf');
                // await clean_timer_user(data.user_id, data.conversation_id);

                if (data.data_conf.conversation_type.toLowerCase() == 'guest') {
                    data.call_url = '/call/sender/' + data.user_id + '/' + data.conversation_id;
                } else {
                    data.call_url = '/call/receiver/' + data.user_id + '/' + data.conversation_id;
                }
                // ===============================================================================
                if (data.data_conf.conversation_type.toLowerCase() == 'guest') {
                    data.guestId = data.data_conf.guestId;
                    data.guest_status = 'accepted';
                    data.status_type = 'accept';

                    var room = await get_kurentoroom(data.data_conf.conversation_id);
                    if (room) {
                        for (const i of data.data_conf.usersOnline) {
                            // await clean_timer_user(i, data.conversation_id);
                            send_socket_support(i, 'send_accept_conf', data, io, socket, true);
                            // send_msg_firebase(i, data, 'send_accept_conf');

                        };
                        var ring_state = await ringingState_get(data.conversation_id);
                        if (ring_state) {
                            for (const i of ring_state) {
                                if (data.guestId == i.split('_')[1]) {
                                    await clean_timer_ring(io, i, data.conversation_id);
                                }
                            };
                        }
                        setGuestSession(io, data.guestId, 'accepted', async(getstatus) => {
                            if (getstatus) {
                                if (data.data_conf.ring_type == 'add') {
                                    var ring_data = await get_ringingData(data.conversation_id);
                                    data.init_id = ring_data.init_id;
                                    data.msgid = ring_data.msgid;
                                    data.repid = ring_data.repid;
                                    await sendMessage(io, data.guestId, {
                                        ackid: get_new_id(),
                                        emitter: 'guest_call_join',
                                        emit_type: 'user',
                                    }, data); // ok
                                    callback(data);
                                } else {
                                    callback(data);
                                }
                            }
                        });
                    } else { // room free
                        var ulist = await get_userlistData(data.conversation_id);
                        if (ulist) {
                            for (const i of ulist) {
                                // await clean_timer_user(i, data.conversation_id);
                                if (data.user_id == i || data.guestId == i) { // clear busy of other except user and guest
                                } else {
                                    await del_busyData(i);
                                    send_socket_support(i, 'send_accept_conf', data, io, socket, true);
                                    // send_msg_firebase(i, data, 'send_accept_conf');
                                }
                            };
                        }
                        var ring_state = await ringingState_get(data.conversation_id);
                        if (ring_state) {
                            for (const i of ring_state) {
                                await clean_timer_ring(io, i, data.conversation_id);
                            };
                        }
                        setGuestSession(io, data.guestId, 'accepted', (getstatus) => {});
                        callback(data);
                    }
                } else if (data.data_conf.conversation_type.toLowerCase() == 'addparticipant') {
                    send_socket_support(data.data_conf.member_id, 'send_accept_conf', data.data_conf, io, socket, true);
                    // send_msg_firebase(data.data_conf.member_id, data.data_conf, 'send_accept_conf');
                    // await clean_timer_user(data.data_conf.member_id, data.conversation_id);
                    // console.log('voip:timer:set:call_accept:addparticipant:' + data.data_conf.member_id);
                    callback(data);
                } else {
                    send_socket_support(data.user_id, 'send_accept_conf', data, io, socket, false);
                    // send_msg_firebase(data.user_id, data, 'send_accept_conf');
                    // await clean_timer_user(data.user_id, data.conversation_id);
                    callback(data);

                }
                for (let i of data.data_conf.arr_participants) {
                    if (data.user_id != i) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'android_receiver_join',
                            emit_type: 'user',
                        }, data); // ok
                    }
                };
            } else {
                data.call_url = 'false';
                console.log('fffffffffffffffffffffffffff');
                callback(data);

            }

        });

        socket.on('call_reject_conf', async function(data, callback) {
            if (typeof data.data_conf.arr_participants === 'string') data.data_conf.arr_participants = JSON.parse(data.data_conf.arr_participants);
            data.session_id = socket.id;
            data.data_conf.session_id = socket.id;
            data.data_conf.msg = data.msg;
            data.data_conf.hangup_name = data.user_fullname;
            data.conversation_id = data.data_conf.conversation_id; // needed
            data.conference_id = data.data_conf.conference_id;
            data.msgid = data.data_conf.msgid;
            data.conversation_type = data.data_conf.conversation_type.toLowerCase();
            data.ring_index = data.data_conf.ring_index;
            data.hangup_id = data.user_id;
            data.hangup_name = data.user_fullname;

            let call_data = await get_callingData(data.user_id);

            await set_ringingData(data.conversation_id, {
                'hangup_id': data.hangup_id,
                'hangup_name': data.hangup_name
            });
            await clean_timer_ring(io, data.ring_index, data.conversation_id);

            if (call_data == false || (call_data && call_data.conf_data && call_data.conf_data.devicetype == "android" && call_data.user_status == "leave")) {
                await sendMessage(io, data.user_id, {
                    ackid: get_new_id(),
                    emitter: 'android_call_end',
                    emit_type: 'user',
                }, data);
                send_msg_firebase(data.user_id, data, 'android_call_end', call_data);
            } else {
                await sendMessage(io, data.user_id, {
                    ackid: get_new_id(),
                    emitter: 'call_reject_recv',
                    emit_type: 'user',
                }, data); // ok
                send_msg_firebase(data.user_id, data, 'call_reject_recv', call_data);
            }

            if (data.conversation_type == 'group') {
                var ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    if (await ulist.length == 2) {
                        for (let i of ulist) {
                            await clean_call_user(i, data.data_conf, io, socket);
                        };
                        var ring_state = await ringingState_get(data.conversation_id);
                        if (ring_state) {
                            for (let i of ring_state) {
                                await clean_timer_ring(io, i, data.conversation_id);
                            };
                        }
                    } else {
                        await clean_call_user(data.user_id, data.data_conf, io, socket);
                        var arrbusy = [];
                        var ulist = await get_userlistData(data.conversation_id);
                        if (ulist) {
                            for (const i of ulist) {
                                if ((await get_busyData(i)).status || get_busyTimer(i)) arrbusy.push(i);
                            };
                        }
                        if (arrbusy.length == 1) {
                            await clean_call_user(data.data_conf.rootId, data.data_conf, io, socket);
                        }
                    }
                }
            } else if (data.conversation_type == 'addparticipant') {
                await clean_call_user(data.data_conf.member_id, data.data_conf, io, socket);
                await sendMessage(io, data.data_conf.rootId, {
                    ackid: get_new_id(),
                    emitter: 'callconf_user_reject',
                    emit_type: 'user',
                }, data); // ok

                // if(data.conv_id && data.conv_id == data.conversation_id){
                await sendMessage(io, data.user_id, {
                    ackid: get_new_id(),
                    emitter: 'android_call_end',
                    emit_type: 'user',
                }, data);
                send_msg_firebase(data.user_id, data, 'android_call_end', call_data);
                await del_userlistData(data.conversation_id, data.user_id);

                // }

            } else if (data.conversation_type == 'guest') {
                data.guestId = data.data_conf.guestId;
                setGuestSession(io, data.data_conf.guestId, 'rejected', async(getstatus) => {});
                let ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    for (const i of ulist) {
                        // await clean_timer_user(i, data.conversation_id);
                        // let iscall = await getRoomInfoUser(v);
                        let iscall = await getUserBusybyCID(i, data.conversation_id);
                        if (!iscall) {
                            await del_busyData(i);
                            await del_userlistData(data.conversation_id, i);
                        }
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'call_reject_recv',
                            emit_type: 'user',
                        }, data); // ok
                        send_msg_firebase(i, data, 'call_reject_recv', call_data);
                    };
                }
                var ring_state = await ringingState_get(data.conversation_id);
                if (ring_state) {
                    for (let i of ring_state) {
                        if (data.guestId == i.split('_')[1]) {
                            await clean_timer_ring(io, i, data.conversation_id);
                        }
                    };
                }
                await sendMessage(io, data.data_conf.guestId, {
                    ackid: get_new_id(),
                    emitter: 'android_call_end',
                    emit_type: 'user',
                }, data); // ok
                send_msg_firebase(data.data_conf.guestId, data, 'android_call_end', call_data);
            } else {
                var ulist = await get_userlistData(data.conversation_id);
                if (ulist) {
                    for (let i of ulist) {
                        if (data.msg == -33 && data.user_id == i) {
                            console.log('ignore');
                        } else {
                            let busy_data = await get_busyData(i);
                            if (busy_data.status && busy_data.conversation_id == data.conversation_id) {
                                await clean_call_user(i, data.data_conf, io, socket);
                            }
                        }

                    };
                }
                var ring_state = await ringingState_get(data.conversation_id);
                if (ring_state) {
                    for (let i of ring_state) {
                        await clean_timer_ring(io, i, data.conversation_id);
                    };
                }
            }
        });

        socket.on('sendChatmsgConf', async function(data, callback) {
            var room = await get_kurentoroom(data.conversation_id);
            if (!room) {} else {
                for (let i in room.participants) {
                    if (room.participants.hasOwnProperty(i)) {
                        await sendMessage(io, i, {
                            ackid: get_new_id(),
                            emitter: 'newChatmsgConf',
                            emit_type: 'user',
                        }, data); // ok
                    }
                }
            }
            callback(true);

        });

        socket.on('android_call_switch', function(data, callback) {
            callback(true);
        });

        socket.on('conf_getSocketid', function(callback) {
            callback(socket.id);
        });

        // socket.on('conf_updatesoket', function (data, callback) {
        // 	// conf_updateSocket(data.user_socketid,socket, (status) => {
        // 	//   callback(status);
        // 	// });
        // });

        socket.on('getRunningCalls', function(callback) {
            get_running_calls((running_calls) => {
                callback(running_calls);
            });
        });

        socket.on('voip_switch_server', function(data, callback) {
            // check server switching status
            if (parseInt(data.msg_id) != 0) {
                models.instance.Messages.find({
                    conversation_id: models.uuidFromString(data.conversation_id),
                    msg_id: models.timeuuidFromString(data.msg_id)
                }, { raw: true, allow_filtering: true }, function(err, message) {
                    if (err) callback({ dbstatus: null });
                    // server switching active
                    if (message[0].call_server_switch == true) callback({ call_server_switch: 'yes' });
                    else { // server switching not active
                        models.instance.Messages.update({
                                conversation_id: models.uuidFromString(data.conversation_id),
                                msg_id: models.timeuuidFromString(data.msg_id)
                            }, { call_server_switch: true }, { if_exists: true },
                            function(err) {
                                if (err) { callback({ dbstatus: null }); } else {
                                    models.instance.Messages.find({
                                        conversation_id: models.uuidFromString(data.conversation_id),
                                        msg_id: models.timeuuidFromString(data.msg_id)
                                    }, { raw: true, allow_filtering: true }, async function(err, message) {
                                        if (err) callback({ dbstatus: null });
                                        for (let v of message[0].call_participants) {
                                            await sendMessage(io, v, {
                                                ackid: get_new_id(),
                                                emitter: 'conf_switch_server',
                                                emit_type: 'user',
                                            }, message[0]); // ok
                                        };

                                    });
                                }
                            });
                        callback({ call_server_switch: 'no' });
                    }

                });
            }
        });

        socket.on('voip_client_reload_user', async function(data, callback) {
            var iii = -1;
            for (let v of data.arr_participants) {
                // _.forEach(data.arr_participants, function (v, k) {
                iii++;
                setTimeout(async function() {
                    await sendMessage(io, v, {
                        ackid: get_new_id(),
                        emitter: 'refresh_voip',
                        emit_type: 'user',
                    }, data); // ok
                }, iii * 5000);

                await sendMessage(io, v, {
                    ackid: get_new_id(),
                    emitter: 'voip_server_reload_user',
                    emit_type: 'user',
                }, data); // ok
            };
        });

        socket.on('get_call_userlist', function(data, callback) {
            var all_users = [];
            getActiveUsers(data.user_id, async(userdata, user_error) => {
                if (userdata.status) {
                    for (let row of userdata.users) {
                        // _.each(userdata.users, async function (row, key) {
                        let user_busy = (await get_busyData(row.id)).status || get_busyTimer(row.id);
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
                            is_busy: user_busy || get_busyTimer(row.id),
                            roll: row.roll,
                            access: row.access
                        });
                    };
                    callback(all_users);
                } else {
                    callback(false);
                }

            });
        });

        socket.on('get_call_history', function(user, callback) {
            models.instance.Users.find({}, { raw: true, allow_filtering: true }, function(err, users) {
                var alluserlist = [];
                _.each(users, function(v, k) {
                    alluserlist.push({ id: v.id, dept: v.dept, designation: v.designation, email: v.email, fullname: v.fullname, img: v.img, company_id: v.company_id });
                });

                getAllConversation(user.id.toString(), (result) => {
                    if (result.status) {
                        var conversations = result.conversations;
                        var myConversationList = [] // keep all conversatons in this array
                        var conversationTitle = {};
                        var conversationType = {};
                        var conversationWith = {};
                        var conversationImage = {};
                        var conversationParticipants = {};
                        var userName = {};
                        var userImg = {};
                        var myConversationID = "";

                        _.each(alluserlist, function(users, k) {
                            userName[users.id] = users.fullname;
                            userImg[users.id] = users.img;
                        });

                        //Get conversation detail along with user table for further user list to android
                        if (result.conversations.length > 0) {
                            _.each(result.conversations, function(conversations, k) {
                                if (!isEmpty(conversations.title)) {
                                    if (checkThisIdActiveOrNot(conversations.is_active, user.id.toString())) {
                                        if (myConversationList.indexOf(conversations.conversation_id.toString()) === -1) {

                                            myConversationList.push(conversations.conversation_id.toString());
                                            conversationTitle[conversations.conversation_id.toString()] = conversations.title;
                                            conversationType[conversations.conversation_id.toString()] = conversations.single;
                                            conversationImage[conversations.conversation_id.toString()] = conversations.conv_img;
                                            conversationParticipants[conversations.conversation_id.toString()] = conversations.participants;

                                            if (conversations.single == 'yes') {
                                                if (conversations.participants.length == 1) {
                                                    myConversationID = conversations.conversation_id.toString();
                                                } else {
                                                    for (let pv of conversations.participants) {
                                                        // _.forEach(conversations.participants, function (pv, pk) {
                                                        if (pv !== null && pv.toString() !== user.id.toString()) {
                                                            conversationWith[conversations.conversation_id.toString()] = pv;
                                                        }
                                                    };
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
                                        for (let amv of result.data) {
                                            // _.forEach(result.data, function (amv, amk) {
                                            if (amv.length > 0) {
                                                _.each(amv, function(mv, mk) {
                                                    // if (mv.msg_type == 'call') {
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
                                                    // }
                                                });
                                            }
                                        };
                                        // _.forEach(result.data, function (amv, amk) {
                                        // 	if (amv.length > 0) {

                                        // 		_.each(amv, function (mv, mk) {

                                        // 			if (mv.has_hide != null) {
                                        // 				if ((mv.has_hide).indexOf(user.id.toString()) === -1) {
                                        // 					if (mv.has_delete != null) {
                                        // 						if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                        // 							if ((mv.has_delete).indexOf('Sender delete it') > -1) {

                                        // 							} else {
                                        // 								all_message.push(mv);
                                        // 							}
                                        // 						}
                                        // 					} else {
                                        // 						all_message.push(mv);
                                        // 					}
                                        // 				}
                                        // 			} else {
                                        // 				if (mv.has_delete != null) {
                                        // 					if ((mv.has_delete).indexOf(user.id.toString()) == -1) {
                                        // 						if ((mv.has_delete).indexOf('Sender delete it') > -1) {

                                        // 						} else {
                                        // 							all_message.push(mv);
                                        // 						}
                                        // 					}
                                        // 				} else {
                                        // 					all_message.push(mv);
                                        // 				}
                                        // 			}
                                        // 		});
                                        // 	}
                                        // });

                                        // Get all unread message
                                        var all_message_orderBy = _.orderBy(all_message, ['created_at'], ['desc']);
                                        for (let amv of all_message_orderBy) {
                                            // _.forEach(all_message_orderBy, function (amv, amk) {
                                            if (amv.msg_status == null && amv.sender.toString() != user.id.toString()) {
                                                all_unread.push(amv);
                                            }
                                        };

                                        //Count unread message and push it to counts array
                                        all_unread.forEach(function(x) {
                                            counts[x.conversation_id.toString()] = (counts[x.conversation_id.toString()] || 0) + 1;
                                        });

                                        //Get All last Message
                                        for (let amv of all_message_orderBy) {
                                            // _.forEach(all_message_orderBy, function (amv, amk) {
                                            if (last_conversation_id.indexOf(amv.conversation_id.toString()) === -1) {
                                                last_conversation_id.push(amv.conversation_id.toString());
                                                // all_last_message.push(amv);
                                                if (amv.conversation_id.toString() !== myConversationID) {
                                                    if (!isEmpty(amv.msg_body)) {
                                                        androidUserList.push({
                                                            'conversation_id': amv.conversation_id,
                                                            'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
                                                            'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
                                                            'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
                                                            'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
                                                            'participants': conversationParticipants[amv.conversation_id.toString()],
                                                            'created_at': amv.created_at,
                                                            'msg_id': amv.msg_id,
                                                            'msg_type': amv.msg_type,
                                                            'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
                                                            'sender_name': amv.sender_name,
                                                            'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
                                                        });
                                                    }

                                                    if (amv.msg_type == 'call') {
                                                        androidCallList.push({
                                                            'conversation_id': amv.conversation_id,
                                                            'conversation_type': (conversationType[amv.conversation_id.toString()] == 'yes' ? 'Personal' : 'Group'),
                                                            'conversation_with': (conversationType[amv.conversation_id.toString()] == 'yes' ? conversationWith[amv.conversation_id.toString()] : 'Group'),
                                                            'conversation_title': (conversationType[amv.conversation_id.toString()] == 'yes' ? userName[conversationWith[amv.conversation_id.toString()]] : conversationTitle[amv.conversation_id.toString()]),
                                                            'msg_body': (amv.msg_body == null ? 'null' : amv.msg_body),
                                                            'participants': conversationParticipants[amv.conversation_id.toString()],
                                                            'created_at': (amv.msg_body == null ? 'null' : amv.created_at),
                                                            'call_duration': (amv.call_duration == "" ? 0 : amv.call_duration),
                                                            'call_type': amv.call_type,
                                                            'call_status': amv.call_status,
                                                            'call_msg': amv.call_msg,
                                                            'msg_id': amv.msg_id,
                                                            'msg_type': amv.msg_type,
                                                            'sender_img': (conversationType[amv.conversation_id.toString()] == 'yes' ? userImg[conversationWith[amv.conversation_id.toString()]] : conversationImage[amv.conversation_id.toString()]),
                                                            'sender_name': amv.sender_name,
                                                            'totalUnread': (counts[amv.conversation_id.toString()] > 0 ? counts[amv.conversation_id.toString()] : 0)
                                                        });
                                                    }
                                                }
                                            }
                                        };

                                        callback(androidCallList);

                                    } else {
                                        console.log(result);
                                    }
                                });
                            }
                        } else {
                            callback(false);
                        }
                    } else {
                        console.log(result);
                    }
                });
            });
        });

        socket.on('reset_call_url', function(data, callback) {
            if (data.conversation_id && data.company_id && data.user_id && data.type && data.new_url) {
                if (data.type == 'group') {
                    var newid = data.new_url + '_group';
                    models.instance.Conversation.findOne({ conference_id: newid }, { raw: true, allow_filtering: true },
                        function(err, group_url) {
                            if (err) { callback({ status: false, reason: 'error', data: err }); } else {
                                if (group_url) { // url found
                                    callback({ status: false, reason: 'exist', data: group_url });
                                } else { // url not found
                                    var update_values_object = { conference_id: newid };
                                    var query_object = {
                                        conversation_id: models.uuidFromString(data.conversation_id),
                                        company_id: models.timeuuidFromString(data.company_id)
                                    };
                                    models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function(err) {
                                        if (err) { callback({ status: false, reason: 'error', data: err }); } else {
                                            callback({ status: true, conference_id: newid });
                                        }
                                    });
                                }
                            }
                        });
                } else {
                    var newid = data.new_url + '_personal';
                    models.instance.Users.findOne({ conference_id: newid }, { raw: true, allow_filtering: true },
                        function(err, personal_url) {
                            if (err) { callback({ status: false, reason: 'error', data: err }); } else {
                                if (personal_url) { // url found
                                    callback({ status: false, reason: 'exist', data: personal_url });
                                } else { // url not found
                                    var update_values_object = { conference_id: newid };
                                    models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, update_values_object, update_if_exists, function(err) {
                                        if (err) { callback({ status: false, reason: 'error', data: err }); } else {
                                            callback({ status: true, conference_id: newid });
                                        }
                                    });
                                }
                            }
                        });
                }


            } else {
                callback(false);
            }

        });

        // socket.on('get_call_url', function (data, callback) {
        // 	if (data.type == 'profile') {

        // 		models.instance.Users.findOne({ id: models.uuidFromString(data.user_id) },
        // 			{ raw: true, allow_filtering: true }, function (err, info_user) {
        // 				if (info_user.conference_id == null) {
        // 					var newid = models.timeuuid().toString() + '_personal';
        // 					var update_values_object = { conference_id: newid };
        // 					models.instance.Users.update({ id: models.uuidFromString(data.user_id) }, update_values_object, update_if_exists, function (err) {
        // 						if (err) { console.log(err); callback(null); }
        // 						else {
        // 							data.conference_id = newid;
        // 							callback(data);
        // 						}
        // 					});
        // 				} else {
        // 					data.conference_id = info_user.conference_id;
        // 					callback(data);
        // 				}
        // 			});

        // 	} else {
        // 		models.instance.Conversation.find({ conversation_id: models.timeuuidFromString(data.conversation_id) }, { raw: true, allow_filtering: true }, function (err, info_conversation) {
        // 			if (err) {
        // 				callback(null);
        // 			} else {
        // 				if (info_conversation.conference_id == null) {
        // 					var query_object = {
        // 						conversation_id: models.uuidFromString(data.conversation_id),
        // 						company_id: models.timeuuidFromString(userCompany_id[socket.handshake.session.user_id])
        // 					};
        // 					var newid = models.timeuuid().toString() + '_group';
        // 					var update_values_object = { conference_id: newid };
        // 					models.instance.Conversation.update(query_object, update_values_object, update_if_exists, function (err) {
        // 						if (err) { callback(null); }
        // 						else {
        // 							data.conference_id = newid;
        // 							callback(data);
        // 						}
        // 					});
        // 				} else {
        // 					data.conference_id = info_conversation.conference_id;
        // 					callback(data);
        // 				}
        // 			}
        // 		});
        // 	}

        // });

        socket.on('call_running_status', async function(data, callback) {
            // if(!redis_client){callback(false); return;}
            var room_info = await get_kurentoroom(data.conversation_id);
            callback(room_info);
        });
        socket.on('call_running_conf', async function(data, callback) { // rrrr
            var conv_run = false,
                partner_run = false,
                user_busy = false,
                call_type_route = false,
                room_info = false,
                partner_room = false,
                partner_allow = false,
                redis_status = redis_client.connected;
            if (data.conversation_id) {
                room_info = await get_kurentoroom(data.conversation_id);
            }
            if (room_info) { conv_run = true; }

            var my_info = await get_busyData(data.user_id);
            if (my_info && my_info.status) {
                user_busy = true;
                let my_room = await get_kurentoroom(my_info.conversation_id);
                if (my_room && my_room.participants && my_room.participants[data.user_id]) {
                    call_type_route = my_room.participants[data.user_id].call_type_route;
                }
            }

            if (data.partner_id) {
                var partner_info = await getUserBusybyCID(data.partner_id, data.conversation_id);
                var partner_busy = await get_busyData(data.partner_id);
                if (partner_busy && partner_busy.status) {
                    partner_room = await get_ringingData(partner_busy.conversation_id);
                    if (partner_room && partner_room.conversation_list.indexOf(data.conversation_id) !== -1) {
                        partner_allow = true;
                    }
                }
                if (partner_info) { partner_run = true; } else {
                    if ((await get_ringingData(data.partner_id)).call_option == 'window' && partner_busy.status) {
                        partner_run = true;
                    } else { partner_run = false; }
                }
                callback({
                    conv_run: conv_run, // ?
                    partner_run: partner_run, // ?
                    partner_allow: partner_allow, // ?
                    room_info: room_info,
                    partner_room: partner_room,
                    user_busy: user_busy,
                    call_type_route: call_type_route,
                    calling_user_run: calling_user_conv[data.user_id] || [],
                    redis_status: redis_status
                });
            } else {
                callback({
                    conv_run: conv_run,
                    partner_run: false,
                    partner_allow: partner_allow,
                    room_info: room_info,
                    partner_room: partner_room,
                    user_busy: user_busy,
                    call_type_route: call_type_route,
                    calling_user_run: calling_user_conv[data.user_id] || [],
                    redis_status: redis_status
                });
            }
        });
        socket.on('has_restart', function(callback) {
            if (socket.handshake.session.user_id) {
                callback(true);
            } else
                callback(false);
        });
        acc1 = 0;
        socket.on('ack_message_voip', async function(data) {
            if (data.data.ackid) {
                await del_user_buffer(data.user_id, data.data.ackid);
            }
        });
        // socket.on('ack_message_web', async function(data) {
        //     if (data.my_token) {
        //         var pending_list = socket_cid_store[data.user_id];
        //         var ckey = data.message.msg.conversation_id.toString() + '_' + data.message.msg.msg_id.toString();
        //         if(pending_list && pending_list.length){
        //             for (let pl of pending_list) {
        //                 if (pl[ckey]) {
        //                     // var pp = pl[ckey];
        //                     var index = pl[ckey].indexOf(data.my_token);
        //                     if (index !== -1) { pl[ckey].splice(index, 1); }
        //                 }
        //             }

        //         }
                
        //     }
        //     // console.log(socket_cid_store);
        // });


        socket.on('voip_reconnection', async function(data, callback) {
            var user_id = data.user_id;
            let call_data = await get_callingData(user_id);
            var msg_buffer = await get_user_buffer(user_id);
            if (call_data && msg_buffer) {
                msg_buffer = Object.entries(msg_buffer);
                for (const [key, value] of msg_buffer) {
                    var val = JSON.parse(value);
                    if (val.emit_type == 'call') {
                        io.to(user_id + '_call').emit(val.emitter, val);
                    } else if (val.emit_type == 'user') {
                        io.to(user_id).emit(val.emitter, val);
                    }
                }
            }
            callback(call_data);
        });

        // socket.on('check_ssl_valid', function (data,callback) {
        // 	let url_info = url.parse(data.addr);
        // 	var url_port = '443';
        // 	if(url_info.port){
        // 		url_port = url_info.port;
        // 	}else{
        // 		if(url_info.hostname == 'bd.freeli.io'){
        // 			url_port = '5008';
        // 		}else if(url_info.hostname == 'work.freeli.io'){
        // 			url_port = '443';
        // 		}else{
        // 			url_port = '443';
        // 		}
        // 	}
        // 	const req = https.request({
        // 		// hostname: url_info.hostname,
        // 		// port: parseInt(url_port),
        // 		hostname: 'bd.freeli.io',
        // 		port: 5008,
        // 		path: '/',
        // 		method: 'GET'
        // 	}, (res) => {
        // 		callback(res.socket.authorized);
        // 		// console.log('statusCode:', res.statusCode);
        // 		// console.log('headers:', res.headers);
        // 		// console.log('certificate authorized:' + res.socket.authorized);
        // 		// res.on('data', (d) => {
        // 		// 	process.stdout.write(d);
        // 		// });
        // 	});
        // 	req.on('error', (e) => {
        // 		console.log(e);
        // 		callback(false);
        // 	});
        // 	req.end();
        // });

        /***********************************************************************/
        /***********************************************************************/
        /******    Sujon conference SOCKET END HERE     **********************/
        /***********************************************************************/
        /***********************************************************************/
    });
    return router;
}