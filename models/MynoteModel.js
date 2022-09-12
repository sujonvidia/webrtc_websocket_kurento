let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        note_id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        subtask_id: { type: "uuid" },
        sender: { type: "uuid", default: "NOT NULL" },
        sender_name: { type: "text", default: "NOT NULL" },
        sender_img: { type: "text", default: "NOT NULL" },
        msg_body: { type: "text", default: "NOT NULL" },
        has_delete: { type: "set", typeDef: "<text>" },
        checklist: { type: "set", typeDef: "<text>" },
        subtask_lists: { type: "set", typeDef: "<text>" },
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
        label: { type: "set", typeDef: "<text>" },
        note_type: { type: "text", default: "NOT NULL" }
    },
    key: ["subtask_id", "note_id"],
    clustering_order: { "note_id": "desc" },
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