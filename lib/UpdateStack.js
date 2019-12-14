require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var {optionError} = require('./InternalModules')

module.exports = function UpdateStack(formName, templateBody, callback) {
  if(!templateBody || typeof templateBody !== "string"){
    if(typeof templateBody === "function"){
      callback = templateBody;
    }
    else if (templateBody) {
      let err = "template body must be a string"
      throw new Error(err)
    }
    else {
      templateBody = fs.readFileSync(`forms/${formName}/template.json`, 'utf8');
    }
  }
	var params = {
    StackName: `${formName}Form`,
    TemplateBody: templateBody,
    TimeoutInMinutes: 5,
    Capabilities: [
      "CAPABILITY_NAMED_IAM"
    ]
  };
  cloudformation.updateStack(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } 
    else {
      if (err) {
        optionError(err, callback)
      }
      else {
        console.log("the Cloudformation Stack has been updated succesfully!")
        if(callback && typeof callback === 'function'){
          callback(null, data.StackId);
        }
        else return data.StackId
      }
    }    
  });
}