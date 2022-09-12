var express = require('express');
var router = express.Router();
var highlight = require('highlight');
var validator = require('validator');
var vgd = require('vgd');
var _ = require('lodash');
const webpush = require('web-push'); //requiring the web-push module

var Stripe_Publishable_Key = process.env.Stripe_Publishable_Key ? process.env.Stripe_Publishable_Key : '';
var Stripe_Secret_Key = process.env.Stripe_Secret_Key ? process.env.Stripe_Secret_Key : '';
var stripe = require('stripe')(Stripe_Secret_Key)

var { models } = require('./../config/db/express-cassandra');
var {
    get_msgid_info,
    get_convid_info,
    set_callingData,
    get_callingData,

    getGuestStatus,
    get_running_calls,
    getUserIsBusy,
    del_callingData,
    add_callingData,
    getRoomInfo,
    getUserSessionByUid,
    getAllUsers,
    set_busyData,
    get_busyData,
    get_busyTimer,
    set_ringingData,
    get_ringingData,
    del_ringingData,
    add_ringingData,
    get_call_user_role,
    savePushSubscription,
    get_kurentoroom,
    msgdb_alluser
} = require('./../utils/voice_video');

var db_filter = { raw: true, allow_filtering: true };

function get_device_type(req) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(req.headers['user-agent'])) { var devicetype = "android"; } else { var devicetype = "web"; }
    return devicetype;
}

function get_user_info(all_user_data, usrid, req) {
    if (all_user_data) {
        var user_data = all_user_data.filter(user => user.id.toString() === usrid.toString());
        if (user_data.length > 0) {
            var user_fullname = user_data[0].fullname;
            var user_img = user_data[0].img;
            var user_email = user_data[0].email;
        } else {
            var user_fullname = req.session.user_fullname ? req.session.user_fullname : '';
            var user_img = req.session.user_img ? req.session.user_img : 'img.png';
            var user_email = req.session.user_email ? req.session.user_email : 'guest@guest.com';
        }
        var devicetype = get_device_type(req);
        if (devicetype == 'android' && /wv/i.test(req.headers['user-agent'])) {
            req.session.login = true;
            req.session.user_id = usrid;
            req.session.user_fullname = user_fullname;
            req.session.user_img = user_img;
            req.session.user_email = user_email;
            console.log('voip:router:webview:', req.session);
        }
        var ret_data = { id: usrid, name: user_fullname, img: user_img, email: user_email, devicetype: devicetype };
        return ret_data;

    } else {
        return false;
    }

}
async function call_data_builder(conf_data, ring_data = false) {
    if (!ring_data) var ring_data = await get_ringingData(conf_data.conversation_id);
    return {
        conf_data: conf_data,
        url: 'hayven',
        title: 'Call',
        bodyClass: 'chat',
        highlight: highlight,
        page_title: 'Workfreeli | Call',
        restart_time: restart_time,
        has_login: true, // ================
        has_endpoint: false,
        // has_session: false,
        user_fullname: conf_data.user_fullname,
        user_email: conf_data.user_email,
        cleanup_needed: true,
        // close_needed: true,
        android_emit: false,
        user_status: 'pending',
        media_flow: false,
        user_socket: false,
        kurento_status: 'pending',
        init_id: ring_data ? ring_data.init_id : conf_data.user_id,
        call_option: ring_data ? ring_data.call_option : 'ring',
        call_join: false,
        conversation_img: ring_data ? ring_data.conversation_img : 'false',
        conversation_status: ring_data ? ring_data.conversation_status : 'false',
        conversation_mute: ring_data ? ring_data.conversation_mute : 'false',
        conversation_pin: ring_data ? ring_data.conversation_pin : 'false'
    };
}
// jitsi
router.get('/meeting', async function(req, res, next) {
    try {
        res.render('jitsi_meet', {
            user_fullname: req.session.user_fullname ? req.session.user_fullname : 'Guest User',
            user_email: req.session.user_email ? req.session.user_email : 'Guest User'
        });
    } catch (err) {
        res.send(err);
        return;
    }
});

// sender
router.get('/sender/:uid/:cid', async function(req, res, next) {
    try {
        var usrid = req.params.uid;
        var conversation_id = req.params.cid;
        var ring_data = await get_ringingData(conversation_id);
        var room = await get_kurentoroom(req.params.cid);
        var alluser_data = await msgdb_alluser();
        var user_data = get_user_info(alluser_data, usrid, req);
        var call_media_type = ring_data.call_type_route || 'video';
        var get_role = get_call_user_role(req.session.login, room, ring_data.participants_admin, usrid);
        var user_fullname = get_role.user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
        var res_data = await call_data_builder({
            link_type: 'app',
            // allUserdata: alluser_data,
            join_who: 'initiator',
            user_role: get_role.user_role,
            call_running: get_role.call_running,
            guest_status: 'no',
            company_id: ring_data.company_id,
            tabid: models.uuid().toString(),
            conference_id: ring_data.conference_id,
            tokencount: usrid,
            privacy: ring_data.privacy,
            user_id: user_data.id,
            user_fullname: user_fullname,
            user_email: user_data.email,
            user_img: user_data.img,
            devicetype: user_data.devicetype,
            prev_convid: 0,
            callwaiting: 'no',
            conversation_init: ring_data.conversation_init.toLowerCase(),
            conversation_type: ring_data.conversation_type.toLowerCase(), // new
            waiting_running: false,
            msgid: ring_data.msgid,
            repid: ring_data.repid,
            initiator_name: ring_data.initiator_name,
            set_calltype: call_media_type,
            call_type_route: call_media_type,
            arr_participants: ring_data.arr_participants,
            reloadstatus: 'newconf',
            convname: ring_data.convname,
            conversation_id: req.params.cid, // new
            room_id: ring_data.room_id, // new
            room_name: ring_data.room_name ? ring_data.room_name : '', // new
            file_server: process.env.FILE_SERVER,
            sessionID: req.session.id,
            participants_admin: ring_data.participants_admin,
            participants_all: ring_data.participants_all
        }, ring_data);
        await del_callingData(usrid);
        await set_callingData(usrid, res_data);
        res_data.conf_data.allUserdata = alluser_data;

        res.render('videoconf-call', res_data);
    } catch (err) {
        res.send(err);
        return;
    }
});
// receiver
router.get('/receiver/:uid/:cid', async function(req, res, next) {
    try {
        var usrid = req.params.uid;
        console.log('voip:router:receiver:' + usrid);
        var conversation_id = req.params.cid;
        var ring_data = await get_ringingData(conversation_id);
        var call_media_type = ring_data.call_type_route || 'video';
        var privacy = ring_data.privacy;
        var convname = ring_data.convname;
        var call_participants = ring_data.arr_participants;
        var alluser_data = await msgdb_alluser();
        var user_data = get_user_info(alluser_data, usrid, req);
        var partner_data = get_user_info(alluser_data, ring_data.rootId, req);

        var conference_id = ring_data.conference_id;
        var room = await get_kurentoroom(req.params.cid);
        if (!room) { res.send('Caller not ready.'); return; } else {
            var get_role = get_call_user_role(req.session.login, room, ring_data.participants_admin, usrid);
            var user_fullname = get_role.user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
            var res_data = await call_data_builder({
                link_type: 'app',
                tabid: models.uuid().toString(),
                // allUserdata: alluser_data,
                user_role: get_role.user_role,
                call_running: get_role.call_running,
                guest_status: 'no',
                msgid: ring_data.msgid,
                repid: ring_data.repid,
                initiator_name: ring_data.initiator_name,
                set_calltype: call_media_type,
                call_type_route: call_media_type,
                arr_participants: call_participants,
                reloadstatus: 'newconf',
                convname: convname,
                conversation_id: req.params.cid, // new
                conversation_init: ring_data.conversation_init.toLowerCase(),
                conversation_type: ring_data.conversation_type.toLowerCase(), // new
                room_id: ring_data.rootId, // new
                room_name: partner_data.name ? partner_data.name : '', // new
                company_id: ring_data.company_id,
                conference_id: conference_id,
                join_who: 'participant',
                tokencount: usrid,
                privacy: privacy,

                user_id: user_data.id,
                user_fullname: user_fullname,
                user_email: user_data.email,
                user_img: user_data.img,
                devicetype: user_data.devicetype,

                prev_convid: 0,
                callwaiting: 'no',
                waiting_running: false,
                file_server: process.env.FILE_SERVER,
                sessionID: req.session.id,
                participants_admin: ring_data.participants_admin,
                participants_all: ring_data.participants_all
            }, ring_data);
            await del_callingData(usrid);
            await set_callingData(usrid, res_data);
            res_data.conf_data.allUserdata = alluser_data;
            res.render('videoconf-call', res_data);

        }
    } catch (err) {
        res.send(err);
        return;
    }
});
router.get('/payment_get', function(req, res, next) {
    if (Stripe_Publishable_Key) {
        res.render('payment', {
            key: Stripe_Publishable_Key
        });
    } else {
        res.send("stripe config not set.")
    }
});
router.post('/purchase', function(req, res) {

    stripe.charges.create({
        amount: 500,
        source: req.body.stripeTokenId,
        currency: 'usd'
    }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Payment Successful.' })
    }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
    })

})
router.post('/create-checkout-session', async(req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Workfreeli',
                },
                unit_amount: 500,
            },
            quantity: 1,
        }, ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });

    res.json({ id: session.id });
});
router.post('/payment_post', function(req, res) {
    if (Stripe_Secret_Key) {
        stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken,
                name: 'Md. Mahfuz Hosain',
                address: {
                    line1: 'Mirpur-2',
                    postal_code: '1216',
                    city: 'Dhaka',
                    state: 'Dhaka',
                    country: 'Bangladesh',
                }
            })
            .then((customer) => {
                return stripe.charges.create({
                    amount: 500, // Charing Rs 25 
                    description: 'Freeli test payment',
                    currency: 'USD',
                    customer: customer.id
                });
            })
            .then((charge) => {
                res.send("Success") // If no error occurs 
            })
            .catch((err) => {
                res.send(err) // If some error occurs 
            });

    } else {
        res.send("stripe config not set.")
    }


})



// ===================== Funtions ===============================================================================
async function call_new_personal(usrid, conversation_id, call_participants, info_personal, res, req, partner_id, conference_id, company_id, call_media_type, link_type) {
    var alluser_data = await msgdb_alluser();
    var user_data = get_user_info(alluser_data, usrid, req);
    if (req.session.login) { var user_role = 'participant'; } else { var user_role = 'guest'; }
    var user_fullname = user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
    var res_data = await call_data_builder({
        link_type: link_type,
        // allUserdata: alluser_data,
        user_role: user_role,
        guest_status: req.session.guest_status,
        company_id: company_id,
        tabid: models.uuid().toString(),
        conference_id: conference_id,
        join_who: 'guest',
        tokencount: usrid,
        sessionID: req.session.id,
        privacy: 'public',
        user_id: user_data.id,
        user_fullname: user_fullname,
        user_email: user_data.email,
        user_img: user_data.img,
        devicetype: user_data.devicetype,
        prev_convid: 0,
        callwaiting: 'no',
        waiting_running: false,
        call_running: false,
        conversation_init: 'personal',
        conversation_type: 'guest', // new
        msgid: '0',
        repid: '0',
        initiator_name: user_data.name,
        set_calltype: call_media_type,
        call_type_route: call_media_type,
        arr_participants: call_participants,
        reloadstatus: 'newconf',
        convname: info_personal ? info_personal.fullname : '',
        conversation_id: conversation_id, // new
        room_id: partner_id, // new
        room_name: info_personal ? info_personal.fullname : '', // new
        file_server: process.env.FILE_SERVER,
        participants_admin: [partner_id],
        participants_all: [partner_id]
    });
    await del_callingData(usrid);
    await set_callingData(usrid, res_data);
    res_data.conf_data.allUserdata = alluser_data;
    res.render('videoconf-call', res_data);
    // });
}
async function call_join_personal(usrid, conversation_id, res, req, partner_id, conference_id, call_participants, company_id, call_media_type, link_type) {
    var ring_data = await get_ringingData(conversation_id);
    var alluser_data = await msgdb_alluser();
    var user_data = get_user_info(alluser_data, usrid, req);
    var room = await get_kurentoroom(conversation_id);
    var get_role = get_call_user_role(req.session.login, room, [partner_id], usrid);
    if (ring_data.call_option != 'window' && get_role.user_role == 'participant' && ring_data.participants_all.indexOf(usrid) === -1) {
        res.send('User is busy.');
        return;
    }
    var user_fullname = get_role.user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
    var res_data = await call_data_builder({
        link_type: link_type,
        // allUserdata: alluser_data,
        user_role: get_role.user_role,
        call_running: get_role.call_running,
        guest_status: req.session.guest_status,
        msgid: ring_data.msgid,
        repid: ring_data.repid,
        initiator_name: ring_data.initiator_name,
        set_calltype: call_media_type,
        call_type_route: call_media_type,
        arr_participants: call_participants,
        convname: ring_data.convname,
        reloadstatus: 'newconf',
        conversation_id: ring_data.conversation_id,
        conversation_type: ring_data.conversation_type.toLowerCase(),
        room_id: ring_data.room_id,
        room_name: ring_data.room_name, // new
        company_id: company_id,
        tabid: models.uuid().toString(),
        conference_id: conference_id,
        join_who: 'guest',
        tokencount: usrid,
        privacy: ring_data.privacy,

        user_id: user_data.id,
        user_fullname: user_fullname,
        user_email: user_data.email,
        user_img: user_data.img,
        devicetype: user_data.devicetype,

        prev_convid: 0,
        callwaiting: 'no',
        waiting_running: false,
        conversation_init: 'personal',
        file_server: process.env.FILE_SERVER,

        sessionID: req.session.id,
        participants_admin: [partner_id],
        participants_all: ring_data.participants_all
    }, ring_data);
    await del_callingData(usrid);
    await set_callingData(usrid, res_data);
    res_data.conf_data.allUserdata = alluser_data;
    res.render('videoconf-call', res_data);

}
async function call_new_group(usrid, conversation_id, call_participants, res, req, conference_id, group_info, company_id, call_media_type, link_type) {
    var alluser_data = await msgdb_alluser();
    var user_data = get_user_info(alluser_data, usrid, req);
    var room = await get_kurentoroom(conversation_id);
    var get_role = get_call_user_role(req.session.login, room, group_info.participants_admin, usrid);
    var user_fullname = get_role.user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
    var res_data = await call_data_builder({
        link_type: link_type,
        // allUserdata: alluser_data,
        user_role: get_role.user_role,
        call_running: get_role.call_running,
        guest_status: req.session.guest_status,
        company_id: company_id,
        tabid: models.uuid().toString(),
        conference_id: conference_id,
        join_who: 'guest',
        set_calltype: call_media_type,
        call_type_route: call_media_type,
        tokencount: usrid,
        sessionID: req.session.id,
        privacy: group_info.privacy,
        user_id: user_data.id,
        user_fullname: user_fullname,
        user_email: user_data.email,
        user_img: user_data.img,
        devicetype: user_data.devicetype,
        prev_convid: 0,
        callwaiting: 'no',
        waiting_running: false,
        conversation_init: 'group',
        conversation_type: 'guest', // new
        conversation_id: conversation_id, // new
        msgid: '0',
        repid: '0',
        initiator_name: user_data.name,
        arr_participants: call_participants,
        reloadstatus: 'newconf',
        convname: group_info.title,
        room_id: usrid, // new
        room_name: '', // new
        file_server: process.env.FILE_SERVER,
        participants_admin: group_info.participants_admin,
        participants_all: group_info.participants
    });
    await del_callingData(usrid);
    await set_callingData(usrid, res_data);
    res_data.conf_data.allUserdata = alluser_data;
    res.render('videoconf-call', res_data);
}

async function call_join_group(usrid, conversation_id, res, req, company_id, call_media_type, link_type) {
    var ring_data = await get_ringingData(conversation_id);
    var alluser_data = await msgdb_alluser();
    var user_data = get_user_info(alluser_data, usrid, req);
    var room = await get_kurentoroom(conversation_id);
    var get_role = get_call_user_role(req.session.login, room, ring_data.participants_admin, usrid);
    var user_fullname = get_role.user_role == 'guest' ? (req.cookies["call.guest.fullname"] ? req.cookies["call.guest.fullname"] : '') : user_data.name;
    if (get_role.user_role == 'participant') {
        if (ring_data.participants_all.indexOf(usrid) === -1) {
            get_role.user_role = 'guest';
        }
    }
    var res_data = await call_data_builder({
        link_type: link_type,
        // allUserdata: alluser_data,
        user_role: get_role.user_role,
        call_running: get_role.call_running,
        guest_status: req.session.guest_status,
        company_id: company_id,
        tabid: models.uuid().toString(),
        conference_id: ring_data.conference_id,

        user_id: user_data.id,
        user_fullname: user_fullname,
        user_email: user_data.email,
        user_img: user_data.img,
        devicetype: user_data.devicetype,

        join_who: 'guest',
        tokencount: usrid,
        privacy: ring_data.privacy,

        prev_convid: 0,
        callwaiting: 'no',
        waiting_running: false,
        conversation_id: ring_data.conversation_id, // new
        conversation_type: ring_data.conversation_type.toLowerCase(), // new
        conversation_init: ring_data.conversation_init.toLowerCase(),
        msgid: ring_data.msgid,
        repid: ring_data.repid,
        initiator_name: ring_data.initiator_name,
        set_calltype: call_media_type,
        call_type_route: call_media_type,
        arr_participants: _.union([usrid], ring_data.participants_all),
        convname: ring_data.convname,
        reloadstatus: 'newconf',
        room_id: ring_data.room_id, // new
        room_name: ring_data.room_name, // new
        file_server: process.env.FILE_SERVER,
        sessionID: req.session.id,
        participants_admin: ring_data.participants_admin,
        participants_all: ring_data.participants_all
    }, ring_data);
    await del_callingData(usrid);
    await set_callingData(usrid, res_data);
    res_data.conf_data.allUserdata = alluser_data;
    res.render('videoconf-call', res_data);
}

router.post("/subscribe", (req, res) => {
    // restart_time = Date.now();
    // Get pushSubscription object
    const subscription = req.body;
    user_subs = JSON.parse(subscription.subs);
    var user_id = subscription.user_id;
    // savePushSubscription(user_id, user_subs);
    // Send 201 - resource created
    res.status(201).json({});

    // // Create payload
    // const payload = JSON.stringify({ title: "Push Test" });
    // // Pass object into sendNotification
    // webpush
    //   .sendNotification(user_subs, payload)
    //   .catch(err => console.error(err));
});
router.post("/subscribe2", (req, res) => {
    // Send 201 - resource created
    res.status(201).json({ 'restart_time': restart_time });
});

user_token_store = {}

router.post("/subscribe_token", (req, res) => {
    if (!user_token_store.hasOwnProperty(req.body.user_id)) user_token_store[req.body.user_id] = [];
    if (user_token_store[req.body.user_id].indexOf(req.body.token) === -1) user_token_store[req.body.user_id].push(req.body.token);
    res.status(201).json({ 'status': 'ok' });
});
router.post("/action", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // // Create payload
    // const payload = JSON.stringify({ title: "Push Test" });
    // // Pass object into sendNotification
    // webpush
    //   .sendNotification(JSON.parse(subscription.subs), payload)
    //   .catch(err => console.error(err));
});
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = '') => {
    webpush.sendNotification(subscription, dataToSend)
}
router.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription //get subscription from your databse here.
    const message = 'Hello World'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
});
// link : use in last
router.get('/:conference_id?/:call_media_type?/:link_type?/:uid?', async function(req, res, next) {
    if (req.session.user_id) { var usrid = req.session.user_id; } else if (req.params.uid) {
        var usrid = req.params.uid;
        req.session.user_id = usrid;
    } else {
        var usrid = models.uuid().toString();
        req.session.user_id = usrid;
    }
    var conference_id = req.params.conference_id;
    req.session.conference_id = conference_id;
    var call_media_type = req.params.call_media_type || 'audio';
    var link_type = req.params.link_type || 'guest';
    var cvtype = conference_id.split("_")[1];
    if (cvtype == 'group') {
        models.instance.Conversation.findOne({ conference_id: conference_id }, db_filter, async function(err, group_info) {
            if (group_info) { // group conference info
                var conversation_id = group_info.conversation_id.toString();
                var company_id = group_info.company_id.toString();
                var room = await get_kurentoroom(conversation_id);
                if ((await get_busyData(usrid)).status || get_busyTimer(usrid)) { res.send('You are busy.'); return; }
                var call_data = null;
                if (room) {
                    for (let i in room.participants) {
                        if (room.participants[i].user_role == 'moderator') {
                            call_data = await get_callingData(i);
                            break;
                        }
                    }
                }
                if (call_data) {

                    req.session.guest_status = req.session.guest_status ? req.session.guest_status : 'pending';
                    call_join_group(usrid, conversation_id, res, req, company_id, call_media_type, link_type);
                } else { // new group call
                    var call_participants = _.union([usrid], group_info.participants);
                    req.session.guest_status = req.session.guest_status ? req.session.guest_status : 'pending';
                    call_new_group(usrid, conversation_id, call_participants, res, req, conference_id, group_info, company_id, call_media_type, link_type);
                }
            } else {
                res.send('Database not responding.');
                return;
            }
        });
    } else if (cvtype == 'personal') {
        models.instance.Users.findOne({ conference_id: conference_id }, db_filter, async function(err, info_personal) {
            if (info_personal) { // personal conference info
                var partner_id = info_personal.id.toString();
                var company_id = info_personal.company_id.toString();
                if ((await get_busyData(usrid)).status || get_busyTimer(usrid)) { res.send('You are busy.'); return; }
                if (partner_id != usrid) {
                    var call_data = await get_callingData(partner_id);
                    req.session.guest_status = req.session.guest_status ? req.session.guest_status : 'pending';
                    if (call_data && call_data.kurento_status != "leave") {
                        if (call_data && call_data.conf_data && call_data.conf_data.conference_id == conference_id) {
                            var conversation_id = call_data.conf_data.conversation_id;
                            var call_participants = [partner_id, usrid];
                            call_join_personal(usrid, conversation_id, res, req, partner_id, conference_id, call_participants, company_id, call_media_type, link_type);
                        } else { res.send('User is busy in another call.'); return; }
                    } else { // new personal call
                        var conversation_id = partner_id;
                        var call_participants = [partner_id, usrid];
                        call_new_personal(usrid, conversation_id, call_participants, info_personal, res, req, partner_id, conference_id, company_id, call_media_type, link_type);
                    }
                } else {
                    res.send('You are busy.');
                    return;
                }

            } else {
                res.send('Database not responding.');
                return;
            }
        });
    }
});

module.exports = router;