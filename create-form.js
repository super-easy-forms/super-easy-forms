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
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
//package to use the file system
var fs = require("fs");
//pazkage to zip files
var JSZip = require("jszip");
// package to use stdin/out
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const uniqNow = new Date().toISOString().replace(":","-").replace(":","-").replace(".","-");

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
  console.log('saved your variable.')
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
       console.log()
        switch(data.VerificationAttributes[email].VerificationStatus) {
          case 'Success':
            //stmt4()
            console.log('Success!')
            const sesArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:identity/${email}`;
            console.log(sesArn);
            addVars('emailArn', sesArn);
            createDB();
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
              const tableArn = data.TableDescription.TableArn;
              console.log(tableArn);
              addVars('tableArn', tableArn);
              console.log('Succesfully created the DB table.')
              formFields(dbName, tableArn);
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
      lambdaScript(mailId, tableId);
  });
}

stmt2();

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
                        createApi(functionArn, functionName);			
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

// CREATE THE API
function createApi(arn, funcName) {
  var params = {
      name: `easyFormApi${uniqNow}`, /* required */
      apiKeySource: 'HEADER',
      description: 'The REST API for the lambda copy function',
      endpointConfiguration: {
      types: [
          'REGIONAL'
      ]
      },
      version: uniqNow
  };
  apigateway.createRestApi(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      } 
      else {
          console.log('Succesfully created your REST API endpoint: ', data.name);
          const rest_api_id = data.id;
          
          // GET THE PARENT RESOURCE ID
          var params = {
              restApiId: rest_api_id, /* required */
              };
              apigateway.getResources(params, function(err, data) {
              if (err) {
                  console.log(err, err.stack);
              }
              else {
                  const parent_id = data.items[0].id;    
  
                      // CREATE THE POST METHOD
                      var params = {
                          authorizationType: 'NONE', /* required */
                          httpMethod: 'POST', /* required */
                          resourceId: parent_id, /* required */
                          restApiId: rest_api_id, /* required */
                          apiKeyRequired: false,
                      };
                      apigateway.putMethod(params, function(err, data) {
                          if (err) {
                              console.log(err, err.stack);
                          } 
                          else {
      
                              // CREATE THE INTEGRATION WITH THE LAMBDA COPY BUCKET FUNCTION
                              var params = {
                                  httpMethod: 'POST', /* required */
                                  integrationHttpMethod: 'POST',
                                  resourceId: parent_id, /* required */
                                  restApiId: rest_api_id, /* required */
                                  type: 'AWS', /* required */
                                  uri: `arn:aws:apigateway:${process.env.AWS_REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`
                              };
                              apigateway.putIntegration(params, function(err, data) {
                                  if (err) {
                                      console.log(err, err.stack);
                                  }
                                  else {

                                      // ASSIGN POLICY TO THE LAMBDA COPY BUCKET FUNCTION 
                                      var params = {
                                      Action: "lambda:InvokeFunction", 
                                      FunctionName: funcName, 
                                      Principal: "apigateway.amazonaws.com", 
                                      SourceArn: `arn:aws:execute-api:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${rest_api_id}/*/POST/`,
                                      StatementId: `ID-${uniqNow}`
                                      };
                                      lambda.addPermission(params, function(err, data) {
                                          if (err) {
                                              console.log(err, err.stack);
                                          } 
                                          else {
                                               // CREATE THE METHOD RESPONSE
                                               var params = {
                                                  httpMethod: 'POST', /* required */
                                                  resourceId: parent_id, /* required */
                                                  restApiId: rest_api_id, /* required */
                                                  statusCode: '200', /* required */
                                                  responseParameters: { 
                                                      'method.response.header.Access-Control-Allow-Origin': false 
                                                  },
                                                  responseModels: { 
                                                      'application/json': 'Empty' 
                                                  }
                                                  };
                                                  apigateway.putMethodResponse(params, function(err, data) {
                                                  if (err) {
                                                      console.log(err, err.stack);
                                                  } 
                                                  else {
                                                      // CREATE THE INTEGRATION RESPONSE
                                                      var params = {
                                                          httpMethod: 'POST', /* required */
                                                          resourceId: parent_id, /* required */
                                                          restApiId: rest_api_id, /* required */
                                                          statusCode: '200', /* required */
                                                          responseParameters: { 
                                                              'method.response.header.Access-Control-Allow-Origin': "'*'" 
                                                          },
                                                          responseTemplates: { 
                                                              'application/json': '' 
                                                          }
                                                          };
                                                          apigateway.putIntegrationResponse(params, function(err, data) {
                                                          if (err) {
                                                              console.log(err, err.stack);
                                                          }
                                                          else {
                                                              // CREATE THE API DEPLOYMENT
                                                              var deployParams = {
                                                                  restApiId: rest_api_id, /* required */
                                                                  description: 'deployment for the REST API for the lambda copy function',
                                                                  stageDescription: `stage ${uniqNow} of the REST API for the lambda copy function deployment`,
                                                                  stageName: `deployment${uniqNow}`,
                                                              };
                                                              apigateway.createDeployment(deployParams, function(err, data) {
                                                                  if (err) {
                                                                      console.log(err, err.stack);
                                                                  }
                                                                  else {
                                                                      console.log('Succesfully deployed your REST API: ', data.id);
                                                                      const invokeUrl = `https://${rest_api_id}.execute-api.${process.env.AWS_REGION}.amazonaws.com/${deployParams.stageName}/`;
                                                                      console.log('Your Invoke URL: ', invokeUrl);
                                                                      // WRITE THE API URL TO VARIABLES.JSON
                                                                      addVars('apiUrl', invokeUrl)
                                                                      //Create the HTML form
                                                                  }
                                                              });
  
                                                          }     
                                                      });
                                                  }            
                                              });
                                          }     
                                      });

                                      
                                  }     
                              });
                              
                          }    
                      });   
                  }                
              });             
                      
        }     
    });
}



