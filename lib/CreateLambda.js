var fs = require("fs");
var archiver = require('archiver');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var {optionCallback, optionArgs, optionError} = require('./InternalModules')
var {createDir} = require("./../build")

function createLambdaFunction(formName, options, callback) {
	let bucketName = `${formName}function`
	let functionName = `${formName}Function`
	let defaultMessage = '<h4>New Contact</h4><br><p>Someone has just filled out your super easy form! bellow are their details: <br> <FormOutput>';
	let defaultSubject = 'Super Easy Forms - New Contact';
	let args = {"email": "", "formFields":"", "recipients":[], "emailMessage":defaultMessage, "emailSubject":defaultSubject, "captcha":false, "zip":false, "functionBucket":false}
	let fieldsObject = {"id":"id"};
	if(options && options["email"]){
		args.recipients[0] = options.email
	}
	else{
		let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
		let obj = JSON.parse(rawdata);
		if(obj["email"]) args.recipients[0] = obj.email
	}
	callback = optionCallback(options, callback);
	optionArgs(formName, args, options, function(err, data){
		if(err) optionError(err, callback)
		else {
			options = data;
			Object.keys(options.formFields).map(function(key, index) {
				fieldsObject[key] = key;
			});
			let lambdaFields = JSON.stringify(fieldsObject);
			initLambda(formName, functionName, lambdaFields, options.email, options.recipients, options.emailMessage, options.emailSubject, options.captcha, function(err, data){
				if(err) optionError(err, callback)
				else {
					var lambda = data
					if(options["zip"]){
						zipDir(formName, functionName, function(err, data){
							if(err) optionError(err, callback)
							else {
								if(options["functionBucket"]){
									createLambdaBucket(formName, bucketName, functionName, function(err, data){
										if(err) optionError(err, callback)
										else {
											if(callback && typeof callback === 'function'){
												callback(null, lambda);
											}
											else return lambda;
										}
									})
								}
								else {
									if(callback && typeof callback === 'function'){
										callback(null, lambda);
									}
									else return lambda;
								}
							}
						});
					}
					else {
						if(callback && typeof callback === 'function'){
							callback(null, lambda);
						}
						else return lambda;
					}
				}
			})
		}
	})
}

function initLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, captcha, callback){
	createDir(`forms/${formName}/${functionName}`, function(err, data){
		if(err) optionError(err, callback)
		else{
			let modulesPath = `./forms/${formName}/${functionName}/node_modules`
			createDir(modulesPath, function(err, data){
				if(err) optionError(err, callback)
				else copyModules(modulesPath, function(err, data){
					if(err) optionError(err, callback)
					else generateLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, captcha, callback);
				})
			})
		}
	})
}

function recurseFolder(currentDirPath, destination, callback) {
	fs.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = `${currentDirPath}/${name}`;
		let newDest = `${destination}/${name}`
		var stat = fs.statSync(filePath);
		if (stat.isFile()) callback(filePath, newDest);
		else if (stat.isDirectory()) {
			createDir(newDest, function(err, data){
				if(err) optionError(err, callback)
				else recurseFolder(filePath, newDest, callback);
			})
		}
	});
}

function copyModules(destination, callback){
	//console.log('Copying modules...')
	let npmPacks = ['uuid', 'axios', 'follow-redirects', 'debug', 'ms']
	for(let i=0; i<=npmPacks.length; i++){
		if(!npmPacks[i]){
			callback(null, 'finished copying modules')
		}
		else{
			let pack = npmPacks[i];
			let origin = `./node_modules/${pack}`
			if(fs.existsSync('./node_modules/super-easy-forms')){
				origin = `./node_modules/${pack}`;
			}
			let dest = `${destination}/${pack}`
			createDir(dest, function(err, data){
				if(err) optionError(err, callback)
				else{
					recurseFolder(origin, dest, function(filePath, newDest) {
						fs.copyFileSync(filePath, newDest)
					})
				}
			})
		}
	}
}

function generateLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, captcha, callback){
	let str = ""
	let recipientString = `"${email}"`
	if(recipients.length > 0){
		recipients.map(function(e) { 
			str += `"${e}",`
		});
		recipientString = str.substring(0, str.length - 1);
	} 
	let captchasliceone = "";
	let captchaslicetwo = "";
	if(captcha){
		captchasliceone = 
		`
		let secret = process.env.RECAPTCHA_SECRET;
		let response = event.captcha;
		let url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response;
		axios.post(
			url, 
			{},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
				},
			},
		)
		.then(function (response) {
			if(response.data.success){
		`
		captchaslicetwo = 
		`
		}
		else {
			let err = 'invalid recaptcha response';
			callback(err);
		}
		})
		.catch(function (error) {
		callback(error);
		});
		`
	}
	let lambdaFunction = 
	`
	const uuidv1 = require('uuid/v1');
	const axios = require('axios').default;
	var AWS = require('aws-sdk');
	var ses = new AWS.SES({apiVersion: '2010-12-01'});
	var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

	exports.handler = (event, context, callback) => {
		let obj = ${lambdaFields}; 
		let uid = uuidv1();
		${captchasliceone}
				let dbobj = {};
				Object.keys(obj).map(function(key, index) {
					obj[key] = event[key];
					dbobj[key] = {S:event[key]};
				})
				obj['id'] = uid;
				dbobj['id'] = {S:uid};
				let params = {
					Item: dbobj, 
					TableName: "${formName}",
				};
				var formOutput = '<br>';
				for(let item in obj){	
					formOutput += '<span><b>' + item + ': </b>' + obj[item] + '</span><br>'; 
				}
				var emailBody = '${emailMessage}'.replace('<FormOutput>', formOutput)
				dynamodb.putItem(params, function(err, data) {
					if (err) {
						callback(err);
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
										Data: emailBody
									}, 
									Text: {
										Charset: "UTF-8", 
										Data: "empty"
									}
								}, 
								Subject: {
									Charset: "UTF-8", 
									Data: "${emailSubject}"
								}
							}, 
							ReplyToAddresses: [], 
							Source: "${email}", 
						};
						ses.sendEmail(params, function(err, data) {
							if (err) {
								callback(err);
							} 
							else {
								callback(null, 'Success');
							}   
						});
					}
				});
			${captchaslicetwo}
	};
	`
	fs.writeFile(`./forms/${formName}/${functionName}/index.js`, lambdaFunction, (err, data) => {
		if (err) optionError(err, callback);
		else{
			if(callback && typeof callback === 'function'){
				callback(null, lambdaFunction);
			}
			else{
				return lambdaFunction;
			}
		}
	});
}

function zipDir(formName, functionName, callback){
	var output = fs.createWriteStream(`./forms/${formName}/${functionName}.zip`);
	var archive = archiver('zip');
	output.on('close', function () {
		callback(null, 'Success')
	});
	archive.on('error', function(err){
		optionError(err, callback)
	});
	archive.pipe(output);
	archive.directory(`./forms/${formName}/${functionName}`, false)
	archive.finalize();
}

function createLambdaBucket(formName, bucketName, functionName, callback){
	var params = { Bucket: bucketName };
	s3.createBucket(params, function(err, data) {
		if (err) optionError(err, callback);
		else {
			uploadContents(formName, bucketName, functionName, callback);
		}          
	});
}

function uploadContents(formName, bucketName, functionName, callback){
	fs.readFile(`./forms/${formName}/${functionName}.zip`, function(err,data){
		if(err) optionError(err, callback);
		else{
			var params = {Bucket: bucketName, Key: `${functionName}.zip`, Body: data};
			s3.upload(params, function(err, data) {
				if(err) optionError(err, callback);
				else callback(null, 'Succesfully uploaded contnents')
			});
		}
	})
}

module.exports = {
	createLambdaFunction,
	createLambdaBucket,
	zipDir,
	uploadContents
}