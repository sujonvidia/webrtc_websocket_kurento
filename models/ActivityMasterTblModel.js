let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
	fields: {
		id: {
			type: "timeuuid",
			default: { "$db_function": "now()" }
		},
		target_position: { type: "text", default: null },
		target_id: { type: "uuid", default: null },
		updated_by: { type: "uuid", default: null },
		updated_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
		target_pre_value: { type: "text", default: null },
		target_current_value: { type: "text", default: null },
	},
	key: ["updated_by", "id"],
	indexes: ["target_id"],
	clustering_order: { "id": "desc" },

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