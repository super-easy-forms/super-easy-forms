//load files from the .env file
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
         }             
    });
  }

verifyMail(process.argv[2]);