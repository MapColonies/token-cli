import { readFile } from 'fs/promises';
import path from 'path';
import { executeCli } from '../../helpers/execute';
import { FILE_STORAGE_DIR, KID } from '../../testConstants';

const EOL = '\n';

describe('generate-key', function () {
  describe('Happy Path', function () {
    it('should return a key pair in jwk format to stdout', async function () {
      const { exitCode, stdout } = await executeCli(['generate-key', '-s', '-i', KID]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(stdout) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid: KID, alg: 'RS256' });
      expect(publicKey).toMatchObject({ kid: KID, alg: 'RS256' });
    });

    it('should return a key pair in jwk format to a file', async function () {
      const { exitCode, stdout } = await executeCli(['generate-key', '-i', KID, '-p', FILE_STORAGE_DIR]);

      expect(exitCode).toEqual(0);
      expect(stdout).toEqual('');

      const privateKey = JSON.parse((await readFile(path.join(FILE_STORAGE_DIR, 'privateKey.jwk'))).toString()) as unknown;
      const publicKey = JSON.parse((await readFile(path.join(FILE_STORAGE_DIR, 'publicKey.jwk'))).toString()) as unknown;
      expect(privateKey).toMatchObject({ kid: KID, alg: 'RS256' });
      expect(publicKey).toMatchObject({ kid: KID, alg: 'RS256' });
    });

    it('should output to stdout by default', async function () {
      const { exitCode, stdout } = await executeCli(['generate-key', '-i', KID]);

      expect(exitCode).toEqual(0);

      const { privateKey, publicKey } = JSON.parse(stdout) as { publicKey: Record<string, unknown>; privateKey: Record<string, unknown> };
      expect(privateKey).toMatchObject({ kid: KID, alg: 'RS256' });
      expect(publicKey).toMatchObject({ kid: KID, alg: 'RS256' });
    });
  });

  describe('Bad Path', function () {
    it("shouldn't be possible to both output to stdout and file", async function () {
      const { exitCode, stderr } = await executeCli(['generate-key', '-s', '-i', KID, '-p', FILE_STORAGE_DIR]);
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
      const { exitCode, stderr } = await executeCli(['generate-key', '-i', KID, '-p', '/fsdasdasgxd']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('the path to the files is not valid');
    });
  });
});
