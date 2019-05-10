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

console.log(uuidv1());
/*
var params = {
    Item: {
        "id": {N: "1"}, 
        "firstName": {S: "gabriel"}, 
        "lastName": {S: "kay"}, 
        "email": {S: "gkardonski@gmail.com"}
    }, 
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
}); 
*/