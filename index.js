var CreateTemplate = require('./modules/CreateTemplate');
var FormConfig = require('./modules/Config')
var GetApiUrl = require('./modules/GetApiUrl')
var CreateIamUser = require('./modules/CreateIamUser')
var Email = require('./modules/Email')

module.exports.AddConfigVariable = FormConfig.AddVar;
module.exports.GetApiUrl = GetApiUrl;
module.exports.CreateIamUser = CreateIamUser;
module.exports.VerifyDefaultEmail = Email.VerifydefaultEmail;
module.exports.VerifyNewSesEmail = Email
module.exports.ValidateSesEmail = Email
AddFormFields
CreateLambdaFunction
UpdateLambdaFunction
module.exports.CreateTemplate = CreateTemplate;
CreateStack
CreateStackWithForm
GetContacts
ExportContacts