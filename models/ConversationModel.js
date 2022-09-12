let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        conversation_id: { type: "uuid", default: { "$db_function": "uuid()" }},
        created_by: { type: "uuid" },
        participants_admin: { type: "set", typeDef: "<text>", default: null },
        participants_guest: { type: "set", typeDef: "<text>", default: null },
        participants: { type: "set", typeDef: "<text>" },
        service_provider: { type: "set", typeDef: "<text>" },
        title: "text",
        single: { type: "text", default: "yes" },
        group: { type: "text", default: "no" },
        group_keyspace: { type: "text", default: "na" },
        privacy: { type: "text", default: "public" },
        archive: { type: "text", default: "no" },
        guests: { type: "text", default: "no" },
        is_active: { type: "set", typeDef: "<text>", default: null },
        status: { type: "text", default: "active" },
        close_for: { type: "set", typeDef: "<text>", default: null },
        conv_img: { type: "text", default: "feelix.jpg" },
        is_pinned_users: { type: "set", typeDef: "<text>", default: null },
        topic_type: { type: "text", default: null },
        b_unit_id: { type: "text", default: null },
        room_id: { type: "text", default: null },
        created_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        is_busy: { type: "int", default: 0 },
        company_id: { type: "timeuuid" },
        last_msg: { type: "text", default: "New messages" },
        last_msg_time: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        sender_id: { type: "uuid" },
        tag_list: { type: "set", typeDef: "<text>" },
        msg_status: { type: "text" },
        conference_id: "text",
        root_conv_id: {type: "text", default: null},
        reset_id: { type: "text", default: "no" },
        participants_sub: { type: "set", typeDef: "<text>", default: null },
    },
    key: ["conversation_id", "company_id"],
    indexes: ["created_by", "single", "group", "archive", "guests", "tag_list"],
    custom_indexes: [
        {
            on: 'title',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {
                "mode": "CONTAINS",
                "analyzed": "true",
                "analyzer_class": "org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer",
                "case_sensitive": "false"
            }
        }
    ],
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
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
