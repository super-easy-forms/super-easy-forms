//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//API Gateway
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
//Lambda
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
//import the form generator
const formGenerator = require('./form-generator');
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

// CREATE THE API
exports.script = function createApi(arn, funcName, uniqNow) {
	var params = {
		name: `easyFormApi${uniqNow}`,
		apiKeySource: 'HEADER',
		description: 'The REST API for the lambda copy function',
		endpointConfiguration: {
		types: [
			'REGIONAL'
		]
		},
		version: uniqNow
	};
	apigateway.createRestApi(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} 
		else {
			console.log('\x1b[32m', 'Succesfully created your REST API endpoint: ', data.name, '\x1b[0m');
			const rest_api_id = data.id;
			// GET THE PARENT RESOURCE ID
			var params = {
				restApiId: rest_api_id,
			};
			apigateway.getResources(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				}
				else {
					const parent_id = data.items[0].id; 
					// CREATE THE POST METHOD 
					createPostMethod(parent_id, rest_api_id, arn, funcName, uniqNow);
				}
			});
		}
	});
}
						
// CREATE THE POST METHOD 
function createPostMethod(parent_id, rest_api_id, arn, funcName, uniqNow) {
	var params = {
		authorizationType: 'NONE',
		httpMethod: 'POST',
		resourceId: parent_id,
		restApiId: rest_api_id,
		apiKeyRequired: false,
	};
	apigateway.putMethod(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} 
		else {
			// CREATE THE INTEGRATION WITH THE LAMBDA FUNCTION
			var params = {
				httpMethod: 'POST',
				integrationHttpMethod: 'POST',
				resourceId: parent_id,
				restApiId: rest_api_id,
				type: 'AWS',
				uri: `arn:aws:apigateway:${process.env.AWS_REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`
			};
			apigateway.putIntegration(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				}
				else {
					// ASSIGN PERMISSIONS TO THE LAMBDA FUNCTION 
					var params = {
					Action: "lambda:InvokeFunction", 
					FunctionName: funcName, 
					Principal: "apigateway.amazonaws.com", 
					SourceArn: `arn:aws:execute-api:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${rest_api_id}/*/POST/`,
					StatementId: `ID-${uniqNow}`
					};
					lambda.addPermission(params, function(err, data) {
						if (err) {
							console.log(err, err.stack);
						} 
						else {
							// CREATE THE METHOD RESPONSE
							var params = {
								httpMethod: 'POST',
								resourceId: parent_id,
								restApiId: rest_api_id,
								statusCode: '200',
								responseParameters: { 
									'method.response.header.Access-Control-Allow-Origin': false 
								},
								responseModels: { 
									'application/json': 'Empty' 
								}
							}
							apigateway.putMethodResponse(params, function(err, data) {
								if (err) {
									console.log(err, err.stack);
								} 
								else {
									// CREATE THE INTEGRATION RESPONSE
									var params = {
										httpMethod: 'POST',
										resourceId: parent_id,
										restApiId: rest_api_id,
										statusCode: '200',
										responseParameters: { 
												'method.response.header.Access-Control-Allow-Origin': "'*'" 
										},
										responseTemplates: { 
												'application/json': '' 
										}
									};
									apigateway.putIntegrationResponse(params, function(err, data) {
										if (err) {
											console.log(err, err.stack);
										}
										else {
											console.log('\x1b[32m', 'Succesfully created the POST method.', '\x1b[0m');
											//CREATE THE OPTIONS METHOD
											createOptionsMethod(parent_id, rest_api_id, arn, uniqNow);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});	
}
  

// CREATE THE OPTIONS METHOD 
function createOptionsMethod(parent_id, rest_api_id, arn, uniqNow) {
	var params = {
	authorizationType: 'NONE',
	httpMethod: 'OPTIONS',
	resourceId: parent_id,
	restApiId: rest_api_id,
	apiKeyRequired: false,
	};
	apigateway.putMethod(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} 
		else {
			// CREATE THE INTEGRATION WITH THE LAMBDA FUNCTION
			var params = {
				httpMethod: 'OPTIONS',
				integrationHttpMethod: 'OPTIONS',
				resourceId: parent_id,
				restApiId: rest_api_id,
				type: 'MOCK',
				requestTemplates: { 'application/json': '{"statusCode": 200}' },
				passthroughBehavior: 'WHEN_NO_MATCH',
				timeoutInMillis: 29000,
				cacheNamespace: parent_id,
				uri: `arn:aws:apigateway:${process.env.AWS_REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`
			};
			apigateway.putIntegration(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				}
				else {
					// CREATE THE METHOD RESPONSE
					var params = {
						httpMethod: 'OPTIONS',
						resourceId: parent_id,
						restApiId: rest_api_id,
						statusCode: '200',
						responseParameters: { 
							'method.response.header.Access-Control-Allow-Headers': false,
							'method.response.header.Access-Control-Allow-Methods': false,
							'method.response.header.Access-Control-Allow-Origin': false 
						},
						responseModels: { 
							'application/json': 'Empty' 
						}
					};
					apigateway.putMethodResponse(params, function(err, data) {
						if (err) {
							console.log(err, err.stack);
						} 
						else {
							// CREATE THE INTEGRATION RESPONSE
							var params = {
								httpMethod: 'OPTIONS',
								resourceId: parent_id,
								restApiId: rest_api_id,
								statusCode: '200',
								responseParameters: { 
									'method.response.header.Access-Control-Allow-Headers':
									"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
									'method.response.header.Access-Control-Allow-Methods': "'POST,OPTIONS'",
									'method.response.header.Access-Control-Allow-Origin': "'*'"
								},
								responseTemplates: { 
									'application/json': null 
								}
							};
							apigateway.putIntegrationResponse(params, function(err, data) {
								if (err) {
									console.log(err, err.stack);
								}
								else {
									console.log('\x1b[32m', 'Succesfully created the OPTIONS method', '\x1b[0m')
									// DEPLOY THE API
									deployApi(rest_api_id, uniqNow);
								}
							});
						}
					});
				}
			});
		}
	});
}
	
//DEPLOY THE API  
function deployApi(rest_api_id, uniqNow) {
	var deployParams = {
		restApiId: rest_api_id,
		description: 'deployment of the REST API for the lambda copy function',
		stageDescription: `stage ${uniqNow} of the REST API for the lambda copy function deployment`,
		stageName: `deployment${uniqNow}`,
	};
	apigateway.createDeployment(deployParams, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		}
		else {
			console.log('\x1b[32m', 'Succesfully deployed your REST API with ID: ', data.id, '\x1b[0m');
			const invokeUrl = `https://${rest_api_id}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${deployParams.stageName}/`;
			console.log('\x1b[33m', 'Your Invoke URL: ', invokeUrl, '\x1b[0m');
			// WRITE THE API URL TO VARIABLES.JSON
			addVars('apiUrl', invokeUrl);
			formGenerator.script(invokeUrl);
			//Create the HTML form
		}
	});
}
