let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
	fields: {
		col_id: {
			type: "uuid",
			default: { "$db_function": "uuid()" }
		},
		col_title: { type: "text", default: null },
		col_type: { type: "text", default: null },
		col_formula: { type: "text", default: null },
		activity_id: { type: "uuid" },
		created_by: { type: "uuid" },
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		}
	},
	key: ["col_id"],
	indexes: ["activity_id", "created_by"],

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