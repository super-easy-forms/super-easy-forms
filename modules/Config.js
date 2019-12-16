//import necessary stuff
var fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//adds a variable to the config file of your form
function AddVar(formName, variable, value){
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`forms/${formName}/config.json`, jsonString);
  console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  return 'Success';
}

//adds a variable to the settings file
function AddSetting(variable, value){
  let rawdata = fs.readFileSync(`./settings.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`./settings.json`, jsonString);
  console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  return 'Success';
}

//creates a JSON object called fields containing the form fields and attributes provided by the user
function AddFormFields(formName, labels){
  var x = readline.question(`Please enter your desired form fields sepparated by spaces.`, (fields) => {
    var fieldArray = fields.split(" ");
    //addVars(formName, 'formFields', response);
    let myFields = {}
    //var jstring = `"id":"id",`;
    for(let f of fieldArray){
      let type = "text"
      let label = "";
      let required = false;
      let part = f.split("=")
      if(part[1]){
        type = part[1] 
      }
      if(part[2] && part[2] === "required") {
        required = true;
      }
      if(labels === true){
        label = createLabel(part[0]);
      }
      myFields[part[0]]={
        "type": type,
        "label": label,
        "required": required
      }
    }
    addVars(formName, "fields", myFields)
    deployStack(formName, myFields)
    //createLambda.script(jsonstring, table)
    readline.close();
  });
}

function newFormConfig(formName, callback) {
  fs.writeFile(`forms/${formName}/config.json`, '{}', (err) => {
    if (err) {
      if(callback && typeof callback === 'function') callback(new Error(err))
      else throw new Error(err);
    }
    else {
      console.log(`created the config file for the form ${formName}`)
      if(callback && typeof callback === 'function') callback(null, 'Success')
      else return 'Success';
    }
  })  
}

//checks if the directory for a form alreadsy exists; if not it creates one
function checkForm(formName, callback){
  if(/^[a-zA-Z0-9]*$/.test(formName)) {
    var dir = `./forms/${formName}`;
    if (!fs.existsSync(dir)){
      fs.mkdir(dir, (err) => {
        if (err) {
          if(callback && typeof callback === 'function') callback(new Error(err))
          else throw new Error(err);
        }
        else {
          newFormConfig(formName)
        }
      });
    }
    else {
      if(!fs.existsSync(`forms/${formName}/config.json`)){
        newFormConfig(formName)
      }
      else {
        if(callback && typeof callback === 'function') callback(null, 'Success')
        else return 'Success';
      }
    }
  }
  else {
    let err = 'Table name invalid. Only alphanumeric characters. No spaces.'
    if(callback && typeof callback === 'function') callback(new Error(err))
    else throw new Error(err);
  }
}

module.exports = {
  AddVar,
  AddSetting,
  AddFormFields
};