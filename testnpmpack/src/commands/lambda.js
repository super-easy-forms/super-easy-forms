const {Command, flags} = require('@oclif/command')

class LambdaCommand extends Command {
  async run() {
    const {flags} = this.parse(LambdaCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/fargo/Desktop/super_easy_forms/testnpmpack/src/commands/lambda.js`)
  }
}

LambdaCommand.description = `Describe the command here
...
Extra documentation goes here
`

LambdaCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = LambdaCommand
