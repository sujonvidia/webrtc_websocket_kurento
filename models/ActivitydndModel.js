let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
	fields: {
		id: {
			type: "uuid",
			default: { "$db_function": "uuid()" }
		},
		activity_id: {
			type: "uuid"
		},
		user_id: {
			type: "uuid"
		},
		col_name: { type: "text", default: null },
		col_sl: { type: "int", default: 0 },
		col_type: { type: "text", default: null },
	},
	key: ["id", "activity_id"],
	indexes: ["user_id", "col_type"],
	clustering_order: { "activity_id": "desc" },
	
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