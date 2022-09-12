let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
	fields: {
		id: {
			type: "timeuuid",
			default: { "$db_function": "now()" }
		},
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
		user_id: { type: "uuid" },
		conversation_id: { type: "uuid" },
		type: { type: "text" },
		tune_title: { type: "text", default: "null" },
		status: { type: "int", default: 1 },

	},
	key: ["id"],
	indexes: ["user_id", "conversation_id", "type", "tune_title", "status"],
	before_save:    function (instance, options) {
		if (!redis_cache_enabled) return true;
		let totalData = _redis.getInsertProperties(instance, this);
		let pkey = this.key[0];
		    _redis.insertRedisCache(table_name, totalData, this, { [pkey]: totalData[pkey] });
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
if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
