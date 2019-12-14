var fs = require("fs");
var GetSubmissions = require("./GetSubmissions");
var {createDir} = require("./../build")

module.exports = function ExportSubmission(formName, format, callback){
  createDir(`./forms/${formName}/exports`, function(err, data){
    if(err) optionError(err, callback)
    else{
      GetSubmissions(formName, function(err, data){
        if (err) {
          optionError(err, callback);
        }
        else{
          let dateobj = new Date();
          let dateString = dateobj.toString()
          let fileName = dateString.split("GMT")[0].split(' ').join('_')
          switch(format) {
            case 'json':
              fileName += ".json"
              formatDataJson(data, function(data){
                fs.writeFile(`./forms/${formName}/exports/${fileName}`, data, function(err, data){
                  if (err) {
                    optionError(err, callback);
                  }
                  else{
                    if(callback && typeof callback === 'function'){
                      callback(null, 'Success');
                    }
                    else{
                      return 'Success';
                    }
                  }
                })  
              })
              break;
              case 'csv':
              fileName += ".csv"
              formatDataCsv(data, function(res){
                let csv = csvTitle(data) + "\n" + res
                fs.writeFile(`./forms/${formName}/exports/${fileName}`, csv, function(err, data){
                  if (err) {
                    optionError(err, callback);
                  }
                  else{
                    if(callback && typeof callback === 'function'){
                      callback(null, 'Success');
                    }
                    else{
                      return 'Success';
                    }
                  }
                })  
              })
              break;
            default:
              throw new Error('only csv and json formats supported.');
          }
        }
      })
    }
  })
}

function formatDataJson(data, callback){
  let obj = {};
  for(let i = 0; i < data.length; i++){
    let item = obj[i]
    let vals = {}
    Object.keys(item).map(function(key) {
      let val = item[key]
      vals[key] = val["S"]
    })
    obj[i] = vals; 
  }
  if(callback && typeof callback === 'function'){
    callback(null, obj);
  }
  else {
    return obj;
  }
}

function formatDataCsv(data, callback){
  console.log(data)
  let body = "";
  let val = {};
  for(item of data){
    let str = "";
    Object.keys(item).map(function(key) {
      val = item[key]
      str += `${val["S"]},`
    })
    body += str.substring(0, str.length - 1) + "\n";
  }
  if(callback && typeof callback === 'function'){
    callback(body);
  }
  else {
    return body;
  }
}

function csvTitle(data){
    let item = data[0]
    let str = "";
    if(item){
      Object.keys(item).map(function(key){
        str += `${key},`
      })
      let title = str.substring(0, str.length - 1);
      return title; 
    }
    else return null
}


//creates the title for the csv file based on saved formfields
/* function csvTitle(formName){
  let rawdata = fs.readFileSync(`forms/${formName}/config.json`);  
  let obj = JSON.parse(rawdata);
  let str = "";
  Object.keys(obj).map(function(key){
    str += `${key},`
  })
  let title = str.substring(0, str.length - 1);
  return title; 
} */
