let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        topic_id: {
            type: "uuid",
            default: { "$db_function": "uuid()" }
        },
        tagged_by: { type: "uuid" },
        conversation_id: { type: "uuid" },
        title: "text",
        tagged_message: { type: "set", typeDef: "<text>", default: null },
        type: {
            type: "text",
            default: null
        },
        visibility: {
            type: "text",
            default: 'visible'
        },
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        }
    },
    key: ["topic_id"],
    indexes: ["tagged_by", "tagged_message"],
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
