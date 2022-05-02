import yargs from 'yargs';
import { DEFAULT_SPIN_TIMEOUT } from '../constants';
import { generateToken, readAndParseJWK } from '../crypto';
import { spinify } from '../util';

export interface GenerateTokenArguments {
  [x: string]: unknown;
  f: string;
  c: string;
  client: string;
  o: string[] | undefined;
  t: string[] | undefined;
  progress: boolean;
  d: string[] | undefined;
}

export const command = 'generate-token';

export const describe = 'generate a jwt token';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, GenerateTokenArguments> = (yargs) => {
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
  yargs.option('d', {
    alias: 'additional-data',
    type: 'array',
    array: true,
    description: 'additional data to add to token. must be in format: "<key>=<value>"',
  });
  yargs.option('t', { alias: 'resource-types', type: 'array', array: true, description: 'the product types the client will be allowed to access' });
  return yargs as yargs.Argv<GenerateTokenArguments>;
};

export const handler = async (argv: GenerateTokenArguments): Promise<void> => {
  const { key: privateKey, kid } = await spinify(
    readAndParseJWK,
    { message: 'reading and parsing the private key', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    argv.f
  );

  const token = await spinify(
    generateToken,
    { message: 'generating token', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    privateKey,
    argv.client,
    argv.o,
    argv.t,
    kid,
    argv.d
  );

  process.stdout.write(token);
};
