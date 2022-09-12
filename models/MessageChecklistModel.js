let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
    fields: {
        checklist_id: {
            type: "timeuuid",
            default: { "$db_function": "now()" }
        },
        msg_id: {
            type: "timeuuid"
        },
        msg_title: {
            type: "text",
            default: null
        },
        convid: {
            type: "text",
            default: null
        },
        original_ttl: {
            type: "text",
            default: null
        },
        assignedby: {
            type: "text",
            default: null
        },
        assignby_role: {
            type: "text",
            default: null
        },
        alternative_assign_to: {
            type: "text",
            default: null
        },
        assignee_change_reason: {
            type: "text",
            default: null
        },
        Completed_status_updated_by: {
            type: "text",
            default: null
        },
        Request_ttl_by: {
            type: "text",
            default: null
        },
        request_ttl_message: {
            type: "text",
            default: null
        },
        request_ttl_approved_by: {
            type: "text",
            default: null
        },
        request_ttl_time: {
            type: "text",
            default: null
        },
        Is_direct_group: {
            type: "text",
            default: null
        },
        participant_id: {
            type: "set", typeDef: "<text>",
            default: null
        },
        request_repetition: {
            type: "int",
            default: null
        },
        from_user_counter: {
            type: "int",
            default: null
        },
        to_user_counter: {
            type: "int",
            default: null
        },
        request_ttl_approved_date: {
            type: "timestamp",
            default: null
        },
        request_ttl_date: {
            type: "timestamp",
            default: null
        },
        created_by: {
            type: "uuid"
        },
        created_at: {
            type: "timestamp",
            default: {
                "$db_function": "toTimestamp(now())"
            }
        },
        checklist_title: {
            type: "text"
        },
        last_updated_by: {
            type: "text",
            default: null
        },
        last_updated_at: {
            type: "timestamp",
            default: {
                "$db_function": "toTimestamp(now())"
            }
        },
        last_action: {
            type: "text",
            default: null
        },
        last_edited_by: {
            type: "text",
            default: null
        },
        start_due_date: {
            type: "text",
            default: null
        },
        end_due_date: {
            type: "text",
            default: null
        },
        assign_to: {
            type: "text",
            default: null
        },
        privacy: {
            type: "text",
            default: null
        },
        assign_status: {
            type: "text",
            default: null
        },
        assign_decline_note: {
            type: "text",
            default: null
        },
        last_edited_at: {
            type: "timestamp",
            default: null
        },
        checklist_status: {
            type: "tinyint",
            default: 0
        },
        root_conv_id: { type: "text", default: null },
        review_status: {
            type: "tinyint",
            default: 0
        },

    },
    key: ["msg_id", "checklist_id"],
    clustering_order: { "checklist_id": "desc" },
    indexes: ["created_by", "created_at", "checklist_title", "last_updated_by"],
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
if (redis_cache_enabled) _redis.saveRedisIndex(table_name, obj);
// if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
