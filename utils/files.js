var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var {models} = require('./../config/db/express-cassandra');
var file_unlink = (data) =>{
	// fs.unlink(data.filename, (err) => {
	// 	if (err) throw err;
	// 		console.log('successfully deleted '+ data.filename);
	// });
	try {
		fs.unlinkSync(data.filename);
	} catch (err) {
		console.log('file_unlink: file not found');
	}
};


var getallFileOnConv = (data,callback)=>{
	var queryObj = {
		conversation_id:models.uuidFromString(data.conversation_id)
	}
	models.instance.File.find(queryObj,function(err,result){
		if(err){
			console.log(err);
		}else{
			callback(result);
		}
	})
}
var findThisFile = (data,callback)=>{
	console.log(32,data)
	var queryObj = {
		key:data.key
	}
	if(typeof(data.key) == 'undefined'){
		queryObj = {id:models.timeuuidFromString(data.id)};
	}
	models.instance.File.find(queryObj,{allow_filtering:true},function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({status:true,data:result});
		}
	})
}
var updateFileTagV2 = (data)=>{
    return new Promise((resolve,reject)=>{
		if(data.newtag.length > 0 && data.removetag.length > 0){
			models.instance.File.update({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$add:data.newtag},tag_list_with_user:data.tag_list_with_user}, update_if_exists,function(err,result){
				if(err){
					console.log(err);
				}else{
					models.instance.File.update({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$remove:data.removetag}}, update_if_exists,function(err2,result2){
						if(err2){
						  console.log(err2);
						}else{
							console.log(result2);
							resolve({status:true});
						}
					  });
				}
			});

		}else{
			if(data.newtag.length > 0){
			  models.instance.File.update({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$add:data.newtag},tag_list_with_user:data.tag_list_with_user}, update_if_exists,function(err,result){
				if(err){
				  console.log(err);
				}else{
					resolve({status:true});
				}
			  });
			}
			if(data.removetag.length > 0){
			  models.instance.File.update({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$remove:data.removetag},tag_list_with_user:data.tag_list_with_user}, update_if_exists,function(err,result){
				if(err){
				  console.log(err);
				}else{
					resolve({status:true});
				  console.log(result);
				}
			  });
			}
		}
      
    })
}
// function addFileActivity(data,callback){
// 	models.instance.File.find({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},function(err,result){
// 		if(err){
// 			callback(err)
// 		}else{
// 			if(result.length > 0){
// 				let file_activity = {}
// 				if(result[0].file_activity != null){
// 					file_activity = JSON.parse(result[0].file_activity);
					
// 				}
// 				for(d of data.newtag){
// 					file_activity[d] = data.user_id;
// 				}
// 				file_activity = JSON.stringify(file_activity);
// 				models.instance.File.update({id:models.timeuuidFromString(data.id),conversation_id:models.uuidFromString(data.conversation_id)},{tag_list:{$add:data.newtag},tag_list_with_user:data.tag_list_with_user}, update_if_exists,function(err,result){
// 					if(err){
// 					  console.log(err);
// 					}else{
// 						resolve({status:true});
// 					}
// 				  });
// 			}
// 		}
// 	})
// }



module.exports = {file_unlink,getallFileOnConv,findThisFile,updateFileTagV2};