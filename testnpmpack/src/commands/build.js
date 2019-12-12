const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')

class BuildCommand extends Command {
  async run() {
    SEF.Build()
  }
}

BuildCommand.description = `Builds the forms dir, the .env and gitignore files, and the settings.json file.`

module.exports = BuildCommand
