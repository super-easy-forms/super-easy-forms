//Import .env
require('dotenv').config();
const uuidv1 = require('uuid/v1');

var fs = require("fs");
var JSZip = require("jszip");

//Import AWS SDK
var AWS = require('aws-sdk');

//import uuid for id generation
//const uuidv1 = require('uuid/v1');

//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//ADD ITEM TO DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//SES
//var ses = new AWS.SES({apiVersion: '2010-12-01'});

//Dynamo DB
//var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//const fs = require('fs');
const res = 'firstName lastName eMail'
var response = res.split(" ");
jsonstring = `"id":"${uuidv1()}",`
for(let r of response){
    jsonstring += `"${r}":"${r}",`;
}
jsonstringa = jsonstring.substring(0, (jsonstring.length -1))
var json = JSON.parse(`{${jsonstringa}}`);

Object.keys(json).map(function(key, index) {
    json[key] = {S:key};
});
json['id'] = {S:uuidv1()};

console.log(json);


function stmt2(xtab) {
    let rawdata = fs.readFileSync('variables.json');  
    obj = JSON.parse(rawdata);
    var source = obj.source;
    var tableName = obj.table;
    var params = {
        Item: xtab, 
        TableName: tableName,
    };
    dynamodb.putItem(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
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

stmt2(json);

// if no, go back to 4, if yes continue
//7. Create a new DB table
//8. create the lambda function
//9. create the//
