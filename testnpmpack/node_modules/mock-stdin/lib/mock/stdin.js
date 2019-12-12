var stream = require('stream');
var inherits = require('util').inherits;

function MockSTDIN(restoreTarget) {
  stream.Readable.call(this, {
    highWaterMark: 0,
    readable: true,
    writable: false
  });
  Object.defineProperties(this, {
    target: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: restoreTarget
    },
    isMock: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: true
    },
    _mockData: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: []
    },
    _flags: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: {
        emittedData: false,
        lastChunk: null
      }
    }
  });
}

inherits(MockSTDIN, stream.Readable);

function MockData(chunk, encoding) {
  Object.defineProperties(this, {
    data: {
      value: chunk,
      writable: false,
      configurable: false,
      enumerable: false
    },
    length: {
      get: function() {
        if (Buffer.isBuffer(chunk)) {
          return chunk.length;
        } else if (typeof chunk === 'string') {
          return chunk.length;
        }
        return 0;
      },
      configurable: false,
      enumerable: false
    },
    pos: {
      writable: true,
      value: 0,
      configurable: false,
      enumerable: false
    },
    done: {
      writable: true,
      value: false,
      configurable: false,
      enumerable: false
    },
    encoding: {
      writable: false,
      value: ((typeof encoding === "string") && encoding) || null,
      configurable: false,
      enumerable: false
    }
  });
}

MockData.prototype.chunk = function(length) {
  if (this.pos <= this.length) {
    if (Buffer.isBuffer(this.data) || typeof this.data === 'string') {
      var value = this.data.slice(this.pos, this.pos + length);
      this.pos += length;
      if (this.pos >= this.length) {
        this.done = true;
      }
      return value;
    }
  }

  this.done = true;
  return null;
}

var Readable$emit = stream.Readable.prototype.emit;
MockSTDIN.prototype.emit = function MockSTDINEmit(name) {
  if (name === 'data') {
    this._flags.emittedData = true;
    this._flags.lastChunk = null;
  }
  return Readable$emit.apply(this, arguments);
};

MockSTDIN.prototype.send = function MockSTDINWrite(text, encoding) {
  if (Array.isArray(text)) {
    if (arguments.length > 1) {
      throw new TypeError("Cannot invoke MockSTDIN#send(): `encoding` " +
                          "specified while text specified as an array.");
    }
    text = text.join('\n');
  }
  if (Buffer.isBuffer(text) || typeof text === 'string' || text === null) {
    var data = new MockData(text, encoding);
    this._mockData.push(data);
    this._read();
    if (!this._flags.emittedData && this._readableState.length) {
      drainData(this);
    }
    if (text === null) {
      // Trigger an end event synchronously...
      endReadable(this);
    }
  }
  return this;
};

MockSTDIN.prototype.end = function MockSTDINEnd() {
  this.send(null);
  return this;
};

MockSTDIN.prototype.restore = function MockSTDINRestore() {
  Object.defineProperty(process, 'stdin', {
    value: this.target,
    configurable: true,
    writable: false
  });
  return this;
};

MockSTDIN.prototype.reset = function MockSTDINReset(removeListeners) {
  var state = this._readableState;
  state.ended = false;
  state.endEmitted = false;
  if (removeListeners === true) {
    this.removeAllListeners();
  }
  return this;
};

MockSTDIN.prototype._read = function MockSTDINRead(size) {
  if (size === void 0) size = Infinity;
  var count = 0;
  var read = true;
  while (read && this._mockData.length && count < size) {
    var item = this._mockData[0];
    var leftInChunk = item.length - item.pos;
    var remaining = size === Infinity ? leftInChunk : size - count;
    var encoding = item.encoding;
    var toProcess = Math.min(leftInChunk, remaining);
    var chunk = this._flags.lastChunk = item.chunk(toProcess);

    if (!(encoding === null ? this.push(chunk) : this.push(chunk, encoding))) {
      read = false;
    }

    if (item.done) {
      this._mockData.shift();
    }

    count += toProcess;
  }
};

MockSTDIN.prototype.setRawMode = function MockSTDINSetRawMode (bool) {
  if (typeof bool !== 'boolean') throw new TypeError('setRawMode only takes booleans');
  return this;
};

function endReadable(stream) {
  // Synchronously emit an end event, if possible.
  var state = stream._readableState;

  if (!state.length) {
    state.ended = true;
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function drainData(stream) {
  var state = stream._readableState;
  var buffer = state.buffer;
  while (buffer.length) {
    var chunk = buffer.shift();
    if (chunk !== null) {
      state.length -= chunk.length;
      stream.emit('data', chunk);
      stream._flags.emittedData = false;
    }
  }
}

function mock() {
  var mock = new MockSTDIN(process.stdin);
  Object.defineProperty(process, 'stdin', {
    value: mock,
    configurable: true,
    writable: false
  });
  return mock;
}

mock.Class = MockSTDIN;

module.exports = mock;
