//function that adds values to the variables.json file
exports.script = function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  //console.log('\x1b[33m', 'Variable saved.', '\x1b[0m')
  return 'Success';
}