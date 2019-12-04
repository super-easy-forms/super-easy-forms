//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
const createLambda = require('./create-lambda');
const createTemplate = require('./create-template');

const sourceEmail = "mailer@torus-digital.com";
const emailArn = "arn:aws:ses:us-east-1:519275522978:identity/mailer@torus-digital.com";
const form = "testform";
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

const myFormFields = {
  "id":"id",
  "name":"name",
  "message":"message"
}

function deployStack(formName) {
	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: createTemplate(formName, myFormModel, myRequiredFields, emailArn),
    TimeoutInMinutes: 5
  };
  cloudformation.createStack(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } 
    else {
      console.log(data); // successful response
    }    
  });
}

createLambda(myFormFields, form, sourceEmail, deployStack(form))