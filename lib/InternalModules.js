
//import necessary stuff
require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require("fs");
var FormConfig = require('./Config')

function optionArgs(formName, args, options, callback) {
  if(options && typeof options !== "object" && typeof options !== "function"){
    let err = "options must be an object with the appropriate keys"
    callback(new Error(err))
  }
  else{
    let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
    let obj = JSON.parse(rawdata);
    try {
      Object.keys(args).map(function(key, index) {
        if(options && options[key]){
          args[key] = options[key];
          FormConfig.AddVar(formName, key, options[key], function(err, data){
            if(err) throw new Error(err)
          })
        }
        else if(obj[key] || obj[key] === false){
          let item = obj[key]
          if(item.length > 0 || Object.keys(item).length > 0 || typeof item === 'boolean'){
            args[key] = obj[key];
          }
        }
        else {
          if(!args[key].length > 0 && !Object.keys(args[key]).length > 0 && typeof args[key] !== 'boolean'){
            throw new Error(`required parameter ${key} hasnt been supplied`)
          }
        }
      });
      if(options){
        Object.keys(options).map(function(key, index) {
          if(!args.key){
            args[key] = options[key]
          }
        });
      }
      callback(null, args)
    }
    catch(err) {
      callback(err)
    }
  }
}

function optionCallback(options, callback){
  if(typeof options === "function"){
    return options
  }
  else if(callback && typeof callback === "function") return callback
  else return null
}

function optionReturn(data, callback){
  if(callback && typeof callback === 'function'){
    callback(null, data);
  }
  else {
    return data;
  }
}

function optionError(err, callback){
  if(callback && typeof callback === 'function') callback(new Error(err))
  else throw new Error(err);
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
  CheckEmail,
  ValidateProfile,
  ValidateConfig,
  optionArgs,
  optionCallback,
  optionError,
  optionReturn
}
