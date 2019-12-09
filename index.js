var CreateForm = require('./modules/CreateForm');
var CreateLambdaFunction = require('./modules/CreateLambda');
var CreateTemplate = require('./modules/CreateTemplate');
var ValidateTemplate = require('./modules/ValidateTemplate');
var CreateStack = require('./modules/CreateStack');
var GetApiUrl = require('./modules/GetApiUrl');
var Email = require('./modules/SesEmail');
var CreateIamUser = require('./modules/CreateIamUser')
var FormConfig = require('./modules/Config')

//GetContacts
//ExportContacts
//CreateStackWithForm
module.exports.CreateForm = CreateForm;
module.exports.CreateLambdaFunction = CreateLambdaFunction;
//UpdateLambdaFunction
module.exports.CreateTemplate = CreateTemplate;
module.exports.ValidateTemplate = ValidateTemplate;
module.exports.CreateStack = CreateStack;
module.exports.GetApiUrl = GetApiUrl;
module.exports.VerifyDefaultEmail = Email.VerifyDefaultEmail;
module.exports.VerifySesEmail = Email.VerifySesEmail;
module.exports.ValidateSesEmail = Email.ValidateSesEmail;
module.exports.CreateIamUser = CreateIamUser;
module.exports.AddFormFields = FormConfig.AddFormFields;
module.exports.AddConfigVariable = FormConfig.AddVar;

