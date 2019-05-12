//Import .env
require('dotenv').config();
const uuidv1 = require('uuid/v1');
//Import AWS SDK
var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
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
    var json = JSON.parse(`{${jsonstring}}`);
    console.log(json);

    createLambda(json, table)
    readline.close();
  });
}

function createLambda(tableItem, tableName) {
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  var source = obj.source;

  const lambdaFunc = 
  `const uuidv1 = require('uuid/v1');
  //Import AWS SDK
  var AWS = require('aws-sdk');
  
  //import uuid for id generation
  //const uuidv1 = require('uuid/v1');
  
  //SES
  var ses = new AWS.SES({apiVersion: '2010-12-01'});
  //ADD ITEM TO DB
  var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
  var params = {
      Item: ${tableItem}, 
      TableName:${tableName},
  };
  dynamodb.putItem(params, function(err, data) {
      if (err) {
          console.log(err, err.stack); // an error occurred
      }
      else {
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
                          Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
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
              } 
              else {
                  console.log(data);
              }   
          });
      }
  });`; 

  var zip = new JSZip();
  zip.file("lambdaFunc.js", lambdaFunc);

  zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream('lambda.zip'))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log("lambda.zip written.");
  });
}

stmt2();

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the API
