const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const SEF = require('super-easy-forms')

const wait = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))


class HelloCommand extends Command {
  async run() {
    console.log("HELLO")
  }
}

HelloCommand.description = `Describe the command here
...
Extra documentation goes here
`

HelloCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = HelloCommand
