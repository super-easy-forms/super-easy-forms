require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
var FormConfig = require('./Config');
var {optionError} = require('./InternalModules')

module.exports = function GetApiUrl(formName, stackId, callback) {
  if(!stackId || typeof stackId !== "string"){
    if(typeof stackId === "function"){
      callback = stackId;
    }
    let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
    let obj = JSON.parse(rawdata);
    var stackId = obj.stackId
  }
  var params = {
    StackName: stackId,
    LogicalResourceId: "RestApi",
  };
  cloudformation.describeStackResource(params, function(err, data) {
    if (err) {
      optionError(err, callback);
    }
    else {
      //console.log(data.StackResourceDetail.PhysicalResourceId);
      FormConfig.AddVar(formName, "restApiId", data.StackResourceDetail.PhysicalResourceId);
      var endpointUrl = `https://${data.StackResourceDetail.PhysicalResourceId}.execute-api.${process.env.AWS_REGION}.amazonaws.com/DeploymentStage/`
      FormConfig.AddVar(formName, "endPointUrl", endpointUrl);
      if(callback && typeof callback === 'function'){
				callback(null, endpointUrl);
      }
      else {
        return endpointUrl;
      }
    }
  });
}