//Import .env
require('dotenv').config();
const uuidv1 = require('uuid/v1');
//Import AWS SDK
var AWS = require('aws-sdk');
//IAM
var iam = new AWS.IAM({apiVersion: '2010-05-08'});
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//Lambda
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
//API Gateway
//var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
//package to use the file system
var fs = require("fs");
//pazkage to zip files
var JSZip = require("jszip");
// package to use stdin/out
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//converts console input to y and n
function convertInput(input) {
  var mininput =  input.toLowerCase()
  if (mininput == 'y' || mininput == 'yes') {
      output = 'y';
  }
  else if(mininput == 'n' || mininput == 'no') {
      output = 'n';
  }
  else {
      output = '';   
  }
  return output;
}

// Adds values to the variables.json file
function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  console.log('saved your public site name in the variables.json file')
  return 'Success';
}

//validates an email using regex
function validate(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

//verifies an email with AWS SES
async function verifyMail(senderEmail) {
  var params = {
      EmailAddress: senderEmail,
     };
     await ses.verifyEmailIdentity(params, function(err, data) {
       if (err) {
          console.log(err, err.stack);
          return false;
        }
       else  {
          console.log(data);
          addVars('source', senderEmail);
          stmt2(senderEmail);
       }             
  });
}

function stmt1(){
  readline.question(`Please enter the email address youd like to register with SES`, (res) => {
    if(validate(res)){
      console.log('You will shortly recieve an email from AWS. Please click on the verification link.');
      verifyMail(res)
    }    
    else {
      console.log('Enter a valid email address.');
      stmt1(); 
    }  
  });
}

function stmt2(){   
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  var email = obj.source;
  console.log(email);
  if(email.length < 4) {
    stmt1();
  }
  else {
    readline.question(`Have you already verified your email with SES? [Y/n]`, (res2) => {
        switch(convertInput(res2)) {
            case 'y':
                checkVerifiedEmail(email)
                break;
            default:
                stmt1()
        }
    });
  }
}

function checkVerifiedEmail(email) {
  var params = {
    Identities: [
       email,
    ]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) {
        console.log(err, err.stack);
     } 
     else {
        switch(data.VerificationAttributes[email].VerificationStatus) {
          case 'Success':
            //stmt4()
            console.log('Success!')
            createDB()
            break; 
          default:
            console.log('It appears your address still hasnt been verified... Lets try again.');
            stmt2();
        }      
      } 
   });
}

function createDB() {
  readline.question(`please enter the desired name for your contact form's data base table. It must be unique.`, (dbName) => {
      if(/^[a-zA-Z0-9]*$/.test(dbName)){
          addVars('table', dbName)
          var params = {
            AttributeDefinitions: [
              {
                  AttributeName: "id", 
                  AttributeType: "S"
              },
            ], 
            KeySchema: [
              {
              AttributeName: "id", 
              KeyType: "HASH"
            },
            ], 
            TableName: dbName,
            BillingMode: "PAY_PER_REQUEST",
          };
          dynamodb.createTable(params, function(err, data) {
            if(err){
              console.log(err, err.stack);
            }
            else  {
              console.log(data);
              console.log('Succesfully created the DB table.')
              formFields(dbName);
            }       
          });
      }
      else {
          console.log('table name invalid. Only alphanumeric characters. no spaces.');
          createDB();
      }
  });
    
}

function formFields(table){
  var x = readline.question(`please enter your desired form fields sepparated by spaces`, (res) => {
    var response = res.split(" ");
    var jstring = `"id":"id",`;
    for(let r of response){
        jstring += `"${r}":"${r}",`;
    }
    var jsonstring = jstring.substring(0, (jstring.length -1))
    

    createLambda(jsonstring, table)
    readline.close();
  });
}

function createLambda(itemString, tableName) {
  var json = `{${itemString}}`;
  console.log(json);
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  var source = obj.source;

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
      let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(/-/, '-').replace(/-/, '-').replace(/T/, '-').replace(/\..+/, '-').replace(/:/, '').replace(/:/, '') + Math.floor(Math.random() * 90000000).toString(28);
      Object.keys(event).map(function(key, index) {
          jsonBase[key] = {S:event[key]};
      });
      jsonBase['id'] = {S:uniqNow};
      var params = {
          Item: jsonBase, 
          TableName: "${tableName}",
      };
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
                      "gabriel@torus-digital.com", 
                  ]
                  }, 
                  Message: {
                      Body: {
                          Html: {
                              Charset: "UTF-8", 
                              Data: 'This message body contains HTML formatting. It can, for example, contain links like this one: <a href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
                          }, 
                          Text: {
                              Charset: "UTF-8", 
                              Data: "This is the message body in text format."
                          }
                      }, 
                      Subject: {
                      Charset: "UTF-8", 
                      Data: "Test email"
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
      lambdaScript();
  });
}

stmt2();

function lambdaScript(){
	const trustRel =`{"Version": "2012-10-17","Statement": [{"Effect": "Allow","Principal": {"Service": "lambda.amazonaws.com"},"Action": "sts:AssumeRole"}]}`;
	const uniqNow = new Date().toISOString().replace(/-/, '').replace(/-/, '').replace(/T/, '').replace(/\..+/, '').replace(/:/, '').replace(/:/, '');
	const contactPolicy = (
	`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:BatchGetItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:790629462609:table/letseeform"
        },
        {
            "Sid": "AuthorizeMarketer",
            "Effect": "Allow",
            "Resource": "arn:aws:ses:us-east-1:888888888888:identity/example.com",
            "Action": [
                "SES:SendEmail",
                "SES:SendRawEmail"
            ],
            "Condition": {
                "StringLike": {
                    "ses:FromAddress": "marketing+.*@example.com"
                }
            }
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
												const copyFuncArn = data.FunctionArn;
												const copyFuncName = data.FunctionName;     
												
												// CALL THE CREATE API FUNCTION
														
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

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the API



