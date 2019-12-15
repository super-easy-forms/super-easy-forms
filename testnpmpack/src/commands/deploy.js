const {Command, flags} = require('@oclif/command')

class DeployCommand extends Command {
  async run() {
    const {flags} = this.parse(DeployCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/deploy.js`)
  }
}

DeployCommand.description = `Describe the command here
...
Extra documentation goes here
`

DeployCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = DeployCommand
