let table_name = ((__filename.slice(__dirname.length + 1, -3)).split("Model")[0]).toLowerCase();
let _redis = require('./../utils/redis_scripts');
// _redis.saveRedisIndex(table_name);
let obj = {
  fields: {
    id: {
      type: "uuid",
      default: { "$db_function": "uuid()" }
    },
    createdat: {
      type: "timestamp",
      default: { "$db_function": "toTimestamp(now())" }
    },
    email: "text",
    fullname: "text",
    dept: "text",
    designation: "text",
    account_type: "text",
    phone: { type: "set", typeDef: "<text>" },
    device: { type: "set", typeDef: "<text>" },
    lat: "text",
    log: "text",
    gcm_id: "text",
    fcm_id: { type: "set", typeDef: "<text>" },
    img: "text",
    is_active: {
      type: "int",
      default: 1
    },
    is_delete: {
      type: "int",
      default: 0
    },
    is_busy: {
      type: "int",
      default: 0
    },
    login_total: {
      type: "int",
      default: 0
    },
    last_login: {
      type: "timestamp",
      default: { "$db_function": "toTimestamp(now())" }
    },
    password: "text",
    role: "text",
    access: { type: "set", typeDef: "<int>" },
    company_id: {
      type: "timeuuid"
    },
    reset_id: "text",
    conference_id: "text",
    created_by: { type: "text", default: null },
    updated_by: { type: "text", default: null },
    updated_at: { type: "text", default: null },
    class: { type: "text", default: null },
    section: { type: "text", default: null },
    campus: { type: "text", default: null },
    company: { type: "text", default: null },
    parent_id: { type: "text", default: null },
    student_id: { type: "text", default: null },
    student_list: { type: "set", typeDef: "<text>" },
    parent_list: { type: "set", typeDef: "<text>" },
    relationship: { type: "text", default: null },
    login_id: { type: "text", default: null },
    relationship_map: { type: "map", typeDef: "<text, text>", default: null},
    roll_number: { type: "text", default: null },
    firstname: { type: "text", default: null },
    lastname: { type: "text", default: null },
    phone_optional: { type: "text", default: null },
    
    // company_img: { type: "text", default: null },
  },
  key: ["id"],
  indexes: ["fullname", "gcm_id"],
  // before_find:  function (instance, options) {
  //   if (!redis_cache_enabled) return true;
  //   let totalData = _redis.getInsertProperties(instance, this);
  //   let pkey = this.key[0];
  //     
  //   return true;
  // },
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
if (redis_cache_enabled) model_cache_schema[table_name] = obj;
module.exports = obj
