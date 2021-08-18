// import { parseJwk } from 'jose/jwk/parse'
import { EOL } from 'os';
import { readFile } from 'fs/promises';
import { executeCli } from '../../helpers/execute';

describe('generate-key', function () {
  describe('Happy Path', function () {
    it('should return a key pair in jwk format to stdout', async function () {
      const kid = 'avi';
      const { exitCode, stdout } = await executeCli(['generate-key', '-s', '-i', kid]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(stdout) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });

    it('should return a key pair in jwk format to a file', async function () {
      const kid = 'avi';
      const { exitCode, stdout } = await executeCli(['generate-key', '-i', kid, '-p', '/tmp/token-cli-test-workdir']);

      expect(exitCode).toEqual(0);
      expect(stdout).toEqual('');

      const privateKey = JSON.parse((await readFile('/tmp/token-cli-test-workdir/privateKey.jwk')).toString()) as unknown;
      const publicKey = JSON.parse((await readFile('/tmp/token-cli-test-workdir/publicKey.jwk')).toString()) as unknown;
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });

    it('should output to stdout by default', async function () {
      const kid = 'avi';
      const { exitCode, stdout } = await executeCli(['generate-key', '-i', kid]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(stdout) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });
  });
  describe('Bad Path', function () {
    it("shouldn't be possible to both output to stdout and file", async function () {
      const kid = 'avi';
      const { exitCode, stderr } = await executeCli(['generate-key', '-s', '-i', kid, '-p', '/tmp/token-cli-test-workdir']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Arguments p and s are mutually exclusive');
    });

    it('should exit with error code if kid is missing', async function () {
      const { exitCode, stderr } = await executeCli(['generate-key']);

      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Missing required argument: i');
    });

    it("should exit with error code if file path doesn't exists", async function () {
      const kid = 'avi';
      const { exitCode, stderr } = await executeCli(['generate-key', '-i', kid, '-p', '/fsdasdasgxd']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('the path to the files is not valid');
    });
  });
});
