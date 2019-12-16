const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const {cli} = require('cli-ux');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class EmailCommand extends Command {
  static args = [
    {
      name: 'email',
      required: true,
      description: 'the email address that will send the form submission emails',
    },
    {
      name: 'name',
      required: false,
      description: 'name of the form - must be unique',
      dependsOn: ['validate']
    },
  ]
  static flags = {
    new: flags.boolean({
      char: 'n',                    
      description: 'verifies a new email address to be used by AWS SES to send email',
      multiple: false,
      required: false,
      default: false    
    }),
    validate: flags.boolean({
      char: 'v',                    
      description: 'validates that the provided email address was verified with AWS SES',
      multiple: false,
      required: false,  
    }),
    /*
    provider: flags.string({
      char: 'p',                    
      description: 'the provider of the email service. SES | GMAIL',
      multiple: false,
      required: false,
      options: ['SES', 'GMAIL'],
      default: 'SES'    
    }),
    */
  }

  async run() {
    const {args, flags} = this.parse(EmailCommand)
    if(flags.new){
      cli.action.start('Veryfying your email with SES')
      SEF.VerifySesEmail(args.email, function(err, data) {
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          cli.action.stop()
          console.log(`A verification email has been sent to ${args.email}`)
          if(flags.validate){
            readline.question(`Have you finished confirming the email address? [Yy/Nn]`, (res) => {
              if(res === 'y' || res === 'Y' || res === 'yes'){
                cli.action.start('Validating your SES email')
                SEF.ValidateSesEmail(args.name, args.email, function(err, data){
                  if(err) {
                    console.error(err)
                    cli.action.stop('Error')
                  }
                  else{
                    cli.action.stop()
                  }
                })
              }
              else {
                console.error('please confirm the verification email and try again')
              }
            })
          }
          else cli.action.stop()
        }
      })
    }
    else if(flags.validate){
      cli.action.start('Validating your SES email')
      SEF.ValidateSesEmail(args.name, args.email, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else if(data){
          cli.action.stop()
        }
        else {
          console.error('Your email hasnt been confirmed yet.')
          cli.action.stop('Error')
        }
      })
    }
    else {
      console.error('you must either create or validate the template')
    }
  } 
}

EmailCommand.description = `Builds an html form`

module.exports = EmailCommand
