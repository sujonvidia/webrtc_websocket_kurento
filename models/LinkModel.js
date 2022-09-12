let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
	fields: {
		url_id: {
			type: "timeuuid",
			default: { "$db_function": "now()" }
		},
		created_at: {
			type: "timestamp",
			default: { "$db_function": "toTimestamp(now())" }
		},
		msg_id: { type: "text", default: "null" },
		conversation_id: { type: "uuid" },
		user_id: { type: "uuid" },
		url: { type: "text", },
		title: { type: "text", default: "null" },
		has_delete: { type: "set", typeDef: "<text>" },
		root_conv_id: {type: "text", default: null},
		status: { type: "int", default: 1 },
		secret_user: { type: "set", typeDef: "<text>" },
	},
	key: ["conversation_id", "url_id"],
	indexes: ["created_at", "user_id", "title", "status", "msg_id"],
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
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
