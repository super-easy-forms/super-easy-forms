const {Command, flags} = require('@oclif/command')

class FormstackCommand extends Command {
  async run() {
    const {flags} = this.parse(FormstackCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/formstack.js`)
  }
}

FormstackCommand.description = `Describe the command here
...
Extra documentation goes here
`

FormstackCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = FormstackCommand
