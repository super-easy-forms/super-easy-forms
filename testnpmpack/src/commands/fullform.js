const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const open = require('open');
const {cli} = require('cli-ux');

function promptemail(email, callback){
  readline.question(`have you finished confirming the email?`, (res) => {
    if(res === 'y' || res === 'Y' || res === 'yes'){
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
    else if(res === "n" || res === "N" || res === "no"){
      SEF.VerifySesEmail(email, promptemail(email, callback))
    }
  })
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
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
      char: 'e',                    
      description: 'Email address that will be used to send emails',
      multiple: false,
      required: false         
    }), 
    recipients: flags.string({
      char: 'r',                    
      description: 'Recipients that will recieve emails on your behalf.',
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
      default: true,
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
    if(isEmpty(params)){
      options = null;
    }
    cli.action.start('Setting up')
    SEF.FormSetup(args.name, function(err, data){
      if(err){
        console.error(err)
      }
      else{
        cli.action.stop()
        cli.action.start('Verifying email')
        SEF.SesEmail(args.name, options, function(err, data){
          if(err) throw new Error(Err)
          else if(data){
            cli.action.stop()
            cli.action.start('Generating your lambda function')
            SEF.CreateLambdaFunction(args.name, options, function(err, data){
              if(err) console.error(err.message)
              else {
                params["lambdaFunction"] = data;
                cli.action.stop()
                cli.action.start('Generating your cloudformation template')
                SEF.CreateTemplate(args.name, params, function(err, data){
                  if(err) console.error(err.message)
                  else {
                    cli.action.stop()
                    cli.action.start('Creating your stack in the AWS cloud')
                    SEF.CreateStack(args.name, data, function(err, data){
                      if(err) console.error(err)
                      else {
                        cli.action.stop()
                        cli.action.start('Fetching your API enpoint URL')
                        SEF.GetApiUrl(args.name, data, function(err, data){
                          if(err) console.error(err.message)
                          else {
                            cli.action.stop()
                            cli.action.start('Generating your form')
                            options["endpointUrl"] = data; 
                            SEF.CreateForm(args.name, options, function(err, data){
                              if(err) console.error(err.message)
                              else {
                                cli.action.stop()
                                open(`forms/${args.name}/${args.name}.html`);
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                }) 
              }
            })
          }
          else {
            console.log(`email confirmation has been sent to ${options.email}`)
            promptemail(options.email, console.log("SUCCESS"))
          }
        })
      }
    })
  } 
}

FullformCommand.description = `Builds an html form`

module.exports = FullformCommand
