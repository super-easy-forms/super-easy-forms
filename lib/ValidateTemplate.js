//import necessary stuff
require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require("fs");
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var {optionCallback, optionError} = require('./InternalModules')

//check that the created template is good
module.exports = function ValidateTemplate(formName, templateBody, callback){
  callback = optionCallback(templateBody, callback)
  if(!templateBody || typeof templateBody === "function"){
    var templateBody = fs.readFileSync(`forms/${formName}/template.json`, 'utf8');  
  }
  var params = {
    TemplateBody: templateBody,
  };
  cloudformation.validateTemplate(params, function(err, data) {
    if(err) {
      optionError(err, callback)
      return false;
    }
    else {
      if(callback && typeof callback === 'function'){
        callback(null, true);
      }
      else{
        return true;
      }
    }
  });
}