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

var {
    getMyAllActivityUtils,
    getParcipatedActivityUtils,
    getParcipatedActivityListUtils,
    // pinnedDataUtils,
    // flaggeddDataUtils,
    // activitychangelog
  } = require('./../utils/activity');

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
        var activityIds = [];
        var myActivityIds = [];
        const users = await findCalendarUser();

        var now = moment(new Date()); //todays date

              var res_data = {
                url:'activity_new',
                title: "Activity_task",
                page_title:'Activity Task',
                bodyClass: "basic",
                success: req.session.success,
                error: req.session.error,
                file_server: process.env.FILE_SERVER,
                user_id: req.session.user_id,
                user_fullname: req.session.user_fullname,
                user_email: req.session.user_email,
                user_img: req.session.user_img,
                highlight: highlight,
                moment: moment,
                _:_,
                has_login: true,
                data: [{
                    users: users,
                }]
              };
              res.render('activity_task', res_data);
        // var activityIds = [];
        // var myActivityIds = [];
        // const users = await findCalendarUser();
        // const getMyAllActivity = await getMyAllActivityUtils(req.session.user_id,'Task').catch((err)=>{console.log(40,err)});
        // const getParcipatedActivity = await getParcipatedActivityUtils(req.session.user_id,'Task').catch((err)=>{console.log(41,err)});
        
        // if(getParcipatedActivity.activities.length > 0){
        //     _.forEach(getParcipatedActivity.activities, function(val, kk){
        //         _.forEach(val.participants, function(va, k){
        //             if (va == req.session.user_id) {
        //                 if(activityIds.indexOf(val.activity_id.toString()) == -1){
        //                     activityIds.push(val.activity_id.toString());
        //                 }
        //             }
        //         });
        //     });
        // }

        // if(getMyAllActivity.activities.length > 0){
        //     _.forEach(getMyAllActivity.activities, function(val, k){
        //         if(myActivityIds.indexOf(val.activity_id.toString()) == -1){
        //             myActivityIds.push(val.activity_id.toString());
        //         }
        //     });
        // }

        // if(activityIds.length > 0){
        //     const getParcipatedActivityList = await getParcipatedActivityListUtils(activityIds).catch((err)=>{console.log(47,err)});
        //     var activities = _.concat(getMyAllActivity.activities, getParcipatedActivityList.activities);
        // }else{
        //     var activities = _.orderBy(getMyAllActivity.activities, ["activity_created_at"], ["desc"]);
        // }

        // var allActivities = _.concat(myActivityIds,activityIds);
        // // var pinnedData = await pinnedDataUtils(allActivities,req.session.user_id).catch((err)=>{console.log(56,err)});
        // // var flaggeddData = await flaggeddDataUtils(allActivities,req.session.user_id).catch((err)=>{console.log(57,err)});

        
        // var pinIs = [];
        // var flagsIs = [];
        // // if(pinnedData != undefined){
        // //     if(pinnedData.status){
        // //         if(pinnedData.activities.length > 0){
        // //             _.forEach(pinnedData.activities, function(val, k){
        // //                 if(pinIs.indexOf(val.activity_id.toString()) == -1){
        // //                     pinIs.push(val.activity_id.toString());
        // //                 }
        // //             });
        // //         }
        // //     }
        // // }
        
        // // if(flaggeddData != undefined){
        // //     if(flaggeddData.status){
        // //         if(flaggeddData.activities.length > 0){
        // //             _.forEach(flaggeddData.activities, function(val, k){
        // //                 if(flagsIs.indexOf(val.activity_id.toString()) == -1){
        // //                     flagsIs.push(val.activity_id.toString());
        // //                 }
        // //             });
        // //         }
        // //     }
        // // }

        // var now = moment(new Date()); //todays date
        // var mytdoList = {};
        // var overdue = [];
        // var pinned = [];
        // var normaltodo = [];
        // var uniqActivitiesid = [];

        // _.each(activities, function(todo,ke){
        //     if(uniqActivitiesid.indexOf(todo.activity_id.toString()) == -1){
        //         uniqActivitiesid.push(todo.activity_id.toString())
        //         mytdoList[todo.activity_id] = {
        //             'todoid': todo.activity_id,
        //             'reminder_time': todo.activity_has_reminder,
        //             'todo_enddate': todo.activity_end_time,
        //             'todo_starttime': todo.activity_from,
        //             'todo_endtime': todo.activity_to,
        //             'todo_createdby': todo.activity_created_by
        //         };
    
        //         var date2 = new Date();
        //         var date1 = new Date(todo.activity_end_time);
        //         var timeDiff = date2.getTime() - date1.getTime();
        //         var days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //         // if (flagsIs.indexOf(todo.activity_id.toString()) > -1) {
        //         //     todo['hasflag'] = 1;
        //         // } else {
        //         //     todo['hasflag'] = 0;
        //         // }
        //         todo['days'] =  days;
        //         if(days > 1){ // if days greater then 1 it will cross today
        //             if (pinIs.indexOf(todo.activity_id.toString()) > -1) {
        //                 pinned.push(todo);
        //             } else {
        //                 overdue.push(todo);
        //             }
        //         }else{
        //             if (pinIs.indexOf(todo.activity_id.toString()) > -1) {
        //                 pinned.push(todo);
        //             } else {
        //                 normaltodo.push(todo);
        //             }
                   
        //         }
        //     }
        // });

        // // models.instance.Tag.find({ tagged_by: models.uuidFromString(req.session.user_id), type: "TODO"}, { allow_filtering: true }, function(tagserr, tags){
        // //     if(tagserr){
        // //       throw tagserr;
        // //     }else{
              
        //       var res_data = {
        //         url:'activity',
        //         title: "Activity",
        //         page_title:'Workfreeli | Activity',
        //         bodyClass: "basic",
        //         success: req.session.success,
        //         error: req.session.error,
        //         file_server: process.env.FILE_SERVER,
        //         user_id: req.session.user_id,
        //         user_fullname: req.session.user_fullname,
        //         user_email: req.session.user_email,
        //         user_img: req.session.user_img,
        //         highlight: highlight,
        //         moment: moment,
        //         _:_,
        //         has_login: true,
        //         data: [{
        //             users: users,
        //             // pinned:pinned,
        //             overdue:overdue,
        //             normaltodo:normaltodo,
        //             // tags: tags,
        //             tdoList: mytdoList
        //         }]
        //       };
        //       res.render('basic_to_do', res_data);
        //     }
        // });

    } else {
      res.redirect('/');
    }

});

function findCalendarUser(){
    return new Promise((resolve,reject)=>{
        models.instance.Users.find({
            is_delete: 0
        }, {
            raw: true,
            allow_filtering: true
        }, function (err, users) {
            if (err){
                reject(err);
            }else{
                resolve(users);
            }
        });
    });
}


// router.post('/changelog/', function(req, res, next){
//     if(req.session.login){
//         var data = {
//             targetId    : req.body.targetid,
//             targetType  : req.body.type
//           }
//         activitychangelog(data, (result) =>{
//             res.json(result);
//         });
//     }
// });

module.exports = router;