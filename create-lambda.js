//package to use the file system
var fs = require("fs");
//pazkage to zip files
var JSZip = require("jszip");

exports.script = function createLambda(formFields, tableName, sourceEmail, callback) {

  const lambdaFunc = 
  `//Import AWS SDK
  var AWS = require('aws-sdk');
  //Declare SES
  var ses = new AWS.SES({apiVersion: '2010-12-01'});
  //Declare Dynamo DB
  var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
  //Main function
  exports.handler = (event, context, callback) => {     
		//goes inside lambda function
		var jsonBase = ${formFields};
		let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(":","-").replace(":","-").replace(".","-") + Math.floor(Math.random() * 90000000).toString(28);
		Object.keys(event).map(function(key, index) {
			jsonBase[key] = {S:event[key]};
		});
		jsonBase['id'] = {S:uniqNow};
		var params = {
			Item: jsonBase, 
			TableName: "${tableName}",
		};
		var contactInfo = '';
		for(let item in event){	
			contactInfo += '<span><b>' + item + ': </b>' + event[item] + '</span><br>'; 
		}
		const emailMessage = '<h4>New Contact</h4><br><p>Someone has just filled out your super easy form! bellow are their details: <br>' + contactInfo;
		dynamodb.putItem(params, function(err, data) {
			if (err) {
				console.log(err, err.stack); // an error occurred
			}
			else {
				console.log(event);
				console.log(data);   
				//SES SEND EMAIl
				var params = {
					Destination: {
						ToAddresses: [
							"${sourceEmail}", 
							]
						}, 
						Message: {
							Body: {
								Html: {
									Charset: "UTF-8", 
									Data: emailMessage
								}, 
								Text: {
									Charset: "UTF-8", 
									Data: "This is the message body in text format."
								}
							}, 
							Subject: {
							Charset: "UTF-8", 
							Data: "Super Easy Forms - New Contact"
							}
							}, 
							ReplyToAddresses: [
							], 
							Source: "${sourceEmail}", 
						};
						ses.sendEmail(params, function(err, data) {
								if (err) {
										console.log(err); // an error occurred
										return err;
								} 
								else {
										console.log(data);
										return data;
								}   
						});
				}
      });
     callback(null, 'All Done!');
  };`;

  var zip = new JSZip();
  zip.file("lambdaFunc.js", lambdaFunc);

  zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream(`forms/${formName}/lambda.zip`))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
			console.log('\x1b[32m', 'Succesfully created and zipped your lambda function.', '\x1b[0m');
			if(callback && typeof(callback) === "function"){
				callback()
			}
  });
}