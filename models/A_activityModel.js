let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
let obj = {
	fields: {
		activity_id: {
			type: "timeuuid",
			default: { "$db_function": "now()" }
		},
		title: { type: "text", default: null },
		type: { type: "text", default: 'Project' },
		created_by: { type: "uuid" },
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
		budget_amount: { type: "text", default: null },
		actual_amount: { type: "text", default: null },
		root_id: { type: "text", default: 'P' },
		child_lists: { type: "set", typeDef: "<text>" },
		phase: { type: "text", default: "Prospecting" }
	},
	key: ["activity_id"],
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
}
if (redis_cache_enabled) _redis.saveRedisIndex(table_name, obj);
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj;