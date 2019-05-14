//Import .env
require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//API Gateway
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

var params = {
    httpMethod: 'POST', /* required */
    resourceId: '9wsuqazfya', /* required */
    restApiId: 'mwtidiwbj8', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getMethodResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  apigateway.getIntegrationResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: '9wsuqazfya', /* required */
    restApiId: 'mwtidiwbj8', /* required */
  };
  apigateway.getMethod(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  apigateway.getIntegration(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
