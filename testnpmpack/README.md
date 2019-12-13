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
* [`sef email`](#sef-email)
* [`sef form NAME`](#sef-form-name)
* [`sef fullform NAME`](#sef-fullform-name)
* [`sef hello`](#sef-hello)
* [`sef help [COMMAND]`](#sef-help-command)
* [`sef lambda`](#sef-lambda)
* [`sef template`](#sef-template)
* [`sef validateTemplate`](#sef-validatetemplate)

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

## `sef hello`

Describe the command here

```
USAGE
  $ sef hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/hello.js)_

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

## `sef lambda`

Describe the command here

```
USAGE
  $ sef lambda

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/lambda.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/lambda.js)_

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

## `sef validateTemplate`

Describe the command here

```
USAGE
  $ sef validateTemplate

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/validateTemplate.js](https://github.com/gkpty/super-easy-forms-cli/blob/v0.0.0/src/commands/validateTemplate.js)_
<!-- commandsstop -->
