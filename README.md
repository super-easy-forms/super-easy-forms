**This is the repo for Super Easy Forms 2.0. The First Version has been moved to [this other repo](https://github.com/gkpty/super-easy-forms-classic)
![Super Easy Forms](img/super-easy-forms-logo.png)

<div bottom="100px" style="padding-top:70px; padding-bottom:70px">
<a href="https://aws.amazon.com/what-is-cloud-computing"><img style="margin-left:70px" align="right" height="70px" width="190px" src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"></a>

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)
[![Build Status](https://travis-ci.com/gkpty/super-easy-forms.svg?branch=master)](https://travis-ci.com/gkpty/super-easy-forms)
[**Read the Docs**](https://supereasyforms.com/docs.html)
</div><br><br>

Super Easy Forms is a tool that generates serverless web forms (front-end and back-end) in seconds. it leverages CloudFormation templates to create all of your necessary resources in the AWS cloud including a A Dynamo DB table, an API Gateway endpoint, and a Lambda function. It also automatically generates a ready-to-go html contact form that you can copy-paste into your site. the tool is very easy to use and completely free as all the AWS resources created have a free tier.

## New Features
- Updated to node 10.X
- Easier installation Built in commands have been added to further facilitate installation/configuration/setup
- [Documentation](https://supereasyforms.com/docs.html): Detailed documentation includes an API method glossary, CLI commands and everything else you need to use/integrate/collaborate with super-easy-forms.
- Support for multiple Forms: Create and monitor as many forms as you want.
- Export your form submissions: Command that lets you export the database table of your form as either JSON or CSV.
- Reusable methods: Easily integrate super-easy-forms into your own project or build your own workflows using components from super-easy-forms.
- Local config files: Allow you to easily monitor and update each of your forms
- [Independent multi CLI](https://github.com/gkpty/super-easy-forms-cli): A separate package (super-easy-forms-cli) with multiple commands that have several options and flags allowing you to customize and create/update/delete any of the components in a form individually or together.
- [CloudFormation template](https://aws.amazon.com/cloudformation/): Easily keep track of the multiple AWS resources for each one of your forms. You can also modify the templates directly to customize the resources in your form.
- Input sanitation: Uses an AWS API Gateway Model and API validator to insure that the parameters supplied are the correct ones before the call even reaches the lambda function.
- Support for all html types: Check [W3schools](https://www.w3schools.com/html/html_form_input_types.asp) for a list of all the valid html types
- Support for html select with options: Add Select lists to your form and supply the options
- Support for required attributes: Choose which fields in your form you want to make required
- Smart labels: The parser will read your input fields and create labels for you by separating camel cased values and sepparating dashes/underscores and capitalizing first letters. E.g. first_name → First Name or  firstName → First Name

## Pre-requisites

*  Make sure you have node.js (10.x +) and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
* Have an AWS account. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Installation

1. Create a a new directory for your super easy forms project. 
2. Install super easy forms with npm. `npm install super-easy-forms`
3. Install the super easy forms CLI with npm. `npm install -g super-easy-forms-cli`
4. **Run the build command** Run `$ sef build -r=your-aws-region -p=profile-name` from the root of the project. replace profile-name with the desired name of the IAM user and your-aws-region with the desired AWS region.
5. Finish creating your IAM user in the AWS Console. If you had already created your IAM user you can ignore this step and close the browser window.
6. **Update the local profile in your machine.** The local profiles are stored in `~/.aws/credentials` in mac/linux or in `C:\Users\USER_NAME\.aws\credentials` in windows. you can create/edit this file by runing `sudo nano ~/.aws/credentials`. add the profile keys in the format shown bellow.

        [profilename]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

