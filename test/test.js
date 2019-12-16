var assert = require('assert');
var fs = require("fs")
var {optionArgs} = require('./../lib/InternalModules')
var {AddVar, CheckForm} = require('./../lib/Config')
var {createDir} = require('./../build')
//var AWS = require('aws-sdk-mock');

describe('Check Form existence', function() {
  before(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"endpointUrl":"", "formFields":{}}
  //let emptyDir = fs.mkdirSync(`./forms/${formName}`)
  describe('Check for a nonexistent form', function() {
    it('Should create a form and a config file for that form', function(done) {
      CheckForm(formName, function(err, data){
        if(err){
          throw new Error(err)
        }
        else{
          fs.readFile(`./forms/${formName}/config.json`, 'utf8', function(err, data){
            if(err) throw new Error(err)
            else{
              assert.equal(data, '{}');
              done();
            }
          })
        }
      })
    });
  });
  describe('Succesfully add a variable with addVar', function() {
    it('should generate a variable with the proivided key and value in forms/formName/config.json', function(done) {
      let varkey = "testvar"
      let varval = "test"
      AddVar(formName, varkey, varval, function(err, data){
        if(err) throw new Error(err)
        else{
          let rawdata = fs.readFileSync(`./forms/${formName}/config.json`);
          let obj = JSON.parse(rawdata)
          assert.equal(obj[varkey], varval)
          done()
        }
      })
    });
  });
});

describe('Optional Arguments', function() {
  let formName = "testform"
  let args = {"endpointUrl":"", "formFields":{}}
  describe('Invalid options type', function() {
    it('should return an error when an invalid options argument is used', function(done) {
      optionArgs(formName, args, "invalid param", function(err, data){
        if(err) {
          assert.equal(err.message,"options must be an object with the appropriate keys");
          done();
        }
        else {
          throw new Error('no error detected');
        };
      });
    });
  });
  describe('Create form from params', function() {
    let formFields = 
    {
      "name": {
        "type":"text", 
        "label":"First Name",
        "required": true
      }
    }
    let endpointUrl = "https://testurl0.execute-api.us-east-1.amazonaws.com/DeploymentStage/"
    it('should return args with values from options', function(done) {
      optionArgs(formName, args, {"endpointUrl":endpointUrl, "formFields":formFields}, function(err, data){
        if(err) throw new Error(err);
        else{
          assert.equal(JSON.stringify(data), JSON.stringify({"endpointUrl":endpointUrl, "formFields":formFields}));
          done();
        }
      });
    });
  });
  after(function(){
    fs.writeFileSync(`./forms/${formName}/config.json`, '{}')
  })
  /*
  describe('create form from config', function() {
    it('should return args with values from config', function(done) {
      optionArgs(formName, args, "invalid param", function(err, data){
        if(err) {
          assert.equal(err.message,"options must be an object with the appropriate keys");
          done();
        }
        else {
          throw new Error('no error detected');
        };
      });
    });
  });
  */
});


