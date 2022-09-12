var app = require('express');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
// var urlMetadata = require('url-metadata');
// var ogs = require('open-graph-scraper');
const metascraper = require('metascraper');
const got = require('got');
var router = app.Router();

var {models} = require('./../config/db/express-cassandra');
const cheerio = require('cheerio');

var { hayvenjs } = require('./../utils/hayvenjs');



var get_conv_links = (convid) =>{
  return new Promise((resolve, reject) => {
    models.instance.Link.find({ conversation_id: models.uuidFromString(convid) }, { raw: true, allow_filtering: true }, function(err, links) {
        if (err) {
            reject({ status: false, error: err });
        } else {
            console.log(links.length);
            resolve(links);
        }
    });
  });
}

var create_conv_link = (data,callback)=>{
  var allQ = [];
  _.each(data.url_list,function(v,k){
    var linkdata = {
        msg_id: data.msg_id,
        conversation_id:models.uuidFromString(data.conversation_id),
        user_id:models.uuidFromString(data.user_id),
        url:v,
        secret_user:(data.secret_user == undefined? []:data.secret_user)
    }
    if(data.root_conv_id != undefined){
      linkdata['root_conv_id'] = data.root_conv_id;
    }
    var newlinkdata = new models.instance.Link(linkdata);
    var returnQu = newlinkdata.save({ return_query: true });
    allQ.push(returnQu);
  });

  models.doBatch(allQ, function(err){
    if(err){
      callback({status:false,msg:err})
    }
    else {
      callback({status:true,msg:'success'});
    }
  });
}
var hidethisurl = (data,callback)=>{
  var q = {conversation_id:models.uuidFromString(data.conversation_id),url_id:models.timeuuidFromString(data.url_id)};
  var u = {
    has_delete:{$add:[data.user_id]}
  }
  models.instance.Link.update(q,u,function(err,result){
    if(err){
      conosle.log(err);
    }else{
      callback({status:true})
    }
  })
}
var hidethisurl_forAll = (data,callback)=>{
  var q = {conversation_id:models.uuidFromString(data.conversation_id),url_id:models.timeuuidFromString(data.url_id)};
  var u = {
    has_delete:{$add:['delete_for_all']}
  }
  models.instance.Link.update(q,u,function(err,result){
    if(err){
      conosle.log(err);
    }else{
      console.log(66,result)
      callback({status:true})
    }
  })
}
var delete_selected_link = (data,callback)=>{
  // var q = {conversation_id:models.uuidFromString(data.conversation_id),url_id:models.timeuuidFromString(data.url_id)};
  // var u = {
  //   has_delete:{$add:[data.user_id]}
  // }
  // models.instance.Link.update(q,u,function(err,result){
  //   if(err){
  //     conosle.log(err);
  //   }else{
  //     callback({status:true})
  //   }
  // })
  var linkupQ = [];
  _.each(data.url_id,function(v,k){
     var q = models.instance.Link.update({conversation_id:models.uuidFromString(data.conversation_id),url_id:models.timeuuidFromString(v)},{has_delete:{$add:[data.user_id]}})
      // var msave_queryR = q.save({ return_query: true });
      linkupQ.push(q);
  });
  if(linkupQ.length > 0){
    models.doBatch(linkupQ, function(err){
      if(err){
        callback({status:false});
      }
      else {
        callback({status:true});
      }
    });
  }
}

module.exports = {get_conv_links, create_conv_link,hidethisurl,hidethisurl_forAll,delete_selected_link};
