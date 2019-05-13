exports.script = function lambdaScript(iam, fs, lambda, apigateway, domainName, storBktName){
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
                    "Resource": "arn:aws:dynamodb:eu-west-1:123456789012:table/SampleTable"
                }
            ]
        }`
    );

    // CREATE THE IAM POLICY
    var policyParams = {
        PolicyDocument: contactPolicy, /* required */
        PolicyName: `easyContactPolicy${uniqNow}`, /* required */
        Description: 'the IAM policy that allows the role to communicate with your sotrage and public buckets'
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
                RoleName: `almostCopyRole${uniqNow}`, /* required */
                Description: 'The Role that allows the Lambda function to interact with the IAM policy',
                Tags: [
                    {
                        Key: 'name', /* required */
                        Value: `almostCopyRole${uniqNow}` /* required */
                    },
                ]
            };
            iam.createRole(rolParams, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log('Succesfully created the IAM Role: ', data.RoleName);
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
                                        ZipFile: fs.readFileSync('copyFunction.zip') 
                                    }, 
                                    Description: "This Lambda Function Allows you to copy objects from one bucket to another", 
                                    FunctionName: `almostCopyFunction${uniqNow}`, 
                                    Handler: "copyFunction.handler",
                                    MemorySize: 128, 
                                    Publish: true, 
                                    Role: rolArn,
                                    Runtime: "nodejs8.10", 
                                    Timeout: 30,
                                    Environment: {
                                        Variables: {
                                        'SOURCE_BUCKET': storBktName,
                                        'DEST_BUCKET': domainName,
                                        }
                                    },    
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
                                        createApi(copyFuncArn, copyFuncName);
                                        
                                    }
                                });
                        }, 10000); 
                    }     
                });
            }
        });
    }     
});


// CREATE THE API
function createApi(arn, funcName) {
    var params = {
        name: `almostCopyApi${uniqNow}`, /* required */
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
                                                                        console.log('Add a REACT_APP_COPY_BUCKET_URL variable in .env with this value.');
                                                                        // WRITE THE API URL TO VARIABLES.JSON
                                                                    
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
}