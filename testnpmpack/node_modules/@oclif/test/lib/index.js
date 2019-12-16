"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = require("@oclif/config");
exports.Config = Config;
const fancy_test_1 = require("fancy-test");
exports.expect = fancy_test_1.expect;
exports.FancyTypes = fancy_test_1.FancyTypes;
const command_1 = require("./command");
exports.command = command_1.command;
const exit_1 = require("./exit");
const hook_1 = require("./hook");
const load_config_1 = require("./load-config");
load_config_1.loadConfig.root = module.parent.filename;
exports.test = fancy_test_1.fancy
    .register('loadConfig', load_config_1.loadConfig)
    .register('command', command_1.command)
    .register('exit', exit_1.default)
    .register('hook', hook_1.default);
exports.default = exports.test;
