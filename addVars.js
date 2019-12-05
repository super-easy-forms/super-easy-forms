var fs = require("fs");

//function that adds values to the variables.json file
module.exports = function addVars(formName, variable, value){
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`forms/${formName}/config.json`, jsonString);
  console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  return 'Success';
}