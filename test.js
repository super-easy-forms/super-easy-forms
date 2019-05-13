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
						"Resource": "arn:aws:dynamodb:eu-west-1:123456789012:table/SampleTable"
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
												ZipFile: fs.readFileSync('lambda.zip') 
										}, 
										Description: "This Lambda Function Adds your contact info. to a Dynamo DB table and then sends you an email.", 
										FunctionName: `superEasyFunction${uniqNow}`, 
										Handler: "lambda.handler",
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