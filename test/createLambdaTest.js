var assert = require('assert');
var fs = require("fs")
var {createDir} = require('./../build')
var CreateLambda = require('./../lib/CreateLambda')
//var AWS = require('aws-sdk-mock');

describe('Check the createLambda method', function() {
  beforeEach(function() {
    createDir("./forms")
  })
  let formName = "testform"
  let args = {"email":"", "formFields":{}, "recipients":[]}
  //let emptyDir = fs.mkdirSync(`./forms/${formName}`)
  describe('No params supplied', function() {
    it('Should produce an error', function(done) {
     CreateLambda(formName, function(err, data){
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
    it('should create a lambdaFunction in ./forms/formName/lambdaFunction.js', function(done) {
      CreateLambda(formName, args, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>1000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let lambdaFunction = fs.readFileSync(`./forms/${formName}/lambdaFunction.js`, 'utf8')
          assert.equal(lambdaFunction, data);
          done()
        }
      })
    });
    after(function(){
      fs.unlinkSync(`./forms/${formName}/lambdaFunction.js`)
    })
  });
  describe('create form from its config file', function() {
    it('should create a form in ./forms/formName/formName.html', function(done) {
      CreateLambda(formName, function(err, data){
        if(err){
          throw new Error(err)
        }
        else {
          //check that the object returned is a string with more than 1000 chars
          assert.equal(typeof data, "string")
          assert.equal(data.length>1000? true:false, true)
          //check that there is a form saved in ./forms/formName/formName.html and that it has content
          let form = fs.readFileSync(`./forms/${formName}/lambdaFunction.js`, 'utf8')
          assert.equal(form, data);
          done()
        }
      })
    });
  });
  after(function(){
    fs.writeFileSync(`./forms/${formName}/config.json`, '{}')
    //fs.unlinkSync(`./forms/${formName}/lambdaFunction.js`)
  })
});