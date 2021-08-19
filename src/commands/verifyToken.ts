import yargs from 'yargs';
import { DEFAULT_SPIN_TIMEOUT } from '../constants';
import { readAndParseJWK, verifyToken } from '../crypto';
import { spinify } from '../util';

export interface VerifyArguments {
  [x: string]: unknown;
  f: string;
  token: string;
  progress: boolean;
}

export const command = 'verify';

export const describe = 'verify that a token is signed by the provided key, and return its payload';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, VerifyArguments> = (yargs) => {
  yargs.option('f', { alias: ['public-key-file', 'key-file'], description: 'path to load the public key (in jwk format) from', demandOption: true });
  yargs.option('token', { alias: 't', description: 'the token to verify', demandOption: true });
  return yargs as unknown as yargs.Argv<VerifyArguments>;
};

export const handler = async (argv: VerifyArguments): Promise<void> => {
  const { key: publicKey, kid } = await spinify(
    readAndParseJWK,
    { message: 'reading and parsing the public key', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    argv.f
  );
  const payload = await spinify(
    verifyToken,
    { message: 'verifying token', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    publicKey,
    argv.token,
    kid
  );
  process.stdout.write(JSON.stringify(payload));
};
