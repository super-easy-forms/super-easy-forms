var mock = process.env.COVERAGE ? require("../lib-cov") : require("../lib");
var stdin;
module.exports.stdin = {
  setUp: function(cb) {
    stdin = mock.stdin();
    cb();
  },


  tearDown: function(cb) {
    process.stdin.restore();
    cb();
  },


  "process.stdin instanceof MockSTDIN": function (test) {
    test.ok(process.stdin instanceof mock.stdin.Class);
    test.done();
  },


  "MockSTDIN#openStdin()": function (test) {
    test.doesNotThrow(function() {
      process.openStdin();
    }, "process.openStdin() should not throw.");
    test.done();
  },


  "MockSTDIN#restore()": function (test) {
    process.stdin.restore();
    test.ok(!(process.stdin instanceof mock.stdin.Class),
        "restore() should restore previous object");
    mock.stdin();
    test.done();
  },


  "MockSTDIN#setEncoding()": function (test) {
    test.doesNotThrow(function() {
      process.stdin.setEncoding("utf8");
    }, "process.stdin.setEncoding() should not throw.");
    test.done();
  },


  "MockSTDIN#send(<Array>)": function (test) {
    var received;
    var called = false;
    var errors = [];
    var endCalled = false;
    var data = [
      "To whom it may concern,",
      "",
      "I am a piece of mock data.",
      "",
      "Regards,",
      "Cortana"
    ];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(data) {
      called = true;
      received = data;
    });
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      endCalled = true;
    });
    process.stdin.resume();
    stdin.send(data);
    test.ok(called, "'data' event was not received.");
    test.equals(received, data.join("\n"),
        "received data should be array joined by linefeeds.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(!endCalled, "'end' event should not be received.");
    test.done();
  },


  "MockSTDIN#send(<String>)": function (test) {
    var received;
    var called = false;
    var errors = [];
    var endCalled = false;
    var data = [
      "To whom it may concern,",
      "",
      "I am a piece of mock data.",
      "",
      "Regards,",
      "Cortana"
    ].join("\n");
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(data) {
      called = true;
      received = data;
    });
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      endCalled = true;
    });
    process.stdin.resume();
    process.stdin.send(data);
    test.ok(called, "'data' event was not received.");
    test.equals(received, data, "received data should match what was sent.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(!endCalled, "'end' event should not be received.");
    test.done();
  },


  "MockSTDIN#send(<Buffer>)": function (test) {
    var received;
    var called = false;
    var errors = [];
    var endCalled = false;
    var data = [
      "To whom it may concern,",
      "",
      "I am a piece of mock data.",
      "",
      "Regards,",
      "Cortana"
    ].join("\n");
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(data) {
      called = true;
      received = data;
    });
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      endCalled = true;
    });
    process.stdin.resume();
    process.stdin.send(new Buffer(data, "utf8"));
    test.ok(called, "'data' event was not received.");
    test.equals(received, data, "received data should match what was sent.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(!endCalled, "'end' event should not be received.");
    test.done();
  },


  "MockSTDIN#send(<Null>)": function (test) {
    var called = false;
    var dataCalled = false;
    var errors = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      called = true;
    });
    process.stdin.on("data", function() {
      dataCalled = true;
    });
    process.stdin.resume();
    process.stdin.send(null);
    test.ok(!dataCalled, "'data' event should not be received.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(called, "'end' event was not received.");
    test.done();
  },

  "MockSTDIN#send(<Array>, <Encoding>)": function (test) {
    var endCalled = false;
    var data = '';
    var errors = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      endCalled = true;
    });
    process.stdin.on("data", function(text) {
      data += text;
    });
    process.stdin.resume();
    test.throws(function() {
      process.stdin.send(["44GT44KT44Gr44Gh44Gv", "5LiW55WM"], "base64");
    }, TypeError, "should have thrown.");
    test.done();
  },


  "MockSTDIN#send(<String>, <Encoding>)": function (test) {
    var endCalled = false;
    var data = '';
    var errors = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      endCalled = true;
    });
    process.stdin.on("data", function(text) {
      data += text;
    });
    process.stdin.resume();
    process.stdin.send("44GT44KT44Gr44Gh44Gv5LiW55WM", "base64");
    test.equals(data, "こんにちは世界", "'data' should be decoded from base64.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(!endCalled, "'end' event should not be received.");
    test.done();
  },


  "MockSTDIN#end()": function (test) {
    var called = false;
    var dataCalled = false;
    var errors = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("error", function(error) {
      errors.push(error);
    });
    process.stdin.on("end", function() {
      called = true;
    });
    process.stdin.on("data", function() {
      dataCalled = true;
    });
    process.stdin.resume();
    process.stdin.end();
    test.ok(!dataCalled, "'data' event should not be received.");
    test.deepEqual(errors, [], "'error' event should not be received.");
    test.ok(called, "'end' event was not received.");

    called = false;
    setTimeout(function() {
      test.ok(!called, "'end' event should not be dispatched more than once.");
      test.done();
    });
  },


  "MockSTDIN#reset()": function (test) {
    var received = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on("data", function(data) {
      received += data;
    });
    process.stdin.end();
    test.ok(process.stdin._readableState.ended, "stream should be 'ended'.");
    test.ok(process.stdin._readableState.endEmitted, "'end' event should be dispatched.");
    process.stdin.reset();

    test.ok(!process.stdin._readableState.ended, "'ended' flag should be reset.");
    test.ok(!process.stdin._readableState.endEmitted, "'endEmitted' flag should be reset.");

    test.doesNotThrow(function() {
      process.stdin.send("Please don't throw, little lamb!");
    }, "should not throw when sending data after end when reset() called");

    test.equal(received, "Please don't throw, little lamb!");
    test.done();
  },


  "MockSTDIN#reset(true)": function (test) {
    var received = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on("data", function(data) {
      received += data;
    });
    process.stdin.end();
    test.ok(process.stdin._readableState.ended, "stream should be 'ended'.");
    test.ok(process.stdin._readableState.endEmitted, "'end' event should be dispatched.");
    process.stdin.reset(true);

    process.stdin.on("data", function(data) {
      received += data;
    });

    test.ok(!process.stdin._readableState.ended, "'ended' flag should be reset.");
    test.ok(!process.stdin._readableState.endEmitted, "'endEmitted' flag should be reset.");

    test.doesNotThrow(function() {
      process.stdin.send("Please don't throw, little lamb!");
    }, "should not throw when sending data after end when reset() called");

    test.equal(received, "Please don't throw, little lamb!");
    test.done();
  },


  "MockSTDIN#setRawMode(<String>)": function (test) {
    function thrower () {
      process.stdin.setRawMode('');
    }
    test.throws(thrower, TypeError);
    test.done();
  },


  "MockSTDIN#SetRawMode(<Boolean>)": function (test) {
    function notthrower () {
      process.stdin.setRawMode(true);
      process.stdin.setRawMode(false);
      process.stdin.end();
    }

    test.doesNotThrow(notthrower);
    test.done();
  }
};
