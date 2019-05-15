![Super Easy Forms](super-easy-forms-logo.png)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)

Super Easy Forms is a CLI tool that lets you create html forms in seconds (literally). It deploys all the necessary backend resources for you in AWS, and it outputs a Bootstrap HTML form ready to copy paste into your static site.

## Pre-requisites

*  Make sure you have node.js and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
* Have an AWS account and an IAM user with administrator access. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Steps
1. Clone the repository
2. Go into the directory of the project ` cd super_easy_forms `
3. create a file called .env and add the following variables. replace 
    ```
    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=us-east-1
    AWS_ACCOUNT_NUMBER=your-aws-account-number
    ```
4. Install all dependencies by running ` npm install`
5. Start the CLI by running ` node super-easy-forms.js `
