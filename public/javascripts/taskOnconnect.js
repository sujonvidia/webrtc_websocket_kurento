function createToDo(e) {
	if (!$('#right-section-area').is(":visible")) {
		$('#right-section-area').show();
		$('#right-section-area-connect').hide();
		$('.onTask').show();
        $('.onConnect').hide();
    
    var activity = new Activity();
		activity.targetID = user_id;
		activity.getMyactivitiesOnConnect((response)=>{
            printActivities(response);
            $('#chat_icon').hide();
            createNewTodo();
            onloadValue();
            sortableFunc();
            amountCol();
            fireOnLoadInputValue();
        });
	}
}

function printActivities(response){

	if(response.data[0].pinned != undefined){
		if(response.data[0].pinned.length > 0){
            printPinnedActivities(response.data[0].pinned);
		}
	}
	
	if(response.data[0].overdue != undefined){
		if(response.data[0].overdue.length > 0){
			printOverdueActivities(response.data[0].overdue);
		}
	}
	
	if(response.data[0].normaltodo != undefined){
		if(response.data[0].normaltodo.length > 0){
			printNormaltodoActivities(response.data[0].normaltodo);
		}
    }
    
    task_join_into_room();
    subtask_join_into_room();
  
    column_hide_by_classname("owner");
    column_hide_by_classname("coowner");

}

function printPinnedActivities(data){
	$("#pinnedToDoList").html('');
	$.each(data, (k,v)=>{
		var design ='<li id="activity_'+v.activity_id+'" data-activityid="'+v.activity_id+'" data-urm=0 class="com-t-l od_to" onclick="startToDo(event)">';
				design +='	<span class="toDo"></span>';
				design +='	<span class="toDoName">'+v.activity_title+'</span>';
				design += 	(v.activity_status == 2 ? "<span class=\"draft\" style=\"margin-top:8px;\">(draft)</span>" : '');
				design += 	(v.hasflag == 1 ? '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:block;">' : '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">');
				design +='	<span class="unreadMsgCount"></span>';
				design += 	(user_id == v.activity_created_by ? '<span class="remove" onclick="hideThisTodo(event,\''+v.activity_id+'\')"></span>' : '');
				design +='</li>';
		$("#pinnedToDoList").append(design);
	});
}

function printOverdueActivities(data){
	$("#overdueULlist").html('');
	$.each(data, (k,v)=>{
		var design ='<li id="activity_'+v.activity_id+'" data-activityid="'+v.activity_id+'" data-urm=0 class="com-t-l od_to" onclick="startToDo(event)">';
				design +='	<span class="newtoDo"></span>';
				design +='	<span class="toDoName">'+v.activity_title+'</span>';
				design += 	(v.activity_status == 2 ? "<span class=\"draft\" style=\"margin-top:8px;\">(draft)</span>" : '');
				design += 	(v.hasflag == 1 ? '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:block;">' : '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">');
				design +='	<span class="unreadMsgCount"></span>';
				design += 	(user_id == v.activity_created_by ? '<span class="remove" onclick="hideThisTodo(event,\''+v.activity_id+'\')"></span>' : '');
				design +='</li>';
		$("#overdueULlist").append(design);
	});
}

function printNormaltodoActivities(data){
	$("#unpinTodoList").html('');
	$.each(data, (k,v)=>{
		var design ='<li id="activity_'+v.activity_id+'" data-activityid="'+v.activity_id+'" data-urm=0 class="com-t-l od_to" onclick="startToDo(event)">';
				design +='	<span class="toDo"></span>';
				design +='	<span class="toDoName">'+v.activity_title+'</span>';
				design += 	(v.activity_status == 2 ? "<span class=\"draft\" style=\"margin-top:8px;\">(draft)</span>" : '');
				design += 	(v.hasflag == 1 ? '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:block;">' : '<img id="fla_'+v.activity_id+'" data-createdat="'+v.activity_created_at+'" class="Flagged sidebarFlag" src="/images/basicAssets/Flagged_red.svg" style="display:none;">');
				design +='	<span class="unreadMsgCount"></span>';
				design += 	(user_id == v.activity_created_by ? '<span class="remove" onclick="hideThisTodo(event,\''+v.activity_id+'\')"></span>' : '');
				design +='</li>';
		$("#unpinTodoList").append(design);
	});
}

var amountCol = () => {

    var amountval = $('.amountInputValue');

    $('.amountInputValue').keydown(function (event) {
      var code = event.charCode || event.keyCode || event.which;
      if (code == 13) {
        event.preventDefault();
        // var value = 0;
        $(this).blur();
        formulafun(this);

      }
      else if (code < 48 || code > 57) {
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
    });
  }

  var enabletime = () => {
    var timeVal = $('.timeInputValue');
    timeVal.click(function () {
      var v = $(this).text().split(' ')[0];
      $(this).css('background', '#fff').focus().text(v);
      placeCaretAtEnd(document.getElementById($(this).attr('id')));
    });
  }

  var keypressBlur = () => {
    $('.priorityLabel, .pulse_title, .statusLabel').keypress(function (event) {

      var ouWid = $(event.target).closest('.name-cell').outerWidth();

      if(parseInt($(event.target).outerWidth()) > parseInt(ouWid) ){
        $('.name-cell').css('width',$(event.target).outerWidth());
      }

      $('.name-cell').css('width',$(event.target).outerWidth());
      $('.name-column-header').css('width',$(event.target).outerWidth());

      if (event.keyCode == 13) {
        event.preventDefault();
        $(this).blur();
      }
    });
  }

  function countSubtask(){
    let _subtask = $('._eachsubtask').length;
    if (_subtask == 0) {
      taskShowHideElement(false)
    } else {
      taskShowHideElement(true)
    }
  }


  var row_pluse_count = 1;

  function onDynamicFire(){


  }

$(document).mouseup(function (e) { 
    var taggedList = $('.addTagConv');
    var filterPannel = $('.filterMainContainer');
    var container = $(".addTagConv");
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
    // var notelimodalMore = $('.more_Ver_ico.active');
    var mainNeditor = $('.mainNEditor:visible');
    var editorRemin = $('.reminder_ico.active');
    var labelNdiv = $('.add_l_noteCo:visible');
    var noteSortingDiv = $('.noteSortingDiv');
    var emoji_div = $('.emoji_div');
    var noteEditableDiv = $('.b_n_w_c.editable:visible');

    
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
            if(! $('#threadReplyPopUp_task').is(':visible')){
                if( !$('#ChatFileUpload_task').is(':visible') &&
                    !$('#ChatFileUpload').is(':visible') &&
                    !$('.delete_msg_div').is(':visible') &&
                    !$('#delete_msg_div').is(':visible')){
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
            if(! $('#threadReplyPopUp').is(':visible')){
                if( !$('#subtaskWarningBackwrap').is(':visible') && 
                    !$('.delete_msg_div').is(':visible') &&
                    !$('#ChatFileUpload_task').is(':visible') &&
                    !$('#ChatFileUpload').is(':visible') ){
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

    if (!taggedList.is(e.target) && taggedList.has(e.target).length === 0) {
        taggedList.hide();
        $('.tagged').show();
        var checkNewTag = $('#CustagItemList').text().length;
        if (checkNewTag !== 0) {
            $('#taggedIMGAttachFile').attr("src", "/images/basicAssets/custom_tagged.svg");
        } else {
            $('#taggedIMGAttachFile').attr("src", "/images/basicAssets/custom_not_tag.svg");
        }
    }

    if (container.has(e.target).length === 0) {
        container.hide();
        $('#tagged_area').css('display', 'flex');
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

allKeyUp();


// This on event work for task messaging.
// there is another event on chat_to_do.js page where io.to() is working for same job 
// but in connect page its not working properly 
// and thats why socket.broadcast() use here. 

// socket.on('newRepTaskMessage', function(message) {
//     console.log(1238, message)
//     if(myAllActivityGlobal.indexOf(message.data.activity_id) > -1){
//         if(message.res.status){
//             if ($('.thread-user-msg').attr('data-rep_con_id') == message.data.thread_root_id) {
//                 console.log(1240, message.res.msg)
//                 draw_rep_task_msg(message.res.msg);
//                 $('.msg-separetor-unread').hide();
//             }
//         }
//     }
// });

socket.on('todo_msg_receive_forcheck', function(data){
    if(myAllActivityGlobal.indexOf(data.res.msg.activity_id) > -1){
		$('.msg-separetor-unread').hide();
		$('.msgNotFound').remove();
		$('.typing-indicator').html("");
		if(data.status){
			if($('.live_chat_box_'+data.res.msg.activity_id).is(':visible')){
				per_todo_msg(data.res.msg, true);

				// for tag listing while append new msg with file
				if(data.res.msg.attch_audiofile != null || data.res.msg.attch_imgfile != null || data.res.msg.attch_otherfile != null || data.res.msg.attch_videofile != null  ){
					if(tagListForFileAttach.length>0){
						$.each(tagListForFileAttach, function(kt,vt){
							$("#filesTag"+data.res.msg.msg_id).append('<span class="filesTag">'+vt+'</span>')
						});
						$("#filesTag"+data.res.msg.msg_id).show();
						$("#filesTagHolder"+data.res.msg.msg_id).show();
					}
				}
				scrollToBottom('.chat-history');
			}
			else if($('.property_notes').attr('data-batch_id') == data.res.msg.activity_id && $(".property_notes .chat-history").is(":visible")){
				$('.msgNotFound').remove();
				$('.chatEmptyMsg').remove();
				per_todo_msg(data.res.msg, true);
			}
		}
		else
			draw_ur_count(data.res.msg.activity_id);
	}
});


