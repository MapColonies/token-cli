import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

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
  if (stream.readable) {
    return new Promise<string>((resolve, reject) => {
      let str = '';
      stream.setEncoding('utf-8');
      stream.on('data', (chunk) => {
        str += chunk;
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('end', () => {
        resolve(str);
      });
    });
  } else {
    return Promise.resolve('');
  }
};

interface ExecuteReturn {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export const executeCli = async (args: string[] = [], opts: { env: Env } = { env: undefined }): Promise<ExecuteReturn> => {
  const { env = undefined } = opts;
  const promise = new Promise<ExecuteReturn>((resolve, reject) => {
    const childProcess = createProcess('./src/index.ts', ['--progress=false', ...args], env);
    childProcess.stdin.setDefaultEncoding('utf-8');
    let stdout!: string, stderr!: string;
    const stdoutPromise = readStream(childProcess.stdout).then((value: undefined | string) => (stdout = value ?? ''));
    const stderrPromise = readStream(childProcess.stderr).then((value: undefined | string) => (stderr = value ?? ''));
    childProcess.once('exit', (code) => {
      stderrPromise
        .catch(() => {
          throw new Error('read stderr Stream failed');
        })
        .then(() => {
          stdoutPromise
            .catch(() => {
              throw new Error('read stdout Stream failed');
            })
            .then(() => {
              resolve({ exitCode: code, stdout, stderr });
            })
            .catch(() => 'obligatory catch');
        })
        .catch(() => 'obligatory catch');
    });
    childProcess.on('error', reject);
  });
  return promise;
};
