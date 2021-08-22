import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import yargs from 'yargs';
import chalk from 'chalk';
import { spinify } from '../util';
import { generateKeyPair } from '../crypto';
import { DEFAULT_SPIN_TIMEOUT, PRIVATE_KEY_FILE_NAME, PUBLIC_KEY_FILE_NAME } from '../constants';

export interface GenerateKeyArguments {
  [x: string]: unknown;
  kid: string;
  s: boolean | undefined;
  p: string | undefined;
  progress: boolean;
}

export const command = 'generate-key';

export const describe = 'generate a new key pair for signing tokens';

// eslint-disable-next-line @typescript-eslint/ban-types
export const builder: yargs.CommandBuilder<{}, GenerateKeyArguments> = (yargs) => {
  yargs
    .option('i', { alias: ['id', 'kid'], description: 'The key id to assign to the key pair.', demandOption: true })
    .option('s', { alias: 'stdout', type: 'boolean', description: 'output key pairs to stdout in json format.' })
    .option('p', { alias: ['path', 'files-path'], type: 'string', description: 'folder path to save the key pair to.' })
    .conflicts('p', 's')
    .check((argv) => {
      if (argv.p !== undefined && (argv.p === '' || !existsSync(argv.p))) {
        throw new Error('the path to the files is not valid');
      }
      return true;
    });
  return yargs as yargs.Argv<GenerateKeyArguments>;
};

export const handler = async (argv: GenerateKeyArguments): Promise<void> => {
  const { privateKey, publicKey } = await spinify(
    generateKeyPair,
    { message: 'generating key', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT },
    argv.kid
  );

  const path = argv.p;
  if (path !== undefined) {
    try {
      await spinify(
        async () => {
          await writeFile(join(path, PUBLIC_KEY_FILE_NAME), JSON.stringify(publicKey), { encoding: 'utf-8' });
          await writeFile(join(path, PRIVATE_KEY_FILE_NAME), JSON.stringify(privateKey), { encoding: 'utf-8' });
        },
        { message: 'saving files', isEnabled: argv.progress, timeout: DEFAULT_SPIN_TIMEOUT }
      );
    } catch (error) {
      console.error(chalk.red('could not save files'));
      process.exit(1);
    }
  } else {
    process.stdout.write(JSON.stringify({ publicKey: publicKey, privateKey: privateKey }));
  }
};
