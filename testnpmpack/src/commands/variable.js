const {Command, flags} = require('@oclif/command')

class VariableCommand extends Command {
  async run() {
    const {flags} = this.parse(VariableCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/variable.js`)
  }
}

VariableCommand.description = `Describe the command here
...
Extra documentation goes here
`

VariableCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = VariableCommand
