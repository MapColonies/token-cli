"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const constants_1 = require("../constants");
const crypto_1 = require("../crypto");
const util_1 = require("../util");
exports.command = 'generate-token';
exports.describe = 'generate a jwt token';
// eslint-disable-next-line @typescript-eslint/ban-types
const builder = (yargs) => {
    yargs.option('f', {
        alias: ['private-key-file', 'key-file'],
        description: 'path to load the private key (in jwk format) from',
        demandOption: true,
    });
    yargs.option('c', { alias: 'client', type: 'string', description: 'the name of the client', demandOption: true });
    yargs.option('o', {
        alias: 'origin',
        type: 'array',
        array: true,
        description: 'the domains that the client will be allowed to make requests from',
    });
    return yargs;
};
exports.builder = builder;
const handler = async (argv) => {
    const { key: privateKey, kid } = await util_1.spinify(crypto_1.readAndParseJWK, { message: 'reading and parsing the private key', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT }, argv.f);
    const token = await util_1.spinify(crypto_1.generateToken, { message: 'generating token', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT }, privateKey, argv.client, argv.o, kid);
    process.stdout.write(token);
};
exports.handler = handler;
//# sourceMappingURL=generateToken.js.map