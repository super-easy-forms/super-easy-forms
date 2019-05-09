//Import .env
require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});

const fs = require('fs');

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

// ADD THE VALUES TO THE VARIABLES.JSON FILE
function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  console.log('saved your public site name in the variables.json file')
  return 'Success';
}

function validate(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

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

//Have you already verified an email with SES?
//yes stmt3()
//no stmt1() 

function stmt1(){
  readline.question(`Please enter the email address youd like to register with SES`, (res) => {
    if(validate(res)){
      console.log('You will shortly recieve an email from AWS. Please click on the verification link.');
      verifyMail(res)
    }    
    else {
      console.log('Please enter a valid email address.'); 
    }  
  });
}

function stmt2(email){
  readline.question(`Have you already verified your email address? [Y/n]`, (res2) => {
      switch(convertInput(res2)) {
          case 'y':
              checkVerifiedEmail(email)
              readline.close();
              break;
          default:
              console.log('Noooo');
              readline.close();
      }
  });
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
            break; 
          default:
            console.log('Failure...')
        }      
      } 
   });
}

stmt1();

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the API
