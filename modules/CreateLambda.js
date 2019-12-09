var fs = require("fs");

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
	let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
	let obj = JSON.parse(rawdata);
	let formFields = {};
	let fieldsObject = {"id":"id"};
	let sourceEmail = ""

	if(!options || typeof options !== "object"){
    if(typeof options === "function"){
			callback = options
		}
		else {
			let err = "options must be an object with the appropriate keys"
			throw new Error(err)
		}
	}

	if(options["sourceEmail"]){
		sourceEmail = options["sourceEmail"]
		FormConfig.AddVar(formName, "sourceEmail", sourceEmail);
		//should validate the email with ses
	} 
	else sourceEmail = obj.sourceEmail;
	
	if(options["formFields"]){
		formFields = options["formFields"];
		FormConfig.AddVar(formName, "fields", formFields);
		//should check for the correct format of the formfields
	}
	else formFields = obj.fields

	//convert fields object into suitable input for the lambda function
  Object.keys(formFields).map(function(key, index) {
    fieldsObject[key] = key;
  });
  let lambdaFields = JSON.stringify(fieldsObject);

  var lambdaFunc = 
  `//Import AWS SDK
  var AWS = require('aws-sdk');
  //Declare SES
  var ses = new AWS.SES({apiVersion: '2010-12-01'});
  //Declare Dynamo DB
  var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
  //Main function
  exports.handler = (event, context, callback) => {     
		//goes inside lambda function
		var jsonBase = ${lambdaFields};
		let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(":","-").replace(":","-").replace(".","-") + Math.floor(Math.random() * 90000000).toString(28);
		Object.keys(event).map(function(key, index) {
			jsonBase[key] = {S:event[key]};
		});
		jsonBase['id'] = {S:uniqNow};
		var params = {
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
	
	fs.writeFile(`forms/${formName}/lambdaFunction.js`, lambdaFunc, (err, data) => {
		if (err) {
			callback(new Error(err));
		}
		else{
			console.log(`lambda function saved`)
			if(callback && typeof callback === 'function'){
				callback(null, lambdaFunc);
			}
			else{
				return lambdaFunc;
			}
		}
	});
}