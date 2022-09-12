var express = require('express');
var moment = require('moment');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var highlight = require('highlight');
var _ = require('lodash');
var inArray = require('in-array');

const Validator = require('validator');

var {models} = require('./../config/db/express-cassandra');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve('./public/user_uploads/'));
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + file.originalname.replace(path.extname(file.originalname), '_') + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* GET listing. */
router.get('/', async function (req, res, next) {
    if(req.session.login){
        var uid = req.session.user_id;
        const users = await getUsers();
        const companies = await getCompanies();
        const contacts = await getContacts(uid);
        const my_task_id = await get_set_activity(uid);
        var activity = await get_activity(uid);
        var now = moment(new Date()); //todays date

        var res_data = {
            url:'boards',
            title: "Boards",
            page_title:'Boards',
            bodyClass: "basic",
            success: req.session.success,
            error: req.session.error,
            file_server: process.env.FILE_SERVER,
            user_id: uid,
            user_fullname: req.session.user_fullname,
            user_email: req.session.user_email,
            user_img: req.session.user_img,
            highlight: highlight,
            moment: moment,
            _:_,
            has_login: true,
            activity: activity,
            my_task_id: my_task_id,
            companies: companies,
            contacts: contacts,
            data: [{
                users: users
            }]
        };
        res.render('activity', res_data);

    } else {
      res.redirect('/');
    }

});
// router.get('/test', async function (req, res, next) {
//     if(req.session.login){
//         var activityIds = [];
//         var myActivityIds = [];
//         const users = await getUsers();

//         var now = moment(new Date()); //todays date

//               var res_data = {
//                 url:'boards',
//                 title: "Boards",
//                 page_title:'Boards',
//                 bodyClass: "basic",
//                 success: req.session.success,
//                 error: req.session.error,
//                 file_server: process.env.FILE_SERVER,
//                 user_id: req.session.user_id,
//                 user_fullname: req.session.user_fullname,
//                 user_email: req.session.user_email,
//                 user_img: req.session.user_img,
//                 highlight: highlight,
//                 moment: moment,
//                 _:_,
//                 has_login: true,
//                 data: [{
//                     users: users,
//                 }]
//               };
//               res.render('activitytest', res_data);

//     } else {
//       res.redirect('/');
//     }

// });

function getUsers(){
    return new Promise((resolve,reject)=>{
        models.instance.Users.find({ is_delete: 0 }, { raw: true, allow_filtering: true}, function (err, users) {
            if (err){
                reject(err);
            }else{
                resolve(users);
            }
        });
    });
}
function getContacts(id){
    return new Promise((resolve,reject)=>{
        models.instance.ActivityContact.find({is_private:0 }, {raw: true,allow_filtering: true}, function (err, contacts1) {
            if (err){
                reject(err);
            }else{
                models.instance.ActivityContact.find({created_by: models.uuidFromString(id) }, {raw: true,allow_filtering: true}, function (err2, contacts2) {
                    if (err2){
                        reject(err2);
                    }else{
                        var contacts = contacts1.length > 0 ? contacts1 : [];
                        _.forEach(contacts2, function(v2, k2){
                            var flag = true;
                            for(var i=0; i<contacts1.length; i++){
                                if(contacts1[i].id.toString() == v2.id.toString()){
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag) contacts.push(v2);
                        });
                        resolve(contacts);
                    }
                });
            }
        });
    });
}
function getCompanies(){
    return new Promise((resolve,reject)=>{
        models.instance.ActivityCompany.find({}, {raw: true,allow_filtering: true}, function (err, companies) {
            if (err){
                reject(err);
            }else{
                resolve(companies);
            }
        });
    });
}

/**
 * All of ajax function
 */
router.post('/add_activity', async function(req, res, next) {
    var result = await save_activity(req.body);
    result.activities = await get_activity(req.body.user_id);
    if(result.status)
        res.json(result);
    else
        res.json(result);
});

function save_activity(params){
    return new Promise((resolve,reject)=>{
        if (params.title == "") {
            reject({'status':false});
        }else{
            var activity_id = models.timeuuid();
            let intime = new Date().getTime();
            
            var activity = new models.instance.Activity({
                activity_id                     : activity_id,
                type                            : params.type,
                title                           : params.title,
                created_by                      : models.uuidFromString(params.user_id),
                created_at                      : intime
            });

            if(params.start_time !== undefined && params.start_time != ""){
                activity.start_time = params.start_time;
            }else{
                activity.start_time = intime;
            }
            if(params.end_time !== undefined && params.end_time != ""){
                activity.end_time = params.end_time;
            }
            if(params.budget_amount !== undefined){
                activity.budget_amount = params.budget_amount;
            }
            if(params.actual_amount !== undefined){
                activity.actual_amount = params.actual_amount;
            }
            if(params.root_id !== undefined){
                activity.root_id = params.root_id;
            }
            if(params.phase !== undefined){
                activity.phase = params.phase;
            }
            if(params.child_lists !== undefined){
                activity.child_lists = params.child_lists.split(",");
            }
            if(params.contact !== undefined){
                activity.participants_ids = params.contact.split(",");
            }
            
            activity.saveAsync().then(function() {
                resolve({ status: true, activity, activities: []});
            }).catch(function(err) {
                console.log(err);
                reject({status:false, err: err});
            });
        }
    });
}

router.post('/update_activity', async function(req, res, next) {
    var activity = await get_one_activity(req.body.id, req.body.created_by);
    activity[0].title = (req.body.title !== undefined) ? req.body.title : activity[0].title;
    activity[0].phase = (req.body.phase !== undefined) ? req.body.phase : activity[0].phase;
    activity[0].status = (req.body.status !== undefined) ? req.body.status : activity[0].status;
    activity[0].end_time = (req.body.end_time !== undefined) ? new Date(req.body.end_time) : activity[0].end_time;
    activity[0].budget_amount = (req.body.budget_amount !== undefined) ? req.body.budget_amount : activity[0].budget_amount;
    if(activity[0] != undefined){
        try{
            res.json(await update_activity(activity[0]));
        }
        catch(err){
            console.log(235);
            res.json({status: false, error: err});
        }
    }
});

function update_activity(params){
    return new Promise((resolve,reject)=>{
        if (params.title == "" && params.activity_id == "") {
            reject({'status':false});
        }else{
            console.log(246);
            models.instance.Activity.update(
                {activity_id: params.activity_id, created_by: params.created_by},
                {
                    title: params.title, 
                    phase: params.phase,
                    budget_amount: params.budget_amount, 
                    status: params.status, 
                    end_time: params.end_time 
                },
                update_if_exists, function(err){
                    if(err) reject({status:false, err: err});
                    get_activity(params.created_by.toString()).then(activities =>{
                        resolve({ status: true, params, activities});
                    });
            });
        }
    });
}
function get_set_activity(id){
    return new Promise((resolve,reject)=>{
        models.instance.Activity.findOne({"created_by": models.uuidFromString(id), "type": "My Task"}, function (err, myactivity) {
            if (err){
                console.log("get_set_activity error ", err);
                reject({status: false, error: err});
            }else{
                // console.log(194, myactivity);
                if(myactivity !== undefined){
                    // console.log(195, myactivity.activity_id);
                    resolve(myactivity.activity_id);
                }
                else
                    {
                        var data = {
                            user_id: id,
                            title: "My Task",
                            type: "My Task"
                        }
                        try{
                            save_activity(data).then(result=>{
                                if(result.status){
                                    // console.log(214, result);
                                    resolve(result.activity.activity_id);
                                }
                                else{
                                    console.log("Error in save activity");
                                    resolve(0);
                                }
                            });
                        } catch(err) {
                            console.log("Catch error into save activity " . err);
                            resolve(0);
                        }
                    }
            }
        });
    });
}
function get_activity(created_by){
    return new Promise((resolve,reject)=>{
        models.instance.Activity.find({created_by: models.uuidFromString(created_by)}, {raw:true, allow_filtering: true}, function (err, activity) {
            if (err){
                reject({status: false, error: err});
            }else{
                resolve(activity);
            }
        });
    });
}
function get_one_activity(id, created_by){
    return new Promise((resolve,reject)=>{
        models.instance.Activity.find({activity_id: models.timeuuidFromString(id), created_by: models.uuidFromString(created_by) }, function (err, activity) {
            if (err){
                reject({status: false, error: err});
            }else{
                resolve(activity);
            }
        });
    });
}

router.post('/add_contact', async function(req, res, next) {
    try{
        var result = await save_contact(req.body);
        if(result.status)
            res.json(result);
        else
            res.json({status: false});
    }catch(err){
        console.log(288, err);
        res.json({status: false, error: err});
    }
    
});
function save_contact(params){
    return new Promise((resolve,reject)=>{
        var id = models.uuid();
        let intime = new Date().getTime();
        var contact = new models.instance.ActivityContact({
            id                              : id,
            created_by                      : models.uuidFromString(params.user_id),
            email                           : [],
            phone                           : [],
            office_email                    : [],
            office_phone                    : [],
            search_txt                      : ''
        });
        
        if (params.first_name == "" || params.last_name == "") {
            reject({'status':false});
        }else{
            if(params.salutation !== undefined && params.salutation != ""){
                contact.salutation = params.salutation;
                contact.search_txt += params.salutation + "&";
            }
            if(params.first_name !== undefined && params.first_name != ""){
                contact.first_name = params.first_name;
                contact.search_txt += params.first_name + "&";
            }
            if(params.last_name !== undefined && params.last_name != ""){
                contact.last_name = params.last_name;
                contact.search_txt += params.last_name + "&";
            }
            if(params.company_id !== undefined && params.company_id != ""){
                contact.company_id = params.company_id;
                contact.search_txt += params.company_id + "&";
            }
            if(params.position !== undefined && params.position != ""){
                contact.designation = params.position;
                contact.search_txt += params.position + "&";
            }
            if(params.street !== undefined && params.street != ""){
                contact.address = params.street;
                contact.search_txt += params.street + "&";
            }
            if(params.city !== undefined && params.city != ""){
                contact.city = params.city;
                contact.search_txt += params.city + "&";
            }
            if(params.province !== undefined && params.province != ""){
                contact.province = params.province;
                contact.search_txt += params.province + "&";
            }
            if(params.country !== undefined && params.country != ""){
                contact.country = params.country;
                contact.search_txt += params.country + "&";
            }
            if(params.postal_code !== undefined && params.postal_code != ""){
                contact.post_code = params.postal_code;
            }
            if(params.root_company_id !== undefined && params.root_company_id != ""){
                contact.mother_company_id = params.root_company_id;
            }
            if(params.private !== undefined && params.private != ""){
                contact.is_private = Number(params.private);
            }
            _.forEach(params, function(v, k){
                if(k.indexOf('[')>-1){
                    if(k.indexOf('office_')>-1){
                        if(k.indexOf('email')>-1){
                            contact.office_email.push(v);
                            contact.search_txt += v + "&";
                        }
                        if(k.indexOf('phone')>-1){
                            contact.office_phone.push(v);
                            contact.search_txt += v + "&";
                        }
                    }else{
                        if(k.indexOf('email')>-1){
                            contact.email.push(v);
                            contact.search_txt += v + "&";
                        }
                        if(k.indexOf('phone')>-1){
                            contact.phone.push(v);
                            contact.search_txt += v + "&";
                        }
                    }
                }
            });

            contact.saveAsync().then(function() {
                resolve({ status: true, contact});
            }).catch(function(err) {
                console.log(err);
                reject({status:false, err: err});
            });
        }
    });
}
router.post('/add_company', async function(req, res, next) {
    try{
        var result = await save_company(req.body);
        if(result.status)
            res.json(result);
        else
            res.json({status: false});
    }catch(err){
        console.log(276, err);
        res.json({status: false, error: err});
    }
    
});
function save_company(params){
    return new Promise((resolve,reject)=>{
        var id = models.uuid();
        let intime = new Date().getTime();
        var company = new models.instance.ActivityCompany({
            id                              : id,
            created_by                      : models.uuidFromString(params.user_id),
            email                           : [],
            phone                           : [],
            search_txt                      : ''
        });
        
        if (params.company_name == "") {
            reject({'status':false});
        }else{
            if(params.company_name !== undefined && params.company_name != ""){
                company.name = params.company_name;
                company.search_txt += params.company_name + "&";
            }
            if(params.street !== undefined && params.street != ""){
                company.address = params.street;
                company.search_txt += params.street + "&";
            }
            if(params.city !== undefined && params.city != ""){
                company.city = params.city;
                company.search_txt += params.city + "&";
            }
            if(params.province !== undefined && params.province != ""){
                company.province = params.province;
                company.search_txt += params.province + "&";
            }
            if(params.country !== undefined && params.country != ""){
                company.country = params.country;
                company.search_txt += params.country + "&";
            }
            if(params.postal_code !== undefined && params.postal_code != ""){
                company.post_code = params.postal_code;
            }
            if(params.root_company_id !== undefined && params.root_company_id != ""){
                company.mother_company_id = params.root_company_id;
            }
            if(params.private !== undefined && params.private != ""){
                company.is_private = Number(params.private);
            }
            _.forEach(params, function(v, k){
                if(k.indexOf('[')>-1){
                    if(k.indexOf('email')>-1){
                        company.email.push(v);
                        company.search_txt += v + "&";
                    }
                    if(k.indexOf('phone')>-1){
                        company.phone.push(v);
                        company.search_txt += v + "&";
                    }
                }
            });

            company.saveAsync().then(function() {
                resolve({ status: true, company});
            }).catch(function(err) {
                console.log(err);
                reject({status:false, err: err});
            });
        }
    });
}

router.post('/delete_activity', function(req, res, next){
    var activity_id = models.timeuuidFromString(req.body.id);
    var created_by = models.uuidFromString(req.body.created_by);
    models.instance.Activity.delete({activity_id, created_by}, function(err){
        if(err) res.json({status: false, error: err});
        else res.json({status: true, id: activity_id});
    })
});
module.exports = router;