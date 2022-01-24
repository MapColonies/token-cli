import yargs from 'yargs/yargs';
import * as generateKey from './commands/generateKey';
import * as signToken from './commands/generateToken';
import * as verifyToken from './commands/verifyToken';
import * as convertKey from './commands/convertKey';

const argsIndex = 2;

void yargs(process.argv.slice(argsIndex))
  .option('progress', { boolean: true, default: true, description: 'show progress of running commands' })
  .command<generateKey.GenerateKeyArguments>(generateKey)
  .command(signToken)
  .command(verifyToken)
  .command(convertKey)
  .strict()
  .usage('Usage: $0 <command> [options] :: note - each nested command got its own help page')
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;
