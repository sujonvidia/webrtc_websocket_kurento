console.log(1, global_cache_data);
var has_prev_msg_into_cache=(convid, msgid)=>{
	if(global_cache_data.length > 0){
		for(var i = 0; i<global_cache_data.length; i++){
			if(global_cache_data[i].conversation_id == convid){
				var lsm = global_cache_data[i].conversation_list;
				var msglength = lsm.length;
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
};

var update_cache_conv_msg_preview = (conversation_id, msgid, data) =>{
	var key = has_conv_into_cache(conversation_id);
	$.each(global_cache_data[key].conversation_list, function(k, v){
		if(msgid == v.msg_id){
			global_cache_data[key].conversation_list[k].msg_body = data.msg_body;
			global_cache_data[key].conversation_list[k].url_base_title = data.publisher;
			global_cache_data[key].conversation_list[k].url_favicon = data.logo;
			global_cache_data[key].conversation_list[k].url_title = data.title;
			global_cache_data[key].conversation_list[k].url_body = data.description;
			global_cache_data[key].conversation_list[k].url_image = data.image;

			add_conv_into_cache('active_conv', global_cache_data[key]);
		}
	});
};

var update_cachestorage_clear = (convid, user_id) =>{
	var key = has_conv_into_cache(convid);
	if(key > -1){
		$.each(global_cache_data[key].conversation_list, function(k, v){
			if(global_cache_data[key].conversation_list[k].has_hide == null)
				global_cache_data[key].conversation_list[k].has_hide = [user_id];
			else{
				if(global_cache_data[key].conversation_list[k].has_hide.indexOf(user_id) == -1)
					global_cache_data[key].conversation_list[k].has_hide.push(user_id);
			}
		});
		remove_conv_from_cache(user_id+convid);
		remove_conv_from_cache('last_active_conv'+user_id);
	}
};

var update_cache_pin_data=(convid, pin_id, type)=>{
	var key = has_conv_into_cache(convid);
	if(key > -1){
		if(type == 'add'){
			global_cache_data[key].pinnedStatus = {'id': pin_id, 'block_id': convid, 'serial_number': 1, 'user_id': user_id, 'createdat': moment.now()};
			if(convid == conversation_id)
				add_conv_into_cache('active_conv', global_cache_data[key]);
		}else{
			delete global_cache_data[key].pinnedStatus;
			if(convid == conversation_id)
				add_conv_into_cache('active_conv', global_cache_data[key]);
		}
	}
};

var cache_conv_update_thread_count = (convid, msgid, name)=>{
	var key = has_conv_into_cache(convid);
	if(key > -1){
		$.each(global_cache_data[key].conversation_list, function(k, v){
			if(msgid == v.msg_id){
				global_cache_data[key].conversation_list[k].has_reply =
						global_cache_data[key].conversation_list[k].has_reply + 1;
				global_cache_data[key].conversation_list[k].last_reply_name = name;
				global_cache_data[key].conversation_list[k].last_reply_time = moment.now();
				if(convid == conversation_id)
					add_conv_into_cache('active_conv', global_cache_data[key]);
				return false;
			}
		});
	}
};

var cache_conv_add_reac_into_replies = (convid, msgid, emojiname, n)=>{
	var key = has_conv_into_cache(convid);
	if(key > -1){
		$.each(global_cache_data[key].conversation_list, function(k, v){
			if(msgid == v.msg_id){
				$.each(global_cache_data[key].conversation_list[k].has_emoji, function(ek, ev){
					if(emojiname == ek){
						global_cache_data[key].conversation_list[k].has_emoji[ek] =
							global_cache_data[key].conversation_list[k].has_emoji[ek] + n;
						return false;
					}
				});
				if(convid == conversation_id){
					add_conv_into_cache('active_conv', global_cache_data[key]);
				}
				return false;
			}
		});
	}
}

var update_cache_conv_msg_flag = (key, msgid) =>{
	var all_msg = global_cache_data[key].conversation_list;
	$.each(all_msg, function(k, v){
		if(msgid == v.msg_id){
			if(global_cache_data[key].conversation_list[k].has_flagged == null)
				global_cache_data[key].conversation_list[k].has_flagged = [user_id];
			else{
				if(global_cache_data[key].conversation_list[k].has_flagged.indexOf(user_id) == -1)
					global_cache_data[key].conversation_list[k].has_flagged.push(user_id);
				else
					global_cache_data[key].conversation_list[k].has_flagged.splice(global_cache_data[key].conversation_list[k].has_flagged.indexOf(user_id), 1);
			}
			add_conv_into_cache('active_conv', global_cache_data[key]);
			add_conv_into_cache('html', $("#msg-container").html().toString(), user_id+conversation_id);
		}
	});
};

var delete_cache_conv_msg_delete=(key, msgid)=>{
	for(var i=0; i<global_cache_data[key].conversation_list.length; i++){
		if(msgid == global_cache_data[key].conversation_list[i].msg_id){
			global_cache_data[key].conversation_list.splice(i, 1);
			if(global_cache_data[key].conversation_list[i].conversation_id == conversation_id)
				add_conv_into_cache('active_conv', global_cache_data[key]);
			return false;
		}
	}
};

var update_cache_conv_msg_delete = (key, msgid) =>{
	console.log(global_cache_data[key]);
	var all_msg = global_cache_data[key].conversation_list;
	$.each(all_msg, function(k, v){
		if(msgid == v.msg_id){
			if(global_cache_data[key].conversation_list[k].has_delete == null)
				global_cache_data[key].conversation_list[k].has_delete = [user_id];
			else
				global_cache_data[key].conversation_list[k].has_delete.push(user_id);
			if(global_cache_data[key].conversation_list[k].conversation_id == conversation_id)
				add_conv_into_cache('active_conv', global_cache_data[key]);
		}
	});
}

var update_cache_conv_msg_status=(key, msgids)=>{
	var all_msg = global_cache_data[key].conversation_list;
	$.each(all_msg, function(k, v){
		if(msgids.indexOf(v.msg_id)>-1){
			if(global_cache_data[key].conversation_list[k].msg_status == null)
				global_cache_data[key].conversation_list[k].msg_status = [user_id];
			else
				global_cache_data[key].conversation_list[k].msg_status.push(user_id);
			add_conv_into_cache('active_conv', global_cache_data[key]);
		}
	});
}

function update_cache_conv_msg_prepend(key, data){
	if(key > -1){
		global_cache_data[key].conversation_list.unshift(data);
		add_conv_into_cache('active_conv', global_cache_data[key]);
	}
}

var update_cache_conv = (key, data)=>{
	if(key > -1){
		global_cache_data[key].conversation_list.push(data.msg);
		if(global_cache_data[key].conversation_id == conversation_id)
			add_conv_into_cache('active_conv', global_cache_data[key]);
	}
};

var has_conv_into_cache = (convid)=>{
	console.log(183);
    if(global_cache_data.length > 0){
		for(var i = 0; i<global_cache_data.length; i++){
			if(global_cache_data[i].conversation_id == convid){
				console.log("186 ========================", i);
				return i;
			}
		}
		return -1;
	} else {
		return -1;
	}
};
var add_conv_into_cache = (type, data, key, scroll=true) =>{
	if(type == 'active_conv'){
		socket.emit('set_redis_cache', {user_id: 'last_active_conv'+user_id, body: JSON.stringify(data)}, (rep1)=>{
			console.log('192 last_active_conv update into cache', rep1);
		});
	}
	else{
		setTimeout(function(){
			socket.emit('set_redis_cache', {user_id: key, body: data}, (rep2)=>{
				if(scroll)
					scrollToBottom('.chat-page .os-viewport', 0);
				console.log('199 html cache update', rep2);
			});
		}, 500);
	}
};

var remove_conv_from_cache_data=(key)=>{
	global_cache_data.splice(key, 1);
};

var update_cache_conv_tag = (type,res,tags = null) =>{
	var key;
	if(type == 'newTag'){
		key = has_conv_into_cache(conversation_id);
		$.each(global_cache_data, function(k,v){
			v.totalTags.push(res);
		});
		if (key > -1) {
			$.each(global_cache_data[key]['messagestag'], function (ka, va) {
				if(va['tag_title'] == null){
					va['tag_title'] = [];
				}
				va['tag_title'].push(res.title);
			});
			global_cache_data[key]['condtagsid'].push(res.tag_id);
			global_cache_data[key]['tags'].push(tags);

		}
	}else if(type == 'newTagSp'){
		key = has_conv_into_cache(conversation_id);
		$.each(global_cache_data, function (k, v) {
			if(key > -1){
				$.each(global_cache_data[key]['messagestag'], function (k, v) {
					if(v.id == res.id){
						v.tag_title = res.tag_title;
					}
				});
			}

		});

	}else if(type == 'removeTag'){
		key = has_conv_into_cache(res.convid);

		$.each(global_cache_data, function (k, v) {
			let index1 = findIndexOfObj(v.totalTags, 'tag_id', res.tagid);
			let index2 = v.condtagsid.indexOf(res.tagid);
			v.totalTags.splice(index1, 1);
			v.condtagsid.splice(index2, 1);
			$.each(v['messagestag'], function(ka,va){
				removeA(va['tag_title'], res.tagTitle);
			});

		});
	}else if(type == 'active'){
		key = has_conv_into_cache(res.conversation_id);
		if (key > -1) {
			$.each(global_cache_data[key]['messagestag'], function (ka, va) {
				if (va['tag_title'] !== null) {
					va['tag_title'].push(res.tagtile);
				}else{
					va['tag_title'] = [res.tagtile];
				}
				console.log(res.tagtile);

			});
			global_cache_data[key]['condtagsid'].push(res.tagid);
			global_cache_data[key]['tags'].push(tags);

		}
	}else if (type == 'deactive') {
		key = has_conv_into_cache(res.rommID);
		console.log(key)
		if (key > -1) {
			$.each(global_cache_data[key]['messagestag'], function (ka, va) {
				removeA(va['tag_title'], res.tagtile);
				console.log(res.tagtile)
			});
			removeA(global_cache_data[key]['condtagsid'], res.tagid);
			removeA(global_cache_data[key]['tags'], tags);
		}

	}
	add_conv_into_cache('active_conv', global_cache_data[key]);
};

/**
 * remove_conv_from_cache function
 * remove the cache.
 * 
 * id = cache key name
 */
var remove_conv_from_cache = (id) =>{ // id=user_id+conversation_id
	socket.emit('delete_redis_cache', {user_id: id}, (cashrep)=>{
		console.log(295, cashrep);
	});
};