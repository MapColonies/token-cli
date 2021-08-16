import { readFile } from 'fs/promises';
import readline from 'readline';
import yargs from 'yargs';
import { parseJwk } from 'jose/jwk/parse';
import chalk from 'chalk';
import Ajv from 'ajv/dist/jtd';
import { jwkSchema } from '../schemas/jwk';
import { verifyToken } from '../crypto';

const ajv = new Ajv();
const jwkStringParser = ajv.compileParser(jwkSchema);

export interface VerifyArguments {
  [x: string]: unknown;
  f: string;
  token: string;
}

export const command = 'verify <jwk-path> <token>';

export const describe = 'verify that a token is signed by the provided key, and return its payload';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, VerifyArguments> = (yargs) => {
  yargs.option('f', { alias: ['public-key-file', 'key-file'], description: 'path to load the public key (in jwk format) from' });
  yargs.option('token', { alias: 't', description: 'the token to verify' });
  return yargs as unknown as yargs.Argv<VerifyArguments>;
};

export const handler = async (argv: VerifyArguments): Promise<void> => {
  const fileContent = await readFile(argv.f, 'utf-8');
  const jwk = jwkStringParser(fileContent);
  if (!jwk) {
    console.error(chalk.red('could not parse jwk.'));
    process.exit(1);
  }
  const publicKey = await parseJwk(jwk);
  const payload = await verifyToken(publicKey, argv.token);
  console.log(payload);
};
