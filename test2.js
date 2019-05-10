//Import .env
require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});

//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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

//Have you already verified an email with SES?
//yes stmt3()
//no stmt1() 

function stmt1(){
  readline.question(`please enter your desired form fields sepparated by spaces`, (res) => {
    var response = res.split(" ");
    var json = `"id": {N: "1"},`
    for (let r of response) {
        json += `"${r}": {S: ${r}},`
    }
    console.log(json)
  });
}


stmt1();

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the API
