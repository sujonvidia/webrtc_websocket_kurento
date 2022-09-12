let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        edit_log_id: {
            type: "timeuuid",
            default: { "$db_function": "timeuuid()" }
        },
        log_created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        log_created_by: {
            type: "uuid"
        },
        msg_id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        conversation_id: { type: "uuid" },
        sender: { type: "uuid", default: "NOT NULL" },
        sender_name: { type: "text", default: "NOT NULL" },
        sender_img: { type: "text", default: "NOT NULL" },
        msg_body: { type: "text", default: "NOT NULL" },
        call_duration: "text",
        call_msg: "text",
        call_participants: { type: "set", typeDef: "<text>" },
        call_running: { type: "boolean", default: false },
        call_type: "text",
        call_status: "text",
        call_sender_ip: { type: "text", default: "" },
        call_sender_device: { type: "text", default: "" },
        call_receiver_ip: { type: "text", default: "" },
        call_receiver_device: { type: "text", default: "" },
        call_server_addr: { type: "text", default: "" },
        call_server_switch: { type: "boolean", default: false },
        has_flagged: { type: "set", typeDef: "<text>" },
        msg_type: { type: "text", default: "text" },
        msg_status: { type: "set", typeDef: "<text>" },
        attch_imgfile: { type: "set", typeDef: "<text>" },
        attch_audiofile: { type: "set", typeDef: "<text>" },
        attch_videofile: { type: "set", typeDef: "<text>" },
        attch_otherfile: { type: "set", typeDef: "<text>" },
        edit_seen: { type: "set", typeDef: "<text>" },
        has_delete: { type: "set", typeDef: "<text>" },
        has_hide: { type: "set", typeDef: "<text>" },
        has_emoji: {
            type: "map", typeDef: "<text, int>", default: {
                "grinning": 0,
                "joy": 0,
                "open_mouth": 0,
                "disappointed_relieved": 0,
                "rage": 0,
                "thumbsup": 0,
                "thumbsdown": 0,
                "heart": 0
            }
        },
        has_tag_text: { type: "set", typeDef: "<text>" },
        has_delivered: { type: "int", default: 0 },
        has_reply: { type: "int", default: 0 },
        last_reply_name: { type: "text", default: "" },
        last_reply_time: { type: "timestamp" },
        activity_id: { type: "text", default: null },
        url_favicon: { type: "text", default: null },
        url_base_title: { type: "text", default: null },
        url_title: { type: "text", default: null },
        url_body: { type: "text", default: null },
        url_image: { type: "text", default: null },
        has_timer: { type: "text", default: null },
        edit_status: { type: "text", default: null },
        old_created_time: { type: "timestamp", default: null },
        last_update_user: { type: "uuid", default: null },
        last_update_time: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        updatedMsgid: { type: "uuid", default: null },
        tag_list: { type: "set", typeDef: "<text>" },
        issue_accept_user: { type: "set", typeDef: "<text>" },
        conference_id: { type: "text", default: null },

    },
    key: ["edit_log_id", "msg_id"],
    before_save:    function (instance, options) {
		if (!redis_cache_enabled) return true;
		let totalData = _redis.getInsertProperties(instance, this);
		let pkey = this.key[0];
		    _redis.insertRedisCache(table_name, totalData, this,{[pkey]:totalData[pkey]});
		return true;
	},
	before_update:    function (queryObject, updateValues, options) {
		if (!redis_cache_enabled) return true;
		    _redis.updateRedisCache(table_name, queryObject, updateValues, this, options);
		return true;
	},
	before_delete:   function (queryObject, options) {
		if (!redis_cache_enabled) return true;
		    _redis.deleteRedisCache(table_name, queryObject, this, options);
		return true;
	}
}
if (redis_cache_enabled) _redis.saveRedisIndex(table_name,obj);

module.exports = obj
