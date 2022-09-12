var user_id_to_img = {}
var user_id_to_fullname = {}

$(document).mouseup(function (e) {
	var wsmoremenu = $('.ws-moremenu ul');
	if (wsmoremenu.is(':visible')) {
		if (!wsmoremenu.is(e.target) && wsmoremenu.has(e.target).length === 0) {
			wsmoremenu.hide();
		}
	}
});

// WS pop up script

// create new user
$('.ws-createNewUser-btn').on('click', function (event) {
	$(".wsCreateBackWrap").show();
});

$('#ws-create-user-popup-close').on('click', function (event) {
	$(".wsCreateBackWrap").hide();
});
// create new user

// add new user

$('.Add-a-New-User').on('click', function (event) {
	$("#AddUserBackWrap").show();
});
$('#ws-add-user-popup-close').on('click', function (event) {
	$("#AddUserBackWrap").hide();
});

// add new user

// edit Team Permission
$('.Edit-Team-Permission').on('click', function (event) {
	$("#Team-All-Permission").show();
});
$('#ws-edit-team-permission-popup-close').on('click', function (event) {
	$("#Team-All-Permission").hide();
});
// edit Team Permission

//ws management Delete team


$('.Delete-single-team-ws').on('click', function (event) {
	$("#DeleteTeamBackWrap").show();
});

$('#ws-Delete-Team-popup-close').on('click', function (event) {
	$("#DeleteTeamBackWrap").hide();
});

//ws management Delete team
var openprofile = (id) => {
	// console.log(allUserdata, allteams);
	$(".user_role").prop("checked", false);
	$.each(allUserdata, function (k, v) {
		if (v.id == id) {
			console.log(59, allroles, v);
			$('#userManageMent').show();
			$('.main-userManageMent').hide();
			$('#roleManagement').hide();
			$('#workSpaceManagement').hide();
			$('#manage-user-profile').show();
			$("#UserProfileName").text(v.fullname);
			$("#UserProfileEmail").text(v.email);
			$("#UserProfileEmail").attr("data-id", id);
			$("#UserProfileUserName").text(v.email);
			$(".dyrole").remove();
			var my_role_acc;
			$.each(allroles, function (rk, rv) {
				var checked = "";
				if (rv.role_title == v.role) {
					checked = "checked";
					my_role_acc = rv.role_access;
				}
				if (rk == 0) var html = '<tr><td class="information-label">Role:</td>';
				else html = '<tr class="dyrole"><td></td>';

				html += '<td class="information-value">' +
					'<label class="userRoleLabel">' + rv.role_title +
					'<input type="radio" data-value="' + rv.role_id + '" ' + checked + ' class="user_role" data-role_title="' + rv.role_title + '" onclick="update_role(event)" name="radio">' +
					'<span class="checkmark"></span>' +
					'</label>' +
					'</td>' +
					'</tr>';
				$("#userInfoTable").append(html);

			});
			// console.log(89, v.role);
			$(".role_" + v.role).prop('checked', true);
			$("#UserProfileJobTitle").text(v.designation);
			$(".user-creation-date").text(moment(v.createdat).format("Do MMM YYYY"));
			$("#manage-user-profile .change-profile-photo img").attr('src', file_server + "profile-pic/Photos/" + v.img);
			$("#User-Profile-Active-Deactive").text((v.is_active == 1) ? 'Active' : 'Deactive');

			$("#teamMainTab").html("");
			$.each(allteams, function (tk, tv) {
				if (tv.participants.indexOf(id) > -1) {
					var html = "";
					html = '<div class="teams-div">' +
						'<p class="team-title">' + tv.team_title + '</p>' +
						'</div>';
					$("#teamMainTab").append(html);
				}
			});

			$("#connect_page_access").html("");
			$.each(all_access_array, function (ak, av) {
				if (my_role_acc.indexOf(Number(ak)) > -1) {
					var html = "";
					html += (ak % 20 == 0) ? '<h2 onclick="openthisblock(' + ak + ')">' + av + '</h2>' : '';
					html += '<div class="each-notifi-setting acc' + ak + '">' +
						'<div class="notification-text"><p>' + av + '</p></div>' +
						'<div class="notification-active-inactive">';
					if (has_permission(id, Number(ak)))
						html += '<label class="switchNav"><input value=' + ak + ' onclick="change_permission(event)" type="checkbox" checked><span class="sliderNav round"></span></label>';
					else
						html += '<label class="switchNav"><input value=' + ak + ' onclick="change_permission(event)" type="checkbox"><span class="sliderNav round"></span></label>';
					html += '</div>' +
						'</div>';
					$("#connect_page_access").append(html);
				}
			});

			if (v.id == user_id) {
				$("#UserEditProfileName").show();
				$("#UserProfile-Edit-JobTitle").show();
				$(".profile-img-change").show();
			} else {
				$("#UserEditProfileName").hide();
				$("#UserProfile-Edit-JobTitle").hide();
				$(".profile-img-change").hide();
			}
		}
	});
};


var backtousermanagement = () => {
	// $(".Profile-Page-for-all").hide();
	// $("#ws-user-management-table").show();
	location.reload();
};
var single_team_details = [];
var single_team_participants = [];
var single_team_creator = '';
var single_team_updator = '';
var team_created_date_time = '';
var team_updated_date_time = '';

function add_team_member(id) {
	$('#workSpaceTeamDiv').hide();
	var srtList = [];
	socket.emit("get_team_info", {
		team_id: id
	}, (rep) => {
		single_team_details = rep.team[0];
		$("#ws-user-management-table .user-table-body").html("");
		$("#workSpaceTeamExplore .wsM-Team-name").text(rep.team[0].team_title);
		$("#workSpaceTeamExplore").attr("data-teamid", rep.team[0].team_id);

		if (single_team_details.created_by.toString() != user_id) {
			$("#team-edit-btn-id").hide();
		} else {
			$("#team-edit-btn-id").show();
		}

		// single_team_participants.push(rep.team[0].participants);
		// single_team_creator = rep.team[0].created_by;
		single_team_creator = rep.team[0].created_by;
		single_team_updator = rep.team[0].updated_by;
		team_created_date_time = rep.team[0].created_at;
		team_updated_date_time = rep.team[0].updated_at;
		$("#team-created-by").html(get_user_info_obj(single_team_creator).fullname);		
		$("#team-updated-by").html(get_user_info_obj(single_team_updator).fullname);
		$("#team-created-date-time").html(moment(team_created_date_time).format("Do MMM YYYY") + ", " + moment(team_created_date_time).format('LT'));
		
		$("#team-updated-date-time").html(moment(team_updated_date_time).format("Do MMM YYYY") + ", " + moment(team_updated_date_time).format('LT'));

		$.each(rep.team[0].participants, function (k, v) {
			var uinfo = get_user_info_obj(v);
			if (uinfo !== false) {
				srtList.push(uinfo.fullname.toUpperCase());
			}
		});
		srtList = srtList.sort();
		$.each(srtList, function (ka, va) {
			$.each(rep.team[0].participants, function (k, v) {
				$('#total_teamMember').html('('+ rep.team[0].participants.length +')');
				var uinfo = get_user_info_obj(v);
				if (uinfo !== false) {
					var team_urole = v == rep.team[0].created_by ? 'Team Admin' : 'Member';
					var team_uaction = v == rep.team[0].created_by ? '' : '<span onclick="removefromteam(event)" style="cursor: pointer;">Remove</span>';
					var html = "";
					if (va == uinfo.fullname.toUpperCase()) {
						console.log(200, uinfo.fullname);
						if(uinfo.fullname.indexOf('[Deleted]') > -1){
						html += '<tr class="user-table-row tuid_' + uinfo.id + '" data-id="' + uinfo.id + '">' +
							'<td class="fullName" onclick=""> <img src="' + file_server + 'profile-pic/Photos/' + uinfo.img + '" alt="' + uinfo.fullname + '"><span style="color:#DDD"> ' + uinfo.fullname + ' </span></td>';
						}
						else{
						html += '<tr class="user-table-row tuid_' + uinfo.id + '" data-id="' + uinfo.id + '">' +
							'<td class="fullName" onclick="openprofile(\'' + uinfo.id + '\')"> <img src="' + file_server + 'profile-pic/Photos/' + uinfo.img + '" alt="' + uinfo.fullname + '"><span> ' + uinfo.fullname + ' </span></td>';
						}
						html +='<td>' + team_urole + '</td>' +
							'<td>' + team_uaction + '</td>' +
							'</tr>';
						$("#ws-user-management-table .user-table-body").append(html);

					}
				}
			});
		});
		
		$("#teamMembersListTable").tablesorter();
		$("#teamMembersListTable").trigger("updateAll");
		$('#workSpaceTeamExplore').show();
	});
}

function strDes(a, b) {
	if (a > b) return -1;
	else if (a < b) return 1;
	else return 0;
}

function strAsc(a, b) {
	if (a > b) return 1;
	else if (a < b) return -1;
	else return 0;
}

function delete_team() {
	var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
	if (has_permission(user_id, TEAM_REMOVE)) {
		socket.emit("delete_team", {
			teamid,
			user_id
		}, (rep) => {
			setCookie("admintabname", "workspace");
			if (rep.status) window.location.reload();
			else {
				closeAdminSettingPop('deleteTeam');
				$('#warningsPopup').css('display', 'flex');
				$('#warningsPopup .warningMsg').text(rep.error);
			}
		});
	} else {
		closeAdminSettingPop('deleteTeam');
		$('#warningsPopup').css('display', 'flex');
		$('#warningsPopup .warningMsg').text('You have no permission to perform this action.');
	}
}
$('#ws-team-details-to-back-team').on('click', function (event) {
	// $("#ws-team-details").hide();
	$("#ws_all_team").show();
});

$('.ws-channels').on('click', function (event) {
	$("#ws-all-channel").hide();
	$("#ws-channels-details").show();
});

$('#ws-channels-details-to-back-channels').on('click', function (event) {
	$("#ws-channels-details").hide();
	$("#ws-all-channel").show();
});


//create team pop up start

$('.add_teams').on('click', function (event) {
	$("#Create-TeamBackWrap").show();
});


$('#ws-create-team-popup-close').on('click', function (event) {
	$("#Create-TeamBackWrap").hide();
});

//choice color pop up start
$('#Color-Management').on('click', function (event) {
	$("#ChoiceColorBackWrap").show();
});
$('#ws-Color-Manage-popup-close').on('click', function (event) {
	$("#ChoiceColorBackWrap").hide();
});

//create team pop up end



// Checkbox Select script start



$(document).ready(function () {
	$(".HoverCheckbox").change(function () {
		var selected = $('.HoverCheckbox:checked').length;
		if (selected < 0) {
			$('#DownloadSelectFile').hide();
		} else if (selected > 0) {
			$('#DownloadSelectFile').show();
		} else {
			$('#DownloadSelectFile').hide();
		}
	});
});


$('.download-cancel').click(function () {
	$('#DownloadSelectFile').hide();
});


$(document).ready(function () {
	$('#SelectAllCheckbox').on('click', function () {
		$(this).closest('table').find('tbody :checkbox')
			.prop('checked', this.checked)
			.closest('tr').toggleClass('selected', this.checked);
	});

	$('tbody :checkbox').on('click', function () {
		$(this).closest('tr').toggleClass('selected', this.checked);
		$(this).closest('table').find('#SelectAllCheckbox').prop('checked', ($(this).closest('table').find('tbody :checkbox:checked').length == $(this).closest('table').find('tbody :checkbox').length));
	});
});

// Checkbox Select script end

//color Selection  start

$(document).ready(function () {
	$(".colorDiv").click(function () {
		$(".colorDiv").html("");
		$(this).html('<i class="fa fa-check colorDivCheck"></i>');
	});
});

//color Selection  end



// date picker start
var srtList = [];
$(function () {
	$("#User-management-User-list").html('');
	// $.each(allUserdata, function (k, v) {
	// 	if (srtList.indexOf(v.fullname) == -1) {
	// 		srtList.push(v.fullname.toUpperCase());
	// 	}
	// });
	// srtList = srtList.sort();
	// $.each(srtList, function (ka, va) {
		// console.log(allUserdata.length)
		var n = 0;
		$.each(allUserdata, function (k, v) {
			if (v.is_delete == 0) {
				$("#User-management-User-list").append(draw_user_row(v));
				$('#userManageMent_count span').text('('+ (n++) +')');
			}
		});
	// });

	$("#userManageTable").tablesorter();
	$("#userManageTable").trigger("updateAll");
});

// function sortUsersList(ele) {
// 	console.log($(ele).closest('th').index());
// 	var type = $(ele).attr('data-srt');
// 	if (type == 'asc') {
// 		srtList.sort(strDes);
// 		$(ele).attr('data-srt', 'des');
// 	} else {
// 		srtList.sort(strAsc);
// 		$(ele).attr('data-srt', 'asc');
// 	}

// 	$("#User-management-User-list").html('');
// 	$.each(srtList, function (ka, va) {
// 		$.each(allUserdata, function (k, v) {
// 			if (va == v.fullname.toUpperCase()) {
// 				$("#User-management-User-list").append(draw_user_row(v));
// 			}
// 		});
// 	});
// }

var draw_user_row = (data) => {
	var html = "";
	var role = data.role;
	html += '<tr class="user-table-row ws-user-data wsuserrow_' + data.id + '" data-id="' + data.id + '">';
	html += '	<td class="fullName name ws-profile-name" onclick="openprofile(\'' + data.id + '\')" data-email="' + data.email + '" data-id="' + data.id + '"><img src="' + file_server + 'profile-pic/Photos/' + data.img + '" alt=""> <span class="usr_title">' + data.fullname + '</span></td>';
	html += '	<td> <span class="usr_eml">' + data.email + '</span></td>';
	html += '	<td style="text-transform: capitalize;">' + role + '</td>';
	html += '	<td>' + moment(data.createdat).format("Do MMM YYYY") + '</td>';
	html += '	<td class="td-status user-profile-status">';
	if (data.email != user_email) {
		if (data.is_active == 1) {
			html += '<span class="user-status Active-users" onclick="activethisuser(\'' + data.id + '\', 0)" title="Deactive this user">Active</span>';
			html += '<span class="user-status Deactive-users" onclick="activethisuser(\'' + data.id + '\', 1)" title="Active this user" style="display: none;">Deactive</span>';
		} else {
			html += '<span class="user-status Active-users" onclick="activethisuser(\'' + data.id + '\', 0)" title="Deactive this user" style="display: none;">Active</span>';
			html += '<span class="user-status Deactive-users" onclick="activethisuser(\'' + data.id + '\', 1)" title="Active this user">Deactive</span>';
		}
	} else {
		html += '<span class="user-status Active-users" style="color: #999">Active</span>';
	}

	html += '	</td>';
	html += '	<td>';
	html += '		<span class="ws-moremenu">';
	if (data.email != user_email) {
		html += '			<img src="/images/svg/MoreMenu.svg" onclick="openmoreaction(this)">';
	} else {
		html += '			<img src="/images/svg/MoreMenu.svg">';
	}
	html += '			<ul class="usr_morePopup">';
	html += '				<li onclick="show_reset_pass_popup(\'' + data.id + '\')">Reset Password</li>';
	html += '				<li onclick="reset_user_password_open(\'' + data.id + '\')">Change Password</li>';
	html += '				<li onclick="show_delete_user_popup(\'' + data.id + '\')">Delete</li>';
	html += '			</ul>';
	html += '		</span>';
	html += '	</td>';
	html += '</tr>';
	return html;
};

function reset_user_password_open(id) {
	if (has_permission(user_id, USER_PASS_RESET)) {

		$("#reset_password").css("display", "flex");
		$("#reset_password").attr("data-uid", id);
		$("#errResetNewPass").html("");
		$("#errResetConPass").html("");
		$("#pass1").val("").focus();
		$("#pass2").val("");
		$(".usr_morePopup").hide();
	} else {
		// $("#flash_msg").html("Sorry... Only admin manager can do this.").show();
		// setTimeout(function(){ 
		//   $("#flash_msg").html("");
		//   $("#flash_msg").hide('slow');
		// }, 3000);
		$(".usr_morePopup").hide();
		$("#changePasSucMsg").show();
		$("#sucMsgTitle").html("Change Password");
		$("#sucMsgGreen").html("Sorry... Only admin manager can do this.").css("color", "#F55");
	}
}

function reset_user_password() {
	if (has_permission(user_id, USER_PASS_RESET)) {
		var new_password = $("#pass1").val().trim();
		var con_password = $("#pass2").val();
		var userid = $("#reset_password").attr("data-uid");
		console.log({
			user_id: userid,
			new_password
		});
		if (new_password == con_password) {
			// if(/(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g.test(new_password)){
			if (new_password.length >= 6) {
				socket.emit('change_reset_password', {
					user_id: userid,
					new_password
				}, (rep) => {
					console.log(rep);
					// alert(rep.msg);
					$("#sucMsgTitle").html("Change Password");
					if (rep.status) {
						$("#changePasSucMsg").show();
						$("#sucMsgGreen").html(rep.msg + '.').css("color", "#5DB75D");
						$("#pass1").val("");
						$("#pass2").val("");
						$("#errResetNewPass").html("");
						$("#errResetConPass").html("");
						$('#reset_password').hide();
					}
				});
			} else {
				// alert("Password must have minimum 6 characters, at least one uppercase letter, one lowercase letter and al least one number or special character.");
				// alert("Password must have minimum 6 characters.");
				$("#errResetNewPass").html("Password must have minimum 6 characters.").css('color', '#F55');
				$("#errResetConPass").html("");
			}
		} else {
			// alert("New password and confirm password doesn't match.");      
			$("#errResetNewPass").html("New password and confirm password doesn't match.").css('color', '#F55');
			$("#errResetConPass").html("New password and confirm password doesn't match.").css('color', '#F55');
		}
	} else {
		// alert("Access denied");
		$("#errResetConPass").html("Access denied").css('color', '#F55');
	}
}
// sujon block start
$(function () {
	$("#Call-management-User-list").html('');
	if (allCalldata != 'false') {
		$.each(allCalldata, function (k, v) {
			// if(v.call_running){
			var html = draw_call_row(v);
			if (html != null) $("#Call-management-User-list").append(html);

			// }
		});
	}
});

var draw_call_row = (data) => {
	var participantinfo;
	var senderinfo;
	$.each(data.call_participants, function (k, v) {
		if (data.sender != v) {
			participantinfo = allUserdata.filter(function (el) {
				return el.id == v
			});
		} else {
			senderinfo = allUserdata.filter(function (el) {
				return el.id == v
			});
		}
	});
	if (senderinfo.length > 0 && participantinfo.length > 0) {
		var html = "";
		html += '<tr style="" class="user-table-row  ws-user-data wsuserrow_' + senderinfo[0].id + '" data-id="' + senderinfo[0].id + '">';
		html += '<td class="fullName name ws-profile-name" onclick="openprofile(\'' + senderinfo[0].id + '\')" data-email="' + senderinfo[0].email + '" data-id="' + senderinfo[0].id + '"><img src="' + file_server + 'profile-pic/Photos/' + senderinfo[0].img + '" alt=""> <span class="usr_title_call">' + senderinfo[0].fullname + '</span> </td>';

		// html +=   '<td>'+ data.call_sender_device +'</td>';
		html += '<td class="sender-stats" data-convid="' + data.conversation_id + '" data-msgid="' + data.msg_id + '"><div>Video:<span class="in"></span> <span>/</span> <span class="out"></span></div><div>Audio:<span class="audio-in"></span> <span>/</span> <span class="audio-out"></span></div></td>';

		html += '<td class="fullName name ws-profile-name" onclick="openprofile(\'' + participantinfo[0].id + '\')" data-email="' + participantinfo[0].email + '" data-id="' + participantinfo[0].id + '"><img src="' + file_server + 'profile-pic/Photos/' + participantinfo[0].img + '" alt=""> <span class="usr_title_call">' + participantinfo[0].fullname + '</span> </td>';

		// html +=   '<td>'+ data.call_receiver_device +'</td>';
		html += '<td class="receiver-stats" data-convid="' + data.conversation_id + '" data-msgid="' + data.msg_id + '"><div>Video:<span class="in"></span> <span>/</span> <span class="out"></span></div><div>Audio:<span class="audio-in"></span> <span>/</span> <span class="audio-out"></span></div></td>';
		html += '<td class="server-address" data-convid="' + data.conversation_id + '" data-msgid="' + data.msg_id + '">' + data.call_server_addr + '</td>';

		// html +=   '<td>'+ moment(data.created_at).format("Do MMM YYYY") +'</td>';
		html += '<td class="td-status user-profile-status">';
		// if(data.is_active == 1){
		html += '<span style="display:none" class="Active-users switch-this-call" data-convid="' + data.conversation_id + '" data-msgid="' + data.msg_id + '" onclick="switchthiscall(this)" title="Switch this call">Switch</span>';

		html += '</td>';
		html += '</tr>';
		return html;
	} else {
		return null;
	}



};

var switchthiscall = (el) => {
	var conversation_id = $(el).attr('data-convid');
	var msg_id = $(el).attr('data-msgid');
	// alert(conversation_id);alert(msg_id);
	// if($(el).attr("data-status") && $(el).attr("data-status")=="disabled"){
	//   alert('In Progress');
	// }else{
	//   $(el).attr("data-status", "disabled");

	socket.emit('voip_switch_server', {
		conversation_id: conversation_id,
		msg_id: msg_id
	}, (res) => {
		if (res.call_server_switch == 'yes') alert('Server switching is in progress...');
		else {
			$('.server-address[data-convid="' + conversation_id + '"][data-msgid="' + msg_id + '"]').text('Switching server...');
		}

	});
	// }

}

// socket.on('call_stats__server', function (data) {
// 	// console.log('call__stats__server',data);
// 	$('.sender-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"]').closest('tr').show();
// 	$('.switch-this-call[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"]').show();

// 	if (data.sender_out) {
// 		$('.sender-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .out').text(data.sender_out + "kb");
// 	}
// 	if (data.receiver_out) {
// 		$('.receiver-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .out').text(data.receiver_out + "kb");
// 	}

// 	for (var key in data.sender_in) {
// 		if (data.sender_in[key]) {
// 			$('.sender-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .in').text(data.sender_in[key] + "kb");
// 		}
// 	}

// 	for (var key in data.receiver_in) {
// 		if (data.receiver_in[key]) {
// 			$('.receiver-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .in').text(data.receiver_in[key] + "kb");
// 		}

// 	}
// 	// audio
// 	if (data.sender_out_audio) {
// 		$('.sender-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .audio-out').text(data.sender_out_audio + "kb");
// 	}
// 	if (data.receiver_out_audio) {
// 		$('.receiver-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .audio-out').text(data.receiver_out_audio + "kb");
// 	}

// 	for (var key in data.sender_in_audio) {
// 		if (data.sender_in_audio[key]) {
// 			$('.sender-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .audio-in').text(data.sender_in_audio[key] + "kb");
// 		}
// 	}

// 	for (var key in data.receiver_in_audio) {
// 		if (data.receiver_in_audio[key]) {
// 			$('.receiver-stats[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"] .audio-in').text(data.receiver_in_audio[key] + "kb");
// 		}
// 	}


// });

socket.on('switch_server_changed', function (data) {

	$('.server-address[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"]').text(data.call_server_addr);

	$('.switch-this-call[data-convid="' + data.conversation_id + '"][data-msgid="' + data.msg_id + '"]').removeAttr('data-status');

});


function wsCallManagementTab() {
	close_all_tab();
	$('.admin_settings .callManagement').addClass('active');
	$("#wsCallManagementTab").show();

}
// sujon block end

var openmoreaction = (ele) => {
	$(ele).closest('.ws-moremenu').find('ul').show();
}

function show_reset_pass_popup(id) {
	if (has_permission(user_id, USER_PASS_RESET)) {
		$("#confirm_reset").attr("disabled", false).css("background", "var(--BtnC)");
		$("#sucMsgRstTitle").html('Reset Password');
		$("#sucMsgRstGreen").html('Are you sure you want to reset this user password?').css('color', 'rgba(0, 0, 0, 0.88)');
		$("#resetPasSucMsg").show();
		$(".usr_morePopup").hide();
		$("#confirm_reset").attr('onclick', 'reset_password("' + id + '")');
	} else {
		$(".usr_morePopup").hide();
		$("#changePasSucMsg").show();
		$("#sucMsgTitle").html("Reset Password");
		$("#sucMsgGreen").html("Sorry... Only admin manager can do this.").css("color", "#F55");
	}
}
var reset_password = (id) => {
	if (has_permission(user_id, USER_PASS_RESET)) {
		$("#confirm_reset").attr("disabled", true).css("background", "#DDD");
		socket.emit('reset_password', {
			id
		}, (res) => {
			console.log(res);
			if (res.status) {
				// alert("New password send to the user email.");
				$("#confirm_reset").attr("disabled", false).css("background", "var(--BtnC)");
				$("#resetPasSucMsg").hide();
				$("#sucMsgTitle").html("Reset Password");
				$("#sucMsgGreen").html("New password send to the user email.").css("color", "#5DB75D");
				$("#changePasSucMsg").show();
			}
		});
	} else {
		// $("#flash_msg").html("Sorry... Only admin manager can do this.").show();
		// setTimeout(function(){ 
		//   $("#flash_msg").html("");
		//   $("#flash_msg").hide('slow');
		// }, 3000);
		console.log("No permission to reset");
	}
}

function show_delete_user_popup(id) {
	if (has_permission(user_id, USER_DELETE)) {
		$("#sucMsgRstTitle").html('Delete User');
		$("#sucMsgRstGreen").html('Are you sure want to delete this user?').css('color', '#F55');
		$("#resetPasSucMsg").show();
		$(".usr_morePopup").hide();
		$("#confirm_reset").attr('onclick', 'delete_user("' + id + '")');
	} else {
		$(".usr_morePopup").hide();
		$("#changePasSucMsg").show();
		$("#sucMsgTitle").html("Delete User");
		$("#sucMsgGreen").html("Sorry... Only admin manager can do this.").css("color", "#F55");
	}
}

var delete_user = (id) => {
	var usrLngth = $('#userManageMent_count span').text();
	if (has_permission(user_id, USER_DELETE)) {
		$.ajax({
			url: '/settings/delete_user',
			type: 'POST',
			data: {
				id: id
			},
			dataType: 'JSON',
			success: function (res) {
				if (res.status) {
					$("#resetPasSucMsg").hide();
					$("#sucMsgTitle").html("Delete User");
					$("#sucMsgGreen").html("User deleted successfully.").css("color", "#5DB75D");
					$("#changePasSucMsg").show();
					$(".wsuserrow_" + id).hide("slow").remove();
					usrLngth = parseInt(usrLngth.split(/([0-9]+)/)[1]);
					usrLngth = usrLngth-1;
					$('#userManageMent_count span').text('('+ usrLngth +')');

				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	} else {
		// $("#flash_msg").html("Sorry... Only admin manager can do this.").show();
		// setTimeout(function(){ 
		//   $("#flash_msg").html("");
		//   $("#flash_msg").hide('slow');
		// }, 3000);
		console.log("U have no permissin.");
	}
}


// $('#userManageMent_count').on('click', function(e) {
// 	var usrLngth = $('#userManageMent_count span').text();
// 	usrLngth = parseInt(usrLngth.split(/([0-9]+)/)[1]);
// 	usrLngth = usrLngth-1;
// 	$('#userManageMent_count span').text('('+ usrLngth +')');
// });

var activethisuser = (id, isactive) => {
	if (has_permission(user_id, USER_STATUS_CHANGE)) {
		$.ajax({
			url: '/settings/active_inactive',
			type: 'POST',
			data: {
				id: id,
				is_active: isactive
			},
			dataType: 'JSON',
			beforeSend: function () {
				console.log({
					id: id,
					is_active: isactive
				});
			},
			success: function (res) {
				if (res.status) {
					if (isactive == 0) {
						$(".wsuserrow_" + id).find(".Active-users").hide();
						$(".wsuserrow_" + id).find(".Deactive-users").show();
					} else if (isactive == 1) {
						$(".wsuserrow_" + id).find(".Active-users").show();
						$(".wsuserrow_" + id).find(".Deactive-users").hide();
					}
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	} else {
		// $("#flash_msg").html("Sorry... Only admin manager can do this.").show();
		// setTimeout(function(){ 
		//   $("#flash_msg").html("");
		//   $("#flash_msg").hide('slow');
		// }, 3000);
		$("#changePasSucMsg").show();
		$("#sucMsgTitle").html("Active User");
		$("#sucMsgGreen").html("Sorry... Only admin manager can do this.").css("color", "#F55");
	}
}
//User Management Tab Create a new User start

$(".UserMnageCreateUser").click(function (e) {
	e.preventDefault();
	// e.stopPropagation();
	var firstname = $("#UserFirstName").val();
	var lastname = $("#UserLastName").val();
	var emailAddress = $("#UserEmailAdress").val();
	var sendermsg = $("#invitemsg").val();
	// var role = $("#UserRole").val();
	// var Profile = $(".ws-user-data").length;
	// var newProfileCount = Profile + 1;
	// var newid = 'ws-user'+ newProfileCount;

	if (firstname != "" && lastname != "" && emailAddress != "") {
		$.ajax({
			url: '/settings/send_invitation',
			type: 'POST',
			data: {
				fullname: firstname + ' ' + lastname,
				sendermsg: sendermsg,
				email: emailAddress,
				sender: user_fullname,
				created_by: user_id
			},
			dataType: 'JSON',
			// beforeSend: function(){
			//   console.log({fullname: firstname+' '+lastname, sendermsg: sendermsg, email: emailAddress, sender: user_fullname});
			// },
			success: function (res) {
				if (res.status) {
					$('#ws-create-user-popup-close').trigger('click');
					$("#flash_msg").html("Invitation send to the user email.").show();
					setTimeout(function () {
						$("#flash_msg").html("");
						$("#flash_msg").hide('slow');
					}, 2000);
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
		// var design = '<tr class="table_data ws-user-data">';
		// design +='  <td class="name ws-profile-name" id='+ newid +'><img src="/images/users/1joni.jpg" alt="">'+ firstname +' '+lastname+' </td>';
		// design +='  <td>'+ firstname +'</td>';
		// design +='  <td>'+ role +'</td>';
		// design +='  <td>'+ emailAddress +'</td>';
		// design +='  <td>03 Dec 2018</td>';
		// design +='  <td class="td-status user-profile-status"><span class="Active-users">Active</span><span class="Deactive-users" style="display: none;">Deactive</span><span class="ws-moremenu"><img src="/images/svg/MoreMenu.svg"></span></td>';
		// design +='</tr>';
		// $(".User-management-User-list").append(design);
		// $(".wsCreateBackWrap").hide();
		// $('.UserCreateForm').each(function(){
		//   this.reset();
		// });
		// $(".Active-users").click(function(e){
		//   $(this).hide();
		//   $(this).parents("td").find(".Deactive-users").show();
		// });

		// $(".Deactive-users").click(function(e){
		//   $(this).hide();
		//   $(this).parents("td").find(".Active-users").show();
		// });
	}
});

//User Management Tab Create a new User end

// <!-- user Profile page start -->



// <!-- user Profile page end -->




//User Management Tab profile channels remove start

$(".profile-action-data").click(function (e) {
	$(this).parents("tr").remove();
});

//User Management Tab profile channels remove end



//Role management create role

$("#WsManagAddRole").click(function (e) {
	e.preventDefault();
	var rolename = $("#WsManagRoleName").val();
	if (rolename != "") {
		socket.emit("create_role", {
			created_by: user_id,
			role_title: rolename
		}, (rep) => {
			if (rep.status) {
				setCookie("admintabname", "role");
			} else {
				console.log(760, rep);
				$('#warningsPopup').css('display', 'flex');
				$('#warningsPopup .warningMsg').text("Something wrong...");
				closeAdminSettingPop('addRole');
			}
			// var design = '<div class="teams-div" onclick="role_access(\''+rolename+'\', \''+ rep.msg.role_id +'\')" data-roleid="'+ rep.msg.role_id +'" id="WsMTeam'+ rep.msg.role_id +'"><p class="team-title">'+ rolename +'</p></div>';
			// $("#roledisplaydiv h2").after(design);
			// $('#WsManagRoleName').val("");
			// closeAdminSettingPop('addRole');
			// var noteam = Number($(".teamCount").text()) + 1;
			// $("#workSpaceTeamDiv h2>span").text("(" + noteam + ")");
			// $(".teamCount").text(noteam);
		});
	}
});

function update_role_access_array_temp(roleid, access, type) {
	for (var i = 0; i < allroles.length; i++) {
		if (allroles[i].role_id == roleid) {
			if (type == 'add') allroles[i].role_access.push(access);
			else allroles[i].role_access.splice(allroles[i].role_access.indexOf(access), 1);
		}
	}
}

function check_role_access(roleid, access) {
	for (var i = 0; i < allroles.length; i++) {
		if (allroles[i].role_id == roleid && allroles[i].role_access != null) {
			for (var j = 0; j < allroles[i].role_access.length; j++) {
				if (allroles[i].role_access[j] == access)
					return true;
			}
		}
	}
	return false;
}

var srtRoleUserList = [];
var roleTitle = '';
function role_access(title, id) {
	roleTitle = title;
	$("#wsTeamPermission .msgs-notifi").html("");
	$("#wsTeamPermission .wsM-Team-name").html(title);
	$("#wsTeamPermission").attr("data-id", id);
	// $.each(all_access_array, function(k, v){
	//   var html = "";
	//   html += (k%20 == 0) ? '<h2 style="font-size: 16px;background: #CDE;padding: 5px;cursor: pointer;margin-bottom: 5px;" onclick="openthisblock('+ k +')">'+ v +'</h2>' : '';
	//   html +=     '<div class="each-notifi-setting acc'+k+' hidden">'+
	//                 '<div class="notification-text"><p>'+ v +'</p></div>'+
	//                 '<div class="notification-active-inactive">';
	//                   if(check_role_access(id, Number(k)))
	//                     html += '<label class="switchNav"><input value='+ k +' id="role_id'+k+'" onclick="update_role_access(event)" type="checkbox" checked><span class="sliderNav round"></span></label>';
	//                   else 
	//                     html += '<label class="switchNav"><input value=' + k + ' id="role_id' + k +'" onclick="update_role_access(event)" type="checkbox"><span class="sliderNav round"></span></label>';
	//                 html += '</div>'+
	//               '</div>';
	//   $("#wsTeamPermission .permission").append(html);
	// });
	if (title == "System Admin")
		$("#wsTeamPermission .permission").html("<h4>All permissions are granted.</h4>");
	else
		$("#wsTeamPermission .permission").html("<h4>Limited permissions.</h4>");

	$("#roleUsersList").html("");

	// $.each(allUserdata, function (k, v) {
	// 	var fullName = get_user_info_obj(v.id).fullname;
	// 	if (v.role == title) {
	// 		srtRoleUserList.push(fullName.toUpperCase());
	// 	}
	// });

	// srtRoleUserList = srtRoleUserList.sort();
	// $.each(srtRoleUserList, function (ka, va) {
		$.each(allUserdata, function (k, v) {
			var fullName = get_user_info_obj(v.id).fullname;
			if (v.role == title && v.is_delete == 0) {
				// if (va == fullName.toUpperCase()) {

					var html = '<tr class="user-table-row tuid_' + v.id + '" data-id="' + v.id + '">' +
						'<td class="fullName" onclick="openprofile(\'' + v.id + '\')"> <img src="' + file_server + 'profile-pic/Photos/' + get_user_info_obj(v.id).img + '" alt="' + fullName + '"><span> ' + fullName + ' </span></td>' +
						'<td>' + title + '</td>' +
						'<td align="right">';
					if (v.email != user_email)
						html += '<span onclick="open_role_changer(event)" style="background: #d0cece;cursor: pointer;text-align: center;border-radius: 10px;padding: 5px;">Change Role</span>';
					html += '</td>' +
						'</tr>';
					$("#roleUsersList").append(html);
				// }
			}
		});
	// });

	$("#roleUsersListTable").tablesorter();
	$("#roleUsersListTable").trigger("updateAll");

	if ($("#roleUsersList tr").length > 0) {
		$("#wsTeamPermission").find(".ws-delete-team").attr("disabled", true).css("color", "#DDD");
		$("#wsTeamPermission").find(".ws-delete-team").attr("onclick", "");
	} else {
		$("#wsTeamPermission").find(".ws-delete-team").attr("disabled", false).css("color", "#F55");
		$("#wsTeamPermission").find(".ws-delete-team").attr("onclick", "delete_role_popup(event)");
	}

	$('#roledisplaydiv').hide();
	$('#wsTeamPermission').show();
}

function update_role_access(event) {
	event.stopImmediatePropagation();
	if (has_permission(user_id, ROLE_ACCESS_UPDATE)) {
		var acc = Number(event.target.value);
		var role_id = $("#role_access_title").attr("data-id");
		var type = event.target.checked === true ? 'add' : 'remove';
		if (acc == '1600') {
			acc1600(type);
		} else if (acc == '1602') {
			if (type == 'add') {
				if ($('#role_id' + 1603).is(':checked')) {
					$('#role_id' + 1603).trigger('click');
				}
			} else {
				if (!$('#role_id' + 1603).is(':checked')) {
					$('#role_id' + 1603).trigger('click');
				}
			}
		} else if (acc == '1603') {
			if (type == 'add') {
				if ($('#role_id' + 1602).is(':checked')) {
					$('#role_id' + 1602).trigger('click');
				}
			} else {
				if (!$('#role_id' + 1602).is(':checked')) {
					$('#role_id' + 1602).trigger('click');
				}
			}
		}
		document.body.style.cursor = "wait";
		socket.emit("update_role_access", {
			acc,
			role_id,
			type
		}, function (rep) {
			document.body.style.cursor = "default";
			update_role_access_array_temp(role_id, acc, type);
		});
	} else {
		event.preventDefault();
		alert("Access denied");
	}
}

function openthisblock(id) {
	$(".each-notifi-setting").hide();
	for (var i = id; i < id + 20; i++)
		$(".acc" + i).css("display", "flow-root");
}


function acc1600(type) {
	if (type == 'add') {
		if ($('#role_id' + 1002).is(':checked')) {
			$('#role_id' + 1002).trigger('click');
		}
		if ($('#role_id' + 1003).is(':checked')) {
			$('#role_id' + 1003).trigger('click');
		}
		if ($('#role_id' + 1004).is(':checked')) {
			$('#role_id' + 1004).trigger('click');
		}
		if ($('#role_id' + 1005).is(':checked')) {
			$('#role_id' + 1005).trigger('click');
		}
		if ($('#role_id' + 1006).is(':checked')) {
			$('#role_id' + 1006).trigger('click');
		}
		if ($('#role_id' + 1145).is(':checked')) {
			$('#role_id' + 1145).trigger('click');
		}
		if ($('#role_id' + 1160).is(':checked')) {
			$('#role_id' + 1160).trigger('click');
		}
		if ($('#role_id' + 1180).is(':checked')) {
			$('#role_id' + 1180).trigger('click');
		}
		if ($('#role_id' + 1200).is(':checked')) {
			$('#role_id' + 1200).trigger('click');
		}
		if ($('#role_id' + 1220).is(':checked')) {
			$('#role_id' + 1220).trigger('click');
		}
		if ($('#role_id' + 1260).is(':checked')) {
			$('#role_id' + 1260).trigger('click');
		}
		if ($('#role_id' + 1500).is(':checked')) {
			$('#role_id' + 1500).trigger('click');
		}
		if (!$('#role_id' + 1602).is(':checked')) {
			$('#role_id' + 1602).trigger('click');
		}
	} else {
		if ($('#role_id' + 1601).is(':checked')) {
			$('#role_id' + 1601).trigger('click');
		}
		if ($('#role_id' + 1602).is(':checked')) {
			$('#role_id' + 1602).trigger('click');
		}
		if ($('#role_id' + 1603).is(':checked')) {
			$('#role_id' + 1603).trigger('click');
		}
	}
}
//Role management end

//Workspace management create team start

$("#WsManagCteateTeam").click(function (e) {
	e.preventDefault();
	var teamname = $("#WsManagTeamName").val();
	if (teamname != "") {
		socket.emit("create_team", {
			created_by: user_id,
			updated_by: user_id,
			team_title: teamname
		}, (rep) => {
			console.log(rep);
			setCookie("admintabname", "workspace");
			if (rep.status) {
				window.location.reload();
				// var design = '<div class="teams-div" onclick="add_team_member(\''+ rep.msg.team_id +'\')" id="WsMTeam'+ rep.msg.team_id +'"><p class="team-title">'+ teamname +'</p></div>';
				// $("#workSpaceTeamDiv h2").after(design);
				// $('#WsManagTeamName').val("");
				// closeAdminSettingPop('createTeam');
				// var noteam = Number($(".teamCount").text()) + 1;
				// $("#workSpaceTeamDiv h2>span").text("(" + noteam + ")");
				// $(".teamCount").text(noteam);
			} else {
				// alert(rep.err);
				$("#errWsCreateTeam").html(rep.err).css("color", "#F55");
				// $('#wsCreateTeamPopUp').height(253);
			}
		});
	}
});

//Workspace management create team end




//User Management Profile Edit start

$(document).ready(function () {
	$("#UserEditProfileName").click(function (eidt) {
		$("#UserProfileName").attr("contenteditable", "true");
		$("#UserProfileName").focus();
	});

	$("#UserProfileName").on('keypress', function (e) {
		if (e.keyCode == 13) {
			$("#UserProfileName").attr("contenteditable", "false")
			$("#UserProfileName").html($("#UserProfileName").text());
			update_user_info();
		}
	});

	$("#UserProfile-Edit-JobTitle").click(function (e) {
		$("#UserProfileJobTitle").attr("contenteditable", "true");
		$("#UserProfileJobTitle").focus();
	});

	$("#UserProfileJobTitle").on('keypress', function (e) {
		if (e.keyCode == 13) {
			$("#UserProfileJobTitle").attr("contenteditable", "false")
			$("#UserProfileJobTitle").html($("#UserProfileJobTitle").text());
			update_user_info();
		}
	});
});

//User Management Profile Edit end


var update_user_info = () => {
	var id = user_id;
	$.ajax({
		url: '/settings/update_user_info',
		dataType: 'JSON',
		type: 'POST',
		data: {
			id,
			fullname: $("#UserProfileName").text().trim(),
			designation: $("#UserProfileJobTitle").text().trim()
		},
		beforeSend: function () {
			console.log({
				id,
				fullname: $("#UserProfileName").text().trim(),
				designation: $("#UserProfileJobTitle").text().trim()
			});
		},
		success: function (res) {
			console.log(res);
		},
		error: function (err) {
			console.log(err);
		}
	})
}

var update_profile_pic = (files) => {
	var formData = new FormData();
	formData.append('bucket_name', 'profile-pic');
	formData.append('file_upload', files[0]);
	$.ajax({
		url: '/s3Local/propic',
		type: "POST",
		data: formData,
		dataType: 'json',
		contentType: false,
		processData: false,
		success: function (res) {
			console.log(res);
			if (res.msg == "Successfully uploaded") {
				$.ajax({
					url: '/settings/update_user_propic',
					dataType: 'JSON',
					data: {
						id: user_id,
						img: res.file_info[0].key
					},
					type: 'POST',
					success: function (reply) {
						location.reload();
					},
					error: function (error) {
						console.log(error);
					}
				});
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}


//Graph Canvas js start

window.onload = function () {
	CanvasJS.addColorSet("greenShades",
		["#8366DD", "#66C0DD", "#66DD83", "#DD8366"]);
	var chart = new CanvasJS.Chart("chartContainer", {
		backgroundColor: "#f7f9f9",
		colorSet: "greenShades",
		title: {
			text: ""
		},
		legend: {
			horizontalAlign: "right",
			verticalAlign: "center",
			fontSize: "14",
			fontWeight: "600",
			LineHeight: "20"
		},
		width: 275,
		height: 150,
		data: [{
			showInLegend: true,
			type: "doughnut",
			startAngle: 270,
			dataPoints: [{
					y: 35,
					name: "Design Files",
					legendText: "Design Files (35%)"
				},
				{
					y: 30,
					name: "Images",
					legendText: "Images (30%)"
				},
				{
					y: 25,
					name: "Videos",
					legendText: "Videos (25%)"
				},
				{
					y: 10,
					name: "Documents",
					legendText: "Documents (10%)"
				}
			]
		}]
	});

	chart.render();
}


//Graph Canvas js end

//esc button to close
window.addEventListener("keyup", function (event) {
	// event.preventDefault();
	if (event.keyCode === 27) {

		if ($("#wsCreateBackWrap").is(':visible')) {
			$('#wsCreateBackWrap').hide();
		}

		if ($("#AddUserBackWrap").is(':visible')) {
			$('#AddUserBackWrap').hide();

		}

		if ($("#Create-TeamBackWrap").is(':visible')) {
			$('#Create-TeamBackWrap').hide();
		}

		if ($("#DeleteTeamBackWrap").is(':visible')) {
			$("#DeleteTeamBackWrap").hide();
		}

		if ($("#ChoiceColorBackWrap").is(':visible')) {
			$("#ChoiceColorBackWrap").hide();
		}

		if ($("#Team-All-Permission").is(':visible')) {
			$("#Team-All-Permission").hide();
		}

		if ($("#ws-user-profile-page").is(':visible')) {
			$("#back-to-user-management").trigger('click');
		}
		if ($("#wsTeamTab").is(':visible')) {
			$("#ws-team-details-to-back-team").trigger('click');
		}
		if ($("#ws-channels-details").is(':visible')) {
			$("#ws-channels-details-to-back-channels").trigger('click');
		}

		if ($("#Create-userProfile-TeamBackWrap").is(':visible')) {
			$("#Create-userProfile-TeamBackWrap-close").trigger('click');
		}
	}
});

// User table profile active deactive start

$(".Active-users").click(function (e) {
	$(this).hide();
	$(this).parents("td").find(".Deactive-users").show();
});

$(".Deactive-users").click(function (e) {
	$(this).hide();
	$(this).parents("td").find(".Active-users").show();
});

// User table profile active deactive end




// User profile page team tab create team popup start

$("#User-profile-Add-Team").click(function (e) {
	$("#Create-userProfile-TeamBackWrap").show();
});

$("#Create-userProfile-TeamBackWrap-close").click(function (e) {
	$("#Create-userProfile-TeamBackWrap").hide();
});

// User profile page team tab create team popup end


// User profile page team tab new team add start
$("#User-profile-create-Team-btn").click(function (e) {
	e.preventDefault();
	var teamname = $("#Profile-team-Name").val();
	if (teamname != "") {
		var design = '<div class="teams"><p>' + teamname + '</p></div>';
		$("#Profile-Team-list").append(design);
		$("#Create-userProfile-TeamBackWrap").hide();
		$('#Profile-Team-Form').each(function () {
			this.reset();
		});
	}
});

// User profile page team tab new team add end



// Workspace management team name edit start

$(".edit-ws-team-name").click(function (e) {
	$(".wsM-Team-name").attr("contenteditable", "true");
	var el = document.getElementById('team-title-edit');

	placeCaretAtEnd(el);
});

// $("#team-title-edit").on('keypress', function (e) {
// 	if (e.keyCode == 13) {
// 		var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
// 		var teamname = $("#team-title-edit").text();
		
// 		if (teamname.trim() != "" && single_team_details.created_by.toString() == user_id) {
// 			$(".wsM-Team-name").attr("contenteditable", "false");
// 			socket.emit('update_team_name', {
// 				team_id: teamid,
// 				team_title: teamname
// 			}, (rep) => {
// 				$("#team-title-edit").html(teamname);
// 				$("#WsMTeam" + teamid).find("p").html(teamname);
// 			});
// 		}
// 	}
// });

function updateTeamNameBy13(e) {
	if (e.keyCode == 13) {
		$("#team-title-edit").blur();
	}
}

function updateTeamName(e) {
	var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
	var teamname = $("#team-title-edit").text();
	
	if (teamname.trim() != "" && single_team_details.created_by.toString() == user_id) {
		$(".wsM-Team-name").attr("contenteditable", "false");
		socket.emit('update_team_name', {
			team_id: teamid,
			updated_by: user_id,
			team_title: teamname
		}, (rep) => {
			$("#team-title-edit").html(teamname);
			$("#WsMTeam" + teamid).find("p").html(teamname);
		});
	}
}

// Workspace management team name edit end


// Workspace management channel name edit start

$(".edit-ws-channel-name").click(function (e) {
	$(".wsM-channel-name").attr("contenteditable", "true");
	$(".wsM-channel-name").focus();
});
$(".wsM-channel-name").on('keypress', function (e) {
	if (e.keyCode == 13) {
		$(".wsM-channel-name").attr("contenteditable", "false")
		$(".wsM-channel-name").html($(".wsM-channel-name").text());
	}
});

// Workspace management channel name edit end


// User profile active deactive start

$("#User-Profile-Active").click(function (e) {
	$(this).hide();
	$(this).parents("div").find("#User-Profile-Deactive").show();
	$(this).parents("div").find("#User-Profile-Active-Deactive").text("Active");

});

$("#User-Profile-Deactive").click(function (e) {
	$(this).hide();
	$(this).parents("div").find("#User-Profile-Active").show();
	$(this).parents("div").find("#User-Profile-Active-Deactive").text("Deactive");
});

// User profile active deactive end



$(".Home-tab-Toggle").click(function () {
	$("#ws-user-profile-page").hide();
	// $("#ws-team-details").hide();
	$("#ws-channels-details").hide();
});

var close_all_tab = () => {
	$("#wsUserManagementTab").hide();
	$("#wsManagementTab").hide();
	$("#wsFileManagementTab").hide();
	$('.admin_settings .tab_list').removeClass('active');
	$("#wsMemberTab").hide();
	$("#wsChannelTab").hide();
	$("#wsCallManagementTab").hide();
}

function wsUserManagementTab() {
	close_all_tab();
	$('.admin_settings .userManagement').addClass('active');
	$("#wsUserManagementTab").show();
}


function wsManagementTab() {
	close_all_tab();
	$('.admin_settings .workspaceManagement').addClass('active');
	$("#wsManagementTab").show();
	$("#wsMemberTab").hide();
	$("#wsChannelTab").hide();
}

function wsFileManagementTab() {
	close_all_tab();
	$('.admin_settings .fileManagement').addClass('active');
	$("#wsFileManagementTab").show();
}

$(".navigate-tabcustom").click(function () {
	// $("#ws-team-details").hide();
	$("#ws-channels-details").hide();
	$("#ws-channels-details").hide();
});


function wsTeamTab() {
	document.getElementById('ws_all_team').style.display = "block";
}

function wsChannelTab() {
	document.getElementById('ws-all-channel').style.display = "block";
}

$(".delete-icon").click(function (e) {
	$(this).parents("tr").remove();
});


$("#Create-a-New-Channel").click(function () {
	$("#Create-ChannelBackWrap").show();
});
$("#ws-create-Channel-popup-close").click(function () {
	$("#Create-ChannelBackWrap").hide();
});


//Workspace management create Channel start

$("#WsManagCteateChannel").click(function (e) {
	e.preventDefault();
	var teamname = $("#WsManagChannelName").val();
	if (teamname != "") {
		var design = '<div class="channels ws-channels"><h3>' + teamname + '</h3><p>76 Members</p></div>';

		$(".AllChannels").append(design);
		$("#Create-ChannelBackWrap").hide();
		$('#WsManageNewChannelForm').each(function () {
			this.reset();
		});
		$('.ws-channels').on('click', function (event) {
			$("#ws-all-channel").hide();
			$("#ws-channels-details").show();
		});
	}

});

$(document).ready(function () {
	if (getParameterByName('profile') == 'profile') {
		$('.ws-profile-name').trigger('click');
	}

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

});
//Workspace management create Channel end

$(document).keyup(function (e) {
	if (e.keyCode == 27) {
		$('#ws-create-user-popup-close').trigger('click');
		$('#ws-create-Channel-popup-close').trigger('click');
	}
});

function userImageUpdate(roomid, event, files) {
	var formData = new FormData();
	formData.append('bucket_name', 'profile-pic');
	formData.append('room_image', files[0]);
	var slid = Number(moment().unix());
	formData.append('sl', slid);
	$('.change-profile-photo img').attr('src', file_server+'common/imgLoader.gif');
	$.ajax({
		url: '/s3Local/convImg',
		type: "POST",
		data: formData,
		dataType: 'json',
		contentType: false,
		processData: false,
		success: function (res) {
			console.log(res);
			$('.change-profile-photo img').attr('src', res.data.location);
			$.ajax({
				url: '/settings/update_user_propic',
				dataType: 'JSON',
				type: 'POST',
				data: {
					id: user_id,
					img: res.data.key
				},
				success: function (res2) {
					// console.log(res2);
					window.location.reload();
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	});
}

function channelTeamPermission(type) {
	if (type == 'channel') {
		$('.user-control-tabs').hide();
		$('.channel-team-permission-tab>li').removeClass('active');
		$('#controlChannel').addClass('active');
		$('#channelMainTab').show();
	} else if (type == 'team') {
		$('.user-control-tabs').hide();
		$('.channel-team-permission-tab>li').removeClass('active');
		$('#controlTeam').addClass('active');
		$('#teamMainTab').show();
	} else if (type == 'permission') {
		$('.user-control-tabs').hide();
		$('.channel-team-permission-tab>li').removeClass('active');
		$('#controlPermission').addClass('active');
		$('#permissionMainTab').show();
	}
}

function create_new_user() {
	var fullname = $("#cnufname").val().trim() + ' ' + $("#cnulname").val();
	var email = $("#cnuemail").val().trim();
	var role = $("#cnurole").val();
	if (fullname == '' || email == '' || role == '') {
		return false;
	}
	console.log(fullname, email, role, findObjForUser(user_id).dept);
	var newuserData = {
		created_by: user_id,
		fullname: fullname,
		email: email,
		dept: findObjForUser(user_id).dept == "Social" ? "Social" : "Business",
		role: role,
		pass: '123456'
	}

	socket.emit("create_new_user", newuserData, (rep) => {
		console.log(rep)
		if (rep.status) {
			if (thisRoleGuestOrNot(role)) {
				if (guestuserTeam.length > 0 && guestuserConv.length > 0) {
					var data = {
						id: rep.data.id,
						team_id: guestuserTeam,
						conversation_id: guestuserConv,
						user_id: user_id,
						company_id: company_id
					}
					socket.emit('addGuestuseronroom', data, function (re) {
						window.location.reload();
					})
				} else {

					window.location.reload();
				}
			} else {
				window.location.reload();
			}
		} else {
			$('#warningsPopup').css('display', 'flex');
			$(".warningPopupContent").html("");
			$(".warningPopupContent").append('<p class="warningMsg" id="warnignMsgText">'+ rep.err +'</p>');
			if(rep.data.length > 0){
				$.each(rep.data, function(k, v){
					if(v.is_delete == 1){
						var html = '<div data-id="'+ v.id +'" class="reUseableUsr_div">Name: <span style="color:#5a5a5a">'+v.fullname+'</span> <br>Email: <span style="color:#5a5a5a">'+v.email+'</span><br>Role: <span style="color:#5a5a5a">'+v.role+'</span><br><button class="create-user-btn" onclick="restore(\''+ v.id +'\')">Restore</button></div>';
						$(".warningPopupContent").append(html);
					}
				});
			}
			closeAdminSettingPop('createNewUser');
		}
	});
}

function restore(id){
	socket.emit("restore", {id: id}, (res)=>{
		$('#warningsPopup').css('display', 'flex');
		$(".warningPopupContent").html("");
		$(".warningPopupContent").append('<p class="warningMsg" id="warnignMsgText">'+ res.status ? res.msg : res.err +'</p>');
		if(res.status) setTimeout(function(){window.location.reload();}, 3000);
	});
}

function addtothisteam(event, uid) {
	console.log(1495, allteams)
	document.body.style.cursor = "wait";
	var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
	var type = $(event.target).hasClass('selected') ? 'remove' : 'add';
	add_remove_team_member(event, uid, teamid, type);
}


function add_remove_team_member(event, uid, teamid, user_id, type) {
	socket.emit("add_team_member", {
		uid,
		teamid,
		user_id,
		type
	}, function (rep) {
		if (rep.status == false) {
			$('#warningsPopup').css('display', 'flex');
			$('#warningsPopup .warningMsg').text(rep.error);
		} else {			
			// console.log(total_teamMember);
			document.body.style.cursor = "default";
			if (type == 'add') {
				$(event.target).addClass("selected");
				var html = "";
				html += '<tr class="user-table-row tuid_' + uid + '" data-id="' + uid + '">' +
					'<td class="fullName" onclick="openprofile(\'' + uid + '\')"> <img src="' + file_server + 'profile-pic/Photos/' + get_user_info_obj(uid).img + '" alt="' + get_user_info_obj(uid).fullname + '"><span> ' + get_user_info_obj(uid).fullname + ' </span></td>' +
					'<td>Member</td>' +
					'<td onclick="removefromteam(event)">Remove</td>' +
					'</tr>';
				$("#ws-user-management-table .user-table-body").append(html);
				$("#team-updated-by").html(get_user_info_obj(user_id).fullname);
				$("#team-updated-date-time").html(moment(rep.teamFromdb[0].updated_at).format("Do MMM YYYY") + ", " + moment(rep.teamFromdb[0].updated_at).format('LT'));
			} else {
				$.each(allteams, function(k,v){
					if(v.team_id == teamid){
						removeA(v.participants,uid);
					}
				});
				var total_teamMember = $("#total_teamMember").text().replace ( /[^\d.]/g, '' ) - 1;
				$("#total_teamMember").html("(" + total_teamMember + ")");				
				// $("#team-member-length").html("(" + total_teamMember + ")");
				$(event.target).removeClass("selected");
				$(".tuid_" + uid).remove();
				$("#team-updated-by").html(get_user_info_obj(user_id).fullname);
				$("#team-updated-date-time").html(moment(rep.teamFromdb[0].updated_at).format("Do MMM YYYY") + ", " + moment(rep.teamFromdb[0].updated_at).format('LT'));
			}
		}
	});
}

function removefromteam(event) {
	var uid = $(event.target).closest("tr").attr("data-id");
	var teamid = $("#workSpaceTeamExplore").attr("data-teamid");
	$("#").show();
	add_remove_team_member(event, uid, teamid, user_id, 'remove');
}

function open_role_changer(event) {
	if (has_permission(user_id, USER_ROLE_CHANGE)) {
		$('#adminSettingBackWrap').css('display', 'flex');
		$('#roleChangerPopup').css('display', 'flex');
		$('#roleChangerPopup').attr('data-uid', $(event.target).closest('.user-table-row').attr('data-id'));
		$('#roleChangerPopup select').html('');
		$('#roleChangerPopup select').append('<option>Select a role</option>');
		$.each(allroles, function (k, v) {
			$('#roleChangerPopup select').append('<option value="' + v.role_id + '">' + v.role_title + '</option>');
		});
	} else {
		$('#warningsPopup').css('display', 'flex');
		$('#warningsPopup .warningMsg').text("You have no permission to perform this action.");
	}
}

function change_role_submit() {
	var uid = $('#roleChangerPopup').attr('data-uid');
	var role = $('#roleChangerPopup select').val();
	// console.log(1435, uid, role);
	socket.emit("update_role", {
		uid,
		role
	}, function (rep) {
		console.log(rep);
		if (rep.status) {
			setCookie("admintabname", "role");
			setCookie("triggerid", $("#wsTeamPermission").attr("data-id"));
			window.location.reload();
		} else {
			$('#warningsPopup').css('display', 'flex');
			$('#warningsPopup .warningMsg').text(rep.error);
			$('#roleChangerPopup').hide();
		}
	});
}

function delete_role_popup(event) {
	var role = $("#wsTeamPermission").attr("data-id");
	console.log(1482, role, has_permission(user_id, ROLE_REMOVE));
	if (has_permission(user_id, ROLE_REMOVE)) {
		$('#wsDeleteRolePopup').css('display', 'flex');
		$('#wsDeleteRolePopup').attr('data-id', role);
	} else {
		$('#warningsPopup').css('display', 'flex');
		$('#warningsPopup .warningMsg').text("You have no permission to perform this action.");
	}
}

function delete_role_submit(event) {
	var role_id = $('#wsDeleteRolePopup').attr('data-id');
	socket.emit("delete_role", {
		role_id
	}, function (rep) {
		if (rep.status) {
			setCookie("admintabname", "role");
			window.location.reload();
		} else {
			console.log(rep);
			$('#warningsPopup').css('display', 'flex');
			$('#warningsPopup .warningMsg').text(rep.error);
			$('#roleChangerPopup').hide();
		}
	});
}

$(document).on("change", "#active_deactive_user_search", function () {
	var active_val = $(this).children("option:selected").val();
	$("#roll_wise_user_search").val("All Roll");

	$("#User-management-User-list tr").each(function () {
		$(this).find("td").eq(5).parent().show();
		if (active_val == "active_users") {
			var visible = $(this).find("td").eq(5).find(".Active-users").is(':visible');
			if (visible == false) {
				$(this).find("td").eq(5).parent().hide();
			} else {
				$(this).find("td").eq(5).parent().show();
			}
		} else if (active_val == "deactive_users") {
			var visible = $(this).find("td").eq(5).find(".Deactive-users").is(':visible');
			if (visible == false) {
				$(this).find("td").eq(5).parent().hide();
			} else {
				$(this).find("td").eq(5).parent().show();
			}
		} else {
			$(this).find("td").eq(5).parent().show();
		}
	});
});


$(document).on("change", "#roll_wise_user_search", function () {
	var roll_val = $(this).children("option:selected").val();
	$("#active_deactive_user_search").val("all_users");
	// alert(src_val);
	$("#User-management-User-list tr").each(function () {
		$(this).find("td").eq(3).parent().show();
		var roll_visible_txt = $(this).find("td").eq(3).text();
		if (roll_val == "Normal User") {
			if (roll_visible_txt == "Normal User") {
				$(this).find("td").eq(3).parent().show();
			} else {
				$(this).find("td").eq(3).parent().hide();
			}
		} else if (roll_val == "System Admin") {
			if (roll_visible_txt == "System Admin") {
				$(this).find("td").eq(3).parent().show();
			} else {
				$(this).find("td").eq(3).parent().hide();
			}
		} else {
			$(this).find("td").eq(3).parent().show();
		}
	});
});

// var user_list = _.orderBy(allUserdata[0].users, ["fullname"], ["asc"]);
var user_list = allUserdata;
$.each(user_list, function (ky, va) {
	// if(jQuery.inArray(va.dept, dept) == -1){
	// 	dept.push(va.dept);
	// }
	if(va.id != user_id && va.is_delete == 0){
		var design = '	<li>';
		design += '		<label class="">'+va.fullname+'';
		design += '			<input onclick="memAssignForTodo(event,\''+va.id+'\')" id="'+va.fullname.replace(/\s/g,'')+'" class="checkTask" data-uid="'+va.id+'" type="checkbox">';
		design += '			<span class="checkmark"></span>';
		design += '		</label>';
		design += '		</li>';

		// var design = '	<div class="added-channel-members">';
		// 	design += '		<input onclick="memAssignForTodo(event,\''+va.id+'\')" id="'+va.fullname.replace(/\s/g,'')+'" class="checkTask" data-uid="'+va.id+'" type="checkbox">';
		// 	design += '		<label for="'+va.fullname.replace(/\s/g,'')+'">'+va.fullname+'</label>';
		// 	design += '	</div>';

		$("#memberHolder").append(design);
	}
});

$.each(user_list,function(k,v){
	user_id_to_img[v.id] = v.img;
	user_id_to_fullname[v.id] = v.fullname;
})

function findObjForUser(value) {
	for (var i = 0; i < user_list.length; i++) {
		if (user_list[i]['id'] === value) {
			if(user_list[i].login_total == null){
				user_list[i].login_total = 0;
			}
			var userData ={
				email: user_list[i].email,
				fullname: user_list[i].fullname,
				id: user_list[i].id,
				img: user_list[i].img,
				designation: user_list[i].designation,
				dept: user_list[i].dept,
				createdat: user_list[i].createdat,
				conference_id:user_list[i].conference_id,
				login_total:user_list[i].login_total

			}
			// if(user_list[i].id == user_id){
			// 	userData.fullname = 'You';
			// }
			return userData;
		}
	}
	return false;
}
function closeRightSection() {
	$(".connect_right_section").hide();
}

var allConvDetailsForTips = [];
var allUserAndRoomsForTips = [];
var allRoomsForTips = [];
var add_remove_conv = [];

// allConvDetailsForTips = [];
// allUserAndRoomsForTips = [];
// allRoomsForTips = [];
// add_remove_conv = [];

function backToTipsList() {
	$("#view_tips").show();
	$("#create_update_tips").hide();
}

function view_create_new_tips() {
	allConvDetailsForTips = [];
	allUserAndRoomsForTips = [];
	allRoomsForTips = [];
	add_remove_conv = [];

	$("#tipsTitle").val("");
	$("#tipsDetails").val("");
	$("#tipsKeywords").val("");
	$('#tipsLifeTime').val("");
	$('#added_conv_for_tips').html("");

	$("#tips_create_update").html("Create Tip(s)");
	$("#createNewTips").html("Create Tip(s)").removeAttr("tips-id");
	$("#admin-setting-right-section").scrollTop(0);
	$("#view_tips").hide();
	$("#delete_tips_btn_con").html("").hide();
	$("#create_update_tips").show();
	
}

function viewRoomAndUserlists(e, elm){	
	allConvDetailsForTips = [];
	allUserAndRoomsForTips = [];
	allRoomsForTips = [];
	$("#tips_mini_items_con").html("");
	$("#updateTipsForConversation").html("");

	var userid = user_id;
	socket.emit('allConvListForTips', { userid }, (res) => {
		// console.log(6525,res);
		if (res.staus) {
			allRoomsForTips = res.rooms;
			$.each(res.rooms, function (k, v) {
				allConvDetailsForTips.push(v);
				if(v.conversation_id !== conversation_id){
					if(v.single == 'no'){
						if(v.title != '' && v.title != null){
							var data = {
								conversation_id: v.conversation_id,
								conv_img: v.conv_img,
								title: v.title,
								type: 'group'
							}
							allUserAndRoomsForTips.push(data);
							// $('#shareSuggestedList').append(userListDesign(v));
						}
					}
				}
			});
			// console.log("rooms", allUserAndRoomsForTips);
			$.each(allUserdata, function(k,v){
				var data ={
					conversation_id:v.id,
					conv_img:v.img,
					title:v.fullname,
					type:'user'
				}
				if(v.is_active !== 0 && v.is_delete == 0) {
					allUserAndRoomsForTips.push(data);
				}
			});

			if(add_remove_conv.length == 0) {	
				console.log("new data", allUserAndRoomsForTips);
				var newdata = _.sortBy(allUserAndRoomsForTips, ["title",'asc']);
				// console.log("new data", newdata);
				$("#tips_mini_items_con").html("");
				$("#updateTipsForConversation").html("");
				$.each(newdata,function(k,v){
					// console.log("newdata", v);
					$("#updateTipsForConversation").append(userRoomConvListDesign(v));									
				});
			} else {
				var added_data = _.sortBy(add_remove_conv, ["title",'asc']);
				// var html_added = "";
				$.each(allUserAndRoomsForTips, function(k,v){
					if(added_data.indexOf(v.conversation_id) != -1) {
						//get added data					
						$("#tips_mini_items_con").append(urcAddedDesign(v));
					}
				});
				$.each(allUserAndRoomsForTips, function(k,v){
					if(added_data.indexOf(conversation_id) == -1) {
						//get not added data
						$("#updateTipsForConversation").append(userRoomConvListDesign(v));
					}
				});
			}
			$("#updateTipsForConversation").scrollTop(0);
			$("#updateConvDirectMsgPopup").show();
		}		
	});
}

function userRoomConvListDesign(data){
	if(data.conv_img == null || data.conv_img == 'null'){
		data.conv_img = 'feelix.jpg';
	}
	if(data.type == 'user') {
		var html = '<li class="" onclick="add_room_conv_for_tips(this, \''+data.conversation_id+'\')" data-id="'+data.conversation_id+'">'
			+ '<img src="'+ file_server +'profile-pic/Photos/'+data.conv_img+'" class="tipsprofile">'
			+ '<span class="conv-name">'+data.title+'</span>';
			+'</li>';
	} else {
		var html = '<li class="" onclick="add_room_conv_for_tips(this, \''+data.conversation_id+'\')" data-id="'+data.conversation_id+'">'
			+ '<img src="'+ file_server +'room-images-uploads/Photos/'+data.conv_img+'" class="tipsprofile">'
			+ '<span class="conv-name">'+data.title+'</span>';
			+'</li>';
	}
	return html;
}

function urcAddedDesign(data){
	var conv_img = data.conv_img;
	var type = data.type;
	var conversation_id = data.conversation_id;
	var title = data.title;

	if(conv_img == null || conv_img == 'null'){
		conv_img = 'feelix.jpg';
	}
	if(type == 'user') {
			var html = '<div class="tips_mini_item">'
				+ '<div class="tips_mini_img">'
				+	'<img src="' + file_server + 'profile-pic/Photos/' + conv_img + '">'
				+ '</div>'
				+ '<p class="tips_mini_name">' + title + '</p>'
				+ '<span class="tips_mini_remove_ico" onclick="remove_tips_user(this, \'' + conversation_id + '\')" data-id="' + conversation_id + '"></span>'
			+ '</div>';
	} else {
		var html = '<div class="tips_mini_item">'
			+ '<div class="tips_mini_img">'
			+	'<img src="' + file_server + 'room-images-uploads/Photos/' + conv_img + '">'
			+ '</div>'
			+ '<p class="tips_mini_name">' + title + '</p>'
			+ '<span class="tips_mini_remove_ico" onclick="remove_tips_user(this, \'' + conversation_id + '\')" data-id="' + conversation_id + '"></span>'
		+ '</div>';
	}
	return html;
}

function add_room_conv_for_tips(elem, ur_id) {
	$.each(allUserAndRoomsForTips, function(k,v){
		// if(v.is_active !== 0 && v.is_delete == 0){
			if(v.conversation_id == ur_id) {				
				$(elem).remove();
				add_remove_conv.push(v.conversation_id);
				// console.log("After add", add_remove_conv);
				$("#tips_mini_items_con").append(urcAddedDesign(v));
			}
		// }
	});
}


function remove_tips_user(elem, ur_id) {
	$.each(allUserAndRoomsForTips, function(k,v){
		// if(v.is_active !== 0 && v.is_delete == 0){
			if(v.conversation_id == ur_id){
				removeA(add_remove_conv, ur_id);
				// console.log("After remove", add_remove_conv);
				$("#updateTipsForConversation").append(userRoomConvListDesign(v));
				$(elem).parent().remove();
			}
		// }			
	});	
}

function selected_conv_for_tips() {
	// if(add_remove_conv.length > 0) {
		$("#added_conv_for_tips").html("");
		$('#updateConvDirectMsgPopup').hide();
		$.each(allUserAndRoomsForTips, function(k, v){
			if(v.conv_img == null || v.conv_img == 'null'){
				v.conv_img = 'feelix.jpg';
			}
			$.each(add_remove_conv, function(key, val){
				if(v.conversation_id == val) {
					if(v.type == 'user') {
						var html = '<div class="conv-single-div" conv-type="'+v.type+'" id="conv_id_' + v.conversation_id + '">'
									+ '<img src="' + file_server + 'profile-pic/Photos/' + v.conv_img + '" class="conv-single-img">'
									+ '<div class="conv-single-name" onclick="">' + v.title + '</div>'
									+ '<span class="remove-it-tips" onclick="removeConvForTips(this, \''+ v.conversation_id +'\')">Remove</span>'
								+ '</div>';
					} else {
						var html = '<div class="conv-single-div" conv-type="'+v.type+'" id="conv_id_' + v.conversation_id + '">'
								+ '<img src="' + file_server + 'room-images-uploads/Photos/' + v.conv_img + '" class="conv-single-img">'
								+ '<div class="conv-single-name" onclick="">' + v.title + '</div>'
								+ '<span class="remove-it-tips" onclick="removeConvForTips(this, \''+ v.conversation_id +'\')">Remove</span>'
							+ '</div>';
					}
					$("#added_conv_for_tips").append(html);
				}
			});			
		});
		$("#added_conv_for_tips").scrollTop(0);
	// }
}

function removeConvForTips(elem, remove_id) {	
	removeA(add_remove_conv, remove_id);
	// console.log("After remove", add_remove_conv);
	$(elem).parent().remove();
}

function add_conv_popup_close() {
	$('#updateConvDirectMsgPopup').hide();
	// $("#tips_mini_items_con").html("");
	// $("#updateTipsForConversation").html("");
	selected_conv_for_tips();
}

function create_tips(elem) {
	var btn_text = $(elem).text();
	// console.log(btn_text);
	
	var tipsTitle = $("#tipsTitle").val().trim();
	var tipsDetails = $("#tipsDetails").val().trim();
	var tipsHotkeys = $("#tipsKeywords").val().trim();
	var tipsLifeTime = $("#tipsLifeTime").children("option:selected").val();
	var conv_ids = add_remove_conv;
	// console.log(conv_ids, tipsTitle, tipsDetails, tipsKeywords, tipsLifeTime);
	// var t = Date.now();
	// console.log(t);
	

	var datetime = new Date();
	console.log("Before: ", datetime);
	// datetime.setHours(datetime.getHours() + 1); 
	// console.log("After: ", datetime);

	// var newDate = new Date(datetime.setTime( datetime.getTime() + 1 * 86400000 ));
	// console.log("After: ", newDate);

	// datetime.setDate(datetime.getDate() + 1 * 7);
	// console.log("After: ", datetime);

	// var newDate = new Date(datetime.setMonth(datetime.getMonth()+8));

	// var aYearFromNow = new Date();
	// aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

	// if(tipsLifeTime =='') {

	// } else {
	// 	// console.log(tipsLifeTime);
	// 	var subText;
	// 	if(tipsLifeTime.length == 2) {
	// 		subText = tipsLifeTime.substr(1,1);
	// 	} else {
	// 		subText = tipsLifeTime.substr(2,1);
	// 	}		
	// 	console.log(subText);
	// 	var number = tipsLifeTime.match(/\d/g).join("");
	// 	console.log(number);
		// if(subText == 'h') {
		// 	var timeHour = time_duration(tipsLifeTime);			
		// 	console.log(timeHour);
		// } else if(subText == 'd') {
		// 	// console.log("from d");
		// 	var day = time_duration(tipsLifeTime);					
		// 	console.log(day);
		// } else if(subText == 'w') {
		// 	var week = time_duration(tipsLifeTime);					
		// 	console.log(week);
		// } else if(subText == 'm') {
		// 	var month = time_duration(tipsLifeTime);					
		// 	console.log(month);
		// } else if(subText == 'y') {
		// 	var year = time_duration(tipsLifeTime);					
		// 	console.log(year);
		// } else {
		// 	//If provide date & time
		// 	console.log("Provide date & time");
		// }
	// }



	if (tipsTitle != "") {
		if($(elem).text() == 'Create Tip(s)') {			
			socket.emit("create_tips", {
				created_by: user_id,
				updated_by: user_id,
				tips_title: tipsTitle,
				tips_details: tipsDetails,
				tips_hotkeys: tipsHotkeys,
				// tips_life_time: tipsLifeTime,
				// conv_ids : conv_ids
			}, (rep) => {
				console.log(rep);
				setCookie("admintabname", "tips");
				if (rep.status) {
					window.location.reload();
				} else {
					// alert(rep.err);
					$("#errTipsTitle").html(rep.err).css("color", "#F55");
				}
			});			
		} else {
			//update tips code here
			var tips_id_for_update = $(elem).attr("tips-id");
			console.log("tips_id_for_update =", tips_id_for_update);
			console.log(tipsTitle);
			socket.emit("update_tips", {
				tips_id: tips_id_for_update,
				updated_by: user_id,
				created_by: user_id,
				tips_title: tipsTitle,
				tips_details: tipsDetails,
				tips_hotkeys: tipsHotkeys,
				// tips_life_time: tipsLifeTime,
				// conv_ids : conv_ids
			}, (rep) => {
				console.log(rep);
				setCookie("admintabname", "tips");
				if (rep.status) {
					window.location.reload();
				} else {
					$("#errTipsTitle").html(rep.err).css("color", "#F55");
				}
			});
		}
	}
	


	
}


// function time_duration(tipsLifeTime) {
// 	var time_hdwmy_no;
// 	if(tipsLifeTime.length == 2) {
// 		time_hdwmy_no = tipsLifeTime.substr(0,1);
// 	} else {
// 		time_hdwmy_no = tipsLifeTime.substr(0,2);
// 	}
// 	return 	time_hdwmy_no;
// }

function get_all_tips() {
	// console.log("hiiiii", user_id);
	socket.emit('getAllTipsForShow',{user_id: user_id},function(res){
		if(res.status){
			// console.log(res.tipsdata);
			var alltips_by_userid = _.sortBy(res.tipsdata, ["tips_title",'asc']);
			console.log(alltips_by_userid);
			var html = '';
			$("#tips_indivisual_con").html("");
			$.each(alltips_by_userid, function(key, val){
				// console.log(key, '==', val);
				var tips_id = val.tips_id;	
				var tips_title = val.tips_title;	
				var tips_details = val.tips_details;
				html += '<div class="indivisual-tips" onclick="view_tips(this, \'' + tips_id + '\')">' +
							'<div class="tipsGallary">' +
								'<h3 class="tips-name">' +
									'<span class="tipes-title">' + tips_title + '</span>' +
								'</h3>' +
								'<p class="tips-details">' + tips_details + '</p>' +
							'</div>' +
							'<div class="tipsFoot">' +
								'<h3 class="go-circle">VIEW</h3>' +
							'</div>' +
						'</div>';
			});
			html +=	'<div class="indivisual-tips" onclick="view_create_new_tips()">' +
						'<div class="tipsGallary">' +
							'<h3 class="tips-name create-new-tips">Create Tip(s)</h3>' +
						'</div>' +
						'<div class="tipsFoot">' +
							'<h3 class="go-circle add-tipes">+</h3>' +
						'</div>' +
					'</div>';
			$("#tips_indivisual_con").append(html);
		}
	});
}

function view_tips(elem, tips_id) {
	allConvDetailsForTips = [];
	allUserAndRoomsForTips = [];
	allRoomsForTips = [];
	add_remove_conv = [];	

	// var tips_title = $(elem).find(".tipes-title").text();
	// var tips_details = $(elem).find(".tips-details").text();
	// console.log(tips_title, ' = ' , tips_details);

	socket.emit('getATipsById',{user_id: user_id, tips_id: tips_id},function(res){
		if(res.status){
			// console.log(res.onetipsdata[0].tips_title);
			var tips_id = res.onetipsdata[0].tips_id;
			var tips_title = res.onetipsdata[0].tips_title;
			var tips_details = res.onetipsdata[0].tips_details;
			var tips_hotkeys = res.onetipsdata[0].tips_hotkeys;

			var life_time = res.onetipsdata[0].life_time;
			var allow_conversation = res.onetipsdata[0].allow_conversation;

			var created_by = res.onetipsdata[0].created_by;
			var updated_by = res.onetipsdata[0].updated_by;
			var created_at = res.onetipsdata[0].created_at;
			var updated_at = res.onetipsdata[0].updated_at;

			
			$("#tipsTitle").val(tips_title);
			$("#tipsDetails").val(tips_details);
			$("#tipsKeywords").val(tips_hotkeys);
			$('#tipsLifeTime').val("");
			$('#added_conv_for_tips').html("");

			$("#tips_create_update").html("Update Tip(s)");
			$("#createNewTips").html("Update Tip(s)").attr("tips-id", tips_id);
			
			var html = '<div class="delete_tips_btn" onclick="delete_tips_popup(\'' + tips_id + '\')">Delete</div>';
			$("#delete_tips_btn_con").html("").append(html).show();
			$("#admin-setting-right-section").scrollTop(0);
			$("#view_tips").hide();
			$("#create_update_tips").show();
		}
	});
}

function delete_tips_popup(tips_id) {	
	console.log(2341, tips_id);
	$("#adminSettingBackWrap").show();
	$("#wsDeleteTips").show();
	$("#wsDeleteTipsBtn").attr("onclick", "delete_tips(\'" + tips_id + "\')");
}

function delete_tips(tips_id) {
	console.log(tips_id);
	socket.emit('delete_tips',{user_id: user_id, tips_id: tips_id},function(res){
		if(res.status){
			setCookie("admintabname", "tips");
			if (res.status) {
				window.location.reload();
			}
			// else {
			// 	$("#errTipsTitle").html(rep.err).css("color", "#F55");
			// }
		}
	});
}