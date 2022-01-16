"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../util");
const crypto_1 = require("../crypto");
const constants_1 = require("../constants");
exports.command = 'generate-key';
exports.describe = 'generate a new key pair for signing tokens';
// eslint-disable-next-line @typescript-eslint/ban-types
const builder = (yargs) => {
    yargs
        .option('i', { alias: ['id', 'kid'], description: 'The key id to assign to the key pair.', demandOption: true })
        .option('s', { alias: 'stdout', type: 'boolean', description: 'output key pairs to stdout in json format.' })
        .option('p', { alias: ['path', 'files-path'], type: 'string', description: 'folder path to save the key pair to.' })
        .conflicts('p', 's')
        .check((argv) => {
        if (argv.p !== undefined && (argv.p === '' || !fs_1.existsSync(argv.p))) {
            throw new Error('the path to the files is not valid');
        }
        return true;
    });
    return yargs;
};
exports.builder = builder;
const handler = async (argv) => {
    const { privateKey, publicKey } = await util_1.spinify(crypto_1.generateKeyPair, { message: 'generating key', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT }, argv.kid);
    const path = argv.p;
    if (path !== undefined) {
        try {
            await util_1.spinify(async () => {
                await promises_1.writeFile(path_1.join(path, constants_1.PUBLIC_KEY_FILE_NAME), JSON.stringify(publicKey), { encoding: 'utf-8' });
                await promises_1.writeFile(path_1.join(path, constants_1.PRIVATE_KEY_FILE_NAME), JSON.stringify(privateKey), { encoding: 'utf-8' });
            }, { message: 'saving files', isEnabled: argv.progress, timeout: constants_1.DEFAULT_SPIN_TIMEOUT });
        }
        catch (error) {
            console.error(chalk_1.default.red('could not save files'));
            process.exit(1);
        }
    }
    else {
        process.stdout.write(JSON.stringify({ publicKey: publicKey, privateKey: privateKey }));
    }
};
exports.handler = handler;
//# sourceMappingURL=generateKey.js.map