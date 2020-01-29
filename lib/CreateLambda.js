var fs = require("fs");
var archiver = require('archiver');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var {optionCallback, optionArgs, optionError} = require('./InternalModules')
var {createDir, createFile} = require("./../build")

function createLambda(formName, options, callback) {
	let bucketName = `${formName}function`
	let functionName = `${formName}Function`

	let args = {"email": "", "formFields":"", "recipients":[]}
	let fieldsObject = {"id":"id"};
	callback = optionCallback(options, callback);
	optionArgs(formName, args, options, function(err, data){
		if(err) optionError(err, callback)
		else {
			options = data;
			if(!options['emailMessage']){
				options['emailMessage'] = '<h4>New Contact</h4><br><p>Someone has just filled out your super easy form! bellow are their details: <br> <ContactInfo>'
			}
			if(!options['emailSubject']){
				options['emailSubject'] = 'Super Easy Forms - New Contact'
			}
			Object.keys(options.formFields).map(function(key, index) {
				fieldsObject[key] = key;
			});
			let lambdaFields = JSON.stringify(fieldsObject);
			initLambda(formName, functionName, lambdaFields, options.email, options.recipients, options.emailMessage, options.emailSubject, function(err, data){
				if(err) callback(err)
				else {
					zipDir(formName, functionName, function(err, data){
						if(err) callback(err)
						else {
							createBucket(formName, bucketName, functionName, function(err, data){
								if(err)console.log(err)
								else callback(null, 'All Done!')
							})
						}
					})
				}
			})
		}
	})
}

function initLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, callback){
	createDir(`forms/${formName}/${functionName}`, function(err, data){
		if(err) callback(err)
		else{
			let modulesPath = `./forms/${formName}/${functionName}/node_modules`
			generateLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, callback);
			createDir(modulesPath, function(err, data){
				if(err) callback(err)
				else copyModules(modulesPath, callback)
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
			fs.mkdir(newDest, function(err, data){
				if(err) callback(err)
				else recurseFolder(filePath, newDest, callback);
			})
		}
	});
}

function copyModules(destination, callback){
	console.log('Coopying modules...')
	let npmPacks = ['uuid', 'axios']
	for(let i=0; i<=npmPacks.length; i++){
		if(!npmPacks[i]){
			callback(null, 'Success')
		}
		else{
			let pack = npmPacks[i];
			let origin = `./node_modules/${pack}`
			let dest = `${destination}/${pack}`
			fs.mkdir(dest, function(err, data){
				if(err) callback(err)
				else{
					recurseFolder(origin, dest, function(filePath, newDest) {
						fs.copyFileSync(filePath, newDest)
					})
				}
			})
		}
	}
}

function generateLambda(formName, functionName, lambdaFields, email, recipients, emailMessage, emailSubject, callback){
	let str = ""
	recipients.map(function(e) { 
		str += `"${e}",`
	});
	recipientString = str.substring(0, str.length - 1); 
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
		let secret = "${process.env.RECAPTCHA_SECRET}";
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
				var contactInfo = '';
				for(let item in obj){	
					contactInfo += '<span><b>' + item + ': </b>' + obj[item] + '</span><br>'; 
				}
				var emailBody = '${emailMessage}'.replace('<ContactInfo>', contactInfo)
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
			}
			else {
				let err = 'invalid recaptcha response';
				callback(err);
			}
		})
		.catch(function (error) {
			callback(error);
		});
	};
	`
	fs.writeFile(`./forms/${formName}/${functionName}/index.js`, lambdaFunction, (err, data) => {
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

function zipDir(formName, functionName, callback){
	var output = fs.createWriteStream(`./forms/${formName}/${functionName}.zip`);
	var archive = archiver('zip');
	output.on('close', function () {
			console.log('Function Deployment package has been compressed. ' + archive.pointer() + ' total bytes');
			callback(null, 'Success')
	});
	archive.on('error', function(err){
			throw err;
	});
	archive.pipe(output);
	archive.directory(`./forms/${formName}/${functionName}`, false)
	archive.finalize();
}

function createBucket(formName, bucketName, functionName, callback){
	var params = { Bucket: bucketName };
	s3.createBucket(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			uploadContents(formName, bucketName, functionName, callback)
		}          
	});
}

function uploadContents(formName, bucketName, functionName, callback){
	fs.readFile(`./forms/${formName}/${functionName}.zip`, function(err,data){
		if(err) console.log(err)
		else{
			var params = {Bucket: bucketName, Key: `${functionName}.zip`, Body: data};
			s3.upload(params, function(err, data) {
				if(err) callback(err)
				else callback(null, 'Succesfully uploaded contnents')
			});
		}
	})
}

module.exports = {
	createLambda,
	zipDir,
	uploadContents
}