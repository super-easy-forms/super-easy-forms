#node-mock-stdin

[![Build Status](https://travis-ci.org/caitp/node-mock-stdin.svg?branch=master)](https://travis-ci.org/caitp/node-mock-stdin) [![Coverage Status](https://img.shields.io/coveralls/caitp/node-mock-stdin.svg)](https://coveralls.io/r/caitp/node-mock-stdin?branch=master) [![NPM Version](http://img.shields.io/npm/v/mock-stdin.svg)](https://www.npmjs.org/package/mock-stdin)

Provide a mock readable stream, useful for testing interactive CLI applications.

Maybe simple mocks for other standard files wouldn't be a terrible idea, if anyone
feels like those are needed. Patches welcome.

##API

- **Module**
  - [stdin()](#modulestdin)
- **MockSTDIN**
  - [send()](#mockstdinsenddata)
  - [end()](#mockstdinend)
  - [restore()](#mockstdinrestore)
  - [reset()](#mockstdinresetremovelisteners)

---

######Module#stdin()

**example**

```js
require('mock-stdin').stdin();
```

Replaces the existing `process.stdin` value with a mock object exposing a `send` method (a
`MockSTDIN` instance). This allows APIs like `process.openStdin()` or `process.stdin.on()`
to operate on a mock instance.

**note**: Event listeners from the original `process.stdin` instance are not added to the
mock instance. Installation of the mock should occur before any event listeners are
registered.

**return value**: A `MockSTDIN` instance

---

######MockSTDIN#send(data, encoding)

**example**

```js
var stdin = require('mock-stdin').stdin();
stdin.send("Some text", "ascii");
stdin.send(Buffer("Some text", "Some optional encoding"));
stdin.send([
  "Array of lines",
  "  which are joined with a linefeed."
]);

// sending a null will trigger EOF and dispatch an 'end' event.
stdin.send(null);
```

Queue up data to be read by the stream. Results in data (and possibly end) events being 
dispatched.

**parameters**
  - `data`: A `String`, `Buffer`, `Array<String>`, or `null`. The `data` parameter will result in
    the default encoding if specified as a string or array of strings.
  - `encoding`: An optional encoding which is used when `data` is a `String`.
      Node.js's internal Readable Stream will convert the specified encoding into the output
      encoding, which is transcoded if necessary.

**return value**: The `MockSTDIN` instance, for chaining.

---

######MockSTDIN#end()

**example**

```js
var stdin = require('mock-stdin').stdin();
stdin.end();
```

Alias for [MockSTDIN#send(null)](#mockstdinsend). Results in dispatching an `end` event.

**return value**: The `MockSTDIN` instance, for chaining.

---

######MockSTDIN#restore()

**example**

```js
var stdin = require('mock-stdin').stdin();
// process.stdin is now a mock stream
stdin.restore();
// process.stdin is returned to its original state
```

Restore the target of the mocked stream. If only a single mock stream is created, will restore
the original `stdin` TTY stream. If multiple mock streams are created, it will restore the
stream which was active at the time the mock was created.

**return value**: The `MockSTDIN` instance, for chaining.

---

######MockSTDIN#reset(removeListeners)

**example**

```js
var stdin = require('mock-stdin').stdin();
stdin.end();
stdin.reset();
stdin.send("some data");
```

Ordinarily, a Readable stream will throw when attempting to push after an EOF. This routine will
reset the `ended` state of a Readable stream, preventing it from throwing post-EOF. This prevents
being required to re-create a mock STDIN instance during certain tests where a fresh stdin is
required.

If the `removeListeners` flag is set to `true`, all event listeners will also be reset. This is
useful in cases where you need to emulate restarting an entire application, without fully 
re-creating the mock object.

**parameters**
  - `removeListeners`: Boolean value which, when set to `true`, will remove all event listeners
  attached to the stream.

**return value**: The `MockSTDIN` instance, for chaining.

---

##[LICENSE](LICENSE)

The MIT License (MIT)

Copyright (c) 2014 Caitlin Potter & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
