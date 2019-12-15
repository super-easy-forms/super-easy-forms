const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class DeleteCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of the form you want to delete',
    },
  ]
  static flags = {
    resources: flags.boolean({
      char: 'r',                    
      description: 'Delete all of the back-end resources for your form in the cloud',
      default: true,
      multiple: false,
      required: false         
    }), 
    /* all: flags.boolean({
      char: 'a',                    
      description: 'Delete the form and all of its resources.',
      multiple: false,
      required: false         
    }), 
    fields: flags.boolean({
      char: 'f',                    
      description: 'Delete the folder for a form',
      multiple: false,
      required: false         
    }) */
  }

  async run() {
    const {args} = this.parse(DeleteCommand)
    let check = await cli.prompt(`Are you sure you want to delete all the backend resources for ${args.name}`)
    if(check === 'Y' || check === 'y' || check === 'yes'){
      cli.action.start('Deleting your resources in the cloud')
      SEF.DeleteStack(args.name, function(err, data){
        if(err) console.error(err)
        else{
          cli.action.stop()
        }
      })
    }
  } 
}

DeleteCommand.description = `Builds an html form`

module.exports = DeleteCommand

