var fs = require("fs");
var {optionCallback, optionArgs, optionError} = require('./InternalModules')

//CODE TO ZIP LAMBDA FUNCTION
//var JSZip = require("jszip");
/*
  var zip = new JSZip();
  zip.file("lambdaFunc.js", lambdaFunc);
  zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream(`forms/${formName}/lambda.zip`))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
			console.log('\x1b[32m', 'Succesfully created and zipped your lambda function.', '\x1b[0m');
			if(callback && callback === "deploy"){
				deployStack(formName)
			}
	});
*/

module.exports = function createLambda(formName, options, callback) {
	let args = {"email": "", "formFields":"", "recipients":[]}
	let fieldsObject = {"id":"id"};
	callback = optionCallback(options, callback);
	optionArgs(formName, args, options, function(err, data){
		if(err) optionError(err, callback)
		else {
			options = data;
			Object.keys(options.formFields).map(function(key, index) {
				fieldsObject[key] = key;
			});
			let lambdaFields = JSON.stringify(fieldsObject);
			generateLambda(formName, lambdaFields, options.email, options.recipients, callback)
		}
	})
}

function generateLambda(formName, lambdaFields, email, recipients, callback){
	let str = ""
	recipients.map(function(e) { 
		str += `"${e}",`
	});
	recipientString = str.substring(0, str.length - 1); 
	let lambdaFunction = 
	`
	var AWS = require('aws-sdk');
	var ses = new AWS.SES({apiVersion: '2010-12-01'});
	var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
	
	exports.handler = (event, context, callback) => {
		let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(":","-").replace(":","-").replace(".","-") + Math.floor(Math.random() * 90000000).toString(28);    
		var jsonBase = ${lambdaFields};
		Object.keys(event).map(function(key, index) {
			jsonBase[key] = {S:event[key]};
		});
		jsonBase['id'] = {S:uniqNow};
		let params = {
			Item: jsonBase, 
			TableName: "${formName}",
		};
		var contactInfo = '';
		for(let item in event){	
			contactInfo += '<span><b>' + item + ': </b>' + event[item] + '</span><br>'; 
		}
		const emailMessage = '<h4>New Contact</h4><br><p>Someone has just filled out your super easy form! bellow are their details: <br>' + contactInfo;
		dynamodb.putItem(params, function(err, data) {
			if (err) {
				callback(err)
			}
			else {
				var params = {
					Destination: {
						ToAddresses: [${recipientString}]
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
					ReplyToAddresses: [], 
					Source: "${email}", 
				};
				ses.sendEmail(params, function(err, data) {
					if (err) {
						callback(err)
					} 
					else {
						callback(null, 'Success')
					}   
				});
			}
		});
	};
	`
	fs.writeFile(`./forms/${formName}/lambdaFunction.js`, lambdaFunction, (err, data) => {
		if (err) {
			optionError(err, callback);
		}
		else{
			console.log(`lambda function saved`)
			if(callback && typeof callback === 'function'){
				callback(null, lambdaFunction);
			}
			else{
				return lambdaFunction;
			}
		}
	});
}