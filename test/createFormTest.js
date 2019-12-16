var assert = require('assert');
var fs = require("fs")
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
  args["formFields"] = {"firstName":{"type":"text","label":"","required":true},"lastName":{"type":"text","label":"","required":false},"email":{"type":"email","label":"","required":false},"message":{"type":"textarea","label":"","required":false}}
  args["endpointUrl"] = "https://testapi.execute-api.us-east-1.amazonaws.com/TestStage/"
  describe('Create form from params', function() {
    it('should create a form in ./forms/formName/formName.html', function(done) {
      CreateForm(formName, args, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>1000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let form = fs.readFileSync(`./forms/${formName}/${formName}.html`, 'utf8')
          assert.equal(form, data);
          done()
        }
      })
    });
    after(function(){
      fs.unlinkSync(`./forms/${formName}/${formName}.html`)
    })
  });
  describe('create form from its config file', function() {
    it('should create a form in ./forms/formName/formName.html', function(done) {
      CreateForm(formName, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>1000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let form = fs.readFileSync(`./forms/${formName}/${formName}.html`, 'utf8')
          assert.equal(form, data);
          done()
        }
      })
    });
  });
  after(function(){
    fs.writeFileSync(`./forms/${formName}/config.json`, '{}')
    fs.unlinkSync(`./forms/${formName}/${formName}.html`)
  })
});