var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//package to use the file system
var FormConfig = require('./Config');

function VerifydefaultEmail(senderEmail, callback) {
  var params = {
    EmailAddress: senderEmail,
   };
  ses.verifyEmailIdentity(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return false;
    }
    else  {
      FormConfig.AddSetting("senderEmail", senderEmail)
      if(callback && typeof callback === 'function'){
				callback();
			}
    }             
  });
}

//verifies a new email identity to be used with AWS SES
function VerifySesEmail(senderEmail, callback) {
  var params = {
    EmailAddress: senderEmail,
   };
  ses.verifyEmailIdentity(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return false;
    }
    else  {
      if(callback && typeof callback === 'function'){
				callback();
			}
    }             
  });
}

//checks that the supplied email vas been verified with AWS
function ValidateSesEmail(formName, email) {
  var params = {
    Identities: [email]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) {
      console.error(err, err.stack);
      throw new Error(err)
     } 
     else {
        switch(data.VerificationAttributes[email].VerificationStatus) {
          case 'Success':
            console.log('\x1b[32m', 'The following email was succesfully verified with SES: ', email, '\x1b[0m');
            const sesArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:identity/${email}`;
            addVars(formName, 'emailArn', sesArn);
            return true;
          default:
            console.log('\x1b[31m', 'It appears your address still hasnt been verified... Lets try again.', '\x1b[0m');
            return false;
        }      
      } 
   });
}
