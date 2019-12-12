const {Command, flags} = require('@oclif/command')
const Listr = require('listr');
const SEF = require('super-easy-forms')
const open = require('open');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class FormstackCommand extends Command {
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
      default: false,
      description: 'Automatically add labels to your form',
      dependsOn: ['fields']
    })
  }

  async run() {
    const {args, flags} = this.parse(FormstackCommand)
    let options = {endpointUrl:null, formFields:null};
    let params = {};
    const tasks = new Listr([
      {
        title: 'Create Form with Stack',
        task: () => {
          return new Listr([
          {
            title: 'Generating form inputs',
            task: () => SEF.ParseFields(flags.fields, true)
          },
          {
            title: 'Generating the lambda function',
            task: () => setTimeout(function(){return 0},2000)
          },
          {
            title: 'Generating the Cloudformation template',
            task: () => setTimeout(function(){return 0},2000)
          },
          {
            title: 'Deploying the stack',
            task: () => setTimeout(function(){return 0},2000)
          },
          {
            title: 'Fetching the API enpoint URL',
            task: () => setTimeout(function(){return 0},2000)
          },
          {
            title: 'Generating the form',
            task: () => SEF.CreateForm(args.name, params)
          },
        ])
      }
    }
    ]);
    tasks.run().catch(err => {
      console.error(err);
    });
  }
}

FormstackCommand.description = `Builds an html form`

module.exports = FormstackCommand
