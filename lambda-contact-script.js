//Import AWS SDK
var AWS = require('aws-sdk');

//Declare SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});

//Declare Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//Import UUID
const uuidv1 = require('uuid/v1');

//Main function
exports.handler = (event, context, callback) => {     
    //goes inside lambda function
    Object.keys(event).map(function(key, index) {
        event[key] = {S:formInput[key]};
    });
    event['id'] = {S:uuidv1()};
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
   callback(null, 'All Done!');
};

