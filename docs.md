# Super Easy Forms Documentation

## What is super easy forms?

Its a modular, open source tool that generates serverless web forms (front-end and back-end) in seconds. It leverages [CloudFormation](https://aws.amazon.com/cloudformation/) templates to create all of your necessary resources in the AWS cloud including a A Dynamo DB table, an API Gateway endpoint, and a lambda function. It also automatically generates a ready-to-go html contact form that you can copy-paste into your site. the tool is fast, easy to use/integrate,  and completely free as all the AWS resources created have a [free tier](https://aws.amazon.com/free/). Version 2.0 now features increased usability, security, and flexibility.


## Background

In the last couple of years the introduction of new cloud services for storage, compute, and content delivery have been improving the usability of static websites. These services allow us to build tools which can bypass most of the limitations associated with static websites. One such limitation is adding contact forms. We built Super Easy Forms because we needed a fast, modular, open source solution to add/update contact forms in all of our static websites. We hope you find it useful.


## New features in version 2.0
- **Updated to node 10.X**
- **Easier installation** Built in commands have been added to further facilitate installation/configuration/setup
- **Documentation:** Detailed documentation includes an API method glossary, CLI commands and everything else you need to use/integrate/collaborate with super-easy-forms.
- **Support for multiple Forms:** Create and monitor as many forms as you want.
- **Export your form submissions:** Command that lets you export the database table of your form as either JSON or CSV.
- **Reusable methods:** Easily integrate super-easy-forms into your own project or build your own workflows using components from super-easy-forms.
- **Local config files:** Allow you to easily monitor and update each of your forms
- **Independent multi CLI:** A separate package ([super-easy-forms-cli](https://github.com/gkpty/super-easy-forms-cli)) with multiple commands that have several options and flags allowing you to customize and create/update/delete any of the components in a form individually or together.
- [**CloudFormation**](https://aws.amazon.com/cloudformation/) **template:** Easily keep track of the multiple AWS resources for each one of your forms. You can also modify the templates directly to customize the resources in your form.
- **Input sanitation:** Uses an AWS API Gateway Model and API validator to insure that the parameters supplied are the correct ones before the call even reaches the lambda function.
- **Support for all html types:** Check [W3schools](https://www.w3schools.com/html/html_form_input_types.asp) for a list of all the valid html types
- **Support for html select with options:** Add Select lists to your form and supply the options
****- **Support for required attributes:** Choose which fields in your form you want to make required
- **Smart labels:** The parser will read your input fields and create labels for you by separating camel cased values and sepparating dashes/underscores and capitalizing first letters. E.g. first_name → First Name or  firstName → First Name
- **Optional** [**reCAPTCHA**](https://developers.google.com/recaptcha/intro)**:** Add Google’s ReCaptcha v2 to your contact form to insure that requests are only coming in from a trusted source i.e. your website and that the users submitting it are indeed humans.


# Installation
## Pre-requisites
- Make sure you have node.js (10.x +) and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
- You need to have an AWS account. If you don't have one, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Dont worry, its free!
## Installation

1. Create a a new directory for yournew super easy forms project. 
2. Install super easy forms with npm. `npm install super-easy-forms`
3. Install the super easy forms CLI with npm. `npm install -g super-easy-forms-cli`

## Setup
1. **Create the necesary local files** Run `$ sef build` from the root of the project.
2. **Create an IAM user with administrator access.** you can use the `sef iam profilename -c` command replacing profilename for the desired name of your IAM user. hold on to the access Id and secret key displayed.
3. **Update the local profile in your machine.** The local profiles are stored in `~/.aws/credentials` in mac/linux or in `C:\Users\USER_NAME\.aws\credentials` in windows. you can create/edit this file by runing `sudo nano ~/.aws/credentials` or something similar. add the profile keys in the format shown bellow and save the file.
    [profilename]
    aws_access_key_id = <YOUR_ACCESS_KEY_ID>
    aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
4. **Add your AWS profile in the .env file of your project** `AWS_PROFILE=default` 

*Optionally you can add the IAM user’s credentials directly in the .env file w/o creating the local profile.

    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secert-access-key 
5. **Also add your AWS region to .env and save the file.** `AWS_REGION=us-east-1` replace us-east-1 if your using a different region. You can refer to the table bellow for a list of valid AWS regions.


| **Region Name**            |  |
| -------------------------- |  |
| US East (Ohio)             |  |
| US East (N. Virginia)      |  |
| US West (N. California)    |  |
| US West (Oregon)           |  |
| Asia Pacific (Hong Kong)   |  |
| Asia Pacific (Mumbai)      |  |
| Asia Pacific (Osaka-Local) |  |
| Asia Pacific (Seoul)       |  |
| Asia Pacific (Singapore)   |  |
| Asia Pacific (Sydney)      |  |
| Asia Pacific (Tokyo)       |  |
| Canada (Central)           |  |
| China (Beijing)            |  |
| China (Ningxia)            |  |
| EU (Frankfurt)             |  |
| EU (Ireland)               |  |
| EU (London)                |  |
| EU (Paris)                 |  |
| EU (Stockholm)             |  |
| Middle East (Bahrain)      |  |
| South America (Sao Paulo)  |  |
| AWS GovCloud (US-East)     |  |
| AWS GovCloud (US-West)     |  |

# Usage
## modules
    const SEF = require('super-easy-forms')
    
    SEF.CreateForm(formName, options, function(err, data){
      if(err) console.error(err)
      else{
        //Do Something
      }
    })
## CLI
1. open up the terminal and go to the root of your project  `$ cd your-project-name`
2. run the command bellow
3. Copy-paste the created form directly into your static website’s body wherever you want it.
4. Customize it however you want.


    $ sef fullform formname --email=your@email.com --fields=fullName=text=required,email=email=required,paymentMethod=select=required=visa/master_card/cash,paymentAmount=number=required --recipients=recipient1@email.com,recipient2@email.com

*This command creates the stack and the html for a form called formname. the form will have the fields Full Name, Email, Payment method (with options Visa, Master Card, or Cash) and payment amount. Whenever someone submits the form an email will be sent from your@email.com to recipient1@email.com and recipient2@email.com.

## Optional Arguments & Callbacks

All forms will generate a folder for that form within your project. this folder will contain the forms config.json file which keeps track of all of that form’s variables.

All of the super easy form commands make use of optional arguments and optional callbacks. if a required argument isn’t supplied to one of the methods that method will check the form`s local config file and use the value stored there. if the argument isn't provided in params and isn't found in the form’s config file it will throw an error.

All methods have the `function(formName, options, callback)` format and all  the callbacks have the `function(err,data)` format.

Optional callbacks allow you to use any of the methods synchronously or asynchronously. If a callback isn’t provided methods will return the data value or throw an error in the case of an error. If you don’t provide any options you can provide the callback as the second argument.

## Project structure

At the root of the project you will find the forms folder which will contain all of your forms

    |- forms/
        |- yourFrom/
            |- exports/
            |- yourForm.html
            |- config.json
            |- template.json
            |- lambdaFunction.js
    |- .env
    |- .gitignore
    |- settings.json
    |- node_modules
        |- super_easy_forms
            |- img/
            |- lib/
            |- node_modules/
            |- test
            |- .travis.yml
            |- build.jd
            |- index.js
            |- LICENSE
            |- package.json
            |- package-lock.json
            |- README.md
            
## Config file Structure
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
## The Lambda Function
1. The lambda function will receive a JSON object with all the fields to be submitted.
2. If you selected the captcha option, it will check the captcha response submitted with google’s recaptcha server.
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


## Registering emails

 SES allows you to send emails programmatically using any email provider (gmail included). If you don’t have gmail this is a good option for sending emails programmatically. Please be aware that if you want to use AWS SES to send emails to external recipients (whose email addresses haven't been verified with SES in your AWS account) you must [move out of the AWS SES Sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html).  
 
 To verify a new email with AWS SES run `sef email formName your@email.com -n` replacing formName with the name of your form and your@email with the email you want to verify.

**Gmail / Gsuite addresses**
each gmail email consists of a different account and needs different API keys:

- To reister your API keys for a new gmail email please follow this link
- Then you need to provide the new email in your config and provide the new API public and private keys in the .ENV file replace alias with your emails alias. Your private keys need to be saved in the following format
    alias_EMAIL_PUBLIC:
    alias_EMAIL_SECRET:

Then you can run the command `sef addemail alias provider` use gmail for provider. This will check that you have created the required keys and will add your email address to the email config and will set the email config option to gmail in your config file.

By default a contact form will send emails to the same sender email. To send email to other email addresses you can provide the recipients flag --recipients or -r. This will prompt you to enter all the email addresses you want to send email to. Then your lambda function will be created to send emails to those addresses.


## Captcha

Super easy forms allows you to easily integrate google reCAPTCHA into your html forms. To use 

Before being able to use captcha in your forms make sure you have signed up for a reCAPTCHA key pair. [sign up for an API key pair](http://www.google.com/recaptcha/admin/create)

Once you have added a key pair for the correct domain of your respective project, add the following variables in your .env file by running `sudo nano .env` or opening the file in your text editor of choice.

    RECAPCTHA_KEY=your_site_key
    RECAPTCHA_SECRET=your_site_secret key

now when you run a command from the CLI make sure to add the —recaptcha flag or -r shortcut. If you are using a method make sure to provide the captcha argument of the options param as true

If you are adding CAPTCHA to an already deployed form, make sure to also update your lambda function.


# API Glossary


1. **GetSubmissions(formName, callback):** Lists all of the responses recieved to stdout
    1. **formName**: String: the name of the form
    2. **returns** an array of JSON Objects
2. **ExportSubmission(formName, format, callback):** Exports all of the responses saved by your form.   ****
    1. **formName:** String: the name of the form
    2. **format:** String: the format of your export. csv | json
    3. **returns:** String: **** Success
3. **CreateForm(formName, options, callback):** generates a form according to formFields supplied in options or from the form config. ****
    1. **options** = {"endpointUrl":"", "formFields":{}, “captcha”:ture|false}
        1. **endpointUrl:** String: The URL of an AWES API Gateway endpoint.
        2. **formFields:** Object: JSON object with the formFields. Check out the form generator section for the correct format.
        3. **captcha:** Add a google ReCAPTCHA v2 checkbox to your form.
    2. **returns:** String: the html form as a string
4. **CreateLambdaFunction(formName, options, callback):** creates a lambda function and saves it as a js file in the form folder
    1. **options** = {"email": "", "formFields":"", "recipients":[]}
        1. **email:** String: the email you will use to send submissions
        2. **formFields:** Object: JSON object with the formFields. Check out the form generator section for the correct format.
        3. **recipients:** Array: an array of emails (strings)
    2. **returns**: String: The Body of the lambda function.
5. **CreateTemplate(formName, options, callback):** creates a cloudformation template for your form. You can then customize the template for the form and deploy it
    1. **options** = {"formFields": {},"email":""} 
    2. **returns** the cloudformation template as a string
6. **ValidateTemplate(formName, templateBody, callback)**: returns the ARN of the SES  property if the email has been confirmed.
    1. **formName:** String: the name of the form
    2. **templateBody**: String: the cloudformation template as a string. 
    3. **returns** the ARN of the stack
7. **CreateStack(formName, templateBody, callback):** Deploys the desired stack with AWS cloudformation which takes care of deploying all the individual resources in the correct order.
    1. **formName:** String: the name of the form
    2. **templateBody:** String: the format of your export. csv | json
    3. **returns** the ARN of the stack
8. **UpdateStack(formName, templateBody, callback)**
    1. **formName:** String: the name of the form
    2. **templateBody:** String: the format of your export. csv | json
    3. **returns** ‘done’
9. **DeleteStack(formName, callback):** Deletes all of the resources in the AWS cloud for the desired form. ****
    1. **formName:** String: the name of the form
    2. **returns** ‘done’
10. **GetApiUrl(formName, stackId, callback):** Fetches the ARN for the Rest API created for the form and returns the endpoint URL. 
    1. **formName:** String: the name of the form
    2. **returns** a string with the url of the API gateway endpoint
11. **VerifydefaultEmail(email, callback):** verifies a new email identity to be used with AWS SES and adds it form config. if the email hasnt been added before it also adds it to the eamil section.
        1. **email:** String: the email you will use to send submissions
        2. **returns** false
12. **SesEmail(formName, options, callback):** Checks the provided email, if it hasnt been verified, it verifies it with SES.
    1. **options** = {"email":"", "recipients":[]}
    2. **returns** true or false depending on wether or not you have verified your email
13. **VerifySesEmail(email, callback):** Verifies a new provided email with AWS SES. After running this command youll recieve an email from AWS SES which you must confirm.
    1. **email:** String: the email you use to send submissions
    2. **returns** true or false
14. **ValidateSesEmail(formName, email, callback)**: checks that the supplied email vas been verified with AWS
    1. **formName:** String: the name of the form
    2. **email:** String: the email you use to send submissions
    3. **returns** true or false
15. **CreateIamUser(iamUserName, awsRegion, callback):** Returns a URL that will take you to the last step of the IAM users creation in the AWS console.  ****
    1. **iamUserName**: String: desired name for the new iam user and the local profile you will create.
    2. **awsRegion**: String: a valid AWS region. check out the table above for valid codes.
    3. **returns** an AWS url that takes you to the last step of the IAM user’s creation.
16. **ParseFields(fields, labels)**
    1. **fields:** String: a string that contains all formfields and options. each formfield can contain name=type=required. by default required is set to false and type to text. each form field must be sepparrated by comas. options in the slect field must be sepparated by /.
    2. **labels:** Bollean: true or false if you want to automatically add labels.
17. **AddConfigVariable(formName, variable, value, callback)**: add a variable to the config file of a form
    1. **formName:** String: the name of the form
    2. **email**: String: the email you use to send submissions
    3. **returns**: String: Success
18. **Build()**: Builds the required files and directories in the root of the project.
19. **InitForm()**
20. **CreateLabel(value)**: takes in a a value and returns a label.
    1. **value:** String: string value for your form input field.




# Super Easy Forms CLI
## Usage

<!-- usage --> `sh-session $ npm install -g super-easy-forms-cli $ sef COMMAND running command... $ sef (-v|--version|version) super-easy-forms-cli/1.0.0 linux-x64 node-v12.13.1 $ sef --help [COMMAND] USAGE $ sef COMMAND ...` <!-- usagestop -->

## Commands

<!-- commands --> * `[sef build](https://www.dropbox.com/#sef-build)` * `[sef delete NAME](https://www.dropbox.com/#sef-delete-name)` * `[sef deploy NAME](https://www.dropbox.com/#sef-deploy-name)` * `[sef email EMAIL [NAME]](https://www.dropbox.com/#sef-email-email-name)` * `[sef form NAME](https://www.dropbox.com/#sef-form-name)` * `[sef fullform NAME](https://www.dropbox.com/#sef-fullform-name)` * `[sef help [COMMAND]](https://www.dropbox.com/#sef-help-command)` * `[sef iam USER [REGION]](https://www.dropbox.com/#sef-iam-user-region)` * `[sef lambda NAME](https://www.dropbox.com/#sef-lambda-name)` * `[sef submissions NAME](https://www.dropbox.com/#sef-submissions-name)` * `[sef template NAME](https://www.dropbox.com/#sef-template-name)` * `[sef variable NAME VARIABLE VALUE](https://www.dropbox.com/#sef-variable-name-variable-value)`

## `**sef build**`

Builds the required base files and directories.
`USAGE $ sef build`
*See code:* [*src/commands/build.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/build.js)

## `**sef delete NAME**`

Builds an html form
``` USAGE $ sef delete NAME
ARGUMENTS NAME name of the form you want to delete
OPTIONS -r, --resources Delete all of the back-end resources for your form in the cloud ```
*See code:* [*src/commands/delete.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/delete.js)

## `**sef deploy NAME**`

Deploys your stack in the AWS Cloud
``` USAGE $ sef deploy NAME
ARGUMENTS NAME name of the form you want to delete
OPTIONS -c, --create Deploy a new cloudformation stack in the AWS cloud -u, --update Update your stack in the AWS cloud ```
*See code:* [*src/commands/deploy.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/deploy.js)

## `**sef email EMAIL [NAME]**`

Builds an html form
``` USAGE $ sef email EMAIL [NAME]
ARGUMENTS EMAIL the email address that will send the form submission emails NAME name of the form - must be unique
OPTIONS -n, --new verifies a new email address to be used by AWS SES to send email -v, --validate validates that the provided email address was verified with AWS SES ```
*See code:* [*src/commands/email.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/email.js)

## `**sef form NAME**`

Builds an html form
``` USAGE $ sef form NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -f, --fields=fields Desired form formFields -l, --labels Automatically add labels to your form -u, --url=url The API endpoint endpointUrl for your form ```
*See code:* [*src/commands/form.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/form.js)

## `**sef fullform NAME**`

Builds an html form
``` USAGE $ sef fullform NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -e, --email=email Email address that will be used to send emails -f, --fields=fields Desired form formFields -l, --labels Automatically add labels to your form -r, --recipients=recipients Recipients that will recieve emails on your behalf. ```
*See code:* [*src/commands/fullform.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/fullform.js)

## `**sef help [COMMAND]**`

display help for sef
``` USAGE $ sef help [COMMAND]
ARGUMENTS COMMAND command to show help for
OPTIONS --all see all commands in CLI ```
*See code:* [*@oclif/plugin-help*](https://github.com/oclif/plugin-help/blob/v2.2.2/src/commands/help.ts)

## `**sef iam USER [REGION]**`

the --create flag will open up a window with the AWS console so that you confirm the creation of a user with the entered name.
``` USAGE $ sef iam USER [REGION]
ARGUMENTS USER name of the IAM user REGION your desired AWS region.
OPTIONS -c, --create Helps you create an IAM user and adds its profile to the .env file ```
*See code:* [*src/commands/iam.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/iam.js)

## `**sef lambda NAME**`

Builds an html form
``` USAGE $ sef lambda NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -e, --email=email Email address that will be used to send emails -f, --fields=fields Desired form formFields -r, --recipients=recipients Recipients that will recieve emails on your behalf. ```
*See code:* [*src/commands/lambda.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/lambda.js)

## `**sef submissions NAME**`

validates a cloudformation template saved in your formName's dir with AWS
``` USAGE $ sef submissions NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -e, --export Exports all submissions for the form to its folder -f, --format=csv|json Desired format csv|json -l, --list print all submissions for the form to stdout ```
*See code:* [*src/commands/submissions.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/submissions.js)

## `**sef template NAME**`

validate/create/update your cloudformation template saved locally
``` USAGE $ sef template NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -c, --create Create a new cloudformation temmplate and saves it locally -e, --email=email Email address that will be used to send emails -f, --fields=fields Desired form formFields -v, --validate Validate your cloudformation template with AWS ```
*See code:* [*src/commands/template.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/template.js)

## `**sef variable NAME VARIABLE VALUE**`

Builds an html form
``` USAGE $ sef variable NAME VARIABLE VALUE
ARGUMENTS NAME name of the form VARIABLE name of the variable VALUE value of the variable ```
*See code:* [*src/commands/variable.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v1.0.0/src/commands/variable.js) <!-- commandsstop --> * `[sef build](https://www.dropbox.com/#sef-build)` * `[sef email](https://www.dropbox.com/#sef-email)` * `[sef form NAME](https://www.dropbox.com/#sef-form-name)` * `[sef fullform NAME](https://www.dropbox.com/#sef-fullform-name)` * `[sef help [COMMAND]](https://www.dropbox.com/#sef-help-command)` * `[sef lambda NAME](https://www.dropbox.com/#sef-lambda-name)` * `[sef submissions](https://www.dropbox.com/#sef-submissions)` * `[sef template](https://www.dropbox.com/#sef-template)`

## `**sef build**`

Builds the required base files and directories.
`USAGE $ sef build`
*See code:* [*src/commands/build.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/build.js)

## `**sef email**`

Describe the command here
``` USAGE $ sef email
OPTIONS -n, --name=name name to print
DESCRIPTION ... Extra documentation goes here ```
*See code:* [*src/commands/email.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/email.js)

## `**sef form NAME**`

Builds an html form
``` USAGE $ sef form NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -f, --fields=fields Desired form formFields -l, --labels Automatically add labels to your form -u, --url=url The API endpoint endpointUrl for your form ```
*See code:* [*src/commands/form.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/form.js)

## `**sef fullform NAME**`

Builds an html form
``` USAGE $ sef fullform NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -e, --email=email Desired form formFields -f, --fields=fields Desired form formFields -l, --labels Automatically add labels to your form -r, --recipients=recipients recipients that will recieve emails on your behalf. ```
*See code:* [*src/commands/fullform.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/fullform.js)

## `**sef help [COMMAND]**`

display help for sef
``` USAGE $ sef help [COMMAND]
ARGUMENTS COMMAND command to show help for
OPTIONS --all see all commands in CLI ```
*See code:* [*@oclif/plugin-help*](https://github.com/oclif/plugin-help/blob/v2.2.2/src/commands/help.ts)

## `**sef lambda NAME**`

Builds an html form
``` USAGE $ sef lambda NAME
ARGUMENTS NAME name of the form - must be unique
OPTIONS -e, --email=email Email address that will be used to send emails -f, --fields=fields Desired form formFields -r, --recipients=recipients Recipients that will recieve emails on your behalf. ```
*See code:* [*src/commands/lambda.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/lambda.js)

## `**sef submissions**`

Describe the command here
``` USAGE $ sef submissions
OPTIONS -n, --name=name name to print
DESCRIPTION ... Extra documentation goes here ```
*See code:* [*src/commands/submissions.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/submissions.js)

## `**sef template**`

Describe the command here
``` USAGE $ sef template
OPTIONS -n, --name=name name to print
DESCRIPTION ... Extra documentation goes here ```
*See code:* [*src/commands/template.js*](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/template.js)


# Tests
1. Email
    1. verifyDefaultEmail(): returns “Success” → needs AWS SDK mock
        1. if email is valid, should add an email to the defaults section of the general settings file.
    2. verifySesEmail(): returns true or false → need AWS SDK mock
        1.  if email is valid, should add an email to the formName config file with the value of the email
2. CreateForm(): returns an html form body as a string
    1. the body of the form returned should match the form created in the form’s config file.
    2. the form should be created with the form fields supplied in the options if the options are supplied. 
    3. if a callback is supplied in the second argument it should execute.
3. CreateLambda(): returns html with the lambda form or the s3 bucket address in case of zip deployment
    1. the body of the form returned should match the form created in the form’s config file.
    2. the form should be created with the form fields supplied in the options if the options are supplied. 
    3. if a callback is supplied in the second argument it should execute.
4. CreateTemplate(): returns an html string with the template body → need AWS SDK and AWS SDK mock
    1. must run the verify email operation for the template. if an email is supplied in options it will add that email to config and will verify that email instead.
    2. Check format of FormModel and RequiredFields
    3. the body of the function returned should match the form created in the form’s config file.
    4. the function body should be created with the form fields supplied in the options if the options are supplied. 
    5. if a callback is supplied in the second argument it should execute.
    6. the template that gets built should be a valid cloudformation template
    7. ~~if zip folder is used verify that the contnets of a zip folder are an appropriate node js or python package~~
5. CreateIam() 
    1. returns a url as a string
    2. validate the url with regex
    3. make sure the environment variables are added or replaced.
6. CreateStack() → need AWS sdk mock
    1. returns: “Success”
    2. the function body should be created from the template in file if a template body is not supplied.
    3. if a callback is supplied in the second argument it should execute.


# Errors

API Errors:

- Inconsistent with model
- API request validation failed

Lambda  errors:

- Incompatible object (not JSON)
- Error. External API returned an invalid response
- Error. You must solve the correct ReCaptcha challenge to submit
- Error saving to dynamoDB
- Error sending email


## Troubleshooting steps

If your commands fail for some reason after a modification of the super easy forms code, you can follow any of these steps to troubleshoot.


1. Validate your cloud formation template

you can use the validateTemplate() command or use the AWS CLI

    $ aws cloudformation validate-template --template-body file://forms/testform/template.json
2. Test the lambda function by using the test feature
3. Test the API by using curl using the AWS CLI 
    curl -d '{"id":"", "firstName":"john","lastName":"doe", "email":"johndoe@email.com", "message":"hello world"}' -H 'Content-Type: application/json' https://your-api-url
4. Test your API from an external form: insure that CORS is properluy enabled in your API

generate a form for your API and try submitting. check out the console in google chrome for any errors.

5. Review your tests, you can run tests by running `npm test test-name`


