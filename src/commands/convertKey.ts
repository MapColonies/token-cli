/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import yargs from 'yargs';
import { spinify } from '../util';
import { readAndParseJWK, verifyToken } from '../crypto';
import jwkToPem from 'jwk-to-pem';
import { DEFAULT_SPIN_TIMEOUT } from '../constants';

export interface VerifyArguments {
  [x: string]: any;
  f: string;
  progress: boolean;
}

export const command = 'convert';

export const describe = 'convert a key to pem';

export const builder: yargs.CommandBuilder<{}, VerifyArguments> = (yargs) => {
  yargs.option('f', { alias: ['public-key-file', 'key-file'], description: 'path to load the public key (in jwk format) from', demandOption: true });
  return yargs as unknown as yargs.Argv<VerifyArguments>;
};

export const handler = async (argv: VerifyArguments): Promise<void> => {
  const { key: publicKey, kid } = await spinify(
    readAndParseJWK,
    { message: 'reading and parsing the public key', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    argv.f
  );
  const payload = await spinify(jwkToPem, { message: 'converting', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT }, publicKey, argv.p, kid);
  process.stdout.write(JSON.stringify(payload));
};
