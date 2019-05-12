//Import .env
require('dotenv').config();
const uuidv1 = require('uuid/v1');

var fs = require("fs");
var JSZip = require("jszip");


//Import AWS SDK
var AWS = require('aws-sdk');

var JSZip = require("jszip");

//SES
//var ses = new AWS.SES({apiVersion: '2010-12-01'});

//Dynamo DB
//var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//const fs = require('fs');

// package to use stdin/out
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function stmt1(){
  var x = readline.question(`please enter your desired form fields sepparated by spaces`, (res) => {
    var response = res.split(" ");
    var json = `"id": {S: ${uuidv1()}},`
    for (let r of response) {
        json += `"${r}": {S: ${r}},`
    }
    stmt2(json)
    readline.close();
  });
}

function stmt2(item) {
    const lambdaFunc = `//IMPORT AWS SDK
    //load files from the .env file
    require('dotenv').config();
    const uuidv1 = require('uuid/v1');

    //Import AWS SDK
    var AWS = require('aws-sdk');

    //import uuid for id generation
    //const uuidv1 = require('uuid/v1');

    //SES
    var ses = new AWS.SES({apiVersion: '2010-12-01'});
    //ADD ITEM TO DB
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


    var params = {
        Item: {${item}}, 
        TableName: process.argv[2],
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
                Source: "gabriel@torus-digital.com", 
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
    });` 

var zip = new JSZip();
zip.file("lambdaFunc.js", lambdaFunc);
// ... and other manipulations

zip
.generateNodeStream({type:'nodebuffer',streamFiles:true})
.pipe(fs.createWriteStream('lambda.zip'))
.on('finish', function () {
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.
    console.log("lambda.zip written.");
});
}

stmt1();

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the API
