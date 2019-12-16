"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const chai_1 = require("./chai");
exports.default = (arg, opts = {}) => ({
    run() {
        if (opts.raiseIfNotThrown !== false) {
            throw new Error('expected error to be thrown');
        }
    },
    catch(ctx) {
        const err = ctx.error;
        if (_.isRegExp(arg)) {
            chai_1.expect(err.message).to.match(arg);
        }
        else if (_.isString(arg)) {
            chai_1.expect(err.message).to.equal(arg);
        }
        else if (arg) {
            arg(err);
        }
        else {
            throw new Error('no arg provided to catch');
        }
    },
});
