const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class TemplateCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form - must be unique',
    },
  ]
  static flags = {
    create: flags.boolean({
      char: 'c',
      default: false,
      description: 'Create a new cloudformation temmplate and saves it locally',
    }),
    validate: flags.boolean({
      char: 'v',
      default: true,
      description: 'Validate your cloudformation template with AWS',
    }),
    email: flags.string({
      char: 'e',                    
      description: 'Email address that will be used to send emails',
      multiple: false,
      required: false         
    }), 
    fields: flags.string({
      char: 'f',                    
      description: 'Desired form formFields',
      multiple: false,
      required: false         
    }),
  }

  async run() {
    const {args, flags} = this.parse(TemplateCommand)
    let options = {"email":null, "formFields":null};
    let params = {};
    if(flags.email){
      options.email = flags.email
    }
    if(flags.fields){
      options.formFields = flags.feilds
    }
    Object.keys(options).map(function(key, index) {
      if(options[key]){
        params[key] = options[key]
      }
    })
    if(isEmpty(params)){
      options = null;
    }
    if(flags.create){
      cli.action.start('Creating your cloudformation template')
      SEF.CreateTemplate(args.name, options, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          cli.action.stop()
          if(flags.validate){
            cli.action.start('Validating your cloudformation template')
            SEF.ValidateTemplate(args.name, function(err, data){
              if(err) {
                console.error(err)
                cli.action.stop('Error')
              }
              else{
                cli.action.stop()
              }
            })
          }
          else cli.action.stop()
        }
      })
    }
    else if(flags.validate){
      cli.action.start('Validating your cloudformation template')
      SEF.ValidateTemplate(args.name, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          cli.action.stop()
        }
      })
    }
    else {
      console.error('you must either create or validate the template')
    }
  } 
}
    

TemplateCommand.description = `validate/create/update your cloudformation template saved locally`

module.exports = TemplateCommand

