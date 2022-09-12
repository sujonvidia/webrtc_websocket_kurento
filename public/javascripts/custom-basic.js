// const moment = require("moment");

var tempUpdateAction, tempActivityCreatedAt, tempActivityCreatedBy;
var myAllMuteConvid = [];
var myAllMuteConv = [];
var myAllDayMuteConv = [];
var notificationMuteEnd = {};
var uploadPopup_visible = '';
var my_all_personal_conversationId = getCookie('myAllPerConvId').split(',');
var myAllGrpConvId = getCookie('myAllGrpConvId').split(',');
var set_default = () => {
    directMsgCont = 1;
    directMsgName = "";
    directMsgUUID = "";
    directMsgImg = "";
    directMsgSubtitle = "";
    memberList = [];
    memberListUUID = [];
    $('.add-direct-member').html("");
}


var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-="
var checkSpecialChars = function(string) {
    for (i = 0; i < specialChars.length; i++) {
        if (string.indexOf(specialChars[i]) > -1) {
            return true
        }
    }
    return false;
}

var profileNav = () => {

    if ($('.profilenavMainSection').is(":visible") == true) {
        $('.profilenavMainSection').hide();
        $('.profile_nav img.nav_ico').css('transform', 'rotate(0deg)');

        $('.right-section').css('z-index', '4');
        $('.chat-header').css('z-index', '4');
        $('header.main-header').attr('style', '');
    } else {
        $('.profilenavMainSection').show();
        $('.profile_nav img.nav_ico').css('transform', 'rotate(180deg)');
        $('.right-section').css('z-index', '0');
        $('.chat-header').css('z-index', '0');
        if ($('#updateUserProfile').is(':visible')) {
            $('header.main-header').css('z-index', 1000);
        }

        var dontDisturb = localStorage.getItem('dontDisturb' + user_id);
        dontDisturb = JSON.parse(dontDisturb);

        // if (dontDisturb == null || dontDisturb.length == 0) {
        // 	$('.dontDisturb').addClass('OFF');
        // 	$('#turnOffSound').prop('checked',false);
        // }else{
        // 	if (dontDisturb.length > 1) {			
        // 		$('.dontDisturb').addClass('ON')
        // 		$('#turnOffSound').prop('checked',true);
        // 	}
        // }

        var mConv = $('#connectAsideContainer li.mute_conv');

        if (mConv.length > 0) {
            $('.dontDisturb').addClass('ON').removeClass('OFF');
            $('#turnOffSound').prop('checked', true);
        } else {
            $('.dontDisturb').addClass('OFF').removeClass('ON');
            $('#turnOffSound').prop('checked', false);
        }

    }

}

$(document).mouseup(function(e) {
    var profileNavis = $(".profile_nav");
    var profileNavContent = $('.profilenavMainSection');
    var createEventPop = $('.create-event-popup');
    var slashBell = $('.mute_bell');
    var sidebarBellTooltip = $('.customTooltipSidebar');
    var filterPannel = $('.filterMainContainer');
    var container = $('#addTeamSuggestedList');
    var headDrowpTodo = $('#headActionTab');
    var noteBoxTodo = $('#live-note');
    var createDirMsgContainer = $('#createDirMsgContainer .suggested-type-list');
    var teamListView = $('.teamListView');
    var tagTeamPopup = $('.tagTeamPopup');

    // if the target of the click isn't the container nor a descendant of the container
    if (!createDirMsgContainer.is(':visible')) {
        if (!createDirMsgContainer.is(e.target) && createDirMsgContainer.has(e.target).length === 0) {
            createDirMsgContainer.css('display', 'block');
        }
    }

    if (!noteBoxTodo.is(e.target) && noteBoxTodo.has(e.target).length === 0) {
        if (noteBoxTodo.is(':visible') == true) {
            // hideNoteBox()
        }
    }

    if (teamListView.is(':visible')) {
        if (!teamListView.is(e.target) && teamListView.has(e.target).length === 0) {
            teamListView.hide();
        }
    }

    if (tagTeamPopup.is(':visible')) {
        if (!tagTeamPopup.is(e.target) && tagTeamPopup.has(e.target).length === 0) {
            tagTeamPopup.hide();
        }
    }

    if (!container.is(e.target) && container.has(e.target).length === 0 && !$('.add-team-member').is(e.target)) {
        $('#addTeamSuggestedList').hide();
        $('#createChannelContainer .submitBtn').show();
        $('#createChannelContainer .member_list').show();
        $('#createChannelContainer .adminList').show();
        $('.add-team-member').val("");
        $('.remove.searchClear').hide();
    } else {
        $('.remove.searchClear').hide();
    }

    // if the target of the click isn't the container nor a descendant of the container
    if (!profileNavis.is(e.target) && profileNavis.has(e.target).length === 0) {
        if (profileNavContent.is(':visible') == true) {
            profileNav();
        }
    }

    if (!createEventPop.is(e.target) && createEventPop.has(e.target).length === 0) {

        if ($("#calenderPicker").is(":visible") == true) {
            $("#calenderPicker").hide()
        } else {
            createEventPop.hide();
        }
        $('#CreateEvent').show();
    }

    if (sidebarBellTooltip.is(':visible')) {
        if (!sidebarBellTooltip.is(e.target) && sidebarBellTooltip.has(e.target).length === 0 && !slashBell.is(e.target)) {
            sidebarBellTooltip.remove();
        }
    }

    if (!filterPannel.is(e.target) && filterPannel.has(e.target).length === 0 && !$('.side-bar-filter-icon').is(e.target)) {
        filterPannel.hide();
        $('.side-bar-filter-icon').removeClass('active');
        $('.chooseTag').hide();
    }
    if (!$('.checklist_fil').is(e.target) && $('.checklist_fil').has(e.target).length === 0) {
        // filterPannel.hide();
        $('.checklist_fil').removeClass('activeFil');
        // $('.chooseTag').hide();
    }

    if ($('.filterItem .remove').is(e.target)) {
        filterPannel.hide();
        $('.side-bar-filter-icon').removeClass('active');
        $('.chooseTag').hide();
    }

    if ($('#headActionDropdown').is(':visible')) {
        if (!headDrowpTodo.is(e.target) && headDrowpTodo.has(e.target).length === 0) {
            viewDropDown('#headActionDropdown');
        }
    }

});



$('.event-cancel-btn').click(function() {
    $('.create-event-popup').hide();
    $("#CreateEvent").show();
});


var sideBarActiveInactive = (event) => {
    $('.side_bar_list_item li').removeClass('sideActive');
    $('.side_bar_list_item li').removeClass('selected');
    $('.side_bar_list_item li').children(".hash, .online, .offline, .lock, .toDo, .protected").css('left', '12px');
    $(event.target).addClass('sideActive');
    $(event.target).addClass('selected');
    $(event.target).children('.remove').hide();
    $(event.target).children(".hash, .online, .offline, .lock, .toDo, .protected").css('left', '6px');
}

//new scroll design

var overlayScrollbars = () => {
    $(function() {
        $('.overlayScrollbars').overlayScrollbars({
            className: "os-theme-dark",
            resize: "none",
            sizeAutoCapable: true,
            paddingAbsolute: true,
            overflowBehavior: {
                x: "hidden",
                y: "scroll"
            },
            scrollbars: {
                visibility: "auto",
                autoHide: "move",
                autoHideDelay: 500,
                dragScrolling: true,
                clickScrolling: true,
                touchSupport: true
            },
        });
    });
}

overlayScrollbars();

var overlayScrollbars2 = () => {
    $(function() {
        $('.overlayScrollbars2').overlayScrollbars({
            className: "os-theme-round-light",
            resize: "none",
            sizeAutoCapable: true,
            paddingAbsolute: true,
            overflowBehavior: {
                x: "hidden",
                y: "scroll"
            },
            scrollbars: {
                visibility: "auto",
                autoHide: "never",
                autoHideDelay: 500,
                dragScrolling: true,
                clickScrolling: true,
                touchSupport: true
            },
        });
    });
}

overlayScrollbars2();

var _for_x_scroll = () => {
    $(function() {
        $('.for_x_scrolls').overlayScrollbars({
            className: "os-theme-dark",
            resize: "none",
            sizeAutoCapable: true,
            paddingAbsolute: true,
            overflowBehavior: {
                x: "scroll",
                y: "scroll"
            },
            scrollbars: {
                visibility: "auto",
                autoHide: "move",
                autoHideDelay: 500,
                dragScrolling: true,
                clickScrolling: true,
                touchSupport: true
            },
            callbacks: {
                onScrollStart: onscrollFix()
            }
        });
    });
}

_for_x_scroll();
overlayScrollbars();

///close all popup

function closeAllPopUp() {
    if ($('#delete_msg_div').is(':visible') && $('#threadReplyPopUp').is(':visible')) {
        $('#delete_msg_div').hide();
        return false;
    } else if ($('.intercom-composer-emoji-popover').hasClass('active') && $('#threadReplyPopUp').is(':visible')) {
        $('.intercom-composer-emoji-popover').removeClass('active');
        return false;
    }

    if ($('#repChatFileUpload').is(":visible") == true) {
        repcloseUploadPopup()
    } else {
        if ($('#threadReplyPopUp').is(":visible") == true && $('.emoji_div').is(":visible") == false) {
            // if(window.name !='calling') 
            if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
                $('#threadReplyPopUp').hide();
                if ($('#workFreeliToaster').attr('data-id') == 'viewFileThreadId') {
                    showFreeliToaster(false);
                }
                placeCaretAtEnd(document.getElementById('msg'));
            }
        } else {
            if ($('.emoji_div').is(":visible") == true) {
                $('.emoji_div').hide();
            }
        };
    }

    if ($('#delete_msg_div').is(':visible') == true || $('#delete_task_msg_div').is(':visible') == true) {
        $('#updateAction').val(tempUpdateAction);
        $('#actCre').val(tempActivityCreatedAt);
        $('#activityCreatedAt').val(tempActivityCreatedBy);
        $('#delete_msg_div').hide();
        $('#delete_task_msg_div').hide();
        $('.delete_msg_div').removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle');
    }

    if ($('#member_add_on_fly').is(':visible') == true) {
        $('#member_add_on_fly').hide();
    }

    if ($('#exceed_value').is(':visible') == true) {
        $('#exceed_value').hide();
    }

    if ($('#restricted_mode').is(':visible') == true) {
        $('#restricted_mode').hide();
    }

    if ($('#stak_table').is(':visible') == true) {

        $('.workspaceform').show();
        $('#stak_table').hide();
        $(".workspaceform .taskLoader2").after($('#stak_table .body .subtaskContainer').clone());
        $('#stak_table .body').html("");
    }

    if ($('#createDirMsgContainer').is(":visible")) {
        $('#createDirMsgContainer').hide();
        $('.add-direct-member').val("");
    }

    if ($('#completed_activity_div').is(':visible') == true) {
        $("#amazonWishlist").prop('checked', false);
        $('#completed_activity_div').hide();
    }
    if ($('#reopen_activity_div').is(':visible') == true) {
        $("#amazonWishlist").prop('checked', true);
        $('#reopen_activity_div').hide();
    }

    if ($('#delete_to_do_div').is(':visible') == true) {
        $('#updateAction').val(tempUpdateAction);
        $('#actCre').val(tempActivityCreatedAt);
        $('#activityCreatedAt').val(tempActivityCreatedBy);
        $('.del_msg_title').text('Delete message');
        $('.forcreateTodo').remove();
        $('#delete_to_do_div').hide();
        $('.btn-cancel').show();
    }

    if (!$('#memberListBackWrap').is(':visible')) {
        if ($('#createToDoPopup').is(":visible")) {
            if ($("#toggle_area").is(":visible")) {
                if ($('#dueDatePickerDiv').is(":visible")) {
                    $('#dueDatePickerDiv').hide();
                    $('#dueDatePicker').css('pointer-events', 'auto');
                } else {
                    viewtodoAdOp();
                }
            } else {
                $('#createToDoPopup').hide();
            }
        }
    } else {
        $('#memberListBackWrap').hide();
    }

    if ($('#delete_to_do_div').is(':visible')) {
        $('#delete_to_do_div').hide();
    }

    $("#team-name").val("");
    $("#ml-admintype").hide();
    $("#ml-membertype").hide();
    $("#defaultRoom").remove();
    $("#ml-listHA").html('');
    $("#ml-listHl").html('');
    $("#grpPrivacy").prop("checked", false);
    $('.no_of_user_left_to_add span').text('10');
    set_default();
    thread_id = '';
}

//after mouse enter

var popupMouseEnter = () => {
        $('.suggested-list li').mouseenter(function() {
            $('.suggested-list .showEl').removeClass('selected');
            $('.suggested-list li').removeClass('default');
            $(this).addClass('selected');

        });
        $('.memberList .list').mouseenter(function() {
            $('.memberList .showEl').removeClass('selected');
            $('.memberList .list').removeClass('default');
            $(this).addClass('selected');

        });
        $('.notification_mute_time label').mouseenter(function() {
            $('.notification_mute_time  .showEl').removeClass('selected');
            $('.notification_mute_time  label').removeClass('default');
            $(this).addClass('selected');
        });
    }
    // start script for permission browser notification
$('#allowNotification').on('click', function() {
    var permission = Notification.permission;
    Notification.requestPermission(function(permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            $('#headNoficationDialog').hide();
            $('.chat-header,.main-calendar-header').css('top', '64px');
            $('.chat-page').css('height', 'calc(-229px + 100vh)');
            // $('aside').css('height', 'calc(-64px + 100vh)');
            $('.fileSliderBackWrap').css('height', 'calc(100% - 64px)');
            $('#right-section-area').css('top', '64px');
            // registerPushService();
        } else {
            $('#headNoficationDialog').hide();
            $('.chat-header,.main-calendar-header').css('top', '64px');
            // $('aside').css('height', 'calc(-64px + 100vh)');
            $('.chat-page').css('height', 'calc(-229px + 100vh)');
            $('.fileSliderBackWrap').css('height', 'calc(100% - 64px)');
            $('#right-section-area').css('top', '64px');
        }
    });
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
        });
    }
});

$("#denyNotification").on('click', function() {
    // debugger
    var notification = getCookie("notification_status");
    setCookie("notification_status", "block", 30);
    $('#headNoficationDialog').hide();
    $('.chat-header,.main-calendar-header').css('top', '64px');
    // $('aside').css('height', 'calc(-64px + 100vh)');
    $('.chat-page').css('height', 'calc(-229px + 100vh)');
    $('.fileSliderBackWrap').css('height', 'calc(100% - 64px)');
    $('#right-section-area').css('top', '64px');

});
var notificationPermission = () => {
    var permission = Notification.permission;
    if (Notification.permission === "default") {
        $('#headNoficationDialog').css('display', 'flex');
    }
    if (Notification.permission === 'denied') {
        $('#headNoficationDialog').hide();
        $('.chat-header,.main-calendar-header').css('top', '64px');
        // $('aside').css('height', 'calc(-64px + 100vh)');
        $('.chat-page').css('height', 'calc(-229px + 100vh)');
    }
    if (Notification.permission === "granted") {
        $('#headNoficationDialog').hide();
        $('.chat-header,.main-calendar-header').css('top', '64px');
        // $('aside').css('height', 'calc(-64px + 100vh)');
        $('.chat-page').css('height', 'calc(-229px + 100vh)');
    }
    var notification = getCookie("notification_status");
    if (notification != "") {
        $('#headNoficationDialog').hide();
        $('.chat-header,.main-calendar-header').css('top', '64px');
        // $('aside').css('height', 'calc(-64px + 100vh)');
        $('.chat-page').css('height', 'calc(-229px + 100vh)');
    }
}
// debugger
if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
    notificationPermission();
}

function setCookie(notification_status, notification_value) {
    document.cookie = notification_status + "=" + notification_value;
}

function getCookie(notification_status) {
    var notification_status = notification_status + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(notification_status) == 0) {
            return c.substring(notification_status.length, c.length);
        }
    }
    return "";
}

// end script permission browser notification

function inputValueCountFun(ele, type) {

    switch (type) {
        case 'id':
            if ($('#' + ele).val() != undefined) {
                if ($('#' + ele).val().length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;

        case 'class':
            if ($('.' + ele).val() != undefined) {
                if ($('.' + ele).val().length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;
        case 'conte':
            if ($('.' + ele).text() != undefined) {
                if ($('#' + ele).text().length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;
        default:
            return false;
    }
}



function clearMemberSearch() {
    $('#search_members').val("");
    $('#search_members').blur();
    $('.inputGroup2 .remove').hide();
    $('#toggle_area .remove').hide();
    $('.suggested-type-list').hide();
    $('#createChannelContainer .submitBtn').show();
}

$('#search_members, #search_assignee, #search_observer').on('keyup', function(e) {
    var value = $(this).val();
    if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 27) {
        if (value.length !== 0) {
            $(e).siblings('.suggested-type-list').show();
            $(e).siblings('.remove').show();
            $('.suggested-type-list').show();
            $('.inputGroup2 .remove').show();
            $('#toggle_area .remove').show();
        } else {
            $(e).siblings('.suggested-type-list').hide();
            $('.suggested-type-list').hide();
            $('.inputGroup2 .remove').hide();
            $('#toggle_area .remove').hide();
        }
        $(".s-l-def-clas").each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('li').show();
                $(this).parent('li').addClass('showEl');
            } else {
                $(this).parent('li').hide();
                $(this).parent('li').removeClass('showEl');
            }
        });

        $('.s-l-def-clas').unhighlight();
        $('.s-l-def-clas').highlight(value);
        $(".inputGroup2 .suggested-list li").removeClass('selected');
        $(".inputGroup2 .suggested-list li.showEl:first").addClass('selected');

    } else if (e.keyCode == 27) {
        if (!$('.suggested-type-list').is(':visible')) {

            escKeyUpForHead();
        }
    }

});

//for tooltip
$('#sharePeopleList').mouseenter(function() {
    var value = [];
    $(this).removeClass('mycustomTooltip tooltips');
    $(this).children('.tooltipspan').remove();
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    var na = '';
    $.each(user_list, function(k, v) {
        if (sharedMemberList.indexOf(v.id) !== -1) {
            if ($('#create-todo-popup').is(':visible')) {
                if (v.id == user_id) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            } else {

                if (v.id == $('#actCre').val()) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }

            }
        }
    });
    var ownerIndex = value.indexOf(na);
    var zeroIndex = value[0];
    if (value.indexOf(na) !== 0) {
        value[0] = na;
        value[ownerIndex] = zeroIndex;
    }
    if ($(this).find('.tooltipspan').length == 0) {
        $(this).addClass('mycustomTooltip tooltips');
        $(this).append('<span class="tooltipspan"></span>');
    } else if ($(this).find('.tooltipspan').length > 1) {
        $(this).removeClass('mycustomTooltip tooltips');
        $(this).children('.tooltipspan').remove();
    }
    $('.tooltipspan').html(value.join("<br/>"))

});

$('#ownerPeopleList').mouseenter(function() {
    var value = [];
    $(this).removeClass('mycustomTooltip tooltips');
    $(this).children('.tooltipspan').remove();
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    var na = '';
    $.each(user_list, function(k, v) {
        if (sharedMemberList.indexOf(v.id) !== -1) {
            if ($('#create-todo-popup').is(':visible')) {
                if (v.id == user_id) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            } else {
                if (v.id == $('#actCre').val()) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    if (coowner.indexOf(v.id) > -1) {
                        value.push(v.fullname + '(Co-owner)');
                    }
                }
            }
        }
    });
    var ownerIndex = value.indexOf(na);
    var zeroIndex = value[0];
    if (value.indexOf(na) !== 0) {
        value[0] = na;
        value[ownerIndex] = zeroIndex;
    }
    if ($(this).find('.tooltipspan').length == 0) {
        $(this).addClass('mycustomTooltip tooltips');
        $(this).append('<span class="tooltipspan"></span>');
    } else if ($(this).find('.tooltipspan').length > 1) {
        $(this).removeClass('mycustomTooltip tooltips');
        $(this).children('.tooltipspan').remove();
    }
    $('.tooltipspan').html(value.join("<br/>"))

});

$('#observerPeopleList').mouseenter(function() {
    var value = [];
    $(this).removeClass('mycustomTooltip tooltips');
    $(this).children('.tooltipspan').remove();
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    var na = '';
    $.each(user_list, function(k, v) {
        if (observer.indexOf(v.id) !== -1) {
            if ($('#create-todo-popup').is(':visible')) {
                if (v.id == user_id) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            } else {
                if (v.id == $('#actCre').val()) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            }
        }
    });
    var ownerIndex = value.indexOf(na);
    var zeroIndex = value[0];
    if (value.indexOf(na) !== 0) {
        //value[0] = na;
        value[ownerIndex] = zeroIndex;
    }
    if ($(this).find('.tooltipspan').length == 0) {
        $(this).addClass('mycustomTooltip tooltips');
        $(this).append('<span class="tooltipspan"></span>');
    } else if ($(this).find('.tooltipspan').length > 1) {
        $(this).removeClass('mycustomTooltip tooltips');
        $(this).children('.tooltipspan').remove();
    }
    $('.tooltipspan').html(value.join("<br/>"))

});

function onscrollFix() {

}

$('#coownerPeopleList').mouseenter(function() {
    var value = [];
    $(this).removeClass('mycustomTooltip tooltips');
    $(this).children('.tooltipspan').remove();
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    var na = '';
    $.each(user_list, function(k, v) {
        if (coowner.indexOf(v.id) !== -1) {
            if ($('#create-todo-popup').is(':visible')) {
                if (v.id == user_id) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }

            } else {
                if (v.id == $('#actCre').val()) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            }
        }
    });
    var ownerIndex = value.indexOf(na);
    var zeroIndex = value[0];
    if (value.indexOf(na) !== 0) {
        //value[0] = na;
        value[ownerIndex] = zeroIndex;
    }
    if ($(this).find('.tooltipspan').length == 0) {
        $(this).addClass('mycustomTooltip tooltips');
        $(this).append('<span class="tooltipspan"></span>');
    } else if ($(this).find('.tooltipspan').length > 1) {
        $(this).removeClass('mycustomTooltip tooltips');
        $(this).children('.tooltipspan').remove();
    }
    $('.tooltipspan').html(value.join("<br/>"))

});

$('#assigneePeopleList').mouseenter(function() {
    var value = [];
    $(this).removeClass('mycustomTooltip tooltips');
    $(this).children('.tooltipspan').remove();
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    var na = '';
    $.each(user_list, function(k, v) {
        if (assignee.indexOf(v.id) !== -1) {
            if ($('#create-todo-popup').is(':visible')) {
                if (v.id == user_id) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }

            } else {
                if (v.id == $('#actCre').val()) {
                    value.push(v.fullname + '(Owner)');
                    na = v.fullname + '(Owner)';
                } else {
                    value.push(v.fullname);
                }
            }
        }
    });
    var ownerIndex = value.indexOf(na);
    var zeroIndex = value[0];
    if (value.indexOf(na) !== 0) {
        //value[0] = na;
        value[ownerIndex] = zeroIndex;
    }
    if ($(this).find('.tooltipspan').length == 0) {
        $(this).addClass('mycustomTooltip tooltips');
        $(this).append('<span class="tooltipspan"></span>');
    } else if ($(this).find('.tooltipspan').length > 1) {
        $(this).removeClass('mycustomTooltip tooltips');
        $(this).children('.tooltipspan').remove();
    }
    $('.tooltipspan').html(value.join("<br/>"))

});


function createEventPop(e) {
    if ($('.create-event-popup').is(":visible") == false) {
        $('.create-event-popup').show();
        $('#CreateEvent').hide();
        $('.create-event-popup-title').focus();
    }
}

function eventToggleAdvance() {
    if ($('#eventAdvanceOption').is(":visible") == false) {
        $('#eventAdvanceOption').show();
        $('.channel-member-search input').focus();
    } else {
        $('#eventAdvanceOption').hide();
    }
}

// socket.on('newMessage', function(message) {
// 	if(!$('#hayvenConnectPage').hasClass('active')){
// 		//for all conv
// 		if(my_all_personal_conversationId.indexOf(message.msg.conversation_id) > -1 || myAllGrpConvId.indexOf(message.msg.conversation_id) > -1){
// 			var conv_Id = message.msg.conversation_id;
// 			var uuID = message.msg.sender;
// 			Push.create(message.msg.sender_name, {
// 	            body: message.msg.msg_body,
// 	            icon: "/images/users/" + message.msg.sender_img,
// 	            timeout: 10000,
// 	            onClick: function () {
// 	                setCookie('lastNotification', message.msg.conversation_id, 1);
// 	                window.location.href = '/';
// 	            }
// 	        });
// 		}
// 	}
// });

socket.on('activityAcceptFromMessage', function(data) {
    if (data.user_id != null) {
        getThisActivitydetail(data.activity_id.toString())
            .then((result) => {
                acceptActivty('', result.activity_id.toString(), result.activity_title, data.user_id, result.activity_created_at);
            }).catch((err) => {
                console.log(474, err);
            });
    }
});

function acceptActivty(msgid, activity_id, activity_title, user_id, toDoCreateAt) {
    socket.emit('toodoUpdate', {
            targetID: activity_id,
            type: 'acceptActivty',
            contain: user_id,
            clusteringkey: toDoCreateAt
        },
        function(confirmation) {
            if (confirmation.msg.msg == 'success') {
                if ($("#unpinTodoList").is(':visible')) {
                    var todoDesign = '<li id="activity_' + activity_id + '" data-activityid="' + activity_id + '" data-urm=0 class="com-t-l todoLink n_td" onclick="startToDo(event)">';
                    todoDesign += '     <span class="toDo" ></span >';
                    todoDesign += '     <span class="toDoName">' + activity_title + '</span>';
                    todoDesign += '     <img id="fla_' + activity_id + '" data-createdat="' + activity_id + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">';
                    todoDesign += '     <span class="unreadMsgCount"></span>';
                    todoDesign += '</li>';
                    $("#unpinTodoList").prepend(todoDesign);

                    if (msgid != '') {
                        socket.emit('toodoUpdate', {
                                targetID: activity_id,
                                type: 'acceptActivityFromMsg',
                                contain: msgid,
                                clusteringkey: toDoCreateAt
                            },
                            function(confirmation) {
                                console.log(confirmation)
                            });
                    }

                }
            }
        });
}

socket.on('activityDeclineFromMessage', function(data) {
    if (data.user_id != null) {
        getThisActivitydetail(data.activity_id.toString())
            .then((result) => {
                console.log(470, result);
                declineActivity('', result.activity_id.toString(), result.activity_created_at, data.user_id);
            }).catch((err) => {
                console.log(474, err);
            });
    }
});

socket.on('addTnTodo', function(data) {

    toastr.options.closeButton = true;
    toastr.options.timeOut = 2000;
    toastr.options.extendedTimeOut = 1000;
    toastr.options.preventDuplicates = true;
    toastr["info"]("Yor are added to a new todo \"" + data.title + "\" by  \"" + data.by + "\"", "Hello " + user_fullname + " !!!");

    $(".msg_id_" + data.msg_id).find('.user-msg').find('p').remove();
    $(".todo_id_" + data.activity_id).remove();

    var html = '';
    if (data.sender != user_id) {
        html += '<p>' + data.by + ' is sharing a To-Do with you.</p>';
    } else {
        html += '<p>You share a To-Do.</p>';
    }

    html += '<div class="toDoContent todo_id_' + data.activity_id + ' todo_share_div_' + data.msg_id + '" data-aid="' + data.activity_id + '">'; // Start todo div

    html += '<div class="toDoContent_Sec1">';
    html += '<img src="/images/basicAssets/custom_to_do_for_msg.svg">';
    html += '<p class="toDoName">' + data.title + '</p>';
    html += '<p>Due Date: <span class="dudate">' + moment(new Date()).format("Do MMMM, YYYY") + '</span></p>';
    html += '</div>';
    if (data.sender != user_id) {
        html += '<div class="toDoContent_Sec2">';
        html += '<button class="accept_toDO" data-members="" onclick="accept_todo(event, \'' + data.conversation_id + '\', \'' + data.msg_id + '\',\'' + data.activity_id + '\')">Accept</button>';
        html += '<button class="decline_toDo" onclick="decline(event, \'' + data.conversation_id + '\', \'' + data.msg_id + '\', \'' + data.activity_id + '\')">Decline</button>';
        html += '</div>';
    }

    html += '</div>'; // End todo div

    $(".msg_id_" + data.msg_id).find('.user-msg').find('h4').after(html);

});

socket.on('removeFromTodo', function(data) {

    toastr.options.closeButton = true;
    toastr.options.timeOut = 2000;
    toastr.options.extendedTimeOut = 1000;
    toastr.options.preventDuplicates = true;
    toastr["info"]("Yor are removed from task \"" + data.title + "\" by  \"" + data.by + "\"", "Hello " + user_fullname + " !!!");

    var html = '';

    html += '<div class="toDoContent_Sec1">';
    html += '<div class="acceptCheck decline"></div>';
    if (data.sender != user_id)
        html += '<p class="acceptedLabel decline">You\'ve removed from <label>' + data.title + '</label></p>';
    else
        html += '<p class="acceptedLabel decline">' + $('#conv' + data.conversation_id).attr('data-name') + ' decline <label onclick="goto_todo(event)">...</label></p>';
    html += '</div>';

    $(".todo_share_div_" + data.msg_id).html("");
    $(".todo_share_div_" + data.msg_id).append(html);
});

function declineActivity(msgid, todoActivityId, toDoCreateAt, uuID) {
    socket.emit('toodoUpdate', {
            targetID: todoActivityId,
            type: 'removemember',
            contain: uuID,
            clusteringkey: toDoCreateAt
        },
        function(confirmation) {
            if (msgid != '') {
                socket.emit('toodoUpdate', {
                        targetID: todoActivityId,
                        type: 'declineActivityFromMsg',
                        contain: msgid,
                        clusteringkey: toDoCreateAt
                    },
                    function(confirmation) {
                        console.log(confirmation)
                    });
            }
        });
}

function getThisActivitydetail(activity_id) {
    return new Promise((resolve, reject) => {
        socket.emit('get_activity_history', {
            activity_id,
            user_id
        }, (respons) => {
            if (respons.activityDetail.status) {
                resolve(respons.activityDetail.activityDetail);
            } else {
                reject({ 'err': 'fail' })
            }
        });
    });

}



socket.on('newMessage', function(message) {
    // debugger;
    // alert('cb');
    // socket.emit('ack_message_web', {
    //     user_id: user_id,
    //     my_token: my_token,
    //     message: message
    // });
    // //debugger;
    if (checkguestMsg(message.msg)) {
        // console.log(1163,message)
        // if(message.msg.msg_body.indexOf('secret_user _scret_msg_') > -1){
        //        var secretuser = message.msg.msg_body.split('@:_S');
        //            secretuser = secretuser[1];
        //            if(user_id != secretuser && user_id != message.msg.sender){
        //                return false;
        //            }
        //    }
        if (message.msg.secret_user != null && message.msg.secret_user != undefined) {
            if (message.msg.secret_user.length > 0) {
                if (message.msg.secret_user.indexOf(user_id) == -1) {
                    return false;
                }
            }
        }

        if (message.msg.msg_type !== 'call') {
            if (!$('#hayvenConnectPage').hasClass('active')) {
                //for all conv
                if (my_all_personal_conversationId.indexOf(message.msg.conversation_id) > -1 || myAllGrpConvId.indexOf(message.msg.conversation_id) > -1) {
                    var conv_Id = message.msg.conversation_id;
                    var uuID = message.msg.sender;

                    if (myAllMuteConvid.indexOf(message.msg.conversation_id) == -1) {
                        if (checkSpecialChars(message.msg.msg_body) == false) {
                            console.log('push notification', message.msg)
                            if (message.msg.sender !== user_id) {
                                Push.Permission.request();
                                Push.create(message.msg.sender_name, {
                                    body: message.msg.msg_body,
                                    icon: "/images/users/" + message.msg.sender_img,
                                    timeout: 10000,
                                    onClick: function() {
                                        // document.getElementById("hayvenConnectPage").click();
                                        // setCookie('lastNotification', message.msg.conversation_id, 1);
                                        // window.location.href = '/';
                                    }
                                });
                            }
                        }
                    }

                }
            }
        }
    }
});



function showProfile() {
    $('#mainSideBarContent').hide();
    $('#profileSideBarContent').show();
    $('#profile-right-section').show();
    $('.right-section').css('display', 'none');
    $('.profilePic').trigger('click');
    $('#profileAccount').trigger('click');
    if ($('#AdminSettingSideBar').is(':visible')) {
        $('#AdminSettingSideBar').hide();
    }
}

var activeProfile = () => {
    $('.profile-lists>li').click(function() {
        $('.profile-lists>li').removeClass('activeProfile');
        $(this).addClass('activeProfile');
    });
};
activeProfile();

function profileActive(type) {
    if (type == 'general') {
        $('.profile-tab-body').hide();
        $('#generalMainTab').show();
    } else if (type == 'account') {
        $('.profile-tab-body').hide();
        $('#account').show();
    } else if (type == 'notification') {
        $('.profile-tab-body').hide();
        $('#notification').show();
    } else if (type == 'privacy') {
        $('.profile-tab-body').hide();
        $('#privacy').show();
    } else if (type == 'support') {
        $('.profile-tab-body').hide();
        $('#support').show()
    } else if (type == 'billing') {
        $('.profile-tab-body').hide()
        $('#billing').show()
    }
}

function showProfilePopup(type) {
    if (type == 'feedbackParticipation') {
        $('#profileBackWrap').show();
        $('#feedbackPopup').show();
    } else if (type == 'marketing') {
        $('#profileBackWrap').show();
        $('#marketingEmail').show();
    } else if (type == 'learnMore') {
        $('#profileBackWrap').show();
        $('#loveCookie').show();
    } else if (type == 'createTicket') {
        $('#profileBackWrap').show();
        $('#createTicketPopup').show();
    } else if (type == 'openTicket') {
        $('#profileBackWrap').show();
        $('#openTicketpopup').show();
    } else if (type == 'givefeedback') {
        $('#profileBackWrap').show();
        $('#giveFeedback').show();
    }
}

function closeProfilePop(type) {
    if (type == 'feedbackPopup') {
        $('#profileBackWrap').hide();
        $('#feedbackPopup').hide();
    } else if (type == 'marketingEmail') {
        $('#profileBackWrap').hide();
        $('#marketingEmail').hide();
    } else if (type == 'loveCookie') {
        $('#profileBackWrap').hide();
        $('#loveCookie').hide();
    } else if (type == 'createTicketPopup') {
        $('#profileBackWrap').hide();
        $('#createTicketPopup').hide();
    } else if (type == 'openTicketpopup') {
        $('#profileBackWrap').hide();
        $('#openTicketpopup').hide();
    } else if (type == 'giveFeedback') {
        $('#profileBackWrap').hide();
        $('#giveFeedback').hide();
    }
}

function showAdminSetting() {
    if ($('#mainSideBarContent').is(':visible')) {
        $('#mainSideBarContent').hide();
    } else if ($('#profileSideBarContent').is(':visible')) {
        $('#profileSideBarContent').hide();
    }
    $('#profile-right-section').hide();
    $('#AdminSettingSideBar').show();
    $('#admin-setting-right-section').show();
    $('.right-section').css('display', 'none');
    $('.profilePic').trigger('click');
    $('.profileGenerel').trigger('click');
}

var allUnit = [];
var allUnitName = [];
var allconvdata = [];
var alluseunitid = [];

var industry_name = null;
var industry_id = null;
var allglobaltagname = [];
var allTean_list = [];

function adminSettngActive(type) {
    $('#backToConnectForUserManagement').show();
    $('#backToUserManagement').hide();
    $('#adminSettingBackWrap').hide();
    $('#adminSettingBackWrap').children().hide();
    if (type == 'user') {
        $('.main-userManageMent').show();
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#manage-user-profile').hide();
        $('#userManageMent').show();
        $('#User-management-User-list tr').show();
    } else if (type == 'role') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#roleManagement').show();
        $('#roledisplaydiv').show();
        $('#roleManagement #roledisplaydiv .rolesHomeHead .csBtnConRole #roleSearchbox').val("");
        $('#wsTeamPermission').hide();
    } else if (type == 'workspace') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#workSpaceTeamExplore').hide();
        $(".ws-user-data-input").removeClass("selected");
        $('#workSpaceTeamDiv').show();
        $('#workSpaceManagement').show();
    } else if (type == 'file') {
        $('#fileManagement_all').find('input').val("");
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#fileManagement_all').show();
        $('#fileManagement_all_table').html("");
        show_all_users_file();
        // $('#fileManagement').show();
        // show_all_files(0);
    } else if (type == 'calling') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#callingManagement').show();
    } else if (type == 'board') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#boardManagement').show();
    } else if (type == 'client') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#clientManagement').show();
    } else if (type == 'business') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#businessManagement').show();
        $('#createUnitName').val("");
        socket.emit('getBUnit', { user_id: user_id, industry_name: industry_name, industry_id: industry_id }, function(res) {
            // socket.emit('getuseunitid',function(data){
            //   allconvdata = data.rows;
            //   console.log(1283,data.rows)
            //   $.each(data.rows,function(k,v){
            //     if(alluseunitid.indexOf(v.b_unit_id) == -1){
            //       alluseunitid.push(v.b_unit_id);
            //     }
            //   })
            // });
            if (res.status) {
                $('#allbusinessUnit').html('');
                allUnit = res.data;
                $.each(allUnit, function(k, v) {
                    allUnitName.push(v.unit_name.toLowerCase());
                    $('#allbusinessUnit').prepend(unitDesign(v));
                });
            }
        });
    } else if (type == 'tips') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#tipsManagement').show();
        backToTipsList();
        get_all_tips();
    } else if (type == 'tag') {
        $('#tag_title_input').removeClass('invalid');
        $('.profile-lists>li').removeClass('activeProfile');
        $('.profile-lists>li[onclick="adminSettngActive(\'tag\')"]').addClass('activeProfile');
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#tagManagement').show();
        $('#allTagContainer').html('');
        $('#tag_title_input').val('');
        $('#tag_table_body').html("")
        $('#tag_create_form').removeClass('update_class');
        $('.addedTagTeam').html('');
        socket.emit('getAllUserTag', { user_id: user_id, company_id: company_id }, function(res) {
            if (res.status) {
                allTean_list = res.data;
                $.each(res.data, function(k, v) {
                    if (v.tag_type == 'public') {
                        // if(allglobaltagname.indexOf(v.title) == -1){
                        allglobaltagname.push(v.title);
                        // console.log(111, tag_design(v))
                        $('#allTagContainer').append(tag_design(v));

                        $('#tag_table_body').append(tag_design_table(v));
                        // }
                    }
                });
            }
        });
        resetTagManagement();
    } else if (type == 'link_account') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#link_accountManagement').show();
        $('#allTagContainer').html('');
        $('#tag_title_input').val('');
        // socket.emit('getAllUserTag',{user_id:user_id,company_id:company_id},function(res){
        // 	if(res.status){
        // 		$.each(res.data,function(k,v){
        // 			// if(allglobaltagname.indexOf(v.title) == -1){
        // 				allglobaltagname.push(v.title);
        // 				$('#allTagContainer').append(tag_design(v));
        // 			// }
        // 		});
        // 	}
        // });
    } else if (type == 'notification') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#notificationManagement').show();

        socket.emit('getAllNotificationSound', { user_id: user_id }, function(res) {
            if (res.status) {
                $(".notificationList").html('');
                $("#total_notiFile").html('(' + res.sounds.length + ')');
                $.each(res.sounds, function(k, v) {
                    console.log(k, v);

                    html = '<tr class="noti-table-row" style="height: 42px" id="sound_' + v.id + '" data-key="' + v.key + '" data-src="' + v.location + '">' +
                        '<td class="checktd">' +
                        '<span onclick="checkEachFile(event)" class="fileCheck-uncheck uncheckFile"></span>' +
                        '</td>' +
                        '<td class="org_file_name">' + v.originalname + '</td>' +
                        '<td>' + v.size + 'kb</td>' +
                        '<td>' + findObjForUser(v.created_by).fullname + '</td>' +
                        '<td>' + moment(v.created_at).format('LL') + '</td>' +
                        '<td style="width:12%">' +
                        '<img style="margin-left: 16px; width: 15px;" src="/images/basicAssets/ellipsis.svg" alt="">';
                    html += '<img onclick="delete_noti_file(this, \'' + v.id + '\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // if(type == 0){
                    // 	html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // 	if(filetype == 'Image' || filetype == 'PDF')
                    // 		html += '<a href="/alpha2/download/' +v.key +'" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                    // 	else
                    // 		html += '<a href="'+ file_server+v.location +'" download="'+ v.originalname +'" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                    // } else {
                    // 	html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // }
                    html += '</td>' +
                        '</tr>';
                    $(".notificationList").append(html);
                });
            }
        });
    } else if (type == 'company') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#adminSettingBackWrap').children().hide();
        $('#companyManagement').show();
        $('#company_body').show();
        $('#company_details').hide();
    } else if (type == 'email_format') {
        $('.adminSettingBody').hide();
        $('#adminSettingBackWrap').hide();
        $('#adminSettingBackWrap').children().hide();
        $('#emailFormatManagement').show();
        $.ajax({
            url: 'settings/get_email_format',
            data: { user_id, company_id },
            dataType: 'JSON',
            type: 'POST',
            success: function(res) {
                console.log(1506, res);
                email_format = res.result;
                set_email_format('forgot');
            },
            error: function(e) {
                console.log(1509, e);
            }
        })
    }
}

function getTeamInfo(ids){
    var data = [];
    $.each(allteams, function(k,v){
        $.each(ids, function(ka,va){
            if(va == v.team_id){
                data.push(v.team_title);
            }
        });
    });

    return data;
}

function show_all_users_file() {
    $("#fileManagement_all_table").html("");
    socket.emit('find_allfiles', function(res) {
        console.log(res);
        for (var i = 0; i < user_list.length; i++) {
            var totalSize = 0;


            for (let l = 0; l < res.files.length; l++) {
                if (res.files[l].user_id.toString() == user_list[i].id.toString()) {
                    totalSize = (totalSize + Number(res.files[l].file_size));
                }
            }
            totalSize = Number(totalSize) / 1000;
            var tfpb = Math.round(Number(totalSize / 1000 / 50));
            tfpb = tfpb < 100 ? tfpb + '%' : '100%';


            if (totalSize > 1000000) {
                totalSize = (Number(totalSize) / 1000000).toFixed(2) + 'GB';
            } else if (totalSize > 1000) {
                totalSize = (Number(totalSize) / 1000).toFixed(2) + 'MB';
            } else {
                totalSize = totalSize.toFixed(2) + 'KB';
            }
            var html = "";

            html += '<tr class="file-table-row">' +
                '<td>' + user_list[i].fullname + '</td>' +
                '<td>' + totalSize + '</td>' +
                '<td>' + tfpb + ' out of 5GB</td>' +
                '<td><span class="btn" onclick="viewBtnForfile_table(\'' + user_list[i].id + '\',\'' + user_list[i].fullname + '\')">View</span></td>' +
                '</tr>';
            // console.log(html)

            $('#fileManagement_all_table').append(html);

        }
        $("#fileManagement_all .file-table").tablesorter();
        $("#fileManagement_all .file-table").trigger("updateAll");
    });
}

function viewBtnForfile_table(id, fullname) {
    $('#fileManagement_all').hide();
    $('#fileManagement').show();
    $("#total_used").text(0 + 'MB');
    $("#proggress_value").text('0%');
    $("#nooffiles").text('(0)');
    $("#noofdeletedfiles").text('(0)');
    $("#proggress_value").css('width', '0.01%');
    show_all_files(0, id, fullname);
}

function show_all_files(type, user_id, user_name) {
    $("#fileManagement .file-table-body").html("");
    $("#fileManagement .filetab").removeClass("active");
    var total_file_size = 0;
    socket.emit('find_allfiles_by_user_id', { user_id, type }, function(res) {
        if (res.status && res.files.length > 0) {
            if (type == 0) {
                $("#fileManagement .allfilestab").addClass("active");
                $("#nooffiles").text("(" + res.files.length + ")");
            } else {
                $("#fileManagement .deletedfilestab").addClass("active");
                $("#noofdeletedfiles").text("(" + res.files.length + ")");
            }

            $.each(res.files, function(k, v) {
                var html = "";
                var filesize = Number(v.file_size) / 1000;
                total_file_size += filesize;
                $("#total_used").text(Math.round(Number(total_file_size / 1000)) + 'MB');
                var tfpb = Math.round(Number(total_file_size / 1000 / 50));
                tfpb = tfpb < 100 ? tfpb + '%' : '100%';
                $("#proggress_value").text(tfpb);
                // console.log(tfpb);
                if (tfpb == '0%') {
                    $("#proggress_value").css('width', '0.01%');
                } else {
                    $("#proggress_value").css('width', tfpb);
                }
                if (v.file_type.indexOf('image/') > -1)
                    var filetype = 'Image';
                else if (v.file_type.indexOf('pdf') > -1)
                    var filetype = 'PDF';
                else if (v.file_type.indexOf('audio/') > -1)
                    var filetype = 'Audio';
                else if (v.file_type.indexOf('video/') > -1)
                    var filetype = 'Video';
                else
                    var filetype = 'Others';

                html = '<tr class="file-table-row" id="filetr_' + v.id + '" data-bucket="' + v.bucket + '" data-key="' + v.key + '" data-conversation_id="' + v.conversation_id + '">' +
                    '<td class="checktd">' +
                    '<span onclick="checkEachFile(event)" class="fileCheck-uncheck uncheckFile"></span>' +
                    '</td>' +
                    '<td class="org_file_name">' + v.originalname + '</td>' +
                    '<td>' + filetype + '</td>' +
                    '<td>' + filesize + ' Kb</td>' +
                    '<td>' + moment(v.created_at).format('LL') + '</td>' +
                    '<td>' + user_name + '</td>' +
                    '<td style="width:12%">' +
                    '<img style="margin-left: 16px; width: 15px;" src="/images/basicAssets/ellipsis.svg" alt="">';
                // html += '<img onclick="delete_this_file(\''+ v.id +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                if (type == 0) {
                    // html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    if (filetype == 'Image' || filetype == 'PDF')
                        html += '<a href="/alpha2/download/' + v.key + '" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                    else
                        html += '<a href="' + file_server + v.location + '" download="' + v.originalname + '" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                } else {
                    // html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                }
                html += '</td>' +
                    '</tr>';
                $("#fileManagement .file-table-body").append(html);
            });

            $("#fileManagement .file-table").tablesorter();
            $("#fileManagement .file-table").trigger("updateAll");
        }
    });
}

function delete_this_file(id, field_val_type) {
    $("#delete_this_file").show();
    $("#delete_this_file").attr('delete-type', 'files');
    $("#confirm_data_id").attr("data-id", id);
    $("#confirm_data_id").attr("field-val-type", field_val_type);
    $("#confirm_data_id").attr("data-type", 'file_delete');
}

function confirm_delete_this_file(id, field_val_type) {
    var ids = [id];
    if ($('.deletedfilestab').hasClass('active')) {
        var bucket = $("#filetr_" + id).attr("data-bucket");
        var bucket_name = bucket.substring(0, bucket.indexOf('/'));
        var dir = bucket.substring(bucket.indexOf('/') + 1);
        var key = $("#filetr_" + id).attr("data-key");
        var attch_list = JSON.stringify([dir + '/' + key]);
        $.ajax({
            url: "/s3Local/deleteObjects",
            type: "POST",
            data: { bucket_name, attch_list },
            dataType: 'json',
            // beforeSend: function(){
            // 	console.log(1422, bucket_name, attch_list);
            // },
            success: function(res) {
                socket.emit('delete_obj', id, conversation_id);
                $("#filetr_" + id).hide();
                hide_this_popup();
                delete_files_counter_admin_setting(field_val_type);
                console.log("Unlink successfully 1475", res);
            },
            error: function(e) {
                console.log("Error in unlink 1428: ", e);
            }
        });
    } else {
        socket.emit('files_delete', ids, $("#filetr_" + id).attr("data-conversation_id"), (rep) => {
            console.log(rep);
            if (rep.status) {
                $("#filetr_" + id).hide();
                var conv_id = $("#filetr_" + id).attr("data-conversation_id");
                var bucket = $("#filetr_" + id).attr("data-bucket");
                var key = $("#filetr_" + id).attr("data-key");
                socket.emit('conv_files_deleted', { conv_id, bucket, key });
                hide_this_popup();
                delete_files_counter_admin_setting(field_val_type);
            }
        });
    }
}

function delete_files_counter_admin_setting(field_val_type) {
    if (field_val_type == '0') {
        var file_amount = $("#nooffiles").text().replace(/[^0-9]/g, '') - 1;
        $("#nooffiles").text('(' + file_amount + ')');
    } else if (field_val_type == '1') {
        var file_amount = $("#noofdeletedfiles").text().replace(/[^0-9]/g, '') - 1;
        $("#noofdeletedfiles").text('(' + file_amount + ')');
    } else {
        console.log('Counter not updated.');
    }
}

socket.emit('getAllIndustry', function(res) {
    if (res.status) {
        //   console.log(res.data)
        $.each(res.data, function(k, v) {
            if (v.industry_name == 'Information Technology') {
                industry_name = v.industry_name;
                industry_id = v.industry_id;

            }
        })
    }
})

function saveNewUnit() {
    var newUnit = $('#createUnitName').val().trim();

    if (newUnit !== "") {
        if (allUnitName.indexOf(newUnit.toLowerCase()) == -1) {
            socket.emit('addNewBUnit', { user_id: user_id, unit_name: newUnit, industry_name: industry_name, industry_id: industry_id }, function(res) {
                if (res.status) {
                    allUnit.push(res.data);
                    allUnitName.push(newUnit.toLowerCase());
                    $('#allbusinessUnit').prepend(unitDesign(res.data));
                    $('#createUnitName').val('');
                }
            })
        } else {
            // alert('This business category already exist.');

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('This business category already exist.');
        }
    }
}

var unitDesign = (v) => {
    console.log(alluseunitid)
    var html = '<li class="bunit_' + v.unit_id + '">' +
        '<span class="name name_bunit bname_' + v.unit_id + '" data-wc-name="' + v.unit_name.toLowerCase() + '" contenteditable="false" onblur="updateUnitTitle(this)" onkeydown="editUnitNamekeydown(event,this)" onkeyup="editUnitNamekeyUp(event,this)" data-id="' + v.unit_id + '">' + v.unit_name + '</span>' +
        '<span class="removeIco" onclick="removeThisUnit(this)" data-id="' + v.unit_id + '" data-wc-name="' + v.unit_name.toLowerCase() + '" style="opacity:' + ((alluseunitid.indexOf(v.unit_id) == -1) ? '1' : '0.5') + '"></span>' +
        '<span class="editIco" onclick="editthisRoom(this)" data-id="' + v.unit_id + '"></span>' +
        '</li>';
    return html;
}

function showCreateUserPopup(from_where) {
    $('#adminSettingBackWrap').show();
    $('#createNewUser').show();
    $('#cnufname').val('').focus();
    $('#cnulname').val('');
    $('#cnuemail').val('');
    $("#cnurole").html('');
    $("#cnurole").append('<option value="">Select a role</option>');
    if (from_where == 'role_management') {
        $('#adminSettingBackWrap #createNewUser .create-user-btn').attr("onclick", "create_new_user('role_management')");
        $.each(allroles, function(k, v) {
            if (v.role_title == "Normal User") {
                $("#cnurole").append('<option value="' + v.role_id + '" selected>' + v.role_title + '</option>');
            } else {
                $("#cnurole").append('<option value="' + v.role_id + '" >' + v.role_title + '</option>');
            }
        });

    } else if (from_where == 'user_management') {
        $('#adminSettingBackWrap #createNewUser .create-user-btn').attr("onclick", "create_new_user('from_user_management')");
        $.each(allroles, function(k, v) {
            if (v.role_title == "Normal User") {
                $("#cnurole").append('<option value="' + v.role_id + '" selected>' + v.role_title + '</option>');
            } else {
                $("#cnurole").append('<option value="' + v.role_id + '" >' + v.role_title + '</option>');
            }
        });
        // $("#cnurole").val($("#cnurole option:eq(1)").val());
    } else if (from_where == 'under_company') {
        $('#adminSettingBackWrap #createNewUser .create-user-btn').attr("onclick", "create_new_user('from_company_management')");
        let comid = $("#company_details #company_name_changeable").attr("data-companyid");
        socket.emit("get_role_by_company", {
            company_id: comid
        }, (rep) => {
            // setCookie("admintabname", "company");
            if (rep.status) {
                console.log("roles_by_company", rep.roles_by_company);

                socket.emit("is_exist_user_under_company", {
                    company_id: comid
                }, (repUser) => {
                    if (repUser.status && repUser.exist_user.length == 0) {
                        $.each(rep.roles_by_company, function(k, v) {
                            if (v.role_title == "System Admin") {
                                $("#cnurole").append('<option value="' + v.role_id + '" selected>' + v.role_title + '</option>');
                            }
                        });
                    } else if (repUser.status && repUser.exist_user.length > 0) {
                        $.each(rep.roles_by_company, function(k, v) {
                            if (v.role_title == "Normal User") {
                                $("#cnurole").append('<option value="' + v.role_id + '" selected>' + v.role_title + '</option>');
                            } else {
                                $("#cnurole").append('<option value="' + v.role_id + '" >' + v.role_title + '</option>');
                            }
                        });
                    }
                });

            }
        });
    }
    guestuserConv = [];
    guestuserTeam = [];
    $('#guestUserOption').html("");
}

function backToManageMentDiv() {
    if ($("#AdminSettingSideBar").find(".activeProfile").attr("data-tabname") == "user") {
        $('#manage-user-profile').hide();
        $('.main-userManageMent').show();
    } else {
        $('#userManageMent').hide();
        $('#manage-user-profile').hide();
        $('#roleManagement').hide();
        $('#workSpaceManagement').show();
    }
}

$('.work-space-tabs').click(function() {
    $('.work-space-tabs').removeClass('active-ws');
    $(this).addClass('active-ws');
})

function workSpaceTabs(type) {
    var TeamExplore = $('#workSpaceTeamExplore');
    var ChannelExplore = $('#wsChannelExplore');
    if (type == 'team') {
        $('.workspace-tab-body').hide();
        $('#workSpaceTeamDiv').css('display', 'inline-block');
        TeamExplore.hide();
        ChannelExplore.hide();
    } else if (type == 'members') {
        $('.workspace-tab-body').hide();
        $('#workSpaceMemberDiv').show();
        TeamExplore.hide();
        ChannelExplore.hide();
    } else if (type == 'channel') {
        $('.workspace-tab-body').hide();
        $('#workSpaceChannelDiv').show();
        TeamExplore.hide();
        ChannelExplore.hide();
    }
}

var tmpTeamMember = [];
var tmpCompanyMember = [];
var thisCompanyExistMembersId = [];

function showAdminpopup(type) {
    console.log(1725,type)
    // document.body.style.cursor = "wait";
    if (type == 'addUserToTeam') { //add team user
        tmpTeamMember = [];
        $('#addMemberPopup .sub_btn').attr('onclick', 'addUsersToThisTeam(event)');
        $('#addnewMemberMini').html('');
        $('#userListFornewRoom').html('');
        $('.hayven_Modal_Content .sub_btn').removeClass('active');
        access_user_list = _.orderBy(access_user_list, ["fullname"], ["asc"]);
        $.each(access_user_list, function(k, v) {
            console.log(1742)
            if ($('.tuid_' + v.id).length == 0) {
                if (v.is_delete == 0) {
                    var html = '<li class="showEl findMember _member_' + v.id + '"onclick="addNewMembertoTeam(this,\'' + v.id + '\',\'' + v.fullname + '\',\'' + v.img + '\') //addNewMemberForGroup">' +
                        '<div class="addMember-on-off-pop">' +
                        '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
                    if (onlineUserList.indexOf(v.id) == -1) {
                        html += '<span class="offline online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
                    } else {
                        html += '<span class="online online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
                    }
                    html += '</div>' +
                        '<span class="name s-l-def-clas" data-uuid="' + v.id + '">' + v.fullname + ' <span class="id-beside-name">[' + v.email + ']</span></span>';
                    //+'<span class="designation-name">, '+findObjForUser(v).designation+'</span>'
                    +
                    '</li>';
                    $('#userListFornewRoom').append(html);
                }
            }
        });

        $('#addMemberPopup').css('display', 'flex');
        $('.src_inputBox').val('').focus();
    } else if (type == 'addUserToCompany') { //add company user
        tmpCompanyMember = [];
        var currentComId = $("#company_details #company_name_changeable").attr("data-companyid");
        var currentComName = $("#company_details #company_name_changeable").attr("data-company-name");
        console.log(currentComId);
        $('#addMemberPopup .sub_btn').attr('onclick', 'addUsersToThisCompany(event)');
        $('.hayven_Modal_Content .sub_btn').removeClass('active');
        $('#addnewMemberMini').html('');
        $('#userListFornewRoom').html('');
        socket.emit("get_users_by_company_id", {
            company_id: currentComId
        }, (rep) => {
            // console.log("This company all user:",rep.company_users);
            $.each(rep.company_users, function(k, v) {
                // console.log("k", k);
                // console.log("v", v);
                thisCompanyExistMembersId.push(v.id);
            });
            // console.log("thisCompanyExistMembersId", thisCompanyExistMembersId);

            var srtList = [];
            $.each(all_company_user, function(k, v) {
                srtList.push(v.fullname.toUpperCase());
            });
            console.log("srtList===========================", srtList);
            srtList = srtList.sort();
            $.each(srtList, function(ka, va) {
                $.each(all_company_user, function(k, v) {
                    if ($('._member_' + v.id).length == 0 && thisCompanyExistMembersId.indexOf(v.id) == -1) {
                        if (va == v.fullname.toUpperCase() && v.is_delete == 0) {
                            // console.log("V", v);
                            // var html = '<li class="showEl findMember _member_'+v.id+'" onclick="addNewMembertoTeam(this,\''+v.id+'\',\''+v.fullname+'\',\''+v.img+'\')">' //addNewMemberForGroup
                            var html = '<li class="showEl findMember _member_' + v.id + '" onclick="addNewMembertoCompany(this,\'' + v.id + '\',\'' + v.email + '\',\'' + v.fullname + '\',\'' + v.img + '\')">' //addNewMemberForGroup
                                +
                                '<div class="addMember-on-off-pop">' +
                                '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
                            if (onlineUserList.indexOf(v.id) == -1) {
                                html += '<span class="offline online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
                            } else {
                                html += '<span class="online online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
                            }
                            html += '</div>' +
                                '<span class="name s-l-def-clas" data-uuid="' + v.id + '">' + v.fullname + ' <span class="id-beside-name">[' + v.email + ']</span></span>';
                            //+'<span class="designation-name">, '+findObjForUser(v).designation+'</span>'
                            +
                            '</li>';
                            $('#userListFornewRoom').append(html);
                        }
                    }
                });
            });

            $('#addMemberPopup').css('display', 'flex');
            $('#addMemberPopup .src_inputBox').val('').focus();
        });
    } else if (type == 'addrole') {
        $('#adminSettingBackWrap').css('display', 'flex');
        $('#wsAddRolePopUp').show()
        $('#WsManagRoleName').val("").focus()
    }
    // else if(type == 'editTeam'){
    // 	$('#adminSettingBackWrap').show()
    // 	$('#wsTeamPermission').show()
    // }
    else if (type == 'deleteTeam') {
        $('#adminSettingBackWrap').css('display', 'flex');
        $('#wsDeleteTeam').show()
    } else if (type == 'createteam') {
        $('#adminSettingBackWrap').css('display', 'flex');
        $('#wsCreateTeamPopUp').show()
            // .height(232);
        $('#WsManagTeamName').val("").focus()
        $('#errWsCreateTeam').html('');
    } else if (type == 'wsColorPopUp') {
        $('#adminSettingBackWrap').css('display', 'flex');
        $('#wsColorPopUp').show()
    } else if (type == 'createCompany') {
        $('#adminSettingBackWrap').css('display', 'flex');
        $('#wsCreateCompanyPopUp #WsCompanyName').val('');
        $('#wsCreateCompanyPopUp #errWsCreateCompany').text('');
        $('#wsCreateCompanyPopUp').show();
    }
}

function addNewMembertoTeam(elm, id, fullname, img) {
    // console.log("add tmpTeamMember", tmpTeamMember);
    var data = {
        id: id,
        fullname: fullname,
        img: img
    }
    $(elm).remove();

    tmpTeamMember.push({ name: fullname, id: id });
    if (tmpTeamMember.length > 0 && !$('#addMemberPopup .sub_btn').hasClass('active')) {
        $('#addMemberPopup .sub_btn').addClass('active');
    }

    $('#addnewMemberMini').prepend(__mini_itemDesign(data, 'addToTeam'));
    $('#addnewMemberMini').next('input').val('');
    $('#addnewMemberMini').next('input').focus();
    $.each($("#userListFornewRoom .showEl"), function(k, v) {
        $(v).show();
    });
}

function addNewMembertoCompany(elm, id, email, fullname, img) {
    // alert("Hello");
    var data = {
        id: id,
        fullname: fullname,
        img: img
    }
    $(elm).remove();

    tmpCompanyMember.push({ id: id, email: email, name: fullname, img: img });
    if (tmpCompanyMember.length > 0 && !$('#addMemberPopup .sub_btn').hasClass('active')) {
        $('#addMemberPopup .sub_btn').addClass('active');
    }

    $('#addnewMemberMini').prepend(__mini_itemDesign(data, 'addToComapany'));
    $('#addnewMemberMini').next('input').val('');
    $('#addnewMemberMini').next('input').focus();
    $.each($("#userListFornewRoom .showEl"), function(k, v) {
        $(v).show();
    });
}

function __mini_itemDesign(data, type) {
    var membertag = '';
    var newClass = '';
    // console.log(tmpTeamMember);


    if (type == 'addToTeam') {
        var html = '<div class="mini_item _mini_item_' + data.id + '" >' +
            '<div class="mini_img"><img src="' + file_server + 'profile-pic/Photos/' + data.img + '"></div>' +
            '<p class="mini_name">' + data.fullname + '</p>' +
            '<span class="mini_remove_ico ' + newClass + '" onclick="removeAddedUser(this,\'' + data.id + '\',\'' + data.fullname + '\',\'' + data.img + '\')"></span>' +
            '</div>';
    } else if (type == 'addToComapany') {
        var html = '<div class="mini_item _mini_item_' + data.id + '" >' +
            '<div class="mini_img"><img src="' + file_server + 'profile-pic/Photos/' + data.img + '"></div>' +
            '<p class="mini_name">' + data.fullname + '</p>' +
            '<span class="mini_remove_ico ' + newClass + '" onclick="removeAddedUserFromCompany(this,\'' + data.id + '\',\'' + data.fullname + '\',\'' + data.img + '\')"></span>' +
            '</div>';
    }

    return html;
}

function removeAddedUser(elm, id, fullname, img) {
    // console.log("Before tmpTeamMember", tmpTeamMember);
    $.each(tmpTeamMember, function(k, v) {
        if (v !== undefined) {
            if (v.id == id) {
                // console.log("IN=", v.id);
                removeA(tmpTeamMember, v);
            }
        }
    });
    // console.log("After tmpTeamMember", tmpTeamMember);
    $.each(access_user_list, function(k, v) {
        if (v.id == id) {
            $('#userListFornewRoom').append(addUserListDesign(v, 'toTeam'));
        }
    });

    if (tmpTeamMember.length == 0) {
        $('#addMemberPopup .sub_btn').removeClass('active');
    }
    $('#addnewMemberMini ._mini_item_' + id).remove();
}

function removeAddedUserFromCompany(elm, id, fullname, img) {
    // console.log("Before tmpTeamMember", tmpTeamMember);
    $.each(tmpTeamMember, function(k, v) {
        if (v !== undefined) {
            if (v.id == id) {
                // console.log("IN=", v.id);
                removeA(tmpTeamMember, v);
            }
        }
    });
    // console.log("After tmpTeamMember", tmpTeamMember);
    $.each(all_company_user, function(k, v) {
        if (v.id == id) {
            $('#userListFornewRoom').append(addUserListDesign(v, 'toCompany'));
        }
    });

    if (tmpTeamMember.length == 0) {
        $('#addMemberPopup .sub_btn').removeClass('active');
    }
    $('#addnewMemberMini ._mini_item_' + id).remove();
}

function addUserListDesign(v, where_add) {

    if (where_add == 'toTeam') {
        var html = '<li class="showEl findMember _member_' + v.id + '"onclick="addNewMembertoTeam(this,\'' + v.id + '\',\'' + v.fullname + '\',\'' + v.img + '\') //addNewMemberForGroup">'
            // +'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
            // +'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>'
            +
            '<div class="addMember-on-off-pop">' +
            '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
        if (onlineUserList.indexOf(v.id) == -1) {
            html += '<span class="offline online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
        } else {
            html += '<span class="online online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
        }
        html += '</div>' +
            '<span class="name s-l-def-clas" data-uuid="' + v.id + '">' + v.fullname + ' <span class="id-beside-name">[' + v.email + ']</span></span>';
        //+'<span class="designation-name">, '+findObjForUser(v).designation+'</span>'
        +
        '</li>';
    } else if (where_add == 'toCompany') {
        var html = '<li class="showEl findMember _member_' + v.id + '"onclick="addNewMembertoCompany(this,\'' + v.id + '\',\'' + v.email + '\',\'' + v.fullname + '\',\'' + v.img + '\') //addNewMemberForGroup">'
            // +'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
            // +'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>'
            +
            '<div class="addMember-on-off-pop">' +
            '<img src="' + file_server + 'profile-pic/Photos/' + v.img + '" class="profile">';
        if (onlineUserList.indexOf(v.id) == -1) {
            html += '<span class="offline online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
        } else {
            html += '<span class="online online_' + v.id + '" style="top: 30px; left: 6px; z-index: 1; position: absolute;"></span>';
        }
        html += '</div>' +
            '<span class="name s-l-def-clas" data-uuid="' + v.id + '">' + v.fullname + ' <span class="id-beside-name">[' + v.email + ']</span></span>';
        //+'<span class="designation-name">, '+findObjForUser(v).designation+'</span>'
        +
        '</li>';
    }

    return html;
}

function addUsersToThisTeam(event) {
    var uids = [];
    $.each(tmpTeamMember, function(k, v) {
        uids.push(v.id);
    });
    document.body.style.cursor = "wait";
    var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
    socket.emit("add_team_members", { uids, teamid, user_id }, function(rep) {
        if (rep.status == false) {
            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text(rep.error);
        } else {
            $.each(allteams, function(k, v) {
                if (v.team_id == teamid) {
                    var stringBody = {
                        team_id: v.team_id,
                        team_title: v.team_title,
                        new_user: uids
                    }
                    var noti_data = {
                        type: 'add_team_member',
                        title: v.team_title,
                        body: JSON.stringify(stringBody),
                        created_at: new Date(),
                        created_by: user_id,
                        seen_users: [user_id],
                        receive_users: v.participants.concat(uids)
                    }
                    if(conversation_id !== user_id){
                        insertNotiFun(noti_data);
                      }
                }
            })


            document.body.style.cursor = "default";
            setCookie("admintabname", "workspace");
            setCookie("triggerid", teamid);
            window.location.reload();

            // console.log(rep);
            // var html = "";
            // $.each(uids, function(k, v){
            // 	html += '<tr class="user-table-row tuid_'+ v +'" data-id="'+ v +'">'+
            // 				'<td class="fullName" onclick="openprofile(\''+v+'\')"> <img src="'+ file_server +'profile-pic/Photos/'+ get_user_info_obj(v).img +'" alt="'+ get_user_info_obj(v).fullname +'"><span> '+ get_user_info_obj(v).fullname +' </span></td>'+
            // 				'<td>Member</td>'+
            // 				'<td onclick="removefromteam(event)">Remove</td>'+
            // 			'</tr>';
            // });
            // $("#ws-user-management-table .user-table-body").append(html);
            // closeModal('addMemberPopup');
        }
    });
}

function addUsersToThisCompany(event) {
    var companyId = $("#company_details #company_name_changeable").attr("data-companyid");
    document.body.style.cursor = "wait";

    let newComUsersData = [];
    $.each(tmpCompanyMember, function(k, v) {
        let usr = {
            created_by: user_id,
            company_id: companyId,
            fullname: v.fullname,
            email: v.email,
            dept: findObjForUser(v.id).dept == "Social" ? "Social" : "Business",
            role: "Normal User",
            pass: '123456',
        }
        newComUsersData.push(usr);
    });


    // socket.emit("add_company_members", {newComUsersData}, function(rep){
    // 	if(rep.status == false) {
    // 	  $('#warningsPopup').css('display','flex');
    // 	  $('#warningsPopup .warningMsg').text(rep.error);
    // 	} else {
    // 		console.log("rep");
    // 		// $.each(allteams,function(k,v){
    // 		// 	if(v.team_id == teamid){
    // 		// 		var stringBody = {
    // 		// 			team_id:v.team_id,
    // 		// 			team_title:v.team_title,
    // 		// 			new_user:uids
    // 		// 		}
    // 		// 		var noti_data = {
    // 		// 			type:'add_team_member',
    // 		// 			title:v.team_title,
    // 		// 			body:JSON.stringify(stringBody),
    // 		// 			created_at:new Date(),
    // 		// 			created_by:user_id,
    // 		// 			seen_users:[user_id],
    // 		// 			receive_users:v.participants.concat(uids)
    // 		// 		  }
    // 		// 		insertNotiFun(noti_data);
    // 		// 	}
    // 		// })


    // 		// document.body.style.cursor = "default";
    // 		// setCookie("admintabname","workspace");
    // 		// setCookie("triggerid", teamid);
    // 		// window.location.reload();
    // 	}
    // });
}

function searchUsersInPopup(e, ele) {
    var str = event.target.value.trim().toLowerCase();
    $.each($("#userListFornewRoom .showEl"), function(k, v) {
        if ($(v).find('.name').text().trim().toLowerCase().indexOf(str) > -1) {
            $(v).show();
        } else {
            $(v).hide();
        }
    });
}

function closeAdminSettingPop(type) {
    if (type == 'createNewUser') {
        $('#adminSettingBackWrap').hide();
        $('#createNewUser').hide();
        $('.addeTeamLi').html('');
    } else if (type == 'addRole') {
        $('#adminSettingBackWrap').hide();
        $('#wsAddRolePopUp').hide();
    } else if (type == 'addUser') {
        $('#adminSettingBackWrap').hide();
        $('#wsAddUserPopUp').hide();
    } else if (type == 'teamPermission') {
        $('#adminSettingBackWrap').hide();
        $('#wsTeamPermission').hide();
    } else if (type == 'deleteRole') {
        $('#adminSettingBackWrap').hide();
        $('#wsDeleteRole').hide();
    } else if (type == 'deleteTeam') {
        $('#adminSettingBackWrap').hide();
        $('#wsDeleteTeam').hide();
    } else if (type == 'createTeam') {
        $('#adminSettingBackWrap').hide();
        $('#wsCreateTeamPopUp').hide();
    } else if (type == 'wsColorPopUp') {
        $('#adminSettingBackWrap').hide();
        $('#wsColorPopUp').hide();
    } else if (type == 'deleteTips') {
        $('#adminSettingBackWrap').hide();
        $('#wsDeleteTips').hide();
    } else if (type == 'createCompany') {
        $('#adminSettingBackWrap').hide();
        $('#wsCreateCompanyPopUp').hide();
    }

}

function backToWsTeamList() {
    $('#workSpaceTeamExplore').hide();
    $(".ws-user-data-input").removeClass("selected");
    $('#workSpaceTeamDiv').show();
    var team_id = $('#workSpaceTeamExplore').attr('data-teamid');

    $.each(allteams, function(k, v) {
        if (v.team_id == team_id) {
            // console.log(v.participants.length);
            $('#WsMTeam' + team_id).find('#team-member-length').text('(' + v.participants.length + ')');
            // console.log($('#WsMTeam'+team_id).find('#team-member-length').text('('+v.participants.length+')'));
        }
    });
}

function backToWsCompanyList() {
    $('#companyManagement #company_details').hide();
    $('#companyManagement #company_body').show();
}

function channelExplore() {
    $('#workSpaceChannelDiv').hide();
    $('#wsChannelExplore').show();
}

function backToWsconversation_list_sidebar() {
    $('#wsChannelExplore').hide();
    $('#workSpaceChannelDiv').show();
}

function checkEachFile(e) {
    if ($(e.target).hasClass('uncheckAllFile')) {
        $(e.target).removeClass('uncheckAllFile');
        $(e.target).addClass('checkAllFile');
        $('.checktd>span').removeClass('uncheckFile');
        $('.checktd>span').addClass('checkFile');
    } else if ($(e.target).hasClass('checkAllFile')) {
        $(e.target).removeClass('checkAllFile');
        $(e.target).addClass('uncheckAllFile');
        $('.checktd>span').removeClass('checkFile');
        $('.checktd>span').addClass('uncheckFile');
    }
    if ($(e.target).hasClass('uncheckFile')) {
        $(e.target).removeClass('uncheckFile');
        $(e.target).addClass('checkFile');
    } else if ($(e.target).hasClass('checkFile')) {
        $(e.target).removeClass('checkFile');
        $(e.target).addClass('uncheckFile');
    }
    var checkFile = $('.checktd>.checkFile').length;
    var totalFile = $('.checktd>.fileCheck-uncheck').length;
    if (totalFile !== checkFile) {
        $('.checkth>span').removeClass('checkAllFile');
        $('.checkth>span').addClass('uncheckAllFile');
    } else {
        $('.checkth>span').removeClass('uncheckAllFile');
        $('.checkth>span').addClass('checkAllFile');
    }
}

//for mute notification

$(function() {
    socket.emit('all_mute_conv', user_id, function(data) {
        // console.log('Mute data :', data);
        $.each(data, function(k, v) {
            // debugger;
            if (v.mute_status == "active") {
                var startTime = moment(new Date(v.mute_start_time)).format("llll")
                var now = moment(new Date()).format("llll"); //todays date
                var end = moment(new Date(v.mute_end_time)).format("llll");
                var date2 = new Date(now);
                var date1 = new Date(end);
                var timeDiff = Math.ceil(date1.getTime() - date2.getTime());
                var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                var dayWiseMute = false;
                if (v.mute_day != null) {
                    dayWiseMute = true;
                }
                if (timeDiff > 0 || dayWiseMute) {
                    if (dayDifference == 1) {
                        if (v.mute_end_time !== null) {
                            let end = moment(v.mute_end_time).format("x"); // activity end date
                            let date2 = moment().format('x');
                            let timeDiff = Math.ceil(end - date2);
                            let secDifference = Math.ceil(timeDiff / 1000);
                            let minDiff = Math.ceil(secDifference / 60);
                            notificationMuteEnd[k] = {
                                'minDiff': minDiff,
                                'reminder': moment(v.mute_end_time).format('h:mm'),
                                'mute_id': v.mute_id,
                                'endtime': end
                            };
                        }
                    }

                    //$('#conv'+v.conversation_id).children('.unreadMsgCount').css('display', 'none');
                    if (v.mute_day != null) {
                        myAllDayMuteConv.push(v);
                    } else {
                        // $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\'' + v.mute_id + '\',\'' + v.conversation_id + '\')"></span>');
                        if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                            $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                        }
                    }
                    $('#conv' + v.conversation_id).attr('data-mute', v.mute_id);
                    $('#conv' + v.conversation_id).addClass('mute_conv');
                    if ($('#conv' + v.conversation_id).hasClass('.sideActive.selected')) {
                        $('#viewMuteNotification').addClass('active');
                    }

                    setTimeout(function() {
                        if ($('#conv' + conversation_id).attr('data-mute') != 'unmute') {
                            $('#viewMuteNotification').addClass('active');
                            console.log('*******  MUTE  ********');
                        }
                    }, 1000);

                    myAllMuteConvid.push(v.conversation_id);
                    myAllMuteConv.push(v);
                }
            } else {
                $('#conv' + v.conversation_id).attr('data-mute', 'unmute');
            }
        });
    });
    socket.emit('getAllIdleList', function(res) {
        idleUsersList = res;
        $.each(res, function(k, v) {
            if ($('.online_' + v).hasClass('online')) {
                $('.online_' + v).addClass('idleUser');
            }
        });
    })
});

var dayMuteConvId = [];

setInterval(function() {
    // debugger;
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var mday = weekday[d.getDay()];
    var currentTime = d.getTime();
    currentTime = Math.floor(currentTime / 1000);
    var currentDate = moment().format('ll');
    var currentDateTime = moment().format('X');
    if (myAllDayMuteConv.length > 0) {
        $.each(myAllDayMuteConv, function(k, v) {
            // console.log(v);
            var start = currentDate + ' ' + v.mute_start_time;
            start = moment(new Date(start)).format("llll");
            start = new Date(start);
            start = Math.ceil(start.getTime() / 1000);
            var end = currentDate + ' ' + v.mute_end_time;
            end = moment(new Date(end)).format("llll");
            end = new Date(end);
            end = Math.ceil(end.getTime() / 1000);
            // console.log(currentDateTime, start, end);

            if (v.mute_day.indexOf(mday) > -1) {
                // if (start > currentDateTime) {
                // 	if ($('#conv'+v.conversation_id).find('.mute_bell').length == 1) {
                // 		$('#conv'+v.conversation_id).children('.mute_bell').remove();
                // 	}
                // }
                // if (start < currentDateTime && end > currentDateTime) {
                // 	console.log('Mute ON');
                // 	if (dayMuteConvId.indexOf(v.conversation_id) == -1) {
                // 		dayMuteConvId.push(v.conversation_id);
                // 	}
                // 	if ($('#conv'+v.conversation_id).find('.mute_bell').length == 0) {
                // 		$('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                // 		$('#conv'+v.conversation_id).addClass('mute_conv');
                // 		$('#conv'+v.conversation_id).attr('data-mute',v.mute_id);
                // 	}
                // }else if (end < currentDateTime) {
                // 	console.log('Mute OFF');
                // 	if (dayMuteConvId.indexOf(v.conversation_id) > -1) {
                // 		removeA(dayMuteConvId, v.conversation_id);
                // 	}
                // 	if ($('#conv'+v.conversation_id).find('.mute_bell').length == 1) {
                // 		$('#conv'+v.conversation_id).children('.mute_bell').remove();
                // 	}
                // }

                // Alternative Solution
                // debugger;
                var ct = moment().format("HH:mm a");
                ct = moment(ct, "HH:mm a");
                var st = moment(v.mute_start_time, "HH:mm a");
                var et = moment(v.mute_end_time, "HH:mm a");

                if ((st.hour() >= 12 && et.hour() <= 12) || et.isBefore(st)) {
                    et.add(1, "days");
                }
                var isBetween = ct.isBetween(st, et);

                if (isBetween) {
                    if (dayMuteConvId.indexOf(v.conversation_id) == -1) {
                        dayMuteConvId.push(v.conversation_id);
                    }
                    if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                        // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                        $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                        $('#conv' + v.conversation_id).addClass('mute_conv');
                        $('#conv' + v.conversation_id).attr('data-mute', v.mute_id);
                    }

                } else {
                    if (dayMuteConvId.indexOf(v.conversation_id) > -1) {
                        removeA(dayMuteConvId, v.conversation_id);
                    }
                    if ($('#conv' + v.conversation_id).find('.mute_bell').length == 1) {
                        $('#conv' + v.conversation_id).children('.mute_bell').remove();
                    }
                }

            } else {
                if ($('#conv' + v.conversation_id).find('.mute_bell').length == 1) {
                    $('#conv' + v.conversation_id).children('.mute_bell').remove();
                }
            }
        });
        // console.log(dayMuteConvId)
    }

}, 2000);

///for all popup
function viewAllBackWrap(id, type = '') {
    if ($('#' + id).is(':visible')) {
        $('#' + id).hide();
    } else {
        if (id == 'notificationPopup') {
            if ($('#viewMuteNotification').hasClass('active')) {
                unmuteNotification()
                console.log('unmute');
                return false;
            }
            $('#' + id).css('display', 'flex');
        } else {
            $('#' + id).show();
        }
        if (id == 'notificationPopup') {
            if (type == 'global') {
                $('#notificationPopup').attr('mute-type', type);
            } else {
                $('#notificationPopup').attr('mute-type', 'single');
            }
            $('#muteSubmitButton').text('Mute');
            $('#buttonCancel').text('Cancel');
            var conversationId = $('.side_bar_list_item li.sideActive').attr('data-conversationid');
            if (myAllMuteConvid.indexOf(conversationId) !== -1) {
                $.each(myAllMuteConv, function(k, v) {
                    if (v.conversation_id == conversationId) {
                        $('#notificationPopup').attr('data-mute-id', v.mute_id);
                        $('#muteDeleteButton').show();
                        $('#muteDeleteButton').text('Unmute');
                        $('#muteSubmitButton').show();
                        $("input[type='radio'][name='muteNotification'][value='" + v.mute_duration + "']").closest('label').trigger('click');
                        if (v.mute_duration == 'ownMuteOption') {
                            var dataMuteId = $('#notificationPopup').attr('data-mute-id');
                            $.each(myAllMuteConv, function(k, v) {
                                if (v.mute_id == dataMuteId) {
                                    if (v.mute_day != null) {
                                        $('.custom_dateTime').hide();
                                        $('.custom_time').show();
                                        $('#muteCustomTime').val(v.mute_start_time);
                                        $('#muteCustomendTime').val(v.mute_end_time);
                                        $.each(v.mute_day, function(k, v) {
                                            $.each($('.days_row .days'), function(ka, va) {
                                                if ($(va).attr('data-name') == v) {
                                                    $('.days.' + v).addClass('active');
                                                }
                                            });
                                        });
                                    } else {
                                        $('#muteCustomDate').val(moment(new Date(v.mute_start_time), "llll").format('DD-MM-YYYY HH:MM'));
                                        $('#muteCustomendDate').val(moment(new Date(v.mute_end_time), "llll").format('DD-MM-YYYY HH:MM'));
                                    }
                                }
                            });
                            $('#mutedateTime').show();
                        }
                    }
                });
            } else {
                $("input[type='radio'][name='muteNotification']").prop('checked', false);
                $("input[type='radio'][name='muteNotification'][value='20Y']").closest('label').trigger('click');
                $('#muteDeleteButton').hide();
                $('#muteSubmitButton').show();
                $('#mutedateTime').hide();
            }
        }
    }
    popupMouseEnter();
}
//for mute notification
function muteSubmit() {
    // debugger;
    if ($("input[type='radio'][name='muteNotification']:checked").length == 1) {
        var muteNotificationValue = $(".notification_mute_time label input[type='radio'][name='muteNotification']:checked").val();
        var conversation_id = $('#lastActive').val();
        var mute_id = $('#notificationPopup').attr('data-mute-id');
        var nowTime = moment().format('llll');
        // var nowUnix = moment(nowTime).unix();
        var endTime,endUnix;
        if (muteNotificationValue == "30M") {
            endTime = moment(nowTime).add('30', 'minutes').format('llll');
            // endUnix = moment(nowTime).add('30', 'minutes').unix();
        } else if (muteNotificationValue == "1H") {
            endTime = moment(nowTime).add('1', 'hour').format('llll');
            // endUnix = moment(nowTime).add('1', 'hour').unix();
        } else if (muteNotificationValue == "12H") {
            endTime = moment(nowTime).add('12', 'hours').format('llll');
            // endUnix = moment(nowTime).add('12', 'hours').unix();
        } else if (muteNotificationValue == "1D") {
            endTime = moment(nowTime).add('1', 'day').format('llll');
            // endUnix = moment(nowTime).add('1', 'day').unix();
        } else if (muteNotificationValue == "1W") {
            endTime = moment(nowTime).add('1', 'week').format('llll');
            // endUnix = moment(nowTime).add('1', 'week').unix();
        } else if (muteNotificationValue == "1M") {
            endTime = moment(nowTime).add('1', 'months').format('llll');
            // endUnix = moment(nowTime).add('1', 'months').unix();
        } else if (muteNotificationValue == "1Y") {
            endTime = moment(nowTime).add('1', 'year').format('llll');
            // endUnix = moment(nowTime).add('1', 'year').unix();
        } else if (muteNotificationValue == "20Y") {
            endTime = moment(nowTime).add('20', 'years').format('llll');
            // endUnix = moment(nowTime).add('20', 'years').unix();
        } else if (muteNotificationValue == "ownMuteOption") {
            // debugger;
            if ($('#mutedateTime .custom_time').is(':visible')) {
                if ($('#muteCustomTime').val() != '' && $('#muteCustomendTime').val() != '') {
                    nowTime = moment($('#muteCustomTime').val(), "HH:mm a").format('LT');
                    endTime = moment($('#muteCustomendTime').val(), "HH:mm a").format('LT');
                    // nowUnix = 0;
                    // endUnix = 0;
                } else {
                    $('#warningsPopup').css('display', 'flex');
                    $('#warningsPopup .warningMsg').text('Please select time.');
                    return;
                }
            } else {
                nowTime = moment($('#muteCustomDate').val(), "DD-MM-YYYY HH:MM").format('llll');
                endTime = moment($('#muteCustomendDate').val(), "DD-MM-YYYY HH:MM").format('llll');
                
                // nowUnix = moment($('#muteCustomDate').val(), "DD-MM-YYYY HH:MM").unix();
                // endUnix = moment($('#muteCustomendDate').val(), "DD-MM-YYYY HH:MM").unix();
            }
            
        }

        // console.log(nowTime, endTime, muteDays);

        var allConv = [];
        $.each($('#connectAsideContainer li'), function(k, v) {
            var id = $(v).attr('data-conversationid');
            if (id != undefined && id != user_id) {
                if (allConv.indexOf(id) == -1) {
                    allConv.push(id);
                }
            }
        });

        console.log('allConv', allConv)

        if ($('#notificationPopup').attr('mute-type') == 'single') {
            if ($('#notificationPopup').attr('data-mute-id') == "") {

                var data = {
                    conv_id: conversation_id,
                    user_id: user_id,
                    mute_start_time: nowTime,
                    mute_duration: muteNotificationValue,
                    mute_end_time: endTime,
                    mute_day: (muteDays.length == 0) ? null : muteDays,
                    allConv: [conversation_id],
                    timezone: moment().format('Z'),
                    // show_notification: false

                };

                console.log('Mute Create', data);
                closeModal('notificationPopup');
                socket.emit('mute_create', data, (res) => {
                    console.log('mute__create', res.data);
                    // if (res.status) {
                    //     $.each(res.data, function(k, v) {
                    //         $('#notificationPopup').attr('data-mute-id', v.mute_id);
                    //         $('#viewMuteNotification').addClass('active');
                    //         myAllMuteConv.push(v);
                    //         myAllMuteConvid.push(v.conversation_id);
                    //         if (v.mute_day != null) {
                    //             myAllDayMuteConv.push(v);
                    //         } else {
                    //             // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                    //             if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                    //                 $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                    //             }
                    //         }
                    //         $('#conv' + v.conversation_id).addClass('mute_conv');
                    //         $('#conv' + v.conversation_id).attr('data-mute', v.mute_id);
                    //     });
                    // }
                });
            } else {
                if (muteNotificationValue != 'ownMuteOption') {
                    muteDays = null;
                } else {
                    if (!$('.custom_dateTime').is(':visible')) {
                        muteDays = [];
                        $.each($('.days_row .days.active'), function(k, v) {
                            var days = $(v).attr('data-name');
                            if (muteDays.indexOf(days) == -1) {
                                muteDays.push(days);
                            }
                        })
                    } else {
                        muteDays = null;
                    }
                }
                var data = {
                    mute_id: mute_id,
                    mute_start_time: nowTime,
                    mute_duration: muteNotificationValue,
                    mute_end_time: endTime,
                    mute_day: muteDays,
                    timezone: moment().format('Z')
                };

                // console.log('update', data);
                socket.emit('mute_update', data, (res) => {

                    $.each(myAllMuteConv, function(k, v) {
                        if (v.mute_id == mute_id) {
                            if (muteDays != null) {
                                if (myAllDayMuteConv.indexOf(v) == -1) {
                                    myAllDayMuteConv.push(v);
                                }
                            }
                            v.mute_start_time = nowTime;
                            v.mute_duration = muteNotificationValue;
                            v.mute_end_time = endTime;
                            if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                                // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                                $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                            }
                        }
                    });

                    if (muteDays != null) {
                        console.log(muteDays);
                        $.each(myAllDayMuteConv, function(k, v) {
                            if (v.mute_id == mute_id) {
                                v.mute_start_time = nowTime;
                                v.mute_duration = muteNotificationValue;
                                v.mute_end_time = endTime;
                                v.mute_day = muteDays
                            }
                        });
                    }
                    closeModal('notificationPopup');
                });
            }
        } else {
            if ($('#notificationPopup').attr('data-mute-id') == "") {
                var data = {
                    conv_id: conversation_id,
                    user_id: user_id,
                    mute_start_time: nowTime,
                    mute_duration: muteNotificationValue,
                    mute_end_time: endTime,
                    mute_day: (muteDays.length == 0) ? null : muteDays,
                    allConv: allConv,
                    timezone: moment().format('Z'),
                    // show_notification: false
                };

                console.log('data', data)
                closeModal('notificationPopup');
                socket.emit('mute_create', data, (res) => {
                    console.log('mute__create', res.data);
                    // if (res.status) {
                    //     $.each(res.data, function(k, v) {
                    //         $('#notificationPopup').attr('data-mute-id', v.mute_id);
                    //         $('#viewMuteNotification').addClass('active');
                    //         myAllMuteConv.push(v);
                    //         myAllMuteConvid.push(v.conversation_id);
                    //         if (v.mute_day != null) {
                    //             myAllDayMuteConv.push(v);
                    //         } else {
                    //             // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                    //             if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                    //                 $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                    //             }
                    //         }
                    //         // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                    //         // $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                    //         $('#conv' + v.conversation_id).addClass('mute_conv');
                    //         $('#conv' + v.conversation_id).attr('data-mute', v.mute_id);
                    //     });
                    // }
                });
            } else {
                // var data = {
                // 	mute_id : mute_id,
                // 	mute_start_time : nowTime,
                // 	mute_duration : muteNotificationValue,
                // 	mute_end_time : endTime
                // };
                // socket.emit('mute_update',data,(res)=>{
                // 	$.each(myAllMuteConv,function(k,v){
                // 		if(v.mute_id == mute_id){
                // 			v.mute_start_time = nowTime;
                // 			v.mute_duration = muteNotificationValue;
                // 			v.mute_end_time = endTime;
                // 		}
                // 	});
                // 	closeModal('notificationPopup');
                // });
            }
        }
    } else {
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('Please select one mute option.');
    }

}
socket.on('mute_sync_create', function(res) {
    console.log('mute_sync__create',res);
    debugger;
    if (res.result.status) {
        $.each(res.result.data, function(k, v) {
            $('#notificationPopup').attr('data-mute-id', v.mute_id);
            $('#viewMuteNotification').addClass('active');
            myAllMuteConv.push(v);
            myAllMuteConvid.push(v.conversation_id);
            if (v.mute_day != null) {
                myAllDayMuteConv.push(v);
            } else {
                // $('#conv'+v.conversation_id).append('<span data-mute-id="'+v.mute_id+'" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="showMuteDropDown(event,\''+v.mute_id+'\',\''+v.conversation_id+'\')"></span>');
                if ($('#conv' + v.conversation_id).find('.mute_bell').length == 0) {
                    $('#conv' + v.conversation_id).append('<span data-mute-id="' + v.mute_id + '" class="mute_bell" data-balloon="Mute is on for this room" data-balloon-pos="left" onclick="unmuteNotification(event)"></span>');
                }
            }
            $('#conv' + v.conversation_id).addClass('mute_conv');
            $('#conv' + v.conversation_id).attr('data-mute', v.mute_id);
        });
    }
});
socket.on('mute_sync_delete',function(res) {
        debugger
        if (res.status == "success") {
            $.each(myAllMuteConv, function(ka, va) {
                if (va.mute_id == res.mute_id[0]) {
                    $('#conv' + va.conversation_id).children('.mute_bell').remove();
                    $('#conv' + va.conversation_id).attr('data-mute', 'unmute');
                    $('#conv' + va.conversation_id).removeClass('mute_conv');
                    $('#viewMuteNotification').removeClass('active');
                    removeA(myAllMuteConv, va);
                    removeA(myAllMuteConvid, va.conversation_id);
                    removeA(myAllDayMuteConv, va);
                    removeA(dayMuteConvId, va.conversation_id);
                    closeModal('notificationPopup');
                    $('.customTooltipSidebar').hide();
                    return false;
                }
            });
    
        } else {
            console.log(res);
        }
    
    })

function unmuteNotification(e) {
    var muteId = '';
    if (e != undefined) {
        e.stopImmediatePropagation();
        e.preventDefault();
        muteId = $(e.target).attr('data-mute-id');
    } else {
        muteId = $('#conv' + conversation_id).attr('data-mute');
    }
    //var conversation_id = $('#lastActive').val();

    console.log('muteId', muteId);
    var data = {
        mute_id: [muteId],
        user_id: user_id
    };

    console.log('data', data);
    if (data.muteId != '' && data.muteId != 'unmute') {
        socket.emit('unmute_notification', data, (res) => {
            if (res.status == "success") {
                $.each(myAllMuteConv, function(ka, va) {
                    if (va.mute_id == muteId) {
                        $('#conv' + va.conversation_id).children('.mute_bell').remove();
                        $('#conv' + va.conversation_id).attr('data-mute', 'unmute');
                        $('#conv' + va.conversation_id).removeClass('mute_conv');
                        $('#viewMuteNotification').removeClass('active');
                        removeA(myAllMuteConv, va);
                        removeA(myAllMuteConvid, va.conversation_id);
                        removeA(myAllDayMuteConv, va);
                        removeA(dayMuteConvId, va.conversation_id);
                        closeModal('notificationPopup');
                        $('.customTooltipSidebar').hide();
                        return false;
                    }
                });

            } else {
                console.log(res);
            }
        });
    }
}
var getFilesInfo = (files, array) => {
    var refiles = [];
    for (f in files) {
        if (array.indexOf(files[f].id) > -1) refiles.push(files[f]);
    }
    return refiles;
}

var startTickMuteNotification = new Date().getTime();
var intervalMuteNotification = moment.duration(40, "seconds").timer({
        loop: true,
        wait: 2500,
        executeAfterWait: true
    },
    function() {
        $.each(notificationMuteEnd, function(k, v) {
            let now = moment().format('x');
            let timeDiff = Math.floor(v.endtime - now);
            let secDifference = Math.floor(timeDiff / 1000);
            let minDiff = Math.floor(secDifference / 60);
            if (minDiff == 0) {
                var data = {
                    mute_id: v.mute_id,
                    user_id: user_id
                };
                socket.emit('unmute_notification', data, (res) => {
                    if (res.status == "success") {
                        $.each(myAllMuteConv, function(ka, va) {
                            if (v.mute_id == va.mute_id) {
                                //$('#conv'+va.conversation_id).children('.unreadMsgCount').css('display', 'block');
                                $('#conv' + va.conversation_id).children('.mute_bell').remove();
                                removeA(myAllMuteConv, va);
                                removeA(myAllMuteConvid, va.conversation_id);
                                if ($('#notificationPopup[data-mute-id=' + va.mute_id + ']').is(':visible')) {
                                    closeModal('notificationPopup');
                                }
                                if ($('#conv' + va.conversation_id + ' .customTooltipSidebar').is(':visible')) {
                                    $('#conv' + va.conversation_id + ' .customTooltipSidebar').remove();
                                }
                                return false;
                            }
                        });

                    } else {
                        console.log(res);
                    }
                });
            }

        });
    });

function check_con_page_action() {
    if (getCookie('create_to_f_con') != "") {
        return true;
    } else {
        return false;
    }
}

function removeCookieFile(i, val) {
    $(".fileno_" + i).remove();
    removeA(cookieFiles, val);
}

function designForUsers(type) {
    if (type == 'admin') {
        $('#dueDatePicker').css('background-color', '#ffffff');
        $('#selectWorkspace').css('background-color', '#ffffff');
        $('#notes_area').css('background-color', '#ffffff');
        $('#dueDatePicker').css('border', '1px solid #E1E4E8');
        $('#selectWorkspace').css('border', '1px solid #E1E4E8');
        $('#notes_area').css('border', '1px solid #E1E4E8');
    } else {
        $('#dueDatePicker').css('background-color', '#FAFAFA');
        $('#selectWorkspace').css('background-color', '#FAFAFA');
        $('#notes_area').css('background-color', '#FAFAFA');
        $('#dueDatePicker').css('border', '1px solid #d8d8d8');
        $('#selectWorkspace').css('border', '1px solid #d8d8d8');
        $('#notes_area').css('border', '1px solid #d8d8d8');
    }
}

function showMuteDropDown(event, muteId, convId) {
    $('#notificationPopup').attr('data-mute-id', muteId);
    if ($('.customTooltipSidebar').is(':visible')) {
        if ($('#conv' + convId).find('.customTooltipSidebar').length > 0) {
            $('#conv' + convId).find('.customTooltipSidebar').remove();
            $('#notificationPopup').attr('data-mute-id', "");
        } else {
            $('#conv' + convId).find('.customTooltipSidebar').remove();
            $('#conv' + convId).append('<div class="customTooltipSidebar"> <button class="event-cancel-btn" onclick="unmuteNotification()">Unmute Room</button><button class="event-create-btn" onclick="showMuteChangeOption(\'' + muteId + '\',\'' + convId + '\')">Mute Options</button></div>');
        }
    } else {

        $('#conv' + convId).append('<div class="customTooltipSidebar"> <button class="event-cancel-btn" onclick="unmuteNotification()">Unmute Room</button><button class="event-create-btn" onclick="showMuteChangeOption(\'' + muteId + '\',\'' + convId + '\')">Mute Options</button></div>');
    }
}

function showMuteChangeOption(muteId, convId) {
    $('#notificationPopup').attr('data-mute-id', convId);
    $('#notificationPopup').css('display', 'flex');
    var conversationId = convId;
    if (myAllMuteConvid.indexOf(conversationId) !== -1) {
        $.each(myAllMuteConv, function(k, v) {
            if (v.conversation_id == conversationId) {
                $('#notificationPopup').attr('data-mute-id', v.mute_id);
                $('#muteDeleteButton').show();
                $('#muteDeleteButton').text('Unmute');
                $('#muteSubmitButton').show();
                $("input[type='radio'][name='muteNotification'][value='" + v.mute_duration + "']").closest('label').trigger('click');
                if (v.mute_duration == "ownMuteOption") {
                    $('#mutedateTime').show();
                    if (v.mute_day != null) {
                        $('.custom_dateTime').hide();
                        $('.custom_time').show();
                        $('#muteCustomTime').val(v.mute_start_time);
                        $('#muteCustomendTime').val(v.mute_end_time);
                        $.each(v.mute_day, function(k, v) {
                            $.each($('.days_row .days'), function(ka, va) {
                                if ($(va).attr('data-name') == v) {
                                    $('.days.' + v).addClass('active');
                                }
                            });
                        });
                    } else {
                        $('#muteCustomendDate').val(moment(new Date(v.mute_end_time), "llll").format('DD-MM-YYYY HH:MM'));
                        $('#muteCustomDate').val(moment(new Date(v.mute_start_time), "llll").format('DD-MM-YYYY HH:MM'));
                    }
                }
            }
        });
    }

}

$("#muteCustomDate").flatpickr({
    enableTime: true,
    dateFormat: "d-m-Y h:m",
    minDate: "today",
    time_24hr: true
});

$("#muteCustomendDate").flatpickr({
    enableTime: true,
    dateFormat: "d-m-Y h:m",
    minDate: "today",
    time_24hr: true
});

var onlytime = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i K",
}

var endMin = '';
$('#muteCustomTime').flatpickr({
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    onClose: function(selectedDates, dateStr, instance) {
        if (dateStr) {
            console.log('selectedDates', selectedDates, 'dateStr', dateStr);
            endMin = dateStr;
            // instance.close();
        }
    }
});

$('#muteCustomendTime').flatpickr({
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    onClose: function(selectedDates, dateStr, instance) {
        if (dateStr) {
            console.log('selectedDates', selectedDates, 'dateStr', dateStr);
            // instance.close();
        }
    }
});

$("#timeFrom").flatpickr(onlytime);
$("#timeTo").flatpickr(onlytime);
$("#timeReminder").flatpickr(onlytime);
// function forSharemsg(convId,convName,convImg){
// 	if (selectedShareMember.length < 10) {
// 		// draw_name();
// 		var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="/images/users/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\'/images/users/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
// 		$('.searchInput').append(design);
// 		make_content_non_editable('selected_member_name');
// 		$('#suggestUsers' + convId).remove();
// 		selectedShareMember.push(convId);
// 		var el = document.getElementById('searchInputForShare');
// 		placeCaretAtEnd(el);
// 		$('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
// 	} else {
// 		toastr["warning"]("This conversation is not allowed.", "Warning");
// 	}
// }

function userAddAction(uuid, username, imgsrc) {

    if ($('#shareMessagePopUp').is(':visible')) {
        var limitAccess = 10;
        if (ShareMessagePopAction == 'convert') {
            limitAccess = 1;
        } else {
            limitAccess = 10;
        }
        if (limitAccess == 1) {
            $('#shareMessagePopUp').addClass('itemDisable');
        } else {
            $('#shareMessagePopUp').removeClass('itemDisable');
        }
        if (selectedShareMember.length < limitAccess) {

            // draw_name();
            // var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="/images/users/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\'/images/users/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
            // $('.searchInput').append(design);
            // make_content_non_editable('selected_member_name');
            var type = $('#suggestUsers' + uuid).attr('data-type');

            $('#suggestUsers' + uuid).remove();
            var html = '<div class="mini_item _mini_item_' + uuid + '">' +
                '<p class="mini_name">' + username + '</p><span class="mini_remove_ico" onclick="removeShareMember(\'' + uuid + '\')"></span>' +
                '</div>';
            $('#shareMsgminiHolder').prepend(html);
            if (type == 'user') {
                $('._mini_item_' + uuid).addClass('loading');
                $('._mini_item_' + uuid).addClass('user');
                if (user_id == uuid) {
                    selectedShareMember.push(user_id);
                    $('._mini_item_' + uuid).removeClass('loading');
                    $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
                    $('#shareMsgminiHolder input').focus();
                    if (selectedShareMember == 0) {
                        $('#shareMessagePopUp .sub_btn').removeClass('active');
                    } else {
                        $('#shareMessagePopUp .sub_btn').addClass('active');
                    }
                } else {
                    selectedShareMember.push(uuid);
                    socket.emit('findandgetconv', { user_id: user_id, fnd_id: uuid }, function(res2) {
                        if (res2.status) {
                            removeA(selectedShareMember, uuid);
                            selectedShareMember.push(res2.data.conversation_id);
                            $('._mini_item_' + uuid).removeClass('loading');
                            $('._mini_item_' + uuid).attr("data-conv", res2.data.conversation_id);
                            $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
                            $('#shareMsgminiHolder input').focus();
                            if (selectedShareMember == 0) {
                                $('#shareMessagePopUp .sub_btn').removeClass('active');
                            } else {
                                $('#shareMessagePopUp .sub_btn').addClass('active');
                            }
                        } else {
                            if (res2.err) {
                                console.log(2327, res2.err);
                            } else {
                                var data = {
                                    created_by: user_id,
                                    participants: [user_id, uuid],
                                    company_id: company_id

                                }
                                socket.emit('createNewSingleconv', data, function(res) {
                                    if (res.status) {
                                        var conv_Id = res.result.conversation_id;
                                        removeA(selectedShareMember, uuid);
                                        selectedShareMember.push(conv_Id);
                                        $('._mini_item_' + uuid).removeClass('loading');
                                        $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
                                        $('#shareMsgminiHolder input').focus();
                                        if (selectedShareMember == 0) {
                                            $('#shareMessagePopUp .sub_btn').removeClass('active');
                                        } else {
                                            $('#shareMessagePopUp .sub_btn').addClass('active');
                                        }
                                    } else {
                                        console.log(3330, res)
                                    }
                                })
                            }
                        }
                    })
                }
            } else {
                selectedShareMember.push(uuid);
                $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
                $('#shareMsgminiHolder input').focus();
                if (selectedShareMember == 0) {
                    $('#shareMessagePopUp .sub_btn').removeClass('active');
                } else {
                    $('#shareMessagePopUp .sub_btn').addClass('active');
                }
            }
            $('.input_hayven input').val('');
            console.log($('#shareMessagePopUp input'))

            // var el = document.getElementById('searchInputForShare');
            // placeCaretAtEnd('#shareMsgminiHolder input');

        } else {
            // toastr["warning"]("This member is not allowed.", "Warning");

            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('This member is not allowed.');
        }
        $('#shareMessagePopUp input').val('').focus();
    } else if ($('#groupAdminArea').is(':visible')) {
        if (!$('.suggestUsers' + uuid).hasClass('adminProfile')) {
            draw_name();
            var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="/images/users/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\'/images/users/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
            $('#searchInForGroupUp').append(design);
            make_content_non_editable('selected_member_name');
            $('.suggestUsers' + uuid).remove();
            groupAdminAreaArray.push(uuid);
            var el = document.getElementById('searchInForGroupUp');
            placeCaretAtEnd(el);
        }
    } else if ($('#ownerAreaForTodo').is(':visible')) {
        if (!$('.suggestUsers' + uuid).hasClass('adminProfile')) {
            draw_name();
            var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="/images/users/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\'/images/users/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
            $('#searchForOwnerToDo').append(design);
            make_content_non_editable('selected_member_name');
            $('.suggestUsers' + uuid).remove();
            activity_participantsArr.push(uuid);
            var el = document.getElementById('searchForOwnerToDo');
            placeCaretAtEnd(el);
        }
    }
}

var draw_name = () => {
    if ($('#createDirMsgContainer').is(':visible')) {
        var name_span = '';
        var all_name = $('.add-direct-member>.selected_member_name');
        $.each(all_name, function(k, v) {
            $(v).find('img').remove();
            name_span += '<span class="selected_member_name" data-uuid="' + $(v).attr('data-uuid') + '" data-img="' + $(v).attr('data-img') + '"><span class="user_name">' + $(v).text() + '</span><img src="/images/basicAssets/Remove.svg" onClick="remove_this_user(event,\'' + $(v).attr('data-uuid') + '\',\'' + $(v).attr('data-img') + '\',\'' + $(v).text() + '\')"></span> &shy;'; // it's a special char &shy; non visible in html
        });
        $('.add-direct-member').html(name_span);
    } else if ($('#shareMessagePopUp').is(':visible')) {
        var name_span = '';
        var all_name = $('#searchInputForShare>.selected_member_name');
        $.each(all_name, function(k, v) {
            $(v).find('img').remove();
            name_span += '<span class="selected_member_name" data-uuid="' + $(v).attr('data-uuid') + '" data-img="' + $(v).attr('data-img') + '"><span class="user_name">' + $(v).text() + '</span><img src="/images/basicAssets/Remove.svg" onClick="remove_this_user_search(event,\'' + $(v).attr('data-uuid') + '\',\'' + $(v).attr('data-img') + '\',\'' + $(v).text() + '\')"></span> &shy;'; // it's a special char &shy; non visible in html
        });
        $('#searchInputForShare').html(name_span);
    } else if ($('#groupAdminArea').is(':visible')) {
        var name_span = '';
        var all_name = $('#searchInForGroupUp>.selected_member_name');
        $.each(all_name, function(k, v) {
            $(v).find('img').remove();
            name_span += '<span class="selected_member_name" data-uuid="' + $(v).attr('data-uuid') + '" data-img="' + $(v).attr('data-img') + '"><span class="user_name">' + $(v).text() + '</span><img src="/images/basicAssets/Remove.svg" onClick="remove_this_user_search(event,\'' + $(v).attr('data-uuid') + '\',\'' + $(v).attr('data-img') + '\',\'' + $(v).text() + '\')"></span> &shy;'; // it's a special char &shy; non visible in html
        });
        $('#searchInForGroupUp').html(name_span);
    } else if ($('#ownerAreaSUggestedList').is(':visible')) {
        var name_span = '';
        var all_name = $('#searchForOwnerToDo>.selected_member_name');
        $.each(all_name, function(k, v) {
            $(v).find('img').remove();
            name_span += '<span class="selected_member_name" data-uuid="' + $(v).attr('data-uuid') + '" data-img="' + $(v).attr('data-img') + '"><span class="user_name">' + $(v).text() + '</span><img src="/images/basicAssets/Remove.svg" onClick="remove_this_user_search(event,\'' + $(v).attr('data-uuid') + '\',\'' + $(v).attr('data-img') + '\',\'' + $(v).text() + '\')"></span> &shy;'; // it's a special char &shy; non visible in html
        });
        $('#searchForOwnerToDo').html(name_span);
    }

    make_content_non_editable('selected_member_name');
}
var make_content_non_editable = (classname) => {
    var spans = document.getElementsByClassName(classname);
    for (var i = 0, len = spans.length; i < len; ++i) {
        spans[i].contentEditable = "false";
    }
    $('.no_of_user_left_to_add>span').text(10 - memberListUUID.length);
};

var userListDesign = (data) => {
    var returnda = true;
    if ($('#shareMessagePopUp').is(':visible')) {
        if (data.conversation_id == conversation_id) {
            console.log('It\'s you.')
            return;
        }
        //if($('#roomIdDiv').attr('topic-type') == 'work'){
        if (data.conv_img == null || data.conv_img == 'null') {
            data.conv_img = 'feelix.jpg';
        }
        var design = '<li class="memberContainer showEl" id="suggestUsers' + data.conversation_id + '" data-type="' + data.type + '" data-id="' + data.conversation_id + '" dat-img-src="' + data.conv_img + '" data-fullname="' + data.title + '" onclick="userAddAction(\'' + data.conversation_id + '\', \'' + data.title + '\', \'' + data.conv_img + '\')">';
        if (data.type == 'user') {

            design += '<img src="' + file_server + 'profile-pic/Photos/' + data.conv_img + '" class="profile">';
        } else {

            design += '<img src="' + file_server + 'room-images-uploads/Photos/' + data.conv_img + '" class="profile">';
        }
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.conversation_id + '">' + data.title + '</span>';
        //design += '<span class="designation-name">@ Navigate</span>';
        design += '</li>';
        // }else{
        //     var design = '<li class="memberContainer showEl" id="suggestUsers' + data.id + '" data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="' + data.fullname + '" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
        //     design += '<img src="/images/users/' + data.img + '" class="profile">';
        //     design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        //     design += '<span class="designation-name">@ Navigate</span>';
        //     design += '</li>';
        // }
        if (data.sub_participants == null) {
            data.sub_participants = [];
        }
        if (data.title == 'Main group without dalim') {
            console.log(3170, data)
        }
        // console.log(3166,data.sub_participants.indexOf(user_id))
    } else if ($('#groupAdminArea').is(':visible')) {
        var design = '<li class="memberContainer suggestUsers' + data.id + ' showEl"  data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
        design += '<img src="' + file_server + 'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="online_' + data.id + ' ' + (onlineUserList.indexOf(data.id) === -1 ? "offline" : "online") + '"></span>';
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '</li>';
    } else if ($('#createDirMsgContainer').is(':visible')) {
        var design = '<li class="showEl"> ';
        design += '<img src="' + file_server + 'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="name s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '<span class="designation-name">@ Navigate</span>';
        design += '</li>';
    } else if ($('#ownerAreaForTodo').is(':visible')) {
        var design = '<li class="memberContainer suggestUsers' + data.id + ' showEl"  data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
        design += '<img src="' + file_server + 'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="online_' + data.id + ' ' + (onlineUserList.indexOf(data.id) === -1 ? "offline" : "online") + '"></span>';
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '</li>';
    }

    return design;
}
var filter_user_list = (event) => {
    var fullhtml = $(event.target).text();
    var fullstr = "";
    for (var i = 0; i < fullhtml.length; i++) {
        if (fullhtml.charCodeAt(i) == 173) // it's a special char &shy; non visible in html
            fullstr += '@';
        else
            fullstr += fullhtml.charAt(i);
    };
    var value = fullstr.split('@');
    searchsldefclas(event, value[value.length - 1]);
};

var searchsldefclas = (event, value) => {
    value = value.trim();
    if (event.keyCode !== 40 && event.keyCode !== 38 && event.keyCode !== 13 && event.keyCode !== 27) {
        $(".s-l-def-clas").each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('li').show();
                $(this).parent('li').addClass('showEl');
            } else {
                $(this).parent('li').hide();
                $(this).parent('li').removeClass('showEl');
            }
        });

        $('.s-l-def-clas').unhighlight();
        $('.s-l-def-clas').highlight(value);
        if ($('#directMsgUserList').is(':visible')) {
            $("#directMsgUserList li").removeClass('selected');
            $("#directMsgUserList li.showEl:first").addClass('selected');
        } else if ($('#createChannelContainer').is(':visible')) {
            $("#createChannelContainer .invite-member li").removeClass('selected');
            $("#createChannelContainer .invite-member li.showEl:first").addClass('selected');
        } else if ($('#shareMessagePopUp').is(':visible')) {
            $("#shareMessagePopUp li").removeClass('selected');
            $("#shareMessagePopUp li.showEl:first").addClass('selected');
        } else if ($('#groupAdminArea').is(':visible')) {
            $("#groupAdminArea li").removeClass('selected');
            $("#groupAdminArea li.showEl:first").addClass('selected');
        }

    } else if (event.keyCode == 27) {
        if (!$('.suggested-type-list').is(':visible')) {
            closeRightSection();
        }
    }

}

var arrowUpArrowDownKey = () => {
    /// ArrowUp value = 38
    /// ArrowDown value = 40
    $(document).keydown(function(e) {
        if (!$('#msg').is(':focus')) {
            $('.suggested-list li').removeClass('default');
            if (e.keyCode == 38) {
                if ($('#searchAfter').is(':visible')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    prevSearch();
                } else {
                    e.preventDefault();
                    if (!$('.backwrap').is(':visible') &&
                        !$('.add-team-member').is(':focus') &&
                        inputValueCountFun('taskBAinput', 'id') == false &&
                        inputValueCountFun('taskAAinput', 'id') == false &&
                        inputValueCountFun('taskEHinput', 'id') == false &&
                        inputValueCountFun('taskEHRinput', 'id') == false &&
                        inputValueCountFun('taskAHinput', 'id') == false &&
                        inputValueCountFun('taskAHRinput', 'id') == false &&
                        inputValueCountFun('chatbox', 'conte') == false &&
                        inputValueCountFun('msg', 'conte') == false &&
                        inputValueCountFun('add-team-member', 'class') == false &&
                        inputValueCountFun('team-name', 'id') == false &&
                        inputValueCountFun('create-todo-popup-title', 'class') == false &&
                        inputValueCountFun('create-event-popup-title', 'class') == false &&
                        !$('#ChatFileUpload_task').is(':visible') &&
                        !$('#ChatFileUpload').is(':visible') &&
                        !$('#threadReplyPopUp').is(':visible') &&
                        inputValueCountFun('sideBarSearch', 'id') == false) {
                        var activeIndexLI = getActiveLi('.side_bar_list_item li');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('.side_bar_list_item li:eq(' + newIndexLi + ')');
                        var sideBarHeight = $('#hayvenSidebar').height();
                        var sidebarLiCount = (sideBarHeight - 293) / 29;
                        var totalLi = $('.side_bar_list_item li').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.side-bar .os-viewport').animate({ scrollTop: 29 * totalLi }, 1);
                            } else {
                                if (totalLi > sidebarLiCount) {
                                    sidebarLiCount -= 4;
                                    $('.side-bar .os-viewport').animate({ scrollTop: 29 * newIndexLi }, 1);
                                }
                            }
                        }

                        $('.side_bar_list_item li').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('.side_bar_list_item li:first').addClass('selected');
                        }
                    }
                    if ($('#createChannelContainer').is(':visible') && !$('#createDirMsgContainer').is(':visible')) {
                        var activeIndexLI = getActiveLi('#s-l-def li.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#s-l-def li.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#s-l-def li.showEl').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.suggested-type-list .os-viewport').animate({ scrollTop: 64 * totalLi }, 1);
                            } else {
                                if (totalLi > newIndexLi) {
                                    newIndexLi -= 4;
                                    $('.suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                                }
                            }
                        }
                        $('#s-l-def li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                    if ($('#createDirMsgContainer').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#directMsgUserList li.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#directMsgUserList li.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#directMsgUserList li.showEl').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.createdirmsg_container .suggested-type-list .os-viewport').animate({ scrollTop: 64 * totalLi }, 1);
                            } else {
                                if (totalLi > newIndexLi) {
                                    newIndexLi -= 4;
                                    $('.createdirmsg_container .suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                                }
                            }
                        }
                        $('#directMsgUserList li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                    if ($('#shareMessagePopUp').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#shareMessagePopUp li.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#shareMessagePopUp li.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#shareMessagePopUp li.showEl').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.allMemberList  .os-viewport').animate({ scrollTop: 64 * totalLi }, 1);
                            } else {
                                if (totalLi > newIndexLi) {
                                    newIndexLi -= 4;
                                    $('.allMemberList  .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                                }
                            }
                        }
                        $('#shareMessagePopUp li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                    if ($('#memberListBackWrap').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#memberListBackWrap li.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#memberListBackWrap li.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#memberListBackWrap li.showEl').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.suggest_Container .os-viewport').animate({ scrollTop: 64 * totalLi }, 1);
                            } else {
                                if (totalLi > newIndexLi) {
                                    newIndexLi -= 4;
                                    $('.suggest_Container .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                                }
                            }
                        }
                        $('#memberListBackWrap li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                    if ($('#groupAdminArea').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#groupAdminArea li.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#groupAdminArea li.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#groupAdminArea li.showEl').length;
                        if (totalLi > newIndexLi) {

                            if (newIndexLi == -1) {
                                $('.allMemberList  .os-viewport').animate({ scrollTop: 64 * totalLi }, 1);
                            } else {
                                if (totalLi > newIndexLi) {
                                    newIndexLi -= 4;
                                    $('.allMemberList  .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                                }
                            }
                        }
                        $('#groupAdminArea li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                    if ($('#notificationPopup').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#notificationPopup label.showEl');
                        var newIndexLi = activeIndexLI - 1;
                        var nextLi = $('#notificationPopup label.showEl:eq(' + newIndexLi + ')');
                        var totalLi = $('#notificationPopup label.showEl').length;
                        $('#notificationPopup label.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        }
                    }
                }
            }

            if (e.keyCode == 40) {
                if ($('#searchAfter').is(':visible')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    nextSearch();
                } else {
                    e.preventDefault();
                    if (!$('.backwrap').is(':visible') && !$('.add-team-member').is(':focus') &&
                        inputValueCountFun('taskBAinput', 'id') == false &&
                        inputValueCountFun('taskAAinput', 'id') == false &&
                        inputValueCountFun('taskEHinput', 'id') == false &&
                        inputValueCountFun('taskEHRinput', 'id') == false &&
                        inputValueCountFun('taskAHinput', 'id') == false &&
                        inputValueCountFun('taskAHRinput', 'id') == false &&
                        inputValueCountFun('chatbox', 'conte') == false &&
                        !$('#ChatFileUpload').is(':visible') &&
                        !$('#threadReplyPopUp').is(':visible') &&
                        inputValueCountFun('msg', 'conte') == false && inputValueCountFun('add-team-member', 'class') == false && inputValueCountFun('team-name', 'id') == false && inputValueCountFun('create-todo-popup-title', 'class') == false && inputValueCountFun('create-event-popup-title', 'class') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible') && inputValueCountFun('sideBarSearch', 'id') == false) {
                        var activeIndexLI = getActiveLi('.side_bar_list_item li');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('.side_bar_list_item li:eq(' + newIndexLi + ')');
                        var sideBarHeight = $('#hayvenSidebar').height();
                        var sidebarLiCount = (sideBarHeight - 293) / 29;
                        if (newIndexLi > sidebarLiCount) {
                            newIndexLi -= sidebarLiCount
                            $('.side-bar .os-viewport').animate({ scrollTop: 29 * newIndexLi }, 1);
                        }
                        $('.side_bar_list_item li').removeClass('selected');
                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('.side_bar_list_item li:first').addClass('selected');
                            $('.side-bar .os-viewport').animate({ scrollTop: 0 }, 1);
                        }
                    }
                    if ($('#createChannelContainer').is(':visible') && !$('#createDirMsgContainer').is(':visible')) {
                        var activeIndexLI = getActiveLi('#s-l-def li.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#s-l-def li.showEl:eq(' + newIndexLi + ')');
                        if (newIndexLi > 4) {
                            newIndexLi -= 4
                            $('.suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }

                        $('#s-l-def li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#s-l-def li.showEl:first').addClass('selected');
                            $('.suggested-type-list .os-viewport').animate({ scrollTop: 0 }, 1);
                        }

                    }
                    if ($('#createDirMsgContainer').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#directMsgUserList li.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#directMsgUserList li.showEl:eq(' + newIndexLi + ')');
                        if (newIndexLi > 4) {
                            newIndexLi -= 4
                            $('.createdirmsg_container .suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }

                        $('#directMsgUserList li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#directMsgUserList li.showEl:first').addClass('selected');
                            $('.createdirmsg_container .suggested-type-list .os-viewport').animate({ scrollTop: 0 }, 1);
                        }

                    }
                    if ($('#shareMessagePopUp').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#shareMessagePopUp li.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#shareMessagePopUp li.showEl:eq(' + newIndexLi + ')');
                        if (newIndexLi > 4) {
                            newIndexLi -= 4
                            $('.allMemberList .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }

                        $('#shareMessagePopUp li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#shareMessagePopUp li.showEl:first').addClass('selected');
                            $('.allMemberList .os-viewport').animate({ scrollTop: 0 }, 1);
                        }

                    }
                    if ($('#memberListBackWrap').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#memberListBackWrap li.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#memberListBackWrap li.showEl:eq(' + newIndexLi + ')');
                        if (newIndexLi > 4) {
                            newIndexLi -= 4
                            $('.suggest_Container .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }

                        $('#memberListBackWrap li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#memberListBackWrap li.showEl:first').addClass('selected');
                            $('.suggest_Container .os-viewport').animate({ scrollTop: 0 }, 1);
                        }
                    }
                    if ($('#notificationPopup').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#notificationPopup label.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#notificationPopup label.showEl:eq(' + newIndexLi + ')');

                        $('#notificationPopup label.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#notificationPopup label.showEl:first').addClass('selected');
                        }
                    }
                    if ($('#groupAdminArea').is(':visible') == true) {
                        var activeIndexLI = getActiveLi('#groupAdminArea li.showEl');
                        var newIndexLi = activeIndexLI + 1;
                        var nextLi = $('#groupAdminArea li.showEl:eq(' + newIndexLi + ')');
                        if (newIndexLi > 4) {
                            newIndexLi -= 4
                            $('.allMemberList  .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }

                        $('#groupAdminArea li.showEl').removeClass('selected');

                        if (nextLi.length) {
                            nextLi.addClass('selected');
                        } else {
                            $('#groupAdminArea li.showEl:first').addClass('selected');
                            $('.allMemberList  .os-viewport').animate({ scrollTop: 0 }, 1);
                        }
                    }
                }
            }
            var code = e.keyCode || e.which;
            if (code == 13 && !e.shiftKey) {
                if ($('#hayvenConnectPage').hasClass('active')) {
                    e.preventDefault();
                    if ($('#createDirMsgContainer').is(':visible') == true) {
                        if ($('#directMsgUserList li.showEl').hasClass('selected')) {
                            $('#directMsgUserList li.showEl.selected').click();
                        } else {
                            check_and_submit_for_new_conv();
                        }
                    }
                    if (!$('.backwrap').is(':visible') && !$('.add-team-member').is(':focus') &&
                        inputValueCountFun('taskBAinput', 'id') == false &&
                        inputValueCountFun('taskAAinput', 'id') == false &&
                        inputValueCountFun('taskEHinput', 'id') == false &&
                        inputValueCountFun('taskEHRinput', 'id') == false &&
                        inputValueCountFun('taskAHinput', 'id') == false &&
                        inputValueCountFun('taskAHRinput', 'id') == false &&
                        inputValueCountFun('chatbox', 'conte') == false &&
                        inputValueCountFun('msg', 'conte') == false &&
                        !$('#ChatFileUpload').is(':visible') &&
                        !$('#threadReplyPopUp').is(':visible') &&
                        inputValueCountFun('add-team-member', 'class') == false && inputValueCountFun('team-name', 'id') == false && inputValueCountFun('create-todo-popup-title', 'class') == false && inputValueCountFun('create-event-popup-title', 'class') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible') && inputValueCountFun('sideBarSearch', 'id') == false && inputValueCountFun('searchAfter', 'id') == false && inputValueCountFun('create_subtask', 'id') == false) {
                        if (!$('.side_bar_list_item li.selected').hasClass('sideActive')) {
                            $('.side_bar_list_item li.selected').trigger('click');
                        }
                    }
                    if (!$('#createChannelContainer').is(':visible') && $('#memberListBackWrap').is(':visible') == true) {
                        $('#memberListBackWrap .suggested-list li.selected').trigger('click');
                    }
                    if ($('#createChannelContainer').is(':visible') && !$('#createDirMsgContainer').is(':visible')) {
                        $('#s-l-def li.selected').trigger('click');
                    }
                    if ($('#shareMessagePopUp').is(':visible') && !$('#createDirMsgContainer').is(':visible')) {
                        $('#shareMessagePopUp .suggested-list li.selected').trigger('click');
                    }
                    if ($('#notificationPopup').is(':visible') && !$('#createDirMsgContainer').is(':visible')) {
                        $('#notificationPopup label.selected').trigger('click');
                    }
                    if ($('#groupAdminArea').is(':visible')) {
                        $('#groupUpSuggestedList li.selected').trigger('click');
                    }
                }
            }
            if (e.keyCode == 8 && $('#createDirMsgContainer').is(':visible')) { // backspace
                var value = $('#add_direct_member').html();
                if ($('.selected_member_name').length > 0 && value.charCodeAt(value.length - 1) == 173) {
                    e.preventDefault();
                    var removeId = $('#add_direct_member .selected_member_name').last().attr('data-uuid');
                    removeA(memberList, $('#add_direct_member .selected_member_name').last().text());
                    removeA(memberListUUID, $('#add_direct_member .selected_member_name').last().attr('data-uuid'));
                    $('#add_direct_member .selected_member_name').last().remove();
                    draw_name();
                    var el = document.getElementById('add_direct_member');
                    placeCaretAtEnd(el);

                    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                    $.each(user_list, function(k, v) {
                        if (v.id == removeId) {
                            $('#directMsgUserList').append(userListDesign(v));
                        }
                    });
                    all_action_for_selected_member();
                    popupMouseEnter();
                }

            }
            if (e.keyCode == 8 && $('#shareMessagePopUp').is(':visible')) { // backspace
                var value = $('#searchInputForShare').html();
                if ($('.selected_member_name').length > 0 && value.charCodeAt(value.length - 1) == 173) {
                    e.preventDefault();
                    var removeUuid = $('#searchInputForShare .selected_member_name').last().attr('data-uuid');
                    removeA(selectedShareMember, removeUuid);
                    $('#searchInputForShare .selected_member_name').last().remove();
                    draw_name();
                    var el = document.getElementById('searchInputForShare');
                    placeCaretAtEnd(el);
                    $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);

                    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                    $.each(user_list, function(k, v) {
                        if (v.id == removeUuid) {
                            $('#shareSuggestedList').append(userListDesign(v));
                        }
                    });
                    popupMouseEnter();
                }
            }
            if (e.keyCode == 8 && $('#groupAdminArea').is(':visible')) { // backspace
                var value = $('#searchInForGroupUp').html();
                if ($('#searchInForGroupUp .selected_member_name').length > 0 && value.charCodeAt(value.length - 1) == 173) {
                    e.preventDefault();
                    var removeUuid = $('#searchInForGroupUp .selected_member_name').last().attr('data-uuid');
                    removeA(groupAdminAreaArray, removeUuid);
                    if (participantsAdminList.indexOf(uuid) !== -1) {
                        removeA(participantsAdminList, uuid);
                    }
                    $('#searchInForGroupUp .selected_member_name').last().remove();
                    draw_name();
                    var el = document.getElementById('searchInForGroupUp');
                    placeCaretAtEnd(el);
                    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                    $.each(user_list, function(k, v) {
                        if (v.id == removeUuid) {
                            $('#groupUpSuggestedList').append(userListDesign(v));
                        }
                    });
                    popupMouseEnter();
                }
            }

            if (e.keyCode == 8 && $('#ownerAreaForTodo').is(':visible')) { // backspace
                var value = $('#searchForOwnerToDo').html();
                if ($('#searchForOwnerToDo .selected_member_name').length > 0 && value.charCodeAt(value.length - 1) == 173) {
                    e.preventDefault();
                    var removeUuid = $('#searchForOwnerToDo .selected_member_name').last().attr('data-uuid');
                    removeA(activity_participantsArr, removeUuid);
                    $('#searchForOwnerToDo .selected_member_name').last().remove();
                    draw_name();
                    var el = document.getElementById('searchForOwnerToDo');
                    placeCaretAtEnd(el);
                    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                    $.each(user_list, function(k, v) {
                        if (v.id == removeUuid) {
                            $('#ownerAreaSUggestedList').append(userListDesign(v));
                        }
                    });
                    popupMouseEnter();
                }
            }
        }
    });
}

// arrowUpArrowDownKey();

function update_group_with(event) {
    if ($('#groupAdminArea').is(':visible')) {
        if (adminArra.indexOf(user_id) > -1) {
            participants = groupAdminAreaArray;
            adminArra = participantsAdminList;
            var data = {
                user_id: user_id,
                conversation_id: conversation_id,
                participants: participants,
                participants_admin: adminArra,
                company_id: company_id
            }
            socket.emit('group_participants_update', data, function(res) {
                closeModal('groupAdminArea');
                $('#totalMember').text(participants.length);
                forActiveCallIcon(onlineUserList, participants, conversation_type);
                $('#conv' + conversation_id).attr('data-tm', participants.length);
                // toastr["success"]("Room updated successfully");
                var workSpaceName = $('#roomIdDiv').attr('data-keyspace');
                var groupPrivacy = $('#roomIdDiv').attr('data-privecy');
                var roomTitle = $("#roomIdDiv").attr('data-title');
                socket.emit('groupMemberAdd', {
                    room_id: conversation_id,
                    memberList: participants,
                    selectecosystem: workSpaceName,
                    teamname: roomTitle,
                    grpprivacy: groupPrivacy,
                    createdby: user_id,
                    createdby_name: user_fullname
                });
            });
        }
    } else if ($('#ownerAreaForTodo').is(':visible') && !$('#n_ToDo_item').is(':visible')) {
        if ($("#actCre").val() == user_id) {
            sharedMemberList = activity_participantsArr;
            updateCookieData('activityDetail', 'activity_participants', sharedMemberList);
            var data = {
                user_id: user_id,
                activity_id: $('#updateAction').val(),
                activity_participants: sharedMemberList,
                clusteringkey: $('#activityCreatedAt').val()
            }
            socket.emit('activity_participants_update', data, function(res) {
                closeModal('ownerAreaForTodo');
                // toastr["success"]("Task Member updated successfully");
                $('.sharedIMG').remove();
                $('#sharePeopleList span').hide();
                currentMemberList = [];
                currentMemberList.push($("#actCre").val());
                viewMemberImg = [];
                var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                $.each(user_list, function(ky, va) {
                    if (sharedMemberList.indexOf(va.id) !== -1) {
                        if (va.id !== user_id) {
                            if (currentMemberList.length < 4) {
                                $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="' + file_server + 'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + '">');
                                viewMemberImg.push(va.id);
                            }
                            currentMemberList.push(va.id);
                        }

                    }
                    if (currentMemberList.length > 3) {
                        $('#sharePeopleList span').show();
                        $('#sharePeopleList span').text('+' + (currentMemberList.length - 4));
                    }
                    $('.count_member').text(currentMemberList.length + ' Members');
                });

                var newlyAdded = [];
                var deletedMem = [];

                if (window.location.pathname == '/basic_to_do') {
                    //for checking new added
                    $.each(sharedMemberList, function(ky, va) {
                        if (va != user_id) {
                            if (ppLength.indexOf(va) == -1) {
                                newlyAdded.push(va);
                            }
                        }
                    });

                    //for checking delete
                    $.each(ppLength, function(ky, va) {
                        if (va != user_id) {
                            if (sharedMemberList.indexOf(va) == -1) {
                                deletedMem.push(va);
                            }
                        }

                    });

                    ppLength = [];
                    $.each(sharedMemberList, function(ky, va) {
                        ppLength.push(va);
                    });

                    if (newlyAdded.length > 0) {
                        updateMemberListPromiseadd(newlyAdded, user_id)
                            .then((res) => { console.log(res) })
                            .catch((err) => { console.log(err) })
                    }

                    if (deletedMem.length > 0) {
                        $.each(deletedMem, function(ky, va) {
                            updateMemberListPromisedlt(va, user_id)
                                .then((res) => { console.log(res) })
                                .catch((err) => { console.log(err) })
                        });
                    }
                }

            });
        }
    } else if ($('#n_ToDo_item').is(':visible')) {
        sharedMemberList = activity_participantsArr;
        updateCookieData('activityDetail', 'activity_participants', sharedMemberList);
        closeModal('ownerAreaForTodo');
        $('.sharedIMG').remove();
        $('#sharePeopleList span').hide();
        currentMemberList = [];
        currentMemberList.push($("#actCre").val());
        viewMemberImg = [];

        var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
        $.each(user_list, function(ky, va) {
            if (sharedMemberList.indexOf(va.id) !== -1) {
                if (va.id !== user_id) {
                    if (currentMemberList.length < 4) {
                        $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="' + file_server + 'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + '">');
                        viewMemberImg.push(va.id);
                    }
                    currentMemberList.push(va.id);
                }
            }

            if (currentMemberList.length > 4) {
                $('#sharePeopleList span').show();
                $('#sharePeopleList span').text('+' + (currentMemberList.length - 4));
            }
        });

    }
}

function updateMemberListPromiseadd(newlyAdded, user_id) {
    return new Promise((resolve, reject) => {
        socket.emit('sendMsgOngroupMemberadddelete', {
                activity_id: $('#updateAction').val(),
                type: 'add',
                adminListUUID: newlyAdded,
                ecosystem: 'Navigate',
                createdBy: user_id,
                activityTitle: $("#todoTitle").val(),
                fullname: user_fullname,
                img: user_img,
                sender_id: user_id,
                company_id: company_id

            },
            function(confirmation) {
                if (confirmation.status) {
                    resolve(confirmation);
                } else {
                    reject(confirmation);
                }

            });
    });
}

function updateMemberListPromisedlt(va, user_id) {
    return new Promise((resolve, reject) => {
        socket.emit('sendMsgOngroupMemberadddelete', {
                activity_id: $('#updateAction').val(),
                type: 'delete',
                uuID: va,
                ecosystem: 'Navigate',
                createdBy: user_id,
                activityTitle: $("#todoTitle").val(),
                fullname: user_fullname,
                img: user_img,
                sender_id: user_id,
                company_id: company_id
            },
            function(confirmation) {
                if (confirmation.status) {
                    resolve(confirmation);
                } else {
                    reject(confirmation);
                }
            });
    });
}


function remove_this_user_search(event, uuid, imgsrc, name) {
    if ($('#shareMessagePopUp').is(':visible')) {
        $(event.target).parent('.selected_member_name').remove();
        removeA(selectedShareMember, uuid);
        var newimgsrc = imgsrc.split('/');
        var design = '<li class="memberContainer showEl" id="suggestUsers' + uuid + '" data-id="' + uuid + '" dat-img-src="' + newimgsrc[newimgsrc.length - 1] + '" data-fullname="' + name + '" onclick="userAddAction(\'' + uuid + '\', \'' + name + '\', \'' + newimgsrc[newimgsrc.length - 1] + '\')">';
        design += '<img src="' + file_server + 'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + uuid + '">' + name + '</span>';
        design += '<span class="designation-name">@ Navigate</span>';
        design += '</li>';
        $('#shareSuggestedList').append(design);
        popupMouseEnter();
        draw_name();
        $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
    } else if ($('#groupAdminArea').is(':visible')) {
        var newimgsrc = imgsrc.split('/');
        removeA(groupAdminAreaArray, uuid);
        if (participantsAdminList.indexOf(uuid) !== -1) {
            removeA(participantsAdminList, uuid);
        }
        $(event.target).parent('.selected_member_name').remove();
        var html = '<li class="memberContainer suggestUsers' + uuid + ' showEl"  data-id="' + uuid + '" dat-img-src="' + imgsrc + '" data-fullname="" onclick="userAddAction(\'' + uuid + '\', \'' + name + '\', \'' + newimgsrc[newimgsrc.length - 1] + '\')">';
        html += '<img src="' + file_server + 'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
        html += '<span class="online_' + uuid + ' ' + (onlineUserList.indexOf(uuid) === -1 ? "offline" : "online") + '"></span>';
        html += '<span class="userFullName s-l-def-clas" data-uuid="' + uuid + '">' + name + '</span>';
        html += '</li>';
        $('#groupUpSuggestedList').append(html);
        popupMouseEnter();
        draw_name();
    } else if ($('#ownerAreaForTodo').is(':visible')) {
        var newimgsrc = imgsrc.split('/');
        removeA(activity_participantsArr, uuid);
        $(event.target).parent('.selected_member_name').remove();
        var html = '<li class="memberContainer suggestUsers' + uuid + ' showEl"  data-id="' + uuid + '" dat-img-src="' + imgsrc + '" data-fullname="" onclick="userAddAction(\'' + uuid + '\', \'' + name + '\', \'' + newimgsrc[newimgsrc.length - 1] + '\')">';
        html += '<img src="' + file_server + 'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
        html += '<span class="online_' + uuid + ' ' + (onlineUserList.indexOf(uuid) === -1 ? "offline" : "online") + '"></span>';
        html += '<span class="userFullName s-l-def-clas" data-uuid="' + uuid + '">' + name + '</span>';
        html += '</li>';
        $('#ownerAreaSUggestedList').append(html);
        popupMouseEnter();
        draw_name();
    }

}

function updateLastActiveConnect(id) {
    localStorage.setItem('lastActiveConncet', id);
    setCookie('last_active_conv', id);
}

function forlastActiveconv() {
    if (localStorage.getItem('lastActiveConncet') == null) {
        $("#conv" + user_id).trigger('click');
        $('.chat-head-name').show();
        $('.chat-head-calling').show();


    } else if (localStorage.getItem('lastActiveConncet') != "") {
        if ($("#conv" + localStorage.getItem('lastActiveConncet')).is(':visible')) {

            $("#conv" + localStorage.getItem('lastActiveConncet')).trigger('click');
            $('.chat-head-name').show();
            $('.chat-head-calling').show();
        } else {
            $("#conv" + user_id).trigger('click');
            $('.chat-head-name').show();
            $('.chat-head-calling').show();
        }
    }
}


function viewDropDown(key) {
    if ($(key).is(':visible')) {
        $(key).hide();
        if (key == '#headActionDropdown') {
            $('.right-section').css('z-index', '4');
            $('.chat-header').css('z-index', '4');
            $('#hayvenSidebar').css('z-index', '4');
            $('#hayvenToDoPage .nav_ico').css('transform', 'rotate(0deg)');
        }
    } else {
        $(key).show();
        if (key == '#headActionDropdown') {
            $('.right-section').css('z-index', '0');
            $('.chat-header').css('z-index', '0');
            $('#hayvenSidebar').css('z-index', '0');
            $('#hayvenToDoPage .nav_ico').css('transform', 'rotate(180deg)');
        }
    }


}


function findIndexOfObj(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array.indexOf(array[i]);
        }
    }
    return false;
}


function submitOffCallMs() {
    var str = $('#messageForCalOff').val();
    str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
    str = convert(str);
    str = str.replace(/&nbsp;/gi, '').trim();
    str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
    if (str != "") {
        msg_sending_process(str);
    }

    closeModal('warningPopupForCallMsg');
}

function submitOffCallMsWithkey(e) {
    if (e.keyCode == 13) {
        var str = $('#messageForCalOff').val();
        str = str.replace(/(<\/?(?:img|br)[^>]*>)|<[^>]+>/ig, '$1'); // replace all html tag
        str = convert(str);
        str = str.replace(/&nbsp;/gi, '').trim();
        str = str.replace(/^(\s*<br( \/)?>)*|(<br( \/)?>\s*)*$/gm, '');
        if (str != "") {
            msg_sending_process(str);
        }

        closeModal('warningPopupForCallMsg');
    }
}



function viewMsgImgOption(element) {
    var msgid = $(element).parents('.msgs-form-users').attr('data-msgid');
    var imgwidth = $(element).width();
    var imgHeight = $(element).height();
    var top = $(element).height() + 9;
    var design = '<div class="imgHovOption" style="width:' + imgwidth + 'px; height:' + imgHeight + 'px;  top:-' + top + 'px;">';
    design += '	<div class="hovButtonSec">';
    design += '		<div class="viewImgbtn" onclick="viewImgMsg(this)">View</div>';
    design += '		<div class="tagImgbtn">Tag</div>';
    design += '		<div class="downloadImgbtn"><a href="' + $(element).attr('src') + '" download="">Download</a></div>';
    design += '	</div>';
    design += '</div>';
    if (!$('.imgHovOption').is(':visible')) {
        $(element).css('filter', 'blur(2px)');
        $(element).parent('.msg_img').css({
            "width": imgwidth + 'px',
            "height": imgHeight + 'px'
        });
        $(element).after(design);

    }
}

function closeMsgImgHovOp(element) {
    if ($('.imgHovOption').is(':visible')) {
        $('.imgHovOption').remove();
        $(element).css('filter', 'blur(0px)');
    }
}

function viewImgMsg(e) {
    $(e).parents('.msg_img').find('.img_attach').trigger('click');
}

var thisEleAllTag = [];
var eleTag = [];

function viewTagForFiles(elm) {

    if ($('#threadReplyPopUp').is(':visible')) {
        $('#updateMessageTag').attr('thread-view', true);
        // if(window.name !='calling') 
        if (typeof callCleanupLogic !== 'function' && window.name !== 'calling') {
            $('#threadReplyPopUp').hide();
        }
        $(elm).parents('.main-thread-msgs').find('.msgs-form-users-options .tagOP').trigger('click');
    } else {
        $('#updateMessageTag').attr('thread-view', false);
    }

    $(elm).parents('.msgs-form-users').find('.msgs-form-users-options .tagOP').trigger('click');
    // eleTag = [];
    // thisEleAllTag = [];
    // $('#addTagforImg').show();
    // $('#createConvTagPop').focus();
    // var msgId = $(element).parents('.msgs-form-users').attr('data-msgid');
    // $('#addTagforImg').attr('data-msg-id', msgId);
    // var thisAllTag = $('#filesTag'+msgId+' .filesTag');
    // $.each(thisAllTag, function (k, v) {
    // 	if(tagListForFileAttach.indexOf($(v).text()) == -1){
    // 		eleTag.push($(v).text());
    // 	}
    // 	thisEleAllTag.push($(v).text());
    // });

    // $('#popupTagList').text(thisEleAllTag.join(','));
    // $('#popupTagListDraw').html("");
    // $.each(thisEleAllTag,function(k,v){
    // 	var removeDesign = '<li onclick="removeSpcTag(this)" style="cursor:pointer" >' + v + '<span class="tagcheck"></span></li>';
    // 	$('#popupTagListDraw').append(removeDesign);
    // });

    // $.each(totalTagListTitleCon, function (k, v) {
    // 	if(thisEleAllTag.indexOf(v.title) == -1){
    // 		var addDesign = '<li onclick="addSpcTag(this)" style="cursor:pointer" >' + v.title + '</li>';
    // 		$('#popupTagListDraw').append(addDesign);
    // 	}
    // });

}

function adOrSerTag(e) {
    if ((e.which >= 65 && e.which <= 90) || e.which == 189 || e.which == 13) {
        var str = $('#createConvTagPop').val().trim();

        str = str.replace(/<\/?[^>]+(>|$)/g, "");
        if (str != "") {
            var code = e.keyCode || e.which;

            if (code == 13) { //Enter keycode = 13
                var roomid = $("#createConvTag").attr('data-roomid');

                var tagTitle = $("#createConvTagPop").val();


                e.preventDefault();

                if (tagTitle != "") {
                    if (roomid == "") {
                        // toastr["warning"]("You have to select a room or personal conversation", "Warning");

                        $('#warningsPopup').css('display', 'flex');
                        $('#warningsPopup .warningMsg').text('You have to select a Room.');
                        $(this).val("");
                    } else {
                        if (thisEleAllTag.indexOf(tagTitle) == -1) {
                            thisEleAllTag.push(tagTitle);
                            eleTag.push(tagTitle);
                            var msg_id = $('#addTagforImg').attr('data-msg-id');
                            var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
                            if (msg_tag_id !== "" && msg_tag_id !== undefined) {
                                var data = {
                                    id: msg_tag_id,
                                    conversation_id: conversation_id,
                                    message_id: msg_id,
                                    tag_title: thisEleAllTag,
                                    tagged_by: user_id
                                }
                                socket.emit('upTagMsg', data, (res) => {
                                    var removeDesign = '<li onclick="removeSpcTag(this)" style="cursor:pointer">' + tagTitle + '<span class="tagcheck"></span></li>';
                                    var filetag = '<span class="filesTag">' + tagTitle + '</span>';
                                    $('#popupTagListDraw').prepend(removeDesign);
                                    $('#filesTag' + msg_id).append(filetag);
                                    $('#filesTagHolder' + msg_id).show();
                                    $('#popupTagList').text(thisEleAllTag.join(','));
                                    $('#createConvTagPop').val("");
                                    var localData = {
                                        id: msg_tag_id,
                                        tag_title: thisEleAllTag
                                    }
                                    update_local_conv_tag('newTagSp', localData, 'v');
                                });
                            } else {
                                var data = {
                                    conversation_id: conversation_id,
                                    message_id: msg_id,
                                    user_id: user_id
                                }
                                socket.emit('get_msgTag_id', data, (res) => {
                                    console.log(res)
                                    if (res !== null) {

                                        $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id);
                                        $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id)
                                        var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
                                        var data = {
                                            id: res.id,
                                            conversation_id: conversation_id,
                                            message_id: msg_id,
                                            tag_title: thisEleAllTag,
                                            tagged_by: user_id
                                        }
                                        socket.emit('upTagMsg', data, (res) => {
                                            var removeDesign = '<li onclick="removeSpcTag(this)" style="cursor:pointer">' + tagTitle + '<span class="tagcheck"></span></li>';
                                            var filetag = '<span class="filesTag">' + tagTitle + '</span>';
                                            $('#popupTagListDraw').prepend(removeDesign);
                                            $('#filesTag' + msg_id).append(filetag);
                                            $('#filesTagHolder' + msg_id).show();
                                            $('#popupTagList').text(thisEleAllTag.join(','));
                                            $('#createConvTagPop').val("");
                                        });

                                    }
                                });
                            }
                        } else {
                            // alert('This tag already exist');

                            $('#warningsPopup').css('display', 'flex');
                            $('#warningsPopup .warningMsg').text('This tag already exist.');
                        }
                    }
                } else {
                    $("#createConvTagPop").focus();
                }
            }
        }
        console.log(str);
    }
}

function removeSpcTag(element) {
    var value = $(element).text();
    var msg_id = $('#addTagforImg').attr('data-msg-id');
    var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
    removeA(thisEleAllTag, value);
    if (msg_tag_id !== undefined) {
        var data = {
            id: msg_tag_id,
            tag_title: thisEleAllTag
        }
        socket.emit('upTagMsg', data, (res) => {

            var thisAllTag = $('#filesTag' + msg_id + ' .filesTag');
            $.each(thisAllTag, function(k, v) {
                if ($(v).text() == value) {
                    $(v).remove();
                    var thisAllTag = $('#filesTag' + msg_id + ' .filesTag');
                    if (thisAllTag.length == 0) {
                        $('#filesTagHolder' + msg_id).hide();
                    }
                }
            });
            var localData = {
                id: msg_tag_id,
                tag_title: thisEleAllTag
            }
            update_local_conv_tag('newTagSp', localData, 'v');
            $('#popupTagList').text(thisEleAllTag.join(','));
            if (eleTag.indexOf(value) !== -1) {

                $(element).remove();
                var addDesign = '<li onclick="addSpcTag(this)" style="cursor:pointer" >' + value + '</li>';
                $('#popupTagListDraw').prepend(addDesign);
                removeA(eleTag, value);
            } else {
                $(element).remove();
                var addDesign = '<li onclick="addSpcTag(this)" style="cursor:pointer" >' + value + '</li>';
                $('#popupTagListDraw').prepend(addDesign);
            }
        });
    } else {
        var data = {
            conversation_id: conversation_id,
            message_id: msg_id,
            user_id: user_id
        }
        socket.emit('get_msgTag_id', data, (res) => {
            if (res !== null) {

                $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id);
                $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id)
                var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
                var data = {
                    id: res.id,
                    tag_title: thisEleAllTag
                }
                socket.emit('upTagMsg', data, (res) => {

                    var thisAllTag = $('#filesTag' + msg_id + ' .filesTag');
                    $.each(thisAllTag, function(k, v) {
                        if ($(v).text() == value) {
                            $(v).remove();
                            var thisAllTag = $('#filesTag' + msg_id + ' .filesTag');
                            if (thisAllTag.length == 0) {
                                $('#filesTagHolder' + msg_id).hide();
                            }
                        }
                    });
                    var localData = {
                        id: msg_tag_id,
                        tag_title: thisEleAllTag
                    }
                    update_local_conv_tag('newTagSp', localData, 'v');
                    $('#popupTagList').text(thisEleAllTag.join(','));
                    if (eleTag.indexOf(value) !== -1) {

                        $(element).remove();
                        var addDesign = '<li onclick="addSpcTag(this)" style="cursor:pointer" >' + value + '</li>';
                        $('#popupTagListDraw').prepend(addDesign);
                        removeA(eleTag, value);
                    } else {
                        $(element).remove();
                        var addDesign = '<li onclick="addSpcTag(this)" style="cursor:pointer" >' + value + '</li>';
                        $('#popupTagListDraw').prepend(addDesign);
                    }
                });

            }
        });
    }

}

function addSpcTag(element) {
    var value = $(element).text();
    var msg_id = $('#addTagforImg').attr('data-msg-id');
    var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
    thisEleAllTag.push(value);
    if (msg_tag_id !== undefined) {

        var data = {
            id: msg_tag_id,
            tag_title: thisEleAllTag
        }

        socket.emit('upTagMsg', data, (res) => {

            $('#filesTag' + msg_id).append('<span class="filesTag">' + value + '</span>');
            $(element).remove();
            var removeDesign = '<li onclick="removeSpcTag(this)" style="cursor:pointer" >' + value + '<span class="tagcheck"></span></li>';
            $('#popupTagListDraw').prepend(removeDesign);
            var localData = {
                id: msg_tag_id,
                tag_title: thisEleAllTag
            }
            update_local_conv_tag('newTagSp', localData, 'v');
            $('#popupTagList').text(thisEleAllTag.join(','));
            $('#filesTagHolder' + msg_id).show();
        });
    } else {
        var data = {
            conversation_id: conversation_id,
            message_id: msg_id,
            user_id: user_id
        }
        socket.emit('get_msgTag_id', data, (res) => {
            if (res !== null) {

                $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id);
                $('#filesTagHolder' + msg_id).attr('data-msgtag-id', res.id)
                var msg_tag_id = $('#filesTagHolder' + msg_id).attr('data-msgtag-id');
                var data = {
                    id: res.id,
                    tag_title: thisEleAllTag
                }
                socket.emit('upTagMsg', data, (res) => {
                    $('#filesTag' + msg_id).append('<span class="filesTag">' + value + '</span>');
                    $(element).remove();
                    var removeDesign = '<li onclick="removeSpcTag(this)" style="cursor:pointer" >' + value + '<span class="tagcheck"></span></li>';
                    $('#popupTagListDraw').prepend(removeDesign);
                    var localData = {
                        id: msg_tag_id,
                        tag_title: thisEleAllTag
                    }
                    update_local_conv_tag('newTagSp', localData, 'v');
                    $('#popupTagList').text(thisEleAllTag.join(','));
                    $('#filesTagHolder' + msg_id).show();
                });

            }
        });

    }
}


var selectedMediaImgTempArray = [];
var selectedMediaVidTempArray = [];
var selectedMediaAudTempArray = [];
var selectedMediaFileTempArray = [];
var selectedMediaLinkTempArray = [];
var selectedMediaTagTempArray = [];

var selectedDataID = [];

function customChekbox(e, element, type) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var data = $(element).attr('data');
    var file_id = $(element).attr('data-id');
    if ($(element).hasClass('checked')) {
        removeA(selectedDataID, file_id)
        $(element).removeClass('checked');
        if (type == 'imageMedia') {
            removeA(selectedMediaImgTempArray, data);
            if (selectedMediaImgTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }

        } else if (type == 'videoMedia') {
            removeA(selectedMediaVidTempArray, data);
            if (selectedMediaVidTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'audioMedia') {
            removeA(selectedMediaAudTempArray, data);
            if (selectedMediaAudTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'fileMedia') {
            removeA(selectedMediaFileTempArray, data);
            if (selectedMediaFileTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'all_link') {
            removeA(selectedMediaLinkTempArray, data);
            if (selectedMediaLinkTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'tagMedia') {
            removeA(selectedMediaTagTempArray, data);
            if (selectedMediaTagTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        }
    } else {
        selectedDataID.push(file_id)
        $(element).addClass('checked');

        if (!$('#media_Action_Div').attr('close-time')) {
            $('#media_Action_Div').attr('close-time', moment().add('5', 'seconds').unix());
            console.log('add close time');
        }

        if (type == 'imageMedia') {
            selectedMediaImgTempArray.push(data);
            if (selectedMediaImgTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'videoMedia') {
            selectedMediaVidTempArray.push(data);
            if (selectedMediaVidTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'audioMedia') {
            selectedMediaAudTempArray.push(data);
            if (selectedMediaAudTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'fileMedia') {
            selectedMediaFileTempArray.push(data);
            if (selectedMediaFileTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'all_link') {
            selectedMediaLinkTempArray.push(data);
            if (selectedMediaLinkTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        } else if (type == 'tagMedia') {
            selectedMediaTagTempArray.push(data);
            if (selectedMediaTagTempArray.length > 0) {
                $('#media_Action_Div').show();
            } else {
                $('#media_Action_Div').hide();
            }
        }
    }

}

var downloadStatus = true;

function downloadFiles(type) {
    if ($('#media_Action_Div').hasClass('delete_link')) {
        //var alll_items = $('#mediaLinks .all-links');

        // $.each(alll_items,function(k,v){
        // 	var data = $(v).find('.hyvenCheckbox').attr('data');
        // 	if($(v).find('.hyvenCheckbox').hasClass('checked')){
        // 		$(v).find('.linkHovitem .delete_ico').click();
        // 		// removeA(selectedMediaLinkTempArray,data);
        // 	}
        // });
        // selectedMediaLinkTempArray = [];
        // $('#media_Action_Div').hide();

        $('#warningPopup').css('display', 'flex');
        $('#warningPopup').attr('data-type', 'delete_link');
        $('#warningTitle').text('Delete Links');
        $('#warningMessage').html('<h3 style="font-weight:600;">Are you sure you want to Delete selected Link?</h3>');
        $('.buttonCancel').text('Cancel');
        $('.buttonAction').addClass('bg_danger').text('Delete');


    } else {
        downloadStatus = true;
        var zip = new JSZip();
        var count = 0;
        var zipFilename = "freeli_files.zip";
        var urls = [];
        if ($('#mediaImgsTab').hasClass('active')) {
            urls = selectedMediaImgTempArray;
            // zipFilename = urls.length+"_images.zip";
            zipFilename = "images-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        } else if ($('#mediaViedeosTab').hasClass('active')) {
            urls = selectedMediaVidTempArray;
            zipFilename = "videos-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        } else if ($('#mediaAudiosTab').hasClass('active')) {
            urls = selectedMediaAudTempArray;
            zipFilename = "audios-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        } else if ($('#mediaFilesTab').hasClass('active')) {
            // urls = selectedMediaFileTempArray;
            urls = selectedMediaImgTempArray;
            zipFilename = "files-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        } else if ($('#mediaTagDivHead').hasClass('active')) {
            urls = selectedMediaTagTempArray;
            zipFilename = "files-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        } else if ($('#allFilesMediaDiv').hasClass('active')) {
            urls = selectedMediaImgTempArray;
            // zipFilename = urls.length+"_images.zip";
            zipFilename = "files-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        }

        if ($('#hayvenFilePage').hasClass('active')) {
            urls = allLinkFordownload;
            zipFilename = "files-" + moment().format('DD-MM-YYYY-hh:mm A') + ".zip";
        }
        console.log(4145, selectedMediaTagTempArray);

        $('#createZipHolder').show();
        var newid = 'zip' + moment().unix();
        var design = '<div id="' + newid + '" class="filesZipcon" par="0%"><div class="fileName">' + zipFilename + '</div></div>';
        $('#createZipHolder').append(design);
        urls.forEach(function(url) {
            var filename = url.split('/');
            filename = filename[filename.length - 1];
            // loading a file and add it in a zip file
            JSZipUtils.getBinaryContent(url, function(err, data) {
                if (err) {
                    throw err; // or handle the error
                }
                // var img = zip.folder("images");

                zip.file(filename, data, { binary: true, base64: true });
                count++;
                if (count == urls.length) {
                    zip.generateAsync({ type: 'blob' }, function updateCallback(metadata) {
                        $('#' + newid).attr('par', Math.floor(metadata.percent) + " %");

                    }).then(function(content) {
                        $('#' + newid).addClass('complete');
                        $('#'+newid).remove();
                        if($('#createZipHolder').find('.filesZipcon').length == 0){
                            $('#createZipHolder').hide(); 
                        }
                        if (downloadStatus) {

                            saveAs(content, zipFilename);
                        }
                    });
                }
            });
        });
    }

}

function cancelCreateZip() {
    $('#createZipHolder').find('.filesZipcon').remove();
    $('#createZipHolder').hide();
    downloadStatus = false;
}

var selectedMessages = [];

function selectMessage(ele, data) {
    var time = moment().add('5', 'seconds').unix();
    if ($(ele).hasClass('checked')) {
        $(ele).removeClass('checked');
        $('.msg_id_' + data).find('.msgs-form-users-options .select_message').removeClass('active');
        if (selectedMessages.indexOf(data) > -1) {
            removeA(selectedMessages, data);
        }
        if (selectedMessages.length > 0) {
            $('#selectedMsgActionDiv').show();
            $('#groupChatContainer').addClass('selectAction');
            $('#selectedMsgActionDiv').attr('close-time', time);
        } else {
            $('#selectedMsgActionDiv').hide();
            $('#groupChatContainer').removeClass('selectAction');
        }

    } else {
        $(ele).addClass('checked');
        $('.msg_id_' + data).find('.msgs-form-users-options .select_message').addClass('active');
        selectedMessages.push(data);
        if (selectedMessages.length > 0) {
            $('#selectedMsgActionDiv').show();
            $('#groupChatContainer').addClass('selectAction');
        } else {
            $('#selectedMsgActionDiv').hide();
            $('#groupChatContainer').removeClass('selectAction');
        }
    }

    if ($('.hyvenCheckbox.checked').length == 0) {
        $('#selectMessage').trigger('click');
    }
}

function selectMessageOn(ele) {
    if ($(ele).hasClass('selected')) {
        $('#selectMessage').removeClass('selected');
        $('#selectMessage').removeClass('activeComFilter');
        $('.hyvenCheckboxBefore').removeClass('hyvenCheckbox');
        $('.hyvenCheckboxBefore').removeClass('checked');
        $('.select_message').removeClass('active');
        $('.moreMenuPopup').hide();
        selectedMessages = [];
        $('#selectedMsgActionDiv').hide();
        $('#groupChatContainer').removeClass('selectAction');
        $('.msgs-form-users[data-msg-type="checklist"]').show();
        $('.msgs-form-users.deleted').show();

    } else {
        $('#selectMessage').addClass('selected');
        $('#selectMessage').addClass('activeComFilter');
        $('.hyvenCheckboxBefore').removeClass('checked');
        $('.hyvenCheckboxBefore').addClass('hyvenCheckbox');
        $('.moreMenuPopup').hide();
        selectedMessages = [];
        $('#selectedMsgActionDiv').hide();
        $('#groupChatContainer').removeClass('selectAction');
        $('.msgs-form-users[data-msg-type="checklist"]').hide();
        $('.msgs-form-users.deleted').hide();
    }

}

function removeSelectedMsg() {
    $('#warningPopup').css('display', 'flex');
    $('#warningTitle').text('Delete message');
    $('#warningPopup').attr('data-type', 'delete_selected_msgs');
    $('#warningMessage').html('<p class="delete_msg_sec_title">Are you sure you want to delete this message? This cannot be <span class="undone">undone.</span></p>');
    $('.buttonAction').text('Delete for me');
    $('.buttonCancel').text('Cancel');
}





function showHeadRightOptions() {

    if ($('#showHeadRightOptions').is(':visible')) {
        $('.chevron_right_head').css('transform', 'rotate(90deg)');
        $('#showHeadRightOptions').hide('slide', {
            direction: 'right'
        }, 200);
    } else {
        $('#showHeadRightOptions').show('slide', {
            direction: 'right'
        }, 200);
        $('.chevron_right_head').css('transform', 'rotate(270deg)');
    }
}



var idleTimer = null;
var idleState = false;
var idleWait = 10000;

$(function() {

    $(document).ready(function() {

        $('*').bind('mousemove keydown scroll', function() {

            clearTimeout(idleTimer);

            if (idleState == true) {

                // Reactivated event
                var data = {
                    type: 'remove',
                    id: user_id
                }
                socket.emit('idleEmitClient', data);
            }

            idleState = false;

            idleTimer = setTimeout(function() {

                // Idle Event

                var data = {
                    type: 'add',
                    id: user_id
                }
                socket.emit('idleEmitClient', data);

                idleState = true;
            }, idleWait);
        });

        $("body").trigger("mousemove");

    });

});


//Set the caret focus always to end in contenteditable
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}


function createNewTag(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var title = $('#tag_title_input').val();
    // title = title.replace(/\s/g, '');
    if (title.length == 0) {
        return false;
    }
    var createData = {
        mention_users: [],
        title: title,
        tagged_by: user_id,
        tag_type: 'public',
        tag_color: $('.colorPickerweb').val(),
        team_list:addedTagTeamList
    }
    if (allglobaltagname.indexOf(createData.title) > -1) {
        // alert('"'+createData.title+'" Tag already exists !');
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('"' + createData.title + '" Tag already exists !');
    } else {
        $('#tag_title_input').val('').focus();
        socket.emit('createNewUserTag', createData, function(res) {
            $('#tag_title_input').removeClass('invalid')
            console.log(res);
            if (res.status) {
                addedTagTeamList = [];
                $('.addedTagTeam').html('');
                if (allglobaltagname.indexOf(createData.title) == -1) {
                    allglobaltagname.push(createData.title);
                    $('#allTagContainer').prepend(tag_design(res.data));
                    $('#tag_table_body').append(tag_design_table(res.data));
                }
            }
        });
    }
}

function updateTag(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    // var title = $('#tag_title_input').val().trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
    var title = $('#tag_title_input').val();
    // title = title.replace(/\s/g, '');
    if (title.length == 0) {
        return false;
    }
    var createData = {
        tag_id:$('#tag_create_form').attr('tag_id'),
        tagged_by:$('#tag_create_form').attr('tagged_by'),
        title: title,
        tag_color: $('.colorPickerweb').val(),
        team_list:addedTagTeamList
    }
    if (allglobaltagname.indexOf(createData.title) > -1 && createData.title !== $('#tag_title_input').val()) {
        // alert('"'+createData.title+'" Tag already exists !');
        $('#warningsPopup').css('display', 'flex');
        $('#warningsPopup .warningMsg').text('"' + createData.title + '" Tag already exists !');
    } else {
        $('#tag_title_input').val('').focus();
        $('#tag_create_form').removeClass('update_class');
        $('.addedTagTeam').html('');
        socket.emit('confirmTagEdit',createData,function(res){
            $('#tag_title_input').removeClass('invalid');
            if(res.status){
                $('#tag_'+createData.tag_id).find('.title_tag').text(title);
                var data = [];
                for(var t of allTean_list){
                    if(t.tag_id == createData.tag_id){
                        t.title = title;
                    }
                    data.push(t);
                }
            }
            adminSettngActive('tag');
        })
    }
}
function removeThisUserTag(elm) {
    var tag_id = $(elm).attr('data-id');
    var tagged_by = $(elm).attr('tagged-by');
    var tag_name = $(elm).attr('data-tag-name');

    socket.emit('deleteOneTag', { tag_id: tag_id, tagged_by: tagged_by }, function(res) {
        console.log(res);
        if (res.status) {
            $('.tag_id_' + tag_id).remove();
            // allglobaltagname.pop(tag_name);
            removeA(allglobaltagname, tag_name);
        }
    });
}

function editUserTag(elm) {
    var tag_id = $(elm).attr('data-id');
    $('.tag_id' + tag_id).attr('contenteditable', true);
    var el = $('.tag_id' + tag_id);
    placeCaretAtEnd(el[0]);
    $('.tag_id' + tag_id).focus();

}

var tag_design = (v) => {
    var html = '<li class="tag_id_' + v.tag_id + '">' +
        '<span class="color_circle color_circle' + v.tag_id + '" style="background-color:' + (v.tag_color != null ? v.tag_color : '#0000') + '"></span>' +
        '<span class="name name_bunit tag_id' + v.tag_id + '" tagged-by="' + v.tagged_by + '" onblur="updateUserTagTitle(this)" onkeyup="editUnitNamekeyUp(event,this)" onkeydown="editUnitNamekeyUp(event,this)" contenteditable="false"  data-id="' + v.tag_id + '">' + v.title + '</span>' +
        '<input type="color" value="' + (v.tag_color != null ? v.tag_color : '') + '" data-id="' + v.tag_id + '" data-tagged_by="' + v.tagged_by + '" onchange="updatedColorTag(this)" class="colorPickerweb mini" autocomplete="off">' +
        '<span class="removeIco" onclick="removeThisUserTag(this)" data-id="' + v.tag_id + '" tagged-by="' + v.tagged_by + '" data-tag-name="' + v.title + '"></span>' +
        '<span class="editIco" onclick="editUserTag(this)" data-id="' + v.tag_id + '"></span>' +
        '</li>';

    return html;
}
var tag_design_table = (v) => {
    var html = '<tr class="user-table-row" id="tag_'+v.tag_id+'" onclick="actionForTag(event,\'edit\',\''+v.tagged_by+'\',\''+v.tag_id+'\',\''+v.title+'\')" >' +
        '<td style="color: #FFF;" width="8%" ><input type="color" class="color_circle color_circle' + v.tag_id + '" tag-by="'+v.tagged_by+'" tag-id="' + v.tag_id + '" onchange="updateTagColor(event,this)" value="' + (v.tag_color != null ? v.tag_color : '#0000') + '"></td>' +
        '<td width=25%" class="title_tag"><span class="tag_icon" style="background-color:'+v.tag_color+'"><span class="td_tagIcon" style="margin-left:8px;"></span> <span class="tag_title" title="'+v.title+'">' + v.title + '</span></span></td>' +
        '<td width="25%">'+getTeamInfo(v.team_list).join(", ")+'</td>' +
        '<td width="20%">' + moment(v.created_at).format('DD-MM-YYYY hh:mm:a') + '</td>' +
        '<td width="12%" title="' + findObjForUser(v.tagged_by).fullname + '">' + findObjForUser(v.tagged_by).fullname + '</td>' +
        '<td width="10%"><span class="button edit_b" onclick="//actionForTag(event,\'edit\',\''+v.tagged_by+'\',\''+v.tag_id+'\',\''+v.title+'\')">Edit</span><span class="button delete_b" onclick="actionForTag(event,\'delete\',\''+v.tagged_by+'\',\''+v.tag_id+'\')">Delete</span></td>' +
        // '<td width="10%">' + (v.shared_tag != null ? 'Shared' : 'Not Shared') + '</td>' +
        '</tr>'

    return html;
}
var action_tagdata = {

    
}
function confirmEdit(){
    var val =  $('#editTagInputBar').val();
    if(val !== '' || val !== '  '){
        action_tagdata.title = val;
        socket.emit('confirmTagEdit',action_tagdata,function(res){
            if(res.status){
                $('#editTagBackwrap').css("display","none");
                $('#tag_'+action_tagdata.tag_id).find('.title_tag').text(val);
                var data = [];
                for(var t of allTean_list){
                    if(t.tag_id == action_tagdata.tag_id){
                        t.title = val;
                    }
                    data.push(t);
                }
            }
        })
    }
}
function confirmTagDelete(){
    socket.emit('confirmTagDelete',action_tagdata,function(res){
        if(res.status){
            $('#tag_'+action_tagdata.tag_id).remove();
            $('#deleteBackWrapForTag').css("display","none");
        }
    })
}
function actionForTag(e,type,tagged_by,tag_id,title){
    // e.preventDefault();
    // e.stopImmediatePropagation();
    if ($(e.target).hasClass('color_circle')) return false;
    if ($(e.target).hasClass('delete_b')) {
        type = 'delete';
    }else {
        type = 'edit';
    }
    action_tagdata = {tagged_by:tagged_by,tag_id:tag_id,title:title};
    if(type == 'edit'){
        console.log(4822,allTean_list)
        for(let t of allTean_list){
            if(tag_id == t.tag_id){
                $('#tag_create_form').addClass('update_class');
                $('#tag_create_form').attr('tag_id',tag_id);
                $('#tag_create_form').attr('tagged_by',tagged_by);
                $('#tag_title_input').val(t.title);
                $('#tag_create_form .colorPickerweb').val(t.tag_color);
                $('#tag_create_form .addedTagTeam').html('');
                addedTagTeamList = [];
                if(t.team_list == 'null' || t.team_list == null){
                    t.team_list = [];
                }
                for(let team of t.team_list){
                    var team_id = team;
                    var team_name = getTeamName(team);
                    if(addedTagTeamList.indexOf(team_id) == -1){
                        addedTagTeamList.push(team_id);
                    }
                    var html = '<div class="mini_item _mini_item_' + team_id + '">' +
                            '<p class="mini_name">' + team_name + '</p><span class="mini_remove_ico" onclick="removeAddedTagTeam(\'' + team_id + '\',\'' + team_name + '\')"></span>' +
                            '</div>';
                    $('.addedTagTeam').prepend(html);
                }
            }
        }
        // $('#editTagBackwrap').css("display","flex");
        // $('#editTagInputBar').val(title);
        // $('#editTagInputBar').focus();

    }else{
        socket.emit('thistagUseOrNot',{tagged_by:tagged_by,tag_id:tag_id},function(res){
            if(res.status){
                $('#deleteBackWrapForTag .delete_msg_sec_title').html('This tag already has been used. Do you want to delete this tag forcefully? This cannot be <span class="undone">undone.</span> ')
            }else{
                $('#deleteBackWrapForTag .delete_msg_sec_title').html('Are you sure you want to delete this Tag? This cannot be <span class="undone">undone.</span>')
            }
            $('#deleteBackWrapForTag').css("display","flex");
        })
        
    }
}
function getTeamName(team_id){
    for(let t of allteams){
        if(t.team_id == team_id){
            return t.team_title;
        }
    }
}
function updateTagColor(e,el){
    e.preventDefault();
    e.stopImmediatePropagation();
    var tag_id = $(el).attr('tag-id');
    var tagged_by = $(el).attr('tag-by');
    var tag_color = $(el).val();

    
    var data = {
        tag_id: tag_id,
        tag_color: tag_color,
        tagged_by: tagged_by,
        update_by: user_id
    }

    socket.emit('updatedColorTag', data, function(res) {
        console.log(res)
        if(res.status){
            $(el).parents('.user-table-row').find('.tag_icon').css('background-color',tag_color);
        }
    })
}

function updatedColorTag(elm) {
    var value = $(elm).val();
    var tag_id = $(elm).attr('data-id');
    var tagged_by = $(elm).attr('data-tagged_by');
    if (value != '') {
        $('.color_circle' + tag_id).css('background-color', value);
        socket.emit('updatedColorTag', { tag_color: value, tag_id: tag_id, tagged_by: tagged_by, update_by: user_id }, function(res) {
            console.log(res)
        })
    }
}

function updateUserTagTitle(elm) {
    var tag_id = $(elm).attr('data-id');
    var tagged_by = $(elm).attr('tagged-by');
    // var name = $(elm).text().trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
    var name = $(elm).text();
    // name = name.replace(/\s/g, '');
    $('.tag_id' + tag_id).attr('contenteditable', false);
    if (name !== '') {
        socket.emit('updateUserTagTitle', { update_by: user_id, title: name, tag_id: tag_id, tagged_by: tagged_by }, function(res) {
            console.log(res);
        });
    }
}

function editUnitNamekeyUp(e, elm) {
    if (e.keyCode == 13) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(elm).blur();
    }
}

function editUnitNamekeydown(e, elm) {
    if (e.keyCode == 13) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}

function insertNotiFun(data) {
    socket.emit('insert_notification', data)
}

function changeUserImage(event, files) {
    // //debugger
    var formData = new FormData();
    formData.append('bucket_name', 'profile-pic');
    formData.append('room_image', files[0]);
    var slid = Number(moment().unix());
    formData.append('sl', slid);
    $('#changeUserImage').attr('src', file_server + 'common/imgLoader.gif');
    $.ajax({
        url: '/s3Local/convImg',
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(res) {
            console.log(14020, res);
            $('#useronchangeimgvalue').val(res.data.key)
            $('#changeUserImage').attr('src', res.data.location);
            $('#removeProfileimgbtn').show();
            saveUserProfileFun();
        }
    });
}


var warning = false;
var reset_type = '';

function call_reset_url(type) {
    reset_type = type;
    if (!warning) {
        $('#warningPopup').css('display', 'flex');
        $('#warningTitle').text('Warning !');
        $('#warningPopup').attr('data-type', 'call_reset_url');
        $('#warningPopup').attr('data-reset-type', type);
        $('#warningMessage').html('<p class="delete_msg_sec_title">Are you sure you want to reset your caller ID link? Previously shared caller ID links will no longer work.</p><input style="display:none" data-type="' + type + '"');
        $('.buttonAction').text('Yes');
        $('.buttonCancel').text('No');
    } else {
        $('#warningPopup').hide();
        $('#input_reset_url_inp').val('');
        setTimeout(() => {
            $('#input_reset_url_inp').focus();
        }, 0);
        $('#warningPopupReset').show();
        warning = false;
    }

}

function triggerCallResetUrl() {
    socket.emit('reset_call_url', {
        conversation_id: conversation_id,
        company_id: company_id,
        user_id: user_id,
        type: reset_type,
        new_url: $('#input_reset_url_inp').val()
    }, (callBack) => {
        if (callBack.status) {
            if (reset_type == 'group') {
                $('#callerid_url').val(window.location.origin + "/call/" + callBack.conference_id);
            } else {
                $('#callerid_url_profile').text(window.location.origin + "/call/" + callBack.conference_id);
                $('#callerid_url_personal').val(window.location.origin + "/call/" + callBack.conference_id);
                $('#warningsPopup').css('display', 'flex');
                $('#warningsPopup .warningMsg').text('Reloading to take effect.');
                location.reload();
            }
            $('#conv' + conversation_id).attr("data-conferenceid", callBack.conference_id);
            $('.voice-call[data-conversationid="' + conversation_id + '"]').attr("data-conferenceid", callBack.conference_id);
            $('.video-call[data-conversationid="' + conversation_id + '"]').attr("data-conferenceid", callBack.conference_id);
            $('.join-call[data-conversationid="' + conversation_id + '"]').attr("data-conferenceid", callBack.conference_id);
            call_toastr();

            var msg_body = 'The Caller ID link has been reset. Previously shared caller ID links will no longer work.';
            var data = {
                type: 'callerid_reset',
                sender: user_id,
                sender_name: user_fullname,
                sender_img: user_img,
                conversation_id: conversation_id,
                msg_type: 'notification',
                msg_body: msg_body
            }
            sendNotificationMsg(data);
            $('#warningPopup').hide();
            $('#warningPopupReset').hide();
        } else {
            $('#warningsPopup').css('display', 'flex');
            $('#warningsPopup .warningMsg').text('Please enter a different URL.');
        }
    });

}
var lastPopup = '';

function editProfileBackwrap() {
    var lastPopup = 'editUserProfileName';
    $(".connect_right_section").hide();
    $('#updateUserProfile').show();
    $('#updateUserProfile .submitBtn').hide();
    $('#editUserProfileName').val(user_fullname);
    $('#useronchangeimgvalue').val(user_img);
    $('#editUserProfileName').attr('placeholder', user_fullname);
    if (user_img == 'img.png') {
        $('#removeProfileimgbtn').hide();
    } else {
        $('#removeProfileimgbtn').show();
    }
    $('#changeUserImage').attr('src', file_server + 'profile-pic/Photos/' + user_img);
    $('#changeUserImage').attr('alt', user_fullname);
    $('#callerid_url_personal').val(window.location.origin + '/call/' + findObjForUser(user_id).conference_id);
    if ($('.profilenavMainSection').is(':visible')) {
        profileNav();
    }
}
function viewCovidPublicLink() {
    $('#warningPopupCovid').css('display', 'flex');
    var cname = $('#company_id_name').text().replace(/ /g,"_");
    $('#covid_url_company').val(window.location.origin + "/covid/public/" + cname);

    
    
}
function  covid_url_qr_image() {
    $('#image_qr_covid').qrcode({
        text: $('#covid_url_company').val(),
        width: 186,
        height: 186
    });

    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.querySelector("#image_qr_covid canvas").toDataURL()
    link.click();
    
}

function check_and_update() {
    if ($('#editUserProfileName').val() != user_fullname)
        saveUserProfileFun();
}

function saveUserProfileFun() {
    var data = {
            img: $('#useronchangeimgvalue').val(),
            fullname: $('#editUserProfileName').val(),
            id: user_id,
            company_id: company_id
        }
        // console.log(1404,data)
    if (data.img != '' && data.fullname != '') {
        socket.emit('update_user_profile', data, function(res) {
            // closeRightSection();
            // console.log(res);
            if (res.status) {
                call_toastr();
            }
        })
    }
}

function call_toastr(tost = "Changes have been updated successfully!") {
    $(".global_toastr").text(tost).css("display", "flex");
    setTimeout(function() { $(".global_toastr").text("Changes have been updated successfully!").hide(); }, 2000);
}

function changeUsernamekey(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // actionWarning('change_profile');
        check_and_update();
    }
}

function editProfileAction(type) {
    if (type == 'removeImg') {
        $('#useronchangeimgvalue').val('img.png')
        $('#changeUserImage').attr('src', file_server + 'profile-pic/Photos/img.png');
        $('#removeProfileimgbtn').hide();
        saveUserProfileFun();
    }
}

socket.on('changeUserProfile', function(data) {
    $.each(user_list, function(k, v) {
        if (v.id == data.id) {
            console.log(14095, data)
            v.fullname = data.fullname;
            v.img = data.img;
            user_id_to_img[v.id] = data.img;
            user_id_to_fullname[v.id] = data.fullname;

            $('.user_name' + v.id).html(data.fullname);
            $('.user_img' + v.id).attr('src', file_server + 'profile-pic/Photos/' + data.img);

            $.each($('[id^=conv]'), function(k, v) {
                if ($(v).is("li") && $(v).attr("data-conversationtype") == 'personal' && $(v).attr("data-id") == data.id) {
                    $(v).attr("data-img", data.img);
                }
            });
        }
        if (user_id == data.id) {
            user_fullname = data.fullname;
            user_img = data.img;
            $("#conv" + user_id).attr("data-img", data.img);
        }
    })
});


var clipboard = new Clipboard('#call_copyurl_btn', {
    text: function() {
        escToClose = '#warningsPopup .closeModal';
        return document.querySelector('#callerid_url').value;
    }
});
var clipboardPersonal = new Clipboard('#call_copyurl_btn_personal', {
    text: function() {
        escToClose = '#warningsPopup .closeModal';
        return document.querySelector('#callerid_url_personal').value;
    }
});
var clipboardCovid = new Clipboard('#covid_copyurl_btn_personal', {
    text: function() {
        escToClose = '#warningPopupCovid .closeModal';
        return document.querySelector('#covid_url_company').value;
    }
});

clipboardPersonal.on('success', function(e) {
    $('#warningsPopup .popup_title').text('Alert !');
    $('#warningsPopup .warningMsg').text('URL copied to clipboard.');
    $('#warningsPopup').css('display', 'flex');
    // e.clearSelection();
});
clipboard.on('success', function(e) {
    $('#warningsPopup .popup_title').text('Alert !');
    $('#warningsPopup .warningMsg').text('URL copied to clipboard.');
    $('#warningsPopup').css('display', 'flex');
    // e.clearSelection();
});
clipboardCovid.on('success', function(e) {
    $('#warningsPopup .popup_title').text('Alert !');
    $('#warningsPopup .warningMsg').text('URL copied to clipboard.');
    $('#warningsPopup').css('display', 'flex');
    // e.clearSelection();
});

$(window).resize(function() {
    var origin = window.location.origin;
    var url = window.location.href;
    url = url.split('/');

    var activeElmnt = $('.side_bar_list_item li.selected');
    var type = activeElmnt.attr('data-cnv-type');
    var name = activeElmnt.attr('data-name');
    var privacy = activeElmnt.attr('data-privacy');
    var conversationid = activeElmnt.attr('data-conversationid');
    // var img = user_img;
    var img = $('#conv_title img').attr('src');
    if (img) {
        img = img.split('/')[img.split('/').length - 1];
    }

    var userid = activeElmnt.attr('data-myid');
    var status = activeElmnt.attr('data-status');
    var mute = activeElmnt.attr('data-mute');
    var pin = activeElmnt.attr('data-pin');
    var unreadthread = false;
    var has_flagged = false;
    var path = '/chat/' + type + '/' + privacy + '/' + userid + '/' + unreadthread + '/' + has_flagged + '/' + status + '/' + conversationid + '/' + name + '/' + img + '/' + pin + '/' + mute + '';
    // //debugger;
    if ($(window).width() < 770) {
        if (url.indexOf('alpha2') != 1) {
            if (url.indexOf('call') == -1) { // added by sujon
                if ($('#notificaitonClickItem').hasClass('sideActive')) {
                    if (url.indexOf('covid') == -1) window.location.href = origin + '/connect';
                } else {
                    if (url.indexOf('covid') == -1) window.location.href = origin + '/connect' + path;
                }
            }
        }
    }
});

function relocateOnload() {
    var origin = window.location.origin;
    var url = window.location.href;
    url = url.split('/');
    if ($(window).width() < 770) {
        if (url.indexOf('alpha2') != 1) {
            if (url.indexOf('call') == -1) { // added by sujon
                if (url.indexOf('covid') == -1) window.location.href = origin + '/connect';
            }
        }
    }

}
relocateOnload();


function notificationUploadFunc() {
    console.log('Hello world');
    $('#filesUploadPopup').show();
}


var request = [];
var formDataTemp_2 = [];
var noOfcomplete = 0;
var count_files = 0;
// var upFile = false;
var strChecker = [];

function notificationFileUpServer(files) {
    var newFileName = files[0].name;
    strChecker = [];

    $.each($('.noti-table-row'), function(k, v) {
        var txt = $(v).find('.org_file_name').text();
        if (strChecker.indexOf(txt) == -1) {
            strChecker.push(txt);
        }
    });

    if (strChecker.indexOf(newFileName) == -1) {
        $('.notiloader').show();
        var formData = new FormData();
        formData.append('bucket_name', 'notification');
        formData.append('file_upload', files[0]);
        var slid = Number(moment().unix());
        formData.append('sl', slid);
        $.ajax({
            url: '/s3Local/notification_sound',
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(4463, res);
                res.data.company_id = company_id;
                res.data.user_id = user_id;
                socket.emit("notification_sound_save", res.data, (result) => {
                    console.log(4466, result);
                    // $('#filesUploadPopup').hide();

                    html = '<tr class="noti-table-row" style="height: 42px" id="" >' +
                        '<td class="checktd">' +
                        '<span onclick="checkEachFile(event)" class="fileCheck-uncheck uncheckFile"></span>' +
                        '</td>' +
                        '<td class="org_file_name">' + res.data.originalname + '</td>' +
                        '<td>' + res.data.size + '</td>' +
                        '<td>' + findObjForUser(res.data.user_id).fullname + '</td>' +
                        '<td></td>' +
                        // '<td>'+ moment(getDate()).format('LL') +'</td>'+
                        '<td style="width:12%">' +
                        '<img style="margin-left: 16px; width: 15px;" src="/images/basicAssets/ellipsis.svg" alt="">';
                    html += '<img onclick="delete_noti_file(this)" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // if(type == 0){
                    // 	html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // 	if(filetype == 'Image' || filetype == 'PDF')
                    // 		html += '<a href="/alpha2/download/' +v.key +'" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                    // 	else
                    // 		html += '<a href="'+ file_server+v.location +'" download="'+ v.originalname +'" target="_blank"><img style="width: 15px;" src="/images/basicAssets/download-file.svg" alt=""></a>';
                    // } else {
                    // 	html += '<img onclick="delete_this_file(\''+ v.id +'\',\''+ type +'\')" style="margin-left: 16px; width: 13px;" src="/images/basicAssets/delete-icon.svg" alt="">';
                    // }
                    html += '</td>' +
                        '</tr>';
                    $(".notificationList").append(html);
                    $('.notiloader').hide();
                });
            }
        });
    } else {
        console.log('This file is already exists!');
        alert('This file is already exists!');
    }

}

var deleteData;

function delete_noti_file(elm, id) {

    $("#delete_this_file").show();
    $("#delete_this_file").attr('delete-type', 'notification');
    $("#confirm_data_id").attr("data-id", id);

    var key = $(elm).parents('.noti-table-row').attr('data-key');
    var bucket_name = 'notification';
    var attch_list = 'Music/' + key;
    attch_list = [attch_list];

    deleteData = {
        elm: elm,
        bucket_name: bucket_name,
        attch_list: attch_list
    }

}


function cconfirm() {
    if ($("#delete_this_file").attr('delete-type') == 'notification') {

        var bucket_name = deleteData.bucket_name;
        var attch_list = JSON.stringify(deleteData.attch_list);
        var elm = deleteData.elm;

        var id = $("#confirm_data_id").attr("data-id");
        var counter = $('#total_notiFile').text().split(/(\d+)/)[1];
        counter = counter - 1;

        socket.emit('delete_noti_file', { id: id }, function(res) {
            if (res.status) {
                $(elm).parents('.noti-table-row').remove();
                $('#total_notiFile').html('(' + counter + ')');
                $('#delete_this_file').hide();

                $.ajax({
                    url: "/s3Local/deleteObjects",
                    type: "POST",
                    data: { bucket_name, attch_list },
                    dataType: 'json',
                    beforeSend: function() {
                        console.log(299, bucket_name, attch_list);
                    },
                    success: function(res) {
                        console.log("Unlink successfully", res);
                    },
                    error: function(e) {
                        console.log("Error in unlink: ", e);
                    }
                });
            }
        });
    } else {

        var id = $("#confirm_data_id").attr("data-id");
        var type = $("#confirm_data_id").attr("data-type");
        var field_val_type = $("#confirm_data_id").attr("field-val-type");
        if ((id != "" && type == 'file_delete') && (field_val_type == '0' || field_val_type == '1')) {
            confirm_delete_this_file(id, field_val_type);
        }
    }
}

function searchFileUsers(e) {
    var str = $(e.target).val().trim().toLowerCase();
    $.each($(".file-table-row"), function(k, v) {
        if ($(v).text().trim().toLowerCase().indexOf(str) > -1) {
            $(v).show();
        } else {
            $(v).hide();
        }
    });
}

function triggerConnectPage() {
    if ($('#hayvenFilePage').hasClass('active')) {
        closeMediaPopup();
    } else {
        window.location = "/alpha2";
    }
}

function viewTeamList(el){
    if ($('.teamListView').is(':visible')) {
        $('.teamListView').hide();
    }else {
        $('.teamListView').html('');
        $.each(allteams, function(k, v) {
            console.log(k,v);
            $('.teamListView').append('<li class="" team-id="'+v.team_id+'" onclick="addUserToTeam(this)">'+v.team_title+'</li>');
        });

        $('.teamListView').show();
    }
}

function addUserToTeam(el){
    if ($(el).hasClass('active')) {
        var id = $(el).attr('team-id');
        $(el).removeClass('active');
        $('.addeTeamLi ._mini_item_'+id).remove();
    }else {
        $(el).addClass('active');
        var team_id = $(el).attr('team-id');
        var team_name = $(el).text();
        var html = '<div class="mini_item _mini_item_' + team_id + '" data-teamid="'+ team_id +'">' +
                '<p class="mini_name">' + team_name + '</p><span class="mini_remove_ico" onclick="removeAddedTeam(\'' + team_id + '\')"></span>' +
                '</div>';
        $('.addeTeamLi').prepend(html);
    }
}

function removeAddedTeam(id){
    $('.addeTeamLi ._mini_item_'+id).remove();
}

function removeAddedTagTeam(id,name){
    $('.tagTeamPopup').append('<li class="" team-id="'+id+'" onclick="addTagToTeam(this)">'+name+'</li>');
    $('.addedTagTeam ._mini_item_'+id).remove();
    removeA(addedTagTeamList,id);
}

function viewTagTeamList(el){
    if ($('.tagTeamPopup').is(':visible')) {
        $('.tagTeamPopup').hide();
    }else {
        $('.tagTeamPopup').html('');
        $.each(allteams, function(k, v) {
            if (addedTagTeamList.indexOf(v.team_id) == -1) {
                if(has_permission(user_id, COTR_ADMIN_SETTINGS))
                    $('.tagTeamPopup').append('<li class="" team-id="'+v.team_id+'" onclick="addTagToTeam(this)">'+v.team_title+'</li>');
                else if(v.team_admin && v.team_admin.indexOf(user_id) > -1)
                    $('.tagTeamPopup').append('<li class="" team-id="'+v.team_id+'" onclick="addTagToTeam(this)">'+v.team_title+'</li>');
            }
        });

        $('.tagTeamPopup').show();
    }
}

var addedTagTeamList = [];
function addTagToTeam(el){
    // if ($(el).hasClass('active')) {
    //     var id = $(el).attr('team-id');
    //     $(el).removeClass('active');
    //     $('.addedTagTeam ._mini_item_'+id).remove();
    // }else {
    //     $(el).addClass('active');
        var team_id = $(el).attr('team-id');
        var team_name = $(el).text();
        if(addedTagTeamList.indexOf(team_id) == -1){
            addedTagTeamList.push(team_id);
        }
        $(el).remove();
        var html = '<div class="mini_item _mini_item_' + team_id + '">' +
                '<p class="mini_name">' + team_name + '</p><span class="mini_remove_ico" onclick="removeAddedTagTeam(\'' + team_id + '\',\'' + team_name + '\')"></span>' +
                '</div>';
        $('.addedTagTeam').prepend(html);
    // }
}

function adminCreateTag(e){
    var str = $('#tag_title_input').val();
    if(str.length > 15){
        e.preventDefault();
        e.stopImmediatePropagation();
        $(e.target).addClass('invalid')
        return false;
    }else{
        $(e.target).removeClass('invalid')
    }
}