import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import yargs from 'yargs';
import chalk from 'chalk';
import { spinify } from '../util';
import { generateKeyPair } from '../crypto';

export interface GenerateKeyArguments {
  [x: string]: unknown;
  id: string;
  s: boolean | undefined;
  f: string | undefined;
}

export const command = 'generate-key <id>';

export const describe = 'generate a new key pair for signing tokens';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, GenerateKeyArguments> = (yargs) => {
  yargs
    .positional('id', { alias: 'kid', description: 'The id to assign to the key pair.' })
    .option('s', { alias: 'stdout', type: 'boolean', description: 'output key pairs to stdout in json format.' })
    .option('f', { alias: 'file-path', type: 'string', description: 'folder path to save the key pair to.' })
    .conflicts('f', 's')
    .check((argv) => {
      if (argv.f !== undefined && (argv.f === '' || !existsSync(argv.f))) {
        throw new Error('file-path not valid');
      }
      return true;
    });
  return yargs as yargs.Argv<GenerateKeyArguments>;
};

export const handler = async (argv: GenerateKeyArguments): Promise<void> => {
  const { privateKey, publicKey } = await spinify(generateKeyPair, { message: 'generating key', timeout: 5000 });
  privateKey.kid = publicKey.kid = argv.id;
  privateKey.alg = publicKey.alg = 'RSA256';

  const path = argv.f;
  if (path !== undefined) {
    try {
      await spinify(
        async () => {
          await writeFile(join(path, 'publicKey.jwk'), JSON.stringify(publicKey), { encoding: 'utf-8' });
          await writeFile(join(path, 'privateKey.jwk'), JSON.stringify(privateKey), { encoding: 'utf-8' });
        },
        { message: 'saving files', timeout: 2000 }
      );
    } catch (error) {
      console.error(chalk.red('could not save files'));
      process.exit(1);
    }
  } else {
    console.log({ publicKey: publicKey, privateKey: privateKey });
  }
};
