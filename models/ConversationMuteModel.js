let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
	fields: {
			conversation_id: { type: "uuid" },
			mute_id: { type: "uuid", default: { "$db_function": "uuid()" } },
			mute_by: { type: "uuid" },
			mute_start_time: { type: "text", default: null },
			mute_duration: { type: "text", default: null },
			mute_end_time: { type: "text", default: null },
			mute_status: { type: "text", default: "active" },
			mute_day: { type: "set", typeDef: "<text>", default: null },
			mute_unix_start: { type: "text", default: null },
			mute_unix_end: { type: "text", default: null },
			mute_timezone: { type: "text", default: null },
			last_update_time: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
			show_notification: { type: "boolean", default: false }
	},
	key: ["mute_id"],
	indexes: ["conversation_id", "mute_by"],
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
