const {Command, flags} = require('@oclif/command')

class IamCommand extends Command {
  async run() {
    const {flags} = this.parse(IamCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/iam.js`)
  }
}

IamCommand.description = `Describe the command here
...
Extra documentation goes here
`

IamCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = IamCommand
