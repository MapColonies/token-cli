import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import concatStream from 'concat-stream';

type Env = Record<string, string> | undefined;

const baseArgs = ['--require', 'ts-node/register'];

const createProcess = (processPath: string, args: string[] = [], env: Env = undefined): ChildProcessWithoutNullStreams => {
  args = [processPath].concat(args);

  return spawn('node', [...baseArgs, ...args], {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    env: { ...env, NODE_ENV: 'test', PATH: process.env.PATH },
    cwd: process.cwd(),
  });
};

export const executeCli = async (
  args: string[] = [],
  opts: { env: Env } = { env: undefined }
): Promise<{ message: string; exitCode: number | null }> => {
  const { env = undefined } = opts;
  const childProcess = createProcess('./src/index.ts', args, env);
  childProcess.stdin.setDefaultEncoding('utf-8');
  const promise = new Promise<{ message: string; exitCode: number | null }>((resolve, reject) => {
    // childProcess.stderr.once('data', (err: string) => {
    //   reject(err.toString());
    // });
    childProcess.once('exit', (code, signal) => {
      childProcess.stdout.pipe(
        concatStream((result) => {
          resolve({ exitCode: code, message: result.toString() });
        })
      );
    });
    childProcess.on('error', reject);
  });
  return promise;
};
