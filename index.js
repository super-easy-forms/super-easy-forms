var CreateForm = require('./lib/CreateForm');
var CreateLambdaFunction = require('./lib/CreateLambda');
var CreateTemplate = require('./lib/CreateTemplate');
var ValidateTemplate = require('./lib/ValidateTemplate');
var CreateStack = require('./lib/CreateStack');
var GetApiUrl = require('./lib/GetApiUrl');
var Email = require('./lib/SesEmail');
var CreateIamUser = require('./lib/CreateIamUser')
var FormConfig = require('./lib/Config')
var {initBuild} = require('./build')

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
module.exports.ParseFields = FormConfig.ParseFields;
module.exports.AddConfigVariable = FormConfig.AddVar;
module.exports.Build = initBuild;
module.exports.CreateLabel = FormConfig.CreateLabel;
