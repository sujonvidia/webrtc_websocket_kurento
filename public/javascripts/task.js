// task.js Only for new task
var tempCTAdminC = [];
var tempCTObserverC = [];
var tempCTMemberC = [];
var allUnit = [];
var allteams = [];
var CreatetaskParticipants = [];
var taskTitleArr = [];
var companyID = '';


socket.emit('get_all_team', {user_id}, (rep)=>{
    if(rep.status){
        allteams = rep.teams;
    }
});

socket.emit('getBUnit',{user_id:user_id},function(res){
    if(res.status){
      allUnit = res.data;
    }
});

function startToDo(event){
    var todotitle = $(event.target).find('.toDoName').text().trim();
    if ($('#n_ToDo_item').is(':visible')) {
        $('#n_ToDo_item').remove();
        $('.createTaskPopUp').hide();
    }
    $('.tooltipspan').html('');
    // $('.taskLoader2').show();
    $('.taskLoaderFull').hide();
    $('#todoTitle').val(todotitle);
    $('#toDoName_2 .task_name').text(todotitle);
    $('.multipleProgress').css('display','flex');
    $('#totalProgressSubtask').text('0%');
    $('#completedProgress').css('width','0%').attr('data-value','0%');
    $('#workingProgress').css('width','0%').attr('data-value','0%');
    $('#waitingFeedbackProgress').css('width','0%').attr('data-value','0%');
    $('#incompleteProgress').css('width','100%').attr('data-value','100%');

    $('.side_bar_list_item li').removeClass('selected');
    $('.side_bar_list_item li').removeClass('activeTodo');
    $('#addTaskContainer').show();
    taskShowHideElement(false);
    $('#addTodoCheckList').parents('.centered').show();
    $('.to_do_container').find('.button-section').hide();
    $('#openBatchAction').hide();

    $('.share-drop-list img').remove();
    $('.share-drop-list .count_plus').hide();
    
    // observer = [];
    // assignee = [];
    // coowner = [];
    // viewMemberImg = [];
    // sharedMemberList = [];
    
    // var name = $(event.target).text();
    // var newTodo = "New Task";
    // var type = 'TODO';
    
    // currentMemberList = [];
    // currentMemberList2 = [];
    // checklistiTEM = [];
    // updateCheckList = [];
    
    // taskParticipants = [];

    // addAsCoOwnerArr = [];
    // addAsObsrvrArr = [];
    // addAsAssigneeArr = [];

    $('.sharedIMG').remove();
    $('.ownerThisToDo').remove();

    $('#sharePeopleList span').hide();
    $('#ownerPeopleList span').hide();
    $('#observerPeopleList span').hide();
    $('#assigneePeopleList span').hide();

    // //  ..........  //
    // //  ..........  //

    // $('.count_owner').show();
    // $('.add-check-list').show();
    // $('.item_progress').show();
    // $('.group-header-wrapper').hide();

    // // .........  //
    // // .........  //
    $('#chat_icon').show();
    // $(".checklist_item").val('');
    // $("#amazonWishlist").prop('checked', false);
    // $(".count_member").text(" 1 member");
    // $('.suggested-list').html("");
    $("#chat_icon").css('pointer-events', 'auto');
    $("#tagged_area").css('pointer-events', 'auto');
    $(".flag").css('pointer-events', 'auto');
    $("#toDoPinUnpinDiv").css('pointer-events', 'auto');
    $(".more").css('pointer-events', 'auto');

    // tagListTitle = [];
    // tagLsitDetail = [];

    // $("#fileAttachTagLs").html('');
    // $("#n_ToDo_item").remove();
    // $(".newcolCell").remove();
    // $(".newcol").remove();

    // tagListForFileAttach = [];
    // FtempArray = [];
    // FtaggedList = [];

    // $("#taskTaggedList").html("");
    // $(".checklistDiv").html("");
    // $("#taskTagItemList").html("");

    $("#viewUploadFileviewUploadFile").html('');
    $("#viewUploadFileviewUploadFile").hide();

    $(".tagged").attr('src', '/images/basicAssets/custom_not_tag.svg');


    $("#selectWorkspace option").each(function () {
        $(this).removeAttr("selected");
    });

    // $("#taskStatusSelect option").each(function () {
    //     $(this).removeAttr("selected");
    // });

    $("#ReminderTime option").each(function () {
        $(this).removeAttr("selected");
    });
    var activity_id = conversationid = $(event.target).attr('data-activityid');

    $("#deletetodoTopBar").attr('data-activityid', activity_id);
    $('#chat_icon').attr('data-activity_id', activity_id);
    
    var nour = $("#activity_" + activity_id).attr("data-urm");
    if (nour > 0) {
        $('#chat_icon>img').attr('src', '/images/basicAssets/Chat_active.svg');
        $('#chat_icon>img').css({ 'width': '14px', 'height': '14px' });
    } else {
        $('#chat_icon>img').attr('src', '/images/basicAssets/Chat.svg');
        $('#chat_icon>img').css({ 'width': '14px', 'height': '14px' });
    }

    $('#updateAction').val(activity_id);

    if ($('#live-chat').is(':visible')) {
        $('#chat_icon').trigger('click');
    }

    $(".pulse-component:not(#OnlyForClone)").remove();
    $('.progressBarContainer').html();
    $('.progressBarContainer').html('<div id="pgColor1" data-value="100%" data-color="#d8d8d8;" style="width:100%; background:#d8d8d8;"></div>');
    $('.to_do_head_left.secLabel').hide();

    // // Default settings
    // if(!$("#owner_co_owner").hasClass('active')){
    //     $("#owner_co_owner").attr('data-setval',2);
    //     $("#owner_co_owner").removeClass('active');
    //     $('.ownerClass').hide();
    //     $('.WonerCell').hide();
    //     $('.coownerclass').hide();
    //     $('.coowonerCell').hide();
    // }

    // if(!$("#set_Observer").hasClass('active')){
    //     $("#set_Observer").attr('data-setval',2);
    //     $("#set_Observer").removeClass('active');
    //     $('.observerclass').hide();
    //     $('.ObserverCell').hide();
    // }

    // if(!$("#set_assignee").hasClass('active')){
    //     $("#set_assignee").attr('data-setval',2);
    //     $("#set_assignee").addClass('active');
    //     $('.assignClass').hide();
    //     $('.AssigneeCell').hide();
    // }


    // if(!$("#set_phase").hasClass('active')){
    //     $("#set_phase").attr('data-setval',2);
    //     $("#set_phase").addClass('active');
    //     $('.priorityClass').show();
    //     $('.priorityCell').show();
        
    // }

    // if(!$("#set_dueby").hasClass('active')){
    //     $("#set_dueby").attr('data-setval',2);
    //     $("#set_dueby").addClass('active');
    //     $('.dateClass').show();
    //     $('.DateCell').show();
    // }

    // if(!$("#set_compdate").hasClass('active')){
    //     $("#set_compdate").attr('data-setval',2);
    //     $("#set_compdate").addClass('active');
    //     $('.com_dateClass').show();
    //     $('.com_DateCell').show();
    // }

    // if($("#budget_set").hasClass('active')){
    //     $("#budget_set").attr('data-setval',2);
    //     $("#budget_set").removeClass('active');

    //     $('.amountClass').hide();
    //     $('.actualClass').hide();
    //     $('.varianceClass').hide();

    //     $('.AmountCell').hide();
    //     $('.actutalCell').hide();
    //     $('.varianceCell').hide();
    // }

    // if($("#task_time_set").hasClass('active')){
    //     $("#task_time_set").attr('data-setval',2);
    //     $("#task_time_set").removeClass('active');

    //     $('.timeEstClass').hide();
    //     $('.manhourcost').hide();
    //     $('.actualHourClass').hide();
    //     $('.hourlyClass').hide();
    //     $('.timevarianceClass').hide();

    //     $('.timeEstCell').hide();
    //     $('.ManHourRateCell').hide();
    //     $('.actualHourCell').hide();
    //     $('.hourlyRateCell').hide();
    //     $('.timevarianceCell').hide();
    // }

    // if(!$("#set_statuscol").hasClass('active')){
    //     $("#set_statuscol").attr('data-setval',2);
    //     $("#set_statuscol").addClass('active');

    //     $('.statusClass').hide();
    //     $('.StatusCell').hide();
    // }

    // subTaskListArr = [];
    
    const activity = new ActivityNew();

    activity.activityId          = activity_id;
    activity.activityCreatedBy   = user_id;
    // /*Uniq owner Kanban view */
    // if( activity.activityCreatedBy != null &&  activity.activityCreatedBy != ''){
    //     if(uniqOwner.indexOf(activity.activityCreatedBy == -1)){
    //         uniqOwner.push(activity.activityCreatedBy);
    //     }
    // }
    
    if($('#todoTitle + .secLabel').is(':visible')){
        let seclabel = '<div class="secLabel" style="">'+
                        '<span id="taskCreated_By"></span>'+
                        '<span id="totalTaskMember" onclick="totalTaskMember()">[1 Member(s)]</span>'+
                        '<div class="customToolTip" style="text-align:left;width:200px;left: 45px;top:65px;" id="TTM"></div>'+
                        '<span id="taskCategory">Work Category: []</span>'+
                        '<span id="taskCreated_At">Start:</span>'+
                        '<span id="taskDueDate">Due:</span>'+
                        '<span id="taskStatus">Status: [Initiate]</span>'+
                        // '<div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: -58px" id="TST"></div>'+
                        // '<p id="totalTask" onclick="totalSubTask()" style="margin-right: 7px;cursor: pointer;border-left: 2px solid #d8d8d8;padding-left: 7px;">0 Subtask(s)</p>'+
                        // '  <span id="taskCreated_At_time" style="margin-left:5px;line-height: 17px;"></span>'+
                        '</div>';
        $('#todoTitle + .secLabel').remove();
        $(seclabel).insertAfter('#todoTitle');
    }

    activity.getSingleActivity((response)=>{
        if(response.status){

            var activityDetail = response.activityDetail;
            var participants = response.participants;
            var activity_admin = response.activity_admin;
            var activity_observer = response.activity_observer;
            var activity_member = response.activity_member;
            var creator = activityDetail.activity_created_by;
            $('#actCre').val(creator);
            let ttm = participants.length;

            // Changelog hide show
            var changeLogArr = [];
            // if(response.getChangeLogResponse != undefined){
            //     if(response.getChangeLogResponse.activities != undefined){
            //         if(response.getChangeLogResponse.activities.length > 0){
            //             $.each(response.getChangeLogResponse.activities, (k,v)=>{
            //                 if(changeLogArr.indexOf(v.activity_type) == -1){
            //                     changeLogArr.push(v.activity_type);
            //                     $("#cl_"+v.activity_type).show();
            //                 }
            //             });  
            //         }   
            //     }
            // }

            $('.to_do_head_left.secLabel').show();
            $('#taskCreated_By').text('Created By ['+findObjForUser(creator).fullname+']');
            $('#taskCreated_At').text('Start: ['+moment(response.activityDetail.activity_created_at, 'YYYY-MM-DD').format('DD-MM-YYYY')+']');
            $('#taskDueDate').text('Due: ['+moment(response.activityDetail.activity_end_time, 'YYYY-MM-DD').format('DD-MM-YYYY')+']');
            $.each(allteams,function(k,v){
                if (response.activityDetail.activity_workspace != null) {
                    if (v.team_id == response.activityDetail.activity_workspace) {
                        $('#toDoName_2 .task_teamName').text(' @ '+v.team_title);
                    }
                }else{
                    $('#toDoName_2 .task_teamName').text('');
                }
            });
            $.each(allUnit,function(k,v){
                if (v.unit_id == response.activityDetail.bunit_id) {
                    $('#taskCategory').text('Work Category: ['+v.unit_name+']');
                }
            });
            // $('#taskCreated_At_time').text('at '+moment(response.activityDetail.activity_created_at, 'YYYY-MM-DD HH:mm:ssZZ').format('hh:mm A')+'');

            // if(response.childActivities.length > 0){
                
            //     $('#taskStatusSelect').val('Working').trigger('change'); 
            //     $("#taskStatusSelect").css('pointer-events','none');
            //     $(".task_status .rdonlyText").css('display','inline-block');
            //     $(".task_status .rdonlyDiv").css('display','block');
            //     $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','none');
            // }else{
            //     $('#taskStatusSelect').val('Initiate').trigger('change'); 
            //     $("#taskStatusSelect").css('pointer-events','auto');
            //     $(".task_status .rdonlyText").css('display','none');
            //     $(".task_status .rdonlyDiv").css('display','none');
            //     $("#taskStatusSelect").next('.select2.select2-container').css('pointer-events','auto');
            // }
            
            $('.workspaceform').show();
            $('#TTM').html('');
            $('.count_member.tcm + .customToolTip').html('');
            // $('#subtaskListBackWrap .list_Count').text('('+ response.childActivities.length +')');

            
            // let html = '<div class="list showEl perListUser_'+v+'" style="position:relative">'+
            //             '<p class="member_label">Admin</p>'+
            //             '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(v).img+'">'+
            //             '<h1 class="memberName">'+findObjForUser(v).fullname+'</h1>'+
            //         '</div>'
            // $('#memberListBackWrap .memberList').append(html);

            // let html = '<div class="list showEl perListUser_'+v+'" style="position:relative">'+
            //             '<p class="member_label">Observer</p>'+
            //             '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(v).img+'">'+
            //             '<h1 class="memberName">'+findObjForUser(v).fullname+'</h1>'+
            //         '</div>'
            // $('#memberListBackWrap .memberList').append(html);

            // let html = '<div class="list showEl perListUser_'+v+'" style="position:relative">'+
            //             '<p class="member_label">Member</p>'+
            //             '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(v).img+'">'+
            //             '<h1 class="memberName">'+findObjForUser(v).fullname+'</h1>'+
            //         '</div>'
            // $('#memberListBackWrap .memberList').append(html);

            $('#totalTaskMember').text('['+ ttm +' Member(s)]');
            $('.count_member.tcm').text(''+ ttm +' Member(s)');
            $('#memberListBackWrap .list_Count').text('('+ ttm +')');
            $('#memberListBackWrap .memberList').html('');
            let htmlOwner = '<div class="list showEl perListUser_'+ creator +'" style="position:relative">'+
                            '<p class="member_label"> Owner </p>'+
                            '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser( creator ).img+'">'+
                            '<h1 class="memberName">'+findObjForUser( creator ).fullname+'</h1>'+
                        '</div>'
            $('#memberListBackWrap .memberList').prepend(htmlOwner);
            $('#TTM').prepend('<span>'+findObjForUser( creator ).fullname+' (Owner)</span><br>');
            
            if(participants.length > 0){
                $.each(participants, function (kk,vv) {
                    if (activity_admin != null && activity_admin.length > 0) {
                        $.each(activity_admin, function (k,v) {
                            if (v == vv && v !== creator) {

                                $('#TTM').append('<span>'+findObjForUser(v).fullname+' (Admin)</span><br>');
                            }
                        });
                    }
                    if (activity_observer != null && activity_observer.length > 0) {
                        $.each(activity_observer, function (k,v) {
                            if (v == vv && v !== creator) {
                                $('#TTM').append('<span>'+findObjForUser(v).fullname+' (Observer)</span><br>');
                            }
                        });
                    }
                    if (activity_member != null && activity_member.length > 0) {
                        $.each(activity_member, function (k,v) {
                            if (v == vv && v !== creator) {
                                $('#TTM').append('<span>'+findObjForUser(v).fullname+' (Member)</span><br>');
                            }
                        });
                    }


                    $('.count_member.tcm + .customToolTip').append('<span>'+findObjForUser(vv).fullname+' </span><br>');
                    if (vv !== creator) {
                        let html = '<div class="list showEl perListUser_'+vv+'" style="position:relative">'+
                                        // '<p class="member_label"></p>'+
                                        '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(vv).img+'">'+
                                        '<h1 class="memberName">'+findObjForUser(vv).fullname+'</h1>'+
                                    '</div>'
                        $('#memberListBackWrap .memberList').append(html);
                    }
                })
            }

            // Creator & Admin Img View
            if (activity_admin != null && activity_admin.length > 0) {
                $('#taskOwnerList img').remove();
                $('#taskOwnerList .count_plus').hide();
                // if (!validate.isEmpty(creator)) {
                //     $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(creator.toString()).img + '" data-uuid="' + findObjForUser(creator.toString()).id + '" class="sharedIMG memberImg' + findObjForUser(creator.toString()).id + ' ownerThisToDo">');
                //     $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(creator.toString()).fullname+'</span>');
                // }

                var currentImage = [];
                $.each(activity_admin, (k, v) => {
                    currentImage.push(v);
                    if (currentImage.length < 4) {
                        $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v.toString()).img + '" data-uuid="' + findObjForUser(v).id + '" class="sharedIMG memberImg' + findObjForUser(v).id + '">');
                    }
                    if (currentImage.length > 3) {
                        $('#taskOwnerList .count_plus').show();
                        $('#taskOwnerList .count_plus').text('+' + (currentImage.length - 3));
                    }
                    $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                });
            }else{
                $('#taskOwnerList img').remove();
                if (!validate.isEmpty(creator)) {
                    $('#taskOwnerList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(creator.toString()).img + '" data-uuid="' + findObjForUser(creator.toString()).id + '" class="sharedIMG memberImg' + findObjForUser(creator.toString()).id + ' ownerThisToDo">');
                    $('#taskOwnerList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(creator.toString()).fullname+'</span>');
                }
            }

            // Observer Img View
            if (activity_observer != null && activity_observer.length > 0) {
                $('#taskObserverList').attr('placeholder', '');
                $('#taskObserverList img').remove();
                $('#taskObserverList .count_plus').hide();
                var currentImage = [];
                $.each(activity_observer, (k, v) => {
                    currentImage.push(v);
                    if (currentImage.length < 4) {
                        $('#taskObserverList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
                    }
                    if (currentImage.length > 3) {
                        $('#taskObserverList .count_plus').show();
                        $('#taskObserverList .count_plus').text('+' + (currentImage.length - 3));
                    }
                    $('#taskObserverList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                });
            }else {
                if($('#actCre').val() == user_id){
                    $('#taskObserverList').attr('placeholder', 'Add Observer');
                }else{
                    $('#taskObserverList').attr('placeholder', 'No Observer');
                }
            }

            if (activity_member != null && activity_member.length > 0) {
                $('#taskAssigneeList').attr('placeholder', '');
                $('#taskAssigneeList img').remove();
                $('#taskAssigneeList .count_plus').hide();
                var currentImage = [];
                $.each(activity_member, (k, v) => {
                    currentImage.push(v);
                    if (currentImage.length < 4) {
                        $('#taskAssigneeList').prepend('<img src="'+ file_server +'profile-pic/Photos/' + findObjForUser(v).img + '" data-uuid="' + v + '" class="observers memberImg' + v + '">');
                    }
                    if (currentImage.length > 3) {
                        $('#taskAssigneeList .count_plus').show();
                        $('#taskAssigneeList .count_plus').text('+' + (currentImage.length - 3));
                    }
                    $('#taskAssigneeList').parent('.mycustomTooltip').find('.tooltipspan').append('<span>'+findObjForUser(v).fullname+'</span>');
                });
            }else {
                if($('#actCre').val() == user_id){
                    $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
                }else{
                    $('#taskAssigneeList').attr('placeholder', 'No Assignee');
                }

            }


            //pin activity id set
            $("#pin_unpin").attr("data-acid", activity_id);
            $("#createTaskConvTag").attr('data-acid', activity_id);
            if ($('#completedSidecontainer').is(':visible') == false) {
                setCookie('lastActive', activity_id, 1);
            }

            $("#actionFileUpload").attr('data-myid',activity_id);

            if(!validate.isEmpty(activityDetail.activity_title)){
                if (activityDetail.activity_title.length > 60) {
                    $('.edit-todo-name').css('height', '50px');
                    // $('.to_do_head_left').css('margin', '6px 0px');
                    // $('.to_do_head_left label').css('top', '20px');
                    // $('.to_do_head_left .checkbox_container').css('top', '12px');
                    // $('.edit-todo-name').css('line-height', '22px');
                } else {
                    $('.edit-todo-name').css('height', '32px');
                    // $('.to_do_head_left').css('margin', '22px 0px');
                    // $('.to_do_head_left>label').css('top', '5px');
                    // $('.edit-todo-name').css('line-height', '32px');
                    // $('.to_do_head_left .checkbox_container').css('top', '6px');
                }
            }

            $("#todoTitle").val(activityDetail.activity_title);
            $('#toDoName_2 .task_name').text(activityDetail.activity_title);

            $.each(allteams, function(k, v){
                $("#selectWorkspace").append('<option value="'+v.team_id+'">'+v.team_title+'</option>');
            });
            
            $("#selectWorkspace").find('option[value="' + activityDetail.activity_workspace + '"]').attr("selected", true);
            // $('#selectWorkspace').select2().trigger('change');
            // $("#taskStatusSelect").find('option[value="' + activityDetail.activity_status + '"]').attr("selected", true);
            // $('#taskStatusSelect').select2().trigger('change');

            $("#dueDatePicker").val(moment(activityDetail.activity_end_time).format('DD-MM-YYYY'));
            
            $("#notes_area").text(activityDetail.activity_description);
            $("#addTodoTaskDescription").text(activityDetail.activity_description);

            // $("#timeFrom").val(activityDetail.activity_from);
            // $("#timeTo").val(activityDetail.activity_to);
            $("#ReminderTime").val(activityDetail.activity_has_reminder);

            // var activity_budget_amount      = (validate.isEmpty(activityDetail.activity_budget_amount) ? 0 : activityDetail.activity_budget_amount);
            // var activity_actual_amount  = (validate.isEmpty(activityDetail.activity_actual_amount) ? 0 : activityDetail.activity_actual_amount);
            // var activity_est_hour  = (validate.isEmpty(activityDetail.activity_est_hour) ? '0:00' : activityDetail.activity_est_hour);
            // var activity_est_hourly_rate     = (validate.isEmpty(activityDetail.activity_est_hourly_rate) ? 0 : activityDetail.activity_est_hourly_rate);
            // var activity_actual_hour      = (validate.isEmpty(activityDetail.activity_actual_hour) ? '0:00' : activityDetail.activity_actual_hour);
            // var activity_actual_hourly_rate      = (validate.isEmpty(activityDetail.activity_actual_hourly_rate) ? 0 : activityDetail.activity_actual_hourly_rate);
            
            // $("#taskBAinput").val(parseFloat(activity_budget_amount).toFixed(2));
            // $("#taskAAinput").val(parseFloat(activity_actual_amount).toFixed(2) );

            // $("#taskEHinput").val(activity_est_hour);
            // $("#taskEHRinput").val(parseFloat(activity_est_hourly_rate).toFixed(2));

            // $("#taskAHinput").val(activity_actual_hour);
            // $("#taskAHRinput").val(parseFloat(activity_actual_hourly_rate).toFixed(2));

            // rootBudgetAmount = ( validate.isEmpty(activityDetail.activity_budget_amount) ? 0 : parseFloat(activityDetail.activity_budget_amount));
            // rootActualAmount = (validate.isEmpty(activityDetail.activity_actual_amount) ? 0 : parseFloat(activityDetail.activity_actual_amount));
            // rootEstWorkHour = (validate.isEmpty(activityDetail.activity_est_hour) ? 0 : parseFloat(activityDetail.activity_est_hour));
            // rootEstHourRate = (validate.isEmpty(activityDetail.activity_est_hourly_rate) ? 0 : parseFloat(activityDetail.activity_est_hourly_rate));
            // rootActualWorkHour = (validate.isEmpty(activityDetail.activity_actual_hour) ? 0 : parseFloat(activityDetail.activity_actual_hour));
            // rootActualHourRate = (validate.isEmpty(activityDetail.activity_actual_hourly_rate) ? 0 : parseFloat(activityDetail.activity_actual_hourly_rate));

            // Completed

            if(activityDetail.activity_status === 'Completed'){
                $("#amazonWishlist").prop('checked',true);
            }else{
                $("#amazonWishlist").prop('checked',false);
            }

            // Budget Section Variance 
            var ba = ($('#taskBAinput').val() != '' ?  $('#taskBAinput').val() : 0);
            var aa = ($('#taskAAinput').val() != '' ?  $('#taskAAinput').val() : 0);
            
            var diff = ba - aa;
            
            $('#budget_variance span').text(parseFloat(diff).toFixed(2));

            $('#budget_variance').removeClass('_inactive');

            if(diff > -1){
                $('#budget_variance span').css('color','#53627c');
            }else{
                $('#budget_variance span').css('color','red');
            }


            // Est Time Section Variance 
            // var esh = ($('#taskEHinput').val() != '' ?  $('#taskEHinput').val() : '0:00');
            // var eshr = ($('#taskEHRinput').val() != '' ?  $('#taskEHRinput').val() : '0.00');
            // var totalmin = 0;
            // var minarray = esh.split(':');
                // totalmin = ((minarray[0] * 60) + Number(minarray[1] !== undefined ? minarray[1]:0 )) / 60;
                // $('#e_h_variance span').text(Math.ceil(esh * eshr));
            // $('#e_h_variance span').text(parseFloat(parseFloat(totalmin*eshr).toFixed(2)));
            
            // $('#e_h_variance').removeClass('_inactive');

            // Actual Time Section Variance 
            // var eh = ($('#taskAHinput').val() != '' ?  $('#taskAHinput').val() : '0:00');
            // var ehr = ($('#taskAHRinput').val() != '' ?  $('#taskAHRinput').val() : '0.00');
            // var totalminactu = 0;
            // var minarrayactu = eh.split(':');
            // totalminactu = ((minarrayactu[0] * 60) + Number(minarrayactu[1] !== undefined ? minarrayactu[1]:0 )) / 60;
            // $('#e_h_r_variance span').text(parseFloat(parseFloat(totalminactu*ehr).toFixed(2)));

            $('#e_h_r_variance').removeClass('_inactive');
            

            $("#thisWeekPluseContainer").show();
            
            $(".side_bar_list_item .n_td").removeClass('activeTodo');
            $(".side_bar_list_item .n_td").removeClass('selected');

            $("#activity_" + activity_id).addClass('activeTodo');
            $("#activity_" + activity_id).addClass('selected');

            //Pin Set
            // if(response.singleActivityPinResponse.status){
            //     if(response.singleActivityPinResponse.activities.length > 0){
            //         var pinData = response.singleActivityPinResponse.activities;
            //         $("#pin_unpin").attr('data-pinid',pinData[0].pin_id);
            //         //pinActivity(activity_id);
            //         $("#pin_unpin").addClass('pined');
            //         $("#pin_unpin").attr('src', '/images/basicAssets/custom_pinned.svg');
            //     }else{
            //         $("#pin_unpin").attr('data-pinid','');
            //         //unpinActivity(activity_id);
            //         $("#pin_unpin").removeClass('pined');
            //         $("#pin_unpin").attr('src', '/images/basicAssets/custom_not_pin.svg');
            //     }
            // }

            //Flag Set
            // if(response.singleActivityFlagResponse.status){
            //     if(response.singleActivityFlagResponse.activities.length > 0){
            //         var flagData = response.singleActivityFlagResponse.activities;
            //         $('#flag_unflag').attr('data-flagid',flagData[0].flag_id);
            //         flagged(activity_id);
            //     }else{
            //         $('#flag_unflag').attr('data-flagid','');
            //         unflagged(activity_id);
            //     }
            // }

            // Set TAG
            // chatmessagestag = response.messagestag;
            // if (response.messagestag.length > 0) {
            //     $.each(response.messagestag, function (k, v) {
            //         msgIdsFtag.push(v.id);
            //     });
            // }

            // if (response.tags != undefined) {
            //     var taggedID = response.tags;//all con tag tag_id
            //     var condtagsid = FtaggedList = response.condtagsid;//all con tag id

            //     var tempTagList = [];

            //     var totalTagslist = FtempArray = _.orderBy(response.totalTags, ['title'], ['asc']);

            //     $.each(totalTagslist, function (k, v) {

            //         if (alltags.indexOf(v.title.toLowerCase()) === -1) {
            //             my_tag_list[v.tag_id] = v.title.toLowerCase();
            //             alltags.push(v.title.toLowerCase());
            //             my_tag_id.push(v.tag_id.toString());
            //         }

            //         if (condtagsid.indexOf(v.tag_id) !== -1) {
            //             tagListForFileAttach.push(v.title.toLowerCase());
            //             tagListTitle.push(v.title.toLowerCase());
            //             tagLsitDetail.push({ 'cnvtagid': taggedID[condtagsid.indexOf(v.tag_id)], 'tagid': v.tag_id, 'tagTitle': v.title.toLowerCase(), 'roomid': conversationid });

            //             var design = '<li onclick="removeLevel(\'' + taggedID[condtagsid.indexOf(v.tag_id)] + '\',\'' + conversationid + '\',\'' + v.tag_id + '\')">' + v.title + '<span class="tagcheck" id="level' + taggedID[condtagsid.indexOf(v.tag_id)] + '"></span></li>';

            //             if (tempTagList.indexOf(v.tag_id) === -1) { tempTagList.push(v.tag_id); }
            //             $('#taskTaggedList').append(design);
            //         }
            //     });

            //     $.each(totalTagslist, function (k, v) {
            //         if (tempTagList.indexOf(v.tag_id) === -1) {
            //             var design = '<li id="tagLi' + v.tag_id + '" onclick="addTagto(\'' + v.tag_id + '\',\'' + conversationid + '\')">' + v.title + '</li>';
            //             $('#taskTaggedList').append(design);
            //         }
            //     });

            //     if (tagListTitle.length > 0) {
            //         $("#taskTagItemList").text(tagListTitle.join(','));
            //         $(".tagged").attr('src', '/images/basicAssets/custom_tagged.svg');
            //     }
            // }
            
            participatedOwner       = [];
            participatedObserver    = [];
            participatedAssignee    = [];

            participantsDraw(participants);

            $('.created_priority').remove();
            $('.created_status').remove();

            // if(response.customStatusResponse != undefined){
            //     if(response.customStatusResponse.status){
            //         $.each(response.customStatusResponse.response, (key,val)=>{
            //             if(val.title != null && val.title != "" && !validate.isEmpty(val.title) && !validate.isEmpty(val.color_code)){
            //                 if(val.type == 'Priority'){

            //                     customPriority.push({
            //                         id: val.id,
            //                         title : val.title,
            //                         color: val.color_code.toString().trim()
            //                     });
    
            //                     var design = '<span onclick="pickPriority(this)" style="background-color: '+val.color_code+';" data-color="'+val.color_code+'"  data-id="" data-createdby="" class="single_priority created_priority">';
            //                         design += '      <span class="prioritySamColor"><img src="/images/basicAssets/drop.svg" alt=""></span>';
            //                         design += '      <span onclick="editPrioritylabel(this)" onkeypress="keypressPrioritylabel(event,this)" onblur="blurPrioritylabel(this)" id="cusSta_'+val.id+'" data-id="'+val.id+'"  class="priorityLabel">'+val.title+'</span>';
            //                         design += '      <span class="editpriority_label" onclick="editProiority(event,this)"></span>';
            //                         design += '      <span data-id="'+val.id+'" class="removepriority_label" onclick="removeProiority(event,this)"></span>';
            //                         design += '</span>';
            //                         design += '<div id="PCC_'+val.id+'" class="priorityChangeColor"></div>';
                                    
            //                     $('.create_priority').before(design);
            //                     $('.priority-color-wrapper').find('.status-change-color-icon:last').remove();
            //                     $('#PCC_'+val.id).append(colorpanels);
            //                     priorityColorSample();
            //                 }else if(val.type == 'Status'){
    
            //                     customStatus.push({
            //                         id: val.id,
            //                         title : val.title,
            //                         color: val.color_code.toString().trim()
            //                     });
    
            //                     var desgn = '<span onclick="pickStatus(this)"  data-color="'+val.color_code+'"  style="background-color:'+val.color_code+'" data-id="" data-createdby="" class="initiate single_status created_status"><span class="statusSamColor"  onclick="openColordiv(event,this)"><img src="/images/basicAssets/drop.svg" alt=""></span><span onclick="editStatuslabel(this)" data-id="'+val.id+'"  onkeypress="keypressStatuslabel(event,this)" onblur="blurStatuslabel(this)" id="cusSta_'+val.id+'" class="statusLabel">'+val.title+'</span><span class="editpriority_label" onclick="editStatusLabel(event,this)"></span><span class="removepriority_label" data-id="'+val.id+'"  onclick="removeStatusLabel(event,this)"></span></span><div class="statusChangeColor" id="SCC_'+val.id+'"></div>';
                                
            //                     $('.create_new_status').before(desgn);
            //                     $('.priority-color-wrapper').find('.status-change-color-icon:last').remove();
            //                     $('#SCC_'+val.id).append(colorpanels);
            //                     // StatusColorSample();
            //                 }
            //             }
                        
            //         });
            //     }
            // }
            // var colSortRes = (response._ColSortOnActivity != undefined ? response._ColSortOnActivity.res : '');
            // childActivitiesDraw(response.childActivities,response.childActivitiesParticipants,response.customActivityColRes,response.childActivityFlagResponse,colSortRes);

            // $('.kill').css('height',response.childActivities.length*37+200);
            
            
            // if($('#actCre').val() == user_id){
            //     if(activity_observer.length == 0){
            //         $('#taskObserverList').attr('placeholder', 'Add Observer');
            //     }
            //     if(activity_member.length == 0){
            //         $('#taskAssigneeList').attr('placeholder', 'Add Assignee');
            //     }
            // }else{
            //     if(activity_observer.length == 0){
            //         $('#taskObserverList').attr('placeholder', 'No Observer');
            //     }
            //     if(activity_member.length == 0){
            //         $('#taskAssigneeList').attr('placeholder', 'No Assignee');
            //     }
            // }

            if($('#actCre').val() == user_id){
                $('#fpc_corner-button').find('span').text('Owner');
                $('#restrictedMode').hide()
            }else if(activity_admin.indexOf(user_id) > -1){
                $('#fpc_corner-button').find('span').text('Co-owner');
                $('#restrictedMode').hide()
            }else if(activity_observer.indexOf(user_id) > -1){
                $('#fpc_corner-button').find('span').text('Observer');
                $('#restrictedMode').show()
            }else if(activity_member.indexOf(user_id) > -1){
                $('#fpc_corner-button').find('span').text('Assignee');
                $('#restrictedMode').show()
            }

        }else{
            console.log("Something wrong with retrive activity data");
        }
        
        // $(".expand-column").each((k,v)=>{

        //     if($(v).is(':visible')){
        //         $(v).trigger('click');
        //     }
        // });

        // checkActivityAccessibilities(user_id,response.activitySettingResponse);

        // filteringTaskShowing();
    });
}

function close_create_task() {
    $('.createTaskPopUp').hide();

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

function createTaskListDesign(value){
    var html = '';
        html += '<div class="list showEl perListUser_'+value+'">';
        html +=    '<img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(value).img+'">';
        html +=    '<span class="online_'+value+' offline"></span>';
        html +=    '<h1 class="memberName">'+findObjForUser(value).fullname+'</h1>';
        html +=    '<span onclick="addToBoxForCreateTask(\''+value+'\', this)" class="assignTypeBtn" assignType="admin">Admin</span>';
        html +=    '<span onclick="addToBoxForCreateTask(\''+value+'\', this)" class="assignTypeBtn" assignType="observer">Observer</span>';
        html +=    '<span onclick="addToBoxForCreateTask(\''+value+'\', this)" class="assignTypeBtn" assignType="member">Member</span>';
        html += '</div>';
        return html;
}

function removeCTManageList(id){
    removeA(tempCTAdminC,id);
    removeA(tempCTObserverC,id);
    removeA(tempCTMemberC,id);
    
    if(removeList.indexOf(id) == -1){
        removeList.push(id);
    }

    $('.perU'+id).remove();
    $('#task_Member_List input').focus();
    $('#taskManage .memberList').prepend(createTaskListDesign(id));

    var tempList = $('#task_Member_List .perU_profile').length;
    if (tempList > 0) {
        $("#addActivitAdminBtn").css({'pointer-events':'auto','background-color':'var(--BtnC)'});
    }else{
        $("#addActivitAdminBtn").css({'pointer-events':'none','background-color':'gainsboro'});
    }

}

function boxUserDesign(id,color){
  var html = '';
      html += '<div class="perU_profile perU'+id+'" style="background: unset;background-color: '+color+'" data-id="'+id+'">';
      html +=    '<span class="tempE img"><img src="'+ file_server +'profile-pic/Photos/'+findObjForUser(id).img+'"></span>';
      html +=    '<p class="tempE perU_name">'+findObjForUser(id).fullname+'</p>';
      html +=    '<span class="tempE perU_remove" onclick="removeCTManageList(\''+id+'\')"></span>';
      html += '</div>';
      return html;
}

function addToBoxForCreateTask(id,ele){
    var color = '';
    if($(ele).attr('assignType') == 'admin'){
      tempCTAdminC.push(id);
      color = '#8B0000';
    }else if ($(ele).attr('assignType') == 'observer') {
      tempCTObserverC.push(id);
      color = '#FFA500';
    } else {
      tempCTMemberC.push(id);
      color = '#5cd4ef';
    }
    $('.perListUser_'+id).remove();
    $('#task_Member_List').prepend(boxUserDesign(id,color));
    $('#task_Member_List input').focus();
    var tempList = $('#task_Member_List .perU_profile').length;
    if (tempList > 0) {
        $("#addActivitAdminBtn").css({'pointer-events':'auto','background-color':'var(--BtnC)'});
    }
}

function submitAddTaskMember(){
    $('#ctaskMemberlist').html('');
    $('.taskmemberDivTitle').show();

    $.each(workspace_user,function(k,v){
        if(v.id == user_id){
        tempCTAdminC.push(user_id);
        if (CreatetaskParticipants.indexOf(v.id) == -1) {
            CreatetaskParticipants.push(v.id);
        }
            var html = '<li class="showEl">'
                            +'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
                            +'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>' 
                            +'<span class="designation-name"> @ Creator</span>'
                        +'</li>';
            $('#ctaskMemberlist').prepend(html);
        } else if(tempCTAdminC.indexOf(v.id) > -1){
            if (CreatetaskParticipants.indexOf(v.id) == -1) {
                CreatetaskParticipants.push(v.id);
            }
            if(v.id !== user_id){
            var html = '<li class="showEl task_members_'+v.id+'">'
                    +'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
                    +'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>' 
                    +'<span class="designation-name"> @ Admin</span>'
                    +'<span class="editRole_opt">'
                        +'<i class="task_members" data-type="observer" onclick="editRole(\''+v.id+'\',this)">Observer</i>'
                        +'<i class="task_members" data-type="member" onclick="editRole(\''+v.id+'\',this)">Member</i>'
                        +'<i class="task_members" data-type="remove" onclick="editRole(\''+v.id+'\',this)">Remove</i>'
                    +'</span>';
                    +'</li>';
            $('#ctaskMemberlist').append(html);
            }

        } else if(tempCTObserverC.indexOf(v.id) > -1){
            if (CreatetaskParticipants.indexOf(v.id) == -1) {
                CreatetaskParticipants.push(v.id);
            }
				var html = '<li class="showEl task_members_'+v.id+'">'
								+'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
								+'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>' 
                                +'<span class="designation-name"> @ Observer</span>'
                                +'<span class="editRole_opt">'
                                    +'<i class="task_members" data-type="admin" onclick="editRole(\''+v.id+'\',this)">Admin</i>'
                                    +'<i class="task_members" data-type="member" onclick="editRole(\''+v.id+'\',this)">Member</i>'
                                    +'<i class="task_members" data-type="remove" onclick="editRole(\''+v.id+'\',this)">Remove</i>'
                                +'</span>'
                            +'</li>';
            $('#ctaskMemberlist').append(html);
        } else if(tempCTMemberC.indexOf(v.id) > -1){
            if (CreatetaskParticipants.indexOf(v.id) == -1) {
                CreatetaskParticipants.push(v.id);
            }
            var html = '<li class="showEl task_members_'+v.id+'">'
                            +'<img src="'+ file_server +'profile-pic/Photos/'+v.img+'" class="profile">'
                            +'<span class="name s-l-def-clas" data-uuid="'+v.id+'">'+v.fullname+'</span>' 
                            +'<span class="designation-name"> @ Member</span>'
                            +'<span class="editRole_opt">'
                                +'<i class="task_members" data-type="admin" onclick="editRole(\''+v.id+'\',this)">Admin</i>'
                                +'<i class="task_members" data-type="observer" onclick="editRole(\''+v.id+'\',this)">Observer</i>'
                                +'<i class="task_members" data-type="remove" onclick="editRole(\''+v.id+'\',this)">Remove</i>'
                            +'</span>'
                        +'</li>';
            $('#ctaskMemberlist').append(html);
        }

    });
    $('#taskManage').hide();
}

function addTaskMembers() {

    if(!validate.isEmpty($("#create_task_team").val())){
        $('#taskManage').show();
        $('#taskManage .perU_profile').remove();
        $('#task_Member_List input').focus();
        $('#taskManage .memberList').html('');
        $('#taskManage #addActivitAdminBtn').attr('onclick','submitAddTaskMember()');

        $.each(tempCTAdminC, function name(ka,va) {
        if (va !== user_id) {
            $('#task_Member_List').prepend(boxUserDesign(va));
        }
        })
        $.each(tempCTObserverC, function name(ka,va) {
        $('#task_Member_List').prepend(boxUserDesign(va));
        })
        $.each(tempCTMemberC, function name(ka,va) {
        $('#task_Member_List').prepend(boxUserDesign(va));
        })

        $.each(workspace_user,(k,v)=>{
        if(v.id !== $('#actCre').val()){
            if(tempCTAdminC.indexOf(v.id) == -1){
            if(tempCTObserverC.indexOf(v.id) == -1){
                if(tempCTMemberC.indexOf(v.id) == -1){
                $('#taskManage .list_Count').text('('+ k +')');
                $('#taskManage .memberList').append(createTaskListDesign(v.id));
                }
            }
            }
        }
        });
    }else{
        warningMsg('Please select a team.');
    }
}

function crtt_onchange(ele){
    if ($('#create_task_title').val().trim() != '') {
        $('.ctCreate_btn').css({'background-color':'var(--BtnC)','pointer-events':'auto'});
    }else{
        $('.ctCreate_btn').css({'background-color':'gainsboro','pointer-events':'none'});
    }
}

function createTaskTitle(e) {
    var key = e.keyCode || e.charCode || e.which;
    if (key == 32) {
        if ($(e.target).val().trim() == '') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }

    if ($('#create_task_BUnit').val() != '' && $('#create_task_BUnit').val() != null) {
        if ($(e.target).val().trim() != '') {
            $('.ctCreate_btn').css({'background-color':'var(--BtnC)','pointer-events':'auto'});
        }else{
            $('.ctCreate_btn').css({'background-color':'gainsboro','pointer-events':'none'});
        }
    }
    if (key == 13) {
        createNewTask();
    }

    var haveFirst = false;
    if($(e.target).val().length === 0 ) {
        haveFirst = false;
    }

    var regex = new RegExp("^[a-zA-Z0-9_ ]+$");
    var first = new RegExp("^[a-zA-Z0-9_ \b]+$");
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if(!first.test(key) && haveFirst == false){
        e.preventDefault();
        return false;
    }else if(regex.test(key)){
        haveFirst = true;
    }
    if (!regex.test(key)) {
        e.preventDefault();
        return false;
    }
}

function createNewTask() {

    //create activity obj from Activity class
    const activityNew = new ActivityNew();

    activityNew.activityTitle            = $("#create_task_title").val();
    activityNew.activityEcosystem        = $("#create_task_team").val();
    activityNew.activityStatus           = null;
    activityNew.activityDueDate          = ($("#create_du_date").val() != '') ? $("#create_du_date").val() : null;
    activityNew.activityNotesArea        = $("#create_task_desc").val();
    activityNew.activityReminder         = null;
    activityNew.activityBudgeAmount      = $("#create_task_budget").val();
    activityNew.activityActualAmount     = null;
    activityNew.activityEstHour          = $("#create_EstWorkHour").val();
    activityNew.activityEstHourRate      = null;
    activityNew.activityActualHour       = null;
    activityNew.activityActualHourRate   = null;
    activityNew.activityType             = 'Task';
    activityNew.activityCreatedBy        = user_id;
    activityNew.company_id               = companyID;
    activityNew.participantsArry         = (CreatetaskParticipants.length == 0) ? [user_id] : CreatetaskParticipants;
    activityNew.activity_admin           = (CreatetaskParticipants.length == 0) ? [user_id] : tempCTAdminC;
    activityNew.activity_observer        = tempCTObserverC;
    activityNew.activity_member          = tempCTMemberC;
    activityNew.flag_id                  = null;
    activityNew.pin_id                   = null;
    activityNew.bunit_id                 = $("#create_task_BUnit").val();

    var activityCreatedBy = (!validate.isEmpty(activityNew.activityCreatedBy) ? true : false);

    var workCategory = (!validate.isEmpty($("#create_task_BUnit").val()) ? true : warningMsg('Please select a Work Category.'));
    var titleWarning = (!validate.isEmpty($("#create_task_title").val().trim()) ? true : warningBorder('create_task_title'));

    if(activityCreatedBy){
        if(workCategory){
            if(titleWarning){
                if(taskTitleArr.indexOf( $("#create_task_title").val().toLowerCase().trim())== -1){
                    activityNew.saveActivity((response)=>{
                        if(!validate.isEmpty(response)){
                            if (response.status) {
                                $('#toDoCheckListContainer').css('display', 'block');
                                $('#sharePeopleList').css('display', 'block');
                                $('.item_progress').css('display', 'flex');
                                $('.new-added-check-list').css('display', 'block');
    
                                taskTitleArr.push($("#create_task_title").val().toLowerCase().trim());

                                $("#updateAction").val(response.activity_id);
                                let seclabel = '<div class="secLabel" style="position: absolute;height: 18px;bottom: 2px;visibility:hidden">'+
                                '<p id="totalTask" onclick="totalSubTask()" style="float: right;margin-right: 7px;cursor: pointer;border-left: 2px solid #d8d8d8;padding-left: 7px;">0 Subtask(s)</p>'+
                                '<div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: -58px" id="TST"></div>'+
                                '  <p id="totalTaskMember" onclick="totalTaskMember()" style="float: right;margin-right: 7px;cursor: pointer;margin-left: 7px;border-left: 2px solid #d8d8d8;padding-left: 7px;">1 Member(s)</p>'+
                                '  <div class="customToolTip" style="text-align:left;width:200px;left: unset;top:21px;right: 16px" id="TTM"></div>'+
                                '  <span id="taskCreated_By"></span>'+
                                '  <span id="taskCreated_At"></span>'+
                                '  <span id="taskCreated_At_time" style="margin-left:5px;line-height: 17px;"></span>'+
                                '</div>';
                                $('#todoTitle + .secLabel').remove();
                                $(seclabel).insertAfter('#todoTitle');
        
                                var liDesign = '<li id="activity_' + response.activity_id + '" data-activityid="' + response.activity_id + '" class="com-t-l todoLink activeTodo n_td" data-urm="0" onclick="startToDo(event)"><span class="toDo"></span><span class="toDoName">' + $("#create_task_title").val() + '</span><span class="remove" onclick="hideThisTodo(event, \''+response.activity_id +'\')"></span></li>';
                                $("#n_ToDo_item").remove();
                                $('#unpinTodoList').prepend(liDesign);
                                $('.createTaskPopUp').hide();
                                $("#activity_" + response.activity_id).trigger('click');
                                //   task_join_into_room();
                            }else{
                                console.log("Something wrong with DB",response);
                            }
                        }else{
                            console.log("Something wrong with DB",response);
                        }
                    });
                }else{
                    toastr['warning']($("#todoTitle").val()+' already in your tasklist', 'Warning');
                    $("#todoTitle").val('').focus();
                }
            }else{
                console.log("Data missing");
            }
        }
    }else{
        console.log("User Id is not defined");
    }
}

function ActivityNew(
    activityTitle,
    activityEcosystem,
    activityStatus,
    activityDueDate,
    activityNotesArea,
    activityReminder,
    activityBudgeAmount,
    activityActualAmount,
    activityEstHour,
    activityEstHourRate,
    activityActualHour,
    activityActualHourRate,
    activityType,
    activityCreatedBy,
    company_id,
    participantsArry,
    activity_admin,
    activity_observer,
    activity_member,
    flag_id,
    pin_id,
    bunit_id
    ){
    this.activityTitle              = activityTitle;
    this.activityEcosystem          = activityEcosystem;
    this.activityStatus             = activityStatus;
    this.activityDueDate            = activityDueDate;
    this.activityNotesArea          = activityNotesArea;
    this.activityReminder           = activityReminder;
    this.activityBudgeAmount        = activityBudgeAmount;
    this.activityActualAmount       = activityActualAmount;
    this.activityEstHour            = activityEstHour;
    this.activityEstHourRate        = activityEstHourRate;
    this.activityActualHour         = activityActualHour;
    this.activityActualHourRate     = activityActualHourRate;
    this.activityType               = activityType;
    this.activityCreatedBy          = activityCreatedBy;
    this.company_id                 = company_id;
    this.participantsArry           = participantsArry;
    this.activity_admin             = activity_admin;
    this.activity_observer          = activity_observer;
    this.activity_member            = activity_member;
    this.flag_id                    = flag_id;
    this.pin_id                     = pin_id;
    this.bunit_id                   = bunit_id;
}

ActivityNew.prototype.saveActivity = function (callback) {
    if(validate.isEmpty(this.activityTitle) && validate.isEmpty(this.activityCreatedBy)){
        callback({'status':false});
    }else{
        let data = {
            activityTitle           : (!validate.isEmpty(this.activityTitle)         ? this.activityTitle : 'NA'),
            activityEcosystem       : (!validate.isEmpty(this.activityEcosystem)     ? this.activityEcosystem : ''),
            activityStatus          : (!validate.isEmpty(this.activityStatus)        ? this.activityStatus : null),
            activityDueDate         : (!validate.isEmpty(this.activityDueDate)       ? this.activityDueDate : null),
            activityNotesArea       : (!validate.isEmpty(this.activityNotesArea)     ? this.activityNotesArea : ''),
            activityReminder        : (!validate.isEmpty(this.activityReminder)      ? this.activityReminder : ''),
            activityBudgeAmount     : (!validate.isEmpty(this.activityBudgeAmount)   ? this.activityBudgeAmount : '0'),
            activityActualAmount    : (!validate.isEmpty(this.activityActualAmount)  ? this.activityActualAmount : '0'),
            activityEstHour         : (!validate.isEmpty(this.activityEstHour)       ? this.activityEstHour : '00:00'),
            activityEstHourRate     : (!validate.isEmpty(this.activityEstHourRate)   ? this.activityEstHourRate : '0'),
            activityActualHour      : (!validate.isEmpty(this.activityActualHour)    ? this.activityActualHour : null),
            activityActualHourRate  : (!validate.isEmpty(this.activityActualHourRate)? this.activityActualHourRate : null),
            activityType            : (!validate.isEmpty(this.activityType)          ? this.activityType : 'Task'),
            activityCreatedBy       : (!validate.isEmpty(this.activityCreatedBy)     ? this.activityCreatedBy : ''),
            companyID               : (!validate.isEmpty(this.company_id)            ? this.company_id : ''),
            participantsArry        : (!validate.isEmpty(this.participantsArry)      ? this.participantsArry : null),
            activity_admin          : (!validate.isEmpty(this.activity_admin)        ? this.activity_admin : null),
            activity_observer       : (!validate.isEmpty(this.activity_observer)     ? this.activity_observer : null),
            activity_member         : (!validate.isEmpty(this.activity_member)       ? this.activity_member : null),
            flag_id                 : (!validate.isEmpty(this.flag_id)               ? this.flag_id : null),
            pin_id                  : (!validate.isEmpty(this.pin_id)                ? this.pin_id : null),
            bunit_id                : (!validate.isEmpty(this.bunit_id)              ? this.bunit_id : null),
        };

        var self = this;    
        
        socket.emit('saveActivityBySocket', { data },function (confirmation) {
            if (confirmation.status) {
                callback(confirmation);
            } else {
                callback(confirmation);                
            }
        });
    }
};

ActivityNew.prototype.getSingleActivity = function (callback) {
    let data = {
        activity_id          : this.activityId,
        activityCreatedBy    : this.activityCreatedBy
    };
    var self = this;
    socket.emit('singleActivityBySocket', { data },function (confirmation) {
        let activityRes = confirmation.singleActivityResponse;
        // let participantsRes = confirmation.singleActivityParticipantsResponse;
        
        if(activityRes.status){
            var activity = activityRes.activities[0];
            // if(participantsRes.status){

                callback({
                    status              : true,
                    activityDetail      : activity,
                    participants        : activity.participants,
                    activity_admin      : activity.activity_admin,
                    activity_observer   : activity.activity_observer,
                    activity_member     : activity.activity_member
                });

                // Activity.prototype.getChildActivitys.call(self,(response)=>{
                //     callback({
                //         status                          : true,
                //         activityDetail                  : activity,
                //         participants                    : participants,
                //         childActivities                 : response.childActivities,
                //         childActivitiesParticipants     : response.childActivitiesParticipantsRes.data,
                //         customActivityColRes            : response.customActivityColRes,
                //         singleActivityPinResponse       : confirmation.singleActivityPinResponse,
                //         singleActivityFlagResponse      : confirmation.singleActivityFlagResponse,
                //         totalTags                       : confirmation.totalTags,
                //         tags                            : confirmation.tags,
                //         condtagsid                      : confirmation.condtagsid,
                //         messagestag                     : confirmation.messagestag,
                //         customStatusResponse            : confirmation.customStatusResponse, // for subtasks status and phase
                //         childActivityFlagResponse       : response.childActivityFlagResponse, // For get subtask flagged data
                //         activitySettingResponse         : confirmation.activitySettingResponse,
                //         getChangeLogResponse            : confirmation.getChangeLogResponse, // for activity changelog
                //         _ColSortOnActivity              : confirmation._getAllColSortOnSingleActivityRes //for subtask coloum sorting
                //     });
                // });
            // }
        }else{
            callback({ status : false });
        }
        
    });
};

  
function totalTaskMember(){
    $('#memberListBackWrap').show();
    $('#memberListBackWrap .search_List').hide();
    $('#memberListBackWrap .static_design').hide();
}

function warningMsg(msgs) {
    $('#warningsPopup').css('display','flex');
    $('#warningsPopup .warningMsg').text(msgs);
}

function globalOnKeypress_2(e) {
    var keyCode = e.keyCode || e.charCode || e.which;
   if ((keyCode != 8 || keyCode != 13 || keyCode ==32 ) && (keyCode < 48 || keyCode > 58)) {
       e.preventDefault();
       e.stopImmediatePropagation();
       if (keyCode == 13) {
           $(e.target).blur();
       }
    }
}

function onblurEstWh(e) {
    var est = $('#create_EstWorkHour').val().trim();
    if (est != '') {
        if (est.search(/:/i) == -1) {
            $('#create_EstWorkHour').val(est + ":00");
        }
    }else{
        $('#create_EstWorkHour').val("");
    }
}

function globalOnKeypress(e) {
    var keyCode = e.keyCode || e.charCode || e.which;
   if ((keyCode != 8 || keyCode != 13 || keyCode ==32 ) && (keyCode < 46 || keyCode > 57)) {
       e.preventDefault();
       e.stopImmediatePropagation();
       if (keyCode == 13) {
           $(e.target).blur();
       }
    }
}

function onblurTbudget(e) {
    var budget = $('#create_task_budget').val();
    if (budget != '') {
        if (budget.search(/./i) == -1) {
            $('#create_task_budget').val(budget + ".00");
        }
    }else{
        $('#create_task_budget').val("");
    }
}

function editRole(id, ele) {
    let type = $(ele).attr('data-type');
   if (type == 'remove') {
       if (CreatetaskParticipants.indexOf(id) > -1) {
           removeA(CreatetaskParticipants, id);
           removeA(tempCTAdminC, id);
           removeA(tempCTObserverC, id);
           removeA(tempCTMemberC, id);
           $('.task_members_'+id+'').remove();
       }
   } else if (type == 'admin') {
        if (tempCTAdminC.indexOf(id) == -1) {
            tempCTAdminC.push(id);
            $(ele).parents('.task_members_'+id).find('.designation-name').text('@ Admin');
            if (tempCTObserverC.indexOf(id) > -1) {
                removeA(tempCTObserverC, id);
                $(ele).attr('data-type','observer').text('Observer');
            } else {
                removeA(tempCTMemberC, id);
                $(ele).attr('data-type','member').text('Member');
            }
        }
   } else if (type == 'observer') {
        if (tempCTObserverC.indexOf(id) == -1) {
            tempCTObserverC.push(id);
            $(ele).parents('.task_members_'+id).find('.designation-name').text('@ Observer');
            if (tempCTAdminC.indexOf(id) > -1) {
                removeA(tempCTAdminC, id);
                $(ele).attr('data-type','admin').text('Admin');
            } else {
                removeA(tempCTMemberC, id);
                $(ele).attr('data-type','member').text('Member');
            }
        }
   } else if (type == 'member') {
        if (tempCTMemberC.indexOf(id) == -1) {
            tempCTMemberC.push(id);
            $(ele).parents('.task_members_'+id).find('.designation-name').text('@ Member');
            if (tempCTAdminC.indexOf(id) > -1) {
                removeA(tempCTAdminC, id);
                $(ele).attr('data-type','admin').text('Admin');
            } else {
                removeA(tempCTObserverC, id);
                $(ele).attr('data-type','observer').text('Observer');
            }
        }
   }
}

function activeMenuByclick(ele, type) {
    // $('.multipleProgress').hide();
    if (type == 'dsc') {
        if ($(ele).hasClass('active')) {
            $(ele).removeClass('active');
            $('.task_description').css('display','none');

            if ($('#sortable_kvview').hasClass('custom_Height1')) {
                    $('#sortable_kvview')
                        .removeClass('custom_Height1')
                        .addClass('normal_Height');
            }
        } else {
            $(ele).addClass('active');
            $('.task_description').css('display','flex');

            if ($('#sortable_kvview').hasClass('normal_Height')) {
                $('#sortable_kvview')
                    .removeClass('normal_Height')
                    .addClass('custom_Height1');
            }else{
                $('#sortable_kvview')
                .addClass('custom_Height1');
            }
        }
    } else {
        if ($(ele).hasClass('active')) {
            $(ele).removeClass('active');
            $('.task_ewh_budget').css('display','none');

            if ($('#sortable_kvview').hasClass('custom_Height2')) {
                $('#sortable_kvview')
                    .removeClass('custom_Height2')
                    .addClass('normal_Height');
            }
        } else {
            $(ele).addClass('active');
            $('.task_ewh_budget').css('display','flow-root');

            if ($('#sortable_kvview').hasClass('normal_Height')) {
                $('#sortable_kvview')
                    .removeClass('normal_Height')
                    .addClass('custom_Height2');
            }else{
                $('#sortable_kvview')
                .addClass('custom_Height2');
            }
        }
    }
}

// function activeMenuByclick(ele, type) {
//     $('.multipleProgress').hide();
//     if (type == 'dsc') {
//         if ($(ele).hasClass('active')) {
//             $(ele).removeClass('active');
//             $('.task_description').css('display','none');

//             if ($('#sortable_kvview').hasClass('custom_Height1')) {
//                     $('#sortable_kvview')
//                         .removeClass('custom_Height1')
//                         .addClass('normal_Height');
//             }
//         } else {
//             $(ele).addClass('active');
//             $('.task_description').css('display','flex');

//             if ($('#sortable_kvview').hasClass('normal_Height')) {
//                 $('#sortable_kvview')
//                     .removeClass('normal_Height')
//                     .addClass('custom_Height1');
//             }else{
//                 $('#sortable_kvview')
//                 .addClass('custom_Height1');
//             }
//         }
//     } else {
//         if ($(ele).hasClass('active')) {
//             $(ele).removeClass('active');
//             $('.task_ewh_budget').css('display','none');

//             if ($('#sortable_kvview').hasClass('custom_Height2')) {
//                 $('#sortable_kvview')
//                     .removeClass('custom_Height2')
//                     .addClass('normal_Height');
//             }
//         } else {
//             $(ele).addClass('active');
//             $('.task_ewh_budget').css('display','flow-root');

//             if ($('#sortable_kvview').hasClass('normal_Height')) {
//                 $('#sortable_kvview')
//                     .removeClass('normal_Height')
//                     .addClass('custom_Height2');
//             }else{
//                 $('#sortable_kvview')
//                 .addClass('custom_Height2');
//             }
//         }
//     }
// }

function viewTaskFileGallery() {
    $('#taskFilePreview').show();
    $('.media-tabs>li.active').trigger('click');
}

function taskBudgetOnblur(e) {
    var budget = $('#task_budgetAmount').val();
    if (budget != '') {
        if (budget.search(/./i) == -1) {
            $('#task_budgetAmount').val(budget + ".00");
        }
    }else{
        $('#task_budgetAmount').val("");
    }
}

function taskActualAmountOnblur(e) {
    var budget = $('#task_actualAmount').val();
    if (budget != '') {
        if (budget.search(/./i) == -1) {
            $('#task_actualAmount').val(budget + ".00");
        }
    }else{
        $('#task_actualAmount').val("");
    }
}

function taskEstimatedHrOnblur(e) {
    var budget = $('#task_estimatedHr').val();
    if (budget != '') {
        if (budget.search(/./i) == -1) {
            $('#task_estimatedHr').val(budget + ".00");
        }
    }else{
        $('#task_estimatedHr').val("");
    }
}

function taskActualHrOnblur(e) {
    var budget = $('#task_actualHr').val();
    if (budget != '') {
        if (budget.search(/./i) == -1) {
            $('#task_actualHr').val(budget + ".00");
        }
    }else{
        $('#task_actualHr').val("");
    }
}


function globalOnKeypress_2(e) {
    var keyCode = e.keyCode || e.charCode || e.which;
   if ((keyCode != 8 || keyCode != 13 || keyCode ==32 ) && (keyCode < 48 || keyCode > 58)) {
       e.preventDefault();
       e.stopImmediatePropagation();
       if (keyCode == 13) {
           $(e.target).blur();
       }
    }
}

function task_estimatedwhOnblur(e) {
    var est = $('#task_estimatedwh').val().trim();
    if (est != '') {
        if (est.search(/:/i) == -1) {
            $('#task_estimatedwh').val(est + ":00");
        }
    }else{
        $('#task_estimatedwh').val("");
    }
}

function globalOnKeypress_2(e) {
    var keyCode = e.keyCode || e.charCode || e.which;

   if ((keyCode != 8 || keyCode != 13 || keyCode ==32 ) && (keyCode < 48 || keyCode > 58)) {
       e.preventDefault();
       e.stopImmediatePropagation();
       if (keyCode == 13) {
           $(e.target).blur();
       }
    }
}

function task_actualWhOnblur(e) {
    var est = $('#task_actualWh').val().trim();
    if (est != '') {
        if (est.search(/:/i) == -1) {
            $('#task_actualWh').val(est + ":00");
        }
    }else{
        $('#task_actualWh').val("");
    }
}

function editTask_name(ele) {
    $(ele).hide();
    $('#todoTitle').show().focus();
}

function writeTaskDesc(e) {
    var key = e.keyCode || e.charCode || e.which;
    if (key == 32) {
        if ($(e.target).val().trim() == '') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
}
function create_new_Stask(e) {
    var key = e.keyCode || e.charCode || e.which;
    if (key == 32) {
        if ($(e.target).val().trim() == '') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
}
function create_task_desc(e) {
    var key = e.keyCode || e.charCode || e.which;
    if (key == 32) {
        if ($(e.target).val().trim() == '') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
}

function toggleChild(ele) {
    if (!$(ele).parents('.ct_row').hasClass('active')) {
        $(ele).parents('.ct_row').addClass('active');
    } else {
        $(ele).parents('.ct_row').removeClass('active');
    }
}

// Codes For Only Borad, Project, Activity, Sub-activity

function prevent_space(e) {
    var key = e.keyCode || e.charCode || e.which;
    if (key == 32) {
        if ($(e.target).val().trim() == '') {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
}
