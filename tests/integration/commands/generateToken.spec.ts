import { writeFile } from 'fs/promises';
import { EOL } from 'os';
import path from 'path';
import { executeCli } from '../../helpers/execute';
import { PRIVATE_KEY } from '../../keys';
import { CLIENT_NAME, FILE_STORAGE_DIR } from '../../testConstants';

const privateKeyPath = path.join(FILE_STORAGE_DIR, 'generateTokenPrivateKey.jwk');

describe('generate-token', function () {
  beforeAll(async () => {
    await writeFile(privateKeyPath, JSON.stringify(PRIVATE_KEY), { encoding: 'utf-8' });
  });
  describe('Happy Path', function () {
    it('should return a signed token', async function () {
      const { exitCode, stdout } = await executeCli(['generate-token', '-f', privateKeyPath, '-c', CLIENT_NAME, '-o', 'https://localhost:8080']);

      expect(exitCode).toEqual(0);
      expect(stdout.length).toBeGreaterThan(0);
    });

    it('should return a signed token when origin is omitted', async function () {
      const { exitCode, stdout } = await executeCli(['generate-token', '-f', privateKeyPath, '-c', CLIENT_NAME]);

      expect(exitCode).toEqual(0);
      expect(stdout.length).toBeGreaterThan(0);
    });

    it('should return a signed token when multiple origins are specified', async function () {
      const { exitCode, stdout } = await executeCli([
        'generate-token',
        '-f',
        privateKeyPath,
        '-c',
        CLIENT_NAME,
        '-o',
        'https://localhost:8080',
        '-o',
        'https://localhost:8080',
      ]);

      expect(exitCode).toEqual(0);
      expect(stdout.length).toBeGreaterThan(0);
    });
  });
  describe('Bad Path', function () {
    it('should exit with error code if client is missing', async function () {
      const { exitCode, stderr } = await executeCli(['generate-token', '-f', privateKeyPath, '-o', 'https://localhost:8080']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Missing required argument: c');
    });

    it('should exit with error code if file option is missing', async function () {
      const { exitCode, stderr } = await executeCli(['generate-token', '-c', CLIENT_NAME, '-o', 'https://localhost:8080']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Missing required argument: f');
    });

    it('should exit with error code if private key file doesn\t exist', async function () {
      const { exitCode, stderr } = await executeCli(['generate-token', '-f', '/dskdms.jwk', '-c', CLIENT_NAME, '-o', 'https://localhost:8080']);
      expect(exitCode).not.toEqual(0);

      expect(stderr).toMatch('no such file or directory');
    });

    it('should exit if private key is not valid', async function () {
      const badKeyPath = path.join(FILE_STORAGE_DIR, 'badKey.jwk');
      await writeFile(badKeyPath, JSON.stringify({ avi: 'avi' }), { encoding: 'utf-8' });

      const { exitCode, stderr } = await executeCli(['generate-token', '-f', badKeyPath, '-c', CLIENT_NAME, '-o', 'https://localhost:8080']);
      expect(exitCode).not.toEqual(0);

      expect(stderr).toMatch("Couldn't parse the content of the file into a valid jwk object");
    });
  });
});
