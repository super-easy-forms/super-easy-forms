const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class SubmissionsCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form - must be unique',
    }
  ]
  /*
  static flags = {
    list: flags.boolean({
      char: 'l',
      default: true,
      description: 'Automatically add labels to your form',
      dependsOn: ['fields']
    }),
    export: flags.boolean({
      char: 'l',
      default: true,
      description: 'Automatically add labels to your form',
      dependsOn: ['fields']         
    }),
    format: flags.string({
      char: 'f',                    
      description: 'Desired format csv|json',
      default: 'csv',
      multiple: false,
      required: false,
      dependsOn: ['fields']         
    }), 
  }
  */
  async run() {
    const {args} = this.parse(SubmissionsCommand)
    cli.action.start('Fetching your form submissions')
    SEF.GetSubmissions(args.name, function(err, data){
      if(err) console.error(err)
      else{
        for(let i = 0; i < data.length; i++){
          console.log(`${i}.`)
          let item = data[i];
          Object.keys(item).map(function(key) {
            let val = item[key]
            console.log(`${key}: ${val["S"]}`)
          }) 
        }
        cli.action.stop()
      }
    })
  }
}

SubmissionsCommand.description = `validates a cloudformation template saved in your formName's dir with AWS`

module.exports = SubmissionsCommand
