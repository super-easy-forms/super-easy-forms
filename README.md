**This is the repo for Super Easy Forms 2.0. The First Version has been moved to [this other repo](https://github.com/gkpty/super-easy-forms-classic)
![Super Easy Forms](img/super-easy-forms-logo.png)

<div bottom="100px" style="padding-top:70px; padding-bottom:70px">
<a href="https://aws.amazon.com/what-is-cloud-computing"><img style="margin-left:70px" align="right" height="70px" width="190px" src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"></a>

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)
[![Build Status](https://travis-ci.com/gkpty/super-easy-forms.svg?branch=master)](https://travis-ci.com/gkpty/super-easy-forms)
[**Read the Docs**](https://supereasyforms.com/docs.html)
</div><br><br>

Super Easy Forms is a tool that generates serverless web forms (front-end and back-end) in seconds. it leverages [CloudFormation](https://aws.amazon.com/cloudformation/) to create all of your necessary resources in the AWS cloud including a A Dynamo DB table, an API Gateway endpoint, and a Lambda function. It also automatically generates a ready-to-go html contact form that you can copy-paste into your site. the tool is fast, easy to use/integrate,  and completely free as all the AWS resources created have a [free tier](https://aws.amazon.com/free/). Version 2.0 now features increased usability, security, and flexibility.

## Pre-requisites

*  Make sure you have node.js (10.x +) and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
* Have an AWS account. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Installation

1. if you dont have an existing static website project you can create a new directory `mkdir project-name` replacing project-name with the desired name for your project. 
2. Go into your desired project's directory `cd project-name` and **install super easy forms** `npm install super-easy-forms`
3. **Install the super easy forms CLI globally** `npm install -g super-easy-forms-cli`
4. **Run the build command** Run `sef build -r=your-aws-region -p=profile-name` from the root of your project's directory. replace profile-name with the desired name of the IAM user and your-aws-region with the desired AWS region code.
5. Finish creating your IAM user in the AWS Console and hold on to the access keys. If you had already created your IAM user you can ignore this step and close the browser window.
6. **Update the local profile in your machine.** The local profiles are stored in `~/.aws/credentials` in mac/linux or in `C:\Users\USER_NAME\.aws\credentials` in windows. you can create/edit this file by runing `sudo nano ~/.aws/credentials`. add the profile keys in the format shown bellow.

        [profilename]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>


## Create a serverless form

1. run `sef init formname` replace formname with the name you want to give to your new form. For example the domain name followed by paymentform.
2. edit the config file saved in `./forms/formname/config.json` and add values for the variables shown bellow following the same format. captcha, emailMessage and emailSubject are optional. 
3. run `sef fullform formname`

        {
          "email":"your@email.com",
          "formFields":{
            "fullName": {"type":"text", "label":"Full,Name", "required":true},
            "email": {"type":"email","label":"Email","required":true},
          },
          "captcha":false,
          "emailSubject":"",
          "emailMessage":"",
        }

    Optionally you can provide your desired values directly as CLI flags without having to edit the config file as shown in the command bellow.

       sef fullform formname --email=your@email.com --fields=fullName=text=required,email=email=required

## Using the API
        const SEF = require('super-easy-forms')

        SEF.CreateForm(formName, options, function(err, data){
                if(err) console.error(err)
                else{
                        //Do Something
                }
        })