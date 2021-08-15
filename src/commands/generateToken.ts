import { readFile } from 'fs/promises';
import Ajv from 'ajv/dist/jtd';
import yargs from 'yargs';
import { parseJwk } from 'jose/jwk/parse';
import chalk from 'chalk';
import { generateToken } from '../crypto';
import { jwkSchema } from '../schemas/jwk';

const ajv = new Ajv();
const jwkStringParser = ajv.compileParser(jwkSchema);

export interface GenerateTokenArguments {
  [x: string]: unknown;
  'jwk-path': string;
  c: string;
  client: string;
  o: string[] | undefined;
}

export const command = 'generate-token <jwk-path>';

export const describe = 'generate a jwt token';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, GenerateTokenArguments> = (yargs) => {
  yargs.positional('jwk-path', { description: 'path to load the jwk from' });
  yargs.option('c', { alias: 'client', type: 'string', description: 'the name of the client', demandOption: true });
  yargs.option('o', {
    alias: 'origin',
    type: 'array',
    array: true,
    description: 'the domains that the client will be allowed to make requests from',
  });
  return yargs as yargs.Argv<GenerateTokenArguments>;
};

export const handler = async (argv: GenerateTokenArguments): Promise<void> => {
  const fileContent = await readFile(argv['jwk-path'], 'utf-8');

  const jwk = jwkStringParser(fileContent);

  if (!jwk) {
    console.error(chalk.red('could not parse jwk.'));
    process.exit(1);
  }

  const privateKey = await parseJwk(jwk);

  const token = await generateToken(privateKey, argv.client, argv.o);

  console.log(token);
};
