const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const open = require('open');
const {cli} = require('cli-ux');

//check arguments
//ses email
//create lambda
//create template
//create form
//deploy stack
//open the form

/*
function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function createForm(params, formName) {
  if(isEmpty(params)){
    SEF.CreateForm(args.name, function(err, data){
      if(err) console.error(err)
      else{
        open(`forms/${args.name}/${args.name}.html`);
      }
    })
  }
  else{
    SEF.CreateForm(args.name, params, function(err, data){
      if(err) console.error(err)
      else{
        open(`forms/${args.name}/${args.name}.html`);
      }
    })
  }
}
*/


function promptemail(email, callback){
  readline.question(`have you finished confirming the email?`, (res) => {
    if(res === 'y' || res === 'y' || res === 'y'){
      SEF.ValidateSesEmail(email, function(err, data){
        if(data){
          callback()
        }
        else {
          console.log("email hasnt been validated")
          promptemail(email, callback)
        }
      })
    }
    else if(prompt === "n"){
      SEF.VerifySesEmail(email, promptemail(email, callback))
    }
  })
}


class FullformCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form - must be unique',
    },
  ]
  static flags = {
    email: flags.string({
      char: 'f',                    
      description: 'Desired form formFields',
      multiple: false,
      required: false         
    }), 
    recipients: flags.string({
      char: 'r',                    
      description: 'recipients that will recieve emails on your behalf.',
      parse: input => input.split(","),
      multiple: false,
      required: false         
    }), 
    fields: flags.string({
      char: 'f',                    
      description: 'Desired form formFields',
      multiple: false,
      required: false         
    }), 
    labels: flags.boolean({
      char: 'l',
      default: false,
      description: 'Automatically add labels to your form',
    })
  }

  async run() {
    const {args, flags} = this.parse(FullformCommand)
    let options = {email:null, formFields:null, recipients:null};
    let params = {};
    if(flags.email){
      options.email = flags.email
    }
    if(flags.recipients){
      options["recipients"] = flags.recipients
    }
    if(flags.fields){
      if(flags.labels){
        options.formFields = SEF.ParseFields(flags.fields, true);
      }
      else {
        options.formFields = SEF.ParseFields(flags.fields, false);
      }
    }
    Object.keys(options).map(function(key, index) {
      if(options[key]){
        params[key] = options[key]
      }
    })
    SEF.SesEmail(args.name, options, function(err, data){
      //cli.action.start('verifying email')
      if(err) throw new Error(Err)
      //cli.action.stop()
      else if(data){
        console.log("email confirmed")
      }
      else {
        console.log(`email confirmation has been sent to ${options.email}`)
        promptemail(options.email, console.log("SUCCESS"))
      }
    })
  } 
}

FullformCommand.description = `Builds an html form`

module.exports = FullformCommand
