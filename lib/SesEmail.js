require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require("fs");
var ses = new AWS.SES({apiVersion: '2010-12-01'});
var FormConfig = require('./Config');
var {optionArgs, optionCallback, optionError} = require('./InternalModules')

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
function VerifydefaultEmail(email, callback) {
  if(!ValidEmail(email)){
    let err = "Invalid email address."
    optionError(err, callback)
  }
  else {
    var params = {
      EmailAddress: email,
     };
    ses.verifyEmailIdentity(params, function(err, data) {
      if (err) {
        optionError(err, callback)
      }
      else  {
        FormConfig.AddSetting("email", email);
        if(callback && typeof callback === 'function'){
          callback(null, email);
        }
        else {
          return 'Success';
        }
      }             
    });
  }
}

//verifies a new email identity to be used with AWS SES and adds it form config. if the email hasnt been added before it also adds it to the eamil section.
function VerifySesEmail(email, callback) {
  if(!ValidEmail(email)){
    let err = "Invalid email address."
    optionError(err, callback)
  }
  else {
    var params = {
      EmailAddress: email,
    };
    ses.verifyEmailIdentity(params, function(err, data) {
      if (err) {
        optionError(err, callback)
      }
      else  {
        FormConfig.AddSetting(`defaults[${email}]`, false);
        if(callback && typeof callback === 'function'){
          callback(null, false);
        }
        else{
          return false
        }
      }             
    });
  }
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

//checks that the supplied email vas been verified with AWS
function ValidateSesEmail(formName, email, callback) {
  //console.log("EMAIL", email)
  var params = {
    Identities: [email]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) {
      optionError(err, callback)
     } 
     else {
        if(isEmpty(data.VerificationAttributes)){
          //let err = 'It appears your address still hasnt been verified... Lets try again.'
          //console.error(err);
          if(callback && typeof callback === 'function') callback(null, false);
          else return false;
        }
        else{
          switch(data.VerificationAttributes[email].VerificationStatus) {
            case 'Success':
              //console.log('\x1b[32m', 'The following email was succesfully verified with SES: ', email, '\x1b[0m');
              //const sesArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:identity/${email}`;
              FormConfig.AddVar(formName, 'email', email);
              FormConfig.AddSetting(`defaults["${email}"]`, false);
              if(callback && typeof callback === 'function') callback(null, true);
              else return true;
              break;
            default:
              //let err = 'It appears your address still hasnt been verified... Lets try again.'
              //console.error(err);
              if(callback && typeof callback === 'function') callback(null, false);
              else return false;
          }
        }      
      } 
   });
}

function SesEmail(formName, options, callback){
  callback = optionCallback(options, callback)
  let args = {"email":"", "recipients":[]}
  if(!options["recipients"]){
    let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
    let obj = JSON.parse(rawdata);
    if(obj["recipients"]){
      options["recipients"] = [obj.recipients]
    }
    else if(options["email"]){
      options["recipients"] = [options["email"]];
    }
    else if(obj["email"]){
      options["recipients"] = [obj.email]
    }
    else{
      throw new Error('no email provided')
    }
  }
  optionArgs(formName, args, options, function(err, data){
    if(err) optionError(err, callback)
    else {
      options = data;
      ValidateSesEmail(formName, options.email, function(err, data){
        if(err) optionError(err, callback)
        else if(data){
          callback(null, true)
        }
        else {
          VerifySesEmail(options.email, callback)
        }
      })
    }
  })
}

module.exports = {
  VerifydefaultEmail,
  VerifySesEmail,
  ValidateSesEmail,
  SesEmail,
}