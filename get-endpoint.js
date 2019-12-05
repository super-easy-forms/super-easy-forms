//Import .env
require('dotenv').config();
var fs = require("fs");
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

var addVar = require('./addVars.js');

function getEndPoint(formName) {
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  let obj = JSON.parse(rawdata);
  console.log(obj)
  var params = {
    LogicalResourceId: "RestApi",
    StackName: obj.stackId
  };
  cloudformation.describeStackResource(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data.StackResourceDetail.PhysicalResourceId);
      addVar(formName, "restApiId", data.StackResourceDetail.PhysicalResourceId);
      var endpointUrl = `https://${data.StackResourceDetail.PhysicalResourceId}.execute-api.${process.env.AWS_REGION}.amazonaws.com/DeploymentStage/`
      addVar(formName, "endPointUrl", endpointUrl);
    }
  });
  /*
  var params = {
    StackName: obj.stackId
  };
  cloudformation.describeStacks(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data.Stacks[0].Outputs);           // successful response
  });
  */

}

getEndPoint("testwenty")
