require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var {optionError} = require('./InternalModules')

module.exports = function UpdateStack(formName, templateBody, callback) {
  console.log("hello")
  if(!templateBody || typeof templateBody === "function"){
    if(typeof templateBody === "function"){
      callback = templateBody;
    }
    fs.readFile(`forms/${formName}/template.json`, 'utf8', function(err, data){
      if(err) optionError(err, callback)
      else stackupdate(formName, data, callback)
    });
  }
  else {
    stackupdate(formName, templateBody, callback)
  }
}


function stackupdate(formName, templateBody, callback){
  console.log(templateBody)
	var params = {
    StackName: `${formName}Form`,
    TemplateBody: templateBody,
    TimeoutInMinutes: 5,
    Capabilities: [
      "CAPABILITY_NAMED_IAM"
    ]
  };
  console.log(1)
  cloudformation.updateStack(params, function(err, data) {
    console.log(2)
    if (err) {
      console.log(err, err.stack); // an error occurred
    } 
    else {
      console.log("the Cloudformation Stack is being updated")
      cloudformation.waitFor('stackCreateComplete', params, function(err, data) {
        if (err) {
          optionError(err, callback)
        }
        else {
          console.log("the Cloudformation Stack has been created succesfully!")
          if(callback && typeof callback === 'function'){
            callback(null, 'done');
          }
          else return 'done'
        }
      });
    }    
  });
}
  