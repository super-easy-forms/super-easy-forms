const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')

class BuildCommand extends Command {
  async run() {
    SEF.Build()
  }
}

BuildCommand.description = `Builds the required base files and directories.`

module.exports = BuildCommand
