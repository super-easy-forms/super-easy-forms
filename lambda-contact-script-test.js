//Import .env
require('dotenv').config();
//const uuidv1 = require('uuid/v1');

//Import filesystem
var fs = require("fs");

//Import AWS SDK
var AWS = require('aws-sdk');

//Declare SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Declare Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

payLoad = {"id":"","firstName":"john", "lastName": "Dill", "eMail":"jdil@gmail.com"};



function stmt2(formInput) {
    let uniqNow = Math.floor(Math.random() * 900000000000000000).toString(28) + new Date().toISOString().replace(/-/, '-').replace(/-/, '-').replace(/T/, '-').replace(/\..+/, '-').replace(/:/, '').replace(/:/, '') + Math.floor(Math.random() * 90000000).toString(28);
    //goes outside the lambda function
    const res = 'firstName lastName eMail'
    var response = res.split(" ");
    var jstring = `"id":"id",`;
    for(let r of response){
        jstring += `"${r}":"${r}",`;
    }
    var jsonstring = jstring.substring(0, (jstring.length -1))
    var json = JSON.parse(`{${jsonstring}}`);
    console.log(json);

    //goes inside lambda function
    Object.keys(json).map(function(key, index) {
        json[key] = {S:formInput[key]};
    });
    json['id'] = {S:uniqNow};


    let rawdata = fs.readFileSync('variables.json');  
    obj = JSON.parse(rawdata);
    var source = obj.source;
    var tableName = obj.table;
    var params = {
        Item: json, 
        TableName: tableName,
    };
    dynamodb.putItem(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
            console.log(json);
            console.log(data);   
            //SES SEND EMAIl
            var params = {
                Destination: {
                ToAddresses: [
                    "gabriel@torus-digital.com", 
                ]
                }, 
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8", 
                            Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
                        }, 
                        Text: {
                            Charset: "UTF-8", 
                            Data: "This is the message body in text format."
                        }
                    }, 
                    Subject: {
                    Charset: "UTF-8", 
                    Data: "Test email"
                    }
                }, 
                ReplyToAddresses: [
                ], 
                Source: source, 
            };
            ses.sendEmail(params, function(err, data) {
                if (err) {
                    console.log(err); // an error occurred
                    return err;
                } 
                else {
                    console.log(data);
                    return data;
                }   
            });
        }
    }); 

}

stmt2(payLoad);