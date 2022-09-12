let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        tips_id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        updated_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        created_by: { type: "uuid", default: "NOT NULL" },
        updated_by: { type: "uuid", default: "NOT NULL" },
        tips_title: { type: "text", default: "NOT NULL" },
        tips_details: { type: "text", default: "NOT NULL" },
        tips_hotkeys: { type: "text", default: "NOT NULL" },
        life_time: { type: "text", default: "NOT NULL" },
        allow_conversation: { type: "set", typeDef: "<text>", default: null }
    },
    key: ["tips_id", "created_by"],
    indexes: ["tips_title", "tips_hotkeys"],
    before_save:    function (instance, options) {
        if (!redis_cache_enabled) return true;
        let totalData = _redis.getInsertProperties(instance, this);
        let pkey = this.key[0];
            _redis.insertRedisCache(table_name, totalData, this, { [pkey]: totalData[pkey] });
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
