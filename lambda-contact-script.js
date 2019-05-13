<<<<<<< HEAD
//IMPORT AWS SDK
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

//Import AWS SDK
var AWS = require('aws-sdk');
//Declare SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Declare Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//Main function
exports.handler = (event, context, callback) => {     
    //goes inside lambda function
    var jsonBase = { id: "id", first: 'first', last: 'last', email: 'email', message: 'message' };
    let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(":","-").replace(":","-").replace(".","-") + Math.floor(Math.random() * 90000000).toString(28);
    Object.keys(event).map(function(key, index) {
        jsonBase[key] = {S:event[key]};
    });
    jsonBase['id'] = {S:uniqNow};
    var source = "gkardonski@gmail.com";
    var tableName = "instantformtable1";
    var params = {
        Item: jsonBase, 
        TableName: tableName,
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
                Source: source, 
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
};
