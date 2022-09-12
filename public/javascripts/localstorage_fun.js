function has_prev_msg_into_local(conversation_id, msgid){
	if(localStorage.get_conversation_history !== undefined)
		localstorage['get_conversation_history'] = JSON.parse(localStorage.get_conversation_history);
	if(localstorage['get_conversation_history'].length > 0){
		var ls = localstorage['get_conversation_history'];
		for(var i = 0; i<ls.length; i++){
			if(ls[i].conversation_id == conversation_id){
				var lsm = localstorage['get_conversation_history'][i].conversation_list;
				var msglength = lsm.length;
				console.log("lsm length"+ msglength);
				if(msglength>20){
					for(j=0; j<msglength; j++){
						if(lsm[j].msg_id == msgid){
							return j;
						}
					}
				}
				return -1;
			}
		}
		return -1;
	} else {
		return -1;
	}
}

function update_local_conv_msg_preview(conversation_id, msgid, data){
	var key = has_conv_into_local(conversation_id);
	$.each(localstorage['get_conversation_history'][key].conversation_list, function(k, v){
		if(msgid == v.msg_id){
			localstorage['get_conversation_history'][key].conversation_list[k].msg_body = data.msg_body;
			localstorage['get_conversation_history'][key].conversation_list[k].url_base_title = data.publisher;
			localstorage['get_conversation_history'][key].conversation_list[k].url_favicon = data.logo;
			localstorage['get_conversation_history'][key].conversation_list[k].url_title = data.title;
			localstorage['get_conversation_history'][key].conversation_list[k].url_body = data.description;
			localstorage['get_conversation_history'][key].conversation_list[k].url_image = data.image;

			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
		}
	});
}

function update_localstorage_clear(conversation_id, user_id){
	var key = has_conv_into_local(conversation_id);
	if(key > -1){
		$.each(localstorage['get_conversation_history'][key].conversation_list, function(k, v){
			if(localstorage['get_conversation_history'][key].conversation_list[k].has_hide == null)
				localstorage['get_conversation_history'][key].conversation_list[k].has_hide = [user_id];
			else{
				if(localstorage['get_conversation_history'][key].conversation_list[k].has_hide.indexOf(user_id) == -1)
					localstorage['get_conversation_history'][key].conversation_list[k].has_hide.push(user_id);
			}
		});
		localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
	}
}

function update_local_pin_data(conversation_id, pin_id, type){
	var key = has_conv_into_local(conversation_id);
	if(key > -1){
		if(type == 'add'){
			localstorage['get_conversation_history'][key].pinnedStatus = {'id': pin_id, 'block_id': conversation_id, 'serial_number': 1, 'user_id': user_id, 'createdat': moment.now()};
			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
		}else{
			delete localstorage['get_conversation_history'][key].pinnedStatus;
			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
		}
	}
}

function local_conv_update_thread_count(conversation_id, msgid, name){
	var key = has_conv_into_local(conversation_id);
	if(key > -1){
		$.each(localstorage['get_conversation_history'][key].conversation_list, function(k, v){
			if(msgid == v.msg_id){
				localstorage['get_conversation_history'][key].conversation_list[k].has_reply =
						localstorage['get_conversation_history'][key].conversation_list[k].has_reply + 1;
				localstorage['get_conversation_history'][key].conversation_list[k].last_reply_name = name;
				localstorage['get_conversation_history'][key].conversation_list[k].last_reply_time = moment.now();
				localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
				return false;
			}
		});
	}
}

function local_conv_add_reac_into_replies(conversation_id, msgid, emojiname, n){
	var key = has_conv_into_local(conversation_id);
	if(key > -1){
		$.each(localstorage['get_conversation_history'][key].conversation_list, function(k, v){
			if(msgid == v.msg_id){
				$.each(localstorage['get_conversation_history'][key].conversation_list[k].has_emoji, function(ek, ev){
					if(emojiname == ek){
						localstorage['get_conversation_history'][key].conversation_list[k].has_emoji[ek] =
							localstorage['get_conversation_history'][key].conversation_list[k].has_emoji[ek] + n;
						return false;
					}
				});
				localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
				return false;
			}
		});
	}
}

function update_local_conv_msg_flag(key, msgid){
	// var all_msg = localstorage['get_conversation_history'][key].conversation_list;
	// $.each(all_msg, function(k, v){
	// 	if(msgid == v.msg_id){
	// 		if(localstorage['get_conversation_history'][key].conversation_list[k].has_flagged == null)
	// 			localstorage['get_conversation_history'][key].conversation_list[k].has_flagged = [user_id];
	// 		else{
	// 			if(localstorage['get_conversation_history'][key].conversation_list[k].has_flagged.indexOf(user_id) == -1)
	// 				localstorage['get_conversation_history'][key].conversation_list[k].has_flagged.push(user_id);
	// 			else
	// 				localstorage['get_conversation_history'][key].conversation_list[k].has_flagged.splice(localstorage['get_conversation_history'][key].conversation_list[k].has_flagged.indexOf(user_id), 1);
	// 		}
	// 		localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
	// 	}
	// });
}

function delete_local_conv_msg_delete(key, msgid){
	for(var i=0; i<localstorage['get_conversation_history'][key].conversation_list.length; i++){
		if(msgid == localstorage['get_conversation_history'][key].conversation_list[i].msg_id){
			localstorage['get_conversation_history'][key].conversation_list.splice(i, 1);
			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
			return false;
		}
	}
}

function update_local_conv_msg_delete(key, msgid){
	var all_msg = localstorage['get_conversation_history'][key].conversation_list;
	$.each(all_msg, function(k, v){
		if(msgid == v.msg_id){
			if(localstorage['get_conversation_history'][key].conversation_list[k].has_delete == null)
				localstorage['get_conversation_history'][key].conversation_list[k].has_delete = [user_id];
			else
				localstorage['get_conversation_history'][key].conversation_list[k].has_delete.push(user_id);
			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
		}
	});
}

function update_local_conv_msg_status(key, msgids){
	var all_msg = localstorage['get_conversation_history'][key].conversation_list;
	$.each(all_msg, function(k, v){
		if(msgids.indexOf(v.msg_id)>-1){
			if(localstorage['get_conversation_history'][key].conversation_list[k].msg_status == null)
				localstorage['get_conversation_history'][key].conversation_list[k].msg_status = [user_id];
			else
				localstorage['get_conversation_history'][key].conversation_list[k].msg_status.push(user_id);
			localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
		}
	});
}

function update_local_conv_msg_prepend(key, data){
	if(key > -1){
		localstorage['get_conversation_history'][key].conversation_list.unshift(data);
		localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
	}
}

function update_local_conv(key, data){
	if(key > -1){
		localstorage['get_conversation_history'][key].conversation_list.push(data.msg);
		localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
	}
}

function has_conv_into_local(conversation_id){
	if(localStorage.get_conversation_history !== undefined)
		localstorage['get_conversation_history'] = JSON.parse(localStorage.get_conversation_history);
	if(localstorage['get_conversation_history'].length > 0){
		var ls = localstorage['get_conversation_history'];
		for(var i = 0; i<ls.length; i++){
			if(ls[i].conversation_id == conversation_id)
				return i;
		}
		return -1;
	} else {
		return -1;
	}
}

function remove_conv_from_local(key){
	if(localStorage.get_conversation_history !== undefined)
		localstorage['get_conversation_history'] = JSON.parse(localStorage.get_conversation_history);
	localstorage['get_conversation_history'].splice(key, 1);
	localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
}

function update_local_conv_tag(type,res,tags = null){
	var ls = localstorage['get_conversation_history'];
	if(type == 'newTag'){
		var key = has_conv_into_local(conversation_id);
		$.each(localstorage['get_conversation_history'], function(k,v){
			v.totalTags.push(res);
		});
		if (key > -1) {
			$.each(localstorage['get_conversation_history'][key]['messagestag'], function (ka, va) {
				if(va['tag_title'] == null){
					va['tag_title'] = [];
				}
				va['tag_title'].push(res.title);
			});
			localstorage['get_conversation_history'][key]['condtagsid'].push(res.tag_id);
			localstorage['get_conversation_history'][key]['tags'].push(tags);

		}
	}else if(type == 'newTagSp'){
		var key = has_conv_into_local(conversation_id);
		$.each(localstorage['get_conversation_history'], function (k, v) {
			if(key > -1){
				$.each(localstorage['get_conversation_history'][key]['messagestag'], function (k, v) {
					if(v.id == res.id){
						v.tag_title = res.tag_title;
					}
				});
			}

		});

	}else if(type == 'removeTag'){
		var key = has_conv_into_local(res.convid);

		$.each(localstorage['get_conversation_history'], function (k, v) {
			let index1 = findIndexOfObj(v.totalTags, 'tag_id', res.tagid);
			let index2 = v.condtagsid.indexOf(res.tagid);
			v.totalTags.splice(index1, 1);
			v.condtagsid.splice(index2, 1);
			$.each(v['messagestag'], function(ka,va){
				removeA(va['tag_title'], res.tagTitle);
			});

		});
	}else if(type == 'active'){
		var key = has_conv_into_local(res.conversation_id);
		if (key > -1) {
			$.each(localstorage['get_conversation_history'][key]['messagestag'], function (ka, va) {
				if (va['tag_title'] !== null) {
					va['tag_title'].push(res.tagtile);
				}else{
					va['tag_title'] = [res.tagtile];
				}
				console.log(res.tagtile);

			});
			localstorage['get_conversation_history'][key]['condtagsid'].push(res.tagid);
			localstorage['get_conversation_history'][key]['tags'].push(tags);

		}
	}else if (type == 'deactive') {
		var key = has_conv_into_local(res.rommID);
		console.log(key)
		if (key > -1) {
			$.each(localstorage['get_conversation_history'][key]['messagestag'], function (ka, va) {
				removeA(va['tag_title'], res.tagtile);
				console.log(res.tagtile)
			});
			removeA(localstorage['get_conversation_history'][key]['condtagsid'], res.tagid);
			removeA(localstorage['get_conversation_history'][key]['tags'], tags);
		}

	}
	localStorage.get_conversation_history = JSON.stringify(localstorage['get_conversation_history']);
}
