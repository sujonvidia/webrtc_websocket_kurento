var _ = require('lodash');
const fs = require('fs');
const { Console } = require('console');
const isUuid = require('uuid-validate');
var models = require('express-cassandra');
// _queryObject = null;
// _updateValues = null;
// var CryptoJS = require("crypto-js");

get_time_int = function (uuid_str) {
	var uuid_arr = uuid_str.split('-'),
		time_str = [
			uuid_arr[2].substring(1),
			uuid_arr[1],
			uuid_arr[0]
		].join('');
	return parseInt(time_str, 16);
};

// function redis_search(job, indexName, queryString, options, callback, isconsole = false) {
// 	job.searchParams = [indexName, queryString];

// 	searchParams.push('LIMIT');
// 	searchParams.push(options.offset || 0);
// 	searchParams.push(options.limit || 5000);

// 	if (options.sortBy) {
// 		searchParams.push('SORTBY');
// 		searchParams.push('cluster_score');
// 		searchParams.push('DESC');
// 	}

// 	let mark_redis_get = Date.now();
// 	redis_script_manager.run('script-find', job.searchParams, [], function (err, searchResult) {
// 		// redis_script_manager.run('script-find', searchParams, [], function (err, searchResult) {
// 		// redis_client.send_command('FT.SEARCH', searchParams, function (err, searchResult) {
// 		console.log('_caching:find:LUA:sl:', job.countttt, 'now_ms:', Date.now() - mark_redis_get, 'params:', JSON.stringify(job.searchParams));
// 		if (err) {
// 			console.log('nnaa:redis:get_error:', err);
// 		}
// 		searchResult = JSON.parse(searchResult);
// 		var result = [];
// 		for (let obj_key in searchResult) {
// 			let obj = { ['redis_key']: obj_key };
// 			for (const element of searchResult[obj_key]) {
// 				for (let rowkey in element) {
// 					if (job.model_object.fields.hasOwnProperty(rowkey)) {
// 						var field_type = getModelFieldType(job.model_object, rowkey);

// 						if (field_type == 'uuid') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else {
// 								obj[rowkey] = models.uuidFromString(String(element[rowkey]).replace(/_/g, '-'));
// 							}
// 						}
// 						else if (field_type == 'timeuuid') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else {
// 								obj[rowkey] = models.timeuuidFromString(String(element[rowkey]).replace(/_/g, '-'));
// 							}
// 						}
// 						else if (field_type == 'text') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else {
// 								obj[rowkey] = Buffer.from(element[rowkey], 'hex').toString();
// 								// obj[rowkey] = obj[rowkey].replace(/\\/g, '');
// 							}
// 						}
// 						else if (field_type == 'timestamp') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else obj[rowkey] = new Date(parseInt(element[rowkey]));
// 						}
// 						else if (field_type == 'int' || field_type == 'tinyint') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else obj[rowkey] = parseInt(element[rowkey]);
// 						}
// 						else if (field_type == 'set') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else {
// 								let field_typeDef = job.model_object.fields[rowkey]['typeDef'];
// 								obj[rowkey] = element[rowkey];
// 								for (let k = 0; k < element[rowkey].length; k++) {
// 									if (field_typeDef == '<int>') {
// 										obj[rowkey][k] = parseInt(Buffer.from(element[rowkey][k], 'hex').toString());
// 										// obj[rowkey][k] = parseInt(obj[rowkey][k].replace(/\\/g, ''));
// 									} else {
// 										obj[rowkey][k] = Buffer.from(element[rowkey][k], 'hex').toString();
// 										// obj[rowkey][k] = obj[rowkey][k].replace(/\\/g, '');
// 									}

// 								}
// 							}
// 						}
// 						else if (field_type == 'map') {
// 							if (element[rowkey] == 'null') {
// 								obj[rowkey] = null;
// 							}
// 							else obj[rowkey] = JSON.parse(element[rowkey]);
// 						}
// 						else if (field_type == 'boolean') {
// 							if (element[rowkey] == 'null') { obj[rowkey] = null; }
// 							else obj[rowkey] = JSON.parse(element[rowkey]);
// 						}
// 						else {
// 							if (element[rowkey] == 'null') { obj[rowkey] = null; }
// 							else obj[rowkey] = element[rowkey];
// 						}
// 					} else {
// 						if (element[rowkey] == 'null') { obj[rowkey] = null; }
// 						else obj[rowkey] = element[rowkey];

// 					}
// 				}
// 			}
// 			result.push(obj);
// 		}
// 		callback(err, result);
// 	});
// }

function redis_search(job, indexName, queryString, options, callback, isconsole = false) {
	const searchParams = [indexName, queryString];

	searchParams.push('LIMIT');
	searchParams.push(options.offset || 0);
	searchParams.push(options.limit || 5000);

	if (options.sortBy) {
		searchParams.push('SORTBY');
		searchParams.push('cluster_score');
		searchParams.push('DESC');
	}

	// let mark_redis_get = Date.now();
	redis_client.send_command('FT.SEARCH', searchParams, function (err, searchResult) {
	// redis_script_manager.run('script-find', searchParams, [], function (err, searchResult) {
		// let mark_redis_diff = Date.now() - mark_redis_get;
		// if(mark_redis_diff>100) 
		// console.log('_caching:find:LUA:sl:', job.countttt, 'now_ms:', mark_redis_diff, 'tbl:', job.table_name, 'qstr:', job.redis_query_str);
		if (err) {
			console.log('nnaa:redis:get_error:', err);
		}
		// searchResult = JSON.parse(searchResult);
		var result = [];
		if (searchResult && searchResult.length > 0) {
			// const totalNumberOfDocs = searchResult[0];
			if (searchResult.length > 1) {
				for (let i = 2; i < searchResult.length; i += 2) {
					let obj = { ['redis_key']: searchResult[i - 1] };
					for (let j = 0; j < searchResult[i].length; j += 2) {
						let rowkey = searchResult[i][j];
						if (job.model_object.fields.hasOwnProperty(rowkey)) {
							var field_type = getModelFieldType(job.model_object, rowkey);

							if (field_type == 'uuid') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else {
									obj[searchResult[i][j]] = models.uuidFromString(String(searchResult[i][j + 1]).replace(/_/g, '-'));
								}
							}
							else if (field_type == 'timeuuid') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else {
									obj[searchResult[i][j]] = models.timeuuidFromString(String(searchResult[i][j + 1]).replace(/_/g, '-'));
								}
							}
							else if (field_type == 'text') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else {
									obj[searchResult[i][j]] = Buffer.from(searchResult[i][j + 1], 'hex').toString();
									// obj[searchResult[i][j]] = searchResult[i][j + 1].replace(/\\/g, '');
								}
							}
							else if (field_type == 'timestamp') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else obj[searchResult[i][j]] = new Date(parseInt(searchResult[i][j + 1]));
							}
							else if (field_type == 'int' || field_type == 'tinyint') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else obj[searchResult[i][j]] = parseInt(searchResult[i][j + 1]);
							}
							else if (field_type == 'set') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else {
									let field_typeDef = job.model_object.fields[rowkey]['typeDef'];
									obj[searchResult[i][j]] = JSON.parse(searchResult[i][j + 1]);
									for (let k = 0; k < obj[searchResult[i][j]].length; k++) {
										if (field_typeDef == '<int>') {
											obj[searchResult[i][j]][k] = parseInt(Buffer.from(obj[searchResult[i][j]][k], 'hex').toString());
											// obj[searchResult[i][j]][k] = parseInt(obj[searchResult[i][j]][k].replace(/\\/g, ''));
										} else {
											obj[searchResult[i][j]][k] = Buffer.from(obj[searchResult[i][j]][k], 'hex').toString();
											// obj[searchResult[i][j]][k] = obj[searchResult[i][j]][k].replace(/\\/g, '');
										}

									}
								}
							}
							else if (field_type == 'map') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else obj[searchResult[i][j]] = JSON.parse(searchResult[i][j + 1]);
							}
							else if (field_type == 'boolean') {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else obj[searchResult[i][j]] = JSON.parse(searchResult[i][j + 1]);
							}
							else {
								if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
								else obj[searchResult[i][j]] = searchResult[i][j + 1];
							}
						} else {
							if (searchResult[i][j + 1] == 'null') { obj[searchResult[i][j]] = null; }
							else obj[searchResult[i][j]] = searchResult[i][j + 1];

						}
					}
					result.push(obj);
				}

			}
		}
		callback(err, result);
	});
}
get_date_obj = function (uuid_str) {
	var int_time = this.get_time_int(uuid_str) - 122192928000000000,
		int_millisec = Math.floor(int_time / 10000);
	return new Date(int_millisec);
};

var async = require('async');
const { reject } = require('async');

client_side_redis2 = async.queue(function (job, next) {
	switch (job.type) {
		case 'getConversationMessages':
			models.instance.Messages.find({ conversation_id: models.uuidFromString(job.index) }, { raw: true, allow_filtering: true }, function (error, allMessages) {
				allMessages = _.orderBy(allMessages, ["created_at"], ["desc"]);
				job.resolve(allMessages);
				next();

			});
			break;

		case 'getConversationFiles':
			models.instance.File.find({ conversation_id: models.uuidFromString(job.index) }, { raw: true, allow_filtering: true }, function (err, files) {
				job.resolve(files);
				next();
			})
			break;
		case 'getAllTags': {
			models.instance.UserTag.find({}, function (err, tags) {
				job.resolve(tags);
				next();
			});
			break;
		}
	}
}, 1);

function getModelFieldType(model_object, rowkey) {
	if (model_object.fields[rowkey][['type']]) { var field__type = model_object.fields[rowkey]['type']; }
	else var field__type = model_object.fields[rowkey];
	return field__type;
}
let dcc = 0;
function isHex(str) {
	return /^[A-F0-9]+$/i.test(str)
}
// function replace_hex_val(_qr, _hex, _str, _rowkey, _cass, _dcc) {
// 	let that = this;
// 	console.log(`funn:exe:${_dcc}:rowkey:${_rowkey}:hex:${_hex}:str:${_str}:qr:${JSON.stringify(_qr)}`);

// 	_cass.findOne(_qr, function (err, john) {
// 		console.log(`funn:after:${_dcc}:rowkey:${_rowkey}:hex:${_hex}:str:${_str}:qr:${JSON.stringify(_qr)}`);
// 		if (err) throw err;
// 		if (john) {
// 			let jsh = john.toJSON();
// 			var index = john[_rowkey].indexOf(_hex);
// 			if (index !== -1) {
// 				john[_rowkey][index] = _str;
// 			}
// 			john.save(function (err) {
// 				if (err) console.log(err);
// 				else console.log('Yuppiie!');

// 			});
// 		}
// 	});

// }
// function replace_hex_val(qr1, hex1, str1, rowkey1, cass1, dcc1) {
// 	// let dcc1 = dcc;
// 	console.log(`funn:exe:${dcc1}:rowkey:${rowkey1}:hex:${hex1}:str:${str1}:qr:${JSON.stringify(qr1)}`);

// 	cass1.findOne(qr1, function (err, john) {
// 		console.log(`funn:after:${dcc1}:rowkey:${rowkey1}:hex:${hex1}:str:${str1}:qr:${JSON.stringify(qr1)}`);
// 		// if (err) throw err;
// 		// if (john) {
// 		// 	let jsh = john.toJSON();
// 		// 	var index = john[rowkey].indexOf(hex1);
// 		// 	if (index !== -1) {
// 		// 		john[rowkey][index] = str1;
// 		// 	}
// 		// 	// john.save(function (err) {
// 		// 	// 	if (err) console.log(err);
// 		// 	// 	else console.log('Yuppiie!');
// 		// 	// 	next();
// 		// 	// });
// 		// }
// 	});
// 	// });
// }
delss = [];

function import_redis_db(table_name, instance_row, cass = false) { // for hmset
	let each_row = _.cloneDeep(instance_row);
	let model_object = model_cache_schema[table_name];
	let obj_data = { ['cluster_score']: 0 };
	let clustering_key = ''; let partition_key = '';

	for (let rowkey in each_row) {
		if (model_object.fields.hasOwnProperty(rowkey)) {
			var field_type = getModelFieldType(model_object, rowkey);
			if (field_type == 'uuid' || field_type == 'timeuuid') {
				if (each_row[rowkey] != null) {
					// obj_data[rowkey] = String(each_row[rowkey]);
					obj_data[rowkey] = String(each_row[rowkey]).replace(/-/g, '_');
					// obj_data[rowkey] = escapeSpecialCaseChar(String(each_row[rowkey]));
				}
				else obj_data[rowkey] = 'null';
			}
			else if (field_type == 'text') {
				if (each_row[rowkey] != null) obj_data[rowkey] = Buffer.from(String(each_row[rowkey])).toString('hex');
				// if (each_row[rowkey] != null) obj_data[rowkey] = String(each_row[rowkey]);
				// if (each_row[rowkey] != null) obj_data[rowkey] = escapeSpecialCaseChar(String(each_row[rowkey]));
				else obj_data[rowkey] = 'null';
			}
			else if (field_type == 'timestamp') {
				if (each_row[rowkey] != null) obj_data[rowkey] = new Date(each_row[rowkey]).valueOf();
				else obj_data[rowkey] = 'null';
			}
			else if (field_type == 'set') {
				if (each_row[rowkey] != null) {
					for (let k = 0; k < each_row[rowkey].length; k++) {
						each_row[rowkey][k] = Buffer.from(String(each_row[rowkey][k])).toString('hex');

						// each_row[rowkey][k] = String(each_row[rowkey][k]);
						// each_row[rowkey][k] = escapeSpecialCaseChar(String(each_row[rowkey][k]));
					}
					obj_data[rowkey] = JSON.stringify(each_row[rowkey]);
					// importMulti.sadd([table_name, rowkey, partition_key, clustering_key].join(':'), each_row[rowkey]);
					// obj_data[rowkey] = each_row[rowkey].join(',');
				}
				else {
					obj_data[rowkey] = 'null';
				}

			}
			else if (field_type == 'map') {
				if (each_row[rowkey] != null) obj_data[rowkey] = JSON.stringify(each_row[rowkey]);
				// if (each_row[rowkey] != null) obj_data[rowkey] = (each_row[rowkey]);
				else obj_data[rowkey] = 'null';
			}
			else if (field_type == 'int' || field_type == 'tinyint' || field_type == 'boolean') {
				if (each_row[rowkey] != null) obj_data[rowkey] = String(each_row[rowkey]);
				else obj_data[rowkey] = 'null';
			}
			else {
				if (each_row[rowkey] != null) obj_data[rowkey] = String(each_row[rowkey]);
				else obj_data[rowkey] = 'null';
			}

			if (model_object.key.indexOf(rowkey) == 0) {
				partition_key = String(each_row[rowkey]);
			}
			if (model_object.key.indexOf(rowkey) == 1) {
				clustering_key = String(each_row[rowkey]);
				if (field_type == 'timeuuid') obj_data['cluster_score'] = get_date_obj(clustering_key).valueOf();
			}
		}
	}
	return [[table_name, partition_key, clustering_key].join(':'), obj_data];

}
bbb_result_err = [];
function cass_live_query(job, next = false) {
	job.mark_cass = Date.now();
	job._this._execute_table_query(job.query, job.queryParams, job.queryOptions, function (err, results) {
		if (err) {
			job.callback(job.buildError('model.find.dberror', err));
			if (next) next();
			return;
		}

		console.log(200, results.rows.length, job._this._properties.name)
		// if(results.rows.length && job._this._properties.name == 'messages'){
		// 	for(let i = 0; i<results.rows.length; i++){
		// 		console.log(200,results.rows[i]);
		// 		if(results.rows[i].created_at > '2020-12-24T12:13:41.046Z'){
		// 			var bytes  = CryptoJS.AES.decrypt(results.rows[i].msg_body, 'freeli_01');
		// 			results.rows[i]['msg_body'] = bytes.toString(CryptoJS.enc.Utf8);
		// 		}
		// 	}
		// }
		// if(results.rows.length && job._this._properties.name == 'messages'){
		// 	for(let i = 0; i<results.rows.length; i++){
		// 		console.log(200,results.rows[i]);
		// 		if(results.rows[i].created_at > '2020-12-24T12:13:41.046Z'){
		// 			console.log(results.row[i].msg_body);
		// 		}
		// 	}
		// }
		if (!job.options.raw) {
			var ModelConstructor = job._this6._properties.get_constructor();
			results = results.rows.map(function (res) {
				delete res.columns;
				var o = new ModelConstructor(res);
				o._modified = {};
				return o;
			});
		} else {
			results = results.rows.map(function (res) {
				delete res.columns;
				return res;
			});
		}

		if (job.cass_need) {
			job.callback(null, results);
			// console.log('cache:select:live:sl:', job.countttt, Date.now() - job.mark_cass, 'ms', 'tbl:', job.table_name, 'row:', results.length, 'q:', JSON.stringify(job.query));

		} else {
			job.now_cass_get = Date.now() - job.mark_cass;
			bbb_cassa_select_total += job.now_cass_get;
			job.win = job.now_redis_parse < job.now_cass_get ? 'redis' : 'cassa';
			console.log(`_caching:select:sl:${job.countttt}, cass_this:${job.now_cass_get}ms, redis_this:${job.now_redis_parse}ms, cass_total:${bbb_cassa_select_total}ms, redis_total:${bbb_redis_select_total}ms, tbl:${job.table_name}`);

			// job.bbb_result_cass = results.length;

			// if (job.bbb_result_cass != job.bbb_result_redis && job.countttt==countttt) {
			// 	bbb_result_err.push(job);
			// }

		}
		// ======================= redis =============================================


		// if (results.length && job.table_name == 'messages') {
		// 	var mcc = true;
		// 	if (!_queryObject['$limit']) mcc = false;
		// 	if (mcc) {
		// 		let importMulti = redis_client.multi();
		// 		results.forEach(function (each_row) {
		// 			let rdata = import_redis_db(job.table_name, each_row);
		// 			importMulti.hmset(rdata[0], rdata[1]);
		// 		});
		// 		importMulti.exec(function (err, exec_results) {
		// 			next();
		// 		});
		// 	} else {
		// 		next();
		// 	}

		// } else {
		if (next) next();
		// }
	});
}

function escapeSpecialCaseChar(text) {
	return text.replace(/[\W)]/g, '\\$&');
}
// let ss = escapeSpecialCaseChar(`,.<>{}[]"':;!@#$%^&*()-+=~ ab c_yn`);
// console.log(ss);
function redis_query_param(rowval, field_type, job, operator) {
	var qstr = 'null';

	if (field_type == 'uuid' || field_type == 'timeuuid') {
		if (Array.isArray(rowval)) {
			let arrin = [];
			for (var i = 0, len = rowval.length; i < len; i++) {
				let cstr = String(rowval[i]);
				if (cstr) {
					// qstr = escapeSpecialCaseChar(cstr);
					qstr = cstr.replace(/-/g, '_');
					arrin.push(qstr);
					// if (job.primay_index > -1) {
					// 	job.lua_keys.push({ query_type: 'in', primay_index:job.primay_index, field_type, keys: cstr });
					// }
				}
			}

			qstr = arrin.join('|');
		} else {
			if (rowval != null) {
				qstr = String(rowval).replace(/-/g, '_');
				// qstr = escapeSpecialCaseChar(String(rowval));
			}
		}
	}
	else if (field_type == 'text') {
		if (Array.isArray(rowval)) {
			let arrin = [];
			for (var i = 0, len = rowval.length; i < len; i++) {
				let cstr = String(rowval[i]);
				if (cstr) {
					qstr = Buffer.from(cstr).toString('hex');
					// qstr = escapeSpecialCaseChar(cstr);
					arrin.push(qstr);
					// if (job.primay_index > -1) {
					// 	job.lua_keys.push({ query_type: 'in', primay_index:job.primay_index, field_type, keys: cstr });
					// }
				}
			}
			qstr = arrin.join('|');
		} else {
			if (rowval != null) {
				qstr = Buffer.from(String(rowval)).toString('hex');
				// qstr = escapeSpecialCaseChar(String(rowval));
			}
		}

	}
	else if (field_type == 'timestamp') {
		if (rowval != null) {
			qstr = new Date(parseInt(String(rowval))).valueOf();
		}
	}
	else if (field_type == 'set') {
		if (rowval != null) {
			qstr = Buffer.from(String(rowval)).toString('hex');
			// qstr = escapeSpecialCaseChar(String(rowval));
		}
	}
	else if (field_type == 'int' || field_type == 'tinyint' || field_type == 'boolean') {
		if (rowval != null) { qstr = String(rowval); }
	}
	else {
		if (rowval != null) { qstr = String(rowval); }
	}
	return qstr;
}
function redis_query_builder(job) {
	job.cass_need = false;
	job.lua_keys = {
		'operators': [],
		'keys': {
			'0': '',
			'1': ''
		},
	};
	if (!job.queryObject['$like']) {
		job.redis_query_str = [];
		for (let rowkey in job.queryObject) {
			if (rowkey != '$limit' && rowkey != '$orderby') {
				if (job.queryObject[rowkey] === "") {
					job.cass_need = true;
				} else {
					if (_.isPlainObject(job.queryObject[rowkey])) { // object value
						if (job.queryObject[rowkey]['$lt']) { // range query
							var msg_score = 0;
							if (job.cluster_key) { msg_score = get_date_obj(String(job.queryObject[rowkey]['$lt'])).valueOf(); }
							job.redis_query_str.push(`@cluster_score:[-inf (${msg_score}]`);

						}
						else if (job.queryObject[rowkey]['$eq']) {
							var field_type;
							if (job.model_object.fields.hasOwnProperty(rowkey)) { field_type = getModelFieldType(job.model_object, rowkey); }
							if (field_type) {
								job.primay_index = job.model_object.key.indexOf(rowkey);
								var qstr = redis_query_param(job.queryObject[rowkey]['$eq'], field_type, job);
								job.redis_query_str.push(`@${rowkey}:${qstr}`);

								if (job.primay_index > -1) {
									job.lua_keys['operators'].push('eq');
									job.lua_keys['keys'][job.primay_index] = job.queryObject[rowkey]['$eq'];

								}
							}

						}
						else if (job.queryObject[rowkey]['$in']) {
							// else if (job.table_name != 'messages' && job.queryObject[rowkey]['$in']) {
							var field_type;
							if (job.model_object.fields.hasOwnProperty(rowkey)) {
								field_type = getModelFieldType(job.model_object, rowkey);
							}
							if (field_type) {
								job.primay_index = job.model_object.key.indexOf(rowkey);
								var qstr = redis_query_param(job.queryObject[rowkey]['$in'], field_type, job, 'in');
								job.redis_query_str.push(`@${rowkey}:(${qstr})`);
								if (job.primay_index > -1) {
									job.lua_keys['operators'].push('in');
									job.lua_keys['keys'][job.primay_index] = job.queryObject[rowkey]['$in'];
								}
							}
						}
						else if (job.queryObject[rowkey]['$contains']) {
							// else if (job.table_name != 'messages' && job.queryObject[rowkey]['$contains']) {
							var field_type;
							if (job.model_object.fields.hasOwnProperty(rowkey)) {
								field_type = getModelFieldType(job.model_object, rowkey);
							}
							if (field_type) {
								var qstr = redis_query_param(job.queryObject[rowkey]['$contains'], field_type, job);
								job.redis_query_str.push(`@${rowkey}:${qstr}*`);
							}

						}
						else {
							job.cass_need = true;
						}
					} else { // plain value
						if (job.model_object.fields.hasOwnProperty(rowkey)) { var field_type = getModelFieldType(job.model_object, rowkey); }
						job.primay_index = job.model_object.key.indexOf(rowkey);
						var qstr = redis_query_param(job.queryObject[rowkey], field_type, job);
						job.redis_query_str.push(`@${rowkey}:${qstr}`);
						if (job.primay_index > -1) {
							job.lua_keys['operators'].push('eq');
							job.lua_keys['keys'][job.primay_index] = job.queryObject[rowkey];
						}
					}
				}

			}
		}
		// if (job.table_name == 'messages' && !job.queryObject['$limit']) { job.cass_need = true; }
	} else {
		job.cass_need = true;
	}
	if (job.redis_query_str.length > 0) {
		if (job.redis_query_str.length > 1) { job.redis_query_str = job.redis_query_str.join(' '); } else { job.redis_query_str = job.redis_query_str[0]; }
	} else {
		job.redis_query_str = '*';
	}
	return;
}
const now = (unit) => {

	const hrTime = process.hrtime();

	switch (unit) {

		case 'milli':
			return hrTime[0] * 1000 + hrTime[1] / 1000000;

		case 'micro':
			return hrTime[0] * 1000000 + hrTime[1] / 1000;

		case 'nano':
			return hrTime[0] * 1000000000 + hrTime[1];

		default:
			return now('nano');
	}

};
countttt = -1; countttt_r = 0; countttt_c = 0; counttttcs = 0;

redis_pending_jobs = [];

bbb_redis_select_total = 0; bbb_cassa_select_total = 0;
bbb_redis_up_total = 0; bbb_cassa_up_total = 0;
bbb_redis_del_total = 0; bbb_cassa_del_total = 0;
bbb_redis_insert_total = 0; bbb_cassa_insert_total = 0;

function searchRedisCache(job, next) {
	try {
		if (job) {
			job.model_object = job._this._properties.schema;
			job.table_name = job._this._properties.table_name;
			job.partitionkey = job.model_object.key[0];
			job.cluster_key = false; if (job.model_object.key.length > 1) { job.cluster_key = job.model_object.key[1]; }
			job.index = ''; if (job.queryObject[job.partitionkey]) { job.index = getPropertyEq(job.queryObject[job.partitionkey]); }

			redis_query_builder(job);
			if (job.cass_need == false && job.redis_query_str && redis_client && redis_client_connected) {
				// var mark_redis_parse = Date.now();
				redis_search(job, `idx:${job.table_name}`, job.redis_query_str, { sortBy: true, limit: job.queryObject['$limit'] }, function (err, result_redis) {
					job.callback(null, result_redis);
					job.now_redis_parse = Date.now() - job.bbb_queue_start;
					bbb_redis_select_total += job.now_redis_parse;

					// console.log(`_caching:select:redis:sl: ${job.countttt}, now: ${job.now_redis_parse}ms, total: ${bbb_redis_select_total}ms, tbl:${job.table_name}`);
					cass_live_query(job); // iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
					// next();
				});
				next();
			} else {
				cass_live_query(job, next);
			}
		} else {
			cass_live_query(job, next);
		}

	} catch (err) {
		console.log('cache::error::', err);
		next();
	}
}

function updateRedisCacheJob(job, next) {
	try {
		if (job) {
			job._updateValues = _.cloneDeep(job.updateValues);
			job.partitionkey = job.model_object.key[0];
			job.cluster_key = false; if (job.model_object.key.length > 1) { job.cluster_key = job.model_object.key[1]; }
			job.index = ''; if (job.queryObject.hasOwnProperty(job.partitionkey)) { job.index = getPropertyEq(job.queryObject[job.partitionkey]); }

			if (job.index != '' && redis_client && redis_client_connected) {
				redis_query_builder(job);
				if (job.redis_query_str) {
					// job.redis_keys = [];
					// if (job.lua_keys['operators'].indexOf('in') > -1) {
					// 	if (Array.isArray(job.lua_keys['keys']['0'])) {
					// 		for (let ii = 0; ii < job.lua_keys['keys']['0'].length; ii++) {
					// 			job.redis_keys.push([job.table_name, String(job.lua_keys['keys']['0'][ii]), String(job.lua_keys['keys']['1'])].join(':'));
					// 		}
					// 	}
					// 	if (Array.isArray(job.lua_keys['keys']['1'])) {
					// 		for (let ii = 0; ii < job.lua_keys['keys']['1'].length; ii++) {
					// 			job.redis_keys.push([job.table_name, String(job.lua_keys['keys']['0']), String(job.lua_keys['keys']['1'][ii])].join(':'));
					// 		}
					// 	}
					// } else {
					// 	job.redis_keys.push([job.table_name, String(job.lua_keys['keys']['0']), String(job.lua_keys['keys']['1'])].join(':'));
					// }

					let updateValuesNew = {};
					for (let rowkey in job._updateValues) {
						let field_type = getModelFieldType(job.model_object, rowkey);
						if (field_type == 'uuid' || field_type == 'timeuuid') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = String(job._updateValues[rowkey]).replace(/-/g, '_');
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else if (field_type == 'text') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = Buffer.from(String(job._updateValues[rowkey])).toString('hex');
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else if (field_type == 'timestamp') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = new Date(job._updateValues[rowkey]).valueOf();
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else if (field_type == 'set') {
							if (job._updateValues[rowkey] != null) {
								if (_.isPlainObject(job._updateValues[rowkey])) {
									for (let rk in job._updateValues[rowkey]) {
										for (let i = 0; i < job._updateValues[rowkey][rk].length; i++) {
											job._updateValues[rowkey][rk][i] = Buffer.from(String(job._updateValues[rowkey][rk][i])).toString('hex');
										}
									}
								} else {
									for (let i = 0; i < job._updateValues[rowkey].length; i++) {
										job._updateValues[rowkey][i] = Buffer.from(String(job._updateValues[rowkey][i])).toString('hex');
									}
								}
								updateValuesNew[rowkey + '@@' + field_type] = job._updateValues[rowkey];
							}
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else if (field_type == 'map') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = job._updateValues[rowkey];
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else if (field_type == 'int' || field_type == 'tinyint') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = job._updateValues[rowkey];
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
							// if (each_row[rowkey] != null) obj_data[rowkey] = String(each_row[rowkey]);
							// else obj_data[rowkey] = 'null';
						}
						else if (field_type == 'boolean') {
							if (job._updateValues[rowkey] != null) updateValuesNew[rowkey + '@@' + field_type] = job._updateValues[rowkey];
							else updateValuesNew[rowkey + '@@' + field_type] = 'null';
						}
						else {
							// if (each_row[rowkey] != null) obj_data[rowkey] = String(each_row[rowkey]);
							// else obj_data[rowkey] = 'null';
						}

						// if (job.model_object.key.indexOf(rowkey) == 0) {
						// 	partition_key = String(each_row[rowkey]);
						// }
						if (job.model_object.key.indexOf(rowkey) == 1) {
							let clustering_key = String(job._updateValues[rowkey]);
							if (field_type == 'timeuuid') updateValuesNew['cluster_score' + '@@' + field_type] = get_date_obj(clustering_key).valueOf();
						}
					}
					let updateValuesNewObj = JSON.stringify(updateValuesNew); // fs.writeFileSync("./stdout.log", redisKeysObj);
					// let redisKeysObj = JSON.stringify(job.redis_keys); // fs.writeFileSync("./stdup.log", updateValuesNewObj);

					const searchParams = [`idx:${job.table_name}`, job.redis_query_str];

					searchParams.push('LIMIT');
					searchParams.push(0);
					searchParams.push(10000);
					searchParams.push('NOCONTENT');

					// let objkey = Object.keys(updateValuesNew);
					// searchParams.push('RETURN');
					// searchParams.push(objkey.length);
					// for(let ii=0;ii<objkey.length;ii++){
					// 	searchParams.push(objkey[ii].split('@@')[0]);
					// }

					let mark_redis_up_lua = Date.now();
					redis_script_manager.run('update-new3', searchParams, [updateValuesNewObj], function (err, result) {
						job.bbb_redis_up_diff = Date.now() - mark_redis_up_lua;
						bbb_redis_up_total += job.bbb_redis_up_diff;
						console.log(`_caching:redis:update:sl:${job.countttt}, this: ${job.bbb_redis_up_diff}ms, total: ${bbb_redis_up_total}ms, tbl:${job.table_name}`);
						job.resolve();
						////// next();
						
						// let mark_redis_up_lua2 = Date.now();
						// redis_script_manager.run('update-new2', searchParams, [updateValuesNewObj,redisKeysObj], function (err, result) {
						// 	job.bbb_redis_up_diff2 = Date.now() - mark_redis_up_lua2;
						// 	// bbb_redis_up_total += job.bbb_redis_up_diff;
						// 	console.log(`_caching:update2:sl:${job.countttt}, this: ${job.bbb_redis_up_diff2}ms, total: ${bbb_redis_up_total}ms, tbl:${job.table_name}`);
							
						// 	// let mark_redis_up_lua3 = Date.now();
						// 	// redis_script_manager.run('script-update', searchParams, [updateValuesNewObj, redisKeysObj], function (err, result) {
						// 	// 	job.bbb_redis_up_diff3 = Date.now() - mark_redis_up_lua3;
						// 	// 	// bbb_redis_up_total += job.bbb_redis_up_diff2;
						// 	// 	console.log(`_caching:update3:sl:${job.countttt}, now: ${job.bbb_redis_up_diff3}ms, total: ${bbb_redis_up_total}ms, tbl:${job.table_name}`);
						// 	// 	// job.resolve();
						// 	// 	// next();
						// 	// });
						// });
					});


					next();
				} else {
					job.resolve();
					next();
				}
			} else {
				job.resolve();
				next();
			}
		} else {
			job.resolve();
			next();
		}

	} catch (err) {
		console.log('cache::error::', err);
		job.resolve();
		next();
	}

}
function deleteRedisCacheJob(job, next) {
	try {
		if (job) {
			job.partitionkey = job.model_object.key[0];
			job.cluster_key = false; if (job.model_object.key.length > 1) { job.cluster_key = job.model_object.key[1]; }
			job.index = ''; if (job.queryObject.hasOwnProperty(job.partitionkey)) { job.index = getPropertyEq(job.queryObject[job.partitionkey]); }

			if (job.index != '' && redis_client && redis_client_connected) {
				redis_query_builder(job);
				if (job.redis_query_str) {
					let mark_redis_del_lua = Date.now();
					redis_script_manager.run('script-delete', [`idx:${job.table_name}`], [job.redis_query_str], function (err, result) {
						job.bbb_redis_del_diff = Date.now() - mark_redis_del_lua;
						bbb_redis_del_total += job.bbb_redis_del_diff;
						console.log(`_caching:redis:delete:sl:${job.countttt}, this: ${job.bbb_redis_del_diff}ms, total:${bbb_redis_del_total}ms, tbl:${job.table_name}`);
						job.resolve();
						// next();
					});
					next();
				} else {
					job.resolve();
					next();
				}
			} else {
				job.resolve();
				next();
			}
		} else {
			job.resolve();
			next();
		}

	} catch (err) {
		console.log('cache::error::', err);
		job.resolve();
		next();
	}

}
function insertRedisCacheJob(job, next) {
	try {
		if (job) {
			job.partitionkey = job.model_object.key[0];
			job.cluster_key = false; if (job.model_object.key.length > 1) { job.cluster_key = job.model_object.key[1]; }
			job.index = ''; if (job.queryObject.hasOwnProperty(job.partitionkey)) { job.index = getPropertyEq(job.queryObject[job.partitionkey]); }

			if (job.index != '' && redis_client && redis_client_connected) { // partition key check
				let rdata = import_redis_db(job.table_name, job.data_object);
				// console.log(countttt, `cache:insert:redis`, job.table_name, 'q:', rdata[0], JSON.stringify(rdata[1]) );
				let mark_redis_insert_lua = Date.now();
				redis_client.hmset(rdata[0], rdata[1], function (err, listwithscores) {
					job.bbb_redis_insert_diff = Date.now() - mark_redis_insert_lua;
					bbb_redis_insert_total += job.bbb_redis_insert_diff;
					console.log(`_caching:redis:insert:sl:${job.countttt}, this: ${job.bbb_redis_insert_diff}ms, total:${bbb_redis_insert_total}ms, tbl:${job.table_name}}`);
					job.resolve();
					next();
				});

				// let jj = JSON.stringify(rdata[1]);
				// console.log(jj);
				// redis_script_manager.run('script-insert', [rdata[0]], [jj], function (err, searchResult) {
				// 	console.log('caching:insert:sl:', searchResult);
				// 	job.resolve();
				// 	next();
				// });
			} else {
				job.resolve();
				next();
			}
		}
		else {
			job.resolve();
			next();
		}

	} catch (err) {
		console.log('cache::error::', err);
		job.resolve();
		next();
	}
}

// function updateCassandraJob(job, next) {
// 	try {
// 		if (job) {
// 			job._this._execute_table_query(job.query, job.finalParams, job.queryOptions, function (err, results) {
// 				next();
// 				if (typeof job.callback === 'function') {
// 					if (err) {
// 						job.callback(job.buildError('model.update.dberror', err));
// 						// next();
// 						return;
// 					}
// 					if (typeof job.schema.after_update === 'function' && job.schema.after_update(_queryObject, _updateValues, job.options) === false) {
// 						job.callback(job.buildError('model.update.after.error'));
// 						// next();
// 						return;
// 					}
// 					job.callback(null, results);
// 					// next();
// 					console.log('queuesys:cassandra:update', countttt);
// 				} else if (err) {
// 					// next();
// 					throw job.buildError('model.update.dberror', err);
// 				} else if (typeof job.schema.after_update === 'function' && job.schema.after_update(_queryObject, _updateValues, job.options) === false) {
// 					// next();
// 					throw job.buildError('model.update.after.error');
// 				}
// 				// next();
// 			});
// 		}
// 		else {

// 			next();
// 		}

// 	} catch (err) {
// 		console.log('cache:update:error::', err.message);
// 		next();
// 	}
// }
// function insertCassandraJob(job, next) {
// 	try {
// 		if (job) {
// 			job._this.constructor._execute_table_query(job.query, job.finalParams, job.queryOptions, function (err, result) {
// 				next();
// 				if (typeof job.callback === 'function') {
// 					if (err) {
// 						job.callback(job.buildError('model.save.dberror', err));
// 						// next();
// 						return;
// 					}
// 					if (!job.options.if_not_exist || result.rows && result.rows[0] && result.rows[0]['[applied]']) {
// 						job._this7._modified = {};
// 					}
// 					if (typeof job.schema.after_save === 'function' && job.schema.after_save(job._this7, job.options) === false) {
// 						job.callback(job.buildError('model.save.after.error'));
// 						// next();
// 						return;
// 					}
// 					job.callback(null, result);
// 					// next();
// 				} else if (err) {
// 					// next();
// 					throw job.buildError('model.save.dberror', err);
// 				} else if (typeof job.schema.after_save === 'function' && job.schema.after_save(job._this7, job.options) === false) {
// 					// next();
// 					throw job.buildError('model.save.after.error');
// 				}
// 				// next();
// 			});
// 		}
// 		else {
// 			next();
// 		}

// 	} catch (err) {
// 		console.log('cache:save:error::', err.message);
// 		next();
// 	}
// }


function CQLQuery(job, next) {
	// let mark_redis_up_cass = Date.now();
	job._this._properties.cql.execute(job.query, job.params, job.options, function (err1, result) {
		if (err1 && err1.code === 8704) {
			job._this2.execute_definition_query(job.query, job.callback);
		} else {
			job.callback(err1, result);
		}
		if (job.firstWord == 'update') {
			job.bbb_cassa_up_diff = Date.now() - job.bbb_queue_start;
			bbb_cassa_up_total += job.bbb_cassa_up_diff;
			console.log(`_caching:cassa:update:sl:${job.countttt}, this: ${job.bbb_cassa_up_diff}ms, total: ${bbb_cassa_up_total}ms`);
		}
		if (job.firstWord == 'delete') {
			job.bbb_cassa_del_diff = Date.now() - job.bbb_queue_start;
			bbb_cassa_del_total += job.bbb_cassa_del_diff;
			console.log(`_caching:cassa:delete:sl:${job.countttt}, this: ${job.bbb_cassa_del_diff}ms, total: ${bbb_cassa_del_total}ms`);
		}
		if (job.firstWord == 'insert') {
			job.bbb_cassa_insert_diff = Date.now() - job.bbb_queue_start;
			bbb_cassa_insert_total += job.bbb_cassa_insert_diff;
			console.log(`_caching:cassa:insert:sl:${job.countttt}, this: ${job.bbb_cassa_insert_diff}ms, total: ${bbb_cassa_insert_total}ms`);
		}
		
	});
	next();

}
function CQLJob(job, next) {
	job.firstWord = job.query.replace(/ .*/, '').toLowerCase();
	// if (firstWord.toLowerCase() == 'select') {
	// 	searchRedisDirect(job).then((res) => {
	// 		if (res.cass_need) {
	// 			CQLQuery(job, next);
	// 		} else {
	// 			job.callback(null, { rows: res.result_redis });
	// 			next();
	// 		}
	// 	})
	// }
	// else if (firstWord.toLowerCase() == 'update') {
	// 	updateRedisCacheDirect(job).then((res) => {
	// 		CQLQuery(job, next);
	// 	});
	// }
	// else if (firstWord.toLowerCase() == 'insert') {
	// 	insertRedisCacheDirect(job).then((res) => {
	// 		CQLQuery(job, next);
	// 	});
	// }
	// else if (firstWord.toLowerCase() == 'delete') {
	// 	deleteRedisCacheDirect(job).then((res) => {
	CQLQuery(job, next);
	// });
	// }


}
client_side_redis = async.queue(function (job, next) {
	countttt++; job.countttt = countttt;
	job.bbb_queue_start = Date.now();
	// console.log('queuesys:redis:', countttt, job.type);
	switch (job.type) {
		case 'select': {
			searchRedisCache(job, next);
			break;
		}
		case 'update': {
			updateRedisCacheJob(job, next);
			break;
		}
		case 'delete': {
			deleteRedisCacheJob(job, next);
			break;
		}
		case 'insert': {
			insertRedisCacheJob(job, next);
			break;
		}
		case 'CQL': {
			CQLJob(job, next);
			break;
		}
		// case 'hex': {
		// 	let { qr, hex, str, rowkey, cass, dcc } = job;
		// 	replace_hex_val(qr, hex, str, rowkey, cass, dcc, next)
		// 	break;
		// }



	}
}, 1);
client_side_redis.pause();
// setTimeout(() => {
// 	client_side_redis.resume();
// }, 20000);
// --------------------------------------------
// iftc = {
// 	'0': 0,
// 	'1': 0,
// 	'2': 0,
// 	'3': 0,
// 	'4': 0,
// 	'5': 0,
// 	'6': 0
// };

// var rows_cc = 0;
// function parseRedisCassandra() {
// 	try {
// 		var arr_size = 150;
// 		var rows0 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows1 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows2 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows3 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows4 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows5 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		var rows6 = Array(arr_size).fill().map(() => Math.round(Math.random()));
// 		rows_cc++;

// 		let ar = [];

// 		const s0 = process.hrtime.bigint();
// 		for (let it0 of rows0) {
// 			// console.log('loooop0:', it0);
// 		} // 'for-of
// 		ar[0] = parseInt(process.hrtime.bigint() - s0);

// 		const s6 = process.hrtime.bigint();
// 		for (let it6 in rows6) {
// 			// console.log('loooop6:', it6); 
// 		}
// 		ar[6] = parseInt(process.hrtime.bigint() - s6);

// 		const s1 = process.hrtime.bigint();
// 		for (let len1 = rows1.length; len1--;) {
// 			// console.log('loooop1:', len1);
// 		} //'for-dec'
// 		ar[1] = parseInt(process.hrtime.bigint() - s1);

// 		const s2 = process.hrtime.bigint();
// 		for (let it2 = 0, len2 = rows2.length; it2 !== len2; it2++) {
// 			// console.log('loooop2:', it2);
// 		} //'for-cache'
// 		ar[2] = parseInt(process.hrtime.bigint() - s2);

// 		// ========== while =====================================
// 		const s3 = process.hrtime.bigint();
// 		let it3 = 0, len3 = rows3.length;
// 		while (it3 < len3) {
// 			// console.log('loooop3:', it3);
// 			it3++;
// 		} //'while-condition'
// 		ar[3] = parseInt(process.hrtime.bigint() - s3);

// 		const s4 = process.hrtime.bigint();
// 		let len4 = rows4.length;
// 		while (--len4 >= 0) {
// 			// console.log('loooop4:', len4);
// 		} // 'while-pre-dec'
// 		ar[4] = parseInt(process.hrtime.bigint() - s4);

// 		const s5 = process.hrtime.bigint();
// 		let len5 = rows5.length;
// 		while (len5--) {
// 			// console.log('loooop5:', len5);
// 		} // 'while-post-dec'
// 		ar[5] = parseInt(process.hrtime.bigint() - s5);

// 		// =====================================================

// 		let index_min = ar.indexOf(Math.min(...ar));
// 		iftc[index_min]++;
// 		console.log('iiifff', rows_cc, index_min, JSON.stringify(iftc));
// 		if (rows_cc > 10000) return;
// 		parseRedisCassandra();

// 	} catch (err) {
// 		return;
// 	}


// }
// parseRedisCassandra();

// let index_win = Object.values(iftc);
// const indexOfMaxValue = index_win.indexOf(Math.max(...index_win));
// console.log(indexOfMaxValue);
// ------------- benchmark -----------------------------


function getmsgids(found_rows, job) {
	let arrky7 = [];
	for (let row of found_rows) {
		for (let [skey, sval] of job._this._properties.schema.key.entries()) {
			if (sval == 'msg_id') arrky7.push(String(row[sval]));
		}
	}
	return arrky7;
}
function getOnlySingleUserConversation(user_id, data) {
	if (user_id) {
		var resdata = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].participants.indexOf(user_id) > -1) {
				resdata.push(data[i]);
			}
		}
		return resdata;
	} else {
		return data;
	}


}
function getOnlyOneConvdata(data, conversation_id) {
	var resdata = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].conversation_id == conversation_id) {
			resdata.push(data[i]);
		}
	}
	return resdata;
}
function getOnlyUserNickname(user_id, data) {
	if (user_id) {
		var resdata = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].user_id == user_id) {
				resdata.push(data[i]);
			}
		}
		return resdata;
	} else {
		return data;
	}

}
client_side_redis.drain = function () {
	console.log('The queue has finished processing!');
};
var getAllNickName = (user_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getAllNickName',
			index: user_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getUserPinBlocks = (user_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getUserPinBlocks',
			index: user_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getSingleUserConversation = (user_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getSingleUserConversation',
			index: user_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getFullConversations = () => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getFullConversations',
			resolve: resolve, reject: reject
		});

	});
}
var getConversationFiles = (user_id, conv_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getConversationFiles',
			index: conv_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getConversationMessages = (user_id, conv_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getConversationMessages',
			index: conv_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getAllTags = (user_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getAllTags',
			index: user_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getLoadConv_n_Message = (user_id, conv_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getLoadConv_n_Message',
			index: conv_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getConversationChecklist = (user_id, conv_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getConversationChecklist',
			index: conv_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
var getAllRepConvdata = (user_id) => {
	return new Promise((resolve, reject) => {
		client_side_redis2.push({
			type: 'getAllRepConvdata',
			index: user_id,
			user_id: user_id,
			resolve: resolve, reject: reject
		});

	});
}
// var getAllNotification = (user_id = '') => {
// 	return new Promise((resolve, reject) => {
// 		client_side_redis2.push({
// 			type: 'getAllNotification',
// 			index: user_id,
// 			user_id: user_id,
// 			resolve: resolve, reject: reject
// 		});

// 	});
// }
var getOneConversation = (conv_id) => {
	return new Promise((resolve, reject) => {
		if (redis_client) {
			redis_client.get('conversation', (err, conv) => {
				if (conv) {
					var convData = JSON.parse(conv);
					console.log(28, convData.length)
					resolve(getOnlyOneConvdata(convData, conv_id));
				} else {
					resolve([]);
				}
			});

		}


	});
}
var deleteRedisCache = async (table_name, queryObject, model_object, options = false) => {
	if (model_object && model_cache_schema[table_name]) {
		return new Promise((resolve, reject) => {
			// resolve(); // undo
			client_side_redis.push({
				type: 'delete',
				table_name: table_name,
				queryObject: queryObject,
				options: options,
				model_object: model_object,
				resolve: resolve, reject: reject
			});
		});

	}

}
var insertRedisCache = async (table_name, data_object, model_object, queryObject) => {
	if (model_object && model_cache_schema[table_name]) {
		return new Promise((resolve, reject) => {
			// resolve(); // undo
			client_side_redis.push({
				type: 'insert',
				table_name: table_name,
				data_object: data_object,
				model_object: model_object,
				queryObject: queryObject,
				resolve: resolve, reject: reject
			});
		});

	}

}
var updateRedisCache = async (table_name, queryObject, updateValues, model_object, options = false) => {
	if (model_object && model_cache_schema[table_name]) {
		return new Promise((resolve, reject) => {
			// resolve(); // undo
			client_side_redis.push({
				type: 'update',
				table_name: table_name,
				queryObject: queryObject,
				updateValues: updateValues,
				options: options,
				model_object: model_object,
				resolve: resolve, reject: reject
			});
		});
	}

}
function getPropertyEq(obj) {
	if (_.isPlainObject(obj)) {
		if (obj.hasOwnProperty('$eq')) {
			return String(obj['$eq']);
		} else {
			return false;
		}
	} else {
		return String(obj);
	}
}
function getInsertProperties(instance, _this) {
	let _instance = (instance);
	for (let [ins_k, ins_v] of Object.entries(_instance)) {
		if (_this.fields.hasOwnProperty(ins_k)) {
			// console.log(ins_k, ins_v);
			if (_this.fields[ins_k].constructor.name == 'Object') { // fields value has object
				if (_this.fields[ins_k].hasOwnProperty('default')) {
					var dd = _this.fields[ins_k]['default'];
					if (dd && dd.constructor.name == 'Object') {
						if (dd.hasOwnProperty('$db_function')) {
							if (ins_v == undefined && dd['$db_function'] == 'toTimestamp(now())') { _instance[ins_k] = new Date(); }
							else if (ins_v == undefined && dd['$db_function'] == "now()") { _instance[ins_k] = models.timeuuid(); }
						} else {
							if (ins_v == undefined) { _instance[ins_k] = dd; }
						}
					} else {
						if (ins_v == undefined) { _instance[ins_k] = dd; }
					}
				} else {
					if (ins_v == undefined) _instance[ins_k] = null;
					if (ins_v && ins_v.constructor.name == 'Array' && ins_v.length == 0) {
						_instance[ins_k] = null;
					}
				}
			} else { //call_duration: "text",
				if (ins_v == undefined) _instance[ins_k] = null;
			}
		}
	}
	let totalData = {};
	for (let [ik, vk] of Object.entries(_instance)) {
		if (_this.fields.hasOwnProperty(ik)) { totalData[ik] = vk; }
	}
	return totalData;
}
// function saveJsonindex(index_name){
// 	return new Promise((resolve,reject) => {
// 		redis_client.send_command('JSON.INDEX', index_name, function (err, response) {
// 			if (err){
// 				console.error(`JSON.INDEX:err == ${err}`);
// 				resolve({status:false,index_name});
// 			} 
// 			else{
// 				console.log(`JSON.INDEX:index == ${table_name},field == ${field}`, err.message);
// 				resolve({status:true,index_name});
// 			} 

// 		});

// 	})
// }
async function saveRedisIndex(table_name, model_object) {
	let arr_index = [`idx:${table_name}`, 'STOPWORDS', '0', 'PREFIX', '1', `${table_name}:`, 'SCHEMA', 'cluster_score', 'NUMERIC', 'SORTABLE'];
	for (let field in model_object.fields) {
		// var field_type = getModelFieldType(model_object, field);

		// if (field_type == 'set') arr_index.push(field, 'TEXT');
		// else 
		arr_index.push(field, 'TEXT');
		// let aw = await saveJsonindex(['ADD',table_name,field, `$.${field}`]);
		// console.log(aw);
		// console.log(`JSON.INDEX ADD ${table_name} ${field} $.${field}`);

		// let json_index = ['ADD', table_name, field, `$.${field}`];
		// redis_client.send_command('JSON.INDEX', json_index, function (err, response) {
		// 	if (err) {
		// 		console.error(`JSON.INDEX:err == ${err}`);
		// 	}
		// 	// else console.log(`JSON.INDEX:`, response);

		// });

	}
	if (redis_client) {
		redis_client.send_command('FT.CREATE', arr_index, function (err, response) {
			if (err) console.log(`cache::idx:${table_name}`, err.message);
			else console.log(`cache::idx:${table_name}`, response);
		});
	}
	// if (redis_client2) {
	// 	redis_client2.send_command('FT.CREATE', arr_index, function (err, response) {
	// 		if (err) console.log(`cache2::idx:${table_name}`, err.message);
	// 		else console.log(`cache2::idx:${table_name}`, response);
	// 	});
	// }


}
// npx patch-package express-cassandra
// ./node_modules/.bin/patch-package
module.exports = {
	getSingleUserConversation,
	getAllNickName,
	getUserPinBlocks,
	getConversationMessages,
	getLoadConv_n_Message,
	getConversationFiles,
	getConversationChecklist,
	getOneConversation,
	getAllTags,
	updateRedisCache,
	deleteRedisCache,
	insertRedisCache,
	getPropertyEq,
	getInsertProperties,
	getFullConversations,
	saveRedisIndex,
	import_redis_db,
	updateRedisCacheJob,
	deleteRedisCacheJob,
	insertRedisCacheJob,


}