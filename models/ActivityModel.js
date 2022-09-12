let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
module.exports = {
    fields: {
        activity_id: { type: "timeuuid", default: { "$db_function": "now()" } },
        root_id: { type: "text", default: 'N' },
        child_lists: { type: "set", typeDef: "<text>" },
        serial: { type: "text", default: "" },
        type: { type: "text", default: 'Project' },
        title: { type: "text", default: null },
        description: { type: "text", default: null },
        created_by: { type: "uuid" },
        created_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        updated_by: { type: "uuid" },
        updated_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        completed_at: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        start_time: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        end_time: { type: "timestamp", default: { "$db_function": "toTimestamp(now())" } },
        has_reminder: { type: "text", default: "" },
        phase: { type: "text", default: "Prospecting" },
        status: { type: "text", default: "Initiate" },
        priority: { type: "text", default: "Normal" },
        budget_amount: { type: "text", default: "0" },
        actual_amount: { type: "text", default: "0" },
        estimated_hour: { type: "text", default: "0" },
        estimated_rate: { type: "text", default: "0" },
        estimated_cost: { type: "text", default: "0" },
        actual_hour: { type: "text", default: "0" },
        actual_hour_rate: { type: "text", default: "0" },
        actual_cost: { type: "text", default: "0" },
        company_id: { type: "text", default: "" },
        admin_ids: { type: "set", typeDef: "<text>" },
        observer_ids: { type: "set", typeDef: "<text>" },
        participants_ids: { type: "set", typeDef: "<text>" },
        flag_ids: { type: "set", typeDef: "<text>" },
        pin_ids: { type: "set", typeDef: "<text>" },
        milestone: { type: "text", default: "" },
        notification: { type: "text", default: "on" },
        reaction: { type: "set", typeDef: "<text>" }
    },
    key: ["created_by", "activity_id"],
    clustering_order: { "activity_id": "desc" },
    indexes: ["title", "type", "status", "root_id", "child_lists", "priority", "phase"],

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