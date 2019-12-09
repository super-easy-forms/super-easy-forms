//Import .env
require('dotenv').config();
//package to use the file system
var fs = require("fs");

module.exports = function createTemplate(formName, options, callback) {
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
	let obj = JSON.parse(rawdata);
	let formFields = {};
  let emailArn = "";
  lambdaFunction = "";
  
  if(!options || typeof options !== "object"){
    if(typeof options === "function"){
			callback = options
		}
		else {
			let err = "options must be an object with the appropriate keys"
			throw new Error(err)
		}
	}
  
  if(options["emailArn"]){
		emailArn = options["emailArn"]
		FormConfig.AddVar(formName, "emailArn", emailArn);
		//should validate the email with ses
	} 
	else emailArn = obj.emailArn;

  if(options["formFields"]){
		formFields = options["formFields"];
		FormConfig.AddVar(formName, "fields", formFields);
		//should check for the correct format of the formfields
	}
  else formFields = obj.fields
  
  if(options["lambdaFunction"]){
		lambdaFunction = options["lambdaFunction"];
		fs.writeFile(`./forms/${formName}/lambdaFunction.js`, lambdaFunction, function(err, data){
      if(err){
        throw new Error(err)
      }
      else{
        console.log("updated the lambda function for your template")
      }
    })
		//should check for the correct format of the formfields
	}
	else {
    lambdaFunction = fs.readFileSync(`./forms/${formName}/lambdaFunction.js`, 'utf8')
  }
  
  var formModel = {"id": {"type": "string"}};
  Object.keys(formFields).map(function(key, index) {
    formModel[key] = {"type": "string"};
  });

  var requiredFields = ["id"];
  let i = 1;
  Object.keys(formFields).map(function(key, index) {
    let val = formFields[key]
    if(val["required"]){
      requiredFields[i] = key
      i += 1;
    }
  });

  var template = {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Resources": {
      "RestApi": {
        "Type": "AWS::ApiGateway::RestApi",
        "Properties": {
          "Name": `${formName}RestApi`,
          "Description": "The REST API for for your Super Easy Form",
          "EndpointConfiguration": {
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
            "properties": formModel,
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
          "RestApiId": {"Ref": "RestApi"},
          "ApiKeyRequired": false,
          "Integration": {
            "Type": "AWS",
            "IntegrationHttpMethod": "POST",
            "Uri": {"Fn::Join" : ["", ["arn:aws:apigateway:", {"Ref": "AWS::Region"}, ":lambda:path/2015-03-31/functions/", {"Fn::GetAtt": ["LambdaFunction", "Arn"]}, "/invocations"]]},
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
            "ResponseModels": {
              "application/json": {"Ref": "ApiModel"}
            },
            "ResponseParameters": {
              "method.response.header.Link": true,
              "method.response.header.Access-Control-Allow-Origin": false 
            },
            "StatusCode": 200
          }]
        },
        "DependsOn": [
          "LambdaFunction"
        ]
      },
      "ApiOptionsMethod": {
        "Type": "AWS::ApiGateway::Method",
        "Properties": {
          "AuthorizationType": "NONE",
          "HttpMethod": "OPTIONS",
          "ResourceId": { "Fn::GetAtt": ["RestApi", "RootResourceId"] },
          "RestApiId": {"Ref": "RestApi"},
          "ApiKeyRequired": false,
          "Integration": {
            "IntegrationHttpMethod": "OPTIONS",
            "Type": "MOCK",
            "RequestTemplates": { "application/json": "{\n \"statusCode\": 200\n}"},
            "PassthroughBehavior": "WHEN_NO_MATCH",
            "TimeoutInMillis": 29000,
            "CacheNamespace": { "Fn::GetAtt": ["RestApi", "RootResourceId"] },
            "Uri": {"Fn::Join" : ["", ["arn:aws:apigateway:", {"Ref": "AWS::Region"}, ":lambda:path/2015-03-31/functions/", {"Fn::GetAtt": ["LambdaFunction", "Arn"]}, "/invocations"]]},
            "IntegrationResponses": [{
              "ResponseTemplates": {
                "application/json": ""
              },
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
								"method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
								"method.response.header.Access-Control-Allow-Origin": "'*'" 
              },
              "StatusCode": 200
            }]
          },
          "MethodResponses": [{
            "ResponseModels": {
              "application/json": "Empty"
            },
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": false,
							"method.response.header.Access-Control-Allow-Methods": false,
							"method.response.header.Access-Control-Allow-Origin": false
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
          "TableName": formName,
          "BillingMode": "PAY_PER_REQUEST"
        }
      },
      "LambdaFunction": {
        "Type": "AWS::Lambda::Function",
        "Properties": {
          "Code": {
            ZipFile: `${lambdaFunction}` 
          },
          "Description" : "This Lambda Function Adds your contact info. to a Dynamo DB table and then sends you an email.",
          "FunctionName" : `${formName}Function`,
          "Handler": "index.handler",
          "MemorySize": 128, 
          "Role" : {"Fn::GetAtt": ["IamRole", "Arn"]},
          "Runtime": "nodejs10.x",
          "Tags" : [ {"Key": "formName", "Value":`${formName}`} ],
          "Timeout" : 30
        },
        "DependsOn": [
          "DynamoDbTable", "IamRole"
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
            "SourceArn": {"Fn::Join" : ["", ["arn:aws:execute-api:", {"Ref": "AWS::Region"}, ":", {"Ref": "AWS::AccountId"}, ":", {"Ref": "RestApi"}, "/*/POST/"]]}
        },
        "DependsOn": [
          "ApiPostMethod"
        ] 
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
                  "Resource": {"Fn::GetAtt": ["DynamoDbTable", "Arn"]}
                },
                {
                  "Effect": "Allow",
                  "Resource": emailArn,
                  "Action": [
                    "SES:SendEmail",
                    "SES:SendRawEmail"
                  ]
                }
              ]
            },
            "PolicyName" : `${formName}Policy`,
            "Roles": [{"Ref": "IamRole"}]
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
            "RoleName" : `${formName}FormRole`
          },
      },
      "ApiDeployment": {
        "Type" : "AWS::ApiGateway::Deployment",
        "Properties" : {
          "Description" : `deployment of the REST API for the ${formName} form`,
          "RestApiId" : {"Ref":"RestApi"},
          "StageName" : "DeploymentStage"
        },
        "DependsOn": [
          "ApiPostMethod"
        ]
      }
    }  
  }
  let tempString = JSON.stringify(template);
  fs.writeFile(`forms/${formName}/template.json`, tempString, (err, data) => {
		if (err) {
			callback(new Error(err));
		}
		else{
			console.log(`Cloudformation template for form ${formName} has been saved`)
			if(callback && typeof callback === 'function'){
				callback(null, tempString);
      }
      else{
        return tempString;
      }
		}
	});
}