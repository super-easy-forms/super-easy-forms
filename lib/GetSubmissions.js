require('dotenv').config();
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var {optionError} = require('./InternalModules')


module.exports = function GetSubmissions(formName, callback) {
  var params = { 
    TableName: formName
   };
   dynamodb.scan(params, function(err, data) {
     if (err) optionError(err, callback); 
     else{
      if(callback && typeof callback === 'function'){
				callback(null, data.Items);
      }
      else return data.Items
     }
   });
}

