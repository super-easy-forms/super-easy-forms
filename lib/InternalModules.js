
//import necessary stuff
require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require("fs");

//return a friendly label for the desired value
function CreateLabel(value){
  let str = value.replace(/-/g, ' ').replace(/_/g, ' ')
  // insert a space before all caps
  .replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function(str){ return str.toUpperCase(); });
  console.log(str);
  return str;
}

//validates an email using regex
function CheckEmail(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

function ValidateProfile(profile){
  var creds = new AWS.SharedIniFileCredentials({profile: profile});
  if(creds.accessKeyId){
    return true
  }
  else return false;
}

//validate that the necessary env variables have been supplied
function ValidateConfig(profile, options){
  let region = process.env.AWS_REGION
  let access_key = process.env.AWS_ACCESS_KEY_ID
  let secret_key = process.env.AWS_SECRET_ACCESS_KEY
  if(!region){
    let err = "missing AWS_REGION in the .env file"
    console.error(err)
    throw new Error(err)
  }
  else {
    if(access_key && secret_key){
      return true
    }
    else if(access_key || secret_key){
      let err = "missing credential pair in .env"
      console.error(err)
      throw new Error(err)
    }
    else {
      if(!profile){
        var profile = "default"
      }
      if(ValidateProfile(profile)){
        return true
      }
      else {
        let err = `profile ${profile} does not exist in the shared credentials file`
        console.error(err)
        throw new Error(err)
      }
    }
  }
  //if(options){}
}

module.exports = {
  CreateLabel,
  CheckEmail,
  ValidateProfile,
  ValidateConfig,
}
