//import necessary stuff
var fs = require("fs");

//adds a variable to the config file of your form
function AddVar(formName, variable, value, callback){
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`forms/${formName}/config.json`, jsonString);
  //console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  if(callback && typeof callback === 'function') callback(null, 'Success');
  else return 'Success';
}

//adds a variable to the settings file
//adds a variable to the settings file
function AddSetting(variable, value, callback){
  let rawdata = fs.readFileSync(`./settings.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`./settings.json`, jsonString);
  //console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  if(callback && typeof callback === 'function') callback(null, 'Success');
  else return 'Success';
}

//return a friendly label for the desired value
function CreateLabel(value){
  let str = value.replace(/-/g, ' ').replace(/_/g, ' ')
  // insert a space before all caps
  .replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function(str){ return str.toUpperCase(); });
  //console.log(str);
  return str;
}

//creates a JSON object called fields containing the form fields and attributes provided by the user
function ParseFields(fields, labels){
    var fieldArray = fields.split(",");
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
        label = CreateLabel(part[0]);
      }
      myFields[part[0]]={
        "type": type,
        "label": label,
        "required": required
      }
      if(part[3] && part[1] === "select") {
        let options = part[3].split("/")
        let val = {}
        for(option of options){
          val[option] = CreateLabel(option)
        }
        let select = myFields[part[0]] 
        select["options"] = val 
      }
    }
    return myFields
}

function newFormConfig(formName, callback) {
  fs.writeFile(`forms/${formName}/config.json`, '{}', (err) => {
    if (err) {
      callback(new Error(err))
    }
    else {
      //console.log(`created the config file for the form ${formName}`)
      callback(null, false)
    }
  })  
}

//checks if the directory for a form alreadsy exists; if not it creates one
function CheckForm(formName, callback){
  if(/^[a-zA-Z0-9]*$/.test(formName)) {
    var dir = `./forms/${formName}`;
    if (fs.existsSync(dir)){
      if(fs.existsSync(`forms/${formName}/config.json`)){
        if(callback && typeof callback === 'function') callback(null, true)
        else return 'Success';
      }
      else {
        newFormConfig(formName, callback)
      }
    }
    else {
      fs.mkdir(dir, (err) => {
        if (err) {
          if(callback && typeof callback === 'function') callback(new Error(err))
          else throw new Error(err);
        }
        else {
          newFormConfig(formName, callback)
        }
      });
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
  ParseFields,
  CheckForm
};