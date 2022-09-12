let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        user_id: { type: "uuid" },
        conversation_id: { type: "uuid" },
        msg_id: { type: "timeuuid" },
        acl: { type: "text", default: "public-read" },
        bucket: { type: "text", default: "no bucket" },
        file_type: { type: "text", default: "not found" },
        key: { type: "text", default: "not found" },
        location: { type: "text", default: "not found" },
        originalname: { type: "text", default: "not found" },
        file_size: { type: "text", default: "0" },
        is_delete: { type: "int", default: 0 },
        tag_list: { type: "set", typeDef: "<text>" },
        mention_user: { type: "set", typeDef: "<text>" },
        root_conv_id: {type: "text", default: null},
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        secret_user: { type: "set", typeDef: "<text>" },
        is_secret: { type: "boolean", default: false },
        tag_list_with_user: { type: "text", default: 'null' },
    },
    key: ["id","conversation_id"],
    indexes: ["user_id"],
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
