const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const open = require('open');
const {cli} = require('cli-ux');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class FormCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form - must be unique',
    },
  ]
  static flags = {
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
      dependsOn: ['fields']
    }),
      url: flags.string({
      char: 'u',                    
      description: 'The API endpoint endpointUrl for your form',
      multiple: false,
      required: false         
    }),
  }

  async run() {
    const {args, flags} = this.parse(FormCommand)
    let options = {endpointUrl:null, formFields:null};
    let params = {};
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
      options = null;
    }
    cli.action.start('Generating your form')
    SEF.CreateForm(args.name, options, function(err, data){
      if(err) console.error(err)
      else{
        open(`forms/${args.name}/${args.name}.html`);
        cli.action.stop()
      }
    })
  } 
}

FormCommand.description = `Builds an html form`

module.exports = FormCommand
