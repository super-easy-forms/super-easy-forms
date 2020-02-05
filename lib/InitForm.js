var {CheckForm} = require('./Config');
var fs = require("fs");
var {optionError} = require('./InternalModules')

module.exports = function initForm(formName, callback){
  CheckForm(formName, function(err, data){
    if(err) optionError(err, callback)
    else {
      let emptyConfig = {
        "email":"",
        "recipients":[],
        "formFields":{},
        "stackId":"",
        "restApiId":"",
        "endPointUrl":"",
        "recaptcha":false,
        "emailMessage":"",
        "emailSubject":""
      }
      fs.writeFile(`forms/${formName}/config.json`, emptyConfig, function(err, data){
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