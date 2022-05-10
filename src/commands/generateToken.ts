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
  t: string | undefined;
  a: string[] | undefined;
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
  // https://github.com/panva/jose/blob/1a3d31c467/src/lib/secs.ts
  // https://github.com/panva/jose/blob/1a3d31c46756d4190ccc0cb9f35fa9861808ad60/src/jwt/produce.ts
  yargs.option('t', { alias: 'ttl', type: 'string', description: '(optional) how much ttl from date.now' });
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
    description: '(optional) the map-colonies domains the client will be allowed to access (raster, 3D, etc)',
  });
  yargs.option('a', {
    alias: 'additional-data',
    type: 'array',
    array: true,
    description: 'additional data to add to token. must be in format: "<key>=<value>"',
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
    kid,
    argv.t,
    argv.a
  );

  process.stdout.write(token);
};
