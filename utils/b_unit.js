 var app = require('express');
var router = app.Router();
var _ = require('lodash');

var {models} = require('./../config/db/express-cassandra');



var getBUnitByUser = (data,callback)=>{

	models.instance.BusinessUnit.find({user_id:models.uuidFromString(data.user_id)}, { raw: true, allow_filtering: true }, function(error, allUnit){
	    if(error){
	    	console.log(error)
	    	 callback({status: false});
	    }else{
	    	if(allUnit.length > 0){
	    		console.log('0',allUnit)
	        	callback({status:true, data:allUnit});
	    	}else{
	    		var newData = {
			        unit_id:models.timeuuid(),
			        user_id:models.uuidFromString(data.user_id),
			        unit_name:'Unit 1',
			        industry_name:data.industry_name,
			        industry_id:models.timeuuid(data.industry_id)
			    }

				var bunitNew = new models.instance.BusinessUnit(newData);

				bunitNew.saveAsync()
				    .then(function(res) {
				    	console.log('1',allUnit)
				        callback({status:true, data: [newData]});
				    })
				    .catch(function(err) {
				        callback({status:false, err: err});
				    });
	    	}
	    }
	});
}
var getAllbunit = (data,callback)=>{

	models.instance.BusinessUnit.find({},function(error, allUnit){
	    if(error){
	    	console.log(error)
	    	 callback({status: false});
	    }else{
	    	if(allUnit.length > 0){
	        	callback({status:true, data: allUnit});
	    	}else{
	    		var newData = {
			        unit_id:models.timeuuid(),
			        user_id:models.uuidFromString(data.user_id),
			        unit_name:'Unit 1',
			        industry_name:data.industry_name,
			        industry_id:models.timeuuid(data.industry_id)
			    }

				var bunitNew = new models.instance.BusinessUnit(newData);

				bunitNew.saveAsync()
				    .then(function(res) {
				    	console.log('1',allUnit)
				        callback({status:true, data: [newData]});
				    })
				    .catch(function(err) {
				        callback({status:false, err: err});
				    });
	    	}
	    }
	});
}

var addNewBUnit = (data,callback)=>{
	var newData = {
        unit_id:models.timeuuid(),
        user_id:models.uuidFromString(data.user_id),
        unit_name:data.unit_name,
        created_by:models.uuidFromString(data.user_id),
        industry_name:data.industry_name,
        industry_id:models.timeuuid(data.industry_id)
    }

	var bunitNew = new models.instance.BusinessUnit(newData);

	bunitNew.saveAsync()
	    .then(function(res) {
	        callback({status:true, data: newData});
	    })
	    .catch(function(err) {
	        callback({status:false, err: err});
	    });
}


var findOrAddIndustry = (callback)=>{
	models.instance.Industry.find({industry_name:'Information Technology'}, { raw: true, allow_filtering: true }, function(error, industry){
	    if(error){
	    	 callback({status: false});
	    }else{
			if(industry.length > 0){

				callback({status:true, data:industry});
			}else{
				var newData = {
					industry_id:models.timeuuid(),
					industry_name:'Information Technology'
				}

				var newindustry = new models.instance.Industry(newData);

				newindustry.saveAsync()
					.then(function(res) {
						callback({status:true, data: newData });
					})
					.catch(function(err) {
						callback({status:false, err: err});
					});
			}
	    }
	});
}

var updateunitTitle = (data,callback)=>{
	models.instance.BusinessUnit.update({unit_id:models.timeuuidFromString(data.unit_id.toString())},{unit_name:data.unit_name,updated_at:new Date()}, update_if_exists,function(err){
		if(err){
			callback(err);
		}else{
			callback({status:true});
		}
	})
}

var removeBunitbyid = (data,callback)=>{
	models.instance.BusinessUnit.delete({unit_id:models.timeuuidFromString(data.unit_id.toString())},function(err){
		if(err){
			callback(err);
		}else{
			callback({status:true});
		}
	})
}


module.exports = {
    getBUnitByUser,
	addNewBUnit,
	findOrAddIndustry,
	updateunitTitle,
	removeBunitbyid,
	getAllbunit
};