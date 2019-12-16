require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var {optionError} = require('./InternalModules')

module.exports = function DeleteStack(formName, callback) {
  var params = {
    StackName: `${formName}Form`,
  };
  cloudformation.deleteStack(params, function(err, data){
    if(err) {
      optionError(err, callback)
    }
    else {
      cloudformation.waitFor('stackDeleteComplete', params, function(err, data) {
        if (err) {
          optionError(err, callback)
        }
        else {
          console.log("the Cloudformation Stack has been deleted succesfully!")
          if(callback && typeof callback === 'function'){
            callback(null, 'done');
          }
          else return 'done'
        }
      });
    }
  });
}