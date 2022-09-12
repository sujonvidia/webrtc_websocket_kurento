/*
    Local file server
    file name: s3Local.js
    server use: minio s3 local server
    Documentation: https://docs.minio.io/
    JavaScript SDK Documentation: https://docs.minio.io/docs/javascript-client-api-reference

    Required file:
        config/config.json
        config/s3_config.json
*/
var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('lodash');
var Minio = require('minio');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3-transform');
var md5 = require('md5');
var stream = require('stream')
const sharp = require('sharp');

var escapeHtml = (text) => {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};

var mimetype_dir = (file) =>{
    var mime = file.mimetype;
    if (mime.indexOf('image') != -1)
        return '/Photos';
    else if (mime.indexOf('video') != -1)
        return '/Videos';
    else if (mime.indexOf('audio') != -1)
        return '/Music';
    else
        return '/Others';
};

var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.FILE_SERVER_ACCESS_KEY,
    secretKey: process.env.FILE_SERVER_SECRET_KEY
});

// Creates a new bucket.
// Parameters:
// bucket_name     string
// region          string
router.post('/createBucket', function(req, res, next) {
    var bucket_name = escapeHtml(req.body.bucket_name);
    var region = escapeHtml(req.body.region);

    minioClient.makeBucket(bucket_name, region, function(err) {
        if (err) res.json({status: false, error: err});
        res.json({status: true, msg: 'Bucket \''+ bucket_name +'\'created successfully in '+ region +'.'});
    });
});

// Lists all buckets.
router.get('/listOfBuckets', function(req, res, next) {
    minioClient.listBuckets(function(err, buckets) {
        if (err) res.json({status: false, error: err});
        else
            res.json({status: true, buckets});
    });
});

// Checks if a bucket exists.
// Parameters:
// bucket_name     string
router.post('/hasBucket', function(req, res, next) {
    var bucket_name = escapeHtml(req.body.bucket_name);

    minioClient.bucketExists(bucket_name, function(err, exists) {
        if (err) res.json({status: false, error: err});

        if (exists) {
            res.json({status: true, msg: 'Bucket exists.'});
        } else {
            res.json({status: false, msg: 'Bucket not exists.'});
        }
    });
});

// Removes a bucket.
// Parameters:
// bucket_name     string
router.post('/deleteBucket', function(req, res, next) {
    var bucket_name = escapeHtml(req.body.bucket_name);

    minioClient.removeBucket(bucket_name, function(err) {
        if (err) res.json({status: false, error: err});
        res.json({status: true, msg: 'Bucket removed successfully.'});
    });
});

// Remove all objects in the objectsList.
// Parameters:
// bucket_name      string
// attch_list       array
router.post('/deleteObjects', function(req, res, next) {
    console.log(113, req.body);
    var bucket_name = escapeHtml(req.body.bucket_name);
    var objectsList = JSON.parse(req.body.attch_list);
    if(objectsList.length == 1){
        minioClient.removeObject(bucket_name, objectsList[0], function(e) {
            if (e) res.json({status: false, error: 'Unable to remove Objects ',e});
            if(/^Photos\//i.test(objectsList)){
                var thumb = objectsList[0].replace("Photos/", "Photos/thumb-");
                minioClient.removeObject(bucket_name, thumb, function(te) {
                    if (te) res.json({status: false, error: 'Unable to remove thumb ',te});
                    res.json({status: true, msg: 'Removed the image thumb successfully.'});
                });
            }
            else
                res.json({status: true, msg: 'Removed the objects successfully.'});
        });
    } else if(objectsList.length > 1) {
        minioClient.removeObjects(bucket_name, objectsList, function(e) {
            if (e) res.json({status: false, error: 'Unable to remove Objects ',e});
            res.json({status: true, msg: 'Removed the objects successfully.'});
        });
    }
});

// Copy object
// Parameters:
// bucket_name      string
// object_name      string
// des_bucket_name  string
router.post('/copyObject', function(req, res, next) {
    var bucket_name = escapeHtml(req.body.bucket_name);
    var object_name = escapeHtml(req.body.object_name);
    var des_bucket_name = escapeHtml(req.body.des_bucket_name);
    var conds = new Minio.CopyConditions()
    conds.setMatchETag('public-read')
    minioClient.copyObject(bucket_name, object_name, des_bucket_name, conds, function(e, data) {
        if (e) res.json({e});
        res.json({status: true, msg: 'Successfully copied the object.'});
    });
});

// ============================================================================================================= //

router.get('/create_bucket_if_not_exists/:user_id', function(req, res, next){
    var uid = req.params.user_id;
    var all_error = [];
    var bucketPolicy = `{
                          "Version": "2012-10-17",
                          "Statement": [
                            {
                              "Action": "s3:GetObject",
                              "Effect": "Allow",
                              "Principal": {"AWS": "*"},
                              "Resource": ["arn:aws:s3:::${uid}/*"],
                              "Sid": "Public"
                            }
                          ]
                        }`;
    minioClient.bucketExists(uid, function(err1, exists) {
        if (err1) res.json({status: false, error: err1});
        else{
            if (exists) {
                bucket_name = uid;
                minioClient.getBucketPolicy(bucket_name, function(err2, policy) {
                    if (err2) {
                        minioClient.setBucketPolicy(bucket_name, bucketPolicy, function(err3) {
                            if (err3) all_error.push(err3);
                            // console.log('Bucket policy set');
                        });
                    } else {
                        // console.log(`Bucket policy file: ${policy}`);
                    }
                });
                res.json({status: true, bucket_name: bucket_name, msg: 'User has bucket.'});
            } else {
                minioClient.makeBucket(uid, 'us-east-1', function(err4) {
                    if (err4) res.json({status: false, error: err4});
                    else{
                        minioClient.setBucketPolicy(uid, bucketPolicy, function(err5) {
                            if (err5) all_error.push(err5);
                            // console.log('Bucket policy set');
                        });
                        res.json({status: true, bucket_name: uid, msg: 'Bucket created successfully'});
                    }
                });
            }
        }        
    });
});

AWS.config.loadFromPath('./config/s3_config.json');
var s3 = new AWS.S3();
var upload = multer({
	storage: multerS3({
        s3: s3,
        bucket: function (req, file, cb) {
            var dir_name = mimetype_dir(file);
            var bkn = (req.body.bucket_name).replace(/\"/g, "");
            cb(null, bkn + dir_name);
        },
        acl: 'public-read',
        limits: {fieldSize: 1024 * 1024 * 500}, // Max file size 500M
        contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
            /* file filter. if try to upload any file, who has no extention, then reject it.*/
            if (path.extname(file.originalname) == "") {
                cb(null, false);
            }
            else
			    cb(null, {fieldName: file.fieldname});
        },
        shouldTransform: function (req, file, cb) {
            // console.log(225, file.mimetype);
            cb(null, /^image/i.test(file.mimetype))
        },
        key: function (req, file, cb) {
            file['voriginalName'] = file.originalname;
            file.originalname = file.originalname.replace(/ /g, "_").replace(/#/g, "_"); // replace all space and # by _
            var filename = file.originalname.replace(path.extname(file.originalname), '@') + Date.now() +  path.extname(file.originalname);
            file.originalname = filename;
            cb(null, filename);
        },
        transforms: [{
            id: 'original',
            key: function (req, file, cb) {
                cb(null, file.originalname);
            },
            transform: function (req, file, cb) {
                cb(null, new stream.PassThrough())
            }
        }, {
            id: 'thumbnail',
            key: function (req, file, cb) {
                cb(null, 'thumb-' + file.originalname)
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize({width:50}).png())
            }
        }]
	})
});
var propicupload = multer({
	storage: multerS3({
		s3: s3,
		bucket: function (req, file, cb) {
            var dir_name = mimetype_dir(file);
            console.log(149, dir_name);
            cb(null, req.body.bucket_name + dir_name);
        },
        acl: 'public-read',
        limits: {fieldSize: 1024 * 1024 * 1}, // Max file size 1M
        contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, {fieldName: file.fieldname});
		},
		key: function (req, file, cb) {
            file.originalname = file.originalname.replace(/ /g, "_").replace(/#/g, "_");
            console.log('s3Local.js Line 217: ', file.originalname);
            cb(null, file.originalname.replace(path.extname(file.originalname), '@') +Date.now() +  path.extname(file.originalname));
		}
	})
});

router.post('/upload_obj', upload.array('file_upload', 100), function(req, res, next) {
    // console.log(266, req.files)
    if (req.files.length < 1) {
        res.json({ status: false, msg: 'No files were uploaded.' });
    } else {
        for(var n=0; n<req.files.length; n++){
            if(/^image/i.test(req.files[n].mimetype)){
                for(var i=0; i<req.files[n].transforms.length; i++){
                    if(req.files[n].transforms[i].id == 'original'){
                        req.files[n].contentDisposition = null;
                        req.files[n].storageClass = "STANDARD";
                        req.files[n].size = req.files[n].transforms[i].size;
                        req.files[n].bucket = req.files[n].transforms[i].bucket;
                        req.files[n].key = req.files[n].transforms[i].key;
                        req.files[n].acl = req.files[n].transforms[i].acl;
                        req.files[n].contentType = req.files[n].transforms[i].contentType;
                        req.files[n].metadata = req.files[n].transforms[i].metadata;
                        req.files[n].location = req.files[n].transforms[i].location;
                        req.files[n].etag = req.files[n].transforms[i].etag;
                    }
                }
            }
        }
        console.log(285, req.files);
        res.json({ file_info: req.files, msg: 'Successfully uploaded', 'sl': req.body.sl });
    }
});

router.post('/propic', propicupload.array('file_upload', 1), function(req, res, next) {
    console.log(210, req.files[0])
    if (req.files.length < 1) {
        res.json({ status: false, msg: 'No files were uploaded.' });
    } else {
        res.json({ file_info: req.files, msg: 'Successfully uploaded', 'sl': req.body.sl });
    }
});

router.post('/convImg', propicupload.array('room_image',10), function(req, res, next){
    console.log(243, req.files[0]);
  if(req.files[0].key !== ''){
    res.json({'msg':'Successfully','filename':req.files[0].key,data:req.files[0]});
  } else {
    res.json({ status: false, msg: 'No files were uploaded.' });
  }
});

router.post('/notification_sound', propicupload.array('file_upload',1), function(req, res, next){
    console.log(297, req.files[0]);
  if(req.files.length > 0){
    res.json({'msg':'Successfully','filename':req.files[0].key, data:req.files[0]});
  } else {
    res.json({ status: false, msg: 'No files were uploaded.' });
  }
});

module.exports = router;
