//import necessary stuff
require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require("fs");
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

//check that the created template is good
module.exports = function ValidateTemplate(formName, templateString){
  if(!templateString){
    let rawdata = fs.readFileSync(`forms/${formName}/template.json`);  
    let obj = JSON.parse(rawdata);
    var templateString = JSON.stringify(obj);
  }
  var params = {
    TemplateBody: templateString,
  };
  cloudformation.validateTemplate(params, function(err, data) {
    if(err) {
      console.error(err, err.stack);
      return false;
    }
    else {
      console.log(data);
      return true;
    }
  });
}