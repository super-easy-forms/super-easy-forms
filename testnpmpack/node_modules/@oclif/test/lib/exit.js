"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
/**
 * ensures that a oclif command or hook exits
 *
 * @param code - expected code
 * @default 0
 */
exports.default = (code = 0) => ({
    run() {
        chai_1.expect(process.exitCode).to.equal(code);
        throw new Error(`Expected to exit with code ${code} but it ran without exiting`);
    },
    catch(ctx) {
        if (!ctx.error.oclif || ctx.error.oclif.exit === undefined)
            throw ctx.error;
        chai_1.expect(ctx.error.oclif.exit).to.equal(code);
    },
});
