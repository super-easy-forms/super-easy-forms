//Import .env
require('dotenv').config();
//package to use the file system
var fs = require("fs");
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

var createTemplate = require('./create-template.js');

var getEndpoint = require('./get-endpoint.js')

var addVar = require('./addVars.js');

module.exports = function deployStack(formName, formFields) {
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  let obj = JSON.parse(rawdata);

  //let formFields = obj.fields
  var myFormModel = {"id": {"type": "string"}};
  Object.keys(formFields).map(function(key, index) {
    myFormModel[key] = {"type": "string"};
  });
  var myRequiredFields = ["id"];
  let i = 1;
  Object.keys(formFields).map(function(key, index) {
    let val = formFields[key]
    if(val["required"]){
      myRequiredFields[i] = key
      i += 1;
    }
  });
	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: createTemplate(formName, myFormModel, myRequiredFields, obj.emailArn),
    TimeoutInMinutes: 5,
    Capabilities: [
      "CAPABILITY_NAMED_IAM"
    ]
  };
  cloudformation.createStack(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } 
    else {
      console.log(`Succesfully deployed the stack with ARN ${data.StackId}`); // successful response
      addVar(formName, "stackId", data.StackId);
      getEndpoint(formName, data.StackId);
    }    
  });
}
