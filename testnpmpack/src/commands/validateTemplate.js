const {Command, flags} = require('@oclif/command')

class ValidateTemplateCommand extends Command {
  async run() {
    const {flags} = this.parse(ValidateTemplateCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/validateTemplate.js`)
  }
}

ValidateTemplateCommand.description = `Describe the command here
...
Extra documentation goes here
`

ValidateTemplateCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ValidateTemplateCommand
