//IMPORT AWS SDK
//load files from the .env file
require('dotenv').config();

//Import AWS SDK
var AWS = require('aws-sdk');

//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//ADD ITEM TO DB
//SES SEND EMAIl
/* The following example sends a formatted email: */

/* The following example sends a formatted email: */

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
     if (err) console.log(err); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
     }
     */
   });