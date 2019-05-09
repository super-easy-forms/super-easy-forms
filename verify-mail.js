//load files from the .env file
//require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});

exports.script = function verifyMail(senderEmail) {
    var params = {
        EmailAddress: senderEmail,
       };
       ses.verifyEmailIdentity(params, function(err, data) {
         if (err) {
            console.log(err, err.stack);
          }
         else  {
            console.log(data);
         }             
    });
}
