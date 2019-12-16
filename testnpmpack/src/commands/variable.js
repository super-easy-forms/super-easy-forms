const {Command} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class VariableCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form',
    },
    {
      name: 'variable',
      required: true,
      description: 'name of the variable',
    },
    {
      name: 'value',
      required: true,
      description: 'value of the variable',
    },
  ]

  async run() {
    const {args} = this.parse(VariableCommand)
    cli.action.start('Adding your variable')
    SEF.AddConfigVariable(args.name, args.variable, args.value, function(err, data){
      if(data){
        cli.action.stop();
      }
    })
  } 
}

VariableCommand.description = `Builds an html form`

module.exports = VariableCommand