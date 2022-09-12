let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
let obj = {
    fields: {
        student_id: { type: "uuid" },
        checkin: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
        checkout: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
        company_id: { type: "text", default: null },
        created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
        created_by: { type: "text", default: null },
        description: { type: "text", default: null },
        parent_id: { type: "text", default: null },
        status: { type: "text", default: null },
        updated_by: { type: "text", default: null },
        updated_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
    },
    key: ["student_id"],
    // indexes: ["type"],
    before_save: function (instance, options) {
        if (!redis_cache_enabled) return true;
        let totalData = _redis.getInsertProperties(instance, this);
        let pkey = this.key[0];
        _redis.insertRedisCache(table_name, totalData, this, { [pkey]: totalData[pkey] });
        return true;
    },
    before_update: function (queryObject, updateValues, options) {
        if (!redis_cache_enabled) return true;
        _redis.updateRedisCache(table_name, queryObject, updateValues, this, options);
        return true;
    },
    before_delete: function (queryObject, options) {
        if (!redis_cache_enabled) return true;
        _redis.deleteRedisCache(table_name, queryObject, this, options);
        return true;
    }
}
if (redis_cache_enabled) _redis.saveRedisIndex(table_name, obj);
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
