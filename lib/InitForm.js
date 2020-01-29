var {CheckForm} = require('./Config');
var fs = require("fs");

module.exports = function initForm(formName){
  CheckForm(formName, function(err, data){
    if(err) console.log(err)
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
        if(err) console.log(err)
        else callback(null, 'Success')
      })
    }
  })
}