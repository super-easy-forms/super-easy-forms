![Super Easy Forms](img/super-easy-forms-logo.png)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)
[![Build Status](https://travis-ci.com/gkpty/super-easy-forms.svg?branch=master)](https://travis-ci.com/gkpty/super-easy-forms)

**This is the repo for Super Easy Forms 2.0. The First Version has been moved to [this other repo](https://github.com/gkpty/super-easy-forms-classic)**

Super Easy Forms is a tool that generates serverless web forms (front-end and back-end) in seconds. it leverages CloudFormation templates to create all of your necessary resources in the AWS cloud including a A Dynamo DB table, an API Gateway endpoint, and a Lambda function. It also automatically generates a ready-to-go html contact form that you can copy-paste into your site. the tool is very easy to use and completely free as all the AWS resources created have a free tier.

<div style="padding-top:70px; padding-bottom:70px">
<a href="https://aws.amazon.com/what-is-cloud-computing"><img style="margin-left:70px" align="right" height="70px" width="190px" src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"></a>
</div>

## Pre-requisites

*  Make sure you have node.js (10.x +) and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
* Have an AWS account. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Installation

1. Create a a new directory for yournew super easy forms project. 
2. Install super easy forms with npm. `npm install super-easy-forms`
3. Install the super easy forms CLI with npm. `npm install -g super-easy-forms-cli`

## Setup

You must have an IAM user with administrator access to be able to use super-easy-forms.

1. **Create an IAM user with administrator acces.** you can use the `sef iam profilename -c` command replacing profilename for the desired name of your IAM user. hold on to the access Id and secret key displayed.
2. **Update the local profile in your machine.** The local profiles are stored in `~/.aws/credentials` in mac/linux or in `C:\Users\USER_NAME\.aws\credentials` in windows. you can create/edit this file by runing `sudo nano ~/.aws/credentials` or something similar. add the profile keys in the format shown bellow.

        [profilename]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

      *Optionally you can add the IAM user’s credentials directly in the .env w/o creating the local profile.

        AWS_ACCESS_KEY_ID=your-access-key
        AWS_SECRET_ACCESS_KEY=your-secert-access-key
3. **Create the necesary local files** Run `sef setup -c` from the root of the project. `npm run build` works too.
