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
  d: string[] | undefined;
  progress: boolean;
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
    alias: 'domains',
    type: 'array',
    array: true,
    description: 'the map-colonies domains the client will be allowed to access (raster, 3D, etc)',
  });
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
    argv.d,
    kid
  );

  process.stdout.write(token);
};
