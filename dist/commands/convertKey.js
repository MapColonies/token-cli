"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const promises_1 = require("fs/promises");
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const jtd_1 = __importDefault(require("ajv/dist/jtd"));
const jwk_1 = require("../schemas/jwk");
exports.command = 'convert';
exports.describe = 'convert a key to pem';
// eslint-disable-next-line @typescript-eslint/ban-types
const builder = (yargs) => {
    yargs.option('f', { alias: ['public-key-file', 'key-file'], description: 'path to load the public key (in jwk format) from', demandOption: true });
    return yargs;
};
exports.builder = builder;
const handler = async (argv) => {
    // const {key} = await spinify(
    //   readAndParseJWK,
    //   { message: 'reading and parsing the public key', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    //   argv.f
    // );
    const ajv = new jtd_1.default();
    const jwkStringParser = ajv.compileParser(jwk_1.jwkSchema);
    const fileContent = await promises_1.readFile(argv.f, 'utf-8');
    const jwk = jwkStringParser(fileContent);
    if (jwk === undefined) {
        throw new Error();
    }
    const payload = jwk_to_pem_1.default(jwk);
    process.stdout.write(payload);
};
exports.handler = handler;
//# sourceMappingURL=convertKey.js.map