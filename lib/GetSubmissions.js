require('dotenv').config();
var fs = require("fs");
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var FormConfig = require('./Config');
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

/* for(let i = 0; i < items.length; i++){
  list += `\n${i}. \n`
  let item = items[i];
  Object.keys(item).map(function(key) {
    let val = item[key]
    list += `${key}: ${val["S"]} \n`
  }) 
} */