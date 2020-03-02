# Super Easy Forms Documentation
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://gkpty.mit-license.org)
[![Build Status](https://travis-ci.com/gkpty/super-easy-forms.svg?branch=master)](https://travis-ci.com/gkpty/super-easy-forms)

# Introduction
## What is super easy forms?
Its a modular, open source tool that generates serverless web forms (front-end and back-end) in seconds. It leverages [CloudFormation](https://aws.amazon.com/cloudformation/) templates to create all of your necessary resources in the AWS cloud including a A Dynamo DB table, an API Gateway endpoint, and a lambda function. It also automatically generates a ready-to-go html contact form that you can copy-paste into your site. the tool is fast, easy to use/integrate,  and completely free as all the AWS resources created have a [free tier](https://aws.amazon.com/free/). Version 2 now features increased usability, security, and flexibility.

## Background
In the last couple of years the introduction of new cloud services for storage, compute, and content delivery have been improving the usability of static websites. These services allow us to build tools which can bypass most of the limitations commonly associated with static websites. One such limitation is adding forms that can process submissions. We built Super Easy Forms because we needed a fast, modular, open source solution to add/update contact forms in all of our static websites. We hope you find it useful.

## New features in version 2.0
- **Updated to node 10.X**
- **Easier installation** Built in commands have been added to further facilitate installation/configuration/setup
- **Documentation:** Detailed documentation includes an API method glossary, CLI commands and everything else you need to use/integrate/collaborate with super-easy-forms.
- **Multiple Forms** You can create as many forms as you want within each of your projects.
- **Support for multiple Forms:** Create and monitor as many forms as you want.
- **List/Export your form submissions:** New command that lets you list or export the database table of your form as either JSON or CSV.
- **Reusable methods:** Easily integrate super-easy-forms into your own project or workflow.
- **Local config files:** Allow you to easily monitor and update each of your forms
- **Independent multi CLI:** A separate package ([super-easy-forms-cli](https://github.com/gkpty/super-easy-forms-cli)) with multiple commands that have several options and flags allowing you to create/update/delete any of the components of a form individually or all together.
- [**CloudFormation**](https://aws.amazon.com/cloudformation/) **template:** Easily keep track of the multiple AWS resources for each one of your forms. You can also modify the templates directly to customize the resources in your form.
- **Input sanitation:** Uses an AWS API Gateway Model and API validator to insure that the parameters supplied are the correct ones before the call even reaches the lambda function.
- **Support for all html input types:** Check [W3schools](https://www.w3schools.com/html/html_form_input_types.asp) for a list of all the valid html types
- **Support for html select with options:** Add Select lists to your form and supply the options
- **Support for required attributes:** Choose which fields in your form you want to make required
- **Smart labels:** The parser will read your input fields and create labels for you by separating camel cased values and sepparating dashes/underscores and capitalizing first letters. E.g. first_name → First Name or  firstName → First Name
- **Custom email message/subject** you can customize the email message and subject that gets sent when someone submits a form.
- **Optional** [**reCAPTCHA**](https://developers.google.com/recaptcha/intro)**:** Add Google’s ReCaptcha v2 to your contact form to insure that requests are only coming in from a trusted source i.e. your website and that the users submitting it are indeed humans.

# Installation
## Pre-requisites
- Make sure you have node.js (10.x +) and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
- Have an AWS account. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Installation
1. if you dont have an existing static website project you can create a new directory `mkdir project-name` replacing project-name with the desired name for your project. 
2. Go into your desired project's directory `cd project-name` 
3. **install super easy forms** `npm install super-easy-forms`
4. **Install the super easy forms CLI globally** `npm install -g super-easy-forms-cli`
5. **Run the build command** Run `$ sef build -r=your-aws-region -p=profile-name` from the root of your project's directory. replace profile-name with the desired name of the IAM user and your-aws-region with the desired AWS region code.
6. Finish creating your IAM user in the AWS Console and hold on to the access keys. If you had already created your IAM user you can ignore this step and close the browser window.
7. **Update the local profile in your machine.** The local profiles are stored in `~/.aws/credentials` in mac/linux or in `C:\Users\USER_NAME\.aws\credentials` in windows. you can create/edit this file by runing `sudo nano ~/.aws/credentials`. add the profile keys in the format shown bellow.

        [profilename]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

# Usage
## Create a serverless form
1. open up the terminal and go to the root of your project `cd your-project-name`
2. run `sef init formname` replace formname with the name you want to give to your new form. For example the domain name followed by paymentform.
3. edit the config file saved in `./forms/formname/config.json` and add values for the variables shown bellow following the same format. captcha, emailMessage and emailSubject are optional. 
4. run `sef fullform formname`

```
{
  "email":"your@email.com",
  "recipients":["recipient1@email.com","recipient2@email.com"],
  "formFields":{
    "fullName":{
      "type":"text",
      "label":"Full Name",
      "required":true
    },
    "email":{
      "type":"email",
      "label":"Email",
      "required":false
    },
    "payment":{
      "type":"select",
      "label":"Payment",
      "required":true,
      "options":{
        "visa":"Visa",
        "master_card":"Master card",
        "cash":"Cash"
      }
    },
    "paymentAmount":{
      "type":"number",
      "label":"Payment Amount",
      "required":true
    }
  },
  "captcha":false,
  "emailSubject":"",
  "emailMessage":"",
}
```
This creates the back-end and fornt-end for a form called formname. the form will have the fields Full Name, Email,Payment method (with options Visa, Master Card, or Cash) and payment amount. Whenever someone submits the form an email will be sent from your@email.com to recipient1@email.com and recipient2@email.com.

Optionally you can provide your desired values directly in the CLI flags without having to edit the config file as shown in the command bellow.
      sef fullform formname --email=your@email.com --fields=fullName=text=required,email=email=required,paymentMethod=select=required=visa/master_card/cash,paymentAmount=number=required --recipients=recipient1@email.com,recipient2@email.com

## Use the API
        const SEF = require('super-easy-forms')

        SEF.CreateForm(formName, options, function(err, data){
                if(err) console.error(err)
                else{
                        //Do Something
                }
        })

## Optional Arguments & Callbacks
All forms will generate a folder for that form within your project. this folder will contain the forms config.json file which keeps track of all of that form’s variables.

All of the super easy form commands make use of optional arguments and optional callbacks. if a required argument isn’t supplied to one of the methods that method will check the form's local config file and use the value stored there. if the argument isn't provided in params and isn't found in the form’s config file it will throw an error.

All methods have the `function(formName, options, callback)` format and all  the callbacks have the `function(err,data)` format.

If a callback isn’t provided methods will return the data value or throw an error in the case of an error. If you don’t provide any options you can provide the callback as the second argument.

# Project structure
## Project Structure 
At the root of the project you will find the forms folder which will contain all of your forms
    |- forms/
        |- yourFrom/
            |- exports/
            |- yourForm.html
            |- config.json
            |- template.json
            |- yourFormFunction.zip
            |- yourFormFunction
                |-index.js
                |node_modules/
    |- .env
    |- .gitignore
    |- settings.json
    |- node_modules
        |- super_easy_forms/
            
## Form Config file
A config.json file with all of the form variables is created for each of your forms. 
    {
      "email":"String",
      "emailSubject":"String",
      "emailMessage":"String",
      "recipients":[Array],
      "formFields":{Object},
      "endPointUrl":"String",
      "captcha":true|false,
      "zip": true|false,
      "functionBucket": true|false,
      "stackId":"String",
      "restApiId":"String"
    }

# Components
## The Lambda Function
The CreateLambda method generates the node.js code for the lambda function  and places it in a directory with its reuqired modules. Then it zips the directory and uploads it to an S3 bucket.
1. The lambda function will receive a JSON object with the form output.
2. If you selected the captcha option, it will use axios to send a post request to google’s recaptcha server and verify the response.
3. Then it will format the fields to be stored in dynamoDB and call the dynamoDB putItem method to save the item.
4. If this operation is successful it will send an email message using SES to the desired recipients.

## The CloudFormation Template
AWS CloudFormation is a IaC (Infrastructure as code) service from AWS that allows you to define stacks composed of AWS resources in a JSON or YAML file called a cloudformation template. This makes it easy to keep track of the multiple resources used by each of your forms. The cloudformation template is stored in each form’s directory in the file called template.json.

![Diagram exported from AWS CloudFormation Designer](https://paper-attachments.dropbox.com/s_B70B5B93F7E2794EC706951FA6D762D4D2818CCCBBF59F7D45472AC441AABAE2_1576391819245_template1-designer.png)

## The Form Generator
The createForm function takes in a JSON object with the format shown bellow and outputs a responsive HTML form (bootstrap) with an inline JQuery handler. In the config file, you can add labels/placeholders and provide options for things like required fields, different html types and more. The HTML form is completely customizable as its pure HTML; no iframes!
    "formFields":{
        "fullName":{
          "type":"text",
          "label":"Full Name",
          "required":true
        },
        "email":{
          "type":"email",
          "label":"Email",
          "required":false
          },
        "payment":{
          "type":"select",
          "label":"Payment",
          "required":true,
          "options":{
            "visa":"Visa",
            "master_card":"Master card",
            "cash":"Cash"
          }
        },
        "paymentAmount":{
          "type":"number",
          "label":"Payment Amount",
          "required":true
        }
      },
The form and fullform commands in the CLI use the parseFields method which takes in a string in the following format `--fields=fullName=text=required,email=email=required,paymentMethod=select=required=visa/master_card/cash,paymentAmount=number=required` and converts it to a JSON object with the required format be stored in the forms config file and passed to the createForm function. The labels option in the CLI adds human friendly labels to form inputs and to the select options by separating camel-cased characters, replacing underscores and dashes with spaces, and capitalizing first letters.

# Registering emails
SES is a service from AWS that allows you to send emails programmatically using any email provider. Please be aware that if you want to use AWS SES to send emails to external recipients (whose email addresses haven't been verified with SES in your AWS account) you must [move out of the AWS SES Sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html).  

To verify a new email with AWS SES run `sef email formName your@email.com -n` replacing formName with the name of your form and your@email with the email you want to verify.

# Captcha
Super easy forms allows you to easily integrate google's reCAPTCHA service into your html forms. Before being able to use this feature make sure to [sign up for a reCAPTCHA key pair](http://www.google.com/recaptcha/admin/create)

Once you have added a key pair for the correct domain of your respective project, add the following variables in your .env file by running `sudo nano .env` or opening the file in your text editor of choice.
    RECAPTCHA_KEY=your_site_key
    RECAPTCHA_SECRET=your_site_secret_key

now when you run a command from the CLI make sure to add the —recaptcha flag or -r shortcut. If you are using the API provide the captcha argument of the options param as true. If you are adding CAPTCHA to an already deployed form, make sure to also update your lambda function.

Please be aware that the captcha checkbox will not work unless the request is coming in from the domain you registered when requesting your key pair.

# API Glossary
1. **GetSubmissions(formName, callback):** Lists all of the responses recieved to stdout
    1. **formName**: String: Required: the name of the form
    2. **returns** an array of JSON Objects
2. **ExportSubmission(formName, format, callback):** Exports all of the responses saved by your form.   ****
    1. **formName:** String: Required: the name of the form
    2. **format:** String: Required: the format of your export. options are csv or json. default is 
    3. **returns:** String: **** Success
3. **CreateForm(formName, options, callback):** generates a form according to formFields supplied in options or from the form config. 
    1. **formName**: String: Required: the name of the form
    2. **options** = {"endpointUrl":"", "formFields":{}, “captcha”:ture|false}
        1. **endpointUrl:** String: Required: The URL of an AWES API Gateway endpoint.
        2. **formFields:** Object: Required: JSON object with the formFields. Check out the form generator section for the correct format.
        3. **captcha:** Boolean: Optional: Adds a google ReCAPTCHA v2 checkbox to your form.
    3. **returns:** String: the html form as a string
4. **CreateLambdaFunction(formName, options, callback):** creates a lambda function and saves it as a js file in the form folder
    1. **formName**: String: Required: the name of the form
    2. **options** = {"email": "", "formFields":"", "recipients":[], "emailMessage":"", "emailSubject":"", "captcha":true|false, "zip":true|false, "functionBucket":true|false}
        1. **email:** String: Required: the email you will use to send submissions
        2. **formFields:** Object: Required: JSON object with the formFields. Check out the form generator section for the correct format.
        3. **recipients:** Array: Optional: an array of emails (strings). one or more recipients are not provided, the value provided for email will be used as the recipient.
        4. **emailMessage** String: Optional: the body of the email message that gets sent upon form submission. you can html and use the `<FormOutput>` variable to include the output of the form in the message. The default message is: `<h4>New Contact</h4><br><p>Someone has just filled out your super easy form! bellow are their details: <br> <FormOutput>`
        4. **emailSubject** String: Optional: The subject of the email message that gets sent upon form submission. the default subject is `Super Easy Forms - New Contact`
        6. **zip** Boolean: Optional: Zips your lambda deployment package and saves it in `forms/formname/formnameFunction.zip`. Default value is false.
        7. **functionBucket** Boolean: Optional: creates an s3 bucket called yourformfunction and uploads the zipped deployment package. Default value is false.
    3. **returns**: String: The Body of the lambda function.
5. **CreateTemplate(formName, options, callback):** creates a cloudformation template for your form. You can then customize the template for the form and deploy it
    1. **formName**: String: Required: the name of the form
    2. **options** = {"formFields": {},"email":""}
        1. **formFields:** Object: Required: JSON object with the formFields. Check out the form generator section for the correct format.
        2. **email:** String: Required: the email you will use to send submissions
    3. **returns** the cloudformation template as a string
6. **ValidateTemplate(formName, templateBody, callback)**: returns the ARN of the SES  property if the email has been confirmed.
    1. **formName:** String: Required: the name of the form
    2. **templateBody**: String: Required: the cloudformation template as a string. 
    3. **returns** the ARN of the stack or an error.
7. **CreateStack(formName, templateBody, callback):** Deploys the desired stack with AWS cloudformation which takes care of deploying all the individual resources in the correct order.
    1. **formName:** String: Required: the name of the form
    2. **templateBody:** String: Required: the body of your cloudformation template.
    3. **returns** the ARN of the stack
8. **UpdateStack(formName, templateBody, callback)**
    1. **formName:** String: Required: the name of the form
    2. **templateBody:** String: Required: the body of your cloudformation template. 
    3. **returns** a string ‘done’
9. **DeleteStack(formName, callback):** Deletes all of the resources in the AWS cloud for the desired form as well as its local folders/files.
    1. **formName:** String: Required: the name of the form
    2. **returns** a string ‘done’
10. **GetApiUrl(formName, stackId, callback):** Fetches the ARN for the Rest API created for the form and returns the endpoint URL. 
    1. **formName:** String: Required: the name of the form
    2. **returns** a string with the url of the API gateway endpoint
11. **VerifySesEmail(email, callback):** verifies a new email identity to be used with AWS SES and adds it to the form's config file. if the email hasnt been added before it also adds it to the eamil section.
        1. **email:** String: Required: the email you will use to send submissions
        2. **returns** true or false
12. **SesEmail(formName, options, callback):** Checks the provided email, if it hasnt been verified, it verifies it with SES.
    1. **formName** String: Required: name of the form 
    2. **options** = {"email":""}
        1. **email:** String: Required: the email you will use to send submissions
    2. **returns** true or false depending on wether or not you have verified your email
13. **VerifySesEmail(email, callback):** Verifies a new provided email with AWS SES. After running this command youll recieve an email from AWS SES which you must confirm.
    1. **email:** String: Required: the email you use to send submissions
    2. **returns** true or false
14. **ValidateSesEmail(formName, email, callback)**: checks that the supplied email vas been verified with AWS
    1. **formName:** String: Required: the name of the form
    2. **email:** String: Required: the email you use to send submissions
    3. **returns** true or false
15. **CreateIamUser(iamUserName, awsRegion, callback):** Returns a URL that will take you to the last step of the IAM users creation in the AWS console.  ****
    1. **iamUserName**: String: desired name for the new iam user and the local profile you will create.
    2. **awsRegion**: String: a valid AWS region. check out the table above for valid codes.
    3. **returns** String: an AWS url that takes you to the last step of the IAM user’s creation.
16. **ParseFields(fields, labels)**
    1. **fields:** String: a string that contains all formfields and options. each formfield can contain `name=type=required`. by default required is set to false and type to text. each form field must be sepparrated by comas. options in the slect field must be sepparated by `/`
    2. **labels:** Boolean: true or false if you want to automatically add labels.
17. **CreateLabel(value)**: takes in a a value and returns a label.
    1. **value:** String: string value for your form input field.
18. **AddConfigVariable(formName, variable, value, callback)**: add a variable to the config file of a form
    1. **formName:** String: the name of the form
    2. **email**: String: the email you use to send submissions
    3. **returns**: String: `Success`
19. **initBuild(region, profile, callback)**: Builds the required files and directories in the root of the project and adds your aws profile and region to the .env file.
    1. **region:** String: Required: The desired AWS region's code.
    2. **profile**: String: the name of your desired IAM profile.
    3. **returns**: a string `Success`
20. **InitForm(formName, callback)**: Create a new directrory for your form with a config.json file that contains all of the variables with empty values
    1. **formName**: String: Required: the name of the form
    2. **returns**: String: `Created a config file with no values for your form`
21. **updateLambdaFunction(formName, callback)**: Re-zips your lambda function deployment package, uploads it to an s3 bucket and then updates the lambda function with the contents of the s3 bucket. 
    1. **formName**: String: Required: the name of the form
    2. **returns**: String: `Succesfully updated the lambda function`

# CLI Commands
## sef build
Builds the required base files and directories.
```
USAGE
  $ sef build

OPTIONS
  -p, --profile=profile  The name of the iam profile/user that you want to create
  -r, --region=region    The desired AWS region were your forms infrastructure will be deployed
```
_See code: [src/commands/build.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/build.js)_


## sef delete NAME
Deletes all resources in the AWS cloud for the desired form
```
USAGE
  $ sef delete NAME

ARGUMENTS
  NAME  name of the form you want to delete

OPTIONS
  -r, --resources  Delete all of the back-end resources for your form in the cloud
```
_See code: [src/commands/delete.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/delete.js)_


## sef deploy NAME
Deploys your stack in the AWS Cloud
```
USAGE
  $ sef deploy NAME

ARGUMENTS
  NAME  name of the form you want to delete

OPTIONS
  -c, --create  Deploy a new cloudformation stack in the AWS cloud
  -u, --update  Update your stack in the AWS cloud
```
_See code: [src/commands/deploy.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/deploy.js)_


## sef email EMAIL [NAME]
Verifies/validates your email with AWS SES
```
USAGE
  $ sef email EMAIL [NAME]

ARGUMENTS
  EMAIL  the email address that will send the form submission emails
  NAME   name of the form - must be unique

OPTIONS
  -n, --new       verifies a new email address to be used by AWS SES to send email
  -v, --validate  validates that the provided email address was verified with AWS SES
```
_See code: [src/commands/email.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/email.js)_


## sef form NAME
Builds an html form
```
USAGE
  $ sef form NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -c, --captcha        Adds recaptcha elements and scripts to the form
  -f, --fields=fields  Desired form formFields
  -l, --labels         Automatically add labels to your form
  -u, --url=url        The API endpoint endpointUrl for your form
```
_See code: [src/commands/form.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/form.js)_


## sef fullform NAME
Generates an html form and saves it in the formNames folder
```
USAGE
  $ sef fullform NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -c, --captcha                Adds recaptcha elements and scripts to the form and lambda function
  -e, --email=email            Email address that will be used to send emails
  -f, --fields=fields          Desired form formFields

  -m, --message=message        the email message body. you can use html and you can use <FormOutput> to include the
                               information from the form submission

  -r, --recipients=recipients  Recipients that will recieve emails on your behalf.

  -s, --subject                the subject of the email message
```
_See code: [src/commands/fullform.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/fullform.js)_


## sef help [COMMAND]
display help for sef
```
USAGE
  $ sef help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```
_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.2/src/commands/help.ts)_


## sef iam USER [REGION]
the --create flag will open up a window with the AWS console so that you confirm the creation of a user with the entered name.
```
USAGE
  $ sef iam USER [REGION]

ARGUMENTS
  USER    name of the IAM user
  REGION  your desired AWS region.

OPTIONS
  -c, --create  Helps you create an IAM user and adds its profile to the .env file
```
_See code: [src/commands/iam.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/iam.js)_


## sef init NAME
Creates a config file with empty values for your form.
```
USAGE
  $ sef init NAME

ARGUMENTS
  NAME    name of the form - must be unique
```
_See code: [src/commands/init.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/init.js)_


## sef lambda NAME [ACTION]
Generates a lambda function and saves it as lambdaFunction.js in the formNames folder
```
USAGE
  $ sef lambda NAME [ACTION]

ARGUMENTS
  NAME    name of the form - must be unique
  ACTION  (create|update) [default: create] action to perform to the lambda function - create or update

OPTIONS
  -b, --bucket                 creates a new s3 bucket and uploads the zipped lambda function
  -c, --captcha                Adds recaptcha elements to the lambda function
  -e, --email=email            Email address that will be used to send emails
  -f, --fields=fields          Desired form formFields

  -m, --message=message        the email message body. you can use html and you can use <FormOutput> to include the
                               information from the form submission

  -r, --recipients=recipients  Recipients that will recieve emails on your behalf.

  -s, --subject                the subject of the email message

  -z, --zip                    zips the lambda function
```
_See code: [src/commands/lambda.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/lambda.js)_


## sef submissions NAME
export or list all of the suibmissions you have had to date for a selected form
```
USAGE
  $ sef submissions NAME

ARGUMENTS
  NAME  name of the form

OPTIONS
  -e, --export           Exports all submissions for the form to its folder
  -f, --format=csv|json  Desired format csv|json
  -l, --list             print all submissions for the form to stdout
```
_See code: [src/commands/submissions.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/submissions.js)_


## sef template NAME
validate/create/update your cloudformation template saved locally
```
USAGE
  $ sef template NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -c, --create         Create a new cloudformation temmplate and saves it locally
  -e, --email=email    Email address that will be used to send emails
  -f, --fields=fields  Desired form formFields
  -v, --validate       Validate your cloudformation template with AWS
```
_See code: [src/commands/template.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/template.js)_


## sef variable NAME VARIABLE VALUE
Builds an html form
```
USAGE
  $ sef variable NAME VARIABLE VALUE

ARGUMENTS
  NAME      name of the form
  VARIABLE  name of the variable
  VALUE     value of the variable
```
_See code: [src/commands/variable.js](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.5/src/commands/variable.js)_


# Troubleshooting
If you have modified the super-easy-forms source code and your commands are failing for some reason, you can run the test suite with `npm test`. If this doesnt help you locate your errors youll have to debug your code. 

If your forms arent being submitted you can these steps to troubleshoot:
1. Validate your cloud formation template you can use the template command with the --validate flag or the -v shortcut `sef template NAME -v`.
2. Test the lambda function in the AWS lambda console by using the test feature.
3. Test the API gateway endpoint in the AWS console by using the test feature.
4. Test the API by using curl. Follow the format of the curl command bellow.
5. Test the API from an external form: insure that CORS is properly enabled in the API.
6. generate a form for your API and try submitting. check out the browser's console logs in google chrome for any errors.
    curl -d '{"id":"", "fullName":"john doe", "email":"johndoe@email.com", "message":"hello world"}' -H 'Content-Type: application/json' https://your-api-url



