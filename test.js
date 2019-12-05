//Import .env
require('dotenv').config();
//package to use the file system
var fs = require("fs");


var createLambda = require('./create-lambda.js');

const sourceEmail = "mailer@torus-digital.com";
const form = "testform";


const myFormFields = {
  "id":"id",
  "name":"name",
  "message":"message"
}

function initDeployment(formName) {
  var dir = `forms/${formName}`;
  if (!fs.existsSync(dir)){
      fs.mkdir(dir, (err) => {
        if (err) {
          throw err;
        }
        else {
          createLambda(myFormFields, form, sourceEmail, "deploy")
        }
      });
  }
  else {
    createLambda(myFormFields, form, sourceEmail, "deploy")
  }
}

initDeployment(form)