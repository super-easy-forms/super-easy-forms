var {CheckForm} = require('./Config');
var fs = require("fs");
var {optionError} = require('./InternalModules')

module.exports = function initForm(formName, callback){
  CheckForm(formName, function(err, data){
    if(err) optionError(err, callback)
    else {
      let config = {
        "email":"",
        "emailSubject":"",
        "emailMessage":"",
        "recipients":[],
        "formFields":{},
        "endPointUrl":"",
        "captcha":false,
        "zip": false,
        "functionBucket": false,
        "stackId":"",
        "restApiId":""
      }
      let configstring = JSON.stringify(config)
      configstring = configstring.replace(/,/g, ",\n").replace('{', '{\n').replace(new RegExp('}' + '$'), '\n}')
      console.log(configstring)
      fs.writeFile(`forms/${formName}/config.json`, configstring, function(err, data){
        if(err) optionError(err, callback);
        else {
          let success = 'Created a config file with no values for your form'
          if(callback && typeof callback === 'function') callback(null, success);
					else return success;
        }
      })
    }
  })
}