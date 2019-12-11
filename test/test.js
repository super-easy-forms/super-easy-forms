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
    it('Should create a form and a config file for that form', function() {
      CheckForm(formName, function(err, data){
        if(err){
          console.error(err)
        }
        else{
          assert.equal(fs.readFileSync(`./forms/${formName}/config.json`, 'utf8'), '{}');
        }
      })
    });
  });
});

describe('Optional Arguments', function() {
  let formName = "testform"
  let args = {"endpointUrl":"", "formFields":{}}
  
  describe('Invalid options type', function() {
    it('should return an error when an invalid options argument is used', function() {
      optionArgs(formName, args, "invalid param", function(err, data){
        assert.equal(err.message,"options must be an object with the appropriate keys");
      })
    });
  });

    /*
  describe('optional arguments', function() {
    it('should return false when its not an email', function() {
      assert.equal(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test("string"), false);
    });
  });
  */
});

