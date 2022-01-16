"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinify = void 0;
const promises_1 = require("timers/promises");
const ora_1 = __importDefault(require("ora"));
const spinify = async (func, options, ...args) => {
    let spinner = undefined;
    if (options.isEnabled) {
        spinner = ora_1.default(options.message).start();
        if (options.timeout !== undefined) {
            await promises_1.setTimeout(options.timeout);
        }
    }
    try {
        const returnValue = await func(...args);
        spinner?.stopAndPersist({ symbol: '✔️' });
        return returnValue;
    }
    catch (error) {
        spinner?.fail();
        throw error;
    }
};
exports.spinify = spinify;
//# sourceMappingURL=index.js.map