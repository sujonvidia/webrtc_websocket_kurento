let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        activity_id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        activity_type: { type: "text", default: null },
        activity_title: { type: "text", default: null },
        activity_description: { type: "text", default: null },
        activity_created_by: { type: "uuid" },
        activity_created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        activity_updated_by: { type: "uuid" },
        activity_updated_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        activity_completed_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        activity_start_time: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        activity_end_time: {
            type: "timestamp",
            default: null
        },
        activity_has_reminder: { type: "text", default: null },
        activity_status: { type: "text", default: null },
        activity_priority: { type: "text", default: null },
        activity_is_publish: { type: "tinyint", default: null },
        activity_budget_amount: { type: "text", default: 0 },
        activity_actual_amount: { type: "text", default: null },
        activity_manhour_cost: { type: "text", default: null },
        activity_manhourly_rate: { type: "text", default: null },
        activity_varience: { type: "text", default: null },
        activity_est_hour: { type: "text", default: null },
        activity_est_hourly_rate: { type: "text", default: null },
        activity_actual_hour: { type: "text", default: null },
        activity_actual_hourly_rate: { type: "text", default: null },
        activity_workspace: { type: "text", default: null },
        company_id: { type: "timeuuid" },
        participants: { type: "set", typeDef: "<text>" },
        activity_admin: { type: "set", typeDef: "<text>" },
        activity_observer: { type: "set", typeDef: "<text>" },
        activity_member: { type: "set", typeDef: "<text>" },
        flag_id: { type: "set", typeDef: "<text>" },
        pin_id: { type: "set", typeDef: "<text>" },
        bunit_id: { type: "timeuuid" },
        activity_root_id: { type: "uuid", default: null }
    },
    key: ["activity_id", "company_id", "activity_created_by"],
    indexes: ["activity_type", "activity_title", "activity_description", "activity_created_at", "activity_updated_by", "activity_updated_at", "activity_completed_at", "activity_start_time", "activity_end_time", "activity_has_reminder", "activity_status", "activity_priority", "activity_is_publish", "activity_budget_amount", "activity_actual_amount", "activity_manhour_cost", "activity_manhourly_rate", "activity_varience", "activity_est_hour", "activity_est_hourly_rate", "activity_actual_hour", "activity_actual_hourly_rate", "activity_workspace", "participants", "activity_admin", "activity_observer", "activity_member", "flag_id", "pin_id", "bunit_id", "activity_root_id"],
    clustering_order: { "activity_created_by": "desc" },
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

module.exports = obj
