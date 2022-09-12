var express = require('express');
var router = express.Router();
var _ = require('lodash');
var highlight = require('highlight');
var moment = require('moment');
const isUuid = require('uuid-validate');
var httpMsgs = require('http-msgs');

var { models } = require('../config/db/express-cassandra');
var { passwordToHass, passwordToCompare } = require('../utils/hassing');
var { email } = require('../utils/email');
var { signup_utils } = require('../utils/signup_utils');
var MobileDetect = require('mobile-detect');

var { customTitle } = require('./../utils/customtitle');
var { getActiveUsers, getAllUsers } = require('./../utils/chatuser');
const isEmpty = require('../validation/is-empty');
var { hayvenjs } = require('./../utils/hayvenjs');

function compare(a, b) {
    const bandA = a.fullname.toUpperCase();
    const bandB = b.fullname.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}

function getOnlyConvIds(data) {
    var convids = [];
    for (var i = 0; i < data.length; i++) {
        convids.push(data[i].conversation_id.toString())
    }
    return convids;
}
var ss = String(moment().unix());
// console.log(ss); // 1618858165
function getStudentInfo(student_list) {
    return new Promise((resolve, reject) => {
        var stu_arr = []
        for (let stu of student_list) {
            stu_arr.push(models.uuidFromString(stu));
        }
        models.instance.Users.find({ id: { '$in': stu_arr } }, { raw: true, allow_filtering: true }, async function(err, res1) {
            if (err) console.trace(err);
            if (res1) {
                res1.map(function getFullName(item, ii) { return item.company_id; });
                models.instance.Covid_Survey.find({
                    date_of: { '$gte': String(moment().unix()) },
                    student_id: { '$in': stu_arr }
                }, { raw: true, allow_filtering: true }, function(err, res2) {
                    if (err) console.trace(err);
                    else {
                        res1.map((item1, v1) => {
                            res2.map((item2, v2) => {
                                if (item1.id.toString() == item2.student_id.toString()) {
                                    res1[v1] = Object.assign({}, item1, item2);
                                }
                            });

                        });
                        resolve(res1);

                    }

                });
            }
        });

    })
};

router.post('/update_account', async function(req, res, next) {
    console.log(req.body);
    var res1 = [];
    var res2 = [];
    if (req.body.phone) {
        if (req.body.phone != req.body.phone_db) {
            res1 = await new Promise(r => {
                models.instance.Users.find({ phone_optional: req.body.phone, role: req.session.user_role }, { raw: true, allow_filtering: true },
                    async function(err1, res1) {
                        if (err1) {
                            console.trace(err1);
                            res.json({ status: 'error', err: err1 });
                        } else return r(res1);
                    });
            });
        }
    }
    if (req.body.email) {
        if (req.body.email != req.body.email_db) {
            res2 = await new Promise(r => {
                models.instance.Users.find({ email: req.body.email, role: req.session.user_role }, { raw: true, allow_filtering: true },
                    async function(err2, res2) {
                        if (err2) {
                            console.trace(err2);
                            res.json({ status: 'error', err: err2 });
                        } else return r(res2);
                    });

            });
        }
    }
    if (res1.length || res2.length) {
        var getchk = { status: false, phone: res1.length, email: res2.length };
    } else {
        var getchk = { status: true, phone: res1.length, email: res2.length };
    }
    if (getchk.status) {
        models.instance.Users.update({ id: models.uuidFromString(req.body.user_id) }, {
            firstname: req.body.first_name,
            lastname: req.body.last_name,
            fullname: req.body.first_name + ' ' + req.body.last_name,
            phone_optional: req.body.phone,
            email: req.body.email.trim()
        }, update_if_exists, function(err) {
            if (err) {
                console.trace(err);
                res.json({ status: 'error', err });
            } else {
                var user_id = req.body.user_id;
                req.session.user_id = user_id;
                req.session.user_fullname = req.body.first_name + ' ' + req.body.last_name;
                req.session.user_email = req.body.email.trim();
                models.instance.Users.findOne({ id: models.uuidFromString(req.body.user_id) }, { raw: true, allow_filtering: true },
                    async function(err, user_row) {
                        if (err) {
                            console.trace(err);
                            res.json({ status: 'error', err });
                        } else res.json({ status: 'ok', user_row });
                    });

                models.instance.Covid_Survey.find({
                    student_id: models.uuidFromString(req.body.user_id)
                }, { allow_filtering: true }, function(err, user_data) {
                    if (err) {
                        console.trace(err);
                        res.json({ status: 'error', err });
                    } else {
                        if (user_data && user_data.length) {
                            for (let user of user_data) {
                                user.student_name = req.session.user_fullname;
                                user.student_email = req.session.user_email;
                                user.save(function(err) {
                                    if (err) console.log(err);
                                    else console.log('Yuppiie!');
                                });

                            }
                        }

                    }


                });
            }

        });
    } else {
        res.json({ status: 'exist', email: getchk.email, phone: getchk.phone });

    }
});
router.post('/newaccount', async function(req, res, next) {
    req.check('first_name', 'First name is required').isLength({ min: 1 }).trim();
    req.check('last_name', 'Last name is required').isLength({ min: 1 }).trim();
    req.check('relationship', 'Relationship is required').isLength({ min: 1 }).trim();
    req.check('email', 'Invalid email address').isEmail();

    var valid_err = req.validationErrors();
    if (valid_err) { res.json({ status: false, msg: valid_err }); return; }
    var randompas = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
    var company_id = models.timeuuidFromString(userCompany_id[req.session.user_id]);

    var getuser_company = await new Promise((resolve, reject) => {
        models.instance.Users.find({ email: req.body.email, is_delete: 0 }, { raw: true, allow_filtering: true }, function(err, user) {
            if (err) {
                console.trace(err);
                reject({ status: false, error: err });
            } else {
                resolve(user);
            }
        });
    });
    if (getuser_company.length) { // old user 
        var res1 = [];
        if (req.body.phone) {
            if (req.body.phone != getuser_company[0].phone_optional) {
                res1 = await new Promise(r => {
                    models.instance.Users.find({ phone_optional: req.body.phone, is_delete: 0 }, { raw: true, allow_filtering: true },
                        async function(err1, res1) {
                            if (err1) console.trace(err1);
                            else return r(res1);
                        });
                });
            }
        }
        if (res1.length) {
            var getchk = { status: false, phone: res1.length };
        } else {
            var getchk = { status: true, phone: res1.length };
        }
        if (getchk.status) {
            models.instance.Users.update({ id: getuser_company[0].id }, {
                student_list: { '$add': [req.body.student_id] },
                relationship_map: {
                    '$add': {
                        [req.body.student_id]: req.body.relationship
                    }
                }
            }, update_if_exists, function(err) {
                if (err) console.trace(err);

                models.instance.Users.update({ id: models.uuidFromString(req.body.student_id) }, { parent_list: { '$add': [getuser_company[0].id.toString()] } }, update_if_exists, async function(err) {
                    if (err) console.trace(err);

                    req.session.login = true;
                    req.session.parent_list = req.session.parent_list || [];
                    req.session.parent_list.push(getuser_company[0].id.toString());
                    req.session.save();
                    var parent_info = await getStudentInfo([getuser_company[0].id.toString()]);
                    res.json({ status: true, msg: 'add', parent_info: parent_info[0] });
                });
            });
        } else {
            res.json({ status: true, msg: 'exist' });

        }

    } else { // new parent user
        let getchk = await checkEmailPhone(req.body);
        if (getchk.status) {
            models.instance.Users.execute_query("select count(*) from users;", {}, function(err, total_users) {
                if (err) console.trace(err);
                else {
                    var user_count = (Number(total_users.rows[0].count));
                    var uid = models.uuid();
                    var new_user = {
                        id: uid,
                        email: req.body.email,
                        fullname: req.body.first_name + ' ' + req.body.last_name,
                        password: passwordToHass(randompas.toString()),
                        dept: "School",
                        designation: req.body.designation,
                        img: 'img.png',
                        created_by: uid.toString(),
                        conference_id: models.timeuuid().toString() + '_personal',
                        company_id: company_id,
                        role: "Parent User",
                        is_delete: 0,
                        roll_number: String(user_count + 1).padStart(5, '0'),
                        campus: req.body.campus,
                        student_list: [req.body.student_id],
                        relationship_map: {
                            [req.body.student_id]: req.body.relationship
                        }
                    }
                    if (req.body.phone) {
                        new_user.phone = [req.body.phone],
                            new_user.phone_optional = req.body.phone
                    }
                    var user = new models.instance.Users(new_user);
                    user.saveAsync().then(function() {
                        models.instance.Users.update({ id: models.uuidFromString(req.body.student_id) }, { parent_list: { '$add': [uid.toString()] } }, update_if_exists, function(err) {
                            if (err) console.trace(err);

                            req.session.parent_list = req.session.parent_list || [];
                            req.session.parent_list.push(uid.toString());
                            req.session.save();

                            var emaildata = {
                                to: [req.body.email],
                                sub: 'Login info from bd freeli',
                                text: 'Login info from bd freeli. Your password is: ' + randompas
                            }
                            email.send(emaildata, async(result) => {
                                if (result.msg == 'success') {
                                    var parent_info = await getStudentInfo([uid.toString()]);
                                    res.json({ status: true, msg: 'new', parent_info: parent_info[0] });

                                } else res.redirect('/covid/signup/' + req.body.student_id);
                            });
                        })
                    }).catch(function(err) {
                        console.log(err);
                    });

                }

            });
        } else {
            res.json({ status: true, msg: 'exist' });

        }
    }

});
router.post('/newaccount_public_check', async function(req, res, next) {
    if (req.session.login) {
        res.send("Please logout then try again.")
    } else {
        var findqry = { is_delete: 1 };
        // var findqry = {};
        if (req.body.email_phone_status == 'email') findqry.email = req.body.email_phone_val.trim();
        if (req.body.email_phone_status == 'phone') findqry.phone_optional = req.body.email_phone_val.trim();
        if (isUuid(req.body.user_id)) findqry.id = models.uuidFromString(req.body.user_id);
        models.instance.Users.findOne(findqry, { raw: true, allow_filtering: true }, async function(err, public_info) {
            if (err) {
                console.trace(err);
                res.json({ status: 'error', err });
            } else {
                if (req.body.action_type == 'Continue') {
                    if (public_info) { // public already exists
                        res.json({
                            status: 'next',
                            firstname: public_info.firstname ? public_info.firstname : '',
                            lastname: public_info.lastname ? public_info.lastname : '',
                            email: public_info.email ? public_info.email : '',
                            phone_optional: public_info.phone_optional ? public_info.phone_optional : '',
                            user_id: public_info.id.toString()
                        });
                    } else {
                        res.json({
                            status: 'next',
                            firstname: '',
                            lastname: '',
                            email: req.body.email_phone_status == 'email' ? req.body.email_phone_val.trim() : '',
                            phone_optional: req.body.email_phone_status == 'phone' ? req.body.email_phone_val.trim() : '',
                            user_id: 0
                        });
                    }

                } else { // submit
                    if (isUuid(req.body.user_id)) { // old user
                        var res1 = [];
                        var res2 = [];
                        if (req.body.phone) {
                            if (req.body.phone != req.body.phone_db) {
                                res1 = await new Promise(r => {
                                    models.instance.Users.find({ phone_optional: req.body.phone, is_delete: 1 }, { raw: true, allow_filtering: true }, async function(err1, res1) {
                                        if (err1) console.trace(err1);
                                        else return r(res1);
                                    });
                                });
                            }
                        }
                        if (req.body.email) {
                            if (req.body.email != req.body.email_db) {
                                res2 = await new Promise(r => {
                                    models.instance.Users.find({ email: req.body.email, is_delete: 1 }, { raw: true, allow_filtering: true },
                                        async function(err2, res2) {
                                            if (err2) console.trace(err2);
                                            else return r(res2);
                                        });

                                });
                            }
                        }
                        if (res1.length || res2.length) {
                            var getchk = { status: false, phone: res1.length, email: res2.length };
                        } else {
                            var getchk = { status: true, phone: res1.length, email: res2.length };
                        }

                        if (getchk.status) {
                            models.instance.Users.update({ id: models.uuidFromString(req.body.user_id) }, {
                                firstname: req.body.first_name,
                                lastname: req.body.last_name,
                                fullname: req.body.first_name + ' ' + req.body.last_name,
                                phone_optional: req.body.phone,
                                email: req.body.email.trim()
                            }, update_if_exists, function(err) {
                                if (err) {
                                    console.trace(err);
                                    res.json({ status: 'error', err });
                                } else {
                                    var user_id = req.body.user_id;
                                    req.session.user_id = user_id;
                                    req.session.user_fullname = req.body.first_name + ' ' + req.body.last_name;
                                    if (public_info) {
                                        req.session.user_email = public_info.email ? public_info.email : '';
                                        req.session.user_img = public_info.img ? public_info.img : '';
                                        req.session.user_role = "Public User";
                                        if (req.body.company_id) {
                                            req.session.company_id = req.body.company_id;
                                        } else {
                                            req.session.company_id = public_info.company_id ? public_info.company_id.toString() : '';
                                        }

                                    }

                                    res.json({ status: 'url', url: '/covid/mobile_survey/survey/' + req.body.date_of + '/' + req.session.user_id + '/' + req.session.company_id });

                                    models.instance.Covid_Survey.find({
                                        student_id: models.uuidFromString(req.body.user_id)
                                    }, { allow_filtering: true }, function(err, user_data) {
                                        if (err) console.trace(err);
                                        else {
                                            if (user_data && user_data.length) {
                                                for (let user of user_data) {
                                                    if (user.date_of == req.body.date_of) {
                                                        if (user.answer_result == 'no' && user.user_role == 'Public User' && req.session.public_type && req.session.public_type == 'auto') {
                                                            var checkin_date = new Date();
                                                            var checkin_set = req.session.company_id + '@' + req.session.company_name + '@' + String(Date.now());
                                                            console.log(user.row_id.toString())
                                                            models.instance.Covid_Survey.update({
                                                                row_id: user.row_id,
                                                                student_id: models.uuidFromString(req.body.user_id),
                                                            }, {
                                                                checkin: checkin_date,
                                                                checkin_set: { '$add': [checkin_set] },
                                                                checkin_company: { '$add': [req.session.company_id] },
                                                                answer_result: 'no',
                                                                checkin_deny: false,
                                                                checkin_location: req.session.company_name

                                                            }, update_if_exists, function(err) {
                                                                if (err) console.trace(err);
                                                                // new_form.checkin = checkin_date;
                                                                // new_form.checkin_location = company_info.company_name;
                                                                // res.json({ status: true, data: req.body, answer_result, filled_by, new_form, row_id: String(row_id) });

                                                            });

                                                        }
                                                    }
                                                    user.student_name = req.session.user_fullname;
                                                    user.student_email = req.session.user_email;
                                                    user.save(function(err) {
                                                        if (err) console.log(err);
                                                        else console.log('Yuppiie!');
                                                    });

                                                }

                                            }

                                        }


                                    });

                                }

                            });
                        } else {
                            res.json({ status: 'exist', email: getchk.email, phone: getchk.phone });

                        }

                    } else { // new user
                        // let getchk = await checkEmailPhone(req.body);
                        var res1 = [];
                        var res2 = [];
                        if (req.body.phone) {
                            res1 = await new Promise(r => {
                                models.instance.Users.find({ phone_optional: req.body.phone, is_delete: 1 }, { raw: true, allow_filtering: true }, async function(err1, res1) {
                                    if (err1) console.trace(err1);
                                    else return r(res1);
                                });

                            });
                        }
                        if (req.body.email) {
                            res2 = await new Promise(r => {
                                models.instance.Users.find({ email: req.body.email, is_delete: 1 }, { raw: true, allow_filtering: true }, async function(err2, res2) {
                                    if (err2) console.trace(err2);
                                    else return r(res2);
                                });

                            });
                        }
                        if (res1.length || res2.length) {
                            var getchk = { status: false, phone: res1.length, email: res2.length };
                        } else {
                            var getchk = { status: true, phone: res1.length, email: res2.length };
                        }
                        if (getchk.status) {
                            // if (req.body.first_name && req.body.last_name) {
                            if (req.body.company_id) {
                                var company_id = req.body.company_id;
                            } else {
                                var company_id = '0f2420a0-a9b6-11eb-b4d4-d8aa6b4bb57d';
                            }
                            models.instance.Users.execute_query("select count(*) from users;", {}, function(err, total_users) {
                                if (err) console.trace(err);
                                else {
                                    var user_count = (Number(total_users.rows[0].count));
                                    var uid = models.uuid();
                                    var new_user = {
                                        id: uid,
                                        email: req.body.email,
                                        firstname: req.body.first_name,
                                        lastname: req.body.last_name,
                                        fullname: req.body.first_name + ' ' + req.body.last_name,
                                        password: '',
                                        is_delete: 1,
                                        dept: "School",
                                        img: 'img.png',
                                        created_by: uid.toString(),
                                        conference_id: models.timeuuid().toString() + '_personal',
                                        company_id: models.timeuuidFromString(company_id),
                                        role: "Public User",
                                        roll_number: String(user_count + 1).padStart(5, '0'),
                                        phone_optional: req.body.phone

                                    }
                                    if (req.body.phone) {
                                        new_user.phone = [req.body.phone]
                                    }
                                    var user = new models.instance.Users(new_user);
                                    user.saveAsync().then(function() {
                                        // req.session.success = true;
                                        // req.session.login = true;
                                        req.session.user_id = String(uid);
                                        req.session.user_fullname = req.body.first_name + ' ' + req.body.last_name;
                                        req.session.user_email = req.body.email;
                                        req.session.user_img = 'img.png';
                                        req.session.user_role = "Public User";
                                        req.session.company_id = company_id;
                                        res.json({ status: 'url', url: '/covid/mobile_survey/survey/' + req.body.date_of + '/' + req.session.user_id + '/' + req.session.company_id });
                                    }).catch(function(err) {
                                        console.log(err);
                                    });

                                }

                            });

                            // }
                        } else {
                            res.json({ status: 'exist', email: getchk.email, phone: getchk.phone });

                        }

                    }


                }

            }


        });
    }
});

function checkEmailPhone(req_body, status = false) {
    return new Promise(async(resolve, reject) => {
        if (status) {
            if (status == 'phone') {
                if (req_body.email) {
                    models.instance.Users.find({ email: req_body.email }, { raw: true, allow_filtering: true }, async function(err2, res2) {
                        if (err2) console.trace(err2);
                        if (res2 && res2.length) {
                            resolve({ status: false, phone: 0, email: res2.length });
                        } else {
                            resolve({ status: true, phone: 0, email: res2.length });
                        }

                    });

                } else {
                    resolve({ status: true, phone: 0, email: 0 });

                }

            } else if (status == 'email') {
                if (req_body.phone) {
                    models.instance.Users.find({ phone_optional: req_body.phone }, { raw: true, allow_filtering: true }, async function(err2, res1) {
                        if (err2) console.trace(err2);
                        if (res1 && res1.length) {
                            resolve({ status: false, phone: res1.length, email: 0 });
                        } else {
                            resolve({ status: true, phone: res1.length, email: 0 });
                        }

                    });

                } else {
                    resolve({ status: true, phone: 0, email: 0 });

                }
            }
        } else {
            var res1 = [];
            var res2 = [];
            if (req_body.phone) {
                res1 = await new Promise(r => {
                    models.instance.Users.find({ phone_optional: req_body.phone, is_delete: 0 }, { raw: true, allow_filtering: true }, async function(err1, res1) {
                        if (err1) console.trace(err1);
                        else return r(res1);
                    });

                });
            }
            if (req_body.email) {
                res2 = await new Promise(r => {
                    models.instance.Users.find({ email: req_body.email, is_delete: 0 }, { raw: true, allow_filtering: true }, async function(err2, res2) {
                        if (err2) console.trace(err2);
                        else return r(res2);
                    });
                });
            }
            if (res1.length || res2.length) {
                resolve({ status: false, phone: res1.length, email: res2.length });
            } else {
                resolve({ status: true, phone: res1.length, email: res2.length });
            }

        }
    })
};


router.get('/newaccount', async function(req, res, next) {
    req.session.login = false;
    res.redirect('/');
    // res.render('signup_mailing', {
    //   page_title: 'Signup', title: 'Signup | NEC', bodyClass: 'centered-form',
    //   success: req.session.success, error: req.session.error, has_login: false, email: req.body.email
    // });
});
router.get('/signup_mailing', async function(req, res, next) {
    // req.session.login = false;
    // res.redirect('/');
    res.render('signup_mailing', {
        page_title: 'Signup',
        title: 'Signup | NEC',
        bodyClass: 'centered-form',
        success: req.session.success,
        error: req.session.error,
        has_login: false,
        email: req.body.email
    });
});
router.post('/submit2', function(req, res, next) {
    var answer_list = {};
    for (let property in req.body) {
        if (property == 'student_id_form') {
            var student_id = req.body[property];
        } else if (property == 'date_of_form') {
            var date_of = req.body[property];
        } else if (property == 'user_id_form') {
            var user_id = req.body[property];
        } else if (property == 'user_role_form') {
            var user_role = req.body[property];
        } else if (property == 'company_id_form') {
            var company_id = req.body[property];
        } else if (property == 'row_id_form') {
            var row_id_form = req.body[property];
        } else if (property == 'student_name_form') {
            var student_name_form = req.body[property];
        } else {
            answer_list[property] = req.body[property];
        }
    }
    var count_yes = 0;
    for (let al in answer_list) {
        if (answer_list[al] == 'yes') count_yes++;
    }
    var answer_result = count_yes == 0 ? 'no' : 'yes';
    var filled_by = req.session.user_fullname;

    models.instance.Users.findOne({ id: models.uuidFromString(student_id) }, { raw: true, allow_filtering: true }, function(err, student_info) {
        if (err) {
            if (err) console.trace(err);

        } else {
            if (company_id) {

            } else {
                company_id = student_info.company_id.toString();

            }

            models.instance.Company.findOne({ company_id: models.timeuuidFromString(company_id) }, { raw: true, allow_filtering: true }, function(err, company_info) {
                if (err) {
                    if (err) console.trace(err);
                } else {
                    if (row_id_form == 'null') {
                        var row_id = models.timeuuid();
                    } else {
                        row_id = models.timeuuidFromString(row_id_form);
                    }
                    console.log(row_id.toString());
                    var new_form = {
                        row_id: row_id,
                        student_id: models.uuidFromString(student_id),
                        student_name: student_info.fullname,
                        section: student_info.section,
                        campus: student_info.campus,
                        class: student_info.class,
                        dept: student_info.dept,
                        designation: student_info.designation,
                        roll_number: student_info.roll_number,
                        student_email: student_info.email,
                        student_img: student_info.img,
                        user_role: student_info.role,
                        date_of: date_of,
                        company_id: company_id,
                        company_name: company_info.company_name,

                        answer_list: answer_list,
                        answer_result: answer_result,
                        created_by: user_id,
                        updated_by: user_id,
                        filled_by: filled_by,
                        submit_utc: String(moment().unix()),

                    }




                    var submit_form = new models.instance.Covid_Survey(new_form);
                    submit_form.saveAsync().then(function() {
                        console.log('ok');

                        if (answer_result == 'no' && student_info.role == 'Public User' && req.session.public_type && req.session.public_type == 'auto') {
                            var checkin_date = new Date();
                            var checkin_set = company_id + '@' + company_info.company_name + '@' + String(Date.now());

                            models.instance.Covid_Survey.update({
                                row_id: row_id,
                                student_id: models.uuidFromString(student_id),
                            }, {
                                checkin: checkin_date,
                                checkin_set: { '$add': [checkin_set] },
                                checkin_company: { '$add': [company_id] },
                                answer_result: 'no',
                                checkin_deny: false,
                                checkin_location: company_info.company_name

                            }, update_if_exists, function(err) {
                                if (err) console.trace(err);
                                new_form.checkin = checkin_date;
                                new_form.checkin_location = company_info.company_name;
                                res.json({ status: true, data: req.body, answer_result, filled_by, new_form, row_id: String(row_id) });

                            });

                        } else {
                            res.json({ status: true, data: req.body, answer_result, filled_by, new_form, row_id: String(row_id) });
                        }

                    }).catch(function(err) {
                        console.log(err);
                    });
                }




            });

        }


    });

    // }



});
router.post("/return_login", function(req, res, next) {
    req.session.regenerate((err) => {
        console.log(err);
        // res.redirect('/');
        res.json({ status: true });
    });
});
router.post("/read_qrcode", function(req, res, next) {
    console.log(req.body.qrcode);
    if (isUuid(req.body.qrcode)) {
        models.instance.Covid_Survey.findOne({
            date_of: req.body.date,
            student_id: models.uuidFromString(req.body.qrcode)
        }, { raw: true, allow_filtering: true }, function(err, res1) {
            if (err) console.trace(err);
            if (res1) {
                res.status(200).send({ user_info: res1, msg: 'success' });
            } else {
                res.status(200).send({ user_info: {}, msg: 'nodata' });
            }
        });
    } else {
        res.status(200).send({ user_info: {}, msg: 'nouser' });
    }

});
router.post("/removeStudentParent", function(req, res, next) {
    console.log(req.body.user_id);
    if (isUuid(req.body.user_id)) {
        models.instance.Users.update({ id: models.uuidFromString(req.body.user_id) }, { parent_list: { '$remove': [req.body.student_id] } },
            update_if_exists,
            function(err) {
                if (err) console.trace(err);
                if (req.session.parent_list.length) {
                    const index = req.session.parent_list.indexOf(req.body.student_id);
                    if (index > -1) {
                        req.session.parent_list.splice(index, 1);
                    }
                    req.session.save();
                }

                res.status(200).send({ user_info: {}, msg: 'success' });
            });

    } else {
        res.status(200).send({ user_info: {}, msg: 'nouser' });
    }

});

router.post('/skip_login', function(req, res, next) {
    req.session.login = true;
    // res.redirect('/covid');
    res.json({ status: true, 'url': '/covid/mobile' });
});
// ========== report ========================

const arrayUnion = (arr1, arr2, identifier) => {
    const array = [...arr1, ...arr2]

    return _.uniqBy(array, identifier)
}
const arrayUnion3 = (arr1, arr2, arr3, identifier) => {
    const array = [...arr1, ...arr2, ...arr3]

    return _.uniqBy(array, identifier)
}

router.post('/get_report_today', function(req, res, next) {
    if (userCompany_id[req.session.user_id]) {
        var search_obj = { company_id: req.body.user.company_id };
        // var search_obj = { company_id: userCompany_id[req.session.user_id] };
        // var search_obj = {};
        for (let rb in req.body.user) {
            if (req.body.user[rb]) { search_obj[rb] = req.body.user[rb].trim(); }
        }

        for (let rb in req.body.date) {
            if (req.body.date[rb]) {
                if (!search_obj.date_of) search_obj.date_of = {};
                if (rb == 'start_date') {
                    search_obj.date_of.$gte = req.body.date[rb];
                } else {
                    search_obj.date_of.$lte = req.body.date[rb];
                }
            }
        }

        models.instance.Covid_Survey.find(search_obj, { raw: true, allow_filtering: true }, function(err, res_name) {
            if (err) {
                console.trace(err);
                res.status(503).send(err);
                return;
            }

            if (search_obj.hasOwnProperty('company_id')) delete search_obj.company_id;
            search_obj['checkin_company'] = { $contains: req.body.user.company_id }

            models.instance.Covid_Survey.find(search_obj, { raw: true, allow_filtering: true }, async function(err, res_com) {
                if (err) {
                    console.trace(err);
                    res.status(503).send(err);
                    return;
                }

                res_name.map(function getFullName(item, ii) {
                    for (let vv in res_name[ii]) { if (res_name[ii][vv] == null) res_name[ii][vv] = ''; }
                    return item.student_id;
                });
                res_com.map(function getFullName(item, ii) {
                    for (let vv in res_com[ii]) { if (res_com[ii][vv] == null) res_com[ii][vv] = ''; }
                    return item.student_id;
                });

                var res1 = (arrayUnion(res_name, res_com, 'roll_number'));
                res.status(200).send({ res1 });
            });

        });
    }

});
router.post("/search_student_campus", function(req, res, next) {
    if (userCompany_id[req.session.user_id]) {
        // var search_obj = { company_id: req.body.user.company_id };
        var search_obj = {};
        for (let rb in req.body.user) {
            if (rb == 'student_name') {
                // if (req.body.user[rb]) { search_obj[rb] = { '$like': '%' + req.body.user[rb].trim() + '%' } }
            } else {
                if (req.body.user[rb]) { search_obj[rb] = req.body.user[rb].trim(); }
            }
        }

        for (let rb in req.body.date) {
            if (req.body.date[rb]) {
                if (!search_obj.date_of) search_obj.date_of = {};
                if (rb == 'start_date') {
                    search_obj.date_of.$gte = req.body.date[rb];
                } else {
                    search_obj.date_of.$lte = req.body.date[rb];
                }
            }
        }
        if (search_obj.hasOwnProperty('company_id')) delete search_obj.company_id;
        models.instance.Covid_Survey.find(search_obj, { raw: true, allow_filtering: true }, async function(err, res_name) {
            if (err) {
                console.trace(err);
                res.status(503).send(err);
                return;
            }

            if (search_obj.hasOwnProperty('student_name')) delete search_obj.student_name;
            if (req.body.user.student_name) search_obj['roll_number'] = req.body.user.student_name;

            models.instance.Covid_Survey.find(search_obj, { raw: true, allow_filtering: true }, async function(err, res_roll) {
                if (err) {
                    console.trace(err);
                    res.status(503).send(err);
                    return;
                }

                if (search_obj.hasOwnProperty('student_name')) delete search_obj.student_name;
                search_obj['checkin_company'] = { $contains: req.body.user.company_id }

                models.instance.Covid_Survey.find(search_obj, { raw: true, allow_filtering: true }, async function(err, res_com) {
                    if (err) {
                        console.trace(err);
                        res.status(503).send(err);
                        return;
                    }

                    res_name.map(function getFullName(item, ii) {
                        for (let vv in res_name[ii]) {
                            if (res_name[ii][vv] == null) res_name[ii][vv] = '';
                            res_name[ii]['row_id'] = String(res_name[ii]['row_id']);
                        }
                        // console.log('res_name', item.row_id, item.roll_number.toString());
                    });
                    res_roll.map(function getFullName(item, ii) {
                        for (let vv in res_roll[ii]) {
                            if (res_roll[ii][vv] == null) res_roll[ii][vv] = '';
                            res_roll[ii]['row_id'] = String(res_roll[ii]['row_id']);
                        }
                        // console.log('res_roll', item.row_id.toString(), item.roll_number.toString());
                    });
                    res_com.map(function getFullName(item, ii) {
                        for (let vv in res_com[ii]) {
                            if (res_com[ii][vv] == null) res_com[ii][vv] = '';
                            res_com[ii]['row_id'] = String(res_com[ii]['row_id']);
                        }
                        // console.log('res_com', item.row_id.toString(), item.roll_number.toString());
                    });

                    var res1 = (arrayUnion3(res_name, res_com, res_roll, 'row_id'));
                    res1.map(function getFullName(item, ii) {
                        // console.log('res1', item.row_id.toString(), item.roll_number.toString());
                    });
                    res.status(200).send({ res1 });
                });
            });
        });

    }
});
// ========== attendance ===============
router.post('/checkin', function(req, res, next) {
    var checkin_date = new Date();
    var checkin_set = req.body.company_id + '@' + req.body.user_campus + '@' + String(Date.now());
    models.instance.Covid_Survey.update({
        row_id: models.timeuuidFromString(req.body.row_id),
        student_id: models.uuidFromString(req.body.student_id),
    }, {
        checkin: checkin_date,
        checkin_set: { '$add': [checkin_set] },
        checkin_company: { '$add': [req.body.company_id] },
        answer_result: 'no',
        checkin_deny: false,
        checkin_location: req.body.user_campus

    }, update_if_exists, function(err) {
        if (err) console.trace(err);
        else res.json({ status: true, checkin_date });
    });
});
router.post('/checkout', function(req, res, next) {
    var checkout_date = new Date();
    var checkout_set = req.body.company_id + '@' + req.body.user_campus + '@' + String(Date.now());
    models.instance.Covid_Survey.update({
        row_id: models.timeuuidFromString(req.body.row_id),
        student_id: models.uuidFromString(req.body.student_id),
    }, {
        checkout: checkout_date,
        checkout_set: { '$add': [checkout_set] },
        answer_result: 'no',
        checkin_deny: false
    }, update_if_exists, function(err) {
        if (err) console.trace(err);
        else res.json({ status: true, checkout_date });
    });


});
router.post('/checkin_deny', function(req, res, next) {
    models.instance.Covid_Survey.update({
        row_id: models.timeuuidFromString(req.body.row_id),
        student_id: models.uuidFromString(req.body.student_id)
    }, { answer_result: 'yes', checkin_deny: true }, update_if_exists, function(err) {
        if (err) console.trace(err);
        else res.json({ status: true });
    });
});


// ===============================
// ==================== signup =================================
router.get('/signup/:student_id/:campus?/:com?/:em?', function(req, res, next) {
    res.render('signup_parent_account', {
        page_title: 'Signup work account | NEC',
        title: 'Signup | NEC',
        bodyClass: 'centered-form',
        success: req.session.success,
        error: req.session.error,
        has_login: false,
        _: _,
        campus: req.params.campus,
        comid: req.params.com == undefined ? "" : req.params.com,
        email: req.params.em == undefined ? "" : req.params.em,
        student_id: req.params.student_id
    });

});
router.get('/signup_student', function(req, res, next) {
    res.render('signup_student_account', {
        page_title: 'Signup student account | NEC',
        title: 'Signup | NEC',
        bodyClass: 'centered-form',
        success: req.session.success,
        error: req.session.error,
        has_login: false,
        _: _,
        // company: data,
        comid: req.params.com == undefined ? "" : req.params.com,
        email: req.params.em == undefined ? "" : req.params.em,
        student_id: req.params.student_id
    });
});
// ======================
// ====================== mobile ======================================
router.get("/", async function(req, res, next) {
    res.redirect("/covid/mobile");
});
router.get("/mobile", async function(req, res, next) {
    if (req.session.login) {
        var student_id = req.session.user_id;
        var student_name_db = '';
        var student_campus_db = '';
        var user_row = null;
        var student_list = [];
        var parent_list = [];
        var student_list_parent = [];
        var my_info = await getStudentInfo([req.session.user_id]);
        if (my_info.length) {
            for (let stinfo of my_info) {
                student_list.push({
                    id: stinfo.id.toString(),
                    fullname: stinfo.fullname,
                    email: stinfo.email,
                    img: stinfo.img,
                    parent_list: stinfo.parent_list,
                    role: stinfo.role,
                    answer_result: stinfo.answer_result ? stinfo.answer_result : 'null',
                    access: stinfo.access

                });
                if (req.session.user_role == 'Student User') parent_list = stinfo.parent_list;
                else if (req.session.user_role == 'Parent User') student_list_parent = stinfo.student_list;
            }
        }
        if (req.session.user_role == 'Student User') {
            if (parent_list && parent_list.length) {
                var parents_info = await getStudentInfo(parent_list);
                if (parents_info) {
                    for (let stinfo of parents_info) {
                        student_list.push({
                            id: stinfo.id.toString(),
                            fullname: stinfo.fullname,
                            email: stinfo.email,
                            img: stinfo.img,
                            parent_list: stinfo.parent_list,
                            role: stinfo.role,
                            answer_result: stinfo.answer_result ? stinfo.answer_result : 'null',
                            access: stinfo.access
                        })
                    }
                }
            }
        } else if (req.session.user_role == 'Admin User') {

        } else {
            if (student_list_parent && student_list_parent.length) {
                var students_info = await getStudentInfo(student_list_parent);
                if (students_info.length) {
                    for (let stinfo of students_info) {
                        student_list.push({
                            id: stinfo.id.toString(),
                            fullname: stinfo.fullname,
                            email: stinfo.email,
                            img: stinfo.img,
                            parent_list: stinfo.parent_list,
                            role: stinfo.role,
                            answer_result: stinfo.answer_result ? stinfo.answer_result : 'null',
                            access: stinfo.access
                        })
                    }
                }
            }
        }

        models.instance.Users.find({
            company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]),
            // dept: 'School'
        }, { raw: true, allow_filtering: true }, function(err, users) {
            if (err) console.trace(err);
            else {
                var myid = [];
                var pin = [];
                var single_chat = [];
                var single_conv_id = [];
                var group_chat_inside_direct_msg = [];
                var group_chat = [];
                var all_pin_conv_id = [];
                var all_users = [];
                var allconvlist = [];
                var all_unpin = [];

                if (users.length) {
                    _.each(users, function(row, key) {
                        all_users.push({
                            id: row.id,
                            createdat: row.createdat,
                            dept: row.dept,
                            designation: row.designation,
                            email: row.email,
                            fullname: row.fullname,
                            gcm_id: row.fcm_id && row.fcm_id.includes('@@@') ? row.fcm_id.split('@@@')[1] : row.fcm_id,
                            img: row.img,
                            is_active: row.is_active,
                            is_busy: row.is_busy,
                            roll: row.roll,
                            access: row.access,
                            conference_id: row.conference_id,
                            company_id: row.company_id
                        });
                        if (row.id.toString() == student_id) {
                            student_name_db = row.fullname;
                        }
                        if (row.id.toString() == req.session.user_id) {
                            student_campus_db = row.campus;
                            user_row = row;
                        }
                        alluserOnLoad[row.id] = row.fullname;
                    });
                }

                myid.push({
                    userid: req.session.user_id,
                    conversation_id: req.session.user_id.toString(),
                    conversation_type: "personal",
                    unread: 0,
                    // users_name: "You",
                    users_name: req.session.user_fullname,
                    users_img: req.session.user_img,
                    pined: true,
                    sub_title: '',
                    last_msg: '',
                    last_msg_time: '',
                    privecy: 'private',
                    totalMember: '1',
                    display: 'success'
                });

                /* old body*/
                models.instance.Company.findOne({ company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]) }, { raw: true, allow_filtering: true }, function(err, company_info) {
                    if (err) console.trace(err);
                    else {
                        var res_data = {
                            url: 'hayven',
                            title: "Connect",
                            bodyClass: "chat",
                            success: req.session.success,
                            error: req.session.error,
                            file_server: process.env.FILE_SERVER,
                            user_id: req.session.user_id,
                            company_id: models.timeuuidFromString(userCompany_id[req.session.user_id]),
                            company_img: company_info && company_info.company_img ? company_info.company_img : 'img.png',
                            company_name: company_info && company_info.company_name ? company_info.company_name : '',
                            user_fullname: req.session.user_fullname,
                            receiver_fullname: req.session.user_fullname,
                            user_email: req.session.user_email,
                            user_img: req.session.user_img,
                            campus: student_campus_db,
                            receiver_img: req.session.user_img,
                            user_role: req.session.user_role,
                            highlight: highlight,
                            conv_history: [],
                            conv_id: "noid",
                            conv_type: "personal",
                            moment: moment,
                            restart_time: restart_time,
                            _: _,
                            all_unread_data: [],
                            has_login: true,
                            page: 'connect',
                            data: [{
                                // all_conv: all_conv,
                                users: all_users,
                                user_row: user_row,
                                groupList: group_chat,
                                pin: pin,
                                myid: myid,
                                unpin: single_chat,
                                group_chat_inside_direct_msg: group_chat_inside_direct_msg,
                                // tags: tags,
                                unread_msg_conv: [],
                                all_unpin: all_unpin
                            }],
                            student_list: student_list
                        };

                        res_data.session_id = req.session.id;
                        res.render('mob_connect_covid', res_data);

                    }

                });
            }

        });
        // });
    } else {
        res.redirect("/");
    }
});
router.get("/public", async function(req, res, next) {
    if (req.session.login) {
        res.send("Please logout then try again.")
    } else {
        req.session.public_type = 'manual';
        res.render('signup_public_account', {
            page_title: 'Signup public account | NEC',
            title: 'Signup | NEC',
            bodyClass: 'centered-form',
            success: req.session.success,
            error: req.session.error,
            has_login: false,
            _: _,
            company_id: ""
                // campus: req.params.campus,
                // comid: req.params.com == undefined ? "" : req.params.com,
                // email: req.params.em == undefined ? "" : req.params.em,
                // student_id: req.params.student_id
        });

    }
});
router.get("/public/:company_id", async function(req, res, next) {
    if (req.session.login) {
        res.send("Please logout then try again.")
    } else if (isUuid(req.params.company_id)) {
        res.render('signup_public_account', {
            page_title: 'Signup public account | NEC',
            title: 'Signup | NEC',
            bodyClass: 'centered-form',
            success: req.session.success,
            error: req.session.error,
            has_login: false,
            _: _,
            // campus: req.params.campus,
            company_id: req.params.company_id,
            // email: req.params.em == undefined ? "" : req.params.em,
            // student_id: req.params.student_id
        });
    } else {
        var company_name = req.params.company_id.replace(/_/g, ' ');
        models.instance.Company.findOne({ company_name: company_name }, { raw: true, allow_filtering: true }, function(err, company_info) {
            if (company_info) {
                req.session.public_type = 'auto';
                req.session.company_name = company_name;
                res.redirect("/covid/public/" + company_info.company_id.toString());
                // res.render('signup_public_account', {
                //     page_title: 'Signup public account | NEC',
                //     title: 'Signup | NEC',
                //     bodyClass: 'centered-form',
                //     success: req.session.success,
                //     error: req.session.error,
                //     has_login: false,
                //     _: _,
                //     // campus: req.params.campus,
                //     company_id: company_info.company_id.toString(),
                //     // email: req.params.em == undefined ? "" : req.params.em,
                //     // student_id: req.params.student_id
                // });

            } else {
                res.send("Sorry, Invalid Company.")
            }

        });

    }

});
router.get("/mobile_survey/:page_type/:date_of/:student_id?/:company_id?", function(req, res, next) {
    if (isUuid(req.params.student_id) && req.session.user_id) {

        if (req.params.student_id) { var student_id = req.params.student_id; } else var student_id = req.session.user_id;
        if (req.params.company_id) { var company_id = req.params.company_id } else { var company_id = userCompany_id[req.session.user_id] }
        var student_name_db = '';
        var student_campus_db = '';
        var student_row = null;
        var user_row = null;

        models.instance.Users.find({
            // company_id: models.timeuuidFromString(company_id),
            // dept: 'School'
        }, { raw: true, allow_filtering: true }, function(err, users) {
            if (err) console.trace(err);
            else {
                var all_users = [];
                if (users.length) {
                    _.each(users, function(row, key) {
                        all_users.push({
                            id: row.id,
                            createdat: row.createdat,
                            dept: row.dept,
                            designation: row.designation,
                            email: row.email,
                            fullname: row.fullname,
                            gcm_id: row.fcm_id && row.fcm_id.includes('@@@') ? row.fcm_id.split('@@@')[1] : row.fcm_id,
                            img: row.img,
                            is_active: row.is_active,
                            is_busy: row.is_busy,
                            roll: row.roll,
                            access: row.access,
                            conference_id: row.conference_id,
                            company_id: row.company_id,
                            phone: row.phone_optional
                        });

                        if (row.id.toString() == student_id) {
                            student_name_db = row.fullname;
                            student_row = row;
                        }
                        if (row.id.toString() == req.session.user_id) {
                            student_campus_db = row.campus;
                            user_row = row;
                        }
                        // alluserOnLoad[row.id] = row.fullname;
                    });
                }

                if (isUuid(student_id)) {
                    models.instance.Covid_Survey.findOne({
                        date_of: { '$gte': String(moment().unix()) },
                        student_id: models.uuidFromString(student_id)
                    }, { raw: true, allow_filtering: true }, function(err, survey_data) {
                        if (err) console.trace(err);
                        else {
                            if (survey_data) {
                                var survey_status = survey_data.answer_result;
                                var filled_by = survey_data.filled_by;
                                var row_id = survey_data.row_id;
                            } else {
                                var survey_status = 'null';
                                var filled_by = 'null';
                                var row_id = 'null';
                            }

                            models.instance.Company.findOne({ company_id: models.timeuuidFromString(company_id) }, { raw: true, allow_filtering: true }, function(err, company_info) {
                                if (err) console.trace(err);
                                else {
                                    var res_data = {
                                        url: 'hayven',
                                        title: "Connect",
                                        bodyClass: "chat",
                                        success: req.session.success,
                                        error: req.session.error,
                                        file_server: process.env.FILE_SERVER,
                                        user_id: req.session.user_id,
                                        company_id: models.timeuuidFromString(company_id),
                                        company_img: company_info && company_info.company_img ? company_info.company_img : 'img.png',
                                        company_name: company_info && company_info.company_name ? company_info.company_name : '',
                                        user_fullname: req.session.user_fullname,
                                        user_email: req.session.user_email,
                                        user_img: req.session.user_img,
                                        session_id: req.session.id,
                                        user_role: req.session.user_role,
                                        student_name: student_name_db ? student_name_db : req.session.user_fullname,
                                        campus: student_campus_db,
                                        student_id: student_id,

                                        page_type: req.params.page_type,
                                        highlight: highlight,
                                        survey_status: survey_status,
                                        filled_by: filled_by,
                                        row_id: row_id,
                                        _: _,
                                        moment: moment,
                                        restart_time: restart_time,
                                        file_message: "No",
                                        has_login: true,
                                        page: 'chat',
                                        data: [{
                                            // all_conv: all_conv,
                                            users: all_users,
                                            student_row: student_row,
                                            user_row: user_row,
                                            survey_data: survey_data,

                                        }],
                                    };
                                    res.render("mob_covid_survey", res_data);

                                }

                            });

                        }
                    });
                } else {
                    res.redirect("/");
                }

            }

        });


    } else {
        res.redirect("/");
    }
});

setTimeout(() => {
    // ============ create company ==============================

    // var saveCompanyAgain = new models.instance.Company({
    //     company_id: models.timeuuidFromString('6ee0f670-c947-11eb-8c9e-186fb8e07177'),
    //     company_name: 'Mira Restaurant',
    //     company_img: 'img.png',
    //     // created_at: new Date(),
    //     // updated_at: new Date(),
    //     // created_by: companyFind[0].created_by,
    //     // updated_by: data.updated_by,

    // });
    // saveCompanyAgain.saveAsync()
    //     .then(function(res) {
    //         console.log(res);
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //     });

    // ============ update company ===================================

    // models.instance.Company.update({ company_id: models.timeuuidFromString('6ee0f670-c947-11eb-8c9e-186fb8e07177'), company_name: 'mira' }, 
    // { company_name: 'Mira Restaurant' }, function(uperr) {
    //     if (uperr) console.log(uperr);

    // });

    // ============ create users =============================

    // var new_user = {
    //     id: models.uuid(),
    //     email: 'admin.family@demo.com',
    //     fullname: 'admin.family@demo.com',
    //     company_id: models.timeuuidFromString('276c5a51-8dde-11ea-9c84-f76c17890d27'),
    //     designation: "Admin",
    //     role: "Admin User",
    //     campus: 'Family Bazar',

    //     dept: "Business",
    //     img: 'img.png',
    //     password: passwordToHass('a123456'),
    //     conference_id: models.timeuuid().toString() + '_personal',

    //     // created_by: '896c2fc4-deb9-4dcf-b64f-9b59c349ec54',
    // }
    // var user = new models.instance.Users(new_user);
    // user.saveAsync().then(function() {
    //     console.log('NEW USER CREATED')
    // }).catch(function(err) {
    //     console.log(err)
    // });

    // ============== update users =============================

    // var roll = 0;
    // models.instance.Users.find({}, { allow_filtering: true }, function(err, all_users) {
    //     if (err) throw err;
    //     if (all_users) {
    //         for (let usr of all_users) {
    //             roll++;
    //             usr.roll_number = String(roll).padStart(5, '0');
    //             // if (!usr.campus) {
    //             //     usr.campus = 'Workfreeli';
    //             // }
    //             usr.save(function(err) {
    //                 if (err) console.log(err);
    //                 else console.log('Yuppiie!');
    //             });

    //             // =================update survey access
    //             // models.instance.Users.update({ id: usr.id }, { access: { $add: [1700] } }, update_if_exists, function(err) {
    //             //     console.log(err);
    //             // });
    //         }

    //     }
    // });

}, 10000);


module.exports = router;