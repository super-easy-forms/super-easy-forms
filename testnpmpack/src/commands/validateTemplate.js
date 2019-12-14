const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class ValidateTemplateCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form - must be unique',
    }
  ]
  async run() {
    const {args} = this.parse(ValidateTemplateCommand)
    cli.action.start('Validating your cloudformation template')
    SEF.ValidateTemplate(args.name, function(err, data){
      if(err) console.error(err)
      else{
        console.log(data)
        cli.action.stop()
      }
    })
  }
}

ValidateTemplateCommand.description = `validates a cloudformation template saved in your formName's dir with AWS`

module.exports = ValidateTemplateCommand
