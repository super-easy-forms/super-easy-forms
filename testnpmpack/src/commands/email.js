const {Command, flags} = require('@oclif/command')

class EmailCommand extends Command {
  async run() {
    const {flags} = this.parse(EmailCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/email.js`)
  }
}

EmailCommand.description = `Describe the command here
...
Extra documentation goes here
`

EmailCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = EmailCommand
