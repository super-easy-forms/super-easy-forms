
require('dotenv').config();
var fs = require("fs");

let regionSet = [
  "us-east-2",
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "ap-east-1",
  "ap-south-1",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "cn-north-1",
  "cn-northwest-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-north-1",
  "me-south-1",
  "sa-east-1",
  "us-gov-east-1",
  "us-gov-west-1"
];

function addAwsRegion(awsRegion, callback){
    if(!regionSet.includes(awsRegion)){
      let err = "Invalid AWS region code";
      console.error(err)
      throw new Error(err)
    }
    else{
      if(process.env.AWS_REGION){
        fs.readFile('./.env', 'utf8', (err, data) => {
          if (err) throw err;
          else{
            console.log
            let newEnv = data.replace(process.env.AWS_REGION, awsRegion);
            fs.writeFile('./.env', newEnv, (err, data) => {
              if (err) throw err;
              else{
                console.log(`AWS_REGION value has been updated to ${awsRegion}`)
                if(callback && typeof callback === 'function'){
                  callback();
                }
                return 'Success';;
              }
            });
          }
        });
      }
      else{
        fs.appendFile('.env', `\nAWS_REGION=${awsRegion}`, function (err) {
          if (err) throw err;
          else {
            console.log(`your AWS_REGION has been saved as ${awsRegion}`);
            if(callback && typeof callback === 'function'){
              callback();
            }
            return 'Success';;
          }
        });
      }
    }
}

function addAwsProfile(awsProfile, callback){
  if(/^[a-zA-Z0-9]*$/.test(awsProfile)){
    if(process.env.AWS_PROFILE){
      fs.readFile('./.env', 'utf8', (err, data) => {
        if (err) throw err;
        else{
          console.log
          let newEnv = data.replace(process.env.PROFILE, awsProfile);
          fs.writeFile('./.env', newEnv, (err, data) => {
            if (err) throw err;
            else{
              console.log(`AWS_PROFILE value has been updated to ${awsProfile}`)
              if(callback && typeof callback === 'function'){
                callback();
              }
              return 'Success';
            }
          });
        }
      });
    }
    else{
      fs.appendFile('.env', `\nAWS_PROFILE=${awsProfile}`, function (err) {
        if (err) throw err;
        else {
          console.log(`your AWS_PROFILE has been saved as ${awsProfile}`);
          if(callback && typeof callback === 'function'){
            callback();
          }
          return 'Success';
        }
      });
    }
  }
  else{
    let err = "AWS Profile invalid. Only alphanumeric characters accepted. No spaces.";
    console.error(err);
    throw new Error(err);
  }
}

//adds aws region to config and 
module.exports = function CreateIamUser(iamUserName, awsRegion, callback) {
  //check that iam user name is alphanumeric
  var url = `https://console.aws.amazon.com/iam/home?region=${awsRegion}#/users$new?step=review&accessKey&userNames=${iamUserName}&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess`;
  if(awsRegion){
    try {
      addAwsRegion(awsRegion, addAwsProfile(iamUserName))
    }
    catch(err){
      console.error(err)
    }
  }
  else {
    let rawdata = fs.readFileSync(`./settings.json`);  
    obj = JSON.parse(rawdata);
    if(!process.env.AWS_REGION){
      let err = "no AWS_REGION variable found in the .env file";
      console.error(err)
      throw new Error(err)
    }
    else{
      addAwsProfile(iamUserName);
      if(callback && typeof callback === 'function'){
        callback(null, url);
      }
      else{
        return url;
      }
    }
  }
}
