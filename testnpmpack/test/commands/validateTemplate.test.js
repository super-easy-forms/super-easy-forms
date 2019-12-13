const {expect, test} = require('@oclif/test')

describe('validateTemplate', () => {
  test
  .stdout()
  .command(['validateTemplate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['validateTemplate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
