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
  async run() {
    const {args} = this.parse(SubmissionsCommand)
    cli.action.start('Fetching your form submissions')
    SEF.GetSubmissions(args.name, function(err, data){
      if(err) console.error(err)
      else{
        cli.action.stop()
        console.log(JSON.stringify(data))
      }
    })
  }
}

SubmissionsCommand.description = `validates a cloudformation template saved in your formName's dir with AWS`

module.exports = SubmissionsCommand
