//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

//import create-template
const createTemplate = require('./create-template');

// CREATE THE STACK
exports.script = function createStack(formName, formFields, requiredFields) {
	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: createTemplate(formName, formFields, requiredFields),
    ClientRequestToken: 'STRING_VALUE',
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

createStack(test)
						
