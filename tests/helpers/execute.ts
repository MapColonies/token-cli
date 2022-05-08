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
  if (!stream.readable) {
    throw new Error('The parameter stream is not a readable stream');
  }
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
};

interface ExecuteReturn {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

async function handleProcessExitEvent(stderrPromise: Promise<string>, stdoutPromise: Promise<string>): Promise<{ stdout: string; stderr: string }> {
  const stderr = await stderrPromise;
  const stdout = await stdoutPromise;
  return { stderr, stdout };
}

export const executeCli = async (args: string[] = [], opts: { env: Env } = { env: undefined }): Promise<ExecuteReturn> => {
  const { env = undefined } = opts;
  const promise = new Promise<ExecuteReturn>((resolve, reject) => {
    const childProcess = createProcess('./src/index.ts', ['--progress=false', ...args], env);
    childProcess.stdin.setDefaultEncoding('utf-8');

    const stdoutPromise = readStream(childProcess.stdout);
    const stderrPromise = readStream(childProcess.stderr);
    childProcess.once('exit', (code) => {
      handleProcessExitEvent(stderrPromise, stdoutPromise)
        .then(({ stderr, stdout }) => {
          resolve({ exitCode: code, stdout, stderr });
        })
        .catch(() => {
          reject('read streams failed');
        });
    });
    childProcess.on('error', reject);
  });
  return promise;
};
