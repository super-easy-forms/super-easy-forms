//Import .env
require('dotenv').config();
//package to use the file system
var fs = require("fs");
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

var createTemplate = require('./create-template.js');

var addVar = require('./addVars.js');

const myFormModel = {
  "id": {
    "type": "string"
  },
  "name": {
    "type": "string"
  },
  "message": {
    "type": "string"
  }
}

const myRequiredFields = ["id", "name", "message"]

const emailArn = "arn:aws:ses:us-east-1:519275522978:identity/mailer@torus-digital.com";


module.exports = function deployStack(formName) {
	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: createTemplate(formName, myFormModel, myRequiredFields, emailArn),
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
      addVar(formName, "stackId",data.StackId);
    }    
  });
}
