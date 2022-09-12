let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
	fields: {
		issue_tag_id: {
			type: "timeuuid",
			default: { "$db_function": "timeuuid()" }
		},
		tagged_by: { type: "uuid" },
		tag_id: { type: "uuid" },
		conversation_id: { type: "uuid" },
		message_id: { type: "timeuuid" },
		tag_title: { type: "text", default: null },
		mention_users: { type: "set", typeDef: "<text>" },
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		}
	},
	key: ["issue_tag_id", "message_id"],
	indexes: ["tagged_by", "tag_id", "conversation_id", "message_id", "tag_title"],
	clustering_order: {
		"message_id": "desc"
	},
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
