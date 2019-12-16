"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const catch_1 = require("./catch");
const chai_1 = require("./chai");
exports.expect = chai_1.expect;
const env_1 = require("./env");
const Nock = require("./nock");
const stdmock_1 = require("./stdmock");
const stub_1 = require("./stub");
const timeout_1 = require("./timeout");
const FancyTypes = require("./types");
exports.FancyTypes = FancyTypes;
exports.fancy = base_1.default
    .register('catch', catch_1.default)
    .register('env', env_1.default)
    .register('stub', stub_1.default)
    .register('stdin', stdmock_1.stdin)
    .register('stderr', stdmock_1.stderr)
    .register('stdout', stdmock_1.stdout)
    .register('nock', Nock.nock)
    .register('timeout', timeout_1.default);
exports.default = exports.fancy;
