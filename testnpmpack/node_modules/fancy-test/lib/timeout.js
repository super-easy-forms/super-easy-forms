"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (timeout) => {
    return {
        init(ctx) {
            ctx.timeout = timeout;
        },
    };
};
