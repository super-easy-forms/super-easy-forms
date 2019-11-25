//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//cloudformation
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
//package to use the file system
var fs = require("fs");

//function that adds values to the variables.json file
function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  //console.log('\x1b[33m', 'Variable saved.', '\x1b[0m')
  return 'Success';
}

var myFormFields = {
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

var myRequiredFields = ["id", "name", "message"]

function createTemplate(formName, formFields, requiredFields) {
  var template = {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Resources": {
      "RestApi": {
        "Type": "AWS::ApiGateway::RestApi",
        "Properties": {
          "name": `${formName}RestApi`,
          "apiKeySource": "HEADER",
          "description": "The REST API for for your Super Easy Form",
          "endpointConfiguration": {
            "Types": [
                "REGIONAL"
              ]
          }
        }
      },
      "ApiModel": {
        "Type": "AWS::ApiGateway::Model",
        "Properties": {
          "ContentType": "application/json",
          "Name": `${formName}ApiModel`,
          "RestApiId": {"Ref": "RestApi"},
          "Schema": {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "title": `${formName}`,
            "type": "object",
            "additionalProperties": false,
            "properties": formFields,
            "required": requiredFields
          }
        }
      },
      "ApiValidator": {
        "Type": "AWS::ApiGateway::RequestValidator",
        "Properties": {
            "RestApiId": {
              "Ref": "RestApi"
            },
            "Name" : `${formName}Validation`,
            "ValidateRequestBody" : true,
            "ValidateRequestParameters" : true
        }
      },
      "ApiPostMethod": {
        "Type": "AWS::ApiGateway::Method",
        "Properties": {
          "AuthorizationType": "NONE",
          "HttpMethod": "POST",
          "ResourceId": { "Fn::GetAtt": ["RestApi", "RootResourceId"] },
          "RestApiId": {"Ref": "FormApi"},
          "ApiKeyRequired": false,
          "Integration": {
            "Type": "AWS",
            "IntegrationHttpMethod": "POST",
            "Uri": {"Fn::Join" : ["", ["arn:aws:apigateway:", {"Ref": "AWS::Region"}, ":lambda:path/2015-03-31/functions/", {"Fn::GetAtt": ["Lambda", "Arn"]}, "/invocations"]]},
            "IntegrationResponses": [{
              "ResponseTemplates": {
                "application/json": "$input.json('$.body')"
              },
              "ResponseParameters": {
                "method.response.header.Link": "integration.response.body.headers.next",
                "method.response.header.Access-Control-Allow-Origin": "'*'" 
              },
              "StatusCode": 200
            }]
          },
          "RequestValidatorId": {"Ref": "ApiValidator"},
          "MethodResponses": [{
            "httpMethod": "POST",
            "ResponseModels": {
              "application/json": {"Ref": "ApiModel"}
            },
            "ResponseParameters": {
              "method.response.header.Link": true
            },
            "StatusCode": 200
          }]
        },
        "DependsOn": [
          "LambdaFunction"
        ]
      },
      "DynamoDbTable": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "AttributeDefinitions": [
              {
                "AttributeName": "id", 
                "AttributeType": "S"
              }
            ], 
            "KeySchema": [
              {
                "AttributeName": "id", 
                "KeyType": "HASH"
              }
            ], 
            "TableName": `${formName}`,
            "BillingMode": "PAY_PER_REQUEST"
          }
      },
      "LambdaFunction": {
        "Type": "AWS::Lambda::Function",
        "Properties" : {
          "Code" : {
            "ZipFile": "ZIP_FILE" 
          },
          "Description" : "This Lambda Function Adds your contact info. to a Dynamo DB table and then sends you an email.",
          "Environment" : "nodejs12.x",
          "FunctionName" : "FUNCTION_NAME",
          "Handler": "lambdaFunc.handler",
          "MemorySize": 128, 
          "Role" : {"Ref": "IamRole"},
          "Runtime": "nodejs12.x",
          "Tags" : [ {"FormName":`${formName}`} ],
          "Timeout" : 30
        },
        "DependsOn": [
            "DynamoDbTable"
        ]
      },
      "LambdaPermission": {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
              "Action": "lambda:InvokeFunction",
              "FunctionName": {
                "Ref": "LambdaFunction"
              }, 
              "Principal": "apigateway.amazonaws.com",
              "SourceArn": {"Fn::Join" : ["", ["arn:aws:execute-api:", {"Ref": "AWS::Region"}, ":", {"Ref": "AWS::Region"}, ":", {"Ref": "FormApi"}, "/*/POST/"]]}
          }
      },
      "IamPolicy": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument" : {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Action": [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem"
                  ],
                  "Resource": {"Fn::GetAtt": ["FormTable", "Arn"]}
                },
                {
                  "Effect": "Allow",
                  "Resource": process.env.SES_EMAIL,
                  "Action": [
                    "SES:SendEmail",
                    "SES:SendRawEmail"
                  ]
                }
              ]
            },
            "PolicyName" : `${formName}Policy`,
            "Roles" : [ {"Ref":"IamRole"} ],
            "Users" : [ process.env.IAM_USER ]
          }
      },
      "IamRole": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument" : {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": {
                    "Service": "lambda.amazonaws.com"
                  },
                  "Action": "sts:AssumeRole"
                }
              ]
            },
            "Description" : "Role that allows the Lambda function to interact with the IAM policy",
            "Policies" : {"Ref":"IamPolicy"},
            "RoleName" : `${formName}FormRole`
          }
          },
          "DependsOn": [
            "FormPolicy"
          ]
      },
      "ApiDeployment": {
        "Type" : "AWS::ApiGateway::Deployment",
        "Properties" : {
            "Description" : `deployment of the REST API for the ${formName} form`,
            "RestApiId" : {"Ref":"RestApi"},
            "StageName" : "DeploymentStage"
          }
      }
  }
  return template;
}

// CREATE THE STACK
exports.script = function createStack(formName) {
	var params = {
    StackName: `${formName}Form`, /* required */
    TemplateBody: createTemplate(formName, myFormFields, myRequiredFields),
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
						
