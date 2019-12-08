
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

/* function AddSetting(formName, variable, value){
  let rawdata = fs.readFileSync(`./settings.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`./settings.json`, jsonString);
  console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  return 'Success';
} */

//adds aws region to config and 
function CreateIamUser(iamUserName, awsRegion) {
  //check that iam user name is alphanumeric
  if(/^[a-zA-Z0-9]*$/.test(iamUserName)){
    let url = `https://console.aws.amazon.com/iam/home?region=${awsRegion}#/users$new?step=review&accessKey&userNames=${iamUserName}&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess`;
    if(awsRegion){
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
                  return url;
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
              return url;
            }
          });
        }
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
        return url;
      }
    }
  }
  else{
    let err = "Name invalid. Only alphanumeric characters. No spaces.";
    console.error(err);
    throw new Error(err);
  }
}

CreateIamUser("jason", "us-west-1")