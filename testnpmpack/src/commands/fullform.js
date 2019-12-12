const {Command, flags} = require('@oclif/command')

class FullformCommand extends Command {
  async run() {
    const {flags} = this.parse(FullformCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/fullform.js`)
  }
}

FullformCommand.description = `Describe the command here
...
Extra documentation goes here
`

FullformCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = FullformCommand
