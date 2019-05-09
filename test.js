
//load files from the .env file
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
/* 
var params = {
    IdentityType: "EmailAddress", 
    MaxItems: 123, 
    NextToken: ""
   };
   ses.listIdentities(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   }); */

   var params = {
    Identities: [
       process.argv[2],
    ]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      VerificationAttributes: {
       "example.com": {
         VerificationStatus: "Success", 
         VerificationToken: "EXAMPLE3VYb9EDI2nTOQRi/Tf6MI/6bD6THIGiP1MVY="
        }
      }
     }
     */
   });