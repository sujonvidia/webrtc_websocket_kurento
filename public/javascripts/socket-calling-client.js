var socket = io();
var onlineUserList = [];
bucket_name = 'hayven1';
var idleUsersList = [];
localstorage = [],
    localstorage['get_conversation_history'] = [];
/**
 * When connect event occured
 **/
socket.on('connect', function() {
    console.log('ws connect success');
    // emait the user as 'login' and send 'user_id' and 'user_fullname' which save into database
    // then update the database table field, that user is loged in by ajax calling.
    // console.log('client-socket 9 ', {from: user_id, text: user_fullname});

    socket.emit('login', {
        from: user_id,
        text: user_fullname,
    });

    // logout emait received from server
    socket.on("logout", function(data) {
        console.log('logout fired');

        // console.log("Refresh ", data);
        // removeA(onlineUserList,data.userdata.from);
        // setInterval(function(){
        //     if(onlineUserList.indexOf(data.userdata.from) == -1){
        //         // console.log("logout ", data);
        //         $('.online_'+data.userdata.from).addClass('offline').removeClass('online');
        //         $('.online_'+data.userdata.from).addClass('box-default').removeClass('box-success');
        //         forActiveCallIcon(onlineUserList, participants, $('.side_bar_list_item li.sideActive').attr('data-conversationtype'), $('.side_bar_list_item li.sideActive').attr('data-id'));
        //     }
        // }, 10000);
    });

});

// socket.on('close', function () {
// 	//debugger;
// 	console.log('close');
// });

/* reconnect_attempt attempt */
socket.on('reconnect_attempt', () => {
    console.log('reconnect_attempt');
});

socket.on('reconnect_failed', () => {
    console.log('reconnect_failed');

});

socket.on('reconnect', (attemptNumber) => {
    console.log('reconnect done');
    // alert('reconnected');


    if ($('#participants').css('visibility') == 'hidden') {
        console.log('reconnect reload');
        // alert('reload');
        // location.reload();
        // socket.emit('voip_client_reload_user', {
        //   arr_participants : arr_participants,
        //   conversation_id : conversation_id
        // }, (res) => {

        // });

    } else {
        $('.txt_user_connecting').hide();
    }


});

/**
 * When disconnect event occured
 **/
socket.on('disconnect', function() {
    console.log('Disconnected');
    $('.txt_user_connecting').show();

});

/**
 * after login,
 * receive a welcome message with all online user lists, handled by socket.
 **/


socket.on('online_user_list', function(message) {
    var getUrl = window.location;
    var baseurl = getUrl.origin;
    var email_user_id = user_email.replace(/[^A-Z0-9]/ig, "-");
    // socket.emit('get_bucket_info', {baseurl, email_user_id}, (res)=>{
    //     console.log('socket client side 47', res);
    //     if(res.status){
    //         bucket_name = res.bucket_name;
    //     }
    // });

    $.each(message.text, function(k, v) {
        // console.log(v);
        onlineUserList.push(v);
        // $('.online_'+v).addClass('online').removeClass('offline');
        $('.online_' + v).addClass('online').removeClass('offline');
        $('.online_' + v).addClass('box-success').removeClass('box-default');
    });
});


///for idle users
socket.on('idleUsers', function(data) {
    idleUsersList = data.allIdleUsers;
    $('.online').removeClass('idleUser');
    $('.offline').removeClass('idleUser');
    $.each(idleUsersList, function(k, v) {
        if ($('.online_' + v).hasClass('online')) {
            $('.online_' + v).addClass('idleUser');
        }
    });
});

socket.on('idleUsersForuser', function(data) {
    idleUsersList = data.allIdleUsers;
    $('.online').removeClass('idleUser');
    $.each(idleUsersList, function(k, v) {
        if ($('.online_' + v).hasClass('online')) {
            $('.online_' + v).addClass('idleUser');
        }
    });
})

/**
 * When a new user login,
 * broadcast to other user, that someone joined.
 * and user list marked as online
 **/
socket.on('new_user_notification', function(notification) {
    // console.log(40, notification);
    onlineUserList.push(notification.text.from);
    $('.online_' + notification.text.from).addClass('online').removeClass('offline');
    $('.online_' + notification.text.from).addClass('box-success').removeClass('box-default');

    // if(typeof onlineUserList != 'undefined' && typeof participants != 'undefined' && typeof conversation_type != 'undefined' && typeof conversation_id != 'undefined'){
    forActiveCallIcon(onlineUserList, participants, conversation_type, conversation_id);
    // }
});




// $(window).bind("load", function() {
//   $('a, div, span, p').css('opacity', 1);
// });