//Import .env
require('dotenv').config();
var fs = require("fs");
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

var formGenerator = require('./form-generator.js')
var addVar = require('./addVars.js');

module.exports = function getEndPoint(formName, stackId) {
  //let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  //let obj = JSON.parse(rawdata);
  console.log(stackId)
  var params = {
    StackName: stackId,
    LogicalResourceId: "RestApi",
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
      formGenerator(formName, endpointUrl);
    }
  });
}
