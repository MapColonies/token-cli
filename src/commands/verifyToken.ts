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
  'jwk-path': string;
}

export const command = 'verify <jwk-path>';

export const describe = 'verify that a token is signed by the provided key, and return its payload';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, VerifyArguments> = (yargs) => {
  yargs.positional('jwk-path', { description: 'path to load the jwk from' });
  return yargs as unknown as yargs.Argv<VerifyArguments>;
};

export const handler = async (argv: VerifyArguments): Promise<void> => {
  const fileContent = await readFile(argv['jwk-path'], 'utf-8');
  const jwk = jwkStringParser(fileContent);
  if (!jwk) {
    console.error(chalk.red('could not parse jwk.'));
    process.exit(1);
  }
  const publicKey = await parseJwk(jwk);

  const rl = readline.createInterface({
    input: process.stdin,
  });

  const line = rl.line;
  console.log(line);
  rl.on('line', (l) => {
    console.log(l);
  });

  rl.question('please enter the token:\n', (token) => {
    verifyToken(publicKey, token)
      .then((payload) => {
        console.log(payload);
      })
      .catch((err) => {
        console.error(chalk.red('could not verify token'));
        console.error(chalk.red(err));
        process.exit(1);
      });
    rl.close();
  });
};
