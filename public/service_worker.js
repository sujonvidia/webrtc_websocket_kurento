"use strict";
console.log('WORKER: executing.');
/* These resources will be downloaded and cached by the service worker
   during the installation process. If any resource fails to be downloaded,
   then the service worker won't be installed either.
*/
var filesToCache = [
    '/stylesheets/singup_parent.css',
    '/stylesheets/mob_style_covid.css',
    '/stylesheets/style_basic_covid.css',
    '/javascripts/mob_connect_page_covid.js',
    '/javascripts/mob_custom_covid.js',
    '/stylesheets/mob_style.css',
    '/stylesheets/style_basic_connect.css',
    '/stylesheets/pluginCss/OverlayScrollbars.css',
    '/stylesheets/style-login.css',
    '/stylesheets/pluginCss/hover.css',
    '/stylesheets/jquery-ui.css',
    '/stylesheets/conf/index.css',
    '/stylesheets/style-call.css',
    '/javascripts/plugins/FileSaver.js',
    '/stylesheets/toastr.min.css',
    '/stylesheets/pluginCss/balloon.min.css',
    '/stylesheets/pluginCss/select2.min.css',
    '/stylesheets/pluginCss/os-theme-round-light.css',
    '/javascripts/plugins/select2.min.js',
    '/javascripts/conf_participants.js',
    '/javascripts/socket-client-side.js',
    '/javascripts/mob_connect_page.js',
    '/javascripts/taphold.js',
    '/javascripts/mob_custom.js',
    '/javascripts/plugins/jquery-multidownload.js',
    '/bower_components/adapter.js/adapter-latest.js',
    '/bower_components/adapter.js/adapter.js',
    '/bower_components/kurento-utils/js/kurento-utils.js',
    '/javascripts/conf_index.js',
    '/javascripts/localstorage_fun.js',
    '/javascripts/plugins/JSzip.js',
    '/javascripts/plugins/jszip-utils.js',
    '/javascripts/basic_connect.js',
    '/javascripts/jquery-confirm/jquery-confirm.min.css',
    '/javascripts/jquery-confirm/jquery-confirm.min.js',
    '/javascripts/socket-calling.js',
    '/javascripts/plugins/OverlayScrollbars.js',
    '/javascripts/jQuery/jquery-ui.min.js',
    '/javascripts/fontawesome-all.js',
    '/javascripts/jQuery/jquery-3.3.1.min.js',
    '/javascripts/lodash.js',
    '/javascripts/moment.js',
    '/javascripts/moment-timer.js',
    '/javascripts/moment-timezone-with-data.js',
    '/javascripts/tooltipster.bundle.min.js',
    '/javascripts/jquery.highlight.js',
    '/javascripts/toastr.min.js',
    '/javascripts/masonry.pkgd.min.js',
    '/javascripts/canvasjs.min.js',
    '/javascripts/validate.min.js',
    '/javascripts/plugins/clipboard.min.js',
    '/stylesheets/jquery.mobile-1.4.5.min.css',
    '/javascripts/jQuery/jquery.mobile-1.4.5.js',
    '/javascripts/bootstrap.min.js',
    '/images/workfreeli_final_logo.png',
    // '/images/forward_32.svg',
    '/javascripts/plugins/socket.io.js',
    '/stylesheets/style-basic.css',
    '/stylesheets/responsive_basic.css',
    '/stylesheets/pluginCss/flatpickr.min.css',
    '/push.js',
    '/javascripts/Activity.js',
    '/stylesheets/fonts/haven-fonts.css',
    '/stylesheets/fonts/fontawesome-all.css',
    '/stylesheets/style-popup.css',
    '/javascripts/socket_basic_connect.js',
    '/javascripts/basic_connect_f_d.js',
    '/javascripts/timepicki.js',
    '/javascripts/plugins/in-view.min.js',
    '/javascripts/plugins/jquery.panzoom.js',
    // '/images/basicAssets/close_button-white.svg',
    // '/images/basicAssets/custom_thread_for_reply-white.svg',
    // '/images/basicAssets/Top_Nav_Bell.svg',
    '/images/basicAssets/video_call_for_profile.svg',
    '/images/basicAssets/voice_call_for_profile.svg',
    // '/images/basicAssets/Down_Chevron.svg',
    // '/images/basicAssets/Settings.svg',
    // '/images/basicAssets/conv-i-new-bb.png',
    // '/images/basicAssets/search_bar_thread_ico.svg',
    // '/images/basicAssets/active_thread_searchbar_ico.svg',
    // '/images/basicAssets/backiconSidebar.svg',
    // '/images/basicAssets/plusiconSidebar.svg',
    // '/images/basicAssets/Users.svg',
    // '/images/basicAssets/CalendarChevronRight.svg',
    // '/images/loader.gif',
    // '/images/users/nayeem.jpg',
    // '/images/basicAssets/BackArrow.svg',
    // '/images/basicAssets/close_button.svg',
    // '/images/loading-icon-red.gif',
    // '/images/emojiPacks/hv1.svg',
    // '/images/emojiPacks/hv2.svg',
    // '/images/emojiPacks/hv3.svg',
    // '/images/emojiPacks/hv4.svg',
    // '/images/emojiPacks/hv5.svg',
    // '/images/emojiPacks/hv6.svg',
    // '/images/emojiPacks/hv7.svg',
    // '/images/emojiPacks/hv8.svg',
    // '/images/emojiPacks/hv9.svg',
    // '/images/emojiPacks/hv10.svg',
    // '/images/emojiPacks/hv11.svg',
    // '/images/emojiPacks/hv12.svg',
    // '/images/emojiPacks/hv13.svg',
    // '/images/basicAssets/prevThreadicon.svg',
    // '/images/basicAssets/nextThreadicon.svg',
    // '/images/users/joni.jpg',
    // '/images/basic_view/form-sent-successfully.gif',
    // '/images/basic_view/credit_cards.png',
    // '/images/basic_view/paypal.png',
    // '/images/basic_view/tooltip-question-mark.png',
    // '/stylesheets/fonts/mem8YaGs126MiZpBA-UFVZ0b.woff2',
    // '/stylesheets/fonts/SFProText-Regular.woff2',
    // '/images/basicAssets/activeSvg/newMessageHovAc.svg',
    // '/images/basicAssets/NotFlagged.svg',
    // '/images/basicAssets/search_icon_for_todo_chat.svg',
    // '/images/basicAssets/zmdidot-circle.svg',
    // '/images/basicAssets/zmdidot-offline.svg',
    // '/images/basicAssets/PrivateLock.svg',
    // '/images/basicAssets/inactiveSvg/time-circle-plus.svg',
    // '/images/flaticon/support.svg',
    // '/images/basicAssets/PublicHash.svg',
    // '/images/basicAssets/PrivateLockRed.svg',
    // '/images/basicAssets/OnlineStatus.svg',
    // '/images/basicAssets/custom_not_pin.svg',
    // '/images/basicAssets/MoreMenu.svg',
    // '/images/basicAssets/hayven_checked.svg',
    // '/images/basicAssets/Attach.svg',
    // '/images/basicAssets/AddEmoji_White.svg',
    // '/images/basicAssets/circle_up_arrow.svg',
    // '/stylesheets/webfonts/fa-solid-900.woff2',
    // '/images/basic_view/30_days_green.png',
    // '/images/basic_view/secure-shape.svg',
    '/javascripts/custom-basic.js',
    '/javascripts/responsive_basic.js',
    '/javascripts/plugins/jquery.fileDownload.js',
    '/javascripts/plugins/download.js',
    '/ringtones/short_tone.mp3',
    '/ringtones/simple_corporate_tone.mp3',
    // '/images/basicAssets/times-circle-regular_black.svg',
    // '/images/basicAssets/loading_msg.gif',
    // '/images/basicAssets/custom_voice_call.svg',
    // '/images/basicAssets/custom_video_call.svg',
    // '/images/basicAssets/custom_pinned.svg',
    // '/images/basicAssets/custom_thread_for_reply.svg',
    // '/images/basicAssets/custom_thread_for_reply_red.svg',
    // '/images/basicAssets/custom_rightChevron_for_reply.svg',
    // '/images/basicAssets/custom_rightChevron_for_reply_red.svg',
    // '/images/basicAssets/voice_call_for_active.svg',
    // '/images/basicAssets/video_call_for_active.svg',
    // '/images/basicAssets/inactiveSvg/call_forward.svg',
    // '/images/basicAssets/inactiveSvg/clearMsgIn.svg',
    '/images/call/close-call.svg',
    '/images/call/MoreMenu.svg',
    '/images/call/add-contact_48px.svg',
    '/images/call/screen-share-on_48px.svg',
    '/images/call/message_56px.svg',
    '/images/call/raise-hand.svg',
    '/images/call/hang-up_56px.svg',
    '/images/call/icon-down-arrow.svg',
    // '/images/basicAssets/thread.svg',
    '/videos/black_new.mp4',
    '/images/call/switch_video_48px.svg',
    '/images/call/microphone-solid.svg',
    '/images/call/video-off_48px_red.svg',
    '/images/call/mute-speaker-client.svg',
    '/images/call/mute-video-client.svg',
    '/images/call/mute-screen-client.svg',
    '/images/call/mute-speaker-server.svg',
    '/images/call/black-background.jpg',
    '/images/basicAssets/green_voice_call.svg',
    '/images/basicAssets/custom_call_join.svg',
    '/images/call/mute-off_48px_red.svg',
    '/images/call/ellipsis_v.svg',
    '/images/call/speaker-on_56px.svg',
    '/images/call/video-on_48px.svg',
    '/images/call/screen-share-off_48px.svg',
    '/images/call/webcam-max.svg',
    '/images/call/fullscreen-show.svg'

]

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/

// self.addEventListener('install', function (event) {
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open('sw' + event.target.location.href.split("?hash=")[1]).then(function (cache) {

//       return cache.addAll(filesToCache);
//     })
//   ); 
// });
self.addEventListener('install', (event) => {
    // //debugger;
    // console.log('swuu:install...');
    // self.skipWaiting();
    event.waitUntil(
        caches.open('sw' + event.target.location.href.split("?hash=")[1]).then((cache) =>
            Promise.all(
                filesToCache.map((url) => {
                    return fetch(`${url}?${Date.now()}`).then((response) => { // cache-bust using a random query string
                        if (!response.ok) throw Error('Not ok'); // fail on 404, 500 etc
                        return cache.put(url, response);
                    });
                }),
            ),
        ),
    );
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (['sw' + event.target.location.href.split("?hash=")[1]].indexOf(cacheName) === -1) {
                        // self.clients.claim();
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    console.log('swuu:Activating...');
    // self.clients.claim();
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (['sw' + event.target.location.href.split("?hash=")[1]].indexOf(cacheName) === -1) {
                        // self.clients.claim();
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
// function update(event) {
//   return caches.open('sw' + event.target.location.href.split("?hash=")[1]).then(function (cache) {
//     return fetch(event.request).then(function (response) {
//       return cache.put(event.request, response.clone()).then(function () {
//         // console.log('sw:update_cache', event.request);
//         return response;
//       });
//     });
//   });
// }
self.addEventListener('fetch', function(event) {
    // console.log('sw:fetch:get:'+event.request.url);
    // ___________ ignore logic ___________________________________________
    const ignoredHosts = ['localhost', 'wfss001.freeli.io'];
    const { hostname } = new URL(event.request.url);
    if (ignoredHosts.indexOf(hostname) !== -1) {
        // console.log('sw:fetch:ignore_host: host: '+hostname+' :req: '+event.request.url);
        return false;
    }
    if (event.request.url.indexOf('/s3Local/') !== -1) {
        // console.log('sw:fetch:ignore_req: host: ' + hostname + ' :req: ' + event.request.url);
        return false;
    }
    // _____________ fetch logic ____________________________________________
    // console.log('sw:fetch:start:',event);
    var restart_time = (event.target.location.href.split("?hash=")[1]);
    event.respondWith(
        caches.open('sw' + restart_time).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                // console.log('sw:fetch:cache:', response);
                return response || fetch(event.request).then(function(response) {
                    // console.log('sw:fetch:network:', event.request.url);
                    return response;
                });
            });
        })
    );
    // event.respondWith(
    //   fetch(event.request).catch(function() {
    //     return caches.match(event.request);
    //   })
    // );
    // event.waitUntil(update(event));
});
// addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           if (response) {
//             return response;     // if valid response is found in cache return it
//           } else {
//             return fetch(event.request)     //fetch from internet
//               .then(function(res) {
//                 return caches.open(CACHE_DYNAMIC_NAME)
//                   .then(function(cache) {
//                     cache.put(event.request.url, res.clone());    //save the response for future
//                     return res;   // return the fetched data
//                   })
//               })
//               .catch(function(err) {       // fallback mechanism
//                 return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
//                   .then(function(cache) {
//                     return cache.match('/offline.html');
//                   });
//               });
//           }
//         })
//     );
//   });  



// self.addEventListener("push", e => {
//   const data = e.data.json();
//   console.log("[SW]: Push Recieved...", data);
//   self.registration.showNotification('New message from Alice', { 
//   body: "Click to receive the call",
//     //   icon: "/images/users/" + data.sender_img,
//     //   requireInteraction: true, 
//     // actions: [  
//     //  {action: 'like', title: 'Like'},  
//     //  {action: 'reply', title: 'Reply'}]  
//   });


// });
// self.addEventListener("push", e => {
//   // //debugger;
//   const data = e.data.json();
//   console.log("[SW]: Push Recieved...", data); 

//   self.registration.showNotification('New message from Alice', {
//     body: "Click to receive the call",
//     icon: '/images/basicAssets/voice_call_for_profile.svg',
//     requireInteraction: true,
//     actions: [
//       { action: 'like', title: 'Like' },
//       { action: 'reply', title: 'Reply' }]
//   });  
//   self.registration.update();


// });

// // self.addEventListener("notificationclose", function(event) {
// //   console.log('[sw]:notification close');
// //   // log send to server
// // });
// self.addEventListener('notificationclick', function(event) {  
//   console.log('[sw]: On notification click: ', event);
//   //debugger;
//   // var messageId = event.notification.data;

//   event.notification.close();  

//   if (event.action === 'like') {  
//     alert('like');
//   }  
//   else if (event.action === 'reply') {  
//     alert('reply');
//   }  
//   else {  
//     clients.openWindow("/messages?reply=" + messageId);  
//   }  
// }, false);
// self.onnotificationclick = function(event) {
//   console.log('On notification click: ', event.notification.tag);
//   //debugger;
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(clients.matchAll({
//     type: "window"
//   }).then(function(clientList) {
//     for (var i = 0; i < clientList.length; i++) {
//       var client = clientList[i];
//       if (client.url == '/' && 'focus' in client)
//         return client.focus();
//     }
//     if (clients.openWindow)
//       return clients.openWindow('/');
//   }));
// };
// self.addEventListener('notificationclick', function (event) {
//   //debugger;
//   console.log("[SW]: Push Click...", event);
//   var messageId = event.notification.data;

//   event.notification.close();

//   if (event.action === 'accept') {
//     // silentlyLikeItem();  
//   }
//   else if (event.action === 'reject') {
//     // clients.openWindow("/messages?reply=" + messageId);  
//   }
//   else {
//     // clients.openWindow("/messages?reply=" + messageId);  
//   }
// }, false);
// self.addEventListener('notificationclick', function(event) {
//   console.log("[SW]: Push Clicked...", event);
//   if (!event.action) {
//     // Was a normal notification click
//     console.log('Notification Click.');
//     return;
//   }

//   switch (event.action) {
//     case 'accept':
//       console.log('User ❤️️\'s accept.');
//       break;
//     case 'reject':
//       console.log('User ❤️️\'s reject.');
//       break;
//     default:
//       console.log(`Unknown action clicked: '${event.action}'`);
//       break;
//   }
// });