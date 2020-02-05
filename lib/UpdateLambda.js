var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
var {zipDir, uploadContents} = require("./CreateLambda")

module.exports = function UpdateLambda(formName){
	let bucketName = `${formName}function`
	let functionName = `${formName}Function`
	zipDir(formName, functionName, function(err, data){
		if(err) console.log(err)
		else {
			uploadContents(formName, functionName, bucketName, function(err, data){
				if(err) console.log(err)
				else{	
					var params = {
						FunctionName: functionName, 
						S3Bucket: bucketName, 
						S3Key: `${functionName}.zip`,  
					 };
					 lambda.updateFunctionCode(params, function(err, data) {
						 if (err) console.log(err, err.stack); // an error occurred
						 else console.log(data); 
					});
				}
			})
		}
	})
}

