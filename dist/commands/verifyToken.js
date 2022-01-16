"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const constants_1 = require("../constants");
const crypto_1 = require("../crypto");
const util_1 = require("../util");
exports.command = 'verify';
exports.describe = 'verify that a token is signed by the provided key, and return its payload';
// eslint-disable-next-line @typescript-eslint/ban-types
const builder = (yargs) => {
    yargs.option('f', { alias: ['public-key-file', 'key-file'], description: 'path to load the public key (in jwk format) from', demandOption: true });
    yargs.option('token', { alias: 't', description: 'the token to verify', demandOption: true });
    return yargs;
};
exports.builder = builder;
const handler = async (argv) => {
    const { key: publicKey, kid } = await util_1.spinify(crypto_1.readAndParseJWK, { message: 'reading and parsing the public key', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT }, argv.f);
    const payload = await util_1.spinify(crypto_1.verifyToken, { message: 'verifying token', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT }, publicKey, argv.token, kid);
    process.stdout.write(JSON.stringify(payload));
};
exports.handler = handler;
//# sourceMappingURL=verifyToken.js.map