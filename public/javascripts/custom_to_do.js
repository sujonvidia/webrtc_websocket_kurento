var onlineUserList = [];
var currentMemberList = [];
var currentMemberList2 = [];
var currentMemberList3 = [];
var checklistiTEM = [];
var updateCheckList = [];
var allActivityList = [];
var viewMemberImg = [];
var checkedList = {};
var userlistWithname = {};
var userlistWithnameA = {};
var userlistWithnameB = {};
//For tags
var attachFileList = [];
var tagListForFileAttach = [];
var tagListTitle = [];
var tagLsitDetail = [];
var alltags = [];
var msgIdsFtag = [];
var FtempArray = [];    // for file upload tag
var FtaggedList = [];   // for file upload tag
var my_tag_list = {};
var my_tag_id = [];
var chatmessagestag = [];
var myconversation_list = [];
var searchTagList = [];
var currentConv_list = [];
var currentSerchActivityList = [];
var setFlagConvArray = [];
var subtask_id = [];
var observer = [];
var assignee = [];
var coowner = [];
var temp_assinee = [];
var activityParticipantType,activityParticipants;
var participants = [];
var participatedOwner       = [];
var participatedObserver    = [];
var participatedAssignee    = [];
/* For kanban view array */
var uniqueObserver = [];
var uniqueAssine = [];
var unipriority = [];
var unistatus = [];
var uniqOwner = [];
var uniqCoowner = [];
var uniqDueDate = [];
var uniqComDate = [];
var partiArry = [];
/* End For kanban view array */
var dueDate = {};
var customStatus = [];
var rootBudgetAmount = 0;
var rootActualAmount = 0;
var rootEstWorkHour = 0;
var rootEstHourRate = 0;
var rootActualWorkHour = 0;
var rootActualHourRate = 0;
var customPriority = [];
var customStatus = [];
var addAsCoOwnerArr = [];
var addAsObsrvrArr = [];
var addAsAssigneeArr = [];
var myAllActivityGlobal = [];
var clickDscCheck = 0;
var socketFire = false;
var assigneeWithTblId = {};
var taskParticipants = [];
var st_id = '';
var ci_id = '';
var st_participant = [];
var countCheckBox;
var countChecked;
var taggedIDOnload = [];
var taggedRoomID = [];
var taggedCheckedID = [];
var taggedCheckedRoom = [];
var subtaskPartiList = [];
var coownerDif = [];
var observrDif = [];
var assigneeDif = [];
var partiDltTblIds = [];
var saveobservrDif = [];
var removeUserlist = [];
var tblidsOncancel = [];
var removeList = [];
var temppMangeList = [];
// var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
var user_list = [];
var openInput = '';
var mytodolist = [];
var thisCheckEdit = '';
var todoCheckid = ''
var tagged_conv_list = [];
var deleteActionUndo = false;
var deleteDBActionArray = [];
var insDeleteArray = [];
var insDeleteArray2 = [];
var countChecked = 1;
var editNLUCL = [];
var noteCollaboratorsEmail = [];
var selectedShareMember = [];
// For observer Sorting
var sortAmountCellTypel = 0;
var sortactualCellTypel = 0;
// For observer Sorting
var sorttimeEstCellTypel = 0;
// For observer Sorting
var sortactualHourCellTypel = 0;
// For observer Sorting
var sortStatusCellTypel = 0;
// For observer Sorting
var sortpriorityCellTypel = 0;
// For observer Sorting
var sortWonerCellTypel = 0;
// For observer Sorting
var titlecelltyl = 0;
var row_pluse_count = 1;
var sortManHourRateTypel = 0;
// For observer Sorting
var sortActualHourRateTypel = 0;
var sortvarianceCellTypel = 0;
// For observer Sorting
var sorttimevarianceCellTypel = 0;
// For observer Sorting
var sortDueDateTypel = 0;
// For observer Sorting
var sortObserverTypel = 0;
var sortCoownerTypel = 0;
var forBatchPropertis = [];
var isBatchActive_ob = 0;
var observer_add = [];
var coowoner_add = [];
var assignee_add = [];
var batch_observer_add = [];
var batch_coowoner_add = [];
var batch_assignee_add = [];
var elmUploadedImg = '';
var isBatchActive = 0;
var onscrollevent = 1;
var insScrollTop = '';
// For observer Sorting
var sortAssigneeCellTypel = 0;
var reminderStartList = {};
var reminderEndList = {};
var startTick = new Date().getTime();
var subtaskWarningElm = '';
var dueDataCall = true;
var headHtml = $('.group-header-component').clone();
var bodyClone = $('#OnlyForClone').clone();

var taskTitleArr = [];
var subTaskListArr = [];

var headArr = [];
var bodyArr = [];

$.each(headHtml[0].children,(k,v)=>{
    headArr.push(v);
});

$.each(bodyClone[0].children,(k,v)=>{
    bodyArr.push(v);
});

var colorpanels = '<div class ="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#ff5ac4" style="background-color: rgb(255, 90, 196);"></div>';
colorpanels +=
    '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#ff158a" style="background-color: rgb(255, 21, 138);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#e2445c" style="background-color: rgb(226, 68, 92);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#bb3354" style="background-color: rgb(187, 51, 84);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#7f5347" style="background-color: rgb(127, 83, 71);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#ff642e" style="background-color: rgb(255, 100, 46);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#fdab3d" style="background-color: rgb(253, 171, 61);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#ffcb00" style="background-color: rgb(255, 203, 0);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#cab641" style="background-color: rgb(202, 182, 65);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#9cd326" style="background-color: rgb(156, 211, 38);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#00c875" style="background-color: rgb(0, 200, 117);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#037f4c" style="background-color: rgb(3, 127, 76);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#0086c0" style="background-color: rgb(0, 134, 192);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#579bfc" style="background-color: rgb(87, 155, 252);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#66ccff" style="background-color: rgb(102, 204, 255);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#a25ddc" style="background-color: rgb(162, 93, 220);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open"  onclick="updatePaseColor(this)" data-color="#784bd1" style="background-color: rgb(120, 75, 209);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#808080" style="background-color: rgb(128, 128, 128);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#333333" style="background-color: rgb(51, 51, 51);"></div>';
colorpanels += '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="#d8d8d8" style="background-color: #d8d8d8;"></div>';
$('.status-change-color').append(colorpanels);
var pickPColor = $(colorpanels).removeClass('create_priority_status').addClass('pickPColor');
var pickSColor = $(colorpanels).removeClass('create_priority_status').addClass('pickSColor');
$('.priorityChangeColor').append(pickPColor);
$('.statusChangeColor').append(pickSColor);
// $('.new-added-check-list input:checkbox').click(isChecked);
$('.new-added-check-list input:checkbox').click(countBoxes);
/*===========observer Area=========*/
$('#observerNew').hide();
/*=========Assignee area==========*/
$('#assignee_area').hide();
/*=========Coowner area==========*/
$('#coowner_area').hide();
/*=========Phase area==========*/
$("#phase_area").hide();
// New js @Manzu@
$('#status_area').hide();
$("#date_area").hide();
$("#completeDate_area").hide();
$('#ownner_area').hide();
// $('#selectWorkspace').select2();
// $('#taskStatusSelect').select2();
$('select').select2();


countSubtask();
allMouseUp();
escKeUp();
onDynamicFire();
subtaskdate();
keypressBlur();
pickStatusColor();
pickPrioColor();
priorityColorSample();
create_priority_status();
arrowUpArrowDownKey();
tooltipforToDo();
sideBarSearchcollapses();
escKeyUpForConnect();
countBoxes();
allKeyUp();
// isChecked();


customPriority.push({
    id: '1',
    title : 'Phase 1',
    color: '#d8d8d8;'.toString().trim()
});

customPriority.push({
    id: '2',
    title : 'Phase 2',
    color: '#e2445c;'.toString().trim()
});

customPriority.push({
    id: '3',
    title : 'Phase 3',
    color: '#00c875;'.toString().trim()
});

customStatus.push({
    id: '1',
    title : 'Initiate',
    color: '#d8d8d8;'.toString().trim()
});

customStatus.push({
    id: '2',
    title : 'Working',
    color: '#fdab3d;'.toString().trim()
});

customStatus.push({
    id: '3',
    title : 'Waiting for feedback',
    color: '#0086c0;'.toString().trim()
});

customStatus.push({
    id: '4',
    title : 'Completed',
    color: '#00c875;'.toString().trim()
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//For tags
var numrelated = $('.side_bar_list_item > li:visible').length;

if (numrelated == 0) {
    setTimeout(function(){ createNewTodo(); }, 2000);
} else {
    if ($('#completedSidecontainer').is(':visible') == false && $('#connectAsideContainer').is(':visible') == false) {
        if (getCookie('lastActive') != "") {

            $('.side_bar_list_item li').removeClass('activeTodo selected');
            if ($("#activity_" + getCookie('lastActive')).is(':visible')) {
                $("#activity_" + getCookie('lastActive')).trigger('click');
                $("#activity_" + getCookie('lastActive')).addClass('activeTodo selected');
            } else {
                $('.side_bar_list_item li:first').click();
                $('.side_bar_list_item li:first').addClass('activeTodo selected');
            }
        } else {
            // createNewTodo();
            $('.side_bar_list_item li:first').click();
            $('.side_bar_list_item li:first').addClass('activeTodo selected');
        }
    }

}

function sideBarActive() {
    $('.side_bar_list_item li').on('click', function () {
        $('.side_bar_list_item li').removeClass('activeTodo');
        $(this).addClass('activeTodo');
    });
};

function toggleMoreOption(type,ele){
  var notesWidth = Number($('#task_desc_group').attr('data-width'));
  var amountWidth = Number($('#task_b_a_Amount').attr('data-width'));
  if(type == 'amount'){
    if($('#task_b_a_Amount').is(':visible')){
      $('#task_b_a_Amount').hide();
      $('#action_amount').removeClass('active');
      var newWidth = notesWidth + amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
      
      if(!$('#action_amount').hasClass('active') && !$('#action_hour').hasClass('active')){
        $('#actionNoteDesc').removeClass('disabled');
        if(clickDscCheck == 0){
          $('#actionNoteDesc').removeClass('active')
          $('#task_desc_group').hide();
        }
      }
    }else{
      $('#task_b_a_Amount').show();
      $('#action_amount').addClass('active');
      var newWidth = notesWidth - amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);

      if(!$('#actionNoteDesc').hasClass('disabled')){
        $('#actionNoteDesc').addClass('disabled');
      }
      if(!$('#actionNoteDesc').hasClass('active')){
        $('#actionNoteDesc').addClass('active')
        $('#task_desc_group').show();
      }

    }
  }else if(type == 'hour'){
    if($('#task_e_a_hours').is(':visible')){
      $('#task_e_a_hours').hide();
      $('#action_hour').removeClass('active');
      var newWidth = notesWidth + amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
      if(!$('#action_amount').hasClass('active') && !$('#action_hour').hasClass('active')){
        $('#actionNoteDesc').removeClass('disabled');
        if(clickDscCheck == 0){
          $('#actionNoteDesc').removeClass('active')
          $('#task_desc_group').hide();
        }
      }

    }else{
      $('#task_e_a_hours').show();
      $('#action_hour').addClass('active');
      var newWidth = notesWidth - amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
      if(!$('#actionNoteDesc').hasClass('disabled')){
        $('#actionNoteDesc').addClass('disabled');
      }
      if(!$('#actionNoteDesc').hasClass('active')){
        $('#actionNoteDesc').addClass('active')
        $('#task_desc_group').show();
      }
    }

    var notesWidth = Number($('#task_desc_group').attr('data-width'));
    if($('#task_e_a_hrate').is(':visible')){
      $('#task_e_a_hrate').hide();
      $('#action_hrate').removeClass('active');
      var newWidth = notesWidth + amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }else{
      $('#task_e_a_hrate').show();
      $('#action_hrate').addClass('active');
      var newWidth = notesWidth - amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }

  }else if(type == 'h.rate'){
    if($('#task_e_a_hrate').is(':visible')){
      $('#task_e_a_hrate').hide();
      $('#action_hrate').removeClass('active');
      var newWidth = notesWidth + amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }else{
      $('#task_e_a_hrate').show();
      $('#action_hrate').addClass('active');
      var newWidth = notesWidth - amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }

  }else if(type == 't.h.cost'){
    if($('#task_e_a_thcost').is(':visible')){
      $('#task_e_a_thcost').hide();
      $('#action_thcost').removeClass('active');
      var newWidth = notesWidth + amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }else{
      $('#task_e_a_thcost').show();
      $('#action_thcost').addClass('active');
      var newWidth = notesWidth - amountWidth;
      $('#task_desc_group').css('width',newWidth+'%');
      $('#task_desc_group').attr('data-width',newWidth);
    }


  }
  if($('#action_amount').hasClass('active') || $('#action_hour').hasClass('active')){
    $('#task_desc_group .note_file_group').css('padding-right','15px');
    $('#addTodoTaskDescription').parents('.centered').hide();
    $('#notes_area').parent('label').show();
    $('#notes_area').html($('#addTodoTaskDescription').html());
  }else if(!$('#action_amount').hasClass('active') && !$('#action_hour').hasClass('active')){
    $('#task_desc_group .note_file_group').css('padding-right','0px');
    $('#addTodoTaskDescription').parents('.centered').show();
    $('#notes_area').parent('label').hide();
    $('#addTodoTaskDescription').html($('#notes_area').html());

  }

  if(type == 'desc'){
    if($('#actionNoteDesc').hasClass('active')){
      if(!$('#action_amount').hasClass('active') && !$('#action_hour').hasClass('active')){
        $('#actionNoteDesc').removeClass('active')
        $('#task_desc_group').hide();
        clickDscCheck = 0;
      }
    }else{
      if(!$('#action_hour').hasClass('active') && !$('#action_amount').hasClass('active')){
        clickDscCheck = 1;
      }
       $('#actionNoteDesc').addClass('active')
       $('#task_desc_group').show();
    }
  }

  var setVal = $(ele).attr('data-setval');
  var setId = $(ele).attr('data-setid');

  if(setVal !== '3'){

    if(setVal == '2'){
      var currentVal = '0'; 
      var dVal = '2'; 
    }else if(setVal == '1'){
      var currentVal = '0'; 
      var dVal = '0'; 
    }else if(setVal == '0'){
      var currentVal = '1'; 
      var dVal = '1'; 
    }
    
    var activity = new Activity();
    activity.targetID           = setId;
    activity.activityId         = $("#updateAction").val();
    activity.activityUpdateData = dVal;
    activity.activityType       = type;
    activity.activityCreatedBy  = user_id;

    activity._setting((response)=>{

      if(type == 'amount'){
        
        $("#action_amount").attr('data-setval',currentVal);
        $("#action_amount").attr('data-setid',response._setting_response.settingid);
        
      }else if(type == 'hour'){
        $("#action_hour").attr('data-setval',currentVal)
        $("#action_hour").attr('data-setid',response._setting_response.settingid)

        
      }else if(type == 'h.rate'){


      }else if(type == 'desc'){
        $("#actionNoteDesc").attr('data-setval',currentVal);
        $("#actionNoteDesc").attr('data-setid',response._setting_response.settingid);

      }

    });
  }
  
}

// function startToDo(event){
//     var todotitle = $(event.target).find('.toDoName').text();
//     hideAllToggleInput();
//     $('.tooltipspan').html('');
//     $('.taskLoader2').show();
//     $('#todoTitle').val(todotitle);
//     $('.multipleProgress').css('display','flex');
//     $('#totalProgressSubtask').text('0%');
//     $('#completedProgress').css('width','0%').attr('data-value','0%');
//     $('#workingProgress').css('width','0%').attr('data-value','0%');
//     $('#waitingFeedbackProgress').css('width','0%').attr('data-value','0%');
//     $('#incompleteProgress').css('width','100%').attr('data-value','100%');

//     $('.side_bar_list_item li').removeClass('selected');
//     $('.side_bar_list_item li').removeClass('activeTodo');
//     $('#addTaskContainer').show();
//     taskShowHideElement(false);
//     $('#addTodoCheckList').parents('.centered').show();
//     $('.to_do_container').find('.button-section').hide();
//     $('#openBatchAction').hide();

//     $('.share-drop-list img').remove();
//     $('.share-drop-list .count_plus').hide();
    
//     observer = [];
//     assignee = [];
//     coowner = [];
//     viewMemberImg = [];
//     sharedMemberList = [];
    
//     var name = $(event.target).text();
//     var newTodo = "New Task";
//     var type = 'TODO';
    
//     currentMemberList = [];
//     currentMemberList2 = [];
//     checklistiTEM = [];
//     updateCheckList = [];
    
//     taskParticipants = [];

//     addAsCoOwnerArr = [];
//     addAsObsrvrArr = [];
//     addAsAssigneeArr = [];

//     $('.sharedIMG').remove();
//     $('.ownerThisToDo').remove();

//     $('#sharePeopleList span').hide();
//     $('#ownerPeopleList span').hide();
//     $('#observerPeopleList span').hide();
//     $('#assigneePeopleList span').hide();

//     //  ..........  //
//     //  ..........  //

//     $('.count_owner').show();
//     $('.add-check-list').show();
//     $('.item_progress').show();
//     $('.group-header-wrapper').hide();

//     // .........  //
//     // .........  //
//     $('#chat_icon').show();
//     $(".checklist_item").val('');
//     $("#amazonWishlist").prop('checked', false);
//     $(".count_member").text(" 1 member");
//     $('.suggested-list').html("");
//     $("#chat_icon").css('pointer-events', 'auto');
//     $("#tagged_area").css('pointer-events', 'auto');
//     $(".flag").css('pointer-events', 'auto');
//     $("#toDoPinUnpinDiv").css('pointer-events', 'auto');
//     $(".more").css('pointer-events', 'auto');

//     tagListTitle = [];
//     tagLsitDetail = [];

//     $("#fileAttachTagLs").html('');
//     $("#n_ToDo_item").remove();
//     $(".newcolCell").remove();
//     $(".newcol").remove();

//     tagListForFileAttach = [];
//     FtempArray = [];
//     FtaggedList = [];

//     $("#taskTaggedList").html("");
//     $(".checklistDiv").html("");
//     $("#taskTagItemList").html("");

//     $("#viewUploadFileviewUploadFile").html('');
//     $("#viewUploadFileviewUploadFile").hide();

//     $(".tagged").attr('src', '/images/basicAssets/custom_not_tag.svg');


//     $("#selectWorkspace option").each(function () {
//         $(this).removeAttr("selected");
//     });

//     $("#taskStatusSelect option").each(function () {
//         $(this).removeAttr("selected");
//     });

//     $("#ReminderTime option").each(function () {
//         $(this).removeAttr("selected");
//     });
//     var activity_id = conversationid = $(event.target).attr('data-activityid');

//     $("#deletetodoTopBar").attr('data-activityid', activity_id);
//     $('#chat_icon').attr('data-activity_id', activity_id);
    
//     var nour = $("#activity_" + activity_id).attr("data-urm");
//     if (nour > 0) {
//         $('#chat_icon>img').attr('src', '/images/basicAssets/Chat_active.svg');
//         $('#chat_icon>img').css({ 'width': '14px', 'height': '14px' });
//     } else {
//         $('#chat_icon>img').attr('src', '/images/basicAssets/Chat.svg');
//         $('#chat_icon>img').css({ 'width': '14px', 'height': '14px' });
//     }

//     $('#updateAction').val(activity_id);

//     if ($('#live-chat').is(':visible')) {
//         $('#chat_icon').trigger('click');
//     }

//     $(".pulse-component:not(#OnlyForClone)").remove();
//     $('.progressBarContainer').html();
//     $('.progressBarContainer').html('<div id="pgColor1" data-value="100%" data-color="#d8d8d8;" style="width:100%; background:#d8d8d8;"></div>');
//     $('.to_do_head_left.secLabel').hide();

//     // Default settings
//     if(!$("#owner_co_owner").hasClass('active')){
//         $("#owner_co_owner").attr('data-setval',2);
//         $("#owner_co_owner").removeClass('active');
//         $('.ownerClass').hide();
//         $('.WonerCell').hide();
//         $('.coownerclass').hide();
//         $('.coowonerCell').hide();
//     }

//     if(!$("#set_Observer").hasClass('active')){
//         $("#set_Observer").attr('data-setval',2);
//         $("#set_Observer").removeClass('active');
//         $('.observerclass').hide();
//         $('.ObserverCell').hide();
//     }

//     if(!$("#set_assignee").hasClass('active')){
//         $("#set_assignee").attr('data-setval',2);
//         $("#set_assignee").addClass('active');
//         $('.assignClass').hide();
//         $('.AssigneeCell').hide();
//     }


//     if(!$("#set_phase").hasClass('active')){
//         $("#set_phase").attr('data-setval',2);
//         $("#set_phase").addClass('active');
//         $('.priorityClass').show();
//         $('.priorityCell').show();
        
//     }

//     if(!$("#set_dueby").hasClass('active')){
//         $("#set_dueby").attr('data-setval',2);
//         $("#set_dueby").addClass('active');
//         $('.dateClass').show();
//         $('.DateCell').show();
//     }

//     if(!$("#set_compdate").hasClass('active')){
//         $("#set_compdate").attr('data-setval',2);
//         $("#set_compdate").addClass('active');
//         $('.com_dateClass').show();
//         $('.com_DateCell').show();
//     }

//     if($("#budget_set").hasClass('active')){
//         $("#budget_set").attr('data-setval',2);
//         $("#budget_set").removeClass('active');

//         $('.amountClass').hide();
//         $('.actualClass').hide();
//         $('.varianceClass').hide();

//         $('.AmountCell').hide();
//         $('.actutalCell').hide();
//         $('.varianceCell').hide();
//     }

//     if($("#task_time_set").hasClass('active')){
//         $("#task_time_set").attr('data-setval',2);
//         $("#task_time_set").removeClass('active');

//         $('.timeEstClass').hide();
//         $('.manhourcost').hide();
//         $('.actualHourClass').hide();
//         $('.hourlyClass').hide();
//         $('.timevarianceClass').hide();

//         $('.timeEstCell').hide();
//         $('.ManHourRateCell').hide();
//         $('.actualHourCell').hide();
//         $('.hourlyRateCell').hide();
//         $('.timevarianceCell').hide();
//     }

//     if(!$("#set_statuscol").hasClass('active')){
//         $("#set_statuscol").attr('data-setval',2);
//         $("#set_statuscol").addClass('active');

//         $('.statusClass').hide();
//         $('.StatusCell').hide();
//     }

//     subTaskListArr = [];
    
//     const activity = new Activity();

//     activity.activityId          = activity_id;
//     activity.activityCreatedBy   = user_id;
//     /*Uniq owner Kanban view */
//     if( activity.activityCreatedBy != null &&  activity.activityCreatedBy != ''){
//         if(uniqOwner.indexOf(activity.activityCreatedBy == -1)){
//             uniqOwner.push(activity.activityCreatedBy);
//         }
//     }
    
//     if($('#todoTitle + .secLabel').is(':visible') == false){
//         let seclabel = '<div class="secLabel" style="position: absolute;height: 18px;bottom: 2px;visibility:hidden">'+
//                         '<p id="totalTask" onclick="totalSubTask()" style="float: right;margin-right: 7px;cursor: pointer;border-left: 2px solid #d8d8d8;padding-left: 7px;">0 Subtask(s)</p>'+
//                         '<div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: -58px" id="TST"></div>'+
//                         '  <p id="totalTaskMember" onclick="totalTaskMember()" style="float: right;margin-right: 7px;cursor: pointer;margin-left: 7px;border-left: 2px solid #d8d8d8;padding-left: 7px;">1 Member(s)</p>'+
//                         '  <div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: 16px" id="TTM"></div>'+
//                         '  <span id="taskCreated_By"style="line-height: 17px;"></span>'+
//                         '  <span id="taskCreated_At"style="line-height: 17px;"></span>'+
//                         '  <span id="taskCreated_At_time" style="margin-left:5px;line-height: 17px;"></span>'+
//                         '</div>';
//         $('#todoTitle + .secLabel').remove();
//         $(seclabel).insertAfter('#todoTitle');
//     }

//     activity.getSingleActivity((response)=>{
//         if(response.status){

//             // Changelog hide show
//             var changeLogArr = [];
//             if(response.getChangeLogResponse != undefined){
//                 if(response.getChangeLogResponse.activities != undefined){
//                     if(response.getChangeLogResponse.activities.length > 0){
//                         $.each(response.getChangeLogResponse.activities, (k,v)=>{
//                             if(changeLogArr.indexOf(v.activity_type) == -1){
//                                 changeLogArr.push(v.activity_type);
//                                 $("#cl_"+v.activity_type).show();
//                             }
//                         });  
//                     }   
//                 }
//             }

//             $('.to_do_head_left.secLabel').show();
//             $('#taskCreated_By').text('Created By '+findObjForUser(response.activityDetail[0].activity_created_by).fullname+'');
//             $('#taskCreated_At').text('Dated On '+moment(response.activityDetail[0].activity_created_at, 'YYYY-MM-DD').format('DD-MM-YYYY')+'');
//             $('#taskCreated_At_time').text('at '+moment(response.activityDetail[0].activity_created_at, 'YYYY-MM-DD HH:mm:ssZZ').format('hh:mm A')+'');

//             if(response.childActivities.length > 0){
                
//                 $('#taskStatusSelect').val('Working').trigger('change'); 
//                 $("#taskStatusSelect").css('pointer-events','none');
//                 $(".task_status .rdonlyText").css('display','inline-block');
//                 $(".task_status .rdonlyDiv").css('display','block');
//                 $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','none');
//             }else{
//                 $('#taskStatusSelect').val('Initiate').trigger('change'); 
//                 $("#taskStatusSelect").css('pointer-events','auto');
//                 $(".task_status .rdonlyText").css('display','none');
//                 $(".task_status .rdonlyDiv").css('display','none');
//                 $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','auto');
//             }
            
//             var activityDetail = response.activityDetail[0];
//             var participants = response.participants;
//             let ttm = participants.length + 1;
//             $('.workspaceform').show();
//             $('#TTM').html('');
//             $('.count_member.tcm + .customToolTip').html('');
//             $('#subtaskListBackWrap .list_Count').text('('+ response.childActivities.length +')');

//             $('#totalTaskMember').text(''+ ttm +' Member(s)');
//             $('.count_member.tcm').text(''+ ttm +' Member(s)');
//             $('#memberListBackWrap .list_Count').text('('+ ttm +')');
//             let htmlOwner = '<div class="list showEl perListUser_'+activityDetail.activity_created_by+'" style="position:relative">'+
//                             '<p class="member_label"> Owner </p>'+
//                             '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(activityDetail.activity_created_by).img+'">'+
//                             '<h1 class="memberName">'+findObjForUser(activityDetail.activity_created_by).fullname+'</h1>'+
//                         '</div>'
//             $('#memberListBackWrap .memberList').prepend(htmlOwner);
//             $('#TTM').prepend('<span>'+findObjForUser(activityDetail.activity_created_by).fullname+' (Owner)</span><br>');
            
//             if(participants.length > 0){
//                 $.each(participants, function (kk,vv) {
//                     let utype = '';
//                     if(vv.type == 'owner'){
//                         utype = 'Coowner';
//                     }else{
//                         utype = vv.type;
//                     }
//                     $('#TTM').append('<span>'+findObjForUser(vv.id).fullname+' ('+utype+')</span><br>');
//                     $('.count_member.tcm + .customToolTip').append('<span>'+findObjForUser(vv.id).fullname+' </span><br>');

//                     let html = '<div class="list showEl perListUser_'+vv.id+'" style="position:relative">'+
//                                     '<p class="member_label">'+utype+'</p>'+
//                                     '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(vv.id).img+'">'+
//                                     '<h1 class="memberName">'+findObjForUser(vv.id).fullname+'</h1>'+
//                                 '</div>'
//                     $('#memberListBackWrap .memberList').append(html);
//                 })
//             }
//             //pin activity id set
//             $("#pin_unpin").attr("data-acid", activity_id);
//             $("#createTaskConvTag").attr('data-acid', activity_id);
//             if ($('#completedSidecontainer').is(':visible') == false) {
//                 setCookie('lastActive', activity_id, 1);
//             }

//             $("#actionFileUpload").attr('data-myid',activity_id);

//             if(!validate.isEmpty(activityDetail.activity_title)){
//                 if (activityDetail.activity_title.length > 60) {
//                     $('.edit-todo-name').css('height', '50px');
//                     $('.to_do_head_left').css('margin', '6px 0px');
//                     $('.to_do_head_left label').css('top', '20px');
//                     $('.to_do_head_left .checkbox_container').css('top', '12px');
//                     $('.edit-todo-name').css('line-height', '22px');
//                 } else {
//                     $('.edit-todo-name').css('height', '32px');
//                     $('.to_do_head_left').css('margin', '22px 0px');
//                     $('.to_do_head_left>label').css('top', '5px');
//                     $('.edit-todo-name').css('line-height', '32px');
//                     $('.to_do_head_left .checkbox_container').css('top', '6px');
//                 }
//             }

//             $("#todoTitle").val(activityDetail.activity_title);
            
//             $("#selectWorkspace").find('option[value="' + activityDetail.activity_workspace + '"]').attr("selected", true);
//             $('#selectWorkspace').select2().trigger('change');
//             $("#taskStatusSelect").find('option[value="' + activityDetail.activity_status + '"]').attr("selected", true);
//             $('#taskStatusSelect').select2().trigger('change');

//             $("#dueDatePicker").val(moment(activityDetail.activity_end_time).format('DD-MM-YYYY'));
            
//             $("#notes_area").text(activityDetail.activity_description);
//             $("#addTodoTaskDescription").text(activityDetail.activity_description);

//             $("#timeFrom").val(activityDetail.activity_from);
//             $("#timeTo").val(activityDetail.activity_to);
//             $("#ReminderTime").val(activityDetail.activity_has_reminder);

//             var activity_budget_amount      = (validate.isEmpty(activityDetail.activity_budget_amount) ? 0 : activityDetail.activity_budget_amount);
//             var activity_actual_amount  = (validate.isEmpty(activityDetail.activity_actual_amount) ? 0 : activityDetail.activity_actual_amount);
//             var activity_est_hour  = (validate.isEmpty(activityDetail.activity_est_hour) ? '0:00' : activityDetail.activity_est_hour);
//             var activity_est_hourly_rate     = (validate.isEmpty(activityDetail.activity_est_hourly_rate) ? 0 : activityDetail.activity_est_hourly_rate);
//             var activity_actual_hour      = (validate.isEmpty(activityDetail.activity_actual_hour) ? '0:00' : activityDetail.activity_actual_hour);
//             var activity_actual_hourly_rate      = (validate.isEmpty(activityDetail.activity_actual_hourly_rate) ? 0 : activityDetail.activity_actual_hourly_rate);
            
//             $("#taskBAinput").val(parseFloat(activity_budget_amount).toFixed(2));
//             $("#taskAAinput").val(parseFloat(activity_actual_amount).toFixed(2) );

//             $("#taskEHinput").val(activity_est_hour);
//             $("#taskEHRinput").val(parseFloat(activity_est_hourly_rate).toFixed(2));

//             $("#taskAHinput").val(activity_actual_hour);
//             $("#taskAHRinput").val(parseFloat(activity_actual_hourly_rate).toFixed(2));

//             rootBudgetAmount = ( validate.isEmpty(activityDetail.activity_budget_amount) ? 0 : parseFloat(activityDetail.activity_budget_amount));
//             rootActualAmount = (validate.isEmpty(activityDetail.activity_actual_amount) ? 0 : parseFloat(activityDetail.activity_actual_amount));
//             rootEstWorkHour = (validate.isEmpty(activityDetail.activity_est_hour) ? 0 : parseFloat(activityDetail.activity_est_hour));
//             rootEstHourRate = (validate.isEmpty(activityDetail.activity_est_hourly_rate) ? 0 : parseFloat(activityDetail.activity_est_hourly_rate));
//             rootActualWorkHour = (validate.isEmpty(activityDetail.activity_actual_hour) ? 0 : parseFloat(activityDetail.activity_actual_hour));
//             rootActualHourRate = (validate.isEmpty(activityDetail.activity_actual_hourly_rate) ? 0 : parseFloat(activityDetail.activity_actual_hourly_rate));

//             $('#actCre').val(activityDetail.activity_created_by);
//             // Completed

//             if(activityDetail.activity_status === 'Completed'){
//                 $("#amazonWishlist").prop('checked',true);
//             }else{
//                 $("#amazonWishlist").prop('checked',false);
//             }

//             // Budget Section Variance 
//             var ba = ($('#taskBAinput').val() != '' ?  $('#taskBAinput').val() : 0);
//             var aa = ($('#taskAAinput').val() != '' ?  $('#taskAAinput').val() : 0);
            
//             var diff = ba - aa;
            
//             $('#budget_variance span').text(parseFloat(diff).toFixed(2));

//             $('#budget_variance').removeClass('_inactive');

//             if(diff > -1){
//                 $('#budget_variance span').css('color','#53627c');
//             }else{
//                 $('#budget_variance span').css('color','red');
//             }


//             // Est Time Section Variance 
//             var esh = ($('#taskEHinput').val() != '' ?  $('#taskEHinput').val() : '0:00');
//             var eshr = ($('#taskEHRinput').val() != '' ?  $('#taskEHRinput').val() : '0.00');
//             var totalmin = 0;
//             var minarray = esh.split(':');
//                 totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1]:0 )) / 60;
//                 // $('#e_h_variance span').text(Math.ceil(esh * eshr));
//             $('#e_h_variance span').text(parseFloat(parseFloat(totalmin*eshr).toFixed(2)));
            
//             $('#e_h_variance').removeClass('_inactive');

//             // Actual Time Section Variance 
//             var eh = ($('#taskAHinput').val() != '' ?  $('#taskAHinput').val() : '0:00');
//             var ehr = ($('#taskAHRinput').val() != '' ?  $('#taskAHRinput').val() : '0.00');
//             var totalminactu = 0;
//             var minarrayactu = eh.split(':');
//             totalminactu = ((minarrayactu[0] * 60) + Number(minarrayactu[1] !== undefined ? minarrayactu[1]:0 )) / 60;
//             $('#e_h_r_variance span').text(parseFloat(parseFloat(totalminactu*ehr).toFixed(2)));

//             $('#e_h_r_variance').removeClass('_inactive');
            

//             $("#thisWeekPluseContainer").show();
            
//             $(".side_bar_list_item .n_td").removeClass('activeTodo');
//             $(".side_bar_list_item .n_td").removeClass('selected');

//             $("#activity_" + activity_id).addClass('activeTodo');
//             $("#activity_" + activity_id).addClass('selected');

//             //Pin Set
//             if(response.singleActivityPinResponse.status){
//                 if(response.singleActivityPinResponse.activities.length > 0){
//                     var pinData = response.singleActivityPinResponse.activities;
//                     $("#pin_unpin").attr('data-pinid',pinData[0].pin_id);
//                     //pinActivity(activity_id);
//                     $("#pin_unpin").addClass('pined');
//                     $("#pin_unpin").attr('src', '/images/basicAssets/custom_pinned.svg');
//                 }else{
//                     $("#pin_unpin").attr('data-pinid','');
//                     //unpinActivity(activity_id);
//                     $("#pin_unpin").removeClass('pined');
//                     $("#pin_unpin").attr('src', '/images/basicAssets/custom_not_pin.svg');
//                 }
//             }

//             //Flag Set
//             if(response.singleActivityFlagResponse.status){
//                 if(response.singleActivityFlagResponse.activities.length > 0){
//                     var flagData = response.singleActivityFlagResponse.activities;
//                     $('#flag_unflag').attr('data-flagid',flagData[0].flag_id);
//                     flagged(activity_id);
//                 }else{
//                     $('#flag_unflag').attr('data-flagid','');
//                     unflagged(activity_id);
//                 }
//             }

//             // Set TAG
//             chatmessagestag = response.messagestag;
//             if (response.messagestag.length > 0) {
//                 $.each(response.messagestag, function (k, v) {
//                     msgIdsFtag.push(v.id);
//                 });
//             }

//             if (response.tags != undefined) {
//                 var taggedID = response.tags;//all con tag tag_id
//                 var condtagsid = FtaggedList = response.condtagsid;//all con tag id

//                 var tempTagList = [];

//                 var totalTagslist = FtempArray = _.orderBy(response.totalTags, ['title'], ['asc']);

//                 $.each(totalTagslist, function (k, v) {

//                     if (alltags.indexOf(v.title.toLowerCase()) === -1) {
//                         my_tag_list[v.tag_id] = v.title.toLowerCase();
//                         alltags.push(v.title.toLowerCase());
//                         my_tag_id.push(v.tag_id.toString());
//                     }

//                     if (condtagsid.indexOf(v.tag_id) !== -1) {
//                         tagListForFileAttach.push(v.title.toLowerCase());
//                         tagListTitle.push(v.title.toLowerCase());
//                         tagLsitDetail.push({ 'cnvtagid': taggedID[condtagsid.indexOf(v.tag_id)], 'tagid': v.tag_id, 'tagTitle': v.title.toLowerCase(), 'roomid': conversationid });

//                         var design = '<li onclick="removeLevel(\'' + taggedID[condtagsid.indexOf(v.tag_id)] + '\',\'' + conversationid + '\',\'' + v.tag_id + '\')">' + v.title + '<span class="tagcheck" id="level' + taggedID[condtagsid.indexOf(v.tag_id)] + '"></span></li>';

//                         if (tempTagList.indexOf(v.tag_id) === -1) { tempTagList.push(v.tag_id); }
//                         $('#taskTaggedList').append(design);
//                     }
//                 });

//                 $.each(totalTagslist, function (k, v) {
//                     if (tempTagList.indexOf(v.tag_id) === -1) {
//                         var design = '<li id="tagLi' + v.tag_id + '" onclick="addTagto(\'' + v.tag_id + '\',\'' + conversationid + '\')">' + v.title + '</li>';
//                         $('#taskTaggedList').append(design);
//                     }
//                 });

//                 if (tagListTitle.length > 0) {
//                     $("#taskTagItemList").text(tagListTitle.join(','));
//                     $(".tagged").attr('src', '/images/basicAssets/custom_tagged.svg');
//                 }
//             }
            
//             participatedOwner       = [];
//             participatedObserver    = [];
//             participatedAssignee    = [];

//             participantsDraw(participants);

//             $('.created_priority').remove();
//             $('.created_status').remove();

//             if(response.customStatusResponse != undefined){
//                 if(response.customStatusResponse.status){
//                     $.each(response.customStatusResponse.response, (key,val)=>{
//                         if(val.title != null && val.title != "" && !validate.isEmpty(val.title) && !validate.isEmpty(val.color_code)){
//                             if(val.type == 'Priority'){

//                                 customPriority.push({
//                                     id: val.id,
//                                     title : val.title,
//                                     color: val.color_code.toString().trim()
//                                 });
    
//                                 var design = '<span onclick="pickPriority(this)" style="background-color: '+val.color_code+';" data-color="'+val.color_code+'"  data-id="" data-createdby="" class="single_priority created_priority">';
//                                     design += '      <span class="prioritySamColor"><img src="/images/basicAssets/drop.svg" alt=""></span>';
//                                     design += '      <span onclick="editPrioritylabel(this)" onkeypress="keypressPrioritylabel(event,this)" onblur="blurPrioritylabel(this)" id="cusSta_'+val.id+'" data-id="'+val.id+'"  class="priorityLabel">'+val.title+'</span>';
//                                     design += '      <span class="editpriority_label" onclick="editProiority(event,this)"></span>';
//                                     design += '      <span data-id="'+val.id+'" class="removepriority_label" onclick="removeProiority(event,this)"></span>';
//                                     design += '</span>';
//                                     design += '<div id="PCC_'+val.id+'" class="priorityChangeColor"></div>';
                                    
//                                 $('.create_priority').before(design);
//                                 $('.priority-color-wrapper').find('.status-change-color-icon:last').remove();
//                                 $('#PCC_'+val.id).append(colorpanels);
//                                 priorityColorSample();
//                             }else if(val.type == 'Status'){
    
//                                 customStatus.push({
//                                     id: val.id,
//                                     title : val.title,
//                                     color: val.color_code.toString().trim()
//                                 });
    
//                                 var desgn = '<span onclick="pickStatus(this)"  data-color="'+val.color_code+'"  style="background-color:'+val.color_code+'" data-id="" data-createdby="" class="initiate single_status created_status"><span class="statusSamColor"  onclick="openColordiv(event,this)"><img src="/images/basicAssets/drop.svg" alt=""></span><span onclick="editStatuslabel(this)" data-id="'+val.id+'"  onkeypress="keypressStatuslabel(event,this)" onblur="blurStatuslabel(this)" id="cusSta_'+val.id+'" class="statusLabel">'+val.title+'</span><span class="editpriority_label" onclick="editStatusLabel(event,this)"></span><span class="removepriority_label" data-id="'+val.id+'"  onclick="removeStatusLabel(event,this)"></span></span><div class="statusChangeColor" id="SCC_'+val.id+'"></div>';
                                
//                                 $('.create_new_status').before(desgn);
//                                 $('.priority-color-wrapper').find('.status-change-color-icon:last').remove();
//                                 $('#SCC_'+val.id).append(colorpanels);
//                                 // StatusColorSample();
//                             }
//                         }
                        
//                     });
//                 }
//             }
//             var colSortRes = (response._ColSortOnActivity != undefined ? response._ColSortOnActivity.res : '');
//             childActivitiesDraw(response.childActivities,response.childActivitiesParticipants,response.customActivityColRes,response.childActivityFlagResponse,colSortRes);

//             $('.kill').css('height',response.childActivities.length*37+200);
            
            
//             if($('#actCre').val() == user_id){
//                 if(observer.length == 0){
//                     $('#taskObserverList').attr('placeholder', 'Add Observer');
//                 }
//                 if(assignee.length == 0){
//                     $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
//                 }
//             }else{
//                 if(observer.length == 0){
//                     $('#taskObserverList').attr('placeholder', 'No Observer');
//                 }
//                 if(assignee.length == 0){
//                     $('#taskAssigneeList').attr('placeholder', 'No Assignee');
//                 }
//             }

//             if($('#actCre').val() == user_id){
//                 $('#fpc_corner-button').find('span').text('Owner');
//                 $('#restrictedMode').hide()
//             }else if(coowner.indexOf(user_id) > -1){
//                 $('#fpc_corner-button').find('span').text('Co-owner');
//                 $('#restrictedMode').hide()
//             }else if(observer.indexOf(user_id) > -1){
//                 $('#fpc_corner-button').find('span').text('Observer');
//                 $('#restrictedMode').show()
//             }else if(assignee.indexOf(user_id) > -1){
//                 $('#fpc_corner-button').find('span').text('Assignee');
//                 $('#restrictedMode').show()
//             }

//             if (coowner.length == 0) {
//                 $('#taskOwnerList img').remove();
//                 if (!validate.isEmpty(activityDetail.activity_created_by)) {
//                     sharedMemberList.push(activityDetail.activity_created_by.toString());
//                     currentMemberList3.push(activityDetail.activity_created_by.toString());
//                     $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(activityDetail.activity_created_by.toString()).img + '" data-uuid="' + findObjForUser(activityDetail.activity_created_by.toString()).id + '" class="sharedIMG memberImg' + findObjForUser(activityDetail.activity_created_by.toString()).id + ' ownerThisToDo">');
//                     $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(activityDetail.activity_created_by.toString()).fullname+'</span>');
//                 }
//             }

//         }else{
//             console.log("Something wrong with retrive activity data");
//         }
        
//         $(".expand-column").each((k,v)=>{

//             if($(v).is(':visible')){
//                 $(v).trigger('click');
//             }
//         });

//         checkActivityAccessibilities(user_id,response.activitySettingResponse);

//         filteringTaskShowing();
//     });
// }

function duplicateActivity(activityid){
    if($('#actCre').val() == user_id || coowner.indexOf(user_id) > -1){
        createNewActivity();
    }
}

function progressBar(chkboxNumber,checked){
    var checkBoxPerPercentage = 100/parseInt(chkboxNumber);
    var complete = Math.ceil(checkBoxPerPercentage*checked);
    $("#progressbar").attr('aria-valuenow',complete);
    $("#progressbar").css('width',complete+'%');
    $(".progress_status").text(complete+'%');
}

function activitiesDrawOnPromise(datas,activityUnqArry,rowSl){
    return new Promise((resolve,reject)=>{
        let count = 0;
        var createdbyme = [];
        var myallActivtiy = [];
        var dueDate = {};
        var newDatas = [];
        if( !validate.isEmpty(rowSl[0])){
            $.each(rowSl, function (rky, rva) {
                $.each(datas, function (ky, va) {
                    if(rva == va.activity_id.toString()){
                        newDatas.push(va);  
                    }
                });
            });
        }else{
            newDatas  = datas;
        }


        $.each(newDatas, function (ky, va) {
            count++;
            if(va.activity_created_by.toString() === user_id){
                if(createdbyme.indexOf(va.activity_id.toString()) == -1){
                    createdbyme.push(va.activity_id.toString());
                }
            }

            if(activityUnqArry.indexOf(va.activity_id) > -1 || va.activity_created_by.toString() === user_id){
                
                if(myallActivtiy.indexOf(va.activity_id.toString()) == -1){
                    myallActivtiy.push(va.activity_id.toString());
                    myAllActivityGlobal.push(va.activity_id.toString());
                }
                
                if(subTaskListArr.indexOf(va.activity_title.toLowerCase().trim()) == -1){
                    subTaskListArr.push(va.activity_title.toLowerCase().trim());
                }
                
                var htm = $( "#OnlyForClone" ).clone();
                var pulse  = $('.pulse-component').length;
                var id  = $('.pulse_title').length+1;
                var od = 'newSubtask'+$('.innerDropMeny').length;

                var info = findObjForUser(va.activity_created_by);
                $(htm).attr('id', 'pulse_'+va.activity_id).addClass('_eachsubtask').attr('data_cr_name',info.fullname).attr('data_created_date', va.activity_created_at);
                $(htm).attr('data-id',va.activity_id);

                $(htm).find('.name-cell-component .pulse_title').text(va.activity_title);
                $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
                $(htm).find('.numeric-cell-component .amountInputValue').text('0');

                $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/'+info.img);
                $(htm).find('.owner_img').attr('title', info.fullname);

                $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle'+id).text(va.activity_title);
                $(htm).find('.name-cell-component .pulse_title').attr('data-title', va.activity_title);
                $(htm).find('.name-cell-component .pulse_title').attr('data-id', va.activity_title);
                $(htm).find('.name-cell-component .pulse_title').attr('data-title', va.activity_title);

                $(htm).find('.name-cell-component .subtaskAllFile .datamyid').attr('data-myid', va.activity_id);
                
                // ATTR SET

                $(htm).find('.ObserverCell .observerViewList').attr('data-id', va.activity_id);
                $(htm).find('.coowonerCell .coownerViewList').attr('data-id', va.activity_id);
                $(htm).find('.AssigneeCell .assigneeViewList').attr('data-id', va.activity_id);
                $(htm).find('.DateCell .dueDateInput').attr({'data-id': va.activity_id,'data-date': va.activity_end_time,});
                $(htm).find('.com_DateCell .com_DateInput').attr({'data-id': va.activity_id,'data-date': va.activity_completed_at});
                $(htm).find('.priorityCell .single_priority').attr('data-id', va.activity_id);
                $(htm).find('.StatusCell .single_status').attr('data-id', va.activity_id);
                $(htm).find('.timeEstCell .timeInputValue').attr({'data-id': va.activity_id});
                if(va.activity_est_hour != null){
                    $(htm).find('.timeEstCell .timeInputValue').attr({'data-val': va.activity_est_hour});
                }else{
                    $(htm).find('.timeEstCell .timeInputValue').attr({'data-val': 0});
                }
                $(htm).find('.actualHourCell .actualHourCellSpan').attr({'data-id': va.activity_id});
                
                if(va.activity_actual_hour != null){
                    $(htm).find('.actualHourCell .actualHourCellSpan').attr({'data-val': va.activity_actual_hour});
                }else{
                    $(htm).find('.actualHourCell .actualHourCellSpan').attr({'data-val': 0});
                }
                $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-id', va.activity_id);
                $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-id', va.activity_id);
                $(htm).find('.AmountCell .AmountCellSpan').attr('data-id', va.activity_id);
                $(htm).find('.actualCell .actualCellSpan').attr('data-id', va.activity_id);
                $(htm).find('.varianceCell .varianceCellSpan').attr('data-id', va.activity_id);
                $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-id', va.activity_id);
                $(htm).find('.name-cell-component .pulse_title').attr('data-id', va.activity_id);
                $(htm).find('.name-cell-component .flagIco').attr('data-id', va.activity_id);

                $(htm).find('.ObserverCell .observerViewList').attr('data-createdby', va.activity_created_by);
                $(htm).find('.coowonerCell .coownerViewList').attr('data-createdby', va.activity_created_by);
                $(htm).find('.AssigneeCell .assigneeViewList').attr('data-createdby', va.activity_created_by);
                $(htm).find('.DateCell .dueDateInput').attr('data-createdby', va.activity_created_by);
                $(htm).find('.com_DateCell .com_DateInput').attr('data-createdby', va.activity_created_by);
                $(htm).find('.priorityCell .single_priority').attr('data-createdby', va.activity_created_by);
                $(htm).find('.StatusCell .single_status').attr('data-createdby', va.activity_created_by);
                $(htm).find('.timeEstCell .timeInputValue').attr('data-createdby', va.activity_created_by);
                $(htm).find('.actualHourCell .actualHourCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.AmountCell .AmountCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.actualCell .actualCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.varianceCell .varianceCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-createdby', va.activity_created_by);
                $(htm).find('.name-cell-component .pulse_title').attr('data-createdby', va.activity_created_by);

                // ID SET

                $(htm).find('.DateCell .dueDateInput').attr('id', 'dueDate'+va.activity_id);
                $(htm).find('.com_DateCell .com_DateInput').attr('id', 'comDate'+va.activity_id);
                $(htm).find('.ObserverCell .observerViewList').attr('id', 'observer'+va.activity_id).addClass('observer'+va.activity_id);
                $(htm).find('.coowonerCell .coownerViewList').attr('id', 'coowner'+va.activity_id).addClass('coowner'+va.activity_id);
                $(htm).find('.AssigneeCell .assigneeViewList').attr('id', 'assignee'+va.activity_id).addClass('assignee'+va.activity_id);
                $(htm).find('.priorityCell').attr('id', 'priority'+va.activity_id);
                $(htm).find('.StatusCell').attr('id', 'status'+va.activity_id);
                $(htm).find('.timeEstCell .timeInputValue').attr('id', 'timeInputValue'+va.activity_id);
                $(htm).find('.actualHourCell .actualHourCellSpan').attr('id', 'actualHourCellSpan'+va.activity_id);
                $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('id', 'ManHourRateSpan'+va.activity_id);
                $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('id', 'hourlyRateCellSpan'+va.activity_id);
                $(htm).find('.AmountCell .AmountCellSpan').attr('id', 'AmountCellSpan'+va.activity_id);
                $(htm).find('.actualCell .actualCellSpan').attr('id', 'actualCellSpan'+va.activity_id);
                $(htm).find('.varianceCell .varianceCellSpan').attr('id', 'varianceCellSpan'+va.activity_id);
                $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('id', 'timevarianceCellSpan'+va.activity_id);

                if($('#addnewSub').is(':visible')){
                    if(row_pluse_count == 0){
                        $('.pulse_title').first().closest('.pulse-component').before(htm);
                    }else if(row_pluse_count == 1){
                        $('#varienceRow').before(htm);
                    }

                    if(($('.pulse_title').length - 1) > 9){
                        $('#pulse_'+va.activity_id).find('.row_pluse_count').addClass('twodigi');
                    }

                    $('#pulse_'+va.activity_id).find('.row_pluse_count').text($('.pulse_title').length - 1);
                }else{
                    $('.pulse_title').last().closest('.pulse-component').before(htm);
                    var wid = 0;
                    
                    $('.cell-component:visible').each(function(k,v){
                        wid = wid+$(v).innerWidth();
                    });

                    SubtaskClone.cellcomponent = 17;
                    SubtaskClone.flexSize = wid;
                    SubtaskClone.id = $('.pulse-component').length;

                    $( "#thisWeekPluseContainer").append(SubtaskClone.varience());
                    $( "#thisWeekPluseContainer").append(SubtaskClone.draw());
                    
                    if(($('.pulse_title').length - 1) > 9){
                        $('#pulse_'+va.activity_id).find('.row_pluse_count').addClass('twodigi');
                    }
                    
                    $('#pulse_'+va.activity_id).find('.row_pluse_count').text($('.pulse_title').length - 1);
                }

                dueDate[va.activity_id] = {
                    duedate             : va.activity_end_time,
                    comdate             : va.activity_completed_at,
                    priority            : va.activity_priority,
                    status              : va.activity_status,
                    timeInputValue      : va.activity_est_hour,
                    ManHourRateSpan     : va.activity_est_hourly_rate,
                    actualHourCellSpan  : va.activity_actual_hour,
                    hourlyRateCellSpan  : va.activity_actual_hourly_rate,
                    AmountCellSpan      : va.activity_budget_amount,
                    actualCellSpan      : va.activity_actual_amount,
                    varianceCellSpan    : va.activity_varience
                };
                
                if(va.activity_priority != null && va.activity_priority != ''){
                    if(unipriority.indexOf(va.activity_priority.toString()) == -1){
                        unipriority.push(va.activity_priority);
                    }
                }
                
                if(va.activity_status != null && va.activity_status != ''){
    
                    if(unistatus.indexOf(va.activity_status.toString()) == -1){
                        unistatus.push(va.activity_status);
                    }
               
                }
                
                if(va.activity_end_time !=null && va.activity_end_time !='' ){
                    if(uniqDueDate.indexOf(moment(va.activity_end_time).format('YYYY-MM-DD')) == -1){
                        uniqDueDate.push(moment(va.activity_end_time).format('YYYY-MM-DD'));
                    }
    
                }

                if(va.activity_completed_at !=null && va.activity_completed_at !='' ){
                    if(uniqComDate.indexOf(moment(va.activity_completed_at).format('YYYY-MM-DD')) == -1){
                        uniqComDate.push(moment(va.activity_completed_at).format('YYYY-MM-DD'));
                    }
    
                }

                keypressBlur();
                countSubtask();
                tooltipforToDo();
            }

        });

        if(datas.length == count){
            resolve({
                'status'        :   true,
                'createdbyme'   :   createdbyme,
                'myallActivtiy' :   myallActivtiy,
                'dueDate'       :   dueDate
            });
        }else{
            reject(false);
        }
    });
}


async function childActivitiesDraw(datas,childActivitiesParticipants,customActivityColRes,childFlagResponse,_ColSortOnActivity){
    if(datas.length > 0){
        /* Kanban view */
        unipriority = [];
        unistatus =[];
        uniqDueDate = [];
        uniqComDate = [];
        uniqueObserver = [];
        uniqueAssine = [];
        uniqOwner = [];
        uniqCoowner = [];

        partiArry = [];
        var activityUnqArry = [];
        var myActivity = [];
        var createdbyme = [];
        var myallActivtiy = [];
        var dueDate = [];
        myAllActivityGlobal = [];
        var rowSl = [];
        if(!validate.isEmpty(_ColSortOnActivity)){
            var sortList =  _.orderBy(_ColSortOnActivity, ['col_sl'], ['asc']);
            var colCountEle = [];
            var bodyCountEle = [];
            var colCount = 0;

            $.each(sortList,(ks,vs)=>{
                if(vs.col_type == 'col'){
                    $.each(headArr,(k,v)=>{
                        if(vs.col_name == $(v).attr('data-id')){
                            colCountEle.push(v);
                        }
                    });

                    $.each(bodyArr,(k,v)=>{
                        if($(v).hasClass(vs.col_name)){
                            bodyCountEle.push(v);
                        }
                    });
                    colCount++;
                }
            });
            console.log('colCount',colCount);
            if(colCount > 0){
                $('.group-header-component').html('');
                $('#OnlyForClone').html('');
            }else{
                $('.group-header-component').html('');
                $('#OnlyForClone').html('');

                $.each(headArr,(k,v)=>{
                    $('.group-header-component').append(v);
                });

                $.each(bodyArr,(k,v)=>{
                      $('#OnlyForClone').append(v);
                });
            }
            
            $.each(sortList,(ks,vs)=>{
                if(vs.col_type == 'col'){
                    $.each(colCountEle,(k,v)=>{
                        if(vs.col_name == $(v).attr('data-id')){
                            $('.group-header-component').append(v);
                        }
                    });

                    $.each(bodyCountEle,(k,v)=>{
                        if($(v).hasClass(vs.col_name)){
                            $('#OnlyForClone').append(v);
                        }
                    });
                }else{
                    if(rowSl.indexOf(vs.col_name) == -1){
                        rowSl.push(vs.col_name);
                    }
                }
            });
        }
        
        $.each(childActivitiesParticipants,function(k,v){
            $.each(v,function(ku,vu){
                console.log(1474, vu);
                partiArry.push(vu);
                if(vu.user_id.toString() == user_id){
                    if(activityUnqArry.indexOf(vu.activity_id.toString()) == -1){
                        activityUnqArry.push(vu.activity_id.toString());
                    }
                }
                
            });
        });

        var activitesRes = await activitiesDrawOnPromise(datas,activityUnqArry,rowSl).catch((err)=>{console.log(err)});

        sortableFunc();
        console.log(subTaskListArr);
        $('#totalTask').text(''+ myAllActivityGlobal.length +' Subtask(s)');
        $('#TST').html('');
        $('#subtaskListBackWrap .memberList').html('');
        if(datas.length > 0){
            let i = 1;
            $.each(datas, function (sk,sv) {
                $.each(myAllActivityGlobal, function(ka,va) {
                    if(sv.activity_id == va){
                        let html2 = '<div class="list showEl perListUser_" style="position:relative">'+
                                        '<div style="border:1px solid #d8d8d8;display: flex;align-items: center;justify-content: center;font-size: 12px;font-weight: 700;box-sizing: border-box;border-radius: 4px;height: 40px;width: 40px;border-radius: 14px;float: left;"> <span style="">Sub</span> <br> <span style="">#'+ i++ +'</span></div>'+
                                        '<h1 class="memberName">'+sv.activity_title+'</h1>'+
                                    '</div>'
                        $('#subtaskListBackWrap .memberList').append(html2);
                        $('#TST').append('<span> '+sv.activity_title+' </span><br>');
                    }
                });
            });
        }
        if(activitesRes != undefined){

            myallActivtiy   = activitesRes.myallActivtiy;
            dueDate         = activitesRes.dueDate;
            createdbyme     = activitesRes.createdbyme;

            if(myallActivtiy.length > 0){
                taskShowHideElement(true);
            }else{
                taskShowHideElement(false);
            }

            if(childFlagResponse != undefined){
                if(childFlagResponse.status){
                    $.each(childFlagResponse.activities,function(k,v){
                        $("#pulse_"+v.activity_id).find('.name-cell-component .flagIco').attr('data-flagid', v.flag_id).addClass('flagged');
                    });
                }
            }

            $.each(dueDate,function(k,v){
                $("#dueDate"+k).val(moment(v.duedate).format('YYYY-MM-DD'));
                $("#comDate"+k).val(moment(v.comdate).format('YYYY-MM-DD'));
                var timeInputValue      = (validate.isEmpty(v.timeInputValue) ? 0 : v.timeInputValue);
                var hourlyRateCellSpan  = (validate.isEmpty(v.hourlyRateCellSpan) ? 0 : v.hourlyRateCellSpan);
                var actualHourCellSpan  = (validate.isEmpty(v.actualHourCellSpan) ? 0 : v.actualHourCellSpan);
                var ManHourRateSpan     = (validate.isEmpty(v.ManHourRateSpan) ? 0 : v.ManHourRateSpan);
                var AmountCellSpan      = (validate.isEmpty(v.AmountCellSpan) ? 0 : v.AmountCellSpan);
                var actualCellSpan      = (validate.isEmpty(v.actualCellSpan) ? 0 : v.actualCellSpan);

                $("#timeInputValue"+k).text(parseFloat(timeInputValue).toFixed(2));
                $("#hourlyRateCellSpan"+k).text(parseFloat(hourlyRateCellSpan).toFixed(2));
                $("#actualHourCellSpan"+k).text(parseFloat(actualHourCellSpan).toFixed(2));
                $("#ManHourRateSpan"+k).text(parseFloat(ManHourRateSpan).toFixed(2));
                $("#AmountCellSpan"+k).text(parseFloat(AmountCellSpan).toFixed(2));
                $("#actualCellSpan"+k).text(parseFloat(actualCellSpan).toFixed(2));
                var ss = (AmountCellSpan - actualCellSpan);
                $("#varianceCellSpan"+k).text(parseFloat(ss).toFixed(2));

                var estTime = parseFloat(($("#timeInputValue"+k).text() == '' ? 0 : $("#timeInputValue"+k).text()));
                var estRate = parseFloat(($("#hourlyRateCellSpan"+k).text() == '' ? 0 : $("#hourlyRateCellSpan"+k).text()));
                var actualTime = parseFloat(($("#actualHourCellSpan"+k).text() == '' ? 0 : $("#actualHourCellSpan"+k).text()));
                var actualRate = parseFloat(($("#ManHourRateSpan"+k).text() == '' ? 0 : $("#ManHourRateSpan"+k).text()));

                var timever = (estTime*estRate)-(actualTime*actualRate);
                
                $("#timevarianceCellSpan"+k).text(parseFloat(timever).toFixed(2));

                $('#priority'+k+' .single_priority' ).each(function(ksp,vsp) {
                    if($(vsp).find('.priorityLabel').text() == v.priority){
                        $(vsp).trigger('click');
                    }
                });

                $('#status'+k+' .single_status' ).each(function(kss,vss) {
                    if($(vss).find('.statusLabel').text() == v.status){
                        $(vss).trigger('click');
                    }
                });
            });

            varienceCollect();

            $('.coowonerCell').find('.person-bullet-image').remove();
            $('.ObserverCell').find('.person-bullet-image').remove();
            $('.AssigneeCell').find('.person-bullet-image').remove();

            $('.ObserverCell').find('.person-bullet-component.inline-image').append('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"><img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
            $('.AssigneeCell').find('.person-bullet-component.inline-image').append('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
            $('.coowonerCell').find('.person-bullet-component.inline-image').append('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
            var acessArr = [];

            
            $.each(partiArry, function(k,v){

                if(v.participant_type === 'observer'){
                    if(uniqueObserver.indexOf(v.user_id.toString()) == -1){
                        uniqueObserver.push(v.user_id.toString());
                    } 
                    addAsObsrvrArr.push({
                        activityid: v.activity_id.toString(),
                        userid: v.user_id.toString(),
                        tbl_id: v.tbl_id.toString(),
                        type: 'observer',
                    });
                    observerFromLoad(v.user_id.toString(),'#observer'+v.activity_id.toString());
                }
                
                if(v.participant_type === 'assignee'){
                    if(uniqueAssine.indexOf(v.user_id.toString()) == -1){
                        uniqueAssine.push(v.user_id.toString());
                    }
                    
                    addAsAssigneeArr.push({
                        tbl_id: v.tbl_id.toString(),
                        activityid: v.activity_id.toString(),
                        userid: v.user_id.toString(),
                        type: 'assignee',
                    });

                    if(uniqueAssine.indexOf(v.user_id.toString()) == -1){
                        uniqueAssine.push(v.user_id.toString());
                    }

                    if(!$('#taskAssigneeList').find('img[data-uuid="'+v.user_id.toString()+'"]').hasClass('ring')){
                        $('#taskAssigneeList').find('img[data-uuid="'+v.user_id.toString()+'"]').addClass('ring');
                    }

                    assigneeFromLoad(v.user_id.toString(),'#assignee'+v.activity_id.toString());
                    
                }
                
                if(v.participant_type === 'owner'){
                    if(uniqCoowner.indexOf(v.user_id.toString()) == -1){
                        uniqCoowner.push(v.user_id.toString());
                    } 
                    addAsCoOwnerArr.push({
                        tbl_id: v.tbl_id.toString(),
                        activityid: v.activity_id.toString(),
                        userid: v.user_id.toString(),
                        type: 'owner',
                    });

                    coownerFromLoad(v.user_id.toString(),'#coowner'+v.activity_id.toString());
                }
            });

            var ar1 = addAsObsrvrArr.concat(addAsAssigneeArr);
            var ar2 = ar1.concat(addAsCoOwnerArr);

            $.each(ar2, (k,v)=>{
                if(v.userid == user_id){
                    if(createdbyme.indexOf(v.activityid.toString()) > -1){
                        subTaskOwnerAccess(v.activityid.toString());
                    }else{
                        if(v.type == 'coowner'){
                            subTaskOwnerAccess(v.activityid.toString());
                        }else if(v.type == 'observer'){
                            subTaskObserverAccess(v.activityid.toString());
                        }else if(v.type == 'assignee'){
                            subTaskAssigneeAccess(v.activityid.toString());
                        }
                    }
                }
                
            });

            if(customActivityColRes.status != undefined){
                var data = [];
                $.each(customActivityColRes.data,function(k,v){
                    $.each(v,function(kc,vc){
                        data.push(vc);
                    });
                });

                var ascOrder = _.orderBy(customActivityColRes.cols, ['created_at'], ['asc']);
                addNewColDynamic(ascOrder,data);
            }
        }
    }
}

function checkActivityAccessibilities(user_id, settings){

    $('.secLabel').css('visibility','visible');
    if($('#actCre').val() == user_id){
        itsOwner();
        if(settings != undefined){
            setTimeout(
            function() {
                forOwnerSet(settings);
                $('.taskLoaderFull').hide();
                $('.taskLoader2').hide();
                if($("#addTodoCheckList").is(':visible')){
                    $("#addTodoCheckList").focus();
                }
            }, 2000);
            
        }else{
            $('.taskLoaderFull').hide();
            $('.taskLoader2').hide();
            if($("#addTodoCheckList").is(':visible')){
                $("#addTodoCheckList").focus();
            }
        }
        
    }else if(coowner.indexOf(user_id) > -1){
        itsCoOwner();
        if(settings != undefined){
            setTimeout(
                function() {
                    forOwnerSet(settings);
                    $('.taskLoaderFull').hide();
                    $('.taskLoader2').hide();
                    if($("#addTodoCheckList").is(':visible')){
                        $("#addTodoCheckList").focus();
                    }
                }, 2000);
        }else{
            $('.taskLoaderFull').hide();
            $('.taskLoader2').hide();
            if($("#addTodoCheckList").is(':visible')){
                $("#addTodoCheckList").focus();
            }
        }
    }else if(observer.indexOf(user_id) > -1){
        itsObserver();
        if(settings != undefined){
            setTimeout(
                function() {
                    forOwnerSet(settings);
                    $('.taskLoaderFull').hide();
                    $('.taskLoader2').hide();
                }, 2000);
        }else{
            $('.taskLoaderFull').hide();
            $('.taskLoader2').hide();
            if($("#addTodoCheckList").is(':visible')){
                $("#addTodoCheckList").focus();
            }
        }
    }else if(assignee.indexOf(user_id) > -1){
        itsAssignee();
        if(settings != undefined){
            setTimeout(
                function() {
                    forOwnerSet(settings);
                    $('.taskLoaderFull').hide();
                    $('.taskLoader2').hide();
                    if($("#addTodoCheckList").is(':visible')){
                        $("#addTodoCheckList").focus();
                    }
                }, 2000);
        }else{
            $('.taskLoaderFull').hide();
            $('.taskLoader2').hide();
            if($("#addTodoCheckList").is(':visible')){
                $("#addTodoCheckList").focus();
            }
        }
    }
}

function forOwnerSet(settings){
    $.each(settings.settings, (k,v)=>{
        if($("#updateAction").val() == v.activity_id){
            var setValue = (v.setting_val == null ? 0 : v.setting_val);
            if(v.setting_type == "amount"){
                $('#task_b_a_Amount').hide();
                if(setValue == 0){
                    $("#action_amount").attr('data-setval',3);
                    $("#action_amount").attr('data-setid',v.setting_id);
                    $('#action_amount').click();
                    $("#action_amount").attr('data-setval',setValue);
                    $("#action_amount").attr('data-setid',v.setting_id);
                }else{
                    $("#action_amount").attr('data-setval',setValue);
                    $("#action_amount").attr('data-setid',v.setting_id);
                }
            }else if(v.setting_type == "hour"){
                $('#task_e_a_hours').hide();
                if(setValue == 0){
                    $("#action_hour").attr('data-setval',3);
                    $("#action_hour").attr('data-setid',v.setting_id);
                    $('#action_hour').click();
                    $("#action_hour").attr('data-setval',setValue);
                    $("#action_hour").attr('data-setid',v.setting_id);
                }else{
                    $("#action_hour").attr('data-setval',setValue);
                    $("#action_hour").attr('data-setid',v.setting_id);
                }
            }else if(v.setting_type == "desc"){
                if(setValue == 0){
                    $("#actionNoteDesc").attr('data-setval',3);
                    $("#actionNoteDesc").attr('data-setid',v.setting_id);
                    $('#actionNoteDesc').click();
                    $("#actionNoteDesc").attr('data-setval',setValue);
                    $("#actionNoteDesc").attr('data-setid',v.setting_id);
                }else{
                    $("#actionNoteDesc").attr('data-setval',setValue);
                    $("#actionNoteDesc").attr('data-setid',v.setting_id);
                }
            }else{
                if(v.activity_type != "Task"){
                    if(v.activity_type == "freeze"){
                        if(setValue == 0){
                            $("#"+v.setting_type).attr('data-setval',3);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                            $("#"+v.setting_type).click();

                            $('.freezeCol').each((k,v)=>{
                                $(v).attr('data-setval','4');
                                $(v).attr('data-setid',v.setting_id);
                            });
                        }else{
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }
                    }else{
                        if(setValue == 0){
                            $("#"+v.setting_type).attr('data-setval',007);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                            $("#"+v.setting_type).click();
                            
                            if(v.activity_type == 'sort'){
                                $('.dynamicSort').each((k,v)=>{
                                    $(v).attr('data-setval','4');
                                    $(v).attr('data-setid',v.setting_id);
                                });
                            }
                        }else{
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }
                    }
                    
                }else{
                    if(/^collapse/.test(v.setting_type)){

                        var colSplit = v.setting_type.split('_');
                        
                        $('.'+colSplit[1]).find('.expand-column').attr('data-setid',v.setting_id.toString());

                        if(setValue == 0){
                            $("#"+v.setting_type).attr('data-setval',3);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                            $("#"+v.setting_type).click();
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }else{
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }
                    }else if(/^owner_co_owner/.test(v.setting_type)){
                        if(setValue == 0){
                            $("#owner_co_owner").attr('data-setval',3);
                            $("#owner_co_owner").attr('data-setid',v.setting_id);
                            
                            $("#owner_co_owner").click();
                            
                            if($("#owner_co_owner").attr('data-setval') == 3){
                                $("#owner_co_owner").attr('data-setval',setValue);
                                $("#owner_co_owner").attr('data-setid',v.setting_id);
                            }
                        }else{
                            $("#owner_co_owner").attr('data-setval',setValue);
                            $("#owner_co_owner").attr('data-setid',v.setting_id);
                        }
                    }else if(/^set_assignee/.test(v.setting_type)){
                        if(setValue == 0){
                            $("#set_assignee").attr('data-setval',3);
                            $("#set_assignee").attr('data-setid',v.setting_id);
                            
                            $("#set_assignee").click();
                            
                            if($("#set_assignee").attr('data-setval') == 3){
                                $("#set_assignee").attr('data-setval',setValue);
                                $("#set_assignee").attr('data-setid',v.setting_id);
                            }
                        }else{
                            $("#set_assignee").attr('data-setval',setValue);
                            $("#set_assignee").attr('data-setid',v.setting_id);
                        }
                    }else if(/^set_Observer/.test(v.setting_type)){
                        if(setValue == 0){
                            $("#set_Observer").attr('data-setval',3);
                            $("#set_Observer").attr('data-setid',v.setting_id);
                            
                            $("#set_Observer").click();
                            
                            if($("#set_Observer").attr('data-setval') == 3){
                                $("#set_Observer").attr('data-setval',setValue);
                                $("#set_Observer").attr('data-setid',v.setting_id);
                            }
                        }else{
                            $("#set_Observer").attr('data-setval',setValue);
                            $("#set_Observer").attr('data-setid',v.setting_id);
                        }
                    }else if(/^set_dueby/.test(v.setting_type)){
                        if(setValue == 0){
                            $("#set_dueby").attr('data-setval',3);
                            $("#set_dueby").attr('data-setid',v.setting_id);
                            
                            $("#set_dueby").click();
                            
                            if($("#set_dueby").attr('data-setval') == 3){
                                $("#set_dueby").attr('data-setval',setValue);
                                $("#set_dueby").attr('data-setid',v.setting_id);
                            }
                        }else{
                            $("#set_dueby").attr('data-setval',setValue);
                            $("#set_dueby").attr('data-setid',v.setting_id);
                        }
                    }else if(/^set_phase/.test(v.setting_type)){
                        if(setValue == 0){
                            $("#set_phase").attr('data-setval',3);
                            $("#set_phase").attr('data-setid',v.setting_id);
                            
                            $("#set_phase").click();
                            
                            if($("#set_phase").attr('data-setval') == 3){
                                $("#set_phase").attr('data-setval',setValue);
                                $("#set_phase").attr('data-setid',v.setting_id);
                            }
                        }else{
                            $("#set_phase").attr('data-setval',setValue);
                            $("#set_phase").attr('data-setid',v.setting_id);
                        }
                    }else{
                        if(setValue == 0){
                            $("#"+v.setting_type).attr('data-setval',3);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                            $("#"+v.setting_type).click();
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }else{
                            $("#"+v.setting_type).attr('data-setval',setValue);
                            $("#"+v.setting_type).attr('data-setid',v.setting_id);
                        }
                    }
                    
                }
                
            }
        }
        
    });
}

// function itsOwner(){
//     // Disable TODO Name
//     $('.checkbox_container').css('pointer-events','auto');
//     $('#todoTitle').css('pointer-events','auto');
//     $('.rdonlyText.assigntxt').css('display','none');

//     // Disable due date
//     $('.content-wraper .dueDate-input').css('pointer-events','auto');

//     // Disable workspace and status
//     $('.content-wraper .select-workspace').css('pointer-events','auto');
//     $('.content-wraper .select2').css('pointer-events','auto');

//     // Disable owner, observer, assignee div for task
//     $('#taskOwnerList').css('pointer-events','auto');
//     $('#taskObserverList').css('pointer-events','auto');
//     // $("#taskAssigneeList").css('pointer-events', 'auto');

//     if(participatedAssignee.length > 1){
//         $("#taskAssigneeList").css('pointer-events', 'none');
//     }else{
//         $("#taskAssigneeList").css('pointer-events', 'auto');
//     }

//     // Disable budget,est time, est hour, actual hour
//     $('.content-wraper .task_inputs').css('pointer-events','auto');
//     $('.content-wraper .task_actual').css('pointer-events','auto');

//     // Disable Task Description
//     $('.content-wraper .notes_area').css('pointer-events','auto');
//     $('.content-wraper #addTodoTaskDescription').css('pointer-events','auto');
//     $('.content-wraper .no_desc_open').css('pointer-events','auto');

//     // Disable File Browse
//     // $('.content-wraper #actionFileUpload').hide();
//     $('#todoTitle').css('background-color','#ffffff');
//     $('.content-wraper .dueDate-input').css('background-color','#ffffff');
//     $('#taskOwnerList').css('background-color','#ffffff');
//     $('#taskObserverList').css('background-color','#ffffff');
//     $('#taskAssigneeList').css('background-color','#ffffff');
//     $('.content-wraper .task_inputs').css('background-color','#ffffff');
//     $('.content-wraper .select2-selection--single').css('background-color','#ffffff');
//     $('.content-wraper .notes_area').css('background-color','#ffffff');
//     $('.content-wraper #addTodoTaskDescription').css('background-color','#ffffff');
//     $('.content-wraper .no_desc_open').css('background-color','#ffffff');
//     // Disable add sub task input
//     $('.content-wraper .add_st_group').show();
// }

// function itsCoOwner(){
//     // Disable TODO Name
//     $('.checkbox_container').css('pointer-events','auto');
//     $('#todoTitle').css('pointer-events','auto');
//     $('.rdonlyText.assigntxt').css('display','none');
    
//     // Disable due date
//     $('.content-wraper .dueDate-input').css('pointer-events','auto');

//     // Disable workspace and status
//     $('.content-wraper .select-workspace').css('pointer-events','auto');
//     $('.content-wraper .select2').css('pointer-events','auto');

//     // Disable owner, observer, assignee div for task

    

//     $('#taskOwnerList').css('pointer-events','auto');
//     $('#taskObserverList').css('pointer-events','auto');
//     // $("#taskAssigneeList").css('pointer-events', 'auto');
    
//     if(participatedAssignee.length > 1){
//         $("#taskAssigneeList").css('pointer-events', 'none');
//     }else{
//         $("#taskAssigneeList").css('pointer-events', 'auto');
//     }

//     // Disable budget,est time, est hour, actual hour
//     $('.content-wraper .task_inputs').css('pointer-events','auto');
//     $('.content-wraper .task_actual').css('pointer-events','auto');

//     // Disable Task Description
//     $('.content-wraper .notes_area').css('pointer-events','auto');
//     $('.content-wraper #addTodoTaskDescription').css('pointer-events','auto');
//     $('.content-wraper .no_desc_open').css('pointer-events','auto');

//     // Disable File Browse
//     // $('.content-wraper #actionFileUpload').hide();
//     $('#todoTitle').css('background-color','#ffffff');
//     $('.content-wraper .dueDate-input').css('background-color','#ffffff');
//     $('#taskOwnerList').css('background-color','#ffffff');
//     $('#taskObserverList').css('background-color','#ffffff');
//     $('#taskAssigneeList').css('background-color','#ffffff');
//     $('.content-wraper .task_inputs').css('background-color','#ffffff');
//     $('.content-wraper .select2-selection--single').css('background-color','#ffffff');
//     $('.content-wraper .notes_area').css('background-color','#ffffff');
//     $('.content-wraper #addTodoTaskDescription').css('background-color','#ffffff');
//     $('.content-wraper .no_desc_open').css('background-color','#ffffff');
//     // Disable add sub task input
//     $('.content-wraper .add_st_group').show();
// }

// function itsObserver(){

//     $('.checkbox_container').css('pointer-events','none');
//     $('#todoTitle').css('pointer-events','none');
   

//     // Disable due date
//     $('.content-wraper .dueDate-input').css('pointer-events','none');
    

//     // Disable workspace and status
//     $('.content-wraper .select-workspace').css('pointer-events','none');

//     $('.content-wraper .select2').css('pointer-events','none');

//     // Disable owner, observer, assignee div for task
//     $('#taskOwnerList').css('pointer-events','none');
    

//     $('#taskObserverList').css('pointer-events','none');
    

//     $('#taskAssigneeList').css('pointer-events','none');
    

//     $('.rdonlyText.assigntxt').css('display','inline-block');

//     // Disable budget,est time, est hour, actual hour
//     $('.content-wraper .task_inputs').css('pointer-events','none');
    

//     $('.content-wraper .task_actual').css('pointer-events','none');

//     // Disable Task Description
//     $('.content-wraper .notes_area').css('pointer-events','none');
    

//     $('.content-wraper #addTodoTaskDescription').css('pointer-events','none');
    

//     $('.content-wraper .no_desc_open').css('pointer-events','none');
    
//     $('#todoTitle').css('background-color','#f0f0f0');
//     $('.content-wraper .dueDate-input').css('background-color','#f0f0f0');
//     $('#taskOwnerList').css('background-color','#f0f0f0');
//     $('#taskObserverList').css('background-color','#f0f0f0');
//     $('#taskAssigneeList').css('background-color','#f0f0f0');
//     $('.content-wraper .task_inputs').css('background-color','#f0f0f0');
//     $('.content-wraper .select2-selection--single').css('background-color','#f0f0f0');
//     $('.content-wraper .notes_area').css('background-color','#f0f0f0');
//     $('.content-wraper #addTodoTaskDescription').css('background-color','#f0f0f0');
//     $('.content-wraper .no_desc_open').css('background-color','#f0f0f0');

//     // Disable File Browse
//     // $('.content-wraper #actionFileUpload').hide();

//     // Disable add sub task input
//     $('.content-wraper .add_st_group').hide();
//     $('#addnewSub').hide();
   
// }

// function itsAssignee(){
//     // Disable TODO Name
//     $('.checkbox_container').css('pointer-events','none');
//     $('#todoTitle').css('pointer-events','none');
//     $('.rdonlyText.assigntxt').css('display','inline-block');

//     // Disable due date
//     $('.content-wraper .dueDate-input').css('pointer-events','none');

//     // Disable workspace and status
//     $('.content-wraper .select-workspace').css('pointer-events','none');
//     $('.content-wraper .select2').css('pointer-events','none');

//     // Disable owner, observer, assignee div for task
//     $('.content-wraper .share-input').css('pointer-events','none');

//     // Disable budget,est time, est hour, actual hour
//     $('.content-wraper .task_inputs').css('pointer-events','none');
//     $('.content-wraper .task_actual').css('pointer-events','none');

//     // Disable Task Description
//     $('.content-wraper .notes_area').css('pointer-events','none');
//     $('.content-wraper #addTodoTaskDescription').css('pointer-events','none');
//     $('.content-wraper .no_desc_open').css('pointer-events','none');

//     // Disable File Browse
//     // $('.content-wraper #actionFileUpload').hide();
//     $('#todoTitle').css('background-color','#f0f0f0');
//     $('.content-wraper .dueDate-input').css('background-color','#f0f0f0');
//     $('#taskOwnerList').css('background-color','#f0f0f0');
//     $('#taskObserverList').css('background-color','#f0f0f0');
//     $('#taskAssigneeList').css('background-color','#f0f0f0');
//     $('.content-wraper .task_inputs').css('background-color','#f0f0f0');
//     $('.content-wraper .select2-selection--single').css('background-color','#f0f0f0');
//     $('.content-wraper .notes_area').css('background-color','#f0f0f0');
//     $('.content-wraper #addTodoTaskDescription').css('background-color','#f0f0f0');
//     $('.content-wraper .no_desc_open').css('background-color','#f0f0f0');

//     // Disable add sub task input
//     $('.content-wraper .add_st_group').hide();

//     $('#addnewSub').hide();
// }

function subTaskOwnerAccess(activityid){

    // 1st Cell
    $("#pulse_"+activityid).find('.pulse-left-indicator').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.edit-indicator').removeAttr('style');
    $("#pulse_"+activityid).find('.flagIco').removeAttr('style');
    $("#pulse_"+activityid).find('.subtaskAllFile .renameSubtask').show();
    $("#pulse_"+activityid).find('.subtaskAllFile .duplicate').show();
    $("#pulse_"+activityid).find('.subtaskAllFile .deleteSubtask').show();

    // Other Cell
    $("#pulse_"+activityid).find('.WonerCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.coowonerCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.ObserverCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.AssigneeCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.priorityCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.DateCell').attr('disabled','false');
    $("#pulse_"+activityid).find('.com_DateCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.AmountCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.actualCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.varianceCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.timeEstCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.ManHourRateCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.actualHourCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.hourlyRateCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.timevarianceCell').css('pointer-events','auto');
    $("#pulse_"+activityid).find('.StatusCell').css('pointer-events','auto');
    
    // Batch Action
    $("#batchPropertyValue").css('pointer-events','auto');
    $("#batchActionMenu").find('.Duplicate').show();
    $("#batchActionMenu").find('.Export').show();
    $("#batchActionMenu").find('.Archive').show();
    $("#batchActionMenu").find('.Delete').show();
    $("#batchActionMenu").find('.Apply').show();

    // Properties
    $('.st_coWoner').css('pointer-events','auto');
    $('.st_observer').css('pointer-events','auto');
    $('.st_assignee').css('pointer-events','auto');
    $('.st_phase').css('pointer-events','auto');
    $('.st_dDate').css('pointer-events','auto');
    $('.st_bAmount').css('pointer-events','auto');
    $('.st_aAmount').css('pointer-events','auto');
    $('.st_variance').css('pointer-events','auto');
    $('.st_ewHour').css('pointer-events','auto');
    $('.st_ehRate').css('pointer-events','auto');
    $('.st_awHour').css('pointer-events','auto');
    $('.st_ahRate').css('pointer-events','auto');
    $('.st_status').css('pointer-events','auto');
}

function subTaskObserverAccess(activityid){
    // 1st Cell
    $("#pulse_"+activityid).find('.pulse-left-indicator').css('pointer-events','none');
    $("#pulse_"+activityid).find('.edit-indicator').hide();
    $("#pulse_"+activityid).find('.flagIco').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .renameSubtask').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .duplicate').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .deleteSubtask').hide();

    // Other Cell
    $("#pulse_"+activityid).find('.WonerCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.coowonerCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.ObserverCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.AssigneeCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.priorityCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.DateCell input').attr('disabled','true');
    $("#pulse_"+activityid).find('.com_DateCell input').attr('disabled','true');
    $("#pulse_"+activityid).find('.AmountCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.actualCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.varianceCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.timeEstCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.ManHourRateCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.actualHourCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.hourlyRateCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.timevarianceCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.StatusCell').css('pointer-events','none');
    
    // Batch Action
    $("#batchPropertyValue").css('pointer-events','none');
    $("#batchActionMenu").find('.Duplicate').hide();
    $("#batchActionMenu").find('.Export').hide();
    $("#batchActionMenu").find('.Archive').hide();
    $("#batchActionMenu").find('.Delete').hide();
    $("#batchActionMenu").find('.Apply').hide();

    // Properties
    $('.st_coWoner').css('pointer-events','none');
    $('.st_observer').css('pointer-events','none');
    $('.st_assignee').css('pointer-events','none');
    $('.st_phase').css('pointer-events','none');
    $('.st_dDate').css('pointer-events','none');
    $('.st_bAmount').css('pointer-events','none');
    $('.st_aAmount').css('pointer-events','none');
    $('.st_variance').css('pointer-events','none');
    $('.st_ewHour').css('pointer-events','none');
    $('.st_ehRate').css('pointer-events','none');
    $('.st_awHour').css('pointer-events','none');
    $('.st_ahRate').css('pointer-events','none');
    $('.st_status').css('pointer-events','none');

}

function subTaskAssigneeAccess(activityid){
    // 1st Cell
    $("#pulse_"+activityid).find('.pulse-left-indicator').css('pointer-events','none');
    $("#pulse_"+activityid).find('.edit-indicator').hide();
    $("#pulse_"+activityid).find('.flagIco').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .renameSubtask').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .duplicate').hide();
    $("#pulse_"+activityid).find('.subtaskAllFile .deleteSubtask').hide();

    // Other Cell
    $("#pulse_"+activityid).find('.WonerCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.coowonerCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.ObserverCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.AssigneeCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.priorityCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.DateCell input').attr('disabled','true');
    $("#pulse_"+activityid).find('.com_DateCell input').attr('disabled','true');
    $("#pulse_"+activityid).find('.AmountCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.actualCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.varianceCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.timeEstCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.ManHourRateCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.actualHourCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.hourlyRateCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.timevarianceCell').css('pointer-events','none');
    $("#pulse_"+activityid).find('.StatusCell').css('pointer-events','auto');
    
    // Batch Action
    $("#batchPropertyValue").css('pointer-events','none');
    $("#batchActionMenu").find('.Duplicate').hide();
    $("#batchActionMenu").find('.Export').hide();
    $("#batchActionMenu").find('.Archive').hide();
    $("#batchActionMenu").find('.Delete').hide();
    $("#batchActionMenu").find('.Apply').hide();

    // Properties
    $('.st_coWoner').css('pointer-events','none');
    $('.st_observer').css('pointer-events','none');
    $('.st_assignee').css('pointer-events','none');
    $('.st_phase').css('pointer-events','none');
    $('.st_dDate').css('pointer-events','none');
    $('.st_bAmount').css('pointer-events','none');
    $('.st_aAmount').css('pointer-events','none');
    $('.st_variance').css('pointer-events','none');
    $('.st_ewHour').css('pointer-events','none');
    $('.st_ehRate').css('pointer-events','none');
    $('.st_awHour').css('pointer-events','none');
    $('.st_ahRate').css('pointer-events','none');
    $('.st_status').css('pointer-events','auto');
}

function addNewColDynamic(data,dataval){
    var alsosl = $(".include_rule").length+1;
    var include_rule = "";
    $.each(data, function(datak,datav){

        var classNameT = datav.col_title;
        var str = classNameT.replace(/\s/g, '').toLowerCase();
        var activityid = datav.activity_id;
        var createdby = datav.created_by;
        var colid = datav.col_id;

        if(datav.col_type != "Text") {
            include_rule = "include_rule ";
            $("#fildnameli").append("<li data-val='alsonewcol"+colid+"' onclick='addtoformula(event)'>" + datav.col_title + "</li>");
        }
        
        var html =  '<div class="frzHandler column-header newcol '+ str +' '+ include_rule +' amount-header ui-resizable" data-colid="'+datav.col_id+'" data-id="alsonewcol'+colid+'" data-size="flex-basis: 100px" style="flex-basis: 120px;">';
            html+=      '<i class="icon icon-v2-collapse-column expand-column"></i>';
            html+=      '<div class="column-header-inner">';
            html+=          '<div class="dragColumn ui-sortable-handle" style="width: 8px;">';
            html+=              '<span class="drag-handle icon icon-dapulse-drag-2"></span>';
            html+=          '</div>';
            html+=          '<div class="title-wrapper">';
            html+=              '<span class="column-title ">';
            html+=                  '<div class="ds-editable-component  " style="width: auto; height: auto;">';
            html+=                      '<div class="ds-text-component" dir="auto">';
            html+=                          '<svg class="svg-inline--fa fa-lock fa-w-14" id="varianceClass_lock" onclick="lockClick($(this).attr(\'id\'))" aria-hidden="true" data-prefix="fa" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>';
            html+=                          '<svg class="svg-inline--fa fa-eye-slash fa-w-18" id="varianceClass_eye" aria-hidden="true" data-prefix="fa" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M286.693 391.984l32.579 46.542A333.958 333.958 0 0 1 288 440C168.19 440 63.031 376.051 6.646 280.369a47.999 47.999 0 0 1 0-48.739c24.023-40.766 56.913-75.775 96.024-102.537l57.077 81.539C154.736 224.82 152 240.087 152 256c0 74.736 60.135 135.282 134.693 135.984zm282.661-111.615c-31.667 53.737-78.747 97.46-135.175 125.475l.011.015 41.47 59.2c7.6 10.86 4.96 25.82-5.9 33.42l-13.11 9.18c-10.86 7.6-25.82 4.96-33.42-5.9L100.34 46.94c-7.6-10.86-4.96-25.82 5.9-33.42l13.11-9.18c10.86-7.6 25.82-4.96 33.42 5.9l51.038 72.617C230.68 75.776 258.905 72 288 72c119.81 0 224.969 63.949 281.354 159.631a48.002 48.002 0 0 1 0 48.738zM424 256c0-75.174-60.838-136-136-136-17.939 0-35.056 3.473-50.729 9.772l19.299 27.058c25.869-8.171 55.044-6.163 80.4 7.41h-.03c-23.65 0-42.82 19.17-42.82 42.82 0 23.626 19.147 42.82 42.82 42.82 23.65 0 42.82-19.17 42.82-42.82v-.03c18.462 34.49 16.312 77.914-8.25 110.95v.01l19.314 27.061C411.496 321.2 424 290.074 424 256zM262.014 356.727l-77.53-110.757c-5.014 52.387 29.314 98.354 77.53 110.757z"></path></svg>';
            html+=                          '<span contenteditable="true" class="editableCon">'+ datav.col_title +'</span>';
            html+=                      '</div>';
            html+=                  '</div>';
            html+=              '</span>';
            html+=          '</div>';
            // html+=          '<div class="drop-menu-wrapper header_menu_btn" onclick="openDropMenu(\'varianceDropDownMenu\')">';
            // html+=              '<svg class="svg-inline--fa fa-caret-down fa-w-10 dropDown" aria-hidden="true" data-prefix="fa" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
            // html+=          '</div>';
            html+=          '<div class="col_permission_setting">';
            html+=              '<h3 class="permission_pop_title">Who can view this column</h3>';
            html+=              '<input class="search_persion_input" type="text" placeholder="Entre a person name">';
            html+=              '<div class="s_userlist"></div>';
            html+=              '<div class="granted_person_list">';
            html+=              '</div>';
            html+=          '</div>';
            html+=          '<div class="dialog-node" id="varianceDropDownMenu" style="display: none;">';
            html+=              '<div class="column-menu-dialog-wrapper">';
            html+=                  '<span class="column-menu-patch"></span>';
            html+=                  '<div class="ds-menu-inner">';
            html+=                      '<div class="ds-menu-section ">';
            html+=                          '<div class="ds-menu-item" onclick="collapse(event,this)">';
            html+=                              '<div class="ds-icon"><i class="icon icon-v2-collapse-column"></i></div>';
            html+=                              '<span class="ds-title">Collapse Column</span>';
            html+=                          '</div>';
            html+=                      '<div class="inner_menu" id="VarianceInner">';
            html+=                          '<div class="ds-menu-item" onclick="restrict(\'varianceClass\')">';
            html+=                              '<div class="ds-icon"><svg class="svg-inline--fa fa-lock fa-w-14" aria-hidden="true" data-prefix="fa" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>';
            html+=                              '</div>';
            html+=                              '<span class="ds-title">Restrict column edit</span>';
            html+=                          '</div>';
            html+=                          '<div class="ds-menu-item" onclick="restrictColumnView(\'varianceClass\')">';
            html+=                              '<div class="ds-icon"><svg class="svg-inline--fa fa-eye-slash fa-w-18" aria-hidden="true" data-prefix="fa" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M286.693 391.984l32.579 46.542A333.958 333.958 0 0 1 288 440C168.19 440 63.031 376.051 6.646 280.369a47.999 47.999 0 0 1 0-48.739c24.023-40.766 56.913-75.775 96.024-102.537l57.077 81.539C154.736 224.82 152 240.087 152 256c0 74.736 60.135 135.282 134.693 135.984zm282.661-111.615c-31.667 53.737-78.747 97.46-135.175 125.475l.011.015 41.47 59.2c7.6 10.86 4.96 25.82-5.9 33.42l-13.11 9.18c-10.86 7.6-25.82 4.96-33.42-5.9L100.34 46.94c-7.6-10.86-4.96-25.82 5.9-33.42l13.11-9.18c10.86-7.6 25.82-4.96 33.42 5.9l51.038 72.617C230.68 75.776 258.905 72 288 72c119.81 0 224.969 63.949 281.354 159.631a48.002 48.002 0 0 1 0 48.738zM424 256c0-75.174-60.838-136-136-136-17.939 0-35.056 3.473-50.729 9.772l19.299 27.058c25.869-8.171 55.044-6.163 80.4 7.41h-.03c-23.65 0-42.82 19.17-42.82 42.82 0 23.626 19.147 42.82 42.82 42.82 23.65 0 42.82-19.17 42.82-42.82v-.03c18.462 34.49 16.312 77.914-8.25 110.95v.01l19.314 27.061C411.496 321.2 424 290.074 424 256zM262.014 356.727l-77.53-110.757c-5.014 52.387 29.314 98.354 77.53 110.757z"></path></svg>';
            html+=                              '</div>';
            html+=                              '<span class="ds-title">Restrict column view</span>';
            html+=                          '</div>';
            html+=                      '</div>';
            html+=                  '</div>';
            html+=              '</div>';
            html+=          '</div>';
            html+=      '</div>';
            html+=      '<div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>';
            html+=  '</div>';
          
          $(".group-header-component .column-header:last").after(html);

          $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(k,v){
            if($(v).attr("id") != "addnewSub" && $(v).attr("id") != "varienceRow"){
                var newcol_length = $(v).find('.newcolCell').length;
                var subActiID = $(v).find('.name-cell .pulse_title').attr('data-id');
                html = '<div id="newcol'+k+'_'+newcol_length+'" class="cell-component numeric-cell newcolCell alsonewcol'+colid+'" style="flex-basis: 120px;">';
                
                html+= colType(datav.col_type,str,subActiID,createdby,colid,datav.col_formula); 
                html+= '</div>';
                $(v).find('.cell-component:last').after(html);

                enabletime();
                subtaskdate();
                keypressBlur();
                countSubtask();
                onDynamicFire();
                tooltipforToDo();
            }
        });
        
        //This section for adding cell for last row 
        // start //
        var design ='   <div class="cell-component" style="flex-basis: 120px;background: #ffffff;">';
            design +='  </div>';
        $("#varienceRow").find('.cell-component:last').after(design);
        $("#addnewSub").find('.cell-component:last').after(design);

        addMenuExtend(classNameT);
    });


    if(dataval != undefined){
        customColValuSet(dataval);
    }
}

function customColValuSet(data){
    $.each(data, function(datak,datav){
        var obj = datav.activity_id+'_'+datav.col_id;
        if($("#"+obj).is(':visible')){
            $("#"+obj).text(datav.col_value);
            $("#"+obj).addClass('hasVal');
            $("#"+obj).attr('data-colid',datav.id);
        }
    });
}

function addMenuExtend(str){
    var design = '<div class="column-menu-item active" data-name="'+ str.replace(/\s/g, '').toLowerCase() +'" onclick="column_menu_item(event)">';
        design += '<div class="ds-menu-item">';
        design += '  <div class="ds-icon">';
        design += '    <i class="fa fa-align-justify"></i>';
        design += '  </div>';
        design += '  <span class="ds-title">'+str+'</span>';
        design += '  <i class="fas fa-check"></i>';
        design += '</div>';
        design += '</div>';
    
    $('#custom_toDoMoreOptionView .addNewColCon').before(design);
}

function colType(col_type,title,activityid,createdby,colid,formula){
    var result = "";
    switch(col_type){
        case 'Text':
                    result = textCellDesign(title,activityid,createdby,colid);
                    break;
        case 'Number':
                    result =  numberCellDesign(title,activityid,createdby,colid);
                    break;
        case 'Formula':
                    result =  formulaCellDesign(title,activityid,createdby,colid,formula);
                    break;
    }
    
    return result;
}

function numberCellDesign(title,activityid,createdby,colid){
    var design = '<div class="numeric-cell-component">';
        design += '  <div class="ds-editable-component  " style="width: 100%; height: 25px;">';
        design += '    <div class="ds-text-component" dir="auto">';
        design += '      <span contenteditable="true" onkeydown="onInputValue(event)"  onblur="amountInputBlur(this)" class="amountInputValue '+title+'Span customcol" id="'+activityid+'_'+colid+'"  data-activityid="'+activityid+'" data-colid="" data-id="'+colid+'" data-createdby="'+createdby+'">0</span>';
        design += '    </div>';
        design += '  </div>';
        design += '</div>';
    return design;
}

function textCellDesign(title,activityid,createdby,colid){
    var design = '<div class="numeric-cell-component">';
        design += '  <div class="ds-editable-component  " style="width: 100%; height: 25px;">';
        design += '    <div class="ds-text-component" dir="auto">';
        design += '      <span contenteditable="true" onkeydown="onInputValue(event)"  onblur="amountInputBlur(this)" class="amountInputValue '+title+'Span customcol" id="'+activityid+'_'+colid+'"  data-activityid="'+activityid+'" data-colid="" data-id="'+colid+'" data-createdby="'+createdby+'">0</span>';
        design += '    </div>';
        design += '  </div>';
        design += '</div>';
    return design;
}

function formulaCellDesign(title,activityid,createdby,colid,col_formula){
    var formula = col_formula.split('@');
    var result = "";
    $.each(formula, function(fk, fv){
        if(fv.indexOf("also") != -1) {
            var a = $("#pulse_"+activityid).find('.'+fv);
            if($(a).find('.timeInputValue, .amountInputValue').text() == ""){
                result += '0';
            }else{
                result += $(a).find('.timeInputValue, .amountInputValue').text().replace(' h', '');
            }
            
        }else if(fv == "%")
            result += "/100";
        else result += fv;
    });

    
    try {
        var finalresult = eval(result);
        var design = '<div class="numeric-cell-component">';
            design += '  <div class="ds-editable-component  " style="width: 100%; height: 25px;">';
            design += '    <div class="ds-text-component" dir="auto">';
            design += '      <span onkeydown="onInputValue(event)"  onblur="amountInputBlur(this)" class="amountInputValue '+title+'Span customcol" id="'+activityid+'_'+colid+'"  data-activityid="'+activityid+'" data-formula="'+col_formula+'" data-colid="" data-id="'+colid+'" data-createdby="'+createdby+'">'+finalresult+'</span>';
            design += '    </div>';
            design += '  </div>';
            design += '</div>';
        return design;
    } catch (e) {
        var design = '<div class="numeric-cell-component">';
            design += '  <div class="ds-editable-component  " style="width: 100%; height: 25px;">';
            design += '    <div class="ds-text-component" dir="auto">';
            design += '      <span onkeydown="onInputValue(event)"  onblur="amountInputBlur(this)" class="amountInputValue '+title+'Span customcol" id="'+activityid+'_'+colid+'"  data-activityid="'+activityid+'" data-formula="'+col_formula+'" data-colid="" data-id="'+colid+'" data-createdby="'+createdby+'">0</span>';
            design += '    </div>';
            design += '  </div>';
            design += '</div>';
        return design;
    }
}

function assigneeFromLoad(id,eve){
    $(eve).find('.person-bullet-image.demo_img').remove()
    var target = $(eve).find('.person-bullet-image');
    if(target.length > 0){
        // var info = findObjForUser(id);
        // $(eve).find('.person-bullet-component .more_observer').show();
        // var dd = $(eve).find('.person-bullet-component .more_observer').text().split(' ');
        // if(dd[0] != ''){
        //     $(eve).find('.person-bullet-component .more_observer').text("+ "+ (parseInt(dd[1])+1));
        // }else{
        //     $(eve).find('.person-bullet-component .more_observer').text("+ "+ (target.length-2));
        // }
        
     }else{
        var info = findObjForUser(id);
        $(eve).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="'+info.fullname+'" alt="'+info.fullname+'">');
        $(eve).find('.person-bullet-component .more_observer').hide();
    }

}

function observerFromLoad(id,eve){
    $(eve).find('.person-bullet-image.demo_img').remove();
    var target = $(eve).find('.person-bullet-image');
    if(target.length > 2){
        var info = findObjForUser(id);

        $(eve).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="'+info.fullname+'" alt="'+info.fullname+'" style="display:none">');
        $(eve).find('.person-bullet-component .more_observer').show();
        var dd = $(eve).find('.person-bullet-component .more_observer').text().split(' ');
        if(dd[0] != ''){
            $(eve).find('.person-bullet-component .more_observer').text("+ "+ (parseInt(dd[1])+1));
        }else{
            $(eve).find('.person-bullet-component .more_observer').text("+ "+ (target.length-2));
        }
     }else{
        var info = findObjForUser(id);
        $(eve).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="'+info.fullname+'" alt="'+info.fullname+'">');
        $(eve).find('.person-bullet-component .more_observer').hide();
    }
}

function coownerFromLoad(id,eve){
    $(eve).find('.person-bullet-image.demo_img').remove();
    var target = $(eve).find('.person-bullet-image');

    
    if(target.length > 2){
        var info = findObjForUser(id);
        $(eve).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="'+info.fullname+'" alt="'+info.fullname+'" style="display:none">');
        $(eve).find('.person-bullet-component .more_observer').show();
        var dd = $(eve).find('.person-bullet-component .more_observer').text().split(' ');
        if(dd[0] != ''){
            $(eve).find('.person-bullet-component .more_observer').text("+ "+ (parseInt(dd[1])+1));
        }else{
            $(eve).find('.person-bullet-component .more_observer').text("+ "+ (target.length-2));
        }
     }else{
        var info = findObjForUser(id);
        $(eve).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="'+info.fullname+'" alt="'+info.fullname+'">');
        $(eve).find('.person-bullet-component .more_observer').hide();
    }
}

function ownerDraw(user_list,data){

    if (coowner.indexOf(data.id) == -1) {
        coowner.push(data.id);
    }

    $.each(user_list, function (ky, va) {
        userlistWithnameB[va.id] = va.fullname;
        if ($('#actCre').val() !== va.id) {
            if (va.id == data.id) {
                currentMemberList3.push(va.id);
                if (sharedMemberList.indexOf(va.id) == -1) {
                    sharedMemberList.push(va.id);
                    $(".count_member").text('' + sharedMemberList.length + ' members');
                    $(".customToolTip").append('<span>'+findObjForUser(va.id).fullname+'</span><br>');
                }
                if (currentMemberList3.length < 4) {
                    $('#taskOwnerList .count_plus').before('<img src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + '">');
                    viewMemberImg.push(va.id);
                }

                if (currentMemberList3.length > 3) {
                    $('#taskOwnerList .count_plus').show();
                    $('#taskOwnerList .count_plus').text('+' + (currentMemberList3.length - 3));
                }    
                $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+va.fullname+'</span>');
            }
        }
    });

    suggestedUserList();
}

function observerDraw(user_list,data){
    if (observer.indexOf(data.id.toString()) == -1) {
        observer.push(data.id.toString());
    }

    $.each(user_list, function (ky, va) {
        userlistWithname[va.id] = va.fullname;
        if ($('#actCre').val() !== va.id) {
            if (va.id == data.id.toString()) {
                currentMemberList.push(va.id);
                if (sharedMemberList.indexOf(va.id) == -1) {
                    sharedMemberList.push(va.id);
                    $(".count_member").text('' + sharedMemberList.length + ' members');
                    $(".customToolTip").append('<span>'+findObjForUser(va.id).fullname+'</span><br>');
                }

                if (currentMemberList.length < 4) {
                    $('#taskObserverList .count_plus').before('<img src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="observers memberImg' + va.id + '">');
                    viewMemberImg.push(va.id);
                }

                if (currentMemberList.length > 3) {
                    $('#taskObserverList .count_plus').show();
                    $('#taskObserverList .count_plus').text('+' + (currentMemberList.length - 3));
                }    
                $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+va.fullname+'</span>');
            }
        }
    });

    suggestedUserList();
}

function coownerOnDlt(){
    $('#taskOwnerList img').remove();
    // $('#taskOwnerList .count_plus').hide();
    $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').html('');
    var currentImage = [];
    if (!validate.isEmpty($('#actCre').val())) {
        var v = $('#actCre').val();
        sharedMemberList.push(v);
        currentMemberList3.push(v);
        currentImage.push(v);
        $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + findObjForUser(v).id + '" class="sharedIMG memberImg' + findObjForUser(v).id + ' ownerThisToDo">');
        $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
    }
    $.each(coowner,(k,v)=>{
        if (sharedMemberList.indexOf(v) == -1) {
            sharedMemberList.push(v);
        }
        currentImage.push(v);
        if(currentImage.length < 4){
            $('#taskOwnerList .count_plus').before('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="assignees memberImg' + v + '">');
        }
        if (currentImage.length > 3) {
            $('#taskOwnerList .count_plus').show();
            $('#taskOwnerList .count_plus').text('+' + (currentImage.length - 3));
        }
        $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
    });

    if(coowner.length > 0){
        $('#taskOwnerList').attr('placeholder', '');
    }else{
        $('#taskOwnerList').attr('placeholder', 'Add Assignee');
    }
}

function observerOnDlt(){
    // $('#taskObserverList img').remove();
    // $('#taskObserverList .count_plus').hide();
    $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').html('');
    var currentImage = [];
    $.each(observer,(k,v)=>{
        if (sharedMemberList.indexOf(v) == -1) {
            sharedMemberList.push(v);
        }
        currentImage.push(v);
        if(currentImage.length < 4){
            $('#taskObserverList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="assignees memberImg' + v + '">');
        }
        if (currentImage.length > 3) {
            $('#taskObserverList .count_plus').show();
            $('#taskObserverList .count_plus').text('+' + (currentImage.length - 3));
        }
        $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
    });

    if(observer.length > 0){
        // $('#taskObserverList').attr('placeholder', '');
    }else{
        $('#taskObserverList').attr('placeholder', 'Add Observer');
    }
}

function assigneeOnDlt(){
    // $('#taskAssigneeList img').remove();
    // $('#taskAssigneeList .count_plus').hide();
    $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').html('');
    var currentImage = [];
    $.each(assignee,(k,v)=>{
        if (sharedMemberList.indexOf(v) == -1) {
            sharedMemberList.push(v);
        }
        currentImage.push(v);
        if(currentImage.length < 4){
            $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="assignees memberImg' + v + '">');
        }
        if (currentImage.length > 3) {
            $('#taskAssigneeList .count_plus').show();
            $('#taskAssigneeList .count_plus').text('+' + (currentImage.length - 3));
        }
        $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
    });

    if(assignee.length == 0){
        $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
        participatedAssignee = [];
        $("#taskAssigneeList").css('pointer-events', 'auto');
    }else if(assignee.length == 1){
        // $('#taskAssigneeList').attr('placeholder', '');
        $("#taskAssigneeList").css('pointer-events', 'auto');
    }else if(assignee.length > 1){
        // $('#taskAssigneeList').attr('placeholder', '');
        $("#taskAssigneeList").css('pointer-events', 'none');
    }
}

function assigneeDraw(user_list,data){
    if (assignee.indexOf(data.id.toString()) == -1) {
        assignee.push(data.id.toString());
    }

    $.each(user_list, function (ky, va) {
        userlistWithnameA[va.id] = va.fullname;
        if ($('#actCre').val() !== va.id) {
            if (va.id == data.id.toString()) {
                currentMemberList2.push(va.id);
                if (sharedMemberList.indexOf(va.id) == -1) {
                    sharedMemberList.push(va.id);
                    $(".count_member").text('' + sharedMemberList.length + ' members');
                    $(".customToolTip").append('<span>'+findObjForUser(va.id).fullname+'</span><br>');
                }
                if (currentMemberList2.length < 4) {
                    $('#taskAssigneeList .count_plus').before('<img src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="assignees memberImg' + va.id + '">');
                    viewMemberImg.push(va.id);
                }

                if (currentMemberList2.length > 3) {
                    $('#taskAssigneeList .count_plus').show();
                    $('#taskAssigneeList .count_plus').text('+' + (currentMemberList2.length - 3));
                }

                $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+va.fullname+'</span>');
            }
        }
    });
    suggestedUserList();
}

function participantsDraw(participants){

    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    
    currentMemberList3 = [];
    userlistWithname = {};
    userlistWithnameA = {};
    userlistWithnameB = {};

    $('#coownerPeopleList').show();
    // $('#taskOwnerList .count_plus').hide();

    // $('#taskAssigneeList img').remove();
    // $('#taskAssigneeList .count_plus').hide();
    // $('#taskAssigneeList').attr('placeholder', '');

    $('#observerPeopleList').show();
    // $('#taskObserverList img').remove();
    // $('#taskObserverList .count_plus').hide();
    // $('#taskObserverList').attr('placeholder', '');

    if(participants.length > 0){
        $.each(participants, function (ky, va) {
            taskParticipants.push(va);
            switch(va.type){
                case 'owner'    : 
                                participatedOwner.push(va.tbl_id);
                                if (coowner.indexOf(va.id.toString()) == -1) {
                                    coowner.push(va.id.toString());
                                }
                                coownerOnDlt();
                                break;

                case 'observer' : 
                                participatedObserver.push(va.tbl_id);
                                if (observer.indexOf(va.id.toString()) == -1) {
                                    observer.push(va.id.toString());
                                }
                                observerOnDlt();
                                break;

                case 'assignee' : 
                                participatedAssignee.push(va.tbl_id);
                                assigneeWithTblId[va.id] = va.tbl_id;
                                if (assignee.indexOf(va.id.toString()) == -1) {
                                    assignee.push(va.id.toString());
                                }
                                assigneeOnDlt();
                                break;
            }
        });

        if(participatedAssignee.length > 1){
            $("#taskAssigneeList").css('pointer-events', 'none');
        }else{
            $("#taskAssigneeList").css('pointer-events', 'auto');
        }
    }

}

function isNumberKey(evt){

    if(evt.target.className == 'durationTime'){
        saveDuration(evt);
    }else if(evt.target.className == 'ammount'){
        saveamount(evt);
    }
}

function setStatus(id,title){
    var toDoCreateAt = $("#st_status_ul_"+id).attr('data-cid');
    socket.emit('toodoUpdate', {
        targetID: id,
        type: 'sub_status',
        contain: title ,
        clusteringkey: toDoCreateAt
    },
    function (confirmation) {
        $("#st_status_"+id).val(title);
        $('.status_lists').hide();
    });
}

function saveDuration(evt){
    var toDoCreateAt = $(evt.target).attr('data-cid');
    socket.emit('toodoUpdate', {
        targetID: $(evt.target).attr('data-sid'),
        type: 'duration',
        contain: parseInt($(evt.target).val()) ,
        clusteringkey: toDoCreateAt
    },
    function (confirmation) {
        console.log(confirmation);
    });
}

function saveNote(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 13){
        var toDoCreateAt = $(evt).attr('data-cid');
        socket.emit('toodoUpdate', {
            targetID: $(evt).attr('data-sid'),
            type: 'subtask_note',
            contain: $(evt).val() ,
            clusteringkey: toDoCreateAt
        },
        function (confirmation) {
            console.log(confirmation);

        });
    }else{
        return false;
    }
}

function saveamount(evt){
    var toDoCreateAt = $(evt.target).attr('data-cid');
    socket.emit('toodoUpdate', {
        targetID: $(evt.target).attr('data-sid'),
        type: 'ammoount',
        contain: parseInt($(evt.target).val()) ,
        clusteringkey: toDoCreateAt
    },
    function (confirmation) {
        console.log(confirmation);
    });
}

function deleteDraftActivity(params) {
    var toDoCreateAt = $('#activityCreatedAt').val();
    socket.emit('toodoUpdate', {
        targetID: params,
        type: 'delete_to_do',
        contain: 0,
        clusteringkey: toDoCreateAt
    },
    function (confirmation) {

        closeAllPopUp();

        var numrelated = $('.side_bar_list_item > li:visible').length;

        if (numrelated == 0) {
            createNewTodo();
        } else {
            if ($('#activity_' + params).hasClass('activeTodo')) {
                $('#activity_' + params).remove();
                $('#unpinTodoList li:first').click();
            } else {
                $('#activity_' + params).remove();
            }
        }

    });
}

$(document).ready(function() { 
    $('.toDoName').each((k,v)=>{
        if(taskTitleArr.indexOf($(v).text().toLowerCase().trim())== -1){
            taskTitleArr.push($(v).text().toLowerCase().trim());
        }
    });
});

// function createNewActivity(){

//     //create activity obj from Activity class
//     const activity = new Activity();

//     activity.activityTitle            = $("#todoTitle").val();
//     activity.activityEcosystem        = $("#selectWorkspace").val();
//     activity.activityStatus           = $("#taskStatusSelect").val();
//     activity.activityDueDate          = $("#dueDatePicker").val();
//     activity.activityNotesArea        = $("#notes_area").val();
//     activity.activityFfrom            = $("#timeFrom").val();
//     activity.activityTo               = $("#timeTo").val();
//     activity.activityReminder         = $("#ReminderTime").val();
//     activity.activityBudgeAmount      = $("#taskBAinput").val();
//     activity.activityActualAmount     = $("#taskAAinput").val();
//     activity.activityEstHour          = $("#taskEHinput").val();
//     activity.activityEstHourRate      = $("#taskEHRinput").val();
//     activity.activityActualHour       = $("#taskAHinput").val();
//     activity.activityActualHourRate   = $("#taskAHRinput").val();
//     activity.activityType             = 'Task';
//     activity.activityCreatedBy        = user_id;
//     activity.participantsArry         = participants;
//     activity.activityHasRoot          = null;
//     activity.activityRootId           = null;

//     var activityCreatedBy = (!validate.isEmpty(activity.activityCreatedBy) ? true : false);

//     var titleWarning = (!validate.isEmpty($("#todoTitle").val()) ? true : warningBorder('todoTitle'));
//     var ecoWarning = (!validate.isEmpty($("#selectEcosystem").val()) ? true : warningBorder('selectEcosystem'));
//     var staWarning = (!validate.isEmpty($("#taskStatusSelect").val()) ? true : warningBorder('taskStatusSelect'));
    
//     if(activityCreatedBy){
//       if(titleWarning){
//         if( validate.isBoolean(ecoWarning) && validate.isBoolean(staWarning) ){
//             if(taskTitleArr.indexOf( $("#todoTitle").val().toLowerCase().trim())== -1){
//                 activity.saveActivity((response)=>{
//                     if(!validate.isEmpty(response)){
//                         if (response.status) {
//                             $('#toDoCheckListContainer').css('display', 'block');
//                             $('#sharePeopleList').css('display', 'block');
//                             $('.item_progress').css('display', 'flex');
//                             $('.new-added-check-list').css('display', 'block');
//                             $('.button-section').css('display', 'none');

//                             taskTitleArr.push($("#todoTitle").val().toLowerCase().trim());
                            
//                             $("#updateAction").val(response.activity_id);
//                             let seclabel = '<div class="secLabel" style="position: absolute;height: 18px;bottom: 2px;visibility:hidden">'+
//                             '<p id="totalTask" onclick="totalSubTask()" style="float: right;margin-right: 7px;cursor: pointer;border-left: 2px solid #d8d8d8;padding-left: 7px;">0 Subtask(s)</p>'+
//                             '<div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: -58px" id="TST"></div>'+
//                             '  <p id="totalTaskMember" onclick="totalTaskMember()" style="float: right;margin-right: 7px;cursor: pointer;margin-left: 7px;border-left: 2px solid #d8d8d8;padding-left: 7px;">1 Member(s)</p>'+
//                             '  <div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: 16px" id="TTM"></div>'+
//                             '  <span id="taskCreated_By"style="line-height: 17px;"></span>'+
//                             '  <span id="taskCreated_At"style="line-height: 17px;"></span>'+
//                             '  <span id="taskCreated_At_time" style="margin-left:5px;line-height: 17px;"></span>'+
//                             '</div>';
//                             $('#todoTitle + .secLabel').remove();
//                             $(seclabel).insertAfter('#todoTitle');
    
//                             var liDesign = '<li id="activity_' + response.activity_id + '" data-activityid="' + response.activity_id + '" class="com-t-l todoLink activeTodo n_td" data-urm="0" onclick="startToDo(event)"><span class="toDo"></span><span class="toDoName">' + $("#todoTitle").val() + '</span><span class="remove" onclick="hideThisTodo(event, \''+response.activity_id +'\')"></span></li>';
//                             $('#unpinTodoList').prepend(liDesign);
//                             $("#n_ToDo_item").remove();
//                             $("#activity_" + response.activity_id).trigger('click');
//                             task_join_into_room();
//                         }else{
//                             console.log("Something wrong with DB",response);
//                         }
//                     }else{
//                         console.log("Something wrong with DB",response);
//                     }
//                 });
//             }else{
//                 toastr['warning']($("#todoTitle").val()+' already in your tasklist', 'Warning');
//                 $("#todoTitle").val('').focus();
//             }
            
//         }else{
//           console.log("Data missing");
//         }
//       }
      
//     }else{
//       console.log("User Id is not defined");
//     }
//   };

function warningBorder(ele){
    $("#"+ele).css('border','1px solid red');
    return false;
}

// function createNewTodo() {

//     $('.createTaskPopUp').show();
    
//     $('.tooltipspan').html('');
//     $('.taskLoaderFull').hide();
//     $('.workspaceform').show();
//     $('.taskLoader2').hide();
//     $("#dueDatePickerDiv").datepicker().datepicker("setDate", new Date());
//     $('#addTaskContainer').hide();
//     taskShowHideElement(false);
//     $('#addTodoCheckList').parents('.centered').hide();
//     $('#fpc_corner-button').text('Owner');
//     checklistiTEM = [];
//     viewMemberImg = [];
//     $('#taskObserverList').attr('placeholder','Add Observer');
//     $('#taskAssigneeList').attr('placeholder','Add Assignee');
//     $('.group-input .count_plus').hide();


//     var liDesign = '<li class="todoLink activeTodo newTodo selected" id="n_ToDo_item"><span class="toDo"></span><span class="toDoName">New Task</span></li>';
//     var headDesign = '<label class="checkbox_container"><input id="amazonWishlist" type="checkbox"><span class="checkmark"></span></label >'+
//                      '<textarea class="edit-todo-name" type="textarea" maxlength="128" value="" id="todoTitle" placeholder="New Task" autofocus></textarea>';

//     if (!$('.side_bar_list_item li.newTodo').is(':visible')) {
//         $('.side_bar_list_item li').removeClass('activeTodo');
//         $('.inputGroup2').css({ 'pointer-events': 'auto', 'display': 'block' })
//         $('#toDoCheckListContainer').css('display', 'block');
//         $('.item_progress').css('display', 'flex');
//         $('.item_progress .progress').css('width', '0%');
//         $(".progress_status").text("0%");
//         $('.item_list').css({
//             'min-height': '51px',
//             'max-height': '285px'
//         });
//         $('.edit-todo-name').css('height', '32px');
//         $('.to_do_head_left').css('margin', '22px 0px');
//         $('.to_do_head_left>label').css('top', '5px');
//         $('.button-section').css('display', 'block');
//         $('#sharePeopleList span').hide();
//         $('#toDoName').html('');
//         $('.sharedIMG').remove();
//         $('.count_owner').hide();
//         $('#chat_icon').hide();
        
//         //  ..........  //
//         $('.add-check-list').hide();
//         $('.item_progress').hide();
//         $('.group-header-wrapper').hide();
//         $('.pulse-component-wrapper').hide();
//         $(".pulse-component:not(#OnlyForClone)").remove();
//         //  ..........  //

//         $('.ownerThisToDo').remove();
//         $("#notes_area").val('');
//         $(".side_bar_list_item li").removeClass('selected');
//         $('#toDoName').append(headDesign);
//         $('#unpinTodoList').prepend(liDesign);
//         $('#actCre').val('0');
//         $('#addTodoCheckList').removeAttr('disabled');
//         $('#addTodoCheckList').val('');
//         $("#updateAction").val('0');
//         $(".suggested-list").html('');
//         $("#viewUploadFileviewUploadFile").html('');
//         $("#viewUploadFileviewUploadFile").hide();


//         sharedMemberList = [];
//         viewMemberImg = [];
//         currentMemberList = [];

//         participants = [];

//         observer = [];
//         assignee = [];
//         coowner = [];

//         $('#updateTaskListBtn').hide();
//         $('#addActivitAdminBtn').show();

//         $('#actCre').val(user_id);
//         suggestedUserList();
//         $('.to_do_container').show();
//         $('#chat_icon').attr('data-activity_id', '');
//         $("#amazonWishlist").attr('disabled', false);
//         $("#todoTitle").css('pointer-events', 'auto');
//         $("#selectWorkspace").css('pointer-events', 'auto');
//         $("#dueDatePicker").css('pointer-events', 'auto');
//         $("#notes_area").css('pointer-events', 'auto');
//         $("#chat_icon").css('pointer-events', 'none');
//         $("#tagged_area").css('pointer-events', 'none');
//         $(".flag").css('pointer-events', 'none');
//         $("#toDoPinUnpinDiv").css('pointer-events', 'none');
//         $(".more").css('pointer-events', 'none');
//         $("#notes_area").attr('placeholder', 'Write a short description...');
//         $('.inputGroup2').show();
        
//         $("#taskOwnerList img").remove();
//         $("#taskObserverList img").remove();
//         $("#taskAssigneeList img").remove();

//         // $('#taskOwnerList .count_plus').hide();
//         $('#taskOwnerList .count_plus').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + user_img + '" data-uuid="' + user_id + '" class="ownerThisToDo">');
        
//         currentMemberList.push(user_id);
//         sharedMemberList.push(user_id);
//         viewMemberImg.push(user_id);
        
//         $('#sharePeopleList').show();
//         $('#chat_icon').attr('data-activity_id', '');
//         $("#cancel-btn").attr('onclick', 'closeRightSection()');
//         designForUsers('admin');

    
//     } else {
//         $('.side_bar_list_item li.newTodo').click();
//     }
//     // $('#closeNewToDO').show();
//     $("#todoTitle").focus();
//     if(numrelated > 0){
//         allKeyUp();
//     }
//     numrelated = $('.side_bar_list_item > li:visible').length

//     $('#taskStatusSelect').val('Initiate').trigger('change'); 
//     $("#taskStatusSelect").css('pointer-events','auto');
//     $(".task_status .rdonlyDiv").css('display','none');
//     $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','auto');
//     hideAllToggleInput();
// }

function closeRightSection() {
    if($('#n_ToDo_item').is(':visible')){
        var liNum = $('.side_bar_list_item > li:not(.newTodo):visible').length;
        console.log(liNum);
        if (liNum > 0) {
            $("#activity_" + getCookie('lastActive')).trigger('click');
            $(".button-section").hide();
        }else{
            $("#todoTitle").focus();
        }
    }else{
        if($('.backwrap').is(':visible')){
            closeAllPopUp();
        }else if($('#dueDatePickerDiv').is(':visible')){
            $('#dueDatePickerDiv').hide();
            $('#dueDatePicker').css('pointer-events', 'auto');
        }else if($('.suggested-type-list').is(':visible')){
            $('.suggested-type-list').hide();
        }else if($('#cancel-btn').is(':visible')){
            $('#cancel-btn').trigger('click');
        }
    }
}

function flagged(acid){
    $('#flag_unflag').removeClass('unflag').addClass('Flagged').attr('src', '/images/basicAssets/Flagged_red.svg');
    $('.side_bar_list_item li.activeTodo').addClass('Flagged');
    $("#fla_" + acid).show();
}

function unflagged(acid){
    $('#flag_unflag').removeClass('Flagged').addClass('unflag').attr('src', '/images/basicAssets/Not_Flagged.svg');
    $('.side_bar_list_item li.activeTodo').removeClass('Flagged');
    $("#fla_" + acid).hide();
}

function toDoFlagUnflag(event){
    var acid = $('#updateAction').val();

    if ($('#flag_unflag.unflag').is(':visible') == true) {

        var activity = new Activity();
        activity.activityId = acid;
        activity.activityCreatedBy = user_id;
        activity.activityUpdateData = 'flag';
        
        activity.activityUtility((response)=>{
            $('#flag_unflag').attr('data-flagid',response.activityUtilityResponse.respons.id);
            flagged(acid);
        });

    } else {

        var activity = new Activity();
        activity.activityId = $("#flag_unflag").attr('data-flagid');
        activity.activityCreatedBy = acid;
        activity.activityUpdateData = 'unflag';
        
        activity.activityUtility((response)=>{
            unflagged(acid);
        });

    }

}

function sidebarFlagActiveAfterDynamicAppand(){
    $(".sidebarFlag").on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        let activityID = e.target.id;
        let actiID = $('#' + activityID).parent('li').attr('data-activityid');

        if ($('#' + activityID).is(':visible')) {
            socket.emit('toodoUpdate', {
                targetID: actiID,
                type: 'unflag',
                contain: user_id,
                clusteringkey: dataclusteringKey[actiID]
            },
                function (confirmation) {
                    $('#flag_unflag').removeClass('Flagged').addClass('unflag').attr('src', '/images/basicAssets/Not_Flagged.svg');
                    $('.side_bar_list_item li.activeTodo').removeClass('Flagged');
                    $("#" + activityID).hide();
                });
        } else {
            socket.emit('toodoUpdate', {
                targetID: actiID,
                type: 'flag',
                contain: user_id,
                clusteringkey: dataclusteringKey[actiID]
            },
                function (confirmation) {
                    $('#flag_unflag').removeClass('unflag').addClass('Flagged').attr('src', '/images/basicAssets/Flagged_red.svg');
                    $('.side_bar_list_item li.activeTodo').addClass('Flagged');
                    $("#" + activityID).show();
                });
        }
    });
}

$(".sidebarFlag").on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let activityID = e.target.id;
    let actiID = $('#' + activityID).parent('li').attr('data-activityid');

    if ($('#' + activityID).is(':visible')) {
        socket.emit('toodoUpdate', {
            targetID: actiID,
            type: 'unflag',
            contain: user_id,
            clusteringkey: dataclusteringKey[actiID]
        },
            function (confirmation) {
                $('#flag_unflag').removeClass('Flagged').addClass('unflag').attr('src', '/images/basicAssets/Not_Flagged.svg');
                $('.side_bar_list_item li.activeTodo').removeClass('Flagged');
                $("#" + activityID).hide();
            });
    } else {
        socket.emit('toodoUpdate', {
            targetID: actiID,
            type: 'flag',
            contain: user_id,
            clusteringkey: dataclusteringKey[actiID]
        },
            function (confirmation) {
                $('#flag_unflag').removeClass('unflag').addClass('Flagged').attr('src', '/images/basicAssets/Flagged_red.svg');
                $('.side_bar_list_item li.activeTodo').addClass('Flagged');
                $("#" + activityID).show();
            });
    }
});

$('#tagged_area').on('click', function () {
    $('.addTagConv').show();
    $(this).hide();
});

function tagged_area(){
    $('.addTagConv').show();
    $(this).hide();
}

$("#todoTitle").on('focus', function (e) {
    if ($('#updateAction').val() !== '0') {
        $("#todoTitle").css('background-color', '#ffffff');
    } else {
        $("#todoTitle").css('background-color', '#ffffff');
    }
});


$("#todoTitle").on('blur', function (e) {
    if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
        if($('#updateAction').val() !== ''){
            var str = $('#todoTitle').val();

            if (!validate.isEmpty(str)) {
                if ($('#updateAction').val() !== '0') {
                    $("#todoTitle").css('overflow', 'hidden');
                    $("#todoTitle").css('float', 'left');
                    $("#todoTitle").css('display', 'inline-block');
                    $("#todoTitle").css('background-color', 'transparent');
                    $("#todoTitle").hide();
                    $("#toDoName_2").show();
                    if (str != "") {
                        if(!validate.isEmpty(str)){
                            const activity = new Activity();
                                activity.activityId          = $('#updateAction').val();
                                activity.clusteringKey       = $('#actCre').val();
                                activity.activityUpdateData  = str;
                                activity.activityType        = 'Task';
                                activity.activityUpdateType  = 'title';
                            
                            activity.activityUpdate((response)=>{
                                $("#activity_" + $('#updateAction').val() +' .toDoName').text(str);
                            });
                        }
                    }
                } else {
                    $("#todoTitle").hide();
                    $("#toDoName_2").show();
                }
            } else {
                e.preventDefault();
            }
        }
    }
    
});

function saveDraftActiVity() {
    return new Promise((resolve,reject)=>{
        var str = $('#todoTitle').val();
        var selectecosystem = $("#selectWorkspace").val();
        if (str != "" && str != " ") {
            socket.emit('CreateDraftActivity', {
                activityType: 'TODO',
                activityTitle: str,
                createdBy: user_id,
                ecosystem: selectecosystem,
                adminListUUID: sharedMemberList,
                status: 2
            },
            function (confirmation) {
                if (confirmation.activityres.status) {
                    $('#createToDoPopup').hide();
                    $("#connectTodoTitle").val('');
                    $("#notes_area").val('');
                    $("#timeFrom").val('');
                    $("#timeTo").val('');
                    $("#ReminderTime").val('');
                    $("#viewUploadFileviewUploadFile").html('');
                    $("#n_ToDo_item").remove();
                    var liDesign = '<li id="activity_' + confirmation.activityres.activity_id + '" data-activityid="' + confirmation.activityres.activity_id + '" class="todoLink" onclick="startToDo(event)"><span class="toDo"></span><span class="toDoName">' + str + '</span><span class="draft" style="margin-top:8px;">(draft)</span></li>';

                    $('#unpinTodoList').prepend(liDesign);

                    resolve(confirmation.activityres.msg);
                } else {
                    reject(confirmation.activityres.status);
                }
            });
        }else{
            reject(confirmation.activityres.status);
        }
    });
}

function allKeyUp() {
    $(document).keyup(function (e) {
        var taggedContainer = $('.addTagConv');
        var subtaskAllFile = $('.subtaskAllFile');
        var more_files = $('.more_files');
        
        var subtaskOption = $('#subtasksOptions');
        var subtasksMOL = $('#custom_toDoMoreOptionView');
        
        if (e.keyCode == 27) {
            if(subtaskOption.hasClass('active')){
                subtaskOption.removeClass('active');
            }

            if (taggedContainer.is(':visible') == true) {
                if(!$('#memberListBackWrap').is(':visible')){
                    taggedContainer.hide();
                    $('#tagged_area').show();
                }
            }
            
            if(subtaskAllFile.is(':visible')){
                subtaskAllFile.hide();
                more_files.removeClass('active_files');
                lowZindex('high');
            }

            if ($("#todoTitle").is(':focus')) {
                $("#todoTitle").blur();
            }

            if($('#subTaskTitleEdit').is(':visible')){
                $('#subTaskTitleEdit').hide();
            }

            if($('#subtaskProperty').is(':visible')){

                if($('#tstr_popup').is(':visible')){
                    $('#tstr_popup').hide();
                }else if($('.assignee_users').is(':visible')){
                    $('.assignee_users').hide();
                }else if($('.delete_msg_div').is(':visible')){
                    $('#subtaskWarningBackwrap').hide();
                }else if($('.priority-picker-wrapper').is(':visible')){
                   if($('#subtaskWarningBackwrap').is(':visible')){
                        $('#subtaskWarningBackwrap').hide()
                    }else{
                        $('.priority-picker-wrapper').hide();
                    }
                }else if($('.status-picker-wrapper').is(':visible')){
                    $('.status-picker-wrapper').hide();
                    lowZindex('high');
                }else if($('.emoji_div').is(':visible')){
                    $('.emoji_div').remove();
                }else if($('#ChatFileUpload_task').is(':visible')){
                    $('#ChatFileUpload_task').hide();
                }else if($('#ChatFileUpload').is(':visible')){
                    $('#ChatFileUpload').hide();
                }else if($('.msgs-thread-popup').is(':visible')){
                    $('#threadReplyPopUp_task').hide();
                }else if($('.flatpickr-calendar').hasClass('open')){
                    $('.flatpickr-calendar').removeClass('open');
                }else{
                    $('#subtaskProperty').hide();
                }
            }

            if($('#batchProcessing').is(':visible')){
                if($('#tstr_popup').is(':visible')){
                    $('#tstr_popup').hide();
                }else if($('.assignee_users').is(':visible')){
                    $('.assignee_users').hide();
                }else if($('.delete_msg_div').is(':visible')){
                    $('#subtaskWarningBackwrap').hide();
                }else if($('.priority-picker-wrapper').is(':visible')){
                    $('.st_phase_value .priority-picker-wrapper').hide();
                }else if($('.status-picker-wrapper').is(':visible')){
                    if($('#subtaskWarningBackwrap').is(':visible')){
                        $('#subtaskWarningBackwrap').hide()
                    }else{
                        $('.status-picker-wrapper').hide();
                        lowZindex('high');
                    }
                }else if($('.emoji_div').is(':visible')){
                    $('.emoji_div').remove();
                }else{
                    $('#batchProcessing').hide();
                }
            }

            if($('.priority-picker-wrapper').is(':visible')){
                if($('#subtaskWarningBackwrap').is(':visible')){
                    $('#subtaskWarningBackwrap').hide()
                }else{
                    $('.cell-component .priority-picker-wrapper').hide();
                }
            }

            if($('.status-picker-wrapper').is(':visible')){
                if($('#subtaskWarningBackwrap').is(':visible')){
                    $('#subtaskWarningBackwrap').hide()
                }else{
                    $('.cell-component .status-picker-wrapper').hide();
                    lowZindex('high');
                }
            }

            if($('.assignee_users').is(':visible')){
                $('.assignee_users').hide();
            }
        }
    });

    $("#todoTitle").keyup(function (e) {
        if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
            if($('#updateAction').val() !== ''){
                var str = $('#todoTitle').val().trim();
                str = str.replace(/<\/?[^>]+(>|$)/g, "");

                if (str.length > 60) {
                    $('.edit-todo-name').css('height', '50px');
                    // $('.to_do_head_left').css('margin', '6px 0px');
                    // $('.to_do_head_left label').css('top', '20px');
                    // $('.edit-todo-name').css('line-height', '22px');
                    // $('.to_do_head_left .checkbox_container').css('top', '12px');
                } else {
                    $('.edit-todo-name').css('height', '32px');
                    // $('.to_do_head_left').css('margin', '22px 0px');
                    // $('.to_do_head_left>label').css('top', '5px');
                    // $('.edit-todo-name').css('line-height', '32px');
                    // $('.to_do_head_left .checkbox_container').css('top', '6px');
                }

                var str = $('#todoTitle').val();
                if (str != "") {
                    if ($('#updateAction').val() !== '0') {
                        $("#todoTitle").css('overflow', 'hidden');
                        $("#todoTitle").css('float', 'left');
                        $("#todoTitle").css('display', 'inline-block');
                        // $("#todoTitle").css('background-color', '#ececec');
                    } else {
                        // $("#todoTitle").css('background-color', '#ececec');
                        
                    }
                } else {
                    e.preventDefault();
                }

                if (e.keyCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!validate.isEmpty(str)) {
                        if(taskTitleArr.indexOf(str.toLowerCase().trim())== -1){
                            if (str != "" && str != " ") {
                                if (str.length < 129) {
    
                                    if (str.length > 128) str = str.substring(0, 128);
                                    $('.todoLink.activeTodo .toDoName').text($(this).val());
                                    $('#todoTitle').css('border', '1px solid #ececec');
                                    if ($('#updateAction').val() === '0') {
                                        $(this).blur();
                                        createNewActivity();
                                    } else {
                                        $(this).blur();
                                        $('.todoLink.activeTodo').removeClass('newTodo');
                                        const activity = new Activity();
                                            activity.activityId          = $('#updateAction').val();
                                            activity.clusteringKey       = $('#actCre').val();
                                            activity.activityUpdateData  = str;
                                            activity.activityType        = 'Task';
                                            activity.activityUpdateType  = 'title';
                                        
                                        activity.activityUpdate((response)=>{
                                            $("#activity_" + $('#updateAction').val()+' .toDoName').text(str);
                                        });
                                    }
                                } else {
                                    if (str.length > 128) str = str.substring(0, 128);
                                    $("#todoTitle").val(str);
                                    toastr['warning']('Title allow maximum 128 charecter', 'Warning');
                                }
                            } else {
                                $('#todoTitle').css('border', '1px solid red');
                            }
                        }else{
                            toastr['warning']($("#todoTitle").val()+' already in your tasklist', 'Warning');
                            $("#todoTitle").val('').focus();
                        }
                        
                    }   else {
                        $('#todoTitle').css('border', '1px solid red');
                    }
                    
                }
            }
        } else {
            toastr['warning']('Please contact with todo creator', 'Warning');
        }

    });
    $("#todoTitle").keydown(function (e) {
        if(e.keyCode == 13){
            e.preventDefault();
            e.stopPropagation();
        }
    });

    $('#tagged-popup-title').keyup(function (e) {

        var taggedValue = $('#tagged-popup-title').val();
        var addTagged = '<li>' + taggedValue + '</li>';

        if (e.keyCode == 13) {
            if (!$(this).val() == '') {
                $(addTagged).appendTo('ul.tags_droupdown');
                $(this).val('');
            }
        }

    });

    $('#sideBarSearch').keyup(function (e) {
        var searchValue = $(this).val().toLowerCase();

        allActivityList = [];
        $('.side_bar_list_item li').each(function (k, v) {
            if (allActivityList.indexOf($(v).attr('data-activityid')) === -1) {
                allActivityList.push($(v).attr('data-activityid'));
            }
        });

        var searchConvList = [];

        if (tagged_conv_list.length > 0) {
            $.each(tagged_conv_list, function (k, v) {
                if (searchConvList.indexOf() === -1) {
                    searchConvList.push(v);
                }
            });
        }

        if (setFlagConvArray.length > 0) {
            $.each(setFlagConvArray, function (k, v) {
                if (searchConvList.indexOf() === -1) {
                    searchConvList.push(v);
                }
            });

            var targettext = 'flag';
        } else {
            var targettext = 'text';
        }


        var code = e.keyCode || e.which;
        if (searchValue.length > 0) {
            if (code == 13) { //Enter keycode = 13
                e.preventDefault();
                socket.emit('todoListForSearch', {
                    allActivityList: (searchConvList.length > 0 ? searchConvList : allActivityList),
                    target_text: searchValue,
                    target_filter: targettext,
                    user_id: user_id
                }, (callBack) => {
                    if (callBack.status) {

                        if (!$("#c_search_ed").is(':visible')) {
                            var design = '<div class="tag_item" id="c_search_ed"><img src="/images/basicAssets/Search.svg" class="flagged"><p class="tagP">' + searchValue + '</p><img onclick="removeSearchText(\'c_search_ed\')" class="tagIMG" src="/images/basicAssets/Close.svg"></div>';

                            $('.sideContainer  .tagg_list').append(design);
                        } else {
                            $("#c_search_ed").find('.tagP').text(searchValue);
                        }

                        if ($(".sideContainer .tag_item").length > 0) {
                            $('.sideContainer  .tagg_list').show();
                        }

                        $("#pinnedToDoList li").hide();
                        $("#overdueULlist li").hide();
                        $("#unpinTodoList li").hide();

                        if (callBack.data.length > 0) {

                            $('.side_bar_list_item>li').filter(function () {
                                $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
                            });

                            $.each(callBack.data, function (k, v) {
                                if (currentSerchActivityList.indexOf(v) === -1) {
                                    currentSerchActivityList.push(v);
                                }
                                $("#activity_" + v).show();
                            });

                            $('.side_bar_list_item .toDoName').unhighlight();
                            $('.side_bar_list_item .toDoName').highlight(searchValue);

                            $('.country-label .checkName').unhighlight();
                            $('.country-label .checkName').highlight(searchValue);

                        } else {
                            $('.side_bar_list_item>li').filter(function () {
                                $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
                            });
                            var numrelated = $('.side_bar_list_item > li:visible').length;
                            if (numrelated == 0) {
                                $('.sideContainer  .errMsg').show();
                                $('.sideContainer  .errMsg').text('No result(s) found');
                            }
                        }



                    }
                });

            }
        } else {
            removeSearchText();
        }
    });

    // script for Todo check List
    $('#addTodoCheckList').keyup(function (event) {
        
        event.preventDefault();
        event.stopImmediatePropagation();
        
        $('#addTodoCheckList').css('border-color','#1676EA');
        var addcheck = $('#addTodoCheckList').val();
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode == '13') {
            if(!validate.isEmpty(addcheck) && $("#updateAction").val() != '0'){
                var iii = $('.activeGroup').text().replace(/\s/g, '').toLowerCase();
                console.log(subTaskListArr);
                if(subTaskListArr.indexOf(addcheck.toLowerCase().trim()) === -1){
                    if($('.activeGroup').length > 0){
                        var plseStr = '<div class="pulse-component-wrapper" id="plusCUstom'+iii+'"></div>';
                        $("#"+iii +" .group-header-wrapper").after(plseStr);
                        $( "#plusCUstom"+iii).append(htm);
    
                    }else{
                        const activity = new Activity();
    
                        activity.activityTitle            = addcheck;
                        activity.activityType             = 'SubTask';
                        activity.activityCreatedBy        = user_id;
                        activity.activityHasRoot          = 1;
                        activity.activityRootId           = $("#updateAction").val();
                        activity.activityDueDate          = $("#dueDatePicker").val();
    
                        var participants_onfly = [];
                        var coownArr = [];
                        var observerArr = [];
                        var assigneeArr = [];
                        
                        if(coowner.length > 0){
    
                            $.each(coowner,(k,v)=>{
                                if(v !== user_id){
                                    coownArr.push({id:v,type:'owner'});
                                }
                            });
                        }
                        
                        if($("#actCre").val() !== user_id){
                            coownArr.push({id:$("#actCre").val(),type:'owner'});
                        }
                        
    
                        if(observer.length > 0){
                            $.each(observer,(k,v)=>{
                                observerArr.push({id:v,type:'observer'});
                            });
                        }
    
                        if(assignee.length > 0){
                            $.each(assignee,(k,v)=>{
                                assigneeArr.push({id:v,type:'assignee'});
                            });
                        }
    
                        var finArr1 = coownArr.concat(observerArr);
                        var finarr2 = finArr1.concat(assigneeArr);
    
                        $.each(finarr2,(k,v)=>{
                            if(!checkFromMultipleArray(participants_onfly, v.id, v.type)){
                                participants_onfly.push({id:v.id,type:v.type});
                            }
                        });
    
                        
                        activity.participantsArry         = participants_onfly;
    
                        var activityCreatedBy = (!validate.isEmpty(activity.activityCreatedBy) ? true : false);
    
                        var titleWarning = (!validate.isEmpty(addcheck) ? true : warningBorder('addTodoCheckList'));
                        
                        if(activityCreatedBy){
                            if(validate.isBoolean(titleWarning)){
                                activity.saveActivity((response)=>{
                                    if(!validate.isEmpty(response)){
                                        if (response.status) {
                                            subTaskListArr.push(addcheck.toLowerCase().trim());
                                            taskShowHideElement(true);
                                            var htm = $( "#OnlyForClone" ).clone();
                                            var pulse  = response.activity_id;
                                            var id  = $('.pulse_title').length+1;
                                            myAllActivityGlobal.push(pulse);
                                            $(htm).attr('id', 'pulse_'+pulse).addClass('_eachsubtask');
                                            $(htm).attr('id', 'pulse_'+pulse).attr('data-id',pulse);
                                            $(htm).find('.name-cell-component .pulse_title').text(addcheck);
                                            $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
                                            $(htm).find('.numeric-cell-component .amountInputValue').text('0');
                                            $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/'+user_img);
                                            $(htm).find('.owner_img').attr('title', user_fullname);
                                            $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle'+id).text(addcheck);
                                            $(htm).find('.name-cell-component .pulse_title').attr('data-title', addcheck);
        
                                            // ATTR SET
        
                                            $(htm).find('.ObserverCell .observerViewList').attr('data-id', response.activity_id);
                                            $(htm).find('.coowonerCell .coownerViewList').attr('data-id', response.activity_id);
                                            $(htm).find('.AssigneeCell .assigneeViewList').attr('data-id', response.activity_id);
                                            $(htm).find('.DateCell .dueDateInput').attr('data-id', response.activity_id);
                                            $(htm).find('.com_DateCell .com_DateInput').attr('data-id', response.activity_id);
                                            $(htm).find('.priorityCell .single_priority').attr('data-id', response.activity_id);
                                            $(htm).find('.StatusCell .single_status').attr('data-id', response.activity_id);
                                            $(htm).find('.timeEstCell .timeInputValue').attr({'data-id': response.activity_id, 'data-val': response.activity_est_hour});
                                            $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.AmountCell .AmountCellSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.actualCell .actualCellSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.varianceCell .varianceCellSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-id', response.activity_id);
                                            $(htm).find('.name-cell-component .pulse_title').attr('data-id', response.activity_id);
                                            $(htm).find('.name-cell-component .flagIco').attr('data-id', response.activity_id);
        
                                            $(htm).find('.ObserverCell .observerViewList').attr('data-createdby', user_id);
                                            $(htm).find('.coowonerCell .coownerViewList').attr('data-createdby', user_id);
                                            $(htm).find('.AssigneeCell .assigneeViewList').attr('data-createdby', user_id);
                                            $(htm).find('.DateCell .dueDateInput').attr('data-createdby', user_id);
                                            $(htm).find('.com_DateCell .com_DateInput').attr('data-createdby', user_id);
                                            $(htm).find('.priorityCell .single_priority').attr('data-createdby', user_id);
                                            $(htm).find('.StatusCell .single_status').attr('data-createdby', user_id);
                                            $(htm).find('.timeEstCell .timeInputValue').attr('data-createdby', user_id);
                                            $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-createdby', user_id);
                                            $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-createdby', user_id);
                                            $(htm).find('.AmountCell .AmountCellSpan').attr('data-createdby', user_id);
                                            $(htm).find('.actualCell .actualCellSpan').attr('data-createdby', user_id);
                                            $(htm).find('.varianceCell .varianceCellSpan').attr('data-createdby', user_id);
                                            $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-createdby', user_id);
                                            $(htm).find('.name-cell-component .pulse_title').attr('data-createdby', user_id);
        
                                            // ID SET
        
                                            $(htm).find('.DateCell .dueDateInput').attr('id', 'dueDate'+response.activity_id);
                                            $(htm).find('.com_DateCell .com_DateInput').attr('id', 'comDate'+response.activity_id);
                                            $(htm).find('.ObserverCell .observerViewList').attr('id', 'observer'+response.activity_id).addClass('observer'+response.activity_id);
                                            $(htm).find('.coowonerCell .coownerViewList').attr('id', 'coowner'+response.activity_id).addClass('coowner'+response.activity_id);
                                            $(htm).find('.AssigneeCell .assigneeViewList').attr('id', 'assignee'+response.activity_id).addClass('assignee'+response.activity_id);
                                            $(htm).find('.priorityCell').attr('id', 'priority'+response.activity_id);
                                            $(htm).find('.StatusCell').attr('id', 'status'+response.activity_id);
                                            $(htm).find('.timeEstCell .timeInputValue').attr('id', 'timeInputValue'+response.activity_id);
                                            $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('id', 'ManHourRateSpan'+response.activity_id);
                                            $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('id', 'hourlyRateCellSpan'+response.activity_id);
                                            $(htm).find('.AmountCell .AmountCellSpan').attr('id', 'AmountCellSpan'+response.activity_id);
                                            $(htm).find('.actualCell .actualCellSpan').attr('id', 'actualCellSpan'+response.activity_id);
                                            $(htm).find('.varianceCell .varianceCellSpan').attr('id', 'varianceCellSpan'+response.activity_id);
                                            $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('id', 'timevarianceCellSpan'+response.activity_id);
                                            
                                            // $( "#thisWeekPluseContainer").append(htm);
        
                                            if($('#addnewSub').is(':visible')){
                                                if(row_pluse_count == 0){
                                                    $('.pulse_title').first().closest('.pulse-component').before(htm);
                                                }else if(row_pluse_count == 1){
                                                    $('#varienceRow').before(htm);
                                                }
    
                                                if(($('.pulse_title').length - 1) > 9){
                                                    $('#pulse_'+pulse).find('.row_pluse_count').addClass('twodigi');
                                                }
        
                                                $('#pulse_'+pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                                            }else{
                                                $('.pulse_title').last().closest('.pulse-component').before(htm);
                                                var wid = 0;
                                                
                                                $('.cell-component:visible').each(function(k,v){
                                                    wid = wid+$(v).innerWidth();
                                                });
        
                                                SubtaskClone.cellcomponent = 17;
                                                SubtaskClone.flexSize = wid;
                                                SubtaskClone.id = $('.pulse-component').length;
        
                                                $( "#thisWeekPluseContainer").append(SubtaskClone.varience());
                                                $( "#thisWeekPluseContainer").append(SubtaskClone.draw());
                                                
                                                $( "#thisWeekPluseContainer").show();
                                                
                                                if(($('.pulse_title').length - 1) > 9){
                                                    $('#pulse_'+pulse).find('.row_pluse_count').addClass('twodigi');
                                                }
                                                
                                                $('#pulse_'+pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                                            }
        
                                            if($('.showArchive').hasClass('active')){
                                                $('#pulse_'+pulse).hide();
                                            }else{
                                                $('#pulse_'+pulse).show();
                                            }
        
                                            // $( "#OnlyForClone").css('display','flex');
                                            $('.kill').css('height',$('.pulse-component').length*37+200);
        
                                            var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
                                            var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;
                                            var waitingST =  $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
                                            var workingST =  $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;
                                            
                                            progressBar(totalST,checkedST);
                                            multipleProgressBar(totalST,checkedST,waitingST,workingST);
                                           
                                            $.each(participants_onfly, function(k,v){
                
                                                if(v.type == 'observer'){
                                                    addAsObsrvrArr.push({
                                                        activityid: response.activity_id.toString(),
                                                        userid: v.id.toString(),
                                                        tbl_id: v.id.toString(),
                                                        type: 'observer',
                                                    });

                                                    partiArry.push({
                                                        activity_id: response.activity_id.toString(),
                                                        user_id: v.id.toString(),
                                                        tbl_id: v.id.toString(),
                                                        participant_type: 'observer',
                                                        activity_type: "SubTask",
                                                        created_at: moment().format('L')
                                                    });

                                                    if(uniqueObserver.indexOf(v.id.toString()) == -1){
                                                        uniqueObserver.push(v.id.toString());
                                                    } 
                                    
                                                    observerFromLoad(v.id.toString(),'#observer'+response.activity_id.toString());
                                    
                                                }else if(v.type == 'assignee'){
                                                    
                                                    addAsAssigneeArr.push({
                                                        tbl_id: v.id.toString(),
                                                        activityid: response.activity_id.toString(),
                                                        userid: v.id.toString(),
                                                        type: 'assignee',
                                                    });

                                                    partiArry.push({
                                                        activity_id: response.activity_id.toString(),
                                                        user_id: v.id.toString(),
                                                        tbl_id: v.id.toString(),
                                                        participant_type: 'assignee',
                                                        activity_type: "SubTask",
                                                        created_at: moment().format('L')
                                                    });

                                                    if(uniqueAssine.indexOf(v.id.toString()) == -1){
                                                        uniqueAssine.push(v.id.toString());
                                                    }
                                    
                                                    assigneeFromLoad(v.id.toString(),'#assignee'+response.activity_id.toString());
                                    
                                                }else if(v.type == 'owner'){
                                                    
                                                    addAsCoOwnerArr.push({
                                                        tbl_id: v.id.toString(),
                                                        activityid: response.activity_id.toString(),
                                                        userid: v.id.toString(),
                                                        type: 'owner',
                                                    });

                                                    partiArry.push({
                                                        activity_id: response.activity_id.toString(),
                                                        user_id: v.id.toString(),
                                                        tbl_id: v.id.toString(),
                                                        participant_type: 'owner',
                                                        activity_type: "SubTask",
                                                        created_at: moment().format('L')
                                                    });

                                                    if(uniqCoowner.indexOf(v.id.toString()) == -1){
                                                        uniqCoowner.push(v.id.toString());
                                                    } 
                                    
                                                    coownerFromLoad(v.id.toString(),'#coowner'+response.activity_id.toString());
                                                }
                                            });
    
                                            var createdbyme = [];
                                            createdbyme.push(response.activity_id.toString());
    
                                            var ar1 = addAsObsrvrArr.concat(addAsAssigneeArr);
                                            var ar2 = ar1.concat(addAsCoOwnerArr);
    
                                            $.each(ar2, (k,v)=>{
                                                if(createdbyme.indexOf(v.activityid.toString()) > -1){
                                                    subTaskOwnerAccess(v.activityid.toString());
                                                }else{
                                                    if(v.type == 'coowner'){
                                                        subTaskOwnerAccess(v.activityid.toString());
                                                    }else if(v.type == 'observer'){
                                                        subTaskObserverAccess(v.activityid.toString());
                                                    }else if(v.type == 'assignee'){
                                                        subTaskAssigneeAccess(v.activityid.toString());
                                                    }
                                                }
                                                
                                            });
    
                                            enabletime();
                                            keypressBlur();
                                            countSubtask();
                                            onDynamicFire();
                                            tooltipforToDo();
                                            subtask_join_into_room();
                                        }
                                    }else{
                                        console.log('Something wrong');
                                    }
                                    
                                });
                            }
                        }
                    }
    
                    $('#addTodoCheckList').val('');
    
                    tooltipforToDo();
    
                    $('#taskStatusSelect').val('Working').trigger('change');
                    $("#taskStatusSelect").css('pointer-events','none');
                    $(".task_status .rdonlyText").css('display','inline-block');
                    $(".task_status .rdonlyDiv").css('display','block');
                    $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','none');
                }else{
                    toastr['warning']($('#addTodoCheckList').val()+' already in your subtasklist', 'Warning');
                    $("#addTodoCheckList").val('').focus();
                }
            }else{
                $('#addTodoCheckList').css('border-color','red');
            }
            
        }
    });
}

function assignUsers(e){
    if($("#"+e.target.id).attr('data-type') == 'st'){
        st_id = $("#"+e.target.id).attr('data-sid');
        ci_id = $("#"+e.target.id).attr('data-cid');
        st_participant = $("#"+e.target.id).attr('data-parti').split(',');
        $(e.target).next('.assign_users').show();
        $('.suggested-list').html('');
        suggestedUserList();
    }else{
        $(e.target).next('.assign_users').show();
    }
}

function subTaskStatus(e){
    $(e.target).next('.status_lists').show();
}

function addSubTaskNote(sid,cid){
    $('#noteTestRaea').attr('data-sid',sid);
    $('#noteTestRaea').attr('data-cid',cid);
    $("#noteTestRaea").text($('#spanS_note'+sid).text());
    $('#subtaskNoteBackwrap').show();
}

function removeSearchText(id) {
    currentSerchActivityList = [];
    $("#c_search_ed").remove();

    $("#pinnedToDoList li").hide();
    $("#overdueULlist li").hide();
    $("#unpinTodoList li").hide();

    $('.sideContainer  .errMsg').text('');
    $('.sideContainer  .errMsg').hide();

    $('#sideBarSearch').val("");

    $('.side_bar_list_item li').each(function (k, v) {
        $(v).show();
    });
    $('.side_bar_list_item>li').unhighlight();
    $('.country-label .checkName').unhighlight();
}

function countBoxes() {
    countCheckBox = $('.new-added-check-list input:checkbox').length;
}

//count checks

// function isChecked() {
//     countChecked = $('.new-added-check-list input:checkbox:checked').length;
//     var percentage = parseInt(((countChecked / countCheckBox) * 100), 10);
//     var percent_width = "width:" + percentage + "%";

//     if (isNaN(percentage)) {
//         var count = 0;
//         $('#progressbar').progressbar({
//             value: $("#progressbar").attr("style", percent_width)
//         });
//     } else {
//         var count = percentage;
//         $('#progressbar').progressbar({
//             value: $("#progressbar").attr("style", percent_width)
//         });
//     }

//     $(".progress_status").text(count + "%");
// }
// Todo checkList end

function removeThisCheckList(event){
    event.preventDefault();
    event.stopPropagation();

    if ($("#updateAction").val() == 0) {
        $(event.target).parent('li').remove();
        var title = $(event.target).attr('data-chtitle');
        removeA(checklistiTEM, title);
    } else if ($("#updateAction").val() !== 0) {

        var s_id = $(event.target).attr('data-sid');
        var clusteringkey = $('#activityCreatedAt').val();
        socket.emit('deleteSubTask', {
            s_id: s_id,
            clusteringkey: $(event.target).attr('data-cid')
        },
        function (confirmation) {
            console.log(confirmation);
            $(event.target).parent('li').remove();
            var title = $(event.target).attr('data-chtitle');
            removeA(checklistiTEM, title);
        });
    }

    countBoxes()
    // isChecked();
}

$(".shareingImg>img").click(function () {
    $("#memberListBackWrap").show();
});

$(".closeBackwrap").click(function () {
    $("#memberListBackWrap").hide();
    $("#subtaskListBackWrap").hide();
});

$(".close_note").click(function () {
    $("#subtaskNoteBackwrap").hide();
});

$("#dueDateWS_newToDo").click(function () {
    $("#calenderPicker_for_newToDo").css('display', 'block');
});

$("#main_month_year").click(function () {
    $(".todo-calender>h4>ul").toggle();
});

$(".todo-dates>span").click(function () {
    $(".todo-dates>span").removeClass("selected");
    $(this).addClass("selected");
});

$(document).mouseup(function (e) {
    var taggedList = $('.addTagConv');
    var filterPannel = $('.filterMainContainer');
    var moreMenuPopup = $('.moreMenuPopup');
    var moreDiv = $('.more');
    var cancel_btnOne = $('#cancel-btn');
    var cancel_btnOne = $('#cancel-btn');
    var cancel_btnTwo = $('#closeNewToDO');
    var create_btn = $('#create-btn');
    var todoCal = $('.todo-calender');
    var assign_users = $('.assign_users');
    var status_lists = $('.status_lists');
    var status_picker = $('.status-picker-wrapper');
    var priority_picker = $('.priority-picker-wrapper');
    var assignee_users = $('.assignee_users');
    var tstr_popup = $('#tstr_popup');
    var dialog_node2 = $('.dialog-node');
    var groupSeletDiv = $('#groupSeletDiv');
    var innerDropMeny = $('.innerDropMeny');
    var col_permission = $('.col_permission_setting');
    var live_chat = $('#live-chat');
    var subtaskProperty = $('#subtaskProperty');
    var batchProcessing = $('#batchProcessing');
    var subtaskAllFile = $('.subtaskAllFile');
    var more_files = $('.more_files');
    var helpContainer = $('#helpContainer');
    var str = $('#todoTitle').val();
    var subtitleEdit = $('#subTaskTitleEdit');
    var subtaskOption = $('#subtasksOptions');
    var subtasksMOL = $('#custom_toDoMoreOptionView');
    var noteliOptionpop = $('.note_m_op:visible');
    var mainNeditor = $('.mainNEditor:visible');
    var editorRemin = $('.reminder_ico.active');
    var labelNdiv = $('.add_l_noteCo:visible');
    var noteSortingDiv = $('.noteSortingDiv');
    var emoji_div = $('.emoji_div');
    var noteEditableDiv = $('.b_n_w_c.editable:visible');
    var msg_more_popup = $('.msg-more-popup');
    var emojiListContainer = $('.emojiListContainer');


        if (!msg_more_popup.is(e.target) && msg_more_popup.has(e.target).length === 0) {
            msg_more_popup.hide();
            $(".msg-more-popup[data-type='visible']").parents('.msgs-form-users-options').removeAttr('style')
        }
        
        if (!emojiListContainer.is(e.target) && emojiListContainer.has(e.target).length === 0) {
            emojiListContainer.remove();
        }

    if(!noteEditableDiv.is(e.target) && noteEditableDiv.has(e.target).length === 0){
        noteEditableDiv.find('.closediv.btn_done_n').trigger('click');
    }
    if(!labelNdiv.is(e.target) && labelNdiv.has(e.target).length === 0){
        if(!$(e.target).hasClass('addlabel_ico')){
            labelNdiv.hide();
        }
    }

    if(!editorRemin.is(e.target) && editorRemin.has(e.target).length === 0){
        editorRemin.removeClass('active');
    }

    if(!mainNeditor.is(e.target) && mainNeditor.has(e.target).length === 0){
        if(!$(e.target).hasClass('btn_done_n')){
            $('.createNoteContainer').show();
            $('.mainNEditor').hide();
        }
    }

    if(!noteliOptionpop.is(e.target) && noteliOptionpop.has(e.target).length === 0){
        $('.moreico').removeClass('active');
    }
    if(subtaskOption.hasClass('active')){
        if(!subtasksMOL.is(e.target) && subtasksMOL.has(e.target).length === 0){
            if(!subtaskOption.is(e.target)){
                subtaskOption.removeClass('active');
            }
        }
    }

    if(!$('.flatpickr-calendar.open').length == 1){
        $('.datePick').css('pointer-events','auto');
    }

    if(subtitleEdit.is(':visible')){
        if (!subtitleEdit.is(e.target) && subtitleEdit.has(e.target).length === 0) {
            subtitleEdit.blur();
        }
    }

    if(noteSortingDiv.is(':visible')){
        if (!noteSortingDiv.is(e.target) && noteSortingDiv.has(e.target).length === 0) {
            if(!$('.startNewList').is(e.target)){
                noteSortingDiv.hide();
            }
        }
    }

    if(emoji_div.is(':visible')){
        if (!emoji_div.is(e.target) && emoji_div.has(e.target).length === 0) {
            if(!$('.emojiHolder').is(e.target)){
                emoji_div.remove();
                $('.msg-separetor-unread').show();
            }
        }
    }

    if(helpContainer.is(':visible')){
        if (!helpContainer.is(e.target) && helpContainer.has(e.target).length === 0) {
            helpContainer.css('right','-310px');
        }
    }

    if(todoCal.is(':visible')){
        if (!todoCal.is(e.target) && todoCal.has(e.target).length === 0) {
            todoCal.hide();
        }
    }

    if(live_chat.is(':visible')){
        if (!live_chat.is(e.target) && live_chat.has(e.target).length === 0) {
            if(!$('#threadReplyPopUp_task').is(':visible')){
                if( !$('#ChatFileUpload_task').is(':visible') &&
                    !$('#ChatFileUpload').is(':visible') &&
                    !$('.delete_msg_div').is(':visible') &&
                    !$('#delete_task_msg_div').is(':visible')){
                    live_chat.hide();
                    $('.todos-chat-write').show();
                    $('.task-edit-write').hide();
                    $('#chatboxEditor').hide();
                    $('#live-chat .ql-toolbar.ql-snow').hide();
                    $('#chatbox').show();
                }
            }
        }
    }

    if(subtaskProperty.is(':visible')){
        if (!subtaskProperty.is(e.target) && subtaskProperty.has(e.target).length === 0) {
            if(! $('#threadReplyPopUp_task').is(':visible')){
                if( !$('#subtaskWarningBackwrap').is(':visible') && 
                    !$('.delete_msg_div').is(':visible') &&
                    !$('.flatpickr-calendar').is(':visible') &&
                    !$('#ChatFileUpload').is(':visible') &&
                    !$('#ChatFileUpload_task').is(':visible') ){
                    subtaskProperty.hide();
                }
            }
        }
    }

    if(batchProcessing.is(':visible')){
        if (!batchProcessing.is(e.target) && batchProcessing.has(e.target).length === 0) {
            if(!$('#subtaskWarningBackwrap').is(':visible') && !$('.delete_msg_div').is(':visible')){
                batchProcessing.hide();
            }
        }
    }

    if(subtaskAllFile.is(':visible')){
        if (!subtaskAllFile.is(e.target) && subtaskAllFile.has(e.target).length === 0 || !more_files.is(e.target) && more_files.has(e.target).length === 0) {
            subtaskAllFile.hide();
            more_files.removeClass('active_files');
            lowZindex('high');
            hideMoreDialogTask(true);
        }
    }
    if(dialog_node2.is(':visible')){
        if(!dialog_node2.is(e.target) && dialog_node2.has(e.target).length === 0){
            if(!$('.drop-menu-wrapper').is(e.target)){
                $('.header_menu_btn').removeClass('drop_active');
                $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
                $('.outerDropDownMenu .outer_dropDown').css('border','none');
                $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
                dialog_node2.hide();
                hideMoreDialogTask(false)
            }
        }
    }

    if(innerDropMeny.is(':visible')){
        if (!innerDropMeny.is(e.target) && innerDropMeny.has(e.target).length === 0) {
            $('.innerDropMenyCaret .outer_dropDown').removeClass('caretOprn');
            $(".innerDropMeny").html('');
            innerDropMeny.hide();
        }
    }

    if(groupSeletDiv.is(':visible')){
        if (!groupSeletDiv.is(e.target) && groupSeletDiv.has(e.target).length === 0) {
            groupSeletDiv.hide();
        }
    }

    if(col_permission.is(':visible')){
        if (!col_permission.is(e.target) && col_permission.has(e.target).length === 0) {
            col_permission.hide();
        }
    }

    if(assign_users.is(':visible')){
        if (!assign_users.is(e.target) && assign_users.has(e.target).length === 0) {
            assign_users.fadeOut();
        }
    }

    if(status_lists.is(':visible')){
        if (!status_lists.is(e.target) && status_lists.has(e.target).length === 0) {
            status_lists.hide();
        }
    }

    if(status_picker.is(':visible')){
        if (!status_picker.is(e.target) && status_picker.has(e.target).length === 0) {
            if(!$('#subtaskWarningBackwrap').is(':visible')){
                status_picker.fadeOut();
                lowZindex('high');
            }
        }
    }
    if(priority_picker.is(':visible')){
        if (!priority_picker.is(e.target) && priority_picker.has(e.target).length === 0) {
            if(!$('#subtaskWarningBackwrap').is(':visible')){
                priority_picker.fadeOut();
            }
        }
    }

    if(assignee_users.is(':visible')){
        if (!assignee_users.is(e.target) && assignee_users.has(e.target).length === 0) {
            if(!$(e.target).hasClass('person-cell-component')){
                assignee_users.hide();
            }
        }
    }

    if(tstr_popup.is(':visible')){
        if (!tstr_popup.is(e.target) && tstr_popup.has(e.target).length === 0) {
            if(!$(e.target).hasClass('reminder_buttons')){
                tstr_popup.hide();
            }
        }
    }

    if (moreMenuPopup.is(':visible')) {
        if (!moreMenuPopup.is(e.target) && moreMenuPopup.has(e.target).length === 0) {
            if (!moreDiv.is(e.target) && moreDiv.has(e.target).length === 0) {
                moreMenuPopup.hide();
            }
        }
    }
    if (taggedList.is(':visible')) {        
        if (!taggedList.is(e.target) && taggedList.has(e.target).length === 0) {
            if(!$('#memberListBackWrap').is(':visible')){
                taggedList.hide();
                $('#tagged_area').css('display', 'flex');
                $('.tagged').show();
                var checkNewTag = $('#CustagItemList').text().length;
                if (checkNewTag !== 0) {
                    $('#taggedIMGAttachFile').attr("src", "/images/basicAssets/custom_tagged.svg");
                } else {
                    $('#taggedIMGAttachFile').attr("src", "/images/basicAssets/custom_not_tag.svg");
                }
            }
        }
    }

    var calenderPicker = $('#calenderPicker');
    if (calenderPicker.is(':visible')) {
        if (!calenderPicker.is(e.target) && calenderPicker.has(e.target).length === 0) {
            calenderPicker.hide();
        }
    }
    var newToDoCalenderPicker = $('#calenderPicker_for_newToDo');
    if (newToDoCalenderPicker.is(':visible')) {
        if (!newToDoCalenderPicker.is(e.target) && newToDoCalenderPicker.has(e.target).length === 0) {
            newToDoCalenderPicker.hide();
        }
    }
    var suggestedContainer = $('.suggested-type-list');
    if (suggestedContainer.is(':visible')) {
        if (!suggestedContainer.is(e.target) && suggestedContainer.has(e.target).length === 0) {
            clearMemberSearch();
        }
    }
    // if the target of the click isn't the container nor a descendant of the container

    if (!filterPannel.is(e.target) && filterPannel.has(e.target).length === 0) {
        if ($('.chooseTag').is(':visible') == true) {
            $('.chooseTag').hide();
        } else {
            filterPannel.hide();
            $('.side-bar-filter-icon').removeClass('active');
        }
    }
});

function searchFilter() {
    if ($('.filterMainContainer').is(":visible") == false) {
        $('.filterMainContainer').show();
        $('.side-bar-filter-icon').addClass('active');
    }
}

$(".filterItem>.flagFilter").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
    $(".chooseTopic").css('display', 'none');
});

$(".filterItem>.unreadFilter").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
    $(".chooseTopic").css('display', 'none');
});

$(".filterItem>.tagFile").mouseenter(function () {
    $(".chooseTag").css('display', 'block');
    $(".chooseTopic").css('display', 'none');
});

$(".filterItem>.tagTopic").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
    $(".chooseTopic").css('display', 'block');
});

$("#flaggedFilter").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
});

$("#unreadFilter").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
});

$("#completedFilter").mouseenter(function () {
    $(".chooseTag").css('display', 'none');
});

function escKeyUpForConnect() {
    $(window).keyup(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == 27) {
            if ($('.filterMainContainer').is(":visible") == true && $('.chooseTag').is(":visible") == true) {
                $('.chooseTag').hide();

            } else if ($('.filterMainContainer').is(":visible") == true) {
                $('.filterMainContainer').hide();
                $('.side-bar-filter-icon').removeClass("active");
            }
            if ($('.suggested-type-list').is(':visible') == true) {
                clearMemberSearch();
            }
            if ($('.moreMenuPopup').is(':visible') == true) {
                showMorePopUp()
            }

            if(!$('#right-section-area').is(':visible')){
            closeRightSection();
            }

            if($('#custom_toDoMoreOptionView').is(':visible')){
                hideMoreDialogTask(true)
            }
            if($('#addTodoTaskDescription').is(':focus')){
                $('#addTodoTaskDescription').blur();
            }
            if($('#notes_area').is(':focus')){
                $('#notes_area').blur();
            }
            if($('#taskManage').is(':visible')){
                $('#taskManage').hide();
            }

            if($('#helpContainer').is(':visible')){
                $('#helpContainer').css('right','-310px');
            }

            if($('.dialog-node').is(':visible')){
                $('.header_menu_btn').removeClass('drop_active');
                $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
                $('.outerDropDownMenu .outer_dropDown').css('border','none');
                $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
                $('.dialog-node').hide();
                hideMoreDialogTask(false);
            }
        }
        if($('.subtaskAllFile').is(':visible')){
            // e.preventDefault();
            if (e.shiftKey && keycode == 82) {
                if($('.subtask_note_view.moreFileLi.renameSubtask').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_note_view.moreFileLi.renameSubtask').trigger('click');
                }
            }else if (e.shiftKey && keycode == 68) {
                if($('.subtask_note_view.duplicate.moreFileLi').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_note_view.duplicate.moreFileLi').trigger('click');
                }
            }else if (e.shiftKey && keycode == 66) {
                if($('.subtask_note_view.batchAct.moreFileLi').is(':visible')){
                    openbatchactionbytrigger()
                }
            }else if (e.shiftKey && keycode == 78) {
                if($('.subtask_note_view.moreFileLi.addNotePopup').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_note_view.moreFileLi.addNotePopup').trigger('click');
                }
            }else if (e.shiftKey && keycode == 80) {
                if($('.subtask_file_up.moreFileLi.subProperty').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_file_up.moreFileLi.subProperty').trigger('click');
                }
            }else if (e.shiftKey && keycode == 67) {
                if($('.subtask_chat.moreFileLi.subChat').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_chat.moreFileLi.subChat').trigger('click');
                }
            }else if (keycode == 46) {
                if($('.subtask_file_up.deleteSubtask.moreFileLi').is(':visible')){
                    $('.more_files.active_files').next('.subtaskAllFile').find('.subtask_file_up.deleteSubtask.moreFileLi').trigger('click');
                }
            }
            $('.subtaskAllFile').hide();
            $('.more_files.active_files').removeClass('active_files');
            lowZindex('high');
            hideMoreDialogTask(true);
        }
    });
}

function sideBarSearchcollapses() {
//     $(".side-bar-search-icon").mouseenter(function () {
//         $(this).hide();
//         if ($(".thread_active").is(":visible") == true) {
//             $(".thread_active").hide();
//             $(".side_bar_thread_ico").show();
//         }
//         if ($('#sideBarSearch').is(':visible') == false) {
//             $('#sideBarSearch').show();
//         }
//     });

//     $('#sideBarSearch').mouseleave(function () {

//         if ($('#sideBarSearch').is(':focus') == false && $('#sideBarSearch').val().length < 1) {
//             $(this).hide();
//             $(".side-bar-search-icon").show();
//         }
//     });
//     $('#sideBarSearch').blur(function () {
//         if ($('#sideBarSearch').val().length <
//             1) {
//             $(this).hide();
//             $(".side-bar-search-icon").show();
//         }
//     });
}

if ($('.view_img').length >= 4) {
    alert('Exc');
    $('#count_imgages').css('display', 'block');

}

// For update draft activity
function updateDraftActivity() {

    var todoTitle = $("#todoTitle").val();
    var selectecosystem = $("#selectWorkspace").val();
    var dueDateWS = $("#dueDatePicker").val();
    var notes_area = $("#notes_area").val();
    var activity_from = $("#timeFrom").val();
    var activity_to = $("#timeTo").val();
    var activity_reminder = $("#ReminderTime").val();

    if (todoTitle.length > 17) {
        var over_length = "over_length";
    }

    if (todoTitle != "") {
        if (selectecosystem != "") {
            if (dueDateWS == "") {
                $("#dueDatePicker").css('border', '1px solid RED');
            }
        } else {
            $("#selectWorkspace").css('border', '1px solid RED');
        }
    } else {
        $("#todoTitle").css('border', '1px solid RED');
    }

    if ($('#live-chat').is(':visible')) {
        var acid = $('#chat_icon').attr('data-activity_id');
    }else{
        var acid = $('.property_notes').attr('data-batch_id');
    }

    socket.emit('updateDraftActivity', {
        activityid: acid,
        clusteringkey: $('#activityCreatedAt').val(),
        activityTitle: todoTitle,
        activityDescription: notes_area,
        endTime: dueDateWS,
        ecosystem: selectecosystem,
        adminListUUID: sharedMemberList,
        todoFrom: activity_from,
        todoTo: activity_to,
        todoReminder: activity_reminder,
        createdBy: user_id
    },
    function (confirmation) {
        if (confirmation.activityres.status) {

            $('#toDoCheckListContainer').css('display', 'block');
            $('#sharePeopleList').css('display', 'block');
            $('.item_progress').css('display', 'block');
            $('.new-added-check-list').css('display', 'block');
            $('.button-section').css('display', 'none');
            $("#activity_" + acid).find('.draft').remove();
            $("#activity_" + acid).trigger('click');

            $('#chat_icon').css('pointer-events', 'auto');
            $('#toDoPinUnpinDiv').css('pointer-events', 'auto');
            $('#tagged_area').css('pointer-events', 'auto');
            $('.flag').css('pointer-events', 'auto');
            $('.more').css('pointer-events', 'auto');

            $("#amazonWishlist").click(function (e) {
                if ($("#actCre").val() === user_id) {
                    if (e.target.checked) {
                        if ($('.country-label').length > 0) {
                            $(".delete_msg_sec_title").text("Are you sure you want to COMPLETE the following Todo ?");
                            $("#completed_activity_div").show();
                        } else {
                            $(".delete_msg_sec_title").text("Are you sure you want to COMPLETE the following Todo ?");
                            $("#completed_activity_div").show();
                        }
                    } else {
                        if ($('.country-label').length > 0) {
                            $(".delete_msg_sec_title").text("Are you sure you want to REOPEN the following Todo ?");
                            $("#reopen_activity_div").show();
                        } else {
                            $(".delete_msg_sec_title").text("Are you sure you want to REOPEN the following Todo ?");
                            $("#reopen_activity_div").show();
                        }
                    }
                }
            });

            //upload file if there is any file has been tagged

            if (filedata.length > 0) {
                var arg_data = {
                    activity_id: confirmation.activityres.activity_id,
                    sender_id: user_id,
                    sender_img: user_img,
                    sender_name: user_fullname,
                    text: $("#file_comment").val(),
                    attach_files: filedata[0],
                    thread_root_id: 0,
                    root_msg_id: 0
                };

                socket.emit('todo_send_message', arg_data, (rep) => {
                    $("#viewUploadFileviewUploadFile").html('');
                    $("#viewUploadFileviewUploadFile").hide();
                });
            }
        }
    });
}

function shareThisMember(dataID, imSrc , name = null){
    if($("#subtask"+st_id).is(":visible")){
        socket.emit('toodoUpdate', {
            targetID: st_id,
            type: 'addmember',
            contain: dataID,
            clusteringkey: ci_id
        },
        function (confirmation) {
            if(st_participant.indexOf(dataID) === -1){
                st_participant.push(dataID);
                $('.suggested-list').html('');
                suggestedUserList();
                popupMouseEnter();
            }

        });
    }else{
        if ($("#updateAction").val() == 0) {
            if (sharedMemberList.indexOf(dataID) == -1) {
                sharedMemberList.push(dataID);
                $('#toDoMember' + dataID + '').remove();
                clearMemberSearch();
                $('#sharePeopleList').show();
                if (sharedMemberList.length < 5) {
                    viewMemberImg.push(dataID);
                    $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + imSrc + '" data-uuid="' + dataID + '" class="sharedIMG memberImg' + dataID + '">');
                }

                if (sharedMemberList.length > 4) {
                    $('#sharePeopleList span').show();
                    $('#sharePeopleList span').text('+' + (sharedMemberList.length - 4));
                }
            }
        } else if ($("#updateAction").val() !== 0 && $("#actCre").val() === user_id) {
            if ($("#actCre").val() !== 0) {
                if (sharedMemberList.indexOf(dataID) == -1) {
                    sharedMemberList.push(dataID);
                    $('#toDoMember' + dataID + '').remove();
                    clearMemberSearch();
                    $('#sharePeopleList').show();
                    if (sharedMemberList.length < 5) {
                        viewMemberImg.push(dataID);
                        $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + imSrc + '" data-uuid="' + dataID + '" class="sharedIMG memberImg' + dataID + '">');
                    }

                    if (sharedMemberList.length > 4) {
                        $('#sharePeopleList span').show();
                        $('#sharePeopleList span').text('+' + (sharedMemberList.length - 4));
                    }
                }
                if ($('#live-chat').is(':visible')) {
                    var acid = $('#chat_icon').attr('data-activity_id');
                }else{
                    var acid = $('.property_notes').attr('data-batch_id');
                }
                socket.emit('toodoUpdate', {
                    targetID: acid,
                    type: 'addmember',
                    contain: dataID,
                    clusteringkey: $('#activityCreatedAt').val()
                },
                function (confirmation) {
                });
            }
        }
        if ($('.memberListContainer').is(':visible') == true) {
            var name = $('#viewMember' + dataID).find('.memberName').text();
            $('#viewMember' + dataID).remove();
            if ($("#actCre").val() === user_id) {
                var html = '<div class="list showEl" id="viewMember' + dataID + '" onclick="removeMember(uuID = \'' + dataID + '\', img = \'' + imSrc + '\', fullName = \'' + name + '\')">';
            } else {
                var html = '<div class="list showEl" id="viewMember' + dataID + '">';
            }
            html += '<img src="'+ file_server +'profile-pic/Photos/' + imSrc + '">';
            html += '<span class="online_' + dataID + ' ' + (onlineUserList.indexOf(dataID) === -1 ? "offline" : "online") + '"></span>';
            html += '<h1 class="memberName">' + name + '</h1>';
            if ($("#actCre").val() === user_id) {
                html += '<span class="tagcheck forActive" onclick="removeMember(uuID = \'' + dataID + '\', img = \'' + imSrc + '\', fullName = \'' + name + '\')"></span>';
            }
            html += '</div>';
            $('#memberListBackWrap .memberList .creatorThisTodo').after(html);
            $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
            popupMouseEnter();

        }
        if ($('.backwrap').is(':visible') == false) {
            $('#search_members').focus();
        }
    }
}

function viewShareList(event){
    $('#memberListBackWrap').show();
    $('#memberListBackWrap .memberList').html("");
    $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    $.each(user_list, function (ky, va) {
        if (sharedMemberList.indexOf(va.id) !== -1) {
            if ($("#actCre").val() == va.id ) {
                var uuID = va.id;
                var html = '<div class="list showEl creatorThisTodo" id="viewMember' + uuID + '">';
                html += '<img src="'+ file_server +'profile-pic/Photos/' + va.img + '">';
                html += '<span class="online_' + va.id + ' ' + (onlineUserList.indexOf(va.id) === -1 ? "offline" : "online") + '"></span>';
                html += '<h1 class="memberName">' + va.fullname + '</h1>';
                html += '<span class="creator">Owner</span>';
                html += '</div>';
                $('#memberListBackWrap .memberList').append(html);
                popupMouseEnter();
            }
        }
    });
    $.each(user_list, function (ky, va) {
        if (sharedMemberList.indexOf(va.id) !== -1) {
            if ($("#actCre").val() !== va.id) {
                var uuID = va.id;
                if ($("#actCre").val() === user_id) {
                    var html = '<div class="list showEl" id="viewMember' + uuID + '" onclick="removeMember(uuID = \'' + uuID + '\', img = \'' + va.img + '\', fullName = \'' + va.fullname + '\')">';
                } else {
                    var html = '<div class="list showEl" id="viewMember' + uuID + '">';
                }
                html += '<img src="'+ file_server +'profile-pic/Photos/' + va.img + '">';
                html += '<span class="online_' + va.id + ' ' + (onlineUserList.indexOf(va.id) === -1 ? "offline" : "online") + '"></span>';
                html += '<h1 class="memberName">' + va.fullname + '</h1>';
                if ($("#actCre").val() == va.id) {
                    html += '<span class="creator">Owner</span>';
                }
                if ($("#actCre").val() === user_id) {
                    html += '<span class="tagcheck forActive" onclick="removeMember(uuID = \'' + uuID + '\', img = \'' + va.img + '\', fullName = \'' + va.fullname + '\')"></span>';
                }
                html += '</div>';
                $('#memberListBackWrap .memberList').append(html);
                $('#memberListBackWrap .memberList .list.showEl:first').addClass("selected default");
                popupMouseEnter();
            }
        }
    });

    if ($("#actCre").val() === user_id) {
        $.each(user_list, function (ky, va) {
            if (sharedMemberList.indexOf(va.id) == -1) {
                var uuID = va.id;
                if (uuID !== user_id) {
                    var html = '<div class="list showEl" id="viewMember' + uuID + '" onclick="shareThisMember(\'' + uuID + '\',\'' + va.img + '\')">';
                    html += '<img src="'+ file_server +'profile-pic/Photos/' + va.img + '">';
                    html += '<span class="online_' + va.id + ' ' + (onlineUserList.indexOf(va.id) === -1 ? "offline" : "online") + '"></span>';
                    html += '<h1 class="memberName">' + va.fullname + '</h1>';
                    html += '</div>';
                }
                $('#memberListBackWrap .memberList').append(html);
                $('#memberListBackWrap .memberList .list.showEl:first').addClass("selected default");
                popupMouseEnter();
            }
        });
    }
    $('#memberListBackWrap .search_List').focus();
}

$('.search_List').on('keyup', function (e) {
    var value = $(this).val();
    if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
        $(".memberName").each(function () {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('.list').show();
                $(this).parent('.list').addClass('showEl');
            } else {
                $(this).parent('.list').hide();
                $(this).parent('.list').removeClass('showEl');
            }
        });

        $('.memberName').unhighlight();
        $('.memberName').highlight(value);
        $(".memberList .list").removeClass('selected');
        $(".memberList .list.showEl:first").addClass('selected');
    }
});

function removeMember(uuID, img, fullName){
    if($("#subtask"+st_id).is(":visible")){
        socket.emit('toodoUpdate', {
            targetID: st_id,
            type: 'removemember',
            contain: uuID,
            clusteringkey: ci_id
        },
        function (confirmation) {
            removeA(st_participant,uuID);
            $('.suggested-list').html('');
            suggestedUserList();
            popupMouseEnter();
        });

    }else{
        removeA(sharedMemberList, uuID);
        removeA(currentMemberList, uuID);
        if (viewMemberImg.indexOf(uuID) !== -1) {
            removeA(viewMemberImg, uuID);
            $('.memberImg' + uuID + '').remove();
            var newMember = '';
            $.each(sharedMemberList, function (k, v) {
                if (viewMemberImg.indexOf(v) == -1) {
                    if (viewMemberImg.length < 4) {
                        viewMemberImg.push(v);
                        newMember = v;
                    }
                }
            });
            var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
            $.each(user_list, function (ky, va) {
                if (newMember == va.id && newMember !== $("#actCre").val()) {
                    $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + '">');
                }
            });
        }
        $('#viewMember' + uuID + '').remove();
        $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
        $('#sharePeopleList span').text('+' + (sharedMemberList.length - 4));


        if (sharedMemberList.length < 5) {
            $('#sharePeopleList span').hide();
        }

        if ($("#updateAction").val() !== '0') {
            if ($('#live-chat').is(':visible')) {
                var acid = $('#chat_icon').attr('data-activity_id');
            }else{
                var acid = $('.property_notes').attr('data-batch_id');
            }
            socket.emit('toodoUpdate', {
                targetID: acid,
                type: 'removemember',
                contain: uuID,
                clusteringkey: $('#activityCreatedAt').val()
            },
                function (confirmation) {
                    var html = '<div class="list showEl" id="viewMember' + uuID + '" onclick="shareThisMember(\'' + uuID + '\',\'' + img + '\')">';
                    html += '<img src="'+ file_server +'profile-pic/Photos/' + img + '">';
                    html += '<span class="online_' + uuID + ' ' + (onlineUserList.indexOf(uuID) === -1 ? "offline" : "online") + '"></span>';
                    html += '<h1 class="memberName">' + fullName + '</h1>';
                    html += '</div>';
                    $('#memberListBackWrap .memberList').append(html);
                    $('#memberListBackWrap .memberList .list.showEl').removeClass("selected");
                    $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
                    popupMouseEnter();
                });
        }
        if($('#n_ToDo_item').is(':visible')){
            var html = '<div class="list showEl" id="viewMember' + uuID + '" onclick="shareThisMember(\'' + uuID + '\',\'' + img + '\')">';
                html += '<img src="'+ file_server +'profile-pic/Photos/' + img + '">';
                html += '<span class="online_' + uuID + ' ' + (onlineUserList.indexOf(uuID) === -1 ? "offline" : "online") + '"></span>';
                html += '<h1 class="memberName">' + fullName + '</h1>';
                html += '</div>';
                $('#memberListBackWrap .memberList').append(html);
                $('#memberListBackWrap .memberList .list.showEl').removeClass("selected");
                $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
                popupMouseEnter();
        }
    }

}

function unpinActivity(acid){
    $("#pin_unpin").removeClass('pined');
    $("#pin_unpin").attr('src', '/images/basicAssets/custom_not_pin.svg');
    let disPlayCheck = ($("#fla_" + acid).is(':visible') ? "block" : "none");


    let remove = $("#activity_" + acid + ' .remove').length;
    let unrm = parseInt($("#activity_" + acid).attr('data-urm'));

    if (unrm > 0) {
        var urmDis = 'pointer-events: none; background-image: url(/images/basicAssets/greenChat.svg); background-size: 14px 14px; background-repeat: no-repeat; background-position: center; font-size: 12px; color: #000; background-color: white;';
    } else {
        var urmDis = 'background: transparent; pointer-events: none; ';
    }

    if ($("#activity_" + acid).hasClass('od_to')){
        var design = '<li id="activity_' + acid + '" data-activityid="' + acid + '" class="todoLink activeTodo od_to" onclick="startToDo(event)" data-urm=' + unrm + ' ><span class="newtoDo"></span><span class="toDoName">' + $("#activity_" + acid).find('.toDoName').text() + '</span><img id="fla_' + acid + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:' + disPlayCheck + ';width: 13px; height: auto; position: absolute; top: 9px; right: 39px;"><span class="unreadMsgCount"  style="' + urmDis +'"></span>';
        if ($("#activity_" + acid + ' .remove').length > 0) {
            design += '  <span class="remove" onclick="hideThisTodo(event,\'' + acid + '\')"></span>';
        }
        design += '  </li>';
        $("#activity_" + acid).remove();
        $("#overdueULlist").prepend(design);
    }else if ($("#activity_" + acid).hasClass('n_td')) {
        var design = '<li id="activity_' + acid + '" data-activityid="' + acid + '" class="todoLink activeTodo n_td" onclick="startToDo(event)" data-urm=' + unrm + ' ><span class="toDo"></span><span class="toDoName">' + $("#activity_" + acid).find('.toDoName').text() + '</span><img id="fla_' + acid + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:' + disPlayCheck + ';width: 13px; height: auto; position: absolute; top: 9px; right: 39px;"><span class="unreadMsgCount"  style="' + urmDis +'"></span>';
        if ($("#activity_" + acid + ' .remove').length > 0) {
            design += '  <span class="remove" onclick="hideThisTodo(event,\'' + acid + '\')"></span>';
        }
        design += '  </li>';
        $("#activity_" + acid).remove();
        $("#unpinTodoList").prepend(design);
    }

    sidebarFlagActiveAfterDynamicAppand();
}

function pinActivity(acid){
    $("#pin_unpin").addClass('pined');
    $("#pin_unpin").attr('src', '/images/basicAssets/custom_pinned.svg');
    let disPlayCheck = ($("#fla_" + acid).is(':visible') ? "block" : "none");

    let remove = $("#activity_" + acid + ' .remove').length;
    let unrm = parseInt($("#activity_" + acid).attr('data-urm'));

    if (unrm > 0) {
        var urmDis = 'pointer-events: none; background-image: url(/images/basicAssets/greenChat.svg); background-size: 14px 14px; background-repeat: no-repeat; background-position: center; font-size: 12px; color: #000; background-color: white;';
    } else {
        var urmDis = 'background: transparent; pointer-events: none; ';
    }

    if ($("#activity_" + acid).hasClass('od_to')) {
        var design = '<li id="activity_' + acid + '" data-activityid="' + acid + '" class="todoLink activeTodo od_to" onclick="startToDo(event)" data-urm=' + unrm + ' ><span class="toDo"></span><span class="toDoName">' + $("#activity_" + acid).find('.toDoName').text() + '</span><img id="fla_' + acid + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:' + disPlayCheck + ';width: 13px; height: auto; position: absolute; top: 9px; right: 39px;"><span class="unreadMsgCount"  style="' + urmDis +'"></span>';
        if ($("#activity_" + acid + ' .remove').length > 0) {
            design += '  <span class="remove" onclick="hideThisTodo(event,\'' + acid + '\')"></span>';
        }
        design += '  </li>';
        $("#activity_" + acid).remove();
        $("#pinnedToDoList").prepend(design);
    }else if ($("#activity_" + acid).hasClass('n_td')) {
        var design = '<li id="activity_' + acid + '" data-activityid="' + acid + '" class="todoLink activeTodo n_td" onclick="startToDo(event)" data-urm=' + unrm + ' ><span class="toDo"></span><span class="toDoName">' + $("#activity_" + acid).find('.toDoName').text() + '</span><img id="fla_' + acid + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:' + disPlayCheck + ';width: 13px; height: auto; position: absolute; top: 9px; right: 39px;"><span class="unreadMsgCount"  style="' + urmDis +'"></span>';
        if ($("#activity_" + acid + ' .remove').length > 0) {
            design += '  <span class="remove" onclick="hideThisTodo(event,\'' + acid + '\')"></span>';
        }
        design += '  </li>';
        $("#activity_" + acid).remove();
        $("#pinnedToDoList").prepend(design);
    }

    sidebarFlagActiveAfterDynamicAppand();
}

// function todopinunpin(acid) {

//     if ($("#pin_unpin").hasClass('pined')) {

//         var activity = new Activity();
//         activity.activityId = $("#pin_unpin").attr('data-pinid');
//         activity.activityCreatedBy = acid;
//         activity.activityUpdateData = 'unpin';
        
//         activity.activityUtility((response)=>{
//             unpinActivity(acid);
//         });

//     } else {

//         var activity = new Activity();
//         activity.activityId = acid;
//         activity.activityCreatedBy = user_id;
//         activity.activityUpdateData = 'pin';
        
//         activity.activityUtility((response)=>{
//             pinActivity(acid);
//             $("#pin_unpin").attr('data-pinid',response.activityUtilityResponse.respons.id);
//         });
//     }
// };

function show_flag_msg() {
    if (!$("#flaggedFilter").hasClass('activeComFilter')) {
        $("#flaggedFilter").addClass('activeComFilter');
        socket.emit('todosearch', {
            type: 'flag',
            userid: user_id,
            activity_list: currentSerchActivityList
        },
            function (confirmation) {
                if (confirmation.status) {
                    if (currentSerchActivityList.length > 0) {
                        if (!$("#c_flag_ed").is(':visible')) {
                            var design = '<div class="tag_item" id="c_flag_ed"><img src="/images/basicAssets/Flagged.svg" class="flagged"><p class="tagP">Flagged</p><img onclick="removeFlagFilter(\'c_flag_ed\')" class="tagIMG" src="/images/basicAssets/Close.svg"></div>';

                            $('.sideContainer  .tagg_list').append(design);
                        }

                        if ($(".sideContainer .tag_item").length > 0) {
                            $('.sideContainer  .tagg_list').show();
                        }

                        $(".com-t-l").hide();
                        if (confirmation.activities.length > 0) {
                            $.each(confirmation.activities, function (k, v) {
                                if (v.activity_has_flagged != null) {
                                    if (v.activity_has_flagged.length > 0) {
                                        if (v.activity_has_flagged.indexOf(user_id) > -1) {
                                            $("#activity_" + v.activity_id).show();
                                        }
                                    }
                                }
                            });
                        } else {
                            $('.sideContainer  .errMsg').show();
                            $('.sideContainer  .errMsg').text('No result(s) found');

                        }
                    } else {
                        if (!$("#c_flag_ed").is(':visible')) {
                            var design = '<div class="tag_item" id="c_flag_ed"><img src="/images/basicAssets/Flagged.svg" class="flagged"><p class="tagP">Flagged</p><img onclick="removeFlagFilter(\'c_flag_ed\')" class="tagIMG" src="/images/basicAssets/Close.svg"></div>';

                            $('.sideContainer  .tagg_list').append(design);
                        }

                        if ($(".sideContainer .tag_item").length > 0) {
                            $('.sideContainer  .tagg_list').show();
                        }
                        $(".com-t-l").hide();

                        if (confirmation.activities.length > 0) {
                            $.each(confirmation.activities, function (k, v) {
                                if (setFlagConvArray.indexOf(v) === -1) {
                                    setFlagConvArray.push(v);
                                }
                                $("#activity_" + v.activity_id).show();
                            });
                        } else {
                            $('.sideContainer  .errMsg').show();
                            $('.sideContainer  .errMsg').text('No result(s) found');

                        }
                    }
                }
            });
    } else {
        removeFlagFilter('c_flag_ed');
    }

}

function removeFlagFilter(serID){
    setFlagConvArray = [];
    $('.sideContainer  .errMsg').text('');
    $('.sideContainer  .errMsg').hide();
    $("#" + serID).remove();
    $(".com-t-l").show();
    $("#flaggedFilter").removeClass('activeComFilter');

}

function hideThisTodo(event,activityid){
    event.preventDefault();
    event.stopPropagation();
    showRemovePopUp(activityid);
}

///tooltip for todo page

function tooltipforToDo() {
    $('#chat_icon').mouseenter(function () {
        var to_Do_Name = $("#todoTitle").val();
        var selector = $(this);
        setTimeout(function () {
            selector.attr({
                'data-balloon': 'Chat in "' + to_Do_Name + '"',
                'data-balloon-pos': 'up'
            });
        }, 1000);

    });
    $('#tagged_area').mouseenter(function () {
        var selector = $(this);
        setTimeout(function () {
            selector.attr({
                'data-balloon': 'Tag this task',
                'data-balloon-pos': 'up'
            });
        }, 1000);

    });
    // $('.flag').mouseenter(function () {
    //     var selector = $(this);
    //     setTimeout(function () {
    //         selector.attr({
    //             'data-balloon': 'Flag this task',
    //             'data-balloon-pos': 'up'
    //         });
    //     }, 1000);

    // });
    $('#toDoPinUnpinDiv').mouseenter(function () {
        var selector = $(this);
        setTimeout(function () {
            selector.attr({
                'data-balloon': 'Pin this task',
                'data-balloon-pos': 'up'
            });
        }, 1000);

    });
    $('.more').mouseenter(function () {
        var selector = $(this);
        if($('.moreMenuPopup').is(':visible')){
            setTimeout(function () {
                selector.attr({
                    'data-balloon': 'Hide more option',
                    'data-balloon-pos': 'right'
                });
            }, 1000);
        }else{
            setTimeout(function () {
                selector.attr({
                    'data-balloon': 'More Options',
                    'data-balloon-pos': 'right'
                });
            }, 1000);
        }

    });
    $('.voice-call').mouseenter(function () {
        var to_Do_Name = $("#todoTitle").val();
        var selector = $(this);
        setTimeout(function () {
            selector.attr({
                // 'data-balloon': 'Conference call with members of "' + to_Do_Name + '"',
                'data-balloon': 'Voice call',
                'data-balloon-pos': 'up'
            });
        }, 1000);

    });
    $('.video-call').mouseenter(function () {
        var to_Do_Name = $("#todoTitle").val();
        var selector = $(this);
        setTimeout(function () {
            selector.attr({
                // 'data-balloon': 'Video Conference with members of "' + to_Do_Name + '"',
                'data-balloon': 'Video Call',
                'data-balloon-pos': 'up'
            });
        }, 1000);

    });
    $('.side_bar_list_item li').mouseenter(function () {
        var lengthCount = $(this).children('.toDoName').text().length;
        var thisName = $(this).children('.toDoName').text();
        var selector = $(this);
        if (lengthCount > 20) {
            setTimeout(function () {
                selector.attr({
                    'data-balloon-length': 'medium',
                    'data-balloon': '' + thisName + '',
                    'data-balloon-pos': 'up'
                });
            }, 1000);
        }
    });

    $('.name-cell-component .pulse_title').mouseenter(function (e) {
        var desc = $(this).attr('data-title');
        var lengthCount = desc.length;
        var posi = $(e.target).offset();
        var lef = Number($(this).closest('.cell-component').innerWidth()-10);
        if(20 < lengthCount > 70){
            var top = posi.top;
        }else if(71< lengthCount > 145){
            var top = posi.top-50;
        }else if(146 < lengthCount > 215){
            var top = posi.top-50;
        }else{
            var top = posi.top-20;
        }    
        if (lengthCount > 20) {
            $('.customTooltip').text(desc).show();
            
            $('.customTooltip').css('left',posi.left+lef);
            $('.customTooltip').css('top',top+10);
            
        }
    });

    $('.name-cell-component .pulse_title').mouseleave(function (e) {
        $('.customTooltip').text('').hide();
    });
}


$("#createTaskConvTag").on('blur keyup', function (e) {
    if ((e.which >= 65 && e.which <= 90) || e.which == 189 || e.which == 13) {
        var str = $('#createTaskConvTag').val().trim();
        str = str.replace(/<\/?[^>]+(>|$)/g, "");

        if (str != "") {

            $(".taggedList li").each(function () {
                if ($(this).text().toLowerCase().search(str.toLowerCase()) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            $('.taggedList li').unhighlight();
            $('.taggedList li').highlight(str);

            var code = e.keyCode || e.which;

            if (code == 13) { //Enter keycode = 13
                var roomid = $("#createTaskConvTag").attr('data-acid');
                var tagTitle = $("#createTaskConvTag").val();

                e.preventDefault();

                if (tagTitle != "") {

                    if (roomid == "") {
                        toastr["warning"]("You have to select a room or personal conversation", "Warning");
                        $(this).val("");
                    } else {

                        var tagArr = tagTitle.split(',');
                        var sendTagarr = [];
                        var pTag = [];

                        $.each(tagArr, function (k, v) {

                            if (tagListTitle.indexOf(v.toLowerCase()) === -1) {
                                if (alltags.indexOf(v.toLowerCase()) === -1) {

                                    sendTagarr.push(v.trim().toLowerCase().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''));
                                    tagListForFileAttach.push(v.toLowerCase());
                                    tagListTitle.push(v.toLowerCase());
                                    alltags.push(v.toLowerCase());

                                } else {

                                    $('.taggedList li').each(function (tagk, tagv) {
                                        if (v.toLowerCase() == $(tagv).text().toLowerCase()) {
                                            $(tagv).trigger('click');
                                            $("#taskTagItemList").text(tagListTitle.join(','));
                                        }
                                    });
                                }
                            }
                        });

                        $(".taggedList li").each(function () {
                            $(this).show();
                        });

                        $('.taggedList li').unhighlight();


                        if (sendTagarr.length > 0) {
                            socket.emit('saveTag', {
                                created_by: user_id,
                                conversation_id: roomid,
                                tagTitle: sendTagarr,
                                messgids: attachFileList,
                                msgIdsFtag: msgIdsFtag,
                                tagType: "TODO"
                            }, (callBack) => {
                                if (callBack.status) {
                                    $.each(callBack.tags, function (k, v) {
                                        var design = '<li onclick="removeLevel(\'' + v + '\',\'' + roomid + '\',\'' + callBack.roottags[k] + '\')">' + sendTagarr[k] + '<span class="tagcheck" id="level' + v + '" ></span></li>';

                                        tagLsitDetail.push({ 'cnvtagid': v, 'tagid': callBack.roottags[k], 'tagTitle': sendTagarr[k], 'roomid': roomid });
                                        $('.taggedList').append(design);

                                        /* var tag_itemdesign 	= '<div class="added-channel-members">';
                                        tag_itemdesign 	+= '	<input id="tag_'+callBack.roottags[k]+'" data-tagid="'+callBack.roottags[k]+'" data-tagtitle="'+sendTagarr[k]+'" class="checkToDo" type="checkbox">';
                                        tag_itemdesign 	+= '<label for="tag_'+callBack.roottags[k]+'">'+sendTagarr[k]+'</label>';
                                        tag_itemdesign 	+= '</div>';*/

                                        var tag_itemdesign = '<li class="added-tag-list">';
                                        tag_itemdesign +=       '<label for="tag_' + callBack.roottags[k] + '">' + sendTagarr[k] + '';
                                        tag_itemdesign +=           '<input id="tag_' + callBack.roottags[k] + '" data-tagid="' + callBack.roottags[k] + '" data-tagtitle="' + sendTagarr[k] + '" class="checkToDo" type="checkbox">';
                                        tag_itemdesign +=           '<span class="checkmark"></span>';
                                        tag_itemdesign +=       '</label>';
                                        tag_itemdesign +=    '</li>';

                                        $("#taggedItem").append(tag_itemdesign);

                                        my_tag_list[v] = sendTagarr[k];
                                        my_tag_id.push(v);
                                    });

                                    // all_action_for_selected_member();

                                    if (tagListTitle.length > 0) {
                                        $(".tagged").attr('src', '/images/basicAssets/custom_tagged.svg');
                                    }

                                    if (callBack.mtagsid != undefined) {
                                        if (callBack.mtagsid.length > 0) {
                                            $.each(callBack.mtagsid, function (k, v) {
                                                if (msgIdsFtag.indexOf(v) === -1) {
                                                    msgIdsFtag.push(v);
                                                }

                                            });
                                        }
                                    }

                                    $("#createTaskConvTag").val("");
                                    $("#createTaskConvTag").focus();
                                    $("#taskTagItemList").text(tagListTitle.join(','));

                                    $(".taggedList li").each(function () {
                                        $(this).show();
                                    });

                                    $('.taggedList li').unhighlight();


                                } else {
                                    if (callBack.err == 'at') {
                                        toastr["warning"]("\"" + tagTitle + "\" already tagged", "Warning");
                                    }
                                }
                            });
                        }
                    }
                } else {
                    $("#createTaskConvTag").focus();
                }
            }
        } else {
            $(".taggedList li").each(function () {
                $(this).show();
            });

            $('#createTaskConvTag').val($('#createTaskConvTag').val().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''));
        }
    } else {

        var str = $('#createTaskConvTag').val().trim();
        str = str.replace(/<\/?[^>]+(>|$)/g, "");

        if (str == "") {
            $(".taggedList li").each(function () {
                $(this).show();
                $(this).unhighlight();
            });
        }

        if (e.which == 8) {
            $(".taggedList li").each(function () {
                if ($(this).text().toLowerCase().search(str.toLowerCase()) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            $('.taggedList li').unhighlight();
            $('.taggedList li').highlight(str);
        }

        if (e.which == 32) {
            $('#createTaskConvTag').val($('#createTaskConvTag').val().replace(" ", ""));
        } else {
            $('#createTaskConvTag').val($('#createTaskConvTag').val().replace(/[`~!@#$%^&*()|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, ''));
        }

    }
});

function removeLevel(lID, rommID, rootTag){
    var thisText = '';
    var indx = "";

    var sendTagaT = $("#level" + lID).parent('li').text().toLowerCase();

    socket.emit('deleteTag', {
        tagid: lID,
        rommID: rommID,
        msgIdsFtag: msgIdsFtag,
        tagtile: sendTagaT
    }, (callBack) => {
        if (callBack.status) {

            $("#level" + lID).parent('li').attr('id', 'tagLi' + rootTag);
            $("#level" + lID).parent('li').attr('onclick', 'addTagto(\'' + rootTag + '\',\'' + rommID + '\')');
            $("#level" + lID).remove();

            $.each(tagLsitDetail, function (tdk, tdv) {
                if (rootTag == tdv.tagid && rommID == tdv.roomid) {
                    thisText = tdv.tagTitle;
                    indx = tdk;
                }
            });

            removeA(tagListForFileAttach, thisText);
            removeA(tagListTitle, thisText);
            tagLsitDetail.splice(indx, 1);

            $("#taskTagItemList").text(tagListTitle.join(','));

            if (tagListTitle.length > 0) {
                $(".tagged").attr('src', '/images/basicAssets/custom_tagged.svg');
            }

            if (tagListTitle.length == 0) {
                $("#createTaskConvTag").val("");
                $(".tagged").attr('src', '/images/basicAssets/custom_not_tag.svg');
            }
        }
    });
};

function addTagto(lID, rommID){
    var sendTagarr = [];
    var tagssid = [];
    var sendTagaT = $("#tagLi" + lID).text().toLowerCase();
    socket.emit('saveConvTag', {
        tagid: lID,
        conversation_id: rommID,
        messgids: attachFileList,
        msgIdsFtag: msgIdsFtag,
        tagtile: sendTagaT
    }, (callBack) => {
        if (callBack.status) {

            $("#tagLi" + lID).removeAttr('onclick');
            $("#tagLi" + lID).html($("#tagLi" + lID).text() + '<span class="tagcheck" id="level' + callBack.id + '"></span>');

            $("#tagLi" + lID).attr('onclick', 'removeLevel(\'' + callBack.id + '\',\'' + rommID + '\',\'' + lID + '\')');
            $("#tagLi" + lID).removeAttr('id');

            tagListForFileAttach.push(sendTagaT.toLowerCase());
            tagListTitle.push(sendTagaT.toLowerCase());
            tagLsitDetail.push({ 'cnvtagid': callBack.id, 'tagid': lID, 'tagTitle': sendTagaT, 'roomid': rommID });

            if (tagListTitle.length > 0) {
                $("#taskTagItemList").text(tagListTitle.join(','));
                $(".tagged").attr('src', '/images/basicAssets/custom_tagged.svg');
            }

        } else {
            if (callBack.err == 'at') {
                toastr["warning"]("\"" + tagTitle + "\" already tagged", "Warning");
            }
        }
    });
}

$('.chat-upload-popup-content .tagged').on('click', function () {
    // $(this).hide();
    $('.chat-upload-popup-content .addTagConv').show();
    $("#customAdd").focus();
});

//tags filter sratr here

function searchTag(value){
    $("#taggedItem .added-tag-list").each(function () {

        if ($(this).find('label').text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#taggedItem .added-tag-list").unhighlight();
    $("#taggedItem .added-tag-list").highlight(value);
}

function removeTagFilter(id){

    $("#" + id + "_ed").remove();
    $("#" + id).prop('checked', false);

    var splitID = id.split("_");

    $("#pinnedToDoList li").hide();
    $("#overdueULlist li").hide();
    $("#unpinTodoList li").hide();

    removeA(taggedCheckedID, splitID[1]);

    for (var i = 0; i < taggedCheckedRoom.length; i++) {
        if (taggedCheckedRoom[i].tagid == splitID[1])
            taggedCheckedRoom.splice(i);
    }

    getTaggedData(taggedCheckedID);

    if ($(".checkToDo:checked").length == 0) {

        taggedCheckedRoom = [];
        taggedRoomID = [];
        taggedCheckedID = [];

        if (currentConv_list.length > 0) {
            $("#pinnedToDoList li").hide();
            $("#overdueULlist li").hide();
            $("#unpinTodoList li").hide();

            $.each(currentConv_list, function (k, v) {
                $("#activity_" + v).show();
            });

            $.each($('.msgs-form-users'), function () {
                $(this).prev('.msg-separetor').show();
                $(this).show();
            });

            $('.user-msg>p').unhighlight();
            $('.user-msg>p').highlight(searchTagList[searchTagList.length - 1].replace("_", " "));

            $.each($('.msgs-form-users'), function () {
                if ($(this).find('.highlight').length == 0) {
                    $(this).prev('.msg-separetor').hide();
                    $(this).hide();
                } else {
                    $(this).prev('.msg-separetor').show();
                    $(this).show();
                }
            });

            $("#searchText").val(searchTagList[searchTagList.length - 1].replace("_", " "));
            $('#sideBarSearch').val("");
            $('#sideBarSearch').hide();
            $(".side-bar-search-icon").show();
            $('.sidebarSearchremove').hide();
        } else {
            $("#pinnedToDoList li").show();
            $("#overdueULlist li").show();
            $("#unpinTodoList li").show();
        }
    }
}

// $(".checkToDo").click(function (e) {

//     if (e.target.checked) {

//         var tagtitle = $("#" + e.target.id).attr('data-tagtitle');
//         var tagid = $("#" + e.target.id).attr('data-tagid');

//         $('#taggedItem .checkToDo').each(function (i, row) {
//             if ($(row).is(':checked')) {
//                 if (taggedCheckedID.indexOf($(row).attr('data-tagid')) === -1) {
//                     taggedCheckedID.push($(row).attr('data-tagid'));
//                 }
//             }

//         });

//         $("#pinnedToDoList li").hide();
//         $("#overdueULlist li").hide();
//         $("#unpinTodoList li").hide();

//         var design = '<div class="tag_item" id="' + e.target.id + '_ed"><img src="/images/basicAssets/custom_not_tag.svg" class="tagged"><p>' + tagtitle + '</p><img onclick="removeTagFilter(\'' + e.target.id + '\')" src="/images/basicAssets/Close.svg"></div>';

//         $('.tagg_list').append(design);
//         if ($(".tag_item").length > 0) {
//             $('.tagg_list').show();
//         }

//         getTaggedData(taggedCheckedID);

//     } else {

//         $("#" + e.target.id + "_ed").remove();
//         var tagid = $("#" + e.target.id).attr('data-tagid');

//         $("#pinnedToDoList li").hide();
//         $("#overdueULlist li").hide();
//         $("#unpinTodoList li").hide();

//         removeA(taggedCheckedID, tagid);


//         for (var i = 0; i < taggedCheckedRoom.length; i++) {
//             if (taggedCheckedRoom[i].tagid == tagid)
//                 taggedCheckedRoom.splice(i);
//         }

//         getTaggedData(taggedCheckedID);

//         if ($(".checkToDo:checked").length == 0) {

//             taggedCheckedRoom = [];
//             taggedRoomID = [];
//             taggedCheckedID = [];

//             if (currentConv_list.length > 0) {
//                 $("#pinnedToDoList li").hide();
//                 $("#overdueULlist li").hide();
//                 $("#unpinTodoList li").hide();

//                 $.each(currentConv_list, function (k, v) {
//                     $("#activity_" + v).show();
//                 });

//                 $.each($('.msgs-form-users'), function () {
//                     $(this).prev('.msg-separetor').show();
//                     $(this).show();
//                 });

//                 $('.user-msg>p').unhighlight();
//                 $('.user-msg>p').highlight(searchTagList[searchTagList.length - 1].replace("_", " "));

//                 $.each($('.msgs-form-users'), function () {
//                     if ($(this).find('.highlight').length == 0) {
//                         $(this).prev('.msg-separetor').hide();
//                         $(this).hide();
//                     } else {
//                         $(this).prev('.msg-separetor').show();
//                         $(this).show();
//                     }
//                 });

//                 $("#searchText").val(searchTagList[searchTagList.length - 1].replace("_", " "));
//                 $('#sideBarSearch').val("");
//                 $('#sideBarSearch').hide();
//                 $(".side-bar-search-icon").show();
//             } else {
//                 $("#pinnedToDoList li").show();
//                 $("#overdueULlist li").show();
//                 $("#unpinTodoList li").show();
//             }
//         }
//     }
// });

function getTaggedData(Darray) {
    var promises = [];
    var itemRows = Darray;
    for (var i = 0; i < itemRows.length; i++) {
        var id = itemRows[i];
        var p = new Promise(function (resolve, reject) { dbData(id, resolve, reject); });
        promises.push(p);
    }
    Promise.all(promises).then(function (data) {
        recalcTotals(data);
    });
}

function dbData(id, resolve, reject) {
    socket.emit('taggedData', {
        tagid: id
    }, (callBack) => {
        if (callBack.status) {
            return resolve(callBack.tagDet);
        } else {
            return reject();
        }

    });
}

function search(tagid, roomid, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].tagid === tagid && myArray[i].roomid === roomid) {
            return myArray[i];
        }
    }
}

function countElement(item, array) {
    var count = 0;
    $.each(array, function (i, v) { if (v === item) count++; });
    return count;
}

function recalcTotals(data) {
    if (data.length > 0) {
        var dbData = [];

        $.each(data, function (k, v) {
            $.each(v, function (kd, vd) {
                dbData.push(vd);
            });
        });

        $.each(dbData, function (k, v) {
            if (search(v.tag_id, v.conversation_id, taggedCheckedRoom) == undefined) {
                taggedCheckedRoom.push({ 'tagid': v.tag_id, 'roomid': v.conversation_id });
                taggedRoomID.push(v.conversation_id);
            }
        });

        $.each(taggedRoomID, function (k, v) {
            if (parseInt(taggedCheckedID.length) == parseInt(countElement(v, taggedRoomID))) {
                if (currentConv_list.length > 0) {
                    if (currentConv_list.indexOf(v) > -1) {
                        $("#activity_" + v).show();
                    }
                } else {
                    $("#activity_" + v).show();
                    if (tagged_conv_list.indexOf(v) === -1) {
                        tagged_conv_list.push(v);
                    }
                }
            }
        });

    }
}

// Delete message
function delete_this_task_msg(event, all_active){
    tempUpdateAction = $('#updateAction').val();
    tempActivityCreatedAt = $('#actCre').val();
    tempActivityCreatedBy = $('#activityCreatedAt').val();

    var msgid = $(event.target).closest('.chat-message').attr('data-msgid');
    var imgSrc = $('.todo_msgid_' + msgid + '').find('.user-imgs').attr('src');
    var imgHtml = '<div class="msg-user-photo"><img src="' + imgSrc + '"></div>';
    $('.msg-more-popup').hide();
    $('#delete_task_msg_div').show();
    $('.main-deleted-msg').html(imgHtml);
    $('.main-deleted-msg').append('<div class="delbody">' + $('.todo_msgid_' + msgid).find('.chat-message-content').html() + '</div>');
    $('#delete_task_msg_div').find('.btn-msg-del').attr('data-id', msgid);
    $('#delete_task_msg_div').find('.btn-msg-del-all').attr('data-id', msgid);
    if (all_active)
        $('#delete_task_msg_div').find('.btn-msg-del-all').show();
    else
        $('#delete_task_msg_div').find('.btn-msg-del-all').hide();

    var checkdelete = $(event.target).closest('.chat-message').find('.silent_delete');
    if(checkdelete.length > 0){
        $('.btn-msg-del').hide();
        $('.btn-msg-del.btn-msg-del-all').hide();
        $('.btn-msg-del.removeLine').remove();
        $('#delete_task_msg_div').find('.btn-cancel').after('<button type="button" class="btn-msg-del removeLine" onclick="removeThisLine(event,\''+msgid+'\')" data-id="'+msgid+'">Delete</button>');
    }else{
        $('.btn-msg-del.removeLine').remove();
    }
};

function delete_task_commit(e){
    var msgid = $(e).attr('data-id');
    var is_seen = $('.msg_id_del_status_' + msgid).attr('data-val');
    var remove_both_side = $(e).hasClass('btn-msg-del-all');
    if ($('#live-chat').is(':visible')) {
        var dataActivityid = $('.side_bar_list_item li.activeTodo').attr('data-activityid');
    }else{
        var dataActivityid = $('.property_notes').attr('data-batch_id');
    }

    $.ajax({
        url: '/alpha2/commit_msg_delete_for_Todo',
        type: 'POST',
        data: { uid: user_id, activity_id: dataActivityid, msgid: msgid, is_seen: is_seen, remove: remove_both_side },
        dataType: 'JSON',
        success: function (res) {
            if (res.status) {

                if (remove_both_side) {
                    socket.emit("one_user_deleted_this", { msgid: msgid });
                }
                var h4data = $('.todo_msgid_' + msgid).find('.chating_para_2').html();
                var delhtml = '<p> <i><img src="/images/delete_msg.png" class="deleteicon"> You deleted this message. </i><span  class="silent_delete" onclick="removeThisLine(event,\''+msgid+'\')"> (Remove this line)</span></p>';
                $('.todo_msgid_' + msgid).find('.chating_para_2').html('<p>' + delhtml + '</p>');
                closeAllPopUp();
            }
        },
        error: function (err) {
            console.log(err.responseText);
        }
    });
}

function removeThisLine (event,msgid){
    if ($('#live-chat').is(':visible')) {
        var dataActivityid = $('#updateAction').val();
    }else{
        var dataActivityid = $('.property_notes').attr('data-batch_id');
    }
    $.ajax({
        url: '/alpha2/permanent_msg_delete_todo',
        type: 'POST',
        data: { uid: user_id, activity_id: dataActivityid, msgid: msgid, is_seen: 'permanent_delete', remove: true },
        dataType: 'JSON',
        success: function (res) {
            if (res.status) {
                socket.emit('taskMsg_removethisline', { msgid, user_id });
                if($('.todo_msgid_'+msgid).prev().hasClass('msg-separetor'))
                    $('.todo_msgid_'+msgid).prev().remove();

                $('.todo_msgid_'+msgid).remove();
                if($('#delete_task_msg_div').is(':visible'))
                    closeAllPopUp();
                // if($('.chat-message').length == 0){
                //     $("#proChatHistory").html("");
                // }
            }
        },
        error: function (err) {
            console.log(err.responseText);
        }
    });

    closeAllPopUp();
}

socket.on('taskMsg_removedline', function (data) {
    $('.todo_msgid_' + data.msgid).remove();
    $('.todo_msgid_' + data.msgid).find('.createNTFC').remove();
});

socket.on("delete_from_all", function (data) {
    $('.todo_msgid_' + data.msgid).find('.chating_para_2').html("");
    $('.todo_msgid_' + data.msgid).find('.chating_para_2').html("<i><img src='/images/delete_msg.png' class='deleteicon'> This message deleted by sender</i><span  class='silent_delete' onclick='removeThisLine(event,\""+data.msgid+"\")'> (Remove this line)</span><br>");
});

// function filter_unread() {
//     console.log('ddddd');
//     $('.filterMainContainer').hide();
//     $('#todosidecontainer').show();
//     $('#todosidecontainer .backToChat').show();

//     var click_1st_unread_thread = false;

//     $.each($(".side_bar_list_item li"), function (k, per_li) {
//         var has_unread = Number($(per_li).find(".unreadMsgCount").html());
//         if (has_unread < 1) {
//             $(per_li).hide();
//         }
//     });
//     $.each($(".side_bar_list_item li:visible"), function (k, per_li) {
//         var has_unread = Number($(per_li).find(".unreadMsgCount").html());
//         if (has_unread > 0 && click_1st_unread_thread === false) {
//             $(per_li).trigger("click");
//             click_1st_unread_thread = true;
//             return false;
//         }
//     });
// };
/* End Filtaring */

function backToChat() {
    $("#todosidecontainer").hide();
    $('#connectAsideContainer').show();
    ur_replay2ur_msg();
    $(".com-t-l").show();
    $(".label_head_aside").show();
    $('#todosidecontainer .backToChat').hide();
}

function ur_replay2ur_msg() {
    $.each($(".side_bar_list_item li"), function (k, per_li) {
        var nom = Number($(per_li).attr('data-nom')) > 0 ? Number($(per_li).attr('data-nom')) : "";
        $(per_li).find('.unreadMsgCount').html(nom);
    });
};

///keyboard up arrow key and down arrow key
var suggestedActiveLi = function () {
    var activeLI;
    var ind = $('.inputGroup2 .suggested-list li.showEl').each(function (i) {
        if ($(this).hasClass('selected'))
            activeLI = i;
    })
    return activeLI;
}

var viewMemberListActiveLi = function () {
    var activeLI;
    var ind = $('.memberList .showEl').each(function (i) {
        if ($(this).hasClass('selected'))
            activeLI = i;
    })
    return activeLI;
}

var sidebarListActiveLi = function () {
    var activeLI;
    var ind = $('.side_bar_list_item li').each(function (i) {
        if ($(this).hasClass('selected'))
            activeLI = i;
    })
    return activeLI;
}

var sidebarCompActiveLi = function () {
    var activeLI;
    var ind = $('#completedUl li').each(function (i) {
        if ($(this).hasClass('selected'))
            activeLI = i;
    })
    return activeLI;
}

function arrowUpArrowDownKey() {
    /// ArrowUp value = 38
    /// ArrowDown value = 40
    $(document).keydown(function (e) {
        $('.memberList .list').removeClass('default');
        $('.memberList .showEl').removeClass('default');
        if (e.keyCode == 38) {
            e.preventDefault();
            if ($('.backwrap').is(':visible') == false) {
                if ($('.suggested-type-list').is(':visible') == true) {
                    var activeIndexLI = suggestedActiveLi();
                    var newIndexLi = activeIndexLI - 1;
                    var nextLi = $('.inputGroup2 .suggested-list li.showEl:eq(' + newIndexLi + ')');
                    var totalLi = $('.inputGroup2 .suggested-list li.showEl').length;
                    if (totalLi > newIndexLi) {
                        if (newIndexLi == -1) {
                            $('.suggested-type-list .os-viewport').animate({ scrollTop: 72 * totalLi }, 1);
                        } else {
                            if (totalLi > newIndexLi) {
                                newIndexLi -= 3;
                                $('.suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                            }
                        }
                    }
                    $('.inputGroup2 .suggested-list li.showEl').removeClass('selected');
                    if (nextLi.length) {
                        nextLi.addClass('selected');
                    }
                } else if (!$('#completedSidecontainer').is(':visible') && !$('#todoTitle').is(':focus') && !$('.todo-calender.hasDatepicker').is(':visible') && inputValueCountFun('addTodoCheckList', 'id') == false && inputValueCountFun('search_members', 'id') == false && inputValueCountFun('sideBarSearch', 'id') == false && !$('.notes_area').is(':focus') && !$('.checkName').is(':focus') && inputValueCountFun('chatbox', 'conte') == false && inputValueCountFun('createTaskConvTag', 'id') == false && inputValueCountFun('todo_chat_search_input', 'id') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible')) {
                    var activeIndexLI = sidebarListActiveLi();
                    var newIndexLi = activeIndexLI - 1;
                    var nextLi = $('.side_bar_list_item li:eq(' + newIndexLi + ')');
                    var sideBarHeight = $('#hayvenSidebar').height();
                    var sidebarLiCount = (sideBarHeight - 296) / 29;
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
                        // nextLi.click();
                    }
                    else {
                        $('.side_bar_list_item li:first').addClass('selected');
                        // $('.side_bar_list_item li:first').click();
                    }
                } else if (!$('#completedSidecontainer').is(':visible') && !$('#todoTitle').is(':focus') && !$('.todo-calender.hasDatepicker').is(':visible') && inputValueCountFun('addTodoCheckList', 'id') == false && inputValueCountFun('search_members', 'id') == false && inputValueCountFun('sideBarSearch', 'id') == false && !$('.notes_area').is(':focus') && !$('.checkName').is(':focus') && inputValueCountFun('chatbox', 'conte') == false && inputValueCountFun('createTaskConvTag', 'id') == false && inputValueCountFun('todo_chat_search_input', 'id') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible')) {
                    var activeIndexLI = sidebarCompActiveLi();
                    var newIndexLi = activeIndexLI - 1;
                    var nextLi = $('#completedSidecontainer li:eq(' + newIndexLi + ')');

                    $('.side_bar_list_item li').removeClass('selected');

                    if (nextLi.length) {
                        nextLi.addClass('selected');
                        // nextLi.click();
                    }
                    else {
                        $('#completedSidecontainer li:first').addClass('selected');
                        // $('.side_bar_list_item li:first').click();
                    }
                }
            }
            if ($('#memberListBackWrap').is(':visible') == true) {
                var activeIndexLI = viewMemberListActiveLi();
                var newIndexLi = activeIndexLI - 1;
                var nextLi = $('.memberList .list.showEl:eq(' + newIndexLi + ')');
                var totalLi = $('.memberList .list.showEl').length;
                if (totalLi > newIndexLi) {

                    if (newIndexLi == -1) {
                        $('.forScrollBar .os-viewport').animate({ scrollTop: 72 * totalLi }, 1);
                    } else {
                        if (totalLi > newIndexLi) {
                            newIndexLi -= 4;
                            $('.forScrollBar .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                        }
                    }
                }

                $('.memberList .list.showEl').removeClass('selected');

                if (nextLi.length) {
                    nextLi.addClass('selected');
                }
                else {
                    $('.memberList .list.showEl:first').addClass('selected');
                    $('.forScrollBar .os-viewport').animate({ scrollTop: 0 }, 1);
                }
            }
        }

        if (e.keyCode == 40) {
            e.preventDefault();
            if ($('.backwrap').is(':visible') == false) {
                if ($('.suggested-type-list').is(':visible') == true) {
                    var activeIndexLI = suggestedActiveLi();
                    var newIndexLi = activeIndexLI + 1;
                    var nextLi = $('.suggested-list li.showEl:eq(' + newIndexLi + ')');
                    if (newIndexLi > 3) {
                        newIndexLi -= 3
                        $('.suggested-type-list .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                    }

                    $('.suggested-list li.showEl').removeClass('selected');

                    if (nextLi.length) {
                        nextLi.addClass('selected');
                    }
                    else {
                        $('.inputGroup2 .suggested-list li.showEl:first').addClass('selected');
                        $('.suggested-type-list .os-viewport').animate({ scrollTop: 0 }, 1);
                    }
                } else if (!$('#completedSidecontainer').is(':visible') && !$('#todoTitle').is(':focus') && !$('.todo-calender.hasDatepicker').is(':visible') && inputValueCountFun('addTodoCheckList', 'id') == false && inputValueCountFun('search_members', 'id') == false && inputValueCountFun('sideBarSearch', 'id') == false && !$('.notes_area').is(':focus') && !$('.checkName').is(':focus') && inputValueCountFun('chatbox', 'conte') == false && inputValueCountFun('createTaskConvTag', 'id') == false && inputValueCountFun('todo_chat_search_input', 'id') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible')) {
                    var activeIndexLI = sidebarListActiveLi();
                    var newIndexLi = activeIndexLI + 1;
                    var nextLi = $('.side_bar_list_item li:eq(' + newIndexLi + ')');
                    var sideBarHeight = $('#hayvenSidebar').height();
                    var sidebarLiCount = (sideBarHeight - 500) / 29;
                    if (newIndexLi > sidebarLiCount) {
                        newIndexLi -= sidebarLiCount
                        $('.side-bar .os-viewport').animate({ scrollTop: 29 * newIndexLi }, 1);
                    }
                    $('.side_bar_list_item li').removeClass('selected');
                    if (nextLi.length) {
                        // nextLi.click();
                        nextLi.addClass('selected');
                    }
                    else {
                        $('.side_bar_list_item li:first').addClass('selected');
                        $('.side-bar .os-viewport').animate({ scrollTop: 0 }, 1);
                    }
                } else if (!$('#completedSidecontainer').is(':visible') && !$('#todoTitle').is(':focus') && !$('.todo-calender.hasDatepicker').is(':visible') && inputValueCountFun('addTodoCheckList', 'id') == false && inputValueCountFun('search_members', 'id') == false && inputValueCountFun('sideBarSearch', 'id') == false && !$('.notes_area').is(':focus') && !$('.checkName').is(':focus') && inputValueCountFun('chatbox', 'conte') == false && inputValueCountFun('createTaskConvTag', 'id') == false && inputValueCountFun('todo_chat_search_input', 'id') == false && !$('#ChatFileUpload_task').is(':visible') && !$('#ChatFileUpload').is(':visible')) {
                    var activeIndexLI = sidebarCompActiveLi();
                    var newIndexLi = activeIndexLI + 1;
                    var nextLi = $('#completedSidecontainer li:eq(' + newIndexLi + ')');

                    $('.side_bar_list_item li').removeClass('selected');
                    if (nextLi.length) {
                        // nextLi.click();
                        nextLi.addClass('selected');
                    }
                    else {
                        $('#completedSidecontainer li:first').addClass('selected');
                    }
                }
            }
            if ($('#memberListBackWrap').is(':visible') == true) {
                var activeIndexLI = viewMemberListActiveLi();
                var newIndexLi = activeIndexLI + 1;
                var nextLi = $('.memberList .list.showEl:eq(' + newIndexLi + ')');
                if (newIndexLi > 4) {
                    newIndexLi -= 4
                    $('.forScrollBar .os-viewport').animate({ scrollTop: 64 * newIndexLi }, 1);
                }

                $('.memberList .list.showEl').removeClass('selected');

                if (nextLi.length) {
                    nextLi.addClass('selected');
                }
                else {
                    $('.memberList .list.showEl:first').addClass('selected');
                    $('.forScrollBar .os-viewport').animate({ scrollTop: 0 }, 1);
                }
            }
        }

    });
}


function filter_completed() {
    if (!$('#completedFilter').hasClass('activeComFilter')) {
        $('#completedFilter').addClass('activeComFilter')
        socket.emit('getCompletedTodo', {
            user_id: user_id
        }, (response) => {
            if (response.res.status) {
                if (response.res.activities.length > 0) {
                    $(".activitySideBar").hide();

                    $("#completedSidecontainer").remove();

                    var html = '<div class="sideContainer" id="completedSidecontainer"><div class="tagg_list" style="display: none;"></div><span class="errMsg" style="display: none;"></span><div class="label_head_aside"><h3>Completed</h3><span class="add-items-icon acceptCheck"></span></div><ul class="side_bar_list_item" id="completedUl">';
                    $.each(response.res.activities, function (k, v) {
                        html += '<li id="activity_' + v.activity_id + '" data-activityid="' + v.activity_id + '" data-urm=0 class="com-t-l todoLink" onclick="startToDo(event)">';
                        html += '<span class="toDo"></span>';
                        html += '<span class="toDoName">' + v.activity_title + '</span>';
                        html += '<span class="unreadMsgCount"></span>';
                        html += '<span class="remove" onclick="hideThisTodo(event)"></span>';
                        html += '</li>';
                    });
                    html += '</ul></div>';
                    $("#hayvenSidebar .os-content").append(html);
                    $('#completedSidecontainer li:first').click();
                    $('#completedSidecontainer li:first').addClass('activeTodo');

                    if (!$("#c_com_ed").is(':visible')) {
                        var design = '<div class="tag_item" id="c_com_ed"><span class="acceptCheck flagged"></span><p class="tagP">Completed</p><img onclick="removeCompletedFilter(\'c_com_ed\')" class="tagIMG" src="/images/basicAssets/Close.svg"></div>';

                        $('.sideContainer  .tagg_list').append(design);
                    }

                    if ($(".sideContainer .tag_item").length > 0) {
                        $('.sideContainer  .tagg_list').show();
                    }

                } else {

                    $(".activitySideBar").hide();

                    $("#completedSidecontainer").remove();

                    var html = '<div class="sideContainer" id="completedSidecontainer"><div class="tagg_list" style="display: none;"></div><span class="errMsg" style="display: none;"></span><div class="label_head_aside" style="margin-top: 25px;"><h3>Completed</h3><span class="add-items-icon acceptCheck"></span></div></div>';
                    $("#hayvenSidebar .os-content").append(html);

                    if (!$("#c_com_ed").is(':visible')) {
                        var design = '<div class="tag_item" id="c_com_ed"><span class="acceptCheck flagged"></span><p class="tagP">Completed</p><img onclick="removeCompletedFilter(\'c_com_ed\')" class="tagIMG" src="/images/basicAssets/Close.svg"></div>';

                        $('.sideContainer  .tagg_list').append(design);
                    }

                    if ($(".sideContainer .tag_item").length > 0) {
                        $('.sideContainer  .tagg_list').show();

                        $('.sideContainer  .errMsg').text('No result found');
                        $('.sideContainer  .errMsg').show();
                    }

                }
            }
        });
    } else {
        removeCompletedFilter();
    }

}

function removeCompletedFilter() {
    $('#completedFilter').removeClass('activeComFilter')
    if (getCookie('lastActive') != "") {
        $('.side_bar_list_item li').removeClass('activeTodo selected');
        $("#activity_" + getCookie('lastActive')).trigger('click');
        $("#activity_" + getCookie('lastActive')).addClass('activeTodo selected');
    } else {
        $('.side_bar_list_item li').removeClass('activeTodo selected');
        $("ul#unpinTodoList li").first().click();
        $("ul#unpinTodoList li").first().addClass('activeTodo selected');
    }
    $("#completedSidecontainer").remove();
    $("#c_com_ed").remove();

    $(".activitySideBar").show();
    $("#pinnedToDoList li").hide();
    $("#overdueULlist li").hide();
    $("#unpinTodoList li").hide();

    $('.sideContainer  .errMsg').text('');
    $('.sideContainer  .errMsg').hide();

    $('.side_bar_list_item li').each(function (k, v) {
        $(v).show();
    });

    $('.side_bar_list_item>li').unhighlight();
}

//Set the caret focus always to end in contenteditable
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
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

function checkedYes() {
    if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
        
        var activityId = $('#updateAction').val()
        var clusteringKey = $("#actCre").val();

        const activity = new Activity();
            activity.activityId          = activityId;
            activity.clusteringKey       = clusteringKey;
            activity.activityUpdateData  = 'Completed';
            activity.activityType        = 'Task';
            activity.activityUpdateType  = 'taskStatus';
        
        activity.activityUpdate((response)=>{
            console.log(response);
            toastr['success']('Task has been completed successfully', 'Task Complete');
            $("#completed_activity_div").hide();
        });
    }else{
        toastr['warning']('You are not eligible for complete this task', 'Task Complete');
    }
}

function checkedNo() {
    if ($('#live-chat').is(':visible')) {
        var acid = $('#chat_icon').attr('data-activity_id');
    }else{
        var acid = $('.property_notes').attr('data-batch_id');
    }
    socket.emit('toodoUpdate', {
        targetID: acid,
        type: 'completed',
        contain: -1,
        clusteringkey: $('#activityCreatedAt').val()
    },
        function (confirmation) {
            toastr['success']('TODO has been completed successfully', 'TODO Complete');
            $("#completed_activity_div").hide();
            $("#activity_" + acid).remove();
            $("ul#unpinTodoList li").first().click();
        });
}

function checkedOk() {
    if ($('#live-chat').is(':visible')) {
        var acid = $('#chat_icon').attr('data-activity_id');
    }else{
        var acid = $('.property_notes').attr('data-batch_id');
    }
    socket.emit('toodoUpdate', {
        targetID: acid,
        type: 'completed',
        contain: 0,
        clusteringkey: $('#activityCreatedAt').val()
    }, function (confirmation) {
        toastr['success']('TODO has been completed successfully', 'TODO Complete');
        $("#completed_activity_div").hide();
        $("#activity_" + acid).remove();
        $("ul#unpinTodoList li").first().click();
    });
}

function reopenCheckedYes() {
    if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
        if ($('#live-chat').is(':visible')) {
			var activityId = $('#chat_icon').attr('data-activity_id');
		}else{
			var activityId = $('.property_notes').attr('data-batch_id');
		}
        var clusteringKey = $("#actCre").val();

        const activity = new Activity();
            activity.activityId          = activityId;
            activity.clusteringKey       = clusteringKey;
            activity.activityUpdateData  = 'Working';
            activity.activityType        = 'Task';
            activity.activityUpdateType  = 'taskStatus';
        
        activity.activityUpdate((response)=>{
            toastr['success']('TODO has been reopened successfully', 'TODO Reopen');
            $("#reopen_activity_div").hide();
            $("#activity_" + acid).remove();
            var comli = $('ul#completedUl > li:visible').length;
            if (comli === 0) {
                removeCompletedFilter('c_com_ed');
            } else {
                $("ul#completedUl li").first().click();
            }
        });
    }else{
        toastr['warning']('You are not eligible for complete this task', 'TODO Complete');
    }
}

function reopenCheckedNo() {
    if ($('#live-chat').is(':visible')) {
        var acid = $('#chat_icon').attr('data-activity_id');
    }else{
        var acid = $('.property_notes').attr('data-batch_id');
    }
    socket.emit('toodoUpdate', {
        targetID: acid,
        type: 'incomplete',
        contain: -1,
        clusteringkey: $('#activityCreatedAt').val()
    },
        function (confirmation) {
            toastr['success']('TODO has been reopened successfully', 'TODO Reopen');
            $("#reopen_activity_div").hide();
            $("#activity_" + acid).remove();
            $("ul#completedUl li").first().click();
        });
}

function reopenCheckedOk() {
    if ($('#live-chat').is(':visible')) {
        var acid = $('#chat_icon').attr('data-activity_id');
    }else{
        var acid = $('.property_notes').attr('data-batch_id');
    }
    socket.emit('toodoUpdate', {
        targetID: acid,
        type: 'incomplete',
        contain: 1,
        clusteringkey: $('#activityCreatedAt').val()
    },
        function (confirmation) {
            toastr['success']('TODO has been reopened successfully', 'TODO Reopen');
            $("#reopen_activity_div").hide();
            $("#activity_" + acid).remove();
            $("ul#completedUl li").first().click();
        });
}

///edit checklist

function editThisCheckList(event){
    $(event.target).parent('li').find('.checkName').css({ 'text-overflow': 'unset' });
    var data_chid = $(event.target).attr('data-chid');
    $(event.target).parent('li').find('.checkName').attr('contenteditable', 'true');
    $(event.target).parent('li').find('.checkName').attr('id', 'thisCheckId' + data_chid + '');
    todoCheckid = $(event.target).parent('li').find('.checkName').attr('id');
    $('#' + todoCheckid).focus();
    placeCaretAtEnd(document.getElementById(todoCheckid));

    var value = $(event.target).parent('li').find('.checkName').text();
    thisCheckEdit = value;
};

function editToDoCheckName(event, chid){
    if (event.keyCode == 13) {
        if ($(event.target).text().length !== 0) {
            if ($("#updateAction").val() == 0) {
                checklistiTEM[$(event.target).attr('data-indexof')] = $(event.target).text();
                $(event.target).css({
                    'text-overflow': 'ellipsis'
                });
            } else {
                var clusteringkey = $('#chat_icon').attr('data-activity_id');
                socket.emit('toodoUpdate', {
                    targetID: chid,
                    type: 'checkitem',
                    contain: $(event.target).text(),
                    clusteringkey: clusteringkey
                },
                    function (confirmation) {
                        $(event.target).css({
                            'text-overflow': 'ellipsis'
                        });
                    });
            }
        } else {
            toastr['warning']('Please contact with todo creator', 'Warning');
        }
    }
}

function editCheckListOnBlur(event, chid){
    if ($(event.target).text().length !== 0) {
        if ($("#updateAction").val() == 0) {
            checklistiTEM[$(event.target).attr('data-indexof')] = $(event.target).text();
            $(event.target).css({
                'text-overflow': 'ellipsis'
            });
        } else {
            var clusteringkey = $('#chat_icon').attr('data-activity_id');
            socket.emit('toodoUpdate', {
                targetID: chid,
                type: 'checkitem',
                contain: $(event.target).text(),
                clusteringkey: clusteringkey
            },
                function (confirmation) {
                    $(event.target).css({
                        'text-overflow': 'ellipsis'
                    });
                });
        }
    } else {
        toastr['warning']('Please contact with todo creator', 'Warning');
    }
}

function removeTaskUsertag(event){
    $(".side_bar_list_item[data-type='TASK'] li").each(function (k, v) {
        if (mytodolist.indexOf($(v).attr('data-activityid')) === -1) {
            mytodolist.push($(v).attr('data-activityid'));
        }
    });
    socket.emit('getAllTagsforList', {
        myconversation_list: mytodolist
    }, (callBack) => {
        if (callBack.status) {
            var my_tagged_ids = callBack.data;
            $('#memberListBackWrap').show();
            $('#memberListBackWrap').html("");

            var html = '<div class="adminContainer">';
            html += '	<div class="closeBackwrap" onclick="closeAllPopUp()"><img src="/images/basicAssets/close_button.svg"></div>';
            html += '	<div class="label">';
            html += '		<h1 class="label_Title">Tag(s) </h1>';
            html += '	</div>';
            html += '	<input type="text" class="searchMember" placeholder="Search by title" onkeyup="searchtags($(this).val());">';
            html += '	<span class="remove searchClear"></span>';
            html += '	<div class="suggest_Container overlayScrollbars" style="display: block;">';
            html += '		<ul class="suggested-list tagslistFloting">';

            $.each(my_tag_list, function (ky, va) {
                if (my_tagged_ids.indexOf(ky) !== -1) {
                    html += '		<li id="t_' + ky + '">';
                    html += '			<div class="list" id="member' + ky + '">';
                    html += '				<h1 class="memberName">' + va + '</h1>';
                    html += '				<span class="tagcheck"></span>';
                    html += '			</div>';
                    html += '		</li>';
                }
            });

            $.each(my_tag_list, function (ky, va) {
                if (my_tagged_ids.indexOf(ky) === -1) {
                    html += '		<li id="t_' + ky + '">';
                    html += '			<div class="list" id="member' + ky + '">';
                    html += '				<h1 class="memberName">' + va + '</h1>';
                    html += '				<span class="remove" onclick="removeTaskTagsUnused(\'' + ky + '\',\'' + va + '\');"></span>';
                    html += '			</div>';
                    html += '		</li>';
                }
            });

            html += '		</ul>';
            html += '	</div>';
            html += '</div>';

            overlayScrollbars();
            $('#memberListBackWrap').append(html);
            $('.remove.searchClear').on('click', function () {
                $('.searchMember').val('');
                $('.adminContainer li').show();
                $('.adminContainer li').addClass('showEl');
                $('.adminContainer li.showEl').removeClass('selected');
                $('.adminContainer li.showEl:first').addClass('selected');
                $(this).hide();
            });
        }
    });
}

function removeTaskTagsUnused(id, title){
    socket.emit('deleteUnusedTag', {
        tagid: id,
        convid: $("#updateAction").val(),
        tagTitle: title,
        type: 'task'
    }, (callBack) => {
        if (callBack.status) {
            $("#t_" + id).remove();
            var indx = '';

            $.each(tagLsitDetail, function (tdk, tdv) {
                if (id == tdv.tagid && title == tdv.tagTitle) {
                    indx = tdk;
                }
            });

            removeA(tagListForFileAttach, title);
            removeA(tagListTitle, title);
            removeA(alltags, title);
            removeA(my_tag_list, title);
            removeA(my_tag_id, id);

            tagLsitDetail.splice(indx, 1);

            $("#taskTaggedList li").each(function () {
                if ($(this).text() == title) {
                    $(this).remove();
                }
            });
        }
    });
}

function searchtags(thisval){

    $(".tagslistFloting li .memberName").each(function () {

        if ($(this).text().toLowerCase().search(thisval.toLowerCase()) > -1) {
            $(this).closest('li').show();
        } else {
            $(this).closest('li').hide();
        }
    });

    $('.tagslistFloting li .memberName').unhighlight();
    $('.tagslistFloting li .memberName').highlight(thisval);
}

function toggleObserver(event,type,uid,imSrc){
    var html = '<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + imSrc + '" data-uuid="' + uid + '" class="observers memberImg' + uid + '">';
    var acid = $('#chat_icon').attr('data-activity_id');
    if($(event).find('.observer_checkbox').hasClass('checked')){
        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'ObserverRemove',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {
            removeA(observer,uid);
            $(event).find('.observer_checkbox').removeClass('checked');
            $(event).find('.observer_checkbox').addClass('unchecked');
            if($('#observerPeopleList .memberImg' + uid + '').is(':visible')){
                $('#observerPeopleList .memberImg' + uid + '').remove();
                var imageList = [];
                    $.each($('#observerPeopleList .observers'), (k,v)=>{
                        imageList.push($(v).attr('data-uuid'));
                    });
                    $.each(observer,(k,v)=>{
                        if(imageList.indexOf(v) == -1){
                           var html = '<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">';
                           $('#observerPeopleList').find('.sharing_label').after(html);
                           return false;
                        }
                    });
                if(observer.length > 3){
                    $('#observerPeopleList span').text('+' + (observer.length - 3));
                }else{
                    $('#observerPeopleList span').hide();
                }
            }else{
                if(observer.length > 3){
                    $('#observerPeopleList span').text('+' + (observer.length - 3));
                }else{
                    $('#observerPeopleList span').hide();
                }
            }

        });
    }

    if($(event).find('.observer_checkbox').hasClass('unchecked')){

        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'ObserverAdd',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {
            observer.push(uid);
            $(event).find('.observer_checkbox').addClass('checked');
            $(event).find('.observer_checkbox').removeClass('unchecked');

            if ($('#observerPeopleList .observers').length < 3) {
                $('#observerPeopleList').find('.sharing_label').after(html);
            
            }else{
                $('#observerPeopleList span').show();
                $('#observerPeopleList span').text('+' + (observer.length - 3));
            }


            if($("#st_toDoMember"+ uid +" .coown").hasClass('checked')){
                socket.emit('toodoUpdate', {
                    targetID: acid,
                    type: 'CoownerAdd',
                    contain: uid,
                    clusteringkey: $('#activityCreatedAt').val()
                },
                function (confirmation) {
                    removeA(observer,uid);
                    $("#st_toDoMember"+ uid +" .coown").removeClass('checked');
                    $("#st_toDoMember"+ uid +" .coown").addClass('unchecked');
                });
            }
        });
    }
}

function toggleCoowner(event,type,uid,imSrc){
    var html = '<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + imSrc + '" data-uuid="' + uid + '" class="owners memberImg' + uid + '">';
    var acid = $('#chat_icon').attr('data-activity_id');
    if($(event).find('.owner_checkbox').hasClass('checked')){
        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'CoownerRemove',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {
            removeA(coowner,uid);
            $(event).find('.owner_checkbox').removeClass('checked');
            $(event).find('.owner_checkbox').addClass('unchecked');

            if($('#ownerPeopleList .memberImg' + uid + '').is(':visible')){
                $('#ownerPeopleList .memberImg' + uid + '').remove();
                var imageList2 = [];
                    $.each($('#ownerPeopleList .owners'), (k,v)=>{
                       imageList2.push($(v).attr('data-uuid'));
                    });
                    $.each(coowner,(k,v)=>{
                        if(imageList2.indexOf(v) == -1){
                           var html = '<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="owners memberImg' + v + '">';
                           $('#ownerPeopleList').find('.sharing_label').after(html);
                           return false;
                        }
                    });
                if(coowner.length > 2){
                    $('#ownerPeopleList span').text('+' + (coowner.length - 2));
                }else{
                    $('#ownerPeopleList span').hide();
                }
            }else{
                if(coowner.length > 2){
                    $('#ownerPeopleList span').text('+' + (coowner.length - 2));
                }else{
                    $('#ownerPeopleList span').hide();
                }
            }
        });
    }

    if($(event).find('.owner_checkbox').hasClass('unchecked')){

        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'CoownerAdd',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {
            coowner.push(uid);
            $(event).find('.owner_checkbox').addClass('checked');
            $(event).find('.owner_checkbox').removeClass('unchecked');

            if ($('#ownerPeopleList .owners').length < 2) {
                $('#ownerPeopleList').find('.sharing_label').after(html);
            
            }else{
                $('#ownerPeopleList span').show();
                $('#ownerPeopleList span').text('+' + (coowner.length - 2));
            }

            if($("#st_toDoMember"+ uid +" .obsrv").hasClass('checked')){
                socket.emit('toodoUpdate', {
                    targetID: acid,
                    type: 'ObserverRemove',
                    contain: uid,
                    clusteringkey: $('#activityCreatedAt').val()
                },
                function (confirmation) {
                    removeA(observer,uid);
                    $("#st_toDoMember"+ uid +" .obsrv").removeClass('checked');
                    $("#st_toDoMember"+ uid +" .obsrv").addClass('unchecked');
                });
            }
        });
    }
}

function toggleAssignee(event,type,uid,imSrc){
    var html = '<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + imSrc + '" data-uuid="' + uid + '" class="assignees memberImg' + uid + '">';
    var acid = $('#chat_icon').attr('data-activity_id');
    var check = $('#assigneePeopleList').find('.assignees').remove();
    
    if($(event).find('.assigne_radio').hasClass('checked')){
        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'AssigneeRemove',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {
            removeA(assignee,uid);
            assigneeOnDlt();
            $(event).find('.assigne_radio').removeClass('checked');
            $(event).find('.assigne_radio').addClass('unchecked');
        });
    }

    if($(event).find('.assigne_radio').hasClass('unchecked')){

        socket.emit('toodoUpdate', {
            targetID: acid,
            type: 'AssigneeAdd',
            contain: uid,
            clusteringkey: $('#activityCreatedAt').val()
        },
        function (confirmation) {

            $(".assign").each(function(k,e){
                $(e).removeClass('checked');
                $(e).addClass('unchecked');
            });

            assignee = [];
            assignee.push(uid);
            $(event).find('.assigne_radio').addClass('checked');
            $(event).find('.assigne_radio').removeClass('unchecked');
            $('#assigneePeopleList').find('.sharing_label').after(html);
        });
    }
}

function suggestedUserList() {
    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
    if($("#subtask"+st_id).is(":visible")){
        $('.suggested-list').html('');
        $.each(user_list, function (ky, va) {
            if (va.id !== user_id) {
                if (sharedMemberList.indexOf(va.id) > -1) {
                    var imSrc = va.img;
                    var dataID = va.id;
                    if(st_participant.indexOf(va.id) > -1){
                        // var definedList = '<li onclick="removeMember(\'' + va.id + '\', \''+imSrc+'\', \''+va.fullName+'\')" id="st_toDoMember' + dataID + '" class="showEl">';
                        var definedList = '<li id="st_toDoMember' + dataID + '" class="showEl">';
                        definedList += '      <img src="'+ file_server +'profile-pic/Photos/' + va.img + '" class="profile">';
                        definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> ';

                        definedList += '      <div class="visibleTagMedia">';
                        definedList += '          <span class="active obsrv" onclick="filterTagMedia(this,$(this).attr(\'data-type\'),\'dddd\')" data-type="remove"> dddd</span>';
                        definedList += '          <span class="active assign" onclick="filterTagMedia(this,$(this).attr(\'data-type\'),\'aaa\')" data-type="remove"> aaa</span>';
                        definedList += '      </div>';

                        // definedList += '      <span class="tagcheck forActive" id="forActive'+va.id+'"  style="margin-top: 22px !important; display:block"></span>';
                        definedList += '    </li>';
                        var info = findObjForUser(dataID);
                        $("#st_toDoMember"+ dataID +" .assign").css("background-image", "url(''+ file_server +'profile-pic/Photos/" +info.img +"')");
                    }else{
                        var definedList = '<li onclick="shareThisMember(\'' + dataID + '\',\'' + imSrc + '\', \''+va.fullName+'\')" id="st_toDoMember' + dataID + '" class="showEl">';
                        definedList += '      <img src="'+ file_server +'profile-pic/Photos/' + va.img + '" class="profile">';
                        definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span>';
                        definedList += '      <div class="visibleTagMedia">';
                        definedList += '          <span class="inactive obsrv" onclick="filterTagMedia(this,$(this).attr(\'data-type\'),\'dddd\')" data-type="remove"> dddd</span>';
                        definedList += '          <span class="inactive assign" onclick="filterTagMedia(this,$(this).attr(\'data-type\'),\'aaa\')" data-type="remove"> aaa</span>';
                        definedList += '      </div>';
                        // definedList += '      <span class="tagcheck forActive" id="forActive'+va.id+'" style="margin-top: 22px !important; display:none"></span>';
                        definedList += '    </li>';
                    }
                    $('.suggested-list').append(definedList);
                    $('.suggested-list li.showEl:first').addClass("selected default");
                }
            }
        });
    }else{

        if(openInput == 'search_members'){
            var scanList = observer;
        }else if(openInput == 'search_observer'){
            var scanList = coowner;
        }else{
            var scanList = [];
        }

        if($('#actCre').val() == user_id){
            $.each(user_list, function (ky, va) {
                 if (va.id !== user_id) {
                    if(scanList.indexOf(va.id) === -1){
                        var imSrc = va.img;
                        var dataID = va.id;
                        var definedList1 = '<li id="st_toDoMember' + dataID + '" class="showEl" onclick="toggleCoowner(this,\'Coowner\',\'' + va.id + '\',\'' + imSrc + '\')">';
                        definedList1 += '      <div class="owner_checkbox '+(coowner.indexOf(va.id.toString()) > -1 ? "checked":"unchecked" )+' coown"></div>';
                        definedList1 += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> ';
                        definedList1 += '    </li>';

                        var definedList2 = '<li id="st_toDoMember' + dataID + '" class="showEl" onclick="toggleObserver(this,\'Observer\',\'' + va.id + '\',\'' + imSrc + '\')">';
                        definedList2 += '      <div class="observer_checkbox '+(observer.indexOf(va.id.toString()) > -1 ? "checked":"unchecked" )+' obsrv"></div>';
                        definedList2 += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> ';
                        definedList2 += '    </li>';

                        var definedList3 = '<li id="st_assigneeMember' + dataID + '" class="showEl" onclick="toggleAssignee(this,\'Assignee\',\'' + va.id + '\',\'' + imSrc + '\')">';
                        definedList3 += '      <div class="assigne_radio '+(assignee.indexOf(va.id.toString()) > -1 ? "checked":"unchecked" )+' assign"></div>';
                        definedList3 += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> ';
                        definedList3 += '    </li>';

                        
                        $('.owners-list').append(definedList1);
                        $('.observers-list').append(definedList2);
                        $('.assignee-list').append(definedList3);
                    }

                 }

             });
        }else{
            $.each(user_list, function (ky, va) {
                if (sharedMemberList.indexOf(va.id) !== -1) {
                    if(va.id == $('#actCre').val()){
                        var imSrc = va.img;
                        var dataID = va.id;
                        var definedList = '<li id="toDoMember' + dataID + '" class="showEl">';
                        definedList += '      <img src="'+ file_server +'profile-pic/Photos/' + va.img + '" class="profile">';
                        definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> <span class="designation-name">@ Navigate</span>';
                        definedList += '        <span class="creator" style="line-height:10px; margin-top:18px;">Owner</span>';
                        definedList += '    </li>';
                        $('.suggested-list').append(definedList);
                        $('.suggested-list li.showEl:first').addClass("selected default");
                    }
                }
            });
            $.each(user_list, function (ky, va) {
                if (sharedMemberList.indexOf(va.id) !== -1) {
                    if(va.id !== $('#actCre').val()){
                        var imSrc = va.img;
                        var dataID = va.id;
                        var definedList = '<li id="toDoMember' + dataID + '" class="showEl">';
                        definedList += '      <img src="'+ file_server +'profile-pic/Photos/' + va.img + '" class="profile">';
                        definedList += '      <span class="name s-l-def-clas" data-uuid="' + va.id + '">' + va.fullname + '</span> <span class="designation-name">@ Navigate</span>';
                        definedList += '    <span class="tagcheck forActive" style="margin-top: 20px;"></span>';
                        definedList += '    </li>';
                        $('.suggested-list').append(definedList);
                        $('.suggested-list li.showEl:first').addClass("selected default");
                    }
                }
            });
        }
    }


}

$('#search_members, #search_observer, #search_assignee').on('click', function (e) {
    openInput = e.target.id;
    var value = $(this).val();
    var suggested_ist = $(this).siblings('.suggested-type-list')
    if (value == 0) {
        suggested_ist.show();
        $(".suggested-list li.showEl").removeClass('selected');
        $(".suggested-list li.showEl:first").addClass('selected default');
        $('.suggested-type-list .os-viewport').animate({ scrollTop: 0 }, 1);
    }
    $('.suggested-list').html("");
    suggestedUserList();
    popupMouseEnter();
});

//
socket.on('remove_on_fly', function (response) {

    if (response.status == '200') {
        if ($("#tdCLI" + response.message.checklist_id).is(':visible')) {
            var title = $("#tdCLI" + response.message.checklist_id + " .checkName").text();
            var createdby = $("#tdCLI" + response.message.checklist_id).attr('data-createdby');
            removeA(checklistiTEM, title);
            $("#tdCLI" + response.message.checklist_id).remove();

            countBoxes()
            // isChecked();

            toastr.options.closeButton = true;
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr["success"](createdby + " has deleted" + " \"" + title + "\"  from quicklist", "Success");
        } else {
            var todoName = $("#activity_" + response.message.clusteringkey + " .toDoName").text();

            toastr.options.closeButton = true;
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr["success"]("Quick list item has deleted from " + " \"" + todoName + "\"  Task", "Success");
        }

    }
});

socket.on('new_checklist', function (response) {
    if (response.status == '200') {
        $.each(response.res.checklistids, function (k, v) {

            var checkListHtml = '<li class="todoChelistLI" id="tdCLI' + v + '"   data-createdby="' + userlistWithname[response.message.createdBy] + '" data-balloon="Ceated by ' + userlistWithname[response.message.createdBy] + '" data-balloon-pos="right">';
            checkListHtml += '  <label class="country-label"> ';
            checkListHtml += '  <span class="checkName" onblur="editCheckListOnBlur(event,\'' + v + '\')" onkeydown="editToDoCheckName(event,\'' + v + '\')">' + response.message.checklist[k] + '</span>';
            checkListHtml += '      <input class="todoCheckBoxInput" type ="checkbox" value="' + v + '" id="' + v + '">';
            checkListHtml += '      <span class="checkmark"></span>';
            checkListHtml += '  </label>';
            checkListHtml += '</li>';

            $(".new-added-check-list").append(checkListHtml);
        });
    }

});

socket.on('deleteParticipants_socket', function (response) {
    var activityid = response.params.data.activityId;
    var id = response.params.data.targetID;

    if(response.params.data.participantType == 'coowner'){

        $(".coowner"+activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="'+id+'"]').remove();
        let totalImg = $("#coowner"+activityid).find('.person-bullet-component.inline-image').find('img');

        $.each(totalImg,function(k,v){
          if(k > 2){
            $(v).hide();
          }else{
            $(v).show();
          }
        })
        if(totalImg.length > 3){
          $(".coowner"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').show();
          $(".coowner"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').text('+ '+((totalImg.length) - 3)+'');

        }else{
          if(totalImg.length == 0){
            if($(".coowner"+activityid).find('.person-bullet-image demo_img.demo_img').length == 0){
              $(".coowner"+activityid)
              .find('.person-bullet-component.inline-image')
              .find('.more_observer')
              .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
            }
          }

          $(".coowner"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').hide();
        }
    }else if(response.params.data.participantType == 'observer'){
        $(".observer"+activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="'+id+'"]').remove();
        let totalImg = $("#observer"+activityid).find('.person-bullet-component.inline-image').find('img');

        $.each(totalImg,function(k,v){
          if(k > 2){
            $(v).hide();
          }else{
            $(v).show();
          }
        })
        if(totalImg.length > 3){
          $(".observer"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').show();
          $(".observer"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').text('+ '+((totalImg.length) - 3)+'');

        }else{
          if(totalImg.length == 0){
            if($(".observer"+activityid).find('.person-bullet-image demo_img.demo_img').length == 0){
              $(".observer"+activityid)
              .find('.person-bullet-component.inline-image')
              .find('.more_observer')
              .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
            }
          }

          $(".observer"+activityid).find('.person-bullet-component.inline-image').find('.more_observer').hide();
        }
    }

    var obList = $(".observer"+activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="'+id+'"]').length;
    var coList = $(".coowner"+activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="'+id+'"]').length;

    if((obList == 0) && (coList == 0)){
        var asList = $(".assignee"+activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="'+id+'"]').length;
        if(asList == 0){
            $("#pulse_"+activityid).remove();
            removeA(myAllActivityGlobal,activityid);
        }
    }

    if(myAllActivityGlobal.length > 0){
        taskShowHideElement(true);
    }else{
        taskShowHideElement(false);
    }

});

socket.on('CreateActivityBrdcst', function (response) {

    if (response.status == '200') {
        if (response.params.data.activityCreatedBy != user_id) {
            var userList = [];
            $.each(response.params.data.participant, function(k,v){
                if(userList.indexOf(v.id) ==-1){
                    userList.push(v.id); 
                }
            });

            if(response.params.data.activity_type == 'Task' ){
                if (userList.indexOf(user_id) > -1) {
                    var todoDesign = '<li id="activity_' + response.params.data.activity_id + '" data-activityid="' + response.params.data.activity_id + '" data-urm=0 class="com-t-l todoLink n_td" onclick="startToDo(event)">';
                    todoDesign += '     <span class="toDo" ></span >';
                    todoDesign += '     <span class="toDoName">' + response.params.data.activityTitle + '</span>';
                    todoDesign += '     <img id="fla_' + response.params.data.activity_id + '" data-createdat="' + response.params.data.activity_id + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">';
                    todoDesign += '     <span class="unreadMsgCount"></span>';
                    todoDesign += '</li>';
    
                    toastr.options.closeButton = true;
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 1000;
                    toastr["success"]("Your assigned to a new task \"" + response.params.data.activityTitle + "\" by \"" + userlistWithname[response.params.data.activityCreatedBy] + "\"", "Success");
    
                    $("#unpinTodoList").prepend(todoDesign);
                }
            }else if(response.params.data.activity_type == 'SubTask'){

                if (userList.indexOf(user_id) > -1) {
                    activityHistory(response.params.data.activity_id)
                    .then((res) => {

                        var activityDetail = res.activityDetail.activityDetail;

                        if($("#activity_"+activityDetail.activity_root_id.toString()).hasClass('activeTodo')){
                            subActivityClone(activityDetail, res.participants_ss);
                            taskShowHideElement(true);
                        }

                        toastr.options.closeButton = true;
                        toastr.options.timeOut = 2000;
                        toastr.options.extendedTimeOut = 1000;
                        toastr["success"]("Your assigned to a new sub task \"" + response.params.data.activityTitle + "\" by \"" + userlistWithname[response.params.data.activityCreatedBy] + "\"", "Success");
                    }).catch((err) => {
                        console.log(5019,err);
                    });
                }
            }
        }
    }
});

socket.on('update_activity_on_fly', function (response) {
    if (response.status == '200') {
        
        switch (response.params.data.activityUpdateType) {
            case 'delete_to_do':
                deleteTodo_onfly(response.data.targetID);
                break;
            case 'title':
                titleUpdate_onfly(response.params.data);
                break;
            case 'checklistchecked':
                checklistchecked_onfly(response);
                break;
            case 'checklistunchecked':
                checklistunchecked_onfly(response);
                break;
            case 'checkitem':
                checklistEdit_onfly(response);
                break;
            case 'taskDescKeyUp':
                noteUpdate_onfly(response.params.data);
                break;
            case 'duedate':
                duedateUpdate_onfly(response.params.data);
                break;
            case 'addmember':
                addmember_onfly(response);
                break;
            case 'removemember':
                removemember_onfly(response);
                break;
            case 'completed':
                wishList_com_onfly(response);
                break;
            case 'incomplete':
                wishList_incom_onfly(response);
                break;
            case 'participants':
                addmember_onActivity(response.params.data);
                break;
            case 'taskStatus':
                taskStatus_onActivity(response.params.data);
                break;
            case 'workspace':
                taskWorkspace_onActivity(response.params.data);
                break;
            case 'priority':
                taskPriority_onActivity(response.params.data);
                break;
            case 'taskBAinput':
                budget_onActivity(response.params.data);
                break;
            case 'taskAAinput':
                actual_onActivity(response.params.data);
                break;
            default:
                break;
        }
        // if (response.data.type != user_id) {

        // }
    }
});

function addmember_onActivity(data){
    if(data.activityUpdateData.length > 0){
        var uList = [];

        $.each(data.activityUpdateData, function (k, v) {
            if(uList.indexOf(v.id) === -1){
                uList.push(v.id);
            }
        });

        if (!$("#activity_" + data.targetId).is(':visible')) {
            activityHistory(data.targetId)
            .then((res) => {
                
                var result = res.activityDetail.activityDetail;
                
                var todoDesign = '<li id="activity_' + result.activity_id + '" data-activityid="' + result.activity_id + '" data-urm=0 class="com-t-l todoLink n_td" onclick="startToDo(event)">';
                todoDesign += '     <span class="toDo" ></span >';
                todoDesign += '     <span class="toDoName">' + result.activity_title + '</span>';
                todoDesign += '     <img id="fla_' + result.activity_id + '" data-createdat="' + result.activity_id + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">';
                todoDesign += '     <span class="unreadMsgCount"></span>';
                todoDesign += '</li>';

                $("#unpinTodoList").prepend(todoDesign);
            }).catch((err) => {
                console.log(5019,err);
            });
        }else{
            if ($("#activity_" + data.targetId).is(':visible')) {

                if(data.participantType == 'owner'){
                    coowner = [];
                }else if(data.participantType == 'observer'){
                    observer = [];
                }else if(data.participantType == 'assignee'){
                    assignee = [];
                }
                
                $.each(workspace_user, function (kw, vw) {
                    if (uList.indexOf(vw.id.toString()) > -1) {
                        if(data.participantType == 'owner'){
                            
                            if(coowner.indexOf(vw.id.toString()) == -1){
                                coowner.push(vw.id.toString());
                                $('#taskOwnerList img').remove();
                                // $('#taskOwnerList .count_plus').hide();
                                var currentImage = [];
                                var ownerid = $('#actCre').val();
                                $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(ownerid).img + '" data-uuid="' + ownerid + '" class="sharedIMG memberImg' + ownerid + ' ownerThisToDo">');
                                currentImage.push(ownerid);
                                $.each(coowner,(k,v)=>{
                                    currentImage.push(v);
                                    if(currentImage.length < 4){
                                        $('#taskOwnerList .ownerThisToDo').after('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="sharedIMG memberImg' + v + '">');
                                    }
                                    if (currentImage.length > 3) {
                                        $('#taskOwnerList .count_plus').show();
                                        $('#taskOwnerList .count_plus').text('+' + (currentImage.length - 3));
                                    }
                                    $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                                });
                            }

                            var coList = $('#taskOwnerList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                            var obList = $('#taskObserverList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                            var asList = $('#taskAssigneeList').find('img[data-uuid="'+vw.id.toString()+'"]').length;

                            if((obList == 0) && (coList == 0) && (asList == 0)){
                                $('#unpinTodoList li:first').click();
                            }
                        }else if(data.participantType == 'observer'){
                            if(observer.indexOf(vw.id.toString()) == -1){
                                observer.push(vw.id.toString()); 
                                // $('#taskObserverList img').remove();
                                // $('#taskObserverList .count_plus').hide();
                                var currentImage = [];
                                $.each(observer,(k,v)=>{
                                    currentImage.push(v);
                                    if(currentImage.length < 4){
                                        $('#taskObserverList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
                                    }
                                    if (currentImage.length > 3) {
                                        $('#taskObserverList .count_plus').show();
                                        $('#taskObserverList .count_plus').text('+' + (currentImage.length - 3));
                                    }
                                    $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                                });
                                if(observer.length > 0){
                                    // $('#taskObserverList').attr('placeholder', '');
                                }else{
                                    $('#taskObserverList').attr('placeholder', 'Add Observer');
                                }

                                var coList = $('#taskOwnerList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                                var obList = $('#taskObserverList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                                var asList = $('#taskAssigneeList').find('img[data-uuid="'+vw.id.toString()+'"]').length;

                                if((obList == 0) && (coList == 0) && (asList == 0)){
                                    $('#unpinTodoList li:first').click();
                                }
                            }
                        }else if(data.participantType == 'assignee'){
                            if(assignee.indexOf(vw.id.toString()) == -1){
                                assignee.push(vw.id.toString());
                                // $('#taskAssigneeList img').remove();
                                // $('#taskAssigneeList .count_plus').hide();
                                var currentImage = [];
                                $.each(assignee,(k,v)=>{
                                    currentImage.push(v);
                                    if(currentImage.length < 4){
                                        $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="assignees memberImg' + v + '">');
                                    }
                                    if (currentImage.length > 3) {
                                        $('#taskAssigneeList .count_plus').show();
                                        $('#taskAssigneeList .count_plus').text('+' + (currentImage.length - 3));
                                    }
                                    $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                                });

                                if(assignee.length > 0){
                                    // $('#taskAssigneeList').attr('placeholder', '');
                                }else{
                                    $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
                                }

                                var coList = $('#taskOwnerList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                                var obList = $('#taskObserverList').find('img[data-uuid="'+vw.id.toString()+'"]').length;
                                var asList = $('#taskAssigneeList').find('img[data-uuid="'+viewMemberImg.id.toString()+'"]').length;

                                if((obList == 0) && (coList == 0) && (asList == 0)){
                                    $('#unpinTodoList li:first').click();
                                }
                            }
                        }
                    }
                });

                
                

                
            }
            
        }
    }
    
    if(data.participantedTblID.length > 0){
        if(data.participantedTblID.indexOf(user_id) > -1){
            if(data.participantType == 'owner'){
                $('#taskObserverList .sharedIMG').filter('[data-tblid="'+user_id+'"]').remove();
            }else if(data.participantType == 'observer'){
                $('#taskObserverList .observers').filter('[data-tblid="'+user_id+'"]').remove();
            }else if(data.participantType == 'assignee'){
                $('#taskObserverList .assignees').filter('[data-tblid="'+user_id+'"]').remove();
            }
            
        }
    }
}

function taskPriority_onActivity(data) {
    $('#priority'+data.targetId+' .single_priority' ).each(function(ksp,vsp) {
        if($(vsp).find('.priorityLabel').text() == data.activityUpdateData){
            socketFire = true;
            $(vsp).trigger('click');
            socketFire = false;
        }
    });
}

function budget_onActivity(data) {
    $("#AmountCellSpan"+data.targetId).text(data.activityUpdateData);
    var AmountCellSpan = $("#AmountCellSpan"+data.targetId).text();
    var actualCellSpan = $("#actualCellSpan"+data.targetId).text();

    $("#varianceCellSpan"+data.targetId).text((AmountCellSpan == '' ? 0 : AmountCellSpan) - (actualCellSpan == '' ? 0:actualCellSpan).toFixed(2));

    varienceCollect();
}

function actual_onActivity(data) {
    $("#actualCellSpan"+data.targetId).text(data.activityUpdateData);
    var AmountCellSpan = $("#AmountCellSpan"+data.targetId).text();
    var actualCellSpan = $("#actualCellSpan"+data.targetId).text();

    $("#varianceCellSpan"+data.targetId).text((AmountCellSpan == '' ? 0 : AmountCellSpan) - (actualCellSpan == '' ? 0:actualCellSpan).toFixed(2));
    varienceCollect();
}

function taskStatus_onActivity(data) {
    if(data.activityType == 'Task'){
        if ($("#activity_" + data.targetId).is(':visible')) {
            if ($("#updateAction").val() === data.targetId) {
                $("#taskStatusSelect option").each(function () {
                    $(this).removeAttr("selected");
                });
                $("#taskStatusSelect").find('option[value="' + data.activityUpdateData + '"]').attr("selected", true);
            }
        }
    }else if(data.activityType == 'SubTask'){
        $('#status'+data.targetId+' .single_status' ).each(function(kss,vss) {
            if($(vss).find('.statusLabel').text() == data.activityUpdateData){
                socketFire = true;
                $(vss).trigger('click');
                socketFire = false;
            }
        });
    }
    
}

function taskWorkspace_onActivity(data) {
    if ($("#activity_" + data.targetId).is(':visible')) {
        if ($("#updateAction").val() === data.targetId) {
            $("#selectWorkspace option").each(function () {
                $(this).removeAttr("selected");
            });
            $("#selectWorkspace").find('option[value="' + data.activityUpdateData + '"]').attr("selected", true);
        }
    }
}

function wishList_com_onfly(data) {
    if (data.data.type == 'completed') {
        if ($("#activity_" + data.data.targetID).is(':visible')) {
            $("#activity_" + data.data.targetID).remove();
            if ($("#updateAction").val() === data.data.targetID) {
                $('.side_bar_list_item li:first').click();
                $('.side_bar_list_item li:first').addClass('activeTodo selected');
            }
        }
    }
}

function wishList_incom_onfly(data) {
    if (data.data.type == 'incomplete') {
        if ($("#activity_" + data.data.targetID).is(':visible')) {
            $("#activity_" + data.data.targetID).remove();
            if ($("#updateAction").val() === data.data.targetID) {
                $('.side_bar_list_item li:first').click();
                $('.side_bar_list_item li:first').addClass('activeTodo selected');
            }
        }
    }
}

function titleUpdate_onfly(data) {
    if (data.activityUpdateType == 'title') {
        if (data.activityType == 'task') {
            if ($("#activity_" + data.targetId).is(':visible')) {
                $("#activity_" + data.targetId + " .toDoName").text(data.activityUpdateData);
                if ($("#updateAction").val() === data.targetId) {
                    $("#todoTitle").val(data.activityUpdateData)
                }
            }
        }else{
            if ($("#pulse_" + data.targetId).is(':visible')) {
                $("#pulse_" + data.targetId + " .pulse_title").text(data.activityUpdateData);
            }
        }
        
    }
}

function noteUpdate_onfly(data) {
    if ($("#activity_" + data.targetId).is(':visible')) {
        if ($("#updateAction").val() === data.targetId) {
            $("#notes_area").val(data.activityUpdateData)
        }
    }
}

function checklistEdit_onfly(data) {
    if (data.data.type == 'checkitem') {
        if ($("#tdCLI" + data.data.targetID).is(':visible')) {

            let checkItemTitle = $("#tdCLI" + data.data.targetID + " .checkName").text();
            toastr.options.closeButton = true;
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr["success"]("\"" + checkItemTitle + "\" Checklist Item update to \"" + data.data.contain + "\"", "Success");
            $("#tdCLI" + data.data.targetID + " .checkName").text(data.data.contain);
        }
    }
}

function checklistchecked_onfly(data) {
    if (data.data.type == 'checklistchecked') {
        if ($("#tdCLI" + data.data.targetID).is(':visible')) {
            let checkItemTitle = $("#tdCLI" + data.data.targetID + " .checkName").text();
            let createdby = $("#tdCLI" + data.data.targetID).attr('data-createdby');
            toastr.options.closeButton = true;
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr["success"]("\"" + checkItemTitle + "\" Checklist Item checked by \"" + userlistWithname[data.data.usrid] + "\"", "Success");
            $("#" + data.data.targetID).prop('checked', true);
            countBoxes();
            // isChecked();
        }
    }
}

function checklistunchecked_onfly(data) {
    if (data.data.type == 'checklistunchecked') {
        if ($("#tdCLI" + data.data.targetID).is(':visible')) {
            let checkItemTitle = $("#tdCLI" + data.data.targetID + " .checkName").text();
            let createdby = $("#tdCLI" + data.data.targetID).attr('data-createdby');
            toastr.options.closeButton = true;
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr["success"]("\"" + checkItemTitle + "\" Checklist Item unchecked by \"" + userlistWithname[data.data.usrid] + "\"", "Success");
            $("#" + data.data.targetID).prop('checked', false);
            countBoxes();
            // isChecked();
        }
    }
}

function duedateUpdate_onfly(data) {
    if(data.activityType == 'Task'){
        if ($("#activity_" + data.targetId).is(':visible')) {
            if ($("#updateAction").val() === data.targetId) {
                $("#dueDatePicker").val(data.activityUpdateData)
            }
        }
    }else if(data.activityType == 'SubTask'){
        $("#dueDate"+data.targetId).val(moment(data.activityUpdateData).format('YYYY-MM-DD'));
    }
}

function deleteTodo_onfly(activityID) {
    if ($("#activity_" + activityID).is(':visible')) {
        var todoName = $("#activity_" + activityID + " .toDoName").text();

        toastr.options.closeButton = true;
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = 1000;
        toastr["success"]("\"" + todoName + "\" Todo has been deleted", "Success");

        $("#activity_" + activityID).remove();
        var numrelated = $('.side_bar_list_item > li:visible').length;
        if (numrelated == 0) {
            createNewTodo();
        } else {
            if ($("#updateAction").val() === activityID) {
                if (getCookie('lastActive') != "") {

                    $('.side_bar_list_item li').removeClass('activeTodo selected');
                    if ($("#activity_" + getCookie('lastActive')).is(':visible')) {
                        $("#activity_" + getCookie('lastActive')).trigger('click');
                        $("#activity_" + getCookie('lastActive')).addClass('activeTodo selected');
                    } else {
                        $('.side_bar_list_item li:first').click();
                        $('.side_bar_list_item li:first').addClass('activeTodo selected');
                    }
                } else {
                    // createNewTodo();
                    $('.side_bar_list_item li:first').click();
                    $('.side_bar_list_item li:first').addClass('activeTodo selected');
                }
            }
        }
    }
}

function removemember_onfly(data) {
    if (data.data.type == 'removemember') {

        if (data.data.contain === user_id) {

            if ($("#activity_" + data.data.targetID).is(':visible')) {

                var todoName = $("#activity_" + data.data.targetID + " .toDoName").text();

                toastr.options.closeButton = true;
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 1000;
                toastr["success"]("You are removed from \"" + todoName + "\" Todo", "Success");

                $("#activity_" + data.data.targetID).remove();

                if ($("#updateAction").val() === data.data.targetID) {
                    $('.side_bar_list_item li:first').click();
                    $('.side_bar_list_item li:first').addClass('activeTodo selected');
                }
            }
        } else {

            let uuID = data.data.contain;

            removeA(sharedMemberList, uuID);
            removeA(currentMemberList, uuID);
            if (viewMemberImg.indexOf(uuID) !== -1) {
                removeA(viewMemberImg, uuID);
                $('.memberImg' + uuID + '').remove();
                var newMember = '';
                $.each(sharedMemberList, function (k, v) {
                    if (viewMemberImg.indexOf(v) == -1) {
                        if (viewMemberImg.length < 4) {
                            viewMemberImg.push(v);
                            newMember = v;
                        }
                    }
                });
                var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                $.each(user_list, function (ky, va) {
                    if (newMember == va.id && newMember !== $("#actCre").val()) {
                        $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + '">');
                    }
                });
            }
            $('#viewMember' + uuID + '').remove();
            $('#memberListBackWrap .list_Count').text('(' + sharedMemberList.length + ')');
            $('#sharePeopleList span').text('+' + (sharedMemberList.length - 4));


            if (sharedMemberList.length < 5) {
                $('#sharePeopleList span').hide();
            }
        }
    }
}

function addmember_onfly(data) {
    if (data.data.type == 'addmember') {
        if (data.data.contain === user_id) {
            if (!$("#activity_" + data.data.targetID).is(':visible')) {
                getThisActivitydetail(data.data.targetID)
                    .then((result) => {
                        var todoDesign = '<li id="activity_' + result.activity_id + '" data-activityid="' + result.activity_id + '" data-urm=0 class="com-t-l todoLink n_td" onclick="startToDo(event)">';
                        todoDesign += '     <span class="toDo" ></span >';
                        todoDesign += '     <span class="toDoName">' + result.activity_title + '</span>';
                        todoDesign += '     <img id="fla_' + result.activity_id + '" data-createdat="' + result.activity_id + '" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">';
                        todoDesign += '     <span class="unreadMsgCount"></span>';
                        todoDesign += '</li>';

                        $("#unpinTodoList").prepend(todoDesign);
                    }).catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            if ($("#activity_" + data.data.targetID).is(':visible')) {
                if ($("#updateAction").val() === data.data.targetID) {
                    if (currentMemberList.indexOf(data.data.contain) === -1) {
                        currentMemberList.push(data.data.contain);
                    }

                    var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                    $.each(user_list, function (ky, va) {
                        if (currentMemberList.indexOf(data.data.contain) !== -1) {
                            if (sharedMemberList.indexOf(data.data.contain) == -1) {
                                sharedMemberList.push(data.data.contain);
                                $(".count_member").text('' + sharedMemberList.length + ' members');
                            }
                            if (currentMemberList.length < 4 && va.id == data.data.contain) {
                                $('#sharePeopleList .ownerThisToDo').after('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + data.data.contain + '" class="sharedIMG memberImg' + data.data.contain + '">');
                                viewMemberImg.push(data.data.contain);
                            }

                            if (currentMemberList.length > 3) {
                                $('#sharePeopleList span').show();
                                $('#sharePeopleList span').text('+' + (currentMemberList.length - 3));
                            }
                        }
                    });

                }
            }

        }
    }
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

function activityHistory(activity_id) {
    return new Promise((resolve, reject) => {
        var activity = new Activity();
        activity.activityId = activity_id
        activity.activityHistory((response)=>{
            if(response.activityDetail.status){
                resolve(response);
            }else{
                reject(response)
            }
        });
    });
}

function designForUsers (type){
    if(type == 'admin'){
        $('#dueDatePicker').css('background-color', '#ffffff');
        $('#selectWorkspace').css('background-color', '#ffffff');
        $('#notes_area').css('background-color', '#ffffff');
        $('#dueDatePicker').css('border', '1px solid #E1E4E8');
        $('#selectWorkspace').css('border', '1px solid #E1E4E8');
        $('#notes_area').css('border', '1px solid #E1E4E8');
    }else{
        $('#dueDatePicker').css('background-color', '#FAFAFA');
        $('#selectWorkspace').css('background-color', '#FAFAFA');
        $('#notes_area').css('background-color', '#FAFAFA');
        $('#dueDatePicker').css('border', '1px solid #d8d8d8');
        $('#selectWorkspace').css('border', '1px solid #d8d8d8');
        $('#notes_area').css('border', '1px solid #d8d8d8');
    }
}

function findObjForUser(value) {
	for (var i = 0; i < user_list.length; i++) {
		if (user_list[i]['id'] === value) {
			var userData ={
				email: user_list[i].email,
				fullname: user_list[i].fullname,
				id: user_list[i].id,
				img: user_list[i].img,
				designation: user_list[i].designation,

			}
			return userData;
		}
	}
	return false;
}

function subtaskCheckClick(){
    $(".todoCheckBoxInput").click(function (e) {
        e.stopImmediatePropagation();

        var acid = $(e.target).val();
        var clusteringkey = $('#chat_icon').attr('data-activity_id');

        if ($(e.target).is(':checked')) {

            // socket.emit('toodoUpdate', {
            //     targetID: acid,
            //     type: 'checklistchecked',
            //     contain: 1,
            //     clusteringkey: clusteringkey,
            //     usrid: user_id
            // },
            // function (confirmation) {
            //     // confirmation.msg;
            //     updateCookieData('response', 'activities', acid, 'checked');
            // });
        } else {
            // socket.emit('toodoUpdate', {
            //     targetID: acid,
            //     type: 'checklistunchecked',
            //     contain: 0,
            //     clusteringkey: clusteringkey,
            //     usrid: user_id
            // },
            // function (confirmation) {
            //     // confirmation.msg;
            //     updateCookieData('response', 'activities', acid, 'unchecked');
            // });
        }
    });
}

function drawSubtaskGroup(){
    var htm = $( "#nextweek .pulse-component-wrapper" ).html();
}

function todoEditorkeyDown(e,ele){
    if(e.keyCode == 13){
    }
}

function cusToDoMorebtn(ele){
    var tar_ele = $(ele).closest(".ds-menu-button-container").find("#custom_toDoMoreOption");
    if($(tar_ele).hasClass('open2')){
        hideMoreDialogTask(true);
    }else{
        $(tar_ele).addClass('open2');
        $('#custom_toDoMoreOptionView').show();
        $('#custom_toDoMoreOptionView .dialog-node').show();
    }
}

function taskManage(ele,type){
    temppMangeList = [];
    removeList = [];
    $('#taskManage').show();
    $('#taskManage').attr('data-type',type);
    $('#taskManage .perU_profile').remove();
    $('#task_Member_List input').focus();
    $('#updateTaskListBtn').attr('data-type',type);
    $('#addActivitAdminBtn').attr('data-type',type);
    $('#taskManage .memberList').html('');
    $('#updateTaskListBtn').hide();
    $('#task_Member_List').css('width','100%');
    $('#task_Member_List').css('width','calc(100% - 92px)');
    
    if((coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) && !$("#n_ToDo_item").is(':visible')){
        $('#updateTaskListBtn').show();
        $('#addActivitAdminBtn').hide();
        $('#task_Member_List').css('width','calc(100% - 92px)');
    }else{
        $('#updateTaskListBtn').hide();
        $('#addActivitAdminBtn').show();
    }

    if(type == 'owner'){
        $('#taskManage .list_Count').text('('+(coowner.length + 1 )+')');
        if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
            
            $.each(coowner,(k,v)=>{
                temppMangeList.push(v);
                $('#task_Member_List').prepend(boxUserDesign(v));
            });

            $.each(user_list,(k,v)=>{
                if(v.id !== $('#actCre').val()){
                    if(coowner.indexOf(v.id) == -1){
                        $('#taskManage .memberList').append(backwrapListDesign(v.id));
                    }
                }
            });

        }else{
            $('#taskManage .memberList').append(listDesignFu('Creator',$('#actCre').val()));
            $.each(user_list,(k,v)=>{
                if(coowner.indexOf(v.id) > -1){
                    $('#taskManage .memberList').append(listDesignFu('Admin',v.id));
                }
            });
        }
    }else if(type == 'observer'){
        $('#taskManage .list_Count').text('('+observer.length+')');
        if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
            $.each(observer,(k,v)=>{
                temppMangeList.push(v);
                $('#task_Member_List').prepend(boxUserDesign(v));
            });
            $.each(user_list,(k,v)=>{
                if(v.id !== $('#actCre').val()){
                    if(observer.indexOf(v.id) == -1){
                        $('#taskManage .memberList').append(backwrapListDesign(v.id));
                    }
                }
            });
        }else{
            $.each(user_list,(k,v)=>{
                if(observer.indexOf(v.id) > -1){
                    $('#taskManage .memberList').append(listDesignFu('Observer',v.id));
                }
            });
        }
    }else if(type == 'assignee'){

        $('#taskManage .list_Count').text('('+assignee.length+')');
        if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
            $.each(assignee,(k,v)=>{
                temppMangeList.push(v);
                $('#task_Member_List').prepend(boxUserDesign(v));
            });
            $.each(user_list,(k,v)=>{
                if(v.id !== $('#actCre').val()){
                    if(assignee.indexOf(v.id) == -1){
                        $('#taskManage .memberList').append(backwrapListDesign(v.id));
                    }
                }
            });
        }else{
            $.each(user_list,(k,v)=>{
                if(assignee.indexOf(v.id) > -1){
                    $('#taskManage .memberList').append(listDesignFu('Assignee',v.id));
                }
            });
        }
    }
}

// function boxUserDesign(value){
//     var html = '';
//         html += '<div class="perU_profile perU'+value+'" data-id="'+value+'">';
//         html +=    '<span class="tempE img"><img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(value).img+'"></span>';
//         html +=    '<p class="tempE perU_name">'+findObjForUser(value).fullname+'</p>';
//         html +=    '<span class="tempE perU_remove" onclick="removeManageList(\''+value+'\')"></span>';
//         html += '</div>';
//         return html;
// }

function removeManageList(id){
    removeA(temppMangeList,id);
    
    if(removeList.indexOf(id) == -1){
        removeList.push(id);
    }

    $('.perU'+id).remove();
    $('#task_Member_List input').focus();
    $('#taskManage .memberList').prepend(backwrapListDesign(id));
}

function task_Member_ListSearch(e,ele){
    if(e.keyCode == 8){
        if($(ele).val() == ''){
            if(temppMangeList.length > 0){
                var id = $('#task_Member_List .perU_profile').last().attr('data-id');
                removeManageList(id);
            }
        }
    }
}

function backwrapListDesign(value){
    var html = '';
        html += '<div class="list showEl perListUser_'+value+'" onclick="addToBox(\''+value+'\')">';
        html +=    '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(value).img+'">';
        html +=    '<span class="online_'+value+' offline"></span>';
        html +=    '<h1 class="memberName">'+findObjForUser(value).fullname+'</h1>';
        html += '</div>';
        return html;
}

function listDesignFu(type,value){
    var html = '';
        html += '<div class="list showEl perListUser_'+value+'">';
        html +=    '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(value).img+'">';
        html +=    '<span class="online_'+value+' offline"></span>';
        html +=    '<h1 class="memberName">'+findObjForUser(value).fullname+'</h1>';
        html +=    '<span class="creator">'+type+'</span>';
        html += '</div>';
        return html;
}

function addToBox(id){
    if($('#taskManage').attr('data-type') == 'assignee'){
        if(temppMangeList.length > 0){
           $('.perU'+temppMangeList[0]).remove();
           $('#taskManage .memberList').append(backwrapListDesign(temppMangeList[0]));
            temppMangeList = [];
        }
        // temppMangeList = [];

    }
    temppMangeList.push(id);
    $('.perListUser_'+id).remove();
    $('#task_Member_List').prepend(boxUserDesign(id));
    $('#task_Member_List input').focus();

}

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

function deleteParticipantsOncalen(elem){
    closeAllPopUp();
}

function participantsInsert(type,userlist,participantsDlt){
    return new Promise((resolve,reject)=>{
        if(userlist.length == 0){
            if(participantsDlt.length>0){
                const activity = new Activity();
                activity.participantedTblID = participantsDlt;
                activity._partiDlt((callback)=>{
                    resolve(true);
                });
            }else{
                reject(false);
            }
        }else{
            const activity = new Activity();
            activity.activityId          = $('#updateAction').val();
            activity.activityCreatedBy   = $('#actCre').val();
            activity.clusteringKey       = $('#actCre').val();
            activity.activityUpdateData  = participantArrayGen(userlist,type);
            activity.activityType        = 'Task';
            activity.activityUpdateType  = 'participants';
            activity.participantType     = type;
            activity.participantedTblID  = participantsDlt; 

            activity.activityUpdate((response)=>{
                activity.singleActivity_participants((result)=>{
                    resolve(result);
                });
            });
        }
    });
}

function subtaskParticipantsInsert(type,Ids,subtaskPartiList){
    return new Promise((resolve,reject)=>{
        if(Ids.length == 0){
            reject(false);
        }else{
            if(subtaskPartiList != undefined){
               
                const activity = new Activity();
                activity.activityId          = Ids;
                activity.activityUpdateData  = subtaskPartiList;
                activity.activityType        = type;
                
                activity._s_p_o_f((response)=>{
                    if(partiDltTblIds != undefined){
                        if(partiDltTblIds.length > 0){
                            const activity = new Activity();
                            activity.participantedTblID = partiDltTblIds;
                            activity._partiDlt((callback)=>{
                                resolve(true);
                            });
                        }else{
                            resolve(true);
                        }
                    }else{
                        resolve(true);
                    }
                });
            }else{
                if(partiDltTblIds != undefined){
                    if(partiDltTblIds.length > 0){
                        const activity = new Activity();
                        activity.participantedTblID = partiDltTblIds;
                        activity._partiDlt((callback)=>{
                            resolve(true);
                        });
                    }
                }else{
                    resolve(true);
                }
            }
            
        }
    });
}

function participantArrayGen(temppMangeList,type){
    participants = [];

    $.each(temppMangeList,(k,v)=>{
        if(!checkFromMultipleArray(participants, v, type)){
            participants.push({id:v,type:type});
        }
    });

    return participants;
}

function deletedUserlistforsub(arry,dltlsit){
    return new Promise((resolve,reject)=>{
        if(dltlsit.length > 0 && arry.length > 0){
            var dltUserlist = [];
            if(arry.length > 0){
                if(dltlsit.length > 0){
                    $.each(dltlsit, (key,val)=>{
                        $.each(arry, (k,v)=>{
                            if( val == v.userid){
                                if(dltUserlist.indexOf(v.tbl_id) == -1){
                                    dltUserlist.push(v.tbl_id);
                                }
                            }
                        });
                    });
                }
                
            }
            resolve(dltUserlist);
        }else{
            reject(false);
        }
    });
}

function newUserlistforsub(arry,newlsit){
    return new Promise((resolve,reject)=>{
        if(newlsit.length > 0 && arry.length > 0){
            var newUserlist = [];
            var prevList = [];
            if(arry.length > 0){
                $.each(arry, (k,v)=>{
                    if(prevList.indexOf(v.userid) == -1){
                        prevList.push(v.userid);
                    }
                });
            }
            if(newlsit.length > 0){
                $.each(newlsit, (k,v)=>{
                    if(newlsit.indexOf(v) > -1 && prevList.indexOf(v) == -1){
                        if(newUserlist.indexOf(v) == -1){
                            newUserlist.push(v);
                        }
                    }
                });
            }
            resolve(newUserlist);
        }else{
            reject(false);
        }
    });
}

async function add_assign_members(elem){
    var activityIds = myAllActivityGlobal;

    if($(elem).attr('data-type') == 'owner'){
        var partitblids = participatedOwner;
    }else if($(elem).attr('data-type') == 'observer'){
        var partitblids = participatedObserver;
    }else if($(elem).attr('data-type') == 'assignee'){
        var partitblids = participatedAssignee;
    }

    var insertRes = await participantsInsert($(elem).attr('data-type'),temppMangeList,partitblids).catch((err)=>{console.log(err);});
    if(insertRes.status){
        var participantsRes = insertRes.participants;
        if (participantsRes.length == 0) {
            $('#taskOwnerList img').remove();
            var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
            $.each(user_list, function (ky, va) {
                if (activityDetail.activity_created_by == va.id) {
                    sharedMemberList.push(va.id);
                    currentMemberList3.push(va.id);
                    $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + ' ownerThisToDo">');
                    $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+va.fullname+'</span>');
                }
            });
        }else{
            participantsDraw(participantsRes);
        }
    }

    if(activityIds.length > 0){
        var subinsertRes = await subtaskParticipantsInsert($(elem).attr('data-type'),activityIds,subtaskPartiList).catch((err)=>{console.log(err);});
        if(subinsertRes != undefined){
            if(subinsertRes){
                $("#activity_"+$('#updateAction').val()).click();
                closeAllPopUp();
            }
        }
        
    }
};

function confirmationDivOpen(type,tblidsOntoggleAssignee){
    if(tblidsOntoggleAssignee.length > 0){
        if(type == 'owner'){
            if(addAsAssigneeArr.length > 0){
                $.each(addAsAssigneeArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }

            if(addAsObsrvrArr.length > 0){
                $.each(addAsObsrvrArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }
            
        }else if(type == 'observer'){
            if(addAsAssigneeArr.length > 0){
                $.each(addAsAssigneeArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }

            if(addAsCoOwnerArr.length > 0){
                $.each(addAsCoOwnerArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }
            
        }else if(type == 'assignee'){
            if(addAsCoOwnerArr.length > 0){
                $.each(addAsCoOwnerArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }
    
            if(addAsObsrvrArr.length > 0){
                $.each(addAsObsrvrArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }

            if(addAsAssigneeArr.length > 0){
                $.each(addAsAssigneeArr, (k,v)=>{
                    if(tblidsOntoggleAssignee.indexOf(v.userid) > -1){
                        if(partiDltTblIds.indexOf(v.tbl_id) == -1){
                            partiDltTblIds.push(v.tbl_id);
                        } 
                    }
                });
            }
        }
    }
    

    $("#member_add_on_fly .btn-msg-del").attr('data-type',type);
    if(removeList.length > 0){
        $("#member_add_on_fly .delete_msg_sec_title").text('Do you want to assign to the Subtask(s)? Following coowner will be deleted from subtask(s)');
        $.each(removeList,(k,v)=>{
            $("#member_add_on_fly .main-deleted-msg").append('<span style="width:95%; background-color:#bfbfbf;padding:2px 10px;">'+findObjForUser(v).fullname+'</span>');
        });
        
    }else{
        $("#member_add_on_fly .delete_msg_sec_title").text('Do you want to assign to the Subtask(s)?');
    }
    $("#member_add_on_fly").show();
}

async function updateTaskList(ele){
    if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
        if($('#updateAction').val() !== ''){
            subtaskPartiList = [];
            partiDltTblIds = [];

            var tblidsOntoggleAssignee = [];

            if($(ele).attr('data-type') == 'owner'){
                var tempTaskParticipants = [];

                $.each(temppMangeList,(k,v)=>{
                    if(observer.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{

                            if(value.id == v && value.type == 'observer' ){
                                removeA(observer,v);
                                participatedOwner.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipants.push(value);
                            }
                        });
                        
                    }
                });

                var tempTaskParticipantsFAa = [];

                $.each(temppMangeList,(k,v)=>{
                    if(assignee.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{
                            if(value.id == v && value.type == 'assignee' ){
                                removeA(assignee,v);
                                assigneeOnDlt();
                                participatedOwner.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipantsFAa.push(value);
                            }
                        });
                        
                    }
                });

                var taskParticipants_tmp = tempTaskParticipants.concat(tempTaskParticipantsFAa);
                var tmp_arr = [];
                var tmp_id = [];
                $.each(taskParticipants_tmp,(k,v)=>{
                    if(tmp_id.indexOf(v.tbl_id) == -1 ){
                        tmp_arr.push(v);
                    }
                });

                taskParticipants = tmp_arr;

                var arr = addAsCoOwnerArr;
                var partitblids = participatedOwner;
                coowner = temppMangeList;
            }else if($(ele).attr('data-type') == 'observer'){

                var tempTaskParticipants = [];
                $.each(temppMangeList,(k,v)=>{
                    if(assignee.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{
                            if(value.id == v && value.type == 'assignee' ){
                                removeA(assignee,v);
                                assigneeOnDlt();
                                participatedObserver.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipants.push(value);
                            }
                        });
                        
                    }
                });

                var tempTaskParticipantsFco = [];
                $.each(temppMangeList,(k,v)=>{
                    if(coowner.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{
                            if(value.id == v && value.type == 'owner' ){
                                removeA(coowner,v);
                                participatedObserver.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipantsFco.push(value);
                            }
                        });
                        
                    }
                });

                var taskParticipants_tmp = tempTaskParticipants.concat(tempTaskParticipantsFco);
                var tmp_arr = [];
                var tmp_id = [];
                $.each(taskParticipants_tmp,(k,v)=>{
                    if(tmp_id.indexOf(v.tbl_id) == -1 ){
                        tmp_arr.push(v);
                    }
                });

                taskParticipants = tmp_arr;

                var arr = addAsObsrvrArr;
                var partitblids = participatedObserver;
                observer = temppMangeList;
            }else if($(ele).attr('data-type') == 'assignee'){

                

                var tempTaskParticipants = [];
                $.each(temppMangeList,(k,v)=>{
                    if(observer.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{
                            if(value.id == v && value.type == 'observer' ){
                                removeA(observer,v);
                                participatedAssignee.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipants.push(value);
                            }
                        });
                        
                    }
                });

                var tempTaskParticipantsFco = [];
                $.each(temppMangeList,(k,v)=>{
                    if(coowner.indexOf(v) > -1){
                        $.each(taskParticipants, (key,value)=>{
                            if(value.id == v && value.type == 'owner' ){
                                removeA(coowner,v);
                                participatedAssignee.push(value.tbl_id);
                                if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                                    tblidsOntoggleAssignee.push(value.id);
                                }
                            }else{
                                tempTaskParticipantsFco.push(value);
                            }
                        });
                        
                    }
                });

                var tempTaskParticipantsAss = [];
                $.each(taskParticipants, (key,value)=>{
                    if(value.type == 'assignee' ){
                        participatedAssignee.push(value.tbl_id);
                        if(tblidsOntoggleAssignee.indexOf(value.id) == -1){
                            tblidsOntoggleAssignee.push(value.id);
                        }
                    }else{
                        tempTaskParticipantsAss.push(value);
                    }
                });

                var taskParticipants_tmp = tempTaskParticipants.concat(tempTaskParticipantsFco).concat(tempTaskParticipantsAss);
                
                var tmp_arr = [];
                var tmp_id = [];
                $.each(taskParticipants_tmp,(k,v)=>{
                    if(tmp_id.indexOf(v.tbl_id) == -1 ){
                        tmp_arr.push(v);
                    }
                });

                taskParticipants = tmp_arr;

                var arr = addAsAssigneeArr;
                var partitblids = participatedAssignee;
                assignee = temppMangeList;
            }

            if(arr.length > 0){
                var newUsrForSubres = await newUserlistforsub(arr,temppMangeList).catch((err)=>{console.log(err)});
                var removeListForSubres = await deletedUserlistforsub(arr,removeList).catch((err)=>{console.log(err)});
            }else{
                var newUsrForSubres = temppMangeList;
                var removeListForSubres = [];
            }

            
            if(myAllActivityGlobal.length > 0){
                subtaskPartiList = newUsrForSubres;
                partiDltTblIds = (removeListForSubres == undefined ? [] : removeListForSubres);
                confirmationDivOpen($(ele).attr('data-type'),tblidsOntoggleAssignee);
            }else{
                var insertRes = await participantsInsert($(ele).attr('data-type'),temppMangeList,partitblids).catch((err)=>{console.log(err);});
                if(insertRes){
                    var participants = insertRes.participants;
                    if (participants.length == 0) {

                        $('#taskOwnerList img').remove();
                        $('#taskOwnerList .count_plus').show();

                        // $('#taskObserverList img').remove();
                        $('#taskObserverList .count_plus').show();

                        // $('#taskAssigneeList img').remove();
                        $('#taskAssigneeList .count_plus').show();

                        sharedMemberList = [];
                        currentMemberList = [];
                        currentMemberList2 = [];
                        currentMemberList3 = [];

                        var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
                        $.each(user_list, function (ky, va) {
                            if (activityDetail.activity_created_by == va.id) {
                                sharedMemberList.push(va.id);
                                currentMemberList3.push(va.id);
                                $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + va.img + '" data-uuid="' + va.id + '" class="sharedIMG memberImg' + va.id + ' ownerThisToDo">');
                                $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+va.fullname+'</span>');
                            }
                        });
                    }else{
                        participantsDraw(participants);
                    }

                    closeAllPopUp();
                }
            }
            // closeAllPopUp();
            $('#taskManage').hide();
        }
    }
};

function progressBar(chkboxNumber,checked){
    var checkBoxPerPercentage = 100/parseInt(chkboxNumber);
    var complete = checkBoxPerPercentage*checked;
    $("#progressbar").attr('aria-valuenow',complete);
    $("#progressbar").css('width',complete+'%');
    $(".progress_status").text(complete+'%');
}

function multipleProgressBar(total,checked,wait,work){
    $.each(customStatus,function(k,v){
        var checkBoxPerPercentage = 100/parseInt(total);
        var valLength = $('.pulse-component._eachsubtask .pulse-left-indicator.can-edit[data-value="'+v.color+'"]').length;
        var width = (checkBoxPerPercentage * valLength);
        if($('#pgColor'+v.id).length == 0){
            $('.progressBarContainer').append('<div id="pgColor'+v.id+'" data-value="'+Math.round(width)+'%'+'" data-color="'+v.color+'" style="width:'+width+'%; background:'+v.color+'"></div>');
        }else{
            $('#pgColor'+v.id).css('width',width+'%');
            $('#pgColor'+v.id).attr('data-value',Math.round(width)+'%');
        }
        
         var d8ColorVal = $('#pgColor1').attr('data-value').split('%');

        $('#totalProgressSubtask').text(Math.round(100 - d8ColorVal[0])+'%')
    });

    filteringTaskShowing();


}


function hideMoreDialogTask(params){
    if(params){
        $('#custom_toDoMoreOption').removeClass('open2');
    }
}

function taskShowHideElement(params){
    if(params){
        $('.multipleProgress').css('display','flex');
        $('.add-column-container').css('display','block');
        $('.subtaskContainer').css('display','block');
        $('.group-header-wrapper').show();
        
    }else{
        $('.multipleProgress').css('display','none');
        $('.add-column-container').css('display','none');
        // $('.subtaskContainer').css('display','none');
        // // $('.group-header-wrapper').hide();

        $('#taskStatusSelect').val('Initiate').trigger('change'); 
        $("#taskStatusSelect").css('pointer-events','auto');
        $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','auto');
        
    }
}

function toggleSubtasksOption(elm){
    var status = $(elm).hasClass('active');
    if(status){
        $(elm).removeClass('active');
    }else{
        $(elm).addClass('active');
    }
} 

function subActivityClone(response , childActivitiesParticipants){

    var htm = $( "#OnlyForClone" ).clone();
    var pulse  = response.activity_id;
    var id  = $('.pulse_title').length+1;
    var od = 'newSubtask'+$('.innerDropMeny').length;

    var info = findObjForUser(response.activity_created_by);

    $(htm).attr('id', 'pulse_'+response.activity_id).addClass('_eachsubtask');
    $(htm).attr('data-id',response.activity_id);
    $(htm).find('.name-cell-component .pulse_title').text(response.activity_title);
    $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
    $(htm).find('.numeric-cell-component .amountInputValue').text('0');

    $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/'+info.img);
    $(htm).find('.owner_img').attr('title', info.fullname);

    $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle'+id).text(response.activity_title);
    $(htm).find('.name-cell-component .pulse_title').attr('data-title', response.activity_title);
    $(htm).find('.name-cell-component .pulse_title').attr('data-id', response.activity_title);
    $(htm).find('.name-cell-component .pulse_title').attr('data-title', response.activity_title);

    // ATTR SET

    $(htm).find('.ObserverCell .observerViewList').attr('data-id', response.activity_id);
    $(htm).find('.coowonerCell .coownerViewList').attr('data-id', response.activity_id);
    $(htm).find('.AssigneeCell .assigneeViewList').attr('data-id', response.activity_id);
    $(htm).find('.DateCell .dueDateInput').attr({'data-id': response.activity_id,'data-date': response.activity_end_time,});
    $(htm).find('.com_DateCell .com_DateInput').attr({'data-id': response.activity_id,'data-date': response.activity_completed_at});
    $(htm).find('.priorityCell .single_priority').attr('data-id', response.activity_id);
    $(htm).find('.StatusCell .single_status').attr('data-id', response.activity_id);
    $(htm).find('.timeEstCell .timeInputValue').attr({'data-id': response.activity_id, 'data-val': response.activity_est_hour});
    $(htm).find('.actualHourCell .actualHourCellSpan').attr({'data-id': response.activity_id, 'data-val': response.activity_actual_hour});
    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-id', response.activity_id);
    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-id', response.activity_id);
    $(htm).find('.AmountCell .AmountCellSpan').attr('data-id', response.activity_id);
    $(htm).find('.actualCell .actualCellSpan').attr('data-id', response.activity_id);
    $(htm).find('.varianceCell .varianceCellSpan').attr('data-id', response.activity_id);
    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-id', response.activity_id);
    $(htm).find('.name-cell-component .pulse_title').attr('data-id', response.activity_id);
    $(htm).find('.name-cell-component .flagIco').attr('data-id', response.activity_id);

    $(htm).find('.ObserverCell .observerViewList').attr('data-createdby', response.activity_created_by);
    $(htm).find('.coowonerCell .coownerViewList').attr('data-createdby', response.activity_created_by);
    $(htm).find('.AssigneeCell .assigneeViewList').attr('data-createdby', response.activity_created_by);
    $(htm).find('.DateCell .dueDateInput').attr('data-createdby', response.activity_created_by);
    $(htm).find('.com_DateCell .com_DateInput').attr('data-createdby', response.activity_created_by);
    $(htm).find('.priorityCell .single_priority').attr('data-createdby', response.activity_created_by);
    $(htm).find('.StatusCell .single_status').attr('data-createdby', response.activity_created_by);
    $(htm).find('.timeEstCell .timeInputValue').attr('data-createdby', response.activity_created_by);
    $(htm).find('.actualHourCell .actualHourCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.AmountCell .AmountCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.actualCell .actualCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.varianceCell .varianceCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-createdby', response.activity_created_by);
    $(htm).find('.name-cell-component .pulse_title').attr('data-createdby', response.activity_created_by);

    // ID SET

    $(htm).find('.DateCell .dueDateInput').attr('id', 'dueDate'+response.activity_id);
    $(htm).find('.com_DateCell .com_DateInput').attr('id', 'comDate'+response.activity_id);
    $(htm).find('.ObserverCell .observerViewList').attr('id', 'observer'+response.activity_id).addClass('observer'+response.activity_id);
    $(htm).find('.coowonerCell .coownerViewList').attr('id', 'coowner'+response.activity_id).addClass('coowner'+response.activity_id);
    $(htm).find('.AssigneeCell .assigneeViewList').attr('id', 'assignee'+response.activity_id).addClass('assignee'+response.activity_id);
    $(htm).find('.priorityCell').attr('id', 'priority'+response.activity_id);
    $(htm).find('.StatusCell').attr('id', 'status'+response.activity_id);
    $(htm).find('.timeEstCell .timeInputValue').attr('id', 'timeInputValue'+response.activity_id);
    $(htm).find('.actualHourCell .actualHourCellSpan').attr('id', 'actualHourCellSpan'+response.activity_id);
    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('id', 'ManHourRateSpan'+response.activity_id);
    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('id', 'hourlyRateCellSpan'+response.activity_id);
    $(htm).find('.AmountCell .AmountCellSpan').attr('id', 'AmountCellSpan'+response.activity_id);
    $(htm).find('.actualCell .actualCellSpan').attr('id', 'actualCellSpan'+response.activity_id);
    $(htm).find('.varianceCell .varianceCellSpan').attr('id', 'varianceCellSpan'+response.activity_id);
    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('id', 'timevarianceCellSpan'+response.activity_id);

    // $( "#thisWeekPluseContainer").append(htm);

    if($('#addnewSub').is(':visible')){
        if(row_pluse_count == 0){
            $('.pulse_title').first().closest('.pulse-component').before(htm);
        }else if(row_pluse_count == 1){
            $('#varienceRow').before(htm);
        }

        if(($('.pulse_title').length - 1) > 9){
            $('#pulse_'+pulse).find('.row_pluse_count').addClass('twodigi');
        }

        $('#pulse_'+pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
    }else{
        $('.pulse_title').last().closest('.pulse-component').before(htm);
        var wid = 0;
        
        $('.cell-component:visible').each(function(k,v){
            wid = wid+$(v).innerWidth();
        });

        SubtaskClone.cellcomponent = 17;
        SubtaskClone.flexSize = wid;
        SubtaskClone.id = $('.pulse-component').length;

        $( "#thisWeekPluseContainer").append(SubtaskClone.varience());
        $( "#thisWeekPluseContainer").append(SubtaskClone.draw());
        
        $( "#thisWeekPluseContainer").show();
        
        if(($('.pulse_title').length - 1) > 9){
            $('#pulse_'+pulse).find('.row_pluse_count').addClass('twodigi');
        }
        
        $('#pulse_'+pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
    }

    $.each(childActivitiesParticipants, function(k,v){
        if(v.type == 'observer'){

            addAsObsrvrArr.push({
                activityid: response.activity_id,
                userid: v.userid,
                tbl_id: v.tbl_id,
                type: v.type,
            });

            if(uniqueObserver.indexOf(v.userid.toString()) == -1){
                uniqueObserver.push(v.userid.toString());
            } 

            partiArry.push({
                activity_id:response.activity_id.toString(),
                user_id:v.userid.toString(),
                tbl_id:    v.tbl_id.toString(),
                participant_type: 'observer',
                activity_type: "SubTask",
                created_at: moment().format('L')
            });

            observerFromLoad(v.userid.toString(),'#observer'+response.activity_id.toString());

        }else if(v.type == 'assignee'){
            
            addAsAssigneeArr.push({
                activityid: response.activity_id,
                userid: v.userid,
                tbl_id: v.tbl_id,
                type: v.type,
            });

            if(uniqueAssine.indexOf(v.userid.toString()) == -1){
                uniqueAssine.push(v.userid.toString());
            }

            partiArry.push({
                activity_id:  response.activity_id,
                user_id: v.userid.toString(),
                tbl_id:  v.tbl_id.toString(),
                participant_type: 'assignee',
                activity_type: "SubTask",
                created_at: moment().format('L')
            });

            assigneeFromLoad(v.userid.toString(),'#assignee'+response.activity_id.toString());

        }else if(v.type == 'owner'){
            
            addAsCoOwnerArr.push({
                activityid: response.activity_id,
                userid: v.userid,
                tbl_id: v.tbl_id,
                type: v.type,
            });

            if(uniqCoowner.indexOf(v.userid.toString()) == -1){
                uniqCoowner.push(v.userid.toString());
            } 

            partiArry.push({
                activity_id: response.activity_id.toString(),
                user_id: v.id.toString(),
                tbl_id: v.id.toString(),
                participant_type: 'owner',
                activity_type: "SubTask",
                created_at: moment().format('L')
            });

            coownerFromLoad(v.userid.toString(),'#coowner'+response.activity_id.toString());
        }
    });

    var ar1 = addAsObsrvrArr.concat(addAsAssigneeArr);
    var ar2 = ar1.concat(addAsCoOwnerArr);

    var createdbyme = [];
    createdbyme.push(response.activity_created_by.toString());

    $.each(ar2, (k,v)=>{
        if(v.userid == user_id){
            if(createdbyme.indexOf(v.activityid.toString()) > -1){
                subTaskOwnerAccess(v.activityid.toString());
            }else{
                if(v.type == 'coowner'){
                    subTaskOwnerAccess(v.activityid.toString());
                }else if(v.type == 'observer'){
                    subTaskObserverAccess(v.activityid.toString());
                }else if(v.type == 'assignee'){
                    subTaskAssigneeAccess(v.activityid.toString());
                }
            }
        }
    });
}

function varienceCollect(){

    var budgetAmount = 0;
    $('.AmountCellSpan').each((k,v)=>{
        budgetAmount = budgetAmount + ($(v).text() == '' ?  0:parseFloat($(v).text()));
    });

    $("#varienceRow").children().eq(8).text(budgetAmount.toFixed(2));

    var actualVal = 0;

    $('.actualCellSpan').each((k,v)=>{
        actualVal = actualVal + ($(v).text() == '' ?  0:parseFloat($(v).text()));
    });

    $("#varienceRow").children().eq(9).text(actualVal.toFixed(2));

    var varienceVal = 0;
    $('.varianceCellSpan').each((k,v)=>{
        varienceVal = varienceVal + ($(v).text() == '' ?  0:parseFloat($(v).text()));
    });

    $("#varienceRow").children().eq(10).text(varienceVal.toFixed(2));

    var timevarienceVal = 0;
    $('.timevarianceCellSpan').each((k,v)=>{
        timevarienceVal = timevarienceVal + ($(v).text() == '' ?  0:parseFloat($(v).text()));
    });

    $("#varienceRow").children().eq(15).text(timevarienceVal.toFixed(2));
}

function removeSubtaskPnS(elm){
    var type = $(elm).attr('data-type');
    var id = $(elm).attr('data-status');

    const activity = new Activity();

    activity.activityId             = id;

    activity.deleteStatus((response)=>{
        if (response.deleteStatusResponse.status) {
            if(type == 'phase'){
                subtaskWarningElm.parent('.single_priority').remove();
            }else if(type == 'status'){
                subtaskWarningElm.parent('.single_status').remove();
            }
            $('#subtaskWarningBackwrap').hide();
        }
    });
}
  
// var subTaskNoteArray = [];

function hideBatchProcessing(elm){

    isBatchActive = 0;
    isBatchActive_ob = 0;

    $('#batchProcessing').hide()
    var checkbox =  $('.left-indicator-inner.inClas')

    $.each(checkbox,function(k,v){
        if($(v).parent('.pulse-left-indicator.can-edit ').attr('data-value') !== 'Completed'){
            $(v).trigger('click');
            $(v).find('.row_pluse_count').show();
            $(v).find('.left-indicator-checkbox').hide();
        }else{
            $(v).find('.row_pluse_count').show();
            $(v).find('.left-indicator-checkbox').hide();
        }
    });

    $('#batchProcessing .batchButtonSec').find('.floatingBtn').removeClass('active');
    $('#batchProcessing .batchButtonSec .floatingBtn:eq(0)').addClass('active');
    $('#batchPropertyNotes').hide();
    $('#batchProDetails').show();
    $('#batchActionMenu').show();

    $('.property-details').show();
    $('.property_notes .st_chat').hide();
    $('.property_notes .st_note').hide();
}

function toggoleBatchMsgNnote(elm){
    var hasActive = $(elm).hasClass('active');
    var thisAttr = $(elm).attr('data-type');

    if(!hasActive){
        if(thisAttr == 'bmsg'){
            $('#batchProcessing .btnBatchNote').removeClass('active');
            $(elm).addClass('active');
            $('#batchPropertyNames').hide();
            $('#batchPropertyValue').hide();
            $('#batchPropertyNotes').show();
            $('#batchPropertyNotes .st_note').hide();
            $('#batchPropertyNotes .st_chat').show();



        }else if(thisAttr == 'bnote'){
            $('#batchProcessing .btnBatchMsg').removeClass('active');
            $(elm).addClass('active');
            $('#batchPropertyNames').hide();
            $('#batchPropertyValue').hide();
            $('#batchPropertyNotes').show();
            $('#batchPropertyNotes .st_chat').hide();
            $('#batchPropertyNotes .st_note').show();




        }
    }else{
        $(elm).removeClass('active');
        $('#batchPropertyNotes').hide();
        $('#batchPropertyNames').show();
        $('#batchPropertyValue').show();
    }
}

function toggleBatchActions(elm){
    var hasActive = $(elm).hasClass('active');
    var type = $(elm).attr('data-value');
    if(!hasActive){
        $(elm).parent('.batchButtonSec').find('.floatingBtn').removeClass('active');
        $(elm).addClass('active');

        $('#batchProcessing .batchHeading').html('');
        $('#batchProcessing .batchHeading').html('<h1><span class="b_a_ico"></span> Batch Actions</h1>');
        $('#batchPropertyNotes').attr('data-notetype', 'unpin_batch_note');

        if(type == 'bproperties'){

            $('#batchPropertyNotes').hide();
            $('#batchProDetails').show();
            $('#batchActionMenu').show();

            $('.property-details').show()
            $('.property_notes .st_chat').hide()
            $('.property_notes .st_note').hide()

        }else if(type == 'pmsg'){
            $('#batchProDetails').hide();
            $('#batchActionMenu').hide();
            $('#batchPropertyNotes').show();
            $('#batchPropertyNotes .st_note').hide();
            $('#batchPropertyNotes .st_chat').show();

            $('.property-details').hide();
            $('.property_notes .st_chat').show();
            $('.property_notes .st_note').hide();
            openSubtaskChat($('.property_notes').attr('data-batch_id'));    
        }else if(type == 'bmsg'){
            $('#batchProDetails').hide();
            $('#batchActionMenu').hide();
            $('#batchPropertyNotes').show();
            $('#batchPropertyNotes .st_note').hide();
            $('#batchPropertyNotes .st_chat').show();

            $('.property-details').hide();
            $('.property_notes .st_chat').show();
            $('.property_notes .st_note').hide();
            open_batch_msg();    
        }else if(type == 'bnote'){

            $('#batchProDetails').hide();
            $('#batchActionMenu').hide();
            $('#batchPropertyNotes').show();
            $('#batchPropertyNotes .st_chat').hide();
            $('#batchPropertyNotes .st_note').show();

            $('.property-details').hide();
            $('.property_notes .st_chat').hide();
            $('.property_notes .st_note').show();

            if($(".property_notes").attr("data-batch_id") != undefined)
                open_subtask_note($(".property_notes").attr("data-batch_id"));
            else
                open_batch_subtask_note();
        }
    }
}

function batchMenuCounter(){
    $('#batchActionMenu .pulses_dots .extra-dots').hide();
    var countChecked = $('.pulse-component._eachsubtask').find('.left-indicator-checkbox.selected').length;
    
    if(countChecked == 0){
        $('#batchProcessing .chat-close').trigger('click');
    }else{

        $('#batchActionMenu .num-of-actions_wrapper .num-of-actions').text(countChecked)
        $('#batchActionMenu .pulses_dots .dot').remove();
        let i;
        for (i = 0; i < countChecked; i++) { 
            if(i < 13){
                $('#batchActionMenu .pulses_dots').prepend('<div class="dot" style="background:#2a76ea"></div>');
            }else{
                
                $('#batchActionMenu .pulses_dots .extra-dots').text('+'+(countChecked - 13)+'').show();
            }
        }
    }
}

function batchMenuCounterFull(elm){
    $('#batchActionFull .pulses_dots .extra-dots').hide();
    var CompleteCheck = $(elm).parent('.pulse-left-indicator').attr('data-value');
    var countChecked2 = $('.pulse-component._eachsubtask').find('.left-indicator-checkbox.selected:visible').length;

    if(countChecked > 1){
        $('#batchApplyBtn').show();
    }else{
        $('#batchApplyBtn').hide();
    }
    if($(openBatchAction).is(':visible') == false){
        countChecked = 1;
    }

    if(countChecked2 == 0){

        $('#openBatchAction').hide();
    }else{
        if(countChecked > 1){
            $('#openBatchAction .batch_label').text('Batch Actions');
        }else{
            countChecked = 2;
            $('#openBatchAction .batch_label').text('Batch Action');
            $('#openBatchAction .big_tooltip').css('display','flex');
            setTimeout(function(){ $('#openBatchAction .big_tooltip').hide() }, 1500);
        }
        var ids = [$('#mainSideBarContent').find('.activeTodo').attr('data-activityid')];
        find_unread_note_count(ids, user_id, 'batchnote');
        $('#openBatchAction').show();
        filteringTaskShowing();
    }
}

function hideSBA(){
    $('#batchActionFull').hide();
    var checkbox =  $('.left-indicator-inner.inClas')
    $.each(checkbox,function(k,v){
        if($(v).parent('.pulse-left-indicator.can-edit ').attr('data-value') !== 'Completed'){
            $(v).trigger('click');
            $(v).find('.row_pluse_count').show();
            $(v).find('.left-indicator-checkbox').hide();
        }else{
            $(v).find('.row_pluse_count').show();
            $(v).find('.left-indicator-checkbox').hide();
        }
    })
}

function duplicateBatchAction(){
    var allcheckElm = $('.pulse-component._eachsubtask').find('.left-indicator-checkbox.selected').parents('.pulse-component._eachsubtask');
    $.each(allcheckElm,function(k,v){
        $(v).find('.subtaskAllFile .subtask_note_view.duplicate').trigger('click');
    });
}

function deleteBatchAction(elm){
    insDeleteArray2 = [];
    var allcheckElm = $('.pulse-component._eachsubtask').find('.left-indicator-checkbox.selected').parents('.pulse-component._eachsubtask');

    $.each(allcheckElm,function(k,v){
        var dataid = $(v).attr('data-id')
        var data = {
            id:dataid,
            dTime:moment().add(8,'second').unix()
        }
        if(!checkarrayObj(deleteDBActionArray,'id',dataid).status){
            $(v).addClass('deleteAction');
            deleteDBActionArray.push(data);
        }
        insDeleteArray2.push(dataid);
    });
    if(arraysEqual(insDeleteArray,insDeleteArray2)){
        $.each(insDeleteArray,function(k,v){
            $('#pulse_'+v).find('.subtask_file_up.deleteSubtask').trigger('click');
        });
    
        insDeleteArray = [];
        insDeleteArray2 = [];
        $('.general-notice-content').hide();

    }else{
        insDeleteArray = insDeleteArray2;
        $('.general-notice-content').find('.notice-message-container.notice-count-down-button-container').html('We successfully deleted '+insDeleteArray.length+' pulse.<button class="notice-count-down-button" data-time="8" onclick="undoDBA(event,this)">Undo 8</button>');
        $('.general-notice-content').show();
    }


    
}

function undoDBA(e,elm){
    $.each(insDeleteArray,function(k,v){
        var dataid = $('#pulse_'+v).attr('data-id');
        $('#pulse_'+v).removeClass('deleteAction');
        if(checkarrayObj(deleteDBActionArray,'id',dataid).status){
            var index = checkarrayObj(deleteDBActionArray,'id',dataid);
            deleteDBActionArray.splice(index,1);
        }
    });
    $('.general-notice-content').hide();
    insDeleteArray = [];

}

function cancelUndoBatch(elm){
    $.each(insDeleteArray,function(k,v){
        
        $('#pulse_'+v).find('.subtask_file_up.deleteSubtask').trigger('click');

        var data = checkarrayObj(deleteDBActionArray,'id',v);

        if(data.status){
            deleteDBActionArray.splice(data.index,1);
        }

    });

    insDeleteArray = [];
    $('.general-notice-content').hide();

}

function checkarrayObj(arr,key,value){
    var data = {
        status:false,
        index:''
    }
    $.each(arr,function(k,v){
        if(arr[k][key] == value){
            data.status =  true;
            data.index =  k;
        }
        if(k+1 == arr.length){
            if(!data){
                data.status =  false;
                data.index =  '';
            }
        }
    });

    return data;
    
}

setInterval(function(){
    var undoDeletePulse = $('.general-notice-content:visible');
    var valtime = Number(undoDeletePulse.find('.notice-count-down-button').attr('data-time')) - 1;
    undoDeletePulse.find('.notice-count-down-button').text('Undo '+valtime+'');
    undoDeletePulse.find('.notice-count-down-button').attr('data-time',valtime);
    if(valtime <= 0){
        $('.general-notice-content:visible').hide();
    }
    var timeOutid = [];
    $.each(deleteDBActionArray,function(k,v){
        if(deleteDBActionArray[k]['dTime'] <= moment().unix()){
            $('#pulse_'+deleteDBActionArray[k]['id']).find('.subtask_file_up.deleteSubtask').trigger('click');
            timeOutid.push(deleteDBActionArray[k]['id']);
        }
    });

    $.each(timeOutid,function(k,v){
        var data = checkarrayObj(deleteDBActionArray,'id',v);
        if(data.status){
            deleteDBActionArray.splice(data.index,1); 
        }
    });
    

    



}, 1000);


function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

function toggleNoteOptions(elm){
    if($(elm).hasClass('active')){
        $(elm).removeClass('active');
    }else{

        $(elm).addClass('active');
    }
}

function togglePinUnpin(elm){
    if($(elm).hasClass('active')){
        $(elm).removeClass('active');
    }else{

        $(elm).addClass('active');
    }  
}

function notetypechange(elm){

    var bnpp = $(elm).attr('id');
    if($('#'+ bnpp +':checked').length == 1){
        $('.property_notes').attr('data-notetype', 'my_note');
        $(elm).parents('.b_n_w_c').addClass('my_note').removeClass('share_note');
    }else{
        $('.property_notes').attr('data-notetype', 'share_note');
        $(elm).parents('.b_n_w_c').addClass('share_note').removeClass('my_note');
    }
}

function noteDone(elm){
    var dataAction = $(elm).attr('data-action');
    if(dataAction == 'done'){
        
        var heightElm = $(elm).parents('.b_n_w_c').find('.b_n_w_desc')[0].offsetHeight;

        var html = $(elm).parents('.b_n_w_c').clone();
        
        $(html).addClass('done_note');
        $(html).removeClass('mainNEditor');
        $(html).find('.b_n_w_title input').attr('readonly',true);
        $(html).find('.b_n_w_desc .w_n_description').attr('contenteditable',false);
        $(html).find('.hide_n_elm').removeClass('hide_n_elm');
        $(html).find('.w_n_btn_s').addClass('hide_n_elm');
        $(html).find('.b_n_bottom_sec').addClass('hide_n_elm');
        $(html).find('[contenteditable=true]').attr('contenteditable',false);
        if(heightElm > 95){
            $(html).addClass('minHeight');
        }else{
            $(html).removeClass('minHeight');
        }
        var note_title = $(elm).parents('.b_n_w_c').find("#batch_note_title").val();
        var note_body = $(elm).parents('.b_n_w_c').find("#batch_note_desc").html();
        
        $(html).find('.b_n_w_title>input').removeAttr('id');
        $(html).find('.w_n_description').removeAttr('id');

        var checklist = [];
        if($(".mainNEditor .i_name").length > 0){
            $.each($(".mainNEditor .incompletedCheck .i_name"), function(k,v){
                checklist.push($(v).text() + '@-@incompleted');
            });
            $.each($(".mainNEditor .completedCheck .i_name"), function(k,v){
                checklist.push($(v).text() + '@-@completed');
            });
        }

        var label = [];
        if($(".mainNEditor .labelDiv").length > 0){
            $.each($(".mainNEditor .labelDiv .l_text"), function(k,v){
                label.push($(v).text());
            });
        }

        if($('.property_notes').attr('data-batch_id') != "")
            var aid = $('.property_notes').attr('data-batch_id');
        else {
            var subtask_selected_list = [];
            var subtask_row = $(".pulse-component");
            $.each(subtask_row, function(k, v){
                if($(v).find(".left-indicator-checkbox").hasClass("selected") && $(v).attr("data-id") != undefined)
                    subtask_selected_list.push($(v).attr("data-id"));
            });
            var aid = subtask_selected_list[0];
        }

        var has_seen = [$('.property_notes').attr('data-createdby')];
        if($('.property_notes').attr('data-notetype') == 'unpin_batch_note'){
            var all_subtask_or_one = all_subtask_inthis_task;
            if(coowner.length > 0)
                $.each(coowner, function(k,v){
                    has_seen.push(v);
                });
            if(observer.length>0)
                $.each(observer, function(k,v){
                    has_seen.push(v);
                });
            if(assignee.length>0)
                $.each(assignee, function(k,v){
                    has_seen.push(v);
                });
        }
        else{
            var all_subtask_or_one = [aid];
            $.each(addAsCoOwnerArr, function(k, v){
                if(v.activityid == aid){
                    has_seen.push(v.userid);
                }
            });
            $.each(addAsObsrvrArr, function(k, v){
                if(v.activityid == aid){
                    has_seen.push(v.userid);
                }
            });
            $.each(addAsAssigneeArr, function(k, v){
                if(v.activityid == aid){
                    has_seen.push(v.userid);
                }
            });
        }

        var obj = {
            activity_id: aid,
            msg_body: note_title + '@-@' + note_body,
            sender: user_id,
            sender_name: user_fullname,
            sender_img: user_img,
            checklist: checklist,
            type: $('.property_notes').attr('data-notetype'),
            label: label,
            subtask_lists: all_subtask_or_one,
            has_delete: has_seen
        };

        socket.emit('save_mynote', obj, (res)=>{
            checklist = [];
            if(res.status){
                var subtask_selected_list = [];
                var subtask_row = $(".pulse-component");
                $.each(subtask_row, function(k, v){
                    if($(v).find(".left-indicator-checkbox").hasClass("selected") && $(v).attr("data-id") != undefined)
                        subtask_selected_list.push($(v).attr("data-id"));
                });
                subtask_selected_list.splice(subtask_selected_list.indexOf(obj.activity_id), 1);

                if(subtask_selected_list.length > 0){
                    $.each(subtask_selected_list, function(k, v){
                        obj.activity_id = v;
                        socket.emit('save_mynote', obj, (rep)=>{
                            console.log("note save done ", obj.activity_id);
                        });
                    });
                }

                note_history.push(res.msg);
                if($(html).find('.pinico').hasClass('active')){
                    $(elm).parents('.property_notes').find('.st_note .draw_c_Note .draw_pin_note').prepend(html);
                }else{
                    $(elm).parents('.property_notes').find('.st_note .draw_c_Note .draw_unpin_note').prepend(html);
                }

                var mainelm = $(elm).parents('.b_n_w_c');

                $('.draw_unpin_note .b_n_w_c:eq(0)').addClass('mynote_'+res.msg.note_id);
                $('.draw_unpin_note .b_n_w_c:eq(0)').attr('data-noteid', res.msg.note_id);
                if($('.property_notes').attr('data-notetype') == 'my_note'){
                    $('.draw_unpin_note .b_n_w_c:eq(0)').addClass('my_note');
                }else if($('.property_notes').attr('data-notetype') == 'share_note'){
                    $('.draw_unpin_note .b_n_w_c:eq(0)').addClass('share_note');
                }
                $('.draw_unpin_note .b_n_w_c .switchNav input').attr('id','bnpp_'+res.msg.note_id);
                $('.draw_unpin_note .b_n_w_c:eq(0)').find('.n_update_time span').text('Created at ' + moment(res.msg.created_at).format('h:mm a'));
                
                mainelm.find('.pinico').removeClass('active');
                mainelm.find('.b_n_w_title input').val('');
                mainelm.find('.w_n_description').text('');
                mainelm.find('.w_n_description').text('');
                mainelm.find('.assign_photo').html('').hide();
                mainelm.attr('data-bg','#fff').css('background','#fff');
                mainelm.removeClass('minHeight');
                $('.mainNEditor').hide();
                $('.mainNEditor .w_n_checkList').hide();
                $('.mainNEditor .w_n_description').hide();
                $('.mainNEditor .completecheckItemCo').hide();
                $('.mainNEditor .completedCheck').html('');
                $('.mainNEditor .incompletedCheck').html('');
                $('.createNoteContainer').show();
            }
        });
        
    }else if(dataAction == 'update'){
        var mainelm = $(elm).parents('.b_n_w_c');
        var noteid = $(mainelm).attr('data-noteid');
        var note_title = $(".mynote_"+noteid).find('.b_n_w_title>input').val();
        var note_body = $(".mynote_"+noteid).find('.w_n_description').html();

        var checklist = [];
        if($(".mynote_"+noteid+" .i_name").length > 0){
            $.each($(".mynote_"+noteid+" .incompletedCheck .i_name"), function(k,v){
                checklist.push($(v).text() + '@-@incompleted');
            });
            $.each($(".mynote_"+noteid+" .completedCheck .i_name"), function(k,v){
                checklist.push($(v).text() + '@-@completed');
            });
        }

        var label = [];
        if($(".mynote_"+noteid+" .labelDiv").length > 0){
            $.each($(".mynote_"+noteid+" .labelDiv .l_text"), function(k,v){
                label.push($(v).text());
            });
        }

        var has_seen = [$('.property_notes').attr('data-createdby')];
        if($('.property_notes').attr('data-notetype') == 'unpin_batch_note'){
            var all_subtask_or_one = all_subtask_inthis_task;
            if(coowner.length > 0)
                $.each(coowner, function(k,v){
                    has_seen.push(v);
                });
            if(observer.length>0)
                $.each(observer, function(k,v){
                    has_seen.push(v);
                });
            if(assignee.length>0)
                $.each(assignee, function(k,v){
                    has_seen.push(v);
                });
        }
        else{
            var all_subtask_or_one = [$('.property_notes').attr('data-batch_id')];
            $.each(addAsCoOwnerArr, function(k, v){
                if(v.activityid == $('.property_notes').attr('data-batch_id')){
                    has_seen.push(v.userid);
                }
            });
            $.each(addAsObsrvrArr, function(k, v){
                if(v.activityid == $('.property_notes').attr('data-batch_id')){
                    has_seen.push(v.userid);
                }
            });
            $.each(addAsAssigneeArr, function(k, v){
                if(v.activityid == $('.property_notes').attr('data-batch_id')){
                    has_seen.push(v.userid);
                }
            });
        }

        var obj = {
            noteid: noteid,
            sender_name: user_fullname,
            activity_id: $('.property_notes').attr('data-batch_id'),
            msg_body: note_title + '@-@' + note_body,
            checklist: checklist,
            type: $('.property_notes').attr('data-notetype'),
            label: label,
            subtask_lists: all_subtask_or_one,
            has_delete: has_seen
        };

        socket.emit('update_mynote', obj, (res)=>{
            if(res.status){
                mainelm.find('.w_n_btn_s').addClass('hide_n_elm');
                mainelm.find('.b_n_bottom_sec').addClass('hide_n_elm');
                mainelm.find('.b_n_w_title input').attr('readonly',true);
                mainelm.find('.b_n_w_desc .w_n_description').attr('contenteditable',false);
                mainelm.find('[contenteditable=true]').attr('contenteditable',false);
                mainelm.removeClass('editable');
                var heightElm = $(elm).parents('.b_n_w_c').find('.b_n_w_desc')[0].offsetHeight;
                mainelm.find('.collapse').removeClass('active');
                if(heightElm > 95){
                    mainelm.addClass('minHeight');
                }else{
                    mainelm.find('.collapse').hide();
                    mainelm.removeClass('minHeight');
                }
            }
        });
    }
    
}

function noteSorting(e) {
    e.preventDefault();
    e.stopImmediatePropagation()
    if($(e.target).hasClass('startNewList')){
        if(!$('.noteSortingDiv').is(':visible')){
            $('.noteSortingDiv').show();
        }else{
            $('.noteSortingDiv').hide();
        }
    }
}

function viewSortingNote(e,type) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if(type == 'Shared'){
        if(!$(e.target).hasClass('active')){
            $('.noteSortingDiv li').removeClass('active');
            $(e.target).addClass('active');
            $('.draw_c_Note .b_n_w_c.my_note').css('display','none');
            $('.draw_c_Note .b_n_w_c.share_note').css('display','flow-root');
        }else{
            $(e.target).removeClass('active');
            $('.draw_c_Note .b_n_w_c').css('display','flow-root');
        }

    }else if(type == 'Private'){
        if(!$(e.target).hasClass('active')){
            $('.noteSortingDiv li').removeClass('active');
            $(e.target).addClass('active');
            $('.draw_c_Note .b_n_w_c.share_note').css('display','none');
            $('.draw_c_Note .b_n_w_c.my_note').css('display','flow-root');
        }else{
            $(e.target).removeClass('active');
            $('.draw_c_Note .b_n_w_c').css('display','flow-root');
        }
    }
    
}

function cancelUpdateNote(elm){
    var mainelm = $(elm).parents('.b_n_w_c');
    if(mainelm.hasClass('mainNEditor')){
        $('.mainNEditor').hide();
        $('.createNoteContainer').show();
    }
    else{
        
        $(mainelm).addClass('done_note');
        $(mainelm).removeClass('mainNEditor');
        $(mainelm).find('.b_n_w_title input').attr('readonly',true);
        $(mainelm).find('.b_n_w_desc .w_n_description').attr('contenteditable',false);
        $(mainelm).find('.hide_n_elm').removeClass('hide_n_elm');
        $(mainelm).find('.w_n_btn_s').addClass('hide_n_elm');
        $(mainelm).find('.b_n_bottom_sec').addClass('hide_n_elm');
        $(mainelm).find('[contenteditable=true]').attr('contenteditable',false);
    }
}

function deleteBNote(elm){
    var mainElm = $(elm).parents('.b_n_w_c');
    var elmDoneCheck = mainElm.hasClass('done_note');

    if(elmDoneCheck){
        mainElm.remove();
    }
}

function editBNote(elm){
    var mainElm = $(elm).parents('.b_n_w_c');
    var elmDoneCheck = mainElm.hasClass('done_note');
    var elmCheckEditabel = mainElm.hasClass('editable');

    if(!elmCheckEditabel){
        mainElm.addClass('editable');
    }
    mainElm.removeClass('minHeight');
    
    if(elmDoneCheck){
        mainElm.find('.b_n_w_title input').attr('readonly',false);
        mainElm.find('.b_n_w_desc .w_n_description').attr('contenteditable',true);
        mainElm.find('.b_n_w_title input').focus();
        mainElm.find('.w_n_btn_s').removeClass('hide_n_elm');
        mainElm.find('.b_n_bottom_sec').removeClass('hide_n_elm');
        mainElm.find('.btn_done_n').attr('data-action','update');
        mainElm.find('.btn_done_n').text('Update');
        mainElm.find('.moreico').removeClass('active');
        mainElm.find('[contenteditable=false]').attr('contenteditable',true);

    }
}

function openBNoteEditor(elm){
    $(elm).parents('.b_n_w_c').addClass('maxEditor');

    var title = $(elm).parents('.b_n_w_c').find('.b_n_w_title input').val();
    var desc = $(elm).parents('.b_n_w_c').find('.b_n_w_desc .w_n_description').html();
    var checklist = $(elm).parents('.b_n_w_c').find('.b_n_w_desc .w_n_checkList').html();
    var hasPinCheck = $(elm).parents('.b_n_w_c').find('.pinico').hasClass('active');
    var bgColor = $(elm).parents('.b_n_w_c').attr('data-bg');

    $('#edit_n_title').val(title);
    $('#edit_n_desc').html(desc);
    $('#edit_n_checklist').html(checklist);
    if(hasPinCheck){
        $('#custom_n_editor').find('.pinico').addClass('active');
    }else{
        $('#custom_n_editor').find('.pinico').removeClass('active');
    }

    $('#custom_n_editor .editor_main_con').attr('data-bg',bgColor).css('background',bgColor);

    if($(elm).parents('.b_n_w_c').find('.w_n_checkList').is(':visible')){
        $('#custom_n_editor .w_n_checkList').show();
        $('#edit_n_desc').hide();
    }else{
        $('#custom_n_editor .w_n_checkList').hide();
        $('#edit_n_desc').show();
    }
    

    $('#custom_n_editor').show();
}

function changeNoteBG(elm){
    var dataColor = $(elm).attr('data-color');
    var elmAcCheck = $(elm).hasClass('active');

    if(!elmAcCheck){
        $(elm).parents('.b_n_w_c').css('background',dataColor);
        $(elm).parents('.b_n_w_c').attr('data-bg',dataColor);
        $(elm).parent('.colorPick').find('.colorDiv').removeClass('active');
        $(elm).addClass('active');
    }
}

function open_moreN_op(e,elm){
    var checkAc = $(elm).hasClass('active');
    if($(e.target).hasClass('more_Ver_ico')){
        if(checkAc){
            $(elm).removeClass('active');
        }else{
            $(elm).addClass('active');
        }
    }

    if($('#edit_n_checklist').is(':visible')){
        $('.moreActionNote .checkelm').text('Hide checkboxes');
    }else{
        $('.moreActionNote .checkelm').text('Show checkboxes');
    }
}

function closeNEditor(elm){
    var mainElm = $('.b_n_w_c.maxEditor');

    
    var title = $('#edit_n_title').val();
    var desc = $('#edit_n_desc').html();
    var checklistItem = $('#edit_n_desc').next('.w_n_checkList').html();
    var hasPinCheck = $('#custom_n_editor').find('.pinico').hasClass('active');
    var bgColor = $('#custom_n_editor .editor_main_con').attr('data-bg');

    mainElm.find('.b_n_w_title input').val(title);
    mainElm.find('.w_n_description').html(desc);
    mainElm.find('.w_n_checkList').html(checklistItem);
    if($('#edit_n_desc').next('.w_n_checkList').is(':visible')){
        mainElm.find('.w_n_checkList').show();
        mainElm.find('.w_n_description').hide(); 
    }else{
        mainElm.find('.w_n_description').show(); 
        mainElm.find('.w_n_checkList').hide();
    }
    if(hasPinCheck){
        mainElm.find('.pinico').addClass('active');
    }else{
        mainElm.find('.pinico').removeClass('active');
    }
    mainElm.attr('data-bg',bgColor).css('background-color',bgColor);
    $('.b_n_w_c').removeClass('maxEditor');
    $('#custom_n_editor').hide();
}

function findeditorLabel(e,elm){
    var value = $(elm).val();
    // var activity_id = $('#mainSideBarContent').find('.activeTodo').attr('data-activityid');

    var labelDesign = '<div class="labelDiv"  data-value="'+value+'"><span class="l_img"></span><span class="l_text">'+value+'</span><span class="l_close" onclick="completeN_label(this)" ></span></div>';

    $(elm).parent('.add_l_noteCo').find('.label_list .l_checkName').each(function () {

        if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
            $(this).parent('li').show()
        } else {
            $(this).parent('li').hide()
        }
    });

    $(elm).parent('.add_l_noteCo').find(".label_list .l_checkName").unhighlight();
    $(elm).parent('.add_l_noteCo').find(".label_list .l_checkName").highlight(value);
    var design = '<li onclick="completeN_label(this)" class="listENLabel" ><span class="l_checkBox active" ></span> <span class="l_checkName hvText">'+value+'</span></li>';
    if(editorlabel.indexOf(value) > -1){
        $(elm).parent('.add_l_noteCo').find('.create_ico').hide(); 
    }else{
        if(e.keyCode == 13){
            // socket.emit('save_note_label', {activity_id, user_id, value}, (res)=>{
                $(elm).parent('.add_l_noteCo').find('.label_list').append(design);
                editorlabel.push(value);
                $(elm).parent('.add_l_noteCo').find(".label_list .l_checkName").unhighlight();
                $(elm).parent('.add_l_noteCo').find(".label_list li").show();
                $(elm).val('');
                $(elm).parent('.add_l_noteCo').find('.create_ico').hide();
                $(elm).parents('.b_n_w_c').find('.n_label_container').append(labelDesign);
            // });
        }else{

            $(elm).parent('.add_l_noteCo').find('.create_ico .valueText').text(value); 
            $(elm).parent('.add_l_noteCo').find('.create_ico').show(); 
        }
    }
    
}

function createENlabel(elm){
    var value = $(elm).parent('.add_l_noteCo').find('.search').val();
    var design = '<li onclick="completeN_label(this)" class="listENLabel" ><span class="l_checkBox active" ></span> <span class="l_checkName hvText">'+value+'</span></li>';
    var labelDesign = '<div class="labelDiv" data-value="'+value+'" ><span class="l_img"></span><span class="l_text">'+value+'</span><span class="l_close" onclick="completeN_label(this)"></span></div>';

    if(editorlabel.indexOf(value) == -1){
        // socket.emit('save_note_label', {activity_id, user_id, value}, (res)=>{
            $(elm).parent('.add_l_noteCo').find('.label_list').append(design);
            editorlabel.push(value);
            $("#custom_n_editor .label_list .l_checkName").unhighlight();
            $("#custom_n_editor .label_list li").show();
            $(elm).parent('.add_l_noteCo').find('.search').val('');
            $(elm).hide();
            $('#custom_n_editor').find('.n_label_container').append(labelDesign);
        // });
    }
}

function openLabelNote(e,elm){

    let x = $(event.target).offset();
    let pgHeight = $('#right-section-area').height();
    let elmHeight = $(elm).find('.add_l_noteCo').height();
    let actHeight = pgHeight - x.top;

    if($(e.target).hasClass('addlabel_ico')){
        if($(elm).find('.add_l_noteCo').is(':visible')){
    
            $(elm).find('.add_l_noteCo').hide();
        }else{
            $(elm).find('.label_list').html('');
    
            $.each(editorlabel,function(k,v){
                if(editNLUCL.indexOf(v) > -1){
    
                    var design = '<li onclick="completeN_label(this)" class="listENLabel" ><span class="l_checkBox" ></span> <span class="l_checkName hvText">'+v+'</span></li>';
                }else{
                    var design = '<li onclick="completeN_label(this)" class="listENLabel" ><span class="l_checkBox" ></span> <span class="l_checkName hvText">'+v+'</span></li>';
    
                }
                $(elm).find('.add_l_noteCo .label_list').append(design);
            })

            if(actHeight < elmHeight){
                $(elm).find('.add_l_noteCo').css({
                    'top':x.top - elmHeight - 26+'px',
                    'left':x.left+'px'
                });
            }else{
                $(elm).find('.add_l_noteCo').css({
                    'top':x.top + 24+'px',
                    'left':x.left+'px'
                });
            }
            $(elm).find('.add_l_noteCo').show();
            $('.search.hvText').focus();
        }
    }
}

function completeN_label(elm){

    if($(elm).hasClass('listENLabel')){
        var value = $(elm).find('.l_checkName').text();
        var checkAc = $(elm).find('.l_checkBox').hasClass('active');

        var labelDesign = '<div class="labelDiv" data-value="'+value+'" ><span class="l_img"></span><span class="l_text">'+value+'</span><span class="l_close" onclick="completeN_label(this)"></span></div>';

        if(checkAc){
            $(elm).find('.l_checkBox').removeClass('active');
            editNLUCL.push(value);
            var allLabelDiv = $(elm).parents('.b_n_w_c').find('.n_label_container .labelDiv');

            $.each(allLabelDiv,function(k,v){
                if($(v).attr('data-value') == value){
                    $(v).remove();
                }
            })
        }else{
            $(elm).find('.l_checkBox').addClass('active');
            removeA(editNLUCL,value);
            $(elm).parents('.b_n_w_c').find('.n_label_container').append(labelDesign);

        }
    }else{
        var value = $(elm).parent('.labelDiv').attr('data-value');
        if($(elm).parents('.b_n_w_c').hasClass('done_note')){
            var noteid = $(elm).parents('.b_n_w_c').attr('data-noteid');
            var batchid = $('#batchPropertyNotes').attr('data-batch_id');
            socket.emit('update_note_label', {noteid, batchid, value}, (res)=>{
                console.log(res);
            });
        }
        $(elm).parent('.labelDiv').remove();
        editNLUCL.push(value);
    }
}

function deleteEN(elm){
    if($(elm).parents('.b_n_w_c').hasClass('editable')){
        var noteid = $(elm).parents('.b_n_w_c').attr('data-noteid');
        var batchid = $('.property_notes').attr('data-batch_id');
        
        socket.emit('delete_bn', {noteid, batchid}, (res) =>{
            if(res.status)
                $(elm).parents('.b_n_w_c').remove();
        });
    }
}

function takeNote(elm,type){
    $('.mainNEditor').show();
    $(elm).parent('.createNoteContainer').hide();
    $('.mainNEditor .b_n_w_title input').focus();
    $('.mainNEditor .n_label_container').html('');
    if(type == 'check'){
        $('.mainNEditor .w_n_description').hide();
        $('.mainNEditor .w_n_checkList').show();
    }else{
        $('.mainNEditor .w_n_description').show();
        $('.mainNEditor .w_n_checkList').hide();
    }
}

function addlistItemCoIn(e,elm){
    e.preventDefault();
}

function togglecompLI(elm){
    var checkAc = $(elm).find('.rotateArrow').hasClass('active');
    var mainElm = $(elm).find('.rotateArrow');

    if(checkAc){
        mainElm.removeClass('active');
        $(elm).next('.completedCheck').show();
    }else{
        mainElm.addClass('active');
        $(elm).next('.completedCheck').hide();
    }
}

function checkNLItem(elm,type){
    var text = $(elm).parent('li').find('.i_name').text();
    
    var coLength = $(elm).parents('.b_n_w_c').find('.completedCheck .c_box').length;

    if(type == 'incompleted'){
        var design = '<li><span class="c_box active" onclick="checkNLItem(this,\'completed\')"></span><span class="i_name" contenteditable="true" onkeydown="listitemName(event,this)">'+text+'</span> <span class="i_close" onclick="removeListItemN(this,\'com\')"></span></li>';
        $(elm).parents('.w_n_checkList').find('.completedCheck').append(design);
        $(elm).parents('.b_n_w_c').find('.completecheckItemCo').show();
        coLength++;
    }else{
        var design = '<li><span class="c_box" onclick="checkNLItem(this,\'incompleted\')"></span><span class="i_name" contenteditable="true" onkeydown="listitemName(event,this)">'+text+'</span> <span class="i_close" onclick="removeListItemN(this,\'in\')"></span></li>';
        $(elm).parents('.w_n_checkList').find('.incompletedCheck').append(design);
        coLength--;
    }

    $(elm).parents('.b_n_w_c').find('.headingCom .counter').text(coLength);

    if(coLength == 0){
        $(elm).parents('.b_n_w_c').find('.completecheckItemCo').hide();
    }else{
        $(elm).parents('.b_n_w_c').find('.completecheckItemCo').show();
        $(elm).parents('.b_n_w_c').find('.headingCom .counter').text(coLength)
    }
    $(elm).parent('li').remove();

}

function addlistItemCoup(e,elm){
    if(e.keyCode > 48 && e.keyCode < 106){

        var design = '<li><span class="c_box" onclick="checkNLItem(this,\'incompleted\')"></span><span class="i_name" id="newListcheckItem" contenteditable="true" onkeydown="listitemName(event,this)">'+e.key+'</span> <span class="i_close" onclick="removeListItemN(this,\'in\')"></span></li>';
        $(elm).parents('.w_n_checkList').find('.incompletedCheck').append(design);
        $(elm).blur();
        $('#newListcheckItem').focus();
        placeCaretAtEnd(document.getElementById('newListcheckItem'));
        $('#newListcheckItem').attr('id','');
    }else{
        e.preventDefault();
    }
    
}

function removeListItemN(elm,type){
    
    if(type == 'com'){

        var coLength = $(elm).parents('.b_n_w_c').find('.completedCheck .c_box.active').length - 1;
        if(coLength == 0){
            $(elm).parents('.b_n_w_c').find('.completecheckItemCo').hide();
        }else{
            $(elm).parents('.b_n_w_c').find('.completecheckItemCo').show();
            $(elm).parents('.b_n_w_c').find('.completecheckItemCo .headingCom .counter').text(coLength)
        }
    }
    $(elm).parent('li').remove();
}

function listitemName(e,elm){
    if(e.keyCode == 13){
        e.preventDefault();
        $(elm).parents('.b_n_w_desc').find('.addlistItemco').focus();
    }
}

function toggleENCheckboxs(elm){

    if($(elm).parents('.b_n_w_c').find('.w_n_checkList').is(':visible')){
        if($(elm).parents('.b_n_w_c').find('.w_n_checkList').find('.c_box').length == 0){

            $(elm).parents('.b_n_w_c').find('.w_n_checkList').hide();
        }
        $(elm).parents('.b_n_w_c').find('.w_n_description').show();
        $(elm).removeClass('active');
    }else{
        $(elm).parents('.b_n_w_c').find('.w_n_checkList').show();
        $('.addlistItemco').focus();
        if($(elm).parents('.b_n_w_c').find('.w_n_description').text().length == 0){

            $(elm).parents('.b_n_w_c').find('.w_n_description').hide();
        }
        $(elm).addClass('active');
    }
}

function showCollaborator(elm){

    $(elm).parents('.b_n_w_c').find('.b_n_t_r_s').hide();
    $(elm).parents('.b_n_w_c').find('.b_n_w_title').hide();
    $(elm).parents('.b_n_w_c').find('.b_n_w_desc').hide();
    $(elm).parents('.b_n_w_c').find('.n_label_container').hide();
    $(elm).parents('.b_n_w_c').find('.n_update_time').hide();
    $(elm).parents('.b_n_w_c').find('.b_n_bottom_sec').hide();
    $(elm).parents('.b_n_w_c').find('.collaboratorDiv').show();
}

function cancelAddCollaborators(elm){
    $(elm).parents('.b_n_w_c').find('.b_n_t_r_s').show();
    $(elm).parents('.b_n_w_c').find('.b_n_w_title').show();
    $(elm).parents('.b_n_w_c').find('.b_n_w_desc').show();
    $(elm).parents('.b_n_w_c').find('.n_label_container').show();
    $(elm).parents('.b_n_w_c').find('.n_update_time').show();
    $(elm).parents('.b_n_w_c').find('.b_n_bottom_sec').show();
    $(elm).parents('.b_n_w_c').find('.collaboratorDiv').hide();
}

function showNoteReminderOp(e,elm){
    var elmAcCheck = $(elm).hasClass('active');
    var elmClassCK = $(e.target).hasClass('reminder_ico');

    let x = $(event.target).offset();
    let pgHeight = $('#right-section-area').height();
    let elmHeight = $(elm).find('.moreActionNoteRem').height();
    let actHeight = pgHeight - x.top;

    if(elmClassCK){
        if(elmAcCheck){
            $(elm).removeClass('active');
        }else{
            $(elm).addClass('active');
            if(actHeight < elmHeight){
                $(elm).find('.moreActionNoteRem').css({
                  'top':x.top - elmHeight - 20+'px',
                  'left':x.left+'px'
                });
            }else{
                $(elm).find('.moreActionNoteRem').css({
                    'top':x.top + 24+'px',
                    'left':x.left+'px'
                });
            }
        }
    }
}

function addNoteCollaborator(e,elm){
    var value = $(elm).val();
    var design  = '';
        design += '<li>';
        design +=   '<div class="uImg"><img src="'+ file_server +'profile-pic/Photos/img.png" alt=""></div>';
        design +=   '<div class="nameNemail">';
        design +=       '<div class="email" style="font-weight:bold;color:#000; margin-top:12px;">'+value+'</div>';
        design +=   '</div>';
        design +=   '<div class="removeColla" onclick="removeEditorCollaborator(this)"></div>';
        design += '</li>';

    if(e.keyCode == 13){
        $(elm).parents('.colla_content').find('.collaborators_list').append(design);
        noteCollaboratorsEmail.push(value)
        $(elm).val('');
    }
}

function saveNoteCollaborators(elm){
    $(elm).parents('.b_n_w_c').find('.n_label_container').remove('.uImg')
    $.each(noteCollaboratorsEmail,function(k,v){
        var design = '<div class="uImg" data-email="'+v+'" ><img src="'+ file_server +'profile-pic/Photos/img.png" alt=""></div>';
        $(elm).parents('.b_n_w_c').find('.n_label_container').prepend(design);

    })

    $(elm).parents('.b_n_w_c').find('.b_n_t_r_s').show();
    $(elm).parents('.b_n_w_c').find('.b_n_w_title').show();
    $(elm).parents('.b_n_w_c').find('.b_n_w_desc').show();
    $(elm).parents('.b_n_w_c').find('.n_label_container').show();
    $(elm).parents('.b_n_w_c').find('.n_update_time').show();
    $(elm).parents('.b_n_w_c').find('.b_n_bottom_sec').show();
    $(elm).parents('.b_n_w_c').find('.collaboratorDiv').hide();
}

function triggerImgInput(elm){
    elmUploadedImg = $(elm).parents('.b_n_w_c');
    $('#uploadNoteimg').click();
}

function uploadNoteImg(e,elm){
    var reader = new FileReader();
    reader.onload = function (e) {
        var design = '<div class="photo_div"><img src="'+reader.result+'" alt=""><div class="delete_photo" onclick="removeNotePhoto(this)"></div></div>';
        elmUploadedImg.find('.assign_photo').append(design);
        elmUploadedImg.find('.assign_photo').css('display','flex');
    };
    reader.readAsDataURL($(e)[0].srcElement.files[0]);
}

function removeNotePhoto(elm){
    $(elm).parent('.photo_div').remove();
}

function removeEditorCollaborator(elm){
    var value = $(elm).parents('li').find('.email').text();
    $(elm).parents('li').remove();
    removeA(noteCollaboratorsEmail,value);
}

function collapseNoteDesc(elm){
    var checkElm = $(elm).hasClass('active');

    if(checkElm){
        $(elm).removeClass('active');
        $(elm).parents('.b_n_w_c.done_note').addClass('minHeight');
    }else{
        $(elm).addClass('active'); 
        $(elm).parents('.b_n_w_c.done_note').removeClass('minHeight');
    }
}

function triggerEditNote(elm){
    var checkDoneNote = $(elm).parents('.b_n_w_c').hasClass('done_note');
    var mainElm = $(elm).parents('.b_n_w_c');

    if(checkDoneNote){
        if(!mainElm.hasClass('editable')){
            mainElm.find('.note_m_op .editbtnNote').trigger('click');
        }
    }
}

function filteringTaskShowing (){
    if($('.pulse-left-indicator.can-edit[data-value="#00c875;"]').length > 0){
        $('#filteringTask').addClass('activeElm');
        $('#openBatchAction').css('right','288px');
    }else{
        $('#filteringTask').removeClass('activeElm'); 
        $('#openBatchAction').css('right','100px');
    }
}

function hideAllToggleInput(){
    $('#actionNoteDesc').removeClass('active disabled');
    $('#action_amount').removeClass('active');
    $('#action_hour').removeClass('active');
    $('#task_desc_group').hide().attr('data-width','100').css('width','100%');
    $('#task_b_a_Amount').hide().attr('data-width','16.66').css('width','16.66%');
    $('#task_e_a_hours').hide().attr('data-width','16.66').css('width','16.66%');
    $('#task_e_a_hrate').hide().attr('data-width','16.66').css('width','16.66%');

    $("#taskBAinput").val('');
    $("#taskAAinput").val('');
    $("#taskEHinput").val('');
    $("#taskEHRinput").val('');
    $("#taskAHinput").val('');
    $("#taskAHRinput").val('');
}


// ::::::::::::::::::::::::::::::::::: //
// ::::::::::::::::::::::::::::::::::: //
// ::::::::::::::::::::::::::::::::::: //
// ::::::::::::::::::::::::::::::::::: //
/*
    File server certificate was not allowed yet,
    then it fire a new popup window, and show the certificate for allowing it.
*/

$.get('/s3Local/listOfBuckets', function(rep) {
    if (rep.status !== true) {
        console.log("Bucket not found");
    }
});

function create_priority_status() {
    $('.create_priority_status').on('click', function(event) {
        var activtyid = $(this).closest('.pulse-component').attr('data-id');
        var color = $(this).attr('style').split(':')[1];
        var Phtml = '<span onclick="pickPriority(this)" data-id="' + activtyid + '" data-createdby="' + user_id + '"  style="border-radius:3px;background-color:' + color + '" data-color="' + color + '" class="single_priority">';
        Phtml += '<span style="display:block" class="prioritySamColor"><img src="/images/basicAssets/drop.svg" alt=""></span>';
        Phtml += '<span style="width:89px;height:28px;pointer-events:auto;background-color:#f7f7f7;color:#596496" onclick="editPrioritylabel(this)"  onkeypress="keypressPrioritylabel(event,this)" onblur="blurPrioritylabel(event,this)" class="priorityLabel" contenteditable="true" placeholder="Add Label"></span>';
        Phtml += '</span>';
        Phtml += '<div class="priorityChangeColor">'
        $.each($(pickPColor), function(k, v) {
            Phtml += '' + v.outerHTML + '';
        });
        Phtml += '</div>';

        var Shtml = '<span onclick="pickStatus(this)" data-id="' + activtyid + '" data-createdby="' + user_id + '"  style="border-radius:3px;background-color:' + color + '" data-color="' + color + '" class="single_status">';
        Shtml += '<span style="display:block" class="statusSamColor" onclick="openColordiv(event,this)"><img src="/images/basicAssets/drop.svg" alt=""></span>';
        Shtml += '<span style="width:89px;height:28px;pointer-events:auto;background-color:#f7f7f7;color:#596496" onclick="editStatuslabel(this)" onkeypress="keypressStatuslabel(event,this)" onblur="blurStatuslabel(this)" class="statusLabel" contenteditable="true" placeholder="Add Label"></span>';
        Shtml += '</span>';
        Shtml += '<div class="statusChangeColor">'
        $.each($(pickSColor), function(k, v) {
            Shtml += '' + v.outerHTML + '';
        });
        Shtml += '</div>';

        if ($(this).parents('.priority-color-wrapper').length > 0) {
            $(Phtml).insertBefore('.create_priority');
            $('.priority_container')
                .find('.single_priority:last')
                .css({
                    'border': '0.5px solid #579bfc',
                    'box-sizing': 'border-box',
                    'transition': 'border 0.4s linear'
                })
                .find('.priorityLabel').focus();
            priorityColorSample();
        } else if ($(this).parents('.status-color-wrapper').length > 0) {
            $(Shtml).insertBefore('.create_status');
            $('.status_container')
                .find('.single_status:last')
                .css({
                    'border': '0.5px solid #579bfc',
                    'box-sizing': 'border-box',
                    'transition': 'border 0.4s linear'
                })
                .find('.statusLabel').focus();
        }
        $(this).remove();
        keypressBlur();
        pickPrioColor();
        pickStatusColor();
        // StatusColorSample();
    });
}


function colorHide(arr, targetDiv){
    var totalPrio = arr.length;
    $('.create_priority_status').show();
    if (totalPrio > 0) {
        for (var i = 0; i < totalPrio; i++) {
            $('.' + targetDiv + ' .create_priority_status').each((k, v) => {
                if ($(v).attr('data-color').toString().trim() + ';' === arr[i].color.toString().trim()) {
                    $(v).hide();
                }
            });
        }
    }
};

function priorityColorSample() {
    $('.prioritySamColor').on('click', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        colorHide(customPriority, 'priorityChangeColor');

        var parent = $(this).parent('.single_priority');
        if (parent.next('.priorityChangeColor').is(':visible')) {
            parent.next('.priorityChangeColor').hide()
        } else {

            $('.priorityChangeColor').hide();
            parent.next('.priorityChangeColor').show();
            $('.priority-color-wrapper').hide();
        }
    });
}

function viewUsersList(e) {

    $("#subTaskTitleEdit").hide();
    $("#subTaskTitleEdit").text("");

    var activityid = $(e.target).attr('data-id');
    var activityCreatedBy = $(e.target).attr('data-createdby');

    if ($('.assignee_users').is(':visible')) {
        if ($(e.target).hasClass('person-cell-component')) {
            $('.assignee_users').hide();
        }
    } else {
        if ($(e.target).hasClass('person-cell-component')) {
            $(e.target).find('.src_users').val('');
            $(".workspaceform").scrollLeft(0);
            $('.pulse-component .name-cell').removeClass('heading');

            $('.ObserverCell').css('z-index', 0);
            $('.AssigneeCell').css('z-index', 0);
            $('.priorityCell').css('z-index', 0);

            $(e.target).css('z-index', 102);

            if ($('.pulse-component').length < 10) {
                scrollToBottom('.workspaceform');
            }

            $(e.target).find('.assignee_users').show();

            $('.assignee_users').find('.users_container').html("");

            if ($(e.target).closest('.person-cell').hasClass('coowonerCell')) {
                var ownerArrName = [];

                $.each($(e.target).closest('.pulse-component').find('.WonerCell .person-bullet-component .owner_img'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        ownerArrName.push($(v).attr('title').toLowerCase());
                    }
                });

                $.each(workspace_user, function(k, v) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allcoOwner = $(e.target).parents('.pulse-component._eachsubtask').find('.coowonerCell .person-bullet-component.inline-image img');

                    var alreadycoOwnerid = [];

                    $.each(allcoOwner, function(kaaa, vaaa) {
                        alreadycoOwnerid.push($(vaaa).attr('data-uuid'))
                    });

                    if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                        if (coowner.indexOf(v.id) > -1) {

                            var usersDesign = '<div data-uid="' + v.id + '"  class="usersList ' + ((alreadycoOwnerid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsCoOwner(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            if ($("#actCre").val() == v) {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                            } else {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            }
                            usersDesign += '</div>';
                            if (alreadycoOwnerid.indexOf(v.id) > -1) {
                                $('.users_container').prepend(usersDesign);
                            } else {
                                $('.users_container').append(usersDesign);
                            }
                        }
                    } else {
                        if (observer.indexOf(v.id) == -1 && v.id.toString() != $('#actCre').val()) {
                            var usersDesign = '<div data-uid="' + v.id + '"  class="usersList" id="subtask_' + id + '" onclick="addAsCoOwner(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        }
                    }
                });
            }

            if ($(e.target).closest('.person-cell').hasClass('ObserverCell')) {

                var ownerArrName = [];
                var cownerArrName = [];

                $.each($(e.target).closest('.pulse-component').find('.WonerCell .person-bullet-component .owner_img'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        ownerArrName.push($(v).attr('title').toLowerCase());
                    }
                });

                $.each($(e.target).closest('.pulse-component').find('.coowonerCell .person-bullet-component .person-bullet-image'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        cownerArrName.push($(v).attr('title').toLowerCase());
                    }
                });

                $.each(workspace_user, function(k, v) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allAssignee = $(e.target).parents('.pulse-component._eachsubtask').find('.AssigneeCell .person-bullet-component.inline-image img');
                    var allObserver = $(e.target).parents('.pulse-component._eachsubtask').find('.ObserverCell .person-bullet-component.inline-image img');
                    var allAssigneeid = [];
                    $.each(allAssignee, function(kaaa, vaaa) {
                        allAssigneeid.push($(vaaa).attr('data-uuid'))
                    });

                    var alreadyObserverid = [];

                    $.each(allObserver, function(kaaa, vaaa) {
                        alreadyObserverid.push($(vaaa).attr('data-uuid'))
                    });

                    if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                        if (observer.indexOf(v.id) > -1) {
                            var usersDesign = '<div data-uid="' + v.id + '"  class="usersList ' + ((alreadyObserverid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsObsrvr(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            if ($("#actCre").val() == v) {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                            } else {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            }
                            usersDesign += '</div>';

                            if (alreadyObserverid.indexOf(v.id) > -1) {
                                $('.users_container').prepend(usersDesign);
                            } else {
                                $('.users_container').append(usersDesign);
                            }
                        }
                    } else {
                        if (coowner.indexOf(v.id) == -1 && v.id.toString() != $('#actCre').val()) {
                            var usersDesign = '<div data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addAsObsrvr(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        }
                    }
                });
            }

            if ($(e.target).closest('.person-cell').hasClass('AssigneeCell')) {
                $.each(workspace_user, function(k, v) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allObserver = $(e.target).parents('.pulse-component._eachsubtask').find('.AssigneeCell .person-bullet-component.inline-image img');

                    var allobserversid = [];
                    var alreadyObserverid = [];

                    $.each(allObserver, function(kaaa, vaaa) {
                        allobserversid.push($(vaaa).attr('data-uuid'));
                        if (alreadyObserverid.indexOf($(vaaa).attr('data-uuid')) == -1) {
                            alreadyObserverid.push($(vaaa).attr('data-uuid'))
                        }
                    });

                    if (sharedMemberList.indexOf(v.id.toString()) > -1 && v.id.toString() != $('#actCre').val()) {

                        var usersDesign = '<div data-uid="' + v.id + '" class="usersList ' + ((alreadyObserverid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                        if ($("#actCre").val() == v) {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                        } else {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                        }
                        usersDesign += '</div>';

                        if (alreadyObserverid.indexOf(v.id) > -1) {
                            $('.users_container').prepend(usersDesign);
                        } else {
                            $('.users_container').append(usersDesign);
                        }
                    } else {
                        if (v.id.toString() != $('#actCre').val()) {
                            var usersDesign = '<div data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        }
                    }
                });
            }
            //For Batch Opt
            //For Batch Opt

            if ($(e.target).closest('.st_coWoner').hasClass('coowonerCell')) {

                var ownerArrName = [];

                $.each($(e.target).closest('.pulse-component').find('.WonerCell .person-bullet-component .owner_img'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        ownerArrName.push($(v).attr('title').toLowerCase());
                    }
                });

                $.each(workspace_user, function(k, v) {
                    if (v.id !== $('#taskOwnerList').find('.ownerThisToDo').attr('data-uuid')) {
                        if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                            if (ownerArrName.indexOf(v.fullname.toLowerCase()) == -1) {
                                var id = v.id;
                                var img = v.img;
                                var fullname = v.fullname;
                                var usersDesign = '<div data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addAsCoOwner(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                                usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname +
                                    '" alt="' + v.fullname + '">';
                                if ($("#actCre").val() == v) {
                                    usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                                } else {
                                    usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                                }
                                usersDesign += '</div>';
                                $('.users_container').append(usersDesign);
                            }
                        }
                    }
                });
            }

            if ($(e.target).closest('.st_observer').hasClass('ObserverCell')) {

                var ownerArrName = [];
                var cownerArrName = [];

                $.each($(e.target).closest('.pulse-component').find('.WonerCell .person-bullet-component .owner_img'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        ownerArrName.push($(v).attr('title').toLowerCase());
                    }

                });

                $.each($(e.target).closest('.pulse-component').find('.coowonerCell .person-bullet-component .person-bullet-image'), (k, v) => {
                    if ($(v).attr('title') != undefined) {
                        cownerArrName.push($(v).attr('title').toLowerCase());
                    }
                });

                $.each(workspace_user, function(k, v) {
                    if (coowner.indexOf(v.id) == -1) {
                        if (v.id !== $('#taskOwnerList').find('.ownerThisToDo').attr('data-uuid')) {
                            if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                                if (ownerArrName.indexOf(v.fullname.toLowerCase()) == -1 && cownerArrName.indexOf(v.fullname.toLowerCase()) == -1) {
                                    var id = v.id;
                                    var img = v.img;
                                    var fullname = v.fullname;
                                    var allAssignee = $(e.target).parents('.pulse-component._eachsubtask').find('.AssigneeCell .person-bullet-component.inline-image img');
                                    var allObserver = $(e.target).parents('.pulse-component._eachsubtask').find('.ObserverCell .person-bullet-component.inline-image img');
                                    var allAssigneeid = [];
                                    $.each(allAssignee, function(kaaa, vaaa) {
                                        allAssigneeid.push($(vaaa).attr('data-uuid'))
                                    });

                                    var alreadyObserverid = [];

                                    $.each(allObserver, function(kaaa, vaaa) {
                                        alreadyObserverid.push($(vaaa).attr('data-uuid'))
                                    });

                                    if (allAssigneeid.indexOf(v.id) == -1) {
                                        var usersDesign = '<div data-uid="' + v.id + '" class="usersList ' + ((alreadyObserverid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsObsrvr(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                                        if ($("#actCre").val() == v) {
                                            usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                                        } else {
                                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                                        }
                                        usersDesign += '</div>';
                                        $('.users_container').append(usersDesign);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            if ($(e.target).closest('.st_assignee').hasClass('AssigneeCell')) {
                $.each(workspace_user, function(k, v) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allObserver = $(e.target).parents('.pulse-component._eachsubtask').find('.ObserverCell .person-bullet-component.inline-image img');
                    var allobserversid = [];
                    $.each(allObserver, function(kaaa, vaaa) {
                        allobserversid.push($(vaaa).attr('data-uuid'))
                    });
                    if (allobserversid.indexOf(v.id) == -1) {
                        if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                            var usersDesign = '<div data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname +
                                '" alt="' + v.fullname + '">';
                            if ($("#actCre").val() == v) {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                            } else {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            }
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        } else {
                            var usersDesign = '<div data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname +
                                '" alt="' + v.fullname + '">';
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';

                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);

                        }
                    }
                });
            }

            $('.flex_heading').css('z-index', '0');
            $(e.target).closest('.flex_heading').css('z-index', '1');
            $(e.target).closest('.cell-component').css('z-index', '102');

            $(e.target).find('.src_users').focus();
        }
    }
}

function addAsCoOwner(id, activityid, activityCreatedBy, img, eve) {
    if (coowner.indexOf(id) == -1 && observer.indexOf(id) == -1) {

        var targetuser = [];
        targetuser.push({
            id: id,
            type: 'owner'
        });
        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.activityCreatedBy = $('#actCre').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = targetuser;
        activity.activityType = 'Task';
        activity.activityUpdateType = 'participants';
        activity.participantType = 'owner';
        activity.participantedTblID = [];

        activity.activityUpdate((response) => {
            for (var i = 0; i < response.activityUpdateResponse.response.tblid.length; i++) {
                participatedOwner.push(response.activityUpdateResponse.response.tblid[i]);
            }

            taskParticipants.push({
                id: id,
                tbl_id: response.activityUpdateResponse.response.tblid[0],
                type: "owner",
            });

            coowner.push(id);
            let tskOwnr = $('.ownerThisToDo').attr('data-uuid');

            $('#taskOwnerList img').remove();
            // $('#taskOwnerList .count_plus').hide();
            $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').html('');
            var currentImage = [];
            $.each(coowner, (k, v) => {
                currentImage.push(v);
                if (currentImage.indexOf(tskOwnr) == -1) {
                    currentImage.push(tskOwnr);
                }
                if (currentImage.length < 4) {
                    $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
                }
                // $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(tskOwnr).img + '" data-uuid="' + tskOwnr + '" class="observers memberImg' + tskOwnr + '">');
                if (currentImage.length > 3) {
                    $('#taskOwnerList .count_plus').show();
                    $('#taskOwnerList .count_plus').text('+' + (currentImage.length - 3));
                }
                $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>' + findObjForUser(v).fullname + '</span>');
            });
            if(!$('#taskOwnerList img').hasClass('ownerThisToDo')){
                $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(tskOwnr).img + '" data-uuid="' + tskOwnr + '" class="observers memberImg' + tskOwnr + ' ownerThisToDo">');
            }
            if (coowner.length > 0) {
                $('#taskOwnerList').attr('placeholder', '');
            } else {
                $('#taskOwnerList').attr('placeholder', 'Add Coowner');
            }
        });
    }

    if ($(eve).hasClass('active')) {
        if ($("#batchProcessing").is(':visible')) {
            const activity = new Activity();
            activity.activityId = forBatchPropertis;
            activity.activityUpdateData = id;
            activity.isBatchActive = isBatchActive;
            activity.activityType = 'owner';
            activity.activityUpdateType = 'batchParticipantsDlt';

            activity.activityBatchUpdate((response) => {
                isBatchActive = 1;
                $(eve).removeClass('active');
            });

            $("#batchAcoowner").find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();
            let totalImg = $("#batchAcoowner").find('.person-bullet-component.inline-image').find('img');

            $.each(totalImg, function(k, v) {
                if (k > 2) {
                    $(v).hide();
                } else {
                    $(v).show();
                }
            })
            if (totalImg.length > 3) {
                $("#batchAcoowner").find('.person-bullet-component.inline-image').find('.more_observer').show();
                $("#batchAcoowner").find('.person-bullet-component.inline-image').find('.more_observer').text('+ ' + ((totalImg.length) - 3) + '');

            } else {
                if (totalImg.length == 0) {
                    if ($("#batchAcoowner").find('.person-bullet-image demo_img.demo_img').length == 0) {
                        $("#batchAcoowner")
                            .find('.person-bullet-component.inline-image')
                            .find('.more_observer')
                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                    }
                }

                $("#batchAcoowner").find('.person-bullet-component.inline-image').find('.more_observer').hide();
            }

        } else {
            $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();
            let totalImg = $("#coowner" + activityid).find('.person-bullet-component.inline-image').find('img');

            $.each(totalImg, function(k, v) {
                if (k > 2) {
                    $(v).hide();
                } else {
                    $(v).show();
                }
            })
            if (totalImg.length > 3) {
                $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').show();
                $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').text('+ ' + ((totalImg.length) - 3) + '');

            } else {
                if (totalImg.length == 0) {
                    if ($(".coowner" + activityid).find('.person-bullet-image demo_img.demo_img').length == 0) {
                        $(".coowner" + activityid)
                            .find('.person-bullet-component.inline-image')
                            .find('.more_observer')
                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                    }
                }

                $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').hide();
            }
            $(eve).removeClass('active');
            deleteSubParticipants(addAsCoOwnerArr, user_id, id, activityid, 'owner');
            var tempArr = [];
            var assigneeCount = 0;
            if (addAsCoOwnerArr.length > 0) {
                for (var i = 0; i < addAsCoOwnerArr.length; i++) {
                    if (addAsCoOwnerArr[i].userid == id && addAsCoOwnerArr[i].activityid == activityid) {

                    } else {
                        tempArr.push(addAsCoOwnerArr[i]);
                    }
                }
            }

            addAsCoOwnerArr = tempArr;

            if (tempArr.length > 0) {
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].userid == id) {
                        assigneeCount++;
                    }

                }
            }

            if (assigneeCount == 0) {

                var response = [];
                var tempTaskParticipants = [];

                $.each(taskParticipants, (key, value) => {
                    if (value.id == id && value.type == 'owner') {
                        response.push(value.tbl_id);
                    } else {
                        tempTaskParticipants.push(value);
                    }
                });

                taskParticipants = tempTaskParticipants;

                const activity = new Activity();
                activity.participantedTblID = response;
                activity.activityId = $('#updateAction').val();
                activity.targetID = id;
                activity.participantType = 'owner';

                if (response.length > 0) {
                    activity.assigneeParticipantsDelete((result) => {
                        if (result.status) {
                            removeA(assignee, id);
                            assigneeOnDlt();

                        } else {

                        }
                    });
                }

            }
        }
    } else {

        if ($("#batchProcessing").is(':visible')) {
            const activity = new Activity();
            activity.activityId = forBatchPropertis;
            activity.activityUpdateData = id;
            activity.isBatchActive = isBatchActive;
            activity.activityType = 'owner';
            activity.activityUpdateType = 'batchParticipants';

            activity.activityBatchUpdate((response) => {
                isBatchActive = 1;
                $(eve).addClass('active');
            });

            var target = $("#batchAcoowner").find('.person-bullet-image');
            $("#batchAcoowner").find('.person-bullet-image.demo_img').remove();

            if (target.length > 2) {
                var info = findObjForUser(id);
                $("#batchAcoowner").find('.person-bullet-component .more_observer').show();
                $("#batchAcoowner").find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '" style="display:none;">');
                var dd = $("#batchAcoowner").find('.person-bullet-component .more_observer').text().split(' ');
                if (dd[0] != '') {
                    $("#batchAcoowner").find('.person-bullet-component .more_observer').text("+ " + (parseInt(dd[1]) + 1));
                } else {
                    $("#batchAcoowner").find('.person-bullet-component .more_observer').text("+ " + (target.length - 2));
                }
            } else {
                var info = findObjForUser(id);
                $("#batchAcoowner").find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                $("#batchAcoowner").find('.person-bullet-component .more_observer').hide();
            }

        } else {

            var dbParticipants = [];

            var checkAvailablity = checkAlreadyInArr(id, activityid, addAsCoOwnerArr);
            if (!checkAvailablity) {

                dbParticipants.push({
                    id: id,
                    type: 'owner'
                });
                const activity = new Activity();
                activity.participantsArry = dbParticipants;
                activity.activityid = activityid;
                activity.activityType = 'SubTask';

                activity.addParticipants((response) => {

                    var tmpTblid = [];
                    var tempArr = [];
                    var assigneeCount = 0;

                    if (addAsAssigneeArr.length > 0) {
                        $.each(addAsAssigneeArr, (k, v) => {
                            if (v.userid == id && v.activityid == activityid) {
                                if (tmpTblid.indexOf(v.tbl_id) == -1) {
                                    tmpTblid.push(v.tbl_id);
                                }
                            } else {
                                tempArr.push(v);
                            }
                        });
                    }

                    addAsAssigneeArr = tempArr;

                    if (tempArr.length > 0) {
                        for (var i = 0; i < tempArr.length; i++) {
                            if (tempArr[i].userid == id) {
                                assigneeCount++;
                            }
                        }
                    }

                    if (tmpTblid.length > 0) {
                        const activity = new Activity();
                        activity.participantedTblID = tmpTblid;
                        activity._partiDlt((callback) => {
                            var target = $(".assignee" + activityid).find('.person-bullet-image');
                            target.remove();

                            $(".assignee" + activityid).find('.person-bullet-component .more_observer').before('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');

                        });
                    }

                    if (assigneeCount == 0) {

                        var response_new = [];
                        var tempTaskParticipants = [];

                        $.each(taskParticipants, (key, value) => {
                            if (value.id == id && value.type == 'assignee') {
                                response_new.push(value.tbl_id);
                            } else {
                                tempTaskParticipants.push(value);
                            }
                        });

                        taskParticipants = tempTaskParticipants;

                        const activity = new Activity();
                        activity.participantedTblID = response_new;
                        activity.activityId = $('#updateAction').val();
                        activity.targetID = id;
                        activity.participantType = 'assignee';

                        if (response_new.length > 0) {
                            activity.assigneeParticipantsDelete((result) => {
                                console.log(result);
                                if (result.status) {
                                    removeA(assignee, id);
                                    assigneeOnDlt();
                                } else {

                                }
                            });
                        }
                    }

                    addAsCoOwnerArr.push({
                        tbl_id: response.tblid[0].toString(),
                        activityid: activityid,
                        userid: id.toString(),
                        type: 'owner',
                    });

                    if(uniqCoowner.indexOf(id.toString()) == -1){
                        uniqCoowner.push(id.toString());
                    }

                    partiArry.push({
                        activity_id: activityid,
                        user_id: id.toString(),
                        tbl_id:  response.tblid[0].toString(),
                        participant_type: 'owner',
                        activity_type: "SubTask",
                        created_at: moment().format('L')
                    });

                    if (response.status) {
                        $(eve).addClass('active');
                        var target = $("#coowner" + activityid).find('.person-bullet-image');
                        $(".coowner" + activityid).find('.person-bullet-image.demo_img').remove();
                        if (target.length > 2) {
                            var info = findObjForUser(id);
                            $(".coowner" + activityid).find('.person-bullet-component .more_observer').show();
                            $(".coowner" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '" style="display:none;">');
                            var dd = $(".coowner" + activityid).find('.person-bullet-component .more_observer').text().split(' ');
                            if (dd[0] != '') {
                                $(".coowner" + activityid).find('.person-bullet-component .more_observer').text("+ " + (parseInt(dd[1]) + 1));
                            } else {
                                $(".coowner" + activityid).find('.person-bullet-component .more_observer').text("+ " + (target.length - 2));
                            }
                        } else {
                            var info = findObjForUser(id);
                            $(".coowner" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                            $(".coowner" + activityid).find('.person-bullet-component .more_observer').hide();
                        }
                    }
                });
            }
        }
    }

}

function addAsObsrvr(id, activityid, activityCreatedBy, img, eve) {

    if (coowner.indexOf(id) == -1 && observer.indexOf(id) == -1) {
        var targetuser = [];
        targetuser.push({
            id: id,
            type: 'observer'
        });
        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.activityCreatedBy = $('#actCre').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = targetuser;
        activity.activityType = 'Task';
        activity.activityUpdateType = 'participants';
        activity.participantType = 'observer';
        activity.participantedTblID = [];

        activity.activityUpdate((response) => {
            for (var i = 0; i < response.activityUpdateResponse.response.tblid.length; i++) {
                participatedObserver.push(response.activityUpdateResponse.response.tblid[i]);
            }

            taskParticipants.push({
                id: id,
                tbl_id: response.activityUpdateResponse.response.tblid[0],
                type: "observer",
            });

            observer.push(id);
            // $('#taskObserverList img').remove();
            // $('#taskObserverList .count_plus').hide();
            $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').html('');
            var currentImage = [];
            $.each(observer, (k, v) => {
                currentImage.push(v);
                if (currentImage.length < 4) {
                    $('#taskObserverList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
                }
                if (currentImage.length > 3) {
                    $('#taskObserverList .count_plus').show();
                    $('#taskObserverList .count_plus').text('+' + (currentImage.length - 3));
                }
                $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>' + findObjForUser(v).fullname + '</span>');
            });
            if (observer.length > 0) {
                // $('#taskObserverList').attr('placeholder', '');
            } else {
                $('#taskObserverList').attr('placeholder', 'Add Observer');
            }
        });
    }

    if ($(eve).hasClass('active')) {
        if ($("#batchProcessing").is(':visible')) {
            const activity = new Activity();
            activity.activityId = forBatchPropertis;
            activity.activityUpdateData = id;
            activity.isBatchActive = isBatchActive_ob;
            activity.activityType = 'observer';
            activity.activityUpdateType = 'batchParticipantsDlt';

            activity.activityBatchUpdate((response) => {
                isBatchActive_ob = 1;
                $(eve).removeClass('active');
            });

            $("#batchOvserver").find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();
            let totalImg = $("#batchOvserver").find('.person-bullet-component.inline-image').find('img');

            $.each(totalImg, function(k, v) {
                if (k > 2) {
                    $(v).hide();
                } else {
                    $(v).show();
                }
            })
            if (totalImg.length > 3) {
                $("#batchOvserver").find('.person-bullet-component.inline-image').find('.more_observer').show();
                $("#batchOvserver").find('.person-bullet-component.inline-image').find('.more_observer').text('+ ' + ((totalImg.length) - 3) + '');

            } else {
                if (totalImg.length == 0) {
                    if ($("#batchOvserver").find('.person-bullet-image demo_img.demo_img').length == 0) {
                        $("#batchOvserver")
                            .find('.person-bullet-component.inline-image')
                            .find('.more_observer')
                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                    }
                }

                $("#batchOvserver").find('.person-bullet-component.inline-image').find('.more_observer').hide();
            }

        } else {
            $(".observer" + activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();
            let totalImg = $("#observer" + activityid).find('.person-bullet-component.inline-image').find('img');

            $.each(totalImg, function(k, v) {
                if (k > 2) {
                    $(v).hide();
                } else {
                    $(v).show();
                }
            })
            if (totalImg.length > 3) {
                $(".observer" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').show();
                $(".observer" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').text('+ ' + ((totalImg.length) - 3) + '');

            } else {
                if (totalImg.length == 0) {
                    if ($(".observer" + activityid).find('.person-bullet-image demo_img.demo_img').length == 0) {
                        $(".observer" + activityid)
                            .find('.person-bullet-component.inline-image')
                            .find('.more_observer')
                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                    }
                }

                $(".observer" + activityid).find('.person-bullet-component.inline-image').find('.more_observer').hide();
            }
            $(eve).removeClass('active');

            deleteSubParticipants(addAsObsrvrArr, user_id, id, activityid, 'observer');
            var tempArr = [];
            var assigneeCount = 0;
            if (addAsObsrvrArr.length > 0) {
                for (var i = 0; i < addAsObsrvrArr.length; i++) {
                    if (addAsObsrvrArr[i].userid == id && addAsObsrvrArr[i].activityid == activityid) {

                    } else {
                        tempArr.push(addAsObsrvrArr[i]);
                    }
                }
            }
            addAsObsrvrArr = tempArr;
            if (tempArr.length > 0) {
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].userid == id) {
                        assigneeCount++;
                    }

                }
            }

            if (assigneeCount == 0) {

                var response = [];
                var tempTaskParticipants = [];
                $.each(taskParticipants, (key, value) => {
                    if (value.id == id && value.type == 'observer') {
                        response.push(value.tbl_id);
                    } else {
                        tempTaskParticipants.push(value);
                    }
                });

                taskParticipants = tempTaskParticipants;

                const activity = new Activity();
                activity.participantedTblID = response;
                activity.activityId = $('#updateAction').val();
                activity.targetID = id;
                activity.participantType = 'observer';

                if (response.length > 0) {
                    activity.assigneeParticipantsDelete((result) => {
                        if (result.status) {
                            removeA(assignee, id);
                            assigneeOnDlt();
                        } else {

                        }
                    });
                }
            }
        }

    } else {

        if ($("#batchProcessing").is(':visible')) {
            const activity = new Activity();
            activity.activityId = forBatchPropertis;
            activity.activityUpdateData = id;
            activity.isBatchActive = isBatchActive_ob;
            activity.activityType = 'observer';
            activity.activityUpdateType = 'batchParticipants';

            activity.activityBatchUpdate((response) => {
                isBatchActive_ob = 1;
                $(eve).addClass('active');
            });

            var target = $("#batchOvserver").find('.person-bullet-image');
            $("#batchOvserver").find('.person-bullet-image.demo_img').remove();
            if (target.length > 2) {
                var info = findObjForUser(id);
                $("#batchOvserver").find('.person-bullet-component .more_observer').show();
                $("#batchOvserver").find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '" style="display:none;">');
                var dd = $("#batchOvserver").find('.person-bullet-component .more_observer').text().split(' ');
                if (dd[0] != '') {
                    $("#batchOvserver").find('.person-bullet-component .more_observer').text("+ " + (parseInt(dd[1]) + 1));
                } else {
                    $("#batchOvserver").find('.person-bullet-component .more_observer').text("+ " + (target.length - 2));
                }
            } else {
                var info = findObjForUser(id);
                $("#batchOvserver").find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                $("#batchOvserver").find('.person-bullet-component .more_observer').hide();
            }

        } else {
            var dbParticipants = [];

            var checkAvailablity = checkAlreadyInArr(id, activityid, addAsObsrvrArr);

            if (!checkAvailablity) {

                dbParticipants.push({
                    id: id,
                    type: 'observer'
                });

                const activity = new Activity();
                activity.participantsArry = dbParticipants;
                activity.activityid = activityid;
                activity.activityType = 'SubTask';

                activity.addParticipants((response) => {
                    if (response.status) {

                        var tmpTblid = [];
                        var tempArr = [];
                        var assigneeCount = 0;

                        if (addAsAssigneeArr.length > 0) {
                            $.each(addAsAssigneeArr, (k, v) => {
                                if (v.userid == id && v.activityid == activityid) {
                                    if (tmpTblid.indexOf(v.tbl_id) == -1) {
                                        tmpTblid.push(v.tbl_id);
                                    }
                                } else {
                                    tempArr.push(v);
                                }
                            });
                        }

                        if (tmpTblid.length > 0) {
                            const activity = new Activity();
                            activity.participantedTblID = tmpTblid;
                            activity._partiDlt((callback) => {
                                var target = $(".assignee" + activityid).find('.person-bullet-image');
                                target.remove();
                                $(".assignee" + activityid).find('.person-bullet-component .more_observer').before('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                            });
                        }

                        addAsAssigneeArr = tempArr;

                        if (tempArr.length > 0) {
                            for (var i = 0; i < tempArr.length; i++) {
                                if (tempArr[i].userid == id) {
                                    assigneeCount++;
                                }
                            }
                        }


                        if (assigneeCount == 0) {

                            var response_new = [];
                            var tempTaskParticipants = [];

                            $.each(taskParticipants, (key, value) => {
                                if (value.id == id && value.type == 'assignee') {
                                    response_new.push(value.tbl_id);
                                } else {
                                    tempTaskParticipants.push(value);
                                }
                            });

                            taskParticipants = tempTaskParticipants;

                            const activity = new Activity();
                            activity.participantedTblID = response_new;
                            activity.activityId = $('#updateAction').val();
                            activity.targetID = id;
                            activity.participantType = 'assignee';

                            if (response_new.length > 0) {
                                activity.assigneeParticipantsDelete((result) => {
                                    if (result.status) {
                                        removeA(assignee, id);
                                        assigneeOnDlt();
                                    } else {

                                    }
                                });
                            }
                        }

                        addAsObsrvrArr.push({
                            activityid: activityid,
                            userid: id,
                            tbl_id: response.tblid[0]
                        });

                        if(uniqueObserver.indexOf(id.toString()) == -1){
                            uniqueObserver.push(id.toString());
                        } 

                        partiArry.push({
                            activity_id:activityid.toString(),
                            user_id:id.toString(),
                            tbl_id:    response.tblid[0].toString(),
                            participant_type: 'observer',
                            activity_type: "SubTask",
                            created_at: moment().format('L')
                        });

                        $(eve).addClass('active');
                        var target = $("#observer" + activityid).find('.person-bullet-image');
                        $(".observer" + activityid).find('.person-bullet-image.demo_img').remove();
                        if (target.length > 2) {
                            var info = findObjForUser(id);
                            $(".observer" + activityid).find('.person-bullet-component .more_observer').show();
                            $(".observer" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '" style="display:none;">');
                            var dd = $(".observer" + activityid).find('.person-bullet-component .more_observer').text().split(' ');
                            if (dd[0] != '') {
                                $(".observer" + activityid).find('.person-bullet-component .more_observer').text("+ " + (parseInt(dd[1]) + 1));
                            } else {
                                $(".observer" + activityid).find('.person-bullet-component .more_observer').text("+ " + (target.length - 2));
                            }
                        } else {
                            var info = findObjForUser(id);
                            $(".observer" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                            $(".observer" + activityid).find('.person-bullet-component .more_observer').hide();
                        }
                    }
                });
            }
        }


    }
}

function deleteSubParticipants(arry, deletedBy, targetUser, activityId, type) {
    var response = [];
    $.each(arry, (key, value) => {
        if (value.userid == targetUser && value.activityid == activityId) {
            response.push(value.tbl_id);
        }
    });

    const activity = new Activity();
    activity.participantedTblID = response;
    activity.activityId = activityId;
    activity.targetID = targetUser;
    activity.participantType = type;

    if (response.length > 0) {
        activity.assigneeParticipantsDelete((result) => {
            if (result.status) {
                return true;
            } else {
                return false;
            }
        });
    }
}

function checkAlreadyInArr(id, activityid, arr) {
    var hasAlready = false;
    $.each(arr, function(k, v) {
        if (v.activityid == activityid && v.userid == id) {
            hasAlready = true;
        }
    });

    return hasAlready;
}

async function addAsAssignee(id, activityid, activityCreatedBy, img, eve) {
    if (!$(eve).hasClass('active')) {
        if (assignee.indexOf(id) == -1) {
            var targetuser = [];
            targetuser.push({
                id: id,
                type: 'assignee'
            });

            const activity = new Activity();
            activity.activityId = $('#updateAction').val();
            activity.activityCreatedBy = $('#actCre').val();
            activity.clusteringKey = $('#actCre').val();
            activity.activityUpdateData = targetuser;
            activity.activityType = 'Task';
            activity.activityUpdateType = 'participants';
            activity.participantType = 'assignee';
            activity.participantedTblID = [];

            activity.activityUpdate((response) => {
                for (var i = 0; i < response.activityUpdateResponse.response.tblid.length; i++) {
                    participatedAssignee.push(response.activityUpdateResponse.response.tblid[i]);
                }

                taskParticipants.push({
                    id: id,
                    tbl_id: response.activityUpdateResponse.response.tblid[0],
                    type: "assignee",
                });

                if (participatedAssignee.length > 1) {
                    $("#taskAssigneeList").css('pointer-events', 'none');
                } else {
                    $("#taskAssigneeList").css('pointer-events', 'auto');
                }

                // assignee = [];
                assignee.push(id);

                // $('#taskAssigneeList img').remove();
                // $('#taskAssigneeList .count_plus').hide();
                $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').html('');
                var currentImage = [];
                $.each(assignee, (k, v) => {
                    currentImage.push(v);
                    if (currentImage.length < 4) {
                        $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="assignees memberImg' + v + '">');
                    }
                    if (currentImage.length > 3) {
                        $('#taskAssigneeList .count_plus').show();
                        $('#taskAssigneeList .count_plus').text('+' + (currentImage.length - 3));
                    }
                    $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>' + findObjForUser(v).fullname + '</span>');
                });

                if (assignee.length > 0) {
                    // $('#taskAssigneeList').attr('placeholder', '');
                } else {
                    $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
                }

                $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>' + findObjForUser(assignee[0]).fullname + '</span>');

            });
        }
    }


    if ($(eve).hasClass('active')) {

        $(".assignee" + activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();

        if ($(".assignee" + activityid).find('.person-bullet-image demo_img.demo_img').length == 0) {
            $(".assignee" + activityid)
                .find('.person-bullet-component.inline-image')
                .find('.more_observer')
                .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
        }

        $(eve).removeClass('active');

        deleteSubParticipants(addAsAssigneeArr, user_id, id, activityid, 'assignee');
        var tempArr = [];
        var assigneeCount = 0;

        if (addAsAssigneeArr.length > 0) {
            for (var i = 0; i < addAsAssigneeArr.length; i++) {
                if (addAsAssigneeArr[i].userid == id && addAsAssigneeArr[i].activityid == activityid) {

                } else {
                    tempArr.push(addAsAssigneeArr[i]);
                }

            }
        }

        addAsAssigneeArr = tempArr;

        if (tempArr.length > 0) {
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].userid == id) {
                    assigneeCount++;
                }
            }
        }


        if (assigneeCount == 0) {

            var response = [];
            var tempTaskParticipants = [];
            $.each(taskParticipants, (key, value) => {
                if (value.id == id && value.type == 'assignee') {
                    response.push(value.tbl_id);
                } else {
                    tempTaskParticipants.push(value);
                }
            });

            taskParticipants = tempTaskParticipants;

            const activity = new Activity();
            activity.participantedTblID = response;
            activity.activityId = $('#updateAction').val();
            activity.targetID = id;
            activity.participantType = 'assignee';

            if (response.length > 0) {
                activity.assigneeParticipantsDelete((result) => {
                    if (result.status) {
                        removeA(assignee, id);
                        assigneeOnDlt();
                    } else {

                    }
                });
            }
        }


    } else {

        if ($("#batchProcessing").is(':visible')) {
            const activity = new Activity();
            activity.activityId = forBatchPropertis;
            activity.activityUpdateData = id;
            activity.isBatchActive = 0;
            activity.activityType = 'assignee';
            activity.activityUpdateType = 'batchParticipants';

            activity.activityBatchUpdate((response) => {
                $(eve).siblings('.usersList').removeClass('active');
                $(eve).addClass('active');
            });

            var target = $("#batchAssignee").find('.person-bullet-image');
            target.remove();
            if (target.length > 2) {

            } else {
                var info = findObjForUser(id);
                $("#batchAssignee").find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                $("#batchAssignee").find('.person-bullet-component .more_observer').hide();
            }

        } else {

            var hasActiveClass = 0;
            var activeUser;

            $(eve).closest('.users_container').find('.usersList').each((k, v) => {
                if ($(v).hasClass('active')) {
                    $(v).removeClass('active');
                    activeUser = $(v).attr('data-uid');
                    hasActiveClass++;
                }
            });


            if (hasActiveClass > 0) {
                var ww = await deleteAssigneeOnFly(activeUser, activityid).catch((err) => {
                    console.log(err)
                });
            }

            var dbParticipants = [];
            var participatedSubAssignee = [];

            var checkAvailablity = checkAlreadyInArr(id, activityid, addAsAssigneeArr);

            if (!checkAvailablity) {

                $.each(addAsAssigneeArr, function(k, v) {
                    if (v.activityid == activityid) {
                        participatedSubAssignee.push(v.tbl_id);
                    }
                });

                var addAsCoOwnerArrTmp = [];
                var assigneeCount = 0;

                if (addAsCoOwnerArr.length > 0) {
                    $.each(addAsCoOwnerArr, (k, v) => {
                        if (v.userid == id && v.activityid == activityid) {
                            if (participatedSubAssignee.indexOf(v.tbl_id) == -1) {
                                participatedSubAssignee.push(v.tbl_id);
                            }
                        } else {
                            addAsCoOwnerArrTmp.push(v);
                        }
                    });
                }

                addAsCoOwnerArr = addAsCoOwnerArrTmp;

                if (addAsCoOwnerArrTmp.length > 0) {
                    for (var i = 0; i < addAsCoOwnerArrTmp.length; i++) {
                        if (addAsCoOwnerArrTmp[i].userid == id) {
                            assigneeCount++;
                        }
                    }
                }


                if (assigneeCount == 0) {

                    var response = [];
                    var tempTaskParticipants = [];
                    $.each(taskParticipants, (key, value) => {
                        if (value.id == id && value.type == 'owner') {
                            response.push(value.tbl_id);
                        } else {
                            tempTaskParticipants.push(value);
                        }
                    });

                    taskParticipants = tempTaskParticipants;

                    const activity = new Activity();
                    activity.participantedTblID = response;
                    activity.activityId = $('#updateAction').val();
                    activity.targetID = id;
                    activity.participantType = 'owner';

                    if (response.length > 0) {
                        activity.assigneeParticipantsDelete((result) => {
                            if (result.status) {
                                removeA(coowner, id);
                                coownerOnDlt();
                            } else {

                            }
                        });
                    }
                }

                var addAsObsrvrArrTmp = [];
                var assigneeCount123 = 0;
                if (addAsObsrvrArr.length > 0) {
                    $.each(addAsObsrvrArr, (k, v) => {
                        if (v.userid == id && v.activityid == activityid) {
                            if (participatedSubAssignee.indexOf(v.tbl_id) == -1) {
                                participatedSubAssignee.push(v.tbl_id);
                            }
                        } else {
                            addAsObsrvrArrTmp.push(v);
                        }
                    });
                }

                addAsObsrvrArr = addAsObsrvrArrTmp;

                if (addAsObsrvrArrTmp.length > 0) {
                    for (var i = 0; i < addAsObsrvrArrTmp.length; i++) {
                        if (addAsObsrvrArrTmp[i].userid == id) {
                            assigneeCount123++;
                        }
                    }
                }


                if (assigneeCount123 == 0) {

                    var response = [];
                    var tempTaskParticipants = [];
                    $.each(taskParticipants, (key, value) => {
                        if (value.id == id && value.type == 'observer') {
                            response.push(value.tbl_id);
                        } else {
                            tempTaskParticipants.push(value);
                        }
                    });

                    taskParticipants = tempTaskParticipants;

                    const activity = new Activity();
                    activity.participantedTblID = response;
                    activity.activityId = $('#updateAction').val();
                    activity.targetID = id;
                    activity.participantType = 'observer';

                    if (response.length > 0) {
                        activity.assigneeParticipantsDelete((result) => {
                            if (result.status) {
                                removeA(observer, id);
                                observerOnDlt();
                            } else {

                            }
                        });
                    }
                }

                dbParticipants.push({
                    id: id,
                    type: 'assignee'
                });

                const activity = new Activity();
                activity.participantsArry = dbParticipants;
                activity.activityid = activityid;
                activity.activityType = 'SubTask';
                activity.participantedTblID = participatedSubAssignee;
                activity.participantType = 'assignee';
                activity.activityTitle = $('#pulse_' + activityid + ' .pulse_title').text();
                activity.activityCreatedBy = user_id;

                if (participatedSubAssignee.length > 0) {
                    activity.assigneeParticipantsDelete((result) => {

                        if (result.status) {
                            activity.addParticipants((response) => {
                                if (response.status) {
                                    $(eve).addClass('active');
                                    closeMiniPopUp('assignee_users');
                                    if (sharedMemberList.indexOf(id) == -1) {
                                        sharedMemberList.push(id);
                                    }
                                    addAsAssigneeArr = [];
                                    addAsAssigneeArr.push({
                                        tbl_id: response.tblid[0],
                                        activityid: activityid,
                                        userid: id,
                                    });

                                    if(uniqueAssine.indexOf(id.toString()) == -1){
                                        uniqueAssine.push(id.toString());
                                    }

                                    partiArry.push({
                                        activity_id:  activityid,
                                        user_id: id,
                                        tbl_id:  response.tblid[0],
                                        participant_type: 'assignee',
                                        activity_type: "SubTask",
                                        created_at: moment().format('L')
                                    });

                                    var target = $(".assignee" + activityid).find('.person-bullet-image');
                                    target.remove();
                                    if (target.length > 2) {

                                    } else {
                                        var info = findObjForUser(id);
                                        $(".assignee" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                                        $(".assignee" + activityid).find('.person-bullet-component .more_observer').hide();
                                    }

                                    $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();
                                    var coLen = $(".coowner" + activityid).find('.person-bullet-component.inline-image').find('.person-bullet-image').length;
                                    if (coLen == 0) {
                                        $(".coowner" + activityid)
                                            .find('.person-bullet-component.inline-image')
                                            .find('.more_observer')
                                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                                    }

                                    var obLen = $(".observer" + activityid).find('.person-bullet-component.inline-image').find('.person-bullet-image').length;

                                    $(".observer" + activityid).find('.person-bullet-component.inline-image').find('img[data-uuid="' + id + '"]').remove();

                                    if (coLen == 0) {
                                        $(".observer" + activityid)
                                            .find('.person-bullet-component.inline-image')
                                            .find('.more_observer')
                                            .after('<img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img"> <img src="'+ file_server +'profile-pic/Photos/default_profile_empty.png" title="demo" class="person-bullet-image demo_img">');
                                    }

                                }
                            });

                        }
                    });
                } else {
                    activity.addParticipants((response) => {
                        if (response.status) {
                            $(eve).addClass('active');
                            closeMiniPopUp('assignee_users');

                            if (sharedMemberList.indexOf(id) == -1) {
                                sharedMemberList.push(id);
                            }

                            addAsAssigneeArr.push({
                                tbl_id: response.tblid[0],
                                activityid: activityid,
                                userid: id,
                            });

                            if(uniqueAssine.indexOf(id.toString()) == -1){
                                uniqueAssine.push(id.toString());
                            }

                            partiArry.push({
                                activity_id:  activityid,
                                user_id: id,
                                tbl_id:   response.tblid[0],
                                participant_type: 'assignee',
                                activity_type: "SubTask",
                                created_at: moment().format('L')
                            });
                            

                            var target = $(".assignee" + activityid).find('.person-bullet-image');
                            target.remove();
                            if (target.length > 2) {
                                // 
                            } else {
                                var info = findObjForUser(id);
                                $(".assignee" + activityid).find('.person-bullet-component .more_observer').before('<img onclick="viewShareList(event)" src="'+ file_server +'profile-pic/Photos/' + info.img + '" data-uuid="' + info.id + '" class="person-bullet-image"  title="' + info.fullname + '" alt="' + info.fullname + '">');
                                $(".assignee" + activityid).find('.person-bullet-component .more_observer').hide();
                            }
                        }
                    });
                }


            }
        }
    }


}

function deleteAssigneeOnFly(id, activityid) {
    return new Promise((resolve, reject) => {
        deleteSubParticipants(addAsAssigneeArr, user_id, id, activityid, 'assignee');
        var tempArr = [];
        var assigneeCount = 0;

        if (addAsAssigneeArr.length > 0) {
            for (var i = 0; i < addAsAssigneeArr.length; i++) {
                if (addAsAssigneeArr[i].userid == id && addAsAssigneeArr[i].activityid == activityid) {

                } else {
                    tempArr.push(addAsAssigneeArr[i]);
                }

            }
        }

        addAsAssigneeArr = tempArr;

        if (tempArr.length > 0) {
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].userid == id) {
                    assigneeCount++;
                }
            }
        }

        if (assigneeCount == 0) {

            var response = [];
            var tempTaskParticipants = [];
            $.each(taskParticipants, (key, value) => {
                if (value.id == id && value.type == 'assignee') {
                    response.push(value.tbl_id);
                } else {
                    tempTaskParticipants.push(value);
                }
            });
            taskParticipants = tempTaskParticipants;
            const activity = new Activity();
            activity.participantedTblID = response;
            activity.activityId = $('#updateAction').val();
            activity.targetID = id;
            activity.participantType = 'assignee';
            if (response.length > 0) {
                activity.assigneeParticipantsDelete((result) => {
                    if (result.status) {
                        removeA(assignee, id);
                        assigneeOnDlt();
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            }
        } else {
            resolve(true);
        }
    });
}

function editPulseName(e) {
    // lowZindex('low');
    onscrollevent = 0;
    insScrollTop = $('.workspaceform').scrollTop();
    $(e).addClass('active');
    var pulseTid = $(e).prev('.ds-editable-component').find('.pulse_title').attr('id');
    var activityid = $(e).prev('.ds-editable-component').find('.pulse_title').attr('data-id');
    var createdby = $(e).prev('.ds-editable-component').find('.pulse_title').attr('data-createdby');

    var position = $('#' + pulseTid).offset();
    var top = position.top;
    $("#subTaskTitleEdit").show();
    $('#subTaskTitleEdit').css('top', top - 8);
    $('#subTaskTitleEdit').css('width', $('#' + pulseTid).parents('.cell-component.name-cell.NameCell').innerWidth() - 120);
    $("#subTaskTitleEdit").attr('contenteditable', 'true');
    $("#subTaskTitleEdit").text($(e).closest('.name-cell').find('.pulse_title').attr('data-title'));
    placeCaretAtEnd(document.getElementById('subTaskTitleEdit'));
    $("#subTaskTitleEdit").attr('data-targetid', pulseTid);
    $("#subTaskTitleEdit").attr('data-id', activityid);
    $("#subTaskTitleEdit").attr('data-createdby', createdby);
}

function pulseTitleOnBlur(elm) {

    elm.preventDefault();
    $(elm.target).closest('.name-cell-component').css('width', '318px');
    $(elm.target).parents('.ds-editable-component').css('width', 'auto');
    var tmpStr = $(elm.target).text();
    $(elm.target).scrollLeft(0);
    $(elm.target).css({
        'background': 'transparent',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'color': '#596496',
        'width': '318px'
    });

    $(elm.target).text('');
    $(elm.target).text(tmpStr);
    $(elm.target).attr('data-title', tmpStr);
    $(elm.target).closest('.name-text').find('.pulse_title').removeAttr('contenteditable');

    if ($('#addnewSub').is(':visible')) {
        $('#addnewSub .name-text').focus();
    } else {
        SubtaskClone.id = $('.pulse-component').length;
        SubtaskClone.flexSize = $('.cell-component:visible').length * 120;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());
    }

    tooltipforToDo();
    onDynamicFire();
}

function saveSubTask(elm) {
    $(elm.target).css('border', 'none');
    var code = elm.charCode || elm.keyCode || elm.which;
    if (code == 13 || code == 27) {
        elm.preventDefault();
        saveSubTask_ob(elm, elm.target);
    }
}

function saveSubTask_ob(e, elm) {
    // lowZindex('high');
    onscrollevent = 1;
    insScrollTop = $('.workspaceform').scrollTop();
    var activityid = $(elm).attr('data-id');
    var createdby = $(elm).attr('data-createdby');

    var target = $(elm).attr('data-targetid');
    var tmpStr = $(elm).text();

    if (!validate.isEmpty(target)) {
        $("#" + target).scrollLeft(0);

        $("#" + target)
            .text(tmpStr)
            .attr('data-title', tmpStr)
            .removeAttr('contenteditable');

        if ($('#addnewSub').is(':visible')) {
            // $('#addnewSub .name-text').focus();
        } else {
            SubtaskClone.id = $('.pulse-component').length;
            SubtaskClone.flexSize = $('.cell-component:visible').length * 120;
            $("#thisWeekPluseContainer").append(SubtaskClone.varience());
            $("#thisWeekPluseContainer").append(SubtaskClone.draw());
        }

        const activity = new Activity();
        activity.activityId = activityid;
        activity.clusteringKey = createdby;
        activity.activityUpdateData = tmpStr;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'title';

        activity.activityUpdate((response) => {
            console.log(response);
        });

        $("#subTaskTitleEdit").attr('data-targetid', '');
        $("#subTaskTitleEdit").hide();

        tooltipforToDo();
        onDynamicFire();
        $('.edit-indicator').removeClass('active');
    } else {
        $(elm).css('border', '1px solid red');
    }

}

function newSubtask() {
    var htm = $("#OnlyForClone").clone();
    var pulse = $('.pulse-component').length;
    var id = $('.pulse_title').length + 1;
    var od = 'newSubtask' + $('.innerDropMeny').length;

    $(htm).attr('id', 'pulse' + pulse).addClass('_eachsubtask');
    $(htm).attr('id', 'pulse' + pulse);
    $(htm).find('.name-cell-component .pulse_title').text('');
    $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
    $(htm).find('.numeric-cell-component .amountInputValue').text('0');
    $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/' + user_img);
    $(htm).find('.owner_img').attr('title', user_fullname);
    $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle' + id);
    $(htm).find('.name-cell-component .pulse_title').attr('data-title', '');

    $("#thisWeekPluseContainer").append(htm);

    $(htm).find('.name-cell-component .edit-indicator').trigger('click');
    keypressBlur();
    $('.pulse-component').mouseleave(function(e) {
        if ($(e.target).find('.NameCell .edit-indicator').is(':visible')) {
            $(e.target).find('.NameCell .edit-indicator').hide();
        }
    });

    $('.pulse_title').mouseenter(function(e) {
        if ($(e.target).attr('contenteditable')) {
            $(e.target).closest('.name-text').find('.edit-indicator').hide();
        }
    });

    $('.pulse_title').mouseleave(function(e) {
        if ($(e.target).attr('contenteditable')) {
            $(e.target).closest('.name-text').find('.edit-indicator').removeAttr('style');
        }
    });

    $('.edit-indicator').mouseenter(function(e) {
        if ($(e.target).closest('.pulse_title').attr('contenteditable')) {
            $(e.target).hide();
        } else {
            $(e.target).show();
        }
    });
}

function choosePriority(e) {
    var priorityPopUp = $(e.target).next('.priority-picker-wrapper');
    $('.priorityChangeColor').hide();

    if (priorityPopUp.is(':visible')) {
        priorityPopUp.hide();
    } else {
        if ($(e.target).hasClass('priority-label-container')) {
            if ($('.pulse-component').length < 10) {
                scrollToBottom('.workspaceform');
            }
            $('.priority-picker-wrapper').hide();
            priorityPopUp.show();

            // if ($('.priority-picker-footer').hasClass('editEnabled')) {
            //   $('.priority_container').find('.single_priority')
            //     .attr('onclick', 'pickPriority(this)').find('.priorityLabel')
            //     .css('pointer-events', 'none').removeAttr('contenteditable');
            //   $('.priority-color-wrapper').hide();
            //   $('.prioritySamColor').hide();
            //   $('.priorityChangeColor').hide();
            //   $('.create_priority').hide();
            //   $('.single_priority').css({
            //     'border-radius': '1px'
            //   });
            //   $('.priorityLabel').css({
            //     'width': '100%',
            //     'background': 'transparent',
            //     'color': '#fff'
            //   });
            //   $('.priority-picker-footer')
            //     .addClass('editDisabled').removeClass('editEnabled')
            //     .html('<i class="icon icon-v2-edit"></i> <span>Add/Edit Labels</span>');
            // }
        }
        priorityColorSample();
    }


    $('.flex_heading').css('z-index', '0');
    $('.priorityCell').css('z-index', '0');

    $(e.target).closest('.flex_heading').css('z-index', '1');
    $(e.target).closest('.cell-component').css('z-index', '103');


    if ($('.pulse-component').length < 10) {
        scrollToBottom('.workspaceform');
    }
}

function pickPriority(e) {
    var value = $(e).find('.priorityLabel').text();
    var css = $(e).attr('style');
    var color = css.split(':');
    var colcss = 'color:' + color[1];
    $(e).parents('.priority-picker-wrapper').prev('.priority-label-container').find('.view_priority').text(value);
    $(e).parents('.priority-picker-wrapper').prev('.priority-label-container').attr('data-color', $(e).attr('data-color'));
    $(e).parents('.priority-label').attr('style', css);
    $(e).parents('.priority-label').prev('.priority-note-wrapper').find('.fa-ellipsis-h').attr('style', colcss);
    $(e).parents('.priority-picker-wrapper').hide(100);

    if(unipriority.indexOf(value) == -1){
        unipriority.push(value);
    }

    if (!$(".taskLoaderFull").is(':visible')) {
        if (!socketFire) {
            if ($("#batchProcessing").is(':visible')) {
                const activity = new Activity();
                activity.activityId = forBatchPropertis;
                activity.activityUpdateData = value;
                activity.activityType = 'SubTask';
                activity.activityUpdateType = 'batchPriority';

                activity.activityBatchUpdate((response) => {
                    console.log(response);
                });
            } else {
                var activityId = $(e).attr('data-id');
                var clusteringKey = $(e).attr('data-createdby');

                const activity = new Activity();
                activity.activityId = activityId;
                activity.clusteringKey = clusteringKey;
                activity.activityUpdateData = value;
                activity.activityType = 'SubTask';
                activity.activityUpdateType = 'priority';

                activity.activityUpdate((response) => {
                    //   console.log(response);
                });
            }
        }
    }
}

function hasColor(arr, color){
    var totalPrio = arr.length;
    var result = false;
    if (totalPrio > 0) {
        $.each(arr, (k, v) => {
            if (color.toString().trim() + ';' === v.color.toString().trim()) {
                result = true;
            }
        });
    }

    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function createPriority(e) {

    var colorHolder = $(colorpanels);

    var availableClr = [];
    var usedClr = [];

    $.each(colorHolder, (k, v) => {
        if (hasColor(customPriority, $(v).attr('data-color'))) {
            usedClr.push($(v).attr('data-color').toString().trim());
        } else {
            availableClr.push($(v).attr('data-color').toString().trim());
        }
    });

    var color = availableClr[getRandomInt(availableClr.length)] + ';';
    var phasename = 'Phase ' + ($(e.target).parents('.priority_container').find('.single_priority').length + 1);

    var activtyid = $(e.target).closest('.pulse-component').attr('data-id');
    if (color == 'undefined;') {


    } else {

        const activity = new Activity();

        activity.activityId = $('#updateAction').val();
        activity.activityCreatedBy = user_id;
        activity.activityUpdateData = {
            'name': phasename,
            'color': color
        };
        activity.activityUpdateType = 'Priority';


        activity.customStatusSave((response) => {
            var html = '<span onclick="pickPriority(this)" data-color="' + color + '" data-id="' + activtyid + '" data-createdby="' + user_id + '"  style="background-color:' + color + '" class="single_priority"> <span class="prioritySamColor"><img src="/images/basicAssets/drop.svg" alt=""></span>';
            html += '<span  onclick="editPrioritylabel(this)" onkeypress="keypressPrioritylabel(event,this)" onblur="blurPrioritylabel(event,this)" id="cusSta_' + response.customStatusSaveResponse.id + '" class="priorityLabel" data-id="' + response.customStatusSaveResponse.id + '" contenteditable="true" placeholder="Add Phase">' + phasename + '</span>';
            html += '<span class="editpriority_label" onclick="editProiority(event,this)"></span>';
            html += '<span data-id="' + response.customStatusSaveResponse.id + '" class="removepriority_label" onclick="removeProiority(event,this)"></span>';
            html += '</span><div class="priorityChangeColor">' + colorpanels + '</div>';

            $('.priority-color-wrapper').find('.status-change-color-icon:last').remove();

            if ($('.priorityChangeColor').is(':visible')) {
                $('.priorityChangeColor').hide();
                // $('.priority-color-wrapper').show();
            }

            $(html).insertBefore('.create_priority');

            customPriority.push({
                id: response.customStatusSaveResponse.id,
                title: phasename,
                color: color.toString().trim()
            });

            $('.priority_container')
                .find('.single_priority:last')
                .css({})
                .find('.priorityLabel').focus();

            keypressBlur();
            pickPrioColor();
            priorityColorSample();

            var targetid = 'cusSta_' + response.customStatusSaveResponse.id;
            placeCaretAtEnd(document.getElementById(targetid));

        });
    }
}

function openColordiv(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var parent = $(elm).parent('.single_status');

    colorHide(customStatus, 'statusChangeColor');

    if (parent.next('.statusChangeColor').is(':visible')) {
        parent.next('.statusChangeColor').hide();
        // $('.status-color-wrapper').show();
    } else {

        $('.statusChangeColor').hide();
        parent.next('.statusChangeColor').show();
        $('.status-color-wrapper').hide();
    }
}

function pickPrioColor() {

    $('.pickPColor').on('click', function(event) {
        var pickcolor = $(this).attr('style').split(':')[1];
        var Cparent = $(this).parent('.priorityChangeColor').prev();
        Cparent.css('background-color', pickcolor);
    });
}

function pickStatusColor() {

    $('.pickSColor').on('click', function(event) {
        var pickcolor = $(this).attr('style').split(':')[1];
        var Cparent = $(this).parent('.statusChangeColor').prev();
        Cparent.css('background-color', pickcolor);
    });
}

function editAddPriority(elm) {
    if ($(elm).hasClass('editDisabled')) {
        $(elm).addClass('editEnabled').removeClass('editDisabled');
        // $(elm).prev('.priority-color-wrapper').show();
        $(elm).siblings('.priority_container')
            .find('.single_priority')
            .removeAttr('onclick')
            .find('.priorityLabel')
            .css('pointer-events', 'auto')
            .attr('contenteditable', 'true');
        $(elm).html('<span>Apply</span>');
        $('.create_priority').show();
        $('.prioritySamColor').show(200);
        $('.priorityLabel').css({
            'width': '91px',
            'background-color': '#f7f7f7',
            'color': '#596496'
        });
        $('.single_priority').css({
            'border-radius': '3px'
        });
    } else if ($(elm).hasClass('editEnabled')) {

        $(elm).addClass('editDisabled').removeClass('editEnabled');
        $(elm).prev('.priority-color-wrapper').hide();
        $(elm).siblings('.priority_container')
            .find('.single_priority')
            .attr('onclick', 'pickPriority(this)')
            .find('.priorityLabel')
            .css('pointer-events', 'none')
            .removeAttr('contenteditable');
        $(elm).html('<i class="icon icon-v2-edit"></i> <span>Add/Edit Labels</span>');
        $('.prioritySamColor').hide(200);
        $('.create_priority').hide();
        $('.single_priority').css({
            'border-radius': '1px'
        });
        $('.priorityLabel').css({
            'width': '100%',
            'background': 'transparent',
            'color': '#fff'
        }).blur();
        $('.priorityChangeColor').hide();
    }

    if ($('.pulse-component').length < 10) {
        scrollToBottom('.workspaceform');
    }
    create_priority_status();
}

function phaseAvailability(title, arr, callback){
    var totalPrio = arr.length;
    var res = false;
    if (totalPrio > 0) {
        for (var i = 0; i < totalPrio; i++) {
            if (arr[i].title === title)
                res = true;
        }

        if (res) {
            callback(true);
        } else {
            callback(false);
        }
    }
}

function keypressPrioritylabel(event, e) {
    var code = event.keyCode || event.which;

    if (code == 13) {
        var targetID = $(e).attr('data-id');
        var data = $(e).text();
        var valu = (!validate.isEmpty(data) ? data : '');

        phaseAvailability(valu, customPriority, (respone) => {
            if (!respone) {
                const activity = new Activity();
                activity.activityUpdateData = valu;
                activity.targetID = targetID;

                if (!validate.isEmpty(data)) {
                    activity.customStatusUpdate((response) => {
                        $('.priorityLabel').css({}).parents('.single_priority').css({});
                        $(e).attr('contenteditable', false);

                        var datacolor = $(e).parent('.single_priority').attr('data-color');
                        var parentColor = $(e).parents('.priority-label.menu-color').find('.priority-label-container').attr('data-color');
                        if (parentColor == datacolor) {
                            $(e).closest('.color-cell').find('.view_priority').text(valu);

                        }
                    });
                }
            }
        });
    }
}

function blurPrioritylabel(event, e) {

    var targetID = $(e).attr('data-id');
    var data = $(e).text();
    var valu = (!validate.isEmpty(data) ? data : '');

    phaseAvailability(valu, customPriority, (respone) => {
        if (!respone) {
            const activity = new Activity();
            activity.activityUpdateData = valu;
            activity.targetID = targetID;

            if (!validate.isEmpty(data)) {
                activity.customStatusUpdate((response) => {
                    $('.priorityLabel').css({}).parents('.single_priority').css({});
                    $(e).attr('contenteditable', false);

                    var datacolor = $(e).parent('.single_priority').attr('data-color');
                    var parentColor = $(e).parents('.priority-label.menu-color').find('.priority-label-container').attr('data-color');
                    if (parentColor == datacolor) {

                        $(e).closest('.color-cell').find('.view_priority').text(valu);

                    }
                });
            }
        }
    });
}

function chooseStatus(e) {

    let StatusPopUp = $(e.target).next('.status-picker-wrapper');
    let x = $(e.target).parents('.status-cell-component').offset();
    let pgHeight = $(window).height();
    let divHeight = StatusPopUp.height();
    let actHeight = pgHeight - x.top;

    if ($(e.target).hasClass('status-label-container')) {
        if (!StatusPopUp.is(':visible')) {
            if (actHeight < divHeight) {
                StatusPopUp.css({
                    'left': x.left - 139 + 'px',
                    'top': x.top - divHeight + 'px'
                }).addClass('fliped');
                $('.st_status_value .status-picker-wrapper').css({
                    'left': x.left - 85 + 'px',
                });
            } else {
                StatusPopUp.css({
                    'left': x.left - 139 + 'px',
                    'top': x.top + 35 + 'px'
                }).removeClass('fliped');
            }
            StatusPopUp.show();
            lowZindex('low');

            $('.flex_heading').css('z-index', '0');
            $('.StatusCell').css('z-index', '0');

            $(e.target).closest('.flex_heading').css('z-index', '1');
            $(e.target).closest('.cell-component').css('z-index', '101');
        } else {
            lowZindex('high');
            StatusPopUp.hide();
        }
    }

    if($("#stak_table").is(':visible')){
        if ($(e.target).hasClass('itsForAll')) {
            $("#cbx").click();
            $("#batchProcessing").hide();
        }
    }

    $('.statusChangeColor').hide();
}

function pickStatus(e) {

    console.log('pick status')

    var thisColor = $(e).attr('data-color');
    var thisStatus = thisColor;

    var value = $(e).find('.statusLabel').text();
    var css = $(e).closest('.single_status').attr('style');
    var color = css.split(':');
    var colcss = 'color:' + color[1];

    var cc = $(e).closest('.single_status').css('background-color');

    $(e).parents('.status-picker-wrapper').prev('.status-label-container').find('.view_status').text(value);
    $(e).parents('.status-picker-wrapper').prev('.status-label-container').attr('data-color', $(e).attr('data-color'));
    $(e).parents('.status-label').attr('style', css);
    $(e).parents('.status-label').prev('.status-note-wrapper').find('.fa-ellipsis-h').attr('style', colcss);
    $(e).parents('.status-picker-wrapper').hide(100);
    lowZindex('high');
    $(e).closest('.pulse-component').find('.pulse-left-indicator').css('background-color', cc);
    $(e).closest('.pulse-component').find('.pulse-left-indicator').attr('data-value', thisStatus);
    $(e).closest('.pulse-component').find('.pulse-left-indicator').css('color', cc);

    if (value != 'Completed') {
        $(e).closest('.pulse-component').find('.pulse-left-indicator .left-indicator-checkbox').removeClass('selected');
        var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
        var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;

        if (totalST !== checkedST) {
            $('#cbx').prop('checked', false);
        } else {
            $('#cbx').prop('checked', true);
        }
        var waitingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
        var workingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;
        progressBar(totalST, checkedST);
        multipleProgressBar(totalST, checkedST, waitingST, workingST);

    } else {
        $(e).closest('.pulse-component').find('.pulse-left-indicator .left-indicator-checkbox').addClass('selected');
        var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
        var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;

        if (totalST !== checkedST) {
            $('#cbx').prop('checked', false);
        } else {
            $('#cbx').prop('checked', true);
        }
        var waitingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
        var workingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;

        progressBar(totalST, checkedST);
        multipleProgressBar(totalST, checkedST, waitingST, workingST);
    }

    if(unistatus.indexOf(value) == -1){
        unistatus.push(value);
    }

    if (!$(".taskLoaderFull").is(':visible')) {
        if (!socketFire) {
            if ($("#batchProcessing").is(':visible')) {
                const activity = new Activity();
                activity.activityId = forBatchPropertis;
                activity.activityUpdateData = value;
                activity.activityType = 'SubTask';
                activity.activityUpdateType = 'batchStatus';

                activity.activityBatchUpdate((response) => {
                    console.log(response);
                    filteringTaskShowing();
                });
            }else if($("#stak_table").is(':visible')){
                if ($(e).parents('.status-picker-wrapper').prev('.status-label-container').hasClass('itsForAll')) {
                    const activity = new Activity();
                    activity.activityId = forBatchPropertis;
                    activity.activityUpdateData = value;
                    activity.activityType = 'SubTask';
                    activity.activityUpdateType = 'batchStatus';

                    activity.activityBatchUpdate((response) => {
                        console.log(response);
                        filteringTaskShowing();
                        var activityid = $('#updateAction').val();
                        $("#activity_" + activityid).click();
                    });
                }else{
                    var activityId = $(e).attr('data-id');
                    var clusteringKey = $(e).attr('data-createdby');
                    const activity = new Activity();
                    activity.activityId = activityId;
                    activity.clusteringKey = clusteringKey;
                    activity.activityUpdateData = value;
                    activity.activityType = 'SubTask';
                    activity.activityUpdateType = 'taskStatus';

                    activity.activityUpdate((response) => {
                        console.log(response);
                        filteringTaskShowing();
                    });
                }
                
            } else {
                var activityId = $(e).attr('data-id');
                var clusteringKey = $(e).attr('data-createdby');

                const activity = new Activity();
                activity.activityId = activityId;
                activity.clusteringKey = clusteringKey;
                activity.activityUpdateData = value;
                activity.activityType = 'SubTask';
                activity.activityUpdateType = 'taskStatus';

                activity.activityUpdate((response) => {
                      console.log(response);
                    filteringTaskShowing();
                });
            }
        }
    }

    
}

function createStatus(e) {
    var colorHolder = $(colorpanels);

    var availableClr = [];
    var usedClr = [];

    $.each(colorHolder, (k, v) => {
        if (hasColor(customStatus, $(v).attr('data-color'))) {
            usedClr.push($(v).attr('data-color').toString().trim());
        } else {
            availableClr.push($(v).attr('data-color').toString().trim());
        }
    });

    var color = availableClr[getRandomInt(availableClr.length)] + ';';

    var statusname = 'Status ' + ($(e.target).parents('.status_container').find('.single_status').length + 1);
    var activtyid = $(e.target).closest('.pulse-component').attr('data-id');
    if (color == 'undefined;') {

    } else {

        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.activityCreatedBy = user_id;
        activity.activityUpdateData = {
            'name': statusname,
            'color': color
        };
        activity.activityUpdateType = 'Status';

        activity.customStatusSave((response) => {
            var html = '<span onclick="pickStatus(this)" data-color="' + color + '" data-id="' + activtyid + '" data-createdby="' + user_id + '"  style="background-color:' + color + '" class="single_status">';
            html += '<span style="display:block" class="statusSamColor" onclick="openColordiv(event,this)"><img src="/images/basicAssets/drop.svg" alt=""></span>';
            html += '<span onclick="editStatuslabel(this)" id="cusSta_' + response.customStatusSaveResponse.id + '" onkeypress="keypressStatuslabel(event,this)" onblur="blurStatuslabel(this)" class="statusLabel" data-id="' + response.customStatusSaveResponse.id + '" contenteditable="true" placeholder="Add Status">' + statusname + '</span>';
            html += '<span class="editpriority_label" onclick="editStatusLabel(event,this)"></span>';
            html += '<span data-id="' + response.customStatusSaveResponse.id + '" class="removepriority_label" onclick="removeStatusLabel(event,this)"></span>';
            html += '</span>';
            html += '<div class="statusChangeColor">' + colorpanels + '</div>';


            $('.status-color-wrapper').find('.status-change-color-icon:last').remove();

            if ($('.statusChangeColor').is(':visible')) {
                $('.statusChangeColor').hide();
            }
            $(html).insertBefore('.create_new_status');

            customStatus.push({
                id: response.customStatusSaveResponse.id,
                title: statusname,
                color: color.toString().trim()
            });
            $.each(customStatus, function(k, v) {
                if ($('#pgColor' + v.id).length == 0) {
                    $('.progressBarContainer').append('<div id="pgColor' + v.id + '" data-value="0%" data-color="' + v.color + '" style="width:0%; background:' + v.color + '"></div>');
                }
            });

            $('.status_container')
                .find('.single_status:last')
                .css({})
                .find('.statusLabel').focus();

            var targetid = 'cusSta_' + response.customStatusSaveResponse.id;
            placeCaretAtEnd(document.getElementById(targetid));

            keypressBlur();
            pickStatusColor();
        });
    }

}

function editAddStatus(e) {

    e.stopImmediatePropagation();
    e.preventDefault();

    if ($(e.target).hasClass('editDisabled')) {

        $(e.target).addClass('editEnabled').removeClass('editDisabled');
        $(e.target).siblings('.status_container')
            .find('.single_status')
            .removeAttr('onclick')
            .find('.statusLabel')
            .css('pointer-events', 'auto')
            .attr('contenteditable', 'true');
        $(e.target).html('<span>Apply</span>');
        $('.create_status').show();
        $('.statusSamColor').show(200);
        $('.statusLabel').css({});
        $('.single_status').css();

    } else if ($(e.target).hasClass('editEnabled')) {

        $(e.target).addClass('editDisabled').removeClass('editEnabled');
        $(e.target).prev('.status-color-wrapper').hide();
        $(e.target).siblings('.status_container')
            .find('.single_status')
            .attr('onclick', 'pickStatus(this)')
            .attr('data-color', '')
            .find('.statusLabel')
            .css('pointer-events', 'none')
            .removeAttr('contenteditable');
        $('.statusSamColor').hide(200);
        $('.create_status').hide();
        $('.single_status').css();
        $('.statusLabel').css().blur();
        $('.statusChangeColor').hide();
    }

    create_priority_status();

    if ($('.pulse-component').length < 10) {
        scrollToBottom('.workspaceform');
    }
}

function keypressBlur(){
    $('.priorityLabel, .pulse_title, .statusLabel').keypress(function(event) {

        var ouWid = $(event.target).closest('.name-cell').outerWidth();

        if (parseInt($(event.target).outerWidth()) > parseInt(ouWid)) {
            $('.name-cell').css('width', $(event.target).outerWidth());
        }

        $('.name-cell').css('width', $(event.target).outerWidth());
        $('.name-column-header').css('width', $(event.target).outerWidth());

        if (event.keyCode == 13) {
            event.preventDefault();
            $(this).blur();
        }
    });
}

function keypressStatuslabel(event, e) {
    var code = event.keyCode || event.which;
    if (code == 13) {
        var targetID = $(e).attr('data-id');
        var data = $(e).text();
        var valu = (!validate.isEmpty(data) ? data : '');

        phaseAvailability(valu, customStatus, (respone) => {
            if (!respone) {
                const activity = new Activity();
                activity.activityUpdateData = valu;
                activity.targetID = targetID;

                if (!validate.isEmpty(data)) {
                    activity.customStatusUpdate((response) => {

                        $('.statusLabel').css({}).parents('.single_status').css({});
                        $(e).attr('contenteditable', false);

                        var datacolor = $(e).parent('.single_status').attr('data-color');
                        var parentColor = $(e).parents('.status-label.menu-color').find('.status-label-container').attr('data-color');
                        if (parentColor == datacolor) {
                            $(e).closest('.color-cell').find('.view_status').text(valu);

                        }

                    });
                }
            }
        });
    }
}

function blurStatuslabel(e) {
    var targetID = $(e).attr('data-id');
    var data = $(e).text();
    var valu = (!validate.isEmpty(data) ? data : '');

    phaseAvailability(valu, customStatus, (respone) => {
        if (!respone) {
            const activity = new Activity();
            activity.activityUpdateData = valu;
            activity.targetID = targetID;

            if (!validate.isEmpty(data)) {
                activity.customStatusUpdate((response) => {
                    $('.statusLabel').css({}).parents('.single_status').css({});
                    $(e).attr('contenteditable', false);
                    var datacolor = $(e).parent('.single_status').attr('data-color');
                    var parentColor = $(e).parents('.status-label.menu-color').find('.status-label-container').attr('data-color');
                    if (parentColor == datacolor) {
                        $(e).closest('.color-cell').find('.view_status').text(valu);

                    }
                });
            }
        }
    });

}

function subtaskdate (){

    $(".dueDateInput,.st_dDate_value").flatpickr({
        // enableTime: true,
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            
            //removeA(uniqDueDate, moment($(instance.input).attr('data-date')).format('YYYY-MM-DD'));
            $(instance.input).attr('data-date', dateStr);
            
            if(uniqDueDate.indexOf(moment(dateStr).format('YYYY-MM-DD')) == -1){
                uniqDueDate.push(moment(dateStr).format('YYYY-MM-DD'));
            }

            if (!$('.taskLoaderFull').is(':visible')) {
                if ($("#batchProcessing").is(':visible')) {
                    var endTime = dateStr.split("-");
                    // 26-03-2019  2019-03-28
                    var newDate = endTime[2] + "-" + endTime[1] + "-" + endTime[0];
                    const activity = new Activity();
                    activity.activityId = forBatchPropertis;
                    activity.activityUpdateData = newDate;
                    activity.activityType = 'SubTask';
                    activity.activityUpdateType = 'batchDueDate';

                    activity.activityBatchUpdate((response) => {
                        console.log(response);
                    });
                } else {
                    var activityId = $(instance.input).attr('data-id');
                    var clusteringKey = $(instance.input).attr('data-createdby');

                    var endTime = dateStr.split("-");
                    // 26-03-2019  2019-03-28
                    var newDate = endTime[2] + "-" + endTime[1] + "-" + endTime[0];

                    const activity = new Activity();
                    activity.activityId = activityId;
                    activity.clusteringKey = clusteringKey;
                    activity.activityUpdateData = newDate;
                    activity.activityType = 'SubTask';
                    activity.activityUpdateType = 'duedate';

                    activity.activityUpdate((response) => {
                        console.log(response);
                    });
                }
            }
        },
    });


    $(".com_DateInput,.st_cDate_value").flatpickr({
        // enableTime: true,
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            
            $(instance.input).attr('data-date', dateStr);
            if(uniqComDate.indexOf(moment(dateStr).format('YYYY-MM-DD')) == -1){
                uniqComDate.push(moment(dateStr).format('YYYY-MM-DD'));
            }
            
            if (!$('.taskLoaderFull').is(':visible')) {
                var activityId = $(instance.input).attr('data-id');
                var clusteringKey = $(instance.input).attr('data-createdby');

                var endTime = dateStr.split("-");
                // 26-03-2019  2019-03-28
                var newDate = endTime[2] + "-" + endTime[1] + "-" + endTime[0];

                const activity = new Activity();
                activity.activityId = activityId;
                activity.clusteringKey = clusteringKey;
                activity.activityUpdateData = newDate;
                activity.activityType = 'SubTask';
                activity.activityUpdateType = 'comdate';

                activity.activityUpdate((response) => {
                    console.log(response);
                });
            }
        },

        // time_24hr: true
    });

    $("#searchBydd").flatpickr({
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            dueDateSearch(dateStr);
        },
    });

    $("#searchBycd").flatpickr({
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            compDateSearch(dateStr);
        },
    });
}

function dueDateSearch(dateStr) {
    $('.DateCell').each(function(k, obj) {
        if ($(obj).find('.datePick').val().search(dateStr) > -1) {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
        } else {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').hide();
        }
    });
}

function compDateSearch(dateStr) {
    $('.com_DateCell').each(function(k, obj) {
        if ($(obj).find('.com_DateInput').val().search(dateStr) > -1) {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
        } else {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').hide();
        }
    });
}


var interval = moment.duration(60, "seconds").timer({
        loop: true,
        wait: 2500,
        executeAfterWait: true
    },
    function() {

        $.each(reminderStartList, function(k, v) {
            let now = moment().format('x');
            let timeDiff = Math.floor(v.endtime - now);
            let secDifference = Math.floor(timeDiff / 1000);
            let minDiff = Math.floor(secDifference / 60) - parseInt(v.reminder);
            if (minDiff == 0) {
                var toDoName = $('#activity_' + k).find('.toDoName').text();
                toastr.options.closeButton = true;
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr["warning"]("\"" + toDoName + "\" start after " + minToHour(v.reminder), "Warning");
            }
        });

        $.each(reminderEndList, function(k, v) {
            let now = moment().format('x');
            let timeDiff = Math.floor(v.endtime - now);
            let secDifference = Math.floor(timeDiff / 1000);
            let minDiff = Math.floor(secDifference / 60) - parseInt(v.reminder);
            if (minDiff == 0) {
                var toDoName = $('#activity_' + k).find('.toDoName').text();
                toastr.options.closeButton = true;
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr["warning"]("\"" + toDoName + "\" end after " + minToHour(v.reminder), "Warning");
            }

        });
    });

function minToHour(min) {
    if (min == 15) {
        return "15 mins";
    } else if (min == 30) {
        return "30 mins";
    } else if (min == 45) {
        return "45 mins";
    } else if (min == 60) {
        return "1 hour";
    } else if (min == 120) {
        return "2 hours";
    } else if (min == 180) {
        return "3 hours";
    } else if (min == 240) {
        return "4 hours";
    } else if (min == 300) {
        return "5 hours";
    } else {
        return min + " mins";
    }
}

function onDynamicFire() {

}

function showMorePopUp(){
    if (!$('.moreMenuPopup').is(':visible')) {
        if ($('#actCre').val() == user_id) {
            $('.moreMenuPopup').show();
        } else {
            $('.moreMenuPopup').hide();
        }
    } else {
        $('.moreMenuPopup').hide();
    }
}

$('#dueDatePicker').click(function() {
    $('#dueDatePicker').css('pointer-events', 'none');
    if ($('#dueDatePickerDiv').is(':visible')) {
        $('#dueDatePickerDiv').hide();
        $('#dueDatePicker').css('pointer-events', 'auto');
    } else {
        $('#dueDatePickerDiv').show();
    }
});

jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

function escKeUp (){
    $(document).on('keydown', function(e) {
        if (e.keyCode === 27) {
            if (!$('#n_ToDo_item').is(':visible')) {
                if ($("#updateAction").val() !== 0 && $("#actCre").val() === user_id) {
                    var activity_from = $("#timeFrom").val();
                    var activity_to = $("#timeTo").val();
                    var activity_reminder = $("#ReminderTime").val();
                    var acid = $('#chat_icon').attr('data-activity_id');
                    var data = {
                        activity_from: activity_from,
                        activity_to: activity_to,
                        activity_reminder: activity_reminder
                    };

                    $("#dueDatePickerDiv").hide();
                    $('#dueDatePicker').css('pointer-events', 'auto');
                } else {
                    $("#dueDatePickerDiv").hide();
                    $('#dueDatePicker').css('pointer-events', 'auto');
                }
            }
        }
    })
}

function allMouseUp (){
    $(document).mouseup(function(e) {
        var dueDatePickerDiv = $('#dueDatePickerDiv');
        if (!$('#n_ToDo_item').is(':visible')) {
            if (dueDatePickerDiv.is(':visible')) {
                if (!dueDatePickerDiv.is(e.target) && dueDatePickerDiv.has(e.target).length === 0) {
                    if ($("#updateAction").val() !== 0 && $("#actCre").val() === user_id) {

                        var activity_from = $("#timeFrom").val();
                        var activity_to = $("#timeTo").val();
                        var activity_reminder = $("#ReminderTime").val();
                        var acid = $('#chat_icon').attr('data-activity_id');
                        var data = {
                            activity_from: activity_from,
                            activity_to: activity_to,
                            activity_reminder: activity_reminder
                        };

                        $('#dueDatePicker').css('pointer-events', 'auto');
                        $("#dueDatePickerDiv").hide();
                    } else {
                        dueDatePickerDiv.hide();
                        $('#dueDatePicker').css('pointer-events', 'auto');
                    }
                }
            }
        }
        if (dueDatePickerDiv.is(':visible')) {
            if (!dueDatePickerDiv.is(e.target) && dueDatePickerDiv.has(e.target).length === 0) {
                $('#dueDatePicker').css('pointer-events', 'auto');
                $("#dueDatePickerDiv").hide();
            }
        }

    });
}


function showRemovePopUp(activityid){
    $('#delete_to_do_div').show();
    $('.delete_msg_sec_title').text('Are you sure you want to DELETE the following Task ?');
    $('.main-deleted-msg').html("");
    tempUpdateAction = $('#updateAction').val();
    tempActivityCreatedAt = $('#actCre').val();
    tempActivityCreatedBy = $('#activityCreatedAt').val();

    $('#updateAction').val(activityid);
    $('#actCre').val(user_id);

    var toDoName = $('#activity_' + activityid).find('.toDoName').text();
    $('.main-deleted-msg').append('<span>Task Title :</span><p>' + toDoName + '</p>');
}

function delete_commit_td() {

    var todoActivityId = $('#updateAction').val();
    var toDoCreateAt = $('#activityCreatedAt').val();
    var toDoName = $('#activity_' + todoActivityId).find('.toDoName').text();
    var toDoCreator = $('#actCre').val();

    if (toDoCreator == user_id) {
        const activity = new Activity();

        activity.activityId = todoActivityId;
        activity.activityCreatedBy = user_id;

        activity.deleteActivity((response) => {
            if (response.deleteActivityResponse.status) {
                closeAllPopUp()
                if ($('#activity_' + todoActivityId).hasClass('activeTodo')) {
                    $('#activity_' + todoActivityId).remove();
                    firstLiClick($('.side_bar_list_item > li:visible').length);
                } else {
                    $('#activity_' + todoActivityId).remove();
                    firstLiClick($('.side_bar_list_item > li:visible').length);
                }
            }
        });

    } else {
        toastr['warning']('Please contact with todo creator', 'Warning');
    }
}

function firstLiClick(param) {
    if (param == 0) {
        createNewTodo();
    } else {
        $('.side_bar_list_item li:first').click();
        $('.side_bar_list_item li:first').addClass('activeTodo selected');
    }
}

$(function () {

  task_join_into_room();
  subtask_join_into_room();

  column_hide_by_classname("owner");
  column_hide_by_classname("coowner");
  /* Column Draggable */
  var oldIndex;
  sortableFunc();
  /* End Row */

  var resizeclass = "";
//   resizecolumn();
  enabletime();
});

function sortableFunc(){
    $(".group-header-component").sortable({
        placeholder: "ui-state-highlight",
        handle: ".dragColumn",
        cancel: ".name-column-header, .flex_heading",
        revert: false,
        opacity: 0.7,
        dropOnEmpty: false,
        sort: function(event,ui){
            if(ui.position.left < 519 ){
            $('.ui-state-highlight').hide();

            }else{
            $('.ui-state-highlight').show();
            }
        },
        helper: function (event, item) {
            var elements = $(item).addClass("uiselected");
            return elements.clone();
        },
        start: function (event, ui) {
            var ele = $(ui.item[0]);
            oldIndex = $(".column-header").index(ele);
        },
        change: function(event, ui) {
            
            ui.placeholder.stop().height(0).animate({
                height: ui.item.outerHeight() + 15
            }, 300);

            
            placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));
            $(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
                height: 0
            }, 300, function() {
                $(this).remove();
                placeholderHeight = ui.item.outerHeight();
                $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
            });
            
        },
        beforeStop: function(event, ui) {

            var dropIndex = $(".column-header").index($(ui.item)) + 1;
            
            if(dropIndex == 1){
                $(ui.item).removeClass('uiselected');
                $(this).sortable('cancel');
            }

            if($(".group-header-component").find('.column-header:eq('+dropIndex+')').hasClass('flex_heading')){
                $(ui.item).removeClass('uiselected');
                $(this).sortable('cancel');
            }
        },
        stop: function (event, item) {
            var ele = $(item.item[0]);
            var eachPulse = $(item.item[0])
                .parents('.group-header-wrapper')
                .next('.pulse-component-wrapper')
                .find('.pulse-component');
            $(ele).removeClass("uiselected");
            var newIndex = $(".column-header").index(ele);
            if (oldIndex != newIndex) {
                oldIndex++;
                newIndex++;

                $(eachPulse).each(
                function (i, row) {
                    row = $(row);
                    if (newIndex < oldIndex) {
                    row.children().eq(newIndex).before(row.children()[oldIndex]);
                    } else if (newIndex > oldIndex) {
                    row.children().eq(newIndex).after(row.children()[oldIndex]);
                    }
                });

                // Footer row
                var row2 = $(".columns-footer-component");
                    if (newIndex < oldIndex) {
                    row2.children().eq(newIndex).before(row2.children()[oldIndex]);
                } else if (newIndex > oldIndex) {
                    row2.children().eq(newIndex).after(row2.children()[oldIndex]);
                }
            }
            var slList = [];
            $('.frzHandler').each((ke,va)=>{
                if(slList.indexOf($(va).attr('data-id')) == -1 ){
                    slList.push($(va).attr('data-id'));
                }
            });

            saveColSerial(slList,$("#updateAction").val(), user_id,'col');
        }
    });
    $(".group-header-component").disableSelection();

        /* End column */

        /* Row Draggable */
    $(".pulse-component-wrapper").sortable({
        placeholder: "ui-state-highlight",
        items: ".pulse-component:not(:last-child):not(:nth-last-child(2))",
        change: function(event, ui) {
            
            ui.placeholder.stop().height(0).animate({
                height: ui.item.outerHeight() + 15
            }, 300);
            
            placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));
            
            $(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
                height: 0
            }, 300, function() {
                $(this).remove();
                placeholderHeight = ui.item.outerHeight();
                $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
            });
            
        },
        stop: function (event, item) {
            var slList = [];
            
            $(".pulse-component:not(#OnlyForClone):not(:last-child):not(:nth-last-child(2))").each(function(k, v) {
                if(slList.indexOf($(v).attr('data-id')) == -1 ){
                    slList.push($(v).attr('data-id'));
                };
            });
            saveColSerial(slList,$("#updateAction").val(), user_id,'row');
        }
    });
    $(".pulse-component").disableSelection();
}

function resizecolumn() {
    $(".column-header").resizable({
        handles: "e",
        maxWidth: 200,
        minWidth: 120,
        start: function(event, ui) {
            $(ui.element).css("flex-basis", "auto");
            resizeclass = $(ui.element).attr("data-id");
            $(ui.element).closest('.frzHandler').find('.drop-menu-wrapper').removeClass('drop_active');
            $('.dialog-node').hide();
        },
        resize: function(event, ui) {
            var current_width = $(ui.element).css("width");
            $("." + resizeclass).css("flex-basis", current_width);
        },
        stop: function(event, ui) {
            var current_width = $(ui.element).css("width");
            $(ui.element).css("flex-basis", current_width);
            $(ui.element).attr("data-size", "flex-basis: " + current_width);
            $("." + resizeclass).css("flex-basis", current_width);
        }
    });
};

function collapse(event, elem){

    $(event.target).closest(".column-header").find(".column-header-inner").hide();
    $(event.target).closest(".column-header").find(".expand-column").show();
    $(event.target).closest(".column-header").css("flex-basis", "16px");

    var ele = $(event.target).closest(".column-header");
    var col_index = $(".column-header").index(ele) + 1;

    var collapseColumn = $(event.target)
        .parents('.group-header-wrapper')
        .next('.pulse-component-wrapper')
        .find('.pulse-component:not(#addnewSub)');

    $(collapseColumn).each(function(i, row) {
        row = $(row);
        row.children().eq(col_index).children().hide();
        row.children().eq(col_index).css("flex-basis", "16px");
    });

    $("#addnewSub .cell-component").each(function(k, v) {
        var colNum = k + 2;
        if (colNum == col_index) {
            $(v).hide();
        }
    });

    var setVal = $(elem).attr('data-setval');
    var setId = $(elem).attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = $(elem).attr('id');
        activity.activityCreatedBy = user_id;

        activity._setting((response) => {
            $(elem).attr('data-setval', currentVal);
            $(elem).attr('data-setid', response._setting_response.settingid);
            $(event.target).closest(".column-header").find(".expand-column").attr('data-setid', response._setting_response.settingid);
        });
    }
};

// Expand Column
    function expand_column(event){
    var actSize = $(event.target).closest(".column-header").attr('data-size');
    $(event.target).closest(".column-header").find(".expand-column").hide();
    $(event.target).closest(".column-header").find(".column-header-inner").show();
    $(event.target).closest(".column-header").attr('style', actSize);
    $('.header_menu_btn').removeClass('drop_active'); // right dropdown icon
    $('.dialog-node').hide(); // right dropdown menu

    // Table body
    var ele = $(event.target).closest(".column-header");
    var col_index = $(".column-header").index(ele) + 1;
    var expandColumn = $(event.target)
        .parents('.group-header-wrapper')
        .next('.pulse-component-wrapper')
        .find('.pulse-component:not(#addnewSub)');
    $(expandColumn).each(
        function(i, row) {
            row = $(row);
            row.children().eq(col_index).children().show();
            row.children().eq(col_index).attr('style', actSize);
        });

    $("#addnewSub .cell-component").each(function(k, v) {
        var colNum = k + 2;
        if (colNum == col_index) {
            $(v).show();
        }
    });

    $("#varienceRow .cell-component").each(function(k, v) {
        var colNum = k + 2;
        if (colNum == col_index) {
            $(v).show();
        }
    });

    var activity = new Activity();
    activity.targetID = $(event.target).attr('data-setid');
    activity.activityId = $("#updateAction").val();
    activity.activityUpdateData = '1';
    activity.activityType = $(event.target).attr('data-type');
    activity.activityCreatedBy = user_id;

    activity._setting((response) => {
        $(event.target).attr('data-setval', '1');
        $(event.target).attr('data-setid', response._setting_response.settingid);
    });
}

function deletecol(event){
    $(event.target).closest(".column-header").find(".column-header-inner").hide();
    $(event.target).closest(".column-header").css("flex-basis", "16px");

    var ele = $(event.target).closest(".column-header");
    var col_index = $(".column-header").index(ele) + 1;
    $(event.target).closest('.new-added-check-list').find('.pulse-component-wrapper .pulse-component').each(function(
        i, row) {
        row = $(row);
        row.children().eq(col_index).hide();
    });
}

function openAddMenu(event) {
    if ($("#addMenu").is(':visible')) {
        $(event).find('.fa-plus-circle').removeClass('open2');
        $("#addMenu .dialog-node").html('');
        $("#addMenu .dialog-node").hide();
        $("#addMenu").hide();
    } else {
        $(event).find('.fa-plus-circle').addClass('open2');
        $("#addMenu .dialog-node").append($("#addMEnuContainer").html());
        $.each($(".column-menu-item"), function(k, v) {
            if ($("." + $(v).attr("data-name")).is(":visible"))
                $(v).find(".fa-check").show();
            else
                $(v).find(".fa-check").hide();
        });
        $("#addMenu .dialog-node").show();
        $("#addMenu").show();

        var totalP = $(".pulse-component").length;
        if (totalP < 10) {
            scrollToBottom('.workspaceform');
        }
    }
}

function column_hide_by_classname(cls) {
    $("." + cls).hide();
    $(".also" + cls).hide();
    $(".column-menu-item[data-name='" + cls + "']").find(".fa-check").hide();
}

function column_menu_item(event) {

    var element = $(event.target).closest(".column-menu-item");
    var ele_class = $(element).attr("data-name");

    if ($(element).hasClass("active") && $("." + ele_class).is(":visible")) {
        // now hide this column
        $("." + ele_class).hide();
        $(element).find(".fa-check").hide();

        // Table body
        var ele = $("." + ele_class);
        var col_index = $(".column-header").index(ele) + 1;
        $(ele).closest('.workspaceform').find('.pulse-component-wrapper .pulse-component').each(function(i, row) {
            row = $(row);
            row.children().eq(col_index).hide();
            $("#addnewSub").children().eq(col_index).hide();
        });

        $("#addnewSub .cell-component").each(function(k, v) {
            var colNum = k + 2;
            if (colNum == col_index) {
                $(v).hide();
            }
        });


        $(element).removeClass("active");
        if (ele_class == "owner") {
            if ($(".heading3").is(":visible") && $(".heading4").is(":visible")) {
                $(".heading3").css({
                    "left": "279px"
                });
                $(".heading4").css({
                    "left": "370px"
                });
            } else {
                $(".heading4").css({
                    "left": "279px"
                });
            }
        } else if (ele_class == "Observer") {
            if ($(".heading2").is(":visible")) {
                $(".heading4").css({
                    "left": "370px"
                });
            } else {
                $(".heading4").css({
                    "left": "279px"
                });
            }
        }
    } else {
        // now show this column
        $("." + ele_class).show();
        $(element).find(".fa-check").show();

        // Table body
        var ele = $("." + ele_class);
        var col_index = $(".column-header").index(ele) + 1;
        $(ele).closest('.workspaceform').find('.pulse-component-wrapper .pulse-component').each(function(i, row) {
            row = $(row);
            row.children().eq(col_index).show();
        });
        $(element).addClass("active");

        $("#addnewSub .cell-component").each(function(k, v) {
            var colNum = k + 2;
            if (colNum == col_index) {
                $(v).show();
            }
        });

        if (ele_class == "owner") {
            if ($(".heading3").is(":visible")) {
                $(".heading3").css({
                    "left": "374px"
                });
                $(".heading4").css({
                    "left": "465px"
                });
            } else {
                $(".heading4").css({
                    "left": "374px"
                });
            }
        } else if (ele_class == "Observer") {
            if ($(".heading2").is(":visible")) {
                $(".heading4").css({
                    "left": "465px"
                });
            } else {
                $(".heading4").css({
                    "left": "374px"
                });
            }
        } else if (ele_class == "assignee") {
            if ($(".heading2").is(":visible") && $(".heading3").is(":visible")) {
                $(".heading4").css({
                    "left": "465px"
                });
            } else if ($(".heading2").is(":visible") || $(".heading3").is(":visible")) {
                $(".heading4").css({
                    "left": "374px"
                });
            } else {
                $(".heading4").css({
                    "left": "279px"
                });
            }
        }

    }

    var leftPo_g = 503;
    var two84chek = 0;
    $('.group-header-component .frzHandler').each(function(k, v) {
        if (k < frzIndex) {
            if ($(v).is(':visible')) {
                if (k == 0) {
                    $(v).css('left', '38px');
                } else if (k == 1) {
                    two84chek = 1;
                    $(v).css('left', '503px');
                } else if (k == 2) {
                    if (two84chek > 0) {
                        leftPo_g = leftPo_g + 122;
                        $(v).css('left', leftPo_g);
                    } else {
                        two84chek = 1;
                        $(v).css('left', '503px');
                    }
                } else if (k == 3) {
                    if (two84chek > 0) {
                        leftPo_g = leftPo_g + 122;
                        $(v).css('left', leftPo_g);
                    } else {
                        $(v).css('left', '503px');
                    }
                } else {
                    leftPo_g = leftPo_g + 122;
                    $(v).css('left', leftPo_g);
                }
            }

            $(v).addClass('flex_heading');
            $(v).find('.column-header-inner .ui-sortable-handle').removeClass('dragColumn');
        }
    });

    $('.pulse-component').each(function(kp, vp) {

        var leftPo_c = 503;
        var two84chek2 = 0;

        $(vp).find('.cell-component').each(function(k, v) {
            if (k < frzIndex) {
                if ($(v).is(':visible')) {
                    if (k == 0) {
                        $(v).css('left', '38px');
                    } else if (k == 1) {
                        two84chek2 = 1;
                        $(v).css('left', '503px');
                    } else if (k == 2) {
                        if (two84chek2 > 0) {
                            leftPo_c = leftPo_c + 121;
                            $(v).css('left', leftPo_c);
                        } else {
                            two84chek2 = 1;
                            $(v).css('left', '503px');
                        }
                    } else if (k == 3) {
                        if (two84chek2 > 0) {
                            leftPo_c = leftPo_c + 121;
                            $(v).css('left', leftPo_c);
                        } else {
                            $(v).css('left', '503px');
                        }
                    } else {
                        leftPo_c = leftPo_c + 121;
                        $(v).css('left', leftPo_c);
                    }
                }
                $(v).addClass('flex_heading');
            }
            if (k > 0) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #fff');
            }
            if (k == frzIndex - 1) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #1575ea');
            }
        });
    });

    var setVal = $(element).attr('data-setval');
    var setId = $(element).attr('data-setid');

    if (setVal != undefined) {
        if (setVal !== '3') {

            if (setVal == '2') {
                var currentVal = '0';
                var dVal = '2';
            } else if (setVal == '1') {
                var currentVal = '0';
                var dVal = '0';
            } else if (setVal == '0') {
                var currentVal = '1';
                var dVal = '1';
            }

            var activity = new Activity();
            activity.targetID = setId;
            activity.activityId = $("#updateAction").val();
            activity.activityUpdateData = dVal;
            activity.activityType = $(element).attr('id');
            activity.activityCreatedBy = user_id;

            activity._setting((response) => {

                $(event.target).attr('data-setval', currentVal);
                $(event.target).attr('data-setid', response._setting_response.settingid);
            });
        }
    }
}

function renameSubtask(event) {
    $(event).closest('.cell-component').find('.name-text .edit-indicator ').trigger('click');
    $(event).parents('.dialog-node').hide();
}

function duplicateSubtask(event) {

    var htm = $(event).closest('.pulse-component').clone();
    var id = $('.pulse_title').length + 1;
    var od = 'newSubtask' + $('.innerDropMeny').length;

    var addcheck = $(event).closest('.pulse-component').find('.pulse_title').text();

    const activity = new Activity();

    activity.activityTitle = addcheck;
    activity.activityType = 'SubTask';
    activity.activityCreatedBy = user_id;
    activity.activityHasRoot = 1;
    activity.activityRootId = $("#updateAction").val();
    activity.activityDueDate = $("#dueDatePicker").val();

    // activity.activityStatus           = $(event).closest('.pulse-component').find(".StatusCell .view_status").text();
    // activity.activityBudgeAmount      = $(event).closest('.pulse-component').find(".AmountCell .AmountCellSpan").text();
    // activity.activityActualAmount     = $(event).closest('.pulse-component').find(".actualCell .actualCellSpan").text();
    // activity.activityEstHour          = $(event).closest('.pulse-component').find(".timeEstCell .timeInputValue").text();
    // activity.activityEstHourRate      = $(event).closest('.pulse-component').find(".ManHourRateCell .ManHourRateSpan").text();
    // activity.activityActualHour       = $(event).closest('.pulse-component').find(".actualHourCell .actualHourCellSpan").text();
    // activity.activityActualHourRate   = $(event).closest('.pulse-component').find(".hourlyRateCell .hourlyRateCellSpan").text();


    var activityCreatedBy = (!validate.isEmpty(activity.activityCreatedBy) ? true : false);

    if (activityCreatedBy) {
        activity.saveActivity((response) => {
            if (!validate.isEmpty(response)) {
                if (response.status) {
                    var pulse = response.activity_id;
                    myAllActivityGlobal.push(pulse);
                    $(htm).attr('id', 'pulse_' + pulse).addClass('_eachsubtask');
                    $(htm).find('.name-cell-component .pulse_title').text(addcheck);
                    $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
                    $(htm).find('.numeric-cell-component .amountInputValue').text('0');
                    $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/' + user_img);
                    $(htm).find('.owner_img').attr('title', user_fullname);
                    $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle' + id).text(addcheck);
                    $(htm).find('.name-cell-component .pulse_title').attr('data-title', addcheck);

                    // ATTR SET

                    $(htm).find('.ObserverCell .observerViewList').attr('data-id', response.activity_id);
                    $(htm).find('.coowonerCell .coownerViewList').attr('data-id', response.activity_id);
                    $(htm).find('.AssigneeCell .assigneeViewList').attr('data-id', response.activity_id);
                    $(htm).find('.DateCell .dueDateInput').attr('data-id', response.activity_id);
                    $(htm).find('.com_DateCell .com_DateInput').attr('data-id', response.activity_id);
                    $(htm).find('.priorityCell .single_priority').attr('data-id', response.activity_id);
                    $(htm).find('.StatusCell .single_status').attr('data-id', response.activity_id);
                    $(htm).find('.timeEstCell .timeInputValue').attr('data-id', response.activity_id);
                    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-id', response.activity_id);
                    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-id', response.activity_id);
                    $(htm).find('.AmountCell .AmountCellSpan').attr('data-id', response.activity_id);
                    $(htm).find('.actualCell .actualCellSpan').attr('data-id', response.activity_id);
                    $(htm).find('.varianceCell .varianceCellSpan').attr('data-id', response.activity_id);
                    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-id', response.activity_id);
                    $(htm).find('.name-cell-component .pulse_title').attr('data-id', response.activity_id);
                    $(htm).find('.name-cell-component .flagIco').attr('data-id', response.activity_id);

                    $(htm).find('.ObserverCell .observerViewList').attr('data-createdby', user_id);
                    $(htm).find('.coowonerCell .coownerViewList').attr('data-createdby', user_id);
                    $(htm).find('.AssigneeCell .assigneeViewList').attr('data-createdby', user_id);
                    $(htm).find('.DateCell .dueDateInput').attr('data-createdby', user_id);
                    $(htm).find('.com_DateCell .com_DateInput').attr('data-createdby', user_id);
                    $(htm).find('.priorityCell .single_priority').attr('data-createdby', user_id);
                    $(htm).find('.StatusCell .single_status').attr('data-createdby', user_id);
                    $(htm).find('.timeEstCell .timeInputValue').attr('data-createdby', user_id);
                    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-createdby', user_id);
                    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-createdby', user_id);
                    $(htm).find('.AmountCell .AmountCellSpan').attr('data-createdby', user_id);
                    $(htm).find('.actualCell .actualCellSpan').attr('data-createdby', user_id);
                    $(htm).find('.varianceCell .varianceCellSpan').attr('data-createdby', user_id);
                    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-createdby', user_id);
                    $(htm).find('.name-cell-component .pulse_title').attr('data-createdby', user_id);

                    // ID SET

                    $(htm).find('.DateCell .dueDateInput').attr('id', 'dueDate' + response.activity_id);
                    $(htm).find('.com_DateCell .com_DateInput').attr('id', 'comDate' + response.activity_id);
                    $(htm).find('.ObserverCell .observerViewList').attr('id', 'observer' + response.activity_id).addClass('observer' + response.activity_id);
                    $(htm).find('.AssigneeCell .assigneeViewList').attr('id', 'assignee' + response.activity_id).addClass('assignee' + response.activity_id);
                    $(htm).find('.coowonerCell .coownerViewList').attr('id', 'coowner' + response.activity_id).addClass('coowner' + response.activity_id);
                    $(htm).find('.priorityCell').attr('id', 'priority' + response.activity_id);
                    $(htm).find('.StatusCell').attr('id', 'status' + response.activity_id);
                    $(htm).find('.timeEstCell .timeInputValue').attr('id', 'timeInputValue' + response.activity_id);
                    $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('id', 'ManHourRateSpan' + response.activity_id);
                    $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('id', 'hourlyRateCellSpan' + response.activity_id);
                    $(htm).find('.AmountCell .AmountCellSpan').attr('id', 'AmountCellSpan' + response.activity_id);
                    $(htm).find('.actualCell .actualCellSpan').attr('id', 'actualCellSpan' + response.activity_id);
                    $(htm).find('.varianceCell .varianceCellSpan').attr('id', 'varianceCellSpan' + response.activity_id);
                    $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('id', 'timevarianceCellSpan' + response.activity_id);

                    if ($('#addnewSub').is(':visible')) {
                        if (row_pluse_count == 0) {
                            $('.pulse_title').first().closest('.pulse-component').before(htm);
                        } else if (row_pluse_count == 1) {
                            $('#varienceRow').before(htm);
                        }

                        if (($('.pulse_title').length - 1) > 9) {
                            $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                        }

                        $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                    } else {
                        $('.pulse_title').last().closest('.pulse-component').before(htm);
                        var wid = 0;

                        $('.cell-component:visible').each(function(k, v) {
                            wid = wid + $(v).innerWidth();
                        });

                        SubtaskClone.cellcomponent = 17;
                        SubtaskClone.flexSize = wid;
                        SubtaskClone.id = $('.pulse-component').length;

                        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
                        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

                        $("#thisWeekPluseContainer").show();

                        if (($('.pulse_title').length - 1) > 9) {
                            $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                        }

                        $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                    }

                    $('.kill').css('height', $('.pulse-component').length * 37 + 200);

                    enabletime();
                    keypressBlur();
                    countSubtask();
                    onDynamicFire();
                    tooltipforToDo();
                    batchMenuCounter();
                    batchMenuCounterFull();
                } else {
                    console.log("Something wrong with DB", response);
                }
            } else {
                console.log("Something wrong with DB", response);
            }

        });
    }
}

function countSubtask() {
    let _subtask = $('._eachsubtask').length;
    if (_subtask == 0) {
        taskShowHideElement(false)
    } else {
        taskShowHideElement(true)
    }
}


function deleteSubtask(event) {


    var activityId = $(event).closest('.pulse-component').find('.pulse_title').attr('data-id');
    var createdby = $(event).closest('.pulse-component').find('.pulse_title').attr('data-createdby');

    const activity = new Activity();

    activity.activityId = activityId;
    activity.activityCreatedBy = createdby;

    activity.deleteActivity((response) => {
        if (response.deleteActivityResponse.status) {
            $(event).closest('.pulse-component').remove();
            countSubtask();

            $(".pulse-component:not(#OnlyForClone)").each(function(k, v) {
                $(v).find('.pulse-left-indicator .row_pluse_count').text(k + 1);
                if (($('.pulse_title').length - 1) > 9) {
                    $(v).find('.pulse-left-indicator .row_pluse_count').addClass('twodigi');
                }
            });
            batchMenuCounter();
            batchMenuCounterFull();
        }
    });

}

function subtaskProperty(elm) {
    var activity_id = $(elm).parents('.pulse-component').attr('data-id');
    var creator_name = $('#pulse_' + activity_id).attr('data_cr_name');
    var created_date = moment($('#pulse_' + activity_id).attr('data_created_date'), 'YYYY-MM-DD').format('DD-MM-YYYY');
    var created_time = moment($('#pulse_' + activity_id).attr('data_created_date'), 'YYYY-MM-DD HH:mm:ssZZ').format('hh:mm A');
    /* Default */
    $('#subTaskCreated_By').text('Created By ' + creator_name + '');
    $('#subTaskCreated_At').text('dated on ' + created_date + '');
    $('#subTaskCreated_At_time').text('at ' + created_time + '');
    $('.batchButtonSec').find('.floatingBtn').removeClass('active');
    $('.batchButtonSec .bproperties').addClass('active');
    $('.property-details').show();
    $('.st_chat').hide();
    $('.st_note').hide();
    $('.property_notes').attr('data-batch_id', activity_id);
    $('.property_notes').attr('data-notetype', '');
    $('.property_notes').attr('data-createdby', '');

    $('#subtaskProperty .st_observer_value').html('');
    $('#subtaskProperty .st_assignee_value').html('');
    $('#subtaskProperty .st_owner_value').html('');
    $('#subtaskProperty .st_coWoner_value').html('');
    $('#subtaskProperty .st_phase_value').html('');
    $('#subtaskProperty .st_status_value').html('');
    $('#subtaskProperty .batchButtonSec').css('display', 'flex');
    var title = $(elm).parents('._eachsubtask').find('.pulse_title').text();
    var phase = $(elm).parents('._eachsubtask').find('.alsophase').html();
    var status = $(elm).parents('._eachsubtask').find('.alsostatuscol').html();
    var date = $(elm).parents('._eachsubtask').find('.dueDateInput').val();
    var Cdate = $(elm).parents('._eachsubtask').find('.com_DateInput').val();
    var createdby = $(elm).parents('._eachsubtask').find('.dueDateInput').attr('data-createdby');
    var budget = $(elm).parents('._eachsubtask').find('.alsobudget').find('.amountInputValue').text();
    var actual = $(elm).parents('._eachsubtask').find('.alsoactual').find('.amountInputValue').text();
    var ehRate = $(elm).parents('._eachsubtask').find('.alsomanhourcost').find('.amountInputValue').text();
    var ewHour = $(elm).parents('._eachsubtask').find('.alsotimeest').find('.timeInputValue').text();
    var awHour = $(elm).parents('._eachsubtask').find('.alsotactualtime').find('.timeInputValue').text();
    var ahRate = $(elm).parents('._eachsubtask').find('.alsohourlyrate').find('.amountInputValue').text();
    var variance = $(elm).parents('._eachsubtask').find('.alsovariance').find('.amountInputValue').text();
    var observer = $(elm).parents('._eachsubtask').find('.alsoObserver').find('.person-image-wrapper').html();
    var assignee = $(elm).parents('._eachsubtask').find('.alsoassignee').find('.person-image-wrapper').html();
    var owner = $(elm).parents('._eachsubtask').find('.alsoowner').find('.person-image-wrapper').html();
    var coowner = $(elm).parents('._eachsubtask').find('.alsocoowner').find('.person-image-wrapper').html();
    $('#subtaskProperty').toggle();
    $('#subtaskProperty .property_title').text(title).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_phase_value').append(phase).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_dDate_value').val(date).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_cDate_value').val(Cdate).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_bAmount_value').val(budget).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_aAmount_value').val(actual).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_variance_value').val(variance).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_ehRate_value').val(ehRate).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_ewHour_value').val(ewHour).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_awHour_value').val(awHour).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_ahRate_value').val(ahRate).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_status_value').append(status).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_observer_value').append(observer).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    }).addClass('observer' + activity_id + ' person-cell-component');
    $('#subtaskProperty .st_assignee_value').append(assignee).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    }).addClass('assignee' + activity_id + ' person-cell-component');
    $('#subtaskProperty .st_owner_value').append(owner).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    });
    $('#subtaskProperty .st_coWoner_value').append(coowner).attr({
        'data-id': activity_id,
        'data-createdby': createdby
    }).addClass('coowner' + activity_id + ' person-cell-component');

    var arg_data = {
        activity_id: activity_id,
        user_id: user_id
    };

    if ($(elm).hasClass('addNotePopup')) {
        open_subtask_note(activity_id);
    } else if ($(elm).hasClass('subtask_chat')) {
        openSubtaskChat(activity_id);
    }
}

function updateFromProperty(e, elm) {
    let id = $(elm).attr('data-id');
    let code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39) {
        let value = parseInt($(elm).val());
        if ($(elm).val().length < 15) {
            if (validate.isInteger(value)) {
                if (value > -1) {

                    if (code == 13) {
                        e.preventDefault();
                        $(e.target).text(value);
                        $(e.target).attr('data-val', value);
                        $(e.target).blur();

                        formulafun(e.target);
                        var activityId = $(elm).attr('data-id');
                        var clusteringKey = $(elm).attr('data-createdby');
                        if ($(elm).hasClass('st_bAmount_value')) {
                            $('#AmountCellSpan' + id).text(value);

                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskBAinput';

                            activity.activityUpdate((response) => {
                                var budget = $(elm).val();
                                var actual = $(elm).parents('.st_bAmount.pro_name_value').siblings('.st_aAmount.pro_name_value').find('.st_aAmount_value').val();
                                var varience = $(elm).parents('.st_bAmount.pro_name_value').siblings('.st_variance.pro_name_value').find('.st_variance_value').val((budget == '' ? 0 : parseInt(budget)) - (actual == '' ? 0 : parseInt(actual)));
                                varienceCollect();
                            });
                        } else if ($(elm).hasClass('st_aAmount_value')) {
                            $('#actualCellSpan' + id).text(value);
                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskAAinput';

                            activity.activityUpdate((response) => {
                                var budget = $(elm).parents('.st_aAmount.pro_name_value').siblings('.st_bAmount.pro_name_value').find('.st_bAmount_value').val();
                                var actual = $(elm).val();
                                var varience = $(elm).parents('.st_aAmount.pro_name_value').siblings('.st_variance.pro_name_value').find('.st_variance_value').val((budget == '' ? 0 : parseInt(budget)) - (actual == '' ? 0 : parseInt(actual)));
                                varienceCollect();
                            });
                        } else if ($(elm).hasClass('st_ehRate_value')) {
                            $('#ManHourRateSpan' + id).text(value);
                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskEHRinput';

                            activity.activityUpdate((response) => {
                                var estTime = parseInt(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
                                var estRate = parseInt(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
                                var actualTime = parseInt(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
                                var actualRate = parseInt(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

                                var timever = (estTime * estRate) - (actualTime * actualRate);

                                $("#timevarianceCellSpan" + activityId).text(timever + '.00');

                                varienceCollect();
                            });
                        } else if ($(elm).hasClass('st_ahRate_value')) {
                            $('#hourlyRateCellSpan' + id).text(value);

                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskAHRinput';

                            activity.activityUpdate((response) => {
                                var estTime = parseInt(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
                                var estRate = parseInt(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
                                var actualTime = parseInt(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
                                var actualRate = parseInt(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

                                var timever = (estTime * estRate) - (actualTime * actualRate);
                                $("#timevarianceCellSpan" + activityId).text(timever + '.00');
                                varienceCollect();
                            });
                        }
                    }
                }
            }
        } else {
            e.preventDefault();
        }
    } else {
        e.preventDefault();
    }
}

function updateTimeProperty(e, elm) {
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39) {
        let value = parseInt($(elm).val());
        if ($(elm).val().length < 15) {
            if (validate.isInteger(value)) {
                if (value > -1) {
                    if (code == 13) {
                        e.preventDefault();
                        $(e.target).text(value + ' h');
                        $(e.target).attr('data-val', value);
                        $(e.target).blur();

                        formulafun(e.target);
                        var activityId = $(elm).attr('data-id');
                        var clusteringKey = $(elm).attr('data-createdby');
                        if ($(elm).hasClass('st_ewHour_value')) {
                            $('#timeInputValue' + activityId).text(value);
                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskEHinput';

                            activity.activityUpdate((response) => {
                                var estTime = parseInt(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
                                var estRate = parseInt(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
                                var actualTime = parseInt(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
                                var actualRate = parseInt(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

                                var timever = (estTime * estRate) - (actualTime * actualRate);

                                $("#timevarianceCellSpan" + activityId).text(timever + '.00');

                                varienceCollect();
                            });
                        } else if ($(elm).hasClass('st_awHour_value')) {
                            $('#actualHourCellSpan' + activityId).text(value);
                            const activity = new Activity();
                            activity.activityId = activityId;
                            activity.clusteringKey = clusteringKey;
                            activity.activityUpdateData = value;
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'taskAHinput';

                            activity.activityUpdate((response) => {
                                var estTime = parseInt(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
                                var estRate = parseInt(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
                                var actualTime = parseInt(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
                                var actualRate = parseInt(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

                                var timever = (estTime * estRate) - (actualTime * actualRate);

                                $("#timevarianceCellSpan" + activityId).text(timever + '.00');

                                varienceCollect();
                            });
                        }
                    }
                }
            }
        }
    }
}

function collapseGroup(ev) {
    if ($(ev).text() == 'Collapse this group') {
        $("#thisWeekPluseContainer").slideUp('slideup');
        $("#thisWeekPluseFootContainer").hide();
        $(ev).text('Expand This Group');
    } else {
        $("#thisWeekPluseContainer").slideDown('slidedown');
        $("#thisWeekPluseFootContainer").show();
        $(ev).text('Collapse this group');
    }
}

function idAvailability(id, arr, callback){
    var totalPrio = arr.length;
    if (totalPrio > 0) {
        for (var i = 0; i < totalPrio; i++) {
            if (arr[i].id === id)
                callback(true);
            break;
        }
    }
}

function removeFromBatchArr(id){
    var totalPrio = forBatchPropertis.length;
    if (totalPrio > 0) {
        for (var i = 0; i < totalPrio; i++) {
            if (forBatchPropertis[i].id === id) {
                forBatchPropertis.slice(0, i);
            }
        }
    }
}

function removeFromArr(arry, id){
    var totalPrio = arry.length;
    var tempArr = [];
    if (totalPrio > 0) {
        for (var i = 0; i < totalPrio; i++) {
            if (arry[i].tbl_id === id) {

            } else {
                tempArr.push(arry[i]);
            }
        }
    }

    arry = tempArr;

}

function checkEachSubtask(e, elm) {
    var targetSelector = $(elm).find('.left-indicator-checkbox');

    if (targetSelector.hasClass('left-indicator-checkbox')) {
        if (!targetSelector.hasClass('selected')) {

            targetSelector.addClass('selected');
            targetSelector.parents('.left-indicator-inner').addClass('inClas');
            if ($('#batchProcessing').is(':visible')) {
                $('#batchActionFull').css('display', 'none');
            } else {
                $('#batchActionFull').css('display', 'flex');
            }
            $(elm).find('.row_pluse_count').hide();
            $(elm).find('.left-indicator-checkbox').css('display', 'block');

            var activityid = $(elm).closest('.pulse-component').find('.pulse_title').attr('data-id');
            var createdby = $(elm).closest('.pulse-component').find('.pulse_title').attr('data-createdby');

            if (activityid != "") {
                forBatchPropertis.push({
                    id: activityid,
                    createdby: createdby
                });
            }

        } else {

            targetSelector.removeClass('selected');
            targetSelector.parents('.left-indicator-inner').removeClass('inClas');

            $(elm).find('.row_pluse_count').css('display', 'block');
            $(elm).find('.left-indicator-checkbox').hide();

            var activityid = $(elm).closest('.pulse-component').attr('data-id');
            removeFromBatchArr(activityid);
            // targetSelector.closest('.pulse-left-indicator').css('background-color','#d8d8d8');
            // targetSelector.closest('.pulse-component').find('.status-cell-component .status-label').css('background-color','#d8d8d8');
            // targetSelector.closest('.pulse-component').find('.status-label-container .view_status').text('Initiate');
            // targetSelector.parents('.pulse-left-indicator').attr('data-value','Incomplete');

            // var activityId = $(elm).closest('.pulse-component').find('.pulse_title').attr('data-id');
            // var clusteringKey = $(elm).closest('.pulse-component').find('.pulse_title').attr('data-createdby');

            // const activity = new Activity();
            //       activity.activityId          = activityId;
            //       activity.clusteringKey       = clusteringKey;
            //       activity.activityUpdateData  = '';
            //       activity.activityType        = 'SubTask';
            //       activity.activityUpdateType  = 'taskStatus';

            // activity.activityUpdate((response)=>{
            //     console.log(response);
            // });

        }

        var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
        var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;

        if (totalST !== checkedST) {
            $('#cbx').prop('checked', false);
            // $('#taskStatusSelect').val('Working').trigger('change');


        } else {
            $('#cbx').prop('checked', true);
            // $('#taskStatusSelect').val('Completed').trigger('change');

        }
        var waitingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
        var workingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;
        progressBar(totalST, checkedST);
        multipleProgressBar(totalST, checkedST, waitingST, workingST);
    }
    batchMenuCounter();
    batchMenuCounterFull(elm);
}

function selectAllST(ev) {
    if ($(ev).is(':checked')) {
        $(".property_notes").attr("data-batch_id", "");
        $(".chat-history").html("");
        $('#batchProcessing').show();
        $('.batchButtonSec').show();
        $('.row_pluse_count').hide();
        $('.left-indicator-checkbox').show();

        $('#batchProcessing .batchHeading').html('');
        $('#batchProcessing .batchHeading').html('<h1><span class="b_a_ico"></span> Batch Actions</h1>');
        $('#batchPropertyNotes').attr('data-notetype', 'unpin_batch_note');

        $('.batchButtonSec').html("");
        var html = '<div class="floatingBtn bproperties active" data-value="bproperties" onclick="toggleBatchActions(this)">Properties</div>';
        // html += '<div class="floatingBtn bmsg" data-value="bmsg" onclick="toggleBatchActions(this)">Send Message(s)</div>';
        // html += '<div class="floatingBtn bnote" data-value="bnote" onclick="toggleBatchActions(this)">Note(s)</div>';
        $('.batchButtonSec').html(html);

        var batchid = $('#mainSideBarContent').find('.activeTodo').attr('data-activityid');
        $('.property_notes').attr('data-batch_id', batchid);
        $('.property_notes').hide();
        $('.property-details').show();

        $('.left-indicator-inner').each(function(k, obj) {
            $(obj).addClass('inClas');
        });
        forBatchPropertis = [];
        $('.left-indicator-checkbox').each(function(k, obj) {
            if (!$(obj).hasClass('selected')) {
                $(obj).parent('.left-indicator-inner').trigger('click');
            }

            var activityid = $(obj).closest('.pulse-component').find('.pulse_title').attr('data-id');
            var createdby = $(obj).closest('.pulse-component').find('.pulse_title').attr('data-createdby');

            if (activityid != "") {
                forBatchPropertis.push({
                    id: activityid,
                    createdby: createdby
                });
            }
        });
        // $('#taskStatusSelect').val('Completed').trigger('change');
    } else {
        $('.left-indicator-inner').each(function(k, obj) {

            $(obj).removeClass('inClas');

        });
        $('.left-indicator-checkbox').each(function(k, obj) {
            if ($(obj).hasClass('selected')) {
                $(obj).parent('.left-indicator-inner').trigger('click');
            }
        });
        $('.left-indicator-checkbox').removeClass('selected');
        $('.left-indicator-checkbox').hide();
        $('.row_pluse_count').show();
        $('#batchProcessing').hide();

        forBatchPropertis = [];

        var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
        var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;
        var waitingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
        var workingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;

        progressBar(totalST, checkedST);
        multipleProgressBar(totalST, checkedST, waitingST, workingST);
        // $('#taskStatusSelect').val('Working').trigger('change');
        $('#batchProcessing').hide();
    }
}

function sortObserverCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortObserverTypel == 0) {
        sortObserverTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortObserverTypel == 1) {
        sortObserverTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort().reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortcownCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortCoownerTypel == 0) {
        sortCoownerTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortCoownerTypel == 1) {
        sortCoownerTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort().reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortDateCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortDueDateTypel == 0) {
        sortDueDateTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.datePick').val();
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.datePick').val();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    } else if (sortDueDateTypel == 1) {
        sortDueDateTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.datePick').val();
            titleArray.push(title);
        });

        titleArray.sort().reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.datePick').val();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}


function sorttimevarianceCellCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sorttimevarianceCellTypel == 0) {
        sorttimevarianceCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.timevarianceCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.timevarianceCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    } else if (sorttimevarianceCellTypel == 1) {
        sorttimevarianceCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.timevarianceCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.timevarianceCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }
    
    enabletime();
    keypressBlur();
    countSubtask();
}

function sortvarianceCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortvarianceCellTypel == 0) {
        sortvarianceCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.varianceCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.varianceCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    } else if (sortvarianceCellTypel == 1) {
        sortvarianceCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.varianceCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.varianceCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }
    
    enabletime();
    keypressBlur();
    countSubtask();
}

function sortActualHourRateCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortActualHourRateTypel == 0) {
        sortActualHourRateTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.hourlyRateCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.hourlyRateCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    } else if (sortActualHourRateTypel == 1) {
        sortActualHourRateTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.hourlyRateCellSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.hourlyRateCellSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }
    
    enabletime();
    keypressBlur();
    countSubtask();
}

function sortManHourRateCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortManHourRateTypel == 0) {
        sortManHourRateTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.ManHourRateSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.ManHourRateSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    } else if (sortManHourRateTypel == 1) {
        sortManHourRateTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.ManHourRateSpan').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.ManHourRateSpan').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }
    
    enabletime();
    keypressBlur();
    countSubtask();
}

function ascSort(eve, ele) {
    if ($(eve.target).closest('.frzHandler').find('.aseSort .checkMenu').is(':visible')) {
        $(eve.target).closest('.frzHandler').find('.aseSort .checkMenu').hide();
        $(eve.target).closest('.frzHandler').find('.drag-handle').addClass('icon-dapulse-drag-2').removeClass('sort-amount-down');
        row_pluse_count = 0;
        $("#sortPluseSerial").trigger('click');
    } else {
        $('.aseSort .checkMenu').hide();
        $('.descSort .checkMenu').hide();

        $('.drag-handle').each(function(k, v) {
            $(v).removeAttr('class').addClass('drag-handle icon icon-dapulse-drag-2');
        });

        var position = parseInt($(eve.target).closest('.frzHandler').index()) + 1;

        ascIndex = position;
        descIndex = 0;

        $(eve.target).closest('.frzHandler').find('.drag-handle').removeClass('icon-dapulse-drag-2').addClass('sort-amount-down');

        $(eve.target).closest('.frzHandler').find('.aseSort .checkMenu').show();

        if ($(eve.target).hasClass('aseSort')) {
            var type = $(eve.target).attr('data-type');
        } else {
            var type = $(eve.target).closest('.aseSort').attr('data-type');
        }

        if (type == 'WonerCell') {
            sortWonerCellTypel = 0
            sortWonerCellCol(type);
        } else if (type == 'coowonerCell') {
            sortCoownerTypel = 0;
            sortcownCol(type);
        } else if (type == 'ObserverCell') {
            sortObserverTypel = 0;
            sortObserverCol(type);
        } else if (type == 'AssigneeCell') {
            sortAssigneeCellTypel = 0;
            sortAssigneeCellCol(type);
        } else if (type == 'priorityCell') {
            sortpriorityCellTypel = 0;
            sortpriorityCellCol(type);
        } else if (type == 'DateCell') {
            sortDueDateTypel = 0;
            sortDateCellCol(type);
        } else if (type == 'StatusCell') {
            sortStatusCellTypel = 0;
            sortStatusCellCol(type);
        } else if (type == 'AmountCell') {
            sortAmountCellTypel = 0;
            sortAmountCellCol(type);
        } else if (type == 'actutalCell') {
            sortactualCellTypel = 0;
            sortactualCellCol(type);
        } else if (type == 'ManHourRateCell') {
            sortManHourRateTypel = 0;
            sortManHourRateCellCol(type);
        } else if (type == 'hourlyRateCell') {
            sortActualHourRateTypel = 0;
            sortActualHourRateCellCol(type);
        } else if (type == 'varianceCell') {
            sortvarianceCellTypel = 0;
            sortvarianceCellCol(type);
        } else if (type == 'timevarianceCell') {
            sorttimevarianceCellTypel = 0;
            sorttimevarianceCellCellCol(type);
        } else if (type == 'timeEstCell') {
            sorttimeEstCellTypel = 0;
            sorttimeEstCellCol(type);
        } else if (type == 'actualHourCell') {
            sortactualHourCellTypel = 0;
            sortactualHourCellCol(type);
        } else if (type == 'name-cell') {
            titlecelltyl = 0;
            sortTitleCol(type);
        }
    }

    var setVal = $(ele).attr('data-setval');
    var setId = $(ele).attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        } else {
            var dVal = '4';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = $(ele).attr('id');
        activity.activityCreatedBy = user_id;
        activity.clusteringKey = 'sort';

        activity._setting((response) => {
            console.log(response);
            $('.dynamicSort').each((k, v) => {
                $(v).attr('data-setval', '4');
                $(v).attr('data-setid', response._setting_response.settingid);
            });
        });
    }
}

function sortPluseSerial(ele) {
    var type = $(ele).attr('data-type');
    var con_aray = [];
    var titleArray = [];

    $('.drag-handle').removeClass('sort-amount-up').removeClass('sort-amount-down').addClass('icon-dapulse-drag-2');

    ascIndex = 0;
    descIndex = 0;

    $('.aseSort .checkMenu').hide();
    $('.descSort .checkMenu').hide();

    if (row_pluse_count == 0) {
        $(ele).addClass('rotate');

        row_pluse_count = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).text();
            if (title != '') {
                titleArray.push(title);
            }

        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;

        $("#thisWeekPluseContainer").append(SubtaskClone.varience());

        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (row_pluse_count == 1) {

        $(ele).removeClass('rotate');
        row_pluse_count = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).text();
            if (title != '') {
                titleArray.push(title);
            }
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function descSort(eve, ele) {
    if ($(eve.target).closest('.frzHandler').find('.descSort .checkMenu').is(':visible')) {
        $(eve.target).closest('.frzHandler').find('.descSort .checkMenu').hide();
        $(eve.target).closest('.frzHandler').find('.drag-handle').addClass('icon-dapulse-drag-2').removeClass('sort-amount-up');
        row_pluse_count = 0;
        $("#sortPluseSerial").trigger('click');
    } else {
        $('.aseSort .checkMenu').hide();
        $('.descSort .checkMenu').hide();

        $('.drag-handle').each(function(k, v) {
            $(v).removeAttr('class').addClass('drag-handle icon icon-dapulse-drag-2');
        });

        var position = parseInt($(eve.target).closest('.frzHandler').index()) + 1;
        $(eve.target).closest('.frzHandler').find('.drag-handle').removeClass('icon-dapulse-drag-2').addClass('sort-amount-up');

        $(eve.target).closest('.frzHandler').find('.descSort .checkMenu').show();
        descIndex = position;
        ascIndex = 0;

        if ($(eve.target).hasClass('descSort')) {
            var type = $(eve.target).attr('data-type');
        } else {
            var type = $(eve.target).closest('.descSort').attr('data-type');
        }

        if (type == 'WonerCell') {
            sortWonerCellTypel = 1;
            sortWonerCellCol(type);
        } else if (type == 'coowonerCell') {
            sortCoownerTypel = 1;
            sortcownCol(type);
        } else if (type == 'ObserverCell') {
            sortObserverTypel = 1;
            sortObserverCol(type);
        } else if (type == 'AssigneeCell') {
            sortAssigneeCellTypel = 1;
            sortAssigneeCellCol(type);
        } else if (type == 'priorityCell') {
            sortpriorityCellTypel = 1;
            sortpriorityCellCol(type);
        } else if (type == 'DateCell') {
            sortDueDateTypel = 1;
            sortDateCellCol(type);
        } else if (type == 'StatusCell') {
            sortStatusCellTypel = 1;
            sortStatusCellCol(type);
        } else if (type == 'AmountCell') {
            sortAmountCellTypel = 1;
            sortAmountCellCol(type);
        } else if (type == 'actutalCell') {
            sortactualCellTypel = 1;
            sortactualCellCol(type);
        } else if (type == 'ManHourRateCell') {
            sortManHourRateTypel = 1;
            sortManHourRateCellCol(type);
        } else if (type == 'hourlyRateCell') {
            sortActualHourRateTypel = 0;
            sortActualHourRateCellCol(type);
        } else if (type == 'varianceCell') {
            sortvarianceCellTypel = 1;
            sortvarianceCellCol(type);
        } else if (type == 'timevarianceCell') {
            sorttimevarianceCellTypel = 1;
            sorttimevarianceCellCellCol(type);
        } else if (type == 'timeEstCell') {
            sorttimeEstCellTypel = 1;
            sorttimeEstCellCol(type);
        } else if (type == 'actualHourCell') {
            sortactualHourCellTypel = 1;
            sortactualHourCellCol(type);
        } else if (type == 'name-cell') {
            titlecelltyl = 1;
            sortTitleCol(type);
        }

    }

    var setVal = $(ele).attr('data-setval');
    var setId = $(ele).attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        } else {
            var dVal = '4';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = $(ele).attr('id');
        activity.activityCreatedBy = user_id;
        activity.clusteringKey = 'sort';

        activity._setting((response) => {
            $('.dynamicSort').each((k, v) => {
                $(v).attr('data-setval', '4');
                $(v).attr('data-setid', response._setting_response.settingid);
            });
        });
    }
}

function sortTitleCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (titlecelltyl == 0) {
        titlecelltyl = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.pulse_title').text();
            if (title != '') {
                titleArray.push(title);
            }
        });

        titleArray.sort();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.pulse_title').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (titlecelltyl == 1) {
        titlecelltyl = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.pulse_title').text();
            if (title != '') {
                titleArray.push(title);
            }
        });
        titleArray.sort().reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.pulse_title').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortWonerCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortWonerCellTypel == 0) {
        sortWonerCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortWonerCellTypel == 1) {
        sortWonerCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });
        titleArray.sort().reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortpriorityCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortpriorityCellTypel == 0) {
        sortpriorityCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.view_priority').text();
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.view_priority').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortpriorityCellTypel == 1) {
        sortpriorityCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.view_priority').text();
            titleArray.push(title);
        });

        titleArray.sort().reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.view_priority').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortStatusCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortStatusCellTypel == 0) {
        sortStatusCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.view_status').text();
            titleArray.push(title);
        });

        titleArray.sort();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.view_status').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortStatusCellTypel == 1) {
        sortStatusCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.view_status').text();
            titleArray.push(title);
        });

        titleArray.sort().reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.view_status').text();
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());
        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sorttimeEstCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sorttimeEstCellTypel == 0) {
        sorttimeEstCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.timeInputValue').attr('data-val');
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.timeInputValue').attr('data-val');
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sorttimeEstCellTypel == 1) {
        sorttimeEstCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.timeInputValue').attr('data-val');
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.timeInputValue').attr('data-val');
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();

}
function sortactualHourCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortactualHourCellTypel == 0) {
        sortactualHourCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.actualHourCellSpan').attr('data-val');
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.actualHourCellSpan').attr('data-val');
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortactualHourCellTypel == 1) {
        sortactualHourCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.actualHourCellSpan').attr('data-val');
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.actualHourCellSpan').attr('data-val');
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();

}

function sortactualCellCol(type) {

    var con_aray = [];
    var titleArray = [];

    if (sortactualCellTypel == 0) {
        sortactualCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = (validate.isEmpty($(obj).find('.amountInputValue').text()) ? 0 : $(obj).find('.amountInputValue').text());
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = (validate.isEmpty($(obj).find('.amountInputValue').text()) ? 0 : $(obj).find('.amountInputValue').text());
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortactualCellTypel == 1) {
        sortactualCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = (validate.isEmpty($(obj).find('.amountInputValue').text()) ? 0 : $(obj).find('.amountInputValue').text());
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = (validate.isEmpty($(obj).find('.amountInputValue').text()) ? 0 : $(obj).find('.amountInputValue').text());
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortAmountCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortAmountCellTypel == 0) {
        sortAmountCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.amountInputValue').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        });
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.amountInputValue').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortAmountCellTypel == 1) {
        sortAmountCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.amountInputValue').text();
            titleArray.push(parseInt(title));
        });

        titleArray.sort(function(num1, num2) {
            return num1 - num2;
        }).reverse();
        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.amountInputValue').text();
                if (v === parseInt(title)) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

function sortAssigneeCellCol(type) {
    var con_aray = [];
    var titleArray = [];

    if (sortAssigneeCellTypel == 0) {
        sortAssigneeCellTypel = 1;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);

    } else if (sortAssigneeCellTypel == 1) {
        sortAssigneeCellTypel = 0;
        $('.' + type).each(function(k, obj) {
            var title = $(obj).find('.person-bullet-component img').attr('title');
            titleArray.push(title);
        });

        titleArray.sort().reverse();

        $.each(titleArray, function(k, v) {
            $('.' + type).each(function(k, obj) {
                var title = $(obj).find('.person-bullet-component img').attr('title');
                if (v === title) {
                    var p_div = $(obj).closest('.pulse-component');
                    con_aray.push(p_div);
                }
            });
        });

        var htm = $("#OnlyForClone").clone();

        $("#thisWeekPluseContainer").html('');

        $.each(con_aray, function(k, v) {
            $("#thisWeekPluseContainer").append(v);
        });

        SubtaskClone.flexSize = $('.cell-component').length * 120 + 460;
        $("#thisWeekPluseContainer").append(SubtaskClone.varience());
        $("#thisWeekPluseContainer").append(SubtaskClone.draw());

        $('#addnewSub').before(htm);
        checkActivityAccessibilities(user_id);
    }

    enabletime();
    keypressBlur();
    countSubtask();
}

$(".workspaceform").on('scroll', function(event) {
    if (event.currentTarget.scrollLeft > 0) {
        if (!$('.status-picker-wrapper').is(':visible') && !$('.priority-picker-wrapper').is(':visible')) {
            $('.group-header-component .name-column-header').addClass('heading');
            $('.pulse-component .name-cell').addClass('heading');
            $('.flex_heading').css('z-index', '100');
            $('.name-cell').css('z-index', '101');
            $('.flex_heading').first().css('z-index', '101');
            $('.cell-component').css('z-index', '0');
            $('.name-cell').css('z-index', '101');
        }
    }
});

function innerOpen(id) {
    if ($("#" + id).is(':visible')) {
        $("#" + id).hide();
    } else {
        $("#" + id).show();
    }
}

function restrict(root) {
    var permissionPopUp = $('#' + root + '_lock').parents('.title-wrapper').siblings('.col_permission_setting');

    $('.dialog-node').hide();
    $('.inner_menu').hide();
    $('.header_menu_btn').removeClass('drop_active');

    $('.col_permission_setting').find('.s_userlist').html('');
    $.each(workspace_user, function(k, v) {
        if (observer.indexOf(v.id.toString()) > -1) {
            var id = v.id;
            var img = v.img;
            var fullname = v.fullname;
            var usersDesign = '<div style="width: 100%;" data-uid="' + v.id + '" class="usersList" id="subtask_' + id + '" onclick="addForEdit(\'' + id + '\',\'' +
                img + '\')">';
            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname +
                '" alt="' + v.fullname + '">';
            if ($("#actCre").val() == v) {
                usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
            } else {
                usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
            }
            usersDesign += '</div>';
            $('.col_permission_setting').find('.s_userlist').append(usersDesign);
        }

    });

    if ($('#' + root + '_lock').is(':visible')) {
        $('#' + root + '_lock').hide();
        permissionPopUp.hide();
        socket.emit('restrictColumn', {
            rootid: root,
            status: 'hide'
        }, function(response) {
            console.log(6169, response)

        });
    } else {
        $('#' + root + '_lock').show();
        permissionPopUp.show();
        socket.emit('restrictColumn', {
            rootid: root,
            status: 'show'
        }, function(response) {
            console.log(6180, response)
        });
    }
}

socket.on('restrictColumnBrd', function(data) {
    if (data.status == 'show') {

        $('#' + data.rootid + '_lock').show();

        if (data.rootid == "ownerClass") {
            $('.WonerCell').css('pointer-events', 'none');
        }

        if (data.rootid == "Co_ownerClass") {
            $('.coowonerCell').css('pointer-events', 'none');
        }

        if (data.rootid == "Observer") {
            $('.ObserverCell').css('pointer-events', 'none');
        }

        if (data.rootid == "assignClass") {
            $('.AssigneeCell').css('pointer-events', 'none');
        }

        if (data.rootid == "priorityClass") {
            $('.priorityCell').css('pointer-events', 'none');
        }

        if (data.rootid == "dateClass") {
            $('.DateCell').css('pointer-events', 'none');
        }

        if (data.rootid == "timeEstClass") {
            $('.timeEstCell').css('pointer-events', 'none');
        }

        if (data.rootid == "mh_cost") {
            $('.ManHourRateCell').css('pointer-events', 'none');
        }

        if (data.rootid == "hourlyClass") {
            $('.hourlyRateCell').css('pointer-events', 'none');
        }

        if (data.rootid == "BudgetClass") {
            $('.AmountCell').css('pointer-events', 'none');
        }

        if (data.rootid == "actualClass") {
            $('.actualCell').css('pointer-events', 'none');
        }

        if (data.rootid == "varianceClass") {
            $('.varianceCell').css('pointer-events', 'none');
        }

        if (data.rootid == "statusClass") {
            $('.StatusCell').css({
                'pointer-events': 'none'
            });
        }

    } else {

        $('#' + data.rootid + '_lock').hide();

        if (data.rootid == "ownerClass") {
            $('.WonerCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "Co_ownerClass") {
            $('.coowonerCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "Observer") {
            $('.ObserverCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "assignClass") {
            $('.AssigneeCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "priorityClass") {
            $('.priorityCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "dateClass") {
            $('.DateCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "timeEstClass") {
            $('.timeEstCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "mh_cost") {
            $('.ManHourRateCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "hourlyClass") {
            $('.hourlyRateCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "BudgetClass") {
            $('.AmountCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "actualClass") {
            $('.actualCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "varianceClass") {
            $('.varianceCell').css('pointer-events', 'auto');
        }

        if (data.rootid == "statusClass") {
            $('.StatusCell').css({
                'pointer-events': 'auto'
            });
        }
    }
});

function restrictColumnView(view) {

    var viewCellPop = $('#' + view + '_eye').parents('.title-wrapper').siblings('.col_permission_setting');
    $('.dialog-node').hide();
    $('.inner_menu').hide();
    $('.header_menu_btn').removeClass('drop_active');

    if ($('#' + view + '_eye').is(':visible')) {
        $('#' + view + '_eye').hide();
        viewCellPop.hide();
        socket.emit('restrictView', {
            viewid: view,
            status: 'hide'
        }, function(response) {

        });
    } else {
        $('#' + view + '_eye').show();
        viewCellPop.show();
        socket.emit('restrictView', {
            viewid: view,
            status: 'show'
        }, function(response) {

        });
    }
}

socket.on('restrictViewBrd', function(data) {
    if (data.status == 'show') {
        $('#' + data.viewid + '_eye').show();

        if (data.viewid == 'ownerClass') {
            $('.' + data.viewid).css('display', 'none');
            $('.WonerCell').css('display', 'none');
        }

        if (data.viewid == 'Co_ownerClass') {
            $('.' + data.viewid).css('display', 'none');
            $('.coowonerCell').css('display', 'none');
        }

        if (data.viewid == "Observer") {
            $('.' + data.viewid).css('display', 'none');
            $('.ObserverCell').css('display', 'none');
        }

        if (data.viewid == "assignClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.AssigneeCell').css('display', 'none');
        }

        if (data.viewid == "priorityClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.priorityCell').css('display', 'none');
        }

        if (data.viewid == "dateClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.DateCell').css('display', 'none');
        }

        if (data.viewid == "timeEstClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.timeEstCell').css('display', 'none');
        }

        if (data.viewid == "mh_cost") {
            $('.' + data.viewid).css('display', 'none');
            $('.ManHourRateCell').css('display', 'none');
        }

        if (data.viewid == "hourlyClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.hourlyRateCell').css('display', 'none');
        }

        if (data.viewid == "BudgetClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.AmountCell').css('display', 'none');
        }

        if (data.viewid == "actualClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.actualCell').css('display', 'none');
        }

        if (data.viewid == "varianceClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.varianceCell').css('display', 'none');
        }

        if (data.viewid == "statusClass") {
            $('.' + data.viewid).css('display', 'none');
            $('.StatusCell').css('display', 'none');
        }

    } else {

        $('#' + data.viewid + '_eye').hide();

        if (data.viewid == 'ownerClass') {
            $('.' + data.viewid).css('display', 'block');
            $('.WonerCell').css('display', 'block');
        }

        if (data.viewid == 'Co_ownerClass') {
            $('.' + data.viewid).css('display', 'block');
            $('.coowonerCell').css('display', 'block');
        }

        if (data.viewid == "Observer") {
            $('.' + data.viewid).css('display', 'block');
            $('.ObserverCell').css('display', 'block');
        }

        if (data.viewid == "assignClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.AssigneeCell').css('display', 'block');
        }

        if (data.viewid == "priorityClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.priorityCell').css('display', 'block');
        }

        if (data.viewid == "dateClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.DateCell').css('display', 'block');
        }

        if (data.viewid == "timeEstClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.timeEstCell').css('display', 'block');
        }

        if (data.viewid == "mh_cost") {
            $('.' + data.viewid).css('display', 'block');
            $('.ManHourRateCell').css('display', 'block');
        }

        if (data.viewid == "hourlyClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.hourlyRateCell').css('display', 'block');
        }

        if (data.viewid == "BudgetClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.AmountCell').css('display', 'block');
        }

        if (data.viewid == "actualClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.actualCell').css('display', 'block');
        }

        if (data.viewid == "varianceClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.varianceCell').css('display', 'block');
        }

        if (data.viewid == "statusClass") {
            $('.' + data.viewid).css('display', 'block');
            $('.StatusCell').css('display', 'block');
        }

    }
});

function lockClick(id) {
    if ($("#" + id).closest('.column-header-inner').find('.col_permission_setting').is(':visible')) {
        $("#" + id).closest('.column-header-inner').find('.col_permission_setting').hide();
    } else {
        $("#" + id).closest('.column-header-inner').find('.col_permission_setting').show();
    }
}

$('.search_persion_input').on('focusin', function(eve) {

});

$('.search_persion_input').on('keyup', function(eve) {
    var value = $(this).val();
    if (eve.keyCode !== 40 && eve.keyCode !== 38) {

        $(eve.target).closest('.col_permission_setting').find('.s_userlist .usersList .name_label').each(function() {
            if ($(this).text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(this).parent('.usersList').show();
                $(this).parent('.usersList').addClass('showEl');
            } else {
                $(this).parent('.usersList').hide();
                $(this).parent('.usersList').removeClass('showEl');
            }
        });

        $(eve.target).closest('.col_permission_setting').find('.s_userlist .usersList .name_label').unhighlight();
        $(eve.target).closest('.col_permission_setting').find('.s_userlist .usersList .name_label').highlight(value);
    }

});

$('.search_persion_input').on('focusout', function(eve) {
    //$(eve.target).closest('.col_permission_setting').find('.s_userlist').slideUp();
});

function showFilesList(event, elm) {
    var stid = [$(elm).parents('.pulse-component').attr('data-id')];
    find_unread_note_count(stid, user_id, 'subtask');

    $('body').find(':focus').blur();

    onscrollevent = 0;
    let pgHeight = $('#right-section-area').height();
    var elmHeight = $(elm).next('.subtaskAllFile').height();
    let x = $(event.target).offset();
    let actHeight = pgHeight - x.top;
    let top = x.top + 30;
    let left = x.left - 87;

    if (actHeight < elmHeight) {

        $(elm).next('.subtaskAllFile').css({
            'top': top - elmHeight - 60 + 'px',
            'left': left + 'px'
        }).addClass('fliped');
    } else {
        $(elm).next('.subtaskAllFile').css({
            'top': top + 'px',
            'left': left + 'px'
        }).removeClass('fliped');
    }


    var tarGet = $(elm).next('.subtaskAllFile')
    $(".workspaceform").scrollLeft(0);
    $('.pulse-component .name-cell').removeClass('heading');
    $('.pulse-component .WonerCell').removeClass('heading2');

    if (tarGet.is(':visible')) {
        $(elm).removeClass('active_files')
        tarGet.hide();
        lowZindex('high');
        insScrollTop = $('.workspaceform').scrollTop();
    } else {
        $(elm).addClass('active_files')
        $('.subtaskAllFile').fadeOut()

        if ($('.pulse-component').length < 10) {
            // scrollToBottom('.workspaceform');
        }
        tarGet.show();
        lowZindex('low');
        insScrollTop = $('.workspaceform').scrollTop();
    }

    $('.flex_heading:not(#addnewSub .cell-component)').css('z-index', '0');
    $('.cell-component:not(#addnewSub .cell-component)').css('z-index', '0');

    $(elm).closest('.flex_heading').css('z-index', '1');
    $(elm).closest('.cell-component').css('z-index', '1');

}

function openSubtaskChat(id) {
    var activity_id = id;
    if (typeof activity_id == 'undefined') {
        alert("please select a todo, then click here");
    } else {
        var room_title = $('#pulse_' + activity_id).find('.name-cell .pulse_title').text();
        $('.todo_chat_room_title').html(room_title);
        if ($('#pulse_' + activity_id).find(".more_files").hasClass("newNoti")) {
            $('#pulse_' + activity_id).find(".more_files").removeClass("newNoti");
            $('#pulse_' + activity_id).find(".subtask_chat").attr("data-unseen", "");
        }

        $('.batchButtonSec').find('.floatingBtn').removeClass('active');
        $('.batchButtonSec .pmsg').addClass('active');
        $('.property-details').hide();
        $('.property_notes').show();
        $('.st_note').hide();
        $('.st_chat').show();

        var arg_data = {
            activity_id: activity_id,
            user_id: user_id
        };

        var has_reply_msgid = [];
        socket.emit('find_todo_chat_history', arg_data, (res_data) => {
            $('.chat-history').html('');
            var numsl = []; // need_update_message_seen_list
            if (res_data.status) {
                $('.chatEmptyMsg').remove();
                $('.chat-history').html('');
                $.each(res_data.conversation, function(k, v) {
                    if (v.msg_status == null) {
                        if (v.sender == user_id) {
                            // This msg send by this user; so no need to change any seen status
                        } else {
                            // This msg receive by this user; so need to change seen status
                            numsl.push(v.msg_id);
                        }
                    }
                    // If msg status have some user id, then
                    else {
                        if (v.msg_status.indexOf(user_id) > -1) {
                            // This msg already this user seen
                        } else {
                            if (v.sender != user_id) {
                                // This msg receive by this user; so need to change seen status
                                numsl.push(v.msg_id);
                            }
                        }
                    }

                    if (numsl.length == 1)
                        draw_urhr();
                    if (v.has_reply > 0)
                        has_reply_msgid.push(v.msg_id);

                    per_todo_msg(v, true);
                });

                // scrollToBottom('.todo-chat-body');

                if (numsl.length > 1)
                    find_urhr_add_s(numsl.length);

                if (numsl.length > 0) {
                    var arg_data2 = {
                        msgids: numsl,
                        user_id: user_id,
                        activity_id: activity_id
                    };
                    socket.emit('update_todo_msg_status', arg_data2);
                }
            } else {
                if ($('.chatEmptyMsg').length < 1)
                    $('.st_chat').append('<h3 class="chatEmptyMsg" style="text-align: center;padding-top: 33%;">No messages found in this thread !</h3>');
            }
        });
    }
}

function onkeydownoff(event) {
    var code = event.charCode || event.keyCode || event.which;
    if (code == 8) {
        event.preventDefault();
        var str = $("#formula_str").text().trim();
        var repstr = title_formula.join("");
        if (str == repstr) {
            backone();
        } else {
            $("#formula_str").html(title_formula.join(""));
        }
        var el = document.getElementById("formula_str");
        placeCaretAtEnd(el);
    } else if (code == 37 || code == 39 || code == 36) {
        event.preventDefault();
        return false;
    }
}

function fildhelperon(event) {
    var code = event.charCode || event.keyCode || event.which;
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (code == 38) {
        if ($("#fildnamehelper li.active").prev().length == 0) {
            $("#fildnamehelper li.active").removeClass('active');
            $("#fildnamehelper li").last().addClass('active');
        } else {
            $("#fildnamehelper li.active").removeClass('active').prev().addClass('active');
        }
    } else if (code == 40) {
        if ($("#fildnamehelper li.active").next().length == 0) {
            $("#fildnamehelper li.active").removeClass('active');
            $("#fildnamehelper li").first().addClass('active');
        } else {
            $("#fildnamehelper li.active").removeClass('active').next().addClass('active');
        }
    } else if (code == 13) {
        $("#fildnamehelper li.active").trigger('click');
        var el = document.getElementById("formula_str");
        placeCaretAtEnd(el);
    } else {
        var html = "";
        var str = fullhtml = $("#formula_str").text().trim();
        var repstr = title_formula.join("");
        if (formula.length > 0) {
            $.each(title_formula, function(tk, tv) {
                str = str.replace(tv, "");
            });
        }

        if (str == "+" || str == "-" || str == "*" || str == "/" || str == "(" || str == ")") {
            formula.push(str);
            title_formula.push(str);
            $("#signli").hide();
            $("#fildnameli").show();
            $("#formula_str").focus();
            $("#formula_str").html(title_formula.join(""));
            var el = document.getElementById("formula_str");
            placeCaretAtEnd(el);
            error_alert();
        } else {
            str = str.toLowerCase();
            if (str != "") {
                $.each($(".include_rule"), function(k, v) {
                    var flstr = $(v).find(".editableCon").text().toLowerCase();
                    if (flstr.indexOf(str) > -1) {
                        html += "<li data-val='" + $(v).attr("data-id") + "' onclick='selectfield(event)'>";
                        html += $(v).find(".editableCon").text();
                        html += "</li>";
                    }
                });
                $("#fildnamehelper").html(html);
                $("#fildnamehelper li").first().addClass("active");
                if (html == "") {
                    $("#formula_str").css("border-color", "#900000");
                } else {
                    error_alert();
                }
            }
        }
    }
}

function selectfield(event) {
    $("#formula_str").css("border-color", "#DDD");
    $("#fildnamehelper li").removeClass("active");
    $(event.target).addClass("active");
    addtoformula(event);
    $("#fildnamehelper").html("");
}

function haserror() {
    if ($("#newcolname").val() == "") {
        alert("Please add a title");
        $("#newcolname").focus();
        return true;
    } else if (formula.length > 2) {
        var ele = $(".pulse-component-wrapper>.pulse-component");
        var str_formula = result = "";
        $.each(formula, function(fk, fv) {
            str_formula += fv + "@";
            if (fv.indexOf("also") != -1) {
                var a = $(ele[0]).find('.' + fv);
                result += $(a).find('.timeInputValue, .amountInputValue').text().replace(' h', '');
            } else if (fv == "%")
                result += "/100";
            else result += fv;
        });
        try {
            eval(result);
            return false;
        } catch {
            alert("Syntax Error 6877");
            $("#formula_str").css("border-color", "#900000");
            return true;
        }
    }
}

function addtoformula(event) {
    $("#formula_str").css("border-color", "#ddd");
    var val = $(event.target).attr("data-val");
    var str = $(event.target).text();
    if (!isNaN(formula[formula.length - 1]) && isNaN(val))
        formula.push("*");
    else if (formula.length > 0) {
        if (val.indexOf("also") > -1 && (formula[formula.length - 1]).indexOf("also") > -1) {
            formula.push("*"); // A*B
            title_formula.push("*");
        } else if (!isNaN(formula[formula.length - 1]) && !isNaN(val)) {
            formula[formula.length - 1] = formula[formula.length - 1] + val;
            title_formula.push(str);
            return 0;
        } else if ((formula[formula.length - 1]).indexOf("also") > -1 && !isNaN(val)) {
            alert("Syntax Error 6903");
            return 0;
        } else if (val.indexOf("also") == -1 && formula.length > 0) {
            console.log("Old one is: " + formula[formula.length - 1]);
            console.log("New one is: " + val);
        }
    }
    formula.push(val);
    title_formula.push(str);
    if (val.indexOf("also") > -1) {
        $("#fildnameli").hide();
        $("#signli").show();
    } else {
        $("#signli").hide();
        $("#fildnameli").show();
    }
    $("#formula_str").focus();
    $("#formula_str").html(title_formula.join(""));
    var el = document.getElementById("formula_str");
    placeCaretAtEnd(el);
    error_alert();
}

function addnewcolumn_popup() {
    if ($("#addnewcolumn").is(':visible'))
        $("#addnewcolumn").hide();
    else {
        $("#newcolname").val("");
        $("#addnewcolumn").show();
        $("#createcolumn_advance").hide();
        $("#formula_str").html("");
        $('input[type=radio][name=columntype]').prop('checked', false);
        $("#columna").html(existing_column());
        $("#signli").hide();
        $("#fildnameli").show();
        $("#newcolname").focus();
        formula = [];
        title_formula = [];
        var ele = $("#openAddMenu");
        openAddMenu(ele);
        $('input[type=radio][name=columntype]').change(function() {
            if (this.value == 'Formula') $("#createcolumn_advance").show();
            else $("#createcolumn_advance").hide();
        });
    }
}

function existing_column() {
    var html = "<select>";
    html += "<option value='0'>Select Column</option>";
    $.each($(".include_rule"), function(k, v) {
        html += "<option value='" + $(v).attr("data-id") + "'>";
        html += $(v).find(".editableCon").text();
        html += "</option>";
    });
    html += "</select>";
    return html;
}

function backone() {
    formula.splice(-1, 1);
    title_formula.splice(-1, 1);
    $("#formula_str").html(title_formula.join(""));
    $('#formula_str').focus();
    var el = document.getElementById("formula_str");
    placeCaretAtEnd(el);
    error_alert();
}

function clearall() {
    $('#formula_str').html('');
    formula = [];
    title_formula = [];
    $('#formula_str').focus();
    $("#signli").hide();
    $("#fildnameli").show();
    var el = document.getElementById("formula_str");
    placeCaretAtEnd(el);
}

function addnewcolumn() {
    // if(haserror()) return false;

    var newcolumnname = $("#newcolname").val().trim();
    var alsosl = $(".include_rule").length + 1;

    var col_formula = (formula.length > 0 ? formula.join('@') : '');

    const activity = new Activity();

    activity.activityId = $("#updateAction").val();
    activity.activityColTitle = newcolumnname;
    activity.activityColType = $('input[name=columntype]:checked').val();
    activity.activityColFormula = col_formula;
    activity.activityCreatedBy = user_id;

    var activityCreatedBy = (!validate.isEmpty(activity.activityCreatedBy) ? true : false);


    if (activityCreatedBy) {
        activity.saveCustomCol((response) => {
            console.log(response);
        });
    }

    if (newcolumnname != "") {
        var include_rule = "";
        if ($('input[name=columntype]:checked').val() != "Text") {
            include_rule = "include_rule ";
            $("#fildnameli").append("<li data-val='alsonewcol" + alsosl + "' onclick='addtoformula(event)'>" + newcolumnname + "</li>");
        }
        var html = '<div class="frzHandler column-header newcol newcolClass ' + include_rule + ' amount-header ui-resizable" data-id="alsonewcol' + alsosl + '" data-size="flex-basis: 100px" style="flex-basis: 120px;">';
        html += '<i class="icon icon-v2-collapse-column expand-column"></i>';
        html += '<div class="column-header-inner">';
        html += '<div class="dragColumn ui-sortable-handle" style="width: 8px;">';
        html += '<span class="drag-handle icon icon-dapulse-drag-2"></span>';
        html += '</div>';
        html += '<div class="title-wrapper">';
        html += '<span class="column-title ">';
        html += '<div class="ds-editable-component  " style="width: auto; height: auto;">';
        html += '<div class="ds-text-component" dir="auto">';
        html += '<svg class="svg-inline--fa fa-lock fa-w-14" id="varianceClass_lock" onclick="lockClick($(this).attr(\'id\'))" aria-hidden="true" data-prefix="fa" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>';
        html += '<svg class="svg-inline--fa fa-eye-slash fa-w-18" id="varianceClass_eye" aria-hidden="true" data-prefix="fa" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M286.693 391.984l32.579 46.542A333.958 333.958 0 0 1 288 440C168.19 440 63.031 376.051 6.646 280.369a47.999 47.999 0 0 1 0-48.739c24.023-40.766 56.913-75.775 96.024-102.537l57.077 81.539C154.736 224.82 152 240.087 152 256c0 74.736 60.135 135.282 134.693 135.984zm282.661-111.615c-31.667 53.737-78.747 97.46-135.175 125.475l.011.015 41.47 59.2c7.6 10.86 4.96 25.82-5.9 33.42l-13.11 9.18c-10.86 7.6-25.82 4.96-33.42-5.9L100.34 46.94c-7.6-10.86-4.96-25.82 5.9-33.42l13.11-9.18c10.86-7.6 25.82-4.96 33.42 5.9l51.038 72.617C230.68 75.776 258.905 72 288 72c119.81 0 224.969 63.949 281.354 159.631a48.002 48.002 0 0 1 0 48.738zM424 256c0-75.174-60.838-136-136-136-17.939 0-35.056 3.473-50.729 9.772l19.299 27.058c25.869-8.171 55.044-6.163 80.4 7.41h-.03c-23.65 0-42.82 19.17-42.82 42.82 0 23.626 19.147 42.82 42.82 42.82 23.65 0 42.82-19.17 42.82-42.82v-.03c18.462 34.49 16.312 77.914-8.25 110.95v.01l19.314 27.061C411.496 321.2 424 290.074 424 256zM262.014 356.727l-77.53-110.757c-5.014 52.387 29.314 98.354 77.53 110.757z"></path></svg>';
        html += '<span contenteditable="true" class="editableCon">' + newcolumnname + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</span>';
        html += '</div>';
        html += '<div class="drop-menu-wrapper header_menu_btn" onclick="openDropMenu(\'varianceDropDownMenu\')">';
        html += '<svg class="svg-inline--fa fa-caret-down fa-w-10 dropDown" aria-hidden="true" data-prefix="fa" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
        html += '</div>';
        html += '<div class="col_permission_setting">';
        html += '<h3 class="permission_pop_title">Who can view this column</h3>';
        html += '<input class="search_persion_input" type="text" placeholder="Entre a person name">';
        html += '<div class="s_userlist"></div>';
        html += '<div class="granted_person_list">';
        html += '</div>';
        html += '</div>';
        html += '<div class="dialog-node" id="varianceDropDownMenu" style="display: none;">';
        html += '<div class="column-menu-dialog-wrapper">';
        html += '<span class="column-menu-patch"></span>';
        html += '<div class="ds-menu-inner">';
        html += '<div class="ds-menu-section ">';
        html += '<div class="ds-menu-item" onclick="collapse(event,this)">';
        html += '<div class="ds-icon"><i class="icon icon-v2-collapse-column"></i></div>';
        html += '<span class="ds-title">Collapse Column</span>';
        html += '</div>';
        html += '<div class="inner_menu" id="VarianceInner">';
        html += '<div class="ds-menu-item" onclick="restrict(\'varianceClass\')">';
        html += '<div class="ds-icon"><svg class="svg-inline--fa fa-lock fa-w-14" aria-hidden="true" data-prefix="fa" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>';
        html += '</div>';
        html += '<span class="ds-title">Restrict column edit</span>';
        html += '</div>';
        html += '<div class="ds-menu-item" onclick="restrictColumnView(\'varianceClass\')">';
        html += '<div class="ds-icon"><svg class="svg-inline--fa fa-eye-slash fa-w-18" aria-hidden="true" data-prefix="fa" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M286.693 391.984l32.579 46.542A333.958 333.958 0 0 1 288 440C168.19 440 63.031 376.051 6.646 280.369a47.999 47.999 0 0 1 0-48.739c24.023-40.766 56.913-75.775 96.024-102.537l57.077 81.539C154.736 224.82 152 240.087 152 256c0 74.736 60.135 135.282 134.693 135.984zm282.661-111.615c-31.667 53.737-78.747 97.46-135.175 125.475l.011.015 41.47 59.2c7.6 10.86 4.96 25.82-5.9 33.42l-13.11 9.18c-10.86 7.6-25.82 4.96-33.42-5.9L100.34 46.94c-7.6-10.86-4.96-25.82 5.9-33.42l13.11-9.18c10.86-7.6 25.82-4.96 33.42 5.9l51.038 72.617C230.68 75.776 258.905 72 288 72c119.81 0 224.969 63.949 281.354 159.631a48.002 48.002 0 0 1 0 48.738zM424 256c0-75.174-60.838-136-136-136-17.939 0-35.056 3.473-50.729 9.772l19.299 27.058c25.869-8.171 55.044-6.163 80.4 7.41h-.03c-23.65 0-42.82 19.17-42.82 42.82 0 23.626 19.147 42.82 42.82 42.82 23.65 0 42.82-19.17 42.82-42.82v-.03c18.462 34.49 16.312 77.914-8.25 110.95v.01l19.314 27.061C411.496 321.2 424 290.074 424 256zM262.014 356.727l-77.53-110.757c-5.014 52.387 29.314 98.354 77.53 110.757z"></path></svg>';
        html += '</div>';
        html += '<span class="ds-title">Restrict column view</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>';
        html += '</div>';
        $(".group-header-component .column-header:last").after(html);

        $.each($(".pulse-component-wrapper>.pulse-component"), function(k, v) {
            if ($(v).attr("id") != "addnewSub") {
                var newcol_length = $(v).find('.newcolCell').length;
                html = '<div id="newcol' + k + '_' + newcol_length + '" class="cell-component numeric-cell newcolCell alsonewcol' + alsosl + '" style="flex-basis: 120px;">';
                html += $("#VarianceCell").html();
                html += '</div>';
                var result = "";
                var str_formula = "";
                if (formula.length > 2) { // New column type = Formula
                    $.each(formula, function(fk, fv) {
                        str_formula += fv + "@";
                        if (fv.indexOf("also") != -1) {
                            var a = $(v).find('.' + fv);
                            result += $(a).find('.timeInputValue, .amountInputValue').text().replace(' h', '');
                            $(a).find('.timeInputValue, .amountInputValue').addClass('linknewcol');
                            $(a).find('.timeInputValue, .amountInputValue').addClass('newcol' + k + newcol_length);
                        } else if (fv == "%")
                            result += "/100";
                        else result += fv;
                    });
                    try {
                        var finalresult = eval(result);
                        $(v).find('.cell-component:last').after(html);
                        $("#newcol" + k + '_' + newcol_length).find(".amountInputValue").html(""); // clear all text
                        $("#newcol" + k + '_' + newcol_length).find(".amountInputValue").attr("contenteditable", "false");
                        $("#newcol" + k + '_' + newcol_length).find(".amountInputValue").html(finalresult);
                        $("#newcol" + k + '_' + newcol_length).find(".amountInputValue").attr("data-formulaname", str_formula);
                    } catch (e) {
                        $(".newcol").remove();
                        return false;
                    }
                } else { // New column type != Formula, maybe Text or Number
                    $(v).find('.cell-component:last').after(html);
                    if ($('input[name=columntype]:checked').val() == "Text") // New column type = Text
                        $("#newcol" + k + '_' + newcol_length).find(".amountInputValue").html(""); // clear all text
                }
            }
        });

        //This section for adding cell for last row 
        // start //
        var design = '  <div class="cell-component" style="flex-basis: 120px;background: #ffffff;">';
        design += '  </div>';
        $("#addnewSub .name-cell").after(design);
        // end //

        enabletime();
        subtaskdate();
        keypressBlur();
        resizecolumn();
    }
    addnewcolumn_popup();
}

function error_alert() {
    var ele = $(".pulse-component-wrapper>.pulse-component");
    var str_formula = result = "";
    $.each(formula, function(fk, fv) {
        str_formula += fv + "@";
        if (fv.indexOf("also") != -1) {
            var a = $(ele[0]).find('.' + fv);
            result += $(a).find('.timeInputValue, .amountInputValue').text().replace(' h', '');
        } else if (fv == "%")
            result += "/100";
        else result += fv;
    });
    try {
        eval(result);
        $("#formula_str").css("border-color", "#DDD");
        return false;
    } catch {
        $("#formula_str").css("border-color", "#900000");
        return true;
    }
}

function unstickTocol(eve, ele) {

    frzIndex = 0;
    $('.freezeCol .checkMenu').hide();
    $('.group-header-component .frzHandler').removeClass('flex_heading');
    $('.pulse-component .cell-component').removeClass('flex_heading');

    if ($(eve.target).hasClass('ds-title')) {
        $(eve.target).closest('.freezeCol').removeAttr('onclick');
        $(eve.target).closest('.freezeCol').attr('onclick', 'stickTocol(event,this)');
        $(eve.target).text('Freeze Column');
    } else {
        $(eve.target).removeAttr('onclick');
        $(eve.target).attr('onclick', 'stickTocol(event,this)');
        $(eve.target).find('.ds-title').text('Freeze Column');
    }

    $('.group-header-component .frzHandler').each(function(k, v) {

        $(v).find('.column-header-inner .ui-sortable-handle').addClass('dragColumn');
        if (k > 0) {
            $(v).css('flex-basis', '120px');
            $(v).css('border-right', '1px solid #ffffff');
            $(v).css('left', '1px');
        } else {
            $(v).css('left', '0px');
        }
    });

    $('.pulse-component:not(#addMEnuContainer):not(#OnlyForClone):not(#addnewSub):not(#varienceRow)').each(function(kp, vp) {
        $(vp).find('.cell-component').each(function(k, v) {

            if (k > 0) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #ffffff');
                $(v).css('left', '1px');
            } else {
                $(v).css('left', '0px');
            }
        });
    });

    $('.group-header-component .name-column-header').addClass('heading');
    $('.pulse-component .name-cell').addClass('heading');

    var setVal = $(ele).attr('data-setval');
    var setId = $(ele).attr('data-setid');
    console.log({
        setVal,
        setId
    });

    if (setVal !== '3') {

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = '1';
        activity.activityType = $(ele).attr('id');
        activity.activityCreatedBy = user_id;
        activity.clusteringKey = 'freeze';

        activity._setting((response) => {
            $('.freezeCol').each((k, v) => {
                $(v).attr('data-setval', '4');
                $(v).attr('data-setid', setId);
            });
        });
    }
}

function stickTocol(eve, ele) {

    $('.group-header-component .name-column-header').addClass('heading');
    $('.pulse-component .name-cell').addClass('heading');

    $('.group-header-component .frzHandler').removeClass('flex_heading');
    $('.pulse-component .cell-component').removeClass('flex_heading');

    $('.group-header-component .frzHandler').each(function(k, v) {
        $(v).css('left', '1px');
        $(v).css('background', '#ffffff');
    });

    $('.pulse-component').each(function(kp, vp) {
        $(vp).find('.cell-component').each(function(k, v) {
            $(v).css('left', '1px');
        });
    });

    $('.freezeCol').each(function(k, v) {
        $(v).removeAttr('onclick');
        $(v).attr('onclick', 'stickTocol(event,this)');
        $(v).find('.ds-title').text('Freeze Column');
    });

    if ($(eve.target).hasClass('ds-title')) {
        $(eve.target).closest('.freezeCol').removeAttr('onclick');
        $(eve.target).closest('.freezeCol').attr('onclick', 'unstickTocol(event,this)');
        $(eve.target).text('Unfreeze Column');
    } else {
        $(eve.target).removeAttr('onclick');
        $(eve.target).attr('onclick', 'unstickTocol(event,this)');
        $(eve.target).find('.ds-title').text('Unfreeze Column');
    }

    var position = parseInt($(eve.target).closest('.frzHandler').index()) + 1;
    var leftPo_g = 503;
    frzIndex = position;
    var two84chek = 0;
    $('.group-header-component .frzHandler').each(function(k, v) {
        $(v).find('.ui-resizable-handle').css('background', '#ffffff');
        if (k < position) {
            if ($(v).is(':visible')) {
                if (k == 0) {
                    $(v).css('left', '38px');
                } else if (k == 1) {
                    two84chek = 1;
                    $(v).css('left', '503px');
                } else if (k == 2) {
                    if (two84chek > 0) {
                        leftPo_g = leftPo_g + 122;
                        $(v).css('left', leftPo_g);
                    } else {
                        two84chek = 1;
                        $(v).css('left', '503px');
                    }
                } else if (k == 3) {
                    if (two84chek > 0) {
                        leftPo_g = leftPo_g + 122;
                        $(v).css('left', leftPo_g);
                    } else {
                        $(v).css('left', '503px');
                    }
                } else {
                    leftPo_g = leftPo_g + 122;
                    $(v).css('left', leftPo_g);
                }
            }

            if (k > 0) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #fff');
            }

            $(v).addClass('flex_heading');
            $(v).find('.column-header-inner .ui-sortable-handle').removeClass('dragColumn');
        }
    });

    $('.pulse-component:not(#addMEnuContainer):not(#OnlyForClone):not(#addnewSub):not(#varienceRow)').each(function(kp, vp) {

        var leftPo_c = 503;
        var two84chek2 = 0;
        $(vp).find('.cell-component').each(function(k, v) {
            if (k < position) {
                if ($(v).is(':visible')) {
                    if (k == 0) {
                        $(v).css('left', '3px');
                    } else if (k == 1) {
                        two84chek2 = 1;
                        $(v).css('left', '503px');
                    } else if (k == 2) {
                        if (two84chek2 > 0) {
                            leftPo_c = leftPo_c + 121;
                            $(v).css('left', leftPo_c);
                        } else {
                            two84chek2 = 1;
                            $(v).css('left', '503px');
                        }
                    } else if (k == 3) {
                        if (two84chek2 > 0) {
                            leftPo_c = leftPo_c + 121;
                            $(v).css('left', leftPo_c);
                        } else {
                            $(v).css('left', '503px');
                        }
                    } else {
                        leftPo_c = leftPo_c + 121;
                        $(v).css('left', leftPo_c);
                    }
                }
                $(v).addClass('flex_heading');

            }
            if (k > 0) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #fff');
            }
            if (k == position - 1) {
                $(v).css('flex-basis', '120px');
                $(v).css('border-right', '1px solid #1575ea');
            }
        });
    });

    $('.drag-handle').each(function(k, v) {
        $(v).removeAttr('class').addClass('drag-handle icon icon-dapulse-drag-2');
    });

    $(eve.target).closest('.frzHandler').find('.freezeCol .checkMenu').show();

    var setVal = $(ele).attr('data-setval');
    var setId = $(ele).attr('data-setid');

    console.log({
        setVal,
        setId
    });

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        } else {
            var dVal = '4';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = $(ele).attr('id');
        activity.activityCreatedBy = user_id;
        activity.clusteringKey = 'freeze';

        activity._setting((response) => {
            $('.freezeCol').each((k, v) => {
                $(v).attr('data-setval', '4');
                $(v).attr('data-setid', response._setting_response.settingid);
            });
        });
    }

}

function openInnerDropMenu(id) {
    $('.innerDropMenyCaret .outer_dropDown').removeClass('caretOprn');
    $(".innerDropMeny").html("");
    $("#" + id).html("");
    $("#" + id).append($("#innerDialogContainer").html());
    $("#" + id).parent('.cell-component').find('.innerDropMenyCaret .outer_dropDown').addClass('caretOprn');
    $("#" + id).show();

    $("#" + id).css('left', '-26px !important');
    $("#" + id).css('top', '-10px !important');

    var totalP = $(".pulse-component").length;
    var position = parseInt($("#" + id).closest('.pulse-component').index()) + 1;
    if (totalP - position < 2) {
        scrollToBottom('.workspaceform');
    }

    $(".workspaceform").scrollLeft(0);
    $('.group-header-component .name-column-header').removeClass('heading');
    $('.pulse-component .name-cell').removeClass('heading');

    $('.group-header-component .name-column-header').css('left', '0px');
    $('.pulse-component .name-cell').css('left', '0px');
}

function openDropMenu(e, ele, id) {
    $('#' + id).parent('.column-header-inner').find('.header_menu_btn').addClass('drop_active');
    $('#' + id).parent('.column-header-inner').find('.dropDown').show();

    var position = parseInt($('#' + id).closest('.frzHandler').index()) + 1;

    if (position == frzIndex) {
        $('#' + id).find('.freezeCol .checkMenu').show();
    }

    if (position == ascIndex) {
        $('#' + id).find('.aseSort .checkMenu').show();
    }

    if (position == descIndex) {
        $('#' + id).find('.descSort .checkMenu').show();
    }

    $('.header_menu_btn').removeClass('drop_active');

    if ($('#' + id).is(':visible')) {
        $('#' + id).hide();
    } else {
        $('.dialog-node').hide();
        $('.inner_menu').hide();
        $('#' + id).show();
        $(ele).addClass('drop_active');
    }

}


function getWindowRelativeOffset(parentWindow, elem) {
    var offset = {
        left: 0,
        top: 0
    };
    // relative to the target field's document
    offset.left = elem.getBoundingClientRect().left;
    offset.top = elem.getBoundingClientRect().top;

    var childWindow = elem.document.frames.window;
    while (childWindow != parentWindow) {
        offset.left = offset.left + childWindow.frameElement.getBoundingClientRect().left;
        offset.top = offset.top + childWindow.frameElement.getBoundingClientRect().top;
        childWindow = childWindow.parent;
    }
    return offset;
};

function groupSelet(event) {
    if ($("#groupSeletDiv").is(':visible')) {
        $("#groupSeletDiv").hide()
    } else {
        $("#groupSeletDiv").show()
    }
}

function selectGroup(e) {
    $('.groupList').removeClass('activeGroup');
    $(e).addClass('activeGroup');
}

function amountInputBlur(event) {
    $(event.target).css('background', 'transparent');
    formulafun(event.target);
}

function formulafun(ele) {
    if ($(ele).hasClass("linknewcol")) {
        var pele = $(ele).closest(".pulse-component");
        var rowno = $('.pulse-component').index(pele);
        var k = $(pele).find('.newcolCell').length;
        for (var i = 0; i < k; i++) {
            var idname = "newcol" + rowno + '_' + i;
            var formulastr = $("#" + idname).find(".amountInputValue").attr("data-formulaname");
            var formula = formulastr.split("@");
            var result = "";
            $.each(formula, function(fk, fv) {
                if (fv.indexOf("also") != -1) {
                    var a = $(pele).find('.' + fv);
                    result += $(a).find('.timeInputValue, .amountInputValue').text().replace(' h', '');
                } else if (fv == "%")
                    result += "/100";
                else result += fv;
            });
            try {
                var finalresult = eval(result);
                $("#newcol" + rowno + '_' + i).find(".amountInputValue").html(finalresult);
            } catch (e) {
                alert("Syntax Error 4432");
                return false;
            }
        }
    }
}
function enabletime() {
    var timeVal = $('.timeInputValue');
    timeVal.click(function() {
        var v = $(this).text().split(' ')[0];
        $(this).css('background', '#fff').focus().text(v);
        placeCaretAtEnd(document.getElementById($(this).attr('id')));
    });
}

var onInputbatchValue = event => {
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39 || code == 46) {
        var valu = parseInt($(event.target).val());
        if ($(event.target).val().length < 15) {
            if (validate.isInteger(valu)) {
                if (valu > -1) {
                    if (code == 13) {

                        event.preventDefault();
                        $(event.target).text(valu);
                        $(event.target).attr('data-val', valu);
                        $(event.target).blur();

                        formulafun(event.target);

                        if ($(event.target).hasClass('st_bAmount_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchBAinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        } else if ($(event.target).hasClass('st_aAmount_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchAAinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        } else if ($(event.target).hasClass('st_ewHour_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchEWHinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        } else if ($(event.target).hasClass('st_ehRate_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchEHRinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        } else if ($(event.target).hasClass('st_awHour_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchAHinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        } else if ($(event.target).hasClass('st_ahRate_value')) {

                            const activity = new Activity();
                            activity.activityId = forBatchPropertis;
                            activity.activityUpdateData = valu.toString();
                            activity.activityType = 'SubTask';
                            activity.activityUpdateType = 'batchAHRinput';

                            activity.activityBatchUpdate((response) => {
                                console.log(response);
                            });
                        }

                    } else if (code < 48 || code > 57) {
                        if (code == 8 || code == 37 || code == 39) return true;
                        else if (code == 46) {
                            // Firefox 1.0+
                            var isFirefox = typeof InstallTrigger !== 'undefined';
                            if (isFirefox) {
                                var tempid = Date.now();
                                $(event.target).attr("id", tempid);
                                var el = document.getElementById(tempid);
                                placeCaretAtEnd(el);
                            }
                            return true;
                        } else if (code < 106 || code > 95) return true;
                        else return false;
                    }
                }
            }
        } else {
            event.preventDefault();
        }
    } else {
        event.preventDefault();
    }
}

function updateExceedValue(elem){
    var type = $(elem).attr('data-type');
    var value = $(elem).attr('data-value');

    const activity = new Activity();
    activity.activityId = $('#updateAction').val();
    activity.clusteringKey = $('#actCre').val();
    activity.activityUpdateData = (value != "" ? value : '0');
    activity.activityType = 'Task';
    activity.activityUpdateType = type;

    if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
        if ($('#updateAction').val() !== '') {
            activity.activityUpdate((response) => {
                $('#' + type).val(value);
                $('#exceed_value').hide();
                taskAmountVr();
                taskEstHVr();
                actualHrVr();
            });
        }
    }
}

function onInputValue(event){
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39 || code == 110 || code == 190) {

        if(($(event.target).text().split('.').length ) > 2){
            var newStr = $(event.target).text();
            var valu = $(event.target).text(newStr.substring(0, newStr.length - 1));
            placeCaretAtEndBTDH(document.getElementById($(event.target).attr('id')));
        }else{
            var valu = parseFloat($(event.target).text());
        }

        if ($(event.target).text().length < 15) {
            if (validate.isNumber(valu)) {
                if (valu > -1) {
                    if (code == 13) {
                        event.preventDefault();
                        $(event.target).text(valu);
                        $(event.target).attr('data-val', valu);
                        $(event.target).blur();

                        if (!isFloat(valu)) {
                            $(event.target).text(parseFloat(valu).toFixed(2));
                        }

                        formulafun(event.target);

                        sabTaskColValue(event, valu);

                    } else if (code < 48 || code > 57) {
                        if (code == 8 || code == 37 || code == 39) return true;
                        else if (code == 46) {
                            // Firefox 1.0+
                            var isFirefox = typeof InstallTrigger !== 'undefined';
                            if (isFirefox) {
                                var tempid = Date.now();
                                $(event.target).attr("id", tempid);
                                var el = document.getElementById(tempid);
                                placeCaretAtEnd(el);
                            }
                            return true;
                        } else if (code < 106 || code > 95) return true;
                        else return false;
                    }
                }
            }
        } else {
            event.preventDefault();
        }
    } else {
        event.preventDefault();
    }
}

function sabTaskColValue(event, valu){
    if ($(event.target).hasClass('ManHourRateSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskEHRinput';

        activity.activityUpdate((response) => {
            console.log(response);

            var estTime = parseFloat(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
            var estRate = parseFloat(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
            var actualTime = parseFloat(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
            var actualRate = parseFloat(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

            var timever = (estTime * estRate) - (actualTime * actualRate);

            $("#timevarianceCellSpan" + activityId).text(timever + '.00');

            varienceCollect();

            var estHourlyRateVal = 0;

            $('.ManHourRateSpan').each((k, v) => {
                estHourlyRateVal = estHourlyRateVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });

            if (estHourlyRateVal > rootEstHourRate) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) est. hourly rate has exceeded the root. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskEHRinput');
                $("#exceed_value .btn-msg-del").attr('data-value', estHourlyRateVal);

            }

        });

    } else if ($(event.target).hasClass('hourlyRateCellSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskAHRinput';

        activity.activityUpdate((response) => {
            var estTime = parseFloat(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
            var estRate = parseFloat(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
            var actualTime = parseFloat(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
            var actualRate = parseFloat(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

            var timever = (estTime * estRate) - (actualTime * actualRate);

            $("#timevarianceCellSpan" + activityId).text(timever + '.00');

            varienceCollect();

            var actualHourlyRateVal = 0;

            $('.hourlyRateCellSpan').each((k, v) => {
                actualHourlyRateVal = actualHourlyRateVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });


            if (actualHourlyRateVal > rootActualHourRate) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) actual hourly rate has exceeded the root. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskAHRinput');
                $("#exceed_value .btn-msg-del").attr('data-value', actualHourlyRateVal);
            }
        });

    } else if ($(event.target).hasClass('AmountCellSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskBAinput';

        activity.activityUpdate((response) => {
            var budget = $(event.target).text();
            var actual = $(event.target).closest('.pulse-component').find('.actualCell .actualCellSpan').text();
            var varience = $(event.target).closest('.pulse-component').find('.varianceCell .varianceCellSpan').text((budget == '' ? 0 : parseFloat(budget)) - (actual == '' ? 0 : parseFloat(actual)));

            varienceCollect();

            var badgetVal = 0;

            $('.AmountCellSpan').each((k, v) => {
                badgetVal = badgetVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });

            if (badgetVal > rootBudgetAmount) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) budget amount has exceeded the root budget amount. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskBAinput');
                $("#exceed_value .btn-msg-del").attr('data-value', badgetVal);
            }
        });

    } else if ($(event.target).hasClass('actualCellSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskAAinput';

        activity.activityUpdate((response) => {
            var budget = $(event.target).closest('.pulse-component').find('.AmountCell .AmountCellSpan').text();
            var actual = $(event.target).text();
            var varience = $(event.target).closest('.pulse-component').find('.varianceCell .varianceCellSpan').text((budget == '' ? 0 : parseFloat(budget)) - (actual == '' ? 0 : parseFloat(actual)));
            varienceCollect();

            var actualVal = 0;

            $('.actualCellSpan').each((k, v) => {
                actualVal = actualVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });

            if (actualVal > rootActualAmount) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) actual amount has exceeded the root actual amount. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskAAinput');
                $("#exceed_value .btn-msg-del").attr('data-value', actualVal);

            }
        });

    } else if ($(event.target).hasClass('varianceCellSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'variance';

        activity.activityUpdate((response) => {
            varienceCollect();
        });

    } else if ($(event.target).hasClass('customcol')) {

        var activityId = $(event.target).closest('.pulse-component').find('.pulse_title').attr('data-id');
        var colid = $(event.target).attr('data-id');
        var createdby = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.activityCreatedBy = createdby;
        activity.activityUpdateData = valu;
        activity.customColId = colid;

        if ($(event.target).hasClass('hasVal')) {
            var targetID = $(event.target).attr('data-colid');
            activity.targetID = targetID;

            activity.customColUpdate((response) => {
                console.log(response);
            });

        } else {
            activity.customColSave((response) => {
                if (response.customColUpdateResponse.status) {
                    $(event.target).attr('data-colid', response.customColUpdateResponse.id);
                    $(event.target).addClass('hasVal');
                }
            });
        }
    } else if ($(event.target).hasClass('st_bAmount_value')) {

        const activity = new Activity();
        activity.activityId = forBatchPropertis;
        activity.activityUpdateData = value;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'batchBAinput';

        activity.activityBatchUpdate((response) => {
            console.log(response);
        });
    }
}

function timeCol(event) {
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39 || code == 110 || code == 190) {
        if(($(event.target).text().split('.').length ) > 2){
            var newStr = $(event.target).text();
            var valu = $(event.target).text(newStr.substring(0, newStr.length - 1));
            placeCaretAtEndBTDH(document.getElementById($(event.target).attr('id')));
        }else{
            var valu = parseFloat($(event.target).text());
        }
        
        if ($(event.target).text().length < 15) {
            if (validate.isNumber(valu)) {
                if (valu > -1) {
                    if (code == 13) {
                        event.preventDefault();
                        $(event.target).text(valu);
                        $(event.target).attr('data-val', valu);
                        $(event.target).blur();

                        formulafun(event.target);
                        timeColValue(event, valu);
                    } else if (code < 48 || code > 57) {
                        if (code == 8 || code == 37 || code == 39) return true;
                        else if (code == 46) {
                            // Firefox 1.0+
                            var isFirefox = typeof InstallTrigger !== 'undefined';
                            if (isFirefox) {
                                var tempid = Date.now();
                                $(event.target).attr("id", tempid);
                                var el = document.getElementById(tempid);
                                placeCaretAtEnd(el);
                            }
                            return true;
                        } else if (code < 106 || code > 95) return true;
                        else return false;
                    }
                }
            }
        } else {
            event.preventDefault();
        }
    } else {
        event.preventDefault();
    }
}

function timeInputBlur(event) {
    $(event.target).css('background', 'transparent');
    // var valu = parseFloat($(event.target).text());
    // if($(event.target).text().length < 15){
    //   if(validate.isNumber(valu)){
    //     if(valu > -1){
    //       timeColValue(event,valu);
    //     }
    //   }
    // }
}

function timeColValue(event, valu){
    if ($(event.target).hasClass('timeEstCellSpan')) {
        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskEHinput';

        activity.activityUpdate((response) => {
            console.log(response);

            var estTime = parseFloat(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
            var estRate = parseFloat(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
            var actualTime = parseFloat(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
            var actualRate = parseFloat(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

            var timever = (estTime * estRate) - (actualTime * actualRate);

            $("#timevarianceCellSpan" + activityId).text(timever + '.00');

            varienceCollect();

            var estTimeRateVal = 0;

            $('.timeEstCellSpan').each((k, v) => {
                estTimeRateVal = estTimeRateVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });

            if (estTimeRateVal > rootEstWorkHour) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) est. work hour has exceeded the root. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskEHinput');
                $("#exceed_value .btn-msg-del").attr('data-value', estTimeRateVal);
            }
        });

    } else if ($(event.target).hasClass('actualHourCellSpan')) {

        var activityId = $(event.target).attr('data-id');
        var clusteringKey = $(event.target).attr('data-createdby');

        const activity = new Activity();
        activity.activityId = activityId;
        activity.clusteringKey = clusteringKey;
        activity.activityUpdateData = valu;
        activity.activityType = 'SubTask';
        activity.activityUpdateType = 'taskAHinput';

        activity.activityUpdate((response) => {
            console.log(response);

            var estTime = parseFloat(($("#timeInputValue" + activityId).text() == '' ? 0 : $("#timeInputValue" + activityId).text()));
            var estRate = parseFloat(($("#hourlyRateCellSpan" + activityId).text() == '' ? 0 : $("#hourlyRateCellSpan" + activityId).text()));
            var actualTime = parseFloat(($("#actualHourCellSpan" + activityId).text() == '' ? 0 : $("#actualHourCellSpan" + activityId).text()));
            var actualRate = parseFloat(($("#ManHourRateSpan" + activityId).text() == '' ? 0 : $("#ManHourRateSpan" + activityId).text()));

            var timever = (estTime * estRate) - (actualTime * actualRate);

            $("#timevarianceCellSpan" + activityId).text(timever + '.00');

            varienceCollect();

            var actualTimeRateVal = 0;

            $('.actualHourCellSpan').each((k, v) => {
                actualTimeRateVal = actualTimeRateVal + ($(v).text() == '' ? 0 : parseFloat($(v).text()));
            });

            if (actualTimeRateVal > rootActualWorkHour) {
                $("#exceed_value").show();
                $("#exceed_value .delete_msg_sec_title").text('Subtask(s) est. work hour has exceeded the root. Do you want to update root task value?');
                $("#exceed_value .btn-msg-del").attr('data-type', 'taskAHinput');
                $("#exceed_value .btn-msg-del").attr('data-value', actualTimeRateVal);
            }
        });
    }
}

function placeCaretAtEndBTDH(el){
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

$("#customGroupListIput").keypress(function(eve) {
    if (event.keyCode == 13) {
        var str = '<span class="groupList" onclick="selectGroup(this);">' + eve.target.value + '</span>';
        $("#groupListWrapper").append(str);

        var neStr = '<div class="contentWrapper"  id="' + eve.target.value +
            '" style="margin-top: 50px;"><div class="group-header-wrapper"></div></div>';
        $(".new-added-check-list").append(neStr);
        $("#" + eve.target.value + " .group-header-wrapper").append($("#nextweek .group-header-wrapper").html());
        $("#" + eve.target.value + " .group-name  .editableCon").css('color', 'rgb(162, 93, 220)');
        $("#" + eve.target.value + " .group-name  .editableCon").text(eve.target.value);
        var hh = '<div class="group-footer-wrapper" style="height: 40px; left: 0px; /*!position: absolute;*/ top: 148px; width: 100%;">';
        hh += '      <div class="pulse-component-wrapper"></div><div class="group-footer-component">';
        hh += '            <div class="add-pulse-component" style="display:none">';
        hh +=
            '                <div class="add-pulse-left-indicator" style="background: rgb(0, 134, 192) none repeat scroll 0% 0%;"></div><input type="text" dir="auto" class="add-pulse-input" placeholder="+ Create a New Pulse (Row)"><button class="add-pulse-button">Add</button>';
        hh += '                <div class="add-pulse-right-indicator"></div>';
        hh += '            </div>';
        hh += '            <div class="columns-footer-component">';
        hh += '                <div class="columns-footer-column name-footer" style="flex-basis: 247px;"></div>';
        hh += '                <div class="columns-footer-column person-footer" style="flex-basis: 80px;"></div>';
        hh += '                <div class="columns-footer-column person-footer" style="flex-basis: 80px;"></div>';
        hh += '                <div class="columns-footer-column color-footer" style="flex-basis: 80px;"></div>';
        hh += '                <div class="columns-footer-column date-footer" style="flex-basis: 80px;"></div>';
        hh += '                <div class="columns-footer-column numeric-footer shown" style="flex-basis: 80px;">';
        hh += '                    <div class="numeric-column-footer-component can-edit">';
        hh += '                        <div class="numeric-column-footer-value">';
        hh +=
            '                            <div class="ds-text-component" dir="auto"><span class="totalTime">3</span></div>';
        hh += '                        </div>';
        hh += '                        <div class="numeric-column-footer-function">';
        hh += '                            <div class="column-footer-function-inner inner-link ">count</div>';
        hh += '                          </div>';
        hh += '                    </div>';
        hh += '                </div>';
        hh += '                <div class="columns-footer-column numeric-footer shown" style="flex-basis: 80px;">';
        hh += '                    <div class="numeric-column-footer-component can-edit">';
        hh += '                      <div class="numeric-column-footer-value">';
        hh +=
            '                          <div class="ds-text-component" dir="auto"><span class="amountTotalValue">0</span></div>';
        hh += '                  </div>';
        hh += '                  <div class="numeric-column-footer-function">';
        hh += '                      <div class="column-footer-function-inner inner-link ">sum</div>';
        hh += '                  </div>';
        hh += '              </div>';
        hh += '          </div>';
        hh += '          <div class="columns-footer-column text-footer" style="flex-basis: 80px;"></div>';
        hh += '          <div class="columns-footer-column text-footer" style="flex-basis: 80px;"></div>';
        hh += '      </div>';
        hh += '  </div>';
        hh += '</div>';

        $("#" + eve.target.value).append(hh);
        $("#customGroupListIput").val('');

    }
});

function showMoreTaskInput() {
    // alert('Check');
    $('.budget_to_status').toggle();
    if ($('.budget_to_status').is(':visible')) {
        $('.more_task_inputs').text('Show Less options...');
        $('.notes_area').css('height', '128px');
    } else {
        $('.notes_area').css('height', '48px');
        $('.more_task_inputs').text('Show more options...');
    }
}

// function puillEditor(){
var toolbarOptions = [
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{
        'direction': 'rtl'
    }], // text direction

    [{
        'color': []
    }, {
        'background': []
    }], // dropdown with defaults from theme
    [{
        'font': []
    }, {
        'align': []
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }, {
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }, {
        'script': 'sub'
    }, {
        'script': 'super'
    }],
    ['image'] // remove formatting button
];

var quill = new Quill('#subtaskNote', {
    modules: {
        'syntax': true,
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

var toolbarOptions2 = [
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{
        'color': []
    }], // dropdown with defaults from theme
    [{
        'align': []
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }, {
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    ['image'] // remove formatting button
];

var quill = new Quill('#noteBoxEditor', {
    modules: {
        'syntax': true,
        toolbar: toolbarOptions2
    },
    theme: 'snow'
});
// }
// quill.enable();


$(".group-note input").keypress(function(event) {
    var theEvent = event || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    var regex2 = /[0-9]|\:/;
    if ($(event.target).attr('id') !== 'taskEHinput' && $(event.target).attr('id') !== 'taskAHinput') {
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    } else {
        if (!regex2.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }
});

function taskAmountVr() {
    var ba = $('#taskBAinput').val();
    var aa = $('#taskAAinput').val();
    var diff = ba - aa;
    $('#budget_variance span').text(diff);
    if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
        $('#budget_variance').removeClass('_inactive');
    } else {
        $('#budget_variance').addClass('_inactive');
    }

    if (diff > -1) {
        $('#budget_variance span').css('color', '#53627c');
    } else {
        $('#budget_variance span').css('color', 'red');
    }
}

function taskEstHVr() {
    var eh = $('#taskEHinput').val();
    var ehr = $('#taskEHRinput').val();
    var totalmin = 0;
    var minarray = eh.split(':');
    totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
    $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
    if (eh !== '' && ehr !== '') {
        $('#e_h_variance').removeClass('_inactive');
    } else {
        $('#e_h_variance').addClass('_inactive');
    }
}

function actualHrVr() {
    var eh = $('#taskAHinput').val();
    var ehr = $('#taskAHRinput').val();
    var totalmin = 0;
    var minarray = eh.split(':');
    totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
    $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
    if (eh !== '' && ehr !== '') {
        $('#e_h_r_variance').removeClass('_inactive');
    } else {
        $('#e_h_r_variance').addClass('_inactive');
    }
}

function taskbudget(e, type, ele) {

    var value = $(ele).val();

    if (!validate.isEmpty(value)) {
        if (type == 'BA' || type == 'AA') {
            var ba = $('#taskBAinput').val();
            var aa = $('#taskAAinput').val();
            var diff = ba - aa;
            $('#budget_variance span').text(diff);
            if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
                $('#budget_variance').removeClass('_inactive');
            } else {
                $('#budget_variance').addClass('_inactive');
            }
            if (diff > -1) {
                $('#budget_variance span').css('color', '#53627c');
            } else {
                $('#budget_variance span').css('color', 'red');
            }
        } else if (type == 'EH' || type == 'EHR') {
            var eh = $('#taskEHinput').val();
            var ehr = $('#taskEHRinput').val();
            var totalmin = 0;
            var minarray = eh.split(':');
            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
            $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
            if (eh !== '' && ehr !== '') {
                $('#e_h_variance').removeClass('_inactive');
            } else {
                $('#e_h_variance').addClass('_inactive');
            }
        } else if (type == 'AH' || type == 'AHR') {
            var eh = $('#taskAHinput').val();
            var ehr = $('#taskAHRinput').val();
            var totalmin = 0;
            var minarray = eh.split(':');
            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
            $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
            if (eh !== '' && ehr !== '') {
                $('#e_h_r_variance').removeClass('_inactive');
            } else {
                $('#e_h_r_variance').addClass('_inactive');
            }
        }
    }
}


function addNewSubtask(event) {
    var addcheck = $(event.target).val();
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode == 13) {
        event.preventDefault();
        if (!validate.isEmpty(addcheck) && $("#updateAction").val() != '0') {
            var iii = $('.activeGroup').text().replace(/\s/g, '').toLowerCase();
            if(subTaskListArr.indexOf(addcheck.toLowerCase().trim()) === -1){
                if ($('.activeGroup').length > 0) {
                    var plseStr = '<div class="pulse-component-wrapper" id="plusCUstom' + iii + '"></div>';
                    $("#" + iii + " .group-header-wrapper").after(plseStr);
                    $("#plusCUstom" + iii).append(htm);
    
                } else {
    
                    const activity = new Activity();
    
                    activity.activityTitle = addcheck;
                    activity.activityType = 'SubTask';
                    activity.activityCreatedBy = user_id;
                    activity.activityHasRoot = 1;
                    activity.activityRootId = $("#updateAction").val();
                    activity.activityDueDate = $("#dueDatePicker").val();
    
                    var participants_onfly = [];
                    var coownArr = [];
                    var observerArr = [];
                    var assigneeArr = [];
    
                    if (coowner.length > 0) {
                        $.each(coowner, (k, v) => {
                            if (v !== user_id) {
                                coownArr.push({
                                    id: v,
                                    type: 'owner'
                                });
                            }
                        });
                    }
    
                    if ($("#actCre").val() !== user_id) {
                        coownArr.push({
                            id: $("#actCre").val(),
                            type: 'owner'
                        });
                    }
    
                    if (observer.length > 0) {
                        $.each(observer, (k, v) => {
                            observerArr.push({
                                id: v,
                                type: 'observer'
                            });
                        });
                    }
    
                    if (assignee.length > 0) {
                        $.each(assignee, (k, v) => {
                            assigneeArr.push({
                                id: v,
                                type: 'assignee'
                            });
                        });
                    }
    
                    var finArr1 = coownArr.concat(observerArr);
                    var finarr2 = finArr1.concat(assigneeArr);
    
                    $.each(finarr2, (k, v) => {
                        if (!checkFromMultipleArray(participants_onfly, v.id, v.type)) {
                            participants_onfly.push({
                                id: v.id,
                                type: v.type
                            });
                        }
                    });
    
                    activity.participantsArry = participants_onfly;
    
                    var activityCreatedBy = (!validate.isEmpty(activity.activityCreatedBy) ? true : false);
    
                    var titleWarning = (!validate.isEmpty(addcheck) ? true : warningBorder('addTodoCheckList'));
    
                    if (activityCreatedBy) {
                        if (validate.isBoolean(titleWarning)) {
                            activity.saveActivity((response) => {
                                if (!validate.isEmpty(response)) {
                                    if (response.status) {
                                        subTaskListArr.push(addcheck.toLowerCase().trim());
                                        taskShowHideElement(true);
                                        var htm = $("#OnlyForClone").clone();
                                        var pulse = response.activity_id;
                                        var id = $('.pulse_title').length + 1;
                                        myAllActivityGlobal.push(pulse);
                                        $(htm).attr('id', 'pulse_' + pulse).addClass('_eachsubtask');
                                        $(htm).attr('id', 'pulse_' + pulse).attr('data-id', pulse);
                                        $(htm).find('.name-cell-component .pulse_title').text(addcheck);
                                        $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
                                        $(htm).find('.numeric-cell-component .amountInputValue').text('0');
                                        $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/' + user_img);
                                        $(htm).find('.owner_img').attr('title', user_fullname);
                                        $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle' + id).text(addcheck);
                                        $(htm).find('.name-cell-component .pulse_title').attr('data-title', addcheck);
    
                                        // ATTR SET
    
                                        $(htm).find('.ObserverCell .observerViewList').attr('data-id', response.activity_id);
                                        $(htm).find('.coowonerCell .coownerViewList').attr('data-id', response.activity_id);
                                        $(htm).find('.AssigneeCell .assigneeViewList').attr('data-id', response.activity_id);
                                        $(htm).find('.DateCell .dueDateInput').attr('data-id', response.activity_id);
                                        $(htm).find('.com_DateCell .com_DateInput').attr('data-id', response.activity_id);
                                        $(htm).find('.priorityCell .single_priority').attr('data-id', response.activity_id);
                                        $(htm).find('.StatusCell .single_status').attr('data-id', response.activity_id);
                                        $(htm).find('.timeEstCell .timeInputValue').attr('data-id', response.activity_id);
                                        $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.AmountCell .AmountCellSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.actualCell .actualCellSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.varianceCell .varianceCellSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-id', response.activity_id);
                                        $(htm).find('.name-cell-component .pulse_title').attr('data-id', response.activity_id);
                                        $(htm).find('.name-cell-component .flagIco').attr('data-id', response.activity_id);
    
                                        $(htm).find('.ObserverCell .observerViewList').attr('data-createdby', user_id);
                                        $(htm).find('.coowonerCell .coownerViewList').attr('data-createdby', user_id);
                                        $(htm).find('.AssigneeCell .assigneeViewList').attr('data-createdby', user_id);
                                        $(htm).find('.DateCell .dueDateInput').attr('data-createdby', user_id);
                                        $(htm).find('.com_DateCell .com_DateInput').attr('data-createdby', user_id);
                                        $(htm).find('.priorityCell .single_priority').attr('data-createdby', user_id);
                                        $(htm).find('.StatusCell .single_status').attr('data-createdby', user_id);
                                        $(htm).find('.timeEstCell .timeInputValue').attr('data-createdby', user_id);
                                        $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('data-createdby', user_id);
                                        $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('data-createdby', user_id);
                                        $(htm).find('.AmountCell .AmountCellSpan').attr('data-createdby', user_id);
                                        $(htm).find('.actualCell .actualCellSpan').attr('data-createdby', user_id);
                                        $(htm).find('.varianceCell .varianceCellSpan').attr('data-createdby', user_id);
                                        $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('data-createdby', user_id);
                                        $(htm).find('.name-cell-component .pulse_title').attr('data-createdby', user_id);
    
                                        // ID SET
    
                                        $(htm).find('.DateCell .dueDateInput').attr('id', 'dueDate' + response.activity_id);
                                        $(htm).find('.com_DateCell .com_DateInput').attr('id', 'comDate' + response.activity_id);
                                        $(htm).find('.ObserverCell .observerViewList').attr('id', 'observer' + response.activity_id).addClass('observer' + response.activity_id);
                                        $(htm).find('.coowonerCell .coownerViewList').attr('id', 'coowner' + response.activity_id).addClass('coowner' + response.activity_id);
                                        $(htm).find('.AssigneeCell .assigneeViewList').attr('id', 'assignee' + response.activity_id).addClass('assignee' + response.activity_id);
                                        $(htm).find('.priorityCell').attr('id', 'priority' + response.activity_id);
                                        $(htm).find('.StatusCell').attr('id', 'status' + response.activity_id);
                                        $(htm).find('.timeEstCell .timeInputValue').attr('id', 'timeInputValue' + response.activity_id);
                                        $(htm).find('.ManHourRateCell .ManHourRateSpan').attr('id', 'ManHourRateSpan' + response.activity_id);
                                        $(htm).find('.hourlyRateCell .hourlyRateCellSpan').attr('id', 'hourlyRateCellSpan' + response.activity_id);
                                        $(htm).find('.AmountCell .AmountCellSpan').attr('id', 'AmountCellSpan' + response.activity_id);
                                        $(htm).find('.actualCell .actualCellSpan').attr('id', 'actualCellSpan' + response.activity_id);
                                        $(htm).find('.varianceCell .varianceCellSpan').attr('id', 'varianceCellSpan' + response.activity_id);
                                        $(htm).find('.timevarianceCell .timevarianceCellSpan').attr('id', 'timevarianceCellSpan' + response.activity_id);
    
                                        // $( "#thisWeekPluseContainer").append(htm);
    
                                        if ($('#addnewSub').is(':visible')) {
                                            if (row_pluse_count == 0) {
                                                $('.pulse_title').first().closest('.pulse-component').before(htm);
                                            } else if (row_pluse_count == 1) {
                                                $('#varienceRow').before(htm);
                                            }
    
                                            if (($('.pulse_title').length - 1) > 9) {
                                                $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                                            }
    
                                            $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                                        } else {
                                            $('.pulse_title').last().closest('.pulse-component').before(htm);
                                            var wid = 0;
    
                                            $('.cell-component:visible').each(function(k, v) {
                                                wid = wid + $(v).innerWidth();
                                            });
    
                                            SubtaskClone.cellcomponent = 17;
                                            SubtaskClone.flexSize = wid;
                                            SubtaskClone.id = $('.pulse-component').length;
    
                                            $("#thisWeekPluseContainer").append(SubtaskClone.varience());
                                            $("#thisWeekPluseContainer").append(SubtaskClone.draw());
    
                                            $("#thisWeekPluseContainer").show();
    
                                            if (($('.pulse_title').length - 1) > 9) {
                                                $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                                            }
    
                                            $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                                        }
    
                                        if ($('.showArchive').hasClass('active')) {
                                            $('#pulse_' + pulse).hide();
                                        } else {
                                            $('#pulse_' + pulse).show();
                                        }
    
                                        // $( "#OnlyForClone").css('display','flex');
                                        $('.kill').css('height', $('.pulse-component').length * 37 + 200);
    
                                        var totalST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').length;
                                        var checkedST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox).selected').length;
                                        var waitingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=WaitingForFeedback]').length;
                                        var workingST = $('.left-indicator-checkbox:not(#OnlyForClone .left-indicator-checkbox)').parents('.pulse-left-indicator[data-value=Working]').length;
    
                                        progressBar(totalST, checkedST);
                                        multipleProgressBar(totalST, checkedST, waitingST, workingST);
    
                                        $.each(participants_onfly, function(k, v) {
    
                                            if (v.type == 'observer') {
                                                addAsObsrvrArr.push({
                                                    activityid: response.activity_id.toString(),
                                                    userid: v.id.toString(),
                                                    tbl_id: v.id.toString(),
                                                    type: 'observer',
                                                });

                                                if(uniqueObserver.indexOf(v.id.toString()) == -1){
                                                    uniqueObserver.push(v.id.toString());
                                                } 

                                                partiArry.push({
                                                    activity_id:response.activity_id.toString(),
                                                    user_id:v.id.toString(),
                                                    tbl_id:    v.id.toString(),
                                                    participant_type: 'observer',
                                                    activity_type: "SubTask",
                                                    created_at: moment().format('L')
                                                });
    
                                                observerFromLoad(v.id.toString(), '#observer' + response.activity_id.toString());
    
                                            } else if (v.type == 'assignee') {
    
                                                addAsAssigneeArr.push({
                                                    tbl_id: v.id.toString(),
                                                    activityid: response.activity_id.toString(),
                                                    userid: v.id.toString(),
                                                    type: 'assignee',
                                                });

                                                if(uniqueAssine.indexOf(v.id.toString()) == -1){
                                                    uniqueAssine.push(v.id.toString());
                                                }

                                                partiArry.push({
                                                    activity_id:response.activity_id.toString(),
                                                    user_id:v.id.toString(),
                                                    tbl_id:    v.id.toString(),
                                                    participant_type: 'assignee',
                                                    activity_type: "SubTask",
                                                    created_at: moment().format('L')
                                                });
    
                                                assigneeFromLoad(v.id.toString(), '#assignee' + response.activity_id.toString());
    
                                            } else if (v.type == 'owner') {
    
                                                addAsCoOwnerArr.push({
                                                    tbl_id: v.id.toString(),
                                                    activityid: response.activity_id.toString(),
                                                    userid: v.id.toString(),
                                                    type: 'owner',
                                                });

                                                if(uniqCoowner.indexOf(v.id.toString()) == -1){
                                                    uniqCoowner.push(v.id.toString());
                                                }

                                                partiArry.push({
                                                    activity_id:  response.activity_id.toString(),
                                                    user_id: v.id.toString(),
                                                    tbl_id:  v.id.toString(),
                                                    participant_type: 'owner',
                                                    activity_type: "SubTask",
                                                    created_at: moment().format('L')
                                                });
    
                                                coownerFromLoad(v.id.toString(), '#coowner' + response.activity_id.toString());
                                            }
                                        });
    
                                        var createdbyme = [];
                                        createdbyme.push(response.activity_id.toString());
    
                                        var ar1 = addAsObsrvrArr.concat(addAsAssigneeArr);
                                        var ar2 = ar1.concat(addAsCoOwnerArr);
    
                                        $.each(ar2, (k, v) => {
                                            if (createdbyme.indexOf(v.activityid.toString()) > -1) {
                                                subTaskOwnerAccess(v.activityid.toString());
                                            } else {
                                                if (v.type == 'coowner') {
                                                    subTaskOwnerAccess(v.activityid.toString());
                                                } else if (v.type == 'observer') {
                                                    subTaskObserverAccess(v.activityid.toString());
                                                } else if (v.type == 'assignee') {
                                                    subTaskAssigneeAccess(v.activityid.toString());
                                                }
                                            }
    
                                        });
    
                                        enabletime();
                                        keypressBlur();
                                        countSubtask();
                                        onDynamicFire();
                                        tooltipforToDo();
                                        subtask_join_into_room();
                                    }
                                } else {
                                    console.log('Something wrong');
                                }
    
                            });
                        }
                    }
                }
    
                $('#addTodoCheckList').val('');
    
                tooltipforToDo();
    
                $('#taskStatusSelect').val('Working').trigger('change');
                $("#taskStatusSelect").css('pointer-events', 'none');
                $(".task_status .rdonlyText").css('display', 'inline-block');
                $(".task_status .rdonlyDiv").css('display', 'block');
                $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events', 'none');
            }else{
                toastr['warning']($(event.target).val()+' already in your subtasklist', 'Warning');
                $(event.target).val('').focus();
            }
            

        } else {
            $('#addTodoCheckList').css('border-color', 'red');
        }
        $(event.target).val('');
    }
}

function checkSubtask(event) {
    $(event.target).attr('contenteditable', true);
    $(event.target).focus();
    $("#addnewSub .cell-component").css('border', '1px solid #ffffff');
    $("#addnewSub .cell-component").css('border-top', '1px solid #569bfc');
    $("#addnewSub .cell-component").css('border-bottom', '1px solid #569bfc');
}

function checkSubonBlur(event) {
    $(event.target).text("");
    $("#addnewSub .cell-component").css('border', '1px solid #ffffff');
    $("#addnewSub .cell-component").css('border-bottom', '1px solid #e6e6e6');
}

$('#addnewSub .name-text').on('change keydown keypress input', 'div[data-placeholder]', function(event) {
    if (this.textContent) {
        this.dataset.divPlaceholderContent = 'true';

    } else {
        delete(this.dataset.divPlaceholderContent);
    }
});

function budget_set(elm) {
    $('.column-menu-item[data-name="budget"]').trigger('click');
    $('.column-menu-item[data-name="actual"]').trigger('click');
    $('.column-menu-item[data-name="variance"]').trigger('click');

    if ($('#budget_set').hasClass('active')) {
        $('#budget_set').removeClass('active');
    } else {
        $('#budget_set').addClass('active');
    }

    var setVal = $("#budget_set").attr('data-setval');
    var setId = $("#budget_set").attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = 'budget_set';
        activity.activityCreatedBy = user_id;

        activity._setting((response) => {

            $("#budget_set").attr('data-setval', currentVal);
            $("#budget_set").attr('data-setid', response._setting_response.settingid);
        });
    }
}

function task_time_set(elm) {
    $('.column-menu-item[data-name="manhourcost"]').trigger('click');
    $('.column-menu-item[data-name="hourlyrate"]').trigger('click');
    $('.column-menu-item[data-name="timeest"]').trigger('click');
    $('.column-menu-item[data-name="actualHour"]').trigger('click');
    $('.column-menu-item[data-name="timevariance"]').trigger('click');

    if ($('#task_time_set').hasClass('active')) {
        $('#task_time_set').removeClass('active');
    } else {
        $('#task_time_set').addClass('active');
    }

    var setVal = $("#task_time_set").attr('data-setval');
    var setId = $("#task_time_set").attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = 'task_time_set';
        activity.activityCreatedBy = user_id;

        activity._setting((response) => {

            $("#task_time_set").attr('data-setval', currentVal);
            $("#task_time_set").attr('data-setid', response._setting_response.settingid);
        });
    }
}

function owner_co_owner(elm) {

    $('.column-menu-item[data-name="coowner"]').trigger('click');
    $('.column-menu-item[data-name="owner"]').trigger('click');

    if ($('#owner_co_owner').hasClass('active')) {
        $('#owner_co_owner').removeClass('active');
    } else {
        $('#owner_co_owner').addClass('active');
    }

    var setVal = $('#owner_co_owner').attr('data-setval');
    var setId = $('#owner_co_owner').attr('data-setid');

    if (setVal !== '3') {

        if (setVal == '2') {
            var currentVal = '0';
            var dVal = '2';
        } else if (setVal == '1') {
            var currentVal = '0';
            var dVal = '0';
        } else if (setVal == '0') {
            var currentVal = '1';
            var dVal = '1';
        }

        var activity = new Activity();
        activity.targetID = setId;
        activity.activityId = $("#updateAction").val();
        activity.activityUpdateData = dVal;
        activity.activityType = 'owner_co_owner';
        activity.activityCreatedBy = user_id;

        activity._setting((response) => {

            $("#owner_co_owner").attr('data-setval', currentVal);
            $("#owner_co_owner").attr('data-setid', response._setting_response.settingid);

        });
    }
}

function search(elm) {
    $(elm).parents('.dialog-node').hide();
    $(elm).closest('.column-header-inner').find('.drop_active').removeClass('drop_active');
    switch ($(elm).attr('data-type')) {
        case 'duedate':
            $("#searchByddSpan").hide();
            $("#searchBydd").show();
            $("#searchBydd").focus();
            break;
        case 'compdate':
            $("#searchBycdSpan").hide();
            $("#searchBycd").show();
            $("#searchBycd").focus();
            break;
        case 'timeest':
            $("#timeEstCellSPan").hide();
            $("#searchtimeEst").show();
            $("#searchtimeEst").focus();
            break;
        case 'actualtime':
            $("#actualHourCellSpan").hide();
            $("#searchactualHour").show();
            $("#searchactualHour").focus();
            break;
        case 'phase':
            $("#searchByPhaseSpan").hide();
            $("#searchByPhase").show();
            $("#searchByPhase").focus();
            break;
        case 'status':
            $("#searchByStatusSpan").hide();
            $("#searchByStatus").show();
            $("#searchByStatus").focus();
            break;
        case 'manhcost':
            $("#searchMHCSpan").hide();
            $("#searchMHC").show();
            $("#searchMHC").focus();
            break;
        case 'hourlyrate':
            $("#searchHourRateSpan").hide();
            $("#searchHourRate").show();
            $("#searchHourRate").focus();
            break;
        case 'budget':
            $("#searchBudgetSpan").hide();
            $("#searchBudget").show();
            $("#searchBudget").focus();
            break;
        case 'actual':
            $("#searchActualSpan").hide();
            $("#searchActual").show();
            $("#searchActual").focus();
            break;
        case 'variance':
            $("#searchVarianceSpan").hide();
            $("#searchVariance").show();
            $("#searchVariance").focus();
            break;
        case 'timevariance':
            $("#searchtimeVarianceSpan").hide();
            $("#searchtimeVariance").show();
            $("#searchtimeVariance").focus();
            break;
        case 'observer':
            $("#searchObserverSpan").hide();
            $("#searchObserver").show();
            $("#searchObserver").focus();
            break;
        case 'assignee':
            $("#searchAssigneeSpan").hide();
            $("#searchAssignee").show();
            $("#searchAssignee").focus();
            break;
        case 'coowner':
            $("#searchCoownerSpan").hide();
            $("#searchCoowner").show();
            $("#searchCoowner").focus();
            break;
        case 'owner':
            $("#searchOwnerSpan").hide();
            $("#searchOwner").show();
            $("#searchOwner").focus();
            break;
    }
}

function hideColumnSrc(id,showElm){
    $('#'+showElm).show();
    $('#'+id).hide();
    $('#'+id).val('');
    $(".pulse-component:not(#OnlyForClone)").each(function(k, v) {
        $(v).show();
    });
}

function search_Ow_Cow_Ob_Ass(event,srcElm) {
    var code = event.charCode || event.keyCode;
    var valu = $(event.target).val();
    $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(k, v) {
        $(v).hide();
    });

    $('.'+srcElm).each(function(k, obj) {
        $(obj).find('.person-bullet-image').each(function(ky, el) {
            if ($(el).attr('title').toLocaleLowerCase().search(valu.toLocaleLowerCase()) > -1) {
                $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
            }
        });
    });
}

function srcVa_Hac_Bud_Hra_Mhra(event,srcElm,fndElm) {
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39) {
        var valu = $(event.target).val();
        $('.'+srcElm).each(function(k, obj) {
            if ($(obj).find('.'+fndElm).text().search(valu) > -1) {
                $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
            } else {
                $(obj).closest('.pulse-component:not(#OnlyForClone)').hide();
            }
        });
    }
}

function srcPha_Sta(event,srcElm,fndElm) {
    var code = event.charCode || event.keyCode;
    var valu = $(event.target).val();

    $('.'+srcElm).each(function(k, obj) {
        if ($(obj).find('.'+fndElm).text().toLocaleLowerCase().search(valu.toLocaleLowerCase()) > -1) {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
        } else {
            $(obj).closest('.pulse-component:not(#OnlyForClone)').hide();
        }
    });
}

function srcEstT_Acth(event,srcElm) {
    var code = event.charCode || event.keyCode;
    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 13 || code == 37 || code == 39) {
        var valu = $(event.target).val();
        $('.'+srcElm).each(function(k, obj) {
            if ($(obj).attr('data-val').search(valu) > -1) {
                $(obj).closest('.pulse-component:not(#OnlyForClone)').show();
            } else {
                $(obj).closest('.pulse-component:not(#OnlyForClone)').hide();
            }
        });
    }
}

function inputTaskBlur(ele) {
    var id = $(ele).attr('id');
    var value = $(ele).val();
    if (id !== 'taskEHinput' && id !== 'taskAHinput') {
        if (value !== '') {

            var valArray = value.split('.');
            if (valArray[1] == undefined) {
                valArray[1] = '00';
            } else if (valArray[1].length == 1) {
                valArray[1] = '0' + valArray[1];
            }

            $('#' + id).val(valArray[0] + '.' + valArray[1]);
        } else {
            // $('#'+id).val(0+'.'+00);
        }
    } else {
        if (value !== '') {

            var valArray = value.split(':');
            if (valArray[1] == undefined) {
                valArray[1] = '00';
            } else if (valArray[1].length == 1) {
                valArray[1] = '0' + valArray[1];
            }

            $('#' + id).val(valArray[0] + ':' + valArray[1]);
        } else {
            // $('#'+id).val(0+'.'+00);
        }
    }
}

function taskDescKeyUp(e, ele) {
    var id = $(ele).attr('id');
    var html = $(ele).html();
    var text = $(ele).text();
    if (id == 'addTodoTaskDescription') {
        $('#notes_area').html(html);
    } else if (id == 'notes_area') {
        $('#addTodoTaskDescription').html(html);
    }

    if (text == '') {
        $('#notes_area').html('');
        $('#addTodoTaskDescription').html('');
    }

    // var code = e.charCode || e.keyCode || e.which;

    // if (code == 13) {
    if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
        if ($('#updateAction').val() !== '') {
            const activity = new Activity();
            activity.activityId = $('#updateAction').val();
            activity.clusteringKey = $('#actCre').val();
            activity.activityUpdateData = text;
            activity.activityType = 'Task';
            activity.activityUpdateType = 'taskDescKeyUp';

            activity.activityUpdate((response) => {
                console.log(response);
            });
        }
    }
    // }
}

onloadValue();

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(x) {
    return !!(x % 1);
}
function onloadValue(){

    $("#amazonWishlist").click(function (e) {
        if ($("#actCre").val() === user_id) {
            if (e.target.checked) {
                if ($('.country-label').length > 0) {
                    $(".delete_msg_sec_title").text("Are you sure you want to COMPLETE the following Todo ?");
                    $("#completed_activity_div").show();
                } else {
                    $(".delete_msg_sec_title").text("Are you sure you want to COMPLETE the following Todo ?");
                    $("#completed_activity_div").show();
                }
            } else {
                if ($('.country-label').length > 0) {
                    $(".delete_msg_sec_title").text("Are you sure you want to REOPEN the following Todo ?");
                    $("#reopen_activity_div").show();
                } else {
                    $(".delete_msg_sec_title").text("Are you sure you want to REOPEN the following Todo ?");
                    $("#reopen_activity_div").show();
                }
            }
        }
    });

    $('#dueDatePickerDiv').datepicker({
        monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        inline: true,
        altField: '.dueDate-input',
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        // changeYear: true,
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        onSelect: function() {
            if (!$('#n_ToDo_item').is(':visible')) {
                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        const activity = new Activity();
                        activity.activityId = $('#updateAction').val();
                        activity.clusteringKey = $('#actCre').val();
                        activity.activityUpdateData = $("#dueDatePicker").val();
                        activity.activityType = 'Task';
                        activity.activityUpdateType = 'duedate';
    
                        activity.activityUpdate((response) => {
                            console.log(response);
                        });
                    }
                }
            }
        }
    });
    
    $('.dueDate-input').change(function() {
        $('#dueDatePickerDiv').datepicker('setDate', $(this).val());
    });

    
    $("#selectWorkspace").change(function (e) {
        if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
            if($('#updateAction').val() !== ''){
                const activity = new Activity();
                    activity.activityId          = $('#updateAction').val();
                    activity.clusteringKey       = $('#actCre').val();
                    activity.activityUpdateData  = $(e.target).val();
                    activity.activityType        = 'Task';
                    activity.activityUpdateType  = 'workspace';
              
                activity.activityUpdate((response)=>{
                    console.log(response);
                });
            }
        } 
    });

    $('#taskStatusSelect').on('change', function(e) {
        var thisValue = $('#taskStatusSelect').val();
    
        if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
            if ($('#updateAction').val() !== '') {
                const activity = new Activity();
                activity.activityId = $('#updateAction').val();
                activity.clusteringKey = $('#actCre').val();
                activity.activityUpdateData = $(e.target).val();
                activity.activityType = 'Task';
                activity.activityUpdateType = 'taskStatus';
    
                activity.activityUpdate((response) => {
                    console.log(response);
                });
            }
        }
    });

    $("#taskBAinput, #taskAAinput, #taskEHinput, #taskEHRinput, #taskAHinput, #taskAHRinput").on("focusin", function(e) {
        $(e.target).select();
    });

    $("#taskBAinput").on("keyup blur", function(e) {
        var valu = parseFloat($(e.target).text());

        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = (validate.isEmpty($(e.target).val()) ? '0.00' : $(e.target).val());
        activity.activityType = 'Task';
        activity.activityUpdateType = 'taskBAinput';

        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {
                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        if (!isFloat(valu)) {
                            $(event.target).text(parseFloat(valu).toFixed(2));
                        }

                        activity.activityUpdate((response) => {
                            var ba = $('#taskBAinput').val();
                            var aa = $('#taskAAinput').val();
                            var diff = ba - aa;
                            $('#budget_variance span').text(diff);
                            if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
                                $('#budget_variance').removeClass('_inactive');
                            } else {
                                $('#budget_variance').addClass('_inactive');
                            }
                            if (diff > -1) {
                                $('#budget_variance span').css('color', '#53627c');
                            } else {
                                $('#budget_variance span').css('color', 'red');
                            }

                            if (!isFloat(ba)) {
                                $('#taskBAinput').val(parseFloat(ba).toFixed(2));
                            }
                        });
                    }
                }
            }
        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    activity.activityUpdate((response) => {
                        var ba = $('#taskBAinput').val();
                        var aa = $('#taskAAinput').val();
                        var diff = ba - aa;
                        $('#budget_variance span').text(diff);
                        if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
                            $('#budget_variance').removeClass('_inactive');
                        } else {
                            $('#budget_variance').addClass('_inactive');
                        }
                        if (diff > -1) {
                            $('#budget_variance span').css('color', '#53627c');
                        } else {
                            $('#budget_variance span').css('color', 'red');
                        }

                        if (!isFloat(ba)) {
                            $('#taskBAinput').val(parseFloat(ba).toFixed(2));
                        }
                    });
                }
            }
        }

    });

    $("#taskAAinput").on("keyup blur", function(e) {
        var valu = parseFloat($(e.target).text());
        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {
                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {

                        if (validate.isEmpty($(e.target).val())) {
                            $(e.target).val('0.00');
                        }
                        if (!isFloat(valu)) {
                            $(event.target).text(parseFloat(valu).toFixed(2));
                        }

                        const activity = new Activity();
                        activity.activityId = $('#updateAction').val();
                        activity.clusteringKey = $('#actCre').val();
                        activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0.00');
                        activity.activityType = 'Task';
                        activity.activityUpdateType = 'taskAAinput';

                        activity.activityUpdate((response) => {
                            var ba = $('#taskBAinput').val();
                            var aa = $('#taskAAinput').val();
                            var diff = ba - aa;
                            $('#budget_variance span').text(diff);
                            if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
                                $('#budget_variance').removeClass('_inactive');
                            } else {
                                $('#budget_variance').addClass('_inactive');
                            }
                            if (diff > -1) {
                                $('#budget_variance span').css('color', '#53627c');
                            } else {
                                $('#budget_variance span').css('color', 'red');
                            }


                            if (!isFloat(aa)) {
                                $('#taskAAinput').val(parseFloat(aa).toFixed(2));
                            }
                        });
                    }
                }
            }
        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    const activity = new Activity();
                    activity.activityId = $('#updateAction').val();
                    activity.clusteringKey = $('#actCre').val();
                    activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0');
                    activity.activityType = 'Task';
                    activity.activityUpdateType = 'taskAAinput';

                    activity.activityUpdate((response) => {
                        var ba = $('#taskBAinput').val();
                        var aa = $('#taskAAinput').val();
                        var diff = ba - aa;
                        $('#budget_variance span').text(diff);
                        if ($('#taskAAinput').val() !== '' && $('#taskBAinput').val() !== '') {
                            $('#budget_variance').removeClass('_inactive');
                        } else {
                            $('#budget_variance').addClass('_inactive');
                        }
                        if (diff > -1) {
                            $('#budget_variance span').css('color', '#53627c');
                        } else {
                            $('#budget_variance span').css('color', 'red');
                        }

                        if (!isFloat(aa)) {
                            $('#taskAAinput').val(parseFloat(aa).toFixed(2));
                        }
                    });
                }
            }
        }
    });

    $("#taskEHinput").on("keyup blur", function(e) {
        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0:00');
        activity.activityType = 'Task';
        activity.activityUpdateType = 'taskEHinput';

        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {
                if (validate.isEmpty($(e.target).val())) {
                    $(e.target).val('0:00');
                }
                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        activity.activityUpdate((response) => {
                            var eh = $('#taskEHinput').val();
                            var ehr = $('#taskEHRinput').val();
                            var totalmin = 0;
                            var minarray = eh.split(':');
                            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                            $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
                            if (eh !== '' && ehr !== '') {
                                $('#e_h_variance').removeClass('_inactive');
                            } else {
                                $('#e_h_variance').addClass('_inactive');
                            }

                            if (eh.search(/:/i) == -1) {
                                $('#taskEHinput').val(eh + ":00");
                            }

                        });
                    }
                }
            }
        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    activity.activityUpdate((response) => {
                        var eh = $('#taskEHinput').val();
                        var ehr = $('#taskEHRinput').val();
                        var totalmin = 0;
                        var minarray = eh.split(':');
                        totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                        $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
                        if (eh !== '' && ehr !== '') {
                            $('#e_h_variance').removeClass('_inactive');
                        } else {
                            $('#e_h_variance').addClass('_inactive');
                        }

                        if (eh.search(/:/i) == -1) {
                            $('#taskEHinput').val(eh + ":00");
                        }
                    });
                }
            }
        }
    });

    $("#taskAHinput").on("keyup blur", function(e) {

        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0');
        activity.activityType = 'Task';
        activity.activityUpdateType = 'taskAHinput';

        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {

                if (validate.isEmpty($(e.target).val())) {
                    $(e.target).val('0:00');
                }

                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        activity.activityUpdate((response) => {
                            var eh = $('#taskAHinput').val();
                            var ehr = $('#taskAHRinput').val();
                            var totalmin = 0;
                            var minarray = eh.split(':');
                            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                            $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
                            if (eh !== '' && ehr !== '') {
                                $('#e_h_r_variance').removeClass('_inactive');
                            } else {
                                $('#e_h_r_variance').addClass('_inactive');
                            }

                            if (eh.search(/:/i) == -1) {
                                $('#taskAHinput').val(eh + ":00");
                            }
                        });
                    }
                }
            }
        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    activity.activityUpdate((response) => {
                        var eh = $('#taskAHinput').val();
                        var ehr = $('#taskAHRinput').val();
                        var totalmin = 0;
                        var minarray = eh.split(':');
                        totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                        $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
                        if (eh !== '' && ehr !== '') {
                            $('#e_h_r_variance').removeClass('_inactive');
                        } else {
                            $('#e_h_r_variance').addClass('_inactive');
                        }

                        if (eh.search(/:/i) == -1) {
                            $('#taskAHinput').val(eh + ":00");
                        }
                    });
                }
            }
        }

    });

    $("#taskEHRinput").on("keyup blur", function(e) {

        var valu = parseFloat($(e.target).text());


        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0');
        activity.activityType = 'Task';
        activity.activityUpdateType = 'taskEHRinput';

        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {
                if (validate.isEmpty($(e.target).val())) {
                    $(e.target).val('0.00');
                }
                if (!isFloat(valu)) {
                    $(event.target).text(parseFloat(valu).toFixed(2));
                }

                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        activity.activityUpdate((response) => {
                            var eh = $('#taskEHinput').val();
                            var ehr = $('#taskEHRinput').val();
                            var totalmin = 0;
                            var minarray = eh.split(':');
                            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                            $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
                            if (eh !== '' && ehr !== '') {
                                $('#e_h_variance').removeClass('_inactive');
                            } else {
                                $('#e_h_variance').addClass('_inactive');
                            }


                            if (!isFloat(ehr)) {
                                $('#taskEHRinput').val(parseFloat(ehr).toFixed(2));
                            }

                        });
                    }
                }
            }

        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    activity.activityUpdate((response) => {
                        console.log(response);
                        var eh = $('#taskEHinput').val();
                        var ehr = $('#taskEHRinput').val();
                        var totalmin = 0;
                        var minarray = eh.split(':');
                        totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                        $('#e_h_variance span').text(Math.ceil(totalmin * ehr));
                        if (eh !== '' && ehr !== '') {
                            $('#e_h_variance').removeClass('_inactive');
                        } else {
                            $('#e_h_variance').addClass('_inactive');
                        }


                        if (!isFloat(ehr)) {
                            $('#taskEHRinput').val(parseFloat(ehr).toFixed(2));
                        }
                    });
                }
            }
        }

    });

    $("#taskAHRinput").on("keyup blur", function(e) {

        var valu = parseFloat($(e.target).text());
        const activity = new Activity();
        activity.activityId = $('#updateAction').val();
        activity.clusteringKey = $('#actCre').val();
        activity.activityUpdateData = ($(e.target).val() != "" ? $(e.target).val() : '0');
        activity.activityType = 'Task';
        activity.activityUpdateType = 'taskAHRinput';

        if (e.type == 'keyup') {
            var code = e.charCode || e.keyCode || e.which;
            if (code == 13) {
                if (validate.isEmpty($(e.target).val())) {
                    $(e.target).val('0.00');
                }
                if (!isFloat(valu)) {
                    $(event.target).text(parseFloat(valu).toFixed(2));
                }
                if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                    if ($('#updateAction').val() !== '') {
                        activity.activityUpdate((response) => {
                            var eh = $('#taskAHinput').val();
                            var ehr = $('#taskAHRinput').val();
                            var totalmin = 0;
                            var minarray = eh.split(':');
                            totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                            $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
                            if (eh !== '' && ehr !== '') {
                                $('#e_h_r_variance').removeClass('_inactive');
                            } else {
                                $('#e_h_r_variance').addClass('_inactive');
                            }


                            if (!isFloat(ehr)) {
                                $('#taskAHRinput').val(parseFloat(ehr).toFixed(2));
                            }
                        });
                    }
                }
            }
        } else if (e.type == 'blur') {
            if (coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id) {
                if ($('#updateAction').val() !== '') {
                    activity.activityUpdate((response) => {
                        console.log(response);
                        var eh = $('#taskAHinput').val();
                        var ehr = $('#taskAHRinput').val();
                        var totalmin = 0;
                        var minarray = eh.split(':');
                        totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1] : 0)) / 60;
                        $('#e_h_r_variance span').text(Math.ceil(totalmin * ehr));
                        if (eh !== '' && ehr !== '') {
                            $('#e_h_r_variance').removeClass('_inactive');
                        } else {
                            $('#e_h_r_variance').addClass('_inactive');
                        }

                        if (!isFloat(ehr)) {
                            $('#taskAHRinput').val(parseFloat(ehr).toFixed(2));
                        }
                    });
                }
            }
        }
    });
}

socket.on('assignNewTask', function(res) {
    var taskClass = res.task_name.split(" ")[0];
    if (res.assign_id == user_id) {
        var design = '';
        design += '<li creator-id="' + res.creator_id + '" data-urm="0" class="com-t-l todoLink n_td ' + taskClass + '" onclick="openEventTask(this)">';
        design += '<span class="toDo"></span>';
        design += '<span class="toDoName">' + res.task_name + '</span>';
        design += '<img  class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">';
        design += '<span class="unreadMsgCount"></span>';
        design += '<span class="remove" onclick="hideThisTodo(event)"></span>';
        design += '</li>';

        if ($('#allEventTasksList').find('.' + taskClass).length > 0) {
            if ($('#allEventTasksList').find('.' + taskClass).hasClass('activeTodo')) {
                var htm = $("#OnlyForClone").clone();
                var pulse = $('.pulse-component').length;
                var id = $('.pulse_title').length + 1;
                var od = 'newSubtask' + $('.innerDropMeny').length;

                $(htm).attr('id', 'pulse' + pulse).addClass('_eachsubtask');
                $(htm).find('.name-cell-component .pulse_title').text(res.sub_task);
                $(htm).find('.numeric-cell-component .timeInputValue').text('0 h');
                $(htm).find('.numeric-cell-component .amountInputValue').text('0');
                $(htm).find('.owner_img').attr('src', ''+ file_server +'profile-pic/Photos/' + user_img);
                $(htm).find('.owner_img').attr('title', user_fullname);
                $(htm).find('.name-cell-component .pulse_title').attr('id', 'pulseTitle' + id).text(res.sub_task);
                $(htm).find('.name-cell-component .pulse_title').attr('data-title', res.sub_task);

                // $( "#thisWeekPluseContainer").append(htm);

                if ($('#addnewSub').is(':visible')) {
                    if (row_pluse_count == 0) {
                        $('.pulse_title').first().closest('.pulse-component').before(htm);
                    } else if (row_pluse_count == 1) {
                        $('#varienceRow').before(htm);
                    }

                    if (($('.pulse_title').length - 1) > 9) {
                        $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                    }

                    $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                } else {
                    $('.pulse_title').last().closest('.pulse-component').before(htm);
                    var wid = 0;

                    $('.cell-component:visible').each(function(k, v) {
                        wid = wid + $(v).innerWidth();
                    });

                    SubtaskClone.cellcomponent = 17;
                    SubtaskClone.flexSize = wid;
                    SubtaskClone.id = $('.pulse-component').length;

                    $("#thisWeekPluseContainer").append(SubtaskClone.varience());
                    $("#thisWeekPluseContainer").append(SubtaskClone.draw());

                    if (($('.pulse_title').length - 1) > 9) {
                        $('#pulse_' + pulse).find('.row_pluse_count').addClass('twodigi');
                    }

                    $('#pulse_' + pulse).find('.row_pluse_count').text($('.pulse_title').length - 1);
                }

                enabletime();
                subtaskdate();
                keypressBlur();
                countSubtask();
                onDynamicFire();
                tooltipforToDo();
            }
        } else {
            $('#allEventTasksList').append(design);
            $('#eventTasks').show();
        }
    }
});

// function openEventTask(ele) {
//     if (!$(ele).hasClass('activeTodo')) {
//         $('.side_bar_list_item li').removeClass('activeTodo');
//         $('.side_bar_list_item li').removeClass('selected');
//         $(ele).addClass('activeTodo');
//         $(ele).addClass('selected');
//         $('#todoTitle').val($(ele).find('.toDoName').text())
//         $('#taskAssigneeList').find('.assignees').remove();
//         $('#taskOwnerList').find('.sharedIMG').remove();
//         $('#taskOwnerList').find('.count_plus').hide();
//         $('#taskObserverList').find('.count_plus').hide();
//         $('#taskObserverList').find('.observers').remove();
//         $('#taskObserverList').attr('placeholder', 'No Observer');
//         // $('#taskAssigneeList').attr('placeholder', '');
//         $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(user_id).img + '" data-uuid="" class="assignees">');
//         $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser($(ele).attr('creator-id')).img + '" data-uuid="" class="sharedIMG">');
//         $('#taskOwnerList').css({
//             "border": "1px solid #d8d8d8",
//             "pointer-events": " none",
//             "background-color": "#FAFAFA"
//         });
//         $('#selectWorkspace').css({
//             "border": "1px solid #d8d8d8",
//             "pointer-events": " none",
//             "background-color": "#FAFAFA"
//         });
//         $('#selectWorkspace').parents('.fullLabel.team-select').find('.select2-container').css({

//             "pointer-events": " none"
//         });
//         $('#taskObserverList').css({
//             "border": "1px solid #d8d8d8",
//             "pointer-events": " none",
//             "background-color": "#FAFAFA"
//         });
//         $('#taskAssigneeList').css({
//             "border": "1px solid #d8d8d8",
//             "pointer-events": " none",
//             "background-color": "#FAFAFA"
//         });
//         $('#dueDatePicker').css({
//             "border": "1px solid #d8d8d8",
//             "pointer-events": " none",
//             "background-color": "#FAFAFA"
//         });
//     }
// }

// function addActivitAdmin(ele) {

//     activityParticipantType = $(ele).attr('data-type');
//     activityParticipants = temppMangeList;

//     $.each(temppMangeList, (k, v) => {
//         if (!checkFromMultipleArray(participants, v, activityParticipantType)) {
//             participants.push({
//                 id: v,
//                 type: activityParticipantType
//             });
//         }
//     });
//     if (activityParticipantType == 'owner') {

//         coowner = temppMangeList;
//         $('#taskOwnerList img').remove();
//         // $('#taskOwnerList .count_plus').hide();
//         var currentImage = [];
//         var ownerid = $('#actCre').val();
//         $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(ownerid).img + '" data-uuid="' + ownerid + '" class="sharedIMG memberImg' + ownerid + ' ownerThisToDo">');
//         currentImage.push(ownerid);
//         $.each(coowner, (k, v) => {
//             currentImage.push(v);
//             if (currentImage.length < 4) {
//                 $('#taskOwnerList .ownerThisToDo').after('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="sharedIMG memberImg' + v + '">');
//             }
//             if (currentImage.length > 3) {
//                 $('#taskOwnerList .count_plus').show();
//                 $('#taskOwnerList .count_plus').text('+' + (currentImage.length - 3));
//             }
//         });

//     } else if (activityParticipantType == 'observer') {
//         observer = temppMangeList;
//         // $('#taskObserverList img').remove();
//         $('#taskObserverList .count_plus').hide();
//         var currentImage = [];
//         $.each(observer, (k, v) => {
//             currentImage.push(v);
//             if (currentImage.length < 4) {
//                 $('#taskObserverList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
//             }
//             if (currentImage.length > 3) {
//                 $('#taskObserverList .count_plus').show();
//                 $('#taskObserverList .count_plus').text('+' + (currentImage.length - 3));
//             }
//         });
//         if (observer.length > 0) {
//             // $('#taskObserverList').attr('placeholder', '');
//         } else {
//             $('#taskObserverList').attr('placeholder', 'Add Observer');
//         }
//     } else if (activityParticipantType == 'assignee') {
//         assignee = temppMangeList;
//         // $('#taskAssigneeList img').remove();
//         $('#taskAssigneeList .count_plus').hide();
//         if (assignee.length == 1) {
//             $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(assignee[0]).img + '" data-uuid="' + assignee[0] + '" class="assignees memberImg' + assignee[0] + '">');
//         }
//         if (assignee.length > 0) {
//             // $('#taskAssigneeList').attr('placeholder', '');
//         } else {
//             $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
//         }
//     }
//     $('#taskManage').hide();
// }

function checkFromMultipleArray(array, val1, val2) {
    let cc = 0;
    $.each(array, function(k, v) {
        if (v.id == val1 && v.type == val2) {
            cc++;
        }
    });

    if (cc > 0) {
        return true
    } else {
        return false;
    }
}

function lowZindex(type) {
    if (type == 'low') {
        $('.group-header-wrapper').addClass('lowZindex');
        $('.content-wraper').addClass('lowZindex');
        $('.to_do_header').addClass('lowZindex');
        onscrollevent = 0;
    } else if (type == 'high') {
        $('.group-header-wrapper').removeClass('lowZindex');
        $('.content-wraper').removeClass('lowZindex');
        $('.to_do_header').removeClass('lowZindex');
        onscrollevent = 1;
    }
}

function archiveView(elm) {
    var targetElm = $('.pulse-left-indicator.can-edit').parents('.pulse-component');

    if ($(elm).hasClass('active')) {
        $(elm).removeClass('active');
        $(elm).text('Show Archive');
        $.each(targetElm, function(k, v) {
            if ($(v).hasClass('archived')) {
                $(v).hide();
            } else {
                $(v).show();
                $('#OnlyForClone').hide();
            }
        });
    } else {
        $(elm).addClass('active');
        $(elm).text('Hide Archive');
        $.each(targetElm, function(k, v) {
            if ($(v).hasClass('archived')) {
                $(v).show();
            } else {
                $(v).hide();
                $('#addnewSub').show();
            }
        });
    }
}

function addToArchive(elm) {
    var targetElm = $(elm).parents('.pulse-component');

    if ($(elm).hasClass('removeArchive')) {
        $(elm).find('.name_label').text('Add To Archive');
        $(elm).removeClass('removeArchive');
        if (targetElm.hasClass('archived')) {
            targetElm.removeClass('archived');
            targetElm.hide();
        }
    } else {
        $(elm).find('.name_label').text('Remove To Archive');
        $(elm).addClass('removeArchive');
        if (!targetElm.hasClass('archived')) {
            targetElm.addClass('archived');
            targetElm.hide();
        }
    }

    $('.subtaskAllFile').hide();
    $('.more_files').removeClass('active_files');
    lowZindex('high');

    if ($('.showArchive').hasClass('active')) {
        if ($('.pulse-component.archived').length == 0) {
            $('.showArchive.active').trigger('click');
        }
    } else {
        if ($('.pulse-component.archived').length > 0) {
            if ($('.pulse-component:visible').length == 2) {
                $('.showArchive').trigger('click');
            }
        }
    }
}

$('.workspaceform').scroll(function(event) {

    if (onscrollevent == 0) {
        $('.workspaceform').scrollTop(insScrollTop);
    }
    if ($('.workspaceform').scrollTop() == 0) {
        $('#fpc_effect-back').show();
    } else {
        $('#fpc_effect-back').hide();
    }
});

function toggleCalPicker(e, elm) {
    $(elm).css('pointer-events', 'none');
    if (dueDataCall) {
        dueDataCall = false;
        subtaskdate()
    }
}

/////////////////search user container///////////////

function searchUsersContainer(eve, type) {
    var value = $(eve.target).val();
    if (eve.keyCode !== 40 && eve.keyCode !== 38) {
        var myelm = $(eve.target).next('.users_container').find('.usersList');
        $.each(myelm, function(k, v) {
            if ($(v).find('.name_label').text().toLowerCase().search(value.toLowerCase()) > -1) {
                $(v).show();
            } else {
                $(v).hide();
            }
        });

        $(eve.target).next('.users_container').find('.usersList .name_label').unhighlight();
        $(eve.target).next('.users_container').find('.usersList .name_label').highlight(value);
    }
}


function filteringTaskList(elm) {
    if ($(elm).hasClass('active')) {
        $(elm).text('Hide Completed Subtask(s)');
        $(elm).removeClass('active');
        $('.pulse-component._eachsubtask').show();
    } else {
        $(elm).addClass('active');
        $(elm).text('Show All Subtask(s)');
        $('.pulse-left-indicator[data-value="#00c875;"]').parents('.pulse-component._eachsubtask').hide();
    }
}

function updatePaseColor(elm) {

    if ($(elm).parents('.StatusCell').length > 0) {
        var targetID = $(elm).parent('.statusChangeColor').prev('.single_status').find('.statusLabel').attr('data-id');
        var exc = $(elm).parent('.statusChangeColor').prev('.single_status').css('background-color');
        var thisbgcolor = $(elm).css('background-color');
        $(elm).parent('.statusChangeColor').prev('.single_status').css('background-color', thisbgcolor).attr('data-color', thisbgcolor);
    } else {
        var targetID = $(elm).parent('.priorityChangeColor').prev('.single_priority').find('.priorityLabel').attr('data-id');
        var thisbgcolor = $(elm).css('background-color');
        var exc = $(elm).parent('.priorityChangeColor').prev('.single_priority').css('background-color');
        $(elm).parent('.priorityChangeColor').prev('.single_priority').css('background-color', thisbgcolor).attr('data-color', thisbgcolor);
    }

    $(elm).closest('.color-cell').find('.menu-color').css('background-color', thisbgcolor);

    var activity = new Activity();

    activity.activityUpdateType = 'statusClr';
    activity.activityUpdateData = $(elm).css('background-color');
    activity.activityId = targetID;

    activity.activityUpdate((response) => {
        console.log(response);
    });
    $(elm).css('background-color', exc);
}

function editPrioritylabel(e) {
    $(e).focus();
    if ($(e).is(':focus')) {
        $(e).css().parents('.single_priority').css();
    }
}

function editProiority(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $(elm).parent('.single_priority').find('.priorityLabel').attr('contenteditable', true);
    $(elm).parent('.single_priority').find('.priorityLabel').focus();
    placeCaretAtEnd($(elm).parent('.single_priority').find('.priorityLabel')[0]);
}

function editStatuslabel(e) {
    $(e).focus();
    if ($(e).is(':focus')) {
        $(e).css()
            .parents('.single_status')
            .css();
    }
}

function editStatusLabel(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(elm).parent('.single_status').find('.statusLabel').attr('contenteditable', true);
    $(elm).parent('.single_status').find('.statusLabel').focus();
    placeCaretAtEnd($(elm).parent('.single_status').find('.statusLabel')[0]);
}

function removeProiority(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var removeColor = $(elm).parent('.single_priority').css('background-color');
    var html = '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="' + removeColor + '" style="background-color: ' + removeColor + '"></div>';
    $(elm).parents('.priority-picker-wrapper').find('.priority-color-wrapper .status-change-color.open').append(html);
    $('#subtaskWarningBackwrap').show();
    $('#subtaskWarningTitle').text('Remove Phase');
    $('#subtaskWarningMessage').text('Are you sure you want to remove this phase ? This cannot be UNDONE.');
    $('#subtaskWarningContent').html($(elm).parent('.single_priority')[0].outerHTML);
    subtaskWarningElm = $(elm);
    $('#removeBtnWarning').attr('data-type', 'phase');
    $('#removeBtnWarning').attr('data-status', $(elm).attr('data-id'));
}

function removeStatusLabel(e, elm) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var removeColor = $(elm).parent('.single_status').css('background-color');
    var html = '<div class="create_priority_status status-change-color-icon open" onclick="updatePaseColor(this)" data-color="' + removeColor + '" style="background-color: ' + removeColor + '"></div>';
    $(elm).parents('.status-picker-wrapper').find('.status-color-wrapper .status-change-color.open').append(html);

    $('#subtaskWarningBackwrap').show();
    $('#subtaskWarningTitle').text('Remove Status');
    $('#subtaskWarningMessage').text('Are you sure you want to remove this status ? This cannot be UNDONE.');
    $('#subtaskWarningContent').html($(elm).parent('.single_status')[0].outerHTML);
    subtaskWarningElm = $(elm);
    $('#removeBtnWarning').attr('data-type', 'status');
    $('#removeBtnWarning').attr('data-status', $(elm).attr('data-id'));
}

function flagSubtask(elm) {
    var statusCheck = $(elm).hasClass('flagged');
    var acid = $(elm).attr('data-id');
    if (statusCheck) {

        var activity = new Activity();
        activity.activityId = $(elm).attr('data-flagid');
        activity.activityCreatedBy = acid;
        activity.activityUpdateData = 'unflag';

        activity.activityUtility((response) => {
            $(elm).removeClass('flagged');
        });
    } else {

        var activity = new Activity();
        activity.activityId = acid;
        activity.activityCreatedBy = user_id;
        activity.activityUpdateData = 'flag';

        activity.activityUtility((response) => {
            $(elm).attr('data-flagid', response.activityUtilityResponse.respons.id);
            $(elm).addClass('flagged');
        });
    }
}

function memberDistribute(elm) {
    $('.assignee_users').find('.users_container').html("");
    $(elm).next('.assignee_users').find('.src_users').focus();
    var activityid = $(elm).attr('data-id');
    var activityCreatedBy = $(elm).attr('data-createdby');
    if ($('.assignee_users').is(':visible')) {
        if ($(elm).hasClass('person-cell-component')) {
            $('.assignee_users').hide();
        }
    } else {
        $(elm).next('.assignee_users').show();

        if ($(elm).hasClass('st_coWoner_value')) {
            var ownerArrName = [];

            $.each($(elm).parent('.st_coWoner.pro_name_value').siblings('.st_owner.pro_name_value').find('.person-bullet-component .owner_img'), (k, v) => {
                if ($(v).attr('title') != undefined) {
                    ownerArrName.push($(v).attr('title').toLowerCase());
                }
            });

            $.each(workspace_user, function(k, v) {
                if (ownerArrName.indexOf(v.fullname.toLowerCase()) == -1) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allcoOwner = $(elm).find('.person-bullet-component.inline-image img');


                    var alreadycoOwnerid = [];

                    $.each(allcoOwner, function(kaaa, vaaa) {
                        alreadycoOwnerid.push($(vaaa).attr('data-uuid'))
                    });

                    if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                        var usersDesign = '<div data-uid="' + v.id + '"  class="usersList ' + ((alreadycoOwnerid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsCoOwner(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                        if ($("#actCre").val() == v) {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                        } else {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                        }
                        usersDesign += '</div>';
                        $('.users_container').append(usersDesign);
                    } else {
                        var usersDesign = '<div data-uid="' + v.id + '"  class="usersList" id="subtask_' + id + '" onclick="addAsCoOwner(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                        usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                        usersDesign += '</div>';
                        $('.users_container').append(usersDesign);
                    }
                }
            });
        } else if ($(elm).hasClass('st_observer_value')) {
            var ownerArrName = [];
            var cownerArrName = [];

            $.each($(elm).parent('.st_observer').siblings('.st_owner.pro_name_value').find('.person-bullet-component .owner_img'), (k, v) => {
                ownerArrName.push($(v).attr('title').toLowerCase());
            });
            $.each($(elm).parent('.st_observer').siblings('.st_coWoner.pro_name_value').find('.person-bullet-component .person-bullet-image'), (k, v) => {
                cownerArrName.push($(v).attr('title').toLowerCase());
            });

            $.each(workspace_user, function(k, v) {
                if (ownerArrName.indexOf(v.fullname.toLowerCase()) == -1 && cownerArrName.indexOf(v.fullname.toLowerCase()) == -1) {
                    var id = v.id;
                    var img = v.img;
                    var fullname = v.fullname;
                    var allAssignee = $(elm).parents('.st_observer.pro_name_value').siblings('.st_assignee.pro_name_value').find('.st_assignee_value .person-bullet-component.inline-image img');
                    var allObserver = $(elm).find('.person-bullet-component.inline-image img');
                    var allAssigneeid = [];
                    $.each(allAssignee, function(kaaa, vaaa) {
                        allAssigneeid.push($(vaaa).attr('data-uuid'))
                    });
                    var alreadyObserverid = [];
                    $.each(allObserver, function(kaaa, vaaa) {
                        alreadyObserverid.push($(vaaa).attr('data-uuid'))
                    });

                    if (allAssigneeid.indexOf(v.id) == -1) {
                        if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                            var usersDesign = '<div data-uid="' + v.id + '"  class="usersList ' + ((alreadyObserverid.indexOf(v.id) > -1) ? 'active' : '') + '" id="subtask_' + id + '" onclick="addAsObsrvr(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            if ($("#actCre").val() == v) {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                            } else {
                                usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            }
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        } else {
                            var usersDesign = '<div data-uid="' + v.id + '"  class="usersList" id="subtask_' + id + '" onclick="addAsObsrvr(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                            usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                            usersDesign += '</div>';
                            $('.users_container').append(usersDesign);
                        }
                    }
                }
            });

        } else if ($(elm).hasClass('st_assignee_value')) {
            $.each(workspace_user, function(k, v) {
                var id = v.id;
                var img = v.img;
                var fullname = v.fullname;
                var allObserver = $(elm).parents('.st_assignee.pro_name_value').siblings('.st_observer.pro_name_value').find('.st_observer_value .person-bullet-component.inline-image img');
                var allobserversid = [];
                // var alreadyObserverid = [];
                $.each(allObserver, function(kaaa, vaaa) {
                    allobserversid.push($(vaaa).attr('data-uuid'))
                    // if(alreadyObserverid.indexOf($(vaaa).attr('data-uuid')) == -1){
                    //   alreadyObserverid.push($(vaaa).attr('data-uuid'))
                    // }
                });
                if (allobserversid.indexOf(v.id) == -1) {
                    if (sharedMemberList.indexOf(v.id.toString()) > -1) {
                        var usersDesign = '<div data-uid="' + v.id + '"  class="usersList" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)">';
                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                        if ($("#actCre").val() == v) {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '<span> (Owner)</span></h3>';
                        } else {
                            usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                        }
                        usersDesign += '</div>';
                        $('.users_container').append(usersDesign);
                    } else {
                        var usersDesign = '<div data-uid="' + v.id + '"  class="usersList" id="subtask_' + id + '" onclick="addAsAssignee(\'' + id + '\',\'' + activityid + '\',\'' + activityCreatedBy + '\',\'' + img + '\',this)" style="display:none">';
                        usersDesign += '<img src="'+ file_server +'profile-pic/Photos/' + img + '" class="demo_img" title="' + v.fullname + '" alt="' + v.fullname + '">';
                        usersDesign += '<h3 class="name_label">' + v.fullname + '</h3>';
                        usersDesign += '</div>';
                        $('.users_container').append(usersDesign);
                    }
                }
            });
        }
    }
}

function setToastr(elm, type) {
    if (type == 'toastr') {
        if ($(elm).siblings('#tstr_popup').is(':visible')) {
            $(elm).siblings('#tstr_popup').hide();
        } else {
            $(elm).siblings('#tstr_popup').show().removeClass('tr_pop').addClass('ts_pop').show();
        }
    } else if (type == 'email') {
        if (!$(elm).hasClass('active')) {
            $('li.tstr_element').removeClass('active');
            $(elm).addClass('active');
            $('#tstr_btn').text($(elm).text());
            $('#tstr_popup').hide()
        } else {
            $(elm).removeClass('active');
            $('#tstr_btn').text('Toastr');
        }
    } else if (type == 'msg') {
        if (!$(elm).hasClass('active')) {
            $('li.tstr_element').removeClass('active');
            $(elm).addClass('active');
            $('#tstr_btn').text($(elm).text());
            $('#tstr_popup').hide()
        } else {
            $(elm).removeClass('active');
            $('#tstr_btn').text('Toastr');
        }
    }
}

function setReminder(elm, type) {
    if (type == 'reminder') {
        if ($(elm).siblings('#tstr_popup').is(':visible')) {
            $(elm).siblings('#tstr_popup').hide();
        } else {
            $(elm).siblings('#tstr_popup').show().removeClass('ts_pop').addClass('tr_pop').show();
        }
    } else if (type == 'beforeMin') {
        let data = $(elm).attr('data-value');
        if (!$(elm).hasClass('active')) {
            $('li.reminder_element').removeClass('active');
            $(elm).addClass('active');
            $('#minutes_btn').text(data + ' Minutes');
            $('#tstr_popup').hide();
        } else {
            $(elm).removeClass('active');
            $('#minutes_btn').text('Minutes');
        }
    }
}

function addCustomMinutes(e) {
    if (e.keyCode == 13) {
        let data = $(e.target).val();
        let _parent = $(e.target).parent('.reminder_element');
        let html = '<li class="reminder_element" data-value="' + data + '" onclick="setReminder(this,\'beforeMin\')">Before ' + data + ' Minutes</li>'
        $(html).insertBefore(_parent);
        $(e.target).val('');
        $('#minutes_btn').text(data + ' Minutes');
        $('#tstr_popup').hide();
    }
}

function closeMiniPopUp(id) {
    $('#' + id).hide();
    $('.' + id).hide();
    if (id == 'dueDatePickerDiv') {
        $('#dueDatePicker').css('pointer-events', 'auto');
    }
    if (id == 'emoji_div') {
        $('.msg-separetor-unread').show();
        $('.emoji_div').remove();
    }
}

function applyBatchProcessing() {
    var activityid = $('#updateAction').val();
    $("#activity_" + activityid).click();

    isBatchActive = 0;
    isBatchActive_ob = 0;

    $('#batchProcessing').hide();
}

function showHelp() {
    $('#helpContainer').css('right', '0px');
}

function shareMessage(event){
	selectedShareMember = [];
	$('#shareMessagePopUp').show();
	var msg_id = $(event.target).closest('.msgs-form-users').attr('data-msgid');
	$('#shareMessagePopUp').find('.shareButton').attr('data-msgid', msg_id);
	$('.searchInput').html("");
	$('#shareSuggestedList').html("");
	$('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
	var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);

	$.each(user_list, function(k,v){
		if(participants.indexOf(v.id) == -1 && v.id !== user_id){
            if(!has_permission(v.id,1600)){
                $('#shareSuggestedList').append(userListDesign(v));
            }
		}
	});
	popupMouseEnter();

}
function share_this_msg_with(event){
	// if(selectedShareMember.length>0){
	// 	if(selectedMessages.length>0){
	// 		$.each(selectedMessages, function(k, v){
	// 			socket.emit('share_with', {msg_id:v, user_id, user_img, user_fullname, selectedShareMember}, (res)=>{
	// 				if(res){
	// 					for(var m=0; m<selectedShareMember.length; m++){
	// 						var convid = getconvidfromlist(user_id, selectedShareMember[m]);
	// 						if(convid != -1){
	// 							var lskey = has_conv_into_local(convid);
	// 							if(lskey != -1){
	// 								remove_conv_from_local(lskey);
	// 							}
	// 						}
	// 					}
	// 					closeModal('shareMessagePopUp');
	// 				}
	// 			});
	// 			if(selectedMessages.length == (k+1)){
	// 				var ele = $("#selectMessage");
	// 				selectMessageOn(ele);
	// 			}
	// 		});
	// 	}
	// 	else{
	// 		var msg_id = $(event.target).attr('data-msgid');
	// 		socket.emit('share_with', {msg_id, user_id, user_img, user_fullname, selectedShareMember}, (res)=>{
	// 			if(res){
	// 				for(var m=0; m<selectedShareMember.length; m++){
	// 					var convid = getconvidfromlist(user_id, selectedShareMember[m]);
	// 					if(convid != -1){
	// 						var lskey = has_conv_into_local(convid);
	// 						if(lskey != -1){
	// 							remove_conv_from_local(lskey);
	// 						}
	// 					}
	// 				}
	// 				closeModal('shareMessagePopUp');
	// 			}
	// 		});
	// 	}
	// }else{
	// 	closeModal('shareMessagePopUp');
	// }
};

function userListDesign(data){
    if ($('#shareMessagePopUp').is(':visible')) {
        if($('#roomIdDiv').attr('topic-type') == 'work'){
            console.log(19946,data)
            var design = '<li class="memberContainer showEl" id="suggestUsers' + data.conversation_id + '" data-id="' + data.conversation_id + '" dat-img-src="' + data.conv_img + '" data-fullname="' + data.title + '" onclick="forSharemsg(\'' + data.conversation_id + '\', \'' + data.title + '\', \'' + data.conv_img + '\')">';
            design += '<img src="'+file_server+'/room-images-uploads/Photos/' + data.conv_img + '" class="profile">';
            design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.conversation_id + '">' + data.title + '</span>';
            design += '<span class="designation-name">@ Navigate</span>';
            design += '</li>';
        }else{
            var design = '<li class="memberContainer showEl" id="suggestUsers' + data.id + '" data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="' + data.fullname + '" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
            design += '<img src="'+ file_server +'profile-pic/Photos/' + data.img + '" class="profile">';
            design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
            design += '<span class="designation-name">@ Navigate</span>';
            design += '</li>';
        }
    } else if ($('#groupAdminArea').is(':visible')) {
        var design = '<li class="memberContainer suggestUsers' + data.id + ' showEl"  data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
        design += '<img src="'+ file_server +'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="online_' + data.id + ' ' + (onlineUserList.indexOf(data.id) === -1 ? "offline" : "online") + '"></span>';
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '</li>';
    } else if ($('#createDirMsgContainer').is(':visible')) {
        var design = '<li class="showEl"> ';
        design += '<img src="'+ file_server +'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="name s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '<span class="designation-name">@ Navigate</span>';
        design += '</li>';
    } else if ($('#ownerAreaForTodo').is(':visible')) {
        var design = '<li class="memberContainer suggestUsers' + data.id + ' showEl"  data-id="' + data.id + '" dat-img-src="' + data.img + '" data-fullname="" onclick="userAddAction(\'' + data.id + '\', \'' + data.fullname + '\', \'' + data.img + '\')">';
        design += '<img src="'+ file_server +'profile-pic/Photos/' + data.img + '" class="profile">';
        design += '<span class="online_' + data.id + ' ' + (onlineUserList.indexOf(data.id) === -1 ? "offline" : "online") + '"></span>';
        design += '<span class="userFullName s-l-def-clas" data-uuid="' + data.id + '">' + data.fullname + '</span>';
        design += '</li>';
    }

    return design;
}

function filter_user_list(event){
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

function searchsldefclas(event, value){
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

function userAddAction(uuid, username, imgsrc) {
    console.log(20032)
    if ($('#shareMessagePopUp').is(':visible')) {
        if (selectedShareMember.length < 10) {
            draw_name();
            var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="'+ file_server +'profile-pic/Photos/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\''+ file_server +'profile-pic/Photos/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
            $('.searchInput').append(design);
            make_content_non_editable('selected_member_name');
            $('#suggestUsers' + uuid).remove();
            selectedShareMember.push(uuid);
            var el = document.getElementById('searchInputForShare');
            placeCaretAtEnd(el);
            $('.no_of_user_left_to_add span').text(10 - selectedShareMember.length);
        } else {
            toastr["warning"]("This member is not allowed.", "Warning");
        }
    } else if ($('#groupAdminArea').is(':visible')) {
        if (!$('.suggestUsers' + uuid).hasClass('adminProfile')) {
            draw_name();
            var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="'+ file_server +'profile-pic/Photos/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\''+ file_server +'profile-pic/Photos/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
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
            var design = '<span class="selected_member_name" data-uuid="' + uuid + '" data-img="'+ file_server +'profile-pic/Photos/' + imgsrc + '" contenteditable="false"><span class="user_name">' + username + '</span><img src="/images/basicAssets/Remove.svg" onclick="remove_this_user_search(event,\'' + uuid + '\',\''+ file_server +'profile-pic/Photos/' + imgsrc + '\',\'' + username + '\')"></span> &shy;';
            $('#searchForOwnerToDo').append(design);
            make_content_non_editable('selected_member_name');
            $('.suggestUsers' + uuid).remove();
            activity_participantsArr.push(uuid);
            var el = document.getElementById('searchForOwnerToDo');
            placeCaretAtEnd(el);
        }
    }
}

function draw_name() {
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
function make_content_non_editable(classname){
    var spans = document.getElementsByClassName(classname);
    for (var i = 0, len = spans.length; i < len; ++i) {
        spans[i].contentEditable = "false";
    }
    $('.no_of_user_left_to_add>span').text(10 - memberListUUID.length);
};

function remove_this_user_search(event, uuid, imgsrc, name) {
    if ($('#shareMessagePopUp').is(':visible')) {
        $(event.target).parent('.selected_member_name').remove();
        removeA(selectedShareMember, uuid);
        var newimgsrc = imgsrc.split('/');
        var design = '<li class="memberContainer showEl" id="suggestUsers' + uuid + '" data-id="' + uuid + '" dat-img-src="' + newimgsrc[newimgsrc.length - 1] + '" data-fullname="' + name + '" onclick="userAddAction(\'' + uuid + '\', \'' + name + '\', \'' + newimgsrc[newimgsrc.length - 1] + '\')">';
        design += '<img src="'+ file_server +'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
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
        html += '<img src="'+ file_server +'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
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
        html += '<img src="'+ file_server +'profile-pic/Photos/' + newimgsrc[newimgsrc.length - 1] + '" class="profile">';
        html += '<span class="online_' + uuid + ' ' + (onlineUserList.indexOf(uuid) === -1 ? "offline" : "online") + '"></span>';
        html += '<span class="userFullName s-l-def-clas" data-uuid="' + uuid + '">' + name + '</span>';
        html += '</li>';
        $('#ownerAreaSUggestedList').append(html);
        popupMouseEnter();
        draw_name();
    }

}
//for close modal
function closeModal(id) {
    $('#' + id).hide();
    if (id == 'notificationPopup') {
        $('.radioItem.selected').removeClass('selected');
        $("input[type='radio'][name='muteNotification'][value='30M']").closest('label').trigger('click');
        $('#notificationPopup').attr('data-mute-id', "");
        $('#muteDeleteButton').hide();
    } else if (id == 'groupAdminArea') {
        $("#roomIdDiv").attr('data-rfu', "");
    } else if (id == 'msgUrlPreview') {
        $('#msgUrlPreview .url_title').html('');
        $('#msgUrlPreview .ulr_img').html('');
        $('#msgUrlPreview .url_desc').html('');
    }
}
 
// +++++++++++++++++++++++++++++++++++++++++++++++++ //
// +++++++ KANBAN VIEW JS BY @Manzu@ +++++++++++++++ //
// +++++++++++++++++++++++++++++++++++++++++++++++++ //

/*=========== close area icon=========*/
$('html, body').on('click','.close_area_icon', function(event){
// $('.close_area_icon').click(function(e) {
    $('#observerNew').hide();
    $('#assignee_area').hide();
    $('#coowner_area').hide();
    $('#completeDate_area').hide();
    $('#date_area').hide();
    $('#ownner_area').hide();
    $('#status_area').hide();
    $('#phase_area').hide();
    $('.subtaskContainer').show();
    $(".multipleProgress").show();
    $('a.add-column-menu-button').show();
});

function observer_colum() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div").html('');
    $.each(uniqueObserver, (k, v) => {
        var design = '<ul id="observer_' + k + '" class="sortable_list connectedSortable">';
        design += '<li class="activeClass">' + findObjForUser(v).fullname + '</li>';
        $.each(partiArry, function(kpar, vpar) {
            if (vpar.user_id.toString() == v && vpar.participant_type == 'observer') {
                design += '<li class="">' + $("#pulse_" + vpar.activity_id.toString() + ' .pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                design += '</div>'

                design += '<div class="subtaskAllFile">'
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
                design += '</div>'
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                design += ' </div>'
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                design += '</div>'
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                design += '<h3 class="name_label">Chat</h3>'
                design += '</div>'
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                design += '<h3 class="name_label">View File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi" id="">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
                design += ' <h3 class="name_label">Add To Archive</h3>'
                design += ' </div>'
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
                design += ' <h3 class="name_label">Delete</h3>'
                design += ' </div>'
                design += '</div>'
                design += '</li>';
            }
        });

        design += '</ul>';
        $("#sortable_div").append(design);
    });

    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#observerNew').show();
    $(".multipleProgress").hide();

    // Close  sortable_list area

    // For  sortable_list
    $(".sortable_list").sortable({
        connectWith: ".connectedSortable",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999

    }).disableSelection();
    var liLength = $(".sortable_list").length;
    if (liLength < 5) {
        $('.pulse-new-component').css({
            'width': 'auto',

        });
        $(".sortable_list").css({
            'width': '23%',
        });
    }
    if (liLength == 2) {
        $('.pulse-new-component').css({
            'width': 'auto',

        });
        $(".sortable_list").css({
            'width': '45%',
        });
    }
    if (liLength == 1) {
        $('.pulse-new-component').css({
            'width': 'auto',

        });
        $(".sortable_list").css({
            'width': '94%',
        });
    }

}

function assigneeDetail() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }

    $("#sortable_div2").html('');
    $.each(uniqueAssine, (k, v) => {
        var design = '<ul id="assignee_' + k + '" class="sortable_list2 connectedSortable_2">';
        design += '<li class="activeClass">' + findObjForUser(v).fullname + '</li>';

        $.each(partiArry, function(kassine, vassine) {
            if (vassine.user_id.toString() == v && vassine.participant_type == 'assignee') {
                design += '<li class="">' + $("#pulse_" + vassine.activity_id.toString() + ' .pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                design += '</div>'

                design += '<div class="subtaskAllFile">'
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
                design += '</div>'
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                design += ' </div>'
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                design += '</div>'
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                design += '<h3 class="name_label">Chat</h3>'
                design += '</div>'
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                design += '<h3 class="name_label">View File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi" id="">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
                design += ' <h3 class="name_label">Add To Archive</h3>'
                design += ' </div>'
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
                design += ' <h3 class="name_label">Delete</h3>'
                design += ' </div>'
                design += '</div>'
                design += '</li>'

            }
        });
        design += '</ul>';
        $("#sortable_div2").append(design);
    });

    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#assignee_area').show();
    $(".multipleProgress").hide();


    // For  sortable_list2

    $(".sortable_list2").sortable({
        connectWith: ".connectedSortable_2",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999
    }).disableSelection();


    var li_sortLength = $(".sortable_list2").length;
    //alert(li_sortLength);
    if (li_sortLength == 1) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list2").css({
            'width': '90% ',
        });
    }


    if (li_sortLength == 2) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list2").css({
            'width': '45%',
        });
    }
    if (li_sortLength > 2) {
        $('.pulse-new-component').css({
            'width': '94%',
        });

        $(".sortable_list2").css({
            'width': '23%',
        });
    }

}

function coowoner_canbanview() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div7").html('');
    $.each(uniqCoowner, (kcw, vcw) => {
        var design = '<ul id="owner_' + kcw + '" class="sortable_list7 connectedSortable_7">';
        design += '<li class="activeClass">' + findObjForUser(vcw).fullname + '</li>';

        $.each(partiArry, function(ksp2, vsp2) {
            if (vsp2.user_id.toString() == vcw && vsp2.participant_type == 'owner') {
                design += '<li class="">' + $("#pulse_" + vsp2.activity_id.toString() + ' .pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                design += '</div>'

                design += '<div class="subtaskAllFile">'
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
                design += '</div>'
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                design += ' </div>'
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                design += '</div>'
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                design += '<h3 class="name_label">Chat</h3>'
                design += '</div>'
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                design += '<h3 class="name_label">View File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi" id="">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
                design += ' <h3 class="name_label">Add To Archive</h3>'
                design += ' </div>'
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
                design += ' <h3 class="name_label">Delete</h3>'
                design += ' </div>'
                design += '</div>'

                design += '</li>'

            }
        });

        design += '</ul>';
        $("#sortable_div7").append(design);
    });

    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#custom_toDoMoreOptionView').hide();
    $('#coowner_area').show();
    $(".multipleProgress").hide();
    // Close  sortable_list area

    // For  sortable_list
    $(".sortable_list7").sortable({
        connectWith: ".connectedSortable_7",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999

    }).disableSelection();

    var li_coOwnerLengthLast = $(".sortable_list7").length;
    if (li_coOwnerLengthLast == 1) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list7").css({
            'width': '90% ',
        });
    }

    if (li_coOwnerLengthLast == 2) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list7").css({
            'width': '45%',
        });
    }
    if (li_coOwnerLengthLast > 2) {
        $('.pulse-new-component').css({
            'width': 'auto',
        });

        $(".sortable_list7").css({
            'width': '23%',
        });
    }

}

function phaseActivety() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div3").html('');
    
    $.each(unipriority, (ku, vu) => {
        var design = '<ul id="priority_' + ku + '" class="sortable_list3 connectedSortable_3">';
        design += '<li class="activeClass">' + vu + '</li>';

        $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(k, v) {
            if ($(v).find('.priorityCell .view_priority').text() == vu) {
                design += '<li class="">' + $(v).find('.pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                design += '</div>'

                design += '<div class="subtaskAllFile">'
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
                design += '</div>'
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                design += ' </div>'
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                design += '</div>'
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                design += '<h3 class="name_label">Chat</h3>'
                design += '</div>'
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                design += '<h3 class="name_label">View File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi" id="">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
                design += ' <h3 class="name_label">Add To Archive</h3>'
                design += ' </div>'
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
                design += ' <h3 class="name_label">Delete</h3>'
                design += ' </div>'
                design += '</div>'
                design += '</li>'
            }
        });
        design += '</ul>';
        $("#sortable_div3").append(design);
    });

    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#phase_area').show();
    $(".multipleProgress").hide();

    $(".sortable_list3").sortable({
        connectWith: ".connectedSortable_3",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999
    }).disableSelection();


    var li_sortLengthLast = $(".sortable_list3").length;

    if (li_sortLengthLast == 1) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list3").css({
            'width': '90% ',
        });
    }


    if (li_sortLengthLast == 2) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list3").css({
            'width': '45%',
        });
    }
    if (li_sortLengthLast > 2) {
        $('.pulse-new-component').css({
            'width': '94%',
        });

        $(".sortable_list3").css({
            'width': '23%',
        });
    }

}

function status_canban_popup() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div4").html('');
    var demo_text = "Empty content";
    $.each(unistatus, (ks, vs) => {
        var design = '<ul id="status_' + ks + '" class="sortable_list4 connectedSortable_4">';
        design += '<li class="activeClass">' + vs + '</li>';
        $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(kst, vst) {  
            if ($(vst).find('.StatusCell .view_status').text() == vs) {

                design += '<li class="">' + $(vst).find('.pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                design += '</div>'

                design += '<div class="subtaskAllFile">'
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
                design += '</div>'
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                design += ' </div>'
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                design += '</div>'
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                design += '<h3 class="name_label">Chat</h3>'
                design += '</div>'
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                design += '<h3 class="name_label">View File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi" id="">'
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                design += '</div>'
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
                design += ' <h3 class="name_label">Add To Archive</h3>'
                design += ' </div>'
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
                design += ' <h3 class="name_label">Delete</h3>'
                design += ' </div>'
                design += '</div>'
                design += '</li>'
            }

        });

        design += '</ul>';
        $("#sortable_div4").append(design);
    });

    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#custom_toDoMoreOptionView').hide();
    $('#status_area').show();
    $(".multipleProgress").hide();
    // Close  sortable_list area

    // For  sortable_list
    $(".sortable_list4").sortable({
        connectWith: ".connectedSortable_4",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999

    }).disableSelection();

    var li_sortLengthLast = $(".sortable_list4").length;
    if (li_sortLengthLast == 1) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list4").css({
            'width': '90% ',
        });
    }

    if (li_sortLengthLast == 2) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list4").css({
            'width': '45%',
        });
    }
    if (li_sortLengthLast > 2) {
        $('.pulse-new-component').css({
            'width': '94%',
        });

        $(".sortable_list4").css({
            'width': '23%',
        });
    }


}

function Woner_canbanview() {
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }

    $.each(uniqOwner, (kos, vos) => {
        $("#sortable_div5").html('');
        var design = '<ul id="owner_' + kos + '" class="sortable_list5 connectedSortable_5">';
        design += '<li class="activeClass">' + findObjForUser(vos).fullname + '</li>';
        $(".pulse-component").each(function(ksp, vsp) {
            design += '<li class="">' + $(vsp).find('.pulse_title').text();

            design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
            design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
            design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
            design += '</div>'

            design += '<div class="subtaskAllFile">'
            design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
            design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
            design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'
            design += '</div>'
            design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
            design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'
            design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
            design += ' </div>'
            design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
            design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
            design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
            design += '</div>'
            design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
            design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
            design += '<h3 class="name_label">Chat</h3>'
            design += '</div>'
            design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
            design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
            design += '<h3 class="name_label">View File(s)</h3>'
            design += '</div>'
            design += '<div class="subtask_file_up moreFileLi" id="">'
            design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
            design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
            design += '</div>'
            design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
            design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'
            design += ' <h3 class="name_label">Add To Archive</h3>'
            design += ' </div>'
            design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
            design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'
            design += ' <h3 class="name_label">Delete</h3>'
            design += ' </div>'
            design += '</div>'
            design += '</li>'
        });

        design += '</ul>';
        $("#sortable_div5").append(design);

    });
    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#custom_toDoMoreOptionView').hide();
    $('#ownner_area').show();
    $(".multipleProgress").hide();
    // Close  sortable_list area

    // For  sortable_list
    $(".sortable_list5").sortable({
        connectWith: ".connectedSortable_5",
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999

    }).disableSelection();

    var li_OwnerLengthLast = $(".sortable_list5").length;
    if (li_OwnerLengthLast == 1) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list5").css({
            'width': '90% ',
        });
    }


    if (li_OwnerLengthLast == 2) {
        $('.pulse-new-component').css({
            'width': '94%',

        });
        $(".sortable_list5").css({
            'width': '45%',
        });
    }
    if (li_OwnerLengthLast > 2) {
        $('.pulse-new-component').css({
            'width': '94%',
        });

        $(".sortable_list5").css({
            'width': '23%',
        });
    }

}
  

function comdate_canbanview(){
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div6").html('');
    $.each(uniqComDate,(kd,vd)=>{
        var design = '<ul id="due_date_'+kd+'" class="sortable_list6 connectedSortable_6">';
            design += '<li class="activeClass">'+ moment(vd).format('YYYY-MM-DD') +'</li>';
            $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(ke,ve){
                if(moment($(ve).find('.com_DateCell .com_DateInput').attr('data-date')).format('YYYY-MM-DD') == moment(vd).format('YYYY-MM-DD')){   
                    design += '<li class="">'+$(ve).find('.pulse_title').text();
                    design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                    design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                    design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                    design += '</div>'
                    design += '<div class="subtaskAllFile">'     
                    design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                    design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                    design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'   
                    design += '</div>' 
                    design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                    design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'                  
                    design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                    design += ' </div>'
                    design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                    design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                    design += '</div>'
                    design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                    design += '<h3 class="name_label">Chat</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                    design += '<h3 class="name_label">View File(s)</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_up moreFileLi" id="">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                    design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                    design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'         
                    design += ' <h3 class="name_label">Add To Archive</h3>'
                    design += ' </div>'
                    design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                    design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'                 
                    design += ' <h3 class="name_label">Delete</h3>'
                    design += ' </div>'
                    design += '</div>'
                    design +='</li>'
  
                }
            });
        design += '</ul>';
        $("#sortable_div6").append(design); 
    });
  
    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#date_area').show();
    $(".multipleProgress").hide();
  
    $( ".sortable_list6" ).sortable({
        connectWith: ".connectedSortable_6",  
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999      
    }).disableSelection();
  
      
    var li_sLengthLast = $(".sortable_list6").length;
        
    if(li_sLengthLast == 1){
        $('.pulse-new-component').css({
            'width':'94%',
    
        });
        $(".sortable_list6").css({
            'width':'90% ',
        });
    }
  
  
    if(li_sLengthLast == 2){
        $('.pulse-new-component').css({
            'width':'94%',
    
        });
        $(".sortable_list6").css({
            'width':'45%',
        });
    }
    if(li_sLengthLast > 2){
        $(".sortable_list6").css({
            'width':'23%',
        });
    }
}

function duedate_canbanview(){
    var dialog_node2 = $('.dialog-node');
    if(dialog_node2.is(':visible')){
        $('.header_menu_btn').removeClass('drop_active');
        $('.outerDropDownMenu .outer_dropDown').css({'background':'#13a3e3','border-radius':'50%'});
        $('.outerDropDownMenu .outer_dropDown').css('border','none');
        $('.outerDropDownMenu .outer_dropDown').css('color','#ffffff'); 
        dialog_node2.hide();
        hideMoreDialogTask(false);
    }
    $("#sortable_div6").html('');
    $.each(uniqDueDate,(kd,vd)=>{
        var design = '<ul id="due_date_'+kd+'" class="sortable_list6 connectedSortable_6">';
            design += '<li class="activeClass">'+ moment(vd).format('YYYY-MM-DD') +'</li>';
            $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(ke,ve){
                if(moment($(ve).find('.DateCell .dueDateInput').attr('data-date')).format('YYYY-MM-DD') == moment(vd).format('YYYY-MM-DD')){   
                    design += '<li class="">'+$(ve).find('.pulse_title').text();
                    design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">'
                    design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">'
                    design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">'
                    design += '</div>'
                    design += '<div class="subtaskAllFile">'     
                    design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">'
                    design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>'
                    design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>'   
                    design += '</div>' 
                    design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">'
                    design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>'                  
                    design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>'
                    design += ' </div>'
                    design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>'
                    design += '<h3 class="name_label" style="pointer-events:none">Note</h3>'
                    design += '</div>'
                    design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>'
                    design += '<h3 class="name_label">Chat</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>'
                    design += '<h3 class="name_label">View File(s)</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_up moreFileLi" id="">'
                    design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>'
                    design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>'
                    design += '</div>'
                    design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">'
                    design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>'         
                    design += ' <h3 class="name_label">Add To Archive</h3>'
                    design += ' </div>'
                    design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">'
                    design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>'                 
                    design += ' <h3 class="name_label">Delete</h3>'
                    design += ' </div>'
                    design += '</div>'
                    design +='</li>'
  
                }
            });
        design += '</ul>';
        $("#sortable_div6").append(design); 
    });
  
    // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#date_area').show();
    $(".multipleProgress").hide();
  
    $( ".sortable_list6" ).sortable({
        connectWith: ".connectedSortable_6",  
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999      
    }).disableSelection();
  
      
    var li_sLengthLast = $(".sortable_list6").length;
        
    if(li_sLengthLast == 1){
        $('.pulse-new-component').css({
            'width':'94%',
    
        });
        $(".sortable_list6").css({
            'width':'90% ',
        });
    }
  
  
    if(li_sLengthLast == 2){
        $('.pulse-new-component').css({
            'width':'94%',
    
        });
        $(".sortable_list6").css({
            'width':'45%',
        });
    }
    if(li_sLengthLast > 2){
        $(".sortable_list6").css({
            'width':'23%',
        });
    }
}

function completeDate_kanbanView(){
    $("#sortable_div8").html('');
    $.each(uniqComDate,(kk,vk)=>{
        var design = '<ul id="comdate_'+kk+'" class="sortable_list8 connectedSortable_8">';
        design += '<li class="activeClass">'+ moment(vk).format('YYYY-MM-DD') +'</li>';

        $(".pulse-component:not(#OnlyForClone):not(#addnewSub):not(#varienceRow)").each(function(kcc,vcc){
            
            if($(vcc).find('.com_DateCell .com_DateInput').attr('data-value') == moment(vk).format('YYYY-MM-DD')){      
                design += '<li class="">'+$(vcc).find('.pulse_title').text();

                design += ' <div class="more_files newNoti" onclick="showFilesList(event,this)">';
                design += '<img class="ellipsis" src="/images/basicAssets/ellipsis.svg">';
                design += '<img class="ellipsis_color" src="/images/basicAssets/ellipsis_color.svg">';
                design += '</div>';

                design += '<div class="subtaskAllFile">'; 
                design += '<div class="subtask_note_view moreFileLi" onclick="renameSubtask(this)">';
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-edit"></i> </div>';
                design += '<h3 class="name_label" style="pointer-events:none">Rename</h3>' ;  
                design += '</div>' ;
                design += '<div class="subtask_note_view moreFileLi" onclick="duplicateSubtask(this)">';
                design += '<div class="ico_div"><i class="icon ic2 icon-v2-duplicate"></i></div>';                  
                design += '<h3 class="name_label" style="pointer-events:none">Duplicate This Subtask</h3>';
                design += ' </div>';
                design += '<div class="subtask_note_view moreFileLi unseen" data-unseen="10" onclick="addNotePopup(this)">';
                design += '<div class="ico_div"><img src="/images/basicAssets/new_note.svg"></div>';
                design += '<h3 class="name_label" style="pointer-events:none">Note</h3>';
                design += '</div>';
                design += '<div class="subtask_chat moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat(this)">';
                design += '<div class="ico_div"><img src="/images/basicAssets/chat_blue.svg"></div>';
                design += '<h3 class="name_label">Chat</h3>';
                design += '</div>';
                design += '<div class="subtask_file_view moreFileLi unseen" data-unseen="10" onclick="openSubtaskChat()">';
                design += '<div class="ico_div"><img src="/images/basicAssets/view.svg"></div>';
                design += '<h3 class="name_label">View File(s)</h3>';
                design += '</div>';
                design += '<div class="subtask_file_up moreFileLi" id="">';
                design += '<div class="ico_div"><img src="/images/basicAssets/new_upload.svg"> </div>';
                design += ' <h3 class="name_label" onclick="open_file_browser_for_send_msg()">Upload File(s)</h3>';
                design += '</div>';
                design += '<div class="subtask_file_up moreFileLi addArchive" onclick="addToArchive(this)">';
                design += ' <div class="ico_div"><i class="beforeArchiveIco"></i></div>';         
                design += ' <h3 class="name_label">Add To Archive</h3>';
                design += ' </div>';
                design += ' <div class="subtask_file_up moreFileLi" onclick="deleteSubtask(this)">';
                design += ' <div class="ico_div"> <i class="icon ic2 icon-v2-delete"></i></div>';                 
                design += ' <h3 class="name_label">Delete</h3>';
                design += ' </div>';
                design += '</div>';
                design +='</li>';
            }
        });
        design += '</ul>';
        $("#sortable_div8").append(design); 
    });

    // // $('.subtaskContainer').hide();
    $('a.add-column-menu-button').hide();
    $('#completeDate_area').show();
    $(".multipleProgress").hide();



    $( ".sortable_list8" ).sortable({
        connectWith: ".connectedSortable_8",  
        items: 'li:not(:first)',
        tolerance: 'pointer',
        dropOnEmpty: true,
        placeholder: 'sortable_list',
        distance: 5,
        delay: 100,
        scroll: true,
        zIndex: 9999      
    }).disableSelection();

    var li_sLengthLast = $(".sortable_list8").length;
        
    if(li_sLengthLast == 1){
        $('.pulse-new-component').css({
            'width':'94%',

        });
        $(".sortable_list8").css({
            'width':'90% ',
        });
    }

    if(li_sLengthLast == 2){
        $('.pulse-new-component').css({
            'width':'94%',

        });
        $(".sortable_list8").css({
            'width':'45%',
        });
    }
    if(li_sLengthLast > 2){
        $(".sortable_list8").css({
            'width':'23%',
        });
    }
}
  
$( "#sortable_div" ).sortable({           
    revert: true,     
});

$( "#sortable_div2" ).sortable({           
    revert: true,     
});

$( "#sortable_div3" ).sortable({           
    revert: true,     
});

$( "#sortable_div4" ).sortable({           
    revert: true,     
});

$( "#sortable_div5" ).sortable({           
    revert: true,     
});

$( "#sortable_div6" ).sortable({           
    revert: true,     
});

$( "#sortable_div7" ).sortable({           
    revert: true,     
});

$( "#sortable_div8" ).sortable({           
    revert: true,     
});

function timeInputClick(e, elem) {
}

var amountCol = () => {

    var amountval = $('.amountInputValue');

    amountval.click(function () {
        if($(this).attr("contenteditable") == "true")
            $(this).css('background', '#fff').focus();
            //placeCaretAtEnd(document.getElementById($(this).attr('id')));
    });

    $('.amountInputValue').keydown(function (event) {
        var code = event.charCode || event.keyCode || event.which;
        if (code == 13) {
            event.preventDefault();
        }else if (code < 48 || code > 57) {
            if (code == 8 || code == 37 || code == 39) return true;
            else if (code == 46) {
            // Firefox 1.0+
                var isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                    var tempid = Date.now();
                    $(event.target).attr("id", tempid);
                    var el = document.getElementById(tempid);
                    placeCaretAtEnd(el);
                }
                return true;
            }else if (code < 106 || code > 95) return true;
            else return false;
        }
    });
}
amountCol();

fireOnLoadInputValue();
var clickCount = 0;
function fireOnLoadInputValue(){
    $('body').on('blur','.amountInputValue,.timeInputValue',function(event){
        $('.customTooltip').text('').hide();
        if($(event.target).text() == ''){
            $(event.target).text('0.00');
        }
        clickCount = 0;
        sortableFunc();

    });
    
    $('body').on('click ','.amountInputValue,.timeInputValue',function(event){
        var desc = $(this).attr('data-title');
        var lengthCount = desc.length;
        var posi = $(event.target).offset();
        var lef = Number($(this).innerWidth());
        var top = posi.top; 
        $('.customTooltip').html('<span class="closeMiniPopUp" onclick="closeMiniPopUp(\'customTooltip\')">+</span>'+desc).show();
        $('.customTooltip').css('left',posi.left+lef);
        $('.customTooltip').css('top',top);
        $(event.target).css('background', '#ffffff');
        $(".pulse-component-wrapper").sortable({ 
            disabled: true 
        });
        
        if(clickCount == 0){
            $(event.target).selectText();
            clickCount = 1;
        }else{
            $(event.target).focus();
            placeCaretAtEndBTDH(document.getElementById($(event.target).attr('id')));
        }
    });

    $('body').on('dblclick ','.amountInputValue,.timeInputValue',function(event){
        $(event.target).selectText();
    });

    jQuery.fn.selectText = function(){
        var doc = document;
        var element = this[0];
        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();        
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
}


$('.task_inputs').qtip({
    content: 'Press Enter for update',
    position: {
        my: 'bottom right',  // Position my top right...
        at: 'top left'
    }
});

$('.changelog').qtip({
    content: {
        text: function(event, api) {
        $.ajax({
            url: api.elements.target.attr('href'),
            type: "POST",
            data: {
            type: api.elements.target.attr('data-type'),
            targetid: $("#updateAction").val()
            },
            dataType: 'json',
            success: function(res){
                if(res.status){
                    var design = '          <table>';
                        design += '            <thead>';
                        design += '                <tr class="odd"><th> Date</th><th>Prev. Value</th><th> Current Value</th></tr>';
                        design += '            </thead>';
                        $.each(res.activityDetail, function(k,v){
                        design += '            <tbody>';
                        design += '                <tr class="odd"><td>'+moment(v.created_at).format('D-MM-Y')+'</td><td>'+v.prev_val+'</td><td>'+v.current_val+'</td></tr>';
                        design += '            </tbody>';
                        });
                        design += '        </table>';
                        api.set('content.text', design);

                        design = "";
                        api.set('content.text', design);
                }
            },
            error :function(xhr, status, error) {
            api.set('content.text', status + ': ' + error);
            }
        });

        return 'Loading...';
        }
    },
    position: {
        my: 'top right',  // Position my top right...
        at: 'bottom left'
    }
});
  
// function totalTaskMember(){
//     $('#memberListBackWrap').show();
//     $('#memberListBackWrap .search_List').hide();
//     $('#memberListBackWrap .static_design').hide();
// }

function totalSubTask(){
    $('#subtaskListBackWrap').show();
}
    
$(window).on('load', function(){
    $('.secLabel').css('visibility','visible');
});

function saveColSerial(serialList,activity_id,uid,type){
    var activity = new Activity();
        activity.targetID            = activity_id;
        activity.activityUpdateData  = serialList;
        activity.activityCreatedBy   = uid;
        activity.activityType        = type;

        activity._saveColSerial((response)=>{
            console.log(response);
        });
}

function viewSUbtaskFile(elm) {
    $('#taskFilePreview').show();
    $('.media-tabs>li.active').trigger('click')


    selectedMediaImgTempArray = [];
	selectedMediaVidTempArray = [];
	selectedMediaAudTempArray = [];
	selectedMediaFileTempArray = [];
    selectedMediaTagTempArray = [];
    
    let activity_id = $(elm).parents('._eachsubtask').attr('data-id');
    console.log(activity_id)
	// $('.media-tabs .mediaimgTab').trigger('click');

	// if ($('#mediaTagDivHead').hasClass('active')){
	// 	$('#tagListFormediaView').show();
	// }else{
	// 	$('#tagListFormediaView').hide();
	// }
	// $('#media_Action_Div').hide();
	// $('#taskFilePreview').show();
	// $('.media-file-popup').show();
	// $('.media-file-popup input[type="text"]').val('');
	// $('.close-media-popup').addClass('allAttachmentView');
	// if ($('#headNoficationDialog').is(':visible') == true) {
	// 	$('#taskFilePreview').css('height', 'calc(100% - 106px)');
	// } else if ($('#headNoficationDialog').is(':visible') == true) {
	// 	$('#taskFilePreview').css('height', 'calc(100% - 64px)');
	// }
	socket.emit('findTaskMediaMsg',{activity_id:activity_id}, function(res){
		if(res.status == true){
			var mediaMsg = res.allMediaMsg;

			var allMediaMsgId = [];
			var allMediaImg = [];
			var allMediaAudio = [];
			var allMediaVideo = [];
			var allMediaOthers = [];
			var allMediaLink = [];
			var allTagMsg = [];
			$.each(mediaMsg, function(k,v){
				allMediaMsgId.push(v.msg_id);
				if(v.attch_imgfile !== null){

					if(v.attch_imgfile.length > 0){
						allMediaImg.push(v);
					}
				}
				if(v.attch_audiofile !== null){

					if(v.attch_audiofile.length > 0){
						allMediaAudio.push(v);
					}
				}
				if(v.attch_videofile !== null){

					if(v.attch_videofile.length > 0){
						allMediaVideo.push(v);
					}
				}
				if(v.attch_otherfile !== null){

					if(v.attch_otherfile.length > 0){
						allMediaOthers.push(v);
					}
				}
				if(v.url_title !== null){
					allMediaLink.push(v);
				}
            });

            $("#taskMediaImages").html("");
			var allimg = $('.msgs-form-users .img_attach');

			if (allMediaImg.length === 0) {
				var notFoundMsg = '<h2 class="notFoundMsg">No Images found in this thread !</h2>'
				$("#taskMediaImages").append(notFoundMsg);
				$("#taskMediaImages").css('style','');
				$("#taskMediaImages").addClass('flex_class');
				$("#taskMediaImages .notFoundMsg").show();
			}else{
                $("#taskMediaImages").attr('has_data','1');
                var lastid_f_i;
    
                $.each(allMediaImg, function (k, v) {
                    $.each(v.attch_imgfile, function(ka,va){
                        var datamsg = v.msg_body;
                        var imgname = file_server+va;
                        var name = imgname.split('/');
                        var imgName = name[name.length -1].split('@');
                        var imgFormate = name[name.length -1].split('.');
                        var imgFullName = imgName[0]+'.'+imgFormate[imgFormate.length - 1];
                        var sender = v.sender_name;
        
                        var unixt = Number((imgname).substring((imgname).lastIndexOf('@') + 1, (imgname).lastIndexOf('.')));
                        var msg_date = moment(unixt).calendar(null, {
                            sameDay: '[Today]',
                            lastDay: '[Yesterday]',
                            lastWeek: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                            sameElse: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                        });
        
                        $.each($('.date-by-images h3'), function (dk, dv) {
                            if ($(dv).text() == msg_date) {
                                msg_date = null;
                                return 0;
                            }
                        });
        
                        if (msg_date !== null) {
                            lastid_f_i = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "img";
                            var dataofimg = '<div class="date-by-images" id="' + lastid_f_i+'"><h3>' + msg_date + '</h3></div>';
                            $("#taskMediaImages").append(dataofimg);
                        }
        
                        var html = '';
                        html += '<div class="all-images" data-msg="' + datamsg + '" data-src="' + imgname + '" data-filename="' + imgName + '" data-sender_name="' + sender + '" data-sender_img="' + v.sender_img + '" onclick="openImage(event,this)">';
                        html += 	'<span class="hyvenCheckbox" onclick="customChekbox(this,\'imageMedia\')" data="' + imgname+'"></span>';
                        html += 	'<div class="msg_per_img_div">';
                        html += 		'<img src="' + imgname+ '" alt="' + imgName + '" style="pointer-events: none;">';
                        // html += 		'<div class="file-name">' + imgFullName + '</div>';
                        html += 		'<div class="per_img_hover_opt">';
                        html += 			'<p class="img_action" onclick="viewImgHov(this,\'mediaImg\')" data-balloon="Preview" data-balloon-pos="up"><img src="/images/basicAssets/view.svg" alt=""/></p>';
                        html += 			'<p class="img_action" onclick="downloadFile(this)" data-href="' + file_server + imgname + '" data-balloon="Download" data-balloon-pos="up">';
                        html +=                 '<a download target="_blank" href="' +imgname + '">';
                        html +=                 '<img src="/images/basicAssets/Download.svg" alt=""/>';
                        html +=                 '</a>';
                        html +=             '</p>';
                        html += 			'<p class="img_action" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="'+imgname+'"><img src="/images/basicAssets/ShareIco.svg" alt=""/></p>';
                        html += 		'</div>';
                        html += 	'</div>';
                        html +=   '<div class="img-name" data-msg="' + datamsg + '" onclick="showImageSlider(event, this, \'Unknown Size\')" data-src="' + imgname + '" data-filename="' + imgName + '" data-sender_name="' + sender + '" data-sender_img="' + v.sender_img  + '">';
                        html +=   '<div class="customToolTip">'+ imgFullName +'<br>'+ sender +'<br> uploaded on '+ moment(unixt).format('MMMM Do YYYY, h:mm a') +'</div>';
                        html +=   '<p data-msg="' + datamsg + '" onclick="showImageSlider(event, this, \'Unknown Size\')" data-src="' + imgname + '" data-filename="' + imgName + '" data-sender_name="' + sender + '" data-sender_img="' + v.sender_img  + '">'+ imgFullName +'</p>';
                        html += 	'</div>';
                        html += '</div>';
                        $("#taskMediaImages #" + lastid_f_i).append(html);
                    });
                });
            }

            $('#taskMediaVideos').html("");
			var allVideos = $('.msgs-form-users .vdo_attach');
			
			if (allMediaVideo.length === 0) {
				var notFoundMsg = '<h2 class="notFoundMsg">No video file(s) were found in this channel !</h2>'
				$("#taskMediaVideos").append(notFoundMsg);
				$("#taskMediaVideos .notFoundMsg").show();
			}else{
                $("#taskMediaVideos").attr('has_data','1');
                var lastid_f_V;
    
                $.each(allMediaVideo, function (k, v) {
                    $.each(v.attch_videofile, function(ka,va){
                        var name = va;
                        var senderName = v.sender_name;
                        var vidName = name.split('@');
                        var vidType = name.split('.');
                        var actType = vidType[vidType.length - 1];
                        var videoname = vidName[0]+'.'+actType;
        
                        var unixt = Number(name.substring(name.lastIndexOf('@') + 1, name.lastIndexOf('.')));
                        var msg_date = moment(unixt).calendar(null, {
                            sameDay: '[Today]',
                            lastDay: '[Yesterday]',
                            lastWeek: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                            sameElse: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                        });
        
                        $.each($('.date-by-videos h3'), function (dk, dv) {
                            if ($(dv).text() == msg_date) {
                                msg_date = null;
                                return 0;
                            }
                        });
        
                        if (msg_date !== null) {
                            lastid_f_V = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "vdo";
                            var dataofvdo = '<div class="date-by-videos" id="' + lastid_f_V +'"><h3>' + msg_date + '</h3></div>';
                            $("#taskMediaVideos").append(dataofvdo);
                        }
                    var file_type = name.split('.').pop().toLowerCase();
                    var eachVideo = '<div class="all-videos">';
                        eachVideo += '<span class="hyvenCheckbox" onclick="customChekbox(this,\'videoMedia\')" data="' + file_server + name + '"></span>';
                        eachVideo += 	'<video controls>';
                        eachVideo += 		'<source class="vdo_attach" src="' + file_server + name + '" type="video/' + file_type + '" data-file_name="' + name + '">';
                        eachVideo += 	'</video>';
                        eachVideo += 	'<div class="video-name">';
                        eachVideo += 		'<div class="customToolTip">'+ videoname +'<br>'+ senderName +'<br> uploaded on '+ moment(unixt).format('MMMM Do YYYY, h:mm a') +'</div>';
                        eachVideo += 		'<p>'+ videoname +'</p>';
                        eachVideo += 	'</div>';
                        eachVideo += '</div>';
        
                        $('#taskMediaVideos #' + lastid_f_V).append(eachVideo);
                    });
                });
            }

			    ///for audios
			$('#taskMediaAudios').html("");
			var allAudios = $('.msgs-form-users .ado_attach');
			if (allMediaAudio.length === 0) {
				var notFoundMsg = '<h2 class="notFoundMsg">No audio file(s) were found in this channel !</h2>'
				$("#taskMediaAudios").append(notFoundMsg);
				$("#taskMediaAudios .notFoundMsg").show();
			}else{
                $("#taskMediaAudios").attr('has_data','1');
                var lastid_f_A;
                $.each(allMediaAudio, function (k, v) {
                    $.each(v.attch_audiofile, function(ka,va){
                        var name = va;
                        var senderName = v.sender_name;
                        var audName = name.split('@');
                        var audType = name.split('.');
                        var actType = audType[audType.length - 1];
                        var audioname = audName[0] + '.' + actType;
        
                        var unixt = Number(name.substring(name.lastIndexOf('@') + 1, name.lastIndexOf('.')));
                        var msg_date = moment(unixt).calendar(null, {
                            sameDay: '[Today]',
                            lastDay: '[Yesterday]',
                            lastWeek: function (now) {
                                return '[' + this.format("MMM Do, YYYY") + ']';
                            },
                            sameElse: function (now) {
                                return '[' + this.format("MMM Do, YYYY") + ']';
                            }
                        });
        
                        $.each($('.date-by-audios h3'), function (dk, dv) {
                            if ($(dv).text() == msg_date) {
                                msg_date = null;
                                return 0;
                            }
                        });
        
                        if (msg_date !== null) {
                            lastid_f_A = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "ado";
                            var dataofado = '<div class="date-by-audios" id="' + lastid_f_A + '"><h3>' + msg_date + '</h3></div>';
                            $("#taskMediaAudios").prepend(dataofado);
                        }
                        var file_type = name.split('.').pop().toLowerCase();
                        var eachaudio = '<div class="all-audios">';
                            eachaudio += '<span class="hyvenCheckbox" onclick="customChekbox(this,\'audioMedia\')" data="' + file_server + name + '"></span>';
                            eachaudio += '<audio controls>';
                            eachaudio += '<source class="ado_attach" src="' + file_server + name + '" type="audio/' + file_type + '" data-file_name="' + name + '">';
                            eachaudio += '</audio>';
                            eachaudio += '<div class="audio-name">';
                            eachaudio += '<div class="customToolTip">' + audioname + '<br>' + senderName + '<br> uploaded on ' + moment(unixt).format('MMMM Do YYYY, h:mm a') + '</div>';
                            eachaudio += '<p>' + audioname + '</p>';
                            eachaudio += '</div>';
                            eachaudio += '</div>';
                        $('#taskMediaAudios #' + lastid_f_A).append(eachaudio);
                    });
    
                });
            }
			
            $('#taskMediaFiles').html("");
			var allfiles = $('.msgs-form-users .fil_attach');

			if (allMediaOthers.length === 0) {
				var notFoundMsg = '<h2 class="notFoundMsg">No file(s) were found in this channel !</h2>'
				$("#taskMediaFiles").append(notFoundMsg);
				$("#taskMediaFiles").addClass('flex_class');
				$("#taskMediaFiles .notFoundMsg").show();
			}else{
                $("#taskMediaFiles").attr('has_data','1');
                var lastid_f_f;
                
                $.each(allMediaOthers, function (k, v) {
                    $.each(v.attch_otherfile, function(ka,va){
                        var senderName = v.sender_name;
                        var name = va;
                        var dataFile = name.split('.');
                        var datafiletype = dataFile[dataFile.length - 1];
        
                        var unixt = Number(name.substring(name.lastIndexOf('@') + 1, name.lastIndexOf('.')));
        
                        var msg_date = moment(unixt).calendar(null, {
                            sameDay: '[Today]',
                            lastDay: '[Yesterday]',
                            lastWeek: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                            sameElse: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                        });
        
                        $.each($('.date-by-files h3'), function (dk, dv) {
                            if ($(dv).text() == msg_date) {
                                msg_date = null;
                                return 0;
                            }
                        });
        
                        if (msg_date !== null) {
                            lastid_f_f = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "file";
                            var dataofFile = '<div class="date-by-files" id="' + lastid_f_f +'"><h3>' + msg_date + '</h3></div>';
                            $("#taskMediaFiles").prepend(dataofFile);
                        }
                        var file_type = name.split('.').pop().toLowerCase();
                        var eachFiles = '<div class="all-files">';
                            eachFiles += '<span class="hyvenCheckbox" onclick="customChekbox(this,\'fileMedia\')" data="' + file_server + name + '"></span>';
                            eachFiles += 	'<img class="file-icon" src="/images/basicAssets/' + datafiletype + '.svg" data-file_name="' + name + '">';
                            eachFiles += 	'<div class="file-details">';
                            eachFiles += 		'<h4>' + name.substring(0, name.lastIndexOf('@')) + '.' + file_type + '</h4>';
                            eachFiles += 		'<p>'+senderName+' <span>' + moment(unixt).format('MMMM Do YYYY, h:mm a') + '</span></p>';
                            eachFiles += 	'</div>';
                            eachFiles += 	'<div class="file-hover-option">';
                            eachFiles += 		'<a href="' + file_server + name + '">';
                            eachFiles += 			'<img src="/images/basicAssets/Download.svg" alt="">';
                            eachFiles += 		'</a>';
                            eachFiles += 		'<img src="/images/basicAssets/NotFlagged.svg" alt="">';
                            eachFiles += 		'<img src="/images/basicAssets/ShareIco.svg" alt="" onclick="viewShreImgPop(event,this)" data-value="'+ file_server + name +'" style="width: 12px;height: 18px;">';
                            eachFiles += 		'<img src="/images/basicAssets/MoreMenu.svg" alt="">';
                            eachFiles += 	'</div>';
                            eachFiles += '</div>';
        
                        $('#taskMediaFiles #' + lastid_f_f).append(eachFiles);
                    });
                });
            }


			$('#taskMediaLinks').html("");
			var alllink = $('.msgs-form-users .has_url');
			var lastid_f_l;
			if(allMediaLink.length === 0){
				var notFoundMsg = '<h2 class="notFoundMsg">No link(s) were found in this channel !</h2>'
				$("#taskMediaLinks").append(notFoundMsg);
				$("#taskMediaLinks .notFoundMsg").show();
			}else{
                $("#taskMediaLinks").attr('has_data','1');

                $.each(allMediaLink, function (k, v) {
                var senderName = v.sender_name;
                
                var unixt = v.created_at;
                
                var msg_date = moment(unixt).calendar(null, {
                        sameDay: '[Today]',
                        lastDay: '[Yesterday]',
                        lastWeek: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; },
                        sameElse: function (now) { return '[' + this.format("MMM Do, YYYY") + ']'; }
                    });
    
                    $.each($('.date-by-links h3'), function (dk, dv) {
                        if ($(dv).text() == msg_date) {
                            msg_date = null;
                            return 0;
                        }
                    });
    
                    if (msg_date !== null) {
                        lastid_f_l = msg_date.replace(/[\s,]+/g, ' ').trim().replace(/\s/g, '') + "link";
                        var dataofLink = '<div class="date-by-links" id="' + lastid_f_l +'"><h3>' + msg_date + '</h3></div>';
                        $("#taskMediaLinks").append(dataofLink);
                    }
                    var eachurl = '<div class="all-links" style="cursor:pointer" onclick=window.open("'+$(v.msg_body).attr('href')+'","_blank")>';
                        eachurl+= 	'<div class="links-logo">';
                        eachurl+= 		'<img src="'+ v.url_favicon +'" alt="">';
                        eachurl+= 	'</div>';
                        eachurl+= 	'<div class="link-details">';
                        eachurl+= 		'<h4 style="height:20px;overflow:hidden;">'+v.msg_body+'</h4>';
                        eachurl+= 		'<p style="height:30px;overflow:hidden;">' + v.url_body + '</p>';
                        eachurl+= 		'<p>'+ senderName +' <span>'+ moment(unixt).format('MMMM Do YYYY, h:mm a') +'</span></p>';
                        eachurl+= 	'</div>';
                        eachurl+= 	'<div class="linkHovitem"> <div class="shareIcon" data-balloon="Share" data-balloon-pos="up" onclick="viewShreImgPop(event,this)" data-value="'+$(v.msg_body).attr('href')+'"></div> </div>';
                        eachurl+= '</div>';
    
                    $('#taskMediaLinks #' + lastid_f_l).append(eachurl);
                });
            }
        }
    });
}

// media popup
function viewMediaFile(type,elm) {
	$('.media-tabs>li').removeClass("active");
    $(elm).addClass("active");
    
    $.each($('.media_Tab_Content'), function (k,v) {
        if($(v).attr('data-type') == type){
            $('#task'+$(v).attr('data-type')).show();
            $(v).find('.notFoundMsg').show();
            $(v).addClass('flex_class');
        }else{
            $('#task'+$(v).attr('data-type')).hide();
            $(v).find('.notFoundMsg').hide();
            $(v).removeClass('flex_class');
        }
    });
}

// function viewImgDiv(elm) {
// 	if(!$("#taskMediaImages").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaImages").find('.notFoundMsg').show();
// 		$("#taskMediaImages").addClass("flex_class");
// 	}
// 	$('#tagListFormediaView').hide();
// 	if(selectedMediaImgTempArray.length > 0){
// 		$('#media_Action_Div').show();
// 	}else{
// 		$('#media_Action_Div').hide();
// 	}
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaImages").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "");
// 	$('.media-file-popup input[type="text"]').addClass('Search-img').attr('placeholder', "Search Images");
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }
// function viewvideoDiv(elm) {
// 	if(!$("#taskMediaVideos").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaVideos").find('.notFoundMsg').css('display','block');
// 		$("#taskMediaVideos").addClass("flex_class");
// 	}
// 	$('#tagListFormediaView').hide();
// 	if(selectedMediaVidTempArray.length > 0){
// 		$('#media_Action_Div').show();
// 	}else{
// 		$('#media_Action_Div').hide();
// 	}
// 	$('#media_Action_Div').hide();
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaVideos").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "").attr('placeholder', "Search Videos");
// 	$('.media-file-popup input[type="text"]').addClass('Search-videos');
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }
// function viewaudiosDiv(elm) {
// 	if(!$("#taskMediaAudios").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaAudios").find('.notFoundMsg').show();
// 		$("#taskMediaAudios").addClass("flex_class");
// 	}
// 	$('#tagListFormediaView').hide();
// 	if (selectedMediaAudTempArray.length > 0) {
// 		$('#media_Action_Div').show();
// 	} else {
// 		$('#media_Action_Div').hide();
// 	}
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaAudios").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "").attr('placeholder', "Search Audios");
// 	$('.media-file-popup input[type="text"]').addClass('Search-audios');
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }
// function viewFilesDiv(elm) {
// 	if(!$("#taskMediaFiles").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaFiles").find('.notFoundMsg').show();
// 		$("#taskMediaFiles").addClass("flex_class");
// 	}
// 	$('#tagListFormediaView').hide();
// 	if (selectedMediaFileTempArray.length > 0) {
// 		$('#media_Action_Div').show();
// 	} else {
// 		$('#media_Action_Div').hide();
// 	}
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaFiles").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "").attr('placeholder', "Search Files");
// 	$('.media-file-popup input[type="text"]').addClass('Search-files');
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }
// function viewLinksDiv(elm) {
// 	if(!$("#taskMediaLinks").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaLinks").find('.notFoundMsg').show();
// 		$("#taskMediaLinks").addClass("flex_class");
// 	}
// 	$('#tagListFormediaView').hide();
// 	$('#media_Action_Div').hide();
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaLinks").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "").attr('placeholder', "Search Links");
// 	$('.media-file-popup input[type="text"]').addClass('Search-links');
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }
// function viewTagsDiv(elm) {
// 	if(!$("#taskMediaTags").find('.notFoundMsg').length){
// 		$('.media_Tab_Content').removeClass("flex_class");
// 	}else{
// 		$('.notFoundMsg').hide();
// 		$('.media_Tab_Content').removeClass("flex_class");
// 		$("#taskMediaTags").find('.notFoundMsg').show();
// 		$("#taskMediaTags").addClass("flex_class");
// 	}

// 	if (selectedMediaTagTempArray.length > 0) {
// 		$('#media_Action_Div').show();
// 	} else {
// 		$('#media_Action_Div').hide();
// 	}
// 	if ($('.msgs-form-users .filesTag').length == 0) {
// 		$('#tagListFormediaView').hide();
// 	}else{
// 		$('#tagListFormediaView').show();
// 	}
// 	$('.media_Tab_Content').hide();
// 	$("#taskMediaTags").show();
// 	$('.media-file-popup input[type="text"]').attr('class', "").attr('placeholder', "Search Tags");
// 	$('.media-file-popup input[type="text"]').addClass('Search-tags');
// 	$('.media-file-popup input[type="text"]').val('');
// 	// mediaFileSearch();
// }

function closeMediaPopup() {
	$('#taskFilePreview').hide();
	$('.close-media-popup').removeClass('allAttachmentView');
}

$('html, body').on('click','.task_status .rdonlyDiv', function(event){
    if(coowner.indexOf(user_id) > -1 || $('#actCre').val() == user_id){
        event.preventDefault();
        event.stopImmediatePropagation();

        $('.workspaceform').hide();
        $("#subtaskStatusSelect").html('');
        $('#stak_table').show();
        $('#stak_table .body').html($('.subtaskContainer').clone());
        $('.workspaceform .subtaskContainer').remove();
        scrollFire();
        $('#stak_table .delete_msg_div').css('height',$('.workspaceform').height());
    }
});

function scrollFire(){
    $("#stak_table .delete_msg_div").on('scroll', function(event) {
        if (event.currentTarget.scrollLeft > 0) {
            if (!$('.status-picker-wrapper').is(':visible') && !$('.priority-picker-wrapper').is(':visible')) {
                $('.group-header-component .name-column-header').addClass('heading');
                $('.pulse-component .name-cell').addClass('heading');
                $('.flex_heading').css('z-index', '100');
                $('.name-cell').css('z-index', '101');
                $('.flex_heading').first().css('z-index', '101');
                $('.cell-component').css('z-index', '0');
                $('.name-cell').css('z-index', '101');
            }
        }
    });
}


$('#restrictedMode').click(function(){
    $('#restricted_mode').show();
});

