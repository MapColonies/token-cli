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

const readStream = async (stream: NodeJS.ReadableStream): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    stream.pipe(
      concatStream((result) => {
        resolve(result.toString());
      }).on('error', reject)
    );
  });
};

interface ExecuteReturn {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export const executeCli = async (args: string[] = [], opts: { env: Env } = { env: undefined }): Promise<ExecuteReturn> => {
  const { env = undefined } = opts;
  const childProcess = createProcess('./src/index.ts', ['--progress=false', ...args], env);
  childProcess.stdin.setDefaultEncoding('utf-8');
  const promise = new Promise<ExecuteReturn>((resolve, reject) => {
    childProcess.once('exit', (code) => {
      Promise.all([readStream(childProcess.stdout), readStream(childProcess.stderr)])
        .then(([stdout, stderr]) => resolve({ exitCode: code, stdout, stderr }))
        .catch(reject);
    });
    childProcess.on('error', reject);
  });
  return promise;
};
