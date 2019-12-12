stdout-stderr
=============

mock stdout and stderr

[![Version](https://img.shields.io/npm/v/stdout-stderr.svg)](https://npmjs.org/package/stdout-stderr)
[![CircleCI](https://circleci.com/gh/jdxcode/stdout-stderr/tree/master.svg?style=svg)](https://circleci.com/gh/jdxcode/stdout-stderr/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/jdxcode/stdout-stderr?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/stdout-stderr/branch/master)
[![Codecov](https://codecov.io/gh/jdxcode/stdout-stderr/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/stdout-stderr)
[![Greenkeeper](https://badges.greenkeeper.io/jdxcode/stdout-stderr.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/npm/stdout-stderr/badge.svg)](https://snyk.io/test/npm/stdout-stderr)
[![Downloads/week](https://img.shields.io/npm/dw/stdout-stderr.svg)](https://npmjs.org/package/stdout-stderr)
[![License](https://img.shields.io/npm/l/stdout-stderr.svg)](https://github.com/jdxcode/stdout-stderr/blob/master/package.json)

**Usage:**

```js
const {stdout, stderr} = require('stdout-stderr')

// start mocking stdout
stdout.start()

console.log('writing to stderr')

// stop mocking stdout
stdout.stop()

// options

// strips ansi colors by default, to disable:
stdout.stripColor = false

// also output to screen
stdout.print = true
```

This uses the [debug](https://npm.im/debug) module so you can also see the output by setting `DEBUG=stdout|stderr|*`.
