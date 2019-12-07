//import necessary stuff
require('dotenv').config();
var fs = require("fs");
const open = require('open');
var AWS = require('aws-sdk');
var ses = new AWS.SES({apiVersion: '2010-12-01'});
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//adds a variable to the config file of your form
function AddVar(formName, variable, value){
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`forms/${formName}/config.json`, jsonString);
  console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  return 'Success';
}

//create a label for the desired value
function CreateLabel(value){
  let str = value.replace(/-/g, ' ').replace(/_/g, ' ')
  // insert a space before all caps
  .replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function(str){ return str.toUpperCase(); });
  console.log(str);
  return str;
}

//validates an email using regex
function CheckEmail(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

function ValidateEnv()

//creates a JSON object called fields containing the form fields and attributes provided by the user
function AddFormFields(formName, labels){
  var x = readline.question(`Please enter your desired form fields sepparated by spaces.`, (fields) => {
    var fieldArray = fields.split(" ");
    //addVars(formName, 'formFields', response);
    let myFields = {}
    //var jstring = `"id":"id",`;
    for(let f of fieldArray){
      let type = "text"
      let label = "";
      let required = false;
      let part = f.split("=")
      if(part[1]){
        type = part[1] 
      }
      if(part[2] && part[2] === "required") {
        required = true;
      }
      if(labels === true){
        label = createLabel(part[0]);
      }
      myFields[part[0]]={
        "type": type,
        "label": label,
        "required": required
      }
    }
    addVars(formName, "fields", myFields)
    deployStack(formName, myFields)
    //createLambda.script(jsonstring, table)
    readline.close();
  });
}

//verifies a new email identity to be used with AWS SES
function VerifySesEmail(formName, senderEmail, callback) {
  var params = {
    EmailAddress: senderEmail,
   };
  ses.verifyEmailIdentity(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return false;
    }
    else  {
      if(callback && typeof callback === 'function'){
				callback();
			}
    }             
  });
}

//checks that the supplied email vas been verified with AWS
function ValidateSesEmail(formName, email, callback) {
  var params = {
    Identities: [
       email,
    ]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) {
        console.log(err, err.stack);
        //throw Error(err)
     } 
     else {
       console.log()
        switch(data.VerificationAttributes[email].VerificationStatus) {
          case 'Success':
            console.log('\x1b[32m', 'The following email was succesfully verified with SES: ', email, '\x1b[0m');
            const sesArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:identity/${email}`;
            addVars(formName, 'emailArn', sesArn);
            callback()
            break; 
          default:
            console.log('\x1b[31m', 'It appears your address still hasnt been verified... Lets try again.', '\x1b[0m');
            //throw Error("Email still hasn't been verified")
        }      
      } 
   });
}

function CreateIamUser(formName) {
  readline.question(`Please enter the name of your IAM user `, (userName) => {
    if(/^[a-zA-Z0-9]*$/.test(userName)){
      console.log('please click on', "\x1b[44m", 'create user', "\x1b[0m");
      console.log("\x1b[32m", 'Then add the', "\x1b[0m", 'AWS_ACCESS_KEY_ID', "\x1b[32m", 'and', "\x1b[0m", 'AWS_SECRET_ACCESS_KEY', "\x1b[32m", 'env variables', "\x1b[0m");
      console.log("\x1b[32m", 'Dont forget the', "\x1b[0m", 'AWS_REGION', "\x1b[32m", 'and', "\x1b[0m", 'AWS_ACCOUNT_NUMBER');
      console.log("\x1b[32m", 'Your region has been set to the default', "\x1b[0m", 'us-east-1');
      (async () => {
        await open(`https://console.aws.amazon.com/iam/home?region=us-east-1#/users$new?step=review&accessKey&userNames=${userName}&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess`);
      })();
      afterIam(formName);
    }
    else {
      console.log('\x1b[31m', 'Name invalid. Only alphanumeric characters. No spaces.', '\x1b[0m')
      createIam(formName);
    }
  });
}

function GetApiUrl(formName, stackId, callback) {
  //let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  //let obj = JSON.parse(rawdata);
  console.log(stackId)
  var params = {
    StackName: stackId,
    LogicalResourceId: "RestApi",
  };
  cloudformation.describeStackResource(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data.StackResourceDetail.PhysicalResourceId);
      addVar(formName, "restApiId", data.StackResourceDetail.PhysicalResourceId);
      var endpointUrl = `https://${data.StackResourceDetail.PhysicalResourceId}.execute-api.${process.env.AWS_REGION}.amazonaws.com/DeploymentStage/`
      addVar(formName, "endPointUrl", endpointUrl);
      formGenerator(formName, endpointUrl);
    }
  });
}

module.exports = {
  AddVar,
  CreateLabel,
  CheckEmail,
  ValidateEnv,
  AddFormFields,
  VerifySesEmail,
  ValidateSesEmail,
  CreateIamUser,
  GetApiUrl
};