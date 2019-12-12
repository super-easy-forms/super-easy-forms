/*
var assert = require('assert');
var fs = require("fs")
var {optionArgs} = require('./../lib/InternalModules')
var {CheckForm} = require('./../lib/Config')
var {createDir} = require('./../build')
//var AWS = require('aws-sdk-mock');

describe('Check Form existence', function() {
  beforeEach(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"endpointUrl":"", "formFields":{}}
  //let emptyDir = fs.mkdirSync(`./forms/${formName}`)
  describe('Non existent form', function() {
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
    it('should create a form in ./forms/formName/formName.html', function(done) {
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
  describe('create form from config', function() {
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
});
*/