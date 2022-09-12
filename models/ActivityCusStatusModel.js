let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
	fields: {
		id: {
			type: "timeuuid",
			default: { "$db_function": "now()" }
		},
		activity_id: { type: "uuid", default: null },
		user_id: { type: "uuid", default: null },
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
		title: { type: "text", default: null },
		type: { type: "text", default: null },
		color_code: { type: "text", default: null },
	},
	key: ["id"],
	indexes: ["activity_id", "user_id"],

	before_save:    function (instance, options) {
		if (!redis_cache_enabled) return false;
		let totalData = _redis.getInsertProperties(instance, this);
		    _redis.insertRedisCache(table_name, totalData, this);
		return true;
	},
	before_update:    function (queryObject, updateValues, options) {
		if (!redis_cache_enabled) return false;
		    _redis.updateRedisCache(table_name, queryObject, updateValues, options);
		return true;
	},
	before_delete:   function (queryObject, options) {
		if (!redis_cache_enabled) return false;
		    _redis.deleteRedisCache(table_name, queryObject, options);
		return true;
	}
};