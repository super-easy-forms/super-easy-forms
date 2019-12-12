const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const open = require('open');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class EmailCommand extends Command {
  static args = [
    {
      name: 'form',
      required: true,
      description: 'name of the form - must be unique',
    },
    {
      name: 'email',
      required: true,
      description: 'the email address that will send the form submission emails',
    },
  ]
  static flags = {
    recipients: flags.string({
      char: 'r',                    
      description: 'email addresses that will recieve form submission emails sepparated by commas',
      multiple: false,
      required: false         
    }), 
    provider: flags.string({
      char: 'p',                    
      description: 'the provider of the email service. SES | GMAIL',
      multiple: false,
      required: false,
      options: ['SES', 'GMAIL'],
      default: 'SES'    
    }),
  }

  async run() {
    const {args, flags} = this.parse(EmailCommand)
    let options = {endpointUrl:null, formFields:null};
    let params = {};
    //validate email
    //validateSESemail
    //if valid -> addVar
    //else -> prompt user -> email verification sent. please confirm your email and press done.
    if(flags.url){
      options.endpointUrl = flags.url
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
}

EmailCommand.description = `Builds an html form`

module.exports = EmailCommand

