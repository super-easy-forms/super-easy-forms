const {Command, flags} = require('@oclif/command')

class TemplateCommand extends Command {
  async run() {
    const {flags} = this.parse(TemplateCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/template.js`)
  }
}

TemplateCommand.description = `Describe the command here
...
Extra documentation goes here
`

TemplateCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = TemplateCommand
