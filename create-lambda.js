//Import AWS SDK
var AWS = require('aws-sdk');
//IAM
var iam = new AWS.IAM({apiVersion: '2010-05-08'});
//Lambda
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
//package to use the file system
var fs = require("fs");
//pazkage to zip files
var JSZip = require("jszip");
//import the createApi function
const createApi = require('./create-api');

const uniqNow = new Date().toISOString().replace(":","-").replace(":","-").replace(".","-");

exports.script = function createLambda(itemString, tableName) {
  var json = `{${itemString}}`;
  console.log(json);
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  var source = obj.source;
  var mailId = obj.emailArn;
  var tableId = obj.tableArn;
  console.log(mailId, tableId);

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
		var jsonBase = ${json};
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
							"${source}", 
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
							Source: "${source}", 
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
  .pipe(fs.createWriteStream('lambda.zip'))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log("lambda.zip written.");
      lambdaScript(mailId, tableId);
  });
}

function lambdaScript(sesarn, tablearn){
	const trustRel =`{"Version": "2012-10-17","Statement": [{"Effect": "Allow","Principal": {"Service": "lambda.amazonaws.com"},"Action": "sts:AssumeRole"}]}`;
	const contactPolicy = (
	`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem"
            ],
            "Resource": "${tablearn}"
        },
        {
            "Effect": "Allow",
            "Resource": "${sesarn}",
            "Action": [
                "SES:SendEmail",
                "SES:SendRawEmail"
            ]
        }
    ]
	}`
	);
	// CREATE THE IAM POLICY
	var policyParams = {
		PolicyDocument: contactPolicy, /* required */
		PolicyName: `easyContactPolicy${uniqNow}`, /* required */
		Description: 'the IAM policy that allows the role to communicate with the dynamo DB table'
	};
	iam.createPolicy(policyParams, function(err, data) {  
		if (err){
			console.log(err, err.stack);
		} 
		else {
			console.log('Succesfully created the IAM policy: ', data.Policy.PolicyName);
			var policyArn = data.Policy.Arn;         
			// CREATE THE IAM ROLE
			var rolParams = {
				AssumeRolePolicyDocument: trustRel, /* required */
				RoleName: `easyContactRole${uniqNow}`, /* required */
				Description: 'The Role that allows the Lambda function to interact with the IAM policy',
				Tags: [
					{
						Key: 'name', /* required */
						Value: `easyContactRole${uniqNow}` /* required */
					},
				]
			};
			iam.createRole(rolParams, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				}
				else {
					console.log('Succesfully created the IAM Role: ', data.Role.RoleName);
					const rolArn = data.Role.Arn;
					const rolName = data.Role.RoleName;
					// ATTACH THE IAM POLICY TO THE NEW ROLE
					var attachParams = {
						PolicyArn: policyArn, 
						RoleName: rolName
					};
					iam.attachRolePolicy(attachParams, function(err, data) {
						if (err) {
								console.log(err, err.stack);
						}	
						else {
							console.log('Please wait 10 seconds ...');                        
							// WAIT 10 SECONDS 
							setTimeout(
								function createCopyFunc(){
									// CREATE THE LAMBDA COPY BUCKET FUNCTION
									var funcParams = {
										Code: {
												ZipFile: fs.readFileSync('lambda.zip') 
										}, 
										Description: "This Lambda Function Adds your contact info. to a Dynamo DB table and then sends you an email.", 
										FunctionName: `superEasyFunction${uniqNow}`, 
										Handler: "lambdaFunc.handler",
										MemorySize: 128, 
										Publish: true, 
										Role: rolArn,
										Runtime: "nodejs8.10", 
										Timeout: 30,   
									};
									lambda.createFunction(funcParams, function(err, data) {
										if (err) {
											console.log(err, err.stack); 
										}
										else {
											console.log('Succesfully created your Lambda function: ', data.FunctionName);
											const functionArn = data.FunctionArn;
											const functionName = data.FunctionName;
											// CALL THE CREATE API FUNCTION
											createApi.script(functionArn, functionName, uniqNow);			
										}
									});
							}, 10000); 
						}     
					});
				}
			})  
		}
	})
}