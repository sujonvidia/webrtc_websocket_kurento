var {models} = require('./../config/db/express-cassandra');


function ensureToken(req, res, next){
	const bearerHeader = req.headers["authorization"];
	if(typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(" ");
		if(bearer[0] == "Bearer"){
			const bearerToken = bearer[1];
			req.token = bearerToken;
			next();
		}
		else{
			res.sendStatus(403);
		}
	}
	else{
		res.sendStatus(403);
	}
}

function token_verify_by_device_id(data){
    return new Promise((resolve,reject)=>{
        models.instance.Users.findOne({id: models.uuidFromString(data.id)}, function (err, user) {
            if (err){
                reject({status: false, error: err});
            }else{
                if(data.device_id === undefined){
                    resolve({status: true});
                }
                if(user){
                    if(user.device.indexOf(data.device_id) > -1){
                        resolve({status: true});
                    }
                    else 
                        reject({ status: false, error: "Device is not listed. Please Login." });    
                }
                else 
                    reject({ status: false, error: "Device is not listed. Please Login." });
            }
        });
    });
}

module.exports = {ensureToken, token_verify_by_device_id};