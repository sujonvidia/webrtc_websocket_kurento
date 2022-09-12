let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// var CryptoJS = require("crypto-js");
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        msg_id: { type: "timeuuid", default: { "$db_function": "now()" } },
        created_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
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
            type: "map",
            typeDef: "<text, int>",
            default: {
                "grinning": 0,
                "joy": 0,
                "open_mouth": 0,
                "disappointed_relieved": 0,
                "rage": 0,
                "thumbsup": 0,
                "thumbsdown": 0,
                "heart": 0,
                "folded_hands": 0,
                "check_mark": 0
                    // "warning": 0
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
        updatedmsgid: { type: "uuid", default: null },
        tag_list: { type: "set", typeDef: "<text>" },
        issue_accept_user: { type: "set", typeDef: "<text>" },
        conference_id: { type: "text", default: null },
        forward_by: { type: "uuid", default: null },
        forward_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        msg_text: { type: "text", default: '' },
        edit_history: { type: "text", default: null },
        secret_user: { type: "set", typeDef: "<text>" },
        service_provider: { type: "set", typeDef: "<text>" },
        mention_user: { type: "set", typeDef: "<text>" },
        assign_to: { type: "set", typeDef: "<text>" },
        root_conv_id: { type: "text", default: null },
        user_tag_string: { type: "text", default: null },
        is_secret: { type: "boolean", default: false },
        total_files: { type: "text", default: null },
    },
    key: ["conversation_id", "msg_id"],
    clustering_order: { "msg_id": "desc" },
    custom_indexes: [{
            on: 'msg_type',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        },
        {
            on: 'msg_body',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {
                'mode': 'CONTAINS'
            }
        },
        {
            on: 'msg_text',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {
                "mode": "CONTAINS",
                "analyzed": "true",
                "analyzer_class": "org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer",
                "case_sensitive": "false"
            }
        }
    ],
    before_save: function(instance, options) {
        // console.log(instance.msg_body);
        // var ciphertext = CryptoJS.AES.encrypt(instance.msg_body, 'freeli_01').toString();
        // instance.msg_body = ciphertext;

        if (!redis_cache_enabled) return true;
        let totalData = _redis.getInsertProperties(instance, this);
        let pkey = this.key[0];
        _redis.insertRedisCache(table_name, totalData, this, {
            [pkey]: totalData[pkey] });
        return true;
    },
    before_update: function(queryObject, updateValues, options) {
        // console.log(125,updateValues.msg_body)
        // if(typeof updateValues.msg_body != 'undefined'){

        // 	var ciphertext = CryptoJS.AES.encrypt(updateValues.msg_body, 'freeli_01').toString();
        // 	updateValues.msg_body = ciphertext;
        // }
        if (!redis_cache_enabled) return true;
        _redis.updateRedisCache(table_name, queryObject, updateValues, this, options);
        return true;
    },
    before_delete: function(queryObject, options) {
        if (!redis_cache_enabled) return true;
        _redis.deleteRedisCache(table_name, queryObject, this, options);
        return true;
    }
}
if (redis_cache_enabled) _redis.saveRedisIndex(table_name, obj);
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj