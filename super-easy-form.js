//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//package to use the file system
var fs = require("fs");
//package to use stdin/out
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
//Import the createLambda function
const createLambda = require('./create-lambda');

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

//function that adds values to the variables.json file
function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  console.log('saved your variable.')
  return 'Success';
}

//function that validates an email using regex
function validate(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

//function that verifies an email with AWS SES
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

//CLI statement 1
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

//CLI statement 2
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

//function that checks to see if the provided email has been verified by SES
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

//function that creates a Dynamo DB table
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

//creates a JSON structure with the form fields provided by the user
function formFields(table){
  var x = readline.question(`please enter your desired form fields sepparated by spaces`, (res) => {
    var response = res.split(" ");
    addVars('formFields', response);
    var jstring = `"id":"id",`;
    for(let r of response){
        jstring += `"${r}":"${r}",`;
    }
    var jsonstring = jstring.substring(0, (jstring.length -1))
    createLambda.script(jsonstring, table)
    readline.close();
  });
}

//Execute the script.
stmt2();



