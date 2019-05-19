![Super Easy Forms](img/super-easy-forms-logo.png)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)

Super Easy Forms is a CLI tool that lets you create html forms in seconds (literally). It deploys all the necessary backend resources for you in AWS, and it outputs a Bootstrap HTML form ready to copy paste into your static site.

## Pre-requisites

*  Make sure you have node.js and npm installed. You can checkout this [tutorial](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173) to install npm and node in mac, linux (debian/ubuntu).
* Have an AWS account and an IAM user with administrator access. If you don't have an AWS account, you can easily create one [here](https://portal.aws.amazon.com/billing/signup?#/start). Don't worry, everything you do with this project will fall within the AWS free tier limit! 

## Steps
1. Clone the repository
2. Go into the directory of the project ` cd super_easy_forms `
3. create a file called .env and add the following variables. replace your-acces-key and your-secret-access-key with the keys that were displayed when you created the IAM user.
    ```
    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=us-east-1
    AWS_ACCOUNT_NUMBER=your-aws-account-number
    ```
4. To find your AWS account number, go to the [AWS console support center](https://console.aws.amazon.com/support/home?)
![image 18](img/account_number.png)
5. Install all dependencies by running ` npm install`
6. Start the CLI by running ` node super-easy-forms.js `

**Labels** : Form fields must be one word. you can use - or _ to unite words for example you can use `first_name` or `first-name` and the label will automatically get split into first name.

**Field Types** : By default form fields will be set as text inputs. to use a textfield instead include the word message. For an input type email include the word email and for an input type number include the word number.

