require('dotenv').config();
var AWS = require('aws-sdk');
var ses = new AWS.SES({apiVersion: '2010-12-01'});
var FormConfig = require('./Config');

//validates an email using regex
function ValidEmail(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

//verifies a default email to be used with SES and adds it to the settinggs file defaults section
function VerifydefaultEmail(senderEmail, callback) {
  if(!ValidEmail(senderEmail)){
    let err = "Invalid email address."
    callback(new Error(err))
  }
  else {
    var params = {
      EmailAddress: senderEmail,
     };
    ses.verifyEmailIdentity(params, function(err, data) {
      if (err) {
        callback(new Error(err));
      }
      else  {
        FormConfig.AddSetting("senderEmail", senderEmail);
        if(callback && typeof callback === 'function'){
          callback(null, senderEmail);
        }
        else {
          return 'Success';
        }
      }             
    });
  }
}

//verifies a new email identity to be used with AWS SES and adds it form config. if the email hasnt been added before it also adds it to the eamil section.
function VerifySesEmail(senderEmail, callback) {
  if(!ValidEmail(senderEmail)){
    let err = "Invalid email address."
    callback(new Error(err))
  }
  else {
    var params = {
      EmailAddress: senderEmail,
    };
    ses.verifyEmailIdentity(params, function(err, data) {
      if (err) {
        callback(new Error(err))
      }
      else  {
        if(callback && typeof callback === 'function'){
          callback(null, senderEmail);
        }
        else{
          return true
        }
      }             
    });
  }
}

//checks that the supplied email vas been verified with AWS
function ValidateSesEmail(formName, email, callback) {
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
            if(callback && typeof callback === 'function') callback(null, sesArn);
            else return sesArn;
          default:
            let err = 'It appears your address still hasnt been verified... Lets try again.'
            console.error(err);
            if(callback && typeof callback === 'function') callback(null, false);
            else return false;
        }      
      } 
   });
}

module.exports = {
  VerifydefaultEmail,
  VerifySesEmail,
  ValidateSesEmail,
}