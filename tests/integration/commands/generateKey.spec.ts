// import { parseJwk } from 'jose/jwk/parse'
import { readFile } from 'fs/promises';
import { executeCli } from '../../helpers/execute';

describe('generate-key', function () {
  describe('Happy Path', function () {
    it('should return a key pair in jwk format to stdout', async function () {
      const kid = 'avi';
      const { exitCode, message } = await executeCli(['generate-key', '-s', '-i', kid]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(message) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });

    it('should return a key pair in jwk format to a file', async function () {
      const kid = 'avi';
      const { exitCode, message } = await executeCli(['generate-key', '-i', kid, '-p', '/tmp/token-cli-test-workdir']);

      expect(exitCode).toEqual(0);
      expect(message).toEqual('');

      const privateKey = JSON.parse((await readFile('/tmp/token-cli-test-workdir/privateKey.jwk')).toString()) as unknown;
      const publicKey = JSON.parse((await readFile('/tmp/token-cli-test-workdir/publicKey.jwk')).toString()) as unknown;
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });

    it('should output to stdout by default', async function () {
      const kid = 'avi';
      const { exitCode, message } = await executeCli(['generate-key', '-i', kid]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(message) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid, alg: 'RSA256' });
      expect(publicKey).toMatchObject({ kid, alg: 'RSA256' });

      // await expect(parseJwk(privateKey)).resolves.not.toThrow();
      // await expect(parseJwk(publicKey)).resolves.not.toThrow();
    });
  });
  describe('Bad Path', function () {
    it("shouldn't be possible to both output to stdout and file", async function () {
      const kid = 'avi';
      const { exitCode } = await executeCli(['generate-key', '-s', '-i', kid, '-p', '/tmp/token-cli-test-workdir']);

      expect(exitCode).not.toEqual(0);
    });

    it('should exit with error code if kid is missing', async function () {
      const { exitCode } = await executeCli(['generate-key']);

      expect(exitCode).not.toEqual(0);
    });
  });
});
