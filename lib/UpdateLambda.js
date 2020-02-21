var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
var {zipDir, uploadContents} = require("./CreateLambda")
var {optionError} = require('./InternalModules')

module.exports = function UpdateLambda(formName, callback){
	let bucketName = `${formName}function`
	let functionName = `${formName}Function`
	zipDir(formName, functionName, function(err, data){
		if(err) optionError(err, callback)
		else {
			uploadContents(formName, bucketName, functionName, function(err, data){
				if(err) optionError(err, callback)
				else{	
					var params = {
						FunctionName: functionName, 
						S3Bucket: bucketName, 
						S3Key: `${functionName}.zip`,  
					 };
					 lambda.updateFunctionCode(params, function(err, data) {
						 if (err) optionError(err, callback)
						 else {
							 let success = 'Succesfully update the lambda function'
							if(callback && typeof callback === 'function'){
								callback(null, success);
							}
							else return success
						 } 
					});
				}
			})
		}
	})
}

