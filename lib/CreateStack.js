require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var FormConfig = require('./Config');

module.exports = function CreateStack(formName, templateBody, callback) {
  if(!templateBody || typeof templateBody !== "string"){
    if(typeof templateBody === "function"){
      callback = templateBody;
    }
    else if (templateBody) {
      let err = "template body must be a string"
      throw new Error(err)
    }
    else {
      let rawdata = fs.readFileSync(`forms/${formName}/template.json`);
      let templateObject = JSON.parse(rawdata);
      var templateBody = JSON.stringify(templateObject);
    }
  }

	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: templateBody,
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
      var stackArn = data.StackId;
      FormConfig.AddVar(formName, "stackId", stackArn);
      var params = {
        StackName: stackArn
      };
      console.log("The Cloudformation Stack is being created . . .")
      cloudformation.waitFor('stackCreateComplete', params, function(err, data) {
        if (err) {
          callback(new Error(err))
        }
        else {
          console.log("the Cloudformation Stack has been created succesfully!")
          if(callback && typeof callback === 'function'){
            callback(null, stackArn);
          }
        }
      });
    }    
  });
}
