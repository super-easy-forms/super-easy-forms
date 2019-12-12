fancy-test
===========

extendable utilities for testing

[![Version](https://img.shields.io/npm/v/fancy-test.svg)](https://npmjs.org/package/fancy-test)
[![CircleCI](https://circleci.com/gh/jdxcode/fancy-test/tree/master.svg?style=svg)](https://circleci.com/gh/jdxcode/fancy-test/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/jdxcode/fancy-test?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/fancy-test/branch/master)
[![Codecov](https://codecov.io/gh/jdxcode/fancy-test/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/fancy-test)
[![Greenkeeper](https://badges.greenkeeper.io/jdxcode/fancy-test.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/npm/fancy-test/badge.svg)](https://snyk.io/test/npm/fancy-test)
[![Downloads/week](https://img.shields.io/npm/dw/fancy-test.svg)](https://npmjs.org/package/fancy-test)
[![License](https://img.shields.io/npm/l/fancy-test.svg)](https://github.com/jdxcode/fancy-test/blob/master/package.json)

<!-- toc -->

- [Why](#why)
- [Usage](#usage)
  * [Stub](#stub)
  * [Catch](#catch)
  * [Finally](#finally)
  * [Nock](#nock)
  * [Environment Variables](#environment-variables)
  * [Do](#do)
  * [Add](#add)
  * [Stdin Mocking](#stdin-mocking)
  * [Stdout/Stderr Mocking](#stdoutstderr-mocking)
  * [Done](#done)
  * [Retries](#retries)
  * [Timeout](#timeout)
  * [Chai](#chai)
- [Chaining](#chaining)
- [Custom Plugins](#custom-plugins)
- [TypeScript](#typescript)

<!-- tocstop -->

Why
===

Mocha out of the box often requires a lot of setup and teardown code in `beforeEach/afterEach` filters. Using this library, you can get rid of those entirely and build your tests declaratively by chaining functionality together. Using the builtin plugins and your own, you create bits of functionality and chain them together with a concise syntax. It will greatly reduce the amount of repetition in your codebase.

It should be compatible with other testing libraries as well (e.g. jest), but may require a couple small changes. If you're interested, try it out and let me know if it works.

As an example, here is what a test file might look like for an application setup with fancy-test. This chain could partially be stored to a variable for reuse.

```js
describe('api', () => {
  fancy
  // [custom plugin] initializes the db
  .initDB({withUser: mockDBUser})

  // [custom plugin] uses nock to mock out github API
  .mockGithubAPI({user: mockGithubUser})

  // [custom plugin] that calls the API of the app
  .call('POST', '/api/user/foo', {id: mockDBUser.id})

  // add adds to the context object
  // fetch the newly created data from the API (can return a promise)
  .add('user', ctx => ctx.db.fetchUserAsync(mockDBUser.id))

  // do just runs arbitary code
  // check to ensure the operation was successful
  .do(ctx => expect(ctx.user.foo).to.equal('bar'))

  // it is essentially mocha's it(expectation, callback)
  // start the test and provide a description
  .it('POST /api/user/foo updates the user')
})
```

Usage
=====

Setup is pretty easy, just install mocha and fancy-test, then you can use any of the examples below.

Assume the following is before all the examples:

```js
import {fancy} from 'fancy-test'
import {expect} from 'chai'
```

Stub
----

Stub any object. Like all fancy plugins, it ensures that it is reset to normal after the test runs.
```js
import * as os from 'os'

describe('stub tests', () => {
  fancy
  .stub(os, 'platform', () => 'foobar')
  .it('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy
  .stub(os, 'platform', sinon.stub().returns('foobar'))
  .it('uses sinon', () => {
    expect(os.platform()).to.equal('foobar')
    expect(os.platform.called).to.equal(true)
  })
})
```

Catch
-----

catch errors in a declarative way. By default, ensures they are actually thrown as well.

```js
describe('catch tests', () => {
  fancy
  .do(() => { throw new Error('foobar') })
  .catch(/foo/)
  .it('uses regex')

  fancy
  .do(() => { throw new Error('foobar') })
  .catch('foobar')
  .it('uses string')

  fancy
  .do(() => { throw new Error('foobar') })
  .catch(err => expect(err.message).to.match(/foo/))
  .it('uses function')

  fancy
  // this would normally raise because there is no error being thrown
  .catch('foobar', {raiseIfNotThrown: false})
  .it('do not error if not thrown')
})
```

Without fancy, you could check an error like this:

```js
it('dont do this', () => {
  try {
    myfunc()
  } catch (err) {
    expect(err.message).to.match(/my custom errorr/)
  }
})
```

But this has a common flaw, if the test does not error, the test will still pass. Chai and other assertion libraries have helpers for this, but they still end up with somewhat messy code.

Finally
-------

Run a task even if the test errors out.

```js
describe('finally tests', () => {
  fancy
  .do(() => { throw new Error('x') })
  .finally(() => { /* always called */ })
  .end('always calls finally')
})
```

Nock
----

Uses [nock](https://github.com/node-nock/nock) to mock out HTTP calls to external APIs. You'll need to also install nock in your `devDependencies`.
Automatically calls `done()` to ensure the calls were made and `cleanAll()` to remove any pending requests.

```js
const fancy = require('fancy-test')

describe('nock tests', () => {
  fancy
  .nock('https://api.github.com', api => api
    .get('/me')
    .reply(200, {name: 'jdxcode'})
  )
  .it('mocks http call to github', async () => {
    const {body: user} = await HTTP.get('https://api.github.com/me')
    expect(user).to.have.property('name', 'jdxcode')
  })
})
```

Environment Variables
---------------------

Sometimes it's helpful to clear out environment variables before running tests or override them to something common.

```js
describe('env tests', () => {
  fancy
  .env({FOO: 'BAR'})
  .it('mocks FOO', () => {
    expect(process.env.FOO).to.equal('BAR')
    expect(process.env).to.not.deep.equal({FOO: 'BAR'})
  })

  fancy
  .env({FOO: 'BAR'}, {clear: true})
  .it('clears all env vars', () => {
    expect(process.env).to.deep.equal({FOO: 'BAR'})
  })
})
```

Do
---

Run some arbitrary code within the pipeline. Useful to create custom logic and debugging.

```js
describe('run', () => {
  fancy
  .stdout()
  .do(() => console.log('foo'))
  .do(({stdout}) => expect(stdout).to.equal('foo\n'))
  .it('runs this callback last', () => {
    // test code
  })

  // add to context object
  fancy
  .add('a', () => 1)
  .add('b', () => 2)
  // context will be {a: 1, b: 2}
  .it('does something with context', context => {
    // test code
  })
})
```

Add
---

Similar to run, but extends the context object with a new property.
Can return a promise or not.

```js
describe('add', () => {
  fancy
  .add('foo', () => 'foo')
  .add('bar', () => Promise.resolve('bar'))
  .do(ctx => expect(ctx).to.include({foo: 'foo', bar: 'bar'}))
  .it('adds the properties')
})
```

Stdin Mocking
-------------

Mocks stdin. You may have to pass a delay to have it wait a bit until it sends the event.

```js
describe('stdin test', () => {
  fancy
  .stdin('whoa there!\n')
  .stdout()
  .it('mocks', () => {
    process.stdin.setEncoding('utf8')
    process.stdin.once('data', data => {
      // data === 'whoa there!\n'
    })
  })
})
```

Stdout/Stderr Mocking
---------------------

This is used for tests that ensure that certain stdout/stderr messages are made.
By default this also trims the output from the screen. See the output by setting `TEST_OUTPUT=1`, or by setting `{print: true}` in the options passed.

You can use the library [stdout-stderr](https://npm.im/stdout-stderr) directly for doing this, but you have to be careful to always reset it after the tests run. We do that work for you so you don't have to worry about mocha's output being hidden.

```js
describe('stdmock tests', () => {
  fancy
  .stdout()
  .it('mocks stdout', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy
  .stderr()
  .it('mocks stderr', output => {
    console.error('foobar')
    expect(output.stderr).to.equal('foobar\n')
  })

  fancy
  .stdout()
  .stderr()
  .it('mocks stdout and stderr', output => {
    console.log('foo')
    console.error('bar')
    expect(output.stdout).to.equal('foo\n')
    expect(output.stderr).to.equal('bar\n')
  })
})
```

Done
----

You can get the mocha `done()` callback by passing in a second argument.

```js
describe('calls done', () => {
  fancy
  .it('expects FOO=bar', (_, done) => {
    done()
  })
})
```

Retries
-------

Retry the test n times.

```js
let count = 3

describe('test retries', () => {
  fancy
  .retries(2)
  .do(() => {
    count--
    if (count > 0) throw new Error('x')
  })
  .it('retries 3 times')
})
```

Timeout
-------

Set mocha timeout duration.

```js
const wait = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms))

describe('timeout', () => {
  fancy
  .timeout(50)
  .it('times out after 50ms', async () => {
    await wait(100)
  })
})
```

Chai
----

This library includes [chai](https://npm.im/chai) preloaded with [chai-as-promised](https://npm.im/chai-as-promised) for convenience:

```js
import {expect, fancy} from 'fancy-test'

describe('has chai', () => {
  fancy
  .env({FOO: 'BAR'})
  .it('expects FOO=bar', () => {
    expect(process.env.FOO).to.equal('BAR')
  })
})
```

Chaining
========

Everything here is chainable. You can also store parts of a chain to re-use later on.

For example:

```js
describe('my suite', () => {
  let setupDB = fancy
                .do(() => setupDB())
                .env({FOO: 'FOO'})

  setupDB
  .stdout()
  .it('tests with stdout mocked', () => {
    // test code
  })

  setupDB
  .env({BAR: 'BAR'})
  .it('also mocks the BAR environment variable', () => {
    // test code
  })
})
```

Using [do](#do) you can really maximize this ability. In fact, you don't even need to pass a callback to it if you prefer this syntax:

```js
describe('my suite', () => {
  let setupDB = fancy
                .do(() => setupDB())
                .catch(/spurious db error/)
                .do(() => setupDeps())

  let testMyApp = testInfo => {
    return setupDB.run()
    .do(context => myApp(testInfo, context))
  }

  testMyApp({info: 'test run a'})
  .it('tests a')

  testMyApp({info: 'test run b'})
  .it('tests b')
})
```

Custom Plugins
==============

It's easy to create your own plugins to extend fancy. In [oclif](https://github.com/oclif/oclif) we use fancy to create [custom command testers](https://github.com/oclif/example-multi-ts/blob/master/test/commands/hello.test.ts).

Here is an example that creates a counter that could be used to label each test run. See the [actual test](test/base.test.ts) to see the TypeScript types needed.

```js
let count = 0

fancy = fancy
.register('count', prefix => {
  return {
    run(ctx) {
      ctx.count = ++count
      ctx.testLabel = `${prefix}${count}`
    }
  }
})

describe('register', () => {
  fancy
  .count('test-')
  .it('is test #1', context => {
    expect(context.count).to.equal(1)
    expect(context.testLabel).to.equal('test-1')
  })

  fancy
  .count('test-')
  .it('is test #2', context => {
    expect(context.count).to.equal(2)
    expect(context.testLabel).to.equal('test-2')
  })
})
```

TypeScript
==========

This module is built in typescript and exports the typings. Doing something with dynamic chaining like this was [not easy](src/base.ts), but it should be fully typed throughout. Look at the internal plugins to get an idea of how to keep typings for your custom plugins.
