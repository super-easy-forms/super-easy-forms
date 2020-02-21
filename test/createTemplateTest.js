var assert = require('assert');
var fs = require("fs")
var {createDir} = require('./../build')
var CreateTemplate = require('./../lib/CreateTemplate')
var ValidateTemplate = require('./../lib/ValidateTemplate')
//var AWS = require('aws-sdk-mock');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

describe('Check the createTemplate method', function() {
  beforeEach(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"email":"", "formFields":{}}
  //let emptyDir = fs.mkdirSync(`./forms/${formName}`)
  describe('No params supplied', function() {
    it('Should produce an error', function(done) {
     CreateTemplate(formName, function(err, data){
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
  describe('Create cloud formation template from params', function() {
    it('should create a cloudformation template in ./forms/formName/template.json', function(done) {
      CreateTemplate(formName, args, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>2000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let template = fs.readFileSync(`./forms/${formName}/template.json`, 'utf8')
          assert.equal(template, data);
          done()
        }
      })
    });
    after(function(){
      fs.unlinkSync(`./forms/${formName}/template.json`)
    })
  });
  describe('create a template from its config file', function() {
    it('should create a cloud formation template in ./forms/formName/template.json', function(done) {
      CreateTemplate(formName, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>2000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let template = fs.readFileSync(`./forms/${formName}/template.json`, 'utf8')
          assert.equal(template, data);
          done()
        }
      })
    });
  });
  /*
  describe('Validates a saved cloudformation template', function() {
    it('Should return true for a valid cloudformation template', function(done) {
      ValidateTemplate(formName, function(err, data){
        if(err){
          console.err(err.message)
        }
        else {
          assert.equal(data, true)
          done()
        }
      })
    });
  });
  */
  after(function(){
    fs.writeFileSync(`./forms/${formName}/config.json`, '{}')
    fs.unlinkSync(`./forms/${formName}/template.json`)
  })
});