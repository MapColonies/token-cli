import yargs from 'yargs/yargs';
import * as generateKey from './commands/generateKey';
import * as signToken from './commands/generateToken';
import * as verifyToken from './commands/verifyToken';

const argsIndex = 2;

const argv = yargs(process.argv.slice(argsIndex))
  .command<generateKey.GenerateKeyArguments>(generateKey)
  .command(signToken)
  .command(verifyToken)
  .help().argv;
