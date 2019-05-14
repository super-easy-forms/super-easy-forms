//Import .env
require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//API Gateway
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

var params = {
    httpMethod: 'OPTIONS', /* required */
    resourceId: '6y4s6jxp7i', /* required */
    restApiId: 'hdupr7o1we', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getMethodResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('method response', data);           // successful response
  });
  apigateway.getIntegrationResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('integration response', data);           // successful response
  });
  var params = {
    httpMethod: 'OPTIONS', /* required */
    resourceId: '6y4s6jxp7i', /* required */
    restApiId: 'hdupr7o1we', /* required */
  };
  apigateway.getMethod(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('method', data);           // successful response
  });
  apigateway.getIntegration(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('integration', data);           // successful response
  });

