var assert = require('assert');
var fs = require("fs")
var {createDir} = require('./../build')
var {createLambdaFunction} = require('./../lib/CreateLambda')
//var AWS = require('aws-sdk-mock');

describe('Check the createLambda method', function() {
  beforeEach(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"email":"", "formFields":{}, "recipients":[]}
  describe('No params supplied', function() {
    it('Should produce an error', function(done) {
      createLambdaFunction(formName, function(err, data){
        if(err){
          assert.equal(err.message.includes("required parameter"), true);
          done()
        }
        else {
          throw new Error('shouldnt create a form when no options or config params are supplied.')
        }
      })
    });
  });
  args["formFields"] = {"firstName":{"type":"text","label":"","required":true},"lastName":{"type":"text","label":"","required":false},"email":{"type":"email","label":"","required":false},"message":{"type":"textarea","label":"","required":false}}
  args["email"] = "test@mail.com";
  args["recipients"] = ["test@mail.com", "test2@mail.com"]

  describe('Create lambda function from params', function() {
    it('should create a lambdaFunction in ./forms/formName/formNameFunction/index.js', function(done) {
      createLambdaFunction(formName, args, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let lambdaFunction = fs.readFileSync(`./forms/${formName}/${formName}Function/index.js`, 'utf8')
          assert.equal(lambdaFunction.length>1000? true:false, true);
          //assert.equal(lambdaFunction, data);
          //check that the modules copied succesfully
          let nodemodules = ['uuid', 'axios']
          for(mod of nodemodules){
            let arr = fs.readdirSync(`./forms/${formName}/${formName}Function/node_modules/${mod}`)
            assert.equal(arr.length> 4? true:false, true);
          }
          done()
        }
      })
    });
    after(function(){
      deleteDir(`./forms/${formName}/${formName}Function`, function(filepath){
        fs.unlinkSync(filepath)
      })
    })
  });
  describe('create lambda from its config file', function() {
    it('should create a lambda function in ./forms/formName/formName.html', function(done) {
      createLambdaFunction(formName, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>1000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let form = fs.readFileSync(`./forms/${formName}/${formName}Function/index.js`, 'utf8')
          assert.equal(form, data);
          done()
        }
      })
    });
  });
  after(function(){
    fs.writeFileSync(`./forms/${formName}/config.json`, '{}')
    deleteDir(`./forms/${formName}/${formName}Function`, function(filepath){
      fs.unlinkSync(filepath)
    })
    //fs.unlinkSync(`./forms/${formName}/${formName}Function.zip`)
  })
});

function deleteDir(currentDirPath, callback){
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = `${currentDirPath}/${name}`;
    var stat = fs.statSync(filePath);
    if (stat.isFile()) callback(filePath);
    else if (stat.isDirectory()) {
      deleteDir(filePath, callback);
    }
  });
  fs.rmdirSync(currentDirPath)
}
