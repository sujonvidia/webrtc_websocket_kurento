let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
    fields: {
        id: { type: "uuid", default: { "$db_function": "uuid()" } },
        created_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        created_by: { type: "uuid", default: "" },
        name: { type: "text", default: "" },
        address: { type: "text", default: "" },
        city: { type: "text", default: "" },
        province: { type: "text", default: "" },
        country: { type: "text", default: "" },
        post_code: { type: "text", default: "" },
        email: { type: "set", typeDef: "<text>", default: null },
        phone: { type: "set", typeDef: "<text>", default: null },
        mother_company_id: { type: "text", default: "" },
        search_txt: { type: "text", default: "" },
        // name +
        // email +
        // phone +
        // address +
        // city +
        // province +
        // country +
        // post_code +
        // mother_company_id(name)
        logo: { type: "text", default: "" },
        is_delete: { type: "set", typeDef: "<text>", default: null },
        is_private: { type: "int", default: 0 },
    },
    key: ["id"],
    indexes: ["search_txt", "is_delete", "is_private", "created_by"],
    
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
