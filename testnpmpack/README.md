super-easy-forms-cli
====================

a CLIfor super-easy-forms

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/super-easy-forms-cli.svg)](https://npmjs.org/package/super-easy-forms-cli)
[![Downloads/week](https://img.shields.io/npm/dw/super-easy-forms-cli.svg)](https://npmjs.org/package/super-easy-forms-cli)
[![License](https://img.shields.io/npm/l/super-easy-forms-cli.svg)](https://github.com/gkpty/super-easy-forms-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g super-easy-forms-cli
$ sef COMMAND
running command...
$ sef (-v|--version|version)
super-easy-forms-cli/0.0.0 linux-x64 node-v12.13.1
$ sef --help [COMMAND]
USAGE
  $ sef COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sef build`](#sef-build)
* [`sef delete NAME`](#sef-delete-name)
* [`sef deploy NAME`](#sef-deploy-name)
* [`sef email EMAIL [NAME]`](#sef-email-email-name)
* [`sef form NAME`](#sef-form-name)
* [`sef fullform NAME`](#sef-fullform-name)
* [`sef help [COMMAND]`](#sef-help-command)
* [`sef iam USER [REGION]`](#sef-iam-user-region)
* [`sef lambda NAME`](#sef-lambda-name)
* [`sef submissions NAME`](#sef-submissions-name)
* [`sef template NAME`](#sef-template-name)
* [`sef variable NAME VARIABLE VALUE`](#sef-variable-name-variable-value)

## `sef build`

Builds the required base files and directories.

```
USAGE
  $ sef build
```

_See code: [src/commands/build.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/build.js)_

## `sef delete NAME`

Builds an html form

```
USAGE
  $ sef delete NAME

ARGUMENTS
  NAME  name of the form you want to delete

OPTIONS
  -r, --resources  Delete all of the back-end resources for your form in the cloud
```

_See code: [src/commands/delete.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/delete.js)_

## `sef deploy NAME`

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

_See code: [src/commands/deploy.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/deploy.js)_

## `sef email EMAIL [NAME]`

Builds an html form

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

_See code: [src/commands/email.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/email.js)_

## `sef form NAME`

Builds an html form

```
USAGE
  $ sef form NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -f, --fields=fields  Desired form formFields
  -l, --labels         Automatically add labels to your form
  -u, --url=url        The API endpoint endpointUrl for your form
```

_See code: [src/commands/form.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/form.js)_

## `sef fullform NAME`

Builds an html form

```
USAGE
  $ sef fullform NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -e, --email=email            Email address that will be used to send emails
  -f, --fields=fields          Desired form formFields
  -l, --labels                 Automatically add labels to your form
  -r, --recipients=recipients  Recipients that will recieve emails on your behalf.
```

_See code: [src/commands/fullform.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/fullform.js)_

## `sef help [COMMAND]`

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

## `sef iam USER [REGION]`

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

_See code: [src/commands/iam.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/iam.js)_

## `sef lambda NAME`

Builds an html form

```
USAGE
  $ sef lambda NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -e, --email=email            Email address that will be used to send emails
  -f, --fields=fields          Desired form formFields
  -r, --recipients=recipients  Recipients that will recieve emails on your behalf.
```

_See code: [src/commands/lambda.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/lambda.js)_

## `sef submissions NAME`

validates a cloudformation template saved in your formName's dir with AWS

```
USAGE
  $ sef submissions NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -e, --export           Exports all submissions for the form to its folder
  -f, --format=csv|json  Desired format csv|json
  -l, --list             print all submissions for the form to stdout
```

_See code: [src/commands/submissions.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/submissions.js)_

## `sef template NAME`

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

_See code: [src/commands/template.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/template.js)_

## `sef variable NAME VARIABLE VALUE`

Builds an html form

```
USAGE
  $ sef variable NAME VARIABLE VALUE

ARGUMENTS
  NAME      name of the form
  VARIABLE  name of the variable
  VALUE     value of the variable
```

_See code: [src/commands/variable.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/variable.js)_
<!-- commandsstop -->
* [`sef build`](#sef-build)
* [`sef email`](#sef-email)
* [`sef form NAME`](#sef-form-name)
* [`sef fullform NAME`](#sef-fullform-name)
* [`sef help [COMMAND]`](#sef-help-command)
* [`sef lambda NAME`](#sef-lambda-name)
* [`sef submissions`](#sef-submissions)
* [`sef template`](#sef-template)

## `sef build`

Builds the required base files and directories.

```
USAGE
  $ sef build
```

_See code: [src/commands/build.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/build.js)_

## `sef email`

Describe the command here

```
USAGE
  $ sef email

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/email.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/email.js)_

## `sef form NAME`

Builds an html form

```
USAGE
  $ sef form NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -f, --fields=fields  Desired form formFields
  -l, --labels         Automatically add labels to your form
  -u, --url=url        The API endpoint endpointUrl for your form
```

_See code: [src/commands/form.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/form.js)_

## `sef fullform NAME`

Builds an html form

```
USAGE
  $ sef fullform NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -e, --email=email            Desired form formFields
  -f, --fields=fields          Desired form formFields
  -l, --labels                 Automatically add labels to your form
  -r, --recipients=recipients  recipients that will recieve emails on your behalf.
```

_See code: [src/commands/fullform.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/fullform.js)_

## `sef help [COMMAND]`

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

## `sef lambda NAME`

Builds an html form

```
USAGE
  $ sef lambda NAME

ARGUMENTS
  NAME  name of the form - must be unique

OPTIONS
  -e, --email=email            Email address that will be used to send emails
  -f, --fields=fields          Desired form formFields
  -r, --recipients=recipients  Recipients that will recieve emails on your behalf.
```

_See code: [src/commands/lambda.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/lambda.js)_

## `sef submissions`

Describe the command here

```
USAGE
  $ sef submissions

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/submissions.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/submissions.js)_

## `sef template`

Describe the command here

```
USAGE
  $ sef template

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/template.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/template.js)_
