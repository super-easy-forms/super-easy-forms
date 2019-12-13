var assert = require('assert');
var fs = require("fs")
var {optionArgs} = require('./../lib/InternalModules')
var {CheckForm} = require('./../lib/Config')
var {createDir} = require('./../build')
var CreateForm = require('./../lib/CreateForm')
//var AWS = require('aws-sdk-mock');

describe('Check the createForm method', function() {
  beforeEach(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"endpointUrl":"", "formFields":{}}
  //let emptyDir = fs.mkdirSync(`./forms/${formName}`)
  describe('No params supplied', function() {
    it('Should produce an error', function(done) {
      CreateForm(formName, function(err, data){
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
  /*
  let formFields = {"firstName":{"type":"text","label":"","required":true},"lastName":{"type":"text","label":"","required":false},"email":{"type":"email","label":"","required":false},"message":{"type":"textarea","label":"","required":false}}
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
  */
});